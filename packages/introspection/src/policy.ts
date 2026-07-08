import type { ScanTarget, SandboxKind } from '@mcp-trust/core';
import type { IntrospectMode } from './stdio-introspector.js';

export interface IntrospectPolicy {
  allowed: boolean;
  /** Launch mode when allowed. */
  mode?: IntrospectMode;
  /** Pending/failure coverage reason. On success the pipeline records the
   * completed variant ('completed_trusted_fixture' | 'completed_sandboxed'). */
  reason: string;
}

function pathOf(target: ScanTarget): string | undefined {
  if (target.type === 'local' || target.type === 'config') return target.path;
  return undefined;
}

/** True if the path segments contain a trusted fixture location. Matches whole
 * path segments (not substrings) so `my-examples/…` is NOT treated as trusted. */
export function isTrustedFixturePath(p: string): boolean {
  const segs = p.split(/[\\/]/).filter(Boolean);
  for (let i = 0; i < segs.length; i++) {
    if (segs[i] === 'mock-mcp-servers') return true;
    if (segs[i] === 'examples') return true;
    if (segs[i] === 'fixtures' && segs[i + 1] === 'mcp') return true;
  }
  return false;
}

export function isTrustedTarget(target: ScanTarget): boolean {
  const p = pathOf(target);
  return p !== undefined && isTrustedFixturePath(p);
}

export interface IntrospectPolicyInput {
  introspect: boolean;
  sandbox: SandboxKind;
}

/**
 * Decide whether — and how — introspection may execute the server.
 *
 * - Without `--introspect`: never.
 * - `--sandbox docker`: allowed for any materialized local target (fixtures AND
 *   real cloned/local sources), run inside a locked-down container (Level 2).
 *   The pipeline still enforces the command allowlist and that a runnable
 *   workdir exists.
 * - No sandbox: only trusted fixture paths, run directly on the host (Level 1).
 * - A real target without a sandbox is refused (never executed on the host).
 */
export function canIntrospect(target: ScanTarget, opts: IntrospectPolicyInput): IntrospectPolicy {
  if (!opts.introspect) {
    return { allowed: false, reason: 'disabled' };
  }
  if (opts.sandbox === 'docker') {
    return { allowed: true, mode: 'docker', reason: 'completed_sandboxed' };
  }
  if (isTrustedTarget(target)) {
    return { allowed: true, mode: 'host', reason: 'completed_trusted_fixture' };
  }
  return { allowed: false, reason: 'skipped_real_target_no_sandbox' };
}
