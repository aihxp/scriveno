---
description: Research and plan the next unit. Produces a structured plan file the drafter agent uses.
argument-hint: "[unit number, optional]"
---

# Plan {unit}

You are in the **plan phase**. Your job is to turn the discuss-phase decisions into a concrete, actionable plan that the drafter agent can execute.

## Adaptive naming

Load `.manuscript/config.json` for `command_unit`. The runnable command stays `/scr:plan`; adapt the unit terminology in prompts and summaries.

## Prerequisites

Require `{N}-CONTEXT.md` to exist (from discuss phase). If it doesn't, offer to run `/scr:discuss N` first. If the writer says "skip discuss", use defaults from STYLE-GUIDE.md and a brief read of OUTLINE.md.

## What to do

0. **Bootstrap (context-cost protocol).** Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, current unit, recent activity, open items). The plan phase still needs the full creative inputs in step 1 (WORK.md, OUTLINE.md, RECORD.md, STYLE-GUIDE.md, characters, plot, themes, the discuss-phase context file, prior drafts) -- those are source material for the plan, not orientation. The bootstrap saves the redundant orientation reads. If CONTEXT.md is missing or stale, run step 1 unchanged. See `docs/context-protocol.md`.

1. **Load Creative Context:** WORK.md, OUTLINE.md, RECORD.md, STYLE-GUIDE.md, CHARACTERS.md (or adapted), PLOT-GRAPH.md (or adapted), THEMES.md, {N}-CONTEXT.md, and any previously drafted units for continuity. If RECORD.md is missing in an older project, continue and add a non-blocking plan note to initialize it after drafting. If files include `creative_pillar` frontmatter, use it only as a routing hint. Existing projects without metadata are valid. STYLE-GUIDE.md remains sovereign for any voice decision.

   From `{N}-CONTEXT.md`, extract `CHOICE`, `HUNCH`, `QUESTION`, and `WATCHPOINT` craft notes. Blocking questions must be resolved before drafting. Non-blocking questions can travel into the plan as watchpoints.
   From RECORD.md, extract established facts, open threads, promises, payoffs, continuity facts, movement, and next-unit obligations that apply to this unit.
   From REFERENCES.md, SYSTEM.md, PROCEDURES.md, DOCTRINES.md, QUESTIONS.md, WORLD.md, THEMES.md, CHARACTERS.md, FIGURES.md, or adapted equivalents, extract any canonical terminology, source-of-truth notes, operating rules, doctrine, world rules, subject definitions, character knowledge boundaries, or procedure constraints that apply to this unit.

2. **Research (if enabled).** If the work type is academic, research the literature. If it's sacred, check canonical sources and traditional commentaries. If it's historical, verify period details. For fiction, research anything the writer flagged in {N}-CONTEXT.md (e.g., "I need to know how 18th century sailing worked").

