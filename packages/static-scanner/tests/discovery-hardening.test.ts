import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { discoverFiles } from '@mcp-trust/static-scanner';

let root: string;
let secret: string;

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'mcp-disc-'));
  secret = mkdtempSync(join(tmpdir(), 'mcp-secret-'));
  writeFileSync(join(secret, 'creds.js'), 'const AWS_SECRET="wJalrXUtnFEMI";');
  writeFileSync(join(root, 'server.js'), 'console.log(1);');
  // Hostile symlink pointing at a file outside the scan root.
  symlinkSync(join(secret, 'creds.js'), join(root, 'leak.js'));
  // Symlink to a directory outside the scan root.
  symlinkSync(secret, join(root, 'leakdir'));
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
  rmSync(secret, { recursive: true, force: true });
});

describe('discoverFiles hardening', () => {
  it('never reads through a symlink out of the workspace', () => {
    const { files } = discoverFiles(root);
    const paths = files.map((f) => f.path);
    expect(paths).toContain('server.js');
    expect(paths).not.toContain('leak.js');
    // And crucially, the secret content is not exfiltrated into any discovered file.
    expect(files.some((f) => f.content.includes('wJalrXUtnFEMI'))).toBe(false);
  });

  it('bounds a directory stuffed with many non-scannable entries', () => {
    const big = mkdtempSync(join(tmpdir(), 'mcp-big-'));
    for (let i = 0; i < 5000; i++) writeFileSync(join(big, `f${i}.txt`), 'x');
    const t0 = Date.now();
    const { files } = discoverFiles(big);
    expect(Date.now() - t0).toBeLessThan(3000);
    expect(files).toHaveLength(0); // none are scannable
    rmSync(big, { recursive: true, force: true });
  });

  it('records code languages it cannot analyze (e.g. Go, Rust) without loading them', () => {
    const poly = mkdtempSync(join(tmpdir(), 'mcp-poly-'));
    writeFileSync(join(poly, 'main.go'), 'package main');
    writeFileSync(join(poly, 'lib.rs'), 'fn main(){}');
    writeFileSync(join(poly, 'notes.txt'), 'ignore me'); // non-code, must NOT be reported
    writeFileSync(join(poly, 'server.js'), 'console.log(1)');
    const { files, unanalyzedLanguages } = discoverFiles(poly);
    expect(files.map((f) => f.path)).toContain('server.js'); // analyzable code loaded
    expect(files.some((f) => f.path === 'main.go' || f.path === 'lib.rs')).toBe(false); // not loaded
    expect(unanalyzedLanguages).toEqual(['Go', 'Rust']); // sorted, deduped, no 'txt'
  });

  it('does not stack-overflow on deep nesting', () => {
    const deep = mkdtempSync(join(tmpdir(), 'mcp-deep-'));
    let p = deep;
    for (let i = 0; i < 200; i++) {
      p = join(p, 'd');
      mkdirSync(p);
    }
    writeFileSync(join(p, 'server.js'), 'x');
    expect(() => discoverFiles(deep)).not.toThrow();
    rmSync(deep, { recursive: true, force: true });
  });
});
