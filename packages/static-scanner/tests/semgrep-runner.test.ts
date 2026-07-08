import { describe, it, expect } from 'vitest';
import { runSemgrep, type SemgrepExec, type SemgrepExecResult } from '@mcp-trust/static-scanner';

function fixedExec(res: Partial<SemgrepExecResult>): { exec: SemgrepExec; calls: { bin: string; args: string[]; env: NodeJS.ProcessEnv; cwd: string }[] } {
  const calls: { bin: string; args: string[]; env: NodeJS.ProcessEnv; cwd: string }[] = [];
  const exec: SemgrepExec = (bin, args, opts) => {
    calls.push({ bin, args, env: opts.env, cwd: opts.cwd });
    return { status: 0, stdout: '', stderr: '', ...res };
  };
  return { exec, calls };
}

const oneValid = {
  results: [
    {
      check_id: 'packages.static-scanner.rules.mcp-sg-py-unsafe-deser',
      path: 'unsafe.py',
      start: { line: 15, col: 12 },
      end: { line: 15, col: 30 },
      extra: {
        metadata: {
          mcp_id: 'MCP-SG-PY-003',
          mcp_title: 'Unsafe deserialization',
          mcp_category: 'code',
          mcp_severity: 'high',
          mcp_confidence: '0.85',
          mcp_capability: 'unknown_high_privilege',
          mcp_impact: 'Deserializing untrusted data can execute code.',
          mcp_remediation: 'Use yaml.safe_load.',
          mcp_cwe: 'CWE-502',
          mcp_min_needs_review: 'true',
          references: ['https://cwe.mitre.org/data/definitions/502.html'],
        },
      },
    },
    // Missing all mcp_* metadata → must be dropped (fail-closed).
    { check_id: 'x', path: 'a.js', start: { line: 1, col: 1 }, extra: { metadata: {} } },
  ],
  errors: [],
};

describe('runSemgrep', () => {
  it('normalizes valid matches and drops metadata-less ones (fail-closed)', () => {
    const { exec } = fixedExec({ stdout: JSON.stringify(oneValid) });
    const r = runSemgrep({ dir: '/tmp/x' }, exec);
    expect(r.status).toBe('completed');
    expect(r.droppedMetadata).toBe(1);
    expect(r.findings).toHaveLength(1);
    const f = r.findings[0]!;
    expect(f.mcpId).toBe('MCP-SG-PY-003');
    expect(f.severity).toBe('high');
    expect(f.confidence).toBeCloseTo(0.85);
    expect(f.file).toBe('unsafe.py');
    expect(f.line).toBe(15);
    expect(f.column).toBe(12);
    expect(f.endLine).toBe(15);
    expect(f.minNeedsReview).toBe(true);
    expect(f.cwe).toBe('CWE-502');
    expect(f.references).toEqual(['https://cwe.mitre.org/data/definitions/502.html']);
  });

  it('passes the hardened, offline flag set and sanitized env to the runner', () => {
    const { exec, calls } = fixedExec({ stdout: JSON.stringify({ results: [], errors: [] }) });
    runSemgrep({ dir: '/scan/here' }, exec);
    const call = calls[0]!;
    expect(call.bin).toBe('semgrep');
    expect(call.cwd).toBe('/scan/here');
    const args = call.args.join(' ');
    expect(args).toContain('--config');
    expect(args).toContain('--json');
    expect(args).toContain('--metrics off');
    expect(args).toContain('--disable-nosem'); // hostile target cannot suppress via nosemgrep
    expect(args).toContain('--no-git-ignore');
    expect(args).toContain('--jobs 1');
    expect(args).toContain('--timeout');
    expect(args).toContain('--max-memory');
    expect(args).toContain('--max-target-bytes');
    // No network / telemetry / host login.
    expect(call.env.SEMGREP_ENABLE_VERSION_CHECK).toBe('0');
    expect(call.env.SEMGREP_SEND_METRICS).toBe('off');
    expect(call.env.PYTHONUTF8).toBe('1');
    // No inherited host secrets beyond an explicit minimal allowlist.
    expect(Object.keys(call.env).sort()).toEqual(
      ['HOME', 'PATH', 'PYTHONIOENCODING', 'PYTHONUTF8', 'SEMGREP_ENABLE_VERSION_CHECK', 'SEMGREP_SEND_METRICS'].sort(),
    );
  });

  it('reports partial when semgrep records scan-level errors', () => {
    const { exec } = fixedExec({ stdout: JSON.stringify({ results: [], errors: [{ type: 'Timeout' }] }) });
    expect(runSemgrep({ dir: '/tmp/x' }, exec).status).toBe('partial');
  });

  it('degrades to not_available when the binary is missing (ENOENT)', () => {
    const err = Object.assign(new Error('spawn semgrep ENOENT'), { code: 'ENOENT' }) as NodeJS.ErrnoException;
    const { exec } = fixedExec({ status: null, error: err });
    const r = runSemgrep({ dir: '/tmp/x' }, exec);
    expect(r.status).toBe('not_available');
    expect(r.findings).toHaveLength(0);
  });

  it('degrades to partial on timeout and on oversized output', () => {
    const { exec: e1 } = fixedExec({ timedOut: true, stdout: '' });
    expect(runSemgrep({ dir: '/tmp/x' }, e1).status).toBe('partial');
    const { exec: e2 } = fixedExec({ outputTruncated: true, stdout: 'partial-json{' });
    expect(runSemgrep({ dir: '/tmp/x' }, e2).status).toBe('partial');
  });

  it('reports error on unparseable output', () => {
    const { exec } = fixedExec({ stdout: 'not json at all' });
    expect(runSemgrep({ dir: '/tmp/x' }, exec).status).toBe('error');
  });

  it('never throws when the exec itself throws', () => {
    const exec: SemgrepExec = () => {
      throw new Error('boom');
    };
    const r = runSemgrep({ dir: '/tmp/x' }, exec);
    expect(r.status).toBe('error');
  });
});
