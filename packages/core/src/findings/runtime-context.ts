import { SEVERITY_ORDER, type Finding, type Severity } from '../types.js';

// ---------------------------------------------------------------------------
// Runtime-context awareness.
//
// A shell-exec or file-write in a project's *test*, *example*, *docs* or
// *build-script* code is not something an AI agent that connects to the running
// MCP **server** is exposed to — that code never ships as part of the server.
// Treating such a match as hard as a match in the server's runtime code causes
// false BLOCKs (e.g. an `execSync` inside `tests/cli.spec.ts`). We therefore
// classify each finding's file by whether it is part of the server runtime and
// cap the severity of non-runtime findings so they inform, but do not dominate,
// the decision. The finding is still reported (honest) with an explanatory note.
// ---------------------------------------------------------------------------

export type RuntimeContext = 'runtime' | 'test' | 'example' | 'docs' | 'devtool';

const TEST_DIRS = new Set(['test', 'tests', '__tests__', '__test__', 'spec', 'specs', 'e2e', '__mocks__', 'testing']);
const EXAMPLE_DIRS = new Set(['example', 'examples', 'demo', 'demos', 'sample', 'samples', 'fixtures', '__fixtures__']);
const DOC_DIRS = new Set(['docs', 'doc', 'documentation']);
const DEV_DIRS = new Set(['scripts', 'script', 'tools', 'tooling', 'build', 'benchmark', 'benchmarks', 'bench', '.github', 'ci']);

/**
 * Classify a target-relative file path by whether it ships as part of the
 * running MCP server. Directory segments take precedence, then filename
 * conventions (`*.test.ts`, `*.spec.js`, `test_*.py`, `*_test.go`, …).
 * Unknown / plain source paths are treated as `runtime` (the safe default —
 * we never downgrade something we are not confident is non-runtime).
 */
export function classifyRuntimeContext(file: string | undefined): RuntimeContext {
  if (!file) return 'runtime';
  const p = file.replace(/\\/g, '/').toLowerCase();
  const segments = p.split('/').filter(Boolean);
  const base = segments[segments.length - 1] ?? '';

  if (segments.some((s) => TEST_DIRS.has(s))) return 'test';
  if (/\.(test|spec)\.[cm]?[jt]sx?$/.test(base)) return 'test';
  if (/^test_.+\.py$/.test(base) || /_test\.py$/.test(base) || base === 'conftest.py') return 'test';
  if (/_test\.go$/.test(base)) return 'test';

  if (segments.some((s) => EXAMPLE_DIRS.has(s))) return 'example';
  if (segments.some((s) => DOC_DIRS.has(s))) return 'docs';
  if (segments.some((s) => DEV_DIRS.has(s))) return 'devtool';

  return 'runtime';
}

/** Highest severity a finding in this context may carry. `null` = no cap. */
const SEVERITY_CAP: Record<RuntimeContext, Severity | null> = {
  runtime: null,
  test: 'low',
  example: 'low',
  docs: 'low',
  devtool: 'medium',
};

const CONTEXT_LABEL: Record<RuntimeContext, string> = {
  runtime: 'runtime',
  test: 'test',
  example: 'example/sample',
  docs: 'documentation',
  devtool: 'build/dev-tooling',
};

/**
 * Apply runtime-context severity caps to a list of findings. A finding whose
 * primary evidence file is non-runtime and whose severity exceeds that
 * context's cap is returned with the capped severity, a `context:<kind>` tag,
 * and an explanatory note appended to its description. All other findings are
 * returned unchanged (same object reference). Pure — never mutates its input.
 */
export function applyRuntimeContext(findings: Finding[]): Finding[] {
  return findings.map((f) => {
    const kind = classifyRuntimeContext(f.evidence[0]?.file);
    const cap = SEVERITY_CAP[kind];
    if (kind === 'runtime' || cap === null) return f;
    if (SEVERITY_ORDER[f.severity] <= SEVERITY_ORDER[cap]) return f; // already at/below cap
    const original = f.severity;
    const file = f.evidence[0]?.file ?? 'file';
    return {
      ...f,
      severity: cap,
      tags: f.tags.includes(`context:${kind}`) ? f.tags : [...f.tags, `context:${kind}`],
      description:
        `${f.description} (Severity reduced ${original}→${cap}: this match is in ${CONTEXT_LABEL[kind]} ` +
        `code — ${file} — which does not run as part of the MCP server.)`,
    };
  });
}
