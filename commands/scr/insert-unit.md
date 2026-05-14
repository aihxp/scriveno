---
description: Insert a new unit at a specific position in the outline.
argument-hint: "[position] [title]"
---

# /scr:insert-unit -- Insert Unit at Position

Insert a new structural unit at a specific position in the outline, renumbering subsequent units.

## Usage
```
/scr:insert-unit [position] [title]
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

### INSERT UNIT FLOW

<insert_unit>
1. **Resolve unit type** from CONSTRAINTS.json `work_types[work_type].hierarchy`
   - Use `command_unit` to determine which level of the hierarchy this command operates on
   - Display the resolved unit type: "Inserting a new [chapter/scene/section/etc.] at position [N]"

2. **Validate position:**
   - Parse the current OUTLINE.md to count existing units
   - Verify the requested position is valid (1 to total_units + 1)
   - If position is beyond the end, suggest using `/scr:add-unit` instead

3. **Prompt for details** (if not fully provided):
   - Position (required -- which slot to insert at)
   - Title (required)
   - Brief summary (1-2 sentences)

4. **Draft safety check** (D-07):
   - Scan `.manuscript/drafts/body/` for draft files corresponding to units at and after the insertion point
   - If any drafted units will be renumbered, warn the writer:
     "This will renumber [N] existing units. The following drafted files will need to be renamed:"
     List each affected file with its current and new name
   - Require explicit confirmation before proceeding

5. **Execute insertion:**
   - Insert the new unit at the specified position in OUTLINE.md
   - Renumber all subsequent units (position + 1, position + 2, etc.)
   - Rename any affected draft files in `.manuscript/drafts/body/` to match new numbering

6. **Update related files:**
   - Update `.manuscript/STATE.md` to reflect the new unit and renumbered units
   - Update PLOT-GRAPH.md (or adapted equivalent) if arc positions reference unit numbers
   - Update any cross-references in OUTLINE.md that point to renumbered units

7. **Show result:**
   - Display the updated outline with the inserted unit highlighted
   - Show a before/after comparison of the affected numbering
</insert_unit>

Commit: `structure: insert {unit_type} "{title}" at position {N}`

## Edge Cases

- **Position 1:** Insert at the very beginning -- all existing units shift down.
- **No OUTLINE.md:** Prompt to run `/scr:plan` first.
- **Invalid position (0 or negative):** Show error with valid range.
- **Position beyond end:** Suggest `/scr:add-unit` instead.
- **Many drafted units affected:** Show full list of file renames and require confirmation.

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

Clear and careful. Insertion affects existing structure, so be precise about what changes.
