---
description: Compile and export manuscript to publication-ready formats.
argument-hint: "[--format <format>] [--formatted] [--print-ready] [--skip-validate]"
---

# /scr:export -- Manuscript Export

Assemble the manuscript from OUTLINE.md and export to the specified format. Handles manuscript assembly, metadata generation, external tool detection, and format-specific Pandoc/Typst invocation.

## Usage

```
/scr:export                                  # interactive picker
/scr:export --format <format> [--formatted] [--print-ready] [--skip-validate]
```

If `--format` is omitted, run the interactive picker (see STEP 0). Otherwise jump straight to STEP 1 with the requested format.

---

### STEP 0: INTERACTIVE PICKER (only when --format is omitted)

Load `.manuscript/config.json` and the installed `CONSTRAINTS.json` (same paths as STEP 1) so you know the work type group. For every option below, check it against the `exports` section of `CONSTRAINTS.json` and skip any row that is not available for the current work type group.

Show the writer this prompt and wait for an answer:

> What do you want to export?
>
> **Single file**
> 1. **markdown** -- one `.md` file (no external tools required)
> 2. **docx** -- manuscript Word document (requires Pandoc)
> 3. **pdf** -- manuscript PDF (requires Pandoc + Typst)
> 4. **epub** -- standalone EPUB (requires Pandoc)
> 5. **latex** -- LaTeX source (academic / sacred only)
> 6. **fountain** -- screenplay text (script work types only)
> 7. **fdx** -- Final Draft XML (script work types only, requires Screenplain)
>
> **Print / store packaging**
> 8. **pdf --print-ready** -- print interior PDF with trim size and margins
> 9. **docx --formatted** -- designed DOCX for review copies
> 10. **kdp-package** -- Amazon KDP print upload bundle
> 11. **ingram-package** -- IngramSpark CMYK PDF/X-1a bundle
>
> **Submission packages**
> 12. **query-package** -- agent query bundle (query letter + synopsis + sample)
> 13. **submission-package** -- full submission bundle (DOCX + synopsis + cover letter + bio)
>
> Pick a number, or type the format name. Type `publish` if you want a guided multi-format pipeline instead -- that lives in `/scr:publish`.

Map the answer to the corresponding `--format` value (and `--formatted` / `--print-ready` modifiers where applicable), then proceed to STEP 1 as if the writer had passed it on the command line.

If the writer answers `publish`, do not run the export; tell them to run `/scr:publish` and stop.

---

**Primary Formats:**

| Format | Flag | Output | Requires |
|--------|------|--------|----------|
| Markdown | `--format markdown` | `.manuscript/output/manuscript.md` | Nothing |
| DOCX (manuscript) | `--format docx` | `.manuscript/output/manuscript.docx` | Pandoc |
| DOCX (formatted) | `--format docx --formatted` | `.manuscript/output/manuscript-formatted.docx` | Pandoc |
| PDF (manuscript) | `--format pdf` | `.manuscript/output/manuscript.pdf` | Pandoc, Typst |
| PDF (print-ready) | `--format pdf --print-ready` | `.manuscript/output/manuscript-print.pdf` | Pandoc, Typst |
| EPUB | `--format epub` | `.manuscript/output/manuscript.epub` | Pandoc |

**Secondary Formats (Plan 02):**

| Format | Flag | Output | Requires |
|--------|------|--------|----------|
| Fountain | `--format fountain` | `.manuscript/output/screenplay.fountain` | Nothing |
| FDX | `--format fdx` | `.manuscript/output/screenplay.fdx` | Screenplain |
| LaTeX | `--format latex` | `.manuscript/output/manuscript.tex` | Pandoc |

**Packages (Plan 02):**

| Package | Flag | Output | Requires |
|---------|------|--------|----------|
| KDP | `--format kdp-package` | `.manuscript/output/kdp-package/` | Pandoc, Typst |
| IngramSpark | `--format ingram-package` | `.manuscript/output/ingram-package/` | Pandoc, Typst, Ghostscript |
| Query | `--format query-package` | `.manuscript/output/query-package/` | Pandoc |
| Submission | `--format submission-package` | `.manuscript/output/submission-package/` | Pandoc |

