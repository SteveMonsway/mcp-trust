import { spawnSync } from 'node:child_process';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve as resolvePath } from 'node:path';
import type { ScanTarget } from '@mcp-trust/core';
import { resolveDirectory } from './local-resolver.js';
import { emptyResolveOutput, type ResolveOutput } from './types.js';

function safeRemove(dir: string): void {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    /* best-effort cleanup */
  }
}

/** Resolve the scan root within the clone, rejecting path traversal — both the
 * lexical `../../etc` form AND symlink escapes (a hostile repo can commit
 * `link -> /` so `link/etc/passwd` lexically passes but resolves outside the
 * clone). We therefore compare REAL paths (symlinks resolved), not just strings. */
export function safeScanRoot(dest: string, path: string | undefined): string | null {
  let base: string;
  try {
    base = realpathSync(resolvePath(dest));
  } catch {
    return null;
  }
  if (!path) return base;
  const candidate = resolvePath(dest, path);
  // Lexical guard first (cheap, and covers non-existent paths).
  if (candidate !== resolvePath(dest) && !candidate.startsWith(resolvePath(dest) + '/')) return null;
  // Real-path guard: follow symlinks and require the target still lives inside
  // the clone. Rejects `link -> /etc` style host-file exfiltration.
  let real: string;
  try {
    real = realpathSync(candidate);
  } catch {
    return null; // path does not exist inside the clone
  }
  if (real !== base && !real.startsWith(base + '/')) return null;
  return real;
}

/** Resolve a GitHub target by shallow-cloning into a temp dir (best-effort). */
export function resolveGithub(target: Extract<ScanTarget, { type: 'github' }>, timeoutMs: number): ResolveOutput {
  const dest = mkdtempSync(join(tmpdir(), 'mcp-trust-'));

  // --filter=blob:limit caps blob size (partial clone) so a repo with a multi-GB
  // file can't fill the temp volume; the lfs.smudge/process overrides + env flag
  // neutralize a hostile `.lfsconfig`/`.gitattributes` that would otherwise make
  // checkout fetch an attacker-chosen URL (SSRF/exfil).
  const args = [
    '-c',
    'filter.lfs.smudge=cat',
    '-c',
    'filter.lfs.process=',
    '-c',
    'filter.lfs.required=false',
    'clone',
    '--depth',
    '1',
    '--filter=blob:limit=10m',
    '--no-tags',
  ];
  if (target.ref) args.push('--branch', target.ref);
  args.push(target.url, dest);

  // Minimal env: no host secrets, no host gitconfig (HOME dropped → no malicious
  // `insteadOf`), credential prompts disabled, git-lfs smudge skipped.
  const clone = spawnSync('git', args, {
    timeout: timeoutMs,
    stdio: 'ignore',
    env: {
      PATH: process.env.PATH ?? '',
      GIT_TERMINAL_PROMPT: '0',
      GCM_INTERACTIVE: 'never',
      GIT_LFS_SKIP_SMUDGE: '1',
      GIT_CONFIG_NOSYSTEM: '1',
    },
  });
  if (clone.status !== 0) {
    safeRemove(dest); // do not leak the temp dir on clone failure
    const out = emptyResolveOutput();
    out.notes.push(
      clone.error
        ? `git clone failed: ${clone.error.message}`
        : `git clone exited with status ${clone.status ?? 'unknown'} (private repo, network, or missing git)`,
    );
    out.metadata = { repositoryUrl: target.url };
    out.packageMetadataState = 'partial';
    return out;
  }

  const scanRoot = safeScanRoot(dest, target.path);
  if (scanRoot === null) {
    safeRemove(dest);
    const out = emptyResolveOutput();
    out.notes.push(`Refusing to scan outside the clone: target path "${target.path}" escapes the workspace.`);
    out.metadata = { repositoryUrl: target.url };
    out.packageMetadataState = 'partial';
    return out;
  }

  // try/finally so any throw between here and cleanup can't leak the temp clone.
  try {
    const out = resolveDirectory(scanRoot);
    out.metadata = { ...(out.metadata ?? {}), repositoryUrl: out.metadata?.repositoryUrl ?? target.url };
    if (out.packageMetadataState === 'not_available') out.packageMetadataState = 'partial';

    const rev = spawnSync('git', ['-C', dest, 'rev-parse', 'HEAD'], { timeout: 5000, encoding: 'utf8' });
    if (rev.status === 0 && typeof rev.stdout === 'string') {
      out.resolvedRef = rev.stdout.trim();
    }

    // GitHub targets are never introspected, so sourceDir is no longer needed.
    out.sourceDir = undefined;
    return out;
  } finally {
    // File contents are already loaded into memory; remove the temp clone.
    safeRemove(dest);
  }
}
