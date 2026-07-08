import { readFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';
import { isMcpConfigFile } from '@mcp-trust/config-scanner';
import { discoverFiles } from '@mcp-trust/static-scanner';
import { metadataFromDir } from './metadata.js';
import { emptyResolveOutput, type ResolveOutput } from './types.js';

/** Resolve a directory into files + config files + metadata. Shared by local + github. */
export function resolveDirectory(dir: string): ResolveOutput {
  const out = emptyResolveOutput();
  out.sourceDir = dir;
  const { files, unanalyzedLanguages } = discoverFiles(dir);
  out.files = files;
  out.unanalyzedLanguages = unanalyzedLanguages;
  out.staticState = files.some((f) => f.language !== 'json') ? 'completed' : 'not_available';

  for (const f of files) {
    if (f.language === 'json' && isMcpConfigFile(f.path)) {
      out.configFiles.push({ path: f.path, content: f.content });
    }
  }

  const md = metadataFromDir(dir);
  if (md) {
    out.metadata = md;
    out.packageMetadataState = 'completed';
  }
  return out;
}

/** Resolve a bare config-file target. */
export function resolveConfigFile(path: string): ResolveOutput {
  const out = emptyResolveOutput();
  try {
    const content = readFileSync(path, 'utf8');
    out.configFiles.push({ path: basename(path), content });
  } catch (err) {
    out.notes.push(`Failed to read config: ${err instanceof Error ? err.message : String(err)}`);
  }
  return out;
}

/** Resolve a local path target (file or directory). */
export function resolveLocal(path: string): ResolveOutput {
  let st;
  try {
    st = statSync(path);
  } catch {
    const out = emptyResolveOutput();
    out.notes.push(`Path does not exist: ${path}`);
    return out;
  }
  if (st.isDirectory()) return resolveDirectory(path);

  // Single file: discover it as a code file, and if it's an MCP config, parse it too.
  const out = emptyResolveOutput();
  out.sourceDir = path;
  const { files, unanalyzedLanguages } = discoverFiles(path);
  out.files = files;
  out.unanalyzedLanguages = unanalyzedLanguages;
  out.staticState = files.some((f) => f.language !== 'json') ? 'completed' : 'not_available';
  for (const f of files) {
    if (f.language === 'json') out.configFiles.push({ path: f.path, content: f.content });
  }
  return out;
}
