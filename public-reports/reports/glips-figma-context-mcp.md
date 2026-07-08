# MCP Trust Report: github:GLips/Figma-Context-MCP

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 36/100  
**Confidence:** 72%

**Source:** [github.com/GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP)

_Resolved ref: `c083d65c7e002923e7cb98f4e3bdafb105e90f6d`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 36 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CODE-002

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
| code | 98 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 42 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (10)
### HIGH (3)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/common.ts:66`

```
fs.unlink(fullPath, () => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/common.ts:78`

```
fs.unlink(fullPath, () => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").

**Evidence:** `src/server.ts`

```
t silently send images to e.g. the client
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

### MEDIUM (5)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→medium: this match is in build/dev-tooling code — scripts/scan-hidden-chars.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/scan-hidden-chars.mjs:200`

```
const tracked = execSync(`git ls-files -- ${extensions}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/common.ts:44`

```
const writer = fs.createWriteStream(fullPath);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/logger.ts:35`

```
fs.writeFileSync(logPath, JSON.stringify(value, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/utils/common.ts:33`

```
const response = await fetch(imageUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/utils/fetch-json.ts:65`

```
const response = await fetch(url, fetchOptions);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (2)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — src/tests/image-processing.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tests/image-processing.test.ts:25`

```
fs.rmSync(tmpDir, { recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/tests/integration.test.ts:20`

```
figmaApiKey = <redacted:secret> || "";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:48:23.841Z._
