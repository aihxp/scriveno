const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function collectMarkdownFiles(dir, prefix = '') {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relPath = prefix ? path.join(prefix, entry.name) : entry.name;
    const absPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(absPath, relPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(relPath);
    }
  }
  return files.sort();
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('Phase 39: workflow contract integrity', () => {
  const sourceDocs = [
    'README.md',
    ...collectMarkdownFiles(path.join(ROOT, 'docs')).map((file) => path.join('docs', file)),
    ...collectMarkdownFiles(path.join(ROOT, 'commands')).map((file) => path.join('commands', file)),
  ];

  it('draft and import write active manuscript units into .manuscript/drafts/body/', () => {
    assert.match(
      read('commands/scr/draft.md'),
      /\.manuscript\/drafts\/body\/\{N\}-\{A\}-DRAFT\.md/,
      'draft.md should write the canonical body draft path'
    );

    assert.match(
      read('commands/scr/import.md'),
      /\.manuscript\/drafts\/body\/\{N\}-\{A\}-DRAFT\.md/,
      'import.md should write imported units into the canonical body draft path'
    );
  });

  it('plan and draft use .manuscript/plans/ as the canonical plan tree', () => {
    assert.match(
      read('commands/scr/plan.md'),
      /\.manuscript\/plans\/\{N\}-\{A\}-PLAN\.md/,
      'plan.md should write the canonical plan path'
    );

    assert.match(
      read('commands/scr/draft.md'),
      /\.manuscript\/plans\/\{N\}-\*-PLAN\.md/,
      'draft.md should read the canonical plan path'
    );

    assert.match(
      read('agents/drafter.md'),
      /\.manuscript\/plans\/\{N\}-\{A\}-PLAN\.md/,
      'drafter.md should receive the canonical plan path'
    );
  });

  it('editor review and submit use .manuscript/reviews/ as the canonical review tree', () => {
    assert.match(
      read('commands/scr/editor-review.md'),
      /\.manuscript\/reviews\/\{N\}-REVIEW\.md/,
      'editor-review.md should write the canonical review report path'
    );

    assert.match(
      read('commands/scr/submit.md'),
      /\.manuscript\/reviews\/\{N\}-REVIEW\.md/,
      'submit.md should check the canonical review report path'
    );
  });

  it('core dependency chain uses canonical draft and review paths', () => {
    const constraints = JSON.parse(read('data/CONSTRAINTS.json'));
    const coreChain = constraints.dependencies.core_chain;
    const editorReview = coreChain.find((entry) => entry.command === 'editor-review');
    const submit = coreChain.find((entry) => entry.command === 'submit');

    assert.deepEqual(
      editorReview.requires,
      ['.manuscript/drafts/body/{N}-*-DRAFT.md'],
      'editor-review dependency should point at the canonical body drafts tree'
    );
    assert.deepEqual(
      submit.requires,
      ['.manuscript/reviews/{N}-REVIEW.md'],
      'submit dependency should point at the canonical review report'
    );
  });

  it('new-work scaffolds directories and config blocks used by later workflow commands', () => {
    const newWork = read('commands/scr/new-work.md');

    for (const expected of [
      'drafts/',
      'body/',
      'plans/',
      'reviews/',
      'editor-notes/',
      '"voice"',
      '"draft"',
      '"export"',
      '"translation"',
      '"collaboration"',
      'top-level sacred profile keys',
      '`tradition`',
      '`verse_numbering_system`',
      'top-level `platform`',
    ]) {
      assert.match(
        newWork,
        new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
        `new-work.md should scaffold or configure ${expected}`
      );
    }
  });

  it('source-manuscript consumers read from the canonical drafts tree', () => {
    assert.match(
      read('commands/scr/back-translate.md'),
      /\.manuscript\/drafts\/body\/\{unit\}-DRAFT\.md/,
      'back-translate.md should read source units from the canonical body draft path'
    );

    assert.match(
      read('commands/scr/back-matter.md'),
      /\.manuscript\/drafts\//,
      'back-matter.md should load drafted prose from the drafts tree'
    );
  });

  it('analysis and editing commands read active manuscript units from .manuscript/drafts/body/', () => {
    for (const file of [
      'commands/scr/originality-check.md',
      'commands/scr/copy-edit.md',
      'commands/scr/voice-check.md',
      'commands/scr/cultural-adaptation.md',
      'commands/scr/line-edit.md',
      'commands/scr/polish.md',
      'commands/scr/theme-tracker.md',
      'commands/scr/add-unit.md',
      'commands/scr/outline.md',
    ]) {
      assert.match(
        read(file),
        /\.manuscript\/drafts\/body\//,
        `${file} should read or inspect active manuscript units from the canonical body drafts tree`
      );
    }
  });

  it('agent prompts use the canonical body draft path and stable command names', () => {
    assert.match(
      read('agents/drafter.md'),
      /\.manuscript\/drafts\/body\/\{N\}-\{A\}-DRAFT\.md/,
      'drafter.md should write active manuscript units into the canonical body draft path'
    );

    assert.match(
      read('agents/voice-checker.md'),
      /\.manuscript\/drafts\/body\/\{N\}-\{A\}-DRAFT\.md/,
      'voice-checker.md should receive active manuscript units from the canonical body draft path'
    );

    assert.match(
      read('agents/continuity-checker.md'),
      /\.manuscript\/drafts\/body\/\{N\}-\{A\}-DRAFT\.md/,
      'continuity-checker.md should read active manuscript units from the canonical body draft path'
    );

    assert.doesNotMatch(
      read('agents/researcher.md'),
      /\/scr:plan-\{unit\}|\/scr:research\b/,
      'researcher.md should not describe removed unit-suffixed or nonexistent research command aliases'
    );
  });

  it('structure-management commands operate on the canonical body drafts tree', () => {
    for (const file of [
      'commands/scr/insert-unit.md',
      'commands/scr/reorder-units.md',
      'commands/scr/remove-unit.md',
      'commands/scr/split-unit.md',
      'commands/scr/merge-units.md',
    ]) {
      assert.match(
        read(file),
        /\.manuscript\/drafts\/body\//,
        `${file} should operate on the canonical body drafts tree`
      );
    }
  });

  it('source docs do not advertise root-level active manuscript draft files', () => {
    const invalidRootLevelDraftRef = /\.manuscript\/(?!drafts\/|translation\/)[^`\s/]+-DRAFT\.md/;
    const invalidWildcardRootLevelDraftRef = /\.manuscript\/`?\s*matching\s*`?\*-DRAFT\.md`?/;

    for (const file of sourceDocs) {
      const content = read(file);
      assert.doesNotMatch(
        content,
        invalidRootLevelDraftRef,
        `${file} should not advertise root-level active manuscript draft files`
      );
      assert.doesNotMatch(
        content,
        invalidWildcardRootLevelDraftRef,
        `${file} should not advertise wildcard root-level draft lookups`
      );
    }
  });
});
