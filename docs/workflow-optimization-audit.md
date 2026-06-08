# Workflow Optimization Audit

Date: 2026-06-08

This audit reviews Scriveno's UX flows, user journeys, command flows, and workflow graph for improvement, redundancy, optimization, and consolidation opportunities without removing features.

## Current Shape

- 122 runnable commands.
- 14 command categories.
- 144 route graph edges.
- 9 primary intent journeys in `command_intents`: start, draft, revise, world, navigate, publish, translate, collaborate, repair.
- 9 secondary hub families in `command_families`: structure, art, session, sacred, submission, publishing, world, collaboration, surface.
- 6 install surface profiles: core, writing, publishing, translation, specialist, full.
- Runtime smoke checks pass across the installed command surfaces.
- Workflow reference integrity checks pass for current docs and commands.
- Proof claims now have explicit evidence levels and replay-tested fixtures for the most important flows.

## What Is Working

- `/scr:next`, `/scr:help`, and `/scr:do` already act as front doors instead of forcing writers to learn the whole command catalog.
- Starter Sets give practical short paths for first-run, drafting, polishing, world and research, publishing, translation, sacred commentary, and repair.
- Surface profiles already support feature-preserving command reduction. A writer can install a smaller visible surface without changing manuscript data.
- The final `Next commands:` contract is now consistent across every writer-facing command.
- Route graph and runtime smoke checks are executable, not only documented.
- Voice and authenticity workflows now treat outside AI-detector reports as triage context, not as a rewrite target.

## Improvements Applied

### 1. Generated Manifest Description Drift

Finding: command descriptions were duplicated between command frontmatter and `data/CONSTRAINTS.json`. The command files and command reference already treat command frontmatter as the writer-facing source, but generated skill manifests previously let `CONSTRAINTS.json` override that copy.

Impact: installed skill manifests could describe a command differently from the actual command file.

Change: generated command inventory now prefers command frontmatter descriptions, using `CONSTRAINTS.json` only as fallback. Added a regression test that every generated manifest row matches command frontmatter.

Status: fixed.

### 2. Surface Profile Visibility

Finding: surface profiles existed but were easy to miss during onboarding.

Change: first-run and starter guidance now show `/scr:surface status` and `/scr:surface profile writing --dry-run`. Interactive installs now ask which command profile to install, defaulting to `full` while making `writing` visible for active drafting.

Status: implemented.

### 3. Secondary Command Families

Finding: `command_intents` correctly covered the primary lifecycle, but specialist commands needed a discoverable hub layer.

Change: added `command_families` to `data/CONSTRAINTS.json`, exposed families in `scriveno routes`, added route graph family-member edges, and taught connectivity checks to treat families as real discoverability paths.

Status: implemented.

### 4. Hub-First Help, Next, And Do

Finding: specialist commands should stay available without turning `/scr:help` or `/scr:next` into a catalog.

Change: `/scr:help`, `/scr:next`, and `/scr:do` now load `command_families` and route specialist requests through hubs: `/scr:outline`, `/scr:art-direction`, `/scr:save`, `/scr:sacred:source-tracking`, `/scr:publish`, `/scr:build-world`, `/scr:track`, and `/scr:surface`.

Status: implemented.

### 5. Publish, Export, And Build Boundaries

Finding: publishing commands were powerful but easy to misread as overlapping.

Change: `/scr:publish`, `/scr:export`, `/scr:build-ebook`, `/scr:build-print`, `/scr:build-smashwords`, and `/scr:build-poetry-submission` now state the boundary near the top of the command. `/scr:help` and `/scr:next` carry the same mental model.

Status: implemented.

### 6. Detector-Aware Authenticity Flow

Finding: a high outside AI-detector score can create a bad workflow loop: the writer asks for authenticity help, the system overreacts, and prose gets pushed toward detector gaming or a mechanical humanizer signature instead of the writer's voice.

Impact: this is a UX and trust problem, not only a prose problem. A writer needs a calm path from "this detector flagged me" to "what should I inspect, what evidence do I preserve, and what should I edit for craft?"

