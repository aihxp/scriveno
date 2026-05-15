---
phase: 35-academic-latex-wrappers
plan: 03
subsystem: commands/publishing
tags: [academic, latex, build-print, constraints, kpsewhich]
dependency-graph:
  requires:
    - 35-01-PLAN (regression test suite - defines what must go GREEN)
    - 35-02-PLAN (five LaTeX wrapper templates - consumed by STEP 1.8 LATEX_TEMPLATE path)
  provides:
    - commands/scr/build-print.md with academic LaTeX route (STEP 1.8, STEP 2, STEP 2.5, STEP 4, STEP 5)
    - data/CONSTRAINTS.json with academic in both build_print availability arrays
  affects:
    - Phase 35 full test suite (30 template tests remain RED until 35-02 merges; 9 build-print/CONSTRAINTS tests are GREEN)
tech-stack:
  added: []
  patterns:
    - kpsewhich two-level detection (command -v kpsewhich, then kpsewhich <CLASS>.cls)
    - Per-class tlmgr install guidance with platform-specific error messages
    - Academic early-exit in STEP 2.5 before manifest/trim-size logic
    - Pandoc .tex output route (no --pdf-engine flag) in STEP 4
key-files:
  created: []
  modified:
    - commands/scr/build-print.md
    - data/CONSTRAINTS.json
decisions:
  - "Academic platforms (ieee/acm/lncs/elsevier/apa7) use explicit template path table in STEP 1.8 (not generic {platform} substitution) so grep tests can find scriveno-ieee.latex etc."
  - "STEP 2 per-class error messages list individual tlmgr install commands (5 separate bullet points) to satisfy >=5 tlmgr install acceptance criterion"
  - "llncs error includes Springer download page URL as fallback per RESEARCH.md Pitfall 5"
  - "Academic platforms early-exit STEP 2.5 before manifest load to avoid missing manifest.yaml crash (RESEARCH.md Pitfall 2)"
  - "No --pdf-engine flag in academic STEP 4 pandoc invocation - produces .tex source, writer compiles with own TeX distribution"
metrics:
  duration: 3 min
  completed: 2026-04-17
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 35 Plan 03: Build-Print Academic Route and CONSTRAINTS Update Summary

**One-liner:** Extended build-print.md with a two-level kpsewhich detection gate and pandoc .tex output route for five academic publisher platforms (ieee/acm/lncs/elsevier/apa7), and added "academic" to both CONSTRAINTS.json availability arrays.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Extend build-print.md with academic LaTeX route | 53d3276 | commands/scr/build-print.md |
| 2 | Update CONSTRAINTS.json and verify test suite | ae7c65f | data/CONSTRAINTS.json |

## What Was Built

### Task 1: build-print.md academic LaTeX route

Seven targeted edits were applied to `commands/scr/build-print.md` (original 424 lines -> 564 lines):

**Edit 1 - Header:** Added `ieee | acm | lncs | elsevier | apa7` to platform values list with academic platforms note.

**Edit 2 - STEP 1:** Updated availability from `["prose", "visual", "poetry", "sacred"]` to include `"academic"`, and updated the error message to list "sacred, and academic work types."

**Edit 3 - STEP 1.8:** Inserted academic platform branch BEFORE the existing Typst work_type map. Includes an explicit platform-to-template table (scriveno-ieee.latex through scriveno-apa7.latex) so test grep assertions can find each by name. Sets LATEX_TEMPLATE, validates file existence, sets TYPST_TEMPLATE to null, then proceeds to STEP 2.

**Edit 4 - STEP 2:** Appended two-level kpsewhich detection AFTER the Ghostscript check. First checks `command -v kpsewhich` - if absent, shows "No TeX distribution found" error with brew/apt/MiKTeX install guidance and tug.org URL. Then maps each platform to its class file and shows individual per-class error with `tlmgr install ieeetran` (ieee), `tlmgr install acmart` (acm), `tlmgr install llncs` + Springer download URL (lncs), `tlmgr install elsarticle` (elsevier), `tlmgr install apa7` (apa7).

**Edit 5 - STEP 2.5:** Extended allowed platform slug list to include all five academic slugs. Updated the invalid-platform error message.

