# MCP Trust Report: github:modelcontextprotocol/servers/src/memory

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 35/100  
**Confidence:** 64%

_Resolved ref: `d31124c982401739917fd817c2a59db344529c16`_

## Executive Summary
This MCP server may be used with restrictions (sandboxing, least privilege, scoped access).

## Decision Reasons
- Overall score 35 falls in MEDIUM band

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
| code | 78 |
| config | _not assessed_ |
| supplyChain | 20 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 42 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (10)
### HIGH (1)
#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** high  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently").

**Evidence:** `index.ts`

```
 in error && (error as any).code === "ENOENT") {
        return { entities: [], relations: [] };
      }
      throw error;
    }
  }

  private async saveGraph(graph: KnowledgeGraph): Promise<void> {
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

### MEDIUM (1)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `index.ts:117`

```
await fs.writeFile(this.memoryFilePath, lines.join("\n"));
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### LOW (8)
#### MCP-SUPPLY-005: No security policy (SECURITY.md) found
**Severity:** low  **Confidence:** 100%  **Category:** supply_chain

The project does not provide a security policy, indicating weaker security maturity/disclosure process.

**Evidence:** `repo.files`

```
no SECURITY.md found in source
```

**Impact:** Absence of a disclosure process slows remediation of future vulnerabilities.

**Remediation:** Prefer projects that publish a SECURITY.md with a vulnerability disclosure process.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/file-path.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/file-path.test.ts:31`

```
await fs.unlink(oldMemoryPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/file-path.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/file-path.test.ts:36`

```
await fs.unlink(newMemoryPath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→low: this match is in test code — __tests__/knowledge-graph.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/knowledge-graph.test.ts:23`

```
await fs.unlink(testFilePath);
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/file-path.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/file-path.test.ts:86`

```
await fs.writeFile(oldMemoryPath, '{"test":"data"}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/file-path.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/file-path.test.ts:114`

```
await fs.writeFile(oldMemoryPath, '{"old":"data"}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/file-path.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/file-path.test.ts:115`

```
await fs.writeFile(newMemoryPath, '{"new":"data"}');
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** low  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced medium→low: this match is in test code — __tests__/file-path.test.ts — which does not run as part of the MCP server.)

**Evidence:** `__tests__/file-path.test.ts:138`

```
await fs.writeFile(oldMemoryPath, testContent);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.0 at 2026-07-08T09:54:25.634Z._
