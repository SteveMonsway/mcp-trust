export * from './types.js';
export * from './defaults.js';
export { redact, looksLikeSecretValue, isSecretName, sanitizeUntrustedText } from './utils/redact.js';
export { computeFingerprint, normalizeTargetId, normalizeSnippet } from './findings/fingerprint.js';
export { buildFinding, resetFindingCounter, type BuildFindingInput } from './findings/finding-builder.js';
export { buildSemgrepFinding } from './findings/semgrep-finding.js';
export { classifyRuntimeContext, applyRuntimeContext, type RuntimeContext } from './findings/runtime-context.js';
export {
  SCORE_THRESHOLDS,
  DECISION_BY_RISK_BAND,
  DECISION_ORDER,
  SUBSCORE_WEIGHTS,
  riskBandForScore,
  type SubscoreKey,
} from './scoring/thresholds.js';
export { computeScore, type ScoringResult } from './scoring/scoring-engine.js';
export { decide, type DecisionResult } from './decisions/decision-engine.js';
export { runRules, dedupeByFingerprint } from './engine/rule-engine.js';
export { generateRecommendedPolicy } from './engine/policy.js';
export {
  assembleScanResult,
  exceedsThreshold,
  sortFindings,
  SCHEMA_VERSION,
  SCANNER_NAME,
  SCANNER_VERSION,
  DISCLAIMER,
} from './engine/assemble.js';
