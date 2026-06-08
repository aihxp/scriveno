const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const commandsDir = path.join(ROOT, 'commands', 'scr');
const sacredDir = path.join(commandsDir, 'sacred');
const agentsDir = path.join(ROOT, 'agents');
const constraintsPath = path.join(ROOT, 'data', 'CONSTRAINTS.json');
const templatesDir = path.join(ROOT, 'templates', 'sacred');

// ═══════════════════════════════════════════════════════════════
// COLLABORATION (D-01, D-02)
// ═══════════════════════════════════════════════════════════════

// ── COLLAB-01..06: Revision Tracks ───────────────────────────

describe('D-01: Writer-friendly revision tracks (COLLAB-01..06)', () => {
  const trackPath = path.join(commandsDir, 'track.md');

  it('track.md exists', () => {
    assert.ok(fs.existsSync(trackPath), 'track.md should exist');
  });

  it('track.md has all 6 subcommands', () => {
    const content = fs.readFileSync(trackPath, 'utf8');
    assert.match(content, /track create/i, 'should have create subcommand');
    assert.match(content, /track list/i, 'should have list subcommand');
    assert.match(content, /track switch/i, 'should have switch subcommand');
    assert.match(content, /track compare/i, 'should have compare subcommand');
    assert.match(content, /track merge/i, 'should have merge subcommand');
    assert.match(content, /track propose/i, 'should have propose subcommand');
  });

  it('track.md uses writer-friendly language (D-01)', () => {
    const content = fs.readFileSync(trackPath, 'utf8');
    assert.ok(
      /revision track/i.test(content),
      'should use "revision track" terminology'
    );
    assert.match(content, /tracks\.json/, 'should reference tracks.json');
    assert.ok(
      /canon/i.test(content),
      'should reference canon concept'
    );
  });

  it('track merge uses keep mine/theirs/both (D-02)', () => {
    const content = fs.readFileSync(trackPath, 'utf8');
    assert.ok(
      /keep mine/i.test(content),
      'should have "Keep mine" option'
    );
    assert.ok(
      /keep theirs/i.test(content),
      'should have "Keep theirs" option'
    );
    assert.ok(
      /keep both/i.test(content),
      'should have "Keep both" option'
    );
  });

  it('CONSTRAINTS.json has track command with collaboration category', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    assert.ok(constraints.commands.track, 'track command should be defined');
    assert.strictEqual(constraints.commands.track.category, 'collaboration');
    assert.strictEqual(constraints.commands.track.subcommands.length, 6, 'should have 6 subcommands');
  });
});

// ── COLLAB-07: Editor-Writer Workflow ────────────────────────

describe('COLLAB-07: Editor-Writer Workflow', () => {
  const editorPath = path.join(commandsDir, 'editor-review.md');

  it('editor-review.md exists', () => {
    assert.ok(fs.existsSync(editorPath), 'editor-review.md should exist');
  });

  it('editor-review.md has collaboration flags', () => {
    const content = fs.readFileSync(editorPath, 'utf8');
    assert.match(content, /--proposal/, 'should have --proposal flag');
    assert.match(content, /--notes/, 'should have --notes flag');
    assert.match(content, /--respond/, 'should have --respond flag');
    assert.ok(
      /decisions\.json/i.test(content),
      'should reference decisions.json'
    );
  });
});

// ── COLLAB-08: Co-Writing Parallel Tracks ────────────────────

describe('COLLAB-08: Co-Writing Parallel Tracks', () => {
  it('track.md supports co-writing', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'track.md'), 'utf8');
    assert.ok(
      /co-writing|co.writing/i.test(content),
      'should mention co-writing'
    );
    assert.ok(
      /continuity/i.test(content),
      'should mention continuity'
    );
  });
});

// ═══════════════════════════════════════════════════════════════
// MULTI-RUNTIME & POLISH (D-03, D-04)
// ═══════════════════════════════════════════════════════════════

// ── RUNTIME-01: Multi-Runtime Installer (D-03) ──────────────

