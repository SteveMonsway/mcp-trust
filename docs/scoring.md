# Scoring & Decision Model

All thresholds live in a single module: `packages/core/src/scoring/thresholds.ts`.
No other module duplicates them.

## Score bands and decision

| Score | Risk band | Base decision |
|---|---|---|
| 0–29 | LOW | APPROVE |
| 30–59 | MEDIUM | APPROVE_WITH_RESTRICTIONS |
| 60–79 | HIGH | NEEDS_REVIEW |
| 80–100 | CRITICAL | BLOCK |

The risk band and the base decision always agree — they are derived from the same
band boundaries (30 / 60 / 80).

## Subscores and weights

Nine subscores, weighted to sum to 1.00:

| Subscore | Weight |
|---|---|
| capability | 0.20 |
| code | 0.20 |
| config | 0.15 |
| supplyChain | 0.15 |
| dependency | 0.10 |
| authTransport | 0.05 |
| metadata | 0.05 |
| maintainer | 0.05 |
| runtime | 0.05 |

Each subscore is computed from its findings with a saturating "OR":
`subscore = 100 · (1 − Π(1 − sevBase·confidence))`, which stays within `[0, 100]`.

A subscore that was **not assessed** (e.g. `runtime`, `dependency`, `maintainer`,
`authTransport` in Phase 1) is reported as `null` and its weight is redistributed
proportionally across the assessed subscores. The report's `coverage` block always
states what was and wasn't assessed.

## Severity overrides

The base decision is **raised (never lowered)** by evidence:

- Any **critical** finding with confidence ≥ 0.75 → `BLOCK`.
- A finding tagged `force_block` (e.g. known-malicious) → `BLOCK`.
- A finding tagged `min_needs_review` (`curl | sh`, `sudo`, embedded secret,
  shell-execution capability, data-exfiltration metadata) → at least `NEEDS_REVIEW`.

This is why a MEDIUM-band result can still read `NEEDS_REVIEW` or `BLOCK`: the number
sets the floor, the evidence can push it higher. Every raise is listed in
`score.decisionReason`.

## Runtime-context severity caps

A shell-exec or file-write inside a project's **test**, **example**, **docs** or
**build/dev-script** code is not something an agent that connects to the running MCP
**server** is exposed to — that code never ships as part of the server. Before scoring
and the decision, MCP Trust classifies each finding's file
(`classifyRuntimeContext`, `packages/core/src/findings/runtime-context.ts`) and caps
the severity of non-runtime findings so they inform, but do not dominate, the decision:

| Context | Detected by | Severity cap |
|---|---|---|
| test | `test/` `tests/` `__tests__/` `spec/` `e2e/`, `*.test.*`, `*.spec.*`, `test_*.py`, `*_test.go`, `conftest.py` | `low` |
| example | `example(s)/` `demo(s)/` `sample(s)/` `fixtures/` | `low` |
| docs | `docs/` `doc/` | `low` |
| dev-tooling | `scripts/` `tools/` `build/` `benchmark(s)/` `.github/` `ci/` | `medium` |
| runtime | anything else (the safe default) | none |

The finding is **still reported** (honest) with a `context:<kind>` tag and a note
explaining the reduction. Runtime code is never downgraded — when in doubt, a path is
treated as runtime. This stops false `BLOCK`s like an `execSync` inside
`tests/cli.spec.ts`, while a genuine `child_process.exec` in the server's own runtime
still blocks.

## Confidence

Overall confidence is the severity-weighted average of the confidences of the
significant findings (severity ≥ medium). With no significant findings, confidence
reflects how much was inspected (static scan, package metadata, introspection).
