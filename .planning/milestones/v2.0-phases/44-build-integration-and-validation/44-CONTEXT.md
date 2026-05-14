# Phase 44: Build Integration and Validation - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire the new cover deliverables into Scriveno's build/export/publish surface, then align the release-facing trust docs and regression coverage so the cover workflow stays truthful over time.

</domain>

<decisions>
## Implementation Decisions

### Build wiring
- Build and export commands should point at the canonical `.manuscript/build/` cover assets rather than legacy output paths.
- Print packaging should reference the relevant paperback or hardcover cover asset without pretending Scriveno computes final wrap geometry.

### Trust-surface alignment
- Public command docs and shipped-asset inventory must describe the same cover workflow the command files expect.
- Release-facing docs should distinguish bundled templates from designer-provided build assets.

### Verification strategy
- Keep phase coverage split between focused cover tests and the full suite.
- Make the new tests fail on both stale paths and stale mental models.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `build-ebook.md`, `build-print.md`, and `export.md` are the primary build/export integration points.
- `docs/command-reference.md` and `docs/shipped-assets.md` are the highest-signal trust surfaces outside the commands themselves.

### Established Patterns
- Scriveno prefers manuscript asset conventions over generated helper code, so build-surface integrity must be enforced through docs + tests.
- Release-facing docs should never imply a bundled template or automation path that the repo does not actually ship.

### Integration Points
- EPUB embedding uses the ebook raster cover asset.
- Print packaging and publish flows need the paperback and hardcover PDF references.
- Regression coverage belongs in the phase-specific validation suite plus the full test run.

</code_context>

<specifics>
## Specific Ideas

- Replace `.manuscript/output/cover.jpg` with `.manuscript/build/ebook-cover.jpg`.
- Make print build/package flows reference `.manuscript/build/paperback-cover.pdf` and `.manuscript/build/hardcover-cover.pdf`.
- Update trust docs so `publish` no longer claims it generates a cover template.
- Document that cover deliverables are not bundled export templates.

</specifics>

<deferred>
## Deferred Ideas

- Automatic validation of PDF/X-1a internals for designer-provided cover files.
- Direct upload automation to KDP or IngramSpark.

</deferred>