3. **Build the plan.** Structure depends on work type:
   - **Prose/Script** -- Scene-by-scene breakdown. Each scene: POV, location, time, characters present, emotional arc start/end, beat list, voice notes, continuity anchors to previous units.
   - **Academic** -- Argument structure. Each subsection: claim, evidence, citations to integrate, transition to next.
   - **Sacred** -- Passage structure. For each section: voice register, register transitions, key concepts, cross-references to other passages, doctrinal framing, source traditions if historical.
   - **Poetry** -- Stanza plan, meter/form, volta placement, image schedule, sound-pattern notes.

   Each plan file must include a `## Craft Notes` section. Carry forward confirmed `CHOICE` items as plan constraints, turn `HUNCH` items into draftable tests, keep non-blocking `QUESTION` items visible, and list `WATCHPOINT` items the drafter and editor should preserve or check.

   When named characters drive the unit, each plan file should also include `## Character Persona Notes`. Pull from CHARACTERS.md and `{N}-CONTEXT.md`:
   - active characters and current state
   - pressure behavior to dramatize
   - relationship-specific interaction notes for the pairings in the scene
   - dialogue constraints and speech shifts by relationship
   - persona or relationship watchpoints for editor-review

   When the unit carries an idea, subject, theme, object, setting, process, doctrine, argument, reader problem, or image pattern, each plan file should include `## Subject Dynamics Notes`. This can stand alone for non-character work or sit beside `## Character Persona Notes` in character-based scenes. Pull from BRIEF.md, WORK.md, THEMES.md or adapted equivalents, OUTLINE.md, PLOT-GRAPH.md or adapted equivalents, and `{N}-CONTEXT.md`:
   - active subject, idea, claim, procedure, place, object, doctrine, image pattern, or reader problem
   - reader state at the start and desired shift by the end
   - pressure or friction to make clear
   - interaction to preserve, such as claim vs. counterclaim, rule vs. exception, step vs. failure mode, doctrine vs. practice, evidence vs. objection, or image vs. meaning
   - evidence, example, sequence, rhythm, structure, safety, or theme watchpoints for editor-review

   Use this detection test before omitting subject dynamics: if the unit changes what the reader understands, feels, fears, believes, can do, can verify, or notices, add `## Subject Dynamics Notes`. A character scene can still need subject dynamics when a theme, object, place, doctrine, argument, or reader understanding shifts.

   If both note sections appear, keep their jobs distinct: character notes govern behavior, speech, relationship posture, and state; subject dynamics govern meaning, theme movement, reader-state movement, object significance, setting pressure, evidence, procedure, doctrine, or argument. If the two sections conflict, revise the plan or mark a blocking question before drafting.

   Each plan file should include `## Record Notes` when this unit touches established content. Use it to list:
   - established RECORD.md items this unit must honor
   - open threads or reader promises this unit handles
   - expected new record entries after drafting
   - facts, claims, objects, procedures, images, or relationship states that must remain stable

   Each plan file should include `## Domain Model Notes` when domain grilling resolved a term, source-of-truth question, procedure boundary, doctrine boundary, world rule, character knowledge rule, or subject definition. Use it to list:
   - canonical terms the drafter must use
   - terms to avoid or distinguish
   - source files or external sources the plan is relying on
   - boundary scenarios that clarify what the term or rule does and does not cover
   - any durable updates needed for RECORD.md, REFERENCES.md, or an adapted source file

   Before writing the plan, compare all domain-sensitive language against the loaded source files. If the plan uses a term differently than the project does, revise it or mark a `QUESTION: Blocking` item before drafting. Do not leave a contradiction for the drafter to guess through.

4. **Save as `.manuscript/plans/{N}-{A}-PLAN.md`** where {A} is the atomic unit (scene, subsection, passage, stanza). One plan file per atomic unit. The drafter will read each one in a fresh context to stay focused.

   For older projects, if root-level `.manuscript/{N}-{A}-PLAN.md` files already exist, read them as legacy input, but write new and revised plans to `.manuscript/plans/`.

5. **Run the plan check.** For each `{N}-{A}-PLAN.md` you just wrote, invoke the installed `plan-checker.md` agent for the writer's active Scriveno runtime (for example the runtime's global or project-scoped `agents/plan-checker.md`) in a fresh context. Pass the plan file plus WORK.md, OUTLINE.md, RECORD.md, the relevant arc file (PLOT-GRAPH.md or THEOLOGICAL-ARC.md), CHARACTERS.md (or FIGURES.md), STYLE-GUIDE.md, `{N}-CONTEXT.md`, REFERENCES.md, SYSTEM.md, PROCEDURES.md, DOCTRINES.md, QUESTIONS.md, WORLD.md, THEMES.md, or adapted equivalents when present, and any previously drafted units. The agent returns a PLAN CHECK report with status READY or NEEDS REVISION plus specific completeness, alignment, record, domain model, character, voice, pacing, and craft-note findings. Surface its recommendations to the writer before suggesting the draft step. If the agent flags NEEDS REVISION on any plan, hold the draft suggestion and offer to fix the flagged items first.

6. **Write a short summary** for the writer: "Planned {unit} {N}: X {atomic_units}, main arc goes from Y to Z, voice notes applied from STYLE-GUIDE.md. Plan check: {READY | N items flagged}."

7. **Update STATE.md** and suggest: "Ready to draft? Run `/scr:draft N`." (Suppress the draft suggestion if any plan came back NEEDS REVISION; suggest addressing the flagged items first.)

8. **Append one line to `.manuscript/HISTORY.log`** per `docs/history-protocol.md`:
   ```
   {ISO timestamp} | scr:plan | unit={N} | atomic-units={count} | check={READY|N-flagged} | outcome=ok
   ```
   If the run failed, use `outcome=failed:<short-reason>` instead. Create HISTORY.log if it does not exist.

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

Focused. This is craft work. Don't pad with commentary -- the writer wants to see a concrete plan fast.
