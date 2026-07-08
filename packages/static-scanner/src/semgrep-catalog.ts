import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';
import { defaultRulesetPath } from './semgrep-runner.js';

/** A bundled Semgrep rule's MCP metadata, for `rules list` / `explain`. Parsed
 * from the same ruleset yaml the scanner runs, so the catalog cannot drift. */
export interface SemgrepRuleInfo {
  mcpId: string;
  semgrepId: string;
  title: string;
  category: string;
  severity: string;
  confidence: number;
  capability?: string;
  impact: string;
  remediation: string;
  cwe?: string;
  references: string[];
  languages: string[];
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

/** Parse the bundled ruleset and return one entry per rule with mcp metadata.
 * Never throws — a malformed file yields an empty list. */
export function listSemgrepRules(rulesetPath: string = defaultRulesetPath()): SemgrepRuleInfo[] {
  let doc: unknown;
  try {
    doc = load(readFileSync(rulesetPath, 'utf8'));
  } catch {
    return [];
  }
  const rules = (doc as { rules?: unknown })?.rules;
  if (!Array.isArray(rules)) return [];
  const out: SemgrepRuleInfo[] = [];
  for (const raw of rules) {
    const r = raw as { id?: unknown; languages?: unknown; metadata?: Record<string, unknown> };
    const md = r.metadata ?? {};
    const mcpId = str(md.mcp_id);
    const title = str(md.mcp_title);
    const category = str(md.mcp_category);
    const severity = str(md.mcp_severity);
    const impact = str(md.mcp_impact);
    const remediation = str(md.mcp_remediation);
    if (!mcpId || !title || !category || !severity || !impact || !remediation) continue;
    const refs = Array.isArray(md.references) ? md.references.filter((x): x is string => typeof x === 'string') : [];
    const langs = Array.isArray(r.languages) ? r.languages.filter((x): x is string => typeof x === 'string') : [];
    const conf = typeof md.mcp_confidence === 'string' ? Number(md.mcp_confidence) : NaN;
    out.push({
      mcpId,
      semgrepId: str(r.id) ?? mcpId,
      title,
      category,
      severity,
      confidence: Number.isFinite(conf) ? conf : 0.5,
      capability: str(md.mcp_capability),
      impact,
      remediation,
      cwe: str(md.mcp_cwe),
      references: refs,
      languages: langs,
    });
  }
  return out;
}

/** Look up one bundled Semgrep rule by its MCP id (case-insensitive). */
export function getSemgrepRuleById(id: string, rulesetPath: string = defaultRulesetPath()): SemgrepRuleInfo | undefined {
  const target = id.toUpperCase();
  return listSemgrepRules(rulesetPath).find((r) => r.mcpId.toUpperCase() === target);
}
