# MCP Trust Report: github:TranHoaiHung/figma-ui-mcp

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 40/100  
**Confidence:** 72%

_Resolved ref: `0ee03b7dd01ecb6e590b7bd4653c4a1e371ef170`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## Decision Reasons
- Overall score 40 falls in MEDIUM band

## Coverage
| Check | State |
|---|---|
| configScan | not_available |
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
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 75 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (21)
### HIGH (1)
#### MCP-SG-JS-004: Code execution via node vm module
**Severity:** high  **Confidence:** 80%  **Category:** code

Code run through vm can break out of the context and execute arbitrary logic.

**Evidence:** `server/code-executor.js:390`

```
const result = await vm.runInContext(`(async()=>{ ${code} })()`, ctx, {
```

**Impact:** Code run through vm can break out of the context and execute arbitrary logic.

**Remediation:** Do not use vm to isolate untrusted code; run it in a real sandbox (separate process/container).

### MEDIUM (19)
#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** medium  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-v2517.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-v2517.mjs:23`

```
const { normalizeSvgPath } = new Function("return (function() {\n" + src + "\nreturn { normalizeSvgPath };\n})()")();
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-SG-JS-004: Code execution via node vm module
**Severity:** medium  **Confidence:** 80%  **Category:** code

Code run through vm can break out of the context and execute arbitrary logic. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-bind-component-property.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-bind-component-property.mjs:63`

```
vm.runInContext(src, ctx);
```

**Impact:** Code run through vm can break out of the context and execute arbitrary logic.

**Remediation:** Do not use vm to isolate untrusted code; run it in a real sandbox (separate process/container).

#### MCP-SG-JS-004: Code execution via node vm module
**Severity:** medium  **Confidence:** 80%  **Category:** code

Code run through vm can break out of the context and execute arbitrary logic. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-component-properties.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-component-properties.mjs:190`

```
vm.runInContext(utils + "\n" + shim + "\n" + tokens, sandbox, { filename: "handlers-tokens.test.cjs" });
```

**Impact:** Code run through vm can break out of the context and execute arbitrary logic.

**Remediation:** Do not use vm to isolate untrusted code; run it in a real sandbox (separate process/container).

#### MCP-SG-JS-004: Code execution via node vm module
**Severity:** medium  **Confidence:** 80%  **Category:** code

Code run through vm can break out of the context and execute arbitrary logic. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-dynamic-page.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-dynamic-page.mjs:106`

```
vm.runInContext(utils + "\n" + paintFx + "\n" + writeH + "\n" + shim, sandbox, {
```

**Impact:** Code run through vm can break out of the context and execute arbitrary logic.

**Remediation:** Do not use vm to isolate untrusted code; run it in a real sandbox (separate process/container).

#### MCP-SG-JS-004: Code execution via node vm module
**Severity:** medium  **Confidence:** 80%  **Category:** code

Code run through vm can break out of the context and execute arbitrary logic. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-layout-sizing-axes.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-layout-sizing-axes.mjs:60`

```
vm.runInContext(utils + "\n" + paintFx + "\n" + writeH + "\n" + shim, sandbox, {
```

**Impact:** Code run through vm can break out of the context and execute arbitrary logic.

**Remediation:** Do not use vm to isolate untrusted code; run it in a real sandbox (separate process/container).

#### MCP-SG-JS-004: Code execution via node vm module
**Severity:** medium  **Confidence:** 80%  **Category:** code

Code run through vm can break out of the context and execute arbitrary logic. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-v252.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-v252.mjs:43`

```
vm.runInContext(helpersOnly, ctx, { filename: "plugin.js" });
```

**Impact:** Code run through vm can break out of the context and execute arbitrary logic.

**Remediation:** Do not use vm to isolate untrusted code; run it in a real sandbox (separate process/container).

#### MCP-SG-JS-004: Code execution via node vm module
**Severity:** medium  **Confidence:** 80%  **Category:** code

Code run through vm can break out of the context and execute arbitrary logic. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-v2526-feedback.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-v2526-feedback.mjs:65`

```
vm.runInContext(utils + "\n;findNodeByIdAsync = async function(id){ return sandbox.__mockNodes.get(id) || null; };\n", sandbox);
```

**Impact:** Code run through vm can break out of the context and execute arbitrary logic.

**Remediation:** Do not use vm to isolate untrusted code; run it in a real sandbox (separate process/container).

#### MCP-SG-JS-004: Code execution via node vm module
**Severity:** medium  **Confidence:** 80%  **Category:** code

Code run through vm can break out of the context and execute arbitrary logic. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-v2526-feedback.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-v2526-feedback.mjs:66`

```
vm.runInContext("var sandbox = this;", sandbox);
```

**Impact:** Code run through vm can break out of the context and execute arbitrary logic.

**Remediation:** Do not use vm to isolate untrusted code; run it in a real sandbox (separate process/container).

#### MCP-SG-JS-004: Code execution via node vm module
**Severity:** medium  **Confidence:** 80%  **Category:** code

Code run through vm can break out of the context and execute arbitrary logic. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-v2526-feedback.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-v2526-feedback.mjs:67`

```
vm.runInContext(tokens, sandbox);
```

**Impact:** Code run through vm can break out of the context and execute arbitrary logic.

**Remediation:** Do not use vm to isolate untrusted code; run it in a real sandbox (separate process/container).

#### MCP-SG-JS-004: Code execution via node vm module
**Severity:** medium  **Confidence:** 80%  **Category:** code

Code run through vm can break out of the context and execute arbitrary logic. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-variant-handlers.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-variant-handlers.mjs:116`

```
vm.runInContext(utils + "\n" + paintFx + "\n" + writeH + "\n" + shim, sandbox, {
```

**Impact:** Code run through vm can break out of the context and execute arbitrary logic.

**Remediation:** Do not use vm to isolate untrusted code; run it in a real sandbox (separate process/container).

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `plugin/code.js`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `scripts/test-v2514.mjs`

```
<redacted:high-entropy>==
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/plugin/handlers-read.js`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/plugin/handlers-write.js`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/test-multi-session.mjs:28`

```
const req = http.request({
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/test-multi-session.mjs:41`

```
http.get(url, (res) => {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `server/bridge-server.js:369`

```
var req = http.get({ hostname: "127.0.0.1", port: port, path: "/health", timeout: 800 }, function(res) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `server/index.js:30`

```
const req = http.request({
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `server/index.js:53`

```
const req = http.request({
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
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:51:55.172Z._
