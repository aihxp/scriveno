const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('craft layer: /scr:climax generation', () => {
  it('ships a climax command that converges the craft surfaces', () => {
    const c = read('commands/scr/climax.md');
    assert.match(c, /# \/scr:climax/);
    assert.match(c, /CONFLICTS\.md/);
    assert.match(c, /RECORD\.md/);
    assert.match(c, /want.*need/i);
    assert.match(c, /Crisis/);
    assert.match(c, /Climax/);
  });

  it('pressure-tests against deus ex machina and plot armor', () => {
    const c = read('commands/scr/climax.md');
    assert.match(c, /deus ex machina/i);
    assert.match(c, /plot armor/i);
    assert.match(c, /earned/i);
  });

  it('is registered in CONSTRAINTS for narrative groups only', () => {
    const con = JSON.parse(read('data/CONSTRAINTS.json'));
    const e = con.commands.climax;
    assert.ok(e, 'climax command entry exists');
    assert.equal(e.category, 'structure');
    assert.ok(e.available.includes('prose') && e.available.includes('script'));
    assert.ok(e.hidden.includes('poetry') && e.hidden.includes('academic'));
  });

  it('is documented in command-reference with the count bumped to 116', () => {
    const ref = read('docs/command-reference.md');
    assert.match(ref, /### `\/scr:climax`/);
    assert.match(ref, /Scriveno has \*\*116 commands\*\*/);
  });
});
