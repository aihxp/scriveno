const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

describe('Phase 47: runtime sync command', () => {
  it('ships /scr:sync as a utility command', () => {
    const command = read('commands/scr/sync.md');
    const constraints = JSON.parse(read('data/CONSTRAINTS.json'));

    assert.match(command, /^# Sync/m);
    assert.equal(constraints.commands.sync.category, 'utility');
    assert.deepEqual(constraints.commands.sync.available, ['all']);
    assert.match(constraints.commands.sync.description, /Synchronize installed Scriven runtime commands/);
  });

  it('keeps sync distinct from update or package upgrade behavior', () => {
    const command = read('commands/scr/sync.md');

    assert.match(command, /This is not a package upgrade command/);
    assert.match(command, /Do not fetch a newer Scriven release/);
    assert.match(command, /future `\/scr:update` command/);
    assert.match(command, /do not modify manuscript content/i);
  });

  it('uses the existing installer as the sync engine', () => {
    const command = read('commands/scr/sync.md');
    const installer = read('bin/install.js');

    assert.match(command, /node bin\/install\.js --runtime <key> --global --writer --silent/);
    assert.match(command, /Use `--detected` instead of `--runtime <key>`/);
    assert.match(installer, /--runtime <key>/);
    assert.match(installer, /--detected/);
    assert.match(installer, /--silent/);
  });

  it('verifies Codex command mirrors and generated skills', () => {
    const command = read('commands/scr/sync.md');

    assert.match(command, /~\/\.codex\/commands\/scr\/sync\.md/);
    assert.match(command, /~\/\.codex\/skills\/scr-sync\/SKILL\.md/);
    assert.match(command, /generated Codex `SKILL\.md` wrappers/);
  });

  it('documents dry-run and apply modes with runtime targeting', () => {
    const command = read('commands/scr/sync.md');

    assert.match(command, /\/scr:sync --check/);
    assert.match(command, /\/scr:sync --apply --runtime codex --global --developer/);
    assert.match(command, /\/scr:sync --apply --detected --global --writer/);
    assert.match(command, /`--check`: report only/);
    assert.match(command, /`--apply`: run the installer/);
  });
});
