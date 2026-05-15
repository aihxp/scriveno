---
phase: 30-export-cleanup-validation-gate
plan: "01"
subsystem: test
tags: [tdd, regression-test, cleanup, validate, export-gate]
dependency_graph:
  requires: []
  provides: [phase30-regression-suite]
  affects: [test/phase30-export-cleanup-validation-gate.test.js]
tech_stack:
  added: []
  patterns: [node-test-runner, describe-it-assert, tdd-red-green]
key_files:
  created:
    - test/phase30-export-cleanup-validation-gate.test.js
  modified: []
decisions:
  - "15 assertions written as failing RED tests covering CLEAN-01, CLEAN-02, VALID-01, VALID-02, VALID-03 before command files exist"
  - "Use readFile() helper returning null on missing file so suite does not crash when cleanup.md/validate.md absent"
  - "6 describe blocks organized by requirement ID for traceability"
metrics:
  duration: "~5 minutes"
  completed: "2026-04-17"
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
---

# Phase 30 Plan 01: Phase 30 Regression Test Suite (RED Phase) Summary

TDD RED phase - 15 machine-executable assertions covering all Phase 30 requirements written before any command files are created. Tests fail cleanly on missing files; no crashes; prior 1132 tests unaffected.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write phase 30 regression test suite (RED phase) | bb04763 | test/phase30-export-cleanup-validation-gate.test.js |

## Test Coverage

| Req ID | Assertion | Test # | Status |
|--------|-----------|--------|--------|
| CLEAN-01 | cleanup.md exists at commands/scr/cleanup.md | 1 | RED |
| CLEAN-01 | cleanup.md has YAML frontmatter + description: | 2 | RED |
| CLEAN-01 | cleanup.md includes --apply flag | 3 | RED |
| CLEAN-01 | cleanup.md scopes to .manuscript/drafts/ | 4 | RED |
| CLEAN-02 | cleanup.md includes diff Summary + removed marker counts | 5 | RED |
| VALID-01 | validate.md exists at commands/scr/validate.md | 6 | RED |
| VALID-01 | validate.md has YAML frontmatter + description: | 7 | RED |
| VALID-02 | validate.md mentions stop + blocking behavior | 8 | RED |
| VALID-02 | validate.md references file:line output format | 9 | RED |
| VALID-02 | validate.md mentions pass confirmation message | 10 | RED |
| VALID-03 | export.md contains STEP 1.5 before STEP 2 | 11 | RED |
| VALID-03 | export.md gate mentions --skip-validate | 12 | RED |
| VALID-03 | export.md gate mentions /scr:cleanup --apply | 13 | RED |
| VALID-03 | publish.md contains STEP 1.5 before STEP 2 | 14 | RED |
| VALID-03 | publish.md --skip-validate has visible warning | 15 | RED |

## Verification Results

- `node --test test/phase30-export-cleanup-validation-gate.test.js`: 15 fail, 0 pass (RED - expected)
- `npm test`: 1132 pass, 15 fail (only the new Phase 30 assertions fail; prior suite intact)
- Suite exits non-zero due to missing files, but no uncaught exceptions - process exits cleanly

## TDD Gate Compliance

- RED gate: commit `bb04763` - `test(30-01): add Phase 30 cleanup+validate regression suite (RED)`
- GREEN gate: pending - will be satisfied when plans 02 and 03 ship command files

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - this plan creates only the test file. No command files created yet.

## Threat Flags

None - test file reads local files only; no new network surfaces introduced.

## Self-Check: PASSED

- test/phase30-export-cleanup-validation-gate.test.js: FOUND
- Commit bb04763: FOUND (git log confirms)
- 15 assertions: CONFIRMED (ℹ tests 15, ℹ fail 15 in test output)
- Prior 1132 tests: CONFIRMED (ℹ pass 1132 in npm test output)
