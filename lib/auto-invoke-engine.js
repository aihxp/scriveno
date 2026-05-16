const fs = require('fs');
const path = require('path');

const DEFAULT_RUNTIME_SUPPORT = {
  'claude-code': {
    label: 'Claude Code',
    surface: 'flat commands plus agent prompts',
    nativeSpawn: 'host-supported when Claude Code exposes agents',
    fallback: 'load prompt from .claude/agents',
    metadata: 'none',
  },
  codex: {
    label: 'Codex',
    surface: 'skills, command mirrors, agent prompts, and metadata',
    nativeSpawn: 'host-supported when Codex exposes agent roles',
    fallback: 'load prompt from .codex/agents',
    metadata: 'toml',
  },
  cursor: {
    label: 'Cursor',
    surface: 'nested commands plus agent prompts',
    nativeSpawn: 'host-supported when Cursor exposes agents',
    fallback: 'load prompt from .cursor/agents',
    metadata: 'none',
  },
  'gemini-cli': {
    label: 'Gemini CLI',
    surface: 'nested commands plus agent prompts',
    nativeSpawn: 'host-supported when Gemini CLI exposes agents',
    fallback: 'load prompt from .gemini/agents',
    metadata: 'none',
  },
  opencode: {
    label: 'OpenCode',
    surface: 'nested commands plus agent prompts',
    nativeSpawn: 'host-supported when OpenCode exposes agents',
    fallback: 'load prompt from .config/opencode/agents',
    metadata: 'none',
  },
  copilot: {
    label: 'GitHub Copilot',
    surface: 'nested commands plus agent prompts',
    nativeSpawn: 'host-supported when Copilot exposes agents',
    fallback: 'load prompt from .github/agents',
    metadata: 'none',
  },
  windsurf: {
    label: 'Windsurf',
    surface: 'nested commands plus agent prompts',
    nativeSpawn: 'host-supported when Windsurf exposes agents',
    fallback: 'load prompt from .windsurf/agents',
    metadata: 'none',
  },
  antigravity: {
    label: 'Antigravity',
    surface: 'nested commands plus agent prompts',
    nativeSpawn: 'host-supported when Antigravity exposes agents',
    fallback: 'load prompt from .gemini/antigravity/agents',
    metadata: 'none',
  },
  manus: {
    label: 'Manus Desktop',
    surface: 'bundled skill, mirrored commands, and agent prompts',
    nativeSpawn: 'host-supported when Manus exposes skill agents',
    fallback: 'load prompt from bundled agents directory',
    metadata: 'none',
  },
  'perplexity-desktop': {
    label: 'Perplexity Desktop',
    surface: 'guided local MCP setup',
    nativeSpawn: 'not assumed',
    fallback: 'read project files through the filesystem connector',
    metadata: 'none',
  },
  generic: {
    label: 'Generic (SKILL.md)',
    surface: 'bundled skill, mirrored commands, and agent prompts',
    nativeSpawn: 'not assumed',
    fallback: 'load prompt from bundled agents directory',
    metadata: 'none',
  },
};

const REVIEW_KEYWORDS = [
  'TODO',
  'FIXME',
  'UNRESOLVED',
  'NEEDS REVISION',
  'QUESTION: Blocking',
  'VOICE DRIFT',
  'CONTINUITY',
];

function pathExists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function safeStat(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return '';
    throw err;
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    if (err instanceof SyntaxError) return null;
    throw err;
  }
}

function listFiles(dir, options = {}) {
  const { extensions = null, recursive = true } = options;
  if (!pathExists(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recursive) out.push(...listFiles(fullPath, options));
    } else if (!extensions || extensions.includes(path.extname(entry.name))) {
      out.push(fullPath);
    }
  }
  return out;
}

function newestMtime(files) {
  let newest = 0;
  for (const file of files) {
    const stat = safeStat(file);
    if (stat && stat.mtimeMs > newest) newest = stat.mtimeMs;
  }
  return newest;
}

function countMarkdownFiles(dir) {
  return listFiles(dir, { extensions: ['.md'], recursive: true }).length;
}

function containsAny(text, keywords) {
  const haystack = text.toUpperCase();
  return keywords.some((keyword) => haystack.includes(keyword.toUpperCase()));
}

