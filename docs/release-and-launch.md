# Release & launch — step by step

Plain, ordered steps. Do them **top to bottom**: npm first, then make the repo public, then announce.

---

## 0. How to run it, and where the report goes (30-second version)

**Users do NOT install anything.** `npx` downloads the tool on demand and runs it:

```bash
npx @mcp-trust/cli scan github:owner/repo        # or npm:@org/pkg, or ./local/path
```

- **Run:** `npx @mcp-trust/cli scan <target>` — no clone, no `npm install` needed (npx fetches
  it). A one-file self-contained bundle, so it "just works" once published (step 1).
- **Verify it worked:** it prints a decision (`APPROVE / … / BLOCK`) and writes report files.
- **Find the report:** `./reports/<name>.md` and `./reports/<name>.html` (open the HTML in a
  browser). Add `--format json,md,html,sarif` and `--output <dir>` to control outputs.
- **Benchmark reports for 41 public servers:** [`public-reports/`](../public-reports/README.md).

> SEO is already prepared: the repo's description and search topics
> (`mcp`, `model-context-protocol`, `ai-security`, …) are set, so it's discoverable the
> moment it goes public.

---

## 1. Publish to npm (you do this — needs your npm account)

You need an npm account: sign up at **https://www.npmjs.com/signup** (free).

```bash
# from the repo root
npm login                       # opens npmjs.com to authenticate
pnpm install && pnpm build      # build the self-contained CLI bundle
pnpm test                       # sanity: all green

# publish the CLI package (it is already configured as public)
cd packages/cli
npm publish
```

That's it — only **`@mcp-trust/cli`** is published (it bundles everything else). Verify:

```bash
npx @mcp-trust/cli@latest scan github:modelcontextprotocol/servers/src/time
```

If npm says the `@mcp-trust` scope is taken, create a free org named `mcp-trust` at
**https://www.npmjs.com/org/create** (it's yours if available), then `npm publish` again.

---

## 2. Make the repository public + tag the release

The scanner needs **no server** — publishing the repo is all that's required for people to
use it and for the GitHub Action reference to resolve.

1. **Tag the release** (so `...@v0.5.0` in the Action example works):
   ```bash
   git tag v0.5.0 && git push origin v0.5.0
   ```
2. **Make public:** GitHub → your repo → **Settings → General → Danger Zone →
   Change repository visibility → Public**. (Or: `gh repo edit --visibility public`.)
3. **Add topics** (Settings → top of repo → ⚙ next to *About* → Topics):
   ```
   mcp  model-context-protocol  ai-security  agent-security  llm-security
   security-scanner  supply-chain-security  semgrep  sarif  github-action
   ```

> Tip: pin consumers to the version tag (`@v0.5.0`) rather than `@main` so a future
> change can't unexpectedly alter their CI.

---

## 3. Announce (you do this — the post is already written)

The launch post is ready: [`docs/blog/mcp-trust-public-benchmark.md`](blog/mcp-trust-public-benchmark.md)
("We scanned 41 public MCP servers…").

- **Hacker News** — https://news.ycombinator.com/submit · title:
  `Show HN: MCP Trust – preflight security scanner for MCP servers (scanned 41 public ones)`
  · URL: your repo. Then post the blog text as the first comment.
- **Reddit** — r/mcp, r/LocalLLaMA, r/ClaudeAI, r/devops. Same title, link the repo, paste the post.
- **Success signal (first 14 days):** 100+ stars, or 5+ teams asking for private scans → keep going.

---

## Checklist

- [ ] `npm login` → `npm publish` (packages/cli) → `npx @mcp-trust/cli` works
- [ ] `git tag v0.5.0 && git push origin v0.5.0`
- [ ] Repo visibility → Public; topics added
- [ ] Post to Hacker News + Reddit using the blog text
