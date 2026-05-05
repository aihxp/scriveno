#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const crypto = require('crypto');
const architecturalProfiles = require('../lib/architectural-profiles.js');

const PKG_ROOT = path.join(__dirname, '..');
const PKG = require('../package.json');
const VERSION = PKG.version;
const DOCS_URL = PKG.homepage || PKG.repository?.url || 'https://github.com/aihxp/scriven';
const MIN_NODE_MAJOR = 20;

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

function c(color, text) { return `${COLORS[color]}${text}${COLORS.reset}`; }
function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

// Escape a string for safe embedding inside a YAML double-quoted scalar.
// Handles both `\` and `"` — bare backslashes are invalid in YAML double-quoted
// scalars, so they must be escaped before the `"`-escaping pass.
function yamlDoubleQuoted(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildFilesystemMcpCommand(allowedDirs) {
  return `npx -y @modelcontextprotocol/server-filesystem ${allowedDirs.map(shellQuote).join(' ')}`;
}

function generatePerplexitySetupGuide({ isGlobal, guideDir, dataDir, currentProjectDir }) {
  const connectorCommand = isGlobal
    ? buildFilesystemMcpCommand(['/absolute/path/to/project', dataDir])
    : buildFilesystemMcpCommand([currentProjectDir, dataDir]);
  const currentProjectCommand = buildFilesystemMcpCommand([currentProjectDir, dataDir]);

  return `# Scriven for Perplexity Desktop

This setup target prepares Scriven for **Perplexity Desktop on macOS** using Perplexity's documented **local MCP connector** flow.

## What this target supports

- Guided setup assets for Perplexity Desktop
- Local filesystem access to a Scriven project and Scriven's shared data
- Honest runtime framing: this is **not** slash-command parity with Claude Code, Codex, Cursor, or Gemini CLI

## Prerequisites

1. Install **Perplexity Desktop** from the Mac App Store
2. In Perplexity Desktop, open **Settings -> Connectors**
3. Install the **PerplexityXPC** helper when prompted
4. Ensure Node.js 20+ is available so \`npx\` can run the filesystem MCP server

## Add the connector

In Perplexity Desktop:

1. Open **Settings -> Connectors**
2. Click **Add Connector**
3. In the **Simple** tab, choose any server name such as \`Scriven Project Files\`
4. Paste this command:

\`\`\`bash
${connectorCommand}
\`\`\`

5. Save and wait for the connector to show **Running**
6. Toggle the connector on from **Sources** when you want Perplexity to access your Scriven files

## Current project command

This installer was run from:

\`\`\`
${currentProjectDir}
\`\`\`

If you want a command that is ready for this specific project right now, use:

\`\`\`bash
${currentProjectCommand}
\`\`\`

## Notes

- ${isGlobal ? 'Global install stores shared setup assets under your home directory, but the MCP connector itself still needs a project path.' : 'Project install points the connector at this project and its local .scriven directory.'}
- Keep the allowed directories narrow. Prefer the project root and the matching Scriven data directory only.
- Voice-critical drafting still depends on explicit \`STYLE-GUIDE.md\` loading per unit. Perplexity memory or spaces are not a substitute for Scriven's Voice DNA pipeline.

## Installed assets

- Guide directory: \`${guideDir}\`
- Scriven data directory: \`${dataDir}\`
`;
}

const BANNER = `
${c('bold', 'Scriven')} ${c('gray', 'v' + VERSION)}
${c('dim', 'Spec-driven creative writing, publishing, and translation for AI coding agents.')}
`;

const RUNTIME_SUPPORT_NOTE = c(
  'dim',
  'Installer requires Node.js 20+. The runtimes below are installer targets with varying support evidence.'
);

const RUNTIMES = {
  'claude-code': {
    label: 'Claude Code',
    type: 'commands',
    commands_dir_global: path.join(os.homedir(), '.claude', 'commands'),
    commands_dir_project: '.claude/commands',
    agents_dir_global: path.join(os.homedir(), '.claude', 'agents'),
    agents_dir_project: '.claude/agents',
    command_layout: 'flat-prefixed',
    detect: () => fs.existsSync(path.join(os.homedir(), '.claude')),
  },
  'cursor': {
    label: 'Cursor',
    type: 'commands',
    commands_dir_global: path.join(os.homedir(), '.cursor', 'commands', 'scr'),
    commands_dir_project: '.cursor/commands/scr',
    agents_dir_global: path.join(os.homedir(), '.cursor', 'agents'),
    agents_dir_project: '.cursor/agents',
    detect: () => fs.existsSync(path.join(os.homedir(), '.cursor')),
  },
  'gemini-cli': {
    label: 'Gemini CLI',
    type: 'commands',
    commands_dir_global: path.join(os.homedir(), '.gemini', 'commands', 'scr'),
    commands_dir_project: '.gemini/commands/scr',
    agents_dir_global: path.join(os.homedir(), '.gemini', 'agents'),
    agents_dir_project: '.gemini/agents',
    detect: () => fs.existsSync(path.join(os.homedir(), '.gemini')),
  },
  'codex': {
    label: 'Codex',
    type: 'skills',
    skills_dir_global: path.join(os.homedir(), '.codex', 'skills'),
    skills_dir_project: '.codex/skills',
    commands_dir_global: path.join(os.homedir(), '.codex', 'commands', 'scr'),
    commands_dir_project: '.codex/commands/scr',
    agents_dir_global: path.join(os.homedir(), '.codex', 'agents'),
    agents_dir_project: '.codex/agents',
    skill_style: 'per-command',
    detect: () => fs.existsSync(path.join(os.homedir(), '.codex')),
  },
  'opencode': {
    label: 'OpenCode',
    type: 'commands',
    commands_dir_global: path.join(os.homedir(), '.config', 'opencode', 'commands', 'scr'),
    commands_dir_project: '.config/opencode/commands/scr',
    agents_dir_global: path.join(os.homedir(), '.config', 'opencode', 'agents'),
    agents_dir_project: '.config/opencode/agents',
    detect: () => fs.existsSync(path.join(os.homedir(), '.config', 'opencode')),
  },
  'copilot': {
    label: 'GitHub Copilot',
    type: 'commands',
    commands_dir_global: path.join(os.homedir(), '.github', 'commands', 'scr'),
    commands_dir_project: '.github/commands/scr',
    agents_dir_global: path.join(os.homedir(), '.github', 'agents'),
    agents_dir_project: '.github/agents',
    detect: () => fs.existsSync(path.join(os.homedir(), '.github')),
  },
  'windsurf': {
    label: 'Windsurf',
    type: 'commands',
    commands_dir_global: path.join(os.homedir(), '.windsurf', 'commands', 'scr'),
    commands_dir_project: '.windsurf/commands/scr',
    agents_dir_global: path.join(os.homedir(), '.windsurf', 'agents'),
    agents_dir_project: '.windsurf/agents',
    detect: () => fs.existsSync(path.join(os.homedir(), '.windsurf')),
  },
  'antigravity': {
    label: 'Antigravity',
    type: 'commands',
    commands_dir_global: path.join(os.homedir(), '.gemini', 'antigravity', 'commands', 'scr'),
    commands_dir_project: '.gemini/antigravity/commands/scr',
    agents_dir_global: path.join(os.homedir(), '.gemini', 'antigravity', 'agents'),
    agents_dir_project: '.gemini/antigravity/agents',
    detect: () => fs.existsSync(path.join(os.homedir(), '.gemini', 'antigravity')),
  },
  'manus': {
    label: 'Manus Desktop',
    type: 'skills',
    skills_dir_global: path.join(os.homedir(), '.manus', 'skills', 'scriven'),
    skills_dir_project: '.manus/skills/scriven',
    detect: () => fs.existsSync(path.join(os.homedir(), '.manus')) || fs.existsSync('/Applications/Manus.app') || fs.existsSync(path.join(os.homedir(), 'Applications', 'Manus.app')),
  },
  'perplexity-desktop': {
    label: 'Perplexity Desktop',
    type: 'guided-mcp',
    guide_dir_global: path.join(os.homedir(), '.scriven', 'perplexity'),
    guide_dir_project: '.scriven/perplexity',
    detect: () => fs.existsSync('/Applications/Perplexity.app') || fs.existsSync(path.join(os.homedir(), 'Applications', 'Perplexity.app')),
  },
  'generic': {
    label: 'Generic (SKILL.md)',
    type: 'skills',
    skills_dir_global: path.join(os.homedir(), '.scriven', 'skills'),
    skills_dir_project: '.scriven/skills',
    detect: () => false,
  },
};

function generateSkillManifest(constraintsPath) {
  const commandsRoot = path.join(PKG_ROOT, 'commands', 'scr');
  const entries = collectCanonicalCommandInventory(commandsRoot, constraintsPath).map((entry) => ({
    name: entry.commandRef,
    category: entry.category,
    description: entry.description,
  }));

  // Sort by category, then alphabetically by name within category
  entries.sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return a.name.localeCompare(b.name);
  });

  // Build markdown table
  const tableRows = entries.map(e => `| ${e.name} | ${e.category} | ${e.description} |`);

  return `# Scriven — AI Creative Writing Skills

Version: ${VERSION}

Scriven is a spec-driven creative writing, publishing, and translation pipeline.

## Available Commands

| Command | Category | Description |
|---------|----------|-------------|
${tableRows.join('\n')}

## Usage

Each command above has a detailed instruction file in the \`commands/scr/\` subdirectory.
To use a command, read the corresponding \`.md\` file and follow its instructions.

## Quick Start

1. Run \`/scr:help\` to see commands grouped by stage
2. Run \`/scr:new-work\` to start a new project
3. Run \`/scr:demo\` to explore a sample project
`;
}