## Instruction

You are a **manuscript export specialist**. Your job is to assemble the complete manuscript from its component files and convert it to the requested format using external tools.

---

### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, language, and project settings
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) -- to check `exports` section for format availability by work type group

**Check format availability:**

Look up the requested format in `CONSTRAINTS.json` under the `exports` section. Map the format flag to the constraint key:

| Flag | Constraint Key |
|------|---------------|
| `markdown` | `markdown` |
| `docx` | `docx_manuscript` |
| `docx --formatted` | `docx_formatted` |
| `pdf` | `pdf_manuscript` |
| `pdf --print-ready` | `pdf_print_ready` |
| `epub` | `epub` |
| `fountain` | `fountain` |
| `fdx` | `fdx` |
| `latex` | `latex` |
| `kdp-package` | `kdp_package` |
| `ingram-package` | `ingram_package` |
| `query-package` | `query_package` |
| `submission-package` | `submission_package` |

Find the current work type's group in `CONSTRAINTS.json` under `work_type_groups`. Check if the group is in the format's `available` list (or if `available` contains `"all"`).

If the format is **not available** for the current work type:
> This format is not available for [work_type] projects. Available export formats for [group] work types are: [list available formats].

Then **stop**.

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

> **Export blocked: unresolved scaffold markers found.**
>
> [list each as: `path/to/file.md:LINE_NUMBER: marker text`]
>
> **Fix:** Run `/scr:cleanup --apply` to remove scaffold markers, or manually
> edit the listed files, then re-run this export command.

Then **stop** -- do not proceed to STEP 2.

If no markers found: proceed to STEP 2.

---

### STEP 1.6: FRONT-MATTER GATE

**1.6a — Scaffold exclusion**

Check if `.manuscript/front-matter/` exists.

If the directory does not exist:
> **Note:** No front matter found — run `/scr:front-matter` first if you want publication front matter included.

Proceed to 1.6b.

If the directory exists, scan all `.md` files in `.manuscript/front-matter/`. For each file, check the first 10 lines for a YAML block containing `scaffold: true`. Build a scaffold exclusion list of the paths of all files where `scaffold: true` is found.

If any files were added to the scaffold exclusion list, note them for the assembly step (STEP 3b) and show:
> **Note:** [N] scaffold front-matter element(s) will be excluded from this export:
>   - `.manuscript/front-matter/12-preface.md` (scaffold: true — edit and set scaffold: false to include)
>
> To include a scaffold element, open the file and change `scaffold: true` to `scaffold: false`.

If no scaffold files were found, show no note.

**1.6b — GENERATE element auto-refresh**

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

### STEP 2: CHECK PREREQUISITES

Check for required external tools based on the requested format.

**For markdown:** No external tools needed. Skip to Step 3.

**For docx, epub, latex, query-package:** Check for Pandoc:

```bash
command -v pandoc >/dev/null 2>&1
```

If Pandoc is not found:

> **Pandoc is required for this export format but is not installed.**
>
> **Install Pandoc:**
> - macOS: `brew install pandoc`
> - Linux: `sudo apt install pandoc`
> - Windows: `choco install pandoc`
> - Or download from https://pandoc.org/installing.html
>
> After installing, run this export command again.

Then **stop** -- do not attempt export without the required tool.

**For pdf (both manuscript and print-ready):** Also check for Typst:

```bash
command -v typst >/dev/null 2>&1
```

If Typst is not found:

> **Typst is required for PDF export but is not installed.**
>
> **Install Typst:**
> - macOS: `brew install typst`
> - Linux: Download from https://github.com/typst/typst/releases
> - Windows: `winget install typst`
> - Or visit https://typst.app for installation options
>
> After installing, run this export command again.

