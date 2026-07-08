import { execa } from 'execa';

/**
 * True only when the Docker daemon is reachable. Uses `docker version` with a
 * server-side format, so a present-but-stopped daemon reports unavailable
 * (the client binary alone is not enough). Never throws.
 */
export async function isDockerAvailable(timeoutMs = 5000): Promise<boolean> {
  try {
    const r = await execa('docker', ['version', '--format', '{{.Server.Version}}'], {
      timeout: timeoutMs,
      reject: false,
    });
    return r.exitCode === 0 && typeof r.stdout === 'string' && r.stdout.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Best-effort teardown of a named container. Guards against the case where the
 * stdio transport's SIGKILL orphaned the `docker run` client but the container
 * kept running (dockerd owns it). Never throws.
 */
export async function forceRemoveContainer(name: string, timeoutMs = 5000): Promise<void> {
  try {
    await execa('docker', ['rm', '-f', name], { timeout: timeoutMs, reject: false });
  } catch {
    /* container already gone or docker unavailable */
  }
}
