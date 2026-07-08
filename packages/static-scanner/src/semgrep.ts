import { spawnSync } from 'node:child_process';

/** Detect whether the semgrep CLI is available. Phase 1 does not run it; the
 * regex/AST-lite rules are the primary engine and coverage reports honestly. */
export function isSemgrepAvailable(): boolean {
  try {
    const res = spawnSync('semgrep', ['--version'], { timeout: 5000, stdio: 'ignore' });
    return res.status === 0;
  } catch {
    return false;
  }
}

export const STATIC_SCANNER_MODE = 'regex_ast_lite' as const;

/** Detect whether Docker is available. Phase 1 never uses it (sandbox is Phase 2);
 * this only lets coverage report `disabled` (present) vs `not_available` (absent). */
export function isDockerAvailable(): boolean {
  try {
    const res = spawnSync('docker', ['version', '--format', '{{.Server.Version}}'], {
      timeout: 5000,
      stdio: 'ignore',
    });
    return res.status === 0;
  } catch {
    return false;
  }
}
