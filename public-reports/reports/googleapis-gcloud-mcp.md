# MCP Trust Report: github:googleapis/gcloud-mcp

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 37/100  
**Confidence:** 71%

**Source:** [github.com/googleapis/gcloud-mcp](https://github.com/googleapis/gcloud-mcp)

_Resolved ref: `7a07667457b7305acd05fb95ded13f4e996628c8`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## ⚠️ Limitations
- Additionally, Go source is present but was NOT analyzed — MCP Trust has code rules for JavaScript, TypeScript and Python only. Absence of code findings does not imply this server is safe.

## Decision Reasons
- Overall score 37 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002

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
| metadata | 43 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (31)
### MEDIUM (9)
#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `packages/storage-mcp/src/tools/objects/upload_object_safe.ts:70`

```
await file.save(fs.readFileSync(params.file_path), {
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/backupdr-mcp/src/commands/init-gemini-cli.ts:64`

```
await fs.writeFile(extensionFile, JSON.stringify(extensionJson, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/backupdr-mcp/src/commands/init-gemini-cli.ts:85`

```
await fs.writeFile(geminiMdDestPath, geminiMdContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/gcloud-mcp/src/commands/init-gemini-cli.ts:82`

```
await fs.writeFile(extensionFile, JSON.stringify(extensionJson, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/gcloud-mcp/src/commands/init-gemini-cli.ts:89`

```
await fs.writeFile(geminiMdDestPath, geminiMd);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/observability-mcp/src/commands/init-gemini-cli.ts:78`

```
await fs.writeFile(extensionFile, JSON.stringify(extensionJson, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/observability-mcp/src/commands/init-gemini-cli.ts:84`

```
await fs.writeFile(geminiMdDestPath, geminiMd);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/storage-mcp/src/commands/init-gemini-cli.ts:82`

```
await fs.writeFile(extensionFile, JSON.stringify(extensionJson, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/storage-mcp/src/commands/init-gemini-cli.ts:89`

```
await fs.writeFile(geminiMdDestPath, geminiMdContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### LOW (22)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — packages/backupdr-mcp/tests/integration/workflow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/backupdr-mcp/tests/integration/workflow.test.ts:118`

```
execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — packages/backupdr-mcp/tests/integration/workflow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/backupdr-mcp/tests/integration/workflow.test.ts:121`

```
execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — packages/backupdr-mcp/tests/integration/workflow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/backupdr-mcp/tests/integration/workflow.test.ts:186`

```
execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — packages/backupdr-mcp/tests/integration/workflow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/backupdr-mcp/tests/integration/workflow.test.ts:189`

```
execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — packages/backupdr-mcp/tests/integration/workflow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/backupdr-mcp/tests/integration/workflow.test.ts:192`

```
execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — packages/storage-mcp/tests/e2e/gcs_agentic_workflow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/e2e/gcs_agentic_workflow.test.ts:28`

```
const result = execSync(command, { encoding: 'utf-8', timeout: 300000 });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/storage-mcp/tests/e2e/gcs_agentic_workflow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/e2e/gcs_agentic_workflow.test.ts:65`

```
if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/storage-mcp/tests/integration/gcs-mime-type.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs-mime-type.test.ts:112`

```
fs.unlinkSync(filePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/storage-mcp/tests/integration/gcs-safe.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs-safe.test.ts:116`

```
fs.unlinkSync(uploadFilePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/storage-mcp/tests/integration/gcs-safe.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs-safe.test.ts:202`

```
fs.unlinkSync(uploadFilePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/storage-mcp/tests/integration/gcs.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs.test.ts:151`

```
fs.unlinkSync(uploadFilePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/storage-mcp/tests/integration/gcs.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs.test.ts:293`

```
fs.unlinkSync(downloadFilePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — packages/storage-mcp/src/tools/objects/upload_object_safe.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/src/tools/objects/upload_object_safe.test.ts:63`

```
expect(mockSave).toHaveBeenCalledWith(fs.readFileSync('/path/to/file'), {
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/storage-mcp/tests/e2e/gcs_agentic_workflow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/e2e/gcs_agentic_workflow.test.ts:61`

```
fs.writeFileSync(localFilePath, fileContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/storage-mcp/tests/integration/gcs-mime-type.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs-mime-type.test.ts:105`

```
fs.writeFileSync(filePath, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/storage-mcp/tests/integration/gcs-safe.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs-safe.test.ts:91`

```
fs.writeFileSync(uploadFilePath, safeTestObjectContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/storage-mcp/tests/integration/gcs-safe.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs-safe.test.ts:185`

```
fs.writeFileSync(uploadFilePath, safeTestObjectContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/storage-mcp/tests/integration/gcs.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs.test.ts:143`

```
fs.writeFileSync(uploadFilePath, testObjectContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/backupdr-mcp/src/tools/backups/restore_backup.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/backupdr-mcp/src/tools/backups/restore_backup.test.ts`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/storage-mcp/tests/integration/gcs-mime-type.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs-mime-type.test.ts`

```
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/storage-mcp/tests/integration/gcs-mime-type.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs-mime-type.test.ts`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/storage-mcp/tests/integration/gcs-mime-type.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/storage-mcp/tests/integration/gcs-mime-type.test.ts`

```
R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:40.531Z._
