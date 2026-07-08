# MCP Trust Report: github:docling-project/docling-mcp

**Decision:** APPROVE  
**Risk:** LOW  
**Score:** 14/100  
**Confidence:** 80%

**Source:** [github.com/docling-project/docling-mcp](https://github.com/docling-project/docling-mcp)

_Resolved ref: `43b3638e6b5e673cf0bb311d2488b6ec8cf10f5a`_

## Executive Summary
No significant risks were detected in the available evidence. **This is not a safety guarantee** — standard review still applies, and see Coverage/Limitations for what was and wasn’t assessed.

## Decision Reasons
- Overall score 14 falls in LOW band

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
| code | 47 |
| config | 0 |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 23 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (6)
### LOW (6)
#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in example/sample code — examples/smolagents/smolagentfactory.py — which does not run as part of the MCP server.)

**Evidence:** `examples/smolagents/smolagentfactory.py:113`

```
with open(path, "r") as f:
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in example/sample code — examples/smolagents/smolagentfactory.py — which does not run as part of the MCP server.)

**Evidence:** `examples/smolagents/smolagentfactory.py:126`

```
with open(path, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in example/sample code — examples/llama-stack/create_doclingdocument.py — which does not run as part of the MCP server.)

**Evidence:** `examples/llama-stack/create_doclingdocument.py:65`

```
with open(cache_file, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/test_document_manipulation.py — which does not run as part of the MCP server.)

**Evidence:** `tests/test_document_manipulation.py:109`

```
with open(source_path, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/mellea/agent_models.py — which does not run as part of the MCP server.)

**Evidence:** `examples/mellea/agent_models.py`

```

    m = MelleaSession(
        ctx=mellea.stdlib.context.LinearContext(),
        backend=OllamaModelBackend(
            model_id=model_ids.OPENAI_GPT_OSS_20B #, model_options={ModelOption.SEED: 42}
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — examples/smolagents/smolagentfactory.py — which does not run as part of the MCP server.)

**Evidence:** `examples/smolagents/smolagentfactory.py`

```
Style of system prompt
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:39.634Z._
