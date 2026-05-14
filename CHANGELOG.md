# Changelog

All notable package-level changes to `scriven-cli` are documented here.

## 2.0.0 - 2026-05-14

Major release focused on creative-context intelligence and installed-runtime trust.

**Creative context**

- Added `RECORD.md`, a neutral established-content store for what the work has put on page: open threads, reader promises, payoffs, continuity facts, movement, and next-unit obligations.
- Wired Record Notes through `/scr:discuss`, `/scr:plan`, `/scr:draft`, `/scr:editor-review`, `/scr:next`, `/scr:progress`, `/scr:continuity-check`, `/scr:scan`, `/scr:save`, the drafter agent, and the plan-checker agent.
- Added non-character subject tracking so nonfiction, poetry, sacred commentary, technical work, and other non-character forms can track concepts, procedures, doctrines, objects, images, and reader-state movement without forcing a character model.
- Expanded character work with relationship and interaction paths while still letting character projects reuse the non-character subject approach when that is the better fit.

**Workflow guidance**

- Added the branching next-command response contract across the command surface: every writer-facing response now ends with one to four practical next paths, each with a short explanation.
- Updated `/scr:next` to support non-linear suggestions instead of forcing one linear path when several useful next moves exist.
- Updated progress and scan surfaces to show record threads and context drift more clearly.

**Runtime sync**

- Added `/scr:sync` to compare and refresh installed Scriven runtime commands, Codex skills, command mirrors, and agent prompts from the current source tree.
- Kept `/scr:sync` distinct from future package upgrades: sync repairs local runtime drift; update remains reserved for fetching a newer released package.

**Release alignment**

- Bumped package, constraints, generated config, and documentation references to `2.0.0`.
- Updated docs for the 112-command surface, `RECORD.md`, creative context, runtime sync, and release-facing behavior.
- Added regression coverage for the record store, creative-context pilot, sync command, and updated command-surface contracts.

## 1.7.1 - 2026-05-11

This release packages the audit-hardening pass on top of `1.7.0`.

- fixed the generated command-name collision between `/scr:sacred-verse-numbering` and `/scr:sacred:verse-numbering` by giving the legacy top-level command a distinct installed name
- aligned sacred project config on top-level profile keys while preserving legacy nested `sacred` fallbacks in commands that read existing projects
- tightened sacred tradition validation to the 10 shipped tradition profile slugs and updated tradition-aware commands and docs to match
- made `/scr:build-ebook --platform` real by validating platform slugs, loading `templates/platforms/{platform}/manifest.yaml`, checking EPUB support, and carrying platform metadata into build output
- corrected the core workflow dependency chain to point at canonical `.manuscript/plans/`, `.manuscript/drafts/body/`, and `.manuscript/reviews/` paths
- updated the repository documentation surface, shipped-profile READMEs, package scripts, and regression tests so release checks cover npm packaging and repository writing policy

## 1.7.0 - 2026-05-10

Substantial minor release focused on character continuity and context integrity.

**Character continuity**

- Drafter now loads the full `CHARACTERS.md` / `FIGURES.md` by default at the `standard` context profile. Previously the drafter received "relevant figures only" -- determined by who appeared in the unit's plan -- which silently dropped characters added late in the project (their entries were not in older plans, so the drafter never saw them). The relevance filter is now opt-in via `draft.context_profile: minimal` only, and that profile carries an explicit warning that newly added characters get dropped.
- Added `/scr:character-touch <name>`: updates a character's evolving state (emotional position, knowledge, possessions, relationships) after a unit lands. Voice anchor and physical description stay untouched -- those are identity, not state. The command reads the most recent draft (or `--from <unit>`), proposes a delta across the four dimensions, asks for a yes/no/edit confirmation, applies the changes, stamps a "Last touched" line, and appends a HISTORY.log entry.
- Drafter agent now emits one-line `CHARACTER STATE NUDGE` suggestions to the orchestrator when a unit clearly shifts a character's state. Up to three nudges per unit; silence is the default. The drafter does NOT modify CHARACTERS.md itself -- the writer is always in the loop on character state.
- Wired the previously-orphan `agents/plan-checker.md` into `/scr:plan` (gates the draft suggestion if the plan flags NEEDS REVISION) and `agents/continuity-checker.md` into `/scr:continuity-check`.

**Context integrity layer**

