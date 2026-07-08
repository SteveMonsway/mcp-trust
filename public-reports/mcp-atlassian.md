# MCP Trust Report: github:sooperset/mcp-atlassian

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 41/100  
**Confidence:** 67%

_Resolved ref: `eeaefcbe776903f4ac29077b0f54abd2e99cf872`_

## Executive Summary
This MCP server requires human security review before use; notable risks were detected.

## Decision Reasons
- Overall score 41 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-SG-PY-004, MCP-SG-PY-004, MCP-SG-PY-004

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
| metadata | 98 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (50)
### HIGH (5)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/mcp_atlassian/preprocessing/confluence.py:93`

```
shutil.rmtree(temp_dir, ignore_errors=True)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").

**Evidence:** `src/mcp_atlassian/jira/issues.py`

```
."
                )

            # Handle Epic and Subtask issue type names across different languages
            actual_issue_id = None
            if self._is_epic_issue_type(issue_type) and issue
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").

**Evidence:** `src/mcp_atlassian/jira/issues.py`

```
re not part of fields update
                    if not value or not isinstance(value, list | tuple):
                        logger.warning(f"Invalid attachments value: {value}")

                eli
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").

**Evidence:** `src/mcp_atlassian/servers/jira.py`

```
Assign a Jira issue to a user using the dedicated assignment endpoint.

    This is more reliable than setting assignee via update_issue, which is
    silently ignored by some Jira configurations. Use
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").

**Evidence:** `src/mcp_atlassian/utils/toolsets.py`

```
Parse the TOOLSETS env var into a set of enabled toolset names.

    Supports keywords 'all' (all 21 toolsets) and 'default' (6 defaults),
    plus comma-separated specific toolset names. Case-insensi
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

### MEDIUM (27)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/mcp_atlassian/confluence/attachments.py:324`

```
with open(target_path, "wb") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/mcp_atlassian/jira/attachments.py:55`

```
with open(target_path, "wb") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/mcp_atlassian/utils/oauth.py:429`

```
client_id: The OAuth client ID
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `src/mcp_atlassian/__init__.py:383`

```
os.environ["CONFLUENCE_API_TOKEN"] = confluence_token
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `src/mcp_atlassian/__init__.py:385`

```
os.environ["CONFLUENCE_PERSONAL_TOKEN"] = confluence_personal_token
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `src/mcp_atlassian/__init__.py:391`

```
os.environ["JIRA_API_TOKEN"] = jira_token
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `src/mcp_atlassian/__init__.py:393`

```
os.environ["JIRA_PERSONAL_TOKEN"] = jira_personal_token
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `src/mcp_atlassian/__init__.py:397`

```
os.environ["ATLASSIAN_OAUTH_CLIENT_SECRET"] = oauth_client_secret
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `src/mcp_atlassian/__init__.py:405`

```
os.environ["ATLASSIAN_OAUTH_ACCESS_TOKEN"] = oauth_access_token
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `scripts/oauth_authorize.py:315`

```
args.client_secret = <redacted:secret>"ATLASSIAN_OAUTH_CLIENT_SECRET")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/confluence/config.py:111`

```
api_token = <redacted:secret>"CONFLUENCE_API_TOKEN")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/confluence/config.py:112`

```
personal_token = <redacted:secret>"CONFLUENCE_PERSONAL_TOKEN")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/confluence/config.py:188`

```
client_key_password = <redacted:secret>"CONFLUENCE_CLIENT_KEY_PASSWORD")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/jira/config.py:179`

```
api_token = <redacted:secret>"JIRA_API_TOKEN")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/jira/config.py:180`

```
personal_token = <redacted:secret>"JIRA_PERSONAL_TOKEN")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/jira/config.py:258`

```
client_key_password = <redacted:secret>"JIRA_CLIENT_KEY_PASSWORD")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `src/mcp_atlassian/servers/client_storage.py:48`

```
module = import_module(module_path)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/servers/main.py:749`

```
os.getenv("ATLASSIAN_OAUTH_CLIENT_SECRET")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/servers/main.py:750`

```
or os.getenv("JIRA_OAUTH_CLIENT_SECRET")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/servers/main.py:751`

