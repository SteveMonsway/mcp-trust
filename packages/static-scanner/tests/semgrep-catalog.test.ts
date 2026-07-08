import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { listSemgrepRules, getSemgrepRuleById, defaultRulesetPath } from '@mcp-trust/static-scanner';

describe('defaultRulesetPath', () => {
  it('resolves to an existing, non-empty ruleset file', () => {
    const p = defaultRulesetPath();
    expect(existsSync(p)).toBe(true); // must resolve in src/dist/bundle layouts
    expect(readFileSync(p, 'utf8')).toContain('mcp_id'); // it is the real ruleset
  });
});

const SEVERITIES = new Set(['info', 'low', 'medium', 'high', 'critical']);
const CATEGORIES = new Set([
  'config',
  'capability',
  'metadata',
  'code',
  'dependency',
  'supply_chain',
  'auth_transport',
  'runtime',
  'policy',
]);

describe('bundled semgrep ruleset catalog', () => {
  const rules = listSemgrepRules();

  it('parses every bundled rule', () => {
    expect(rules.length).toBeGreaterThanOrEqual(12);
  });

  it('every rule carries complete, valid mcp metadata', () => {
    for (const r of rules) {
      expect(r.mcpId, r.semgrepId).toMatch(/^MCP-SG-(JS|PY)-\d{3}$/);
      expect(SEVERITIES.has(r.severity), `${r.mcpId} severity ${r.severity}`).toBe(true);
      expect(CATEGORIES.has(r.category), `${r.mcpId} category ${r.category}`).toBe(true);
      expect(r.confidence).toBeGreaterThan(0);
      expect(r.confidence).toBeLessThanOrEqual(1);
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.impact.length).toBeGreaterThan(0);
      expect(r.remediation.length).toBeGreaterThan(0);
      expect(r.languages.length).toBeGreaterThan(0);
    }
  });

  it('has unique mcp ids', () => {
    const ids = rules.map((r) => r.mcpId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('looks up a rule by id, case-insensitively', () => {
    expect(getSemgrepRuleById('mcp-sg-py-003')?.title).toMatch(/deserialization/i);
    expect(getSemgrepRuleById('MCP-SG-JS-001')?.category).toBe('code');
    expect(getSemgrepRuleById('MCP-SG-NOPE-999')).toBeUndefined();
  });
});
