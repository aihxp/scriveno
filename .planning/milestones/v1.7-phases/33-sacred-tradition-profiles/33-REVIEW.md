---
phase: 33-sacred-tradition-profiles
reviewed: 2026-04-17T00:00:00Z
depth: standard
files_reviewed: 15
files_reviewed_list:
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
  - commands/scr/build-ebook.md
  - commands/scr/build-print.md
  - commands/scr/front-matter.md
  - commands/scr/sacred-verse-numbering.md
  - data/CONSTRAINTS.json
findings:
  critical: 0
  warning: 4
  info: 3
  total: 7
status: issues_found
---

# Phase 33: Code Review Report

**Reviewed:** 2026-04-17
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

Phase 33 adds ten sacred tradition manifests, a new `sacred-verse-numbering` command, and integrates tradition-loading (STEP 1.7) into `build-ebook.md` and `build-print.md`, plus a tradition approval block step (STEP 3.5) into `front-matter.md`. No critical security issues were found - specifically, the slug injection threat (T-33-10) is correctly mitigated in all three command files by validating the tradition slug against a hard-coded allowlist before constructing the manifest path. The approval block scaffold (T-33-11) correctly emits YAML `scaffold: true` and adds a prominent "AUTHORIZATION REQUIRED" comment (T-33-12). The YAML manifests are well-formed and consistent across all ten traditions.

Four warnings were found: a path-read mismatch in `front-matter.md` (reads `config.json` `sacred.tradition` but Step 1 elsewhere reads the top-level `tradition:` key - these need to resolve to the same field), a cross-tradition type inconsistency for `approval_block.label` when `required: false` (`"none"` string vs a proper label), the Tibetan Buddhist tradition using a generic `chapter:verse` numbering format instead of a tradition-appropriate one, and the `sacred-verse-numbering` CONSTRAINTS.json entry omitting `"requires"` despite the command requiring a tradition to be configured. Three info items cover the Islamic sura transliteration variation between Hafs and Warsh, the `orthodox` manifest using `script: latin` despite the Eastern Orthodox tradition's primary liturgical texts being in Greek, and a slight inconsistency in how the Sacred Adaptation section of `front-matter.md` maps tradition slugs to element sets.

---

## Warnings

### WR-01: `front-matter.md` reads tradition from wrong config key path

**File:** `commands/scr/front-matter.md:483`
**Issue:** The Sacred Adaptation section tells the agent to read `config.json` `sacred.tradition` (a nested key path), but STEP 1 in the same command reads `.manuscript/config.json` for standard fields, and STEP 3.5 (added in Phase 33) correctly reads the top-level `tradition:` key (`config.json` `tradition:`). The two instructions point to different JSON paths. An agent following Step 1's convention would look for `config.json["tradition"]` (top-level). An agent following the Sacred Adaptation prose would look for `config.json["sacred"]["tradition"]` (nested). If these do not resolve to the same key, sacred front-matter element selection will fail silently for traditions that set `tradition:` at the top level.

`build-ebook.md` and `build-print.md` STEP 1.7 both read `tradition:` from `.manuscript/config.json` (top-level), consistent with STEP 3.5. The Sacred Adaptation prose in `front-matter.md` is the outlier.

**Fix:** Change the prose on line 483 from `Read config.json \`sacred.tradition\`` to `Read \`tradition:\` from \`.manuscript/config.json\`` to match the pattern used in STEP 3.5, `build-ebook.md`, and `build-print.md`.

---

### WR-02: `approval_block.label` value `"none"` used as a string sentinel for non-required traditions

