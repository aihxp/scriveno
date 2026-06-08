---
description: Inspect or change the installed Scriveno command profile.
argument-hint: "[list|status|profile <core|writing|publishing|translation|specialist|full>] [--runtime <runtime>] [--dry-run]"
---

# Surface

You are helping the writer keep Scriveno's installed command surface clear, small, and appropriate for the work they are doing.

Follow the auto-invoke policy. In the source repository it is documented at `docs/auto-invoke-policy.md`. `/scr:surface` is a local installer helper. It does not spawn agents and should not edit a manuscript.

## What This Command Does

Use this command when the writer wants fewer commands, a publishing-only install, a translation-focused install, or a check of what profile is currently installed.

Interactive installs also ask for a command profile. The default remains `full`, and the writer can use this command later to preview or change the profile without deleting project data.

Available profiles:

- `core`: Main writing loop and orientation commands.
- `writing`: Core workflow plus revision, structure, character, and quality commands.
- `publishing`: Core workflow plus export, publishing, metadata, and platform packaging commands.
- `translation`: Core workflow plus translation, localization, glossary, and multi-publish commands.
- `specialist`: Core workflow plus sacred, illustration, collaboration, and utility surfaces.
- `full`: Every Scriveno command.

## Actions

### `list`

Run:

```bash
scriveno surface list
```

Report each profile, command count, and intended use.

### `status`

Run:

```bash
scriveno surface status
```

Report:

- Installed profile from `.scriveno/settings.json` or `~/.scriveno/settings.json`
- Installed runtimes
- Scope (`project` or `global`)
- Writer or developer mode
- Suggested profile if the current one is much larger than the active workflow needs

### `profile <name>`

Before changing anything, run a dry run:

```bash
scriveno surface profile <name> --dry-run
```

If the writer confirms, reinstall that profile for the same runtime surface:

```bash
scriveno surface profile <name>
```

If no prior runtime is recorded, ask for one runtime target, then run:

```bash
scriveno surface profile <name> --runtimes codex --project
```

Use the active runtime name instead of `codex` when the writer is in Claude Code, Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, Antigravity, Manus, Perplexity Desktop, or the generic skill fallback.

## Safety Rules

1. Prefer `--dry-run` before changing the installed surface.
2. Do not delete custom user files. The installer cleans only Scriveno-owned command mirrors.
3. Keep agents installed even when a smaller command profile is selected. Drafting, review, and translation still need their agent prompts when a profile includes those workflows.
4. Do not imply that a smaller profile disables project data. It only changes the installed command surface.
5. If the writer is unsure, recommend `writing` for active drafting and `full` for exploration.

## Output Shape

Use this shape:

```markdown
Surface profile: writing
Installed runtimes: codex
Scope: project

Selected commands: 52 command files
Best use: active drafting with revision and structure tools

No files changed because this was a dry run.
```

## Automation Status

Every response must include a compact status block:

```text
Automation status:
Trigger: /scr:surface {args}
Spawned agents:
- none
Candidate agents:
- none
Local operations:
- surface profile inspected: {yes|no}
- installer dry run: {yes|no}
- installer profile change: {yes|no}
Candidate local helpers:
- scriveno surface list
- scriveno surface status
- scriveno surface profile <name> --dry-run
Manual gates:
- writer confirmation before changing installed runtimes
Auto-invoked:
- none
Why: surface management changes installed command files, not manuscript prose
```

## Response Contract

Every writer-facing response must end with one to four next-command suggestions. Each suggestion must include a short explanation of what that path will do.

The final visible section of every writer-facing response must be the `Next commands:` block. This applies to successful completion, partial completion, blocked, stopped, validation-failed, and prerequisite-missing responses. Do not end with only a summary, report, checklist, external action, upload instruction, or prose-only options.

Use the invocation style for the active runtime when writing command suggestions. Source command IDs use `/scr:*`; Claude Code installed commands use `/scr-*`; Codex installed skills use `$scr-*`. Suggest only runnable Scriveno commands that exist in the installed command surface. Do not invent adjacent workflow names.

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

Clear and practical. Treat command-surface changes like workspace organization, not like a feature upsell.
