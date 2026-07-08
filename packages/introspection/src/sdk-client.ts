import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { CappedStdioClientTransport } from './capped-transport.js';

/** Identifier recorded in reports for the introspection client implementation. */
export const INTROSPECTION_CLIENT = '@modelcontextprotocol/sdk';

/** Output ceilings for an untrusted server's stdout (see CappedStdioClientTransport).
 * Kept small on purpose: the SDK's ReadBuffer uses O(n²) Buffer.concat, so the
 * transient copy cost — not just the final buffer — scales with the cap. 4 MB is
 * far more than a real discovery response needs while bounding the memory spike. */
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
const MAX_LINE_BYTES = 4 * 1024 * 1024;
/** Per-request timeout so we don't depend on the SDK's 60s default. */
const REQUEST_TIMEOUT_MS = 15_000;

export interface SdkStdioParams {
  /** Executable to spawn (host mode: `node`; docker mode: `docker`). */
  command: string;
  args: string[];
  /** Working directory for the spawned process (host mode). */
  cwd?: string;
  /** Sanitized env passed to the process. When omitted the SDK uses its own
   * safe default subset (getDefaultEnvironment). */
  env?: Record<string, string>;
  /** Overall wall-clock budget for connect + discovery. */
  timeoutMs: number;
}

/** Raw, protocol-shaped discovery result from a single stdio server. */
export interface RawCapabilities {
  serverInfo?: { name?: string; version?: string };
  serverCapabilities?: Record<string, unknown>;
  tools: Array<{ name: string; title?: string; description?: string; inputSchema?: unknown }>;
  resources: Array<{ uri?: string; name?: string; description?: string }>;
  prompts: Array<{ name: string; description?: string }>;
}

/**
 * Connect to a stdio MCP server with the official SDK client, run the discovery
 * handshake (initialize → list tools/resources/prompts), and return the raw
 * capabilities. Never calls arbitrary tools. Returns null on any failure or
 * timeout. Always tears down the transport (which kills the child process).
 */
export async function introspectWithSdk(params: SdkStdioParams): Promise<RawCapabilities | null> {
  // Declare ZERO client capabilities: a malicious server then has no handler to
  // invoke for sampling/elicitation/roots (the SDK auto-rejects them).
  const client = new Client({ name: 'mcp-trust', version: '0.1.0' }, { capabilities: {} });
  const transport = new CappedStdioClientTransport(
    {
      command: params.command,
      args: params.args,
      cwd: params.cwd,
      env: params.env,
      stderr: 'ignore',
    },
    { maxBytes: MAX_TOTAL_BYTES, maxLineBytes: MAX_LINE_BYTES },
  );

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), params.timeoutMs);
  });

  const opts = { timeout: REQUEST_TIMEOUT_MS };

  const work = (async (): Promise<RawCapabilities | null> => {
    await client.connect(transport, opts);
    const caps = client.getServerCapabilities() as Record<string, unknown> | undefined;

    // Only call a list method the server actually advertises. `client.listTools()`
    // compiles each tool's outputSchema through Ajv; a hostile server could throw
    // there to make listTools() reject. We must NOT let that silently become an
    // empty tool list (which would hide dangerous tools from the report), so a
    // failure of an *advertised* capability fails the whole introspection honestly.
    let tools: RawCapabilities['tools'] = [];
    if (caps?.tools) {
      const r = await client.listTools({}, opts).catch(() => null);
      if (r === null) return null; // advertised tools but failed to list → suspicious
      tools = (r.tools ?? []).map((t) => ({
        name: t.name,
        title: t.title,
        description: t.description,
        inputSchema: t.inputSchema,
      }));
    }

    let resources: RawCapabilities['resources'] = [];
    if (caps?.resources) {
      const r = await client.listResources({}, opts).catch(() => ({ resources: [] }));
      resources = (r.resources ?? []).map((x) => ({ uri: x.uri, name: x.name, description: x.description }));
    }

    let prompts: RawCapabilities['prompts'] = [];
    if (caps?.prompts) {
      const r = await client.listPrompts({}, opts).catch(() => ({ prompts: [] }));
      prompts = (r.prompts ?? []).map((p) => ({ name: p.name, description: p.description }));
    }

    return { serverInfo: client.getServerVersion(), serverCapabilities: caps, tools, resources, prompts };
  })();

  try {
    return await Promise.race([work, timeout]);
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
    await client.close().catch(() => {
      /* transport already down */
    });
  }
}
