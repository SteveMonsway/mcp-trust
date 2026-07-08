import type { Coverage, ScanOptions } from './types.js';

export function defaultCoverage(): Coverage {
  return {
    configScan: 'not_available',
    staticScan: 'not_available',
    capabilityInference: 'none',
    introspection: 'disabled',
    semgrep: 'not_available',
    docker: 'not_available',
    dependencyScan: 'not_available',
    runtimeScan: 'not_available',
    packageMetadata: 'not_available',
  };
}

export function defaultScanOptions(overrides: Partial<ScanOptions> = {}): ScanOptions {
  return {
    formats: ['console', 'json', 'md'],
    failOn: 'high',
    noExec: true,
    introspect: false,
    timeoutMs: 30_000,
    sandbox: 'none',
    semgrep: true,
    ...overrides,
  };
}
