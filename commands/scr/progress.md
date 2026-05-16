---
description: Show current project state and next step. How far along, what is drafted, what is pending.
argument-hint: ""
---

# Progress

You are showing the writer their current project progress.

Follow the auto-invoke policy. In the source repository it is documented at `docs/auto-invoke-policy.md`. `/scr:progress` is read-only: it can count, compare, and recommend, but it must not spawn agents or write files.

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
6. Run the Level 1 proactive sweep:
   - If STATE.md counts disagree with draft files, suggest `/scr:scan`.
   - If reports show unresolved review items, suggest the matching review command.
   - If exports are stale, suggest `/scr:export` or `/scr:publish`.
   - If translation work exists and follow-up reports are missing, suggest the next translation check.
   - If unsaved manuscript changes exist, suggest `/scr:save`.

## Automation Status

Every response must include a compact status block:

```text
Automation status:
Trigger: /scr:progress
Spawned agents:
- none
Local operations:
- progress counts computed: yes/no
- proactive sweep: read-only
Auto-invoked:
- none
Why: progress is read-only; it recommends next commands without mutating files
```

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
