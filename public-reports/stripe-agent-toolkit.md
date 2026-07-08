# MCP Trust Report: github:stripe/ai

**Decision:** NEEDS_REVIEW  
**Risk:** MEDIUM  
**Score:** 32/100  
**Confidence:** 69%

_Resolved ref: `dc8faf805e6d351be7991f9e4c3d5dc1a1cfdcda`_

## Executive Summary
This MCP server requires human security review before use; notable risks were detected.

## ⚠️ Limitations
- Additionally, C#, Java, Ruby source is present but was NOT analyzed — MCP Trust has code rules for JavaScript, TypeScript and Python only. Absence of code findings does not imply this server is safe.

## Decision Reasons
- Overall score 32 falls in MEDIUM band
- Elevated to NEEDS_REVIEW by: MCP-CODE-002, MCP-CODE-002, MCP-META-003, MCP-META-003, MCP-META-003, MCP-SG-JS-005, MCP-SG-PY-004, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005, MCP-SG-JS-005

## Coverage
| Check | State |
|---|---|
| configScan | completed |
| staticScan | completed |
| capabilityInference | static_only |
| introspection | disabled |
| semgrep | partial |
| docker | disabled |
| dependencyScan | not_available |
| runtimeScan | not_available |
| packageMetadata | partial |

## Capability Map
_Source: static_inference_

_No tools discovered (no runtime introspection); capabilities inferred statically where possible._

## Subscores
| Subscore | Value |
|---|---|
| capability | 0 |
| code | 100 |
| config | 0 |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 73 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (86)
### MEDIUM (42)
#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 95%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced critical→medium: this match is in build/dev-tooling code — scripts/sync.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/sync.js:84`

```
const output = execSync(`git status --porcelain -- "${skillsRel}"`, {
```

**Impact:** Enables arbitrary shell command execution. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-002: Synchronous shell execution (execSync / spawnSync shell)
**Severity:** medium  **Confidence:** 90%  **Category:** code

