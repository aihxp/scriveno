---
phase: 34-cross-domain-narrative-poetry-templates
plan: "02"
subsystem: export-templates
tags: [typst, epub, fixed-layout, stage-play, picture-book, build-pipeline]
dependency_graph:
  requires: [34-01-PLAN.md]
  provides: [scriveno-stageplay.typst, scriveno-picturebook.typst, scriveno-fixed-layout-epub.css, scriveno-fixed-layout.opf, STEP-1.8, --fixed-layout-flag]
  affects:
    - data/export-templates/scriveno-stageplay.typst
    - data/export-templates/scriveno-picturebook.typst
    - data/export-templates/scriveno-fixed-layout-epub.css
    - data/export-templates/scriveno-fixed-layout.opf
    - commands/scr/build-print.md
    - commands/scr/build-ebook.md
tech_stack:
  added: []
  patterns:
    - Pandoc $if()$ variable substitution in Typst templates
    - EPUB3 rendition vocabulary in OPF metadata
    - -epub-layout CSS property for Apple Books fixed-layout
    - Work-type-driven template routing via TYPST_TEMPLATE variable
key_files:
  created:
    - data/export-templates/scriveno-stageplay.typst
    - data/export-templates/scriveno-picturebook.typst
    - data/export-templates/scriveno-fixed-layout-epub.css
    - data/export-templates/scriveno-fixed-layout.opf
  modified:
    - commands/scr/build-print.md
    - commands/scr/build-ebook.md
decisions:
  - "Stage play page width is 8.5in (US Letter) matching Samuel French industry standard"
  - "Picture book page size is 8.75in x 8.75in (8.5x8.5 trim + 0.125in bleed each side)"
  - "Fixed-layout EPUB uses -epub-layout: pre-paginated in CSS and rendition:layout in OPF"
  - "STEP 4 pandoc invocation now uses {TYPST_TEMPLATE} variable instead of hardcoded scriveno-book.typst"
  - "picture_book work_type auto-enables --fixed-layout flag without user needing to pass it"
metrics:
  duration: "~2 minutes"
  completed: "2026-04-17"
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 2
---

# Phase 34 Plan 02: Cross-Domain Stage Play, Picture Book, and Fixed-Layout EPUB Templates Summary

**One-liner:** Samuel French stage play Typst template (8.5x11, Courier, centered ALLCAPS character names), picture book Typst template (8.75x8.75 with 0.125in bleed), fixed-layout EPUB CSS + OPF stub, STEP 1.8 work-type template routing in build-print, and --fixed-layout flag in build-ebook.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create scriveno-stageplay.typst and scriveno-picturebook.typst | 2b1dcf6 | data/export-templates/scriveno-stageplay.typst, data/export-templates/scriveno-picturebook.typst |
| 2 | Create fixed-layout EPUB CSS + OPF stub, add STEP 1.8 and --fixed-layout flag | 989ddaf | data/export-templates/scriveno-fixed-layout-epub.css, data/export-templates/scriveno-fixed-layout.opf, commands/scr/build-print.md, commands/scr/build-ebook.md |

## Verification Results

All TPL-01, TPL-02, and TPL-03 regression tests pass (19/19 assertions green):

- TPL-01 (8 tests): scriveno-stageplay.typst - 8.5in, upper(), emph, heading.where(level:1/2), STEP 1.8 positioning
- TPL-02 (5 tests): scriveno-picturebook.typst - 8.75in, 0.125in bleed, 0.25in safe zone, spread marker
- TPL-03 (6 tests): fixed-layout CSS + OPF - -epub-layout, rendition:layout, rendition:spread, --fixed-layout in build-ebook

TPL-04, TPL-05, TPL-06 remain RED (those are for plans 34-03 and 34-04).

## Deviations from Plan

None - plan executed exactly as written.

The checkpoint task (Task 3, type="checkpoint:human-verify") was reached after all auto tasks completed with passing tests. No issues were found requiring human intervention.

## Known Stubs

None. All 4 template files contain complete, functional content. The OPF stub uses placeholder tokens (TITLE, AUTHOR, BOOK-UUID) by design - these are documented in the file as writer-replaceable values, not accidental stubs.

## Threat Flags

None. The 4 new template files are read-only reference assets. No new network endpoints, auth paths, or file access patterns were introduced.

- T-34-03 (Tampering: STEP 1.8 template path) - mitigated per plan: template existence check blocks build with clear re-install error if file is missing.
- T-34-04 (DoS: --fixed-layout OPF copy) - accepted per plan: cp is non-destructive; OPF is read-only stub.
- T-34-05 (Info Disclosure: OPF in output/) - accepted per plan: only placeholder tokens, no user secrets.

## Self-Check: PASSED

- `data/export-templates/scriveno-stageplay.typst` exists: FOUND
- `data/export-templates/scriveno-picturebook.typst` exists: FOUND
- `data/export-templates/scriveno-fixed-layout-epub.css` exists: FOUND
- `data/export-templates/scriveno-fixed-layout.opf` exists: FOUND
- `commands/scr/build-print.md` contains STEP 1.8: CONFIRMED
- `commands/scr/build-ebook.md` contains --fixed-layout: CONFIRMED
- Commit `2b1dcf6` exists: FOUND
- Commit `989ddaf` exists: FOUND
- TPL-01, TPL-02, TPL-03 all pass: CONFIRMED (19/19 green)
