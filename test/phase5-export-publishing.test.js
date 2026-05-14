const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const commandsDir = path.join(ROOT, 'commands', 'scr');
const templatesDir = path.join(ROOT, 'data', 'export-templates');
const constraintsPath = path.join(ROOT, 'data', 'CONSTRAINTS.json');

// ── Export templates (supports D-06) ───────────────────────────────

describe('Export templates (D-06)', () => {

  describe('scriveno-book.typst', () => {
    const filePath = path.join(templatesDir, 'scriveno-book.typst');

    it('scriveno-book.typst exists', () => {
      assert.ok(fs.existsSync(filePath), 'scriveno-book.typst should exist');
    });

    it('contains margin parameters', () => {
      const content = fs.readFileSync(filePath, 'utf8');
      assert.match(content, /margin/, 'should contain margin parameters');
    });

    it('contains page size parameters', () => {
      const content = fs.readFileSync(filePath, 'utf8');
      assert.match(content, /page-width|page-height|paperwidth|paperheight/, 'should contain page size parameters');
    });
  });

  describe('scriveno-epub.css', () => {
    const filePath = path.join(templatesDir, 'scriveno-epub.css');

    it('scriveno-epub.css exists', () => {
      assert.ok(fs.existsSync(filePath), 'scriveno-epub.css should exist');
    });

    it('contains font-family', () => {
      const content = fs.readFileSync(filePath, 'utf8');
      assert.match(content, /font-family/, 'should contain font-family');
    });

    it('contains line-height', () => {
      const content = fs.readFileSync(filePath, 'utf8');
      assert.match(content, /line-height/, 'should contain line-height');
    });
  });

  describe('scriveno-academic.latex', () => {
    const filePath = path.join(templatesDir, 'scriveno-academic.latex');

    it('scriveno-academic.latex exists', () => {
      assert.ok(fs.existsSync(filePath), 'scriveno-academic.latex should exist');
    });

    it('contains documentclass', () => {
      const content = fs.readFileSync(filePath, 'utf8');
      assert.match(content, /documentclass/, 'should contain documentclass');
    });
  });
});

// ── EXP-01: export markdown (D-01, D-03) ──────────────────────────

describe('EXP-01: export markdown (D-01, D-03)', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('export.md exists', () => {
    assert.ok(fs.existsSync(filePath), 'export.md should exist');
  });

  it('has YAML frontmatter with description', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'missing YAML frontmatter');
    assert.ok(fm[1].includes('description:'), 'missing description field');
  });

  it('contains markdown format section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /markdown/i, 'should contain markdown format section');
  });

  it('references OUTLINE for assembly', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /OUTLINE/, 'should reference OUTLINE for assembly');
  });
});

// ── EXP-02: export docx (D-02) ────────────────────────────────────

describe('EXP-02: export docx (D-02)', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains docx section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /docx/i, 'should contain docx section');
  });

  it('describes optional custom reference docs for manuscript docx', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /Pandoc's default DOCX styling/, 'should describe the default DOCX styling');
    assert.match(content, /optional `--reference-doc`/, 'should allow an optional custom reference doc');
  });

  it('checks for pandoc with command -v', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /command -v pandoc/, 'should check for pandoc with command -v');
  });
});

// ── EXP-03: export docx --formatted ───────────────────────────────

describe('EXP-03: export docx --formatted', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains formatted section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /formatted/i, 'should contain formatted section');
  });

  it('describes default formatted docx output with optional custom reference doc', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /default DOCX output/, 'should describe Pandoc default DOCX output');
    assert.doesNotMatch(content, /scriveno-formatted\.docx/, 'should not reference a missing bundled formatted reference doc');
  });
});

// ── EXP-04: export pdf (D-01) ─────────────────────────────────────

describe('EXP-04: export pdf (D-01)', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains pdf section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /pdf/i, 'should contain pdf section');
  });

  it('uses --pdf-engine=typst', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /--pdf-engine=typst/, 'should use --pdf-engine=typst');
  });
});

// ── EXP-05: export pdf --print-ready ──────────────────────────────

