---
description: Export translated editions in all target formats with localized front/back matter and language-specific formatting.
argument-hint: "[--languages <lang1,lang2,...>] [--format <format>] [--all-languages] [--all-formats]"
---

# /scr:multi-publish -- Multi-Language Export

Export translated editions in all target formats with localized front matter, back matter, and language-specific formatting. Chains to the export command for each language with language-specific metadata and output paths.

## Usage

```
/scr:multi-publish [--languages <lang1,lang2,...>] [--format <format>] [--all-languages] [--all-formats]
```

- `--languages <lang1,lang2,...>` -- Comma-separated list of language codes to export
- `--format <format>` -- Specific export format (markdown, docx, pdf, epub, etc.)
- `--all-languages` -- Export all languages in `target_languages`
- `--all-formats` -- Export all available formats for the work type

If no flags are given, prompt the writer for language and format selection.

## Instruction

You are a **multi-language publishing specialist**. Your job is to take translated manuscripts and produce publication-ready exports for each language, with properly localized front matter, back matter, and language-specific formatting conventions.

---

### STEP 0: BOOTSTRAP (context-cost protocol)

Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it as your orientation source for project title, work type, phase, current unit, and open items. In STEP 1, skip the raw-file loads for those fields -- still load language manifests, translation glossaries, and any per-language config CONTEXT.md does not surface.

If CONTEXT.md is missing, stale, or contradicts STATE.md, fall back to the original loads in STEP 1 unchanged. See `docs/context-protocol.md` for the contract.

---

### STEP 1: LOAD CONTEXT

1. Load `.manuscript/config.json` for `target_languages`, `source_language`, `work_type`, title, author
2. Load Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) -- check prerequisites: `multi-publish` requires `translate` and `kdp-package`
3. Load `.manuscript/OUTLINE.md` for document structure
4. Check which translations exist by scanning `.manuscript/translation/` for language subdirectories with drafts

**If no flags are provided:**
> Which languages would you like to export?
>
> Available translations: [list languages with translations]
>
> And which format(s)?
> 1. epub -- Ebook (all stores)
> 2. docx -- Manuscript format
> 3. pdf -- PDF (manuscript)
> 4. pdf --print-ready -- Print-ready PDF
> 5. markdown -- Plain markdown
> 6. kdp-package -- Amazon KDP package
> 7. ingram-package -- IngramSpark package
> 8. All available formats

**If `--all-languages`:** Resolve to all languages that have completed translations in `.manuscript/translation/{lang}/drafts/`. Skip any language without translations and note it:
> Skipping [language] -- no translation found. Run `/scr:translate [language]` first.

**If `--all-formats`:** Resolve to all export formats available for the current work type group (check `CONSTRAINTS.json` exports section).

---

### STEP 2: CHECK PREREQUISITES

For each selected language, verify:

1. Translation drafts exist at `.manuscript/translation/{lang}/drafts/`
2. The export pipeline is functional (check for required tools based on format -- same checks as `/scr:export`)
3. Source front matter exists at `.manuscript/front-matter/` (will be used as basis for localization)
4. Source back matter exists at `.manuscript/back-matter/` (will be used as basis for localization)

If front or back matter is missing from the source:
> **Note:** No source [front/back] matter found. Localized [front/back] matter cannot be generated without a source. Run `/scr:[front-matter/back-matter]` first, or export will include body content only.

---

### STEP 3: LOCALIZE FRONT MATTER (per language)

For each language, generate translated front matter elements. Store in `.manuscript/translation/{lang}/front-matter/`.

#### 3a. Title Page

- Translate the title and subtitle into the target language
- Author name: keep in original script by default. If the target language uses a different script (e.g., Japanese, Arabic, Chinese, Korean), also provide the author name transliterated into the target script
- Publisher name: keep original or translate if a local imprint is configured

Save to `.manuscript/translation/{lang}/front-matter/03-title-page.md`

#### 3b. Copyright Page

Generate a translated copyright notice:

