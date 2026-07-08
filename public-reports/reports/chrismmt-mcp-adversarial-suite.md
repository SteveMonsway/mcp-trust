# MCP Trust Report: github:chrismmt/mcp-adversarial-suite

**Decision:** NEEDS_REVIEW  
**Risk:** LOW  
**Score:** 22/100  
**Confidence:** 63%

_Resolved ref: `53d55836ae18d061e7c50dadf303dd46369d9100`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 22 falls in LOW band
- Elevated to NEEDS_REVIEW by: MCP-META-003, MCP-META-003, MCP-META-003, MCP-META-003, MCP-META-003, MCP-META-003, MCP-META-003, MCP-META-003, MCP-META-003, MCP-META-003

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
| code | 41 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 97 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (12)
### HIGH (4)
#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `servers/insecurefs/src/index.ts`

```
exfiltrate
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `servers/insecurefs/src/index.ts`

```
Attempt to exfiltrate data (blocked by design)
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `servers/insecurefs/src/index.ts`

```
Data to exfiltrate
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `servers/insecurefs/src/index.ts`

```
exfiltration_blocked
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

### MEDIUM (4)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/mcp-test-client.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/mcp-test-client.mjs:41`

```
const proc = spawn("node", [serverPath], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify_mcptrust.sh — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify_mcptrust.sh`

```
{"jsonrpc":"2.0","method":"initialize","id":1}
{"jsonrpc":"2.0","method":"tools/call","params":{"name":"read_file","arguments":{"path":"/etc/passwd"}},"id":2}
{"jsonrpc":"2.0","method":"tools/call","p
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify_mcptrust.sh — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify_mcptrust.sh`

```
exfiltrate → blocked_by_design
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify_mcptrust.sh — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify_mcptrust.sh`

```
exfiltrate not blocked
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

### LOW (3)
#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→low: this match is in test code — servers/insecurefs/test/smoke.mjs — which does not run as part of the MCP server.)

**Evidence:** `servers/insecurefs/test/smoke.mjs`

```
exfiltrate
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→low: this match is in test code — servers/insecurefs/test/smoke.mjs — which does not run as part of the MCP server.)

**Evidence:** `servers/insecurefs/test/smoke.mjs`

```
\n📤 Test: Exfiltrate (blocked_by_design)
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→low: this match is in test code — servers/insecurefs/test/smoke.mjs — which does not run as part of the MCP server.)

**Evidence:** `servers/insecurefs/test/smoke.mjs`

```
Exfiltrate blocked
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

### INFO (1)
#### MCP-SUPPLY-005: No security policy (SECURITY.md) found
**Severity:** info  **Confidence:** 100%  **Category:** supply_chain

The project does not provide a security policy. This is a maturity/best-practice gap, not a vulnerability — reported informational so it never drives the decision.

**Evidence:** `repo.files`

```
no SECURITY.md found in source
```

**Impact:** Absence of a disclosure process slows remediation of future vulnerabilities.

**Remediation:** Prefer projects that publish a SECURITY.md with a vulnerability disclosure process.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:52:36.542Z._
