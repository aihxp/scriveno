# Shipped Assets

Scriven's launch surface should point to what is actually bundled in this repo today. This document is the canonical inventory for shipped export templates, drafter-quality assets, and other trust-critical launch files.

## Drafter Quality Assets Shipped Today

These files ship in `templates/` and provide layered rule scaffolding loaded by the drafter, voice-checker, and originality-check after `STYLE-GUIDE.md`. See [docs/drafter-quality.md](drafter-quality.md) for the full system.

- `templates/WRITING-RULES.md` (universal AI-tell rulebook, 5.5kB; loaded after `STYLE-GUIDE.md`)

Per-work-type pitfall packs in `templates/pitfalls/`:

- `pitfalls/novel.md` (prose: filter words, POV breaches, dialogue traps, genre stock phrases)
- `pitfalls/memoir.md` (prose: retrospective voice traps, sentimentality, self-presentation)
- `pitfalls/screenplay.md` (script: unfilmable description, action-line bloat, on-the-nose dialogue)
- `pitfalls/runbook.md` (technical: imperatives, missing preconditions, verification and rollback)
- `pitfalls/research_paper.md` (academic: hedge stacks, citation hygiene, methodology traps)
- `pitfalls/poetry_collection.md` (poetry: image cliches, diction traps, sentimentality, form pitfalls)
- `pitfalls/comic.md` (visual: script-versus-art boundary, panel rhythm, caption voice)
- `pitfalls/commentary.md` (sacred: register drift, anachronism, source-handling, doctrinal precision)

Conflict resolution is top-down: `STYLE-GUIDE.md` beats `WRITING-RULES.md` beats the pitfall pack. The writer's voice is sovereign; the new rule layers are scaffolding.

A contributor adding `templates/pitfalls/<work_type>.md` is automatically picked up by `lib/architectural-profiles.js#listPitfallPacks` with no edits to library code or `CONSTRAINTS.json`.

## Export Templates Shipped Today

These export templates are currently bundled in `data/export-templates/`:

- `scriven-book.typst` -- default book interior and print-ready PDF template
- `scriven-stageplay.typst` -- stage play interior template
- `scriven-picturebook.typst` -- picture-book interior template
- `scriven-chapbook.typst` -- chapbook and poetry-collection interior template
- `scriven-epub.css` -- standard EPUB styling and KDP-compatible ebook CSS
- `scriven-fixed-layout-epub.css` -- fixed-layout EPUB stylesheet
- `scriven-fixed-layout.opf` -- fixed-layout EPUB OPF stub
- `scriven-academic.latex` -- generic academic/thesis LaTeX template
- `scriven-ieee.latex` -- IEEE wrapper template
- `scriven-acm.latex` -- ACM wrapper template
- `scriven-lncs.latex` -- LNCS wrapper template
- `scriven-elsevier.latex` -- Elsevier wrapper template
- `scriven-apa7.latex` -- APA7 wrapper template
- `scriven-smashwords.docx` -- Smashwords reference DOCX
- `scriven-smashwords-styles.md` -- Smashwords style guide companion
- `scriven-poetry-submission.docx` -- poetry-submission reference DOCX
- `scriven-poetry-submission-styles.md` -- poetry-submission style guide companion

## Export Template Behaviors

- Manuscript DOCX export currently relies on Pandoc's default DOCX styling unless the user supplies a custom Pandoc reference document.
- Formatted DOCX export currently relies on Pandoc's default DOCX output unless the user supplies a custom Pandoc reference document for styled review copies.
- `scriven-manuscript.docx` is not shipped today.
- `scriven-formatted.docx` is not shipped today.
- `scriven-kdp-cover.typst` is not shipped today.
- `scriven-ingram-cover.typst` is not shipped today.
- Cover deliverables are manuscript build assets, not bundled export templates:
  - Ebook front cover: `.manuscript/build/ebook-cover.jpg` (or `.png`)
  - Paperback full wrap: `.manuscript/build/paperback-cover.pdf`
  - Hardcover case wrap: `.manuscript/build/hardcover-cover.pdf`
- Those cover files are designer-provided or externally produced assets that Scriven's build/export commands reference; exact paperback and hardcover wrap geometry still comes from the active platform cover template generator.

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
- `docs/runtime-support.md` -- canonical runtime matrix, Node baseline, and support-confidence framing
- `docs/command-reference.md` -- canonical command surface reference
- `docs/configuration.md` -- canonical project config and package metadata reference
- `data/proof/watchmaker-flow/README.md` -- canonical sample-flow proof bundle rooted in shipped demo files
- `data/proof/voice-dna/README.md` -- canonical Voice DNA proof bundle
- `commands/scr/export.md` -- source of truth for export command behavior
- `docs/publishing.md` -- user-facing explanation of export formats and publishing packages
- `docs/contributing.md` -- contributor-facing guidance for extending export support
- `docs/drafter-quality.md`: canonical reference for the drafter's three rule layers and the `draft` config block
- `templates/WRITING-RULES.md`: canonical universal AI-tell rulebook loaded by drafter, voice-checker, and originality-check
- `templates/pitfalls/<work_type>.md`: per-work-type pitfall packs that refine `WRITING-RULES.md` for a given work type
- `AGENTS.md` -- project instructions that shape planning and implementation claims
- `CLAUDE.md` -- mirrored project instructions and product-plan context
