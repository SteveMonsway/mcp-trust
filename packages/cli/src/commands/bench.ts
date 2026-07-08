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
        writeFileSync(join(outDir, `${r.slug}.md`), renderMarkdown(result));
        writeFileSync(join(outDir, `${r.slug}.html`), renderHtml(result));
        t.reportMd = `${r.slug}.md`;
        t.reportHtml = `${r.slug}.html`;
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

  process.stderr.write(
    `Rendered ${rendered} report pair(s) (md + html) and index.json into ${outDir}\n`,
  );
  return 0;
}

function safeReaddir(dir: string): string[] {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
