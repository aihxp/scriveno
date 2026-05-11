# Release Notes

This document is the public-facing summary of what changed between package releases. For package history, see the root [CHANGELOG](../CHANGELOG.md).

## 1.7.1 - 2026-05-11

### What changed

- Fixed a generated install-name collision between the top-level sacred verse-numbering compatibility command and the nested sacred verse-numbering command
- Standardized sacred project configuration on top-level profile keys, with legacy nested `sacred` fallbacks kept for existing projects
- Matched sacred tradition validation to the shipped profile slugs: `catholic`, `orthodox`, `tewahedo`, `protestant`, `jewish`, `islamic-hafs`, `islamic-warsh`, `pali`, `tibetan`, and `sanskrit`
- Made ebook platform selection operational by validating `--platform`, loading platform manifests, checking EPUB support, and writing selected platform metadata
- Corrected workflow dependency metadata so plan, draft, review, and submit paths point at the canonical `.manuscript/` trees
- Refreshed repository documentation across root docs, `docs/`, template READMEs, release notes, package metadata, shipped-profile READMEs, and regression coverage for the new audit guarantees

### Why it matters

`1.7.1` closes audit findings on top of the `1.7.0` character-continuity and context-integrity release. It keeps the new character, scan, context, and export behavior intact while tightening the command, workflow, platform, package, and writing-policy contracts.

### Affected areas

- installer command generation
- sacred project config and tradition profiles
- ebook platform build guidance
- workflow dependency metadata
- repository documentation and release-facing package metadata
- regression tests and npm release checks

### Verification

- `npm test` (1629 tests pass)
- `npm run pack:check`
- `git diff --check`

## 1.7.0 - 2026-05-10

### What changed

Two real defects fixed and three new systems shipped.

**The character-continuity defect.** The drafter was loading "CHARACTERS.md / FIGURES.md (relevant figures only)" -- relevance determined by who was named in the unit's plan. A character created via `/scr:new-character` after some plans were already written was never referenced in those older plans, so the drafter never loaded their entry. The character existed in CHARACTERS.md but never reached the prose. Fixed: the drafter now loads the full file by default at the `standard` profile. The relevance filter remains as `draft.context_profile: minimal` (explicit token-trim opt-in) and now warns that newly added characters get dropped at that level.

**The character-state defect.** Nothing in the workflow updated CHARACTERS.md after units were drafted. The "current emotional state" field was frozen at character creation, so the drafter for chapter 12 still saw chapter 1's setup. Fixed: new `/scr:character-touch <name>` command for updating evolving state (emotional position, knowledge, possessions, relationships) after a unit lands. The drafter now emits one-line `CHARACTER STATE NUDGE` suggestions when it spots a visible state shift, pointing the writer at the new command. Voice anchor and physical description stay untouched -- those are identity, not state.

**Context-integrity layer.** Three coordinated additions defend against context rot when a fresh AI session opens, when the writer hand-edits files outside Scriven, or when a command is interrupted mid-run.

- `/scr:scan` -- 10 checks against STATE.md, OUTLINE.md, drafts, STYLE-GUIDE.md mtime vs. last drafter run, scaffold elements still pending, stale exports, sacred config vs. shipped templates, CHARACTERS.md orphans. `--fix` mode for auto-correctable findings.
- `.manuscript/CONTEXT.md` -- one-page bootstrap auto-regenerated on save / pause / resume. Read first by `/scr:next` and `/scr:resume-work`.
- `.manuscript/HISTORY.log` -- append-only audit trail (pipe-delimited, UTC ISO timestamps, committed to git). Wired into 10 state-mutating commands.

**Export polish.** `/scr:publish` and `/scr:export` got destination-neutral presets and interactive pickers so writers can hand someone a single PDF/DOCX/EPUB without thinking about KDP. Front and back matter generation gained `--level minimum/balanced/maximum` plus a skip prompt. The Typst book template's running head now updates per chapter on recto pages instead of repeating the book title across every spread.

**Installer hardening.** A real flat/nested skill-name collision was silently dropping `commands/scr/sacred-verse-numbering.md` against `commands/scr/sacred/verse-numbering.md` on every install. Renamed the flat file to `sacred-numbering-format.md`. Added `assertNoSkillNameCollisions` guard so future regressions fail loudly. New `test/runtime-parity.test.js` pins that Claude and Codex install the same set of commands.

**Context-cost optimization.** 12 high-impact commands now read CONTEXT.md first when fresh and skip the redundant raw-file orientation loads. Per-command savings on a CONTEXT.md hit: ~200-500 lines collapse to one ~30-line read. Savings compound across chained commands (autopilot, publish presets).

### Why it matters

The character defects are correctness defects. A character profile that does not reach the drafter is not just inefficient -- it produces wrong prose. A character whose "current state" never updates produces continuity errors that are hard to spot and harder to fix in revision. Both are now closed.

