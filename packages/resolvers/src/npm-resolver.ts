import type { PackageMetadata, ScanTarget } from '@mcp-trust/core';
import { emptyResolveOutput, type ResolveOutput } from './types.js';

interface NpmDoc {
  name?: string;
  'dist-tags'?: Record<string, string>;
  versions?: Record<string, Record<string, unknown>>;
  repository?: unknown;
  homepage?: string;
  license?: unknown;
  bugs?: unknown;
}

/** Hard cap on the registry response we will buffer (packuments are normally
 * well under this; an adversarially version-spammed package could be huge). */
const MAX_REGISTRY_BYTES = 8 * 1024 * 1024;

/** Read a response body as JSON with a byte cap so a giant/streamed body cannot
 * OOM the scanner. Rejects early on Content-Length and again while streaming. */
export async function readCappedJson(res: Response, maxBytes: number): Promise<unknown> {
  const declared = Number(res.headers.get('content-length') ?? '');
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new Error(`registry response too large (${declared} bytes)`);
  }
  const reader = res.body?.getReader();
  if (!reader) return JSON.parse(await res.text());
  const chunks: Buffer[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new Error(`registry response exceeded ${maxBytes} bytes`);
      }
      chunks.push(Buffer.from(value));
    }
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function normalizeRepoUrl(repo: unknown): string | undefined {
  if (typeof repo === 'string') return repo;
  if (repo && typeof repo === 'object' && 'url' in (repo as Record<string, unknown>)) {
    const u = (repo as Record<string, unknown>).url;
    return typeof u === 'string' ? u : undefined;
  }
  return undefined;
}

/** Resolve npm package metadata from the public registry (best-effort, no throw). */
export async function resolveNpm(target: Extract<ScanTarget, { type: 'npm' }>, timeoutMs: number): Promise<ResolveOutput> {
  const out = emptyResolveOutput();
  const url = `https://registry.npmjs.org/${target.packageName.replace('/', '%2F')}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!res.ok) {
      out.notes.push(`npm registry returned ${res.status} for ${target.packageName}`);
      out.packageMetadataState = 'not_available';
      return out;
    }
    const doc = (await readCappedJson(res, MAX_REGISTRY_BYTES)) as NpmDoc;
    const version = target.version ?? doc['dist-tags']?.latest;
    const versionDoc = version ? doc.versions?.[version] : undefined;

    const scripts = (versionDoc?.scripts as Record<string, string> | undefined) ?? {};
    const installScripts = Object.entries(scripts)
      .filter(([name]) => /^(pre|post)?install$/.test(name) || name === 'prepare')
      .map(([name, value]) => ({ name, value: String(value) }));

    const repositoryUrl =
      normalizeRepoUrl(versionDoc?.repository) ?? normalizeRepoUrl(doc.repository);

    const metadata: PackageMetadata = {
      name: doc.name ?? target.packageName,
      version,
      repositoryUrl,
      homepage: typeof doc.homepage === 'string' ? doc.homepage : undefined,
      license: typeof doc.license === 'string' ? doc.license : undefined,
      installScripts,
    };
    out.metadata = metadata;
    out.packageMetadataState = 'completed';
  } catch (err) {
    out.notes.push(`npm resolution failed: ${err instanceof Error ? err.message : String(err)}`);
    out.packageMetadataState = 'not_available';
  } finally {
    clearTimeout(timer);
  }
  return out;
}
