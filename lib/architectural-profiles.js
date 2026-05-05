// lib/architectural-profiles.js
// Phase 29 (v1.7) — runtime validator + default-inference for the tradition/platform project-spec keys.
// Zero dependencies. Uses only Node built-ins (fs, path).
//
// Reads authoritative seed list + defaults from data/CONSTRAINTS.json.
// Reads accepted-at-runtime list from templates/sacred/<slug>/ and templates/platforms/<slug>/
// directory listings — a contributor dropping a new subdirectory with a manifest.yaml
// extends the accepted set with no edit to this file or to CONSTRAINTS.json.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SACRED_DIR = path.join(ROOT, 'templates', 'sacred');
const PLATFORMS_DIR = path.join(ROOT, 'templates', 'platforms');
const PITFALLS_DIR = path.join(ROOT, 'templates', 'pitfalls');
const CONSTRAINTS_PATH = path.join(ROOT, 'data', 'CONSTRAINTS.json');
const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;
// Work-type slugs (used in pitfall pack filenames) allow underscores per CONSTRAINTS.json conventions
// (e.g., research_paper, poetry_collection). Keep this distinct from SLUG_PATTERN so existing
// sacred/platform validation is not relaxed.
const PITFALL_FILE_PATTERN = /^([a-z][a-z0-9_-]*)\.md$/;

function loadConstraints() {
  // Re-read each call so tests that mutate a temp fixture see the update.
  // Cheap — file is ~45KB and hot on disk. If a perf issue ever surfaces, cache here.
  const raw = fs.readFileSync(CONSTRAINTS_PATH, 'utf8');
  return JSON.parse(raw);
}

function listProfiles(dir) {
  // Returns slugs of subdirectories of `dir` that contain a manifest.yaml.
  // Filters by SLUG_PATTERN to reject junk names (spaces, dots, etc.).
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (!SLUG_PATTERN.test(e.name)) continue;
    const manifest = path.join(dir, e.name, 'manifest.yaml');
    if (fs.existsSync(manifest)) out.push(e.name);
  }
  return out.sort();
}

function listTraditions() {
  return listProfiles(SACRED_DIR);
}

function listPlatforms() {
  return listProfiles(PLATFORMS_DIR);
}

function validateTradition(value) {
  const valid = listTraditions();
  if (valid.includes(value)) return { valid: true };
  return {
    valid: false,
    error: `Unknown tradition '${value}'. Valid options: ${valid.join(', ')}`
  };
}

function validatePlatform(value) {
  const valid = listPlatforms();
  if (valid.includes(value)) return { valid: true };
  return {
    valid: false,
    error: `Unknown platform '${value}'. Valid options: ${valid.join(', ')}`
  };
}

function inferTradition(workType) {
  try {
    const c = loadConstraints();
    const m = c.architectural_profiles && c.architectural_profiles.defaults_by_work_type && c.architectural_profiles.defaults_by_work_type.tradition;
    if (!m) return null;
    const v = m[workType];
    return v == null ? null : v;
  } catch (_err) {
    return null;
  }
}

function inferPlatform(workType) {
  try {
    const c = loadConstraints();
    const m = c.architectural_profiles && c.architectural_profiles.defaults_by_work_type && c.architectural_profiles.defaults_by_work_type.platform;
    if (!m) return null;
    const v = m[workType];
    return v == null ? null : v;
  } catch (_err) {
    return null;
  }
}

function listPitfallPacks() {
  // Returns sorted slugs of templates/pitfalls/<work_type>.md files.
  // A contributor dropping a new <work_type>.md extends the accepted set with no
  // edit to this file or to CONSTRAINTS.json.
  if (!fs.existsSync(PITFALLS_DIR)) return [];
  const entries = fs.readdirSync(PITFALLS_DIR, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    const m = PITFALL_FILE_PATTERN.exec(e.name);
    if (!m) continue;
    out.push(m[1]);
  }
  return out.sort();
}

function getPitfallPackPath(workType) {
  // Returns the absolute path to the installed pitfall pack for a given work_type,
  // or null if no pack exists. Callers should fall back gracefully when null.
  if (typeof workType !== 'string' || !PITFALL_FILE_PATTERN.test(`${workType}.md`)) {
    return null;
  }
  const candidate = path.join(PITFALLS_DIR, `${workType}.md`);
  return fs.existsSync(candidate) ? candidate : null;
}

module.exports = {
  listTraditions,
  listPlatforms,
  validateTradition,
  validatePlatform,
  inferTradition,
  inferPlatform,
  listPitfallPacks,
  getPitfallPackPath,
  // Private helpers exposed for tests:
  _paths: { SACRED_DIR, PLATFORMS_DIR, PITFALLS_DIR, CONSTRAINTS_PATH },
  _loadConstraints: loadConstraints
};
