# MCP Trust Report: github:wonderwhy-er/DesktopCommanderMCP

**Decision:** BLOCK  
**Risk:** MEDIUM  
**Score:** 48/100  
**Confidence:** 78%

**Source:** [github.com/wonderwhy-er/DesktopCommanderMCP](https://github.com/wonderwhy-er/DesktopCommanderMCP)

_Resolved ref: `d627e1baf8b51c5e0c64bf8e3da78c148743e44a`_

## Executive Summary
The scanner found **high-confidence capability evidence in the server’s runtime code** (e.g. command execution). Review the flagged findings below before connecting this server to an agent. **A BLOCK is a "review required", not proof the server is malicious** — the evidence may be legitimate by design (see Decision Reasons).

## Decision Reasons
- Overall score 48 falls in MEDIUM band
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
| supplyChain | 41 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 56 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (206)
### CRITICAL (2)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/utils/ripgrep-resolver.ts:40`

```
const result = execSync(`${whichCmd} ${systemRg}`, { encoding: 'utf-8' }).trim().split(/\r?\n/)[0];
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/utils/system-info.ts:475`

```
const version = execSync(`${cmd} --version`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

### HIGH (19)
#### MCP-CODE-001: child_process.exec usage
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `setup-claude-server.js:128`

```
exec('npm --version', (error, stdout, stderr) => {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `setup-claude-server.js:544`

```
exec(actualCommand, { timeout: 10000 }, (error, stdout, stderr) => {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `uninstall-claude-server.js:86`

```
exec('npm --version', (error, stdout, stderr) => {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection.

**Evidence:** `uninstall-claude-server.js:422`

```
exec(actualCommand, { timeout: 10000 }, (error, stdout, stderr) => {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/remote-device/desktop-commander-integration.ts:103`

```
const check = spawn(whichCommand, [commandName], { windowsHide: true }); // Prevent visible console windows on Windows
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/search-manager.ts:84`

```
const rgProcess = spawn(rgPath, args, { windowsHide: true }); // Prevent visible console windows on Windows
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/terminal-manager.ts:256`

```
const childProcess = spawn(spawnConfig.executable, spawnConfig.args, spawnOptions);
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/utils/open-browser.ts:25`

```
execFile('open', [url], callback);
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/utils/open-browser.ts:29`

```
spawn('cmd', ['/c', 'start', '', url], { shell: false, windowsHide: true }).on('close', (code) => {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/utils/open-browser.ts:34`

```
execFile('xdg-open', [url], callback);
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `test-listener-bug.js:27`

```
const server = spawn('node', [serverPath, '--no-onboarding'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/files/docx.ts:608`

```
await fs.writeFile(path, buf);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/files/docx.ts:716`

```
await fs.writeFile(path, outBuf);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/files/image.ts:57`

```
await fs.writeFile(path, buffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/files/image.ts:59`

```
await fs.writeFile(path, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/files/pdf.ts:89`

```
await fs.writeFile(path, resultBuffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/files/pdf.ts:103`

```
await fs.writeFile(options?.outputPath || path, resultBuffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/files/text.ts:64`

```
await fs.appendFile(path, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/files/text.ts:66`

```
await fs.writeFile(path, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (63)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→medium: this match is in build/dev-tooling code — scripts/build-mcpb.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/build-mcpb.cjs:177`

```
execSync(`npx @anthropic-ai/mcpb validate "${MANIFEST_PATH}"`, { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→medium: this match is in build/dev-tooling code — scripts/build-mcpb.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/build-mcpb.cjs:188`

```
execSync(`npx @anthropic-ai/mcpb pack "${BUNDLE_DIR}" "${outputFile}"`, { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→medium: this match is in build/dev-tooling code — scripts/download-all-ripgrep.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/download-all-ripgrep.cjs:124`

```
execSync(`tar -xzf "${tarPath}" -C "${tempExtractDir}"`, { stdio: 'pipe' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/build-mcpb.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/build-mcpb.cjs:27`

```
execSync('node scripts/download-all-ripgrep.cjs', { cwd: PROJECT_ROOT, stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/build-mcpb.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/build-mcpb.cjs:37`

```
execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/build-mcpb.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/build-mcpb.cjs:131`

```
execSync('npm install --omit=dev --production', { cwd: BUNDLE_DIR, stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/publish-release.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/publish-release.cjs:93`

```
return execSync(command, {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-SUPPLY-003: Install script present in package
**Severity:** medium  **Confidence:** 90%  **Category:** supply_chain

The package declares install/preinstall/postinstall scripts that run automatically on install.

**Evidence:** `package.scripts.postinstall`

```
postinstall: node dist/track-installation.js && node dist/npm-scripts/verify-ripgrep.js || node -e "process.exit(0)"
```

**Impact:** Install scripts execute code on the developer/CI machine at install time.

**Remediation:** Review install scripts; install with --ignore-scripts where possible and vet what they do.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/count-tokens.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/count-tokens.js:34`

```
const server = spawn('node', [serverPath], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/validate-tools-sync.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/validate-tools-sync.js:40`

```
const server = spawn('node', [serverPath], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/improved-process-tools.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/improved-process-tools.ts:34`

```
const proc = spawn(process.execPath, [tempFile], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/build-mcpb.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/build-mcpb.cjs:46`

```
fs.rmSync(BUNDLE_DIR, { recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/download-all-ripgrep.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/download-all-ripgrep.cjs:77`

```
fs.unlink(dest, () => reject(err));
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/download-all-ripgrep.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/download-all-ripgrep.cjs:138`

```
fs.rmSync(tempExtractDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/publish-release.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/publish-release.cjs:73`

```
fs.unlinkSync(STATE_FILE);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/improved-process-tools.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/improved-process-tools.ts:61`

```
await fs.unlink(tempFile).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/improved-process-tools.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/improved-process-tools.ts:82`

```
await fs.unlink(tempFile).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/pdf/markdown.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/pdf/markdown.ts:129`

```
await fs.rm(buildDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/build-mcpb.cjs:50`

```
const packageJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `scripts/build-ui-runtime.cjs:64`

```
styleLayers.map((layerPath) => fs.readFile(path.join(projectRoot, layerPath), 'utf8'))
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/ui/resources.ts:75`

```
fs.readFile(path.join(distDir, 'index.html'), 'utf8'),
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/ui/resources.ts:76`

```
fs.readFile(path.join(distDir, 'styles.css'), 'utf8'),
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/ui/resources.ts:77`

```
fs.readFile(path.join(distDir, runtimeFileName), 'utf8')
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/utils/files/docx.ts:519`

```
const buf = await fs.readFile(path);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/utils/files/docx.ts:648`

```
const buf = await fs.readFile(path);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/utils/files/docx.ts:736`

```
const buf = await fs.readFile(path);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/utils/files/image.ts:40`

```
const buffer = await fs.readFile(path, { signal: options?.signal });
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/utils/files/text.ts:88`

```
const content = await fs.readFile(path, 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/build-ui-runtime.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/build-ui-runtime.cjs:66`

```
await fs.writeFile(path.join(outputDir, 'styles.css'), `${styles.join('\n\n')}\n`, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/publish-release.cjs — which does not run as part of the MCP server.)

**Evidence:** `scripts/publish-release.cjs:157`

```
fs.writeFileSync(versionTsPath, `export const VERSION = '${newVersion}';\n`);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/build-mcpb.cjs:79`

```
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/build-mcpb.cjs:123`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/download-all-ripgrep.cjs:68`

```
const file = fs.createWriteStream(dest);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/download-all-ripgrep.cjs:95`

```
const writeStream = fs.createWriteStream(outputPath);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/export-fuzzy-logs.js:127`

```
await fs.writeFile(outputFile, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/publish-release.cjs:69`

```
fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/publish-release.cjs:140`

```
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/publish-release.cjs:153`

```
fs.writeFileSync(serverJsonPath, JSON.stringify(serverJson, null, 2) + '\n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/publish-release.cjs:366`

```
fs.writeFileSync(serverJsonPath, JSON.stringify(serverJson, null, 2) + '\n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `setup-claude-server.js:110`

```
await fs.writeFile(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/config-manager.ts:187`

```
await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/remote-device/device.ts:233`

```
await fs.writeFile(this.configPath, JSON.stringify(config, null, 2), { mode: 0o600 });
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/tools/filesystem.ts:1026`

```
await fs.writeFile(targetPath, pdfBuffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/tools/filesystem.ts:1056`

```
await fs.writeFile(targetPath, modifiedPdfBuffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/tools/improved-process-tools.ts:31`

```
await fs.writeFile(tempFile, code, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/feature-flags.ts:231`

```
await fs.writeFile(this.cachePath, JSON.stringify(config, null, 2), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/fuzzySearchLogger.ts:65`

```
await fs.writeFile(this.logPath, headers + '\n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/fuzzySearchLogger.ts:99`

```
await fs.appendFile(this.logPath, logLine + '\n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/fuzzySearchLogger.ts:146`

```
await fs.writeFile(this.logPath, headers + '\n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/toolHistory.ts:148`

```
fs.writeFileSync(this.historyFile, kept.join('\n') + '\n', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/toolHistory.ts:166`

```
fs.writeFileSync(this.historyFile, lines, 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/toolHistory.ts:205`

```
fs.appendFileSync(this.historyFile, lines, 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/utils/files/docx.ts`

```
<Relationship Id="rId1" Type="http://schemas.openxmlformats.<redacted:high-entropy>" Target="word/document.xml"/>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/utils/files/docx.ts`

```
<Relationship Id="rId1" Type="http://schemas.openxmlformats.<redacted:high-entropy>" Target="styles.xml"/>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/download-all-ripgrep.cjs:51`

```
https.get(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `setup-claude-server.js:369`

```
const req = https.request(endpoint, options);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/tools/filesystem.ts:367`

```
const response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/tools/pdf/markdown.ts:264`

```
const response = await fetch(source);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/utils/capture.ts:258`

```
const req = https.request(captureURL, options, (res) => {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/utils/capture.ts:446`

```
const req = https.request(options, (res) => {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/utils/feature-flags.ts:180`

```
const fetchPromise = fetch(this.flagUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `track-installation.js:333`

```
const req = https.request(endpoint, options);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `uninstall-claude-server.js:283`

```
const req = https.request(endpoint, options);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (122)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-bootstrap-threadpool.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-bootstrap-threadpool.js:13`

```
execSync(`mkfifo ${fifo}`);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-bootstrap-threadpool.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-bootstrap-threadpool.js:19`

```
const guard = setTimeout(() => { log(`BLOCKED >3000ms -> bootstrap did NOT help`); execSync(`rm -f ${fifo}`); process.exit(1); }, 3000);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-bootstrap-threadpool.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-bootstrap-threadpool.js:23`

```
execSync(`rm -f ${fifo}`); process.exit(0);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-dc-tracking-gate.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-dc-tracking-gate.js:20`

```
execSync(`mkfifo ${fifo}`);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-dc-tracking-gate.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-dc-tracking-gate.js:39`

```
execSync(`rm -f ${fifo}`);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-dc-tracking-gate.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-dc-tracking-gate.js:45`

```
execSync(`rm -f ${fifo}`);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-env-threadpool-timing.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-env-threadpool-timing.js:13`

```
execSync(`mkfifo ${fifo}`);           // child_process, not threadpool
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-env-threadpool-timing.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-env-threadpool-timing.js:19`

```
const guard = setTimeout(() => { log(`BLOCKED >3000ms -> env set too late, pool still 4`); execSync(`rm -f ${fifo}`); process.exit(0); }, 3000);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-env-threadpool-timing.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-env-threadpool-timing.js:23`

```
execSync(`rm -f ${fifo}`); process.exit(0);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-read-abort-frees-thread.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-read-abort-frees-thread.js:24`

```
execSync(`dd if=/dev/zero of=${big} bs=1m count=800 2>/dev/null`);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-read-abort-frees-thread.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-read-abort-frees-thread.js:40`

```
execSync(`rm -f ${big}`);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-threadpool-starvation.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-threadpool-starvation.js:20`

```
try { execSync(`mkfifo ${fifo}`); } catch (e) { console.error('mkfifo failed', e.message); process.exit(1); }
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-threadpool-starvation.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-threadpool-starvation.js:36`

```
try { execSync(`rm -f ${fifo} ${probe}`); } catch {}
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-threadpool-starvation.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-threadpool-starvation.js:43`

```
execSync(`rm -f ${fifo} ${probe}`);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-withtimeout-leak.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-withtimeout-leak.js:16`

```
execSync(`mkfifo ${fifo}`);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-withtimeout-leak.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-withtimeout-leak.js:32`

```
execSync(`rm -f ${fifo}`);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/repro/test-withtimeout-leak.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-withtimeout-leak.js:38`

```
execSync(`rm -f ${fifo}`);
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/test-enhanced-repl.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-enhanced-repl.js:12`

```
execSync('command -v python3', { stdio: 'ignore' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/test-enhanced-repl.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-enhanced-repl.js:17`

```
execSync('command -v python', { stdio: 'ignore' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-allowed-directories.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-allowed-directories.js:44`

```
await fs.rm(path.join(__dirname, 'test_dir_abc'), { recursive: true, force: true }).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-allowed-directories.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-allowed-directories.js:45`

```
await fs.rm(path.join(__dirname, 'test_dir_abc_xyz'), { recursive: true, force: true }).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/integration/edit-block-performance.js — which does not run as part of the MCP server.)

**Evidence:** `test/integration/edit-block-performance.js:795`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/integration/edit-block-performance.js — which does not run as part of the MCP server.)

**Evidence:** `test/integration/edit-block-performance.js:833`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/integration/read-file-unknown-params.js — which does not run as part of the MCP server.)

**Evidence:** `test/integration/read-file-unknown-params.js:57`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/integration/read-file-unknown-params.js — which does not run as part of the MCP server.)

**Evidence:** `test/integration/read-file-unknown-params.js:80`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-allowed-directories.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-allowed-directories.js:40`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-allowed-directories.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-allowed-directories.js:41`

```
await fs.rm(OUTSIDE_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-allowed-directories.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-allowed-directories.js:356`

```
await fs.rm(baseDir, { recursive: true, force: true }).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-allowed-directories.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-allowed-directories.js:357`

```
await fs.rm(prefixMatchDir, { recursive: true, force: true }).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-blocked-commands.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-blocked-commands.js:61`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-directory-creation.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-directory-creation.js:34`

```
await fs.rm(BASE_TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:98`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-edit-block-occurrences.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-occurrences.js:76`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-excel-files.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-excel-files.js:36`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js:42`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-home-directory.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-home-directory.js:46`

```
await fs.rm(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-literal-search.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-literal-search.js:159`

```
await fs.rm(LITERAL_SEARCH_TEST_DIR, { force: true, recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-negative-offset-readfile.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-negative-offset-readfile.js:61`

```
await fs.rm(TEST_FILE, { force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-pdf-chrome-cache.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-pdf-chrome-cache.js:91`

```
await fs.rm(tempRoot, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-pdf-creation.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-pdf-creation.js:133`

```
await fs.unlink(tempMergeFile).catch(() => { });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:139`

```
await fs.rm(EDGE_CASE_TEST_DIR, { force: true, recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:426`

```
await fs.rm(manyFilesDir, { force: true, recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code.js:180`

```
await fs.rm(TEST_DIR, { force: true, recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code.js:358`

```
await fs.rm(hiddenFile, { force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-symlink-security.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-symlink-security.js:33`

```
await fs.rm(ALLOWED_DIR, { recursive: true, force: true }).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-symlink-security.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-symlink-security.js:34`

```
await fs.rm(RESTRICTED_DIR, { recursive: true, force: true }).catch(() => {});
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test.js — which does not run as part of the MCP server.)

**Evidence:** `test/test.js:28`

```
await fs.rm(TEST_FILEPATH, { force: true, recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test.js — which does not run as part of the MCP server.)

**Evidence:** `test/test.js:64`

```
await fs.unlink(TEST_FILEPATH);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — test/integration/edit-block-performance.js — which does not run as part of the MCP server.)

**Evidence:** `test/integration/edit-block-performance.js:22`

```
const README_TEXT = await fs.readFile(path.join(PROJECT_ROOT, 'README.md'), 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — test/repro/test-dc-tracking-gate.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-dc-tracking-gate.js:29`

```
fs.readFile(fifo).catch((e) => log(`fifo read ${i} errored: ${e.code}`));
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — test/repro/test-threadpool-starvation.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-threadpool-starvation.js:26`

```
fs.readFile(fifo).then(() => log(`fifo read ${i} resolved (unexpected)`))
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/repro/test-bootstrap-threadpool.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-bootstrap-threadpool.js:20`

```
await fs.writeFile(path.join(os.tmpdir(), 'dc-boot-probe'), 'x');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/repro/test-env-threadpool-timing.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-env-threadpool-timing.js:20`

```
await fs.writeFile(path.join(os.tmpdir(), 'dc-envtest-probe'), 'x');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/repro/test-withtimeout-leak.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-withtimeout-leak.js:35`

```
await fs.writeFile(path.join(os.tmpdir(), 'dc-leak-probe'), 'x');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-allowed-directories.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-allowed-directories.js:87`

```
await fs.writeFile(path.join(TEST_DIR, 'test-file.txt'), 'Test content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-allowed-directories.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-allowed-directories.js:88`

```
await fs.writeFile(path.join(OUTSIDE_DIR, 'outside-file.txt'), 'Outside content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-allowed-directories.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-allowed-directories.js:326`

```
await fs.writeFile(path.join(baseDir, 'base-file.txt'), 'Base content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-allowed-directories.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-allowed-directories.js:327`

```
await fs.writeFile(path.join(prefixMatchDir, 'prefix-file.txt'), 'Prefix content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-blocked-commands.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-blocked-commands.js:120`

```
await fs.writeFile(path.join(TEST_DIR, 'test-file.txt'), 'Test content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-literal-search.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-literal-search.js:84`

```
await fs.writeFile(path.join(LITERAL_SEARCH_TEST_DIR, 'code-patterns.js'), `// JavaScript file with common code patterns
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-literal-search.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-literal-search.js:127`

```
await fs.writeFile(path.join(LITERAL_SEARCH_TEST_DIR, 'similar-patterns.ts'), `// TypeScript file with similar patterns
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-repl-interaction.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-repl-interaction.js:116`

```
await fs.writeFile(OUTPUT_FILE, `Python REPL output:\n${output || 'No output received'}`);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-repl-interaction.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-repl-interaction.js:188`

```
await fs.appendFile(OUTPUT_FILE, `\n\nNode.js REPL output:\n${output || 'No output received'}`);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:82`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'empty.txt'), '');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:85`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'whitespace.txt'), '   \n\t\n   \n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:89`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'long-lines.txt'), longLine);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:92`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'special-chars.txt'),
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:97`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'binary.bin'), binaryData);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:101`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'large.txt'), largeContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:104`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'regex-chars.txt'),
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:437`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'file1.ts'), 'export const myTsVar = "patternTs";');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:438`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'file2.js'), 'const myJsVar = "patternJs";');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:439`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'file3.py'), 'my_py_var = "patternPy"');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:440`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'file4.java'), 'String myJavaVar = "patternJava";');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:441`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'file5.go'), 'var myGoVar = "patternGo"');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:442`

```
await fs.writeFile(path.join(EDGE_CASE_TEST_DIR, 'file6.txt'), 'This is a text file.');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code.js:89`

```
await fs.writeFile(TEST_FILE_1, `// JavaScript test file
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code.js:103`

```
await fs.writeFile(TEST_FILE_2, `// TypeScript test file
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code.js:121`

```
await fs.writeFile(TEST_FILE_3, `This is a hidden text file.
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-search-code.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code.js:127`

```
await fs.writeFile(TEST_FILE_4, `# Python test file
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-symlink-security.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-symlink-security.js:48`

```
await fs.writeFile(path.join(RESTRICTED_DIR, 'secret.txt'), 'TOP SECRET DATA');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-symlink-security.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-symlink-security.js:51`

```
await fs.writeFile(path.join(ALLOWED_DIR, 'normal.txt'), 'Normal allowed content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/test-symlink-security.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-symlink-security.js:182`

```
await fs.writeFile(path.join(subdir, 'allowed_secret.txt'), 'Allowed secret');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/integration/edit-block-performance.js — which does not run as part of the MCP server.)

**Evidence:** `test/integration/edit-block-performance.js:661`

```
await fs.writeFile(filePath, line.repeat(Math.ceil((FUZZY_SCAN_FILE_MB * 1024 * 1024) / line.length)), 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/integration/read-file-unknown-params.js — which does not run as part of the MCP server.)

**Evidence:** `test/integration/read-file-unknown-params.js:60`

```
await fs.writeFile(TEST_FILE, lines.join('\n'));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/modified-test.js — which does not run as part of the MCP server.)

**Evidence:** `test/modified-test.js:18`

```
await fs.writeFile(LARGE_FILE_LF, lines.join(''));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/modified-test.js — which does not run as part of the MCP server.)

**Evidence:** `test/modified-test.js:22`

```
await fs.writeFile(LARGE_FILE_CRLF, crlfLines.join(''));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/repro/test-dc-tracking-gate.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-dc-tracking-gate.js:4`

```
// .setValue -> saveConfig -> fs.writeFile (libuv threadpool).
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/repro/test-threadpool-starvation.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-threadpool-starvation.js:3`

```
// and the per-tool-call config fs.writeFile (usageTracker.saveStats) queues
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/repro/test-threadpool-starvation.js — which does not run as part of the MCP server.)

**Evidence:** `test/repro/test-threadpool-starvation.js:40`

```
await fs.writeFile(probe, '{}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:69`

```
await fs.writeFile(LF_FILE, lfContent, { encoding: 'utf8' });
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:73`

```
await fs.writeFile(CRLF_FILE, crlfContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:77`

```
await fs.writeFile(CR_FILE, crContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:81`

```
await fs.writeFile(MIXED_FILE, mixedContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:255`

```
await fs.writeFile(CRLF_FILE, crlfContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:273`

```
await fs.writeFile(LF_FILE, lfContent, { encoding: 'utf8' });
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:308`

```
await fs.writeFile(LARGE_FILE_LF, lines.join(''));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:312`

```
await fs.writeFile(LARGE_FILE_CRLF, crlfLines.join(''));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:357`

```
await fs.writeFile(EMPTY_FILE, '');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:358`

```
await fs.writeFile(SINGLE_LINE_FILE, 'Only one line with no ending');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-line-endings.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-line-endings.js:359`

```
await fs.writeFile(NO_ENDING_FILE, 'Two lines\nBut no ending');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-occurrences.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-occurrences.js:37`

```
await fs.writeFile(MULTI_OCCURRENCE_FILE,
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-edit-block-occurrences.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-edit-block-occurrences.js:46`

```
await fs.writeFile(CONTEXT_TEST_FILE,
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js:130`

```
await fs.writeFile(TEXT_FILE, 'Hello, World!\nLine 2\nLine 3');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js:154`

```
await fs.writeFile(TEXT_FILE, 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js:243`

```
await fs.writeFile(TEXT_FILE, 'Some content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js:297`

```
await fs.writeFile(MD_FILE, markdownContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js:298`

```
await fs.writeFile(TEXT_FILE, textContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js:299`

```
await fs.writeFile(HTML_FILE, '<h1>Preview</h1><script>alert(1)</script>');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js:300`

```
await fs.writeFile(IMAGE_FILE, Buffer.from(tinyPngBase64, 'base64'));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js:301`

```
await fs.writeFile(SVG_FILE, tinySvg);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js:376`

```
await fs.writeFile(MD_FILE, originalContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-line-count.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-line-count.js:22`

```
await fs.writeFile(filePath, content, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-negative-offset-readfile.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-negative-offset-readfile.js:44`

```
await fs.writeFile(TEST_FILE, testContent, 'utf8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-node-repl.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-node-repl.js:84`

```
fs.writeFile(debugFile, debugLog).catch(err => {
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-pdf-chrome-cache.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-pdf-chrome-cache.js:41`

```
await fs.writeFile(executablePath, '');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-pdf-parsing.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-pdf-parsing.js:74`

```
await fs.writeFile(filepath, buffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-pdf-parsing.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-pdf-parsing.js:84`

```
await fs.writeFile(markdownPath, markdown);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-search-code-edge-cases.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code-edge-cases.js:405`

```
promises.push(fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test-search-code.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-search-code.js:341`

```
await fs.writeFile(hiddenFile, 'This is hidden content with pattern');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/test.js — which does not run as part of the MCP server.)

**Evidence:** `test/test.js:42`

```
await fs.writeFile(TEST_FILEPATH, 'This is old content to replace');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — test/test-file-handlers.js — which does not run as part of the MCP server.)

**Evidence:** `test/test-file-handlers.js`

```
<redacted:high-entropy>=
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.


## Recommended Policy
- Block by default; do not connect to developer workstations or production agents without review.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:49:24.223Z._
