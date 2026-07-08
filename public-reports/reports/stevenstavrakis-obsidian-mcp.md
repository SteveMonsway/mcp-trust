# MCP Trust Report: github:StevenStavrakis/obsidian-mcp

**Decision:** BLOCK  
**Risk:** MEDIUM  
**Score:** 33/100  
**Confidence:** 80%

_Resolved ref: `07801f301e8d55876c281891726e394e495a6355`_

## Executive Summary
The scanner found **high-confidence capability evidence in the server’s runtime code** (e.g. command execution). Review the flagged findings below before connecting this server to an agent. **A BLOCK is a "review required", not proof the server is malicious** — the evidence may be legitimate by design (see Decision Reasons).

## Decision Reasons
- Overall score 33 falls in MEDIUM band
- Critical finding with high confidence: MCP-CODE-001, MCP-CODE-001, MCP-CODE-001

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

## Findings (23)
### CRITICAL (3)
#### MCP-CODE-001: child_process.exec usage
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `src/utils/path.ts:140`

```
return await exec(cmd, { timeout: 5000 });
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `src/utils/path.ts:145`

```
const { stdout, stderr } = await exec(cmd, { timeout: 5000 });
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `src/utils/path.ts:189`

```
const { stdout, stderr } = await exec(cmd, { timeout: 5000 })
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

### MEDIUM (19)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/delete-note/index.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/delete-note/index.ts:77`

```
await fs.unlink(path.join(vaultPath, notePath));
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/delete-note/index.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/delete-note/index.ts:109`

```
await fs.unlink(fullPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/edit-note/index.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/edit-note/index.ts:101`

```
await fs.unlink(fullPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/edit-note/index.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/edit-note/index.ts:107`

```
await fs.unlink(backupPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/edit-note/index.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/edit-note/index.ts:149`

```
await fs.unlink(backupPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/edit-note/index.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/edit-note/index.ts:162`

```
await fs.unlink(backupPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/edit-note/index.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/edit-note/index.ts:190`

```
await fs.unlink(backupPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/tools/delete-note/index.ts:62`

```
const content = await fs.readFile(path.join(vaultPath, notePath), "utf-8");
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/tools/search-vault/index.ts:95`

```
const content = await fs.readFile(file, "utf-8");
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/create-note/index.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/create-note/index.ts:57`

```
await fs.writeFile(notePath, args.content, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `example.ts:93`

```
await fs.writeFile(notePath, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/tools/add-tags/index.ts:149`

```
await fs.writeFile(fullPath, updatedContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/tools/delete-note/index.ts:74`

```
await fs.writeFile(trashFilePath, contentWithMetadata);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/tools/edit-note/index.ts:146`

```
await fs.writeFile(fullPath, newContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/tools/manage-tags/index.ts:221`

```
await fs.writeFile(fullPath, updatedContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/tools/remove-tags/index.ts:168`

```
await fs.writeFile(fullPath, updatedContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/tools/rename-tag/index.ts:255`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/tools/rename-tag/index.ts:313`

```
await fs.writeFile(filePath, updatedNote, 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/links.ts:82`

```
await fs.writeFile(filePath, newContent, "utf-8");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

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

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:31.730Z._
