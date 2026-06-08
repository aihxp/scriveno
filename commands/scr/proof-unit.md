---
description: Run one manuscript unit through a proof path from voice profile to export readiness.
argument-hint: "[unit] [--demo] [--export-check]"
---

# Proof Unit

You are proving that Scriveno can carry one unit through the real writing loop without losing the writer's voice.

Follow the auto-invoke policy. In the source repository it is documented at `docs/auto-invoke-policy.md`. `/scr:proof-unit` coordinates existing commands. It should keep every step small and stop before any destructive or publishing action unless the writer explicitly confirms.

## Goal

Run one chosen unit through this vertical slice:

1. Confirm project and voice context.
2. Discuss or refine the unit shape.
3. Plan the unit.
4. Draft the unit with fresh context.
5. Review the draft for voice, continuity, and revision issues.
6. Check context health before another large operation.
7. Check export prerequisites without writing final packages unless requested.

The proof is successful only if the unit still sounds like the writer and the next production step is obvious.

## Inputs

- `unit`: The unit number or label. If omitted, infer it from `.manuscript/STATE.md`.
- `--demo`: Prefer the demo project path and use its planned proof unit.
- `--export-check`: Run `/scr:export --check` after review to verify external tools.

If there is no `.manuscript/` directory, recommend `/scr:demo` or `/scr:new-work` before doing anything else.

## Required Checks

1. Read `.manuscript/STYLE-GUIDE.md` first. If it is missing or thin, suggest `/scr:profile-writer` or `/scr:voice-test` before drafting.
2. Read `.manuscript/STATE.md`, `.manuscript/OUTLINE.md`, and `.manuscript/config.json`.
3. Run context health with the shared engine when available:

```bash
scriveno status --project "$PWD" --trigger /scr:proof-unit
node lib/auto-invoke-engine.js --project "$PWD" --trigger /scr:proof-unit
node "$HOME/.scriveno/lib/auto-invoke-engine.js" --project "$PWD" --trigger /scr:proof-unit
node .scriveno/lib/auto-invoke-engine.js --project "$PWD" --trigger /scr:proof-unit
```

4. If context health is `tight` or `critical`, stop before drafting and suggest `/scr:save`, `/scr:thread`, or a fresh unit session.
5. Verify that the plan, draft, and review files are all unit-scoped. Do not load the whole manuscript into a drafting pass.

## Execution Path

Use the first missing step in order:

1. Missing voice profile: `/scr:profile-writer` or `/scr:voice-test`.
2. Missing unit discussion: `/scr:discuss <unit>`.
3. Missing unit plan: `/scr:plan <unit>`.
4. Missing unit draft: `/scr:draft <unit>`.
5. Missing review: `/scr:editor-review <unit>`.
6. Review flags voice drift: `/scr:voice-check <unit>`.
7. Review flags continuity drift: `/scr:continuity-check <unit>`.
8. Review passes and `--export-check` was provided: `/scr:export --check`.
9. Review passes without export check: `/scr:submit <unit>` or `/scr:progress`.

Do not run more than one prose-generating step without reporting back. The writer should see the proof path as a sequence of verified stops, not a silent batch.

## Proof Report

End with a compact proof report:

```markdown
Proof unit: Chapter 3
Voice profile: present
Plan: present
Draft: present
Review: present
Context health: ok
Export prerequisites: not checked

Result: ready for submit, with no blocking voice drift found.
```

When something fails, name the missing file or blocking step and offer the direct command that fixes it.

## Automation Status

Every response must include a compact status block:

```text
Automation status:
Trigger: /scr:proof-unit {unit}
Spawned agents:
- drafter when /scr:draft is the selected step
- voice-checker when draft or voice review is selected
- diagnostic worker when /scr:editor-review is selected
Candidate agents:
- drafter
- voice-checker
- continuity-checker
Local operations:
- project state inspected: yes
- context health estimated: yes
- export prerequisite check: {yes|no}
Candidate local helpers:
- /scr:health --context
- /scr:export --check
Manual gates:
- publish or final package creation
Auto-invoked:
- {selected command}: {yes|no}
Why: proof-unit coordinates the smallest real writing loop while keeping publishing actions explicit
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

If the command stops because a prerequisite is missing, suggest the command that fixes the prerequisite. Keep every explanation practical and writer-facing.

## Tone

Focused and evidence-first. The point is to build trust with one real unit, not to rush the whole manuscript.
