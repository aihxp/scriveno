// drafter-quality-aware.test.js
// Tests for the draft-quality-aware drafter feature set:
//   - templates/WRITING-RULES.md (universal AI-tell rulebook)
//   - templates/pitfalls/<work_type>.md (per-work-type pitfall packs)
//   - lib/architectural-profiles.js: listPitfallPacks(), getPitfallPackPath()
//   - templates/config.json: draft block (rigor, context_profile, pitfalls_enabled)

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const profiles = require(path.join(ROOT, 'lib', 'architectural-profiles.js'));
const installerExports = require(path.join(ROOT, 'bin', 'install.js'));

const PITFALLS_DIR = path.join(ROOT, 'templates', 'pitfalls');
const WRITING_RULES_PATH = path.join(ROOT, 'templates', 'WRITING-RULES.md');
const CONFIG_TEMPLATE_PATH = path.join(ROOT, 'templates', 'config.json');

describe('WRITING-RULES.md ships in templates/', () => {
  it('exists and is non-empty', () => {
    const stat = fs.statSync(WRITING_RULES_PATH);
    assert.ok(stat.isFile(), 'WRITING-RULES.md should be a regular file');
    assert.ok(stat.size > 0, 'WRITING-RULES.md should not be empty');
  });

  it('declares itself as the universal AI-tell rulebook and signals override hierarchy', () => {
    const content = fs.readFileSync(WRITING_RULES_PATH, 'utf8');
    // Floor-not-ceiling framing keeps STYLE-GUIDE.md sovereign.
    assert.match(content, /STYLE-GUIDE\.md/);
    // Should cover the canonical universal don'ts.
    assert.match(content, /Hedging/i);
    assert.match(content, /Throat-clearing/i);
    assert.match(content, /Generic metaphors|Dead figures/i);
    assert.match(content, /Symmetrical rhythm|Symmetrical/i);
    assert.match(content, /Moralizing/i);
  });

  it('honors the no-em-dash project rule', () => {
    const content = fs.readFileSync(WRITING_RULES_PATH, 'utf8');
    assert.ok(!content.includes('—'), 'WRITING-RULES.md must not contain em dashes');
    assert.ok(!content.includes('–'), 'WRITING-RULES.md must not contain en dashes');
  });
});

describe('listPitfallPacks() registers shipped packs', () => {
  it('returns a sorted list of slugs', () => {
    const packs = profiles.listPitfallPacks();
    assert.ok(Array.isArray(packs));
    const sorted = [...packs].sort();
    assert.deepEqual(packs, sorted, 'listPitfallPacks() must return a sorted slug list');
  });

  it('includes the 8 shipped initial packs', () => {
    const packs = profiles.listPitfallPacks();
    const expected = [
      'comic',
      'commentary',
      'memoir',
      'novel',
      'poetry_collection',
      'research_paper',
      'runbook',
      'screenplay',
    ];
    for (const slug of expected) {
      assert.ok(
        packs.includes(slug),
        `listPitfallPacks() should include shipped pack '${slug}'. Got: ${packs.join(', ')}`
      );
    }
  });

  it('every shipped pack file is non-empty and references the override hierarchy', () => {
    const packs = profiles.listPitfallPacks();
    for (const slug of packs) {
      const file = path.join(PITFALLS_DIR, `${slug}.md`);
      const content = fs.readFileSync(file, 'utf8');
      assert.ok(content.length > 100, `pitfall pack ${slug} should be substantive`);
      assert.match(
        content,
        /WRITING-RULES\.md|STYLE-GUIDE\.md/,
        `pitfall pack ${slug} should reference WRITING-RULES.md or STYLE-GUIDE.md to make its place in the hierarchy explicit`
      );
    }
  });

  it('every shipped pack honors the no-em-dash project rule', () => {
    const packs = profiles.listPitfallPacks();
    for (const slug of packs) {
      const file = path.join(PITFALLS_DIR, `${slug}.md`);
      const content = fs.readFileSync(file, 'utf8');
      assert.ok(
        !content.includes('—'),
        `pitfall pack ${slug} must not contain em dashes`
      );
      assert.ok(
        !content.includes('–'),
        `pitfall pack ${slug} must not contain en dashes`
      );
    }
  });
});

