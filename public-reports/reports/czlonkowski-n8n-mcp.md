# MCP Trust Report: github:czlonkowski/n8n-mcp

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 40/100  
**Confidence:** 76%

_Resolved ref: `d1115d85142be57331dde1fcb711e99e3ad23734`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 40 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-001, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002

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
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 80 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (316)
### HIGH (11)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/utils/enhanced-documentation-fetcher.ts:146`

```
const cloneResult = spawnSync('git', [
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/utils/enhanced-documentation-fetcher.ts:172`

```
const pullResult = spawnSync('git', [
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/services/config-validator.ts:615`

```
if (code?.includes('eval(') || code?.includes('exec(')) {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/services/node-specific-validators.ts:2052`

```
// literals (e.g. a prompt mentioning "eval(") don't warn — security-type
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/services/node-specific-validators.ts:2062`

```
{ pattern: /(?<![.\w$])eval\s*\(/, message: 'Avoid eval() - it\'s a security risk' },
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `src/services/node-specific-validators.ts:2066`

```
{ pattern: /(?:window|globalThis)\s*\.\s*eval\s*\(/, message: 'Avoid eval() - it\'s a security risk' },
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/templates/batch-processor.ts:136`

```
fs.unlinkSync(inputFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/templates/batch-processor.ts:156`

```
fs.unlinkSync(inputFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/templates/batch-processor.ts:189`

```
fs.unlinkSync(inputFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/templates/batch-processor.ts:396`

```
fs.unlinkSync(localFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/enhanced-documentation-fetcher.ts:804`

```
await fs.rm(this.docsPath, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (93)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/generate-initial-release-notes.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/generate-initial-release-notes.js:13`

```
const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/generate-release-notes.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/generate-release-notes.js:18`

```
const commitsOutput = execSync(gitLogCommand, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/prepare-release.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/prepare-release.js:127`

```
execSync('npm run sync:runtime-version', { cwd: this.rootDir, stdio: 'pipe' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/prepare-release.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/prepare-release.js:226`

```
execSync('npm test', { cwd: this.rootDir, stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/prepare-release.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/prepare-release.js:231`

```
execSync('npm run build', { cwd: this.rootDir, stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/prepare-release.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/prepare-release.js:236`

```
execSync('npm run rebuild', { cwd: this.rootDir, stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/prepare-release.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/prepare-release.js:241`

```
execSync('npm run typecheck', { cwd: this.rootDir, stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/prepare-release.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/prepare-release.js:258`

```
const status = execSync('git status --porcelain', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/prepare-release.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/prepare-release.js:270`

```
execSync('git diff --name-only', { cwd: this.rootDir, stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/prepare-release.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/prepare-release.js:276`

```
execSync('git add package.json package.runtime.json docs/CHANGELOG.md', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/prepare-release.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/prepare-release.js:315`

```
execSync('git push', { cwd: this.rootDir, stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-release-automation.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-release-automation.js:476`

```
const npmVersion = execSync('npm --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-release-automation.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-release-automation.js:485`

```
const gitVersion = execSync('git --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-release-automation.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-release-automation.js:494`

```
execSync('git rev-parse --git-dir', { stdio: 'pipe' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-release-automation.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-release-automation.js:499`

```
const branch = execSync('git branch --show-current', { encoding: 'utf8', stdio: 'pipe' }).trim();
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/update-n8n-deps.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/update-n8n-deps.js:44`

```
const output = execSync('npm view n8n@latest dependencies --json', { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/update-n8n-deps.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/update-n8n-deps.js:153`

```
execSync('npm install', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/update-n8n-deps.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/update-n8n-deps.js:170`

```
execSync('npm run build && npm run rebuild', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/update-n8n-deps.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/update-n8n-deps.js:187`

```
execSync('npm run validate', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/prepare-release.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/prepare-release.js:288`

```
const result = spawnSync('git', ['commit', '-m', commitMessage], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/quick-test.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/quick-test.ts:35`

```
const mcp = spawn('npm', ['start'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/smoke-cjs-runtime.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/smoke-cjs-runtime.js:36`

```
spawnSync(process.execPath, [FLAG, '-e', ''], { stdio: 'ignore' }).status === 0;
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/smoke-cjs-runtime.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/smoke-cjs-runtime.js:39`

```
const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-security.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-security.ts:9`

```
const serverProcess = spawn('node', ['dist/mcp/index.js'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-url-configuration.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-url-configuration.ts:95`

```
const serverProcess = spawn('node', ['dist/mcp/index.js'], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/sync-skills.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/sync-skills.ts:47`

```
await fs.rm(path.join(dir, entry.name), { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** medium  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/test-code-node-enhancements.ts — which does not run as part of the MCP server.)

**Evidence:** `scripts/test-code-node-enhancements.ts:78`

```
jsCode: 'const result = eval(item.json.code);\nreturn [{json: {result}}];'
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/scripts/fetch-templates-robust.ts:30`

```
const schema = fs.readFileSync(path.join(__dirname, '../../src/database/schema.sql'), 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/scripts/fetch-templates.ts:297`

```
const schema = fs.readFileSync(path.join(__dirname, '../../src/database/schema.sql'), 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** medium  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope.

**Evidence:** `src/scripts/rebuild.ts:29`

```
const schema = fs.readFileSync(path.join(__dirname, '../../src/database/schema.sql'), 'utf8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/generate-mcpb-manifest.js:161`

```
fs.writeFileSync(MANIFEST_PATH, output);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/migrate-tool-docs.ts:125`

```
fs.writeFileSync(filePath, template(toolName, category));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/migrate-tool-docs.ts:136`

```
fs.writeFileSync(indexPath, indexContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/prepare-release.js:122`

```
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/prepare-release.js:137`

```
fs.writeFileSync(runtimeJsonPath, JSON.stringify(runtimeJson, null, 2) + '\n');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/prepare-release.js:186`

```
fs.writeFileSync(changelogPath, updatedContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/prepare-release.js:196`

```
fs.writeFileSync(changelogPath, updatedContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/prepare-release.js:207`

```
fs.writeFileSync(changelogPath, updatedContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/sync-runtime-version.js:28`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/sync-runtime-version.js:46`

```
fs.writeFileSync(readmePath, updatedReadmeContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/update-n8n-deps.js:138`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/update-n8n-deps.js:270`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/update-readme-version.js:23`

```
fs.writeFileSync(readmePath, readmeContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/scripts/mine-workflow-patterns.ts:519`

```
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/templates/batch-processor.ts:213`

```
const stream = fs.createWriteStream(filename);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/templates/batch-processor.ts:344`

```
fs.writeFileSync(errorFilePath, errorContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/generate-mcpb-manifest.js:41`

```
const docTools = require(docToolsPath).n8nDocumentationToolsFinal;
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/generate-mcpb-manifest.js:42`

```
const mgmtTools = require(mgmtToolsPath).n8nManagementTools;
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/generate-mcpb-manifest.js:58`

```
const pkg = require(path.join(ROOT, 'package.json'));
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/prepare-release.js:69`

```
const packageJson = require(path.join(this.rootDir, 'package.json'));
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/prepare-release.js:120`

```
const packageJson = require(packageJsonPath);
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/prepare-release.js:135`

```
const runtimeJson = require(runtimeJsonPath);
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `scripts/test-multi-tenant-simple.ts:29`

```
delete process.env.N8N_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `scripts/test-multi-tenant-simple.ts:50`

```
process.env.N8N_API_KEY = '<redacted:secret>';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `scripts/test-multi-tenant-simple.ts:76`

```
delete process.env.N8N_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `scripts/test-multi-tenant-simple.ts:115`

```
process.env.N8N_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `scripts/test-multi-tenant-simple.ts:117`

```
delete process.env.N8N_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `scripts/test-multi-tenant.ts:33`

```
delete process.env.N8N_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `scripts/test-multi-tenant.ts:82`

```
process.env.N8N_API_KEY = '<redacted:secret>';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/test-release-automation.js:94`

```
const packageJson = require(path.join(this.rootDir, 'package.json'));
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/test-release-automation.js:95`

```
const runtimeJson = require(path.join(this.rootDir, 'package.runtime.json'));
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/test-release-automation.js:138`

```
const packageJson = require(path.join(this.rootDir, 'package.json'));
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/test-release-automation.js:265`

```
const packageJson = require(path.join(this.rootDir, 'package.json'));
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `scripts/test-release-automation.js:266`

```
const runtimeJson = require(path.join(this.rootDir, 'package.runtime.json'));
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/http-server-single-session.ts:452`

```
return process.env.AUTH_TOKEN;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/http-server-single-session.ts:458`

```
const token = <redacted:secret>, 'utf-8').trim();
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/http-server-single-session.ts:459`

```
logger.info(`Loaded AUTH_TOKEN from file: ${process.env.AUTH_TOKEN_FILE}`);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/http-server-single-session.ts:462`

```
logger.error(`Failed to read AUTH_TOKEN_FILE: <redacted:secret>}`, error);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/http-server-single-session.ts:463`

```
console.error(`ERROR: Failed to read AUTH_TOKEN_FILE: <redacted:secret>}`);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/http-server.ts:54`

```
return process.env.AUTH_TOKEN;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/http-server.ts:60`

```
const token = <redacted:secret>, 'utf-8').trim();
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/http-server.ts:61`

```
logger.info(`Loaded AUTH_TOKEN from file: ${process.env.AUTH_TOKEN_FILE}`);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/http-server.ts:64`

```
logger.error(`Failed to read AUTH_TOKEN_FILE: <redacted:secret>}`, error);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/http-server.ts:65`

```
console.error(`ERROR: Failed to read AUTH_TOKEN_FILE: <redacted:secret>}`);
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `src/loaders/node-loader.ts:46`

```
const packageJson = require(`${pkg.path}/package.json`);
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `src/loaders/node-loader.ts:80`

```
return require(absolutePath);
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `src/loaders/node-loader.ts:119`

```
const nodeModule = require(absolutePath);
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/scripts/fetch-templates.ts:371`

```
if (generateMetadata && (process.env.OPENAI_API_KEY || process.env.N8N_MCP_LLM_BASE_URL)) {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/scripts/fetch-templates.ts:438`

```
apiKey: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `scripts/test-telemetry-direct.ts`

```
<redacted:jwt>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `scripts/test-workflow-insert.ts`

```
<redacted:jwt>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/telemetry/telemetry-types.ts`

```
<redacted:jwt>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/http-bridge.js:53`

```
const req = http.request(options, (res) => {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/test-url-configuration.ts:121`

```
const rootResponse = await axios.get(rootUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/test-url-configuration.ts:130`

```
const healthResponse = await axios.get(healthUrl);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/test-url-configuration.ts:135`

```
const mcpResponse = await axios.get(mcpUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/community/community-node-fetcher.ts:179`

```
return axios.isAxiosError(error) && error.response?.status === 429;
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/community/community-node-fetcher.ts:382`

```
const response = await axios.get(url, { timeout: FETCH_CONFIG.NPM_REGISTRY_TIMEOUT });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/services/n8n-api-client.ts:88`

```
this.client = axios.create({
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/services/n8n-api-client.ts:217`

```
const response = await axios.get(healthzUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/services/n8n-api-client.ts:489`

```
const webhookClient = axios.create({
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/triggers/handlers/chat-handler.ts:127`

```
const response = await axios.request(config);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/triggers/handlers/form-handler.ts:420`

```
const response = await axios.request(config);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (212)
#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced critical→low: this match is in test code — tests/integration/docker/test-helpers.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/test-helpers.ts:54`

```
await exec(`docker image inspect ${DOCKER_TEST_IMAGE_NAME}`);
```

**Impact:** Enables arbitrary shell command execution with the process privileges. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/integration/docker/test-helpers.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/test-helpers.ts:72`

```
execSync(`docker build -t ${DOCKER_TEST_IMAGE_NAME} .`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:48`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:96`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:124`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:162`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:207`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:228`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:248`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:273`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:303`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:326`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:359`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:397`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:38`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:51`

```
const output2 = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:73`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:112`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:131`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}" 2>&1`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:147`

```
const output = execSync(`node "${parseConfigPath}" "${symlinkPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:160`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:189`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}" 2>&1`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:209`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:243`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:274`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:302`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:315`

```
const output2 = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:322`

```
const output3 = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:342`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:374`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, { encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:423`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:41`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:64`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:82`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:99`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:120`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:139`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:157`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:176`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:220`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:241`

```
const result = execSync(`node "${parseConfigPath}" "${nonExistentPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:252`

```
const result = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:263`

```
const result = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:282`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:303`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:328`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:345`

```
const output = execSync(`node "${parseConfigPath}" "${configPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:360`

```
const result = execSync(`node "${parseConfigPath}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:52`

```
const output = execSync(`"${mockEntrypointPath}" n8n-mcp serve`, { encoding: 'utf8', env: cleanEnv });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:91`

```
const output1 = execSync(`"${mockEntrypointPath}" node index.js`, { encoding: 'utf8', env: cleanEnv });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:96`

```
const output2 = execSync(`"${mockEntrypointPath}" n8n-mcp validate`, { encoding: 'utf8', env: cleanEnv });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:129`

```
const output = execSync(`"${mockEntrypointPath}" n8n-mcp serve`, { encoding: 'utf8', env: cleanEnv });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:152`

```
const output = execSync(`"${mockEntrypointPath}" n8n-mcp serve --port=8080`, { encoding: 'utf8', env: cleanEnv });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:199`

```
execSync(`"${mockEntrypointPath}" n8n-mcp serve`, { encoding: 'utf8', env: cleanEnv });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:257`

```
const output2 = execSync(`"${mockEntrypointPath}" n8n-mcp serve`, { encoding: 'utf8', env: cleanEnv });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — tests/integration/docker/test-helpers.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/test-helpers.ts:20`

```
await exec('docker --version');
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — tests/integration/docker/test-helpers.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/test-helpers.ts:102`

```
const { stdout } = await exec(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — tests/integration/docker/test-helpers.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/test-helpers.ts:124`

```
const { stdout } = await exec(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — tests/integration/docker/test-helpers.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/test-helpers.ts:139`

```
const { stdout } = await exec(
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/integration/database/test-utils.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/test-utils.ts:470`

```
const output = execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:72`

```
const result = execSync(tempScript, { encoding: 'utf8', env: cleanEnv });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:192`

```
const result = execSync(tempScript, { encoding: 'utf8', env: cleanEnv });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:411`

```
const result = execSync(evalTest, { shell: '/bin/sh', encoding: 'utf8' });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:203`

```
const result = execSync(tempScript, { encoding: 'utf8', env: cleanEnv });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:69`

```
const output = execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:170`

```
const output = execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:224`

```
const output = execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:249`

```
const output1 = execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:274`

```
const output = execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/node-specific-validators.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/node-specific-validators.test.ts:2573`

```
jsCode: 'const result = eval("1 + 1"); return [{json: {result}}];'
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/helpers/env-helpers.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/helpers/env-helpers.ts:46`

```
fs.unlinkSync(path.join(dataPath, file));
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/database/connection-management.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/connection-management.test.ts:189`

```
fs.unlinkSync(`${dbPath}-wal`);
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/database/connection-management.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/connection-management.test.ts:192`

```
fs.unlinkSync(`${dbPath}-shm`);
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/config-validator-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/config-validator-security.test.ts:64`

```
const result = eval(userInput);
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/node-specific-validators.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/node-specific-validators.test.ts:2580`

```
message: 'Avoid eval() - it\'s a security risk',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/node-specific-validators.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/node-specific-validators.test.ts:2588`

```
jsCode: 'const fn = new Function("return 1"); return [{json: {result: fn()}}];'
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/node-specific-validators.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/node-specific-validators.test.ts:3519`

```
const evalWarnings = context.warnings.filter(w => w.message.includes('Avoid eval()'));
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/node-specific-validators.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/node-specific-validators.test.ts:3541`

```
jsCode: 'const prompt = "Never call eval( or exec( in generated code";\nreturn [{json: {prompt}}];'
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/node-specific-validators.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/node-specific-validators.test.ts:3547`

```
w.message.includes('Avoid eval()') || w.message.includes('Avoid exec()'));
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/node-specific-validators.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/node-specific-validators.test.ts:3551`

```
it('should warn about eval() inside template-literal interpolation code', () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/node-specific-validators.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/node-specific-validators.test.ts:3555`

```
jsCode: 'const out = `result: ${eval(items[0].json.expr)}`;\nreturn [{json: {out}}];'
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/node-specific-validators.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/node-specific-validators.test.ts:3561`

```
message: expect.stringContaining('Avoid eval()')
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/services/node-specific-validators.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/node-specific-validators.test.ts:3574`

```
message: expect.stringContaining('Avoid eval()')
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/templates/template-repository-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/templates/template-repository-security.test.ts:310`

```
expect(prepareCall).not.toContain('eval(');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/templates/template-repository-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/templates/template-repository-security.test.ts:323`

```
expect(prepareCall).not.toContain('eval(');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — tests/unit/templates/template-repository-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/templates/template-repository-security.test.ts:451`

```
expect(prepareCall).not.toContain('eval(');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/database/connection-management.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/connection-management.test.ts:186`

```
fs.unlinkSync(dbPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/database/connection-management.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/connection-management.test.ts:246`

```
fs.unlinkSync(corruptPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/database/empty-database.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/empty-database.test.ts:36`

```
fs.unlinkSync(tempDbPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/database/sqljs-memory-leak.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/sqljs-memory-leak.test.ts:31`

```
await fs.unlink(tempDbPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/database/test-utils.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/test-utils.ts:185`

```
fs.unlinkSync(this.dbPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/database/test-utils.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/test-utils.ts:189`

```
if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/database/test-utils.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/test-utils.ts:190`

```
if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/docker/docker-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-config.test.ts:67`

```
fs.rmSync(tempDir, { recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/docker/docker-entrypoint.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-entrypoint.test.ts:101`

```
fs.rmSync(tempDir, { recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:26`

```
fs.rmSync(tempDir, { recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:19`

```
fs.rmSync(tempDir, { recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:28`

```
fs.rmSync(tempDir, { recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:25`

```
fs.rmSync(tempDir, { recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/unit/loaders/node-loader-optional-deps.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/loaders/node-loader-optional-deps.test.ts:81`

```
fs.rmSync(fixtureDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/unit/services/config-validator-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/config-validator-security.test.ts:267`

```
fs.unlinkSync('/etc/passwd');
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/unit/utils/database-utils.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/utils/database-utils.test.ts:265`

```
fs.unlinkSync(fixturePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/utils/database-utils.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/utils/database-utils.ts:96`

```
fs.unlinkSync(finalPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — tests/unit/bin-consistency.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/bin-consistency.test.ts:25`

```
const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf-8'));
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — tests/unit/bin-consistency.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/bin-consistency.test.ts:34`

```
const content = fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf-8');
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — tests/unit/services/config-validator-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/config-validator-security.test.ts:291`

```
const file = fs.readFileSync('../../../' + path);
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/integration/docker/docker-entrypoint.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-entrypoint.test.ts:402`

```
fs.writeFileSync(tokenFile, 'secret-token-from-file');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/comprehensive-extraction-test.js — which does not run as part of the MCP server.)

**Evidence:** `tests/comprehensive-extraction-test.js:438`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/comprehensive-extraction-test.js — which does not run as part of the MCP server.)

**Evidence:** `tests/comprehensive-extraction-test.js:450`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/helpers/env-helpers.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/helpers/env-helpers.ts:170`

```
fs.writeFileSync(snapshotPath, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration/database/connection-management.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/database/connection-management.test.ts:223`

```
fs.writeFileSync(corruptPath, 'This is not a valid SQLite database');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration/docker/docker-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-config.test.ts:88`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration/docker/docker-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-config.test.ts:120`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration/docker/docker-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-config.test.ts:165`

```
fs.writeFileSync(configPath, '{ invalid json }');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration/docker/docker-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-config.test.ts:245`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration/docker/docker-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-config.test.ts:295`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration/docker/docker-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-config.test.ts:320`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration/docker/docker-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-config.test.ts:378`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/integration/docker/docker-entrypoint.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/integration/docker/docker-entrypoint.test.ts:502`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/test-database-extraction.js — which does not run as part of the MCP server.)

**Evidence:** `tests/test-database-extraction.js:174`

```
await fs.writeFile(nodeFile, JSON.stringify(dbRecord, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/test-database-extraction.js — which does not run as part of the MCP server.)

**Evidence:** `tests/test-database-extraction.js:241`

```
await fs.writeFile(dbFile, JSON.stringify(dbData, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/test-database-extraction.js — which does not run as part of the MCP server.)

**Evidence:** `tests/test-database-extraction.js:254`

```
await fs.writeFile(sqlFile, sql);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/test-database-extraction.js — which does not run as part of the MCP server.)

**Evidence:** `tests/test-database-extraction.js:260`

```
await fs.writeFile(reportFile, JSON.stringify(results, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/test-storage-system.js — which does not run as part of the MCP server.)

**Evidence:** `tests/test-storage-system.js:109`

```
await fs.writeFile(exportFile, JSON.stringify(dbExport, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:47`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:69`

```
fs.writeFileSync(tempScript, testScript);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:94`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:122`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:160`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:189`

```
fs.writeFileSync(tempScript, testScript);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:205`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:226`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:246`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:271`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:301`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:324`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:357`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/config-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/config-security.test.ts:395`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:36`

```
fs.writeFileSync(configPath, configJson);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:50`

```
fs.writeFileSync(configPath, JSON.stringify(configWithNull));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:71`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:110`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:127`

```
fs.writeFileSync(configPath, '{"test": "value"}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:144`

```
fs.writeFileSync(actualConfig, '{"symlink_test": "value"}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:158`

```
fs.writeFileSync(configPath, JSON.stringify(largeConfig));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:188`

```
fs.writeFileSync(configPath, invalidJson);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:207`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:241`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:272`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:299`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:314`

```
fs.writeFileSync(configPath, JSON.stringify(deepConfig));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:321`

```
fs.writeFileSync(configPath, JSON.stringify(veryDeepConfig));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:339`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:372`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts:419`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:39`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:62`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:80`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:97`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:116`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:136`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:155`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:174`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:198`

```
fs.writeFileSync(tempScript, testScript);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:218`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:250`

```
fs.writeFileSync(configPath, '{ invalid json }');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:261`

```
fs.writeFileSync(configPath, '{}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:280`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:301`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:326`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/parse-config.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/parse-config.test.ts:343`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:34`

```
fs.writeFileSync(mockEntrypointPath, content, { mode: 0o755 });
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/docker/serve-command.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/serve-command.test.ts:109`

```
fs.writeFileSync(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/loaders/node-loader-optional-deps.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/loaders/node-loader-optional-deps.test.ts:24`

```
fs.writeFileSync(fullPath, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/unit/utils/database-utils.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/utils/database-utils.test.ts:252`

```
fs.writeFileSync(fixturePath, JSON.stringify(fixtures, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/unit/docker/edge-cases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/docker/edge-cases.test.ts`

```
, () => {
      const config = {
        // Various Unicode scenarios
        zero_width: "test\u200B\u200C\u200Dtest", // Zero-width characters
        bom: "\uFEFFtest", // Byte order mark
        s
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/unit/services/credential-scanner.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/services/credential-scanner.test.ts`

```
Bearer <redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/unit/telemetry/workflow-sanitizer.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/telemetry/workflow-sanitizer.test.ts`

```
);
      expect(out).not.toMatch(/sb_publishable_/);
      expect(out).toContain('[REDACTED_SUPABASE_KEY]');
    });

    it('redacts Supabase anon JWT', () => {
      const jwt =
        'eyJhbGciOiJ
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/unit/templates/template-repository-security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/unit/templates/template-repository-security.test.ts`

```

      const emojiAudience = '👩‍💻 developers';
      
      const stmt = new MockPreparedStatement('');
      stmt._setMockResults([]);
      mockAdapter.prepare = vi.fn().mockReturnValue(stmt);
   
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `scripts/http-bridge.js:15`

```
const AUTH_TOKEN = <redacted:secret> || process.argv[2];
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `scripts/mcp-http-client.js:14`

```
const authToken = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `scripts/test-multi-tenant-simple.ts:22`

```
N8N_API_KEY: <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `scripts/test-multi-tenant.ts:23`

```
N8N_API_KEY: <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/community/documentation-generator.ts:398`

```
const apiKey = <redacted:secret> || process.env.OPENAI_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/http-server-single-session.ts:450`

```
if (process.env.AUTH_TOKEN) {
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/http-server-single-session.ts:456`

```
if (process.env.AUTH_TOKEN_FILE) {
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/http-server.ts:52`

```
if (process.env.AUTH_TOKEN) {
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/http-server.ts:58`

```
if (process.env.AUTH_TOKEN_FILE) {
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/mcp/handlers-n8n-manager.ts:2053`

```
authTokenConfigured: <redacted:secret> || process.env.AUTH_TOKEN),
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/mcp/handlers-n8n-manager.ts:2218`

```
N8N_API_KEY: <redacted:secret> ? null : (process.env.N8N_API_KEY ? '***configured***' : null),
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/scripts/fetch-templates.ts:254`

```
if (!useLocal && !process.env.OPENAI_API_KEY) {
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/scripts/fetch-templates.ts:425`

```
apiKey: <redacted:secret> || 'not-needed',
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/http-server-auth.test.ts:127`

```
process.env.AUTH_TOKEN = '<redacted:secret>';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/http-server-auth.test.ts:128`

```
delete process.env.AUTH_TOKEN_FILE;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/integration/flexible-instance-config.test.ts:25`

```
const originalKey = process.env.N8N_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/integration/n8n-api/utils/credentials.ts:44`

```
const apiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/setup/test-env.ts:212`

```
key: process.env.N8N_API_KEY || 'test-api-key-12345',
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/setup/test-env.ts:226`

```
token: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/setup/test-env.ts:227`

```
mcpToken: <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/http-server/pre-auth-log-redaction.test.ts:183`

```
process.env.AUTH_TOKEN = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/http-server/ssrf-gate.test.ts:132`

```
process.env.AUTH_TOKEN = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/http-server/ssrf-gate.test.ts:390`

```
process.env.N8N_API_KEY = '<redacted:secret>';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/http-server-n8n-mode.test.ts:136`

```
process.env.AUTH_TOKEN = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/http-server-session-management.test.ts:186`

```
process.env.AUTH_TOKEN = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/http-server-session-management.test.ts:772`

```
process.env.AUTH_TOKEN_FILE = '<redacted:secret>';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/mcp/disabled-tools-additional.test.ts:48`

```
delete process.env.N8N_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/mcp/get-workflow-mode-dispatch.test.ts:42`

```
process.env.N8N_API_KEY = '<redacted:secret>';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/mcp/handlers-n8n-manager.test.ts:1600`

```
process.env.N8N_API_KEY = '<redacted:secret>';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/monitoring/cache-metrics.test.ts:50`

```
delete process.env.N8N_API_KEY;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/multi-tenant-integration.test.ts:254`

```
process.env.N8N_API_KEY = '<redacted:secret>';
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/services/config-validator-security.test.ts:363`

```
const apiKey = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/unit/services/config-validator-security.test.ts:364`

```
const dbPassword = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T14:23:26.583Z._
