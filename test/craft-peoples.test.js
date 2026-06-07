const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('peoples layer: surface + creation', () => {
  it('ships a PEOPLES template (the collective profile)', () => {
    const t = read('templates/PEOPLES.md');
    assert.ok(t.startsWith('---\n'));
    assert.match(t, /# Peoples/);
    assert.match(t, /Collective want/);
    assert.match(t, /Self-image vs how outsiders see them/);
    assert.match(t, /### Members/);
    assert.match(t, /### Relations with other peoples/);
  });

  it('ships a new-people command parallel to new-character', () => {
    const c = read('commands/scr/new-people.md');
    assert.match(c, /# \/scr:new-people/);
    assert.match(c, /collective/i);
    assert.match(c, /Belongs to/);
    assert.match(c, /PEOPLES\.md/);
  });

  it('registers new-people for narrative groups only', () => {
    const con = JSON.parse(read('data/CONSTRAINTS.json'));
    const e = con.commands['new-people'];
    assert.ok(e, 'new-people command entry exists');
    assert.equal(e.category, 'character_world');
    assert.ok(e.available.includes('prose') && e.available.includes('sacred'));
    assert.ok(e.hidden.includes('poetry') && e.hidden.includes('technical'));
  });

  it('PEOPLES.md is a canonical surface gated by the decision tree', () => {
    const con = JSON.parse(read('data/CONSTRAINTS.json'));
    assert.equal(con.file_adaptations.default['PEOPLES.md'], 'PEOPLES.md');
    const sa = con.surface_applicability.by_group;
    assert.ok(sa.prose.optional.includes('PEOPLES.md'));
    assert.ok(sa.poetry.not_applicable.includes('PEOPLES.md'));
  });

  it('command-reference documents new-people (the count is enforced by command-surface-coherence)', () => {
    const ref = read('docs/command-reference.md');
    assert.match(ref, /### `\/scr:new-people`/);
  });
});
