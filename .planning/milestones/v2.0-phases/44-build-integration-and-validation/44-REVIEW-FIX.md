---
phase: 44-build-integration-and-validation
fixed_at: 2026-04-18T08:12:03Z
review_path: /Users/hprincivil/Projects/scriveno/.planning/milestones/v2.0-phases/44-build-integration-and-validation/44-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 5
skipped: 0
status: all_fixed
---

# Phase 44: Code Review Fix Report

**Fixed at:** 2026-04-18T08:12:03Z
**Source review:** `/Users/hprincivil/Projects/scriveno/.planning/milestones/v2.0-phases/44-build-integration-and-validation/44-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 5
- Fixed: 5
- Skipped: 0

## Fixed Issues

### WR-04: `--skip-validate` Exists in Logic but Not in the Public Surface

**Files modified:** `commands/scr/export.md`, `commands/scr/publish.md`, `docs/command-reference.md`
**Commit:** `565cc5e`
**Applied fix:** Added `--skip-validate` to the export and publish argument hints, usage blocks, and command-reference flags so the documented command surface matches the existing validation bypass logic.

### WR-02: Academic Publish Presets Bypass the Academic Builder

**Files modified:** `commands/scr/publish.md`
**Commit:** `e80f4cd`
**Applied fix:** Reworked the `academic-submission` and `thesis-defense` preset flows to ask for a supported academic platform and route through `/scr:build-print --platform <...>` instead of generic export paths.

### WR-01: Command Reference Still Documents Invalid Export Flags

**Files modified:** `docs/command-reference.md`
**Commit:** `0016c9c`
**Applied fix:** Corrected the canonical export format list to `kdp-package`, `ingram-package`, `submission-package`, and `query-package`, and narrowed `--print-ready` wording to the interior print PDF contract.

### WR-03: Canonical Shipped-Assets Inventory Is Out of Date

**Files modified:** `docs/shipped-assets.md`
**Commit:** `eb7b7ab`
**Applied fix:** Replaced the stale three-template inventory with the actual bundled export-template set currently present under `data/export-templates/`.

### WR-05: Phase 44 Test Coverage Misses the Regressions Above

**Files modified:** `test/phase44-build-integration-validation.test.js`
**Commit:** `b522437`
**Applied fix:** Expanded the regression test to read `publish.md`, assert the real export package ids and print-ready wording, verify academic preset routing, check `--skip-validate` exposure, and compare the shipped-assets inventory against the actual template directory contents.

---

_Fixed: 2026-04-18T08:12:03Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
