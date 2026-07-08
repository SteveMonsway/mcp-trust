import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join as joinPath, resolve as resolvePath, sep } from 'node:path';
import {
  assembleScanResult,
  buildSemgrepFinding,
  defaultCoverage,
  resetFindingCounter,
  runRules,
  type CoverageState,
  type Finding,
  type ParsedMcpServer,
  type RuntimeIntrospection,
  type ScanContext,
  type ScanOptions,
  type ScanResult,
  type ScanTarget,
} from '@mcp-trust/core';
import { ALL_RULES } from '@mcp-trust/rules';
import { resolve } from '@mcp-trust/resolvers';
import { parseMcpConfig } from '@mcp-trust/config-scanner';
import { isSemgrepAvailable, isDockerAvailable, runSemgrep } from '@mcp-trust/static-scanner';
import { canIntrospect, introspectStdioServer, INTROSPECTION_CLIENT } from '@mcp-trust/introspection';
import { isCommandAllowed } from '@mcp-trust/sandbox';
import { buildStaticCapabilityMap, enrichIntrospectedMap, redactCapabilityMap } from './capability.js';

/** Optional instrumentation for {@link runScan}. `onPhase` is invoked once per
 * pipeline stage with the wall-clock milliseconds it took. Purely observational
 * — no behavior change, no effect on the result. Used by the benchmark runner. */
export interface ScanHooks {
  onPhase?: (name: ScanPhase, ms: number) => void;
}

export type ScanPhase = 'resolve' | 'config' | 'introspection' | 'rules' | 'semgrep' | 'assemble';

/** Full scan pipeline: resolve → parse configs → capabilities → rules → assemble. */
export async function runScan(target: ScanTarget, options: ScanOptions, hooks?: ScanHooks): Promise<ScanResult> {
  resetFindingCounter();
  const startedAt = new Date().toISOString();
  const coverage = defaultCoverage();

  // Time a phase and report it via the optional hook. Handles sync + async.
  const timed = async <T>(name: ScanPhase, fn: () => T | Promise<T>): Promise<T> => {
    const t0 = performance.now();
    try {
      return await fn();
    } finally {
      hooks?.onPhase?.(name, performance.now() - t0);
    }
  };

  const resolved = await timed('resolve', () => resolve(target, options.timeoutMs));
  coverage.packageMetadata = resolved.packageMetadataState;
  coverage.staticScan = resolved.staticState;

  const configs: ParsedMcpServer[] = [];
  for (const cf of resolved.configFiles) {
    configs.push(...parseMcpConfig(cf.content, cf.path));
  }
  const scannedWorkspace = resolved.sourceDir != null || resolved.configFiles.length > 0;
  coverage.configScan = scannedWorkspace ? 'completed' : 'not_available';
  const dockerAvailable = isDockerAvailable();
  coverage.docker = dockerAvailable ? 'disabled' : 'not_available';

  const ctx: ScanContext = {
    target,
    workspaceDir: resolved.sourceDir ?? '',
    startedAt,
    options,
    resolved: {
      target,
      sourceDir: resolved.sourceDir,
      metadata: resolved.metadata,
      resolvedRef: resolved.resolvedRef,
    },
    configs,
    files: resolved.files,
    metadata: resolved.metadata,
    coverage,
    logs: [],
  };
  for (const note of resolved.notes) {
    ctx.logs.push({ level: 'info', message: note, at: startedAt });
  }

  // --- Honest language coverage ---
  // If the target contains code in languages MCP Trust has no rules for (e.g. Go,
  // Rust), surface it as a limitation so an APPROVE / 0-findings result is not
  // misread as a clean bill. When there is NO analyzable JS/TS/Python at all, the
  // static scan only partially assessed the target — downgrade `completed`→`partial`.
  if (resolved.unanalyzedLanguages.length > 0) {
    const langs = resolved.unanalyzedLanguages.join(', ');
    const ANALYZABLE = new Set(['javascript', 'typescript', 'python']);
    const hasAnalyzableCode = resolved.files.some((f) => ANALYZABLE.has(f.language));
    const scope = hasAnalyzableCode ? 'Additionally, ' : '';
    ctx.limitations = [
      `${scope}${langs} source is present but was NOT analyzed — MCP Trust has code rules ` +
        `for JavaScript, TypeScript and Python only. Absence of code findings does not imply this server is safe.`,
    ];
    if (!hasAnalyzableCode && coverage.staticScan === 'completed') {
      coverage.staticScan = 'partial';
    }
    ctx.logs.push({ level: 'warn', message: `Unanalyzed code languages present: ${langs}.`, at: startedAt });
  }

  // --- Capability map: runtime introspection or static inference ---
  await timed('introspection', () => runIntrospection(ctx, options, dockerAvailable, startedAt));

  if (!ctx.capabilityMap) {
    ctx.capabilityMap = buildStaticCapabilityMap(ctx);
    coverage.capabilityInference = 'static_only';
  }

  const findings = await timed('rules', () => runRules(ALL_RULES, ctx));
  const semgrepFindings = await timed('semgrep', () => runSemgrepStage(ctx, options, findings));
  return timed('assemble', () => assembleScanResult(ctx, [...findings, ...semgrepFindings]));
}

