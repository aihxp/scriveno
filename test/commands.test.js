const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const commandsDir = path.join(ROOT, 'commands', 'scr');

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

const commandFiles = collectMarkdownFiles(commandsDir);

describe('Command file structure', () => {
  it('command file names use kebab-case', () => {
    for (const file of commandFiles) {
      assert.match(
        path.basename(file),
        /^[a-z][a-z0-9-]*\.md$/,
        `"${file}" does not match kebab-case pattern`
      );
    }
  });

  it('at least 15 command files exist', () => {
    assert.ok(
      commandFiles.length >= 15,
      `Expected at least 15 command files, found ${commandFiles.length}`
    );
  });

  for (const file of commandFiles) {
    describe(file, () => {
      const content = fs.readFileSync(path.join(commandsDir, file), 'utf8');

      it('has YAML frontmatter', () => {
        assert.match(
          content,
          /^---\n[\s\S]*?\n---/,
          `"${file}" missing YAML frontmatter`
        );
      });

      it('has description in frontmatter', () => {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        assert.ok(frontmatterMatch, `"${file}" has no frontmatter to check`);
        assert.ok(
          frontmatterMatch[1].includes('description:'),
          `"${file}" frontmatter missing description field`
        );
      });

      it('has a heading after frontmatter', () => {
        const afterFrontmatter = content.replace(/^---\n[\s\S]*?\n---/, '');
        assert.match(
          afterFrontmatter,
          /^#\s+/m,
          `"${file}" missing heading after frontmatter`
        );
      });

      it('has a branching next-command response contract with explanations', () => {
        assert.match(
          content,
          /## Response Contract/,
          `"${file}" missing Response Contract section`
        );
        assert.match(
          content,
          /Every writer-facing response must end with one to four next-command suggestions\./,
          `"${file}" must allow one to four next-command suggestions`
        );
        assert.match(
          content,
          /Next commands:\n- `\/scr:\.\.\.`: One short sentence explaining what this path will do\.\n- `\/scr:\.\.\.`: One short sentence explaining what this alternate path will do\./,
          `"${file}" must show the branching Next commands response format`
        );
        assert.match(
          content,
          /Do not force a linear path when the writer has a real choice\./,
          `"${file}" must preserve non-linear next-command guidance`
        );
        assert.match(
          content,
          /Next commands:\n- `\/scr:next`: Inspect the project state and choose the right next step\./,
          `"${file}" must provide the /scr:next fallback explanation`
        );
      });
    });
  }
});
