# Benchmark expansion plan — from 41 to 500+ servers

Goal: grow the public benchmark from the current 41 seed targets to **500+** real MCP
servers, spanning trusted vendor servers and higher-risk categories, and publish every
report under [`public-reports/`](../public-reports/README.md) so anyone can look a server up
by name.

> Every decision stays **evidence-based**. We do **not** pre-label any server as malicious —
> the scanner reports what it finds, and a `BLOCK` means "capability evidence to review",
> not an accusation. The disclaimer in every report applies.

## Where the 500+ come from

| Source | How to harvest | Rough yield |
|---|---|---|
| `modelcontextprotocol/servers` + `servers-archived` | already in seed | 21 |
| GitHub topic search | `gh search repos --topic mcp --topic model-context-protocol` | 100s |
| "Awesome MCP" lists | parse `awesome-mcp-servers` READMEs for repo links | 100s |
| npm registry | `npm search mcp-server` / packages named `*-mcp` / `@*/mcp-*` | 100s |
| Vendor / category servers | db, browser, search, cloud, payment, git, email | dozens |
| High-risk categories (TZ §14.2) | shell-exec, fs-write, browser automation, db-write, git-write, cloud-deploy, payment, remote-HTTP-auth | spread across the above |
| Supply-chain watch candidates | packages whose names closely mimic popular servers (possible typosquats) — the scanner evaluates them by evidence | a curated few |

Dedupe by `owner/repo`, cap per owner (avoid one org dominating), keep a language mix
(the report honestly flags Go/Rust/… as unanalyzed).

## Method

1. **Harvest** candidate locators into `registry-seed/seed-targets.yml` via a small script
   (`gh search` + `npm search` → normalize to `github.com/owner/repo[/path]`).
2. **Scan in batches** — `pnpm scan:seed` is clone- and Semgrep-bound (~99% of time). At 500
   targets that is ~25-40 min and will hit GitHub rate limits, so:
   - land **clone caching per repository first** (the known perf lever — several targets share
     one monorepo today), then optionally async spawn;
   - run in chunks with short delays; the runner already records per-target failures honestly.
3. **Render + index** — `pnpm reports:public` regenerates per-target md/html + `index.json` +
   the browsable `public-reports/README.md` index (searchable by server / company name).
4. **Publish** — commit the grown `public-reports/` to the public repo.

## Guardrails

- Keep the run reproducible and the numbers generated from `index.json` (never hand-typed).
- Respect GitHub API limits and each project's license; we only read public source.
- Honest coverage: unsupported languages → ⚠️ Limitations; failed clones → recorded, not hidden.

## Rough sizing

500 reports ≈ a few MB of Markdown/HTML. Keep `_raw/` git-ignored (large); commit the
rendered reports + `index.json` + `_bench.json` as today.
