const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SACRED_DIR = path.join(ROOT, 'templates', 'sacred');
const PLATFORMS_DIR = path.join(ROOT, 'templates', 'platforms');
const CONSTRAINTS_PATH = path.join(ROOT, 'data', 'CONSTRAINTS.json');

const profiles = require('../lib/architectural-profiles.js');
const install = require('../bin/install.js');

// Helper: make a temp profile directory and register cleanup.
function scaffoldTempProfile(dir, slug) {
  const tmpDir = path.join(dir, slug);
  const manifest = path.join(tmpDir, 'manifest.yaml');
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(
    manifest,
    `# ephemeral test manifest\nstatus: placeholder\n`,
    'utf8'
  );
  return () => {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  };
}

describe('Phase 29: ARCH-01 drop-in tradition', () => {
  it('a contributor-dropped templates/sacred/<new>/manifest.yaml is recognized by listTraditions() without code edits', () => {
    // Slug must match SLUG_PATTERN (^[a-z][a-z0-9-]*$) -- see lib/architectural-profiles.js.
    // Prefix `zzz-test-` keeps it sorted last for easy visual spotting if cleanup ever leaks,
    // and avoids collision with any plausible real tradition slug.
    const slug = 'zzz-test-zoroastrian';
    const cleanup = scaffoldTempProfile(SACRED_DIR, slug);
    try {
      const traditions = profiles.listTraditions();
      assert.ok(
        traditions.includes(slug),
        `expected listTraditions() to include contributor-dropped '${slug}'. Got: ${traditions.join(', ')}`
      );
      // And the validator accepts it immediately
      const v = profiles.validateTradition(slug);
      assert.equal(v.valid, true, `validateTradition('${slug}') should accept after drop-in. Got: ${JSON.stringify(v)}`);
    } finally {
      cleanup();
    }
    // After cleanup, the slug is gone again
    assert.ok(!profiles.listTraditions().includes(slug), 'cleanup should remove the temp slug from the listing');
  });
});

describe('Phase 29: ARCH-02 drop-in platform', () => {
  it('a contributor-dropped templates/platforms/<new>/manifest.yaml is recognized by listPlatforms() without code edits', () => {
    // Slug must match SLUG_PATTERN (^[a-z][a-z0-9-]*$) -- see lib/architectural-profiles.js.
    // Prefix `zzz-test-` keeps it sorted last for easy visual spotting if cleanup ever leaks,
    // and avoids collision with any plausible real platform slug.
    const slug = 'zzz-test-lulu';
    const cleanup = scaffoldTempProfile(PLATFORMS_DIR, slug);
    try {
      const platforms = profiles.listPlatforms();
      assert.ok(
        platforms.includes(slug),
        `expected listPlatforms() to include contributor-dropped '${slug}'. Got: ${platforms.join(', ')}`
      );
      const v = profiles.validatePlatform(slug);
      assert.equal(v.valid, true, `validatePlatform('${slug}') should accept after drop-in`);
    } finally {
      cleanup();
    }
    assert.ok(!profiles.listPlatforms().includes(slug), 'cleanup should remove the temp slug from the listing');
  });
});

