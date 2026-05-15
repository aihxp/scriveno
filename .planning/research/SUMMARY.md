# Project Research Summary

**Project:** Scriveno -- Creative Writing, Publishing, and Translation Pipeline
**Domain:** CLI-based AI creative writing skill system (markdown commands executed by AI coding agents)
**Researched:** 2026-04-06
**Confidence:** HIGH

## Executive Summary

Scriveno is a pure markdown skill system with no runtime dependencies -- the AI agent (Claude Code, Cursor, Gemini CLI) reads command markdown and executes shell commands. Building its remaining pipeline (export, illustration, translation, collaboration) means orchestrating external CLI tools (primarily Pandoc + Typst for export), generating structured prompts (for illustration), and extending the existing fresh-context-per-unit agent pattern (for translation). The competitive landscape confirms that no existing tool covers blank-page-to-published-book in a single system. Writers currently stitch together 3-5 tools (Scrivenoer for organization, ProWritingAid for editing, Atticus/Vellum for formatting, manual KDP upload). Scriveno's differentiator is pipeline completeness with voice fidelity, not feature-by-feature superiority.

The recommended approach is Pandoc as the universal conversion backbone with Typst as the PDF engine (27x faster than XeLaTeX, single 30MB binary vs. 4-6GB TeX Live, accessible PDF/UA-1 by default). All export formats route through Pandoc. Illustration should generate detailed prompts rather than call image APIs directly, keeping Scriveno dependency-free. Translation should follow the drafter's fresh-context-per-unit pattern with a dedicated translator agent, glossary, and translation memory. The collaboration system wraps git in writer-friendly abstractions controlled by a developer_mode toggle.

The top risks are: (1) broken first-run `npx` experience killing adoption before users see any value, (2) export formats that look correct locally but fail platform validation (KDP, EPUBCheck, IngramSpark), (3) voice DNA drift in generated utility text (blurbs, synopses, front matter) undermining the core value proposition, and (4) RTL/CJK support chosen too late -- PDF library decisions in Phase 5 that cannot handle bidirectional text force a rewrite in Phase 7. All four are preventable with upfront testing, validation steps, and deliberate library selection.

## Key Findings

### Recommended Stack

Scriveno invokes external CLI tools via the AI agent's Bash capability -- it does not `npm install` anything. Pandoc is the backbone for all document conversion. Typst replaces LaTeX for PDF generation. Illustration workflows generate prompts for current image APIs rather than hard-coding one provider call into Scriveno. Translation uses DeepL + Google Cloud Translation APIs for machine passes, with the AI agent itself for literary-quality translation.

**Core technologies:**
- **Pandoc 3.x**: Universal document converter (EPUB, DOCX, PDF, LaTeX) -- de facto standard, production-quality output, massive ecosystem
- **Typst current stable**: PDF engine with a smaller install footprint than TeX Live and native Pandoc support via `--pdf-engine=typst`
- **OpenAI GPT Image 1.5 API**: Primary image-model reference for prompt structure. Current OpenAI docs describe it as the latest GPT Image model, but Scriveno should keep provider calls external and verify current pricing before release work.
- **DeepL API Pro + Google Cloud Translation v3**: Translation engines -- DeepL for European language quality, Google for 130+ language coverage
- **Afterwriting CLI + Screenplain**: Screenplay tools -- Fountain-to-PDF and Fountain-to-FDX respectively (MEDIUM confidence, sporadic maintenance)

**Critical version note:** Scriveno's installer baseline should be `>=20.0.0` / Node.js 20+. For illustration, prefer the current GPT Image docs for new work and treat DALL-E-first workflows as legacy-supported fallback paths. For npm publishing, avoid classic tokens and use scoped granular credentials or a future trusted-publishing release workflow.

### Expected Features

**Must have (table stakes):**
- Writer mode (hide git from non-technical writers) -- instant drop-off without this
- Save/history/undo abstractions over git -- every writing tool has versioning
- Autopilot guided mode ("write the next chapter, check in after")
- Character management (sheets, cast list) -- every competitor has this
- Line edit and copy edit -- without this, Scriveno is "drafting only"
- Export to DOCX and PDF -- manuscript is trapped in markdown without this
- Front/back matter generation -- professional book structure expected
- KDP/EPUB export -- the literal endpoint of self-publishing
- Blurb and synopsis generation -- most-requested AI writing feature

