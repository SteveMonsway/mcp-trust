import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '@mcp-trust/report';
import type { CapabilityMap, ScanResult } from '@mcp-trust/core';

function resultWithTool(name: string): ScanResult {
  const capabilityMap: CapabilityMap = {
    source: 'introspection',
    tools: [{ name, riskTags: [], inferredCapabilities: [] }],
    resources: [],
    prompts: [],
    aggregateCapabilities: [],
  };
  return {
    schemaVersion: '1.0',
    scanner: { name: 'mcp-trust', version: '0.1.0' },
    target: { type: 'local', path: '/x' },
    locator: 'local:/x',
    summary: { overallScore: 0, risk: 'low', decision: 'APPROVE', confidence: 1, topReasons: [] },
    score: { overall: 0, risk: 'low', confidence: 1, decision: 'APPROVE', decisionReason: [], subscores: {} as never },
    capabilityMap,
    findings: [],
    recommendedPolicy: [],
    coverage: {} as never,
    generatedAt: '2026-07-06T00:00:00Z',
    disclaimer: 'x',
  };
}

describe('markdown report injection hardening', () => {
  it('escapes table-breaking and HTML chars in an untrusted tool name', () => {
    const md = renderMarkdown(resultWithTool('evil | col | `code` <img src=x onerror=alert(1)>'));
    const row = md.split('\n').find((l) => l.includes('evil'))!;
    // The pipe is escaped so the table structure is preserved, and raw HTML is neutralized.
    expect(row).toContain('\\|');
    expect(row).not.toContain('<img');
    expect(row).toContain('&lt;img');
    expect(row).not.toContain('`code`');
  });
});
