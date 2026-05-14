# Runtime Support

Scriveno's runtime claims should be grounded in what the repo can actually prove. This document is the canonical source of truth for Scriveno's installer compatibility floor, runtime evidence levels, support levels, and verification status.

## Node.js Baseline

Scriveno's installer compatibility floor is `Node.js >=20.0.0`. For new installs, prefer a currently supported LTS release such as Node.js 24. Node.js 20 reached end of life on 2026-04-30, so it remains a compatibility floor, not the recommended fresh-install target.

Node is required for:

- running `npx scriveno-cli@latest`
- executing `bin/install.js`
- running the repo's JavaScript test suite

Node is not a runtime dependency for Scriveno's markdown command system itself. Once installed, Scriveno's command files, agent prompts, templates, and constraints are read by the host AI coding agent.

## Evidence Levels

- **Installer registry**: the runtime appears in `bin/install.js` with a label, install type, detection rule, and install path shapes.
- **Registry-tested**: `test/installer.test.js` asserts the runtime key exists and that its install properties match the expected `commands` or `skills` strategy.
- **Guided setup assets**: the installer writes setup files or connector recipes for a documented runtime surface instead of copying slash-command files.
- **Repo-documented**: the install strategy and detection behavior are described in project docs such as [Architecture](architecture.md).
- **Host-runtime parity**: end-to-end proof that the installed command surface behaves equivalently inside the host agent. Scriveno does not currently ship this proof for any runtime in the repo.

## Support Levels

- **Primary reference runtime**: the runtime used as Scriveno's primary example when docs need one concrete reference environment.
- **Standard installer target**: the installer ships a first-class command-directory target for this runtime, with registry and path-shape evidence in the repo.
- **Skills installer target**: the installer ships a manifest-based target for runtimes that do not use command directories.
- **Guided desktop MCP target**: the installer ships setup assets and connector recipes for a documented desktop local-MCP surface rather than a writable command directory.
- **Generic skills fallback**: a catch-all manifest target for platforms without a dedicated runtime adapter.

## Verification Status

- **Registry-tested**: installer registry shape is covered by automated tests.
- **Repo-documented**: detection and install strategy are documented in the repo.
- **No host-runtime parity verification yet**: Scriveno does not currently ship an end-to-end verification artifact for behavior inside the host runtime.

## Runtime Compatibility Matrix

| Runtime | Install Type | Install Path Shape | Repo Evidence | Support Level | Verification Status |
|---------|--------------|--------------------|---------------|---------------|---------------------|
| Claude Code | commands | `~/.claude/commands/scr-*.md` + `~/.claude/agents` or `.claude/commands/scr-*.md` + `.claude/agents` | Installer registry, registry-tested, repo-documented | Primary reference runtime | Registry-tested; repo-documented; no host-runtime parity verification yet |
| Cursor | commands | `~/.cursor/commands/scr` + `~/.cursor/agents` or `.cursor/commands/scr` + `.cursor/agents` | Installer registry, registry-tested, repo-documented | Standard installer target | Registry-tested; repo-documented; no host-runtime parity verification yet |
| Gemini CLI | commands | `~/.gemini/commands/scr` + `~/.gemini/agents` or `.gemini/commands/scr` + `.gemini/agents` | Installer registry, registry-tested, repo-documented | Standard installer target | Registry-tested; repo-documented; no host-runtime parity verification yet |
| Codex | skills | `~/.codex/skills/scr-*` or `.codex/skills/scr-*` (with mirrored command files in `~/.codex/commands/scr` or `.codex/commands/scr`) | Installer registry, registry-tested, repo-documented | Skills installer target | Registry-tested; repo-documented; no host-runtime parity verification yet |
| OpenCode | commands | `~/.config/opencode/commands/scr` + `~/.config/opencode/agents` or `.config/opencode/commands/scr` + `.config/opencode/agents` | Installer registry, registry-tested, repo-documented | Standard installer target | Registry-tested; repo-documented; no host-runtime parity verification yet |
| GitHub Copilot | commands | `~/.github/commands/scr` + `~/.github/agents` or `.github/commands/scr` + `.github/agents` | Installer registry, registry-tested, repo-documented | Standard installer target | Registry-tested; repo-documented; no host-runtime parity verification yet |
| Windsurf | commands | `~/.windsurf/commands/scr` + `~/.windsurf/agents` or `.windsurf/commands/scr` + `.windsurf/agents` | Installer registry, registry-tested, repo-documented | Standard installer target | Registry-tested; repo-documented; no host-runtime parity verification yet |
| Antigravity | commands | `~/.gemini/antigravity/commands/scr` + `~/.gemini/antigravity/agents` or `.gemini/antigravity/commands/scr` + `.gemini/antigravity/agents` | Installer registry, registry-tested, repo-documented | Standard installer target | Registry-tested; repo-documented; no host-runtime parity verification yet |
| Manus Desktop | skills | `~/.manus/skills/scriveno/SKILL.md` or `.manus/skills/scriveno/SKILL.md` | Installer registry, registry-tested, repo-documented | Skills installer target | Registry-tested; repo-documented; no host-runtime parity verification yet |
| Perplexity Desktop | guided-mcp | `~/.scriveno/perplexity/SETUP.md` or `.scriveno/perplexity/SETUP.md` plus Perplexity Desktop Connectors setup | Installer registry, registry-tested, guided setup assets, repo-documented | Guided desktop MCP target | Registry-tested; repo-documented; no host-runtime parity verification yet |
| Generic (SKILL.md) | skills | `~/.scriveno/skills/SKILL.md` or `.scriveno/skills/SKILL.md` | Installer registry, registry-tested | Generic skills fallback | Registry-tested; no host-runtime parity verification yet |

## What Scriveno Proves Today

Scriveno currently proves all of the following in-repo:

- a named installer target exists for each runtime listed above
- each target has a declared install strategy (`commands`, `skills`, or `guided-mcp`)
- each target has expected install-path properties in the installer registry
- the runtime registry shape is covered by automated installer tests
- the high-level install strategies and detection rules are documented in [Architecture](architecture.md)

Scriveno does not currently prove:

- end-to-end host-runtime parity across every listed runtime
- that every runtime behaves identically once commands are installed
- dedicated smoke-test artifacts for each runtime environment

That distinction is intentional. Installer-path coverage and guided setup assets are valuable, but they are not the same thing as verified runtime parity.

## See Also

- [Getting Started](getting-started.md) -- install flow and first-run expectations
- [Shipped Assets](shipped-assets.md) -- trust-critical files that ship with the package
- [Release Notes](release-notes.md) -- latest package-level summary
