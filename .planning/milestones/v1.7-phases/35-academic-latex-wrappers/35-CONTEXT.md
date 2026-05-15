# Phase 35: Academic LaTeX Wrappers - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 35 delivers five thin LaTeX wrapper templates (IEEEtran, acmart, llncs, elsarticle, apa7) that route Scriveno's voice/metadata frontmatter through a `\documentclass{<publisher-class>}` without redistributing the publisher class. The writer provides the TeX distribution (TeX Live / MiKTeX); Scriveno provides the wiring. The `build-print` command gains an academic publisher route: `--platform ieee|acm|lncs|elsevier|apa7` invokes Pandoc with the appropriate wrapper template and produces a `.tex` file the writer compiles locally. Pre-flight class detection (kpsewhich) produces install-guidance errors before any LaTeX compilation is attempted.

</domain>

<decisions>
## Implementation Decisions

### Invocation UX
- Writer targets a publisher class via `--platform ieee|acm|lncs|elsevier|apa7` - extends the existing `--platform` flag in `build-print.md`; no new command or flag surface needed
- Command produces a `.tex` file only (`.manuscript/output/paper-ieee.tex`) - writer compiles with their own TeX Live; Scriveno does not attempt pdflatex
- Output named `paper-{platform}.tex` - parallel to `print-{platform}.pdf` convention
- `academic` work type group is added to `build_print.available` in CONSTRAINTS.json - but only valid when platform is one of the 5 academic publisher values

### Wrapper Template Design
- File naming: `scriveno-ieee.latex`, `scriveno-acm.latex`, `scriveno-lncs.latex`, `scriveno-elsevier.latex`, `scriveno-apa7.latex` - short names, parallel to `scriveno-book.typst`
- Minimal wrapper scope: each wrapper contains only `\documentclass{<CLASS>}` + standard Pandoc boilerplate (body, title, author, abstract, keywords, date, bibliography via CSL, CSL ref macros). Publisher class handles all layout/formatting.
- Core metadata bridge: title, author, abstract, keywords, date, bibliography - same fields as existing `scriveno-academic.latex`. No publisher-specific extensions (affiliation, ORCID) in this phase.

### Missing Class Detection
- Detection mechanism: `kpsewhich IEEEtran.cls` (or equivalent for each class) before producing the `.tex` file - pre-flight check gives a clean, actionable error instead of a mid-build LaTeX failure
- If kpsewhich is absent (no TeX distribution at all): show "No TeX distribution found" error with full install guidance (`brew install basictex` for macOS, TUG URL for other platforms)
- Error message format when class is missing: name the class file, CTAN package, and the tlmgr install command together: `Install IEEEtran.cls - run: tlmgr install ieeetran` (or the MiKTeX equivalent)

### Claude's Discretion
- Exact preamble content of each wrapper beyond the documented minimums
- Whether to add `\usepackage{inputenc}` / `\usepackage[T1]{fontenc}` as safe universal additions (they are safe for all 5 classes - Claude may include them)
- Regression test structure and granularity within the 3-plan breakdown

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/export-templates/scriveno-academic.latex` - existing generic Pandoc template using `\documentclass{article}`. The 5 new wrappers follow the same Pandoc template syntax but swap the document class and strip generic preamble that the publisher class handles itself.
- `commands/scr/build-print.md` - existing build-print command. STEP 1.8 (work-type template selection) is the extension point for LaTeX routing. STEP 2 (prerequisite checks) is the extension point for kpsewhich / TeX detection.
- `data/CONSTRAINTS.json` - `exports.build_print.available` list and `work_type_groups.academic` membership are the two keys to update.

### Established Patterns
- Platform routing: `--platform` flag validated against manifest + behavior switch in STEP 2.5 of build-print.md
- Work-type template routing: STEP 1.8 maps work_type -> template path (Typst); same pattern extends to LaTeX for academic platforms
- Prerequisite check pattern (STEP 2): `command -v pandoc >/dev/null 2>&1` - LaTeX detection follows same pattern for `kpsewhich`
- Missing-tool error format: detailed message with install commands per platform (macOS/Linux/Windows) then "stop"
- Output naming: `.manuscript/output/print-{platform}.pdf` -> new pattern `.manuscript/output/paper-{platform}.tex`

### Integration Points
- `build-print.md` STEP 2: add kpsewhich detection (and TeX distribution detection as fallback)
- `build-print.md` STEP 2.5: add `ieee`, `acm`, `lncs`, `elsevier`, `apa7` as valid platform values, flag them as "LaTeX academic platforms" (not EPUB-only)
- `build-print.md` STEP 1.8: add academic platform branch - if platform is one of 5 academic values, skip Typst template selection and record LaTeX wrapper path
- `build-print.md` STEP 4: add LaTeX route branch - when academic platform, invoke Pandoc with `--template=scriveno-ieee.latex` (etc.) and output `.tex` instead of calling Pandoc's `--pdf-engine=typst`
- `data/CONSTRAINTS.json`: add `academic` to `exports.build_print.available`

</code_context>

<specifics>
## Specific Ideas

- kpsewhich class-to-package mapping for each of the 5 classes:
  - IEEEtran.cls -> `tlmgr install ieeetran`
  - acmart.cls -> `tlmgr install acmart`
  - llncs.cls -> `tlmgr install llncs` (or manual CTAN download - Springer doesn't always have it in TeX Live)
  - elsarticle.cls -> `tlmgr install elsarticle`
  - apa7.cls -> `tlmgr install apa7`
- llncs edge case: Springer LNCS class is sometimes not in TeX Live; error message should note this and link to Springer's author download page as an alternative to tlmgr
- The existing `scriveno-academic.latex` remains unchanged - it's for general academic export, not publisher-specific submission

</specifics>

<deferred>
## Deferred Ideas

- Publisher-specific metadata extensions (author affiliation, ORCID, email) - deferred to a future phase if academic users request them
- Automatic pdflatex compilation attempt - deferred; out of scope, writer controls their TeX workflow
- MiKTeX package manager (`mpm --install`) equivalent guidance - deferred; error messages note TeX Live / tlmgr as primary path

</deferred>
