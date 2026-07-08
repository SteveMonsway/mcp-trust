import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { defaultScanOptions, type ScanTarget } from '@mcp-trust/core';
import { renderSarif, renderPrComment } from '@mcp-trust/report';
import { runScan } from '../src/pipeline.js';

// Exercises the SARIF / PR-comment renderers against a REAL pipeline result
// (not a hand-built fixture), so any drift in the ScanResult/Finding shape is
// caught here rather than only in production. The CLI file-writing wiring itself
// is verified by manual repro (`--format sarif --emit-pr-comment`).

const root = (rel: string) => fileURLToPath(new URL(`../../../fixtures/${rel}`, import.meta.url));
const localTarget = (rel: string): ScanTarget => ({ type: 'local', path: root(rel) });

describe('report formats over a real scan result', () => {
  it('renders valid SARIF 2.1.0 from a scanned repo with code findings', async () => {
    const result = await runScan(localTarget('repos/js-exec'), { ...defaultScanOptions(), semgrep: false });
    const sarif = JSON.parse(renderSarif(result));

    expect(sarif.version).toBe('2.1.0');
    const run = sarif.runs[0];
    const rules = run.tool.driver.rules;
    const results = run.results;

    // Every result points at a valid rule; every region (when present) is 1-based.
    expect(results.length).toBe(result.findings.length);
    for (const res of results) {
      expect(rules[res.ruleIndex].id).toBe(res.ruleId);
      expect(res.partialFingerprints['mcpTrust/v1']).toBeTruthy();
      const reg = res.locations?.[0]?.physicalLocation?.region;
      if (reg) expect(reg.startLine).toBeGreaterThanOrEqual(1);
    }
    // js-exec has a child_process.exec finding with a concrete line.
    const code = results.find((r: any) => r.ruleId === 'MCP-CODE-001');
    expect(code.locations[0].physicalLocation.region.startLine).toBeGreaterThanOrEqual(1);
    expect(run.properties.decision).toBe(result.score.decision);
  });

  it('never leaks a real secret into SARIF or the PR comment', async () => {
    const result = await runScan({ type: 'config', path: root('configs/secrets-env.json') }, defaultScanOptions());
    const sarif = renderSarif(result);
    const comment = renderPrComment(result);
    for (const blob of [sarif, comment]) {
      expect(blob).not.toContain('wJalrXUtnFEMI');
      expect(blob).not.toMatch(/sk-ant-abcdef/);
    }
  });

  it('produces a compact PR comment carrying the decision and update marker', async () => {
    const result = await runScan(localTarget('repos/js-exec'), { ...defaultScanOptions(), semgrep: false });
    const comment = renderPrComment(result, 'https://ci.example/run/1');
    expect(comment).toContain('MCP Trust Scan Result');
    expect(comment).toContain(`Decision: **${result.score.decision}**`);
    expect(comment).toContain('[View full report](https://ci.example/run/1)');
  });
});
