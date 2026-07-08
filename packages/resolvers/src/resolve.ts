import type { ScanTarget } from '@mcp-trust/core';
import { resolveLocal, resolveConfigFile } from './local-resolver.js';
import { resolveNpm } from './npm-resolver.js';
import { resolveGithub } from './github-resolver.js';
import { emptyResolveOutput, type ResolveOutput } from './types.js';

/** Resolve a ScanTarget into a workspace (files, configs, metadata). Never throws. */
export async function resolve(target: ScanTarget, timeoutMs: number): Promise<ResolveOutput> {
  switch (target.type) {
    case 'config':
      return resolveConfigFile(target.path);
    case 'local':
      return resolveLocal(target.path);
    case 'npm':
      return resolveNpm(target, timeoutMs);
    case 'github':
      return resolveGithub(target, timeoutMs);
    default: {
      const out = emptyResolveOutput();
      out.notes.push(`Target type "${target.type}" is not supported in Phase 1.`);
      return out;
    }
  }
}
