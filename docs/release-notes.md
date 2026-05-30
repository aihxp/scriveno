# Release Notes

This document is the public-facing summary of what changed between package releases. For package history, see the root [CHANGELOG](../CHANGELOG.md).

## 2.8.0 - 2026-05-30

### What changed

- Scriveno can now install focused command profiles: `core`, `writing`, `publishing`, `translation`, `specialist`, or `full`. The new `/scr:surface` command and `scriveno surface` CLI helpers let writers inspect, dry-run, and switch profiles.
- Added `/scr:proof-unit`, a one-unit proof path that checks voice context, plans, drafts, reviews, context health, and optional export-tool readiness.
- Added context-health estimation to `scriveno status`, `/scr:next`, and `/scr:health --context`, with watch, tight, and critical thresholds.
- Added `/scr:export --check` and `/scr:publish --preflight` so tool readiness and publishing prerequisites can be verified before writing deliverables.
- Updated the public command inventory to 115 commands and added regression tests for profiles, dry-run installs, context health, proof-unit, and preflight surfaces.

### Why it matters

Writers can keep Scriveno small when they only need the active workflow, prove the product on one real unit before trusting a larger run, and check export or publishing readiness before generating packages.

## 2.7.2 - 2026-05-30

### What changed

- Progress ledger correctness: reviewed units with open editor notes now stay in progress instead of being counted as done. Submitted units still count as done, and clean reviews count as done when the workflow stops at review.
- `/scr:scan` now points its plan and review counts at the canonical `.manuscript/plans/` and `.manuscript/reviews/` directories, with legacy root-level fallbacks.
- The 2.7.1 release text now matches the actual `scriveno status` output.

### Why it matters

The progress bar now reflects the writer's real state of work: review notes still waiting on revision no longer look finished.

## 2.7.1 - 2026-05-30

### What changed

- `scriveno status` now prints the progress ledger directly (a `Progress:` line with the bar and done / in progress / untouched counts), so the deliverable view is visible from the bundled CLI, not only to runtimes that load the engine module.
- Documentation-integrity pass: corrected the context-integrity layer description (now five files), added `PROGRESS.md` to the scan trust-file lists and the architecture template tree, and refreshed stale version and count references across the docs.

### Why it matters

It closes the loop on the 2.7.0 progress ledger: the numbers are surfaced everywhere a writer looks, and the documentation matches the shipped behavior.

## 2.7.0 - 2026-05-30

### What changed

- Added a per-unit progress ledger: `.manuscript/PROGRESS.md` shows every unit as done / in progress / untouched, with a deliverable progress bar and pipeline position, and `/scr:progress` now leads with that view and points at the ledger file.
- `/scr:draft` and `/scr:autopilot` now narrate progress against the whole manuscript (unit N of total, percent).
- `lib/auto-invoke-engine.js` exposes `computeProgressLedger` so the ledger numbers are deterministic across runtimes; `docs/progress-protocol.md` documents the contract.

### Why it matters

Writers asked for one place to see what is done, in progress, and untouched without re-deriving it each time. The ledger is that file, and because it is derived from disk it cannot silently drift from the real state of the manuscript.

### Affected areas

- progress, draft, autopilot, outline, manuscript-stats, and scan commands
- the shared auto-invoke engine (computeProgressLedger)
- the trust-layer docs and templates

## 2.6.0 - 2026-05-29

### What changed

- Fixed a Pandoc-variable mismatch so RTL, CJK, and non-Latin fonts now reach the print and PDF path; added RTL support to the picturebook and stageplay templates (all four interior templates verified with `dir=rtl`).
- Made the voice-drift gate functional: `agents/voice-checker.md` now defines `drift = (100 - score) / 100`, so the default `voice.drift_threshold` of 0.3 means a re-draft is offered below a voice score of 70.
- Kept `/scr:autopilot-publish` fully unattended and advisory; a severe voice failure is surfaced loudly rather than halting the run.
- Corrected `/scr:quick-write` and `/scr:beta-reader` framing to match what they actually do.
- Marked the translation and illustration API tables as future targets, not shipped behavior.
- Audited and fixed documentation drift across the suite: command reference usage lines, the configuration baseline, the architecture file tree, voice-dna part numbering, the missing speech work type, and stale counts.
- Added `lib/track-safety.js` with adversarial tests, and `argument-hint` to 17 commands.

### Why it matters

This release closes the gap between what Scriveno documented and what it shipped. The export fix makes RTL and non-Latin print output actually work, the voice gate is now a real computed check instead of a phantom threshold, and the documentation no longer claims integrations or behavior that the prompt system does not provide.

