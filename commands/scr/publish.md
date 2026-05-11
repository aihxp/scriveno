---
description: "Publishing wizard or preset-driven pipeline. Chains export commands based on destination."
argument-hint: "[--preset <preset>] [--all] [--skip-validate]"
---

# /scr:publish -- Publishing Wizard

You are the publishing wizard. Your job is to turn a completed manuscript into publication-ready deliverables by chaining the right commands based on the writer's destination.

## Usage

```
/scr:publish [--preset <preset>] [--all] [--skip-validate]
```

- `--preset <preset>` -- Run a named preset pipeline without questions
- `--all` -- Run every preset available for the current work type
- `--skip-validate` -- Skip the scaffold-marker gate (not recommended)
- No arguments -- Run the interactive wizard

---

## Instruction

### STEP 1: LOAD CONTEXT

Load these project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, language
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) -- to check `publishing_prerequisites`, `exports` section, and work type group
- `.manuscript/OUTLINE.md` -- to verify draft completeness

Determine the work type group from CONSTRAINTS.json `work_type_groups` so you can check which presets and commands are available.

---

### STEP 1.5: VALIDATE MANUSCRIPT

**Check for scaffold markers in `.manuscript/drafts/`.**

Scan all `.md` files in `.manuscript/drafts/` for:
- Lines containing `[Fill in` (covers `[Fill in:]`, `[Fill in or delete:]`)
- Lines containing `[Delete if not applicable:]`
- Lines containing `Alternate 1:` or `Alternate 2:`
- Files with more than one `# ` (top-level H1) heading

**Note:** `{{VAR}}` tokens are NOT scaffold markers and must not be flagged. They are writer content placeholders, out of scope for this gate.

**If `--skip-validate` was passed:**

> **Warning: Validate gate skipped (`--skip-validate`). Your manuscript may contain
> unresolved scaffold markers. Run `/scr:validate` to check before submitting.**

Proceed to STEP 2.

**If markers are found** (and `--skip-validate` was not passed):

> **Publishing blocked: unresolved scaffold markers found.**
>
> [list each as: `path/to/file.md:LINE_NUMBER: marker text`]
>
> **Fix:** Run `/scr:cleanup --apply` to remove scaffold markers, or manually
> edit the listed files, then re-run this publish command.

Then **stop** -- do not proceed to STEP 2.

If no markers found: proceed to STEP 2.

---

### STEP 1.6: FRONT-MATTER GATE

**1.6a -- Scaffold exclusion**

Check if `.manuscript/front-matter/` exists.

If the directory does not exist:
> **Note:** No front matter found -- run `/scr:front-matter` first if you want publication front matter included.

Proceed to 1.6b.

If the directory exists, scan all `.md` files in `.manuscript/front-matter/`. For each file, check the first 10 lines for a YAML block containing `scaffold: true`. Build a scaffold exclusion list of the paths of all files where `scaffold: true` is found.

If any files were added to the scaffold exclusion list, note them for the assembly step and show:
> **Note:** [N] scaffold front-matter element(s) will be excluded from this export:
>   - `.manuscript/front-matter/12-preface.md` (scaffold: true -- edit and set scaffold: false to include)
>
> To include a scaffold element, open the file and change `scaffold: true` to `scaffold: false`.

If no scaffold files were found, show no note.

**1.6b -- GENERATE element auto-refresh**

If `.manuscript/front-matter/` does not exist, skip auto-refresh and proceed to STEP 2.

If `.manuscript/WORK.md` does not exist, skip auto-refresh and proceed to STEP 2.

Compare the modification timestamp of `.manuscript/WORK.md` against each of the following GENERATE front-matter files:
- `.manuscript/front-matter/01-half-title.md`
- `.manuscript/front-matter/03-title-page.md`
- `.manuscript/front-matter/04-copyright.md`
- `.manuscript/front-matter/07-toc.md`

To compare timestamps, use the appropriate command for the platform:
- macOS: `stat -f %m <file>`
- Linux: `stat -c %Y <file>`
- Windows: `(Get-Item '<file>').LastWriteTimeUtc.Ticks`
- If timestamp comparison is not possible, assume WORK.md is newer and regenerate.

If WORK.md is newer than ANY of those 4 files, or if ANY of those 4 files do not exist:
Re-run the GENERATE step from `/scr:front-matter` for elements 1, 3, 4, and 7 only (half-title, title page, copyright page, TOC) using current WORK.md metadata. Regenerate all four even if only one triggered the condition. Do NOT regenerate scaffold elements (5, 6, 11, 12, 13) or any other elements.

