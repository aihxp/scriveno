# Phase 30: Export Cleanup & Validation Gate - Pattern Map

**Mapped:** 2026-04-17
**Files analyzed:** 4 (2 new, 2 modified)
**Analogs found:** 4 / 4

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `commands/scr/cleanup.md` | command (scan-and-modify) | file-I/O + transform | `commands/scr/manuscript-stats.md` + `commands/scr/health.md` | role-match (dry-run+repair pattern) |
| `commands/scr/validate.md` | command (scan-and-report) | file-I/O + request-response | `commands/scr/voice-check.md` + `commands/scr/continuity-check.md` | role-match (scan + pass/fail output) |
| `commands/scr/export.md` | command (pipeline) | request-response | itself (injection into existing STEP sequence) | exact (surgical edit) |
| `commands/scr/publish.md` | command (wizard/pipeline) | request-response | itself (injection into STEP 1) | exact (surgical edit) |

---

## Pattern Assignments

### `commands/scr/cleanup.md` (command, file-I/O + transform)

**Analogs:** `commands/scr/manuscript-stats.md` (scan loop + summary output), `commands/scr/health.md` (dry-run default + `--repair` opt-in apply)

**Imports pattern - frontmatter block** (copy from `commands/scr/health.md` lines 1-3):
```markdown
---
description: Diagnose and repair common project state issues.
argument-hint: "[--repair]"
---
```

Adapt to:
```markdown
---
description: Strip template scaffold markers from draft files. Dry-run by default.
argument-hint: "[--apply]"
---
```

**H1 heading pattern** (copy from `commands/scr/manuscript-stats.md` line 8):
```markdown
# /scr:manuscript-stats - Manuscript Statistics
```

Adapt to `# /scr:cleanup -- Scaffold Cleanup` (note: newer commands use ` -- ` with double-dash; match the export.md convention for consistency within this phase).

**Usage + Flags block pattern** (copy from `commands/scr/manuscript-stats.md` lines 11-17):
```markdown
## Usage
```
/scr:manuscript-stats [--detail]
```

**Flags:**
- `--detail` - Show per-unit breakdown (word count and page estimate per chapter/scene)
```

Adapt flags to:
```markdown
**Flags:**
- `--apply` - Modify files in place and show diff summary. Default: dry-run only.
```

**STEP 1: LOAD CONTEXT pattern** (copy from `commands/scr/manuscript-stats.md` lines 23-28):
```markdown
### STEP 1: LOAD CONTEXT

1. Read `.manuscript/config.json` to get:
   - `title` - the manuscript title
   - `author` - the author name
   - `work_type` - the work type (novel, memoir, screenplay, etc.)
2. Read Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) to get the structural hierarchy names for this work type (e.g., "chapter", "scene").
```

Adapt: cleanup only needs `config.json` + `CONSTRAINTS.json` for context; no `OUTLINE.md` needed.

**Scan loop pattern** (copy from `commands/scr/manuscript-stats.md` lines 34-40):
```markdown
### STEP 2: COUNT WORDS

1. **Body text:** Read all files in `.manuscript/drafts/body/` recursively.
   - For each file, count words by splitting on whitespace.
   - Exclude pure markdown formatting markers (lines that are only `---`, `#` headers with no prose, empty lines).
   - Track per-unit word counts (match filenames to outline units) for `--detail` mode.
```

Adapt to scan for markers (line-by-line matching) rather than word counting. Scope is `.manuscript/drafts/` (not just `body/`).

**Dry-run vs apply branch pattern** (copy from `commands/scr/health.md` lines 78-90):
```markdown
## Repair mode (--repair)

With `--repair`, fix what can be auto-fixed:

1. **Regenerate missing STATE.md** from file system state ...
2. **Fix config.json missing fields** with sensible defaults ...
3. **Report orphaned drafts** for manual review -- do NOT delete them, just list them with suggested actions
```

The `--repair` / `--apply` if-branch is the same logical structure. Adapt to:
- Default (no flag): report what would be removed, do not modify files
- `--apply`: modify files in place, then show diff summary (count by marker type)

**Summary output format** (copy from `commands/scr/health.md` lines 63-76):
```markdown
```
Project Health Report
=====================

[GREEN]  Required files ............ All present
[YELLOW] Config schema ............. Missing "author" field
```
```

Adapt the summary style to the dry-run format specified in RESEARCH.md Pattern 5:
```
Would remove from chapter-01.md:
  - line 3: [Fill in or delete:]
  - line 47: Alternate 1: block (lines 47-52)

