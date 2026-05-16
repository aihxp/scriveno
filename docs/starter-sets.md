# Starter Sets

Scriveno has a large command surface because it covers many kinds of writing. Starter sets give each writer a short path instead of asking them to learn every command up front.

Each set is intentionally small. Use `/scr-next`, `/scr:next`, or `$scr-next` whenever you are unsure which command should come next.

## Draft A Book

- `/scr:new-work` creates the project and work-type context.
- `/scr:profile-writer` turns the style guide into a real Voice DNA profile.
- `/scr:discuss` shapes the next unit with a few targeted questions.
- `/scr:plan` writes the next unit plan.
- `/scr:draft` drafts the planned unit in fresh context.
- `/scr:editor-review` reviews the draft for revision.
- `/scr:next` chooses the safest next move from project state.

## Polish A Manuscript

- `/scr:import` brings existing material into a Scriveno project.
- `/scr:profile-writer` calibrates the voice profile against your actual prose.
- `/scr:continuity-check` finds contradictions and timeline drift.
- `/scr:voice-check` compares drafts against Voice DNA.
- `/scr:line-edit` improves sentence-level flow.
- `/scr:copy-edit` catches grammar, clarity, and consistency issues.
- `/scr:polish` chains the revision passes when the manuscript is ready.

## Publish An Ebook

- `/scr:publish` starts the publication workflow.
- `/scr:front-matter` prepares title-page, copyright, and dedication pages.
- `/scr:back-matter` prepares author notes, acknowledgments, and reader materials.
- `/scr:blurb` drafts store-facing description copy.
- `/scr:cover-art` prepares cover direction or cover assets.
- `/scr:build-ebook` builds the ebook package.
- `/scr:export` writes the selected export format.

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

## Command Shape By Runtime

The starter sets use `/scr:*` because that is the shared command id format in Scriveno docs. Host surfaces differ:

- Claude Code uses flat commands such as `/scr-draft`.
- Standard command-directory runtimes currently keep `/scr:draft`.
- Codex uses generated skills such as `$scr-draft`.
- Guided targets such as Perplexity Desktop follow their generated setup instructions.

See [Runtime Support](runtime-support.md) for the canonical runtime matrix.
