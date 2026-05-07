# Release Notes

This document is the public-facing summary of what changed between package releases. For package history, see the root [CHANGELOG](../CHANGELOG.md).

## 1.6.1 - 2026-05-07

### What changed

- Brought the post-`1.6.0` documentation deck refresh into the published tarball: `docs/shipped-assets.md`, `docs/voice-dna.md`, `docs/configuration.md`, `docs/command-reference.md`, and `docs/architecture.md` all updated to document `WRITING-RULES.md`, the per-work-type pitfall packs, the `draft` config block, and the override hierarchy
- Aligned the reference documentation on canonical `/scr:` command notation; onboarding (`docs/getting-started.md`), README cross-runtime examples, and historical 1.5.1 release-notes prose still use Claude flat `/scr-*` and Codex `$scr-*` where contextually appropriate
- No code, agent, command, or template changes; runtime behavior is identical to `1.6.0`

### Why it matters

`1.6.0` shipped before the documentation deck refresh landed. Writers running `npx scriven-cli@1.6.0` got the new agents, templates, and settings but a thinner `~/.scriven/docs/` tree. `1.6.1` closes that gap so the docs writers see in their installed tree match what is on GitHub.

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
