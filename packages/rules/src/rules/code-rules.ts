import {
  buildFinding,
  isSecretName,
  TAG_MIN_NEEDS_REVIEW,
  type DiscoveredFile,
  type Finding,
  type Rule,
  type ScanContext,
  type Severity,
} from '@mcp-trust/core';
import { findLineMatches, jsFiles, pythonFiles, type LineMatch } from '../util.js';

interface CodeHit {
  file: DiscoveredFile;
  line: number;
  column: number;
  text: string;
  match: string;
  dynamic: boolean;
}

/** Heuristic: does the matched call take a non-literal (dynamic) argument? */
function looksDynamic(lineText: string): boolean {
  // Bounded gap ({0,500}) instead of `[^)]*` to avoid quadratic backtracking on
  // a crafted line with many `(` and no matching token (ReDoS hardening).
  return /\(\s*[`'"]?[^)]{0,500}(\$\{|`|\+\s*\w|\bargs?\b|\binput\b|\bparams?\b|\breq\b|\bcmd\b|\bpath\b|\bfile\b|\burl\b)/.test(
    lineText,
  );
}

function toHit(file: DiscoveredFile, m: LineMatch): CodeHit {
  return { file, line: m.line, column: m.column, text: m.text, match: m.match, dynamic: looksDynamic(m.text) };
}

function scan(files: DiscoveredFile[], regex: RegExp): CodeHit[] {
  const hits: CodeHit[] = [];
  for (const file of files) {
    for (const m of findLineMatches(file.content, regex)) hits.push(toHit(file, m));
  }
  return hits;
}

/** True if `name` is imported/destructured from child_process in this file. */
function importsFromChildProcess(content: string, name: string): boolean {
  const re = new RegExp(
    // Bounded gaps ({0,300}) instead of `[^}]*` — this runs over full file
    // content, so unbounded gaps are quadratic on crafted input (ReDoS hardening).
    `(?:import\\s*\\{[^}]{0,300}\\b${name}\\b[^}]{0,300}\\}\\s*from\\s*['"](?:node:)?child_process['"])` +
      `|(?:\\{[^}]{0,300}\\b${name}\\b[^}]{0,300}\\}\\s*=\\s*require\\(\\s*['"](?:node:)?child_process['"]\\s*\\))`,
  );
  return re.test(content);
}

/**
 * Scan for a child_process function call with provenance:
 * - always match member calls `child_process.<fn>(` / `cp.<fn>(`;
 * - match a bare `<fn>(` only if the file actually imports it from child_process.
 * This avoids the huge false-positive of matching `regex.exec()` / `db.exec()`.
 */
function scanCpCall(files: DiscoveredFile[], fn: string): CodeHit[] {
  const hits: CodeHit[] = [];
  const member = new RegExp(`(?:child_process|cp)\\s*\\.\\s*${fn}\\s*\\(`);
  const bare = new RegExp(`(?<![.\\w])${fn}\\s*\\(`);
  for (const file of files) {
    const seen = new Set<number>();
    for (const m of findLineMatches(file.content, member)) {
      hits.push(toHit(file, m));
      seen.add(m.line);
    }
    if (importsFromChildProcess(file.content, fn)) {
      for (const m of findLineMatches(file.content, bare)) {
        if (seen.has(m.line)) continue;
        hits.push(toHit(file, m));
      }
    }
  }
  return hits;
}

function findingsFrom(
  rule: Rule,
  ctx: ScanContext,
  hits: CodeHit[],
  opts: { baseSeverity: Severity; dynamicSeverity?: Severity; baseConfidence: number; impact: string; minReviewOnDynamic?: boolean },
): Finding[] {
  return hits.map((h) => {
    const severity = h.dynamic && opts.dynamicSeverity ? opts.dynamicSeverity : opts.baseSeverity;
    const tags = h.dynamic && opts.minReviewOnDynamic ? [TAG_MIN_NEEDS_REVIEW] : undefined;
    return buildFinding({
      rule,
      target: ctx.target,
      severity,
      tags,
      evidence: [{ source: h.file.path, file: h.file.path, line: h.line, column: h.column, match: h.match.trim(), snippet: h.text }],
      confidence: h.dynamic ? Math.min(0.95, opts.baseConfidence + 0.05) : opts.baseConfidence,
      impact: opts.impact + (h.dynamic ? ' The argument appears to be dynamically constructed, raising injection risk.' : ''),
    });
  });
}

export const codeRules: Rule[] = [
  {
    id: 'MCP-CODE-001',
    title: 'child_process.exec usage',
    description: 'Uses child_process.exec(), which runs a command through a shell and is prone to command injection.',
    defaultSeverity: 'high',
    category: 'code',
    tags: ['code', 'shell'],
    appliesTo: ['code-js'],
    remediation: 'Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.',
    references: [{ title: 'CWE-78 OS Command Injection', url: 'https://cwe.mitre.org/data/definitions/78.html' }],
    falsePositiveNotes: 'Only matches child_process.exec member calls or `exec` imported from child_process — not RegExp.exec/db.exec.',
    evaluate(ctx) {
      return findingsFrom(this, ctx, scanCpCall(jsFiles(ctx), 'exec'), {
        baseSeverity: 'high',
        dynamicSeverity: 'critical',
        baseConfidence: 0.9,
        minReviewOnDynamic: true,
        impact: 'Enables arbitrary shell command execution with the process privileges.',
      });
    },
  },
  {
    id: 'MCP-CODE-002',
    title: 'Synchronous shell execution (execSync / spawnSync shell)',
    description: 'Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.',
    defaultSeverity: 'high',
    category: 'code',
    tags: ['code', 'shell', TAG_MIN_NEEDS_REVIEW],
    appliesTo: ['code-js'],
    remediation: 'Prefer spawnSync with an argument array and shell:false; validate inputs.',
    falsePositiveNotes: 'execSync gated by child_process provenance; spawnSync only when shell:true is present.',
    evaluate(ctx) {
      const hits = [
        ...scanCpCall(jsFiles(ctx), 'execSync'),
        ...scan(jsFiles(ctx), /spawnSync\s*\([^)]{0,500}shell\s*:\s*true/),
      ];
      return findingsFrom(this, ctx, hits, {
        baseSeverity: 'high',
        dynamicSeverity: 'critical',
        baseConfidence: 0.9,
        minReviewOnDynamic: true,
        impact: 'Enables arbitrary shell command execution.',
      });
    },
  },
  {
    id: 'MCP-CODE-003',
    title: 'Dynamic code evaluation (eval / Function)',
    description: 'Uses eval() or the Function constructor to execute dynamically constructed code.',
    defaultSeverity: 'high',
    category: 'code',
    tags: ['code', 'eval'],
    appliesTo: ['code-js'],
    remediation: 'Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.',
    references: [{ title: 'CWE-95 Eval Injection', url: 'https://cwe.mitre.org/data/definitions/95.html' }],
    falsePositiveNotes: 'Bare eval only (not obj.eval) to avoid method-call false positives.',
    evaluate(ctx) {
      const hits = scan(jsFiles(ctx), /(?<![.\w])eval\s*\(|\bnew\s+Function\s*\(/);
      return findingsFrom(this, ctx, hits, {
        baseSeverity: 'high',
        baseConfidence: 0.85,
        impact: 'Dynamically evaluated code can execute attacker-controlled logic.',
      });
    },
  },
  {
    id: 'MCP-CODE-004',
    title: 'Python shell execution (subprocess shell=True / os.system)',
    description: 'Runs a subprocess through a shell (shell=True) or via os.system, enabling command injection.',
    defaultSeverity: 'high',
    category: 'code',
    tags: ['code', 'shell', TAG_MIN_NEEDS_REVIEW],
    appliesTo: ['code-python'],
    remediation: 'Use subprocess with a list of arguments and shell=False; never pass untrusted input to a shell.',
    references: [{ title: 'CWE-78 OS Command Injection', url: 'https://cwe.mitre.org/data/definitions/78.html' }],
    evaluate(ctx) {
      const hits = scan(pythonFiles(ctx), /subprocess\.\w+\([^)]{0,500}shell\s*=\s*True|\bos\.system\s*\(|\bos\.popen\s*\(/);
      return findingsFrom(this, ctx, hits, {
        baseSeverity: 'high',
        dynamicSeverity: 'critical',
        baseConfidence: 0.9,
        minReviewOnDynamic: true,
        impact: 'Enables arbitrary shell command execution with the process privileges.',
      });
    },
  },
  {
    id: 'MCP-CODE-005',
    title: 'Arbitrary filesystem read',
    description: 'Reads files using a dynamically constructed path, allowing reads outside the intended scope.',
    defaultSeverity: 'medium',
    category: 'code',
    tags: ['code', 'filesystem'],
    appliesTo: ['code-js', 'code-python'],
    remediation: 'Resolve and validate paths against an allowlisted base directory before reading.',
    references: [{ title: 'CWE-22 Path Traversal', url: 'https://cwe.mitre.org/data/definitions/22.html' }],
    evaluate(ctx) {
      const js = scan(jsFiles(ctx), /\bfs\.(readFile|readFileSync|createReadStream)\s*\(/).filter((h) => h.dynamic);
      const py = scan(pythonFiles(ctx), /\bopen\s*\([^)]{0,500},\s*['"]r/).filter((h) => h.dynamic);
      return findingsFrom(this, ctx, [...js, ...py], {
        baseSeverity: 'medium',
        baseConfidence: 0.7,
        impact: 'A caller-controlled path can read sensitive files via path traversal.',
      });
    },
  },
  {
    id: 'MCP-CODE-006',
    title: 'Arbitrary filesystem write or delete',
    description: 'Writes or deletes files, potentially outside a scoped workspace.',
    defaultSeverity: 'high',
    category: 'code',
    tags: ['code', 'filesystem'],
    appliesTo: ['code-js', 'code-python'],
    remediation: 'Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.',
    falsePositiveNotes: 'Deletes are always high; writes are medium unless the path is dynamically constructed.',
    evaluate(ctx) {
      const deletes = [
        ...scan(jsFiles(ctx), /\bfs\.(rm|rmSync|unlink|unlinkSync|rmdir|rmdirSync)\s*\(/),
        ...scan(pythonFiles(ctx), /\bos\.remove\s*\(|\bos\.unlink\s*\(|\bshutil\.rmtree\s*\(/),
      ];
      const writes = [
        ...scan(jsFiles(ctx), /\bfs\.(writeFile|writeFileSync|appendFile|appendFileSync|createWriteStream)\s*\(/),
        ...scan(pythonFiles(ctx), /\bopen\s*\([^)]{0,500},\s*['"][wax]/),
      ];
      return [
        ...findingsFrom(this, ctx, deletes, {
          baseSeverity: 'high',
          baseConfidence: 0.8,
          impact: 'File deletion can destroy data outside the intended directory.',
        }),
        ...findingsFrom(this, ctx, writes, {
          baseSeverity: 'medium',
          dynamicSeverity: 'high',
          baseConfidence: 0.7,
          impact: 'File writes can modify data; a dynamic path can write outside the intended directory.',
        }),
      ];
    },
  },
  {
    id: 'MCP-CODE-007',
    title: 'Secret-like environment variable access',
    description: 'Reads environment variables whose names imply secrets (tokens, keys, passwords).',
    defaultSeverity: 'medium',
    category: 'code',
    tags: ['code', 'secret'],
    appliesTo: ['code-js', 'code-python'],
    remediation: 'Confirm the server needs these secrets; scope tokens narrowly and never log them.',
    evaluate(ctx) {
      const out: Finding[] = [];
      const jsHits = scan(jsFiles(ctx), /process\.env(?:\.([A-Za-z_][A-Za-z0-9_]*)|\[\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\])/);
      const pyHits = scan(pythonFiles(ctx), /os\.environ(?:\.get\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)|\[\s*['"]([A-Za-z_][A-Za-z0-9_]*))/);
      for (const h of [...jsHits, ...pyHits]) {
        const name = /([A-Za-z_][A-Za-z0-9_]*)\s*['"]?\]?\s*$/.exec(h.match)?.[1] ?? '';
        if (!isSecretName(name)) continue;
        out.push(
          buildFinding({
            rule: this,
            target: ctx.target,
            evidence: [{ source: h.file.path, file: h.file.path, line: h.line, column: h.column, match: h.match.trim(), snippet: h.text }],
            confidence: 0.7,
            impact: 'The server handles credentials; misuse or logging could leak them.',
          }),
        );
      }
      return out;
    },
  },
];