The context-integrity layer is the defense against the silent failure mode where a fresh AI session opens to a project, reads STATE.md, and proceeds with confidence in numbers that no longer match disk reality. `/scr:scan` makes that confidence earned, not assumed.

### Affected areas

- core agents (`agents/drafter.md` -- character loading + state nudge)
- new commands (`/scr:scan`, `/scr:character-touch`)
- new templates (`templates/CONTEXT.md`)
- new docs (`docs/context-protocol.md`, `docs/history-protocol.md`)
- 12 commands updated for context-cost protocol
- export surfaces (`/scr:publish`, `/scr:export`, `/scr:autopilot-publish`)
- front/back matter (`/scr:front-matter`, `/scr:back-matter` -- new `--level` flag and skip prompt)
- Typst template (`data/export-templates/scriven-book.typst` -- per-chapter running head)
- installer (`bin/install.js` -- collision guard, namespace preservation in constraint-key lookup)
- session commands (`/scr:save`, `/scr:pause-work`, `/scr:resume-work`, `/scr:next` -- CONTEXT.md regeneration / preference)

### Backward compatibility

- Existing projects keep working without modification.
- `/scr:front-matter` and `/scr:back-matter` scripted callers without `--level` get the interactive prompt; pass `--level maximum` to preserve the legacy "all elements" behavior silently.
- The context preference protocol explicitly preserves correctness on a CONTEXT.md miss -- commands fall back to raw-file loads when CONTEXT.md is absent, stale, or contradicts STATE.md.
- The `minimal` context profile still filters characters per the old behavior for writers who explicitly opt in.

### Verification

- `npm test` (1629 tests pass; 1617 in 1.6.1 + 12 net new)
- `npm pack --dry-run` confirms the new docs and commands ship in the tarball

## 1.6.1 - 2026-05-07

### What changed

- Brought the post-`1.6.0` repository documentation refresh into the published tarball: `docs/shipped-assets.md`, `docs/voice-dna.md`, `docs/configuration.md`, `docs/command-reference.md`, and `docs/architecture.md` all updated to document `WRITING-RULES.md`, the per-work-type pitfall packs, the `draft` config block, and the override hierarchy
- Aligned the reference documentation on canonical `/scr:` command notation; onboarding (`docs/getting-started.md`), README cross-runtime examples, and historical 1.5.1 release-notes prose still use Claude flat `/scr-*` and Codex `$scr-*` where contextually appropriate
- No code, agent, command, or template changes; runtime behavior is identical to `1.6.0`

### Why it matters

`1.6.0` shipped before the repository documentation refresh landed. Writers running `npx scriven-cli@1.6.0` got the new agents, templates, and settings but a thinner `~/.scriven/docs/` tree. `1.6.1` closes that gap so the docs writers see in their installed tree match what is on GitHub.

### Affected areas

- public docs only (no source, agent, command, or template behavior change)
- npm tarball contents (the `docs/` directory)

### Verification

- `npm test` (1617 tests pass; same suite as 1.6.0)
- `npm pack --dry-run` confirms the refreshed docs ship in the tarball

## 1.6.0 - 2026-05-05

### What changed

- Added `templates/WRITING-RULES.md`: a one-screen canonical list of universal AI-tell don'ts, loaded by the drafter, voice-checker, and originality-check after `STYLE-GUIDE.md`
- Added per-work-type pitfall packs under `templates/pitfalls/<work_type>.md` for novel, memoir, screenplay, runbook, research_paper, poetry_collection, comic, and commentary; drop-in extension supported with no library or constraint edits
- Added a `draft` block to `templates/config.json` with three optional knobs: `rigor` (`standard|strict`), `context_profile` (`minimal|standard|full`), and `pitfalls_enabled` (`true|false`)
- Exposed the new knobs in `/scr:settings`; replaced the 3-genre hardcode in `/scr:line-edit` with pack-aware lookup
- Added `lib/architectural-profiles.js#listPitfallPacks` and `getPitfallPackPath`, re-exported from `bin/install.js`
- Added `docs/drafter-quality.md` documenting the three rule layers, settings, and model-tier recommendations
- Added 23 new tests covering pack registration, drop-in extensibility, config schema, and drafter contract

### Why it matters

`1.6.0` introduces layered rule scaffolding designed to keep weaker models from drifting into generic AI prose. Conflict resolution is top-down: `STYLE-GUIDE.md` beats `WRITING-RULES.md` beats the pitfall pack. The writer's voice stays sovereign; the new rule layers are scaffolding, not constraints.

### Affected areas

- drafter agent contract
- voice-checker and originality-check pattern detection
- line-edit and polish cliche detection
- new-work and import onboarding (project provisioning)
- project config schema (`.manuscript/config.json` `draft` block)
- public docs and CHANGELOG

