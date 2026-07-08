# Changelog

All notable changes to MCP Trust. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [0.5.3] — 2026-07-08 — precision tuning (network + redaction)

- **Outbound request with a dynamic URL** (`MCP-SG-JS-005` / `MCP-SG-PY-004`, SSRF) no longer
  by itself forces `NEEDS_REVIEW`. Almost every MCP server makes outbound requests, so this was
  flagging ~half of all servers; it stays a medium finding (visible in the report and capability
  map) but only real drivers (shell exec, exfiltration metadata, hardcoded secrets, …) escalate
  the decision. Real SSRF (URL from tool input) needs taint analysis — tracked as future work.
- `redact()` also collapses a lone `-----BEGIN … PRIVATE KEY-----` header (not just a full block),
  so a report never displays a raw PEM marker.

## [0.5.2] — 2026-07-08 — precision tuning

Data-driven false-positive reduction, validated against the 41-server benchmark:
- **Secret-env access** (`MCP-CODE-007`, `MCP-SG-PY-006`) → **low/informational** and
  deduped per (file, variable). Reading own credentials from env to authenticate is
  normal config, not a vulnerability — it no longer inflates the decision.
- **Concealment** (`MCP-META-002`): the bare word "silently" ("fails silently") is no
  longer flagged; only "silently &lt;action&gt;" (e.g. "silently send …").
- **No SECURITY.md** (`MCP-SUPPLY-005`) → **info** (best-practice gap, not a risk).
- Clearer report wording for BLOCK / NEEDS_REVIEW ("review required", not a malware verdict).
- Every benchmark report re-validated: complete (evidence + impact + remediation),
  consistent, and justified (decision follows the findings).

## [0.5.1] — 2026-07-08 — packaging

- Add an npm-facing README to `@mcp-trust/cli` (shown on the npm package page).
- Packaging only — no change to scanner behavior (scanner version stays 0.5.0).

## [0.5.0] — 2026-07-08 — Phase 4: HTML reports + public benchmark

### Added
- **HTML report** format (`--format html`) — self-contained, injection-safe, theme-aware.
- **Public benchmark**: `pnpm scan:seed` / `pnpm reports:public` (CLI `bench scan` / `render`)
  over `registry-seed/seed-targets.yml` — 41 real MCP servers → per-target Markdown + HTML +
  `index.json`. Reports index: [`public-reports/`](public-reports/README.md).
- **Honest language coverage**: findings in code MCP Trust can't analyze (Go, Rust, …) are
  surfaced as a ⚠️ Limitations note; a target with no analyzable code is marked
  `staticScan: partial`, so an APPROVE with 0 findings is never a silent clean bill.
- npm-publishable `@mcp-trust/cli` — single self-contained bundle (Semgrep ruleset shipped
  with it); works identically via `npx`, a global install, and the GitHub Action.

### Fixed
- **Semgrep now runs on GitHub/npm targets** (previously `not_available` — the resolver
  dropped the on-disk source); files are staged read-only for analysis.
- **Runtime-context severity caps**: a shell-exec in `tests/` or a build script no longer
  forces a false BLOCK; genuine runtime findings still do.
- Bundled CLI resolves its Semgrep ruleset correctly (was silently missing when bundled).

## [0.4.0] — Phase 3: GitHub Action + SARIF
- SARIF 2.1.0 output, composite GitHub Action (Code Scanning, PR comments, fail-on, artifact).

## [0.3.0] — Phase 2: Sandbox + Semgrep
- Docker Level-2 sandbox, real `@modelcontextprotocol/sdk` introspection, 12 Semgrep AST rules.

## [0.1.0] — Phase 1: MVP
- CLI, 30 deterministic rules, config/static/metadata scanning, JSON/Markdown reports.
