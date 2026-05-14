---
description: Update a character's evolving state (emotional position, knowledge, possessions, relationships) after a unit lands.
argument-hint: "<name> [--from <unit>]"
---

# /scr:character-touch -- Update Character State

CHARACTERS.md (and FIGURES.md for sacred works) is a living document. Voice anchors and physical descriptions stay stable; emotional position, knowledge, possessions, and relationships move as the story unfolds. Without periodic touch-ups, the file freezes at character-creation time and the drafter ends up reading a stale "current emotional state" two-thirds of the way through the manuscript.

This command is the touch-up surface. Use it after `/scr:draft` (especially when the drafter emits a CHARACTER STATE NUDGE), or any time you've written prose that visibly shifts a character.

## Usage

```
/scr:character-touch <name>                  # interactive update
/scr:character-touch <name> --from <unit>    # base the update on a specific unit's drafted prose
```

If `<name>` is omitted, list all characters from CHARACTERS.md and ask which to update.

## Instruction

### STEP 0: BOOTSTRAP (context-cost protocol)

Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, current unit, recent activity). Step 1 still needs the full CHARACTERS.md (you will be editing it). See `docs/context-protocol.md` for the contract.

### STEP 1: LOAD CONTEXT

Load these project files:

- `.manuscript/config.json` -- to determine work type (CHARACTERS.md vs FIGURES.md naming)
- `.manuscript/CHARACTERS.md` (or `FIGURES.md` for sacred works) -- the file you will update
- `.manuscript/STATE.md` -- to know which units have been drafted
- The drafted unit file for the touch-up basis: `.manuscript/drafts/body/{N}-*-DRAFT.md` either for the unit named in `--from` or, if `--from` is omitted, the most recently modified draft file (the unit whose state shift is most likely fresh in the writer's mind)

### STEP 2: RESOLVE THE CHARACTER

If the writer named a character, find their entry in CHARACTERS.md by case-insensitive name match. If no match, suggest the closest names from the file and stop.

If the writer did not name a character, list every character from CHARACTERS.md (one per line, with their voice anchor as a hint) and ask which to update.

### STEP 3: PROPOSE A DELTA

Read the basis draft file (from STEP 1). Identify what about this character has visibly shifted in this unit. Cover four dimensions; skip any that did not change:

1. **Emotional position** -- where they are now vs where the file says they were (e.g. "from grieving to numb-determined")
2. **Knowledge** -- what they learned this unit that they did not know before (or, less commonly, what they have forgotten or been deceived into believing)
3. **Possessions** -- objects gained, lost, given, taken (e.g. "now carries the letter; left the coat behind")
4. **Relationships** -- with whom, how shifted (e.g. "trust with Marcus broken; new alliance with Sarah forming")
5. **Relationship-specific interaction** -- whether this unit changed how the character behaves with another person (speech shift, trust posture, conflict pattern, hidden agenda or fear)

Present the proposed delta to the writer in this exact format:

```
Character: <name>
Basis: <unit name from draft filename>

Proposed updates to <NAME>'s entry in CHARACTERS.md:

  Emotional position
    was: <current text from CHARACTERS.md>
    now: <proposed new text>

  Knowledge gained
    + <new knowledge bullet>
    + <new knowledge bullet>

  Possessions
    + <gained>
    - <lost or given>

  Relationships
    <other character>: <new state>

  Relationship-specific interaction
    <other character>: <new trust posture, conflict pattern, speech shift, hidden agenda or fear>

Apply these updates? (yes / no / edit)
```

If the writer accepts (`yes`), proceed to STEP 4. If `edit`, ask which dimension to revise and re-prompt. If `no`, exit with no changes and no log entry.

### STEP 4: APPLY THE DELTA

Update the character's entry in `.manuscript/CHARACTERS.md` (or `FIGURES.md`):

- **Replace** the existing "Emotional position" / "Current emotional state" line with the new value. If the entry has no such line, add it under the section the writer's character template uses for evolving state (look for "Current state", "Arc state", or just append to the end of the entry).
- **Append** new knowledge bullets under a "Knowledge" subsection (create the subsection if absent).
- **Append** possession changes under a "Possessions" subsection (create the subsection if absent), with `+` for gained and `-` for lost.
- **Update or append** relationship lines under a "Relationships" subsection (create the subsection if absent).
- **Update or append** pairwise behavior under a "Relationship-specific interactions" subsection (create the subsection if absent).

**Do not touch:**
- The character's voice anchor (this is identity, not state -- voice changes are a separate craft decision and need a different command)
- Their physical description (height, eye color, distinguishing features -- those are stable unless the prose explicitly changed them, in which case treat as a Knowledge or Possession entry: "lost left arm in chapter 12")
- Their name, age-at-introduction, or backstory section

Preserve the file's existing formatting and section order.

### STEP 5: STAMP THE UPDATE

Add a one-line "Last touched" marker under the character's entry:

```
_Last touched: {ISO timestamp} -- after drafting <unit name>_
```

If a Last-touched line already exists, replace it.

### STEP 6: HISTORY LOG

Append one line to `.manuscript/HISTORY.log` per `docs/history-protocol.md`:

```
{ISO timestamp} | scr:character-touch | character=<name> | basis=<unit name> | dimensions=<comma-separated list of changed dimensions> | outcome=ok
```

If the writer chose `no` and exited with no changes, do not append a line. Touch-ups that go nowhere are not state events.

### STEP 7: SUGGEST NEXT

End with a one-line suggestion:

> Updated <name>. The next `/scr:draft` invocation will read the new state. Consider running `/scr:scan` if multiple characters drifted in this unit.

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

Brisk and editorial. The writer just finished a draft; they're in flow. Surface the proposed delta, get a yes / no / edit answer, apply, get out. Do not narrate. Do not ask follow-up questions beyond the delta confirmation.

## What this command is not

- **Not a re-write of the character's profile.** Use `/scr:new-character` to start fresh, `/scr:character-sheet <name>` to view, this command to update evolving state.
- **Not an arc analysis.** Use `/scr:character-arc <name>` to see the trajectory across units.
- **Not automatic.** This command exists because automatic state updates risk silently overwriting the writer's intentional choices. The writer is always in the loop on a character's state.
