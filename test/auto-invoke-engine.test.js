const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { describe, it } = require('node:test');

const {
  analyzeProject,
  formatReport,
  getRuntimeAgentSupport,
  listRuntimeAgentSupport,
} = require('../lib/auto-invoke-engine.js');

const ROOT = path.resolve(__dirname, '..');

function mkProject(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `scriveno-auto-${label}-`));
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function touchTime(filePath, secondsAgo) {
  const when = new Date(Date.now() - secondsAgo * 1000);
  fs.utimesSync(filePath, when, when);
}

describe('auto-invoke engine', () => {
  it('recommends starting a work when no manuscript exists', () => {
    const project = mkProject('empty');
    try {
      const analysis = analyzeProject(project);

      assert.equal(analysis.signals.hasProject, false);
      assert.equal(analysis.recommendation.command, '/scr:new-work');
      assert.match(formatReport(analysis), /Automation status:/);
      assert.match(formatReport(analysis), /Spawned agents:\n- none/);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  });

  it('detects stale context, unresolved reviews, translation work, and stale exports', () => {
    const project = mkProject('signals');
    try {
      const manuscript = path.join(project, '.manuscript');
      write(path.join(manuscript, 'STATE.md'), 'Current unit: 2\n');
      write(path.join(manuscript, 'CONTEXT.md'), 'Suggested next step: old\n');
      write(path.join(manuscript, 'config.json'), JSON.stringify({
        scriveno_version: 'test',
        work_type: 'novel',
        command_unit: 'chapter',
        target_languages: ['es'],
      }, null, 2));
      write(path.join(manuscript, 'drafts', 'body', '1-DRAFT.md'), 'Draft text\n');
      write(path.join(manuscript, 'reviews', '1-REVIEW.md'), 'TODO: resolve pacing\n');
      write(path.join(manuscript, 'translation', 'GLOSSARY-es.md'), '| term | translation |\n');
      write(path.join(manuscript, 'output', 'manuscript.epub'), 'old export\n');

      touchTime(path.join(manuscript, 'CONTEXT.md'), 30);
      touchTime(path.join(manuscript, 'output', 'manuscript.epub'), 20);
      touchTime(path.join(manuscript, 'STATE.md'), 10);
      touchTime(path.join(manuscript, 'drafts', 'body', '1-DRAFT.md'), 5);

      const analysis = analyzeProject(project);

      assert.equal(analysis.signals.context.state, 'stale');
      assert.equal(analysis.signals.reviews.count, 1);
      assert.equal(analysis.signals.translation.state, 'follow-up available');
      assert.equal(analysis.signals.export.state, 'stale');
      assert.equal(analysis.recommendation.command, '/scr:scan');
      assert.match(formatReport(analysis, { trigger: '/scr:next' }), /Proactive checks:/);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  });

  it('falls back to planning when a project has state but no drafts', () => {
    const project = mkProject('plan');
    try {
      const manuscript = path.join(project, '.manuscript');
      write(path.join(manuscript, 'STATE.md'), 'Current unit: 1\n');
      write(path.join(manuscript, 'CONTEXT.md'), 'Suggested next step: plan\n');
      write(path.join(manuscript, 'config.json'), '{"work_type":"essay","command_unit":"section"}\n');

      const analysis = analyzeProject(project);

      assert.equal(analysis.counts.drafts, 0);
      assert.equal(analysis.recommendation.command, '/scr:plan');
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  });

  it('exposes runtime support for Codex, Claude Code, and every installer runtime', () => {
    const runtimes = listRuntimeAgentSupport();
    const keys = runtimes.map((runtime) => runtime.key).sort();

    assert.deepEqual(keys, [
      'antigravity',
      'claude-code',
      'codex',
      'copilot',
      'cursor',
      'gemini-cli',
      'generic',
      'manus',
      'opencode',
      'perplexity-desktop',
      'windsurf',
    ].sort());
    assert.equal(getRuntimeAgentSupport('codex').metadata, 'toml');
    assert.equal(getRuntimeAgentSupport('claude-code').surface, 'flat commands plus agent prompts');
    for (const runtime of runtimes) {
      assert.ok(runtime.fallback, `${runtime.key} should document fallback behavior`);
      assert.ok(runtime.surface, `${runtime.key} should document installed surface`);
    }
  });

  it('runs from the command line for installed command callers', () => {
    const project = mkProject('cli');
    try {
      const out = execFileSync(
        process.execPath,
        [path.join(ROOT, 'lib', 'auto-invoke-engine.js'), '--project', project, '--trigger', '/scr:progress'],
        { encoding: 'utf8' }
      );

      assert.match(out, /Proactive checks:/);
      assert.match(out, /Trigger: \/scr:progress/);
      assert.match(out, /Next commands:/);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  });

  it('runs through the public scriveno status command in text mode', () => {
    const project = mkProject('bin-status');
    try {
      const out = execFileSync(
        process.execPath,
        [
          path.join(ROOT, 'bin', 'install.js'),
          'status',
          '--project',
          project,
          '--trigger',
          '/scr:next',
        ],
        { encoding: 'utf8' }
      );

      assert.match(out, /Proactive checks:/);
      assert.match(out, /Trigger: \/scr:next/);
      assert.match(out, /Next commands:/);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  });

  it('runs through the public scriveno status command in JSON mode', () => {
    const project = mkProject('bin-json');
    try {
      const out = execFileSync(
        process.execPath,
        [path.join(ROOT, 'bin', 'install.js'), 'status', project, '--json'],
        { encoding: 'utf8' }
      );
      const parsed = JSON.parse(out);

      assert.equal(parsed.projectRoot, project);
      assert.equal(parsed.recommendation.command, '/scr:new-work');
      assert.equal(parsed.signals.hasProject, false);
      assert.deepEqual(parsed.recommendation.alternatives, [
        '/scr:demo',
        '/scr:import',
        '/scr:profile-writer',
      ]);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  });
});
