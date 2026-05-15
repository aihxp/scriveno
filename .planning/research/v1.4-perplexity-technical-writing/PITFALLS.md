# Domain Pitfalls

**Domain:** Perplexity runtime support and technical-writing expansion for Scriveno
**Researched:** 2026-04-09
**Overall confidence:** MEDIUM-HIGH

This brief is intentionally narrow. It focuses on the ways Scriveno is most likely to break trust, architecture, or milestone scope while adding Perplexity support and technical-writing work types to an existing markdown-first writing system.

## Critical Pitfalls

### Pitfall 1: Treating Perplexity like another filesystem runtime
**Type:** Architecture + product
**Confidence:** MEDIUM
**Absorb in phase:** Phase A - Perplexity Runtime Discovery & Support Policy

**What goes wrong:** Scriveno adds a `perplexity` entry to `bin/install.js` using the existing `commands` or `skills` model and invents a local install path without proof.

**Why it happens:** The current installer only knows two runtime shapes:
- command-directory runtimes
- SKILL.md manifest runtimes

Perplexity’s documented surfaces are UI-managed features such as Spaces, Tasks, AI Profile, model/source selection, and Comet Shortcuts. I could not find official documentation for a local command-directory or SKILL-style import path.

**Consequences:** The installer may “support” Perplexity in name only, `docs/runtime-support.md` becomes aspirational instead of factual, and Scriveno repeats the exact credibility problem Phase 14 was created to prevent.

**Prevention:** Do a discovery-first phase before any installer entry lands. Require one of these outcomes:
- an official, documented install surface with path proof
- a new support class such as `manual_ui_runtime` or `shortcut_template_runtime`
- an explicit decision that Perplexity is documentation-only guidance, not a copy-based installer target

**Detection:** Any PR that adds a Perplexity runtime key before it also adds source-backed install mechanics, support-level wording, and matching regression tests is drifting into overclaiming.

### Pitfall 2: Collapsing Perplexity web, desktop, and Comet into one “runtime”
**Type:** Product + documentation
**Confidence:** MEDIUM
**Absorb in phase:** Phase A - Perplexity Runtime Discovery & Support Policy

**What goes wrong:** The milestone treats “Perplexity runtime”, “Perplexity Desktop”, and “Comet” as one interchangeable host environment.

**Why it happens:** Scriveno’s existing runtime matrix is keyed around install path shapes, but Perplexity’s documented capabilities are feature- and plan-dependent. Spaces, Tasks, file sources, connectors, model selection, and Comet Shortcuts do not map cleanly to a single host-runtime abstraction.

**Consequences:** Docs promise parity that does not exist, onboarding tells users to expect the wrong setup flow, and later verification cannot say what was actually supported on April 9, 2026.

**Prevention:** Split the milestone into separately named support surfaces before implementation:
- Perplexity web workflow
- Perplexity Desktop workflow
- Comet Shortcuts workflow

Only merge them later if the repo can prove identical behavior.

**Detection:** If one runtime matrix row tries to cover multiple setup paths, UI surfaces, or plan-gated features, the abstraction is too coarse.

### Pitfall 3: Treating Comet Shortcuts as equivalent to Scriveno commands
**Type:** Architecture
**Confidence:** HIGH
**Absorb in phase:** Phase B - Perplexity Adapter Workflow

**What goes wrong:** Scriveno assumes a Comet Shortcut is the same thing as `/scr:new-work` or `/scr:draft`.

**Why it happens:** Perplexity’s own docs describe Shortcuts as reusable prompts that expand at submit time, can be edited in settings, can be combined, and do not auto-execute. That is much closer to prompt macros than to Scriveno’s current installed command files.

**Consequences:** Command semantics blur. A “command” can silently inherit extra user text, mixed shortcuts, or changed model/source settings. That weakens determinism and makes bug reports hard to reproduce.

**Prevention:** Define an adapter contract before implementation:
- what a Scriveno command becomes in Perplexity
- what guarantees are lost
- which commands are safe as shortcuts
- which commands require guided manual steps instead

Preserve the language `workflow template` or `shortcut recipe` unless the host truly executes commands with equivalent boundaries.

**Detection:** If a Perplexity implementation assumes atomic command behavior but still allows arbitrary shortcut stacking and pre-submit edits, the adapter is underspecified.

