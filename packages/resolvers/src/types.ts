import type { CoverageState, DiscoveredFile, PackageMetadata } from '@mcp-trust/core';

export interface ConfigFileContent {
  path: string;
  content: string;
}

export interface ResolveOutput {
  sourceDir?: string;
  metadata?: PackageMetadata;
  resolvedRef?: string;
  configFiles: ConfigFileContent[];
  files: DiscoveredFile[];
  /** Code languages present in the target that MCP Trust cannot analyze. */
  unanalyzedLanguages: string[];
  notes: string[];
  packageMetadataState: CoverageState;
  staticState: CoverageState;
}

export function emptyResolveOutput(): ResolveOutput {
  return {
    configFiles: [],
    files: [],
    unanalyzedLanguages: [],
    notes: [],
    packageMetadataState: 'not_available',
    staticState: 'not_available',
  };
}
