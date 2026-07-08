import { computeFingerprint } from './fingerprint.js';
import { redact } from '../utils/redact.js';
import type {
  Evidence,
  Finding,
  FindingCategory,
  Reference,
  Rule,
  ScanTarget,
  Severity,
} from '../types.js';

let counter = 0;

/** Reset the per-scan finding id counter (call at pipeline start). */
export function resetFindingCounter(): void {
  counter = 0;
}

function redactEvidence(evidence: Evidence[]): Evidence[] {
  return evidence.map((e) => ({
    ...e,
    snippet: e.snippet != null ? redact(e.snippet) : undefined,
    match: e.match != null ? redact(e.match) : undefined,
  }));
}

export interface BuildFindingInput {
  rule: Pick<
    Rule,
    'id' | 'title' | 'description' | 'defaultSeverity' | 'category' | 'tags' | 'remediation' | 'references'
  >;
  target: ScanTarget;
  evidence: Evidence[];
  /** Override the rule's default severity for this specific instance. */
  severity?: Severity;
  confidence: number;
  impact: string;
  /** Extra tags merged with the rule's tags. */
  tags?: string[];
  category?: FindingCategory;
  cwe?: string[];
  owaspLlm?: string[];
  references?: Reference[];
}

/** Build a fully-formed, redacted, fingerprinted Finding. */
export function buildFinding(input: BuildFindingInput): Finding {
  const evidence = redactEvidence(input.evidence);
  const fingerprint = computeFingerprint({
    ruleId: input.rule.id,
    target: input.target,
    evidence,
  });
  counter += 1;
  return {
    id: `F-${String(counter).padStart(4, '0')}`,
    ruleId: input.rule.id,
    title: input.rule.title,
    description: input.rule.description,
    severity: input.severity ?? input.rule.defaultSeverity,
    confidence: clamp01(input.confidence),
    category: input.category ?? input.rule.category,
    cwe: input.cwe,
    owaspLlm: input.owaspLlm,
    evidence,
    impact: input.impact,
    remediation: input.rule.remediation,
    references: input.references ?? input.rule.references ?? [],
    tags: dedupe([...input.rule.tags, ...(input.tags ?? [])]),
    fingerprint,
  };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function dedupe(arr: string[]): string[] {
  return [...new Set(arr)];
}
