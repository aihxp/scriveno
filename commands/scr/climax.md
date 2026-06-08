---
description: Generate and pressure-test the story's climax where conflict, crisis, character arcs, and planted payoffs converge.
argument-hint: "[unit number, optional]"
---

# /scr:climax -- Generate the Climax

The climax is where everything the work has built pays off at once: the central conflict resolves at its peak, the crisis (the lowest point) turns into the protagonist's decisive action, the planted setups fire, the lead's want-versus-need is settled, and the theme lands. This command does not draft the climax prose (that is `/scr:draft`); it devises and pressure-tests the climax so the scene it hands to `/scr:plan` is earned, not convenient.

## Usage
```
/scr:climax [unit]
```
If a unit number is given, treat that unit as the climax position; otherwise use the `Climax` arc position from `OUTLINE.md`, or ask which unit is the climax.

## Availability

Climax generation is for narrative work (prose, script, visual, interactive, and sacred narrative). It does not surface for poetry, speech, academic, or technical work. Use the work type's own term for the unit (scene, beat, chapter, passage).

## Instruction

### STEP 1: LOAD THE CONVERGENCE INPUTS

Load every surface the climax must satisfy:
- `WORK.md` -- premise, central question, logline, and the core conflict (primary type, external, internal)
- `CONFLICTS.md` if present -- the central conflict and the pairwise conflicts that must resolve or detonate here; otherwise read the conflict from `WORK.md` and the adapted cast entries
- `OUTLINE.md` -- the `Crisis` and `Climax` arc positions and the surrounding beats
- The adapted cast surface for canonical `CHARACTERS.md` -- for each major cast entry: want (conscious), need (unconscious), lie, the truth they must learn, and their arc start, turning point, and end
- `RECORD.md` -- "Promises and payoffs": every device still `planted` (Chekhov's guns that must fire) and open threads that need resolution
- `THEMES.md` (or the adapted file) -- the thematic question the climax should answer

### STEP 2: STATE WHAT THE CLIMAX MUST ACCOMPLISH

Before proposing anything, write a short brief of the obligations the climax inherits:
- The central conflict and how it stands at the crisis (the protagonist at their lowest, out of options)
- The protagonist's want versus need, and which the climax forces them to choose
- The planted devices still owed a payoff (from `RECORD.md`)
- The key relationships and pairwise conflicts that must resolve or break here
- The thematic question awaiting an answer

### STEP 3: PROPOSE CLIMAX OPTIONS

Offer two or three distinct climax options. For each, specify:
- **The decisive action** -- the confrontation or choice at the peak, and who acts
- **Earned by** -- the setup and the agency that make it land: which planted devices fire, what prior choice or knowledge the protagonist uses. The protagonist must drive the outcome through their own agency.
- **Want vs need** -- whether the lead gets the want, the need, or sacrifices one for the other
- **Conflicts resolved** -- how the central conflict and the load-bearing pairwise conflicts settle (won, lost, transformed)
- **The cost** -- what it takes; a climax without cost reads as unearned
- **Theme** -- the answer this option gives to the thematic question

### STEP 4: PRESSURE-TEST EACH OPTION

Reject or flag any option that wins by **deus ex machina** (a rescue from outside the established story logic, with no prior setup) or **plot armor** (the protagonist survives or succeeds only because the plot needs them to). Name the setup each option relies on; if an option has no setup, it is not yet a climax, it is a wish. Prefer the option whose payoff is most fully planted and most costly to the lead, so the climax is surprising and inevitable at once.

### STEP 5: RECORD THE CHOICE AND HAND OFF

When the writer chooses or refines an option:
- Write the chosen climax into the `Climax` arc position in `OUTLINE.md`, and note how the `Crisis` turns into it.
- Regenerate `.manuscript/CONFLICTS.md` from `WORK.md` and the adapted cast entries per `docs/conflict-protocol.md`, so the conflict map's climax reference reflects the chosen climax instead of going stale.
- In `RECORD.md` "Promises and payoffs", mark the devices this climax fires with their expected payoff location (the climax unit).
- Append one line to `.manuscript/HISTORY.log` per `docs/history-protocol.md`: `{ISO} | scr:climax | unit={N} | options={count} | outcome=ok`.
- Hand off: "Run `/scr:plan {N}` to plan the climax scene, then `/scr:draft {N}`. The conflict map and the unit's causal anchor will carry this climax into the scene."

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

Decisive and craft-focused. The writer is at the most important moment of the work; help them make it earned, surprising, and inevitable at once. Do not draft the prose; devise the climax and get out of the way.
