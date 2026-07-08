# MCP Trust Report: github:RekklesNA/ProxmoxMCP-Plus

**Decision:** APPROVE  
**Risk:** LOW  
**Score:** 22/100  
**Confidence:** 70%

**Source:** [github.com/RekklesNA/ProxmoxMCP-Plus](https://github.com/RekklesNA/ProxmoxMCP-Plus)

_Resolved ref: `7cfb15eff0f0205555911b1b2a54bdb9e3a3ac5d`_

## Executive Summary
No significant risks were detected in the available evidence. **This is not a safety guarantee** — standard review still applies, and see Coverage/Limitations for what was and wasn’t assessed.

## Decision Reasons
- Overall score 22 falls in LOW band

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
| code | 64 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 13 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (7)
### MEDIUM (1)
#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `main.py:16`

```
__import__(pkg)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

### LOW (6)
#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/scripts/run_real_e2e.py — which does not run as part of the MCP server.)

**Evidence:** `tests/scripts/run_real_e2e.py`

```
ssh-ed25519 <redacted:high-entropy> codex-live-e2e
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/proxmox_mcp/config/loader.py:127`

```
'approval_token': os.getenv("COMMAND_POLICY_APPROVAL_TOKEN"),
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/proxmox_mcp/config/loader.py:130`

```
'high_risk_approval_token': os.getenv("<redacted:high-entropy>"),
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/proxmox_mcp/config/loader.py:149`

```
'token_name': os.getenv("PROXMOX_TOKEN_NAME"),
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/proxmox_mcp/config/loader.py:150`

```
'token_value': os.getenv("PROXMOX_TOKEN_VALUE")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/proxmox_mcp/openapi_proxy.py:428`

```
parser.add_argument("--api-key", default=os.getenv("PROXMOX_API_KEY"))
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:51:43.078Z._
