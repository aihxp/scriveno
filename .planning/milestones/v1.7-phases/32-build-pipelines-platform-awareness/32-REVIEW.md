---
phase: 32-build-pipelines-platform-awareness
reviewed: 2026-04-17T16:18:54Z
depth: standard
files_reviewed: 12
files_reviewed_list:
  - commands/scr/build-ebook.md
  - commands/scr/build-print.md
  - data/CONSTRAINTS.json
  - templates/platforms/apple/manifest.yaml
  - templates/platforms/bn/manifest.yaml
  - templates/platforms/d2d/manifest.yaml
  - templates/platforms/google/manifest.yaml
  - templates/platforms/ingram/manifest.yaml
  - templates/platforms/kdp/manifest.yaml
  - templates/platforms/kobo/manifest.yaml
  - templates/platforms/smashwords/manifest.yaml
  - test/phase32-build-pipelines-platform-awareness.test.js
findings:
  critical: 1
  warning: 3
  info: 3
  total: 7
status: issues_found
---

# Phase 32: Code Review Report

**Reviewed:** 2026-04-17T16:18:54Z
**Depth:** standard
**Files Reviewed:** 12
**Status:** issues_found

## Summary

Reviewed two new build command markdown files (`build-ebook.md`, `build-print.md`), eight YAML platform manifests, two additions to `data/CONSTRAINTS.json`, and the 90-test suite. The platform manifests are clean and internally consistent. The CONSTRAINTS.json additions are correct and align with command availability. The test suite is well-structured and covers the critical contract points.

One critical architectural violation was found in `build-print.md`: the command references `lib/architectural-profiles.js` by name, which contradicts the project's core constraint of being a pure markdown/skill system with no compiled code. Three warnings were found: an undocumented `--hardcover` flag, a metadata duplication that can produce silent incorrect output, and a missing prerequisite check for the CSS template file. Three informational items are also noted.

---

## Critical Issues

### CR-01: build-print.md references a non-existent JS file, violating the pure skill architecture

**File:** `commands/scr/build-print.md:201`
**Issue:** STEP 2.5 instructs the agent to validate the platform slug by calling `validatePlatform(slug)` from `lib/architectural-profiles.js`. This is a direct architectural violation: `CLAUDE.md` explicitly requires "Must remain a pure skill/command system - no compiled code, no runtime dependencies beyond Node.js for the installer." The file `lib/architectural-profiles.js` does not exist in the codebase, and agent instruction files in this system are executed by an LLM that reads markdown - they do not invoke JavaScript functions. The validation logic should be expressed as a plain list check inside the markdown itself.

**Fix:** Replace the JS-function reference with an inline description of the validation rule:

```markdown
**Validate the platform slug:**

Check that the slug is one of the following allowed values:
`kdp`, `ingram`, `apple`, `bn`, `d2d`, `kobo`, `google`, `smashwords`

If the platform slug is not in that list, report the error and stop.
```

---

## Warnings

### WR-01: --hardcover flag is undocumented in the frontmatter argument-hint

**File:** `commands/scr/build-print.md:4` and `commands/scr/build-print.md:253`
**Issue:** The `argument-hint` in the YAML frontmatter lists `[--platform <platform>] [--trim <size>] [--strict] [--skip-validate]` but omits `[--hardcover]`. STEP 2.5, line 253 references this flag explicitly: "only if `--hardcover` flag is passed". The flag is functional and affects the page-count guardrail (switching from paperback to hardcover page limit), but it is invisible to users reading the usage line. Any agent surfacing the command's usage hint will not show `--hardcover`, making it a hidden flag.

**Fix:** Add `--hardcover` to the argument-hint:

```yaml
argument-hint: "[--platform <platform>] [--trim <size>] [--strict] [--hardcover] [--skip-validate]"
```

Also add a line in the `## Usage` section explaining its effect:

```
**Flags:**
  --hardcover    Use hardcover page limit for KDP (550pp) instead of paperback (828pp)
```

---

### WR-02: Duplicate and potentially conflicting language metadata in build-ebook.md

**File:** `commands/scr/build-ebook.md:213-219` and `commands/scr/build-ebook.md:246`
**Issue:** The generated `metadata.yaml` already includes `language: "[language from config.json, default en-US]"` (line 216), which Pandoc reads via `--metadata-file`. The Pandoc invocation then also appends `-V lang={language}` (line 246). Pandoc's `-V` sets a template variable; `--metadata-file` sets a metadata field. For EPUB output, Pandoc uses the `lang` metadata key for the `xml:lang` and `dc:language` attributes. When both are present with different values (e.g., `language: en-US` in the YAML vs `-V lang=en`), the `-V` value can override or conflict with the metadata file value depending on Pandoc version. Additionally, `{language}` is a literal substitution token the agent must resolve - if the agent does not perform the substitution, the literal string `{language}` is emitted as the lang value, producing an invalid EPUB.

