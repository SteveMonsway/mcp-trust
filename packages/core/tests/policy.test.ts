import { describe, it, expect } from 'vitest';
import { generateRecommendedPolicy, type CapabilityMap } from '@mcp-trust/core';

function staticMap(categories: string[]): CapabilityMap {
  return {
    source: 'static_inference',
    tools: [],
    resources: [],
    prompts: [],
    aggregateCapabilities: categories.map((c) => ({ category: c as never, confidence: 0.8, evidence: [] })),
  };
}

describe('generateRecommendedPolicy', () => {
  // Regression (review #5): static (aggregate) capabilities must drive policy too.
  it('emits capability-specific policy from aggregateCapabilities (no tools)', () => {
    const policy = generateRecommendedPolicy([], staticMap(['shell_execution', 'filesystem_read', 'network_egress']));
    const joined = policy.join(' ').toLowerCase();
    expect(joined).toContain('container');
    expect(joined).toContain('directories');
    expect(joined).toContain('outbound');
  });

  it('falls back to a generic line when there is nothing to restrict', () => {
    const policy = generateRecommendedPolicy([], staticMap([]));
    expect(policy.join(' ').toLowerCase()).toContain('no elevated restrictions');
  });
});
