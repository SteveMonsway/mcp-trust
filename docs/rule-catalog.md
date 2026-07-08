# Rule Catalog

MCP Trust ships a deterministic, evidence-based rule engine: **30 built-in
regex/dictionary rules** plus **12 Semgrep AST rules** (run when the `semgrep`
binary is available). The remainder are tracked here as `planned` and are **not**
shipped as stubs. Run `mcp-trust rules list` for the live list and
`mcp-trust explain <id>` for details on any rule.

## Implemented (Phase 1 — 30)

### Config (8)

| ID | Severity | Title |
|---|---|---|
| MCP-CONFIG-001 | medium | Unpinned package version in MCP startup command |
| MCP-CONFIG-002 | high | Pipe-to-shell installer (`curl \| sh`) |
| MCP-CONFIG-003 | high | `sudo` in startup command |
| MCP-CONFIG-004 | high | Inline shell execution (`bash -c`, PowerShell `-Command`) |
| MCP-CONFIG-005 | high | Secret embedded directly in config |
| MCP-CONFIG-006 | medium | Remote endpoint over plain HTTP (non-loopback) |
| MCP-CONFIG-007 | high | Sensitive local path referenced (`~/.ssh`, `.env`, …) |
| MCP-CONFIG-008 | medium | Broad home/root directory access |

### Code — regex/AST-lite (7)

| ID | Severity | Title |
|---|---|---|
| MCP-CODE-001 | high→critical* | `child_process.exec` |
| MCP-CODE-002 | high | `execSync` / `spawnSync` shell |
| MCP-CODE-003 | high | `eval` / `Function` constructor |
| MCP-CODE-004 | high→critical* | Python `subprocess(shell=True)` / `os.system` |
| MCP-CODE-005 | medium | Arbitrary filesystem read (dynamic path) |
| MCP-CODE-006 | high | Arbitrary filesystem write/delete |
| MCP-CODE-007 | medium | Secret-like environment variable access |

\* raised to critical when the argument appears dynamically constructed.

### Metadata / tool poisoning (5)

| ID | Severity | Title |
|---|---|---|
| MCP-META-001 | high | Instruction-override phrase |
| MCP-META-002 | high | Concealment phrase (“do not tell the user”, “silently”) |
| MCP-META-003 | high | Data-exfiltration phrase |
| MCP-META-004 | medium | System/developer-prompt targeting |
| MCP-META-005 | medium | Encoded/hidden content (zero-width, bidi, long base64) |

### Capability (5)

| ID | Severity | Title |
|---|---|---|
| MCP-TOOL-001 | high | Filesystem read capability |
| MCP-TOOL-002 | high | Filesystem write/delete capability |
| MCP-TOOL-003 | critical | Shell/command execution capability |
| MCP-TOOL-004 | medium | Network egress capability |
| MCP-TOOL-005 | high | Credential/secret access capability |

### Supply chain (5)

| ID | Severity | Title |
|---|---|---|
| MCP-SUPPLY-001 | low | No linked source repository |
| MCP-SUPPLY-002 | medium | Declared repo does not match resolved source |
| MCP-SUPPLY-003 | medium | Install script present |
| MCP-SUPPLY-004 | low | Floating package version in startup command |
| MCP-SUPPLY-005 | low | No security policy (SECURITY.md) |

## Semgrep AST rules (12)

Run by the bundled ruleset `packages/static-scanner/rules/mcp-semgrep.yml` when
the `semgrep` binary is on PATH (`coverage.semgrep = completed`). Semgrep resolves
imports and syntax the regex engine cannot and expresses patterns impractical as
regex. Findings are tagged `engine:semgrep`; a semgrep match on the same
`file:line` as a regex code finding is **deduplicated** in favor of the regex rule.
The ruleset is run fully offline, with telemetry/version-check disabled and in-code
`nosemgrep` suppression disabled so a hostile target cannot silence findings.

| ID | Severity | Lang | Title |
|---|---|---|---|
| MCP-SG-JS-001 | high | js/ts | Shell command execution (`child_process.exec`/`execSync`, import-resolved) |
| MCP-SG-JS-002 | medium | js/ts | Dynamic module load (`require` with non-literal path) |
| MCP-SG-JS-003 | high | js/ts | Dynamic code evaluation (`eval` / `new Function`) |
| MCP-SG-JS-004 | high | js/ts | Code execution via node `vm` module |
| MCP-SG-JS-005 | medium | js/ts | Outbound request with dynamic URL (SSRF / exfiltration) |
| MCP-SG-JS-006 | medium | js/ts | Secret-like environment variable access |
| MCP-SG-PY-001 | high | py | Python shell execution (`shell=True` / `os.system` / `os.popen`) |
| MCP-SG-PY-002 | high | py | Dynamic code evaluation (`eval` / `exec`) |
| MCP-SG-PY-003 | high | py | Unsafe deserialization (`pickle` / `yaml.load` / `marshal`) |
| MCP-SG-PY-004 | medium | py | Outbound request with dynamic URL (SSRF / exfiltration) |
| MCP-SG-PY-005 | medium | py | Dynamic module import (`__import__` / `importlib`) |
| MCP-SG-PY-006 | medium | py | Secret-like environment variable access |

Each rule carries an `mcp_*` metadata block (the single source of truth for its
id/severity/category/remediation/references); a match missing required metadata is
dropped fail-closed. Add or edit rules in the yaml and update this table + a case in
`fixtures/repos/semgrep-cases`.

## Planned (backlog — not yet implemented)

These come from the full 66-rule catalog and will land in later phases. They are
**not** active and do not emit findings today.

- **Config:** MCP-CONFIG-002-uvx (unpinned uvx as distinct rule), destructive command
  pattern (`rm -rf`, `dd`, `mkfs`), shell metacharacters, Docker dangerous flags
  (`--privileged`, docker socket mount), localhost-without-auth hint.
- **Metadata:** encoded payload decode, tool-name impersonation of trusted service,
  broad generic tool name + dangerous schema, resource URI to sensitive path,
  excessive tool count.
- **Capability:** destructive/delete tool, email send/read, database query/write,
  browser/cookie/session, git write/push, cloud infra/deploy, payment/commerce.
- **JS/Python:** `fs` user-controlled path taint, postinstall deep analysis.
  (`spawn` shell, dynamic import/require, unsafe `pickle`/YAML load, `vm`, SSRF now
  shipped as Semgrep AST rules above.)
- **Supply chain:** new/low-trust package, suspicious maintainer change, no lockfile,
  no signed releases, known CVEs via OSV, typosquatting.
- **Auth/transport:** remote MCP without auth evidence, OAuth dangerous scheme,
  OAuth redirect wildcard, token passthrough, weak session id, Streamable HTTP over
  plain HTTP outside loopback.

## Authoring a rule

A rule implements the `Rule` interface from `@mcp-trust/core`:

```ts
export interface Rule {
  id: string;
  title: string;
  description: string;
  defaultSeverity: Severity;
  category: FindingCategory;
  tags: string[];
  appliesTo: RuleInputKind[];
  remediation: string;
  references?: Reference[];
  falsePositiveNotes?: string;
  evaluate(ctx: ScanContext): Finding[] | Promise<Finding[]>;
}
```

Rules **return findings, they never throw** for non-fatal conditions. Build findings
with `buildFinding(...)` so evidence is redacted and fingerprinted automatically.
Every finding must carry evidence; add a test in `packages/rules/tests`.
