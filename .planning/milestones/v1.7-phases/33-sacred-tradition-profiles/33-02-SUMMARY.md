---
phase: 33-sacred-tradition-profiles
plan: 02
subsystem: content-data
tags: [sacred, yaml, manifests, tradition-profiles, rtl, font-stack, book-order, approval-block]

# Dependency graph
requires:
  - phase: 29-architectural-validation
    provides: placeholder manifest files with null fields for all 10 traditions
  - phase: 33-sacred-tradition-profiles
    plan: 01
    provides: Phase 33 regression test suite (TRAD-01..TRAD-05 in RED state)
provides:
  - 10 fully populated sacred tradition manifest.yaml files with status: active
  - Authoritative font_stack, rtl, book_order, approval_block, numbering, script data for all traditions
  - TRAD-01, TRAD-02, TRAD-03, TRAD-04 tests now GREEN
affects:
  - 33-03 (STEP 1.7 tradition loading reads these manifests)
  - 33-04 (verse numbering command reads numbering.format from these manifests)
  - build-ebook, build-print (STEP 1.7 will load these manifests by tradition slug)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tradition manifest YAML shape: tradition, label, status, book_order, approval_block, font_stack, rtl, numbering, script"
    - "Noto family font-first stack: tradition-specific Noto font + serif fallback"
    - "RTL flag: true only for arabic-script (islamic-hafs, islamic-warsh) and hebrew-script (jewish)"
    - "book_order: null for open-canon traditions (pali, sanskrit, tibetan); canonical array for fixed-order traditions"
    - "approval_block.required: true for ecclesiastically governed traditions; false for open traditions"

key-files:
  created: []
  modified:
    - templates/sacred/catholic/manifest.yaml
    - templates/sacred/orthodox/manifest.yaml
    - templates/sacred/protestant/manifest.yaml
    - templates/sacred/pali/manifest.yaml
    - templates/sacred/jewish/manifest.yaml
    - templates/sacred/islamic-hafs/manifest.yaml
    - templates/sacred/islamic-warsh/manifest.yaml
    - templates/sacred/tewahedo/manifest.yaml
    - templates/sacred/tibetan/manifest.yaml
    - templates/sacred/sanskrit/manifest.yaml

key-decisions:
  - "Hafs and Warsh share identical 114-surah book_order - recitation differences are not canonical ordering differences"
  - "Jewish manifest uses unified Samuel/Kings/Chronicles entries matching Tanakh TNK division (not split like Christian canons)"
  - "Tewahedo book_order lists 81 books including Jubilees, Enoch, and Ge'ez deuterocanon unique to Ethiopian Orthodox"
  - "Protestant uses 'Song of Solomon' (KJV name) not 'Song of Songs' (ecumenical) to match tradition convention"
  - "Pali, Sanskrit, Tibetan have book_order: null - these traditions have no universally fixed canonical sequence"
  - "approval_block.label set to 'none' (string) for traditions with no approval requirement, not null, for consistent type"

patterns-established:
  - "Manifest header comment: two tradition-specific lines + permanent DO NOT REMOVE warning"
  - "status field placed third after tradition/label - makes active/placeholder state immediately scannable"
  - "font_stack always two entries: Noto family specific font first, 'serif' generic fallback second"

requirements-completed:
  - TRAD-01
  - TRAD-02
  - TRAD-03
  - TRAD-04

# Metrics
duration: 15min
completed: 2026-04-17
---

# Phase 33 Plan 02: Sacred Tradition Profiles - Manifest Population Summary

**10 sacred tradition manifests fully populated with canonical book orders, RTL flags, Noto font stacks, and approval-block schemas replacing Phase 29 null placeholders**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-17T00:00:00Z
- **Completed:** 2026-04-17T00:15:00Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Replaced all 10 null-placeholder `manifest.yaml` files with fully populated tradition profiles
- TRAD-01 (completeness), TRAD-02 (RTL booleans), TRAD-03 (book_order null for open canons), TRAD-04 (approval_block structure) all GREEN
- TRAD-05 remains RED as expected - STEP 1.7 build command integration is Plan 33-03's scope
- Test suite: 151 pass / 7 fail (all 7 failures are expected future-plan work)
- Zero null fields remain across all 10 manifests except intentional `book_order: null` for pali/sanskrit/tibetan

