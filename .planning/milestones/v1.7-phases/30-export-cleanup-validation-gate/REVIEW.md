---
phase: 30-export-cleanup-validation-gate
reviewed: 2026-04-17T00:00:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - commands/scr/cleanup.md
  - commands/scr/validate.md
  - commands/scr/export.md
  - commands/scr/publish.md
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: issues_found
---

# Phase 30: Code Review Report

**Reviewed:** 2026-04-17
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

Phase 30 delivers two new commands (`cleanup.md`, `validate.md`) and surgical gate injections into `export.md` and `publish.md`. All 15 regression tests pass green and the full 1153-test suite is clean. Structural invariants (YAML frontmatter, `description:` field, H1 heading, Usage section) are correctly satisfied for both new files.

The implementation is largely correct. Two concerns need attention before the phase is considered final. The most significant is a logic defect in `cleanup.md`'s Alternate block boundary definition that deviates from the canonical specification: it would silently consume legitimate prose content that follows an Alternate block when no second Alternate block is present. The second concern is that both gate blocks in `export.md` and `publish.md` are missing the `{{VAR}}` exclusion note present in the standalone commands, creating an inconsistency an agent could exploit in the wrong direction.

---

## Warnings

### WR-01: Alternate block boundary in cleanup.md deviates from spec — risks eating legitimate prose

**File:** `commands/scr/cleanup.md:47-50`

**Issue:** The shipped boundary definition for Alternate blocks reads:

> (a) the next blank line that precedes another `Alternate M:` header, or
> (b) a line starting with `## ` or `# ` (section heading boundary), or
> (c) end of file

Condition (a) says a blank line only stops the Alternate block if it is immediately followed by another `Alternate M:` header. A blank line followed by regular prose (the common case: Alternate block ends, story continues) does NOT satisfy condition (a). Without a matching `## `/`# ` heading boundary, the block extends all the way to the next heading or end of file, consuming all prose between the Alternate block and the next section heading.

The canonical specification in both the Plan 02 interfaces comment (line 95) and RESEARCH.md line 323 is unambiguous:

> "from the `Alternate N:` line through the next blank line OR next `Alternate M:` line OR next `## `/`# ` heading, whichever comes first"

The shipped command matches a secondary "Recommendation" note in RESEARCH.md (line 446) that was written as a heuristic suggestion, not as a locked decision. The locked decision (from RESEARCH.md and Plan 02 interface comment) makes ANY blank line a valid stopping condition.

**Practical impact:** If a draft file contains `Alternate 1:` / `Alternate 2:` blocks followed by a blank line and then regular prose (not a heading), running `/scr:cleanup --apply` will remove the Alternate blocks AND the prose up to the next `#` heading. The dry-run mode would expose the problem before apply, but only if the writer reads the full output carefully.

**Fix:**

Replace lines 47-50 of `commands/scr/cleanup.md`:

```markdown
- Record the full block extent: from the `Alternate N:` line through the first of:
  - (a) the next blank line (standalone blank line — regardless of what follows), or
  - (b) the next line containing `Alternate M:` (another Alternate header), or
  - (c) a line starting with `## ` or `# ` (section heading boundary), or
  - (d) end of file
```

This matches the primary spec and aligns with the documented Pitfall 3 mitigation in RESEARCH.md.

---

### WR-02: Export and publish gate blocks missing `{{VAR}}` exclusion note — inconsistency with standalone commands

**File:** `commands/scr/export.md:88-114` and `commands/scr/publish.md:36-64`

**Issue:** The gate blocks injected into `export.md` and `publish.md` scan for four marker classes but do not include the `{{VAR}}` exclusion note that both `cleanup.md` (line 57) and `validate.md` (line 50) explicitly state:

> `{{VAR}}` tokens are NOT scaffold markers. Do not flag them.

The gate scan instruction lists what to look for but gives no guidance about what NOT to flag. An agent reading only the gate block — without prior context from the standalone commands — has no explicit instruction to ignore `{{VAR}}` tokens. If the agent applies a broad "scaffold marker" mental model, it could flag `{{VAR}}` tokens in the gate context and block export unnecessarily.

The risk is low because agents reading the full command context will encounter the scan list and may not pattern-match `{{VAR}}` on their own. But the standalone commands treat this as important enough to call out with an `**IMPORTANT:**` banner, and the gates should be consistent.

**Fix:**

Add the following line immediately after the scan list in both gate blocks (after the "Files with more than one `# ` (top-level H1) heading" bullet):

