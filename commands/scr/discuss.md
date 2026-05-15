---
description: Shape the next unit before planning. Discuss the approach, voice, themes, open questions.
argument-hint: "[unit number, optional]"
---

# Discuss {unit}

You are in the **discuss phase** of the Scriveno workflow. Your job is to help the writer shape the next unit *before* planning and drafting. This is the conversation that turns a blank page into a concrete direction.

## Adaptive naming

Load `.manuscript/config.json` to get the `command_unit` (chapter, act, section, surah, essay, etc.). The runnable command stays `/scr:discuss`; use the right unit term throughout your conversation and prompts.

## What to do

0. **Bootstrap (context-cost protocol).** Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, current unit, recent activity) and skip the corresponding STATE.md lookup in step 2. The discuss phase still needs the full creative inputs in step 1 (WORK.md, OUTLINE.md, RECORD.md, STYLE-GUIDE.md, characters, plot, themes, prior drafts) -- those are not orientation; they are source material the discussion turns on. If CONTEXT.md is missing or stale, run steps 1-2 unchanged. See `docs/context-protocol.md`.

1. **Load Creative Context.** Read WORK.md, OUTLINE.md, RECORD.md, STYLE-GUIDE.md, CHARACTERS.md (or adapted equivalents), PLOT-GRAPH.md, THEMES.md, and any previously drafted units. If RECORD.md is missing in an older project, continue and note that `/scr:scan --fix` or `/scr:save` can initialize it later. If those files include `creative_pillar` frontmatter, use it as a routing hint only; older projects without metadata are equally valid. STYLE-GUIDE.md remains sovereign for voice. Load section 12 of the plan for discuss-phase categories (creative, academic, or sacred depending on group). See `docs/creative-context.md`.

2. **Figure out which unit** to discuss. If the user passed a number, use it. Otherwise check STATE.md for the next pending unit.

3. **Ask the right questions** based on the work type group:

   - **Prose/Script/Visual/Interactive** -- Use the 14 creative writing categories from section 12.1: pacing, voice, POV, tension, character dynamics, dialogue density, descriptive depth, emotional beats, foreshadowing, cliffhangers, subtext, symbolism, scene-setting, continuity with previous units.
   - **Academic** -- Use the 7 academic categories from section 12.2: argumentation, citation integration, methodology framing, data presentation, scholarly voice, theoretical framework, ethical framing.
   - **Sacred/Historical** -- Use the 10 sacred categories from section 12.3:
     1. **Doctrinal framing** -- Confessional vs. neutral stance, denominational alignment, hedging on disputed points. How openly does this unit take a doctrinal position?
     2. **Voice register** -- Which register dominates (prophetic, wisdom, legal, liturgical, narrative-historical, apocalyptic, epistolary, psalmic, parabolic, didactic)? Transition handling if multiple registers appear. If this unit uses a different register than the previous one, always discuss the transition.
     3. **Intertextual density** -- Quote vs. allude vs. echo. Source attribution decisions. How much should the reader be expected to recognize? Dense intertextuality rewards the learned reader but may alienate the newcomer.
     4. **Supernatural / miraculous** -- Naturalistic vs. supernatural framing, narrator stance, faith assumptions. Does the narrator describe miracles as fact, as reported experience, or as metaphor? What does FRAMEWORK.md specify?
     5. **Genealogical integration** -- Compressed list vs. narrative weaving. Is this genealogy theological (proving lineage to a promise) or historical (recording descent)? How much does the reader need to care about each name?
     6. **Law vs. narrative** -- Where to embed legal/halakhic material within narrative flow. Transition style between prescriptive and descriptive. Didactic vs. storytelling balance. Does the law interrupt the story or emerge from it?
     7. **Historical claim weight** -- Historical-critical vs. faith-affirming approach. Hedging on disputed events. Does the text present events as "this happened" or "tradition holds that"? What does FRAMEWORK.md specify for contested history?
     8. **Liturgical rhythm** -- Meter, repetition, call-and-response, antiphonal structure. Is this unit meant to be read aloud, sung, or chanted? How does the rhythm serve the content?
     9. **Pastoral sensitivity** -- Tone toward the reader. Comfort vs. challenge. Contextual nuance for passages dealing with suffering, judgment, exclusion, or violence. How does the writer want the reader to feel?
     10. **Translation stance** -- When to preserve original terms (untranslated, transliterated, or translated). Footnote density. Audience assumptions about familiarity with source language and tradition.

     For sacred works, pick the 3-4 most relevant categories for this specific unit. Always include Voice Register if this unit uses a different register than the previous one.

   Don't ask all of them. Pick the 3-4 most relevant for this specific unit. If the writer seems ready to move on, move on.

   If the unit involves named characters, read their `Persona under pressure` and `Relationship-specific interactions` sections from CHARACTERS.md. Ask at most one persona or interaction question, for example: "Mara gets terse when afraid, but Elias makes her defensive. Does this scene let that mask hold, or crack?" If the writer answers, capture it as a `CHOICE` or `WATCHPOINT`.

   If the unit is driven by an idea, subject, theme, object, setting, process, doctrine, argument, reader problem, or image pattern, use subject dynamics whether or not named characters are present. Read the reader journey in BRIEF.md or DOC-BRIEF.md, the theme or doctrine threads, the argument or procedure map, and any adapted source such as QUESTIONS.md, REFERENCES.md, DOCTRINES.md, SYSTEM.md, or PROCEDURES.md.

   Use this quick detection test: does this unit change what the reader understands, feels, fears, believes, can do, can verify, or notices about a subject? If yes, capture subject dynamics. Ask at most one subject-dynamics question, for example: "This section moves the reader from confusion to usable confidence. What is the main friction: a misconception, a risk, or a missing example?" If the writer answers, capture it as a `CHOICE`, `HUNCH`, or `WATCHPOINT`.

   Use RECORD.md to ask about established content only when it matters. Good prompts connect the current unit to an existing thread, promise, continuity fact, or next-unit obligation without making the writer audit the whole project.

   **Domain grilling:** Before you accept a fuzzy term, overloaded label, or claim about how the project works, check the relevant source files first. Use RECORD.md for established facts and definitions, STYLE-GUIDE.md for voice language, CHARACTERS.md or FIGURES.md for cast terms, WORLD.md or SYSTEM.md for operating rules, PLOT-GRAPH.md or PROCEDURES.md for sequence and causality, THEMES.md, QUESTIONS.md, DOCTRINES.md, or REFERENCES.md for subject language, and prior drafts for what has already appeared on the page.

   If the files answer the question, do not ask the writer. If the writer's wording conflicts with existing language, call out the mismatch immediately and ask which term or rule wins. If the wording is vague, propose one precise canonical term and ask for confirmation. Always ask one question at a time and include your recommended answer.

   For technical work types, treat REFERENCES.md as the canonical place for source-of-truth links and terminology. If a technical term is resolved during discussion, capture the durable term in `## Record Notes` as a recommended REFERENCES.md update, and also include any unit-specific effect in `## Subject Dynamics Notes` or `## Craft Notes`.

