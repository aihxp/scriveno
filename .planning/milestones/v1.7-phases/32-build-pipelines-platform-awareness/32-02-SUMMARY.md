---
phase: 32-build-pipelines-platform-awareness
plan: "02"
subsystem: commands
tags: [commands, epub, pdf, pandoc, typst, ghostscript, eaa-accessibility, platform-aware, build-pipeline]

requires:
  - phase: 31-staged-front-matter-generation
    provides: "STEP 1.5/1.6 gate patterns copied verbatim into both new commands"
  - phase: 32-01
    provides: "RED-state regression suite (BUILD-01..BUILD-05) this plan turns green"

provides:
  - "commands/scr/build-ebook.md - EPUB build pipeline with EAA accessibility, validate gate, scaffold exclusion"
  - "commands/scr/build-print.md - print PDF build pipeline with trim-size validation, page-count guardrail, platform-aware Pandoc+Typst invocation"
  - "data/CONSTRAINTS.json exports.build_ebook and exports.build_print constraint entries"

affects:
  - 32-03-platform-awareness

tech-stack:
  added: []
  patterns:
    - "STEP 1.5 validate gate copied verbatim from export.md, only 'Export blocked' -> 'Build blocked'"
    - "STEP 1.6 front-matter gate copied verbatim from export.md (scaffold exclusion + GENERATE auto-refresh)"
    - "Platform validation via validatePlatform() + EPUB-only platform redirect pattern"
    - "Page-count guardrail: wpp-based estimation, soft warning (Building anyway) + --strict hard block"
    - "EAA accessibility pre-check: alt text placeholder injection, lang tag assertion, epub:type semantic nav via --toc"

key-files:
  created:
    - commands/scr/build-ebook.md
    - commands/scr/build-print.md
  modified:
    - data/CONSTRAINTS.json

key-decisions:
  - "build_ebook available for prose/visual/poetry/interactive/sacred (same as epub export); build_print excludes interactive (no print output for interactive fiction)"
  - "STEP 1.5/1.6 copied verbatim from export.md to keep gate behavior identical - only 'Export blocked' -> 'Build blocked' and 'export command' -> 'build command' changed"
  - "EPUB-only platform check in STEP 2.5 redirects to /scr:build-ebook instead of erroring opaquely"
  - "IngramSpark PDF/X-1a Ghostscript command provided as a reference pattern but not auto-run (conversion is destructive; writer must verify intermediate PDF first)"

duration: ~3min
completed: 2026-04-17
---

# Phase 32 Plan 02: Build-Ebook and Build-Print Command Files Summary

**Two new build pipeline commands - EPUB with EAA accessibility (build-ebook.md) and print-ready PDF with trim-size/page-count guardrails (build-print.md) - both inheriting the STEP 1.5/1.6 gate pair from export.md**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-17
- **Completed:** 2026-04-17
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created `commands/scr/build-ebook.md` with STEP 1.5 validate gate, STEP 1.6 front-matter gate, Pandoc EPUB invocation producing `.manuscript/output/ebook.epub`, and EAA accessibility pre-check (alt text, lang tag, epub:type semantic nav)
- Created `commands/scr/build-print.md` with STEP 1.5/1.6 gates, Pandoc+Typst invocation producing `.manuscript/output/print-{platform}.pdf`, STEP 2.5 platform/trim validation, page-count guardrail (wpp-based estimate, soft warning + --strict hard block), Ghostscript check for IngramSpark
- Added `exports.build_ebook` and `exports.build_print` to `data/CONSTRAINTS.json`
- BUILD-01 through BUILD-05 tests all pass (45/45 in those suites); PLATFORM-01/02/03 remain RED (manifest content - Wave 3)

## Task Commits

1. **Task 1: Create commands/scr/build-ebook.md** - `1aa08ae` (feat)
2. **Task 2: Create commands/scr/build-print.md** - `40fcb66` (feat)

## Files Created/Modified

- `commands/scr/build-ebook.md` - EPUB build pipeline: STEP 1 (constraint check), STEP 1.5 (validate gate), STEP 1.6 (front-matter gate), STEP 2 (Pandoc check), STEP 3 (assemble), STEP 4 (EPUB + EAA accessibility), STEP 5 (report)
- `commands/scr/build-print.md` - Print PDF pipeline: STEP 1 (constraint check), STEP 1.5 (validate gate), STEP 1.6 (front-matter gate), STEP 2 (Pandoc + Typst + conditional Ghostscript), STEP 2.5 (platform/trim validation + page-count guardrail), STEP 3 (assemble), STEP 4 (Pandoc PDF with Typst), STEP 5 (report)
- `data/CONSTRAINTS.json` - Added `build_ebook` and `build_print` entries to `exports` section

## Decisions Made

- `build_print.available` is `["prose", "visual", "poetry", "sacred"]` - interactive excluded (interactive fiction has no print output)
- `build_ebook.available` is `["prose", "visual", "poetry", "interactive", "sacred"]` - same as existing `epub` export
- STEP 1.5/1.6 blocks copied verbatim from export.md (only 3 string changes: "Export blocked" -> "Build blocked", "export command" -> "build command") - ensures gate behavior is byte-for-byte identical
- EPUB-only platform check redirects explicitly to `/scr:build-ebook --platform {slug}` rather than generic error
- IngramSpark CMYK Ghostscript command is shown as a reference pattern, not auto-executed

## Deviations from Plan

None - plan executed exactly as written. `32-PATTERNS.md` referenced in `read_first` does not exist (same as Wave 1 observation), but all patterns were available in the plan's `<interfaces>` block and from reading `export.md` directly.

## Known Stubs

None - both commands are complete instruction files. No hardcoded empty values or placeholder text that flows to output.

## Threat Flags

No new network endpoints, auth paths, or trust boundary changes introduced. Both files are agent instruction markdown; the security-relevant validations (platform slug check, trim size check) are explicitly documented in STEP 2.5 per the plan's threat model (T-32-02-01, T-32-02-02).

## Next Phase Readiness

- Phase 32 Wave 3 (32-03) can now populate the 8 platform manifests (status: active, trim_sizes, wpp values, max_pages) to turn PLATFORM-01/02/03 green
- All BUILD-01..BUILD-05 tests pass; running full suite still exits with code 1 due to PLATFORM tests - expected RED state for Wave 3

---
*Phase: 32-build-pipelines-platform-awareness*
*Completed: 2026-04-17*

## Self-Check

- `commands/scr/build-ebook.md` exists: FOUND
- `commands/scr/build-print.md` exists: FOUND
- `data/CONSTRAINTS.json` has `exports.build_ebook` and `exports.build_print`: CONFIRMED
- Commit `1aa08ae` exists: FOUND
- Commit `40fcb66` exists: FOUND

## Self-Check: PASSED