If WORK.md is not newer than all 4 files and all 4 files exist: skip regeneration silently.

Proceed to STEP 2.

---

### STEP 2: ROUTE

**If `--preset` is given:** Validate the preset name against the known presets below. If valid, jump to STEP 4 (preset pipeline). If invalid, show the list of available presets and stop.

**If `--all` is given:** Run every preset available for the current work type group. Warn the writer this will take a while. Run each preset sequentially, showing progress between them.

**If no arguments:** Run the interactive wizard (STEP 3).

---

### STEP 3: INTERACTIVE WIZARD

#### 3a. Check Prerequisites (per D-07)

Check each publishing prerequisite and show a readiness checklist:

```
Publishing Readiness Checklist
==============================
[x] Complete draft (all units drafted)
[ ] Front matter -- run /scr:front-matter
[x] Back matter
[ ] Blurb -- run /scr:blurb
[ ] Synopsis -- run /scr:synopsis
[x] Cover art

Missing 3 prerequisites. Generate them now? (yes/no)
```

**How to check each prerequisite:**

| Prerequisite | How to Check | Fix Command |
|-------------|-------------|-------------|
| Complete draft | All units in OUTLINE.md have corresponding draft files in `.manuscript/drafts/body/` | `/scr:draft` (draft remaining units) |
| Front matter | `.manuscript/front-matter/` directory has files | `/scr:front-matter` |
| Back matter | `.manuscript/back-matter/` directory has files | `/scr:back-matter` |
| Blurb | `.manuscript/output/blurb.md` exists | `/scr:blurb` |
| Synopsis | Any `.manuscript/marketing/SYNOPSIS-*.md` file exists | `/scr:synopsis` |
| Cover art | `.manuscript/build/ebook-cover.jpg` or `.png`, plus `.manuscript/build/paperback-cover.pdf` for print presets | `/scr:cover-art` |

**Canonical cover build surface:** Scriven's cover handoff contract lives under `.manuscript/build/`:
- Ebook front cover: `.manuscript/build/ebook-cover.jpg` (or `.png`)
- Paperback full wrap: `.manuscript/build/paperback-cover.pdf`
- Hardcover case wrap: `.manuscript/build/hardcover-cover.pdf`

**Critical prerequisite:** If the draft is not complete (missing body units), warn the writer:
> Your draft is not complete. Missing units: [list]. Run `/scr:next` to continue drafting, or proceed anyway with incomplete manuscript.

**Non-critical prerequisites:** If the writer says "yes" to generating missing items, run each missing command in order before proceeding.

#### 3b. Choose Destination

After prerequisites are resolved, ask:

> Where are you publishing?
>
> 1. **kdp-paperback** -- Amazon KDP print (6x9 interior PDF + package)
> 2. **kdp-ebook** -- Amazon Kindle (EPUB)
> 3. **ebook-wide** -- All ebook stores (EPUB + PDF)
> 4. **query-submission** -- Agent/publisher query (blurb + synopsis + query letter)
> 5. **ingram-paperback** -- IngramSpark bookstore distribution
> 6. **academic-submission** -- Journal/academic source build via supported academic platform
> 7. **thesis-defense** -- Thesis/dissertation source build with front/back matter and supported academic platform
> 8. **screenplay-query** -- Screenplay agent query (Fountain + FDX + package)
> 9. **custom** -- Choose specific export formats

Map the answer to a preset and proceed to STEP 4.

If "custom," ask the writer which formats they want and build a custom pipeline.

---

### STEP 4: PRESET PIPELINES (per D-08)

Run the selected preset pipeline. For each step: check if the output already exists, skip if so (tell the writer), run if missing.

Show progress for each step:
```
Publishing: kdp-paperback
==========================
Step 1/4: Checking front matter... already exists, skipping
Step 2/4: Generating back matter...
Step 3/4: Exporting print-ready PDF...
Step 4/4: Building KDP package...
```

#### Locked Presets (D-08)

**kdp-paperback** -- Amazon KDP print-on-demand
| Step | Command | Condition |
|------|---------|-----------|
| 1 | `/scr:front-matter` | If `.manuscript/front-matter/` is empty |
| 2 | `/scr:back-matter` | If `.manuscript/back-matter/` is empty |
| 3 | `/scr:export --format pdf --print-ready` | Always (produces interior PDF) |
| 4 | `/scr:export --format kdp-package` | Always (produces KDP upload package) |

