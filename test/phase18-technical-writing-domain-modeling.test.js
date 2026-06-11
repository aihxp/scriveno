const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const constraints = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'CONSTRAINTS.json'), 'utf8')
);

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('phase 18 technical-writing taxonomy', () => {
  it('adds a dedicated technical work-type group with four research-backed members', () => {
    assert.ok(constraints.work_type_groups.technical, 'technical group should exist');
    assert.deepEqual(constraints.work_type_groups.technical.members, [
      'technical_guide',
      'runbook',
      'api_reference',
      'design_spec',
    ]);
    assert.equal(Object.keys(constraints.work_type_groups).length, 9);
    assert.equal(Object.keys(constraints.work_types).length, 50);
  });

  it('defines technical work types with technical-native hierarchy and command units', () => {
    const expected = {
      technical_guide: { mid: 'section', atomic: 'procedure', command_unit: 'section' },
      runbook: { mid: 'procedure', atomic: 'step', command_unit: 'procedure' },
      api_reference: { mid: 'resource', atomic: 'endpoint', command_unit: 'resource' },
      design_spec: { top: 'system', mid: 'section', atomic: 'decision', command_unit: 'section' },
    };

    for (const [name, spec] of Object.entries(expected)) {
      const workType = constraints.work_types[name];
      assert.equal(workType.group, 'technical', `${name} should belong to the technical group`);
      for (const [key, value] of Object.entries(spec)) {
        if (key === 'command_unit') {
          assert.equal(workType.command_unit, value, `${name} should use ${value} as its command unit`);
        } else {
          assert.equal(workType.hierarchy[key], value, `${name} should use ${value} for hierarchy.${key}`);
        }
      }
    }
  });
});

describe('phase 18 technical-writing scaffolding', () => {
  it('defines technical file adaptations and template assets', () => {
    assert.deepEqual(constraints.file_adaptations.technical, {
      'BRIEF.md': 'DOC-BRIEF.md',
      'RECORD.md': 'RECORD.md',
      'PROGRESS.md': 'PROGRESS.md',
      'CHARACTERS.md': 'AUDIENCE.md',
      'RELATIONSHIPS.md': 'DEPENDENCIES.md',
      'WORLD.md': 'SYSTEM.md',
      'PLOT-GRAPH.md': 'PROCEDURES.md',
      'THEMES.md': 'REFERENCES.md',
    });

    const templateFiles = [
      'templates/technical/DOC-BRIEF.md',
      'templates/technical/AUDIENCE.md',
      'templates/technical/DEPENDENCIES.md',
      'templates/technical/SYSTEM.md',
      'templates/technical/PROCEDURES.md',
      'templates/technical/REFERENCES.md',
    ];

    for (const relativePath of templateFiles) {
      assert.ok(fs.existsSync(path.join(ROOT, relativePath)), `Missing technical template: ${relativePath}`);
    }
  });

  it('makes REFERENCES.md the technical terminology and boundary source', () => {
    const references = read('templates/technical/REFERENCES.md');
    assert.match(references, /## Canonical terminology/);
    assert.match(references, /domain grilling/);
    assert.match(references, /Boundary or example/);
    assert.match(references, /## Domain boundaries/);
    assert.match(references, /Canonical terminology matches/);
    assert.match(references, /Domain boundaries still match/);
  });

  it('teaches new-work to scaffold technical projects with technical-native files and config', () => {
    const newWork = read('commands/scr/new-work.md');
    const templateConfig = JSON.parse(read('templates/config.json'));
    assert.match(newWork, /Technical guide, Runbook, API reference, Design spec/);
    assert.match(newWork, /DOC-BRIEF\.md/);
    assert.match(newWork, /AUDIENCE\.md/);
    assert.match(newWork, /SYSTEM\.md/);
    assert.match(newWork, /PROCEDURES\.md/);
    assert.match(newWork, /REFERENCES\.md/);
    assert.match(newWork, /templates\/technical\//);
    assert.match(newWork, /technical` block/);
    assert.equal(templateConfig.scriveno_version, pkg.version);
    assert.match(newWork, new RegExp(`"scriveno_version": "${pkg.version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  });
});

describe('phase 18 command and export fit', () => {
  it('exposes only the technical-native command surface needed for first-pass docs workflows', () => {
    const commands = constraints.commands;

    for (const name of ['build-world', 'plot-graph', 'outline', 'add-unit', 'insert-unit', 'remove-unit', 'split-unit', 'merge-units', 'reorder-units', 'continuity-check', 'track']) {
      assert.ok(
        commands[name].available.includes('technical'),
        `${name} should be available to technical work types`
      );
    }

    assert.equal(commands['build-world'].adapted.technical.rename, 'map-system');
    assert.equal(commands['plot-graph'].adapted.technical.rename, 'procedure-map');
    assert.equal(commands['editor-review'].adapted.technical.rename, 'technical-review');
    assert.equal(commands['beta-reader'].adapted.technical.rename, 'usability-review');
    assert.equal(commands['continuity-check'].adapted.technical.rename, 'consistency-check');
  });

  it('limits technical-writing exports to document-centric outputs', () => {
    const allowed = Object.entries(constraints.exports)
      .filter(([, details]) => details.available.includes('technical'))
      .map(([name]) => name)
      .sort();

    assert.deepEqual(allowed, ['docx_formatted', 'docx_manuscript', 'pdf_manuscript', 'pdf_review']);

    for (const disallowed of ['kdp_package', 'ingram_package', 'query_package', 'submission_package', 'epub', 'mobi', 'latex']) {
      assert.ok(
        !constraints.exports[disallowed].available.includes('technical'),
        `${disallowed} should stay hidden for technical work types`
      );
    }
  });
});
