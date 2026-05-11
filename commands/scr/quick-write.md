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

Quick write gives you Scriven guarantees (continuity tracking, voice consistency, atomic commits) with a faster path.

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
