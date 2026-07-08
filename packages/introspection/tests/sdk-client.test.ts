import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { introspectWithSdk, introspectStdioServer } from '@mcp-trust/introspection';

const mockSafeDir = fileURLToPath(new URL('../../../fixtures/mcp/mock-safe', import.meta.url));

describe('introspectWithSdk (official SDK client, host)', () => {
  it('handshakes with the zero-dep mock-safe server and lists tools', async () => {
    const raw = await introspectWithSdk({
      command: 'node',
      args: ['server.js'],
      cwd: mockSafeDir,
      env: { PATH: process.env.PATH ?? '', HOME: mockSafeDir },
      timeoutMs: 10_000,
    });
    expect(raw).not.toBeNull();
    expect(raw!.tools.map((t) => t.name).sort()).toEqual(['add', 'echo']);
    expect(raw!.resources).toHaveLength(0);
    expect(raw!.prompts).toHaveLength(0);
    expect(raw!.serverInfo?.name).toBe('mock-safe');
  });

  it('returns null when the server cannot be spawned', async () => {
    const raw = await introspectWithSdk({
      command: '/nonexistent/mcp-server-binary',
      args: [],
      timeoutMs: 3000,
    });
    expect(raw).toBeNull();
  });
});

describe('introspectStdioServer (host mode)', () => {
  it('maps discovery into a CapabilityMap with source=introspection', async () => {
    const result = await introspectStdioServer({
      mode: 'host',
      command: 'node',
      args: ['server.js'],
      workdir: mockSafeDir,
      timeoutMs: 10_000,
    });
    expect(result).not.toBeNull();
    expect(result!.map.source).toBe('introspection');
    expect(result!.map.tools).toHaveLength(2);
    expect(result!.sandbox).toBeUndefined();
  });
});
