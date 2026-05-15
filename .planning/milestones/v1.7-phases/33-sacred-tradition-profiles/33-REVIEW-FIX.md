---
phase: 33-sacred-tradition-profiles
fixed: 2026-04-17T17:30:00Z
fix_scope: warning
findings_in_scope: 4
fixed: 4
skipped: 0
iteration: 1
status: all_fixed
---

# Phase 33: Code Review Fix Report

**Fixed:** 2026-04-17T17:30:00Z
**Scope:** Warning (0 Critical found)
**Findings in scope:** 4
**Fixed:** 4
**Skipped:** 0
**Status:** all_fixed

## Fixes Applied

### WR-01 - FIXED
**File:** `commands/scr/front-matter.md:483`
Changed `Read config.json sacred.tradition` (nested path) to `Read the top-level tradition: key from .manuscript/config.json` - consistent with STEP 3.5 and both build commands.

### WR-02 - FIXED
**Files:** `templates/sacred/protestant/manifest.yaml`, `pali/manifest.yaml`, `tibetan/manifest.yaml`, `sanskrit/manifest.yaml`
Changed `label: "none"` to `label: null` in approval_block for all 4 non-required traditions. Prevents a consumer from rendering "The **none** (tradition approval) is required" if it formats the label before checking `required`.

### WR-03 - FIXED
**File:** `templates/sacred/tibetan/manifest.yaml`
Changed `numbering.format` from `chapter:verse` to `toh:folio` - the Tibetan Buddhist canon (Kangyur/Tengyur) uses Tohoku/Derge folio references, not chapter:verse. Separator remains `.`.

### WR-04 - FIXED
**File:** `data/CONSTRAINTS.json`
Added `"requires": ["config.tradition"]` to the `sacred-verse-numbering` command entry, consistent with the dependency surfaced by the command's STEP 1 halt when `tradition:` is absent.

## Test Results

1427/1427 GREEN after fixes.

## Info Findings (not in scope)

- IN-01: Islamic Hafs and Warsh manifests are functionally identical - warsh-specific verse-count differences not modeled; deferred
- IN-02: orthodox/manifest.yaml uses script: latin - Greek-source editions will not get automatic `el` lang tag; deferred
- IN-03: Sacred Adaptation element-selection table uses coarse groups (christian, islamic) while runtime uses fine-grained slugs; deferred to Phase 34+