**Fix:** Remove the `-V lang={language}` flag from the Pandoc invocation and rely solely on the `metadata.yaml` file. Rename the `language` key in metadata.yaml to `lang` (which is what Pandoc uses for the EPUB `xml:lang` attribute):

In STEP 3f, change the metadata template to use `lang`:
```yaml
lang: "[language from config.json, default en-US]"
```

Then remove line 246 (`-V lang={language}`) from the Pandoc invocation entirely.

---

### WR-03: No prerequisite check for the EPUB CSS template file in build-ebook.md

**File:** `commands/scr/build-ebook.md:128-146` (STEP 2)
**Issue:** STEP 2 checks for the `pandoc` binary but does not verify that `data/export-templates/scriveno-epub.css` exists before invoking Pandoc. The Pandoc invocation at line 242 passes `--css=data/export-templates/scriveno-epub.css`. If that file is absent, Pandoc will silently proceed and produce an EPUB without the custom stylesheet, with no warning to the user. Given that the CSS provides KDP-compatible EPUB styling (per CLAUDE.md), a missing CSS file produces a publication-quality defect without any visible error.

**Fix:** Add a check in STEP 2 immediately after the Pandoc check:

```markdown
Check for the EPUB stylesheet:

If `data/export-templates/scriveno-epub.css` does not exist:

> **EPUB stylesheet is missing at `data/export-templates/scriveno-epub.css`.**
> This file is required for properly styled EPUB output.
> Re-install Scriveno or restore the file from the repository.

Then **stop** - do not attempt the build without the stylesheet.
```

---

## Info

### IN-01: test readFile helper silently conflates "file not found" with all other filesystem errors

**File:** `test/phase32-build-pipelines-platform-awareness.test.js:17-20`
**Issue:** The `readFile` helper catches all errors and returns `null`, with the same downstream message ("could not be read") for both missing files and permission errors. On a locked-down CI filesystem a permission error would produce misleading failure messages ("build-ebook.md could not be read") that suggest the file doesn't exist when it actually does.

**Fix:**
```js
function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err; // re-throw unexpected errors (permissions, I/O) for visibility
  }
}
```

---

### IN-02: No test asserts EPUB-only platform rejection in build-print.md

**File:** `test/phase32-build-pipelines-platform-awareness.test.js` (missing coverage)
**Issue:** The test suite has no test verifying that `build-print.md` contains the exact rejection message used when an EPUB-only platform (apple, bn, d2d, kobo, google, smashwords) is passed to `/scr:build-print`. The message format in the command is `"{PLATFORM} is an EPUB-only platform and does not accept print PDFs."` Testing that this text is present ensures the rejection branch is not accidentally deleted.

**Fix:** Add to the PLATFORM-03 describe block:
```js
it('build-print.md contains EPUB-only platform rejection message - PLATFORM-03', () => {
  const content = readFile(BUILD_PRINT_PATH);
  assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
  assert.ok(
    content.includes('EPUB-only platform'),
    'build-print.md must contain EPUB-only platform rejection message - PLATFORM-03'
  );
});
```

---

### IN-03: Cover image check in build-ebook.md only handles .jpg extension

**File:** `commands/scr/build-ebook.md:249`
**Issue:** The command checks for `cover.jpg` only and provides no guidance if the writer places a `.png` cover at `cover.png`. Many designers deliver PNG covers. The command should either document that only JPEG is accepted at this path (and explain why), or add a note that PNG covers must be placed at `cover.jpg` or converted before building. As written, a writer with `cover.png` will silently get an EPUB with no cover.

**Fix:** Either extend the check:
```markdown
Check for cover image at `.manuscript/output/cover.jpg` or `.manuscript/output/cover.png`.
If a `.png` is found but no `.jpg`, use the `.png` with `--epub-cover-image=.manuscript/output/cover.png`.
If neither exists, omit the flag and show the no-cover note.
```

Or add a clarifying note in the existing check:
```markdown
> **Note:** Only `.jpg` cover images are supported at this path.
> If your cover is a `.png`, rename or convert it to `cover.jpg` before building.
```

---

_Reviewed: 2026-04-17T16:18:54Z_
_Reviewer: Claude (code reviewer)_
_Depth: standard_
