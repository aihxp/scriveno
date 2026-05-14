---
description: Write a scene, passage, or chapter outside the full planning workflow.
---

# /scr:quick-write -- Ad-Hoc Writing Without Full Planning

Write a scene, passage, or chapter outside the full planning workflow.

## Usage
```
/scr:quick-write [--discuss] [--research] [--full]
```

**Flags:**
- `--discuss` -- Brief discussion to capture creative direction first
- `--research` -- Research craft techniques before drafting
- `--full` -- Discussion + research + consistency check

## Instruction

Quick write gives you Scriveno guarantees (continuity tracking, voice consistency, atomic commits) with a faster path.

### STEP 1: GATHER INTENT

Ask: "What do you want to write?"

Accept any of:
- A specific scene ("The bar fight in chapter 12")
- A character moment ("Marcus confronting his father")
- An exploratory passage ("What it feels like when the magic fails")
- A dialogue exchange ("The negotiation between Eva and the detective")
- A transitional passage ("Getting from the apartment to the airport")

### STEP 2: QUICK CONTEXT

Load relevant files based on characters/settings mentioned:
- `STYLE-GUIDE.md` (always)
- `CHARACTERS.md` (relevant entries)
- `WORLD.md` (relevant sections)
- Previous relevant drafts (for continuity)

If `--discuss`: Ask 3-5 targeted questions about tone, pacing, and purpose for this passage.

If `--research`: Spawn a focused researcher for technique guidance.

### STEP 3: DRAFT

Write the passage following all established style guide constraints. Target whatever length feels natural unless the writer specified a target.

### STEP 4: VERIFY (if --full)

Run continuity and voice checks against existing manuscript.

### OUTPUT

Save to `.manuscript/quick/{NNN}-{slug}/DRAFT.md`
Save plan (if generated) to `.manuscript/quick/{NNN}-{slug}/PLAN.md`

Commit: `quick: {slug}`

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
