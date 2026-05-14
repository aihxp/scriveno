const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  copyDir,
  RUNTIMES,
  parseArgs,
  resolveInstallRequest,
  collectCommandEntries,
  cleanCodexSkillDirs,
  commandRefToCodexSkillName,
  commandRefToClaudeInvocation,
  commandRefToCodexInvocation,
  commandEntryToFlatCommandFileName,
  generateClaudeCommandContent,
  cleanFlatCommandFiles,
  generateCodexSkill,
  generateSkillManifest,
  buildFilesystemMcpCommand,
  generatePerplexitySetupGuide,
} = require('../bin/install.js');

const ROOT = path.join(__dirname, '..');

describe('Installer copyDir', () => {
  it('copies files to temp directory', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-test-'));
    try {
      const src = path.join(ROOT, 'commands', 'scr');
      const dest = path.join(tmpDir, 'scr');
      const count = copyDir(src, dest);
      assert.ok(count > 0, `Expected files to be copied, got count ${count}`);
      assert.ok(
        fs.existsSync(path.join(dest, 'demo.md')),
        'demo.md should exist in copied output'
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  });

  it('returns 0 for non-existent source', () => {
    const count = copyDir('/tmp/nonexistent-scriveno-path', '/tmp/nonexistent-scriveno-dest');
    assert.equal(count, 0);
  });

  it('copies nested directories', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-test-'));
    try {
      const src = path.join(ROOT, 'commands');
      const dest = path.join(tmpDir, 'commands');
      const count = copyDir(src, dest);
      assert.ok(count > 0, `Expected files to be copied, got count ${count}`);
      // Verify nested sacred/ subdirectory was copied
      assert.ok(
        fs.existsSync(path.join(dest, 'scr', 'sacred', 'concordance.md')),
        'nested sacred/concordance.md should exist'
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  });
});

describe('Installer RUNTIMES', () => {
  it('has entries for all supported runtimes', () => {
    assert.ok('claude-code' in RUNTIMES, 'missing claude-code runtime');
    assert.ok('cursor' in RUNTIMES, 'missing cursor runtime');
    assert.ok('gemini-cli' in RUNTIMES, 'missing gemini-cli runtime');
    assert.ok('codex' in RUNTIMES, 'missing codex runtime');
    assert.ok('opencode' in RUNTIMES, 'missing opencode runtime');
    assert.ok('copilot' in RUNTIMES, 'missing copilot runtime');
    assert.ok('windsurf' in RUNTIMES, 'missing windsurf runtime');
    assert.ok('antigravity' in RUNTIMES, 'missing antigravity runtime');
    assert.ok('manus' in RUNTIMES, 'missing manus runtime');
    assert.ok('perplexity-desktop' in RUNTIMES, 'missing perplexity-desktop runtime');
  });

  it('each runtime has required directory properties for its type', () => {
    for (const [name, runtime] of Object.entries(RUNTIMES)) {
      assert.ok('type' in runtime, `runtime "${name}" missing property "type"`);
      assert.ok('detect' in runtime, `runtime "${name}" missing property "detect"`);
      assert.equal(
        typeof runtime.detect,
        'function',
        `runtime "${name}" detect should be a function`
      );

      if (runtime.type === 'commands') {
        const commandProps = [
          'commands_dir_global',
          'commands_dir_project',
          'agents_dir_global',
          'agents_dir_project',
        ];
        for (const prop of commandProps) {
          assert.ok(prop in runtime, `commands runtime "${name}" missing property "${prop}"`);
        }
      } else if (runtime.type === 'skills') {
        const skillProps = ['skills_dir_global', 'skills_dir_project'];
        for (const prop of skillProps) {
          assert.ok(prop in runtime, `skills runtime "${name}" missing property "${prop}"`);
        }
      } else if (runtime.type === 'guided-mcp') {
        const guidedProps = ['guide_dir_global', 'guide_dir_project'];
        for (const prop of guidedProps) {
          assert.ok(prop in runtime, `guided runtime "${name}" missing property "${prop}"`);
        }
      }
    }
  });
});

describe('RUNTIMES type classification', () => {
  it('every entry has a recognized runtime type', () => {
    for (const [name, runtime] of Object.entries(RUNTIMES)) {
      assert.ok(
        runtime.type === 'commands' || runtime.type === 'skills' || runtime.type === 'guided-mcp',
        `runtime "${name}" has invalid type "${runtime.type}"`
      );
    }
  });

  it('command-directory runtimes have type commands', () => {
    const commandRuntimes = [
      'claude-code', 'cursor', 'gemini-cli',
      'opencode', 'copilot', 'windsurf', 'antigravity',
    ];
    for (const name of commandRuntimes) {
      assert.ok(name in RUNTIMES, `missing runtime "${name}"`);
      assert.equal(RUNTIMES[name].type, 'commands', `runtime "${name}" should have type "commands"`);
      assert.ok('commands_dir_global' in RUNTIMES[name], `runtime "${name}" missing commands_dir_global`);
      assert.ok('commands_dir_project' in RUNTIMES[name], `runtime "${name}" missing commands_dir_project`);
      assert.ok('agents_dir_global' in RUNTIMES[name], `runtime "${name}" missing agents_dir_global`);
      assert.ok('agents_dir_project' in RUNTIMES[name], `runtime "${name}" missing agents_dir_project`);
    }
  });

  it('skill-file runtimes have type skills with skills_dir properties', () => {
    const skillRuntimes = ['codex', 'manus', 'generic'];
    for (const name of skillRuntimes) {
      assert.ok(name in RUNTIMES, `missing runtime "${name}"`);
      assert.equal(RUNTIMES[name].type, 'skills', `runtime "${name}" should have type "skills"`);
      assert.ok('skills_dir_global' in RUNTIMES[name], `runtime "${name}" missing skills_dir_global`);
      assert.ok('skills_dir_project' in RUNTIMES[name], `runtime "${name}" missing skills_dir_project`);
    }
  });

  it('codex runtime keeps command and agent mirror paths alongside skills', () => {
    assert.equal(RUNTIMES.codex.type, 'skills');
    assert.ok('commands_dir_global' in RUNTIMES.codex);
    assert.ok('commands_dir_project' in RUNTIMES.codex);
    assert.ok('agents_dir_global' in RUNTIMES.codex);
    assert.ok('agents_dir_project' in RUNTIMES.codex);
    assert.equal(RUNTIMES.codex.skill_style, 'per-command');
  });

  it('guided runtimes have guide_dir properties', () => {
    const guidedRuntimes = ['perplexity-desktop'];
    for (const name of guidedRuntimes) {
      assert.ok(name in RUNTIMES, `missing runtime "${name}"`);
      assert.equal(RUNTIMES[name].type, 'guided-mcp', `runtime "${name}" should have type "guided-mcp"`);
      assert.ok('guide_dir_global' in RUNTIMES[name], `runtime "${name}" missing guide_dir_global`);
      assert.ok('guide_dir_project' in RUNTIMES[name], `runtime "${name}" missing guide_dir_project`);
    }
  });

  it('generic runtime has correct label and detect returns false', () => {
    assert.equal(RUNTIMES.generic.label, 'Generic (SKILL.md)');
    assert.equal(RUNTIMES.generic.detect(), false);
  });

  it('generic runtime is the last entry in RUNTIMES', () => {
    const keys = Object.keys(RUNTIMES);
    assert.equal(keys[keys.length - 1], 'generic');
  });

  it('manus runtime has type skills and detects via ~/.manus/ or Manus.app', () => {
    assert.equal(RUNTIMES.manus.type, 'skills');
    assert.equal(typeof RUNTIMES.manus.detect, 'function');
    // detect() returns a boolean (may be true or false depending on environment)
    assert.equal(typeof RUNTIMES.manus.detect(), 'boolean');
  });

  it('perplexity desktop runtime detects via Perplexity.app and is not a file-copy target', () => {
    assert.equal(RUNTIMES['perplexity-desktop'].type, 'guided-mcp');
    assert.equal(typeof RUNTIMES['perplexity-desktop'].detect, 'function');
    assert.equal(typeof RUNTIMES['perplexity-desktop'].detect(), 'boolean');
  });
});

describe('generateSkillManifest', () => {
  const manifest = generateSkillManifest(path.join(ROOT, 'data', 'CONSTRAINTS.json'));

  it('returns a string', () => {
    assert.equal(typeof manifest, 'string');
  });

  it('contains Scriveno header', () => {
    assert.ok(manifest.includes('# Scriveno'), 'manifest should contain "# Scriveno" header');
  });

  it('contains markdown table header', () => {
    assert.ok(
      manifest.includes('| Command | Category | Description |'),
      'manifest should contain table header'
    );
  });

  it('includes /scr:new-work command', () => {
    assert.ok(manifest.includes('/scr:new-work'), 'manifest should include /scr:new-work');
  });

  it('includes /scr:draft command', () => {
    assert.ok(manifest.includes('/scr:draft'), 'manifest should include /scr:draft');
  });

  it('includes /scr:help command', () => {
    assert.ok(manifest.includes('/scr:help'), 'manifest should include /scr:help');
  });

  it('includes sacred subcommands like /scr:sacred:concordance', () => {
    assert.ok(
      manifest.includes('/scr:sacred:concordance'),
      'manifest should include /scr:sacred:concordance'
    );
  });

  it('does not publish phantom top-level sacred commands', () => {
    assert.doesNotMatch(
      manifest,
      /\| \/scr:concordance \|/,
      'manifest should not advertise /scr:concordance when only /scr:sacred:concordance is installed'
    );
  });

  it('has at least 80 command rows', () => {
    const commandRows = manifest.split('\n').filter(line => line.includes('| `/scr:') || (line.includes('| /scr:') && line.includes(' | ')));
    assert.ok(
      commandRows.length >= 80,
      `expected at least 80 command rows, got ${commandRows.length}`
    );
  });

  it('includes category names from CONSTRAINTS.json', () => {
    const categories = ['core', 'navigation', 'quality'];
    for (const cat of categories) {
      assert.ok(
        manifest.includes(cat),
        `manifest should include category "${cat}"`
      );
    }
  });
});

describe('Codex skill helpers', () => {
  it('maps Scriveno commands to Codex skill names and invocations', () => {
    assert.equal(commandRefToCodexSkillName('/scr:help'), 'scr-help');
    assert.equal(commandRefToClaudeInvocation('/scr:help'), '/scr-help');
    assert.equal(commandRefToClaudeInvocation('/scr:sacred:concordance'), '/scr-sacred-concordance');
    assert.equal(commandRefToCodexSkillName('/scr:sacred:concordance'), 'scr-sacred-concordance');
    assert.equal(commandRefToCodexSkillName('/scr:sacred-verse-numbering'), 'scr-tradition-verse-numbering');
    assert.equal(commandRefToClaudeInvocation('/scr:sacred-verse-numbering'), '/scr-tradition-verse-numbering');
    assert.equal(commandRefToCodexInvocation('/scr:new-work'), '$scr-new-work');
  });

  it('collects command entries from the Scriveno command tree', () => {
    const entries = collectCommandEntries(path.join(ROOT, 'commands', 'scr'));
    assert.ok(entries.length >= 90, `expected at least 90 command entries, got ${entries.length}`);
    assert.ok(entries.some((entry) => entry.commandRef === '/scr:help'));
    assert.ok(entries.some((entry) => entry.commandRef === '/scr:sacred:concordance'));
  });

  it('generates a Codex skill wrapper that points at the installed command file', () => {
    const entry = {
      commandRef: '/scr:help',
      skillName: 'scr-help',
      description: 'Show Scriveno commands grouped by workflow stage',
      argumentHint: '[category or search term, optional]',
      relativePath: 'help.md',
    };
    const skill = generateCodexSkill(entry, '/tmp/.codex/commands/scr/help.md');
    assert.match(skill, /name: "scr-help"/);
    assert.match(skill, /\$scr-help/);
    assert.match(skill, /\/tmp\/\.codex\/commands\/scr\/help\.md/);
    assert.match(skill, /\/scr:sacred:concordance/);
  });

  it('maps command entries to Claude flat command file names', () => {
    assert.equal(
      commandEntryToFlatCommandFileName({ commandRef: '/scr:help' }),
      'scr-help.md'
    );
    assert.equal(
      commandEntryToFlatCommandFileName({ commandRef: '/scr:sacred:concordance' }),
      'scr-sacred-concordance.md'
    );
    assert.equal(
      commandEntryToFlatCommandFileName({ commandRef: '/scr:sacred-verse-numbering' }),
      'scr-tradition-verse-numbering.md'
    );
  });

  it('keeps generated Codex skill names and Claude flat file names unique', () => {
    const entries = collectCommandEntries(path.join(ROOT, 'commands', 'scr'));
    const skillNames = entries.map((entry) => entry.skillName);
    const flatFileNames = entries.map((entry) => commandEntryToFlatCommandFileName(entry));

    assert.equal(new Set(skillNames).size, skillNames.length, 'Codex skill names must not collide');
    assert.equal(new Set(flatFileNames).size, flatFileNames.length, 'Claude flat command filenames must not collide');
  });

  it('rewrites Claude-installed command content to /scr-* references and stamps the file', () => {
    const content = `---
description: "Help"
---
Run \`/scr:help\`, then \`/scr:new-work\`, and finally \`/scr:sacred:concordance\`.
`;
    const installed = generateClaudeCommandContent(
      {
        commandRef: '/scr:help',
        relativePath: 'help.md',
      },
      content
    );

    assert.match(installed, /scriveno-cli-installed-command runtime:claude-code/);
    assert.match(installed, /`\/scr-help`/);
    assert.match(installed, /`\/scr-new-work`/);
    assert.match(installed, /`\/scr-sacred-concordance`/);
    assert.doesNotMatch(installed, /\/scr:help/);
  });
});

describe('parseArgs', () => {
  it('parses multi-runtime silent install flags', () => {
    const parsed = parseArgs(['--runtimes', 'codex,claude-code', '--project', '--developer', '--silent']);
    assert.deepEqual(parsed.runtimeKeys, ['codex', 'claude-code']);
    assert.equal(parsed.isGlobal, false);
    assert.equal(parsed.developerMode, true);
    assert.equal(parsed.silent, true);
  });

  it('supports repeated runtime flags and detected mode', () => {
    const parsed = parseArgs(['--runtime', 'codex', '--runtime=claude-code', '--detected']);
    assert.deepEqual(parsed.runtimeKeys, ['codex', 'claude-code']);
    assert.equal(parsed.installDetected, true);
  });

  it('rejects unknown runtimes', () => {
    assert.throws(() => parseArgs(['--runtime', 'unknown-runtime']), /Unknown runtime/);
  });
});

describe('resolveInstallRequest', () => {
  it('keeps modifier-only interactive runs interactive', () => {
    const parsed = parseArgs(['--project', '--developer']);
    const resolved = resolveInstallRequest(parsed, ['codex'], { isTTY: true });
    assert.equal(resolved.action, 'interactive');
    assert.equal(resolved.isGlobal, false);
    assert.equal(resolved.developerMode, true);
  });

  it('rejects silent installs without an explicit runtime directive', () => {
    const parsed = parseArgs(['--project', '--developer', '--silent']);
    const resolved = resolveInstallRequest(parsed, ['claude-code'], { isTTY: true });
    assert.equal(resolved.action, 'usage_error');
    assert.match(resolved.message, /Silent installs require/);
  });

  it('resolves explicit runtime installs non-interactively', () => {
    const parsed = parseArgs(['--runtime', 'codex', '--project', '--developer', '--silent']);
    const resolved = resolveInstallRequest(parsed, ['claude-code'], { isTTY: true });
    assert.equal(resolved.action, 'install');
    assert.deepEqual(resolved.runtimeKeys, ['codex']);
    assert.equal(resolved.isGlobal, false);
    assert.equal(resolved.developerMode, true);
    assert.equal(resolved.silent, true);
  });
});

describe('cleanCodexSkillDirs', () => {
  it('removes stale Scriveno-owned skills from the manifest while preserving unrelated directories', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-codex-clean-'));
    const skillsDir = path.join(tmpDir, '.codex', 'skills');
    fs.mkdirSync(skillsDir, { recursive: true });

    fs.mkdirSync(path.join(skillsDir, 'scr-help'), { recursive: true });
    fs.writeFileSync(path.join(skillsDir, 'scr-help', 'SKILL.md'), '# old help');
    fs.mkdirSync(path.join(skillsDir, 'scr-old-command'), { recursive: true });
    fs.writeFileSync(path.join(skillsDir, 'scr-old-command', 'SKILL.md'), '# old stale');
    fs.mkdirSync(path.join(skillsDir, 'custom-skill'), { recursive: true });
    fs.writeFileSync(path.join(skillsDir, 'custom-skill', 'SKILL.md'), '# custom');
    fs.writeFileSync(path.join(skillsDir, '.scriveno-installed.json'), JSON.stringify({
      skills: ['scr-help', 'scr-old-command'],
    }, null, 2));

    const removed = cleanCodexSkillDirs(skillsDir, ['scr-help', 'scr-new-work']);
    assert.equal(removed, 2);
    assert.ok(!fs.existsSync(path.join(skillsDir, 'scr-help')));
    assert.ok(!fs.existsSync(path.join(skillsDir, 'scr-old-command')));
    assert.ok(fs.existsSync(path.join(skillsDir, 'custom-skill')));
  });

  it('removes stale Scriveno-owned skill directories detected by wrapper signature', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-codex-sig-'));
    const skillsDir = path.join(tmpDir, '.codex', 'skills');
    const staleDir = path.join(skillsDir, 'scr-removed');
    fs.mkdirSync(staleDir, { recursive: true });
    fs.writeFileSync(path.join(staleDir, 'SKILL.md'), `---
name: "scr-removed"
---
<codex_skill_adapter>
</codex_skill_adapter>
<objective>
Execute Scriveno's \`/scr:removed\` command inside Codex by reading the installed Scriveno command file below as the source of truth.
</objective>
<context>
Installed command file: /tmp/.codex/commands/scr/removed.md
</context>`);

    const removed = cleanCodexSkillDirs(skillsDir, ['scr-help']);
    assert.equal(removed, 1);
    assert.ok(!fs.existsSync(staleDir));
  });
});

