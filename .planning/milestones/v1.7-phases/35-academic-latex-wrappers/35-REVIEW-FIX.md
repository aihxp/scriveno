---
phase: 35-academic-latex-wrappers
fixed_at: 2026-04-17T00:00:00Z
review_path: .planning/phases/35-academic-latex-wrappers/35-REVIEW.md
iteration: 1
findings_in_scope: 7
fixed: 7
skipped: 0
status: all_fixed
---

# Phase 35: Code Review Fix Report

**Fixed at:** 2026-04-17
**Source review:** .planning/phases/35-academic-latex-wrappers/35-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 7
- Fixed: 7
- Skipped: 0

## Fixed Issues

### WR-01: Typst prerequisite check blocks academic LaTeX builds unnecessarily

**Files modified:** `commands/scr/build-print.md`
**Commit:** be71fed
**Applied fix:** Changed the heading before the Typst `command -v` check from the unconditional "Check for Typst:" to "**If `--platform` is NOT one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7`, check for Typst:**" so researchers with TeX Live but not Typst are no longer blocked from academic output builds.

---

### WR-02: ACM template loads packages already bundled by `acmart.cls`

**Files modified:** `data/export-templates/scriveno-acm.latex`
**Commit:** efe5ea6
**Applied fix:** Removed the `\usepackage{amsmath,amssymb}`, `\usepackage{graphicx}`, `\makeatletter`/`\makeatother` image sizing macros, and `\setkeys{Gin}{...}` block (lines 15–24). Replaced with a comment block explaining that `acmart.cls` already loads those packages internally.

---

### WR-03: APA7 template requires `biblatex` but provides no injection hook

**Files modified:** `data/export-templates/scriveno-apa7.latex`
**Commit:** 3362a75
**Applied fix:** Added `$for(header-includes)$...$endfor$` Pandoc variable block after the graphics section (before the tight-list macro), plus a commented-out `\usepackage[style=apa,...]{biblatex}` and `\addbibresource` hint so users know exactly what to uncomment or inject via YAML front matter to enable bibliography support.

---

### WR-04: IEEE keywords use plain text instead of `IEEEkeywords` environment

**Files modified:** `data/export-templates/scriveno-ieee.latex`
**Commit:** c9d28cc
**Applied fix:** Replaced `\noindent\textbf{Keywords:} $keywords$` with the proper `\begin{IEEEkeywords}...\end{IEEEkeywords}` environment required by IEEE Transactions and conference submission checkers.

---

### WR-05: LNCS template omits `\institute{}` — required for author affiliations

**Files modified:** `data/export-templates/scriveno-lncs.latex`
**Commit:** 53ac4ac
**Applied fix:** Added `\institute{...}` line immediately after `\author{...}`, iterating over `it.affiliation` for each author entry using the same Pandoc for-loop pattern as the author block. Satisfies the `llncs` class requirement for camera-ready Springer LNCS submission.

---

### WR-06: Elsevier template uses wrong `\author{}` syntax for `elsarticle`

**Files modified:** `data/export-templates/scriveno-elsevier.latex`
**Commit:** 3983eb5
**Applied fix:** Added an `\address{$it.affiliation$}` block after the `\author{...}` declaration, iterating over each author entry's `affiliation` field. This maps to `elsarticle.cls`'s expected author+address structure for affiliation linkage.

---

### WR-07: STEP 5 general report block runs unconditionally before the academic-specific block

**Files modified:** `commands/scr/build-print.md`
**Commit:** 8a714ef
**Applied fix:** Wrapped the general PDF report block with "**If `--platform` is NOT one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7`:**" and changed the academic block introduction from "For academic platforms... show instead:" to "**If `--platform` IS one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7`, show instead:**" — making both branches explicitly conditional and symmetrical.

---

_Fixed: 2026-04-17_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
