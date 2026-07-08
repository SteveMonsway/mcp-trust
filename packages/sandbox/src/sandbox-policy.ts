import { SandboxCommandNotAllowedError } from './errors.js';

/** Interpreter commands allowed to start a server inside the sandbox. Package
 * managers (npx/npm/pnpm/yarn), shells (bash/sh/zsh), fetchers (curl/wget) and
 * `docker`/`sudo` are refused: introspection must never trigger install-time
 * execution or shell evaluation. Package materialization is a separate step. */
export const ALLOWED_INTROSPECTION_COMMANDS: readonly string[] = ['node', 'python', 'python3'];

/** Normalize a command to its basename (handles absolute paths like
 * `/usr/bin/node`) before allowlist comparison. */
function commandBasename(command: string): string {
  const trimmed = command.trim();
  const segs = trimmed.split(/[\\/]/).filter(Boolean);
  return segs.length > 0 ? segs[segs.length - 1]! : trimmed;
}

export function isCommandAllowed(command: string): boolean {
  return ALLOWED_INTROSPECTION_COMMANDS.includes(commandBasename(command));
}

/** Throws SandboxCommandNotAllowedError when the command is not allowlisted. */
export function assertCommandAllowed(command: string): void {
  if (!isCommandAllowed(command)) {
    throw new SandboxCommandNotAllowedError(command);
  }
}
