import { describe, it, expect } from 'vitest';
import { computeFingerprint, normalizeTargetId, type ScanTarget } from '@mcp-trust/core';

const target: ScanTarget = { type: 'config', path: '/abs/machine/a/config.json' };
const target2: ScanTarget = { type: 'config', path: '/different/b/config.json' };

describe('fingerprint', () => {
  it('is deterministic for identical inputs', () => {
    const a = computeFingerprint({ ruleId: 'R1', target, evidence: [{ source: 's', file: 'x.ts', line: 5, snippet: 'foo' }] });
    const b = computeFingerprint({ ruleId: 'R1', target, evidence: [{ source: 's', file: 'x.ts', line: 5, snippet: 'foo' }] });
    expect(a).toBe(b);
  });
  it('is stable across machines (basename target id)', () => {
    const a = computeFingerprint({ ruleId: 'R1', target, evidence: [{ source: 's', file: 'x.ts', line: 5, snippet: 'foo' }] });
    const b = computeFingerprint({ ruleId: 'R1', target: target2, evidence: [{ source: 's', file: 'x.ts', line: 5, snippet: 'foo' }] });
    expect(a).toBe(b); // same basename config.json
  });
  it('changes with ruleId', () => {
    const a = computeFingerprint({ ruleId: 'R1', target, evidence: [{ source: 's' }] });
    const b = computeFingerprint({ ruleId: 'R2', target, evidence: [{ source: 's' }] });
    expect(a).not.toBe(b);
  });
  it('normalizes target id to basename for local/config', () => {
    expect(normalizeTargetId(target)).toBe('config:config.json');
  });
});
