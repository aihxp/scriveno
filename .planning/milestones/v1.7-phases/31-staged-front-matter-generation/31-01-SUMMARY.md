---
phase: 31-staged-front-matter-generation
plan: "01"
subsystem: test
tags: [tdd, red-state, regression, front-matter]
dependency_graph:
  requires: []
  provides: [phase31-test-suite-red]
  affects: [wave2-front-matter-md, wave3-export-md, wave3-publish-md]
tech_stack:
  added: []
  patterns: [node:test + node:assert/strict static text assertions]
key_files:
  created:
    - test/phase31-staged-front-matter-generation.test.js
  modified: []
decisions:
  - FM-04 WORK.md test scoped to STEP 1.6 section (not file-wide) to avoid false positive from existing WORK.md metadata reference at line 238
  - FM-01 designed as regression guard (GENERATE elements already clean) - passes in RED state by design; guards against Wave 2/3 regressions introducing placeholders
metrics:
  duration: "2m"
  completed: "2026-04-17"
  tasks_completed: 1
  files_created: 1
  files_modified: 0
requirements: [FM-01, FM-02, FM-03, FM-04]
---

# Phase 31 Plan 01: Phase 31 Regression Test Suite (RED State) Summary

Phase 31 Plan 01 wrote the RED-state test suite for staged front-matter generation - 4 describe blocks, 16 `it` assertions covering FM-01 through FM-04, all failing before Wave 2 and Wave 3 implement the actual command changes.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write Phase 31 test suite in RED state | 87aadce | test/phase31-staged-front-matter-generation.test.js |

## What Was Built

`test/phase31-staged-front-matter-generation.test.js` - 281 lines, following the exact Phase 30 pattern (`node:test` + `node:assert/strict` + `readFile()` helper).

**Test structure:**

| Group | Requirement | Tests | State |
|-------|-------------|-------|-------|
| FM-01 | GENERATE elements (01,03,04,07) have no `[Fill in]` placeholders | 1 | PASS (regression guard - already clean) |
| FM-02 | front-matter.md adds `scaffold: true` YAML to 5 scaffold elements | 6 | FAIL (RED) |
| FM-03 | export.md + publish.md have STEP 1.6 scaffold gate; STEP 3b references exclusion list | 7 | FAIL (RED) |
| FM-04 | export.md STEP 1.6 contains WORK.md timestamp comparison + 4 GENERATE filenames + scope guard | 3 | FAIL (RED) |

**RED state confirmation:** 16 failing tests + 1 passing regression guard. Wave 2 (front-matter.md) will turn FM-02 GREEN. Wave 3 (export.md + publish.md) will turn FM-03 and FM-04 GREEN.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Precision] FM-04 WORK.md test scoped to STEP 1.6 section**
- **Found during:** Task 1, RED state verification
- **Issue:** `content.includes('WORK.md')` would pass as a false positive because export.md already contains `WORK.md` at line 238 (metadata reading step), unrelated to STEP 1.6
- **Fix:** Scoped the test to extract the STEP 1.6 section (between `indexOf('STEP 1.6')` and `indexOf('STEP 2', step16Index)`) and assert `WORK.md` appears within that scoped section
- **Files modified:** test/phase31-staged-front-matter-generation.test.js
- **Commit:** 87aadce (same commit - corrected before first commit)

## FM-01 Design Note

FM-01 is a regression guard, not a currently-broken assertion. The GENERATE elements (01, 03, 04, 07) in front-matter.md already produce clean output with no `[Fill in]` placeholders - per CONTEXT.md, this is the intended current state. The test passes now and will continue to pass after Wave 2/3, ensuring Wave 2/3 edits do not accidentally introduce placeholder text into the GENERATE sections.

## Phase 30 Regression Check

Phase 30 tests: 15 pass, 0 fail - no regression introduced.

## Known Stubs

None. This plan creates only test assertions; no stubs in the implementation.

## Threat Flags

None. Static read-only assertions against file content. No new network endpoints, auth paths, file access patterns, or schema changes.

## Self-Check: PASSED

- [x] `test/phase31-staged-front-matter-generation.test.js` exists: FOUND
- [x] Commit 87aadce exists: FOUND
- [x] 4 describe blocks: FOUND (grep -c "describe(" returns 4)
- [x] RED state: 16 failing tests confirmed before Wave 2/3 implementation
- [x] Phase 30 regression: 15 pass, 0 fail
