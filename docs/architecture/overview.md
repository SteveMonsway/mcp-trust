# Architecture Overview

```
Target string
  → parseTarget            (resolvers)      github / npm / local / config
  → resolve                (resolvers)      clone/fetch/read → files + configs + metadata
  → parseMcpConfig         (config-scanner) startup command / args / env / url
  → capability map         (cli + rules)    introspection (trusted) OR static inference
  → runRules(ALL_RULES)    (core + rules)   config / code / metadata / capability / supply
  → computeScore           (core)           9 subscores → overall (0–100)
  → decide                 (core)           band mapping + severity overrides
  → assembleScanResult     (core)           ScanResult
  → renderJson / renderMarkdown / console (report + cli)
```

## Packages

| Package | Responsibility |
|---|---|
| `@mcp-trust/core` | Types, fingerprint, scoring, decision, rule engine, result assembly |
| `@mcp-trust/rules` | 30 rules + capability & poisoning dictionaries |
| `@mcp-trust/resolvers` | Target parsing + npm/github/local/config resolution |
| `@mcp-trust/config-scanner` | MCP config (JSONC) parsing, command tokenizer |
| `@mcp-trust/static-scanner` | File discovery, semgrep/docker availability detection |
| `@mcp-trust/introspection` | Trusted-fixture stdio MCP introspection + policy gate |
| `@mcp-trust/report` | JSON + Markdown renderers |
| `@mcp-trust/cli` | Pipeline orchestration, CLI, console renderer |

## Safety model (Phase 1)

- Never execute untrusted code. `resolve` never runs package install scripts.
- Runtime introspection is gated by `canIntrospect`: allowed only for paths under
  `fixtures/mcp/`, `examples/`, `mock-mcp-servers/`, and only with `--introspect`.
- Child processes get a sanitized environment (no real secrets), a hard timeout,
  and are killed on completion.
- All evidence snippets, logs and fingerprints pass through secret redaction.
- Capability inference and rule matching are deterministic (dictionaries/regex), no LLM.
