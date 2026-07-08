# MCP Trust Report: github:tradesdontlie/tradingview-mcp

**Decision:** BLOCK  
**Risk:** MEDIUM  
**Score:** 33/100  
**Confidence:** 89%

**Source:** [github.com/tradesdontlie/tradingview-mcp](https://github.com/tradesdontlie/tradingview-mcp)

_Resolved ref: `55534aab8c11f24655b7d8d4de82e6bece14c8b4`_

## Executive Summary
The scanner found **high-confidence capability evidence in the server’s runtime code** (e.g. command execution). Review the flagged findings below before connecting this server to an agent. **A BLOCK is a "review required", not proof the server is malicious** — the evidence may be legitimate by design (see Decision Reasons).

## Decision Reasons
- Overall score 33 falls in MEDIUM band
- Critical finding with high confidence: MCP-CODE-002, MCP-CODE-002

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

## Findings (5)
### CRITICAL (2)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/core/health.js:18`

```
const remoteUrl = execSync('git config --get remote.origin.url', { timeout: 3000, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/core/update.js:26`

```
execSync(`git ${args}`, { cwd: repoRoot, timeout, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

### HIGH (2)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/core/health.js:17`

```
const localSha = execSync('git rev-parse HEAD', { timeout: 3000, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/core/update.js:86`

```
execSync('npm ci --no-audit --no-fund', { cwd: repoRoot, timeout: 300000, stdio: ['ignore', 'pipe', 'pipe'] });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

### MEDIUM (1)
#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/core/health.js:24`

```
const req = http.get({
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.


## Recommended Policy
- Block by default; do not connect to developer workstations or production agents without review.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:48:54.668Z._