Uses execSync (or spawnSync with shell:true), executing a command through a shell synchronously. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/sync.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/sync.js:9`

```
return execSync(
```

**Impact:** Enables arbitrary shell command execution.

**Remediation:** Prefer spawnSync with an argument array and shell:false; validate inputs.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace. (Severity reduced high→medium: this match is in build/dev-tooling code — scripts/sync.js — which does not run as part of the MCP server.)

**Evidence:** `scripts/sync.js:38`

```
await fs.rm(path.join(dir, entry.name), { recursive: true, force: true });
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/sync.js:75`

```
await fs.writeFile(filePath, JSON.stringify(content, null, 2) + "\n", "utf8");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `scripts/sync.js:128`

```
await fs.writeFile(outputPath, content, "utf8");
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `benchmarks/furever/grader/payments.py:526`

```
with open("/workdir/payment_test_results.json", "w") as f:
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/furever/environment/app/api/webhooks/route.ts:16`

```
const secret = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/furever/environment/app/api/webhooks/route.ts:29`

```
process.env.STRIPE_WEBHOOK_SECRET || ''
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/galtee-basic/environment/server/server.js:7`

```
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/galtee-basic/environment/server/server.js:79`

```
if (process.env.STRIPE_WEBHOOK_SECRET) {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/galtee-basic/environment/server/server.js:87`

```
process.env.STRIPE_WEBHOOK_SECRET
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/galtee-basic/solution/server.js:9`

```
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/galtee-basic/solution/server.js:334`

```
if (process.env.STRIPE_WEBHOOK_SECRET) {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/galtee-basic/solution/server.js:342`

```
process.env.STRIPE_WEBHOOK_SECRET
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/galtee-invoicing/environment/server/server.js:6`

```
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/galtee-invoicing/solution/migrate.js:7`

```
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/galtee-invoicing/solution/server.js:8`

```
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/saas-starter-embedded-checkout/environment/app/api/stripe/webhook/route.ts:5`

```
const webhookSecret = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/saas-starter-partial-payments/environment/app/api/stripe/webhook/route.ts:5`

```
const webhookSecret = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `llm/ai-sdk/provider/stripe-provider.ts:46`

```
*   apiKey: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `llm/ai-sdk/provider/stripe-provider.ts:73`

```
const apiKey = <redacted:secret> || process.env.STRIPE_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `llm/ai-sdk/provider/stripe-provider.ts:164`

```
*   apiKey: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `llm/ai-sdk/provider/stripe-provider.ts:189`

```
const apiKey = <redacted:secret> || process.env.STRIPE_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `tools/modelcontextprotocol/src/cli.ts:38`

```
const apiKey = <redacted:secret> || process.env.STRIPE_SECRET_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/card-element-to-checkout/environment/init_products.py:17`

```
STRIPE_SECRET_KEY = <redacted:secret>"STRIPE_SECRET_KEY")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/saas-starter-embedded-checkout/grader/checkout_tests.py:60`

```
stripe.api_key = <redacted:secret>"STRIPE_SECRET_KEY")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/saas-starter-partial-payments/grader/checkout_tests.py:60`

```
stripe.api_key = <redacted:secret>"STRIPE_SECRET_KEY")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords).

**Evidence:** `benchmarks/saas-starter-partial-payments/grader/invoice_tests.py:8`

```
api_key = <redacted:secret>"STRIPE_SECRET_KEY")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `benchmarks/card-element-to-checkout/environment/server/server.py:15`

```
stripe.api_key = <redacted:secret>"STRIPE_SECRET_KEY")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `benchmarks/card-element-to-checkout/grader/checkout_tests.py:114`

```
stripe.api_key = <redacted:secret>"STRIPE_SECRET_KEY")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** medium  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them.

**Evidence:** `benchmarks/card-element-to-checkout/solution/server/server.py:16`

```
stripe.api_key = <redacted:secret>"STRIPE_SECRET_KEY")
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→medium: this match is in build/dev-tooling code — benchmarks/furever/run_solution.sh — which does not run as part of the MCP server.)

**Evidence:** `benchmarks/furever/run_solution.sh`

```
Copy .env.example to .env and add your Stripe API keys:
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→medium: this match is in build/dev-tooling code — benchmarks/galtee-basic/run_solution.sh — which does not run as part of the MCP server.)

**Evidence:** `benchmarks/galtee-basic/run_solution.sh`

```
Copy .env.example to .env and add your Stripe API keys:
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-META-003: Suspicious data-exfiltration phrase in metadata
**Severity:** medium  **Confidence:** 60%  **Category:** metadata

Metadata references sending data/credentials to an external destination. (Severity reduced high→medium: this match is in build/dev-tooling code — benchmarks/galtee-invoicing/run_solution.sh — which does not run as part of the MCP server.)

**Evidence:** `benchmarks/galtee-invoicing/run_solution.sh`

```
Copy .env.example to .env and add your Stripe API keys:
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Investigate where data would be sent. Block until the destination and intent are verified.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `benchmarks/furever/environment/app/components/testdata/Financing/TransitionFinancingButton.tsx:33`

```
const res = await fetch(fetchUrl, {
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-PY-004: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `benchmarks/furever/grader/payments.py:35`

```
with urllib.request.urlopen(url, timeout=20) as response:
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `benchmarks/saas-starter-embedded-checkout/environment/app/(dashboard)/dashboard/general/page.tsx:14`

```
const fetcher = (url: string) => fetch(url).then((res) => res.json());
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `benchmarks/saas-starter-embedded-checkout/environment/app/(dashboard)/dashboard/page.tsx:28`

```
const fetcher = (url: string) => fetch(url).then((res) => res.json());
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `benchmarks/saas-starter-embedded-checkout/environment/app/(dashboard)/layout.tsx:19`

```
const fetcher = (url: string) => fetch(url).then((res) => res.json());
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `benchmarks/saas-starter-partial-payments/environment/app/(dashboard)/dashboard/general/page.tsx:14`

```
const fetcher = (url: string) => fetch(url).then((res) => res.json());
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `benchmarks/saas-starter-partial-payments/environment/app/(dashboard)/dashboard/page.tsx:28`

