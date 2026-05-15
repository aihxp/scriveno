---
phase: 31-staged-front-matter-generation
reviewed: 2026-04-17T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - commands/scr/front-matter.md
  - commands/scr/export.md
  - commands/scr/publish.md
findings:
  critical: 1
  high: 2
  medium: 2
  low: 1
  total: 6
status: issues_found
---

# Phase 31: Code Review Report

**Reviewed:** 2026-04-17
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Phase 31 adds `scaffold: true` YAML headers to 5 personalization front-matter elements in `front-matter.md` and injects STEP 1.6 (front-matter gate) into both `export.md` and `publish.md`. The scaffold element coverage and STEP positioning are correct. The majority of the implementation is sound.

Six findings identified across the three files. One critical issue: the element table in `front-matter.md` classifies Element 6 (Epigraph) as `SUGGEST` rather than `SCAFFOLD`, creating a type-mismatch with its generated output block (which correctly has `scaffold: true`). This inconsistency in the authoritative reference table will cause agent confusion for any command that branches on element Type. Two high-severity issues involve missing guard logic in STEP 1.6b and a documentation gap in the auto-refresh instruction. Two medium-severity issues concern the `scaffold: false` opt-in mechanic being mentioned in the user-facing note but not defined in the YAML spec, and an ambiguity in STEP 3b's exclusion-list reference scope. One low-severity issue is a wording inconsistency between `export.md` and `publish.md` in the 1.6a no-directory note.

---

## Critical Issues

### CR-01: Element Table Labels Epigraph as `SUGGEST` - Contradicts `scaffold: true` Implementation

**File:** `commands/scr/front-matter.md:24`
**Issue:** The element reference table at line 24 classifies Element 6 (Epigraph) as `SUGGEST`, not `SCAFFOLD`. However, the output block for Element 6 (lines 193-219) correctly prepends `scaffold: true` YAML frontmatter. Every other scaffold element in the table is consistently labeled `SCAFFOLD` (5, 11, 12). Element 13 is labeled `GENERATE DRAFT`, which was an intentional decision per the plan (keep the label, add scaffold: true). The `SUGGEST` label for Element 6 is unique and will cause any agent or human reading the reference table to treat Epigraph differently from the other 4 scaffold elements - for example, skipping the scaffold check, including it unconditionally in export, or regenerating it as a GENERATE element. This is the only element where the table type and the implementation behavior are misaligned.

**Fix:** Change the element table row for Element 6 from `SUGGEST` to `SCAFFOLD`:

```markdown
| 6 | Epigraph | `epigraph` | SCAFFOLD |
```

