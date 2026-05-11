# Scriven

[![npm version](https://img.shields.io/npm/v/scriven-cli)](https://www.npmjs.com/package/scriven-cli)
[![npm downloads](https://img.shields.io/npm/dm/scriven-cli)](https://www.npmjs.com/package/scriven-cli)

**[scriven-cli on npm](https://www.npmjs.com/package/scriven-cli)**

**Spec-driven writing, publishing, and translation for AI coding agents.**

*I don't outline -- Claude does. I don't edit -- Claude does. I don't format -- Claude does. I just write.*

Scriven brings spec-driven workflows to longform writing. It runs inside your AI coding agent (Claude Code, Cursor, Gemini CLI, and more) and also ships a guided Perplexity Desktop setup path for file-aware support without overstating parity.

Scriven is best understood as **AI-native longform writing software built around voice preservation**. Its core promise is narrow and high-stakes: drafted prose should sound like the writer, not like AI. If you want evidence before features, start with the [Proof Artifacts](docs/proof-artifacts.md).

```bash
npx scriven-cli@latest
```

---

## What is this

Scriven is a command system that turns your AI coding agent into a voice-preserving writing studio. It supports 50 work types -- novels, screenplays, research papers, technical guides, runbooks, scripture commentaries, comics, memoirs -- each with its own adaptive vocabulary and toolset.

The wedge comes first: Scriven profiles the writer, loads that voice into every drafting step, and keeps each unit on fresh context so the prose stays specific to the project. From there, it expands into 110 writing commands covering the rest of the pipeline:

- **Create** -- Set up a project with tailored context files. Progressive onboarding, never overwhelming.
- **Write** -- Discuss, plan, draft, and revise one unit at a time. The drafter agent loads your Voice DNA and writes in *your* voice, not generic AI prose.
- **Polish** -- Editor review, line edit, copy edit, continuity check, voice check, beta reader simulation, sensitivity review.
- **Publish** -- Front/back matter, cover art, blurbs, query letters, KDP packages, IngramSpark packages, EPUB, PDF, Fountain, Final Draft, LaTeX.
- **Translate** -- Deep translation with glossary management, cultural adaptation, back-translation verification, multi-language simultaneous publishing.
- **Collaborate** -- Parallel revision tracks, co-writing workflows, continuity merge checking.

Everything adapts to your work type. A novel uses `/scr:draft` for chapters. A screenplay uses `/scr:draft` for acts. A Quran commentary uses `/scr:draft` for surahs. Same command, tradition-native vocabulary.

---

## Quick start

```bash
# Install
npx scriven-cli@latest

# In Claude Code:
/scr-new-work        # Start a fresh project
/scr-demo            # Explore a pre-built sample first
/scr-next            # The universal "what should I do now" command
/scr-help            # See what's available for your work type

# Other slash-command runtimes currently keep /scr:*:
/scr:new-work
/scr:next

# In Codex, use the generated $scr-* skills:
$scr-new-work
$scr-demo
$scr-next
$scr-help
```

If you only ever type `/scr-next` in Claude Code, you can complete an entire novel. It always knows what's next.

If you want the shortest proof-first route, read [Proof Artifacts](docs/proof-artifacts.md) before exploring the rest of the docs.

---

## The Voice DNA system

Scriven's core insight: drafted prose should sound like *you*, not like an AI. Before drafting begins, `/scr:profile-writer` builds a detailed voice profile across 15+ dimensions:

- Narrative perspective, tense, narrator stance
- Sentence architecture, paragraph rhythm
- Vocabulary register, figurative density, recurring image systems
- Dialogue style, character voice differentiation
- Pacing, transitions, emotional range
- Do/don't/consider rules specific to the writer

This profile is saved as `STYLE-GUIDE.md` and loaded into every drafter agent invocation. The drafter writes one atomic unit per fresh context -- a scene, a subsection, a passage -- with the style guide as its primary reference. Voice stays consistent across hundreds of scenes.

The drafter is also backed by two additional rule layers that scaffold weaker models without overriding the writer's voice: a universal `WRITING-RULES.md` (AI-tell don'ts loaded into every drafter, voice-checker, and originality-check pass) and per-work-type pitfall packs at `templates/pitfalls/<work_type>.md` (filter words for prose, unfilmable description for screenplays, missing-precondition checks for runbooks, anachronism for sacred commentary, and so on). Conflict resolution is top-down: STYLE-GUIDE.md > WRITING-RULES.md > pitfall pack. See [docs/drafter-quality.md](docs/drafter-quality.md) for the full system, including `draft.rigor` and `draft.context_profile` settings for matching the drafter to the model tier you're routing to.

For sacred and historical texts, Voice DNA is supplemented by 10 sacred voice registers (prophetic, wisdom, legal, liturgical, narrative-historical, apocalyptic, epistolary, psalmic, parabolic, didactic).

---

## Work types supported

**Prose:** novel, novella, short story, flash fiction, memoir, creative nonfiction, biography, essay, essay collection

**Script:** screenplay, stage play, TV pilot, TV series bible, audio drama, libretto/musical

**Academic:** research paper, thesis/dissertation, journal article, white paper, literature review, monograph

**Technical writing:** technical guide/user guide, runbook/SOP, API or CLI reference, design spec/architecture doc

**Visual:** comic, graphic novel, children's book, picture book

**Poetry:** poetry collection, single poem, song/lyric

**Interactive:** interactive fiction, game narrative

**Sacred & historical:** scripture (Biblical, Quranic, Torah, Vedic, Buddhist, generic), commentary/exegesis, devotional, liturgical text, historical chronicle, historical account, mythological collection, religious epic, sermon, homiletic collection

Each work type has its own structural hierarchy and **industry-standard word count and page range guidance** -- a novel targets 70,000-100,000 words across 20-35 chapters, a screenplay targets 90-120 pages across 3-5 acts. These ranges guide outlining, progress tracking, and drafter pacing. The runnable command ids stay stable, while Scriven adapts the wording around them -- a Torah commentary still runs `/scr:plan 3`, but frames that work as planning Parashah 3.

---

## Autopilot mode

Run the full pipeline autonomously. Three profiles:

- **Guided** -- Pause after each unit for review
- **Supervised** -- Batch through several units, pause for review
- **Full-auto** -- Run until complete; only pause on critical failures

```bash
# Claude Code
/scr-autopilot --profile supervised

# Other slash-command runtimes
/scr:autopilot --profile supervised
```

Plus:
- `/scr:autopilot-publish` -- One command generates front matter, back matter, cover, and full export package
- `/scr:autopilot-translate french german spanish` -- Simultaneous multi-language editions

---

## Writer mode vs. developer mode

Scriven detects non-technical writers and hides git terminology. Instead of `commit`, `branch`, `merge`, `diff` -- you see `save`, `version`, `compare`, `accept changes`. All the power, none of the coding jargon.

Technical writers can enable developer mode in settings for full git access and verbose output.

---

## Philosophy

Scriven is built on five principles:

1. **The writer's voice is sacred.** The drafter never imposes generic AI style. Every drafted sentence passes through the Voice DNA gate.

2. **Fresh context per atomic unit.** Each scene, subsection, or passage is drafted in a clean context. This prevents voice drift, context bloat, and keeps each unit at its best.

3. **Progressive disclosure.** Onboarding asks 3 questions, not 30. Depth is optional and always additive.

4. **Tradition-native vocabulary.** A Quran commentary uses surahs and ayahs. A Bible study uses books and verses. A screenplay uses acts and scenes. The tool adapts to the tradition -- the writer never adapts to the tool.

5. **`/scr-next` always works in Claude Code.** The universal interface. A writer who only ever types `/scr-next` can complete an entire novel, from blank page to KDP package.

---

## Documentation

- [Proof Artifacts](docs/proof-artifacts.md) -- Canonical proof hub for the watchmaker sample flow and Voice DNA before/after bundle
- [Getting Started](docs/getting-started.md) -- Install to first draft in 10 minutes
- [Command Reference](docs/command-reference.md) -- All 110 commands with usage, flags, and examples
- [Work Types Guide](docs/work-types.md) -- How 50 work types adapt Scriven's vocabulary
- [Voice DNA Guide](docs/voice-dna.md) -- The 15+ dimension voice profiling system
- [Publishing Guide](docs/publishing.md) -- 13 export formats, KDP, IngramSpark, submission packages
- [Sacred Text Guide](docs/sacred-texts.md) -- 15 sacred work types, voice registers, tradition-native features
- [Translation Guide](docs/translation.md) -- Multi-language pipeline with glossary and cultural adaptation
- [Contributing](docs/contributing.md) -- How to add commands, agents, work types, and templates
- [Architecture](docs/architecture.md) -- How Scriven works under the hood
- [Configuration](docs/configuration.md) -- Package, installer, constraints, and `.manuscript/config.json` surfaces
- [Development](docs/development.md) -- Contributor workflow for changing commands, templates, installer logic, and docs
- [Testing](docs/testing.md) -- What the test suite covers and which checks to run before shipping
- [Release Notes](docs/release-notes.md) -- Public summary of what changed between package releases
- [Shipped Assets](docs/shipped-assets.md) -- Canonical inventory of bundled export templates and launch-critical files
- [Runtime Support](docs/runtime-support.md) -- Canonical runtime matrix, Node baseline, and verification-status framing

---

## Installer Targets

Scriven currently ships installer targets for these AI tooling environments:

- **Claude Code** (primary reference runtime)
- **Cursor**
- **Gemini CLI**
- **Codex**
- **OpenCode**
- **GitHub Copilot**
- **Windsurf**
- **Antigravity**
- **Manus Desktop**
- **Perplexity Desktop** (guided local-MCP setup)
- **Generic (SKILL.md)** fallback

**Installer baseline:** `Node.js >=20.0.0` for `npx scriven-cli@latest` and `bin/install.js`. For new installs, use a currently supported LTS such as Node.js 24; Node.js 20 is now a compatibility floor, not the recommended fresh-install target.

**Support note:** Claude Code is the primary reference runtime and now installs a flat `/scr-*` command surface. The environments listed above are installer targets, not a claim that every host runtime has verified parity today. Codex currently installs a skill-native `$scr-*` surface, while Perplexity Desktop is a guided local-MCP target rather than a writable command runtime. See the [runtime compatibility matrix](docs/runtime-support.md) for install type, support level, and verification status.

---

## Status

**Version:** 1.7.1

 Scriven's core command surface is stable across 110 commands, 50 work types, and 11 installer targets. The current repo baseline includes shipped planning milestones through `v2.0 Publishing Cover Packaging`, and the package version is now `1.7.1`. See [Shipped Assets](docs/shipped-assets.md) for the canonical asset inventory and [Runtime Support](docs/runtime-support.md) for the runtime compatibility matrix.

 Version `1.7.1` packages the audit-hardening pass on top of `1.7.0`: unique installed command names for sacred verse-numbering surfaces, top-level sacred profile keys with legacy fallback, shipped-slug tradition validation, real ebook platform manifest loading, canonical workflow dependency paths, refreshed repository documentation, and stronger package/repository-policy checks. Version `1.7.0` introduced character continuity and context integrity: full `CHARACTERS.md` / `FIGURES.md` drafter loading by default, `/scr:character-touch`, `/scr:scan`, `.manuscript/CONTEXT.md`, `.manuscript/HISTORY.log`, destination-neutral export presets, interactive export and publish pickers, front/back matter level controls, and the Typst running-head fix. See [CHANGELOG](CHANGELOG.md) for the full list and [docs/release-notes.md](docs/release-notes.md) for the public-facing summary.

Package history is tracked in [CHANGELOG.md](CHANGELOG.md), and the public-facing summary for this release is in [docs/release-notes.md](docs/release-notes.md).

---

## License

MIT. See [LICENSE](./LICENSE).

## Contributing

Scriven is an open project. Contributions welcome -- especially new work types, additional runtime adapters, and voice register definitions for languages and traditions we haven't covered yet.
