# MCP Trust Report: github:QuantGeekDev/mcp-framework

**Decision:** BLOCK  
**Risk:** MEDIUM  
**Score:** 37/100  
**Confidence:** 76%

_Resolved ref: `ead9c4bbcd5fd098e80ccf64758bd6bf43234f90`_

## Executive Summary
The scanner found **high-confidence capability evidence in the server’s runtime code** (e.g. command execution). Review the flagged findings below before connecting this server to an agent. **A BLOCK is a "review required", not proof the server is malicious** — the evidence may be legitimate by design (see Decision Reasons).

## Decision Reasons
- Overall score 37 falls in MEDIUM band
- Critical finding with high confidence: MCP-CODE-002

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
| metadata | 49 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (82)
### CRITICAL (1)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** critical  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/cli/index.ts:17`

```
const result = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

### HIGH (3)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/cli/project/create.ts:356`

```
const gitInit = spawnSync('git', ['init'], {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/cli/project/create.ts:368`

```
const npmInstall = spawnSync('npm', ['install'], {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `src/cli/project/create.ts`

```
import { MCPServer, OAuthAuthProvider } from "mcp-framework";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required OAuth environment variables
const requi
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

### MEDIUM (4)
#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/auth/validators/introspection-validator.ts:88`

```
const response = await fetch(this.config.endpoint, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/prompts/BasePrompt.ts:115`

```
const response = await fetch(url, init);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/resources/BaseResource.ts:99`

```
const response = await fetch(url, init);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/tools/BaseTool.ts:1098`

```
const response = await fetch(url, init);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (73)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:64`

```
execSync(`rm -rf "${testBaseDir}"`, { stdio: 'ignore' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/loaders/promptLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/promptLoader.test.ts:20`

```
execSync(`rm -rf "${testBaseDir}"`, { stdio: 'ignore' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/loaders/resourceLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/resourceLoader.test.ts:20`

```
execSync(`rm -rf "${testBaseDir}"`, { stdio: 'ignore' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — tests/loaders/toolLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/toolLoader.test.ts:24`

```
execSync(`rm -rf "${testBaseDir}"`, { stdio: 'ignore' });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in documentation code — packages/docs/src/cli/create-docs-mcp.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/docs/src/cli/create-docs-mcp.ts:60`

```
spawnSync('git', ['init'], { cwd: projectDir, stdio: 'inherit', shell: true });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in documentation code — packages/docs/src/cli/create-docs-mcp.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/docs/src/cli/create-docs-mcp.ts:64`

```
const install = spawnSync('npm', ['install'], {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in documentation code — packages/docs/src/cli/create-docs-mcp.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/docs/src/cli/create-docs-mcp.ts:75`

```
spawnSync('npx', ['tsc'], { cwd: projectDir, stdio: 'inherit', shell: true });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in documentation code — packages/docs/src/cli/create-docs-server.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/docs/src/cli/create-docs-server.ts:60`

```
spawnSync('git', ['init'], { cwd: projectDir, stdio: 'inherit', shell: true });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in documentation code — packages/docs/src/cli/create-docs-server.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/docs/src/cli/create-docs-server.ts:64`

```
const install = spawnSync('npm', ['install'], {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in documentation code — packages/docs/src/cli/create-docs-server.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/docs/src/cli/create-docs-server.ts:75`

```
spawnSync('npx', ['tsc'], { cwd: projectDir, stdio: 'inherit', shell: true });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:66`

```
await fs.rm(testBaseDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:18`

```
await fs.rm(testDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/loaders/promptLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/promptLoader.test.ts:22`

```
await fs.rm(testBaseDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/loaders/resourceLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/resourceLoader.test.ts:22`

```
await fs.rm(testBaseDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/loaders/toolLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/toolLoader.test.ts:26`

```
await fs.rm(testBaseDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:88`

```
await fs.writeFile(filePath, itemContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:178`

```
await fs.writeFile(join(testItemsDir, 'BaseTestItem.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:179`

```
await fs.writeFile(join(testItemsDir, 'TestItem.test.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:180`

```
await fs.writeFile(join(testItemsDir, 'TestItem.spec.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:191`

```
await fs.writeFile(join(testItemsDir, 'InvalidItem.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:202`

```
await fs.writeFile(join(testItemsDir, 'NoExport.js'), 'const x = 1;');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:213`

```
await fs.writeFile(join(testItemsDir, 'SyntaxError.js'), 'this is not valid javascript');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:235`

```
await fs.writeFile(join(testItemsDir, 'DefaultExport.js'), itemContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:253`

```
await fs.writeFile(join(testItemsDir, 'FunctionExport.js'), itemContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/BaseLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/BaseLoader.test.ts:273`

```
await fs.writeFile(join(testItemsDir, 'NamedExport.js'), itemContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:27`

```
await fs.writeFile(join(testDir, 'tool1.js'), 'export default class Tool1 {}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:28`

```
await fs.writeFile(join(testDir, 'tool2.js'), 'export default class Tool2 {}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:29`

```
await fs.writeFile(join(testDir, 'README.md'), 'Some readme');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:50`

