# MCP Trust Report: github:makenotion/notion-mcp-server

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 33/100  
**Confidence:** 75%

**Source:** [github.com/makenotion/notion-mcp-server](https://github.com/makenotion/notion-mcp-server)

_Resolved ref: `d7e3bbd62890f9efca2cd54449ac072f3bd1a4ba`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## Decision Reasons
- Overall score 33 falls in MEDIUM band

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
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (17)
### HIGH (1)
#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/openapi-mcp-server/openapi/parser.ts:353`

```
// const zodSchema = eval(zodSchemaStr) as z.ZodType
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

### MEDIUM (4)
#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/init-server.ts:20`

```
rawSpec = fs.readFileSync(path.resolve(process.cwd(), specPath), 'utf-8')
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/start-server.ts:53`

```
fs.writeFileSync(authTokenFilePath, authToken, { mode: 0o600 })
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `scripts/start-server.ts:50`

```
if (!options.authToken && !process.env.AUTH_TOKEN) {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `scripts/start-server.ts:260`

```
const notionToken = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

### LOW (11)
#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — src/openapi-mcp-server/openapi/__tests__/notion-markdown-tools.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/openapi-mcp-server/openapi/__tests__/notion-markdown-tools.test.ts:14`

```
fs.readFileSync(path.resolve(process.cwd(), 'scripts/notion-openapi.json'), 'utf-8'),
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — src/openapi-mcp-server/mcp/__tests__/proxy.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/openapi-mcp-server/mcp/__tests__/proxy.test.ts:285`

```
process.env.NOTION_TOKEN = '<redacted:secret>'
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — src/openapi-mcp-server/mcp/__tests__/proxy.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/openapi-mcp-server/mcp/__tests__/proxy.test.ts:301`

```
delete process.env.NOTION_TOKEN
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — src/openapi-mcp-server/mcp/__tests__/proxy.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/openapi-mcp-server/mcp/__tests__/proxy.test.ts:314`

```
process.env.NOTION_TOKEN = '<redacted:secret>'
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — src/openapi-mcp-server/mcp/__tests__/proxy.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/openapi-mcp-server/mcp/__tests__/proxy.test.ts:339`

```
process.env.NOTION_TOKEN = '<redacted:secret>'
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in test code — src/openapi-mcp-server/mcp/__tests__/proxy.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/openapi-mcp-server/mcp/__tests__/proxy.test.ts:353`

```
process.env.NOTION_TOKEN = '<redacted:secret>'
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `scripts/server-options.ts:28`

```
let enableTokenPassthrough = <redacted:secret> === 'true'
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `scripts/start-server.ts:49`

```
authToken = <redacted:secret> || process.env.AUTH_TOKEN || randomBytes(32).toString('hex')
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `scripts/start-server.ts:113`

```
const hasEnvNotionToken = <redacted:secret> || process.env.OPENAPI_MCP_HEADERS)
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/openapi-mcp-server/mcp/__tests__/proxy.test.ts:265`

```
process.env.NOTION_TOKEN = '<redacted:secret>'
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/openapi-mcp-server/mcp/proxy.ts:268`

```
const notionToken = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

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

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:48:53.998Z._