**Should have (differentiators):**
- Autopilot full-auto with quality gates (voice drift, continuity checks) -- genuinely novel
- Session pause/resume with full context restoration
- Character voice samples for testing before drafting
- World-building with consistency enforcement
- Translation pipeline with glossary management and back-translation verification
- Sensitivity review -- no mainstream tool offers this
- Sacred text support (13 work types, 8 exclusive commands) -- unserved market

**Defer (v2+):**
- Real-time collaborative editing (requires server architecture)
- Built-in image generation (keep as prompt generation)
- GUI or web interface (invest in CLI UX instead)
- AI model fine-tuning (Voice DNA via prompt engineering is sufficient)

### Architecture Approach

All new pipelines follow the existing orchestrator-delegate pattern: command markdown reads context files and CONSTRAINTS.json, then delegates to agents (for AI-generated content), shell commands (for external tools), or sub-commands (for sub-pipelines). The export pipeline uses a router pattern -- `export.md` dispatches to format-specific sub-commands in `commands/scr/export/`. Three new agents are needed: illustrator (prompt generation), translator (fresh-context-per-unit translation), and assembler (manuscript assembly from drafts). The `.manuscript/` directory remains the canonical data layer, extended with `output/`, `art/`, and `translations/{lang}/` subdirectories.

**Major components:**
1. **Export Pipeline** -- Assembles manuscript from drafts, converts via Pandoc/Typst to target formats, validates output
2. **Illustration Pipeline** -- Generates structured image prompts from character/setting data + art direction (prompt-not-product pattern)
3. **Translation Pipeline** -- Translates unit-by-unit with fresh context, manages glossary and translation memory, verifies via back-translation
4. **Collaboration System** -- Wraps git in writer-friendly abstractions (`save`, `history`, `compare`, `undo`), manages revision tracks with `scriveno/` branch prefix
5. **Publish Orchestrator** -- Coordinates multi-step publishing with presets (KDP, IngramSpark, submission) as primary interface

### Critical Pitfalls

1. **Broken `npx` first-run** -- Test in clean environments before every publish; `npm pack --dry-run` to verify tarball contents; ensure exact shebang format; test on Node 20 and 22
2. **Export formats failing platform validation** -- Run EPUBCheck programmatically; ship custom Pandoc reference.docx with Shunn manuscript formatting; implement exact KDP spine formula dynamically; build per-platform validation checklists
3. **Voice DNA drift in utility text** -- Load STYLE-GUIDE.md for ALL generated text including blurbs, synopses, and front matter; run voice-check as post-generation validation step
4. **Illustration character inconsistency** -- Generate and approve character reference sheets BEFORE any scene illustrations; include character visual descriptions in every prompt; never auto-approve generated images
5. **RTL/CJK chosen too late** -- Verify Pandoc+Typst BiDi support during Phase 5 library selection, not Phase 7; test with real Arabic/Hebrew/CJK content early; sacred text work types require RTL as non-optional

## Implications for Roadmap

Based on combined research, the following phase structure aligns with dependency chains, architecture patterns, and risk mitigation.

### Phase 2: Autopilot and Writer Mode
**Rationale:** Highest-impact UX improvements. Writer mode removes the adoption barrier for non-technical writers. Autopilot guided mode is the most natural "what AI adds" entry point. Both depend only on Phase 1 (complete).
**Delivers:** Writer-friendly git abstractions (save/history/undo), autopilot guided mode, session pause/resume
**Addresses:** Writer mode toggle, save/history/undo, autopilot guided, session pause/resume
**Avoids:** Defer autopilot full-auto until voice-check and continuity-check exist (Phase 4 dependency)

### Phase 3: Structure and Character Tools
**Rationale:** Character management is table stakes. Plot/structure visualization is expected. These create the data (CHARACTERS.md, WORLD.md) that downstream phases (illustration, translation) depend on.
**Delivers:** Character sheets, plot graphs, voice samples, world-building
**Addresses:** new-character, character-sheet, plot-graph, character-voice-sample, build-world
**Avoids:** Relationship map and subplot map deferred until core character/structure tools prove out

