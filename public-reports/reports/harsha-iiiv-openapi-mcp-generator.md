# MCP Trust Report: github:harsha-iiiv/openapi-mcp-generator

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 33/100  
**Confidence:** 72%

_Resolved ref: `8f6714ffcdeefbcddea25d8143dc610e4cbbc5f3`_

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
| code | 100 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (57)
### HIGH (2)
#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/generator/server-code.ts:274`

```
const zodSchema = eval(zodSchemaString);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:367`

```
await fs.rm(outputDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (14)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:246`

```
await fs.writeFile(serverFilePath, serverTsContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:259`

```
await fs.writeFile(authFilePath, generateCustomAuthStub());
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:264`

```
await fs.writeFile(packageJsonPath, packageJsonContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:267`

```
await fs.writeFile(tsconfigPath, tsconfigJsonContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:270`

```
await fs.writeFile(gitignorePath, gitignoreContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:273`

```
await fs.writeFile(eslintPath, eslintConfigContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:276`

```
await fs.writeFile(prettierPath, prettierConfigContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:279`

```
await fs.writeFile(jestConfigPath, jestConfigContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:282`

```
await fs.writeFile(envExamplePath, envExampleContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:290`

```
await fs.writeFile(oauth2DocsPath, oauth2DocsContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:304`

```
await fs.writeFile(webServerPath, webServerCode);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:312`

```
await fs.writeFile(indexHtmlPath, indexHtmlContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:325`

```
await fs.writeFile(streamableHttpPath, streamableHttpCode);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:333`

```
await fs.writeFile(indexHtmlPath, indexHtmlContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### LOW (40)
#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in example/sample code — examples/pet-store-sse/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/pet-store-sse/src/index.ts:1127`

```
const zodSchema = eval(zodSchemaString);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in example/sample code — examples/pet-store-streamable-http/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/pet-store-streamable-http/src/index.ts:1127`

```
const zodSchema = eval(zodSchemaString);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:2684`

```
* WARNING: Uses eval(), which can be a security risk if the schema input is untrusted.
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:2705`

```
// IMPORTANT: Using eval() to execute the generated Zod schema string.
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:2709`

```
const zodSchema = eval(zodSchemaString);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration.test.ts:73`

```
if (workdir && fs.existsSync(workdir)) fs.rmSync(workdir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — tests/integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration.test.ts:79`

```
const indexTs = fs.readFileSync(path.join(out, 'src', 'index.ts'), 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — tests/integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration.test.ts:108`

```
const indexTs = fs.readFileSync(path.join(out, 'src', 'index.ts'), 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — tests/integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration.test.ts:129`

```
const webTs = fs.readFileSync(path.join(out, 'src', 'web-server.ts'), 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — tests/integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration.test.ts:133`

```
const indexTs = fs.readFileSync(path.join(out, 'src', 'index.ts'), 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — tests/integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration.test.ts:206`

```
const indexTs = fs.readFileSync(path.join(out, 'src', 'index.ts'), 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration.test.ts:26`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration.test.ts:139`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration.test.ts:176`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in example/sample code — examples/pet-store-sse/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/pet-store-sse/src/index.ts:633`

```
const clientSecret = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in example/sample code — examples/pet-store-streamable-http/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/pet-store-streamable-http/src/index.ts:633`

```
const clientSecret = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/generator/server-code.ts:336`

```
// ctx.headers['authorization'] = \`Bearer \${process.env.MY_TOKEN ?? ''}\`;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/utils/helpers.ts:32`

```
* `description`/`summary` such as `${process.env.SECRET}` is otherwise written
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit.test.ts:42`

```
const malicious = 'desc ${process.env.SECRET}';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/pet-store-sse/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/pet-store-sse/src/index.ts:1030`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/pet-store-streamable-http/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/pet-store-streamable-http/src/index.ts:1030`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:690`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:798`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:901`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:1003`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:1107`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:1216`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:1323`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:1438`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:1538`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:1646`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:1750`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:1854`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:1962`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:2070`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:2176`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:2276`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:2380`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:2492`

```
if (axios.isAxiosError(error)) {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in example/sample code — examples/petstore-mcp/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/petstore-mcp/src/index.ts:2596`

```
if (axios.isAxiosError(error)) {
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

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:50.695Z._
