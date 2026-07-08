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

## 3. Announce — full step-by-step (you do this)

The launch post text is ready in [`docs/blog/mcp-trust-public-benchmark.md`](blog/mcp-trust-public-benchmark.md).
Copy the **title** and **body** from there. Repo link: `https://github.com/SteveMonsway/mcp-trust`.

### 3A. Reddit (do this first — start with r/mcp)

**Heads-up on a brand-new account:** subreddits often auto-hide the first post from accounts
with little "karma" (Reddit's reputation score). To avoid instant removal:

1. **Warm up the account (10 min):** log in at https://www.reddit.com, open a few posts in
   **r/mcp** and **r/LocalLLaMA**, and leave 3–5 genuine comments. This gives you a little karma.
2. **Go to the subreddit:** open https://www.reddit.com/r/mcp/ .
3. **Read the rules** in the right sidebar (30 seconds) — check there's no "no self-promotion" ban
   and whether a post "flair" is required.
4. Click the **"Create Post"** button (top of the subreddit or the "+" in the header).
5. Make sure the community shown is **r/mcp**. Click the **"Text"** tab (NOT "Link" / "Images").
6. **Title field:** paste the title from the blog post.
7. **Body field:** paste the body from the blog post (the repo link is already inside it).
8. If a **Flair** is required, pick one like `Project`, `Resource`, or `Showcase`.
9. Click **"Post"**.
10. **After posting:** stay for ~1 hour and reply to every comment. Offer to scan any MCP server
    people name in the comments (that drives engagement and upvotes). **Do not** delete and
    re-post, and **do not** ask for upvotes — both get you filtered.
11. **If the post disappears / says "removed":** it's likely the new-account filter. Wait a few
    hours (mod queues are manual), or click **"Message the mods"** and say it's an open-source
    security-research project, not an ad. Don't spam other subs meanwhile.
12. **Next day**, post the same thing to **r/LocalLLaMA**, then **r/ClaudeAI**. One per day — never
    all at once (Reddit's spam filter flags rapid cross-posting).

### 3B. Hacker News ("Show HN") — after Reddit is live

New HN accounts can post a "Show HN". Being logged in for a day first helps visibility.

1. Log in at https://news.ycombinator.com .
2. Open the submit page: https://news.ycombinator.com/submit .
3. **Title:** `Show HN: MCP Trust – preflight security scanner for MCP servers` (you can append the
   final server count, e.g. "(scanned ~450 public ones)").
4. **URL:** `https://github.com/SteveMonsway/mcp-trust` .
5. Leave the **Text** box empty. Click **"submit"**.
6. **Immediately** open your submission and post the blog body as the **first comment** — on HN the
   context goes in a comment, not the post. (This is expected for Show HN.)
7. **Best time:** a weekday morning US-Eastern (~08:00–10:00 ET) tends to get the most eyes.
8. Reply to comments quickly and honestly. **Never** ask for upvotes (HN bans for it).

### 3C. Success signal (first 14 days)

100+ GitHub stars, or 5+ teams asking for private scans → keep going. No traction after posting to
all three → reword the title/angle and try once more, or reprioritize.

---

## Checklist

- [x] npm: `@mcp-trust/cli` published, `npx @mcp-trust/cli` works
- [x] Repo public, tagged `v0.5.0`, topics + description set
- [ ] Warm up Reddit account (a few comments) → post to **r/mcp** (text post, blog title+body)
- [ ] Next days: **r/LocalLLaMA**, then **r/ClaudeAI**
- [ ] **Show HN** submission (repo URL) + blog body as the first comment
- [ ] Reply to every comment; offer to scan servers people name
