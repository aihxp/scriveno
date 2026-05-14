# Phase 40: Save / Undo State Integrity - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Repair the save and undo command contracts so Scriveno's writer-facing checkpoint flows leave `.manuscript/STATE.md` aligned with git history instead of dirtying the worktree or reverting the wrong manuscript change.

</domain>

<decisions>
## Implementation Decisions

### Save checkpoint ordering
- Treat the save action row in `.manuscript/STATE.md` as part of the checkpoint itself.
- Require `/scr:save` to update `STATE.md` before staging and committing `.manuscript/`.

### Undo target selection
- Identify the exact most recent `.manuscript/` commit hash before reverting instead of assuming `HEAD` is the target.
- Preserve the safe-history contract by continuing to use `git revert`, but use a no-commit flow so `STATE.md` updates land in the same checkpoint.

### Scope discipline
- Fix command-contract truth and add focused regression coverage without introducing runtime scripts or broader git workflow changes.
- Keep writer-facing language reassuring while making the developer-mode contract explicit enough to avoid dirty-tree surprises.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `history.md` and `versions.md` already present save history as human-readable descriptions derived from commit messages.
- `pause-work.md` relies on `/scr:save`, so save ordering changes must preserve the existing writer-friendly save output.

### Established Patterns
- Workflow integrity fixes in Scriveno are enforced through markdown command contracts plus targeted `node --test` coverage.
- Phase verification artifacts should prove that the prose contract itself now guarantees a clean worktree after save/undo.

### Integration Points
- `commands/scr/save.md` needs checkpoint ordering fixes.
- `commands/scr/undo.md` needs explicit target-commit selection and a single-commit revert + state-update flow.
- New tests should lock the repaired sequencing so later doc edits cannot silently reintroduce dirty-state bugs.

</code_context>

<specifics>
## Specific Ideas

- Update `/scr:save` so it appends the `save` row to `STATE.md`, then stages and commits `.manuscript/` once.
- Update `/scr:undo` so it captures the latest `.manuscript/` commit hash, runs `git revert <hash> --no-commit`, updates `STATE.md`, then creates one final undo commit.
- Add a dedicated regression file for save/undo sequencing expectations.

</specifics>

<deferred>
## Deferred Ideas

- Rich diff summaries or structured metadata to improve writer-facing undo descriptions.
- Broader hardening of every command that shells out to git with user-controlled text in commit messages.

</deferred>
