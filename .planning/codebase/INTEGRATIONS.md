# Integrations

## Host Runtime Integrations

`bin/install.js` installs Scriveno into multiple AI coding agent ecosystems by copying command and agent files into runtime-specific directories.

### Command-Based Runtimes

- Claude Code: `~/.claude/...`
- Cursor: `~/.cursor/...`
- Gemini CLI: `~/.gemini/...`
- Codex CLI: `~/.codex/...`
- OpenCode: `~/.config/opencode/...`
- GitHub Copilot: `~/.github/...`
- Windsurf: `~/.windsurf/...`
- Antigravity: `~/.gemini/antigravity/...`

These runtimes receive:

- command files under a `commands/scr` target
- specialized agent files under a runtime `agents` target

### Skill-Based Runtimes

- Manus Desktop: installs a `skills/scriveno` payload
- Generic target: installs a portable `SKILL.md` plus copied command files

The generic/manus path is driven by `generateSkillManifest()`, which renders a markdown catalog from `data/CONSTRAINTS.json`.

## Internal File-System Contracts

Scriveno relies on file-based integration rather than libraries or services:

- `.manuscript/`: per-project working state created by `/scr:new-work`
- `templates/`: source templates copied into manuscript projects
- `agents/`: worker instructions invoked by orchestration commands
- `commands/scr/`: user-facing workflows interpreted by the host agent
- `data/CONSTRAINTS.json`: registry consulted by commands for availability and adaptation

## External CLI Integrations

The command set assumes shell access to external tools and checks for them explicitly before use:

- `pandoc`: primary converter for DOCX, EPUB, PDF, LaTeX, and package assembly
- `typst`: PDF backend, typically passed via `--pdf-engine=typst`
- `screenplain`: required for FDX export
- `afterwriting`: optional screenplay PDF output
- `gs`: Ghostscript for CMYK/PDF-X conversion

This keeps Scriveno's npm package dependency-free while still supporting rich export workflows.

## Publishing And Distribution Targets

Command and docs content integrates with external publishing destinations:

- Amazon KDP paperback and ebook
- IngramSpark print distribution
- Wide ebook retailers via EPUB/PDF output
- Literary agent / publisher submission packages
- Academic submission and thesis-defense outputs
- Screenplay submission packages using Fountain and FDX

These are package/output integrations rather than direct API clients.

## Model/API-Level Workflow Integrations

The repository also defines workflow expectations for service-backed tasks, but those integrations remain instructional rather than implemented as JS clients:

- OpenAI image generation for illustration and cover workflows
- DeepL for higher-quality European-language translation
- Google Cloud Translation for broader language coverage and RTL/CJK support

The current repo documents and orchestrates these capabilities through markdown commands; it does not ship SDK wrappers or credential management code for them.

## Integration Pattern

Across the codebase, integrations are mediated through three layers:

1. Installer copies static assets into a host runtime.
2. Markdown commands describe how an agent should invoke local tools or external services.
3. Output is written back to the filesystem as drafts, exports, packages, or metadata.
