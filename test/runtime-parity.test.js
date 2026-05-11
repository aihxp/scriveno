const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const {
  collectCommandEntries,
  commandEntryToFlatCommandFileName,
  commandRefToCodexSkillName,
  assertNoSkillNameCollisions,
} = require('../bin/install.js');

const COMMANDS_ROOT = path.join(ROOT, 'commands', 'scr');

describe('runtime parity (Claude Code <-> Codex)', () => {
  // Both runtimes consume the same source tree. The historical bug this guards
  // against was a flat command (commands/scr/sacred-verse-numbering.md) and a
  // nested command (commands/scr/sacred/verse-numbering.md) producing the same
  // skill name (scr-sacred-verse-numbering), which silently dropped one of the
  // two for both Claude and Codex installs. The asserts below pin: same source
  // is consumed, both flat-file (Claude) and skill-dir (Codex) targets are
  // unique, and the two runtimes will install the same set of commands.

  const entries = collectCommandEntries(COMMANDS_ROOT);

  it('collects at least one command from the source tree', () => {
    assert.ok(entries.length > 0, 'no command entries collected; check commands/scr/');
  });

  it('Claude flat-file targets are unique across all source files', () => {
    // Claude install path: every entry becomes scr-foo.md in ~/.claude/commands/.
    // Two entries producing the same flat filename collide on filesystem write,
    // and the second one silently overwrites the first.
    const fileNames = entries.map(commandEntryToFlatCommandFileName);
    const seen = new Map();
    const dupes = [];
    for (const [i, name] of fileNames.entries()) {
      if (seen.has(name)) {
        dupes.push({ name, sources: [seen.get(name), entries[i].relativePath] });
      } else {
        seen.set(name, entries[i].relativePath);
      }
    }
    assert.equal(
      dupes.length,
      0,
      `Claude flat-file collision detected:\n${dupes.map(d => `  ${d.name}: ${d.sources.join(' vs ')}`).join('\n')}`
    );
  });

  it('Codex skill-dir targets are unique across all source files', () => {
    // Codex install path: every entry becomes ~/.codex/skills/scr-foo/SKILL.md.
    // Two entries producing the same skill name collide on the directory name
    // and only one SKILL.md survives.
    const skillNames = entries.map(e => commandRefToCodexSkillName(e.commandRef));
    const seen = new Map();
    const dupes = [];
    for (const [i, name] of skillNames.entries()) {
      if (seen.has(name)) {
        dupes.push({ name, sources: [seen.get(name), entries[i].relativePath] });
      } else {
        seen.set(name, entries[i].relativePath);
      }
    }
    assert.equal(
      dupes.length,
      0,
      `Codex skill-dir collision detected:\n${dupes.map(d => `  ${d.name}: ${d.sources.join(' vs ')}`).join('\n')}`
    );
  });

  it('Claude flat filenames and Codex skill names map 1:1 to the same source set', () => {
    // The two runtimes derive their target identifiers from the same
    // commandEntryToFlatCommandFileName / commandRefToCodexSkillName pair (one
    // adds .md, the other does not). They MUST install the same number of
    // commands, derived from the same sources.
    const claudeNames = new Set(entries.map(e => commandEntryToFlatCommandFileName(e).replace(/\.md$/, '')));
    const codexNames = new Set(entries.map(e => commandRefToCodexSkillName(e.commandRef)));
    assert.equal(
      claudeNames.size,
      codexNames.size,
      'Claude and Codex must derive the same number of installable command identifiers'
    );
    for (const name of claudeNames) {
      assert.ok(
        codexNames.has(name),
        `Claude has flat command "${name}.md" but Codex has no matching skill of the same name`
      );
    }
    for (const name of codexNames) {
      assert.ok(
        claudeNames.has(name),
        `Codex has skill "${name}" but Claude has no matching flat command of the same name`
      );
    }
  });

  it('exposes assertNoSkillNameCollisions and it does not throw on the live tree', () => {
    // The installer calls this at command-entry collection time. If the live
    // source tree triggers it, every install (Claude flat write, Codex skill
    // dir create, generic SKILL.md emit) would abort. Pin the contract here so
    // a regression that re-introduces a colliding pair fails one focused test
    // instead of every install path simultaneously.
    assert.equal(typeof assertNoSkillNameCollisions, 'function');
    assert.doesNotThrow(() => assertNoSkillNameCollisions(entries));
  });

  it('throws a clear error when fed colliding entries', () => {
    // Synthetic input: two entries that produce the same skill name. This
    // exercises the guard itself, independent of the live source tree.
    const colliding = [
      { commandRef: '/scr:sacred-verse-numbering', skillName: 'scr-sacred-verse-numbering', relativePath: 'sacred-verse-numbering.md' },
      { commandRef: '/scr:sacred:verse-numbering', skillName: 'scr-sacred-verse-numbering', relativePath: 'sacred/verse-numbering.md' },
    ];
    assert.throws(
      () => assertNoSkillNameCollisions(colliding),
      /scr-sacred-verse-numbering[\s\S]*sacred-verse-numbering\.md[\s\S]*sacred\/verse-numbering\.md/,
      'collision guard should name the skill and both source paths'
    );
  });
});
