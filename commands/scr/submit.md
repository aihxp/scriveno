---
description: Package and finalize a unit after editor review.
argument-hint: "[unit number]"
---

# Submit {unit}

You are finalizing a unit after editor review.

## Adaptive naming

Load `.manuscript/config.json` for `command_unit`. The runnable command stays `/scr:submit`; adapt the unit terminology in prompts and summaries.

## Prerequisites

- Review report must exist at `.manuscript/reviews/{N}-REVIEW.md`. For older projects, root-level `{N}-EDITOR-NOTES.md` also counts as a legacy review artifact.

## What to do

1. Load `.manuscript/config.json` for project context
2. Check that the specified unit has been through editor review. Prefer `.manuscript/reviews/{N}-REVIEW.md`; if it is missing, accept legacy `{N}-EDITOR-NOTES.md`.
3. Mark the unit as submitted in `STATE.md`
4. Report: "Unit {N} submitted. {remaining} units remaining."

## Tone

Brief and confirmational. The writer has already done the hard work.