describe('cleanFlatCommandFiles', () => {
  it('removes stale Scriveno-owned Claude command files and the legacy scr/ directory while preserving unrelated files', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-claude-clean-'));
    const commandsDir = path.join(tmpDir, '.claude', 'commands');
    fs.mkdirSync(commandsDir, { recursive: true });

    fs.writeFileSync(
      path.join(commandsDir, 'scr-help.md'),
      '<!-- scriveno-cli-installed-command runtime:claude-code command:/scr-help source:help.md -->\nhelp'
    );
    fs.writeFileSync(
      path.join(commandsDir, 'scr-old-command.md'),
      '<!-- scriveno-cli-installed-command runtime:claude-code command:/scr-old-command source:old-command.md -->\nold'
    );
    fs.writeFileSync(path.join(commandsDir, 'custom.md'), '# custom');
    fs.writeFileSync(path.join(commandsDir, '.scriveno-installed.json'), JSON.stringify({
      files: ['scr-help.md', 'scr-old-command.md'],
    }, null, 2));
    fs.mkdirSync(path.join(commandsDir, 'scr'), { recursive: true });
    fs.writeFileSync(path.join(commandsDir, 'scr', 'next.md'), '# legacy');

    const removed = cleanFlatCommandFiles(commandsDir, ['scr-help.md', 'scr-new-work.md'], ['scr']);
    assert.equal(removed, 3);
    assert.ok(!fs.existsSync(path.join(commandsDir, 'scr-help.md')));
    assert.ok(!fs.existsSync(path.join(commandsDir, 'scr-old-command.md')));
    assert.ok(!fs.existsSync(path.join(commandsDir, 'scr')));
    assert.ok(fs.existsSync(path.join(commandsDir, 'custom.md')));
  });
});

