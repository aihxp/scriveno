---
description: "Run full publishing pipeline unattended with quality gate (voice-check + continuity-check)."
argument-hint: "--preset <preset> [--front-level <minimum|balanced|maximum|skip>] [--back-level <minimum|balanced|maximum|skip>]"
---

# /scr:autopilot-publish -- Unattended Publishing Pipeline

You are running the full publishing pipeline autonomously. Your job is to run quality checks, auto-generate any missing prerequisites, execute the preset pipeline, and report results -- all without asking the writer questions.

## Usage

```
/scr:autopilot-publish --preset <preset>
```

The `--preset` argument is **required**. There is no interactive mode in autopilot -- the writer must specify their destination upfront. Valid presets: `kdp-paperback`, `kdp-ebook`, `query-submission`, `ebook-wide`, `ingram-paperback`, `academic-submission`, `thesis-defense`, `screenplay-query`, `share-pdf`, `share-docx`, `share-epub`, `share-bundle`, `all-formats`, `submission-package`.

`--front-level` and `--back-level` control how much front/back matter is generated when the preset includes those steps. Both default to **balanced** for retail and academic presets, **minimum** for share-* and all-formats, and **skip** for query-submission, screenplay-query, and submission-package (the package itself does not need book front/back matter). Pass `skip` to suppress the corresponding generation step entirely. The default is applied silently per the table below; the writer only needs to pass these flags to override.

---

## Instruction

### STEP 0: BOOTSTRAP (context-cost protocol)

Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it as your orientation source for project title, work type, phase, current unit, recent activity, and open items. In STEP 1, skip the raw-file loads of `config.json`, `STATE.md`, and `OUTLINE.md` for those fields -- still load `CONSTRAINTS.json` (CONTEXT.md does not surface adaptation rules) and any specific files later steps need.

If CONTEXT.md is missing, stale, or contradicts STATE.md, fall back to the original loads in STEP 1 unchanged. See `docs/context-protocol.md` for the contract.

---

### STEP 1: LOAD CONTEXT AND VALIDATE

Load these project files:

- `.manuscript/config.json` -- to get `work_type`, title, author
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) -- to check `publishing_prerequisites` and export availability
- `.manuscript/OUTLINE.md` -- to verify draft completeness

**Validate preset:** Check that the `--preset` value matches a known preset name. If invalid:
> Unknown preset "[value]". Available presets: kdp-paperback, kdp-ebook, query-submission, ebook-wide, ingram-paperback, academic-submission, thesis-defense, screenplay-query.

Then **stop**.

**Check draft completeness:** Verify all units in OUTLINE.md have corresponding draft files. If the draft is incomplete:
> **Warning:** Manuscript is incomplete. Missing units: [list]. Proceeding with available content -- exported files will have gaps.

Continue anyway (autopilot does not stop for incomplete drafts -- it warns and proceeds).

---

### STEP 2: QUALITY GATE (per D-09)

Run quality checks before the export pipeline. The quality gate **warns but does not block** -- issues are logged for the writer to review after export completes.

#### 2a. Voice Check

Check if `.manuscript/STYLE-GUIDE.md` exists:

- **If STYLE-GUIDE.md exists:** Run `/scr:voice-check` on the full manuscript. Capture the voice fidelity score and any issues found.
- **If STYLE-GUIDE.md does not exist:** Skip voice check with a note:
  > Voice check skipped -- no STYLE-GUIDE.md found. Run `/scr:profile-writer` to enable voice checking.

#### 2b. Continuity Check

Run `/scr:continuity-check` on the full manuscript. Capture any contradictions or inconsistencies found.

#### 2c. Quality Gate Summary

Show the quality gate results before proceeding:

```
Quality Gate
============
Voice check:      3 warnings (score: 82/100 PASS)
Continuity check: 1 warning

Proceeding with export. Review full reports after completion.
```

