---
description: Scan the project for context drift between recorded state and what is actually on disk.
argument-hint: "[--fix] [--quiet] [--deep]"
---

# /scr:scan -- Context Drift Scanner

You are the project's drift detector. Trust nothing. Compare what `.manuscript/STATE.md`, `OUTLINE.md`, `RECORD.md`, `PROGRESS.md`, `config.json`, and the various structural files **claim** against what the filesystem actually contains, and report every mismatch.

Follow the auto-invoke policy. In the source repository it is documented at `docs/auto-invoke-policy.md`. Default `/scr:scan` does not spawn agents. It runs deterministic local checks and, under `--fix` after confirmation, deterministic local repairs. With `--deep`, it may spawn read-only audit workers after the deterministic checks finish.

This is the defense against context corruption. A fresh Claude session, a writer who hand-edited files between sessions, an interrupted command, or a partial revert can all leave the project in an internally inconsistent state. STATE.md says 12 units drafted; the disk has 14. OUTLINE.md lists "Chapter 8" but no draft file exists. RECORD.md says a promise is still open but the draft paid it off. STYLE-GUIDE.md was edited yesterday but no voice-check has run since. `/scr:scan` finds those.

This complements `/scr:health` (which fixes structural issues like missing directories) and `/scr:resume-work` (which reads recorded state). `/scr:scan` interrogates whether the recorded state is true.

## Usage

```
/scr:scan              # report-only
/scr:scan --fix        # offer to fix the auto-fixable mismatches
/scr:scan --quiet      # only show drift; suppress the all-clear summary
/scr:scan --deep       # run read-only audit workers after deterministic checks
```

## Instruction

Load `.manuscript/config.json`, `.manuscript/STATE.md`, `.manuscript/OUTLINE.md`, `.manuscript/RECORD.md`, and `.manuscript/PROGRESS.md` when present. Resolve all variable context surfaces through `docs/surface-resolution-protocol.md` before checking adapted files or deciding a surface is not applicable. Each check below produces a finding with one of three severities:

- **DRIFT** -- recorded state contradicts disk reality. Trust nothing downstream until resolved.
- **WARNING** -- an artifact is stale or out of date. Downstream work may be silently using outdated input.
- **INFO** -- worth noticing but not actionable.

Run every check. Do not stop on first finding. Bundle them all into one report.

If `--deep` is passed, load `docs/subagent-spawning-protocol.md` and run the deep audit workers described after CHECK 19. Do not run deep workers before deterministic drift checks complete.

---

### CHECK 1: STATE.md unit counts vs. filesystem

Read `STATE.md` for `Units drafted`, `Units planned`, `Units reviewed`, and `Total words`. Then count what is actually on disk:

- **Units drafted** = files matching `.manuscript/drafts/body/*-DRAFT.md`
- **Units planned** = files matching `.manuscript/plans/*-PLAN.md`; legacy root-level `.manuscript/*-PLAN.md` also counts
- **Units reviewed** = files matching `.manuscript/reviews/*-REVIEW.md`; legacy root-level `.manuscript/*-EDITOR-NOTES.md` also counts
- **Total words** = `wc -w` summed across all `drafts/body/*-DRAFT.md` files

For each metric where STATE.md value != filesystem value, emit:

```
DRIFT  STATE.md units-drafted = 12, on disk = 14 (delta +2)
       Likely cause: drafts written outside /scr:draft, or STATE.md not updated.
       Fix: re-run /scr:draft on the missing units, or update STATE.md to match disk.
```

For total words, allow a 10-word slack (writers tweak prose without re-saving).

---

### CHECK 2: OUTLINE.md units vs. draft files

Parse `OUTLINE.md` for the ordered unit list. Compare against `.manuscript/drafts/body/`:

- **Outline orphans** -- units listed in OUTLINE.md with no draft file. Severity: INFO if the unit was added recently and has no plan yet; DRIFT if a plan file exists but no draft.
- **Draft orphans** -- draft files that do not appear in OUTLINE.md. Severity: DRIFT (an orphan draft will not be assembled at export time and the writer may not know).

For each orphan, emit one finding with the unit identifier and the file path.

---

### CHECK 3: Plan vs. draft alignment

