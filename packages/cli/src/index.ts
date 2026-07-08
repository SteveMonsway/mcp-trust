#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve as resolvePath } from 'node:path';
import { exceedsThreshold, SCANNER_VERSION, type ScanOptions, type ScanResult, type ScanTarget } from '@mcp-trust/core';
import { parseTarget } from '@mcp-trust/resolvers';
import { getRuleById, listRules } from '@mcp-trust/rules';
import { getSemgrepRuleById, listSemgrepRules } from '@mcp-trust/static-scanner';
import { renderJson, renderMarkdown, renderHtml, renderSarif, renderPrComment } from '@mcp-trust/report';
import { runScan } from './pipeline.js';
import { cmdBench } from './commands/bench.js';
import { renderConsole } from './console-renderer.js';
import { parseArgs, parseFailOn, parseFormats, parseMcpArgs, parseSandbox, parseTimeout } from './args.js';

// Exit codes (TZ §10.3)
const EXIT = { OK: 0, THRESHOLD: 1, SCANNER_ERROR: 2, TARGET_ERROR: 3, INVALID_CONFIG: 4, SANDBOX_FAILED: 5 };

async function main(): Promise<number> {
  const { command, positionals, flags } = parseArgs(process.argv.slice(2));

  switch (command) {
    case 'scan':
      return cmdScan(positionals, flags);
    case 'bench':
      return cmdBench(positionals, flags);
    case 'rules':
      return cmdRules(positionals);
    case 'explain':
      return cmdExplain(positionals);
    case 'version':
    case '--version':
    case '-v':
      process.stdout.write(`mcp-trust ${SCANNER_VERSION}\n`);
      return EXIT.OK;
    case 'help':
    case '--help':
    case '-h':
    default:
      printHelp();
      return EXIT.OK;
  }
}

function slugify(t: ScanTarget): string {
  const base =
    t.type === 'github'
      ? `${t.owner}-${t.repo}`
      : t.type === 'npm'
        ? t.packageName
        : t.type === 'local' || t.type === 'config'
          ? (t.path.split(/[\\/]/).pop() ?? 'target').replace(/\.[^.]+$/, '')
          : t.type;
  return base.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').toLowerCase();
}

async function cmdScan(positionals: string[], flags: ParsedFlags): Promise<number> {
  const targetStr = positionals[0];
  if (!targetStr) {
    process.stderr.write('Error: missing target.\nUsage: mcp-trust scan <target> [options]\n');
    return EXIT.TARGET_ERROR;
  }

  const parsed = parseTarget(targetStr);
  if (!parsed.ok) {
    process.stderr.write(`Error (${parsed.reason}): ${parsed.message}\n`);
    return EXIT.TARGET_ERROR;
  }

  const introspect = flags.get('introspect') === true || flags.get('introspect') === 'true';
  const sandbox = parseSandbox(flags.get('sandbox'));
  const mcpCommand = typeof flags.get('mcp-command') === 'string' ? (flags.get('mcp-command') as string) : undefined;
  const options: ScanOptions = {
    formats: parseFormats(flags.get('format')),
    outputDir: typeof flags.get('output') === 'string' ? (flags.get('output') as string) : 'reports',
    failOn: parseFailOn(flags.get('fail-on')),
    // --introspect implies allowing execution (host for trusted fixtures, docker otherwise).
    noExec: !introspect,
    introspect,
    sandbox,
    semgrep: flags.get('no-semgrep') !== true,
    mcpCommand,
    mcpArgs: parseMcpArgs(flags.get('mcp-args')),
    timeoutMs: parseTimeout(flags.get('timeout')),
  };

  let result: ScanResult;
  try {
    result = await runScan(parsed.target, options);
  } catch (err) {
    process.stderr.write(`Scanner error: ${err instanceof Error ? err.stack ?? err.message : String(err)}\n`);
    return EXIT.SCANNER_ERROR;
  }

  const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
  if (options.formats.includes('console')) {
    process.stdout.write(renderConsole(result, Boolean(useColor)) + '\n');
  }

  const invokeCwd = process.env.INIT_CWD ?? process.cwd();
  const outDir = resolvePath(invokeCwd, options.outputDir ?? 'reports');
  const written: string[] = [];
  const write = (ext: string, content: string) => {
    mkdirSync(outDir, { recursive: true });
    const file = join(outDir, `${slugify(parsed.target)}.${ext}`);
    writeFileSync(file, content);
    written.push(file);
  };
  if (options.formats.includes('json')) write('json', renderJson(result));
  if (options.formats.includes('md')) write('md', renderMarkdown(result));
  if (options.formats.includes('sarif')) write('sarif', renderSarif(result));
  if (options.formats.includes('html')) write('html', renderHtml(result));
  // Compact PR-comment body for the GitHub Action (TZ §11.2). Opt-in so normal
  // scans stay uncluttered; the Action passes --emit-pr-comment.
  if (flags.get('emit-pr-comment') === true || flags.get('emit-pr-comment') === 'true') {
    const reportUrl = typeof flags.get('report-url') === 'string' ? (flags.get('report-url') as string) : undefined;
    write('pr-comment.md', renderPrComment(result, reportUrl));
  }
  if (written.length > 0) {
    process.stdout.write(`\nReports written:\n${written.map((f) => `  ${f}`).join('\n')}\n`);
  }

  // A requested docker sandbox that could not run is a hard failure (TZ §10.3),
  // not a silent fallback — surface exit 5 even if no findings exceed threshold.
  if (result.coverage.introspection === 'failed_sandbox_unavailable') {
    process.stderr.write('Error: Docker sandbox requested but Docker is not available.\n');
    return EXIT.SANDBOX_FAILED;
  }

  return exceedsThreshold(result.findings, options.failOn) ? EXIT.THRESHOLD : EXIT.OK;
}

