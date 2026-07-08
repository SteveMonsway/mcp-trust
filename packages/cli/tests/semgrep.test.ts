import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { defaultScanOptions, type ScanTarget } from '@mcp-trust/core';
import { isSemgrepAvailable } from '@mcp-trust/static-scanner';
import { runScan } from '../src/pipeline.js';

const semgrepAvailable = isSemgrepAvailable();
const root = (rel: string) => fileURLToPath(new URL(`../../../fixtures/${rel}`, import.meta.url));
const localTarget = (rel: string): ScanTarget => ({ type: 'local', path: root(rel) });

describe('semgrep integration (pipeline)', () => {
  it.skipIf(!semgrepAvailable)('surfaces AST findings the regex rules do not cover', async () => {
    const result = await runScan(localTarget('repos/semgrep-cases'), defaultScanOptions());
    const ids = result.findings.map((f) => f.ruleId);
    // New value: patterns with no regex-rule equivalent.
    expect(ids).toContain('MCP-SG-JS-004'); // vm module
    expect(ids).toContain('MCP-SG-JS-005'); // SSRF dynamic URL
    expect(ids).toContain('MCP-SG-PY-002'); // python exec()
    expect(ids).toContain('MCP-SG-PY-003'); // unsafe deserialization
    expect(ids).toContain('MCP-SG-PY-005'); // dynamic import
    expect(result.coverage.semgrep).toBe('completed');
  });

  it.skipIf(!semgrepAvailable)('every semgrep finding carries file/line evidence and the engine tag', async () => {
    const result = await runScan(localTarget('repos/semgrep-cases'), defaultScanOptions());
    const sg = result.findings.filter((f) => f.tags.includes('engine:semgrep'));
    expect(sg.length).toBeGreaterThan(0);
    for (const f of sg) {
      expect(f.evidence[0]?.file).toBeTruthy();
      expect(typeof f.evidence[0]?.line).toBe('number');
    }
  });

  it.skipIf(!semgrepAvailable)('dedups a semgrep match against the regex rule on the same line', async () => {
    const result = await runScan(localTarget('repos/semgrep-cases'), defaultScanOptions());
    const ids = result.findings.map((f) => f.ruleId);
    // eval() at dynamic.js:12 is caught by regex MCP-CODE-003; the semgrep
    // equivalent MCP-SG-JS-003 must be suppressed (same file:line).
    expect(ids).toContain('MCP-CODE-003');
    const evalOnLine12 = result.findings.filter(
      (f) => f.ruleId === 'MCP-SG-JS-003' && f.evidence.some((e) => e.file === 'dynamic.js' && e.line === 12),
    );
    expect(evalOnLine12).toHaveLength(0);
  });

  it.skipIf(!semgrepAvailable)('marks coverage disabled when --no-semgrep is set', async () => {
    const result = await runScan(localTarget('repos/semgrep-cases'), defaultScanOptions({ semgrep: false }));
    expect(result.coverage.semgrep).toBe('disabled');
    expect(result.findings.some((f) => f.tags.includes('engine:semgrep'))).toBe(false);
  });
});