For each `*-PLAN.md` file in `.manuscript/plans/` (and any legacy root-level `*-PLAN.md` file), check whether the corresponding `*-DRAFT.md` exists in `drafts/body/`. If a plan exists but no draft:

```
INFO   Unit 8 has a plan ({N}-{A}-PLAN.md) but no draft yet.
       Next: /scr:draft 8
```

For each draft, check whether the corresponding plan exists. If a draft exists but no plan:

```
WARNING Unit 12 was drafted without a plan file.
        Drafter ran on inferred context. Voice check may be uneven.
        Fix: backfill the plan via /scr:plan 12, or accept and move on.
```

---

### CHECK 4: STYLE-GUIDE.md vs. last drafter run

Compare the modification timestamp of `STYLE-GUIDE.md` against the modification timestamp of the **newest** `*-DRAFT.md` file in `drafts/body/`.

If STYLE-GUIDE.md is newer than every draft file, voice DNA has changed since the last draft was written. Emit:

```
WARNING STYLE-GUIDE.md was edited at 2026-05-09T14:22:00Z
        Newest draft: 12-B-DRAFT.md at 2026-05-08T11:05:00Z
        Drafts written before the style guide edit may not reflect the current voice.
        Fix: /scr:voice-check N for any unit drafted before 2026-05-09.
```

If the most recent voice-check run is recorded in STATE.md and is older than STYLE-GUIDE.md's edit, also flag.

Use the appropriate stat command for the platform (per `/scr:export` STEP 1.6b conventions):
- macOS: `stat -f %m <file>`
- Linux: `stat -c %Y <file>`
- Windows: `(Get-Item '<file>').LastWriteTimeUtc.Ticks`

---

### CHECK 5: Front-matter scaffolds still pending

Scan `.manuscript/front-matter/*.md`. For each file with `scaffold: true` in its YAML header, emit:

```
INFO   Front matter element "12-preface.md" still has scaffold: true
       It will be excluded from publication exports until you set scaffold: false.
       Edit the file or run /scr:front-matter --element preface to draft it.
```

This is informational, not drift -- the scaffold gate is intentional.

---

### CHECK 6: Stale export outputs

Scan `.manuscript/output/`. For each output file (`manuscript.pdf`, `manuscript.docx`, `manuscript.epub`, `manuscript-print.pdf`, etc.), compare its modification timestamp against the newest source file (any `drafts/body/*-DRAFT.md` or `front-matter/*.md` or `back-matter/*.md`).

If any source is newer than the export, emit:

```
WARNING .manuscript/output/manuscript.epub is older than the newest draft.
        Last exported: 2026-05-07T09:14:00Z
        Newest source: drafts/body/12-B-DRAFT.md at 2026-05-09T16:42:00Z
        Re-export: /scr:export --format epub
```

Group all stale outputs into one finding when the same source is newer than multiple outputs.

---

### CHECK 7: CONTEXT.md staleness

If `.manuscript/CONTEXT.md` exists, compare its mtime against STATE.md and the newest draft. If CONTEXT.md is older than either, emit:

```
WARNING .manuscript/CONTEXT.md is older than the recorded state.
        A fresh session reading CONTEXT.md will get an outdated picture.
        Fix: /scr:resume-work to regenerate it (or /scr:scan --fix).
```

If CONTEXT.md does not exist, emit INFO with a one-line suggestion to run `/scr:resume-work` once to generate it.

---

### CHECK 8: HISTORY.log integrity

