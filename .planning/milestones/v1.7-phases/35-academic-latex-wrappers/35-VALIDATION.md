---
phase: 35
slug: academic-latex-wrappers
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-17
---

# Phase 35 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node:test (built-in) |
| **Config file** | none - built-in test runner, no config file needed |
| **Quick run command** | `node --test test/phase35-academic-latex-wrappers.test.js` |
| **Full suite command** | `node --test test/` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test test/phase35-academic-latex-wrappers.test.js`
- **After every plan wave:** Run `node --test test/`
- **Before `final verification`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 35-01-01 | 01 | 1 | TPL-07 | - | N/A | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | [red] W0 | [pending] pending |
| 35-02-01 | 02 | 2 | TPL-07 | - | N/A | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | [red] W0 | [pending] pending |
| 35-02-02 | 02 | 2 | TPL-07 | - | N/A | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | [red] W0 | [pending] pending |
| 35-02-03 | 02 | 2 | TPL-07 | - | N/A | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | [red] W0 | [pending] pending |
| 35-02-04 | 02 | 2 | TPL-07 | - | N/A | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | [red] W0 | [pending] pending |
| 35-02-05 | 02 | 2 | TPL-07 | - | N/A | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | [red] W0 | [pending] pending |
| 35-03-01 | 03 | 2 | TPL-07 | - | N/A | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | [red] W0 | [pending] pending |

*Status: [pending] pending · [x] green · [red] red · WARNING flaky*

---

## Wave 0 Requirements

- [ ] `test/phase35-academic-latex-wrappers.test.js` - stubs/skeletons for TPL-07 (cloned from phase34 test file pattern)

*Existing node:test infrastructure covers all phase requirements - no framework install needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| kpsewhich detects missing class and shows tlmgr install command | TPL-07 | Requires TeX Live installed on test machine; kpsewhich not available in CI | On a machine with TeX Live but without the target class, run `/scr:build-print --platform ieee` and verify the error message names the class and tlmgr command |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
