import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { defaultScanOptions, type ScanTarget } from '@mcp-trust/core';
import { isDockerAvailable } from '@mcp-trust/static-scanner';
import { runScan } from '../src/pipeline.js';

const dockerAvailable = isDockerAvailable();

const root = (rel: string) => fileURLToPath(new URL(`../../../fixtures/${rel}`, import.meta.url));

function configTarget(rel: string): ScanTarget {
  return { type: 'config', path: root(rel) };
}
function localTarget(rel: string): ScanTarget {
  return { type: 'local', path: root(rel) };
}

describe('scan pipeline (integration)', () => {
  it('flags a risky config and elevates the decision', async () => {
    const result = await runScan(configTarget('configs/unpinned-npx.json'), defaultScanOptions());
    const ids = result.findings.map((f) => f.ruleId);
    expect(ids).toContain('MCP-CONFIG-001');
    expect(ids).toContain('MCP-CONFIG-002');
    expect(ids).toContain('MCP-CONFIG-005');
    expect(['NEEDS_REVIEW', 'BLOCK']).toContain(result.score.decision);
  });

  it('blocks a JS server with child_process.exec', async () => {
    const result = await runScan(localTarget('repos/js-exec'), defaultScanOptions());
    const ids = result.findings.map((f) => f.ruleId);
    expect(ids).toContain('MCP-CODE-001');
    expect(result.score.decision).toBe('BLOCK');
    expect(result.coverage.staticScan).toBe('completed');
  });

  it('approves a safe config with no findings', async () => {
    const result = await runScan(configTarget('configs/safe-config.json'), defaultScanOptions());
    expect(result.findings).toHaveLength(0);
    expect(result.score.decision).toBe('APPROVE');
  });

  it('exposes an API-friendly summary + locator (schema §9.1)', async () => {
    const result = await runScan(configTarget('configs/safe-config.json'), defaultScanOptions());
    expect(result.summary.decision).toBe(result.score.decision);
    expect(result.summary.overallScore).toBe(result.score.overall);
    expect(result.locator).toContain('config:');
    expect(Array.isArray(result.summary.topReasons)).toBe(true);
  });

  it('never leaks a real secret into the JSON result', async () => {
    const result = await runScan(configTarget('configs/secrets-env.json'), defaultScanOptions());
    const json = JSON.stringify(result);
    expect(json).not.toContain('wJalrXUtnFEMI');
    expect(json).not.toMatch(/sk-ant-abcdef/);
  });

  it('introspects a trusted fixture and infers tool capabilities', async () => {
    const result = await runScan(localTarget('mcp/mock-dangerous'), {
      ...defaultScanOptions(),
      introspect: true,
      noExec: false,
    });
    expect(result.coverage.introspection).toBe('completed_trusted_fixture');
    expect(result.capabilityMap?.tools.length).toBeGreaterThan(0);
    expect(result.findings.map((f) => f.ruleId)).toContain('MCP-TOOL-003');
  });

  it('refuses to introspect a real (non-fixture) target', async () => {
    const result = await runScan(
      { type: 'github', owner: 'o', repo: 'r', url: 'https://github.com/o/r' },
      { ...defaultScanOptions(), introspect: true, noExec: false, timeoutMs: 3000 },
    );
    expect(result.coverage.introspection).toBe('skipped_real_target_no_sandbox');
  });

  it('introspects mock-safe on the host via the SDK client (Level 1)', async () => {
    const result = await runScan(localTarget('mcp/mock-safe'), {
      ...defaultScanOptions(),
      introspect: true,
      noExec: false,
    });
    expect(result.coverage.introspection).toBe('completed_trusted_fixture');
    expect(result.capabilityMap?.tools.map((t) => t.name).sort()).toEqual(['add', 'echo']);
    expect(result.runtimeIntrospection?.status).toBe('completed_trusted_fixture');
    expect(result.runtimeIntrospection?.client).toBe('@modelcontextprotocol/sdk');
    expect(result.runtimeIntrospection?.sandbox).toBeUndefined();
  });

  it.skipIf(!dockerAvailable)(
    'introspects mock-safe inside a Docker sandbox (Level 2)',
    async () => {
      const result = await runScan(localTarget('mcp/mock-safe'), {
        ...defaultScanOptions(),
        introspect: true,
        noExec: false,
        sandbox: 'docker',
      });
      expect(result.coverage.introspection).toBe('completed_sandboxed');
      expect(result.capabilityMap?.tools.map((t) => t.name).sort()).toEqual(['add', 'echo']);
      expect(result.runtimeIntrospection?.status).toBe('completed_sandboxed');
      expect(result.runtimeIntrospection?.sandbox).toMatchObject({
        kind: 'docker',
        network: 'none',
        readOnlyRootFilesystem: true,
      });
    },
    60_000,
  );
});
