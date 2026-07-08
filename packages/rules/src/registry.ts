import type { Rule } from '@mcp-trust/core';
import { configRules } from './rules/config-rules.js';
import { codeRules } from './rules/code-rules.js';
import { metadataRules } from './rules/metadata-rules.js';
import { toolRules } from './rules/tool-rules.js';
import { supplyChainRules } from './rules/supply-chain-rules.js';

export const ALL_RULES: Rule[] = [
  ...configRules,
  ...codeRules,
  ...metadataRules,
  ...toolRules,
  ...supplyChainRules,
];

export function getRuleById(id: string): Rule | undefined {
  return ALL_RULES.find((r) => r.id === id);
}

export function listRules(): { id: string; title: string; severity: string; category: string }[] {
  return ALL_RULES.map((r) => ({
    id: r.id,
    title: r.title,
    severity: r.defaultSeverity,
    category: r.category,
  }));
}
