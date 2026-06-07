const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('craft layer: older-project upgrade path', () => {
  it('health detects a project version gap', () => {
    const h = read('commands/scr/health.md');
    assert.match(h, /Project version check/);
    assert.match(h, /scriveno_version/);
    assert.match(h, /older than the runtime/i);
  });

  it('health --repair upgrades an older project non-destructively', () => {
    const h = read('commands/scr/health.md');
    assert.match(h, /Upgrade an older project/i);
    assert.match(h, /non-destructive/i);
    assert.match(h, /RELATIONSHIPS\.md/);
    assert.match(h, /CONFLICTS\.md/);
    assert.match(h, /Bump the project version/i);
    assert.match(h, /No authored content was modified/i);
  });
});