**kdp-ebook** -- Amazon Kindle ebook
| Step | Command | Condition |
|------|---------|-----------|
| 1 | `/scr:front-matter` | If `.manuscript/front-matter/` is empty |
| 2 | `/scr:back-matter` | If `.manuscript/back-matter/` is empty |
| 3 | `/scr:export --format epub` | Always |

**query-submission** -- Traditional publishing query
| Step | Command | Condition |
|------|---------|-----------|
| 1 | `/scr:blurb` | If `.manuscript/output/blurb.md` missing |
| 2 | `/scr:synopsis` | If no `.manuscript/marketing/SYNOPSIS-*.md` file exists |
| 3 | `/scr:query-letter` | If `.manuscript/marketing/QUERY-LETTER.md` missing |
| 4 | `/scr:export --format query-package` | Always |

**ebook-wide** -- All major ebook stores
| Step | Command | Condition |
|------|---------|-----------|
| 1 | `/scr:front-matter` | If `.manuscript/front-matter/` is empty |
| 2 | `/scr:back-matter` | If `.manuscript/back-matter/` is empty |
| 3 | `/scr:export --format epub` | Always |
| 4 | `/scr:export --format pdf` | Always (manuscript PDF for stores that accept it) |

#### Additional Presets

**ingram-paperback** -- IngramSpark bookstore distribution
| Step | Command | Condition |
|------|---------|-----------|
| 1 | `/scr:front-matter` | If `.manuscript/front-matter/` is empty |
| 2 | `/scr:back-matter` | If `.manuscript/back-matter/` is empty |
| 3 | `/scr:export --format pdf --print-ready` | Always |
| 4 | `/scr:export --format ingram-package` | Always |

**academic-submission** -- Journal or academic press
| Step | Command | Condition |
|------|---------|-----------|
| 1 | Ask the writer which supported academic platform they need: `ieee`, `acm`, `lncs`, `elsevier`, or `apa7` | If not already specified |
| 2 | `/scr:build-print --platform <selected academic platform>` | Always |

**thesis-defense** -- Thesis or dissertation
| Step | Command | Condition |
|------|---------|-----------|
| 1 | `/scr:front-matter` | If `.manuscript/front-matter/` is empty |
| 2 | `/scr:back-matter` | If `.manuscript/back-matter/` is empty |
| 3 | Ask the writer which supported academic platform best matches the institution requirement: `ieee`, `acm`, `lncs`, `elsevier`, or `apa7` | If not already specified |
| 4 | `/scr:build-print --platform <selected academic platform>` | Always |

**screenplay-query** -- Screenplay agent/manager submission
| Step | Command | Condition |
|------|---------|-----------|
| 1 | `/scr:blurb` | If `.manuscript/output/blurb.md` missing |
| 2 | `/scr:synopsis` | If no `.manuscript/marketing/SYNOPSIS-*.md` file exists |
| 3 | `/scr:query-letter` | If `.manuscript/marketing/QUERY-LETTER.md` missing |
| 4 | `/scr:export --format fountain` | Always |
| 5 | `/scr:export --format fdx` | Always |
| 6 | `/scr:export --format query-package` | Always |

---

### STEP 5: REPORT

After the pipeline completes, show a summary:

```
Publishing Complete
==================
Preset: kdp-paperback

Generated:
  - Front matter (7 elements)
  - Back matter (5 elements)
  - manuscript-print.pdf (interior, 6x9, ~312 pages)
  - kdp-package/ (cover specs, metadata, upload checklist)

Skipped:
  - Front matter (already existed)

Next Steps:
  1. Review the interior PDF at .manuscript/output/manuscript-print.pdf
  2. Review `.manuscript/output/kdp-package/cover-specs.md` and place the finished print cover at `.manuscript/build/paperback-cover.pdf`
  3. Upload the interior PDF and the final cover file to https://kdp.amazon.com
  4. Set pricing, categories, and keywords on KDP
```

Adapt the "Next Steps" section to the preset:

- **kdp-paperback/kdp-ebook:** KDP upload instructions
- **ingram-paperback:** IngramSpark upload instructions
- **query-submission/screenplay-query:** How to send query packages to agents
- **academic-submission/thesis-defense:** Academic wrapper and TeX compilation submission steps
- **ebook-wide:** Upload to each platform (KDP, Apple Books, Kobo, B&N, Google Play)

---

## Tone

This is the moment the writer becomes a publisher. Be efficient and confident -- they are counting on you to handle the mechanical work so they can focus on the decisions that matter (cover aesthetic, blurb feel, pricing strategy). Show progress at a high level. Surface only the decisions that need their input.
