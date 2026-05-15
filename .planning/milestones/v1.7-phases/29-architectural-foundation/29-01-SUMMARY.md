---
phase: 29-architectural-foundation
plan: 01
subsystem: infra

tags: [templates, manifest, yaml, extension-point, sacred, platforms, scaffolding]

requires: []
provides:
  - templates/sacred/ directory with 10 placeholder tradition manifests
  - templates/platforms/ directory with 8 placeholder platform manifests
  - Drop-in contribution convention documented in both READMEs
  - Stable schema shape for downstream validator (Plan 03)
  - Extension points ARCH-01 (sacred) and ARCH-02 (platforms)
affects:
  - 29-architectural-foundation/02 (spec keys tradition:/platform:)
  - 29-architectural-foundation/03 (runtime validator reads these directories)
  - 32-build-pipelines (populates platform manifests with real content)
  - 33-sacred-tradition-profiles (populates sacred manifests with real content)

tech-stack:
  added: []
  patterns:
    - "Directory-listing extension points: runtime reads templates/<family>/*/manifest.yaml"
    - "Placeholder manifests declare full schema shape with null values + status: placeholder"
    - "Drop-in contribution: new profile = new subdirectory, no core edits required"

key-files:
  created:
    - templates/sacred/catholic/manifest.yaml
    - templates/sacred/orthodox/manifest.yaml
    - templates/sacred/tewahedo/manifest.yaml
    - templates/sacred/protestant/manifest.yaml
    - templates/sacred/jewish/manifest.yaml
    - templates/sacred/islamic-hafs/manifest.yaml
    - templates/sacred/islamic-warsh/manifest.yaml
    - templates/sacred/pali/manifest.yaml
    - templates/sacred/tibetan/manifest.yaml
    - templates/sacred/sanskrit/manifest.yaml
    - templates/sacred/README.md
    - templates/platforms/kdp/manifest.yaml
    - templates/platforms/ingram/manifest.yaml
    - templates/platforms/d2d/manifest.yaml
    - templates/platforms/apple/manifest.yaml
    - templates/platforms/kobo/manifest.yaml
    - templates/platforms/google/manifest.yaml
    - templates/platforms/bn/manifest.yaml
    - templates/platforms/smashwords/manifest.yaml
    - templates/platforms/README.md
  modified: []

key-decisions:
  - "Ship placeholder manifests with status: placeholder rather than empty files, so validator in Plan 03 can be written against the final schema shape without flipping between formats."
  - "Legacy sacred-scaffold markdown files (COSMOLOGY.md, DOCTRINES.md, FIGURES.md, FRAMEWORK.md, LINEAGES.md, THEOLOGICAL-ARC.md) coexist with new tradition subdirectories - they serve different purposes (project-scaffold templates vs. tradition profiles) and must not be conflated."
  - "Schema declared once per family (tradition schema for sacred, platform schema for platforms) so downstream phases populate fields without adding new keys."

patterns-established:
  - "Drop-in directory extension: add templates/<family>/<slug>/manifest.yaml, runtime picks it up via directory listing - no core edits."
  - "Placeholder lifecycle: status: placeholder -> downstream phase populates content -> status: active."
  - "Schema-first contribution: manifest.yaml must declare all keys (even as null) so validator sees a stable shape."

requirements-completed:
  - ARCH-01
  - ARCH-02

duration: 2min
completed: 2026-04-17
---

# Phase 29 Plan 01: Templates Directory Scaffolding Summary

**18 placeholder manifests + 2 READMEs establish drop-in extension points for sacred traditions (10) and publishing platforms (8), with full schema shape declared for the validator in Plan 03 to target.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-17T12:18:39Z
- **Completed:** 2026-04-17T12:20:20Z
- **Tasks:** 2
- **Files modified:** 20 (all created, none modified)

## Accomplishments

- `templates/sacred/` now hosts 10 tradition subdirectories (catholic, orthodox, tewahedo, protestant, jewish, islamic-hafs, islamic-warsh, pali, tibetan, sanskrit), each with a `manifest.yaml` declaring the full schema (`tradition`, `label`, `book_order`, `approval_block`, `font_stack`, `rtl`, `numbering`, `script`, `status`).
- `templates/platforms/` is a brand-new directory hosting 8 platform subdirectories (kdp, ingram, d2d, apple, kobo, google, bn, smashwords), each with a `manifest.yaml` declaring the full schema (`platform`, `label`, `trim_sizes`, `max_pages`, `epub_variant`, `metadata_shape`, `formats_accepted`, `status`).
- Both families have a `README.md` at the directory root documenting the drop-in contribution convention and the placeholder-to-active lifecycle.
- All 18 manifests ship with `status: placeholder` and all schema fields set to `null` (except `tradition`/`platform`, `label`, and `status`) - ready for Plan 03's validator to target a stable shape.
- Legacy sacred-scaffold files (COSMOLOGY.md, DOCTRINES.md, FIGURES.md, FRAMEWORK.md, LINEAGES.md, THEOLOGICAL-ARC.md) were preserved untouched; the README explicitly documents their distinct role.

## Task Commits

Each task was committed atomically:

1. **Task 1: Seed 10 sacred tradition placeholder manifests + README** - `2cd4316` (feat)
2. **Task 2: Seed 8 publishing platform placeholder manifests + README** - `fb5e9f7` (feat)

## Schema Shape Reference

