# MCP Trust

Evidence-based preflight scanner for Model Context Protocol (MCP) servers.

Check MCP servers before your AI agents use them.

> MCP servers can read files, execute commands, access databases, send emails and
> connect AI agents to sensitive tools. MCP Trust maps what a server can do, scans
> its install command, code, dependencies and metadata, then returns an
> **approve / approve-with-restrictions / needs-review / block** decision with evidence.

This repository covers **Phase 0 → Phase 4**: a working CLI, a deterministic rule
engine (30 rules) plus 12 Semgrep AST rules, config/static/metadata scanning, real
`@modelcontextprotocol/sdk` introspection with a Docker sandbox (Level 2),
JSON / Markdown / **HTML** / **SARIF** reports with a **GitHub Action** (Code Scanning + PR comments),
and a **public benchmark** over real MCP servers (see [`docs/benchmark.md`](docs/benchmark.md)).

## Quickstart

Install from npm (no clone needed):

```bash
# One-off, no install:
npx @mcp-trust/cli scan github:owner/repo

# Or install globally:
npm install -g @mcp-trust/cli
mcp-trust scan github:owner/repo          # scan a public GitHub repo
mcp-trust scan npm:@org/mcp-server        # scan npm package metadata
mcp-trust scan ./claude_desktop_config.json   # scan a local MCP config
mcp-trust scan ./path/to/repo --format json,md,html,sarif
```

**Where the report goes:** files are written to `./reports/<slug>.{json,md,html,sarif}`
(change the folder with `--output <dir>`). Open the `.html` in a browser, or read the `.md`.
Exit code is non-zero when findings meet `--fail-on` (default `high`), so it works as a CI gate.

<details><summary>From source (for contributors)</summary>

```bash
pnpm install && pnpm build
pnpm --filter @mcp-trust/cli dev scan ./fixtures/repos/js-exec --format json,md,sarif
```

</details>

## GitHub Action

Run MCP Trust on every pull request — uploads SARIF to Code Scanning, posts a
summary comment, and fails the job above a severity threshold (TZ §11):

```yaml
name: MCP Trust Scan
on: [pull_request]
jobs:
  mcp-trust:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write # SARIF upload
      pull-requests: write # PR comment
    steps:
      - uses: actions/checkout@v4
      - uses: SteveMonsway/mcp-trust/packages/action@v0.5.0 # or @main
        with:
          fail-on: high # low|medium|high|critical
          upload-sarif: true
          comment-pr: true
```

Inputs: `target` (default: workspace), `fail-on`, `output` (`sarif,md,json`),
`upload-sarif`, `comment-pr`, `no-semgrep`. Outputs: `decision`, `risk`, `score`,
`sarif-file`, `exceeded`. Action definition: [`packages/action/action.yml`](packages/action/action.yml).

## Public benchmark

MCP Trust ships a reproducible benchmark over **452 real, public MCP servers**
(JavaScript / TypeScript / Python; `registry-seed/seed-targets.yml`). Latest run:
**32 BLOCK · 91 NEEDS_REVIEW · 112 APPROVE_WITH_RESTRICTIONS · 217 APPROVE**.

```bash
pnpm scan:seed        # clone + static + Semgrep for each seed target
pnpm reports:public   # → public-reports/<slug>.{md,html} + index.json
```

Every target gets a Markdown + self-contained HTML report; `public-reports/index.json`
is the machine-readable index (decision / risk / score / findings per target + a run
summary). A **BLOCK is capability evidence in *runtime* code, not a malware verdict** —
findings in tests, examples and build scripts are severity-capped so they don't drive a
false BLOCK, and code in languages MCP Trust can't analyze (Go, Rust, …) is flagged with a
**⚠️ Limitations** note so an APPROVE is never misread as a clean bill.

