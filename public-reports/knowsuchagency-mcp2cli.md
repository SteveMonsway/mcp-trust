# MCP Trust Report: github:knowsuchagency/mcp2cli

**Decision:** APPROVE  
**Risk:** LOW  
**Score:** 16/100  
**Confidence:** 70%

_Resolved ref: `dd2a5a6353060a7bf8d2599bf5d037d75b26a7ae`_

## Executive Summary
No significant risks were detected in the available evidence. **This is not a safety guarantee** — standard review still applies, and see Coverage/Limitations for what was and wasn’t assessed.

## Decision Reasons
- Overall score 16 falls in LOW band

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
| code | 31 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 64 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (9)
### MEDIUM (1)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/mcp2cli/__init__.py:3000`

```
stderr=open(log_path, "a"),
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### LOW (8)
#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/test_token_savings.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_token_savings.py`

```
Tests that measure and verify LLM token savings from using mcp2cli.

Compares the native tool injection approach (all tool schemas in the system
prompt on every turn) vs mcp2cli's on-demand CLI approa
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/test_token_savings.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_token_savings.py`

```
Build the tool definitions that an LLM API injects into the system prompt.

    This mirrors the Claude/OpenAI tool_use format: each tool has name,
    description, and a full JSON Schema for input_sc
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/test_token_savings.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_token_savings.py`

```
s tool definitions (3 simple tools)
MCP_TOOLS = [
    {
        "name": "echo",
        "description": "Echo back the input",
        "inputSchema": {
            "type": "object",
            "proper
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/test_token_savings.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_token_savings.py`

```

)

# Average --help output per tool, measured from realistic tool definitions.
# Simple tools ~80 tokens, complex tools (create_task) ~200 tokens.
AVG_HELP_TOKENS_PER_TOOL = 120


def _simulate_conve
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/test_token_savings.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_token_savings.py`

```
]} turns ---")
        print(f"Native tool injection:  {native_tokens} tokens/turn")
        print(f"mcp2cli system prompt:  {prompt_tokens} tokens/turn")
        print(f"Discovery (--list):     {list
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/test_token_savings.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_token_savings.py`

```

        prompt_tokens = <redacted:secret>

        # System prompt should be compact
        assert 40 <= prompt_tokens <= 80, (
            f"System prompt is {prompt_tokens} toke
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/test_token_savings.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_token_savings.py`

```

        native_tools = _build_native_tool_definitions(MCP_TOOLS)
        native_tokens = <redacted:secret>
        prompt_tokens = <redacted:secret>

        
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/test_token_savings.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_token_savings.py`

```

        native_tools = _build_native_tool_definitions(REALISTIC_MCP_TOOLS)
        native_tokens = <redacted:secret>
        per_tool = native_tokens / len(REALISTIC_MCP_TOOLS)

```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T14:27:09.194Z._
