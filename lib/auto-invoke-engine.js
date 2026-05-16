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

const CORE_PROJECT_FILES = [
  'WORK.md',
  'OUTLINE.md',
  'STYLE-GUIDE.md',
  'RECORD.md',
  'config.json',
];

const AGENT_ROUTE_POLICIES = {
  '/scr:plan': {
    agents: ['plan-checker'],
    reason: 'planning can validate unit plans before drafting',
  },
  '/scr:draft': {
    agents: ['drafter', 'voice-checker'],
    reason: 'drafting uses fresh-context prose generation and voice checks',
  },
  '/scr:editor-review': {
    agents: ['diagnostic worker'],
    reason: 'editor review can isolate flagged issue groups',
  },
  '/scr:voice-check': {
    agents: ['voice-checker'],
    reason: 'voice review compares drafts against STYLE-GUIDE.md',
  },
  '/scr:continuity-check': {
    agents: ['continuity-checker'],
    reason: 'continuity review checks contradictions and timeline drift',
  },
  '/scr:translate': {
    agents: ['translator'],
    reason: 'translation runs one fresh-context translation pass per unit',
  },
  '/scr:back-translate': {
    agents: ['translator'],
    reason: 'back-translation verifies target-language drift',
  },
  '/scr:beta-reader': {
    agents: ['beta-reader worker'],
    reason: 'beta review benefits from isolated reader perspectives',
  },
  '/scr:quick-write': {
    agents: ['drafter', 'voice-checker'],
    reason: 'quick writing still benefits from voice-aware isolation',
  },
  '/scr:map-manuscript': {
    agents: ['voice analyst', 'structure analyst', 'character analyst', 'theme analyst', 'world analyst', 'pacing analyst'],
    reason: 'manuscript import uses parallel analysis workers when available',
  },
};

const LOCAL_ROUTE_POLICIES = {
  '/scr:save': 'refresh CONTEXT.md, HISTORY.log, and project checkpoint state',
  '/scr:scan': 'reconcile STATE.md and disk evidence',
  '/scr:health': 'diagnose project and runtime health',
  '/scr:sync': 'compare and refresh installed runtime surfaces',
  '/scr:validate': 'run project validation checks',
  '/scr:check-notes': 'surface unresolved writer notes',
  '/scr:progress': 'compute read-only project progress',
  '/scr:session-report': 'compute read-only session metrics',
};

const MANUAL_ROUTE_POLICIES = {
  '/scr:publish': 'publication packaging can overwrite deliverables and needs writer choices',
  '/scr:export': 'export writes output artifacts and may overwrite packages',
  '/scr:track merge': 'merging revision tracks is a writer-owned decision',
  '/scr:undo': 'undo changes state and should stay explicit',
};

const CATEGORY_ROUTE_POLICIES = {
  core: { lane: 'mixed', level: 3, reason: 'core lifecycle routes may read, write, or spawn depending on the current stage' },
  navigation: { lane: 'read-only', level: 1, reason: 'navigation routes should inspect and recommend by default' },
  quality: { lane: 'agent-or-local', level: 3, reason: 'quality routes may run bounded diagnostics or text transforms' },
  character_world: { lane: 'local-helper', level: 2, reason: 'character and world routes update project knowledge files' },
  structure: { lane: 'local-helper', level: 2, reason: 'structure routes update maps, outlines, and state evidence' },
  structure_management: { lane: 'manual-gated', level: 4, reason: 'structure management can rename, remove, or reorder manuscript units' },
  review: { lane: 'agent-or-local', level: 3, reason: 'review routes may invoke bounded diagnostic workers' },
  illustration: { lane: 'local-helper', level: 2, reason: 'illustration routes generate prompts and asset briefs' },
  publishing: { lane: 'manual-gated', level: 4, reason: 'publishing routes write deliverables and package outputs' },
  translation: { lane: 'agent-or-local', level: 3, reason: 'translation routes use translator agents or verification helpers' },
  sacred_exclusive: { lane: 'agent-or-local', level: 3, reason: 'sacred routes perform specialized consistency and reference work' },
  utility: { lane: 'local-helper', level: 2, reason: 'utility routes perform deterministic diagnostics or project updates' },
  session: { lane: 'local-helper', level: 2, reason: 'session routes save, compare, resume, or report project state' },
  collaboration: { lane: 'manual-gated', level: 4, reason: 'collaboration routes change revision tracks and require writer control' },
};

