const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const commandsDir = path.join(ROOT, 'commands', 'scr');
const agentsDir = path.join(ROOT, 'agents');
const constraintsPath = path.join(ROOT, 'data', 'CONSTRAINTS.json');
const templatesDir = path.join(ROOT, 'data', 'export-templates');

const TRANSLATION_COMMANDS = [
  'translate',
  'translation-glossary',
  'translation-memory',
  'cultural-adaptation',
  'back-translate',
  'multi-publish',
  'autopilot-translate',
];

// ── D-01: Fresh-context-per-unit translator agent (TRANS-01) ───

describe('D-01: Fresh-context-per-unit translator agent (TRANS-01)', () => {
  const agentPath = path.join(agentsDir, 'translator.md');
  const translatePath = path.join(commandsDir, 'translate.md');

  it('translator.md exists in agents/', () => {
    assert.ok(fs.existsSync(agentPath), 'translator.md should exist in agents/');
  });

  it('translator.md contains GLOSSARY (loads glossary per unit)', () => {
    const content = fs.readFileSync(agentPath, 'utf8');
    assert.match(content, /GLOSSARY/, 'translator.md should contain GLOSSARY');
  });

  it('translator.md contains fresh-context pattern', () => {
    const content = fs.readFileSync(agentPath, 'utf8');
    assert.ok(
      /fresh|per unit|per-unit/i.test(content),
      'translator.md should contain "fresh" or "per unit" pattern'
    );
  });

  it('translator.md contains STYLE-GUIDE (voice preservation)', () => {
    const content = fs.readFileSync(agentPath, 'utf8');
    assert.match(content, /STYLE-GUIDE/, 'translator.md should contain STYLE-GUIDE');
  });

  it('translator.md contains translation memory loading', () => {
    const content = fs.readFileSync(agentPath, 'utf8');
    assert.ok(
      /translation-memory|translation memory/i.test(content),
      'translator.md should contain translation memory reference'
    );
  });

  it('translate.md exists in commands/scr/', () => {
    assert.ok(fs.existsSync(translatePath), 'translate.md should exist in commands/scr/');
  });

  it('translate.md contains per-unit orchestration', () => {
    const content = fs.readFileSync(translatePath, 'utf8');
    assert.ok(
      /per unit|per-unit/i.test(content),
      'translate.md should contain "per unit" or "per-unit"'
    );
  });

  it('translate.md contains --languages and --add-language flags', () => {
    const content = fs.readFileSync(translatePath, 'utf8');
    assert.match(content, /--languages/, 'translate.md should contain --languages');
    assert.match(content, /--add-language/, 'translate.md should contain --add-language');
  });

  it('translate.md contains --all flag', () => {
    const content = fs.readFileSync(translatePath, 'utf8');
    assert.match(content, /--all/, 'translate.md should contain --all');
  });

  it('translate.md contains .manuscript/translation/ output directory', () => {
    const content = fs.readFileSync(translatePath, 'utf8');
    assert.match(content, /\.manuscript\/translation\//, 'translate.md should contain .manuscript/translation/ path');
  });
});

// ── D-02: Glossary as markdown table (TRANS-02) ────────────────

describe('D-02: Glossary as markdown table (TRANS-02)', () => {
  const filePath = path.join(commandsDir, 'translation-glossary.md');

  it('translation-glossary.md exists', () => {
    assert.ok(fs.existsSync(filePath), 'translation-glossary.md should exist');
  });

  it('translation-glossary.md contains GLOSSARY and markdown', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /GLOSSARY/, 'should contain GLOSSARY');
    assert.match(content, /markdown/i, 'should contain markdown');
  });

  it('translation-glossary.md contains character name category', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(
      /character_name|character name/i.test(content),
      'should contain character_name or character name category'
    );
  });

  it('translation-glossary.md contains place name category', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(
      /place_name|place name/i.test(content),
      'should contain place_name or place name category'
    );
  });

  it('translation-glossary.md contains --add and --review flags', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /--add/, 'should contain --add flag');
    assert.match(content, /--review/, 'should contain --review flag');
  });
});

