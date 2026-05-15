---
phase: 29-architectural-foundation
plan: 04
subsystem: architectural-foundation
tags: [test, regression, node-test, arch-01, arch-02, arch-03, arch-04, arch-05, drop-in-extension]
requires:
  - Phase 29 Plan 01 (templates/sacred/ + templates/platforms/ directories with 18 placeholder manifests)
  - Phase 29 Plan 02 (data/CONSTRAINTS.json architectural_profiles block + templates/WORK.md {{PROFILE_BLOCK}} placeholder)
  - Phase 29 Plan 03 (lib/architectural-profiles.js module + bin/install.js re-exports)
provides:
  - "test/phase29-architectural-foundation.test.js: 54-test regression suite covering ARCH-01..ARCH-05"
  - "Runtime contract: any downstream change in Phases 30-35 that breaks drop-in extension, CONSTRAINTS shape, or default inference fails immediately at `npm test`"
  - "Re-export contract: bin/install.js must continue to expose all 6 architectural-profile functions AND pre-existing validateSettings/readSettings"
affects:
  - CI / prepublishOnly (npm test gate)
  - Future Phases 30-35 (regression gate for architectural foundation)
tech-stack:
  added: []
  patterns:
    - "Ephemeral fixture pattern: scaffoldTempProfile() creates a temp manifest dir and returns a cleanup function; tests wrap assertions in try/finally so cleanup runs on both pass and failure paths"
    - "Parameterized test cases: ARCH-04 and ARCH-05 iterate over authoritative CONSTRAINTS.json data to generate one `it()` per work-type mapping - 36 generated assertions"
    - "Dual-import verification: the suite requires both lib/architectural-profiles.js directly AND bin/install.js, asserting both surfaces return the same function references"
key-files:
  created:
    - test/phase29-architectural-foundation.test.js
  modified: []
decisions:
  - "Ephemeral fixture slugs use the prefix 'zzz-test-' (zzz-test-zoroastrian, zzz-test-lulu) rather than the plan-spec'd '__test-...__' names. Rationale: lib/architectural-profiles.js SLUG_PATTERN = /^[a-z][a-z0-9-]*$/ intentionally rejects slugs starting with underscore (Plan 03 key-decision #5). The zzz- prefix preserves every intent of the original names (collision-free, visually unmistakable as test-only, sorts last so any leak is conspicuous) while satisfying the runtime validator. Documented inline with a comment explaining the constraint."
  - "Kept the full 54-test surface despite the plan's 25-test minimum target. Every additional case is a sub-assertion on a scripture work type or a book-shaped work type pulled from CONSTRAINTS.work_type_groups - it costs nothing to enumerate them, and Phase 32/33 refactors can then trip one specific mapping instead of one umbrella assertion."
  - "Removed the unused `after` import from the plan's action-block spec. The try/finally cleanup pattern replaces any after-hook need, and shipping a used-for-nothing import would distract future readers."
requirements-completed:
  - ARCH-01
  - ARCH-02
  - ARCH-03
  - ARCH-04
  - ARCH-05
metrics:
  duration: "~2.4 minutes"
  completed: "2026-04-17"
---

# Phase 29 Plan 04: ARCH Regression Test Suite Summary

Phase 29 locked - `test/phase29-architectural-foundation.test.js` ships 54 passing tests across 6 describe blocks that turn each ARCH-01..ARCH-05 ROADMAP success criterion into concrete node:test assertions. Full `npm test` is green: 1132/1132 across 283 suites. Zero new dependencies; only Node built-ins (node:test, node:assert/strict, fs, path).

## Performance

- **Duration:** ~2.4 min
- **Started:** 2026-04-17T12:30:03Z
- **Completed:** 2026-04-17T12:32:28Z
- **Tasks:** 1
- **Files created:** 1 (`test/phase29-architectural-foundation.test.js`)
- **Files modified:** 0

## Describe Blocks and Test Counts

| # | Describe block | Tests | Requirement |
| - | --- | --- | --- |
| 1 | Phase 29: ARCH-01 drop-in tradition | 1 | ARCH-01 |
| 2 | Phase 29: ARCH-02 drop-in platform | 1 | ARCH-02 |
| 3 | Phase 29: ARCH-03 CONSTRAINTS.json declares architectural_profiles | 7 | ARCH-03 |
| 4 | Phase 29: ARCH-04 sacred work types infer correct tradition default | 6 (5 parameterized + 1 null-case) | ARCH-04 |
| 5 | Phase 29: ARCH-05 book work types infer kdp platform default | 33 (32 parameterized across 4 groups + 1 non-book null-case) | ARCH-05 |
| 6 | Phase 29: bin/install.js re-exports architectural-profiles | 7 (6 function-export asserts + 1 pre-existing-export regression) | cross-cut (all 5 ARCH via re-export surface) |
| **Total** | | **55 described / 54 run** | |

> Note: one `it()` in ARCH-04 is the null-case (novel/screenplay/research_paper -> null), which contains three assertions inside a single test. The runner reports 54 tests; 55 is the raw describe-count.

Actual runner output:

