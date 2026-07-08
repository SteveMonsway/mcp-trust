import { defineConfig } from 'tsup';
import { copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  // Inline every @mcp-trust/* workspace package so the published CLI is a single
  // self-contained file that does NOT depend on the (unpublished) internal
  // packages. Genuine npm dependencies (@modelcontextprotocol/sdk, execa,
  // js-yaml) stay external and are declared in package.json `dependencies`.
  noExternal: [/^@mcp-trust\//],
  // Ship the Semgrep ruleset beside the bundle so defaultRulesetPath() finds it
  // when the CLI is bundled (npm install / GitHub Action run the bundled dist).
  onSuccess: async () => {
    copyFileSync(
      join(here, '../static-scanner/rules/mcp-semgrep.yml'),
      join(here, 'dist/mcp-semgrep.yml'),
    );
  },
});
