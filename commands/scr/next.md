---
description: Auto-detect what to do next in your workflow and run it. The one command a writer can always use.
---

# Next

You are routing the writer to the right next step in their workflow. This command is the universal interface -- a writer who only ever types `/scr:next` should be able to complete an entire novel.

## What to do

1. **Check for `.manuscript/` directory.** If none, the writer has no project. Run `/scr:new-work` to start one (or tell them to).

2. **Read `.manuscript/CONTEXT.md` first if it exists.** This is the auto-regenerated bootstrap file written by `/scr:save`, `/scr:pause-work`, and `/scr:resume-work`. It already contains the suggested next step. If CONTEXT.md is present and its `Updated` timestamp is newer than STATE.md, you can route directly off its `Suggested next step` field without re-deriving from raw files. If CONTEXT.md is missing or stale (older than STATE.md, or older than the newest file in `.manuscript/drafts/body/`), continue with step 3 -- treat STATE.md as authoritative and silently note that CONTEXT.md should be regenerated on the next `/scr:save`. If CONTEXT.md and STATE.md disagree, trust STATE.md and warn the writer in one sentence so they can decide whether to run `/scr:scan`.

3. **Read `.manuscript/STATE.md`** to figure out the current workflow position. STATE.md tracks: current unit, current stage (discuss/plan/draft/review/submit), last command run, pending revisions, unresolved notes.

4. **Read `.manuscript/config.json`** to get the work type and command_unit (chapter, act, section, surah, etc.).

5. **Explain what you're about to do in ONE plain-language sentence**, then run it. Examples:
   - "You just finished drafting Chapter 3 -- running editor review now."
   - "Chapter 4 has a plan but no draft yet -- drafting it."
   - "You haven't discussed the next chapter -- shaping Chapter 5."

## Routing logic

Walk the core chain in order and run the first incomplete step:

1. **No OUTLINE.md** -> `/scr:discuss` (high-level discussion about the whole project)
2. **No CHARACTERS.md / FIGURES.md and work type supports them** -> `/scr:new-character` loop
3. **No STYLE-GUIDE.md calibration done** -> `/scr:voice-test`
4. **No {unit} discussed** -> `/scr:discuss N` (next pending unit)
5. **No {unit} planned** -> `/scr:plan N`
6. **No {unit} drafted** -> `/scr:draft N`
7. **No editor review** -> `/scr:editor-review N`
8. **Not submitted** -> `/scr:submit N`
9. **All units submitted** -> `/scr:complete-draft` or start next unit
10. **Draft complete, no revisions** -> suggest revision, beta reader, or publishing path
11. **Revisions pending** -> run the next revision step
12. **Everything done** -> suggest publishing: "Your draft is complete. You could start revisions, run a beta reader pass, or begin the publishing pipeline."

## Edge cases

- **Multiple valid next steps** -- Present choices: "Chapter 3 is ready to draft, but you also have editor notes on Chapter 2. Which first?"
- **Stuck state** -- If a command failed recently (logged in STATE.md), offer `/scr:troubleshoot` instead of retrying blindly.
- **Autopilot mode** -- If config has `autopilot.enabled: true`, run multiple steps in sequence without asking, pausing only per the profile's rules (guided, supervised, full-auto).

## Adaptive naming

Use canonical runnable commands, and adapt the terminology in prompts/output for the current work type. If `command_unit` is `surah`, run `/scr:draft` and frame the work as drafting a surah; keep the command id stable and treat unit labels as presentation only.

## Tone

Brief. Decisive. Don't explain the routing logic to the user -- just tell them what you're doing and do it. They're trusting you to know.
