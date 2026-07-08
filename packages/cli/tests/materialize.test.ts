import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, rmSync } from 'node:fs';
import { join, sep } from 'node:path';
import type { DiscoveredFile } from '@mcp-trust/core';
import { materializeFiles } from '../src/pipeline.js';

function file(path: string, content = 'x'): DiscoveredFile {
  return { path, language: 'javascript', content };
}

describe('materializeFiles (Semgrep staging for source-less targets)', () => {
  it('writes in-memory files to a temp dir at their relative paths', () => {
    const dir = materializeFiles([file('server.js', 'const a=1;'), file('src/tool.js', 'const b=2;')]);
    expect(dir).toBeTruthy();
    try {
      expect(readFileSync(join(dir!, 'server.js'), 'utf8')).toBe('const a=1;');
      expect(readFileSync(join(dir!, 'src', 'tool.js'), 'utf8')).toBe('const b=2;');
    } finally {
      rmSync(dir!, { recursive: true, force: true });
    }
  });

  it('skips a path-traversal entry so a hostile relative path cannot escape the temp root', () => {
    const dir = materializeFiles([file('ok.js', 'ok'), file('../escape.js', 'pwned')]);
    expect(dir).toBeTruthy();
    try {
      // The safe file landed inside the root.
      expect(existsSync(join(dir!, 'ok.js'))).toBe(true);
      // The traversal target must NOT exist next to the temp root.
      const parentEscape = join(dir!, '..', 'escape.js');
      expect(existsSync(parentEscape)).toBe(false);
      // Sanity: whatever was written stays under the temp root.
      expect(dir!.includes(`${sep}mcp-trust-sg-`)).toBe(true);
    } finally {
      rmSync(dir!, { recursive: true, force: true });
    }
  });

  it('returns undefined (and leaves nothing behind) when there is nothing writable', () => {
    const dir = materializeFiles([file('../only-escape.js', 'x')]);
    expect(dir).toBeUndefined();
  });
});
