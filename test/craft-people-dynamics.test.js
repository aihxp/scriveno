const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('peoples layer: inter-group dynamics', () => {
  it('ships a derived people-dynamics template', () => {
    const t = read('templates/PEOPLE-DYNAMICS.md');
    assert.ok(t.startsWith('---\n'));
    assert.match(t, /authority: derived/);
    assert.match(t, /# People dynamics/);
    assert.match(t, /## Pairwise dynamics matrix/);
    assert.match(t, /no dealings/);
    assert.match(t, /docs\/people-dynamics-protocol\.md/);
  });

  it('ships a canonical people-dynamics protocol', () => {
    const p = read('docs/people-dynamics-protocol.md');
    assert.match(p, /# People dynamics protocol/);
    assert.match(p, /completeness rule/i);
    assert.match(p, /no dealings.* is a recorded value/i);
    assert.match(p, /Who regenerates PEOPLE-DYNAMICS\.md/);
    assert.match(p, /`\/scr:save`/);
    assert.match(p, /`\/scr:scan --fix`/);
    assert.match(p, /does not apply/i);
  });

  it('save regenerates the people-dynamics map', () => {
    const s = read('commands/scr/save.md');
    assert.match(s, /Regenerate `\.manuscript\/PEOPLE-DYNAMICS\.md`/);
    assert.match(s, /PEOPLE-DYNAMICS\.md regenerated: yes\/no/);
  });

  it('scan checks people-dynamics staleness', () => {
    assert.match(read('commands/scr/scan.md'), /CHECK 16: PEOPLE-DYNAMICS\.md/);
  });

  it('relationship-map --peoples views it; new-people regenerates it', () => {
    const r = read('commands/scr/relationship-map.md');
    assert.match(r, /--peoples/);
    assert.match(r, /PEOPLE-DYNAMICS\.md/);
    assert.match(read('commands/scr/new-people.md'), /[Rr]egenerate `\.manuscript\/PEOPLE-DYNAMICS\.md`/);
  });

  it('shipped-assets inventories the people-dynamics template and protocol', () => {
    const sa = read('docs/shipped-assets.md');
    assert.match(sa, /templates\/PEOPLE-DYNAMICS\.md/);
    assert.match(sa, /docs\/people-dynamics-protocol\.md/);
  });
});
