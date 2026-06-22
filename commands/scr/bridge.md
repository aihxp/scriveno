---
description: Diagnose a weak seam between two units and offer transition fixes in the writer's voice.
argument-hint: "[<boundary>] [--apply <option>]"
---

# /scr:bridge -- Seam Diagnosis and Transition Repair

Diagnose one unit boundary that is not knitting together, and offer the writer the transition options their voice profile prefers. Most "it dragged here" and "wait, how did we get here" reactions live at these seams, not inside the units themselves.

This command **diagnoses first and generates prose only on request.** The default fix for a weak seam is frequently a clean cut, not added connective tissue, because invented bridge prose ("Later that evening...", "As the sun set, she realized...") is exactly where drafting starts to sound like generic AI. The command never writes a bridge into the draft unless the writer chooses that option.

## Usage
```
/scr:bridge [<boundary>]
/scr:bridge [<boundary>] --apply <option>
```

`<boundary>` names the two adjacent units in the work's own vocabulary (chapters, scenes, acts, sections, surahs). Accept `8-9`, `8 9`, or a single unit `9` (meaning the seam entering unit 9 from its predecessor). `<option>` is one of `hard-cut`, `time-marker`, `bridge`, or `upstream`.

## Instruction

You are repairing the **joint between two units**, not rewriting either unit.

### STEP 0: LOAD CONTEXT

1. Load `.manuscript/config.json` for work type and hierarchy. Load `CONSTRAINTS.json`: this command is **hidden** from poetry and speech_song work types. If the current work type is in a hidden group, tell the writer this work type does not use unit-to-unit narrative seams and exit gracefully.
2. Resolve `<boundary>` to two adjacent drafted units using the work type's hierarchy terminology (do not assume "chapter"). If the writer gave a single unit `N`, the boundary is `N-1 -> N`. If the boundary is ambiguous or a unit is undrafted, ask once for clarification.
3. Load the **Transitions** section of `.manuscript/STYLE-GUIDE.md` (`SCENE_TRANSITIONS`, `CHAPTER_TRANSITIONS`, `SCENE_BREAK_MARKER`, `TIME_JUMP_MARKER`). The writer's declared transition style and markers drive which options you offer first.
4. Load the drafted **tail** of the earlier unit and the drafted **head** of the later unit.
5. Load `RECORD.md` (open threads, next-unit obligations, and continuity facts that cross this boundary) and both units' plan files when present (Causal Anchor, Record Notes).
6. If a `*-PACING-REPORT.md` exists, reuse its seam classification for this boundary from `/scr:pacing-analysis --seams` rather than recomputing from scratch.

### STEP 1: DIAGNOSE THE SEAM

Classify the boundary using the same vocabulary as `/scr:pacing-analysis --seams`: clean handoff, hook-into-hook, hard cut, soft fade, abrupt/whiplash, or flat seam. Then state in one or two sentences **why** it reads that way: a settled close into an exposition open, a time jump the open never signals, an emotional discontinuity (the unit ends in despair and the next opens energized with no bridge), an unhandled next-unit obligation from RECORD.md, and so on. If the seam is already clean, say so and stop; do not invent a problem.

### STEP 2: OFFER OPTIONS

Present a small set of options, ordered by the writer's STYLE-GUIDE preference and the diagnosis. For each, say what it does and when it is right:

- **`hard-cut`** -- often the right answer. Insert the writer's scene-break or time-jump marker (`SCENE_BREAK_MARKER`, `TIME_JUMP_MARKER`) and let the units stand as written. No prose added.
- **`time-marker`** -- a dateline or labeled break that orients the reader across a jump, in the writer's marker convention.
- **`bridge`** -- a sentence or short paragraph that carries the reader across. This is the only option that generates prose, and only on explicit selection.
- **`upstream`** -- when the real problem is the close of the earlier unit or the open of the later one, recommend `/scr:editor-review` on that unit or a targeted `/scr:draft` revision instead of a bridge.

Recommend the option that fits the diagnosis. Do not default to `bridge`.

### STEP 3: APPLY (only on an explicit choice)

Act only when the writer selects an option (or passed `--apply <option>`).

- For `hard-cut` and `time-marker`: state the exact edit (insert the marker at the boundary). Do not generate prose.
- For `bridge`: load `STYLE-GUIDE.md`, draft the **minimal** bridge in the writer's voice, honoring any crossing RECORD.md obligation rather than restating prior-unit state. Show it as a proposal and write it at the boundary only after the writer confirms. Never expand a bridge beyond what the diagnosis calls for, and never add throat-clearing or summary.
- For `upstream`: hand off to the recommended command and write nothing.

### STEP 4: RECORD AND HAND OFF

Append one line to `.manuscript/HISTORY.log` per `docs/history-protocol.md`:

```
{ISO timestamp} | scr:bridge | boundary={a-b} | option={chosen or "diagnosed"} | outcome=ok|skipped
```

If a bridge changed the page, recommend `/scr:voice-check` on the affected unit, and `/scr:continuity-check` when the bridge touches a tracked thread or continuity fact.

## Agent and Automation Status

Every response must include a short status block that makes invocation visible:

```text
Agent status:
Trigger: /scr:bridge {boundary}
Spawned agents:
- none
Local operations:
- seam diagnosed: yes/no
- option applied: {hard-cut | time-marker | bridge | upstream | none}
- bridge prose written: yes/no
Auto-invoked:
- none
Why: bridge diagnoses one seam and applies only the fix the writer chooses; it does not rewrite prose on its own
```

If native diagnostic spawning is unavailable, this command needs none: it runs in the current context with no fallback worker required.

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
