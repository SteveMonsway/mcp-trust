// Intentionally vulnerable MCP server fixture for the Semgrep AST rules.
// Exercises patterns the regex rules do NOT cover. Do not run.
import vm from 'node:vm';

// MCP-SG-JS-002: dynamic require with a non-literal argument.
export function loadPlugin(name) {
  return require(name);
}

// MCP-SG-JS-003: dynamic code evaluation (also covered by regex CODE-003).
export function compute(expr) {
  return eval(expr);
}

// MCP-SG-JS-004: code execution via the vm module (regex does not cover this).
export function runScript(src) {
  const script = new vm.Script(src);
  return script.runInThisContext();
}

// MCP-SG-JS-005: outbound request with a dynamic URL (SSRF / exfiltration).
export async function proxy(url) {
  return fetch(url);
}
