const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BUILD_EBOOK_PATH  = path.join(ROOT, 'commands', 'scr', 'build-ebook.md');
const BUILD_PRINT_PATH  = path.join(ROOT, 'commands', 'scr', 'build-print.md');
const CONSTRAINTS_PATH  = path.join(ROOT, 'data', 'CONSTRAINTS.json');
const PLATFORMS_DIR     = path.join(ROOT, 'templates', 'platforms');

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
// BUILD-01: build-ebook.md exists with correct structure
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 32: BUILD-01 build-ebook.md exists and is structurally valid', () => {
  it('build-ebook.md exists at commands/scr/build-ebook.md -- BUILD-01', () => {
    assert.ok(
      fs.existsSync(BUILD_EBOOK_PATH),
      'commands/scr/build-ebook.md must exist -- BUILD-01'
    );
  });

  it('build-ebook.md has YAML frontmatter with description: field -- BUILD-01', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.match(content, /^---\n[\s\S]*?\n---/, 'build-ebook.md must have YAML frontmatter -- BUILD-01');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm && fm[1].includes('description:'), 'frontmatter must include description: field -- BUILD-01');
  });

  it('build-ebook.md has YAML frontmatter with argument-hint: field -- BUILD-01', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm && fm[1].includes('argument-hint:'), 'frontmatter must include argument-hint: field -- BUILD-01');
  });

  it('build-ebook.md contains STEP 1.5 validate gate -- BUILD-01', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.ok(content.includes('STEP 1.5'), 'build-ebook.md must contain STEP 1.5 (validate gate) -- BUILD-01');
  });

  it('build-ebook.md contains STEP 1.6 front-matter gate -- BUILD-01', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.ok(content.includes('STEP 1.6'), 'build-ebook.md must contain STEP 1.6 (front-matter gate) -- BUILD-01');
  });

  it('STEP 1.5 appears before STEP 1.6 in build-ebook.md -- BUILD-01', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    const s15 = content.indexOf('STEP 1.5');
    const s16 = content.indexOf('STEP 1.6');
    assert.ok(s15 !== -1, 'build-ebook.md must contain STEP 1.5 -- BUILD-01');
    assert.ok(s16 !== -1, 'build-ebook.md must contain STEP 1.6 -- BUILD-01');
    assert.ok(s15 < s16, 'STEP 1.5 must appear before STEP 1.6 in build-ebook.md -- BUILD-01');
  });

  it('STEP 1.6 appears before ### STEP 2: in build-ebook.md -- BUILD-01', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    const s16 = content.indexOf('STEP 1.6');
    const s2  = content.indexOf('### STEP 2:');
    assert.ok(s16 !== -1, 'build-ebook.md must contain STEP 1.6 -- BUILD-01');
    assert.ok(s2  !== -1, 'build-ebook.md must contain ### STEP 2: -- BUILD-01');
    assert.ok(s16 < s2, 'STEP 1.6 must appear before ### STEP 2: in build-ebook.md -- BUILD-01');
  });

  it('build-ebook.md contains --skip-validate escape hatch -- BUILD-01', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.ok(content.includes('--skip-validate'), 'build-ebook.md must contain --skip-validate escape hatch text -- BUILD-01');
  });

  it('build-ebook.md validate gate says "Build blocked" not "Export blocked" -- BUILD-01', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.ok(content.includes('Build blocked'), 'build-ebook.md must say "Build blocked" (not "Export blocked") in validate gate -- BUILD-01');
  });

  it('CONSTRAINTS.json exports.build_ebook exists with available array -- BUILD-01', () => {
    const raw = readFile(CONSTRAINTS_PATH);
    assert.ok(raw !== null, 'data/CONSTRAINTS.json could not be read');
    const c = JSON.parse(raw);
    assert.ok(c.exports && c.exports.build_ebook, 'exports.build_ebook must exist in CONSTRAINTS.json -- BUILD-01');
    assert.ok(Array.isArray(c.exports.build_ebook.available), 'build_ebook.available must be an array -- BUILD-01');
  });

  it('CONSTRAINTS.json build_ebook.available includes all 5 work type families -- BUILD-01', () => {
    const raw = readFile(CONSTRAINTS_PATH);
    assert.ok(raw !== null, 'data/CONSTRAINTS.json could not be read');
    const c = JSON.parse(raw);
    assert.ok(c.exports && c.exports.build_ebook, 'exports.build_ebook must exist -- BUILD-01');
    const available = c.exports.build_ebook.available;
    assert.ok(Array.isArray(available), 'build_ebook.available must be an array -- BUILD-01');
    const expected = ['prose', 'visual', 'poetry', 'interactive', 'sacred'];
    for (const family of expected) {
      assert.ok(available.includes(family), `build_ebook.available must include "${family}" -- BUILD-01`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-02: build-print.md exists with correct structure
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 32: BUILD-02 build-print.md exists and is structurally valid', () => {
  it('build-print.md exists at commands/scr/build-print.md -- BUILD-02', () => {
    assert.ok(
      fs.existsSync(BUILD_PRINT_PATH),
      'commands/scr/build-print.md must exist -- BUILD-02'
    );
  });

  it('build-print.md has YAML frontmatter with description: field -- BUILD-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.match(content, /^---\n[\s\S]*?\n---/, 'build-print.md must have YAML frontmatter -- BUILD-02');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm && fm[1].includes('description:'), 'frontmatter must include description: field -- BUILD-02');
  });

  it('build-print.md has YAML frontmatter with argument-hint: field -- BUILD-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm && fm[1].includes('argument-hint:'), 'frontmatter must include argument-hint: field -- BUILD-02');
  });

  it('build-print.md contains STEP 1.5 validate gate -- BUILD-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('STEP 1.5'), 'build-print.md must contain STEP 1.5 (validate gate) -- BUILD-02');
  });

  it('build-print.md contains STEP 1.6 front-matter gate -- BUILD-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('STEP 1.6'), 'build-print.md must contain STEP 1.6 (front-matter gate) -- BUILD-02');
  });

  it('STEP 1.5 appears before STEP 1.6 in build-print.md -- BUILD-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    const s15 = content.indexOf('STEP 1.5');
    const s16 = content.indexOf('STEP 1.6');
    assert.ok(s15 !== -1, 'build-print.md must contain STEP 1.5 -- BUILD-02');
    assert.ok(s16 !== -1, 'build-print.md must contain STEP 1.6 -- BUILD-02');
    assert.ok(s15 < s16, 'STEP 1.5 must appear before STEP 1.6 in build-print.md -- BUILD-02');
  });

  it('STEP 1.6 appears before ### STEP 2: in build-print.md -- BUILD-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    const s16 = content.indexOf('STEP 1.6');
    const s2  = content.indexOf('### STEP 2:');
    assert.ok(s16 !== -1, 'build-print.md must contain STEP 1.6 -- BUILD-02');
    assert.ok(s2  !== -1, 'build-print.md must contain ### STEP 2: -- BUILD-02');
    assert.ok(s16 < s2, 'STEP 1.6 must appear before ### STEP 2: in build-print.md -- BUILD-02');
  });

  it('build-print.md contains --skip-validate escape hatch -- BUILD-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('--skip-validate'), 'build-print.md must contain --skip-validate escape hatch text -- BUILD-02');
  });

  it('build-print.md validate gate says "Build blocked" -- BUILD-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('Build blocked'), 'build-print.md must say "Build blocked" in validate gate -- BUILD-02');
  });

  it('CONSTRAINTS.json exports.build_print exists with available array -- BUILD-02', () => {
    const raw = readFile(CONSTRAINTS_PATH);
    assert.ok(raw !== null, 'data/CONSTRAINTS.json could not be read');
    const c = JSON.parse(raw);
    assert.ok(c.exports && c.exports.build_print, 'exports.build_print must exist in CONSTRAINTS.json -- BUILD-02');
    assert.ok(Array.isArray(c.exports.build_print.available), 'build_print.available must be an array -- BUILD-02');
  });

  it('CONSTRAINTS.json build_print.available includes prose, visual, poetry, sacred -- BUILD-02', () => {
    const raw = readFile(CONSTRAINTS_PATH);
    assert.ok(raw !== null, 'data/CONSTRAINTS.json could not be read');
    const c = JSON.parse(raw);
    assert.ok(c.exports && c.exports.build_print, 'exports.build_print must exist -- BUILD-02');
    const available = c.exports.build_print.available;
    assert.ok(Array.isArray(available), 'build_print.available must be an array -- BUILD-02');
    const expected = ['prose', 'visual', 'poetry', 'sacred'];
    for (const family of expected) {
      assert.ok(available.includes(family), `build_print.available must include "${family}" -- BUILD-02`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-03: --platform flag present in both commands
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 32: BUILD-03 --platform flag and required argument-hints', () => {
  it('build-ebook.md argument-hint includes --platform -- BUILD-03', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'build-ebook.md must have YAML frontmatter -- BUILD-03');
    assert.ok(fm[1].includes('--platform'), 'build-ebook.md argument-hint must include --platform -- BUILD-03');
  });

  it('build-print.md argument-hint includes --platform -- BUILD-03', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'build-print.md must have YAML frontmatter -- BUILD-03');
    assert.ok(fm[1].includes('--platform'), 'build-print.md argument-hint must include --platform -- BUILD-03');
  });

  it('build-print.md argument-hint includes --trim -- BUILD-03', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'build-print.md must have YAML frontmatter -- BUILD-03');
    assert.ok(fm[1].includes('--trim'), 'build-print.md argument-hint must include --trim -- BUILD-03');
  });

  it('build-print.md argument-hint includes --strict -- BUILD-03', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'build-print.md must have YAML frontmatter -- BUILD-03');
    assert.ok(fm[1].includes('--strict'), 'build-print.md argument-hint must include --strict -- BUILD-03');
  });

  it('build-ebook.md resolves and validates the selected platform -- BUILD-03', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.ok(content.includes('### STEP 1.8: VALIDATE PLATFORM'), 'build-ebook.md must validate platform selection -- BUILD-03');
    assert.ok(content.includes('Load `${PLATFORM_TEMPLATE_DIR}/{platform}/manifest.yaml`'), 'build-ebook.md must load the resolved platform manifest -- BUILD-03');
    assert.ok(content.includes('formats_accepted'), 'build-ebook.md must check accepted formats -- BUILD-03');
    assert.ok(content.includes('epub_variant'), 'build-ebook.md must read epub_variant from the platform manifest -- BUILD-03');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-04: prerequisite detection in both commands
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 32: BUILD-04 prerequisite detection (pandoc, typst, ghostscript)', () => {
  it('build-ebook.md contains "command -v pandoc" check -- BUILD-04', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.ok(content.includes('command -v pandoc'), 'build-ebook.md must contain "command -v pandoc" prerequisite check -- BUILD-04');
  });

  it('build-ebook.md contains "brew install pandoc" install hint -- BUILD-04', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.ok(content.includes('brew install pandoc'), 'build-ebook.md must contain "brew install pandoc" install hint -- BUILD-04');
  });

  it('build-print.md contains "command -v pandoc" check -- BUILD-04', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('command -v pandoc'), 'build-print.md must contain "command -v pandoc" prerequisite check -- BUILD-04');
  });

  it('build-print.md contains "command -v typst" check -- BUILD-04', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('command -v typst'), 'build-print.md must contain "command -v typst" prerequisite check -- BUILD-04');
  });

  it('build-print.md contains "brew install typst" install hint -- BUILD-04', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('brew install typst'), 'build-print.md must contain "brew install typst" install hint -- BUILD-04');
  });

  it('build-print.md contains "command -v gs" for Ghostscript (IngramSpark) -- BUILD-04', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('command -v gs'), 'build-print.md must contain "command -v gs" for IngramSpark Ghostscript prerequisite -- BUILD-04');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-05: EPUB accessibility requirements (EAA compliance)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 32: BUILD-05 EPUB accessibility (EAA compliance)', () => {
  it('build-ebook.md references lang tag (EAA requirement) -- BUILD-05', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.ok(content.includes('lang'), 'build-ebook.md must reference "lang" attribute (EAA language tag requirement) -- BUILD-05');
  });

  it('build-ebook.md references alt text (EAA requirement) -- BUILD-05', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.ok(content.includes('alt text'), 'build-ebook.md must reference "alt text" (EAA image accessibility requirement) -- BUILD-05');
  });

  it('build-ebook.md references semantic nav / epub:type -- BUILD-05', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    const hasSemanticNav =
      content.includes('epub:type') ||
      content.includes('semantic nav') ||
      content.includes('semantic navigation') ||
      content.includes('nav');
    assert.ok(hasSemanticNav, 'build-ebook.md must reference epub:type, "semantic nav", or "nav" (EPUB semantic navigation -- EAA) -- BUILD-05');
  });

  it('build-ebook.md Pandoc invocation includes --toc flag -- BUILD-05', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    assert.ok(content.includes('--toc'), 'build-ebook.md Pandoc invocation must include --toc for accessible table of contents -- BUILD-05');
  });

  it('build-ebook.md Pandoc invocation includes accessibility metadata flag -- BUILD-05', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md could not be read');
    const hasAccessibilityFlag =
      content.includes('--epub-metadata') ||
      content.includes('accessibility') ||
      content.includes('epub-css') ||
      content.includes('scriveno-epub.css');
    assert.ok(hasAccessibilityFlag, 'build-ebook.md must include --epub-metadata or accessibility CSS flag in Pandoc invocation -- BUILD-05');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM-01: page-count estimation (wpp values)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 32: PLATFORM-01 page-count estimation (words-per-page values)', () => {
  it('build-print.md references wpp or words-per-page for page count estimation -- PLATFORM-01', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    const hasWpp = content.includes('wpp') || content.includes('words-per-page') || content.includes('words per page');
    assert.ok(hasWpp, 'build-print.md must reference wpp or words-per-page for page count estimation -- PLATFORM-01');
  });

  it('kdp/manifest.yaml has wpp: 220 for 5x8 trim -- PLATFORM-01', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('wpp: 220'), 'kdp manifest must have wpp: 220 (5x8 trim density) -- PLATFORM-01');
  });

  it('kdp/manifest.yaml has wpp: 230 for 5.25x8 trim -- PLATFORM-01', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('wpp: 230'), 'kdp manifest must have wpp: 230 (5.25x8 trim density) -- PLATFORM-01');
  });

  it('kdp/manifest.yaml has wpp: 235 for 5.5x8.5 trim -- PLATFORM-01', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('wpp: 235'), 'kdp manifest must have wpp: 235 (5.5x8.5 trim density) -- PLATFORM-01');
  });

  it('kdp/manifest.yaml has wpp: 250 for 6x9 trim -- PLATFORM-01', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('wpp: 250'), 'kdp manifest must have wpp: 250 (6x9 trim density) -- PLATFORM-01');
  });

  it('kdp/manifest.yaml has wpp: 300 for 7x10 trim -- PLATFORM-01', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('wpp: 300'), 'kdp manifest must have wpp: 300 (7x10 trim density) -- PLATFORM-01');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM-02: page-count guardrail (soft warning + --strict hard block)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 32: PLATFORM-02 page-count guardrail (soft warning + --strict hard block)', () => {
  it('build-print.md contains warning format string with "Estimated" -- PLATFORM-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('Estimated'), 'build-print.md must contain "Estimated" in warning format string -- PLATFORM-02');
  });

  it('build-print.md contains "pages" in warning context -- PLATFORM-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('pages'), 'build-print.md must contain "pages" in page-count warning -- PLATFORM-02');
  });

  it('build-print.md contains "Building anyway" (soft warning, not hard block) -- PLATFORM-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('Building anyway'), 'build-print.md must contain "Building anyway" -- page-count warning is soft (not hard block by default) -- PLATFORM-02');
  });

  it('build-print.md contains --strict flag reference for hard block -- PLATFORM-02', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    assert.ok(content.includes('--strict'), 'build-print.md must contain --strict flag reference (hard block mode) -- PLATFORM-02');
  });

  it('kdp/manifest.yaml has max_pages.paperback: 828 -- PLATFORM-02', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('paperback: 828'), 'kdp manifest must have max_pages.paperback: 828 -- PLATFORM-02');
  });

  it('kdp/manifest.yaml has max_pages.hardcover: 550 -- PLATFORM-02', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('hardcover: 550'), 'kdp manifest must have max_pages.hardcover: 550 -- PLATFORM-02');
  });

  it('ingram/manifest.yaml has max_pages.paperback: 1200 -- PLATFORM-02', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'ingram', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/ingram/manifest.yaml could not be read');
    assert.ok(content.includes('paperback: 1200'), 'ingram manifest must have max_pages.paperback: 1200 -- PLATFORM-02');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM-03: trim size validation + manifest population for all 8 platforms
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 32: PLATFORM-03 trim size validation + all 8 platform manifests active', () => {
  const allPlatforms = ['kdp', 'ingram', 'apple', 'bn', 'd2d', 'kobo', 'google', 'smashwords'];
  const epubOnlyPlatforms = ['apple', 'bn', 'd2d', 'kobo', 'google', 'smashwords'];
  const printPlatforms = ['kdp', 'ingram'];

  it('templates/platforms/README.md describes shipped active profiles, not placeholder profiles -- PLATFORM-03', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'README.md'));
    assert.ok(content !== null, 'templates/platforms/README.md could not be read -- PLATFORM-03');
    assert.ok(content.includes('Currently shipped platforms'), 'platform README should describe currently shipped platforms -- PLATFORM-03');
    assert.ok(!content.includes('All 8 ship with `status: placeholder`'), 'platform README must not claim shipped profiles are placeholders -- PLATFORM-03');
  });

  // All 8 manifests must be status: active (not status: placeholder)
  for (const platform of allPlatforms) {
    it(`${platform}/manifest.yaml has status: active (not status: placeholder) -- PLATFORM-03`, () => {
      const content = readFile(path.join(PLATFORMS_DIR, platform, 'manifest.yaml'));
      assert.ok(content !== null, `templates/platforms/${platform}/manifest.yaml could not be read -- PLATFORM-03`);
      assert.ok(
        !content.includes('status: placeholder'),
        `${platform}/manifest.yaml must not have status: placeholder -- must be status: active -- PLATFORM-03`
      );
    });
  }

  // KDP trim sizes: all 5 must be present
  it('kdp manifest has trim size key 5x8 -- PLATFORM-03', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('5x8:'), 'kdp manifest must have 5x8 trim size key -- PLATFORM-03');
  });

  it('kdp manifest has trim size key 5.25x8 -- PLATFORM-03', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('5.25x8:'), 'kdp manifest must have 5.25x8 trim size key -- PLATFORM-03');
  });

  it('kdp manifest has trim size key 5.5x8.5 -- PLATFORM-03', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('5.5x8.5:'), 'kdp manifest must have 5.5x8.5 trim size key -- PLATFORM-03');
  });

  it('kdp manifest has trim size key 6x9 -- PLATFORM-03', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('6x9:'), 'kdp manifest must have 6x9 trim size key -- PLATFORM-03');
  });

  it('kdp manifest has trim size key 7x10 -- PLATFORM-03', () => {
    const content = readFile(path.join(PLATFORMS_DIR, 'kdp', 'manifest.yaml'));
    assert.ok(content !== null, 'templates/platforms/kdp/manifest.yaml could not be read');
    assert.ok(content.includes('7x10:'), 'kdp manifest must have 7x10 trim size key -- PLATFORM-03');
  });

  // EPUB-only platforms have trim_sizes: null and max_pages: null
  for (const platform of epubOnlyPlatforms) {
    it(`${platform}/manifest.yaml has trim_sizes: null (EPUB-only) -- PLATFORM-03`, () => {
      const content = readFile(path.join(PLATFORMS_DIR, platform, 'manifest.yaml'));
      assert.ok(content !== null, `templates/platforms/${platform}/manifest.yaml could not be read -- PLATFORM-03`);
      assert.ok(
        content.includes('trim_sizes: null'),
        `${platform}/manifest.yaml must have trim_sizes: null (EPUB-only platform) -- PLATFORM-03`
      );
    });

    it(`${platform}/manifest.yaml has max_pages: null (EPUB-only) -- PLATFORM-03`, () => {
      const content = readFile(path.join(PLATFORMS_DIR, platform, 'manifest.yaml'));
      assert.ok(content !== null, `templates/platforms/${platform}/manifest.yaml could not be read -- PLATFORM-03`);
      assert.ok(
        content.includes('max_pages: null'),
        `${platform}/manifest.yaml must have max_pages: null (EPUB-only platform) -- PLATFORM-03`
      );
    });
  }

  // Print platforms include pdf_print_ready in formats_accepted
  for (const platform of printPlatforms) {
    it(`${platform}/manifest.yaml includes pdf_print_ready in formats_accepted -- PLATFORM-03`, () => {
      const content = readFile(path.join(PLATFORMS_DIR, platform, 'manifest.yaml'));
      assert.ok(content !== null, `templates/platforms/${platform}/manifest.yaml could not be read -- PLATFORM-03`);
      assert.ok(
        content.includes('pdf_print_ready'),
        `${platform}/manifest.yaml must include "pdf_print_ready" in formats_accepted -- PLATFORM-03`
      );
    });
  }

  // EPUB-only platforms have formats_accepted containing only epub
  for (const platform of epubOnlyPlatforms) {
    it(`${platform}/manifest.yaml formats_accepted contains epub -- PLATFORM-03`, () => {
      const content = readFile(path.join(PLATFORMS_DIR, platform, 'manifest.yaml'));
      assert.ok(content !== null, `templates/platforms/${platform}/manifest.yaml could not be read -- PLATFORM-03`);
      assert.ok(
        content.includes('epub'),
        `${platform}/manifest.yaml must have epub in formats_accepted (EPUB-only platform) -- PLATFORM-03`
      );
    });

    it(`${platform}/manifest.yaml formats_accepted does not include pdf_print_ready (EPUB-only) -- PLATFORM-03`, () => {
      const content = readFile(path.join(PLATFORMS_DIR, platform, 'manifest.yaml'));
      assert.ok(content !== null, `templates/platforms/${platform}/manifest.yaml could not be read -- PLATFORM-03`);
      assert.ok(
        !content.includes('pdf_print_ready'),
        `${platform}/manifest.yaml must NOT include pdf_print_ready (EPUB-only platform has no print output) -- PLATFORM-03`
      );
    });
  }

  // build-print.md contains unsupported trim size rejection text
  it('build-print.md contains unsupported trim size rejection text -- PLATFORM-03', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md could not be read');
    const hasRejection =
      content.includes('not supported') ||
      content.includes('unsupported') ||
      content.includes('Trim size');
    assert.ok(
      hasRejection,
      'build-print.md must contain unsupported trim size rejection text ("not supported", "unsupported", or "Trim size") -- PLATFORM-03'
    );
  });
});
