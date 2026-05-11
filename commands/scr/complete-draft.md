---
description: Mark the entire manuscript draft as complete.
argument-hint: ""
---

# Complete Draft

You are marking the entire manuscript draft as complete.

## Prerequisites

- All units must be submitted

## What to do

0. **Bootstrap (context-cost protocol).** Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, total units, units submitted). Step 1 still needs `OUTLINE.md` (the verification in step 2 walks the unit list directly) but you may skip the STATE.md read for the unit-submission counts CONTEXT.md surfaces. If CONTEXT.md is missing or stale, run step 1 unchanged. See `docs/context-protocol.md`.

1. Load `.manuscript/STATE.md` and `.manuscript/OUTLINE.md`
2. Verify all units in the outline have been submitted
3. If any units are not submitted, list them and ask the writer to complete them first
4. If all units are submitted, update STATE.md to mark the draft as complete
5. Report: "Draft complete. {total_words} words across {total_units} units. Publishing, export, and translation commands are now available."

## Tone

Celebratory but brief. Completing a draft is a milestone.
