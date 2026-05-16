# Release Checklist

This checklist is the package-release path for Scriveno maintainers. It is designed to verify the source checkout, the package tarball, the installed runtime surfaces, the published npm package, and the GitHub release.

## 1. Confirm A Clean Baseline

```bash
git status --short --branch
npm view scriveno version
```

Choose the next package version from npm, not from memory.

## 2. Run Local Gates

```bash
npm run release:check
npm audit --omit=dev --json
node bin/install.js routes --json
node bin/install.js agents --json
node bin/install.js smoke --json
node bin/install.js sync --check --json
git diff --check
```

Also scan text files for the repo writing policy:

```bash
node scripts/check-writing-policy.js
```

If that script does not exist in a checkout yet, run the equivalent local policy scan used by the release operator.

## 3. Clear Previous Local Installs

Before validating a release candidate, clear Scriveno-owned install surfaces so stale files cannot hide installer defects.

```bash
rm -rf "$HOME/.scriveno"
rm -rf "$HOME/.codex/commands/scr"
rm -rf "$HOME/.cursor/commands/scr"
rm -rf "$HOME/.gemini/commands/scr"
rm -rf "$HOME/.gemini/antigravity/commands/scr"
rm -rf "$HOME/.config/opencode/commands/scr"
rm -rf "$HOME/.github/commands/scr"
rm -rf "$HOME/.windsurf/commands/scr"
rm -rf "$HOME/.manus/skills/scriveno"
npm cache clean --force
```

Then reinstall from the checkout:

```bash
npm install -g .
scriveno --runtimes claude-code,cursor,gemini-cli,codex,opencode,copilot,windsurf,antigravity,manus,perplexity-desktop,generic --global --developer --silent
scriveno smoke --json
```

## 4. Pack The Candidate

```bash
mkdir -p dist
npm pack --pack-destination dist
```

Inspect the tarball name and confirm the version matches `package.json`.

## 5. Commit And Tag

```bash
git status --short
git add README.md CHANGELOG.md docs package.json package-lock.json data templates commands .planning test
git commit -m "Release scriveno X.Y.Z"
git tag vX.Y.Z
```

Keep the commit message plain and version-specific.

## 6. Publish To npm

```bash
npm publish --access public
npm view scriveno version
```

The published version must match `package.json` and the tag.

## 7. Push Git And Create GitHub Release

```bash
git push origin main
git push origin vX.Y.Z
gh release create vX.Y.Z dist/scriveno-X.Y.Z.tgz --title "Scriveno X.Y.Z" --notes-file /tmp/scriveno-release-notes.md
```

The release notes should summarize the user-facing change, docs updated, tests run, and npm verification.

## 8. Verify From Published npm

```bash
npm install -g scriveno@latest
scriveno --version
scriveno --runtimes claude-code,cursor,gemini-cli,codex,opencode,copilot,windsurf,antigravity,manus,perplexity-desktop,generic --global --developer --silent
scriveno smoke --json
```

This is the final proof that a fresh user can install the same package that was released.

## 9. Final State

```bash
git status --short --branch
gh release view vX.Y.Z
npm view scriveno version
```

The final state should show a clean worktree, a visible GitHub release, and npm latest aligned to the new version.