In `commands/scr/export.md` after line 94:
```markdown
**Note:** `{{VAR}}` tokens are NOT scaffold markers and must not be flagged. They are writer content placeholders, out of scope for this gate.
```

Apply the same addition at the equivalent location in `commands/scr/publish.md` (after line 44).

---

## Info

### IN-01: `--skip-validate` flag undocumented in Usage sections of export.md and publish.md

**File:** `commands/scr/export.md:10-44` and `commands/scr/publish.md:10-19`

**Issue:** The `--skip-validate` escape hatch is introduced in STEP 1.5 of both commands but does not appear in either command's Usage section or Flags list. Writers who haven't read the full instruction text have no discoverability path for the flag. The argument-hint fields (`"--format <format> [--formatted] [--print-ready]"` and `"[--preset <preset>] [--all]"`) also don't mention it.

This is consistent with how Scriveno commands generally handle instruction-level flags, and it doesn't break any functionality. However, when the gate blocks export, the writer is presented with a stop message that mentions no bypass option — the only way to discover `--skip-validate` is to re-read the command documentation or use `/scr:validate` first.

**Fix (optional):** Add `--skip-validate` to the Flags section of each command's Usage block:

In `export.md` — add to the flags area after the format/option flags:
```markdown
- `--skip-validate` -- Skip the scaffold validation gate. Emits a visible warning. Use only if you are certain the manuscript is ready.
```

Apply the same in `publish.md`.

---

### IN-02: Duplicate H1 reporting format under-specified in validate.md and gate blocks

**File:** `commands/scr/validate.md:47-55` and `commands/scr/export.md:94`, `commands/scr/publish.md:44`

**Issue:** The duplicate H1 detection condition is file-level ("Files with more than one line matching `^# `") but the reporting format is line-level (`path/to/file.md:LINE_NUMBER: marker text`). The instructions tell the agent to record each match as `file:LINE_NUMBER:` but give no guidance on what to report for a duplicate H1 finding: the line number of each duplicate heading? the line number of the second occurrence only? a single entry per file?

The `cleanup.md` is more explicit (lines 53-55: "All subsequent `# ` heading lines are duplicates and are flagged for removal") which implies per-duplicate-line reporting. The validate commands and gate blocks don't carry this guidance.

The FAIL output example in `validate.md` (lines 73-75) shows only bracket and Alternate block entries — no duplicate H1 example is shown, so the format remains undemonstrated.

**Fix (optional):** Add a note to `validate.md` STEP 2 below the "Duplicate H1 headings" bullet:

```markdown
For duplicate H1 headings, report each duplicate `# ` line (second occurrence and beyond) as a separate entry with its line number and the heading text as the marker text.
```

Apply the same clarification to the gate blocks' detection lists in `export.md` and `publish.md`.

---

### IN-03: Dry-run output example in cleanup.md does not demonstrate a duplicate H1 entry

**File:** `commands/scr/cleanup.md:79-87`

**Issue:** The dry-run output example shows bracket markers and an Alternate block entry but not a duplicate H1 entry (the count is shown as 0 in the Summary line). A writer or agent reading the format spec has no concrete example of how a duplicate H1 would appear in the per-file listing (e.g., `line 89: # Chapter One (duplicate heading)`).

This is a documentation completeness gap, not a functional defect. The summary correctly includes a count field for duplicate H1 headings ("`0 duplicate H1 headings`"), so the format is mechanically correct. But the per-file listing format for a duplicate H1 hit is undefined in the example.

**Fix (optional):** Update the dry-run output example to include a duplicate H1 line. For instance:

```
Would remove from chapter-02.md:
  - line 3: [Fill in or delete:]
  - line 47: Alternate 1: block (lines 47-52)
  - line 89: # Chapter Two (duplicate H1 heading)

Summary: 1 bracket marker, 1 Alternate block, 1 duplicate H1 heading across 1 file(s).
Run `/scr:cleanup --apply` to apply these changes.
```

---

_Reviewed: 2026-04-17_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
