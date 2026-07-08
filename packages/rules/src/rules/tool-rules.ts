import {
  allInferredCapabilities,
  buildFinding,
  TAG_MIN_NEEDS_REVIEW,
  type CapabilityCategory,
  type Finding,
  type InferredCapability,
  type Rule,
  type ScanContext,
  type Severity,
} from '@mcp-trust/core';

function collect(ctx: ScanContext, categories: CapabilityCategory[]): InferredCapability[] {
  return allInferredCapabilities(ctx.capabilityMap).filter((c) => categories.includes(c.category));
}

function capabilityRule(
  id: string,
  categories: CapabilityCategory[],
  meta: Pick<Rule, 'title' | 'description' | 'defaultSeverity' | 'remediation'>,
  extraTags: string[] = [],
): Rule {
  return {
    id,
    title: meta.title,
    description: meta.description,
    defaultSeverity: meta.defaultSeverity,
    category: 'capability',
    tags: ['capability', ...extraTags],
    appliesTo: ['mcp-metadata'],
    remediation: meta.remediation,
    falsePositiveNotes: 'Inferred from tool metadata/code via a deterministic dictionary; confidence reflects keyword vs regex match strength.',
    evaluate(ctx: ScanContext): Finding[] {
      const caps = collect(ctx, categories);
      if (caps.length === 0) return [];
      // Emit one finding, aggregating evidence across matching capabilities.
      const evidence = caps.flatMap((c) => c.evidence).slice(0, 6);
      const confidence = Math.max(...caps.map((c) => c.confidence));
      const severity: Severity = confidence >= 0.8 ? meta.defaultSeverity : downgrade(meta.defaultSeverity);
      return [
        buildFinding({
          rule: this,
          target: ctx.target,
          severity,
          evidence,
          confidence,
          impact: meta.description,
        }),
      ];
    },
  };
}

function downgrade(s: Severity): Severity {
  const order: Severity[] = ['info', 'low', 'medium', 'high', 'critical'];
  const i = order.indexOf(s);
  return order[Math.max(0, i - 1)] ?? s;
}

export const toolRules: Rule[] = [
  capabilityRule('MCP-TOOL-001', ['filesystem_read'], {
    title: 'Filesystem read capability',
    description: 'The server can read files from the host filesystem.',
    defaultSeverity: 'high',
    remediation: 'Restrict readable paths to an allowlisted workspace; never expose home, ~/.ssh, ~/.aws, or .env.',
  }),
  capabilityRule('MCP-TOOL-002', ['filesystem_write', 'filesystem_delete'], {
    title: 'Filesystem write/delete capability',
    description: 'The server can write or delete files on the host filesystem.',
    defaultSeverity: 'high',
    remediation: 'Scope writes/deletes to a validated workspace and run with least privilege.',
  }),
  capabilityRule(
    'MCP-TOOL-003',
    ['shell_execution'],
    {
      title: 'Shell/command execution capability',
      description: 'The server can execute shell commands on the host.',
      defaultSeverity: 'critical',
      remediation: 'Run only in an isolated sandbox with no network and a read-only workspace; require explicit user confirmation.',
    },
    [TAG_MIN_NEEDS_REVIEW],
  ),
  capabilityRule('MCP-TOOL-004', ['network_egress'], {
    title: 'Network egress capability',
    description: 'The server can make outbound network requests, potentially to arbitrary URLs.',
    defaultSeverity: 'medium',
    remediation: 'Restrict outbound traffic to an explicit domain allowlist.',
  }),
  capabilityRule('MCP-TOOL-005', ['credential_access'], {
    title: 'Credential/secret access capability',
    description: 'The server can access credentials, tokens, or keychains.',
    defaultSeverity: 'high',
    remediation: 'Provide only scoped, revocable tokens; never pass real long-lived secrets.',
  }),
];
