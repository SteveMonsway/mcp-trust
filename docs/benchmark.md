<!-- METHODOLOGY + SUMMARY. The results table and numbers are filled from the
     live run below; regenerate with `pnpm scan:seed && pnpm reports:public`. -->
# Public benchmark

MCP Trust ships a reproducible benchmark over a curated seed of **real, public MCP
servers** (`registry-seed/seed-targets.yml`). It exists to (a) dogfood the scanner
against messy real-world code, (b) publish evidence-based reports anyone can audit,
and (c) measure per-phase performance so the pipeline can be optimized.

## How to reproduce

```bash
pnpm build
pnpm scan:seed        # clone + static + Semgrep for every seed target → public-reports/_raw + _bench.json
pnpm reports:public   # render <slug>.md + <slug>.html per target and index.json
```

Outputs land in `public-reports/`:

- `public-reports/<slug>.md` and `<slug>.html` — one human-readable report per target.
- `public-reports/index.json` — machine-readable index: per-target decision / risk /
  score / finding count / top rules, plus a run summary and timing.
- `public-reports/_bench.json` — per-target wall-clock and per-phase timings.
- `public-reports/_raw/<slug>.json` — full `ScanResult` per target (git-ignored; the
  render step reads these).

## What actually runs on a benchmark target

Every seed entry is a **GitHub** target. GitHub targets are **cloned, never executed**:
the scanner does a shallow, blob-limited clone, loads the files, then runs the
deterministic regex rules **and** the bundled Semgrep AST ruleset over those files
(Semgrep only reads source — it never runs the server). No runtime introspection and
no Docker sandbox are involved for GitHub targets; capabilities are inferred statically.
See [architecture/sandboxing.md](architecture/sandboxing.md).

`expectedCapabilities` in the seed is a human reference for what each server is
*documented* to do — the scanner does not assert it. Divergence between expected and
detected capability is itself a signal worth reading.

<!-- BENCHMARK_SUMMARY_START -->
## Latest run

- **Targets scanned:** 41 public MCP servers (all GitHub), 41 ok, 0 failed.
- **Decisions:** 2 BLOCK · 16 NEEDS_REVIEW · 1 APPROVE_WITH_RESTRICTIONS · 22 APPROVE.
- **Risk:** 29 low · 12 medium · 0 high · 0 critical.
- **Timing (this run, darwin / Node v24.8.0):** ~132s wall; mean 3.2s, median 2.7s per target. Machine-dependent.
- **Where the time goes:** clone/resolve ~49%, Semgrep ~49%, regex rules ~1.2% (rest negligible). Both clone and Semgrep are synchronous (spawnSync) — in-process concurrency would not help; clone caching per repository is the real lever.
- **Environment:** Node v24.8.0, darwin, Semgrep available. Scanner v0.5.2.

## How to read these results

