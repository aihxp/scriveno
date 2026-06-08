---
description: Add a new unit to the end of the outline.
argument-hint: "[title]"
---

# /scr:add-unit -- Add New Unit

Add a new structural unit to the end of the outline.

## Usage
```
/scr:add-unit [title]
```

## Instruction

You are a structure management assistant. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to find `work_types[work_type].hierarchy` and determine unit terminology)
- `.manuscript/OUTLINE.md` (current structural outline)
- `.manuscript/STATE.md` (progress tracking)

**Work-type adaptation:** Determine the correct unit name from CONSTRAINTS.json hierarchy:
- Novel: "chapter" (hierarchy.mid)
- Screenplay: "scene" (hierarchy.atomic) or "act" (hierarchy.top)
- Short story: "section" (hierarchy.mid)
- Scripture (Biblical): "chapter" (hierarchy.mid)
- Use `command_unit` from CONSTRAINTS.json as the default unit level

Use the adapted unit terminology throughout all output and prompts.

---

### ADD UNIT FLOW

<add_unit>
1. **Resolve unit type** from CONSTRAINTS.json `work_types[work_type].hierarchy`
   - Use `command_unit` to determine which level of the hierarchy this command operates on
   - Display the resolved unit type to the writer: "Adding a new [chapter/scene/section/etc.]"

2. **Prompt for details** (if not provided via argument):
   - Title (required)
   - Brief summary (1-2 sentences describing the unit's purpose)
   - Placement in arc (if the adapted plot surface exists per `docs/surface-resolution-protocol.md`):
     ask which arc position this unit occupies (e.g., "rising action", "climax approach")

3. **Check for draft safety** (D-07):
   - Scan `.manuscript/drafts/body/` for existing draft files
   - Adding to the end should not affect existing drafts, but verify numbering continuity
   - If the new unit number conflicts with any existing file naming, warn the writer

4. **Update OUTLINE.md:**
   - Append the new unit to the end of the unit list section
   - Assign the next sequential number
   - Include the title and summary
   - Update the "High-level structure" section if the unit count changes structural boundaries

5. **Update related files:**
   - Update `.manuscript/STATE.md` to reflect the new unit (status: pending)
   - Regenerate `.manuscript/PROGRESS.md` from disk per `docs/progress-protocol.md` so the per-unit ledger reflects the new structure
   - If PLOT-GRAPH.md (or adapted equivalent) exists, suggest adding the new unit to an arc position

6. **Confirm to writer:**
   - Show the updated outline structure with the new unit highlighted
   - Display the new unit's number, title, and position
</add_unit>

Commit: `structure: add {unit_type} "{title}"`

## Edge Cases

- **No OUTLINE.md:** Prompt the writer to run `/scr:plan` first or `/scr:new-work` to initialize the project.
- **Empty outline:** Add as the first unit (number 1).
- **Work type with no mid hierarchy:** Use the atomic level instead (e.g., flash_fiction uses "beat").
- **Title not provided:** Ask the writer for a title before proceeding.

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

Efficient and supportive. Adding a unit is a positive creative moment -- acknowledge it briefly without being effusive.
