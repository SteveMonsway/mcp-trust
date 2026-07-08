# MCP Trust Report: github:neo4j-contrib/mcp-neo4j

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 35/100  
**Confidence:** 60%

**Source:** [github.com/neo4j-contrib/mcp-neo4j](https://github.com/neo4j-contrib/mcp-neo4j)

_Resolved ref: `dbc01ba78f171851f2d57dcd125b028c29912fd1`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 35 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-META-003, MCP-META-003

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
| packageMetadata | partial |

## Capability Map
_Source: static_inference_

_No tools discovered (no runtime introspection); capabilities inferred statically where possible._

## Subscores
| Subscore | Value |
|---|---|
| capability | 0 |
| code | 99 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 23 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (27)
### MEDIUM (10)
#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/aura_api_client.py:95`

```
response = requests.get(url, headers=self._get_headers())
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/aura_api_client.py:110`

```
response = requests.get(url, headers=self._get_headers())
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/aura_api_client.py:117`

```
response = requests.get(url, headers=self._get_headers())
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/aura_api_client.py:198`

```
response = requests.post(url, headers=self._get_headers(), json=payload)
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/aura_api_client.py:223`

```
response = requests.patch(url, headers=self._get_headers(), json=payload)
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/aura_api_client.py:229`

```
response = requests.post(url, headers=self._get_headers())
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/aura_api_client.py:235`

```
response = requests.post(url, headers=self._get_headers())
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/aura_api_client.py:241`

```
response = requests.get(url, headers=self._get_headers())
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/aura_api_client.py:247`

```
response = requests.get(url, headers=self._get_headers())
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/aura_api_client.py:260`

```
response = requests.delete(url, headers=self._get_headers())
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (17)
#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/__init__.py:21`

```
default=os.environ.get("NEO4J_AURA_CLIENT_SECRET"))
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/tests/integration/conftest.py:14`

```
if (not os.environ.get("NEO4J_AURA_CLIENT_ID") or not os.environ.get("NEO4J_AURA_CLIENT_SECRET")):
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/tests/integration/test_aura_IT.py:14`

```
not os.environ.get("NEO4J_AURA_CLIENT_ID") or not os.environ.get("NEO4J_AURA_CLIENT_SECRET"),
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/tests/integration/test_http_transport_IT.py:38`

```
client_secret = <redacted:secret>"NEO4J_AURA_CLIENT_SECRET")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/tests/unit/test_utils.py:156`

```
os.environ["NEO4J_AURA_CLIENT_SECRET"] = "env-client-secret"
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `servers/mcp-neo4j-cypher/tests/unit/test_utils.py:471`

```
os.environ["NEO4J_RESPONSE_TOKEN_LIMIT"] = "3000"
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `servers/mcp-neo4j-memory/tests/integration/test_neo4j_memory_IT.py:11`

```
password = <redacted:secret>"NEO4J_PASSWORD", "password")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→low: this match is in test code — servers/mcp-neo4j-memory/tests/unit/test_neo4j_memory.py — which does not run as part of the MCP server.)

**Evidence:** `servers/mcp-neo4j-memory/tests/unit/test_neo4j_memory.py`

```
X` WITH 1 as x MATCH (s:Secret) CREATE (e:Exfiltrated {data: s.name + ':' + s.value}) //
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→low: this match is in test code — servers/mcp-neo4j-memory/tests/unit/test_neo4j_memory.py — which does not run as part of the MCP server.)

**Evidence:** `servers/mcp-neo4j-memory/tests/unit/test_neo4j_memory.py`

```
exfiltration_injection
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/utils.py:97`

```
if os.getenv("NEO4J_AURA_CLIENT_SECRET") is not None:
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `servers/mcp-neo4j-cloud-aura-api/src/mcp_neo4j_aura_manager/utils.py:98`

```
return os.getenv("NEO4J_AURA_CLIENT_SECRET")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `servers/mcp-neo4j-cypher/src/mcp_neo4j_cypher/utils.py:93`

```
if os.getenv("NEO4J_PASSWORD") is not None:
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `servers/mcp-neo4j-cypher/src/mcp_neo4j_cypher/utils.py:94`

```
config["password"] = os.getenv("NEO4J_PASSWORD")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `servers/mcp-neo4j-cypher/src/mcp_neo4j_cypher/utils.py:253`

```
if os.getenv("NEO4J_RESPONSE_TOKEN_LIMIT") is not None:
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `servers/mcp-neo4j-cypher/src/mcp_neo4j_cypher/utils.py:254`

```
config["token_limit"] = int(os.getenv("NEO4J_RESPONSE_TOKEN_LIMIT"))
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `servers/mcp-neo4j-memory/src/mcp_neo4j_memory/utils.py:65`

```
if os.getenv("NEO4J_PASSWORD") is not None:
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `servers/mcp-neo4j-memory/src/mcp_neo4j_memory/utils.py:66`

```
config["neo4j_password"] = os.getenv("NEO4J_PASSWORD")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:04.505Z._