Summary: 3 bracket markers, 1 Alternate block across 1 file.
Run `/scr:cleanup --apply` to apply these changes.
```

---

### `commands/scr/validate.md` (command, file-I/O + request-response)

**Analogs:** `commands/scr/voice-check.md` (scan + PASS/WARNING/FAIL output), `commands/scr/continuity-check.md` (file:location report format)

**Frontmatter pattern** (copy from `commands/scr/voice-check.md` lines 1-3):
```markdown
---
description: Compare drafted prose against STYLE-GUIDE.md to detect voice drift.
---
```

Note: `voice-check.md` has no `argument-hint:` - but `validate.md` needs one for `--skip-validate` flag awareness (though `--skip-validate` is for export/publish, not validate itself). Follow `manuscript-stats.md` pattern which uses `argument-hint:`. No flags needed on the standalone validate command; omit `argument-hint:` or set it to `""`.

**STEP 1: LOAD CONTEXT + prerequisite guard pattern** (copy from `commands/scr/voice-check.md` lines 23-35):
```markdown
### STEP 1: LOAD CONTEXT AND VALIDATE

1. Load `config.json` - determine work type and structural hierarchy
2. Load Scriveno's installed/shared `CONSTRAINTS.json` ...
3. Check for `STYLE-GUIDE.md`:
   - **If STYLE-GUIDE.md exists:** Load it. Proceed.
   - **If STYLE-GUIDE.md does NOT exist:** STOP. Tell the writer: ...

**Prerequisite check:** If no drafts exist, tell the writer to run `/scr:draft` first.
```

Adapt: instead of checking for STYLE-GUIDE.md, check that `.manuscript/drafts/` directory exists and contains `.md` files. Stop if no drafts found.

**Scan loop pattern** (copy from `commands/scr/continuity-check.md` lines 17-21):
```markdown
Spawn a continuity analysis agent that reads all drafted scenes and checks:

<continuity_checks>
  <check name="character_consistency">
    - Physical descriptions match across scenes ...
  </check>
```

Adapt: no sub-agent spawn needed for validate (simpler). Agent reads `.manuscript/drafts/**/*.md` directly and applies pattern matching line-by-line.

**Pass/fail output pattern** (copy from `commands/scr/voice-check.md` lines 57-61):
```markdown
- **80-100 - PASS**: Voice is consistent with STYLE-GUIDE.md. Minor issues noted but not actionable.
- **60-79 - WARNING**: Noticeable voice drift detected. Issues flagged for writer review.
- **Below 60 - FAIL**: Significant voice drift. ...
```

Adapt to binary pass/fail (no score needed):
```markdown
- **PASS**: No scaffold markers found. Emit: "[x] Manuscript clean - no scaffold markers found (N files checked)"
- **FAIL**: Markers found. Emit file:line list + "Run /scr:cleanup --apply to remove scaffold markers."
  Then **stop** - do not proceed.
```

**Per-issue report format** (copy from `commands/scr/continuity-check.md` lines 84-93):
```markdown
For each issue:
- What the contradiction is
- Where it appears (file, paragraph reference)
- What the established fact was and where it was established
- Suggested fix
```

Adapt to scaffold marker report:
```
.manuscript/drafts/body/chapter-01.md:3: [Fill in or delete:]
.manuscript/drafts/body/chapter-01.md:47: Alternate 1:
```

---

### `commands/scr/export.md` - STEP 1.5 inject (command modification)

**Current state** (lines 84-86, the injection boundary):
```markdown
Then **stop**.

---

### STEP 2: CHECK PREREQUISITES
```

**Injection point:** Insert the new STEP 1.5 block between line 84 (`Then **stop**.`) and line 86 (`---`) above STEP 2. Specifically, insert after line 84 and before the `---` separator that precedes `### STEP 2`.

**Pattern for the gate block** - copy the existing prerequisite gate shape from `export.md` lines 98-110:
```markdown
**For docx, epub, latex, query-package:** Check for Pandoc:

```bash
command -v pandoc >/dev/null 2>&1
```

If Pandoc is not found:

> **Pandoc is required for this export format but is not installed.**
>
> ...
>
> After installing, run this export command again.

Then **stop** -- do not attempt export without the required tool.
```

