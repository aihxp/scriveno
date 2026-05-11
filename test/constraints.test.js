const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const constraintsPath = path.join(ROOT, 'data', 'CONSTRAINTS.json');
const pkgPath = path.join(ROOT, 'package.json');

describe('CONSTRAINTS.json schema integrity', () => {
  let constraints;
  let pkg;

  it('parses as valid JSON', () => {
    const raw = fs.readFileSync(constraintsPath, 'utf8');
    constraints = JSON.parse(raw);
    assert.equal(typeof constraints, 'object');
    assert.ok(constraints !== null);
  });

  it('has version matching package.json', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    assert.equal(constraints.version, pkg.version);
  });

  it('has required top-level keys', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    assert.ok('work_type_groups' in constraints, 'missing work_type_groups');
    assert.ok('work_types' in constraints, 'missing work_types');
    assert.ok('commands' in constraints, 'missing commands');
  });

  it('every work_type references a valid group', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const groupKeys = Object.keys(constraints.work_type_groups);
    for (const [typeName, typeObj] of Object.entries(constraints.work_types)) {
      assert.ok(
        groupKeys.includes(typeObj.group),
        `work_type "${typeName}" references unknown group "${typeObj.group}"`
      );
    }
  });

  it('every group member exists in work_types', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const typeKeys = Object.keys(constraints.work_types);
    for (const [groupName, groupObj] of Object.entries(constraints.work_type_groups)) {
      for (const member of groupObj.members) {
        assert.ok(
          typeKeys.includes(member),
          `group "${groupName}" references unknown work_type "${member}"`
        );
      }
    }
  });

  it('every command references valid availability groups', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const groupKeys = Object.keys(constraints.work_type_groups);
    for (const [cmdName, cmdObj] of Object.entries(constraints.commands)) {
      if (!cmdObj.available) continue;
      for (const avail of cmdObj.available) {
        assert.ok(
          avail === 'all' || groupKeys.includes(avail),
          `command "${cmdName}" references unknown availability "${avail}"`
        );
      }
    }
  });

  it('every command file on disk is referenced in CONSTRAINTS.json', () => {
    constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    const commandKeys = Object.keys(constraints.commands);
    const commandsDir = path.join(ROOT, 'commands', 'scr');

    // Check top-level .md files
    const topFiles = fs.readdirSync(commandsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''));

    // Check sacred/ subdirectory. Nested commands run as /scr:sacred:<name>
    // and are keyed in CONSTRAINTS.json as "sacred:<name>" so /scr:help can
    // emit the runnable slash-command path directly.
    const sacredDir = path.join(commandsDir, 'sacred');
    const sacredFiles = fs.existsSync(sacredDir)
      ? fs.readdirSync(sacredDir)
          .filter(f => f.endsWith('.md'))
          .map(f => `sacred:${f.replace('.md', '')}`)
      : [];

    const allFiles = [...topFiles, ...sacredFiles];
    for (const file of allFiles) {
      assert.ok(
        commandKeys.includes(file),
        `command file "${file}.md" has no entry in CONSTRAINTS.json`
      );
    }
  });
});
