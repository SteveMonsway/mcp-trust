# MCP Trust Report: github:hmmhmmhm/daiso-mcp

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 42/100  
**Confidence:** 72%

**Source:** [github.com/hmmhmmhm/daiso-mcp](https://github.com/hmmhmmhm/daiso-mcp)

_Resolved ref: `b60ceeeacba847198d677cdea104f2f054cdcea5`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## ⚠️ Limitations
- Additionally, Kotlin, Swift source is present but was NOT analyzed — MCP Trust has code rules for JavaScript, TypeScript and Python only. Absence of code findings does not imply this server is safe.

## Decision Reasons
- Overall score 42 falls in MEDIUM band

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

| Inferred capability | Confidence |
|---|---|
| browser_access | 82% |

## Subscores
| Subscore | Value |
|---|---|
| capability | 0 |
| code | 100 |
| config | 41 |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 100 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (86)
### HIGH (1)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/cli/deps.ts:27`

```
const child = spawn(command, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

### MEDIUM (37)
#### MCP-CONFIG-001: Unpinned package version in MCP startup command
**Severity:** medium  **Confidence:** 90%  **Category:** config

The startup command runs a package via npx/uvx without pinning an exact version, so the code executed can change silently between runs.

**Evidence:** `.mcp.json`

```
npx -y @<redacted:high-entropy>
```

**Impact:** The exact code run at startup is not reproducible and can be replaced by a malicious release.

**Remediation:** Pin an exact version, e.g. `npx -y @scope/server@1.2.3`. Avoid `latest`/floating ranges in startup commands.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/ops/cli-smoke.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/ops/cli-smoke.ts:197`

```
const child = spawn(command, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/ghidra/cli_mcp_ghidra.py — which does not run as part of the MCP server.)

**Evidence:** `scripts/ghidra/cli_mcp_ghidra.py:97`

```
os.remove(output_json)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/gs25-msg-api-response-extract.ts:31`

```
const raw = fs.readFileSync(path, 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/gs25-pangle-conscrypt-protobuf-likelihood.ts:143`

```
const text = fs.readFileSync(file, 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/gs25-pangle-conscrypt-read-summary.ts:10`

```
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/gs25-pangle-conscrypt-summary.ts:10`

```
const text = fs.readFileSync(file, 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/gs25-pangle-hunt-summary.ts:19`

```
const text = fs.readFileSync(file, 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/gs25-pangle-path-len-summary.ts:20`

```
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/gs25-pgl-meta-301-export-replay-tuples.ts:27`

```
const raw = fs.readFileSync(path, 'utf8').trim();
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/gs25-pgl-meta-301-variability.ts:22`

```
const raw = fs.readFileSync(path, 'utf8').trim();
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/gs25-pgl-meta-protobuf-likelihood.ts:103`

```
const buf = fs.readFileSync(row.file);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/gs25-msg-api-response-extract.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/gs25-msg-api-response-extract.ts:299`

```
fs.writeFileSync(jsonOut, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/gs25-new-blutter-signal-extract.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/gs25-new-blutter-signal-extract.ts:117`

```
await fs.writeFile(outFile, `${markdown}\n`, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/gs25-new-round-summary.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/gs25-new-round-summary.ts:166`

```
fs.writeFileSync(outPath, `${text}\n`, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/ops/update-workers-invocations-chart.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/ops/update-workers-invocations-chart.ts:365`

```
await fs.writeFile(DATA_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/ghidra/headless_export.py — which does not run as part of the MCP server.)

**Evidence:** `scripts/ghidra/headless_export.py:13`

```
f = open(path, 'w')
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/gs25-pgl-meta-301-export-replay-tuples.ts:160`

```
fs.writeFileSync(outPath, text);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/gs25-pgl-meta-301-pipeline-extract.ts:45`

```
fs.writeFileSync(javaOut, java.join('\n') + (java.length ? '\n' : ''), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/gs25-pgl-meta-301-pipeline-extract.ts:46`

```
fs.writeFileSync(pipeOut, pipe.join('\n') + (pipe.length ? '\n' : ''), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/gs25-pgl-meta-export-payload-bins.ts:131`

```
fs.writeFileSync(filePath, buf);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/gs25-pgl-meta-export-payload-bins.ts:142`

```
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/gs25-replay-events-to-params.ts:137`

```
fs.writeFileSync(outputPath, JSON.stringify(out, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/ops/update-workers-invocations-chart.ts:285`

```
await fs.writeFile(README_PATH, next, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/ops/update-workers-invocations-chart.ts:335`

```
await fs.writeFile(CHART_PATH, chartBuffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `scripts/frida/gs25-pgl-meta-301-pipeline-probe.ts`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `scripts/frida/gs25-pgl-meta-hook.ts`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/pages/openapiSpecComponentsDaisoOliveyoung.ts`

```
https://image.oliveyoung.co.kr/uploads/images/goods/10/0000/0020/A00000020061401ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/pages/openapiSpecPathsEmart24.ts`

```
#/components/schemas/Emart24StoreSearchResponse
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/pages/openapiSpecPathsEmart24.ts`

```
#/<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/pages/openapiSpecPathsEmart24.ts`

```
#/components/schemas/Emart24InventoryResponse
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/pages/openapiSpecPathsGs25.ts`

```
#/components/schemas/Gs25StoreSearchResponse
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/pages/openapiSpecPathsGs25.ts`

```
#/<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/pages/openapiSpecPathsGs25.ts`

```
#/components/schemas/Gs25InventoryResponse
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `vitest.config.ts`

```
src/services/emart24/tools/checkInventory.ts
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/services/cgv/transport.ts:90`

```
const response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/utils/http.ts:113`

```
const response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (48)
#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/api/oliveyoung-handlers.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/api/oliveyoung-handlers.test.ts`

```
/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/api/oliveyoung-handlers.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/api/oliveyoung-handlers.test.ts`

```
https://image.oliveyoung.co.kr/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/app/app-api-actions.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/app/app-api-actions.test.ts`

```
/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/app/app-api-oliveyoung.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/app/app-api-oliveyoung.test.ts`

```
/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/app/app-api-oliveyoung.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/app/app-api-oliveyoung.test.ts`

```
https://image.oliveyoung.co.kr/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/emart24/tools/checkInventory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/emart24/tools/checkInventory.test.ts`

```
../../../../src/services/emart24/tools/checkInventory.js
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/emart24/tools/findNearbyStores.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/emart24/tools/findNearbyStores.test.ts`

```
../../../../<redacted:high-entropy>.js
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/emart24/tools/searchProducts.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/emart24/tools/searchProducts.test.ts`

```
../../../../src/services/emart24/tools/searchProducts.js
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/gs25/tools/findNearbyStores.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/gs25/tools/findNearbyStores.test.ts`

```
../../../../<redacted:high-entropy>.js
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/oliveyoung/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/oliveyoung/client.test.ts`

```
/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/oliveyoung/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/oliveyoung/client.test.ts`

```
https://image.oliveyoung.co.kr/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/oliveyoung/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/oliveyoung/client.test.ts`

```
https://image.oliveyoung.co.kr/uploads/images/goods/10/0000/0010/A00000000001001ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/oliveyoung/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/oliveyoung/client.test.ts`

```
//image.oliveyoung.co.kr/uploads/images/goods/10/0000/0011/A00000000001101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/oliveyoung/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/oliveyoung/client.test.ts`

```
https://image.oliveyoung.co.kr/uploads/images/goods/10/0000/0011/A00000000001101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/oliveyoung/client.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/oliveyoung/client.test.ts`

```
https://image.oliveyoung.co.kr/uploads/images/goods/10/0000/0012/A00000000001201ko.jpg?l=ko
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/oliveyoung/tools/checkInventory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/oliveyoung/tools/checkInventory.test.ts`

```
/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/oliveyoung/tools/checkInventory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/oliveyoung/tools/checkInventory.test.ts`

```
https://image.oliveyoung.co.kr/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/oliveyoung/tools/searchProducts.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/oliveyoung/tools/searchProducts.test.ts`

```
/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/services/oliveyoung/tools/searchProducts.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/services/oliveyoung/tools/searchProducts.test.ts`

```
https://image.oliveyoung.co.kr/uploads/images/goods/10/0000/0001/A00000000000101ko.jpg
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `docs/oliveyoung-zyte-bandwidth-test.ts:87`

```
const apiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `docs/oliveyoung-zyte-replay-test.ts:86`

```
const apiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `scripts/ops/update-workers-invocations-chart.ts:36`

```
const API_TOKEN = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `scripts/ops/update-workers-invocations-chart.ts:38`

```
const GLOBAL_API_KEY = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/services/cgv/tools/findTheaters.ts:49`

```
googleMapsApiKey: <redacted:secret> || process.env.GOOGLE_MAPS_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/services/cgv/tools/getTimetable.ts:52`

```
googleMapsApiKey: <redacted:secret> || process.env.GOOGLE_MAPS_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/services/cgv/tools/searchMovies.ts:40`

```
googleMapsApiKey: <redacted:secret> || process.env.GOOGLE_MAPS_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/services/cu/tools/checkInventory.ts:68`

```
const googleMapsApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/services/lottecinema/tools/findNearbyTheaters.ts:36`

```
googleMapsApiKey: <redacted:secret> || process.env.GOOGLE_MAPS_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/services/lottecinema/tools/getRemainingSeats.ts:49`

```
googleMapsApiKey: <redacted:secret> || process.env.GOOGLE_MAPS_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/services/lottecinema/tools/listNowShowing.ts:36`

```
googleMapsApiKey: <redacted:secret> || process.env.GOOGLE_MAPS_API_KEY,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/services/megabox/tools/findNearbyTheaters.ts:42`

```
googleMapsApiKey: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/services/megabox/tools/getRemainingSeats.ts:49`

```
googleMapsApiKey: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/services/megabox/tools/listNowShowing.ts:47`

```
googleMapsApiKey: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/utils/zyte.ts:32`

```
return process.env.ZYTE_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/cgv/client.test.ts:632`

```
const original = process.env.ZYTE_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/cgv/tools/findTheaters.test.ts:16`

```
delete process.env.GOOGLE_MAPS_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/cgv/tools/getTimetable.test.ts:16`

```
delete process.env.GOOGLE_MAPS_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/cgv/tools/searchMovies.test.ts:16`

```
delete process.env.GOOGLE_MAPS_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/cu/tools/checkInventory.test.ts:141`

```
delete process.env.GOOGLE_MAPS_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/gs25/tools/checkInventory.test.ts:108`

```
const prevGoogleKey = process.env.GOOGLE_MAPS_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/gs25/tools/findNearbyStores.test.ts:67`

```
const prevGoogleKey = process.env.GOOGLE_MAPS_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/lottecinema/tools/listNowShowing.test.ts:10`

```
const originalGoogleMapsApiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/megabox/tools/findNearbyTheaters.test.ts:81`

```
process.env.GOOGLE_MAPS_API_KEY = '<redacted:secret>';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/megabox/tools/getRemainingSeats.test.ts:210`

```
process.env.GOOGLE_MAPS_API_KEY = '<redacted:secret>';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/megabox/tools/listNowShowing.test.ts:98`

```
process.env.GOOGLE_MAPS_API_KEY = '<redacted:secret>';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/services/oliveyoung/client.test.ts:23`

```
delete process.env.ZYTE_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in documentation code — docs/daiso-test-replay.ts — which does not run as part of the MCP server.)

**Evidence:** `docs/daiso-test-replay.ts:22`

```
const response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in documentation code — docs/oliveyoung-replay-session-test.ts — which does not run as part of the MCP server.)

**Evidence:** `docs/oliveyoung-replay-session-test.ts:122`

```
const res = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.
- Pin exact package versions in the startup command.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:51:36.909Z._
