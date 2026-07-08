import { describe, it, expect, beforeEach } from 'vitest';
import { buildSemgrepFinding, resetFindingCounter, type ScanTarget, type SemgrepNormalizedFinding } from '../src/index.js';

const target: ScanTarget = { type: 'local', path: '/x' };

function nf(over: Partial<SemgrepNormalizedFinding> = {}): SemgrepNormalizedFinding {
  return {
    checkId: 'c',
    mcpId: 'MCP-SG-JS-001',
    title: 'Shell exec',
    category: 'code',
    severity: 'high',
    confidence: 0.9,
    capability: 'shell_execution',
    impact: 'Runs shell commands.',
    remediation: 'Use spawn.',
    cwe: 'CWE-78',
    minNeedsReview: true,
    references: ['https://cwe.mitre.org/data/definitions/78.html'],
    file: 'server.js',
    line: 22,
    column: 10,
    endLine: 22,
    ...over,
  };
}

const hasControl = (s: string): boolean => [...s].some((c) => c.charCodeAt(0) < 0x20 || c.charCodeAt(0) === 0x7f);

describe('buildSemgrepFinding', () => {
  beforeEach(() => resetFindingCounter());

  it('maps ruleset metadata onto a fully-formed finding', () => {
    const f = buildSemgrepFinding(nf({ snippet: 'return exec(cmd);' }), target);
    expect(f.ruleId).toBe('MCP-SG-JS-001');
    expect(f.severity).toBe('high');
    expect(f.category).toBe('code');
    expect(f.confidence).toBeCloseTo(0.9);
    expect(f.cwe).toEqual(['CWE-78']);
    expect(f.tags).toContain('engine:semgrep');
    expect(f.tags).toContain('cap:shell_execution');
    expect(f.references[0]?.url).toContain('cwe.mitre.org');
    expect(f.evidence[0]).toMatchObject({ file: 'server.js', line: 22, column: 10, endLine: 22 });
    expect(f.fingerprint).toBeTruthy();
  });

  it('redacts secrets that appear in the snippet', () => {
    const f = buildSemgrepFinding(nf({ snippet: 'const k = "AKIAIOSFODNN7EXAMPLE" + process.env.AWS_SECRET_ACCESS_KEY;' }), target);
    const snippet = f.evidence[0]?.snippet ?? '';
    expect(snippet).not.toContain('AKIAIOSFODNN7EXAMPLE');
  });

  it('strips ANSI/control sequences from a hostile file path and snippet', () => {
    const ESC = String.fromCharCode(27);
    const BEL = String.fromCharCode(7);
    const hostileFile = `a${ESC}[31mevil${ESC}[0m.js`;
    const hostileSnippet = `x${ESC}[2Ky${BEL}z`;
    const f = buildSemgrepFinding(nf({ file: hostileFile, snippet: hostileSnippet }), target);
    expect(hasControl(f.evidence[0]?.file ?? '')).toBe(false);
    expect(hasControl(f.evidence[0]?.snippet ?? '')).toBe(false);
  });

  it('adds min_needs_review only when severity is below high', () => {
    expect(buildSemgrepFinding(nf({ severity: 'high', minNeedsReview: true }), target).tags).not.toContain('min_needs_review');
    expect(buildSemgrepFinding(nf({ severity: 'medium', minNeedsReview: true }), target).tags).toContain('min_needs_review');
    expect(buildSemgrepFinding(nf({ severity: 'medium', minNeedsReview: false }), target).tags).not.toContain('min_needs_review');
  });

  it('defaults an invalid severity/category instead of dropping the finding', () => {
    const f = buildSemgrepFinding(nf({ severity: 'bogus', category: 'nonsense' }), target);
    expect(f.severity).toBe('medium');
    expect(f.category).toBe('code');
  });
});
