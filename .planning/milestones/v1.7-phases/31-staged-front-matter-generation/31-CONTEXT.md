# Phase 31: Staged Front-Matter Generation - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous run - grey areas auto-answered with user review)

<domain>
## Phase Boundary

Front-matter elements split cleanly into auto-computable vs writer-personalized, so the writer never sees scaffolding leak into published output and auto elements stay fresh as metadata changes.

**In scope:**
- Update `/scr:front-matter` to add `scaffold: true` YAML frontmatter to the 5 personalization elements it writes to `.manuscript/front-matter/`
- Ensure GENERATE elements (half-title, title page, copyright page, TOC) produce output with no `[Fill in]` placeholders
- Inject scaffold exclusion step into `/scr:export` and `/scr:publish`: silently exclude `scaffold: true` front-matter files from assembly, with a summary note
- Inject auto-refresh step into `/scr:export` and `/scr:publish`: detect if `WORK.md` is newer than the GENERATE front-matter files and regenerate them before assembling

**Out of scope:**
- Changing Introduction (14), Prologue (15), Maps (17), Note to Reader (16) scaffold behavior - only the 5 FM-02 elements get `scaffold: true`
- Adding `scaffold: true` to draft units in `.manuscript/drafts/` - this is front-matter-only
- Sacred tradition approval blocks (phase 33)
- Changing the GENERATE element content logic - they already produce clean output from WORK.md metadata

</domain>

<decisions>
## Implementation Decisions

### Scaffold: true Scope
- Exactly 5 elements get `scaffold: true` in their generated YAML frontmatter (per FM-02):
  - Element 5: Dedication
  - Element 6: Epigraph
  - Element 11: Foreword
  - Element 12: Preface
  - Element 13: Acknowledgments
- All other elements (Introduction, Prologue, Maps, Note-to-Reader, and all GENERATE types) remain unchanged - they do not get `scaffold: true`
- Introduction (14), Prologue (15), Maps (17), Note-to-Reader (16) keep their current `<!-- WRITER ACTION REQUIRED -->` comment behavior with no frontmatter gate

### YAML Frontmatter Format for Scaffold Files
- Each scaffold element file gets a YAML header prepended by the agent when writing the file:
  ```yaml
  ---
  scaffold: true
  element: <element-name>
  ---
  ```
- GENERATE element files get no YAML frontmatter (absence of frontmatter = included by default in assembly)

### Export Gate - Scaffold Exclusion
- Scaffold exclusion is NOT blocking - writer can export normally even with scaffold: true files
- Behavior: silently exclude `scaffold: true` front-matter files from assembly, then show a summary note:
  ```
  Note: 2 scaffold front-matter elements were excluded from this export:
    - .manuscript/front-matter/12-preface.md (scaffold: true - edit and set scaffold: false to include)
    - .manuscript/front-matter/11-foreword.md (scaffold: true - edit and set scaffold: false to include)
  ```
- Exclusion step added as STEP 1.6 in export.md and publish.md (after Phase 30's STEP 1.5 validate gate, before STEP 2 prerequisites check)
- If all front-matter files pass (no scaffold: true), no note is shown

### Export Gate - Auto-Refresh
- Before assembling, compare the modification timestamp of `.manuscript/WORK.md` against the timestamps of the 4 GENERATE front-matter files: `01-half-title.md`, `03-title-page.md`, `04-copyright.md`, `07-toc.md`
- If WORK.md is newer than ANY of those files (or if any of those files don't exist), regenerate all 4 GENERATE elements from current WORK.md before proceeding to assembly
- If WORK.md is not newer than all 4 files: skip regeneration silently
- Auto-refresh step added as part of STEP 1.6 scaffold/front-matter check in export.md and publish.md
- Regeneration instruction: "Re-run the GENERATE step from /scr:front-matter for elements 1, 3, 4, and 7 using current WORK.md metadata"

### Claude's Discretion
- Exact agent instruction phrasing for comparing file modification timestamps in a platform-agnostic way
- Whether STEP 1.6 in export.md and publish.md is a single combined step (scaffold exclusion + auto-refresh) or two separate steps
- Error handling if `.manuscript/front-matter/` directory doesn't exist at export time (writer hasn't run `/scr:front-matter` yet)

</decisions>

<code_context>
## Existing Code Insights

### File Modified
- `commands/scr/front-matter.md` - existing command, needs 5 SCAFFOLD element outputs updated to prepend `scaffold: true` YAML frontmatter
- `commands/scr/export.md` - add STEP 1.6 for scaffold exclusion + auto-refresh
- `commands/scr/publish.md` - add STEP 1.6 for scaffold exclusion + auto-refresh

### Established Patterns
- STEP 1.5 validate gate (Phase 30) is the pattern for injected steps: description + scan instruction + conditional actions
- front-matter.md currently outputs files to `.manuscript/front-matter/{NN}-{element-name}.md`
- The 5 scaffold elements: dedication (05), epigraph (06), foreword (11), preface (12), acknowledgments (13)
- The 4 GENERATE elements to auto-refresh: half-title (01), title-page (03), copyright (04), toc (07)

### Integration Points
- STEP 1.6 added after STEP 1.5 (validate gate) in both export.md and publish.md
- FM-03 exclusion is orthogonal to FM-04 auto-refresh but both live in the same STEP 1.6

</code_context>

<specifics>
## Specific Ideas

- YAML frontmatter prepended to scaffold outputs:
  ```yaml
  ---
  scaffold: true
  element: preface
  ---
  ```
- Export/publish STEP 1.6 structure:
  1. Scan `.manuscript/front-matter/` for files with `scaffold: true` in YAML frontmatter -> collect exclusion list
  2. Compare WORK.md timestamp vs GENERATE front-matter files -> regenerate if WORK.md is newer
  3. Show exclusion note (if any)
- If `.manuscript/front-matter/` is missing at export time: show a note "No front matter generated - run /scr:front-matter first" and continue (do not block export)
- `scaffold: false` opt-in: writer edits the file, changes `scaffold: true` to `scaffold: false`, and the file is included on the next export

</specifics>

<deferred>
## Deferred Ideas

- `scaffold: true` on Introduction, Prologue, Maps, Note-to-Reader - out of scope per FM-02 scope decision
- Sacred tradition front matter (approval blocks, imprimatur) - Phase 33
- Persistent report of excluded scaffold files - in-session output only, no persistent file
- `--force-scaffold` flag to include all scaffold: true elements for review - out of scope

</deferred>
