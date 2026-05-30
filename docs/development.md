# Development

This guide is for contributors working on Scriveno itself rather than using Scriveno as a writer.

## Development model

Scriveno is a pure skill and command system:

- commands are markdown files in `commands/scr/`
- agents are markdown files in `agents/`
- templates are markdown or JSON files in `templates/`
- the installer is the only Node-based executable surface in `bin/install.js`
- `data/CONSTRAINTS.json` is the central registry for capabilities and adaptation

There is no compiled app, frontend bundle, service, or dependency-heavy local dev stack to boot.

## Local setup

Scriveno’s local development requirements are intentionally small:

- Node.js >=20.0.0 for the installer and test runner. Use a currently supported LTS such as Node.js 24 for new work.
- npm for package scripts and publish tooling
- git for normal repo history

Install dependencies:

```bash
npm install
```

Today that mainly creates the lockfile context and standard npm metadata flow. The package remains dependency-free at runtime.

## Important directories

These are the main places contributors work:

- `commands/scr/` for writer-facing commands
- `commands/scr/sacred/` for sacred-exclusive subcommands
- `agents/` for fresh-context worker agents like `drafter` and `voice-checker`
- `templates/` for generated project scaffolding
- `data/CONSTRAINTS.json` for work types, commands, adaptations, and export rules
- `docs/` for shipped documentation
- `test/` for Node test suites
- `bin/install.js` for runtime installation behavior

## Common contribution paths

### Add or change a command

1. Edit or add the markdown file under `commands/scr/`
2. Register or update the command in `data/CONSTRAINTS.json`
3. Update docs if the command surface or wording changed
4. Add or update tests when the change affects trust, counts, adaptation, packaging, or installer behavior

Use [Contributing](contributing.md) for the full command-authoring walkthrough.

### Add a work type

1. Add or update the work type under `data/CONSTRAINTS.json`
2. Check its group, hierarchy, `command_unit`, and any `config_defaults`
3. Update docs that reference work-type counts or examples
4. Update tests that lock the visible work-type surface

### Add templates or adaptation files

1. Add the template under `templates/`, `templates/technical/`, or `templates/sacred/`
2. Update the command logic or docs that describe the generated file set
3. Verify the template is included by npm packaging if it is supposed to ship

### Change installer behavior

1. Edit `bin/install.js`
2. Update docs that mention installer targets, runtime support, or setup paths
3. Run the installer and package-oriented tests
4. Dry-run packaging before release-sensitive changes

## Working principles

These constraints matter more than convenience:

- keep the system markdown-first and dependency-light
- preserve the Voice DNA pipeline
- keep `>=20.0.0` as the installer compatibility floor unless the product plan changes
- treat `docs/runtime-support.md` and `docs/shipped-assets.md` as trust-critical docs
- avoid overstating runtime parity or shipped assets

If a command file and the plan disagree, the plan is canonical and the command should be corrected.

## Useful commands

Run the full suite:

```bash
npm test
```

Run a smaller targeted subset while iterating:

```bash
node --test test/package.test.js test/constraints.test.js
```

Run the release gate before publishing:

```bash
npm run release:check
```

Run the writing-policy gate directly when changing docs, prompts, commands, release notes, or public copy:

```bash
npm run policy:check
```

Start the installer locally:

```bash
npm start
```

Refresh installed runtime surfaces from this checkout after changing commands, agents, or installer-generated skills:

```bash
node bin/install.js --runtime codex --global --developer --silent
```

The writer-facing form of this maintenance operation is `/scr:sync`.

For a full cross-runtime refresh from this checkout, use:

```bash
node bin/install.js --runtimes claude-code,cursor,gemini-cli,codex,opencode,copilot,windsurf,antigravity,manus,perplexity-desktop,generic --global --developer --silent
```

After installation, the shared audit commands should pass:

```bash
scriveno sync --check
scriveno smoke --json
scriveno agents --json
scriveno routes --json
```

## Docs and release workflow

Docs are part of the shipped product. If you change visible behavior, update every affected documentation surface in the same pass: root docs, files under `docs/`, proof READMEs, template READMEs, and command markdown that exposes user-facing contracts.

For release-oriented documentation surfaces, the main files are:

- `README.md`
- `CHANGELOG.md`
- `docs/quick-proof.md`
- `docs/starter-sets.md`
- `docs/release-checklist.md`
- `docs/release-notes.md`
- `docs/shipped-assets.md`
- `docs/command-reference.md`
- `docs/auto-invoke-policy.md`
- `docs/runtime-support.md`
- `docs/route-graph.md`
- `templates/*/README.md` when shipped profiles or templates change
- `.planning/` milestone summaries when you are still using an external planning layer

## Before shipping

A good pre-ship pass for Scriveno changes is:

1. run the targeted tests for the touched surface
2. run `npm test`
3. run `npm run policy:check` for docs, command, agent, prompt, and release-note changes
4. run `npm run release:check` for package-facing changes
5. run the proactive audit commands when routing, runtime, installer, or agent surfaces changed
6. review trust-sensitive docs for runtime, asset, and support claims

## Related docs

- [Architecture](architecture.md)
- [Configuration](configuration.md)
- [Testing](testing.md)
- [Contributing](contributing.md)
- [Quick Proof](quick-proof.md)
- [Release Checklist](release-checklist.md)
- [Auto-Invoke Policy](auto-invoke-policy.md)
- [Runtime Support](runtime-support.md)
- [Route Graph Audit](route-graph.md)
- [Release Notes](release-notes.md)
