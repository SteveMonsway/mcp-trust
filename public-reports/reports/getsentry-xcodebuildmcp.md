# MCP Trust Report: github:getsentry/XcodeBuildMCP

**Decision:** BLOCK  
**Risk:** MEDIUM  
**Score:** 52/100  
**Confidence:** 84%

_Resolved ref: `db7e055c39d4e2c23cbd030f14ac8bc8329f61d8`_

## Executive Summary
The scanner found **high-confidence capability evidence in the server’s runtime code** (e.g. command execution). Review the flagged findings below before connecting this server to an agent. **A BLOCK is a "review required", not proof the server is malicious** — the evidence may be legitimate by design (see Decision Reasons).

## ⚠️ Limitations
- Additionally, Swift source is present but was NOT analyzed — MCP Trust has code rules for JavaScript, TypeScript and Python only. Absence of code findings does not imply this server is safe.

## Decision Reasons
- Overall score 52 falls in MEDIUM band
- Critical finding with high confidence: MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002

## Coverage
| Check | State |
|---|---|
| configScan | completed |
| staticScan | completed |
| capabilityInference | static_only |
| introspection | disabled |
| semgrep | partial |
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
| config | 97 |
| supplyChain | 17 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 43 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (93)
### CRITICAL (7)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/device-availability.ts:35`

