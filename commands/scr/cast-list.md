---
description: Display the roster of all cast entries with roles and brief descriptions.
---

# /scr:cast-list -- Cast Roster

Display the complete roster of all cast entries in the work.

## Usage
```
/scr:cast-list
```

## Instruction

You are presenting the cast roster. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check `file_adaptations` and `commands.cast-list.adapted`)
- `docs/surface-resolution-protocol.md` for adapted surface resolution and writer-facing terminology

Determine the adapted cast surface for canonical `CHARACTERS.md` from `file_adaptations`:
- Default: `CHARACTERS.md`
- Academic work types: `CONCEPTS.md`
- Technical work types: `AUDIENCE.md`
- Sacred work types: `FIGURES.md`

Load the adapted cast surface from `.manuscript/`.

Determine adapted terminology:
- Default: "cast list", "characters"
- Sacred: "figures list", "figures" (renamed via CONSTRAINTS.json)
- Academic: "concepts list", "concepts"

---

### DISPLAY ROSTER

<cast_list_display>
  Parse all cast entries from the adapted cast surface.

  Present a formatted table grouped by role category:

  **Protagonists**
  | Name | Arc Type | Status | Summary |
  |------|----------|--------|---------|
  | {name} | {Change/Growth/Fall/Steadfast/Flat} | {active/deceased/mentioned} | {1-line summary} |

  **Antagonists**
  | Name | Arc Type | Status | Summary |
  |------|----------|--------|---------|

  **Supporting Characters**
  | Name | Arc Type | Status | Summary |
  |------|----------|--------|---------|

  **Mentioned / Off-stage**
  | Name | Arc Type | Status | Summary |
  |------|----------|--------|---------|

	  Determine role category from each cast entry's "Role" field:
  - Protagonist, main character, hero -> Protagonists
  - Antagonist, villain, opposition -> Antagonists
  - Supporting, mentor, love interest, foil, comic relief, sidekick -> Supporting Characters
  - Mentioned, referenced, deceased (with no active role), off-stage -> Mentioned / Off-stage
  - If role is ambiguous, place in Supporting Characters

  After the table, show summary stats:
	  - Total cast entries: {N}
  - By status: {active} active, {deceased} deceased, {mentioned} mentioned
  - Characters missing voice anchors: {list of names without voice data}

  If no cast entries exist:
  - "No cast entries yet. Run `/scr:new-character <name>` to create your first entry."
</cast_list_display>

---

### Edge Cases

- **Empty adapted cast surface:** Direct to new-character command
- **Cast entries with incomplete profiles:** Include in roster but mark with indicator (e.g., "[incomplete]")
- **Sacred work type:** Use "figures" terminology, group by role adapted to sacred context (prophet, disciple, angel, etc.)
- **Academic work type:** Use "concepts" terminology, group by function (thesis, antithesis, supporting argument, counterpoint)

## Next-step routing

When two or more cast entries exist, suggest `/scr:relationship-map` to see how they connect. When cast entries cluster into peoples (races, factions, nations), suggest `/scr:new-people` to profile a people, and `/scr:relationship-map --peoples` to see how peoples stand with one another.

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
