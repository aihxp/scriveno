# Creative Context

Creative Context is Scriveno's writer-native context routing protocol. It gives commands a light way to know which project files matter for a task without turning a manuscript into a process artifact.

The protocol is a pilot for the core writing loop:

`discuss -> plan -> draft -> editor-review -> next`

It is additive. Existing projects without metadata continue to work because every command still recognizes the historical `.manuscript/*.md` files.

## Purpose

Creative Context solves three problems:

- **Memory:** choices made in conversation should travel into plans, drafts, and reviews.
- **Trust:** commands should load the right creative truth instead of re-reading everything or guessing.
- **Continuity:** open questions and watchpoints should remain visible without blocking creative momentum.

## Principles

1. `STYLE-GUIDE.md` is sovereign. It always loads first for drafting, voice checks, translation, and any task that can affect prose voice.
2. Metadata routes context. It does not replace the existing files.
3. Creative uncertainty is allowed. A `QUESTION` can block, but it can also travel forward as a `WATCHPOINT`.
4. Writer-facing language stays writer-native. Commands should say voice, continuity, readiness, question, and watchpoint, not compliance or tier.
5. Drafted prose never receives craft labels. Labels belong in context, plans, and reviews.

## Domain Grilling

Domain grilling is the Creative Context habit of making language precise before it becomes a plan, draft, review, or published document. It applies most strongly to technical, academic, sacred, series, and worldbuilding-heavy projects, but it can help any work where terms carry continuity.

Use it when a writer introduces a fuzzy term, a loaded term, a term that conflicts with established project language, or a claim about how the work's world, system, doctrine, argument, procedure, or cast already behaves.

The rules:

1. Check the project first. If WORK.md, RECORD.md, STYLE-GUIDE.md, RESEARCH.md, the adapted world, system, procedure, reference, doctrine, question, cast, or prior drafts can answer the question, read them instead of asking the writer.
2. Challenge conflicts immediately. If the writer says "account" but REFERENCES.md defines "workspace" as the thing being discussed, name the mismatch and ask which term should win.
3. Sharpen fuzzy language. Propose a precise canonical term when a phrase can mean more than one thing.
4. Test concrete scenarios. Use one specific edge case to expose unclear boundaries, especially for procedures, doctrines, magic systems, character knowledge, source handling, and reader promises.
5. Ask one question at a time and include a recommended answer. Do not make the writer sort through a survey unless the work is still in broad discovery.
6. Capture the resolution where it belongs:
   - Unit-specific choices go in `.manuscript/{N}-CONTEXT.md` as `CHOICE`, `QUESTION`, or `WATCHPOINT`.
   - Durable established facts, definitions, promises, and procedure truths go in RECORD.md.
   - Technical canonical terminology and sources of truth go in REFERENCES.md.
   - World, doctrine, audience, system, procedure, character, place, or theme decisions go in their matching adapted source file.
   - Real-world, source-backed, or craft research notes go in RESEARCH.md first, then move into canon only if the writer accepts them through a touch command or source file edit.

Do not turn `.manuscript/CONTEXT.md` into a glossary. It is an auto-regenerated bootstrap, not a decision notebook.

## Pillar Map

| Creative pillar | Existing source files | Role |
|---|---|---|
| `voice` | `STYLE-GUIDE.md` | Authorial voice, register, sentence music, hard do and do-not rules |
| `work` | `WORK.md`, `BRIEF.md` | Project identity, premise, audience, reader promise |
| `structure` | `OUTLINE.md`, `PLOT-GRAPH.md` | Unit order, arc shape, pacing, setup and payoff |
| `record` | `RECORD.md` | Established content, open threads, promises, payoffs, continuity facts, movement, and next-unit obligations |
| `cast` | `CHARACTERS.md`, `FIGURES.md` | Character state, voice anchors, relationships, figure continuity |
| `world` | `WORLD.md`, `COSMOLOGY.md`, `SYSTEM.md`, `PLACES.md`, `GEOGRAPHY.md` | Environment, cosmology, operating rules, confirmed places, and derived spatial continuity |
| `research` | `RESEARCH.md` | Advisory source-backed, factual, craft, period, technical, cultural, sacred, scholarly, and comparable-work context |
| `themes` | `THEMES.md`, `DOCTRINES.md`, `QUESTIONS.md` | Motifs, doctrine, argument, inquiry, recurring meaning |
| `continuity` | `STATE.md`, `CONTEXT.md`, `PROGRESS.md`, `HISTORY.log` | Current position, recent activity, per-unit progress ledger, open items, disk truth |
| `publication` | front matter, back matter, build files | Export and publishing intent |
| `translation` | glossary, translation memory, language config | Term consistency and cultural adaptation |
| `art` | cover, illustration, storyboard assets | Visual continuity and image direction |

The v2.1 pilot only changes the core writing loop. Publication, translation, art, and sacred expansion can adopt the same protocol later.

## Template Metadata

Templates may include optional frontmatter:

```yaml
---
creative_pillar: voice
always_load_for: [draft, voice-check, plan, editor-review, translate]
authority: sovereign
---
```

Commands should treat this metadata as routing help. If the metadata is absent, fall back to the file's established role.

## Craft Notes

Discuss, plan, and review artifacts can carry four labels:

| Label | Meaning | Blocks drafting? |
|---|---|---|
| `CHOICE` | Confirmed creative decision | No |
| `HUNCH` | Creative bet to test in drafting | No |
| `QUESTION` | Unresolved issue for writer or editor | Only when marked blocking |
| `WATCHPOINT` | Thing to preserve, test, or re-check later | No |

