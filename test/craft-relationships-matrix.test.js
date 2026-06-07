const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('craft layer Phase 2: RELATIONSHIPS.md derived matrix', () => {
  it('ships a derived relationship-map template', () => {
    const t = read('templates/RELATIONSHIPS.md');
    assert.ok(t.startsWith('---\n'), 'frontmatter');
    assert.match(t, /authority: derived/);
    assert.match(t, /# Relationship map/);
    assert.match(t, /## Pairwise matrix/);
    assert.match(t, /none/);
    assert.match(t, /## Undefined pairs/);
    assert.match(t, /docs\/relationships-protocol\.md/);
  });

  it('ships a canonical relationships protocol doc', () => {
    const p = read('docs/relationships-protocol.md');
    assert.match(p, /# Relationship map protocol/);
    assert.match(p, /derived/i);
    assert.match(p, /CHARACTERS\.md/);
    assert.match(p, /completeness rule/i);
    assert.match(p, /no relationship.* is a recorded value/i);
    assert.match(p, /Undefined pairs/);
    assert.match(p, /Who regenerates RELATIONSHIPS\.md/);
    assert.match(p, /`\/scr:new-character`/);
    assert.match(p, /`\/scr:character-touch`/);
    assert.match(p, /`\/scr:save`/);
    assert.match(p, /`\/scr:scan --fix`/);
    assert.match(p, /does not apply/i);
  });

  it('save regenerates the derived map', () => {
    const s = read('commands/scr/save.md');
    assert.match(s, /Regenerate `\.manuscript\/RELATIONSHIPS\.md`/);
    assert.match(s, /RELATIONSHIPS\.md regenerated: yes\/no/);
  });

  it('scan checks derived-map staleness', () => {
    assert.match(read('commands/scr/scan.md'), /CHECK 13: RELATIONSHIPS\.md/);
  });

  it('new-character regenerates the derived map instead of hand-updating it', () => {
    const n = read('commands/scr/new-character.md');
    assert.match(n, /Regenerate `\.manuscript\/RELATIONSHIPS\.md`/);
    assert.match(n, /docs\/relationships-protocol\.md/);
    assert.doesNotMatch(n, /Update `RELATIONSHIPS\.md` with new connections/);
  });

  it('character-touch regenerates the derived map after a relationship change', () => {
    assert.match(read('commands/scr/character-touch.md'), /RELATIONSHIPS\.md/);
  });

  it('relationship-map no longer references a non-existent feature_prerequisites section', () => {
    const r = read('commands/scr/relationship-map.md');
    assert.doesNotMatch(r, /feature_prerequisites/);
    assert.match(r, /commands\.relationship-map\.requires/);
  });

  it('shipped-assets inventories the new template and protocol doc', () => {
    const sa = read('docs/shipped-assets.md');
    assert.match(sa, /templates\/RELATIONSHIPS\.md/);
    assert.match(sa, /docs\/relationships-protocol\.md/);
  });

  it('keeps RELATIONSHIPS.md file adaptations intact (derived, still per-group named)', () => {
    const c = JSON.parse(read('data/CONSTRAINTS.json'));
    assert.equal(c.file_adaptations.default['RELATIONSHIPS.md'], 'RELATIONSHIPS.md');
    assert.equal(c.file_adaptations.technical['RELATIONSHIPS.md'], 'DEPENDENCIES.md');
    assert.equal(c.file_adaptations.sacred['RELATIONSHIPS.md'], 'LINEAGES.md');
  });
});
