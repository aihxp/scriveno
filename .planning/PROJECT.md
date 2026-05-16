# Scriveno

## What This Is

Scriveno is a spec-driven writing, publishing, and translation pipeline that runs inside AI coding agents. It takes writers from blank page to publication-ready manuscript or technical document set with voice profiling, adaptive work types, autonomous drafting, illustration, translation, and multi-format export. It currently supports 50 work types with tradition-native vocabulary such as chapters, acts, procedures, and surahs.

## Core Value

**Drafted prose sounds like the writer, not like AI.** The Voice DNA system profiles the writer across 15+ dimensions and loads that profile into every drafter agent invocation. If voice fidelity breaks, trust breaks, and no other feature matters.

## Requirements

### Validated

- [x] Core workflow commands (new-work -> discuss -> plan -> draft -> editor-review -> submit -> complete) - v0.3.0
- [x] Adaptive naming system across 50 work types with structural hierarchy - v0.3.0
- [x] Voice DNA system (STYLE-GUIDE.md generation, 15+ dimensions) - v0.3.0
- [x] Drafter agent with fresh-context-per-atomic-unit architecture - v0.3.0
- [x] 5 agent prompts (drafter, researcher, continuity checker, voice checker, plan checker) - v0.3.0
- [x] Context file templates (WORK.md, OUTLINE.md, CHARACTERS.md, THEMES.md, etc.) - v0.3.0
- [x] Constraint system (CONSTRAINTS.json) with command availability, gating, dependencies - v0.3.0
- [x] Installer for Claude Code, Cursor, Gemini CLI - v0.3.0
- [x] Help / progress / next navigation commands - v0.3.0
- [x] Natural language router (/scr:do) - v0.3.0
- [x] Sacred text templates (FIGURES.md, LINEAGES.md, COSMOLOGY.md, etc.) - v0.3.0
- [x] 8 sacred-exclusive commands (concordance, cross-reference, genealogy, etc.) - v0.3.0
- [x] Import existing manuscript command - v0.3.0
- [x] Series bible command - v0.3.0
- [x] Publish wizard command (shell) - v0.3.0
- [x] Profile-writer and voice-test commands - v0.3.0
- [x] Beta reader, continuity check, editor review commands - v0.3.0
- [x] Generic SKILL.md installer path for skill-file platforms - v1.1
- [x] Core documentation suite, feature guides, contributor docs, and architecture docs - v1.2
- [x] Launch-facing shipped-asset inventory and export docs aligned to actual repo surface - v1.3 Phase 13
- [x] Launch-facing root docs narrowed to repo-provable claims and shipped-template truth - v1.3 Phase 13
- [x] Node 20+ installer baseline unified across package metadata, installer UX, runtime docs, and planning docs - v1.3 Phase 14
- [x] Canonical runtime support matrix and support-evidence framing shipped for claimed runtimes - v1.3 Phase 14
- [x] Canonical watchmaker sample-flow proof artifact and proof hub shipped - v1.3 Phase 15
- [x] Voice DNA before/after proof bundle shipped under packaged contents - v1.3 Phase 15
- [x] Launch and onboarding docs now foreground the voice-preservation wedge and proof layer - v1.3 Phase 15
- [x] Trust-critical launch, proof, and runtime surfaces now have release-time regression tests - v1.3 Phase 16
- [x] Packaged proof bundles and shipped export templates are enforced in npm pack dry-run coverage - v1.3 Phase 16
- [x] Perplexity Desktop ships as a guided local-MCP runtime target with explicit support framing - v1.4 Phase 17
- [x] Technical-writing family adds guide, runbook, API reference, and design spec work types with technical-native scaffolding - v1.4 Phase 18
- [x] Perplexity and technical-writing trust surfaces now have count and packaging regression coverage - v1.4 Phase 19
- [x] Silent multi-runtime installer flags shipped for Codex and Claude Code without prompt-only fallback - v1.5 Phase 20
- [x] Codex installs now expose native `$scr-*` skills backed by mirrored installed command markdown - v1.5 Phase 21
- [x] Runtime docs and regression coverage now describe the same Codex and Claude install surfaces the installer writes - v1.5 Phase 22
- [x] Installer file writes are crash-safe via temp-file-then-rename with orphan cleanup - v1.6 Phase 23
- [x] Frontmatter parser handles colons in values and scopes extraction to the `---` block - v1.6 Phase 24
- [x] Settings validated against hand-written schema with migration-before-validation - v1.6 Phase 25
- [x] User-customized settings and templates survive reinstall via field-level merge and content-hash backup - v1.6 Phase 26
- [x] Installed command files use correct invocation syntax per runtime with code-block preservation - v1.6 Phase 27
- [x] All v1.6 hardening behaviors locked by 88 regression tests with requirement-to-test traceability - v1.6 Phase 28

