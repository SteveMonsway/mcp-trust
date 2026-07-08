# MCP Trust Report: github:vinkius-labs/mcpfusion

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 39/100  
**Confidence:** 77%

**Source:** [github.com/vinkius-labs/mcpfusion](https://github.com/vinkius-labs/mcpfusion)

_Resolved ref: `2990dddf03976d599ea28f61a2adecc48847a899`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 39 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CODE-002, MCP-META-003, MCP-CODE-002

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
| metadata | 63 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (127)
### HIGH (11)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** high  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously.

**Evidence:** `packages/core/src/cli/commands/create.ts:133`

```
execSync('npm install', {
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `packages/oauth/src/TokenManager.ts:84`

```
execFileSync('icacls', [
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `packages/core/src/cli/commands/deploy.ts:60`

```
// eval( → (0,eval)( — indirect eval, same semantics, no \b word boundary match
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `packages/core/src/cli/commands/deploy.ts:62`

```
// new Function( → new (0,Function)( — same semantics
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `packages/core/src/introspection/EntitlementScanner.ts:22`

```
* 2. **Code evaluation detection** — Detects `eval()`,
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `packages/core/src/introspection/EntitlementScanner.ts:23`

```
*    `new Function()`, `vm` module, indirect eval, and other
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `packages/core/src/sandbox/SandboxGuard.ts:56`

```
// fail-fast for eval()/Function() — no security risk (empty Context),
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `packages/core/src/sandbox/SandboxGuard.ts:58`

```
{ pattern: /\beval\s*\(/, reason: 'eval() has no effect in the sandbox — use direct expressions instead.' },
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `packages/core/src/sandbox/SandboxGuard.ts:59`

```
{ pattern: /\bnew\s+Function\s*\(/, reason: 'new Function() has no effect in the sandbox — use direct expressions instead.' },
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/oauth/src/TokenManager.ts:230`

```
if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `packages/core/src/core/middleware/InputFirewall.ts`

```
\`\`json
${serialized}
\`\`\`

## What Constitutes Malicious Input
- Prompt injection: Instructions embedded in data fields (in any language)
- SQL injection: SQL fragments in string values
- Command 
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

### MEDIUM (8)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/oauth/src/TokenManager.ts:159`

```
fs.writeFileSync(this.tokenFilePath, JSON.stringify(data, null, 2), { mode: FILE_MODE });
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/oauth/src/TokenManager.ts:180`

```
fs.writeFileSync(this.pendingAuthFilePath, JSON.stringify(data, null, 2), { mode: FILE_MODE });
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code.

**Evidence:** `packages/core/src/server/autoDiscover.ts:223`

```
mod = require(filePath) as Record<string, unknown>;
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target.

**Evidence:** `packages/core/src/presenter/ResponseBuilder.ts`

```
)
     *     .build();
     * '''
     */
    llmHint(hint: string): this {
        this._hints.push(hint);
        return this;
    }

    /**
     * Append domain-level system rules to the response.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/core/src/cli/commands/deploy.ts:490`

```
res = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/core/src/cli/npm-registry.ts:100`

```
const res = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/n8n/src/N8nClient.ts:60`

```
const response = await fetch(webhookUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/yaml/src/cli/yaml.ts:313`

```
res = await fetch(url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (108)
#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/EntitlementScanner.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/EntitlementScanner.test.ts:69`

```
const source = `exec('ls -la');`;
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/EntitlementScanner.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/EntitlementScanner.test.ts:102`

```
exec('rm -rf /');
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/EntitlementScanner.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/EntitlementScanner.test.ts:368`

```
exec('echo test');
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceE2E.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceE2E.test.ts:802`

```
'exec("ls");',            // line 4
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceEvolutions.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceEvolutions.test.ts:166`

```
exec('ls -la', callback);`;
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceEvolutions.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceEvolutions.test.ts:228`

```
exec('rm -rf /');`;
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:400`

```
const source = `// child_process.exec('ls')`;
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:1834`

```
exec('rm -rf /');
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-001: child_process.exec usage
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses child_process.exec(), which runs a command through a shell and is prone to command injection. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:1845`

```
exec('deploy.sh');
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false, and validate against an allowlist.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/entitlementIntegration-bug93.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/entitlementIntegration-bug93.test.ts:65`

```
return execSync('ls').toString();
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/EntitlementScanner.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/EntitlementScanner.test.ts:369`

```
eval('1+1');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:412`

```
const source = `const result = eval('1+1');\nconst fn = new Function('return 42');`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2055`

```
const source = `const factory = new Function('a', 'b', 'return a + b');`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxGuard.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxGuard.test.ts:172`

```
const result = validateSandboxCode('(data) => eval("1+1")');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/cli/deployEdgeStub-bug151.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/cli/deployEdgeStub-bug151.test.ts:317`

```
[/\beval\s*\(/,                               'eval()'],
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/cli/deployEdgeStub-bug151.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/cli/deployEdgeStub-bug151.test.ts:318`

```
[/\bnew\s+Function\s*\(/,                     'new Function()'],
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/cli/deployEdgeStub-bug151.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/cli/deployEdgeStub-bug151.test.ts:340`

```
{ input: 'eval("code")',                   pattern: 'eval()' },
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/cli/deployEdgeStub-bug151.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/cli/deployEdgeStub-bug151.test.ts:341`

```
{ input: 'var x = eval (expr)',            pattern: 'eval()' },
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/cli/deployEdgeStub-bug151.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/cli/deployEdgeStub-bug151.test.ts:342`

```
{ input: 'new Function("return 1")',       pattern: 'new Function()' },
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/cli/deployEdgeStub-bug151.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/cli/deployEdgeStub-bug151.test.ts:370`

```
'eval("code");',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/cli/deployEdgeStub-bug151.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/cli/deployEdgeStub-bug151.test.ts:373`

```
'new Function("x");',
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/EntitlementScanner.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/EntitlementScanner.test.ts:87`

```
const source = `eval('console.log(1)');`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/EntitlementScanner.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/EntitlementScanner.test.ts:93`

```
const source = `new Function('return 1')();`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2042`

```
it('detects eval() as codeEvaluation', async () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2043`

```
const source = `const result = eval('require("child_process").exec("rm -rf /")');`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2048`

```
it('detects indirect eval (0, eval)()', async () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2054`

```
it('detects new Function()', async () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2109`

```
const source = `eval('x'); const fs = require('fs');`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2125`

```
const source = `const r = eval('1');`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2132`

```
const source = `const r = eval('1');`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2141`

```
const source = `eval('something');`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2153`

```
const source = `eval('safe');`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:2289`

```
const source = `const r = eval('payload');`;
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:5`

```
*   #139 — Guard now blocks eval()/new Function() at fail-fast level
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:28`

```
// Bug #139 — Guard blocks eval() / new Function()
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:31`

```
describe('Bug #139: Guard blocks eval() and new Function()', () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:32`

```
it('should reject eval() call', () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:33`

```
const result = validateSandboxCode('(data) => eval("data.length")');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:35`

```
expect(result.violation).toContain('eval()');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:39`

```
it('should reject new Function() call', () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:40`

```
const result = validateSandboxCode('(data) => new Function("return data")()');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:42`

```
expect(result.violation).toContain('new Function()');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:47`

```
// data.eval is a property access, not eval()
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:59`

```
const result = validateSandboxCode('(data) => eval  ("data")');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxBugs-139-142.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxBugs-139-142.test.ts:61`

```
expect(result.violation).toContain('eval()');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxEdgeCases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxEdgeCases.test.ts:114`

```
it('should prevent new Function() escape', async () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxEdgeCases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxEdgeCases.test.ts:117`

```
const fn = new Function('return typeof process !== "undefined" ? process.env : "blocked"');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxEdgeCases.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxEdgeCases.test.ts:220`

```
return eval('typeof process');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxGuard.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxGuard.test.ts:168`

```
it('should reject "eval()" in code (Bug #139 — fail-fast feedback for LLM)', () => {
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxGuard.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxGuard.test.ts:169`

```
// Bug #139: eval() is now blocked at the guard level for
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** low  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code. (Severity reduced high→low: this match is in test code — packages/core/tests/sandbox/SandboxGuard.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/sandbox/SandboxGuard.test.ts:174`

```
expect(result.violation).toContain('eval()');
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/core/tests/core/LowBugs-129-130-131.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/core/LowBugs-129-130-131.test.ts:48`

```
try { await fs.rm(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/core/tests/server/AutoDiscover.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/AutoDiscover.test.ts:20`

```
await fs.rm(tempDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/core/tests/server/autoDiscoverOrder-bug102.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/autoDiscoverOrder-bug102.test.ts:24`

```
try { await fs.rm(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/core/tests/server/autoDiscoverRouterDedup-bug129.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/autoDiscoverRouterDedup-bug129.test.ts:31`

```
try { await fs.rm(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/oauth/tests/TokenManager.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/oauth/tests/TokenManager.test.ts:51`

```
fs.rmSync(tmpDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/oauth/tests/TokenManagerPermissions.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/oauth/tests/TokenManagerPermissions.test.ts:26`

```
fs.rmSync(tmpDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/oauth/tests/createAuthTool.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/oauth/tests/createAuthTool.test.ts:44`

```
fs.rmSync(tmpDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/skills/tests/autoDiscoverSkills.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/skills/tests/autoDiscoverSkills.test.ts:20`

```
await fs.rm(testDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:732`

```
const source = `import fs from 'fs'; fs.readFileSync('file');`;
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/core/tests/server/AutoDiscover.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/AutoDiscover.test.ts:29`

```
await fs.writeFile(toolFile, `
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/oauth/tests/TokenManager.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/oauth/tests/TokenManager.test.ts:281`

```
fs.writeFileSync(path.join(dirPath, 'pending-auth.json'), 'not-json{{{');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/core/LowBugs-129-130-131.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/core/LowBugs-129-130-131.test.ts:54`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/core/LowBugs-129-130-131.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/core/LowBugs-129-130-131.test.ts:58`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/core/LowBugs-129-130-131.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/core/LowBugs-129-130-131.test.ts:73`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/core/LowBugs-129-130-131.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/core/LowBugs-129-130-131.test.ts:77`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/core/LowBugs-129-130-131.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/core/LowBugs-129-130-131.test.ts:94`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/core/LowBugs-129-130-131.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/core/LowBugs-129-130-131.test.ts:98`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/core/LowBugs-129-130-131.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/core/LowBugs-129-130-131.test.ts:115`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/introspection/GovernanceRobust.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/introspection/GovernanceRobust.test.ts:1823`

```
fs.writeFileSync('output.json', data);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/AutoDiscover.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/AutoDiscover.test.ts:45`

```
await fs.writeFile(join(tempDir, 'tool.test.ts'), 'export const x = 1;');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/AutoDiscover.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/AutoDiscover.test.ts:46`

```
await fs.writeFile(join(tempDir, 'tool.spec.ts'), 'export const x = 1;');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/AutoDiscover.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/AutoDiscover.test.ts:47`

```
await fs.writeFile(join(tempDir, 'types.d.ts'), 'export type X = string;');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/AutoDiscover.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/AutoDiscover.test.ts:59`

```
await fs.writeFile(join(tempDir, 'a.tool.js'), `
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/AutoDiscover.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/AutoDiscover.test.ts:62`

```
await fs.writeFile(join(tempDir, 'b.js'), `
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/AutoDiscover.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/AutoDiscover.test.ts:82`

```
await fs.writeFile(join(subDir, 'invoice.js'), `
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/AutoDiscover.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/AutoDiscover.test.ts:99`

```
await fs.writeFile(join(subDir, 'tool.js'), 'export const x = 1;');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/AutoDiscover.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/AutoDiscover.test.ts:121`

```
await fs.writeFile(join(tempDir, 'custom.js'), `
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/autoDiscoverOrder-bug102.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/autoDiscoverOrder-bug102.test.ts:31`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/autoDiscoverOrder-bug102.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/autoDiscoverOrder-bug102.test.ts:48`

```
await fs.writeFile(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/autoDiscoverRouterDedup-bug129.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/autoDiscoverRouterDedup-bug129.test.ts:44`

```
await fs.writeFile(join(tempDir, 'my_router.tool.mjs'), fileContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/autoDiscoverRouterDedup-bug129.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/autoDiscoverRouterDedup-bug129.test.ts:64`

```
await fs.writeFile(join(tempDir, 'shared.tool.mjs'), fileContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/autoDiscoverRouterDedup-bug129.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/autoDiscoverRouterDedup-bug129.test.ts:84`

```
await fs.writeFile(join(tempDir, 'issues_queries.tool.mjs'), queryFile);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/core/tests/server/autoDiscoverRouterDedup-bug129.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/server/autoDiscoverRouterDedup-bug129.test.ts:85`

```
await fs.writeFile(join(tempDir, 'issues_mutations.tool.mjs'), mutationFile);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/skills/tests/autoDiscoverSkills.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/skills/tests/autoDiscoverSkills.test.ts:26`

```
await fs.writeFile(join(skillDir, 'SKILL.md'), content, 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/skills/tests/autoDiscoverSkills.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/skills/tests/autoDiscoverSkills.test.ts:32`

```
await fs.writeFile(fullPath, body, 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/skills/tests/autoDiscoverSkills.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/skills/tests/autoDiscoverSkills.test.ts:95`

```
await fs.writeFile(join(invalidDir, 'SKILL.md'), 'No frontmatter here', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/skills/tests/autoDiscoverSkills.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/skills/tests/autoDiscoverSkills.test.ts:106`

```
await fs.writeFile(join(invalidDir, 'SKILL.md'), 'No frontmatter', 'utf-8');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — packages/core/tests/handoff/DelegationToken.security.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/core/tests/handoff/DelegationToken.security.test.ts`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/src/cli/commands/deploy.ts:168`

```
const token = <redacted:secret> ?? process.env['MCPFUSION_DEPLOY_TOKEN'] ?? rc.token;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/src/cli/commands/doctor.ts:94`

```
const token = <redacted:secret> ?? process.env['MCPFUSION_DEPLOY_TOKEN'];
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/src/cli/commands/token.ts:59`

```
const envToken = <redacted:secret>'MCPFUSION_DEPLOY_TOKEN'];
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/src/cli/templates/vectors/oauth.ts:26`

```
const tokenEndpoint = <redacted:secret>'OAUTH_TOKEN_ENDPOINT'];
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/src/cli/templates/vectors/workflow.ts:26`

```
"    const apiKey = <redacted:secret>'N8N_API_KEY'];",
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/src/handoff/HandoffStateStore.ts:34`

```
*     delegationSecret: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/src/handoff/middleware.ts:13`

```
*     .use(requireGatewayClearance(process.env.MCPFUSION_DELEGATION_SECRET!))
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/src/server/ServerAttachment.ts:305`

```
*         secret: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/src/server/ServerAttachment.ts:439`

```
*         delegationSecret: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/tests/cli/create.e2e.test.ts:699`

```
expect(n8n).toContain("process.env['N8N_API_KEY']");
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/tests/cli/create.test.ts:831`

```
expect(content).toContain("process.env['N8N_API_KEY']");
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/core/tests/cli/doctor.test.ts:67`

```
delete process.env['MCPFUSION_DEPLOY_TOKEN'];
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/jwt/src/createJwtAuthTool.ts:12`

```
*     secret: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/jwt/src/middleware.ts:13`

```
*     .use(requireJwt({ secret: <redacted:secret> }))
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/openapi/src/emitter/CodeEmitter.ts:466`

```
lines.push(`            ...(process.env['API_KEY'] ? { 'Authorization': \`Bearer \${process.env['API_KEY']}\` } : {}),`);
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/openapi/tests/emitter/CodeEmitter.test.ts:330`

```
expect(server.content).toContain("process.env['API_KEY']");
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/swarm/src/SwarmGateway.ts:97`

```
*     delegationSecret: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/swarm/src/index.ts:15`

```
*     delegationSecret: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/yaml/src/cli/yaml.ts:253`

```
let token = <redacted:secret> ?? process.env['MCPFUSION_DEPLOY_TOKEN'];
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:51:51.232Z._
