# MCP Trust Report: github:getdatanaut/openmcp

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 32/100  
**Confidence:** 71%

_Resolved ref: `4d09956b60e113e6e61d492dfce0938d751cf819`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## Decision Reasons
- Overall score 32 falls in MEDIUM band

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
| code | 96 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 0 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (12)
### HIGH (1)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/cli/tsup.config.ts:45`

```
await fs.rm(join(import.meta.dirname, 'dist'), { force: true, recursive: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (4)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/cli/src/commands/install/openapi/create-remix.ts:20`

```
await fs.writeFile(filepath, JSON.stringify(remix, null, 2));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/cli/src/libs/mcp-clients/config/write.ts:33`

```
await ctx.fs.writeFile(resolvedConfigPath, serializeDocument(config, 'json'));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/cli/src/libs/mcp-clients/config/write.ts:35`

```
await ctx.fs.writeFile(resolvedConfigPath, serializeDocument(config, 'yaml'));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `packages/utils/src/documents/read.ts:58`

```
const res = await fetch(url);
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (6)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — packages/cli/src/libs/remix/config/__tests__/load.spec.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/cli/src/libs/remix/config/__tests__/load.spec.ts:223`

```
await fs.rm(tmpDir, { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — packages/cli/src/libs/openapi/__tests__/list-tools.spec.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/cli/src/libs/openapi/__tests__/list-tools.spec.ts:270`

```
const document = JSON.parse(await fs.readFile(path.join(import.meta.dirname, './fixtures', filename), 'utf8'));
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-005: Arbitrary filesystem read
**Severity:** low  **Confidence:** 75%  **Category:** code

Reads files using a dynamically constructed path, allowing reads outside the intended scope. (Severity reduced medium→low: this match is in test code — packages/utils/src/documents/__tests__/read.spec.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/utils/src/documents/__tests__/read.spec.ts:159`

```
readFile: async (path, encoding) => fs.readFile(path, encoding),
```

**Impact:** A caller-controlled path can read sensitive files via path traversal. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Resolve and validate paths against an allowlisted base directory before reading.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/cli/src/libs/remix/config/__tests__/load.spec.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/cli/src/libs/remix/config/__tests__/load.spec.ts:71`

```
await fs.writeFile(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — packages/cli/src/libs/remix/config/__tests__/load.spec.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/cli/src/libs/remix/config/__tests__/load.spec.ts:97`

```
await fs.writeFile(configPath, JSON.stringify(config));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-JS-002: Dynamic module load (require with non-literal path)
**Severity:** low  **Confidence:** 70%  **Category:** code

A caller-controlled module path can load and execute arbitrary code. (Severity reduced medium→low: this match is in test code — packages/openapi/__tests__/index.test.ts — which does not run as part of the MCP server.)

**Evidence:** `packages/openapi/__tests__/index.test.ts:15`

```
return [file, require(`${fixtureDir}/${file}`)];
```

**Impact:** A caller-controlled module path can load and execute arbitrary code.

**Remediation:** Require modules by static string literals; never require a computed path.

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

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:51:38.617Z._
