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
   - Regenerate `.manuscript/PROGRESS.md` from disk per `docs/progress-protocol.md` so the per-unit ledger reflects the new ordering
   - Update PLOT-GRAPH.md (or adapted equivalent):
     - If arc positions reference unit numbers, update them to new numbers
     - Show which arc positions changed
   - Update any cross-references in OUTLINE.md

6. **Orphaned-prompt hygiene** (after renumber/rename):
   - Scan `.manuscript/illustrations/` for prompt files keyed to a unit reference, specifically files matching `{scene-ref}-illustration-prompt.md` and `chapter-{ref}-header-prompt.md`.
   - For any such file whose embedded unit reference no longer matches a current unit after the reorder, the file is **orphaned**: its reference points at a number or scene that the renumber moved or invalidated.
   - **If any orphaned prompt files are found:**
     - WARN the writer. List each orphaned prompt file and the unit reference it carried:

       **These illustration/header prompts no longer match a current unit:**

       | Prompt file | Referenced | Now |
       |-------------|------------|-----|
       | `chapter-03-header-prompt.md` | chapter 3 | chapter 3 is now "Rising Tension" (was "The Chase") |
       | `the-chase-illustration-prompt.md` | The Chase (was 3) | The Chase is now chapter 5 |

     - OFFER, per file, to either rename it to the new reference (so it tracks the renumbered unit) or leave it as-is. Apply the writer's choice file by file.
     - Do NOT auto-delete any prompt file. Renaming is the only mutation, and only with the writer's confirmation.
   - This keeps illustration and chapter-header prompts from silently mismatching renumbered units. When renaming, slugify any title-derived reference component with `lib/slug.js` per `docs/naming-conventions.md` section 1; do not hand-roll the reference token.

7. **Show result:**
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
- **Orphaned illustration/header prompts:** A prompt file in `.manuscript/illustrations/` keyed to a renumbered or moved unit no longer matches. Warn and list it, offer to rename it to the new reference or leave it, and never auto-delete (step 6).

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

Precise and visual. Reordering is a significant structural decision. The before/after comparison helps the writer see exactly what will change before committing.
