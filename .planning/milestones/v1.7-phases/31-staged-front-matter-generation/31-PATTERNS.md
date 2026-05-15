# Phase 31: Staged Front-Matter Generation - Pattern Map

**Mapped:** 2026-04-17
**Files analyzed:** 4 (3 modified, 1 created)
**Analogs found:** 4 / 4

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `commands/scr/front-matter.md` | command (agent instructions) | transform (YAML prepend to 5 element output blocks) | `commands/scr/front-matter.md` lines 158-175 (existing SCAFFOLD element) | self-analog - modify existing pattern |
| `commands/scr/export.md` | command (pipeline orchestrator) | request-response (step injection) | `commands/scr/export.md` lines 86-116 (STEP 1.5 validate gate) | exact - same structure, same injection site pattern |
| `commands/scr/publish.md` | command (pipeline orchestrator) | request-response (step injection) | `commands/scr/publish.md` lines 36-66 (STEP 1.5 validate gate) | exact - same structure, same injection site pattern |
| `test/phase31-staged-front-matter-generation.test.js` | test | CRUD (static text assertions on command files) | `test/phase30-export-cleanup-validation-gate.test.js` | exact - same framework, same assertion style |

---

## Pattern Assignments

### `commands/scr/front-matter.md` (command, transform)

**Analog:** `commands/scr/front-matter.md` - self-analog, the existing SCAFFOLD element blocks for Dedication (lines 158-175) and Preface (lines 285-306) define the before-state; the YAML header is prepended to their output markdown block.

**Existing scaffold element structure** (lines 158-175 - Dedication, the simplest case):
```markdown
#### Element 5: Dedication (Recto) -- SCAFFOLD

**Load STYLE-GUIDE.md for tone.**

Provide a dedication template with guidance:

```markdown
# Dedication

<!-- WRITER ACTION REQUIRED -->
<!-- The dedication is a personal statement. Write yours below. -->
<!-- Common styles: single name, short phrase, or brief paragraph. -->
<!-- Tone guidance from your voice profile has been considered. -->

[Your dedication here]
```

Save to `.manuscript/front-matter/05-dedication.md`
```

**YAML header to prepend - target output format** (from 31-CONTEXT.md `<decisions>`):
```markdown
---
scaffold: true
element: dedication
---

# Dedication

<!-- WRITER ACTION REQUIRED -->
...
```

**Pattern rule for all 5 scaffold elements:**
- Prepend the 3-line YAML block (`---` / `scaffold: true` / `element: <name>`) plus a blank separator line BEFORE the opening `# Heading` line of the markdown block that is saved to disk.
- The `element:` value is the lowercase element name (no spaces, no hyphens): `dedication`, `epigraph`, `foreword`, `preface`, `acknowledgments`.
- GENERATE element files (01, 03, 04, 07 and all others) get NO YAML frontmatter - absence of frontmatter means included by default in assembly.

**5 scaffold element save lines** (verified by direct file inspection - these are the lines immediately before which the YAML header instruction must appear):
| Element | Save line | element: value |
|---------|-----------|----------------|
| Element 5: Dedication | Line 175 | `dedication` |
| Element 6: Epigraph | Line 211 | `epigraph` |
| Element 11: Foreword | Line 283 | `foreword` |
| Element 12: Preface | Line 306 | `preface` |
| Element 13: Acknowledgments | Line 331 | `acknowledgments` |

**Acknowledgments special note** (from 31-RESEARCH.md critical discrepancy): Element 13 is labeled `GENERATE DRAFT` in the element table (line 31) and section header (line 308), but CONTEXT.md locks it as one of the 5 scaffold elements. Do NOT change the `GENERATE DRAFT` label. DO prepend `scaffold: true` YAML to its output block.

---

### `commands/scr/export.md` (command, request-response)

**Analog:** `commands/scr/export.md` lines 86-116 - STEP 1.5 VALIDATE MANUSCRIPT (Phase 30 injection). STEP 1.6 follows the identical structure.

