---
description: Build a print-ready PDF from the manuscript for a target publishing platform.
argument-hint: "[--platform <platform>] [--trim <size>] [--strict] [--hardcover] [--skip-validate]"
---

# /scr:build-print -- Print PDF Build Pipeline

Assemble the manuscript and produce a print-ready PDF for the selected publishing platform. Includes validate gate, scaffold-exclusion, trim size validation, page-count guardrail (warning by default, hard block with --strict), and platform-aware Pandoc + Typst invocation.

Publishing boundary: `/scr:build-print` is a final print package builder for a specific platform. Use `/scr:publish` for destination sequencing and `/scr:export --format pdf --print-ready` for a one-off print-ready interior.

## Usage

```
/scr:build-print [--platform <platform>] [--trim <size>] [--strict] [--hardcover] [--skip-validate]
```

**Flags:**
  `--hardcover`    Use hardcover page limit for KDP (550pp) instead of paperback (828pp)

**Platform values:** `kdp | ingram | apple | bn | d2d | kobo | google | smashwords | ieee | acm | lncs | elsevier | apa7` (default: kdp)

**Academic platforms** (`ieee | acm | lncs | elsevier | apa7`): produce `.tex` source only -- no `--trim` applies, no `--hardcover` applies. Writer compiles with their own TeX distribution.

**Trim values (KDP/Ingram):** `5x8 | 5.25x8 | 5.5x8.5 | 6x9 | 7x10` (default: 6x9)

**Note:** Apple, B&N, D2D, Kobo, Google, Smashwords are EPUB-only platforms. Running build-print with these platforms will produce an error directing the writer to use `/scr:build-ebook` instead.

## Instruction

You are a **manuscript build specialist** for print-ready PDF output.

---

### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, language, and project settings
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) -- to check `exports` section for format availability by work type group

Resolve shared asset directories before checking templates:

- `SHARED_DATA_DIR`: first existing directory from `.scriveno/data`, `$HOME/.scriveno/data`, then `data` when running from the Scriveno source repository
- `SHARED_TEMPLATE_DIR`: first existing directory from `.scriveno/templates`, `$HOME/.scriveno/templates`, then `templates` when running from the Scriveno source repository
- `EXPORT_TEMPLATE_DIR`: `${SHARED_DATA_DIR}/export-templates`
- `PLATFORM_TEMPLATE_DIR`: `${SHARED_TEMPLATE_DIR}/platforms`
- `SACRED_TEMPLATE_DIR`: `${SHARED_TEMPLATE_DIR}/sacred`

Use these resolved variables in every file check and shell command. Do not tell an installed-project user to restore repo-relative paths such as `data/export-templates/...` or `templates/platforms/...`; those paths only exist while developing inside the Scriveno repository. If a resolved asset is missing, report the resolved path that failed and suggest reinstalling Scriveno for the active runtime.

**Check format availability:**

Look up `build_print` in `CONSTRAINTS.json` under the `exports` section. Find the current work type's group in `CONSTRAINTS.json` under `work_type_groups`. Check if the group is in the `build_print.available` list.

Available for: `["prose", "visual", "poetry", "sacred", "academic"]`

If the work type group is **not available**:
> This command is not available for [work_type] projects. The print PDF build is available for: prose, visual, poetry, sacred, and academic work types.

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

**1.6b -- Existing front-matter freshness check**

Build-print is an assembly and conversion command. It must not create, refresh, or rewrite front-matter or back-matter files. Those are writer-facing drafting surfaces owned by `/scr:front-matter` and `/scr:back-matter`.

If `.manuscript/front-matter/` does not exist, skip the freshness check and proceed to STEP 2.

If `.manuscript/WORK.md` does not exist, skip the freshness check and proceed to STEP 2.

Compare the modification timestamp of `.manuscript/WORK.md` against each of the following generated front-matter files when they exist:
- `.manuscript/front-matter/01-half-title.md`
- `.manuscript/front-matter/03-title-page.md`
- `.manuscript/front-matter/04-copyright.md`
- `.manuscript/front-matter/07-toc.md`