```
const fetcher = (url: string) => fetch(url).then((res) => res.json());
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data.

**Evidence:** `benchmarks/saas-starter-partial-payments/environment/app/(dashboard)/layout.tsx:19`

```
const fetcher = (url: string) => fetch(url).then((res) => res.json());
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (44)
#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/meter/examples/anthropic.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/meter/examples/anthropic.ts:17`

```
const STRIPE_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/meter/examples/anthropic.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/meter/examples/anthropic.ts:19`

```
const ANTHROPIC_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/meter/examples/google.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/meter/examples/google.ts:18`

```
const STRIPE_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/meter/examples/google.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/meter/examples/google.ts:21`

```
process.env.GOOGLE_GENERATIVE_AI_API_KEY!;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/meter/examples/openai.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/meter/examples/openai.ts:17`

```
const STRIPE_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/meter/examples/openai.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/meter/examples/openai.ts:19`

```
const OPENAI_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/provider/examples/anthropic.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/examples/anthropic.ts:18`

```
if (!process.env.STRIPE_API_KEY) {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/provider/examples/anthropic.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/examples/anthropic.ts:28`

```
apiKey: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/provider/examples/google.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/examples/google.ts:18`

```
if (!process.env.STRIPE_API_KEY) {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/provider/examples/google.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/examples/google.ts:28`

```
apiKey: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/provider/examples/google.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/examples/google.ts:120`

```
apiKey: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/provider/examples/openai.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/examples/openai.ts:18`

```
if (!process.env.STRIPE_API_KEY) {
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/ai-sdk/provider/examples/openai.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/examples/openai.ts:28`

```
apiKey: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — llm/ai-sdk/provider/tests/stripe-provider-v3.test.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/tests/stripe-provider-v3.test.ts:129`

```
delete process.env.STRIPE_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — llm/ai-sdk/provider/tests/stripe-provider-v3.test.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/tests/stripe-provider-v3.test.ts:138`

```
process.env.STRIPE_API_KEY = '<redacted:secret>';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — llm/ai-sdk/provider/tests/stripe-provider-v3.test.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/tests/stripe-provider-v3.test.ts:147`

```
delete process.env.STRIPE_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — llm/ai-sdk/provider/tests/stripe-provider-v3.test.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/tests/stripe-provider-v3.test.ts:174`

```
process.env.STRIPE_API_KEY = '<redacted:secret>';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — llm/ai-sdk/provider/tests/stripe-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/tests/stripe-provider.test.ts:120`

```
delete process.env.STRIPE_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — llm/ai-sdk/provider/tests/stripe-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/tests/stripe-provider.test.ts:129`

```
process.env.STRIPE_API_KEY = '<redacted:secret>';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — llm/ai-sdk/provider/tests/stripe-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/tests/stripe-provider.test.ts:139`

```
delete process.env.STRIPE_API_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — llm/ai-sdk/provider/tests/stripe-provider.test.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/tests/stripe-provider.test.ts:166`

```
process.env.STRIPE_API_KEY = '<redacted:secret>';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/token-meter/examples/anthropic.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/token-meter/examples/anthropic.ts:16`

```
const STRIPE_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/token-meter/examples/anthropic.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/token-meter/examples/anthropic.ts:18`

```
const ANTHROPIC_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/token-meter/examples/gemini.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/token-meter/examples/gemini.ts:16`

```
const STRIPE_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/token-meter/examples/gemini.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/token-meter/examples/gemini.ts:18`

```
const GOOGLE_GENERATIVE_AI_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/token-meter/examples/openai.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/token-meter/examples/openai.ts:16`

```
const STRIPE_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — llm/token-meter/examples/openai.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/token-meter/examples/openai.ts:18`

```
const OPENAI_API_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tools/modelcontextprotocol/src/test/index.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tools/modelcontextprotocol/src/test/index.test.ts:100`

```
const originalEnv = process.env.STRIPE_SECRET_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tools/modelcontextprotocol/src/test/index.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tools/modelcontextprotocol/src/test/index.test.ts:103`

```
delete process.env.STRIPE_SECRET_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tools/modelcontextprotocol/src/test/index.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tools/modelcontextprotocol/src/test/index.test.ts:108`

