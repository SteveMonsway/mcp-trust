# MCP Trust Report: github:lgazo/drawio-mcp-server

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 34/100  
**Confidence:** 82%

**Source:** [github.com/lgazo/drawio-mcp-server](https://github.com/lgazo/drawio-mcp-server)

_Resolved ref: `7b33675f1047f9e9e1356865bfd244ec0cb223cf`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## Decision Reasons
- Overall score 34 falls in MEDIUM band

## Coverage
| Check | State |
|---|---|
| configScan | completed |
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
| browser_access | 82% |

## Subscores
| Subscore | Value |
|---|---|
| capability | 0 |
| code | 97 |
| config | 0 |
| supplyChain | 31 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 29 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (11)
### HIGH (1)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `packages/drawio-mcp-dev-proxy/src/spawn.ts:88`

```
const child = spawn(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

### MEDIUM (5)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — packages/drawio-mcp-dev-proxy/scripts/install-caddy.mjs — which does not run as part of the MCP server.)

**Evidence:** `packages/drawio-mcp-dev-proxy/scripts/install-caddy.mjs:53`

```
const out = execFileSync(binPath, ["version"], { encoding: "utf8", timeout: 5000 });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — packages/drawio-mcp-dev-proxy/scripts/install-caddy.mjs — which does not run as part of the MCP server.)

**Evidence:** `packages/drawio-mcp-dev-proxy/scripts/install-caddy.mjs:116`

```
const r = spawnSync("tar", ["-xzf", archivePath, "-C", targetDir, "caddy"], { stdio: "inherit" });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — packages/drawio-mcp-dev-proxy/scripts/install-caddy.mjs — which does not run as part of the MCP server.)

**Evidence:** `packages/drawio-mcp-dev-proxy/scripts/install-caddy.mjs:122`

```
const r = spawnSync("tar", ["-xf", archivePath, "-C", targetDir, "caddy.exe"], { stdio: "inherit" });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `packages/drawio-mcp-extension/utils/csp/csp.ts`

```
script-src https://www.dropbox.com https://api.trello.com 'self' https://viewer.diagrams.net https://apis.google.com https://*.pusher.com '<redacted:high-entropy>=' 'sha256-
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/drawio-mcp-server/src/assets/downloader.ts:42`

```
const response = await fetch(url);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (5)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** low  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→low: this match is in test code — packages/drawio-mcp-server/src/stdio-shutdown.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/drawio-mcp-server/src/stdio-shutdown.test.ts:70`

```
return spawn(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** low  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→low: this match is in test code — packages/drawio-mcp-server/src/stdio-transport-purity.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/drawio-mcp-server/src/stdio-transport-purity.test.ts:40`

```
proc = spawn(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SUPPLY-004: Floating package version in startup command
**Severity:** low  **Confidence:** 85%  **Category:** supply_chain

The startup command references a floating version tag/range (latest, next, ^, ~), so the executed code can change.

**Evidence:** `.mcp.json`

```
chrome-devtools-mcp@latest
```

**Impact:** A floating version can pull in a different (possibly malicious) release without notice.

**Remediation:** Pin an exact version instead of a floating tag or range.

#### MCP-SUPPLY-004: Floating package version in startup command
**Severity:** low  **Confidence:** 85%  **Category:** supply_chain

The startup command references a floating version tag/range (latest, next, ^, ~), so the executed code can change.

**Evidence:** `.mcp.json`

```
@playwright/mcp@latest
```

**Impact:** A floating version can pull in a different (possibly malicious) release without notice.

**Remediation:** Pin an exact version instead of a floating tag or range.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in test code — packages/drawio-mcp-server/src/multi-transport.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/drawio-mcp-server/src/multi-transport.test.ts:327`

```
const req = https.request(
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.
- Pin exact package versions in the startup command.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:49:47.156Z._
