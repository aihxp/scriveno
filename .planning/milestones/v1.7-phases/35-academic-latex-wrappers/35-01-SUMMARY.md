---
phase: 35-academic-latex-wrappers
plan: 01
subsystem: testing
tags: [node-test, latex, academic, tpl-07, regression, tdd]

# Dependency graph
requires:
  - phase: 34-cross-domain-templates
    provides: "test/phase34-cross-domain-templates.test.js - analog file structure (header, readFile helper, describe/it pattern, assertion message format)"
provides:
  - "test/phase35-academic-latex-wrappers.test.js - 39-test RED-state regression suite for TPL-07 (5 platform wrappers + build-print.md + CONSTRAINTS.json)"
affects:
  - 35-02-PLAN (Wave 2 template creation - these tests go GREEN when templates exist)
  - 35-03-PLAN (Wave 2 build-print.md extension - kpsewhich/tlmgr tests go GREEN)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Phase regression test naming: test/phase{N}-{slug}.test.js"
    - "readFile helper returning null on missing files - tests fail with descriptive messages not process crashes"
    - "TPL-07 tag suffix on every assert message for requirement traceability"
    - "JSON.parse for nested CONSTRAINTS.json path checks (more precise than string search)"

key-files:
  created:
    - "test/phase35-academic-latex-wrappers.test.js"
  modified: []

key-decisions:
  - "All 39 tests start in RED state - implementation files (5 .latex templates, build-print.md academic route, CONSTRAINTS.json update) do not exist yet and will be created in Wave 2 plans 02 and 03"
  - "JSON.parse used for CONSTRAINTS.json nested-path check (constraints.exports.build_print.available) rather than string search - provides more precise assertion on actual data structure"
  - "Copied file header and readFile helper verbatim from phase34 analog to maintain uniform test file structure"

patterns-established:
  - "Phase 35 test file structure: 7 describe blocks - 5 per-platform (ieee, acm, lncs, elsevier, apa7), 1 build-print.md, 1 CONSTRAINTS.json"
  - "Per-platform describe block always has 6 it-blocks: exists, documentclass, tightlist, body, abstract, CSLReferences"

requirements-completed: [TPL-07]

# Metrics
duration: 8min
completed: 2026-04-17
---

# Phase 35 Plan 01: Academic LaTeX Wrappers Regression Suite Summary

**39-test RED-state suite for TPL-07 covering 5 publisher LaTeX wrapper templates (ieee/acm/lncs/elsevier/apa7), build-print.md academic route, and CONSTRAINTS.json exports.build_print.available**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-17T22:25:00Z
- **Completed:** 2026-04-17T22:33:00Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments

- Created `test/phase35-academic-latex-wrappers.test.js` - 383 lines, 7 describe blocks, 39 it-blocks
- All 39 tests fail in RED state (implementation files do not yet exist - correct for Wave 1)
- All 126 assert messages tagged with ` -  TPL-07` for requirement traceability
- Covers all acceptance criteria: 5 class names, kpsewhich/tlmgr/paper- in build-print.md tests, JSON.parse CONSTRAINTS check

## Task Commits

Each task was committed atomically:

1. **Task 1: Write phase35-academic-latex-wrappers.test.js** - `13fa76a` (test)

## Files Created/Modified

- `test/phase35-academic-latex-wrappers.test.js` - 39-test regression suite; 7 describe blocks covering all TPL-07 behaviors; all tests in RED state

## Decisions Made

- Used `JSON.parse` for the CONSTRAINTS.json nested-path check (`constraints.exports.build_print.available`) rather than string search - more precise assertion on actual data structure, consistent with PATTERNS.md guidance
- Copied file header and `readFile` helper verbatim from `test/phase34-cross-domain-templates.test.js` as instructed to maintain structural consistency
- Per-platform describe block structure: 6 it-blocks each (exists, documentclass, tightlist, $body$, $if(abstract)$, CSLReferences) - mirrors the plan's exact template specification

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Wave 1 regression suite is committed and in RED state
- Wave 2 agents (plans 02 and 03) can run `node --test test/phase35-academic-latex-wrappers.test.js` after each file they create to get immediate feedback
- Plan 02 (5 LaTeX wrapper templates) will make the 30 template-related tests go GREEN
- Plan 03 (build-print.md extension + CONSTRAINTS.json update) will make the remaining 9 tests go GREEN

## Self-Check

- `test/phase35-academic-latex-wrappers.test.js` exists: FOUND
- Commit `13fa76a` exists: FOUND
- No unexpected deletions in commit

## Self-Check: PASSED

---
*Phase: 35-academic-latex-wrappers*
*Completed: 2026-04-17*
