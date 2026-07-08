import { createHash } from 'node:crypto';
import { redact } from '../utils/redact.js';
import type { Evidence, ScanTarget } from '../types.js';

/** Stable identity of a target, independent of local absolute paths. */
export function normalizeTargetId(target: ScanTarget): string {
  switch (target.type) {
    case 'github':
      return `github:${target.owner}/${target.repo}${target.path ? `/${target.path}` : ''}`;
    case 'npm':
      return `npm:${target.packageName}`;
    case 'pypi':
      return `pypi:${target.packageName}`;
    case 'docker':
      return `docker:${target.image}`;
    case 'remote-http':
      return `remote-http:${target.url}`;
    case 'local':
    case 'config':
      // Use only the basename so fingerprints stay stable across machines.
      return `${target.type}:${basename(target.path)}`;
  }
}

function basename(p: string): string {
  const parts = p.replace(/\\/g, '/').split('/').filter(Boolean);
  return parts[parts.length - 1] ?? p;
}

/** Collapse whitespace, redact secrets, and cap length. */
export function normalizeSnippet(snippet: string | undefined): string {
  if (!snippet) return '';
  const collapsed = redact(snippet).replace(/\s+/g, ' ').trim();
  return collapsed.length > 500 ? collapsed.slice(0, 500) : collapsed;
}

function primaryEvidence(evidence: Evidence[]): Evidence | undefined {
  return evidence[0];
}

/**
 * Deterministic fingerprint: sha256(ruleId + targetId + relPath + lineRange +
 * normalizedSnippet). Stable across re-scans when the finding is unchanged.
 */
export function computeFingerprint(params: {
  ruleId: string;
  target: ScanTarget;
  evidence: Evidence[];
}): string {
  const ev = primaryEvidence(params.evidence);
  const relPath = ev?.file ?? ev?.source ?? '';
  const lineRange = ev?.line != null ? `${ev.line}${ev.endLine != null ? `-${ev.endLine}` : ''}` : '';
  const snippet = normalizeSnippet(ev?.snippet ?? ev?.match);

  const material = [
    params.ruleId,
    normalizeTargetId(params.target),
    relPath,
    lineRange,
    snippet,
  ].join('\n');

  return createHash('sha256').update(material).digest('hex').slice(0, 32);
}
