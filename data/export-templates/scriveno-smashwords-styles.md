# Smashwords / Draft2Digital (D2D) Style Guide -- Reference DOCX Styles

## Purpose

`scriveno-smashwords.docx` is a Pandoc reference document used with:

```
pandoc ... --reference-doc=data/export-templates/scriveno-smashwords.docx -o output.docx
```

Pandoc maps its internal styles to the named styles in this reference doc.

## Style Guide Compliance Rules

These rules come from the official [Smashwords Style Guide](https://www.smashwords.com/books/view/52) and apply to D2D (Draft2Digital) submissions.

### Critical Rules (will cause rejection if violated)

1. **no tabs** -- Never use tab characters anywhere in the document. Indentation must be set via paragraph style, not keystrokes.
2. **First-line indent via paragraph style only** -- Use the `FirstLineIndent` or body text paragraph style to set a 0.3in first-line indent. Do not use spaces, non-breaking spaces, or tab characters to create indents.
3. **No blank lines between paragraphs in indented styles** -- For indented body text, use only paragraph spacing (Space Before/After) not blank paragraph returns.
4. **No custom headers or footers** -- Smashwords/D2D auto-generate these. Any custom header/footer will be stripped or cause errors.
5. **Auto-generated TOC only** -- Do not create a manual TOC. Pandoc's `--toc` flag generates a Word-compatible field-based TOC that Smashwords accepts.
6. **No tables of fixed width** -- Use percentage-width or relative tables only.
7. **No text boxes** -- Content in text boxes is ignored by most ebook converters.

## Pandoc Style Mapping

| Pandoc Style | Word Style Name | Notes |
|-------------|-----------------|-------|
| Body Text | `Normal` | First-line indent: 0.3in, no extra space before/after |
| Heading 1 | `Heading 1` | Chapter title, used for TOC |
| Heading 2 | `Heading 2` | Section title, used for TOC |
| Block Quote | `Block Text` | Indented 0.5in left, no first-line indent |
| Code Block | `Verbatim Char` | Monospace, no indent |

## When to Regenerate the DOCX Binary

Run this command after any style change (requires Pandoc):

```bash
pandoc --print-default-data-file reference.docx > data/export-templates/scriveno-smashwords.docx
```

Then open in Word/LibreOffice and modify the paragraph styles per the mapping table above.
