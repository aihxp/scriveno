---
phase: 29-architectural-foundation
plan: 02
subsystem: architectural-foundation
tags: [project-spec, constraints, schema, tradition, platform]
requires:
  - Phase 29 Plan 01 (templates/sacred/ and templates/platforms/ directories with placeholder manifests)
provides:
  - "templates/WORK.md: {{PROFILE_BLOCK}} placeholder declared in conditional ## Profile section"
  - "data/CONSTRAINTS.json: architectural_profiles block (traditions, platforms, applies_to_groups, defaults_by_work_type, _render_variants)"
  - "Stable contract for Plan 03 runtime validator + default-inference function"
affects:
  - templates/WORK.md
  - data/CONSTRAINTS.json
tech-stack:
  added: []
  patterns:
    - "Conditional template placeholder rendered per work-type group at project-creation time"
    - "JSON-declared seed list + directory-listing intersection for extensible enum validation"
    - "Static per-work-type default map in CONSTRAINTS.json (no hard-coded runtime logic)"
key-files:
  created: []
  modified:
    - templates/WORK.md
    - data/CONSTRAINTS.json
decisions:
  - "OLD sacred_config_schema.tradition.values taxonomy (christian, jewish, ...) preserved byte-identical - it answers 'which religion?' while the NEW architectural_profiles.traditions answers 'which lineage profile?'. They coexist; any collapse is deferred."
  - "No version bump in CONSTRAINTS.json - test/constraints.test.js version-match stays aligned with package.json 1.5.2."
  - "/scr:new-work wiring to actually substitute {{PROFILE_BLOCK}} per group is deferred to a later phase (out-of-scope per 29-CONTEXT.md line 24)."
  - "Seeded-values pattern used for enums: CONSTRAINTS.json declares _seeded arrays, runtime validator (Plan 03) intersects with on-disk templates/{sacred,platforms}/ directory listings so contributor-dropped manifests extend the accepted set without editing JSON."
metrics:
  duration: "~10 minutes"
  completed: "2026-04-17"
---

# Phase 29 Plan 02: Project Spec Keys Summary

ARCH-03 - declared `tradition:` + `platform:` project-spec keys in `templates/WORK.md` and the authoritative schema + inference maps in `data/CONSTRAINTS.json`, with zero code, zero dependencies, and no regression in existing tests.

## What Changed

### `templates/WORK.md` (+12 lines)

Inserted between the existing `## Work type` section and `## Elevator pitch` section, preserving all 16 pre-existing `{{...}}` placeholders and the `*This file is the north star...*` closing note byte-identical:

```markdown
## Profile

<!--
  The `tradition` key applies only to sacred work types.
  The `platform` key applies to work types that publish as books (prose, visual, poetry, sacred).
  For work types where neither applies (script, academic, technical, interactive, speech_song),
  `/scr:new-work` renders this section as "Not applicable for this work type." and omits the keys.
  Valid values and per-work-type defaults live in `data/CONSTRAINTS.json` under `architectural_profiles`.
-->

{{PROFILE_BLOCK}}
```

Section count went from 10 to 11 top-level `##` sections; the new `{{PROFILE_BLOCK}}` placeholder joins the existing 16 for a total of 17.

### `data/CONSTRAINTS.json` (+81 lines)

New top-level key `architectural_profiles` inserted between `sacred_config_schema` and `messages` (same object depth as `work_type_groups`, `work_types`, `commands`, `sacred_config_schema`, `messages`):

| Key | Shape | Content |
| --- | ----- | ------- |
| `_description` | string | Phase 29 v1.7 overview + extension semantics |
| `_render_variants` | object | Per-group render fragments for `{{PROFILE_BLOCK}}` (sacred -> tradition+platform, prose/visual/poetry -> platform only, script/academic/technical/interactive/speech_song -> "Not applicable") |
| `traditions._seeded` | array | 10 entries: catholic, orthodox, tewahedo, protestant, jewish, islamic-hafs, islamic-warsh, pali, tibetan, sanskrit |
| `platforms._seeded` | array | 8 entries: kdp, ingram, d2d, apple, kobo, google, bn, smashwords |
| `applies_to_groups.tradition` | array | `["sacred"]` |
| `applies_to_groups.platform` | array | `["prose", "visual", "poetry", "sacred"]` |
| `defaults_by_work_type.tradition` | object | 15 keys - `scripture_biblical -> catholic`, `scripture_quranic -> islamic-hafs`, `scripture_torah -> jewish`, `scripture_buddhist -> pali`, `scripture_vedic -> sanskrit`; commentary/devotional/liturgical/historical/etc. -> null |
| `defaults_by_work_type.platform` | object | 31 keys - all book-shaped work types default to `"kdp"` |

