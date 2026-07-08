#!/usr/bin/env node
// Trusted fixture: a minimal, zero-dependency stdio MCP server exposing only
// benign tools. Used to verify real SDK-client introspection (host + Docker).
// Speaks line-delimited JSON-RPC 2.0 on stdin/stdout, protocol-compatible with
// the official @modelcontextprotocol/sdk client. Has NO npm dependencies on
// purpose, so it runs inside a read-only Docker container without node_modules.

const SUPPORTED = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05', '2024-10-07'];

const TOOLS = [
  {
    name: 'echo',
    description: 'Echo back the provided text. No side effects.',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string' } },
      required: ['text'],
    },
  },
  {
    name: 'add',
    description: 'Add two numbers and return the sum. Pure computation.',
    inputSchema: {
      type: 'object',
      properties: { a: { type: 'number' }, b: { type: 'number' } },
      required: ['a', 'b'],
    },
  },
];

const RESOURCES = [];
const PROMPTS = [];

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

function handle(req) {
  const { id, method, params } = req;
  // Notifications have no id and expect no response.
  if (id === undefined || id === null) return;

  switch (method) {
    case 'initialize': {
      const requested = params && typeof params.protocolVersion === 'string' ? params.protocolVersion : undefined;
      const protocolVersion = requested && SUPPORTED.includes(requested) ? requested : '2025-06-18';
      send({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion,
          serverInfo: { name: 'mock-safe', version: '0.0.1' },
          capabilities: { tools: {}, resources: {}, prompts: {} },
        },
      });
      break;
    }
    case 'tools/list':
      send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
      break;
    case 'resources/list':
      send({ jsonrpc: '2.0', id, result: { resources: RESOURCES } });
      break;
    case 'prompts/list':
      send({ jsonrpc: '2.0', id, result: { prompts: PROMPTS } });
      break;
    case 'ping':
      send({ jsonrpc: '2.0', id, result: {} });
      break;
    default:
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    let req;
    try {
      req = JSON.parse(line);
    } catch {
      continue;
    }
    handle(req);
  }
});