Then **stop**.

**For fdx:** Check for Screenplain:

```bash
command -v screenplain >/dev/null 2>&1
```

If not found, provide install instructions (`pip install screenplain`) and stop.

**For fountain:** No external tools needed.

---

### STEP 3: ASSEMBLE MANUSCRIPT

This step builds the complete manuscript from its component files. All formats use this assembled file as input.

**3a. Read OUTLINE.md for document order:**

Read `.manuscript/OUTLINE.md` and parse the scene/chapter list. Extract the ordered list of body units (scenes, chapters, sections) with their file paths in `.manuscript/drafts/body/`.

**3b. Scan front matter:**

Read all files in `.manuscript/front-matter/` directory. Sort by numeric prefix to maintain Chicago Manual of Style order:

```
01-half-title.md
02-series-title.md
03-title-page.md
04-copyright.md
...
```

**Scaffold exclusion:** Omit any files whose path appears in the scaffold exclusion list from STEP 1.6a. These files have `scaffold: true` in their frontmatter and are not yet ready for publication.

If no front matter files exist:
> **Note:** No front matter found. Consider running `/scr:front-matter` to generate title page, copyright, and other publishing elements.

Proceed with body content only.

**3c. Read body drafts:**

For each unit listed in OUTLINE.md, look for the corresponding draft file in `.manuscript/drafts/body/`. Read in OUTLINE.md order.

For any unit listed in OUTLINE.md that has no draft file:
> **Warning:** Missing draft for "[unit name]" -- skipping. Expected file: `.manuscript/drafts/body/[filename]`

Track all missing units for the final report.

**3d. Scan back matter:**

Read all files in `.manuscript/back-matter/` directory. Sort alphabetically.

If no back matter exists, proceed without -- back matter is optional.

**3e. Concatenate:**

Assemble the full manuscript in this order:

1. Front matter files (sorted by numeric prefix)
2. Body draft files (ordered by OUTLINE.md)
3. Back matter files (sorted alphabetically)

Insert `\newpage` page break markers between major sections (between each front matter element, between front matter and body, between chapters/sections, between body and back matter).

**3f. Create output directory and write assembled file:**

```bash
mkdir -p .manuscript/output
```

Write the assembled content to `.manuscript/output/assembled-manuscript.md`.

**3g. Generate metadata.yaml:**

Read `.manuscript/config.json` and `.manuscript/WORK.md` (if it exists) to generate Pandoc metadata:

```yaml
---
title: "[title from config.json]"
subtitle: "[subtitle if available]"
author:
  - name: "[author from config.json]"
language: "[language from config.json, default en-US]"
rights: "Copyright [year] [author]. All rights reserved."
date: "[current year]"
description: "[description if available]"
---
```

Write to `.manuscript/output/metadata.yaml`.

---

### STEP 4: EXPORT BY FORMAT

Execute the format-specific export command using the assembled manuscript and metadata.

---

#### FORMAT: markdown (EXP-01)

The assembled file IS the output. No external tools needed.

```bash
cp .manuscript/output/assembled-manuscript.md .manuscript/output/manuscript.md
```

---

#### FORMAT: docx (EXP-02)

Manuscript export DOCX using Pandoc's default Word styling.

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/manuscript.docx \
  --metadata-file=.manuscript/output/metadata.yaml \
  --toc \
  --toc-depth=1
```

**Current shipped behavior:** Scriven does not currently bundle a manuscript DOCX reference document in `data/export-templates/`. This command uses Pandoc's default DOCX styling. If you need standard manuscript formatting (for example 12pt, double-spaced, 1-inch margins), supply your own `.docx` reference document via Pandoc's optional `--reference-doc`.

---

#### FORMAT: docx --formatted (EXP-03)

Designed/typeset DOCX for review copies and ARCs.

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/manuscript-formatted.docx \
  --metadata-file=.manuscript/output/metadata.yaml \
  --toc \
  --toc-depth=2
```

