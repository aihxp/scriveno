const fs = require('fs');
const path = require('path');

const DEFAULT_FIXTURE_PATH = path.join(__dirname, '..', 'data', 'proof', 'voice-dna', 'eval-fixtures.json');

function normalizeText(text) {
  return String(text || '').toLowerCase();
}

function countMatches(text, patterns) {
  const haystack = normalizeText(text);
  return (patterns || []).filter((pattern) => haystack.includes(String(pattern).toLowerCase())).length;
}

function evaluateVoiceSample(sampleText, fixture) {
  const markerHits = countMatches(sampleText, fixture.required_markers);
  const forbiddenHits = countMatches(sampleText, fixture.forbidden_patterns);
  const pass = markerHits >= fixture.min_markers && forbiddenHits <= fixture.max_forbidden;

  return {
    id: fixture.id,
    sample: fixture.sample,
    expectedPass: fixture.expected_pass,
    pass,
    markerHits,
    requiredMarkers: fixture.required_markers.length,
    minMarkers: fixture.min_markers,
    forbiddenHits,
    maxForbidden: fixture.max_forbidden,
    modelTierNotes: fixture.model_tier_notes || [],
  };
}

function loadVoiceEvalFixtures(fixturePath = DEFAULT_FIXTURE_PATH) {
  return JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
}

function runVoiceDnaEval(options = {}) {
  const fixturePath = options.fixturePath || DEFAULT_FIXTURE_PATH;
  const rootDir = options.rootDir || path.dirname(fixturePath);
  const data = loadVoiceEvalFixtures(fixturePath);
  const results = data.fixtures.map((fixture) => {
    const samplePath = path.join(rootDir, fixture.sample);
    return evaluateVoiceSample(fs.readFileSync(samplePath, 'utf8'), fixture);
  });

  return {
    version: data.version,
    fixtureCount: results.length,
    ok: results.every((result) => result.pass === result.expectedPass),
    results,
  };
}

module.exports = {
  DEFAULT_FIXTURE_PATH,
  countMatches,
  evaluateVoiceSample,
  loadVoiceEvalFixtures,
  runVoiceDnaEval,
};
