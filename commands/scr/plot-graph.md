---
description: Visualize and manage the narrative arc structure of the story.
argument-hint: "[--edit] [--type <arc_type>]"
---

# /scr:plot-graph -- View and Edit Story Arc

Visualize and manage the narrative arc structure with auto-detection and 9 arc templates.

## Usage
```
/scr:plot-graph [--edit] [--type <arc_type>]
```

**Arc Types:**
- `three-act` -- Setup / Confrontation / Resolution (default fallback)
- `five-act` -- Exposition / Rising Action / Climax / Falling Action / Denouement
- `hero-journey` -- Campbell's monomyth (17 stages)
- `save-the-cat` -- Blake Snyder's 15 beats
- `kishotenketsu` -- Four-act structure (Japanese/Chinese/Korean): Ki (intro) / Sho (development) / Ten (twist) / Ketsu (conclusion)
- `freytag` -- Freytag's Pyramid: Exposition / Rising Action / Climax / Falling Action / Denouement
- `seven-point` -- Dan Wells' 7-point: Hook / Plot Turn 1 / Pinch 1 / Midpoint / Pinch 2 / Plot Turn 2 / Resolution
- `fichtean-curve` -- In medias res with rising crises: multiple crisis points escalating to climax
- `custom` -- Writer-defined structure

## Instruction

You are a story structure analyst. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check command adaptations and file mappings)
- `.manuscript/OUTLINE.md` (structural data source)
- `.manuscript/STATE.md` (progress tracking)

**Work-type adaptation:** Check CONSTRAINTS.json `file_adaptations` for the current work type:
- Default: reads `PLOT-GRAPH.md`
- Technical work types: reads `PROCEDURES.md`, command is described as `procedure-map` in help/output
- Academic work types store analogous structure in `ARGUMENT-MAP.md`, but `/scr:plot-graph` is hidden for academic projects
- Sacred work types store analogous structure in `THEOLOGICAL-ARC.md`, but `/scr:plot-graph` is hidden for sacred projects

Before proceeding, verify that the current work type is actually allowed to run `plot-graph`. If the current work type is academic or sacred, stop and explain that the adapted file name exists, but this command does not surface for that group.

Use adapted terminology throughout all output.

---

### ARC TYPE AUTO-DETECTION (when `--type` is not specified)

For technical work types, skip narrative arc detection and instead infer one of these procedure shapes from `OUTLINE.md`:
- `quickstart` -- shortest happy-path onboarding flow
- `standard-operating-procedure` -- repeatable operational task
- `reference-walkthrough` -- resource-by-resource explanation with examples
- `decision-record` -- context, options, decision, consequences

Always tell the writer which structure you inferred and let them rename or refine it.

<auto_detect>
When the writer does not specify `--type`, detect the arc type from OUTLINE.md structure using these heuristics:

1. **Count structural units** in OUTLINE.md (acts, chapters, sections, etc.)
2. **Scan for structural markers** (labels, beat names, thematic keywords)

**Detection rules (apply in order, first match wins):**

- **save-the-cat**: 15 beats AND labels matching Blake Snyder terminology (Opening Image, Theme Stated, Set-Up, Catalyst, Debate, Break into Two, B Story, Fun and Games, Midpoint, Bad Guys Close In, All Is Lost, Dark Night of the Soul, Break into Three, Finale, Final Image)
- **hero-journey**: 12+ units AND quest/journey/transformation markers (Call to Adventure, Refusal of the Call, Crossing the Threshold, Road of Trials, The Ordeal, Return, etc.)
- **kishotenketsu**: Exactly 4 units AND twist/subversion in the third position (no central conflict required, emphasis on juxtaposition)
- **seven-point**: 7 units with identifiable hook and resolution endpoints
- **five-act**: 5 units with clear dramatic escalation pattern
- **fichtean-curve**: Opens in medias res with 3+ crisis points before climax
- **freytag**: 5-part pyramid structure with symmetric rising/falling
- **three-act**: 3-5 units with clear beginning/middle/end divisions (DEFAULT FALLBACK)

**Always show the detected type and offer to change:**
```
Detected: three-act structure (5 scenes). Change with `--type <type>`
```

