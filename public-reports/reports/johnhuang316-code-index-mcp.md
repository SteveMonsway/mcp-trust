# MCP Trust Report: github:johnhuang316/code-index-mcp

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 33/100  
**Confidence:** 75%

**Source:** [github.com/johnhuang316/code-index-mcp](https://github.com/johnhuang316/code-index-mcp)

_Resolved ref: `5e8d5fce10a29a58b71f736824253fb22e239610`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## ⚠️ Limitations
- Additionally, C#, Go, Java, Kotlin, Rust source is present but was NOT analyzed — MCP Trust has code rules for JavaScript, TypeScript and Python only. Absence of code findings does not imply this server is safe.

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

## Findings (22)
### HIGH (4)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/code_index_mcp/indexing/sqlite_index_manager.py:69`

```
os.remove(legacy_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/code_index_mcp/indexing/sqlite_store.py:69`

```
os.remove(self.db_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/code_index_mcp/project_settings.py:379`

```
os.remove(legacy_file)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/code_index_mcp/project_settings.py:400`

```
os.unlink(file_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (6)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/code_index_mcp/indexing/json_index_builder.py:407`

```
with open(index_path, 'w', encoding='utf-8') as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/code_index_mcp/indexing/shallow_index_manager.py:80`

```
with open(self.index_path, 'w', encoding='utf-8') as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/code_index_mcp/indexing/sqlite_index_manager.py:190`

```
with open(self.shallow_index_path, "w", encoding="utf-8") as handle:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/code_index_mcp/project_settings.py:232`

```
with open(config_path, "w", encoding="utf-8") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/code_index_mcp/project_settings.py:303`

```
with open(index_path, "w", encoding="utf-8") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/code_index_mcp/project_settings.py:322`

```
with open(fallback_path, "w", encoding="utf-8") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### LOW (12)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/test_env_config.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_env_config.py:549`

```
shutil.rmtree(self._tmpdir, ignore_errors=True)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/test_server_config.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_server_config.py:53`

```
shutil.rmtree(custom_root)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/test_server_config.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_server_config.py:66`

```
shutil.rmtree(temp_dir)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/test_server_config.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_server_config.py:95`

```
shutil.rmtree(custom_root)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/sample-projects/python/user_management/cli.py — which does not run as part of the MCP server.)

**Evidence:** `test/sample-projects/python/user_management/cli.py:210`

```
with open(output, 'w') as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/sample-projects/python/user_management/services/user_manager.py — which does not run as part of the MCP server.)

**Evidence:** `test/sample-projects/python/user_management/services/user_manager.py:177`

```
with open(self._storage_path, 'w') as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/search/test_exclude_migration.py — which does not run as part of the MCP server.)

**Evidence:** `tests/search/test_exclude_migration.py:24`

```
with open(config_path, 'w') as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/search/test_exclude_migration.py — which does not run as part of the MCP server.)

**Evidence:** `tests/search/test_exclude_migration.py:44`

```
with open(config_path, 'w') as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/search/test_exclude_migration.py — which does not run as part of the MCP server.)

**Evidence:** `tests/search/test_exclude_migration.py:57`

```
with open(config_path, 'w') as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `test/sample-projects/javascript/user-management/src/middleware/auth.js:23`

```
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `test/sample-projects/javascript/user-management/src/models/User.js:156`

```
process.env.JWT_SECRET || 'fallback-secret',
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `test/sample-projects/typescript/user-management/src/models/User.ts:159`

```
return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:01.812Z._
