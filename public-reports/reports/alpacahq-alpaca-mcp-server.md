# MCP Trust Report: github:alpacahq/alpaca-mcp-server

**Decision:** APPROVE  
**Risk:** LOW  
**Score:** 26/100  
**Confidence:** 85%

**Source:** [github.com/alpacahq/alpaca-mcp-server](https://github.com/alpacahq/alpaca-mcp-server)

_Resolved ref: `88722ce0ead33a5c69c41f9bfe5deec0a759cbf6`_

## Executive Summary
No significant risks were detected in the available evidence. **This is not a safety guarantee** — standard review still applies, and see Coverage/Limitations for what was and wasn’t assessed.

## Decision Reasons
- Overall score 26 falls in LOW band

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
| code | 79 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (6)
### HIGH (1)
#### MCP-SG-PY-002: Dynamic code evaluation (eval / exec)
**Severity:** high  **Confidence:** 85%  **Category:** code

Dynamically evaluated code can execute attacker-controlled logic.

**Evidence:** `src/alpaca_mcp_server/server.py:62`

```
exec(_USER_AGENT_FILE.read_text(encoding="utf-8"), ns)
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/exec; use explicit parsing and dispatch tables.

### LOW (5)
#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/alpaca_mcp_server/cli.py:52`

```
if not os.environ.get("ALPACA_API_KEY") or not os.environ.get("ALPACA_SECRET_KEY"):
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/alpaca_mcp_server/server.py:67`

```
key = os.environ.get("ALPACA_API_KEY", "")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/alpaca_mcp_server/server.py:68`

```
secret = <redacted:secret>"ALPACA_SECRET_KEY", "")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/conftest.py:20`

```
if not (os.environ.get("ALPACA_API_KEY") and os.environ.get("ALPACA_SECRET_KEY")):
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/test_paper_integration.py:28`

```
os.environ.get("ALPACA_API_KEY") and os.environ.get("ALPACA_SECRET_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:13.974Z._
