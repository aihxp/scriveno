---
phase: 30
slug: export-cleanup-validation-gate
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-17
---

# Phase 30 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (`node:test`) |
| **Config file** | None - `npm test` runs `node --test test/*.test.js` |
| **Quick run command** | `node --test test/phase30-export-cleanup-validation-gate.test.js` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test test/phase30-export-cleanup-validation-gate.test.js`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 30-01-01 | 01 | 1 | CLEAN-01, CLEAN-02, VALID-01, VALID-02, VALID-03 | T-30-01 / T-30-02 | Test file runs without crashing; new assertions fail gracefully (RED state expected) | tdd | `node --test test/phase30-export-cleanup-validation-gate.test.js 2>&1 \| tail -20` | [red] W0 | [pending] pending |
| 30-02-01 | 02 | 2 | CLEAN-01, CLEAN-02 | T-30-03 / T-30-06 | Dry-run default; `--apply` is explicit opt-in; scope restricted to `.manuscript/drafts/` | unit | `node --test test/phase30-export-cleanup-validation-gate.test.js 2>&1 \| grep -E "CLEAN-0[12]\|cleanup"` | [red] W0 | [pending] pending |
| 30-02-02 | 02 | 2 | VALID-01, VALID-02 | T-30-04 / T-30-05 | Validate reports file:line list; stops on marker detection; does not flag `{{VAR}}` tokens | unit | `node --test test/phase30-export-cleanup-validation-gate.test.js 2>&1 \| grep -E "CLEAN\|VALID-0[12]"` | [red] W0 | [pending] pending |
| 30-03-01 | 03 | 3 | VALID-03 | T-30-07 / T-30-09 | Gate in export.md is additive; `--skip-validate` emits visible warning (not silent) | unit | `node --test test/phase30-export-cleanup-validation-gate.test.js 2>&1 \| grep -E "VALID-03\|export\.md"` | [red] W0 | [pending] pending |
| 30-03-02 | 03 | 3 | VALID-03 | T-30-08 / T-30-09 | Gate in publish.md is additive; `--skip-validate` emits visible warning; uses "Publishing blocked" label | unit | `node --test test/phase30-export-cleanup-validation-gate.test.js 2>&1 \| tail -5` | [red] W0 | [pending] pending |

*Status: [pending] pending · [x] green · [red] red · WARNING flaky*

---

## Wave 0 Requirements

- [ ] `test/phase30-export-cleanup-validation-gate.test.js` - 15 assertions covering CLEAN-01, CLEAN-02, VALID-01, VALID-02, VALID-03 (created by Plan 30-01)

*Existing infrastructure (`npm test`, `node --test test/*.test.js`) covers all phase requirements. No framework installation needed.*

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