**Current shipped behavior:** Scriven does not currently bundle a formatted DOCX reference document in `data/export-templates/`. The shipped command path uses Pandoc's default DOCX output. If you want a styled review-copy layout, supply your own Pandoc reference document as an optional `--reference-doc`.

---

#### FORMAT: pdf (EXP-04)

Manuscript-format PDF via Typst engine.

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/manuscript.pdf \
  --pdf-engine=typst \
  --metadata-file=.manuscript/output/metadata.yaml \
  --toc \
  --toc-depth=1
```

---

#### FORMAT: pdf --print-ready (EXP-05)

Print-ready PDF with book interior formatting for KDP/IngramSpark.

Read trim size from `.manuscript/config.json` if set, otherwise use defaults (6in x 9in).

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/manuscript-print.pdf \
  --pdf-engine=typst \
  --template=data/export-templates/scriven-book.typst \
  --metadata-file=.manuscript/output/metadata.yaml \
  --toc \
  --toc-depth=2 \
  -V paperwidth=6in \
  -V paperheight=9in \
  -V margin-inside=0.75in \
  -V margin-outside=0.5in \
  -V margin-top=0.75in \
  -V margin-bottom=0.75in
```

If `config.json` contains `trim_width` and `trim_height`, use those values instead of defaults for `paperwidth` and `paperheight`.

---

#### FORMAT: epub (EXP-06)

EPUB 3 with metadata, table of contents, cover image, and custom CSS.

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/manuscript.epub \
  --metadata-file=.manuscript/output/metadata.yaml \
  --epub-cover-image=.manuscript/build/ebook-cover.jpg \
  --css=data/export-templates/scriven-epub.css \
  --toc \
  --toc-depth=2 \
  --split-level=1
```

**Cover image:** If `.manuscript/build/ebook-cover.jpg` (or `.png`) does not exist:
> **Note:** No ebook cover found at `.manuscript/build/ebook-cover.jpg` or `.png`. EPUB will be generated without a cover. To add a cover, place your front-cover-only RGB ebook asset there and re-run the export.

Run the command without the `--epub-cover-image` flag.

---

#### FORMAT: fountain (EXP-07)

Fountain is a plain-text screenplay format. The agent converts the assembled manuscript markdown directly to Fountain-formatted text -- no external tool needed.

**Work type check:** Look up `fountain` in `CONSTRAINTS.json` under `exports`. It is available only for `script` group work types (screenplay, stage_play, tv_pilot, tv_series_bible, audio_drama, libretto). If the current work type's group is not in the `available` list, inform the writer and **stop**.

**Conversion rules (Markdown to Fountain):**

1. **Scene headings:** Lines starting with `## ` or `### ` that contain location context become Fountain sluglines. Prefix with `INT.` or `EXT.` based on content. If ambiguous, use the heading text as-is prefixed with `.` (forced scene heading in Fountain).
2. **Character names:** Any line that is ALL CAPS followed by dialogue on the next line stays as-is (Fountain format).
3. **Dialogue:** Lines immediately following a CHARACTER NAME are dialogue. Wrap parenthetical directions in `()`.
4. **Action:** Regular prose paragraphs become action blocks (plain text with blank line separators).
5. **Transitions:** Lines ending with `TO:` (e.g., `CUT TO:`, `FADE TO:`) are transitions. Alternatively, prefix with `>`.
6. **Title page:** Generate from metadata:
   ```
   Title: [title from config.json]
   Credit: Written by
   Author: [author from config.json]
   Draft date: [current date]
   ```

Write the converted Fountain text to:

```bash
mkdir -p .manuscript/output
# Write Fountain-formatted content to:
# .manuscript/output/screenplay.fountain
```

**Optional screenplay PDF:** After generating the Fountain file, check if Afterwriting is available:

```bash
command -v afterwriting >/dev/null 2>&1
```

If Afterwriting is installed, offer to generate a screenplay PDF:

