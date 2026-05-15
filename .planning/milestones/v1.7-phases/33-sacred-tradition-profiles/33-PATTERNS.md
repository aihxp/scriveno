# Phase 33: Sacred Tradition Profiles - Pattern Map

**Mapped:** 2026-04-17
**Files analyzed:** 13 (10 manifests + 2 build commands + 1 test file)
**Analogs found:** 13 / 13

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `templates/sacred/catholic/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` | role-match |
| `templates/sacred/islamic-hafs/manifest.yaml` | config | transform | `templates/platforms/apple/manifest.yaml` (RTL + simple structure) | role-match |
| `templates/sacred/islamic-warsh/manifest.yaml` | config | transform | `templates/platforms/apple/manifest.yaml` | role-match |
| `templates/sacred/jewish/manifest.yaml` | config | transform | `templates/platforms/apple/manifest.yaml` | role-match |
| `templates/sacred/orthodox/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` | role-match |
| `templates/sacred/pali/manifest.yaml` | config | transform | `templates/platforms/apple/manifest.yaml` | role-match |
| `templates/sacred/protestant/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` | role-match |
| `templates/sacred/sanskrit/manifest.yaml` | config | transform | `templates/platforms/apple/manifest.yaml` | role-match |
| `templates/sacred/tewahedo/manifest.yaml` | config | transform | `templates/platforms/kdp/manifest.yaml` | role-match |
| `templates/sacred/tibetan/manifest.yaml` | config | transform | `templates/platforms/apple/manifest.yaml` | role-match |
| `commands/scr/build-ebook.md` | command | request-response | `commands/scr/build-print.md` (STEP 1.6 to STEP 2 gap) | exact |
| `commands/scr/build-print.md` | command | request-response | `commands/scr/build-ebook.md` (STEP 1.6 to STEP 2 gap) | exact |
| `test/phase33-sacred-tradition-profiles.test.js` | test | batch | `test/phase32-build-pipelines-platform-awareness.test.js` | exact |

---

## Pattern Assignments

### All 10 `templates/sacred/*/manifest.yaml` files (config, transform)

**Analog (populated, structured):** `templates/platforms/kdp/manifest.yaml`
**Analog (populated, simpler):** `templates/platforms/apple/manifest.yaml`

**Existing placeholder shape** (all 10 manifests, lines 1-14 - copy header comment style):
```yaml
# Sacred tradition profile - placeholder manifest.
# Real content (book_order, approval_block, font_stack, rtl, numbering, script)
# lands in Phase 33 (Sacred Tradition Profiles).
# DO NOT remove this file - Phase 29's validator (Plan 03) reads the
# directory listing to populate the allowed tradition values.
tradition: catholic
label: "Roman Catholic"
book_order: null
approval_block: null
font_stack: null
rtl: null
numbering: null
script: null
status: placeholder
```

**Populated manifest shape** (modeled on `templates/platforms/kdp/manifest.yaml` lines 1-43, adapted for sacred schema):
```yaml
# Sacred tradition profile - <label>.
# Populated in Phase 33 (Sacred Tradition Profiles).
# DO NOT remove this file - Phase 29's validator (Plan 03) reads the
# directory listing to populate the allowed tradition values.
tradition: <slug>
label: "<Human label>"
status: active
book_order:
  - "BookOne"
  - "BookTwo"
approval_block:
  label: "<Tradition term>"
  required: true
  scope: "work"
font_stack:
  - "Noto Serif"
  - serif
rtl: false
numbering:
  format: "chapter:verse"
  separator: ":"
script: latin
```

**Key rules from CONTEXT.md decisions:**
- `status:` changes from `placeholder` to `active` when populated
- `book_order: null` for pali, sanskrit, tibetan (no fixed canonical order)
- `rtl: true` for islamic-hafs, islamic-warsh, jewish only; all others `rtl: false`
- `approval_block.required: true` for catholic, orthodox, islamic-hafs, islamic-warsh, jewish, tewahedo
- `approval_block.required: false` for protestant, pali, sanskrit, tibetan
- `font_stack` first entry is a Google Noto font for the script; second entry is the CSS generic fallback
- `numbering.format` values: `"chapter:verse"` (biblical traditions), `"surah:ayah"` (Islamic), `"nikaya:sutta"` (Pali)

**Tradition-specific content table** (from CONTEXT.md decisions + specifics sections):

