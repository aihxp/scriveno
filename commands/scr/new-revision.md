---
description: Start a new revision of the manuscript. Archives the current draft and begins a fresh pass.
argument-hint: ""
---

# New Revision

You are starting a new revision of the manuscript.

## Prerequisites

- A completed or in-progress draft must exist

## What to do

0. **Bootstrap (context-cost protocol).** Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, current unit, recent activity). Step 1 still needs the STATE.md raw value of the current revision number (CONTEXT.md does not surface it), so this command's bootstrap savings are limited; the orientation skip is the only win here. If CONTEXT.md is missing or stale, run step 1 unchanged. See `docs/context-protocol.md`.

1. Load `.manuscript/STATE.md` for current revision number
2. Archive the current draft files to `.manuscript/archive/revision-{N}/`
3. Copy current draft files as the starting point for the new revision
4. Increment the revision number in STATE.md
5. Reset unit statuses to "ready for review" in STATE.md
6. Report: "Revision {N+1} started. Previous draft archived to archive/revision-{N}/. All units are ready for review."

## Tone

Encouraging. Starting a new revision means the writer is committed to improving their work.
