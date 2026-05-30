# Shipped Assets

Scriveno's launch surface should point to what is actually bundled in this repo today. This document is the canonical inventory for shipped export templates, drafter-quality assets, and other trust-critical launch files.

## Drafter Quality Assets Shipped Today

These files ship in `templates/` and provide layered rule scaffolding loaded by the drafter, voice-checker, and originality-check after `STYLE-GUIDE.md`. See [docs/drafter-quality.md](drafter-quality.md) for the full system.

- `templates/WRITING-RULES.md` (universal human-first and AI-tell rulebook; loaded after `STYLE-GUIDE.md`)

Per-work-type pitfall packs in `templates/pitfalls/`:

- `pitfalls/novel.md` (prose: filter words, POV breaches, dialogue traps, genre stock phrases)
- `pitfalls/memoir.md` (prose: retrospective voice traps, sentimentality, self-presentation)
- `pitfalls/screenplay.md` (script: unfilmable description, action-line bloat, on-the-nose dialogue)
- `pitfalls/runbook.md` (technical: imperatives, missing preconditions, verification and rollback)
- `pitfalls/research_paper.md` (academic: hedge stacks, citation hygiene, methodology traps)
- `pitfalls/poetry_collection.md` (poetry: image cliches, diction traps, sentimentality, form pitfalls)
- `pitfalls/comic.md` (visual: script-versus-art boundary, panel rhythm, caption voice)
- `pitfalls/commentary.md` (sacred: register drift, anachronism, source-handling, doctrinal precision)

Conflict resolution is top-down: `STYLE-GUIDE.md` beats `WRITING-RULES.md` beats the pitfall pack. The writer's voice is sovereign; the rule layers are scaffolding for human-first restraint, variance over substitution, factual integrity, sourced stance, register awareness, artifact cleanup, and type-specific polish.

`WRITING-RULES.md` also ships the "Diagnostic discipline (honest read)" section that governs the evaluative side of the rules. The diagnostic surface is `/scr:voice-check`, `/scr:originality-check`, and the `voice-checker` agent: they report an authenticity band then a 0-100 score then flagged spans, match scrutiny to evidence density, credit strong false positives as score-raising human markers, and never rewrite. Diagnosis and rewriting (`/scr:line-edit`, `/scr:polish`, re-draft) stay separate steps with the writer between them, which is what stops a score-then-rewrite gaming loop.

A contributor adding `templates/pitfalls/<work_type>.md` is automatically picked up by `lib/architectural-profiles.js#listPitfallPacks` with no edits to library code or `CONSTRAINTS.json`.

## Context Integrity Assets Shipped Since 2.0.0

These files ship in `templates/` and `docs/` and provide the context-integrity set for session-aware AI work:

- `templates/CONTEXT.md` -- one-page session bootstrap scaffold copied into every project. Auto-regenerated on `/scr:save`, `/scr:pause-work`, `/scr:resume-work`. Read first by `/scr:next` and `/scr:resume-work` for orientation, with stale-detection + STATE.md fallback.
- `templates/PROGRESS.md` -- per-unit progress ledger scaffold: the openable file showing every unit as done / in progress / untouched, plus a deliverable progress bar and pipeline position. Derived from disk; auto-regenerated on `/scr:draft`, `/scr:editor-review`, `/scr:submit`, `/scr:autopilot`, `/scr:save`, `/scr:pause-work`, `/scr:resume-work`, and `/scr:scan --fix`. Rendered live by `/scr:progress`.
- `templates/RECORD.md` -- compact established-content store copied into every project. It tracks what the work has established, including open threads, promises, payoffs, continuity facts, movement, and next-unit obligations. It is deliberately neutral so sacred, academic, technical, poetry, script, visual, and prose projects can all use the same filename.
- `docs/context-protocol.md` -- canonical contract for the CONTEXT.md preference rule. The 12 high-impact commands that opt into the protocol reference this doc.
- `docs/progress-protocol.md` -- canonical contract for the `.manuscript/PROGRESS.md` per-unit ledger: status derivation from disk, the done / in progress / untouched buckets, pipeline position, the progress bar, and the regeneration points.
- `docs/history-protocol.md` -- canonical line-format spec for `.manuscript/HISTORY.log`, the append-only audit trail. Pipe-delimited, UTC ISO timestamps, committed to git.

`STATE.md` (workflow data) + `RECORD.md` (established content) + `CONTEXT.md` (narrative bootstrap) + `PROGRESS.md` (per-unit ledger) + `HISTORY.log` (audit trail) together form the integrity layer. `/scr:scan` is the trust check that interrogates whether the recorded state still matches disk.

## Runtime Sync Asset Shipped Today

- `commands/scr/sync.md` -- local runtime-surface synchronization command. It compares and refreshes installed Scriveno commands, Codex skills, command mirrors, and agent prompts from the current source tree by delegating to `bin/install.js`.
- `lib/auto-invoke-engine.js` -- shared project status, safe apply, runtime smoke, agent availability, and route graph audit engine used by `scriveno status`, `scriveno sync --check`, `scriveno smoke`, `scriveno agents`, and `scriveno routes`.

## Export Templates Shipped Today

These export templates are currently bundled in `data/export-templates/`:

