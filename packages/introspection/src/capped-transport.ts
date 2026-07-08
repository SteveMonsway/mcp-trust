import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { StdioServerParameters } from '@modelcontextprotocol/sdk/client/stdio.js';

export interface OutputCaps {
  /** Max total bytes read from the server's stdout across the whole session. */
  maxBytes: number;
  /** Max bytes in a single unframed line (no newline) — catches a flood that
   * never yields a parseable message. */
  maxLineBytes: number;
}

/**
 * Hardened stdio transport for UNTRUSTED servers. The official SDK's `ReadBuffer`
 * grows without bound (`Buffer.concat` per chunk), so a server that streams
 * gigabytes with no newline OOMs the scanner process long before the wall-clock
 * timeout fires. We subclass the SDK transport (keeping its protocol handling and
 * escalating teardown intact) and add a byte ceiling on the child's stdout: on
 * breach we error and close, which kills the child. Peak buffer is bounded to
 * roughly maxBytes + one pipe chunk.
 */
export class CappedStdioClientTransport extends StdioClientTransport {
  private readonly _caps: OutputCaps;
  private _seen = 0;
  private _lineBytes = 0;
  private _capped = false;

  constructor(params: StdioServerParameters, caps: OutputCaps) {
    super(params);
    this._caps = caps;
  }

  override async start(): Promise<void> {
    await super.start();
    // `_process` is a plain property on the SDK transport (not a #private), so a
    // subclass can observe the same stdout stream the SDK's own handler reads.
    const proc = (this as unknown as {
      _process?: { stdout?: NodeJS.ReadableStream & { destroy?: () => void }; kill?: (s?: string) => void };
    })._process;
    const stdout = proc?.stdout;
    if (!stdout) return;
    stdout.on('data', (chunk: Buffer) => {
      if (this._capped) return;
      this._seen += chunk.length;
      const nl = chunk.lastIndexOf(0x0a); // 0x0a = '\n'
      this._lineBytes = nl === -1 ? this._lineBytes + chunk.length : chunk.length - nl - 1;
      if (this._seen > this._caps.maxBytes || this._lineBytes > this._caps.maxLineBytes) {
        this._capped = true;
        // Stop growth IMMEDIATELY: destroying stdout halts the SDK's own
        // ReadBuffer append, and SIGKILL kills the child now — we must NOT wait
        // for the graceful close() (stdin.end → 2s → SIGTERM → 2s → SIGKILL),
        // during which a fast flood would add gigabytes to the buffer.
        try {
          stdout.destroy?.();
        } catch {
          /* already destroyed */
        }
        try {
          proc?.kill?.('SIGKILL');
        } catch {
          /* already gone */
        }
        this.onerror?.(
          new Error(`MCP server exceeded introspection output cap (${this._caps.maxBytes} bytes); aborting.`),
        );
        // close() may reject (stdin.end on an already-killed child → EPIPE); we
        // already SIGKILLed, so swallow it — never surface an unhandled rejection.
        void this.close().catch(() => {});
      }
    });
  }
}
