# MCP Trust Report: github:grafana/mcp-grafana

**Decision:** APPROVE  
**Risk:** LOW  
**Score:** 26/100  
**Confidence:** 70%

_Resolved ref: `76ed7dba5a18c9058d58a9ec037cc0e6a6febe49`_

## Executive Summary
No significant risks were detected in the available evidence. Standard review still applies.

## ⚠️ Limitations
- Additionally, Go source is present but was NOT analyzed — MCP Trust has code rules for JavaScript, TypeScript and Python only. Absence of code findings does not imply this server is safe.

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
| packageMetadata | partial |

## Capability Map
_Source: static_inference_

_No tools discovered (no runtime introspection); capabilities inferred statically where possible._

## Subscores
| Subscore | Value |
|---|---|
| capability | 0 |
| code | 78 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (10)
### LOW (10)
#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/admin_test.py — which does not run as part of the MCP server.)

**Evidence:** `tests/admin_test.py:31`

```
if api_key := os.environ.get("GRAFANA_SERVICE_ACCOUNT_TOKEN"):
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/admin_test.py — which does not run as part of the MCP server.)

**Evidence:** `tests/admin_test.py:33`

```
elif api_key := os.environ.get("GRAFANA_API_KEY"):
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/conftest.py:54`

```
if key := os.environ.get("GRAFANA_SERVICE_ACCOUNT_TOKEN"):
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/conftest.py:56`

```
elif key := os.environ.get("GRAFANA_API_KEY"):
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/conftest.py:65`

```
password := os.environ.get("GRAFANA_PASSWORD")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/conftest.py:78`

```
if key := os.environ.get("GRAFANA_SERVICE_ACCOUNT_TOKEN"):
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/conftest.py:80`

```
elif key := os.environ.get("GRAFANA_API_KEY"):
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/conftest.py:89`

```
password := os.environ.get("GRAFANA_PASSWORD")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/disable_write_test.py — which does not run as part of the MCP server.)

**Evidence:** `tests/disable_write_test.py:13`

```
if key := os.environ.get("GRAFANA_SERVICE_ACCOUNT_TOKEN"):
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/disable_write_test.py — which does not run as part of the MCP server.)

**Evidence:** `tests/disable_write_test.py:15`

```
elif key := os.environ.get("GRAFANA_API_KEY"):
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.0 at 2026-07-08T09:56:05.954Z._
