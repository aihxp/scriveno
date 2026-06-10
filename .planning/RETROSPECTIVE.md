# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.7 - Last Mile

**Shipped:** 2026-04-17
**Phases:** 7 | **Plans:** 23 | **Sessions:** 2 (planning + execution in one autonomous run)

### What Was Built

- `templates/sacred/<tradition>/` + `templates/platforms/<platform>/` drop-in extension points - architectural shift enabling contributor extensions without touching core
- `/scr:cleanup` + `/scr:validate` - scaffold-stripping and pre-export gate blocking unresolved markers
- Staged front-matter: auto-computable elements refresh on metadata change; scaffold:true elements excluded until writer opts in
- `/scr:build-ebook` (Pandoc EPUB, EAA accessible) + `/scr:build-print` (Pandoc+Typst PDF) with 8 platform manifests, KDP/IngramSpark page-count guardrails
- 10 sacred tradition profiles (Catholic, Orthodox, Tewahedo, Protestant, Jewish, Islamic-Hafs/Warsh, Pali, Tibetan, Sanskrit) - approval blocks, font stacks, RTL, verse numbering
- 6 cross-domain templates: stage play, picture book, fixed-layout EPUB, Smashwords DOCX, chapbook, poetry submission
- 5 academic LaTeX wrappers (IEEEtran, acmart, llncs, elsarticle, apa7) with kpsewhich pre-flight and tlmgr guidance

### What Worked

- **Architecture-first sequencing:** Landing Phase 29 (extension points) before all downstream phases meant zero re-engineering when tradition/platform features were added in Phases 33-35
- **Milestone audit caught real integration bugs:** The cross-phase integration checker found two wiring bugs (STEP 1.7 -> STEP 1.8 skip, stage_play group gate) that all 1510 unit tests missed - these were control-flow semantics bugs in markdown that tests couldn't see
- **TDD RED->GREEN discipline:** All 7 phases started with a test suite in RED state, then drove implementation GREEN. Made regressions impossible during the wave-based execution
- **Autonomous execution:** Discuss -> plan -> execute -> code review -> fix -> verify -> lifecycle completed in a single session without manual intervention, pausing only for 2 user decisions (gap fix choice, phase archive choice)

### What Was Inefficient

- **SUMMARY.md one-liner extraction fragility:** The `summary-extract` tool grabbed code review bug descriptions and debugging notes from phase summaries instead of clean one-liners, polluting MILESTONES.md. Needed manual cleanup.
- **STATE.md/ROADMAP.md milestone detection mismatch:** `getMilestoneInfo()` reads ROADMAP.md section headings (first `##`-prefixed heading with a version) rather than STATE.md, returning `v1.2` instead of `v1.7` because older milestone sections aren't wrapped in `<details>`. Required manual STATE.md fixes twice.
- **Code review --files fallback:** SUMMARY.md extraction for scoping code review files failed because Phase 35 SUMMARYs use a different format. Had to pass `--files` explicitly.

### Patterns Established

- **Integration checker as milestone gate:** Running a cross-phase integration checker at milestone close (not just per-phase verifiers) is worth the cost - it found bugs that per-phase tests structurally cannot catch.
- **Milestone audit `gaps_found` -> inline fix:** When audit finds integration bugs, fix them inline in the same session rather than creating a new gap-closure phase. For simple wiring fixes (< 2 lines each), a new phase is overkill.
- **Five-wrapper pattern for publisher integration:** Thin Pandoc templates that only declare `\documentclass{CLASS}` + standard boilerplate + Pandoc variables work cleanly for academic publisher class routing. Copy this pattern for future format expansions.

### Key Lessons

1. **Control-flow text in markdown commands is untestable by unit tests.** When the AI agent reads "proceed to STEP 2" vs "proceed to STEP 1.8", there's no automated way to assert which branch it will take. Integration tests must use real agent executions, or the milestone audit's cross-phase checker is the only safety net.
2. **All milestone requirements were delivered with zero npm dependencies.** The architecture constraint (pure skill/command system) held through 7 phases - this is the main constraint to protect in future milestones.
3. **ROADMAP.md section heading format matters for tooling.** Using `###` instead of `##` for milestone sections causes `getMilestoneInfo()` to detect the wrong current milestone. Document this as a ROADMAP format constraint.

### Cost Observations

- Model: Claude Sonnet 4.6 (primary), Opus 4.7 (integration checker)
- Sessions: 1 long autonomous session (~12 hours of processing)
- Notable: All 7 phases executed autonomously in one session - 127 commits from first phase work to milestone tag. The milestone audit + gap fix cycle added ~30 min but prevented shipping two real bugs.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Key Change |
|-----------|--------|------------|
| v1.3 | 4 | Trust-first: narrowed claims to provable surfaces |
| v1.4 | 3 | Research-first: technical writing domain modeled before implementation |
| v1.5 | 3 | Silent installs, Codex skill-native surface |
| v1.6 | 6 | Installer hardening driven by cross-referencing prior installer-hardening releases |
| v1.7 | 7 | Architecture-first sequencing; autonomous multi-phase execution |

### Cumulative Quality

| Milestone | Tests | Zero-Dep Additions |
|-----------|-------|--------------------|
| v1.6 | 1067 | 0 |
| v1.7 | 1510 | 0 |

### Top Lessons (Verified Across Milestones)

1. **Zero-dependency constraint is the right call.** Every milestone has added features without adding npm dependencies. The markdown-first skill system is the architectural moat.
2. **Trust beats breadth on the launch surface.** Multiple milestones (v1.3, v1.4, v1.6, v1.7) converged on the same lesson: narrow, provable claims create more user confidence than ambitious but weakly evidenced breadth.
3. **Architecture changes must land first.** Phase 29 (extension points) -> Phase 32 (build pipelines) -> Phase 33 (tradition content) -> Phase 34/35 (templates) is the correct dependency order. Any deviation would have required re-engineering.
