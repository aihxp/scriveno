---
description: Save your current work. Auto-generates a descriptive save message from context.
argument-hint: "[optional message]"
---

# Save

You are saving the writer's current work. Your job is to create a git commit with a writer-friendly message, without exposing any git terminology.

Follow the auto-invoke policy. In the source repository it is documented at `docs/auto-invoke-policy.md`. `/scr:save` does not spawn agents. It owns safe local helpers for `STATE.md`, `CONTEXT.md`, and `HISTORY.log`, then saves `.manuscript/`.

## What to do

1. **Check for `.manuscript/` directory.** If missing: "No manuscript found. Start with `/scr:new-work`."

2. **Check for `.git/` directory.** If missing:
   - Read `.manuscript/config.json` for `developer_mode`.
   - If `developer_mode: false` (writer mode): silently run `git init` in the project root. No output about this.
   - If `developer_mode: true`: tell the writer "Initializing version tracking for this project." then run `git init`.

3. **Check for changes to save.** Run `git status --porcelain .manuscript/`. If nothing has changed:
   - Look at the last entry in STATE.md "Last actions" table for the timestamp.
   - Tell the writer: "Nothing new to save. Your last save was [timestamp from last action]."
   - Stop here.

4. **Read `.manuscript/STATE.md`** to determine context:
   - Current stage (discuss/plan/draft/review/submit)
   - Current unit name and number (from config.json `command_unit` and STATE.md `Current unit`)
   - Last command run (from "Last actions" table)
   - Record highlights from `.manuscript/RECORD.md` when present: open threads, next-unit obligations, and recent established items

5. **Auto-generate the commit message** based on context:
   - If the writer provided an optional message argument: `"Saved: {writer's message}"`
   - After drafting (last command was `draft`): `"Saved after drafting {unit_name} {N}"`
   - After review (last command was `editor-review`): `"Saved after editor review of {unit_name} {N}"`
   - After revision (last command was `revise`): `"Saved after revising {unit_name} {N}"`
   - After planning (last command was `plan`): `"Saved after planning {unit_name} {N}"`
   - After discussion (last command was `discuss`): `"Saved after discussing {unit_name} {N}"`
   - Default / manual save: `"Saved work in progress on {unit_name} {N}"`

6. **Update STATE.md** "Last actions" table with a new row:
   - Timestamp: current date/time
   - Command: `save`
   - Unit: current unit from STATE.md
   - Outcome: the generated message

7. **Regenerate `.manuscript/CONTEXT.md`** before staging. This file is the bootstrap any new session reads first. Use the `templates/CONTEXT.md` scaffold and fill every `{{TOKEN}}`:
   - `{{LAST_UPDATED}}` -- ISO 8601 timestamp of this save
   - `{{LAST_COMMAND}}` -- `/scr:save`
   - `{{TITLE}}`, `{{WORK_TYPE}}` -- from `.manuscript/config.json`
   - `{{PHASE}}`, `{{CURRENT_UNIT}}` -- from STATE.md (the values you computed in step 6)
   - `{{RECENT_ACTIONS}}` -- the last 5 lines of `.manuscript/HISTORY.log` rendered as table rows. If HISTORY.log is missing, use the last 5 entries from STATE.md "Last actions" instead.
   - `{{UNITS_PENDING_REVIEW}}`, `{{UNITS_PENDING_DRAFT}}`, `{{VOICE_WARNINGS}}`, `{{CONTINUITY_FLAGS}}`, `{{SCAFFOLD_MARKERS}}` -- from STATE.md "Pending"
   - `{{RECORD_HIGHLIGHTS}}` -- a compact 3-5 line summary from RECORD.md: open threads, promises needing payoff, and next-unit obligations. If RECORD.md is missing, use `No RECORD.md found yet.`
   - `{{NEXT_STEP}}` -- the same suggestion `/scr:next` would emit
   - `{{LAST_SCAN}}`, `{{LAST_SCAN_VERDICT}}` -- from STATE.md if recorded; otherwise `never run` and `unknown`
   Save to `.manuscript/CONTEXT.md`. This file is committed alongside STATE.md.

