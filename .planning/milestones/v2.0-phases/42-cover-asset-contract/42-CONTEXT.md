# Phase 42: Cover Asset Contract - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Define one canonical cover-deliverable contract under `.manuscript/build/` so Scriveno can distinguish ebook front-cover assets from paperback and hardcover print-wrap assets without relying on vague or legacy file names.

</domain>

<decisions>
## Implementation Decisions

### Canonical build surface
- Treat `.manuscript/build/` as the only canonical location for final cover deliverables.
- Treat `.manuscript/illustrations/cover/` as prompt/output staging, not the final packaged delivery surface.

### Format split
- Keep ebook as a front-only raster asset.
- Keep paperback and hardcover as separate print-wrap PDFs with different physical requirements.

### Source handoff
- Require editable source files under `.manuscript/build/source/` so designer revisions are part of the contract, not an afterthought.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `commands/scr/cover-art.md` already owns the cover workflow vocabulary and prompt structure.
- `commands/scr/publish.md` and `docs/publishing.md` are the main user-facing surfaces that need the same asset contract.

### Established Patterns
- Contract changes live in markdown command files and trust-facing docs first, then get locked by focused regression tests.
- Build and export commands reference manuscript assets by convention, so path drift must be prevented through prose + tests instead of shared runtime code.

### Integration Points
- The cover contract must be visible in `cover-art.md`, `publish.md`, and `docs/publishing.md`.
- Phase-specific regression coverage belongs in a dedicated cover-contract test file.

</code_context>

<specifics>
## Specific Ideas

- Canonical files:
  - `.manuscript/build/ebook-cover.jpg` (or `.png`)
  - `.manuscript/build/paperback-cover.pdf`
  - `.manuscript/build/hardcover-cover.pdf`
- Editable sources live under `.manuscript/build/source/`.
- Prompt artifacts stay under `.manuscript/illustrations/cover/`.

</specifics>

<deferred>
## Deferred Ideas

- Generating final CMYK print-wrap PDFs automatically inside Scriveno.
- Managing barcode generation or ISBN assignment inside the CLI.

</deferred>
