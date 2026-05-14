# Phase 30: Export Cleanup & Validation Gate - Research

**Researched:** 2026-04-17
**Domain:** Markdown command authoring (pure skill system), text pattern matching, gate injection into existing commands
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Cleanup Behavior**
- Strip exactly: `[Fill in or delete:]`-style bracket markers, `Alternate 1:` / `Alternate 2:` blocks, duplicate H1 headings (per CLEAN-01)
- Dry-run by default — show what would be changed without modifying files; use `--apply` flag to execute changes in place
- File scope: all draft units in `.manuscript/drafts/` (whole-manuscript scope)
- After `--apply`: show before/after diff summary in session (count + what was removed) — no persistent log file

**Validate Output & Blocking Logic**
- Blocking markers: `[Fill in` bracket patterns and literal `Alternate N` blocks only — per VALID-02; `{{VAR}}` tokens are not scaffold
- Output: file:line list for each marker found, with clean/fail summary header
- On clean manuscript: emit explicit "✓ Manuscript clean — no scaffold markers found" confirmation — per SC4
- Export gate escape hatch: `--skip-validate` flag allows bypass with a visible warning message (not silent)

**Export Gate Integration**
- Gate added to `/scr:export` and `/scr:publish` in this phase; Phase 32 build commands add their own gate at creation time
- Gate failure message: file:line list of blocking markers + pointer to `/scr:cleanup --apply` for resolution — actionable guidance per SC3
- Gate runs before tool detection (fail-fast — no point probing Pandoc/Typst if manuscript is dirty)
- Gate output is ephemeral — no persistent report file written

### Claude's Discretion
- How to inject the gate into existing `/scr:export` and `/scr:publish` markdown command files (inline validate step vs. shared instruction block)
- Exact regex patterns for bracket markers and Alternate blocks
- Whether cleanup tracks line numbers or operates on whole-file pattern replacement

