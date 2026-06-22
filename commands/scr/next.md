---
description: Auto-detect what to do next in your workflow and run it. The one command a writer can always use.
---

# Next

You are routing the writer to the right next step in their workflow. This command is the universal interface -- a writer who only ever types `/scr:next` should be able to complete an entire novel.

Follow the auto-invoke policy. In the source repository it is documented at `docs/auto-invoke-policy.md`. `/scr:next` is Level 1 only by default: it may inspect disk state and suggest the safest next command, but it does not spawn agents or mutate files unless autopilot mode explicitly routes into another command.

Use the shared executable engine before falling back to manual inspection. Try the first available path:

```bash
scriveno status --project "$PWD" --trigger /scr:next
node lib/auto-invoke-engine.js --project "$PWD" --trigger /scr:next
node "$HOME/.scriveno/lib/auto-invoke-engine.js" --project "$PWD" --trigger /scr:next
node .scriveno/lib/auto-invoke-engine.js --project "$PWD" --trigger /scr:next
```

This engine is installed into Scriveno shared assets for every runtime, including Claude Code, Codex, Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, Antigravity, Manus, Perplexity Desktop, and the generic skill fallback. If the engine is not present, perform the read-only sweep below.

## What to do

1. **Check for `.manuscript/` directory.** If none, the writer has no project. Run `/scr:new-work` to start one (or tell them to).

2. **Read `.manuscript/CONTEXT.md` first if it exists.** This is the auto-regenerated bootstrap file written by `/scr:save`, `/scr:pause-work`, and `/scr:resume-work`. It already contains the suggested next step. If CONTEXT.md is present and its `Updated` timestamp is newer than STATE.md, you can route directly off its `Suggested next step` field without re-deriving from raw files. If CONTEXT.md is missing or stale (older than STATE.md, or older than the newest file in `.manuscript/drafts/body/`), continue with step 3 -- treat STATE.md as authoritative and silently note that CONTEXT.md should be regenerated on the next `/scr:save`. If CONTEXT.md and STATE.md disagree, trust STATE.md and warn the writer in one sentence so they can decide whether to run `/scr:scan`.

3. **Read `.manuscript/STATE.md`** to figure out the current workflow position. STATE.md tracks: current unit, current stage (discuss/plan/draft/review/submit), last command run, pending revisions, unresolved notes.

4. **Read `.manuscript/RECORD.md` when present.** Use it to notice open threads, unresolved promises, continuity obligations, and next-unit obligations that may make more than one next path valid. If RECORD.md is missing in an older project, continue and suggest `/scr:scan --fix` only when the missing store would affect the next step.

5. **Read `.manuscript/config.json`** to get the work type and command_unit (chapter, act, section, surah, etc.). Also compare its `scriveno_version` against the runtime CONSTRAINTS.json `version`; when the project is older than the runtime, note it in one sentence and suggest `/scr:health --repair` to bring the project up to the current surfaces before continuing.

6. **Load `command_intents` from CONSTRAINTS.json** if present. Use it to keep alternatives small and contextual:
   - draft: discuss, plan, draft, quick-write, voice-test
   - revise: editor-review, voice-check, continuity-check, line-edit, copy-edit
   - world: build-world, new-character, new-place, geography-map, research
   - publish: complete-draft, front-matter, back-matter, cover-art, prepublish-review, publish, export
   - translate: translate, translation-glossary, back-translate, multi-publish, autopilot-translate
   - collaborate: track, editor-review, compare
   - repair: scan, health, validate, cleanup, check-notes, troubleshoot, undo
   If the field is missing in an older install, continue with the routing logic below.

7. **Load `command_families` from CONSTRAINTS.json** if present. Use hub-first families for specialist requests without expanding the primary menu:
   - structure -> `/scr:outline`
   - art -> `/scr:art-direction`
   - review -> `/scr:editor-review`
   - automation -> `/scr:do`
   - session -> `/scr:save`
   - sacred -> `/scr:sacred:source-tracking`
   - submission -> `/scr:publish`
   - publishing -> `/scr:publish`
   - world -> `/scr:build-world`
   - collaboration -> `/scr:track`
   - surface -> `/scr:surface`
   If the field is missing in an older install, keep using `command_intents` and the route logic below.