describe('D-03: Multi-Runtime Installer (RUNTIME-01)', () => {
  const installPath = path.join(ROOT, 'bin', 'install.js');

  it('install.js exists', () => {
    assert.ok(fs.existsSync(installPath), 'install.js should exist');
  });

  it('install.js has all 8 runtimes', () => {
    const { RUNTIMES } = require('../bin/install.js');
    assert.ok(RUNTIMES['claude-code'], 'should support Claude Code');
    assert.ok(RUNTIMES.cursor, 'should support Cursor');
    assert.ok(RUNTIMES['gemini-cli'], 'should support Gemini');
    assert.ok(RUNTIMES.codex, 'should support Codex');
    assert.ok(RUNTIMES.opencode, 'should support OpenCode');
    assert.ok(RUNTIMES.copilot, 'should support Copilot');
    assert.ok(RUNTIMES.windsurf, 'should support Windsurf');
    assert.ok(RUNTIMES.antigravity, 'should support Antigravity');
  });

  it('commands avoid repo-local CONSTRAINTS.json and Claude-only agent paths', () => {
    const commandFiles = fs.readdirSync(commandsDir).filter((file) => file.endsWith('.md'));

    for (const file of commandFiles) {
      const content = fs.readFileSync(path.join(commandsDir, file), 'utf8');
      assert.doesNotMatch(
        content,
        /`data\/CONSTRAINTS\.json`/,
        `${file} should not require the repo-local data/CONSTRAINTS.json path`
      );
    }

    const draftContent = fs.readFileSync(path.join(commandsDir, 'draft.md'), 'utf8');
    assert.doesNotMatch(
      draftContent,
      /~\/\.claude\/agents\/drafter\.md/,
      'draft.md should not hardcode the Claude-specific drafter path'
    );
  });
});

// ── RUNTIME-02: Writer Profile Persistence ──────────────────

describe('RUNTIME-02: Writer Profile Persistence', () => {
  it('profile-writer.md references persistent profile', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'profile-writer.md'), 'utf8');
    assert.ok(
      /profile\.json|\.scriveno/i.test(content),
      'should reference profile.json or .scriveno'
    );
  });
});

// ── RUNTIME-03: Manager Command (D-04) ──────────────────────

describe('D-04: Manager Command (RUNTIME-03)', () => {
  const managerPath = path.join(commandsDir, 'manager.md');

  it('manager.md exists', () => {
    assert.ok(fs.existsSync(managerPath), 'manager.md should exist');
  });

  it('manager.md references .manuscript and project listing', () => {
    const content = fs.readFileSync(managerPath, 'utf8');
    assert.match(content, /\.manuscript/, 'should reference .manuscript');
    assert.ok(
      /project|work/i.test(content),
      'should reference project or work listing'
    );
  });
});

// ── RUNTIME-04: Academic Features ───────────────────────────

describe('RUNTIME-04: Academic Features', () => {
  it('CONSTRAINTS.json has academic command adaptations', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    assert.ok(constraints.command_adaptations, 'command_adaptations should exist');
    assert.ok(constraints.command_adaptations.academic, 'academic adaptations should exist');
  });
});

// ── RUNTIME-05: Health Command ──────────────────────────────

