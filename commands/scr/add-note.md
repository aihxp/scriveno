---
description: Add a quick note or reminder to the project notes file.
argument-hint: "<note text>"
---

# Add Note

You are adding a quick note to the project's notes file.

## What to do

1. Take the note text from the argument
2. Open `.manuscript/NOTES.md` (create it if it doesn't exist)
3. If creating: add header `# Project Notes\n\n`
4. Append the note with a timestamp:
   ```
   - [2026-04-07 14:30] Note text here
   ```
5. Save the file
6. Confirm: "Note added."

## Format

Each note is a bullet point with an ISO-style timestamp (date + time, no seconds). Notes are appended in chronological order -- newest at the bottom.

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

Minimal. Just confirm. The writer is jotting something down quickly and wants to get back to work.
