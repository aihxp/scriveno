const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('craft layer Phase 5: plot devices lifecycle', () => {
  it('RECORD promises/payoffs gains a device taxonomy and lifecycle', () => {
    const r = read('templates/RECORD.md');
    assert.match(r, /chekhovs_gun/);
    assert.match(r, /red_herring/);
    assert.match(r, /macguffin/i);
    assert.match(r, /planted.*paid_off.*abandoned/i);
    assert.match(r, /\| Type \|/);
  });

  it('plant-seed can promote a seed to a tracked device', () => {
    const p = read('commands/scr/plant-seed.md');
    assert.match(p, /Chekhov/i);
    assert.match(p, /Promises and payoffs/);
    assert.match(p, /Status: planted/);
  });

  it('editor-review flags deus ex machina and plot armor and checks planted payoffs', () => {
    const e = read('commands/scr/editor-review.md');
    assert.match(e, /deus ex machina/i);
    assert.match(e, /plot armor/i);
    assert.match(e, /Status: planted|planted/);
  });
});
