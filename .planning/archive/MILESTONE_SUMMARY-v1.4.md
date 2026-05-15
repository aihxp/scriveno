# Milestone v1.4 - Project Summary

**Generated:** 2026-04-09  
**Purpose:** Team onboarding and project review

---

## 1. Project Overview

Milestone `v1.4 Perplexity & Technical Writing` extended Scriveno in two careful directions without weakening the trust posture from `v1.3`: it added Perplexity Desktop as a guided runtime target and introduced a first-pass technical-writing family grounded in real document types.

This milestone shipped phases `17` through `19`, passed its archived milestone audit, and then received review/fix follow-up work to keep those new surfaces aligned.

## 2. Architecture & Technical Decisions

- **Decision:** Model Perplexity Desktop as a guided local-MCP target.
  - **Why:** The host exposes a real integration surface, but not slash-command parity. Honest support framing matters more than breadth.
  - **Phase:** Phase 17
- **Decision:** Keep runtime truth centralized in [docs/runtime-support.md](/Users/hprincivil/Projects/scriveno/docs/runtime-support.md).
  - **Why:** New runtime targets should inherit the same evidence discipline established in `v1.3`.
  - **Phase:** Phase 17
- **Decision:** Introduce technical writing as a dedicated first-pass family.
  - **Why:** A small, domain-native set of document types is more useful than one vague catch-all category.
  - **Phase:** Phase 18
- **Decision:** Lock the new surfaces with regression coverage immediately.
  - **Why:** Counts, packaging, and wording drift are easy to reintroduce after shipping.
  - **Phase:** Phase 19

## 3. Phases Delivered

| Phase | Name | Status | One-Liner |
|-------|------|--------|-----------|
| 17 | Perplexity Runtime Support | Complete | Added truthful guided Perplexity Desktop install support and docs |
| 18 | Technical Writing Domain Modeling | Complete | Added four technical-writing work types, templates, and adapted behavior |
| 19 | Verification & Trust Surface Updates | Complete | Added tests and doc updates that lock the new runtime and technical surfaces |

## 4. Requirements Coverage

Archived requirement and audit artifacts show full coverage:

- [x] `RUNTIME-05` to `RUNTIME-07` satisfied in Phase `17`
- [x] `TECHDOC-01` to `TECHDOC-04` satisfied in Phase `18`
- [x] `QA-03` and `TRUST-04` satisfied in Phase `19`

Audit verdict: `passed` in [v1.4-MILESTONE-AUDIT.md](/Users/hprincivil/Projects/scriveno/.planning/v1.4-MILESTONE-AUDIT.md), with `9/9` requirements satisfied and all three phases marked Nyquist-compliant.

## 5. Key Decisions Log

- Perplexity support should be explicit and narrow rather than implied across the whole Perplexity brand surface.
- Technical writing belongs in Scriveno’s adaptive model, but only as a small coherent family at first.
- Technical-writing templates should reinforce audience-fit and accuracy-first work instead of inheriting fiction-centric defaults.
- Trust-surface updates need tests alongside docs changes, not after them.

## 6. Tech Debt & Deferred Items

- Broader Perplexity support beyond Desktop local-MCP was deferred.
- Docs-site or portal-oriented technical publishing was deferred.
- Expanding the technical-writing catalog beyond guides, runbooks, API references, and design specs was deferred.
- No milestone-scoped tech debt was recorded in the audit.

## 7. Getting Started

- **Run the project:** `npx scriveno@latest`
- **Key directories:** [bin/install.js](/Users/hprincivil/Projects/scriveno/bin/install.js), [templates/technical](/Users/hprincivil/Projects/scriveno/templates/technical), [docs/runtime-support.md](/Users/hprincivil/Projects/scriveno/docs/runtime-support.md), [docs/work-types.md](/Users/hprincivil/Projects/scriveno/docs/work-types.md), `test/`
- **Tests:** `npm test`
- **Where to look first:** [v1.4-ROADMAP.md](/Users/hprincivil/Projects/scriveno/.planning/milestones/v1.4-ROADMAP.md), [v1.4-REQUIREMENTS.md](/Users/hprincivil/Projects/scriveno/.planning/milestones/v1.4-REQUIREMENTS.md), and the phase artifacts under `.planning/phases/17-*` through `.planning/phases/19-*`

---

## Stats

- **Timeline:** 2026-04-09
- **Phases:** 3 / 3 complete
- **Tag:** `v1.4`
- **Requirements:** 9 / 9 satisfied
- **Commits:** 252 reachable at the archived tag
- **Files changed / diff stats:** see the archived milestone record in [MILESTONES.md](/Users/hprincivil/Projects/scriveno/.planning/MILESTONES.md) for the tracked `5385856` -> `3b514c4` range

---

Primary artifacts used: [v1.4-ROADMAP.md](/Users/hprincivil/Projects/scriveno/.planning/milestones/v1.4-ROADMAP.md), [v1.4-REQUIREMENTS.md](/Users/hprincivil/Projects/scriveno/.planning/milestones/v1.4-REQUIREMENTS.md), [v1.4-MILESTONE-AUDIT.md](/Users/hprincivil/Projects/scriveno/.planning/v1.4-MILESTONE-AUDIT.md), and phase artifacts under [.planning/phases](/Users/hprincivil/Projects/scriveno/.planning/phases).
