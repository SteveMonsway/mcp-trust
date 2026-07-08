# MCP Trust Report: github:Dakkshin/after-effects-mcp

**Decision:** BLOCK  
**Risk:** MEDIUM  
**Score:** 38/100  
**Confidence:** 86%

_Resolved ref: `88d5fbf08b7ae9f015ee98e5f8c4904095cf8202`_

## Executive Summary
The scanner found **high-confidence capability evidence in the server’s runtime code** (e.g. command execution). Review the flagged findings below before connecting this server to an agent. **A BLOCK is a "review required", not proof the server is malicious** — the evidence may be legitimate by design (see Decision Reasons).

## Decision Reasons
- Overall score 38 falls in MEDIUM band
- Critical finding with high confidence: MCP-CODE-002, MCP-CODE-002

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

| Inferred capability | Confidence |
|---|---|
| network_egress | 60% |

## Subscores
| Subscore | Value |
|---|---|
| capability | 12 |
| code | 100 |
| config | 0 |
| supplyChain | 41 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (10)
### CRITICAL (2)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `install-bridge.js:91`

```
execSync(`sudo cp "${sourceScript}" "${destinationScript}"`, { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `install-bridge.js:98`

```
execSync(`powershell -Command "${command}"`, { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

### MEDIUM (6)
#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→medium: this match is in build/dev-tooling code — src/scripts/mcp-bridge-auto.jsx — which does not run as part of the MCP server.)

**Evidence:** `src/scripts/mcp-bridge-auto.jsx:1244`

```
return eval("(" + text + ")");
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→medium: this match is in build/dev-tooling code — src/scripts/mcp-bridge-auto.jsx — which does not run as part of the MCP server.)

**Evidence:** `src/scripts/mcp-bridge-auto.jsx:1731`

```
: eval("(" + content + ")");
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-SUPPLY-003: Install script present in package
**Severity:** medium  **Confidence:** 90%  **Category:** supply_chain

The package declares install/preinstall/postinstall scripts that run automatically on install.

**Evidence:** `package.scripts.postinstall`

```
postinstall: npm run build
```

**Impact:** Install scripts execute code on the developer/CI machine at install time.

**Remediation:** Review install scripts; install with --ignore-scripts where possible and vet what they do.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:117`

```
fs.writeFileSync(commandFile, JSON.stringify(commandData, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:136`

```
fs.writeFileSync(resultFile, JSON.stringify(resetData, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/index.ts:603`

```
fs.writeFileSync(tempFile, scriptContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### LOW (1)
#### MCP-TOOL-004: Network egress capability
**Severity:** low  **Confidence:** 60%  **Category:** capability

The server can make outbound network requests, potentially to arbitrary URLs.

**Evidence:** `config.command:AfterEffectsMCP`

```
node C:\Users\Daniel\Downloads\after-effects-mcp\build\index.js
```

**Impact:** The server can make outbound network requests, potentially to arbitrary URLs.

**Remediation:** Restrict outbound traffic to an explicit domain allowlist.

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
- Restrict outbound network to an explicit allowlist of domains.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T14:42:22.024Z._
