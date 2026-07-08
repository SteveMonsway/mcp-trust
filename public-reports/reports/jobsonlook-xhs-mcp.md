# MCP Trust Report: github:jobsonlook/xhs-mcp

**Decision:** APPROVE  
**Risk:** LOW  
**Score:** 28/100  
**Confidence:** 70%

_Resolved ref: `09e55b1dd56fb63157d60ef197dcc2a553e92e50`_

## Executive Summary
No significant risks were detected in the available evidence. **This is not a safety guarantee** — standard review still applies, and see Coverage/Limitations for what was and wasn’t assessed.

## Decision Reasons
- Overall score 28 falls in LOW band

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
| code | 63 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 87 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (7)
### HIGH (1)
#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `xhs_mcp/api/xhsvm.js:2470`

```
eval(`try {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

### MEDIUM (6)
#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `xhs_mcp/api/xhs_api.py`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `xhs_mcp/api/xhs_api_v2.py`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `xhs_mcp/api/xhs_api_v2.py`

```
<redacted:high-entropy>=
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `xhs_mcp/api/xhsvm.js`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `xhs_mcp/api/xhsvm.js`

```
IQEBAQIJBwEHAgkCAQcDCQIBBwQJAgEHBQkCAQcGCQIBBwcJAgEHCAkCAQcJCQIBBwoJAgEHCwkCAQcMCQIBBw0JAgEHDgkCAQcPCQIBBxAJAgEHEQkCAQcSCQIBBxMJAgEHFAkCAQcVCQIBBxYJAgEHFwkCAQcYCQIBBxkJAgEHGgkCAQcbCQIBBxwJAgEHHQkCAQce
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `xhs_mcp/api/xhsvm_v2.js`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:51:15.548Z._
