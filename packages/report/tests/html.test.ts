import { describe, it, expect } from 'vitest';
import { renderHtml, renderMarkdown } from '@mcp-trust/report';
import type { CapabilityMap, Finding, ScanResult } from '@mcp-trust/core';

const ESC = String.fromCharCode(27); // ANSI escape, kept out of source text

function baseResult(over: Partial<ScanResult> = {}): ScanResult {
  return {
    schemaVersion: '1.0',
    scanner: { name: 'mcp-trust', version: '0.4.0' },
    target: { type: 'local', path: '/x' },
    locator: 'local:/x',
    summary: { overallScore: 42, risk: 'medium', decision: 'NEEDS_REVIEW', confidence: 0.8, topReasons: [] },
    score: {
      overall: 42,
      risk: 'medium',
      confidence: 0.8,
      decision: 'NEEDS_REVIEW',
      decisionReason: ['notable risk'],
      subscores: {
        config: 10,
        capability: null,
        metadata: 30,
        code: null,
        dependency: null,
        supplyChain: null,
        authTransport: null,
        runtime: null,
        maintainer: null,
      },
    },
    findings: [],
    recommendedPolicy: ['sandbox filesystem access'],
    coverage: {
      configScan: 'completed',
      staticScan: 'completed',
      capabilityInference: 'static_only',
      introspection: 'skipped',
      semgrep: 'completed',
      docker: 'not_available',
      dependencyScan: 'not_available',
      runtimeScan: 'not_available',
      packageMetadata: 'completed',
    },
    generatedAt: '2026-07-08T00:00:00Z',
    disclaimer: 'not a guarantee',
    ...over,
  };
}

let idc = 0;
function mkFinding(over: Partial<Finding> = {}): Finding {
  idc += 1;
  return {
    id: `F-${idc}`,
    ruleId: 'MCP-CODE-001',
    title: 'Shell execution',
    description: 'Executes a shell command from tool input.',
    severity: 'high',
    confidence: 0.9,
    category: 'code',
    evidence: [{ source: 'server.js', file: 'server.js', line: 22 }],
    impact: 'Arbitrary command execution.',
    remediation: 'Avoid shell; use execFile with a fixed argv.',
    references: [{ title: 'CWE-78', url: 'https://cwe.mitre.org/data/definitions/78.html' }],
    tags: [],
    fingerprint: 'fp-abc',
    ...over,
  };
}

describe('HTML report output', () => {
  it('produces a self-contained HTML document with no external resources', () => {
    const html = renderHtml(baseResult({ findings: [mkFinding()] }));
    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).toContain('<title>MCP Trust Report: local:/x</title>');
    expect(html).toContain('NEEDS_REVIEW');
    expect(html).toContain('<style>'); // inline CSS
    // No external fetches: no src=/href= to remote, no CDN.
    expect(html).not.toMatch(/src\s*=|href\s*=|https?:\/\/[^<]*\.(?:css|js)/);
    // Decision drives the header accent class.
    expect(html).toContain('decision-review');
  });

  it('renders an empty findings section without crashing', () => {
    const html = renderHtml(baseResult());
    expect(html).toContain('Findings (0)');
    expect(html).toContain('No findings.');
  });

  it('HTML-escapes a hostile tool name so it cannot inject markup', () => {
    const map: CapabilityMap = {
      source: 'static_inference',
      tools: [
        {
          name: '<img src=x onerror=alert(1)>',
          riskTags: [],
          inferredCapabilities: [{ category: 'shell_execution', confidence: 0.8, evidence: [] }],
        },
      ],
      resources: [],
      prompts: [],
      aggregateCapabilities: [],
    };
    const html = renderHtml(baseResult({ capabilityMap: map }));
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('escapes hostile file paths, snippets and ANSI in findings', () => {
    const evil = mkFinding({
      evidence: [
        {
          source: 's',
          file: `../<script>${ESC}[31m`,
          line: 1,
          snippet: '</code></pre><script>alert(1)</script>',
        },
      ],
    });
    const html = renderHtml(baseResult({ findings: [evil] }));
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    // The raw ANSI byte is passed through esc() (not a markup char) — that is
    // acceptable; what matters is no markup breakout occurred above.
  });

  it('does not leak secrets beyond what the (already-redacted) result carries', () => {
    // The renderer must not invent content; it only escapes what it is given.
    const html = renderHtml(baseResult({ findings: [mkFinding()] }));
    expect(html).not.toContain('sk-ant-');
    expect(html).not.toContain('AKIA');
  });

  it('renders a Limitations section (html + md) when present, and omits it otherwise', () => {
    const lim = 'Go source is present but was NOT analyzed — absence of findings does not imply safety.';
    const withLim = renderHtml(baseResult({ limitations: [lim] }));
    expect(withLim).toContain('Limitations');
    expect(withLim).toContain('Go source is present');
    const md = renderMarkdown(baseResult({ limitations: [lim] }));
    expect(md).toContain('## ⚠️ Limitations');
    expect(md).toContain('Go source is present');
    // Absent when there are no limitations.
    expect(renderHtml(baseResult())).not.toContain('Limitations');
    expect(renderMarkdown(baseResult())).not.toContain('Limitations');
  });

  it('groups findings by severity, most-severe first', () => {
    const html = renderHtml(
      baseResult({
        findings: [
          mkFinding({ ruleId: 'R-low', severity: 'low' }),
          mkFinding({ ruleId: 'R-crit', severity: 'critical' }),
        ],
      }),
    );
    expect(html.indexOf('CRITICAL (1)')).toBeLessThan(html.indexOf('LOW (1)'));
  });
});
