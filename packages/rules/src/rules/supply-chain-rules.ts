import {
  buildFinding,
  type Finding,
  type ParsedMcpServer,
  type Rule,
  type ScanContext,
} from '@mcp-trust/core';

const PKG_MANAGERS = new Set(['npx', 'uvx', 'bunx']);
const FLOATING_VERSION = /^(latest|next|canary|beta|alpha|\*|x|\d+\.x)$|^[\^~]/i;

/** Version part of a spec: after `==` (uvx) or the last `@` past index 0. */
function versionPart(spec: string): string | undefined {
  const eq = spec.indexOf('==');
  if (eq > 0) return spec.slice(eq + 2);
  const at = spec.lastIndexOf('@');
  if (at > 0) return spec.slice(at + 1);
  return undefined;
}

function floatingVersionInConfig(configs: ParsedMcpServer[]): { server: ParsedMcpServer; spec: string }[] {
  const out: { server: ParsedMcpServer; spec: string }[] = [];
  for (const s of configs) {
    const cmd = (s.command ?? '').split('/').pop() ?? '';
    if (!PKG_MANAGERS.has(cmd)) continue;
    for (const a of s.args) {
      if (a.startsWith('-') || a.startsWith('.') || a.startsWith('/')) continue;
      // Only inspect the version position, so a scope like `@alpha/foo` is not
      // mistaken for a floating `alpha` version.
      const ver = versionPart(a);
      if (ver && FLOATING_VERSION.test(ver)) out.push({ server: s, spec: a });
    }
  }
  return out;
}

export const supplyChainRules: Rule[] = [
  {
    id: 'MCP-SUPPLY-001',
    title: 'Package has no linked source repository',
    description: 'The package metadata does not declare a source repository, reducing auditability and provenance.',
    defaultSeverity: 'low',
    category: 'supply_chain',
    tags: ['supply-chain', 'provenance'],
    appliesTo: ['package-metadata'],
    remediation: 'Prefer packages that declare a verifiable source repository.',
    evaluate(ctx: ScanContext): Finding[] {
      const md = ctx.metadata;
      if (!md || md.name == null) return [];
      if (md.repositoryUrl) return [];
      return [
        buildFinding({
          rule: this,
          target: ctx.target,
          evidence: [{ source: 'package.metadata', match: md.name, snippet: `package ${md.name} has no repository field` }],
          confidence: 0.95,
          impact: 'Without a source repo, the published artifact cannot be readily audited against source.',
        }),
      ];
    },
  },
  {
    id: 'MCP-SUPPLY-002',
    title: 'Declared repository does not match resolved source',
    description: 'The package points at a repository that does not match the resolved source, a possible typosquat or hijack signal.',
    defaultSeverity: 'medium',
    category: 'supply_chain',
    tags: ['supply-chain', 'provenance'],
    appliesTo: ['package-metadata'],
    remediation: 'Verify the package is published from the repository it claims; investigate mismatches before use.',
    evaluate(ctx: ScanContext): Finding[] {
      const md = ctx.metadata;
      if (!md?.repoMismatch) return [];
      return [
        buildFinding({
          rule: this,
          target: ctx.target,
          evidence: [{ source: 'package.metadata', match: md.repositoryUrl ?? '', snippet: `declared repo: ${md.repositoryUrl}` }],
          confidence: 0.7,
          impact: 'A mismatched repository can indicate a hijacked or impersonating package.',
        }),
      ];
    },
  },
  {
    id: 'MCP-SUPPLY-003',
    title: 'Install script present in package',
    description: 'The package declares install/preinstall/postinstall scripts that run automatically on install.',
    defaultSeverity: 'medium',
    category: 'supply_chain',
    tags: ['supply-chain', 'install-script'],
    appliesTo: ['package-metadata'],
    remediation: 'Review install scripts; install with --ignore-scripts where possible and vet what they do.',
    references: [{ title: 'npm scripts', url: 'https://docs.npmjs.com/cli/using-npm/scripts' }],
    evaluate(ctx: ScanContext): Finding[] {
      const scripts = ctx.metadata?.installScripts ?? [];
      const risky = scripts.filter((s) => /^(pre|post)?install$/.test(s.name));
      return risky.map((s) =>
        buildFinding({
          rule: this,
          target: ctx.target,
          evidence: [{ source: `package.scripts.${s.name}`, match: s.name, snippet: `${s.name}: ${s.value}` }],
          confidence: 0.9,
          impact: 'Install scripts execute code on the developer/CI machine at install time.',
        }),
      );
    },
  },
  {
    id: 'MCP-SUPPLY-004',
    title: 'Floating package version in startup command',
    description: 'The startup command references a floating version tag/range (latest, next, ^, ~), so the executed code can change.',
    defaultSeverity: 'low',
    category: 'supply_chain',
    tags: ['supply-chain', 'pinning'],
    appliesTo: ['config'],
    remediation: 'Pin an exact version instead of a floating tag or range.',
    evaluate(ctx: ScanContext): Finding[] {
      return floatingVersionInConfig(ctx.configs).map(({ server, spec }) =>
        buildFinding({
          rule: this,
          target: ctx.target,
          evidence: [{ source: `config.server:${server.name}`, file: server.configFile, match: spec, snippet: spec }],
          confidence: 0.85,
          impact: 'A floating version can pull in a different (possibly malicious) release without notice.',
        }),
      );
    },
  },
  {
    id: 'MCP-SUPPLY-005',
    title: 'No security policy (SECURITY.md) found',
    description: 'The project does not provide a security policy, indicating weaker security maturity/disclosure process.',
    defaultSeverity: 'low',
    category: 'supply_chain',
    tags: ['supply-chain', 'maturity'],
    appliesTo: ['package-metadata'],
    remediation: 'Prefer projects that publish a SECURITY.md with a vulnerability disclosure process.',
    evaluate(ctx: ScanContext): Finding[] {
      const md = ctx.metadata;
      if (!md || md.name == null) return [];
      if (md.hasSecurityPolicy !== false) return [];
      return [
        buildFinding({
          rule: this,
          target: ctx.target,
          evidence: [{ source: 'repo.files', match: 'SECURITY.md', snippet: 'no SECURITY.md found in source' }],
          confidence: 1.0,
          impact: 'Absence of a disclosure process slows remediation of future vulnerabilities.',
        }),
      ];
    },
  },
];
