# Scriven Architecture

How Scriven works under the hood -- for developers who want to understand the system before extending it.

## Overview

Scriven is a pure skill system. There is no compiled code, no runtime library, no framework. AI coding agents (Claude Code, Cursor, Gemini CLI, and others) read markdown command files and follow their instructions using their built-in tools (Read, Write, Bash).

The entire system is a collection of files:

- **Command files** tell the agent what to do when a writer invokes `/scr:draft` or `/scr:new-work`
- **Agent files** provide specialized instructions for tasks like drafting and voice-checking
- **CONSTRAINTS.json** is the central registry that controls which commands are available for which work types
- **Templates** provide starting content for new projects

Nothing compiles. Nothing bundles. Changes take effect immediately because the agent reads files at runtime.

## Skill System Design

The skill system works like this:

1. The writer types a slash command (e.g., `/scr:draft 3`)
2. The AI agent reads `commands/scr/draft.md`
3. The command file contains step-by-step instructions in plain markdown
4. The agent follows those instructions, using its tools to read files, write drafts, and run checks

Each command file has YAML frontmatter (metadata) and a markdown body (instructions):

```yaml
---
description: Draft the planned unit. Invokes the drafter agent in fresh context.
argument-hint: "[unit number, optional]"
---

# Draft {unit}

You are orchestrating the drafter agent to produce the actual prose...

## What to do

1. Find all plan files for the unit...
2. For each atomic unit, invoke the drafter agent in fresh context...
3. Save drafted output...
```

The agent reads this file and executes it. No SDK, no API calls, no imports. The markdown IS the program.

### Why markdown?

- **Portability.** Any AI agent that can read files can run Scriven
- **No build step.** Contributors edit a `.md` file and the change is live
- **Inspectable.** The writer can read any command file to understand exactly what Scriven will do
- **No dependencies.** No node_modules, no pip install, no version conflicts

## CONSTRAINTS.json Schema

`data/CONSTRAINTS.json` is the central registry. Every command checks it at runtime to determine what is available, what adapts, and what is restricted. Here are the top-level sections.

### work_type_groups

Groups related work types together. Commands use these groups for availability:

```json
"work_type_groups": {
  "prose": {
    "label": "Prose",
    "members": ["novel", "novella", "short_story", "flash_fiction",
                "memoir", "creative_nonfiction", "biography", "essay",
                "essay_collection"]
  },
  "sacred": {
    "label": "Sacred & Historical",
    "members": ["scripture_biblical", "scripture_quranic", "commentary",
                "devotional", "liturgical", "historical_chronicle", ...]
  }
}
```

There are 9 groups: prose, script, academic, technical, visual, poetry, interactive, speech_song, and sacred. Together they contain 50 work types.

### work_types

Individual work type definitions. Each entry specifies its structural hierarchy and which hierarchy level commands operate on:

```json
"novel": {
  "label": "Novel",
  "group": "prose",
  "hierarchy": { "top": "part", "mid": "chapter", "atomic": "scene" },
  "command_unit": "chapter"
}
```

- **`hierarchy`** -- Three structural levels. The `top` is the largest division (part, act, testament), `mid` is the middle (chapter, scene, section), and `atomic` is the smallest unit that gets drafted individually (scene, beat, verse).
- **`command_unit`** -- Determines how commands adapt their terminology. A novel's `/scr:draft` talks about drafting a chapter. A screenplay's `/scr:draft` talks about drafting an act.

Sacred work types can also specify defaults:

```json
"scripture_quranic": {
  "label": "Scripture (Quranic)",
  "group": "sacred",
  "hierarchy": { "top": null, "mid": "surah", "atomic": "ayah" },
  "command_unit": "surah",
  "config_defaults": {
    "verse_numbering_system": "quranic_hafs",
    "calendar_system": "hijri"
  }
}
```

### commands

The command registry. Each entry maps a command name to its category, availability, and behavior:

