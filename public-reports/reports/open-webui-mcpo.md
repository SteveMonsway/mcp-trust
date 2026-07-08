# MCP Trust Report: github:open-webui/mcpo

**Decision:** APPROVE  
**Risk:** LOW  
**Score:** 26/100  
**Confidence:** 70%

**Source:** [github.com/open-webui/mcpo](https://github.com/open-webui/mcpo)

_Resolved ref: `788ff92e5288a899a743a252edd5748f4ad4ab1f`_

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
| code | 77 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (6)
### MEDIUM (2)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/mcpo/utils/oauth.py:101`

```
with open(self.token_file, 'w') as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/mcpo/utils/oauth.py:119`

```
with open(self.client_file, 'w') as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### LOW (4)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — src/mcpo/tests/test_hot_reload.py — which does not run as part of the MCP server.)

**Evidence:** `src/mcpo/tests/test_hot_reload.py:72`

```
os.unlink(config_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — src/mcpo/tests/test_hot_reload.py — which does not run as part of the MCP server.)

**Evidence:** `src/mcpo/tests/test_hot_reload.py:85`

```
os.unlink(config_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — src/mcpo/tests/test_hot_reload.py — which does not run as part of the MCP server.)

**Evidence:** `src/mcpo/tests/test_hot_reload.py:100`

```
os.unlink(config_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — src/mcpo/tests/test_hot_reload.py — which does not run as part of the MCP server.)

**Evidence:** `src/mcpo/tests/test_hot_reload.py:157`

```
os.unlink(config_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:48:54.150Z._
