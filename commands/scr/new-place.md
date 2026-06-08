---
description: Create a confirmed place profile in PLACES.md through guided questions.
argument-hint: "<name>"
---

# /scr:new-place -- Create Place Profile

Create a confirmed place entry in `PLACES.md`.

## Usage

```
/scr:new-place <name>
```

## Instruction

Load:

- `.manuscript/config.json`
- `docs/surface-resolution-protocol.md`
- `docs/world-layers-protocol.md`
- `WORK.md`
- the adapted world surface for canonical `WORLD.md`, when applicable
- `.manuscript/PLACES.md` if it exists, otherwise prepare it from `templates/PLACES.md`
- `.manuscript/RESEARCH.md` if it exists

If canonical `WORLD.md` is `not_applicable` for this work type, stop and explain that place tracking is not active for this project shape. Suggest `/scr:subject-touch` only if the named item behaves like a theme, object, concept, or process instead of a place.

## Interview

Ask only for missing essentials. If the writer already gave an answer, do not ask again.

1. What kind of place is this: real, fictional, altered-real, region, building, route, landmark, realm, or system environment?
2. What larger place contains it, if any?
3. What role does it play in the work?
4. What geography, access, route, or boundary detail must stay consistent?
5. If this is a real or historical place, should Scriveno suggest `/scr:research "<name>" --place` after creating it?

## Write

Append one complete `### <name>` profile to `.manuscript/PLACES.md` using `templates/PLACES.md`.

Include:

- type
- parent or containing region
- aliases
- appears in, if known from draft mentions
- story role
- geography and access
- sensory identity
- social or historical context
- real-world facts only if already sourced in `RESEARCH.md`
- author deviations
- continuity rules

Do not auto-fill factual claims about real places unless they are sourced in `RESEARCH.md`. If research is needed, leave a `Research status: pending` line and suggest `/scr:research`.

## Derived Geography

If `PLACES.md` now has two or more place profiles, or if the new place defines a parent, route, border, or distance, regenerate `.manuscript/GEOGRAPHY.md` from `PLACES.md` plus the adapted world surface per `docs/world-layers-protocol.md`.

## History And Save

Append to `.manuscript/HISTORY.log`:

```text
{ISO timestamp} | scr:new-place | place=<name> | outcome=ok
```

Commit: `place: add {name}`

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
- `/scr:place-touch <name>`: Refine this place after drafting or research.
- `/scr:geography-map`: See how confirmed places relate spatially.
- `/scr:research "<name>" --place`: Add sourced factual context if this is a real place.
```
