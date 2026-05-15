# Phase 30: Export Cleanup & Validation Gate - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Writers can strip template scaffolding from their manuscript and are blocked from exporting a manuscript that still contains unresolved scaffold markers.

**In scope:**
- New `/scr:cleanup` command: strips bracket markers, `Alternate N` blocks, duplicate H1 headings from draft files
- New `/scr:validate` command: scans manuscript for unresolved scaffold markers and reports file:line results
- Export gate: pre-flight validate step injected into `/scr:export` and `/scr:publish` before converter runs
- Diff summary in cleanup, explicit pass/fail messaging in validate

**Out of scope:**
- Stripping `{{VAR}}` unfilled template tokens (these are not scaffold - they are unfinished writer content)
- Adding the gate to `/scr:build-ebook` or `/scr:build-print` - those commands are created in Phase 32 and will include the gate at creation time
- Writing a persistent validate report file - output is ephemeral (in-session only)

</domain>

<decisions>
## Implementation Decisions

### Cleanup Behavior
- Strip exactly: `[Fill in or delete:]`-style bracket markers, `Alternate 1:` / `Alternate 2:` blocks, duplicate H1 headings (per CLEAN-01)
- Dry-run by default - show what would be changed without modifying files; use `--apply` flag to execute changes in place
- File scope: all draft units in `.manuscript/drafts/` (whole-manuscript scope)
- After `--apply`: show before/after diff summary in session (count + what was removed) - no persistent log file

### Validate Output & Blocking Logic
- Blocking markers: `[Fill in` bracket patterns and literal `Alternate N` blocks only - per VALID-02; `{{VAR}}` tokens are not scaffold
- Output: file:line list for each marker found, with clean/fail summary header
- On clean manuscript: emit explicit "[x] Manuscript clean - no scaffold markers found" confirmation - per SC4
- Export gate escape hatch: `--skip-validate` flag allows bypass with a visible warning message (not silent)

### Export Gate Integration
- Gate added to `/scr:export` and `/scr:publish` in this phase; Phase 32 build commands add their own gate at creation time
- Gate failure message: file:line list of blocking markers + pointer to `/scr:cleanup --apply` for resolution - actionable guidance per SC3
- Gate runs before tool detection (fail-fast - no point probing Pandoc/Typst if manuscript is dirty)
- Gate output is ephemeral - no persistent report file written

### Claude's Discretion
- How to inject the gate into existing `/scr:export` and `/scr:publish` markdown command files (inline validate step vs. shared instruction block)
- Exact regex patterns for bracket markers and Alternate blocks
- Whether cleanup tracks line numbers or operates on whole-file pattern replacement

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `commands/scr/export.md` - existing export command; gate injected before converter invocation step
- `commands/scr/publish.md` - existing publish wizard; gate injected in STEP 1 context-loading (before any pipeline runs)
- `commands/scr/` directory - all new commands follow the same markdown structure (description frontmatter + H1 heading + usage + instruction steps)

### Established Patterns
- Commands are markdown files with YAML frontmatter: `description:`, `argument-hint:`
- Commands give step-by-step instructions to the agent; they are not compiled code
- Scaffold markers `[Fill in or delete:]` and `Alternate 1/2` appear in generated draft content (inserted by `/scr:draft`, `/scr:outline`, etc.), not in template source files
- Export command pattern: STEP 1: load context -> STEP 2: detect tools -> STEP 3: assemble -> STEP 4: convert

### Integration Points
- Export gate injects as "STEP 0: Validate" or "STEP 1.5" in export.md and publish.md before any converter runs
- Validate and cleanup commands are standalone new files in `commands/scr/`

</code_context>

<specifics>
## Specific Ideas

- CLEAN-01 exact marker list: `[Fill in or delete:]`, `[Fill in:]`, `[Delete if not applicable:]`, `Alternate 1:`, `Alternate 2:`, duplicate top-level `# Heading` (two or more `# ` headings in the same file)
- VALID-02 blocking patterns: same as CLEAN-01 - the validate command checks for exactly what cleanup removes
- Cleanup dry-run output format example: "Would remove 3 bracket markers and 1 Alternate block from chapter-01.md"
- Validate pass message: "[x] Manuscript clean - no scaffold markers found (N files checked)"

</specifics>

<deferred>
## Deferred Ideas

- Persistent VALIDATE-REPORT.md file for CI pipelines - out of scope; in-session output only for now
- Gate on `/scr:build-ebook` and `/scr:build-print` - added when those commands are created in Phase 32
- Stripping `{{VAR}}` unfilled tokens - different problem (writer didn't fill in content); out of scope

</deferred>
