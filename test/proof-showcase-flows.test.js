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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const showcaseBundles = [
  {
    name: 'technical flow',
    dir: 'data/proof/technical-flow',
    readme: 'README.md',
    state: 'STATE-SNAPSHOT.md',
    plan: '1-restore-service-PLAN.md',
    output: '1-restore-service-DRAFT.md',
    requiredTerms: ['runbook', 'validation', 'rollback', 'reader-state'],
    nextCommand: '/scr:editor-review 1',
  },
  {
    name: 'sacred flow',
    dir: 'data/proof/sacred-flow',
    readme: 'README.md',
    state: 'STATE-SNAPSHOT.md',
    plan: '1-threshold-of-mercy-PLAN.md',
    output: '1-threshold-of-mercy-DRAFT.md',
    requiredTerms: ['commentary', 'doctrinal', 'source', 'register'],
    nextCommand: '/scr:sacred:doctrinal-check 1',
  },
  {
    name: 'visual flow',
    dir: 'data/proof/visual-flow',
    readme: 'README.md',
    state: 'STATE-SNAPSHOT.md',
    plan: '1-gate-page-PLAN.md',
    output: '1-gate-page-OUTPUT.md',
    requiredTerms: ['comic', 'panel', 'art handoff', 'visual'],
    nextCommand: '/scr:editor-review 1',
  },
  {
    name: 'translation publishing flow',
    dir: 'data/proof/translation-publishing-flow',
    readme: 'README.md',
    state: 'STATE-SNAPSHOT.md',
    plan: '1-lifecycle-PLAN.md',
    output: '1-lifecycle-OUTPUT.md',
    requiredTerms: ['translation', 'glossary', 'back-translation', 'prepublish'],
    nextCommand: '/scr:prepublish-review',
  },
];

describe('showcase proof bundles', () => {
  it('ships a complete artifact set for every versatility path', () => {
    for (const bundle of showcaseBundles) {
      const files = [bundle.readme, bundle.state, bundle.plan, bundle.output];
      for (const file of files) {
        const relativePath = `${bundle.dir}/${file}`;
        assert.ok(exists(relativePath), `${bundle.name} should include ${file}`);
        assert.ok(read(relativePath).trim().length > 200, `${relativePath} should be inspectable`);
      }
    }
  });

  it('keeps each bundle explicit about proof scope, workflow shape, and next command', () => {
    for (const bundle of showcaseBundles) {
      const readme = read(`${bundle.dir}/${bundle.readme}`);
      const state = read(`${bundle.dir}/${bundle.state}`);
      const plan = read(`${bundle.dir}/${bundle.plan}`);
      const output = read(`${bundle.dir}/${bundle.output}`);
      const combined = `${readme}\n${state}\n${plan}\n${output}`;

      assert.match(readme, /## What This Proves/);
      assert.match(readme, /## Canonical Flow/);
      assert.match(readme, /## Boundaries/);
      assert.match(plan, /## Command Route/);
      assert.match(combined, new RegExp(escapeRegex(bundle.nextCommand)));

      for (const term of bundle.requiredTerms) {
        assert.match(combined, new RegExp(term, 'i'), `${bundle.name} should mention ${term}`);
      }
    }
  });

  it('uses only runnable Scriveno command references in showcase artifacts', () => {
    const ids = commandIds();
    const badRefs = [];

    for (const bundle of showcaseBundles) {
      for (const file of [bundle.readme, bundle.state, bundle.plan, bundle.output]) {
        const relativePath = `${bundle.dir}/${file}`;
        const content = read(relativePath);
        for (const match of content.matchAll(/\/scr:([a-z0-9-:]+)(?:\s|$)/g)) {
          const id = match[1];
          if (!ids.has(id)) {
            badRefs.push(`${relativePath}: /scr:${id}`);
          }
        }
      }
    }

    assert.deepEqual(badRefs, []);
  });

  it('links showcase proof from the proof hub and versatility guide', () => {
    const proofArtifacts = read('docs/proof-artifacts.md');
    const versatilityPaths = read('docs/versatility-paths.md');

    for (const bundle of showcaseBundles) {
      const bundleReadme = `${bundle.dir}/README.md`;
      assert.match(proofArtifacts, new RegExp(escapeRegex(bundleReadme)));
      assert.match(versatilityPaths, new RegExp(escapeRegex(bundleReadme)));
    }
  });
});

describe('host-runtime parity capture protocol', () => {
  it('turns host-runtime parity into a concrete capture protocol without overclaiming', () => {
    const runtimeEvidence = read('data/proof/runtime-parity/README.md');
    const protocol = read('data/proof/runtime-parity/HOST-CAPTURE-PROTOCOL.md');
    const runtimeSupport = read('docs/runtime-support.md');

    assert.match(runtimeEvidence, /\[HOST-CAPTURE-PROTOCOL\.md\]\(HOST-CAPTURE-PROTOCOL\.md\)/);
    assert.match(runtimeEvidence, /No host capture folder is marked verified/);
    assert.match(protocol, /^# Host Runtime Capture Protocol$/m);
    assert.match(protocol, /transcript or screenshot artifact/);
    assert.match(protocol, /native agent spawning happened, prompt-run fallback happened, or no worker ran/);
    assert.match(protocol, /Until per-runtime capture folders are committed/);
    assert.match(runtimeSupport, /\[Host Runtime Capture Protocol\]\(\.\.\/data\/proof\/runtime-parity\/HOST-CAPTURE-PROTOCOL\.md\)/);
  });
});
