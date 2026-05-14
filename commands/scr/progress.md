---
description: Show current project state and next step. How far along, what is drafted, what is pending.
argument-hint: ""
---

# Progress

You are showing the writer their current project progress.

## Prerequisites

- `.manuscript/STATE.md` must exist

## What to do

1. Load `.manuscript/STATE.md`, `.manuscript/OUTLINE.md`, `.manuscript/RECORD.md` when present, and `.manuscript/config.json`
2. Count total units, drafted units, submitted units, and pending units
3. Calculate word count from existing draft files
4. Determine the next step (what unit to discuss, plan, or draft next)
5. Display a progress summary:
   - "{drafted}/{total} units drafted. {submitted}/{total} submitted."
   - "{word_count} words so far."
   - "{open_threads} open record threads." (only when RECORD.md exists)
   - "Next: {next_action}"

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

Informative and motivating. Show progress without judgment.
