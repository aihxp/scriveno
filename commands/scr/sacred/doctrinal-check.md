---
description: Verify internal theological and doctrinal consistency across the text. Flag contradictions in doctrine, moral teaching, or cosmological claims.
argument-hint: "[unit number, optional]"
---

# Doctrinal check

You verify theological and doctrinal consistency across drafted units. This is the sacred/historical equivalent of continuity-check, but focused on doctrinal claims rather than plot continuity.

## Availability

Sacred work types only. Requires at least one drafted unit and `DOCTRINES.md`.

## What to do

### No argument (check all units)

Load all drafted units. Load DOCTRINES.md and FRAMEWORK.md. For each doctrine tracked in DOCTRINES.md, scan the drafts for:

1. **Affirmations** -- Passages that affirm this doctrine. Verify the affirmations are consistent with each other and with the doctrine as stated in DOCTRINES.md.

2. **Challenges** -- Passages that present counter-positions. Verify they're handled according to FRAMEWORK.md's stance (confessional vs. descriptive vs. critical).

3. **Implicit contradictions** -- Passages that don't directly address the doctrine but imply something contrary to it. Flag these -- they're the most dangerous because they can slip by unnoticed.

4. **Drift over time** -- Doctrines that are presented differently in early units than later units. Is the drift intentional (e.g., showing doctrinal development) or accidental?

### With a unit number

Check one specific unit against DOCTRINES.md. Useful after drafting a unit to verify before submission. Faster than full-text check.

## What to look for

### Affirmed doctrines (from DOCTRINES.md with `position: affirmed`)

Every passage touching this doctrine should affirm it or be consistent with it. Flag any passage that:
- Contradicts the affirmation directly
- Implies something that undermines it
- Presents a counter-view without the contextual framing FRAMEWORK.md requires

### Contested doctrines (from DOCTRINES.md with `position: contested` or `disputed`)

The writer has chosen to present these without resolution. Verify:
- The work maintains that even-handedness
- No unit accidentally resolves the contest in one direction
- Multiple perspectives are represented if FRAMEWORK.md says they should be

### Developing doctrines

If DOCTRINES.md tracks the development of a doctrine across the text, verify the development proceeds in the right order -- earlier units don't jump ahead to the fully-developed form, later units don't revert to the earlier form.

### Counter-positions in the text

DOCTRINES.md lists counter-positions the text argues against. Verify:
- These counter-positions appear where they should (for the argument to work against them)
- They're presented accurately (not as strawmen unless strawman is intentional)
- The text's rebuttal is consistent with DOCTRINES.md

## What you return

```
DOCTRINAL CHECK REPORT
======================

Status: PASS / ISSUES FOUND

AFFIRMED DOCTRINES
- [doctrine name]: 12 passages checked, all consistent
- [doctrine name]: 8 passages checked, 1 issue at [unit:line]

CONTESTED DOCTRINES
- [doctrine name]: maintains even-handedness across 6 passages
- [doctrine name]: WARNING -- unit 3 appears to resolve this contest toward position X, contrary to FRAMEWORK.md

IMPLICIT CONTRADICTIONS
- [unit:line]: Statement implies X, which contradicts affirmed doctrine Y

DOCTRINAL DRIFT
- [doctrine name]: Presented as A in unit 1, as A' in unit 5, as A'' in unit 9. Intentional development or drift?

RECOMMENDATIONS
- Specific fix suggestions with unit/line references
- Whether to update DOCTRINES.md or revise the drafts
```

## Severity levels

Each finding is assigned a severity level:

- **contradiction** -- Directly opposes an affirmed doctrine in DOCTRINES.md. Highest priority. The writer almost certainly wants to fix this (or update DOCTRINES.md).
- **tension** -- May conflict with a doctrine, but the relationship is ambiguous. Could be intentional nuance, developing theology, or an oversight. Flag for review.
- **novel** -- Asserts something not addressed in DOCTRINES.md at all. Not necessarily wrong, but the writer should decide whether to add it to DOCTRINES.md or revise the passage. Common in creative sacred writing where the writer is exploring new theological territory.

The report groups findings by severity, with contradictions first, tensions second, novel assertions third. This lets the writer triage efficiently.

## Handling ambiguity

Some doctrinal questions have no clear answer. When uncertain whether a passage contradicts a doctrine, flag it as "potential issue" and let the writer decide. Don't assert contradictions you aren't sure of.

When the writer's stance is genuinely evolving (they realize DOCTRINES.md needs updating based on something they wrote), offer to update DOCTRINES.md rather than revising the drafts.

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

Precise and humble. Doctrinal claims are high-stakes -- a false alarm wastes the writer's time, a missed contradiction lets a problem ship. Be specific about what you see and what you're uncertain about.

Don't moralize. Don't take sides in inter-tradition disputes. Your job is internal consistency, not ecumenical judgment.
