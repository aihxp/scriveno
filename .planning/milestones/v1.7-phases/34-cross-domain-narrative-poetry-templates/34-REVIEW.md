---
phase: 34-cross-domain-narrative-poetry-templates
reviewed: 2026-04-17T22:15:53Z
depth: standard
files_reviewed: 13
files_reviewed_list:
  - commands/scr/build-ebook.md
  - commands/scr/build-poetry-submission.md
  - commands/scr/build-print.md
  - commands/scr/build-smashwords.md
  - data/CONSTRAINTS.json
  - data/export-templates/scriveno-chapbook.typst
  - data/export-templates/scriveno-fixed-layout-epub.css
  - data/export-templates/scriveno-fixed-layout.opf
  - data/export-templates/scriveno-picturebook.typst
  - data/export-templates/scriveno-poetry-submission-styles.md
  - data/export-templates/scriveno-smashwords-styles.md
  - data/export-templates/scriveno-stageplay.typst
  - test/phase34-cross-domain-templates.test.js
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Phase 34: Code Review Report

**Reviewed:** 2026-04-17T22:15:53Z
**Depth:** standard
**Files Reviewed:** 13
**Status:** issues_found

## Summary

Phase 34 delivers six new export templates (stage play, picture book, fixed-layout EPUB, chapbook, Smashwords DOCX, poetry submission DOCX) plus updated build commands and a regression test suite. The architecture is sound and consistent with the project's pure-skill pattern. All binary template files exist and the test suite is thorough.

Four warnings were found across the command files: a wrong output path in the fixed-layout EPUB report step, a scaffold-exclusion gate missing from build-smashwords, a hardcoded language value in build-poetry-submission that ignores the project config, and an unconditional `--toc` flag in build-poetry-submission that produces a single-entry TOC for one-poem projects. Four info-level items cover a template margin-override limitation, a test inconsistency, a stale hardcoded resolution value, and a missing explanatory comment in the stage play template.

---

## Warnings

### WR-01: build-ebook STEP 5 reports wrong output path for fixed-layout builds

**File:** `commands/scr/build-ebook.md:354-362`
**Issue:** The STEP 5 report block unconditionally shows `ebook.epub` in both the success message and the `ls` file-size command. However, the fixed-layout Pandoc invocation (STEP 4b) writes to `ebook-fixed-layout.epub`. When `--fixed-layout` is active, the user sees a success line pointing at a file that was never written to that path, and the `ls` command returns an error or empty string.
**Fix:** Parameterize STEP 5 on whether `--fixed-layout` is active:
```
If --fixed-layout is active:
  [x] EPUB built -> .manuscript/output/ebook-fixed-layout.epub ({file_size})
  ls -lh .manuscript/output/ebook-fixed-layout.epub | awk '{print $5}'
Else:
  [x] EPUB built -> .manuscript/output/ebook.epub ({file_size})
  ls -lh .manuscript/output/ebook.epub | awk '{print $5}'
```

---

### WR-02: build-smashwords skips scaffold front-matter exclusion (STEP 1.6 not run)

**File:** `commands/scr/build-smashwords.md:94-104`
**Issue:** STEP 3 delegates to "/scr:build-ebook STEP 3a-3e" for assembly, but `build-smashwords` never runs STEP 1.6 (scaffold exclusion gate). Without STEP 1.6, the scaffold exclusion list is never populated, so any front-matter file with `scaffold: true` will be included in the DOCX output. Both `build-ebook.md` and `build-print.md` include STEP 1.6 between STEP 1.5 and STEP 2. `build-smashwords` omits it entirely.
**Fix:** Add STEP 1.6 to `build-smashwords.md` between STEP 1.5 and STEP 2, identical to the one in `build-ebook.md`. The scaffold exclusion list it populates must then be passed into the STEP 3 assembly logic:
```markdown
### STEP 1.6: FRONT-MATTER GATE

Follow /scr:build-ebook STEP 1.6a-1.6b (scaffold exclusion and GENERATE auto-refresh).
Use the resulting scaffold exclusion list in STEP 3 assembly.
```

---

### WR-03: build-poetry-submission hardcodes `lang: "en"` regardless of project language

**File:** `commands/scr/build-poetry-submission.md:125-133`
**Issue:** The metadata.yaml generated in STEP 3d writes `lang: "en"` unconditionally. A Spanish-language poetry collection (`lang: "es"` in config.json) produces a DOCX flagged as English, affecting Word's spell-check language, hyphenation engine, and any screen-reader language tag in the output. Every other build command (`build-ebook`, `build-print`) reads `lang` from config.json and falls back to `en` only when absent. The `lang` field is already read from config.json in STEP 1, so no additional file read is required.
**Fix:** Replace the hardcoded value with a config-driven fallback:
```yaml
lang: "[language from config.json, default en]"
```

---

