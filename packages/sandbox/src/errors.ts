/** Docker was requested for sandboxed introspection but is not usable
 * (binary missing or daemon not running). The scanner must NOT silently fall
 * back to unsandboxed host execution — it surfaces this instead. */
export class SandboxUnavailableError extends Error {
  readonly code = 'SANDBOX_UNAVAILABLE';
  constructor(message: string) {
    super(message);
    this.name = 'SandboxUnavailableError';
  }
}

/** The server startup command is not on the introspection allowlist (only
 * interpreter commands like `node`/`python` may run inside the sandbox; package
 * managers and shells are refused to avoid install-time execution). */
export class SandboxCommandNotAllowedError extends Error {
  readonly code = 'SANDBOX_COMMAND_NOT_ALLOWED';
  constructor(public readonly command: string) {
    super(`Command not allowed for sandboxed introspection: ${command}`);
    this.name = 'SandboxCommandNotAllowedError';
  }
}
