# MCP Trust Report: github:kyle122497/llamator-mcp-server

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 31/100  
**Confidence:** 64%

**Source:** [github.com/kyle122497/llamator-mcp-server](https://github.com/kyle122497/llamator-mcp-server)

_Resolved ref: `cb91c4cb3de1f19e8e355bacc8867a9fe35e2a3b`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## Decision Reasons
- Overall score 31 falls in MEDIUM band

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
| code | 70 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 92 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (10)
### HIGH (1)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/llamator_mcp_server/worker_settings.py:219`

```
shutil.rmtree(p)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (9)
#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `src/llamator_mcp_server/infra/llamator_runner.py:98`

```
module = importlib.import_module(module_name)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/llamator_mcp_server/config/settings.py`

```

    Parse system prompts from a settings value.

    Accepts:
    - None
    - tuple/list of strings
    - a string containing JSON array (preferred) or newline-separated prompts

    :param v: Raw v
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/llamator_mcp_server/config/settings.py`

```
System prompts value must be a string, a list/tuple of strings, or null.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/llamator_mcp_server/config/settings.py`

```

    Application settings.

    Values are loaded from environment variables prefixed with ``LLAMATOR_MCP_``.

    :param redis_dsn: Redis DSN used by the HTTP server and ARQ worker.
    :param artifa
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/llamator_mcp_server/domain/models.py`

```

    OpenAI-compatible client configuration for LLAMATOR.

    :param kind: Client kind (``openai``).
    :param api_key: <redacted:secret> API key.
    :param base_url: OpenAI-compatible base URL (e.g. http:/
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/llamator_mcp_server/utils/env.py`

```

    Parse system prompts from an env value.

    Accepts JSON array (preferred) or a newline-separated string.

    :param raw: Environment raw value.
    :return: A tuple of prompts or None.
    :ra
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/llamator_mcp_server/utils/env.py`

```
Invalid JSON for system prompts.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/llamator_mcp_server/utils/env.py`

```
System prompts JSON must be an array.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/llamator_mcp_server/utils/env.py`

```
System prompts JSON must be an array of strings.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:52:31.889Z._
