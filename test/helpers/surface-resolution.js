const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const VARIABLE_SURFACES = [
  'BRIEF.md',
  'CHARACTERS.md',
  'RELATIONSHIPS.md',
  'WORLD.md',
  'PLOT-GRAPH.md',
  'THEMES.md',
  'PEOPLES.md',
];

const SURFACE_TIERS = ['required', 'optional', 'not_applicable'];
const NEW_WORK_DERIVED_SKIP = new Set(['RELATIONSHIPS.md']);

const UNIVERSAL_NEW_WORK_FILES = [
  'WORK.md',
  'OUTLINE.md',
  'RECORD.md',
  'STATE.md',
  'STYLE-GUIDE.md',
  'WRITING-RULES.md',
  'config.json',
];

function loadConstraints(root) {
  return JSON.parse(fs.readFileSync(path.join(root, 'data', 'CONSTRAINTS.json'), 'utf8'));
}

function cloneGroupTiers(entry) {
  return {
    required: [...entry.required],
    optional: [...entry.optional],
    not_applicable: [...entry.not_applicable],
  };
}

function moveSurfaceToTier(tiers, tier, surface) {
  for (const otherTier of SURFACE_TIERS) {
    tiers[otherTier] = tiers[otherTier].filter((item) => item !== surface);
  }
  tiers[tier].push(surface);
}

function resolveSurfaceSet(constraints, workType) {
  const workTypeConfig = constraints.work_types[workType];
  assert.ok(workTypeConfig, `fixture work type ${workType} should exist`);

  const group = workTypeConfig.group;
  const base = constraints.surface_applicability.by_group[group];
  assert.ok(base, `work type group ${group} should have surface applicability`);

  const tiers = cloneGroupTiers(base);
  const override = constraints.surface_applicability.work_type_overrides[workType] || {};
  for (const tier of SURFACE_TIERS) {
    for (const surface of override[tier] || []) {
      moveSurfaceToTier(tiers, tier, surface);
    }
  }

  const defaultAdaptations = constraints.file_adaptations.default;
  const groupAdaptations = constraints.file_adaptations[group] || {};
  const adapted = Object.fromEntries(
    VARIABLE_SURFACES.map((surface) => [
      surface,
      groupAdaptations[surface] || defaultAdaptations[surface],
    ])
  );

  const createdCanonical = [...tiers.required, ...tiers.optional].filter(
    (surface) => !NEW_WORK_DERIVED_SKIP.has(surface)
  );

  const skippedCanonical = [...tiers.not_applicable].sort();
  const creates = createdCanonical.map((surface) => adapted[surface]).sort();
  const skips = skippedCanonical.map((surface) => adapted[surface]).sort();

  return {
    workType,
    group,
    tiers,
    adapted,
    createdCanonical: createdCanonical.sort(),
    skippedCanonical,
    creates,
    skips,
    relationshipApplies: !tiers.not_applicable.includes('RELATIONSHIPS.md'),
    castApplies: !tiers.not_applicable.includes('CHARACTERS.md'),
    worldApplies: !tiers.not_applicable.includes('WORLD.md'),
    plotApplies: !tiers.not_applicable.includes('PLOT-GRAPH.md'),
    peoplesApplies: !tiers.not_applicable.includes('PEOPLES.md'),
  };
}

function buildNewWorkFixture(constraints, workType) {
  const resolved = resolveSurfaceSet(constraints, workType);
  const manuscriptFiles = new Set([...UNIVERSAL_NEW_WORK_FILES, ...resolved.creates]);
  if (resolved.worldApplies) {
    manuscriptFiles.add('PLACES.md');
  }

  if (resolved.group === 'sacred') {
    for (const file of ['CONCORDANCE.md', 'CHRONOLOGY.md', 'SOURCES.md']) {
      manuscriptFiles.add(file);
    }
  }

  const derivedCandidates = [];
  if (resolved.relationshipApplies) {
    derivedCandidates.push(resolved.adapted['RELATIONSHIPS.md']);
  }
  if (!['poetry', 'speech_song'].includes(resolved.group)) {
    derivedCandidates.push('CONFLICTS.md');
  }
  if (resolved.peoplesApplies) {
    derivedCandidates.push('PEOPLE-DYNAMICS.md');
  }

  return {
    ...resolved,
    manuscriptFiles: [...manuscriptFiles].sort(),
    derivedCandidates: derivedCandidates.sort(),
  };
}

module.exports = {
  NEW_WORK_DERIVED_SKIP,
  SURFACE_TIERS,
  UNIVERSAL_NEW_WORK_FILES,
  VARIABLE_SURFACES,
  buildNewWorkFixture,
  loadConstraints,
  resolveSurfaceSet,
};
