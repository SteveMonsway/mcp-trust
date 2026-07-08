import {
  buildFinding,
  TAG_MIN_NEEDS_REVIEW,
  type Finding,
  type Rule,
  type ScanContext,
} from '@mcp-trust/core';
import { hasBidiControl, hasLongBase64, hasZeroWidth, matchPoisoning, type PoisoningGroup } from '../dictionaries/poisoning.js';
import { evidenceFromChunk, metadataTextChunks } from '../util.js';

function poisoningRule(
  id: string,
  group: PoisoningGroup,
  meta: Pick<Rule, 'title' | 'description' | 'defaultSeverity' | 'remediation'>,
  extraTags: string[] = [],
): Rule {
  return {
    id,
    title: meta.title,
    description: meta.description,
    defaultSeverity: meta.defaultSeverity,
    category: 'metadata',
    tags: ['metadata', 'poisoning', ...extraTags],
    appliesTo: ['mcp-metadata'],
    remediation: meta.remediation,
    references: [{ title: 'OWASP LLM01 Prompt Injection', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' }],
    falsePositiveNotes: 'Phrasing is intentionally cautious ("suspicious instruction-like metadata"); a match is a signal, not proof of malice.',
    evaluate(ctx: ScanContext): Finding[] {
      const out: Finding[] = [];
      for (const chunk of metadataTextChunks(ctx)) {
        const matches = matchPoisoning(chunk.value).filter((m) => m.group === group);
        for (const m of matches) {
          out.push(
            buildFinding({
              rule: this,
              target: ctx.target,
              evidence: [evidenceFromChunk(chunk, m.match)],
              confidence: chunk.source.startsWith('tool.') || chunk.source.startsWith('prompt.') ? 0.8 : 0.6,
              owaspLlm: ['LLM01'],
              impact: 'Instruction-like text in server-controlled metadata can steer the model without user awareness.',
            }),
          );
        }
      }
      return out;
    },
  };
}

const overrideRule = poisoningRule('MCP-META-001', 'instruction_override', {
  title: 'Suspicious instruction-override phrase in metadata',
  description: 'Server-controlled text tries to override or ignore prior instructions (e.g. "ignore previous instructions").',
  defaultSeverity: 'high',
  remediation: 'Treat tool/prompt metadata as untrusted. Remove instruction-override phrasing and review the server.',
});

const concealmentRule = poisoningRule('MCP-META-002', 'concealment', {
  title: 'Suspicious concealment phrase in metadata',
  description: 'Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").',
  defaultSeverity: 'high',
  remediation: 'Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.',
});

const exfilRule = poisoningRule(
  'MCP-META-003',
  'exfiltration',
  {
    title: 'Suspicious data-exfiltration phrase in metadata',
    description: 'Metadata references sending data/credentials to an external destination.',
    defaultSeverity: 'high',
    remediation: 'Investigate where data would be sent. Block until the destination and intent are verified.',
  },
  [TAG_MIN_NEEDS_REVIEW],
);

const systemPromptRule = poisoningRule('MCP-META-004', 'system_prompt_targeting', {
  title: 'Metadata references system/developer prompt',
  description: 'Metadata references the system or developer prompt, a common prompt-injection target.',
  defaultSeverity: 'medium',
  remediation: 'Review why tool metadata references system-level prompts; treat as untrusted.',
});

const encodedRule: Rule = {
  id: 'MCP-META-005',
  title: 'Encoded or hidden content in metadata',
  description: 'Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.',
  defaultSeverity: 'medium',
  category: 'metadata',
  tags: ['metadata', 'poisoning', 'obfuscation'],
  appliesTo: ['mcp-metadata'],
  remediation: 'Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.',
  falsePositiveNotes: 'Long base64 requires mixed case + digits to reduce hits on ordinary hashes/ids.',
  evaluate(ctx: ScanContext): Finding[] {
    const out: Finding[] = [];
    for (const chunk of metadataTextChunks(ctx)) {
      const reasons: string[] = [];
      if (hasZeroWidth(chunk.value)) reasons.push('zero-width characters');
      if (hasBidiControl(chunk.value)) reasons.push('bidi control characters');
      if (hasLongBase64(chunk.value)) reasons.push('long encoded payload');
      if (reasons.length === 0) continue;
      out.push(
        buildFinding({
          rule: encodedRule,
          target: ctx.target,
          evidence: [evidenceFromChunk(chunk, reasons.join(', '))],
          confidence: 0.65,
          impact: 'Hidden or encoded content can smuggle instructions past human review.',
        }),
      );
    }
    return out;
  },
};

export const metadataRules: Rule[] = [overrideRule, concealmentRule, exfilRule, systemPromptRule, encodedRule];
