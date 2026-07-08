import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SemgrepNormalizedFinding } from '@mcp-trust/core';

/** Absolute path to the bundled MCP ruleset. The `.yml` ships next to the code
 * in several layouts, so we probe each and return the first that exists:
 *  - `src/`   (vitest):            `../rules/mcp-semgrep.yml`
 *  - `dist/`  (built pkg):         `../rules/mcp-semgrep.yml`
 *  - CLI bundle (tsup, all pkgs inlined into one file): the ruleset is copied to
 *    `dist/mcp-semgrep.yml`, i.e. right beside the bundle → `./mcp-semgrep.yml`.
 * Without this, a bundled CLI (npm install / GitHub Action) would look beside the
 * bundle, not find the ruleset, and Semgrep would silently report not_available. */
export function defaultRulesetPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, '../rules/mcp-semgrep.yml'), // src + built static-scanner package
    join(here, 'mcp-semgrep.yml'), // CLI bundle: copied beside dist/index.js
    join(here, 'rules/mcp-semgrep.yml'), // fallback: rules/ dir beside the bundle
  ];
  return candidates.find((p) => existsSync(p)) ?? candidates[0]!;
}

// Resource caps applied to the untrusted target scan.
const DEFAULT_OVERALL_TIMEOUT_MS = 120_000; // hard wall-clock kill for the whole run
const DEFAULT_PER_RULE_TIMEOUT_SEC = 10; // per rule/file inside semgrep
const DEFAULT_MAX_MEMORY_MB = 1024; // per rule/file
const DEFAULT_MAX_TARGET_BYTES = 1_000_000; // skip files larger than this
const DEFAULT_MAX_OUTPUT_BYTES = 16 * 1024 * 1024; // cap semgrep's JSON stdout

export interface RunSemgrepOptions {
  /** Directory to scan (materialized workspace root). */
  dir: string;
  rulesetPath?: string;
  overallTimeoutMs?: number;
  perRuleTimeoutSec?: number;
  maxMemoryMb?: number;
  maxTargetBytes?: number;
  maxOutputBytes?: number;
}

export interface SemgrepExecResult {
  status: number | null;
  stdout: string;
  stderr: string;
  error?: NodeJS.ErrnoException;
  timedOut?: boolean;
  outputTruncated?: boolean;
}

export interface SemgrepExecOptions {
  cwd: string;
  timeoutMs: number;
  maxBufferBytes: number;
  env: NodeJS.ProcessEnv;
}

/** Injectable process runner (real spawn by default; tests supply a fake). */
export type SemgrepExec = (bin: string, args: string[], opts: SemgrepExecOptions) => SemgrepExecResult;

export type SemgrepStatus = 'completed' | 'partial' | 'not_available' | 'error';

export interface SemgrepRunResult {
  status: SemgrepStatus;
  findings: SemgrepNormalizedFinding[];
  /** Number of scan-level errors semgrep reported (rule timeout, parse error). */
  ruleErrors: number;
  /** Matches dropped for missing required mcp_* metadata (fail-closed). */
  droppedMetadata: number;
  note?: string;
}

/** Minimal, offline env. No host secrets; HOME points at the temp dir so semgrep
 * cannot read host login/settings; UTF-8 forced so files decode deterministically. */
function semgrepEnv(): NodeJS.ProcessEnv {
  return {
    PATH: process.env.PATH ?? '',
    HOME: tmpdir(),
    PYTHONUTF8: '1',
    PYTHONIOENCODING: 'utf-8',
    SEMGREP_ENABLE_VERSION_CHECK: '0',
    SEMGREP_SEND_METRICS: 'off',
  };
}

