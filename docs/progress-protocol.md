# Progress ledger protocol

This is the canonical contract for `.manuscript/PROGRESS.md`, Scriveno's openable per-unit progress ledger, and for how every command derives and renders unit status. The goal is one consistent answer to the question a writer asks most often: *what is done, what is in progress, what is untouched, and where are we in the journey?*

It is part of the trust layer, alongside the other derived and recorded surfaces:

- `STATE.md` -- structured workflow snapshot (aggregate counters, current position)
- `RECORD.md` -- compact established-content store
- `.manuscript/CONTEXT.md` -- one-page narrative bootstrap (synthesis, read first by a fresh session)
- `.manuscript/PROGRESS.md` -- per-unit progress ledger (the file you open to see every unit's status)
- `.manuscript/HISTORY.log` -- append-only audit trail

`STATE.md` answers "how many units are drafted." `PROGRESS.md` answers "which ones, and what state is each in." They never disagree because both are reconciled against disk, and `/scr:scan` is the trust check.

## What PROGRESS.md is for

`STATE.md` holds aggregate counts (`Units drafted: 4 of 5`). That tells the writer how far along they are but not *which* unit is where. `PROGRESS.md` is the deliverable-level view: a single human-readable file the writer can open to see every unit with its status (done / in progress / untouched), the macro pipeline position, recent activity, and the next step. It is the writing-domain analog of a requirements checklist.

The template lives at `templates/PROGRESS.md`. The file is **derived**: never hand-edited, always rebuilt from disk. Like `CONTEXT.md`, it is not created at `/scr:new-work`; it is generated the first time a unit-status-changing command or a save/pause/resume runs.

## The three status buckets

Every unit resolves to exactly one headline status. Derive it from disk first, then reconcile with `STATE.md`:

| Bucket | Marker | Disk condition |
|--------|--------|----------------|
| **Untouched** | `[ ]` | No plan file and no draft file for the unit. Not yet worked. |
| **In progress** | `[~]` | Started but not finished: a plan exists without a draft, a draft exists without a clean review, a review has open editor notes, or revisions are pending. |
| **Done** | `[x]` | The unit needs no more work this pass: it is submitted, or (for flows that stop at review) reviewed with no open notes. |

The headline bucket sits next to a finer **stage** so the writer sees both the rollup and the precise position.

## Per-unit stage derivation (disk-first)

Match each outline unit to its files by unit number. Use the same evidence `/scr:scan` uses (see `commands/scr/scan.md`, checks 1-3):

- **untouched** -- no `.manuscript/plans/{N}-*-PLAN.md` (or legacy `.manuscript/{N}-*-PLAN.md`) and no `.manuscript/drafts/body/{N}-*-DRAFT.md`
- **discussed** -- a `{N}-CONTEXT.md` exists but no plan or draft yet
- **planned** -- a plan file exists, no draft file
- **drafted** -- a draft file exists, no review report
- **reviewed** -- a `.manuscript/reviews/{N}-REVIEW.md` (or legacy `{N}-EDITOR-NOTES.md`) exists; treat as *reviewed with open notes* (in progress) when the review or `STATE.md` lists unresolved items, otherwise *reviewed clean*
- **submitted** -- `STATE.md` marks the unit submitted

Map stages to buckets: `untouched` -> untouched; `discussed`, `planned`, `drafted`, `reviewed-with-open-notes`, `revisions-pending` -> in progress; `reviewed-clean` (when the flow stops at review) and `submitted` -> done.

Word count per unit comes from the unit's draft file(s); show `--` for units with no draft.

## Pipeline position

The macro writing lifecycle is the default map (same chain `/scr:next` walks):

```
seed > voice > outline > discuss > plan > draft > review > revise > publish > translate
```

Compute the current stage as the first incomplete step across the whole project, render it as `Stage {index} of {total}: {Name}`, and show the track with the current stage bracketed, for example:

```
seed > voice > outline > discuss > plan > [draft] > review > revise > publish > translate
```

Translate is only relevant when the project has target languages configured; keep it in the track for orientation but never treat its absence as incomplete for a single-language project.

## The deliverable progress bar

Render a 10-cell bar over the done fraction using block characters (`U+2588` filled, `U+2591` empty), followed by counts and percent:

```
████████░░ 4/5 scenes done (80%)
```

The denominator is the total unit count from `OUTLINE.md`. Percent is `round(done / total * 100)`. Use the work type's plural unit label (scenes, chapters, surahs, procedures, poems, and so on) from `CONSTRAINTS.json`; never hard-code "chapter."

## Ledger table shape

Group rows by the work type's mid level (act, part, sequence) when the outline has one, with a per-group rollup in the heading. Within a group, one row per atomic unit:

```
### Act I -- Disruption (2/2 done)

| # | Title | Stage | Status | Words |
|---|-------|-------|--------|-------|
| 1 | The Letter   | submitted | [x] | 1,020 |
| 2 | The Workshop | reviewed  | [x] | 1,010 |

### Act II -- Decision (0/1 done, 1 in progress)

| # | Title | Stage | Status | Words |
|---|-------|-------|--------|-------|
| 3 | The Pier | drafted | [~] | 890 |
```

For work types without a mid level (short story, poetry collection), use a single flat table.

## Who regenerates PROGRESS.md

The ledger is a Level 2 safe local helper (see `docs/auto-invoke-policy.md`). It is rebuilt by the commands that change unit status or refresh derived state, never by a read-only command:

- `/scr:draft` -- after a unit is drafted and STATE.md is updated
- `/scr:editor-review` -- after a unit is marked reviewed
- `/scr:submit` -- after a unit is marked submitted
- `/scr:autopilot` -- after every unit, as part of the mandatory state update (so the file advances visibly during a run)
- `/scr:save`, `/scr:pause-work`, `/scr:resume-work` -- alongside `CONTEXT.md` regeneration, from the shared field set in `/scr:save` step 7
- `/scr:scan --fix` -- when the ledger is missing or stale

`/scr:progress` is read-only: it renders this picture live from disk and points the writer at `PROGRESS.md`, but it does not write the file. When the live view is ahead of the saved file (units changed since the last refresh), `/scr:progress` says so and suggests `/scr:save`.

## Token reference

A regenerator fills these tokens in `templates/PROGRESS.md`:

| Token | Source |
|-------|--------|
| `{{LAST_UPDATED}}` | ISO 8601 timestamp of this regeneration |
| `{{LAST_COMMAND}}` | the command that triggered the rebuild |
| `{{TITLE}}`, `{{WORK_TYPE}}` | `config.json` |
| `{{UNIT_LABEL}}`, `{{UNIT_LABEL_PLURAL}}` | `CONSTRAINTS.json` hierarchy for the work type |
| `{{PROGRESS_BAR}}`, `{{DONE_PERCENT}}` | computed from the done fraction |
| `{{DONE_COUNT}}`, `{{IN_PROGRESS_COUNT}}`, `{{UNTOUCHED_COUNT}}`, `{{TOTAL_COUNT}}` | per-unit derivation above |
| `{{WORD_COUNT}}` | sum of draft word counts |
| `{{STAGE_INDEX}}`, `{{STAGE_TOTAL}}`, `{{STAGE_NAME}}`, `{{LIFECYCLE_TRACK}}` | pipeline position above |
| `{{LEDGER_TABLE}}` | grouped ledger rows above |
| `{{RECENT_ACTIONS}}` | last 3-5 lines of `HISTORY.log` (or STATE.md Last actions) as rows |
| `{{NEXT_STEP}}` | the suggestion `/scr:next` would emit |
| `{{LAST_SCAN}}`, `{{LAST_SCAN_VERDICT}}` | `STATE.md` if recorded, else `never run` / `unknown` |

## When this protocol does not apply

- **Read-only views** (`/scr:progress`, `/scr:manuscript-stats`, `/scr:outline`) consume and render the derivation but do not write `PROGRESS.md`.
- **First-write commands** (`/scr:new-work`, `/scr:import`) -- no units exist yet; the ledger is generated on the first status-changing command or save.

The protocol is a hint, not a hard gate. A command that cannot parse the outline cleanly should fall back to the aggregate `STATE.md` counts and say so, rather than emit a wrong per-unit ledger.
