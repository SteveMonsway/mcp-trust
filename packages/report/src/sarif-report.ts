import {
  sanitizeUntrustedText,
  SEVERITY_ORDER,
  type Finding,
  type ScanResult,
  type Severity,
} from '@mcp-trust/core';

// ---------------------------------------------------------------------------
// SARIF 2.1.0 output (TZ §9.3). Enables GitHub Code Scanning annotations.
//
// Design invariants:
// - Never fabricate a location. `region` is emitted only when a finding carries
//   a concrete line (>= 1); `physicalLocation` only when it carries a file.
//   Findings with neither become non-located results (valid SARIF; GitHub
//   attributes them to the repo root) — honest over invented line numbers.
// - Descriptive text (title/impact/remediation) comes from our own rule /
//   Semgrep-ruleset dictionaries (trusted). Target-derived strings (file paths)
//   are treated as hostile: sanitized (control/ANSI stripped) before emission.
// - `finding.fingerprint` (already redacted+stable) drives partialFingerprints
//   so GitHub can track the same alert across commits.
// ---------------------------------------------------------------------------

const SARIF_VERSION = '2.1.0';
const SARIF_SCHEMA = 'https://json.schemastore.org/sarif-2.1.0.json';
const INFORMATION_URI = 'https://github.com/mcptrust/mcp-trust';

/** SARIF result/rule level. GitHub also reads `security-severity` (below). */
type SarifLevel = 'error' | 'warning' | 'note' | 'none';

function sarifLevel(sev: Severity): SarifLevel {
  switch (sev) {
    case 'critical':
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
    case 'info':
      return 'note';
  }
}

/** GitHub Code Scanning maps this numeric string (0.0–10.0) to its own bands
 * (critical ≥ 9.0, high 7.0–8.9, medium 4.0–6.9, low < 4.0). */
function securitySeverity(sev: Severity): string {
  switch (sev) {
    case 'critical':
      return '9.5';
    case 'high':
      return '8.0';
    case 'medium':
      return '5.5';
    case 'low':
      return '3.5';
    case 'info':
      return '1.0';
  }
}

/** Normalize a target-derived (untrusted) file path into a relative,
 * forward-slash, in-tree SARIF artifact URI. Strips control/ANSI, converts
 * backslashes, and drops `.` / absolute roots. A path that still climbs out of
 * the tree (`..` segment) is rejected → '' so the caller emits NO location
 * rather than mis-annotating an innocent in-repo file. */
function toArtifactUri(file: string): string {
  const cleaned = (sanitizeUntrustedText(file, 1024) ?? '').replace(/\\/g, '/');
  const segments = cleaned.split('/').filter((s) => s !== '' && s !== '.');
  if (segments.some((s) => s === '..')) return ''; // path escapes the workspace
  return segments.join('/');
}

/** CWE ids (`CWE-78`) → GitHub-recognized tag form (`external/cwe/cwe-78`). */
function cweTag(cwe: string): string | undefined {
  const m = /cwe[-_]?(\d+)/i.exec(cwe);
  return m ? `external/cwe/cwe-${m[1]}` : undefined;
}

interface SarifRuleDescriptor {
  id: string;
  shortDescription: { text: string };
  fullDescription: { text: string };
  helpUri?: string;
  help: { text: string };
  defaultConfiguration: { level: SarifLevel };
  properties: Record<string, unknown>;
}

/** Collapse whitespace/control in a trusted descriptive string for a one-line
 * SARIF text field. (Fields are our own, but stay defensive.) */
function oneLine(s: string, max = 2000): string {
  return sanitizeUntrustedText(s, max) ?? '';
}

/** Build the deduplicated rule descriptors and an id → index map, in first-seen
 * order so `ruleIndex` stays stable and points into `driver.rules`. */
function buildRules(findings: Finding[]): {
  rules: SarifRuleDescriptor[];
  indexById: Map<string, number>;
} {
  const rules: SarifRuleDescriptor[] = [];
  const indexById = new Map<string, number>();
  for (const f of findings) {
    if (indexById.has(f.ruleId)) continue;
    indexById.set(f.ruleId, rules.length);
    const tags = ['security', `category/${f.category}`];
    for (const c of f.cwe ?? []) {
      const t = cweTag(c);
      if (t) tags.push(t);
    }
    for (const o of f.owaspLlm ?? []) tags.push(`owasp-llm/${sanitizeUntrustedText(o, 64)}`);
    const descriptor: SarifRuleDescriptor = {
      id: f.ruleId,
      shortDescription: { text: oneLine(f.title, 300) },
      fullDescription: { text: oneLine(f.description) },
      help: { text: oneLine(f.remediation) },
      defaultConfiguration: { level: sarifLevel(f.severity) },
      properties: {
        tags,
        'security-severity': securitySeverity(f.severity),
        category: f.category,
      },
    };
    const helpUri = f.references.find((r) => typeof r.url === 'string' && /^https?:\/\//.test(r.url))?.url;
    if (helpUri) descriptor.helpUri = helpUri;
    rules.push(descriptor);
  }
  return { rules, indexById };
}

interface SarifResult {
  ruleId: string;
  ruleIndex: number;
  level: SarifLevel;
  message: { text: string };
  locations?: unknown[];
  partialFingerprints?: Record<string, string>;
  properties: Record<string, unknown>;
}

function buildResult(f: Finding, ruleIndex: number): SarifResult {
  const message = oneLine(`${f.title}. ${f.impact} Remediation: ${f.remediation}`, 3000);
  const result: SarifResult = {
    ruleId: f.ruleId,
    ruleIndex,
    level: sarifLevel(f.severity),
    message: { text: message },
    partialFingerprints: { 'mcpTrust/v1': f.fingerprint },
    properties: {
      severity: f.severity,
      confidence: f.confidence,
      category: f.category,
    },
  };

  // Location: pick the first evidence entry that names a file. `region` only
  // when a real line exists — we never invent line 1 for line-less findings.
  const ev = f.evidence.find((e) => typeof e.file === 'string' && e.file.length > 0);
  if (ev?.file) {
    const uri = toArtifactUri(ev.file);
    if (uri) {
      const physicalLocation: Record<string, unknown> = {
        artifactLocation: { uri },
      };
      if (typeof ev.line === 'number' && ev.line >= 1) {
        const region: Record<string, number> = { startLine: ev.line };
        if (typeof ev.column === 'number' && ev.column >= 1) region.startColumn = ev.column;
        if (typeof ev.endLine === 'number' && ev.endLine >= ev.line) region.endLine = ev.endLine;
        physicalLocation.region = region;
      }
      result.locations = [{ physicalLocation }];
    }
  }
  return result;
}

/** Serialize the scan result as SARIF 2.1.0 (single run). */
export function renderSarif(result: ScanResult): string {
  // Emit findings most-severe first for deterministic, review-friendly output.
  const findings = [...result.findings].sort(
    (a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity],
  );
  const { rules, indexById } = buildRules(findings);
  const results = findings.map((f) => buildResult(f, indexById.get(f.ruleId)!));

  const sarif = {
    $schema: SARIF_SCHEMA,
    version: SARIF_VERSION,
    runs: [
      {
        tool: {
          driver: {
            name: 'MCP Trust',
            informationUri: INFORMATION_URI,
            version: result.scanner.version,
            rules,
          },
        },
        results,
        properties: {
          decision: result.score.decision,
          risk: result.score.risk,
          score: result.score.overall,
          confidence: result.score.confidence,
        },
      },
    ],
  };
  return JSON.stringify(sarif, null, 2) + '\n';
}
