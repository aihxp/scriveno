const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { describe, it } = require('node:test');

const { analyzeProject } = require('../lib/auto-invoke-engine.js');
const { runVoiceDnaEval } = require('../lib/voice-dna-eval.js');
const { createRuntimes, RUNTIMES } = require('../lib/installer-runtime-registry.js');
const commandContracts = require('../lib/command-contracts.js');
const {
  generateClaudeCommandContent,
  generateCodexCommandContent,
} = require('../bin/install.js');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function touch(filePath, secondsAgo = null) {
  if (secondsAgo === null || secondsAgo === undefined) return;
  const when = new Date(Date.now() - secondsAgo * 1000);
  fs.utimesSync(filePath, when, when);
}

describe('golden workflow replay proofs', () => {
  it('replays saved workflow states into expected route decisions', () => {
    const data = readJson('data/proof/replay/golden-workflows.json');
    assert.equal(data.fixtures.length, 3);

    for (const fixture of data.fixtures) {
      const project = fs.mkdtempSync(path.join(os.tmpdir(), `scriveno-replay-${fixture.id}-`));
      try {
        for (const file of fixture.files) {
          const target = path.join(project, file.path);
          write(target, file.content);
          touch(target, file.seconds_ago);
        }

        const analysis = analyzeProject(project);
        assert.equal(analysis.recommendation.command, fixture.expected.command, `${fixture.id} command`);
        assert.equal(analysis.automation.mode, fixture.expected.automation_mode, `${fixture.id} automation mode`);

        if (fixture.expected.plan_state) {
          assert.equal(analysis.signals.plan.state, fixture.expected.plan_state, `${fixture.id} plan state`);
        }
        if (fixture.expected.review_state) {
          assert.equal(analysis.signals.reviewCoverage.state, fixture.expected.review_state, `${fixture.id} review state`);
        }
        if (fixture.expected.publishing_state) {
          assert.equal(analysis.signals.publishing.state, fixture.expected.publishing_state, `${fixture.id} publishing state`);
        }
      } finally {
        fs.rmSync(project, { recursive: true, force: true });
      }
    }
  });
});

describe('Voice DNA evaluation harness', () => {
  it('evaluates the paired watchmaker samples against durable markers', () => {
    const result = runVoiceDnaEval();

    assert.equal(result.ok, true);
    assert.equal(result.fixtureCount, 2);
    const guided = result.results.find((entry) => entry.id === 'watchmaker-guided');
    const unguided = result.results.find((entry) => entry.id === 'watchmaker-unguided');

    assert.equal(guided.pass, true);
    assert.equal(unguided.pass, false);
    assert.ok(guided.markerHits > unguided.markerHits);
    assert.ok(unguided.forbiddenHits > guided.forbiddenHits);
  });
});

describe('proof badges and host capture queue', () => {
  it('keeps proof claims tied to explicit evidence levels', () => {
    const levels = readJson('data/proof/evidence-levels.json');
    const knownLevels = new Set(Object.keys(levels.levels));

    assert.ok(knownLevels.has('replay-tested'));
    assert.ok(knownLevels.has('host-capture-ready'));
    assert.ok(knownLevels.has('host-captured'));

    for (const claim of levels.claims) {
      assert.ok(knownLevels.has(claim.level), `${claim.claim} should use a known evidence level`);
      assert.ok(Array.isArray(claim.evidence) && claim.evidence.length > 0, `${claim.claim} should point at evidence`);
    }
  });

  it('queues the first host captures without marking them verified', () => {
    const status = readJson('data/proof/runtime-parity/capture-status.json');

    assert.deepEqual(status.priority_order, ['claude-code', 'codex', 'standard-command-runtime']);
    for (const runtime of status.runtimes) {
      assert.equal(runtime.status, 'queued');
      assert.equal(runtime.evidence_level, 'host-capture-ready');
      assert.ok(read(path.join(runtime.capture_dir, 'README.md')).includes('Status: queued.'));
    }
  });
});

describe('installer seam extraction and generated command contracts', () => {
  it('keeps runtime registry metadata in the extracted module', () => {
    const homeDir = path.join(os.tmpdir(), 'scriveno-home');
    const runtimes = createRuntimes({ homeDir });

    assert.deepEqual(Object.keys(runtimes).sort(), Object.keys(RUNTIMES).sort());
    assert.equal(runtimes['claude-code'].commands_dir_global, path.join(homeDir, '.claude', 'commands'));
    assert.equal(runtimes.codex.agent_metadata, 'toml');
    assert.equal(runtimes.generic.detect(), false);
  });

  it('can generate the installed next-command contract when a source command lacks one', () => {
    const source = '# Temporary Command\n\nDo useful work.\n';
    const installed = commandContracts.ensureNextCommandsContract(source);

    assert.match(installed, /^Next commands:\s*$/m);
    assert.match(installed, /\/scr:next/);
    assert.equal(commandContracts.ensureNextCommandsContract(installed), installed);
  });

  it('lets runtime installers rewrite a generated fallback contract', () => {
    const entry = {
      commandRef: '/scr:temporary',
      skillName: 'scr-temporary',
      relativePath: 'temporary.md',
    };
    const sourceWithContract = commandContracts.ensureNextCommandsContract('# Temporary\n');

    assert.match(generateClaudeCommandContent(entry, sourceWithContract), /\/scr-next/);
    assert.match(generateCodexCommandContent(entry, sourceWithContract), /\$scr-next/);
  });
});
