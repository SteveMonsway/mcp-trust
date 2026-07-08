import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve as resolvePath } from 'node:path';
import yaml from 'js-yaml';
import {
  SCANNER_VERSION,
  type Decision,
  type RiskBand,
  type ScanOptions,
  type ScanResult,
} from '@mcp-trust/core';
import { parseTarget } from '@mcp-trust/resolvers';
import { isSemgrepAvailable } from '@mcp-trust/static-scanner';
import { renderMarkdown, renderHtml } from '@mcp-trust/report';
import { runScan, type ScanPhase } from '../pipeline.js';

// ---------------------------------------------------------------------------
// Public benchmark runner (TZ §14.3). Two decoupled steps so an expensive,
// network-bound live scan runs once and reports can be re-rendered cheaply:
//   bench scan <seed.yml>  → clones+scans every target, writes _raw/<slug>.json
//                            (full ScanResult) + _bench.json (per-phase timings)
//   bench render           → md + html per target + index.json (public index)
// github targets are never executed (static + Semgrep only); see sandboxing.md.
// ---------------------------------------------------------------------------

const PHASES: ScanPhase[] = ['resolve', 'config', 'introspection', 'rules', 'semgrep', 'assemble'];

interface SeedEntry {
  id: string;
  category?: string;
  source?: string;
  locator: string;
  expectedCapabilities?: string[];
}

interface BenchRecord {
  id: string;
  slug: string;
  locator: string;
  category?: string;
  expectedCapabilities?: string[];
  ok: boolean;
  error?: string;
  decision?: Decision;
  risk?: RiskBand;
  score?: number;
  findings?: number;
  topRules?: string[];
  /** Honest caveats (e.g. unanalyzed Go/Rust code), carried into index.json. */
  limitations?: string[];
  /** Wall-clock ms for the whole runScan call. */
  totalMs: number;
  /** Per-phase ms (subset of totalMs; excludes JS glue between phases). */
  phaseMs: Partial<Record<ScanPhase, number>>;
}

interface BenchFile {
  generatedAt: string;
  scanner: { name: string; version: string };
  environment: { node: string; platform: string; semgrep: boolean };
  count: number;
  records: BenchRecord[];
  summary: BenchSummary;
}

interface BenchSummary {
  ok: number;
  failed: number;
  byDecision: Record<string, number>;
  byRisk: Record<string, number>;
  timing: {
    totalWallMs: number;
    meanTotalMs: number;
    medianTotalMs: number;
    slowest: { id: string; totalMs: number }[];
    phaseMeanMs: Partial<Record<ScanPhase, number>>;
    phaseShareOfTotal: Partial<Record<ScanPhase, number>>;
  };
}

/** Sanitize a seed id into a filesystem-safe, collision-free slug. Slugging by
 * `id` (not by target) is required: two targets can share owner/repo (distinct
 * subpaths of one monorepo) and would otherwise collide on the same filename. */