describe('RUNTIME-05: Health Command', () => {
  const healthPath = path.join(commandsDir, 'health.md');

  it('health.md exists', () => {
    assert.ok(fs.existsSync(healthPath), 'health.md should exist');
  });

  it('health.md has diagnose and repair', () => {
    const content = fs.readFileSync(healthPath, 'utf8');
    assert.ok(
      /diagnose|diagnostic/i.test(content),
      'should mention diagnose/diagnostic'
    );
    assert.ok(
      /repair/i.test(content),
      'should mention repair'
    );
  });

  it('health.md keeps detached-head guidance branch-agnostic', () => {
    const content = fs.readFileSync(healthPath, 'utf8');
    assert.match(
      content,
      /git switch <canon branch>/i,
      'health.md should suggest switching to the resolved canon branch instead of assuming main'
    );
    assert.match(
      content,
      /canon_branch|main`, `master`, `trunk`/i,
      'health.md should explain that detached-head recovery depends on the project canonical branch'
    );
    assert.doesNotMatch(
      content,
      /git checkout main/,
      'health.md should not hard-code main for detached-head recovery'
    );
  });
});

// ── RUNTIME-06: Utility Commands ────────────────────────────

describe('RUNTIME-06: Utility Commands', () => {
  const utilityCommands = ['add-note', 'check-notes', 'plant-seed', 'troubleshoot', 'thread'];

  for (const cmd of utilityCommands) {
    it(`${cmd}.md exists`, () => {
      assert.ok(fs.existsSync(path.join(commandsDir, `${cmd}.md`)), `${cmd}.md should exist`);
    });
  }

  it('CONSTRAINTS.json has utility command entries', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    for (const cmd of utilityCommands) {
      assert.ok(constraints.commands[cmd], `${cmd} should be defined in commands`);
    }
  });
});

// ── RUNTIME-07: Fast Command ────────────────────────────────

describe('RUNTIME-07: Fast Command', () => {
  const fastPath = path.join(commandsDir, 'fast.md');

  it('fast.md exists', () => {
    assert.ok(fs.existsSync(fastPath), 'fast.md should exist');
  });

  it('fast.md has inline edit behavior', () => {
    const content = fs.readFileSync(fastPath, 'utf8');
    assert.ok(
      /inline|quick|fast/i.test(content),
      'should mention inline, quick, or fast editing'
    );
  });
});

// ═══════════════════════════════════════════════════════════════
// SACRED & HISTORICAL (D-05, D-06)
// ═══════════════════════════════════════════════════════════════

// ── SACRED-01: Sacred Work Types ────────────────────────────

describe('SACRED-01: Sacred Work Types', () => {
  it('CONSTRAINTS.json has 13+ sacred work types', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const sacredTypes = Object.entries(constraints.work_types)
      .filter(([, v]) => v.group === 'sacred');
    assert.ok(
      sacredTypes.length >= 13,
      `Expected >= 13 sacred work types, got ${sacredTypes.length}`
    );
  });
});

// ── SACRED-02: Voice Registers (D-05) ───────────────────────

describe('D-05: Voice Registers (SACRED-02)', () => {
  it('drafter.md has all 10 voice registers', () => {
    const content = fs.readFileSync(path.join(agentsDir, 'drafter.md'), 'utf8');
    const registers = [
      'Prophetic', 'Wisdom', 'Legal', 'Liturgical', 'Narrative-historical',
      'Apocalyptic', 'Epistolary', 'Psalmic', 'Parabolic', 'Didactic'
    ];
    for (const reg of registers) {
      assert.ok(
        new RegExp(reg, 'i').test(content),
        `drafter.md should contain register: ${reg}`
      );
    }
  });
});

// ── SACRED-03: Adapted Context Files ────────────────────────

describe('SACRED-03: Adapted Context Files', () => {
  it('CONSTRAINTS.json has sacred file adaptations', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const sacredFiles = constraints.file_adaptations.sacred;
    assert.strictEqual(sacredFiles['CHARACTERS.md'], 'FIGURES.md');
    assert.strictEqual(sacredFiles['RELATIONSHIPS.md'], 'LINEAGES.md');
    assert.strictEqual(sacredFiles['WORLD.md'], 'COSMOLOGY.md');
    assert.strictEqual(sacredFiles['PLOT-GRAPH.md'], 'THEOLOGICAL-ARC.md');
    assert.strictEqual(sacredFiles['THEMES.md'], 'DOCTRINES.md');
    assert.strictEqual(sacredFiles['BRIEF.md'], 'FRAMEWORK.md');
  });

  it('sacred template files exist', () => {
    const templates = ['FIGURES', 'LINEAGES', 'COSMOLOGY', 'THEOLOGICAL-ARC', 'DOCTRINES', 'FRAMEWORK'];
    for (const t of templates) {
      assert.ok(
        fs.existsSync(path.join(templatesDir, `${t}.md`)),
        `${t}.md should exist in templates/sacred/`
      );
    }
  });
});

// ── SACRED-04: Sacred-Exclusive Commands ────────────────────

describe('SACRED-04: Sacred-Exclusive Commands', () => {
  const sacredCommands = [
    'concordance', 'cross-reference', 'genealogy', 'chronology',
    'annotation-layer', 'verse-numbering', 'source-tracking', 'doctrinal-check'
  ];

  for (const cmd of sacredCommands) {
    it(`${cmd}.md is fully implemented (not a shell)`, () => {
      const filePath = path.join(sacredDir, `${cmd}.md`);
      assert.ok(fs.existsSync(filePath), `${cmd}.md should exist in commands/scr/sacred/`);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').length;
      assert.ok(
        lines > 50,
        `${cmd}.md should have > 50 lines (got ${lines}), indicating full implementation`
      );
    });
  }
});

// ── SACRED-05: Command Adaptations ──────────────────────────

describe('SACRED-05: Command Adaptations', () => {
  it('CONSTRAINTS.json has sacred command adaptations', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const sacred = constraints.command_adaptations.sacred;
    assert.ok(sacred, 'sacred command adaptations should exist');
    assert.strictEqual(sacred['new-character'].adapted_name, 'new-figure');
    assert.strictEqual(sacred['build-world'].adapted_name, 'build-cosmology');
    assert.strictEqual(sacred['voice-check'].adapted_name, 'register-check');
    assert.ok(
      Object.keys(sacred).length >= 16,
      `Expected >= 16 sacred adaptations, got ${Object.keys(sacred).length}`
    );
  });
});

// ── SACRED-06: Sacred Discuss Categories ────────────────────

describe('SACRED-06: Sacred Discuss Categories', () => {
  it('discuss.md has sacred categories', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'discuss.md'), 'utf8');
    assert.ok(/doctrinal framing/i.test(content), 'should have Doctrinal framing');
    assert.ok(/voice register/i.test(content), 'should have Voice register');
    assert.ok(/intertextual density/i.test(content), 'should have Intertextual density');
    assert.ok(/liturgical rhythm/i.test(content), 'should have Liturgical rhythm');
    assert.ok(/pastoral sensitivity/i.test(content), 'should have Pastoral sensitivity');
  });
});

// ── SACRED-07: Sacred Translation Pipeline (D-06) ──────────

describe('D-06: Sacred Translation Pipeline (SACRED-07)', () => {
  it('translator.md has sacred_mode section', () => {
    const content = fs.readFileSync(path.join(agentsDir, 'translator.md'), 'utf8');
    assert.ok(
      /Sacred Translation/i.test(content),
      'translator.md should have Sacred Translation section'
    );
    assert.ok(
      /formal.equivalence/i.test(content),
      'should contain formal equivalence'
    );
    assert.ok(
      /dynamic.equivalence/i.test(content),
      'should contain dynamic equivalence'
    );
    assert.ok(
      /canonical.alignment/i.test(content),
      'should contain canonical alignment'
    );
    assert.ok(
      /liturgical/i.test(content),
      'should contain liturgical'
    );
  });

  it('translate.md passes sacred config to translator', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'translate.md'), 'utf8');
    assert.ok(
      /sacred_mode|sacred mode/i.test(content),
      'translate.md should reference sacred mode'
    );
  });
});

// ── SACRED-08: Tradition-Aware Front/Back Matter ────────────

describe('SACRED-08: Tradition-Aware Front/Back Matter', () => {
  it('front-matter.md has sacred elements', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'front-matter.md'), 'utf8');
    assert.ok(/imprimatur/i.test(content), 'should have imprimatur');
    assert.ok(/nihil.obstat/i.test(content), 'should have nihil obstat');
    assert.ok(/haskamah/i.test(content), 'should have haskamah');
    assert.ok(/bismillah/i.test(content), 'should have bismillah');
  });

  it('front-matter.md has ijazah and theological-preface', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'front-matter.md'), 'utf8');
    assert.ok(/ijazah/i.test(content), 'should have ijazah');
    assert.ok(/theological.preface/i.test(content), 'should have theological preface');
    assert.ok(/scriptural.dedication/i.test(content), 'should have scriptural dedication');
  });

  it('back-matter.md has sacred elements', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'back-matter.md'), 'utf8');
    assert.ok(/concordance/i.test(content), 'should have concordance');
    assert.ok(/scripture.index/i.test(content), 'should have scripture index');
    assert.ok(/theological.glossary/i.test(content), 'should have theological glossary');
  });

  it('back-matter.md has chronology and doctrinal index', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'back-matter.md'), 'utf8');
    assert.ok(/chronology.appendix/i.test(content), 'should have chronology appendix');
    assert.ok(/doctrinal.index/i.test(content), 'should have doctrinal index');
    assert.ok(/source.bibliography/i.test(content), 'should have source bibliography');
    assert.ok(/tradition.acknowledgments/i.test(content), 'should have tradition acknowledgments');
  });
});

// ── SACRED-09: Sacred Config Schema ─────────────────────────

describe('SACRED-09: Sacred Config Schema', () => {
  it('CONSTRAINTS.json has sacred_config_schema with all 9 fields', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const schema = constraints.sacred_config_schema;
    assert.ok(schema, 'sacred_config_schema should exist');
    assert.ok(schema.tradition, 'should have tradition field');
    assert.ok(schema.verse_numbering_system, 'should have verse_numbering_system field');
    assert.ok(schema.calendar_system, 'should have calendar_system field');
    assert.ok(schema.translation_philosophy, 'should have translation_philosophy field');
    assert.ok(schema.canonical_alignment, 'should have canonical_alignment field');
    assert.ok(schema.annotation_traditions, 'should have annotation_traditions field');
    assert.ok(schema.doctrinal_framework, 'should have doctrinal_framework field');
    assert.ok(schema.preserve_source_terms, 'should have preserve_source_terms field');
    assert.ok(schema.transliteration_style, 'should have transliteration_style field');
  });

  it('tradition field has required_when condition', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    assert.ok(
      constraints.sacred_config_schema.tradition.required_when,
      'tradition should have required_when'
    );
  });

  it('tradition field values match shipped tradition profile slugs', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    assert.deepEqual(
      constraints.sacred_config_schema.tradition.values,
      constraints.architectural_profiles.traditions._seeded,
      'tradition values should use concrete shipped tradition profile slugs'
    );
  });

  it('translation_philosophy field has valid values', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const values = constraints.sacred_config_schema.translation_philosophy.values;
    assert.ok(values.includes('formal_equivalence'), 'should include formal_equivalence');
    assert.ok(values.includes('dynamic_equivalence'), 'should include dynamic_equivalence');
    assert.ok(values.includes('paraphrase'), 'should include paraphrase');
    assert.ok(values.includes('interlinear'), 'should include interlinear');
  });
});