describe('Phase 29: ARCH-03 CONSTRAINTS.json declares architectural_profiles', () => {
  const constraints = JSON.parse(fs.readFileSync(CONSTRAINTS_PATH, 'utf8'));

  it('architectural_profiles top-level key exists', () => {
    assert.ok(constraints.architectural_profiles, 'missing architectural_profiles');
  });

  it('traditions._seeded has exactly 10 entries matching shipped directories', () => {
    const seeded = constraints.architectural_profiles.traditions._seeded;
    assert.equal(seeded.length, 10, `expected 10 seeded traditions, got ${seeded.length}`);
    for (const slug of seeded) {
      const manifest = path.join(SACRED_DIR, slug, 'manifest.yaml');
      assert.ok(fs.existsSync(manifest), `seeded tradition '${slug}' missing manifest at ${manifest}`);
    }
  });

  it('platforms._seeded has exactly 8 entries matching shipped directories', () => {
    const seeded = constraints.architectural_profiles.platforms._seeded;
    assert.equal(seeded.length, 8, `expected 8 seeded platforms, got ${seeded.length}`);
    for (const slug of seeded) {
      const manifest = path.join(PLATFORMS_DIR, slug, 'manifest.yaml');
      assert.ok(fs.existsSync(manifest), `seeded platform '${slug}' missing manifest at ${manifest}`);
    }
  });

  it('applies_to_groups is shaped correctly', () => {
    const ag = constraints.architectural_profiles.applies_to_groups;
    assert.deepEqual(ag.tradition, ['sacred']);
    assert.ok(ag.platform.includes('prose'));
    assert.ok(ag.platform.includes('sacred'));
    assert.ok(!ag.platform.includes('script'), 'script group should not have platform');
    assert.ok(!ag.platform.includes('technical'), 'technical group should not have platform');
  });

  it('validateTradition rejects unknown values with a helpful error listing valid options', () => {
    const result = profiles.validateTradition('definitely-not-a-tradition');
    assert.equal(result.valid, false);
    assert.match(result.error, /catholic/, 'error should name valid options including catholic');
    assert.match(result.error, /islamic-hafs/, 'error should name valid options including islamic-hafs');
  });

  it('validatePlatform rejects unknown values with a helpful error listing valid options', () => {
    const result = profiles.validatePlatform('definitely-not-a-platform');
    assert.equal(result.valid, false);
    assert.match(result.error, /kdp/, 'error should name valid options including kdp');
    assert.match(result.error, /ingram/, 'error should name valid options including ingram');
  });

  it('templates/WORK.md declares {{PROFILE_BLOCK}} placeholder', () => {
    const work = fs.readFileSync(path.join(ROOT, 'templates', 'WORK.md'), 'utf8');
    assert.match(work, /\{\{PROFILE_BLOCK\}\}/, 'templates/WORK.md should contain {{PROFILE_BLOCK}} placeholder');
    assert.match(work, /## Profile/, 'templates/WORK.md should contain ## Profile section');
  });
});

describe('Phase 29: ARCH-04 sacred work types infer correct tradition default', () => {
  const cases = [
    ['scripture_biblical', 'catholic'],
    ['scripture_quranic', 'islamic-hafs'],
    ['scripture_torah', 'jewish'],
    ['scripture_buddhist', 'pali'],
    ['scripture_vedic', 'sanskrit']
  ];
  for (const [workType, expected] of cases) {
    it(`inferTradition('${workType}') === '${expected}'`, () => {
      assert.equal(profiles.inferTradition(workType), expected);
    });
  }
  it('inferTradition(nonSacredWorkType) returns null', () => {
    assert.equal(profiles.inferTradition('novel'), null);
    assert.equal(profiles.inferTradition('screenplay'), null);
    assert.equal(profiles.inferTradition('research_paper'), null);
  });
});

describe('Phase 29: ARCH-05 book work types infer kdp platform default', () => {
  const constraints = JSON.parse(fs.readFileSync(CONSTRAINTS_PATH, 'utf8'));
  const bookGroups = ['prose', 'visual', 'poetry', 'sacred'];
  for (const group of bookGroups) {
    const members = constraints.work_type_groups[group].members;
    for (const workType of members) {
      it(`inferPlatform('${workType}') === 'kdp'  (group ${group})`, () => {
        assert.equal(
          profiles.inferPlatform(workType),
          'kdp',
          `${workType} should default to kdp`
        );
      });
    }
  }
  it('non-book work types get no platform default', () => {
    assert.equal(profiles.inferPlatform('screenplay'), null, 'screenplay is script group -- no platform');
    assert.equal(profiles.inferPlatform('research_paper'), null, 'research_paper is academic -- no platform');
    assert.equal(profiles.inferPlatform('technical_guide'), null, 'technical_guide is technical -- no platform');
  });
});

describe('Phase 29: bin/install.js re-exports architectural-profiles', () => {
  for (const fn of ['listTraditions', 'listPlatforms', 'validateTradition', 'validatePlatform', 'inferTradition', 'inferPlatform']) {
    it(`bin/install.js exports ${fn}`, () => {
      assert.equal(typeof install[fn], 'function', `install.${fn} should be a function`);
    });
  }
  it('bin/install.js preserves pre-existing exports', () => {
    assert.equal(typeof install.validateSettings, 'function', 'validateSettings regression -- re-export clobbered it');
    assert.equal(typeof install.readSettings, 'function', 'readSettings regression -- re-export clobbered it');
  });
});
