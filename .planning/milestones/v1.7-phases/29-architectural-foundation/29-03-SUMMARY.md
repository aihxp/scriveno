---
phase: 29-architectural-foundation
plan: 03
subsystem: architectural-foundation
tags: [runtime, validator, tradition, platform, default-inference, drop-in-extension]
requires:
  - Phase 29 Plan 01 (templates/sacred/ and templates/platforms/ directory scaffolds with 18 placeholder manifests)
  - Phase 29 Plan 02 (data/CONSTRAINTS.json architectural_profiles block: _seeded arrays, applies_to_groups, defaults_by_work_type)
provides:
  - "lib/architectural-profiles.js - 6 public functions: listTraditions, listPlatforms, validateTradition, validatePlatform, inferTradition, inferPlatform"
  - "bin/install.js re-exports the 6 functions alongside existing installer helpers"
  - "Runtime-level ARCH-01/ARCH-02 drop-in guarantee: new templates/sacred/<slug>/manifest.yaml or templates/platforms/<slug>/manifest.yaml is accepted at load time with no code edit"
  - "Runtime-level ARCH-04/ARCH-05 default inference: scripture work types get tradition defaults (e.g. scripture_biblical -> catholic), book-shaped work types get platform default kdp"
affects:
  - 29-architectural-foundation/04 (ARCH regression suite consumes this module)
  - Future /scr:new-work wiring (deferred) - will call validateTradition/inferTradition/validatePlatform/inferPlatform when substituting {{PROFILE_BLOCK}}
  - 32-build-pipelines (platform-aware export flows will call listPlatforms/validatePlatform/inferPlatform)
  - 33-sacred-tradition-profiles (tradition-aware sacred flows will call listTraditions/validateTradition/inferTradition)
tech-stack:
  added: []
  patterns:
    - "Directory-listing-driven enum validation: intersection of CONSTRAINTS.json _seeded arrays with on-disk manifest.yaml presence - contributor drop-ins extend the accepted set with zero code or data edit"
    - "Fail-safe default inference: inferTradition/inferPlatform wrap CONSTRAINTS.json read in try/catch, return null on any failure (missing file, bad JSON, unknown work type). Never throws."
    - "Stateless re-read per call: no cache, directory+JSON read on each invocation (~0.5ms) so tests that mutate fixtures see updates immediately"
key-files:
  created:
    - lib/architectural-profiles.js
  modified:
    - bin/install.js
decisions:
  - "Implementation is strictly permissive vs. the _seeded whitelist: listProfiles() returns every templates/<family>/<slug>/manifest.yaml whose slug matches ^[a-z][a-z0-9-]*$, not only slugs in _seeded. This is intentional per ARCH-01/ARCH-02 - _seeded is a documentation anchor for Plan 04 tests, not a runtime whitelist."
  - "No internal cache. Directory listing + CONSTRAINTS.json re-read per call. The cost is negligible (<20 entries, ~45KB JSON) and the behavior is easier to reason about for Plan 04's fixture-based regression tests."
  - "Private test helpers exported as _paths and _loadConstraints so Plan 04 can assert against the actual paths the module reads without duplicating them."
  - "bin/install.js re-export adds 6 keys to the existing module.exports object, explicit per-key rather than spread, so grep finds every entry and future diffs stay readable."
  - "SLUG_PATTERN rejects slugs starting with a digit or containing uppercase/underscore. This filters contributor typos (e.g. 'Catholic', 'tradition_v2') at validation time with a predictable rule."
requirements-completed:
  - ARCH-04
  - ARCH-05
metrics:
  duration: "~2 minutes"
  completed: "2026-04-17"
---

# Phase 29 Plan 03: Architectural Profiles Runtime Validator Summary

ARCH-04 + ARCH-05 shipped - `lib/architectural-profiles.js` provides 6 functions that validate tradition/platform values against directory-listed manifests and infer per-work-type defaults from `data/CONSTRAINTS.json`. Drop-in extension semantics work at runtime. Zero new dependencies. All pre-existing tests still green.

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-17T12:25:59Z
- **Completed:** 2026-04-17T12:27:43Z
- **Tasks:** 2
- **Files created:** 1 (`lib/architectural-profiles.js`)
- **Files modified:** 1 (`bin/install.js`)

## What Changed

### `lib/architectural-profiles.js` (NEW, 101 lines)

