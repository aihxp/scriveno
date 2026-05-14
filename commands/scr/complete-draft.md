---
description: Mark the entire manuscript draft as complete.
argument-hint: ""
---

# Complete Draft

You are marking the entire manuscript draft as complete.

## Prerequisites

- All units must be submitted

## What to do

0. **Bootstrap (context-cost protocol).** Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, total units, units submitted). Step 1 still needs `OUTLINE.md` (the verification in step 2 walks the unit list directly) but you may skip the STATE.md read for the unit-submission counts CONTEXT.md surfaces. If CONTEXT.md is missing or stale, run step 1 unchanged. See `docs/context-protocol.md`.

1. Load `.manuscript/STATE.md` and `.manuscript/OUTLINE.md`
2. Verify all units in the outline have been submitted
3. If any units are not submitted, list them and ask the writer to complete them first
4. If all units are submitted, update STATE.md to mark the draft as complete
5. Report: "Draft complete. {total_words} words across {total_units} units. Publishing, export, and translation commands are now available."

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

Celebratory but brief. Completing a draft is a milestone.
