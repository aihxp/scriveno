# Phase 39: Draft Path Contract Unification - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Align Scriveno's active manuscript draft contract around one canonical source path so draft-producing and draft-consuming commands resolve the same files during drafting, export, translation, verification, and reporting workflows.

</domain>

<decisions>
## Implementation Decisions

### Canonical source draft path
- Treat `.manuscript/drafts/body/` as the canonical active-manuscript draft surface.
- Treat root-level `.manuscript/{N}-{A}-DRAFT.md` references as drift to be removed or explicitly redirected.

### Translation boundary
- Keep translation outputs under `.manuscript/translation/{lang}/drafts/`.
- Fix source-manuscript lookups without changing the translation directory contract in this phase.

### Scope discipline
- Prioritize command contracts and trust-facing docs over speculative file-migration features.
- Add regression coverage for path consistency so future command edits cannot silently re-split the contract.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/demo/.manuscript/drafts/body/` already demonstrates the body-draft layout used in proof artifacts.
- Export, publish, build, stats, and translation commands already read from `.manuscript/drafts/body/` or `.manuscript/drafts/`.

### Established Patterns
- Command contracts are the runtime behavior source of truth; fixing workflow truth means editing markdown commands plus matching tests/docs.
- Trust-critical regressions are usually locked with focused `node --test` coverage rather than shared runtime code.

### Integration Points
- Source draft path fixes will touch `draft.md`, `import.md`, `back-translate.md`, and any docs/examples still using root-level draft files.
- Regression coverage likely belongs in the existing workflow/command coherence tests rather than a brand-new suite.

</code_context>

<specifics>
## Specific Ideas

- Make `draft.md` and `import.md` write to `.manuscript/drafts/body/`.
- Make source-text readers such as `back-translate.md` read from `.manuscript/drafts/body/`.
- Sweep trust-facing docs for mixed active-manuscript path examples.

</specifics>

<deferred>
## Deferred Ideas

- Automatic migration tooling for older projects if root-level draft files ever existed in the wild.
- Broader cleanup of every generic `.manuscript/drafts/` reference unless it creates real ambiguity for this milestone.

</deferred>
