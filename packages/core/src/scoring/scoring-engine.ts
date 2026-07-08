import {
  SUBSCORE_WEIGHTS,
  riskBandForScore,
  type SubscoreKey,
} from './thresholds.js';
import { SEVERITY_BASE } from '../types.js';
import type {
  Coverage,
  Finding,
  FindingCategory,
  RiskBand,
  Subscores,
} from '../types.js';

const CATEGORY_TO_SUBSCORE: Record<FindingCategory, SubscoreKey> = {
  config: 'config',
  capability: 'capability',
  metadata: 'metadata',
  code: 'code',
  dependency: 'dependency',
  supply_chain: 'supplyChain',
  auth_transport: 'authTransport',
  runtime: 'runtime',
  policy: 'config',
};

export interface ScoringResult {
  overall: number;
  risk: RiskBand;
  confidence: number;
  subscores: Subscores;
}

/** Which subscores were actually assessable, from coverage + findings. */
function baseAvailability(coverage: Coverage): Record<SubscoreKey, boolean> {
  const scanned = (s: string) => s === 'completed' || s === 'partial';
  return {
    config: scanned(coverage.configScan),
    capability: coverage.capabilityInference !== 'none',
    metadata: coverage.capabilityInference !== 'none',
    code: scanned(coverage.staticScan),
    supplyChain: scanned(coverage.packageMetadata),
    dependency: scanned(coverage.dependencyScan),
    authTransport: false,
    runtime: scanned(coverage.runtimeScan),
    maintainer: false,
  };
}

/** Combine finding probabilities as a saturating "OR" — stays within [0,100]. */
function subscoreFromFindings(findings: Finding[]): number {
  let survive = 1;
  for (const f of findings) {
    const p = (SEVERITY_BASE[f.severity] / 100) * f.confidence;
    survive *= 1 - p;
  }
  return Math.round((1 - survive) * 100);
}

export function computeScore(findings: Finding[], coverage: Coverage): ScoringResult {
  const byKey = new Map<SubscoreKey, Finding[]>();
  for (const f of findings) {
    const key = CATEGORY_TO_SUBSCORE[f.category];
    const list = byKey.get(key) ?? [];
    list.push(f);
    byKey.set(key, list);
  }

  const avail = baseAvailability(coverage);
  const keys = Object.keys(SUBSCORE_WEIGHTS) as SubscoreKey[];

  const subscores = {} as Subscores;
  let weightedSum = 0;
  let weightTotal = 0;

  for (const key of keys) {
    const catFindings = byKey.get(key) ?? [];
    const available = avail[key] || catFindings.length > 0;
    if (!available) {
      subscores[key] = null;
      continue;
    }
    const value = subscoreFromFindings(catFindings);
    subscores[key] = value;
    const w = SUBSCORE_WEIGHTS[key];
    weightedSum += w * value;
    weightTotal += w;
  }

  const overall = weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 0;
  const risk = riskBandForScore(overall);
  const confidence = computeConfidence(findings, coverage);

  return { overall, risk, confidence, subscores };
}

function computeConfidence(findings: Finding[], coverage: Coverage): number {
  const drivers = findings.filter((f) => SEVERITY_BASE[f.severity] >= SEVERITY_BASE.medium);
  if (drivers.length > 0) {
    let num = 0;
    let den = 0;
    for (const f of drivers) {
      const w = SEVERITY_BASE[f.severity];
      num += f.confidence * w;
      den += w;
    }
    return round2(num / den);
  }
  // No significant findings: confidence reflects how much we managed to inspect.
  let c = 0.6;
  if (coverage.staticScan === 'completed') c += 0.1;
  if (coverage.packageMetadata === 'completed') c += 0.1;
  if (coverage.introspection === 'completed_trusted_fixture' || coverage.introspection === 'completed_sandboxed')
    c += 0.1;
  return round2(Math.min(0.95, c));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