```bash
afterwriting \
  --source .manuscript/output/screenplay.fountain \
  --pdf .manuscript/output/screenplay.pdf \
  --overwrite
```

If Afterwriting is not installed:
> **Optional:** To generate a formatted screenplay PDF, install Afterwriting: `npm i -g afterwriting`
> Then run: `afterwriting --source .manuscript/output/screenplay.fountain --pdf .manuscript/output/screenplay.pdf --overwrite`

---

#### FORMAT: fdx (EXP-08)

Final Draft XML format via Screenplain, using Fountain as an intermediate.

**Work type check:** Look up `fdx` in `CONSTRAINTS.json` under `exports`. It is available only for `script` group work types with a `screenplay_or_tv_only` constraint. If the current work type is not eligible, inform the writer and **stop**.

**Step 1: Ensure Fountain export exists**

Check if `.manuscript/output/screenplay.fountain` exists. If not, run the Fountain export first (see FORMAT: fountain above). FDX export chains through Fountain as an intermediate format: markdown -> fountain -> fdx.

**Step 2: Check for Screenplain**

```bash
command -v screenplain >/dev/null 2>&1
```

If Screenplain is not found:

> **Screenplain is required for FDX export but is not installed.**
>
> **Install Screenplain:**
> ```
> pip install screenplain
> ```
>
> After installing, run this export command again.

Then **stop** -- do not attempt FDX export without Screenplain.

**Step 3: Convert Fountain to FDX**

```bash
screenplain --format fdx .manuscript/output/screenplay.fountain \
  .manuscript/output/screenplay.fdx
```

Output: `.manuscript/output/screenplay.fdx`

---

#### FORMAT: latex (EXP-09)

LaTeX source file for academic and sacred text work types, via Pandoc with the academic template.

**Work type check:** Look up `latex` in `CONSTRAINTS.json` under `exports`. It is available only for `academic` and `sacred` group work types. For sacred work types, LaTeX export is intended for critical editions. If the current work type's group is not in the `available` list, inform the writer and **stop**.

**Check for Pandoc** (same as other Pandoc-dependent formats -- see Step 2 above).

**Check for bibliography file:**

If `.manuscript/bibliography.bib` exists, include bibliography flags. If it does not exist:

> **Note:** No bibliography file found at `.manuscript/bibliography.bib`. LaTeX export will proceed without bibliography support. To add citations, create a BibTeX file at `.manuscript/bibliography.bib` and re-run the export.

**Export command (with bibliography):**

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/manuscript.tex \
  --template=data/export-templates/scriven-academic.latex \
  --metadata-file=.manuscript/output/metadata.yaml \
  --toc \
  --bibliography=.manuscript/bibliography.bib \
  --citeproc
```

**Export command (without bibliography):**

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/manuscript.tex \
  --template=data/export-templates/scriven-academic.latex \
  --metadata-file=.manuscript/output/metadata.yaml \
  --toc
```

Output: `.manuscript/output/manuscript.tex`

---

#### FORMAT: kdp-package (EXP-10)

Bundle a KDP print submission package with interior PDF, a canonical cover handoff brief, and metadata.

**Work type check:** Look up `kdp_package` in `CONSTRAINTS.json` under `exports`. Available for `prose`, `visual`, `poetry`, and `sacred` group work types. If the current work type's group is not in the `available` list, inform the writer and **stop**.

**Step 1: Ensure print-ready PDF exists**

Check if `.manuscript/output/manuscript-print.pdf` exists. If not, run the `pdf --print-ready` export first (see FORMAT: pdf --print-ready above).

**Step 2: Resolve the canonical cover asset contract**

Use these canonical cover locations:

- Ebook front cover: `.manuscript/build/ebook-cover.jpg` (or `.png`)
- Paperback full wrap: `.manuscript/build/paperback-cover.pdf`
- Hardcover case wrap: `.manuscript/build/hardcover-cover.pdf`

For this KDP print package, the relevant finished print asset is `.manuscript/build/paperback-cover.pdf`.