## Task Commits

Each task was committed atomically:

1. **Task 1: Populate Latin-script tradition manifests (catholic, orthodox, protestant, pali)** - `b3ceb7c` (feat)
2. **Task 2: Populate RTL and non-Latin-script tradition manifests (jewish, islamic-hafs, islamic-warsh, tewahedo, tibetan, sanskrit)** - `47b126f` (feat)

## Files Created/Modified

- `templates/sacred/catholic/manifest.yaml` - 73-book deuterocanonical order, Nihil Obstat approval, Noto Serif, latin script
- `templates/sacred/orthodox/manifest.yaml` - LXX order with 4 Maccabees + Prayer of Manasseh, Patriarchal blessing, Noto Serif
- `templates/sacred/protestant/manifest.yaml` - 66-book Protestant canon (KJV names), no approval required, Noto Serif
- `templates/sacred/pali/manifest.yaml` - book_order null, nikaya:sutta numbering, no approval, Noto Serif
- `templates/sacred/jewish/manifest.yaml` - 36-entry TNK order (unified Samuel/Kings/Chronicles), Haskamah approval, Noto Serif Hebrew, rtl: true
- `templates/sacred/islamic-hafs/manifest.yaml` - 114-surah Quran order, Ijazah approval, Noto Naskh Arabic, rtl: true, surah:ayah numbering
- `templates/sacred/islamic-warsh/manifest.yaml` - Identical 114-surah order to Hafs, Ijazah approval, Noto Naskh Arabic, rtl: true
- `templates/sacred/tewahedo/manifest.yaml` - 81-book Ethiopian canon (incl. Jubilees, Enoch, Ge'ez texts), Patriarchal blessing, Noto Serif Ethiopic
- `templates/sacred/tibetan/manifest.yaml` - book_order null, no approval, Noto Serif Tibetan, tibetan script
- `templates/sacred/sanskrit/manifest.yaml` - book_order null, no approval, Noto Serif Devanagari, devanagari script

## Decisions Made

- Hafs and Warsh share identical 114-surah book_order - the two Quranic recitation traditions differ in vocalization, not canonical surah sequence
- Jewish manifest uses unified entries (Samuel, Kings, Chronicles) matching the Tanakh's undivided books, not the Christian split form
- Tewahedo 81-book list includes Jubilees, Enoch, Sinodos, Kebra Nagast, and other texts unique to the Ethiopian Orthodox canon
- `approval_block.label` is set to the string `"none"` (not null) for traditions without formal approval - keeps the type consistent across all 10 manifests
- Protestant canon uses "Song of Solomon" matching KJV tradition rather than ecumenical "Song of Songs"
- `pali`, `sanskrit`, `tibetan` receive `book_order: null` because these traditions have no universally fixed canonical sequence (collections vary by school and lineage)

## Deviations from Plan

None - plan executed exactly as written. All manifest content matches the INTERFACES data tables in the plan.

## Issues Encountered

None.

## Known Stubs

None - all 10 manifests contain real tradition data. No placeholder or TODO content remains.

## Threat Flags

None - these are static source-controlled YAML files containing only public tradition metadata (font names, book titles, approval terminology). No new network endpoints, auth paths, or trust boundaries introduced.

## Next Phase Readiness

- Plan 33-03 can now implement STEP 1.7 in build-ebook.md and build-print.md - the manifest data layer is complete
- Plan 33-04 can implement `sacred-verse-numbering.md` command reading `numbering.format` from these manifests
- All manifests accessible via `templates/sacred/{slug}/manifest.yaml` path pattern used by STEP 1.7
- TRAD-01..TRAD-04 tests provide regression coverage; any manifest corruption will immediately surface

---
*Phase: 33-sacred-tradition-profiles*
*Completed: 2026-04-17*