8. **Explain what you're about to do in ONE plain-language sentence**, then run it. Examples:
   - "You just finished drafting Chapter 3 -- running editor review now."
   - "Chapter 4 has a plan but no draft yet -- drafting it."
   - "You haven't discussed the next chapter -- shaping Chapter 5."

9. **Run the proactive sweep before choosing the final route.** This is read-only unless autopilot mode has already taken over:
   - Check whether `CONTEXT.md` is missing, stale, or older than STATE.md or the newest draft.
   - Check whether `HISTORY.log` is missing or the last command failed.
   - Check whether voice, continuity, editor-review, beta-reader, or translation reports contain unresolved items.
   - Check whether translation folders, target language config, editor notes, track proposals, stale exports, or unsaved manuscript changes imply a better next command than the linear lifecycle.
   - Check whether STATE.md and disk disagree enough that `/scr:scan` should be recommended first.

Display a compact proactive block when any signal changes the recommendation:

```text
Proactive checks:
  State: <fresh | stale, suggest /scr:scan>
  Session: <fresh | context stale, suggest /scr:resume-work>
  Reviews: <none | N pending, suggest review command>
  Translation: <none | follow-up available>
  Export: <fresh | stale, suggest /scr:export>
  Save: <clean | unsaved manuscript changes, suggest /scr:save>
  Progress: <X/Y units done -- see .manuscript/PROGRESS.md or /scr:progress>
```

## Routing logic

Use the core writing lifecycle as the default map:

`seed -> voice -> outline -> discuss -> plan -> draft -> review -> revise -> publish -> translate`

Walk the core chain in order and run the first incomplete step:

1. **No OUTLINE.md** -> `/scr:discuss` (high-level discussion about the whole project)
2. **No CHARACTERS.md / FIGURES.md and work type supports them** -> `/scr:new-character` loop
   - When characters exist but no people is defined and the work type supports peoples (`PEOPLES.md` applicable per `surface_applicability`), surface `/scr:new-people` as an option; when peoples already exist, offer `/scr:relationship-map --peoples` to view how they stand.
3. **No usable STYLE-GUIDE.md profile** -> `/scr:profile-writer`
   - Treat STYLE-GUIDE.md as unusable when it is missing, mostly template text, or still contains placeholders such as `{{...}}`, `[Fill in...]`, `TODO`, `TBD`, or generic prompt copy.
   - If STYLE-GUIDE.md is populated but `.manuscript/config.json` has `voice.calibrated: false`, route to `/scr:voice-test`.
4. **No {unit} discussed** -> `/scr:discuss N` (next pending unit)
5. **No {unit} planned** -> `/scr:plan N`
6. **No {unit} drafted** -> `/scr:draft N`
7. **No editor review** -> `/scr:editor-review N`
8. **Not submitted** -> `/scr:submit N`
9. **All units submitted** -> `/scr:complete-draft` or start next unit
10. **Draft complete, no revisions** -> suggest revision, beta reader, or publishing path
11. **Revisions pending** -> run the next revision step
12. **Everything done** -> suggest publishing: "Your draft is complete. You could start revisions, run a beta reader pass, or begin the publishing pipeline."

## Recommendation shape

Act like an adaptive concierge, not a catalog. The writer should see one recommended action and a small set of real alternatives.

For every route:

1. State the recommended command in one sentence.
2. State why that command is next in one sentence.
3. Offer 2-3 alternatives from the matching intent or a closely related intent.

Example:

```markdown
Chapter 4 has a plan but no draft yet, so `/scr:draft 4` is the next best move.
It uses the existing plan and current voice profile instead of opening a new planning loop.

Next commands:
- `/scr:draft 4`: Draft the planned chapter now.
- `/scr:discuss 4`: Reopen the chapter shape before drafting.
- `/scr:voice-check 3`: Check the previous chapter before moving on.
```