// ── D-03: Back-translate side-by-side with drift annotations (TRANS-05) ──

describe('D-03: Back-translate side-by-side with drift annotations (TRANS-05)', () => {
  const filePath = path.join(commandsDir, 'back-translate.md');

  it('back-translate.md exists', () => {
    assert.ok(fs.existsSync(filePath), 'back-translate.md should exist');
  });

  it('back-translate.md contains side-by-side comparison', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /side-by-side/i, 'should contain side-by-side');
  });

  it('back-translate.md contains three column headers', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /Original/i, 'should contain Original column');
    assert.match(content, /Translation/i, 'should contain Translation column');
    assert.match(content, /Back-Translation|Back Translation/i, 'should contain Back-Translation column');
  });

  it('back-translate.md contains DRIFT annotations', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /DRIFT/, 'should contain DRIFT annotation markers');
  });

  it('back-translate.md contains meaning and tone drift types', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /meaning/i, 'should contain meaning drift type');
    assert.match(content, /tone/i, 'should contain tone drift type');
  });
});

// ── D-04: RTL detection automatic by language (TRANS-07) ───────

describe('D-04: RTL detection automatic by language (TRANS-07)', () => {
  const typstPath = path.join(templatesDir, 'scriveno-book.typst');
  const cssPath = path.join(templatesDir, 'scriveno-epub.css');
  const autopilotPath = path.join(commandsDir, 'autopilot-translate.md');

  it('scriveno-book.typst contains text-dir parameter', () => {
    const content = fs.readFileSync(typstPath, 'utf8');
    assert.match(content, /text-dir/, 'scriveno-book.typst should contain text-dir');
  });

  it('scriveno-epub.css contains RTL rules', () => {
    const content = fs.readFileSync(cssPath, 'utf8');
    assert.match(content, /rtl/, 'scriveno-epub.css should contain rtl');
  });

  it('scriveno-epub.css contains bidi support', () => {
    const content = fs.readFileSync(cssPath, 'utf8');
    assert.ok(
      /unicode-bidi|direction/.test(content),
      'scriveno-epub.css should contain unicode-bidi or direction'
    );
  });

  it('scriveno-epub.css contains CJK support', () => {
    const content = fs.readFileSync(cssPath, 'utf8');
    assert.ok(
      /CJK|cjk|writing-mode|break-all/i.test(content),
      'scriveno-epub.css should contain CJK, writing-mode, or break-all'
    );
  });

  it('autopilot-translate.md contains RTL detection', () => {
    const content = fs.readFileSync(autopilotPath, 'utf8');
    assert.ok(
      /RTL|rtl/.test(content),
      'autopilot-translate.md should contain RTL reference'
    );
  });
});

// ── D-05: Autopilot-translate parallel agents per language (TRANS-08) ──

describe('D-05: Autopilot-translate parallel agents per language (TRANS-08)', () => {
  const filePath = path.join(commandsDir, 'autopilot-translate.md');

  it('autopilot-translate.md exists', () => {
    assert.ok(fs.existsSync(filePath), 'autopilot-translate.md should exist');
  });

  it('autopilot-translate.md contains parallel per-language agents', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(
      /parallel|per language|per-language/i.test(content),
      'should contain parallel or per language'
    );
  });

  it('autopilot-translate.md contains glossary phase', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /glossary/i, 'should contain glossary phase');
  });

  it('autopilot-translate.md contains multi-publish phase', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /multi-publish/, 'should contain multi-publish phase');
  });

  it('autopilot-translate.md contains --resume support', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /--resume/, 'should contain --resume flag');
  });

  it('autopilot-translate.md contains --all-languages flag', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /--all-languages/, 'should contain --all-languages flag');
  });
});

// ── Translation quality commands (TRANS-04) ────────────────────

