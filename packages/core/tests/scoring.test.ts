import { describe, it, expect } from 'vitest';
import {
  computeScore,
  decide,
  defaultCoverage,
  riskBandForScore,
  type Finding,
  type FindingCategory,
  type Severity,
} from '@mcp-trust/core';

let n = 0;
function finding(category: FindingCategory, severity: Severity, confidence = 0.9, tags: string[] = []): Finding {
  n += 1;
  return {
    id: `F-${n}`,
    ruleId: `RULE-${n}`,
    title: 't',
    description: 'd',
    severity,
    confidence,
    category,
    evidence: [],
    impact: 'i',
    remediation: 'r',
    references: [],
    tags,
    fingerprint: `fp-${n}`,
  };
}

describe('riskBandForScore', () => {
  it('maps to the agreed 30/60/80 bands', () => {
    expect(riskBandForScore(0)).toBe('low');
    expect(riskBandForScore(29)).toBe('low');
    expect(riskBandForScore(30)).toBe('medium');
    expect(riskBandForScore(59)).toBe('medium');
    expect(riskBandForScore(60)).toBe('high');
    expect(riskBandForScore(79)).toBe('high');
    expect(riskBandForScore(80)).toBe('critical');
    expect(riskBandForScore(100)).toBe('critical');
  });
});

describe('computeScore', () => {
  it('produces higher scores for more severe findings', () => {
    const cov = defaultCoverage();
    cov.configScan = 'completed';
    const low = computeScore([finding('config', 'low')], cov).overall;
    const high = computeScore([finding('config', 'critical')], cov).overall;
    expect(high).toBeGreaterThan(low);
  });

  it('marks not-assessed subscores as null and still computes an overall', () => {
    const cov = defaultCoverage();
    cov.configScan = 'completed';
    const res = computeScore([finding('config', 'high')], cov);
    expect(res.subscores.config).not.toBeNull();
    expect(res.subscores.runtime).toBeNull();
    expect(res.subscores.maintainer).toBeNull();
    expect(res.overall).toBeGreaterThan(0);
  });

  it('returns 0 overall with no findings and no coverage', () => {
    expect(computeScore([], defaultCoverage()).overall).toBe(0);
  });
});

describe('decide', () => {
  it('follows band mapping without overrides', () => {
    expect(decide('low', [], 10).decision).toBe('APPROVE');
    expect(decide('medium', [], 45).decision).toBe('APPROVE_WITH_RESTRICTIONS');
    expect(decide('high', [], 70).decision).toBe('NEEDS_REVIEW');
    expect(decide('critical', [], 85).decision).toBe('BLOCK');
  });

  it('force-blocks on a confident critical finding regardless of band', () => {
    const res = decide('medium', [finding('code', 'critical', 0.9)], 40);
    expect(res.decision).toBe('BLOCK');
  });

  it('raises to NEEDS_REVIEW via min_needs_review tag', () => {
    const res = decide('low', [finding('config', 'high', 0.9, ['min_needs_review'])], 20);
    expect(res.decision).toBe('NEEDS_REVIEW');
  });

  it('never lowers a decision below its band', () => {
    const res = decide('critical', [finding('config', 'low', 0.9, ['min_needs_review'])], 85);
    expect(res.decision).toBe('BLOCK');
  });
});
