# Changelog

All notable package-level changes to `scriven-cli` are documented here.

## 1.6.2 - 2026-05-11

This release packages the audit-hardening pass after `1.6.1`.

- fixed the generated command-name collision between `/scr:sacred-verse-numbering` and `/scr:sacred:verse-numbering` by giving the legacy top-level command a distinct installed name
- aligned sacred project config on top-level profile keys while preserving legacy nested `sacred` fallbacks in commands that read existing projects
- tightened sacred tradition validation to the 10 shipped tradition profile slugs and updated tradition-aware commands and docs to match
- made `/scr:build-ebook --platform` real by validating platform slugs, loading `templates/platforms/{platform}/manifest.yaml`, checking EPUB support, and carrying platform metadata into build output
- corrected the core workflow dependency chain to point at canonical `.manuscript/plans/`, `.manuscript/drafts/body/`, and `.manuscript/reviews/` paths
- updated the documentation deck, shipped-profile READMEs, package scripts, and regression tests so release checks cover npm packaging and repository writing policy

## 1.6.1 - 2026-05-07

This release is a docs-only patch follow-up to `1.6.0`.

- brought the post-`1.6.0` documentation deck refresh into the published tarball: `docs/shipped-assets.md` now lists `WRITING-RULES.md` and the 8 pitfall packs, `docs/voice-dna.md` documents the three rule layers and `draft` config knobs, `docs/configuration.md` documents the optional `draft` block defaults, `docs/command-reference.md` exposes the new `/scr:settings` knobs, `docs/architecture.md` extends "What the drafter receives" from 6 to 8 items with the override hierarchy
- aligned the reference documentation deck on canonical `/scr:` command notation; runtime-specific shapes still appear in onboarding (`docs/getting-started.md`), README cross-runtime examples, and historical 1.5.1 release-notes prose
- no code, agent, command, or template changes; behavior identical to `1.6.0`

## 1.6.0 - 2026-05-05

Draft-quality-aware drafter: layered rule scaffolding to keep weaker models from drifting into generic AI prose.

- added `templates/WRITING-RULES.md`: a one-screen canonical list of universal AI-tell don'ts (hedging, throat-clearing, balanced-both-sides, generic metaphors, symmetrical rhythm, moralizing closings, essay transitions, abstract vagueness, emotional telling, AI tics in dialogue, show-don't-tell triggers). Loaded by drafter, voice-checker, and originality-check after `STYLE-GUIDE.md`.
- added per-work-type pitfall packs under `templates/pitfalls/<work_type>.md`. Initial coverage: novel, memoir, screenplay, runbook, research_paper, poetry_collection, comic, commentary. Drop-in extension supported via `listPitfallPacks()`.
- added `draft` block in `templates/config.json` with three knobs: `rigor` (standard|strict), `context_profile` (minimal|standard|full), `pitfalls_enabled` (true|false). All optional; absent block falls back to current behavior.
- exposed the new knobs in `/scr:settings` display and change flow.
- replaced the 3-genre hardcode in `commands/scr/line-edit.md` (romance/thriller/fantasy) with pack-aware lookup. Falls back gracefully when no pack exists.
- added `lib/architectural-profiles.js#listPitfallPacks` and `getPitfallPackPath`, re-exported from `bin/install.js`.
- added `docs/drafter-quality.md` documenting the three rule layers, settings, and model-tier recommendations.
- added 23 new tests in `test/drafter-quality-aware.test.js` covering pack registration, drop-in extensibility, config schema, and drafter contract.

Conflict resolution is top-down: `STYLE-GUIDE.md` beats `WRITING-RULES.md` beats the pitfall pack. The writer's voice is sovereign; the rule layers are scaffolding, not constraints.

Backward compatible: existing projects keep working without modification. Every layer is optional and falls back to prior behavior when absent.

## 1.5.3 - 2026-04-18

This release packages the hardening work that landed after `1.5.2`.

- aligned the published package version, constraints metadata, generated project config, and release-facing docs on `1.5.3`
- packaged the writer-facing workflow-contract fixes around save history, compare, undo, session boundaries, revision tracks, and help/router guidance
- kept the zero-dependency installer architecture intact while shipping the hardened post-`1.5.2` command/doc/test baseline

## 1.5.1 - 2026-04-09

This release is a Claude command-surface follow-up to `1.5.0`.

- switched Claude Code installs from nested `/scr:*` command-directory files to flat `/scr-*` command files at `.claude/commands/`
- rewrote installed Claude command references so help text and cross-command suggestions use the same `/scr-*` surface writers invoke
- added safe Claude command cleanup so Scriven removes only its own stale `scr-*.md` files and legacy `scr/` installs without touching unrelated user commands
- updated installer regression coverage and Claude-facing docs to lock the new command contract in place

## 1.5.0 - 2026-04-09

