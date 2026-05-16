const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function commandIds() {
  const flatCommands = fs.readdirSync(path.join(ROOT, 'commands', 'scr'))
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
  const sacredCommands = fs.readdirSync(path.join(ROOT, 'commands', 'scr', 'sacred'))
    .filter((file) => file.endsWith('.md'))
    .map((file) => `sacred:${file.replace(/\.md$/, '')}`);
  return new Set([...flatCommands, ...sacredCommands]);
}

describe('first-run proof surface', () => {
  const readme = read('README.md');
  const quickProof = read('docs/quick-proof.md');
  const starterSets = read('docs/starter-sets.md');
  const releaseChecklist = read('docs/release-checklist.md');
  const firstRunProof = read('data/proof/first-run/README.md');
  const runtimeParity = read('data/proof/runtime-parity/README.md');

  it('keeps the first-run documents linked from README', () => {
    assert.match(readme, /\[Quick Proof\]\(docs\/quick-proof\.md\)/);
    assert.match(readme, /\[Starter Sets\]\(docs\/starter-sets\.md\)/);
    assert.match(readme, /\[Release Checklist\]\(docs\/release-checklist\.md\)/);
  });

  it('keeps quick proof anchored to real shipped artifacts and runtime shapes', () => {
    const requiredFiles = [
      'data/demo/.manuscript/STYLE-GUIDE.md',
      'data/demo/.manuscript/plans/5-the-reunion-PLAN.md',
      'data/proof/watchmaker-flow/README.md',
      'data/proof/voice-dna/README.md',
      'data/proof/first-run/README.md',
      'data/proof/runtime-parity/README.md',
      'data/proof/voice-dna/UNGUIDED-SAMPLE.md',
      'data/proof/voice-dna/GUIDED-SAMPLE.md',
    ];

    for (const relativePath of requiredFiles) {
      assert.ok(
        quickProof.includes(relativePath) || quickProof.includes(`../${relativePath}`),
        `docs/quick-proof.md should mention ${relativePath}`
      );
      assert.ok(exists(relativePath), `quick proof artifact should exist: ${relativePath}`);
    }

    assert.match(quickProof, /\/scr-draft 5/);
    assert.match(quickProof, /\/scr:first-run/);
    assert.match(quickProof, /\/scr:draft 5/);
    assert.match(quickProof, /\$scr-draft 5/);
    assert.match(quickProof, /scriveno first-run --project \./);
    assert.match(quickProof, /scriveno smoke --json/);
    assert.match(quickProof, /Claude Code is the primary reference runtime/);
    assert.match(quickProof, /host-runtime parity proof/);
  });

  it('keeps first-run proof and runtime parity evidence concrete', () => {
    assert.match(firstRunProof, /scriveno first-run --project \./);
    assert.match(firstRunProof, /scriveno smoke --json/);
    assert.match(firstRunProof, /\/scr:draft 5/);
    assert.match(firstRunProof, /"expectedCommands": 113/);
    assert.match(runtimeParity, /Claude Code/);
    assert.match(runtimeParity, /Codex/);
    assert.match(runtimeParity, /Remaining Host-In-The-Loop Gap/);
    assert.match(runtimeParity, /install-surface proof and host-runtime parity proof/);
  });

  it('keeps starter set command references mapped to real commands', () => {
    const ids = commandIds();
    const commandRefs = Array.from(starterSets.matchAll(/`\/scr:([a-z0-9-:]+)`/g))
      .map((match) => match[1]);

    assert.ok(commandRefs.length >= 30, 'starter sets should expose a meaningful command sample');
    for (const id of commandRefs) {
      assert.ok(ids.has(id), `starter set command should exist: ${id}`);
    }

    const expectedSections = [
      '## First 10 Minutes',
      '## Draft A Book',
      '## Polish A Manuscript',
      '## Publish An Ebook',
      '## Translate A Work',
      '## Build Sacred Commentary',
      '## Repair And Resume',
    ];

    for (const section of expectedSections) {
      assert.match(starterSets, new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  it('keeps the release checklist tied to local, npm, and GitHub verification', () => {
    assert.match(releaseChecklist, /npm run release:check/);
    assert.match(releaseChecklist, /npm publish --access public/);
    assert.match(releaseChecklist, /npm install -g scriveno@latest/);
    assert.match(releaseChecklist, /scriveno smoke --json/);
    assert.match(releaseChecklist, /gh release create/);
    assert.match(releaseChecklist, /npm cache clean --force/);
  });
});
