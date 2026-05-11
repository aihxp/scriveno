---
description: Draft the planned unit. Invokes the drafter agent in fresh context per atomic unit.
argument-hint: "[unit number, optional]"
---

# Draft {unit}

You are orchestrating the drafter agent to produce the actual prose (or script, or verse, or passage) for a planned unit.

## Adaptive naming

Load `.manuscript/config.json` for `command_unit`. The runnable command stays `/scr:draft`; adapt the unit terminology in prompts and summaries.

## Prerequisites

Require `.manuscript/plans/{N}-*-PLAN.md` files to exist. If none exist, also check legacy root-level `.manuscript/{N}-*-PLAN.md` files before offering `/scr:plan N`. If the writer says "skip planning", generate minimal plans on the fly from OUTLINE.md + STYLE-GUIDE.md and save them in `.manuscript/plans/`.

## What to do

1. **Find all plan files for the unit.** Prefer `.manuscript/plans/{N}-*-PLAN.md` -- one per atomic unit (scene, subsection, passage). If no files exist there, fall back to legacy `.manuscript/{N}-*-PLAN.md`.

2. **For each atomic unit, invoke the installed `drafter.md` agent for the current runtime in a fresh context.** Use the agent path for the writer's active Scriven install (for example the runtime's global or project-scoped `agents/drafter.md`). Fresh context per atomic unit is critical -- it prevents voice drift, context bloat, and lets each scene be its best. The drafter receives:
   - STYLE-GUIDE.md (always, every time -- this is the voice DNA)
   - The specific `.manuscript/plans/{N}-{A}-PLAN.md` for this atomic unit, or the matching legacy root-level plan if that is all the project has
   - CHARACTERS.md or FIGURES.md (full file by default; only filtered to "relevant figures" when `draft.context_profile` is `minimal`). Loading the full file is the default because a character introduced via `/scr:new-character` after some plans were already written will not appear in those plans, and a relevance filter would silently exclude them from the drafter's view -- breaking character continuity through the manuscript.
   - The last 200 words of the previous atomic unit (for voice/tone continuity)
   - THEMES.md or DOCTRINES.md (relevant threads only)

3. **Save drafted output** to `.manuscript/drafts/body/{N}-{A}-DRAFT.md`.

4. **After all atomic units in the unit are drafted, do a voice-check pass.** Load the full drafted unit, compare against STYLE-GUIDE.md, flag any scenes that drift from the voice profile by more than the configured threshold. If drift is detected, offer to re-draft the problem scenes.

5. **Update STATE.md:** mark unit as drafted, note word count, flag any voice-check issues.

6. **Tell the writer:** "Drafted {unit} {N}: X words across Y {atomic_units}. Voice consistency: Z%. Ready for editor review? Run `/scr:editor-review N` or `/scr:next`."

## History log

After all atomic units in this invocation are drafted, append one line to `.manuscript/HISTORY.log` per `docs/history-protocol.md`:

```
{ISO timestamp} | scr:draft | unit={N} | files={comma-separated draft filenames written this run} | outcome=ok
```

If the run failed (drafter agent returned an error, voice-check blocked, etc.), use `outcome=failed:<short-reason>` instead. Create HISTORY.log if it does not exist. Do not log per atomic unit -- one line per `/scr:draft` invocation keeps the log scannable.

## Autopilot behavior

If config has `autopilot.enabled: true`, proceed to `/scr:editor-review` automatically after drafting. In supervised profile, pause here for the writer to read. In full-auto, keep going.

## Tone

Don't narrate each atomic unit being drafted. That's noise. Show progress concisely: "Drafted scene 1/4... 2/4... 3/4... 4/4. Voice check: passed."

Let the writer read the actual prose in the draft files. Your job is orchestration, not performance.