function stripWrappingQuotes(value) {
  if (!value) return '';
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith('\'') && trimmed.endsWith('\''))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function extractFrontmatterBlock(content) {
  if (typeof content !== 'string' || content.length === 0) return null;
  // Strip a leading UTF-8 BOM if present so the first-line check is robust.
  const stripped = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
  const lines = stripped.split(/\r?\n/);
  if (lines.length === 0 || lines[0] !== '---') return null;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---' || lines[i] === '...') {
      return lines.slice(1, i);
    }
  }
  // No closing fence — treat as malformed / no frontmatter.
  return null;
}

function stripInlineComment(rawValue) {
  const trimmedLeading = rawValue.replace(/^\s+/, '');
  if (trimmedLeading.startsWith('"') || trimmedLeading.startsWith('\'')) {
    // Preserve `#` inside quoted values; do not attempt to parse quote escaping beyond
    // the simple wrapping-quote behavior already handled by stripWrappingQuotes.
    return rawValue;
  }
  // YAML inline comments require whitespace before `#`.
  // Use [ \t] rather than \s so newline whitespace does not trigger truncation
  // if a multi-line string is ever fed in (defensive for future refactors).
  const idx = rawValue.search(/[ \t]#/);
  if (idx === -1) return rawValue;
  return rawValue.slice(0, idx);
}

function readFrontmatterValues(content) {
  const lines = extractFrontmatterBlock(content);
  const result = {};
  if (!lines) return result;

  for (const line of lines) {
    if (line.length === 0) continue;
    const leading = line.replace(/^\s+/, '');
    if (leading.length === 0) continue;
    if (leading.startsWith('#')) continue; // YAML comment line

    const idx = line.indexOf(':');
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    if (!key) continue;
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      // L-02: warn on duplicate keys; we retain first-occurrence-wins to avoid
      // changing downstream behavior, but surface the edit bug.
      try {
        console.warn(
          `[scriven] frontmatter duplicate key "${key}" — first occurrence retained; later value ignored`
        );
      } catch { /* best effort */ }
      continue;
    }

    let value = line.slice(idx + 1);
    value = stripInlineComment(value);
    // M-03: detect YAML block-scalar indicators (| or >). The parser does not
    // support multi-line continuation; warn and fall back to an empty value so
    // Codex skill metadata does not ship a literal `|` / `>`.
    const leadingValue = value.replace(/^\s+/, '');
    if (leadingValue.startsWith('|') || leadingValue.startsWith('>')) {
      try {
        console.warn(
          `[scriven] frontmatter key "${key}" uses a YAML block scalar (${leadingValue[0]}); falling back to empty value`
        );
      } catch { /* best effort */ }
      result[key] = '';
      continue;
    }
    value = stripWrappingQuotes(value);
    result[key] = value;
  }

  return result;
}

function readFrontmatterValue(content, key) {
  const values = readFrontmatterValues(content);
  return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : '';
}

function commandRefToCodexSkillName(commandRef) {
  return commandRef
    .replace(/^\/scr:/, 'scr-')
    .replace(/:/g, '-');
}

function commandRefToConstraintKey(commandRef) {
  return commandRef
    .replace(/^\/scr:/, '')
    .split(':')
    .pop();
}

function commandRefToClaudeInvocation(commandRef) {
  return `/${commandRefToCodexSkillName(commandRef)}`;
}

function commandRefToCodexInvocation(commandRef) {
  return `$${commandRefToCodexSkillName(commandRef)}`;
}

function commandEntryToFlatCommandFileName(entry) {
  return `${commandRefToCodexSkillName(entry.commandRef)}.md`;
}

function collectCommandEntries(commandsRoot) {
  const entries = [];

  function walk(dir, segments = []) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), segments.concat(entry.name));
        continue;
      }
      if (!entry.name.endsWith('.md')) continue;

      const relSegments = segments.concat(entry.name.replace(/\.md$/, ''));
      const relPath = path.join(...segments, entry.name);
      const filePath = path.join(dir, entry.name);
      const content = fs.readFileSync(filePath, 'utf8');
      const commandTail = relSegments.join(':');
      const commandRef = `/scr:${commandTail}`;
      const description = readFrontmatterValue(content, 'description') || commandTail.replace(/[:\-]/g, ' ');
      const argumentHint = readFrontmatterValue(content, 'argument-hint');

      entries.push({
        commandRef,
        skillName: commandRefToCodexSkillName(commandRef),
        description,
        argumentHint,
        relativePath: relPath,
      });
    }
  }

  walk(commandsRoot);
  entries.sort((a, b) => a.commandRef.localeCompare(b.commandRef));
  return entries;
}

function collectCanonicalCommandInventory(commandsRoot, constraintsPath = path.join(PKG_ROOT, 'data', 'CONSTRAINTS.json')) {
  const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
  const commandMetadata = constraints.commands || {};

  return collectCommandEntries(commandsRoot).map((entry) => {
    const key = commandRefToConstraintKey(entry.commandRef);
    const metadata = commandMetadata[key] || {};
    return {
      ...entry,
      category: metadata.category || 'uncategorized',
      description: metadata.description || entry.description || key.replace(/-/g, ' '),
    };
  });
}

