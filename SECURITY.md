# Security Policy

## Reporting a vulnerability

Please report security issues privately to the maintainers rather than opening a
public issue. Include reproduction steps and affected versions. We aim to acknowledge
reports within a few business days.

## Scanner safety guarantees (Phase 1)

MCP Trust is a security tool and holds itself to the safety model it recommends:

- It **never executes** untrusted MCP servers or package install scripts.
- Runtime introspection runs **only** against trusted fixture paths and only with an
  explicit `--introspect` flag.
- Scanned child processes receive a sanitized environment (no real host secrets),
  a hard timeout, and are killed on completion.
- Secrets are redacted from all evidence, logs, reports and fingerprints.
- MCP Trust does not phone home and stores nothing outside the target workspace and
  the local `reports/` directory.

## Not a guarantee

MCP Trust provides evidence-based risk assessment. It does not guarantee that a server
is safe or malicious, and is not a substitute for code review, sandboxing, endpoint
security or vendor risk management.
