# Phase 32: Build Pipelines & Platform Awareness - Pattern Map

**Mapped:** 2026-04-17
**Files analyzed:** 12
**Analogs found:** 12 / 12

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `commands/scr/build-ebook.md` | command | request-response | `commands/scr/export.md` | exact |
| `commands/scr/build-print.md` | command | request-response | `commands/scr/export.md` | exact |
| `templates/platforms/kdp/manifest.yaml` | config | transform | `templates/platforms/ingram/manifest.yaml` (structure) | role-match |
| `templates/platforms/ingram/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` (structure) | role-match |
| `templates/platforms/apple/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` (structure) | role-match |
| `templates/platforms/bn/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` (structure) | role-match |
| `templates/platforms/d2d/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` (structure) | role-match |
| `templates/platforms/kobo/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` (structure) | role-match |
| `templates/platforms/google/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` (structure) | role-match |
| `templates/platforms/smashwords/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` (structure) | role-match |
| `data/CONSTRAINTS.json` | config | transform | `data/CONSTRAINTS.json` (existing `exports` section) | exact |
| `test/phase32-build-pipelines-platform-awareness.test.js` | test | request-response | `test/phase31-staged-front-matter-generation.test.js` | exact |

---

## Pattern Assignments

### `commands/scr/build-ebook.md` (command, request-response)

**Analog:** `commands/scr/export.md`

**Frontmatter pattern** (export.md lines 1-4):
```markdown
---
description: Compile and export manuscript to publication-ready formats.
argument-hint: "--format <format> [--formatted] [--print-ready]"
---
```
For build-ebook.md adapt to:
```markdown
---
description: Build a publication-ready EPUB from the manuscript for a target platform.
argument-hint: "[--platform <platform>] [--skip-validate]"
---
```

**Command heading pattern** (export.md line 6):
```markdown
# /scr:export -- Manuscript Export
```
Adapt to:
```markdown
# /scr:build-ebook -- EPUB Build Pipeline
```

**STEP 1 — Load context + CONSTRAINTS check pattern** (export.md lines 50-84):
```markdown
### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, language, and project settings
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) -- to check `exports` section for format availability by work type group

**Check format availability:**

Look up the requested format in `CONSTRAINTS.json` under the `exports` section.
Find the current work type's group in `CONSTRAINTS.json` under `work_type_groups`.
Check if the group is in the format's `available` list (or if `available` contains `"all"`).

If the format is **not available** for the current work type:
> This format is not available for [work_type] projects. Available export formats for [group] work types are: [list available formats].

Then **stop**.
```
For build-ebook, the constraint key is `epub` — available for `["prose", "visual", "poetry", "interactive", "sacred"]`.

**STEP 1.5 — Validate gate pattern** (export.md lines 87-115 and publish.md lines 36-65):
This block is IDENTICAL in export.md and publish.md. Copy verbatim:
```markdown
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
```

**STEP 1.6 — Front-matter gate pattern** (export.md lines 118-164 and publish.md lines 68-114):
This block is IDENTICAL in export.md and publish.md. Copy verbatim into build-ebook.md and build-print.md.

**STEP 2 — Prerequisite detection pattern** (export.md lines 167-222):
```markdown
### STEP 2: CHECK PREREQUISITES

**For build-ebook (Pandoc only):**

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

Then **stop** -- do not attempt build without the required tool.
```
This pattern is from export.md lines 174-195. For build-ebook, check Pandoc only. For build-print, also check Typst (lines 195-210) and conditionally Ghostscript for IngramSpark (lines 660-678).

**Pandoc EPUB invocation pattern** (export.md lines 397-415):
```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/manuscript.epub \
  --metadata-file=.manuscript/output/metadata.yaml \
  --epub-cover-image=.manuscript/output/cover.jpg \
  --css=data/export-templates/scriveno-epub.css \
  --toc \
  --toc-depth=2 \
  --split-level=1
```
For build-ebook.md, the output filename changes to `ebook.epub` per CONTEXT.md decision.

**Success output pattern** — CONTEXT.md specifies:
```
> ✓ EPUB built → .manuscript/output/ebook.epub (1.2 MB)
```
This is a condensed version of export.md's STEP 5 report (lines 842-880). For build commands, report in a single completion line rather than a multi-section report.

**Page-count guardrail placement** — runs alongside STEP 2 prerequisite checks, before any build. Warning format from CONTEXT.md:
```
⚠ Estimated {N} pages at {trim} ({PLATFORM} limit: {MAX}pp). Consider {ALT_PLATFORM} ({ALT_MAX}pp). Building anyway...
```
Only fires when `--platform` is specified and the platform has a `max_pages` value in its manifest.

---

### `commands/scr/build-print.md` (command, request-response)

**Analog:** `commands/scr/export.md`