A **BLOCK** does not mean "malware". It means the scanner found capability evidence
(e.g. `child_process.exec`) in the server's **runtime** code that warrants review before
an agent is given the tool. Both current BLOCKs are legitimate-by-design: `cloudflare-mcp`
ships a sandbox-container server that runs commands, and `mongodb-mcp` shells out in its
runtime setup path. Findings that live in **test / build-script / example** code are
severity-capped and do not drive the decision (see
[scoring.md → Runtime-context severity caps](scoring.md#runtime-context-severity-caps)) —
this is why `playwright-mcp-microsoft` and `stripe-agent-toolkit`, whose only critical
matches were in `tests/` and `scripts/`, land at NEEDS_REVIEW rather than BLOCK.

**Language coverage is honest.** MCP Trust has code rules for JavaScript, TypeScript and
Python only. When a target contains code in another language (Go, Rust, C#, …), every
report carries a prominent **⚠️ Limitations** note saying that code was *not* analyzed, and
a target with no analyzable code at all is marked `staticScan: partial` with reduced
confidence — so an APPROVE is never misread as "fully analyzed, safe". In this run 4 targets carry such a note (`github-mcp-server` and `grafana-mcp` = Go, `elasticsearch-mcp` = Rust,
`stripe-agent-toolkit` = C#/Java/Ruby SDKs alongside its TypeScript).

## Results

<!-- Regenerate this table + summary from public-reports/index.json after each run. -->
| # | Target | Category | Decision | Risk | Score | Findings | Note |
|---|---|---|---|---|---|---|---|
| 1 | `mongodb-mcp` | database | BLOCK | medium | 37 | 67 |  |
| 2 | `cloudflare-mcp` | cloud | BLOCK | medium | 36 | 13 |  |
| 3 | `awslabs-mcp` | cloud | NEEDS_REVIEW | medium | 46 | 228 |  |
| 4 | `context7` | developer | NEEDS_REVIEW | medium | 44 | 38 |  |
| 5 | `mcp-atlassian` | communication | NEEDS_REVIEW | medium | 39 | 43 |  |
| 6 | `playwright-mcp-microsoft` | browser | NEEDS_REVIEW | medium | 33 | 12 |  |
| 7 | `mcp-playwright-ea` | browser | NEEDS_REVIEW | medium | 33 | 10 |  |
| 8 | `neon-mcp` | database | NEEDS_REVIEW | medium | 33 | 12 |  |
| 9 | `firecrawl-mcp` | browser | NEEDS_REVIEW | medium | 32 | 15 |  |
| 10 | `stripe-agent-toolkit` | payment | NEEDS_REVIEW | medium | 32 | 74 | ⚠ unanalyzed lang |
| 11 | `mcp-arc-google-maps` | geo | NEEDS_REVIEW | medium | 30 | 9 |  |
| 12 | `supabase-mcp` | database | NEEDS_REVIEW | low | 27 | 7 |  |
| 13 | `mcp-arc-brave-search` | search | NEEDS_REVIEW | low | 25 | 6 |  |
| 14 | `mcp-arc-gitlab` | developer | NEEDS_REVIEW | low | 25 | 6 |  |
| 15 | `mcp-arc-github` | developer | NEEDS_REVIEW | low | 19 | 4 |  |
| 16 | `tavily-mcp` | search | NEEDS_REVIEW | low | 18 | 4 |  |
| 17 | `mcp-ref-everything` | reference | NEEDS_REVIEW | low | 11 | 3 |  |
| 18 | `fetch-mcp` | network | NEEDS_REVIEW | low | 9 | 2 |  |
| 19 | `mcp-ref-filesystem` | filesystem | APPROVE_WITH_RESTRICTIONS | medium | 33 | 48 |  |
| 20 | `mcp-ref-memory` | knowledge | APPROVE | low | 26 | 9 |  |
| 21 | `exa-mcp` | search | APPROVE | low | 25 | 11 |  |
| 22 | `grafana-mcp` | observability | APPROVE | low | 20 | 7 | ⚠ unanalyzed lang |
| 23 | `redis-mcp` | database | APPROVE | low | 18 | 4 |  |
| 24 | `mcp-arc-gdrive` | document | APPROVE | low | 13 | 3 |  |
| 25 | `mcp-arc-everart` | media | APPROVE | low | 13 | 3 |  |
| 26 | `mcp-arc-aws-kb-retrieval` | cloud | APPROVE | low | 8 | 3 |  |
| 27 | `chroma-mcp` | database | APPROVE | low | 8 | 2 |  |
| 28 | `mcp-ref-git` | git | APPROVE | low | 5 | 1 |  |
| 29 | `mcp-arc-git` | git | APPROVE | low | 5 | 1 |  |
| 30 | `mcp-arc-slack` | communication | APPROVE | low | 4 | 2 |  |
| 31 | `mcp-ref-fetch` | network | APPROVE | low | 0 | 0 |  |
| 32 | `mcp-ref-time` | utility | APPROVE | low | 0 | 0 |  |
| 33 | `mcp-ref-sequentialthinking` | utility | APPROVE | low | 0 | 1 |  |
| 34 | `mcp-arc-postgres` | database | APPROVE | low | 0 | 1 |  |
| 35 | `mcp-arc-sqlite` | database | APPROVE | low | 0 | 0 |  |
| 36 | `mcp-arc-redis` | database | APPROVE | low | 0 | 1 |  |
| 37 | `mcp-arc-puppeteer` | browser | APPROVE | low | 0 | 1 |  |
| 38 | `mcp-arc-sentry` | observability | APPROVE | low | 0 | 0 |  |
| 39 | `github-mcp-server` | developer | APPROVE | low | 0 | 0 | ⚠ unanalyzed lang |
| 40 | `qdrant-mcp` | database | APPROVE | low | 0 | 0 |  |
| 41 | `elasticsearch-mcp` | database | APPROVE | low | 0 | 0 | ⚠ unanalyzed lang |
<!-- BENCHMARK_SUMMARY_END -->