**File:** `templates/sacred/protestant/manifest.yaml:76`, `templates/sacred/pali/manifest.yaml:10`, `templates/sacred/tibetan/manifest.yaml:9`, `templates/sacred/sanskrit/manifest.yaml:9`
**Issue:** For traditions where approval is not required, `approval_block.label` is set to the string `"none"` rather than `null` or an empty string. STEP 3.5 in `front-matter.md` and the approval block reminder in `sacred-verse-numbering.md` both gate on `approval_block.required: false`, so these paths are safe. However, if any consumer formats the label string (e.g., `"{{approval_block.label}}"`) before first checking `required`, it will emit the literal text "none" in the output - for example, the approval block notice template in `front-matter.md` line 541 reads `The **{approval_block.label}** (tradition approval) is required`. If `required` is somehow misread as `true` for these traditions, the output would read "The **none** (tradition approval) is required", which is confusing user-facing text.

The Catholic and Orthodox traditions set a meaningful label (`"Nihil Obstat"`, `"Patriarchal blessing"`) alongside `required: true`, so the pattern is clear. The mismatch is that non-required traditions have a string sentinel instead of a null value, creating a latent label-display bug if the gate fails.

**Fix:** Change `label: "none"` to `label: null` in all four manifests where `required: false`. This makes the absence of a label explicit and prevents accidental string interpolation.

```yaml
# protestant, pali, tibetan, sanskrit - change:
approval_block:
  label: null
  required: false
  scope: "work"
```

---

### WR-03: Tibetan Buddhist numbering format is `chapter:verse` - no Tibetan Buddhist canon has that structure

**File:** `templates/sacred/tibetan/manifest.yaml:17-19`
**Issue:** The Tibetan Buddhist manifest uses:
```yaml
numbering:
  format: "chapter:verse"
  separator: "."
```
The Tibetan Buddhist canon (Kangyur/Tengyur) does not use chapter:verse citation. Standard Tibetan citation uses volume (Toh number) and folio/page references (e.g., `Toh 1`, `D 1`, or `Peking 1`). The `sacred-verse-numbering.md` command (STEP 2) provides example citations `1:1`, `2:3`, `5:12` for Tibetan - these are structurally identical to the generic `chapter:verse` pattern and give no tradition-appropriate guidance. This is a data correctness bug: an agent using this manifest to format citations will produce incorrect, non-standard Tibetan references that cannot be verified against any real edition.

**Fix:** Update the Tibetan manifest numbering block to reflect actual Tibetan citation convention:
```yaml
numbering:
  format: "toh:folio"
  separator: "."
```
And update `sacred-verse-numbering.md` STEP 2's Tibetan example row accordingly (e.g., `Toh.1`, `D.1`, `Toh.45`).

---

### WR-04: `sacred-verse-numbering` CONSTRAINTS.json entry omits `requires` despite needing a tradition configured

**File:** `data/CONSTRAINTS.json:1147-1151`
**Issue:** The `sacred-verse-numbering` command entry has no `"requires"` field:
```json
"sacred-verse-numbering": {
  "category": "sacred_exclusive",
  "available": ["sacred"],
  "hidden": ["prose", "script", "academic", "visual", "poetry", "interactive", "speech_song"]
}
```
The command itself (STEP 1 of `sacred-verse-numbering.md`) immediately reads and validates `tradition:` from `.manuscript/config.json`, halting with an error if it is absent. The analogous `verse-numbering` entry directly above it (line 1141-1146) correctly declares `"requires": ["draft_exists"]`. The `sacred-verse-numbering` command does not require a draft, but it does require that `tradition:` be set in `config.json`. Without a `requires` declaration, the help system, progress tracker, and dependency checker cannot gate on the pre-condition, leaving users to discover the requirement via a runtime error inside the command rather than upfront guidance.

**Fix:** Add a requires entry that signals the tradition configuration dependency:
```json
"sacred-verse-numbering": {
  "category": "sacred_exclusive",
  "available": ["sacred"],
  "hidden": ["prose", "script", "academic", "visual", "poetry", "interactive", "speech_song"],
  "requires": ["config.tradition"]
}
```
If `config.tradition` is not a valid requires token in the existing prerequisite system, use `"description": "Requires tradition: set in config.json"` as a documentation field, or align with whatever token the project uses for config-key prerequisites.

---

## Info

