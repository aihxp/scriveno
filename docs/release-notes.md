# Release Notes

This document is the public-facing summary of what changed between package releases. For package history, see the root [CHANGELOG](../CHANGELOG.md).

## 2.0.5 - 2026-05-15

### What changed

- Scriveno is now published under the npm package name `scriveno`.
- New installs should use `npx scriveno@latest`.
- The package executable remains `scriveno`, so the installer behavior and command surfaces are unchanged after installation.
- `/scr:sync` now recognizes both the new source package name `scriveno` and the legacy package name `scriveno-cli` when locating a local source checkout.
- Package and shipped metadata are aligned on `2.0.5`.

### Why it matters

The package name now matches the product name. This removes the extra `-cli` suffix from the install command and makes the npm surface easier to remember, while preserving the same installed command system.

Existing installed runtime surfaces do not need to change immediately. The old installed-command marker remains stable so local sync and compatibility checks can keep recognizing prior installs.

### Affected areas

- npm package metadata
- README install commands and badges
- runtime and architecture docs
- generated project config version
- `/scr:sync` source-root detection guidance
- release metadata and package tests

### Verification

- `npm test`
- `npm run pack:check`
- `git diff --check`

## 2.0.4 - 2026-05-15

### What changed

- Added Domain Grilling to Scriveno's Creative Context loop.
- `/scr:discuss` now checks fuzzy terms, overloaded labels, and project-behavior claims against existing source files before asking the writer. If the project already answers the question, Scriveno uses the file instead of making the writer repeat themselves.
- `/scr:plan` now carries resolved domain language into `## Domain Model Notes`, including canonical terms, terms to avoid, source-of-truth references, boundary examples, and durable updates for RECORD.md, REFERENCES.md, or adapted source files.
- The plan-checker agent now validates terminology and source-of-truth alignment before drafting, with stronger technical checks for command names, file paths, version boundaries, prerequisites, recovery steps, and procedure behavior.
- Technical REFERENCES.md now has dedicated canonical terminology and domain-boundary tables.
- Package and shipped metadata are aligned on `2.0.4`.

### Why it matters

Scriveno already preserved voice and continuity. `2.0.4` makes the project language itself harder to blur. When a writer says "account," "workspace," "source," "step," "doctrine," "promise," or any other term that can carry multiple meanings, Scriveno now checks the project, names conflicts early, and records the resolved term where future planning and drafting can find it.

This is most visible in technical, academic, sacred, series, and worldbuilding-heavy projects, but it helps any long work where consistency depends on precise language.

### Affected areas

- Creative Context documentation
- core planning loop (`/scr:discuss`, `/scr:plan`)
- plan-checker agent
- technical REFERENCES.md template
- README, changelog, release notes, and version metadata
- regression tests for terminology and boundary checks

### Verification

- `npm test`
- `npm run pack:check`
- `git diff --check`

## 2.0.3 - 2026-05-15

### What changed

- Integrated `authenticity-check` principles into Scriveno's Voice DNA diagnostic layer (the evaluative counterpart to the [`humanizer`](https://github.com/aihxp/humanizer) transform principles added in `2.0.2`).
- The voice-checker agent now runs a scrutiny pre-check (matching scrutiny to evidence density), a mandatory false-positive audit with veto power that converts strong false positives into score-raising human markers, and an internal-consistency check for register or sophistication seams.
- `/scr:voice-check` and `/scr:originality-check` now report an authenticity band (Reads human / Mixed signals / Reads AI-generated) first, then a 0-100 score, with required "Reads as human (deliberately not flagged)" and "Caveat" sections.
- `/scr:originality-check` no longer suggests rewritten spans; the diagnostic is now strictly diagnose, decide, transform, re-verify, with the rewrite handed to `/scr:line-edit` or `/scr:polish`.
- `WRITING-RULES.md` gained a "Diagnostic discipline (honest read)" section, and the drafter self-check is explicitly a write-to-the-voice judgement, not a score-then-rewrite loop.
- Package and shipped metadata are aligned on `2.0.3`.

