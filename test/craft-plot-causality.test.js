const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('craft layer Phase 4: plot causality + scene conflict', () => {
  it('plan requires a causal anchor (Forster: because, not and then)', () => {
    const p = read('commands/scr/plan.md');
    assert.match(p, /## Causal Anchor/);
    assert.match(p, /because.*not.*and then/i);
  });

  it('plan captures scene conflict (goal, obstacle, outcome)', () => {
    const p = read('commands/scr/plan.md');
    assert.match(p, /scene goal and the obstacle/i);
    assert.match(p, /scene conflict/i);
  });

  it('CONFLICTS.md rolls up per-unit scene conflict', () => {
    assert.match(read('templates/CONFLICTS.md'), /## Scene conflict/);
  });

  it('conflict protocol describes scene conflict as authored in plans, not deferred', () => {
    const p = read('docs/conflict-protocol.md');
    assert.match(p, /Scene conflict/);
    assert.doesNotMatch(p, /added in a later phase/);
    assert.match(p, /`\/scr:plan`/);
  });
});
