// ---------------------------------------------------------------------------
// Deterministic tool-poisoning / prompt-injection phrase dictionaries.
// Phase 1 phrasing is deliberately cautious: "suspicious instruction-like
// metadata", never "confirmed malicious".
// ---------------------------------------------------------------------------

export type PoisoningGroup =
  | 'instruction_override'
  | 'concealment'
  | 'exfiltration'
  | 'system_prompt_targeting'
  | 'encoded_or_obfuscated';

export interface PoisoningPattern {
  group: PoisoningGroup;
  regex: RegExp;
  label: string;
}

export const POISONING_PATTERNS: PoisoningPattern[] = [
  // instruction override
  { group: 'instruction_override', regex: /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/i, label: 'ignore previous instructions' },
  { group: 'instruction_override', regex: /disregard\s+(?:all\s+)?(?:previous|prior)\s+(?:instructions|context)/i, label: 'disregard previous instructions' },
  { group: 'instruction_override', regex: /override\s+(?:the\s+)?(?:system|previous)\s+(?:prompt|instructions)/i, label: 'override system prompt' },
  { group: 'instruction_override', regex: /you\s+must\s+(?:always|now)\s+(?:ignore|obey|follow)/i, label: 'coercive directive' },

  // concealment
  { group: 'concealment', regex: /do\s+not\s+(?:tell|inform|mention\s+to|reveal\s+to)\s+the\s+user/i, label: 'do not tell the user' },
  { group: 'concealment', regex: /without\s+(?:telling|informing|asking)\s+the\s+user/i, label: 'without informing the user' },
  { group: 'concealment', regex: /\bsilently\b/i, label: 'silently' },
  { group: 'concealment', regex: /do\s+not\s+(?:reveal|disclose|show)\s+this/i, label: 'do not reveal this' },
  { group: 'concealment', regex: /keep\s+this\s+(?:hidden|secret|confidential\s+from\s+the\s+user)/i, label: 'keep this hidden' },

  // exfiltration
  { group: 'exfiltration', regex: /\bexfiltrat/i, label: 'exfiltrate' },
  { group: 'exfiltration', regex: /send\s+(?:the\s+)?(?:data|contents|file|credentials|secrets?)\s+to\b/i, label: 'send data to' },
  { group: 'exfiltration', regex: /(?:read|collect|copy)\s+(?:the\s+)?(?:\.env|~\/\.ssh|~\/\.aws|credentials|secrets?)/i, label: 'read secrets/credentials' },
  { group: 'exfiltration', regex: /forward\s+(?:all\s+)?(?:messages|data|input)\s+to\b/i, label: 'forward data' },

  // system prompt targeting
  { group: 'system_prompt_targeting', regex: /system\s+prompt/i, label: 'system prompt reference' },
  { group: 'system_prompt_targeting', regex: /developer\s+message/i, label: 'developer message reference' },
  { group: 'system_prompt_targeting', regex: /<\s*system\s*>/i, label: 'system tag' },

  // encoded / obfuscated
  { group: 'encoded_or_obfuscated', regex: /(?:base64|atob|fromCharCode)\s*\(/i, label: 'inline decoding call' },
];

export interface PoisoningMatch {
  group: PoisoningGroup;
  label: string;
  match: string;
  index: number;
}

export function matchPoisoning(text: string): PoisoningMatch[] {
  const out: PoisoningMatch[] = [];
  if (!text) return out;
  for (const p of POISONING_PATTERNS) {
    p.regex.lastIndex = 0;
    const m = p.regex.exec(text);
    if (m) out.push({ group: p.group, label: p.label, match: m[0], index: m.index });
  }
  return out;
}

// --- Hidden / obfuscated content detectors ---

const ZERO_WIDTH_RE = /[​-‍⁠﻿]/;
const BIDI_CONTROL_RE = /[‪-‮⁦-⁩]/;
const LONG_BASE64_RE = /\b[A-Za-z0-9+/]{40,}={0,2}\b/;

export function hasZeroWidth(text: string): boolean {
  return ZERO_WIDTH_RE.test(text);
}

export function hasBidiControl(text: string): boolean {
  return BIDI_CONTROL_RE.test(text);
}

export function hasLongBase64(text: string): boolean {
  const m = LONG_BASE64_RE.exec(text);
  if (!m) return false;
  // Guard against ordinary long identifiers/hashes: require mixed case + digits.
  const s = m[0];
  return /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s);
}
