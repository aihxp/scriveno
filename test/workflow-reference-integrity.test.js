const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { collectCommandEntries } = require('../bin/install.js');

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

function collectCurrentWorkflowDocs() {
  const docs = collectMarkdownFiles(path.join(ROOT, 'docs'))
    .map((file) => path.join('docs', file))
    .filter((file) => !['docs/release-notes.md'].includes(file));

  return [
    'README.md',
    ...docs,
    ...collectMarkdownFiles(path.join(ROOT, 'commands')).map((file) => path.join('commands', file)),
    ...collectMarkdownFiles(path.join(ROOT, 'data', 'proof')).map((file) => path.join('data', 'proof', file)),
  ];
}

describe('workflow reference integrity', () => {
  const commandRefs = new Set(
    collectCommandEntries(path.join(ROOT, 'commands', 'scr')).map((entry) => entry.commandRef)
  );

  it('current workflow docs and commands reference only runnable slash commands', () => {
    const badRefs = [];
    const refPattern = /\/scr:[a-z0-9][a-z0-9-]*(?::[a-z0-9][a-z0-9-]*)*/g;

    for (const file of collectCurrentWorkflowDocs()) {
      const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
      for (const match of content.matchAll(refPattern)) {
        const ref = match[0];
        const nextChar = content[match.index + ref.length];
        const lineStart = content.lastIndexOf('\n', match.index) + 1;
        const lineEnd = content.indexOf('\n', match.index);
        const line = content.slice(lineStart, lineEnd === -1 ? content.length : lineEnd);

        if (nextChar === ':') {
          continue;
        }

        if (/do not invent|not a runnable command|anti-pattern/i.test(line)) {
          continue;
        }

        if (!commandRefs.has(ref)) {
          badRefs.push(`${file}: ${ref}`);
        }
      }
    }

    assert.deepEqual(badRefs, []);
  });

  it('all writer-facing commands keep the Next commands closeout contract', () => {
    const missingContract = [];
    const commandFiles = collectMarkdownFiles(path.join(ROOT, 'commands', 'scr'))
      .map((file) => path.join('commands', 'scr', file));

    for (const file of commandFiles) {
      const content = fs.readFileSync(path.join(ROOT, file), 'utf8');

      if (!/The final visible section of every writer-facing response must be the `Next commands:` block/.test(content)) {
        missingContract.push(`${file}: final-section rule`);
      }
      if (!/Suggest only runnable Scriveno commands/.test(content)) {
        missingContract.push(`${file}: runnable-command rule`);
      }
      if (!/Claude Code installed commands use `\/scr-\*`/.test(content)) {
        missingContract.push(`${file}: Claude invocation rule`);
      }
      if (!/Codex installed skills use `\$scr-\*`/.test(content)) {
        missingContract.push(`${file}: Codex invocation rule`);
      }
      if (!/Next commands:/.test(content)) {
        missingContract.push(`${file}: example block`);
      }
    }

    assert.deepEqual(missingContract, []);
  });
});
