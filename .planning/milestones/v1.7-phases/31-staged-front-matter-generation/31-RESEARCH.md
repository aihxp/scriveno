# Phase 31: Staged Front-Matter Generation - Research

**Researched:** 2026-04-17
**Domain:** Markdown command authoring, YAML frontmatter conventions, AI agent instruction patterns
**Confidence:** HIGH - all findings derived from direct codebase inspection

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Scaffold: true Scope**
- Exactly 5 elements get `scaffold: true` in their generated YAML frontmatter (per FM-02):
  - Element 5: Dedication
  - Element 6: Epigraph
  - Element 11: Foreword
  - Element 12: Preface
  - Element 13: Acknowledgments
- All other elements (Introduction, Prologue, Maps, Note-to-Reader, and all GENERATE types) remain unchanged
- Introduction (14), Prologue (15), Maps (17), Note-to-Reader (16) keep their current `<!-- WRITER ACTION REQUIRED -->` comment behavior with no frontmatter gate

**YAML Frontmatter Format for Scaffold Files**
- Each scaffold element file gets a YAML header prepended by the agent when writing the file:
  ```yaml
  ---
  scaffold: true
  element: <element-name>
  ---
  ```
- GENERATE element files get no YAML frontmatter (absence of frontmatter = included by default in assembly)