### Validated (v1.8)

- [x] Sacred-exclusive command references now use canonical installed names across source commands, docs, and manifests - v1.8 Phases 36-38 (CMD-01, CMD-03)
- [x] Installer and generic manifest generation now derive from one canonical file-backed command inventory - v1.8 Phase 36 (CMD-02)
- [x] Adapted names are now treated as descriptive labels unless a runtime deliberately installs wrappers - v1.8 Phase 37 (CMD-04, CMD-05)
- [x] Claude Code now consistently uses the flat `/scr-*` command surface in docs and examples - v1.8 Phase 37 (CMD-06, CMD-07, CMD-08)
- [x] Command-surface coherence is now locked by nested-command and dead-reference regression coverage plus contributor naming guidance - v1.8 Phase 38 (CMD-09, CMD-10)

### Validated (v1.7 so far)

- [x] `templates/sacred/<tradition>/` + `templates/platforms/<platform>/` drop-in extension points - v1.7 Phase 29 (ARCH-01, ARCH-02)
- [x] `architectural_profiles` schema in `data/CONSTRAINTS.json` with tradition/platform taxonomies + inference map - v1.7 Phase 29 (ARCH-03)
- [x] `lib/architectural-profiles.js` runtime validator + default-inference (listTraditions, listPlatforms, validateTradition, validatePlatform, inferTradition, inferPlatform) - v1.7 Phase 29 (ARCH-04, ARCH-05)
- [x] Phase 29 locked by 54 regression tests (1132 total) - zero new dependencies
- [x] Export cleanup dry-run/--apply, validate gate (STEP 1.5) in export.md/publish.md - v1.7 Phase 30 (VG-01..VG-05)
- [x] Staged front-matter generation: scaffold:true YAML, STEP 1.6 gate, GENERATE auto-refresh - v1.7 Phase 31 (FM-01..FM-04)
- [x] `/scr:build-ebook` EPUB pipeline (Pandoc, accessibility lang/alt/nav, platform manifests) - v1.7 Phase 32 (BUILD-01..BUILD-03)
- [x] `/scr:build-print` print PDF pipeline (Pandoc+Typst, KDP/Ingram trim sizes, page-count guardrail) - v1.7 Phase 32 (BUILD-04, BUILD-05)
- [x] Platform manifests (KDP, IngramSpark, Apple, B&N, D2D, Kobo, Google, Smashwords) - v1.7 Phase 32 (PLATFORM-01..PLATFORM-03)
- [x] Phase 32 locked by 90 regression tests (1266 total) - zero new dependencies
- [x] All 10 sacred tradition manifests populated with book_order, approval_block, font_stack, rtl, numbering, script - v1.7 Phase 33 (TRAD-01..TRAD-04)
- [x] STEP 1.7 (TRADITION LOADING) added to build-ebook.md and build-print.md - v1.7 Phase 33 (TRAD-05)
- [x] front-matter.md STEP 3.5 approval block scaffold for traditions requiring ecclesiastical approval - v1.7 Phase 33 (TRAD-03-behavioral)
- [x] `/scr:sacred-numbering-format` command for tradition verse citation reference - v1.7 Phase 33 (TRAD-04-behavioral)
- [x] Phase 33 locked by 161 regression tests (1427 total) - zero new dependencies
- [x] Stage play Typst template (Samuel French format, 8.5×11, centered ALLCAPS character names, italic stage directions) - v1.7 Phase 34 (TPL-01)
- [x] Picture book Typst template (8.75×8.75 with 0.125" bleed + 0.25" safe zone, spread pagination) - v1.7 Phase 34 (TPL-02)
- [x] Fixed-layout EPUB CSS + OPF stub (`-epub-layout: pre-paginated`, `rendition:layout`, auto-detect for picture_book) - v1.7 Phase 34 (TPL-03)
- [x] Smashwords DOCX reference doc + companion style spec + `/scr:build-smashwords` command - v1.7 Phase 34 (TPL-04)
- [x] Chapbook Typst template (5.5×8.5, saddle-stitch page-count constraint) - v1.7 Phase 34 (TPL-05)
- [x] Poetry submission DOCX reference doc + companion style spec + `/scr:build-poetry-submission` command (title page, conditional TOC for 5+ poems) - v1.7 Phase 34 (TPL-06)
- [x] STEP 1.8 (work-type template routing) added to build-print.md; `--fixed-layout` flag added to build-ebook.md - v1.7 Phase 34
- [x] Phase 34 locked by 44 regression tests (1471 total) - zero new dependencies
- [x] Five academic LaTeX wrapper templates (IEEEtran, acmart, llncs, elsarticle, apa7) as minimal publisher-class routing wrappers - v1.7 Phase 35 (TPL-07)
- [x] `--platform ieee|acm|lncs|elsevier|apa7` route in build-print producing `.tex` output with two-level kpsewhich pre-flight detection and per-class tlmgr guidance - v1.7 Phase 35 (TPL-07)
- [x] Phase 35 locked by 39 regression tests (1510 total) - zero new dependencies

