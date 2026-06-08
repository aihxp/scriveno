# Starter Sets

Scriveno has a large command surface because it covers many kinds of writing. Starter sets give each writer a short path instead of asking them to learn every command up front.

Each set is intentionally small. Use `/scr-next`, `/scr:next`, or `$scr-next` whenever you are unsure which command should come next.

The flagship starter path is still longform voice preservation: set up the work, profile the writer, draft one unit, review it, then ask next. The other sets show range without making every feature compete for attention at first run. See [Versatility Paths](versatility-paths.md) when you want a curated showcase across technical, sacred, visual, translation, and publishing workflows.

## First 10 Minutes

- `/scr:first-run` runs the guided proof path and shows runtime-specific command shapes.
- `/scr:demo` creates the isolated watchmaker demo.
- `/scr:next` inspects the demo state and recommends the next move.
- `/scr:draft` drafts the planned fifth unit.
- `/scr:editor-review` reviews the new draft.

## Draft A Book

- `/scr:new-work` creates the project and work-type context.
- `/scr:profile-writer` turns the style guide into a real Voice DNA profile.
- `/scr:discuss` shapes the next unit with a few targeted questions.
- `/scr:plan` writes the next unit plan.
- `/scr:draft` drafts the planned unit in fresh context.
- `/scr:editor-review` reviews the draft for revision.
- `/scr:next` chooses the safest next move from project state.

## Showcase The Versatility

Use these when the goal is to demonstrate range after the flagship writing path is clear.

- **Technical guide or runbook:** `/scr:new-work`, then choose `runbook` or `technical guide`; use `/scr:discuss`, `/scr:plan`, `/scr:draft`, and `/scr:editor-review` to move the reader from confusion to usable action.
- **Sacred commentary:** `/scr:new-work`, then choose `commentary`; use `/scr:sacred:source-tracking`, `/scr:sacred:concordance`, `/scr:plan`, `/scr:draft`, and `/scr:sacred:doctrinal-check` to keep source care and register discipline visible.
- **Screenplay or comic:** `/scr:new-work`, then choose `screenplay` or `comic`; use `/scr:plan`, `/scr:draft`, `/scr:dialogue-audit`, `/scr:art-direction`, `/scr:panel-layout`, or `/scr:storyboard` depending on the format.
- **Translation and publishing:** start from an existing draft, then use `/scr:translation-glossary`, `/scr:translate`, `/scr:back-translate`, `/scr:front-matter`, `/scr:prepublish-review`, `/scr:publish`, and `/scr:build-ebook`.

For more detail, use [Versatility Paths](versatility-paths.md).

## Polish A Manuscript

- `/scr:import` brings existing material into a Scriveno project.
- `/scr:profile-writer` calibrates the voice profile against your actual prose.
- `/scr:continuity-check` finds contradictions and timeline drift.
- `/scr:voice-check` compares drafts against Voice DNA.
- `/scr:line-edit` improves sentence-level flow.
- `/scr:copy-edit` catches grammar, clarity, and consistency issues.
- `/scr:polish` chains the revision passes when the manuscript is ready.

## Build A World And Research

- `/scr:build-world` creates or extends the world context for story environments.
- `/scr:new-character` adds a person, figure, or cast entry when the work type supports one.
- `/scr:new-people` tracks groups, communities, lineages, or factions when collective dynamics matter.
- `/scr:new-place` registers a place without promoting every mention into canon.
- `/scr:place-touch` updates an existing place as the draft clarifies it.
- `/scr:geography-map` renders the derived geography map from world and place surfaces.
- `/scr:research` adds sourced advisory notes without making them canon.

## Publish An Ebook

- `/scr:front-matter` suggests and prepares ebook-appropriate front matter for the current work type.
- `/scr:back-matter` suggests and prepares ebook-appropriate back matter for the current work type.
- `/scr:blurb` drafts store-facing description copy.
- `/scr:cover-art` prepares cover direction or cover assets.
- `/scr:prepublish-review` runs the final editorial go/no-go before package building.
- `/scr:build-ebook` builds the ebook package.
- `/scr:publish` runs the destination workflow and reports missing optional matter without drafting it.
- `/scr:export` writes a selected export format when you need a one-off file.

Front/back matter stays in dedicated commands so a novel, thesis, sacred commentary, screenplay, or chapbook gets the right suggestions before packaging starts.

## Find The Right Hub

- `/scr:next` is the universal route when project state should choose.
- `/scr:outline` is the structure hub for outline shape and unit operations.
- `/scr:art-direction` is the visual hub for covers, scene art, character references, maps, storyboards, panels, and spreads.
- `/scr:save` is the session hub for checkpoints, history, versions, compare, pause, resume, and session reports.
- `/scr:sacred:source-tracking` is the sacred hub for tradition-aware source and reference workflows.
- `/scr:publish` is the destination hub for submission, publishing, export sequencing, and final package choices.
- `/scr:build-world` is the world hub for places, geography, characters, peoples, relationships, and research.
- `/scr:track` is the collaboration hub for alternate versions, proposals, comparisons, and merges.
- `/scr:surface` is the command-surface hub for smaller or larger installed profiles.

## Translate A Work

- `/scr:translation-glossary` defines recurring terms, names, and voice rules.
- `/scr:translation-memory` records approved translation decisions.
- `/scr:translate` translates the selected unit or manuscript segment.
- `/scr:cultural-adaptation` flags idioms and culture-specific phrasing.
- `/scr:back-translate` checks whether meaning survived translation.
- `/scr:multi-publish` prepares parallel translated editions.

## Build Sacred Commentary

- `/scr:new-work` creates a commentary, devotional, homiletic, or scripture project.
- `/scr:sacred:source-tracking` records primary and secondary source anchors.
- `/scr:sacred:concordance` builds searchable term and passage links.
- `/scr:sacred:cross-reference` maps related passages and interpretive connections.
- `/scr:sacred:doctrinal-check` verifies internal consistency and tradition constraints.
- `/scr:draft` writes the next commentary or sacred text unit.
- `/scr:editor-review` reviews the unit without flattening the tradition-native vocabulary.

## Repair And Resume

- `/scr:health` diagnoses missing files, stale state, and broken project assumptions.
- `/scr:sync` checks installed command, agent, and helper surfaces.
- `/scr:scan` refreshes project inventory.
- `/scr:check-notes` surfaces open notes and unresolved reminders.
- `/scr:resume-work` restores the paused thread or project state.
- `/scr:next` chooses the next safe command.

## Reduce The Visible Command Surface

- `/scr:surface status` shows the profile currently installed.
- `/scr:surface list` shows smaller profiles for drafting, publishing, translation, specialist work, and the full catalog.
- `/scr:surface profile writing --dry-run` previews a drafting-focused surface without changing files.
- `/scr:surface profile full --dry-run` previews restoring every command when exploration matters more than focus.

Smaller profiles do not remove project data or delete features. They only change which Scriveno-owned command files are installed for the selected runtime.

## Command Shape By Runtime

The starter sets use `/scr:*` because that is the shared command id format in Scriveno docs. Host surfaces differ:

- Claude Code uses flat commands such as `/scr-draft`.
- Standard command-directory runtimes currently keep `/scr:draft`.
- Codex uses generated skills such as `$scr-draft`.
- Guided targets such as Perplexity Desktop follow their generated setup instructions.

See [Runtime Support](runtime-support.md) for the canonical runtime matrix.
