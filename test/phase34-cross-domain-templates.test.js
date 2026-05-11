const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT              = path.join(__dirname, '..');
const TEMPLATES_DIR     = path.join(ROOT, 'data', 'export-templates');
const COMMANDS_DIR      = path.join(ROOT, 'commands', 'scr');
const BUILD_PRINT_PATH  = path.join(ROOT, 'commands', 'scr', 'build-print.md');
const BUILD_EBOOK_PATH  = path.join(ROOT, 'commands', 'scr', 'build-ebook.md');
const CONSTRAINTS_PATH  = path.join(ROOT, 'data', 'CONSTRAINTS.json');

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
// TPL-01: Stage Play Typst template (Samuel French format)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 34: TPL-01 scriven-stageplay.typst exists with Samuel French format markers', () => {
  const STAGEPLAY = path.join(TEMPLATES_DIR, 'scriven-stageplay.typst');

  it('scriven-stageplay.typst exists -- TPL-01', () => {
    const content = readFile(STAGEPLAY);
    assert.ok(content !== null, 'data/export-templates/scriven-stageplay.typst must exist -- TPL-01');
  });

  it('scriven-stageplay.typst contains page width 8.5in -- TPL-01', () => {
    const content = readFile(STAGEPLAY);
    assert.ok(content !== null, 'data/export-templates/scriven-stageplay.typst must exist -- TPL-01');
    assert.ok(
      content.includes('8.5in'),
      'scriven-stageplay.typst must contain page width 8.5in (US Letter) -- TPL-01'
    );
  });

  it('scriven-stageplay.typst contains character name centering pattern -- TPL-01', () => {
    const content = readFile(STAGEPLAY);
    assert.ok(content !== null, 'data/export-templates/scriven-stageplay.typst must exist -- TPL-01');
    assert.ok(
      content.includes('upper(') || content.includes('align(center'),
      'scriven-stageplay.typst must contain character name centering pattern (upper() or align(center)) -- TPL-01'
    );
  });

  it('scriven-stageplay.typst contains italic stage direction pattern -- TPL-01', () => {
    const content = readFile(STAGEPLAY);
    assert.ok(content !== null, 'data/export-templates/scriven-stageplay.typst must exist -- TPL-01');
    assert.ok(
      content.includes('emph') || content.includes('style: "italic"'),
      'scriven-stageplay.typst must contain italic stage direction pattern (emph or style: "italic") -- TPL-01'
    );
  });

  it('scriven-stageplay.typst contains act heading at level 1 -- TPL-01', () => {
    const content = readFile(STAGEPLAY);
    assert.ok(content !== null, 'data/export-templates/scriven-stageplay.typst must exist -- TPL-01');
    assert.ok(
      content.includes('heading.where(level: 1)'),
      'scriven-stageplay.typst must contain heading.where(level: 1) for act headings -- TPL-01'
    );
  });

  it('scriven-stageplay.typst contains scene heading at level 2 -- TPL-01', () => {
    const content = readFile(STAGEPLAY);
    assert.ok(content !== null, 'data/export-templates/scriven-stageplay.typst must exist -- TPL-01');
    assert.ok(
      content.includes('heading.where(level: 2)'),
      'scriven-stageplay.typst must contain heading.where(level: 2) for scene headings -- TPL-01'
    );
  });

  it('build-print.md contains STEP 1.8 -- TPL-01', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md must be readable -- TPL-01');
    assert.ok(
      content.includes('STEP 1.8'),
      'build-print.md must contain STEP 1.8 -- TPL-01'
    );
  });

  it('build-print.md STEP 1.8 appears after STEP 1.7 and before STEP 2 -- TPL-01', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md must be readable -- TPL-01');
    const s17 = content.indexOf('STEP 1.7');
    const s18 = content.indexOf('STEP 1.8');
    const s2  = content.indexOf('### STEP 2:');
    assert.ok(s17 !== -1, 'build-print.md must contain STEP 1.7 -- TPL-01');
    assert.ok(s18 !== -1, 'build-print.md must contain STEP 1.8 -- TPL-01');
    assert.ok(s2  !== -1, 'build-print.md must contain ### STEP 2: -- TPL-01');
    assert.ok(s17 < s18, 'STEP 1.7 must appear before STEP 1.8 in build-print.md -- TPL-01');
    assert.ok(s18 < s2,  'STEP 1.8 must appear before ### STEP 2: in build-print.md -- TPL-01');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-02: Picture Book Typst template (8.5x8.5 with bleed/safe-zone)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 34: TPL-02 scriven-picturebook.typst exists with bleed and safe zone markers', () => {
  const PICTUREBOOK = path.join(TEMPLATES_DIR, 'scriven-picturebook.typst');

  it('scriven-picturebook.typst exists -- TPL-02', () => {
    const content = readFile(PICTUREBOOK);
    assert.ok(content !== null, 'data/export-templates/scriven-picturebook.typst must exist -- TPL-02');
  });

  it('scriven-picturebook.typst contains bleed width 8.75in -- TPL-02', () => {
    const content = readFile(PICTUREBOOK);
    assert.ok(content !== null, 'data/export-templates/scriven-picturebook.typst must exist -- TPL-02');
    assert.ok(
      content.includes('8.75in'),
      'scriven-picturebook.typst must contain 8.75in (bleed width: 8.5 + 0.125 + 0.125) -- TPL-02'
    );
  });

  it('scriven-picturebook.typst contains bleed value 0.125in -- TPL-02', () => {
    const content = readFile(PICTUREBOOK);
    assert.ok(content !== null, 'data/export-templates/scriven-picturebook.typst must exist -- TPL-02');
    assert.ok(
      content.includes('0.125in'),
      'scriven-picturebook.typst must contain 0.125in bleed value -- TPL-02'
    );
  });

  it('scriven-picturebook.typst contains safe zone 0.25in -- TPL-02', () => {
    const content = readFile(PICTUREBOOK);
    assert.ok(content !== null, 'data/export-templates/scriven-picturebook.typst must exist -- TPL-02');
    assert.ok(
      content.includes('0.25in'),
      'scriven-picturebook.typst must contain 0.25in safe zone / margin value -- TPL-02'
    );
  });

  it('scriven-picturebook.typst contains spread/two-page layout marker -- TPL-02', () => {
    const content = readFile(PICTUREBOOK);
    assert.ok(content !== null, 'data/export-templates/scriven-picturebook.typst must exist -- TPL-02');
    assert.ok(
      content.includes('spread') || content.includes('two-page') || content.includes('facing'),
      'scriven-picturebook.typst must contain spread or two-page layout logic -- TPL-02'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-03: Fixed-layout EPUB CSS and OPF stub (Apple Books compatibility)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 34: TPL-03 fixed-layout EPUB CSS and OPF stub exist with Apple Books compatibility markers', () => {
  const FL_CSS = path.join(TEMPLATES_DIR, 'scriven-fixed-layout-epub.css');
  const FL_OPF = path.join(TEMPLATES_DIR, 'scriven-fixed-layout.opf');

  it('scriven-fixed-layout-epub.css exists -- TPL-03', () => {
    const content = readFile(FL_CSS);
    assert.ok(content !== null, 'data/export-templates/scriven-fixed-layout-epub.css must exist -- TPL-03');
  });

  it('scriven-fixed-layout.opf exists -- TPL-03', () => {
    const content = readFile(FL_OPF);
    assert.ok(content !== null, 'data/export-templates/scriven-fixed-layout.opf must exist -- TPL-03');
  });

  it('scriven-fixed-layout-epub.css contains epub-layout fixed marker -- TPL-03', () => {
    const content = readFile(FL_CSS);
    assert.ok(content !== null, 'data/export-templates/scriven-fixed-layout-epub.css must exist -- TPL-03');
    assert.ok(
      content.includes('-epub-layout') || content.includes('rendition:layout'),
      'scriven-fixed-layout-epub.css must contain -epub-layout or rendition:layout fixed marker -- TPL-03'
    );
  });

  it('scriven-fixed-layout.opf contains rendition:layout property -- TPL-03', () => {
    const content = readFile(FL_OPF);
    assert.ok(content !== null, 'data/export-templates/scriven-fixed-layout.opf must exist -- TPL-03');
    assert.ok(
      content.includes('rendition:layout'),
      'scriven-fixed-layout.opf must contain rendition:layout property (OPF metadata for fixed-layout) -- TPL-03'
    );
  });

  it('scriven-fixed-layout.opf contains rendition:spread property -- TPL-03', () => {
    const content = readFile(FL_OPF);
    assert.ok(content !== null, 'data/export-templates/scriven-fixed-layout.opf must exist -- TPL-03');
    assert.ok(
      content.includes('rendition:spread'),
      'scriven-fixed-layout.opf must contain rendition:spread property -- TPL-03'
    );
  });

  it('build-ebook.md contains --fixed-layout flag reference -- TPL-03', () => {
    const content = readFile(BUILD_EBOOK_PATH);
    assert.ok(content !== null, 'commands/scr/build-ebook.md must be readable -- TPL-03');
    assert.ok(
      content.includes('--fixed-layout'),
      'build-ebook.md must contain --fixed-layout flag reference -- TPL-03'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-04: Smashwords DOCX reference doc and build command
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 34: TPL-04 Smashwords DOCX reference doc and build command exist', () => {
  const SW_DOCX   = path.join(TEMPLATES_DIR, 'scriven-smashwords.docx');
  const SW_STYLES = path.join(TEMPLATES_DIR, 'scriven-smashwords-styles.md');
  const SW_CMD    = path.join(COMMANDS_DIR, 'build-smashwords.md');

  it('scriven-smashwords.docx exists -- TPL-04', () => {
    assert.ok(
      fs.existsSync(SW_DOCX),
      'data/export-templates/scriven-smashwords.docx must exist -- TPL-04'
    );
  });

  it('scriven-smashwords-styles.md exists -- TPL-04', () => {
    const content = readFile(SW_STYLES);
    assert.ok(content !== null, 'data/export-templates/scriven-smashwords-styles.md must exist -- TPL-04');
  });

  it('scriven-smashwords-styles.md prohibits tabs -- TPL-04', () => {
    const content = readFile(SW_STYLES);
    assert.ok(content !== null, 'data/export-templates/scriven-smashwords-styles.md must exist -- TPL-04');
    assert.ok(
      content.includes('no tabs') || content.includes('tabs'),
      'scriven-smashwords-styles.md must contain tabs prohibition -- TPL-04'
    );
  });

  it('scriven-smashwords-styles.md specifies first-line indent -- TPL-04', () => {
    const content = readFile(SW_STYLES);
    assert.ok(content !== null, 'data/export-templates/scriven-smashwords-styles.md must exist -- TPL-04');
    assert.ok(
      content.includes('first-line') || content.includes('FirstLineIndent') || content.includes('first_line'),
      'scriven-smashwords-styles.md must contain first-line indent reference -- TPL-04'
    );
  });

  it('commands/scr/build-smashwords.md exists -- TPL-04', () => {
    const content = readFile(SW_CMD);
    assert.ok(content !== null, 'commands/scr/build-smashwords.md must exist -- TPL-04');
  });

  it('build-smashwords.md references --reference-doc flag -- TPL-04', () => {
    const content = readFile(SW_CMD);
    assert.ok(content !== null, 'commands/scr/build-smashwords.md must exist -- TPL-04');
    assert.ok(
      content.includes('--reference-doc'),
      'build-smashwords.md must contain --reference-doc flag reference -- TPL-04'
    );
  });

  it('data/CONSTRAINTS.json contains build-smashwords command entry -- TPL-04', () => {
    const content = readFile(CONSTRAINTS_PATH);
    assert.ok(content !== null, 'data/CONSTRAINTS.json must be readable -- TPL-04');
    assert.ok(
      content.includes('"build-smashwords"'),
      'data/CONSTRAINTS.json must contain "build-smashwords" key -- TPL-04'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-05: Chapbook Typst template (5.5x8.5 saddle-stitch)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 34: TPL-05 scriven-chapbook.typst exists with 5.5x8.5 saddle-stitch markers', () => {
  const CHAPBOOK = path.join(TEMPLATES_DIR, 'scriven-chapbook.typst');

  it('scriven-chapbook.typst exists -- TPL-05', () => {
    const content = readFile(CHAPBOOK);
    assert.ok(content !== null, 'data/export-templates/scriven-chapbook.typst must exist -- TPL-05');
  });

  it('scriven-chapbook.typst contains page width 5.5in -- TPL-05', () => {
    const content = readFile(CHAPBOOK);
    assert.ok(content !== null, 'data/export-templates/scriven-chapbook.typst must exist -- TPL-05');
    assert.ok(
      content.includes('5.5in'),
      'scriven-chapbook.typst must contain page width 5.5in -- TPL-05'
    );
  });

  it('scriven-chapbook.typst contains page height 8.5in -- TPL-05', () => {
    const content = readFile(CHAPBOOK);
    assert.ok(content !== null, 'data/export-templates/scriven-chapbook.typst must exist -- TPL-05');
    assert.ok(
      content.includes('8.5in'),
      'scriven-chapbook.typst must contain page height 8.5in -- TPL-05'
    );
  });

  it('scriven-chapbook.typst contains page-count multiple-of-4 comment -- TPL-05', () => {
    const content = readFile(CHAPBOOK);
    assert.ok(content !== null, 'data/export-templates/scriven-chapbook.typst must exist -- TPL-05');
    assert.ok(
      content.includes('multiple of 4') || content.includes('saddle') || content.includes('mod 4'),
      'scriven-chapbook.typst must contain page-count multiple-of-4 or saddle-stitch comment -- TPL-05'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-06: Poetry Submission DOCX reference doc and build command
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 34: TPL-06 poetry submission DOCX reference doc and build command exist', () => {
  const PS_DOCX   = path.join(TEMPLATES_DIR, 'scriven-poetry-submission.docx');
  const PS_STYLES = path.join(TEMPLATES_DIR, 'scriven-poetry-submission-styles.md');
  const PS_CMD    = path.join(COMMANDS_DIR, 'build-poetry-submission.md');

  it('scriven-poetry-submission.docx exists -- TPL-06', () => {
    assert.ok(
      fs.existsSync(PS_DOCX),
      'data/export-templates/scriven-poetry-submission.docx must exist -- TPL-06'
    );
  });

  it('scriven-poetry-submission-styles.md exists -- TPL-06', () => {
    const content = readFile(PS_STYLES);
    assert.ok(content !== null, 'data/export-templates/scriven-poetry-submission-styles.md must exist -- TPL-06');
  });

  it('scriven-poetry-submission-styles.md specifies page break per poem -- TPL-06', () => {
    const content = readFile(PS_STYLES);
    assert.ok(content !== null, 'data/export-templates/scriven-poetry-submission-styles.md must exist -- TPL-06');
    assert.ok(
      content.includes('page break') || content.includes('pagebreak') || content.includes('page-break'),
      'scriven-poetry-submission-styles.md must specify page break per poem -- TPL-06'
    );
  });

  it('scriven-poetry-submission-styles.md specifies Times New Roman or Garamond -- TPL-06', () => {
    const content = readFile(PS_STYLES);
    assert.ok(content !== null, 'data/export-templates/scriven-poetry-submission-styles.md must exist -- TPL-06');
    assert.ok(
      content.includes('Times New Roman') || content.includes('Garamond'),
      'scriven-poetry-submission-styles.md must specify Times New Roman or Garamond -- TPL-06'
    );
  });

  it('commands/scr/build-poetry-submission.md exists -- TPL-06', () => {
    const content = readFile(PS_CMD);
    assert.ok(content !== null, 'commands/scr/build-poetry-submission.md must exist -- TPL-06');
  });

  it('build-poetry-submission.md references title page -- TPL-06', () => {
    const content = readFile(PS_CMD);
    assert.ok(content !== null, 'commands/scr/build-poetry-submission.md must exist -- TPL-06');
    assert.ok(
      content.includes('title page') || content.includes('title-page'),
      'build-poetry-submission.md must reference title page -- TPL-06'
    );
  });

  it('build-poetry-submission.md references TOC -- TPL-06', () => {
    const content = readFile(PS_CMD);
    assert.ok(content !== null, 'commands/scr/build-poetry-submission.md must exist -- TPL-06');
    assert.ok(
      content.includes('TOC') || content.includes('toc') || content.includes('table of contents'),
      'build-poetry-submission.md must reference TOC or table of contents -- TPL-06'
    );
  });

  it('data/CONSTRAINTS.json contains build-poetry-submission command entry -- TPL-06', () => {
    const content = readFile(CONSTRAINTS_PATH);
    assert.ok(content !== null, 'data/CONSTRAINTS.json must be readable -- TPL-06');
    assert.ok(
      content.includes('"build-poetry-submission"'),
      'data/CONSTRAINTS.json must contain "build-poetry-submission" key -- TPL-06'
    );
  });
});