### What Was NOT Changed

- `sacred_config_schema.tradition.values` at line 1380 remains `["christian", "jewish", "islamic", "buddhist", "hindu", "interfaith", "historical_secular", "custom"]` - this is the OLD taxonomy used by per-project `.manuscript/config.json` blocks and coexists with the new lineage profile taxonomy.
- `version` field in CONSTRAINTS.json is untouched at `1.5.2` - aligns with `package.json.version` so `test/constraints.test.js` version-match test still passes.
- Every other top-level key (`work_type_groups`, `work_types`, `commands`, `exports`, `dependencies`, `command_adaptations`, `file_adaptations`, `sacred_config_schema`, `messages`) is byte-identical.
- `templates/WORK.md` 16 pre-existing placeholders are byte-identical; only addition is the new `## Profile` section with `{{PROFILE_BLOCK}}`.

## Commits

| Task | Hash | Message |
| ---- | ---- | ------- |
| 1 | c9938c5 | feat(29-02): add conditional Profile block to WORK.md template |
| 2 | e3d2c52 | feat(29-02): declare architectural_profiles schema in CONSTRAINTS.json |

## Verification

```bash
# Task 1 automated verify
$ grep -c "## Profile" templates/WORK.md
1
$ awk '/## Work type/{wt=NR} /## Profile/{pf=NR} /## Elevator pitch/{ep=NR} END{exit !(wt>0 && pf>wt && ep>pf)}' templates/WORK.md
# (exit 0 - ordering correct)

# Task 2 automated verify
$ node -e "…" # structural check
OK

$ node --test test/constraints.test.js
# 7/7 tests pass
[x] has version matching package.json
[x] has required top-level keys
[x] every work_type references a valid group
[x] every group member exists in work_types
[x] every command references valid availability groups
[x] every command file on disk is referenced in CONSTRAINTS.json
[x] CONSTRAINTS.json schema integrity
```

Plan-level verification:

```bash
$ node -e "const c=require('./data/CONSTRAINTS.json'); console.log(Object.keys(c.architectural_profiles))"
[ '_description', '_render_variants', 'traditions', 'platforms', 'applies_to_groups', 'defaults_by_work_type' ]
$ grep -c "^## " templates/WORK.md
11
$ grep "PROFILE_BLOCK" templates/WORK.md
{{PROFILE_BLOCK}}
```

## Deferred

`/scr:new-work` wiring to actually render `{{PROFILE_BLOCK}}` per work-type group is DEFERRED to a later phase. The context doc (29-CONTEXT.md line 24) explicitly puts "Changing existing `/scr:new-work` flow beyond adding the two keys" out of scope for Phase 29. For now, the template declares the placeholder as a stable contract; Phase 29 Plan 03 adds the runtime validator that reads `architectural_profiles` from `data/CONSTRAINTS.json`.

## Deviations from Plan

None - plan executed exactly as written.

## Acceptance Criteria

- [x] `templates/WORK.md` contains exactly one `## Profile` section
- [x] `## Profile` appears after `## Work type` and before `## Elevator pitch`
- [x] `{{PROFILE_BLOCK}}` placeholder present
- [x] All 16 pre-existing `{{...}}` placeholders still present
- [x] Closing note "This file is the north star. ..." still present
- [x] `data/CONSTRAINTS.json` parses as valid JSON
- [x] `architectural_profiles.traditions._seeded` has exactly 10 entries
- [x] `architectural_profiles.platforms._seeded` has exactly 8 entries
- [x] `applies_to_groups.tradition` equals `["sacred"]`
- [x] `applies_to_groups.platform` equals `["prose", "visual", "poetry", "sacred"]`
- [x] `defaults_by_work_type.tradition.scripture_biblical` equals `"catholic"`
- [x] `defaults_by_work_type.tradition.scripture_quranic` equals `"islamic-hafs"`
- [x] `defaults_by_work_type.platform.novel` equals `"kdp"`
- [x] All 9 existing top-level keys preserved
- [x] OLD `sacred_config_schema.tradition.values` starts with `"christian"` (byte-preserved)
- [x] `test/constraints.test.js` passes (7/7)

## Self-Check: PASSED

- FOUND: templates/WORK.md (modified)
- FOUND: data/CONSTRAINTS.json (modified)
- FOUND: commit c9938c5 (Task 1)
- FOUND: commit e3d2c52 (Task 2)
- CONFIRMED: test/constraints.test.js 7/7 passing
