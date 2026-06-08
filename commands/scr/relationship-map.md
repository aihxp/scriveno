---
description: Generate an ASCII relationship graph between cast entries.
argument-hint: "[--edit]"
---

# /scr:relationship-map -- Cast Relationship Graph

Generate an ASCII relationship graph showing connections between all cast entries.

## Usage
```
/scr:relationship-map [--edit] [--conflicts] [--peoples]
```

## Instruction

You are generating a relationship map. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check `file_adaptations`, `commands.relationship-map.adapted`, and `dependencies.feature_prerequisites`)
- `docs/surface-resolution-protocol.md` for adapted surface resolution rules
- The adapted cast surface for canonical `CHARACTERS.md` (for example `CHARACTERS.md`, `CONCEPTS.md`, `AUDIENCE.md`, or `FIGURES.md` per `file_adaptations`)

**Prerequisites check** (from CONSTRAINTS.json `dependencies.feature_prerequisites`):
- The adapted cast surface must exist
- At least 2 cast entries must be defined
- If fewer than 2: "Relationship map requires at least 2 cast entries. You have {N}. Run `/scr:new-character <name>` to add more."

Determine adapted terminology:
- Default: "relationship map"
- Sacred: "lineage map" (renamed via CONSTRAINTS.json); reads FIGURES.md and LINEAGES.md

---

### CONFLICTS MODE (--conflicts)

<relationship_map_conflicts>
  Render `.manuscript/CONFLICTS.md` (the derived conflict map) instead of the relationship graph: show the central conflict, the pairwise conflict matrix (every pair, with `no conflict` stated explicitly), and the undefined pairs left to decide. If CONFLICTS.md is missing or stale, suggest `/scr:save` to regenerate it (or `/scr:scan --fix`). This is the conflict-side companion view to the relationship map, so the derived conflict map has a reader.
</relationship_map_conflicts>

---

### PEOPLES MODE (--peoples)

<relationship_map_peoples>
  Render `.manuscript/PEOPLE-DYNAMICS.md` (the derived people-dynamics map) instead of the cast graph: show how every people stands with every other (alliance, rivalry, oppression, trade, contempt, kinship, war), with `no dealings` stated explicitly, plus the undefined pairs left to decide. If it is missing or stale, suggest `/scr:save` (or `/scr:scan --fix`). This is the collective-tier companion to the relationship map, so the derived people-dynamics map has a reader.
</relationship_map_peoples>

---

### DISPLAY MODE (default)

<relationship_map_display>
  Parse the "Key Relationships" and "Relationship-Specific Interactions" sections from each cast entry in the adapted cast surface.

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
  - Truncate cast-entry names longer than 12 characters
  - Use directional arrows for asymmetric relationships: `--[label]-->`
  - Use undirected edges for mutual relationships: `--[label]--`
  - Handle 2-10 cast entries gracefully; for more than 10, group by relationship clusters
  - Indicate cast-entry status after name: `(deceased)`, `(mentioned)`, `(absent)`
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
  (deceased) : cast entry is deceased
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
  1. **Add relationship:** Between two cast entries (name a type and direction)
  2. **Change relationship:** Modify the label or direction of an existing edge
  3. **Remove relationship:** Delete a connection
  4. **Add cast note:** Mark a cast entry's status (active, deceased, mentioned)
  5. **Edit interaction dynamic:** Update trust posture, conflict pattern, speech shift, or hidden agenda/fear for a specific pair

  After edits, update the "Key Relationships" section in each affected cast entry in the adapted cast surface.
  If interaction dynamics changed, also update the "Relationship-Specific Interactions" section for the affected cast entries.

  After writing the changes back to the cast entries, regenerate the adapted relationship surface for canonical `RELATIONSHIPS.md` from those entries per `docs/relationships-protocol.md`. The map is the derived snapshot; the cast entries are the source.

  Commit: `character: update relationship map`
</relationship_map_edit>

---

### Edge Cases

- **Only 2 cast entries:** Show a simple single-edge graph
- **No relationships defined:** Show cast entries as isolated nodes and suggest defining relationships
- **Circular relationships:** Handle gracefully (A -> B -> C -> A)
- **Sacred work type:** Use "lineage map" terminology; relationship types include "teacher-disciple", "prophetic succession", "covenant"

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
