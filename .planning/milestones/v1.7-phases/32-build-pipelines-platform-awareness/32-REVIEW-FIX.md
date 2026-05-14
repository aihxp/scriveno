---
phase: 32-build-pipelines-platform-awareness
fixed: 2026-04-17T16:30:00Z
fix_scope: critical_warning
findings_in_scope: 4
fixed: 4
skipped: 0
iteration: 1
status: all_fixed
---

# Phase 32: Code Review Fix Report

**Fixed:** 2026-04-17T16:30:00Z
**Scope:** Critical + Warning
**Findings in scope:** 4
**Fixed:** 4
**Skipped:** 0
**Status:** all_fixed

## Fixes Applied

### CR-01 — FIXED
**File:** `commands/scr/build-print.md:201`
Replaced `validatePlatform(slug)` JS function reference with an inline plain-English slug list check. No JS file reference remains.

### WR-01 — FIXED
**File:** `commands/scr/build-print.md:4,13`
Added `--hardcover` to the frontmatter `argument-hint` and to the Usage code block. Added a Flags section explaining its effect (KDP hardcover 550pp limit).

### WR-02 — FIXED
**File:** `commands/scr/build-ebook.md:215,246`
Renamed `language:` key to `lang:` in the metadata.yaml template (Pandoc's EPUB key). Removed `-V lang={language}` from the Pandoc invocation — lang is now set exclusively via the metadata file.

### WR-03 — FIXED
**File:** `commands/scr/build-ebook.md` (STEP 2)
Added `scriveno-epub.css` existence check immediately after the Pandoc binary check. If the file is missing, the build stops with a clear re-install message.

## Test Results

1266/1266 GREEN after fixes.

## Info Findings (not in scope)

- IN-01: readFile helper catches all errors silently — deferred
- IN-02: No test for EPUB-only platform rejection message — deferred
- IN-03: Cover image check only handles .jpg — deferred