**STEP 1.5 structure** (lines 86-116 - copy this structure exactly):
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

> **Export blocked: unresolved scaffold markers found.**
>
> [list each as: `path/to/file.md:LINE_NUMBER: marker text`]
>
> **Fix:** Run `/scr:cleanup --apply` to remove scaffold markers, or manually
> edit the listed files, then re-run this export command.

Then **stop** -- do not proceed to STEP 2.

If no markers found: proceed to STEP 2.
```

**Injection point** (verified lines 116-120):
- Line 116: `If no markers found: proceed to STEP 2.`
- Line 117: (blank)
- Line 118: `---`
- Line 119: (blank)
- Line 120: `### STEP 2: CHECK PREREQUISITES`
- STEP 1.6 block is inserted AFTER line 116 (after the `---` separator), BEFORE line 120.

**STEP 1.6 block to inject** (single step with sub-steps 1.6a and 1.6b, per RESEARCH.md recommendation):
```markdown
### STEP 1.6: FRONT-MATTER GATE

**1.6a - Scaffold exclusion**

Check if `.manuscript/front-matter/` exists.

If the directory does not exist:
> **Note:** No front matter found. Run `/scr:front-matter` first if you want publication front matter included.

Proceed to 1.6b.

If the directory exists, scan the first 10 lines of each `.md` file in `.manuscript/front-matter/` for a YAML block containing `scaffold: true`. Build an exclusion list of the file paths where `scaffold: true` is found.

If any scaffold files were found, note them for the assembly step (STEP 3b) and show:
> **Note:** [N] scaffold front-matter element(s) will be excluded from this export:
>   - `.manuscript/front-matter/12-preface.md` (scaffold: true - edit and set scaffold: false to include)
>   - `.manuscript/front-matter/05-dedication.md` (scaffold: true - edit and set scaffold: false to include)

If no scaffold files found, show no note. Proceed to 1.6b.

**1.6b - GENERATE element auto-refresh**

Compare the modification timestamp of `.manuscript/WORK.md` against the 4 GENERATE front-matter files:
- `.manuscript/front-matter/01-half-title.md`
- `.manuscript/front-matter/03-title-page.md`
- `.manuscript/front-matter/04-copyright.md`
- `.manuscript/front-matter/07-toc.md`

If `.manuscript/WORK.md` does not exist, skip auto-refresh and proceed to STEP 2.

To compare timestamps, use:
- macOS: `stat -f %m <file>`
- Linux: `stat -c %Y <file>`
- Windows: `(Get-Item '<file>').LastWriteTimeUtc.Ticks`
- If timestamp comparison is not possible, assume WORK.md is newer and regenerate.

If WORK.md is newer than ANY of those 4 files, or if ANY of those 4 files do not exist:
  Re-run the GENERATE step from `/scr:front-matter` for elements 1, 3, 4, and 7 only (half-title, title page, copyright page, TOC) using current WORK.md metadata. Do NOT regenerate scaffold elements (5, 6, 11, 12, 13) or any other elements.

If WORK.md is not newer than all 4 files: skip regeneration silently.

Proceed to STEP 2.
```

**STEP 3b addition** (lines 186-199 - assembly step must reference STEP 1.6a exclusion list):

Current STEP 3b text (lines 186-199):
```markdown
**3b. Scan front matter:**

Read all files in `.manuscript/front-matter/` directory. Sort by numeric prefix to maintain Chicago Manual of Style order:

```
01-half-title.md
02-series-title.md
03-title-page.md
04-copyright.md
...
```

If no front matter files exist:
> **Note:** No front matter found. Consider running `/scr:front-matter` to generate title page, copyright, and other publishing elements.

Proceed with body content only.
```

Add this sentence after the sort instruction block, before the "If no front matter files exist" line:
```markdown
**Scaffold exclusion:** Omit any files whose path appears in the scaffold exclusion list built in STEP 1.6a.
```

---

### `commands/scr/publish.md` (command, request-response)

