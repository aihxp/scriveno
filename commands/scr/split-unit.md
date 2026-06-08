---
description: Split one unit into two at a specified point.
argument-hint: "[unit-id] [split-point]"
---

# /scr:split-unit -- Split Unit

Split one structural unit into two, with draft content allocation if drafted.

## Usage
```
/scr:split-unit [unit-id] [split-point]
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

### SPLIT UNIT FLOW

<split_unit>
1. **Resolve unit type** from CONSTRAINTS.json `work_types[work_type].hierarchy`
   - Use `command_unit` to determine which level this command operates on

2. **Validate unit-id:**
   - Parse OUTLINE.md and locate the specified unit
   - If not found, show available units and ask for correction

3. **Draft safety check** (D-07):
   - Scan `.manuscript/drafts/body/` for a draft file matching this unit
   - **If a draft file exists:**
     - Show the full draft content summary (word count, paragraph count, scene breaks)
     - Ask how to split the content:

       **This [chapter/scene/etc.] has drafted content ([N] words, [P] paragraphs).**

       **How would you like to split the content?**
       1. **By scene break**: Split at an existing scene break marker (`---` or `***`)
       2. **By paragraph**: Split after a specific paragraph number
       3. **By percentage**: Split at approximately [X]% of the content
       4. **Manual**: You specify the exact split point

     - Show a preview of what goes into each new unit
     - Require explicit confirmation before splitting the draft:
       "Split this draft into two files? Content in both halves will be preserved."

   - **If no draft exists:** Proceed directly to outline split

4. **Prompt for new unit details:**
   - Title for the first half (default: keep original title with " (Part 1)" suffix)
   - Title for the second half (default: original title with " (Part 2)" suffix)
   - Ask writer for preferred titles -- the defaults are just suggestions

5. **Execute split:**
   - Replace the original unit entry in OUTLINE.md with two new entries
   - The first new unit keeps the original position number
   - The second new unit takes position + 1
   - Renumber all subsequent units
   - If draft exists: create two draft files in `.manuscript/drafts/body/` with the split content
   - Rename subsequent draft files in `.manuscript/drafts/body/` to match new numbering

6. **Update related files:**
   - Update `.manuscript/STATE.md` to reflect the two new units
   - Regenerate `.manuscript/PROGRESS.md` from disk per `docs/progress-protocol.md` so the per-unit ledger reflects the new structure
   - Update PLOT-GRAPH.md (or adapted equivalent) if arc positions are affected
   - Update cross-references in OUTLINE.md

7. **Show result:**
   - Display the updated outline with both new units highlighted
   - If draft was split, show word count for each half
   - Show renumbered subsequent units
</split_unit>

Commit: `structure: split {unit_type} {N} into {N} and {N+1}`

## Edge Cases

- **Unit with very short draft:** Warn if either half would be very short (under 100 words) and suggest reconsidering.
- **No scene breaks in draft:** If splitting by scene break but none exist, suggest paragraph or percentage split instead.
- **No OUTLINE.md:** Prompt to run `/scr:plan` first.
- **Single-unit outline:** Splitting will create a 2-unit outline -- confirm this is intentional.
- **Draft with images or special formatting:** Preserve all formatting in both halves.

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

Collaborative and precise. Splitting is a creative decision -- help the writer find the right break point without being prescriptive.