const defaultExec: SemgrepExec = (bin, args, opts) => {
  const r = spawnSync(bin, args, {
    cwd: opts.cwd,
    timeout: opts.timeoutMs,
    killSignal: 'SIGKILL',
    maxBuffer: opts.maxBufferBytes,
    encoding: 'utf8',
    env: opts.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const err = r.error as NodeJS.ErrnoException | undefined;
  return {
    status: r.status,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
    error: err,
    timedOut: err?.code === 'ETIMEDOUT' || r.signal === 'SIGKILL',
    outputTruncated: err?.code === 'ENOBUFS',
  };
};

interface RawResult {
  check_id?: string;
  path?: string;
  start?: { line?: number; col?: number };
  end?: { line?: number };
  extra?: { metadata?: Record<string, unknown> };
}
interface RawOutput {
  results?: RawResult[];
  errors?: unknown[];
}

function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

function parseConfidence(v: unknown): number {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN;
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

/** Normalize one raw semgrep result. Returns null (dropped, fail-closed) if any
 * required mcp_* metadata field is missing. */
function normalize(r: RawResult): SemgrepNormalizedFinding | null {
  const md = r.extra?.metadata ?? {};
  const mcpId = asString(md.mcp_id);
  const title = asString(md.mcp_title);
  const category = asString(md.mcp_category);
  const severity = asString(md.mcp_severity);
  const impact = asString(md.mcp_impact);
  const remediation = asString(md.mcp_remediation);
  const file = asString(r.path);
  const line = r.start?.line;
  if (!mcpId || !title || !category || !severity || !impact || !remediation || !file || typeof line !== 'number') {
    return null;
  }
  const refs = Array.isArray(md.references) ? md.references.filter((x): x is string => typeof x === 'string') : [];
  return {
    checkId: asString(r.check_id) ?? mcpId,
    mcpId,
    title,
    category,
    severity,
    confidence: parseConfidence(md.mcp_confidence),
    capability: asString(md.mcp_capability),
    impact,
    remediation,
    cwe: asString(md.mcp_cwe),
    minNeedsReview: md.mcp_min_needs_review === 'true' || md.mcp_min_needs_review === true,
    references: refs,
    file,
    line,
    column: r.start?.col ?? 1,
    endLine: r.end?.line,
  };
}

/**
 * Run the bundled Semgrep ruleset over `dir`. Fully offline, no telemetry, no
 * in-code suppression (a hostile target cannot silence findings via `nosemgrep`),
 * resource-capped, and byte-capped output. Never throws: any failure degrades to
 * a `not_available` / `partial` / `error` status so coverage stays honest.
 */
export function runSemgrep(opts: RunSemgrepOptions, exec: SemgrepExec = defaultExec): SemgrepRunResult {
  const rulesetPath = opts.rulesetPath ?? defaultRulesetPath();
  const perRule = opts.perRuleTimeoutSec ?? DEFAULT_PER_RULE_TIMEOUT_SEC;
  const args = [
    'scan',
    '--config',
    rulesetPath,
    '--json',
    '--quiet',
    '--metrics',
    'off',
    '--disable-nosem',
    '--no-git-ignore',
    '--jobs',
    '1',
    '--timeout',
    String(perRule),
    '--timeout-threshold',
    '3',
    '--max-memory',
    String(opts.maxMemoryMb ?? DEFAULT_MAX_MEMORY_MB),
    '--max-target-bytes',
    String(opts.maxTargetBytes ?? DEFAULT_MAX_TARGET_BYTES),
    '.',
  ];

  let res: SemgrepExecResult;
  try {
    res = exec('semgrep', args, {
      cwd: opts.dir,
      timeoutMs: opts.overallTimeoutMs ?? DEFAULT_OVERALL_TIMEOUT_MS,
      maxBufferBytes: opts.maxOutputBytes ?? DEFAULT_MAX_OUTPUT_BYTES,
      env: semgrepEnv(),
    });
  } catch (err) {
    return { status: 'error', findings: [], ruleErrors: 0, droppedMetadata: 0, note: String(err) };
  }

  if (res.error?.code === 'ENOENT') {
    return { status: 'not_available', findings: [], ruleErrors: 0, droppedMetadata: 0, note: 'semgrep binary not found' };
  }
  if (res.timedOut) {
    return { status: 'partial', findings: [], ruleErrors: 0, droppedMetadata: 0, note: 'semgrep timed out; partial scan' };
  }
  if (res.outputTruncated) {
    return { status: 'partial', findings: [], ruleErrors: 0, droppedMetadata: 0, note: 'semgrep output exceeded cap; discarded' };
  }

  let parsed: RawOutput;
  try {
    parsed = JSON.parse(res.stdout) as RawOutput;
  } catch {
    // No parseable JSON: a non-ENOENT error here means semgrep failed to run.
    const note = res.error ? `semgrep failed: ${res.error.message}` : 'semgrep produced no parseable output';
    return { status: 'error', findings: [], ruleErrors: 0, droppedMetadata: 0, note };
  }

  const findings: SemgrepNormalizedFinding[] = [];
  let dropped = 0;
  for (const r of parsed.results ?? []) {
    const nf = normalize(r);
    if (nf) findings.push(nf);
    else dropped += 1;
  }
  const ruleErrors = Array.isArray(parsed.errors) ? parsed.errors.length : 0;
  const status: SemgrepStatus = ruleErrors > 0 ? 'partial' : 'completed';
  return { status, findings, ruleErrors, droppedMetadata: dropped };
}
