# MCP Trust Report: github:getsentry/sentry-mcp

**Decision:** BLOCK  
**Risk:** MEDIUM  
**Score:** 30/100  
**Confidence:** 75%

**Source:** [github.com/getsentry/sentry-mcp](https://github.com/getsentry/sentry-mcp)

_Resolved ref: `e2da5164e2edc1f59fad25c38c68dabd14905c49`_

## Executive Summary
The scanner found **high-confidence capability evidence in the server’s runtime code** (e.g. command execution). Review the flagged findings below before connecting this server to an agent. **A BLOCK is a "review required", not proof the server is malicious** — the evidence may be legitimate by design (see Decision Reasons).

## Decision Reasons
- Overall score 30 falls in MEDIUM band
- Critical finding with high confidence: MCP-CODE-001, MCP-CODE-001, MCP-CODE-001, MCP-CODE-001

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
| config | 0 |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 50 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (178)
### CRITICAL (4)
#### MCP-CODE-001: child_process.exec usage
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `packages/mcp-server/src/auth/device-code-flow.ts:160`

```
exec(`open ${JSON.stringify(url)}`);
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `packages/mcp-server/src/auth/device-code-flow.ts:162`

```
exec(`start "" ${JSON.stringify(url)}`);
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `packages/mcp-server/src/auth/device-code-flow.ts:165`

```
exec(`cmd.exe /c start "" ${JSON.stringify(url)}`);
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `packages/mcp-server/src/auth/device-code-flow.ts:167`

```
exec(`xdg-open ${JSON.stringify(url)}`);
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

### HIGH (2)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `packages/agent-cli-test/src/auth.ts:28`

```
const child = spawn("node", [mcpServerPath, "auth", subcommand], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `packages/agent-cli-test/src/process.ts:28`

```
const child = spawn(command, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

### MEDIUM (31)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/pre-commit-generated.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/pre-commit-generated.mjs:32`

```
execFileSync(command[0], command.slice(1), {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/pre-commit-generated.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/pre-commit-generated.mjs:38`

```
const output = execFileSync(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/pre-commit-generated.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/pre-commit-generated.mjs:49`

```
execFileSync("git", ["diff", "--quiet", path], { stdio: "pipe" });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — packages/mcp-core/scripts/generate-definitions.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/scripts/generate-definitions.ts:24`

```
fs.writeFileSync(file, JSON.stringify(data, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/mcp-core/scripts/generate-definitions.ts:373`

```
fs.writeFileSync(agentPath, updated);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/mcp-core/scripts/measure-token-cost.ts:219`

```
fs.writeFileSync(absolutePath, JSON.stringify(output, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/mcp-server/src/auth/token-cache.ts:44`

```
await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), {
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/mcp-test-client/src/auth/config.ts:58`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.ts:78`

```
headers.set("api-key", process.env.OPENAI_API_KEY);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.ts:56`

```
return Boolean(process.env.ANTHROPIC_API_KEY);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.ts:59`

```
return Boolean(process.env.OPENAI_API_KEY);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.ts:61`

```
return Boolean(process.env.OPENROUTER_API_KEY);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.ts:168`

```
if (process.env.ANTHROPIC_API_KEY) return "anthropic";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.ts:169`

```
if (process.env.OPENAI_API_KEY) return "openai";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.ts:170`

```
if (process.env.OPENROUTER_API_KEY) return "openrouter";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/mcp-server/src/index.ts:135`

```
const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/mcp-server/src/index.ts:136`

```
const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `packages/mcp-server/src/index.ts:137`

```
const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-cloudflare/src/server/oauth/helpers.ts:343`

```
const resp = await fetch(upstream_url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-cloudflare/src/server/routes/chat-oauth.ts:120`

```
const response = await fetch(registrationUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-cloudflare/src/server/routes/chat-oauth.ts:171`

```
const response = await fetch(tokenUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-cloudflare/src/server/routes/chat.ts:58`

```
const response = await fetch(tokenUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-core/src/api-client/client.ts:781`

```
response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-core/src/api-client/client.ts:4518`

```
? await fetch(imageUrl)
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.ts:82`

```
return fetch(new Request(requestUrl.toString(), input), {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.ts:88`

```
return fetch(requestUrl.toString(), {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-core/src/internal/fetch-utils.ts:18`

```
const response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-server/src/auth/device-code-flow.ts:37`

```
const resp = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-server/src/auth/device-code-flow.ts:84`

```
const resp = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-test-client/src/auth/oauth.ts:101`

```
const response = await fetch(registrationUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/mcp-test-client/src/auth/oauth.ts:249`

```
const response = await fetch(tokenUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (140)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/mcp-server/src/auth/token-cache.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-server/src/auth/token-cache.test.ts:34`

```
await fs.rm(tmpDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/mcp-server/src/auth/token-cache.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-server/src/auth/token-cache.test.ts:104`

```
await fs.writeFile(process.env.SENTRY_MCP_AUTH_CACHE!, "not-json", "utf-8");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts:22`

```
delete process.env.OPENROUTER_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts:37`

```
delete process.env.OPENAI_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts:39`

```
process.env.OPENAI_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts:44`

```
delete process.env.OPENROUTER_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts:46`

```
process.env.OPENROUTER_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts:74`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts:122`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.test.ts:17`

```
delete process.env.OPENROUTER_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.test.ts:32`

```
delete process.env.OPENAI_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.test.ts:34`

```
process.env.OPENAI_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.test.ts:39`

```
delete process.env.OPENROUTER_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.test.ts:41`

```
process.env.OPENROUTER_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.test.ts:72`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.test.ts:115`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openai-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.test.ts:162`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openrouter-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openrouter-provider.test.ts:11`

```
process.env.OPENROUTER_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openrouter-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openrouter-provider.test.ts:19`

```
delete process.env.OPENROUTER_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/openrouter-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/openrouter-provider.test.ts:21`

```
process.env.OPENROUTER_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:22`

```
delete process.env.ANTHROPIC_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:24`

```
delete process.env.OPENAI_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:26`

```
delete process.env.OPENROUTER_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:35`

```
delete process.env.ANTHROPIC_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:37`

```
process.env.ANTHROPIC_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:41`

```
delete process.env.OPENAI_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:43`

```
process.env.OPENAI_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:47`

```
delete process.env.OPENROUTER_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:49`

```
process.env.OPENROUTER_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:63`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:70`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:77`

```
process.env.OPENROUTER_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:98`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:99`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:107`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:108`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:116`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:117`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:126`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:127`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:128`

```
process.env.OPENROUTER_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:136`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:137`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:145`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:146`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:156`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:157`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:163`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:164`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:176`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:177`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:209`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:217`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:227`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:228`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:237`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:238`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:248`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:255`

```
process.env.ANTHROPIC_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:262`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:271`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/internal/agents/provider-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:282`

```
process.env.OPENROUTER_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts:129`

```
process.env.OPENAI_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts:135`

```
process.env.ANTHROPIC_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts:141`

```
process.env.OPENROUTER_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-trace-details.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-trace-details.test.ts:108`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-trace-details.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-trace-details.test.ts:118`

```
process.env.OPENAI_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-trace-details.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-trace-details.test.ts:124`

```
process.env.ANTHROPIC_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-trace-details.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-trace-details.test.ts:130`

```
process.env.OPENROUTER_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-events.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-events.test.ts:2401`

```
process.env.OPENAI_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-events.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-events.test.ts:2403`

```
process.env.OPENROUTER_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-events.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-events.test.ts:2888`

```
process.env.OPENAI_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-events.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-events.test.ts:2889`

```
process.env.ANTHROPIC_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-events.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-events.test.ts:2890`

```
process.env.OPENROUTER_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-issue-events.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issue-events.test.ts:684`

```
process.env.OPENAI_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-issue-events.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issue-events.test.ts:686`

```
process.env.OPENROUTER_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-issues.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:154`

```
process.env.OPENAI_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-issues.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:156`

```
process.env.OPENROUTER_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-issues.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:211`

```
process.env.OPENAI_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-issues.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:212`

```
process.env.ANTHROPIC_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-issues.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:213`

```
process.env.OPENROUTER_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-issues.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:338`

```
process.env.OPENAI_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-issues.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:339`

```
process.env.ANTHROPIC_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/search-issues.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:340`

```
process.env.OPENROUTER_API_KEY = "";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-test-client/src/agent.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-test-client/src/agent.test.ts:37`

```
process.env.OPENROUTER_API_KEY = "<redacted:secret>";
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-test-client/src/agent.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-test-client/src/agent.test.ts:47`

```
delete process.env.OPENROUTER_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — packages/mcp-test-client/src/agent.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-test-client/src/agent.test.ts:49`

```
process.env.OPENROUTER_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/add-team-to-project.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/add-team-to-project.test.ts`

```
/<redacted:high-entropy>/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-monitor-details.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-monitor-details.test.ts`

```
/<redacted:high-entropy>/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-release-details.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-release-details.test.ts`

```
https://sentry.io/api/0/projects/MyOrg/MyProject/releases/${releaseVersion}/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-release-details.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-release-details.test.ts`

```
https://sentry.io/api/0/projects/MyOrg/MyProject/releases/${releaseVersion}/commits/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/remove-team-from-project.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/remove-team-from-project.test.ts`

```
/<redacted:high-entropy>/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts:13`

```
const originalApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.test.ts:14`

```
const originalOpenRouterApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/azure-openai-provider.ts:75`

```
if (process.env.OPENAI_API_KEY) {
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/callEmbeddedAgent.test.ts:38`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/callEmbeddedAgent.test.ts:39`

```
process.env.OPENROUTER_API_KEY = "";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.integration.test.ts:48`

```
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.test.ts:8`

```
const originalApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/openai-provider.test.ts:9`

```
const originalOpenRouterApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/openrouter-provider.test.ts:7`

```
const originalApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/openrouter-provider.ts:13`

```
apiKey: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:11`

```
const originalAnthropicKey = process.env.ANTHROPIC_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:12`

```
const originalOpenAIKey = process.env.OPENAI_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.test.ts:13`

```
const originalOpenRouterKey = process.env.OPENROUTER_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.ts:43`

```
process.env.ANTHROPIC_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.ts:44`

```
process.env.OPENAI_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/internal/agents/provider-factory.ts:45`

```
process.env.OPENROUTER_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/server.ts:115`

```
*   accessToken: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts:16`

```
const originalOpenAIApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts:17`

```
const originalAnthropicApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts:18`

```
const originalOpenRouterApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/get-trace-details.test.ts:12`

```
const originalOpenAIApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/get-trace-details.test.ts:13`

```
const originalAnthropicApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/get-trace-details.test.ts:14`

```
const originalOpenRouterApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/search-events.test.ts:124`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/search-events.test.ts:125`

```
process.env.OPENROUTER_API_KEY = "";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/search-events.test.ts:2402`

```
process.env.ANTHROPIC_API_KEY = "";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issue-events.test.ts:84`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issue-events.test.ts:85`

```
process.env.OPENROUTER_API_KEY = "";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issue-events.test.ts:685`

```
process.env.ANTHROPIC_API_KEY = "";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:70`

```
process.env.OPENAI_API_KEY = "<redacted:secret>";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:71`

```
process.env.OPENROUTER_API_KEY = "";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-core/src/tools/catalog/search-issues.test.ts:155`

```
process.env.ANTHROPIC_API_KEY = "";
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-server/src/index.ts:112`

```
process.env.ANTHROPIC_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-server/src/index.ts:113`

```
process.env.OPENAI_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-server/src/index.ts:114`

```
process.env.OPENROUTER_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-server/src/transports/stdio.ts:15`

```
*   accessToken: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-test-client/src/agent.test.ts:32`

```
const originalOpenRouterApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-test-client/src/agent.ts:67`

```
apiKey: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/mcp-test-client/src/index.ts:106`

```
options.accessToken || process.env.SENTRY_ACCESS_TOKEN;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in test code — packages/mcp-cloudflare/src/test-utils/fetch-mock-setup.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-cloudflare/src/test-utils/fetch-mock-setup.test.ts:33`

```
const validResponse = await fetch(
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in test code — packages/mcp-cloudflare/src/test-utils/fetch-mock-setup.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-cloudflare/src/test-utils/fetch-mock-setup.test.ts:40`

```
const invalidFieldsResponse = await fetch(
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in test code — packages/mcp-cloudflare/src/test-utils/fetch-mock-setup.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-cloudflare/src/test-utils/fetch-mock-setup.test.ts:47`

```
const invalidSortResponse = await fetch(
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts:93`

```
http.get(organizationMonitorPath, () =>
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-sentry-resource.test.ts:109`

```
http.get(projectMonitorPath, () =>
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-snapshot-image.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-snapshot-image.test.ts:308`

```
http.get(
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-trace-details.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-trace-details.test.ts:28`

```
http.get(sentryIoUrl, resolver, options),
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in test code — packages/mcp-core/src/tools/catalog/get-trace-details.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/mcp-core/src/tools/catalog/get-trace-details.test.ts:29`

```
http.get(usUrl, resolver, options),
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in test code — packages/smoke-tests/src/smoke.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/smoke-tests/src/smoke.test.ts:56`

```
response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### INFO (1)
#### MCP-SUPPLY-005: No security policy (SECURITY.md) found
**Severity:** info  **Confidence:** 100%  **Category:** supply_chain

The project does not provide a security policy. This is a maturity/best-practice gap, not a vulnerability — reported informational so it never drives the decision.

**Evidence:** `repo.files`

```
no SECURITY.md found in source
```

**Impact:** Absence of a disclosure process slows remediation of future vulnerabilities.

**Remediation:** Prefer projects that publish a SECURITY.md with a vulnerability disclosure process.


## Recommended Policy
- Block by default; do not connect to developer workstations or production agents without review.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:37.233Z._
