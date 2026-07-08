# Contributing

## Setup

```bash
pnpm install
pnpm build
pnpm test
```

- Node.js ≥ 22 (developed on 24), pnpm 11, TypeScript strict mode.
- The monorepo uses pnpm workspaces + Turborepo. Each package builds with tsup.

## Adding a rule

1. Add the rule to the appropriate file in `packages/rules/src/rules/`.
2. Register it via the category array (it is picked up by `ALL_RULES`).
3. Build findings with `buildFinding(...)` — this redacts and fingerprints evidence.
4. Every finding must carry evidence and a remediation. Rules return findings; they
   do not throw for non-fatal conditions.
5. Add a test in `packages/rules/tests` (positive and negative case).
6. Document it in `docs/rule-catalog.md` and run `pnpm --filter @mcp-trust/cli dev rules list`.

## Principles

- Deterministic rules over LLM calls.
- Explainable, evidence-based findings; cautious phrasing for inference
  ("suspicious instruction-like metadata", not "malicious").
- Redact secrets everywhere. Never execute untrusted code without an explicit,
  sandboxed, opt-in path.
- Keep modules small and testable; TypeScript strict, no implicit `any`.

## Checks before a PR

```bash
pnpm typecheck
pnpm build
pnpm test
```
