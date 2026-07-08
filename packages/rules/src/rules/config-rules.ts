import {
  buildFinding,
  isSecretName,
  looksLikeSecretValue,
  TAG_MIN_NEEDS_REVIEW,
  type Evidence,
  type Finding,
  type ParsedMcpServer,
  type Rule,
  type ScanContext,
} from '@mcp-trust/core';

function commandLine(s: ParsedMcpServer): string {
  return [s.command ?? '', ...s.args].join(' ').trim();
}

function serverEvidence(s: ParsedMcpServer, match: string, snippet?: string): Evidence {
  return { source: `config.server:${s.name}`, file: s.configFile, match, snippet: snippet ?? commandLine(s) };
}

/** First non-flag argument that looks like a package spec. */
// npx/uvx/bunx: the package is the first non-flag argument.
const DLX_DIRECT = new Set(['npx', 'uvx', 'bunx']);
// pnpm/yarn/bun: a package is only executed after a `dlx`/`exec` subcommand.
const DLX_SUBCOMMAND = new Set(['pnpm', 'yarn', 'bun']);

function packageArg(s: ParsedMcpServer): string | undefined {
  const cmd = (s.command ?? '').split('/').pop() ?? '';
  if (DLX_DIRECT.has(cmd)) {
    for (const a of s.args) {
      if (a.startsWith('-')) continue;
      return a;
    }
    return undefined;
  }
  if (DLX_SUBCOMMAND.has(cmd)) {
    const idx = s.args.findIndex((a) => a === 'dlx' || a === 'exec');
    if (idx < 0) return undefined; // e.g. `yarn start` is not a package execution
    for (const a of s.args.slice(idx + 1)) {
      if (a.startsWith('-')) continue;
      return a;
    }
  }
  return undefined;
}

function versionOf(spec: string): string | undefined {
  // Python-style pin used by uvx: `ruff==0.1.0`.
  const eq = spec.indexOf('==');
  if (eq > 0) return spec.slice(eq + 2);
  // npm-style: `name@version` or `@scope/name@version` (last '@' after index 0).
  const at = spec.lastIndexOf('@');
  if (at > 0) return spec.slice(at + 1);
  return undefined;
}