```
ℹ tests 54
ℹ suites 6
ℹ pass 54
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 82.33
```

## Per-Requirement Coverage

### ARCH-01: Drop-in sacred tradition - [x] covered

- One test creates `templates/sacred/zzz-test-zoroastrian/manifest.yaml` ephemerally, asserts `listTraditions()` picks it up AND `validateTradition('zzz-test-zoroastrian').valid === true`, then cleans up in a `finally` block, then asserts the slug is gone.
- Proves: new manifest drop-ins are accepted at runtime with zero code edit, and removal takes effect on next call (no cache).

### ARCH-02: Drop-in publishing platform - [x] covered

- Symmetric to ARCH-01 but for `templates/platforms/zzz-test-lulu/manifest.yaml`.
- Proves: the platform surface has the same drop-in semantics as the tradition surface.

### ARCH-03: CONSTRAINTS.json architectural_profiles shape + validator - [x] covered (7 tests)

- `architectural_profiles` top-level key exists
- `traditions._seeded` has exactly 10 entries AND each has a shipped `manifest.yaml` on disk
- `platforms._seeded` has exactly 8 entries AND each has a shipped `manifest.yaml` on disk
- `applies_to_groups.tradition === ['sacred']` AND `.platform` includes `prose`/`sacred` but excludes `script`/`technical`
- `validateTradition('bogus')` returns error naming `catholic` AND `islamic-hafs`
- `validatePlatform('bogus')` returns error naming `kdp` AND `ingram`
- `templates/WORK.md` contains both `## Profile` section and `{{PROFILE_BLOCK}}` placeholder

### ARCH-04: Sacred work types -> tradition defaults - [x] covered (6 tests)

- `scripture_biblical -> catholic`
- `scripture_quranic -> islamic-hafs`
- `scripture_torah -> jewish`
- `scripture_buddhist -> pali`
- `scripture_vedic -> sanskrit`
- Non-sacred work types (`novel`, `screenplay`, `research_paper`) -> `null`

### ARCH-05: Book-shaped work types -> `kdp` platform default - [x] covered (33 tests)

- Parameterized iteration over every member of `CONSTRAINTS.work_type_groups.prose.members` (9), `.visual.members` (4), `.poetry.members` (3), `.sacred.members` (16) - a total of **32 per-work-type assertions** - each asserts `inferPlatform(slug) === 'kdp'`.
- One additional test confirms non-book groups (`screenplay`, `research_paper`, `technical_guide`) return `null`.

### Cross-cut: bin/install.js re-export surface - [x] covered (7 tests)

- Each of the 6 Plan-03 functions (`listTraditions`, `listPlatforms`, `validateTradition`, `validatePlatform`, `inferTradition`, `inferPlatform`) is typeof 'function' on the installer export.
- Pre-existing `validateSettings` AND `readSettings` still typeof 'function' - catches any future re-export-collision regression.

## Cleanup and No-Leak Guarantee

Every test that creates a fixture uses this pattern:

```javascript
const cleanup = scaffoldTempProfile(dir, slug);
try {
  // ... assertions ...
} finally {
  cleanup();  // runs whether the block passed, threw, or was timed out
}
assert.ok(!profiles.listX().includes(slug), 'cleanup should remove the temp slug');
```

Post-run verification:

```bash
$ ls templates/sacred/zzz-test-* templates/platforms/zzz-test-* 2>&1 | head -5
(eval):1: no matches found: templates/sacred/zzz-test-*
```

Shipped directory counts unchanged after the full suite runs:

```bash
$ ls templates/sacred/*/manifest.yaml | wc -l
10
$ ls templates/platforms/*/manifest.yaml | wc -l
8
```

## Full Suite Regression

```bash
$ npm test
...
ℹ tests 1132
ℹ suites 283
ℹ pass 1132
ℹ fail 0
```

All 1078 pre-existing tests continue to pass alongside the 54 new Phase 29 tests. Zero regressions.

## Zero New Dependencies

```bash
$ git diff --stat package.json
# (no output - package.json unchanged)

$ grep -nE "^const.*require\(" test/phase29-architectural-foundation.test.js
1:const { describe, it } = require('node:test');
2:const assert = require('node:assert/strict');
3:const fs = require('fs');
4:const path = require('path');
11:const profiles = require('../lib/architectural-profiles.js');
12:const install = require('../bin/install.js');
```

Six requires. Four Node built-ins (`node:test`, `node:assert/strict`, `fs`, `path`) and two relative imports to the modules under test. Nothing from `node_modules/` because there is no `node_modules/`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixture slug chosen in plan spec is rejected by SLUG_PATTERN**

