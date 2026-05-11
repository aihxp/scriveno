# Poetry Submission Manuscript -- Reference DOCX Styles

## Purpose

`scriven-poetry-submission.docx` is a Pandoc reference document used with:

```
pandoc ... --reference-doc=data/export-templates/scriven-poetry-submission.docx -o submission.docx
```

## Submission Format Standards

Poetry submission manuscripts follow conventions from journals (Poetry, Ploughshares, Kenyon Review) and contest guidelines (Academy of American Poets, etc.).

### Required Format

1. **Font**: `Times New Roman` 12pt for body text. `Garamond` is an acceptable alternative if the submitting journal specifies a serif at 12pt. Default to Times New Roman.
2. **Margins**: 1 inch all sides.
3. **One poem per page**: Each poem ends with a `page break` (Pandoc `\newpage` or `---` mapped to page break). No poem may run onto the next poem's page without a break.
4. **Poem title**: Heading 2, left-aligned, 12pt bold, same font as body.
5. **Title page**: First page of document contains:
   - Collection title (centered, 14pt bold)
   - Author name (centered, 12pt)
   - Contact information (centered, 12pt): email, address, phone
   - Word count / poem count (lower right or centered)
6. **TOC** (Table of Contents): Required for collections of 5+ poems. Auto-generated via Pandoc `--toc --toc-depth=2`.
7. **Line spacing**: Single-spaced within poems; one blank line between stanzas; page break between poems.
8. **No headers/footers** in submission drafts (page numbers only via Word field, not Scriven-written content).

## Pandoc Style Mapping

| Pandoc Style | Word Style Name | Notes |
|-------------|-----------------|-------|
| Body Text | `Normal` | Times New Roman 12pt, single-spaced, no indent |
| Heading 1 | `Heading 1` | Collection/section title, 14pt bold |
| Heading 2 | `Heading 2` | Poem title, 12pt bold |
| Page break | `\newpage` in markdown -> Word page break | Between each poem |

## When to Regenerate the DOCX Binary

```bash
pandoc --print-default-data-file reference.docx > data/export-templates/scriven-poetry-submission.docx
```

Then open in Word/LibreOffice and set Normal style to Times New Roman 12pt, single-spaced, 1in margins.
