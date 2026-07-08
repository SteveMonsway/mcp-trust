# Sandboxing & Adversarial Hardening

MCP Trust scans **untrusted, potentially hostile** targets: a malicious actor may
deliberately publish an MCP server / npm package / GitHub repo / config crafted to
break, DoS, or exfiltrate from the machine running the scanner. This document
records the threat model and the concrete mitigations, most of which are covered
by tests (`packages/*/tests/*hardening*`, `injection`, `command-builder`, ReDoS
timing in `rules.test.ts`).

## Sandbox levels (TZ §6.6)

- **Level 0** — no execution. Static + config analysis only. Default.
- **Level 1** — host process isolation for **trusted fixtures only** (`--introspect`
  without `--sandbox`): detached process is never used for untrusted code; sanitized
  env, hard timeout, force-kill. Gate: `canIntrospect` (only `fixtures/mcp/`,
  `examples/`, `mock-mcp-servers/`).
- **Level 2** — Docker container (`--sandbox docker`). The only mode allowed to run
  a **real (non-fixture)** server.

## Level 2 Docker hardening (`packages/sandbox/src/command-builder.ts`)

Launch argv (everything **after the image is the in-container command**, so hostile
config `args` cannot inject docker flags):

```
docker run --rm -i
  --network none            # no egress: no exfiltration / C2 / SSRF
  --read-only               # immutable root fs
  --tmpfs /tmp:rw,noexec,nosuid,size=64m   # writable scratch, no exec, no setuid
  --memory 512m --cpus 1 --pids-limit 128  # DoS / fork-bomb limits
  --cap-drop ALL            # no Linux capabilities
  --security-opt no-new-privileges         # cannot gain privileges (setuid)
  --user 65534:65534        # unprivileged (nobody) — not root
  -e HOME=/tmp -e NODE_ENV=production -e MCP_TRUST_INTROSPECTION=1  # no host env inherited
  -v <target>:/workspace:ro -w /workspace  # target mounted read-only
  <image> <command> <args...>              # command allowlisted to node/python/python3
```

Verified from **inside** the container (empirically): `CapEff=0`, `NoNewPrivs=1`,
`Seccomp=2` (default profile), no network, no `docker.sock`, read-only rootfs and
workspace, no host paths, no host secrets, `uid=65534`.

### Known Docker escape vectors → status

| Vector | Status | Mitigation |
|---|---|---|
| `/var/run/docker.sock` mount → daemon takeover | CLOSED | never mounted; container has no socket + no network to reach a daemon |
| `--privileged` | CLOSED | never emitted (`UNSAFE_DOCKER_FLAGS` asserted absent) |
| Excess capabilities (CAP_SYS_ADMIN, CAP_NET_RAW…) | CLOSED | `--cap-drop ALL` (`CapEff=0`) |
| Privilege escalation via setuid | CLOSED | `--security-opt no-new-privileges` + `nosuid` tmpfs |
| Root-in-container → kernel/runc exploit foothold | CLOSED | `--user 65534:65534` (unprivileged) |
| CVE-2019-5736 (runc `/proc/self/exe` overwrite) | MITIGATED | read-only rootfs + non-root + cap-drop + trusted official image; also relies on host runc being patched |
| CVE-2024-21626 (runc "leaky vessels" WORKDIR) | MITIGATED | we control `-w /workspace` (not taken from a hostile image) + patched host docker |
| Network exfiltration / SSRF / C2 | CLOSED | `--network none` (0 interfaces, no DNS) |
| Fork bomb / memory / CPU DoS | CLOSED | `--pids-limit 128`, `--memory 512m`, `--cpus 1` |
| Writable/exec `/tmp` dropper | CLOSED | `--tmpfs /tmp:noexec,nosuid` |
| Host secret/env leak to server | CLOSED | container inherits no host env; only 3 constant vars set |
| Install-time execution (`npx`/`curl|sh`) | CLOSED | command allowlist = `node`/`python`/`python3` only |
| Orphaned container after timeout/SIGKILL | CLOSED | `--rm` + `--name` + explicit `docker rm -f` on teardown |

## Scanner-host hardening (malicious target → the mcp-trust process)

The container isolates the *server*, but the scanner process still **reads the
server's output and repo files** — those paths are hardened independently.