```json
"draft": {
  "category": "core",
  "available": ["all"],
  "renames_by_unit": true,
  "description": "Draft the planned unit"
},
"editor-review": {
  "category": "core",
  "available": ["all"],
  "adapted": {
    "academic": { "rename": "peer-review" },
    "sacred": { "rename": "scholarly-review" }
  },
  "description": "Manual review of drafted unit"
}
```

- **`available`** -- `["all"]` means universal. Otherwise, list specific group names like `["prose", "script"]`.
- **`renames_by_unit`** -- Legacy schema flag indicating that the command's terminology adapts based on the project's `command_unit`. The runnable command id remains the canonical base command.
- **`adapted`** -- Per-group overrides. The `editor-review` command becomes `peer-review` for academic works, `technical-review` for technical docs, and `scholarly-review` for sacred works.

## File Structure

```
scriven/
  commands/
    scr/                   Core command tree (100+ command files total, including sacred subcommands)
      draft.md             Core workflow: draft a unit
      new-work.md          Core workflow: start a new project
      autopilot.md         Autonomous pipeline orchestrator
      help.md              Navigation: show available commands
      ...
      sacred/              8 sacred-exclusive subcommands
        concordance.md
        cross-reference.md
        ...
  agents/
    drafter.md             Drafts one atomic unit in the writer's voice
    voice-checker.md       Compares drafts against STYLE-GUIDE.md
    continuity-checker.md  Catches contradictions and timeline errors
    plan-checker.md        Validates unit plans before drafting
    researcher.md          Gathers research material
    translator.md          Translates content with voice preservation
  data/
    CONSTRAINTS.json       Central constraint registry (the source of truth)
    demo/                  Pre-baked demo project (watchmaker story)
    export-templates/      Output format templates
      scriven-book.typst     Book interior PDF
      scriven-epub.css       EPUB styling
      scriven-academic.latex Academic paper formatting
    templates/
    config.json            Per-project configuration template
    WORK.md                Work overview template
    OUTLINE.md             Structural outline template
    CHARACTERS.md          Character profiles template
    STYLE-GUIDE.md         Voice DNA template
    WRITING-RULES.md       Universal AI-tell rulebook (1.6.0+)
    THEMES.md              Thematic threads template
    STATE.md               Progress tracking template
    BRIEF.md               Project brief template
    WORLD.md               World-building template
    pitfalls/              Per-work-type pitfall packs (1.6.0+)
      novel.md, memoir.md, screenplay.md, runbook.md,
      research_paper.md, poetry_collection.md, comic.md,
      commentary.md (drop-in extensible: contributors add
      <work_type>.md and listPitfallPacks() picks it up)
    technical/             Technical-writing template variants
      DOC-BRIEF.md           Replaces BRIEF.md for technical docs
      AUDIENCE.md            Reader and audience contract
      DEPENDENCIES.md        Systems, owners, and interface map
      SYSTEM.md              Replaces WORLD.md for technical docs
      PROCEDURES.md          Replaces PLOT-GRAPH.md for technical docs
      REFERENCES.md          Replaces THEMES.md for technical docs
    sacred/                Sacred-specific templates
      FIGURES.md             Replaces CHARACTERS.md for sacred works
      DOCTRINES.md           Theological framework
      COSMOLOGY.md           World/cosmological structure
      LINEAGES.md            Genealogies and lineage tracking
      FRAMEWORK.md           Interpretive framework
      THEOLOGICAL-ARC.md     Replaces PLOT-GRAPH.md for sacred works
  bin/
    install.js             Multi-platform installer (Node.js)
  docs/
    proof-artifacts.md     Canonical proof layer and artifact index
    getting-started.md     Install to first draft in 10 minutes
    command-reference.md   Full command listing with usage
    work-types.md          50 work types and how they adapt Scriven
    voice-dna.md           Voice profile system guide
    publishing.md          Export formats and publishing pipelines
    sacred-texts.md        Sacred work types and voice registers
    translation.md         Translation pipeline guide
    contributing.md        How to extend Scriven (commands, agents, etc.)
    configuration.md       Package, installer, constraints, and project config surfaces
    development.md         Contributor workflow for changing Scriven itself
    testing.md             Test suite coverage and release-safety checks
    shipped-assets.md      Canonical shipped-template and trust-file inventory
    runtime-support.md     Canonical runtime matrix and Node baseline
    release-notes.md       Public package-release summaries
    architecture.md        This file
  .manuscript/             Per-project working directory (created by commands)
```