Same frontmatter, gate steps (1, 1.5, 1.6), and structure as build-ebook.md. Differences:

**Frontmatter**:
```markdown
---
description: Build a print-ready PDF from the manuscript for a target publishing platform.
argument-hint: "[--platform <platform>] [--trim <size>] [--strict] [--skip-validate]"
---
```

**STEP 1 constraint key:** `pdf_print_ready` — available for `["prose", "visual", "poetry", "sacred"]`.

**STEP 2 prerequisite detection** — check Pandoc AND Typst. Ghostscript check is conditional on `--platform ingram` (export.md lines 660-678):
```bash
command -v pandoc >/dev/null 2>&1
command -v typst >/dev/null 2>&1
# If --platform ingram:
command -v gs >/dev/null 2>&1
```

**Platform flag validation pattern** — after prerequisite checks, validate `--platform` against `lib/architectural-profiles.js`:
```
Use validatePlatform(slug) from lib/architectural-profiles.js.
If invalid: list available platforms from listPlatforms() and stop.
```

**Trim size lookup pattern** — read from manifest `trim_sizes` table after validating platform:
```
1. Read --trim flag value (default: 6x9 from CONTEXT.md decisions)
2. Load templates/platforms/{platform}/manifest.yaml
3. Look up trim in manifest.trim_sizes
4. Use wpp (words-per-page) from that entry for page-count estimation
```

**Pandoc print PDF invocation pattern** (export.md lines 370-390):
```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/print-{platform}.pdf \
  --pdf-engine=typst \
  --template=data/export-templates/scriveno-book.typst \
  --metadata-file=.manuscript/output/metadata.yaml \
  --toc \
  --toc-depth=2 \
  -V paperwidth={trim_width}in \
  -V paperheight={trim_height}in \
  -V margin-inside=0.75in \
  -V margin-outside=0.5in \
  -V margin-top=0.75in \
  -V margin-bottom=0.75in
```
Output filename: `.manuscript/output/print-{platform}.pdf` per CONTEXT.md decision.

---

### `templates/platforms/kdp/manifest.yaml` (config, transform)

**Analog:** `templates/platforms/ingram/manifest.yaml` (current placeholder structure, lines 1-13)

**Placeholder structure to preserve and expand** (all manifests lines 1-13):
```yaml
# Publishing platform profile — placeholder manifest.
# Real content (trim_sizes, max_pages, epub_variant, metadata_shape, formats_accepted)
# lands in Phase 32 (Build Pipelines & Platform Awareness).
# DO NOT remove this file — Phase 29's validator (Plan 03) reads the
# directory listing to populate the allowed platform values.
platform: kdp
label: "Amazon KDP"
trim_sizes: null
max_pages: null
epub_variant: null
metadata_shape: null
formats_accepted: null
status: placeholder
```

**Target populated structure for KDP** (from CONTEXT.md decisions):
```yaml
platform: kdp
label: "Amazon KDP"
status: active
formats_accepted:
  - epub
  - pdf_print_ready
trim_sizes:
  5x8:
    width_in: 5
    height_in: 8
    wpp: 220
  5.25x8:
    width_in: 5.25
    height_in: 8
    wpp: 230
  5.5x8.5:
    width_in: 5.5
    height_in: 8.5
    wpp: 235
  6x9:
    width_in: 6
    height_in: 9
    wpp: 250
  7x10:
    width_in: 7
    height_in: 10
    wpp: 300
default_trim: "6x9"
max_pages:
  paperback: 828
  hardcover: 550
epub_variant: "epub3"
metadata_shape:
  title: required
  author: required
  language: required
  description: optional
  isbn: optional
```

---

### `templates/platforms/ingram/manifest.yaml` (config, transform)

**Same structure** as KDP manifest. Key differences per CONTEXT.md:
- `formats_accepted`: `epub` and `pdf_print_ready`
- `max_pages.paperback`: 1200 (no hardcover entry)
- Same 5 trim sizes (IngramSpark supports same standard trade sizes)
- CMYK PDF/X-1a requirement noted in `pdf_requirements` field

---

### `templates/platforms/apple/manifest.yaml` through `templates/platforms/smashwords/manifest.yaml` (config, transform)

**EPUB-only platforms** (apple, bn, d2d, kobo, google, smashwords). Per CONTEXT.md: no print, no page limit guardrail.

**Shared structure** — same header comment block, `status: active`, but:
- `formats_accepted: [epub]` only
- `trim_sizes: null` (not applicable)
- `max_pages: null` (no guardrail)
- `default_trim: null`

Each platform gets platform-specific `epub_variant` and `metadata_shape` values (e.g., smashwords has "Nuclear Option" compliance requirements, D2D has its own epub validator quirks).

---

### `data/CONSTRAINTS.json` (config, transform)