describe('getPitfallPackPath() returns absolute paths or null', () => {
  it('returns the absolute path for a known work_type', () => {
    const p = profiles.getPitfallPackPath('novel');
    assert.ok(p, 'getPitfallPackPath("novel") should resolve');
    assert.ok(path.isAbsolute(p), 'returned path should be absolute');
    assert.ok(fs.existsSync(p), 'returned path should point to an existing file');
  });

  it('returns null for an unknown work_type with no pack', () => {
    // flash_fiction is a real work_type in CONSTRAINTS but has no pack shipped.
    assert.equal(profiles.getPitfallPackPath('flash_fiction'), null);
  });

  it('returns null for path-traversal attempts and invalid input', () => {
    assert.equal(profiles.getPitfallPackPath('../etc/passwd'), null);
    assert.equal(profiles.getPitfallPackPath('../../templates/WRITING-RULES'), null);
    assert.equal(profiles.getPitfallPackPath(''), null);
    assert.equal(profiles.getPitfallPackPath(null), null);
    assert.equal(profiles.getPitfallPackPath(undefined), null);
    assert.equal(profiles.getPitfallPackPath(42), null);
    assert.equal(profiles.getPitfallPackPath({}), null);
  });

  it('accepts work_type slugs that contain underscores (per CONSTRAINTS.json convention)', () => {
    // research_paper, poetry_collection use underscores
    assert.ok(profiles.getPitfallPackPath('research_paper'));
    assert.ok(profiles.getPitfallPackPath('poetry_collection'));
  });
});

describe('drop-in extensibility for pitfall packs', () => {
  it('a contributor-dropped templates/pitfalls/<new>.md is recognized by listPitfallPacks() with no code edits', () => {
    // zzz prefix sorts last so any cleanup leak is easy to spot.
    const slug = 'zzz_test_drop_in_pack';
    const file = path.join(PITFALLS_DIR, `${slug}.md`);
    fs.writeFileSync(file, '# ephemeral test pitfall pack\n');
    try {
      const packs = profiles.listPitfallPacks();
      assert.ok(
        packs.includes(slug),
        `listPitfallPacks() should include drop-in '${slug}'. Got: ${packs.join(', ')}`
      );
      assert.equal(profiles.getPitfallPackPath(slug), file);
    } finally {
      fs.unlinkSync(file);
    }
    assert.ok(
      !profiles.listPitfallPacks().includes(slug),
      'cleanup should remove the temp slug from the listing'
    );
  });
});

describe('bin/install.js re-exports pitfall pack helpers', () => {
  for (const fn of ['listPitfallPacks', 'getPitfallPackPath']) {
    it(`exports ${fn}`, () => {
      assert.equal(
        typeof installerExports[fn],
        'function',
        `bin/install.js should re-export ${fn} for callers that consume the installer module`
      );
    });
  }
});

describe('templates/config.json declares the draft block with documented defaults', () => {
  const config = JSON.parse(fs.readFileSync(CONFIG_TEMPLATE_PATH, 'utf8'));

  it('has a draft block', () => {
    assert.ok(
      config.draft && typeof config.draft === 'object',
      'templates/config.json should contain a draft object'
    );
  });

  it('default rigor is "standard" (preserves prior behavior for unmodified projects)', () => {
    assert.equal(config.draft.rigor, 'standard');
  });

  it('default context_profile is "standard" (preserves prior behavior for unmodified projects)', () => {
    assert.equal(config.draft.context_profile, 'standard');
  });

  it('pitfalls_enabled defaults to true so packs activate out of the box', () => {
    assert.equal(config.draft.pitfalls_enabled, true);
  });
});

describe('drafter agent contract honors the new feature set', () => {
  const drafterPath = path.join(ROOT, 'agents', 'drafter.md');
  const drafter = fs.readFileSync(drafterPath, 'utf8');

  it('declares STYLE-GUIDE.md as authoritative voice DNA', () => {
    assert.match(drafter, /STYLE-GUIDE\.md/);
  });

  it('loads WRITING-RULES.md as the universal rulebook', () => {
    assert.match(drafter, /WRITING-RULES\.md/);
  });

  it('describes the pitfall pack resolution order (project override then installed)', () => {
    assert.match(drafter, /pitfall pack/i);
    assert.match(drafter, /PITFALLS\.md/);
    assert.match(drafter, /templates\/pitfalls/);
  });

  it('reads draft.rigor, draft.context_profile, and draft.pitfalls_enabled from config', () => {
    assert.match(drafter, /draft\.rigor/);
    assert.match(drafter, /draft\.context_profile/);
    assert.match(drafter, /draft\.pitfalls_enabled/);
  });

  it('declares a top-down conflict resolution: STYLE-GUIDE.md > WRITING-RULES.md > pitfall pack', () => {
    assert.match(
      drafter,
      /STYLE-GUIDE\.md[^\n]{0,200}WRITING-RULES\.md[^\n]{0,200}pitfall/i,
      'drafter should explicitly state STYLE-GUIDE.md > WRITING-RULES.md > pitfall pack precedence'
    );
  });
});