A pure Node module using only `fs` and `path` built-ins. Six public functions plus two test-helper exports:

| Function | Return shape | Purpose |
| --- | --- | --- |
| `listTraditions()` | `string[]` | Sorted slugs of every `templates/sacred/<slug>/` directory that contains a `manifest.yaml` AND whose slug matches `^[a-z][a-z0-9-]*$`. |
| `listPlatforms()` | `string[]` | Sorted slugs of every `templates/platforms/<slug>/` directory that contains a `manifest.yaml` AND whose slug matches `^[a-z][a-z0-9-]*$`. |
| `validateTradition(value)` | `{valid: true}` or `{valid: false, error: string}` | Success if `value` appears in `listTraditions()`; error string lists every accepted slug. |
| `validatePlatform(value)` | `{valid: true}` or `{valid: false, error: string}` | Success if `value` appears in `listPlatforms()`; error string lists every accepted slug. |
| `inferTradition(workType)` | `string \| null` | Reads `architectural_profiles.defaults_by_work_type.tradition[workType]` from `data/CONSTRAINTS.json`. Returns `null` for unknown work types or any read/parse failure. Never throws. |
| `inferPlatform(workType)` | `string \| null` | Reads `architectural_profiles.defaults_by_work_type.platform[workType]` from `data/CONSTRAINTS.json`. Returns `null` for unknown work types or any read/parse failure. Never throws. |

Two private exports for Plan 04 tests:
- `_paths` - object with `SACRED_DIR`, `PLATFORMS_DIR`, `CONSTRAINTS_PATH` absolute paths.
- `_loadConstraints()` - reads and parses `data/CONSTRAINTS.json`; used by tests to validate CONSTRAINTS shape alignment.

### `bin/install.js` (MODIFIED, +8 lines)

One `require` added at the top alongside existing `fs`/`path`/`os`/`readline`/`crypto` imports:

```javascript
const architecturalProfiles = require('../lib/architectural-profiles.js');
```

Six new keys appended to the existing `module.exports` block, preceded by a section comment:

```javascript
  // Phase 29 v1.7 - architectural profiles (tradition / platform)
  listTraditions: architecturalProfiles.listTraditions,
  listPlatforms: architecturalProfiles.listPlatforms,
  validateTradition: architecturalProfiles.validateTradition,
  validatePlatform: architecturalProfiles.validatePlatform,
  inferTradition: architecturalProfiles.inferTradition,
  inferPlatform: architecturalProfiles.inferPlatform,
```

All 31 pre-existing exports preserved byte-identical. No installer logic touched.

## Why Directory-Listing-Driven?

ARCH-01 (sacred drop-in) and ARCH-02 (platform drop-in) demand that a contributor can add a new tradition or platform profile WITHOUT editing this module or `data/CONSTRAINTS.json`. The implementation satisfies this:

- `listTraditions()` / `listPlatforms()` iterate the on-disk directory each call.
- `_seeded` arrays in `CONSTRAINTS.json` are used by Plan 04 tests to assert the ten/eight launch-set slugs remain accepted; they are NOT a runtime whitelist.
- Dropping `templates/sacred/zoroastrian/manifest.yaml` into the repo at any point is picked up automatically at the next call - no restart, no build step, no JSON edit.

The `SLUG_PATTERN = /^[a-z][a-z0-9-]*$/` check prevents accidental acceptance of junk directory names (e.g. `Catholic`, `tradition v2`, `.hidden`) that would cause downstream template-path breakage.

## Commits

| Task | Hash | Message |
| ---- | ---- | ------- |
| 1 | `0e9b593` | feat(29-03): add architectural-profiles runtime validator module |
| 2 | `bf0fbec` | feat(29-03): re-export architectural-profiles from bin/install.js |

## Verification

### Module contract

```bash
$ node -e "const m=require('./lib/architectural-profiles.js'); console.log('traditions:',m.listTraditions().length,'platforms:',m.listPlatforms().length)"
traditions: 10 platforms: 8
```

`listTraditions()` -> `['catholic','islamic-hafs','islamic-warsh','jewish','orthodox','pali','protestant','sanskrit','tewahedo','tibetan']` (sorted).
`listPlatforms()` -> `['apple','bn','d2d','google','ingram','kdp','kobo','smashwords']` (sorted).

### Re-export contract

