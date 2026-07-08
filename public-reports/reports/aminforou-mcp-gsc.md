# MCP Trust Report: github:AminForou/mcp-gsc

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 39/100  
**Confidence:** 79%

**Source:** [github.com/AminForou/mcp-gsc](https://github.com/AminForou/mcp-gsc)

_Resolved ref: `daab327277e28f8efcc83d9964fb1466a91a1d68`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## Decision Reasons
- Overall score 39 falls in MEDIUM band

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

_No tools discovered (no runtime introspection); capabilities inferred statically where possible._

## Subscores
| Subscore | Value |
|---|---|
| capability | 0 |
| code | 99 |
| config | 65 |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (14)
### HIGH (3)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `gsc_server.py:188`

```
os.remove(TOKEN_FILE)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `gsc_server.py:202`

```
os.remove(TOKEN_FILE)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `gsc_server.py:1640`

```
os.remove(TOKEN_FILE)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (5)
#### MCP-CONFIG-001: Unpinned package version in MCP startup command
**Severity:** medium  **Confidence:** 90%  **Category:** config

The startup command runs a package via npx/uvx without pinning an exact version, so the code executed can change silently between runs.

**Evidence:** `.mcp.json`

```
uvx mcp-search-console
```

**Impact:** The exact code run at startup is not reproducible and can be replaced by a malicious release.

**Remediation:** Pin an exact version, e.g. `npx -y @scope/server@1.2.3`. Avoid `latest`/floating ranges in startup commands.

#### MCP-CONFIG-001: Unpinned package version in MCP startup command
**Severity:** medium  **Confidence:** 90%  **Category:** config

The startup command runs a package via npx/uvx without pinning an exact version, so the code executed can change silently between runs.

**Evidence:** `mcp.json`

```
uvx mcp-search-console
```

**Impact:** The exact code run at startup is not reproducible and can be replaced by a malicious release.

**Remediation:** Pin an exact version, e.g. `npx -y @scope/server@1.2.3`. Avoid `latest`/floating ranges in startup commands.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `gsc_server.py:197`

```
with open(TOKEN_FILE, 'w') as token:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `gsc_server.py:220`

```
with open(TOKEN_FILE, 'w') as token:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `gsc_server.py:1661`

```
with open(TOKEN_FILE, "w") as token:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### LOW (6)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test_gsc_server.py — which does not run as part of the MCP server.)

**Evidence:** `test_gsc_server.py:101`

```
os.remove(old_token_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test_gsc_server.py — which does not run as part of the MCP server.)

**Evidence:** `test_gsc_server.py:78`

```
with open(old_token_path, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test_gsc_server.py — which does not run as part of the MCP server.)

**Evidence:** `test_gsc_server.py:721`

```
open(token_path, "w").write('{"old": "token"}')
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test_gsc_server.py — which does not run as part of the MCP server.)

**Evidence:** `test_gsc_server.py:723`

```
open(secrets_path, "w").write("{}")
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `gsc_server.py:56`

```
GSC_CREDENTIALS_PATH = _expand_path(os.environ.get("GSC_CREDENTIALS_PATH"))
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `gsc_server.py:66`

```
OAUTH_CLIENT_SECRETS_FILE = <redacted:secret>"GSC_OAUTH_CLIENT_SECRETS_FILE"))
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.
- Pin exact package versions in the startup command.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:49:53.454Z._
