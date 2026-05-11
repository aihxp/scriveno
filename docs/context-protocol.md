# Context preference protocol

This is the canonical context-cost contract for Scriven commands. The goal is to stop every session-aware command from independently re-loading STATE.md, OUTLINE.md, config.json, and other orientation files when the auto-regenerated `.manuscript/CONTEXT.md` already summarizes them.

It is the third piece of the trust trio:
- `STATE.md` -- structured snapshot (data)
- `.manuscript/CONTEXT.md` -- one-page narrative bootstrap (synthesis)
- `.manuscript/HISTORY.log` -- append-only audit trail

## The rule

Before loading STATE.md, OUTLINE.md, or config.json individually, any command whose first action is "load orientation files" MUST do this check:

```
1. Read .manuscript/CONTEXT.md if it exists.
2. Compare its `Updated` timestamp to .manuscript/STATE.md and to the
   newest file in .manuscript/drafts/body/ (if drafts exist).
3. If CONTEXT.md is fresher than both, USE IT for orientation. Skip
   the raw-file loads unless you need a specific field CONTEXT.md
   does not contain.
4. If CONTEXT.md is missing, older than STATE.md, or older than the
   newest draft, treat STATE.md as authoritative and continue with
   the original load instructions. Suggest /scr:save (which
   regenerates CONTEXT.md) at the end of the response.
```

Drafter commands and any command whose job is to *write* a draft, plan, or analysis do not skip raw-file loads -- they need the full source. The protocol applies to **orientation-only** reads at the start of session-aware commands.

## Which fields CONTEXT.md provides

CONTEXT.md (template at `templates/CONTEXT.md`) holds:

- Project title and work type (substitute for `config.json` lookups)
- Phase and active unit (substitute for STATE.md `Current phase` / `Current unit`)
- Last 5 actions (substitute for STATE.md `Last actions` table)
- Open items: drafted-but-not-reviewed, planned-but-not-drafted, voice warnings, continuity flags, scaffold markers (substitute for STATE.md `Pending`)
- Suggested next step (substitute for `/scr:next` re-derivation)
- Last `/scr:scan` verdict

If a command needs something CONTEXT.md does NOT have (e.g. specific draft content, individual unit metadata, the full OUTLINE.md ordering), load only that specific file. CONTEXT.md replaces the orientation read, not every read.

## How to apply

Add this block at the top of `## What to do` (or equivalent), before the existing load instructions. Adapt prose lightly per command but keep the rule machine-readable:

```markdown
### STEP 0: BOOTSTRAP (context-cost protocol)

Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp
is newer than STATE.md and newer than the newest file in
`.manuscript/drafts/body/`, treat it as your orientation source for the
fields below (project title, work type, phase, current unit, last actions,
open items, suggested next step). Skip the corresponding raw-file loads in
STEP 1 unless you need a field CONTEXT.md does not surface.

If CONTEXT.md is missing, stale, or contradicts STATE.md, fall back to the
original loads. Note in your final response that CONTEXT.md should be
regenerated on the next /scr:save.

See `docs/context-protocol.md` for the full contract.
```

## Why pipe-delimited freshness, not file size

Filesystem mtime is a cheap, durable signal that does not require parsing the file. Comparing one timestamp against two others (STATE.md, newest draft) is two `stat` calls. The alternative -- parsing CONTEXT.md to check internal coherence -- costs more tokens than just loading STATE.md, defeating the purpose.

## When the protocol does not apply

- **Drafter agents** (drafter.md, voice-checker.md, etc.) -- they need the full source files for fidelity.
- **Read-only data display commands** (`/scr:progress`, `/scr:session-report`) -- already cheap; no orientation files to skip.
- **First-write commands** (`/scr:new-work`, `/scr:import`) -- no CONTEXT.md exists yet.
- **The CONTEXT.md regenerators themselves** (`/scr:save`, `/scr:pause-work`, `/scr:resume-work`) -- they MUST load the raw files to rebuild CONTEXT.md correctly. They are the *writers* of CONTEXT.md, not consumers.
- **`/scr:scan`** -- its job is to detect drift, so it must read the raw files to compare against CONTEXT.md.

## Expected savings

For a typical session-aware command (`/scr:next`, `/scr:plan`, `/scr:export`, `/scr:publish`, etc.) that previously loaded STATE.md (~50 lines), config.json (~30 lines), OUTLINE.md (~100-300 lines), and a CONSTRAINTS.json adaptation slice, the bootstrap step replaces ~200-500 lines of raw orientation reads with one ~30-line CONTEXT.md read. Savings compound across chained commands (autopilot, publish presets).

The protocol is a hint, not a hard gate. A command that misses an edge case can still load raw files explicitly. The cost is paid; correctness is preserved.
