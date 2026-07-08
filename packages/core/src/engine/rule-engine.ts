import type { Finding, Rule, ScanContext } from '../types.js';

/** Run every rule against the context, collecting findings; a rule that throws
 * is logged and skipped (scanners return findings, they don't abort the scan). */
export async function runRules(rules: Rule[], ctx: ScanContext): Promise<Finding[]> {
  const findings: Finding[] = [];
  for (const rule of rules) {
    try {
      const out = await rule.evaluate(ctx);
      findings.push(...out);
    } catch (err) {
      ctx.logs.push({
        level: 'warn',
        message: `rule ${rule.id} failed: ${err instanceof Error ? err.message : String(err)}`,
        at: new Date().toISOString(),
      });
    }
  }
  return dedupeByFingerprint(findings);
}

/** Keep the first finding per fingerprint (stable dedup across scanners). */
export function dedupeByFingerprint(findings: Finding[]): Finding[] {
  const seen = new Set<string>();
  const out: Finding[] = [];
  for (const f of findings) {
    if (seen.has(f.fingerprint)) continue;
    seen.add(f.fingerprint);
    out.push(f);
  }
  return out;
}