The `.manuscript/` directory is created when a writer runs `/scr:new-work`. It contains their project's context files (STYLE-GUIDE.md, OUTLINE.md, CHARACTERS.md, etc.), plans, drafts, and state. It is not shipped with Scriven -- it is generated per project.

## Agent Orchestration

Commands invoke agents to perform specialized work. Here is how the orchestration flows:

```
Writer: /scr:draft 3
        |
        v
  commands/scr/draft.md
  (orchestration command)
        |
        |  For each atomic unit (scene):
        |
        v
  agents/drafter.md          <-- fresh context per unit
  receives: STYLE-GUIDE.md, 3-1-PLAN.md, CHARACTERS.md excerpt,
            previous unit tail (200 words), THEMES.md excerpt
  produces: .manuscript/drafts/body/3-1-DRAFT.md
        |
        v
  agents/voice-checker.md    <-- fresh context
  receives: STYLE-GUIDE.md, .manuscript/drafts/body/3-1-DRAFT.md
  produces: voice score + issues list
        |
        v
  draft.md updates STATE.md, reports to writer
```

The autopilot command (`/scr:autopilot`) chains multiple stages:

```
/scr:autopilot
    |
    FOR each unit in OUTLINE.md:
    |
    +-> /scr:discuss N
    +-> /scr:plan N
    +-> /scr:draft N
    |     +-> drafter agent (per atomic unit)
    |     +-> voice-checker agent
    +-> /scr:editor-review N
    +-> /scr:submit N
    |
    Pause behavior depends on profile:
      guided     -> pause after every atomic unit
      supervised -> pause at structural boundaries
      full-auto  -> pause only on errors
```

Key points:

- Commands are orchestrators. They read instructions and coordinate work.
- Agents are workers. They receive specific files and produce specific output.
- Each agent invocation is independent. No shared state between invocations.
- STYLE-GUIDE.md is always the first file loaded into any agent that produces or evaluates prose.

## Fresh Context per Unit

This is the core architectural pattern that makes Scriven work. Every agent invocation starts with a clean context -- no prior conversation, no accumulated state, no cross-contamination.

### Why fresh context?

**Voice drift.** When an AI accumulates context across multiple scenes, its writing style gradually shifts. By scene 10, it no longer sounds like the writer -- it sounds like an average of everything it has read. Fresh context forces the agent to re-read STYLE-GUIDE.md every time, resetting the voice profile.

**Context bloat.** A 100,000-word novel would overwhelm the agent's context window if loaded all at once. Fresh context means each unit works within comfortable limits.

**Focus.** The agent receives only what it needs for this one unit. No distractions from other chapters, no temptation to revise what came before, no interference from unrelated plot threads.

### What the drafter receives

For each atomic unit (scene, subsection, passage, stanza), the drafter agent gets, loaded in this exact order so the prompt cache stays warm across invocations:

