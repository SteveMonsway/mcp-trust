# Roadmap

MCP Trust is **open-core**: the scanner, rules, GitHub Action and public reports are free
and open-source (Apache-2.0) forever. Team/cloud features are planned as a paid layer on top.
Short and honest — this reflects intent, not commitments or dates.

## Available now — v0.5 (free, open-source)

- CLI scanner for GitHub / npm / local targets.
- 30 deterministic rules + 12 Semgrep AST rules (JS / TS / Python).
- Capability map, evidence-based `APPROVE / … / BLOCK` decision.
- Docker sandbox for safe runtime introspection.
- Reports: JSON · Markdown · **HTML** · **SARIF 2.1.0**.
- **GitHub Action** — PR comments, Code Scanning upload, fail-on threshold.
- **Public benchmark** over 41 real MCP servers ([reports](public-reports/README.md)).

## Next — still free, open-source

- **Policy file** (`mcp-trust-policy.yml`, `--policy`) — allow/deny capabilities per project.
- **More languages** — code rules for Go, Rust, Java, C# (today they are honestly flagged
  as *not analyzed*, never silently "safe").
- More rules + fewer false positives, driven by real-world reports.
- **Grow the public benchmark to 500+ servers** ([plan](docs/benchmark-expansion-plan.md)).
- Packages published to npm; versioned releases via Changesets.

## Later — Team / Cloud (paid, for companies)

For organizations that need this across many repos and people:

- Private repo & internal MCP-server scans.
- Org **inventory + risk history** dashboard.
- **Continuous monitoring** — re-scan on update, alert when risk changes.
- **Slack alerts**, GitHub App, scheduled scans.
- SSO, custom rules/policies, compliance exports, on-prem/self-hosted.

Interested in the team/cloud tier or a private pilot? Open an issue or start a discussion.

## Not building

An "antivirus" or a guarantee of safety. MCP Trust is **evidence-based risk assessment +
policy gate** — a strong input to human security review, not a replacement for it.
