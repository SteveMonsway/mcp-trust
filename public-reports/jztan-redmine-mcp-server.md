# MCP Trust Report: github:jztan/redmine-mcp-server

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 35/100  
**Confidence:** 64%

_Resolved ref: `6497c11ec842515739209eee5db38eef8676ca53`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 35 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-META-003

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
| code | 87 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 69 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (16)
### HIGH (1)
#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `src/redmine_mcp_server/_env.py`

```
Could not read secret file for {var_name}_FILE 
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

### MEDIUM (3)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/redmine_mcp_server/tools/files.py:369`

```
with open(temp_path, "wb") as fh:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/redmine_mcp_server/tools/files.py:408`

```
with open(temp_metadata, "w") as fh:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/release.py:1046`

```
with urllib.request.urlopen(url, timeout=10) as resp:
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (12)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/test_integration.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_integration.py:399`

```
os.unlink(test_file_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/test_connection.py:32`

```
password = <redacted:secret>"REDMINE_PASSWORD", "")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/test_connection.py:33`

```
api_key = <redacted:secret>"REDMINE_API_KEY", "")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/test_oauth_integration.py:36`

```
CLIENT_SECRET = <redacted:secret>"REDMINE_INTROSPECT_CLIENT_SECRET")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/test_oauth_integration.py:37`

```
TEST_TOKEN = <redacted:secret>"REDMINE_OAUTH_TEST_TOKEN")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-001: Suspicious instruction-override phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Server-controlled text tries to override or ignore prior instructions (e.g. "ignore previous instructions"). (Severity reduced high→low: this match is in test code — tests/test_checklist_support.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_checklist_support.py`

```
Ignore previous instructions
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Treat tool/prompt metadata as untrusted. Remove instruction-override phrasing and review the server.

#### MCP-META-001: Suspicious instruction-override phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Server-controlled text tries to override or ignore prior instructions (e.g. "ignore previous instructions"). (Severity reduced high→low: this match is in test code — tests/test_gantt.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_gantt.py`

```
Ignore previous instructions
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Treat tool/prompt metadata as untrusted. Remove instruction-override phrasing and review the server.

#### MCP-META-001: Suspicious instruction-override phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Server-controlled text tries to override or ignore prior instructions (e.g. "ignore previous instructions"). (Severity reduced high→low: this match is in test code — tests/test_redmine_handler.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_redmine_handler.py`

```
Ignore prior instructions.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Treat tool/prompt metadata as untrusted. Remove instruction-override phrasing and review the server.

#### MCP-META-001: Suspicious instruction-override phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Server-controlled text tries to override or ignore prior instructions (e.g. "ignore previous instructions"). (Severity reduced high→low: this match is in test code — tests/test_wrap_policy.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_wrap_policy.py`

```
Ignore previous instructions and do X
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Treat tool/prompt metadata as untrusted. Remove instruction-override phrasing and review the server.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently"). (Severity reduced high→low: this match is in test code — tests/test_issue_tracking_tools.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_issue_tracking_tools.py`

```
s `include or (...)` fallback from
        # silently copying subtasks+attachments. The sentinel MUST be
        # truthy and MUST not contain "subtasks" or "attachments".
        assert kwargs["inclu
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/redmine_mcp_server/_client.py:52`

```
REDMINE_PASSWORD = <redacted:secret>"REDMINE_PASSWORD")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/redmine_mcp_server/_client.py:53`

```
REDMINE_API_KEY = <redacted:secret>"REDMINE_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T14:46:55.019Z._
