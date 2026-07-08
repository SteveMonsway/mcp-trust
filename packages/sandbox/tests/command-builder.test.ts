import { describe, it, expect } from 'vitest';
import {
  buildDockerStdioLaunch,
  UNSAFE_DOCKER_FLAGS,
  DEFAULT_IMAGE,
  isCommandAllowed,
  assertCommandAllowed,
  SandboxCommandNotAllowedError,
} from '@mcp-trust/sandbox';

describe('buildDockerStdioLaunch', () => {
  const launch = buildDockerStdioLaunch({
    workspaceHostPath: '/host/target',
    command: 'node',
    args: ['server.js'],
  });

  it('spawns docker, not a shell', () => {
    expect(launch.command).toBe('docker');
    expect(launch.args[0]).toBe('run');
  });

  it('applies the hardening baseline', () => {
    const a = launch.args;
    expect(a).toContain('--rm');
    expect(a).toContain('-i');
    expect(a).toEqual(expect.arrayContaining(['--network', 'none']));
    expect(a).toContain('--read-only');
    expect(a).toEqual(expect.arrayContaining(['--cap-drop', 'ALL']));
    expect(a).toEqual(expect.arrayContaining(['--security-opt', 'no-new-privileges']));
    expect(a).toEqual(expect.arrayContaining(['--pids-limit', '128']));
  });

  it('runs unprivileged (non-root) by default', () => {
    expect(launch.args).toEqual(expect.arrayContaining(['--user', '65534:65534']));
    // never runs as root
    const ui = launch.args.indexOf('--user');
    expect(launch.args[ui + 1]).not.toBe('0:0');
  });

  it('never emits unsafe flags', () => {
    const joined = launch.args.join(' ');
    for (const flag of UNSAFE_DOCKER_FLAGS) {
      expect(launch.args).not.toContain(flag);
    }
    expect(joined).not.toContain('/var/run/docker.sock');
    expect(joined).not.toContain('--privileged');
    expect(joined).not.toContain('--net=host');
    expect(joined).not.toContain('--pid=host');
  });

  it('passes no host env; sets only a safe in-container env', () => {
    const a = launch.args;
    expect(a).toEqual(expect.arrayContaining(['-e', 'HOME=/tmp']));
    expect(a).toEqual(expect.arrayContaining(['-e', 'NODE_ENV=production']));
    // No AWS/GH/token-style env is injected.
    expect(a.join(' ')).not.toMatch(/AWS_|GITHUB_TOKEN|OPENAI|ANTHROPIC/);
  });

  it('puts everything after the image as the in-container command (no flag injection)', () => {
    const a = launch.args;
    const imageIdx = a.indexOf(DEFAULT_IMAGE);
    expect(imageIdx).toBeGreaterThan(0);
    expect(a.slice(imageIdx + 1)).toEqual(['node', 'server.js']);
  });

  it('mounts the workspace read-only', () => {
    expect(launch.args).toEqual(expect.arrayContaining(['-v', '/host/target:/workspace:ro', '-w', '/workspace']));
  });

  it('adds --name when a container name is given', () => {
    const named = buildDockerStdioLaunch({
      workspaceHostPath: '/x',
      command: 'node',
      args: ['s.js'],
      containerName: 'mcp-trust-test-1',
    });
    expect(named.args).toEqual(expect.arrayContaining(['--name', 'mcp-trust-test-1']));
  });

  it('hostile server args cannot inject docker flags (they land after the image)', () => {
    const evil = buildDockerStdioLaunch({
      workspaceHostPath: '/x',
      command: 'node',
      args: ['-v', '/var/run/docker.sock:/var/run/docker.sock', '--privileged'],
    });
    const imageIdx = evil.args.indexOf(DEFAULT_IMAGE);
    // The dangerous-looking tokens are only container-command args, after the image.
    expect(evil.args.indexOf('--privileged')).toBeGreaterThan(imageIdx);
  });
});

describe('sandbox command allowlist', () => {
  it('allows interpreter commands only', () => {
    expect(isCommandAllowed('node')).toBe(true);
    expect(isCommandAllowed('/usr/local/bin/node')).toBe(true);
    expect(isCommandAllowed('python3')).toBe(true);
    expect(isCommandAllowed('npx')).toBe(false);
    expect(isCommandAllowed('bash')).toBe(false);
    expect(isCommandAllowed('sh')).toBe(false);
    expect(isCommandAllowed('curl')).toBe(false);
    expect(isCommandAllowed('docker')).toBe(false);
  });

  it('assertCommandAllowed throws for disallowed commands', () => {
    expect(() => assertCommandAllowed('node')).not.toThrow();
    expect(() => assertCommandAllowed('npx')).toThrow(SandboxCommandNotAllowedError);
  });
});
