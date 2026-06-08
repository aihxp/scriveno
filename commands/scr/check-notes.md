---
description: Review all project notes.
argument-hint: "[--clear]"
---

# Check Notes

You are displaying the writer's project notes.

## Default (no flags)

1. Read `.manuscript/NOTES.md`
2. Display all notes as-is
3. If the file doesn't exist or is empty: "No notes yet. Add one with `/scr:add-note <text>`"

## --clear

Archive existing notes and start fresh:

1. Create `.manuscript/archive/` directory if it doesn't exist
2. Copy current NOTES.md to `.manuscript/archive/notes-{YYYY-MM-DD}.md`
3. Replace NOTES.md with a fresh header: `# Project Notes\n\n`
4. Confirm: "Notes archived to archive/notes-{date}.md. Fresh notes file ready."

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

Simple. Show the notes, get out of the way.
