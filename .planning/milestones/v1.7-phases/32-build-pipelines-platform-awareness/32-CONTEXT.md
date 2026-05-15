# Phase 32: Build Pipelines & Platform Awareness - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous run - grey areas auto-answered with user review)

<domain>
## Phase Boundary

Writers can produce EPUB and print-ready PDF output from the current manuscript for a selected publishing platform, with guardrails that warn before they build something the platform will reject.

**In scope:**
- New `/scr:build-ebook` command: EPUB via Pandoc, with EPUBCheck-passing accessibility (alt text, `lang` tags, semantic nav)
- New `/scr:build-print` command: print-ready PDF via Pandoc + Typst, `--platform` flag selects target
- Platform manifests populated: KDP, IngramSpark, Apple, B&N, D2D, Kobo, Google, Smashwords trim sizes, page limits, epub variant, metadata shape
- Prerequisite detection: `which` binary check before build; one-line install hint on failure
- Page-count guardrail: word-count -> estimated page count before build, warns if exceeding platform limit (warning by default, `--strict` for hard block)
- Validate gate (Phase 30 STEP 1.5) inherited by both new commands at creation time

**Out of scope:**
- Sacred tradition fonts (Phase 33)
- Cross-domain templates (Phase 34)
- Academic LaTeX wrappers (Phase 35)
- Generating cover art or full-wrap PDFs (IngramSpark full-wrap cover deferred to v1.8+)
- `/scr:export` changes - existing export.md untouched (Phase 32 adds new commands only)

</domain>

<decisions>
## Implementation Decisions

### Command Output & Interface
- Output location: `.manuscript/output/` - `ebook.epub` and `print-{platform}.pdf` (matches export.md convention)
- Success output: single completion line with path + file size - e.g., `[x] EPUB built -> .manuscript/output/ebook.epub (1.2 MB)`
- Both commands inherit validate gate from Phase 30 (STEP 1.5 injected at the top, same as export.md/publish.md)

### Platform Manifest Content
- KDP trim sizes supported: `5x8`, `5.25x8`, `5.5x8.5`, `6x9`, `7x10` (the 5 standard sizes)
- Words-per-page density per trim (used for page-count estimation):
  - `5x8`: 220 wpp
  - `5.25x8`: 230 wpp
  - `5.5x8.5`: 235 wpp
  - `6x9`: 250 wpp
  - `7x10`: 300 wpp
- Default trim when `--trim` not specified: `6x9`
- Platform page limits (from REQUIREMENTS.md):
  - KDP paperback: 828 pages
  - KDP hardcover: 550 pages
  - IngramSpark paperback: 1,200 pages
- Other platforms (Apple, B&N, D2D, Kobo, Google, Smashwords): EPUB only (no print), no page limit guardrail

### Prerequisite Detection
- `/scr:build-ebook`: check Pandoc only (`which pandoc`)
- `/scr:build-print`: check Pandoc + Typst (`which pandoc`, `which typst`); IngramSpark platform also checks Ghostscript (`which gs`)
- Detection method: shell `which` binary existence (same pattern as export.md)
- Install guidance format: one-line hint - e.g., `Pandoc not found. Install: brew install pandoc (macOS) | apt install pandoc (Ubuntu)`
- Check runs before any build steps - fail fast, not downstream

### Page-Count Guardrail UX
- Behavior: warning (not hard block) - build proceeds after warning; `--strict` flag enables hard block
- When: runs before build starts, alongside prerequisite checks (uses word count from manuscript, not actual page count)
- Warning format: `WARNING Estimated {N} pages at {trim} ({PLATFORM} limit: {MAX}pp). Consider {ALT_PLATFORM} ({ALT_MAX}pp). Building anyway...`
- Platform limit check only runs when `--platform` is specified
- If no `--platform`: no page-count check (no baseline to compare against)

### Claude's Discretion
- Exact EPUBCheck accessibility implementation details (metadata shape, OPF structure)
- Whether to accept `--platform default` as an alias for kdp
- Exact Typst template parameters for each trim size (margins, bleed, gutter)
- Smashwords/D2D EPUB variant details (Nuclear Option compliance)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `templates/platforms/{kdp,ingram,apple,bn,d2d,google,kobo,smashwords}/manifest.yaml` - placeholder manifests to populate
- `lib/architectural-profiles.js` - `validatePlatform()`, `listPlatforms()` for platform validation (Phase 29)
- `data/CONSTRAINTS.json` - `architectural_profiles.platforms` taxonomy already accepts all 8 slugs
- `commands/scr/export.md` - STEP 1.5 validate gate pattern to replicate in build commands

### Established Patterns
- Command files are markdown in `commands/scr/`; each command has frontmatter `description:` + `argument-hint:`
- Output always lands in `.manuscript/output/` with descriptive filename
- Prerequisite checks happen in a dedicated STEP before any tool invocation
- External tool calls use shell-level CLI invocations (Pandoc, Typst, Ghostscript)

### Integration Points
- `data/CONSTRAINTS.json` `exports` section: build-ebook and build-print need entries for format/work-type availability
- Phase 30 STEP 1.5 validate gate: copy pattern into new build commands at creation time
- Phase 31 STEP 1.6 scaffold-exclusion gate: build commands should also apply this (front-matter assembly step)
- `lib/architectural-profiles.js` `validatePlatform()`: use for `--platform` flag validation

</code_context>

<specifics>
## Specific Ideas

- The 3 plans from ROADMAP are already well-specified:
  1. Phase 32 regression test suite (BUILD-01..BUILD-05, PLATFORM-01..PLATFORM-03) - TDD RED wave
  2. Create `/scr:build-ebook` and `/scr:build-print` command files
  3. Platform awareness: trim size tables, page-count guardrails, prerequisite detection

</specifics>

<deferred>
## Deferred Ideas

- IngramSpark full-wrap cover PDF with CMYK conversion - v1.8+
- Narrator DOCX for ACX audiobook - v1.8+
- EPUBCheck as an automated validation step (tool must be user-installed; REQUIREMENTS.md says "passes EPUBCheck" means the output is structurally valid, not that we run EPUBCheck in CI)

</deferred>
