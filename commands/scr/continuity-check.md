---
description: Automated continuity verification to scan for narrative contradictions across the manuscript.
---

# /scr:continuity-check -- Scan for Narrative Contradictions

Automated continuity verification across the manuscript.

## Usage
```
/scr:continuity-check [N]
```

If `N` is provided, checks only Act N against previous acts. Otherwise checks entire manuscript.

## Instruction

Load `.manuscript/config.json` to get `work_type`. Load Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) to check command adaptations. For sacred work types, this command is called 'doctrinal-check' and should additionally verify doctrinal consistency and canonical alignment. For academic work types, this command is called 'citation-check' and should additionally verify citation consistency and reference accuracy. For technical work types, this command is called 'consistency-check' and should additionally verify terminology consistency, prerequisite order, command syntax, version references, and recovery steps. Use adapted terminology throughout all output.

Invoke the installed `continuity-checker.md` agent for the writer's active Scriven runtime (for example the runtime's global or project-scoped `agents/continuity-checker.md`) in a fresh context. Pass it:

- The full set of drafted units (`.manuscript/drafts/body/{N}-{A}-DRAFT.md` files in scope -- all units, or only Act `N` and prior acts when scoped)
- CHARACTERS.md (or FIGURES.md for sacred works)
- WORLD.md (or COSMOLOGY.md for sacred works)
- PLOT-GRAPH.md (or THEOLOGICAL-ARC.md for sacred works)
- DOCTRINES.md, LINEAGES.md, and CHRONOLOGY.md when present (sacred only)
- The previous continuity report if one exists, so the agent can verify resolved issues stayed resolved instead of re-flagging them

The agent reads all drafted scenes and checks:

<continuity_checks>
  <check name="character_consistency">
    - Physical descriptions match across scenes (eye color, height, scars, etc.)
    - Character names are spelled consistently
    - Age references are consistent with timeline
    - Skills/abilities don't appear or disappear without explanation
    - Knowledge: characters only know what they've been told or witnessed
    - Emotional states follow logically from preceding events
  </check>

  <check name="timeline_logic">
    - Days of the week and dates are consistent
    - Travel time between locations is realistic
    - Seasonal references match the timeline
    - Character ages align with time jumps
    - "Three days ago" type references check out
    - Meals, sleep, and time-of-day references are consistent
  </check>

  <check name="object_tracking">
    - Props and objects are where they should be
    - If a character picks up an item, it's tracked
    - Vehicles, weapons, keys, phones -- all accounted for
    - Clothing changes are consistent with context
    - Food/drink orders match what's consumed
  </check>

  <check name="spatial_consistency">
    - Room layouts don't change between scenes
    - Geographic distances are maintained
    - Characters move logically between locations
    - Building/space descriptions are consistent
    - Left/right, north/south orientations hold
  </check>

  <check name="information_flow">
    - Characters don't reference information they haven't received
    - Secrets stay secret until revealed
    - Dramatic irony is intentional, not accidental
    - "As you know, Bob" violations flagged
    - Overheard conversations: who could realistically hear what
  </check>

  <check name="world_rules">
    - Magic/technology systems follow established rules
    - Social norms are consistently applied
    - Economic realities are consistent
    - Laws of physics respected (or consistently broken in speculative fiction)
  </check>
</continuity_checks>

For technical work types, reinterpret the checks above through a documentation lens:
- "character consistency" becomes audience/role consistency
- "timeline logic" becomes procedure order and escalation order
- "object tracking" becomes command, file, flag, and artifact tracking
- "spatial consistency" becomes environment/platform consistency
- "information flow" becomes prerequisite and dependency disclosure
- "world rules" becomes system constraints, supported-version, and safety consistency

### OUTPUT

Generate a continuity report with:
- [ok] Areas that check out
- WARNING Minor inconsistencies (easy fixes)
- [major] Major contradictions (require scene revision)

For each issue:
- What the contradiction is
- Where it appears (file, paragraph reference)
- What the established fact was and where it was established
- Suggested fix

Save to `.manuscript/{act_num}-CONTINUITY-REPORT.md` or `.manuscript/FULL-CONTINUITY-REPORT.md`. For technical work types, use `CONSISTENCY-REPORT` in the writer-facing title even if the file path stays the same.
