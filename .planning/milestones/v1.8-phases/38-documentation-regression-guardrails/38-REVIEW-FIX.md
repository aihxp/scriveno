---
phase: 38-documentation-regression-guardrails
fixed_at: 2026-04-18T04:32:00Z
review_path: .planning/milestones/v1.8-phases/38-documentation-regression-guardrails/38-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 5
skipped: 0
status: all_fixed
---

# Phase 38: Code Review Fix Report

**Fixed at:** 2026-04-18T04:32:00Z
**Source review:** .planning/milestones/v1.8-phases/38-documentation-regression-guardrails/38-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 5
- Fixed: 5
- Skipped: 0

## Fixed Issues

### CR-01: Proposal paths and commit guidance use unsanitized proposal names

**Files modified:** `commands/scr/editor-review.md`
**Applied fix:** Added an explicit slug-normalization contract before proposal file access, required proposal artifacts to stay under `.manuscript/proposals/` using the sanitized slug only, and removed raw git shell command snippets that interpolated user-controlled names.

---

### WR-01: Back matter loads a draft directory that the rest of Scriveno no longer uses

**Files modified:** `commands/scr/back-matter.md`
**Applied fix:** Switched the draft-loading guidance from the stale `.manuscript/drafts/` directory to the canonical `.manuscript/*-DRAFT.md` contract used by the rest of the workflow.

---

### WR-02: Editor-review and submit disagree on the editor notes contract

**Files modified:** `commands/scr/editor-review.md`
**Applied fix:** Standardized the standard review output on `{N}-EDITOR-NOTES.md` so it matches the prerequisite expected by `commands/scr/submit.md`.

---

### WR-03: Writer mode still exposes file paths and git operations in editor-review

**Files modified:** `commands/scr/editor-review.md`
**Applied fix:** Gated file-path references behind `developer_mode`, replaced writer-mode git instructions with save-only guidance, and kept any optional git-bookkeeping mention strictly developer-mode and explicit-opt-in.

---

### IN-01: README trust-surface counts and version text are stale

**Files modified:** `README.md`
**Applied fix:** Updated the public command/work-type counts and package version text to match the current shipped surface.

## Verification

- `node --test test/command-surface-coherence.test.js test/commands.test.js test/installer.test.js` -> passing
- `npm test` -> 1540/1540 passing
- `rg` audit confirmed the removed risky `git commit` guidance, stale draft directory path, and stale README counts/version strings are gone

---

_Fixed: 2026-04-18T04:32:00Z_
_Fixer: Codex (gsd-code-review-fix)_
_Iteration: 1_
