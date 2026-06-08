# Subagent Spawning Protocol

This protocol defines how Scriveno uses bounded worker agents across runtimes. The goal is better review, research, and planning coverage without making the writing loop unpredictable.

## Contract

Scriveno's contract is the same across runtimes:

1. The command owns the workflow.
2. Workers receive a narrow task, the minimum context needed, and a read/write boundary.
3. Workers return structured findings, not final canon.
4. The command merges worker outputs, resolves conflicts, and writes any allowed files.
5. The response reports what spawned, what fell back to prompt-run, and what ran locally.

Native worker spawning is optional. Prompt-run fallback is part of the product contract, not a degraded afterthought.

## Runtime Behavior

| Runtime family | Installed surface | Spawning expectation |
|----------------|-------------------|----------------------|
| Codex | skills, command mirrors, agent prompts, and `.toml` metadata | Use native agent roles when exposed; otherwise load the installed prompt in a fresh context |
| Claude Code | flat commands plus agent prompts | Use native agents when exposed; otherwise load the installed prompt in a fresh context |
| Cursor, Gemini CLI, OpenCode, Copilot, Windsurf, Antigravity | nested commands plus agent prompts | Use each host's native worker support when exposed; otherwise use isolated prompt-run fallback |
| Manus and generic skills | bundled `SKILL.md`, commands, and agents | Use bundled prompts as isolated workers when the host has no native worker API |
| Perplexity Desktop | guided local-MCP setup | Do not assume worker spawning; use connector-backed file reads and report no native agents |
| Kimi or other unlisted hosts | generic skills fallback unless a dedicated adapter exists | Same Scriveno prompt contract, host-owned model and spawning mechanics |

The model is host-owned. Scriveno does not require Codex, Claude, Kimi, or any other model to behave identically. It ships stable prompts, context boundaries, and merge rules so each host can run the same workflow honestly.

## Worker Envelope

Every worker instruction should name:

- `role`: the specialist perspective
- `objective`: the exact question to answer
- `inputs`: files or excerpts to read
- `write_policy`: usually `read-only`
- `output`: short structured findings
- `confidence`: known, likely, disputed, speculative, or unknown
- `merge_key`: topic, unit, issue group, language, or source surface

Do not let workers update `RECORD.md`, `PLACES.md`, adapted cast files, adapted subject files, drafts, plans, or review files directly. The orchestrating command writes any artifact after merging.

## Fan-Out Patterns

### Research

`/scr:research` may spawn one researcher worker per relevant angle:

- craft and genre
- historical period or figure
- technical, legal, medical, system, or procedural accuracy
- cultural context
- sacred or theological source material
- academic literature, claims, methods, or citations
- public data, institutions, places, transit, weather, or geography
- comparable works

The command merges findings into one `RESEARCH.md` topic section and keeps all notes advisory.

### Planning Preflight

`/scr:plan` may spawn read-only preflight workers when the unit touches a bounded risk:

- record drift
- research gap
- place and geography logic
- subject dynamics
- cast and relationship pressure

Preflight findings become plan constraints, questions, or watchpoints. They do not write project files.

### Deep Scan

`/scr:scan --deep` may spawn read-only auditors after deterministic checks:

- continuity auditor
- place and geography auditor
- relationship and conflict auditor
- research-gap auditor
- voice-risk auditor

Default `/scr:scan` remains local and deterministic. Deep scan is an explicit heavier mode.

### Editor Review

`/scr:editor-review` may spawn diagnostic workers by issue group:

- voice
- pacing
- continuity
- plot causality
- character motivation
- subject dynamics
- factual or source support

The review command merges findings into the review report and keeps writer decisions manual.

### Autopilot Lookahead

`/scr:autopilot` may spawn read-only lookahead workers for the next few units in supervised or full-auto profiles. Lookahead workers identify blockers, research gaps, record drift, and likely quality gates. They do not draft ahead and do not change state.

### Translation

`/scr:translate` and `/scr:autopilot-translate` may run translator workers per language and per unit. Each translation worker gets fresh context, glossary, translation memory, and voice guidance.

## Merge Rules

- Prefer specific cited evidence over broad inference.
- Keep disagreements visible.
- Mark unsupported findings as pending, not facts.
- Never accept worker output into canon without the owning command and writer-controlled handoff.
- If two workers conflict, the orchestrator either resolves from source files or records a blocking question.

## Status Reporting

Use the existing status block shape:

```text
Spawned agents:
- <worker-name>: <count, none, or prompt-run fallback used>
Local operations:
- <operation>: <result>
Auto-invoked:
- <command>: yes/no
Why: <one sentence tied to the command and disk state>
```

If a host does not support native workers, say `prompt-run fallback used` or `parallel unavailable; sequential isolated analysis used`.