### Deferred Ideas (OUT OF SCOPE)
- Persistent VALIDATE-REPORT.md file for CI pipelines — out of scope; in-session output only for now
- Gate on `/scr:build-ebook` and `/scr:build-print` — added when those commands are created in Phase 32
- Stripping `{{VAR}}` unfilled tokens — different problem (writer didn't fill in content); out of scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CLEAN-01 | Writer can run `/scr:cleanup` to strip template-only syntax (placeholder brackets like `[Fill in or delete:]`, alternate markers like `Alternate 1/2`, duplicate H1 headings) from draft files in place | New command file `commands/scr/cleanup.md` with dry-run default + `--apply` flag |
| CLEAN-02 | `/scr:cleanup` reports a diff summary showing what was changed | Diff summary block in `--apply` path; count by marker type |
| VALID-01 | Writer can run `/scr:validate` to scan the manuscript for unresolved scaffold markers before export | New command file `commands/scr/validate.md` scanning `.manuscript/drafts/` |
| VALID-02 | `/scr:validate` blocks export with a non-zero exit code when critical markers are present | Command instructs agent to report fail status; gate logic blocks forward progress |
| VALID-03 | Export commands automatically invoke validate as a pre-flight gate, with actionable guidance | Inject STEP 0 into `export.md` and STEP 1.5 into `publish.md` |
</phase_requirements>

---

## Summary

Phase 30 delivers two new markdown command files (`cleanup.md`, `validate.md`) plus targeted edits to two existing command files (`export.md`, `publish.md`). Because Scriveno is a pure skill system — no compiled runtime, agents read markdown and execute it — all deliverables are markdown files with YAML frontmatter. There is no code to compile, no npm install, and no external tool to detect.

The scaffold markers this phase targets (`[Fill in or delete:]`, `[Fill in:]`, `[Delete if not applicable:]`, `Alternate 1:`, `Alternate 2:`, duplicate top-level `#` headings) are emitted by agent-driven draft commands into `.manuscript/drafts/` files. They do NOT appear in `templates/` source files (templates use `{{VAR}}` substitution, which is explicitly out of scope). Confirmed by exhaustive grep of `templates/`: zero instances of bracket or Alternate markers found. [VERIFIED: grep of /Users/hprincivil/Projects/scriveno/templates/]

The inject point in `/scr:export` is clearly defined by the existing step sequence: STEP 1 loads context, STEP 2 checks prerequisites. The validate gate belongs as a new STEP 1.5 (or STEP 0) inserted before STEP 2, so a dirty manuscript never reaches tool detection. In `/scr:publish`, the gate belongs in STEP 1 (Load Context), immediately after the draft-completeness check, before the wizard routes to a preset.

**Primary recommendation:** Two new standalone command files + surgical edits to `export.md` and `publish.md`. Gate injection pattern: inline instruction block at the correct step position, not a shared include (Scriveno has no include mechanism).

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Scaffold marker detection | Agent (reads files, matches patterns) | — | Agent reads `.manuscript/drafts/` and applies text pattern logic |
| Cleanup (in-place stripping) | Agent (edits files) | — | Agent modifies draft files directly; no compiled helper needed |
| Validate gate enforcement | Command (instruction logic) | Agent (executes) | Command instructs agent to stop on marker detection; agent enforces |
| Export gate injection | Existing command file edit | — | `export.md` and `publish.md` gain a new step block |
| Escape hatch (`--skip-validate`) | Command argument parsing | — | Same pattern used by `--apply` flag in other commands |

---

## Standard Stack

### Core

| Artifact | Type | Purpose | Why Standard |
|----------|------|---------|--------------|
| `commands/scr/cleanup.md` | Markdown command | Strip scaffold markers; dry-run + apply | Matches all 94 existing commands in `commands/scr/` |
| `commands/scr/validate.md` | Markdown command | Scan and report unresolved markers; fail on dirty | Same pattern |
| Edit to `commands/scr/export.md` | Markdown edit | Inject STEP 1.5 validate gate before STEP 2 prerequisites | Matches existing STEP structure |
| Edit to `commands/scr/publish.md` | Markdown edit | Inject validate gate in STEP 1 after draft-completeness check | Matches existing STEP structure |

### Supporting (No New Dependencies)

This phase requires zero new dependencies. The agent reads draft files, applies pattern matching, and reports results. All tooling is native to the agent runtime. [VERIFIED: CLAUDE.md architecture constraint — no npm runtime dependencies]

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline gate block in export.md | Shared instruction include | No include mechanism exists in Scriveno; inline is the only pattern. All 94 commands are self-contained. |
| Dry-run default for cleanup | Apply-by-default | CONTEXT.md locks dry-run default for safety; `--apply` is the explicit opt-in |

---

## Architecture Patterns

### System Architecture Diagram

```
Writer invokes /scr:cleanup or /scr:validate
        |
        v
Agent loads command markdown
        |
        v
STEP 1: Load config.json + CONSTRAINTS.json
        |
        v
STEP 2: Scan .manuscript/drafts/**/*.md
        |
   [for each file]
        |
        v
  Pattern match:
  - [Fill in...]  bracket markers (line-by-line)
  - Alternate 1: / Alternate 2: blocks (line-by-line)
  - Duplicate # headings  (per-file count)
        |
   +----+----+
   |         |
  /scr:validate    /scr:cleanup
   |         |
   v         v
file:line   dry-run:
report      "Would remove N..."
fail/pass   --apply: edit files in place
            diff summary output


/scr:export or /scr:publish invoked
        |
        v
STEP 0/1.5: Validate gate
   |
   +--[markers found]---> block + file:line list + "run /scr:cleanup --apply"
   |
   +--[--skip-validate]-> visible warning "Skipping validate (--skip-validate)"
   |
   +--[clean]-----------> proceed to existing STEP 2 (prerequisites)
```

### Recommended Project Structure

```
commands/scr/
├── cleanup.md          (NEW — CLEAN-01, CLEAN-02)
├── validate.md         (NEW — VALID-01, VALID-02)
├── export.md           (EDIT — inject STEP 1.5 for VALID-03)
└── publish.md          (EDIT — inject validate gate in STEP 1 for VALID-03)

test/
└── phase30-export-cleanup-validation-gate.test.js   (NEW — regression suite)
```

### Pattern 1: Command File Structure (All Scriveno Commands)

Every command in `commands/scr/` follows this exact structure. New commands MUST match it or the `commands.test.js` suite fails (it checks every `.md` file). [VERIFIED: test/commands.test.js lines 34-59]

```markdown
---
description: One-line description of what this command does.
argument-hint: "[--flag] [--other-flag]"
---

# /scr:commandname -- Short Title

Brief description paragraph.

## Usage

\`\`\`
/scr:commandname [--flag]
\`\`\`

**Flags:**
- `--flag` — description

## Instruction

You are a [role]. [What the agent does.]

---

### STEP 1: LOAD CONTEXT
...

### STEP 2: [next action]
...
```

**CRITICAL: Tests verify:**
1. File is `.md`, kebab-case name
2. YAML frontmatter present (`---\n...\n---`)
3. `description:` field in frontmatter
4. At least one heading (`# `) after frontmatter

[VERIFIED: test/commands.test.js — 281 assertions, all passing]

### Pattern 2: Prerequisite / Gate Injection in Export

The existing `export.md` gate pattern (for tool availability) is:

```markdown
### STEP 2: CHECK PREREQUISITES

**For markdown:** No external tools needed. Skip to Step 3.

**For docx, epub, latex, query-package:** Check for Pandoc:
\`\`\`bash
command -v pandoc >/dev/null 2>&1
\`\`\`

If Pandoc is not found:
> **Pandoc is required ... After installing, run this export command again.**

Then **stop** -- do not attempt export without the required tool.
```

The validate gate follows the same "check condition → fail with message → stop" pattern. Insert before STEP 2 as a new STEP 1.5. [VERIFIED: commands/scr/export.md lines 88-139]

### Pattern 3: Step Positioning in /scr:publish

In `publish.md`, the validate gate inserts into STEP 1 (Load Context) after the draft-completeness check (currently the last check before routing). The publish command has no STEP numbering equivalent for tool detection — it chains to `/scr:export` commands which each do their own tool detection. So the gate sits in STEP 1 immediately after the draft-completeness check. [VERIFIED: commands/scr/publish.md lines 24-47]

### Pattern 4: Exact Marker Definitions

Based on CONTEXT.md `<specifics>` section (locked decisions):

**Bracket markers (line-based matching):**
- `[Fill in or delete:]` — the canonical form
- `[Fill in:]` — short form
- `[Delete if not applicable:]` — conditional deletion marker

**Detection regex (agent-interpretable description):** Any line containing `[Fill in` (covers both forms) or `[Delete if not applicable:]`.

**Alternate blocks (multi-line, line-based scan):**
- Lines containing literal `Alternate 1:` or `Alternate 2:` (at start or inline)
- The entire block (from the `Alternate N:` line to the next blank line or next `Alternate` or next heading) is the unit to strip

**Duplicate H1 headings (per-file):**
- Count lines matching `^# ` (one space after single `#`) in each file
- If count > 1, the second and subsequent `# ` headings are "duplicate" and get stripped

**`{{VAR}}` tokens:** NOT scaffold. Do not match, do not strip. [VERIFIED: CONTEXT.md decisions section — explicitly out of scope]

### Pattern 5: Dry-Run vs Apply Output

From CONTEXT.md locked decisions and specifics:

**Dry-run output format:**
```
Would remove from chapter-01.md:
  - line 3: [Fill in or delete:]
  - line 47: Alternate 1: block (lines 47-52)
  - line 89: [Fill in:]

Summary: 3 bracket markers, 1 Alternate block across 1 file.
Run `/scr:cleanup --apply` to apply these changes.
```

**After `--apply` output:**
```
Cleaned chapter-01.md:
  - Removed 3 bracket markers
  - Removed 1 Alternate block

Summary: 3 bracket markers and 1 Alternate block removed from 1 file.
```

### Anti-Patterns to Avoid

- **Matching `{{VAR}}` tokens:** These are unfinished writer content, not scaffold. The writer may intend to fill them in later. Out of scope per locked decisions.
- **Stripping HTML comments (`<!-- ... -->`):** Back-matter scaffolds use HTML comments (e.g., `<!-- WRITER ACTION REQUIRED -->`). These are in back-matter files, not body drafts. The validate gate only scans `.manuscript/drafts/`. HTML comments in back-matter are not in scope.
- **Persistent report files:** Validate output is in-session only. Do not write VALIDATE-REPORT.md. [VERIFIED: deferred section of CONTEXT.md]
- **Silent `--skip-validate`:** If bypass flag is used, a visible warning MUST appear. Not a silent pass.
- **Blocking on `{{VAR}}`:** Phase 31 (FM-03) will handle scaffold-marked front matter exclusion. Phase 30's validate only blocks on `[Fill in` and `Alternate N` patterns.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Command include/template | Shared scaffold fragments | None needed | Every Scriveno command is self-contained markdown. No include mechanism exists or is needed. |
| Persistent validate log | VALIDATE-REPORT.md | In-session agent output | Explicitly deferred per CONTEXT.md. Writing a file creates a new Phase 31 dependency for FM-03. |
| CLI parser for `--apply`/`--skip-validate` | Argument parsing code | Agent reads the argument naturally | Scriveno commands are agent instructions, not compiled code. The agent interprets flags via natural language instruction in the command markdown. |

**Key insight:** Every "feature" in Scriveno is a natural language instruction to an AI agent. There is no code to compile. "Flag handling" means: write an instruction in the markdown that says "if the writer passed `--apply`, do X; otherwise do Y."

---

## Runtime State Inventory

This is not a rename/refactor/migration phase. No runtime state inventory required.

---

## Common Pitfalls

### Pitfall 1: Injecting Gate After STEP 2 in export.md
**What goes wrong:** The gate runs AFTER tool detection, so Pandoc/Typst probes happen even on a dirty manuscript.
**Why it happens:** Adding a new step at the end of an existing numbered sequence is easier than inserting mid-sequence.
**How to avoid:** Gate MUST be STEP 1.5 (or STEP 0 if renumbering) — explicitly before STEP 2 (CHECK PREREQUISITES). The CONTEXT.md decision is "Gate runs before tool detection."
**Warning signs:** If the gate step appears after any `command -v pandoc` check in the file.

### Pitfall 2: Applying cleanup.md to Front-Matter Files
**What goes wrong:** Scaffold markers in `.manuscript/front-matter/` (generated by `/scr:front-matter`) get stripped even though those are intended scaffold placeholders.
**Why it happens:** Using `.manuscript/**/*.md` glob instead of `.manuscript/drafts/`.
**How to avoid:** Scope both `cleanup.md` and `validate.md` explicitly to `.manuscript/drafts/` only. Front-matter scaffold is a Phase 31 concern (FM-03 handles `scaffold: true` frontmatter exclusion).
**Warning signs:** Command instruction says "all markdown files" without specifying the `drafts/` subdirectory.

### Pitfall 3: Stripping Alternate Blocks Without Line-Level Precision
**What goes wrong:** An over-eager regex removes content adjacent to an `Alternate N:` marker — eating a following legitimate paragraph.
**Why it happens:** Block-level regex "to next blank line" can be ambiguous if the alternate block has no trailing blank line.
**How to avoid:** Define the block boundary precisely: `Alternate N:` line through the next blank line OR the next `Alternate M:` line OR the next `## ` heading, whichever comes first. Agent instructions should specify this boundary clearly.
**Warning signs:** Cleanup removes content the writer intended to keep.

### Pitfall 4: commands.test.js Failing on New Command Files
**What goes wrong:** New `cleanup.md` or `validate.md` fails the existing `commands.test.js` structural checks.
**Why it happens:** Missing frontmatter, missing `description:` field, or no heading after frontmatter.
**How to avoid:** Follow Pattern 1 exactly — YAML frontmatter with `description:` + `argument-hint:`, then `# /scr:cleanup -- Title` heading.
**Warning signs:** `npm test` fails with "cleanup.md missing YAML frontmatter" or similar assertion.

### Pitfall 5: `--skip-validate` Silent in publish.md
**What goes wrong:** Writer passes `--skip-validate` to publish, no warning appears, manuscript with scaffold markers ships.
**Why it happens:** Escape hatch implemented as simple skip with no user feedback.
**How to avoid:** The command instruction must say: emit a visible warning block (e.g., `> **Warning: Validate gate skipped (--skip-validate). Your manuscript may contain unresolved scaffold markers.**`) before proceeding.
**Warning signs:** The instruction says "if --skip-validate, proceed to STEP 2" without a warning line.

---

## Code Examples

Verified patterns from codebase inspection:

### New Command File: cleanup.md (skeleton)
```markdown
---
description: Strip template scaffold markers from draft files. Dry-run by default.
argument-hint: "[--apply]"
---

# /scr:cleanup -- Scaffold Cleanup

Strip placeholder bracket markers, Alternate N blocks, and duplicate H1 headings
from draft files in `.manuscript/drafts/`. Dry-run by default; use `--apply` to
modify files in place.

## Usage

\`\`\`
/scr:cleanup [--apply]
\`\`\`

- `--apply` -- Modify files in place and show diff summary. Default: dry-run only.

## Instruction

You are a **manuscript cleanup specialist**. ...

### STEP 1: LOAD CONTEXT
...

### STEP 2: SCAN DRAFT FILES
...

### STEP 3: APPLY OR REPORT
...
```
[ASSUMED: exact instruction prose — to be written in PLAN]

### Validate Gate Block for export.md

Insert between existing STEP 1 and STEP 2 as new **STEP 1.5**:

```markdown
### STEP 1.5: VALIDATE MANUSCRIPT

**Check for scaffold markers in `.manuscript/drafts/`.**

Scan all markdown files in `.manuscript/drafts/` for:
- Lines matching `[Fill in` (covers `[Fill in:]`, `[Fill in or delete:]`)
- Lines matching `[Delete if not applicable:]`
- Lines matching `Alternate 1:` or `Alternate 2:`
- Files with more than one `# ` (top-level H1) heading

If `--skip-validate` was passed:
> **Warning: Validate gate skipped (`--skip-validate`). Your manuscript may contain
> unresolved scaffold markers. Run `/scr:validate` to check before submitting.**

Proceed to STEP 2.

If markers are found (and `--skip-validate` was not passed):

> **Export blocked: unresolved scaffold markers found.**
>
> [list each as: `path/to/file.md:LINE_NUMBER: [marker text]`]
>
> **Fix:** Run `/scr:cleanup --apply` to remove scaffold markers, or manually edit
> the listed files and re-run this export command.

Then **stop** -- do not proceed to STEP 2.

If no markers found: proceed to STEP 2.
```
[VERIFIED: pattern matches existing gate blocks in export.md for Pandoc/Typst checks]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| No scaffold gate | Export could run on dirty manuscript | Phase 30 adds gate | Writers can no longer accidentally ship `[Fill in:]` in output |
| No cleanup command | Writers had to find/strip markers manually | Phase 30 adds `/scr:cleanup` | Automated stripping with dry-run safety |

**No deprecated patterns:** This is a new capability. Nothing is being replaced.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Scaffold markers (`[Fill in...]`, `Alternate N:`) appear only in `.manuscript/drafts/` (not in templates/ source) | Architecture Patterns | Low risk — confirmed by grep. Templates use `{{VAR}}`. If a future command emits markers elsewhere, the gate scope may need widening. |
| A2 | HTML comments (`<!-- ... -->`) in back-matter scaffolds (back-matter.md, front-matter.md) are NOT in `.manuscript/drafts/` and not in scope for Phase 30 | Common Pitfalls | Low risk — Phase 31 handles front-matter scaffold exclusion via `scaffold: true` frontmatter key, a different mechanism |
| A3 | Agent instructions for flag handling (dry-run vs `--apply`) work via natural language description, not compiled argument parsing | Standard Stack | Inherent to Scriveno's architecture — confirmed by all 94 existing command files |

**All other claims are VERIFIED against the codebase or CONTEXT.md locked decisions.**

---

## Open Questions (RESOLVED)

1. **Alternate block end-boundary** — **(RESOLVED: 30-02-01)** Block boundary defined in cleanup.md Task 1 `<behavior>`: strip from the `Alternate N:` line through the next blank line OR next `Alternate M:` line OR next `## ` or `# ` heading, whichever comes first. Dry-run exposes exact ranges before `--apply`.
   - What we know: `Alternate 1:` and `Alternate 2:` blocks need to be stripped as units, not just their header line
   - What's unclear: How does the agent determine where the Alternate block ends? (blank line, next heading, next Alternate marker, or end of file)
   - Recommendation: The cleanup.md instruction should specify: "strip from the `Alternate N:` line through the next blank line that precedes either another `Alternate M:` header, a `## ` or `# ` heading, or end-of-file." If unsure, the dry-run will expose it for the writer to verify before `--apply`.

2. **Duplicate H1 handling — which copy to keep?** — **(RESOLVED: 30-02-01)** Rule locked in cleanup.md Task 1 `<behavior>` and `<action>`: keep the first `# ` heading, remove all subsequent ones. Dry-run shows exact line numbers for writer verification before `--apply`.
   - What we know: CONTEXT.md says "duplicate top-level `# Heading` (two or more `# ` headings in the same file)" are removed
   - What's unclear: Is the rule "keep the first, remove the rest" or "flag all and let the writer decide"?
   - Recommendation: Default to keeping the first `# ` heading and removing subsequent ones. In dry-run, show exactly which lines would be removed so the writer can verify.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 30 is a pure command-authoring phase. No external CLI tools, databases, or services are required. The commands instruct the AI agent to perform text pattern matching; no binaries are invoked during the Phase 30 feature path itself. (The `--skip-validate` bypass flag in export.md defers to the existing Pandoc/Typst tool detection in STEP 2, which is unchanged.)

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in test runner (`node:test`) |
| Config file | None — `npm test` runs `node --test test/*.test.js` |
| Quick run command | `node --test test/phase30-export-cleanup-validation-gate.test.js` |
| Full suite command | `npm test` |

[VERIFIED: package.json `"test": "node --test test/*.test.js"`, Node.js v25.6.0]

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| CLEAN-01 | `cleanup.md` exists in `commands/scr/` | structural | `node --test test/phase30-export-cleanup-validation-gate.test.js` | ❌ Wave 0 |
| CLEAN-01 | `cleanup.md` has YAML frontmatter with `description:` and heading | structural | same | ❌ Wave 0 |
| CLEAN-01 | `cleanup.md` contains `--apply` flag mention | content | same | ❌ Wave 0 |
| CLEAN-01 | `cleanup.md` targets `.manuscript/drafts/` (not all manuscript files) | content | same | ❌ Wave 0 |
| CLEAN-02 | `cleanup.md` contains diff summary language | content | same | ❌ Wave 0 |
| VALID-01 | `validate.md` exists in `commands/scr/` | structural | same | ❌ Wave 0 |
| VALID-01 | `validate.md` has YAML frontmatter with `description:` and heading | structural | same | ❌ Wave 0 |
| VALID-02 | `validate.md` mentions non-zero exit / "stop" on marker detection | content | same | ❌ Wave 0 |
| VALID-02 | `validate.md` references file:line output format | content | same | ❌ Wave 0 |
| VALID-02 | `validate.md` mentions pass confirmation message | content | same | ❌ Wave 0 |
| VALID-03 | `export.md` contains validate gate step before prerequisites step | content | same | ❌ Wave 0 |
| VALID-03 | `export.md` gate mentions `--skip-validate` bypass | content | same | ❌ Wave 0 |
| VALID-03 | `export.md` gate mentions `/scr:cleanup --apply` as resolution | content | same | ❌ Wave 0 |
| VALID-03 | `publish.md` contains validate gate before preset routing | content | same | ❌ Wave 0 |
| VALID-03 | `publish.md` gate mentions `--skip-validate` bypass with visible warning | content | same | ❌ Wave 0 |

### Existing Suite Must Stay Green

The following existing test files assert structural invariants on command files. Phase 30 deliverables must not break them:

| Test File | What It Checks |
|-----------|---------------|
| `test/commands.test.js` | Every `.md` in `commands/scr/` has frontmatter, `description:`, and a heading |
| `test/constraints.test.js` | CONSTRAINTS.json structural validity |

[VERIFIED: `npm test` — 1132 tests passing before Phase 30]

### Sampling Rate
- **Per task commit:** `node --test test/phase30-export-cleanup-validation-gate.test.js`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `test/phase30-export-cleanup-validation-gate.test.js` — covers CLEAN-01, CLEAN-02, VALID-01, VALID-02, VALID-03

---

## Security Domain

This phase does not handle authentication, session management, access control, cryptography, or external service calls. All operations are local file reads/writes by the AI agent within the writer's project directory. No ASVS categories apply.

---

## Sources

### Primary (HIGH confidence)
- Codebase: `commands/scr/export.md` — verified step structure and prerequisite gate pattern
- Codebase: `commands/scr/publish.md` — verified STEP 1 context load + STEP 3 routing structure
- Codebase: `test/commands.test.js` — verified mandatory command file structure (frontmatter, description, heading)
- Codebase: `package.json` — verified test runner command and Node.js version
- Codebase: `templates/` grep — verified zero scaffold bracket markers in template source files
- CONTEXT.md Phase 30 — all locked decisions are from verified user decisions document

### Secondary (MEDIUM confidence)
- Codebase: `commands/scr/back-matter.md` lines 331-332 — only occurrence of "Fill in" found in commands/, inside a template block, not in drafts scope
- Codebase: `test/phase29-architectural-foundation.test.js` — verified test file structure pattern for new phase test files

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — pure markdown command authoring; no new dependencies; all patterns verified from codebase
- Architecture: HIGH — inject point in export.md and publish.md precisely located from file inspection
- Pitfalls: HIGH — gate ordering and scope restriction derived from codebase structure, not inference

**Research date:** 2026-04-17
**Valid until:** This research is based on static file structure that changes only when commands are edited. Valid until any Phase 30+ command edits the export.md/publish.md step sequence.
