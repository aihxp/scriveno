---
phase: 32-build-pipelines-platform-awareness
verified: 2026-04-17T00:00:00Z
status: human_needed
score: 5/5
overrides_applied: 0
human_verification:
  - test: "Run /scr:build-ebook on a manuscript that contains images and verify the EPUB produced opens in an EPUB reader, contains a semantic nav, and passes EPUBCheck"
    expected: "EPUB validates against EPUBCheck with zero errors; lang tag present; images have alt text; semantic nav (epub:type=toc) present"
    why_human: "EPUBCheck validation requires the tool to be installed and an actual Pandoc invocation on real manuscript content - cannot verify programmatically that the EPUB output is structurally valid without running the build"
  - test: "Run /scr:build-print --platform kdp on a manuscript and verify the PDF opens correctly at the expected trim size"
    expected: "PDF produced at the selected trim dimensions (e.g. 6x9) with Typst-rendered typography; file at .manuscript/output/print-kdp.pdf"
    why_human: "Actual Pandoc + Typst invocation required to confirm PDF output is correct - cannot verify without a running build"
---

# Phase 32: Build Pipelines & Platform Awareness Verification Report

**Phase Goal:** Writers can produce EPUB and print-ready PDF output from the current manuscript for a selected publishing platform, with guardrails that warn before they build something the platform will reject
**Verified:** 2026-04-17T00:00:00Z
**Status:** human_needed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A writer runs `/scr:build-ebook` and gets an EPUB that passes EPUBCheck and includes alt text, `lang` tags, and semantic nav per EU EAA requirements | ? HUMAN NEEDED | `build-ebook.md` contains alt text pre-check, `-V lang={language}`, `epub:type="toc"` via `--toc` flag (lines 228-254). Structural scaffolding verified. Actual EPUB output validation requires human test. |
| 2 | A writer runs `/scr:build-print --platform kdp` (or ingram / d2d / apple / kobo / google / bn) and gets a PDF produced through Pandoc + Typst, with platform-correct trim size, margins, and metadata | ? HUMAN NEEDED | `build-print.md` contains manifest lookup (line 223), Pandoc `--pdf-engine=typst` invocation (lines 324-337) with `{width_in}in` / `{height_in}in` variables sourced from the manifest. KDP manifest has correct trim dimensions. EPUB-only platform redirect verified at line 214. Actual PDF output requires human test. |
| 3 | A writer missing Pandoc, Typst, or Ghostscript sees an install-guidance message before the build attempts to run, not a cryptic downstream failure | VERIFIED | `build-ebook.md` line 131: `command -v pandoc >/dev/null 2>&1` with install guidance. `build-print.md` lines 135, 155, 175: `command -v pandoc`, `command -v typst`, `command -v gs` (conditional on `--platform ingram`) each with multi-platform install hints. Test suite BUILD-04 confirms all patterns (90/90 GREEN). |
| 4 | A writer whose manuscript word count projects to 900 pages on 6×9 sees a warning that it exceeds KDP paperback (828pp) and is offered IngramSpark (1200pp) as a viable path | VERIFIED | `build-print.md` line 258: `WARNING Estimated {estimated_pages} pages at {trim} ({PLATFORM} paperback limit: {MAX}pp). Consider IngramSpark (1200pp). Building anyway...`. KDP manifest `max_pages.paperback: 828`. Ingram manifest `max_pages.paperback: 1200`. `--strict` hard block also present (line 260). Test suite PLATFORM-02 confirms (90/90 GREEN). |
| 5 | A writer selecting an unsupported trim size for their chosen platform is rejected with a clear error and the list of trim sizes that platform accepts | VERIFIED | `build-print.md` line 234: `> **Trim size "{size}" is not supported for {PLATFORM}.** > Supported trim sizes for {PLATFORM}: {list all keys from manifest.trim_sizes}`. All 8 manifests have either `trim_sizes` populated (KDP/Ingram) or `null` (EPUB-only, rejected before trim access). Test suite PLATFORM-03 confirms (90/90 GREEN). |

**Score:** 5/5 truths verified (3 VERIFIED, 2 require human confirmation of actual output quality)

### Deferred Items