function normalizeCommandRef(commandName) {
  if (commandName.startsWith('/scr:')) return commandName;
  return `/scr:${commandName}`;
}

function getCommandAutomationPolicy(commandName, command = {}) {
  const ref = normalizeCommandRef(commandName);
  if (AGENT_ROUTE_POLICIES[ref]) {
    return { ref, lane: 'agent-ready', level: 3, reason: AGENT_ROUTE_POLICIES[ref].reason };
  }
  if (LOCAL_ROUTE_POLICIES[ref]) {
    return { ref, lane: 'local-helper', level: 2, reason: LOCAL_ROUTE_POLICIES[ref] };
  }
  if (MANUAL_ROUTE_POLICIES[ref]) {
    return { ref, lane: 'manual-gated', level: 4, reason: MANUAL_ROUTE_POLICIES[ref] };
  }
  const categoryPolicy = CATEGORY_ROUTE_POLICIES[command.category] || {
    lane: 'read-only',
    level: 1,
    reason: 'unclassified routes should only suggest until a category policy is added',
  };
  return { ref, ...categoryPolicy };
}

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

function countFiles(dir, extensions = null) {
  return listFiles(dir, { extensions, recursive: true }).length;
}

function anyPathExists(paths) {
  return paths.some(pathExists);
}

function containsAny(text, keywords) {
  const haystack = text.toUpperCase();
  return keywords.some((keyword) => haystack.includes(keyword.toUpperCase()));
}

function detectProjectReadiness(manuscriptDir) {
  const missing = CORE_PROJECT_FILES.filter((file) => !pathExists(path.join(manuscriptDir, file)));
  return {
    state: missing.length ? 'incomplete' : 'ready',
    missing,
    suggest: missing.length ? '/scr:scan' : null,
  };
}

function detectPlanSignal(manuscriptDir, draftFiles) {
  const files = listFiles(path.join(manuscriptDir, 'plans'), { extensions: ['.md'], recursive: true });
  if (files.length === 0) {
    return { state: 'missing', count: 0, suggest: '/scr:plan' };
  }
  if (draftFiles.length === 0) {
    return { state: 'ready-to-draft', count: files.length, suggest: '/scr:draft' };
  }
  if (files.length > draftFiles.length) {
    return { state: 'partially-drafted', count: files.length, suggest: '/scr:draft' };
  }
  return { state: 'covered', count: files.length, suggest: null };
}

function detectReviewCoverage(draftFiles, reviewFiles) {
  if (draftFiles.length === 0) {
    return { state: 'none', suggest: null };
  }
  if (reviewFiles.length === 0) {
    return { state: 'missing', suggest: '/scr:editor-review' };
  }
  if (reviewFiles.length < draftFiles.length) {
    return { state: 'partial', suggest: '/scr:editor-review' };
  }
  return { state: 'covered', suggest: null };
}

function detectNotesSignal(manuscriptDir) {
  const noteFiles = [
    ...listFiles(path.join(manuscriptDir, 'notes'), { extensions: ['.md', '.txt'], recursive: true }),
    path.join(manuscriptDir, 'NOTES.md'),
    path.join(manuscriptDir, 'TODO.md'),
  ].filter(pathExists);
  const pending = noteFiles.filter((file) => containsAny(readText(file), ['TODO', 'FIXME', 'UNRESOLVED', 'QUESTION:', 'NOTE:']));
  return {
    state: pending.length ? 'pending' : 'none',
    count: pending.length,
    files: pending.map((file) => path.relative(manuscriptDir, file)),
    suggest: pending.length ? '/scr:check-notes' : null,
  };
}

function detectTrackSignal(manuscriptDir) {
  const tracks = readJson(path.join(manuscriptDir, 'tracks.json'));
  const proposals = listFiles(path.join(manuscriptDir, 'proposals'), { extensions: ['.md'], recursive: true });
  const activeTracks = Array.isArray(tracks?.tracks)
    ? tracks.tracks.filter((track) => track && track.status !== 'merged')
    : [];
  let state = 'none';
  let suggest = null;
  if (proposals.length > 0) {
    state = 'proposal-ready';
    suggest = '/scr:editor-review --proposal';
  } else if (activeTracks.length > 0) {
    state = 'active';
    suggest = '/scr:track';
  }
  return {
    state,
    activeCount: activeTracks.length,
    proposalCount: proposals.length,
    suggest,
  };
}