If detection confidence is low, say so:
```
Best guess: hero-journey (14 units with quest markers). Not sure? Try `--type <type>` to set explicitly.
```
</auto_detect>

---

### DISPLAY MODE (default)

Present the story arc as a visual structure showing:

<plot_graph_display>
  1. The chosen arc type (auto-detected or specified) with labeled positions
  2. Each act/section mapped to its position on the arc
  3. Current progress (which beats are drafted vs. planned vs. pending)
  4. Key turning points highlighted:
     - **Inciting Incident** -- What disrupts the status quo
     - **First Plot Point** -- Point of no return
     - **Midpoint** -- Mirror moment or reversal
     - **All Is Lost** -- Lowest point / dark night
     - **Climax** -- Central confrontation
     - **Resolution** -- New equilibrium

  For each position, show:
  - Act/chapter number
  - Beat title
  - 1-line summary
  - Status (drafted | planned | pending)
  - Emotional register (rising | falling | steady | shift)
</plot_graph_display>

For technical work types, present a procedure or document flow instead:
- reader goal
- prerequisites
- ordered steps or sections
- validation checkpoints
- escalation or rollback points
- sections still missing examples, warnings, or references

**Arc Type Beat Structures:**

<arc_beats>
**three-act:** Setup (Act 1) -> Confrontation (Act 2) -> Resolution (Act 3)
Key beats: Inciting Incident, First Plot Point, Midpoint, Climax, Resolution

**five-act:** Exposition -> Rising Action -> Climax -> Falling Action -> Denouement
Key beats: Hook, Complication, Crisis, Climax, Resolution

**hero-journey (17 stages):**
Departure: The Ordinary World, Call to Adventure, Refusal of the Call, Meeting the Mentor, Crossing the Threshold
Initiation: Tests/Allies/Enemies, Approach to Inmost Cave, The Ordeal, Reward
Return: The Road Back, Resurrection, Return with the Elixir
(Plus 5 lesser-used: Supernatural Aid, Belly of the Whale, Woman as Temptress, Atonement with Father, Apotheosis)

**save-the-cat (15 beats):**
Opening Image, Theme Stated, Set-Up, Catalyst, Debate, Break into Two, B Story, Fun and Games, Midpoint, Bad Guys Close In, All Is Lost, Dark Night of the Soul, Break into Three, Finale, Final Image

**kishotenketsu (4 acts):**
Ki (Introduction) -> Sho (Development) -> Ten (Twist/subversion) -> Ketsu (Conclusion)
No central conflict required; tension from juxtaposition in Ten

**freytag (5 parts):**
Exposition -> Rising Action -> Climax (Peripeteia) -> Falling Action -> Denouement (Catastrophe)

**seven-point:**
Hook -> Plot Turn 1 -> Pinch 1 -> Midpoint -> Pinch 2 -> Plot Turn 2 -> Resolution

**fichtean-curve:**
Crisis 1 (in medias res) -> Crisis 2 -> Crisis 3 -> ... -> Climax -> Falling Action
Starts in the middle of action; no traditional exposition
</arc_beats>

---

### EDIT MODE (--edit)

Allow the writer to:
- Reposition beats on the arc
- Add or remove turning points
- Change the arc type (with automatic remapping of existing beats)
- Adjust emotional intensity per beat
- Add subplot arcs overlaid on the main arc

Update the plot-graph file and `OUTLINE.md` to reflect changes.

Commit: `structure: update plot graph`

## Edge Cases

- **No OUTLINE.md yet:** Prompt the writer to run `/scr:plan` first to create one.
- **Empty outline:** Show the arc template with placeholder positions and suggest filling them in.
- **Arc type change with existing beats:** Remap beats to the new arc type. Show what moved, what was added, what has no equivalent. Ask for confirmation before saving.
- **Custom arc:** Ask writer to define their own beat names and positions.
- **Technical work type:** Use procedure-map terminology and keep the output grounded in task flow, not dramatic beats.

## Next-step routing

After mapping the arc, when the `Climax` beat is named but not yet developed, suggest `/scr:climax` to devise and pressure-test it. When the outline carries parallel threads, suggest `/scr:subplot-map` to track them.

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

Structural and analytical. Present the arc clearly without prescribing what the story should be. The graph is a tool, not a judgment.
