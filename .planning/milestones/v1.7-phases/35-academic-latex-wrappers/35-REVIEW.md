---
phase: 35-academic-latex-wrappers
reviewed: 2026-04-17T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - data/export-templates/scriveno-ieee.latex
  - data/export-templates/scriveno-acm.latex
  - data/export-templates/scriveno-lncs.latex
  - data/export-templates/scriveno-elsevier.latex
  - data/export-templates/scriveno-apa7.latex
  - commands/scr/build-print.md
  - data/CONSTRAINTS.json
  - test/phase35-academic-latex-wrappers.test.js
findings:
  critical: 0
  warning: 0
  info: 1
  total: 1
status: clean
---

# Phase 35: Code Review Report (Iteration 2)

**Reviewed:** 2026-04-17
**Depth:** standard
**Files Reviewed:** 8
**Status:** clean

## Summary

This is iteration 2 of the auto-fix loop for Phase 35 (academic LaTeX wrappers). All 7 warnings identified in iteration 1 have been correctly addressed. No new bugs or security issues were introduced by the fixes.

**Verification of the 7 previous warnings:**

- **WR-01** (Typst check gated behind non-academic condition): `build-print.md` line 242 now conditions the Typst prerequisite check on `--platform` not being one of the five academic platforms - confirmed fixed.
- **WR-02** (ACM no longer loads amsmath/amssymb/graphicx): `scriveno-acm.latex` lines 15-17 replace the duplicate `\usepackage` calls with a comment explaining acmart.cls loads these internally - confirmed fixed.
- **WR-03** (APA7 has `$for(header-includes)$` block and commented biblatex hint): `scriveno-apa7.latex` lines 32-38 contain both - confirmed fixed.
- **WR-04** (IEEE keywords use `\begin{IEEEkeywords}...\end{IEEEkeywords}`): `scriveno-ieee.latex` lines 66-68 - confirmed fixed.
- **WR-05** (LNCS has `\institute{}` block mapping `it.affiliation`): `scriveno-lncs.latex` line 53 - confirmed fixed.
- **WR-06** (Elsevier has `\address{$it.affiliation$}` block after `\author{}`): `scriveno-elsevier.latex` lines 53-55 - confirmed fixed.
- **WR-07** (STEP 5 PDF report block explicitly conditional on non-academic platforms): `build-print.md` line 543 - confirmed fixed.

One informational observation is noted below; it does not affect correctness and was not introduced by the iteration 2 fixes.

## Info

### IN-01: ACM keywords rendered as plain text rather than via `\keywords{}` macro

**File:** `data/export-templates/scriveno-acm.latex:59-61`
**Issue:** The ACM template renders keywords using `\noindent\textbf{Keywords:} $keywords$` in the document body, matching the pattern used in the LNCS and Elsevier templates. The `acmart` class provides a `\keywords{}` macro that should appear in the preamble before `\maketitle`; this macro feeds into ACM's metadata pipeline (CCS concepts, digital library indexing). Using plain bold text in the body bypasses that integration. This is a pre-existing design choice shared with LNCS and Elsevier and does not cause a compile error, but ACM submissions using the full acmart workflow will lack properly registered keyword metadata.
**Fix:** Replace the in-body keyword block with a preamble `\keywords{}` call before `\begin{document}`, and remove the `$if(keywords)$` block from the body:

```latex
% In preamble (before \begin{document}), after \date{}:
$if(keywords)$
\keywords{$keywords$}
$endif$
```

This is a low-priority improvement for a future phase; the current output is functional for most submission workflows.

---

_Reviewed: 2026-04-17_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
