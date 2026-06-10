---
phase: 44-build-integration-and-validation
reviewed: 2026-04-18T07:14:19Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - commands/scr/build-ebook.md
  - commands/scr/build-print.md
  - commands/scr/export.md
  - commands/scr/publish.md
  - docs/command-reference.md
  - docs/shipped-assets.md
  - test/phase44-build-integration-validation.test.js
findings:
  critical: 0
  warning: 5
  info: 0
  total: 5
status: issues_found
---

# Phase 44: Code Review Report

**Reviewed:** 2026-04-18T07:14:19Z
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

I reviewed the phase 44 build/export/publish command surface, the trust-facing docs, and the added regression test. No security issues stood out, but there are several warning-level trust and behavior problems: the command reference still documents the wrong export interface, the academic publish presets route to non-academic builders, the shipped-assets inventory no longer matches the repo, `--skip-validate` is inconsistently exposed, and the new test coverage is too narrow to catch any of those regressions.

## Warnings

### WR-01: Command Reference Still Documents Invalid Export Flags

**File:** `/Users/hprincivil/Projects/scriveno/docs/command-reference.md:1285-1288`
**Issue:** The reference tells writers to use `/scr:export --format kdp|ingram|submission|query` and says `--print-ready` adds "bleeds and crop marks". The actual command accepts `kdp-package`, `ingram-package`, `submission-package`, and `query-package` (`/Users/hprincivil/Projects/scriveno/commands/scr/export.md:37-42`, `/Users/hprincivil/Projects/scriveno/commands/scr/export.md:72-75`), and the print-ready path only builds an interior PDF with the book template and trim/margin variables (`/Users/hprincivil/Projects/scriveno/commands/scr/export.md:370-392`). As written, the canonical reference will drive users to failing invocations and overstate what the output contains.
**Fix:** Update the `--format` flag list to the real values and describe `--print-ready` as interior print PDF output only. Add regression assertions for the exact package ids and print-ready wording.

### WR-02: Academic Publish Presets Bypass the Academic Builder

**File:** `/Users/hprincivil/Projects/scriveno/commands/scr/publish.md:179-180`
**Issue:** The wizard offers `academic-submission` and `thesis-defense`, but the preset pipelines call generic export routes instead of the academic path in `/scr:build-print`. `academic-submission` runs `/scr:export --format latex` and `/scr:export --format pdf`, while `thesis-defense` runs `/scr:export --format pdf --print-ready` (`/Users/hprincivil/Projects/scriveno/commands/scr/publish.md:247-259`). Those exports use the generic academic template or even the 6x9 book-print template (`/Users/hprincivil/Projects/scriveno/commands/scr/export.md:370-392`, `/Users/hprincivil/Projects/scriveno/commands/scr/export.md:508-544`) rather than the publisher-wrapper flow described in `/Users/hprincivil/Projects/scriveno/commands/scr/build-print.md:174-215`. Users selecting an academic preset cannot get IEEE/ACM/LNCS/Elsevier/APA7-ready output from the advertised path.
**Fix:** Make the preset ask for a target academic platform and route through `/scr:build-print --platform <ieee|acm|lncs|elsevier|apa7>`. If thesis PDFs need a separate path, define one explicitly instead of reusing the trade-book print export.

### WR-03: Canonical Shipped-Assets Inventory Is Out of Date

**File:** `/Users/hprincivil/Projects/scriveno/docs/shipped-assets.md:5-20`
**Issue:** This doc says the only shipped export templates are `scriveno-book.typst`, `scriveno-epub.css`, and `scriveno-academic.latex`, but the repo currently bundles additional templates such as `scriveno-fixed-layout-epub.css`, `scriveno-fixed-layout.opf`, `scriveno-stageplay.typst`, `scriveno-picturebook.typst`, `scriveno-chapbook.typst`, and the publisher wrappers under `data/export-templates/`. Because this file is explicitly framed as the "canonical inventory", it now understates the actual shipped surface and contradicts the reviewed command files.
**Fix:** Regenerate this section from `data/export-templates/` or manually list the full shipped set. Keep the "not shipped today" notes only for assets that are genuinely absent.

### WR-04: `--skip-validate` Exists in Logic but Not in the Public Surface

**File:** `/Users/hprincivil/Projects/scriveno/commands/scr/export.md:1-14`
**Issue:** Both `export` and `publish` branch on `--skip-validate` (`/Users/hprincivil/Projects/scriveno/commands/scr/export.md:98-103`, `/Users/hprincivil/Projects/scriveno/commands/scr/publish.md:48-53`), but `export` does not advertise that flag in its `argument-hint` or usage block, and `publish` omits it from both `argument-hint` and usage (`/Users/hprincivil/Projects/scriveno/commands/scr/publish.md:1-18`). The command reference also omits any `--skip-validate` support for these commands (`/Users/hprincivil/Projects/scriveno/docs/command-reference.md:1259-1265`, `/Users/hprincivil/Projects/scriveno/docs/command-reference.md:1281-1288`). If argument parsing follows the declared surface, this branch is unreachable; otherwise it is undocumented and inconsistent with the build commands.
**Fix:** Either add `--skip-validate` to the public interface everywhere it is supported, or remove the dead conditional from `export` and `publish`.

### WR-05: Phase 44 Test Coverage Misses the Regressions Above

**File:** `/Users/hprincivil/Projects/scriveno/test/phase44-build-integration-validation.test.js:12-50`
**Issue:** The new test only loads `build-ebook`, `build-print`, `export`, `command-reference`, and `shipped-assets`, and it only asserts cover-path language plus a couple of cover-template phrases. It never reads `publish.md`, never validates the actual `--format` ids documented in `command-reference.md`, and never compares `docs/shipped-assets.md` against the real `data/export-templates/` directory. That is why the stale academic preset routing and stale canonical inventory pass unchanged.
**Fix:** Extend the test to load `publish.md`, assert the exact export format ids exposed in the reference, and compare the shipped-assets inventory against the actual template filenames that are bundled in `data/export-templates/`.

---

_Reviewed: 2026-04-18T07:14:19Z_
_Reviewer: Claude (code reviewer)_
_Depth: standard_
