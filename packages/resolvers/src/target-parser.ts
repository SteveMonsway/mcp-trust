import { existsSync, statSync } from 'node:fs';
import { isAbsolute, resolve as resolvePath } from 'node:path';
import type { ScanTarget } from '@mcp-trust/core';

export type ParseResult =
  | { ok: true; target: ScanTarget }
  | { ok: false; reason: 'unsupported_target' | 'invalid_target'; message: string };

/** Parse a target string into a ScanTarget (Phase 1 supports github/npm/local/config). */
export function parseTarget(input: string): ParseResult {
  const raw = input.trim();
  if (!raw) return { ok: false, reason: 'invalid_target', message: 'Empty target' };

  // Explicit scheme prefixes
  if (raw.startsWith('npm:')) return parseNpm(raw.slice(4));
  if (raw.startsWith('github:')) return parseGithub(raw.slice(7));
  if (raw.startsWith('pypi:')) return unsupported('PyPI targets are not supported in Phase 1.');
  if (raw.startsWith('docker:')) return unsupported('Docker image targets are not supported in Phase 1.');

  // URLs
  if (/^https?:\/\//i.test(raw)) {
    const gh = /^https?:\/\/github\.com\/(.+)$/i.exec(raw);
    if (gh) return parseGithub(gh[1]!);
    return unsupported('Remote HTTP MCP endpoints are not supported in Phase 1.');
  }
  if (/^github\.com\//i.test(raw)) return parseGithub(raw.replace(/^github\.com\//i, ''));

  // Local filesystem path. In a pnpm workspace the CLI runs inside its package
  // dir, so resolve relative paths against INIT_CWD (where the user invoked us).
  const base = process.env.INIT_CWD ?? process.cwd();
  const abs = isAbsolute(raw) ? raw : resolvePath(base, raw);
  if (existsSync(abs)) {
    const st = statSync(abs);
    if (st.isFile() && /\.jsonc?$/i.test(abs)) {
      return { ok: true, target: { type: 'config', path: abs } };
    }
    return { ok: true, target: { type: 'local', path: abs } };
  }

  return {
    ok: false,
    reason: 'invalid_target',
    message: `Unrecognized target "${input}". Use github:owner/repo, npm:pkg, or a local path.`,
  };
}

function unsupported(message: string): ParseResult {
  return { ok: false, reason: 'unsupported_target', message };
}

function parseNpm(spec: string): ParseResult {
  if (!spec) return { ok: false, reason: 'invalid_target', message: 'Missing npm package name' };
  let packageName = spec;
  let version: string | undefined;
  if (spec.startsWith('@')) {
    const at = spec.indexOf('@', 1);
    if (at > 0) {
      packageName = spec.slice(0, at);
      version = spec.slice(at + 1);
    }
  } else {
    const at = spec.indexOf('@');
    if (at > 0) {
      packageName = spec.slice(0, at);
      version = spec.slice(at + 1);
    }
  }
  return { ok: true, target: { type: 'npm', packageName, version } };
}

function parseGithub(spec: string): ParseResult {
  // owner/repo, owner/repo/tree/ref/path...
  const clean = spec.replace(/\.git$/, '').replace(/\/$/, '');
  const parts = clean.split('/').filter(Boolean);
  if (parts.length < 2) {
    return { ok: false, reason: 'invalid_target', message: `Invalid GitHub target "${spec}"` };
  }
  const owner = parts[0]!;
  const repo = parts[1]!;
  let ref: string | undefined;
  let path: string | undefined;
  if (parts[2] === 'tree' || parts[2] === 'blob') {
    ref = parts[3];
    if (parts.length > 4) path = parts.slice(4).join('/');
  } else if (parts.length > 2) {
    path = parts.slice(2).join('/');
  }
  const url = `https://github.com/${owner}/${repo}`;
  return { ok: true, target: { type: 'github', owner, repo, ref, path, url } };
}
