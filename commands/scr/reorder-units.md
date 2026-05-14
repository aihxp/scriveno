---
description: Reorder units in the outline by moving a unit to a new position.
argument-hint: "[unit-id] [new-position]"
---

# /scr:reorder-units -- Reorder Outline Units

Move a structural unit from its current position to a new position, renumbering all affected units.

## Usage
```
/scr:reorder-units [unit-id] [new-position]
```

## Instruction

You are a structure management assistant. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) (to find `work_types[work_type].hierarchy` and determine unit terminology)
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

### REORDER UNITS FLOW

<reorder_units>
1. **Resolve unit type** from CONSTRAINTS.json `work_types[work_type].hierarchy`
   - Use `command_unit` to determine which level this command operates on

2. **Validate inputs:**
   - Parse OUTLINE.md and locate the specified unit
   - Verify the new position is valid (1 to total_units)
   - If the unit is already at the requested position, inform the writer: "That [unit_type] is already at position [N]."

3. **Draft safety check** (D-07):
   - Scan `.manuscript/drafts/body/` for ALL draft files (not just the moved unit)
   - Identify every draft file that will need to be renamed due to the reorder
   - **If any drafted units are affected:**
     - Show the complete renaming plan:

       **Reordering will rename the following draft files:**

       | Current | New | Title |
       |---------|-----|-------|
       | `03-the-chase-DRAFT.md` | `05-the-chase-DRAFT.md` | The Chase |
       | `04-revelations-DRAFT.md` | `03-revelations-DRAFT.md` | Revelations |
       | ... | ... | ... |

     - Warn: "All draft file contents will be preserved. Only the file numbering will change."
     - Require confirmation before proceeding

   - **Show before/after comparison:**
     ```
     BEFORE:                    AFTER:
     1. The Beginning           1. The Beginning
     2. Rising Tension          2. The Chase        <-- moved from 3
     3. The Chase       -->     3. Rising Tension    <-- was 2
     4. Revelations             4. Revelations
     ```

4. **Execute reorder:**
   - Remove the unit from its current position in OUTLINE.md
   - Insert it at the new position
   - Renumber all affected units
   - Rename all affected draft files in `.manuscript/drafts/body/` to match new numbering
     (use a temporary naming scheme to avoid conflicts: rename to `.tmp` first, then to final names)

5. **Update related files:**
   - Update `.manuscript/STATE.md` to reflect the new ordering
   - Update PLOT-GRAPH.md (or adapted equivalent):
     - If arc positions reference unit numbers, update them to new numbers
     - Show which arc positions changed
   - Update any cross-references in OUTLINE.md

6. **Show result:**
   - Display the full updated outline in new order
   - Highlight the moved unit and any affected arc positions
   - If PLOT-GRAPH.md was updated, show the arc position changes
</reorder_units>

Commit: `structure: reorder {unit_type} {old_position} to position {new_position}`

## Edge Cases

- **Moving to same position:** Inform the writer, no changes needed.
- **Only 1 unit:** Nothing to reorder -- inform the writer.
- **No OUTLINE.md:** Prompt to run `/scr:plan` first.
- **Many draft files to rename:** Use temporary file names during rename to avoid naming collisions.
- **Unit referenced in subplot-map or timeline:** Warn that cross-references in other files may also need updating.

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

Precise and visual. Reordering is a significant structural decision. The before/after comparison helps the writer see exactly what will change before committing.
