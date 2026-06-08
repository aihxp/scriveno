# Versatility Paths

Scriveno should be easy to understand before it is impressive. The flagship path is still simple: finish a long manuscript in the writer's own voice. The versatility story comes after that, as evidence that the same engine adapts to different writing worlds without turning every project into a novel-shaped workflow.

Use this page when you want to show range without flattening the product into a command catalog.

## Messaging Model

1. Lead with the flagship path: voice-preserving longform writing.
2. Show the engine: fresh context, STYLE-GUIDE first, adapted project files, route-aware next steps.
3. Then show the range: technical, sacred, visual, translation, and publishing paths use the same engine with different vocabulary and surfaces.

The public promise should not be "Scriveno has 122 commands." The promise should be "Scriveno keeps the right writing system around the work you are actually making."

## Flagship Path: Longform Voice

Best for a first demo, landing-page copy, quick walkthroughs, and trust building.

What it shows:

- Voice DNA affects prose, not only metadata.
- The writer can stay inside `/scr:next`.
- Plans, drafts, review notes, and progress state stay connected.
- Fresh context per unit keeps the manuscript from becoming one swollen chat.

Starter route:

```text
/scr:first-run
/scr:demo
/scr:next
/scr:draft 5
/scr:editor-review 5
```

Primary evidence:

- [Quick Proof](quick-proof.md)
- [Proof Artifacts](proof-artifacts.md)
- [data/proof/watchmaker-flow/README.md](../data/proof/watchmaker-flow/README.md)
- [data/proof/voice-dna/README.md](../data/proof/voice-dna/README.md)

## Technical Path: Reader-State Movement

Best for showing that Scriveno is not only a fiction tool.

What it shows:

- Work type vocabulary changes from chapters and scenes to procedures, systems, audience, prerequisites, validation, and rollback.
- The drafter moves the reader from confusion to usable action.
- Factual and procedural integrity are first-class constraints.

Starter route:

```text
/scr:new-work --type runbook
/scr:profile-writer
/scr:discuss
/scr:plan
/scr:draft
/scr:editor-review
```

Surfaces to inspect:

- [data/proof/technical-flow/README.md](../data/proof/technical-flow/README.md)
- `templates/technical/DOC-BRIEF.md`
- `templates/technical/AUDIENCE.md`
- `templates/technical/SYSTEM.md`
- `templates/technical/PROCEDURES.md`
- `templates/technical/REFERENCES.md`
- `templates/pitfalls/runbook.md`

## Sacred Commentary Path: Tradition-Native Context

Best for showing that adaptation is structural, not cosmetic.

What it shows:

- Sacred work types get figures, cosmology, doctrine, theological arc, source tracking, chronology, concordance, and doctrinal review.
- The command surface keeps tradition-native vocabulary while preserving the same plan, draft, review loop.
- Register discipline and source handling matter as much as prose fluency.

Starter route:

```text
/scr:new-work --type commentary
/scr:sacred:source-tracking
/scr:sacred:concordance
/scr:sacred:cross-reference
/scr:plan
/scr:draft
/scr:sacred:doctrinal-check
```

Surfaces to inspect:

- [data/proof/sacred-flow/README.md](../data/proof/sacred-flow/README.md)
- [docs/sacred-texts.md](sacred-texts.md)
- `templates/sacred/FRAMEWORK.md`
- `templates/sacred/FIGURES.md`
- `templates/sacred/COSMOLOGY.md`
- `templates/sacred/DOCTRINES.md`
- `templates/pitfalls/commentary.md`

## Visual Or Script Path: Format-Native Creation

Best for showing that Scriveno can treat visual and dramatic work as first-class writing, not prose with labels.

What it shows:

- Scripts, comics, children's books, and picture books use different unit shapes and visual prompts.
- The art hub keeps cover, scene, character, map, storyboard, panel, and spread work discoverable without making the main writing path noisier.

Starter route:

```text
/scr:new-work --type screenplay
/scr:discuss
/scr:plan
/scr:draft
/scr:dialogue-audit
/scr:art-direction
```

Alternative visual route:

```text
/scr:new-work --type comic
/scr:panel-layout
/scr:storyboard
/scr:character-ref
/scr:editor-review
```

Surfaces to inspect:

- [data/proof/visual-flow/README.md](../data/proof/visual-flow/README.md)
- [docs/work-types.md](work-types.md)
- `templates/pitfalls/screenplay.md`
- `templates/pitfalls/comic.md`
- `commands/scr/art-direction.md`
- `commands/scr/panel-layout.md`
- `commands/scr/storyboard.md`

## Translation And Publishing Path: Lifecycle Depth

Best for showing that Scriveno can continue after the draft exists.

What it shows:

- Translation uses glossary, memory, cultural adaptation, and back-translation instead of a one-shot rewrite.
- Publishing separates editorial review, front matter, back matter, export, and platform-specific builds.
- Package builders are destination-specific while `/scr:publish` stays the sequencing hub.

Translation route:

```text
/scr:translation-glossary
/scr:translation-memory
/scr:translate
/scr:cultural-adaptation
/scr:back-translate
/scr:multi-publish
```

Publishing route:

```text
/scr:front-matter
/scr:back-matter
/scr:blurb
/scr:prepublish-review
/scr:publish
/scr:build-ebook
```

Surfaces to inspect:

- [data/proof/translation-publishing-flow/README.md](../data/proof/translation-publishing-flow/README.md)
- [docs/translation.md](translation.md)
- [docs/publishing.md](publishing.md)
- `commands/scr/prepublish-review.md`
- `commands/scr/build-ebook.md`
- `commands/scr/build-print.md`

## What Not To Do

- Do not lead with every work type at once.
- Do not make every path look equal in first-run messaging.
- Do not hide the range. Curate it.
- Do not call a path proven unless there is an inspectable artifact or executable command path behind it.

## Committed Showcase Proof

The flagship path already has committed proof artifacts. Scriveno now also ships one small committed artifact bundle for each showcase path:

- `data/proof/technical-flow/`
- `data/proof/sacred-flow/`
- `data/proof/visual-flow/`
- `data/proof/translation-publishing-flow/`

Each bundle includes a short README, one project state snapshot, one representative plan, one representative draft or output artifact, and the next command that continues the path.

## Next Proof Upgrade

The next trust upgrade is not another claim. It is host-runtime capture: run the proof path inside actual Claude Code, Codex, Cursor, Gemini CLI, and other hosts, then commit transcripts under `data/proof/runtime-parity/<runtime>/` using [the host capture protocol](../data/proof/runtime-parity/HOST-CAPTURE-PROTOCOL.md).