**Analog:** `commands/scr/publish.md` lines 36-66 - STEP 1.5 VALIDATE MANUSCRIPT (identical structure to export.md STEP 1.5, with "Publishing blocked" substituted for "Export blocked").

**STEP 1.5 structure** (lines 36-66 - the exact existing text):
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

> **Publishing blocked: unresolved scaffold markers found.**
>
> [list each as: `path/to/file.md:LINE_NUMBER: marker text`]
>
> **Fix:** Run `/scr:cleanup --apply` to remove scaffold markers, or manually
> edit the listed files, then re-run this publish command.

Then **stop** -- do not proceed to STEP 2.

If no markers found: proceed to STEP 2.
```

**Injection point** (verified lines 66-70):
- Line 66: `If no markers found: proceed to STEP 2.`
- Line 67: (blank)
- Line 68: `---`
- Line 69: (blank)
- Line 70: `### STEP 2: ROUTE`
- STEP 1.6 block is inserted AFTER line 66 (after the `---` separator), BEFORE line 70.

**STEP 1.6 block for publish.md:** Identical text to export.md's STEP 1.6 (copy verbatim). The wording is command-agnostic - it references `/scr:front-matter` for regeneration, not `/scr:export`.

**No STEP 3b equivalent in publish.md** (verified: publish.md chains to `/scr:export` for all assembly via STEP 4 presets - it has no own assembly step). The STEP 3b edit is export.md only.

---

### `test/phase31-staged-front-matter-generation.test.js` (test, static text assertions)

**Analog:** `test/phase30-export-cleanup-validation-gate.test.js` - exact match. Same framework (`node:test` + `node:assert/strict`), same `readFile()` helper, same `describe`/`it` structure, same positional assertion pattern.

**File header pattern** (lines 1-23 of phase30 test - copy verbatim, updating paths):
```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FRONT_MATTER_PATH = path.join(ROOT, 'commands', 'scr', 'front-matter.md');
const EXPORT_PATH = path.join(ROOT, 'commands', 'scr', 'export.md');
const PUBLISH_PATH = path.join(ROOT, 'commands', 'scr', 'publish.md');

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

**Section separator pattern** (lines 25-27 of phase30 test - copy format):
```javascript
// ─────────────────────────────────────────────────────────────────────────────
// FM-02: front-matter.md prepends scaffold: true YAML to 5 scaffold elements
// ─────────────────────────────────────────────────────────────────────────────
```

**Positional assertion pattern** (lines 192-202 of phase30 test - VALID-03 block, exact idiom for STEP ordering):
```javascript
describe('Phase 30: VALID-03 export.md has validate gate before prerequisites step', () => {
  it('export.md contains STEP 1.5 validate gate and it appears before STEP 2', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');
    const step15Pos = content.indexOf('STEP 1.5');
    const step2Pos = content.indexOf('STEP 2');
    assert.ok(step15Pos !== -1, 'export.md must contain STEP 1.5 validate gate - VALID-03');
    assert.ok(step2Pos !== -1, 'export.md must contain STEP 2 (CHECK PREREQUISITES)');
    assert.ok(
      step15Pos < step2Pos,
      'STEP 1.5 must appear before STEP 2 in export.md - gate must run before tool detection (Pitfall 1)'
    );
  });
```

**`assert.ok(content.includes(...))` string match pattern** (lines 207-211):
```javascript
  it('export.md gate block mentions --skip-validate bypass', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');
    assert.ok(
      content.includes('--skip-validate'),
      'export.md gate must mention --skip-validate bypass flag - VALID-03 escape hatch'
    );
  });
