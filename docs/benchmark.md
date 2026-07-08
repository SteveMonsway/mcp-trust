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

- **Targets scanned:** 452 public MCP servers (all GitHub, JS/TS/Python), 452 ok, 0 failed.
- **Decisions:** 32 BLOCK · 91 NEEDS_REVIEW · 112 APPROVE_WITH_RESTRICTIONS · 217 APPROVE.
- **Risk:** 236 low · 216 medium · 0 high · 0 critical.
- **Timing (this run, darwin / Node v24.8.0):** ~28 min (1665s), sequential; mean 3.7s, median 2.4s per target. ~64% git clone + ~35% Semgrep; parallel clones would cut this to minutes (roadmap).
- **Environment:** Node v24.8.0, darwin, Semgrep available. Scanner v0.5.3.

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

<!-- Top of the list; full 452-row index: ../public-reports/README.md -->
| # | Target | Category | Decision | Risk | Score | Findings | Note |
|---|---|---|---|---|---|---|---|
| 1 | `getsentry-xcodebuildmcp` | typescript | BLOCK | medium | 52 | 93 | ⚠ |
| 2 | `srbhptl39-mcp-superassistant` | typescript | BLOCK | medium | 51 | 23 |  |
| 3 | `wonderwhy-er-desktopcommandermcp` | typescript | BLOCK | medium | 48 | 206 |  |
| 4 | `atagon-gmbh-kogiqa-mcp` | javascript | BLOCK | medium | 44 | 12 |  |
| 5 | `ibm-mcp-context-forge` | python | BLOCK | medium | 42 | 249 | ⚠ |
| 6 | `cisco-ai-defense-mcp-scanner` | python | BLOCK | medium | 42 | 490 |  |
| 7 | `artokun-comfyui-mcp` | typescript | BLOCK | medium | 42 | 156 |  |
| 8 | `sepinetam-mcp-for-stata` | python | BLOCK | medium | 42 | 26 |  |
| 9 | `aartiq-servicenow-mcp` | typescript | BLOCK | medium | 41 | 61 |  |
| 10 | `softeria-ms-365-mcp-server` | typescript | BLOCK | medium | 39 | 24 |  |
| 11 | `maksimsarychau-mcp-zebrunner` | typescript | BLOCK | medium | 39 | 93 |  |
| 12 | `dakkshin-after-effects-mcp` | javascript | BLOCK | medium | 38 | 10 |  |
| 13 | `jamubc-gemini-mcp-tool` | typescript | BLOCK | medium | 37 | 25 |  |
| 14 | `mongodb-js-mongodb-mcp-server` | typescript | BLOCK | medium | 37 | 67 |  |
| 15 | `quantgeekdev-mcp-framework` | typescript | BLOCK | medium | 37 | 82 |  |
| 16 | `cloudflare-mcp-server-cloudflare` | typescript | BLOCK | medium | 36 | 13 |  |
| 17 | `agentdeskai-browser-tools-mcp` | javascript | BLOCK | medium | 33 | 15 |  |
| 18 | `jgraph-drawio-mcp` | javascript | BLOCK | medium | 33 | 13 |  |
| 19 | `tradesdontlie-tradingview-mcp` | javascript | BLOCK | medium | 33 | 5 |  |
| 20 | `southleft-figma-console-mcp` | typescript | BLOCK | medium | 33 | 21 |  |
| 21 | `rinadelph-agent-mcp` | typescript | BLOCK | medium | 33 | 68 |  |
| 22 | `patruff-ollama-mcp-bridge` | typescript | BLOCK | medium | 33 | 12 |  |
| 23 | `stevenstavrakis-obsidian-mcp` | typescript | BLOCK | medium | 33 | 23 |  |
| 24 | `cso1z-feishu-mcp` | typescript | BLOCK | medium | 33 | 22 |  |
| 25 | `etsd-tech-mcp-pointer` | typescript | BLOCK | medium | 33 | 12 |  |
| 26 | `reading-plus-ai-mcp-server-data-exploration` | python | BLOCK | medium | 33 | 3 |  |
| 27 | `bvisible-mcp-ssh-manager` | javascript | BLOCK | medium | 33 | 56 |  |
| 28 | `domdomegg-computer-use-mcp` | typescript | BLOCK | medium | 33 | 10 |  |
| 29 | `uholli-browser-mcp` | typescript | BLOCK | medium | 33 | 4 |  |
| 30 | `browsermcp-mcp` | typescript | BLOCK | medium | 32 | 3 |  |
| 31 | `getsentry-sentry-mcp` | typescript | BLOCK | medium | 30 | 178 |  |
| 32 | `nickgnd-tmux-mcp` | javascript | BLOCK | medium | 30 | 2 |  |
| 33 | `vmoranv-jshookmcp` | typescript | NEEDS_REVIEW | medium | 52 | 261 | ⚠ |
| 34 | `volcengine-mcp-server` | python | NEEDS_REVIEW | medium | 50 | 203 | ⚠ |
| 35 | `sirkirby-unifi-mcp` | python | NEEDS_REVIEW | medium | 47 | 80 |  |
| 36 | `jjvm2000-terminal-mcp` | typescript | NEEDS_REVIEW | medium | 47 | 15 |  |
| 37 | `awslabs-mcp` | python | NEEDS_REVIEW | medium | 46 | 228 |  |
| 38 | `datalayer-jupyter-mcp-server` | python | NEEDS_REVIEW | medium | 44 | 13 |  |
| 39 | `rohitg00-kubectl-mcp-server` | python | NEEDS_REVIEW | medium | 44 | 20 |  |
| 40 | `postmanlabs-postman-mcp-server` | typescript | NEEDS_REVIEW | medium | 44 | 26 |  |
| 41 | `zcaceres-markdownify-mcp` | typescript | NEEDS_REVIEW | medium | 43 | 14 |  |
| 42 | `beehiveinnovations-pal-mcp-server` | python | NEEDS_REVIEW | medium | 42 | 177 |  |
| 43 | `ibm-mcp-cli` | python | NEEDS_REVIEW | medium | 42 | 83 |  |
| 44 | `salesforceairesearch-mcp-universe` | python | NEEDS_REVIEW | medium | 42 | 207 |  |
| 45 | `heznpc-airmcp` | javascript | NEEDS_REVIEW | medium | 42 | 116 | ⚠ |
| 46 | `samarthanalytics-sj-samarth-analytics-mcp` | typescript | NEEDS_REVIEW | medium | 42 | 115 |  |
| 47 | `lastmile-ai-mcp-agent` | python | NEEDS_REVIEW | medium | 41 | 80 |  |
| 48 | `excalidraw-excalidraw-mcp` | typescript | NEEDS_REVIEW | medium | 41 | 8 |  |
| 49 | `harishsg993010-damn-vulnerable-mcp-server` | python | NEEDS_REVIEW | medium | 41 | 50 |  |
| 50 | `ath-maas-pixelle-mcp` | python | NEEDS_REVIEW | medium | 41 | 31 |  |
| 51 | `tencentcloudbase-cloudbase-mcp` | typescript | NEEDS_REVIEW | medium | 41 | 227 |  |
| 52 | `arcadeai-arcade-mcp` | python | NEEDS_REVIEW | medium | 41 | 39 |  |
| 53 | `jonigl-mcp-client-for-ollama` | python | NEEDS_REVIEW | medium | 41 | 24 |  |
| 54 | `goldentrii-agentrecall-mcp` | javascript | NEEDS_REVIEW | medium | 41 | 381 |  |
| 55 | `cbcoutinho-nextcloud-mcp-server` | python | NEEDS_REVIEW | medium | 41 | 27 |  |
| 56 | `waldzellai-waldzell-mcp` | javascript | NEEDS_REVIEW | medium | 41 | 40 |  |
| 57 | `dynamics365ninja-d365fo-mcp-server` | typescript | NEEDS_REVIEW | medium | 41 | 129 | ⚠ |
| 58 | `iseppo-e-arveldaja-mcp` | typescript | NEEDS_REVIEW | medium | 41 | 54 |  |
| 59 | `llallum-msdefender-mcp` | javascript | NEEDS_REVIEW | medium | 41 | 19 |  |
| 60 | `czlonkowski-n8n-mcp` | typescript | NEEDS_REVIEW | medium | 40 | 316 |  |

_… 392 more — see the full index: [](../public-reports/README.md)._
<!-- BENCHMARK_SUMMARY_END -->