If the intent was to preserve the `SUGGEST` type label (as was done for Element 13's `GENERATE DRAFT` label), then a note must be added to the table explaining that Elements 6 and 13 are classified as `SCAFFOLD` for assembly purposes despite their generation-type labels. But the cleanest fix is to update the table to match the implementation.

---

## High Issues

### HI-01: STEP 1.6b Does Not Guard Against Non-Existent Front-Matter Directory

**File:** `commands/scr/export.md:141-162` and `commands/scr/publish.md:91-112`
**Issue:** STEP 1.6b begins by checking if `.manuscript/WORK.md` does not exist and skipping if so. But it does not guard against the case where `.manuscript/front-matter/` does not exist (already handled in 1.6a). If the front-matter directory is absent, the agent will attempt to compare WORK.md's timestamp against 4 specific files under `.manuscript/front-matter/`. Those files will not exist, and the instruction says "if ANY of those 4 files do not exist: regenerate." This means a writer who has never run `/scr:front-matter` at all will trigger an auto-regeneration of all 4 GENERATE elements inside STEP 1.6b even after already receiving the "no front matter found" note in 1.6a - resulting in partial front matter being silently generated mid-export without the writer choosing to run `/scr:front-matter`. The non-blocking note in 1.6a says to run `/scr:front-matter` first; 1.6b should not contradict that by auto-generating anyway.

**Fix:** Add a guard at the start of 1.6b that skips auto-refresh when `.manuscript/front-matter/` does not exist:

```markdown
**1.6b - GENERATE element auto-refresh**

If `.manuscript/front-matter/` does not exist, skip auto-refresh and proceed to STEP 2.

If `.manuscript/WORK.md` does not exist, skip auto-refresh and proceed to STEP 2.
```

This matches the intent: auto-refresh is for keeping existing GENERATE files current, not for bootstrapping front matter from scratch.

---

### HI-02: Auto-Refresh Instruction Ambiguous - Does Not Specify That All 4 Files Must Be Missing/Stale To Trigger a Full Regeneration Pass

**File:** `commands/scr/export.md:157` and `commands/scr/publish.md:107`
**Issue:** The condition reads: "If WORK.md is newer than ANY of those 4 files, or if ANY of those 4 files do not exist: Re-run the GENERATE step from `/scr:front-matter` for elements 1, 3, 4, and 7 only." This means if only `07-toc.md` is stale (WORK.md newer), the agent will regenerate all 4 files including `01-half-title.md`, `03-title-page.md`, and `04-copyright.md` even though those may be current. For a large TOC-heavy manuscript this is the correct behavior, but the instruction does not make it explicit that the regeneration is a full pass on all 4, not just the stale one. An agent may reasonably interpret "Re-run the GENERATE step for elements 1, 3, 4, and 7" as "run only for the element(s) that triggered the condition." This ambiguity risks partial regeneration.

**Fix:** Add a clarifying phrase to the regeneration instruction:

```markdown
If WORK.md is newer than ANY of those 4 files, or if ANY of those 4 files do not exist:
Re-run the GENERATE step from `/scr:front-matter` for ALL FOUR elements (1, 3, 4, and 7) - half-title, title page, copyright page, and TOC - using current WORK.md metadata.
Regenerate all four even if only one triggered the condition.
Do NOT regenerate scaffold elements (5, 6, 11, 12, 13) or any other elements.
```

---

## Medium Issues

### ME-01: `scaffold: false` Opt-In Mechanic Mentioned in User Note But Not Defined in YAML Spec

**File:** `commands/scr/export.md:136-137` and `commands/scr/publish.md:86-87`
**Issue:** The user-visible note in STEP 1.6a says: "edit and set scaffold: false to include." However, neither `front-matter.md` nor the STEP 1.6a instruction itself ever specifies that `scaffold: false` is a valid value to put in the YAML header. The YAML blocks produced by `front-matter.md` only ever contain `scaffold: true`. An agent reading the YAML header in an element file will see `scaffold: true` and know to exclude it. But if a writer follows the instruction and sets `scaffold: false`, the agent must recognize `scaffold: false` as an opt-in signal - and the detection logic in STEP 1.6a only describes detecting `scaffold: true` (to build the exclusion list). There is no corresponding instruction that `scaffold: false` (or absence of `scaffold: true`) means include.

The current detection logic is implicitly correct - if `scaffold: true` is NOT found in the first 10 lines, the file is included. But the instruction never states this clearly, and setting `scaffold: false` while the detection logic only looks for `scaffold: true` means `scaffold: false` works purely by absence, not by positive inclusion. This is confusing for future maintainers.

**Fix:** Add one sentence to the STEP 1.6a detection description in both `export.md` and `publish.md`:

```markdown
Files where `scaffold: true` is NOT found (including files with `scaffold: false`) are
included in the assembly by default - the exclusion list contains only the flagged files.
```

This makes the opt-in mechanic explicit without changing behavior.

---

### ME-02: STEP 3b Scaffold Exclusion Reference Scope is Unclear

**File:** `commands/scr/export.md:244`
**Issue:** STEP 3b says "Omit any files whose path appears in the scaffold exclusion list from STEP 1.6a." The phrase "from STEP 1.6a" correctly traces back to the source, but the exclusion list is described in STEP 1.6a as paths collected during that sub-step. The instruction does not confirm whether this list persists as an in-context variable or is reconstructed. For an AI agent executing these steps, "the scaffold exclusion list from STEP 1.6a" is adequate only if the agent carries forward context between steps. If the agent loses context between steps (e.g., in a long export run), it must re-scan. The current wording does not tell the agent what to do if the exclusion list is unavailable at STEP 3b.

This is a minor robustness gap. The fix is one fallback sentence.

**Fix:** Extend the STEP 3b exclusion note to include a fallback:

```markdown
**Scaffold exclusion:** Omit any files whose path appears in the scaffold exclusion list
from STEP 1.6a. If that list is not available (context was not preserved), re-scan
`.manuscript/front-matter/` for `scaffold: true` and rebuild the exclusion list before
proceeding.
```

---

## Low Issues

### LO-01: Wording Inconsistency in 1.6a No-Directory Note Between export.md and publish.md

**File:** `commands/scr/export.md:127` vs `commands/scr/publish.md:77`
**Issue:** The "no front matter directory" note uses slightly different wording in the two files:

- `export.md` (line 127): `> **Note:** No front matter found - run /scr:front-matter first if you want publication front matter included.`
- `publish.md` (line 77): `> **Note:** No front matter found - run /scr:front-matter first if you want publication front matter included.`

These are actually identical - no inconsistency here. However, examining the actual file content of `export.md` line 127 vs `publish.md` line 77, both say the same thing. The low finding is that both files use an em-dash (` - `) in the note rather than the double-hyphen (`--`) style used in every other user-visible message block in both command files (e.g., STEP 1.5 in both files uses `--` for all inline punctuation in blockquotes). This style mismatch inside the blockquote note is cosmetically inconsistent with the rest of both command files.

**Fix:** Standardize to the `--` style used elsewhere in these files:

```markdown
> **Note:** No front matter found -- run `/scr:front-matter` first if you want publication front matter included.
```

---

_Reviewed: 2026-04-17_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