### Out of Scope

- Real-time collaborative editing (Google Docs style) - complexity outweighs value for CLI tool
- GUI/web interface - Scriveno runs inside existing AI agents, not as a standalone app
- AI model fine-tuning - Voice DNA works via prompt engineering, not model training
- Hosting/cloud storage - all files are local, writer owns everything

## Context

Scriveno is built as a markdown-first skill system. Commands, agents, templates, and constraints are all file-based; the installer (`bin/install.js`) copies those assets into supported AI runtimes. There is no compiled runtime library; the host agent reads the markdown instructions and executes them with its own tools.

The product plan (`SCRIVENO-PRODUCT-PLAN-v0.3.md`) is the canonical source of truth. `data/CONSTRAINTS.json` is the runtime constraint system that governs work type availability, prerequisites, and adaptations.

Milestones v1.0 through v1.2 shipped the core product surface, multi-runtime installer expansion, and a complete documentation suite. The docs verification pass also exposed a new class of product problem: trust gaps between what the product promises and what the repo can prove today.

The most visible gaps were in the export stack and launch proof layer. Phase 13 aligned shipped-asset truth, Phase 14 standardized the Node 20+ installer baseline while making runtime evidence explicit, Phase 15 added the canonical proof layer that makes Scriveno's voice-preservation wedge tangible, and Phase 16 turned those trust surfaces into release-time regression gates. Milestone v1.4 then extended that posture into Perplexity Desktop support and a first-pass technical-writing family without weakening the existing trust model. Milestone v1.8 tightened the command surface the same way: the names Scriveno advertises now match the runtime surfaces it actually installs, and the repo has regression coverage to keep that contract honest.

## Constraints

- **Architecture**: Must remain a pure skill/command system - no compiled code, no runtime dependencies beyond Node.js for the installer
- **Voice fidelity**: Every feature must preserve the Voice DNA pipeline - fresh context per atomic unit, STYLE-GUIDE.md loaded first
- **Backward compatibility**: Existing 28 commands and templates must continue working as new features are added
- **Plan authority**: If a command file contradicts the product plan, fix the command - plan is canonical (section 15 for command specs)
- **Progressive disclosure**: Onboarding asks 3 questions max; depth is optional and additive

## Current State

**Latest shipped milestone:** v2.0 Publishing Cover Packaging (complete 2026-04-18)
**Status:** No active milestone. Scriveno's current shipped baseline includes the v2.0 cover-packaging contract plus the v2.0.12 first-run proof release and is locked by regression tests.