- Added `/scr:scan`: 10 checks against `STATE.md`, `OUTLINE.md`, drafts, `STYLE-GUIDE.md` mtime vs. last drafter run, scaffold elements still pending, stale exports, sacred config vs. shipped templates, CHARACTERS.md orphans. `--fix` mode for auto-correctable findings; `--quiet` for use as a pre-export gate.
- Added auto-regenerated `.manuscript/CONTEXT.md` one-page bootstrap. Written by `/scr:save`, `/scr:pause-work`, `/scr:resume-work`. Read first by `/scr:next` and `/scr:resume-work`, with stale-detection + STATE.md fallback. Template at `templates/CONTEXT.md`.
- Added append-only `.manuscript/HISTORY.log` audit trail (pipe-delimited, UTC ISO timestamps, committed to git). Wired into `/scr:save`, `/scr:draft`, `/scr:plan`, `/scr:export`, `/scr:publish`, `/scr:front-matter`, `/scr:back-matter`, `/scr:pause-work`, `/scr:resume-work`, `/scr:scan --fix`. Distinct from `/scr:history` (writer-friendly git saves).
- Two new spec docs: `docs/context-protocol.md` and `docs/history-protocol.md`.
- 12 high-impact commands now read CONTEXT.md first when fresh and skip the redundant raw-file orientation loads (`autopilot`, `autopilot-publish`, `autopilot-translate`, `publish`, `multi-publish`, `export`, `front-matter`, `back-matter`, `discuss`, `plan`, `complete-draft`, `new-revision`).

**Export polish**

- Added five destination-neutral presets to `/scr:publish`: `share-pdf`, `share-docx`, `share-epub`, `share-bundle`, `all-formats`. Writers can hand someone a single file without thinking about KDP.
- `/scr:publish` wizard reorganized as a two-level decision tree (Share / Publish / Submit / Academic / Screenplay / Everything / Custom).
- `/scr:export` (no args) now shows an interactive picker grouped into Single file / Print and store packaging / Submission packages, filtered by work type.
- Added `--level minimum|balanced|maximum` flag to `/scr:front-matter` and `/scr:back-matter` plus a skip prompt. `/scr:publish` asks once per matter type before chaining.
- Fixed: the Typst book interior template (`data/export-templates/scriven-book.typst`) now updates the running head per chapter on recto pages. Previously verso pages always showed the book title and recto pages were empty -- across a full book that read as "the same chapter title repeating on every spread." Suppressed on chapter-opener pages.

**Installer hardening**

- Renamed `commands/scr/sacred-verse-numbering.md` -> `commands/scr/sacred-numbering-format.md` to resolve a flat/nested skill-name collision with `commands/scr/sacred/verse-numbering.md` (both flattened to `scr-sacred-verse-numbering` and one was silently overwritten on every install).
- New `assertNoSkillNameCollisions` guard runs at command-entry collection time and aborts the install with a clear error before any runtime starts writing. Future regressions fail loudly instead of dropping a command.
- New `test/runtime-parity.test.js` (6 tests) pins that Claude flat filenames and Codex skill names map 1:1 across the source tree.
- Sacred subcommand keys in `CONSTRAINTS.json` now use the `sacred:<name>` form so `/scr:help` can render the runnable slash-command path directly.

**Backward compatibility**

- All existing scripted callers of `/scr:front-matter` and `/scr:back-matter` continue to work; the level prompt only fires when neither `--level` nor `--element` is provided.
- Existing projects keep working without modification. STATE.md-based commands continue to function when CONTEXT.md is absent or stale; the protocol explicitly preserves correctness on a CONTEXT.md miss.

**Tests**

1629 tests pass (1617 in 1.6.1 + 12 net new across runtime-parity, scan coverage, and constraint integrity).

## 1.6.1 - 2026-05-07

This release is a documentation-only patch follow-up to `1.6.0`.

- brought the post-`1.6.0` repository documentation refresh into the published tarball: `docs/shipped-assets.md` now lists `WRITING-RULES.md` and the 8 pitfall packs, `docs/voice-dna.md` documents the three rule layers and `draft` config knobs, `docs/configuration.md` documents the optional `draft` block defaults, `docs/command-reference.md` exposes the new `/scr:settings` knobs, `docs/architecture.md` extends "What the drafter receives" from 6 to 8 items with the override hierarchy
- aligned the reference documentation set on canonical `/scr:` command notation; runtime-specific shapes still appear in onboarding (`docs/getting-started.md`), README cross-runtime examples, and historical 1.5.1 release-notes prose
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
