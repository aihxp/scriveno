---
description: Run one unit through the full pipeline -- discuss, plan, draft, editor-review, line-edit, submit, save. Guided by default.
argument-hint: "[N] [--silent] [--from <stage>]"
---

# Cycle {unit}

You are running ONE unit through the complete per-unit pipeline in order, then banking it with a save. This is the single-unit, transparent counterpart to `/scr:autopilot` (which runs the whole manuscript and stops at submit): `/scr:cycle` does one unit end to end and **always ends with a save**.

The cycle stages, in order:

`discuss -> plan -> draft -> editor-review -> line-edit -> submit -> save`

## Usage
```
/scr:cycle N                 # guided: pause after each prose stage for approve / revise / stop
/scr:cycle N --silent        # run all stages without pausing; still ends with a save
/scr:cycle N --from draft    # resume the cycle mid-way at the named stage
```

`N` is the unit (chapter, scene, act, section, surah, and so on per work type). `--from <stage>` accepts: `discuss`, `plan`, `draft`, `editor-review`, `line-edit`, `submit`, `save`.

## What to do

0. **Bootstrap (context-cost protocol).** Read `.manuscript/CONTEXT.md` first if it exists and is fresh (its `Updated` timestamp is newer than `STATE.md` and the newest file in `.manuscript/drafts/body/`); use it for orientation and skip the matching raw-file loads. Still read `OUTLINE.md` for unit ordering, `RECORD.md` when present, and `config.json` for the `autosave` and `command_unit` settings. See `docs/context-protocol.md` for the contract.

1. **Resolve the unit.** If `N` was omitted, infer the earliest unit that has not completed the cycle from `.manuscript/PROGRESS.md` or `STATE.md`, and state it before proceeding. Confirm the unit exists in `OUTLINE.md`; if it does not, route to `/scr:outline` or `/scr:discuss`. Never re-draft a unit that `STATE.md` shows as submitted unless the writer explicitly asks.

2. **Read `.manuscript/config.json`** for `command_unit` (adaptive naming), the `autosave` block (`enabled`, `after`), and `voice.drift_threshold`.

3. **Determine the start stage.** Default to the first incomplete stage for this unit (discuss if undiscussed, plan if unplanned, draft if undrafted, and so on). If `--from <stage>` is set, start there instead. Run each remaining stage in order through `save`.

4. **Run each stage** by invoking the canonical command for the unit, in order:
   - `/scr:discuss N` -- shape the unit
   - `/scr:plan N` -- plan it
   - `/scr:draft N` -- draft it (includes the drafter's built-in voice self-check)
   - `/scr:editor-review N` -- developmental review
   - `/scr:line-edit N` -- line-level prose pass
   - `/scr:submit N` -- lock the unit
   - `/scr:save` -- bank the git checkpoint (always the final stage)

   Update `STATE.md` after each stage (timestamp, command, unit, outcome) and refresh `.manuscript/PROGRESS.md` so the ledger advances.

5. **Guided pauses (default).** Unless `--silent` is set, pause after each prose-touching stage and wait for the writer:
   - after **draft**, after **editor-review** when it produced revision plans, and after **line-edit**
   - show a one-sentence summary plus the last ~200 words touched (so the writer can spot-check voice without opening files), then prompt **"approve / revise / stop"**
   - **approve** -- continue to the next stage; **revise** -- re-run the current stage with the writer's feedback incorporated; **stop** -- save the current position to `STATE.md` and exit with a `Next commands:` block (resume later with `/scr:cycle N --from <stage>`)
   - `submit` and `save` are deterministic bookkeeping; they do not pause.

6. **Silent mode.** With `--silent`, run all stages in order without pausing, then end with the save. Still honor blocking conditions rather than pushing past them: if `draft` hits a `QUESTION: Blocking`, if `editor-review` surfaces an unresolved issue, or if voice drift exceeds `config.voice.drift_threshold` (default 0.3, i.e. a voice score below 70), stop and report.

7. **Autosave.** The terminal `/scr:save` always runs (the cycle's defined last stage). Additionally, if `config.autosave.enabled` is `true` and `config.autosave.after` is `"stage"`, run `/scr:save` after each of draft, editor-review, and line-edit as well. If `after` is `"unit"`, the terminal save is the unit checkpoint and no extra saves are inserted. See the autosave note in `docs/auto-invoke-policy.md` for the opt-in exception to the manual-save gate.

8. **Finish.** Report the unit's path through the cycle (stages run, word count, voice score when available, save checkpoint) and the manuscript position (for example "3 of 20 done"). End with a `Next commands:` block, commonly `/scr:cycle {N+1}`, `/scr:next`, or `/scr:progress`.

## Adaptive naming

Load `command_unit` from `config.json`. Keep the runnable commands canonical (`/scr:draft N`, and so on) and adapt only the terminology in output (Surah 2, Act 2, Procedure 2, and so on). Never invent new command ids.

## Automation Status

Every response must include a compact status trail so the writer can see what the cycle chained:

```text
Automation status:
Trigger: /scr:cycle N
Auto-invoked commands:
- /scr:discuss N: yes/no
- /scr:plan N: yes/no
- /scr:draft N: yes/no
- /scr:editor-review N: yes/no
- /scr:line-edit N: yes/no
- /scr:submit N: yes/no
- /scr:save: yes/no
Spawned agents:
- drafter: {count}
- voice-checker: {count}
- continuity-checker: {count, usually none}
Local operations:
- STATE.md updated: yes/no
- PROGRESS.md refreshed: yes/no
- HISTORY.log updated: yes/no
- autosave: off | after-unit | after-stage
Pause:
- status: none/guided/blocker
- reason: {one sentence}
```

Each sub-command provides its own agent or automation status block when it runs; this block summarizes the cycle. If a native agent type is unavailable, the sub-command's prompt-run fallback applies and should be reported there.

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

Concise per stage, anchored to the whole manuscript so momentum is visible. Do not narrate the prose; let the writer read the draft, review, and line-edit files. At pauses, be warm and non-technical. In writer mode (`developer_mode: false`) never show git terminology, file paths, or raw errors.