### IN-01: Islamic Hafs and Warsh manifests are identical - no Warsh-specific differentiation

**File:** `templates/sacred/islamic-warsh/manifest.yaml:1-134`
**Issue:** The Warsh and Hafs manifests are byte-for-byte identical except for `tradition: islamic-warsh` vs `tradition: islamic-hafs` on line 6, and the comment on line 2. The Warsh tradition has some verse boundary differences from Hafs (notably Al-Anfal/At-Tawbah division, and a handful of differing verse counts in several surahs). The current manifests share the same `book_order` and numbering scheme, meaning agents will not be able to distinguish between the two for any tradition-specific behavior beyond the slug itself. This is not a bug in isolation (the manifests are data-correct for the common case), but it means the two-tradition split delivers no functional differentiation today and may mislead contributors into thinking Warsh-specific handling is already present.

**Fix (info-level, no change required now):** Add a comment to `islamic-warsh/manifest.yaml` noting that Warsh-specific verse-count deltas are not yet modeled, e.g.:
```yaml
# NOTE: Warsh verse-count differences from Hafs (e.g., Al-Anfal split, ~)
# are not yet modeled. book_order is identical to islamic-hafs.
```

---

### IN-02: `orthodox/manifest.yaml` uses `script: latin` - primary liturgical script is Greek

**File:** `templates/sacred/orthodox/manifest.yaml:98`
**Issue:** The Eastern Orthodox tradition's primary liturgical language and original biblical text language is Greek (and Church Slavonic in some jurisdictions). The manifest sets `script: latin`, which causes `build-ebook.md` and `build-print.md` STEP 1.7 to fall through to the `latin` script branch and use the project's `config.json` language (likely `en`) rather than emitting a Greek-appropriate language tag. For commentaries and devotionals written in English, `latin -> en` is probably correct. For works that handle Greek source text, the `script: latin` field silently suppresses Greek font and lang tag selection.

This is an info-level finding because the `script` field's mapping to `lang:` tags in STEP 1.7 only handles `arabic`, `hebrew`, `ethiopic`, `tibetan`, and `devanagari` - Greek is not in the switch at all, so `latin` is the correct fallback for English-language Orthodox works. However, it should be documented.

**Fix (info-level):** Add an inline comment to the manifest:
```yaml
script: latin  # English-language Orthodox commentary; Greek source editions should override lang manually
```

---

### IN-03: `front-matter.md` Sacred Adaptation tradition-to-element mapping uses coarse tradition groups, not the 10 slugs

**File:** `commands/scr/front-matter.md:513-524`
**Issue:** The tradition-specific element selection table in the Sacred Adaptation section maps broad groupings (`christian`, `jewish`, `islamic`, `buddhist`, `hindu`, `interfaith`) to element sets. But the 10 manifest slugs established in Phase 33 are fine-grained: `catholic`, `orthodox`, `tewahedo`, `protestant`, `islamic-hafs`, `islamic-warsh`, `pali`, `tibetan`, `sanskrit`. An agent reading STEP 3.5 reads the `tradition:` slug from config.json (e.g., `"catholic"`) but then tries to match it against the element selection table which lists `"christian"` - not `"catholic"`. The agent must infer the mapping.

This is an info-level finding because an AI agent will likely resolve the mapping correctly by context, but it creates ambiguity: `tewahedo` does not map cleanly to `christian` (it could be argued as a distinct non-Western Christian tradition), and the table gives no guidance for `tibetan` or `sanskrit` beyond "All others."

**Fix (info-level):** Expand the element selection table to use the actual slugs, or add a slug-to-group mapping note above the table:
```
Slug-to-group: catholic/orthodox/tewahedo/protestant -> christian | jewish -> jewish | islamic-hafs/islamic-warsh -> islamic | pali/tibetan -> buddhist | sanskrit -> hindu
```

---

_Reviewed: 2026-04-17_
_Reviewer: Claude (code reviewer)_
_Depth: standard_
