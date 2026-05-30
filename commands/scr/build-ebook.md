---
description: Build a publication-ready EPUB from the manuscript for a target platform.
argument-hint: "[--platform <platform>] [--fixed-layout] [--skip-validate]"
---

# /scr:build-ebook -- EPUB Build Pipeline

Assemble the manuscript and produce an accessible EPUB for the selected publishing platform. Includes validate gate, scaffold-exclusion, accessibility (EAA-compliant lang tags, alt text, semantic nav), and platform-aware Pandoc invocation.

## Usage

```
/scr:build-ebook [--platform <platform>] [--fixed-layout] [--skip-validate]
```

**Platform values:** `kdp | ingram | apple | bn | d2d | kobo | google | smashwords` (default: kdp)

**Flags:**
  `--fixed-layout`    Produce a fixed-layout EPUB (for picture books and illustrated books). Uses `data/export-templates/scriveno-fixed-layout-epub.css` and generates an OPF stub. Work type `picture_book` auto-enables this flag.

## Instruction

You are a **manuscript build specialist** for EPUB output.

---

### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, language, and project settings
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) -- to check `exports` section for format availability by work type group

**Check format availability:**

Look up `build_ebook` in `CONSTRAINTS.json` under the `exports` section. Find the current work type's group in `CONSTRAINTS.json` under `work_type_groups`. Check if the group is in the `build_ebook.available` list.

Available for: `["prose", "visual", "poetry", "interactive", "sacred"]`

If the work type group is **not available**:
> This command is not available for [work_type] projects. The EPUB build is available for: prose, visual, poetry, interactive, and sacred work types.

Then **stop**.

**Auto-detect fixed-layout:**
If `work_type` is `picture_book` and `--fixed-layout` was not passed, treat `--fixed-layout` as enabled automatically.

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

> **Build blocked: unresolved scaffold markers found.**
>
> [list each as: `path/to/file.md:LINE_NUMBER: marker text`]
>
> **Fix:** Run `/scr:cleanup --apply` to remove scaffold markers, or manually
> edit the listed files, then re-run this build command.

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

If any files were added to the scaffold exclusion list, note them for the assembly step (STEP 3b) and show:
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

### STEP 1.7: TRADITION LOADING

Read top-level `tradition` from `.manuscript/config.json`. For older projects only, if top-level `tradition` is absent and `sacred.tradition` exists, use `sacred.tradition` as a legacy fallback.

If absent or null: skip this step silently and proceed to STEP 1.8.

Validate the tradition slug against the accepted list:
`catholic`, `orthodox`, `tewahedo`, `protestant`, `jewish`, `islamic-hafs`, `islamic-warsh`, `pali`, `tibetan`, `sanskrit`

If the value is not in this list:
> **Unknown tradition "{tradition}". Valid values: catholic, orthodox, tewahedo, protestant, jewish, islamic-hafs, islamic-warsh, pali, tibetan, sanskrit**

Then **stop**.

If present and valid, load `templates/sacred/{tradition}/manifest.yaml`.

