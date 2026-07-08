# MCP Trust Report: github:cyanheads/obsidian-mcp-server

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 33/100  
**Confidence:** 90%

**Source:** [github.com/cyanheads/obsidian-mcp-server](https://github.com/cyanheads/obsidian-mcp-server)

_Resolved ref: `9e9861be17395e942ee7aac3b3607cf9dc4d97b2`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## Decision Reasons
- Overall score 33 falls in MEDIUM band

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
| code | 99 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (11)
### MEDIUM (10)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/build.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/build.ts:37`

```
execFile(bin ?? '', args, { cwd: ROOT_DIR }, (error, stdout, stderr) => {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/check-framework-antipatterns.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/check-framework-antipatterns.ts:108`

```
const result = spawnSync('git', ['grep', '-nE', rule.pattern, '--', ...rule.pathspec], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/check-skill-versions.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/check-skill-versions.ts:65`

```
const result = spawnSync('git', ['diff', '--name-only', 'HEAD', '--'], { encoding: 'utf-8' });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/check-skill-versions.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/check-skill-versions.ts:75`

```
const result = spawnSync('git', ['show', `HEAD:${relPath}`], { encoding: 'utf-8' });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/clean-mcpb.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/clean-mcpb.ts:49`

```
return execFileSync('unzip', ['-Z1', bundle], { encoding: 'utf-8', maxBuffer: MAX_LIST_BUFFER })
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/clean-mcpb.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/clean-mcpb.ts:55`

```
execFileSync(cmd, args, { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/devcheck.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/devcheck.ts:157`

```
proc = spawn(command, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/devcheck.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/devcheck.ts:274`

```
const PM_CMD = spawnSync('bun', ['--version'], { stdio: 'ignore' }).status === 0 ? 'bun' : 'npm';
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/lint-packaging.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/lint-packaging.ts:597`

```
const listing = execFileSync('unzip', ['-Z1', join(distDir, file)], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/release-github.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/release-github.ts:51`

```
const result = spawnSync(cmd, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

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
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:47.897Z._
