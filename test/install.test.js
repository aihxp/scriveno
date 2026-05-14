const { describe, it, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  atomicWriteFileSync,
  cleanOrphanedTempFiles,
  collectTargetDirsForSweep,
  RUNTIMES,
  readFrontmatterValue,
  readFrontmatterValues,
  rewriteInstalledCommandRefs,
  generateCodexCommandContent,
  generateClaudeCommandContent,
  commandRefToCodexInvocation,
  commandRefToClaudeInvocation,
  installCodexRuntime,
  collectCommandEntries,
} = require('../bin/install.js');

const TB = '`' + '`' + '`'; // triple-backtick, avoids clashing with template literals
const TT = '~~~';

function mkTmp(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `scriveno-atomic-${label}-`));
}

describe('atomicWriteFileSync', () => {
  it('writes the expected content to the target path', () => {
    const tmpDir = mkTmp('write');
    try {
      const target = path.join(tmpDir, 'out.txt');
      atomicWriteFileSync(target, 'hello world');
      assert.equal(fs.readFileSync(target, 'utf8'), 'hello world');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('leaves no *.tmp.<uuid> sibling after successful write', () => {
    const tmpDir = mkTmp('notmp');
    try {
      const target = path.join(tmpDir, 'out.txt');
      atomicWriteFileSync(target, 'data');
      const entries = fs.readdirSync(tmpDir);
      assert.deepEqual(entries, ['out.txt']);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('creates missing parent directories recursively', () => {
    const tmpDir = mkTmp('mkdir');
    try {
      const target = path.join(tmpDir, 'a', 'b', 'c', 'out.txt');
      atomicWriteFileSync(target, 'nested');
      assert.equal(fs.readFileSync(target, 'utf8'), 'nested');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('accepts Buffer content', () => {
    const tmpDir = mkTmp('buffer');
    try {
      const target = path.join(tmpDir, 'buf.bin');
      const buf = Buffer.from([0x00, 0x01, 0x02, 0x03]);
      atomicWriteFileSync(target, buf);
      const read = fs.readFileSync(target);
      assert.ok(read.equals(buf));
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('H-01: parent-dir fsync does not throw on normal writes (best-effort on platforms that reject it)', () => {
    const tmpDir = mkTmp('fsync-parent');
    try {
      const target = path.join(tmpDir, 'nested', 'out.txt');
      // Should not throw on any supported platform; internal try/catch swallows
      // EISDIR/EPERM from Windows / network filesystems.
      atomicWriteFileSync(target, 'durable');
      assert.equal(fs.readFileSync(target, 'utf8'), 'durable');
      // No tmp siblings left -- rename succeeded and directory fsync is a no-op
      // on the directory contents.
      assert.deepEqual(fs.readdirSync(path.join(tmpDir, 'nested')), ['out.txt']);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('cleans up the temp file and rethrows when write fails', () => {
    const tmpDir = mkTmp('failwrite');
    try {
      // parent is a file, not a directory -- writeFileSync will fail on the tmp path
      const parentAsFile = path.join(tmpDir, 'actually-a-file');
      fs.writeFileSync(parentAsFile, 'blocking');
      const target = path.join(parentAsFile, 'child.txt');

      assert.throws(() => atomicWriteFileSync(target, 'x'));

      // No .tmp. siblings left in the tmpDir
      const leftovers = fs.readdirSync(tmpDir).filter((n) => /\.tmp\./.test(n));
      assert.deepEqual(leftovers, []);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('cleanOrphanedTempFiles', () => {
  it('returns 0 when directory does not exist (no throw)', () => {
    const nonexistent = path.join(os.tmpdir(), 'scriveno-absent-' + Date.now());
    assert.equal(cleanOrphanedTempFiles(nonexistent), 0);
  });

  it('removes *.tmp.<uuid> files and returns the count', () => {
    const tmpDir = mkTmp('orphans');
    try {
      const uuid1 = '00000000-0000-0000-0000-000000000000';
      const uuid2 = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
      fs.writeFileSync(path.join(tmpDir, `settings.json.tmp.${uuid1}`), 'x');
      fs.writeFileSync(path.join(tmpDir, `SKILL.md.tmp.${uuid2}`), 'y');
      fs.writeFileSync(path.join(tmpDir, 'keep.txt'), 'keep');

      const removed = cleanOrphanedTempFiles(tmpDir);
      assert.equal(removed, 2);
      assert.deepEqual(fs.readdirSync(tmpDir).sort(), ['keep.txt']);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('leaves non-matching files untouched', () => {
    const tmpDir = mkTmp('nomatch');
    try {
      fs.writeFileSync(path.join(tmpDir, 'regular.txt'), 'x');
      fs.writeFileSync(path.join(tmpDir, 'something.tmp.notauuid'), 'y');
      fs.writeFileSync(path.join(tmpDir, 'file.tmp'), 'z');
      fs.writeFileSync(path.join(tmpDir, 'settings.json'), 'w');

      const removed = cleanOrphanedTempFiles(tmpDir);
      assert.equal(removed, 0);
      assert.deepEqual(fs.readdirSync(tmpDir).sort(), [
        'file.tmp',
        'regular.txt',
        'settings.json',
        'something.tmp.notauuid',
      ]);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('M-02: recurses into subdirectories up to the depth cap', () => {
    const tmpDir = mkTmp('recurse');
    try {
      const uuid = '12345678-1234-1234-1234-123456789abc';
      const subdir = path.join(tmpDir, 'sub');
      fs.mkdirSync(subdir);
      fs.writeFileSync(path.join(subdir, `nested.tmp.${uuid}`), 'nested');
      // Also put a matching file at root so we know the fn ran
      fs.writeFileSync(path.join(tmpDir, `root.tmp.${uuid}`), 'root');

      const removed = cleanOrphanedTempFiles(tmpDir);
      assert.equal(removed, 2);
      assert.ok(!fs.existsSync(path.join(subdir, `nested.tmp.${uuid}`)));
      assert.ok(!fs.existsSync(path.join(tmpDir, `root.tmp.${uuid}`)));
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('M-02: sweeps deeply nested orphan tmp files (e.g. skills/<name>/SKILL.md.tmp.<uuid>)', () => {
    const tmpDir = mkTmp('deep-recurse');
    try {
      const uuid = 'deadbeef-dead-beef-dead-beefdeadbeef';
      const deep = path.join(tmpDir, 'skills', 'scr-help');
      fs.mkdirSync(deep, { recursive: true });
      fs.writeFileSync(path.join(deep, `SKILL.md.tmp.${uuid}`), 'partial');

      const removed = cleanOrphanedTempFiles(tmpDir);
      assert.equal(removed, 1);
      assert.ok(!fs.existsSync(path.join(deep, `SKILL.md.tmp.${uuid}`)));
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('L-01: rejects non-canonical UUID shapes (e.g. 36 dashes)', () => {
    const tmpDir = mkTmp('tight-uuid');
    try {
      // 36 chars of [0-9a-f-] but not the canonical 8-4-4-4-12 layout.
      const bogus1 = 'foo.tmp.' + '-'.repeat(36);
      const bogus2 = 'foo.tmp.' + 'a'.repeat(36);
      const bogus3 = 'foo.tmp.' + '12345678-1234-1234-1234-12345678-abc'; // extra dash
      fs.writeFileSync(path.join(tmpDir, bogus1), 'x');
      fs.writeFileSync(path.join(tmpDir, bogus2), 'y');
      fs.writeFileSync(path.join(tmpDir, bogus3), 'z');
      // And one real canonical UUID tmp file that should be removed.
      const realUuid = '01234567-89ab-cdef-0123-456789abcdef';
      fs.writeFileSync(path.join(tmpDir, `real.tmp.${realUuid}`), 'w');

      const removed = cleanOrphanedTempFiles(tmpDir);
      assert.equal(removed, 1);
      const survivors = fs.readdirSync(tmpDir).sort();
      assert.deepEqual(survivors, [bogus1, bogus2, bogus3].sort());
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('ignores directory entries even if their name matches', () => {
    const tmpDir = mkTmp('dirmatch');
    try {
      const uuid = '87654321-4321-4321-4321-cba987654321';
      // A directory whose name matches the pattern -- must NOT be removed
      fs.mkdirSync(path.join(tmpDir, `fakedir.tmp.${uuid}`));
      const removed = cleanOrphanedTempFiles(tmpDir);
      assert.equal(removed, 0);
      assert.ok(fs.existsSync(path.join(tmpDir, `fakedir.tmp.${uuid}`)));
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('collectTargetDirsForSweep', () => {
  it('includes dataDir plus command/skill/agent dirs for a representative global selection', () => {
    const dataDir = '/tmp/fake-data-dir';
    const dirs = collectTargetDirsForSweep(['claude-code', 'codex'], true, dataDir);
    assert.ok(dirs.includes(dataDir));
    assert.ok(dirs.includes(RUNTIMES['claude-code'].commands_dir_global));
    assert.ok(dirs.includes(RUNTIMES['claude-code'].agents_dir_global));
    assert.ok(dirs.includes(RUNTIMES.codex.commands_dir_global));
    assert.ok(dirs.includes(RUNTIMES.codex.skills_dir_global));
    assert.ok(dirs.includes(RUNTIMES.codex.agents_dir_global));
  });

  it('resolves project-scope relative dirs to absolute paths', () => {
    const dataDir = path.resolve('.scriveno');
    const dirs = collectTargetDirsForSweep(['claude-code'], false, dataDir);
    // Each resolved path should be absolute
    for (const d of dirs) {
      assert.ok(path.isAbsolute(d), `expected absolute path, got ${d}`);
    }
    assert.ok(dirs.includes(path.resolve('.claude/commands')));
    assert.ok(dirs.includes(path.resolve('.claude/agents')));
  });

  it('includes guide_dir for guided-mcp runtimes', () => {
    const dirs = collectTargetDirsForSweep(['perplexity-desktop'], true, '/tmp/data');
    assert.ok(dirs.includes(RUNTIMES['perplexity-desktop'].guide_dir_global));
  });

  it('deduplicates when multiple runtimes share a dir', () => {
    const dirs = collectTargetDirsForSweep(['claude-code'], true, '/tmp/data');
    assert.equal(new Set(dirs).size, dirs.length);
  });
});

describe('Installer leaves no *.tmp. files behind', () => {
  const PKG_ROOT = path.join(__dirname, '..');
  const install = require('../bin/install.js');

  function scanForTmpFiles(rootDir) {
    const found = [];
    function walk(dir) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.tmp\./.test(entry.name)) found.push(full);
      }
    }
    walk(rootDir);
    return found;
  }

  it('installClaudeCommandRuntime leaves zero .tmp. siblings', () => {
    const tmpDir = mkTmp('claude-install');
    try {
      const runtime = {
        ...RUNTIMES['claude-code'],
        commands_dir_project: path.join(tmpDir, 'commands'),
        agents_dir_project: path.join(tmpDir, 'agents'),
      };
      // Run in project scope against tmpDir
      const noop = () => {};
      // Access via module -- need to invoke via the exported-from-module path.
      // The runtime installers are not directly exported, so simulate the core loop:
      const entries = install.collectCommandEntries(path.join(PKG_ROOT, 'commands', 'scr'));
      const commandsDir = runtime.commands_dir_project;
      fs.mkdirSync(commandsDir, { recursive: true });
      for (const entry of entries.slice(0, 3)) {
        const sourcePath = path.join(PKG_ROOT, 'commands', 'scr', entry.relativePath);
        const sourceContent = fs.readFileSync(sourcePath, 'utf8');
        const fileName = install.commandEntryToFlatCommandFileName(entry);
        install.atomicWriteFileSync(
          path.join(commandsDir, fileName),
          install.generateClaudeCommandContent(entry, sourceContent)
        );
      }
      assert.deepEqual(scanForTmpFiles(tmpDir), []);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('atomicWriteFileSync to settings.json leaves zero .tmp. siblings', () => {
    const tmpDir = mkTmp('settings');
    try {
      const settings = { version: '1.0.0', runtime: 'claude-code' };
      install.atomicWriteFileSync(
        path.join(tmpDir, 'settings.json'),
        JSON.stringify(settings, null, 2)
      );
      assert.deepEqual(scanForTmpFiles(tmpDir), []);
      const written = JSON.parse(fs.readFileSync(path.join(tmpDir, 'settings.json'), 'utf8'));
      assert.equal(written.version, '1.0.0');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('crash-simulation: orphan from prior run is cleaned before fresh write succeeds', () => {
    const tmpDir = mkTmp('crash-sim');
    try {
      const dataDir = path.join(tmpDir, '.scriveno');
      fs.mkdirSync(dataDir, { recursive: true });

      // Simulate a prior interrupted install: an orphan tmp file with UUID suffix
      const orphanName = 'settings.json.tmp.00000000-0000-0000-0000-000000000000';
      fs.writeFileSync(path.join(dataDir, orphanName), 'truncated-garbage');
      assert.ok(fs.existsSync(path.join(dataDir, orphanName)));

      // Sweep (what runInstall does at startup)
      const removed = install.cleanOrphanedTempFiles(dataDir);
      assert.equal(removed, 1);
      assert.ok(!fs.existsSync(path.join(dataDir, orphanName)));

      // Now write new settings atomically
      install.atomicWriteFileSync(
        path.join(dataDir, 'settings.json'),
        JSON.stringify({ version: '2.0.0' }, null, 2)
      );
      assert.deepEqual(
        fs.readdirSync(dataDir).sort(),
        ['settings.json']
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('readFrontmatterValue', () => {
  it('extracts a simple value', () => {
    const input = '---\ndescription: hello world\n---\nbody\n';
    assert.equal(readFrontmatterValue(input, 'description'), 'hello world');
  });

  it('PARSE-01: preserves colons in quoted values', () => {
    const input = '---\ndescription: "Step 1: Do this"\n---\nbody\n';
    assert.equal(readFrontmatterValue(input, 'description'), 'Step 1: Do this');
  });

  it('PARSE-01: preserves colons in unquoted values (splits on first colon only)', () => {
    const input = '---\ndescription: Scan: files\n---\n';
    assert.equal(readFrontmatterValue(input, 'description'), 'Scan: files');
  });

  it('PARSE-02: ignores body text that looks like a key line', () => {
    const input = [
      '---',
      'description: real value',
      '---',
      'Some body text.',
      'description: fake body value',
      '',
    ].join('\n');
    assert.equal(readFrontmatterValue(input, 'description'), 'real value');
  });

  it('PARSE-02: key that exists only in body returns empty string', () => {
    const input = '---\nfoo: bar\n---\ndescription: body only\n';
    assert.equal(readFrontmatterValue(input, 'description'), '');
  });

  it('PARSE-03: array-style value returned intact as string', () => {
    const input = '---\nargument-hint: [work-id, locale]\n---\n';
    assert.equal(readFrontmatterValue(input, 'argument-hint'), '[work-id, locale]');
  });

  it('PARSE-03: bracketed value containing colons is preserved', () => {
    const input = '---\ntags: [a:1, b:2]\n---\n';
    assert.equal(readFrontmatterValue(input, 'tags'), '[a:1, b:2]');
  });

  it('missing key returns empty string', () => {
    const input = '---\nother: x\n---\n';
    assert.equal(readFrontmatterValue(input, 'description'), '');
  });

  it('file without frontmatter returns empty string', () => {
    const input = '# Just a markdown file\n\ndescription: nope\n';
    assert.equal(readFrontmatterValue(input, 'description'), '');
  });

  it('empty string input returns empty string', () => {
    assert.equal(readFrontmatterValue('', 'description'), '');
  });

  it('strips wrapping double quotes', () => {
    const input = '---\ndescription: "hello"\n---\n';
    assert.equal(readFrontmatterValue(input, 'description'), 'hello');
  });

  it('strips wrapping single quotes', () => {
    const input = "---\ndescription: 'hello'\n---\n";
    assert.equal(readFrontmatterValue(input, 'description'), 'hello');
  });

  it('strips an unquoted trailing inline comment', () => {
    const input = '---\ndescription: real value # trailing note\n---\n';
    assert.equal(readFrontmatterValue(input, 'description'), 'real value');
  });

  it('preserves # inside a quoted value', () => {
    const input = '---\ndescription: "has #hash inside"\n---\n';
    assert.equal(readFrontmatterValue(input, 'description'), 'has #hash inside');
  });

  it('malformed frontmatter (no closing fence) returns empty', () => {
    const input = '---\ndescription: hello\nmore body without fence\n';
    assert.equal(readFrontmatterValue(input, 'description'), '');
  });

  it('readFrontmatterValues returns a full object with every key', () => {
    const input = [
      '---',
      'description: real value',
      'argument-hint: [work-id, locale]',
      'other: something',
      '---',
      'description: body leak',
      '',
    ].join('\n');
    const values = readFrontmatterValues(input);
    assert.equal(values.description, 'real value');
    assert.equal(values['argument-hint'], '[work-id, locale]');
    assert.equal(values.other, 'something');
    // Body content must not leak into the result
    assert.notEqual(values.description, 'body leak');
  });
});

describe('rewriteInstalledCommandRefs code-block awareness', () => {
  it('rewrites a prose reference (Codex transform)', () => {
    const input = 'See /scr:help for details';
    assert.equal(
      rewriteInstalledCommandRefs(input, commandRefToCodexInvocation),
      'See $scr-help for details'
    );
  });

  it('leaves triple-backtick code blocks unchanged byte-for-byte', () => {
    const input = TB + '\n/scr:help\n' + TB;
    assert.equal(
      rewriteInstalledCommandRefs(input, commandRefToCodexInvocation),
      input
    );
  });

  it('leaves tilde-fenced code blocks unchanged byte-for-byte', () => {
    const input = TT + '\n/scr:help\n' + TT;
    assert.equal(
      rewriteInstalledCommandRefs(input, commandRefToCodexInvocation),
      input
    );
  });

  it('mixed file: rewrites prose, preserves code blocks', () => {
    const input =
      'Run /scr:help.\n\n' +
      TB + 'bash\n/scr:help --flag\n' + TB +
      '\n\nAlso /scr:new-work.';
    const out = rewriteInstalledCommandRefs(input, commandRefToClaudeInvocation);
    // prose rewritten
    assert.ok(out.startsWith('Run /scr-help.\n\n'));
    assert.ok(out.endsWith('Also /scr-new-work.'));
    // code block preserved byte-for-byte
    const codeBlock = TB + 'bash\n/scr:help --flag\n' + TB;
    assert.ok(out.includes(codeBlock));
  });

  it('empty code block passes through unchanged', () => {
    const input = TB + '\n' + TB;
    assert.equal(
      rewriteInstalledCommandRefs(input, commandRefToCodexInvocation),
      input
    );
  });

  it('info-string fence opener (```bash) is treated as code-block opener', () => {
    const input = TB + 'bash\n/scr:help\n' + TB;
    assert.equal(
      rewriteInstalledCommandRefs(input, commandRefToCodexInvocation),
      input
    );
  });

  it('consecutive code blocks separated by prose still rewrites prose', () => {
    const input =
      TB + '\n/scr:help\n' + TB +
      '\nHello /scr:help world.\n' +
      TB + 'js\n/scr:help\n' + TB;
    const out = rewriteInstalledCommandRefs(input, commandRefToCodexInvocation);
    assert.ok(out.includes('Hello $scr-help world.'));
    // First code block preserved
    assert.ok(out.includes(TB + '\n/scr:help\n' + TB));
    // Second code block preserved
    assert.ok(out.includes(TB + 'js\n/scr:help\n' + TB));
  });

  it('indented (4-space) lines are NOT treated as code blocks (out of scope)', () => {
    const input = '    /scr:help\nand /scr:help in prose';
    const out = rewriteInstalledCommandRefs(input, commandRefToCodexInvocation);
    // Both should be rewritten since we only handle fenced blocks
    assert.equal(out, '    $scr-help\nand $scr-help in prose');
  });

  it('unterminated fence: rest of file is treated as code (fail-safe)', () => {
    const input = 'prose /scr:help\n' + TB + '\n/scr:help\nno closing fence here';
    const out = rewriteInstalledCommandRefs(input, commandRefToCodexInvocation);
    // leading prose is rewritten
    assert.ok(out.startsWith('prose $scr-help\n'));
    // everything after opener is preserved
    assert.ok(out.endsWith(TB + '\n/scr:help\nno closing fence here'));
  });

  it('mixed fences do not close each other (``` opens, ~~~ does not close)', () => {
    const input = TB + '\n/scr:help\n' + TT + '\n/scr:help\n' + TB;
    // Everything between the ``` opener and ``` closer is code
    assert.equal(
      rewriteInstalledCommandRefs(input, commandRefToCodexInvocation),
      input
    );
  });
});

describe('generateCodexCommandContent', () => {
  it('rewrites prose /scr:help to $scr-help and inserts codex marker', () => {
    const entry = {
      commandRef: '/scr:help',
      relativePath: 'help.md',
      skillName: 'scr-help',
      description: 'help',
      argumentHint: '',
    };
    const source = 'Run /scr:help\n\n' + TB + '\n/scr:help\n' + TB + '\n';
    const out = generateCodexCommandContent(entry, source);
    // Prose rewritten
    assert.ok(out.includes('Run $scr-help'));
    // Code block preserved
    assert.ok(out.includes(TB + '\n/scr:help\n' + TB));
    // Marker present
    assert.ok(out.includes(
      '<!-- scriveno-cli-installed-command runtime:codex command:$scr-help source:help.md -->'
    ));
  });

  it('inserts marker after frontmatter when present', () => {
    const entry = {
      commandRef: '/scr:help',
      relativePath: 'help.md',
      skillName: 'scr-help',
      description: 'help',
      argumentHint: '',
    };
    const source = '---\ndescription: hi\n---\nBody /scr:help\n';
    const out = generateCodexCommandContent(entry, source);
    // Frontmatter stays first
    assert.ok(out.startsWith('---\ndescription: hi\n---\n'));
    // Marker comes immediately after frontmatter
    const afterFm = out.slice('---\ndescription: hi\n---\n'.length);
    assert.ok(afterFm.startsWith('<!-- scriveno-cli-installed-command runtime:codex'));
  });
});

describe('generateClaudeCommandContent regression (code-block aware)', () => {
  it('rewrites prose to /scr- but leaves code block /scr:help intact', () => {
    const entry = {
      commandRef: '/scr:help',
      relativePath: 'help.md',
      skillName: 'scr-help',
      description: 'help',
      argumentHint: '',
    };
    const source = 'Run /scr:help\n\n' + TB + '\n/scr:help\n' + TB + '\n';
    const out = generateClaudeCommandContent(entry, source);
    assert.ok(out.includes('Run /scr-help'));
    assert.ok(out.includes(TB + '\n/scr:help\n' + TB));
    assert.ok(out.includes(
      '<!-- scriveno-cli-installed-command runtime:claude-code command:/scr-help source:help.md -->'
    ));
  });
});

describe('installCodexRuntime rewrites command files', () => {
  const install = require('../bin/install.js');
  const PKG_ROOT = path.join(__dirname, '..');

  it('writes installed Codex command files with $scr- in prose, preserves code blocks, inserts marker', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-codex-install-'));
    const origCwd = process.cwd();
    try {
      process.chdir(tmpDir);
      const runtime = {
        ...RUNTIMES.codex,
        skills_dir_project: '.codex/skills',
        commands_dir_project: '.codex/commands/scr',
        agents_dir_project: '.codex/agents',
      };
      installCodexRuntime(runtime, false, () => {});

      const helpPath = path.join(tmpDir, '.codex/commands/scr/help.md');
      assert.ok(fs.existsSync(helpPath), 'help.md should be installed');
      const content = fs.readFileSync(helpPath, 'utf8');
      // Marker present exactly once
      const markerRe = /<!-- scriveno-cli-installed-command runtime:codex /g;
      const matches = content.match(markerRe) || [];
      assert.equal(matches.length, 1, 'marker should appear exactly once');
      assert.ok(content.includes('runtime:codex'));
      assert.ok(content.includes('command:$scr-help'));
    } finally {
      process.chdir(origCwd);
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('preserves nested command paths (sacred/concordance.md)', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-codex-nested-'));
    const origCwd = process.cwd();
    try {
      process.chdir(tmpDir);
      const runtime = {
        ...RUNTIMES.codex,
        skills_dir_project: '.codex/skills',
        commands_dir_project: '.codex/commands/scr',
        agents_dir_project: '.codex/agents',
      };
      installCodexRuntime(runtime, false, () => {});

      const sacredDir = path.join(tmpDir, '.codex/commands/scr/sacred');
      if (fs.existsSync(sacredDir)) {
        const files = fs.readdirSync(sacredDir).filter((f) => f.endsWith('.md'));
        if (files.length > 0) {
          // Pick any nested file and verify it was rewritten
          const nestedPath = path.join(sacredDir, files[0]);
          const content = fs.readFileSync(nestedPath, 'utf8');
          assert.ok(content.includes('runtime:codex'));
          // Command ref should be the full nested invocation like $scr-sacred-<name>
          const stem = files[0].replace(/\.md$/, '');
          assert.ok(
            content.includes(`command:$scr-sacred-${stem}`),
            `expected marker for $scr-sacred-${stem} in ${nestedPath}`
          );
        }
      }
    } finally {
      process.chdir(origCwd);
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('re-running the installer is idempotent (marker appears once, no tmp files)', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-codex-idem-'));
    const origCwd = process.cwd();
    try {
      process.chdir(tmpDir);
      const runtime = {
        ...RUNTIMES.codex,
        skills_dir_project: '.codex/skills',
        commands_dir_project: '.codex/commands/scr',
        agents_dir_project: '.codex/agents',
      };
      installCodexRuntime(runtime, false, () => {});
      installCodexRuntime(runtime, false, () => {});

      const helpPath = path.join(tmpDir, '.codex/commands/scr/help.md');
      const content = fs.readFileSync(helpPath, 'utf8');
      const markerRe = /<!-- scriveno-cli-installed-command runtime:codex /g;
      const matches = content.match(markerRe) || [];
      assert.equal(matches.length, 1, 'marker should appear exactly once even after re-run');

      // No .tmp. files left under .codex/commands/scr/
      const commandsRoot = path.join(tmpDir, '.codex/commands/scr');
      const leftovers = [];
      function walk(dir) {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, e.name);
          if (e.isDirectory()) walk(full);
          else if (/\.tmp\./.test(e.name)) leftovers.push(full);
        }
      }
      walk(commandsRoot);
      assert.deepEqual(leftovers, []);
    } finally {
      process.chdir(origCwd);
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('M-03: readFrontmatterValue YAML block-scalar handling', () => {
  const origWarn = console.warn;
  it('returns empty string and warns for `|` block scalar', () => {
    const warnings = [];
    console.warn = (...args) => { warnings.push(args.join(' ')); };
    try {
      const input = '---\ndescription: |\n  multi\n  line\n---\nbody\n';
      assert.equal(readFrontmatterValue(input, 'description'), '');
      assert.ok(warnings.some((w) => /block scalar/i.test(w) && /description/.test(w)),
        `expected block-scalar warning, got: ${warnings.join(' | ')}`);
    } finally {
      console.warn = origWarn;
    }
  });

  it('returns empty string and warns for `>` folded scalar', () => {
    const warnings = [];
    console.warn = (...args) => { warnings.push(args.join(' ')); };
    try {
      const input = '---\ndescription: >\n  folded\n---\n';
      assert.equal(readFrontmatterValue(input, 'description'), '');
      assert.ok(warnings.some((w) => /block scalar/i.test(w)));
    } finally {
      console.warn = origWarn;
    }
  });

  it('does NOT treat `>` inside a quoted value as a block scalar', () => {
    const input = '---\ndescription: "> quoted angle"\n---\n';
    assert.equal(readFrontmatterValue(input, 'description'), '> quoted angle');
  });
});

describe('L-02: readFrontmatterValues duplicate-key warning', () => {
  const origWarn = console.warn;
  it('warns on duplicate keys but retains first occurrence', () => {
    const warnings = [];
    console.warn = (...args) => { warnings.push(args.join(' ')); };
    try {
      const input = '---\ndescription: first\ndescription: second\n---\n';
      assert.equal(readFrontmatterValue(input, 'description'), 'first');
      assert.ok(warnings.some((w) => /duplicate key/i.test(w) && /description/.test(w)),
        `expected duplicate-key warning, got: ${warnings.join(' | ')}`);
    } finally {
      console.warn = origWarn;
    }
  });
});

describe('H-02 / M-01: copyDirWithPreservation atomic + lstat gate', () => {
  const install = require('../bin/install.js');

  it('atomic write: orphan .tmp.<uuid> from interrupted run is cleaned by sweep', () => {
    const tmpDir = mkTmp('h02-atomic');
    try {
      const src = path.join(tmpDir, 'src');
      const dest = path.join(tmpDir, 'dest');
      fs.mkdirSync(src, { recursive: true });
      fs.writeFileSync(path.join(src, 'a.txt'), 'shipped content');

      // Simulate a crash mid-copy by pre-placing an orphan tmp sibling in dest.
      fs.mkdirSync(dest, { recursive: true });
      const orphan = `a.txt.tmp.00000000-0000-0000-0000-000000000000`;
      fs.writeFileSync(path.join(dest, orphan), 'partial-garbage');

      // Run preservation copy -- the atomic write should succeed and leave no tmp siblings.
      install.copyDirWithPreservation(src, dest);

      // cleanOrphanedTempFiles would be called at install startup; verify it cleans the leftover.
      const removed = install.cleanOrphanedTempFiles(dest);
      assert.equal(removed, 1);
      assert.deepEqual(fs.readdirSync(dest).sort(), ['a.txt']);
      assert.equal(fs.readFileSync(path.join(dest, 'a.txt'), 'utf8'), 'shipped content');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('M-01: symlink dest is backed up, then replaced with shipped content', () => {
    const tmpDir = mkTmp('m01-symlink');
    try {
      const src = path.join(tmpDir, 'src');
      const dest = path.join(tmpDir, 'dest');
      const secretDir = path.join(tmpDir, 'secret');
      fs.mkdirSync(src, { recursive: true });
      fs.mkdirSync(dest, { recursive: true });
      fs.mkdirSync(secretDir, { recursive: true });
      fs.writeFileSync(path.join(src, 'a.txt'), 'shipped');
      fs.writeFileSync(path.join(secretDir, 'target.txt'), 'user secret');

      // dest/a.txt is a symlink pointing outside the install tree.
      try {
        fs.symlinkSync(path.join(secretDir, 'target.txt'), path.join(dest, 'a.txt'));
      } catch (err) {
        // Some environments (e.g. Windows without privilege) cannot create symlinks.
        // Skip gracefully -- the contract is enforced on platforms that support them.
        if (err.code === 'EPERM' || err.code === 'ENOSYS') return;
        throw err;
      }

      install.copyDirWithPreservation(src, dest);

      // dest/a.txt is now a regular file with shipped content.
      const st = fs.lstatSync(path.join(dest, 'a.txt'));
      assert.ok(st.isFile(), 'dest/a.txt must be a regular file after install');
      assert.equal(fs.readFileSync(path.join(dest, 'a.txt'), 'utf8'), 'shipped');

      // A .backup.<timestamp> sibling preserves the original symlink.
      const siblings = fs.readdirSync(dest);
      const backups = siblings.filter((n) => n.startsWith('a.txt.backup.'));
      assert.equal(backups.length, 1, `expected one backup sibling, got ${JSON.stringify(siblings)}`);

      // The user's secret outside the install tree is untouched.
      assert.equal(fs.readFileSync(path.join(secretDir, 'target.txt'), 'utf8'), 'user secret');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('M-04: writeSharedAssets migrate+validate existing settings', () => {
  const install = require('../bin/install.js');

  it('invalid existing settings.json is backed up as .invalid.<timestamp> and a fresh file is written', () => {
    const tmpDir = mkTmp('m04-invalid');
    const origCwd = process.cwd();
    try {
      process.chdir(tmpDir);
      const dataDir = path.join(tmpDir, '.scriveno');
      fs.mkdirSync(dataDir, { recursive: true });

      // Write a schema-invalid settings.json -- valid JSON but bad types.
      // Garbage user-owned fields should be dropped on the re-merge path.
      const badSettings = {
        version: 42, // wrong type (number not string)
        scope: 'galactic', // not in enum
        developer_mode: 'yes', // wrong type
        junk_field: 'should not survive',
      };
      const settingsPath = path.join(dataDir, 'settings.json');
      fs.writeFileSync(settingsPath, JSON.stringify(badSettings, null, 2));

      install.writeSharedAssets(dataDir, ['codex'], false, false, 'interactive', () => {});

      // The invalid file should be preserved as settings.json.invalid.<ts>
      const siblings = fs.readdirSync(dataDir);
      const invalids = siblings.filter((n) => n.startsWith('settings.json.invalid.'));
      assert.equal(invalids.length, 1,
        `expected one .invalid.<timestamp> backup, got: ${JSON.stringify(siblings)}`);

      // The live settings.json is the fresh shape, no junk_field leak.
      const written = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      assert.equal(written.scope, 'project');
      assert.equal(written.developer_mode, false);
      assert.equal(typeof written.version, 'string');
      assert.ok(!Object.prototype.hasOwnProperty.call(written, 'junk_field'),
        'junk_field from invalid settings must not survive re-install');
    } finally {
      process.chdir(origCwd);
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('valid existing settings.json with user fields is migrated + preserved', () => {
    const tmpDir = mkTmp('m04-valid');
    const origCwd = process.cwd();
    try {
      process.chdir(tmpDir);
      const dataDir = path.join(tmpDir, '.scriveno');

      // First install to populate the file with a valid shape.
      install.writeSharedAssets(dataDir, ['codex'], false, true, 'interactive', () => {});
      const settingsPath = path.join(dataDir, 'settings.json');
      const existing = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      // Simulate user-owned addition that is not in the schema -- mergeSettings
      // retains user-owned fields; migrate+validate should treat unknown keys
      // as warnings only.
      existing.user_pref = 'keep-me';
      fs.writeFileSync(settingsPath, JSON.stringify(existing, null, 2));

      // Re-install: should not be treated as invalid.
      install.writeSharedAssets(dataDir, ['codex'], false, false, 'interactive', () => {});
      const after = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

      // No .invalid backup created
      const invalids = fs.readdirSync(dataDir).filter((n) => n.startsWith('settings.json.invalid.'));
      assert.deepEqual(invalids, []);
      // User-owned field preserved; user-owned developer_mode preserved from existing
      assert.equal(after.user_pref, 'keep-me');
      assert.equal(after.developer_mode, true);
    } finally {
      process.chdir(origCwd);
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
