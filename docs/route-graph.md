# Route Graph Audit

Scriveno's route graph is generated from `data/CONSTRAINTS.json` and `lib/auto-invoke-engine.js`. It is not a separate hand-maintained registry.

Run the audit with:

```bash
scriveno routes
scriveno routes --json
```

The text report summarizes command count, graph edges, command families, agent-capable routes, local-helper routes, manual-gated routes, read-only routes, and lane counts. The JSON report includes nodes, edges, family membership, and family hubs for host adapters, CI checks, and future visualizations.

## Current Shape

As of `3.3.0`, the route graph contains:

- 122 commands
- 144 edges
- 9 command families
- intent-order edges from `command_intents`
- family-member edges from `command_families`
- dependency-chain edges from `dependencies.core_chain`
- automation lanes from `getCommandAutomationPolicy()`
- route priority fixtures for high-value state transitions

## Command Families

`command_intents` remains the main lifecycle spine. `command_families` is the secondary discovery layer for specialist workflows that should stay available without bloating the default help view.

Current family hubs:

- Structure: `/scr:outline`
- Art: `/scr:art-direction`
- Session: `/scr:save`
- Sacred: `/scr:sacred:source-tracking`
- Submission: `/scr:publish`
- Publishing: `/scr:publish`
- World: `/scr:build-world`
- Collaboration: `/scr:track`
- Command Surface: `/scr:surface`

Each family edge points from the hub to a real command. The route graph includes `nodes[].families`, `commandFamilies`, and `family-member` edges so command discovery can stay hub-first while direct specialist commands remain runnable.

## Automation Lanes

Each command receives one lane:

- `read-only`: inspect and recommend
- `local-helper`: deterministic local helper, visible in status
- `agent-ready`: bounded specialist route with known agent prompts
- `agent-or-local`: route may use a specialist or local diagnostic pass
- `mixed`: lifecycle route whose behavior depends on project state
- `manual-gated`: writer-owned action that must stay explicit

## Priority Fixtures

The engine exports priority fixtures for the flows most likely to regress:

- empty workspace routes to `/scr:new-work`
- scanned project without drafts routes to `/scr:plan`
- planned work without drafts routes to `/scr:draft`
- drafts without review coverage route to `/scr:editor-review`
- revision proposals route to `/scr:editor-review --proposal`
- translation work routes to `/scr:back-translate`
- publishing prerequisite gaps route to the first missing packaging prerequisite

These fixtures are covered by `test/auto-invoke-engine.test.js`. `/scr:research` is an agent-ready route because it can invoke the installed researcher prompt, while default `/scr:scan` remains local-helper and `--deep` is the explicit read-only auditor fan-out mode.

## Cross-Runtime Use

All runtimes use the same route graph audit. Claude Code, Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, and Antigravity read command files and prompt agents. Codex reads generated `$scr-*` skills plus `.toml` agent metadata. Manus and the generic fallback read bundled skill files. Perplexity Desktop receives guided local-MCP setup. Kimi-style hosts use the generic skill fallback unless a dedicated adapter exists. The graph stays shared even when the host's native spawning behavior and model differ.