### Phase 4: Quality and Review
**Rationale:** Editing tools complete the drafting-to-polished-manuscript loop. Voice-check and continuity-check are prerequisites for autopilot full-auto mode. Must come before export so exported manuscripts are polished.
**Delivers:** Line edit, copy edit, continuity check, voice check, beta reader simulation
**Addresses:** Line edit, copy edit, continuity-check, voice-check, beta-reader
**Avoids:** Voice DNA drift pitfall -- establishes the voice-check pattern before export-adjacent generation begins

### Phase 5: Export and Publishing Pipeline
**Rationale:** Export is the foundation for everything downstream (illustration packages, translation multi-publish, collaboration version comparison). Requires Pandoc + Typst decisions upfront. Must account for RTL/CJK needs of Phase 7.
**Delivers:** DOCX, PDF, EPUB, markdown export; front/back matter; blurb/synopsis; KDP and submission packages
**Uses:** Pandoc 3.x, current stable Typst, custom reference.docx and Typst templates
**Implements:** Export pipeline (router pattern with format-specific sub-commands), assembly command, metadata generation
**Avoids:** Platform validation failures (EPUBCheck, KDP spine formula); Pandoc as hidden dependency (detect and guide installation); publishing wizard overwhelm (presets as primary interface)

### Phase 6: Illustration Pipeline
**Rationale:** Cover art prompts needed for complete KDP/IngramSpark packages. Depends on CHARACTERS.md and WORLD.md from Phase 3. Follows prompt-not-product pattern.
**Delivers:** Art direction document, cover art prompts (with calculated KDP dimensions), character reference sheets, interior illustration prompts
**Uses:** OpenAI GPT Image 1.5 API reference for prompt structure; illustrator agent
**Avoids:** Character inconsistency (reference sheets built first); spine width baked in too early (modular cover components, recalculate at export)

### Phase 7: Translation Pipeline
**Rationale:** Most complex pipeline. Depends on export (for multi-language output) and quality tools (voice-check pattern). Smallest initial user base, so building later is correct.
**Delivers:** Glossary management, unit-by-unit translation, cultural adaptation, back-translation verification, translation memory, multi-language export
**Uses:** DeepL API Pro, Google Cloud Translation v3, translator agent (fresh-context pattern)
**Implements:** Translation pipeline with three tiers (literary, accelerated, volume)
**Avoids:** Voice flattening (STYLE-GUIDE.md in translation prompts); stale TM entries (version-tracked translation memory); RTL/CJK failures (verified in Phase 5 library selection)

### Phase 8: Collaboration System
**Rationale:** Git-based revision tracks require continuity-check (Phase 4) for merge validation. Lower priority for solo writers (primary persona), but valuable for editor-writer workflows.
**Delivers:** Revision tracks (create/switch/compare/merge), writer-mode conflict resolution, revision proposals
**Implements:** Collaboration system with `scriveno/` branch namespacing, prose-formatted conflict resolution

### Phase 9: Multi-Runtime and Polish
**Rationale:** Runtime-agnostic by design -- adding runtimes is an installer concern. Polish and academic features round out the platform.
**Delivers:** Additional runtime support (Codex, OpenCode, Copilot, Windsurf), writer-profile system, manager command center

### Phase 10: Sacred Text Support
**Rationale:** Most niche audience, highest complexity, depends on translation (Phase 7) and publishing (Phase 5). 13 work types, 8 exclusive commands, 10 voice registers -- deep vertical for an unserved market.
**Delivers:** Sacred work types, voice registers, sacred-specific commands, sacred translation pipeline
**Avoids:** Doctrinal sensitivity (formal/dynamic equivalence as explicit modes, human review gates)

### Phase Ordering Rationale