export const configRules: Rule[] = [
  {
    id: 'MCP-CONFIG-001',
    title: 'Unpinned package version in MCP startup command',
    description: 'The startup command runs a package via npx/uvx without pinning an exact version, so the code executed can change silently between runs.',
    defaultSeverity: 'medium',
    category: 'config',
    tags: ['config', 'supply-chain'],
    appliesTo: ['config'],
    remediation: 'Pin an exact version, e.g. `npx -y @scope/server@1.2.3`. Avoid `latest`/floating ranges in startup commands.',
    references: [{ title: 'MCP security best practices', url: 'https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices' }],
    falsePositiveNotes: 'Local paths and already-pinned specs are ignored.',
    evaluate(ctx: ScanContext): Finding[] {
      const out: Finding[] = [];
      for (const s of ctx.configs) {
        const pkg = packageArg(s);
        if (!pkg) continue;
        if (pkg.startsWith('.') || pkg.startsWith('/')) continue; // local path
        const ver = versionOf(pkg);
        if (ver === undefined) {
          out.push(
            buildFinding({
              rule: this,
              target: ctx.target,
              evidence: [serverEvidence(s, pkg)],
              confidence: 0.9,
              impact: 'The exact code run at startup is not reproducible and can be replaced by a malicious release.',
            }),
          );
        }
      }
      return out;
    },
  },
  {
    id: 'MCP-CONFIG-002',
    title: 'Pipe-to-shell installer in startup command (curl | sh)',
    description: 'The startup command downloads and pipes a remote script directly into a shell, executing arbitrary remote code.',
    defaultSeverity: 'high',
    category: 'config',
    tags: ['config', TAG_MIN_NEEDS_REVIEW],
    appliesTo: ['config'],
    remediation: 'Never pipe remote scripts into a shell. Install from a pinned, verified package or vendored artifact.',
    evaluate(ctx: ScanContext): Finding[] {
      const re = /\b(curl|wget)\b[^|]{0,500}\|\s*(sudo\s+)?(sh|bash|zsh)\b/i;
      const out: Finding[] = [];
      for (const s of ctx.configs) {
        const line = commandLine(s);
        const m = re.exec(line);
        if (m) {
          out.push(
            buildFinding({
              rule: this,
              target: ctx.target,
              evidence: [serverEvidence(s, m[0])],
              confidence: 0.92,
              impact: 'Arbitrary remote code executes with the user\'s privileges at startup.',
            }),
          );
        }
      }
      return out;
    },
  },
  {
    id: 'MCP-CONFIG-003',
    title: 'sudo used in MCP startup command',
    description: 'The startup command escalates privileges with sudo, running the MCP server as root.',
    defaultSeverity: 'high',
    category: 'config',
    tags: ['config', TAG_MIN_NEEDS_REVIEW],
    appliesTo: ['config'],
    remediation: 'Run MCP servers as an unprivileged user. Remove sudo from startup commands.',
    evaluate(ctx: ScanContext): Finding[] {
      const re = /(^|\s)sudo(\s|$)/;
      const out: Finding[] = [];
      for (const s of ctx.configs) {
        const line = commandLine(s);
        if (re.test(line)) {
          out.push(
            buildFinding({
              rule: this,
              target: ctx.target,
              evidence: [serverEvidence(s, 'sudo')],
              confidence: 0.95,
              impact: 'The server gains root privileges, amplifying the impact of any compromise.',
            }),
          );
        }
      }
      return out;
    },
  },
  {
    id: 'MCP-CONFIG-004',
    title: 'Inline shell execution in startup command',
    description: 'The startup command uses an inline shell (`bash -c`, `sh -c`, PowerShell `-Command`/`-EncodedCommand`), which can hide arbitrary logic.',
    defaultSeverity: 'high',
    category: 'config',
    tags: ['config'],
    appliesTo: ['config'],
    remediation: 'Invoke the server binary directly with explicit arguments instead of an inline shell string.',
    evaluate(ctx: ScanContext): Finding[] {
      const re = /\b(bash|sh|zsh)\s+-c\b|\bpowershell(\.exe)?\s+.{0,500}-(e|enc|encodedcommand|command)\b/i;
      const out: Finding[] = [];
      for (const s of ctx.configs) {
        const line = commandLine(s);
        const m = re.exec(line);
        if (m) {
          out.push(
            buildFinding({
              rule: this,
              target: ctx.target,
              evidence: [serverEvidence(s, m[0])],
              confidence: 0.85,
              impact: 'Inline shell strings can obfuscate destructive or exfiltrating commands.',
            }),
          );
        }
      }
      return out;
    },
  },
  {
    id: 'MCP-CONFIG-005',
    title: 'Secret embedded directly in MCP config',
    description: 'A config env value or header appears to contain a real secret rather than a runtime-injected reference.',
    defaultSeverity: 'high',
    category: 'config',
    tags: ['config', 'secret', TAG_MIN_NEEDS_REVIEW],
    appliesTo: ['config'],
    remediation: 'Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.',
    evaluate(ctx: ScanContext): Finding[] {
      const out: Finding[] = [];
      const isRef = (v: string) => /^\$\{?\w+\}?$/.test(v) || /^<.*>$/.test(v) || /^(changeme|placeholder|your[_-])/i.test(v);
      const scan = (s: ParsedMcpServer, kind: string, entries: Record<string, string>) => {
        for (const [k, v] of Object.entries(entries)) {
          if (!v || isRef(v)) continue;
          const secret = looksLikeSecretValue(v) || (isSecretName(k) && v.length >= 8);
          if (secret) {
            out.push(
              buildFinding({
                rule: this,
                target: ctx.target,
                evidence: [{ source: `config.${kind}:${s.name}.${k}`, file: s.configFile, match: `${k}=`, snippet: `${k}=${v}` }],
                confidence: looksLikeSecretValue(v) ? 0.85 : 0.65,
                impact: 'Committed secrets can be leaked via source control, reports, or shared configs.',
              }),
            );
          }
        }
      };
      for (const s of ctx.configs) {
        scan(s, 'env', s.env);
        scan(s, 'header', s.headers);
      }
      return out;
    },
  },
  {
    id: 'MCP-CONFIG-006',
    title: 'Remote MCP endpoint over plain HTTP (non-loopback)',
    description: 'A remote MCP endpoint uses http:// to a non-loopback host, exposing traffic and tokens to interception.',
    defaultSeverity: 'medium',
    category: 'config',
    tags: ['config', 'transport'],
    appliesTo: ['config'],
    remediation: 'Use https:// for any non-loopback MCP endpoint.',
    evaluate(ctx: ScanContext): Finding[] {
      const out: Finding[] = [];
      for (const s of ctx.configs) {
        if (!s.url) continue;
        const m = /^http:\/\/([^/:]+)/i.exec(s.url);
        if (!m) continue;
        const host = (m[1] ?? '').toLowerCase();
        if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '0.0.0.0') continue;
        out.push(
          buildFinding({
            rule: this,
            target: ctx.target,
            evidence: [{ source: `config.url:${s.name}`, file: s.configFile, match: s.url, snippet: s.url }],
            confidence: 0.9,
            impact: 'Requests and any auth headers can be read or tampered with in transit.',
          }),
        );
      }
      return out;
    },
  },
  {
    id: 'MCP-CONFIG-007',
    title: 'Sensitive local path referenced in config',
    description: 'The config references a sensitive path (~/.ssh, ~/.aws, .env, keychains, /etc/passwd), suggesting access to credentials or secrets.',
    defaultSeverity: 'high',
    category: 'config',
    tags: ['config', 'secret'],
    appliesTo: ['config'],
    remediation: 'Remove sensitive paths from server arguments; scope access to a dedicated non-sensitive directory.',
    evaluate(ctx: ScanContext): Finding[] {
      const re = /(~\/\.ssh|~\/\.aws|~\/\.config|\/etc\/passwd|\bid_rsa\b|\.pem\b|\bkeychain\b|(^|\/|\s)\.env(\b|$))/i;
      const out: Finding[] = [];
      for (const s of ctx.configs) {
        const hay = [...s.args, ...Object.values(s.env), s.cwd ?? ''].join(' ');
        const m = re.exec(hay);
        if (m) {
          out.push(
            buildFinding({
              rule: this,
              target: ctx.target,
              evidence: [serverEvidence(s, m[0], hay.slice(0, 200))],
              confidence: 0.8,
              impact: 'The server may read SSH/cloud credentials or other secrets from the host.',
            }),
          );
        }
      }
      return out;
    },
  },
  {
    id: 'MCP-CONFIG-008',
    title: 'Broad home/root directory access granted to MCP server',
    description: 'The server is granted access to the home directory or filesystem root, far broader than a scoped workspace.',
    defaultSeverity: 'medium',
    category: 'config',
    tags: ['config'],
    appliesTo: ['config'],
    remediation: 'Restrict the allowed directory to a specific project path instead of home or root.',
    evaluate(ctx: ScanContext): Finding[] {
      const out: Finding[] = [];
      for (const s of ctx.configs) {
        for (const a of s.args) {
          const norm = a.trim();
          const broad =
            norm === '~' ||
            norm === '/' ||
            norm === '$HOME' ||
            /^~\/?$/.test(norm) ||
            /^\/(Users|home)\/[^/]+\/?$/.test(norm);
          if (broad) {
            out.push(
              buildFinding({
                rule: this,
                target: ctx.target,
                evidence: [serverEvidence(s, norm)],
                confidence: 0.8,
                impact: 'Broad filesystem scope lets the server read or modify unrelated sensitive files.',
              }),
            );
            break;
          }
        }
      }
      return out;
    },
  },
];
