const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { RUNTIMES } = require('../bin/install.js');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toDocPathShape(value) {
  const normalized = value.split(path.sep).join('/');
  const home = os.homedir().split(path.sep).join('/');
  return normalized.startsWith(`${home}/`)
    ? `~/${normalized.slice(home.length + 1)}`
    : normalized;
}

function docMentionsPath(doc, relativePath) {
  return doc.includes(`\`${relativePath}\``)
    || doc.includes(`](${relativePath})`)
    || doc.includes(`](../${relativePath})`);
}

describe('trust-critical shipped assets', () => {
  const shippedAssets = read('docs/shipped-assets.md');

  it('matches the currently shipped export templates on disk', () => {
    const shippedTemplates = [
      'data/export-templates/scriveno-book.typst',
      'data/export-templates/scriveno-epub.css',
      'data/export-templates/scriveno-academic.latex',
    ];

    for (const templatePath of shippedTemplates) {
      assert.ok(
        shippedAssets.includes(path.basename(templatePath)),
        `docs/shipped-assets.md should list ${path.basename(templatePath)}`
      );
      assert.ok(exists(templatePath), `Expected shipped template to exist: ${templatePath}`);
    }
  });

  it('still marks planned-but-unshipped templates as absent', () => {
    const absentTemplates = [
      'data/export-templates/scriveno-manuscript.docx',
      'data/export-templates/scriveno-formatted.docx',
      'data/export-templates/scriveno-kdp-cover.typst',
      'data/export-templates/scriveno-ingram-cover.typst',
    ];

    for (const templatePath of absentTemplates) {
      assert.ok(
        shippedAssets.includes(path.basename(templatePath)),
        `docs/shipped-assets.md should mention ${path.basename(templatePath)} as not shipped`
      );
      assert.ok(!exists(templatePath), `Expected template to remain absent: ${templatePath}`);
    }
  });

  it('lists trust-critical launch files that still exist', () => {
    const trustCriticalFiles = [
      'README.md',
      'docs/proof-artifacts.md',
      'docs/versatility-paths.md',
      'docs/runtime-support.md',
      'data/proof/watchmaker-flow/README.md',
      'data/proof/runtime-parity/HOST-CAPTURE-PROTOCOL.md',
      'data/proof/technical-flow/README.md',
      'data/proof/sacred-flow/README.md',
      'data/proof/visual-flow/README.md',
      'data/proof/translation-publishing-flow/README.md',
      'commands/scr/export.md',
      'docs/publishing.md',
      'docs/contributing.md',
      'AGENTS.md',
      'CLAUDE.md',
    ];

    for (const relativePath of trustCriticalFiles) {
      assert.ok(
        shippedAssets.includes(`\`${relativePath}\``),
        `docs/shipped-assets.md should inventory ${relativePath}`
      );
      assert.ok(exists(relativePath), `Trust-critical file is missing: ${relativePath}`);
    }
  });
});

describe('launch-surface regression checks', () => {
  const readme = read('README.md');
  const gettingStarted = read('docs/getting-started.md');

  it('keeps proof and runtime links visible from launch and onboarding docs', () => {
    assert.match(readme, /\[Proof Artifacts\]\(docs\/proof-artifacts\.md\)/);
    assert.match(readme, /\[Runtime Support\]\(docs\/runtime-support\.md\)/);
    assert.match(readme, /\[Shipped Assets\]\(docs\/shipped-assets\.md\)/);
    assert.match(gettingStarted, /\[Proof Artifacts\]\(proof-artifacts\.md\)/);
    assert.match(gettingStarted, /\[Runtime Support\]\(runtime-support\.md\)/);
  });

  it('does not reintroduce forbidden absolute launch claims', () => {
    const forbiddenPhrases = [
      /\bAll features shipped\b/i,
      /\bfull support\b/i,
    ];

    for (const [name, doc] of [['README.md', readme], ['docs/getting-started.md', gettingStarted]]) {
      for (const pattern of forbiddenPhrases) {
        assert.ok(!pattern.test(doc), `${name} should not contain forbidden phrase: ${pattern}`);
      }
    }
  });
});