Use progressive surfacing rules:
- No project -> recommend `/scr:new-work`; alternatives may include `/scr:demo`, `/scr:import`, and `/scr:profile-writer`.
- No drafted work -> keep publish and translate out of the primary choices.
- Drafted work but no review -> recommend revise commands before publish commands.
- Complete draft -> surface revision, beta-reader, publish, and export paths.
- Failed command, state mismatch, or missing required context -> surface repair commands first.
- Translation config or existing translation work -> surface translation commands, but still offer review/export alternatives when relevant.
- Revision-track metadata or collaboration request -> surface `/scr:track` and keep save-history commands separate.
- Specialist request -> route to the matching `command_families` hub first, then offer the narrow leaf commands that fit the current work type.

Use this hub-first map for specialist requests:

- Structure: recommend `/scr:outline` before add, insert, remove, split, merge, or reorder commands.
- Art: recommend `/scr:art-direction` before cover, scene, character, map, storyboard, panel, or spread prompts.
- Review: recommend `/scr:editor-review` before voice, continuity, originality, sensitivity, pacing, dialogue, proof, line-edit, copy-edit, or polish checks unless the writer names the narrower check directly.
- Automation: recommend `/scr:do` for natural-language routing before fast edits, autopilot, proof, or next-step automation unless the writer names the narrower command directly.
- Session: recommend `/scr:save` before history, versions, compare, pause, resume, or session report.
- Sacred: recommend `/scr:sacred:source-tracking` before concordance, cross-reference, genealogy, chronology, annotation, verse numbering, numbering format, or doctrinal checks.
- Submission: recommend `/scr:publish` before synopsis, query letter, book proposal, discussion questions, prepublish review, or submission export.
- Publishing: recommend `/scr:publish` for sequencing, `/scr:export` for one-off output, and build commands only for final channel packages.
- World: recommend `/scr:build-world` before places, geography, characters, peoples, relationships, or research.
- Collaboration: recommend `/scr:track` before compare, merge, proposal, history, versions, or save-history paths.
- Command surface: recommend `/scr:surface status` before profile changes, and use `/scr:surface profile writing --dry-run` when the installed surface feels too large.

## Edge cases

- **Multiple valid next steps** -- Present choices: "Chapter 3 is ready to draft, but you also have editor notes on Chapter 2. Which first?"
- **Record-driven branch** -- If RECORD.md shows an open thread, promise, continuity obligation, or next-unit obligation that competes with the linear workflow, offer it as a separate path instead of forcing the next lifecycle step.
- **Stuck state** -- If a command failed recently (logged in STATE.md), offer `/scr:troubleshoot` instead of retrying blindly.
- **Blocking craft question** -- If a context or plan file contains `QUESTION: Blocking`, route to `/scr:discuss N` before drafting.
- **Non-blocking craft question or watchpoint** -- If only `QUESTION: Non-blocking`, `HUNCH`, or `WATCHPOINT` items remain, allow the next draft or review step and mention the watchpoint in one sentence.
- **Autopilot mode** -- If config has `autopilot.enabled: true`, run multiple steps in sequence without asking, pausing only per the profile's rules (guided, supervised, full-auto).
- **Whole-unit run** -- If the writer wants to take a single unit all the way through in one move (discuss, plan, draft, editor-review, line-edit, submit, save), offer `/scr:cycle N`. It is the single-unit, guided-by-default counterpart to autopilot and ends with a save.

## Agent and Automation Status

Every `/scr:next` response must include a short status block when it inspected proactive signals or handed off to another command:

```text
Automation status:
Trigger: /scr:next
Spawned agents:
- none
Candidate agents:
- <recommended agent route or none>
Local operations:
- proactive sweep: read-only
- state route computed: yes/no
Candidate local helpers:
- <recommended helper or none>
Manual gates:
- <writer-owned route or none>
Auto-invoked:
- <recommended command>: yes/no
Why: /scr:next routes from disk state; it only runs follow-up commands under autopilot or explicit writer intent
```

If autopilot causes `/scr:next` to run another command, the follow-up command must provide its own agent or automation status block.

## Adaptive naming

Use canonical runnable commands, and adapt the terminology in prompts/output for the current work type. If `command_unit` is `surah`, run `/scr:draft` and frame the work as drafting a surah; keep the command id stable and treat unit labels as presentation only.

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

Brief. Decisive. Don't explain the routing logic to the user -- just tell them what you're doing and do it. They're trusting you to know.