**Current product surface:**
- Installer writes are crash-safe via atomic temp-file-then-rename with orphan cleanup on startup
- Frontmatter parser handles real-world content correctly (colons in values, body content isolation, multiline/array)
- Settings validated against hand-written schema with migration-before-validation to avoid bootstrap deadlocks
- User customizations to settings.json and templates survive reinstall via field-level merge and SHA-256 content-hash backup
- Codex command files now use `$scr-*` invocation syntax, code blocks preserved unchanged
- Sacred-exclusive commands now use canonical installed names across source commands, docs, and generated manifests
- Claude-facing docs now use the flat `/scr-*` surface consistently, matching the runtime-native install contract
- Adapted command names are documented as conceptual labels unless a runtime explicitly installs wrappers
- Command-surface drift is guarded by nested-command and dead-reference regression tests
- Active manuscript draft paths now converge on `.manuscript/drafts/body/` across drafting, import, export, translation, and review flows
- Save and undo now describe clean git-backed checkpoints with `STATE.md` included in the same commit
- Help and trust-facing docs now respect narrower availability constraints and never surface hidden adapted labels as runnable commands
- Pause, resume, and session-report now share one explicit session-boundary contract through `Last actions` markers and `Session metrics`
- Save history, compare, undo, versions, and session-report now resolve from filtered save checkpoints rather than raw `.manuscript/` commit ancestry
- Collaboration discovery and trust-facing docs now present `/scr:track` as the writer-facing entrypoint, with canon-branch-aware guidance instead of `main`-only assumptions
- Public command references now match the live command contracts for `/scr:versions`, `/scr:undo --force`, and session-boundary behavior
- Full export stack: EPUB (Pandoc, accessible), print PDF (Pandoc+Typst, KDP/Ingram trim sizes), academic LaTeX (.tex via 5 publisher wrapper templates), Smashwords DOCX, poetry submission DOCX
- Canonical cover build contract now lives under `.manuscript/build/` with separate ebook, paperback, and hardcover deliverables
- Publishing/build docs now treat print-cover geometry as template-driven from live platform tools rather than hard-coded spine math
- Build, export, publish, command-reference, and shipped-asset surfaces now agree on the same cover workflow contract
- Shared proactive automation checks now expose status, safe apply reporting, runtime smoke checks, agent availability checks, and route graph audits across installer runtimes
- Sacred tradition profiles for 10 traditions with book-order, approval-block, font stack, RTL, numbering
- Cross-domain templates: stage play, picture book, fixed-layout EPUB, chapbook, poetry submission, academic (IEEE/ACM/LNCS/Elsevier/APA7)
- Regression tests lock shipped behavior with requirement-to-test traceability

## Latest Milestone: v2.0 Publishing Cover Packaging

**Goal:** Make Scriveno's cover workflow production-ready by defining truthful ebook, paperback, and hardcover cover deliverables, wiring them into `.manuscript/build/`, and aligning publishing/build docs with real platform requirements.

**Outcome shipped:**
- Canonical cover asset contract under `.manuscript/build/` for ebook front covers, paperback full wraps, and hardcover case wraps
- Truthful publishing/build guidance for RGB ebook covers, CMYK PDF/X-1a print wraps, bleed rules, and template-driven spine widths
- Build/export/publish surfaces wired to the canonical cover files instead of legacy output paths
- Release-facing trust docs now distinguish bundled export templates from project-specific cover assets
- New regression suites now lock cover asset paths, print spec truth, and build/trust-surface alignment

**Stats:** 3 phases, 9 plans, later hardened through v2.0.12 with first-run proof and release-verification regression coverage, zero new dependencies

## Previous Milestone: v1.9 Workflow Contract Integrity

**Goal:** Restore internal workflow truth so Scriveno's core commands agree on where drafts live, save/undo leave the manuscript state clean, and help surfaces only advertise commands the current project can actually run.

**Outcome shipped:**
- Draft-producing and draft-consuming commands now converge on the canonical `.manuscript/drafts/body/` source path
- `/scr:save` and `/scr:undo` now describe clean checkpoints with `STATE.md` included inside the same save/undo commit
- Help and trust-facing docs now honor command-level constraints such as `nonfiction_only` and `comic_only`
- Unsupported adapted labels no longer appear as surfaced command behavior when the base command is hidden for that group
- New workflow-contract regression coverage now locks draft paths, save/undo sequencing, and constrained command visibility
- Follow-on hardening after archive also locked save-history filtering, session-boundary markers, branch-agnostic canon resolution, and track/help trust surfaces without reopening the milestone scope

**Stats:** 3 phases, 9 plans, 1580 regression tests in the then-current repo state, zero new dependencies