function detectPublishingSignal(manuscriptDir, draftFiles) {
  const frontMatter = countMarkdownFiles(path.join(manuscriptDir, 'front-matter'));
  const backMatter = countMarkdownFiles(path.join(manuscriptDir, 'back-matter'));
  const blurb = pathExists(path.join(manuscriptDir, 'output', 'blurb.md'));
  const ebookCover = anyPathExists([
    path.join(manuscriptDir, 'build', 'ebook-cover.jpg'),
    path.join(manuscriptDir, 'build', 'ebook-cover.png'),
  ]);
  const printCover = anyPathExists([
    path.join(manuscriptDir, 'build', 'paperback-cover.pdf'),
    path.join(manuscriptDir, 'build', 'hardcover-cover.pdf'),
  ]);
  const promptFiles = countFiles(path.join(manuscriptDir, 'illustrations', 'cover'), ['.md']);
  const gaps = [];
  if (draftFiles.length > 0 && frontMatter === 0) gaps.push('front-matter');
  if (draftFiles.length > 0 && backMatter === 0) gaps.push('back-matter');
  if (draftFiles.length > 0 && !blurb) gaps.push('blurb');
  if (draftFiles.length > 0 && !ebookCover && promptFiles === 0) gaps.push('cover-art');
  return {
    state: gaps.length ? 'gaps' : draftFiles.length ? 'ready' : 'not-started',
    frontMatter,
    backMatter,
    blurb,
    ebookCover,
    printCover,
    coverPrompts: promptFiles,
    gaps,
    suggest: gaps.length ? `/scr:${gaps[0]}` : null,
  };
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
  if (signals.tracks?.state === 'proposal-ready') {
    return {
      command: signals.tracks.suggest,
      reason: `${signals.tracks.proposalCount} revision proposal(s) are waiting for review.`,
      alternatives: ['/scr:track', '/scr:compare', '/scr:progress'],
    };
  }
  if (signals.reviews.count > 0) {
    return {
      command: '/scr:editor-review',
      reason: `${signals.reviews.count} review signal(s) still look unresolved.`,
      alternatives: ['/scr:voice-check', '/scr:continuity-check', '/scr:progress'],
    };
  }
  if (signals.notes?.count > 0) {
    return {
      command: signals.notes.suggest,
      reason: `${signals.notes.count} note file(s) contain unresolved items.`,
      alternatives: ['/scr:progress', '/scr:scan', '/scr:next'],
    };
  }
  if (signals.plan?.state === 'ready-to-draft' || signals.plan?.state === 'partially-drafted') {
    return {
      command: signals.plan.suggest,
      reason: `${signals.plan.count} plan file(s) exist and drafting is the next connected step.`,
      alternatives: ['/scr:plan', '/scr:voice-test', '/scr:progress'],
    };
  }
  if (counts.drafts === 0) {
    return {
      command: '/scr:plan',
      reason: 'No draft files were found yet.',
      alternatives: ['/scr:discuss', '/scr:draft', '/scr:voice-test'],
    };
  }
  if (signals.reviewCoverage?.state === 'missing' || signals.reviewCoverage?.state === 'partial') {
    return {
      command: signals.reviewCoverage.suggest,
      reason: `Drafts exist but review coverage is ${signals.reviewCoverage.state}.`,
      alternatives: ['/scr:voice-check', '/scr:continuity-check', '/scr:progress'],
    };
  }
  if (signals.translation.state !== 'none') {
    return {
      command: '/scr:back-translate',
      reason: 'Translation work exists and may need a verification pass.',
      alternatives: ['/scr:cultural-adaptation', '/scr:multi-publish', '/scr:progress'],
    };
  }
  if (signals.publishing?.state === 'gaps' && signals.export.state === 'missing') {
    return {
      command: signals.publishing.suggest || '/scr:publish',
      reason: `Publishing prerequisites have gaps: ${signals.publishing.gaps.join(', ')}.`,
      alternatives: ['/scr:publish', '/scr:export', '/scr:progress'],
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

function dedupeByCommand(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.command)) return false;
    seen.add(item.command);
    return true;
  });
}

