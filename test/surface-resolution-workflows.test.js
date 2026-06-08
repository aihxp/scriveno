const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { collectCommandEntries } = require('../bin/install.js');
const {
  buildNewWorkFixture,
  loadConstraints,
  resolveSurfaceSet,
} = require('./helpers/surface-resolution.js');

const WORKFLOW_CASES = [
  {
    workType: 'novel',
    group: 'prose',
    files: {
      brief: 'BRIEF.md',
      cast: 'CHARACTERS.md',
      relationship: 'RELATIONSHIPS.md',
      world: 'WORLD.md',
      plot: 'PLOT-GRAPH.md',
      themes: 'THEMES.md',
      peoples: 'PEOPLES.md',
    },
    creates: ['BRIEF.md', 'CHARACTERS.md', 'WORLD.md', 'PLOT-GRAPH.md', 'THEMES.md', 'PEOPLES.md'],
    skips: [],
    derived: ['RELATIONSHIPS.md', 'CONFLICTS.md', 'PEOPLE-DYNAMICS.md'],
    relationshipApplies: true,
    peoplesApplies: true,
  },
  {
    workType: 'commentary',
    group: 'sacred',
    files: {
      brief: 'FRAMEWORK.md',
      cast: 'FIGURES.md',
      relationship: 'LINEAGES.md',
      world: 'COSMOLOGY.md',
      plot: 'THEOLOGICAL-ARC.md',
      themes: 'DOCTRINES.md',
      peoples: 'PEOPLES.md',
    },
    creates: ['FRAMEWORK.md', 'FIGURES.md', 'COSMOLOGY.md', 'THEOLOGICAL-ARC.md', 'DOCTRINES.md', 'PEOPLES.md'],
    skips: [],
    derived: ['LINEAGES.md', 'CONFLICTS.md', 'PEOPLE-DYNAMICS.md'],
    relationshipApplies: true,
    peoplesApplies: true,
  },
  {
    workType: 'runbook',
    group: 'technical',
    files: {
      brief: 'DOC-BRIEF.md',
      cast: 'AUDIENCE.md',
      relationship: 'DEPENDENCIES.md',
      world: 'SYSTEM.md',
      plot: 'PROCEDURES.md',
      themes: 'REFERENCES.md',
      peoples: 'PEOPLES.md',
    },
    creates: ['DOC-BRIEF.md', 'AUDIENCE.md', 'SYSTEM.md', 'PROCEDURES.md', 'REFERENCES.md'],
    skips: ['PEOPLES.md'],
    derived: ['DEPENDENCIES.md', 'CONFLICTS.md'],
    relationshipApplies: true,
    peoplesApplies: false,
  },
  {
    workType: 'research_paper',
    group: 'academic',
    files: {
      brief: 'PROPOSAL.md',
      cast: 'CONCEPTS.md',
      relationship: 'RELATIONSHIPS.md',
      world: 'CONTEXT.md',
      plot: 'ARGUMENT-MAP.md',
      themes: 'QUESTIONS.md',
      peoples: 'PEOPLES.md',
    },
    creates: ['PROPOSAL.md', 'CONCEPTS.md', 'CONTEXT.md', 'ARGUMENT-MAP.md', 'QUESTIONS.md'],
    skips: ['RELATIONSHIPS.md', 'PEOPLES.md'],
    derived: ['CONFLICTS.md'],
    relationshipApplies: false,
    peoplesApplies: false,
  },
  {
    workType: 'single_poem',
    group: 'poetry',
    files: {
      brief: 'BRIEF.md',
      cast: 'CHARACTERS.md',
      relationship: 'RELATIONSHIPS.md',
      world: 'WORLD.md',
      plot: 'PLOT-GRAPH.md',
      themes: 'THEMES.md',
      peoples: 'PEOPLES.md',
    },
    creates: ['BRIEF.md', 'THEMES.md'],
    skips: ['CHARACTERS.md', 'RELATIONSHIPS.md', 'WORLD.md', 'PLOT-GRAPH.md', 'PEOPLES.md'],
    derived: [],
    relationshipApplies: false,
    peoplesApplies: false,
  },
  {
    workType: 'speech',
    group: 'speech_song',
    files: {
      brief: 'BRIEF.md',
      cast: 'CHARACTERS.md',
      relationship: 'RELATIONSHIPS.md',
      world: 'WORLD.md',
      plot: 'PLOT-GRAPH.md',
      themes: 'THEMES.md',
      peoples: 'PEOPLES.md',
    },
    creates: ['BRIEF.md', 'THEMES.md'],
    skips: ['CHARACTERS.md', 'RELATIONSHIPS.md', 'WORLD.md', 'PLOT-GRAPH.md', 'PEOPLES.md'],
    derived: [],
    relationshipApplies: false,
    peoplesApplies: false,
  },
];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function collectMarkdownFiles(dir, prefix = '') {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relPath = prefix ? path.join(prefix, entry.name) : entry.name;
    const absPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(absPath, relPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(relPath);
    }
  }
  return files.sort();
}

function escapedPattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('surface resolution workflow guardrails', () => {
  const constraints = loadConstraints(ROOT);

  it('ships a single surface-resolution protocol and high-risk commands reference it', () => {
    assert.match(read('docs/surface-resolution-protocol.md'), /surface_applicability/);
    assert.match(read('docs/surface-resolution-protocol.md'), /file_adaptations/);
    assert.match(read('docs/shipped-assets.md'), /docs\/surface-resolution-protocol\.md/);

    for (const file of [
      'commands/scr/new-work.md',
      'commands/scr/import.md',
      'commands/scr/save.md',
      'commands/scr/scan.md',
      'commands/scr/discuss.md',
      'commands/scr/plan.md',
      'commands/scr/draft.md',
      'commands/scr/new-character.md',
      'commands/scr/new-people.md',
      'commands/scr/character-touch.md',
      'commands/scr/relationship-map.md',
      'commands/scr/health.md',
      'commands/scr/cast-list.md',
      'commands/scr/character-sheet.md',
      'commands/scr/character-voice-sample.md',
      'commands/scr/character-arc.md',
      'commands/scr/character-ref.md',
      'commands/scr/build-world.md',
      'commands/scr/map-illustration.md',
      'commands/scr/subplot-map.md',
      'commands/scr/subject-touch.md',
      'commands/scr/front-matter.md',
      'commands/scr/back-matter.md',
      'commands/scr/art-direction.md',
      'commands/scr/cover-art.md',
      'commands/scr/illustrate-scene.md',
      'commands/scr/continuity-check.md',
      'commands/scr/theme-tracker.md',
      'commands/scr/translate.md',
      'commands/scr/translation-glossary.md',
    ]) {
      assert.match(read(file), /docs\/surface-resolution-protocol\.md/, `${file} should reference the surface protocol`);
    }
  });

  it('active workflow prompts do not hard-code adaptable .manuscript paths except as examples', () => {
    const activeFiles = [
      ...collectMarkdownFiles(path.join(ROOT, 'commands')).map((file) => path.join('commands', file)),
      ...collectMarkdownFiles(path.join(ROOT, 'agents')).map((file) => path.join('agents', file)),
    ];
    const adaptablePath = /\.manuscript\/(?:BRIEF|CHARACTERS|RELATIONSHIPS|WORLD|PLOT-GRAPH|THEMES)\.md/;
    const exampleOrAdaptedContext = /Default:|such as|for example|example|adapted|canonical|file_adaptations|surface-resolution-protocol/;

    for (const file of activeFiles) {
      const lines = read(file).split('\n');
      lines.forEach((line, index) => {
        if (!adaptablePath.test(line)) return;
        assert.match(
          line,
          exampleOrAdaptedContext,
          `${file}:${index + 1} hard-codes an adaptable .manuscript path without surface-resolution context`
        );
      });
    }
  });

  it('representative work types resolve create, skip, and derived-map expectations', () => {
    for (const fixture of WORKFLOW_CASES) {
      const resolved = resolveSurfaceSet(constraints, fixture.workType);

      assert.equal(resolved.group, fixture.group, `${fixture.workType} should use the expected group`);
      assert.equal(resolved.adapted['BRIEF.md'], fixture.files.brief);
      assert.equal(resolved.adapted['CHARACTERS.md'], fixture.files.cast);
      assert.equal(resolved.adapted['RELATIONSHIPS.md'], fixture.files.relationship);
      assert.equal(resolved.adapted['WORLD.md'], fixture.files.world);
      assert.equal(resolved.adapted['PLOT-GRAPH.md'], fixture.files.plot);
      assert.equal(resolved.adapted['THEMES.md'], fixture.files.themes);
      assert.equal(resolved.adapted['PEOPLES.md'], fixture.files.peoples);

      assert.deepEqual(resolved.creates, [...fixture.creates].sort(), `${fixture.workType} create set`);
      assert.deepEqual(resolved.skippedCanonical, [...fixture.skips].sort(), `${fixture.workType} skip set`);
      assert.equal(resolved.relationshipApplies, fixture.relationshipApplies);
      assert.equal(resolved.peoplesApplies, fixture.peoplesApplies);
    }
  });

  it('mini-project fixtures assert scaffolded, skipped, and derived surfaces by work type', () => {
    for (const fixture of WORKFLOW_CASES) {
      const project = buildNewWorkFixture(constraints, fixture.workType);

      for (const createdFile of fixture.creates) {
        assert.ok(
          project.manuscriptFiles.includes(createdFile),
          `${fixture.workType} should scaffold ${createdFile}`
        );
      }

      for (const skippedFile of fixture.skips) {
        assert.ok(
          !project.manuscriptFiles.includes(skippedFile),
          `${fixture.workType} should not scaffold skipped surface ${skippedFile}`
        );
      }

      for (const derivedFile of fixture.derived) {
        assert.ok(
          project.derivedCandidates.includes(derivedFile),
          `${fixture.workType} should track derived surface ${derivedFile}`
        );
        assert.ok(
          !project.manuscriptFiles.includes(derivedFile),
          `${fixture.workType} should not scaffold derived surface ${derivedFile} at new-work`
        );
      }

      if (project.worldApplies) {
        assert.ok(
          project.manuscriptFiles.includes('PLACES.md'),
          `${fixture.workType} should scaffold PLACES.md when WORLD applies`
        );
        assert.ok(
          !project.manuscriptFiles.includes('GEOGRAPHY.md'),
          `${fixture.workType} should not scaffold derived GEOGRAPHY.md at new-work`
        );
        assert.ok(
          !project.manuscriptFiles.includes('RESEARCH.md'),
          `${fixture.workType} should not scaffold advisory RESEARCH.md at new-work`
        );
      } else {
        assert.ok(
          !project.manuscriptFiles.includes('PLACES.md'),
          `${fixture.workType} should skip PLACES.md when WORLD is not_applicable`
        );
      }
    }
  });

  it('core workflow commands describe the expected adapted read, create, skip, and regenerate paths', () => {
    const newWork = read('commands/scr/new-work.md');
    assert.match(newWork, /Create every surface marked `required` or `optional`/);
    assert.match(newWork, /Skip every surface marked `not_applicable`/);
    assert.match(newWork, /Do not scaffold it empty at new-work/);

    const imported = read('commands/scr/import.md');
    assert.match(imported, /Create all context files marked `required` or `optional`/);
    assert.match(imported, /Skip every surface marked `not_applicable`/);
    assert.match(imported, /adapted relationship surface/);

    const draft = read('commands/scr/draft.md');
    assert.match(draft, /The adapted cast surface for canonical `CHARACTERS\.md`/);
    assert.match(draft, /The adapted themes surface for canonical `THEMES\.md`/);

    const save = read('commands/scr/save.md');
    assert.match(save, /Regenerate the adapted relationship surface/);
    assert.match(save, /CONFLICTS\.md/);
    assert.match(save, /PEOPLE-DYNAMICS\.md/);

    const scan = read('commands/scr/scan.md');
    assert.match(scan, /surface is not applicable/);
    assert.match(scan, /adapted cast surface/);
    assert.match(scan, /adapted world surface/);

    const relationshipMap = read('commands/scr/relationship-map.md');
    assert.match(relationshipMap, /adapted cast surface/);
    assert.match(relationshipMap, /adapted relationship surface/);

    const health = read('commands/scr/health.md');
    assert.match(health, /legacy canonical surface/);
    assert.match(health, /non-destructive migration/);
  });

  it('command reference descriptions match command frontmatter', () => {
    const commandEntries = collectCommandEntries(path.join(ROOT, 'commands', 'scr'));
    const commandReference = read('docs/command-reference.md');

    for (const entry of commandEntries) {
      const pattern = new RegExp(
        `### \`${escapedPattern(entry.commandRef)}\`[\\s\\S]*?\\*\\*Description:\\*\\* ([^\\n]+)`
      );
      const match = commandReference.match(pattern);
      assert.ok(match, `docs/command-reference.md should document ${entry.commandRef}`);
      assert.equal(
        match[1].trim(),
        entry.description.trim(),
        `${entry.commandRef} description should match command frontmatter`
      );
    }
  });
});