| Threat | Where | Mitigation |
|---|---|---|
| stdout flood → unbounded SDK `ReadBuffer` (O(n²) `Buffer.concat`) → OOM | `introspection/capped-transport.ts` | byte cap (4 MB); on breach: destroy stdout + SIGKILL immediately (not the graceful close) |
| Huge `tools/list` (millions of tools / multi-MB fields) → CPU/mem amplification | `introspection/stdio-introspector.ts` | cap item counts (1000) + truncate name/desc at ingestion |
| Malicious server hides tools by making `tools/list` throw (Ajv compile) | `introspection/sdk-client.ts` | advertised-but-failed list → introspection fails **honestly** (null), never a silent empty list |
| Host identity env leak (SDK merges `getDefaultEnvironment()`) | `introspection/stdio-introspector.ts` | explicitly override USER/LOGNAME/SHELL/TERM/HOME/PATH |
| ANSI/terminal escape injection via tool name/desc | `core/utils/redact.ts` (`sanitizeUntrustedText`) + `console-renderer.ts` | strip C0/C1 + ANSI CSI/OSC at ingestion and at console render |
| Markdown/HTML injection via tool name / file path | `report/markdown-report.ts` | escape `\|`, backticks, `<`/`>` in table cells & inline code |
| Server-initiated sampling/elicitation/roots | `introspection/sdk-client.ts` | client declares **zero** capabilities → SDK auto-rejects |
| ReDoS: crafted ≤512 KB file → multi-minute regex hang | `rules/**`, `dictionaries/capabilities.ts` | bounded gap quantifiers (`[^)]{0,500}` etc.) — quadratic blowup removed (timing test) |
| Symlink exfil: repo `link -> /etc` read into evidence | `static-scanner/file-discovery.ts` (skip symlinks) + `resolvers/github-resolver.ts` (`safeScanRoot` realpath) | walk skips symlinks; scan-root compared by **real** path |
| File-walk DoS (millions of files / deep nesting) | `static-scanner/file-discovery.ts` | visited-entry cap (100k), depth cap (40), per-file 512 KB |
| Decompression / large read OOM | `resolvers/npm-resolver.ts`, `metadata`, `file-discovery` | npm response byte-capped (8 MB); file reads size-capped |
| git-lfs smudge SSRF, huge blobs, host gitconfig `insteadOf` | `resolvers/github-resolver.ts` | `GIT_LFS_SKIP_SMUDGE=1` + smudge filters disabled, `--filter=blob:limit=10m`, minimal env (no HOME/secrets) |
| Temp-dir leak on error | `resolvers/github-resolver.ts` | clone cleanup in `try/finally` |
| Semgrep telemetry/registry fetch, host login/settings read | `static-scanner/semgrep-runner.ts` | **local `--config` only** (never the registry), `SEMGREP_ENABLE_VERSION_CHECK=0` + `--metrics off`, `HOME=tmpdir` (no host login), minimal env |
| Hostile target suppresses findings via in-code `# nosemgrep` | `static-scanner/semgrep-runner.ts` | `--disable-nosem` — in-code suppression ignored |
| Semgrep CPU/mem/output blowup on crafted repo | `static-scanner/semgrep-runner.ts` | `--jobs 1`, `--timeout`/`--timeout-threshold`, `--max-memory`, `--max-target-bytes`; overall wall-clock kill (SIGKILL) + 16 MB stdout byte cap; failure degrades to `partial`/`error`, never throws |
| Hostile filename/line text into evidence | `core/findings/semgrep-finding.ts` | path + snippet ANSI/control-stripped (`sanitizeUntrustedText`) and secret-redacted (`buildFinding`) |

Semgrep performs **static AST analysis only — it never executes the target's
code** (unlike runtime introspection), so it needs no container; the hardening
above bounds the analyzer itself against a hostile repo.

## Dependency posture

`pnpm audit` shows **no** advisory on the runtime dependency tree of
`@modelcontextprotocol/sdk` or `execa` (all advisories are dev-tooling only). Our
client import surface reaches only `cross-spawn`, `zod`, `ajv` — the SDK's
HTTP/SSE/OAuth/server modules (express/jose/eventsource/pkce) are present but never
imported, so their CVE surface is dormant.

## Residual risks (honest remainder)

- Level 1 host mode does not process-group-kill grandchildren; acceptable because it
  runs **only trusted fixtures** we author.
- Container image is pinned by tag (`node:22-bookworm-slim`), not by digest — a
  future hardening could pin by sha256.
- Kernel/runc CVEs depend on the host keeping docker/runc patched; our flags mitigate
  but do not replace host patching.
- ReDoS bounds cap match length at 500 chars; a legitimate call with >500 chars of
  args before the token is not matched (accepted trade-off vs. DoS).
- Semgrep is run via `spawnSync` with a wall-clock timeout + SIGKILL on the direct
  process; its internal core subprocess is bounded by semgrep's own `--timeout` but
  is not process-group-killed by us. Acceptable: semgrep is a trusted analyzer we
  install, not the hostile target, and `--jobs 1` bounds concurrency.
