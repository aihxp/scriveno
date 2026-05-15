# Milestone v1.5 - Project Summary

**Generated:** 2026-04-09
**Purpose:** Team onboarding and project review

---

## 1. Project Overview

Milestone `v1.5 Runtime Install Reliability` tightened Scriveno's real installation story for Codex and Claude Code without expanding into broader runtime-parity claims. The milestone focused on three practical outcomes: a scriptable silent installer, a native Codex `$scr-*` discovery surface, and docs/tests that describe the exact install contract the repo now ships.

This milestone shipped phases `20` through `22`, passed milestone audit in [v1.5-MILESTONE-AUDIT.md](/Users/hprincivil/Projects/scriveno/.planning/v1.5-MILESTONE-AUDIT.md), and closed the review findings raised during post-ship code review before the final audit pass.

## 2. Architecture & Technical Decisions

- **Decision:** Add a true non-interactive installer surface instead of relying on prompts.
  - **Why:** Install automation needed explicit runtime, scope, mode, help, and version flags that work in scripts and CI-like usage.
  - **Phase:** Phase 20
- **Decision:** Allow one install run to target both Codex and Claude Code.
  - **Why:** The real user flow often needs both host surfaces updated together, and re-running prompt flows is brittle.
  - **Phase:** Phase 20
- **Decision:** Limit reinstall cleanup to Scriveno-owned output paths only.
  - **Why:** Clean installs should remove stale Scriveno assets without deleting unrelated user runtime files.
  - **Phase:** Phase 20
- **Decision:** Treat Codex as a skill-native surface with generated `$scr-*` skills.
  - **Why:** Codex users discover functionality through skills, not slash-command parity, so the install surface should match the host.
  - **Phase:** Phase 21
- **Decision:** Keep mirrored command markdown under `.codex/commands/scr/` as the execution source of truth.
  - **Why:** Generated Codex skills should route to installed command files rather than duplicating command logic and drifting over time.
  - **Phase:** Phase 21
- **Decision:** Keep runtime truth centralized in docs and existing trust suites.
  - **Why:** Runtime claims should stay narrow, source-backed, and enforced by the same regression surfaces that guard the broader trust posture.
  - **Phase:** Phase 22

## 3. Phases Delivered

| Phase | Name | Status | One-Liner |
|-------|------|--------|-----------|
| 20 | Silent Multi-Runtime Installer | Complete | Added scriptable multi-runtime install flags and Scriveno-owned clean reinstall behavior |
| 21 | Codex Skill-Native Surface | Complete | Added generated `$scr-*` Codex skills backed by mirrored installed command markdown |
| 22 | Runtime Docs & Verification | Complete | Updated runtime docs and tests so Codex and Claude install guidance matches the shipped installer contract |

## 4. Requirements Coverage

Current requirement and audit artifacts show full milestone coverage:

- [x] `RUNTIME-08` satisfied in Phase `20`
- [x] `RUNTIME-09` satisfied in Phase `21`
- [x] `RUNTIME-10` satisfied in Phase `20`
- [x] `RUNTIME-11` satisfied across Phases `20` and `21`
- [x] `QA-04` satisfied in Phase `22`

Audit verdict: `passed` in [v1.5-MILESTONE-AUDIT.md](/Users/hprincivil/Projects/scriveno/.planning/v1.5-MILESTONE-AUDIT.md), with `5/5` requirements satisfied and all milestone flows verified.

## 5. Key Decisions Log

- Silent installs should fail fast on invalid runtime keys rather than silently picking a fallback runtime.
- Codex support should be modeled as native `$scr-*` skills, not as implied slash-command compatibility.
- Generated Codex wrappers should point back to mirrored installed command markdown so one source of truth drives all runtimes.
- Claude Code should stay a command-directory runtime with `/scr:*` commands under `.claude/commands/scr`.
- Runtime guidance should remain OS-agnostic and avoid hard-coded shell or platform assumptions.
- Runtime docs should reuse existing credibility and trust-regression suites where possible instead of creating a disconnected doc-only test layer.
- Review follow-up after shipment matters for installer trust surfaces; the stale Codex skill cleanup and silent-runtime fallback issues were fixed before the final audit pass.

## 6. Tech Debt & Deferred Items

- Host-runtime smoke tests inside live Codex and Claude sessions remain deferred.
- Broader runtime-specific polish beyond the Codex and Claude Code install contract remains deferred.
- Runtime documentation beyond the currently installer-supported surfaces remains deferred.
- Nyquist validation artifacts are still missing for phases `20` through `22`; this was captured as discovery-only in the milestone audit and did not block shipment.
- No milestone-scoped blocking tech debt was recorded in the final audit.

## 7. Getting Started

- **Run the project:** `npx scriveno@latest`
- **Key directories:** [bin/install.js](/Users/hprincivil/Projects/scriveno/bin/install.js), [README.md](/Users/hprincivil/Projects/scriveno/README.md), [docs/runtime-support.md](/Users/hprincivil/Projects/scriveno/docs/runtime-support.md), [docs/getting-started.md](/Users/hprincivil/Projects/scriveno/docs/getting-started.md), [test/installer.test.js](/Users/hprincivil/Projects/scriveno/test/installer.test.js), [.planning/phases/20-silent-multi-runtime-installer](/Users/hprincivil/Projects/scriveno/.planning/phases/20-silent-multi-runtime-installer), [.planning/phases/21-codex-skill-native-surface](/Users/hprincivil/Projects/scriveno/.planning/phases/21-codex-skill-native-surface), and [.planning/phases/22-runtime-docs-verification](/Users/hprincivil/Projects/scriveno/.planning/phases/22-runtime-docs-verification)
- **Tests:** `npm test`
- **Where to look first:** [ROADMAP.md](/Users/hprincivil/Projects/scriveno/.planning/ROADMAP.md), [REQUIREMENTS.md](/Users/hprincivil/Projects/scriveno/.planning/REQUIREMENTS.md), [v1.5-MILESTONE-AUDIT.md](/Users/hprincivil/Projects/scriveno/.planning/v1.5-MILESTONE-AUDIT.md), then the phase summaries and verification reports for phases `20` through `22`

---

## Stats

- **Timeline:** 2026-04-09
- **Phases:** 3 / 3 complete
- **Requirements:** 5 / 5 satisfied
- **Contributors seen in git history for the current range:** Hanns Peter
- **Git range note:** exact milestone-only diff stats are not isolated yet because `v1.5` has not been archived/tagged; the current unarchived repo shows `29` commits since `2026-04-09 00:00:00` UTC across same-day work

---

Primary artifacts used: [PROJECT.md](/Users/hprincivil/Projects/scriveno/.planning/PROJECT.md), [ROADMAP.md](/Users/hprincivil/Projects/scriveno/.planning/ROADMAP.md), [REQUIREMENTS.md](/Users/hprincivil/Projects/scriveno/.planning/REQUIREMENTS.md), [STATE.md](/Users/hprincivil/Projects/scriveno/.planning/STATE.md), [v1.5-MILESTONE-AUDIT.md](/Users/hprincivil/Projects/scriveno/.planning/v1.5-MILESTONE-AUDIT.md), and the phase artifacts under [.planning/phases](/Users/hprincivil/Projects/scriveno/.planning/phases).
