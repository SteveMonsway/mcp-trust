# MCP Trust Report: github:arinspunk/claude-talk-to-figma-mcp

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 36/100  
**Confidence:** 87%

_Resolved ref: `c7adf243fc2967fcda3862415d3283bd239af56d`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 36 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002

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
| metadata | 29 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (19)
### MEDIUM (18)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→medium: this match is in build/dev-tooling code — scripts/launcher.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/launcher.js:21`

```
execSync(`${cmd} --version`, { stdio: 'ignore' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→medium: this match is in build/dev-tooling code — scripts/launcher.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/launcher.js:95`

```
execSync(`git clone ${REPO_URL}`, { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→medium: this match is in build/dev-tooling code — scripts/launcher.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/launcher.js:107`

```
execSync(`${engine} install`, { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→medium: this match is in build/dev-tooling code — scripts/launcher.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/launcher.js:110`

```
execSync(`${engine} run build`, { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/configure-claude.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/configure-claude.js:60`

```
execSync('bun --version', { stdio: 'ignore' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/launcher.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/launcher.js:34`

```
execSync('powershell -c "irm bun.sh/install.ps1 | iex"', { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/launcher.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/launcher.js:36`

```
execSync('curl -fsSL https://bun.sh/install | bash', { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/launcher.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/launcher.js:103`

```
execSync('npm install', { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/launcher.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/launcher.js:105`

```
execSync('npm run build', { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-integration.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-integration.js:87`

```
execSync('bun --version', { stdio: 'pipe' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-integration.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-integration.js:127`

```
execSync('bun run configure-claude', { stdio: 'inherit', cwd: rootDir });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-integration.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-integration.js:144`

```
execSync('bun run configure-claude', { stdio: 'inherit', cwd: rootDir });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/launcher.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/launcher.js:123`

```
const child = spawn(startCmd, startArgs, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-integration.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-integration.js:174`

```
const wsServer = spawn('bun', ['run', 'src/socket.ts'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/test-integration.js:97`

```
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/configure-claude.js:80`

```
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/talk_to_figma_mcp/tools/image-tools.ts:167`

```
fs.writeFileSync(filepath, imageBuffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/claude_mcp_plugin/code.js`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

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

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:46.044Z._
