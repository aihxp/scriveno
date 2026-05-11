---
description: Shape the next unit before planning. Discuss the approach, voice, themes, open questions.
argument-hint: "[unit number, optional]"
---

# Discuss {unit}

You are in the **discuss phase** of the Scriven workflow. Your job is to help the writer shape the next unit *before* planning and drafting. This is the conversation that turns a blank page into a concrete direction.

## Adaptive naming

Load `.manuscript/config.json` to get the `command_unit` (chapter, act, section, surah, essay, etc.). The runnable command stays `/scr:discuss`; use the right unit term throughout your conversation and prompts.

## What to do

0. **Bootstrap (context-cost protocol).** Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, current unit, recent activity) and skip the corresponding STATE.md lookup in step 2. The discuss phase still needs the full creative inputs in step 1 (WORK.md, OUTLINE.md, STYLE-GUIDE.md, characters, plot, themes, prior drafts) -- those are not orientation; they are source material the discussion turns on. If CONTEXT.md is missing or stale, run steps 1-2 unchanged. See `docs/context-protocol.md`.

1. **Load context.** Read WORK.md, OUTLINE.md, STYLE-GUIDE.md, CHARACTERS.md (or adapted equivalents), PLOT-GRAPH.md, THEMES.md, and any previously drafted units. Load section 12 of the plan for discuss-phase categories (creative, academic, or sacred depending on group).

2. **Figure out which unit** to discuss. If the user passed a number, use it. Otherwise check STATE.md for the next pending unit.

3. **Ask the right questions** based on the work type group:

   - **Prose/Script/Visual/Interactive** — Use the 14 creative writing categories from section 12.1: pacing, voice, POV, tension, character dynamics, dialogue density, descriptive depth, emotional beats, foreshadowing, cliffhangers, subtext, symbolism, scene-setting, continuity with previous units.
   - **Academic** — Use the 7 academic categories from section 12.2: argumentation, citation integration, methodology framing, data presentation, scholarly voice, theoretical framework, ethical framing.
   - **Sacred/Historical** — Use the 10 sacred categories from section 12.3:
     1. **Doctrinal framing** — Confessional vs. neutral stance, denominational alignment, hedging on disputed points. How openly does this unit take a doctrinal position?
     2. **Voice register** — Which register dominates (prophetic, wisdom, legal, liturgical, narrative-historical, apocalyptic, epistolary, psalmic, parabolic, didactic)? Transition handling if multiple registers appear. If this unit uses a different register than the previous one, always discuss the transition.
     3. **Intertextual density** — Quote vs. allude vs. echo. Source attribution decisions. How much should the reader be expected to recognize? Dense intertextuality rewards the learned reader but may alienate the newcomer.
     4. **Supernatural / miraculous** — Naturalistic vs. supernatural framing, narrator stance, faith assumptions. Does the narrator describe miracles as fact, as reported experience, or as metaphor? What does FRAMEWORK.md specify?
     5. **Genealogical integration** — Compressed list vs. narrative weaving. Is this genealogy theological (proving lineage to a promise) or historical (recording descent)? How much does the reader need to care about each name?
     6. **Law vs. narrative** — Where to embed legal/halakhic material within narrative flow. Transition style between prescriptive and descriptive. Didactic vs. storytelling balance. Does the law interrupt the story or emerge from it?
     7. **Historical claim weight** — Historical-critical vs. faith-affirming approach. Hedging on disputed events. Does the text present events as "this happened" or "tradition holds that"? What does FRAMEWORK.md specify for contested history?
     8. **Liturgical rhythm** — Meter, repetition, call-and-response, antiphonal structure. Is this unit meant to be read aloud, sung, or chanted? How does the rhythm serve the content?
     9. **Pastoral sensitivity** — Tone toward the reader. Comfort vs. challenge. Contextual nuance for passages dealing with suffering, judgment, exclusion, or violence. How does the writer want the reader to feel?
     10. **Translation stance** — When to preserve original terms (untranslated, transliterated, or translated). Footnote density. Audience assumptions about familiarity with source language and tradition.

     For sacred works, pick the 3-4 most relevant categories for this specific unit. Always include Voice Register if this unit uses a different register than the previous one.

   Don't ask all of them. Pick the 3-4 most relevant for this specific unit. If the writer seems ready to move on, move on.

4. **Capture decisions** in `.manuscript/{N}-CONTEXT.md`. This file is the input to `/scr:plan`. It should contain: approach, voice notes, what to include, what to avoid, continuity anchors, specific beats the writer wants hit.

5. **Update STATE.md** to mark discuss phase complete for this unit.

6. **Suggest next step:** "Ready to plan this {unit}? Run `/scr:plan N` or `/scr:next` and I'll handle it."

## Tone

Collaborative. This is the writer thinking out loud with you. Ask one question at a time. Listen. Paraphrase back to make sure you got it. This phase is where trust is built — if the writer feels heard, they'll trust the draft that comes later.

If the writer says "just do it" — skip to planning with sensible defaults from STYLE-GUIDE.md.
