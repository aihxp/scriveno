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

## Shipped in v2.7.1

- `computeProgressLedger` is now wired into the `scriveno status` text report: `analyzeProject` returns a `progress` object and `formatProactiveChecks` prints a `Progress:` line (bar, done / in progress / untouched, pipeline position). The bundled CLI surfaces the ledger directly, not only when a runtime loads the module. (This closes the formerly-deferred CLI-wiring item.)
- Documentation-integrity audit across the Markdown suite: history-protocol context-integrity layer description (five files), scan trust-file enumerations, architecture template tree (derived scaffolds), route-graph version stamp, and a stale command count in PROJECT.md.

## Deferred / optional follow-ups

- Optional: a richer README section with a rendered example of the ledger output.

## Canonical product plan (off-repo)

The canonical plan named in `.planning/PROJECT.md` Context is `SCRIVENO-PRODUCT-PLAN-v0.3.md`, which is not tracked in this repo. Mirror the section-15 command-spec delta recorded in `.planning/PROJECT.md` (Requirements -> Validated) into that plan's section 15 so plan authority stays the canonical source.