```
await fs.writeFile(join(testDir, 'rootTool.js'), 'export default class RootTool {}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:51`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:55`

```
await fs.writeFile(join(subCategoryDir, 'deepTool.js'), 'export default class DeepTool {}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:69`

```
await fs.writeFile(join(testDir, 'validTool.js'), 'export default class ValidTool {}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:70`

```
await fs.writeFile(join(testDir, 'BaseTool.js'), 'export default class BaseTool {}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:71`

```
await fs.writeFile(join(testDir, 'tool.test.js'), 'test file');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:72`

```
await fs.writeFile(join(testDir, 'another.spec.js'), 'spec file');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:87`

```
await fs.writeFile(join(testDir, 'tool.js'), 'js file');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:88`

```
await fs.writeFile(join(testDir, 'tool.ts'), 'ts file');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:89`

```
await fs.writeFile(join(testDir, 'tool.py'), 'python file');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:111`

```
await fs.writeFile(filePath, 'some content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:126`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:149`

```
await fs.writeFile(join(subDir, 'tool.js'), 'export default class Tool {}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:163`

```
await fs.writeFile(join(testDir, 'tool.js'), 'export default class Tool {}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:175`

```
await fs.writeFile(join(subDir, 'tool.js'), 'export default class Tool {}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:185`

```
await fs.writeFile(join(testDir, 'README.md'), 'readme');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:195`

```
await fs.writeFile(join(testDir, 'BaseTool.js'), 'base tool');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/fileDiscovery.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/fileDiscovery.test.ts:196`

```
await fs.writeFile(join(testDir, 'tool.test.js'), 'test file');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/promptLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/promptLoader.test.ts:51`

```
await fs.writeFile(filePath, promptContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/promptLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/promptLoader.test.ts:112`

```
await fs.writeFile(join(promptsDir, 'BasePrompt.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/promptLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/promptLoader.test.ts:113`

```
await fs.writeFile(join(promptsDir, 'TestPrompt.test.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/promptLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/promptLoader.test.ts:114`

```
await fs.writeFile(join(promptsDir, 'TestPrompt.spec.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/promptLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/promptLoader.test.ts:125`

```
await fs.writeFile(join(promptsDir, 'InvalidPrompt.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/promptLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/promptLoader.test.ts:181`

```
await fs.writeFile(join(promptsDir, 'ValidPrompt.js'), validPromptContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/promptLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/promptLoader.test.ts:182`

```
await fs.writeFile(join(promptsDir, 'InvalidPrompt.js'), invalidPromptContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/resourceLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/resourceLoader.test.ts:55`

```
await fs.writeFile(filePath, resourceContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/resourceLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/resourceLoader.test.ts:116`

```
await fs.writeFile(join(resourcesDir, 'BaseResource.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/resourceLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/resourceLoader.test.ts:117`

```
await fs.writeFile(join(resourcesDir, 'TestResource.test.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/resourceLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/resourceLoader.test.ts:118`

```
await fs.writeFile(join(resourcesDir, 'TestResource.spec.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/resourceLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/resourceLoader.test.ts:129`

```
await fs.writeFile(join(resourcesDir, 'InvalidResource.js'), 'module.exports = {};');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/resourceLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/resourceLoader.test.ts:189`

```
await fs.writeFile(join(resourcesDir, 'ValidResource.js'), validResourceContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/resourceLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/resourceLoader.test.ts:190`

```
await fs.writeFile(join(resourcesDir, 'InvalidResource.js'), invalidResourceContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/toolLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/toolLoader.test.ts:70`

```
await fs.writeFile(filePath, toolContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/toolLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/toolLoader.test.ts:161`

```
await fs.writeFile(join(toolsDir, 'BaseTool.js'), 'base tool content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/toolLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/toolLoader.test.ts:162`

```
await fs.writeFile(join(toolsDir, 'SomeTool.test.js'), 'test content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/toolLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/toolLoader.test.ts:163`

```
await fs.writeFile(join(toolsDir, 'AnotherTool.spec.js'), 'spec content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/toolLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/toolLoader.test.ts:171`

```
await fs.writeFile(join(subDir, 'nested.test.js'), 'nested test content');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — tests/loaders/toolLoader.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/loaders/toolLoader.test.ts:222`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `examples/oauth-cognito-example.ts:19`

```
const COGNITO_CLIENT_SECRET = <redacted:secret> // Optional for public clients
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `examples/oauth-custom-validator.ts:128`

```
clientSecret: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `examples/oauth-server/src/index.ts:59`

```
clientSecret: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→low: this match is in example/sample code — examples/oauth-server/src/index.ts — which does not run as part of the MCP server.)

**Evidence:** `examples/oauth-server/src/index.ts`

```
Please copy .env.example to .env and configure your OAuth provider
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in documentation code — packages/docs/src/sources/fumadocs-remote.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/docs/src/sources/fumadocs-remote.ts:68`

```
const response = await fetch(url, { headers: this.headers });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in documentation code — packages/docs/src/sources/llms-txt.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/docs/src/sources/llms-txt.ts:133`

```
const response = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in documentation code — packages/docs/src/sources/llms-txt.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/docs/src/sources/llms-txt.ts:360`

```
const response = await fetch(url, { headers: this.headers });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

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

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:08.694Z._
