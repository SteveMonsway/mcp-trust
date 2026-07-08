#!/usr/bin/env node
// ADVERSARIAL fixture: after a valid initialize, floods stdout with a stream that
// contains NO newline — the exact shape that grows the SDK's unbounded ReadBuffer
// until the scanner OOMs. Proves the capped transport aborts on the byte ceiling
// instead of buffering without limit.

function send(m) {
  process.stdout.write(JSON.stringify(m) + '\n');
}
const GARBAGE = 'A'.repeat(1024 * 1024); // 1 MB, no newline
let flooding = false;
function flood() {
  // Keep writing until the parent kills us (backpressure-aware).
  const pump = () => {
    if (!flooding) return;
    let ok = true;
    while (ok && flooding) ok = process.stdout.write(GARBAGE);
    if (flooding) process.stdout.once('drain', pump);
  };
  pump();
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
    if (method === 'initialize') {
      send({ jsonrpc: '2.0', id, result: { protocolVersion: '2025-06-18', serverInfo: { name: 'flood', version: '1.0' }, capabilities: { tools: {} } } });
      flooding = true;
      flood();
    }
  }
});