4. **Capture craft notes** in `.manuscript/{N}-CONTEXT.md`. This file is the input to `/scr:plan`. It should contain: approach, voice notes, what to include, what to avoid, continuity anchors, specific beats the writer wants hit, and a `## Craft Notes` section using only these labels:

   - `CHOICE`: confirmed creative decision
   - `HUNCH`: creative bet to test in drafting
   - `QUESTION`: unresolved issue for writer or editor; mark as `Blocking` or `Non-blocking`
   - `WATCHPOINT`: thing to preserve, test, or re-check later

   These labels belong in the context artifact only. Do not add them to drafted prose.

   If character dynamics matter in this unit, add a `## Character Persona Notes` section with:
   - characters present
   - pressure behavior to show
   - relationship-specific interaction to preserve
   - any persona or relationship watchpoints

   If the unit is driven by an idea, subject, process, procedure, place, object, doctrine, argument, reader problem, or image pattern, add a `## Subject Dynamics Notes` section with:
   - active subject, idea, claim, procedure, place, object, doctrine, image pattern, or reader problem
   - reader state at the start and desired shift by the end
   - pressure or friction to make clear
   - interaction to preserve, such as claim vs. counterclaim, rule vs. exception, step vs. failure mode, doctrine vs. practice, or image vs. meaning
   - subject, reader, evidence, procedure, or theme watchpoints

   Character Persona Notes and Subject Dynamics Notes may both appear in the same context file. Avoid duplicating the same point in both sections. If they seem to pull in different directions, record the conflict as a `QUESTION: Blocking` instead of leaving the drafter to guess.

   Add a `## Record Notes` section when the conversation touches established content. Include:
   - established facts, claims, procedures, or events this unit must honor
   - open threads, promises, or reader expectations this unit should pay off, deepen, or leave open
   - new facts or movement this unit is likely to establish
   - any RECORD.md updates the draft or review should make after the unit lands
   - any canonical terminology, source-of-truth, or adapted source-file updates resolved by domain grilling

5. **Update STATE.md** to mark discuss phase complete for this unit.

6. **Suggest next step:** "Ready to plan this {unit}? Run `/scr:plan N` or `/scr:next` and I'll handle it."

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

Collaborative. This is the writer thinking out loud with you. Ask one question at a time. Listen. Paraphrase back to make sure you got it. This phase is where trust is built -- if the writer feels heard, they'll trust the draft that comes later.

If the writer says "just do it" -- skip to planning with sensible defaults from STYLE-GUIDE.md.
