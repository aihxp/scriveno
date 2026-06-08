---
description: "Run full publishing pipeline unattended with quality gate (voice-check + continuity-check)."
argument-hint: "--preset <preset>"
---

# /scr:autopilot-publish -- Unattended Publishing Pipeline

You are running the full publishing pipeline autonomously. Your job is to run quality checks, auto-generate any missing non-matter prerequisites, execute the preset pipeline, and report results -- all without asking the writer questions.

## Usage

```
/scr:autopilot-publish --preset <preset>
```

The `--preset` argument is **required**. There is no interactive mode in autopilot -- the writer must specify their destination upfront. Valid presets: `kdp-paperback`, `kdp-ebook`, `query-submission`, `ebook-wide`, `ingram-paperback`, `academic-submission`, `thesis-defense`, `screenplay-query`, `share-pdf`, `share-docx`, `share-epub`, `share-bundle`, `all-formats`, `submission-package`.

Autopilot-publish must not generate front matter or back matter. Those are writer-facing drafting surfaces owned by `/scr:front-matter` and `/scr:back-matter`. If existing publishable front/back matter files are present, the export steps include them. If they are missing, report them as omitted and continue. For a full draft run that should also prepare missing matter, use `/scr:autopilot --matter balanced` before autopilot-publish.

---

## Instruction

### STEP 0: BOOTSTRAP (context-cost protocol)

Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it as your orientation source for project title, work type, phase, current unit, recent activity, and open items. In STEP 1, skip the raw-file loads of `config.json`, `STATE.md`, and `OUTLINE.md` for those fields -- still load `CONSTRAINTS.json` (CONTEXT.md does not surface adaptation rules) and any specific files later steps need.

If CONTEXT.md is missing, stale, or contradicts STATE.md, fall back to the original loads in STEP 1 unchanged. See `docs/context-protocol.md` for the contract.

---

### STEP 1: LOAD CONTEXT AND VALIDATE

Load these project files:

- `.manuscript/config.json` -- to get `work_type`, title, author
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) -- to check `publishing_prerequisites` and export availability
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