### Affected areas

- export and print templates (RTL, CJK, fonts)
- voice-checker drift mapping and autopilot gates
- translation and illustration honesty
- documentation suite (command reference, configuration, architecture, voice-dna, README)
- track-safety helper and command argument hints
- package metadata and release-alignment tests

## 2.5.0 - 2026-05-16

### What changed

- Scriveno now ships `/scr:first-run`, an executable first-run path through install checks, demo proof, starter choices, and next commands.
- The public CLI now supports `scriveno first-run --project .`, giving terminal users the same proof path without relying on host-specific slash-command behavior.
- First-run guidance is connected to `/scr:help`, `/scr:demo`, Quick Proof, Starter Sets, Runtime Support, Shipped Assets, Command Reference, README launch copy, and architecture docs.
- Scriveno now includes committed first-run and runtime-parity proof bundles under `data/proof/`.
- Runtime smoke now validates the 115-command installed surface across Claude Code, Codex, Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, Antigravity, Manus, Perplexity Desktop, and the generic fallback.
- README badges, package metadata, constraints metadata, generated config metadata, changelog, release notes, configuration docs, route graph docs, architecture docs, proof docs, and release tests are aligned on `2.5.0`.

### Why it matters

The previous release documented a stronger proof path. This release makes that path executable. A new writer can install Scriveno, run one first-run command, inspect proof artifacts, create the demo, and move into drafting without having to assemble the path from documentation.

### Affected areas

- first-run command surface
- public CLI installer and smoke checks
- proof artifact bundles
- README badges and launch copy
- runtime support matrix
- command reference and route graph docs
- package metadata and generated project examples
- release-alignment tests

### Verification

- `npm run policy:check`
- `node --test test/first-run-proof-surface.test.js test/adaptive-concierge.test.js test/auto-invoke-engine.test.js test/command-surface-coherence.test.js test/collaboration-trust-surface.test.js test/package.test.js test/phase15-proof-artifacts-positioning.test.js`
- `npm test`
- `npm run release:check`
- `git diff --check`
- `scriveno first-run --project .`
- `scriveno smoke --json`

## 2.0.12 - 2026-05-16

### What changed

- Scriveno now ships [Quick Proof](quick-proof.md), a 10-minute route through install checks, the watchmaker demo, Voice DNA samples, runtime command shapes, and the next draft command.
- Scriveno now ships [Starter Sets](starter-sets.md), goal-based command paths for drafting, polishing, publishing, translation, sacred commentary, and repair.
- Scriveno now ships [Release Checklist](release-checklist.md), a maintainer path for local gates, stale install cleanup, packing, npm publishing, GitHub release creation, and fresh `scriveno@latest` verification.
- `npm run release:check` now includes `npm run policy:check`, which scans tracked text files for the repository writing policy before packaging.
- README badges, Getting Started, Proof Artifacts, Runtime Support, Development, Contributing, Testing, Shipped Assets, Route Graph, Configuration, changelog, package metadata, constraints metadata, generated config metadata, and release tests are aligned on `2.0.12`.

### Why it matters

The product already had proof artifacts, but the shortest path through them was too implicit. This release makes the first 10 minutes clearer for a new writer and makes the release process harder to drift by documenting and testing the local, npm, GitHub, and fresh-install verification path.

### Affected areas

- README badges and launch copy
- proof-first documentation
- starter command guidance
- release checklist and testing docs
- writing-policy release gate
- package metadata and generated project examples
- planning state and release-alignment tests

### Verification

- `node --test test/first-run-proof-surface.test.js test/package.test.js test/phase16-trust-regression.test.js test/phase14-runtime-credibility.test.js`
- `npm run policy:check`
- `npm run release:check`
- `node bin/install.js routes --json`
- `node bin/install.js agents --json`
- `node bin/install.js sync --check --json`
- `node bin/install.js smoke --json`
- `npm audit --omit=dev --json`
- `git diff --check`

## 2.0.11 - 2026-05-16

### What changed

- Scriveno received a full repo audit across 500 tracked files and the latest 242-file package surface.
- The sacred numbering command now consistently advertises `/scr:sacred-numbering-format` instead of the stale `/scr:sacred-verse-numbering` name.
- Sacred doctrine and lineage templates now point to `/scr:sacred:doctrinal-check`, matching the shipped command surface.
- The demo manuscript plan now tells users to run `/scr:draft 5` instead of the removed `/scr:draft-scene 5` command.
- Archived planning summaries no longer use decorative test-output markers that violate the repository writing policy.
- README badges, Route Graph, Configuration, changelog, package metadata, constraints metadata, generated config metadata, and release tests are aligned on `2.0.11`.

