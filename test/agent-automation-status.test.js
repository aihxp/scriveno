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
    'commands/scr/research.md',
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
      'commands/scr/research.md',
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

  it('requires autopilot closeouts to end with runnable next commands', () => {
    const autopilot = read('commands/scr/autopilot.md');
    const publish = read('commands/scr/autopilot-publish.md');
    const translate = read('commands/scr/autopilot-translate.md');

    assert.match(autopilot, /completion summary is not the final closeout by itself/);
    assert.match(autopilot, /final visible section of the response must be `Next commands:`/);
    assert.match(autopilot, /Never end an autopilot response with prose-only choices/);
    assert.match(autopilot, /\/scr:autopilot --resume/);
    assert.match(autopilot, /\/scr:progress/);
    assert.match(autopilot, /\/scr:editor-review/);

    for (const [name, content] of [
      ['autopilot-publish', publish],
      ['autopilot-translate', translate],
    ]) {
      assert.match(content, /Review Checklist:/, `${name} should keep review tasks separate from command suggestions`);
      assert.match(content, /final visible section must be the `Next commands:` block/, `${name} should require a final next-command block`);
      assert.match(content, /Never end .* with only a checklist/, `${name} should forbid checklist-only closeouts`);
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

    assert.match(content, /lib\/auto-invoke-engine\.js/);
    assert.match(content, /~\/\.scriveno\/lib\/auto-invoke-engine\.js/);
    assert.match(content, /Cross-Platform Agent Rules/);
    assert.match(content, /Claude Code installs command files/);
    assert.match(content, /Codex installs `\$scr-\*` skills/);
    assert.match(content, /Cursor, Gemini CLI, OpenCode, Copilot, Windsurf, and Antigravity/);
    assert.match(content, /Manus and the generic skill runtime/);
    assert.match(content, /Agent: none/);
    assert.match(content, /Candidate agents:/);
    assert.match(content, /getCommandAutomationPolicy/);
    assert.match(content, /Level 4: Manual Only/);
    assert.match(content, /docs\/subagent-spawning-protocol\.md/);
    assert.match(content, /Kimi-compatible generic skill hosts/);
  });

  it('keeps the README public surface aligned with the status CLI', () => {
    const content = read('README.md');

    assert.match(content, /Status CLI/);
    assert.match(content, /Route Intelligence/);
    assert.match(content, /docs\/runtime-support\.md#shared-auto-invoke-engine/);
    assert.match(content, /scriveno status --project \./);
    assert.match(content, /\[Auto-Invoke Policy\]\(docs\/auto-invoke-policy\.md\)/);
    assert.match(content, /Candidate agents/);
    assert.match(content, /does not mutate files and does not spawn agents by itself/);
  });

  it('keeps getting-started and architecture docs aligned with the status CLI', () => {
    const gettingStarted = read('docs/getting-started.md');
    const architecture = read('docs/architecture.md');

    assert.match(gettingStarted, /scriveno status --project \./);
    assert.match(gettingStarted, /\[Auto-Invoke Policy\]\(auto-invoke-policy\.md\)/);
    assert.match(gettingStarted, /candidate agents, candidate local helpers, and manual gates/);
    assert.match(gettingStarted, /does not mutate files or spawn agents by itself/);
    assert.match(architecture, /## Installer Architecture/);
    assert.match(architecture, /### Shared status engine/);
    assert.match(architecture, /lib\/auto-invoke-engine\.js/);
    assert.match(architecture, /scriveno status --project \./);
    assert.match(architecture, /Every command registry category has an automation lane/);
    assert.match(architecture, /does not mutate files and does not spawn agents by itself/);
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
      assert.match(content, /scriveno status --project/, `${file} should prefer the public status CLI`);
      assert.match(content, /auto-invoke-engine\.js/, `${file} should use the executable engine`);
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

  it('documents bounded subagent spawning and prompt-run fallback', () => {
    const protocol = read('docs/subagent-spawning-protocol.md');
    const research = read('commands/scr/research.md');
    const scan = read('commands/scr/scan.md');
    const plan = read('commands/scr/plan.md');
    const review = read('commands/scr/editor-review.md');
    const autopilot = read('commands/scr/autopilot.md');

    assert.match(protocol, /The command owns the workflow/);
    assert.match(protocol, /Codex/);
    assert.match(protocol, /Claude Code/);
    assert.match(protocol, /Kimi or other unlisted hosts/);
    assert.match(protocol, /The model is host-owned/);
    assert.match(protocol, /Do not let workers update `RECORD\.md`/);
    assert.match(research, /Worker Fan-Out/);
    assert.match(research, /researcher: \{count, none, or prompt-run fallback used\}/);
    assert.match(scan, /argument-hint: "\[--fix\] \[--quiet\] \[--deep\]"/);
    assert.match(scan, /Default `\/scr:scan` does not spawn agents/);
    assert.match(scan, /continuity-auditor/);
    assert.match(plan, /preflight workers/);
    assert.match(review, /diagnostic_workers/);
    assert.match(autopilot, /lookahead workers/);
  });
});