describe('canonical proof hub integrity', () => {
  const proofArtifacts = read('docs/proof-artifacts.md');

  it('references proof artifact files that exist', () => {
    const canonicalArtifacts = [
      'data/proof/watchmaker-flow/README.md',
      'data/proof/voice-dna/README.md',
      'data/proof/voice-dna/STYLE-GUIDE-EXCERPT.md',
      'data/proof/voice-dna/UNGUIDED-SAMPLE.md',
      'data/proof/voice-dna/GUIDED-SAMPLE.md',
      'data/proof/runtime-parity/README.md',
      'data/proof/runtime-parity/HOST-CAPTURE-PROTOCOL.md',
      'data/proof/technical-flow/README.md',
      'data/proof/sacred-flow/README.md',
      'data/proof/visual-flow/README.md',
      'data/proof/translation-publishing-flow/README.md',
    ];

    for (const relativePath of canonicalArtifacts) {
      assert.ok(
        docMentionsPath(proofArtifacts, relativePath),
        `docs/proof-artifacts.md should reference ${relativePath}`
      );
      assert.ok(exists(relativePath), `Proof artifact is missing: ${relativePath}`);
    }
  });
});

describe('runtime support regression checks', () => {
  const runtimeSupport = read('docs/runtime-support.md');

  it('keeps the Node >=20.0.0 baseline visible', () => {
    assert.match(runtimeSupport, /Node\.js >=20\.0\.0/);
    assert.match(runtimeSupport, />=20\.0\.0/);
  });

  it('covers every installer runtime label from bin/install.js', () => {
    for (const [runtimeKey, runtime] of Object.entries(RUNTIMES)) {
      const installType = runtime.type;
      const supportLevel = runtimeKey === 'claude-code'
        ? 'Primary reference runtime'
        : runtimeKey === 'generic'
          ? 'Generic skills fallback'
          : installType === 'guided-mcp'
            ? 'Guided desktop MCP target'
          : installType === 'skills'
            ? 'Skills installer target'
            : 'Standard installer target';
      const repoEvidence = runtimeKey === 'generic'
        ? 'Installer registry, registry-tested, install-surface tested'
        : installType === 'guided-mcp'
          ? 'Installer registry, registry-tested, guided setup assets, repo-documented'
        : 'Installer registry, registry-tested, install-surface tested, repo-documented';
      const verificationStatus = runtimeKey === 'generic'
        ? 'Registry-tested; install-surface tested; no host-runtime parity verification yet'
        : installType === 'guided-mcp'
          ? 'Registry-tested; repo-documented; no host-runtime parity verification yet'
        : 'Registry-tested; install-surface tested; repo-documented; no host-runtime parity verification yet';
      const globalPath = toDocPathShape(
        installType === 'skills'
          ? runtime.skills_dir_global
          : installType === 'guided-mcp'
            ? runtime.guide_dir_global
            : runtime.commands_dir_global
      );
      const projectPath = toDocPathShape(
        installType === 'skills'
          ? runtime.skills_dir_project
          : installType === 'guided-mcp'
            ? runtime.guide_dir_project
            : runtime.commands_dir_project
      );
      const expectedRow = new RegExp(
        `\\| ${escapeRegex(runtime.label)} \\| ${escapeRegex(installType)} \\| .*${escapeRegex(globalPath)}.*${escapeRegex(projectPath)}.*\\| ${escapeRegex(repoEvidence)} \\| ${escapeRegex(supportLevel)} \\| ${escapeRegex(verificationStatus)} \\|`
      );

      assert.match(
        runtimeSupport,
        expectedRow,
        `docs/runtime-support.md should preserve the canonical matrix row for ${runtime.label}`
      );
    }
  });
});
