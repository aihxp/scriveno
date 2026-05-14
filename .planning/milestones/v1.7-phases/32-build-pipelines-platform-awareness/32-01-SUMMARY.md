---
phase: 32-build-pipelines-platform-awareness
plan: "01"
subsystem: testing
tags: [node-test, tdd, regression, build-pipelines, platform-awareness, epub, pdf, pandoc, typst]

requires:
  - phase: 31-staged-front-matter-generation
    provides: "STEP 1.5/1.6 gate patterns that build commands inherit"
  - phase: 29-architectural-foundation
    provides: "templates/platforms/{slug}/manifest.yaml placeholder shape + lib/architectural-profiles.js"

provides:
  - "RED-state regression suite for BUILD-01..BUILD-05, PLATFORM-01..PLATFORM-03"
  - "90 tests across 8 describe blocks locking all Phase 32 acceptance criteria"
  - "Machine-executable contracts for build-ebook.md, build-print.md, CONSTRAINTS.json exports, and 8 platform manifests"

affects:
  - 32-02-build-commands
  - 32-03-platform-awareness

tech-stack:
  added: []
  patterns:
    - "TDD RED wave: write failing tests before implementation; 8 describe blocks map 1:1 to requirement IDs"
    - "null-safe readFile() helper prevents suite crashes when files are missing"
    - "Requirement IDs in every it() message (-- BUILD-XX or -- PLATFORM-XX) for self-identifying failures"
    - "Loop-generated tests for platform manifest assertions (avoids repetition across 8 slugs)"

key-files:
  created:
    - test/phase32-build-pipelines-platform-awareness.test.js
  modified: []

key-decisions:
  - "EPUB-only platforms (apple, bn, d2d, kobo, google, smashwords) assert trim_sizes: null and max_pages: null — not just status: active"
  - "EPUB-only platform tests also assert absence of pdf_print_ready in formats_accepted for completeness"
  - "Both 'Estimated' and 'pages' asserted separately for PLATFORM-02 warning format (more resilient to exact phrasing)"
  - "BUILD-05 accessibility check matches on epub:type OR semantic nav OR nav (flexible — implementation may use any of these)"
  - "accessibility metadata flag check matches --epub-metadata OR accessibility OR epub-css OR scriveno-epub.css (covers multiple valid implementations)"

patterns-established:
  - "Phase 32 test structure: 8 describe blocks with require IDs, loop-generated platform manifest tests, null-safe readFile"
  - "RED state suite pattern: all tests fail because files don't exist yet — confirmed by exit code 1, 66 failures, 0 crashes"

requirements-completed:
  - BUILD-01
  - BUILD-02
  - BUILD-03
  - BUILD-04
  - BUILD-05
  - PLATFORM-01
  - PLATFORM-02
  - PLATFORM-03

duration: 8min
completed: 2026-04-17
---

# Phase 32 Plan 01: Build Pipelines & Platform Awareness Summary

**90-test RED-state regression suite covering BUILD-01..BUILD-05 and PLATFORM-01..PLATFORM-03, using node:test + null-safe readFile() across 8 describe blocks**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-17T00:00:00Z
- **Completed:** 2026-04-17
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Created `test/phase32-build-pipelines-platform-awareness.test.js` with 90 tests across 8 requirement-aligned describe blocks
- Confirmed RED state: 66 failures, 24 passes (structural checks), exit code 1, zero ReferenceError/SyntaxError
- All 8 requirement IDs (BUILD-01..BUILD-05, PLATFORM-01..PLATFORM-03) present in describe titles
- Suite does not crash on missing files — null-safe readFile() returns null and test assertions produce descriptive failures

## Task Commits

1. **Task 1: Write Phase 32 test suite (RED state)** - `362c324` (test)

## Files Created/Modified

- `test/phase32-build-pipelines-platform-awareness.test.js` — 90-test RED-state suite for Phase 32 build pipeline and platform awareness requirements

## Decisions Made

- EPUB-only platform manifest tests assert both `trim_sizes: null` and `max_pages: null`, plus absence of `pdf_print_ready`, for complete contract coverage
- BUILD-05 accessibility assertion is flexible: matches `epub:type`, `semantic nav`, or `nav` to accommodate different valid implementations
- The accessibility metadata flag test matches multiple valid patterns (`--epub-metadata`, `accessibility`, `epub-css`, `scriveno-epub.css`) so Wave 2 implementation has reasonable latitude
- PLATFORM-02 warning format split into two separate assertions ("Estimated" + "pages") rather than one rigid string, reducing brittleness

## Deviations from Plan

None — plan executed exactly as written. The PATTERNS.md file referenced in `read_first` did not exist (32-PATTERNS.md), but all required patterns were available in the plan's `<interfaces>` section and from reading the Phase 31 test file directly.

## Issues Encountered

- `32-PATTERNS.md` file listed in `read_first` did not exist at `.planning/phases/32-build-pipelines-platform-awareness/32-PATTERNS.md`. All pattern information was sourced directly from the plan's `<interfaces>` block and from reading `test/phase31-staged-front-matter-generation.test.js` — no impact on output.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 32 Wave 2 (32-02) can now create `commands/scr/build-ebook.md` and `commands/scr/build-print.md` against machine-executable contracts
- Phase 32 Wave 3 (32-03) can populate the 8 platform manifests and add `exports.build_ebook` / `exports.build_print` to CONSTRAINTS.json
- Running `npm test` will fail until 32-02 and 32-03 land — this is the expected RED state

---
*Phase: 32-build-pipelines-platform-awareness*
*Completed: 2026-04-17*

## Self-Check: PASSED

- `test/phase32-build-pipelines-platform-awareness.test.js` exists: FOUND
- Commit `362c324` exists: FOUND
- Test suite runs without crashes: CONFIRMED (0 ReferenceError, 0 SyntaxError)
- Exit code non-zero (RED state): CONFIRMED (exit code 1)
- 8 describe blocks present: CONFIRMED (8 suites reported)
- All requirement IDs in describe titles: CONFIRMED (BUILD-01..05, PLATFORM-01..03)
