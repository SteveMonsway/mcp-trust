import { describe, it, expect } from 'vitest';
import { classifyRuntimeContext, applyRuntimeContext } from '../src/index.js';
import type { Finding, Severity } from '../src/index.js';

describe('classifyRuntimeContext', () => {
  it('classifies runtime source as runtime', () => {
    expect(classifyRuntimeContext('src/server.ts')).toBe('runtime');
    expect(classifyRuntimeContext('index.js')).toBe('runtime');
    expect(classifyRuntimeContext('src/setup/aiTool.ts')).toBe('runtime');
    expect(classifyRuntimeContext(undefined)).toBe('runtime');
  });

  it('detects test code by directory and filename convention', () => {
    expect(classifyRuntimeContext('tests/cli.spec.ts')).toBe('test');
    expect(classifyRuntimeContext('src/__tests__/foo.ts')).toBe('test');
    expect(classifyRuntimeContext('e2e/login.test.ts')).toBe('test');
    expect(classifyRuntimeContext('foo.spec.js')).toBe('test');
    expect(classifyRuntimeContext('pkg/bar.test.tsx')).toBe('test');
    expect(classifyRuntimeContext('test_client.py')).toBe('test');
    expect(classifyRuntimeContext('client_test.py')).toBe('test');
    expect(classifyRuntimeContext('conftest.py')).toBe('test');
    expect(classifyRuntimeContext('handler_test.go')).toBe('test');
  });

  it('detects examples, docs and build/dev tooling', () => {
    expect(classifyRuntimeContext('examples/demo.js')).toBe('example');
    expect(classifyRuntimeContext('fixtures/data.js')).toBe('example');
    expect(classifyRuntimeContext('docs/guide.md')).toBe('docs');
    expect(classifyRuntimeContext('scripts/sync.js')).toBe('devtool');
    expect(classifyRuntimeContext('benchmarks/run.sh')).toBe('devtool');
    expect(classifyRuntimeContext('tools/build.ts')).toBe('devtool');
  });

  it('does not misclassify runtime files that merely contain a keyword substring', () => {
    // "latest" contains "test" but is not a path segment; "describe" is not a dir.
    expect(classifyRuntimeContext('src/latest.ts')).toBe('runtime');
    expect(classifyRuntimeContext('src/contest.ts')).toBe('runtime');
  });
});

let idc = 0;
function mkFinding(severity: Severity, file: string | undefined): Finding {
  idc += 1;
  return {
    id: `F-${idc}`,
    ruleId: 'MCP-CODE-002',
    title: 'Synchronous shell execution',
    description: 'Runs a shell command.',
    severity,
    confidence: 0.95,
    category: 'code',
    evidence: file ? [{ source: file, file, line: 1 }] : [{ source: 'x' }],
    impact: 'Command execution.',
    remediation: 'Avoid shell.',
    references: [],
    tags: [],
    fingerprint: `fp-${idc}`,
  };
}

describe('applyRuntimeContext', () => {
  it('caps a critical finding in a test file to low and tags + annotates it', () => {
    const [out] = applyRuntimeContext([mkFinding('critical', 'tests/cli.spec.ts')]);
    expect(out!.severity).toBe('low');
    expect(out!.tags).toContain('context:test');
    expect(out!.description).toContain('Severity reduced critical→low');
    expect(out!.description).toContain('tests/cli.spec.ts');
  });

  it('caps a critical finding in a build script to medium (keeps more signal than tests)', () => {
    const [out] = applyRuntimeContext([mkFinding('critical', 'scripts/sync.js')]);
    expect(out!.severity).toBe('medium');
    expect(out!.tags).toContain('context:devtool');
  });

  it('leaves runtime findings untouched (same reference, no tag)', () => {
    const input = mkFinding('critical', 'src/setup/aiTool.ts');
    const [out] = applyRuntimeContext([input]);
    expect(out).toBe(input); // unchanged reference
    expect(out!.severity).toBe('critical');
  });

  it('does not raise a finding already below the cap', () => {
    const input = mkFinding('info', 'tests/foo.spec.ts');
    const [out] = applyRuntimeContext([input]);
    expect(out).toBe(input);
    expect(out!.severity).toBe('info');
  });

  it('treats file-less findings (config/supply) as runtime', () => {
    const input = mkFinding('critical', undefined);
    const [out] = applyRuntimeContext([input]);
    expect(out).toBe(input);
    expect(out!.severity).toBe('critical');
  });
});