| Tradition | `script` | `rtl` | `approval_block.label` | `approval_block.required` | `numbering.format` | `book_order` |
|-----------|----------|-------|------------------------|---------------------------|--------------------|--------------|
| catholic | latin | false | "Nihil Obstat" | true | "chapter:verse" | array (deuterocanonical included) |
| islamic-hafs | arabic | true | "Ijazah" | true | "surah:ayah" | array (114 surahs) |
| islamic-warsh | arabic | true | "Ijazah" | true | "surah:ayah" | array (114 surahs, same as hafs) |
| jewish | hebrew | true | "Haskamah" | true | "chapter:verse" | array (Tanakh order: Torah, Nevi'im, Ketuvim) |
| orthodox | latin | false | "Patriarchal blessing" | true | "chapter:verse" | array (LXX order, deuterocanonicals included) |
| pali | latin | false | "none" | false | "nikaya:sutta" | null |
| protestant | latin | false | "none" | false | "chapter:verse" | array (66 books, OT then NT) |
| sanskrit | devanagari | false | "none" | false | "chapter:verse" | null |
| tewahedo | ethiopic | false | "Patriarchal blessing" | true | "chapter:verse" | array (81 books, Ge'ez order) |
| tibetan | tibetan | false | "none" | false | "chapter:verse" | null |

**Font stack pattern** (first font = Noto family for the script, second = CSS generic):

| Tradition | `font_stack` |
|-----------|-------------|
| catholic | `["Noto Serif", serif]` |
| islamic-hafs | `["Noto Naskh Arabic", serif]` |
| islamic-warsh | `["Noto Naskh Arabic", serif]` |
| jewish | `["Noto Serif Hebrew", serif]` |
| orthodox | `["Noto Serif", serif]` |
| pali | `["Noto Serif", serif]` |
| protestant | `["Noto Serif", serif]` |
| sanskrit | `["Noto Serif Devanagari", serif]` |
| tewahedo | `["Noto Serif Ethiopic", serif]` |
| tibetan | `["Noto Serif Tibetan", serif]` |

---

### `commands/scr/build-ebook.md` - add STEP 1.7 (command, request-response)

**Analog:** `commands/scr/build-ebook.md` existing STEP 1.6 block (lines 78-124), STEP 2 header at line 126

**Insertion point:** Between end of STEP 1.6 (`Proceed to STEP 2.` at line 122) and `### STEP 2:` heading (line 126)

**STEP 1.6 end pattern** (lines 120-124 - the step closes with "Proceed to STEP 2." then a horizontal rule):
```markdown
If WORK.md is not newer than all 4 files and all 4 files exist: skip regeneration silently.

Proceed to STEP 2.

---
```

**STEP 1.7 block to insert** (modeled on STEP 1.6 style - heading, condition-first, silent-skip-if-absent, then action):
```markdown
### STEP 1.7: TRADITION LOADING

Read `tradition:` from `.manuscript/config.json`.

If absent or null: skip this step silently and proceed to STEP 2.

If present, load `templates/sacred/{tradition}/manifest.yaml`.

Apply tradition data to `.manuscript/output/metadata.yaml`:
- Set `lang:` to the tradition's primary language tag (e.g. `ar` for Arabic, `he` for Hebrew, `en` for Latin-script traditions).
- Set `font-family:` to the first entry in `font_stack`.

If `rtl: true` in the manifest, add `--metadata dir=rtl` to the Pandoc invocation in STEP 4.

If `approval_block.required: true` in the manifest, note after the build:
> **Note:** This tradition requires an approval block ("{{approval_block.label}}") before publication. Scope: {{approval_block.scope}}.

Proceed to STEP 2.

---
```

**Ordering constraint extracted from phase32 test pattern** (`test/phase32-build-pipelines-platform-awareness.test.js` lines 61-79):
- Existing tests check `s15 < s16` and `s16 < s2`. Phase33 TRAD-05 will add: `s16 < s17` and `s17 < s2`.

---

### `commands/scr/build-print.md` - add STEP 1.7 (command, request-response)

**Analog:** `commands/scr/build-print.md` existing STEP 1.6 block (lines 85-130), STEP 2 header at line 132

**Insertion point:** Between end of STEP 1.6 (line 129 "Proceed to STEP 2.") and `### STEP 2:` heading (line 132)

**STEP 1.7 content:** Identical wording to build-ebook.md STEP 1.7. Keep wording exactly parallel between both files so TRAD-05 tests can assert both files with the same `content.includes('STEP 1.7')` check.

---

### `test/phase33-sacred-tradition-profiles.test.js` (test, batch)

**Analog:** `test/phase32-build-pipelines-platform-awareness.test.js` (lines 1-545)

**CRITICAL: No js-yaml.** Package.json has zero runtime or dev dependencies. All existing tests (`phase29`, `phase31`, `phase32`) inspect YAML files using raw string `includes()` checks on `fs.readFileSync` output - never by parsing YAML. Phase33 tests must follow the same pattern.

**File header pattern** (lines 1-9 of phase32 test - copy exactly, changing paths and phase number):
```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SACRED_DIR = path.join(ROOT, 'templates', 'sacred');
const BUILD_EBOOK_PATH = path.join(ROOT, 'commands', 'scr', 'build-ebook.md');
const BUILD_PRINT_PATH = path.join(ROOT, 'commands', 'scr', 'build-print.md');
```

**`readFile` null-safe helper** (lines 16-20 of phase32 test - copy verbatim):
```javascript
function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch (_) { return null; }
}
```

**Section separator comment pattern** (lines 22-23 of phase32 test):
```javascript
// ─────────────────────────────────────────────────────────────────────────────
// TRAD-01: manifest completeness
// ─────────────────────────────────────────────────────────────────────────────
```

**Loop-over-traditions describe block pattern** (modeled on phase32 lines 431-445 - loop `for (const platform of allPlatforms)`):
```javascript
describe('Phase 33: TRAD-01 all 10 tradition manifests are complete and active', () => {
  const allTraditions = [
    'catholic', 'islamic-hafs', 'islamic-warsh', 'jewish', 'orthodox',
    'pali', 'protestant', 'sanskrit', 'tewahedo', 'tibetan'
  ];

  for (const slug of allTraditions) {
    it(`${slug}/manifest.yaml has status: active (not placeholder) - TRAD-01`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml could not be read - TRAD-01`);
      assert.ok(
        !content.includes('status: placeholder'),
        `${slug}/manifest.yaml must not have status: placeholder - must be status: active - TRAD-01`
      );
    });
  }
});
```

**Field presence via string check pattern** (modeled on phase32 lines 436-444 - checking `content.includes('someValue')`):
```javascript
it(`${slug}/manifest.yaml has non-null script field - TRAD-01`, () => {
  const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
  assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml could not be read`);
  assert.ok(
    !content.includes('script: null'),
    `${slug}/manifest.yaml must have non-null script: field - TRAD-01`
  );
});
```

**RTL boolean check pattern** (for TRAD-02 - check specific values by slug):
```javascript
describe('Phase 33: TRAD-02 rtl field is boolean and correct per tradition', () => {
  const rtlTraditions = ['islamic-hafs', 'islamic-warsh', 'jewish'];
  const ltrTraditions = ['catholic', 'orthodox', 'pali', 'protestant', 'sanskrit', 'tewahedo', 'tibetan'];

  for (const slug of rtlTraditions) {
    it(`${slug}/manifest.yaml has rtl: true - TRAD-02`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml could not be read - TRAD-02`);
      assert.ok(content.includes('rtl: true'), `${slug}/manifest.yaml must have rtl: true - TRAD-02`);
    });
  }

  for (const slug of ltrTraditions) {
    it(`${slug}/manifest.yaml has rtl: false - TRAD-02`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml could not be read - TRAD-02`);
      assert.ok(content.includes('rtl: false'), `${slug}/manifest.yaml must have rtl: false - TRAD-02`);
    });
  }
});
```

**Test ID assignments per CONTEXT.md decisions section:**

| Test ID | Scope | What it checks |
|---------|-------|----------------|
| TRAD-01 | all 10 manifests | `status: active`, all 6 required fields non-null (no `field: null` lines) |
| TRAD-02 | all 10 manifests | `rtl:` is a boolean (not null); `rtl: true` for islamic-hafs, islamic-warsh, jewish; `rtl: false` for all others |
| TRAD-03 | all 10 manifests | `book_order: null` for pali, sanskrit, tibetan; non-null (list present) for all other 7 |
| TRAD-04 | all 10 manifests | `approval_block:` block contains `label:`, `required:`, `scope:` keys (not null) |
| TRAD-05 | build commands | `build-ebook.md` and `build-print.md` contain STEP 1.7, positioned after STEP 1.6 and before `### STEP 2:` |

**TRAD-05 positional test pattern** (exact copy from phase32 lines 61-79, adjusted for STEP 1.7):
```javascript
it('STEP 1.7 appears before ### STEP 2: in build-ebook.md - TRAD-05', () => {
  const content = readFile(BUILD_EBOOK_PATH);
  assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
  const s16 = content.indexOf('STEP 1.6');
  const s17 = content.indexOf('STEP 1.7');
  const s2  = content.indexOf('### STEP 2:');
  assert.ok(s16 !== -1, 'build-ebook.md must contain STEP 1.6 - TRAD-05');
  assert.ok(s17 !== -1, 'build-ebook.md must contain STEP 1.7 - TRAD-05');
  assert.ok(s2  !== -1, 'build-ebook.md must contain ### STEP 2: - TRAD-05');
  assert.ok(s16 < s17, 'STEP 1.6 must appear before STEP 1.7 in build-ebook.md - TRAD-05');
  assert.ok(s17 < s2,  'STEP 1.7 must appear before ### STEP 2: in build-ebook.md - TRAD-05');
});
```

---

## Shared Patterns

### YAML manifest header comment block
**Source:** All 10 placeholder manifests (`templates/sacred/*/manifest.yaml` lines 1-5) + `templates/platforms/kdp/manifest.yaml` lines 1-4
**Apply to:** All 10 sacred manifests when populating - update first two comment lines, keep the DO NOT REMOVE line
```yaml
# Sacred tradition profile - <label>.
# Populated in Phase 33 (Sacred Tradition Profiles).
# DO NOT remove this file - Phase 29's validator (Plan 03) reads the
# directory listing to populate the allowed tradition values.
```

### `status: active` pattern
**Source:** `templates/platforms/kdp/manifest.yaml` line 7, `templates/platforms/apple/manifest.yaml` line 7
**Apply to:** All 10 sacred manifests - replace `status: placeholder` with `status: active` when populating

### No js-yaml constraint
**Source:** `package.json` (zero dependencies), all existing test files (phase29, phase31, phase32 use only `fs` + `path`)
**Apply to:** `test/phase33-sacred-tradition-profiles.test.js` - all YAML field checks must use `content.includes('fieldname: value')` string matching, never `require('js-yaml')`

### `readFile` null-safe helper
**Source:** `test/phase32-build-pipelines-platform-awareness.test.js` lines 16-20
**Apply to:** `test/phase33-sacred-tradition-profiles.test.js`
```javascript
function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch (_) { return null; }
}
```

### Loop-over-all test generation
**Source:** `test/phase32-build-pipelines-platform-awareness.test.js` lines 431-529 (looping `for (const platform of allPlatforms)`)
**Apply to:** TRAD-01, TRAD-02, TRAD-03, TRAD-04 - loop over the 10 tradition slugs

### Step ordering assertion pattern
**Source:** `test/phase32-build-pipelines-platform-awareness.test.js` lines 61-79 (STEP 1.5 before STEP 1.6 before `### STEP 2:`)
**Apply to:** TRAD-05 - asserts STEP 1.6 before STEP 1.7 before `### STEP 2:` in both build commands

### STEP heading format
**Source:** `commands/scr/build-ebook.md` lines 44, 78, 126 (STEP 1.5, STEP 1.6, STEP 2 headings use `### STEP N:`)
**Apply to:** STEP 1.7 heading in both build commands
```markdown
### STEP 1.7: TRADITION LOADING
```

### Step termination pattern
**Source:** `commands/scr/build-ebook.md` lines 122 + 124 (all intermediate steps end with "Proceed to STEP N." then `---`)
**Apply to:** STEP 1.7 closing lines in both build commands
```markdown
Proceed to STEP 2.

---
```

---

## No Analog Found

No files in Phase 33 are entirely without analog. All patterns are directly modeled on existing codebase files.

---

## Metadata

**Analog search scope:** `templates/platforms/`, `templates/sacred/`, `commands/scr/`, `test/`, `lib/`
**Files scanned:** 17
**Pattern extraction date:** 2026-04-17