```bash
$ node -e "const m=require('./bin/install.js'); console.log('listTraditions:',typeof m.listTraditions,'validateSettings:',typeof m.validateSettings)"
listTraditions: function validateSettings: function
```

All 6 new exports are functions; all pre-existing exports unchanged.

### Regression - pre-existing test files run green as requested

| Suite | Tests | Pass | Fail |
| --- | --- | --- | --- |
| `test/install.test.js` + `test/installer.test.js` + `test/phase25-schema-validation.test.js` | 127 | 127 | 0 |
| `test/constraints.test.js` | 7 | 7 | 0 |

### Zero new dependencies

```bash
$ git diff --stat package.json
# (no output - package.json unchanged)
$ grep -E "^const.*require\(" lib/architectural-profiles.js
const fs = require('fs');
const path = require('path');
# Two requires, both Node built-ins.
$ grep -c "require.*architectural-profiles" bin/install.js
1
```

### Acceptance-criteria spot checks

- `listTraditions().length === 10` [x]
- `listPlatforms().length === 8` [x]
- `validateTradition('catholic').valid === true` [x]
- `validateTradition('zzzbogus')` -> `{valid: false, error: "Unknown tradition 'zzzbogus'. Valid options: catholic, islamic-hafs, islamic-warsh, jewish, orthodox, pali, protestant, sanskrit, tewahedo, tibetan"}` [x] (every seeded slug present in error)
- `validatePlatform('kdp').valid === true` [x]
- `validatePlatform('bogus').error` contains `"kdp"` [x]
- `inferTradition('scripture_biblical') === 'catholic'` [x]
- `inferTradition('scripture_quranic') === 'islamic-hafs'` [x]
- `inferTradition('scripture_torah') === 'jewish'` [x]
- `inferTradition('novel') === null` [x]
- `inferPlatform('novel') === 'kdp'` [x]
- `inferPlatform('poetry_collection') === 'kdp'` [x]
- Module uses exactly two `require(...)` calls, both Node built-ins [x]
- File is 101 lines (target 80-150) [x]

## Deviations from Plan

None - plan executed exactly as written. The Task 1 `action` block specifies the module content line-by-line; the file shipped matches the specification byte-for-byte. Task 2 placed the require at the top of the require cluster and appended the six exports to the existing `module.exports` block, matching the pre-existing trailing-comma style.

## Deferred (out of scope per plan)

- ARCH regression test suite (test/phase29-architectural-foundation.test.js) - Plan 04 adds this. This plan's regression coverage is the pre-existing test files that already require `bin/install.js`.
- `/scr:new-work` substitution of `{{PROFILE_BLOCK}}` - deferred to a later phase per 29-CONTEXT.md line 24. The module is ready; wiring is not required for ARCH-04/ARCH-05.

## Issues Encountered

None. Both tasks executed cleanly on first attempt; no Rule 1/2/3 auto-fixes were needed.

## User Setup Required

None - no external service configuration, no environment variables.

## Next Phase Readiness

Plan 04 (ARCH regression suite) can now:
- `require('./lib/architectural-profiles.js')` or `require('./bin/install.js')` interchangeably.
- Use `_paths.SACRED_DIR` / `_paths.PLATFORMS_DIR` to construct temporary drop-in manifest fixtures and assert the runtime picks them up.
- Assert that all ten `_seeded` traditions and all eight `_seeded` platforms round-trip through `validate*` as `{valid: true}`.
- Assert the five scripture work types return the correct tradition default and all book-shaped work types return `'kdp'` as the platform default.

Phase 32 (build pipelines) and Phase 33 (sacred tradition profiles) can call `inferPlatform` / `inferTradition` directly to resolve default values when a project spec omits the key.

## Self-Check: PASSED

- FOUND: lib/architectural-profiles.js (101 lines, 6 public exports + 2 test helpers)
- FOUND: bin/install.js modified (require added at line 8, 6 exports added before closing brace)
- FOUND: commit 0e9b593 (Task 1)
- FOUND: commit bf0fbec (Task 2)
- CONFIRMED: test/install.test.js + test/installer.test.js + test/phase25-schema-validation.test.js 127/127 passing
- CONFIRMED: test/constraints.test.js 7/7 passing
- CONFIRMED: package.json byte-identical (zero new deps)

---
*Phase: 29-architectural-foundation*
*Completed: 2026-04-17*
