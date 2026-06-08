const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('craft layer Phase 6: worldbuilding depth + place detection', () => {
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

  it('scan suggests place registration without promoting mentions into canon', () => {
    const s = read('commands/scr/scan.md');
    assert.match(s, /CHECK 15: PLACES\.md candidate detection/);
    assert.match(s, /\/scr:new-place/);
    assert.match(s, /\/scr:research/);
    assert.match(s, /Do not auto-append candidates and do not create an inbox/);
  });
});