None - all must-haves are within Phase 32 scope and have been implemented or queued for human verification.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `test/phase32-build-pipelines-platform-awareness.test.js` | RED-state regression suite, 8 describe blocks | VERIFIED | 90 tests across BUILD-01..BUILD-05, PLATFORM-01..PLATFORM-03; all 90 pass GREEN after Waves 2+3 |
| `commands/scr/build-ebook.md` | EPUB build pipeline command | VERIFIED | 270 lines; STEP 1.5, STEP 1.6, STEP 2 (Pandoc), STEP 3 (assemble), STEP 4 (EPUB + EAA), STEP 5 (report) all present |
| `commands/scr/build-print.md` | Print-ready PDF build pipeline command | VERIFIED | 365 lines; STEP 1.5, STEP 1.6, STEP 2 (Pandoc+Typst+conditional Ghostscript), STEP 2.5 (platform/trim/page-count), STEP 3, STEP 4 (Pandoc PDF), STEP 5 all present |
| `templates/platforms/kdp/manifest.yaml` | KDP trim sizes (5), wpp densities, page limits (paperback 828, hardcover 550) | VERIFIED | 5 trim sizes, wpp 220/230/235/250/300, max_pages paperback:828 hardcover:550, status:active |
| `templates/platforms/ingram/manifest.yaml` | IngramSpark trim sizes (5), wpp densities, page limit (paperback 1200) | VERIFIED | 5 trim sizes, same wpp values, max_pages paperback:1200 only, status:active |
| `templates/platforms/apple/manifest.yaml` | Apple Books EPUB-only profile | VERIFIED | status:active, trim_sizes:null, max_pages:null, formats_accepted:[epub] |
| `templates/platforms/bn/manifest.yaml` | B&N Press EPUB-only profile | VERIFIED | status:active, trim_sizes:null, max_pages:null, formats_accepted:[epub] |
| `templates/platforms/d2d/manifest.yaml` | Draft2Digital EPUB-only profile | VERIFIED | status:active, trim_sizes:null, max_pages:null, formats_accepted:[epub] |
| `templates/platforms/kobo/manifest.yaml` | Kobo Writing Life EPUB-only profile | VERIFIED | status:active, trim_sizes:null, max_pages:null, formats_accepted:[epub] |
| `templates/platforms/google/manifest.yaml` | Google Play Books EPUB-only profile | VERIFIED | status:active, trim_sizes:null, max_pages:null, formats_accepted:[epub] |
| `templates/platforms/smashwords/manifest.yaml` | Smashwords EPUB-only profile | VERIFIED | status:active, trim_sizes:null, max_pages:null, formats_accepted:[epub], Nuclear Option compliance note present |
| `data/CONSTRAINTS.json` | build_ebook and build_print exports entries + commands section entries | VERIFIED | exports.build_ebook.available=["prose","visual","poetry","interactive","sacred"], exports.build_print.available=["prose","visual","poetry","sacred"], commands.build-ebook and commands.build-print both present with category:publishing |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `test/phase32-build-pipelines-platform-awareness.test.js` | `commands/scr/build-ebook.md` | `fs.existsSync + readFile content assertions` | WIRED | BUILD_EBOOK_PATH constant used in 8 BUILD-01/03/04/05 describe tests; all pass |
| `test/phase32-build-pipelines-platform-awareness.test.js` | `commands/scr/build-print.md` | `fs.existsSync + readFile content assertions` | WIRED | BUILD_PRINT_PATH constant used in BUILD-02/03/04/PLATFORM-01/02 tests; all pass |
| `test/phase32-build-pipelines-platform-awareness.test.js` | `templates/platforms/*/manifest.yaml` | `readFile content assertions for status: active` | WIRED | PLATFORMS_DIR loop over all 8 slugs; all show status:active |
| `test/phase32-build-pipelines-platform-awareness.test.js` | `data/CONSTRAINTS.json` | `JSON.parse + property access for build_ebook/build_print` | WIRED | CONSTRAINTS_PATH used in BUILD-01/02; exports.build_ebook and exports.build_print confirmed |
| `commands/scr/build-ebook.md` | `.manuscript/output/ebook.epub` | `pandoc invocation in STEP 4` | WIRED | Line 239: `-o .manuscript/output/ebook.epub` |
| `commands/scr/build-print.md` | `templates/platforms/kdp/manifest.yaml` | `STEP 2.5 reads manifest.trim_sizes and manifest.max_pages at runtime` | WIRED | Line 223: `Load templates/platforms/{platform}/manifest.yaml`; lines 248, 320-321 use trim_sizes values |
| `commands/scr/build-ebook.md` | `data/CONSTRAINTS.json` | `STEP 1 checks exports.build_ebook.available for work type group` | WIRED | Lines 33-38: explicit lookup of `build_ebook` in CONSTRAINTS.json exports section |
| `commands/scr/build-print.md` | `data/CONSTRAINTS.json` | `STEP 1 checks exports.build_print.available for work type group` | WIRED | Lines 37-42: explicit lookup of `build_print` in CONSTRAINTS.json exports section |

### Data-Flow Trace (Level 4)

These are agent instruction files (markdown), not code that renders dynamic data. Data flow is runtime-verbal: the agent reads files and follows instructions. The key data flows are:

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|-------------------|--------|
| `build-ebook.md` STEP 1 | `build_ebook.available` | `data/CONSTRAINTS.json` | Yes - array `["prose","visual","poetry","interactive","sacred"]` | FLOWING |
| `build-print.md` STEP 2.5 | `manifest.trim_sizes[trim].wpp` | `templates/platforms/kdp/manifest.yaml` | Yes - wpp: 220/230/235/250/300 present | FLOWING |
| `build-print.md` STEP 2.5 | `manifest.max_pages.paperback` | `templates/platforms/kdp/manifest.yaml` | Yes - paperback: 828 present | FLOWING |
| `build-print.md` STEP 2.5 | `manifest.max_pages.paperback` | `templates/platforms/ingram/manifest.yaml` | Yes - paperback: 1200 present | FLOWING |

### Behavioral Spot-Checks

