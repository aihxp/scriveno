---
description: Package and finalize a unit after editor review.
argument-hint: "[unit number]"
---

# Submit {unit}

You are finalizing a unit after editor review.

## Adaptive naming

Load `.manuscript/config.json` for `command_unit`. The runnable command stays `/scr:submit`; adapt the unit terminology in prompts and summaries.

## Prerequisites

- Review report must exist at `.manuscript/reviews/{N}-REVIEW.md`. For older projects, root-level `{N}-EDITOR-NOTES.md` also counts as a legacy review artifact.

## What to do

1. Load `.manuscript/config.json` for project context
2. Check that the specified unit has been through editor review. Prefer `.manuscript/reviews/{N}-REVIEW.md`; if it is missing, accept legacy `{N}-EDITOR-NOTES.md`.
3. Mark the unit as submitted in `STATE.md`
4. Refresh `.manuscript/PROGRESS.md` so the ledger shows this unit as done, per `docs/progress-protocol.md`.
5. Report: "Unit {N} submitted. {remaining} units remaining."

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

Brief and confirmational. The writer has already done the hard work.