function scanReviewSignals(manuscriptDir) {
  const reviewDirs = [
    'reviews',
    'reports',
    'voice',
    'continuity',
    'translation',
  ].map((name) => path.join(manuscriptDir, name));
  const files = reviewDirs.flatMap((dir) => listFiles(dir, { extensions: ['.md', '.txt'], recursive: true }));
  const pending = [];
  for (const file of files) {
    const text = readText(file);
    if (containsAny(text, REVIEW_KEYWORDS)) {
      pending.push(path.relative(manuscriptDir, file));
    }
  }
  return pending;
}

function findNewestOutput(manuscriptDir) {
  const outputDirs = [
    path.join(manuscriptDir, 'output'),
    path.join(manuscriptDir, 'build'),
    path.join(manuscriptDir, 'exports'),
  ];
  return newestMtime(outputDirs.flatMap((dir) => listFiles(dir, { recursive: true })));
}

function detectTranslationSignal(manuscriptDir, config) {
  const translationDir = path.join(manuscriptDir, 'translation');
  const configuredTargets = [
    ...(Array.isArray(config?.target_languages) ? config.target_languages : []),
    ...(Array.isArray(config?.translation?.target_languages) ? config.translation.target_languages : []),
    ...(Array.isArray(config?.translations) ? config.translations : []),
  ];
  const translationFiles = listFiles(translationDir, { recursive: true });
  if (translationFiles.length > 0 || configuredTargets.length > 0) {
    return {
      state: 'follow-up available',
      count: translationFiles.length,
      configuredTargets,
    };
  }
  return {
    state: 'none',
    count: 0,
    configuredTargets: [],
  };
}

function detectHistorySignal(manuscriptDir) {
  const historyPath = path.join(manuscriptDir, 'HISTORY.log');
  if (!pathExists(historyPath)) {
    return { state: 'missing', lastFailed: false };
  }
  const lines = readText(historyPath).split(/\r?\n/).filter(Boolean);
  const last = lines[lines.length - 1] || '';
  return {
    state: 'present',
    lastFailed: /\b(fail|failed|error|blocked)\b/i.test(last),
  };
}

function detectContextSignal(manuscriptDir, draftFiles) {
  const contextPath = path.join(manuscriptDir, 'CONTEXT.md');
  const statePath = path.join(manuscriptDir, 'STATE.md');
  const contextStat = safeStat(contextPath);
  const stateStat = safeStat(statePath);
  const newestDraft = newestMtime(draftFiles);

  if (!contextStat) {
    return { state: 'missing', suggest: '/scr:save' };
  }
  if (stateStat && contextStat.mtimeMs < stateStat.mtimeMs) {
    return { state: 'stale', suggest: '/scr:scan' };
  }
  if (newestDraft > 0 && contextStat.mtimeMs < newestDraft) {
    return { state: 'stale', suggest: '/scr:save' };
  }
  return { state: 'fresh', suggest: null };
}

function detectExportSignal(manuscriptDir, sourceFiles) {
  const newestSource = newestMtime(sourceFiles);
  const newestOutput = findNewestOutput(manuscriptDir);
  if (newestOutput === 0) {
    return { state: sourceFiles.length ? 'missing' : 'none', suggest: sourceFiles.length ? '/scr:export' : null };
  }
  if (newestSource > newestOutput) {
    return { state: 'stale', suggest: '/scr:export' };
  }
  return { state: 'fresh', suggest: null };
}

function detectSaveSignal(historySignal, draftFiles) {
  if (draftFiles.length === 0) return { state: 'clean', suggest: null };
  if (historySignal.state === 'missing') return { state: 'unsaved manuscript changes', suggest: '/scr:save' };
  return { state: 'clean', suggest: null };
}