describe('EXP-05: export pdf --print-ready', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains print-ready section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /print-ready/i, 'should contain print-ready section');
  });

  it('references scriveno-book.typst template', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /scriveno-book\.typst/, 'should reference scriveno-book.typst template');
  });

  it('specifies paper dimensions', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /paperwidth|paperheight/, 'should specify paper dimensions');
  });
});

// ── EXP-06: export epub ───────────────────────────────────────────

describe('EXP-06: export epub', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains epub section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /epub/i, 'should contain epub section');
  });

  it('references --epub-cover-image', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /--epub-cover-image/, 'should reference --epub-cover-image');
  });

  it('references scriveno-epub.css', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /scriveno-epub\.css/, 'should reference scriveno-epub.css');
  });
});

// ── EXP-07: export fountain ──────────────────────────────────────

describe('EXP-07: export fountain', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains fountain section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /fountain/i, 'should contain fountain section');
  });

  it('references Fountain format markers (INT./EXT.)', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(
      content.includes('INT.') || content.includes('EXT.'),
      'should reference Fountain format markers (INT./EXT.)'
    );
  });
});

// ── EXP-08: export fdx ───────────────────────────────────────────

describe('EXP-08: export fdx', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains fdx section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /fdx/i, 'should contain fdx section');
  });

  it('references screenplain', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /screenplain/i, 'should reference screenplain');
  });
});

// ── EXP-09: export latex ─────────────────────────────────────────

describe('EXP-09: export latex', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains latex section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /latex/i, 'should contain latex section');
  });

  it('references scriveno-academic.latex template', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /scriveno-academic\.latex/, 'should reference scriveno-academic.latex template');
  });

  it('references --citeproc for bibliography', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /--citeproc/, 'should reference --citeproc');
  });
});

// ── EXP-10: export kdp-package (D-05) ────────────────────────────

describe('EXP-10: export kdp-package (D-05)', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains kdp-package section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /kdp-package/i, 'should contain kdp-package section');
  });

  it('points KDP cover handoff at the canonical paperback build asset', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /\.manuscript\/build\/paperback-cover\.pdf/);
    assert.match(content, /template generator/i);
    assert.doesNotMatch(content, /0\.002252/);
  });
});

// ── EXP-11: export ingram-package ────────────────────────────────

describe('EXP-11: export ingram-package', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains ingram-package section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /ingram-package/i, 'should contain ingram-package section');
  });

  it('references gs -dPDFX for PDF/X-1a conversion', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /gs -dPDFX/, 'should reference gs -dPDFX');
  });

  it('references CMYK color conversion', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /CMYK/, 'should reference CMYK color conversion');
  });
});

// ── EXP-12: export query-package ─────────────────────────────────

describe('EXP-12: export query-package', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains query-package section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /query-package/i, 'should contain query-package section');
  });

  it('uses marketing outputs for synopsis and query letter prerequisites', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /\.manuscript\/marketing\/QUERY-LETTER\.md/, 'should use QUERY-LETTER.md from marketing/');
    assert.match(content, /\.manuscript\/marketing\/SYNOPSIS-\*\.md/, 'should use SYNOPSIS-*.md from marketing/');
  });
});

// ── EXP-13: export submission-package ────────────────────────────

describe('EXP-13: export submission-package', () => {
  const filePath = path.join(commandsDir, 'export.md');

  it('contains submission-package section', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /submission-package/i, 'should contain submission-package section');
  });
});

// ── EXP-14: publish wizard (D-07) ────────────────────────────────

describe('EXP-14: publish wizard (D-07)', () => {
  const filePath = path.join(commandsDir, 'publish.md');

  it('publish.md exists', () => {
    assert.ok(fs.existsSync(filePath), 'publish.md should exist');
  });

  it('has YAML frontmatter with description', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'missing YAML frontmatter');
    assert.ok(fm[1].includes('description:'), 'missing description field');
  });

  it('contains prerequisite checking', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /prerequisite/i, 'should contain prerequisite checking');
  });

  it('shows a readiness checklist', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /checklist/i, 'should show a readiness checklist');
  });

  it('checks marketing outputs for synopsis and query-letter prerequisites', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /\.manuscript\/marketing\/SYNOPSIS-\*\.md/, 'publish.md should check marketing synopsis outputs');
    assert.match(content, /\.manuscript\/marketing\/QUERY-LETTER\.md/, 'publish.md should check marketing query letter output');
  });
});