The validate gate follows the identical "scan condition -> if found: blockquote error message -> stop / else: proceed" shape.

**New STEP 1.5 block to insert** (derived from RESEARCH.md Pattern 2 + existing gate shape):
```markdown
---

### STEP 1.5: VALIDATE MANUSCRIPT

**Check for scaffold markers in `.manuscript/drafts/`.**

Scan all `.md` files in `.manuscript/drafts/` for:
- Lines containing `[Fill in` (covers `[Fill in:]`, `[Fill in or delete:]`)
- Lines containing `[Delete if not applicable:]`
- Lines containing `Alternate 1:` or `Alternate 2:`
- Files with more than one `# ` (top-level H1) heading

**If `--skip-validate` was passed:**

> **Warning: Validate gate skipped (`--skip-validate`). Your manuscript may contain
> unresolved scaffold markers. Run `/scr:validate` to check before submitting.**

Proceed to STEP 2.

**If markers are found** (and `--skip-validate` was not passed):

> **Export blocked: unresolved scaffold markers found.**
>
> [list each as: `path/to/file.md:LINE_NUMBER: marker text`]
>
> **Fix:** Run `/scr:cleanup --apply` to remove scaffold markers, or manually
> edit the listed files, then re-run this export command.

Then **stop** -- do not proceed to STEP 2.

If no markers found: proceed to STEP 2.
```

**Exact insertion:** After line 84 (`Then **stop**.`) and before the `---` + `### STEP 2` block beginning at line 86.

---

### `commands/scr/publish.md` - STEP 1 inject (command modification)

**Current state of STEP 1** (lines 24-34):
```markdown
### STEP 1: LOAD CONTEXT

Load these project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, language
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) -- to check `publishing_prerequisites`, `exports` section, and work type group
- `.manuscript/OUTLINE.md` -- to verify draft completeness

Determine the work type group from CONSTRAINTS.json `work_type_groups` so you can check which presets and commands are available.

---
```

**Injection point:** After the closing `---` of STEP 1 (line 34) and before `### STEP 2: ROUTE` (line 36). This places the validate gate as a new `### STEP 1.5` block positioned between STEP 1 and STEP 2.

**Pattern:** Same gate block shape as the `export.md` injection above. The `--skip-validate` bypass + visible warning is mandatory per CONTEXT.md decision.

**New STEP 1.5 block to insert into publish.md** (after line 34, before line 36):
```markdown
### STEP 1.5: VALIDATE MANUSCRIPT

**Check for scaffold markers in `.manuscript/drafts/`.**

Scan all `.md` files in `.manuscript/drafts/` for:
- Lines containing `[Fill in` (covers `[Fill in:]`, `[Fill in or delete:]`)
- Lines containing `[Delete if not applicable:]`
- Lines containing `Alternate 1:` or `Alternate 2:`
- Files with more than one `# ` (top-level H1) heading

**If `--skip-validate` was passed:**

> **Warning: Validate gate skipped (`--skip-validate`). Your manuscript may contain
> unresolved scaffold markers. Run `/scr:validate` to check before submitting.**

Proceed to STEP 2.

**If markers are found** (and `--skip-validate` was not passed):

> **Publishing blocked: unresolved scaffold markers found.**
>
> [list each as: `path/to/file.md:LINE_NUMBER: marker text`]
>
> **Fix:** Run `/scr:cleanup --apply` to remove scaffold markers, or manually
> edit the listed files, then re-run this publish command.

Then **stop** -- do not proceed to STEP 2.

If no markers found: proceed to STEP 2.

---
```

**Why STEP 1.5 and not STEP 0:** `publish.md` has no STEP 0 and its STEP 1 loads all needed context (config.json, CONSTRAINTS.json, OUTLINE.md) that the gate may reference for file scoping. Inserting as STEP 1.5 keeps the file-load context available before the gate runs, which is consistent with the RESEARCH.md recommendation.

---

## Shared Patterns

### Command File Structural Invariant
**Source:** `commands/scr/manuscript-stats.md` lines 1-21 (and verified by `test/commands.test.js`)
**Apply to:** Both `cleanup.md` and `validate.md`

Every new command file MUST contain all four required elements or `commands.test.js` will fail:

```markdown
---
description: <one-line description>
argument-hint: "[--flag]"
---

# /scr:commandname -- Short Title

Brief description paragraph.

## Usage

```
/scr:commandname [--flag]
```

**Flags:**
- `--flag` - description
```

The `argument-hint:` field is present in `manuscript-stats.md`, `export.md`, `health.md`, and `editor-review.md` (newer commands). Use it. `copy-edit.md`, `line-edit.md`, and `continuity-check.md` (older commands) omit it - this is acceptable per test suite (only `description:` is required), but the newer pattern is preferred.

### STEP Separator Pattern
**Source:** `commands/scr/export.md` (throughout)
**Apply to:** All new STEP blocks in cleanup.md, validate.md, and the injected STEP 1.5 blocks

Between STEP blocks, use:
```markdown
---

### STEP N: HEADING
```

That is: a blank line, a `---` horizontal rule, a blank line, then the `### STEP N:` heading.

### Stop-on-Failure Pattern
**Source:** `commands/scr/export.md` lines 108-110 and `commands/scr/voice-check.md` lines 29-31
**Apply to:** validate.md (on marker found), export.md STEP 1.5 gate, publish.md STEP 1.5 gate

```markdown
Then **stop** -- do not [proceed / attempt X without the required condition].
```

The double-dash ` -- ` (not em-dash) is the consistent style across all command files. Blockquote error messages use `> **Bold label:**` followed by details.

### Prerequisite Guard Pattern
**Source:** `commands/scr/voice-check.md` lines 29-35
**Apply to:** Both `cleanup.md` and `validate.md` STEP 1

```markdown
**Prerequisite check:** If no drafts exist, tell the writer to run `/scr:draft` first.
```

Place this at the end of STEP 1 after context loads, before STEP 2. The guard is a sentence-level inline check, not a separate step.

### File-Scope Restriction Pattern
**Source:** `commands/scr/manuscript-stats.md` lines 34-38 (explicit path scoping)
**Apply to:** Both `cleanup.md` and `validate.md`

Always name the exact directory in the instruction:

```markdown
Read all files in `.manuscript/drafts/body/` recursively.
```

For cleanup and validate, the correct scope is `.manuscript/drafts/` (not `body/` subdirectory only, and NOT `.manuscript/**/*.md` which would include front-matter). Explicitly name `.manuscript/drafts/` in every scan instruction.

---

## No Analog Found

All four files have close analogs. No files in Phase 30 require falling back to RESEARCH.md patterns exclusively.

| File | Partial Gap | Resolution |
|------|-------------|------------|
| `cleanup.md` | No existing command does in-place file editing with dry-run | Combine `health.md` dry-run/repair shape + `manuscript-stats.md` scan loop. The dry-run/apply branch is the same logical structure as `health.md`'s diagnostic/repair modes. |
| `validate.md` | No existing command emits a hard "stop" gate for an entire subsequent pipeline | `voice-check.md` has PASS/WARNING/FAIL tiers; adapt to binary pass/stop. The "stop" instruction wording is established by `export.md` prerequisite gates. |

---

## Analog Reference Summary

| Analog File | Lines Used | Pattern Extracted |
|-------------|-----------|-------------------|
| `commands/scr/manuscript-stats.md` | 1-21, 23-28, 34-40 | Frontmatter+flag structure, LOAD CONTEXT shape, recursive scan loop |
| `commands/scr/health.md` | 1-3, 63-76, 78-90 | `argument-hint`, status output format, dry-run vs `--repair` branch |
| `commands/scr/voice-check.md` | 1-3, 23-35, 57-61 | Frontmatter, prerequisite guard, PASS/FAIL output tier |
| `commands/scr/continuity-check.md` | 84-93 | file:location per-issue report format |
| `commands/scr/export.md` | 50-86, 98-110 | STEP sequence, gate block shape (blockquote + stop), injection boundary |
| `commands/scr/publish.md` | 24-34 | STEP 1 context load, injection boundary for STEP 1.5 |

---

## Metadata

**Analog search scope:** `commands/scr/` (94 command files)
**Files scanned:** 8 analog files read in full
**Pattern extraction date:** 2026-04-17