This release packages the shipped `v1.5 Runtime Install Reliability` milestone.

- added explicit non-interactive installer flags for runtime selection, scope, mode, help, and version output
- added one-run multi-runtime installs for Codex and Claude Code with shared `.scriven` output written once per run
- generated native Codex `$scr-*` skills backed by mirrored installed command markdown under `.codex/commands/scr`
- tightened reinstall cleanup so Scriven removes stale generated Codex skill wrappers and other Scriven-owned runtime assets without wiping unrelated user files
- updated README and runtime-facing docs to describe the real Codex and Claude install surfaces truthfully
- expanded installer and trust-regression coverage so silent install parsing, Codex skill generation, and runtime-surface wording stay aligned

## 1.4.1 - 2026-04-09

This release is a packaging follow-up to `1.4.0`.

- normalized npm publish metadata to the form npm expects for the `scriven` bin mapping and repository URL
- marked `bin/install.js` executable in the package so the shipped installer entrypoint is explicit on disk
- updated the package regression test to enforce the publish-safe bin path going forward

## 1.4.0 - 2026-04-09

This release packages the shipped `v1.4 Perplexity & Technical Writing` milestone.

- added guided Perplexity Desktop support as a documented local-MCP runtime target with explicit trust framing
- added four technical-writing work types: technical guide, runbook, API reference, and design spec
- added technical-native scaffolding and config defaults for audience, environment, procedures, and references
- expanded trust-surface regression coverage so the new runtime and work-type claims stay aligned with the package and docs

## 1.3.4 - 2026-04-09

This release rolls up the hardening work that landed after `1.3.3`.

- fixed review-driven issues across export, runtime, publishing, and historical command/doc paths
- added explicit validation artifacts for phases 13-16 and retroactive security artifacts for phases 13-16
- expanded regression coverage with new phase-level Nyquist tests for phases 13-15 and stronger package/runtime trust checks for phase 16
- reconciled planning-health drift and finalized the archived `v1.3 Trust & Proof` milestone state
- prepared and published `scriven-cli@1.3.4` from that hardened baseline

## 1.3.3 - 2026-04-08

- restored public npm publishing for `scriven-cli`
- shipped the `v1.3 Trust & Proof` product surface before the post-release hardening pass

## [0.3.0] -- 2026-04-06

### Added
- 13 sacred/historical work types (Biblical, Quranic, Torah, Vedic, Buddhist scripture; commentary, devotional, liturgical, historical chronicle, mythological collection, religious epic, sermon, homiletic collection)
- 8 sacred-exclusive commands (concordance, cross-reference, genealogy, chronology, annotation-layer, verse-numbering, source-tracking, doctrinal-check)
- 10 sacred voice registers (prophetic, wisdom, legal, liturgical, narrative-historical, apocalyptic, epistolary, psalmic, parabolic, didactic)
- Sacred file adaptations: FIGURES.md, LINEAGES.md, COSMOLOGY.md, THEOLOGICAL-ARC.md, DOCTRINES.md, FRAMEWORK.md
- `/scr:next` universal interface -- one command that always knows what to do next
- `/scr:do` natural language router -- free-text to command mapping
- `/scr:demo` sandbox mode -- explore a pre-built sample project
- `/scr:voice-test` voice calibration gate before first draft
- `/scr:import` existing manuscript ingestion
- `/scr:publish` interactive wizard with presets (kdp-paperback, query-submission, ebook-wide)
- Series bible with cross-book continuity enforcement
- Progressive disclosure onboarding (3 questions max)
- Drop-off risk mitigations for onboarding, first draft, non-technical friction, and publishing overwhelm
- 6 user personas including sacred/historical writer
- `CONSTRAINTS.json` -- runtime constraint system governing command availability, work-type adaptation, and dependency gating

### Changed
- Command list expanded to ~170 commands across 15 categories
- Work type count expanded from 35 to 50+
- Constraint matrices now include sacred/historical column
- Voice DNA section expanded with sacred register system (section 6.3)
- Translation section expanded with sacred text translation (section 9.4, formal vs dynamic equivalence, canonical alignment, liturgical preservation)
- Discuss phase categories expanded with 10 sacred categories (section 12.3)
- Build phases expanded to 10 (sacred/historical as dedicated phase)
- Config schema expanded with sacred config block (tradition, verse numbering, calendar, translation philosophy, canonical alignment)

### Fixed
- Section numbering drift after insertions
- 16 adapted sacred command names now in command list
- Sermon/Homily duplication resolved (moved to sacred group)
- `/scr:publish` vs `/scr:export` relationship clarified

## [0.1.0] -- Initial

- Initial project structure
- Spec-driven command system
- Core workflow (new-work, discuss, plan, draft, editor-review, submit)
- 35 initial work types
- Writer mode / developer mode toggle
