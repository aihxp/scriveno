---
description: Scan the project for context drift between recorded state and what is actually on disk.
argument-hint: "[--fix] [--quiet]"
---

# /scr:scan -- Context Drift Scanner

You are the project's drift detector. Trust nothing. Compare what `.manuscript/STATE.md`, `OUTLINE.md`, `config.json`, and the various structural files **claim** against what the filesystem actually contains, and report every mismatch.

This is the defense against context corruption. A fresh Claude session, a writer who hand-edited files between sessions, an interrupted command, or a partial revert can all leave the project in an internally inconsistent state. STATE.md says 12 units drafted; the disk has 14. OUTLINE.md lists "Chapter 8" but no draft file exists. STYLE-GUIDE.md was edited yesterday but no voice-check has run since. `/scr:scan` finds those.

This complements `/scr:health` (which fixes structural issues like missing directories) and `/scr:resume-work` (which reads recorded state). `/scr:scan` interrogates whether the recorded state is true.

## Usage

```
/scr:scan              # report-only
/scr:scan --fix        # offer to fix the auto-fixable mismatches
/scr:scan --quiet      # only show drift; suppress the all-clear summary
```

## Instruction

Load `.manuscript/config.json`, `.manuscript/STATE.md`, and `.manuscript/OUTLINE.md`. Each check below produces a finding with one of three severities:

- **DRIFT** -- recorded state contradicts disk reality. Trust nothing downstream until resolved.
- **WARNING** -- an artifact is stale or out of date. Downstream work may be silently using outdated input.
- **INFO** -- worth noticing but not actionable.

Run every check. Do not stop on first finding. Bundle them all into one report.

---

### CHECK 1: STATE.md unit counts vs. filesystem

Read `STATE.md` for `Units drafted`, `Units planned`, `Units reviewed`, and `Total words`. Then count what is actually on disk:

- **Units drafted** = files matching `.manuscript/drafts/body/*-DRAFT.md`
- **Units planned** = files matching `.manuscript/*-*-PLAN.md` (numeric-prefixed plan files)
- **Units reviewed** = files matching `.manuscript/*-EDITOR-NOTES.md`
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

For each `*-PLAN.md` file in `.manuscript/`, check whether the corresponding `*-DRAFT.md` exists in `drafts/body/`. If a plan exists but no draft:

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

If `config.json` has a `tradition:` key set, verify that `templates/sacred/<tradition>/manifest.yaml` exists in the installed Scriven templates. If not, emit:

```
DRIFT   config.json declares tradition: "{value}"
        But templates/sacred/{value}/manifest.yaml does not exist.
        Sacred-aware commands will fall back to defaults silently.
        Fix: pick a shipped tradition (list via /scr:settings) or add the manifest.
```

---

### CHECK 10: CHARACTERS.md vs. drafts

Parse `.manuscript/CHARACTERS.md` (or FIGURES.md for sacred works) for character/figure names. Grep all draft files for proper-noun strings that look like character names (capitalized, two or more occurrences) but do not appear in CHARACTERS.md. Emit each unknown name as INFO with the first draft file it appears in:

```
INFO   "Marcus" appears in 4 drafts but is not in CHARACTERS.md.
       Either add a character entry via /scr:new-character "Marcus", or this is a one-off mention.
```

This is best-effort. False positives (locations, brands, common nouns capitalized at sentence start) are expected. Group similar findings.

---

### REPORT

Output a single structured report:

```
Scriven context scan
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

- **Auto-fixable now** -- finding has a deterministic fix Scriven can apply (e.g. update STATE.md unit counts to match disk, regenerate stale CONTEXT.md, sort orphan drafts into a `_unsorted/` review directory). For each, ask the writer once:
  > Apply [N] auto-fixes? (yes / no / show me what each does)
- **Requires writer decision** -- finding needs a judgment call (e.g. character orphans, scaffold pending, voice drift). List with suggested next command.
- **Manual** -- finding requires manual cleanup (e.g. malformed HISTORY.log lines).

If the writer accepts auto-fixes, apply them in one batch and re-emit the affected findings as RESOLVED.

After any auto-fix, append a single line to HISTORY.log per `docs/history-protocol.md`:

```
[ISO timestamp] | scr:scan --fix | files=STATE.md,CONTEXT.md | outcome=fixed-N
```

---

## Tone

This command is the trust layer. Be precise, blunt, and actionable. Do not soften DRIFT findings into "you might want to consider" -- a drift finding means downstream commands cannot be trusted until resolved. Say so. WARNINGS should still be specific enough that the writer knows whether to act.

A scan with zero drift findings is not noise. It is the writer earning the right to trust `/scr:next`, `/scr:export`, and `/scr:publish` for the rest of the session.