**Quality gate policy (D-09):** The quality gate is advisory and never blocks. Always proceed to the export pipeline, including when the voice check or continuity check finds problems. autopilot-publish is the unattended path: it does not stop to ask the writer and it does not abort the run. The gate exists to make problems visible, not to veto. One case gets extra visibility: when the voice score is below 60 (the voice-checker's "Reads AI-generated / do not proceed" band), flag it prominently in the quality-gate summary, write the full voice-check report to the output directory, and list it as the top issue in the final completion report with an explicit recommendation to re-draft the flagged units before publishing. Still finish the export so the run stays unattended; the writer decides whether to publish the package or re-draft after reading the report.

---

### STEP 3: GENERATE NON-MATTER PREREQUISITES

Auto-generate any missing non-matter prerequisites required by the chosen preset. Do not ask -- just generate them. Do not generate front matter or back matter.

**Prerequisites by preset:**

| Preset | Needs |
|--------|-------|
| kdp-paperback | (none) |
| kdp-ebook | (none) |
| query-submission | blurb, synopsis, query-letter |
| ebook-wide | (none) |
| ingram-paperback | (none) |
| academic-submission | (none) |
| thesis-defense | (none) |
| screenplay-query | blurb, synopsis, query-letter |
| share-pdf | (none) |
| share-docx | (none) |
| share-epub | (none) |
| share-bundle | (none) |
| all-formats | (none) |
| submission-package | synopsis, query-letter |

For each prerequisite the preset needs:

| Prerequisite | Check | Generate Command |
|-------------|-------|-----------------|
| blurb | `.manuscript/output/blurb.md` exists | `/scr:blurb` |
| synopsis | Any `.manuscript/marketing/SYNOPSIS-*.md` file exists | `/scr:synopsis` |
| query-letter | `.manuscript/marketing/QUERY-LETTER.md` exists | `/scr:query-letter` |

Show progress as each prerequisite is generated:

```
Generating Prerequisites
========================
Step 1/2: Generating blurb... done
Step 2/2: Generating synopsis... done
```

Before export, record front/back matter status:

- Front matter: present/missing/omitted
- Back matter: present/missing/omitted

If either is missing for a retail, print, wide, or thesis preset, include a note in the final report that the package was built without it and suggest `/scr:front-matter` or `/scr:back-matter` in `Next commands:`.

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
  (none)

Matter:
  - Front matter: missing, not generated by autopilot-publish
  - Back matter: present, included by export

Exported:
  - manuscript-print.pdf (interior, 6x9, ~312 pages)
  - kdp-package/ (cover specs, metadata, upload checklist)

Quality Reports:
  - Voice check: .manuscript/full-VOICE-CHECK-REPORT.md
  - Continuity check: .manuscript/FULL-CONTINUITY-REPORT.md

Errors:
  (none)

Review Checklist:
  1. Review quality warnings in the reports above
  2. Review the interior PDF at .manuscript/output/manuscript-print.pdf
  3. Review `.manuscript/output/kdp-package/cover-specs.md` and place the finished print cover at `.manuscript/build/paperback-cover.pdf`
  4. Upload to https://kdp.amazon.com
```

After this report and the automation status, the final visible section must be the `Next commands:` block from the Response Contract. Do not end with the review checklist alone. Include one to four runnable Scriveno commands such as `/scr:voice-check`, `/scr:continuity-check`, `/scr:export`, `/scr:publish`, or `/scr:next`, depending on what happened.

If any steps failed, show them in the "Errors" section with actionable fix instructions (e.g., "Pandoc not installed -- run `brew install pandoc` and re-run").

---

## Automation Status

Every progress update and final response must include a compact status trail. This is how the writer can tell whether Scriveno auto-chained commands, spawned agents, or only updated local files.

```text
Automation status:
Trigger: /scr:autopilot-publish --preset {preset}
Auto-invoked commands:
- /scr:voice-check: yes/no
- /scr:continuity-check: yes/no
- /scr:cover-art: yes/no
- /scr:export: {count} run(s)
Spawned agents:
- voice-checker: {count}
- continuity-checker: {count}
Local operations:
- prerequisite scan: yes/no
- matter generation: none
- quality report files written: yes/no
- export package files written: {count}
Quality gate:
- status: warn-only
- reason: autopilot-publish reports quality findings but continues to export
```

If a quality command cannot spawn its native agent type, use the installed agent prompt in a fresh context and say `prompt-run fallback used` in the status block.

## Response Contract

Every writer-facing response must end with one to four next-command suggestions. Each suggestion must include a short explanation of what that path will do.

The final visible section of every writer-facing response must be the `Next commands:` block. This applies to successful completion, partial completion, blocked, stopped, validation-failed, and prerequisite-missing responses. Do not end with only a summary, report, checklist, external action, upload instruction, or prose-only options.

Use the invocation style for the active runtime when writing command suggestions. Source command IDs use `/scr:*`; Claude Code installed commands use `/scr-*`; Codex installed skills use `$scr-*`. Suggest only runnable Scriveno commands that exist in the installed command surface. Do not invent adjacent workflow names.

This requirement applies after completion, quality warnings, skipped prerequisites, and failed export steps. The final visible section of the response must be `Next commands:`. Never end autopilot-publish with only a checklist, external upload instruction, or prose-only options.

Use this format:

```markdown
Next commands:
- `/scr:...`: One short sentence explaining what this path will do.
- `/scr:...`: One short sentence explaining what this alternate path will do.
```

If exactly one path is clearly best, provide one suggestion. If two, three, or four useful paths exist, show them as alternatives. Do not force a linear path when the writer has a real choice.

If the writer seems unsure or no specific next command is obvious, include this default option:

```markdown
Next commands:
- `/scr:next`: Inspect the project state and choose the right next step.
```

If the command stops because a prerequisite is missing, suggest the command that fixes the prerequisite. Keep every explanation practical and writer-facing.

## Tone

Autopilot is the "set it and forget it" mode. Be concise in progress updates -- one line per step. Save the detail for the final report. The writer chose autopilot because they trust the pipeline and want results, not conversation.
