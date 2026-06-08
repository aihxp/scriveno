---
description: Update a place's evolving geography, appearances, research status, or continuity rules.
argument-hint: "<name> [--from <unit>]"
---

# /scr:place-touch -- Update Place State

Update a confirmed place entry in `PLACES.md`.

## Usage

```
/scr:place-touch <name> [--from <unit>]
```

## Instruction

Load:

- `.manuscript/config.json`
- `docs/surface-resolution-protocol.md`
- `docs/world-layers-protocol.md`
- `.manuscript/PLACES.md`
- the adapted world surface for canonical `WORLD.md`, when applicable
- `.manuscript/RESEARCH.md` if it exists
- the drafted unit file named by `--from`, or the most recently modified draft file if `--from` is omitted

If `PLACES.md` is missing or has no matching entry, stop and suggest `/scr:new-place <name>`.

## Propose Delta

Find the place by case-insensitive heading or alias match. Read the basis draft or research notes and propose only visible changes:

1. appearances or first-seen updates
2. geography, routes, borders, distance, or access changes
3. sensory identity
4. social, historical, or political context
5. real-world facts accepted from `RESEARCH.md`
6. author deviations
7. continuity rules

Show the writer this exact confirmation shape:

```text
Place: <name>
Basis: <unit, research note, or manual update>

Proposed updates to PLACES.md:

  Geography/access
    was: <current text>
    now: <proposed text>

  Continuity rules
    + <new rule>

  Research facts accepted
    + <claim and source>

Apply these updates? (yes / no / edit)
```

If the writer says `yes`, apply the delta. If they say `edit`, revise the named dimension and ask again. If they say `no`, exit without writing.

## Apply

Append or update only the relevant lines inside that place's entry. Never overwrite an existing place fact without showing the delta first.

If geography, routes, parent, borders, or distance changed, regenerate `.manuscript/GEOGRAPHY.md` from `PLACES.md` plus the adapted world surface per `docs/world-layers-protocol.md`.

Add or replace:

```text
_Last touched: {ISO timestamp} -- basis: <basis>_
```

Append to `.manuscript/HISTORY.log`:

```text
{ISO timestamp} | scr:place-touch | place=<name> | basis=<basis> | dimensions=<changed dimensions> | outcome=ok
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
- `/scr:geography-map`: View the updated spatial map.
- `/scr:scan`: Check whether any place mentions remain unregistered.
- `/scr:research "<name>" --place`: Add sourced factual context if this place needs grounding.
```
