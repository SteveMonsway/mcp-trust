import type { ParsedMcpServer } from '@mcp-trust/core';
import { parseJsonc } from './jsonc.js';
import { tokenizeCommand } from './command-parser.js';

function toStringRecord(obj: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (v == null) continue;
      out[k] = typeof v === 'string' ? v : String(v);
    }
  }
  return out;
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : String(x)));
  return [];
}

function normalizeServer(name: string, raw: unknown, configFile: string): ParsedMcpServer | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  let command = typeof r.command === 'string' ? r.command : undefined;
  let args = toStringArray(r.args);

  // Some configs pack the whole invocation into `command`.
  if (command && args.length === 0 && /\s/.test(command.trim())) {
    const tokens = tokenizeCommand(command.trim());
    command = tokens[0];
    args = tokens.slice(1);
  }

  const url = typeof r.url === 'string' ? r.url : typeof r.endpoint === 'string' ? r.endpoint : undefined;
  const transport: ParsedMcpServer['transport'] = url ? 'http' : command ? 'stdio' : 'unknown';

  return {
    name,
    command,
    args,
    env: toStringRecord(r.env),
    cwd: typeof r.cwd === 'string' ? r.cwd : undefined,
    url,
    headers: toStringRecord(r.headers),
    transport,
    configFile,
  };
}

/** Parse an MCP config document into server entries. */
export function parseMcpConfig(text: string, configFile: string): ParsedMcpServer[] {
  const doc = parseJsonc(text);
  if (!doc || typeof doc !== 'object') return [];
  const root = doc as Record<string, unknown>;
  const container =
    (root.mcpServers as Record<string, unknown> | undefined) ??
    (root.servers as Record<string, unknown> | undefined);
  if (!container || typeof container !== 'object') return [];

  const out: ParsedMcpServer[] = [];
  for (const [name, raw] of Object.entries(container)) {
    const server = normalizeServer(name, raw, configFile);
    if (server) out.push(server);
  }
  return out;
}

const CONFIG_BASENAMES = new Set([
  'claude_desktop_config.json',
  'mcp.json',
  '.mcp.json',
]);

/** Heuristic: does this file look like an MCP config we should parse? */
export function isMcpConfigFile(relPath: string): boolean {
  const base = relPath.replace(/\\/g, '/').split('/').pop() ?? '';
  if (CONFIG_BASENAMES.has(base)) return true;
  // .cursor/mcp.json, .vscode/mcp.json
  return /(?:^|\/)\.(cursor|vscode)\/mcp\.json$/.test(relPath.replace(/\\/g, '/'));
}
