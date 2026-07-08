/** Default container image for stdio introspection. Node LTS matches the
 * project minimum (Node 22). Python servers need a different image (deferred). */
export const DEFAULT_IMAGE = 'node:22-bookworm-slim';

/** Everything after the image in the docker argv is the in-container command,
 * so hostile server args cannot inject docker flags. */
export interface DockerRunOptions {
  /** Container image. Defaults to DEFAULT_IMAGE. */
  image?: string;
  /** Host path mounted read-only at /workspace. */
  workspaceHostPath: string;
  /** In-container startup command (must be allowlisted by the caller). */
  command: string;
  /** Args passed to the startup command inside the container. */
  args: string[];
  /** Container network. Defaults to 'none'. */
  network?: 'none' | 'default';
  /** Memory limit, e.g. '512m'. */
  memory?: string;
  /** CPU limit, e.g. '1'. */
  cpus?: string;
  /** Max process count. */
  pidsLimit?: number;
  /** Extra safe env vars to set inside the container (no host env inherited). */
  env?: Record<string, string>;
  /** Container name (`--name`), so the caller can force-remove it on teardown. */
  containerName?: string;
  /** Run as this `uid:gid` instead of the image default (root). Defaults to an
   * unprivileged user so a kernel/runc exploit doesn't start from uid 0. */
  user?: string;
}

/** Unprivileged uid:gid used by default (nobody:nogroup on Debian/Alpine). */
export const DEFAULT_SANDBOX_USER = '65534:65534';

/** A launch spec ready to hand to a stdio transport (e.g. StdioClientTransport). */
export interface StdioLaunch {
  command: string;
  args: string[];
}
