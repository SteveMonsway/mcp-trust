// ---------------------------------------------------------------------------
// Single source of truth for score bands and decision mapping.
// Every module MUST use these constants — never duplicate thresholds.
// Resolved contradiction (TZ §6.1 vs §8.2): bands are 30 / 60 / 80.
// ---------------------------------------------------------------------------

import type { Decision, RiskBand } from '../types.js';

export const SCORE_THRESHOLDS = {
  low: { min: 0, max: 29 },
  medium: { min: 30, max: 59 },
  high: { min: 60, max: 79 },
  critical: { min: 80, max: 100 },
} as const;

export const DECISION_BY_RISK_BAND: Record<RiskBand, Decision> = {
  low: 'APPROVE',
  medium: 'APPROVE_WITH_RESTRICTIONS',
  high: 'NEEDS_REVIEW',
  critical: 'BLOCK',
};

/** Ordering used to "raise" a decision via overrides. */
export const DECISION_ORDER: Record<Decision, number> = {
  APPROVE: 0,
  APPROVE_WITH_RESTRICTIONS: 1,
  NEEDS_REVIEW: 2,
  BLOCK: 3,
};

export function riskBandForScore(score: number): RiskBand {
  if (score >= SCORE_THRESHOLDS.critical.min) return 'critical';
  if (score >= SCORE_THRESHOLDS.high.min) return 'high';
  if (score >= SCORE_THRESHOLDS.medium.min) return 'medium';
  return 'low';
}

/** Weights per subscore. Sum = 1.00. */
export const SUBSCORE_WEIGHTS = {
  capability: 0.2,
  code: 0.2,
  config: 0.15,
  supplyChain: 0.15,
  dependency: 0.1,
  authTransport: 0.05,
  metadata: 0.05,
  maintainer: 0.05,
  runtime: 0.05,
} as const;

export type SubscoreKey = keyof typeof SUBSCORE_WEIGHTS;
