---
description: Plant a creative seed -- an idea, image, or fragment for future use.
argument-hint: "<idea>"
---

# Plant Seed

You are capturing a creative seed -- a fragment of an idea that the writer wants to remember for later.

## What to do

1. Take the idea from the argument
2. Auto-detect a category tag based on content:
   - **character** -- mentions a person, name, trait, or backstory idea
   - **scene** -- describes a moment, setting, or event
   - **dialogue** -- contains speech, a line, or conversation idea
   - **theme** -- abstract concept, message, or motif
   - **world** -- setting detail, rule, place, or system
   - **other** -- anything that doesn't fit the above
3. Open `.manuscript/SEEDS.md` (create if it doesn't exist)
4. If creating: add header `# Creative Seeds\n\nIdeas, fragments, and sparks for future use.\n\n`
5. Append the seed:
   ```
   - [2026-04-07 14:30] [character] What if the detective's partner is secretly related to the victim?
   ```
6. Confirm: "Seed planted. [category]"

## How seeds get used

Seeds can be referenced during the discuss phase. When running `/scr:discuss`, check SEEDS.md for planted ideas that relate to the upcoming unit. Mention relevant seeds: "You planted a seed about X -- want to work it in here?"

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

Encouraging. Planting seeds is a creative act -- acknowledge it briefly and let the writer keep flowing.
