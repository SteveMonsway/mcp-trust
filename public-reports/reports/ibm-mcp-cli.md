# MCP Trust Report: github:IBM/mcp-cli

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 42/100  
**Confidence:** 65%

**Source:** [github.com/IBM/mcp-cli](https://github.com/IBM/mcp-cli)

_Resolved ref: `a47fcbeb49e798f185d686f5ea433abcd0f661fe`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 42 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CODE-004, MCP-CODE-004

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
| metadata | 100 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (83)
### HIGH (4)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `diagnostics/mcp_server_diagnostic.py:351`

```
os.unlink(temp_config_file)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `diagnostics/mcp_server_diagnostic.py:1068`

```
os.unlink(temp_config_file)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `diagnostics/cli_tools_diagnostic.py:604`

```
with open(args.output, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/mcp_cli/memory/store.py:194`

```
with open(path, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (36)
#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/mcp_cli/memory/store.py:178`

```
with open(path, "r") as f:
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `diagnostics/mcp_cli_diagnostics.py:213`

```
with open("test_config.json", "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `diagnostics/mcp_cli_diagnostics.py:233`

```
with open("test_mcp_cli.py", "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `diagnostics/timeout_investigation.py:172`

```
with open("mcp_timeout_patch.py", "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/mcp_cli/config/config_manager.py:300`

```
with open(config_path, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/mcp_cli/utils/preferences.py:218`

```
with open(self.preferences_file, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `diagnostics/mcp_cli_diagnostics.py:32`

```
module = importlib.import_module(package.replace("-", "_"))
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `diagnostics/timeout_investigation.py:28`

```
module = importlib.import_module(component)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/agents/manager.py`

```
s ChatContext
            ctx = ChatContext.create(
                tool_manager=self._tool_manager,
                provider=config.provider,
                model=config.model,
                model
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/chat_context.py`

```

        Get conversation history as list of HistoryMessage objects.

        Provides backwards compatibility while using SessionManager internally.
        Handles both regular messages and tool-rel
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/chat_context.py`

```
Initialize the session with system prompt and context management.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/chat_context.py`

```
Generate system prompt from available tools (cached with dirty flag).
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/chat_context.py`

```
Build server-to-tools grouping for the system prompt.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/chat_context.py`

```
t enforce max_patterns_per_tool)
        self._enforce_memory_limits()

        logger.debug(f"Tool call recorded: {tool_name} (success={success})")

    async def get_messages_for_llm(self) -> list[d
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/conversation.py`

```

        dicts = [msg.to_dict() for msg in messages]
        dicts = ConversationProcessor._strip_old_reasoning_content(dicts)
        dicts = ConversationProcessor._validate_tool_messages(dicts)

   
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/models.py`

```
Server-to-tools grouping for system prompt generation.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/system_prompt.py`

```
Build the server/tool categorization section for the system prompt.

    Args:
        server_tool_groups: Typed list of server-to-tools groupings.
        tool_summary_threshold: When a server has mo
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/system_prompt.py`

```
Generate a concise system prompt for the assistant.

    Note: Tool definitions are passed via the API's tools parameter,
    so we don't duplicate them in the system prompt.

    When dynamic tools m
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/system_prompt.py`

```
Generate system prompt for dynamic tools mode.

    In dynamic tools mode, the LLM has access to a tool discovery system
    instead of individual tools directly. This prompt explains the workflow.

 
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/chat/testing.py`

```
t use ToolManager
        self.stream_manager = stream_manager
        self.model_manager = model_manager

        # Conversation state
        self.exit_requested = False
        self.conversation_hi
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/commands/cmd/cmd.py`

```
Custom system prompt
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/commands/models/cmd.py`

```
Custom system prompt
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/commands/plan/plan.py`

```
t mutate the original
        plan_data["steps"] = remaining_steps

        result = await runner.execute_plan(
            plan_data,
            variables=checkpoint.get("variables", {}),
        )

```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/config/defaults.py`

```
Default system prompt.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/config/defaults.py`

```
Token budget for conversation events in VM mode (on top of system prompt). Lower values force earlier eviction.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/config/defaults.py`

```
Number of tool names to show before summarizing in system prompt.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/config/defaults.py`

```
Maximum characters for memory section in system prompt.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/dashboard/bridge.py`

```
Browser updated the system prompt.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/dashboard/bridge.py`

```
Dashboard: system prompt updated (%d chars)
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/dashboard/static/js/config.js`

```
System prompt updated
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/dashboard/static/js/config.js`

```
System prompt reset to default
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/main.py`

```
Token budget for conversation events in VM mode (on top of system prompt)
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/main.py`

```
re using
    if verbose or logger.isEnabledFor(logging.DEBUG):
        timeouts = runtime_config.get_all_timeouts()
        logger.debug(
            f"Runtime timeouts: chunk={timeouts.streaming_chun
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/main.py`

```
 if no action specified
        effective_action = action or "list"

        return await cli_execute(
            "token",
            action=effective_action,
            name=name
            if ef
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/memory/store.py`

```
Format all memories as a markdown section for the system prompt.

        Returns empty string if no entries exist.
        
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `src/mcp_cli/planning/tools.py`

```
Build the system prompt for LLM plan generation.

    Reuses the same logic as plan.py's _build_plan_system_prompt.
    
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

### LOW (43)
#### MCP-CODE-004: Python shell execution (subprocess shell=True / os.system)
**Severity:** low  **Confidence:** 95%  **Category:** code

Runs a subprocess through a shell (shell=True) or via os.system, enabling command injection. (Severity reduced critical→low: this match is in example/sample code — examples/servers/custom_provider_working_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/servers/custom_provider_working_demo.py:39`

```
result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use subprocess with a list of arguments and shell=False; never pass untrusted input to a shell.

#### MCP-CODE-004: Python shell execution (subprocess shell=True / os.system)
**Severity:** low  **Confidence:** 95%  **Category:** code

Runs a subprocess through a shell (shell=True) or via os.system, enabling command injection. (Severity reduced critical→low: this match is in example/sample code — examples/servers/custom_provider_working_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/servers/custom_provider_working_demo.py:46`

```
return subprocess.run(cmd, shell=True).returncode == 0, ""
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use subprocess with a list of arguments and shell=False; never pass untrusted input to a shell.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in example/sample code — examples/servers/custom_provider_working_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/servers/custom_provider_working_demo.py:206`

```
os.unlink(temp_file)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in example/sample code — examples/streaming/real_llm_streaming_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/streaming/real_llm_streaming_demo.py:120`

```
os.unlink(script_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `examples/servers/custom_provider_working_demo.py:63`

```
openai_key = os.environ.get("OPENAI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/mcp_cli/commands/tokens/token.py:39`

```
backend_override = os.environ.get("MCP_CLI_TOKEN_BACKEND")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/commands/definitions/test_models_command_extended.py:557`

```
del os.environ["DEEPSEEK_API_KEY"]
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/commands/definitions/test_token_command.py:1301`

```
del os.environ["MCP_CLI_TOKEN_BACKEND"]
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/utils/test_preferences.py:805`

```
os.environ["CUSTOM_API_KEY"] = "test-key-default"
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/planning/plan_llm_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/planning/plan_llm_demo.py`

```
Build the system prompt that tells the LLM what tools are available.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/safety/tier1_context_safety_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/safety/tier1_context_safety_demo.py`

```

    print("=" * 70)
    print("1.3  CONVERSATION HISTORY SLIDING WINDOW")
    print("=" * 70)

    from unittest.mock import Mock
    from mcp_cli.chat.chat_context import ChatContext
    from mcp_cl
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/safety/tier2_efficiency_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/safety/tier2_efficiency_demo.py`

```
Tier 2: Efficiency & Resilience Demo

Demonstrates all nine Tier 2 features that improve performance and
error handling in production workloads:

  2.1 Eliminate triple tool result storage
  2.2 Enfor
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/safety/tier2_efficiency_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/safety/tier2_efficiency_demo.py`

```
2.3 — System prompt caching + tool summary for large server sets.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/safety/tier2_efficiency_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/safety/tier2_efficiency_demo.py`

```
2.3  SYSTEM PROMPT OPTIMIZATION
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/safety/tier2_efficiency_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/safety/tier2_efficiency_demo.py`

```
  System prompt caching:    dirty flag pattern
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/safety/tier2_efficiency_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/safety/tier2_efficiency_demo.py`

```
  Notice injected at:       index 1 (after system prompt)
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/safety/vm_memory_management_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/safety/vm_memory_management_demo.py`

```
Must contain system prompt
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/safety/vm_memory_management_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/safety/vm_memory_management_demo.py`

```
system prompt
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/safety/vm_relaxed_mode_demo.py — which does not run as part of the MCP server.)

**Evidence:** `examples/safety/vm_relaxed_mode_demo.py`

```
)[:60]}")

    return {
        "session_manager": sm,
        "vm": vm,
        "dev_msg": dev_msg,
        "vm_tools": vm_tools,
    }


# ── Infrastructure checks ──────────────────────────────────
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/tools/tool_round_trip.py — which does not run as part of the MCP server.)

**Evidence:** `examples/tools/tool_round_trip.py`

```
s tools= parameter, not embedded in system prompt
    system_prompt = generate_system_prompt(tools_schema)
    messages: List[Dict[str, Any]] = [
        {"role": "system", "content": system_prompt},

```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_chat_context.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_chat_context.py`

```
Test clear_conversation_history creates fresh session (system prompt always kept).
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_chat_context.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_chat_context.py`

```
System prompt is always included regardless of window size.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_chat_context.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_chat_context.py`

```
Tests for system prompt dirty-flag caching.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_chat_context.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_chat_context.py`

```
Tests for system prompt tool summary threshold.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_chat_context.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_chat_context.py`

```
System prompt with >20 tools summarizes (shows '... and N more').
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_chat_context.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_chat_context.py`

```
System prompt with <= threshold tools shows all tools.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_chat_context.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_chat_context.py`

```
Empty system prompt doesn't add a system message to history.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_chat_context.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_chat_context.py`

```

        from unittest.mock import Mock
        from mcp_cli.chat.session_store import SessionData, SessionMetadata

        ctx = _make_initialized_ctx(monkeypatch)
        ctx._system_prompt = "SYS"
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_chat_context.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_chat_context.py`

```
conversation_history when session has no events returns just system prompt.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_conversation.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_conversation.py`

```
t find it
        # A placeholder should be inserted right after the assistant message
        assert len(result) == 5
        assert result[2]["role"] == "tool"
        assert result[2]["tool_call_id
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_memory_integration.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_memory_integration.py`

```
Integration tests for memory scope tool interception and system prompt injection.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_system_prompt.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_system_prompt.py`

```
Tests for server/tool categorization in the system prompt.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/chat/test_system_prompt.py — which does not run as part of the MCP server.)

**Evidence:** `tests/chat/test_system_prompt.py`

```
Server groups should be listed in the system prompt.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — tests/tools/test_models.py — which does not run as part of the MCP server.)

**Evidence:** `tests/tools/test_models.py`

```
System prompt
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `diagnostics/debug_models.py:195`

```
openai_key = os.getenv("OPENAI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `examples/commands/command_system_e2e_demo.py:29`

```
self.api_key = <redacted:secret>"OPENAI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `examples/getting_started/basic_llm_call.py:32`

```
if provider.lower() == "openai" and not os.getenv("OPENAI_API_KEY"):
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `examples/planning/plan_as_tool_demo.py:395`

```
if not os.getenv("OPENAI_API_KEY"):
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `examples/planning/plan_llm_demo.py:174`

```
if not os.getenv("OPENAI_API_KEY"):
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `examples/safety/vm_relaxed_mode_demo.py:656`

```
print(f" OPENAI_API_KEY: {'set' if os.getenv('OPENAI_API_KEY') else 'NOT SET'}")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `examples/safety/vm_relaxed_mode_demo.py:673`

```
api_key = <redacted:secret>"OPENAI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `examples/tools/tool_round_trip.py:96`

```
if provider.lower() == "openai" and not os.getenv("OPENAI_API_KEY"):
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/mcp_cli/commands/tokens/token.py:755`

```
backend_override = os.environ.get("MCP_CLI_TOKEN_BACKEND")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:49:26.538Z._
