# MCP Trust Report: github:ClickHouse/mcp-clickhouse

**Decision:** APPROVE  
**Risk:** LOW  
**Score:** 29/100  
**Confidence:** 72%

**Source:** [github.com/ClickHouse/mcp-clickhouse](https://github.com/ClickHouse/mcp-clickhouse)

_Resolved ref: `ccef141dbd4e482111c8b8803962339b1f3bf1d7`_

## Executive Summary
No significant risks were detected in the available evidence. **This is not a safety guarantee** — standard review still applies, and see Coverage/Limitations for what was and wasn’t assessed.

## Decision Reasons
- Overall score 29 falls in LOW band

## Coverage
| Check | State |
|---|---|
| configScan | not_available |
| staticScan | completed |
| capabilityInference | static_only |
| introspection | disabled |
| semgrep | completed |
| docker | disabled |
| dependencyScan | not_available |
| runtimeScan | not_available |
| packageMetadata | completed |

## Capability Map
_Source: static_inference_

_No tools discovered (no runtime introspection); capabilities inferred statically where possible._

## Subscores
| Subscore | Value |
|---|---|
| capability | 0 |
| code | 81 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 27 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (6)
### HIGH (1)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `mcp_clickhouse/chdb_prompt.py:94`

```
os.unlink(temp_file)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (2)
#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `mcp_clickhouse/mcp_middleware_hook.py:14`

```
mod = importlib.import_module(middleware_module)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `mcp_clickhouse/chdb_prompt.py`

```

# chDB MCP System Prompt

## Available Tools
- **run_chdb_select_query**: Execute SELECT queries using chDB's table functions

## Core Principles
You are a chDB assistant, specialized in helping user
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

### LOW (3)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/test_chdb_tool.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_chdb_tool.py:56`

```
self.addCleanup(lambda: os.path.exists(temp_path) and os.unlink(temp_path))
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `mcp_clickhouse/mcp_env.py:90`

```
return os.environ["CLICKHOUSE_PASSWORD"]
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `mcp_clickhouse/mcp_env.py:334`

```
return os.getenv("CLICKHOUSE_MCP_AUTH_TOKEN", None)
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:18.396Z._
