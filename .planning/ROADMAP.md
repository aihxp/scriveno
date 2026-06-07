# Roadmap: Scriveno

## Current Status

- Active milestone: **v3.1.0 Connectivity** (in release)
- Latest shipped package: **3.0.0** (Climax Generation)
- Latest shipped milestone: **v2.0 Publishing Cover Packaging** (completed 2026-04-18)
- Current repo state: **3.0.0 shipped /scr:climax; the `connectivity` branch wires the craft layer into the workflow (orphan surfaces routed in, producer-consumer loops closed, stale-after-change regeneration fixed) and locks it with a connectivity regression test, releasing as 3.1.0**
- Note: releases 2.1 through 2.8 shipped without per-version milestone entries in this file; this Current Status block is the reconciled truth.
- Next step: finish the 3.1.0 release (merge to main, push, npm publish)

## Milestones

- [x] **v1.0 MVP** - Phases 1-8 (shipped 2026-04-07)
- [x] **v1.1 Generic Platform Support** - Phase 9 (shipped 2026-04-07)
- [x] **v1.2 Documentation** - Phases 10-12 (shipped 2026-04-07)
- [x] **v1.3 Trust & Proof** - Phases 13-16 (shipped 2026-04-09)
- [x] **v1.4 Perplexity & Technical Writing** - Phases 17-19 (shipped 2026-04-09) - [details](MILESTONES.md)
- [x] **v1.5 Runtime Install Reliability** - Phases 20-22 (shipped 2026-04-09)
- [x] **v1.6 Installer Hardening** - Phases 23-28 (shipped 2026-04-16) - [archive](milestones/v1.6-ROADMAP.md)
- [x] **v1.7 Last Mile** - Phases 29-35 (shipped 2026-04-17) - [archive](milestones/v1.7-ROADMAP.md)
- [x] **v1.8 Command Surface Coherence** - Phases 36-38 (shipped 2026-04-18) - [archive](milestones/v1.8-ROADMAP.md)
- [x] **v1.9 Workflow Contract Integrity** - Phases 39-41 (shipped 2026-04-18) - [archive](milestones/v1.9-ROADMAP.md)
- [x] **v2.0 Publishing Cover Packaging** - Phases 42-44 (shipped 2026-04-18) - [archive](milestones/v2.0-ROADMAP.md)
- [x] **v2.9 Craft Layer** - applicability decision tree, derived relationship + conflict maps, plot causality + scene conflict, plot-device lifecycle, worldbuilding depth + entity propagation, snowflake mode, older-project upgrade (shipped 2026-06-06; plan at [craft-layer-PLAN.md](craft-layer-PLAN.md))
- [ ] **v3.0 Climax Generation** - /scr:climax converges conflict, crisis, character arcs, and planted payoffs into earned climax options (in release)

## Archive Notes

- Detailed milestone summaries live in [MILESTONES.md](MILESTONES.md).
- Detailed archived roadmap snapshots live under `.planning/milestones/`.
- Archived phase artifacts now live under `.planning/milestones/v1.7-phases/`, `.planning/milestones/v1.8-phases/`, `.planning/milestones/v1.9-phases/`, and `.planning/milestones/v2.0-phases/`.
- The current shipped baseline includes truthful cover asset contracts, template-driven print-cover guidance, proactive automation checks, runtime smoke checks, agent availability checks, route graph audits, first-run proof docs, release checklist coverage, and integrated regression locks.

## Active Milestone: v3.1.0 Connectivity

3.0.0 shipped `/scr:climax`. The 3.1.0 release wires the craft layer into the workflow: orphan surfaces routed to from their predecessors, producer-consumer loops closed (SEEDS, CONFLICTS, Causal Anchor), stale-after-change regeneration fixed, and a connectivity regression test that fails if any craft command becomes an orphan again. The remaining step is the release: merge to main, push, and npm publish.
