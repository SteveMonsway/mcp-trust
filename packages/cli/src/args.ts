import type { OutputFormat, SandboxKind, Severity } from '@mcp-trust/core';

export interface ParsedArgs {
  command: string;
  positionals: string[];
  flags: Map<string, string | boolean>;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const [command = 'help', ...rest] = argv;
  const positionals: string[] = [];
  const flags = new Map<string, string | boolean>();
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]!;
    if (a.startsWith('--')) {
      const body = a.slice(2);
      const eq = body.indexOf('=');
      if (eq >= 0) {
        flags.set(body.slice(0, eq), body.slice(eq + 1));
      } else {
        const next = rest[i + 1];
        if (next && !next.startsWith('-')) {
          flags.set(body, next);
          i++;
        } else {
          flags.set(body, true);
        }
      }
    } else if (a.startsWith('-') && a.length === 2) {
      const key = a === '-o' ? 'output' : a.slice(1);
      const next = rest[i + 1];
      if (next && !next.startsWith('-')) {
        flags.set(key, next);
        i++;
      } else {
        flags.set(key, true);
      }
    } else {
      positionals.push(a);
    }
  }
  return { command, positionals, flags };
}

const VALID_FORMATS: OutputFormat[] = ['console', 'json', 'md', 'html', 'sarif'];
const VALID_SEVERITIES: Severity[] = ['info', 'low', 'medium', 'high', 'critical'];

export function parseFormats(value: string | boolean | undefined): OutputFormat[] {
  if (typeof value !== 'string') return ['console', 'json', 'md'];
  const parts = value
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is OutputFormat => (VALID_FORMATS as string[]).includes(s));
  return parts.length > 0 ? parts : ['console', 'json', 'md'];
}

export function parseFailOn(value: string | boolean | undefined): Severity {
  if (typeof value === 'string' && (VALID_SEVERITIES as string[]).includes(value)) {
    return value as Severity;
  }
  return 'high';
}

export function parseSandbox(value: string | boolean | undefined): SandboxKind {
  return value === 'docker' ? 'docker' : 'none';
}

/** Split a comma-separated --mcp-args value into an argv list. */
export function parseMcpArgs(value: string | boolean | undefined): string[] | undefined {
  if (typeof value !== 'string') return undefined;
  const parts = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : undefined;
}

export function parseTimeout(value: string | boolean | undefined): number {
  if (typeof value !== 'string') return 30_000;
  const m = /^(\d+)(ms|s)?$/.exec(value.trim());
  if (!m) return 30_000;
  const n = Number(m[1]);
  if (m[2] === 'ms') return n;
  if (m[2] === 's') return n * 1000;
  return n; // bare number = milliseconds
}
