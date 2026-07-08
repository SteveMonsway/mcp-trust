import type { ScanResult } from '@mcp-trust/core';

/** Serialize the scan result as stable, machine-readable JSON. */
export function renderJson(result: ScanResult): string {
  return JSON.stringify(result, null, 2) + '\n';
}