**Analog:** Existing `exports` section in `data/CONSTRAINTS.json` (lines 1222-1238)

**Existing exports section pattern** (lines 1222-1238):
```json
"exports": {
  "markdown": { "available": ["all"] },
  "docx_manuscript": { "available": ["prose", "script", "academic", "technical", "poetry", "speech_song", "sacred"] },
  "epub": { "available": ["prose", "visual", "poetry", "interactive", "sacred"] },
  "pdf_print_ready": { "available": ["prose", "visual", "poetry", "sacred"] },
  "kdp_package": { "available": ["prose", "visual", "poetry", "sacred"] }
}
```

**New entries to add** — follow identical shape. Insert after `submission_package` entry, before `apa_mla_chicago`:
```json
"build_ebook": {
  "available": ["prose", "visual", "poetry", "interactive", "sacred"],
  "description": "EPUB build pipeline with platform-aware accessibility guardrails"
},
"build_print": {
  "available": ["prose", "visual", "poetry", "sacred"],
  "description": "Print-ready PDF build pipeline with platform trim sizes and page-count guardrails"
}
```
The `available` arrays must exactly match `epub` and `pdf_print_ready` respectively (build-ebook is the epub pipeline; build-print is the pdf_print_ready pipeline).

---

### `test/phase32-build-pipelines-platform-awareness.test.js` (test, request-response)

**Analog:** `test/phase31-staged-front-matter-generation.test.js`

**File header and imports pattern** (phase31 test lines 1-22):
```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BUILD_EBOOK_PATH = path.join(ROOT, 'commands', 'scr', 'build-ebook.md');
const BUILD_PRINT_PATH = path.join(ROOT, 'commands', 'scr', 'build-print.md');
const CONSTRAINTS_PATH = path.join(ROOT, 'data', 'CONSTRAINTS.json');
const PLATFORMS_DIR = path.join(ROOT, 'templates', 'platforms');

/**
 * Read a file and return its content, or null if it doesn't exist.
 * Tests that need the file content will fail with a descriptive message
 * when the file is missing, rather than crashing the whole suite.
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (_) {
    return null;
  }
}
```

**Section separator comment pattern** (phase31 test lines 23-26):
```javascript
// ─────────────────────────────────────────────────────────────────────────────
// BUILD-01: build-ebook.md exists with correct structure
// ─────────────────────────────────────────────────────────────────────────────
```

**File existence + frontmatter test pattern** (phase30 test lines 29-52):
```javascript
describe('Phase 32: BUILD-01 build-ebook.md exists and is structurally valid', () => {
  it('build-ebook.md exists at commands/scr/build-ebook.md', () => {
    assert.ok(
      fs.existsSync(BUILD_EBOOK_PATH),
      'commands/scr/build-ebook.md must exist — BUILD-01'
    );
  });

  it('build-ebook.md content contains YAML frontmatter and description: field', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.match(
      content,
      /^---\n[\s\S]*?\n---/,
      'build-ebook.md must have YAML frontmatter (--- block)'
    );
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(frontmatterMatch, 'build-ebook.md has no frontmatter to check');
    assert.ok(
      frontmatterMatch[1].includes('description:'),
      'build-ebook.md frontmatter must include a description: field'
    );
  });
});
```

**Step ordering test pattern** (phase30 test lines 192-222):
```javascript
it('build-ebook.md contains STEP 1.5 validate gate and it appears before STEP 2', () => {
  const content = readFile(BUILD_EBOOK_PATH);
  assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
  const step15Pos = content.indexOf('STEP 1.5');
  const step2Pos = content.indexOf('STEP 2');
  assert.ok(step15Pos !== -1, 'build-ebook.md must contain STEP 1.5 validate gate — BUILD-01');
  assert.ok(step2Pos !== -1, 'build-ebook.md must contain STEP 2 (CHECK PREREQUISITES)');
  assert.ok(
    step15Pos < step2Pos,
    'STEP 1.5 must appear before STEP 2 in build-ebook.md'
  );
});
```

**YAML manifest parse test pattern** (phase29 test lines 75-98 for CONSTRAINTS.json checks):
```javascript
describe('Phase 32: PLATFORM-01 platform manifests are populated (status: active)', () => {
  const yaml = require('fs');
  const platforms = ['kdp', 'ingram', 'apple', 'bn', 'd2d', 'kobo', 'google', 'smashwords'];
  for (const platform of platforms) {
    it(`${platform}/manifest.yaml must no longer be status: placeholder`, () => {
      const manifestPath = path.join(PLATFORMS_DIR, platform, 'manifest.yaml');
      const content = readFile(manifestPath);
      assert.ok(content !== null, `${platform}/manifest.yaml could not be read`);
      assert.ok(
        !content.includes('status: placeholder'),
        `${platform}/manifest.yaml must have status: active, not status: placeholder — PLATFORM-01`
      );
    });
  }
});
```

