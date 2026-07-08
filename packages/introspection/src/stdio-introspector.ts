import { sanitizeUntrustedText, type CapabilityMap, type RuntimeSandboxInfo } from '@mcp-trust/core';
import {
  buildDockerStdioLaunch,
  forceRemoveContainer,
  DEFAULT_IMAGE,
} from '@mcp-trust/sandbox';
import { introspectWithSdk, type RawCapabilities } from './sdk-client.js';

export type IntrospectMode = 'host' | 'docker';

export interface StdioIntrospectRequest {
  mode: IntrospectMode;
  /** Server startup command (host: e.g. `node`; docker: the in-container cmd). */
  command: string;
  args: string[];
  /** Host mode: working directory. Docker mode: host dir mounted RO at /workspace. */
  workdir: string;
  timeoutMs: number;
  /** Docker image override (docker mode only). */
  image?: string;
}

export interface StdioIntrospectResult {
  map: CapabilityMap;
  sandbox?: RuntimeSandboxInfo;
}

/** Minimal sanitized host env. The SDK merges its getDefaultEnvironment()
 * (HOME, LOGNAME, PATH, SHELL, TERM, USER) UNDERNEATH whatever we pass, so we
 * must EXPLICITLY override every one of those keys — otherwise the host username
 * and shell leak to the untrusted server. Keeps PATH so the interpreter resolves;
 * HOME points into the sandbox dir (so `~/.ssh` etc. resolve to an empty place). */
function sanitizedHostEnv(cwd: string): Record<string, string> {
  return {
    PATH: process.env.PATH ?? '',
    HOME: cwd,
    USER: 'mcp-trust',
    LOGNAME: 'mcp-trust',
    SHELL: '/sbin/nologin',
    TERM: 'dumb',
    NODE_ENV: 'production',
    MCP_TRUST_INTROSPECTION: '1',
  };
}

// Caps on an untrusted server's discovery response, applied before the data
// reaches rules/reports so a huge tools/list can't amplify CPU/memory.
const MAX_ITEMS = 1000;
const MAX_NAME_LEN = 256;
const MAX_DESC_LEN = 4000;

let containerCounter = 0;
function uniqueContainerName(): string {
  return `mcp-trust-introspect-${process.pid}-${Date.now()}-${containerCounter++}`;
}

function toCapabilityMap(raw: RawCapabilities): CapabilityMap {
  // Sanitize every server-controlled string (strip ANSI/control chars, cap
  // length) at ingestion, so all downstream consumers — rules, console, markdown,
  // JSON — get neutralized data; and cap item counts to bound work.
  return {
    source: 'introspection',
    serverInfo: {
      name: sanitizeUntrustedText(raw.serverInfo?.name, MAX_NAME_LEN),
      version: sanitizeUntrustedText(raw.serverInfo?.version, MAX_NAME_LEN),
    },
    serverCapabilities: raw.serverCapabilities,
    tools: raw.tools.slice(0, MAX_ITEMS).map((t) => ({
      name: sanitizeUntrustedText(t.name ?? 'unknown', MAX_NAME_LEN),
      title: sanitizeUntrustedText(t.title, MAX_NAME_LEN),
      description: sanitizeUntrustedText(t.description, MAX_DESC_LEN),
      inputSchema: t.inputSchema,
      riskTags: [],
      inferredCapabilities: [],
    })),
    resources: raw.resources.slice(0, MAX_ITEMS).map((r) => ({
      uri: sanitizeUntrustedText(r.uri, MAX_DESC_LEN),
      name: sanitizeUntrustedText(r.name, MAX_NAME_LEN),
      description: sanitizeUntrustedText(r.description, MAX_DESC_LEN),
    })),
    prompts: raw.prompts.slice(0, MAX_ITEMS).map((p) => ({
      name: sanitizeUntrustedText(p.name ?? 'unknown', MAX_NAME_LEN),
      description: sanitizeUntrustedText(p.description, MAX_DESC_LEN),
    })),
    aggregateCapabilities: [],
  };
}

/**
 * Run discovery against a stdio MCP server, either directly on the host (Level 1,
 * trusted fixtures) or inside a locked-down Docker container (Level 2). In docker
 * mode the container is always force-removed on teardown, even if the transport's
 * SIGKILL orphaned the `docker run` client.
 */
export async function introspectStdioServer(
  req: StdioIntrospectRequest,
): Promise<StdioIntrospectResult | null> {
  if (req.mode === 'host') {
    const raw = await introspectWithSdk({
      command: req.command,
      args: req.args,
      cwd: req.workdir,
      env: sanitizedHostEnv(req.workdir),
      timeoutMs: req.timeoutMs,
    });
    return raw ? { map: toCapabilityMap(raw) } : null;
  }

  // docker mode
  const image = req.image ?? DEFAULT_IMAGE;
  const containerName = uniqueContainerName();
  const launch = buildDockerStdioLaunch({
    image,
    workspaceHostPath: req.workdir,
    command: req.command,
    args: req.args,
    network: 'none',
    containerName,
  });
  try {
    const raw = await introspectWithSdk({
      command: launch.command,
      args: launch.args,
      env: process.env.PATH ? { PATH: process.env.PATH } : undefined,
      timeoutMs: req.timeoutMs,
    });
    if (!raw) return null;
    return {
      map: toCapabilityMap(raw),
      sandbox: { kind: 'docker', image, network: 'none', readOnlyRootFilesystem: true },
    };
  } finally {
    await forceRemoveContainer(containerName);
  }
}