### Why it matters

This release tightens the shipped surface after the automation releases. Writers should see current command names in docs, templates, demo files, and installed runtime copies. Developers now have a cleaner package baseline before the next milestone begins.

### Affected areas

- command documentation
- sacred project templates
- demo manuscript assets
- release metadata
- planning state
- README badge and status copy
- cross-runtime installed surfaces
- regression tests for release metadata and sacred command naming

### Verification

- `npm run release:check`
- `node bin/install.js routes --json`
- `node bin/install.js agents --json`
- `node bin/install.js sync --check --json`
- `node bin/install.js smoke --json`
- `npm audit --omit=dev --json`
- `npm pack --dry-run`
- `git diff --check`
- repository policy scan for em dashes, en dashes, and decorative emoji-style markers

## 2.0.10 - 2026-05-16

### What changed

- `scriveno status --project . --apply-safe` now runs the read-only proactive checks and reports safe helpers, agent candidates, and write-gated actions.
- `scriveno sync --check` now produces a read-only sync transcript with project status, safe apply, agent availability, and runtime smoke.
- `scriveno smoke`, `scriveno agents`, and `scriveno routes` expose installed-surface checks, agent prompt and metadata checks, and generated route graph audits.
- Runtime checks cover Claude Code, Codex, Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, Antigravity, Manus, Perplexity Desktop, and the generic skill fallback through the shared engine.
- README badges, Runtime Support, Auto-Invoke Policy, Architecture, Getting Started, Testing, sync command docs, Route Graph Audit, changelog, and package metadata are aligned on `2.0.10`.

### Why it matters

The previous releases made proactive routing visible. This release makes the support tooling executable. Users can now ask Scriveno what is safe to run, whether installed agent surfaces are present, whether Codex metadata is ready, and how every route fits into the automation graph without relying on a hidden host-specific behavior.

### Affected areas

- shared auto-invoke engine
- public CLI audit commands
- runtime smoke and agent availability checks
- route graph audit docs
- README badges and launch copy
- architecture, runtime support, auto-invoke policy, getting started, testing, and sync command docs
- package metadata and generated project examples
- regression tests for safe apply, runtime smoke, agent availability, and route graph coverage

### Verification

- `node --test test/auto-invoke-engine.test.js`
- `node --test test/installer.test.js`
- `npm test`
- `npm run release:check`
- `npm pack --json`
- `git diff --check`

## 2.0.9 - 2026-05-16

### What changed

- `scriveno status --project .` now detects connected workflow gaps instead of only broad project state.
- The shared engine can route planned-but-undrafted work to `/scr:draft`, drafts without review coverage to `/scr:editor-review`, unresolved notes to `/scr:check-notes`, revision proposals to `/scr:editor-review --proposal`, translation work to verification follow-ups, and publishing gaps to the specific missing prerequisite.
- Status output now separates `Candidate agents`, `Candidate local helpers`, and `Manual gates`.
- Every command registry category now has an automation lane through `getCommandAutomationPolicy()`.
- Markdown fallback contracts for `/scr:next`, `/scr:progress`, `/scr:session-report`, `/scr:save`, `/scr:scan`, and `/scr:health` now show the same route-intelligence shape when a host cannot call the Node engine.
- README badges, README status copy, Architecture, Auto-Invoke Policy, Configuration, changelog, and package metadata are aligned on `2.0.9`.

### Why it matters

The status engine now connects previously separate flows. A writer can see whether Scriveno is recommending an agent-backed route, a deterministic local helper, or a writer-owned manual action. That makes automation more proactive without making it mysterious or pushy.

### Affected areas

- shared auto-invoke engine
- public status CLI output
- route automation policy
- command fallback status blocks
- README badges and launch copy
- architecture and auto-invoke documentation
- package metadata and generated project examples
- regression tests for route intelligence and command policy coverage

### Verification

- `npm test`
- `npm run release:check`
- `npm pack --json`
- `git diff --check`

## 2.0.8 - 2026-05-16

### What changed

- Scriveno now exposes proactive project status through `scriveno status --project .` and `scriveno status . --json`.
- A shared read-only engine at `lib/auto-invoke-engine.js` computes status from disk evidence and recommends the safest next command.
- The installer copies the engine into Scriveno shared assets for global and project installs, so Claude Code, Codex, Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, Antigravity, Manus, Perplexity Desktop, and the generic fallback can share the same status contract.
- `/scr:next`, `/scr:progress`, `/scr:session-report`, and `/scr:sync` now try the public status CLI first, then fall back to source, global, or project engine paths.
- The README now includes a status CLI badge, quick-start status command, proactive status section, and a direct Auto-Invoke Policy link.
- Package and shipped metadata are aligned on `2.0.8`.