**Do not calculate final print-cover wrap geometry from hard-coded paper factors in this command.** Exact paperback wrap width, spine width, and bleed-safe template geometry must come from the active platform cover template tool.

**Step 3: Create KDP package directory and files**

```bash
mkdir -p .manuscript/output/kdp-package
cp .manuscript/output/manuscript-print.pdf .manuscript/output/kdp-package/interior.pdf
```

If `.manuscript/build/paperback-cover.pdf` exists, copy it into the package as `cover.pdf`. If it does not exist, still generate the package and note that the print cover is pending.

**Generate `cover-specs.md`** as a delivery brief:

```markdown
# KDP Cover Specifications

## Canonical Asset
- Expected print cover file: `.manuscript/build/paperback-cover.pdf`
- If present, packaged copy: `.manuscript/output/kdp-package/cover.pdf`

## Delivery Contract
- Format: PDF/X-1a:2001 preferred for print handoff
- Resolution: 300 DPI minimum
- Bleed: 0.125" outer edges
- Surface: back + spine + front in one full-wrap PDF
- Fonts embedded
- Transparency flattened

## Notes
- Generate exact wrap geometry from the current platform template tool using the real trim size, page count, and binding
- Keep the ebook front cover separate at `.manuscript/build/ebook-cover.jpg`
- Keep editable source files under `.manuscript/build/source/`
```

**Generate `kdp-metadata.md`** with publishing metadata:

```markdown
# KDP Metadata

- **Title:** [title from config.json]
- **Author:** [author from config.json]
- **Language:** [language from config.json]
- **Description:** [from WORK.md if available]
- **Categories:** [suggest based on work_type and genre]
- **Keywords:** [suggest 7 keywords based on themes and genre]
- **Page count:** [page_count] (estimated from word count)
```

Output: `.manuscript/output/kdp-package/` containing `interior.pdf`, `cover-specs.md`, `kdp-metadata.md`, and `cover.pdf` when `.manuscript/build/paperback-cover.pdf` exists

---

#### FORMAT: ingram-package (EXP-11)

Bundle an IngramSpark submission package with CMYK PDF/X-1a interior, canonical print-cover handoff notes, and metadata.

**Work type check:** Look up `ingram_package` in `CONSTRAINTS.json` under `exports`. Available for `prose`, `visual`, `poetry`, and `sacred` group work types. If the current work type's group is not in the `available` list, inform the writer and **stop**.

**Step 1: Ensure print-ready PDF exists**

Check if `.manuscript/output/manuscript-print.pdf` exists. If not, run the `pdf --print-ready` export first.

**Step 2: Check for Ghostscript**

```bash
command -v gs >/dev/null 2>&1
```

If Ghostscript is not found:

> **Ghostscript is required for IngramSpark PDF/X-1a conversion but is not installed.**
>
> **Install Ghostscript:**
> - macOS: `brew install ghostscript`
> - Linux: `sudo apt install ghostscript`
> - Windows: Download from https://ghostscript.com/releases/gsdnld.html
>
> After installing, run this export command again.

Then **stop**.

**Step 3: Convert to CMYK PDF/X-1a**

```bash
mkdir -p .manuscript/output/ingram-package

gs -dPDFX -dBATCH -dNOPAUSE \
  -dPDFXCompatibilityPolicy=1 \
  -sColorConversionStrategy=CMYK \
  -sDEVICE=pdfwrite \
  -sOutputFile=.manuscript/output/ingram-package/manuscript-cmyk.pdf \
  .manuscript/output/manuscript-print.pdf
```

> **ICC Color Profile Warning:** CMYK conversion quality depends on ICC color profiles installed on your system. The converted PDF should be reviewed for color accuracy before submission to IngramSpark. Colors may shift during RGB-to-CMYK conversion, especially blues and greens.

**Step 4: Prepare cover brief and metadata**

Use the canonical print-cover asset at `.manuscript/build/paperback-cover.pdf`.

