const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const constraints = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'CONSTRAINTS.json'), 'utf8'));

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

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

describe('Phase 41: availability truthfulness and regression locks', () => {
  const sourceDocs = [
    'README.md',
    ...collectMarkdownFiles(path.join(ROOT, 'docs')).map((file) => path.join('docs', file)),
    ...collectMarkdownFiles(path.join(ROOT, 'commands')).map((file) => path.join('commands', file)),
  ];

  const unsupportedRenames = Array.from(new Set(
    Object.entries(constraints.commands)
      .flatMap(([, command]) => Object.entries(command.adapted || {})
        .filter(([group]) => {
          const available = command.available || [];
          return !available.includes('all') && !available.includes(group);
        })
        .map(([, adaptation]) => adaptation.rename)
        .filter(Boolean))
  ));

  it('help explains that command-level constraints narrow the menu beyond group availability', () => {
    const help = read('commands/scr/help.md');

    assert.match(help, /command-level constraints/i);
    assert.match(help, /nonfiction_only/);
    assert.match(help, /comic_only/);
  });

  it('help keeps revision tracks visible in writer mode and keeps collaboration distinct from save history', () => {
    const help = read('commands/scr/help.md');

    assert.match(
      help,
      /\*\*Collaborate\*\* -- track/,
      'help.md should use /scr:track as the collaboration entrypoint'
    );
    assert.match(
      help,
      /Present `\/scr:track` as the entrypoint for revision-track workflows, and describe its subcommands in prose: create, list, switch, compare, merge, propose\./,
      'help.md should explain track subcommands instead of flattening them into fake top-level commands'
    );
    assert.match(
      help,
      /\*\*Versions\*\* -- save, history, versions, compare, undo/,
      'help.md should keep save-history commands separate from collaboration'
    );
    assert.match(
      help,
      /Revision tracks are a writer-facing workflow, not a developer-only one/i,
      'help.md should explicitly state that track workflows are not hidden in writer mode'
    );
    assert.match(
      help,
      /Do not invent top-level commands like `\/scr:merge` for collaboration/i,
      'help.md should ban fake top-level collaboration commands'
    );
    assert.match(
      help,
      /do not confuse `\/scr:compare` \(save-to-save history comparison\) with `\/scr:track compare` \(revision-track comparison\)/i,
      'help.md should distinguish save-history compare from track compare'
    );
    assert.doesNotMatch(
      help,
      /shown only if developer_mode is true/i,
      'help.md should not hide collaboration commands behind developer_mode'
    );
  });

  it('source docs do not advertise unsupported adapted labels as surfaced commands', () => {
    for (const file of sourceDocs) {
      const content = read(file);
      for (const rename of unsupportedRenames) {
        assert.doesNotMatch(
          content,
          new RegExp(`(?:command appears as|renamed to) \`${rename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\``),
          `${file} should not advertise unsupported adapted label ${rename} as surfaced command behavior`
        );
      }
    }
  });

  it('work-types and command reference keep constrained features honest', () => {
    const workTypes = read('docs/work-types.md');
    const commandReference = read('docs/command-reference.md');

    assert.match(
      workTypes,
      /comics and graphic novels additionally use `?\/scr:panel-layout`?/i,
      'docs/work-types.md should scope panel-layout to comic-oriented visual works'
    );
    assert.match(
      workTypes,
      /adapted label only surfaces when the base command is actually available/i,
      'docs/work-types.md should explain that adaptations do not override availability'
    );
    assert.match(
      commandReference,
      /\*\*Available for:\*\* Prose, sacred \(nonfiction only\)/,
      'docs/command-reference.md should keep book-proposal constrained to nonfiction'
    );
    assert.match(
      commandReference,
      /\*\*Available for:\*\* Visual \(comics only\)/,
      'docs/command-reference.md should keep panel-layout constrained to comics'
    );
  });

  it('discussion questions stays prose-only instead of switching to unsupported sacred study mode', () => {
    const discussionQuestions = read('commands/scr/discussion-questions.md');

    assert.doesNotMatch(discussionQuestions, /study-questions mode/i);
    assert.doesNotMatch(discussionQuestions, /renamed to `study-questions`/);
  });
});
