---
phase: 32-build-pipelines-platform-awareness
plan: "03"
subsystem: platform-manifests
tags: [platform-manifests, kdp, ingram, epub, constraints, platform-awareness]

requires:
  - phase: 32-build-pipelines-platform-awareness
    plan: "01"
    provides: "RED-state test suite asserting manifest shape and CONSTRAINTS.json exports"
  - phase: 32-build-pipelines-platform-awareness
    plan: "02"
    provides: "build-ebook.md and build-print.md command files that read manifests at runtime"

provides:
  - "8 populated platform manifests (status: active, real content)"
  - "KDP manifest: 5 trim sizes with wpp densities (220/230/235/250/300), max_pages paperback 828 hardcover 550"
  - "IngramSpark manifest: 5 trim sizes same wpp values, max_pages paperback 1200 only"
  - "6 EPUB-only manifests: trim_sizes null, max_pages null, formats_accepted epub only"
  - "CONSTRAINTS.json exports section: build_ebook and build_print entries (already present from Wave 2)"
  - "CONSTRAINTS.json commands section: build-ebook and build-print entries (auto-fix for constraints.test.js)"

affects:
  - commands/scr/build-ebook.md
  - commands/scr/build-print.md
  - lib/architectural-profiles.js

tech-stack:
  added: []
  patterns:
    - "Platform manifest YAML: status active, formats_accepted list, trim_sizes map with wpp density, max_pages map, epub_variant, epub_notes, metadata_shape"
    - "EPUB-only manifest pattern: trim_sizes null, default_trim null, max_pages null - signals to build-print.md to reject these platforms before any null access"
    - "CONSTRAINTS.json commands section: every command file on disk must have a corresponding entry (enforced by constraints.test.js)"

key-files:
  created: []
  modified:
    - templates/platforms/kdp/manifest.yaml
    - templates/platforms/ingram/manifest.yaml
    - templates/platforms/apple/manifest.yaml
    - templates/platforms/bn/manifest.yaml
    - templates/platforms/d2d/manifest.yaml
    - templates/platforms/kobo/manifest.yaml
    - templates/platforms/google/manifest.yaml
    - templates/platforms/smashwords/manifest.yaml
    - data/CONSTRAINTS.json

key-decisions:
  - "CONSTRAINTS.json commands section required build-ebook and build-print entries - constraints.test.js enforces that every .md in commands/scr/ has a commands entry (Rule 2 auto-fix)"
  - "EPUB-only manifests retain trim_sizes null and max_pages null exactly as specified - build-print.md STEP 2.5 checks formats_accepted before reading trim_sizes so null is never accessed"
  - "Smashwords Nuclear Option compliance note added as epub_notes YAML block scalar"

requirements-completed:
  - PLATFORM-01
  - PLATFORM-02
  - PLATFORM-03

duration: 3min
completed: 2026-04-17
---

# Phase 32 Plan 03: Platform Awareness - Manifests and Constraints Summary

**8 platform manifests populated (status active, real content) and CONSTRAINTS.json commands section extended to register build-ebook and build-print, turning the Phase 32 test suite fully GREEN (90/90) with no regressions (1266/1266)**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-17
- **Completed:** 2026-04-17
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Replaced all 8 placeholder manifests (`status: placeholder`, all-null fields) with real populated content
- KDP manifest: 5 trim sizes (5x8, 5.25x8, 5.5x8.5, 6x9, 7x10) with wpp densities (220/230/235/250/300), max_pages paperback 828 hardcover 550, epub_variant epub3, formats_accepted [epub, pdf_print_ready], default_trim 6x9, metadata_shape
- IngramSpark manifest: same 5 trim sizes and wpp values, max_pages paperback 1200 (no hardcover), PDF/X-1a requirement note, epub_variant epub3, formats_accepted [epub, pdf_print_ready]
- 6 EPUB-only manifests (Apple, B&N, D2D, Kobo, Google Play, Smashwords): trim_sizes null, default_trim null, max_pages null, formats_accepted [epub], epub3, platform-specific epub_notes
- Smashwords manifest includes Nuclear Option compliance note as epub_notes block scalar
- CONSTRAINTS.json exports section already had build_ebook and build_print entries (added in Wave 2, plan 32-02)
- CONSTRAINTS.json commands section: added build-ebook and build-print entries (Rule 2 auto-fix - constraints.test.js requires all command files registered)
- Phase 32 test suite: 90/90 GREEN; full npm test suite: 1266/1266 GREEN