If `.manuscript/HISTORY.log` exists, scan the last 50 lines for malformed entries (lines that don't match the pipe-delimited contract from `docs/history-protocol.md`). Report the count of malformed lines as INFO. Do not auto-fix.

If HISTORY.log does not exist, emit INFO that history-tracking is not active.

---

### CHECK 9: Sacred-tradition config vs. shipped templates

If `config.json` has a `tradition:` key set, verify that `templates/sacred/<tradition>/manifest.yaml` exists in the installed Scriveno templates. If not, emit:

```
DRIFT   config.json declares tradition: "{value}"
        But templates/sacred/{value}/manifest.yaml does not exist.
        Sacred-aware commands will fall back to defaults silently.
        Fix: pick a shipped tradition (list via /scr:settings) or add the manifest.
```

---

### CHECK 10: Adapted cast surface vs. drafts

Resolve the adapted cast surface for canonical `CHARACTERS.md` from `file_adaptations`, then parse it for character, concept, audience, or figure names. Grep all draft files for proper-noun strings that look like cast names (capitalized, two or more occurrences) but do not appear in the adapted cast surface. Emit each unknown name as INFO with the first draft file it appears in:

```
INFO   "Marcus" appears in 4 drafts but is not in {adapted cast surface}.
       Either add a character entry via /scr:new-character "Marcus", or this is a one-off mention.
```

This is best-effort. False positives (locations, brands, common nouns capitalized at sentence start) are expected. Group similar findings.

---

### CHECK 11: RECORD.md integrity

If `.manuscript/RECORD.md` does not exist, emit INFO for older projects:

```
INFO   RECORD.md is missing.
       This project can still work, but Scriveno has no compact store for what the work has established.
       Fix: /scr:scan --fix can initialize RECORD.md from the installed template.
```

If RECORD.md exists, check it against drafted content as a compact best-effort audit:

- **Staleness** -- If the newest draft is newer than RECORD.md and no later editor review or save mentions record updates, emit WARNING that RECORD.md may not include the latest established content.
- **Empty store after drafts** -- If draft files exist but RECORD.md still contains only placeholders, emit WARNING.
- **Resolved thread still marked open** -- If a thread is listed as open but review reports or later draft text clearly mark it resolved, emit INFO with a suggested update.
- **Record contradiction** -- If a durable fact in RECORD.md directly contradicts a later draft, emit DRIFT and cite both locations when possible.

Do not over-claim. RECORD.md is an interpretive store, so uncertain findings should be INFO or WARNING unless the contradiction is explicit.

---

### CHECK 12: PROGRESS.md ledger staleness

If `.manuscript/PROGRESS.md` exists, compare its mtime against STATE.md and the newest draft. If PROGRESS.md is older than either, the saved per-unit ledger no longer reflects the work on disk. Emit:

```
WARNING .manuscript/PROGRESS.md is older than the recorded state.
        The saved per-unit ledger may show stale unit status.
        Fix: /scr:save to rebuild it (or /scr:scan --fix).
```

Recompute per-unit status from disk per `docs/progress-protocol.md`. If the bucket counts (done / in progress / untouched) disagree with what PROGRESS.md records, emit a DRIFT finding citing both. If PROGRESS.md does not exist, emit INFO with a one-line suggestion to run `/scr:save` once to generate the openable ledger.

---

### CHECK 13: RELATIONSHIPS.md derived map staleness

If the work type has a cast surface (per `surface_applicability`) and the adapted cast surface for canonical `CHARACTERS.md` defines two or more characters, concepts, or figures, the derived adapted relationship surface for canonical `RELATIONSHIPS.md` should match the relationship sections of that cast surface. Resolve both filenames from `file_adaptations` before checking. Compare the adapted relationship file mtime against the adapted cast file; if older, the saved map may be stale. Emit:

```
WARNING .manuscript/{adapted RELATIONSHIPS.md} is older than {adapted CHARACTERS.md}.
        The saved relationship map may not reflect current cast relationships.
        Fix: /scr:save to rebuild it (or /scr:scan --fix).
```

Re-derive the pairwise map from the adapted cast surface relationship sections per `docs/relationships-protocol.md`. If a pairing in the adapted relationship file contradicts the cast entries, or a pair is missing from the map entirely (not even marked `none`), emit a DRIFT finding citing both. If the work type has cast and at least two entries are defined but the adapted relationship file does not exist, emit INFO suggesting `/scr:save` to generate the openable map. Rebuilding the adapted relationship file is auto-fixable under `--fix`. For work types without a cast surface, skip this check silently.

---

### CHECK 14: CONFLICTS.md derived map staleness

If the work has a narrative conflict (a central conflict in `WORK.md` or two or more cast entries) and the work type is not poetry or speech, the derived `.manuscript/CONFLICTS.md` map should match `WORK.md` and the adapted cast surface for canonical `CHARACTERS.md`. Compare CONFLICTS.md mtime against `WORK.md` and the adapted cast file; if older, the saved map may be stale. Emit a WARNING with the fix `/scr:save` (or `/scr:scan --fix`). Re-derive the map per `docs/conflict-protocol.md`; if a pairing contradicts the source, or a cast pair is missing entirely (not even marked `no conflict`), emit a DRIFT finding. If conflict applies but CONFLICTS.md does not exist, emit INFO suggesting `/scr:save`. Rebuilding it is auto-fixable under `--fix`. Where conflict does not apply, skip silently.

---

### CHECK 15: PLACES.md candidate detection

Generalize the character-name detection in CHECK 10 to places. Parse `PLACES.md` for known place, region, route, landmark, building, and realm names. Also read the adapted world surface for context, but treat `PLACES.md` as the place registry. Grep the drafts for capitalized place-like proper nouns that recur but do not appear in `PLACES.md`. Emit each as INFO with the first draft file it appears in:

```
INFO   "New York City" appears in 3 drafts but is not in PLACES.md.
       Add it with /scr:new-place "New York City", or ignore it as a one-off mention.
       If this is a real place, optional research: /scr:research "New York City" --place
```

Do not auto-append candidates and do not create an inbox. This check is detection-only. Reconcile before suggesting: "the city", "Veridia", and "the capital" may be one place, so avoid reporting three candidates when they clearly point to the same location. This is best-effort; false positives are expected. For work types where WORLD is not_applicable (per `surface_applicability`: poetry, speech), skip this check silently.

---

### CHECK 16: PEOPLE-DYNAMICS.md derived map staleness

If the work type has a peoples surface (per `surface_applicability`) and `.manuscript/PEOPLES.md` defines two or more peoples, the derived `.manuscript/PEOPLE-DYNAMICS.md` map should match the "Relations with other peoples" sections of `PEOPLES.md`. Compare PEOPLE-DYNAMICS.md mtime against PEOPLES.md; if older, the saved map may be stale. Emit a WARNING with the fix `/scr:save` (or `/scr:scan --fix`). Re-derive the map per `docs/people-dynamics-protocol.md`; if a standing contradicts the source, or a people pair is missing entirely (not even marked `no dealings`), emit a DRIFT finding. If peoples apply and two or more exist but PEOPLE-DYNAMICS.md does not exist, emit INFO suggesting `/scr:save`. Rebuilding it is auto-fixable under `--fix`. Where peoples do not apply, skip this check silently.

---

### CHECK 17: character-people membership sync

If the work type has a peoples surface and both `.manuscript/PEOPLES.md` and the adapted cast surface for canonical `CHARACTERS.md` exist (for example `.manuscript/FIGURES.md` in sacred work), the two membership directions should agree: a cast entry whose `Belongs to: X` names a people should appear in people X's `### Members` list, and every name in a people's `### Members` should carry the matching `Belongs to:` in its cast entry. Emit a WARNING for each one-sided link (an entry claims a people that does not list it, or a people lists a member whose entry omits the `Belongs to:`). Under `--fix`, reconcile by adding the missing side after writer confirmation. Where peoples do not apply, or one of the two files is absent, skip this check silently.

---

### CHECK 18: GEOGRAPHY.md derived map staleness

If `.manuscript/PLACES.md` exists and the work type has an adapted world surface (per `surface_applicability`), the derived `.manuscript/GEOGRAPHY.md` map should match `PLACES.md` and the adapted world surface. Compare GEOGRAPHY.md mtime against PLACES.md and the adapted world surface; if older, emit:

```
WARNING .manuscript/GEOGRAPHY.md is older than PLACES.md or the adapted world surface.
        The saved geography map may not reflect current place relationships.
        Fix: /scr:geography-map --fix, /scr:save, or /scr:scan --fix.
```

Re-derive the map per `docs/world-layers-protocol.md`. If a route, parent-child relationship, or distance in GEOGRAPHY.md contradicts PLACES.md, emit a DRIFT finding citing both. If places exist but GEOGRAPHY.md does not, emit INFO suggesting `/scr:geography-map --fix`. Rebuilding GEOGRAPHY.md is auto-fixable under `--fix`. Where the world surface does not apply, or no confirmed places exist, skip silently.

---

### CHECK 19: merge conflict markers

Scan every text file under `.manuscript/` for unresolved merge conflict markers. A line starting with `<<<<<<<`, `=======`, or `>>>>>>>` is a DRIFT finding because it means a failed merge, revert, or manual conflict resolution leaked into project files.

Report each match as:

```
DRIFT   Merge conflict marker in .manuscript/drafts/body/4-choice-DRAFT.md:88
        Downstream commands must not read or save this as manuscript prose.
        Fix: resolve the conflict manually, then run /scr:validate and /scr:scan again.
```

Do not auto-fix conflict markers. They require a writer or developer decision.

---

### --deep MODE

When `--deep` is passed, run read-only audit workers after CHECK 19:

- continuity-auditor: compare drafts, plans, RECORD.md, and reviews for unresolved contradictions
- place-geography-auditor: inspect PLACES.md, GEOGRAPHY.md, drafts, and plans for spatial drift
- relationship-conflict-auditor: inspect adapted cast files, RELATIONSHIPS.md, CONFLICTS.md, and draft interactions for stale dynamics
- research-gap-auditor: inspect plans and drafts for unsupported real-world, technical, academic, sacred, cultural, legal, medical, public-data, or source claims
- voice-risk-auditor: inspect STYLE-GUIDE.md mtime, recent drafts, and voice-check reports for likely voice drift

Deep workers are read-only. They may add WARNING or INFO findings to the scan report, but they must not apply fixes, write files, or accept research or canon. If parallel worker spawning is unavailable, run selected audits sequentially in isolated fresh contexts and report `parallel unavailable; sequential isolated analysis used`.

---

### REPORT

Output a single structured report:

```
Scriveno context scan
====================
Project: [title from config.json]
Scanned: [N] checks across .manuscript/
Findings: [X] drift, [Y] warnings, [Z] info

DRIFT (must resolve before downstream commands can be trusted)
--------------------------------------------------------------
[finding 1 with fix command]
[finding 2 with fix command]
...

WARNINGS (downstream may be using stale input)
-----------------------------------------------
[finding 1]
[finding 2]
...

INFO (notice and move on if desired)
-------------------------------------
[finding 1]
[finding 2]
...
```

If there are zero findings AND `--quiet` was not passed, end with:

> All checks passed. Recorded state matches disk reality.

If `--quiet` was passed and there are zero findings, exit silently with no output.

---

### --fix MODE

When `--fix` is passed, after the report, group findings by auto-fixability:

- **Auto-fixable now** -- finding has a deterministic fix Scriveno can apply (e.g. update STATE.md unit counts to match disk, initialize missing RECORD.md from the installed template, regenerate stale CONTEXT.md, regenerate stale or missing PROGRESS.md from disk per `docs/progress-protocol.md`, sort orphan drafts into a `_unsorted/` review directory). For each, ask the writer once:
  > Apply [N] auto-fixes? (yes / no / show me what each does)
- **Requires writer decision** -- finding needs a judgment call (e.g. character orphans, scaffold pending, voice drift). List with suggested next command.
- **Manual** -- finding requires manual cleanup (e.g. malformed HISTORY.log lines).

If the writer accepts auto-fixes, apply them in one batch and re-emit the affected findings as RESOLVED.

After any auto-fix, append a single line to HISTORY.log per `docs/history-protocol.md`:

```
[ISO timestamp] | scr:scan --fix | files=STATE.md,CONTEXT.md | outcome=fixed-N
```

---

## Automation Status

Every response must include a compact status block:

```text
Automation status:
Trigger: /scr:scan {flags}
Spawned agents:
- none unless --deep is passed
- deep auditors: {count when --deep, otherwise none}
Candidate agents:
- /scr:scan --deep: continuity-auditor, place-geography-auditor, relationship-conflict-auditor, research-gap-auditor, voice-risk-auditor
Local operations:
- drift checks run: {count}
- auto-fixes applied: {count}
- HISTORY.log appended: yes/no
Candidate local helpers:
- /scr:save if scan repairs changed state
Manual gates:
- fixes that require writer confirmation
Auto-invoked:
- none
Why: default scan compares disk state locally; --deep adds read-only auditors; fixes require writer confirmation
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

This command is the trust layer. Be precise, blunt, and actionable. Do not soften DRIFT findings into "you might want to consider" -- a drift finding means downstream commands cannot be trusted until resolved. Say so. WARNINGS should still be specific enough that the writer knows whether to act.

A scan with zero drift findings is not noise. It is the writer earning the right to trust `/scr:next`, `/scr:export`, and `/scr:publish` for the rest of the session.
