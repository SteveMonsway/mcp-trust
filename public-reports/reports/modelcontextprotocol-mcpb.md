# MCP Trust Report: github:modelcontextprotocol/mcpb

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 33/100  
**Confidence:** 77%

**Source:** [github.com/modelcontextprotocol/mcpb](https://github.com/modelcontextprotocol/mcpb)

_Resolved ref: `70fe3b34cd6dff1b3bba046638edc72a6467a4fb`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## ⚠️ Limitations
- Additionally, Rust source is present but was NOT analyzed — MCP Trust has code rules for JavaScript, TypeScript and Python only. Absence of code findings does not imply this server is safe.

## Decision Reasons
- Overall score 33 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002, MCP-CODE-002

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

## Findings (139)
### HIGH (2)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `src/cli/cli.ts:32`

```
execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/node/validate.ts:501`

```
await fs.rm(tmpDir, {
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (4)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/build-mcpb-schema.js:33`

```
await fs.writeFile(filePath, JSON.stringify(jsonSchema, null, 2), {
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/build-mcpb-schema.js:43`

```
await fs.writeFile(filePath, JSON.stringify(jsonSchema, null, 2), {
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/create-dev-version.js:29`

```
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + "\n");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/node/validate.ts:445`

```
await fs.writeFile(manifestPath, JSON.stringify(result.data, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### LOW (132)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:25`

```
const result = execSync(`node ${cliPath} validate ${validManifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:33`

```
execSync(`node ${cliPath} validate ${invalidManifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:41`

```
execSync(`node ${cliPath}`, { encoding: "utf-8", stdio: "pipe" });
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:53`

```
execSync(`node ${cliPath} validate /non/existent/file.json`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:69`

```
execSync(`node ${cliPath} validate ${invalidJsonPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:134`

```
const result = execSync(`node ${cliPath} validate ${manifestWithIcon}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:161`

```
const result = execSync(`node ${cliPath} validate ${manifestWithUrl}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:218`

```
execSync(`node ${cliPath} pack ${tempDir} ${packedFilePath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:225`

```
execSync(`node ${cliPath} unpack ${packedFilePath} ${unpackedDir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:397`

```
execSync(`node ${cliPath} pack ${tempExecDir} ${execPackedFilePath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:486`

```
execSync(`node ${cliPath} pack ${tempBinDir} ${binPackedFilePath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:166`

```
const result = execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:176`

```
const result = execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:189`

```
const result = execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:208`

```
execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:215`

```
execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:232`

```
execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:239`

```
execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:255`

```
execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:262`

```
execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:278`

```
execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:285`

```
execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:324`

```
const result = execSync(`node ${cliPath} validate ${manifestPath}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:67`

```
execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:74`

```
execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:97`

```
const result = execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:123`

```
execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:130`

```
execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:158`

```
const result = execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:183`

```
execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:190`

```
execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:219`

```
execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:226`

```
execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:258`

```
const result = execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:298`

```
execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:305`

```
execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:326`

```
const result = execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:343`

```
const result = execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:360`

```
const result = execSync(`node ${cliPath} validate ${dir}`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:21`

```
execSync("yarn build", { cwd: join(__dirname, "..") });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:178`

```
execSync("yarn build", { cwd: join(__dirname, "..") });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:299`

```
const result = execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:323`

```
execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:330`

```
execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:402`

```
execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:491`

```
execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:11`

```
execSync("yarn build", { cwd: join(__dirname, "..") });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:45`

```
execSync("yarn build", { cwd: join(__dirname, "..") });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:80`

```
fs.unlinkSync(invalidJsonPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:111`

```
fs.rmSync(testDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:210`

```
fs.rmSync(tempDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:211`

```
fs.rmSync(unpackedDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:213`

```
fs.unlinkSync(packedFilePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:307`

```
fs.rmSync(projectDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:308`

```
fs.rmSync(manifestDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:310`

```
fs.unlinkSync(manifestPackedPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:342`

```
fs.rmSync(projectDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:431`

```
fs.rmSync(tempExecDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:432`

```
fs.rmSync(execUnpackedDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:434`

```
fs.unlinkSync(execPackedFilePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:508`

```
fs.rmSync(tempBinDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:509`

```
fs.rmSync(binUnpackedDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:511`

```
fs.unlinkSync(binPackedFilePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:133`

```
fs.rmSync(testFixturesDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:23`

```
fs.rmSync(tempDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:348`

```
fs.unlinkSync(testFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:371`

```
fs.unlinkSync(testFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:396`

```
fs.unlinkSync(testFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:427`

```
fs.unlinkSync(testFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:446`

```
fs.rmSync(TEST_DIR, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:515`

```
fs.unlinkSync(testFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:48`

```
fs.rmSync(fixturesDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:55`

```
fs.rmSync(fixturesDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:134`

```
fs.writeFileSync(path.join(testStructure, "manifest.json"), "{}");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:139`

```
fs.writeFileSync(path.join(testStructure, "tests/test.js"), "test()");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:144`

```
fs.writeFileSync(path.join(testStructure, "logs/debug.log"), "log");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:145`

```
fs.writeFileSync(path.join(testStructure, "debug.log"), "log");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:184`

```
fs.writeFileSync(path.join(testStructure, ".gitignore"), "ignore");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:66`

```
fs.writeFileSync(invalidJsonPath, "{ invalid json }");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:101`

```
fs.writeFileSync(join(testDir, "icon.png"), validPngBuffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:105`

```
fs.writeFileSync(join(testDir, "server", "index.js"), "// fixture");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:117`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:144`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:181`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:200`

```
fs.writeFileSync(join(tempDir, "file1.txt"), "hello");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:202`

```
fs.writeFileSync(join(tempDir, "subdir", "file2.txt"), "world");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:205`

```
fs.writeFileSync(join(tempDir, "server", "index.js"), "// fixture");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:276`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:283`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:320`

```
fs.writeFileSync(join(projectDir, "index.js"), "console.log('hello');");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:359`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:381`

```
fs.writeFileSync(join(tempExecDir, "server", "index.js"), "// fixture");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:385`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:393`

```
fs.writeFileSync(regularFile, "regular content");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:454`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:475`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/cli.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/cli.test.ts:482`

```
fs.writeFileSync(join(tempBinDir, "config.json"), "{}");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:88`

```
fs.writeFileSync(join(testFixturesDir, "valid-icon.png"), validPngBuffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:91`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:98`

```
fs.writeFileSync(join(testFixturesDir, "server", "index.js"), "// fixture");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:157`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/icon-validation.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/icon-validation.test.ts:314`

```
fs.writeFileSync(join(assetsDir, "icon.png"), validPngBuffer);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:37`

```
fs.writeFileSync(mcpbIgnorePath, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:51`

```
fs.writeFileSync(mcpbIgnorePath, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:61`

```
fs.writeFileSync(mcpbIgnorePath, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:69`

```
fs.writeFileSync(mcpbIgnorePath, content);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:135`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:140`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:153`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/mcpbignore.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/mcpbignore.test.ts:178`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:85`

```
fs.writeFileSync(SELF_SIGNED_CERT, forge.pki.certificateToPem(cert));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:86`

```
fs.writeFileSync(SELF_SIGNED_KEY, forge.pki.privateKeyToPem(keys.privateKey));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:168`

```
fs.writeFileSync(CA_CERT, forge.pki.certificateToPem(caCert));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:169`

```
fs.writeFileSync(CA_KEY, forge.pki.privateKeyToPem(caKeys.privateKey));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:170`

```
fs.writeFileSync(SIGNED_CERT, forge.pki.certificateToPem(cert));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:171`

```
fs.writeFileSync(SIGNED_KEY, forge.pki.privateKeyToPem(keys.privateKey));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:325`

```
fs.writeFileSync(TEST_MCPB, zipContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/sign.e2e.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/sign.e2e.test.ts:389`

```
fs.writeFileSync(testFile, tamperedContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:38`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:88`

```
fs.writeFileSync(join(dir, "server", "main.py"), "print('hello')");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:112`

```
fs.writeFileSync(join(dir, "myserver"), "#!/bin/sh\necho hi");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:148`

```
fs.writeFileSync(join(dir, "myserver"), "#!/bin/sh\necho hi");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:170`

```
fs.writeFileSync(join(dir, "server", "index.js"), "// fixture");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:205`

```
fs.writeFileSync(join(dir, "server", "index.js"), "// fixture");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:241`

```
fs.writeFileSync(join(dir, "server", "index.js"), "// fixture");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:269`

```
fs.writeFileSync(join(dir, "server", "index.js"), "// fixture");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:292`

```
fs.writeFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:322`

```
fs.writeFileSync(join(dir, "server", "index.js"), "// fixture");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:323`

```
fs.writeFileSync(join(dir, "credentials.json"), '{"secret": "value"}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:339`

```
fs.writeFileSync(join(dir, "server", "index.js"), "// fixture");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:340`

```
fs.writeFileSync(join(dir, "server.pem"), "--- CERT ---");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — test/validate.test.ts — which does not run as part of the MCP server.)

**Evidence:** `test/validate.test.ts:357`

```
fs.writeFileSync(join(dir, "server", "index.js"), "// server code");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

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
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:49:25.010Z._