### Backward compatibility

Every layer is optional. Projects predating `1.6.0` keep working: WRITING-RULES.md absent falls back to inline rules, missing pitfall packs skip silently, and an absent `draft` block uses standard defaults.

### Verification

- `npm test` (1617 tests pass)
- `npm pack --dry-run` confirms WRITING-RULES.md, all 8 pitfall packs, and `docs/drafter-quality.md` ship in the tarball

## 1.5.3 - 2026-04-18

### What changed

- Packaged the workflow-contract hardening that landed after `1.5.2`
- Tightened save-history, compare, undo, session-report, and revision-track guidance so writer-facing commands match the live git/state contract
- Aligned README, configuration, release, and command-reference trust surfaces with the shipped 108-command package state

### Why it matters

`1.5.3` turns the repo's post-`1.5.2` hardening work into the current published package baseline. Writers get safer save/version/session behavior, more truthful collaboration and help surfaces, and cleaner agreement between package metadata, generated project config, and the public docs.

### Affected areas

- writer-facing save/version/session workflows
- revision-track and collaboration guidance
- package metadata, config scaffolding, and release-facing documentation

### Verification

- `npm test`

## 1.5.2 - 2026-04-09

### What changed

- Added safer revision-track contracts so canon resolution no longer assumes `main` or `master`
- Tightened structure-editing workflows to operate on the canonical `.manuscript/drafts/body/` tree
- Extended workflow-integrity and track-safety regression coverage around those command contracts

### Why it matters

`1.5.2` closes a couple of trust gaps in writer-facing workflow commands without changing the overall product surface. Draft renumbering commands now point at the live manuscript tree, and revision tracks are more portable across repos that use custom default branch names such as `trunk`.

### Affected areas

- structure-management command guidance
- revision-track command guidance
- workflow-integrity and track-safety tests

### Verification

- `node --test test/phase39-workflow-contract-integrity.test.js test/track-command-safety.test.js`
- `npm test`

## 1.5.1 - 2026-04-09

### What changed

- Switched Claude Code installs to flat `/scr-*` commands such as `/scr-next` and `/scr-help`
- Rewrote installed Claude command references so in-command guidance matches the new slash syntax
- Added safe Claude cleanup so stale Scriven-owned `scr-*.md` files and the old `scr/` folder are removed without touching unrelated commands
- Updated runtime docs and installer regression coverage around the Claude command surface

### Why it matters

`1.5.1` makes Claude Code feel native instead of carrying forward the older nested `/scr:*` shape. Writers now get one consistent command style in Claude, and reinstalling Scriven stays clean without being destructive in the shared command directory.

### Affected areas

- Claude Code installer path and command layout
- installed command rewriting for Claude help text
- runtime-facing docs and onboarding
- installer and trust-regression tests

### Verification

- `node --check bin/install.js`
- `node --test test/installer.test.js test/phase14-runtime-credibility.test.js test/phase16-trust-regression.test.js`
- temporary HOME smoke install for `--runtime claude-code --global --writer --silent`

## 1.5.0 - 2026-04-09

### What changed

- Added explicit non-interactive installer flags for runtime selection, scope, mode, help, and version output
- Added one-run multi-runtime installs so Codex and Claude Code can be targeted together
- Generated native Codex `$scr-*` skills backed by mirrored installed command markdown
- Tightened reinstall cleanup so stale Scriven-owned Codex skill wrappers are removed without touching unrelated user files
- Updated runtime docs and onboarding copy so Codex and Claude examples match the installer contract now shipped in the package

### Why it matters

`1.5.0` turns the installer into a more dependable real-world surface instead of a prompt-only setup path. Codex users now get native `$scr-*` discovery, Claude Code users keep a clean command-directory install, and the package ships tests and docs that keep those claims honest.

### Affected areas

- installer CLI and runtime registry
- Codex skill generation and runtime cleanup
- runtime-facing docs and onboarding
- installer and trust-regression tests

### Verification

- `node --test test/installer.test.js test/phase14-runtime-credibility.test.js test/phase16-trust-regression.test.js`
- `npm test`
- `npm pack --dry-run`

## 1.4.1 - 2026-04-09

### What changed

- Normalized npm publish metadata for the `scriven` installer command and repository URL
- Marked the packaged installer entrypoint as executable
- Updated package-level regression coverage so the publish-safe bin path stays locked in

### Why it matters

`1.4.1` does not add new writer-facing features. It makes the npm package cleaner and less surprising after the `1.4.0` release by aligning the published metadata with what npm actually expects.

### Affected areas

- npm packaging metadata
- installer entrypoint permissions
- package-time regression checks

### Verification

- `npm test`
- `npm pack --dry-run`