1. **STYLE-GUIDE.md** -- Always first, sovereign. The voice DNA profile with 15+ dimensions: POV, tense, sentence architecture, vocabulary register, figurative density, dialogue style, pacing, and always/never/consider rules.
2. **WRITING-RULES.md** (optional, 1.6.0+) -- Universal AI-tell rulebook. The canonical list of don'ts (hedging, throat-clearing, balanced-both-sides, generic metaphors, symmetrical rhythm, moralizing closings, AI tics in dialogue, show-don't-tell triggers). Loaded if present; falls back to inline rules in `agents/drafter.md` when absent.
3. **Pitfall pack** (optional, 1.6.0+) -- Type-specific traps from `templates/pitfalls/<work_type>.md` (or `.manuscript/PITFALLS.md` for project-local overrides). Refines WRITING-RULES.md with traps unique to the work type: filter words for prose, unfilmable description for screenplays, missing-precondition checks for runbooks, anachronism for sacred commentary.
4. **{N}-{A}-PLAN.md** -- The specific plan for this unit: what happens, emotional arc, beats to hit, voice notes, continuity anchors.
5. **CHARACTERS.md excerpt** -- Only characters relevant to this unit, with their voice anchors and speech patterns.
6. **Previous unit tail** -- The last 200 words of the preceding unit, for rhythm and tone continuity.
7. **THEMES.md excerpt** -- Only the thematic threads this unit should advance.
8. **WORK.md excerpt** -- Premise, tone, central question (for orientation, not copying).

Conflict resolution is top-down: STYLE-GUIDE.md beats WRITING-RULES.md beats the pitfall pack. The writer's voice stays sovereign; the new rule layers are scaffolding intended to keep weaker models from drifting into generic AI prose. The `draft` block in `.manuscript/config.json` (`rigor`, `context_profile`, `pitfalls_enabled`) tunes the system. See [Drafter Quality](drafter-quality.md) for the full reference.

### What the drafter does NOT receive

- The full manuscript -- trust the plan file
- Other units' drafts -- no cross-contamination
- Revision history -- each draft is fresh
- The writer's conversation -- the agent is a craft worker, not a chatbot

This constraint is what makes voice fidelity possible. The drafter writes one unit at a time, grounded in the voice profile, without drifting toward a generic AI voice.

## Installer Architecture

The installer (`bin/install.js`) handles getting Scriven's files into the right place for each AI agent runtime.

### Platform detection

The installer detects which AI agents are available by checking for their configuration directories:

| Runtime | Detection | Type |
|---------|-----------|------|
| Claude Code | `~/.claude` exists | commands |
| Cursor | `~/.cursor` exists | commands |
| Gemini CLI | `~/.gemini` exists | commands |
| Codex | `~/.codex` exists | skills |
| OpenCode | `~/.config/opencode` exists | commands |
| GitHub Copilot | `~/.github` exists | commands |
| Windsurf | `~/.windsurf` exists | commands |
| Antigravity | `~/.gemini/antigravity` exists | commands |
| Manus Desktop | `~/.manus` or Manus.app exists | skills |
| Perplexity Desktop | `/Applications/Perplexity.app` or `~/Applications/Perplexity.app` exists | guided-mcp |
| Generic | Fallback (never auto-detected) | skills |

### Three installation strategies

**Command-directory (type: `commands`).** Copies individual command markdown files into the agent's command directory (for Claude Code, `~/.claude/commands/scr-*.md`; for other slash-command runtimes, nested `scr/` directories are still used). Each file becomes a slash command. Also copies agent files to the agent directory. This is the native approach for agents that support file-based commands.

**Skill-file (type: `skills`).** Generates a single `SKILL.md` manifest file that lists all commands in a table. For platforms that do not support file-based command directories (like Manus), the SKILL.md acts as a command index that the agent reads to discover available commands. The agent then reads individual command files from the package directory.

Codex uses a skill-native variation of this strategy. The installer generates one `$scr-*` skill per Scriven command under `.codex/skills/`, while also mirroring the underlying command markdown into `.codex/commands/scr/` so the generated skills can read the installed command files as their source of truth.

**Guided local-MCP (type: `guided-mcp`).** Writes setup assets and connector recipes for runtimes that expose a documented local-MCP surface instead of a writable slash-command directory. Perplexity Desktop currently fits this model: Scriven writes a setup guide and filesystem-server command recipe under `.scriven/perplexity/`, and the user adds that command inside Perplexity Desktop's Connectors UI.

