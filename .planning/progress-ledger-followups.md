# Progress ledger: shipped state and follow-ups

## Shipped in v2.7.0

See CHANGELOG.md and docs/release-notes.md for the public summary.

- `.manuscript/PROGRESS.md` per-unit ledger (done / in progress / untouched, deliverable bar, pipeline position), with `docs/progress-protocol.md` as the canonical contract.
- `/scr:progress` leads with the bar, buckets, pipeline position, and a pointer to the ledger; stays read-only.
- `/scr:draft` and `/scr:autopilot` narrate progress against the whole manuscript (unit N of total, percent).
- `/scr:outline`, `/scr:manuscript-stats` derive per-unit status from disk; `/scr:scan` has a ledger-staleness check.
- `/scr:save`, `/scr:pause-work`, `/scr:resume-work`, `/scr:scan --fix`, `/scr:draft`, `/scr:editor-review`, `/scr:submit`, `/scr:autopilot` regenerate the derived ledger.
- `lib/auto-invoke-engine.js` exposes `computeProgressLedger(manuscriptDir)` (exported, tested in `test/phase48-progress-ledger.test.js`).
- Version 2.7.0 aligned across package.json, templates/config.json, new-work.md, data/CONSTRAINTS.json, docs/configuration.md, README badge, CHANGELOG, release-notes, and the release-metadata test.

## Deferred / optional follow-ups

1. Wire `computeProgressLedger` into the `scriveno status` text report (`formatProactiveChecks` / `formatReport` in `lib/auto-invoke-engine.js`) so the bundled CLI prints a ledger line directly, not only when a runtime requires the module. Additive and low risk; gate on the engine test suite. Guard the no-project branch of `analyzeProject` so it is only computed when `.manuscript` exists.
2. Optional: a richer README section with an example of the rendered ledger output.

## Canonical product plan (off-repo)

The canonical plan named in `.planning/PROJECT.md` Context is `SCRIVENO-PRODUCT-PLAN-v0.3.md`, which is not tracked in this repo. Mirror the section-15 command-spec delta recorded in `.planning/PROJECT.md` (Requirements -> Validated) into that plan's section 15 so plan authority stays the canonical source.