Change: the universal writing rules, drafter, voice-checker, `/scr:voice-check`, `/scr:originality-check`, `/scr:line-edit`, and `/scr:polish` now treat external detector scores as context only. New projects carry an `authenticity` config block, diagnostics report process evidence, and [Authenticity And AI Detectors](authenticity-and-detectors.md) documents the research stance and operating workflow.

Status: implemented.

### 7. Proof Depth And Replayability

Finding: proof bundles were inspectable but not replayable. They showed workflow shape, but they did not yet turn the key claims into regression evidence.

Impact: the strongest claims, voice preservation and next-step routing, need tests that fail when the proof surface drifts.

Change: added `data/proof/replay/golden-workflows.json` for flagship novel, technical runbook, and publishing-package route decisions. Added `data/proof/voice-dna/eval-fixtures.json` plus `lib/voice-dna-eval.js` for the watchmaker paired samples. Added `test/proof-replay.test.js` to run both layers.

Status: implemented.

### 8. Host-Capture Queue

Finding: host-runtime parity was honest but still too abstract. The protocol existed, but the next captures were not concrete targets.

Impact: users need to see the order of proof work and the exact directories where host transcripts will land.

Change: added `data/proof/runtime-parity/capture-status.json` and reserved queued capture folders for Claude Code, Codex, and one standard command-directory runtime. These are marked `host-capture-ready`, not `host-captured`.

Status: implemented.

### 9. Installer Seam Extraction And Generated Contracts

Finding: the installer was becoming a maintainability bottleneck, and repeated command contracts were protective but expensive to maintain manually.

Impact: future bugs are most likely to hide in installer metadata, command generation, and repeated response contracts.

Change: extracted runtime and surface-profile metadata into `lib/installer-runtime-registry.js`. Added `lib/command-contracts.js` so installed command output can generate a fallback `Next commands:` contract if a source command ever misses it. The source command files still carry their standalone contract blocks.

Status: implemented.

## High-Value Opportunities

### 1. Make Surface Profiles More Visible

Problem: the default installed profile is `full`, so a new user may see all 122 commands even though profile reduction already exists.

Recommendation: keep `full` available, but make `/scr:surface status` and `/scr:surface profile writing --dry-run` more visible in first-run and starter paths.

Why this preserves features: no command is deleted. The full profile remains one command away.

Status: implemented.

### 2. Add Secondary Journey Families

Problem: `command_intents` covers the main journey spine, but 53 commands are outside primary intent chains. Many are valid specialist leaves: art, sacred tools, structure management, session tools, and submission helpers.

Recommendation: add a second metadata layer such as `command_families` or secondary intents:

- `structure`: outline, add-unit, insert-unit, remove-unit, split-unit, merge-units, reorder-units.
- `art`: art-direction, cover-art, illustrate-scene, character-ref, map-illustration, chapter-header, storyboard, panel-layout, spread-layout.
- `session`: save, history, versions, compare, session-report, pause-work, resume-work, undo.
- `sacred`: sacred:source-tracking, sacred:concordance, sacred:cross-reference, sacred:genealogy, sacred:chronology, sacred:annotation-layer, sacred:verse-numbering, sacred-numbering-format, sacred:doctrinal-check.
- `submission`: synopsis, query-letter, book-proposal, discussion-questions, submit.

Why this preserves features: primary `command_intents` can stay compact while the route graph gains discoverable specialist paths.

Status: implemented.

### 3. Keep Specialist Commands, Consolidate Entry Points

Problem: several command families are intentionally granular but feel redundant when seen flat:

- Structure management: add, insert, remove, split, merge, reorder.
- Publishing: publish, export, build-ebook, build-print, build-smashwords, build-poetry-submission.
- Session state: save, history, versions, compare, session-report, progress.
- World state: build-world, new-place, place-touch, geography-map.

Recommendation: keep direct commands for power users, but make hubs more explicit:

