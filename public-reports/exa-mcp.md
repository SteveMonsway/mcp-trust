# MCP Trust Report: github:exa-labs/exa-mcp-server

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 41/100  
**Confidence:** 68%

_Resolved ref: `9c69a3b45b228243215c59673e54c5bf321bb416`_

## Executive Summary
This MCP server may be used with restrictions (sandboxing, least privilege, scoped access).

## Decision Reasons
- Overall score 41 falls in MEDIUM band

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
| code | 97 |
| config | _not assessed_ |
| supplyChain | 20 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 43 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (19)
### MEDIUM (6)
#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `api/mcp.ts:128`

```
const redisToken = <redacted:secret> || process.env.UPSTASH_REDIS_REST_TOKEN;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `api/mcp.ts:385`

```
let exaApiKey = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `api/mcp.ts:611`

```
const bypassApiKey = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `api/well-known-openai-apps-challenge.ts:22`

```
const raw = process.env.OPENAI_APPS_CHALLENGE_TOKEN || '';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `src/tools/config.ts:45`

```
return new Exa(typeof exaApiKey === 'string' && exaApiKey.length > 0 ? exaApiKey : <redacted:secret> || '');
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/tools/deepSearch.ts`

```
Using system prompt
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

### LOW (13)
#### MCP-SUPPLY-005: No security policy (SECURITY.md) found
**Severity:** low  **Confidence:** 100%  **Category:** supply_chain

The project does not provide a security policy, indicating weaker security maturity/disclosure process.

**Evidence:** `repo.files`

```
no SECURITY.md found in source
```

**Impact:** Absence of a disclosure process slows remediation of future vulnerabilities.

**Remediation:** Prefer projects that publish a SECURITY.md with a vulnerability disclosure process.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/api/mcp.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/api/mcp.test.ts:119`

```
delete process.env.EXA_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/api/mcp.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/api/mcp.test.ts:120`

```
delete process.env.EXA_API_KEY_BYPASS;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/api/mcp.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/api/mcp.test.ts:121`

```
delete process.env.KV_REST_API_TOKEN;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/api/mcp.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/api/mcp.test.ts:125`

```
delete process.env.UPSTASH_REDIS_REST_TOKEN;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/api/mcp.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/api/mcp.test.ts:130`

```
process.env.EXA_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/api/mcp.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/api/mcp.test.ts:248`

```
process.env.KV_REST_API_TOKEN = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/api/mcp.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/api/mcp.test.ts:397`

```
process.env.EXA_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/api/mcp.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/api/mcp.test.ts:614`

```
process.env.EXA_API_KEY_BYPASS = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/api/mcp.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/api/mcp.test.ts:633`

```
process.env.EXA_API_KEY_BYPASS = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/api/mcp.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/api/mcp.test.ts:689`

```
process.env.KV_REST_API_TOKEN = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently"). (Severity reduced high→low: this match is in test code — tests/unit/tools/validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/tools/validation.test.ts`

```
zero (silently drops to undefined)
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently"). (Severity reduced high→low: this match is in test code — tests/unit/tools/validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/tools/validation.test.ts`

```
negative (silently drops to undefined)
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.0 at 2026-07-08T09:55:18.545Z._
