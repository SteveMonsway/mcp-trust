# MCP Trust Report: github:CursorTouch/Windows-MCP

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 32/100  
**Confidence:** 76%

**Source:** [github.com/CursorTouch/Windows-MCP](https://github.com/CursorTouch/Windows-MCP)

_Resolved ref: `afc0b273550902c56ae13596a611929c1bb2eea5`_

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
| code | 95 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (6)
### HIGH (3)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/windows_mcp/filesystem/service.py:104`

```
shutil.rmtree(str(dst))
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/windows_mcp/filesystem/service.py:133`

```
shutil.rmtree(str(dst))
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/windows_mcp/filesystem/service.py:165`

```
shutil.rmtree(str(target))
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (1)
#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/windows_mcp/desktop/service.py:820`

```
response = requests.get(current_url, timeout=10, allow_redirects=False)
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (2)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/test_analytics.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_analytics.py:116`

```
shutil.rmtree(user_data_dir, ignore_errors=True)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/windows_mcp/infrastructure/analytics.py:45`

```
API_KEY = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:48:35.471Z._
