# MCP Trust Report: github:Flux159/mcp-server-kubernetes

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 39/100  
**Confidence:** 76%

**Source:** [github.com/Flux159/mcp-server-kubernetes](https://github.com/Flux159/mcp-server-kubernetes)

_Resolved ref: `662a19193fa79de1e4fa4f53faa25191c41481dc`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 39 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-META-003, MCP-META-003, MCP-CODE-002

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
| metadata | 71 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (30)
### HIGH (4)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `src/security/kubectl-flags.ts:173`

```
return execFileSync(file, args, options) as string;
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/kubernetes-manager.ts:377`

```
fs.unlinkSync(tempKubeconfigPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `src/security/kubectl-flags.ts`

```
s tool arguments (e.g. via indirect prompt injection in pod logs)
// exfiltrate the operator
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination.

**Evidence:** `src/security/kubectl-flags.ts`

```
would allow exfiltration of the operator's bearer token. If you 
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

### MEDIUM (18)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/port_forward.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/port_forward.ts:10`

```
const process = spawn("kubectl", args);
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-apply.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-apply.ts:110`

```
fs.unlinkSync(tempFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-apply.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-apply.ts:128`

```
fs.unlinkSync(tempFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-create.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-create.ts:437`

```
fs.unlinkSync(tempFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-create.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-create.ts:455`

```
fs.unlinkSync(tempFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-delete.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-delete.ts:168`

```
fs.unlinkSync(tempFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-delete.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-delete.ts:186`

```
fs.unlinkSync(tempFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-patch.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-patch.ts:140`

```
fs.unlinkSync(tempFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-patch.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-patch.ts:158`

```
fs.unlinkSync(tempFile);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-apply.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-apply.ts:75`

```
fs.writeFileSync(tempFile, input.manifest);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-create.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-create.ts:240`

```
fs.writeFileSync(tempFile, input.manifest);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-delete.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-delete.ts:114`

```
fs.writeFileSync(tempFile, input.manifest);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 75%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — src/tools/kubectl-patch.ts — which does not run as part of the MCP server.)

**Evidence:** `src/tools/kubectl-patch.ts:113`

```
fs.writeFileSync(tempFile, JSON.stringify(input.patchData));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/kubernetes-manager.ts:365`

```
fs.writeFileSync(tempKubeconfigPath, kubeconfigYaml, {
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/utils/auth.ts:86`

```
return !!process.env.MCP_AUTH_TOKEN;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/utils/kubernetes-manager.ts:143`

```
process.env.K8S_TOKEN.trim()
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/utils/kubernetes-manager.ts:178`

```
if (!process.env.K8S_SERVER || !process.env.K8S_TOKEN) {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `src/utils/kubernetes-manager.ts:197`

```
token: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

### LOW (8)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** low  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→low: this match is in test code — tests/helm.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/helm.test.ts:13`

```
execSync("helm version", { stdio: "ignore" });
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — tests/helm.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/helm.test.ts:145`

```
fs.unlinkSync("test-nginx-values.yaml");
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/kubectl-get-secrets.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/kubectl-get-secrets.test.ts`

```

apiVersion: v1
kind: Secret
metadata:
  name: test-masking-secret
  namespace: default
type: Opaque
data:
  username: dGVzdC11c2VybmFtZQ==
  password: <redacted:secret>
  config: ewogICJkYjpuYW1lI
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/tools/kubectl-get.ts:166`

```
process.env.MASK_SECRETS !== "false" &&
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/utils/auth.ts:30`

```
const authToken = <redacted:secret>
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/utils/kubernetes-manager.ts:142`

```
process.env.K8S_TOKEN &&
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/auth.test.ts:28`

```
const originalEnv = process.env.MCP_AUTH_TOKEN;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/kubernetes-manager.test.ts:87`

```
delete process.env.K8S_TOKEN;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:49:42.689Z._
