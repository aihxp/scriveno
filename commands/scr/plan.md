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

1. **Load full context:** WORK.md, OUTLINE.md, STYLE-GUIDE.md, CHARACTERS.md (or adapted), PLOT-GRAPH.md (or adapted), THEMES.md, {N}-CONTEXT.md, and any previously drafted units for continuity.

2. **Research (if enabled).** If the work type is academic, research the literature. If it's sacred, check canonical sources and traditional commentaries. If it's historical, verify period details. For fiction, research anything the writer flagged in {N}-CONTEXT.md (e.g., "I need to know how 18th century sailing worked").

3. **Build the plan.** Structure depends on work type:
   - **Prose/Script** -- Scene-by-scene breakdown. Each scene: POV, location, time, characters present, emotional arc start/end, beat list, voice notes, continuity anchors to previous units.
   - **Academic** -- Argument structure. Each subsection: claim, evidence, citations to integrate, transition to next.
   - **Sacred** -- Passage structure. For each section: voice register, register transitions, key concepts, cross-references to other passages, doctrinal framing, source traditions if historical.
   - **Poetry** -- Stanza plan, meter/form, volta placement, image schedule, sound-pattern notes.

4. **Save as `.manuscript/plans/{N}-{A}-PLAN.md`** where {A} is the atomic unit (scene, subsection, passage, stanza). One plan file per atomic unit. The drafter will read each one in a fresh context to stay focused.

   For older projects, if root-level `.manuscript/{N}-{A}-PLAN.md` files already exist, read them as legacy input, but write new and revised plans to `.manuscript/plans/`.

5. **Write a short summary** for the writer: "Planned {unit} {N}: X {atomic_units}, main arc goes from Y to Z, voice notes applied from STYLE-GUIDE.md."

6. **Update STATE.md** and suggest: "Ready to draft? Run `/scr:draft N`."

## Tone

Focused. This is craft work. Don't pad with commentary -- the writer wants to see a concrete plan fast.