**Quality gate policy (D-09):** Always proceed to the export pipeline regardless of quality gate results. The quality gate is advisory -- it gives the writer information, not a veto. Even if voice check scores FAIL (below 60) or continuity check finds major contradictions, log the warnings and continue.

---

### STEP 3: GENERATE PREREQUISITES

Auto-generate any missing prerequisites required by the chosen preset. Do not ask -- just generate them.

**Prerequisites by preset:**

| Preset | Needs |
|--------|-------|
| kdp-paperback | front-matter, back-matter |
| kdp-ebook | front-matter, back-matter |
| query-submission | blurb, synopsis, query-letter |
| ebook-wide | front-matter, back-matter |
| ingram-paperback | front-matter, back-matter |
| academic-submission | (none) |
| thesis-defense | front-matter, back-matter |
| screenplay-query | blurb, synopsis, query-letter |
| share-pdf | (none) |
| share-docx | (none) |
| share-epub | (none) |
| share-bundle | (none) |
| all-formats | (none) |
| submission-package | synopsis, query-letter, back-matter |

For each prerequisite the preset needs:

| Prerequisite | Check | Generate Command |
|-------------|-------|-----------------|
| front-matter | `.manuscript/front-matter/` has files | `/scr:front-matter --level <resolved-front-level>` (resolve by `--front-level` or the per-preset default; if `skip`, do not run) |
| back-matter | `.manuscript/back-matter/` has files | `/scr:back-matter --level <resolved-back-level>` (resolve by `--back-level` or the per-preset default; if `skip`, do not run) |
| blurb | `.manuscript/output/blurb.md` exists | `/scr:blurb` |
| synopsis | Any `.manuscript/marketing/SYNOPSIS-*.md` file exists | `/scr:synopsis` |
| query-letter | `.manuscript/marketing/QUERY-LETTER.md` exists | `/scr:query-letter` |

Show progress as each prerequisite is generated:

```
Generating Prerequisites
========================
Step 1/3: Generating front matter... done (7 elements)
Step 2/3: Generating back matter... done (5 elements)
Step 3/3: Cover art... already exists, skipping
```

---

### STEP 4: RUN PRESET PIPELINE

Execute the preset pipeline from `/scr:publish` (same pipeline definitions). Show progress for each step:

```
Export Pipeline: kdp-paperback
===============================
Step 1/2: Exporting print-ready PDF... done (manuscript-print.pdf, 312 pages)
Step 2/2: Building KDP package... done (kdp-package/)
```

Run each export command in the preset's pipeline. If an export step fails (e.g., Pandoc not installed, Typst not found), log the error and continue to the next step if possible. Report all failures in the final summary.

---

### STEP 5: FINAL REPORT

Show a complete summary of everything that happened:

```
Autopilot Publish Complete
==========================
Preset: kdp-paperback
Duration: ~3 minutes

Quality Gate:
  Voice check:      3 warnings (score: 82/100 PASS)
  Continuity check: 1 warning

Generated Prerequisites:
  - Front matter (7 elements)
  - Back matter (5 elements)

Exported:
  - manuscript-print.pdf (interior, 6x9, ~312 pages)
  - kdp-package/ (cover specs, metadata, upload checklist)

Quality Reports:
  - Voice check: .manuscript/full-VOICE-CHECK-REPORT.md
  - Continuity check: .manuscript/FULL-CONTINUITY-REPORT.md

Errors:
  (none)

Next Steps:
  1. Review quality warnings in the reports above
  2. Review the interior PDF at .manuscript/output/manuscript-print.pdf
  3. Review `.manuscript/output/kdp-package/cover-specs.md` and place the finished print cover at `.manuscript/build/paperback-cover.pdf`
  4. Upload to https://kdp.amazon.com
```

If any steps failed, show them in the "Errors" section with actionable fix instructions (e.g., "Pandoc not installed -- run `brew install pandoc` and re-run").

---

## Tone

Autopilot is the "set it and forget it" mode. Be concise in progress updates -- one line per step. Save the detail for the final report. The writer chose autopilot because they trust the pipeline and want results, not conversation.
