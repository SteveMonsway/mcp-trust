import type { Decision, Finding, ScanResult } from '@mcp-trust/core';

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function decisionColor(d: Decision): string {
  switch (d) {
    case 'BLOCK':
      return C.red;
    case 'NEEDS_REVIEW':
      return C.magenta;
    case 'APPROVE_WITH_RESTRICTIONS':
      return C.yellow;
    default:
      return C.green;
  }
}

function sevColor(s: Finding['severity']): string {
  if (s === 'critical' || s === 'high') return C.red;
  if (s === 'medium') return C.yellow;
  return C.dim;
}

/** Strip ANSI/control sequences from untrusted strings (evidence locators can
 * carry a malicious tool name or repo filename) so they can't corrupt or spoof
 * the terminal when printed. */
function plain(s: string): string {
  return s
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b[@-_][0-?]*[ -/]*[@-~]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f\x7f-\x9f]/g, ' ');
}

export function renderConsole(result: ScanResult, useColor: boolean): string {
  const c = (code: string, text: string) => (useColor ? code + text + C.reset : text);
  const { score } = result;
  const lines: string[] = [];
  lines.push('');
  lines.push(c(C.bold, 'MCP Trust Report'));
  lines.push(`Risk: ${c(decisionColor(score.decision), score.risk.toUpperCase())}`);
  lines.push(`Decision: ${c(decisionColor(score.decision) + C.bold, score.decision)}`);
  lines.push(`Score: ${score.overall}/100   Confidence: ${Math.round(score.confidence * 100)}%`);
  lines.push('');

  const top = result.findings.slice(0, 8);
  if (top.length > 0) {
    lines.push(c(C.bold, 'Top findings:'));
    for (const f of top) {
      const ev = f.evidence[0];
      const loc = ev ? plain(`${ev.file ?? ev.source}${ev.line != null ? `:${ev.line}` : ''}`) : '';
      lines.push(`  ${c(sevColor(f.severity), `[${f.severity.toUpperCase()}]`)} ${f.ruleId}: ${plain(f.title)}`);
      if (loc) lines.push(`      ${c(C.dim, loc)}`);
    }
  } else {
    lines.push(c(C.green, 'No findings.'));
  }
  lines.push('');

  if (result.recommendedPolicy.length > 0) {
    lines.push(c(C.bold, 'Recommended policy:'));
    for (const p of result.recommendedPolicy) lines.push(`  - ${p}`);
    lines.push('');
  }

  lines.push(c(C.dim, `Coverage: introspection=${result.coverage.introspection}, static=${result.coverage.staticScan}, semgrep=${result.coverage.semgrep}, packageMetadata=${result.coverage.packageMetadata}`));
  const ri = result.runtimeIntrospection;
  if (ri) {
    const sb = ri.sandbox
      ? `${ri.sandbox.kind} (net=${ri.sandbox.network})`
      : ri.status.startsWith('failed')
        ? 'not executed'
        : 'host process';
    lines.push(
      c(C.dim, `Introspection: ${ri.status} via ${ri.client} [${sb}] — tools=${ri.toolsDiscovered}, resources=${ri.resourcesDiscovered}, prompts=${ri.promptsDiscovered}`),
    );
  }
  lines.push(c(C.dim, result.disclaimer));
  return lines.join('\n');
}
