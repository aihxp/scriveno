---
description: Draft the planned unit. Invokes the drafter agent in fresh context per atomic unit.
argument-hint: "[unit number, optional]"
---

# Draft {unit}

You are orchestrating the drafter agent to produce the actual prose (or script, or verse, or passage) for a planned unit.

## Adaptive naming

Load `.manuscript/config.json` for `command_unit`. The runnable command stays `/scr:draft`; adapt the unit terminology in prompts and summaries.

## Prerequisites

Require `.manuscript/plans/{N}-*-PLAN.md` files to exist. If none exist, also check legacy root-level `.manuscript/{N}-*-PLAN.md` files before offering `/scr:plan N`. If the writer omitted the unit number, infer the earliest planned unit without a draft from `.manuscript/PROGRESS.md` or from the plan and draft filenames, then state the inferred unit before drafting. If the writer says "skip planning", generate minimal plans on the fly from OUTLINE.md + STYLE-GUIDE.md and save them in `.manuscript/plans/`.

## What to do

1. **Resolve the unit and find all plan files.** If `{unit}` was provided, use it. If it was omitted, select the lowest-numbered planned unit that has no matching draft and continue as if the writer had typed `/scr:draft N`. Prefer `.manuscript/plans/{N}-*-PLAN.md` -- one per atomic unit (scene, subsection, passage). If no files exist there, fall back to legacy `.manuscript/{N}-*-PLAN.md`.

   Before invoking the drafter, scan each plan for `QUESTION: Blocking`. If any blocking question remains, pause and route back to `/scr:discuss N`. Non-blocking questions and watchpoints may proceed into drafting.

2. **For each atomic unit, invoke the installed `drafter.md` agent for the current runtime in a fresh context.** Use the agent path for the writer's active Scriveno install (for example the runtime's global or project-scoped `agents/drafter.md`). Fresh context per atomic unit is critical -- it prevents voice drift, context bloat, and lets each scene be its best. The drafter receives:
   - Variable context surfaces resolved through `docs/surface-resolution-protocol.md`
   - STYLE-GUIDE.md (always, every time -- this is the voice DNA)
   - The specific `.manuscript/plans/{N}-{A}-PLAN.md` for this atomic unit, or the matching legacy root-level plan if that is all the project has
   - The plan's `## Craft Notes` section, including any `CHOICE`, `HUNCH`, `QUESTION`, and `WATCHPOINT` items
   - The plan's `## Record Notes` section, when present
   - RECORD.md, when present, so the drafter can honor established facts, open threads, promises, payoffs, continuity facts, and next-unit obligations
   - The plan's `## Character Persona Notes` section, when present
   - The plan's `## Subject Dynamics Notes` section, when present
   - The plan's `## Causal Anchor` section, when present, so the drafter knows why this unit happens (the Forster "because", not merely "and then") and writes the unit to honor its stated cause
   - The adapted cast surface for canonical `CHARACTERS.md` (full file by default; only filtered to relevant entries when `draft.context_profile` is `minimal`). Loading the full file is the default because a cast entry introduced via `/scr:new-character` after some plans were already written will not appear in those plans, and a relevance filter would silently exclude it from the drafter's view -- breaking continuity through the manuscript.
   - The peoples in `PEOPLES.md` that the unit's characters belong to, when present, so the drafter writes each character's collective voice, bias, and worldview, not only their individual traits
   - `PLACES.md` and `GEOGRAPHY.md` when present and relevant to the plan's location, setting pressure, travel, route, or spatial continuity
   - `RESEARCH.md` when present and relevant, as advisory fact-safety context only. Research notes do not become project canon unless accepted into `RECORD.md`, `PLACES.md`, the adapted world surface, the adapted cast surface, the adapted subject surface, or another project file.
   - The last 200 words of the previous atomic unit (for voice/tone continuity)
   - The adapted themes surface for canonical `THEMES.md` (relevant threads only)

3. **Save drafted output** to `.manuscript/drafts/body/{N}-{A}-DRAFT.md`.

4. **After all atomic units in the unit are drafted, run a voice-check pass.** Invoke the installed `voice-checker.md` agent in a fresh context on the drafted unit -- the same agent `/scr:voice-check` uses. It loads the unit and STYLE-GUIDE.md and returns an Overall score (0-100). Convert to normalized drift (`drift = (100 - score) / 100`; see the "Normalized drift" section of `voice-checker.md`) and, if drift exceeds `config.voice.drift_threshold` (default 0.3, i.e. a voice score below 70), flag the scenes that drove the score down and offer to re-draft them. If the host runtime cannot spawn the voice-checker, fall back to the drafter's built-in self-check (Step 4 in `drafter.md`) and say so in the status block.

