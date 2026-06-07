const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('craft layer Phase 3: conflict map + crisis beat', () => {
  it('OUTLINE adds a Crisis beat distinct from Climax', () => {
    const o = read('templates/OUTLINE.md');
    assert.match(o, /\*\*Crisis:\*\* \{\{CRISIS\}\}/);
    assert.match(o, /\*\*Climax:\*\* \{\{CLIMAX\}\}/);
    assert.match(o, /Crisis and climax are distinct/);
  });

  it('WORK names a conflict taxonomy (type, external, internal)', () => {
    const w = read('templates/WORK.md');
    assert.match(w, /Primary type:.*character vs self/i);
    assert.match(w, /\*\*External:\*\*/);
    assert.match(w, /\*\*Internal:\*\*/);
  });

  it('ships a derived conflict-map template', () => {
    const t = read('templates/CONFLICTS.md');
    assert.ok(t.startsWith('---\n'));
    assert.match(t, /authority: derived/);
    assert.match(t, /# Conflict map/);
    assert.match(t, /## Pairwise conflict matrix/);
    assert.match(t, /no conflict/);
    assert.match(t, /docs\/conflict-protocol\.md/);
  });

  it('ships a canonical conflict protocol doc', () => {
    const p = read('docs/conflict-protocol.md');
    assert.match(p, /# Conflict map protocol/);
    assert.match(p, /completeness rule/i);
    assert.match(p, /no conflict.* is a recorded value/i);
    assert.match(p, /Crisis and climax/);
    assert.match(p, /Who regenerates CONFLICTS\.md/);
    assert.match(p, /`\/scr:save`/);
    assert.match(p, /`\/scr:scan --fix`/);
    assert.match(p, /does not apply/i);
  });

  it('save regenerates the derived conflict map', () => {
    const s = read('commands/scr/save.md');
    assert.match(s, /Regenerate `\.manuscript\/CONFLICTS\.md`/);
    assert.match(s, /CONFLICTS\.md regenerated: yes\/no/);
  });

  it('scan checks conflict-map staleness', () => {
    assert.match(read('commands/scr/scan.md'), /CHECK 14: CONFLICTS\.md/);
  });

  it('shipped-assets inventories the conflict template and protocol', () => {
    const sa = read('docs/shipped-assets.md');
    assert.match(sa, /templates\/CONFLICTS\.md/);
    assert.match(sa, /docs\/conflict-protocol\.md/);
  });
});
