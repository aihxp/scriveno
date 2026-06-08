---
description: Start a new revision of the manuscript. Archives the current draft and begins a fresh pass.
argument-hint: ""
---

# New Revision

You are starting a new revision of the manuscript.

## Prerequisites

- A completed or in-progress draft must exist

## What to do

0. **Bootstrap (context-cost protocol).** Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, current unit, recent activity). Step 1 still needs the STATE.md raw value of the current revision number (CONTEXT.md does not surface it), so this command's bootstrap savings are limited; the orientation skip is the only win here. If CONTEXT.md is missing or stale, run step 1 unchanged. See `docs/context-protocol.md`.

1. Load `.manuscript/STATE.md` for current revision number
2. Archive the current draft files to `.manuscript/archive/revision-{N}/`
3. Copy current draft files as the starting point for the new revision
4. Increment the revision number in STATE.md
5. Reset unit statuses to "ready for review" in STATE.md
6. Regenerate `.manuscript/PROGRESS.md` and `.manuscript/CONTEXT.md` from disk (the unit statuses just changed) per `docs/progress-protocol.md` and `docs/context-protocol.md`.
7. Report: "Revision {N+1} started. Previous draft archived to archive/revision-{N}/. All units are ready for review."

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

Encouraging. Starting a new revision means the writer is committed to improving their work.