**Edit 6 - STEP 2.5 (academic early-exit):** Inserted "if platform is an academic publisher platform" early-exit AFTER the EPUB-only check and BEFORE the "Load manifest" line. Academic platforms skip trim-size validation and page-count guardrail - they have no trim size or page limit - and proceed directly to STEP 3.

**Edit 7 - STEP 4:** Inserted academic LaTeX route BEFORE the existing Typst pandoc block. Uses `pandoc ... -o .manuscript/output/paper-{platform}.tex --template=data/export-templates/scriveno-{platform}.latex --metadata-file=...` with no `--pdf-engine` flag. Includes pdflatex compilation example for writer reference.

**Edit 8 - STEP 5:** Added academic success report variant: `[x] LaTeX source built -> .manuscript/output/paper-{platform}.tex` with `ls -lh` size command.

### Task 2: CONSTRAINTS.json update

Two targeted edits:
- `exports.build_print.available`: added `"academic"` to `["prose", "visual", "poetry", "sacred"]`
- `commands.build-print.available`: added `"academic"` to `["prose", "visual", "poetry", "sacred"]`
- `commands.build-print.description`: updated to mention "academic publisher class wrappers for IEEE, ACM, Springer LNCS, Elsevier, and APA7 (Pandoc + LaTeX)"

## Test Results

**Phase 35 tests:** 9/39 pass (all 9 that this plan owns)
- All 8 build-print.md describe tests: PASS (kpsewhich, ieee/acm/lncs/elsevier/apa7 platforms, paper- naming, tlmgr install guidance)
- CONSTRAINTS.json test: PASS (exports.build_print.available includes "academic")
- 30 LaTeX template tests: FAIL - expected; these are Plan 35-02's deliverables (scriveno-ieee.latex etc. not in this worktree)

**Full npm test suite:** 1480/1510 pass - 30 failures are all Phase 35 template tests (Plan 35-02 scope); no regressions introduced by this plan.

## Deviations from Plan

**1. [Rule 2 - Missing Critical Functionality] Added explicit template path table in STEP 1.8**
- **Found during:** Task 1 verification
- **Issue:** The plan specified generic `LATEX_TEMPLATE = data/export-templates/scriveno-{platform}.latex` (string interpolation). The acceptance criterion requires `grep "scriveno-ieee.latex"` to return at least 1 match.
- **Fix:** Added a platform-to-LATEX_TEMPLATE table with all 5 explicit paths (scriveno-ieee.latex, scriveno-acm.latex, scriveno-lncs.latex, scriveno-elsevier.latex, scriveno-apa7.latex).
- **Files modified:** commands/scr/build-print.md

**2. [Rule 2 - Missing Critical Functionality] Expanded tlmgr install to per-class bullet points**
- **Found during:** Task 1 verification
- **Issue:** Initial implementation had a generic `tlmgr install <PKG>` placeholder. The acceptance criterion requires ≥5 `tlmgr install` matches.
- **Fix:** Added individual per-class bullet points with exact tlmgr commands (tlmgr install ieeetran, tlmgr install acmart, tlmgr install llncs, tlmgr install elsarticle, tlmgr install apa7).
- **Files modified:** commands/scr/build-print.md

## Known Stubs

None - CONSTRAINTS.json and build-print.md are fully wired. The academic LaTeX route is complete. Template files (Plan 35-02) are the remaining integration point; once those are merged, all 39 tests will be GREEN.

## Threat Flags

No new threat surface detected beyond what was in the plan's threat model. The `--platform` slug validation (T-35-04) is implemented via the explicit allowed-values list in STEP 2.5. The kpsewhich invocation (T-35-05) uses the existing `command -v` pattern. No new network endpoints, auth paths, or file access patterns introduced.

## Self-Check

- `commands/scr/build-print.md` exists: FOUND
- `data/CONSTRAINTS.json` exists: FOUND
- Commit `53d3276` exists: FOUND
- Commit `ae7c65f` exists: FOUND
- No unexpected file deletions in either commit

## Self-Check: PASSED

---
*Phase: 35-academic-latex-wrappers*
*Plan: 03*
*Completed: 2026-04-17*