```
process.env.STRIPE_SECRET_KEY = <redacted:secret>
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tools/modelcontextprotocol/src/test/index.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tools/modelcontextprotocol/src/test/index.test.ts:110`

```
delete process.env.STRIPE_SECRET_KEY;
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tools/modelcontextprotocol/src/test/index.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tools/modelcontextprotocol/src/test/index.test.ts:135`

```
process.env.STRIPE_SECRET_KEY = '<redacted:secret>';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in test code — tools/modelcontextprotocol/src/test/index.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tools/modelcontextprotocol/src/test/index.test.ts:142`

```
process.env.STRIPE_SECRET_KEY = '<redacted:secret>';
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — tools/typescript/examples/ai-sdk/index.ts — which does not run as part of the MCP server.)

**Evidence:** `tools/typescript/examples/ai-sdk/index.ts:8`

```
secretKey: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — tools/typescript/examples/langchain/index.ts — which does not run as part of the MCP server.)

**Evidence:** `tools/typescript/examples/langchain/index.ts:14`

```
secretKey: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). (Severity reduced medium→low: this match is in example/sample code — tools/typescript/examples/openai/index.ts — which does not run as part of the MCP server.)

**Evidence:** `tools/typescript/examples/openai/index.ts:10`

```
secretKey: <redacted:secret>,
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in example/sample code — tools/python/examples/crewai/main.py — which does not run as part of the MCP server.)

**Evidence:** `tools/python/examples/crewai/main.py:14`

```
secret_key=<redacted:secret>"STRIPE_SECRET_KEY"),
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in example/sample code — tools/python/examples/langchain/main.py — which does not run as part of the MCP server.)

**Evidence:** `tools/python/examples/langchain/main.py:21`

```
secret_key=<redacted:secret>"STRIPE_SECRET_KEY"),
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in example/sample code — tools/python/examples/openai/file_search/main.py — which does not run as part of the MCP server.)

**Evidence:** `tools/python/examples/openai/file_search/main.py:29`

```
secret_key=<redacted:secret>"STRIPE_SECRET_KEY"),
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in example/sample code — tools/python/examples/openai/web_search/main.py — which does not run as part of the MCP server.)

**Evidence:** `tools/python/examples/openai/web_search/main.py:14`

```
secret_key=<redacted:secret>"STRIPE_SECRET_KEY"),
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-SG-PY-006: Secret-like environment variable access
**Severity:** low  **Confidence:** 70%  **Category:** code

The server handles credentials; misuse or logging could leak them. (Severity reduced medium→low: this match is in example/sample code — tools/python/examples/strands/main.py — which does not run as part of the MCP server.)

**Evidence:** `tools/python/examples/strands/main.py:14`

```
secret_key=<redacted:secret>"STRIPE_SECRET_KEY"),
```

**Impact:** The server handles credentials; misuse or logging could leak them.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — llm/ai-sdk/provider/tests/utils-v3.test.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/ai-sdk/provider/tests/utils-v3.test.ts`

```
System prompt
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in example/sample code — llm/token-meter/examples/anthropic.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/token-meter/examples/anthropic.ts`

```
, response.usage);
}

// Sample 4: Message with System Prompt
async function sampleMessageWithSystem() {
  const response = await anthropic.messages.create({
    model: 
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.

#### MCP-META-004: Metadata references system/developer prompt
**Severity:** low  **Confidence:** 60%  **Category:** metadata

Metadata references the system or developer prompt, a common prompt-injection target. (Severity reduced medium→low: this match is in test code — llm/token-meter/tests/token-meter-anthropic.test.ts — which does not run as part of the MCP server.)

**Evidence:** `llm/token-meter/tests/token-meter-anthropic.test.ts`

```
should track usage from message with system prompt
```

**Impact:** Instruction-like text in server-controlled metadata can steer the model without user awareness.

**Remediation:** Review why tool metadata references system-level prompts; treat as untrusted.


## Recommended Policy
- No elevated restrictions required beyond standard review, based on available evidence.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.0 at 2026-07-08T09:56:03.427Z._
