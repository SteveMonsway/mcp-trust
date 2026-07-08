import { describe, it, expect } from 'vitest';
import { canIntrospect } from '@mcp-trust/introspection';
import type { ScanTarget } from '@mcp-trust/core';

const local = (path: string): ScanTarget => ({ type: 'local', path });
const github: ScanTarget = { type: 'github', owner: 'o', repo: 'r', url: 'https://github.com/o/r' };

const noSandbox = { introspect: true, sandbox: 'none' as const };
const docker = { introspect: true, sandbox: 'docker' as const };

describe('canIntrospect', () => {
  it('is disabled unless --introspect is requested', () => {
    expect(canIntrospect(local('/x/fixtures/mcp/s'), { introspect: false, sandbox: 'none' })).toMatchObject({
      allowed: false,
      reason: 'disabled',
    });
  });

  it('allows a trusted fixtures/mcp path on the host (Level 1)', () => {
    expect(canIntrospect(local('/x/fixtures/mcp/mock'), noSandbox)).toMatchObject({ allowed: true, mode: 'host' });
    expect(canIntrospect(local('/x/examples/server'), noSandbox).allowed).toBe(true);
    expect(canIntrospect(local('/x/mock-mcp-servers/a'), noSandbox).allowed).toBe(true);
  });

  // Regression (review #3): substring trust bypass must be closed.
  it('rejects lookalike paths without a sandbox', () => {
    expect(canIntrospect(local('/home/me/my-examples/malware'), noSandbox).allowed).toBe(false);
    expect(canIntrospect(local('/x/code-examples/s'), noSandbox).allowed).toBe(false);
    expect(canIntrospect(local('/x/fixtures-mcp/s'), noSandbox).allowed).toBe(false);
    expect(canIntrospect(local('/x/fixtures/other/s'), noSandbox).allowed).toBe(false);
  });

  it('refuses a real github/npm target without a sandbox', () => {
    expect(canIntrospect(github, noSandbox)).toMatchObject({
      allowed: false,
      reason: 'skipped_real_target_no_sandbox',
    });
  });

  it('allows a real target in docker mode (Level 2)', () => {
    expect(canIntrospect(github, docker)).toMatchObject({
      allowed: true,
      mode: 'docker',
      reason: 'completed_sandboxed',
    });
  });

  it('runs a trusted fixture in docker when --sandbox docker is set', () => {
    expect(canIntrospect(local('/x/fixtures/mcp/mock'), docker)).toMatchObject({ allowed: true, mode: 'docker' });
  });
});