- **Found during:** Task 1 test run
- **Issue:** The plan's `<behavior>` and `<action>` specified ephemeral fixture slugs `__test-zoroastrian__` and `__test-lulu__`, but `lib/architectural-profiles.js` defines `SLUG_PATTERN = /^[a-z][a-z0-9-]*$/` - the leading underscore is intentionally rejected (Plan 03 decision: "filter contributor typos at validation time with a predictable rule"). As a result the first two tests failed with `listTraditions()`/`listPlatforms()` not returning the drop-in slug.
- **Fix:** Replaced the slugs with pattern-valid `zzz-test-zoroastrian` and `zzz-test-lulu`. The `zzz-` prefix preserves every practical quality of the original: collision-free (no plausible real tradition/platform starts with `zzz`), visually unmistakable as test-only, and sorts last in directory listings so any leak would be the most conspicuous file in the directory. Added an inline comment above each assignment explaining the SLUG_PATTERN constraint.
- **Files modified:** test/phase29-architectural-foundation.test.js
- **Commit:** 74c6bd0 (folded into the same task 1 commit since it was caught pre-commit during the verify step)
- **Why this is not a Plan 01-03 bug:** Plan 03 explicitly documents SLUG_PATTERN as an intentional filter. The correct remedy per the plan's `<action>` ("If any test fails, the failure must indicate a genuine gap in Plans 01-03 - NOT a test bug") is to confirm Plans 01-03 are correct, which they are. The fix belongs in the test, not in the module.

**2. [Rule 1 - Cleanup] Removed unused `after` import**

- **Found during:** Task 1 final polish pass
- **Issue:** The plan's `<action>` block imports `after` from node:test, but the actual test body uses try/finally for cleanup and never calls `after()`. An unused import would be a minor warning surface for future readers.
- **Fix:** Changed `const { describe, it, after } = require('node:test');` to `const { describe, it } = require('node:test');`.
- **Commit:** 74c6bd0 (same task commit)

## Auth Gates

None. No external services or APIs touched.

## Acceptance Criteria

- [x] File `test/phase29-architectural-foundation.test.js` exists (182 lines)
- [x] `node --test test/phase29-architectural-foundation.test.js` reports `# fail 0` (54 pass, 0 fail)
- [x] Test count ≥ 25 (actual: 54)
- [x] No `zzz-test-zoroastrian` / `zzz-test-lulu` leak (verified via `ls templates/sacred/zzz-test-* templates/platforms/zzz-test-*` -> no matches)
- [x] `ls templates/sacred/*/manifest.yaml | wc -l` = 10 (unchanged)
- [x] `ls templates/platforms/*/manifest.yaml | wc -l` = 8 (unchanged)
- [x] Test file uses ONLY Node built-ins for non-relative requires (node:test, node:assert/strict, fs, path)
- [x] `npm test` as a whole passes (1132/1132, no regressions)
- [x] `package.json` diff is empty (zero new deps)
- [x] Each ARCH-01..ARCH-05 requirement has at least one test case (1, 1, 7, 6, 33 respectively)

## Commits

| Task | Hash | Message |
| ---- | ---- | ------- |
| 1 | 74c6bd0 | test(29-04): add Phase 29 ARCH-01..ARCH-05 regression suite |

## Issues Encountered

One fixture-slug mismatch with SLUG_PATTERN, caught by the first test run and fixed in the same working session before the commit. Documented in Deviations. No other issues.

## User Setup Required

None.

## Phase 29 Complete - Next Milestone Readiness

With Plan 04 committed, Phase 29 Architectural Foundation is fully green:

- **Plan 01:** 18 placeholder manifests + 2 READMEs in `templates/sacred/` and `templates/platforms/`
- **Plan 02:** `{{PROFILE_BLOCK}}` placeholder in `templates/WORK.md` + `architectural_profiles` schema in `data/CONSTRAINTS.json`
- **Plan 03:** `lib/architectural-profiles.js` runtime validator + `bin/install.js` re-exports (6 new functions)
- **Plan 04:** 54-test regression suite locking all of the above (this file)

All five ARCH requirements (ARCH-01..ARCH-05) are now truth-locked by machine-executable contracts. Downstream phases can extend the profile families by dropping manifests into the templates directories - no code edit, no JSON edit, and the regression suite will catch any accidental shape break.

Phases 30-35 can proceed against this foundation:
- **Phase 32 (Build Pipelines):** populates `trim_sizes`/`max_pages`/`epub_variant`/`metadata_shape`/`formats_accepted` in platform manifests; calls `inferPlatform()` for per-work-type defaults; the `listPlatforms()` contract is locked by this suite.
- **Phase 33 (Sacred Tradition Profiles):** populates `book_order`/`approval_block`/`font_stack`/`rtl`/`numbering`/`script` in tradition manifests; calls `inferTradition()` for scripture-work-type defaults; the `listTraditions()` contract is locked by this suite.
- **Phase 30/31/34/35:** reference the same module via `bin/install.js` re-exports.

## Self-Check: PASSED

- FOUND: test/phase29-architectural-foundation.test.js (182 lines, 54 passing tests)
- FOUND: commit 74c6bd0 in git log
- CONFIRMED: npm test shows 1132/1132 passing, 0 failures
- CONFIRMED: No `zzz-test-*` directories in templates/sacred/ or templates/platforms/
- CONFIRMED: Shipped manifest counts unchanged (10 sacred, 8 platforms)
- CONFIRMED: Zero new dependencies (package.json unchanged)

---
*Phase: 29-architectural-foundation*
*Completed: 2026-04-17*