- **Dependency chain drives order:** Writer mode (P2) enables adoption -> character/structure tools (P3) create data -> quality tools (P4) polish content -> export (P5) produces output -> illustration (P6) adds visual assets -> translation (P7) reaches new markets -> collaboration (P8) enables teamwork -> sacred (P10) serves niche
- **Architecture grouping:** Phases 2-4 are "writing pipeline" (all agent-driven, no external tools). Phase 5 introduces external tool dependencies (Pandoc, Typst). Phases 6-7 extend with additional agents (illustrator, translator). Phase 8 wraps git.
- **Pitfall avoidance:** Voice-check (P4) must exist before export-adjacent generation (P5). RTL library decisions (P5) must account for translation needs (P7). Character reference sheets (P6) must precede scene illustrations (P6).

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 5 (Export):** Complex integration -- Pandoc template customization, KDP/IngramSpark spec compliance, EPUBCheck validation pipeline. Many platform-specific edge cases.
- **Phase 7 (Translation):** Sparse documentation on AI literary translation quality. DeepL vs. Google API integration specifics. Translation memory schema design. RTL/CJK export template specifics.
- **Phase 10 (Sacred):** Niche domain, very sparse documentation on sacred text tooling. Doctrinal sensitivity requires domain expert review. Formal/dynamic equivalence translation modes need careful design.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Autopilot + Writer Mode):** Well-documented git abstraction patterns. Autopilot is extension of existing drafter agent.
- **Phase 3 (Structure + Character):** Standard creative writing tool features with established patterns from Scrivenoer/NovelCrafter.
- **Phase 4 (Quality + Review):** AI-powered editing is well-understood. Fresh-context-per-unit pattern already established.
- **Phase 8 (Collaboration):** Git branching and merging are thoroughly documented. Writer-mode abstraction is a presentation concern.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Pandoc and Typst are well-documented, actively maintained, and verified with official sources. Screenplay tools (Afterwriting, Screenplain) are MEDIUM due to sporadic maintenance. |
| Features | HIGH | Competitor analysis is thorough. Table stakes vs. differentiators clearly delineated. Feature dependency chain is well-mapped. |
| Architecture | HIGH | Extends existing patterns (fresh-context-per-unit, orchestrator-delegate). No novel architecture required. Pandoc integration is well-documented. |
| Pitfalls | HIGH | Platform-specific pitfalls (KDP, EPUBCheck) verified against official specs. npm publishing guidance should use scoped credentials or a future trusted-publishing workflow. RTL concerns need real-content checks. |

**Overall confidence:** HIGH

### Gaps to Address

- **IngramSpark PDF/X-1a CMYK conversion:** Ghostscript can do it but the pipeline needs real-world testing. MEDIUM confidence -- validate during Phase 5 implementation.
- **Screenplay tool longevity:** Afterwriting (last npm publish 2020) and Screenplain may break. Plan fallback Pandoc Lua filters for basic screenplay formatting.
- **Typst RTL/BiDi support:** RTL support depth needs verification with real Arabic/Hebrew content before committing to it for sacred text PDFs.
- **AI literary translation quality:** Research says 47% contextual meaning loss in machine translation. The two-step process (AI draft + human review) is the mitigation, but actual quality for literary fiction needs empirical testing during Phase 7.
- **Multi-runtime compatibility:** Each new runtime (Codex, OpenCode, Copilot, Windsurf, Antigravity) may have different Bash tool names or agent invocation patterns. Needs per-runtime compatibility testing.

## Sources

### Primary (HIGH confidence)
- [Pandoc Official Site](https://pandoc.org/) -- Version 3.9.0.2, EPUB, DOCX, PDF capabilities
- [Typst Documentation](https://typst.app/docs/) -- PDF engine reference
- [Pandoc Typst PDF Engine](https://pandoc.org/MANUAL.html#creating-a-pdf) -- Pandoc PDF engine guidance
- [OpenAI API Pricing](https://platform.openai.com/docs/pricing) -- GPT Image pricing reference
- [KDP Formatting Requirements](https://kdp.amazon.com/en_US/help/topic/G201857950) -- Print submission specs
- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) -- Token deprecation timeline

### Secondary (MEDIUM confidence)
- Translation API pricing and quality should be refreshed against provider docs before implementation.
- [Afterwriting GitHub](https://github.com/ifrost/afterwriting-labs) -- Fountain CLI tool (sporadic maintenance)
- [Screenplain GitHub](https://github.com/vilcans/screenplain) -- Fountain to FDX (sporadic maintenance)
- [IngramSpark File Requirements](https://www.ingramspark.com/blog/file-requirements-for-print-books) -- PDF/X-1a specs
- [Prosegrinder Pandoc Templates](https://github.com/prosegrinder/pandoc-templates) -- Manuscript format reference docs

### Tertiary (LOW confidence)
- [AI Translation Quality Gaps](https://avantpage.com/blog/ai-language-translation-gaps/) -- 47% contextual meaning loss claim needs validation
- [PDFKit RTL Support Issue #219](https://github.com/foliojs/pdfkit/issues/219) -- Open since 2015, informs library avoidance but Typst RTL status less clear

---
*Research completed: 2026-04-06*
*Ready for roadmap: yes*
