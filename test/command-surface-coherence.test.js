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

function collectSourceDocs() {
  return [
    'README.md',
    ...collectMarkdownFiles(path.join(ROOT, 'docs')).map((file) => path.join('docs', file)),
    ...collectMarkdownFiles(path.join(ROOT, 'commands')).map((file) => path.join('commands', file)),
  ];
}

function escapedPattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractCommandRefsFromReference(content) {
  return Array.from(content.matchAll(/^### `([^`]+)`/gm), (match) => match[1]).sort();
}

describe('Command surface coherence', () => {
  const constraints = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'CONSTRAINTS.json'), 'utf8'));
  const commandEntries = collectCommandEntries(path.join(ROOT, 'commands', 'scr'));
  const sourceFiles = collectSourceDocs();
  const commandReference = fs.readFileSync(path.join(ROOT, 'docs', 'command-reference.md'), 'utf8');

  const invalidTopLevelSacredRefs = commandEntries
    .filter((entry) => entry.commandRef.startsWith('/scr:sacred:'))
    .map((entry) => `/scr:${entry.commandRef.split(':').pop()}`);

  const invalidAdaptedAliasRefs = Array.from(new Set(
    Object.values(constraints.commands)
      .flatMap((command) => Object.values(command.adapted || {}))
      .map((adaptation) => adaptation.rename)
      .filter(Boolean)
      .map((rename) => `/scr:${rename}`)
  ));

  const commandUnits = Array.from(new Set(
    Object.values(constraints.work_types)
      .map((workType) => workType.command_unit)
      .filter(Boolean)
  ));

  const invalidUnitAliasRefs = Array.from(new Set(
    Object.entries(constraints.commands)
      .filter(([, command]) => command.renames_by_unit)
      .flatMap(([commandName]) => [
        `/scr:${commandName}-{unit}`,
        ...commandUnits.map((unit) => `/scr:${commandName}-${unit}`),
      ])
  ));

  it('source docs do not advertise top-level sacred command refs', () => {
    for (const file of sourceFiles) {
      const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
      for (const ref of invalidTopLevelSacredRefs) {
        assert.doesNotMatch(
          content,
          new RegExp(escapedPattern(ref)),
          `${file} should not advertise ${ref}; use /scr:sacred:* or descriptive labels`
        );
      }
    }
  });

  it('source docs do not advertise adapted labels as runnable /scr:* commands', () => {
    for (const file of sourceFiles) {
      const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
      for (const ref of invalidAdaptedAliasRefs) {
        assert.doesNotMatch(
          content,
          new RegExp(escapedPattern(ref)),
          `${file} should not advertise adapted alias ${ref} as a runnable command`
        );
      }
    }
  });

  it('source docs do not advertise unit-suffixed aliases as runnable /scr:* commands', () => {
    for (const file of sourceFiles) {
      const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
      for (const ref of invalidUnitAliasRefs) {
        assert.doesNotMatch(
          content,
          new RegExp(escapedPattern(ref)),
          `${file} should not advertise unit alias ${ref}; keep the base command id stable and pass the unit number as an argument`
        );
      }
    }
  });

  it('command reference documents every runnable command ref exactly once', () => {
    const advertised = extractCommandRefsFromReference(commandReference);
    const actual = commandEntries.map((entry) => entry.commandRef).sort();

    assert.deepStrictEqual(
      advertised,
      actual,
      'docs/command-reference.md must document every runnable command ref from the live command tree'
    );
  });

  it('command reference headline count matches the live command tree', () => {
    const match = commandReference.match(/Scriveno has \*\*(\d+) commands\*\*/);
    assert.ok(match, 'docs/command-reference.md should declare its command count in the introduction');

    assert.equal(
      Number(match[1]),
      commandEntries.length,
      'docs/command-reference.md intro count must match the live command inventory'
    );
  });
});
