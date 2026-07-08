import { DECISION_BY_RISK_BAND, DECISION_ORDER } from '../scoring/thresholds.js';
import { TAG_FORCE_BLOCK, TAG_MIN_NEEDS_REVIEW } from '../types.js';
import type { Decision, Finding, RiskBand } from '../types.js';

export interface DecisionResult {
  decision: Decision;
  reasons: string[];
}

function raise(current: Decision, candidate: Decision): Decision {
  return DECISION_ORDER[candidate] > DECISION_ORDER[current] ? candidate : current;
}

/**
 * Decision = band mapping, then raised (never lowered) by severity overrides.
 * Overrides are data-driven via finding tags plus critical-confidence rule.
 */
export function decide(risk: RiskBand, findings: Finding[], overall: number): DecisionResult {
  let decision = DECISION_BY_RISK_BAND[risk];
  const reasons: string[] = [`Overall score ${overall} falls in ${risk.toUpperCase()} band`];

  const forceBlock = findings.filter((f) => f.tags.includes(TAG_FORCE_BLOCK));
  const criticalConfident = findings.filter(
    (f) => f.severity === 'critical' && f.confidence >= 0.75,
  );
  const minReview = findings.filter((f) => f.tags.includes(TAG_MIN_NEEDS_REVIEW));

  if (forceBlock.length > 0) {
    decision = raise(decision, 'BLOCK');
    reasons.push(`Force-block finding: ${forceBlock.map((f) => f.ruleId).join(', ')}`);
  }
  if (criticalConfident.length > 0) {
    decision = raise(decision, 'BLOCK');
    reasons.push(
      `Critical finding with high confidence: ${criticalConfident.map((f) => f.ruleId).join(', ')}`,
    );
  }
  if (minReview.length > 0) {
    const raised = raise(decision, 'NEEDS_REVIEW');
    if (raised !== decision) {
      reasons.push(`Elevated to NEEDS_REVIEW by: ${minReview.map((f) => f.ruleId).join(', ')}`);
      decision = raised;
    }
  }

  return { decision, reasons };
}
