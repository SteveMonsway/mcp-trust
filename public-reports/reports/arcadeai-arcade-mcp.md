# MCP Trust Report: github:ArcadeAI/arcade-mcp

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 41/100  
**Confidence:** 69%

**Source:** [github.com/ArcadeAI/arcade-mcp](https://github.com/ArcadeAI/arcade-mcp)

_Resolved ref: `c2bf679424493a0b08767cedf7a5697ea12a7a72`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 41 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-META-003, MCP-META-003

## Coverage
| Check | State |
|---|---|
| configScan | not_available |
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
| metadata | 95 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (39)
### HIGH (5)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `libs/arcade-cli/arcade_cli/main.py:154`

```
os.remove(CREDENTIALS_FILE_PATH)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `libs/arcade-cli/arcade_cli/new.py:99`

```
shutil.rmtree(toolkit_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `libs/arcade-core/arcade_core/usage/identity.py:98`

```
os.unlink(temp_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `libs/arcade-cli/arcade_cli/main.py`

```
Failed to read credentials
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `libs/arcade-mcp-server/arcade_mcp_server/transports/stdio.py`

```
Send data to stdout.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

### MEDIUM (10)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `libs/arcade-cli/arcade_cli/display.py:474`

```
with open(output_path, "w", encoding="utf-8") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `libs/arcade-cli/arcade_cli/evals_runner.py:511`

```
with open(file_path, "w", encoding="utf-8") as outfile:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `libs/arcade-cli/arcade_cli/update.py:67`

```
with open(cache_path, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `libs/arcade-evals/arcade_evals/capture.py:174`

```
with open(file_path, "w", encoding="utf-8") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `libs/arcade-cli/arcade_cli/utils.py:1213`

```
importlib.import_module(package_name.replace("-", "_"))
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `libs/arcade-core/arcade_core/catalog.py:314`

```
module = import_module(module_name)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `libs/arcade-serve/arcade_serve/fastapi/_arcade_telemetry.py:25`

```
return importlib.import_module(module_name)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `libs/arcade-mcp-server/arcade_mcp_server/session.py`

```
)} -> routing to RequestManager"
                    )
                    await self._request_manager.handle_response(data)
                return

            # Otherwise, process as incoming reques
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `libs/arcade-serve/arcade_serve/core/base.py`

```
{execution_id} | Developer message: {output.error.developer_message}
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `libs/arcade-tdk/arcade_tdk/providers/slack/error_adapter.py`

```

        # Extract error code from Slack API response
        error_code = "unknown_error"
        if hasattr(error, "response") and error.response:
            error_code = error.response.get("error"
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

### LOW (24)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/no_auth_cli_smoke.py — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/no_auth_cli_smoke.py:230`

```
shutil.rmtree(config_tmp, ignore_errors=True)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/no_auth_cli_smoke.py — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/no_auth_cli_smoke.py:283`

```
shutil.rmtree(scaffold_dir, ignore_errors=True)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in example/sample code — examples/mcp_servers/local_filesystem/src/local_filesystem/tools.py — which does not run as part of the MCP server.)

**Evidence:** `examples/mcp_servers/local_filesystem/src/local_filesystem/tools.py:164`

```
with open(p, "wb") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in example/sample code — examples/mcp_servers/local_filesystem/src/local_filesystem/tools.py — which does not run as part of the MCP server.)

**Evidence:** `examples/mcp_servers/local_filesystem/src/local_filesystem/tools.py:168`

```
with open(p, "ab") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in example/sample code — examples/mcp_servers/local_filesystem/src/local_filesystem/tools.py — which does not run as part of the MCP server.)

**Evidence:** `examples/mcp_servers/local_filesystem/src/local_filesystem/tools.py:173`

```
with open(p, "wb") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `examples/evals/eval_arcade_gateway.py:41`

```
ARCADE_API_KEY = <redacted:secret>"ARCADE_API_KEY", "YOUR_ARCADE_API_KEY_HERE")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `examples/evals/eval_comprehensive_comparison.py:32`

```
ARCADE_API_KEY = <redacted:secret>"ARCADE_API_KEY", "YOUR_ARCADE_API_KEY_HERE")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `examples/evals/eval_pctx_code_mode.py:45`

```
OPENROUTER_API_KEY = <redacted:secret>"OPENROUTER_API_KEY", "")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `examples/evals/eval_pctx_code_mode.py:46`

```
OPENAI_API_KEY = <redacted:secret>"OPENAI_API_KEY", "")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `examples/mcp_servers/telemetry_passback/src/telemetry_passback/agent.py:230`

```
api_key = <redacted:secret>"GALILEO_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `libs/arcade-evals/arcade_evals/loaders.py:374`

```
api_key = <redacted:secret> or os.environ.get("ARCADE_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `libs/arcade-serve/arcade_serve/core/base.py:78`

```
env_secret = <redacted:secret>"ARCADE_WORKER_SECRET")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `libs/tests/arcade_mcp_server/test_server.py:1651`

```
os.environ["API_KEY"] = old_api_key
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `libs/tests/arcade_mcp_server/test_server.py:1653`

```
os.environ["SECRET_TOKEN"] = old_secret_token
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `libs/tests/arcade_mcp_server/test_server.py:1816`

```
os.environ["WORKER_API_KEY"] = old_value
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — libs/tests/arcade_mcp_server/test_debug_exposure_integration.py — which does not run as part of the MCP server.)

**Evidence:** `libs/tests/arcade_mcp_server/test_debug_exposure_integration.py`

```
Developer message stays out of MCP content but is attached to telemetry.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — libs/tests/core/test_executor.py — which does not run as part of the MCP server.)

**Evidence:** `libs/tests/core/test_executor.py`

```
test developer message
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — libs/tests/core/test_executor.py — which does not run as part of the MCP server.)

**Evidence:** `libs/tests/core/test_executor.py`

```
[TOOL_RUNTIME_RETRY] RetryableToolError during execution of tool 'retryable_error_tool': test developer message
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — libs/tests/core/test_executor.py — which does not run as part of the MCP server.)

**Evidence:** `libs/tests/core/test_executor.py`

```
[TOOL_RUNTIME_FATAL] ToolExecutionError during execution of tool 'tool_execution_error_tool': test developer message
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — libs/tests/core/test_executor.py — which does not run as part of the MCP server.)

**Evidence:** `libs/tests/core/test_executor.py`

```
: test developer message",
                    can_retry=False,
                )
            ),
        ),
        (
            bad_output_error_tool,
            {},
            ToolCallOutput(
   
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — libs/tests/core/test_executor.py — which does not run as part of the MCP server.)

**Evidence:** `libs/tests/core/test_executor.py`

```
developer message mismatch
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — libs/tests/worker/test_worker_base.py — which does not run as part of the MCP server.)

**Evidence:** `libs/tests/worker/test_worker_base.py`

```
Developer message: ...
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — libs/tests/worker/test_worker_base.py — which does not run as part of the MCP server.)

**Evidence:** `libs/tests/worker/test_worker_base.py`

```
Developer message:
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `libs/arcade-evals/arcade_evals/loaders.py:430`

```
env["ARCADE_API_KEY"] = os.environ["ARCADE_API_KEY"]
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:06.496Z._
