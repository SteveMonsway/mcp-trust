import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PackageMetadata } from '@mcp-trust/core';

function normalizeRepoUrl(repo: unknown): string | undefined {
  if (!repo) return undefined;
  if (typeof repo === 'string') return repo;
  if (typeof repo === 'object' && 'url' in (repo as Record<string, unknown>)) {
    const url = (repo as Record<string, unknown>).url;
    return typeof url === 'string' ? url : undefined;
  }
  return undefined;
}

/** Build PackageMetadata from a parsed package.json document. */
export function metadataFromPackageJson(pkg: Record<string, unknown>): PackageMetadata {
  const scripts = (pkg.scripts as Record<string, string> | undefined) ?? {};
  const installScripts = Object.entries(scripts)
    .filter(([name]) => /^(pre|post)?install$/.test(name) || name === 'prepare')
    .map(([name, value]) => ({ name, value: String(value) }));
  return {
    name: typeof pkg.name === 'string' ? pkg.name : undefined,
    version: typeof pkg.version === 'string' ? pkg.version : undefined,
    repositoryUrl: normalizeRepoUrl(pkg.repository),
    homepage: typeof pkg.homepage === 'string' ? pkg.homepage : undefined,
    license: typeof pkg.license === 'string' ? pkg.license : undefined,
    installScripts,
  };
}

/** Read directory-level metadata (package.json + SECURITY.md presence). */
export function metadataFromDir(dir: string): PackageMetadata | undefined {
  const pkgPath = join(dir, 'package.json');
  let md: PackageMetadata | undefined;
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as Record<string, unknown>;
      md = metadataFromPackageJson(pkg);
    } catch {
      md = undefined;
    }
  }
  const hasSecurity = ['SECURITY.md', 'security.md', '.github/SECURITY.md'].some((p) =>
    existsSync(join(dir, p)),
  );
  if (md) {
    md.hasSecurityPolicy = hasSecurity;
  } else if (existsSync(join(dir, 'pyproject.toml')) || existsSync(join(dir, 'setup.py'))) {
    // Python project without package.json: still record security-policy signal.
    md = { hasSecurityPolicy: hasSecurity };
  }
  return md;
}