function slugFromId(id: string): string {
  return id
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function invokeCwd(): string {
  return process.env.INIT_CWD ?? process.cwd();
}

/** Entry point for `mcp-trust bench <scan|render> ...`. Returns an exit code. */
export async function cmdBench(positionals: string[], flags: Map<string, string | boolean>): Promise<number> {
  const sub = positionals[0];
  const outFlag = typeof flags.get('out') === 'string' ? (flags.get('out') as string) : 'public-reports';
  const outDir = resolvePath(invokeCwd(), outFlag);

  if (sub === 'scan') {
    const seedArg = positionals[1];
    if (!seedArg) {
      process.stderr.write('Usage: mcp-trust bench scan <seed.yml> [--out public-reports]\n');
      return 3;
    }
    return benchScan(resolvePath(invokeCwd(), seedArg), outDir);
  }
  if (sub === 'render') {
    return benchRender(outDir);
  }
  process.stderr.write('Usage:\n  mcp-trust bench scan <seed.yml> [--out dir]\n  mcp-trust bench render [--out dir]\n');
  return 3;
}

function loadSeed(seedPath: string): SeedEntry[] {
  const raw = readFileSync(seedPath, 'utf8');
  const parsed = yaml.load(raw);
  if (!Array.isArray(parsed)) throw new Error('Seed file must be a YAML list of targets.');
  const seen = new Set<string>();
  const out: SeedEntry[] = [];
  for (const e of parsed) {
    if (!e || typeof e !== 'object') continue;
    const entry = e as Record<string, unknown>;
    const id = typeof entry.id === 'string' ? entry.id : undefined;
    const locator = typeof entry.locator === 'string' ? entry.locator : undefined;
    if (!id || !locator) {
      process.stderr.write(`Skipping malformed seed entry (needs id + locator): ${JSON.stringify(e)}\n`);
      continue;
    }
    const slug = slugFromId(id);
    if (seen.has(slug)) {
      process.stderr.write(`Skipping duplicate seed id/slug "${id}" (${slug}).\n`);
      continue;
    }
    seen.add(slug);
    out.push({
      id,
      locator,
      category: typeof entry.category === 'string' ? entry.category : undefined,
      source: typeof entry.source === 'string' ? entry.source : undefined,
      expectedCapabilities: Array.isArray(entry.expectedCapabilities)
        ? entry.expectedCapabilities.filter((x): x is string => typeof x === 'string')
        : undefined,
    });
  }
  return out;
}

async function benchScan(seedPath: string, outDir: string): Promise<number> {
  let seed: SeedEntry[];
  try {
    seed = loadSeed(seedPath);
  } catch (err) {
    process.stderr.write(`Failed to read seed "${seedPath}": ${err instanceof Error ? err.message : String(err)}\n`);
    return 3;
  }
  if (seed.length === 0) {
    process.stderr.write('Seed contains no valid targets.\n');
    return 3;
  }

  const rawDir = join(outDir, '_raw');
  mkdirSync(rawDir, { recursive: true });

  // Benchmark scans never execute the target: static + Semgrep only. Introspection
  // is off (github targets are never run anyway) and no report files are written
  // by runScan itself — we persist the raw ScanResult ourselves for the render step.
  const options: ScanOptions = {
    formats: [],
    failOn: 'high',
    noExec: true,
    introspect: false,
    sandbox: 'none',
    semgrep: true,
    timeoutMs: 90_000,
  };

  const records: BenchRecord[] = [];
  const wall0 = performance.now();
  let idx = 0;
  for (const entry of seed) {
    idx += 1;
    const slug = slugFromId(entry.id);
    process.stderr.write(`[${idx}/${seed.length}] ${entry.id}  (${entry.locator})\n`);

    const parsed = parseTarget(entry.locator);
    if (!parsed.ok) {
      records.push(baseRecord(entry, slug, 0, {}, `target parse failed: ${parsed.message}`));
      continue;
    }

    const phaseMs: Partial<Record<ScanPhase, number>> = {};
    const t0 = performance.now();
    let result: ScanResult;
    try {
      result = await runScan(parsed.target, options, {
        onPhase: (name, ms) => {
          phaseMs[name] = (phaseMs[name] ?? 0) + ms;
        },
      });
    } catch (err) {
      const totalMs = performance.now() - t0;
      records.push(baseRecord(entry, slug, totalMs, phaseMs, err instanceof Error ? err.message : String(err)));
      continue;
    }
    const totalMs = performance.now() - t0;

    writeFileSync(join(rawDir, `${slug}.json`), JSON.stringify(result, null, 2));
    records.push({
      ...baseRecord(entry, slug, totalMs, phaseMs),
      ok: true,
      decision: result.score.decision,
      risk: result.score.risk,
      score: result.score.overall,
      findings: result.findings.length,
      topRules: result.findings.slice(0, 5).map((f) => f.ruleId),
      limitations: result.limitations,
    });
  }
  const totalWallMs = performance.now() - wall0;

  const benchFile: BenchFile = {
    generatedAt: new Date().toISOString(),
    scanner: { name: 'mcp-trust', version: SCANNER_VERSION },
    environment: { node: process.version, platform: process.platform, semgrep: isSemgrepAvailable() },
    count: records.length,
    records,
    summary: summarize(records, totalWallMs),
  };
  writeFileSync(join(outDir, '_bench.json'), JSON.stringify(benchFile, null, 2));

  const s = benchFile.summary;
  process.stderr.write(
    `\nScanned ${records.length} targets in ${(totalWallMs / 1000).toFixed(1)}s — ` +
      `${s.ok} ok, ${s.failed} failed. Raw results in ${rawDir}\n` +
      `Now run: mcp-trust bench render --out ${outDir}\n`,
  );
  return 0;
}

function baseRecord(
  entry: SeedEntry,
  slug: string,
  totalMs: number,
  phaseMs: Partial<Record<ScanPhase, number>>,
  error?: string,
): BenchRecord {
  return {
    id: entry.id,
    slug,
    locator: entry.locator,
    category: entry.category,
    expectedCapabilities: entry.expectedCapabilities,
    ok: false,
    error,
    totalMs,
    phaseMs,
  };
}

function summarize(records: BenchRecord[], totalWallMs: number): BenchSummary {
  const ok = records.filter((r) => r.ok);
  const failed = records.length - ok.length;
  const byDecision: Record<string, number> = {};
  const byRisk: Record<string, number> = {};
  for (const r of ok) {
    if (r.decision) byDecision[r.decision] = (byDecision[r.decision] ?? 0) + 1;
    if (r.risk) byRisk[r.risk] = (byRisk[r.risk] ?? 0) + 1;
  }

  const totals = ok.map((r) => r.totalMs).sort((a, b) => a - b);
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const median = (xs: number[]) => (xs.length ? xs[Math.floor(xs.length / 2)]! : 0);

  const phaseMeanMs: Partial<Record<ScanPhase, number>> = {};
  const phaseShareOfTotal: Partial<Record<ScanPhase, number>> = {};
  const meanTotal = mean(totals);
  for (const p of PHASES) {
    const vals = ok.map((r) => r.phaseMs[p] ?? 0);
    const m = mean(vals);
    phaseMeanMs[p] = round2(m);
    phaseShareOfTotal[p] = meanTotal > 0 ? round2((m / meanTotal) * 100) : 0;
  }

  const slowest = [...ok]
    .sort((a, b) => b.totalMs - a.totalMs)
    .slice(0, 5)
    .map((r) => ({ id: r.id, totalMs: round2(r.totalMs) }));

  return {
    ok: ok.length,
    failed,
    byDecision,
    byRisk,
    timing: {
      totalWallMs: round2(totalWallMs),
      meanTotalMs: round2(meanTotal),
      medianTotalMs: round2(median(totals)),
      slowest,
      phaseMeanMs,
      phaseShareOfTotal,
    },
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

interface IndexTarget {
  id: string;
  slug: string;
  locator: string;
  category?: string;
  expectedCapabilities?: string[];
  ok: boolean;
  error?: string;
  decision?: Decision;
  risk?: RiskBand;
  score?: number;
  findings?: number;
  topRules?: string[];
  limitations?: string[];
  reportMd?: string;
  reportHtml?: string;
}

function benchRender(outDir: string): number {
  const benchPath = join(outDir, '_bench.json');
  let bench: BenchFile;
  try {
    bench = JSON.parse(readFileSync(benchPath, 'utf8')) as BenchFile;
  } catch (err) {
    process.stderr.write(
      `Cannot read ${benchPath}: ${err instanceof Error ? err.message : String(err)}\n` +
        `Run "mcp-trust bench scan <seed.yml> --out ${outDir}" first.\n`,
    );
    return 3;
  }

  const rawDir = join(outDir, '_raw');
  const reportsDir = join(outDir, 'reports');
  mkdirSync(reportsDir, { recursive: true });
  const available = new Set(safeReaddir(rawDir).filter((f) => f.endsWith('.json')));

  const targets: IndexTarget[] = [];
  let rendered = 0;
  for (const r of bench.records) {
    const t: IndexTarget = {
      id: r.id,
      slug: r.slug,
      locator: r.locator,
      category: r.category,
      expectedCapabilities: r.expectedCapabilities,
      ok: r.ok,
      error: r.error,
      decision: r.decision,
      risk: r.risk,
      score: r.score,
      findings: r.findings,
      topRules: r.topRules,
      limitations: r.limitations,
    };
    if (r.ok && available.has(`${r.slug}.json`)) {
      try {
        const result = JSON.parse(readFileSync(join(rawDir, `${r.slug}.json`), 'utf8')) as ScanResult;
        // Per-target reports go in a `reports/` subdir so the top-level folder stays
        // clean (README + index.html + index.json) even with thousands of targets.
        writeFileSync(join(reportsDir, `${r.slug}.md`), renderMarkdown(result));
        writeFileSync(join(reportsDir, `${r.slug}.html`), renderHtml(result));
        t.reportMd = `reports/${r.slug}.md`;
        t.reportHtml = `reports/${r.slug}.html`;
        rendered += 1;
      } catch (err) {
        t.error = `render failed: ${err instanceof Error ? err.message : String(err)}`;
      }
    }
    targets.push(t);
  }

  const index = {
    generatedAt: bench.generatedAt,
    scanner: bench.scanner,
    environment: bench.environment,
    count: targets.length,
    summary: bench.summary,
    targets,
  };
  writeFileSync(join(outDir, 'index.json'), JSON.stringify(index, null, 2));
  // A compact README (clean folder page) + a self-contained searchable HTML index
  // (scales to thousands of rows — client-side filter/sort, no server).
  writeFileSync(join(outDir, 'README.md'), renderIndexReadme(index));
  writeFileSync(join(outDir, 'index.html'), renderIndexHtml(index));

  process.stderr.write(
    `Rendered ${rendered} report pair(s) (md + html), index.json, README.md and index.html into ${outDir}\n`,
  );
  return 0;
}

const DECISION_ORDER = { BLOCK: 0, NEEDS_REVIEW: 1, APPROVE_WITH_RESTRICTIONS: 2, APPROVE: 3 } as const;
function sortTargets(targets: IndexTarget[]): IndexTarget[] {
  return [...targets].sort(
    (a, b) => (DECISION_ORDER[a.decision ?? 'APPROVE'] - DECISION_ORDER[b.decision ?? 'APPROVE']) || (b.score ?? 0) - (a.score ?? 0),
  );
}
function decisionCounts(targets: IndexTarget[]): Record<string, number> {
  const c: Record<string, number> = { BLOCK: 0, NEEDS_REVIEW: 0, APPROVE_WITH_RESTRICTIONS: 0, APPROVE: 0 };
  for (const t of targets) if (t.decision) c[t.decision] = (c[t.decision] ?? 0) + 1;
  return c;
}

/** Compact folder README: summary + the notable (BLOCK) rows, full list collapsed. */
function renderIndexReadme(index: { count: number; scanner: { version: string }; targets: IndexTarget[] }): string {
  const rows = sortTargets(index.targets);
  const c = decisionCounts(rows);
  const line = (t: IndexTarget) => {
    const src = (t.locator ?? '').replace(/^github\.com\//, '');
    const warn = t.limitations && t.limitations.length ? ' ⚠️' : '';
    return `| \`${t.id}\` | [${src}](https://${t.locator}) | ${t.decision}${warn} | ${t.risk} | ${t.score} | ${t.findings} | [md](reports/${t.slug}.md) · [html](reports/${t.slug}.html) |`;
  };
  const header = '| Server | Source | Decision | Risk | Score | Findings | Report |\n|---|---|---|---|---|---|---|';
  const blocks = rows.filter((t) => t.decision === 'BLOCK');
  const out: string[] = [];
  out.push('# Public benchmark reports', '');
  out.push(
    `Evidence-based scan reports for **${index.count} real public MCP servers** (JavaScript / TypeScript / Python), generated by [MCP Trust](../README.md) ${index.scanner.version}.`,
    '',
  );
  out.push(
    `**${c.BLOCK} BLOCK · ${c.NEEDS_REVIEW} NEEDS_REVIEW · ${c.APPROVE_WITH_RESTRICTIONS} APPROVE_WITH_RESTRICTIONS · ${c.APPROVE} APPROVE**`,
    '',
  );
  out.push(
    '> **BLOCK** = high-confidence capability evidence in the server’s runtime code to review before use — *not* a malware verdict. **NEEDS_REVIEW** = notable patterns worth a look. See [../docs/benchmark.md](../docs/benchmark.md).',
    '',
  );
  out.push('## 🔎 Browse');
  out.push(
    '- **Live searchable page:** <https://stevemonsway.github.io/mcp-trust/public-reports/index.html> (search / filter by decision / sort).',
    '- **Offline / local:** open [`index.html`](index.html) (self-contained). *(GitHub shows `.html` as source, not rendered — use the live page above.)*',
    '- **Jump to one server:** press <kbd>t</kbd> on GitHub and type its name → open `<server>.md`.',
    '- **Machine-readable:** [`index.json`](index.json).',
    '',
  );
  out.push(`## Runtime-command servers — review first (BLOCK, ${blocks.length})`);
  out.push(header, ...blocks.map(line), '');
  out.push('<details>', `<summary>Full list — all ${index.count} servers</summary>`, '');
  out.push(header, ...rows.map(line), '');
  out.push('</details>', '');
  out.push('_Regenerate: `pnpm scan:seed && pnpm reports:public`._');
  return out.join('\n') + '\n';
}

/** Self-contained, searchable HTML index — client-side filter/sort, scales to thousands. */
function renderIndexHtml(index: { count: number; scanner: { version: string }; targets: IndexTarget[] }): string {
  const c = decisionCounts(index.targets);
  const data = sortTargets(index.targets).map((t) => ({
    id: t.id,
    loc: t.locator,
    d: t.decision,
    r: t.risk,
    s: t.score ?? 0,
    f: t.findings ?? 0,
    slug: t.slug,
    w: t.limitations && t.limitations.length ? 1 : 0,
  }));
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>MCP Trust — ${index.count} public benchmark reports</title>
<style>
:root{color-scheme:light dark;--bg:#fff;--fg:#1a1d21;--muted:#5c636e;--border:#e2e5ea;--card:#f7f8fa;--BLOCK:#b42318;--NEEDS_REVIEW:#c4571b;--APPROVE_WITH_RESTRICTIONS:#9a7400;--APPROVE:#2e8b57}
@media(prefers-color-scheme:dark){:root{--bg:#14171a;--fg:#e6e9ee;--muted:#9aa3af;--border:#2a2f36;--card:#1b1f24;--BLOCK:#f0776a;--NEEDS_REVIEW:#e6975a;--APPROVE_WITH_RESTRICTIONS:#d9bd63;--APPROVE:#6cc38a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:1000px;margin:0 auto;padding:1.5rem 1rem 4rem}
h1{font-size:1.3rem;margin:0 0 .3rem}.sub{color:var(--muted);margin:0 0 1rem}
.controls{position:sticky;top:0;background:var(--bg);padding:.6rem 0;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;border-bottom:1px solid var(--border);z-index:2}
input[type=search]{flex:1;min-width:180px;padding:.5rem .7rem;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--fg);font-size:1rem}
.chip{cursor:pointer;border:1px solid var(--border);border-radius:999px;padding:.3rem .7rem;background:var(--card);color:var(--fg);font-size:.85rem;user-select:none}
.chip.off{opacity:.4}.chip b{font-weight:700}
table{border-collapse:collapse;width:100%;margin-top:.5rem;font-size:.9rem}
th,td{text-align:left;padding:.4rem .5rem;border-bottom:1px solid var(--border);vertical-align:top}
th{position:sticky;top:56px;background:var(--bg);cursor:pointer;user-select:none;white-space:nowrap}
th:hover{color:var(--muted)}
.d{font-weight:600;white-space:nowrap}
td a{color:var(--fg)}.muted{color:var(--muted)}
.count{color:var(--muted);font-size:.85rem;margin:.5rem 0}
.foot{margin-top:2rem;color:var(--muted);font-size:.8rem;border-top:1px solid var(--border);padding-top:1rem}
</style></head><body><div class="wrap">
<h1>MCP Trust — ${index.count} public MCP servers</h1>
<p class="sub">Evidence-based preflight scan reports (JS/TS/Python) · scanner ${index.scanner.version} · <a href="index.json">index.json</a> · <a href="../README.md">about</a></p>
<div class="controls">
<input type="search" id="q" placeholder="Search server or GitHub path…" autocomplete="off">
<span class="chip" data-d="BLOCK">BLOCK <b>${c.BLOCK}</b></span>
<span class="chip" data-d="NEEDS_REVIEW">NEEDS_REVIEW <b>${c.NEEDS_REVIEW}</b></span>
<span class="chip" data-d="APPROVE_WITH_RESTRICTIONS">AWR <b>${c.APPROVE_WITH_RESTRICTIONS}</b></span>
<span class="chip" data-d="APPROVE">APPROVE <b>${c.APPROVE}</b></span>
</div>
<div class="count" id="count"></div>
<table><thead><tr>
<th data-k="id">Server</th><th data-k="d">Decision</th><th data-k="r">Risk</th><th data-k="s">Score</th><th data-k="f">Findings</th><th>Report</th>
</tr></thead><tbody id="rows"></tbody></table>
<p class="foot">A <b>BLOCK</b> is capability evidence in runtime code to review — not a malware verdict. Reports open as Markdown (GitHub-rendered) or self-contained HTML.</p>
<script>
const DATA=${json};
const off=new Set();let sortK='';let sortDir=1;
const rowsEl=document.getElementById('rows'),cEl=document.getElementById('count'),q=document.getElementById('q');
function esc(s){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function render(){
  const term=q.value.trim().toLowerCase();
  let rows=DATA.filter(x=>!off.has(x.d)&&(!term||x.id.toLowerCase().includes(term)||(x.loc||'').toLowerCase().includes(term)));
  if(sortK){rows=rows.slice().sort((a,b)=>{const va=a[sortK],vb=b[sortK];return (va>vb?1:va<vb?-1:0)*sortDir})}
  cEl.textContent=rows.length+' of '+DATA.length+' servers';
  rowsEl.innerHTML=rows.map(x=>{
    const src=(x.loc||'').replace(/^github\\.com\\//,'');
    return '<tr><td><a href="https://'+esc(x.loc)+'">'+esc(x.id)+'</a><br><span class="muted">'+esc(src)+'</span></td>'+
    '<td class="d" style="color:var(--'+x.d+')">'+x.d+(x.w?' ⚠️':'')+'</td>'+
    '<td>'+esc(x.r)+'</td><td>'+x.s+'</td><td>'+x.f+'</td>'+
    '<td><a href="reports/'+esc(x.slug)+'.md">md</a> · <a href="reports/'+esc(x.slug)+'.html">html</a></td></tr>';
  }).join('');
}
q.addEventListener('input',render);
document.querySelectorAll('.chip').forEach(ch=>ch.addEventListener('click',()=>{const d=ch.dataset.d;if(off.has(d)){off.delete(d);ch.classList.remove('off')}else{off.add(d);ch.classList.add('off')}render()}));
document.querySelectorAll('th[data-k]').forEach(th=>th.addEventListener('click',()=>{const k=th.dataset.k;if(sortK===k)sortDir*=-1;else{sortK=k;sortDir=1}render()}));
render();
</script>
</div></body></html>
`;
}

function safeReaddir(dir: string): string[] {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
