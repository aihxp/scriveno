---
description: Display the roster of all characters with roles and brief descriptions.
---

# /scr:cast-list -- Character Roster

Display the complete roster of all characters in the work.

## Usage
```
/scr:cast-list
```

## Instruction

You are presenting the character roster. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check `file_adaptations` and `commands.cast-list.adapted`)

Determine the correct characters file from `file_adaptations`:
- Default: `CHARACTERS.md`
- Academic work types: `CONCEPTS.md`
- Sacred work types: `FIGURES.md`

Load the adapted characters file from `.manuscript/`.

Determine adapted terminology:
- Default: "cast list", "characters"
- Sacred: "figures list", "figures" (renamed via CONSTRAINTS.json)
- Academic: "concepts list", "concepts"

---

### DISPLAY ROSTER

<cast_list_display>
  Parse all character entries from the characters file.

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

  Determine role category from each character's "Role" field:
  - Protagonist, main character, hero -> Protagonists
  - Antagonist, villain, opposition -> Antagonists
  - Supporting, mentor, love interest, foil, comic relief, sidekick -> Supporting Characters
  - Mentioned, referenced, deceased (with no active role), off-stage -> Mentioned / Off-stage
  - If role is ambiguous, place in Supporting Characters

  After the table, show summary stats:
  - Total characters: {N}
  - By status: {active} active, {deceased} deceased, {mentioned} mentioned
  - Characters missing voice anchors: {list of names without voice data}

  If no characters exist:
  - "No characters yet. Run `/scr:new-character <name>` to create your first character."
</cast_list_display>

---

### Edge Cases

- **Empty characters file:** Direct to new-character command
- **Characters with incomplete profiles:** Include in roster but mark with indicator (e.g., "[incomplete]")
- **Sacred work type:** Use "figures" terminology, group by role adapted to sacred context (prophet, disciple, angel, etc.)
- **Academic work type:** Use "concepts" terminology, group by function (thesis, antithesis, supporting argument, counterpoint)

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
