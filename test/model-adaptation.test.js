const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');

const ROOT = path.resolve(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

describe('model adaptation contract', () => {
  const modelGuide = read('docs/model-adaptation.md');

  it('documents the codebase-level model adaptation surface', () => {
    assert.match(modelGuide, /# Model Adaptation/);
    assert.match(modelGuide, /host owns model selection/);
    assert.match(modelGuide, /bin\/install\.js/);
    assert.match(modelGuide, /lib\/auto-invoke-engine\.js/);
    assert.match(modelGuide, /DEFAULT_MODEL_POLICY/);
    assert.match(modelGuide, /MODEL_ADAPTATION_DOCS/);
    assert.match(modelGuide, /docs\/subagent-spawning-protocol\.md/);
    assert.match(modelGuide, /templates\/RESEARCH\.md/);
  });

  it('covers Codex, Claude Code, generic, Kimi-compatible, and guided hosts honestly', () => {
    assert.match(modelGuide, /Codex/);
    assert.match(modelGuide, /Claude Code/);
    assert.match(modelGuide, /Manus and generic skill hosts/);
    assert.match(modelGuide, /Kimi-compatible or other unlisted hosts/);
    assert.match(modelGuide, /generic `SKILL\.md` fallback/);
    assert.match(modelGuide, /Perplexity Desktop/);
    assert.match(modelGuide, /Do not claim runtime parity/);
  });

  it('keeps the latest adaptations visible across model tiers', () => {
    assert.match(modelGuide, /neutral `RESEARCH\.md` notes/);
    assert.match(modelGuide, /\/scr:research/);
    assert.match(modelGuide, /\/scr:scan --deep/);
    assert.match(modelGuide, /\/scr:plan` preflight workers/);
    assert.match(modelGuide, /\/scr:editor-review` diagnostic workers/);
    assert.match(modelGuide, /\/scr:autopilot` lookahead workers/);
    assert.match(modelGuide, /draft\.rigor: strict/);
    assert.match(modelGuide, /draft\.context_profile: minimal/);
    assert.match(modelGuide, /STYLE-GUIDE\.md` stays sovereign/);
  });

  it('links the model guide from public and trust-critical surfaces', () => {
    const readme = read('README.md');
    const runtimeSupport = read('docs/runtime-support.md');
    const architecture = read('docs/architecture.md');
    const shipped = read('docs/shipped-assets.md');

    assert.match(readme, /\[Model Adaptation\]\(docs\/model-adaptation\.md\)/);
    assert.match(readme, /Kimi-compatible generic skill fallback/);
    assert.match(runtimeSupport, /\[Model Adaptation\]\(model-adaptation\.md\)/);
    assert.match(runtimeSupport, /shared model adaptation docs under `\.scriveno\/docs\/`/);
    assert.match(architecture, /\[`docs\/model-adaptation\.md`\]\(model-adaptation\.md\)/);
    assert.match(shipped, /docs\/model-adaptation\.md/);
  });
});