/**
 * Run the bundled Semgrep ruleset over the materialized source and convert
 * matches to findings. Sets `coverage.semgrep` honestly:
 *  - no source / not opted in → left as-is ('not_available');
 *  - available but disabled by --no-semgrep → 'disabled';
 *  - ran clean → 'completed'; ran with rule errors/timeout/parse failure → 'partial';
 *  - binary absent → 'not_available'.
 * Semgrep matches that coincide (same file:line) with a regex code finding are
 * dropped in favor of the richer regex rule. Never throws.
 */
function runSemgrepStage(ctx: ScanContext, options: ScanOptions, existing: Finding[]): Finding[] {
  const coverage = ctx.coverage;

  // Determine a directory for Semgrep to read. Prefer the materialized source
  // dir (local targets). For github/npm targets the resolver nulls `sourceDir`
  // (and deletes its temp clone) so introspection can never run the server on
  // the host — but Semgrep only READS files, never executes them, so we stage
  // the already-loaded, capped in-memory `ctx.files` into a throwaway temp dir.
  // This runs AFTER introspection, so it cannot re-enable host execution.
  const onDisk = ctx.resolved?.sourceDir;
  if (!onDisk && ctx.files.length === 0) return []; // nothing to scan (config-only / metadata-only)

  if (options.semgrep === false) {
    if (isSemgrepAvailable()) coverage.semgrep = 'disabled';
    return [];
  }

  let stagedDir: string | undefined;
  const dir = onDisk ?? (stagedDir = materializeFiles(ctx.files));
  if (!dir) return []; // materialization produced nothing usable

  try {
    return runSemgrepAndConvert(ctx, dir, existing);
  } finally {
    if (stagedDir) rmSync(stagedDir, { recursive: true, force: true });
  }
}

/** Write the in-memory discovered files to a fresh temp dir at their relative
 * paths so Semgrep (which needs files on disk) can analyze exactly what the
 * regex rules saw. Path-traversal-guarded: any entry that would escape the temp
 * root is skipped. Returns undefined if nothing could be written. */
export function materializeFiles(files: ScanContext['files']): string | undefined {
  const root = mkdtempSync(joinPath(tmpdir(), 'mcp-trust-sg-'));
  let wrote = 0;
  for (const f of files) {
    const dest = resolvePath(root, f.path);
    if (dest !== root && !dest.startsWith(root + sep)) continue; // escapes temp root
    try {
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, f.content);
      wrote += 1;
    } catch {
      // skip unwritable entry; a single bad path must not abort the whole stage
    }
  }
  if (wrote === 0) {
    rmSync(root, { recursive: true, force: true });
    return undefined;
  }
  return root;
}

function runSemgrepAndConvert(ctx: ScanContext, dir: string, existing: Finding[]): Finding[] {
  const coverage = ctx.coverage;
  const run = runSemgrep({ dir });
  if (run.status === 'not_available') {
    coverage.semgrep = 'not_available';
    return [];
  }
  const statusMap: Record<'completed' | 'partial' | 'error', CoverageState> = {
    completed: 'completed',
    partial: 'partial',
    error: 'partial',
  };
  coverage.semgrep = statusMap[run.status];
  if (run.note) ctx.logs.push({ level: run.status === 'completed' ? 'info' : 'warn', message: `semgrep: ${run.note}`, at: ctx.startedAt });
  if (run.droppedMetadata > 0) {
    ctx.logs.push({ level: 'warn', message: `semgrep: dropped ${run.droppedMetadata} match(es) missing mcp metadata.`, at: ctx.startedAt });
  }

  // Line text lookup for evidence snippets (semgrep OSS does not return source).
  const contentByPath = new Map(ctx.files.map((f) => [f.path, f.content]));
  const occupied = new Set<string>();
  for (const f of existing) {
    for (const e of f.evidence) if (e.file && e.line != null) occupied.add(`${e.file}:${e.line}`);
  }

  const out: Finding[] = [];
  for (const nf of run.findings) {
    if (occupied.has(`${nf.file}:${nf.line}`)) continue; // regex rule already reported this line
    const content = contentByPath.get(nf.file);
    const snippet = content ? content.split(/\r?\n/)[nf.line - 1]?.trim() : undefined;
    out.push(buildSemgrepFinding({ ...nf, snippet }, ctx.target));
  }
  return out;
}

