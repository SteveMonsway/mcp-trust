import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { introspectStdioServer, introspectWithSdk } from '@mcp-trust/introspection';

const fx = (name: string) => fileURLToPath(new URL(`../../../fixtures/mcp/${name}`, import.meta.url));

/** Any C0/C1 control char except tab/newline/CR. */
function hasControlChars(s: string): boolean {
  for (const ch of s) {
    const n = ch.charCodeAt(0);
    if (n === 9 || n === 10 || n === 13) continue;
    if (n <= 31 || (n >= 127 && n <= 159)) return true;
  }
  return false;
}

describe('introspection hardening (malicious server → scanner)', () => {
  it('aborts a stdout flood on the byte cap instead of OOMing (bounded time & memory)', async () => {
    const before = process.memoryUsage().rss;
    const t0 = Date.now();
    const result = await introspectStdioServer({
      mode: 'host',
      command: 'node',
      args: ['server.js'],
      workdir: fx('mock-flood'),
      timeoutMs: 20_000,
    });
    const grewMB = (process.memoryUsage().rss - before) / (1024 * 1024);
    expect(result).toBeNull();
    expect(Date.now() - t0).toBeLessThan(15_000);
    expect(grewMB).toBeLessThan(300);
  }, 25_000);

  it('fails honestly when an advertised tools/list errors (never silently hides tools)', async () => {
    const result = await introspectStdioServer({
      mode: 'host',
      command: 'node',
      args: ['server.js'],
      workdir: fx('mock-hidden-tools'),
      timeoutMs: 10_000,
    });
    expect(result).toBeNull();
  }, 15_000);

  it('neutralizes ANSI / control chars in untrusted tool metadata', async () => {
    const result = await introspectStdioServer({
      mode: 'host',
      command: 'node',
      args: ['server.js'],
      workdir: fx('mock-evil-meta'),
      timeoutMs: 10_000,
    });
    expect(result).not.toBeNull();
    const tool = result!.map.tools[0]!;
    expect(hasControlChars(tool.name)).toBe(false);
    expect(hasControlChars(tool.description ?? '')).toBe(false);
    expect(tool.name.includes(String.fromCharCode(27))).toBe(false); // no ESC
  }, 15_000);

  it('overrides host identity env so USER/LOGNAME/SHELL do not leak to the server', async () => {
    const raw = await introspectWithSdk({
      command: 'node',
      args: ['server.js'],
      cwd: fx('mock-env-echo'),
      env: {
        PATH: process.env.PATH ?? '',
        HOME: fx('mock-env-echo'),
        USER: 'mcp-trust',
        LOGNAME: 'mcp-trust',
        SHELL: '/sbin/nologin',
        TERM: 'dumb',
      },
      timeoutMs: 10_000,
    });
    expect(raw).not.toBeNull();
    expect(raw!.serverInfo?.version).toBe('mcp-trust|mcp-trust|/sbin/nologin');
  }, 15_000);
});
