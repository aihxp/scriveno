# HISTORY.log Protocol

`.manuscript/HISTORY.log` is the project's append-only chronological record of Scriveno commands that mutate state. It is the third leg of the context-integrity stool, alongside `STATE.md` (structured snapshot) and `.manuscript/CONTEXT.md` (one-page bootstrap). Where STATE.md records *what is true now* and CONTEXT.md narrates *where you are*, HISTORY.log records *how you got here, in order*.

This document is the single source of truth for the line format. Every command that appends to HISTORY.log must follow this contract.

---

## Where it lives

- Path: `.manuscript/HISTORY.log`
- Committed to git (cross-session recovery is the whole point; do not gitignore)
- Append-only. Commands never rewrite, truncate, or rotate the file. If size becomes a real problem (>10MB) the writer can manually archive it via `mv .manuscript/HISTORY.log .manuscript/HISTORY-{date}.log` and start a fresh file. Scriveno does not auto-rotate.

## Line format

One line per command invocation. UTF-8 text. No trailing whitespace. LF line endings. Pipe-delimited fields, with a single space on each side of every `|` for readability:

```
{ISO_TIMESTAMP} | {COMMAND} | {KEY=VALUE pairs, separated by " | "} | outcome={outcome}
```

### Fields

| Field | Required | Format | Notes |
|-------|----------|--------|-------|
| `ISO_TIMESTAMP` | yes | `2026-05-10T17:14:33Z` (UTC, second precision) | Use UTC always. Local time loses meaning across collaborators. |
| `COMMAND` | yes | `scr:save`, `scr:draft`, `scr:export`, etc. | Always prefix with `scr:`. Use the canonical slash-command name without the leading `/`. |
| Key=value pairs | optional | `unit=12`, `level=balanced`, `format=epub`, `files=12-A-DRAFT.md,12-B-DRAFT.md` | Use lowercase keys. Multiple files comma-separated, no spaces. Quote values containing spaces with double quotes. |
| `outcome` | yes | `outcome=ok`, `outcome=committed`, `outcome=skipped`, `outcome=failed:<reason>` | Last field on the line. The `outcome=` prefix lets `/scr:scan` parse a tail-of-log status quickly. |

### Examples

```
2026-05-10T17:14:33Z | scr:save | message="Saved after drafting Chapter 12" | files=3 | outcome=committed
2026-05-10T17:18:02Z | scr:draft | unit=13 | files=13-A-DRAFT.md,13-B-DRAFT.md | outcome=ok
2026-05-10T17:22:45Z | scr:plan | unit=14 | outcome=ok
2026-05-10T17:30:11Z | scr:export | format=epub | level=- | outcome=ok
2026-05-10T17:32:08Z | scr:publish | preset=ebook-wide | front-level=balanced | back-level=balanced | outcome=ok
2026-05-10T17:35:54Z | scr:front-matter | level=balanced | elements=4 | outcome=ok
2026-05-10T17:40:02Z | scr:scan --fix | files=STATE.md,CONTEXT.md | outcome=fixed-2
2026-05-10T17:45:16Z | scr:export | format=pdf | outcome=failed:typst-not-installed
```

## Which commands append

These commands **must** append a line on every invocation that mutates state:

- `/scr:save`
- `/scr:draft`
- `/scr:plan`
- `/scr:export`
- `/scr:publish`
- `/scr:front-matter`
- `/scr:back-matter`
- `/scr:pause-work`
- `/scr:resume-work`
- `/scr:scan --fix`

Other state-mutating commands **may** append a line; this list is the minimum. Read-only commands (`/scr:progress`, `/scr:history`, `/scr:next` when it does not invoke another command) do not append. When `/scr:next` routes to a state-mutating command, the routed command is responsible for the entry, not `/scr:next` itself.

## How to append

```bash
echo "{ISO_TIMESTAMP} | {COMMAND} | {fields} | outcome={outcome}" >> .manuscript/HISTORY.log
```

Generate the timestamp with one of:

```bash
date -u +%Y-%m-%dT%H:%M:%SZ
```

Create the file if it does not exist:

```bash
touch .manuscript/HISTORY.log
```

If the command being recorded is itself a `/scr:save`, the append must happen **before** `git add`. The line is part of the same commit.

## Reading HISTORY.log

`/scr:scan` parses the last 50 lines on every run to detect malformed entries.

`.manuscript/CONTEXT.md` shows the last 5 entries as the "Recent activity" table. The CONTEXT.md regenerator (in `/scr:save`, `/scr:pause-work`, `/scr:resume-work`) reads HISTORY.log directly for that table.

`/scr:history` continues to show git-save history (writer-friendly version log). It does not read HISTORY.log -- the two surfaces are intentionally separate. Writers see saves; HISTORY.log is the AI-readable audit trail.

## Why pipe-delimited and not JSON Lines

JSON is more rigorously parseable but harder to scan visually. Pipe-delimited with a fixed prefix (`{timestamp} | scr:{command}`) is grepable at a glance, lets a writer open the file in any text editor and orient instantly, and stays readable in a `tail -f` window during long sessions. The format is regular enough that any future tooling can parse it with one regex.

## Why append-only and not a database

Scriveno's architecture rule is no compiled code, no runtime dependencies. A flat append-only log preserves that. Writers can `cat`, `grep`, and `tail` it. Git already provides durable storage, blame, and rewind. There is no parallel infrastructure to maintain.
