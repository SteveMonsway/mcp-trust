# MCP Trust Report: github:QuixiAI/dolphin-mcp

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 32/100  
**Confidence:** 74%

**Source:** [github.com/QuixiAI/dolphin-mcp](https://github.com/QuixiAI/dolphin-mcp)

_Resolved ref: `7413ed4712951c0ce1121d7bdb50d2b196b95c73`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## Decision Reasons
- Overall score 32 falls in MEDIUM band

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
| code | 89 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 27 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (8)
### HIGH (1)
#### MCP-SG-PY-002: Dynamic code evaluation (eval / exec)
**Severity:** high  **Confidence:** 85%  **Category:** code

Dynamically evaluated code can execute attacker-controlled logic.

**Evidence:** `src/dolphin_mcp/providers/lmstudio.py:420`

```
exec(code_string, exec_scope)
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/exec; use explicit parsing and dispatch tables.

### MEDIUM (3)
#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/dolphin_mcp/client.py:647`

```
with open(file, "r", encoding="utf-8") as f:
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/dolphin_mcp/client.py:420`

```
with open(log_path, "a") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/dolphin_mcp/providers/lmstudio.py`

```
 block below

            # Only proceed with model.act if we have functions
            if python_functions:
                # Create a clean chat object *without* system prompt for model.act
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

### LOW (4)
#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/dolphin_mcp/providers/msazureopenai.py:30`

```
api_key = <redacted:secret>"AZURE_OPENAI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/dolphin_mcp/providers/anthropic.py:178`

```
anthro_api_key = <redacted:secret>"apiKey", os.getenv("ANTHROPIC_API_KEY"))
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/dolphin_mcp/providers/msazureopenai.py:78`

```
api_key = <redacted:secret>"AZURE_OPENAI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/dolphin_mcp/providers/openai.py:182`

```
api_key = <redacted:secret>"apiKey") or os.getenv("OPENAI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:51:07.031Z._