```
Copyright (c) [Year] [Author Name]
[Translated "All rights reserved" in target language]

[Translation credit line]:
[Translated by: [translator name if configured, or "Machine-assisted translation"]]

[ISBN for this language edition if configured in config.json]
[Original title: [source title] by [author]]
```

Save to `.manuscript/translation/{lang}/front-matter/04-copyright.md`

#### 3c. Dedication and Epigraph

- If the source dedication exists, translate it. If the writer has marked it as "preserve in source language" in config, keep the original.
- If the source epigraph exists, translate it and include the original attribution.

Save to `.manuscript/translation/{lang}/front-matter/05-dedication.md` and `06-epigraph.md` as applicable.

#### 3d. Table of Contents

Generate a translated table of contents using the translated chapter/section titles from the translation drafts.

Save to `.manuscript/translation/{lang}/front-matter/07-toc.md`

---

### STEP 4: LOCALIZE BACK MATTER (per language)

For each language, generate translated back matter elements. Store in `.manuscript/translation/{lang}/back-matter/`.

#### 4a. About the Author

Translate the author bio from `.manuscript/back-matter/about-author.md`.

Save to `.manuscript/translation/{lang}/back-matter/about-author.md`

#### 4b. Also By / Series Title

Translate the "Also by" list. If local marketplace ISBNs are configured (in `.manuscript/config.json` under `translations.{lang}.isbns`), include them. Otherwise, list titles with original ISBNs.

Save to `.manuscript/translation/{lang}/back-matter/also-by.md`

#### 4c. Acknowledgments

Translate the acknowledgments from `.manuscript/back-matter/acknowledgments.md` if it exists.

Save to `.manuscript/translation/{lang}/back-matter/acknowledgments.md`

#### 4d. Translator Acknowledgment

Auto-generate a translator credit line in the target language:

```markdown
# Translator's Note

This [work_type] was originally written in [source_language_name] by [author].
[Translation credit: translator name if configured, or translation method note.]
```

Save to `.manuscript/translation/{lang}/back-matter/translator-note.md`

---

### STEP 5: APPLY LANGUAGE-SPECIFIC FORMATTING

Before compiling the final document, apply formatting conventions specific to the target language.

#### 5a. Quotation Marks

Replace quotation marks with the target language convention:

| Language | Primary | Nested |
|----------|---------|--------|
| English (en) | \u201c \u201d | \u2018 \u2019 |
| French (fr) | \u00ab \u00bb | \u201c \u201d |
| German (de) | \u201e \u201c | \u201a \u2018 |
| Spanish (es) | \u00ab \u00bb | \u201c \u201d |
| Italian (it) | \u00ab \u00bb | \u201c \u201d |
| Japanese (ja) | \u300c \u300d | \u300e \u300f |
| Chinese (zh) | \u300c \u300d | \u300e \u300f |
| Russian (ru) | \u00ab \u00bb | \u201e \u201c |
| Portuguese (pt) | \u00ab \u00bb | \u201c \u201d |
| Polish (pl) | \u201e \u201d | \u00ab \u00bb |
| Korean (ko) | \u300c \u300d | \u300e \u300f |
| Arabic (ar) | \u00ab \u00bb | \u201c \u201d |
| Hebrew (he) | \u201c \u201d | \u2018 \u2019 |

#### 5b. Punctuation Spacing

Apply language-specific punctuation spacing rules:

- **French:** Insert thin non-breaking space (U+202F) before `;`, `:`, `!`, `?`. Insert thin non-breaking space after opening `\u00ab` and before closing `\u00bb`.
- **English:** No extra spacing around punctuation.
- **Other languages:** Follow standard conventions for the target language.

#### 5c. Text Direction

Determine text direction from language code:

- **RTL languages:** `ar` (Arabic), `he` (Hebrew), `fa` (Persian), `ur` (Urdu)
- **LTR languages:** All others

Set the appropriate direction for Pandoc and Typst output:
- Pandoc: `--variable dir=rtl` or `--variable dir=ltr`
- Typst: Uses `text-dir` parameter (already prepared in Phase 5 template)