### Pitfall 4: Breaking Voice DNA by leaning on persistent Perplexity memory
**Type:** Product + architecture
**Confidence:** HIGH
**Absorb in phase:** Phase B - Perplexity Adapter Workflow

**What goes wrong:** Scriveno pushes Voice DNA into AI Profile, Space instructions, or long-lived thread memory and stops explicitly loading `STYLE-GUIDE.md` first for each atomic drafting unit.

**Why it happens:** Perplexity emphasizes persistent personalization and contextual memory. Scriveno’s core value depends on the opposite discipline for drafting: fresh context per atomic unit, with the voice guide loaded first.

**Consequences:** Voice drifts across units, stale instructions linger after the writer updates their voice profile, and the product breaks its central trust claim while seeming to work.

**Prevention:** Preserve a hard separation:
- persistent Perplexity settings may hold convenience preferences
- voice-critical drafting context must still be injected explicitly, per unit
- `STYLE-GUIDE.md` remains the first loaded writing artifact in any Perplexity drafting workflow

If Perplexity support cannot preserve that invariant, it should ship as research or review support only, not as full drafting parity.

**Detection:** If a Perplexity draft path can run without an explicit, current `STYLE-GUIDE.md` handoff, the milestone is violating Scriveno’s core value.

### Pitfall 5: Using Spaces as a dumping ground for whole-project context
**Type:** Product + security + architecture
**Confidence:** HIGH
**Absorb in phase:** Phase B - Perplexity Adapter Workflow

**What goes wrong:** The implementation uploads the whole manuscript, voice files, planning artifacts, and supporting research into a shared Space and treats that as normal operating context.

**Why it happens:** Spaces are attractive because they support custom instructions, attached files, collaborators, and web/file search. But they also have plan-dependent file limits, shared-access implications, and persistent context that is broader than Scriveno’s current minimal-context discipline.

**Consequences:** Sensitive writer material becomes more broadly accessible than expected, context becomes noisy and stale, and Perplexity support starts favoring workspace persistence over deliberate file loading.

**Prevention:** Define a `least-context` policy for Perplexity:
- prefer thread attachments over always-on shared context
- upload only the files needed for the current task
- separate collaborative research spaces from voice-critical drafting workflows
- document file-sharing implications and plan limits up front

**Detection:** If the happy path requires a shared Space with many permanent uploads, the design is optimizing convenience at the expense of voice control and privacy clarity.

### Pitfall 6: Treating technical writing as “academic with a new label”
**Type:** Product
**Confidence:** HIGH
**Absorb in phase:** Phase C - Technical-Writing Taxonomy & Constraints

**What goes wrong:** Scriveno adds technical-writing work types by reusing the `academic` group and only renaming a few labels.

**Why it happens:** The repo already has an academic group with `research_paper`, `journal_article`, and `white_paper`, so it is tempting to wedge technical docs into that existing taxonomy. But technical-writing ecosystems separate different document jobs: tutorial, how-to, reference, and explanation have different structures, prompts, and success criteria.

**Consequences:** Users writing runbooks, API reference, onboarding guides, troubleshooting docs, RFCs, ADRs, or internal SOPs inherit the wrong defaults:
- `ARGUMENT-MAP.md` where they need information architecture or procedure flow
- `peer-review` / `citation-check` when they need technical accuracy or reproducibility review
- academic tone where they need operator clarity

**Prevention:** Add a distinct technical-writing taxonomy before adding work types. Decide explicitly whether Scriveno needs:
- one `technical` group with multiple doc families
- or separate groups for product docs and engineering docs

Do not ship new technical work types until their file adaptations, command adaptations, and export expectations are defined.

**Detection:** If a proposed work type still depends on academic naming such as `peer-review`, `ARGUMENT-MAP.md`, or citation-first logic, it has not been properly scoped.

### Pitfall 7: Reusing creative/academic manuscript scaffolds for technical docs
**Type:** Architecture + product
**Confidence:** HIGH
**Absorb in phase:** Phase D - Technical-Writing Context Files & Command Adaptations

**What goes wrong:** `/scr:new-work` creates manuscript files that are sensible for prose or academic writing but nonsensical for technical documentation.

**Why it happens:** Scriveno’s adaptation system is powerful, but it currently assumes manuscript-style context files. Technical docs usually need scope, audience, prerequisites, system boundaries, command examples, error cases, compatibility notes, and source-of-truth references rather than character/world/theme scaffolds.

