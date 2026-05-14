---
description: Visualize a character's emotional and growth arc across the story.
argument-hint: "[name]"
---

# /scr:character-arc -- Character Arc Visualization

Visualize a character's emotional and growth arc aligned with story structure beats.

## Usage
```
/scr:character-arc <name>
```

## Instruction

You are visualizing a character's arc. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) (to check `file_adaptations` and `commands.character-arc.adapted`)
- The adapted characters file (CHARACTERS.md / FIGURES.md / CONCEPTS.md per `file_adaptations`)
- `PLOT-GRAPH.md` (story arc structure -- cross-reference per D-03)
- `OUTLINE.md` (scene/chapter mapping)

Determine adapted terminology from CONSTRAINTS.json:
- Default: "character arc"
- Sacred: "figure arc" (renamed via CONSTRAINTS.json)

---

### ARC VISUALIZATION

<character_arc_display>
  Find the character by name (case-insensitive match).

  Read the character's arc data:
  - Starting state (emotional/spiritual beginning)
  - Arc type (Change, Growth, Fall, Steadfast, Flat/Catalytic)
  - Turning points
  - Ending state

  **Cross-reference with PLOT-GRAPH.md (D-03):**
  Map the character's transformation moments to story structure beats:

  ```
  STORY BEAT              | CHARACTER STATE        | EMOTIONAL LEVEL
  ========================|========================|================
  Status Quo              | {starting state}       | -----*---------
  Inciting Incident       | {reaction/response}    | --------*------
  First Plot Point        | {commitment/refusal}   | ----------*----
  Rising Action           | {struggle/growth}      | -----------*---
  Midpoint                | {mirror moment}        | ------*--------
  All Is Lost             | {lowest point}         | --*------------
  Climax                  | {transformation}       | -------------*-
  Resolution              | {ending state}         | ----------*----
  ```

  For each story beat from PLOT-GRAPH.md:
  1. Show the beat name and its position in the arc
  2. Describe the character's emotional/psychological state at that point
  3. Note if this beat corresponds to a character turning point
  4. Show emotional trajectory direction (ascending, descending, steady, shift)

  **Arc Summary:**
  - Arc type: {type}
  - Total turning points: {N}
  - Key transformation moment: {which beat triggers the main change}
  - Theme connection: {which thematic thread this arc serves}

  If PLOT-GRAPH.md is missing or empty:
  - Show the character's arc data standalone (start -> turning points -> end)
  - Note: "Run `/scr:plot-graph` to create the story arc, then re-run this command to see how {name}'s arc aligns with story beats."

  If the character has no arc data:
  - "No arc defined for {name}. Run `/scr:character-sheet {name} --edit` to add arc information."
</character_arc_display>

---

### Edge Cases

- **Character not found:** Show partial matches or direct to cast-list
- **PLOT-GRAPH.md missing:** Show character arc standalone with note to create plot graph
- **Character has Flat/Catalytic arc:** Show how they affect other characters' arcs instead of personal transformation
- **Multiple POV characters:** Show only the requested character; suggest running for each POV
- **Sacred work type:** Align with theological arc positions instead of standard story beats

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
