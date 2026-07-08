import { allInferredCapabilities } from '../types.js';
import type { CapabilityCategory, CapabilityMap, Finding } from '../types.js';

/** Derive a human-readable recommended policy from capabilities + findings. */
export function generateRecommendedPolicy(
  findings: Finding[],
  capabilityMap: CapabilityMap | undefined,
): string[] {
  const policy = new Set<string>();
  const caps = new Set<CapabilityCategory>();
  // Include both per-tool (introspection) and aggregate (static) capabilities.
  for (const c of allInferredCapabilities(capabilityMap)) caps.add(c.category);

  const hasCritical = findings.some((f) => f.severity === 'critical');
  const hasHigh = findings.some((f) => f.severity === 'high');

  if (hasCritical) {
    policy.add('Block by default; do not connect to developer workstations or production agents without review.');
  } else if (hasHigh) {
    policy.add('Run only in a sandbox with least-privilege configuration.');
  }

  if (caps.has('shell_execution')) {
    policy.add('Run in an isolated container with no network and a read-only workspace.');
  }
  if (caps.has('filesystem_read') || caps.has('filesystem_write') || caps.has('filesystem_delete')) {
    policy.add('Restrict allowed directories; never expose the home directory, ~/.ssh, ~/.aws, or .env.');
  }
  if (caps.has('network_egress')) {
    policy.add('Restrict outbound network to an explicit allowlist of domains.');
  }
  if (caps.has('credential_access')) {
    policy.add('Do not pass real secrets; use scoped, revocable, least-privilege tokens only.');
  }
  if (caps.has('database_access')) {
    policy.add('Grant read-only database access unless writes are explicitly required.');
  }

  if (findings.some((f) => f.ruleId.startsWith('MCP-CONFIG-001') || f.ruleId.startsWith('MCP-SUPPLY-004'))) {
    policy.add('Pin exact package versions in the startup command.');
  }
  if (findings.some((f) => f.ruleId === 'MCP-CONFIG-005')) {
    policy.add('Move secrets out of config into a secrets manager or environment injected at runtime.');
  }

  if (policy.size === 0) {
    policy.add('No elevated restrictions required beyond standard review, based on available evidence.');
  }
  return [...policy];
}
