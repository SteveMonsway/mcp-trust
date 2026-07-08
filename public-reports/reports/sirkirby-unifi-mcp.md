# MCP Trust Report: github:sirkirby/unifi-mcp

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 47/100  
**Confidence:** 81%

_Resolved ref: `ffb4488eae5790c16677c134ff45584c4e616113`_

## Executive Summary
The scanner found **notable capabilities or patterns worth a human look** (listed under Decision Reasons and Findings). **This is not a rejection** — read the specific findings and decide based on your threat model. Many are expected for what the server does (e.g. network access for a fetch server).

## Decision Reasons
- Overall score 47 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005, MCP-CONFIG-005

## Coverage
| Check | State |
|---|---|
| configScan | completed |
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
| config | 100 |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 12 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (80)
### HIGH (40)
#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `apps/worker/src/lib/wrangler.mjs:79`

```
const child = spawn("wrangler", ["secret", "put", secretName, "--name", workerName], {
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-SG-JS-001: Shell command execution (child_process.exec/execSync)
**Severity:** high  **Confidence:** 90%  **Category:** code

Enables arbitrary shell command execution with the process privileges.

**Evidence:** `apps/worker/src/lib/wrangler.mjs:105`

```
const child = spawn("wrangler", ["login"], { stdio: "inherit" });
```

**Impact:** Enables arbitrary shell command execution with the process privileges.

**Remediation:** Use execFile/spawn with an argument array and shell:false; validate against an allowlist.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_HOST=${UNIFI_ACCESS_HOST:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_USERNAME=${UNIFI_ACCESS_USERNAME:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_PASSWORD=<redacted:secret>}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_PORT=${UNIFI_ACCESS_PORT:-443}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_VERIFY_SSL=${UNIFI_ACCESS_VERIFY_SSL:-false}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_ACCESS_HOST=${UNIFI_ACCESS_HOST:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_ACCESS_USERNAME=${UNIFI_ACCESS_USERNAME:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_ACCESS_PASSWORD=<redacted:secret>}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_ACCESS_API_KEY=<redacted:secret>}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_ACCESS_PORT=${UNIFI_ACCESS_PORT:-443}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_ACCESS_API_PORT=${UNIFI_ACCESS_API_PORT:-12445}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_ACCESS_VERIFY_SSL=${UNIFI_ACCESS_VERIFY_SSL:-false}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
UNIFI_TOOL_REGISTRATION_MODE=${UNIFI_TOOL_REGISTRATION_MODE:-lazy}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_HOST=${UNIFI_NETWORK_HOST:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_USERNAME=${UNIFI_NETWORK_USERNAME:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_PASSWORD=<redacted:secret>}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_PORT=${UNIFI_NETWORK_PORT:-443}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_SITE=${UNIFI_NETWORK_SITE:-default}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_VERIFY_SSL=${UNIFI_NETWORK_VERIFY_SSL:-false}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_NETWORK_HOST=${UNIFI_NETWORK_HOST:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_NETWORK_USERNAME=${UNIFI_NETWORK_USERNAME:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_NETWORK_PASSWORD=<redacted:secret>}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_NETWORK_PORT=${UNIFI_NETWORK_PORT:-443}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_NETWORK_SITE=${UNIFI_NETWORK_SITE:-default}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_NETWORK_VERIFY_SSL=${UNIFI_NETWORK_VERIFY_SSL:-false}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
UNIFI_TOOL_REGISTRATION_MODE=${UNIFI_TOOL_REGISTRATION_MODE:-lazy}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_HOST=${UNIFI_PROTECT_HOST:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_USERNAME=${UNIFI_PROTECT_USERNAME:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_PASSWORD=<redacted:secret>}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_PORT=${UNIFI_PROTECT_PORT:-443}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_VERIFY_SSL=${UNIFI_PROTECT_VERIFY_SSL:-false}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_PROTECT_HOST=${UNIFI_PROTECT_HOST:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_PROTECT_USERNAME=${UNIFI_PROTECT_USERNAME:-}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_PROTECT_PASSWORD=<redacted:secret>}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_PROTECT_PORT=${UNIFI_PROTECT_PORT:-443}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_PROTECT_VERIFY_SSL=${UNIFI_PROTECT_VERIFY_SSL:-false}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CONFIG-005: Secret embedded directly in MCP config
**Severity:** high  **Confidence:** 85%  **Category:** config

A config env value or header appears to contain a real secret rather than a runtime-injected reference.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
UNIFI_TOOL_REGISTRATION_MODE=${UNIFI_TOOL_REGISTRATION_MODE:-lazy}
```

