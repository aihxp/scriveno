# Phase 34: Cross-Domain Narrative & Poetry Templates - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous run - grey areas auto-answered with user review)

<domain>
## Phase Boundary

Cross-domain work types (stage play, picture book, illustrated book, Smashwords, chapbook, poetry submission) need dedicated export templates so writers in these domains can produce publication-ready output through the existing build pipeline - not just book prose.

**In scope:**
- 3 Typst templates: `scriveno-stageplay.typst`, `scriveno-picturebook.typst`, `scriveno-chapbook.typst` in `data/export-templates/`
- Fixed-layout EPUB template + OPF stub in `data/export-templates/`
- 2 Pandoc DOCX reference docs (binary): `scriveno-smashwords.docx`, `scriveno-poetry-submission.docx` in `data/export-templates/`
- 2 companion style spec files: `scriveno-smashwords-styles.md`, `scriveno-poetry-submission-styles.md`
- STEP 1.8 (work-type template selection) added to `build-print.md`
- `--fixed-layout` flag added to `build-ebook.md`
- 2 new command files: `commands/scr/build-smashwords.md`, `commands/scr/build-poetry-submission.md`
- Phase 34 regression test suite (TPL-01..TPL-06)

**Out of scope:**
- Changes to Typst rendering (user installs Typst and Pandoc)
- Actual PDF/EPUB build execution (tests are static file checks only)
- Print-on-demand color profiles or bleed-critical production specs beyond 0.125" bleed
- New work types beyond what ROADMAP defines for this phase

</domain>

<decisions>
## Implementation Decisions

### Build Command Integration
- STEP 1.8 in `build-print.md` auto-detects work_type from config.json and maps to the correct Typst template: `stage-play -> scriveno-stageplay.typst`, `picture-book -> scriveno-picturebook.typst`, `chapbook -> scriveno-chapbook.typst`. Falls back to `scriveno-book.typst` for all other work types. Placement: between STEP 1.7 (tradition loading) and STEP 2 (prerequisites).
- Fixed-layout EPUB uses `--fixed-layout` flag on existing `build-ebook.md` - adds an OPF generation step and uses the fixed-layout CSS/template. Auto-detects from picture-book work type when no flag given.
- Smashwords DOCX output is a new `/scr:build-smashwords` command - distinct format (DOCX via Pandoc `--reference-doc`), distinct platform (D2D/Smashwords Style Guide compliance), distinct tool chain from EPUB/PDF.
- Poetry submission DOCX is a new `/scr:build-poetry-submission` command - unique layout rules (1 poem per page, 12pt Times/Garamond, title page, TOC) distinct from any other build output.

### DOCX Reference Doc Approach
- Both DOCX reference docs created via `pandoc --print-default-data-file reference.docx` then committed as binary files to `data/export-templates/`. This provides real Pandoc reference docs with correct style slots that can be used directly with `--reference-doc`.
- Both committed binaries live in `data/export-templates/` alongside all other export templates.
- Companion spec files (`scriveno-smashwords-styles.md`, `scriveno-poetry-submission-styles.md`) document the paragraph style names and formatting rules inline - helps agents customize when needed.

### Regression Test Strategy
- Tests are static file checks only - no build execution required (consistent with Phase 32/33 approach).
- Typst templates: grep for key content markers (dimensions: `8.5in`, `5.5in`, `bleed`; formatting: character name patterns, stage direction italics, page count logic).
- DOCX binaries: `fs.existsSync` only - no content parsing.
- Build command integration: positional checks (STEP 1.8 present and between STEP 1.7 and STEP 2 in build-print.md; `--fixed-layout` reference in build-ebook.md; new command files exist) - consistent with TRAD-05 approach.
- All Phase 34 tests in a single file: `test/phase34-cross-domain-templates.test.js` (node:test + assert/strict, no new dependencies).

### Claude's Discretion
- Exact Typst formatting code for each template (character name centering, stage direction italic parens, bleed/safe zone implementation, spread pagination)
- OPF stub XML structure (EPUB3 fixed-layout OPF metadata)
- STEP 1.8 exact wording and work_type mapping table
- `build-smashwords.md` and `build-poetry-submission.md` command structure (follow `build-ebook.md` / `build-print.md` STEP style)
- Exact Smashwords Style Guide rule implementation in the reference DOCX styles

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/export-templates/scriveno-book.typst` - analog for all 3 new Typst templates (structure, Pandoc variable placeholders, page layout approach)
- `data/export-templates/scriveno-epub.css` - analog for fixed-layout EPUB CSS
- `commands/scr/build-print.md` - STEP 1.7 insertion pattern to replicate for STEP 1.8
- `commands/scr/build-ebook.md` - flag addition pattern (`--skip-validate` precedent for `--fixed-layout`)
- `test/phase33-sacred-tradition-profiles.test.js` - test structure analog (node:test, describe/it, readFile helper, positional index checks)

### Established Patterns
- Export templates: all in `data/export-templates/`, named `scriveno-{type}.{ext}`
- Build command STEPs: `## STEP N` headings, conditional logic as prose ("If X: do Y. If absent or null: skip silently.")
- TDD wave pattern: test suite first (wave 1, RED), then implementation (waves 2+, GREEN)
- CONSTRAINTS.json: new command files require an entry in the `commands` section

### Integration Points
- `commands/scr/build-print.md` STEP 1.7 close -> insert STEP 1.8 before STEP 2
- `commands/scr/build-ebook.md` STEP 4b Pandoc invocation -> add `--fixed-layout` branch
- `data/CONSTRAINTS.json` commands section -> add `build-smashwords` and `build-poetry-submission`

</code_context>

<specifics>
## Specific Ideas

- The 3 plans from ROADMAP are:
  1. Phase 34 regression test suite (TPL-01..TPL-06) - TDD RED wave
  2. Stage play, picture book, fixed-layout EPUB templates (TPL-01, TPL-02, TPL-03)
  3. Smashwords DOCX, chapbook, poetry-submission templates (TPL-04, TPL-05, TPL-06)
- Stage play: Samuel French format - character names in ALL CAPS centered block, stage directions in *(italics in parentheses)*, act/scene headings as H1/H2
- Picture book: 8.5×8.5 PDF, 0.125" bleed (total 8.75×8.75), 0.25" safe zone, spreads as 2-page groups
- Chapbook: 5.5×8.5, saddle-stitch (page count must be a multiple of 4), standard poetry layout (poem title as H2, stanza breaks as blank lines)
- Smashwords: no tabs anywhere, no blank lines between paragraphs for indented styles, first-line indent via paragraph style only, no headers/footers except auto-TOC
- Poetry submission: one poem per page (forced page break after each poem), 12pt Times New Roman or Garamond, title page (title + author + contact info), auto-generated TOC

</specifics>

<deferred>
## Deferred Ideas

- IngramSpark full-wrap cover Typst template (separate phase candidate)
- Narrator/audiobook DOCX template
- Comic/webtoon script template
- Radio drama template
- Color-managed PDF for picture books (CMYK + color profile)

</deferred>
