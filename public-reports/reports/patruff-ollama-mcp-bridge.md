# MCP Trust Report: github:patruff/ollama-mcp-bridge

**Decision:** BLOCK  
**Risk:** MEDIUM  
**Score:** 33/100  
**Confidence:** 91%

_Resolved ref: `e4f42d095af02efd65d19e81931f949e5a75a152`_

## Executive Summary
The scanner found **high-confidence capability evidence in the server’s runtime code** (e.g. command execution). Review the flagged findings below before connecting this server to an agent. **A BLOCK is a "review required", not proof the server is malicious** — the evidence may be legitimate by design (see Decision Reasons).

## Decision Reasons
- Overall score 33 falls in MEDIUM band
- Critical finding with high confidence: MCP-CODE-001

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
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (12)
### CRITICAL (1)
#### MCP-CODE-001: child_process.exec usage
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `src/main.ts:31`

```
exec(`taskkill /F /PID ${pid}`, () => {});
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

### HIGH (5)
#### MCP-CODE-001: child_process.exec usage
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `src/llm-client.ts:172`

```
this.ollamaProcess = exec("ollama serve", { windowsHide: true });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `src/main.ts:23`

```
exec('taskkill /F /IM ollama.exe', () => {});
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `src/main.ts:24`

```
exec('netstat -ano | findstr ":11434"', (error: any, stdout: string) => {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `src/ollama-manager.ts:36`

```
const ollamaProcess = exec('ollama serve', {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/mcp-client.ts:42`

```
this.process = spawn(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

### LOW (5)
#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — tests/mcp/test-utils.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/mcp/test-utils.ts:145`

```
const ollamaProcess = exec('ollama serve', { windowsHide: true });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — tests/mcp-tools.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/mcp-tools.test.ts:67`

```
const ollamaProcess = exec('ollama serve');
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — tests/ollama.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/ollama.test.ts:77`

```
const ollamaProcess = exec('ollama serve');
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — tests/ollama.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/ollama.test.ts:92`

```
const ollamaProcess = exec('ollama serve');
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — tests/ollama.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/ollama.test.ts:134`

```
const ollamaProcess = exec('ollama serve');
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

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
- Block by default; do not connect to developer workstations or production agents without review.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:10.504Z._