#### 5d. Number Formatting

Apply locale-specific number formatting:

- **Decimal comma** (most of Europe, South America): 1.000,50
- **Decimal period** (English-speaking, East Asia): 1,000.50

Only convert numbers in narrative text, not in code blocks or technical references.

---

### STEP 6: COMPILE AND EXPORT

For each language and format combination:

#### 6a. Assemble Document

Compile the full translated document in order:

1. Localized front matter (from `.manuscript/translation/{lang}/front-matter/`, sorted by numeric prefix)
2. Translated body (from `.manuscript/translation/{lang}/drafts/`, ordered by OUTLINE.md)
3. Localized back matter (from `.manuscript/translation/{lang}/back-matter/`)

Insert `\newpage` page break markers between major sections.

Write the assembled document to `.manuscript/translation/{lang}/assembled-manuscript.md`.

#### 6b. Generate Language-Specific Metadata

Create metadata for Pandoc:

```yaml
---
title: "[translated title]"
subtitle: "[translated subtitle]"
author:
  - name: "[author name]"
language: "[lang code]"
dir: "[ltr or rtl]"
rights: "Copyright [year] [author]. [Translated rights statement]."
date: "[current year]"
translator: "[translator name if configured]"
original-title: "[source language title]"
---
```

Write to `.manuscript/translation/{lang}/metadata.yaml`.

#### 6c. Chain to Export

Invoke the export pipeline with language-specific parameters:

- **Output directory:** `.manuscript/output/translations/{lang}/`
- **Filename:** `manuscript-{lang}.{ext}` (e.g., `manuscript-fr.epub`, `manuscript-de.pdf`)
- **Metadata file:** `.manuscript/translation/{lang}/metadata.yaml`
- **Input file:** `.manuscript/translation/{lang}/assembled-manuscript.md`

For each format, run the equivalent of the export command with language-specific paths:

```bash
mkdir -p .manuscript/output/translations/{lang}

# Example for EPUB:
pandoc .manuscript/translation/{lang}/assembled-manuscript.md \
  -o .manuscript/output/translations/{lang}/manuscript-{lang}.epub \
  --metadata-file=.manuscript/translation/{lang}/metadata.yaml \
  --css=data/export-templates/scriveno-epub.css \
  --toc --toc-depth=2 --split-level=1

# Example for PDF:
pandoc .manuscript/translation/{lang}/assembled-manuscript.md \
  -o .manuscript/output/translations/{lang}/manuscript-{lang}.pdf \
  --pdf-engine=typst \
  --metadata-file=.manuscript/translation/{lang}/metadata.yaml \
  --toc --toc-depth=1 \
  -V dir={ltr|rtl}
```

#### 6d. Package (if applicable)

If the format is `kdp-package` or `ingram-package`, create a language-specific package:

- Output to `.manuscript/output/translations/{lang}/kdp-package/` or `.manuscript/output/translations/{lang}/ingram-package/`
- Include language-specific cover specs with translated title
- Include language-specific metadata with local marketplace ISBNs if configured

---

### STEP 7: SUMMARY

After all languages and formats are exported, display a summary:

```
Multi-Language Export Complete
==============================

| Language | Format | Output Path | Status |
|----------|--------|-------------|--------|
| French (fr) | epub | .manuscript/output/translations/fr/manuscript-fr.epub | Done |
| French (fr) | pdf | .manuscript/output/translations/fr/manuscript-fr.pdf | Done |
| German (de) | epub | .manuscript/output/translations/de/manuscript-de.epub | Done |

Languages exported: [count]
Formats per language: [count]
Total files: [count]
Output root: .manuscript/output/translations/

Localized elements per language:
  - Front matter: [count] elements
  - Back matter: [count] elements
  - Formatting applied: quotation marks, punctuation spacing, text direction

Next steps:
  - Review exported files in each language directory
  - Run /scr:cultural-adaptation <lang> if not already done
  - Run /scr:back-translate <lang> for quality verification
  - Upload language-specific packages to their respective marketplaces
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