describe('Translation quality commands (TRANS-04)', () => {
  const filePath = path.join(commandsDir, 'cultural-adaptation.md');

  it('cultural-adaptation.md exists', () => {
    assert.ok(fs.existsSync(filePath), 'cultural-adaptation.md should exist');
  });

  it('cultural-adaptation.md contains idiom, humor, and custom categories', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /idiom/i, 'should contain idiom');
    assert.match(content, /humor/i, 'should contain humor');
    assert.match(content, /custom/i, 'should contain custom');
  });

  it('cultural-adaptation.md contains severity levels', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /severity/i, 'should contain severity');
  });

  it('cultural-adaptation.md contains measurement or currency adaptations', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(
      /measurement|currency/i.test(content),
      'should contain measurement or currency'
    );
  });
});

// ── Translation memory (TRANS-03) ──────────────────────────────

describe('Translation memory (TRANS-03)', () => {
  const filePath = path.join(commandsDir, 'translation-memory.md');

  it('translation-memory.md exists', () => {
    assert.ok(fs.existsSync(filePath), 'translation-memory.md should exist');
  });

  it('translation-memory.md contains TM store reference', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(
      /translation-memory\.json|translation-memory/i.test(content),
      'should contain translation-memory reference'
    );
  });

  it('translation-memory.md contains segment alignment', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /segment/i, 'should contain segment');
  });

  it('translation-memory.md contains --build and --stats flags', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /--build/, 'should contain --build flag');
    assert.match(content, /--stats/, 'should contain --stats flag');
  });
});

// ── Multi-publish (TRANS-06) ───────────────────────────────────

describe('Multi-publish (TRANS-06)', () => {
  const filePath = path.join(commandsDir, 'multi-publish.md');

  it('multi-publish.md exists', () => {
    assert.ok(fs.existsSync(filePath), 'multi-publish.md should exist');
  });

  it('multi-publish.md contains localized front matter', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(
      /front matter|front-matter/i.test(content),
      'should contain front matter or front-matter'
    );
  });

  it('multi-publish.md contains export chaining', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /export/i, 'should contain export reference');
  });

  it('multi-publish.md contains translations output path', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(
      /\.manuscript\/output\/translations\/|translations\//i.test(content),
      'should contain translations/ output path'
    );
  });

  it('uses the current about-author back-matter slug', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /\.manuscript\/back-matter\/about-author\.md/, 'should read about-author.md from back matter');
    assert.match(content, /\.manuscript\/translation\/\{lang\}\/back-matter\/about-author\.md/, 'should write about-author.md in translated back matter');
    assert.doesNotMatch(content, /about-the-author\.md/, 'should not reference the retired about-the-author slug');
  });
});

// ── CONSTRAINTS.json validation ────────────────────────────────

describe('CONSTRAINTS.json translation commands', () => {
  let constraints;

  it('CONSTRAINTS.json is valid JSON', () => {
    const raw = fs.readFileSync(constraintsPath, 'utf8');
    constraints = JSON.parse(raw);
    assert.equal(typeof constraints, 'object');
  });

  for (const cmd of TRANSLATION_COMMANDS) {
    it(`${cmd} exists in CONSTRAINTS.json commands`, () => {
      constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
      assert.ok(constraints.commands[cmd], `${cmd} should exist in CONSTRAINTS.json`);
    });

    it(`${cmd} has category "translation"`, () => {
      constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
      assert.equal(constraints.commands[cmd].category, 'translation',
        `${cmd} category should be translation`);
    });
  }

  it('translate requires complete-draft', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const requires = constraints.commands['translate'].requires;
    assert.ok(requires.includes('complete-draft'),
      'translate should require complete-draft');
  });

  it('cultural-adaptation requires translate', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const requires = constraints.commands['cultural-adaptation'].requires;
    assert.ok(requires.includes('translate'),
      'cultural-adaptation should require translate');
  });

  it('back-translate requires translate', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const requires = constraints.commands['back-translate'].requires;
    assert.ok(requires.includes('translate'),
      'back-translate should require translate');
  });
});
