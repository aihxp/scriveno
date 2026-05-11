---
description: Build a poetry submission manuscript DOCX with one poem per page, title page, and TOC.
argument-hint: "[--skip-validate]"
---

# /scr:build-poetry-submission -- Poetry Submission DOCX Build Pipeline

Assemble the manuscript and produce a submission-ready DOCX: one poem per page, 12pt Times New Roman or Garamond, title page (title + author + contact info), and auto-generated table of contents. Follows conventions from leading literary journals and the Academy of American Poets contest guidelines.

## Usage

```
/scr:build-poetry-submission [--skip-validate]
```

**Flags:**
  `--skip-validate`    Skip the scaffold marker pre-flight check (not recommended).

## Instruction

You are a **manuscript build specialist** for poetry submission DOCX output.

---

### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, language, contact info
- Scriven's installed/shared `CONSTRAINTS.json` -- to check `commands.build-poetry-submission.available` list: `["poetry"]`

If work type group is not in the available list:
> This command is available for poetry work types only (poetry_collection, single_poem, song_lyric). Prose writers should use `/scr:build-print` or `/scr:build-smashwords` instead.

Then **stop**.

---

### STEP 1.5: VALIDATE MANUSCRIPT

**Check for scaffold markers in `.manuscript/drafts/`.**

Scan all `.md` files for `[Fill in`, `[Delete if not applicable:]`, `Alternate 1:`, `Alternate 2:`, and multiple `# ` H1 headings.

**If `--skip-validate` was passed:**
> **Warning: Validate gate skipped (`--skip-validate`).**

Proceed to STEP 2.

**If markers are found:**
> **Build blocked: unresolved scaffold markers found.**
> [list each as: `path/to/file.md:LINE_NUMBER: marker text`]
> **Fix:** Run `/scr:cleanup --apply`, then re-run.

Then **stop**.

---

### STEP 2: CHECK PREREQUISITES

Check for Pandoc:
```bash
command -v pandoc >/dev/null 2>&1
```

If not found:
> **Pandoc is required for poetry submission DOCX build but is not installed.**
> - macOS: `brew install pandoc`
> - Linux: `sudo apt install pandoc`
> - Windows: `choco install pandoc`

Then **stop**.

Check that the reference document exists:

If `data/export-templates/scriven-poetry-submission.docx` does not exist:
> **Poetry submission reference document missing at `data/export-templates/scriven-poetry-submission.docx`.**
> Re-install Scriven or restore the file from the repository.

Then **stop**.

---

### STEP 3: ASSEMBLE MANUSCRIPT

**3a. Generate title page:**

Read from `.manuscript/config.json`: `title`, `author`, contact fields (`email`, `address`, `phone` if present).

Write `.manuscript/output/poetry-title-page.md`:

```markdown
# [TITLE]

[Author Name]

[Email] | [Address] | [Phone]

[N poems] | approx. [word_count] words

\newpage
```

(This title page will be prepended before the body content.)

**3b. Assemble body with per-poem page breaks:**

Read `.manuscript/OUTLINE.md`. For each poem unit in order:
- Read the corresponding `.manuscript/drafts/body/[poem-file]-DRAFT.md`
- Append `\newpage` after each poem's content

This ensures one poem per page in the output DOCX.

**3c. Concatenate:**

Full assembly order:
1. Poetry title page (`poetry-title-page.md`)
2. Body poems in OUTLINE.md order, each followed by `\newpage`

Write to `.manuscript/output/assembled-poetry.md`.

**3d. Generate metadata.yaml:**

```yaml
---
title: "[title from config.json]"
author:
  - name: "[author from config.json]"
lang: "[language from config.json, default en]"
---
```

Write to `.manuscript/output/poetry-metadata.yaml`.

---

### STEP 4: BUILD POETRY SUBMISSION DOCX

Count the number of poem units parsed from OUTLINE.md in STEP 3b. Per the `scriven-poetry-submission-styles.md` style guide, a TOC is required for collections of 5 or more poems only.

If poem count >= 5, include `--toc --toc-depth=2`:

```bash
pandoc .manuscript/output/assembled-poetry.md \
  -o .manuscript/output/poetry-submission.docx \
  --reference-doc=data/export-templates/scriven-poetry-submission.docx \
  --metadata-file=.manuscript/output/poetry-metadata.yaml \
  --toc \
  --toc-depth=2
```

If poem count < 5, omit `--toc` and `--toc-depth`:

```bash
pandoc .manuscript/output/assembled-poetry.md \
  -o .manuscript/output/poetry-submission.docx \
  --reference-doc=data/export-templates/scriven-poetry-submission.docx \
  --metadata-file=.manuscript/output/poetry-metadata.yaml
```

**Format applied by reference doc:**
- 12pt Times New Roman body text (Normal style)
- 1-inch margins all sides
- Single-spaced within poems; blank line between stanzas
- Auto-generated TOC field (poem titles become TOC entries via Heading 2 style) -- only emitted for collections of 5+ poems

---

### STEP 5: REPORT

Show:
```
OK Poetry submission DOCX built -> .manuscript/output/poetry-submission.docx ({file_size})
```

Get file size with:
```bash
ls -lh .manuscript/output/poetry-submission.docx | awk '{print $5}'
```
