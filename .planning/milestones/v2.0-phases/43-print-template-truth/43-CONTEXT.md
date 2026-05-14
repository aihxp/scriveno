# Phase 43: Print Template Truth - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Make Scriveno's print-cover guidance truthful for ebook, paperback, and hardcover production requirements so the product stops implying one generic cover file or universal spine math.

</domain>

<decisions>
## Implementation Decisions

### Ebook versus print truth
- Lock ebook guidance to a front-only RGB raster deliverable.
- Lock paperback and hardcover guidance to separate CMYK print-wrap PDFs.

### Platform truth
- Treat exact paperback and hardcover wrap geometry as template-driven from current platform tools.
- Remove hard-coded paper-factor or universal spine-width formulas from trust-facing surfaces in this phase scope.

### Scope discipline
- Focus on commands and publishing docs that actually teach cover specs.
- Do not build an internal cover calculator in this phase.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `cover-art.md` already owns the structured delivery brief and is the right place for format-level specs.
- `export.md` and `docs/publishing.md` already teach KDP and Ingram packaging expectations.

### Established Patterns
- Truth fixes land in source commands and public docs first, then get regression coverage for the forbidden stale patterns.
- Trust surfaces should prefer current platform template tools over static guesses.

### Integration Points
- Phase 43 needs `cover-art.md`, `export.md`, and `docs/publishing.md` aligned.
- Focused tests should assert both required specs and forbidden hard-coded math.

</code_context>

<specifics>
## Specific Ideas

- Ebook: `1600 x 2560`, RGB, front cover only.
- Paperback: PDF/X-1a:2001, CMYK, 300 DPI, embedded fonts, flattened transparency, `0.125"` bleed.
- Hardcover: PDF/X-1a:2001, CMYK, 300 DPI, embedded fonts, flattened transparency, `0.75"` board-wrap allowance.
- Template-driven geometry replaces `0.002252`, `paper_factor`, and similar math.

</specifics>

<deferred>
## Deferred Ideas

- Auto-fetching live IngramSpark template PDFs from Scriveno.
- Supporting printer-specific geometry calculators beyond the documented template-driven workflow.

</deferred>
