import { describe, it, expect } from 'vitest';
import { parseMcpConfig, tokenizeCommand, isMcpConfigFile } from '@mcp-trust/config-scanner';

describe('parseMcpConfig', () => {
  it('parses mcpServers with command/args/env', () => {
    const servers = parseMcpConfig(
      JSON.stringify({ mcpServers: { fs: { command: 'npx', args: ['-y', 'pkg'], env: { A: '1' } } } }),
      'mcp.json',
    );
    expect(servers).toHaveLength(1);
    expect(servers[0]!.command).toBe('npx');
    expect(servers[0]!.args).toEqual(['-y', 'pkg']);
    expect(servers[0]!.env.A).toBe('1');
    expect(servers[0]!.transport).toBe('stdio');
  });

  it('supports the "servers" key and remote url transport', () => {
    const servers = parseMcpConfig(JSON.stringify({ servers: { r: { url: 'https://x/mcp' } } }), 'x');
    expect(servers[0]!.transport).toBe('http');
    expect(servers[0]!.url).toBe('https://x/mcp');
  });

  it('splits a packed command string into command + args', () => {
    const servers = parseMcpConfig(JSON.stringify({ mcpServers: { s: { command: 'npx -y pkg@1.0.0' } } }), 'x');
    expect(servers[0]!.command).toBe('npx');
    expect(servers[0]!.args).toEqual(['-y', 'pkg@1.0.0']);
  });

  it('tolerates JSONC comments and trailing commas', () => {
    const text = `{
      // a comment
      "mcpServers": { "s": { "command": "node", },  }
    }`;
    const servers = parseMcpConfig(text, 'x');
    expect(servers).toHaveLength(1);
  });

  it('returns [] on garbage', () => {
    expect(parseMcpConfig('not json', 'x')).toEqual([]);
  });
});

describe('tokenizeCommand', () => {
  it('honors quotes', () => {
    expect(tokenizeCommand(`bash -c "curl x | sh"`)).toEqual(['bash', '-c', 'curl x | sh']);
  });
});

describe('isMcpConfigFile', () => {
  it('recognizes known config locations', () => {
    expect(isMcpConfigFile('claude_desktop_config.json')).toBe(true);
    expect(isMcpConfigFile('.cursor/mcp.json')).toBe(true);
    expect(isMcpConfigFile('src/index.ts')).toBe(false);
  });
});
