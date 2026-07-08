import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { safeScanRoot, readCappedJson } from '@mcp-trust/resolvers';

describe('safeScanRoot (github scan-root traversal hardening)', () => {
  let clone: string;
  let outside: string;

  beforeAll(() => {
    clone = realpathSync(mkdtempSync(join(tmpdir(), 'mcp-clone-')));
    outside = realpathSync(mkdtempSync(join(tmpdir(), 'mcp-outside-')));
    writeFileSync(join(outside, 'creds.txt'), 'secret');
    mkdirSync(join(clone, 'sub'));
    writeFileSync(join(clone, 'sub', 'ok.js'), 'x');
    // Hostile symlink committed in the repo, pointing outside the clone.
    symlinkSync(outside, join(clone, 'link'));
  });
  afterAll(() => {
    rmSync(clone, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  });

  it('accepts a normal path inside the clone', () => {
    expect(safeScanRoot(clone, 'sub')).toBe(join(clone, 'sub'));
    expect(safeScanRoot(clone, undefined)).toBe(clone);
  });

  it('rejects lexical ../ traversal', () => {
    expect(safeScanRoot(clone, '../../etc')).toBeNull();
  });

  it('rejects a symlink that escapes the clone (real host-file exfil path)', () => {
    // Lexically `link/creds.txt` is inside the clone, but it resolves to the
    // outside secret dir — the realpath guard must reject it.
    expect(safeScanRoot(clone, 'link/creds.txt')).toBeNull();
    expect(safeScanRoot(clone, 'link')).toBeNull();
  });
});

describe('readCappedJson (npm registry response cap)', () => {
  it('parses a small JSON body', async () => {
    const res = new Response(JSON.stringify({ name: 'ok', v: 1 }), {
      headers: { 'content-type': 'application/json' },
    });
    expect(await readCappedJson(res, 1_000_000)).toEqual({ name: 'ok', v: 1 });
  });

  it('rejects a body whose Content-Length exceeds the cap', async () => {
    const big = '{"x":"' + 'a'.repeat(5000) + '"}';
    const res = new Response(big);
    await expect(readCappedJson(res, 100)).rejects.toThrow(/too large|exceeded/);
  });

  it('rejects a streamed body that exceeds the cap even without Content-Length', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const chunk = new TextEncoder().encode('a'.repeat(1024));
        for (let i = 0; i < 300; i++) controller.enqueue(chunk); // ~300 KB
        controller.close();
      },
    });
    const res = new Response(stream);
    await expect(readCappedJson(res, 64 * 1024)).rejects.toThrow(/exceeded|too large/);
  });
});