**Impact:** Committed secrets can be leaked via source control, reports, or shared configs.

**Remediation:** Do not hardcode secrets in config. Inject them at runtime from a secrets manager or environment.

#### MCP-CODE-003: Dynamic code evaluation (eval / Function)
**Severity:** high  **Confidence:** 85%  **Category:** code

Uses eval() or the Function constructor to execute dynamically constructed code.

**Evidence:** `apps/api/src/unifi_api/static/admin/htmx.min.js:1`

```
var htmx=function(){"use strict";const Q={onLoad:null,process:null,on:null,off:null,trigger:null,ajax:null,find:null,findAll:null,closest:null,values:function(e,t){const n=cn(e,t||"post");return n.val
```

**Impact:** Dynamically evaluated code can execute attacker-controlled logic.

**Remediation:** Remove eval/Function. Parse data with JSON.parse and use explicit dispatch tables.

### MEDIUM (31)
#### MCP-CONFIG-001: Unpinned package version in MCP startup command
**Severity:** medium  **Confidence:** 90%  **Category:** config

The startup command runs a package via npx/uvx without pinning an exact version, so the code executed can change silently between runs.

**Evidence:** `plugins/unifi-access/.mcp.json`

```
uvx --python-preference system unifi-access-mcp==0.5.0
```

**Impact:** The exact code run at startup is not reproducible and can be replaced by a malicious release.

**Remediation:** Pin an exact version, e.g. `npx -y @scope/server@1.2.3`. Avoid `latest`/floating ranges in startup commands.

#### MCP-CONFIG-001: Unpinned package version in MCP startup command
**Severity:** medium  **Confidence:** 90%  **Category:** config

The startup command runs a package via npx/uvx without pinning an exact version, so the code executed can change silently between runs.

**Evidence:** `plugins/unifi-network/.mcp.json`

```
uvx --python-preference system unifi-network-mcp==0.22.0
```

**Impact:** The exact code run at startup is not reproducible and can be replaced by a malicious release.

**Remediation:** Pin an exact version, e.g. `npx -y @scope/server@1.2.3`. Avoid `latest`/floating ranges in startup commands.

#### MCP-CONFIG-001: Unpinned package version in MCP startup command
**Severity:** medium  **Confidence:** 90%  **Category:** config

The startup command runs a package via npx/uvx without pinning an exact version, so the code executed can change silently between runs.

**Evidence:** `plugins/unifi-protect/.mcp.json`

```
uvx --python-preference system unifi-protect-mcp==0.6.2
```

**Impact:** The exact code run at startup is not reproducible and can be replaced by a malicious release.

**Remediation:** Pin an exact version, e.g. `npx -y @scope/server@1.2.3`. Avoid `latest`/floating ranges in startup commands.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/live_smoke.py — which does not run as part of the MCP server.)

**Evidence:** `scripts/live_smoke.py:2070`

```
shutil.rmtree(tmp_dir, ignore_errors=True)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/live_smoke.py — which does not run as part of the MCP server.)

**Evidence:** `scripts/live_smoke.py:2444`

```
shutil.rmtree(tmp_dir, ignore_errors=True)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 80%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/live_smoke.py — which does not run as part of the MCP server.)

**Evidence:** `scripts/live_smoke.py:2814`

```
shutil.rmtree(tmp_dir, ignore_errors=True)
```

**Impact:** File deletion can destroy data outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `packages/unifi-mcp-shared/src/unifi_mcp_shared/manifest_generator.py:233`

```
with open(output_path, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/generate_server_manifest.py:138`

```
with open(output_path, "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `apps/api/src/unifi_api/serializers/_registry.py:105`

```
product_pkg = importlib.import_module(f"unifi_api.serializers.{product}")
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `apps/api/src/unifi_api/serializers/_registry.py:111`

```
importlib.import_module(f"unifi_api.serializers.{product}.{modname}")
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `packages/unifi-mcp-shared/src/unifi_mcp_shared/lazy_tools.py:50`

```
pkg = importlib.import_module(tools_package)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `packages/unifi-mcp-shared/src/unifi_mcp_shared/lazy_tools.py:168`

```
importlib.import_module(module_path)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `packages/unifi-mcp-shared/src/unifi_mcp_shared/manifest_generator.py:78`

```
tool_index_mod = importlib.import_module(f"{package}.tool_index")
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `packages/unifi-mcp-shared/src/unifi_mcp_shared/manifest_generator.py:82`

```
importlib.import_module(f"{package}.main")
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `packages/unifi-mcp-shared/src/unifi_mcp_shared/manifest_generator.py:85`

```
categories_mod = importlib.import_module(f"{package}.categories")
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `packages/unifi-mcp-shared/src/unifi_mcp_shared/manifest_generator.py:86`

