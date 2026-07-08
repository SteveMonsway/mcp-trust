# MCP Trust Report: github:tuanle96/mcp-odoo

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 37/100  
**Confidence:** 65%

**Source:** [github.com/tuanle96/mcp-odoo](https://github.com/tuanle96/mcp-odoo)

_Resolved ref: `b609cda55715734b6f92bb77ace6362d9f46bf30`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 37 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-META-003, MCP-CONFIG-005, MCP-CONFIG-005

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
| code | 96 |
| config | 44 |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 42 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (15)
### HIGH (2)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/odoo_mcp/audit.py:76`

```
with open(path, "a", encoding="utf-8") as handle:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `src/odoo_mcp/server_core.py`

```
Resolve and confine a ``*_from_path`` value to configured upload roots.

    Fails closed: ``ODOO_MCP_ATTACHMENT_UPLOAD_ROOTS`` must be set, and the
    resolved path must sit inside one of its roots.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

### MEDIUM (6)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/odoo_multi_instance_smoke.py — which does not run as part of the MCP server.)

**Evidence:** `scripts/odoo_multi_instance_smoke.py:592`

```
os.unlink(config_path)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/odoo_compose_smoke.py:144`

```
with urllib.request.urlopen(url, timeout=5) as response:
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/odoo_compose_smoke.py:708`

```
with urllib.request.urlopen(request, timeout=30) as response:
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/odoo_multi_instance_smoke.py:199`

```
with urllib.request.urlopen(url, timeout=5) as response:
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/odoo_mcp/odoo_client.py:332`

```
with urllib.request.urlopen(
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/odoo_mcp/odoo_client.py:447`

```
with urllib.request.urlopen(
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (7)
#### MCP-CONFIG-001: Unpinned package version in MCP startup command
**Severity:** low  **Confidence:** 90%  **Category:** config

The startup command runs a package via npx/uvx without pinning an exact version, so the code executed can change silently between runs. (Severity reduced medium→low: this match is in example/sample code — examples/cursor/mcp.json — which does not run as part of the MCP server.)

**Evidence:** `examples/cursor/mcp.json`

```
uvx odoo-mcp
```

**Impact:** The exact code run at startup is not reproducible and can be replaced by a malicious release.

**Remediation:** Pin an exact version, e.g. `npx -y @scope/server@1.2.3`. Avoid `latest`/floating ranges in startup commands.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** low  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference. (Severity reduced high→low: this match is in example/sample code — examples/cursor/mcp.json — which does not run as part of the MCP server.)

**Evidence:** `examples/cursor/mcp.json`

```
ODOO_USERNAME=${env:ODOO_USERNAME}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** low  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference. (Severity reduced high→low: this match is in example/sample code — examples/cursor/mcp.json — which does not run as part of the MCP server.)

**Evidence:** `examples/cursor/mcp.json`

```
ODOO_PASSWORD=<redacted:secret>}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `examples/openai-agents/odoo_agent.py:33`

```
client = AsyncOpenAI(base_url=base_url, api_key=<redacted:secret>"OPENAI_API_KEY"])
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/odoo_mcp/odoo_client.py:769`

```
"password": os.environ["ODOO_PASSWORD"],
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/odoo_mcp/odoo_client.py:774`

```
config["api_key"] = os.environ["ODOO_API_KEY"]
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `src/odoo_mcp/odoo_client.py:792`

```
merged["api_key"] = os.environ["ODOO_API_KEY"]
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.
- Pin exact package versions in the startup command.
- Move secrets out of config into a secrets manager or environment injected at runtime.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:51:28.301Z._
