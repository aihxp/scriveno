# Auto-Invoke Policy

Scriveno can be proactive, but it must be proactive from disk evidence. Commands should inspect `.manuscript/`, reports, timestamps, config, and installed runtime surfaces before choosing an automatic helper.

## Cross-Platform Agent Rules

Scriveno agent prompts live in `agents/*.md`. Each host runtime exposes them differently:

- Claude Code installs command files in `~/.claude/commands/` and agent prompts in `~/.claude/agents/`.
- Codex installs `$scr-*` skills, mirrored command files, agent prompts, and `.toml` metadata so Codex can expose agent types.
- Cursor, Gemini CLI, OpenCode, Copilot, Windsurf, and Antigravity install nested command directories and agent prompts in their runtime-specific agent directories.
- Manus and the generic skill runtime bundle `SKILL.md`, commands, and agents inside the skill directory.

When a host supports native fresh-context spawning, use the native agent or subagent mechanism. When it does not, load the installed agent prompt from the active runtime and run it in an isolated fresh context. When the action is only a file operation, report `Agent: none`.

Every automatic path must make the distinction visible.

```text
Agent status:
Trigger: <command or state condition>
Spawned agents:
- <agent-name>: <count, none, or prompt-run fallback used>
Local operations:
- <operation>: <result>
Auto-invoked:
- <command or helper>: yes/no
Why: <one sentence tied to disk state>
```

Use `Automation status:` for command chains and `Sync status:` for runtime install or sync checks.

## Levels

| Level | Behavior | Default | Examples |
|-------|----------|---------|----------|
| 1 | Read-only suggestion | Run by default | `/scr:next` route, progress sweep, review queue surfacing |
| 2 | Safe local helper | Run when directly triggered | `CONTEXT.md` regeneration, `HISTORY.log` append, scan report, stats count |
| 3 | Scoped agent | Spawn when the command implies it or evidence is bounded | drafter, plan-checker, voice-checker, continuity-checker, translator, beta-reader |
| 4 | Writer-owned action | Require confirmation | publishing, destructive edits, merge decisions, accepting review findings |

## Level 1: Auto-Suggest

Run these read-only checks in `/scr:next`, `/scr:progress`, and closeouts for major commands:

- If `STATE.md`, `CONTEXT.md`, `HISTORY.log`, or draft mtimes disagree, suggest `/scr:scan`.
- If voice or continuity reports have unresolved issues, suggest `/scr:voice-check`, `/scr:continuity-check`, or `/scr:editor-review`.
- If editor notes or track proposals exist, suggest `/scr:editor-review --notes`, `/scr:editor-review --respond`, or `/scr:track`.
- If translation folders exist or config lists target languages, suggest translation follow-ups.
- If export outputs are older than source files, suggest `/scr:export` or `/scr:publish`.
- If no save exists after recent manuscript changes, suggest `/scr:save`.

These checks must not mutate files.

## Level 2: Auto-Run Local Helpers

Run these only when the current command directly owns the file operation:

- `/scr:save` regenerates `.manuscript/CONTEXT.md`, appends `HISTORY.log`, and commits `.manuscript/`.
- `/scr:scan --fix` applies deterministic state repairs after confirmation and appends `HISTORY.log`.
- `/scr:resume-work` may regenerate `CONTEXT.md` from disk state.
- `/scr:progress` may count drafts, submitted units, open record threads, and stale reports, but does not write.
- Runtime `/scr:sync --apply` runs the installer and verifies installed command, skill, and agent surfaces.

Report these as local operations, not spawned agents.

## Level 3: Auto-Spawn Scoped Agents

Spawn or prompt-run fallback is appropriate when the command already implies a specialist role:

- `/scr:plan` invokes `plan-checker` per plan.
- `/scr:draft` invokes `drafter` per atomic unit and a voice diagnostic pass when a draft was produced.
- `/scr:voice-check` invokes `voice-checker`.
- `/scr:continuity-check` invokes `continuity-checker`.
- `/scr:translate` invokes `translator` per unit.
- `/scr:beta-reader` invokes a beta reader persona.
- `/scr:map-manuscript` invokes analysis workers, or isolated sequential analysis if parallel workers are unavailable.
- `/scr:editor-review` invokes revision diagnostics only for flagged issue groups.

Do not pretend command-local analysis workers are installed agent files unless they actually are.

## Level 4: Manual Only

Never auto-run these without explicit writer confirmation:

- deleting or removing units
- accepting, rejecting, or applying editor decisions
- merging revision tracks
- clearing review findings
- final publish or submission packaging
- overwriting generated export packages
- destructive repair, reset, revert, or cleanup
- broad translation or cultural adaptation chains outside autopilot

## Required Closeout

Every proactive command should end with:

- one recommended next command
- a short reason tied to disk state
- status showing whether agents spawned, local operations ran, or manual boundaries stopped automation