### WR-04: build-poetry-submission always emits `--toc` regardless of poem count

**File:** `commands/scr/build-poetry-submission.md:139-146`
**Issue:** The Pandoc invocation in STEP 4 unconditionally passes `--toc --toc-depth=2`. The `scriveno-poetry-submission-styles.md` reference doc specifies that a TOC is "Required for collections of 5+ poems." However, `build-poetry-submission` is available for all three `poetry` group work types, including `single_poem` and `song_lyric`. A single-poem submission with a TOC page is non-standard and will look incorrect to journal editors. Additionally, the style doc's "5+ poems" threshold is never applied; even a two-poem set gets a TOC.
**Fix:** Count the poem units from OUTLINE.md (already parsed in STEP 3b) and apply `--toc` conditionally:
```bash
# Include --toc only when poem count >= 5 (per style guide requirement):
pandoc .manuscript/output/assembled-poetry.md \
  -o .manuscript/output/poetry-submission.docx \
  --reference-doc=data/export-templates/scriveno-poetry-submission.docx \
  --metadata-file=.manuscript/output/poetry-metadata.yaml \
  $if(poem_count >= 5)$--toc --toc-depth=2$endif$
```

---

## Info

### IN-01: scriveno-picturebook.typst applies only `margin-top` override to all four margins

**File:** `data/export-templates/scriveno-picturebook.typst:21`
**Issue:** `margin-all` is set from `$if(margin-top)$$margin-top$$else$0.375in$endif$`. All four page margins then use this single value. Passing `-V margin-bottom=1in` via Pandoc has no effect - only `margin-top` is read. The uniform-margin intent for bleed consistency is valid, but it is undocumented and differs from the chapbook and stageplay templates which each accept independent per-side overrides. A user following the chapbook pattern will be confused when per-side overrides are silently ignored.
**Fix:** Add a comment in the template header explaining the single-variable design:
```
// Margins: all four sides use a single override (-V margin-top=X).
// Per-side overrides are intentionally not supported to maintain bleed consistency.
```

---

### IN-02: Test suite uses `fs.existsSync()` for binary DOCX checks, inconsistent with readFile pattern

**File:** `test/phase34-cross-domain-templates.test.js:217` and `test/phase34-cross-domain-templates.test.js:319`
**Issue:** The TPL-04 test at line 217 and the TPL-06 test at line 319 use `fs.existsSync(SW_DOCX)` directly inside `assert.ok(...)`. Every other file-existence test in this suite uses `readFile()` followed by `assert.ok(content !== null, 'descriptive message')`. The `fs.existsSync` path produces a bare `false` assertion failure with no file-path hint, making CI failures harder to diagnose quickly.
**Fix:** Use `readFile` with a descriptive message for consistency:
```js
it('scriveno-smashwords.docx exists - TPL-04', () => {
  const content = readFile(SW_DOCX);
  assert.ok(content !== null, 'data/export-templates/scriveno-smashwords.docx must exist - TPL-04');
});
```

---

### IN-03: scriveno-fixed-layout.opf hardcodes `original-resolution` at 1024x768

**File:** `data/export-templates/scriveno-fixed-layout.opf:15`
**Issue:** `<meta name="original-resolution" content="1024x768"/>` is an iBooks-specific tag. The value 1024x768 is the original iPad (2010) resolution. Modern iPads render at 2048x1536 or higher. Apple Books still accepts the tag, but supplying a low resolution value may cause the renderer to use lower-quality scaling. The surrounding comment says "Replace with actual book metadata below" but does not explicitly flag `original-resolution` as a value to replace, so users are likely to leave it as-is.
**Fix:** Add an inline comment flagging this value:
```xml
<!-- Replace with your actual book page dimensions in pixels (e.g., 2048x1536 for retina iPad) -->
<meta name="original-resolution" content="1024x768"/>
```

---

### IN-04: scriveno-stageplay.typst has no comment explaining the absence of an auto-TOC

**File:** `data/export-templates/scriveno-stageplay.typst:126-129`
**Issue:** `scriveno-chapbook.typst` includes an optional auto-generated TOC block (lines 111-118) before `$body$`. `scriveno-stageplay.typst` has no TOC block. This is correct - stage plays use an author-written Dramatis Personae page, not an auto-generated TOC. However, the template header says nothing about this omission. A user familiar with the chapbook template may expect `--toc` to work the same way and be confused when it silently produces nothing in the stage play layout.
**Fix:** Add a comment after the title page block in `scriveno-stageplay.typst`:
```
// No auto-TOC block: stage plays use a Dramatis Personae page (author-written prose),
// not an auto-generated outline. Pandoc's --toc flag has no effect here.
// If a scene-by-scene index is needed, add: #outline(title: "Scenes", depth: 2)
```

---

_Reviewed: 2026-04-17T22:15:53Z_
_Reviewer: Claude (code reviewer)_
_Depth: standard_
