# MCP Trust Report: github:modelcontextprotocol/servers/src/filesystem

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 33/100  
**Confidence:** 75%

**Source:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

_Resolved ref: `d31124c982401739917fd817c2a59db344529c16`_

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

## Findings (48)
### HIGH (2)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `lib.ts:177`

```
await fs.unlink(tempPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `lib.ts:275`

```
await fs.unlink(tempPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (3)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `lib.ts:165`

```
await fs.writeFile(filePath, content, { encoding: "utf-8", flag: 'wx' });
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `lib.ts:173`

```
await fs.writeFile(tempPath, content, 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `lib.ts:271`

```
await fs.writeFile(tempPath, modifiedContent, 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### LOW (42)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** low  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→low: this match is in test code — __tests__/startup-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/startup-validation.test.ts:14`

```
const proc = spawn('node', [SERVER_PATH, ...args], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/directory-tree.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/directory-tree.test.ts:73`

```
await fs.rm(testDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:29`

```
await fs.rm(testDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:459`

```
await fs.rm(testDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:666`

```
await fs.rm(testDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:914`

```
await fs.unlink(legitFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:953`

```
await fs.unlink(legitFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/startup-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/startup-validation.test.ts:53`

```
await fs.rm(testDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/structured-content.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/structured-content.test.ts:51`

```
await fs.rm(testDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/directory-tree.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/directory-tree.test.ts:64`

```
await fs.writeFile(path.join(testDir, '.env'), 'SECRET=value');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/directory-tree.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/directory-tree.test.ts:65`

```
await fs.writeFile(path.join(testDir, '.env.local'), 'LOCAL_SECRET=value');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/directory-tree.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/directory-tree.test.ts:66`

```
await fs.writeFile(path.join(testDir, 'src', 'index.js'), 'console.log("hello");');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/directory-tree.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/directory-tree.test.ts:67`

```
await fs.writeFile(path.join(testDir, 'package.json'), '{}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/directory-tree.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/directory-tree.test.ts:68`

```
await fs.writeFile(path.join(testDir, 'node_modules', 'module.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/directory-tree.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/directory-tree.test.ts:69`

```
await fs.writeFile(path.join(testDir, 'nested', 'node_modules', 'deep.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/structured-content.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/structured-content.test.ts:28`

```
await fs.writeFile(path.join(testDir, 'test.txt'), 'test content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/structured-content.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/structured-content.test.ts:30`

```
await fs.writeFile(path.join(testDir, 'subdir', 'nested.txt'), 'nested content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:16`

```
await fs.writeFile(targetFile, 'test');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:468`

```
await fs.writeFile(targetPath, 'content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:503`

```
await fs.writeFile(targetFile, 'TARGET_CONTENT');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:533`

```
await fs.writeFile(targetFile, 'FILE_CONTENT');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:576`

```
await fs.writeFile(targetFile, 'FILE_CONTENT');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:618`

```
await fs.writeFile(actualTarget, 'FINAL_CONTENT');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:662`

```
await fs.writeFile(targetFile, 'ORIGINAL CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:692`

```
await fs.writeFile(testPath, 'MODIFIED CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:755`

```
await fs.writeFile(testPath, 'NEW CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:800`

```
await fs.writeFile(deepPath, 'CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:821`

```
await fs.writeFile(targetFile, 'ORIGINAL CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:832`

```
fs.writeFile(racePath, 'NEW CONTENT', { encoding: 'utf-8', flag: 'wx' })
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:850`

```
await fs.writeFile(legitFile, 'ORIGINAL', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:876`

```
await fs.writeFile(targetFile, 'TARGET CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:908`

```
await fs.writeFile(legitFile, 'LEGIT CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:911`

```
await fs.writeFile(targetFile, 'FORBIDDEN CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:944`

```
await fs.writeFile(legitFile, 'PUBLIC CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:947`

```
await fs.writeFile(secretFile, 'SECRET CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:977`

```
await fs.writeFile(forbiddenTarget, 'ORIGINAL CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/path-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/path-validation.test.ts:983`

```
await fs.writeFile(tempFile, 'NEW CONTENT', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/startup-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/startup-validation.test.ts:89`

```
await fs.writeFile(filePath, 'content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/structured-content.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/structured-content.test.ts:174`

```
await fs.writeFile(pngPath, pngBytes);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/structured-content.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/structured-content.test.ts:196`

```
await fs.writeFile(mp3Path, mp3Bytes);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/structured-content.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/structured-content.test.ts:213`

```
await fs.writeFile(binPath, binBytes);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/structured-content.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/structured-content.test.ts:244`

```
await fs.writeFile(fancyPath, Buffer.from([0x10, 0x20, 0x30]));
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
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:48:20.964Z._