### Why it matters

`2.0.2` taught Scriveno to *fix* AI-sounding prose without installing a new uniform style. `2.0.3` adds the missing other half: an honest *read* of how authentically prose sounds like the writer, kept deliberately separate from rewriting so it cannot become a score-then-rewrite gaming loop. The diagnostic now defaults to restraint (over-flagging genuine human prose is its worst error) and always names what it credited as human.

Voice DNA remains the top authority. The diagnostic measures deviation from the writer's voice, never against a generic ideal, and names no detector.

### Affected areas

- quality agent (`voice-checker`) and the diagnostic-only guard on the `drafter`
- diagnostic commands (`/scr:voice-check`, `/scr:originality-check`)
- Voice DNA support rules (`templates/WRITING-RULES.md`)
- Voice DNA, drafter-quality, and shipped-assets docs
- package metadata, README status, release notes
- regression tests for the diagnostic discipline

### Verification

- `npm test`
- `npm run pack:check`
- `git diff --check`

## 2.0.2 - 2026-05-15

### What changed

- Integrated additional `humanizer` principles into the universal Voice DNA support layer.
- `WRITING-RULES.md` now includes variance over substitution, sourced stance discipline, soft-inference checks, and anti-signature guidance.
- The drafter now checks that added stance stays tied to supplied material and that prose does not gain a new repetitive "humanized" rhythm.
- The voice-checker now flags humanizer signatures, soft-inference drift, and unsupported stance.
- `/scr:line-edit` and `/scr:polish` now report edit pressure, check soft inference, avoid formulaic humanizer cadence, and name what they deliberately left alone.
- Package and shipped metadata are aligned on `2.0.2`.

### Why it matters

The earlier human-first layer protected Scriveno from over-polishing the writer. `2.0.2` closes the next failure mode: replacing AI-sounding prose with a different predictable style. The rule layer now pushes edits toward the writer's actual distribution of rhythm, stance, and detail instead of a generic "more human" flavor.

Voice DNA remains the top authority. These principles live underneath it and serve the writer's style rather than replacing it.

### Affected areas

- Voice DNA support rules (`templates/WRITING-RULES.md`)
- quality agents (`drafter`, `voice-checker`)
- edit commands (`line-edit`, `polish`)
- Voice DNA and drafter-quality docs
- package metadata, README status, release notes, and shipped-assets docs
- regression tests for human-first writing principles

### Verification

- `npm test`
- `npm run pack:check`
- `git diff --check`

## 2.0.1 - 2026-05-14

### What changed

- `/scr:help` and `/scr:next` now use intent groups from `CONSTRAINTS.json` so the writer sees the most likely next surface for the current project state, not a catalog dump.
- `/scr:help` keeps new projects focused on start commands, fresh projects focused on drafting, drafted projects focused on review, complete drafts focused on publish/export, and drifted projects focused on repair.
- `/scr:next` now recommends one command with a short reason, then offers a few useful alternatives.
- `WRITING-RULES.md` gained human-first restraint, factual integrity, register-aware restraint, chat artifact cleanup, placeholder cleanup, and durable-doc wording guidance.
- The drafter, voice-checker, line-edit, and copy-edit contracts now preserve writer quirks, avoid invented support, preserve all required beats, respect formal registers, and reject copied chatbot residue.
- Package and shipped metadata are aligned on `2.0.1`.

### Why it matters

The `2.0.0` release made Scriveno's context layer broader and more reliable. `2.0.1` makes the front door and prose-quality layer calmer. Writers get fewer irrelevant options, and the quality rules now help without flattening the writer into generic polish.

Voice DNA remains the top authority. The new safeguards live underneath it: they catch risky AI habits, but they do not overrule a deliberate writer style.

### Affected areas