If `.manuscript/build/paperback-cover.pdf` exists, copy it into the package as `cover.pdf`.

**Generate `cover-specs.md`** and **`ingram-metadata.md`** in the package directory with the IngramSpark-specific handoff requirements:

```markdown
# IngramSpark Cover Specifications

## Canonical Asset
- Expected print cover file: `.manuscript/build/paperback-cover.pdf`
- If present, packaged copy: `.manuscript/output/ingram-package/cover.pdf`

## IngramSpark-Specific Requirements
- Cover file must be PDF/X-1a compliant (CMYK color space)
- Full-wrap cover: front + spine + back in a single PDF
- Resolution: 300 DPI minimum
- All fonts must be embedded
- No transparency (flatten before submission)
- Exact wrap width, spine width, and guide lines must come from the current IngramSpark Cover Template Generator
- For hardcover/case wrap work, keep the separate case-wrap file at `.manuscript/build/hardcover-cover.pdf`
```

Output: `.manuscript/output/ingram-package/` containing `manuscript-cmyk.pdf`, `cover-specs.md`, `ingram-metadata.md`, and `cover.pdf` when `.manuscript/build/paperback-cover.pdf` exists

---

#### FORMAT: query-package (EXP-12)

Bundle a query submission package with query letter, synopsis, and sample chapters for agent/editor queries.

**Work type check:** Look up `query_package` in `CONSTRAINTS.json` under `exports`. Available for `prose`, `script`, and `sacred` group work types. If the current work type's group is not in the `available` list, inform the writer and **stop**.

**Step 1: Check prerequisites**

Check for the following files:

| File | Source | If Missing |
|------|--------|------------|
| Query letter | `.manuscript/marketing/QUERY-LETTER.md` | Suggest running `/scr:query-letter` to generate one |
| Synopsis | `.manuscript/marketing/SYNOPSIS-*.md` | Suggest running `/scr:synopsis` to generate one |
| Sample chapters | First 3 body units from OUTLINE.md | Assembled from `.manuscript/drafts/body/` |

If query letter or synopsis are missing:
> **Missing prerequisites for query package:**
> - [List missing items]
>
> **Generate missing pieces:**
> - Query letter: `/scr:query-letter`
> - Synopsis: `/scr:synopsis`
>
> Or continue with available materials only? The package will be incomplete.

If the writer chooses to continue, assemble what is available. Otherwise, **stop** and let them generate the missing pieces first.

**Step 2: Extract sample chapters**

Read OUTLINE.md and extract the first 3 body units (chapters/scenes). Read their draft files from `.manuscript/drafts/body/` and concatenate into `sample-chapters.md`.

**Step 3: Assemble query package**

```bash
mkdir -p .manuscript/output/query-package
```

Copy `.manuscript/marketing/QUERY-LETTER.md` into the package directory as `query-letter.md`.

Select the synopsis file from `.manuscript/marketing/` in this order of preference:
1. `SYNOPSIS-1p.md`
2. `SYNOPSIS-2p.md`
3. Any other `SYNOPSIS-*.md`

Copy the chosen synopsis into the package directory as `synopsis.md`. Then create a combined DOCX:

```bash
pandoc .manuscript/output/query-package/query-letter.md \
  .manuscript/output/query-package/synopsis.md \
  .manuscript/output/query-package/sample-chapters.md \
  -o .manuscript/output/query-package/query-package.docx
```

The shipped query-package flow uses Pandoc's default DOCX styling. If you want a custom manuscript look, provide your own Pandoc reference document when running the underlying command.

Output: `.manuscript/output/query-package/` containing `query-letter.md`, `synopsis.md`, `sample-chapters.md`, `query-package.docx`

---

#### FORMAT: submission-package (EXP-13)

Bundle a full manuscript submission package with complete DOCX, synopsis, cover letter, and author bio for publisher/agent submission.

