# MCP Trust Report: github:upstash/context7

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 44/100  
**Confidence:** 74%

_Resolved ref: `ea82d5585aca02f871f6567dd207d5b616504889`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 44 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CODE-002, MCP-CONFIG-005, MCP-CONFIG-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005

## Coverage
| Check | State |
|---|---|
| configScan | completed |
| staticScan | completed |
| capabilityInference | static_only |
| introspection | disabled |
| semgrep | partial |
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
| code | 100 |
| config | 84 |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 13 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (38)
### HIGH (7)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `packages/cli/src/utils/github.ts:88`

```
return execSync("gh auth token", { stdio: ["pipe", "pipe", "ignore"] })
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `packages/cli/src/commands/generate.ts:441`

```
const child = spawn(editor, [previewFile!], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `packages/cli/src/commands/upgrade.ts:35`

```
const child = spawn(command, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/claude/context7/.mcp.json`

```
CONTEXT7_API_KEY=<redacted:secret>}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/copilot/context7/.mcp.json`

```
CONTEXT7_API_KEY=<redacted:secret>}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/cli/src/utils/auth.ts:69`

```
fs.unlinkSync(credentialsFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/cli/src/utils/auth.ts:74`

```
fs.unlinkSync(legacyCredentialsFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (10)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/cli/src/utils/auth.ts:43`

```
fs.writeFileSync(credentialsFile, JSON.stringify(data, null, 2), { mode: CREDENTIALS_MODE });
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/pi/lib/api.ts:23`

```
const hasKey = Boolean(process.env.CONTEXT7_API_KEY);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/cli/src/utils/github.ts:171`

```
const response = await fetch(treeUrl, { headers });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/cli/src/utils/github.ts:217`

```
const response = await fetch(rawUrl, { headers });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/cli/src/utils/github.ts:284`

```
const fileResponse = await fetch(rawUrl, { headers: ghHeaders });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/mcp/src/lib/api.ts:122`

```
const response = await fetch(url, { headers });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/mcp/src/lib/api.ts:155`

```
const response = await fetch(url, { headers });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/pi/lib/api.ts:43`

```
const response = await fetch(url, { headers: authHeaders() });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/pi/lib/api.ts:55`

```
const response = await fetch(url, { headers: authHeaders() });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `packages/sdk/src/http/index.ts:155`

```
res = await fetch(url, requestOptions as RequestInit);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (21)
#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/sdk/src/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/sdk/src/client.test.ts:20`

```
const originalEnv = process.env.CONTEXT7_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/sdk/src/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/sdk/src/client.test.ts:21`

```
const originalApiKey = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/sdk/src/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/sdk/src/client.test.ts:23`

```
delete process.env.CONTEXT7_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/sdk/src/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/sdk/src/client.test.ts:24`

```
delete process.env.API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/sdk/src/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/sdk/src/client.test.ts:30`

```
if (originalEnv) process.env.CONTEXT7_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/sdk/src/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/sdk/src/client.test.ts:31`

```
if (originalApiKey) process.env.API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/sdk/src/commands/get-context/index.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/sdk/src/commands/get-context/index.test.ts:56`

```
apiKey: <redacted:secret> || process.env.API_KEY!,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/sdk/src/commands/get-context/index.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/sdk/src/commands/get-context/index.test.ts:56`

```
apiKey: <redacted:secret> || process.env.API_KEY!,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/mcp/test/certificate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp/test/certificate.test.ts`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/cli/src/utils/api.ts:274`

```
const apiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/cli/src/utils/github.ts:85`

```
const envToken = <redacted:secret> || process.env.GH_TOKEN;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp/src/index.ts:623`

```
stdioApiKey = <redacted:secret> || process.env.CONTEXT7_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp/src/lib/constants.ts:22`

```
export const OPENAI_APPS_CHALLENGE_TOKEN = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp/src/lib/redis.ts:10`

```
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/pi/lib/api.ts:11`

```
const apiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/sdk/src/client.test.ts:6`

```
const apiKey = <redacted:secret> || process.env.API_KEY!;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/sdk/src/client.ts:22`

```
const apiKey = <redacted:secret> || process.env.CONTEXT7_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/sdk/src/commands/get-context/index.test.ts:39`

```
apiKey: <redacted:secret> || process.env.API_KEY!,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/sdk/src/commands/search-library/index.test.ts:28`

```
apiKey: <redacted:secret> || process.env.API_KEY!,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/sdk/src/utils/test-utils.ts:4`

```
const apiKey = <redacted:secret> || process.env.API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/tools-ai-sdk/src/index.test.ts:16`

```
apiKey: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.
- Move secrets out of config into a secrets manager or environment injected at runtime.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.2 at 2026-07-08T12:48:09.335Z._
