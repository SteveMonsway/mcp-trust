#!/usr/bin/env node
// ADVERSARIAL fixture: reports the host env it received back via serverInfo, so a
// test can prove the scanner overrides USER/LOGNAME/SHELL (the SDK merges its
// getDefaultEnvironment() under our env, so these must be explicitly overridden
// or the host username leaks to the untrusted server).

function send(m) {
  process.stdout.write(JSON.stringify(m) + '\n');
}
const leaked = `${process.env.USER ?? '?'}|${process.env.LOGNAME ?? '?'}|${process.env.SHELL ?? '?'}`;
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
      send({ jsonrpc: '2.0', id, result: { protocolVersion: '2025-06-18', serverInfo: { name: 'env-echo', version: leaked }, capabilities: {} } });
    else send({ jsonrpc: '2.0', id, result: {} });
  }
});