function cmdRules(positionals: string[]): number {
  const sub = positionals[0] ?? 'list';
  if (sub !== 'list') {
    process.stderr.write(`Unknown rules subcommand "${sub}". Try: mcp-trust rules list\n`);
    return EXIT.OK;
  }
  const rows = listRules();
  const sg = listSemgrepRules();
  process.stdout.write(`MCP Trust rules (${rows.length} deterministic + ${sg.length} semgrep AST):\n\n`);
  for (const r of rows) {
    process.stdout.write(`  ${r.id.padEnd(16)} [${r.severity.padEnd(8)}] ${r.category.padEnd(14)} ${r.title}\n`);
  }
  if (sg.length > 0) {
    process.stdout.write(`\n  Semgrep AST rules (require the semgrep binary at scan time):\n`);
    for (const r of sg) {
      process.stdout.write(`  ${r.mcpId.padEnd(16)} [${r.severity.padEnd(8)}] ${r.category.padEnd(14)} ${r.title}\n`);
    }
  }
  return EXIT.OK;
}

function cmdExplain(positionals: string[]): number {
  const id = positionals[0];
  if (!id) {
    process.stderr.write('Usage: mcp-trust explain <rule-id>\n');
    return EXIT.OK;
  }
  const rule = getRuleById(id.toUpperCase());
  if (!rule) {
    const sg = getSemgrepRuleById(id);
    if (sg) {
      const lines = [
        `${sg.mcpId}: ${sg.title}`,
        `Severity: ${sg.severity}   Category: ${sg.category}   Confidence: ${sg.confidence}`,
        `Engine: semgrep (${sg.semgrepId})   Languages: ${sg.languages.join(', ')}`,
        '',
        sg.impact,
        '',
        `Remediation: ${sg.remediation}`,
      ];
      if (sg.cwe) lines.push('', `CWE: ${sg.cwe}`);
      if (sg.references.length) lines.push('', 'References:', ...sg.references.map((u) => `  - ${u}`));
      process.stdout.write(lines.join('\n') + '\n');
      return EXIT.OK;
    }
    process.stderr.write(`Unknown rule "${id}".\n`);
    return EXIT.OK;
  }
  const out = [
    `${rule.id}: ${rule.title}`,
    `Severity: ${rule.defaultSeverity}   Category: ${rule.category}`,
    `Applies to: ${rule.appliesTo.join(', ')}`,
    '',
    rule.description,
    '',
    `Remediation: ${rule.remediation}`,
  ];
  if (rule.falsePositiveNotes) out.push('', `False positives: ${rule.falsePositiveNotes}`);
  if (rule.references?.length) out.push('', 'References:', ...rule.references.map((r) => `  - ${r.title}: ${r.url}`));
  process.stdout.write(out.join('\n') + '\n');
  return EXIT.OK;
}

function printHelp(): void {
  process.stdout.write(`mcp-trust — evidence-based preflight scanner for MCP servers

Usage:
  mcp-trust scan <target> [options]
  mcp-trust bench scan <seed.yml> [--out dir]   Benchmark a seed list of targets
  mcp-trust bench render [--out dir]            Render md/html + index.json
  mcp-trust rules list
  mcp-trust explain <rule-id>
  mcp-trust version

Targets:
  github:owner/repo          Scan a public GitHub repository (shallow clone)
  npm:package                Scan npm package metadata
  ./path/to/config.json      Scan a local MCP config file
  ./path/to/repo             Scan a local directory

Options:
  --format <list>   Output formats: console,json,md,html,sarif (default: console,json,md)
                    sarif → SARIF 2.1.0 for GitHub Code Scanning. html → self-contained report.
  --output <dir>    Directory for json/md/html/sarif reports (default: reports)
  --emit-pr-comment Also write <target>.pr-comment.md (compact PR summary; used
                    by the GitHub Action). --report-url <url> links the full report.
  --fail-on <sev>   Exit non-zero at/above severity: low|medium|high|critical (default: high)
  --introspect      Run the MCP server to list tools/resources/prompts.
                    Without --sandbox: trusted fixtures only (host, Level 1).
  --sandbox docker  Run introspection inside a locked-down Docker container
                    (Level 2: no network, read-only, no host env/secrets).
                    Required to introspect real (non-fixture) targets.
  --mcp-command <c> Override server command for introspection (e.g. node).
  --mcp-args <list> Comma-separated args for --mcp-command (e.g. server.js).
  --no-semgrep      Skip the bundled Semgrep AST ruleset (on by default when
                    the semgrep binary is available).
  --timeout <t>     Resolve/introspect timeout, e.g. 30s (default: 30s)

Exit codes: 0 ok · 1 threshold exceeded · 2 scanner error · 3 target error · 5 sandbox failed
`);
}

type ParsedFlags = ReturnType<typeof parseArgs>['flags'];

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    process.stderr.write(`Fatal: ${err instanceof Error ? err.stack ?? err.message : String(err)}\n`);
    process.exit(EXIT.SCANNER_ERROR);
  });
