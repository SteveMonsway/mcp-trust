import { buildFinding } from './finding-builder.js';
import { sanitizeUntrustedText } from '../utils/redact.js';
import {
  SEVERITY_ORDER,
  TAG_ENGINE_SEMGREP,
  TAG_MIN_NEEDS_REVIEW,
  type Finding,
  type FindingCategory,
  type Reference,
  type ScanTarget,
  type SemgrepNormalizedFinding,
  type Severity,
} from '../types.js';

const VALID_SEVERITIES = new Set<Severity>(['info', 'low', 'medium', 'high', 'critical']);
const VALID_CATEGORIES = new Set<FindingCategory>([
  'config',
  'capability',
  'metadata',
  'code',
  'dependency',
  'supply_chain',
  'auth_transport',
  'runtime',
  'policy',
]);

/** Validate the ruleset-supplied severity, defaulting to 'medium' on a typo so a
 * real finding is never silently dropped. Bundled-rule metadata is asserted valid
 * by a unit test, so this fallback only guards against future edits. */
function toSeverity(s: string): Severity {
  return VALID_SEVERITIES.has(s as Severity) ? (s as Severity) : 'medium';
}

function toCategory(c: string): FindingCategory {
  return VALID_CATEGORIES.has(c as FindingCategory) ? (c as FindingCategory) : 'code';
}

const MAX_SNIPPET_LEN = 400;

/**
 * Build a fully-formed Finding from one normalized Semgrep match.
 *
 * The file path and source snippet come from the untrusted target, so both are
 * ANSI/control-stripped (`sanitizeUntrustedText`) here on ingestion and secret-
 * redacted by `buildFinding`. All other fields come from the trusted bundled
 * ruleset metadata.
 */
export function buildSemgrepFinding(nf: SemgrepNormalizedFinding, target: ScanTarget): Finding {
  const severity = toSeverity(nf.severity);
  const category = toCategory(nf.category);
  const safeFile = sanitizeUntrustedText(nf.file, 512) ?? nf.file;
  const snippet = nf.snippet != null ? sanitizeUntrustedText(nf.snippet, MAX_SNIPPET_LEN) : undefined;

  const tags = [TAG_ENGINE_SEMGREP, 'semgrep', 'code'];
  if (nf.capability) tags.push(`cap:${nf.capability}`);
  if (nf.minNeedsReview && SEVERITY_ORDER[severity] < SEVERITY_ORDER.high) tags.push(TAG_MIN_NEEDS_REVIEW);

  const references: Reference[] = nf.references.map((url) => ({ title: url, url }));

  return buildFinding({
    rule: {
      id: nf.mcpId,
      title: nf.title,
      description: nf.impact,
      defaultSeverity: severity,
      category,
      tags,
      remediation: nf.remediation,
      references,
    },
    target,
    severity,
    category,
    confidence: nf.confidence,
    impact: nf.impact,
    cwe: nf.cwe ? [nf.cwe] : undefined,
    evidence: [
      {
        source: safeFile,
        file: safeFile,
        line: nf.line,
        column: nf.column,
        endLine: nf.endLine,
        snippet,
      },
    ],
  });
}