**Export Gate - Scaffold Exclusion**
- Scaffold exclusion is NOT blocking - writer can export normally even with scaffold: true files
- Behavior: silently exclude `scaffold: true` front-matter files from assembly, then show a summary note
- Exclusion step added as STEP 1.6 in export.md and publish.md (after Phase 30's STEP 1.5 validate gate, before STEP 2 prerequisites check)
- If all front-matter files pass (no scaffold: true), no note is shown

**Export Gate - Auto-Refresh**
- Compare modification timestamp of `.manuscript/WORK.md` against the 4 GENERATE front-matter files: `01-half-title.md`, `03-title-page.md`, `04-copyright.md`, `07-toc.md`
- If WORK.md is newer than ANY of those files (or if any don't exist), regenerate all 4 GENERATE elements from current WORK.md before proceeding to assembly
- If WORK.md is not newer than all 4 files: skip regeneration silently
- Auto-refresh step added as part of STEP 1.6 in export.md and publish.md
- Regeneration instruction: "Re-run the GENERATE step from /scr:front-matter for elements 1, 3, 4, and 7 using current WORK.md metadata"

**STEP 1.6 placement:** After STEP 1.5 (validate gate), before STEP 2 (prerequisites check / route)

**Error handling if directory missing:** Show "No front matter generated - run /scr:front-matter first" and continue (do not block export)

**`scaffold: false` opt-in:** Writer edits the file, changes `scaffold: true` to `scaffold: false`, file is included on next export

### Claude's Discretion

- Exact agent instruction phrasing for comparing file modification timestamps in a platform-agnostic way
- Whether STEP 1.6 in export.md and publish.md is a single combined step (scaffold exclusion + auto-refresh) or two separate steps
- Error handling if `.manuscript/front-matter/` directory doesn't exist at export time

### Deferred Ideas (OUT OF SCOPE)

- `scaffold: true` on Introduction, Prologue, Maps, Note-to-Reader
- Sacred tradition front matter (approval blocks, imprimatur) - Phase 33
- Persistent report of excluded scaffold files - in-session output only, no persistent file
- `--force-scaffold` flag to include all scaffold: true elements for review
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FM-01 | `/scr:front-matter` generates auto-computable elements (half-title, title page, copyright page, TOC) in final form requiring no writer editing | Elements 1, 3, 4, 7 already produce clean output from WORK.md metadata per lines 99-107, 118-156, 213-227 of front-matter.md. No placeholder `[Fill in]` tokens present in their templates. Auto-refresh in STEP 1.6 keeps them fresh. |
| FM-02 | Elements requiring personalization (preface, foreword, dedication, epigraph, acknowledgments) are generated as explicit scaffold files clearly marked `scaffold: true` in frontmatter | Requires prepending YAML header to the 5 scaffold element writes in front-matter.md (elements 5, 6, 11, 12, 13). |
| FM-03 | Scaffold-marked elements are excluded from export until frontmatter flips to `scaffold: false` (or writer explicitly opts in) | Requires STEP 1.6 in export.md and publish.md to scan `.manuscript/front-matter/` for `scaffold: true` YAML and exclude those files from STEP 3b assembly. |
| FM-04 | Auto-computable elements regenerate automatically when metadata changes (title, author, copyright year, ISBN), without the writer rerunning `/scr:front-matter` | Requires STEP 1.6 timestamp comparison: if `WORK.md` is newer than any of `01-half-title.md`, `03-title-page.md`, `04-copyright.md`, `07-toc.md`, regenerate those 4 elements before assembly. |
</phase_requirements>

---

## Summary

Phase 31 modifies three command files: `commands/scr/front-matter.md`, `commands/scr/export.md`, and `commands/scr/publish.md`. It makes no changes to CONSTRAINTS.json, test infrastructure for existing tests, or any other files. All changes are pure markdown text edits to AI agent instructions.

The core work is: (1) prepend `scaffold: true` YAML to 5 personalization element outputs in front-matter.md, (2) inject a STEP 1.6 into export.md after line 116 (after STEP 1.5's "If no markers found: proceed to STEP 2") and before line 120 (### STEP 2: CHECK PREREQUISITES), and (3) inject the same STEP 1.6 into publish.md after line 66 and before line 70.

A new test file `test/phase31-staged-front-matter-generation.test.js` must be created following the Phase 30 test pattern: read the command files as text, assert structural properties with `node:test` + `node:assert`.

The key complexity is STEP 1.6 covering both FM-03 (scaffold exclusion from assembly) and FM-04 (auto-refresh of GENERATE elements). The planner must decide whether to implement these as one combined STEP 1.6 block or split into STEP 1.6 and STEP 1.7 - the CONTEXT marks this as Claude's Discretion.

**Primary recommendation:** Implement as a single STEP 1.6 with two clearly labeled sub-steps (1.6a: scaffold exclusion scan; 1.6b: GENERATE auto-refresh). This mirrors the STEP 3b pattern in export.md where assembly has labelled sub-steps (3a through 3g).

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Scaffold YAML header generation | Agent instruction (front-matter.md) | - | Agent writes the files; the instruction tells it to prepend YAML |
| Scaffold exclusion at export | Agent instruction (export.md + publish.md) | - | Assembly happens inside the agent following STEP 3b; exclusion list built before STEP 3 runs |
| GENERATE element auto-refresh | Agent instruction (export.md + publish.md) | - | Timestamp comparison and conditional regeneration are agent instructions, not code |
| Writer opt-in (scaffold: false) | Writer action | - | Pure convention: writer edits YAML in file, no tooling change needed |
| Test coverage | test/phase31-*.test.js | - | Static text assertions on command file content, same pattern as Phase 30 |

---

## Standard Stack

This phase has no library dependencies. All work is markdown text editing.

| File Modified | Current Lines | Change |
|---------------|--------------|--------|
| `commands/scr/front-matter.md` | 526 lines | Add YAML header block to 5 element output sections |
| `commands/scr/export.md` | 831 lines | Inject STEP 1.6 after line 116, before line 120 |
| `commands/scr/publish.md` | 258 lines | Inject STEP 1.6 after line 66, before line 70 |
| `test/phase31-staged-front-matter-generation.test.js` | new file | ~150 lines, FM-01 through FM-04 assertions |

**Installation:** None required. [VERIFIED: codebase - zero npm runtime dependencies, architecture constraint in CLAUDE.md]

---

## Architecture Patterns

### System Architecture Diagram

```
Writer runs /scr:front-matter
           |
           v
    STEP 3: GENERATE ELEMENTS
           |
    +------+------+
    |             |
    v             v
GENERATE      SCAFFOLD
elements      elements
(1,2,3,4,     (5,6,11,12,13)
7,8,9,10,     prepend YAML:
18,19)        ---
no YAML       scaffold: true
header        element: <name>
              ---
              + existing content
           |
           v
    .manuscript/front-matter/
    NN-element.md files
           |
           v
Writer runs /scr:export or /scr:publish
           |
    STEP 1.5: validate gate (Phase 30)
           |
    STEP 1.6: front-matter gate (Phase 31)
           |
    +------+---------------------------+
    |                                  |
    v                                  v
  1.6a: Scaffold scan              1.6b: Auto-refresh
  scan front-matter/               compare WORK.md mtime
  for scaffold: true               vs 01,03,04,07 mtime
  build exclusion list             if WORK.md newer:
  show summary note                  regenerate 4 GENERATE
  (if any excluded)                  elements from WORK.md
           |                                  |
           +----------+----------+
                      v
    STEP 2: CHECK PREREQUISITES
           |
    STEP 3: ASSEMBLE MANUSCRIPT
    3b uses exclusion list:
    skip scaffold:true files
           |
    STEP 4: EXPORT BY FORMAT
```

### Recommended File Structure

No structural changes. Files already exist in the correct locations.

### Pattern 1: YAML Frontmatter Prepend on Scaffold Elements

**What:** When the agent writes a scaffold element file, it prepends a YAML header before the markdown content.

**When to use:** Exactly 5 elements: dedication (05), epigraph (06), foreword (11), preface (12), acknowledgments (13).

**Example (from CONTEXT.md decisions):**

```markdown
---
scaffold: true
element: preface
---

# Preface

<!-- WRITER ACTION REQUIRED -->
...
```

**Source:** [VERIFIED: 31-CONTEXT.md `<decisions>` section]

The element names for the 5 scaffold files:
- `05-dedication.md` -> `element: dedication`
- `06-epigraph.md` -> `element: epigraph`
- `11-foreword.md` -> `element: foreword`
- `12-preface.md` -> `element: preface`
- `13-acknowledgments.md` -> `element: acknowledgments`

[VERIFIED: front-matter.md element table lines 17-37, confirmed file paths at lines 175, 211, 283, 306, 331]

### Pattern 2: STEP 1.5 as the Template for STEP 1.6

**What:** STEP 1.5 (Phase 30) is the established injection-step pattern. STEP 1.6 follows the same structure: description header, scan instruction, conditional actions, proceed or note.

**Observed STEP 1.5 structure in export.md (lines 86-116):**

```
### STEP 1.5: VALIDATE MANUSCRIPT

**Check for scaffold markers in `.manuscript/drafts/`.**

Scan all .md files in `.manuscript/drafts/` for:
[marker list]

**If --skip-validate was passed:**
[warning, proceed to STEP 2]

**If markers are found** (and --skip-validate was not passed):
[blocking output, stop]

If no markers found: proceed to STEP 2.
```

**STEP 1.6 follows the same pattern but is non-blocking:** no `stop` - always proceeds, just shows a note if files were excluded.

[VERIFIED: export.md lines 86-116 direct inspection]

### Pattern 3: STEP 3b Front-Matter Assembly (Where Exclusion List Is Applied)

**What:** STEP 3b in export.md (lines 186-199) reads all files in `.manuscript/front-matter/`, sorts by numeric prefix. This is where STEP 1.6's exclusion list must be applied - 3b must skip files whose path is in the exclusion list.

**Current 3b text (lines 186-199):**

```markdown
**3b. Scan front matter:**

Read all files in `.manuscript/front-matter/` directory. Sort by numeric prefix to maintain Chicago Manual of Style order:
...
If no front matter files exist:
> **Note:** No front matter found. Consider running `/scr:front-matter`...
Proceed with body content only.
```

**Phase 31 change:** STEP 3b must also say: "Skip any files present in the scaffold exclusion list built in STEP 1.6."

[VERIFIED: export.md lines 185-200 direct inspection]

**IMPORTANT:** publish.md does NOT have its own STEP 3b - it chains to export.md by calling the preset export commands. Therefore, the scaffold exclusion logic in publish.md's STEP 1.6 informs the export commands it dispatches, not a separate 3b. The planner must confirm whether the STEP 1.6 in publish.md + STEP 3b edit in export.md is sufficient coverage, or if publish.md's preset chains need a note.

[VERIFIED: publish.md STEP 4 preset tables lines 152-217 - all steps call /scr:export or /scr:front-matter; no own assembly step]

### Pattern 4: Timestamp Comparison - Platform-Agnostic Instruction

**What:** FM-04 requires comparing modification timestamps. Since Scriveno commands are instructions to an AI agent (not shell scripts), the instruction must tell the agent how to check timestamps in a way that works across macOS, Linux, and Windows.

**Recommended phrasing (Claude's Discretion):**

```
Compare the modification timestamp of `.manuscript/WORK.md` against each of:
  - `.manuscript/front-matter/01-half-title.md`
  - `.manuscript/front-matter/03-title-page.md`
  - `.manuscript/front-matter/04-copyright.md`
  - `.manuscript/front-matter/07-toc.md`

To compare timestamps, use the appropriate tool for the current platform:
- macOS/Linux: `stat -c %Y <file>` (Linux) or `stat -f %m <file>` (macOS)
- Windows: `(Get-Item <file>).LastWriteTime`
- Fallback: Ask the agent's file system tools if available; if not, assume WORK.md is newer and regenerate.

If WORK.md is newer than ANY of those files, or if ANY of those files do not exist:
  -> Regenerate all 4 GENERATE elements [...]
```

[ASSUMED: agent instruction phrasing - no prior art for this in the codebase. The planner should verify the wording is idiomatic for Scriveno's command style.]

### Anti-Patterns to Avoid

- **Blocking export on scaffold presence:** CONTEXT.md is explicit - scaffold exclusion is non-blocking. Do not add `stop` language after the scaffold note.
- **Modifying STEP 3b to scan YAML:** Instead, STEP 1.6 builds the exclusion list and passes it forward. STEP 3b references the list. Putting YAML-scan logic inside STEP 3b would be wrong; the gate step is the right place.
- **Regenerating all 19 elements on WORK.md change:** Only the 4 GENERATE elements (01, 03, 04, 07) are auto-refreshed. The CONTEXT decision scopes this precisely.
- **Running /scr:front-matter with no modification:** The regeneration instruction in STEP 1.6 must direct the agent to re-run ONLY the GENERATE step for elements 1, 3, 4, 7 - not trigger a full front-matter run (which would overwrite the writer's personalized scaffold files).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML frontmatter presence detection | Custom parser | Simple grep for `scaffold: true` in first N lines | The agent reads file content; the instruction can say "check if the file begins with --- and contains scaffold: true" |
| Timestamp comparison | OS-neutral code | Platform-specific shell commands with fallback to "assume newer" | Commands are agent instructions, not code; the agent can choose the right command |
| Scaffold file tracking across export | Persistent state file | In-session variable (exclusion list built and used within one STEP 1.6 invocation) | CONTEXT.md: "in-session output only, no persistent file" |

---

## Critical Discrepancy: Acknowledgments Element Type

**Finding:** Element 13 (Acknowledgments) is typed `GENERATE DRAFT` in front-matter.md's element table (line 31) and its section header (line 308: `#### Element 13: Acknowledgments (Recto) -- GENERATE DRAFT`), but the CONTEXT.md locked decisions include it as one of the 5 scaffold elements that gets `scaffold: true`.

**Evidence:**
- `front-matter.md` line 31: `| 13 | Acknowledgments | acknowledgments | GENERATE DRAFT |`
- `front-matter.md` line 308: `#### Element 13: Acknowledgments (Recto) -- GENERATE DRAFT`
- `31-CONTEXT.md` decisions: "Element 13: Acknowledgments" in the 5-element scaffold list

**Resolution:** The CONTEXT.md is the locked decision source. Element 13 gets `scaffold: true` prepended - this is user-confirmed. The element type label in the table (`GENERATE DRAFT`) describes how content is generated (AI generates a draft), not the publication-readiness gate. The `scaffold: true` flag serves the FM-03 gate independently of the generation approach.

**Plan action required:** Do NOT change the `GENERATE DRAFT` label in the element table or section header (out of scope). DO prepend `scaffold: true` YAML to the element 13 output per the locked decision.

[VERIFIED: front-matter.md lines 31, 308, 322-331; 31-CONTEXT.md decisions section]

---

## Critical Discrepancy: Epigraph Element Type

**Finding:** Element 6 (Epigraph) is typed `SUGGEST` in front-matter.md (line 24), not `SCAFFOLD`. However CONTEXT.md includes it in the 5-element scaffold list.

**Resolution:** Same as acknowledgments - the `SUGGEST` label describes how the AI contributes (it offers suggestions), not the gate behavior. The `scaffold: true` YAML gate is an independent mechanism. The element type label stays unchanged; the YAML header is prepended.

[VERIFIED: front-matter.md line 24, 31-CONTEXT.md decisions section]

---

## Common Pitfalls

### Pitfall 1: STEP 3b Does Not Reference the Exclusion List

**What goes wrong:** STEP 1.6 builds an exclusion list, but STEP 3b (the assembly step in export.md) still includes all front-matter files. The scaffold files leak into the assembled manuscript.

**Why it happens:** The two steps are in different sections and a partial edit leaves STEP 3b unmodified.

**How to avoid:** The plan must include an explicit edit to STEP 3b text to say: "Exclude any files listed in the STEP 1.6 scaffold exclusion list."

**Warning signs:** If the plan tasks only mention injecting STEP 1.6 but say nothing about STEP 3b, this pitfall is present.

### Pitfall 2: Scaffold YAML Interferes with the Phase 30 Validate Gate

**What goes wrong:** Phase 30's STEP 1.5 scans `.manuscript/drafts/` for `[Fill in` markers. Scaffold files live in `.manuscript/front-matter/`, not `.manuscript/drafts/`. So there is no interference.

**Confirmation:** Phase 30's cleanup.md explicitly scopes to `.manuscript/drafts/` to avoid stripping front-matter scaffold (confirmed by test at phase30 test line 67). The Phase 31 YAML frontmatter is in front-matter files, not drafts files. No conflict.

[VERIFIED: export.md STEP 1.5 line 89 "Scan all .md files in `.manuscript/drafts/`"]

### Pitfall 3: Auto-Refresh Overwrites Writer's Personalized Scaffold Files

**What goes wrong:** The agent regenerates ALL front-matter elements (not just the 4 GENERATE ones), overwriting the writer's personalized preface/dedication/etc.

**Why it happens:** Ambiguous instruction "re-run front-matter" could mean "run all elements."

**How to avoid:** STEP 1.6b must name the 4 specific files (`01-half-title.md`, `03-title-page.md`, `04-copyright.md`, `07-toc.md`) and say "regenerate ONLY these 4 GENERATE elements."

### Pitfall 4: Scaffold Note Shown When Directory Is Missing

**What goes wrong:** If `.manuscript/front-matter/` doesn't exist, the agent tries to scan it and errors or shows a confusing message.

**How to avoid:** STEP 1.6 must check for directory existence first. If missing: show "No front matter generated - run /scr:front-matter first" and proceed (from CONTEXT.md).

### Pitfall 5: STEP 1.6 in publish.md Redundant With STEP 1.6 in export.md

**What goes wrong:** Writer runs `/scr:publish --preset kdp-paperback`. Publish's STEP 1.6 excludes scaffold files and does auto-refresh. Then publish calls `/scr:export --format pdf --print-ready`, which runs export's own STEP 1.6 again - double execution.

**Resolution:** This is acceptable - the second execution of STEP 1.6 in export.md will find nothing to regenerate (WORK.md not newer than the files that were just regenerated) and no exclusion list items to show (same result). The redundancy is harmless. No special deduplication logic needed.

[ASSUMED: Analysis of execution flow - the agent is stateless between command invocations, so double-running STEP 1.6 is idempotent for auto-refresh and produces at most two summary notes. The planner may choose to add a note acknowledging this.]

### Pitfall 6: version bump in CONSTRAINTS.json

**What goes wrong:** The test `constraints.test.js` asserts `constraints.version === pkg.version`. If CONSTRAINTS.json is modified (it is not in Phase 31), the version must match package.json. If package.json is bumped, CONSTRAINTS.json must be bumped too.

**Phase 31 status:** No CONSTRAINTS.json changes needed - the `front-matter` command is already registered (line 989 CONSTRAINTS.json) and Phase 31 does not add/remove commands. No version bump required.

[VERIFIED: CONSTRAINTS.json line 989-998; constraints.test.js line 22-25]

---

## Code Examples

Verified patterns from direct file inspection:

### Scaffold YAML Header Format

```markdown
---
scaffold: true
element: dedication
---

# Dedication

<!-- WRITER ACTION REQUIRED -->
<!-- The dedication is a personal statement. Write yours below. -->
...

[Your dedication here]
```

Source: [VERIFIED: 31-CONTEXT.md `<decisions>` + `<specifics>` sections]

### STEP 1.6 Structure Pattern (following STEP 1.5 convention)

```markdown
### STEP 1.6: FRONT-MATTER GATE

**1.6a - Scaffold exclusion**

Check if `.manuscript/front-matter/` exists. If it does not exist:
> **Note:** No front matter found. Run `/scr:front-matter` first if you want publication front matter included.

Proceed to 1.6b.

If the directory exists, scan all `.md` files in `.manuscript/front-matter/` for files whose content begins with a YAML block containing `scaffold: true`. Build an exclusion list of these file paths.

If any scaffold files were found, note them for the assembly step (STEP 3b) and show:
> **Note:** [N] scaffold front-matter element(s) will be excluded from this export:
>   - .manuscript/front-matter/12-preface.md (scaffold: true - edit and set scaffold: false to include)
>   - .manuscript/front-matter/05-dedication.md (scaffold: true - edit and set scaffold: false to include)

If no scaffold files found, show no note. Proceed to 1.6b.

**1.6b - GENERATE element auto-refresh**

Compare the modification timestamp of `.manuscript/WORK.md` against the 4 GENERATE front-matter files:
- `.manuscript/front-matter/01-half-title.md`
- `.manuscript/front-matter/03-title-page.md`
- `.manuscript/front-matter/04-copyright.md`
- `.manuscript/front-matter/07-toc.md`

If `.manuscript/WORK.md` does not exist, skip auto-refresh.

To compare timestamps, use:
- macOS: `stat -f %m <file>`
- Linux: `stat -c %Y <file>`
- Windows: `(Get-Item '<file>').LastWriteTimeUtc.Ticks`
- If timestamp comparison is not possible, assume WORK.md is newer and regenerate.

If WORK.md is newer than ANY of those 4 files, or if ANY of those 4 files do not exist:
  Re-run the GENERATE step from `/scr:front-matter` for elements 1, 3, 4, and 7 only (half-title, title page, copyright page, TOC) using current WORK.md metadata. Do NOT regenerate scaffold elements (5, 6, 11, 12, 13) or any other elements.

If WORK.md is not newer than all 4 files: skip regeneration silently.

Proceed to STEP 2.
```

Source: [VERIFIED: structure mirrors export.md STEP 1.5 lines 86-116; content from 31-CONTEXT.md decisions]

### STEP 3b Addition (exclusion list application)

The current STEP 3b in export.md (lines 186-199) ends with "Proceed with body content only." The phase must add:

```markdown
**Scaffold exclusion:** Omit any files whose path appears in the scaffold exclusion list from STEP 1.6a.
```

This must appear within the 3b block, after the sort instruction.

Source: [VERIFIED: export.md lines 186-199; pattern from STEP 1.6 design in CONTEXT.md]

### Test Assertion Pattern (following Phase 30 style)

```javascript
// Source: test/phase30-export-cleanup-validation-gate.test.js pattern

const FRONT_MATTER_PATH = path.join(ROOT, 'commands', 'scr', 'front-matter.md');
const EXPORT_PATH = path.join(ROOT, 'commands', 'scr', 'export.md');
const PUBLISH_PATH = path.join(ROOT, 'commands', 'scr', 'publish.md');

describe('Phase 31: FM-02 front-matter.md adds scaffold: true to 5 elements', () => {
  it('05-dedication.md write includes scaffold: true in YAML header', () => {
    const content = readFile(FRONT_MATTER_PATH);
    // Look for scaffold: true appearing near the dedication element output
    assert.ok(content.includes('scaffold: true'), '...');
  });
  // ... one describe block per FM-0N requirement
});

describe('Phase 31: FM-03 export.md has STEP 1.6 scaffold exclusion', () => {
  it('export.md contains STEP 1.6 and it appears after STEP 1.5 and before STEP 2', () => {
    const content = readFile(EXPORT_PATH);
    const step15Pos = content.indexOf('STEP 1.5');
    const step16Pos = content.indexOf('STEP 1.6');
    const step2Pos  = content.indexOf('STEP 2');
    assert.ok(step16Pos !== -1, '...');
    assert.ok(step15Pos < step16Pos, '...');
    assert.ok(step16Pos < step2Pos, '...');
  });
});
```

Source: [VERIFIED: test/phase30-export-cleanup-validation-gate.test.js pattern; test/commands.test.js pattern]

---

## Injection Points (Exact Line Numbers)

### export.md

| Location | Current line | Content | Action |
|----------|-------------|---------|--------|
| After STEP 1.5 ends | Line 116 | `If no markers found: proceed to STEP 2.` | Inject STEP 1.6 block AFTER this line |
| Before STEP 2 | Line 118 | blank line | |
| Before STEP 2 header | Line 120 | `### STEP 2: CHECK PREREQUISITES` | STEP 1.6 must land before this |
| STEP 3b body | Lines 186-199 | "Read all files in `.manuscript/front-matter/`..." | Add exclusion list application sentence |

[VERIFIED: export.md direct inspection - grep output confirmed line numbers 116, 120 for STEP 1.5 end and STEP 2 start]

### publish.md

| Location | Current line | Content | Action |
|----------|-------------|---------|--------|
| After STEP 1.5 ends | Line 66 | `If no markers found: proceed to STEP 2.` | Inject STEP 1.6 block AFTER this line |
| Before STEP 2 header | Line 70 | `### STEP 2: ROUTE` | STEP 1.6 must land before this |

[VERIFIED: publish.md direct inspection - grep output confirmed line numbers 66 and 70]

### front-matter.md

| Element | Current save line | Current last line | YAML header placement |
|---------|------------------|-------------------|-----------------------|
| Element 5: Dedication | Line 175 | Before `Save to .../05-dedication.md` | Prepend YAML to the markdown block being saved |
| Element 6: Epigraph | Line 211 | Before `Save to .../06-epigraph.md` | Prepend YAML to the markdown block being saved |
| Element 11: Foreword | Line 283 | Before `Save to .../11-foreword.md` | Prepend YAML to the markdown block being saved |
| Element 12: Preface | Line 306 | Before `Save to .../12-preface.md` | Prepend YAML to the markdown block being saved |
| Element 13: Acknowledgments | Line 331 | Before `Save to .../13-acknowledgments.md` | Prepend YAML to the markdown block being saved |

[VERIFIED: front-matter.md direct inspection - lines 175, 211, 283, 306, 331 confirmed as Save-to lines]

---

## WORK.md Metadata Fields for Auto-Refresh

**Finding:** The WORK.md template (`templates/WORK.md`) does not have dedicated `title:`, `author:`, `isbn:`, `copyright_year:` YAML fields. These come from:

- **Title:** H1 heading in WORK.md (e.g., `# The Watchmaker's Daughter`)
- **Author:** `"author"` field in `.manuscript/config.json`
- **Copyright year:** Not explicitly stored - the front-matter command uses the current year or a year the agent infers
- **ISBN:** Not present in templates - optional field the writer would add manually

**Impact on FM-04:** The auto-refresh trigger is purely based on file modification timestamps, not field-level change detection. If the writer changes the WORK.md H1 title, `WORK.md`'s mtime becomes newer than the GENERATE files, and regeneration fires. This is correct and sufficient.

[VERIFIED: templates/WORK.md direct inspection; data/demo/.manuscript/config.json direct inspection]

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in `node:test` + `node:assert/strict` |
| Config file | none - run via `npm test` which calls `node --test test/*.test.js` |
| Quick run command | `node --test test/phase31-staged-front-matter-generation.test.js` |
| Full suite command | `npm test` |

[VERIFIED: package.json `"test"` script; existing test files pattern]

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FM-01 | GENERATE elements (01,03,04,07) produce no `[Fill in]` placeholders | static text scan | `node --test test/phase31-*.test.js` | Wave 0 gap |
| FM-02 | front-matter.md prepends `scaffold: true` YAML to 5 scaffold elements | static text scan | `node --test test/phase31-*.test.js` | Wave 0 gap |
| FM-03 | export.md STEP 1.6 contains scaffold exclusion logic before STEP 2 | static text scan | `node --test test/phase31-*.test.js` | Wave 0 gap |
| FM-03 | publish.md STEP 1.6 contains scaffold exclusion logic before STEP 2 | static text scan | `node --test test/phase31-*.test.js` | Wave 0 gap |
| FM-04 | export.md STEP 1.6 references WORK.md timestamp comparison and the 4 GENERATE files | static text scan | `node --test test/phase31-*.test.js` | Wave 0 gap |

### Wave 0 Gaps

- [ ] `test/phase31-staged-front-matter-generation.test.js` - covers FM-01 through FM-04

*(No framework gaps - Node.js built-in test runner already used by all Phase 29-30 tests)*

---

## Environment Availability

Step 2.6 SKIPPED - this phase makes no external tool calls. It edits three markdown files and creates one test file. No external dependencies required.

---

## Open Questions

1. **STEP 1.6 combined vs split**
   - What we know: CONTEXT.md marks this as Claude's Discretion
   - What's unclear: Whether one STEP 1.6 with sub-steps 1.6a/1.6b reads more naturally than two separate steps (STEP 1.6 scaffold exclusion, STEP 1.7 auto-refresh)
   - Recommendation: Use a single STEP 1.6 with clearly labeled sub-steps (1.6a and 1.6b). This matches the existing STEP 3 sub-step pattern (3a through 3g). Avoids renumbering all subsequent steps (STEP 2 would not need to shift).

2. **Scaffold: true detection method in STEP 1.6**
   - What we know: Files may or may not have YAML frontmatter; the agent needs to detect presence
   - What's unclear: Should the instruction say "check if the file begins with `---`" or use a simpler grep-like scan of the first few lines?
   - Recommendation: "Scan the first 10 lines of each file for a YAML block containing `scaffold: true`" - simple, unambiguous, works across any parser.

3. **Do STEP 3b changes apply to publish.md as well?**
   - What we know: publish.md chains to export.md for all assembly - it has no own STEP 3b
   - What's unclear: Whether publish.md needs any 3b-equivalent edit
   - Recommendation: No. publish.md's STEP 1.6 builds the exclusion list; when it dispatches to `/scr:export`, export.md's STEP 1.6 re-executes and its STEP 3b applies the exclusion. The chain is sufficient.

4. **FM-01 test: how to assert "no [Fill in] in GENERATE elements"**
   - What we know: The 4 GENERATE elements (01,03,04,07) must have no `[Fill in]` tokens in their output templates in front-matter.md
   - What's unclear: A static text scan of front-matter.md for `[Fill in` near the GENERATE element sections may produce false positives if the word "fill in" appears in explanatory prose
   - Recommendation: The test can look for `[Fill in` appearing within the code blocks for elements 1, 3, 4, 7 - or simply assert that after Phase 31 changes the file does not introduce `[Fill in` into those sections. Since the existing GENERATE elements already produce clean output per CONTEXT.md, this test mainly verifies no regression was introduced. A simpler test: assert that the file does NOT contain `[Fill in` inside the GENERATE element sections specifically (use a regex that captures lines between the section header and `Save to`).

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Running STEP 1.6 in both export.md and publish.md with overlapping auto-refresh is idempotent and harmless (second invocation finds no work to do) | Pitfall 5 | If second auto-refresh triggers an unintended regeneration cycle, scaffold files could be overwritten - but this is prevented by the explicit "ONLY elements 1,3,4,7" scoping |
| A2 | Agent phrasing for timestamp comparison (stat -f vs stat -c vs PowerShell) is the correct platform-agnostic approach | Pattern 4 / Code Examples | If Scriveno develops a canonical cross-platform timestamp convention, this phrasing should align with it. Currently no convention exists. |

---

## Sources

### Primary (HIGH confidence)

- `commands/scr/front-matter.md` - 526 lines, all 19 elements, file paths, element types confirmed
- `commands/scr/export.md` - 831 lines, STEP 1.5 at line 86-116, STEP 2 at line 120, STEP 3b at 186-199 confirmed
- `commands/scr/publish.md` - 258 lines, STEP 1.5 at line 36-66, STEP 2 at line 70 confirmed
- `data/CONSTRAINTS.json` - `front-matter` command registered at line 989, already covers prose/script/academic/visual/sacred
- `test/phase30-export-cleanup-validation-gate.test.js` - test pattern for command content assertions
- `.planning/phases/31-staged-front-matter-generation/31-CONTEXT.md` - all locked decisions
- `.planning/REQUIREMENTS.md` - FM-01 through FM-04 definitions

### Secondary (MEDIUM confidence)

- `templates/WORK.md` - confirms no YAML frontmatter fields for title/author/ISBN; H1 heading is title source
- `data/demo/.manuscript/config.json` - confirms title/author live in config.json, not WORK.md

---

## Metadata

**Confidence breakdown:**
- Injection points (line numbers): HIGH - direct grep + file read confirmed
- YAML frontmatter format: HIGH - from locked CONTEXT.md decisions
- Test pattern: HIGH - from Phase 30 test direct inspection
- Timestamp comparison phrasing: LOW (A2) - no prior art in codebase; marked ASSUMED

**Research date:** 2026-04-17
**Valid until:** 60 days (stable markdown file system; no dependency drift risk)