**CONSTRAINTS.json shape test pattern** (phase29 test lines 75-107):
```javascript
describe('Phase 32: PLATFORM-03 CONSTRAINTS.json has build_ebook and build_print exports entries', () => {
  it('CONSTRAINTS.json exports section has build_ebook entry', () => {
    const constraints = JSON.parse(fs.readFileSync(CONSTRAINTS_PATH, 'utf8'));
    assert.ok(
      constraints.exports.build_ebook,
      'CONSTRAINTS.json exports section must have build_ebook entry — PLATFORM-03'
    );
    assert.ok(
      Array.isArray(constraints.exports.build_ebook.available),
      'build_ebook.available must be an array'
    );
  });
});
```

---

## Shared Patterns

### Validate Gate (STEP 1.5)
**Source:** `commands/scr/export.md` lines 87-115 and `commands/scr/publish.md` lines 36-65
**Apply to:** `build-ebook.md`, `build-print.md`

The STEP 1.5 block is identical in both export.md and publish.md. Copy verbatim — only the command name in the blocked message differs (`Export blocked` becomes `Build blocked`). The `--skip-validate` escape hatch and the warning format must be preserved exactly. Tests in phase30 and phase31 suites verify this pattern exists in commands by content string search for `'STEP 1.5'` and `'--skip-validate'`.

### Front-matter Gate (STEP 1.6)
**Source:** `commands/scr/export.md` lines 118-164 and `commands/scr/publish.md` lines 68-114
**Apply to:** `build-ebook.md`, `build-print.md`

Again identical between export.md and publish.md. Copy verbatim. STEP 1.6 must appear after STEP 1.5 and before STEP 2 (verified structurally by phase31 tests via `indexOf` ordering checks).

### Prerequisite Detection
**Source:** `commands/scr/export.md` lines 167-222
**Apply to:** `build-ebook.md` (Pandoc only), `build-print.md` (Pandoc + Typst, Ghostscript conditional)

Pattern: `command -v <tool> >/dev/null 2>&1` shell check, fail-fast with multi-platform install hint including `brew install` (macOS), `apt install` (Linux), `choco install` or `winget install` (Windows), and official download URL as fallback. Ghostscript check uses `command -v gs` (not `ghostscript`).

### Output Location Convention
**Source:** `commands/scr/export.md` lines 319, 328, 360, etc.
**Apply to:** All output from `build-ebook.md` and `build-print.md`

All output goes to `.manuscript/output/`. New filenames per CONTEXT.md decision: `ebook.epub` and `print-{platform}.pdf`. Consistent with existing `manuscript.epub`, `manuscript-print.pdf` naming.

### CONSTRAINTS.json Work-type Group Availability
**Source:** `data/CONSTRAINTS.json` lines 1222-1238 (`exports` section)
**Apply to:** New `build_ebook` and `build_print` entries in CONSTRAINTS.json

New entries must mirror the `available` arrays of `epub` and `pdf_print_ready` respectively. The `available` array values must be group names from `work_type_groups` keys (e.g., `"prose"`, `"visual"` — not individual work type names). Using `"all"` is valid if universally available (it is not for these build commands).

### Manifest YAML Schema
**Source:** All 8 existing placeholder manifests in `templates/platforms/*/manifest.yaml`
**Apply to:** All 8 platform manifest files being populated

Top-level keys to retain: `platform`, `label`, `status`, `formats_accepted`, `trim_sizes`, `max_pages`, `epub_variant`, `metadata_shape`. Do not remove or rename existing keys — the Phase 29 validator reads directory presence only (not manifest content), but the build commands in Phase 32 will read `trim_sizes`, `max_pages`, `epub_variant`, and `formats_accepted` at runtime. The comment block at the top (lines 1-5) should be updated to remove the "placeholder" notice once populated.

### Test File Structure
**Source:** `test/phase31-staged-front-matter-generation.test.js` (entire file)
**Apply to:** `test/phase32-build-pipelines-platform-awareness.test.js`

Test IDs follow `PHASE-NN` naming convention (e.g., `BUILD-01`, `BUILD-02`, `PLATFORM-01`). Each `describe` block title starts with `Phase 32:` followed by the test ID and short description. Each `it` block appends ` — {TEST-ID}` to the assertion message so failures self-identify. The `readFile()` helper is always defined and used instead of `fs.readFileSync` directly — this prevents crashes when files don't yet exist (TDD RED wave). Use `node:test` and `node:assert/strict` — no third-party test runner.

---

## No Analog Found

All files have close matches. No entries in this section.

---

## Metadata

**Analog search scope:** `commands/scr/`, `templates/platforms/`, `data/`, `test/`, `lib/`
**Files scanned:** 18 source files read directly
**Pattern extraction date:** 2026-04-17
