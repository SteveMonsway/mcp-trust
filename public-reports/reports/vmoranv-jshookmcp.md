# MCP Trust Report: github:vmoranv/jshookmcp

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 52/100  
**Confidence:** 79%

_Resolved ref: `4de821b27c60c5b40ce6d7e605fdc012936d2f7d`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## ⚠️ Limitations
- Additionally, Java, Kotlin source is present but was NOT analyzed — MCP Trust has code rules for JavaScript, TypeScript and Python only. Absence of code findings does not imply this server is safe.

## Decision Reasons
- Overall score 52 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CODE-002, MCP-CODE-002, MCP-META-003, MCP-CODE-002

## Coverage
| Check | State |
|---|---|
| configScan | not_available |
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
| config | _not assessed_ |
| supplyChain | 41 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 100 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (261)
### HIGH (64)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/modules/adb/ADBConnector.ts:57`

```
execSync('adb version', { stdio: 'pipe', timeout: ADB_VERSION_CHECK_TIMEOUT_MS });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/modules/process/memory/injection-validator.ts:421`

```
const stdout = execSync(ps, {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/v8-inspector/JITInspector.ts:136`

```
const candidate = eval(${JSON.stringify(functionRef)});
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/browser/handlers/safe-code-transform.ts:83`

```
const evaluateFunction = new Function(`return ${functionString}`)() as () => unknown;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `packages/extension-sdk/src/bridges/shared.ts:139`

```
const child = spawn(command, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/adb/ADBConnector.ts:241`

```
execFileSync('adb', ['-s', serial, 'forward', '--remove', `tcp:${localPort}`], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/binary-instrument/FridaSession.ts:529`

```
execFile(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/binary-instrument/GhidraAnalyzer.ts:510`

```
execFile(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/binary-instrument/UnidbgRunner.ts:253`

```
execFile(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/external/ExternalToolRunner.ts:112`

```
const child = spawn(spec.command, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/mojo-ipc/MojoMonitor.ts:56`

```
const child = spawn('frida', ['--version'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/mojo-ipc/MojoMonitor.ts:363`

```
execFile(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/process/LinuxProcessManager.ts:418`

```
const child = spawn(executablePath, debugArgs, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/process/MacProcessManager.ts:417`

```
const child = spawn(executablePath, debugArgs, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/process/ProcessManager.impl.ts:389`

```
const child = spawn(executablePath, debugArgs, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/v8-inspector/NativeBytecodePrinter.ts:155`

```
const child = spawn(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/modules/v8-inspector/TurboFanTraceCollector.ts:154`

```
const child = spawn(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/server/domains/adb-bridge/handlers.impl.ts:69`

```
execFile(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/server/domains/adb-bridge/handlers.impl.ts:107`

```
execFile(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/server/domains/adb-bridge/logcat.ts:77`

```
const child = spawn(options.adb, options.args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/server/domains/binary-instrument/handlers/analysis-handlers.ts:1003`

```
execFile(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/server/domains/binary-instrument/handlers/analysis-handlers.ts:1261`

```
execFile(jadx, args, { encoding: 'utf8', windowsHide: true, timeout: timeoutMs }, (error) => {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/server/domains/binary-instrument/handlers/frida.ts:51`

```
execFile(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/server/domains/binary-instrument/handlers/jadx.ts:568`

```
execFile(jadx, args, { encoding: 'utf8', windowsHide: true, timeout: timeoutMs }, (error) => {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/server/domains/binary-instrument/handlers/shared.ts:240`

```
execFile(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/server/domains/platform/handlers/electron-dual-cdp.ts:168`

```
const child = spawn(exePath, launchArgs, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/collector/CodeCache.ts:188`

```
await fs.unlink(entry.file);
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/collector/CodeCache.ts:207`

```
await fs.unlink(path.join(this.cacheDir, file));
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/cache.ts:100`

```
await Promise.all(files.map((file) => fs.unlink(join(this.config.dir, file))));
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/analyzer/SecurityCodeAnalyzer.ts:112`

```
description: 'Critical: Use of eval() allows arbitrary code execution',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/analyzer/SecurityCodeAnalyzer.ts:114`

```
'Refactor to avoid eval(). Use JSON.parse() for data, or proper function calls',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/collector/DOMInspector.ts:108`

```
new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/collector/DOMInspector.ts:167`

```
new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/detector/ObfuscationDetector.ts:124`

```
features.push('eval(function(p,a,c,k,e,d)');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/detector/ObfuscationDetector.ts:131`

```
features.push('Multiple eval() calls');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/detector/ObfuscationDetector.ts:132`

```
recommendations.push('Hook eval() and log arguments');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/monitor/ConsoleMonitor.impl.core.dynamic.ts:121`

```
console.log('[ScriptMonitor] eval() called with code:',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/v8-inspector/DominatorTreeBuilder.ts:341`

```
// eval(v): return the vertex on the compressed path from v to its forest
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/v8-inspector/DominatorTreeBuilder.ts:394`

```
// reading the bucket so later eval() calls through w see the new edge.
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/modules/v8-inspector/VersionDetector.ts:103`

```
return Boolean(new Function("return %HaveSameMap({}, {})")());
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/browser/definitions.tools.runtime.ts:84`

```
.boolean('mainWorldEval', 'Main world eval (camoufox)', { default: true })
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/browser/definitions.tools.runtime.ts:133`

```
.boolean('mainWorldEval', 'Main world eval (launch)', { default: true })
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/browser/handlers/page-evaluation.ts:100`

```
// SECURITY: Use safe code transformation instead of new Function()
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/browser/handlers/safe-code-transform.ts:4`

```
* SECURITY: This module eliminates direct use of new Function() on untrusted
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/browser/handlers/safe-code-transform.ts:18`

```
* - OWASP: Avoid eval() and Function() for untrusted input
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/browser/handlers/safe-code-transform.ts:55`

```
* CRITICAL SECURITY CHANGE: Instead of using new Function() in Node.js,
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/browser/handlers/safe-code-transform.ts:62`

```
* - Before: new Function(code) runs in Node.js process
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/instrumentation/hooks/preset-definitions.core.ts:6`

```
description: ' Hook eval() to capture dynamic code execution',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/instrumentation/hooks/preset-definitions.core.ts:25`

```
description: ' Hook new Function() to capture dynamic function creation',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/server/domains/process/handlers/expression-validator.ts:154`

```
// Block new Function() and similar constructor patterns
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/collector/CodeCache.ts:95`

```
await fs.unlink(cachePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/injector.ts:508`

```
await fs.unlink(scriptPath).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/injector.ts:563`

```
await fs.unlink(pyFile).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/injector.ts:564`

```
await fs.unlink(cmdFile).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/reader.ts:262`

```
await fs.unlink(tmpFile).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/scanner.darwin.ts:190`

```
await fs.unlink(pyFile).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/scanner.darwin.ts:191`

```
await fs.unlink(cmdFile).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/DetailedDataManager.ts:200`

```
await fs.unlink(entry.persistPath).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/DetailedDataManager.ts:393`

```
void fs.unlink(cached.persistPath).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/cache.ts:84`

```
await fs.unlink(cachePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/injector.ts:553`

```
await fs.writeFile(cmdFile, `command script import ${pyFile}\\nprocess detach\\n`, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/scanner.darwin.ts:154`

```
await fs.writeFile(cmdFile, `command script import ${pyFile}\nprocess detach\n`, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").

**Evidence:** `src/server/domains/exploit-dev/handlers/rop-builder.ts`

```
s register constraints, preferring the
 *   minimal K. This finds non-obvious multi-register gadgets and avoids
 *   clobbering, which a greedy walk misses.
 * - **Fallback: greedy heuristic.** Used o
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `src/server/domains/syscall-hook/handlers/pattern-detect.ts`

```
Indicates file discovery, often followed by exfiltration or targeted reads.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

### MEDIUM (94)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→medium: this match is in build/dev-tooling code — scripts/scan-domain-audit.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/scan-domain-audit.mjs:97`

```
const result = spawnSync('pnpm', ['exec', 'oxfmt', file], { shell: true, stdio: 'ignore' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-SUPPLY-003: Install script present in package
**Severity:** medium  **Confidence:** 90%  **Category:** supply_chain

The package declares install/preinstall/postinstall scripts that run automatically on install.

**Evidence:** `package.scripts.postinstall`

```
postinstall: node scripts/postinstall.cjs
```

**Impact:** Install scripts execute code on the developer/CI machine at install time.

**Remediation:** Review install scripts; install with --ignore-scripts where possible and vet what they do.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/build.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/build.mjs:17`

```
execFileSync(process.execPath, [resolve(dir, 'generate-domains-index.mjs')], { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/generate-metadata.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/generate-metadata.mjs:67`

```
const result = spawnSync(process.execPath, [tsxCliPath, '--eval', registryProbe], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/generate-vitepress-reference.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/generate-vitepress-reference.mjs:659`

```
const result = spawnSync(process.execPath, [tsxCliPath, '--eval', registryProbe], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/postinstall.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/postinstall.cjs:44`

```
const result = spawnSync(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/postinstall.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/postinstall.cjs:62`

```
const npmResult = spawnSync('npm', ['rebuild', mod, '--foreground-scripts'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/postinstall.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/postinstall.cjs:107`

```
const hooksPathResult = spawnSync('git', ['config', '--local', '--get', 'core.hooksPath'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/postinstall.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/postinstall.cjs:127`

```
const result = spawnSync(localBin, ['install'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/run-vitest-smart.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/run-vitest-smart.mjs:86`

```
const child = spawn(process.execPath, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/runtime-probes/phases/advanced-runtime/sourcemap-attach-syscall.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/runtime-probes/phases/advanced-runtime/sourcemap-attach-syscall.mjs:148`

```
resources.externalBrowserProc = spawn(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/runtime-probes/phases/process/lifecycle.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/runtime-probes/phases/process/lifecycle.mjs:14`

```
resources.memoryProbeProc = spawn(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/runtime-probes/phases/process/memory.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/runtime-probes/phases/process/memory.mjs:262`

```
const speedhackProbeProc = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/runtime-probes/phases/process/memory.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/runtime-probes/phases/process/memory.mjs:337`

```
const injectionProbeProc = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/search-tune/optimize.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/search-tune/optimize.ts:376`

```
const child = execFile(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify-packed-bin.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify-packed-bin.mjs:32`

```
const listResult = spawnSync('tar', ['-tvf', tarballPath], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify-packed-bin.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify-packed-bin.mjs:59`

```
const extractResult = spawnSync('tar', ['-xOf', tarballPath, tarEntryPath], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify-packed-install.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify-packed-install.mjs:21`

```
const whereResult = spawnSync('where.exe', [candidate], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify-packed-install.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify-packed-install.mjs:77`

```
const unpackResult = spawnSync(tarCommand, ['-xzf', tarball, '-C', outputDir], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify-packed-install.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify-packed-install.mjs:158`

```
const child = spawn(command, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify-packed-install.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify-packed-install.mjs:184`

```
const child = spawn(command, args, {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify-packed-install.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify-packed-install.mjs:220`

```
spawnSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/verify-release-artifact.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/verify-release-artifact.mjs:30`

```
const result = spawnSync(command, [...prefixArgs, ...args], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** medium  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/runtime-probes/phases/browser/core.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/runtime-probes/phases/browser/core.mjs:61`

```
code: 'eval(atob("Y29uc3QgYSA9IDE7"))',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** medium  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/runtime-probes/phases/browser/core.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/runtime-probes/phases/browser/core.mjs:82`

```
{ code: 'eval(atob("YWxlcnQoMSk="))', generateReport: false },
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** medium  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/runtime-probes/phases/maintenance-workflow.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/runtime-probes/phases/maintenance-workflow.mjs:213`

```
code: 'eval(atob("Y29uc3QgYSA9IDE7"))',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/modules/native-emulator/dart/DartAotLoader.ts:69`

```
const buffer = await fs.readFile(path);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/native/AntiCheatDetector.ts:412`

```
const diskData = await fs.readFile(mod.path);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/native/PEAnalyzer.ts:294`

```
const diskData = await fs.readFile(mod.path);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/native/platform/linux/LinuxPtraceHelper.ts:84`

```
const maps = fs.readFileSync(`/proc/${pid}/maps`, 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/server/domains/exploit-dev/handlers/verify-rop-chain.ts:151`

```
const code = fs.readFileSync(args.binaryPath);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/generate-domains-index.mjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/generate-domains-index.mjs:149`

```
await fs.writeFile(OUT_FILE, content + metaExport, 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/scan-domain-audit.mjs:155`

```
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(audit, null, 2) + '\n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/tune-env.mjs:79`

```
await fs.writeFile(ENV_PATH, lines.join('\n'), 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/update-domain-scores.mjs:130`

```
fs.writeFileSync(claudePath, content, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/collector/CodeCache.ts:149`

```
await fs.writeFile(cachePath, JSON.stringify(entry, null, 2), 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/debugger/DebuggerSessionManager.ts:102`

```
await fs.writeFile(filePath, JSON.stringify(session, null, 2), 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/injector.ts:498`

```
await fs.writeFile(scriptPath, pyScript, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/injector.ts:552`

```
await fs.writeFile(pyFile, pyScript, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/modules/process/memory/scanner.darwin.ts:153`

```
await fs.writeFile(pyFile, pyScript, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/DetailedDataManager.ts:231`

```
await fs.writeFile(this.metadataPath, lines.join('\n') + '\n').catch(() => {});
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/DetailedDataManager.ts:375`

```
await fs.appendFile(this.metadataPath, JSON.stringify(meta) + '\n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/DetailedDataManager.ts:565`

```
await fs.writeFile(filePath, compressed);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/DetailedDataManager.ts:569`

```
await fs.writeFile(filePath, json, 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/cache.ts:70`

```
await fs.writeFile(cachePath, JSON.stringify(data), 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/postinstall.cjs:20`

```
require(mod);
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `src/modules/collector/playwright-cdp-fallback.ts:38`

```
const { createPlaywright } = require(playwrightServerPath) as {
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `src/modules/collector/playwright-cdp-fallback.ts:44`

```
const { CRBrowserContext } = require(crBrowserPath) as {
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/server/domains/browser/handlers/captcha-capabilities.ts:59`

```
const apiKeyConfigured = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/server/domains/browser/handlers/captcha-solver.ts:546`

```
const apiKey = <redacted:secret>, 'apiKey', '') || process.env.CAPTCHA_API_KEY || '';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/server/http/HttpMiddleware.ts:54`

```
const expected = process.env.MCP_AUTH_TOKEN;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `src/utils/betterSqlite3.ts:93`

```
const packageJson = require(packageJsonPath) as BetterSqlite3PackageJson;
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `src/utils/environmentDoctor.ts:73`

```
return require(resolvePackageJsonPath(packageName)) as { version?: string };
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `scripts/runtime-probes/constants.mjs`

```
<redacted:private-key>
<redacted:high-entropy>
<redacted:high-entropy>
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `scripts/runtime-probes/constants.mjs`

```
-----BEGIN CERTIFICATE-----
<redacted:high-entropy>
<redacted:high-entropy>
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `scripts/runtime-probes/server/assets.mjs`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/modules/deobfuscator/PackerDeobfuscator.ts`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/modules/webgpu/SpirvParser.ts`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/server/domains/encoding/handlers/shared.ts`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/server/domains/memory/definitions.ts`

```
Hook time APIs (<redacted:high-entropy>) to scale process 
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/server/domains/memory/definitions.ts`

```
(<redacted:high-entropy>). scanMode "iat" detects 
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/server/domains/sourcemap/handlers/shared.ts`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/server/domains/sourcemap/handlers/sourcemap-parsing.ts`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/server/domains/sourcemap/handlers.impl.sourcemap-parse-base.ts`

```
<redacted:high-entropy>+/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/extension-sdk/src/bridges/shared.ts:257`

```
const response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/modules/collector/PageScriptCollectors.ts:134`

```
const response = await fetch(url);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/modules/collector/PageScriptCollectors.ts:180`

```
const response = await fetch(workerUrl);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/modules/extension-registry/PluginRegistry.ts:282`

```
const response = await fetch(url);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/modules/extension-registry/WebhookBridge.ts:74`

```
const response = await fetch(record.url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/analysis/handlers.web-tools.ts:180`

```
const resp = await fetch(scriptUrl, { cache: 'force-cache', signal: ac1.signal });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/analysis/handlers.web-tools.ts:214`

```
const mapResp = await fetch(mapUrl, { signal: ac2.signal });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/browser/handlers/captcha-solver.ts:410`

```
const resultRes = await fetch(resultUrl.toString(), {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/graphql/handlers/introspection.ts:148`

```
response = await fetch(endpoint, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/graphql/handlers/introspection.ts:301`

```
response = await fetch(input.endpoint, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/graphql/handlers/replay.ts:93`

```
response = await fetch(endpoint, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/graphql/handlers/replay.ts:170`

```
response = await fetch(input.endpoint, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/graphql/handlers/schema-enum.helpers.ts:191`

```
const response = await fetch(endpoint, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/maintenance/handlers/extension-registry-utils.ts:354`

```
const res = await fetch(url, { signal: controller.signal });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/native-bridge/index.ts:85`

```
const res = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/network/replay.ts:467`

```
resp = await fetch(pinnedUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/process/handlers/injection-handlers.ts:591`

```
const resp = await fetch(listUrl);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/sourcemap/handlers.impl.sourcemap-parse-base.ts:316`

```
const response = await fetch(resolvedUrl, { signal: ac.signal });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/sourcemap/handlers.impl.sourcemap-parse-base.ts:339`

```
const resp = await fetch(url, { signal: ac.signal });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/sourcemap/handlers/sourcemap-parsing.ts:280`

```
const response = await fetch(resolvedUrl, { signal: ac.signal });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/sourcemap/handlers/sourcemap-parsing.ts:298`

```
const resp = await fetch(url, { signal: ac.signal });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/transform/handlers.impl.transform-base.ts:369`

```
const response = await fetch(script.src);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/transform/handlers.impl.transform-base.ts:386`

```
const response = await fetch(script.src);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/transform/handlers.impl.transform-base.ts:398`

```
const response = await fetch(script.src);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/transform/handlers/shared.ts:333`

```
const r = await fetch(script.src);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/transform/handlers/shared.ts:343`

```
const r = await fetch(script.src);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/transform/handlers/shared.ts:350`

```
const r = await fetch(script.src);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/domains/workflow/handlers/account-handlers.ts:64`

```
const resp = await fetch(authorization.fetchUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/server/webhook/WebhookServer.impl.ts:145`

```
await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/utils/environmentDoctor.ts:372`

```
const res = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (103)
#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/collector/SmartCodeCollector.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/collector/SmartCodeCollector.test.ts:26`

```
content: `const cipher = 'aes'; eval('1+1');`,
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/browser/font-fingerprint.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/browser/font-fingerprint.test.ts:13`

```
const fn = new Function(...keys, 'document', 'queryLocalFonts', 'return (' + script + ');');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/e2e/debug-timing.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/e2e/debug-timing.ts:157`

```
['detect_obfuscation', { code: 'eval(atob("YWxlcnQoMSk="))' }],
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/e2e/full-tool-e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/e2e/full-tool-e2e.test.ts:378`

```
detect_obfuscation: { code: 'eval(atob("YWxlcnQoMSk="))' },
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzer.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzer.test.ts:89`

```
eval(payload);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.branches.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.branches.test.ts:46`

```
const r = await analyzeDataFlowWithTaint('const resp = api.fetch("/d"); eval(resp);');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.branches.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.branches.test.ts:124`

```
const r = await analyzeDataFlowWithTaint('eval("code");');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts:37`

```
eval(w);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts:40`

```
// Today this is missed: the eval() sink is scanned in pass 1 before pass 2
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts:49`

```
eval(body);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts:62`

```
eval(r);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts:74`

```
eval(h);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts:86`

```
eval(c);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.interprocedural.test.ts:100`

```
eval(r);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:38`

```
eval(source);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:89`

```
eval(taintedVar);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:90`

```
eval(taintedVar2);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:93`

```
new Function(netSource);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:137`

```
eval(s1);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:138`

```
eval(s2);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:139`

```
eval(s3);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:140`

```
eval(s4);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:141`

```
eval(s5);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:142`

```
eval(s6);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:143`

```
eval(s7);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:144`

```
eval(s8);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:154`

```
eval(source);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:165`

```
eval(clean);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:166`

```
eval(dirty);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:180`

```
eval(u);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/analyzer/SecurityCodeAnalyzer.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/SecurityCodeAnalyzer.test.ts:63`

```
eval(payload);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/captcha/CaptchaDetector.callbacks.extra.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/captcha/CaptchaDetector.callbacks.extra.test.ts:33`

```
const runner = new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/captcha/CaptchaDetector.coverage.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/captcha/CaptchaDetector.coverage.test.ts:26`

```
const runner = new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/collector/PageController.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/collector/PageController.test.ts:555`

```
return eval(pageFunction);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/deobfuscator/Deobfuscator.utils.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/deobfuscator/Deobfuscator.utils.test.ts:14`

```
const code = 'var _0xabc=["a"]; __webpack_require__(1); eval("x"); Function("return 1");';
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/deobfuscator/PackerDeobfuscator.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/deobfuscator/PackerDeobfuscator.test.ts:36`

```
const PACKER_LIKE = "eval(function(p,a,c,k,e,d){return p;}('0',62,1,'x'.split('|'),0,{}))";
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/deobfuscator/PackerDeobfuscator.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/deobfuscator/PackerDeobfuscator.test.ts:162`

```
const result = await (deobfuscator as any).unpack('eval(function(p,a,c,k,e,d){})(0)');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/deobfuscator/PackerDeobfuscator.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/deobfuscator/PackerDeobfuscator.test.ts:164`

```
expect(result).toBe('eval(function(p,a,c,k,e,d){})(0)');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/deobfuscator/webcrack.benchmark.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/deobfuscator/webcrack.benchmark.test.ts:46`

```
new Function(code);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/detector/ObfuscationDetector.coverage.extra.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/detector/ObfuscationDetector.coverage.extra.test.ts:68`

```
eval(function(p,a,c,k,e,d){return p;});
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/detector/ObfuscationDetector.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/detector/ObfuscationDetector.test.ts:81`

```
const detected = detector.detect('eval(function(p,a,c,k,e,d){})');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/detector/ObfuscationDetector.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/detector/ObfuscationDetector.test.ts:113`

```
eval("a");
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/detector/ObfuscationDetector.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/detector/ObfuscationDetector.test.ts:114`

```
eval("b");
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/detector/ObfuscationDetector.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/detector/ObfuscationDetector.test.ts:115`

```
eval("c");
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/detector/ObfuscationDetector.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/detector/ObfuscationDetector.test.ts:116`

```
const factory = new Function("return 1");
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/detector/ObfuscationDetector.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/detector/ObfuscationDetector.test.ts:119`

```
const packed = eval(function(p,a,c,k,e,d){return p;});
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/emulator/EnvironmentEmulatorFetch.coverage.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/emulator/EnvironmentEmulatorFetch.coverage.test.ts:84`

```
const runner = new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/stealth/StealthVerifier.coverage.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/stealth/StealthVerifier.coverage.test.ts:23`

```
const runner = new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/stealth/StealthVerifier.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/stealth/StealthVerifier.test.ts:163`

```
const wrappedFn = new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/modules/stealth/StealthVerifier.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/stealth/StealthVerifier.test.ts:200`

```
const wrappedFn = new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/ast-and-deflat.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/ast-and-deflat.test.ts:51`

```
eval("console.log('hello')");
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/ast-and-deflat.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/ast-and-deflat.test.ts:52`

```
function foo() { eval("x"); }
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/ast-and-deflat.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/ast-and-deflat.test.ts:130`

```
code: 'eval("x")',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/data-flow-security-scan.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/data-flow-security-scan.test.ts:33`

```
const code = `eval(location.href);`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/data-flow-security-scan.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/data-flow-security-scan.test.ts:88`

```
const code = `window.addEventListener('message', function(e) { eval(e.data); });`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/data-flow-security-scan.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/data-flow-security-scan.test.ts:128`

```
it('detects eval() as critical risk', async () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/data-flow-security-scan.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/data-flow-security-scan.test.ts:129`

```
const code = 'eval("console.log(1)");';
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/data-flow-security-scan.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/data-flow-security-scan.test.ts:200`

```
eval('x');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/handlers-extended.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/handlers-extended.test.ts:732`

```
code: 'eval("code")',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/handlers.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/handlers.test.ts:298`

```
code: 'eval(function(p,a,c,k,e,d)...',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/analysis/handlers.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/analysis/handlers.test.ts:304`

```
'eval(function(p,a,c,k,e,d)...',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/browser/page-evaluation.security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/browser/page-evaluation.security.test.ts:5`

```
* new Function() with untrusted input, preventing code injection attacks.
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/browser/page-evaluation.security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/browser/page-evaluation.security.test.ts:9`

```
* - OWASP: Avoid eval() and Function() for untrusted code
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/browser/page-evaluation.security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/browser/page-evaluation.security.test.ts:294`

```
it('uses Camoufox native evaluate API instead of new Function()', async () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/canvas/adapters/babylon-adapter.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/canvas/adapters/babylon-adapter.test.ts:121`

```
const fn = new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/canvas/adapters/three-adapter.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/canvas/adapters/three-adapter.test.ts:177`

```
const fn = new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/canvas/canvas.coverage.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/canvas/canvas.coverage.test.ts:361`

```
const evaluator = new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/canvas/handlers.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/canvas/handlers.test.ts:39`

```
const evaluator = new Function(
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/server/domains/instrumentation/hooks/preset-definitions.core.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/instrumentation/hooks/preset-definitions.core.test.ts:185`

```
it('eval description mentions eval()', async () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/native/PEAnalyzer.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/native/PEAnalyzer.test.ts:752`

```
await fs.unlink('test.exe');
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/server/domains/exploit-dev/caching-benchmark.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching-benchmark.test.ts:98`

```
fs.unlinkSync(tmpBinary);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/server/domains/exploit-dev/caching-integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching-integration.test.ts:74`

```
fs.unlinkSync(tmpBinary);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/server/domains/exploit-dev/caching.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching.test.ts:216`

```
fs.unlinkSync(tmpFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/server/domains/exploit-dev/caching.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching.test.ts:231`

```
fs.unlinkSync(tmpFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/server/domains/exploit-dev/caching.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching.test.ts:248`

```
fs.unlinkSync(tmpFile1);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/server/domains/exploit-dev/caching.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching.test.ts:249`

```
fs.unlinkSync(tmpFile2);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.branches.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.branches.test.ts:188`

```
const r = await analyzeDataFlowWithTaint('fs.writeFile("/tmp/o", d);');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.branches.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.branches.test.ts:196`

```
const r = await analyzeDataFlowWithTaint('fs.writeFileSync("/p", "d");');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:116`

```
fs.writeFileSync(source);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/modules/analyzer/CodeAnalyzerDataFlow.test.ts:118`

```
fs.writeFile(source);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/native/PEAnalyzer.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/native/PEAnalyzer.test.ts:746`

```
await fs.writeFile('test.exe', mockPE);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/native/PEAnalyzer.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/native/PEAnalyzer.test.ts:777`

```
await fs.writeFile('test.exe', Buffer.from(mockPE.subarray(0, 4180)));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/server/domains/browser/jsdom-tools.security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/browser/jsdom-tools.security.test.ts:84`

```
fs.writeFileSync('/tmp/exploit.txt', 'pwned');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/server/domains/exploit-dev/caching-benchmark.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching-benchmark.test.ts:93`

```
fs.writeFileSync(tmpBinary, Buffer.concat([elfHeader, phdr, code]));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/server/domains/exploit-dev/caching-integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching-integration.test.ts:69`

```
fs.writeFileSync(tmpBinary, Buffer.concat([elfHeader, phdr, gadgets]));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/server/domains/exploit-dev/caching-integration.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching-integration.test.ts:180`

```
fs.appendFileSync(tmpBinary, Buffer.from([0x90, 0x90])); // Add NOPs
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/server/domains/exploit-dev/caching.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching.test.ts:207`

```
fs.writeFileSync(tmpFile, Buffer.from([0x7f, 0x45, 0x4c, 0x46]));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/server/domains/exploit-dev/caching.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching.test.ts:223`

```
fs.writeFileSync(tmpFile, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/server/domains/exploit-dev/caching.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching.test.ts:239`

```
fs.writeFileSync(tmpFile1, Buffer.from('content1'));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/server/domains/exploit-dev/caching.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/exploit-dev/caching.test.ts:240`

```
fs.writeFileSync(tmpFile2, Buffer.from('content2'));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/native/platform/Win32MemoryProvider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/native/platform/Win32MemoryProvider.test.ts`

```
@<redacted:high-entropy>.js
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/native/platform/platform-factory.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/native/platform/platform-factory.test.ts`

```
@<redacted:high-entropy>.js
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/server/domains/boringssl-inspector/handlers.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/boringssl-inspector/handlers.test.ts`

```
<redacted:private-key>
<redacted:high-entropy>
<redacted:high-entropy>
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/server/domains/boringssl-inspector/handlers.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/server/domains/boringssl-inspector/handlers.test.ts`

```
-----BEGIN CERTIFICATE-----
<redacted:high-entropy>
<redacted:high-entropy>
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/server/domains/browser/handlers/captcha-capabilities.ts:30`

```
const apiKeyConfigured = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/server/domains/browser/handlers/captcha-solver.ts:443`

```
const apiKey = <redacted:secret>, 'apiKey', '') || process.env.CAPTCHA_API_KEY || '';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/server/http/HttpMiddleware.ts:40`

```
if (process.env.MCP_AUTH_TOKEN) return true;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/server/ExtensionManager.test.ts:68`

```
delete process.env.MCP_PLUGIN_SIGNATURE_SECRET;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/server/domains/browser/captcha-capabilities.test.ts:17`

```
CAPTCHA_API_KEY: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/server/domains/browser/captcha-solver-additional.test.ts:47`

```
CAPTCHA_API_KEY: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/server/domains/browser/captcha-solver-coverage.test.ts:60`

```
CAPTCHA_API_KEY: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/server/domains/browser/captcha-solver-runtime.test.ts:43`

```
CAPTCHA_API_KEY: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/server/domains/browser/captcha-solver.test.ts:147`

```
const origKey = process.env.CAPTCHA_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:49:39.813Z._
