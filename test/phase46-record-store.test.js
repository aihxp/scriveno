const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('Phase 46: RECORD.md store', () => {
  it('ships a neutral established-content template', () => {
    const record = read('templates/RECORD.md');
    assert.ok(record.startsWith('---\n'), 'RECORD.md should start with YAML frontmatter');
    assert.match(record, /creative_pillar: record/);
    assert.match(record, /authority: established/);
    assert.match(record, /tracks what the work has established so far/);
    assert.match(record, /Established on page/);
    assert.match(record, /Open threads/);
    assert.match(record, /Promises and payoffs/);
    assert.match(record, /Continuity facts/);
    assert.match(record, /Next unit obligations/);
    assert.match(record, /sacred commentary/);
    assert.match(record, /technical writing/);
  });

  it('keeps RECORD.md filename stable across file adaptations', () => {
    const constraints = JSON.parse(read('data/CONSTRAINTS.json'));
    for (const group of ['default', 'academic', 'technical', 'sacred']) {
      assert.equal(
        constraints.file_adaptations[group]['RECORD.md'],
        'RECORD.md',
        `${group} should keep RECORD.md neutral`
      );
    }
  });

  it('new-work creates RECORD.md as a store, not a command', () => {
    const newWork = read('commands/scr/new-work.md');
    assert.match(newWork, /RECORD\.md\s+\(always -- tracks what the work has established\)/);
    assert.match(newWork, /Always create `RECORD\.md` from `templates\/RECORD\.md` without renaming it/);
    assert.match(newWork, /`STATE\.md` records workflow position and `OUTLINE\.md` records structure/);
  });

  it('import initializes RECORD.md from source text without inventing truth', () => {
    const importCommand = read('commands/scr/import.md');
    assert.match(importCommand, /surface_applicability/);
    assert.match(importCommand, /file_adaptations/);
    assert.match(importCommand, /WORK\.md, BRIEF\.md or adapted equivalent, OUTLINE\.md, RECORD\.md/);
    assert.match(importCommand, /Populate `RECORD\.md` from the imported manuscript, not from speculation/);
    assert.match(importCommand, /needs writer confirmation/);
  });

  it('core loop routes record notes through discuss, plan, draft, and review', () => {
    assert.match(read('commands/scr/discuss.md'), /## Record Notes/);
    assert.match(read('commands/scr/plan.md'), /## Record Notes/);
    assert.match(read('commands/scr/draft.md'), /Update RECORD\.md/);
    assert.match(read('commands/scr/editor-review.md'), /record_follow_up/);
    assert.match(read('commands/scr/next.md'), /Record-driven branch/);
    assert.match(read('commands/scr/autopilot.md'), /Read `\.manuscript\/RECORD\.md` when present/);
    assert.match(read('commands/scr/autopilot.md'), /Record drift/);
  });

  it('agents treat RECORD.md as established content', () => {
    const drafter = read('agents/drafter.md');
    assert.match(drafter, /RECORD\.md/);
    assert.match(drafter, /The record is established content/);
    assert.match(drafter, /Did the draft honor Record Notes and RECORD\.md/);

    const checker = read('agents/plan-checker.md');
    assert.match(checker, /Record alignment/);
    assert.match(checker, /established facts, open threads, promises, payoffs/);
    assert.match(checker, /Do not require RECORD\.md for older projects/);
  });

  it('scan and context surfaces know about RECORD.md', () => {
    assert.match(read('commands/scr/scan.md'), /CHECK 11: RECORD\.md integrity/);
    assert.match(read('templates/CONTEXT.md'), /## Record highlights/);
    assert.match(read('commands/scr/save.md'), /\{\{RECORD_HIGHLIGHTS\}\}/);
    assert.match(read('docs/context-protocol.md'), /`RECORD\.md` -- compact established-content store/);
  });
});