**Consequences:** The first-run experience feels fake, prompts pull the wrong context, and the user has to fight the system to write practical documentation.

**Prevention:** Design technical-writing-specific context files before command implementation. At minimum, define equivalents for:
- audience
- scope / non-scope
- prerequisites
- environment / version matrix
- procedures
- reference inventory
- examples / sample outputs
- review checklist

Map existing commands only where they still make sense; hide the rest.

**Detection:** If a tech-doc project still creates `CHARACTERS.md`, `WORLD.md`, `THEMES.md`, or even `CONCEPTS.md` without a clear reason, the adaptation layer is incomplete.

### Pitfall 8: Adding technical docs without a stronger factual-verification loop
**Type:** Verification
**Confidence:** HIGH
**Absorb in phase:** Phase F - Verification, Trust Regression & Proof

**What goes wrong:** Scriveno adds technical-writing support, but the verification layer still mostly checks writing quality, runtime-claim integrity, and packaging truth rather than factual correctness of commands, examples, and versions.

**Why it happens:** Technical docs are source-sensitive. Google’s technical-writing guidance emphasizes audience, scope, and document goals; Microsoft’s reference and procedure guidance emphasizes consistent structure and accurate operational detail. Perplexity also explicitly tells users to validate sourced answers against citations.

**Consequences:** The output can sound polished while being operationally wrong. That is worse for technical docs than for creative drafting because the reader may execute the instructions.

**Prevention:** Add a technical-doc verification layer before broad rollout:
- command examples checked for syntax and platform assumptions
- versioned claims checked against supplied sources
- doc-type-specific review prompts for tutorial/how-to/reference/explanation
- regression tests that ensure hidden/available commands and file adaptations match the new technical group

**Detection:** If the milestone can generate a runbook or API guide but cannot verify command syntax, version references, or source grounding, it is shipping appearance without trust.

## Moderate Pitfalls

### Pitfall 9: Leaving the export matrix in manuscript mode
**Type:** Product + architecture
**Confidence:** HIGH
**Absorb in phase:** Phase E - Technical-Document Export Surface

**What goes wrong:** New technical-writing work types inherit export and publish options designed for books, academic submissions, or query packages.

**Prevention:** Update `data/CONSTRAINTS.json` exports for technical docs before exposing the work types. Decide which outputs are valid:
- Markdown bundle
- HTML
- PDF
- DOCX
- maybe EPUB for some handbook-style docs

Hide KDP, Ingram, query, and submission presets unless a technical-writing subtype actually needs them.

### Pitfall 10: Documenting support claims faster than the repo can prove them
**Type:** Documentation
**Confidence:** HIGH
**Absorb in phase:** Phase F - Verification, Trust Regression & Proof

**What goes wrong:** README, onboarding, `AGENTS.md`, or runtime docs start saying “Perplexity is supported” before the matrix, installer behavior, and tests agree on what that means.

**Prevention:** Keep the Phase 14 posture:
- one canonical runtime matrix
- conservative support-level wording
- no parity language without proof
- no host behavior claims without a reproducible verification artifact

### Pitfall 11: Forgetting that technical docs need audience contracts, not just style contracts
**Type:** Product
**Confidence:** HIGH
**Absorb in phase:** Phase D - Technical-Writing Context Files & Command Adaptations

**What goes wrong:** The prompt system preserves author voice but does not explicitly lock audience, prerequisite level, and task goal for technical docs.

**Prevention:** For technical-writing work types, pair `STYLE-GUIDE.md` with an explicit document contract that states:
- target audience
- prerequisite knowledge
- intended outcome
- supported environment / version
- scope and non-scope

