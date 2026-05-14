---
description: Remove a unit from the outline with draft safety checks.
argument-hint: "[unit-id]"
---

# /scr:remove-unit -- Remove Unit

Remove a structural unit from the outline with comprehensive draft safety checks.

## Usage
```
/scr:remove-unit [unit-id]
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

### REMOVE UNIT FLOW

<remove_unit>
1. **Resolve unit type** from CONSTRAINTS.json `work_types[work_type].hierarchy`
   - Use `command_unit` to determine which level of the hierarchy this command operates on

2. **Validate unit-id:**
   - Parse OUTLINE.md and locate the specified unit
   - If the unit-id does not exist, show available units and ask for correction

3. **CRITICAL: Draft safety check** (D-07):
   - Scan `.manuscript/drafts/body/` for a draft file matching this unit
   - **If a draft file exists:**
     - Show the word count of the draft
     - Show the first 3 lines of the draft content
     - Display a prominent warning:

       **WARNING: This [chapter/scene/etc.] has drafted content.**

       File: `.manuscript/drafts/body/[filename]`
       Word count: [N] words
       Preview:
       > [first 3 lines]

       **Options:**
       1. **Archive** (recommended): Move to `.manuscript/archive/` -- content is preserved but removed from active outline
       2. **Delete permanently**: Remove the draft file entirely -- THIS CANNOT BE UNDONE
       3. **Cancel**: Abort the removal

     - Require the writer to choose explicitly. Default to archive if ambiguous.
   - **If no draft exists:** Proceed with a simple confirmation:
     "Remove [unit_type] [N]: '[title]' from the outline? (yes/no)"

4. **Execute removal:**
   - Remove the unit entry from OUTLINE.md
   - Renumber all subsequent units
   - If archived: move draft file to `.manuscript/archive/` with original name preserved
   - If deleted: remove the draft file
   - Rename subsequent draft files in `.manuscript/drafts/body/` to match new numbering

5. **Update related files:**
   - Update `.manuscript/STATE.md` to remove the unit and adjust progress
   - Update PLOT-GRAPH.md (or adapted equivalent) if arc positions reference the removed unit
   - Update any cross-references in OUTLINE.md

6. **Confirm result:**
   - Show the updated outline structure
   - If archived: confirm the archive location
   - Show the renumbered units
</remove_unit>

Commit: `structure: remove {unit_type} {N} "{title}"`

## Edge Cases

- **Last remaining unit:** Warn that removing it will leave the outline empty. Suggest keeping at least one unit.
- **Unit referenced by PLOT-GRAPH.md:** Warn that removing this unit will leave a gap in the arc. Suggest reassigning the arc position.
- **No OUTLINE.md:** Prompt to run `/scr:plan` first.
- **Invalid unit-id:** Show numbered list of current units for selection.
- **Archive directory doesn't exist:** Create `.manuscript/archive/` automatically.

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

Cautious and protective. Removing content is a significant action. Be thorough in warnings without being patronizing. The writer's prose is valuable -- treat it that way.
