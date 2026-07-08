# MCP Trust Report: github:google/mcp-security

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 34/100  
**Confidence:** 65%

**Source:** [github.com/google/mcp-security](https://github.com/google/mcp-security)

_Resolved ref: `fb807e909aa12356b0b52db02cb4b651af1ae35b`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 34 falls in MEDIUM band
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
| packageMetadata | partial |

## Capability Map
_Source: static_inference_

_No tools discovered (no runtime introspection); capabilities inferred statically where possible._

## Subscores
| Subscore | Value |
|---|---|
| capability | 0 |
| code | 78 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 96 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (18)
### MEDIUM (11)
#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `server/secops-soar/secops_soar_mcp/server.py:108`

```
module = importlib.import_module(module_import_path)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `server/secops-soar/secops_soar_mcp/marketplace/awselasticcomputecloud(ec2).py`

```
When you've decided that you no longer need an instance, you can terminate it. Terminated instances cannot be started. Notice that you can only terminate instance store-backed instances.  For more inf
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `server/secops-soar/secops_soar_mcp/marketplace/awselasticcomputecloud(ec2).py`

```
Starts an Amazon EBS-backed instance that you have previously stopped. It can take a few minutes for the instance to enter the running state. Notice that you can't start an instance store-backed insta
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `server/secops-soar/secops_soar_mcp/marketplace/awselasticcomputecloud(ec2).py`

```
Stop an Amazon EBS-backed instance. When you stop an instance, we attempt to shut it down forcibly after a short while. It can take a few minutes for the instance to stop. The instance can be started 
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `server/secops-soar/secops_soar_mcp/marketplace/googlecloudarmor.py`

```
The JSON definition of the policy to create. For more information about policies, see REST Resource: securityPolicies (https://cloud.google.com/compute/docs/reference/rest/v1/securityPolicies).
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `server/secops-soar/secops_soar_mcp/marketplace/googlecloudarmor.py`

```
JSON definition of the policy to update. For more information about the policy updates, see Method: securityPolicies.patch (https://cloud.google.com/compute/docs/reference/rest/v1/securityPolicies/pat
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `server/secops-soar/secops_soar_mcp/marketplace/googlecloudarmor.py`

```
JSON definition of the rule to add. For more information about adding a rule to a policy, see Method: securityPolicies.addRule (https://cloud.google.com/compute/docs/reference/rest/v1/securityPolicies
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `server/secops-soar/secops_soar_mcp/marketplace/misp.py`

```

Create a File Object in MISP. Requires one of: FILENAME, MD5, SHA1, SHA256, SSDEEP to be provided or “Use Entities“ parameter set to true.

Action Parameters: Event ID: The unique identifier of the e
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `server/secops-soar/secops_soar_mcp/utils/consts.py`

```
/<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→medium: this match is in build/dev-tooling code — server/secops/secops_mcp/tools/data_table_management.py — which does not run as part of the MCP server.)

**Evidence:** `server/secops/secops_mcp/tools/data_table_management.py`

```
Add rows to an existing data table in Chronicle SIEM.

    Adds new data rows to an existing data table, expanding the dataset available for
    detection rules. This is useful for maintaining and gro
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `run-with-google-adk/static/landing_script.js:127`

```
const response = await fetch(apiUrl);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (7)
#### MCP-SG-PY-001: Python shell execution (shell=True / os.system / os.popen)
**Severity:** low  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→low: this match is in documentation code — docs/conf.py — which does not run as part of the MCP server.)

**Evidence:** `docs/conf.py:33`

```
pipe = Popen("git describe --tags --always", stdout=PIPE, shell=True, cwd=os.path.abspath('../..')) # Added cwd
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use subprocess with an argument list and shell=False; never pass untrusted input to a shell.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — server/gti/tests/test_tools.py — which does not run as part of the MCP server.)

**Evidence:** `server/gti/tests/test_tools.py`

```
/<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `run-with-google-adk/main.py:127`

```
# if os.environ.get("GOOGLE_API_KEY") == "NOT_SET":
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `run-with-google-adk/main_ae.py:67`

```
# if os.environ.get("GOOGLE_API_KEY") == "NOT_SET":
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `run-with-google-adk/sample_servers_to_integrate/agents/demo_idp_agent.py:71`

```
os.environ.get("IDP_CLIENT_SECRET")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `run-with-google-adk/sample_servers_to_integrate/agents/demo_xdr_agent.py:72`

```
os.environ.get("XDR_CLIENT_SECRET")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `server/gti/gti_mcp/server.py:35`

```
api_key = <redacted:secret>"VT_APIKEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:51:13.960Z._
