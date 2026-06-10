---
phase: 34-cross-domain-narrative-poetry-templates
fixed_at: 2026-04-17T22:30:00Z
review_path: .planning/phases/34-cross-domain-narrative-poetry-templates/34-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 34: Code Review Fix Report

**Fixed at:** 2026-04-17T22:30:00Z
**Source review:** .planning/phases/34-cross-domain-narrative-poetry-templates/34-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4
- Fixed: 4
- Skipped: 0

## Fixed Issues

### WR-01: build-ebook STEP 5 reports wrong output path for fixed-layout builds

**Files modified:** `commands/scr/build-ebook.md`
**Commit:** 240199b
**Applied fix:** Replaced the unconditional `ebook.epub` success message and `ls` command in STEP 5 with a conditional block. When `--fixed-layout` is active, reports `ebook-fixed-layout.epub`; otherwise reports `ebook.epub`. Both the user-facing message and the `ls` size command are parameterized.

---

### WR-02: build-smashwords skips scaffold front-matter exclusion (STEP 1.6 not run)

**Files modified:** `commands/scr/build-smashwords.md`
**Commit:** d58b548
**Applied fix:** Added a new STEP 1.6 section between STEP 1.5 and STEP 2, delegating to `/scr:build-ebook` STEP 1.6a-1.6b for scaffold exclusion and GENERATE auto-refresh, and explicitly threading the resulting exclusion list into STEP 3 assembly. This matches the pattern used by `build-ebook.md` and `build-print.md`.

---

### WR-03: build-poetry-submission hardcodes `lang: "en"` regardless of project language

**Files modified:** `commands/scr/build-poetry-submission.md`
**Commit:** ee5d4f2
**Applied fix:** Replaced the literal `lang: "en"` in the STEP 3d metadata.yaml block with `lang: "[language from config.json, default en]"`, matching the config-driven fallback pattern used by `build-ebook.md` and `build-print.md`.

---

### WR-04: build-poetry-submission always emits `--toc` regardless of poem count

**Files modified:** `commands/scr/build-poetry-submission.md`
**Commit:** ee5d4f2
**Applied fix:** Rewrote STEP 4 to count poem units from OUTLINE.md (already parsed in STEP 3b) and apply `--toc --toc-depth=2` only when poem count >= 5, per the style guide's requirement. Provided two explicit Pandoc invocation blocks (with and without TOC flags) and updated the format note to clarify the TOC is only emitted for collections of 5+ poems.

---

_Fixed: 2026-04-17T22:30:00Z_
_Fixer: Claude (code fixer)_
_Iteration: 1_