### Why it matters

The previous release made automation visible. This release makes the safest read-only part executable as a real package surface. Users and host runtimes can now ask Scriveno what the project needs next without relying on a hidden background process or a Codex-only path.

The engine still does not mutate files or spawn agents by itself. It gives a consistent, inspectable status answer; command workflows decide what to run next.

### Affected areas

- public CLI
- shared auto-invoke engine
- installer shared assets
- `/scr:next`, `/scr:progress`, `/scr:session-report`, and `/scr:sync`
- README badges and launch copy
- runtime support and auto-invoke documentation
- release metadata and package contents
- regression tests for CLI output, JSON output, install assets, and package inclusion

### Verification

- `node --test`
- `npm run release:check`
- `npm pack --dry-run --json`
- `git diff --check`

## 2.0.7 - 2026-05-16

### What changed

- Codex installs now generate agent metadata beside Scriveno agent prompts so native agent spawning can work when the host exposes those roles.
- Non-Codex runtimes keep their own install surfaces: Claude Code flat commands and agents, command-directory runtimes, skill-file runtimes, Manus, guided Perplexity Desktop setup, and the generic fallback.
- Scriveno now has a shared auto-invoke policy for read-only suggestions, deterministic local helpers, scoped agent spawns, and manual-only writer actions.
- `/scr:next` and `/scr:progress` now do read-only proactive checks and explain what they found.
- `/scr:save`, `/scr:scan`, `/scr:health`, `/scr:session-report`, `/scr:sync`, and multi-agent workflows now show visible status blocks that say what spawned, what ran locally, and why.
- Package and shipped metadata are aligned on `2.0.7`.

### Why it matters

Writers and developers should not have to guess whether Scriveno used a native agent, a prompt fallback, or a local file operation. This release makes those paths visible and keeps runtime behavior honest across Codex, Claude Code, and the other supported install targets.

The practical effect is calmer automation: Scriveno can be more proactive about the next safe move, while still keeping writer-owned actions like publishing, destructive edits, merges, and submissions behind explicit approval.

### Affected areas

- Codex agent metadata generation
- Claude Code and other runtime install verification
- proactive command guidance
- local helper visibility
- `/scr:sync` status reporting
- README, changelog, release notes, and version metadata
- regression tests for agent spawning, prompt fallback, and runtime install surfaces

### Verification

- `node --test`
- `npm run release:check`
- `git diff --check`

## 2.0.6 - 2026-05-15

### What changed

- New installed command files now use the `scriveno-installed-command` ownership marker.
- New installed manifests now record `installer: "scriveno"`.
- Existing installs that still contain the older `scriveno-cli-installed-command` marker remain supported for cleanup and sync detection.
- `/scr:sync` now documents the current marker and treats the older marker as compatibility-only input.
- Package and shipped metadata are aligned on `2.0.6`.

### Why it matters

This finishes the visible package rename for new runtime installs. Writers still install with `npx scriveno@latest`, and freshly generated local metadata now matches that package name without breaking older installed command surfaces.

### Affected areas

- installer-generated command markers
- installed runtime manifests
- `/scr:sync` guidance
- README, changelog, release notes, and version metadata
- regression tests for package-name compatibility

### Verification

- `npm test`
- `npm run pack:check`
- `git diff --check`

## 2.0.5 - 2026-05-15

### What changed

- Scriveno is now published under the npm package name `scriveno`.
- New installs should use `npx scriveno@latest`.
- The package executable remains `scriveno`, so the installer behavior and command surfaces are unchanged after installation.
- `/scr:sync` now recognizes both the new source package name `scriveno` and the legacy package name `scriveno-cli` when locating a local source checkout.
- Package and shipped metadata are aligned on `2.0.5`.
- The older `scriveno-cli` package name was unpublished during the rename, so npm cannot show a deprecation notice for it unless a compatibility shim is republished under that name.
- The older `scriven-cli` package name remains on npm as a deprecated legacy package and now points users to `npx scriveno@latest`.

### Why it matters

The package name now matches the product name. This removes the extra `-cli` suffix from the install command and makes the npm surface easier to remember, while preserving the same installed command system.

Existing installed runtime surfaces do not need to change immediately. The old installed-command marker remains stable so local sync and compatibility checks can keep recognizing prior installs.

For contributors: treat `scriveno` as the only active npm package name. Do not assume `scriveno-cli` can be deprecated in place while it remains unpublished, and do not revive `scriven-cli` except for a deliberate compatibility transition.

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
