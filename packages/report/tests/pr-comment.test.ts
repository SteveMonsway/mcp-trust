import { describe, it, expect } from 'vitest';
import { renderPrComment, PR_COMMENT_MARKER } from '@mcp-trust/report';
import type { Finding, ScanResult } from '@mcp-trust/core';

const ESC = String.fromCharCode(27);

function baseResult(findings: Finding[], decision: ScanResult['score']['decision'] = 'BLOCK'): ScanResult {
  return {
    schemaVersion: '1.0',
    scanner: { name: 'mcp-trust', version: '0.3.0' },
    target: { type: 'config', path: '.cursor/mcp.json' },
    locator: 'config:.cursor/mcp.json',
    summary: { overallScore: 88, risk: 'high', decision, confidence: 0.7, topReasons: [] },
    score: { overall: 88, risk: 'high', confidence: 0.7, decision, decisionReason: [], subscores: {} as never },
    findings,
    recommendedPolicy: [],
    coverage: {} as never,
    generatedAt: '2026-07-07T00:00:00Z',
    disclaimer: 'Not a guarantee of safety.',
  };
}

let idc = 0;
function mkFinding(over: Partial<Finding> = {}): Finding {
  idc += 1;
  return {
    id: `F-${idc}`,
    ruleId: 'MCP-CONFIG-001',
    title: 'Unpinned npx package',
    description: 'd',
    severity: 'high',
    confidence: 0.9,
    category: 'config',
    evidence: [{ source: 'config.server:x', file: '.cursor/mcp.json' }],
    impact: 'i',
    remediation: 'r',
    references: [],
    tags: [],
    fingerprint: `fp-${idc}`,
    ...over,
  };
}

describe('PR comment body', () => {
  it('renders decision, risk, detected configs and top findings with the update marker', () => {
    const body = renderPrComment(
      baseResult([
        mkFinding(),
        mkFinding({ ruleId: 'MCP-TOOL-004', title: 'Shell execution tool exposed', severity: 'critical' }),
      ]),
      'https://example.com/report',
    );
    expect(body.startsWith(PR_COMMENT_MARKER)).toBe(true);
    expect(body).toContain('MCP Trust Scan Result');
    expect(body).toContain('Decision: **BLOCK**');
    expect(body).toContain('Risk: **HIGH**');
    expect(body).toContain('MCP configs detected: `.cursor/mcp.json`');
    expect(body).toContain('MCP-TOOL-004');
    expect(body).toContain('[View full report](https://example.com/report)');
    // critical sorted above high
    const idxCrit = body.indexOf('MCP-TOOL-004');
    const idxHigh = body.indexOf('MCP-CONFIG-001');
    expect(idxCrit).toBeLessThan(idxHigh);
  });

  it('handles the no-findings case', () => {
    const body = renderPrComment(baseResult([], 'APPROVE'));
    expect(body).toContain('Decision: **APPROVE**');
    expect(body).toContain('No findings');
  });

  it('neutralizes injection in an untrusted finding title and config path', () => {
    const body = renderPrComment(
      baseResult([
        mkFinding({
          title: `evil\`code\` ${ESC}[31mred`,
          evidence: [{ source: 'config.server:x', file: `bad\`.json` }],
        }),
      ]),
    );
    expect(body).not.toContain('`code`'); // backtick neutralized inside code span
    expect(body).not.toContain(ESC); // ANSI escape stripped
  });
});
