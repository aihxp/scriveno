const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const install = require('../bin/install.js');
const autoInvokeEngine = require('../lib/auto-invoke-engine.js');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

describe('phase 49 command profiles and proof path', () => {
  it('defines install profiles that can shrink the command surface', () => {
    const core = install.surfaceProfileSummary('core');
    const full = install.surfaceProfileSummary('full');
    const coreEntries = install.collectInstallCommandEntries('core').map((entry) => entry.commandRef);

    assert.ok(core.commandCount < full.commandCount, 'core profile should be smaller than full');
    assert.ok(core.commands.includes('surface'), 'core profile should include surface management');
    assert.ok(core.commands.includes('proof-unit'), 'core profile should include the one-unit proof path');
    assert.ok(coreEntries.includes('/scr:proof-unit'));
    assert.ok(!coreEntries.includes('/scr:export'), 'core profile should keep publishing commands out');
  });

  it('parses profile and dry-run installer flags', () => {
    const parsed = install.parseArgs(['--runtime', 'codex', '--profile', 'core', '--dry-run', '--json', '--project']);
    const resolved = install.resolveInstallRequest(parsed, ['codex'], { isTTY: true });

    assert.equal(parsed.installProfile, 'core');
    assert.equal(parsed.installDryRun, true);
    assert.equal(parsed.installJson, true);
    assert.equal(resolved.profile, 'core');
    assert.equal(resolved.dryRun, true);
    assert.equal(resolved.json, true);
  });

  it('parses surface profile actions with runtime targets', () => {
    const parsed = install.parseArgs(['surface', 'profile', 'writing', '--runtime', 'codex', '--project', '--dry-run']);

    assert.equal(parsed.command, 'surface');
    assert.equal(parsed.surfaceAction, 'profile');
    assert.equal(parsed.surfaceProfile, 'writing');
    assert.deepEqual(parsed.runtimeKeys, ['codex']);
    assert.equal(parsed.isGlobal, false);
    assert.equal(parsed.installDryRun, true);
  });

  it('builds a dry-run plan without writes', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-phase49-plan-'));
    const originalCwd = process.cwd();
    try {
      process.chdir(tmpDir);
      const plan = install.buildInstallDryRun({
        runtimeKeys: ['codex'],
        isGlobal: false,
        developerMode: false,
        installMode: 'non-interactive',
        profile: 'core',
      });

      assert.equal(plan.writes, false);
      assert.equal(plan.profile, 'core');
      assert.equal(plan.commandFiles, install.collectInstallCommandEntries('core').length);
      assert.equal(plan.targets[0].commandsDir, path.join(process.cwd(), '.codex/commands/scr'));
      assert.ok(!fs.existsSync(path.join(tmpDir, '.codex')), 'dry run should not create runtime directories');
    } finally {
      process.chdir(originalCwd);
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('surfaces context-health pressure in project analysis', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-phase49-context-'));
    try {
      const manuscript = path.join(tmpDir, '.manuscript');
      mkdirp(path.join(manuscript, 'drafts', 'body'));
      mkdirp(path.join(manuscript, 'plans'));
      fs.writeFileSync(path.join(manuscript, 'config.json'), JSON.stringify({ work_type: 'novel', command_unit: 'chapter' }));
      fs.writeFileSync(path.join(manuscript, 'STATE.md'), '# State\n');
      fs.writeFileSync(path.join(manuscript, 'OUTLINE.md'), '| 1 | Chapter |\n');
      fs.writeFileSync(path.join(manuscript, 'STYLE-GUIDE.md'), 'voice '.repeat(26000));
      fs.writeFileSync(path.join(manuscript, 'CONTEXT.md'), 'context '.repeat(26000));
      fs.writeFileSync(path.join(manuscript, 'drafts', 'body', '1-DRAFT.md'), 'draft '.repeat(26000));

      const analysis = autoInvokeEngine.analyzeProject(tmpDir);
      const report = autoInvokeEngine.formatProactiveChecks(analysis);

      assert.ok(['tight', 'critical'].includes(analysis.signals.contextHealth.state));
      assert.match(report, /Context health:/);
      assert.match(report, /suggest \/scr:/);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('documents proof, surface, export check, and publish preflight commands', () => {
    assert.match(read('commands/scr/proof-unit.md'), /\/scr:export --check/);
    assert.match(read('commands/scr/surface.md'), /scriveno surface profile <name> --dry-run/);
    assert.match(read('commands/scr/export.md'), /If `--check` is passed/);
    assert.match(read('commands/scr/publish.md'), /If `--preflight` was passed/);
    assert.match(read('commands/scr/prepublish-review.md'), /final editorial go\/no-go/i);
    assert.match(read('docs/command-reference.md'), /\/scr:proof-unit/);
    assert.match(read('docs/command-reference.md'), /\/scr:surface/);
    assert.match(read('docs/command-reference.md'), /\/scr:prepublish-review/);
  });
});