5. **Update RECORD.md.** After drafting, extract what the new draft establishes on page. Update `.manuscript/RECORD.md` with only durable, reader-visible changes:
   - established facts, claims, events, definitions, procedures, objects, relationships, or constraints
   - open threads created, deepened, resolved, or paid off
   - promises and payoffs
   - continuity facts future units must honor
   - character, figure, subject, argument, reader, doctrine, procedure, image, object, setting, or relationship movement
   - place, route, access, boundary, travel, or spatial movement that the draft makes reader-visible
   - next-unit obligations that follow from the new draft

   Do not turn every beat into a record entry. Keep RECORD.md compact enough to load. If a change belongs in the adapted cast, themes, world, places, questions, procedures, doctrines, or another adapted source file, record the summary in RECORD.md and suggest the more specific touch command when useful.

6. **Surface state nudges.** If the drafter emits `CHARACTER STATE NUDGE`, suggest `/scr:character-touch <name>` after drafting. If the drafter emits `SUBJECT DYNAMICS NUDGE`, suggest `/scr:subject-touch <subject>` after drafting. If the drafter emits `PLACE STATE NUDGE`, suggest `/scr:place-touch <name>` after drafting. These nudges go to the writer, not into the draft file.

7. **Update STATE.md:** mark unit as drafted, note word count, flag any voice-check issues. Then refresh `.manuscript/PROGRESS.md` so the ledger advances (this unit moves to in progress or done) per `docs/progress-protocol.md`.

8. **Tell the writer:** "Drafted {unit} {N} ({N} of {total}, {pct}% of the manuscript): X words across Y {atomic_units}. Voice consistency: Z% (the voice-checker Overall score for this unit; omit this figure if the voice-check could not run). Updated RECORD.md with what the draft established. Ready for editor review? Run `/scr:editor-review N` or `/scr:next`." The full per-unit ledger is in `.manuscript/PROGRESS.md`.

## Agent and Automation Status

Every response must include a short status block that makes invocation visible:

```text
Agent status:
Trigger: /scr:draft N
Spawned agents:
- drafter: {count} fresh-context invocation(s)
- voice-checker: 1 diagnostic pass, or none if no draft was produced
Local operations:
- draft files written: {count}
- RECORD.md updated: yes/no
- STATE.md updated: yes/no
- PROGRESS.md refreshed: yes/no
Auto-invoked:
- /scr:editor-review N: yes/no
- /scr:save: yes/no (autosave after: stage)
Why: {autopilot.enabled true, full-auto profile, supervised pause, or writer-facing manual mode}
```

If the host runtime cannot spawn a native `drafter` or `voice-checker` agent type, load the installed agent prompt from the active runtime's `agents/` directory and run it in an isolated fresh context. In the status block, write `Spawned agents: native unavailable; prompt-run fallback used` so the writer can see what happened.

## History log

After all atomic units in this invocation are drafted, append one line to `.manuscript/HISTORY.log` per `docs/history-protocol.md`:

```
{ISO timestamp} | scr:draft | unit={N} | files={comma-separated draft filenames written this run} | outcome=ok
```

If the run failed (drafter agent returned an error, voice-check blocked, etc.), use `outcome=failed:<short-reason>` instead. Create HISTORY.log if it does not exist. Do not log per atomic unit -- one line per `/scr:draft` invocation keeps the log scannable.

## Autopilot behavior

If config has `autopilot.enabled: true`, proceed to `/scr:editor-review` automatically after drafting. In supervised profile, pause here for the writer to read. In full-auto, keep going.

If `config.autosave.enabled` is `true` and `config.autosave.after` is `"stage"`, run `/scr:save` after the draft is written and RECORD.md/STATE.md are updated, to bank a checkpoint. With `after: "unit"` or autosave off, do not auto-save here. `/scr:save` is the deterministic local-helper, not an agent; see `docs/auto-invoke-policy.md`.

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

Don't narrate each atomic unit being drafted. That's noise. Show progress concisely, and anchor it to the whole manuscript so the writer sees momentum: "Drafted scene 1/4... 2/4... 3/4... 4/4. Voice check: passed. Chapter 5 of 12 done (42%)." Pull the unit-of-total figure and percent from the deliverable progress defined in `docs/progress-protocol.md`.

Let the writer read the actual prose in the draft files. Your job is orchestration, not performance.