- `/scr:outline` as the structure hub.
- `/scr:publish` as the publishing wizard.
- `/scr:surface` as the command-surface hub.
- `/scr:build-world` as the world hub.
- `/scr:track` as the collaboration hub.

Why this preserves features: direct specialist commands remain runnable, while most users enter through one hub.

Status: implemented.

### 4. Clarify Publish Versus Export Versus Build

Problem: the publishing surface is powerful but easy to misread.

Recommended mental model:

- `/scr:publish`: destination wizard and sequencing.
- `/scr:export`: one-off format output.
- `/scr:build-ebook`, `/scr:build-print`, `/scr:build-smashwords`, and `/scr:build-poetry-submission`: final package builders for a specific channel or format.
- `/scr:front-matter` and `/scr:back-matter`: content creation before packaging.
- `/scr:prepublish-review`: final editorial gate.

This distinction should stay visible anywhere publishing choices are shown.

Status: implemented.

### 5. Treat Repeated Response Contracts As Load-Bearing

Problem: the same response contract appears in all 122 command files.

Recommendation: do not remove it from command files until the installer has a safe include or injection mechanism. Each installed command must stand alone in host agents, so repetition is currently protective.

Future optimization: generate or inject the shared contract during install, then test the installed output rather than hand-maintaining the block in every source command.

### 6. Keep Authenticity Help Away From Detector Gaming

Problem: authenticity concerns can arrive through outside detector reports, but Scriveno should not become a detector-optimization tool. Chasing a vendor score would weaken the Voice DNA promise and can make prose less human by installing a new regular pattern.

Recommendation: keep `/scr:voice-check` and `/scr:originality-check` diagnose-only, keep `/scr:line-edit` and `/scr:polish` as separate writer-chosen transforms, and preserve process evidence such as STYLE-GUIDE.md, plans, drafts, reviews, HISTORY.log, saves, and accepted revisions.

Why this preserves features: writers can still bring detector reports into the workflow, but those reports decide where to look first, not what the prose must become.

Status: implemented.

### 7. Make Proof Claims Badged And Replayable

Problem: claims such as "voice-preserving" or "runtime-supported" can sound equally strong even when the evidence level differs.

Recommendation: label major claims with evidence levels and keep the strongest claims replay-tested where possible.

Why this preserves features: proof badges clarify confidence without hiding versatility.

Status: implemented.

### 8. Narrow The First Journey

Problem: even with hubs and profiles, a new user can still see the wider surface before trusting the core path.

Recommendation: keep the first path stubbornly small: first-run, demo, next, draft, review, save.

Why this preserves features: all specialist paths remain available after the proof loop.

Status: implemented.

## Suggested Roadmap

1. Completed: keep the manifest description fix and profile-reduction starter guidance.
2. Completed: add secondary `command_families` metadata and expose it in route graph output without changing primary intent routing.
3. Completed: teach `/scr:help`, `/scr:next`, and `/scr:do` to show hub-first wording for structure, art, session, sacred, submission, publishing, world, collaboration, and surface families.
4. Completed: add an interactive install profile prompt while keeping `full` as the default.
5. Completed: fold detector-aware authenticity into the audit flow so outside AI-detector reports become context, process evidence, and craft review rather than score-chasing.
6. Completed: add proof badges, golden workflow replay fixtures, and the Voice DNA replay harness.
7. Completed: queue host-runtime captures for Claude Code, Codex, and one standard command runtime without marking them verified.
8. Completed: extract the runtime/profile registry seam and add generated installed-command contract fallback.
9. Future: keep extracting installer seams only where behavior is stable, starting with atomic file operations and smoke-check formatting.

## Bottom Line

Scriveno does not need fewer features. It needs fewer visible decisions at once. The best consolidation path is hub-and-leaf: keep the full command set, strengthen the hubs, and let profiles and journeys decide how much of the surface is visible. The same principle applies to authenticity: keep the writer on a calm path from concern to evidence to craft decision, without turning Scriveno into a detector-gaming tool.
