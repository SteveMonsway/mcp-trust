import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const pkg = (name: string) =>
  fileURLToPath(new URL(`./packages/${name}/src/index.ts`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@mcp-trust/core': pkg('core'),
      '@mcp-trust/rules': pkg('rules'),
      '@mcp-trust/resolvers': pkg('resolvers'),
      '@mcp-trust/config-scanner': pkg('config-scanner'),
      '@mcp-trust/static-scanner': pkg('static-scanner'),
      '@mcp-trust/introspection': pkg('introspection'),
      '@mcp-trust/sandbox': pkg('sandbox'),
      '@mcp-trust/report': pkg('report'),
    },
  },
  test: {
    globals: true,
    include: ['packages/**/*.{test,spec}.ts'],
    environment: 'node',
  },
});
