// ---------------------------------------------------------------------------
// Secret redaction. Applied to every snippet/match before it enters a
// finding, a report, a log line, or a fingerprint. Never leak real secrets.
// ---------------------------------------------------------------------------

interface SecretPattern {
  type: string;
  regex: RegExp;
}

// Order matters: more specific patterns first.
const SECRET_PATTERNS: SecretPattern[] = [
  { type: 'private-key', regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g },
  { type: 'aws-access-key', regex: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { type: 'github-token', regex: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g },
  { type: 'slack-token', regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g },
  { type: 'anthropic-key', regex: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g },
  { type: 'openai-key', regex: /\bsk-(?!ant-)[A-Za-z0-9_-]{20,}\b/g },
  { type: 'google-key', regex: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { type: 'jwt', regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
];

// Names that strongly imply a secret value assignment.
const SECRET_ASSIGN_RE =
  /\b([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PASSWD|API[_-]?KEY|ACCESS[_-]?KEY|PRIVATE[_-]?KEY|CLIENT[_-]?SECRET)[A-Z0-9_]*)\b(\s*[:=]\s*)(['"]?)([^\s'",}]{6,})\3/gi;

/** Redact known secret shapes and obvious secret assignments from text. */
export function redact(input: string): string {
  if (!input) return input;
  let out = input;
  for (const { type, regex } of SECRET_PATTERNS) {
    out = out.replace(regex, `<redacted:${type}>`);
  }
  out = out.replace(SECRET_ASSIGN_RE, (_m, name: string, sep: string, quote: string) => {
    return `${name}${sep}${quote}<redacted:secret>${quote}`;
  });
  out = redactHighEntropy(out);
  return out;
}

/** Heuristic: redact long high-entropy tokens that survived the patterns. */
function redactHighEntropy(text: string): string {
  return text.replace(/\b[A-Za-z0-9+/_-]{32,}\b/g, (token) => {
    return shannonEntropy(token) >= 4.0 ? '<redacted:high-entropy>' : token;
  });
}

function shannonEntropy(s: string): number {
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  let entropy = 0;
  for (const count of freq.values()) {
    const p = count / s.length;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

/** True if the value looks like a real secret (used by config secret rule). */
export function looksLikeSecretValue(value: string): boolean {
  if (!value) return false;
  for (const { regex } of SECRET_PATTERNS) {
    regex.lastIndex = 0;
    if (regex.test(value)) return true;
  }
  const trimmed = value.trim();
  if (trimmed.length >= 20 && shannonEntropy(trimmed) >= 3.5 && !/\s/.test(trimmed)) {
    return true;
  }
  return false;
}

/**
 * Neutralize UNTRUSTED text (MCP tool names/descriptions, resource URIs, prompt
 * text) before it enters findings, capability maps, logs or any report/console
 * output. Strips terminal-control sequences (ANSI CSI/OSC) and all C0/C1 control
 * chars — so a malicious server cannot inject terminal escapes, spoof output, or
 * break Markdown tables with newlines — and hard-caps the length so a multi-MB
 * field cannot blow up memory or amplify rule work. Returns a single-line string.
 */
export function sanitizeUntrustedText(input: string, maxLen?: number): string;
export function sanitizeUntrustedText(input: string | undefined, maxLen?: number): string | undefined;
export function sanitizeUntrustedText(input: string | undefined, maxLen = 4000): string | undefined {
  if (input == null) return input;
  let out = input
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, '') // OSC ... (BEL | ST)
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b[@-_][0-?]*[ -/]*[@-~]/g, '') // CSI / other escape sequences
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f\x7f-\x9f]/g, ' ') // remaining control chars (incl \n\r\t) → space
    .replace(/ {2,}/g, ' ')
    .trim();
  if (out.length > maxLen) out = out.slice(0, maxLen) + '…';
  return out;
}

/** True if an env var / key name implies it holds a secret. */
export function isSecretName(name: string): boolean {
  return /(TOKEN|SECRET|PASSWORD|PASSWD|API[_-]?KEY|ACCESS[_-]?KEY|PRIVATE[_-]?KEY|CLIENT[_-]?SECRET|CREDENTIAL)/i.test(
    name,
  );
}
