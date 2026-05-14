---
phase: 34-cross-domain-narrative-poetry-templates
plan: "03"
subsystem: export-templates
tags: [templates, poetry, smashwords, chapbook, docx, typst, publishing]
dependency_graph:
  requires: [phase-34-regression-tests]
  provides: [TPL-04, TPL-05, TPL-06]
  affects:
    - data/export-templates/scriveno-chapbook.typst
    - data/export-templates/scriveno-smashwords.docx
    - data/export-templates/scriveno-smashwords-styles.md
    - data/export-templates/scriveno-poetry-submission.docx
    - data/export-templates/scriveno-poetry-submission-styles.md
    - commands/scr/build-smashwords.md
    - commands/scr/build-poetry-submission.md
    - data/CONSTRAINTS.json
tech_stack:
  added: []
  patterns:
    - pandoc --reference-doc for DOCX style enforcement
    - typst saddle-stitch page-count constraint pattern
    - per-poem page break assembly (STEP 3b newpage injection)
key_files:
  created:
    - data/export-templates/scriveno-chapbook.typst
    - data/export-templates/scriveno-smashwords.docx
    - data/export-templates/scriveno-smashwords-styles.md
    - data/export-templates/scriveno-poetry-submission.docx
    - data/export-templates/scriveno-poetry-submission-styles.md
    - commands/scr/build-smashwords.md
    - commands/scr/build-poetry-submission.md
  modified:
    - data/CONSTRAINTS.json
decisions:
  - "Used pandoc --print-default-data-file reference.docx to seed both DOCX reference docs since pandoc 3.9.0.2 was available in the environment"
  - "Chapbook template uses no first-line indent (justify: false) since poetry relies on stanza breaks, not paragraph indent"
  - "build-smashwords available for prose+visual only; build-poetry-submission for poetry only — enforced in STEP 1 availability check"
  - "CONSTRAINTS.json new entries inserted between build-print and translate to maintain publish category grouping"
metrics:
  duration: "~8 minutes"
  completed: "2026-04-17"
  tasks_completed: 2
  tasks_total: 2
  files_created: 7
  files_modified: 1
---

# Phase 34 Plan 03: Chapbook Typst + Smashwords/Poetry-Submission DOCX Templates Summary

**One-liner:** 5.5x8.5 saddle-stitch chapbook Typst template, Pandoc-seeded Smashwords and poetry-submission DOCX reference docs, companion style guides, and two new build commands (build-smashwords, build-poetry-submission) registered in CONSTRAINTS.json — all TPL-04/05/06 regression tests pass.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create scriveno-chapbook.typst and both DOCX reference docs + style spec files | 604db20 | scriveno-chapbook.typst, scriveno-smashwords.docx, scriveno-smashwords-styles.md, scriveno-poetry-submission.docx, scriveno-poetry-submission-styles.md |
| 2 | Create build-smashwords.md and build-poetry-submission.md; update CONSTRAINTS.json | d8f5bf3 | build-smashwords.md, build-poetry-submission.md, CONSTRAINTS.json |

## Verification Results

All TPL-04, TPL-05, TPL-06 regression tests pass:

- TPL-04: 7/7 tests pass (Smashwords DOCX + build command)
- TPL-05: 4/4 tests pass (chapbook Typst template)
- TPL-06: 8/8 tests pass (poetry submission DOCX + build command)

Key checks confirmed:
- `grep "5.5in" data/export-templates/scriveno-chapbook.typst` exits 0
- `grep "no tabs" data/export-templates/scriveno-smashwords-styles.md` exits 0
- `grep "Times New Roman" data/export-templates/scriveno-poetry-submission-styles.md` exits 0
- `grep '"build-smashwords"' data/CONSTRAINTS.json` exits 0
- `grep '"build-poetry-submission"' data/CONSTRAINTS.json` exits 0
- `node -e "JSON.parse(...CONSTRAINTS.json...)"` exits 0
- `node --test test/phase34-cross-domain-templates.test.js 2>&1 | grep "not ok" | wc -l` outputs 0

Build command registry: `build-world, build-ebook, build-print, build-smashwords, build-poetry-submission` all present in CONSTRAINTS.json.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. Both DOCX files are real pandoc-generated reference documents (10954 bytes each), not zero-byte placeholders. All command files contain complete 5-step pipelines.

## Threat Flags

None. No new network endpoints or auth paths introduced. CONSTRAINTS.json edit was validated with node JSON.parse before commit (T-34-06 mitigated).

## Self-Check: PASSED

- `data/export-templates/scriveno-chapbook.typst` exists: FOUND
- `data/export-templates/scriveno-smashwords.docx` exists: FOUND
- `data/export-templates/scriveno-smashwords-styles.md` exists: FOUND
- `data/export-templates/scriveno-poetry-submission.docx` exists: FOUND
- `data/export-templates/scriveno-poetry-submission-styles.md` exists: FOUND
- `commands/scr/build-smashwords.md` exists: FOUND
- `commands/scr/build-poetry-submission.md` exists: FOUND
- Commit `604db20` exists: FOUND
- Commit `d8f5bf3` exists: FOUND