function generateCodexSkill(entry, commandPath) {
  const invocation = commandRefToCodexInvocation(entry.commandRef);
  const shortDescription = entry.description.length > 120
    ? `${entry.description.slice(0, 117)}...`
    : entry.description;
  const argumentsLine = entry.argumentHint
    ? `- Treat any text after \`${invocation}\` as the arguments for the underlying Scriven command ${entry.argumentHint}.`
    : `- Treat any text after \`${invocation}\` as the arguments for the underlying Scriven command.`;

  return `---
name: "${entry.skillName}"
description: "${yamlDoubleQuoted(entry.description)}"
metadata:
  short-description: "${yamlDoubleQuoted(shortDescription)}"
---

<codex_skill_adapter>
## Invocation
- This skill is invoked by mentioning \`${invocation}\`.
${argumentsLine}
- When the installed Scriven command file mentions \`/scr:...\`, rewrite that command surface for Codex users as \`$scr-...\`.
  - Example: \`/scr:help\` becomes \`$scr-help\`
  - Example: \`/scr:new-work\` becomes \`$scr-new-work\`
  - Example: \`/scr:sacred:concordance\` becomes \`$scr-sacred-concordance\`
</codex_skill_adapter>

<objective>
Execute Scriven's \`${entry.commandRef}\` command inside Codex by reading the installed Scriven command file below as the source of truth.
</objective>

<context>
Installed command file: ${commandPath}
</context>

<process>
1. Read \`${commandPath}\`.
2. Execute that command file exactly as written.
3. Treat text after \`${invocation}\` as the command arguments.
4. When suggesting other Scriven commands to Codex users, translate \`/scr:...\` references to the \`$scr-...\` surface.
</process>
`;
}

function listRelativeFiles(dir, prefix = '') {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(prefix, entry.name);
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listRelativeFiles(abs, rel));
    } else {
      files.push(rel);
    }
  }
  return files;
}

function cleanMirroredFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir) || !fs.existsSync(destDir)) return 0;
  let removed = 0;
  for (const relPath of listRelativeFiles(srcDir)) {
    const destPath = path.join(destDir, relPath);
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { force: true });
      removed++;
    }
  }
  return removed;
}

function removePathIfExists(targetPath) {
  if (!fs.existsSync(targetPath)) return false;
  fs.rmSync(targetPath, { recursive: true, force: true });
  return true;
}

function atomicWriteFileSync(targetPath, content) {
  const dir = path.dirname(targetPath);
  fs.mkdirSync(dir, { recursive: true });
  const tmpPath = `${targetPath}.tmp.${crypto.randomUUID()}`;
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(String(content));
  let fd;
  try {
    fd = fs.openSync(tmpPath, 'w');
    fs.writeSync(fd, buffer, 0, buffer.length, 0);
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = undefined;
    fs.renameSync(tmpPath, targetPath);
    // H-01: fsync the parent directory so the rename is durable on crash.
    // Best effort — Windows rejects dir fsync with EISDIR/EPERM; some network
    // filesystems also reject it. Swallow any error to preserve existing
    // cross-platform behavior.
    try {
      const dfd = fs.openSync(dir, 'r');
      try { fs.fsyncSync(dfd); } finally { fs.closeSync(dfd); }
    } catch { /* best effort — Windows rejects dir fsync */ }
  } catch (err) {
    if (fd !== undefined) {
      try { fs.closeSync(fd); } catch { /* best effort */ }
    }
    try { fs.unlinkSync(tmpPath); } catch { /* best effort */ }
    throw err;
  }
}

// L-01: match the exact canonical UUID shape emitted by crypto.randomUUID(),
// so a user file incidentally named `foo.tmp.<36 dashes>` is NOT deleted.
const ORPHAN_TMP_PATTERN = /\.tmp\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// M-02: orphan tmp files can sit deep in skill directories (e.g.
// `~/.codex/skills/scr-help/SKILL.md.tmp.<uuid>`). Sweep recursively with a
// depth cap so an adversarial / pathological tree cannot hang the installer.
const ORPHAN_SWEEP_MAX_DEPTH = 4;

function cleanOrphanedTempFiles(dir, _depth = 0) {
  if (!fs.existsSync(dir)) return 0;
  let removed = 0;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (_depth < ORPHAN_SWEEP_MAX_DEPTH) {
        removed += cleanOrphanedTempFiles(full, _depth + 1);
      }
      continue;
    }
    if (!entry.isFile()) continue;
    if (!ORPHAN_TMP_PATTERN.test(entry.name)) continue;
    try {
      fs.unlinkSync(full);
      removed++;
    } catch { /* best effort */ }
  }
  return removed;
}

function insertMarkerComment(content, comment) {
  if (content.startsWith('---\n')) {
    const frontmatterEnd = content.indexOf('\n---\n', 4);
    if (frontmatterEnd !== -1) {
      const insertAt = frontmatterEnd + '\n---\n'.length;
      return `${content.slice(0, insertAt)}${comment}\n${content.slice(insertAt)}`;
    }
  }
  return `${comment}\n${content}`;
}

// Code-block-aware rewriter.
//
// Splits content into an ordered sequence of prose/code segments using
// CommonMark-ish fenced code block rules, then applies `transform` only to
// `/scr:*` references in prose. Code segments (including the fence lines)
// pass through byte-for-byte unchanged.
//
// Fence rules:
//   - An opener is a line whose first non-whitespace content matches `^(?:`{3,}|~{3,})`.
//   - A closer is a subsequent line whose first non-whitespace content is the
//     SAME fence character repeated at least as many times as the opener.
//     (`\`\`\`` does not close a `~~~` block and vice versa.)
//   - If a code block has no closer before EOF, the remainder of the file is
//     treated as code (fail-safe: prefer under-rewriting over mangling code).
//
// Indented (4-space / tab) code blocks are NOT detected — only fenced blocks.
// This is intentional per Phase 27 CONTEXT: documentation snippets use fences.
function rewriteInstalledCommandRefs(content, transform) {
  if (typeof content !== 'string' || content.length === 0) return content;

  // Preserve original line endings by splitting on \r?\n but also tracking
  // the separators. Simpler approach: split into lines and remember whether
  // the original ended with a trailing newline so we can reconstruct.
  const lines = content.split(/\n/);
  // Note: because we split on /\n/, any \r is preserved at the end of each
  // non-final line. We re-join with \n and the \r stays attached, preserving
  // CRLF round-trip.

  const out = [];
  let i = 0;
  const FENCE_RE = /^(\s*)(`{3,}|~{3,})/;

  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(FENCE_RE);
    if (!m) {
      // prose line
      out.push(line.replace(/\/scr:[a-z0-9:-]+/gi, (ref) => transform(ref)));
      i++;
      continue;
    }
    // Opener: emit as-is, then consume until matching closer or EOF.
    const fenceChar = m[2][0]; // '`' or '~'
    const fenceLen = m[2].length;
    out.push(line);
    i++;
    while (i < lines.length) {
      const inner = lines[i];
      const mc = inner.match(FENCE_RE);
      if (mc && mc[2][0] === fenceChar && mc[2].length >= fenceLen) {
        // closer — emit and exit code block
        out.push(inner);
        i++;
        break;
      }
      // still inside code block — emit verbatim
      out.push(inner);
      i++;
    }
    // If we fell out of the loop with no closer (i === lines.length without
    // seeing a matching closer), the code block implicitly extends to EOF —
    // the trailing lines were already pushed verbatim above.
  }

  return out.join('\n');
}

