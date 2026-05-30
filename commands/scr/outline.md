---
description: Display or edit the structural outline of the work.
argument-hint: "[--edit]"
---

# /scr:outline -- View or Edit Story Outline

Display the structural outline with work-type-aware unit labels, or enter edit mode to modify the structure.

## Usage
```
/scr:outline [--edit]
```

**Flags:**
- `--edit` -- Enter edit mode to add, remove, or reorder outline entries
- No flag: display mode (default)

## Instruction

You are an outline manager. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check `work_types[type].hierarchy` for unit labels, and `file_adaptations`)
- `.manuscript/OUTLINE.md` (the outline data -- read it fully)
- `.manuscript/STATE.md` (aggregate counters) plus each unit's files on disk (plans, drafts, reviews) to derive per-unit status -- see `docs/progress-protocol.md`. The persisted per-unit ledger is `.manuscript/PROGRESS.md` when present.

**Work-type adaptation:** Read the hierarchy from CONSTRAINTS.json for the current work type to determine the correct unit terminology:
- Novel: part > chapter > scene
- Screenplay: act > sequence > scene
- Short story: section > beat
- Thesis: part > chapter > section
- Scripture (Quranic): surah > ayah
- Scripture (Biblical): testament > book > verse
- Poetry collection: section > poem
- And so on for all 50+ work types

Never hard-code "chapter" or "scene" -- always use the hierarchy labels from CONSTRAINTS.json.

---

### DISPLAY MODE (default)

<outline_display>
Present the hierarchical outline with:

1. **Unit numbering** using work-type-appropriate labels:
   ```
   Part I: [title]
     Chapter 1: [title]
       Scene 1.1: [summary]    [drafted]    [1,200 words]
       Scene 1.2: [summary]    [planned]    [-- words]
     Chapter 2: [title]
       Scene 2.1: [summary]    [pending]    [-- words]
   ```

2. **For each unit, show:**
   - Unit number and title
   - 1-line summary (from OUTLINE.md)
   - Status: drafted | planned | pending (derived from disk per `docs/progress-protocol.md`, not from STATE.md aggregates)
   - Word count (if drafted, from STATE.md or draft file)
   - Arc position (if mapped in PLOT-GRAPH.md)

3. **Summary footer:**
   - Total units at each level
   - Overall progress (X of Y units drafted)
   - Total word count (drafted units only)
</outline_display>

---

### EDIT MODE (--edit)

<outline_edit>
Allow the writer to modify the outline interactively:

**Available operations:**
- **Add**: Add a new unit at any level (top/mid/atomic)
- **Remove**: Remove a unit (with draft-safety check -- warn if drafted content exists)
- **Reorder**: Move a unit to a different position
- **Rename**: Change a unit's title or summary
- **Nest/Unnest**: Move a unit up or down in the hierarchy

**Draft-safety protocol (D-07):**
- Before any modification, check `.manuscript/drafts/body/` for files corresponding to affected units
- If drafted content exists:
  - List all affected draft files
  - Warn: "This will affect [N] drafted files: [list]"
  - Ask for explicit confirmation before proceeding
  - NEVER silently move or delete drafted prose

**After editing:**
- Update OUTLINE.md with the new structure
- Update STATE.md if unit counts or positions changed
- If arc positions were affected, note that `/scr:plot-graph` should be re-run

Commit: `structure: update outline`
</outline_edit>

## Edge Cases

- **No OUTLINE.md:** Direct the writer to run `/scr:plan` to generate the initial outline.
- **Empty outline:** Show the outline template structure with work-type-appropriate labels and suggest starting with high-level structure first.
- **Work type without top-level units:** Skip the top level (e.g., short stories have no "parts", just sections and beats).
- **Very large outlines (50+ units):** Offer to collapse atomic-level units and show only mid-level summary, with option to expand specific sections.

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

Organized and utilitarian. The outline is a working document -- present it cleanly so the writer can see their structure at a glance and make informed decisions about changes.