## Earlier Milestone: v1.8 Command Surface Coherence

**Goal:** Make Scriveno's command surface truthful and runtime-native so every documented command name is runnable in the host that advertises it.

**Outcome shipped:**
- Sacred-exclusive commands now resolve to the same names the installer actually exposes, including canonical `/scr:sacred:*` references for sacred-only tools
- Generic manifest output now derives from the same file-backed inventory as runtime installs, eliminating phantom sacred top-level commands
- Claude-facing docs and examples now use a flat `/scr-*` surface consistently, following the runtime-native pattern requested by the user
- Adapted command names are now explained as conceptual labels unless a runtime deliberately installs wrappers, avoiding misleading alias promises
- New regression coverage now catches dead sacred refs, adapted-label slash drift, and nested command-surface omissions before release

**Stats:** 3 phases, 7 plans, 1537 total tests, zero new dependencies

## Next Milestone Goals

- Choose the next product focus from the shipped v2.0 baseline instead of reopening already-shipped cover-contract work
- Preserve the canonical draft-path, save-history, constrained-availability, and cover-packaging contracts while extending the product
- Keep trust surfaces narrower and provable: do not claim bundled templates, runtime parity, or printer geometry Scriveno does not actually ship

<details>
<summary>Archived milestone context: v1.4 Perplexity & Technical Writing</summary>

**Goal:** Extend Scriveno's runtime surface to Perplexity while defining a research-backed technical-writing expansion that fits the existing adaptive work-type system.

**Target features:**
- Add installer support for Perplexity as a named runtime target with support-level framing consistent with `docs/runtime-support.md`
- Add installer support for Perplexity Desktop if its path model differs from the CLI/runtime entry
- Research the technical-writing document families Scriveno should support before implementing new work types or command adaptations
- Translate that research into scoped requirements for technical-writing work types, context files, and publishing/export expectations

**Key context:**
- The milestone should preserve the markdown-first, zero-runtime-dependency architecture
- Runtime additions must follow the same "installer target, not parity proof" discipline established in v1.3
- Technical-writing support should be research-first so document taxonomy and table-stakes are based on real technical-writing workflows rather than guessed from adjacent prose types

</details>

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fresh context per atomic unit (drafter) | Prevents voice drift, context bloat; keeps each unit at its best | [x] Good |
| Markdown-only architecture (no compiled code) | Maximum portability across AI agents; no build step needed | [x] Good |
| CONSTRAINTS.json as single source for command availability | One file controls all work type adaptations; easy to extend | [x] Good |
| Ship npm + polish in parallel | Get npx working early for feedback while improving experience | [x] Good |
| GSD-derived phase decomposition | Product plan has 10 phases but GSD regrouped into 8 for standard granularity | [x] Good |
| Generic SKILL.md installer for platforms without command directories | Manus and future platforms can use Scriveno without needing a proprietary command system | [x] Good |
| Trust beats breadth on the launch surface | Narrow, provable claims create more confidence than ambitious but weakly evidenced breadth | [x] Good |
| Guided runtime targets can be first-class when their setup model is explicit | Some host surfaces are real but do not expose writable command registries; guided setup is better than fake parity | [x] Good |
| Technical writing should start as a small, domain-native family | A narrow set of real document types produces better adaptive behavior than one vague catch-all type | [x] Good |
| Codex should be treated as a skill-native runtime, not a slash-command clone | Match the host's real discovery surface while keeping installed command markdown as the behavior source of truth | [x] Good |
| Silent installs must clean only Scriveno-owned runtime outputs | Reliability gains are not worth risking user-managed host files | [x] Good |
| Runtime command names must only advertise installable surfaces | A guide that points at dead command names erodes trust faster than a missing feature | [x] Good |
| Claude Code should follow a flat `/scr-*` surface, mirroring GSD's runtime-native style | Flat slash commands are easier to discover and match the upstream host conventions Scriveno now claims to support | [x] Good |
| Cover deliverables should live under `.manuscript/build/` as project assets | Writers need one canonical delivery surface that is separate from prompts, bundled templates, and staging output | [x] Good |
| Print-cover geometry must stay template-driven | Platform cover templates are the authoritative source for wrap width and spine measurements; static formulas would erode trust | [x] Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-18 - v2.0 Publishing Cover Packaging shipped and archived*
