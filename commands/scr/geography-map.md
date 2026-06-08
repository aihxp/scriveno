---
description: Render or regenerate the derived geography map from PLACES.md and the world surface.
argument-hint: "[--fix] [--region <name>]"
---

# /scr:geography-map -- Derived Geography Map

Render or regenerate `.manuscript/GEOGRAPHY.md`.

## Usage

```
/scr:geography-map [--fix] [--region <name>]
```

## Instruction

Load:

- `.manuscript/config.json`
- `docs/surface-resolution-protocol.md`
- `docs/world-layers-protocol.md`
- `.manuscript/PLACES.md`
- the adapted world surface for canonical `WORLD.md`, when applicable
- `.manuscript/RECORD.md` when present

If `PLACES.md` is missing, stop and suggest `/scr:new-place <name>`.

## Derive

Build a map from confirmed project files:

- place hierarchy: parent, child, region, realm, building, landmark
- adjacency: beside, across, north-of, inside, route-to, distant-from
- routes and travel logic
- borders, barriers, and dangerous passages
- map-ready summaries for `/scr:map-illustration`

Label each relationship:

- `confirmed`: explicitly stated in `PLACES.md` or the adapted world surface
- `implied`: inferred from multiple confirmed place entries
- `undefined`: likely needed but not established

Do not invent geography to fill blanks. Surface undefined spatial relationships as questions.

If `--region <name>` is passed, render only that region and its neighbors.

## Output Modes

Default mode is read-only: render the derived map in the response and say whether `.manuscript/GEOGRAPHY.md` is missing or stale.

With `--fix`, write `.manuscript/GEOGRAPHY.md` using `templates/GEOGRAPHY.md`, then append to `.manuscript/HISTORY.log`:

```text
{ISO timestamp} | scr:geography-map | action=regenerate | outcome=ok
```

## Response Contract

Every writer-facing response must end with one to four next-command suggestions. Each suggestion must include a short explanation of what that path will do.

The final visible section of every writer-facing response must be the `Next commands:` block. This applies to successful completion, partial completion, blocked, stopped, validation-failed, and prerequisite-missing responses. Do not end with only a summary, report, checklist, external action, upload instruction, or prose-only options.

Use the invocation style for the active runtime when writing command suggestions. Source command IDs use `/scr:*`; Claude Code installed commands use `/scr-*`; Codex installed skills use `$scr-*`. Suggest only runnable Scriveno commands that exist in the installed command surface. Do not invent adjacent workflow names.

Use this format:

```markdown
Next commands:
- `/scr:...`: One short sentence explaining what this path will do.
- `/scr:...`: One short sentence explaining what this alternate path will do.
```

If exactly one path is clearly best, provide one suggestion. If two, three, or four useful paths exist, show them as alternatives. Do not force a linear path when the writer has a real choice.

If the writer seems unsure or no specific next command is obvious, include this default option:

```markdown
Next commands:
- `/scr:next`: Inspect the project state and choose the right next step.
```

```markdown
Next commands:
- `/scr:place-touch <name>`: Fill a missing route, boundary, or continuity rule.
- `/scr:map-illustration --region <name>`: Generate a visual map prompt from the geography.
- `/scr:scan`: Check for unregistered place mentions and stale derived geography.
```
