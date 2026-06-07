const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('craft layer Phase 7: snowflake outlining mode', () => {
  it('outline gains a snowflake mode and advertises the flag', () => {
    const o = read('commands/scr/outline.md');
    assert.match(o, /--snowflake/);
    assert.match(o, /SNOWFLAKE MODE/);
    assert.match(o, /snowflake method/i);
  });

  it('snowflake enforces the logline constraint and sequences existing surfaces', () => {
    const o = read('commands/scr/outline.md');
    assert.match(o, /15 words or fewer/);
    assert.match(o, /no character names/i);
    assert.match(o, /WORK\.md/);
    assert.match(o, /CHARACTERS\.md/);
    assert.match(o, /\/scr:synopsis/);
    assert.match(o, /[Ss]cene list/);
  });
});