### Installation modes

The installer supports two scopes:

- **Global** -- Installs to the user's home directory (`~/.claude/commands/scr-*.md` for Claude Code). Commands available in all projects.
- **Project** -- Installs to the current project directory (`.claude/commands/scr-*.md` for Claude Code). Commands scoped to this project only.

The user chooses during installation. Guided local-MCP targets still write their setup assets globally or per-project, but the connector itself remains tied to the specific project paths the user allows.

### Runtime credibility

Scriven's supported installer baseline is `Node.js 20+` (`>=20.0.0`). That baseline applies to `npx scriven-cli@latest`, `bin/install.js`, and the repo's JavaScript test suite, not to the markdown command system once files are installed.

This architecture doc is intentionally about mechanics: detection rules, install path shapes, `commands` versus `skills` versus `guided-mcp`, and global versus project scope. For the authoritative runtime matrix, support levels, and verification status, see [`docs/runtime-support.md`](runtime-support.md).

## Voice DNA Pipeline

The Voice DNA system is what makes Scriven's output sound like the writer, not like AI. Here is how STYLE-GUIDE.md flows through the system.

### Creation

When the writer runs `/scr:new-work`, Scriven asks if they have existing writing samples. If they do, `/scr:profile-writer` analyzes the samples across 15+ dimensions to build the voice profile:

- Point of view (close third, first person, omniscient, etc.)
- Tense (past, present, mixed)
- Sentence architecture (length distribution, variation patterns)
- Vocabulary register (formal, conversational, lyrical, sparse)
- Word origin preference (Anglo-Saxon vs Latinate)
- Figurative density (metaphor/simile frequency)
- Dialogue style (tagged, untagged, dialect handling)
- Pacing (scene-to-summary ratio, paragraph rhythm)
- Always/never/consider rules (specific writer preferences)

The result is saved to `.manuscript/STYLE-GUIDE.md`.

### Loading

Every agent that produces or evaluates prose loads STYLE-GUIDE.md **first**, before any other file. This is a hard rule -- the voice profile must be the agent's primary frame of reference.

### Enforcement

The voice-checker agent (`agents/voice-checker.md`) compares drafted prose against STYLE-GUIDE.md and produces:

- A voice consistency score
- Specific issues organized by category (structural voice, lexical voice, character voice, AI-slop indicators)
- Severity ratings (drift vs critical violation)

The voice-checker is invoked after every drafted unit. If drift exceeds the configured threshold (default: 0.3 in `config.json`), the writer is offered a re-draft.

### Calibration

Writers can refine their voice profile over time with `/scr:voice-test` (test the profile against new samples) and `/scr:profile-writer` (re-analyze with additional samples). The profile is additive -- new samples refine the dimensions, they do not replace them.

## Design Principles

### Zero dependencies

Scriven's `package.json` has no runtime dependencies. The installer is pure Node.js. Commands are markdown. This means no version conflicts, no supply-chain attacks, no broken builds. External tools (Pandoc, Typst) are optional prerequisites for export features -- the core writing workflow needs nothing beyond the AI agent itself.

### Plan is canonical

The product plan is the source of truth. If a command file contradicts the plan, the command file is wrong. This ensures consistency across 108 commands and prevents drift as multiple contributors work on the system.

### Backward compatibility

Existing commands must keep working as new features are added. The constraint system (CONSTRAINTS.json) makes this manageable -- new work types and commands are additive, and existing `available` arrays are not modified without explicit decision.

### Progressive disclosure

Onboarding asks 3 questions max. Depth is optional and additive. The writer should be drafting within minutes, not configuring options. Advanced features (autopilot profiles, voice calibration, sacred voice registers) are discoverable but not mandatory.

## Next Steps

To extend Scriven, see the [contributor guide](contributing.md). For the full command listing, see the [command reference](command-reference.md).