function markInstalledCommand(content, runtimeKey, commandRef, sourcePath) {
  const marker = `<!-- scriven-cli-installed-command runtime:${runtimeKey} command:${commandRef} source:${sourcePath} -->`;
  return insertMarkerComment(content, marker);
}

function generateClaudeCommandContent(entry, sourceContent) {
  const rewritten = rewriteInstalledCommandRefs(sourceContent, commandRefToClaudeInvocation);
  return markInstalledCommand(rewritten, 'claude-code', commandRefToClaudeInvocation(entry.commandRef), entry.relativePath);
}

function generateCodexCommandContent(entry, sourceContent) {
  const rewritten = rewriteInstalledCommandRefs(sourceContent, commandRefToCodexInvocation);
  return markInstalledCommand(
    rewritten,
    'codex',
    commandRefToCodexInvocation(entry.commandRef),
    entry.relativePath
  );
}

function isScrivenInstalledCommandFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes('scriven-cli-installed-command');
}

function cleanFlatCommandFiles(commandsDir, currentFileNames, legacyDirs = []) {
  if (!fs.existsSync(commandsDir)) return 0;

  const manifestPath = path.join(commandsDir, '.scriven-installed.json');
  const manifest = readJsonIfExists(manifestPath);
  const currentFileSet = new Set(currentFileNames);
  const knownFileNames = new Set(Array.isArray(manifest?.files) ? manifest.files : []);
  let removed = 0;

  for (const entry of fs.readdirSync(commandsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const filePath = path.join(commandsDir, entry.name);
    if (isScrivenInstalledCommandFile(filePath)) {
      knownFileNames.add(entry.name);
    }
  }

  removePathIfExists(manifestPath);

  for (const legacyDir of legacyDirs) {
    if (removePathIfExists(path.join(commandsDir, legacyDir))) {
      removed++;
    }
  }

  for (const fileName of knownFileNames) {
    if (!currentFileSet.has(fileName) && removePathIfExists(path.join(commandsDir, fileName))) {
      removed++;
    }
  }

  for (const fileName of currentFileNames) {
    if (removePathIfExists(path.join(commandsDir, fileName))) {
      removed++;
    }
  }

  return removed;
}

function writeInstalledCommandManifest(commandsDir, runtimeKey, fileNames) {
  const manifestPath = path.join(commandsDir, '.scriven-installed.json');
  const manifest = {
    installer: 'scriven-cli',
    version: VERSION,
    runtime: runtimeKey,
    files: fileNames,
    generated_at: new Date().toISOString(),
  };
  atomicWriteFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

function printHelp() {
  console.log(BANNER);
  console.log(`Usage:
  scriven
  scriven --runtimes codex,claude-code --global --writer --silent

Options:
  --runtimes <list>   Comma-separated runtime keys to install (for example: codex,claude-code)
  --runtime <key>     Repeatable single-runtime selector
  --detected          Install to every detected runtime
  --global            Install for all projects (default)
  --project           Install only in the current directory
  --writer            Use writer mode (default)
  --developer         Use developer mode
  --silent            Skip prompts and reduce output
  --help              Show this help text
  --version           Show the Scriven package version

Runtime keys:
  ${Object.keys(RUNTIMES).join(', ')}
`);
}

function parseArgs(argv) {
  const options = {
    runtimeKeys: [],
    installDetected: false,
    isGlobal: null,
    developerMode: null,
    silent: false,
    showHelp: false,
    showVersion: false,
  };

  function addRuntimeList(value) {
    for (const key of String(value).split(',').map((item) => item.trim()).filter(Boolean)) {
      if (!Object.prototype.hasOwnProperty.call(RUNTIMES, key)) {
        throw new Error(`Unknown runtime "${key}". Expected one of: ${Object.keys(RUNTIMES).join(', ')}`);
      }
      if (!options.runtimeKeys.includes(key)) {
        options.runtimeKeys.push(key);
      }
    }
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      options.showHelp = true;
    } else if (arg === '--version' || arg === '-v') {
      options.showVersion = true;
    } else if (arg === '--silent' || arg === '--yes') {
      options.silent = true;
    } else if (arg === '--detected') {
      options.installDetected = true;
    } else if (arg === '--global') {
      options.isGlobal = true;
    } else if (arg === '--project') {
      options.isGlobal = false;
    } else if (arg === '--writer') {
      options.developerMode = false;
    } else if (arg === '--developer') {
      options.developerMode = true;
    } else if (arg === '--runtime') {
      const value = argv[i + 1];
      if (!value) throw new Error('--runtime requires a value');
      addRuntimeList(value);
      i++;
    } else if (arg.startsWith('--runtime=')) {
      addRuntimeList(arg.slice('--runtime='.length));
    } else if (arg === '--runtimes') {
      const value = argv[i + 1];
      if (!value) throw new Error('--runtimes requires a value');
      addRuntimeList(value);
      i++;
    } else if (arg.startsWith('--runtimes=')) {
      addRuntimeList(arg.slice('--runtimes='.length));
    } else {
      throw new Error(`Unknown argument "${arg}"`);
    }
  }

  return options;
}

function resolveInstallRequest(parsed, detectedRuntimeKeys, { isTTY }) {
  const hasRuntimeDirective = parsed.runtimeKeys.length > 0 || parsed.installDetected;
  const hasModifierOverrides = parsed.isGlobal !== null || parsed.developerMode !== null;

  if (!isTTY && !hasRuntimeDirective) {
    return {
      action: 'usage_error',
      message: 'Non-interactive use requires --runtimes <list> or --detected.',
    };
  }

  if (parsed.silent && !hasRuntimeDirective) {
    return {
      action: 'usage_error',
      message: 'Silent installs require --runtimes <list>, --runtime <key>, or --detected.',
    };
  }

  if (hasRuntimeDirective) {
    return {
      action: 'install',
      runtimeKeys: parsed.runtimeKeys.length > 0
        ? parsed.runtimeKeys
        : detectedRuntimeKeys,
      isGlobal: parsed.isGlobal ?? true,
      developerMode: parsed.developerMode ?? false,
      silent: parsed.silent,
      installMode: 'non-interactive',
    };
  }

  return {
    action: 'interactive',
    isGlobal: parsed.isGlobal,
    developerMode: parsed.developerMode,
    hasModifierOverrides,
  };
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function requireSupportedNode() {
  const major = Number.parseInt(process.versions.node.split('.')[0], 10);
  if (!Number.isInteger(major) || major < MIN_NODE_MAJOR) {
    console.error(c('red', `Scriven's installer requires Node.js 20+. You are running ${process.versions.node}.`));
    console.error(c('dim', 'See the repository README for the full runtime support matrix and current installer guidance.'));
    process.exit(1);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return 0;
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

function sha256File(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(buf).digest('hex');
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

function copyDirWithPreservation(src, dest, options = {}) {
  const timestamp = options.timestamp || new Date().toISOString().replace(/[:.]/g, '-');
  const result = { fresh: 0, replaced: 0, backedUp: 0 };
  if (!fs.existsSync(src)) return result;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      const sub = copyDirWithPreservation(srcPath, destPath, { ...options, timestamp });
      result.fresh += sub.fresh;
      result.replaced += sub.replaced;
      result.backedUp += sub.backedUp;
      continue;
    }
    // H-02 + M-01: use lstat on the destination so we can (a) detect
    // non-regular-file dests (symlinks, sockets, FIFOs) and refuse to hash
    // through them, and (b) route the final write through atomicWriteFileSync
    // so a crash mid-copy cannot leave destPath truncated.
    let destStat = null;
    try {
      destStat = fs.lstatSync(destPath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    // Read the source buffer once — used for both hashing and the atomic write.
    const srcBuf = fs.readFileSync(srcPath);

    if (destStat === null) {
      // No existing dest — fresh write.
      atomicWriteFileSync(destPath, srcBuf);
      result.fresh++;
      continue;
    }

    if (!destStat.isFile()) {
      // M-01: dest is a symlink / socket / directory-named-like-a-file /
      // anything non-regular. Treat it as "modified" and back it up before
      // installing the shipped template. Removing the non-regular entry via
      // rename preserves the user's data under a .backup.<timestamp> sibling.
      const backupPath = `${destPath}.backup.${timestamp}`;
      try {
        fs.renameSync(destPath, backupPath);
      } catch {
        // Fall back to unlink — renameSync can fail across some boundaries.
        try { fs.unlinkSync(destPath); } catch { /* best effort */ }
      }
      atomicWriteFileSync(destPath, srcBuf);
      result.backedUp++;
      continue;
    }

    const destHash = sha256File(destPath);
    const srcHash = crypto.createHash('sha256').update(srcBuf).digest('hex');
    if (srcHash === destHash) {
      // Identical content — rewrite atomically so an interrupted run still
      // leaves a complete file (no partial-write window).
      atomicWriteFileSync(destPath, srcBuf);
      result.replaced++;
    } else {
      const backupPath = `${destPath}.backup.${timestamp}`;
      fs.renameSync(destPath, backupPath);
      atomicWriteFileSync(destPath, srcBuf);
      result.backedUp++;
    }
  }
  return result;
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

// I-01: tag ownership on schema entries and derive INSTALLER_OWNED_FIELDS from
// the schema so a future contributor cannot forget to classify a new field.
// `developer_mode` is the only user-owned field today; everything else is
// installer-owned (matches prior INSTALLER_OWNED_FIELDS list exactly).
const SETTINGS_SCHEMA = [
  { name: 'version', type: 'string', required: true, owned_by: 'installer' },
  { name: 'runtime', type: 'string', required: true, allow_empty: true, owned_by: 'installer' },
  { name: 'runtimes', type: 'array-of-string', required: true, owned_by: 'installer' },
  { name: 'scope', type: 'string', required: true, enum: ['global', 'project'], owned_by: 'installer' },
  { name: 'developer_mode', type: 'boolean', required: true, owned_by: 'user' },
  { name: 'data_dir', type: 'string', required: true, owned_by: 'installer' },
  { name: 'install_mode', type: 'string', required: true, enum: ['interactive', 'non-interactive'], owned_by: 'installer' },
  { name: 'installed_at', type: 'string', required: true, owned_by: 'installer' },
];

const INSTALLER_OWNED_FIELDS = SETTINGS_SCHEMA
  .filter((f) => f.owned_by === 'installer')
  .map((f) => f.name);

function mergeSettings(existing, incoming, _schema = SETTINGS_SCHEMA) {
  const merged = { ...incoming };
  if (!existing || typeof existing !== 'object' || Array.isArray(existing)) return merged;
  for (const [key, value] of Object.entries(existing)) {
    if (INSTALLER_OWNED_FIELDS.includes(key)) continue;
    merged[key] = value;
  }
  return merged;
}

function migrateSettings(raw) {
  if (raw == null) return null;
  const out = { ...raw };
  if (!Object.prototype.hasOwnProperty.call(out, 'runtimes') || out.runtimes === undefined) {
    if (typeof out.runtime === 'string' && out.runtime.length > 0) {
      out.runtimes = [out.runtime];
    } else {
      out.runtimes = [];
    }
  }
  if (!Object.prototype.hasOwnProperty.call(out, 'scope') || out.scope === undefined) {
    out.scope = 'global';
  }
  if (!Object.prototype.hasOwnProperty.call(out, 'install_mode') || out.install_mode === undefined) {
    out.install_mode = 'interactive';
  }
  return out;
}

function describeActualType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function validateSettings(settings) {
  const errors = [];
  if (settings === null || typeof settings !== 'object' || Array.isArray(settings)) {
    return {
      valid: false,
      errors: [`settings: expected object, received ${describeActualType(settings)}`],
    };
  }

  const schemaFieldNames = new Set(SETTINGS_SCHEMA.map((f) => f.name));
  let hardErrorCount = 0;

  for (const field of SETTINGS_SCHEMA) {
    const hasKey = Object.prototype.hasOwnProperty.call(settings, field.name);
    if (!hasKey) {
      if (field.required) {
        errors.push(`${field.name}: required field is missing`);
        hardErrorCount++;
      }
      continue;
    }
    const value = settings[field.name];
    const actual = describeActualType(value);

    if (field.type === 'string') {
      if (typeof value !== 'string') {
        errors.push(`${field.name}: expected string, received ${actual}`);
        hardErrorCount++;
        continue;
      }
      if (!field.allow_empty && value === '') {
        errors.push(`${field.name}: expected non-empty string, received empty string`);
        hardErrorCount++;
        continue;
      }
    } else if (field.type === 'boolean') {
      if (typeof value !== 'boolean') {
        errors.push(`${field.name}: expected boolean, received ${actual}`);
        hardErrorCount++;
        continue;
      }
    } else if (field.type === 'array-of-string') {
      if (!Array.isArray(value)) {
        errors.push(`${field.name}: expected array, received ${actual}`);
        hardErrorCount++;
        continue;
      }
      const badIdx = value.findIndex((el) => typeof el !== 'string');
      if (badIdx !== -1) {
        errors.push(`${field.name}: expected array of string, received ${describeActualType(value[badIdx])} at index ${badIdx}`);
        hardErrorCount++;
        continue;
      }
    }

    if (Array.isArray(field.enum) && !field.enum.includes(value)) {
      errors.push(`${field.name}: expected one of [${field.enum.join(', ')}], received ${value}`);
      hardErrorCount++;
    }
  }

  for (const key of Object.keys(settings)) {
    if (!schemaFieldNames.has(key)) {
      errors.push(`${key}: unknown field (warning)`);
    }
  }

  return { valid: hardErrorCount === 0, errors };
}

function readSettings(dataDir) {
  const settingsPath = path.join(dataDir, 'settings.json');
  const raw = readJsonIfExists(settingsPath);
  if (raw === null) {
    throw new Error(`settings.json not found at ${settingsPath}`);
  }
  const migrated = migrateSettings(raw);
  const result = validateSettings(migrated);
  if (!result.valid) {
    const hardErrors = result.errors.filter((e) => !/\(warning\)\s*$/.test(e));
    throw new Error(`Invalid settings: ${hardErrors.join('; ')}`);
  }
  return migrated;
}

function isScrivenCodexSkillDir(skillDir) {
  const skillFile = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(skillFile)) return false;
  const content = fs.readFileSync(skillFile, 'utf8');
  return content.includes('<codex_skill_adapter>')
    && content.includes("Execute Scriven's `")
    && content.includes('Installed command file:');
}

function cleanCodexSkillDirs(skillsDir, currentSkillNames) {
  if (!fs.existsSync(skillsDir)) return 0;

  const manifestPath = path.join(skillsDir, '.scriven-installed.json');
  const manifest = readJsonIfExists(manifestPath);
  const currentSkillSet = new Set(currentSkillNames);
  const knownScrivenSkillNames = new Set(Array.isArray(manifest?.skills) ? manifest.skills : []);

  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillDir = path.join(skillsDir, entry.name);
    if (isScrivenCodexSkillDir(skillDir)) {
      knownScrivenSkillNames.add(entry.name);
    }
  }

  let removed = 0;
  removePathIfExists(path.join(skillsDir, 'scriven'));
  removePathIfExists(manifestPath);

  for (const skillName of knownScrivenSkillNames) {
    if (!currentSkillSet.has(skillName)) {
      if (removePathIfExists(path.join(skillsDir, skillName))) {
        removed++;
      }
    }
  }

  for (const skillName of currentSkillNames) {
    if (removePathIfExists(path.join(skillsDir, skillName))) {
      removed++;
    }
  }

  return removed;
}

function writeCodexSkillManifest(skillsDir, skillNames) {
  const manifestPath = path.join(skillsDir, '.scriven-installed.json');
  const manifest = {
    installer: 'scriven-cli',
    version: VERSION,
    skills: skillNames,
    generated_at: new Date().toISOString(),
  };
  atomicWriteFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.showHelp) {
    printHelp();
    return;
  }
  if (parsed.showVersion) {
    console.log(VERSION);
    return;
  }

  const detectedRuntimeKeys = Object.entries(RUNTIMES).filter(([, runtime]) => runtime.detect()).map(([key]) => key);
  const installRequest = resolveInstallRequest(parsed, detectedRuntimeKeys, { isTTY: Boolean(process.stdin.isTTY) });

  if (installRequest.action === 'usage_error') {
    printHelp();
    console.log(c('yellow', `\n${installRequest.message}`));
    process.exitCode = 1;
    return;
  }

  if (installRequest.action === 'install') {
    runInstall(installRequest);
    return;
  }

  console.log(BANNER);
  console.log(RUNTIME_SUPPORT_NOTE + '\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const runtimeKeys = Object.keys(RUNTIMES);

  console.log(c('bold', 'Select your AI coding agent:'));
  runtimeKeys.forEach((key, i) => {
    const label = RUNTIMES[key].label;
    const badge = detectedRuntimeKeys.includes(key) ? c('green', ' (detected)') : '';
    console.log(`  ${c('cyan', (i + 1) + '.')} ${label}${badge}`);
  });

  const runtimeChoice = await ask(rl, `\n${c('dim', 'Choice [1]: ')}`);
  const parsedRuntimeChoice = Number.parseInt((runtimeChoice || '1').trim(), 10);
  const validRuntimeChoice = Number.isInteger(parsedRuntimeChoice)
    && parsedRuntimeChoice >= 1
    && parsedRuntimeChoice <= runtimeKeys.length;
  if ((runtimeChoice || '').trim() && !validRuntimeChoice) {
    console.log(c('yellow', `Invalid choice "${runtimeChoice.trim()}". Defaulting to 1 (${RUNTIMES[runtimeKeys[0]].label}).`));
  }
  const runtimeKey = runtimeKeys[validRuntimeChoice ? parsedRuntimeChoice - 1 : 0];
  const runtime = RUNTIMES[runtimeKey];

  let isGlobal;
  if (installRequest.isGlobal !== null) {
    isGlobal = installRequest.isGlobal;
    console.log('\n' + c('bold', 'Install scope:'));
    console.log(`  ${c('green', '✓')} Preset via CLI flag: ${isGlobal ? 'Global' : 'Project'}`);
  } else {
    console.log('\n' + c('bold', 'Install scope:'));
    console.log(`  ${c('cyan', '1.')} Global — available in all your projects`);
    console.log(`  ${c('cyan', '2.')} Project — just this directory`);
    if (runtime.type === 'guided-mcp') {
      console.log(c('dim', '  Note: Perplexity Desktop connectors still point at specific project paths even when you choose Global scope.'));
    }
    const scopeChoice = await ask(rl, `\n${c('dim', 'Choice [1]: ')}`);
    isGlobal = (scopeChoice || '1').trim() === '1';
  }

  let developerMode;
  if (installRequest.developerMode !== null) {
    developerMode = installRequest.developerMode;
    console.log('\n' + c('bold', 'Mode:'));
    console.log(`  ${c('green', '✓')} Preset via CLI flag: ${developerMode ? 'Developer mode' : 'Writer mode'}`);
  } else {
    console.log('\n' + c('bold', 'Mode:'));
    console.log(`  ${c('cyan', '1.')} ${c('bold', 'Writer mode')} — git terminology hidden, friendly errors (default for non-developers)`);
    console.log(`  ${c('cyan', '2.')} ${c('bold', 'Developer mode')} — full git access, technical output`);
    const modeChoice = await ask(rl, `\n${c('dim', 'Choice [1]: ')}`);
    developerMode = (modeChoice || '1').trim() === '2';
  }
  rl.close();

  runInstall({
    runtimeKeys: [runtimeKey],
    isGlobal,
    developerMode,
    silent: false,
    detectedRuntimeKeys,
    installMode: 'interactive',
  });
}

function installCommandRuntime(runtime, isGlobal, log) {
  const commandsDir = isGlobal ? runtime.commands_dir_global : path.resolve(runtime.commands_dir_project);
  const agentsDir = isGlobal ? runtime.agents_dir_global : path.resolve(runtime.agents_dir_project);
  removePathIfExists(commandsDir);
  const removedAgentFiles = cleanMirroredFiles(path.join(PKG_ROOT, 'agents'), agentsDir);
  const commandCount = copyDir(path.join(PKG_ROOT, 'commands', 'scr'), commandsDir);
  const agentCount = copyDir(path.join(PKG_ROOT, 'agents'), agentsDir);
  log(`  ${c('green', '✓')} ${runtime.label}: ${commandCount} command files → ${c('dim', commandsDir)}`);
  log(`  ${c('green', '✓')} ${runtime.label}: ${agentCount} agent prompts → ${c('dim', agentsDir)}${removedAgentFiles ? c('dim', ` (cleaned ${removedAgentFiles} stale files)`) : ''}`);
}

function installClaudeCommandRuntime(runtime, isGlobal, log) {
  const commandsDir = isGlobal ? runtime.commands_dir_global : path.resolve(runtime.commands_dir_project);
  const agentsDir = isGlobal ? runtime.agents_dir_global : path.resolve(runtime.agents_dir_project);
  const commandsRoot = path.join(PKG_ROOT, 'commands', 'scr');
  const commandEntries = collectCommandEntries(commandsRoot);
  const fileNames = commandEntries.map((entry) => commandEntryToFlatCommandFileName(entry));

  fs.mkdirSync(commandsDir, { recursive: true });
  const removedCommandFiles = cleanFlatCommandFiles(commandsDir, fileNames, ['scr']);
  const removedAgentFiles = cleanMirroredFiles(path.join(PKG_ROOT, 'agents'), agentsDir);

  for (const entry of commandEntries) {
    const sourcePath = path.join(commandsRoot, entry.relativePath);
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    const fileName = commandEntryToFlatCommandFileName(entry);
    const targetPath = path.join(commandsDir, fileName);
    atomicWriteFileSync(targetPath, generateClaudeCommandContent(entry, sourceContent));
  }

  writeInstalledCommandManifest(commandsDir, 'claude-code', fileNames);
  const agentCount = copyDir(path.join(PKG_ROOT, 'agents'), agentsDir);

  log(`  ${c('green', '✓')} ${runtime.label}: ${commandEntries.length} /scr-* command files → ${c('dim', commandsDir)}${removedCommandFiles ? c('dim', ` (cleaned ${removedCommandFiles} stale items)`) : ''}`);
  log(`  ${c('green', '✓')} ${runtime.label}: ${agentCount} agent prompts → ${c('dim', agentsDir)}${removedAgentFiles ? c('dim', ` (cleaned ${removedAgentFiles} stale files)`) : ''}`);
}

function installManifestSkillRuntime(runtime, isGlobal, log) {
  const skillsDir = isGlobal ? runtime.skills_dir_global : path.resolve(runtime.skills_dir_project);
  removePathIfExists(skillsDir);
  const manifest = generateSkillManifest(path.join(PKG_ROOT, 'data', 'CONSTRAINTS.json'));
  fs.mkdirSync(skillsDir, { recursive: true });
  atomicWriteFileSync(path.join(skillsDir, 'SKILL.md'), manifest);
  const commandCount = copyDir(path.join(PKG_ROOT, 'commands', 'scr'), path.join(skillsDir, 'commands', 'scr'));
  const agentCount = copyDir(path.join(PKG_ROOT, 'agents'), path.join(skillsDir, 'agents'));
  log(`  ${c('green', '✓')} ${runtime.label}: SKILL.md manifest → ${c('dim', path.join(skillsDir, 'SKILL.md'))}`);
  log(`  ${c('green', '✓')} ${runtime.label}: ${commandCount} command files → ${c('dim', path.join(skillsDir, 'commands', 'scr'))}`);
  log(`  ${c('green', '✓')} ${runtime.label}: ${agentCount} agent prompts → ${c('dim', path.join(skillsDir, 'agents'))}`);
}

function installCodexRuntime(runtime, isGlobal, log) {
  const skillsDir = isGlobal ? runtime.skills_dir_global : path.resolve(runtime.skills_dir_project);
  const commandsDir = isGlobal ? runtime.commands_dir_global : path.resolve(runtime.commands_dir_project);
  const agentsDir = isGlobal ? runtime.agents_dir_global : path.resolve(runtime.agents_dir_project);
  const sourceCommandsRoot = path.join(PKG_ROOT, 'commands', 'scr');
  const commandEntries = collectCommandEntries(sourceCommandsRoot);
  const skillNames = commandEntries.map((entry) => entry.skillName);

  // Wipe the installed commands dir so stale files from previous installs
  // (removed commands, legacy flat layouts, etc.) do not linger.
  removePathIfExists(commandsDir);
  fs.mkdirSync(skillsDir, { recursive: true });
  const removedSkillDirs = cleanCodexSkillDirs(skillsDir, skillNames);
  const removedAgentFiles = cleanMirroredFiles(path.join(PKG_ROOT, 'agents'), agentsDir);

  // NOTE: `collectCommandEntries` returns .md files only, and the authoritative
  // `commands/scr/**` tree is .md-only today. No non-.md assets need mirroring.
  // Rewrite each command file individually for the Codex invocation surface
  // ($scr-*) using atomicWriteFileSync (Phase 23). Re-reading the pristine
  // source on every run means the install marker is inserted once against
  // clean content — not on top of a previously-marked installed file — so
  // re-runs are idempotent (single marker, current prose rewrite).
  let commandCount = 0;
  for (const entry of commandEntries) {
    const sourcePath = path.join(sourceCommandsRoot, entry.relativePath);
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    const targetPath = path.join(commandsDir, entry.relativePath);
    atomicWriteFileSync(targetPath, generateCodexCommandContent(entry, sourceContent));
    commandCount++;
  }

  const agentCount = copyDir(path.join(PKG_ROOT, 'agents'), agentsDir);

  for (const entry of commandEntries) {
    const skillDir = path.join(skillsDir, entry.skillName);
    fs.mkdirSync(skillDir, { recursive: true });
    const commandPath = path.join(commandsDir, entry.relativePath);
    atomicWriteFileSync(path.join(skillDir, 'SKILL.md'), generateCodexSkill(entry, commandPath));
  }
  writeCodexSkillManifest(skillsDir, skillNames);

  log(`  ${c('green', '✓')} ${runtime.label}: ${commandEntries.length} \$scr-* skills → ${c('dim', skillsDir)}${removedSkillDirs ? c('dim', ` (cleaned ${removedSkillDirs} stale dirs)`) : ''}`);
  log(`  ${c('green', '✓')} ${runtime.label}: ${commandCount} command files → ${c('dim', commandsDir)}`);
  log(`  ${c('green', '✓')} ${runtime.label}: ${agentCount} agent prompts → ${c('dim', agentsDir)}${removedAgentFiles ? c('dim', ` (cleaned ${removedAgentFiles} stale files)`) : ''}`);
}

function installGuidedRuntime(runtime, isGlobal, dataDir, log) {
  const guideDir = isGlobal ? runtime.guide_dir_global : path.resolve(runtime.guide_dir_project);
  const currentProjectDir = path.resolve('.');
  const setupGuide = generatePerplexitySetupGuide({
    isGlobal,
    guideDir,
    dataDir,
    currentProjectDir,
  });
  const connectorCommand = isGlobal
    ? buildFilesystemMcpCommand(['/absolute/path/to/project', dataDir])
    : buildFilesystemMcpCommand([currentProjectDir, dataDir]);
  const currentProjectCommand = buildFilesystemMcpCommand([currentProjectDir, dataDir]);

  removePathIfExists(guideDir);
  fs.mkdirSync(guideDir, { recursive: true });
  atomicWriteFileSync(path.join(guideDir, 'SETUP.md'), setupGuide);
  atomicWriteFileSync(path.join(guideDir, 'connector-command.txt'), connectorCommand + '\n');
  atomicWriteFileSync(path.join(guideDir, 'connector-command.current-project.txt'), currentProjectCommand + '\n');

  log(`  ${c('green', '✓')} ${runtime.label}: setup guide → ${c('dim', path.join(guideDir, 'SETUP.md'))}`);
  log(`  ${c('green', '✓')} ${runtime.label}: connector recipe → ${c('dim', path.join(guideDir, 'connector-command.txt'))}`);
}

function writeSharedAssets(dataDir, runtimeKeys, isGlobal, developerMode, installMode, log) {
  fs.mkdirSync(path.join(dataDir, 'templates'), { recursive: true });
  fs.mkdirSync(path.join(dataDir, 'data'), { recursive: true });
  const templateResult = copyDirWithPreservation(path.join(PKG_ROOT, 'templates'), path.join(dataDir, 'templates'));
  const dataResult = copyDirWithPreservation(path.join(PKG_ROOT, 'data'), path.join(dataDir, 'data'));
  const sum = (r) => r.fresh + r.replaced + r.backedUp;
  log(`  ${c('green', '✓')} ${sum(templateResult)} templates + ${sum(dataResult)} data files → ${c('dim', dataDir)}`);
  const totalBackedUp = templateResult.backedUp + dataResult.backedUp;
  if (totalBackedUp > 0) {
    log(`  ${c('yellow', 'i')} Preserved ${totalBackedUp} user-modified file(s) as .backup.<timestamp>`);
  }

  const settingsPath = path.join(dataDir, 'settings.json');
  // M-04: run migrate + validate on the existing file before merging so
  // hand-edited / schema-invalid / stale-format settings do not silently
  // propagate user-owned junk across installs. On invalid, back up the file
  // to `settings.json.invalid.<timestamp>` and fall back to a clean merge
  // (i.e. drop the unusable existing).
  const rawExistingSettings = readJsonIfExists(settingsPath);
  let existingSettings = null;
  if (rawExistingSettings !== null) {
    const migrated = migrateSettings(rawExistingSettings);
    const validation = validateSettings(migrated);
    if (validation.valid) {
      existingSettings = migrated;
    } else {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const invalidPath = `${settingsPath}.invalid.${ts}`;
      try {
        fs.renameSync(settingsPath, invalidPath);
        log(`  ${c('yellow', 'i')} Existing settings.json was invalid; preserved as ${c('dim', invalidPath)}`);
      } catch {
        // If rename fails, we still proceed with a fresh merge below.
      }
      existingSettings = null;
    }
  }
  const incomingSettings = {
    version: VERSION,
    runtime: runtimeKeys[0],
    runtimes: runtimeKeys,
    scope: isGlobal ? 'global' : 'project',
    developer_mode: developerMode,
    data_dir: dataDir,
    install_mode: installMode,
    installed_at: new Date().toISOString(),
  };
  const mergedSettings = mergeSettings(existingSettings, incomingSettings);
  atomicWriteFileSync(settingsPath, JSON.stringify(mergedSettings, null, 2));
  log(`  ${c('green', '✓')} settings.json → ${c('dim', settingsPath)}`);
}

function printNextSteps(runtimeKeys) {
  console.log('\n' + c('bold', 'Next steps:'));
  let step = 1;
  if (runtimeKeys.includes('codex')) {
    console.log(`  ${c('cyan', `${step}.`)} In Codex, run ${c('bold', '$scr-help')} to see available commands`);
    step++;
    console.log(`  ${c('cyan', `${step}.`)} Start with ${c('bold', '$scr-new-work')} or ${c('bold', '$scr-demo')}`);
    step++;
  }
  if (runtimeKeys.includes('claude-code')) {
    console.log(`  ${c('cyan', `${step}.`)} In Claude Code, run ${c('bold', '/scr-help')}`);
    step++;
  }
  if (runtimeKeys.some((key) => key !== 'codex' && key !== 'claude-code' && RUNTIMES[key].type !== 'guided-mcp')) {
    console.log(`  ${c('cyan', `${step}.`)} In another command-directory runtime, run ${c('bold', '/scr:help')}`);
    step++;
  }
  if (runtimeKeys.includes('perplexity-desktop')) {
    console.log(`  ${c('cyan', `${step}.`)} Open the generated Perplexity Desktop setup guide and add the connector recipe`);
  }
  console.log('\n' + c('dim', `Docs: ${DOCS_URL}\n`));
}

function collectTargetDirsForSweep(runtimeKeys, isGlobal, dataDir) {
  const dirs = new Set([dataDir]);
  for (const runtimeKey of runtimeKeys) {
    const runtime = RUNTIMES[runtimeKey];
    if (!runtime) continue;
    const resolve = (g, p) => isGlobal ? g : (p ? path.resolve(p) : null);
    if (runtime.commands_dir_global || runtime.commands_dir_project) {
      const d = resolve(runtime.commands_dir_global, runtime.commands_dir_project);
      if (d) dirs.add(d);
    }
    if (runtime.skills_dir_global || runtime.skills_dir_project) {
      const d = resolve(runtime.skills_dir_global, runtime.skills_dir_project);
      if (d) dirs.add(d);
    }
    if (runtime.agents_dir_global || runtime.agents_dir_project) {
      const d = resolve(runtime.agents_dir_global, runtime.agents_dir_project);
      if (d) dirs.add(d);
    }
    if (runtime.guide_dir_global || runtime.guide_dir_project) {
      const d = resolve(runtime.guide_dir_global, runtime.guide_dir_project);
      if (d) dirs.add(d);
    }
  }
  return Array.from(dirs);
}

function runInstall({ runtimeKeys, isGlobal, developerMode, silent, installMode }) {
  const dataDir = isGlobal ? path.join(os.homedir(), '.scriven') : path.resolve('.scriven');
  const log = silent ? () => {} : (message) => console.log(message);

  if (!runtimeKeys.length) {
    throw new Error('No runtimes selected for installation');
  }

  let totalOrphansRemoved = 0;
  for (const dir of collectTargetDirsForSweep(runtimeKeys, isGlobal, dataDir)) {
    totalOrphansRemoved += cleanOrphanedTempFiles(dir);
  }
  if (totalOrphansRemoved > 0) {
    log(c('dim', `  Cleaned ${totalOrphansRemoved} orphaned temp file(s) from prior interrupted install`));
  }

  if (!silent) {
    console.log('\n' + c('bold', 'Installing...'));
  }

  for (const runtimeKey of runtimeKeys) {
    const runtime = RUNTIMES[runtimeKey];
    if (!runtime) {
      throw new Error(`Unknown runtime "${runtimeKey}"`);
    }
    if (runtimeKey === 'codex') {
      installCodexRuntime(runtime, isGlobal, log);
    } else if (runtime.command_layout === 'flat-prefixed') {
      installClaudeCommandRuntime(runtime, isGlobal, log);
    } else if (runtime.type === 'skills') {
      installManifestSkillRuntime(runtime, isGlobal, log);
    } else if (runtime.type === 'guided-mcp') {
      installGuidedRuntime(runtime, isGlobal, dataDir, log);
    } else {
      installCommandRuntime(runtime, isGlobal, log);
    }
  }

  writeSharedAssets(dataDir, runtimeKeys, isGlobal, developerMode, installMode, log);

  if (silent) {
    console.log(`Installed Scriven ${VERSION} to ${runtimeKeys.join(', ')} (${isGlobal ? 'global' : 'project'}, ${developerMode ? 'developer' : 'writer'} mode).`);
    return;
  }

  console.log('\n' + c('bold', c('green', 'Installation complete!')));
  printNextSteps(runtimeKeys);
}

// Only run interactive installer when executed directly
if (require.main === module) {
  requireSupportedNode();
  main().catch((err) => {
    console.error(c('red', '\nInstallation failed:'), err.message);
    process.exit(1);
  });
}

module.exports = {
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
  generateCodexCommandContent,
  rewriteInstalledCommandRefs,
  installCodexRuntime,
  cleanFlatCommandFiles,
  generateCodexSkill,
  generateSkillManifest,
  buildFilesystemMcpCommand,
  generatePerplexitySetupGuide,
  atomicWriteFileSync,
  cleanOrphanedTempFiles,
  collectTargetDirsForSweep,
  readFrontmatterValue,
  readFrontmatterValues,
  SETTINGS_SCHEMA,
  validateSettings,
  migrateSettings,
  readSettings,
  readJsonIfExists,
  sha256File,
  copyDirWithPreservation,
  mergeSettings,
  INSTALLER_OWNED_FIELDS,
  writeSharedAssets,
  // Phase 29 v1.7 — architectural profiles (tradition / platform)
  listTraditions: architecturalProfiles.listTraditions,
  listPlatforms: architecturalProfiles.listPlatforms,
  validateTradition: architecturalProfiles.validateTradition,
  validatePlatform: architecturalProfiles.validatePlatform,
  inferTradition: architecturalProfiles.inferTradition,
  inferPlatform: architecturalProfiles.inferPlatform,
  // Per-work-type pitfall packs
  listPitfallPacks: architecturalProfiles.listPitfallPacks,
  getPitfallPackPath: architecturalProfiles.getPitfallPackPath,
};