```

**Test map for Phase 31** (one `describe` block per FM-0N requirement):

| Req ID | describe label | it cases |
|--------|---------------|----------|
| FM-01 | `FM-01 front-matter.md GENERATE elements have no [Fill in] placeholders` | Assert `[Fill in` does not appear within GENERATE element sections (01, 03, 04, 07) - use indexOf on the section header text then slice to the next `Save to` to scope the check |
| FM-02 | `FM-02 front-matter.md adds scaffold: true to exactly 5 scaffold elements` | One `it` per element: assert `scaffold: true` appears in the file near `05-dedication.md`, `06-epigraph.md`, `11-foreword.md`, `12-preface.md`, `13-acknowledgments.md` |
| FM-03 export | `FM-03 export.md has STEP 1.6 scaffold exclusion after STEP 1.5 and before STEP 2` | STEP 1.6 exists; positional: 1.5 < 1.6 < STEP 2; `scaffold: true` appears in STEP 1.6 section; `scaffold: false` mentioned as opt-in |
| FM-03 publish | `FM-03 publish.md has STEP 1.6 scaffold exclusion after STEP 1.5 and before STEP 2` | Same positional assertions for publish.md |
| FM-04 | `FM-04 export.md STEP 1.6 references WORK.md timestamp and 4 GENERATE files` | `WORK.md` appears in STEP 1.6 section; `01-half-title.md`, `03-title-page.md`, `04-copyright.md`, `07-toc.md` all appear in STEP 1.6 section |

**FM-02 per-element assertion approach** - scope each check to the text between the element's section header and its `Save to` line to avoid false positives from other sections:
```javascript
it('05-dedication.md write includes scaffold: true in YAML header', () => {
  const content = readFile(FRONT_MATTER_PATH);
  assert.ok(content !== null, 'commands/scr/front-matter.md could not be read');
  // Scope to the dedication section only
  const sectionStart = content.indexOf('Element 5: Dedication');
  const saveLine = content.indexOf('05-dedication.md', sectionStart);
  assert.ok(sectionStart !== -1, 'Dedication section not found in front-matter.md');
  assert.ok(saveLine !== -1, '05-dedication.md save line not found');
  const section = content.slice(sectionStart, saveLine);
  assert.ok(
    section.includes('scaffold: true'),
    'front-matter.md dedication section must include scaffold: true in YAML header - FM-02'
  );
});
```

---

## Shared Patterns

### Step Injection Structure
**Source:** `commands/scr/export.md` lines 86-116 and `commands/scr/publish.md` lines 36-66
**Apply to:** All STEP injections in export.md and publish.md

The established injection pattern for both files:
1. Step header: `### STEP N.N: STEP NAME IN CAPS`
2. Bold description sentence
3. Conditional blocks using `**If condition:**` bold heading
4. Blockquote (`>`) for all user-visible output text
5. Closing phrase: `Proceed to STEP N.` (non-blocking) or `Then **stop**.` (blocking)
6. Separator `---` before the next step heading

STEP 1.6 is non-blocking - it uses `Proceed to STEP 2.` not `Then **stop**`.

### Null Guard Before Directory Scan
**Source:** `commands/scr/export.md` lines 198-201 (STEP 3b missing directory handling)
**Apply to:** STEP 1.6a directory existence check

Pattern:
```markdown
If [directory] does not exist:
> **Note:** [message explaining what to do]

Proceed [to next sub-step].
```

### Test File Structure
**Source:** `test/phase30-export-cleanup-validation-gate.test.js`
**Apply to:** `test/phase31-staged-front-matter-generation.test.js`

- `require('node:test')` and `require('node:assert/strict')` (not `assert` plain)
- `readFile()` helper returns `null` on missing file, never throws
- Each `describe` maps to one requirement ID (e.g. FM-01, FM-02)
- Each `it` asserts a single behavioral property
- Error messages in `assert.ok()` third argument always include the requirement ID (e.g. ` -  FM-02`)
- `content.indexOf()` for positional tests; `content.includes()` for presence tests
- `content !== null` guard as the first assertion in every `it` that reads a file

---

## No Analog Found

No files are without a codebase analog. All 4 files have direct matches.

---

## Metadata

**Analog search scope:** `commands/scr/`, `test/`
**Files scanned:** `export.md` (831 lines), `publish.md` (258 lines), `front-matter.md` (526 lines), `phase30-export-cleanup-validation-gate.test.js` (255 lines)
**Pattern extraction date:** 2026-04-17
