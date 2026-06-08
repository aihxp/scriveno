# Research Protocol

This protocol governs Scriveno research across all work types. Research is a project-wide advisory surface, not a world sublayer and not project canon by itself.

## Existing Research Authority

The `agents/researcher.md` contract is the behavioral authority for research work. It already supports planning, drafting, quick-write technique passes, and direct writer requests.

`/scr:research` is the persistence wrapper for that capability. It saves durable research briefs to `.manuscript/RESEARCH.md` when the writer wants source-backed notes kept with the project.

## Scope

Research can cover any topic that needs factual, craft, or source grounding:

- genre and craft conventions
- historical periods, events, figures, objects, and daily life
- technical accuracy, including science, medicine, law, military, naval, aviation, systems, and procedures
- cultural context, customs, language patterns, social structures, and religious practice
- sacred and theological sources, doctrines, variants, and scholarly disputes
- academic literature, research questions, methods, claims, evidence, and citations
- comparable works and market or tradition expectations
- public data, institutions, geography, transit, weather, and modern factual context

Places and geography may use research, but they do not own research.

## RESEARCH.md Role

`RESEARCH.md` is advisory. It records sourced notes, confidence, caveats, author deviations, and follow-up questions. A note becomes project canon only when the writer accepts it into an owner surface such as `RECORD.md`, `PLACES.md`, the adapted cast surface, `REFERENCES.md`, `DOCTRINES.md`, `QUESTIONS.md`, `PROCEDURES.md`, or another project file.

Do not create `RESEARCH.md` during `/scr:new-work`. Create it only through `/scr:research`.

## Research Lifecycle

1. Detect a research need from `/scr:plan`, `/scr:discuss`, `/scr:scan`, `/scr:quick-write --research`, a draft requirement, or a direct `/scr:research` request.
2. Use the researcher agent contract to gather and qualify the answer.
3. If the result should persist, write or update one topic section in `RESEARCH.md`.
4. Keep the note advisory until the writer accepts selected facts into the appropriate owner surface.
5. Record the action in `HISTORY.log`.

## Canon Handoff

| Research topic | Canon owner when accepted | Typical command |
|----------------|---------------------------|-----------------|
| Real or altered place | `PLACES.md` and then derived `GEOGRAPHY.md` | `/scr:place-touch <name>` |
| Reader-visible established fact or promise | `RECORD.md` | `/scr:save` or targeted edit |
| Character, figure, public person, or persona fact | adapted cast surface | `/scr:character-touch <name>` |
| Subject, object, claim, procedure, doctrine, source, reference, or theme | adapted subject or plot surface | `/scr:subject-touch <subject>` |
| Sacred source apparatus | sacred source files and source-tracking notes | `/scr:sacred:source-tracking` |
| Academic claim, question, method, or citation | `QUESTIONS.md`, `ARGUMENT-MAP.md`, `CONCEPTS.md`, or `PROPOSAL.md` | `/scr:subject-touch <subject>` |

## Rules

- Do not update drafts, `WORLD.md`, `PLACES.md`, `RECORD.md`, adapted cast files, or adapted subject files directly from research.
- Do not invent sources, citations, dates, or consensus.
- If browsing or source verification is unavailable, write a pending question instead of filling unsupported facts.
- Separate sourced fact from interpretation, author deviation, and fictionalization.
- Surface disputes and confidence levels clearly.
- Prefer primary sources, peer-reviewed scholarship, official sources, recognized editions, or reputable reference works based on the topic.