- `scriveno-book.typst` -- default book interior and print-ready PDF template
- `scriveno-stageplay.typst` -- stage play interior template
- `scriveno-picturebook.typst` -- picture-book interior template
- `scriveno-chapbook.typst` -- chapbook and poetry-collection interior template
- `scriveno-epub.css` -- standard EPUB styling and KDP-compatible ebook CSS
- `scriveno-fixed-layout-epub.css` -- fixed-layout EPUB stylesheet
- `scriveno-fixed-layout.opf` -- fixed-layout EPUB OPF stub
- `scriveno-academic.latex` -- generic academic/thesis LaTeX template
- `scriveno-ieee.latex` -- IEEE wrapper template
- `scriveno-acm.latex` -- ACM wrapper template
- `scriveno-lncs.latex` -- LNCS wrapper template
- `scriveno-elsevier.latex` -- Elsevier wrapper template
- `scriveno-apa7.latex` -- APA7 wrapper template
- `scriveno-smashwords.docx` -- Smashwords reference DOCX
- `scriveno-smashwords-styles.md` -- Smashwords style guide companion
- `scriveno-poetry-submission.docx` -- poetry-submission reference DOCX
- `scriveno-poetry-submission-styles.md` -- poetry-submission style guide companion

## Export Template Behaviors

- Manuscript DOCX export currently relies on Pandoc's default DOCX styling unless the user supplies a custom Pandoc reference document.
- Formatted DOCX export currently relies on Pandoc's default DOCX output unless the user supplies a custom Pandoc reference document for styled review copies.
- `scriveno-manuscript.docx` is not shipped today.
- `scriveno-formatted.docx` is not shipped today.
- `scriveno-kdp-cover.typst` is not shipped today.
- `scriveno-ingram-cover.typst` is not shipped today.
- Cover deliverables are manuscript build assets, not bundled export templates:
  - Ebook front cover: `.manuscript/build/ebook-cover.jpg` (or `.png`)
  - Paperback full wrap: `.manuscript/build/paperback-cover.pdf`
  - Hardcover case wrap: `.manuscript/build/hardcover-cover.pdf`
- Those cover files are designer-provided or externally produced assets that Scriveno's build/export commands reference; exact paperback and hardcover wrap geometry still comes from the active platform cover template generator.

## Platform Profiles Shipped Today

These platform manifests are currently bundled in `templates/platforms/` and loaded by build commands:

- `kdp`
- `ingram`
- `apple`
- `bn`
- `d2d`
- `kobo`
- `google`
- `smashwords`

`/scr:build-ebook` validates the selected platform, loads `templates/platforms/{platform}/manifest.yaml`, checks `formats_accepted` for EPUB support, and carries the manifest's `label` and `epub_variant` into output metadata. `/scr:build-print` uses print and academic platform metadata for trim-size, page-count, and template routing.

## Sacred Tradition Profiles Shipped Today

These tradition manifests are currently bundled in `templates/sacred/` and accepted as top-level `tradition` values in `.manuscript/config.json`:

- `catholic`
- `orthodox`
- `tewahedo`
- `protestant`
- `jewish`
- `islamic-hafs`
- `islamic-warsh`
- `pali`
- `tibetan`
- `sanskrit`

Sacred commands read top-level sacred profile keys in new projects and preserve legacy fallback reads for older projects that still have a nested `sacred` object.

## Trust-Critical Launch Files

- `README.md` -- primary launch narrative and status claims
- `CHANGELOG.md` -- package-level release history
- `docs/release-notes.md` -- public-facing release summary
- `docs/proof-artifacts.md` -- canonical proof hub for sample-flow and voice-preservation evidence
- `docs/quick-proof.md` -- proof-first first-run route through install checks, demo inspection, and next-draft commands
- `docs/starter-sets.md` -- small command paths for common writing goals
- `docs/release-checklist.md` -- release validation path for source, npm, GitHub, and fresh installs
- `docs/runtime-support.md` -- canonical runtime matrix, Node baseline, and support-confidence framing
- `docs/command-reference.md` -- canonical command surface reference
- `docs/configuration.md` -- canonical project config and package metadata reference
- `data/proof/watchmaker-flow/README.md` -- canonical sample-flow proof bundle rooted in shipped demo files
- `data/proof/voice-dna/README.md` -- canonical Voice DNA proof bundle
- `data/proof/first-run/README.md` -- committed transcript artifact for the executable first-run path
- `data/proof/runtime-parity/README.md` -- runtime install-surface evidence and host-parity boundary
- `commands/scr/export.md` -- source of truth for export command behavior
- `docs/publishing.md` -- user-facing explanation of export formats and publishing packages
- `docs/contributing.md` -- contributor-facing guidance for extending export support
- `docs/drafter-quality.md`: canonical reference for the drafter's three rule layers and the `draft` config block
- `templates/WRITING-RULES.md`: canonical universal AI-tell rulebook loaded by drafter, voice-checker, and originality-check
- `templates/pitfalls/<work_type>.md`: per-work-type pitfall packs that refine `WRITING-RULES.md` for a given work type
- `AGENTS.md` -- project instructions that shape planning and implementation claims
- `CLAUDE.md` -- mirrored project instructions and product-plan context
