# Phase 29: Architectural Foundation - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning
**Mode:** Auto-generated (discuss skipped - user elected skip-discuss for autonomous v1.7 run)

<domain>
## Phase Boundary

Template directory structure and project-spec keys exist as drop-in extension points so downstream build, tradition, and template work can plug in without touching core templates.

**In scope:**
- `templates/sacred/<tradition>/` directory structure with profile manifest convention
- `templates/platforms/<platform>/` directory structure with platform manifest convention
- `tradition:` and `platform:` keys in the project spec (WORK.md frontmatter or adjacent spec file)
- CONSTRAINTS.json validation of `tradition:` and `platform:` values against shipped profiles
- Default-inference rules for existing sacred work types (Bible -> catholic, Quran commentary -> islamic-hafs, etc.) so no writer action is required
- Default platform inference (all book exports default to `platform: kdp` when absent)

**Out of scope:**
- Populating tradition profiles with real content (font stacks, book-order, approval blocks, numbering macros) - that is Phase 33
- Populating platform configs with per-platform CSS/metadata - that is Phase 32
- Writing any templates that consume the new structure - Phases 32-35
- Changing existing `/scr:new-work` flow beyond adding the two keys
- Rewriting existing work type files on load (lazy migration only - default inference at read time)

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

All implementation choices are at Claude's discretion - discuss phase was skipped per user setting for this autonomous run. Use ROADMAP phase goal, success criteria, REQUIREMENTS.md ARCH-01..ARCH-05, the cross-domain platforms research at `.planning/tmp/cross-domain-platforms-research.md`, and existing codebase conventions (CONSTRAINTS.json structure, templates/ layout, WORK.md frontmatter) to guide decisions.

**Preferred defaults where no existing convention settles the choice:**
- Profile manifests use `manifest.yaml` inside each `templates/sacred/<tradition>/` and `templates/platforms/<platform>/` folder
- Spec keys live in existing WORK.md frontmatter (not a new file) to preserve progressive disclosure
- Default-inference is a static lookup map in `data/CONSTRAINTS.json` keyed by work type -> tradition/platform
- Validation is strict - unknown tradition/platform values reject with the list of known profiles in the error

</decisions>

<code_context>
## Existing Code Insights

Codebase context will be gathered during plan-phase research. Relevant entry points:

- `data/CONSTRAINTS.json` - runtime constraint system governing work type availability, prerequisites, and adaptations (per CLAUDE.md)
- `templates/` - existing template roots: shipped export templates `scriveno-book.typst`, `scriveno-epub.css`, `scriveno-academic.latex`; additional `templates/technical/` family from v1.4
- `bin/install.js` - installer; must not need changes for this phase (architecture shift is spec-level, not installer-level)
- `docs/runtime-support.md` - canonical runtime matrix
- `.planning/tmp/cross-domain-platforms-research.md` - v1.7 research artifact

</code_context>

<specifics>
## Specific Ideas

Research-driven specifics to incorporate during planning:

- Tradition profiles to seed (empty placeholder manifests acceptable this phase, real content in Phase 33): catholic, orthodox, tewahedo, protestant, jewish, islamic-hafs, islamic-warsh, pali, tibetan, sanskrit
- Platform profiles to seed (empty placeholder manifests acceptable this phase, real content in Phase 32): kdp, ingram, d2d, apple, kobo, google, bn, smashwords
- Work-type -> default tradition inference:
  - `bible` / `bible-commentary` -> catholic (most common user default; still overridable)
  - `quran-commentary` / `quran` -> islamic-hafs
  - `tanakh` / `jewish-commentary` -> jewish
  - `sutta` / `buddhist-commentary` -> pali
  - `gita` / `hindu-commentary` -> sanskrit
- Work-type -> default platform inference: all book types -> kdp

</specifics>

<deferred>
## Deferred Ideas

- Populating real tradition content (fonts, numbering, approval blocks) - Phase 33
- Populating real platform content (CSS, metadata schema) - Phase 32
- `/scr:new-work` onboarding prompting the writer for tradition/platform - out of scope; inference + override via edit is sufficient for v1.7

</deferred>