- navigation commands (`/scr:help`, `/scr:next`)
- command registry intent metadata (`data/CONSTRAINTS.json`)
- Voice DNA support rules (`templates/WRITING-RULES.md`)
- quality agents (`drafter`, `voice-checker`)
- edit commands (`line-edit`, `copy-edit`)
- package metadata, README status, release notes, and documentation
- regression tests for adaptive routing and human-first writing principles

### Verification

- `npm test`
- `npm run pack:check`
- `git diff --check`

## 2.0.0 - 2026-05-14

### What changed

- Added `RECORD.md`, a neutral store for what the work has established on page. It tracks open threads, reader promises, payoffs, continuity facts, movement, and next-unit obligations.
- Wired Record Notes through the core loop: discuss, plan, draft, editor review, next, progress, continuity, scan, save, drafter, and plan-checker.
- Added non-character subject tracking so Scriveno can serve essays, poetry, sacred commentary, technical guides, and other works where characters are not the right organizing model.
- Expanded character workflows with relationship and interaction paths, while letting character-driven works reuse the subject-tracking approach when useful.
- Added branching next-command suggestions across commands, with one to four practical next paths and a short explanation for each.
- Added `/scr:sync`, a local runtime-surface sync command that refreshes installed commands, Codex skills, command mirrors, and agent prompts from the current source tree.
- Bumped the package and shipped metadata to `2.0.0` and updated the documentation for the 112-command surface.

### Why it matters

`2.0.0` is the point where Scriveno's context model becomes broader than character continuity. Fiction still gets character and relationship intelligence, but nonfiction, technical writing, sacred commentary, poetry, and other forms now have an equally native way to track what the work has established.

The runtime sync command closes a separate trust gap: when command source changes, installed Codex or Claude surfaces can drift. `/scr:sync` gives contributors and power users a direct way to bring those installed surfaces back in line without treating it as a package update.

### Affected areas

- project templates (`RECORD.md`, config version)
- core commands (`new-work`, `import`, `discuss`, `plan`, `draft`, `editor-review`, `next`, `progress`, `scan`, `continuity-check`, `save`)
- character and subject commands
- agents (`drafter`, `plan-checker`)
- installed runtime maintenance (`/scr:sync`)
- docs, command reference, shipped assets, and release metadata
- regression tests and repository policy checks

### Verification

- `npm test`
- `npm run pack:check`
- `git diff --check`

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

**Context-integrity layer.** Three coordinated additions defend against context rot when a fresh AI session opens, when the writer hand-edits files outside Scriveno, or when a command is interrupted mid-run.

- `/scr:scan` -- 11 checks against STATE.md, OUTLINE.md, RECORD.md, drafts, STYLE-GUIDE.md mtime vs. last drafter run, scaffold elements still pending, stale exports, sacred config vs. shipped templates, CHARACTERS.md orphans. `--fix` mode for auto-correctable findings.
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
- Typst template (`data/export-templates/scriveno-book.typst` -- per-chapter running head)
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

`1.6.0` shipped before the repository documentation refresh landed. Writers running `npx scriveno-cli@1.6.0` got the new agents, templates, and settings but a thinner `~/.scriveno/docs/` tree. `1.6.1` closes that gap so the docs writers see in their installed tree match what is on GitHub.

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
- Added safe Claude cleanup so stale Scriveno-owned `scr-*.md` files and the old `scr/` folder are removed without touching unrelated commands
- Updated runtime docs and installer regression coverage around the Claude command surface

### Why it matters

`1.5.1` makes Claude Code feel native instead of carrying forward the older nested `/scr:*` shape. Writers now get one consistent command style in Claude, and reinstalling Scriveno stays clean without being destructive in the shared command directory.

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
- Tightened reinstall cleanup so stale Scriveno-owned Codex skill wrappers are removed without touching unrelated user files
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

- Normalized npm publish metadata for the `scriveno` installer command and repository URL
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