```
execSync(`xcrun devicectl list devices --json-output ${JSON.stringify(outputPath)}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/harness.ts:324`

```
execSync(`xcrun simctl boot ${device.udid}`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/harness.ts:325`

```
execSync(`xcrun simctl bootstatus ${device.udid} -b`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/harness.ts:351`

```
execSync(`xcrun simctl shutdown ${simulatorId}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/harness.ts:357`

```
execSync(`xcrun simctl delete ${simulatorId}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/utils/device-name-resolver.ts:26`

```
execSync(`xcrun devicectl list devices --json-output ${tmpFile}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/utils/environment.ts:31`

```
const parentCommand = execSync(`ps -o command= -p ${parentPid}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

### HIGH (41)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/harness.ts:221`

```
const listOutput = execSync('xcrun simctl list devices available --json', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/harness.ts:288`

```
const listOutput = execSync('xcrun simctl list runtimes available --json', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/harness.ts:336`

```
const udid = execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/suites/debugging-suite.ts:88`

```
execSync('pkill -f lldb-dap', { stdio: 'pipe' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/suites/swift-package-suite.ts:43`

```
execSync('node build/cli.js daemon stop 2>/dev/null || true', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/suites/swift-package-suite.ts:47`

```
execSync("pkill -f 'example_projects/spm' 2>/dev/null || true", { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/xcode-ide-availability.ts:7`

```
execSync('xcrun --find mcpbridge', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/snapshot-tests/xcode-ide-availability.ts:11`

```
execSync('pgrep -x Xcode', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/cli/commands/upgrade.ts:383`

```
const child = spawn(cmd, args, { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/cli/daemon-control.ts:137`

```
const child = spawn(process.execPath, [daemonPath], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/cli/daemon-control.ts:245`

```
const child = spawn(process.execPath, [daemonPath], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/snapshot-tests/capture-debug-output.mjs:15`

```
return execFileSync(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/snapshot-tests/harness.ts:59`

```
return spawnSync('node', commandArgs, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/snapshot-tests/suites/xcode-ide-suite.ts:148`

```
execFileSync('node', [CLI_PATH, '--socket', socketPath, 'daemon', 'stop'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/utils/command.ts:70`

```
const childProcess = spawn(executable, args, spawnOpts);
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/utils/execution/interactive-process.ts:64`

```
const childProcess = spawn(executable, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/utils/xcresult-test-failures.ts:60`

```
const output = execFileSync(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/utils/xcresult-test-failures.ts:76`

```
const output = execFileSync(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/workspace-filesystem-lifecycle.ts:392`

```
await fs.rm(bundle.path, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/workspace-filesystem-lifecycle.ts:492`

```
await fs.rm(path.join(root, entry.name), { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `.mcp.json`

```
XCODEBUILDMCP_IOS_TEMPLATE_PATH=../../../XcodeBuildMCP-iOS-Template
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `.mcp.json`

```
XCODEBUILDMCP_MACOS_TEMPLATE_PATH=../../../XcodeBuildMCP-macOS-Template
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `.vscode/mcp.json`

```
XCODEBUILDMCP_IOS_TEMPLATE_PATH=${workspaceFolder}/../XcodeBuildMCP-iOS-Template
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `.vscode/mcp.json`

```
XCODEBUILDMCP_MACOS_TEMPLATE_PATH=${workspaceFolder}/../XcodeBuildMCP-macOS-Template
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/cli/commands/init.ts:141`

```
fs.rmSync(altDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/cli/commands/init.ts:157`

```
fs.rmSync(altDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/cli/commands/init.ts:186`

```
fs.rmSync(dir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/snapshot-tests/suites/coverage-suite.ts:50`

```
fs.rmSync(tmpDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/snapshot-tests/suites/macos-suite.ts:52`

```
fs.rmSync(tmpDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/snapshot-tests/suites/project-discovery-suite.ts:53`

```
fs.rmSync(tmpDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/snapshot-tests/suites/simulator-suite.ts:258`

```
fs.rmSync(tmpDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/fs-lock.ts:40`

```
await fs.rm(lockDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/fs-lock.ts:147`

```
await fs.rm(lockDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/log-capture/simulator-launch-oslog-registry.ts:96`

```
await fs.unlink(filePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/log-capture/simulator-launch-oslog-registry.ts:276`

```
await fs.unlink(tempPath).catch(() => undefined);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/log-capture/simulator-launch-oslog-registry.ts:429`

```
await fs.rm(registryDirOverride, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/log-capture/simulator-launch-oslog-registry.ts:434`

```
await fs.rm(dir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/workspace-filesystem-lifecycle.ts:214`

```
await fs.unlink(filePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/integrations/xcode-tools-bridge/bridge-response-artifact.ts:47`

```
await fs.writeFile(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, {
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/fs-lock.ts:131`

```
await fs.writeFile(path.join(lockDir, FS_LOCK_OWNER_FILE), `${JSON.stringify(owner)}\n`, {
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/log-capture/simulator-launch-oslog-registry.ts:269`

```
await fs.writeFile(tempPath, `${JSON.stringify(record, null, 2)}\n`, {
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (30)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/generate-third-party-package-licenses.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/generate-third-party-package-licenses.mjs:9`

```
const raw = execSync("npx -y license-checker --production --json", {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/install-git-hooks.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/install-git-hooks.js:11`

```
return spawnSync('git', args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/repro-mcp-lifecycle-leak.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/repro-mcp-lifecycle-leak.ts:107`

```
const child = spawn('ps', ['-axo', 'pid=,ppid=,etime=,rss=,command='], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/repro-mcp-lifecycle-leak.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/repro-mcp-lifecycle-leak.ts:167`

```
const child = spawn(process.execPath, ['build/cli.js', 'mcp'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/repro-mcp-lifecycle-leak.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/repro-mcp-lifecycle-leak.ts:203`

```
const helper = spawn(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/repro-mcp-parent-exit-helper.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/repro-mcp-parent-exit-helper.mjs:12`

```
const child = spawn(nodeExecPath, [cliPath, 'mcp'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — src/benchmarks/claude-ui/harness.ts — which does not run as part of the MCP server.)

**Evidence:** `src/benchmarks/claude-ui/harness.ts:226`

```
const child = spawn(opts.command, opts.args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — src/benchmarks/claude-ui/harness.ts — which does not run as part of the MCP server.)

**Evidence:** `src/benchmarks/claude-ui/harness.ts:313`

```
const child = spawn(opts.command, opts.args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — src/benchmarks/claude-ui/preflight-commands.ts — which does not run as part of the MCP server.)

**Evidence:** `src/benchmarks/claude-ui/preflight-commands.ts:54`

```
const child = spawn('/bin/zsh', ['-lc', opts.command], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — src/benchmarks/claude-ui/simulator-lifecycle.ts — which does not run as part of the MCP server.)

**Evidence:** `src/benchmarks/claude-ui/simulator-lifecycle.ts:312`

```
const child = spawn(opts.command, opts.args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/mcp/tools/device/list_devices.ts — which does not run as part of the MCP server.)

**Evidence:** `src/mcp/tools/device/list_devices.ts:247`

```
await fs.unlink(tempJsonPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/mcp/tools/simulator/record_sim_video.ts — which does not run as part of the MCP server.)

**Evidence:** `src/mcp/tools/simulator/record_sim_video.ts:191`

```
await fs.rm(stopRes.parsedPath, { recursive: false });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/utils/fs-lock.ts:30`

```
const raw = await fs.readFile(path.join(lockDir, FS_LOCK_OWNER_FILE), 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/cli/commands/init.ts:173`

```
fs.writeFileSync(targetFile, content, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/cli/commands/init.ts:248`

```
fs.writeFileSync(agentsPath, newContent, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/cli/commands/init.ts:268`

```
fs.writeFileSync(agentsPath, updatedFromLegacy, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/cli/commands/init.ts:301`

```
fs.writeFileSync(agentsPath, updatedContent, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/snapshot-tests/fixture-io.ts:255`

```
fs.writeFileSync(fixturePath, actual, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/snapshot-tests/suites/macos-suite.ts:36`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/snapshot-tests/suites/project-discovery-suite.ts:24`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/snapshot-tests/suites/project-discovery-suite.ts:37`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/project-config.ts:376`

```
await options.fs.writeFile(configPath, stringifyYaml(nextConfig), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/project-config.ts:398`

```
await options.fs.writeFile(configPath, stringifyYaml(nextConfig), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/project-config.ts:453`

```
await options.fs.writeFile(configPath, stringifyYaml(nextConfig), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/result-bundle-path.ts:47`

```
fs.writeFileSync(<redacted:high-entropy>(resultBundlePath), `${Date.now()}\n`);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/workspace-filesystem-lifecycle.ts:181`

```
await fs.writeFile(markerPath, String(now));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/xcodebuild-log-capture.ts:107`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/xcodemake.ts:71`

```
await fs.writeFile(xcodemakePath, scriptContent, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/cli/commands/upgrade.ts:227`

```
response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/cli/commands/upgrade.ts:298`

```
response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (15)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** low  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→low: this match is in test code — src/core/__tests__/portable-install-script.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/core/__tests__/portable-install-script.test.ts:68`

```
expect(() => execFileSync(verifyScriptPath, ['--root', root], execOptions)).not.toThrow();
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** low  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→low: this match is in test code — src/core/__tests__/portable-install-script.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/core/__tests__/portable-install-script.test.ts:77`

```
execFileSync(verifyScriptPath, ['--root', root], execOptions);
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** low  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→low: this match is in test code — src/smoke-tests/__tests__/cli-surface.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/smoke-tests/__tests__/cli-surface.test.ts:15`

```
return execFileSync('node', [CLI, ...argv], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — src/utils/__tests__/generate-version-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/utils/__tests__/generate-version-validation.test.ts:58`

```
expect(() => new Function(generated)).not.toThrow();
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — src/utils/__tests__/generate-version-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/utils/__tests__/generate-version-validation.test.ts:69`

```
expect(() => new Function(code)).not.toThrow();
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-SUPPLY-004: Floating package version in startup command
**Severity:** low  **Confidence:** 85%  **Category:** supply_chain

The startup command references a floating version tag/range (latest, next, ^, ~), so the executed code can change.

**Evidence:** `.vscode/mcp.json`

```
xcodebuildmcp@latest
```

**Impact:** A floating version can pull in a different (possibly malicious) release without notice.

**Remediation:** Pin an exact version instead of a floating tag or range.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — src/snapshot-tests/__tests__/fixture-io.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/snapshot-tests/__tests__/fixture-io.test.ts:16`

```
fs.rmSync(fixtureDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — src/smoke-tests/__tests__/e2e-mcp-device-macos.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/smoke-tests/__tests__/e2e-mcp-device-macos.test.ts:10`

```
await fs.writeFile('/tmp/build/MyApp.app/Info.plist', 'plist');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — src/snapshot-tests/__tests__/fixture-io.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/snapshot-tests/__tests__/fixture-io.test.ts:41`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — src/snapshot-tests/__tests__/fixture-io.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/snapshot-tests/__tests__/fixture-io.test.ts:60`

```
fs.writeFileSync(fixturePath, ['before', 'same', 'same', 'same', 'after'].join('\n'), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — src/snapshot-tests/__tests__/fixture-io.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/snapshot-tests/__tests__/fixture-io.test.ts:73`

```
fs.writeFileSync(fixturePath, ['before', 'same', 'after'].join('\n'), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — src/benchmarks/claude-ui/__tests__/render.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/benchmarks/claude-ui/__tests__/render.test.ts`

```
/repo/out.<redacted:high-entropy>.log
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — src/cli/commands/__tests__/upgrade.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/cli/commands/__tests__/upgrade.test.ts`

```
https://github.<redacted:high-entropy>.0.0
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — src/utils/renderers/__tests__/event-formatting.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/utils/renderers/__tests__/event-formatting.test.ts`

```
~/<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — src/utils/renderers/__tests__/event-formatting.test.ts — which does not run as part of the MCP server.)

**Evidence:** `src/utils/renderers/__tests__/event-formatting.test.ts`

```
   Derived Data: ~/<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.


## Recommended Policy
- Block by default; do not connect to developer workstations or production agents without review.
- Pin exact package versions in the startup command.
- Move secrets out of config into a secrets manager or environment injected at runtime.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:48:46.576Z._
