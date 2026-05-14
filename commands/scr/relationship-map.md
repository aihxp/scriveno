---
description: Generate an ASCII relationship graph between characters.
argument-hint: "[--edit]"
---

# /scr:relationship-map -- Character Relationship Graph

Generate an ASCII relationship graph showing connections between all characters.

## Usage
```
/scr:relationship-map [--edit]
```

## Instruction

You are generating a relationship map. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check `file_adaptations`, `commands.relationship-map.adapted`, and `feature_prerequisites`)
- The adapted characters file (CHARACTERS.md / FIGURES.md per `file_adaptations`)

**Prerequisites check** (from CONSTRAINTS.json `feature_prerequisites`):
- The characters file must exist
- At least 2 characters must be defined
- If fewer than 2: "Relationship map requires at least 2 characters. You have {N}. Run `/scr:new-character <name>` to add more."

Determine adapted terminology:
- Default: "relationship map"
- Sacred: "lineage map" (renamed via CONSTRAINTS.json); reads FIGURES.md and LINEAGES.md

---

### DISPLAY MODE (default)

<relationship_map_display>
  Parse the "Key Relationships" and "Relationship-Specific Interactions" sections from each character entry in the characters file.

  Render an ASCII graph with labeled edges (D-02):

  ```
  Elias ----[father]----> Petra
    |                       |
  [husband]             [daughter]
    |                       |
  Maren                   Lena
  (deceased)
  ```

  **Layout rules:**
  - Keep edge labels short (max 15 characters) -- truncate with ellipsis if needed
  - Truncate character names longer than 12 characters
  - Use directional arrows for asymmetric relationships: `--[label]-->`
  - Use undirected edges for mutual relationships: `--[label]--`
  - Handle 2-10 characters gracefully; for more than 10, group by relationship clusters
  - Indicate character status after name: `(deceased)`, `(mentioned)`, `(absent)`
  - Place protagonists centrally in the layout

  **Relationship types to extract:**
  - Family: parent, child, sibling, spouse, cousin
  - Romantic: partner, ex-partner, love interest
  - Social: friend, rival, mentor, student, ally, enemy
  - Professional: employer, colleague, subordinate
  - Story-specific: foil, mirror, catalyst

  After the graph, show a legend:
  ```
  ----> : directional relationship
  ----- : mutual relationship
  (deceased) : character is deceased
  ```

  After the legend, list any relationships mentioned in text but not visualized (if graph became too complex).

  Then show a compact "Interaction notes" table for each important pairing:
  ```
  Pair | Trust posture | Conflict pattern | Speech shift | Hidden agenda/fear
  Mara/Elias | guarded | deflects accusation | Mara gets terse | forged letter exposure
  ```
</relationship_map_display>

---

### EDIT MODE (--edit)

<relationship_map_edit>
  Show the current relationship graph, then offer:
  1. **Add relationship:** Between two characters (name a type and direction)
  2. **Change relationship:** Modify the label or direction of an existing edge
  3. **Remove relationship:** Delete a connection
  4. **Add character note:** Mark a character's status (active, deceased, mentioned)
  5. **Edit interaction dynamic:** Update trust posture, conflict pattern, speech shift, or hidden agenda/fear for a specific pair

  After edits, update the "Key Relationships" section in each affected character's entry in the characters file.
  If interaction dynamics changed, also update the "Relationship-Specific Interactions" section for the affected character entries.

  Commit: `character: update relationship map`
</relationship_map_edit>

---

### Edge Cases

- **Only 2 characters:** Show a simple single-edge graph
- **No relationships defined:** Show characters as isolated nodes and suggest defining relationships
- **Circular relationships:** Handle gracefully (A -> B -> C -> A)
- **Sacred work type:** Use "lineage map" terminology; relationship types include "teacher-disciple", "prophetic succession", "covenant"

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