These are markdown instruction files, not runnable Node modules. The test suite serves as the behavioral verification layer.

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full Phase 32 test suite (90 tests) | `node --test test/phase32-build-pipelines-platform-awareness.test.js` | 90 pass, 0 fail | PASS |
| Full regression suite (1266 tests) | `npm test` | 1266 pass, 0 fail | PASS |
| Git commits documented in SUMMARYs | `git log --oneline grep 362c324 1aa08ae 40fcb66 dc1e988 4c924d9` | All 5 commits found | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| BUILD-01 | 32-01, 32-02 | Writer can run `/scr:build-ebook` to produce an EPUB via Pandoc | SATISFIED | `commands/scr/build-ebook.md` exists; STEP 4b Pandoc invocation produces `ebook.epub`; BUILD-01 tests pass |
| BUILD-02 | 32-01, 32-02 | Writer can run `/scr:build-print` to produce print-ready PDF via Pandoc + Typst | SATISFIED | `commands/scr/build-print.md` exists; STEP 4 uses `--pdf-engine=typst`; BUILD-02 tests pass |
| BUILD-03 | 32-01, 32-02 | Both commands accept `--platform` flag; build-print also accepts `--trim` | SATISFIED | `argument-hint` in both frontmatters confirmed; `--platform`, `--trim`, `--strict` present; BUILD-03 tests pass |
| BUILD-04 | 32-01, 32-02 | Build commands detect missing Pandoc/Typst/Ghostscript before failing | SATISFIED | `command -v pandoc`, `command -v typst`, `command -v gs` checks with multi-platform install hints in both files; BUILD-04 tests pass |
| BUILD-05 | 32-01, 32-02 | `/scr:build-ebook` output embeds alt text, `lang` tags, and semantic nav per EAA | SATISFIED (human confirmation needed for output) | Structural implementation verified: alt text pre-check (line 232), `-V lang={language}` (line 246), `epub:type="toc"` note (line 254); actual EPUB output requires human test |
| PLATFORM-01 | 32-01, 32-02, 32-03 | Writer can query estimated page count using per-trim-size density tables | SATISFIED | KDP and Ingram manifests have wpp values for all 5 trim sizes; build-print.md STEP 2.5 uses `word_count / manifest.trim_sizes[trim].wpp`; PLATFORM-01 tests pass |
| PLATFORM-02 | 32-01, 32-02, 32-03 | Build commands warn when estimated page count exceeds platform limits | SATISFIED | Warning format with "Estimated" + "pages" + "Building anyway..." at line 258; `--strict` hard block at line 261; KDP max_pages.paperback:828; Ingram max_pages.paperback:1200; PLATFORM-02 tests pass |
| PLATFORM-03 | 32-01, 32-02, 32-03 | Build commands accept only trim sizes supported by selected platform | SATISFIED | Trim size validation with `Trim size "{size}" is not supported` rejection at line 234; all 8 manifests active; EPUB-only platforms have trim_sizes:null; PLATFORM-03 tests pass |

All 8 requirement IDs satisfied. No orphaned requirements detected (REQUIREMENTS.md maps all 8 to Phase 32).

### Anti-Patterns Found

No blockers or warnings found.

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `build-ebook.md` | 54 | "placeholder" - domain vocabulary (writer content placeholder, not code stub) | Info | None - legitimate instruction text describing `{{VAR}}` tokens |
| `build-ebook.md` | 232 | "placeholder" - alt text default value pattern | Info | None - instruction to add `![Illustration: [describe the image]]` placeholder for missing alt text is the correct EAA behavior |

### Human Verification Required

#### 1. EPUB Output Quality (EPUBCheck)

**Test:** Run `/scr:build-ebook` on a manuscript project that includes at least one image (to exercise the alt text pre-check). Check the resulting `.manuscript/output/ebook.epub` with EPUBCheck.
**Expected:** Zero EPUBCheck errors; `lang` attribute present on the root element; a semantic nav document (`epub:type="toc"`) present; all images have alt text (or a placeholder was injected for any missing alt text).
**Why human:** EPUBCheck requires the tool to be installed separately, an actual Pandoc invocation on real manuscript content, and reading the EPUB's OPF/content files to confirm accessibility attributes. This cannot be verified by static analysis of the instruction file.

#### 2. Print PDF Trim Size Accuracy

**Test:** Run `/scr:build-print --platform kdp --trim 6x9` on a manuscript project and open the resulting `.manuscript/output/print-kdp.pdf`.
**Expected:** PDF dimensions 6×9 inches (from KDP manifest `width_in: 6`, `height_in: 9`); Typst-rendered typography with correct margins; file exists at reported path.
**Why human:** Actual Pandoc + Typst invocation required to verify PDF dimensions and rendering quality - cannot verify without running the build against real content.

### Gaps Summary

No gaps found. All 8 requirement IDs (BUILD-01..BUILD-05, PLATFORM-01..PLATFORM-03) have verified implementations in the codebase. The two human verification items relate to output quality (EPUB validity, PDF dimensions) and require actual build execution - they are not missing implementations.

---

_Verified: 2026-04-17T00:00:00Z_
_Verifier: Claude (gsd-verifier)_