8. **Regenerate `.manuscript/PROGRESS.md`** before staging. This is the openable per-unit progress ledger. Use the `templates/PROGRESS.md` scaffold and derive per-unit status from disk per `docs/progress-protocol.md` (plan, draft, and review files reconciled with STATE.md). Fill the unit ledger, the deliverable progress bar, the pipeline position, and the bucket counts (done / in progress / untouched). Save to `.manuscript/PROGRESS.md`; it is committed alongside STATE.md and CONTEXT.md.

8b. **Regenerate `.manuscript/RELATIONSHIPS.md`** when the work type has a characters surface (per `surface_applicability`) and `.manuscript/CHARACTERS.md` defines two or more characters. This derived relationship map is rebuilt from the relationship sections of `CHARACTERS.md` per `docs/relationships-protocol.md`: every pairing accounted for (pairs with no relationship marked `none`, pairs no one has described yet surfaced as undefined). Skip silently for work types without characters or with fewer than two. It is committed alongside `STATE.md`, `CONTEXT.md`, and `PROGRESS.md`.

8c. **Regenerate `.manuscript/CONFLICTS.md`** when the work has a central conflict in `WORK.md` or two or more characters, and the work type is narrative (skip poetry and speech). This derived conflict map is rebuilt from the `WORK.md` central conflict and the character entries per `docs/conflict-protocol.md`: every character pair accounted for (pairs with no conflict marked `no conflict`). Skip silently where conflict does not apply. It is committed alongside the other derived surfaces.

9. **Append one line to `.manuscript/HISTORY.log`** per `docs/history-protocol.md`:
   ```
   {ISO timestamp} | scr:save | message="{generated message}" | files={changed file count} | outcome=committed
   ```
   If HISTORY.log does not exist, create it. Do not stage it as a separate operation -- step 9 picks it up.

10. **Execute the save:**
   ```
   git add .manuscript/
   git commit -m "{generated message}"
   ```
   This commit must include the `STATE.md`, `CONTEXT.md`, `PROGRESS.md`, and `HISTORY.log` updates from steps 6 through 9 so the worktree is clean immediately after a successful save.

11. **Tell the writer** the result (see output section below).

## Automation Status

Every response must include a compact status block:

```text
Automation status:
Trigger: /scr:save
Spawned agents:
- none
Candidate agents:
- none
Local operations:
- STATE.md updated: yes/no
- CONTEXT.md regenerated: yes/no
- PROGRESS.md regenerated: yes/no
- RELATIONSHIPS.md regenerated: yes/no
- CONFLICTS.md regenerated: yes/no
- HISTORY.log appended: yes/no
- manuscript files saved: yes/no
Candidate local helpers:
- /scr:scan if saved state and disk still disagree
Manual gates:
- none
Auto-invoked:
- /scr:next route computed for CONTEXT.md: yes/no
Why: save uses deterministic local bookkeeping, not a spawned agent
```

## Writer mode output

- **Writer mode** (`developer_mode: false`): "Saved. You can see your save history with `/scr:history`."
- **Developer mode** (`developer_mode: true`): Show full git commit output including the short hash and message: "Committed: {hash} - {message}"

## Edge cases

- **No changes to save:** "Nothing new to save. Your last save was [timestamp]."
- **Not in a Scriveno project** (no `.manuscript/` directory): "No manuscript found. Start with `/scr:new-work`."
- **Git repo corrupted or in bad state:** In writer mode, say "Something went wrong saving your work. Try again, or ask for help." In developer mode, show the git error.
- **Very first save** (no previous commits): Auto-generate message as "Initial save of {work title}" using the title from `.manuscript/WORK.md` if available.

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

Brief. Reassuring. The writer should feel that their work is safely stored. Don't explain what git did -- just confirm it's saved.
