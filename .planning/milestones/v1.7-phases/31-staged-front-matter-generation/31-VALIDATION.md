---
phase: 31
slug: staged-front-matter-generation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-17
---

# Phase 31 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (node:test) |
| **Config file** | none - runner is built-in |
| **Quick run command** | `node --test test/phase31-staged-front-matter-generation.test.js` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~1 second (unit), ~16 seconds (full suite) |

---

## Sampling Rate

- **After every task commit:** Run `node --test test/phase31-staged-front-matter-generation.test.js`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 16 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 31-01-01 | 01 | 1 | FM-01, FM-02, FM-03, FM-04 | - | N/A | unit | `node --test test/phase31-staged-front-matter-generation.test.js` | [red] W0 | [pending] pending |
| 31-02-01 | 02 | 2 | FM-01, FM-02 | - | N/A | unit | `node --test test/phase31-staged-front-matter-generation.test.js` | [x] | [pending] pending |
| 31-03-01 | 03 | 3 | FM-03, FM-04 | - | N/A | unit | `node --test test/phase31-staged-front-matter-generation.test.js` | [x] | [pending] pending |

*Status: [pending] pending · [x] green · [red] red · WARNING flaky*

---

## Wave 0 Requirements

- [ ] `test/phase31-staged-front-matter-generation.test.js` - stubs for FM-01, FM-02, FM-03, FM-04

*Plan 31-01 creates this file in RED state.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Timestamp comparison phrasing works across macOS/Linux | FM-04 | Platform stat command syntax differs; no codebase convention | Test on both platforms by running export after modifying WORK.md |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