```
or os.getenv("CONFLUENCE_OAUTH_CLIENT_SECRET")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/utils/oauth.py:506`

```
) or os.getenv("ATLASSIAN_OAUTH_CLIENT_SECRET")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/mcp_atlassian/utils/oauth.py:625`

```
) or os.getenv("ATLASSIAN_OAUTH_ACCESS_TOKEN")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp_atlassian/servers/confluence.py`

```
For example, in the URL 'https://example.atlassian.<redacted:high-entropy>', 
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently"). (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/generate_tool_docs.py — which does not run as part of the MCP server.)

**Evidence:** `scripts/generate_tool_docs.py`

```
Escape characters that break MDX parsing inside Markdown table cells.

    Curly braces are interpreted as JSX expressions by MDX. When they appear
    in table-cell descriptions (outside fenced code 
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `src/mcp_atlassian/jira/users.py:253`

```
response = requests.get(
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `src/mcp_atlassian/utils/oauth.py:177`

```
response = requests.post(token_endpoint, data=payload, timeout=HTTP_TIMEOUT)
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `src/mcp_atlassian/utils/oauth.py:277`

```
response = requests.post(self.token_url, data=payload, timeout=HTTP_TIMEOUT)
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (18)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/unit/test_stdin_monitoring_fix.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/test_stdin_monitoring_fix.py:63`

```
os.unlink(test_script)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/e2e/cloud/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/e2e/cloud/conftest.py:62`

```
api_token=<redacted:secret>"CLOUD_E2E_API_TOKEN", ""),
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/e2e/cloud/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/e2e/cloud/conftest.py:65`

```
oauth_access_token=<redacted:secret>"CLOUD_E2E_OAUTH_ACCESS_TOKEN", ""),
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/confluence/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/confluence/conftest.py:619`

```
api_token=<redacted:secret>"CONFLUENCE_API_TOKEN"],
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/jira/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/jira/conftest.py:399`

```
api_token=<redacted:secret>"JIRA_API_TOKEN"],
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/utils/test_environment.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/utils/test_environment.py:226`

```
os.environ["CONFLUENCE_API_TOKEN"] = "api_token"
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/utils/test_environment.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/utils/test_environment.py:406`

```
os.environ["ATLASSIAN_OAUTH_CLIENT_SECRET"] = "dc-secret"
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/utils/test_environment.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/utils/test_environment.py:421`

```
os.environ["JIRA_OAUTH_CLIENT_SECRET"] = "jira-dc-secret"
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tests/unit/utils/test_environment.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/utils/test_environment.py:432`

```
os.environ["ATLASSIAN_OAUTH_ACCESS_TOKEN"] = "my-dc-token"
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/e2e/cloud/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/e2e/cloud/conftest.py`

```
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/e2e/conftest.py — which does not run as part of the MCP server.)

**Evidence:** `tests/e2e/conftest.py`

```
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/fixtures/confluence_mocks.py — which does not run as part of the MCP server.)

**Evidence:** `tests/fixtures/confluence_mocks.py`

```
/<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/fixtures/confluence_mocks.py — which does not run as part of the MCP server.)

**Evidence:** `tests/fixtures/confluence_mocks.py`

```
/<redacted:high-entropy>?focusedCommentId=456789123
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/unit/jira/test_development.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/jira/test_development.py`

```
https://stash.example.<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/unit/preprocessing/test_preprocessing.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/preprocessing/test_preprocessing.py`

```
{base_url}/<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/unit/servers/test_confluence_server.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/servers/test_confluence_server.py`

```
https://example.atlassian.<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently"). (Severity reduced high→low: this match is in test code — tests/unit/jira/test_issues.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/jira/test_issues.py`

```
s normalized format)
        issues_mixin.get_available_transitions = MagicMock(
            return_value=[
                {
                    "id": "21",
                    "name": "In Progress",
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently"). (Severity reduced high→low: this match is in test code — tests/unit/servers/test_main_server.py — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/servers/test_main_server.py`

```
Regression tests for the SSRF short-circuit in UserTokenMiddleware.

    Covers the auth_validation_error path set by ``_process_authentication_headers``
    when ``validate_url_for_ssrf`` flags an X-
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.0 at 2026-07-08T09:55:44.742Z._
