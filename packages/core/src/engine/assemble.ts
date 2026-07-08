import { computeScore } from '../scoring/scoring-engine.js';
import { decide } from '../decisions/decision-engine.js';
import { generateRecommendedPolicy } from './policy.js';
import { normalizeTargetId } from '../findings/fingerprint.js';
import { applyRuntimeContext } from '../findings/runtime-context.js';
import { SEVERITY_ORDER } from '../types.js';
import type { Finding, RiskScore, ScanContext, ScanResult } from '../types.js';

export const SCHEMA_VERSION = '1.0';
export const SCANNER_NAME = 'mcp-trust';
export const SCANNER_VERSION = '0.5.3';

export const DISCLAIMER =
  'MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.';

/** Sort findings by severity desc, then confidence desc — most severe first. */
export function sortFindings(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => {
    const s = SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity];
    if (s !== 0) return s;
    return b.confidence - a.confidence;
  });
}

/** Turn a completed context + findings into the final ScanResult. */
export function assembleScanResult(ctx: ScanContext, rawFindings: Finding[]): ScanResult {
  // Cap the severity of findings that live in non-runtime code (tests, examples,
  // build scripts) BEFORE scoring/decision, so dev-only matches don't drive a
  // false BLOCK. This runs once, centrally, so score, decision and report all
  // see the same adjusted findings.
  const findings = sortFindings(applyRuntimeContext(rawFindings));
  const scoring = computeScore(findings, ctx.coverage);
  const { decision, reasons } = decide(scoring.risk, findings, scoring.overall);

  const score: RiskScore = {
    overall: scoring.overall,
    risk: scoring.risk,
    confidence: scoring.confidence,
    decision,
    decisionReason: reasons,
    subscores: scoring.subscores,
  };

  const topReasons = reasons.length > 0 ? reasons : findings.slice(0, 3).map((f) => f.title);

  return {
    schemaVersion: SCHEMA_VERSION,
    scanner: { name: SCANNER_NAME, version: SCANNER_VERSION },
    target: ctx.target,
    locator: normalizeTargetId(ctx.target),
    resolvedRef: ctx.resolved?.resolvedRef,
    resolvedCommit: ctx.resolved?.resolvedRef,
    summary: {
      overallScore: score.overall,
      risk: score.risk,
      decision: score.decision,
      confidence: score.confidence,
      topReasons,
    },
    score,
    capabilityMap: ctx.capabilityMap,
    runtimeIntrospection: ctx.runtimeIntrospection,
    findings,
    recommendedPolicy: generateRecommendedPolicy(findings, ctx.capabilityMap),
    limitations: ctx.limitations && ctx.limitations.length > 0 ? ctx.limitations : undefined,
    coverage: ctx.coverage,
    generatedAt: new Date().toISOString(),
    disclaimer: DISCLAIMER,
  };
}

/** True when the result's worst finding meets/exceeds the fail-on threshold. */
export function exceedsThreshold(findings: Finding[], failOn: Finding['severity']): boolean {
  const min = SEVERITY_ORDER[failOn];
  return findings.some((f) => SEVERITY_ORDER[f.severity] >= min);
}
