# Changelog

All notable changes to MCP Trust. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

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
