const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const { collectCommandEntries } = require('../bin/install.js');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function commandKey(commandRef) {
  return commandRef.replace(/^\/scr:/, '');
}

function commandSection(commandReference, commandRef) {
  const marker = `### \`${commandRef}\``;
  const start = commandReference.indexOf(marker);
  assert.ok(start >= 0, `docs/command-reference.md should document ${commandRef}`);
  const next = commandReference.indexOf('\n---\n', start + marker.length);
  return commandReference.slice(start, next < 0 ? undefined : next);
}

function markdownField(section, fieldName) {
  const match = section.match(new RegExp(`\\*\\*${fieldName}:\\*\\* ([^\\n]+)`));
  return match ? match[1].trim() : '';
}

function displayArgumentHint(argumentHint) {
  return argumentHint.replace(/\\"/g, '"');
}

function availabilityIsAllWorkTypes(available, constraints) {
  if (available.includes('all')) return true;
  const groups = Object.keys(constraints.work_type_groups).sort();
  return available.length === groups.length && available.every((group) => groups.includes(group));
}

function availabilityLabel(group) {
  return {
    speech_song: 'speech',
  }[group] || group;
}

function prerequisitePattern(requirement) {
  if (typeof requirement !== 'string') return null;

  const patterns = {
    'ART-DIRECTION.md': /ART-DIRECTION\.md/i,
    'CHARACTERS.md': /CHARACTERS\.md|adapted cast surface/i,
    'DOCTRINES.md': /DOCTRINES\.md/i,
    'FIGURES.md': /FIGURES\.md/i,
    'OUTLINE.md': /OUTLINE\.md/i,
    'STYLE-GUIDE.md': /STYLE-GUIDE\.md/i,
    'THEMES.md': /THEMES\.md|adapted subject file/i,
    'WORK.md': /WORK\.md/i,
    'WORLD.md': /WORLD\.md|adapted world surface/i,
    blurb: /blurb/i,
    'complete-draft': /complete draft/i,
    'config.tradition': /valid `tradition`|config.*tradition/i,
    draft_exists: /draft/i,
    'profile-writer': /profile-writer|STYLE-GUIDE\.md|voice profile/i,
    synopsis: /synopsis/i,
    translate: /translation/i,
  };

  return patterns[requirement] || new RegExp(requirement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

describe('command reference integrity', () => {
  const constraints = JSON.parse(read('data/CONSTRAINTS.json'));
  const commandReference = read('docs/command-reference.md');
  const commandEntries = collectCommandEntries(path.join(ROOT, 'commands', 'scr'));

  it('keeps every usage line aligned with command frontmatter argument-hint', () => {
    for (const entry of commandEntries) {
      const section = commandSection(commandReference, entry.commandRef);
      const usage = markdownField(section, 'Usage');
      const argumentHint = displayArgumentHint(entry.argumentHint || '');
      const expected = `${entry.commandRef}${argumentHint ? ` ${argumentHint}` : ''}`;

      assert.equal(usage, `\`${expected}\``, `${entry.commandRef} usage should match frontmatter`);
    }
  });

  it('keeps command-reference availability aligned with CONSTRAINTS.json', () => {
    for (const entry of commandEntries) {
      const command = constraints.commands[commandKey(entry.commandRef)];
      assert.ok(command, `${entry.commandRef} should exist in CONSTRAINTS.json`);
      const section = commandSection(commandReference, entry.commandRef);
      const availableFor = markdownField(section, 'Available for');
      const available = command.available || [];
      if (available.length === 0) continue;

      if (availabilityIsAllWorkTypes(available, constraints)) {
        if (availableFor) {
          assert.match(availableFor, /all work types/i, `${entry.commandRef} availability should be all work types`);
        }
        continue;
      }

      assert.ok(availableFor, `${entry.commandRef} should document constrained availability`);
      assert.doesNotMatch(
        availableFor,
        /all work types/i,
        `${entry.commandRef} should not claim all work types`
      );

      for (const group of available) {
        assert.match(
          availableFor,
          new RegExp(availabilityLabel(group), 'i'),
          `${entry.commandRef} availability should include ${group}`
        );
      }
    }
  });

  it('keeps command-reference prerequisites aligned with CONSTRAINTS.json requirements', () => {
    for (const entry of commandEntries) {
      const command = constraints.commands[commandKey(entry.commandRef)];
      const requirements = command.requires || [];
      if (requirements.length === 0) continue;

      const section = commandSection(commandReference, entry.commandRef);
      const prerequisites = markdownField(section, 'Prerequisites');
      assert.ok(prerequisites, `${entry.commandRef} should document prerequisites`);

      for (const requirement of requirements) {
        const pattern = prerequisitePattern(requirement);
        if (!pattern) continue;
        assert.match(
          prerequisites,
          pattern,
          `${entry.commandRef} prerequisites should mention ${requirement}`
        );
      }
    }
  });
});
