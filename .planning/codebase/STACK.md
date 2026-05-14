# Stack

## Core Runtime Model

- Primary package: `scriveno-cli` (`package.json`)
- Installer/runtime shim: Node.js with a minimum engine of `>=20.0.0`
- Delivery model: npm package with a single CLI entrypoint at `bin/install.js`
- Application model: pure markdown skill/command system interpreted by AI coding agents at runtime

## Languages And Formats In Repo

- JavaScript: installer and automated tests
- Markdown: command definitions, agent prompts, docs, templates, demo manuscript content
- JSON: command/work-type registry and project configuration
- CSS: EPUB styling template
- Typst: book interior PDF template
- LaTeX: academic export template

## Runtime Dependencies

- No npm runtime dependencies are declared
- No build system, bundler, transpiler, or compiled artifacts are present
- `npm test` runs directly on Node's built-in test runner

## Testing Stack

- Test runner: `node --test`
- Assertions: `node:assert/strict`
- Common fixtures/utilities: `fs`, `path`, `os`, `child_process`
- Coverage emphasis: package metadata, installer behavior, command file structure, export/publishing workflow expectations, feature-phase regressions

## External Toolchain Referenced By Commands

These are shell prerequisites described and invoked by markdown commands rather than installed through npm:

- Pandoc: DOCX, EPUB, PDF, LaTeX, package assembly
- Typst: PDF engine for manuscript and print-ready export
- Ghostscript: CMYK PDF/X-1a conversion for IngramSpark packages
- Afterwriting: optional screenplay PDF generation from Fountain
- Screenplain: Fountain to FDX conversion

## Supported Agent Runtimes

The installer explicitly supports these host environments:

- Claude Code
- Cursor
- Gemini CLI
- Codex CLI
- OpenCode
- GitHub Copilot
- Windsurf
- Antigravity
- Manus Desktop
- Generic `SKILL.md` install target

## Project Scale Snapshot

- Command files: 101
- Agent prompt files: 6
- Template files: 15
- Test files: 13
- Documentation files: 9

## Practical Summary

Scriveno is a zero-dependency Node-distributed content system. Node is used for installation, packaging, and tests; the product logic itself lives in markdown instructions, JSON constraints, and export templates that downstream AI runtimes execute with their own tools.
