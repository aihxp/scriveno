---
description: Show project progress -- a unit progress bar, what is done / in progress / untouched, pipeline position, and a pointer to the per-unit ledger.
argument-hint: ""
---

# Progress

You are showing the writer their current project progress.

Follow the auto-invoke policy. In the source repository it is documented at `docs/auto-invoke-policy.md`. `/scr:progress` is read-only: it can count, compare, and recommend, but it must not spawn agents or write files.

Use the shared executable engine before falling back to manual counts. Try the first available path:

```bash
scriveno status --project "$PWD" --trigger /scr:progress
node lib/auto-invoke-engine.js --project "$PWD" --trigger /scr:progress
node "$HOME/.scriveno/lib/auto-invoke-engine.js" --project "$PWD" --trigger /scr:progress
node .scriveno/lib/auto-invoke-engine.js --project "$PWD" --trigger /scr:progress
```

This engine is installed into Scriveno shared assets for every runtime, including Claude Code, Codex, Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, Antigravity, Manus, Perplexity Desktop, and the generic skill fallback. The engine exposes `computeProgressLedger(manuscriptDir)` (see `lib/auto-invoke-engine.js` and `docs/progress-protocol.md`), which returns the deliverable bar, percent, and the done / in progress / untouched bucket counts deterministically from disk; a runtime that loads the module should prefer it over re-deriving counts by hand. If the engine is not present, perform the read-only progress logic below.

## Prerequisites

- `.manuscript/STATE.md` must exist

## What to do

1. Load `.manuscript/STATE.md`, `.manuscript/OUTLINE.md`, `.manuscript/config.json`, and `.manuscript/RECORD.md` when present. Read `.manuscript/PROGRESS.md` if it exists -- it is the saved ledger snapshot.
2. Derive per-unit status from disk per `docs/progress-protocol.md`: for each outline unit, resolve its stage (untouched / discussed / planned / drafted / reviewed / submitted) and its headline bucket (done / in progress / untouched). Count units in each bucket plus the total, and calculate word count from existing draft files.
3. Determine the pipeline position: the first incomplete stage on the writing lifecycle `seed > voice > outline > discuss > plan > draft > review > revise > publish > translate`, expressed as `Stage {index} of {total}: {Name}`.
4. Determine the next step (what unit to discuss, plan, or draft next), using the work type's unit label from CONSTRAINTS.json (chapter, act, surah, section, and so on).
5. Display the progress report, leading with the deliverable view:
   - A progress bar over units, for example `████████░░ 4/5 scenes done (80%)` (block characters `U+2588` filled and `U+2591` empty; use the work type's plural unit label).
   - "Done: {done}   In progress: {in_progress}   Untouched: {untouched}."
   - "{word_count} words so far."
   - "Pipeline: Stage {index} of {total} ({stage_name})."
   - "{open_threads} open record threads." (only when RECORD.md exists)
   - "Next: {next_action}"
   - "Full per-unit ledger: `.manuscript/PROGRESS.md`" -- the file the writer can open any time to see every unit's status. If it is missing or older than the newest draft, add: "(run `/scr:save` to refresh the saved ledger)".
   When the project is small (20 units or fewer) or the writer asks, render the per-unit ledger table inline per `docs/progress-protocol.md` instead of only pointing at the file.
6. Run the Level 1 proactive sweep:
   - If STATE.md counts disagree with draft files, suggest `/scr:scan`.
   - If reports show unresolved review items, suggest the matching review command.
   - If exports are stale, suggest `/scr:export` or `/scr:publish`.
   - If translation work exists and follow-up reports are missing, suggest the next translation check.
   - If unsaved manuscript changes exist, suggest `/scr:save`.

## Automation Status

Every response must include a compact status block:

```text
Automation status:
Trigger: /scr:progress
Spawned agents:
- none
Candidate agents:
- <recommended agent route or none>
Local operations:
- progress counts computed: yes/no
- per-unit ledger rendered: yes/no
- proactive sweep: read-only
Candidate local helpers:
- /scr:save to refresh the saved .manuscript/PROGRESS.md when it is stale
Manual gates:
- <writer-owned route or none>
Auto-invoked:
- none
Why: progress is read-only; it renders the ledger live and points at .manuscript/PROGRESS.md without writing it
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

## Tone

Informative and motivating. Show progress without judgment.