// ── EXP-15: publish presets (D-08) ───────────────────────────────

describe('EXP-15: publish presets (D-08)', () => {
  const filePath = path.join(commandsDir, 'publish.md');

  it('contains kdp-paperback preset', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /kdp-paperback/, 'should contain kdp-paperback preset');
  });

  it('contains kdp-ebook preset', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /kdp-ebook/, 'should contain kdp-ebook preset');
  });

  it('contains query-submission preset', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /query-submission/, 'should contain query-submission preset');
  });

  it('contains ebook-wide preset', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /ebook-wide/, 'should contain ebook-wide preset');
  });
});

// ── EXP-16: autopilot-publish (D-09) ────────────────────────────

describe('EXP-16: autopilot-publish (D-09)', () => {
  const filePath = path.join(commandsDir, 'autopilot-publish.md');

  it('autopilot-publish.md exists', () => {
    assert.ok(fs.existsSync(filePath), 'autopilot-publish.md should exist');
  });

  it('has YAML frontmatter with description', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'missing YAML frontmatter');
    assert.ok(fm[1].includes('description:'), 'missing description field');
  });

  it('contains voice-check in quality gate', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /voice-check/i, 'should contain voice-check in quality gate');
  });

  it('contains continuity-check in quality gate', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /continuity-check/i, 'should contain continuity-check in quality gate');
  });

  it('warns but does not block on quality gate (D-09)', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /warn/i, 'should warn on quality gate issues');
  });

  it('references --preset flag', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /--preset/, 'should reference --preset flag');
  });

  it('checks marketing outputs for synopsis and query-letter prerequisites', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /\.manuscript\/marketing\/SYNOPSIS-\*\.md/, 'autopilot-publish should check marketing synopsis outputs');
    assert.match(content, /\.manuscript\/marketing\/QUERY-LETTER\.md/, 'autopilot-publish should check marketing query letter output');
  });
});

// ── EXP-17: manuscript-stats ─────────────────────────────────────

describe('EXP-17: manuscript-stats', () => {
  const filePath = path.join(commandsDir, 'manuscript-stats.md');

  it('manuscript-stats.md exists', () => {
    assert.ok(fs.existsSync(filePath), 'manuscript-stats.md should exist');
  });

  it('has YAML frontmatter with description', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'missing YAML frontmatter');
    assert.ok(fm[1].includes('description:'), 'missing description field');
  });

  it('contains word count metric', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /word.count|word_count/i, 'should contain word count metric');
  });

  it('contains page count metric', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /page.count|page_count|page estimate/i, 'should contain page count metric');
  });

  it('contains reading time metric', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /reading.time|reading_time/i, 'should contain reading time metric');
  });
});

// ── CONSTRAINTS.json export entries ──────────────────────────────

describe('CONSTRAINTS.json export entries', () => {
  let constraints;

  it('CONSTRAINTS.json is valid JSON', () => {
    const raw = fs.readFileSync(constraintsPath, 'utf8');
    constraints = JSON.parse(raw);
    assert.equal(typeof constraints, 'object');
  });

  it('export command entry exists with category publishing', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    assert.ok(constraints.commands['export'], 'export should exist in CONSTRAINTS.json commands');
    assert.equal(constraints.commands['export'].category, 'publishing',
      'export category should be publishing');
  });

  it('autopilot-publish command entry exists with category publishing', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    assert.ok(constraints.commands['autopilot-publish'],
      'autopilot-publish should exist in CONSTRAINTS.json commands');
    assert.equal(constraints.commands['autopilot-publish'].category, 'publishing',
      'autopilot-publish category should be publishing');
  });
});