Use labels in context files, plan files, and review reports. Do not insert them into manuscript prose.

Recommended section:

```markdown
## Craft Notes

- CHOICE: Keep the chapter close third from Mara's point of view.
- HUNCH: Let the room feel colder after the argument without explaining why.
- QUESTION: Blocking: does Elias know about the forged letter yet?
- WATCHPOINT: Preserve Mara's clipped dialogue when she is afraid.
```

## Command Behavior

### discuss

Capture the writer's confirmed choices, creative hunches, open questions, and watchpoints in `.manuscript/{N}-CONTEXT.md`.

When the conversation touches established content, also capture `## Record Notes`: what RECORD.md says this unit must honor, what thread or promise the unit may handle, and what the draft or review should add to RECORD.md after the unit lands.

Before capturing, run domain grilling on any fuzzy term, overloaded term, or claim that may contradict the project's established language. Resolve only what matters for the current unit. If a canonical term or source-of-truth decision becomes durable, route it to RECORD.md, REFERENCES.md, or the adapted source file instead of leaving it only in the unit context.

### plan

Load craft notes from `{N}-CONTEXT.md`. Convert confirmed choices into plan constraints, hunches into draftable tests, questions into blocking or non-blocking items, and watchpoints into plan checks.

Load RECORD.md as the compact established-content store. Plans should include `## Record Notes` when the unit touches established facts, open threads, reader promises, payoffs, continuity facts, or next-unit obligations.

Run a domain model check before drafting: compare the plan's terms and assumptions against RECORD.md, REFERENCES.md, PLACES.md, GEOGRAPHY.md, RESEARCH.md when relevant, and the relevant adapted source files. If the plan uses a term, place, route, or factual claim differently than the project does, either revise the plan language or mark a blocking question.

### draft

Pass craft notes through the plan file to the drafter. The drafter follows `CHOICE`, dramatizes `HUNCH` where useful, respects `WATCHPOINT`, and makes the safest call on non-blocking `QUESTION` items. Blocking questions must be resolved before drafting.

Pass Record Notes and RECORD.md to the drafter when present. After drafting, update RECORD.md with compact reader-visible changes: established facts, open threads, promises, payoffs, continuity facts, movement, and next-unit obligations. Do not turn every beat into a record entry.

Character persona notes are part of the same loop. Plans can include `## Character Persona Notes` for pressure behavior, relationship-specific interactions, dialogue constraints, and pairwise trust or conflict patterns. The drafter turns those notes into behavior on the page, never exposition.

Subject dynamics can layer onto any work type. Plans can include `## Subject Dynamics Notes` for the active idea, subject, process, place, object, doctrine, claim, evidence set, procedure, reader problem, or thematic pressure. These notes track the reader's starting state, the desired shift, the pressure or friction around the subject, and the interaction between ideas, evidence, steps, exceptions, images, objects, settings, or themes. The drafter turns those notes into movement on the page, never into visible craft labels.

Confirmed places are a world sublayer, not a general notes inbox. Plans and drafts may load PLACES.md and the derived GEOGRAPHY.md when a unit depends on location, travel, access, boundaries, route logic, or setting pressure.

RESEARCH.md is a neutral advisory surface, not a world file. Plans and drafts may load it for factual, craft, source, or period grounding, but it is advisory until accepted into RECORD.md, PLACES.md, the adapted cast surface, the adapted subject surface, the adapted world surface, or another owner file.

For character-based work, use both sections when both layers matter. `## Character Persona Notes` answers how people behave under pressure. `## Subject Dynamics Notes` answers how meaning, theme, object significance, setting pressure, doctrine, argument, or reader understanding moves through the unit. If the two sections conflict, the plan should resolve the conflict before drafting rather than asking the drafter to guess.

When a draft changes subject movement after the plan has already landed, `/scr:subject-touch` updates the relevant living subject file, such as THEMES.md, QUESTIONS.md, REFERENCES.md, DOCTRINES.md, PROCEDURES.md, ARGUMENT-MAP.md, or an adapted context file. When a draft changes a confirmed place, `/scr:place-touch` updates PLACES.md and then the derived GEOGRAPHY.md can be regenerated.

Edge cases:

- If a unit has characters but they are not driving the scene, subject dynamics may be the primary section and character notes may be omitted.
- If a unit has no named characters but does have a speaker, narrator, implied reader, or instruction-following user, use subject dynamics and voice notes rather than inventing character persona.
- If an object, place, symbol, procedure, claim, or doctrine changes meaning because of a character interaction, include both sections and state the handoff clearly.
- If subject dynamics repeat a character note without adding reader movement, omit the duplicate.
- If subject dynamics would expose hidden craft scaffolding in drafted prose, keep it in the plan and review only.

### editor-review

Review whether choices held, hunches worked, questions were resolved, and watchpoints were preserved. Store results in `.manuscript/reviews/{N}-REVIEW.md`.

Review whether the draft honored RECORD.md and list any confirmed record updates. If the draft contradicts RECORD.md, resolve the contradiction before marking the unit reviewed.

### next

When state is ambiguous, prefer the next core-loop step. If a blocking question exists, route to `/scr:discuss N`. If only non-blocking questions or watchpoints exist, allow drafting or review to proceed while naming the watchpoint.

When RECORD.md shows a real branch, such as an open promise competing with the linear next unit, surface the branch instead of forcing a single path.

## Backward Compatibility

No command may require `creative_pillar` metadata for existing projects. The metadata is a hint for new templates and a future optimization surface, not a new file-format gate.
