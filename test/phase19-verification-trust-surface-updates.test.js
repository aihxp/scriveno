const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('phase 19 technical-writing trust surfaces', () => {
  const readme = read('README.md');
  const gettingStarted = read('docs/getting-started.md');
  const workTypes = read('docs/work-types.md');
  const architecture = read('docs/architecture.md');
  const agentsDoc = read('AGENTS.md');
  const claudeDoc = read('CLAUDE.md');
  const roadmap = read('.planning/ROADMAP.md');

  it('keeps root and onboarding docs aligned on the expanded work-type count', () => {
    for (const [name, doc] of [
      ['README.md', readme],
      ['docs/getting-started.md', gettingStarted],
      ['docs/work-types.md', workTypes],
      ['docs/architecture.md', architecture],
      ['AGENTS.md', agentsDoc],
      ['CLAUDE.md', claudeDoc],
    ]) {
      assert.match(doc, /50 work types/, `${name} should keep the 50 work-type count`);
    }

    assert.match(workTypes, /9 groups/);
    assert.match(architecture, /9 groups/);
  });

  it('keeps secondary trust docs aligned on the live command inventory count', () => {
    assert.match(architecture, /consistency across 112 commands/i);
    assert.doesNotMatch(architecture, /consistency across 101 commands/i);
  });

  it('keeps the README status section aligned to the shipped milestone state', () => {
    const latestShippedMatch = roadmap.match(
      /Latest shipped milestone:\s+\*\*(.+?)\*\* \(completed [^)]+\)/
    );

    assert.ok(
      latestShippedMatch,
      'ROADMAP.md should declare the latest shipped milestone in Current Status'
    );

    const latestShipped = latestShippedMatch[1]
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    assert.match(
      readme,
      new RegExp(`shipped planning milestones through \`${latestShipped}\``),
      'README should match the latest shipped milestone declared in ROADMAP.md'
    );
    assert.doesNotMatch(readme, /v1\.5 .* in progress/i);
  });

  it('makes the technical-writing family visible without overstating later-scope features', () => {
    assert.match(readme, /Technical writing:/);
    assert.match(gettingStarted, /runbook\? Procedures and system maps/);
    assert.match(workTypes, /Technical Guide \/ User Guide/);
    assert.match(workTypes, /Runbook \/ SOP/);
    assert.match(workTypes, /API or CLI Reference/);
    assert.match(workTypes, /Design Spec \/ Architecture Doc/);

    for (const doc of [readme, workTypes]) {
      assert.doesNotMatch(doc, /docs-site/i);
      assert.doesNotMatch(doc, /portal-oriented/i);
    }
  });
});