Style should remain subordinate to clarity and task completion.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase A - Perplexity Runtime Discovery & Support Policy | Inventing a copy-based installer target without a documented install surface | Require source-backed runtime modeling before touching `bin/install.js` or `docs/runtime-support.md` |
| Phase A - Perplexity Runtime Discovery & Support Policy | Treating web, desktop, and Comet as one host | Define separate support rows and proof obligations per surface |
| Phase B - Perplexity Adapter Workflow | Shortcut macros drifting from Scriveno command semantics | Write an adapter spec that states which commands become shortcuts, guided workflows, or unsupported |
| Phase B - Perplexity Adapter Workflow | Voice DNA diluted by AI Profile, Spaces, or thread memory | Keep per-unit explicit `STYLE-GUIDE.md` loading as a hard invariant |
| Phase B - Perplexity Adapter Workflow | Shared Spaces becoming default storage for sensitive project context | Adopt a least-context upload policy and document collaboration/privacy implications |
| Phase C - Technical-Writing Taxonomy & Constraints | Reusing the academic group for technical docs | Create a dedicated taxonomy grounded in doc families, not just tone |
| Phase D - Technical-Writing Context Files & Command Adaptations | Nonsensical scaffold files and wrong command names | Define technical-doc-specific files, hidden commands, and review verbs before implementation |
| Phase D - Technical-Writing Context Files & Command Adaptations | Voice preserved but audience/task framing missing | Add audience, scope, prerequisites, and environment contracts to the prompt context |
| Phase E - Technical-Document Export Surface | Book/publishing exports leaking into technical-doc projects | Re-scope export availability and publish presets in `CONSTRAINTS.json` |
| Phase F - Verification, Trust Regression & Proof | New support claims drifting across docs, installer, and tests | Extend trust-regression coverage to Perplexity rows, technical-doc constraints, and doc surfaces |
| Phase F - Verification, Trust Regression & Proof | Technical docs shipping without factual checks | Add source-grounding, command/example validation, and version-aware review steps |

## Sources

### Repo sources
- `.planning/PROJECT.md` - active milestone goals and trust constraints
- `docs/runtime-support.md` - canonical runtime-support language and proof posture
- `docs/work-types.md` - current work-type taxonomy and adaptation model
- `data/CONSTRAINTS.json` - current group/work-type/command/export logic
- `bin/install.js` - current installer architecture only supports `commands` and `skills`
- `test/installer.test.js`
- `test/phase16-trust-regression.test.js`

### External sources
- Perplexity Help Center, `What are Spaces?` - https://www.perplexity.ai/help-center/en/articles/10352961-what-are-spaces
  - HIGH confidence for Spaces capabilities, file limits, and sharing model
- Perplexity Help Center, `Comet Shortcuts` - https://www.perplexity.ai/help-center/en/articles/11897890-comet-shortcuts
  - HIGH confidence for shortcut behavior and management model
- Perplexity Help Center, `Perplexity Tasks` - https://www.perplexity.ai/help-center/en/articles/11521526-perplexity-tasks
  - HIGH confidence for task/scheduling behavior in Spaces
- Perplexity Help Center, `How does Perplexity work?` - https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work
  - HIGH confidence for real-time search, citations, model selection, and contextual memory
- Perplexity Help Center, `What is Pro Search?` - https://www.perplexity.ai/help-center/en/articles/10352903-what-is-pro-search
  - HIGH confidence for source/citation and research-mode behavior
- Perplexity Help Center, `Profile settings` - https://www.perplexity.ai/help-center/en/articles/10352993-profile-settings
  - HIGH confidence that AI Profile is persistent preference memory, not a document-loading substitute
- Perplexity Help Center, `Introduction to File Connectors for Enterprise Organizations` - https://www.perplexity.ai/help-center/en/articles/10672063-introduction-to-file-connectors-for-enterprise-organizations
  - HIGH confidence for supported synced file types and shared search behavior
- Google Technical Writing, `Audience` - https://developers.google.com/tech-writing/one/audience
  - HIGH confidence for audience-first document design
- Google Technical Writing, `Documents` - https://developers.google.com/tech-writing/one/documents
  - HIGH confidence for scope, non-scope, audience, and opening-summary requirements
- Google Developer Documentation Style Guide, `Code samples` - https://developers.google.com/style/code-samples
  - HIGH confidence for code-sample handling in markdown technical docs
- Google Developer Documentation Style Guide, `About this guide` - https://developers.google.com/style
  - HIGH confidence for project-specific style precedence
- Microsoft Style Guide, `Writing step-by-step instructions` - https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions
  - HIGH confidence for procedure-specific structure
- Microsoft Style Guide, `Reference documentation` - https://learn.microsoft.com/en-us/style-guide/developer-content/reference-documentation
  - HIGH confidence for structured reference content expectations
- Diataxis, `Start here` - https://diataxis.fr/start-here/
  - HIGH confidence for the tutorial/how-to/reference/explanation model
- Diataxis, `The map` - https://diataxis.fr/map/
  - HIGH confidence for the risk of blurring documentation forms
