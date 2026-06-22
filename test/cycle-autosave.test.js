const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('cycle command structure', () => {
  const cycle = read('commands/scr/cycle.md');

  it('exists with frontmatter description and argument-hint (--silent, --from)', () => {
    const fm = cycle.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'cycle.md missing YAML frontmatter');
    assert.ok(fm[1].includes('description:'), 'cycle.md frontmatter missing description');
    assert.ok(fm[1].includes('argument-hint:'), 'cycle.md frontmatter missing argument-hint');
    assert.ok(fm[1].includes('--silent'), 'argument-hint should include --silent');
    assert.ok(fm[1].includes('--from'), 'argument-hint should include --from');
  });

  it('walks the full seven-stage per-unit sequence in order', () => {
    const stages = [
      '/scr:discuss', '/scr:plan', '/scr:draft', '/scr:editor-review',
      '/scr:line-edit', '/scr:submit', '/scr:save',
    ];
    let last = -1;
    for (const stage of stages) {
      const idx = cycle.indexOf(stage);
      assert.ok(idx !== -1, `cycle.md should invoke ${stage}`);
      assert.ok(idx > last, `cycle.md should reference ${stage} in pipeline order`);
      last = idx;
    }
  });

  it('always ends with a save and offers guided approve/revise/stop', () => {
    assert.match(cycle, /always ends with a save/i);
    assert.match(cycle, /approve \/ revise \/ stop/i);
  });

  it('honors the autosave setting and keeps the Next commands closeout', () => {
    assert.match(cycle, /config\.autosave/);
    assert.match(cycle, /Next commands:/);
  });
});

describe('autosave config and pipeline wiring', () => {
  it('templates/config.json has an autosave block and the git.auto_commit stub is retired', () => {
    const cfg = JSON.parse(read('templates/config.json'));
    assert.ok(cfg.autosave, 'config should have an autosave block');
    assert.equal(cfg.autosave.enabled, false, 'autosave should be off by default');
    assert.ok(['unit', 'stage', 'off'].includes(cfg.autosave.after), 'autosave.after should be unit, stage, or off');
    assert.ok(!('auto_commit' in (cfg.git || {})), 'git.auto_commit should be retired in favor of autosave');
  });

  it('every pipeline command honors config.autosave', () => {
    for (const file of ['cycle', 'autopilot', 'draft', 'editor-review', 'line-edit', 'submit']) {
      assert.match(read(`commands/scr/${file}.md`), /autosave/i, `${file}.md should reference autosave`);
    }
  });

  it('settings exposes autosave for the writer to toggle', () => {
    const settings = read('commands/scr/settings.md');
    assert.match(settings, /autosave\.enabled/);
    assert.match(settings, /autosave\.after/);
  });

  it('auto-invoke policy documents the opt-in autosave exception to the manual-save gate', () => {
    assert.match(read('docs/auto-invoke-policy.md'), /Autosave \(opt-in\)/);
  });
});