function buildAutomationPlan(signals, recommendation) {
  const spawnPolicy = AGENT_ROUTE_POLICIES[recommendation.command];
  const localPolicy = LOCAL_ROUTE_POLICIES[recommendation.command];
  const manualPolicy = MANUAL_ROUTE_POLICIES[recommendation.command];
  const spawnCandidates = [];
  const localCandidates = [];
  const manualGates = [];

  if (spawnPolicy) {
    spawnCandidates.push({
      command: recommendation.command,
      agents: spawnPolicy.agents,
      reason: spawnPolicy.reason,
    });
  }
  if (signals.plan?.state === 'ready-to-draft' || signals.plan?.state === 'partially-drafted') {
    spawnCandidates.push({
      command: '/scr:draft',
      agents: AGENT_ROUTE_POLICIES['/scr:draft'].agents,
      reason: 'planned units can be drafted by the drafter route',
    });
  }
  if (signals.reviewCoverage?.state === 'missing' || signals.reviewCoverage?.state === 'partial') {
    spawnCandidates.push({
      command: '/scr:editor-review',
      agents: AGENT_ROUTE_POLICIES['/scr:editor-review'].agents,
      reason: 'drafts without review coverage should enter the review route',
    });
  }
  if (signals.translation?.state !== 'none') {
    spawnCandidates.push({
      command: '/scr:back-translate',
      agents: AGENT_ROUTE_POLICIES['/scr:back-translate'].agents,
      reason: 'translation work needs a verification pass',
    });
  }

  if (localPolicy) {
    localCandidates.push({ command: recommendation.command, reason: localPolicy });
  }
  if (signals.context?.state === 'stale') {
    localCandidates.push({ command: signals.context.suggest || '/scr:scan', reason: 'refresh stale context before chaining work' });
  }
  if (signals.notes?.count > 0) {
    localCandidates.push({ command: '/scr:check-notes', reason: 'surface unresolved notes before the next writing route' });
  }
  if (signals.save?.state !== 'clean') {
    localCandidates.push({ command: signals.save.suggest || '/scr:save', reason: 'save manuscript changes before branching or packaging' });
  }

  if (manualPolicy) {
    manualGates.push({ command: recommendation.command, reason: manualPolicy });
  }
  if (signals.publishing?.state === 'gaps') {
    manualGates.push({
      command: '/scr:publish',
      reason: `publishing still needs ${signals.publishing.gaps.join(', ')}`,
    });
  }
  if (signals.tracks?.state === 'active' || signals.tracks?.state === 'proposal-ready') {
    manualGates.push({
      command: signals.tracks.suggest || '/scr:track',
      reason: 'revision-track decisions belong to the writer',
    });
  }

  const recommendationIsManual = manualGates.some((gate) => gate.command === recommendation.command);
  return {
    mode: recommendationIsManual ? 'manual-gated' : spawnCandidates.length ? 'agent-ready' : localCandidates.length ? 'local-helper' : 'read-only',
    spawnCandidates: dedupeByCommand(spawnCandidates),
    localCandidates: dedupeByCommand(localCandidates),
    manualGates: dedupeByCommand(manualGates),
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
      reviewCoverage: { state: 'none', suggest: null },
      readiness: { state: 'none', missing: [], suggest: null },
      plan: { state: 'none', count: 0, suggest: null },
      notes: { state: 'none', count: 0, files: [], suggest: null },
      tracks: { state: 'none', activeCount: 0, proposalCount: 0, suggest: null },
      translation: { state: 'none', count: 0, configuredTargets: [] },
      export: { state: 'none', suggest: null },
      publishing: { state: 'not-started', gaps: [], suggest: null },
      save: { state: 'clean', suggest: null },
    };
    const recommendation = chooseRecommendation(signals, { drafts: 0 });
    const automation = buildAutomationPlan(signals, recommendation);
    return {
      projectRoot: root,
      manuscriptDir,
      commandUnit: config.command_unit || 'unit',
      workType: config.work_type || '',
      counts: { drafts: 0, plans: 0, reviews: 0 },
      signals,
      recommendation,
      automation,
    };
  }

  const draftFiles = listFiles(path.join(manuscriptDir, 'drafts'), { extensions: ['.md'], recursive: true });
  const reviewFiles = scanReviewSignals(manuscriptDir);
  const allReviewFiles = listFiles(path.join(manuscriptDir, 'reviews'), { extensions: ['.md', '.txt'], recursive: true });
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
    readiness: detectProjectReadiness(manuscriptDir),
    plan: detectPlanSignal(manuscriptDir, draftFiles),
    reviews: {
      state: reviewFiles.length ? 'pending' : 'none',
      count: reviewFiles.length,
      files: reviewFiles,
    },
    reviewCoverage: detectReviewCoverage(draftFiles, allReviewFiles),
    notes: detectNotesSignal(manuscriptDir),
    tracks: detectTrackSignal(manuscriptDir),
    translation: detectTranslationSignal(manuscriptDir, config),
    export: detectExportSignal(manuscriptDir, sourceFiles),
    publishing: detectPublishingSignal(manuscriptDir, draftFiles),
    save: detectSaveSignal(historySignal, draftFiles),
  };
  const counts = {
    drafts: draftFiles.length,
    plans: signals.plan.count,
    reviews: reviewFiles.length,
  };
  const recommendation = chooseRecommendation(signals, counts);
  const automation = buildAutomationPlan(signals, recommendation);
  return {
    projectRoot: root,
    manuscriptDir,
    commandUnit: config.command_unit || 'unit',
    workType: config.work_type || '',
    counts,
    signals,
    recommendation,
    automation,
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
    `  Readiness: ${signals.readiness?.state || 'none'}${signals.readiness?.missing?.length ? `, missing ${signals.readiness.missing.join(', ')}` : ''}`,
    `  Session: ${signals.context.state}${signals.context.suggest ? `, suggest ${signals.context.suggest}` : ''}`,
    `  Plans: ${signals.plan?.state || 'none'}${signals.plan?.suggest ? `, suggest ${signals.plan.suggest}` : ''}`,
    `  Reviews: ${signals.reviews.count ? `${signals.reviews.count} pending, suggest /scr:editor-review` : 'none'}`,
    `  Review coverage: ${signals.reviewCoverage?.state || 'none'}${signals.reviewCoverage?.suggest ? `, suggest ${signals.reviewCoverage.suggest}` : ''}`,
    `  Notes: ${signals.notes?.count ? `${signals.notes.count} pending, suggest ${signals.notes.suggest}` : 'none'}`,
    `  Tracks: ${signals.tracks?.state || 'none'}${signals.tracks?.suggest ? `, suggest ${signals.tracks.suggest}` : ''}`,
    `  Translation: ${signals.translation.state}`,
    `  Publishing: ${signals.publishing?.state || 'none'}${signals.publishing?.gaps?.length ? `, gaps ${signals.publishing.gaps.join(', ')}` : ''}`,
    `  Export: ${signals.export.state}${signals.export.suggest ? `, suggest ${signals.export.suggest}` : ''}`,
    `  Save: ${signals.save.state}${signals.save.suggest ? `, suggest ${signals.save.suggest}` : ''}`,
  ].join('\n');
}

