---
phase: 31-staged-front-matter-generation
plan: "03"
subsystem: commands
tags: [front-matter, scaffold, export, publish, step-injection, fm-03, fm-04]
dependency_graph:
  requires: [31-01, 31-02]
  provides: [phase31-fm03-green, phase31-fm04-green, phase31-complete]
  affects: [export-assembly, publish-pipeline]
tech_stack:
  added: []
  patterns: [step-injection-additive, scaffold-exclusion-list, timestamp-auto-refresh]
key_files:
  created: []
  modified:
    - commands/scr/export.md
    - commands/scr/publish.md
    - test/phase31-staged-front-matter-generation.test.js
decisions:
  - STEP 1.6 implemented as single combined step with sub-steps 1.6a (scaffold exclusion) and 1.6b (auto-refresh) - mirrors STEP 3 sub-step pattern
  - Test ordering checks fixed to use '### STEP 2:' heading pattern instead of first 'STEP 2' substring to avoid false positives from STEP 1.5 inline references
  - publish.md needs no STEP 3b edit - it chains to export.md which has its own STEP 3b; STEP 1.6 in publish.md informs the export dispatch
metrics:
  duration: "12m"
  completed: "2026-04-17"
  tasks_completed: 2
  files_created: 0
  files_modified: 3
requirements: [FM-03, FM-04]
---

# Phase 31 Plan 03: Inject STEP 1.6 Front-Matter Gate into export.md and publish.md Summary

Surgical injections of STEP 1.6 (FRONT-MATTER GATE) into `commands/scr/export.md` and `commands/scr/publish.md`, plus STEP 3b scaffold exclusion reference in export.md - turning FM-03 and FM-04 GREEN and completing Phase 31.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Inject STEP 1.6 into export.md and update STEP 3b | 163a748 | commands/scr/export.md, test/phase31-staged-front-matter-generation.test.js |
| 2 | Inject STEP 1.6 into publish.md | 89cd8ba | commands/scr/publish.md |

## What Was Built

### export.md - STEP 1.6 injection (after STEP 1.5, before STEP 2)

STEP 1.6: FRONT-MATTER GATE with two sub-steps:

- **1.6a - Scaffold exclusion:** Checks `.manuscript/front-matter/` for files with `scaffold: true` in their first 10 lines. Builds a named exclusion list. Shows a summary note listing excluded files with opt-in instructions. Non-blocking - always proceeds to 1.6b.
- **1.6b - GENERATE element auto-refresh:** Compares `.manuscript/WORK.md` modification timestamp against the 4 GENERATE files (01-half-title.md, 03-title-page.md, 04-copyright.md, 07-toc.md). If WORK.md is newer than any (or any are missing), re-runs the GENERATE step for elements 1, 3, 4, 7 only. Explicitly names the 4 files and says "Do NOT regenerate scaffold elements (5, 6, 11, 12, 13)".

### export.md - STEP 3b scaffold exclusion sentence

Added bold **Scaffold exclusion:** paragraph after the sort-order code block in STEP 3b: "Omit any files whose path appears in the scaffold exclusion list from STEP 1.6a."

### publish.md - STEP 1.6 injection (after STEP 1.5, before STEP 2: ROUTE)

Identical STEP 1.6 structure to export.md. No STEP 3b edit needed - publish.md chains to export.md which applies its own STEP 3b exclusion during assembly.

## Test Results

| Group | Tests | Before | After |
|-------|-------|--------|-------|
| FM-01 (GENERATE no placeholders) | 1 | PASS | PASS |
| FM-02 (scaffold: true on 5 elements) | 6 | PASS | PASS |
| FM-03 (export.md/publish.md STEP 1.6 + STEP 3b) | 7 | FAIL | PASS |
| FM-04 (auto-refresh logic in STEP 1.6) | 3 | FAIL | PASS |
| **Total Phase 31** | **17** | 7/17 | **17/17** |

Full suite: **1170 pass, 0 fail** - Phase 31 complete with no regressions.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Test ordering checks used ambiguous `indexOf('STEP 2')` substring**
- **Found during:** Task 1, GREEN verification
- **Issue:** Both `FM-03: STEP 1.6 must come before STEP 2 in export.md` and the publish.md equivalent used `content.indexOf('STEP 2')` which matched the first occurrence - "Proceed to STEP 2." inside STEP 1.5 (line 103 in export.md, line 53 in publish.md). This is before STEP 1.6's position, so the assertion `step16Pos < step2Pos` was false even after correct injection.
- **Fix:** Changed both tests to use `content.indexOf('### STEP 2:')` to match the section heading rather than any inline "STEP 2" reference
- **Files modified:** test/phase31-staged-front-matter-generation.test.js
- **Commit:** 163a748

## Known Stubs

None. STEP 1.6 instructions are complete and final. The example scaffold path (`.manuscript/front-matter/12-preface.md`) in the note template is illustrative - the agent replaces it with the actual list of excluded files at runtime.

## Threat Flags

None. Changes are purely additive markdown text insertions in command files. No new network endpoints, auth paths, file access patterns, or schema changes.

Threat mitigations confirmed:
- **T-31-05:** export.md additive injection verified - `grep "CHECK PREREQUISITES"` returns 1 line (STEP 2 unchanged); `grep "STEP 1.5"` confirms STEP 1.5 unchanged.
- **T-31-06:** publish.md additive injection verified - `grep "ROUTE"` returns `### STEP 2: ROUTE` (unchanged); `grep "LOAD CONTEXT"` returns 1 line (STEP 1 unchanged).
- **T-31-07:** Auto-refresh instruction explicitly names only the 4 GENERATE files and says "Do NOT regenerate scaffold elements (5, 6, 11, 12, 13)". Acceptance criteria grep confirms this text present.
- **T-31-08:** No "stop" language in STEP 1.6 in either file - verified by awk scan.
- **T-31-09:** STEP 1.6a produces a named summary note listing each excluded file with `scaffold: true` opt-in instructions.

## Self-Check: PASSED

- [x] `commands/scr/export.md` contains `### STEP 1.6: FRONT-MATTER GATE`: CONFIRMED (line 120)
- [x] `commands/scr/export.md` STEP ordering: STEP 1.5 (86) < STEP 1.6 (120) < STEP 2 (166): CONFIRMED
- [x] `commands/scr/publish.md` contains `### STEP 1.6: FRONT-MATTER GATE`: CONFIRMED (line 70)
- [x] `commands/scr/publish.md` STEP ordering: STEP 1.5 (36) < STEP 1.6 (70) < STEP 2 (116): CONFIRMED
- [x] STEP 3b scaffold exclusion sentence present in export.md: CONFIRMED
- [x] "Do NOT regenerate scaffold elements" present in both files: CONFIRMED
- [x] No "stop" language in STEP 1.6 blocks: CONFIRMED
- [x] Commit 163a748 exists: FOUND
- [x] Commit 89cd8ba exists: FOUND
- [x] All 17 Phase 31 tests GREEN: CONFIRMED
- [x] Full suite 1170/1170: CONFIRMED
