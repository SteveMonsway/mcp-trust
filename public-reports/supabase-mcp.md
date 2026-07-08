# MCP Trust Report: github:supabase/mcp

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 30/100  
**Confidence:** 63%

_Resolved ref: `9679b785761cf3c521796554e3a9861ddae51b29`_

## Executive Summary
This MCP server requires human security review before use; notable risks were detected.

## Decision Reasons
- Overall score 30 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005

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
| code | 73 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 63 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (7)
### MEDIUM (7)
#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `packages/mcp-server-supabase/src/transports/stdio.ts:51`

```
const accessToken = <redacted:secret> ?? process.env.SUPABASE_ACCESS_TOKEN;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `packages/mcp-server-supabase/src/management-api/types.ts`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `packages/mcp-server-supabase/src/management-api/types.ts`

```
s public IP in the list of addresses to unban.
             * @default false
             */
            requester_ip: boolean;
            identifier?: string;
        };
        NetworkRestrictionsR
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `packages/mcp-utils/src/server.ts`

```
s understanding of available
   * tools, resources, etc. It can be thought of like a "hint" to the model.
   * For example, this information MAY be added to the system prompt.
   */
  instructions?: s
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/mcp-server-postgrest/src/server.ts:55`

```
const response = await fetch(ensureTrailingSlash(apiUrl), {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/mcp-server-postgrest/src/server.ts:90`

```
const response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/mcp-server-supabase/src/content-api/graphql.ts:164`

```
const response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.0 at 2026-07-08T09:55:24.121Z._
