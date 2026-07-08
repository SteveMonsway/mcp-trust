# MCP Trust — `@mcp-trust/cli`

**Evidence-based preflight security scanner for Model Context Protocol (MCP) servers.**
Check what an MCP server can do — before your AI agent uses it.

MCP servers can run shell commands, read files, query databases and call APIs. MCP Trust maps
what a server can do, scans its install command, code, dependencies and metadata, then returns an
**APPROVE / APPROVE_WITH_RESTRICTIONS / NEEDS_REVIEW / BLOCK** decision with evidence.

## Usage — no install needed

```bash
npx @mcp-trust/cli scan github:owner/repo        # scan a public GitHub repo
npx @mcp-trust/cli scan npm:@org/mcp-server      # scan npm package metadata
npx @mcp-trust/cli scan ./claude_desktop_config.json   # scan a local MCP config
```

Or install globally:

```bash
npm install -g @mcp-trust/cli
mcp-trust scan ./path/to/repo --format json,md,html,sarif
```

**Reports** are written to `./reports/<name>.{json,md,html,sarif}` (change with `--output <dir>`).
Open the `.html` in a browser, or read the `.md`. The exit code is non-zero when findings meet
`--fail-on` (default `high`), so it works as a CI gate.

## What it checks

- **Install/config risks** — unpinned `npx`/`uvx`, `curl | sh`, inline shell, embedded secrets,
  sensitive paths, plain-HTTP endpoints.
- **Code risks** — `child_process.exec`, `eval`, arbitrary file write/delete, secret env access
  (30 deterministic rules + 12 Semgrep AST rules for JS/TS/Python; Semgrep runs when the `semgrep`
  binary is on PATH).
- **Tool/prompt metadata** — instruction-override, concealment and exfiltration phrasing.
- **Supply chain** — repo/package mismatch, install scripts, floating versions, missing policy.

Code in languages it can't analyze (Go, Rust, …) is flagged with a ⚠️ Limitations note, so an
APPROVE is never a silent clean bill.

## Options

```
--format <list>   console,json,md,html,sarif (default: console,json,md)
--output <dir>    report directory (default: reports)
--fail-on <sev>   exit non-zero at/above: low|medium|high|critical (default: high)
--sandbox docker  run introspection inside a locked-down Docker container
--no-semgrep      skip the Semgrep AST ruleset
```

## Safety

MCP Trust treats every target as hostile. It **never executes** untrusted code outside a Docker
sandbox, byte/size-caps untrusted output, redacts secrets, and reports coverage honestly. It is a
**risk-assessment tool, not a guarantee** of safety.

## Links

- Source, docs, GitHub Action & public benchmark reports: **https://github.com/SteveMonsway/mcp-trust**
- License: Apache-2.0