```
jobs_mod = importlib.import_module(f"{package}.jobs")
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `packages/unifi-mcp-shared/src/unifi_mcp_shared/manifest_generator.py:87`

```
runtime_mod = importlib.import_module(f"{package}.runtime")
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `packages/unifi-mcp-shared/src/unifi_mcp_shared/tool_loader.py:43`

```
tools_pkg: ModuleType = importlib.import_module(base_package)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `packages/unifi-mcp-shared/src/unifi_mcp_shared/tool_loader.py:73`

```
importlib.import_module(mod_name)
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `scripts/live_smoke.py:423`

```
main_mod = importlib.import_module(self.config["main"])
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `scripts/live_smoke.py:424`

```
runtime_mod = importlib.import_module(self.config["runtime"])
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `scripts/live_smoke.py:425`

```
bootstrap_mod = importlib.import_module(self.config["bootstrap"])
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `scripts/live_smoke.py:426`

```
categories_mod = importlib.import_module(self.config["categories"])
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `scripts/live_smoke.py:427`

```
jobs_mod = importlib.import_module(self.config["jobs"])
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-PY-005: Dynamic module import (__import__ / importlib with non-literal)
**Severity:** medium  **Confidence:** 70%  **Category:** code

A caller-controlled module name can load and execute arbitrary code.

**Evidence:** `scripts/live_smoke.py:428`

```
tool_index_mod = importlib.import_module(self.config["tool_index"])
```

**Impact:** A caller-controlled module name can load and execute arbitrary code.

**Remediation:** Import modules by static names; never import a computed module path.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `apps/worker/src/lib/api.mjs:23`

```
const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `apps/worker/src/lib/api.mjs:32`

```
const res = await fetch(req.url, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/api_image_smoke.py:51`

```
with urllib.request.urlopen(req, timeout=15) as resp:
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/api_image_smoke.py:117`

```
with urllib.request.urlopen(f"{BASE}/v1/openapi.json", timeout=10) as r:
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/live_smoke.py:1759`

```
with urllib.request.urlopen(req, timeout=timeout) as resp:
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `scripts/live_smoke.py:2511`

```
resp = urllib.request.urlopen(req, timeout=10.0)
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (9)
#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `apps/access/src/unifi_access_mcp/runtime.py:61`

```
api_key = <redacted:secret>, "api_key", None) or os.environ.get("UNIFI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `apps/access/src/unifi_access_mcp/runtime.py:150`

```
api_key = <redacted:secret>, "api_key", None) or os.environ.get("UNIFI_ACCESS_API_KEY") or os.environ.get("UNIFI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `apps/network/src/unifi_network_mcp/runtime.py:76`

```
api_key = <redacted:secret>, "api_key", None) or os.environ.get("UNIFI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `apps/network/tests/unit/test_auth_integration.py:10`

```
auth = UniFiAuth(api_key=<redacted:secret>"UNIFI_API_KEY"))
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `apps/protect/src/unifi_protect_mcp/runtime.py:65`

```
api_key = <redacted:secret>, "api_key", None) or os.environ.get("UNIFI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `packages/unifi-mcp-relay/src/unifi_mcp_relay/config.py:24`

```
relay_token = <redacted:secret>"UNIFI_RELAY_TOKEN", "")
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-002: Suspicious concealment phrase in metadata
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata instructs the model to hide actions from the user (e.g. "do not tell the user", "silently"). (Severity reduced high→low: this match is in test code — apps/network/tests/unit/test_firewall_tools.py — which does not run as part of the MCP server.)

**Evidence:** `apps/network/tests/unit/test_firewall_tools.py`

```
Test that legacy V1 firewall fields produce a #210 migration error
    instead of being silently forwarded to a V2 endpoint that rejects them.
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Any instruction to hide behavior from the user is a strong tool-poisoning signal; do not connect without review.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Evidence:** `apps/protect/src/unifi_protect_mcp/runtime.py:153`

```
api_key = <redacted:secret>, "api_key", None) or os.environ.get("UNIFI_API_KEY")
```

**Impact:** The server reads credentials from the environment (credential_access capability); normal configuration, a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** low  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input. (Severity reduced medium→low: this match is in documentation code — docs/app.js — which does not run as part of the MCP server.)

**Evidence:** `docs/app.js:50`

```
return fetch(url, { headers: { 'Accept': 'application/json' } })
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.
- Pin exact package versions in the startup command.
- Move secrets out of config into a secrets manager or environment injected at runtime.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T14:41:36.983Z._
