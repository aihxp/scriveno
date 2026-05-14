# Architecture

## System Shape

Scriveno is a content-driven orchestration system, not a traditional application runtime. The repository ships instructions, registries, templates, and a lightweight installer. Execution happens when an AI coding agent reads markdown command files and follows them using its built-in file and shell tools.

## Primary Architectural Layers

### 1. Distribution Layer

- `package.json` publishes the package and exposes the `scriveno` CLI
- `bin/install.js` detects supported runtimes and copies files into the correct command/agent or skill directories

### 2. Command Layer

- `commands/scr/*.md` are the main user-facing workflows
- commands act as orchestrators: they interpret arguments, read project files, invoke worker agents, run checks, and write outputs
- sacred-only extensions live in `commands/scr/sacred/`

### 3. Worker Agent Layer

- `agents/*.md` defines specialized execution roles such as drafter, translator, voice-checker, plan-checker, continuity-checker, and researcher
- commands hand scoped work to these agents instead of embedding all behavior inline

### 4. Constraint/Policy Layer

- `data/CONSTRAINTS.json` is the central registry for work types, work type groups, command availability, structural hierarchies, adaptation rules, and descriptive metadata
- this file is the canonical source for how the product adapts across prose, script, academic, visual, poetry, interactive, speech, and sacred domains

### 5. Project State Layer

- `templates/` defines the baseline manuscript/project files
- runtime work is persisted in `.manuscript/` directories created from those templates
- output artifacts, plans, drafts, and state evolve as files instead of database rows or in-memory services

## Core Execution Flow

Typical workflow shape:

1. A writer invokes a command such as `/scr:draft` or `/scr:new-work`.
2. The host AI runtime loads the matching markdown file from `commands/scr/`.
3. The command reads registry and manuscript files to determine what applies.
4. The command may invoke a specialized agent prompt from `agents/`.
5. Results are written back to the filesystem under `.manuscript/` or output directories.

## Defining Architectural Constraints

Several architectural rules are repeated consistently across the repo:

- No compiled application layer
- No npm runtime dependency graph
- File-based portability across multiple AI runtimes
- Progressive disclosure for onboarding and workflows
- Tradition-native adaptation driven by a central registry
- Voice fidelity as a non-negotiable drafting invariant

## Voice-Fidelity Architecture

The repository documents one especially important rule: `STYLE-GUIDE.md` is the first-class input to prose generation and evaluation. Drafting is designed around fresh-context invocation per atomic unit so voice and continuity checks happen against explicit files instead of long-lived chat state.

## Export Architecture

Export is intentionally decoupled:

- Scriveno assembles intermediate manuscript content and metadata as files
- external CLIs perform format conversion
- templates in `data/export-templates/` shape final output

This allows rich publishing output without turning the project into a dependency-heavy document-processing application.

## Architectural Assessment

The architecture is closer to a portable workflow specification platform than to a conventional CLI app. Node exists mainly to install and package the static system; the durable product logic lives in markdown, JSON, and templates that can be interpreted across multiple AI agent environments.
