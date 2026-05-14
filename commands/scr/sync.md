---
description: Synchronize installed Scriveno runtime commands, skills, and agents with the current source.
argument-hint: "[--check] [--apply] [--runtime <key>] [--detected] [--global|--project] [--writer|--developer]"
---

# Sync

You are synchronizing Scriveno's installed agent surfaces with the current Scriveno source tree.

This command is for local runtime drift: Codex skills, Codex command mirrors, Claude command files, Cursor command files, and agent prompts that no longer match the source files in the Scriveno package or repo.

This is not a package upgrade command. Do not fetch a newer Scriveno release, do not change npm dependencies, and do not modify manuscript content. If the writer wants a newer published package version, that belongs to a future `/scr:update` command.

## Prerequisites

- Node.js >=20.0.0
- A Scriveno source root with `package.json`, `bin/install.js`, `commands/scr/`, and `agents/`
- At least one target runtime directory, or an explicit `--runtime` / `--detected` choice

If you cannot find a Scriveno source root, stop and explain that `/scr:sync` needs to run from the Scriveno package or repo checkout. Suggest reinstalling with `npx scriveno-cli@latest --detected --global --writer --silent` only when the writer wants the latest published package instead of local source sync.

## Usage

```
/scr:sync
/scr:sync --check
/scr:sync --apply --runtime codex --global --developer
/scr:sync --apply --detected --global --writer
```

## What To Do

1. Locate the Scriveno source root:
   - First, check the current working directory and its parents for `package.json` with `"name": "scriveno-cli"` plus `bin/install.js`.
   - If running from an installed command copy that contains a `scriveno-cli-installed-command` marker, derive the source root from that marker's `source:` path.
   - If neither works, stop with the prerequisite message above.
2. Read `package.json` from the source root and report the source version.
3. Detect target runtimes:
   - If `--runtime <key>` is supplied, use that runtime only.
   - If `--detected` is supplied, pass `--detected` to the installer.
   - If no runtime is supplied, detect installed Scriveno surfaces by checking known runtime locations from `bin/install.js`, especially:
     - Codex: `~/.codex/skills/scr-*`, `~/.codex/commands/scr/`, `~/.codex/agents/`
     - Claude Code: `~/.claude/commands/scr-*.md`, `~/.claude/agents/`
     - Cursor: `~/.cursor/commands/scr/`, `~/.cursor/agents/`
     - Gemini CLI: `~/.gemini/commands/scr/`, `~/.gemini/agents/`
     - OpenCode: `~/.config/opencode/commands/scr/`, `~/.config/opencode/agents/`
     - GitHub Copilot: `~/.github/commands/scr/`, `~/.github/agents/`
     - Windsurf: `~/.windsurf/commands/scr/`, `~/.windsurf/agents/`
     - Antigravity: `~/.gemini/antigravity/commands/scr/`, `~/.gemini/antigravity/agents/`
4. Compare source files against installed files:
   - Compare command counts.
   - Compare a representative hash set for `commands/scr/autopilot.md`, `commands/scr/next.md`, `commands/scr/scan.md`, `commands/scr/sync.md`, and all generated Codex `SKILL.md` wrappers when present.
   - Check that installed Codex commands include current response-contract and source-marker behavior after reinstall.
   - Report each runtime as `current`, `stale`, `missing`, or `unknown`.
5. Decide mode:
   - `--check`: report only. Do not write files.
   - `--apply`: run the installer.
   - No flag: if stale installed Scriveno-owned files are detected, ask the writer before applying. If everything is current, report that no sync is needed.
6. When applying, run from the source root:

```
node bin/install.js --runtime <key> --global --writer --silent
```

Adjust flags from the command arguments:
   - Use `--detected` instead of `--runtime <key>` when requested.
   - Use `--project` instead of `--global` when requested.
   - Use `--developer` instead of `--writer` when requested.

7. After applying, verify:
   - Re-read installed command counts.
   - Confirm `sync.md` is installed for each target runtime.
   - For Codex, confirm both `~/.codex/commands/scr/sync.md` and `~/.codex/skills/scr-sync/SKILL.md` exist in the chosen scope.
   - Confirm no stale runtime files remain in the checked target set.
8. Report:
   - Source version
   - Runtime targets checked
   - Runtime targets updated
   - Any skipped targets and why
   - Suggested project-level follow-up with `/scr:scan`

## Safety Rules

- Only overwrite Scriveno-owned installed runtime files.
- Do not edit `.manuscript/` files.
- Do not run `npm install`, `npm update`, `npm version`, `npm publish`, `git pull`, or any network command.
- Do not delete non-Scriveno files from runtime directories.
- Do not claim a runtime is current unless command counts and key files were checked.
- If an installed runtime has user-modified Scriveno files without an installer marker, report it and ask before replacing them.

## Response Contract

Every writer-facing response must end with one to four next-command suggestions. Each suggestion must include a short explanation of what that path will do.

Use this format:

```markdown
Next commands:
- `/scr:...`: One short sentence explaining what this path will do.
- `/scr:...`: One short sentence explaining what this alternate path will do.
```

If exactly one path is clearly best, provide one suggestion. If two, three, or four useful paths exist, show them as alternatives. Do not force a linear path when the writer has a real choice.

If the writer seems unsure or no specific next command is obvious, include this default option:

```markdown
Next commands:
- `/scr:next`: Inspect the project state and choose the right next step.
```

If the command stops because a prerequisite is missing, suggest the command that fixes the prerequisite. Keep every explanation practical and writer-facing.

## Tone

Clear and operational. This command is maintenance, so keep the report compact and avoid manuscript-writing language.
