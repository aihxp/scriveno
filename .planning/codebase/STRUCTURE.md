# Structure

## Top-Level Layout

```text
scriveno/
  agents/                 Specialized worker prompts
  bin/                    Installer and packaging entrypoint
  commands/               User-facing markdown workflows
  data/                   Constraint registry, demo manuscript, export templates
  docs/                   Human-facing product and developer documentation
  templates/              Seed files for new manuscript projects
  test/                   Node-based regression and contract tests
  .planning/              Project planning artifacts used during development
  README.md               Product overview and entry documentation
  package.json            Package metadata and CLI wiring
```

## Key Directories

### `commands/scr/`

- Core product surface area
- 101 markdown command files
- Includes a `sacred/` subdirectory for sacred/historical exclusive workflows
- Commands are organized by capability rather than code module boundaries

### `agents/`

- Small set of reusable specialist prompts
- Encapsulates drafting, research, translation, plan validation, continuity review, and voice evaluation roles

### `data/`

- `CONSTRAINTS.json`: central product registry
- `demo/.manuscript/`: packaged example manuscript state
- `export-templates/`: Typst, CSS, and LaTeX assets for publishing/export flows

### `templates/`

- Starter project files copied into new manuscript workspaces
- Covers voice, outline, themes, state, world-building, and sacred-specific structures

### `test/`

- Uses Node's built-in test runner
- Mix of package-contract tests and phase/feature regression tests
- Verifies command-file structure, installer behavior, packaging, and specific pipeline capabilities

### `docs/`

- Product guides mirror major domains: getting started, command reference, work types, voice DNA, publishing, sacred texts, translation, contributing, architecture

## Repository Organization Pattern

The repo is organized around executable content assets instead of modules and libraries:

- instructions live in markdown
- policy lives in JSON
- formatting lives in templates
- installation logic lives in a single JS entrypoint
- verification lives in Node tests

## Current Shape Indicators

- Minimal JavaScript surface area relative to markdown content
- High ratio of command definitions to agent definitions
- Documentation-first repository with executable workflow specs
- `.planning/` shows ongoing spec- and phase-driven development alongside the product files

## How To Navigate Quickly

- Start with `README.md` for product scope
- Read `data/CONSTRAINTS.json` to understand adaptation rules and command availability
- Inspect `commands/scr/` for runtime behavior
- Inspect `agents/` for delegated execution roles
- Use `docs/architecture.md` and `docs/contributing.md` for extension guidance
- Use `test/` to see the enforced contracts and expected shipped surface
