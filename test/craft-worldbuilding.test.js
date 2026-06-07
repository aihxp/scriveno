const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('craft layer Phase 6: worldbuilding depth + entity propagation', () => {
  it('WORLD adds atmosphere/time, setting-as-antagonist, and world-consistency rules', () => {
    const w = read('templates/WORLD.md');
    assert.match(w, /## Atmosphere and time/);
    assert.match(w, /Climate and seasons/i);
    assert.match(w, /Time of day as a rule/i);
    assert.match(w, /## Setting as antagonist/);
    assert.match(w, /## World consistency/);
    assert.match(w, /secondary world/i);
    assert.match(w, /Invented rules that must never break/i);
  });

  it('scan propagates place and faction mentions into WORLD.md', () => {
    const s = read('commands/scr/scan.md');
    assert.match(s, /CHECK 15: WORLD\.md entity propagation/);
    assert.match(s, /places and factions/i);
    assert.match(s, /Reconcile before creating/);
  });
});