**Browse the reports:** [`public-reports/index.html`](public-reports/index.html) (searchable/filterable) or [`public-reports/`](public-reports/README.md) (by server /
company name) · write-up: [`docs/benchmark.md`](docs/benchmark.md) · methodology:
[`docs/blog/mcp-trust-public-benchmark.md`](docs/blog/mcp-trust-public-benchmark.md).

## What MCP Trust checks

- **Install/config risks** — unpinned `npx`/`uvx`, `curl | sh`, `sudo`, inline shell,
  embedded secrets, sensitive paths, plain-HTTP endpoints, broad home/root access.
- **Code risks (regex/AST-lite)** — `child_process.exec`, `execSync`, `eval`/`Function`,
  Python `subprocess(shell=True)`/`os.system`, arbitrary file write/delete, secret env access.
- **Tool/prompt metadata (tool poisoning)** — instruction-override, concealment,
  exfiltration and system-prompt-targeting phrasing, hidden/encoded content.
- **Capability map** — inferred filesystem / shell / network / credential capabilities,
  from runtime introspection (trusted fixtures) or static inference.
- **Supply chain** — missing repository, repo/package mismatch, install scripts,
  floating versions in config, missing security policy.

## What MCP Trust does **not** do

MCP Trust is a **risk assessment tool, not a guarantee** that a server is safe. It does
not replace code review, sandboxing, endpoint security or vendor risk management.

By design:

- It **never executes** untrusted code outside a sandbox. On the host, runtime
  introspection runs **only** against trusted fixture paths (`fixtures/mcp/…`,
  `examples/…`, `mock-mcp-servers/…`); a real target runs **only** inside the Docker
  sandbox (`--sandbox docker`, Level 2). Otherwise the capability map is built statically.
- Coverage is reported honestly — every report shows what was and wasn't assessed.

## Scoring & decision

Single source of truth in `packages/core/src/scoring/thresholds.ts`:

| Score | Risk band | Decision |
|---|---|---|
| 0–29 | LOW | APPROVE |
| 30–59 | MEDIUM | APPROVE_WITH_RESTRICTIONS |
| 60–79 | HIGH | NEEDS_REVIEW |
| 80–100 | CRITICAL | BLOCK |

Severity overrides can **raise** (never lower) a decision — e.g. a confident critical
finding forces `BLOCK`; `curl | sh` / `sudo` / an embedded secret force at least
`NEEDS_REVIEW`. See [docs/scoring.md](docs/scoring.md).

## Commands

```bash
mcp-trust scan <target> [--format console,json,md,html,sarif] [--output dir] [--fail-on high] \
                        [--introspect] [--sandbox docker] [--no-semgrep] [--timeout 30s]
mcp-trust bench scan <seed.yml> [--out dir]   # scan a seed list of public servers
mcp-trust bench render [--out dir]            # render md/html per target + index.json
mcp-trust rules list
mcp-trust explain <rule-id>
mcp-trust version
```

Exit codes: `0` ok · `1` threshold exceeded · `2` scanner error · `3` target error · `5` sandbox failed.

## Rules

30 rules are implemented in Phase 1. See [docs/rule-catalog.md](docs/rule-catalog.md)
for the full catalog (implemented + planned).

## Roadmap

Short version below; full user/company roadmap in [ROADMAP.md](ROADMAP.md).

- **Phase 1–4 (done):** CLI, 30+12 rules, Docker sandbox, `@modelcontextprotocol/sdk`
  introspection, JSON/MD/**HTML**/**SARIF**, GitHub Action, and a public benchmark of 452 servers.
- **Next (free):** policy file (`--policy`), rules for more languages (Go/Rust/…), npm releases.
- **Later (paid, teams):** hosted API, dashboard, private/continuous scans, Slack, GitHub App.

## Development

```bash
pnpm install
pnpm build       # turbo build all packages
pnpm test        # vitest (159 tests)
pnpm typecheck   # tsc --noEmit across packages
```

## Disclaimer

MCP Trust provides evidence-based risk assessment. It does not guarantee that a server
is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

## License

Apache-2.0.
