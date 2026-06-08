const fs = require('fs');
const os = require('os');
const path = require('path');

function appPath(homeDir, name) {
  return path.join(homeDir, 'Applications', name);
}

function createRuntimes(options = {}) {
  const homeDir = options.homeDir || os.homedir();
  const fsImpl = options.fs || fs;

  return {
    'claude-code': {
      label: 'Claude Code',
      type: 'commands',
      commands_dir_global: path.join(homeDir, '.claude', 'commands'),
      commands_dir_project: '.claude/commands',
      agents_dir_global: path.join(homeDir, '.claude', 'agents'),
      agents_dir_project: '.claude/agents',
      command_layout: 'flat-prefixed',
      detect: () => fsImpl.existsSync(path.join(homeDir, '.claude')),
    },
    cursor: {
      label: 'Cursor',
      type: 'commands',
      commands_dir_global: path.join(homeDir, '.cursor', 'commands', 'scr'),
      commands_dir_project: '.cursor/commands/scr',
      agents_dir_global: path.join(homeDir, '.cursor', 'agents'),
      agents_dir_project: '.cursor/agents',
      detect: () => fsImpl.existsSync(path.join(homeDir, '.cursor')),
    },
    'gemini-cli': {
      label: 'Gemini CLI',
      type: 'commands',
      commands_dir_global: path.join(homeDir, '.gemini', 'commands', 'scr'),
      commands_dir_project: '.gemini/commands/scr',
      agents_dir_global: path.join(homeDir, '.gemini', 'agents'),
      agents_dir_project: '.gemini/agents',
      detect: () => fsImpl.existsSync(path.join(homeDir, '.gemini')),
    },
    codex: {
      label: 'Codex',
      type: 'skills',
      skills_dir_global: path.join(homeDir, '.codex', 'skills'),
      skills_dir_project: '.codex/skills',
      commands_dir_global: path.join(homeDir, '.codex', 'commands', 'scr'),
      commands_dir_project: '.codex/commands/scr',
      agents_dir_global: path.join(homeDir, '.codex', 'agents'),
      agents_dir_project: '.codex/agents',
      skill_style: 'per-command',
      agent_metadata: 'toml',
      detect: () => fsImpl.existsSync(path.join(homeDir, '.codex')),
    },
    opencode: {
      label: 'OpenCode',
      type: 'commands',
      commands_dir_global: path.join(homeDir, '.config', 'opencode', 'commands', 'scr'),
      commands_dir_project: '.config/opencode/commands/scr',
      agents_dir_global: path.join(homeDir, '.config', 'opencode', 'agents'),
      agents_dir_project: '.config/opencode/agents',
      detect: () => fsImpl.existsSync(path.join(homeDir, '.config', 'opencode')),
    },
    copilot: {
      label: 'GitHub Copilot',
      type: 'commands',
      commands_dir_global: path.join(homeDir, '.github', 'commands', 'scr'),
      commands_dir_project: '.github/commands/scr',
      agents_dir_global: path.join(homeDir, '.github', 'agents'),
      agents_dir_project: '.github/agents',
      detect: () => fsImpl.existsSync(path.join(homeDir, '.github')),
    },
    windsurf: {
      label: 'Windsurf',
      type: 'commands',
      commands_dir_global: path.join(homeDir, '.windsurf', 'commands', 'scr'),
      commands_dir_project: '.windsurf/commands/scr',
      agents_dir_global: path.join(homeDir, '.windsurf', 'agents'),
      agents_dir_project: '.windsurf/agents',
      detect: () => fsImpl.existsSync(path.join(homeDir, '.windsurf')),
    },
    antigravity: {
      label: 'Antigravity',
      type: 'commands',
      commands_dir_global: path.join(homeDir, '.gemini', 'antigravity', 'commands', 'scr'),
      commands_dir_project: '.gemini/antigravity/commands/scr',
      agents_dir_global: path.join(homeDir, '.gemini', 'antigravity', 'agents'),
      agents_dir_project: '.gemini/antigravity/agents',
      detect: () => fsImpl.existsSync(path.join(homeDir, '.gemini', 'antigravity')),
    },
    manus: {
      label: 'Manus Desktop',
      type: 'skills',
      skills_dir_global: path.join(homeDir, '.manus', 'skills', 'scriveno'),
      skills_dir_project: '.manus/skills/scriveno',
      detect: () => fsImpl.existsSync(path.join(homeDir, '.manus')) || fsImpl.existsSync('/Applications/Manus.app') || fsImpl.existsSync(appPath(homeDir, 'Manus.app')),
    },
    'perplexity-desktop': {
      label: 'Perplexity Desktop',
      type: 'guided-mcp',
      guide_dir_global: path.join(homeDir, '.scriveno', 'perplexity'),
      guide_dir_project: '.scriveno/perplexity',
      detect: () => fsImpl.existsSync('/Applications/Perplexity.app') || fsImpl.existsSync(appPath(homeDir, 'Perplexity.app')),
    },
    generic: {
      label: 'Generic (SKILL.md)',
      type: 'skills',
      skills_dir_global: path.join(homeDir, '.scriveno', 'skills'),
      skills_dir_project: '.scriveno/skills',
      detect: () => false,
    },
  };
}

const RUNTIMES = createRuntimes();

const SURFACE_PROFILES = {
  core: {
    label: 'Core',
    description: 'Main writing loop and orientation commands.',
    commands: [
      'new-work',
      'profile-writer',
      'voice-test',
      'discuss',
      'plan',
      'draft',
      'editor-review',
      'submit',
      'progress',
      'save',
      'next',
      'health',
      'help',
      'surface',
      'proof-unit',
    ],
  },
  writing: {
    label: 'Writing',
    description: 'Core workflow plus revision, structure, character, and quality commands.',
    includeProfiles: ['core'],
    categories: ['structure', 'structure_management', 'character_world', 'quality', 'review', 'session', 'navigation'],
  },
  publishing: {
    label: 'Publishing',
    description: 'Core workflow plus export, publishing, metadata, and platform packaging commands.',
    includeProfiles: ['core'],
    categories: ['publishing'],
  },
  translation: {
    label: 'Translation',
    description: 'Core workflow plus translation, localization, glossary, and multi-publish commands.',
    includeProfiles: ['core'],
    categories: ['translation'],
  },
  specialist: {
    label: 'Specialist',
    description: 'Core workflow plus sacred, illustration, collaboration, and utility surfaces.',
    includeProfiles: ['core'],
    categories: ['sacred_exclusive', 'illustration', 'collaboration', 'utility'],
  },
  full: {
    label: 'Full',
    description: 'Every Scriveno command.',
    all: true,
  },
};

const DEFAULT_SURFACE_PROFILE = 'full';

module.exports = {
  createRuntimes,
  RUNTIMES,
  SURFACE_PROFILES,
  DEFAULT_SURFACE_PROFILE,
};