function formatAutomationStatus(analysis, options = {}) {
  const trigger = options.trigger || '/scr:next';
  const localOperation = options.localOperation || 'auto-invoke engine: read-only';
  const autoInvoked = options.autoInvoked || `${analysis.recommendation.command}: no`;
  const automation = analysis.automation || { mode: 'read-only', spawnCandidates: [], localCandidates: [], manualGates: [] };
  const candidateAgentLines = automation.spawnCandidates.length
    ? automation.spawnCandidates.map((candidate) => `- ${candidate.command}: ${candidate.agents.join(', ')} (${candidate.reason})`)
    : ['- none'];
  const localCandidateLines = automation.localCandidates.length
    ? automation.localCandidates.map((candidate) => `- ${candidate.command}: ${candidate.reason}`)
    : ['- none'];
  const manualGateLines = automation.manualGates.length
    ? automation.manualGates.map((gate) => `- ${gate.command}: ${gate.reason}`)
    : ['- none'];
  return [
    'Automation status:',
    `Trigger: ${trigger}`,
    `Mode: ${automation.mode}`,
    'Spawned agents:',
    '- none',
    'Candidate agents:',
    ...candidateAgentLines,
    'Local operations:',
    `- ${localOperation}`,
    `- state route computed: ${analysis.signals.hasProject ? 'yes' : 'no project'}`,
    'Candidate local helpers:',
    ...localCandidateLines,
    'Manual gates:',
    ...manualGateLines,
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
  AGENT_ROUTE_POLICIES,
  CATEGORY_ROUTE_POLICIES,
  DEFAULT_RUNTIME_SUPPORT,
  LOCAL_ROUTE_POLICIES,
  MANUAL_ROUTE_POLICIES,
  analyzeProject,
  formatProactiveChecks,
  formatAutomationStatus,
  formatRecommendation,
  formatReport,
  getCommandAutomationPolicy,
  getRuntimeAgentSupport,
  listRuntimeAgentSupport,
  parseCliArgs,
};
