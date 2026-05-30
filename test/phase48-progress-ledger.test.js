const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('Phase 48: PROGRESS.md per-unit ledger', () => {
  it('ships a derived per-unit ledger template', () => {
    const progress = read('templates/PROGRESS.md');
    assert.ok(progress.startsWith('---\n'), 'PROGRESS.md should start with YAML frontmatter');
    assert.match(progress, /creative_pillar: continuity/);
    assert.match(progress, /authority: derived/);
    assert.match(progress, /always_load_for: \[progress\]/);
    assert.match(progress, /# Progress ledger/);
    assert.match(progress, /## Deliverable progress/);
    assert.match(progress, /## Pipeline position/);
    assert.match(progress, /ledger/);
    // The three buckets are representable as ASCII status markers.
    assert.ok(progress.includes('[x]') && progress.includes('done'), 'shows a done marker');
    assert.ok(progress.includes('[~]') && progress.includes('in progress'), 'shows an in-progress marker');
    assert.ok(progress.includes('[ ]') && progress.includes('untouched'), 'shows an untouched marker');
    assert.match(progress, /## Trust check/);
    assert.match(progress, /docs\/progress-protocol\.md/);
  });

  it('ships a canonical progress protocol doc', () => {
    const proto = read('docs/progress-protocol.md');
    assert.match(proto, /# Progress ledger protocol/);
    // Three headline buckets, derived from disk.
    assert.match(proto, /Untouched/);
    assert.match(proto, /In progress/);
    assert.match(proto, /Done/);
    assert.match(proto, /derive it from disk/i);
    // Names the regeneration owners and the read-only renderer.
    assert.match(proto, /Who regenerates PROGRESS\.md/);
    assert.match(proto, /`\/scr:draft`/);
    assert.match(proto, /`\/scr:autopilot`/);
    assert.match(proto, /`\/scr:save`/);
    assert.match(proto, /`\/scr:scan --fix`/);
    assert.match(proto, /`\/scr:progress` is read-only/);
  });

  it('keeps PROGRESS.md filename neutral across file adaptations', () => {
    const constraints = JSON.parse(read('data/CONSTRAINTS.json'));
    for (const group of ['default', 'academic', 'technical', 'sacred']) {
      assert.equal(
        constraints.file_adaptations[group]['PROGRESS.md'],
        'PROGRESS.md',
        `${group} should keep PROGRESS.md neutral`
      );
    }
  });

  it('progress command renders the deliverable view and stays read-only', () => {
    const progress = read('commands/scr/progress.md');
    assert.match(progress, /per-unit ledger/);
    assert.match(progress, /\.manuscript\/PROGRESS\.md/);
    assert.match(progress, /Pipeline/);
    assert.match(progress, /done \/ in progress \/ untouched/);
    // Leads with a unit progress bar.
    assert.match(progress, /█/);
    // Read-only contract preserved: it points at the file but does not write it.
    assert.match(progress, /without writing it/);
  });

  it('save, pause, and resume regenerate the ledger alongside CONTEXT.md', () => {
    assert.match(read('commands/scr/save.md'), /Regenerate `\.manuscript\/PROGRESS\.md`/);
    assert.match(read('commands/scr/save.md'), /PROGRESS\.md regenerated: yes\/no/);
    assert.match(read('commands/scr/pause-work.md'), /regenerate `\.manuscript\/PROGRESS\.md`/i);
    assert.match(read('commands/scr/resume-work.md'), /regenerate `\.manuscript\/PROGRESS\.md`/i);
  });

  it('draft and autopilot refresh the ledger and narrate against the whole manuscript', () => {
    const draft = read('commands/scr/draft.md');
    assert.match(draft, /refresh `\.manuscript\/PROGRESS\.md`/i);
    assert.match(draft, /of the manuscript/);
    const autopilot = read('commands/scr/autopilot.md');
    assert.match(autopilot, /Refresh `\.manuscript\/PROGRESS\.md`/);
    assert.match(autopilot, /PROGRESS\.md refreshed: yes\/no/);
    assert.match(autopilot, /3 of 12/);
  });

  it('editor-review and submit advance the ledger', () => {
    assert.match(read('commands/scr/editor-review.md'), /Refresh `\.manuscript\/PROGRESS\.md`/);
    assert.match(read('commands/scr/submit.md'), /Refresh `\.manuscript\/PROGRESS\.md`/);
  });

  it('scan checks ledger staleness and outline derives status from disk', () => {
    assert.match(read('commands/scr/scan.md'), /CHECK 12: PROGRESS\.md ledger staleness/);
    assert.match(read('commands/scr/outline.md'), /docs\/progress-protocol\.md/);
    assert.match(read('commands/scr/outline.md'), /not from STATE\.md aggregates/);
    assert.match(read('commands/scr/manuscript-stats.md'), /docs\/progress-protocol\.md/);
  });

  it('trust-layer docs know about the ledger', () => {
    assert.match(read('docs/context-protocol.md'), /`\.manuscript\/PROGRESS\.md` -- per-unit progress ledger/);
    assert.match(read('docs/auto-invoke-policy.md'), /`PROGRESS\.md` ledger regeneration/);
    assert.match(read('docs/shipped-assets.md'), /templates\/PROGRESS\.md/);
    assert.match(read('docs/shipped-assets.md'), /docs\/progress-protocol\.md/);
    assert.match(read('docs/command-reference.md'), /\.manuscript\/PROGRESS\.md/);
    assert.match(read('docs/creative-context.md'), /PROGRESS\.md/);
  });
});

describe('Phase 48: engine computes the deliverable ledger', () => {
  const engine = require('../lib/auto-invoke-engine.js');

  it('exposes computeProgressLedger', () => {
    assert.equal(typeof engine.computeProgressLedger, 'function');
  });

  it('derives buckets from the demo manuscript on disk', () => {
    const ledger = engine.computeProgressLedger(path.join(ROOT, 'data/demo/.manuscript'));
    assert.equal(ledger.total, 5, 'demo has 5 outlined units');
    assert.equal(ledger.drafted, 4, 'demo has 4 drafted units');
    assert.equal(ledger.planned, 1, 'demo keeps one pending plan (unit 5)');
    assert.equal(ledger.reviewed, 1, 'demo has 1 reviewed unit');
    assert.equal(ledger.done, 1);
    assert.equal(ledger.inProgress, 4);
    assert.equal(ledger.untouched, 0);
    assert.equal(ledger.percent, 20);
    assert.equal(typeof ledger.bar, 'string');
    assert.ok(ledger.bar.length >= 10, 'renders a progress bar');
  });

  it('returns zeros for a directory with no units', () => {
    const ledger = engine.computeProgressLedger(path.join(ROOT, 'docs'));
    assert.equal(ledger.total, 0);
    assert.equal(ledger.done, 0);
    assert.equal(ledger.untouched, 0);
    assert.equal(ledger.percent, 0);
  });

  it('analyzeProject surfaces the ledger and formatReport renders a Progress line', () => {
    const analysis = engine.analyzeProject(path.join(ROOT, 'data/demo'));
    assert.ok(analysis.progress, 'analysis includes a progress ledger');
    assert.equal(analysis.progress.total, 5);
    assert.equal(analysis.progress.done, 1);
    assert.match(engine.formatReport(analysis), /Progress: /);
  });
});
