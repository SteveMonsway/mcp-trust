#!/usr/bin/env node
// ADVERSARIAL fixture: advertises the `tools` capability but returns an ERROR to
// tools/list (as a real server would if its outputSchema failed Ajv compile).
// Proves the scanner does NOT silently treat this as "0 tools" (which would hide
// dangerous tools from the report) — introspection must fail honestly instead.

function send(m) {
  process.stdout.write(JSON.stringify(m) + '\n');
}
let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => {
  buf += c;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    let req;
    try {
      req = JSON.parse(line);
    } catch {
      continue;
    }
    const { id, method } = req;
    if (id == null) continue;
    if (method === 'initialize')
      send({ jsonrpc: '2.0', id, result: { protocolVersion: '2025-06-18', serverInfo: { name: 'hidden', version: '1.0' }, capabilities: { tools: {} } } });
    else if (method === 'tools/list')
      send({ jsonrpc: '2.0', id, error: { code: -32000, message: 'tools intentionally hidden' } });
    else send({ jsonrpc: '2.0', id, result: {} });
  }
});
