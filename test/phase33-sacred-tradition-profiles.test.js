const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT              = path.join(__dirname, '..');
const SACRED_DIR        = path.join(ROOT, 'templates', 'sacred');
const BUILD_EBOOK_PATH  = path.join(ROOT, 'commands', 'scr', 'build-ebook.md');
const BUILD_PRINT_PATH  = path.join(ROOT, 'commands', 'scr', 'build-print.md');
const FRONT_MATTER_PATH = path.join(ROOT, 'commands', 'scr', 'front-matter.md');
// Was sacred-numbering-format.md until v1.6.x; renamed to resolve a flat-skill-name
// collision with commands/scr/sacred/verse-numbering.md (both flattened to
// scr-sacred-numbering-format.md at install time, silently dropping one).
const VERSE_NUM_PATH    = path.join(ROOT, 'commands', 'scr', 'sacred-numbering-format.md');

/**
 * Read a file and return its content, or null if it doesn't exist.
 * Tests that need the file content will fail with a descriptive message
 * when the file is missing, rather than crashing the whole suite.
 */
function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch (_) { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// TRAD-01: manifest completeness
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 33: TRAD-01 all 10 tradition manifests are complete and non-placeholder', () => {
  const allSlugs = [
    'catholic', 'islamic-hafs', 'islamic-warsh', 'jewish',
    'orthodox', 'pali', 'protestant', 'sanskrit', 'tewahedo', 'tibetan',
  ];

  // Traditions where book_order may be null (no fixed canonical order)
  const nullOrderSlugs = new Set(['pali', 'sanskrit', 'tibetan']);

  for (const slug of allSlugs) {
    const manifestPath = path.join(SACRED_DIR, slug, 'manifest.yaml');

    it(`${slug}/manifest.yaml exists — TRAD-01`, () => {
      const content = readFile(manifestPath);
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-01`);
    });

    it(`${slug}/manifest.yaml is not placeholder status — TRAD-01`, () => {
      const content = readFile(manifestPath);
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-01`);
      assert.ok(
        !content.includes('status: placeholder'),
        `${slug}/manifest.yaml must not have status: placeholder — TRAD-01`
      );
    });

    if (!nullOrderSlugs.has(slug)) {
      it(`${slug}/manifest.yaml has non-null book_order — TRAD-01`, () => {
        const content = readFile(manifestPath);
        assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-01`);
        assert.ok(
          !content.includes('book_order: null'),
          `${slug}/manifest.yaml must not have book_order: null — TRAD-01`
        );
      });
    }

    it(`${slug}/manifest.yaml has expanded approval_block (not null) — TRAD-01`, () => {
      const content = readFile(manifestPath);
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-01`);
      assert.ok(
        !content.includes('approval_block: null'),
        `${slug}/manifest.yaml must not have approval_block: null — TRAD-01`
      );
    });

    it(`${slug}/manifest.yaml has non-null font_stack — TRAD-01`, () => {
      const content = readFile(manifestPath);
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-01`);
      assert.ok(
        !content.includes('font_stack: null'),
        `${slug}/manifest.yaml must not have font_stack: null — TRAD-01`
      );
    });

    it(`${slug}/manifest.yaml has non-null rtl — TRAD-01`, () => {
      const content = readFile(manifestPath);
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-01`);
      assert.ok(
        !content.includes('rtl: null'),
        `${slug}/manifest.yaml must not have rtl: null — TRAD-01`
      );
    });

    it(`${slug}/manifest.yaml has non-null numbering — TRAD-01`, () => {
      const content = readFile(manifestPath);
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-01`);
      assert.ok(
        !content.includes('numbering: null'),
        `${slug}/manifest.yaml must not have numbering: null — TRAD-01`
      );
    });

    it(`${slug}/manifest.yaml has non-null script — TRAD-01`, () => {
      const content = readFile(manifestPath);
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-01`);
      assert.ok(
        !content.includes('script: null'),
        `${slug}/manifest.yaml must not have script: null — TRAD-01`
      );
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// TRAD-02: RTL field booleans correct per tradition
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 33: TRAD-02 RTL field is set to the correct boolean per tradition', () => {
  const rtlTraditions = ['islamic-hafs', 'islamic-warsh', 'jewish'];
  const ltrTraditions = ['catholic', 'orthodox', 'pali', 'protestant', 'sanskrit', 'tewahedo', 'tibetan'];

  for (const slug of rtlTraditions) {
    it(`${slug}/manifest.yaml has rtl: true — TRAD-02`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-02`);
      assert.ok(
        content.includes('rtl: true'),
        `${slug}/manifest.yaml must have rtl: true — TRAD-02`
      );
    });
  }

  for (const slug of ltrTraditions) {
    it(`${slug}/manifest.yaml has rtl: false — TRAD-02`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-02`);
      assert.ok(
        content.includes('rtl: false'),
        `${slug}/manifest.yaml must have rtl: false — TRAD-02`
      );
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// TRAD-03: book_order — null for variable-order traditions, array for fixed
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 33: TRAD-03 book_order is null for variable-order traditions and a populated array for fixed-order traditions', () => {
  const nullOrderTraditions = ['pali', 'sanskrit', 'tibetan'];
  const fixedOrderTraditions = ['catholic', 'islamic-hafs', 'islamic-warsh', 'jewish', 'orthodox', 'protestant', 'tewahedo'];

  for (const slug of nullOrderTraditions) {
    it(`${slug}/manifest.yaml has book_order: null (variable-order collection) — TRAD-03`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-03`);
      assert.ok(
        content.includes('book_order: null'),
        `${slug}/manifest.yaml must have book_order: null (no fixed canonical order) — TRAD-03`
      );
    });
  }

  for (const slug of fixedOrderTraditions) {
    it(`${slug}/manifest.yaml has non-null book_order — TRAD-03`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-03`);
      assert.ok(
        !content.includes('book_order: null'),
        `${slug}/manifest.yaml must not have book_order: null — TRAD-03`
      );
    });

    it(`${slug}/manifest.yaml has book_order: key present — TRAD-03`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-03`);
      assert.ok(
        content.includes('book_order:'),
        `${slug}/manifest.yaml must contain book_order: key — TRAD-03`
      );
    });

    it(`${slug}/manifest.yaml book_order contains at least one list item — TRAD-03`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-03`);
      // YAML list items indented with two spaces
      assert.ok(
        content.includes('  - "') || content.includes("  - '") || content.includes('  - '),
        `${slug}/manifest.yaml book_order must contain at least one list item — TRAD-03`
      );
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// TRAD-04: approval_block shape — label, required, scope sub-keys present
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 33: TRAD-04 approval_block is a structured object with label/required/scope for all 10 traditions', () => {
  const allSlugs = [
    'catholic', 'islamic-hafs', 'islamic-warsh', 'jewish',
    'orthodox', 'pali', 'protestant', 'sanskrit', 'tewahedo', 'tibetan',
  ];

  for (const slug of allSlugs) {
    it(`${slug}/manifest.yaml approval_block is not null — TRAD-04`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-04`);
      assert.ok(
        !content.includes('approval_block: null'),
        `${slug}/manifest.yaml approval_block must be expanded, not null — TRAD-04`
      );
    });

    it(`${slug}/manifest.yaml approval_block has label sub-key — TRAD-04`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-04`);
      assert.ok(
        content.includes('  label:'),
        `${slug}/manifest.yaml approval_block must have label: sub-key (two-space indent) — TRAD-04`
      );
    });

    it(`${slug}/manifest.yaml approval_block has required sub-key — TRAD-04`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-04`);
      assert.ok(
        content.includes('  required:'),
        `${slug}/manifest.yaml approval_block must have required: sub-key (two-space indent) — TRAD-04`
      );
    });

    it(`${slug}/manifest.yaml approval_block has scope sub-key — TRAD-04`, () => {
      const content = readFile(path.join(SACRED_DIR, slug, 'manifest.yaml'));
      assert.ok(content !== null, `templates/sacred/${slug}/manifest.yaml must exist — TRAD-04`);
      assert.ok(
        content.includes('  scope:'),
        `${slug}/manifest.yaml approval_block must have scope: sub-key (two-space indent) — TRAD-04`
      );
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// TRAD-05: build-ebook.md and build-print.md contain STEP 1.7 in correct order
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 33: TRAD-05 STEP 1.7 appears after STEP 1.6 and before STEP 2 in build commands', () => {
  it('STEP 1.7 appears after STEP 1.6 and before ### STEP 2: in build-ebook.md — TRAD-05', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read — TRAD-05');
    const s16 = content.indexOf('STEP 1.6');
    const s17 = content.indexOf('STEP 1.7');
    const s2  = content.indexOf('### STEP 2:');
    assert.ok(s16 !== -1, 'build-ebook.md must contain STEP 1.6 — TRAD-05');
    assert.ok(s17 !== -1, 'build-ebook.md must contain STEP 1.7 — TRAD-05');
    assert.ok(s2  !== -1, 'build-ebook.md must contain ### STEP 2: — TRAD-05');
    assert.ok(s16 < s17, 'STEP 1.6 must appear before STEP 1.7 in build-ebook.md — TRAD-05');
    assert.ok(s17 < s2,  'STEP 1.7 must appear before ### STEP 2: in build-ebook.md — TRAD-05');
  });

  it('build-ebook.md STEP 1.7 section title contains TRADITION LOADING — TRAD-05', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read — TRAD-05');
    assert.ok(
      content.includes('TRADITION LOADING'),
      'build-ebook.md must contain TRADITION LOADING section title in STEP 1.7 — TRAD-05'
    );
  });

  it('STEP 1.7 appears after STEP 1.6 and before ### STEP 2: in build-print.md — TRAD-05', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read — TRAD-05');
    const s16 = content.indexOf('STEP 1.6');
    const s17 = content.indexOf('STEP 1.7');
    const s2  = content.indexOf('### STEP 2:');
    assert.ok(s16 !== -1, 'build-print.md must contain STEP 1.6 — TRAD-05');
    assert.ok(s17 !== -1, 'build-print.md must contain STEP 1.7 — TRAD-05');
    assert.ok(s2  !== -1, 'build-print.md must contain ### STEP 2: — TRAD-05');
    assert.ok(s16 < s17, 'STEP 1.6 must appear before STEP 1.7 in build-print.md — TRAD-05');
    assert.ok(s17 < s2,  'STEP 1.7 must appear before ### STEP 2: in build-print.md — TRAD-05');
  });

  it('build-print.md STEP 1.7 section title contains TRADITION LOADING — TRAD-05', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read — TRAD-05');
    assert.ok(
      content.includes('TRADITION LOADING'),
      'build-print.md must contain TRADITION LOADING section title in STEP 1.7 — TRAD-05'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TRAD-03-behavioral: front-matter.md approval block step
// ─────────────────────────────────────────────────────────────────────────────
describe('TRAD-03-behavioral: front-matter.md approval block step', () => {
  it('front-matter.md contains approval_block reference — TRAD-03', () => {
    const content = readFile(FRONT_MATTER_PATH);
    assert.ok(content !== null, 'front-matter.md could not be read — TRAD-03');
    assert.ok(
      content.includes('approval_block') || content.includes('approval block'),
      'front-matter.md must reference approval_block (STEP 3.5 not yet added) — TRAD-03'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TRAD-04-behavioral: sacred-numbering-format.md command file
// ─────────────────────────────────────────────────────────────────────────────
describe('TRAD-04-behavioral: sacred-numbering-format.md command file', () => {
  it('sacred-numbering-format.md exists — TRAD-04', () => {
    const content = readFile(VERSE_NUM_PATH);
    assert.ok(content !== null, 'commands/scr/sacred-numbering-format.md must exist — TRAD-04');
  });

  it('sacred-numbering-format.md contains numbering.format reference — TRAD-04', () => {
    const content = readFile(VERSE_NUM_PATH);
    assert.ok(content !== null, 'commands/scr/sacred-numbering-format.md must exist — TRAD-04');
    assert.ok(
      content.includes('numbering.format') || content.includes('chapter:verse'),
      'sacred-numbering-format.md must reference numbering.format or chapter:verse — TRAD-04'
    );
  });
});
