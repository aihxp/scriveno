---
phase: 42-cover-asset-contract
verified: 2026-04-18T06:59:31Z
status: passed
score: 6/6
overrides_applied: 0
re_verification: false
---

# Phase 42: Cover Asset Contract - Verification Report

**Phase Goal:** Define one canonical cover asset contract for ebook, paperback, and hardcover deliverables so build and publishing flows can reference finished cover files without guesswork.

**Verified:** 2026-04-18T06:59:31Z
**Status:** passed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Scriveno now defines one canonical build-surface cover contract | [x] VERIFIED | `commands/scr/cover-art.md`, `commands/scr/publish.md`, and `docs/publishing.md` all point at `.manuscript/build/` |
| 2 | Ebook, paperback, and hardcover cover deliverables are now distinct files | [x] VERIFIED | Canonical files are `.manuscript/build/ebook-cover.jpg`, `.manuscript/build/paperback-cover.pdf`, and `.manuscript/build/hardcover-cover.pdf` |
| 3 | Prompt-generation outputs stay separate from final deliverables | [x] VERIFIED | `cover-art.md` keeps prompt outputs in `.manuscript/illustrations/cover/` and final files in `.manuscript/build/` |
| 4 | Editable source files are part of the handoff contract | [x] VERIFIED | `cover-art.md` and `docs/publishing.md` require `.manuscript/build/source/` |
| 5 | Focused regression coverage now fails if the asset contract drifts | [x] VERIFIED | `test/phase42-cover-asset-contract.test.js` locks canonical asset paths and source/staging boundaries |
| 6 | The repaired asset contract passes both targeted and full-suite verification | [x] VERIFIED | Focused `node --test ...` slice passed, and `npm test` passed at 1590/1590 |

**Score:** 6/6 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `commands/scr/cover-art.md` | Canonical cover deliverable contract | [x] VERIFIED | Distinguishes ebook, paperback, hardcover, source files, and prompt outputs |
| `commands/scr/publish.md` | Publish-surface cover asset references | [x] VERIFIED | References canonical build files instead of a vague `cover.*` surface |
| `docs/publishing.md` | User-facing cover deliverable guide | [x] VERIFIED | Documents the same three-file build contract |
| `test/phase42-cover-asset-contract.test.js` | Regression coverage for asset-path drift | [x] VERIFIED | Asserts canonical build files and source/staging separation |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| COV-01 | 42-01, 42-02 | Canonical `.manuscript/build/` cover asset contract | [x] SATISFIED | All cover-facing docs now share the same build surface |
| COV-02 | 42-01, 42-02 | Ebook front-only assets distinguished from print wraps | [x] SATISFIED | Cover docs now separate ebook front cover from paperback/hardcover wrap PDFs |
| COV-03 | 42-01, 42-03 | Source-file handoff documented for future revisions | [x] SATISFIED | `.manuscript/build/source/` is part of the contract and locked by tests |

### Human Verification Required

None. Phase 42 is covered by command/doc inspection and automated regression results.

## Gaps Summary

No active gaps found in the Phase 42 scope. Format-specific print truth and build/export integration remain Phase 43 and 44 work.

---

_Verified: 2026-04-18T06:59:31Z_  
_Verifier: Codex (gsd-verifier)_
