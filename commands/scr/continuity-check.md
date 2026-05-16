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

Load `.manuscript/config.json` to get `work_type`. Load Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) to check command adaptations. For sacred work types, this command is called 'doctrinal-check' and should additionally verify doctrinal consistency and canonical alignment. For academic work types, this command is called 'citation-check' and should additionally verify citation consistency and reference accuracy. For technical work types, this command is called 'consistency-check' and should additionally verify terminology consistency, prerequisite order, command syntax, version references, and recovery steps. Use adapted terminology throughout all output.

Invoke the installed `continuity-checker.md` agent for the writer's active Scriveno runtime (for example the runtime's global or project-scoped `agents/continuity-checker.md`) in a fresh context. Pass it:

- The full set of drafted units (`.manuscript/drafts/body/{N}-{A}-DRAFT.md` files in scope -- all units, or only Act `N` and prior acts when scoped)
- RECORD.md when present, as the compact store of established facts, open threads, promises, payoffs, and continuity obligations
- CHARACTERS.md (or FIGURES.md for sacred works)
- WORLD.md (or COSMOLOGY.md for sacred works)
- PLOT-GRAPH.md (or THEOLOGICAL-ARC.md for sacred works)
- DOCTRINES.md, LINEAGES.md, and CHRONOLOGY.md when present (sacred only)
- The previous continuity report if one exists, so the agent can verify resolved issues stayed resolved instead of re-flagging them

If the host runtime cannot spawn a native `continuity-checker` agent type, load the installed `agents/continuity-checker.md` prompt from the active runtime and run it in an isolated fresh context. Record that fallback in the status block.

The agent reads all drafted scenes and checks:

If RECORD.md contradicts the drafted text, flag the mismatch as a RECORD drift finding. If the drafted text reveals established facts or open threads that are missing from RECORD.md, list compact suggested updates under a "Record updates" section without rewriting the file unless the writer asked for fixes.

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

## Agent Status

Every response must include a short status block that makes invocation visible:

```text
Agent status:
Trigger: /scr:continuity-check {scope}
Spawned agents:
- continuity-checker: 1 fresh-context diagnostic invocation
Local operations:
- drafted files checked: {count}
- RECORD.md checked: yes/no
- prior report checked: yes/no
- report written: yes/no
Auto-invoked:
- none
Why: continuity-check is diagnostic only; fixes are writer-chosen handoffs
```

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