function chooseRecommendation(signals, counts) {
  if (!signals.hasProject) {
    return {
      command: '/scr:new-work',
      reason: 'No .manuscript directory was found.',
      alternatives: ['/scr:demo', '/scr:import', '/scr:profile-writer'],
    };
  }
  if (!signals.hasState) {
    return {
      command: '/scr:scan',
      reason: 'The project is missing STATE.md.',
      alternatives: ['/scr:health', '/scr:next'],
    };
  }
  if (signals.history.lastFailed) {
    return {
      command: '/scr:troubleshoot',
      reason: 'The last history entry appears to have failed.',
      alternatives: ['/scr:scan', '/scr:health'],
    };
  }
  if (signals.context.state === 'stale') {
    return {
      command: signals.context.suggest || '/scr:scan',
      reason: 'CONTEXT.md is older than the current project state.',
      alternatives: ['/scr:progress', '/scr:resume-work'],
    };
  }
  if (signals.reviews.count > 0) {
    return {
      command: '/scr:editor-review',
      reason: `${signals.reviews.count} review signal(s) still look unresolved.`,
      alternatives: ['/scr:voice-check', '/scr:continuity-check', '/scr:progress'],
    };
  }
  if (counts.drafts === 0) {
    return {
      command: '/scr:plan',
      reason: 'No draft files were found yet.',
      alternatives: ['/scr:discuss', '/scr:draft', '/scr:voice-test'],
    };
  }
  if (signals.translation.state !== 'none') {
    return {
      command: '/scr:back-translate',
      reason: 'Translation work exists and may need a verification pass.',
      alternatives: ['/scr:cultural-adaptation', '/scr:multi-publish', '/scr:progress'],
    };
  }
  if (signals.export.state === 'stale' || signals.export.state === 'missing') {
    return {
      command: signals.export.suggest || '/scr:export',
      reason: `Export output is ${signals.export.state}.`,
      alternatives: ['/scr:publish', '/scr:progress', '/scr:save'],
    };
  }
  if (signals.save.state !== 'clean') {
    return {
      command: signals.save.suggest || '/scr:save',
      reason: 'Draft files exist without a current history signal.',
      alternatives: ['/scr:progress', '/scr:scan'],
    };
  }
  return {
    command: '/scr:next',
    reason: 'Project state looks consistent; continue with the lifecycle route.',
    alternatives: ['/scr:progress', '/scr:editor-review', '/scr:save'],
  };
}

function analyzeProject(projectRoot = process.cwd(), options = {}) {
  const root = path.resolve(projectRoot);
  const manuscriptDir = options.manuscriptDir || path.join(root, '.manuscript');
  const hasProject = pathExists(manuscriptDir);
  const statePath = path.join(manuscriptDir, 'STATE.md');
  const config = readJson(path.join(manuscriptDir, 'config.json')) || {};

  if (!hasProject) {
    const signals = {
      hasProject: false,
      hasState: false,
      context: { state: 'none', suggest: null },
      history: { state: 'none', lastFailed: false },
      reviews: { state: 'none', count: 0, files: [] },
      translation: { state: 'none', count: 0, configuredTargets: [] },
      export: { state: 'none', suggest: null },
      save: { state: 'clean', suggest: null },
    };
    const recommendation = chooseRecommendation(signals, { drafts: 0 });
    return {
      projectRoot: root,
      manuscriptDir,
      commandUnit: config.command_unit || 'unit',
      workType: config.work_type || '',
      counts: { drafts: 0, plans: 0, reviews: 0 },
      signals,
      recommendation,
    };
  }

  const draftFiles = listFiles(path.join(manuscriptDir, 'drafts'), { extensions: ['.md'], recursive: true });
  const planCount = countMarkdownFiles(path.join(manuscriptDir, 'plans'));
  const reviewFiles = scanReviewSignals(manuscriptDir);
  const historySignal = detectHistorySignal(manuscriptDir);
  const sourceFiles = [
    statePath,
    path.join(manuscriptDir, 'OUTLINE.md'),
    path.join(manuscriptDir, 'RECORD.md'),
    path.join(manuscriptDir, 'STYLE-GUIDE.md'),
    ...draftFiles,
  ].filter(pathExists);

  const signals = {
    hasProject: true,
    hasState: pathExists(statePath),
    context: detectContextSignal(manuscriptDir, draftFiles),
    history: historySignal,
    reviews: {
      state: reviewFiles.length ? 'pending' : 'none',
      count: reviewFiles.length,
      files: reviewFiles,
    },
    translation: detectTranslationSignal(manuscriptDir, config),
    export: detectExportSignal(manuscriptDir, sourceFiles),
    save: detectSaveSignal(historySignal, draftFiles),
  };
  const counts = {
    drafts: draftFiles.length,
    plans: planCount,
    reviews: reviewFiles.length,
  };
  const recommendation = chooseRecommendation(signals, counts);
  return {
    projectRoot: root,
    manuscriptDir,
    commandUnit: config.command_unit || 'unit',
    workType: config.work_type || '',
    counts,
    signals,
    recommendation,
  };
}

