const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('phase 15 sample-flow proof bundle', () => {
  const watchmakerProof = read('data/proof/watchmaker-flow/README.md');

  it('anchors the walkthrough to shipped watchmaker artifacts', () => {
    const expectedRefs = [
      'WORK.md',
      'OUTLINE.md',
      'STYLE-GUIDE.md',
      '1-the-letter-DRAFT.md',
      '2-the-workshop-REVIEW.md',
      '5-the-reunion-PLAN.md',
    ];

    for (const ref of expectedRefs) {
      assert.match(
        watchmakerProof,
        new RegExp(ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
        `watchmaker proof should reference ${ref}`
      );
    }

    assert.match(watchmakerProof, /credible writing outcome/i);
    assert.match(watchmakerProof, /review evidence/i);
    assert.match(watchmakerProof, /next step/i);
  });
});

describe('phase 15 voice DNA proof bundle', () => {
  const voiceBundleReadme = read('data/proof/voice-dna/README.md');
  const styleGuideExcerpt = read('data/proof/voice-dna/STYLE-GUIDE-EXCERPT.md');
  const unguidedSample = read('data/proof/voice-dna/UNGUIDED-SAMPLE.md');
  const guidedSample = read('data/proof/voice-dna/GUIDED-SAMPLE.md');

  it('keeps the voice DNA bundle inspectable', () => {
    assert.match(voiceBundleReadme, /fixed brief/i);
    assert.match(voiceBundleReadme, /unguided/i);
    assert.match(voiceBundleReadme, /guided/i);
    assert.match(voiceBundleReadme, /sentence/i);
    assert.match(voiceBundleReadme, /metaphor/i);
    assert.match(voiceBundleReadme, /dialogue/i);
    assert.match(voiceBundleReadme, /physical/i);
  });

  it('keeps the style-guide excerpt and comparison samples intact', () => {
    assert.match(styleGuideExcerpt, /STYLE-GUIDE/i);
    assert.match(styleGuideExcerpt, /Average sentence length/i);
    assert.match(styleGuideExcerpt, /Metaphor density/i);
    assert.match(styleGuideExcerpt, /Always/i);
    assert.match(styleGuideExcerpt, /Never/i);

    assert.match(unguidedSample, /^# Unguided Sample$/m);
    assert.match(guidedSample, /^# Guided Sample$/m);
  });
});

describe('phase 15 proof routing', () => {
  const readme = read('README.md');
  const gettingStarted = read('docs/getting-started.md');
  const proofArtifacts = read('docs/proof-artifacts.md');
  const voiceDnaGuide = read('docs/voice-dna.md');

  it('keeps proof-first routing visible from launch and onboarding surfaces', () => {
    assert.match(readme, /\[Proof Artifacts\]\(docs\/proof-artifacts\.md\)/);
    assert.match(readme, /voice preservation/i);
    assert.match(readme, /AI-native longform/i);
    assert.match(gettingStarted, /Want evidence first\?/);
    assert.match(gettingStarted, /\[Proof Artifacts\]\(proof-artifacts\.md\)/);
  });

  it('keeps the proof hub wired to the canonical proof artifacts', () => {
    assert.match(proofArtifacts, /^# Proof Artifacts$/m);
    assert.match(proofArtifacts, /data\/proof\/watchmaker-flow\/README\.md/);
    assert.match(proofArtifacts, /## Voice DNA/);
    assert.match(proofArtifacts, /data\/proof\/voice-dna\/README\.md/);
    assert.match(proofArtifacts, /data\/proof\/voice-dna\/STYLE-GUIDE-EXCERPT\.md/);
    assert.match(proofArtifacts, /data\/proof\/voice-dna\/GUIDED-SAMPLE\.md/);
    assert.match(voiceDnaGuide, /data\/proof\/voice-dna\/README\.md/);
    assert.match(voiceDnaGuide, /fixed brief/i);
    // Derive the count from the live registry so the doc claim stays honest
    // without pinning a magic number in the test.
    const commandCount = Object.keys(JSON.parse(read('data/CONSTRAINTS.json')).commands).length;
    assert.match(voiceDnaGuide, new RegExp(`Full list of all ${commandCount} commands`, 'i'));
  });
});
