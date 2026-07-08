import {
  DEFAULT_IMAGE,
  DEFAULT_SANDBOX_USER,
  type DockerRunOptions,
  type StdioLaunch,
} from './types.js';

/** Docker flags that must never appear in a sandbox launch. Exposed so tests
 * can assert the builder never emits them. */
export const UNSAFE_DOCKER_FLAGS: readonly string[] = [
  '--privileged',
  '--network=host',
  '--cap-add',
  '--pid=host',
  '--ipc=host',
  '--userns=host',
];

/** Env vars always set inside the container. HOME points at the writable tmpfs
 * (not a host home), so `~/.ssh`, `~/.aws` resolve to an empty ephemeral dir. */
function baseEnv(extra: Record<string, string> | undefined): Record<string, string> {
  return {
    HOME: '/tmp',
    NODE_ENV: 'production',
    MCP_TRUST_INTROSPECTION: '1',
    ...extra,
  };
}

/**
 * Build a `docker run` launch spec for stdio introspection. Everything after
 * the image is the in-container command, so hostile server args cannot inject
 * docker flags. The container gets no host env, no host home, no network by
 * default, a read-only root filesystem with a small writable /tmp tmpfs, all
 * capabilities dropped and no-new-privileges.
 */
export function buildDockerStdioLaunch(opts: DockerRunOptions): StdioLaunch {
  const image = opts.image ?? DEFAULT_IMAGE;
  const network = opts.network ?? 'none';
  const memory = opts.memory ?? '512m';
  const cpus = opts.cpus ?? '1';
  const pidsLimit = opts.pidsLimit ?? 128;

  const args: string[] = [
    'run',
    '--rm',
    '-i', // keep stdin open for the stdio JSON-RPC stream; no -t (would corrupt framing)
    '--network',
    network,
    '--read-only',
    '--tmpfs',
    '/tmp:rw,noexec,nosuid,size=64m',
    '--memory',
    memory,
    '--cpus',
    cpus,
    '--pids-limit',
    String(pidsLimit),
    '--cap-drop',
    'ALL',
    '--security-opt',
    'no-new-privileges',
    // Run unprivileged: don't start from uid 0, so a kernel/runc escape has no
    // root in the container to build on (defense in depth atop cap-drop/seccomp).
    '--user',
    opts.user ?? DEFAULT_SANDBOX_USER,
  ];

  if (opts.containerName) {
    args.push('--name', opts.containerName);
  }

  for (const [k, v] of Object.entries(baseEnv(opts.env))) {
    args.push('-e', `${k}=${v}`);
  }

  args.push('-v', `${opts.workspaceHostPath}:/workspace:ro`, '-w', '/workspace');
  args.push(image);
  args.push(opts.command, ...opts.args);

  return { command: 'docker', args };
}
