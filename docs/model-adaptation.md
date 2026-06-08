# Model Adaptation

Scriveno adapts to host runtimes and model classes without choosing the underlying model. The host owns model selection, context limits, native worker APIs, and parallel execution. Scriveno supplies the stable command files, agent prompts, context boundaries, fallback behavior, and merge rules.

This guide is the codebase-level bridge between runtime installation and model behavior. Use it with [Runtime Support](runtime-support.md), [Auto-Invoke Policy](auto-invoke-policy.md), [Subagent Spawning Protocol](subagent-spawning-protocol.md), and [Drafter Quality](drafter-quality.md).

## Source of Truth

- `bin/install.js` writes the runtime-specific command, skill, prompt, metadata, and shared asset surfaces.
- `lib/auto-invoke-engine.js` exposes `DEFAULT_RUNTIME_SUPPORT`, `DEFAULT_MODEL_POLICY`, `MODEL_ADAPTATION_DOCS`, `scriveno agents`, and `scriveno smoke`.
- `docs/subagent-spawning-protocol.md` defines worker fan-out, fallback, and merge rules.
- `docs/drafter-quality.md` defines `draft.rigor` and `draft.context_profile` recommendations for different model classes.
- `templates/RESEARCH.md` and `docs/research-protocol.md` keep research advisory unless the writer accepts it into an owner file.

## Runtime Families

| Runtime family | Installed surface | Model adaptation |
|----------------|-------------------|------------------|
| Codex | `$scr-*` skills, mirrored command files, agent prompts, and `.toml` metadata | Use native agent roles when exposed. Otherwise load the matching `.codex/agents/*.md` prompt in a fresh context and report `prompt-run fallback used`. |
| Claude Code | flat `/scr-*` command files plus agent prompts | Use native agents when exposed. Otherwise load `.claude/agents/*.md` in a fresh context and keep command output in the shared status shape. |
| Cursor, Gemini CLI, OpenCode, Copilot, Windsurf, Antigravity | nested `/scr:*` commands plus agent prompts | Use the host worker API when available. Otherwise use isolated prompt-run fallback from the installed agent prompt. |
| Manus and generic skill hosts | bundled `SKILL.md`, mirrored commands, and agent prompts | Treat `SKILL.md` as the command index. Run the matching command file and agent prompt manually when native workers are unavailable. |
| Perplexity Desktop | guided local-MCP setup | Do not assume workers. Use connector-backed file reads and report no native spawned agents. |
| Kimi-compatible or other unlisted hosts | generic `SKILL.md` fallback unless a dedicated adapter exists | Use the same Scriveno prompt contract through the generic skill surface. Do not claim runtime parity. |

## Latest Shared Adaptations

These features must stay available through every installed surface:

- neutral `RESEARCH.md` notes governed by `docs/research-protocol.md`
- `/scr:research` researcher fan-out for source-grounded advisory notes
- `/scr:scan --deep` read-only audit workers after deterministic scan checks
- `/scr:plan` preflight workers for record drift, research gaps, place logic, subject dynamics, and cast pressure
- `/scr:editor-review` diagnostic workers by issue group
- `/scr:autopilot` lookahead workers that find blockers without drafting ahead
- visible status blocks that distinguish spawned agents, prompt-run fallback, local operations, and manual gates

## Model Tier Settings

Use model class to tune rigor, not to change canon rules.

| Model class | Recommended settings | Notes |
|-------------|----------------------|-------|
| Strong reasoning model | `draft.rigor: standard`, `draft.context_profile: full` | Good default for rich plans, complex continuity, and multi-source research. |
| Smaller or weaker model | `draft.rigor: strict`, `draft.context_profile: minimal` | Keeps the drafter close to `STYLE-GUIDE.md`, `WRITING-RULES.md`, and the pitfall pack. |
| Any model under context pressure | `draft.context_profile: minimal` | Prefer shorter loaded context over stale or noisy context. Run `/scr:save` and `/scr:health --context` when context grows. |

`STYLE-GUIDE.md` stays sovereign in every model tier. `WRITING-RULES.md`, pitfall packs, research notes, and worker findings are scaffolding, not a replacement for the writer's voice or accepted project canon.

## Non-Claims

Scriveno does not claim:

- host-runtime parity across every listed runtime
- identical behavior from Codex, Claude, Kimi-compatible hosts, or any other model
- hidden background agents
- automatic canon promotion from research or worker output
- that a generic skill host has native worker spawning

The portable guarantee is narrower: the installed source prompts, command contracts, fallback path, merge rules, and status reporting stay aligned across runtimes.
