---
phase: 30-export-cleanup-validation-gate
plan: "03"
subsystem: commands
tags: [export, publish, validate-gate, tdd-green, commands, VALID-03]
dependency_graph:
  requires: [30-01, 30-02]
  provides: [export-validate-gate, publish-validate-gate]
  affects:
    - commands/scr/export.md
    - commands/scr/publish.md
tech_stack:
  added: []
  patterns: [gate-injection, step-ordering, skip-validate-bypass, visible-warning]
key_files:
  created: []
  modified:
    - commands/scr/export.md
    - commands/scr/publish.md
decisions:
  - "Gate injected as STEP 1.5 in both files -- additive insertion only, no existing content altered"
  - "export.md gate placed before STEP 2 CHECK PREREQUISITES -- dirty manuscript never reaches Pandoc/Typst tool detection"
  - "publish.md gate placed after STEP 1 LOAD CONTEXT and before STEP 2 ROUTE -- context available before gate runs"
  - "--skip-validate bypass always emits visible blockquote warning -- no silent passthrough (T-30-09 mitigation)"
  - "export.md uses 'Export blocked' label; publish.md uses 'Publishing blocked' label -- command-specific messaging"
metrics:
  duration: "~10 minutes"
  completed: "2026-04-17"
  tasks_completed: 2
  tasks_total: 2
  files_changed: 2
---

# Phase 30 Plan 03: Export and Publish Validate Gate Injection Summary

STEP 1.5 validate gate injected into `commands/scr/export.md` and `commands/scr/publish.md` as additive insertions before tool detection and before preset routing respectively; all 15 Phase 30 VALID-03 tests turn GREEN (1152 passing, 1 pre-existing CONSTRAINTS failure out of scope).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Inject STEP 1.5 validate gate into export.md | f567366 | commands/scr/export.md |
| 2 | Inject STEP 1.5 validate gate into publish.md | 2dbb6d6 | commands/scr/publish.md |

## Test Results

| Req ID | Assertion | Status |
|--------|-----------|--------|
| VALID-03 | export.md contains STEP 1.5 before STEP 2 | GREEN |
| VALID-03 | export.md gate mentions --skip-validate bypass | GREEN |
| VALID-03 | export.md gate mentions /scr:cleanup --apply as resolution | GREEN |
| VALID-03 | publish.md contains STEP 1.5 before STEP 2 | GREEN |
| VALID-03 | publish.md --skip-validate has visible warning language | GREEN |

All 15 Phase 30 assertions now GREEN. Prior 10 (CLEAN-01, CLEAN-02, VALID-01, VALID-02) remain GREEN.

npm test totals after plan: 1152 pass, 1 fail (pre-existing CONSTRAINTS registration failure from Wave 2 -- out of scope, deferred).

## Decisions Made

1. **Additive injection only:** Both gate blocks are pure insertions. No existing lines in STEP 1 or STEP 2 were removed or modified. Verified by: `grep "CHECK PREREQUISITES" export.md` and `grep "LOAD CONTEXT\|ROUTE" publish.md` still return hits.
2. **Gate position in export.md:** STEP 1.5 inserted after the format-availability check (`Then **stop**.` + `---`) and before `### STEP 2: CHECK PREREQUISITES` (now line 118). Gate runs before any `command -v pandoc` probe - dirty manuscript never triggers Pandoc/Typst detection (fail-fast per CONTEXT.md).
3. **Gate position in publish.md:** STEP 1.5 inserted after the closing `---` of `### STEP 1: LOAD CONTEXT` and before `### STEP 2: ROUTE` (now line 68). Context files (config.json, CONSTRAINTS.json, OUTLINE.md) are available to the gate without a separate load step.
4. **Visible --skip-validate warning in both files:** Both gates emit `> **Warning: Validate gate skipped (--skip-validate)...`** blockquote before proceeding -- unconditional when flag is used. No silent bypass (T-30-09 mitigation, Pitfall 5).
5. **Command-specific blocked labels:** export.md uses "Export blocked: unresolved scaffold markers found." and publish.md uses "Publishing blocked: unresolved scaffold markers found." - contextually accurate messaging per plan spec.

## Deviations from Plan

None -- plan executed exactly as written. Both gates follow the exact block content specified in PATTERNS.md and the plan's `<action>` sections. All structural invariants (STEP ordering, separator pattern, stop instruction wording) match the established patterns.

## Deferred Items

**Pre-existing: CONSTRAINTS.json missing cleanup.md and validate.md registrations**
- Found during: npm test verification (1 failing test: `every command file on disk is referenced in CONSTRAINTS.json`)
- Root cause: Wave 2 (Plan 02) created cleanup.md and validate.md but did not add entries to CONSTRAINTS.json
- Out of scope per scope boundary rule: not caused by Plan 03 changes
- Logged at: `.planning/tmp/deferred-items.md` (if applicable)
- Resolution: add `cleanup` and `validate` entries to CONSTRAINTS.json in a follow-up plan

## Known Stubs

None -- both command files have all required sections wired with actual content. No placeholder text or TODOs introduced.

## Threat Flags

None -- both modifications are additive text injections into markdown command files. No new network surfaces, endpoints, auth paths, or schema changes introduced.

## Self-Check: PASSED

- commands/scr/export.md: STEP 1.5 at line 86, STEP 2 at line 118 (86 < 118 CONFIRMED)
- commands/scr/publish.md: STEP 1.5 at line 36, STEP 2 at line 68 (36 < 68 CONFIRMED)
- Task 1 commit f567366: FOUND
- Task 2 commit 2dbb6d6: FOUND
- Phase 30 test suite: 15/15 GREEN
- Prior 10 CLEAN/VALID-01/02 tests: still GREEN
- Full npm test: 1152 pass (up from 1147 before this plan), 1 fail (pre-existing, out of scope)
