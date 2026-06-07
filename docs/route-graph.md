# Route Graph Audit

Scriveno's route graph is generated from `data/CONSTRAINTS.json` and `lib/auto-invoke-engine.js`. It is not a separate hand-maintained registry.

Run the audit with:

```bash
scriveno routes
scriveno routes --json
```

The text report summarizes command count, graph edges, agent-capable routes, local-helper routes, manual-gated routes, read-only routes, and lane counts. The JSON report includes nodes and edges for host adapters, CI checks, and future visualizations.

## Current Shape

As of `3.2.0`, the route graph contains:

- 117 commands
- intent-order edges from `command_intents`
- dependency-chain edges from `dependencies.core_chain`
- automation lanes from `getCommandAutomationPolicy()`
- route priority fixtures for high-value state transitions

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

These fixtures are covered by `test/auto-invoke-engine.test.js`.

## Cross-Runtime Use

All runtimes use the same route graph audit. Claude Code, Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, and Antigravity read command files and prompt agents. Codex reads generated `$scr-*` skills plus `.toml` agent metadata. Manus and the generic fallback read bundled skill files. Perplexity Desktop receives guided local-MCP setup. The graph stays shared even when the host's native spawning behavior differs.