describe('Skill-file install simulation', () => {
  it('creates SKILL.md and command files in target directory', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-skill-test-'));
    try {
      // Generate and write SKILL.md
      const manifest = generateSkillManifest(path.join(ROOT, 'data', 'CONSTRAINTS.json'));
      fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'SKILL.md'), manifest);

      // Copy command files
      copyDir(
        path.join(ROOT, 'commands', 'scr'),
        path.join(tmpDir, 'commands', 'scr')
      );

      // Verify SKILL.md exists and has content
      assert.ok(
        fs.existsSync(path.join(tmpDir, 'SKILL.md')),
        'SKILL.md should exist in target directory'
      );
      const content = fs.readFileSync(path.join(tmpDir, 'SKILL.md'), 'utf8');
      assert.ok(content.length > 0, 'SKILL.md should have content');
      assert.ok(content.includes('# Scriveno'), 'SKILL.md should contain Scriveno header');

      // Verify command files exist
      assert.ok(
        fs.existsSync(path.join(tmpDir, 'commands', 'scr', 'demo.md')),
        'demo.md should exist in commands/scr/'
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  });
});

describe('Perplexity Desktop guided setup', () => {
  it('builds a filesystem MCP command with quoted allowed directories', () => {
    const command = buildFilesystemMcpCommand(['/tmp/project', '/tmp/project/.scriveno']);
    assert.match(command, /^npx -y @modelcontextprotocol\/server-filesystem /);
    assert.match(command, /'\/tmp\/project'/);
    assert.match(command, /'\/tmp\/project\/\.scriveno'/);
  });

  it('generates a setup guide that preserves the limited support boundary', () => {
    const guide = generatePerplexitySetupGuide({
      isGlobal: false,
      guideDir: '/tmp/project/.scriveno/perplexity',
      dataDir: '/tmp/project/.scriveno',
      currentProjectDir: '/tmp/project',
    });

    assert.match(guide, /Perplexity Desktop on macOS/);
    assert.match(guide, /local MCP connector/i);
    assert.match(guide, /slash-command parity/i);
    assert.match(guide, /STYLE-GUIDE\.md/);
  });
});