To compare timestamps, use the appropriate command for the platform:
- macOS: `stat -f %m <file>`
- Linux: `stat -c %Y <file>`
- Windows: `(Get-Item '<file>').LastWriteTimeUtc.Ticks`
- If timestamp comparison is not possible, treat freshness as unknown.

If WORK.md is newer than ANY existing generated front-matter file, if ANY of those 4 files do not exist, or if freshness is unknown, show:
> **Note:** Front matter may be stale or incomplete. Build-print will not generate or refresh front matter. Run `/scr:front-matter --level minimum` or `/scr:front-matter --level balanced`, then re-run build-print if you want updated front matter included.

If WORK.md is not newer than all 4 files and all 4 files exist: continue silently.

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

If present and valid, load `${SACRED_TEMPLATE_DIR}/{tradition}/manifest.yaml`.

Apply tradition data to `.manuscript/output/metadata.yaml` (before STEP 3f writes the file):
- Set `lang:` to the tradition's primary language tag:
  - `arabic` script -> `ar`
  - `hebrew` script -> `he`
  - `ethiopic` script -> `am` (Amharic, primary Ge'ez liturgical language)
  - `tibetan` script -> `bo`
  - `devanagari` script -> `sa` (Sanskrit)
  - `latin` script -> use the project language from config.json (default `en`)
- Set `mainfont:` to the first entry in the manifest's `font_stack`. (`mainfont` is the Pandoc variable the Typst book/chapbook templates read for the body font; `font-family` is not.)

If `rtl: true` in the manifest, add `--metadata dir=rtl` to the Pandoc invocation in STEP 4.

If `approval_block.required: true` in the manifest, show after the build completes:
> **Note:** This tradition requires an approval block ("{{approval_block.label}}") before publication. Scope: {{approval_block.scope}}.

Proceed to STEP 1.8.

---

### STEP 1.8: WORK TYPE TEMPLATE SELECTION

Read `work_type` from `.manuscript/config.json`.

**If `--platform` is one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7` (academic publisher platforms):**

Map the platform to its LaTeX wrapper template:

| Platform | LATEX_TEMPLATE |
|----------|----------------|
| `ieee` | `${EXPORT_TEMPLATE_DIR}/scriveno-ieee.latex` |
| `acm` | `${EXPORT_TEMPLATE_DIR}/scriveno-acm.latex` |
| `lncs` | `${EXPORT_TEMPLATE_DIR}/scriveno-lncs.latex` |
| `elsevier` | `${EXPORT_TEMPLATE_DIR}/scriveno-elsevier.latex` |
| `apa7` | `${EXPORT_TEMPLATE_DIR}/scriveno-apa7.latex` |

Set `LATEX_TEMPLATE` to the resolved path.

If the template file does not exist at that path:
> **Build template missing: `{resolved template path}` not found.**
> Reinstall Scriveno for the active runtime or restore the shared asset.

Then **stop**.

Set `TYPST_TEMPLATE` to null (Typst path is not used for academic platforms). Proceed to STEP 2.

---

Map `work_type` to the appropriate Typst template:

| work_type | Template |
|-----------|----------|
| `stage_play` | `${EXPORT_TEMPLATE_DIR}/scriveno-stageplay.typst` |
| `picture_book` | `${EXPORT_TEMPLATE_DIR}/scriveno-picturebook.typst` |
| `poetry_collection` | `${EXPORT_TEMPLATE_DIR}/scriveno-chapbook.typst` |
| `single_poem` | `${EXPORT_TEMPLATE_DIR}/scriveno-chapbook.typst` |
| All other work types | `${EXPORT_TEMPLATE_DIR}/scriveno-book.typst` |

Set the resolved template path as `TYPST_TEMPLATE` for use in STEP 4.

If the resolved template file does not exist at the path:
> **Build template missing: `{TYPST_TEMPLATE}` not found.**
> Reinstall Scriveno for the active runtime or restore the shared asset.

Then **stop**.

Proceed to STEP 2.

---

### STEP 2: CHECK PREREQUISITES

Check for Pandoc:

```bash
command -v pandoc >/dev/null 2>&1
```

If Pandoc is not found:

> **Pandoc is required for print PDF build but is not installed.**
>
> **Install Pandoc:**
> - macOS: `brew install pandoc`
> - Linux: `sudo apt install pandoc`
> - Windows: `choco install pandoc`
> - Or download from https://pandoc.org/installing.html
>
> After installing, run this build command again.

Then **stop** -- do not attempt the build without the required tool.

**If `--platform` is NOT one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7`, check for Typst:**

```bash
command -v typst >/dev/null 2>&1
```

If Typst is not found:

> **Typst is required for print PDF build but is not installed.**
>
> **Install Typst:**
> - macOS: `brew install typst`
> - Linux: Download from https://github.com/typst/typst/releases
> - Windows: `winget install typst`
> - Or visit https://typst.app for installation options
>
> After installing, run this build command again.

Then **stop**.

If `--platform ingram` was passed, also check Ghostscript:

```bash
command -v gs >/dev/null 2>&1
```

If Ghostscript is not found:

> **Ghostscript is required for IngramSpark PDF/X-1a output but is not installed.**
>
> **Install Ghostscript:**
> - macOS: `brew install ghostscript`
> - Linux: `sudo apt install ghostscript`
> - Windows: `choco install ghostscript`
> - Or download from https://www.ghostscript.com/releases/gsdnld.html
>
> After installing, run this build command again.

Then **stop**.

**If `--platform` is one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7`, check for kpsewhich (TeX distribution presence):**

```bash
command -v kpsewhich >/dev/null 2>&1
```

If kpsewhich is not found:

> **No TeX distribution found. kpsewhich is required to verify LaTeX class availability.**
>
> **Install a TeX distribution:**
> - macOS: `brew install basictex` (BasicTeX, ~100 MB) or `brew install mactex` (full TeX Live, ~4 GB)
> - Linux: `sudo apt install texlive-base` or download TeX Live from https://tug.org/texlive/
> - Windows: Download MiKTeX from https://miktex.org/ or TeX Live from https://tug.org/texlive/
>
> After installing, run this build command again.

Then **stop**.

Map the platform to its publisher class file and `tlmgr` package:

| Platform | Class file | tlmgr package |
|----------|-----------|---------------|
| `ieee` | `IEEEtran.cls` | `ieeetran` |
| `acm` | `acmart.cls` | `acmart` |
| `lncs` | `llncs.cls` | `llncs` |
| `elsevier` | `elsarticle.cls` | `elsarticle` |
| `apa7` | `apa7.cls` | `apa7` |

Check for the publisher class:

```bash
kpsewhich <CLASS_FILE> >/dev/null 2>&1
```

If the class is not found, show the platform-specific install command:

- For `ieee` (IEEEtran.cls not found):
  > **`IEEEtran.cls` is not installed in your TeX distribution.**
  > Install it: `tlmgr install ieeetran`
  > After installing, run this build command again.

- For `acm` (acmart.cls not found):
  > **`acmart.cls` is not installed in your TeX distribution.**
  > Install it: `tlmgr install acmart`
  > After installing, run this build command again.

- For `lncs` (llncs.cls not found):
  > **`llncs.cls` is not installed in your TeX distribution.**
  > Install it: `tlmgr install llncs`
  > If `tlmgr` is unavailable, download `llncs.cls` from Springer's author resources:
  > https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines
  > After installing, run this build command again.

- For `elsevier` (elsarticle.cls not found):
  > **`elsarticle.cls` is not installed in your TeX distribution.**
  > Install it: `tlmgr install elsarticle`
  > After installing, run this build command again.

- For `apa7` (apa7.cls not found):
  > **`apa7.cls` is not installed in your TeX distribution.**
  > Install it: `tlmgr install apa7`
  > After installing, run this build command again.

Then **stop**.

---

### STEP 2.5: VALIDATE PLATFORM AND TRIM SIZE

**Resolve the platform slug:**

- If `--platform` was passed, use that value.
- If not passed, default to `kdp`.

**Validate the platform slug:**

Check that the slug is one of the following allowed values:
`kdp`, `ingram`, `apple`, `bn`, `d2d`, `kobo`, `google`, `smashwords`, `ieee`, `acm`, `lncs`, `elsevier`, `apa7`

If the platform slug is invalid:
> **Platform "{slug}" is not recognised.**
>
> Valid platforms: kdp, ingram, apple, bn, d2d, kobo, google, smashwords, ieee, acm, lncs, elsevier, apa7
>
> Example: `/scr:build-print --platform kdp`

Then **stop**.

**Check for EPUB-only platforms.** If the platform is any of: `apple`, `bn`, `d2d`, `kobo`, `google`, `smashwords`:
> **{PLATFORM} is an EPUB-only platform and does not accept print PDFs.**
>
> To build an EPUB for this platform, run: `/scr:build-ebook --platform {slug}`

Then **stop**.

**If platform is an academic publisher platform** (`ieee`, `acm`, `lncs`, `elsevier`, `apa7`):

Skip trim-size validation and page-count guardrail -- these are not applicable to `.tex` output. Academic platforms have no trim size or page limit.

Proceed directly to STEP 3.

---

**Load manifest for selected platform:**

Load `${PLATFORM_TEMPLATE_DIR}/{platform}/manifest.yaml`.

**Resolve the trim size:**

- If `--trim` was passed, use that value.
- If not passed, use the manifest's `default_trim` value (6x9 for KDP and Ingram).

**Validate trim size against manifest:**

Check the trim size against the manifest's `trim_sizes` map. If the trim size is NOT in the map:

> **Trim size "{size}" is not supported for {PLATFORM}.**
>
> Supported trim sizes for {PLATFORM}: {list all keys from manifest.trim_sizes}
>
> Default trim: {manifest.default_trim}

Then **stop**.

**Page-count estimation and guardrail** (only when platform has `max_pages` in manifest):

Get manuscript word count by reading assembled markdown and counting words (split by whitespace). If word count cannot be determined, skip guardrail silently.

Estimate page count:
```
estimated_pages = Math.round(word_count / manifest.trim_sizes[trim].wpp)
```

Compare against `manifest.max_pages`:
- For paperback: compare against `manifest.max_pages.paperback`
- For hardcover: the hardcover page limit applies to KDP only. Compare against `manifest.max_pages.hardcover` only if `--hardcover` was passed AND the platform is `kdp` AND the manifest defines `max_pages.hardcover`. For any other platform (for example `ingram`, which defines only `max_pages.paperback`), ignore `--hardcover` for the page-limit check and use `manifest.max_pages.paperback`.

If `estimated_pages` exceeds the limit:

- If `--strict` was NOT passed (default warning mode):
  > WARNING Estimated {estimated_pages} pages at {trim} ({PLATFORM} paperback limit: {MAX}pp). Consider IngramSpark (1200pp). Building anyway...

- If `--strict` was passed (hard block):
  > **Build blocked (--strict): Estimated {estimated_pages} pages at {trim} exceeds {PLATFORM} paperback limit ({MAX}pp).**
  >
  > **Options:**
  > - Switch platform: `/scr:build-print --platform ingram`
  > - Reduce manuscript length
  > - Remove `--strict` to build anyway with a warning

  Then **stop**.

---

### STEP 3: ASSEMBLE MANUSCRIPT

This step builds the complete manuscript from its component files. All formats use this assembled file as input.

**3a. Read OUTLINE.md for document order:**

Read `.manuscript/OUTLINE.md` and parse the scene/chapter list. Extract the ordered list of body units (scenes, chapters, sections) with their file paths in `.manuscript/drafts/body/`.

**3b. Scan front matter:**

Read all files in `.manuscript/front-matter/` directory. Sort by numeric prefix to maintain Chicago Manual of Style order.

**Scaffold exclusion:** Omit any files whose path appears in the scaffold exclusion list from STEP 1.6a.

If no front matter files exist, proceed with body content only.

**3c. Read body drafts:**

For each unit listed in OUTLINE.md, look for the corresponding draft file in `.manuscript/drafts/body/`. Read in OUTLINE.md order. Warn on any missing units.

**3d. Scan back matter:**

Read all files in `.manuscript/back-matter/` directory. Sort alphabetically. Back matter is optional.

**3e. Concatenate and write:**

Assemble the full manuscript in this order:
1. Front matter files (sorted by numeric prefix)
2. Body draft files (ordered by OUTLINE.md)
3. Back matter files (sorted alphabetically)

Insert `\newpage` page break markers between major sections.

```bash
mkdir -p .manuscript/output
```

Write assembled content to `.manuscript/output/assembled-manuscript.md`.

**3f. Generate metadata.yaml:**

Read `.manuscript/config.json` and `.manuscript/WORK.md` (if it exists) to generate Pandoc metadata. Write to `.manuscript/output/metadata.yaml`.

**Resolve book identity (fallback contract, `docs/naming-conventions.md` section 2):** prefer the config key, and fall back to today's source only when it is absent or empty:

- `title`: config `title`, else the first H1 in `.manuscript/WORK.md`.
- `author`: config `author`, else the WORK.md author field, else leave blank and do not invent one.
- `language`: config `translation.source_language`, else `en`. (Language has a single home in the `translation` block; it is not a top-level key.)

Use the resolved values when writing `metadata.yaml`.

Use a scalar or list-of-strings `author` value for shared Pandoc metadata, for example `author: "[author from config.json]"`. Do not use the Typst-only map shape `author: [{name: ...}]`; it can produce broken EPUB metadata when the same metadata file is reused. The shipped Typst templates accept scalar authors and the older map shape for backward compatibility.

---

### STEP 4: BUILD PDF

**If `--platform` is one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7` (academic LaTeX route):**

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/paper-{platform}.tex \
  --template="$EXPORT_TEMPLATE_DIR/scriveno-{platform}.latex" \
  --metadata-file=.manuscript/output/metadata.yaml
```

Note: No `--pdf-engine` flag is used. Pandoc produces LaTeX source (`.tex`) only. To compile to PDF, run in `.manuscript/output/`:

```bash
# Typical pdflatex compilation workflow:
pdflatex paper-{platform}.tex
bibtex paper-{platform}
pdflatex paper-{platform}.tex
pdflatex paper-{platform}.tex
```

Proceed to STEP 5.

---

Look up trim dimensions from manifest:
- `width_in` from `manifest.trim_sizes[trim].width_in`
- `height_in` from `manifest.trim_sizes[trim].height_in`

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/print-{platform}.pdf \
  --pdf-engine=typst \
  --template={TYPST_TEMPLATE} \
  --metadata-file=.manuscript/output/metadata.yaml \
  --toc \
  --toc-depth=2 \
  -V paperwidth={width_in}in \
  -V paperheight={height_in}in \
  -V margin-inside=0.75in \
  -V margin-outside=0.5in \
  -V margin-top=0.75in \
  -V margin-bottom=0.75in
```

**Slugged copy (additive, `docs/naming-conventions.md` sections 4-5):** the canonical print interior stays `print-{platform}.pdf` exactly as today, and remains the stable contract other commands and tests rely on. Additionally, only when `.manuscript/config.json` has a non-empty `slug`, also write a self-describing slugged copy alongside the canonical interior with `cp` (never replace the canonical literal). Compose the slugged name with the slug helper so it follows the deliverable grammar `{slug}[-{platform}].pdf`, where `<data-dir>` resolves to `.scriveno/lib`, `$HOME/.scriveno/lib`, or `lib/` in the source repo:

```bash
SLUGGED_NAME=$(node "<data-dir>/lib/slug.js" --name slug={slug} platform={platform} ext=pdf)
cp .manuscript/output/print-{platform}.pdf ".manuscript/output/${SLUGGED_NAME}"
```

When the project has no `slug`, write only the canonical literal and skip the copy. Report both paths in STEP 5.

**For IngramSpark (`--platform ingram`):** After Pandoc generates the PDF, note to the writer that a PDF/X-1a conversion via Ghostscript may be required for final IngramSpark submission. Provide the command pattern but do not auto-run it (the conversion is destructive and the writer should verify the intermediate PDF first):

```bash
# PDF/X-1a conversion for IngramSpark submission (run manually after verifying the PDF above):
gs -dPDFX -dBATCH -dNOPAUSE \
  -dPDFXCompatibilityPolicy=1 \
  -sColorConversionStrategy=CMYK \
  -sDEVICE=pdfwrite \
  -sOutputFile=.manuscript/output/print-ingram-cmyk.pdf \
  .manuscript/output/print-ingram.pdf
```

The canonical CMYK output stays `print-ingram-cmyk.pdf`. When `.manuscript/config.json` has a non-empty `slug`, the writer may also keep a slugged copy alongside it (`docs/naming-conventions.md` sections 4-5), composed with the slug helper so it follows the deliverable grammar `{slug}-ingram-cmyk.pdf`:

```bash
# Optional slugged copy after the CMYK conversion above (only when config slug is non-empty):
cp .manuscript/output/print-ingram-cmyk.pdf ".manuscript/output/$(node "<data-dir>/lib/slug.js" --name slug={slug} platform=ingram ext=pdf | sed 's/\.pdf$/-cmyk.pdf/')"
```

---

### STEP 5: REPORT

**If `--platform` is NOT one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7`:**

Show:

```
OK PDF built -> .manuscript/output/print-{platform}.pdf ({file_size})
```

Get file size with:
```bash
ls -lh .manuscript/output/print-{platform}.pdf | awk '{print $5}'
```

**Report both paths when a slugged copy was written (`docs/naming-conventions.md` sections 4-5).** When `.manuscript/config.json` has a non-empty `slug`, also show the slugged copy so the writer knows which file is which:

```
OK Slugged copy -> .manuscript/output/{slug}-{platform}.pdf
```

The canonical `print-{platform}.pdf` remains the stable default; the slugged copy is the self-describing artifact a writer collects for upload. When the project has no `slug`, report only the canonical path.

Then report the canonical cover file that pairs with this interior:

- If `--hardcover` was passed: `.manuscript/build/hardcover-cover.pdf`
- Otherwise: `.manuscript/build/paperback-cover.pdf`

Include this note:

> **Cover pairing:** Scriveno expects the matching finished print cover in `.manuscript/build/`. Exact wrap width, spine width, and safety guides must come from the current IngramSpark cover template generator (paperback for perfect-bound, hardcover for case laminate). Scriveno does not hard-code those final cover dimensions in this command.

**If `--platform` IS one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7`, show instead:**

```
OK LaTeX source built -> .manuscript/output/paper-{platform}.tex ({file_size})
  Compile with pdflatex or xelatex using your TeX distribution.
```

Get file size with:
```bash
ls -lh .manuscript/output/paper-{platform}.tex | awk '{print $5}'
```

## Response Contract

Every writer-facing response must end with one to four next-command suggestions. Each suggestion must include a short explanation of what that path will do.

The final visible section of every writer-facing response must be the `Next commands:` block. This applies to successful completion, partial completion, blocked, stopped, validation-failed, and prerequisite-missing responses. Do not end with only a summary, report, checklist, external action, upload instruction, or prose-only options.

Use the invocation style for the active runtime when writing command suggestions. Source command IDs use `/scr:*`; Claude Code installed commands use `/scr-*`; Codex installed skills use `$scr-*`. Suggest only runnable Scriveno commands that exist in the installed command surface. Do not invent adjacent workflow names.

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
