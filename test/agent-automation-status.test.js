const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');

const ROOT = path.resolve(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

describe('agent and automation status contracts', () => {
  const agentStatusCommands = [
    'commands/scr/draft.md',
    'commands/scr/plan.md',
    'commands/scr/translate.md',
    'commands/scr/voice-check.md',
    'commands/scr/continuity-check.md',
    'commands/scr/map-manuscript.md',
    'commands/scr/editor-review.md',
    'commands/scr/beta-reader.md',
    'commands/scr/quick-write.md',
  ];

  it('makes agent spawning visible in writing and review commands', () => {
    for (const file of agentStatusCommands) {
      const content = read(file);

      assert.match(content, /Agent status:/, `${file} should include an agent status block`);
      assert.match(content, /Spawned agents:/, `${file} should list spawned agents`);
      assert.match(content, /Local operations:/, `${file} should list local file operations`);
      assert.match(content, /Auto-invoked:/, `${file} should list auto-invoked follow-ups`);
    }
  });

  it('documents prompt fallback when native agent spawning is unavailable', () => {
    const files = [
      'commands/scr/draft.md',
      'commands/scr/plan.md',
      'commands/scr/translate.md',
      'commands/scr/voice-check.md',
      'commands/scr/continuity-check.md',
      'commands/scr/autopilot.md',
      'commands/scr/autopilot-publish.md',
      'commands/scr/autopilot-translate.md',
      'commands/scr/editor-review.md',
      'commands/scr/beta-reader.md',
      'commands/scr/quick-write.md',
      'commands/scr/track.md',
    ];

    for (const file of files) {
      assert.match(read(file), /fallback/, `${file} should document fallback behavior`);
    }
  });

  it('makes automation chains visible in autopilot and track workflows', () => {
    const files = [
      'commands/scr/autopilot.md',
      'commands/scr/autopilot-publish.md',
      'commands/scr/autopilot-translate.md',
      'commands/scr/track.md',
    ];

    for (const file of files) {
      const content = read(file);

      assert.match(content, /Automation status:/, `${file} should include an automation status block`);
      assert.match(content, /Auto-invoked/, `${file} should list auto-invoked commands or checks`);
      assert.match(content, /Spawned agents:/, `${file} should list spawned agents`);
      assert.match(content, /Local operations:/, `${file} should list local file operations`);
    }
  });

  it('keeps runtime sync explicit about having no background agent', () => {
    const content = read('commands/scr/sync.md');

    assert.match(content, /Sync status:/);
    assert.match(content, /Agent: none/);
    assert.match(content, /runtime sync is installer-driven/);
    assert.match(content, /Engine: bin\/install\.js/);
    assert.match(content, /Updated: none/);
  });

  it('documents the shared auto-invoke policy and cross-platform spawning rules', () => {
    const content = read('docs/auto-invoke-policy.md');

    assert.match(content, /Cross-Platform Agent Rules/);
    assert.match(content, /Claude Code installs command files/);
    assert.match(content, /Codex installs `\$scr-\*` skills/);
    assert.match(content, /Cursor, Gemini CLI, OpenCode, Copilot, Windsurf, and Antigravity/);
    assert.match(content, /Manus and the generic skill runtime/);
    assert.match(content, /Agent: none/);
    assert.match(content, /Level 4: Manual Only/);
  });

  it('keeps read-only proactive commands from spawning agents or mutating files', () => {
    const files = [
      'commands/scr/next.md',
      'commands/scr/progress.md',
      'commands/scr/session-report.md',
    ];

    for (const file of files) {
      const content = read(file);

      assert.match(content, /docs\/auto-invoke-policy\.md/, `${file} should reference the shared policy`);
      assert.match(content, /Automation status:/, `${file} should include automation status`);
      assert.match(content, /Spawned agents:\n- none/, `${file} should report no spawned agents`);
      assert.match(content, /Auto-invoked:\n- none|Auto-invoked:\n- <recommended command>: yes\/no/, `${file} should keep auto-invocation explicit`);
    }
  });

  it('makes deterministic local helpers visible without calling them agents', () => {
    const files = [
      'commands/scr/save.md',
      'commands/scr/scan.md',
      'commands/scr/health.md',
    ];

    for (const file of files) {
      const content = read(file);

      assert.match(content, /docs\/auto-invoke-policy\.md/, `${file} should reference the shared policy`);
      assert.match(content, /Automation status:/, `${file} should include automation status`);
      assert.match(content, /Spawned agents:\n- none/, `${file} should report no spawned agents`);
      assert.match(content, /Local operations:/, `${file} should list local operations`);
    }
  });
});