Apply tradition data to `.manuscript/output/metadata.yaml` (before STEP 3f writes the file):
- Set `lang:` to the tradition's primary language tag:
  - `arabic` script -> `ar`
  - `hebrew` script -> `he`
  - `ethiopic` script -> `am` (Amharic, primary Ge'ez liturgical language)
  - `tibetan` script -> `bo`
  - `devanagari` script -> `sa` (Sanskrit)
  - `latin` script -> use the project language from config.json (default `en`)
- Set `mainfont:` to the first entry in the manifest's `font_stack`. (For the EPUB itself the non-Latin font is applied through `scriveno-epub.css`; `mainfont` keeps the metadata key aligned with the print build.)

If `rtl: true` in the manifest, add `--metadata dir=rtl` to the Pandoc invocation in STEP 4.

If `approval_block.required: true` in the manifest, show after the build completes:
> **Note:** This tradition requires an approval block ("{{approval_block.label}}") before publication. Scope: {{approval_block.scope}}.

Proceed to STEP 1.8.

---

### STEP 1.8: VALIDATE PLATFORM

**Resolve the platform slug:**

- If `--platform` was passed, use that value.
- If `--platform` was not passed and top-level `platform` is set in `.manuscript/config.json`, use that value.
- If neither is set, default to `kdp`.

**Validate the platform slug:**

Check that the slug is one of the following allowed values:
`kdp`, `ingram`, `apple`, `bn`, `d2d`, `kobo`, `google`, `smashwords`

If the platform slug is invalid:
> **Platform "{slug}" is not recognised.**
>
> Valid EPUB platforms: kdp, ingram, apple, bn, d2d, kobo, google, smashwords
>
> Example: `/scr:build-ebook --platform kdp`

Then **stop**.

**Load manifest for selected platform:**

Load `templates/platforms/{platform}/manifest.yaml`.

If the manifest is missing:
> **Platform manifest missing: `templates/platforms/{platform}/manifest.yaml`.**
> Re-install Scriveno or restore the platform profile before building.

Then **stop**.

Read `label`, `formats_accepted`, `epub_variant`, and `metadata_shape` from the manifest.

If `formats_accepted` does not include `epub`:
> **{PLATFORM} does not accept EPUB output.**
>
> Choose a platform whose manifest includes `epub` in `formats_accepted`.

Then **stop**.

Carry the selected platform label and `epub_variant` forward to the metadata and final report.

Proceed to STEP 2.

---

### STEP 2: CHECK PREREQUISITES

Check for Pandoc:

```bash
command -v pandoc >/dev/null 2>&1
```

If Pandoc is not found:

> **Pandoc is required for EPUB build but is not installed.**
>
> **Install Pandoc:**
> - macOS: `brew install pandoc`
> - Linux: `sudo apt install pandoc`
> - Windows: `choco install pandoc`
> - Or download from https://pandoc.org/installing.html
>
> After installing, run this build command again.

Then **stop** -- do not attempt the build without the required tool.

Check for the EPUB stylesheet:

If `data/export-templates/scriveno-epub.css` does not exist:

> **EPUB stylesheet is missing at `data/export-templates/scriveno-epub.css`.**
> This file is required for properly styled EPUB output.
> Re-install Scriveno or restore the file from the repository.

Then **stop** -- do not attempt the build without the stylesheet.

If `--fixed-layout` was passed (or auto-enabled):

If `data/export-templates/scriveno-fixed-layout-epub.css` does not exist:
> **Fixed-layout EPUB stylesheet is missing at `data/export-templates/scriveno-fixed-layout-epub.css`.**
> Re-install Scriveno or restore the file from the repository.

Then **stop**.

If `data/export-templates/scriveno-fixed-layout.opf` does not exist:
> **Fixed-layout OPF stub is missing at `data/export-templates/scriveno-fixed-layout.opf`.**
> Re-install Scriveno or restore the file from the repository.

Then **stop**.

---

### STEP 3: ASSEMBLE MANUSCRIPT

This step builds the complete manuscript from its component files.

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

**3d. Scan back matter:**

Read all files in `.manuscript/back-matter/` directory. Sort alphabetically. If no back matter exists, proceed without -- back matter is optional.

**3e. Concatenate and write:**

Assemble the full manuscript in this order:
1. Front matter files (sorted by numeric prefix)
2. Body draft files (ordered by OUTLINE.md)
3. Back matter files (sorted alphabetically)

Insert `\newpage` page break markers between major sections.

Create output directory and write assembled file:

```bash
mkdir -p .manuscript/output
```

Write assembled content to `.manuscript/output/assembled-manuscript.md`.

**3f. Generate metadata.yaml:**

Read `.manuscript/config.json` and `.manuscript/WORK.md` (if it exists) to generate Pandoc metadata:

```yaml
---
title: "[title from config.json]"
subtitle: "[subtitle if available]"
author:
  - name: "[author from config.json]"
lang: "[language from config.json, default en-US]"
publisher-platform: "[selected platform label]"
epub-variant: "[epub_variant from platform manifest]"
rights: "Copyright [year] [author]. All rights reserved."
date: "[current year]"
description: "[description if available]"
---
```

Write to `.manuscript/output/metadata.yaml`.

---

### STEP 4: BUILD EPUB

**4a -- Accessibility pre-check:**

Before invoking Pandoc, verify:

- All images referenced in the assembled manuscript have alt text in their Markdown syntax (`![alt text](path)`). For any image missing alt text, add a placeholder: `![Illustration: [describe the image]](path)`.
- The project language (`lang`) is set -- if absent from config.json, default to `en`.

**4b -- Pandoc invocation:**

**If `--fixed-layout` is enabled:**

First, copy the OPF stub for reference:
```bash
cp data/export-templates/scriveno-fixed-layout.opf .manuscript/output/fixed-layout.opf
```

Invoke Pandoc with the fixed-layout stylesheet:
```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/ebook-fixed-layout.epub \
  --metadata-file=.manuscript/output/metadata.yaml \
  --epub-cover-image=.manuscript/build/ebook-cover.jpg \
  --css=data/export-templates/scriveno-fixed-layout-epub.css \
  --toc \
  --toc-depth=2 \
  --split-level=0
```

Note: `--split-level=0` keeps facing pages together as single spine items.

After build, show:
> **Note:** Fixed-layout EPUB generated. Merge the OPF metadata from `.manuscript/output/fixed-layout.opf` into the EPUB's `package.opf` before submitting to Apple Books.

Then proceed to STEP 5 (skip the standard Pandoc invocation below).

**If `--fixed-layout` is NOT enabled:** use the standard Pandoc invocation:

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/ebook.epub \
  --metadata-file=.manuscript/output/metadata.yaml \
  --epub-cover-image=.manuscript/build/ebook-cover.jpg \
  --css=data/export-templates/scriveno-epub.css \
  --toc \
  --toc-depth=2 \
  --split-level=1
```

If `.manuscript/build/ebook-cover.jpg` does not exist, check `.manuscript/build/ebook-cover.png`. If neither exists, omit the `--epub-cover-image` flag and note:
> **Note:** No ebook cover found at `.manuscript/build/ebook-cover.jpg` or `.png`. EPUB will be generated without a cover. To add a cover, place your front-cover-only RGB file at `.manuscript/build/ebook-cover.jpg` (or `.png`) and re-run this build command.

**4c -- Semantic nav note:**

The `--toc` flag causes Pandoc to emit an `epub:type="toc"` nav document (EPUB3 semantic navigation). This satisfies EU EAA June 2025 requirement for machine-readable navigation.

---

### STEP 5: REPORT

If `--fixed-layout` is active:

Show:
```
OK EPUB built -> .manuscript/output/ebook-fixed-layout.epub ({file_size})
Platform: {selected platform label}
```

Get file size with:
```bash
ls -lh .manuscript/output/ebook-fixed-layout.epub | awk '{print $5}'
```

Otherwise:

Show:
```
OK EPUB built -> .manuscript/output/ebook.epub ({file_size})
Platform: {selected platform label}
```

Get file size with:
```bash
ls -lh .manuscript/output/ebook.epub | awk '{print $5}'
```

## Response Contract

Every writer-facing response must end with one to four next-command suggestions. Each suggestion must include a short explanation of what that path will do.

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
