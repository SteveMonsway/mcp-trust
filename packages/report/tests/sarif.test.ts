import { describe, it, expect } from 'vitest';
import { renderSarif } from '@mcp-trust/report';
import type { Finding, ScanResult, Severity } from '@mcp-trust/core';

const ESC = String.fromCharCode(27); // ANSI escape, kept out of the source text

function baseResult(findings: Finding[]): ScanResult {
  return {
    schemaVersion: '1.0',
    scanner: { name: 'mcp-trust', version: '0.3.0' },
    target: { type: 'local', path: '/x' },
    locator: 'local:/x',
    summary: { overallScore: 42, risk: 'medium', decision: 'NEEDS_REVIEW', confidence: 0.8, topReasons: [] },
    score: {
      overall: 42,
      risk: 'medium',
      confidence: 0.8,
      decision: 'NEEDS_REVIEW',
      decisionReason: ['x'],
      subscores: {} as never,
    },
    findings,
    recommendedPolicy: [],
    coverage: {} as never,
    generatedAt: '2026-07-07T00:00:00Z',
    disclaimer: 'not a guarantee',
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
    evidence: [{ source: 'server.js', file: 'server.js', line: 22, column: 10 }],
    impact: 'Arbitrary command execution.',
    remediation: 'Avoid shell; use execFile with a fixed argv.',
    references: [{ title: 'CWE-78', url: 'https://cwe.mitre.org/data/definitions/78.html' }],
    tags: [],
    fingerprint: 'fp-abc',
    ...over,
  };
}