function formatProactiveChecks(analysis) {
  const { signals } = analysis;
  const stateLine = signals.hasProject
    ? `  State: ${signals.hasState ? 'fresh' : 'missing, suggest /scr:scan'}`
    : '  Project: missing, suggest /scr:new-work';
  return [
    'Proactive checks:',
    stateLine,
    `  Session: ${signals.context.state}${signals.context.suggest ? `, suggest ${signals.context.suggest}` : ''}`,
    `  Reviews: ${signals.reviews.count ? `${signals.reviews.count} pending, suggest /scr:editor-review` : 'none'}`,
    `  Translation: ${signals.translation.state}`,
    `  Export: ${signals.export.state}${signals.export.suggest ? `, suggest ${signals.export.suggest}` : ''}`,
    `  Save: ${signals.save.state}${signals.save.suggest ? `, suggest ${signals.save.suggest}` : ''}`,
  ].join('\n');
}

function formatAutomationStatus(analysis, options = {}) {
  const trigger = options.trigger || '/scr:next';
  const localOperation = options.localOperation || 'auto-invoke engine: read-only';
  const autoInvoked = options.autoInvoked || `${analysis.recommendation.command}: no`;
  return [
    'Automation status:',
    `Trigger: ${trigger}`,
    'Spawned agents:',
    '- none',
    'Local operations:',
    `- ${localOperation}`,
    `- state route computed: ${analysis.signals.hasProject ? 'yes' : 'no project'}`,
    'Auto-invoked:',
    `- ${autoInvoked}`,
    `Why: ${analysis.recommendation.reason}`,
  ].join('\n');
}

function formatRecommendation(analysis) {
  const lines = [
    `${analysis.recommendation.command} is the recommended next command.`,
    analysis.recommendation.reason,
    '',
    'Next commands:',
    `- \`${analysis.recommendation.command}\`: Run the highest-confidence next step from disk state.`,
  ];
  for (const command of analysis.recommendation.alternatives.slice(0, 3)) {
    lines.push(`- \`${command}\`: Use this alternate path if it better matches the writer's intent.`);
  }
  return lines.join('\n');
}

function formatReport(analysis, options = {}) {
  return [
    formatProactiveChecks(analysis),
    '',
    formatAutomationStatus(analysis, options),
    '',
    formatRecommendation(analysis),
  ].join('\n');
}

function getRuntimeAgentSupport(runtimeKey) {
  return DEFAULT_RUNTIME_SUPPORT[runtimeKey] || null;
}

function listRuntimeAgentSupport() {
  return Object.entries(DEFAULT_RUNTIME_SUPPORT).map(([key, value]) => ({
    key,
    ...value,
  }));
}

function parseCliArgs(argv) {
  const out = {
    projectRoot: process.cwd(),
    trigger: '/scr:next',
    json: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--project') {
      out.projectRoot = argv[++i] || out.projectRoot;
    } else if (arg.startsWith('--project=')) {
      out.projectRoot = arg.slice('--project='.length);
    } else if (arg === '--trigger') {
      out.trigger = argv[++i] || out.trigger;
    } else if (arg.startsWith('--trigger=')) {
      out.trigger = arg.slice('--trigger='.length);
    } else if (arg === '--json') {
      out.json = true;
    }
  }
  return out;
}

if (require.main === module) {
  const args = parseCliArgs(process.argv.slice(2));
  const analysis = analyzeProject(args.projectRoot);
  if (args.json) {
    console.log(JSON.stringify(analysis, null, 2));
  } else {
    console.log(formatReport(analysis, { trigger: args.trigger }));
  }
}

module.exports = {
  DEFAULT_RUNTIME_SUPPORT,
  analyzeProject,
  formatProactiveChecks,
  formatAutomationStatus,
  formatRecommendation,
  formatReport,
  getRuntimeAgentSupport,
  listRuntimeAgentSupport,
  parseCliArgs,
};
