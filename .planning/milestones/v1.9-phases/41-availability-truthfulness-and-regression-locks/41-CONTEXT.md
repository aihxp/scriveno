# Phase 41: Availability Truthfulness and Regression Locks - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Align help, command prose, and trust-facing docs with the real availability contract in `CONSTRAINTS.json`, including narrower per-command constraints such as `nonfiction_only` and `comic_only`, then lock that truth with regression coverage.

</domain>

<decisions>
## Implementation Decisions

### Availability precedence
- `available` group membership is necessary but not sufficient for a command to surface.
- Narrower command constraints and dedicated command-family replacements must override broad adaptation labels in help, docs, and command prose.

### Adapted-label discipline
- An adapted label only surfaces when the base command is actually available to that work type.
- If a group is routed to a dedicated command family (for example sacred chronology), the hidden base command must say so explicitly instead of pretending to rename itself.

### Scope discipline
- Fix trust-facing markdown contracts and add focused tests rather than introducing executable availability logic.
- Prefer clear, conservative wording over exposing conceptual aliases that are not installed or not runnable.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/CONSTRAINTS.json` already contains both broad `available` groups and narrower command constraints such as `nonfiction_only` and `comic_only`.
- `docs/command-reference.md` already records some constrained availability accurately, such as book proposals being nonfiction-only and panel layouts being comics-only.

### Established Patterns
- Earlier command-surface fixes were locked by source-doc scans that derive disallowed patterns directly from `CONSTRAINTS.json`.
- Help and command files should defer to the constraints registry instead of hard-coding optimistic availability assumptions.

### Integration Points
- `commands/scr/help.md` must explain that command-level constraints narrow the menu beyond group availability.
- Several command files still describe unsupported adapted labels as if they were surfaced commands.
- `docs/work-types.md` needs to distinguish broad group features from subgroup-only commands such as `panel-layout`.

</code_context>

<specifics>
## Specific Ideas

- Make help filtering require both group availability and command-level constraint checks.
- Remove unsupported “command appears as ...” or “renamed to ...” claims for hidden adaptations.
- Add regression tests derived from unsupported adaptations in `CONSTRAINTS.json` plus explicit checks for constrained help/docs language.

</specifics>

<deferred>
## Deferred Ideas

- A shared executable availability helper for command runtimes if Scriveno ever moves beyond markdown-only command contracts.
- Broader cleanup of every conceptual adaptation stored in `CONSTRAINTS.json` if product decisions later prune hidden mappings entirely.

</deferred>