describe('SARIF 2.1.0 output', () => {
  it('produces a well-formed single-run SARIF document', () => {
    const sarif = JSON.parse(renderSarif(baseResult([mkFinding()])));
    expect(sarif.version).toBe('2.1.0');
    expect(sarif.$schema).toContain('sarif-2.1.0');
    expect(Array.isArray(sarif.runs)).toBe(true);
    expect(sarif.runs).toHaveLength(1);
    const run = sarif.runs[0];
    expect(run.tool.driver.name).toBe('MCP Trust');
    expect(run.tool.driver.version).toBe('0.3.0');
    expect(run.tool.driver.informationUri).toMatch(/^https?:\/\//);
    expect(run.properties.decision).toBe('NEEDS_REVIEW');
  });

  it('emits one rule descriptor per unique ruleId with security-severity and helpUri', () => {
    const sarif = JSON.parse(
      renderSarif(
        baseResult([mkFinding(), mkFinding(), mkFinding({ ruleId: 'MCP-META-002', category: 'metadata' })]),
      ),
    );
    const rules = sarif.runs[0].tool.driver.rules;
    expect(rules).toHaveLength(2); // MCP-CODE-001 deduped, MCP-META-002 distinct
    const code = rules.find((r: any) => r.id === 'MCP-CODE-001');
    expect(code.defaultConfiguration.level).toBe('error'); // high → error
    expect(code.properties['security-severity']).toBe('8.0');
    expect(code.helpUri).toContain('cwe.mitre.org');
    expect(code.help.text).toContain('execFile');
  });

  it('maps every result ruleIndex into the rules array and carries partialFingerprints', () => {
    const sarif = JSON.parse(
      renderSarif(baseResult([mkFinding({ ruleId: 'MCP-META-002' }), mkFinding({ ruleId: 'MCP-CODE-001' })])),
    );
    const rules = sarif.runs[0].tool.driver.rules;
    const results = sarif.runs[0].results;
    for (const res of results) {
      expect(res.ruleIndex).toBeGreaterThanOrEqual(0);
      expect(res.ruleIndex).toBeLessThan(rules.length);
      expect(rules[res.ruleIndex].id).toBe(res.ruleId);
      expect(res.partialFingerprints['mcpTrust/v1']).toBeTruthy();
      expect(['error', 'warning', 'note', 'none']).toContain(res.level);
    }
  });

  it('emits a physicalLocation.region only when a real line exists', () => {
    const withLine = mkFinding({ evidence: [{ source: 'a.js', file: 'a.js', line: 5, column: 3, endLine: 7 }] });
    const noLine = mkFinding({
      ruleId: 'MCP-CONFIG-002',
      evidence: [{ source: 'config.server:x', file: 'mcp.json' }],
    });
    const noFile = mkFinding({ ruleId: 'MCP-SUPPLY-001', evidence: [{ source: 'package.json' }] });
    const sarif = JSON.parse(renderSarif(baseResult([withLine, noLine, noFile])));
    const byRule = (id: string) => sarif.runs[0].results.find((r: any) => r.ruleId === id);

    const loc = byRule('MCP-CODE-001').locations[0].physicalLocation;
    expect(loc.artifactLocation.uri).toBe('a.js');
    expect(loc.region).toEqual({ startLine: 5, startColumn: 3, endLine: 7 });

    const cfg = byRule('MCP-CONFIG-002').locations[0].physicalLocation;
    expect(cfg.artifactLocation.uri).toBe('mcp.json');
    expect(cfg.region).toBeUndefined(); // no fabricated line

    // No file at all (project-level finding) → anchored file-level to the manifest
    // (inferred from the `package.json` evidence source), with NO fabricated line.
    const supply = byRule('MCP-SUPPLY-001').locations[0].physicalLocation;
    expect(supply.artifactLocation.uri).toBe('package.json');
    expect(supply.region).toBeUndefined();
  });

  it('gives every result at least one location (GitHub Code Scanning rejects results without one)', () => {
    const findings = [
      mkFinding(), // located code finding (server.js:22)
      mkFinding({ ruleId: 'MCP-SUPPLY-001', evidence: [{ source: 'package.metadata' }] }),
      mkFinding({ ruleId: 'MCP-SUPPLY-003', evidence: [{ source: 'package.scripts.postinstall' }] }),
      mkFinding({ ruleId: 'MCP-SUPPLY-005', evidence: [{ source: 'repo.files' }] }),
    ];
    const sarif = JSON.parse(renderSarif(baseResult(findings)));
    for (const r of sarif.runs[0].results) {
      expect(Array.isArray(r.locations)).toBe(true);
      expect(r.locations.length).toBeGreaterThanOrEqual(1);
      expect(r.locations[0].physicalLocation.artifactLocation.uri).toBeTruthy();
    }
    // The three project-level supply findings anchor to the inferred manifest.
    const uriOf = (id: string) =>
      sarif.runs[0].results.find((r: any) => r.ruleId === id).locations[0].physicalLocation.artifactLocation.uri;
    expect(uriOf('MCP-SUPPLY-001')).toBe('package.json');
    expect(uriOf('MCP-SUPPLY-005')).toBe('package.json');
  });

  it('never lets a hostile file path break out of a relative artifact URI', () => {
    const evil = mkFinding({ evidence: [{ source: 's', file: '/etc/passwd', line: 1 }] });
    const evil2 = mkFinding({ ruleId: 'MCP-X', evidence: [{ source: 's', file: `./a${ESC}[31m/x.js`, line: 1 }] });
    const sarif = JSON.parse(renderSarif(baseResult([evil, evil2])));
    const uris = sarif.runs[0].results.map(
      (r: any) => r.locations?.[0]?.physicalLocation.artifactLocation.uri,
    );
    expect(uris[0]).toBe('etc/passwd'); // leading slash stripped
    expect(uris[1]).toBe('a/x.js'); // ANSI escape + leading ./ stripped
    expect(uris[1]).not.toContain(ESC);
  });

  it('never reuses an escaping path; anchors it to the manifest instead of misattributing', () => {
    const traversal = mkFinding({ ruleId: 'MCP-TRAV', evidence: [{ source: 's', file: '../../etc/shadow', line: 3 }] });
    const sarif = JSON.parse(renderSarif(baseResult([traversal])));
    const res = sarif.runs[0].results.find((r: any) => r.ruleId === 'MCP-TRAV');
    expect(res).toBeTruthy();
    // The escaping path is never used as the URI (no misattribution, no `..`),
    // but the result still carries a valid location so the SARIF stays ingestible.
    const uri = res.locations[0].physicalLocation.artifactLocation.uri;
    expect(uri).toBe('package.json');
    expect(uri).not.toContain('..');
    expect(res.locations[0].physicalLocation.region).toBeUndefined(); // no invented line
  });

  it('maps severities to SARIF levels and sorts most-severe first', () => {
    const sevs: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];
    const sarif = JSON.parse(
      renderSarif(baseResult(sevs.map((s, i) => mkFinding({ ruleId: `R-${i}`, severity: s })))),
    );
    const level = (id: string) =>
      sarif.runs[0].tool.driver.rules.find((r: any) => r.id === id).defaultConfiguration.level;
    expect(level('R-0')).toBe('error'); // critical
    expect(level('R-2')).toBe('warning'); // medium
    expect(level('R-3')).toBe('note'); // low
    expect(sarif.runs[0].results[0].properties.severity).toBe('critical'); // sorted first
  });
});