## Task Commits

1. **Task 1: Populate KDP and IngramSpark manifests** - `dc1e988` (feat)
2. **Task 2: Populate 6 EPUB-only manifests + CONSTRAINTS.json commands registration** - `4c924d9` (feat)

## Files Created/Modified

- `templates/platforms/kdp/manifest.yaml` - KDP trim sizes, wpp densities, page limits, epub variant
- `templates/platforms/ingram/manifest.yaml` - IngramSpark trim sizes, wpp densities, paperback page limit, PDF/X-1a note
- `templates/platforms/apple/manifest.yaml` - Apple Books EPUB-only profile, epub:type semantic markup note
- `templates/platforms/bn/manifest.yaml` - B&N Press EPUB-only profile, NCX nav note
- `templates/platforms/d2d/manifest.yaml` - Draft2Digital EPUB-only profile, D2D validator note
- `templates/platforms/kobo/manifest.yaml` - Kobo Writing Life EPUB-only profile
- `templates/platforms/google/manifest.yaml` - Google Play Books EPUB-only profile
- `templates/platforms/smashwords/manifest.yaml` - Smashwords EPUB-only profile with Nuclear Option compliance note
- `data/CONSTRAINTS.json` - build-ebook and build-print added to commands section

## Decisions Made

- EPUB-only platforms keep trim_sizes: null and max_pages: null exactly as specified - this signals build-print.md to reject these platforms at STEP 2.5 before any null property access (T-32-03-04 mitigation confirmed)
- CONSTRAINTS.json commands section required new entries for build-ebook and build-print to satisfy constraints.test.js (which enforces that every .md in commands/scr/ has a corresponding commands entry) - added as a Rule 2 auto-fix alongside the exports entries
- Smashwords epub_notes uses YAML block scalar (>) to accommodate the multi-sentence Nuclear Option compliance guidance without escaping

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Add build-ebook and build-print to CONSTRAINTS.json commands section**
- **Found during:** Task 2 verification (`npm test`)
- **Issue:** `constraints.test.js` line 72 enforces that every `.md` file in `commands/scr/` has an entry in `CONSTRAINTS.json`'s `commands` section. `build-ebook.md` and `build-print.md` exist (added in Wave 2) but only had entries in the `exports` section, not the `commands` section, causing `test/constraints.test.js` to fail.
- **Fix:** Added `"build-ebook"` and `"build-print"` entries to `constraints.commands` with category `publishing`, correct `available` arrays matching the exports entries, and `requires: ["complete-draft"]` consistent with other publishing commands.
- **Files modified:** `data/CONSTRAINTS.json`
- **Commit:** `4c924d9`

## Known Stubs

None - all 8 manifests are fully populated with real content. No placeholder values remain.

## Threat Flags

None - no new network endpoints, auth paths, or trust boundary changes introduced. JSON validity verified before commit (T-32-03-01 mitigated). EPUB-only null trim_sizes protected by formats_accepted check in build-print.md (T-32-03-04 mitigated).

---
*Phase: 32-build-pipelines-platform-awareness*
*Completed: 2026-04-17*

## Self-Check: PASSED

- `templates/platforms/kdp/manifest.yaml` exists: FOUND
- `templates/platforms/ingram/manifest.yaml` exists: FOUND
- `templates/platforms/apple/manifest.yaml` exists: FOUND
- `templates/platforms/bn/manifest.yaml` exists: FOUND
- `templates/platforms/d2d/manifest.yaml` exists: FOUND
- `templates/platforms/kobo/manifest.yaml` exists: FOUND
- `templates/platforms/google/manifest.yaml` exists: FOUND
- `templates/platforms/smashwords/manifest.yaml` exists: FOUND
- `.planning/phases/32-build-pipelines-platform-awareness/32-03-SUMMARY.md` exists: FOUND
- Commit `dc1e988` exists: FOUND
- Commit `4c924d9` exists: FOUND
- Phase 32 test suite: 90/90 GREEN
- npm test: 1266/1266 GREEN (no regressions)
