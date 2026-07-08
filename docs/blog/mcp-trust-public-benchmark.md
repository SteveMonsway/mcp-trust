# We scanned 41 public MCP servers before letting an agent touch them

*Draft — MCP Trust public benchmark, Phase 4. Numbers are from the committed
`public-reports/index.json`; regenerate with `pnpm scan:seed && pnpm reports:public`.*

Model Context Protocol servers are the hands of an AI agent. They read your files,
run shell commands, query your databases, hit third-party APIs and act on your behalf.
Installing one is `npx some-mcp-server` — and from that moment an agent can call
whatever tools it exposes. We do code review before we `npm install` a dependency into
production. Almost nobody does the equivalent before wiring an MCP server into an agent
with real credentials.

[MCP Trust](https://github.com/modelcontextprotocol) is an evidence-based **preflight
scanner** for exactly that gap: point it at a GitHub repo, npm package or local config,
and it maps what the server can do, runs deterministic rules plus a Semgrep AST pass,
and returns an `APPROVE / APPROVE_WITH_RESTRICTIONS / NEEDS_REVIEW / BLOCK` decision with
evidence attached to every finding.

To pressure-test it, we ran it over **41 real, public MCP servers** — the reference
servers, the archived reference set, and a spread of popular vendor/community servers
(databases, browsers, search, payments, cloud).

## What came back

| Decision | Count | Meaning |
|---|---|---|
| BLOCK | 2 | Runtime code with high-confidence dangerous capability; review before use |
| NEEDS_REVIEW | 16 | Notable risk (network egress, secret access, dynamic requests) |
| APPROVE_WITH_RESTRICTIONS | 3 | Usable with sandboxing / least privilege |
| APPROVE | 20 | No significant risk in the available evidence |

The most common findings across the fleet were exactly what you'd expect from tools
built to *do things*: secret-like environment access (`MCP-CODE-007`), filesystem
writes (`MCP-CODE-006`), outbound requests to dynamically-built URLs
(`MCP-SG-JS-005`, a Semgrep rule), and synchronous shell execution (`MCP-CODE-002`).
None of that is inherently malicious — a fetch server making outbound requests is its
whole job — which is the entire point of an **evidence-based** decision rather than a
pass/fail verdict.

## A BLOCK is not "malware"

Both BLOCKs are legitimate-by-design and the scanner says *why*:

- **`cloudflare-mcp`** ships a sandbox-container server whose runtime literally calls
  `child_process.exec` (`apps/sandbox-container/container/sandbox.container.app.ts`).
  Running commands *is the feature*. BLOCK here means "this tool executes commands —
  make sure you meant to give an agent that."
- **`mongodb-mcp`** shells out in its runtime setup path (`src/setup/aiTool.ts`).

That's the signal we want: capability evidence in the code that actually runs when an
agent connects.

## The lesson: a scanner has to understand what code is *for*

Our first run flagged **four** BLOCKs. Two of them were wrong — and wrong in an
instructive way.

- **`microsoft/playwright-mcp`** was BLOCKed because of `child_process.execSync(...)`
  in `tests/cli.spec.ts` and `tests/library.spec.ts`.
- **`stripe/agent-toolkit`** was BLOCKed because of `execSync` in `scripts/sync.js` and
  its `benchmarks/` shell scripts.

None of that code ships as part of the running MCP server. A test that shells out to
invoke the CLI it's testing is completely benign to an agent connecting to the server —
but a naive scanner treats it as a critical finding and slams the whole project to BLOCK.
That's the kind of false positive that trains people to ignore the tool.

So we taught MCP Trust to classify each finding's file by whether it's part of the
server's **runtime**. Findings in `tests/`, `examples/`, `docs/` and build/dev scripts
(`scripts/`, `benchmark/`, …) get their severity **capped** — and, crucially, capped
*before* scoring and the decision, so a test-only `execSync` can't force a BLOCK. The
finding is still reported, with a note explaining the downgrade; nothing is hidden.

The result:

| Server | Critical driver | Before | After |
|---|---|---|---|
| `playwright-mcp-microsoft` | `execSync` in `tests/*.spec.ts` | BLOCK | **NEEDS_REVIEW** |
| `stripe-agent-toolkit` | `execSync` in `scripts/sync.js` | BLOCK | **NEEDS_REVIEW** |
| `cloudflare-mcp` | `exec` in runtime sandbox server | BLOCK | **BLOCK** |
| `mongodb-mcp` | `exec` in `src/setup/` runtime | BLOCK | **BLOCK** |

The two real, runtime-driven BLOCKs stayed. The two test/script false positives dropped
to NEEDS_REVIEW. Same evidence, better judgment about what it means.

## Honest limits

We'd rather undersell than overclaim:

- **GitHub targets are analyzed statically.** The scanner clones and reads the code
  (regex rules + Semgrep AST); it does **not** execute these servers, so capabilities
  are inferred from source, not from live tool introspection. Running a server for real
  tool listing happens only inside a locked-down Docker sandbox, for local/npm targets.
- **`APPROVE` with 0 findings can mean "not analyzed" — and the report says so.** MCP Trust
  has code rules for JavaScript, TypeScript and Python only. `github-mcp-server` (Go),
  `grafana-mcp` (Go) and `elasticsearch-mcp` (Rust) contain code the scanner cannot read,
  so every one of their reports carries a prominent **⚠️ Limitations** note, and a target
  with no analyzable code at all (like the pure-Rust `elasticsearch-mcp`) is marked
  `staticScan: partial` with reduced confidence. An APPROVE is never a silent clean bill.
- **Expected ≠ detected.** The seed records what each server is *documented* to do; the
  scanner reports what it *finds*. Divergence is itself worth a look.

## Performance, and where it goes

41 targets scanned in **~120 seconds** on one laptop (mean 2.9s, median 2.3s each;
machine-dependent). The time splits almost entirely between the **git clone (~55%)** and
the **Semgrep subprocess (~43%)**; the deterministic rules are ~1%. Both the clone and
Semgrep run as *synchronous* child processes, so — we checked — naive in-process
concurrency wouldn't help. The real win is **caching clones per repository**: several seed
entries are subpaths of the same monorepo and re-clone it today. That's the next lever.

## Reproduce it

Everything here is deterministic and in the repo:

```bash
pnpm build
pnpm scan:seed        # clone + static + Semgrep over registry-seed/seed-targets.yml
pnpm reports:public   # per-target Markdown + HTML + index.json
```

Per-target reports live in `public-reports/`, and the machine-readable index is
`public-reports/index.json`. Add your own targets to `registry-seed/seed-targets.yml`.

Scan the server before you hand it to your agent.
