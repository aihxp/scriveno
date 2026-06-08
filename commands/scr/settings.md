---
description: View or modify project settings.
argument-hint: ""
---

# Settings

You are showing or modifying the project settings.

## Prerequisites

- `.manuscript/config.json` must exist

## What to do

1. Load `.manuscript/config.json`
2. If no arguments, display current settings in a readable format:
   - Work type and group
   - Command unit (how commands adapt)
   - Autopilot profile and publication matter behavior (if set)
   - Developer mode (on/off)
   - Voice drift threshold
   - **Draft rigor** (`standard` or `strict` -- strict prepends a per-sentence rules check, useful when routing to weaker models)
   - **Context profile** (`minimal`, `standard`, or `full` -- controls how much context the drafter loads per atomic unit)
   - **Pitfalls enabled** (on/off -- whether the drafter loads the per-work-type pitfall pack)
   - Export defaults
3. If the writer wants to change a setting, update `config.json` accordingly. For the `autopilot` and `draft` blocks, accept these values:
   - `autopilot.profile`: `guided`, `supervised`, or `full-auto`
   - `autopilot.include_matter`: `true` or `false`
   - `autopilot.matter_level`: `minimum`, `balanced`, or `maximum`
   - `draft.rigor`: `standard` or `strict`
   - `draft.context_profile`: `minimal`, `standard`, or `full`
   - `draft.pitfalls_enabled`: `true` or `false`
4. Report what changed

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

Straightforward. Settings are utilitarian.
