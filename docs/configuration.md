# Configuration

This guide covers the configuration surfaces Scriven actually ships today: package-level installer metadata, shared constraint data, runtime install targets, and per-project `.manuscript/config.json`.

## What is configurable

Scriven is intentionally narrow in where configuration lives:

- `package.json` defines the npm package metadata, installer entrypoint, and supported Node baseline
- `data/CONSTRAINTS.json` is the central registry for work types, command availability, adaptive terminology, and export rules
- `bin/install.js` defines installer targets and where Scriven writes commands, skills, agents, or guided setup assets
- `.manuscript/config.json` stores project-specific writing settings after `/scr:new-work`

There is no compiled app config, no environment-variable matrix for the core workflow, and no runtime dependency graph beyond Node.js for the installer.

## Installer baseline

The supported installer floor is:

```json
"engines": {
  "node": ">=20.0.0"
}
```

That same Node 20+ baseline is enforced in:

- `package.json`
- `bin/install.js`
- `docs/runtime-support.md`

For runtime support details, use [Runtime Support](runtime-support.md). That document is the canonical compatibility matrix.

## Shared Scriven data

Scriven commands are designed to load the shared constraints file from an installed Scriven location first:

- global install: `~/.scriven/data/CONSTRAINTS.json`
- project install: `.scriven/data/CONSTRAINTS.json`

The repo-local copy at `data/CONSTRAINTS.json` is the authoring source of truth. The installer copies that data into the runtime-facing install location.

`CONSTRAINTS.json` controls:

- all 50 work types and 9 work-type groups
- all shipped command registrations
- adaptive renames and group-specific command behavior
- export availability and prerequisite rules

If a command or doc claim conflicts with `CONSTRAINTS.json`, fix the command or doc to match the constraints file.

## Project config

When a writer runs `/scr:new-work`, Scriven creates `.manuscript/config.json`. The command file in [new-work.md](/Users/hprincivil/Projects/scriven/commands/scr/new-work.md) defines the baseline shape:

```json
{
  "scriven_version": "1.7.0",
  "work_type": "<chosen>",
  "group": "<group>",
  "command_unit": "<unit>",
  "developer_mode": false,
  "created_at": "<ISO timestamp>",
  "autopilot": {
    "enabled": false,
    "profile": "guided"
  }
}
```

That `scriven_version` value should track the current package release and the live `/scr:new-work` contract, not an older milestone snapshot.

Every project gets those core keys. Additional blocks are added only when the work type requires them.

### Technical writing projects

Technical writing work types add a `technical` block seeded from `config_defaults` in `data/CONSTRAINTS.json`. That block is used to capture things like:

- audience level
- prerequisite knowledge
- supported environment
- supported versions
- source-of-truth references
- review mode

Technical projects also swap in the specialized templates under `templates/technical/`.

### Sacred and historical projects

Sacred work types add a `sacred` block seeded from `config_defaults`. Depending on the type, that can include:

- tradition
- verse numbering system
- calendar system
- translation philosophy
- canonical alignment

Sacred projects also load the template variants under `templates/sacred/`.

### Drafter quality settings

Starting in `1.6.0`, projects can include an optional `draft` block to tune how the drafter loads context and applies rule scaffolding. The block is optional; absent block falls back to the documented defaults.

```json
"draft": {
  "rigor": "standard",
  "context_profile": "standard",
  "pitfalls_enabled": true
}
```

- `draft.rigor`: `standard` (default) or `strict`. Strict prepends a per-sentence rules check, useful when routing to weaker models that need scaffolding to stay on-voice.
- `draft.context_profile`: `minimal`, `standard` (default), or `full`. Controls how much context the drafter loads per atomic unit. Minimal trims THEMES, WORK, and off-stage CHARACTERS for short scenes; full loads cross-document references for sacred-work continuity.
- `draft.pitfalls_enabled`: `true` (default) or `false`. When `false`, skip loading the per-work-type pitfall pack from `templates/pitfalls/<work_type>.md`. WRITING-RULES.md still loads. Use when the writer's voice deliberately leans into a trap (parody, pastiche, period voice).

`/scr:settings` exposes all three knobs in its display and change flow. See [Drafter Quality](drafter-quality.md) for the full system, including model-tier recommendations and the override hierarchy (STYLE-GUIDE.md beats WRITING-RULES.md beats the pitfall pack).

## Developer mode

Scriven defaults projects to:

```json
"developer_mode": false
```

That setting exists so non-technical writers can stay in writer-first language. In writer mode, Scriven prefers terms like `save`, `version`, and `compare` instead of raw git terminology.

The broader product behavior is described in [Getting Started](getting-started.md) and [README.md](/Users/hprincivil/Projects/scriven/README.md). The repo does not currently ship a separate standalone developer-mode settings reference beyond the project config itself.

## Installer targets

`bin/install.js` currently defines 11 installer targets:

- 8 command-directory runtimes
- 2 skills or manifest-style runtimes
- 1 guided local-MCP target for Perplexity Desktop

The installer also decides whether the install is global or project-local and writes files into the matching runtime-specific directories. The target matrix and support framing live in [Runtime Support](runtime-support.md).

## Export prerequisites

Scriven keeps export tools out of `package.json`. They are external prerequisites the agent invokes through the shell when needed.

Current documented prerequisites include:

- Pandoc
- Typst
- Ghostscript
- ImageMagick
- Afterwriting
- Screenplain

The authoritative guidance for those tools is split across:

- [Publishing](publishing.md)
- [Shipped Assets](shipped-assets.md)
- [Runtime Support](runtime-support.md)

## Changing configuration safely

Use this rule of thumb:

- change `data/CONSTRAINTS.json` for command availability, work-type structure, adaptive terminology, or export rules
- change `bin/install.js` for runtime targets or install paths
- change command files for workflow behavior
- change `.manuscript/config.json` only as project state, not as product schema authoring

After changing configuration surfaces, run:

```bash
npm test
```

And for release-facing changes, also run:

```bash
npm pack --dry-run
```

## Related docs

- [Getting Started](getting-started.md)
- [Architecture](architecture.md)
- [Contributing](contributing.md)
- [Drafter Quality](drafter-quality.md)
- [Voice DNA](voice-dna.md)
- [Runtime Support](runtime-support.md)
- [Publishing](publishing.md)
