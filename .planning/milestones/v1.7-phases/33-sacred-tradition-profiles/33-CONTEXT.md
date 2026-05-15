# Phase 33: Sacred Tradition Profiles - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous run - grey areas auto-answered with user review)

<domain>
## Phase Boundary

Sacred work types adapt to the writer's tradition - not just Roman Catholic - so book order, approval blocks, fonts, script direction, and verse numbering all match the lineage.

**In scope:**
- Populate all 10 tradition manifests (`templates/sacred/*/manifest.yaml`) with real content replacing null placeholders: `book_order`, `approval_block`, `font_stack`, `rtl`, `numbering`, `script`
- Add STEP 1.7 (tradition loading) to `commands/scr/build-ebook.md` and `commands/scr/build-print.md`
- Phase 33 regression test suite (TRAD-01..TRAD-05) - TDD RED first

**Out of scope:**
- Bundling or installing fonts (user installs; zero-dependency constraint)
- Changes to how the build pipeline renders PDFs beyond loading manifest data into metadata.yaml
- New traditions beyond the 10 established in Phase 29
- Cross-domain templates (Phase 34)

</domain>

<decisions>
## Implementation Decisions

### Manifest Data Shape
- `font_stack`: Reference fonts by name for agent to use as CSS font-family / Typst `font:` parameter - user installs; fallback to generic serif. Preserves zero-dependency constraint.
- `book_order`: Array of canonical book names in tradition order (e.g. `["Genesis", "Exodus", …]`). Null for traditions with no fixed canonical order (Pali, Sanskrit, Tibetan collections vary).
- `approval_block`: Structured object - `label:` (string), `required:` (bool), `scope:` (`"work"` or `"chapter"`). Label varies by tradition: Nihil Obstat (Catholic), Ijazah (Islamic), Haskamah (Jewish), Patriarchal blessing (Orthodox/Tewahedo).
- `numbering`: Structured object - `format:` (e.g. `"chapter:verse"`, `"surah:ayah"`, `"tractate:folio"`), `separator:` (`:` or `.`).

### Tradition-Specific Content
- `approval_block.required: true` for: catholic, orthodox, islamic-hafs, islamic-warsh, jewish, tewahedo. All others: `required: false`.
- `rtl: true` for islamic-hafs, islamic-warsh, jewish (Hebrew script). All others: `rtl: false`.
- `font_stack`: Recommend Google Noto family as first font (covers all scripts, free, well-supported). Writer installs if needed.
- Pali, Sanskrit, Tibetan: `book_order: null` - no canonical fixed order; collections vary by lineage.

### Build Command Integration
- STEP 1.7 added between STEP 1.6 (front-matter gate) and STEP 2 (prerequisites) in both `build-ebook.md` and `build-print.md`.
- STEP 1.7 reads `tradition:` from `config.json`. If absent or null: silently skip - no error, no warning.
- If tradition is present: load `templates/sacred/{tradition}/manifest.yaml`. Apply to `metadata.yaml` (font-family, lang), add `--metadata dir=rtl` Pandoc flag if `rtl: true`, note approval block requirement in output.

### Test Strategy
- TDD RED first: test suite authored before manifest content.
- Static YAML validation - all 10 traditions, all 6 required fields non-null and correct types.
- Test IDs: TRAD-01 (manifest completeness), TRAD-02 (RTL field booleans), TRAD-03 (book_order arrays where applicable), TRAD-04 (approval_block shape), TRAD-05 (build commands have STEP 1.7).

### Claude's Discretion
- Exact book_order arrays for each tradition (canonical order within the tradition)
- Exact font names for each script (within Noto family recommendation)
- Exact `script:` field values (e.g. "latin", "arabic", "hebrew", "devanagari", "tibetan", "sinhala")
- STEP 1.7 exact wording in build command files

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `templates/sacred/{tradition}/manifest.yaml` - 10 placeholder manifests, all with schema shape declared (null values), ready to populate
- `lib/architectural-profiles.js` - `validateTradition()`, `listTraditions()` for tradition validation (Phase 29)
- `commands/scr/build-ebook.md` - STEP 1.6 front-matter gate to mirror for STEP 1.7
- `commands/scr/build-print.md` - same STEP 1.6 pattern

### Established Patterns
- Manifests use YAML with explicit null for unfilled fields + `status:` field (`placeholder` -> `active`)
- Phase 29 test pattern: static fixture loading via `js-yaml` + `assert/strict`
- Phase 32 pattern: STEP 1.5 -> STEP 1.6 -> STEP 2 - STEP 1.7 slots cleanly between 1.6 and 2
- `data/CONSTRAINTS.json` `architectural_profiles.traditions` already accepts all 10 slugs

### Integration Points
- `commands/scr/build-ebook.md` STEP 1.6 end -> insert STEP 1.7 before STEP 2
- `commands/scr/build-print.md` STEP 1.6 end -> insert STEP 1.7 before STEP 2
- `lib/architectural-profiles.js` `validateTradition()`: use for tradition slug validation in STEP 1.7 (but inline list check, consistent with Phase 32 CR-01 fix)

</code_context>

<specifics>
## Specific Ideas

- The 3 plans from ROADMAP are:
  1. Phase 33 regression test suite (TRAD-01..TRAD-05) - TDD RED wave
  2. Populate all 10 tradition manifests with real content
  3. Add STEP 1.7 to build-ebook.md and build-print.md
- Keep STEP 1.7 wording consistent with STEP 1.5/1.6 style
- Manifests must set `status: active` when populated (removes placeholder status)
- Jewish tradition: `script: hebrew`, `rtl: true`, `numbering.format: "chapter:verse"` (Tanakh style)
- Islamic: `script: arabic`, `rtl: true`, `numbering.format: "surah:ayah"`
- Tibetan: `script: tibetan`, `rtl: false` (top-down-right, not RTL for Pandoc purposes)

</specifics>

<deferred>
## Deferred Ideas

- Font auto-detection or install-guide generation for tradition fonts
- STEP 1.7 for export.md and publish.md (not part of Phase 33 scope - build commands only)
- New tradition additions beyond the 10 (contributor drop-in via directory listing, no code change needed)

</deferred>