### Sacred tradition manifest (`templates/sacred/<slug>/manifest.yaml`)

```yaml
tradition: <slug>            # e.g. catholic, islamic-hafs
label: "<Human-readable>"    # e.g. "Roman Catholic", "Islamic (Hafs ʿan ʿĀsim)"
book_order: null             # populated Phase 33 - canonical book list
approval_block: null         # populated Phase 33 - imprimatur/mushaf_cert/etc.
font_stack: null             # populated Phase 33 - font fallback list
rtl: null                    # populated Phase 33 - boolean
numbering: null              # populated Phase 33 - verse numbering macro id
script: null                 # populated Phase 33 - script/unicode range
status: placeholder          # flipped to "active" by Phase 33
```

### Platform manifest (`templates/platforms/<slug>/manifest.yaml`)

```yaml
platform: <slug>             # e.g. kdp, ingram, smashwords
label: "<Human-readable>"    # e.g. "Amazon KDP", "IngramSpark"
trim_sizes: null             # populated Phase 32 - supported trim size list
max_pages: null              # populated Phase 32 - int or per-binding object
epub_variant: null           # populated Phase 32 - "reflowable"/"fixed-layout"/list
metadata_shape: null         # populated Phase 32 - required metadata fields
formats_accepted: null       # populated Phase 32 - format list (epub/pdf/docx)
status: placeholder          # flipped to "active" by Phase 32
```

## Files Created/Modified

**Sacred (11 files):**

- `templates/sacred/catholic/manifest.yaml` - Roman Catholic placeholder
- `templates/sacred/orthodox/manifest.yaml` - Eastern Orthodox placeholder
- `templates/sacred/tewahedo/manifest.yaml` - Ethiopian Orthodox Tewahedo placeholder
- `templates/sacred/protestant/manifest.yaml` - Protestant placeholder
- `templates/sacred/jewish/manifest.yaml` - Jewish (Tanakh) placeholder
- `templates/sacred/islamic-hafs/manifest.yaml` - Islamic (Hafs ʿan ʿĀsim) placeholder
- `templates/sacred/islamic-warsh/manifest.yaml` - Islamic (Warsh ʿan Nāfiʿ) placeholder
- `templates/sacred/pali/manifest.yaml` - Buddhist (Pali Canon) placeholder
- `templates/sacred/tibetan/manifest.yaml` - Buddhist (Tibetan Canon) placeholder
- `templates/sacred/sanskrit/manifest.yaml` - Hindu (Sanskrit/Devanagari) placeholder
- `templates/sacred/README.md` - drop-in contribution guide, preserves legacy-file note

**Platforms (9 files):**

- `templates/platforms/kdp/manifest.yaml` - Amazon KDP placeholder
- `templates/platforms/ingram/manifest.yaml` - IngramSpark placeholder
- `templates/platforms/d2d/manifest.yaml` - Draft2Digital placeholder
- `templates/platforms/apple/manifest.yaml` - Apple Books placeholder
- `templates/platforms/kobo/manifest.yaml` - Kobo Writing Life placeholder
- `templates/platforms/google/manifest.yaml` - Google Play Books placeholder
- `templates/platforms/bn/manifest.yaml` - Barnes & Noble Press placeholder
- `templates/platforms/smashwords/manifest.yaml` - Smashwords placeholder
- `templates/platforms/README.md` - drop-in contribution guide

## Downstream Phase Hand-offs

- **Phase 29 Plan 03 (validator):** The validator can now be written against `templates/sacred/[a-z-]+/manifest\.yaml` and `templates/platforms/[a-z-]+/manifest\.yaml` patterns. All 18 files exist with stable key shape; validator only needs to assert presence/types, not invent schema.
- **Phase 32 (Build Pipelines & Platform Awareness):** Populates `trim_sizes`, `max_pages`, `epub_variant`, `metadata_shape`, `formats_accepted` for each platform manifest and flips `status` to `active`.
- **Phase 33 (Sacred Tradition Profiles):** Populates `book_order`, `approval_block`, `font_stack`, `rtl`, `numbering`, `script` for each tradition manifest and flips `status` to `active`.

## Decisions Made

- Preserved 6 pre-existing `templates/sacred/*.md` scaffold files untouched; documented their distinct role in the README so future contributors do not mistake them for tradition-profile artifacts.
- Used `null` rather than empty strings/objects for placeholder values so Phase 32/33 populators and the Plan 03 validator can unambiguously distinguish "not yet populated" from "intentionally empty."
- Kept every manifest's schema identical across its family (10 sacred / 8 platform) so a validator can treat the family as a uniform shape.

## Deviations from Plan

None - plan executed exactly as written. All 20 files created with the exact content specified in the plan's action steps. Zero new dependencies, zero installer changes, zero legacy-file modifications.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Extension points ARCH-01 and ARCH-02 are live. Plan 02 (spec keys) and Plan 03 (validator) can reference these directories directly.
- A contributor can now drop `templates/sacred/zoroastrian/manifest.yaml` or `templates/platforms/lulu/manifest.yaml` with no core edits; Plan 03 will confirm validator coverage.
- Phases 32 and 33 have stable schema to populate against.

## Self-Check: PASSED

All 20 files verified to exist on disk. Both task commits (`2cd4316`, `fb5e9f7`) verified in `git log`. Zero missing artifacts.

---
*Phase: 29-architectural-foundation*
*Completed: 2026-04-17*