interface IntrospectionLaunch {
  command: string;
  args: string[];
  /** Host working dir / directory mounted read-only at /workspace in docker mode. */
  workdir: string;
}

/** Resolve the server startup command for introspection: explicit --mcp-command
 * override, else the first config server that declares a command. Requires a
 * materialized local workspace to run from / mount. */
function resolveIntrospectionLaunch(ctx: ScanContext, options: ScanOptions): IntrospectionLaunch | null {
  const workdir = ctx.resolved?.sourceDir;
  if (!workdir) return null;
  if (options.mcpCommand) {
    return { command: options.mcpCommand, args: options.mcpArgs ?? [], workdir };
  }
  const server = ctx.configs.find((s) => s.command);
  if (!server || !server.command) return null;
  return { command: server.command, args: server.args, workdir };
}

/** Run runtime introspection (host Level 1 for trusted fixtures, docker Level 2
 * otherwise) and record capability map + coverage. Never falls back to unsafe
 * host execution when a docker sandbox was requested but is unavailable. */
async function runIntrospection(
  ctx: ScanContext,
  options: ScanOptions,
  dockerAvailable: boolean,
  at: string,
): Promise<void> {
  const coverage = ctx.coverage;
  const policy = canIntrospect(ctx.target, { introspect: options.introspect, sandbox: options.sandbox });

  if (!policy.allowed) {
    coverage.introspection = policy.reason as typeof coverage.introspection;
    return;
  }
  if (options.noExec || !policy.mode) {
    coverage.introspection = 'skipped';
    return;
  }

  const launch = resolveIntrospectionLaunch(ctx, options);
  if (!launch) {
    coverage.introspection = 'skipped';
    ctx.logs.push({ level: 'warn', message: 'No runnable MCP server command found for introspection.', at });
    return;
  }

  if (policy.mode === 'docker') {
    if (!dockerAvailable) {
      coverage.introspection = 'failed_sandbox_unavailable';
      ctx.runtimeIntrospection = failedRuntime('failed_sandbox_unavailable');
      ctx.logs.push({
        level: 'error',
        message: 'Docker sandbox requested (--sandbox docker) but Docker is not available; refusing to run the server on the host.',
        at,
      });
      return;
    }
    if (!isCommandAllowed(launch.command)) {
      coverage.introspection = 'skipped';
      ctx.logs.push({
        level: 'warn',
        message: `Command "${launch.command}" is not allowed for sandboxed introspection (allowed: node, python, python3).`,
        at,
      });
      return;
    }
  }

  const result = await introspectStdioServer({
    mode: policy.mode,
    command: launch.command,
    args: launch.args,
    workdir: launch.workdir,
    timeoutMs: Math.min(options.timeoutMs, 30_000),
  });

  if (!result) {
    coverage.introspection = 'failed';
    ctx.runtimeIntrospection = failedRuntime('failed');
    ctx.logs.push({ level: 'warn', message: 'Introspection produced no capability map.', at });
    return;
  }

  // Redact before inference so capability evidence snippets are clean too.
  ctx.capabilityMap = enrichIntrospectedMap(redactCapabilityMap(result.map));
  coverage.capabilityInference = 'mcp_runtime_metadata';
  coverage.runtimeScan = 'partial';
  const status = policy.mode === 'docker' ? 'completed_sandboxed' : 'completed_trusted_fixture';
  coverage.introspection = status;
  ctx.runtimeIntrospection = {
    status,
    transport: 'stdio',
    client: INTROSPECTION_CLIENT,
    sandbox: result.sandbox,
    toolsDiscovered: result.map.tools.length,
    resourcesDiscovered: result.map.resources.length,
    promptsDiscovered: result.map.prompts.length,
  };
}

function failedRuntime(status: 'failed' | 'failed_sandbox_unavailable'): RuntimeIntrospection {
  return {
    status,
    transport: 'stdio',
    client: INTROSPECTION_CLIENT,
    toolsDiscovered: 0,
    resourcesDiscovered: 0,
    promptsDiscovered: 0,
  };
}
