# Milestone v1.0 - Project Summary

**Generated:** 2026-04-09  
**Purpose:** Team onboarding and project review

---

## 1. Project Overview

Milestone `v1.0 MVP` established Scriveno’s core product surface: a markdown-first writing pipeline that runs inside AI coding agents, preserves writer voice through the Voice DNA system, and carries a project from setup through drafting, revision, export, illustration, translation, and collaboration.

This milestone shipped phases `1` through `8` and created the foundation the later trust and technical-writing milestones build on. Its center of gravity was the writer workflow, not infrastructure: get installed quickly, start a project, preserve voice, and keep the whole pipeline accessible through adaptive `/scr:*` commands.

## 2. Architecture & Technical Decisions

- **Decision:** Keep Scriveno as a pure markdown skill and command system.
  - **Why:** Maximum portability across Claude Code, Cursor, Gemini CLI, and similar hosts without adding a build step or runtime dependency graph.
  - **Phase:** v1.0 foundation
- **Decision:** Use fresh context per atomic unit for drafting.
  - **Why:** Voice drift is the primary product risk; loading `STYLE-GUIDE.md` first for each drafter invocation keeps the prose aligned to the writer.
  - **Phase:** v1.0 foundation
- **Decision:** Centralize capability control in `data/CONSTRAINTS.json`.
  - **Why:** Command availability, work-type adaptation, hierarchy vocabulary, and export gating all need one runtime source of truth.
  - **Phase:** v1.0 foundation
- **Decision:** Ship both the product surface and a working npm install path in the MVP.
  - **Why:** The product promise depends on a real `npx` experience, not just local repo usage.
  - **Phase:** Phase 1

## 3. Phases Delivered

| Phase | Name | Status | One-Liner |
|-------|------|--------|-----------|
| 1 | MVP Polish | Complete | Shipped installable npm package, demo project, and baseline tests |
| 2 | Writer Experience | Complete | Added autopilot modes, writer-friendly save/history/undo flows, and session management |
| 3 | Creative Toolkit | Complete | Added character, world-building, structure, and outline-management commands |
| 4 | Quality & Manuscript Completion | Complete | Added editing tools, quality gates, and publication-supporting front/back matter |
| 5 | Export & Publishing | Complete | Added multi-format export and platform-oriented publishing flows |
| 6 | Illustration | Complete | Added cover, scene, layout, and visual-prompt tooling |
| 7 | Translation & Localization | Complete | Added translation, glossary, memory, and localization workflows |
| 8 | Collaboration, Platform & Sacred | Complete | Added revision tracks, broader runtime support, and sacred-text capabilities |

## 4. Requirements Coverage

Roadmap history shows all v1.0 requirement groups as shipped:

- [x] `MVP-*` requirements were satisfied across installability, demo completeness, testing, and package readiness
- [x] `AUTO-*` requirements were satisfied across autopilot profiles, writer-friendly state management, and session continuity
- [x] `CHAR-*` and `STRUCT-*` requirements were satisfied across character, world, outline, and restructuring tools
- [x] `QUAL-*` and `PUB-*` requirements were satisfied across editorial workflows and publication-supporting content generation
- [x] `EXP-*`, `ILL-*`, `TRANS-*`, `COLLAB-*`, `RUNTIME-*`, and `SACRED-*` roadmap requirements were shipped in phases 5 through 8

Audit verdict: no standalone archived milestone audit is retained for `v1.0` in this workspace, so this section is based on the shipped roadmap and the validated product surface recorded in [PROJECT.md](/Users/hprincivil/Projects/scriveno/.planning/PROJECT.md).

## 5. Key Decisions Log

- Fresh-context drafting is a non-negotiable architectural rule because voice fidelity is the core product promise.
- Markdown instructions are the product runtime; there is no compiled application layer.
- Scriveno adapts to the writer’s domain vocabulary rather than forcing generic chapter/scene language across all work types.
- The installer is part of the product surface, not a secondary convenience layer.

## 6. Tech Debt & Deferred Items

- No milestone-specific tech debt log is preserved for `v1.0` in the current workspace.
- Later milestones show that `v1.0` left trust gaps between broad product claims and what the repo could prove directly.
- Runtime-parity confidence and proof-surface rigor were not fully formalized until `v1.3`.

## 7. Getting Started

- **Run the project:** `npx scriveno@latest`
- **Key directories:** `commands/scr/`, `agents/`, `templates/`, `data/`, `docs/`, `test/`
- **Tests:** `npm test`
- **Where to look first:** [README.md](/Users/hprincivil/Projects/scriveno/README.md), [docs/getting-started.md](/Users/hprincivil/Projects/scriveno/docs/getting-started.md), and [docs/architecture.md](/Users/hprincivil/Projects/scriveno/docs/architecture.md)

---

## Stats

- **Timeline:** through 2026-04-07
- **Phases:** 8 / 8 complete
- **Tag:** `v1.0.0`
- **Commits:** 181 reachable at the shipped tag
- **Files changed / diff stats:** unavailable as an isolated milestone range from current retained artifacts
- **Contributors:** current local history is dominated by a single contributor identity

---

This summary is necessarily roadmap-driven because detailed per-phase artifacts for phases `1` through `8` are not retained in this workspace.