**Work type check:** Look up `submission_package` in `CONSTRAINTS.json` under `exports`. Available for `prose`, `script`, and `sacred` group work types. If the current work type's group is not in the `available` list, inform the writer and **stop**.

**Step 1: Check prerequisites**

Check for the following files:

| File | Source | If Missing |
|------|--------|------------|
| Full manuscript DOCX | `.manuscript/output/manuscript.docx` | Run `/scr:export --format docx` first |
| Synopsis | `.manuscript/marketing/SYNOPSIS-*.md` | Suggest running `/scr:synopsis` |
| Cover letter | `.manuscript/marketing/QUERY-LETTER.md` | Suggest running `/scr:query-letter` (adapted as cover letter) |
| Author bio | `.manuscript/back-matter/about-author.md` | Suggest running `/scr:back-matter --element about-author` |

If prerequisites are missing:
> **Missing prerequisites for submission package:**
> - [List missing items]
>
> **Generate missing pieces:**
> - Full manuscript: `/scr:export --format docx`
> - Synopsis: `/scr:synopsis`
> - Cover letter: `/scr:query-letter`
> - Author bio: `/scr:back-matter --element about-author`
>
> Or continue with available materials only?

**Step 2: Assemble submission package**

```bash
mkdir -p .manuscript/output/submission-package
```

Copy available files into the package directory:

- `manuscript.docx` -- full manuscript in standard format
- `synopsis.md` -- chosen from `.manuscript/marketing/SYNOPSIS-*.md` (prefer `1p`, then `2p`)
- `cover-letter.md` -- adapted from `.manuscript/marketing/QUERY-LETTER.md` for this specific submission
- `about-author.md` -- author bio from back matter

**Step 3: Generate submission checklist**

Create `submission-checklist.md` in the package directory:

```markdown
# Submission Checklist

- [ ] Manuscript DOCX reviewed for formatting (12pt, double-spaced, 1" margins)
- [ ] Synopsis is [1-2 pages / per agent guidelines]
- [ ] Cover letter personalized for target agent/editor
- [ ] Author bio is current and appropriate length
- [ ] All files named per submission guidelines
- [ ] Word count noted: [word_count] words
- [ ] Genre/category confirmed: [genre from WORK.md]

## Common Submission Requirements
- Most agents want: query letter + synopsis + first [10/25/50] pages
- Some want: full manuscript attached
- Always follow the specific agent's submission guidelines
```

Output: `.manuscript/output/submission-package/` containing `manuscript.docx`, `synopsis.md`, `cover-letter.md`, `about-author.md`, `submission-checklist.md`

---

### STEP 5: REPORT

After export completes, report:

1. **Output file path** and file size
2. **Assembly summary:**
   - Number of front matter elements included
   - Number of body units included (and any missing/skipped)
   - Number of back matter elements included
   - Total word count of assembled manuscript
3. **Warnings** from assembly (missing units, missing front matter, missing cover image)
4. **Format-specific notes:**
   - For EPUB: suggest validation with EPUBCheck if Java is available
     ```bash
     command -v java >/dev/null 2>&1
     ```
     If Java is available: "Consider validating your EPUB with EPUBCheck: `java -jar epubcheck.jar .manuscript/output/manuscript.epub`"
   - For DOCX: note that styling comes from the reference document
   - For PDF --print-ready: confirm the trim size and margins used

**Example output:**

> **Export complete!**
>
> **File:** `.manuscript/output/manuscript.epub` (1.2 MB)
>
> **Assembly:**
> - 8 front matter elements
> - 24 body units (2 missing: "Chapter 12", "Epilogue")
> - 3 back matter elements
> - 78,450 words
>
> **Warnings:**
> - Missing draft for "Chapter 12" -- skipped
> - Missing draft for "Epilogue" -- skipped
> - No cover image found -- EPUB generated without cover
>
> **Next steps:**
> - Add missing chapters and re-export
> - Validate EPUB: `java -jar epubcheck.jar .manuscript/output/manuscript.epub`
