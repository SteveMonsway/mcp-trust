# MCP Trust Report: github:neondatabase/mcp-server-neon

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 45/100  
**Confidence:** 62%

_Resolved ref: `ea2fa09d7f870f47ca043c8b7daf7312891d6a06`_

## Executive Summary
This MCP server requires human security review before use; notable risks were detected.

## Decision Reasons
- Overall score 45 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005

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

| Inferred capability | Confidence |
|---|---|
| database_access | 60% |

## Subscores
| Subscore | Value |
|---|---|
| capability | 0 |
| code | 96 |
| config | _not assessed_ |
| supplyChain | 20 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 94 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (18)
### HIGH (3)
#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").

**Evidence:** `app/api/[transport]/route.ts`

```
,
          properties: { message, error, eventId },
          context: contexts,
        });
        waitUntil(flushAnalytics());
      };

      const composedTools = getAvailableTools(
        stat
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").

**Evidence:** `app/api/[transport]/route.ts`

```
, {
                    ...properties,
                    isError: true,
                    contentLength: errorResult.content?.length,
                    firstContentType: errorResult.content?.[0]
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").

**Evidence:** `lib/errors.ts`

```
. The branch silently never fired and every
 * conforming OAuth error from Hydra surfaced as a generic 500 to the
 * browser. Fixed in the same change that adds IS_NOT_CONFORM handling.
 */
export fun
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

### MEDIUM (12)
#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `lib/config.ts:17`

```
export const CLIENT_SECRET = <redacted:secret> ?? '';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `lib/config.ts:18`

```
export const COOKIE_SECRET = <redacted:secret> ?? '';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `mcp/oauth/utils.ts`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently"). (Severity reduced high→medium: this match is in build/dev-tooling code — mcp/tools/handlers/neon-auth-config.ts — which does not run as part of the MCP server.)

**Evidence:** `mcp/tools/handlers/neon-auth-config.ts`

```
the change silently undid itself
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently"). (Severity reduced high→medium: this match is in build/dev-tooling code — mcp/tools/handlers/neon-auth-settings-snapshot.ts — which does not run as part of the MCP server.)

**Evidence:** `mcp/tools/handlers/neon-auth-settings-snapshot.ts`

```
 as const;

/**
 * Canonical Neon Auth settings shape shared by get_neon_auth_config and
 * configure_neon_auth success responses (same keys configure reads/writes).
 *
 * `trusted_origins` reflects t
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `mcp/server/account.ts:45`

```
isAxiosError(error) &&
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `mcp/server/errors.ts:51`

```
isAxiosError(error) &&
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `mcp/tools/handlers/docs.ts:11`

```
const response = await fetch(NEON_DOCS_INDEX_URL, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `mcp/tools/handlers/docs.ts:51`

```
const response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `mcp/tools/handlers/neon-auth-settings-snapshot.ts:275`

```
if (isAxiosError(err) && err.response) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `mcp/tools/handlers/neon-auth.ts:104`

```
if (isAxiosError(error) && error.response?.status === 409) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `mcp/tools/handlers/neon-auth.ts:112`

```
isAxiosError(error) &&
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (3)
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

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — e2e/global-setup.ts — which does not run as part of the MCP server.)

**Evidence:** `e2e/global-setup.ts:110`

```
process.env.COOKIE_SECRET = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently"). (Severity reduced high→low: this match is in test code — mcp/__tests__/neon-auth-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `mcp/__tests__/neon-auth-config.test.ts`

```
the change silently undid itself
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.
- Grant read-only database access unless writes are explicitly required.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.0 at 2026-07-08T09:56:16.402Z._
