## Project

**Scriven**

Scriven is a spec-driven writing, publishing, and translation pipeline that runs inside AI coding agents (Claude Code, Cursor, Gemini CLI). It covers the full lifecycle from blank page to publication-ready manuscript or technical document set -- including voice profiling, adaptive work types, autonomous drafting, illustration, translation, and multi-format export. Supports 50 work types with tradition-native vocabulary (novels use chapters, screenplays use acts, runbooks use procedures, Quran commentaries use surahs).

**Core Value:** **Drafted prose sounds like the writer, not like AI.** The Voice DNA system profiles the writer across 15+ dimensions and loads that profile into every drafter agent invocation. If voice fidelity breaks, trust breaks, and no other feature matters.

### Constraints

- **Architecture**: Must remain a pure skill/command system -- no compiled code, no runtime dependencies beyond Node.js for the installer
- **Voice fidelity**: Every feature must preserve the Voice DNA pipeline -- fresh context per atomic unit, STYLE-GUIDE.md loaded first
- **Backward compatibility**: Existing 28 commands and templates must continue working as new features are added
- **Plan authority**: If a command file contradicts the product plan, fix the command -- plan is canonical (section 15 for command specs)
- **Progressive disclosure**: Onboarding asks 3 questions max; depth is optional and additive
- **Runtime credibility**: `>=20.0.0` is the installer compatibility floor. For new installs, prefer a currently supported LTS such as Node.js 24. `docs/runtime-support.md` is the canonical runtime matrix, and installer targets are not interchangeable proof of host-runtime parity.
## Technology Stack

## Architecture Constraint
- Export tools are **external CLI binaries** the agent invokes via shell, not npm dependencies
- The agent generates intermediate files (markdown, HTML, Typst) then calls converters
- Scriven's `package.json` stays dependency-free; tools are prerequisites the user installs
- The installer (`bin/install.js`) should detect and guide installation of prerequisites
## Recommended Stack
### Document Conversion Engine
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Pandoc** | 3.9.x (current: 3.9.0.2) | Universal document converter | De facto standard for markdown-to-anything. Handles EPUB, DOCX, PDF, LaTeX, Typst, HTML. One tool covers 80% of export needs. Actively maintained, massive ecosystem of filters and templates. | HIGH |
### PDF Generation
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Typst** | 0.14.x | PDF engine for Pandoc | 27x faster than XeLaTeX. Clean syntax. Generates accessible PDF/UA-1 by default (critical for 2025 EAA and 2026 ADA compliance). No massive TeX Live installation required. Pandoc supports `--pdf-engine=typst` natively. | HIGH |
| **XeLaTeX** (fallback) | TeX Live 2025 | Academic/math-heavy PDF | Only needed if Typst cannot handle specialized mathematical notation or journal-specific LaTeX templates. Most creative writing does not need this. | MEDIUM |
### EPUB Generation
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Pandoc** (built-in) | 3.9.x | EPUB 3 generation | Pandoc's EPUB output is production-quality. Supports custom CSS, metadata, cover images, table of contents. Used by published authors and small presses. No additional tool needed. | HIGH |
### DOCX Generation
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Pandoc** (built-in) | 3.9.x | Manuscript DOCX and formatted DOCX | Supports reference documents (`.docx` templates) for both standard manuscript format (12pt Courier, double-spaced) and formatted/designed output. | HIGH |
### Screenplay Formats (Fountain + FDX)
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Afterwriting CLI** | 1.8.x | Fountain to PDF | Node.js-based, npm-installable (`npm i -g afterwriting`). Generates industry-standard screenplay PDFs with page numbers, scene headers, proper formatting. Also provides screenplay statistics. | MEDIUM |
| **Screenplain** | 0.9.x | Fountain to FDX + HTML | Python-based (`pip install screenplain`). Only reliable open-source Fountain-to-FDX converter. FDX is Final Draft's XML format -- essential for screenplay submission. | MEDIUM |
### LaTeX Output
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Pandoc** (built-in) | 3.9.x | Markdown to LaTeX source | For academic writers who need `.tex` files to submit to journals or further edit in Overleaf. Pandoc generates clean LaTeX with customizable templates. | HIGH |
### Publishing Platform Packages
| Platform | Format Required | How Scriven Produces It | Confidence |
|----------|----------------|------------------------|------------|
| **KDP (ebook)** | EPUB or DOCX | Pandoc EPUB with KDP-specific CSS (alt text on all images, embedded fonts) | HIGH |
| **KDP (print)** | PDF (no marks, embedded fonts, 300dpi images) | Pandoc + Typst with KDP trim size template (e.g., 6x9, 5.5x8.5), 0.25" extra height, 0.125" extra width for bleed | HIGH |
| **IngramSpark** | PDF/X-1a (CMYK, bleeds, full-wrap cover) | Pandoc + Typst for interior; cover requires separate full-wrap PDF. CMYK conversion via ImageMagick or Ghostscript. | MEDIUM |
| **Submission/Query** | DOCX (standard manuscript format) | Pandoc with manuscript reference doc | HIGH |
## Illustration Generation (AI Image APIs)
| Technology | Purpose | Why | Confidence |
|------------|---------|-----|------------|
| **OpenAI GPT Image 1.5 API** | Primary illustration engine | Best text instruction following of any image API. Natively multimodal (understands story context). $0.02-0.08 per image at medium quality. Available via standard OpenAI API key that Claude Code users likely already have. | HIGH |
| **GPT Image 1 Mini** | Budget/draft illustrations | $0.005/image. Good for concept art, character reference sheets, storyboard thumbnails. Use for iteration before final quality. | HIGH |
| **Stable Diffusion (via API)** | Style-consistent illustration sets | Open-source. LoRA fine-tuning allows training on a specific art style for consistent illustration across a book. Best for children's books / comics needing visual consistency. Requires more setup. | MEDIUM |
### Illustration Pipeline Architecture
## Translation Pipeline
| Technology | Purpose | Why | Confidence |
|------------|---------|-----|------------|
| **DeepL API Pro** | Primary translation engine for European languages | Higher quality than Google for EN/FR/DE/ES/IT/PT/NL/PL/JA/ZH/KO. GDPR-compliant, content not stored or used for training. $5.49/mo + $25/M chars. | HIGH |
| **Google Cloud Translation (v3)** | Broad language coverage, RTL/CJK | 130+ languages vs DeepL's 33. Required for Arabic, Hebrew, Hindi, Swahili, and other languages DeepL doesn't cover. NMT at $20/M chars, LLM mode at $10+$10/M chars. | HIGH |
| **AI Agent (Claude/GPT)** | Cultural adaptation, sacred text translation | Machine translation APIs don't handle literary nuance, sacred registers, or cultural adaptation. The AI agent itself is the best tool for these -- it can apply voice profiles, maintain glossaries, and do formal/dynamic equivalence translation. | HIGH |
### Translation Strategy
### Translation Memory
- Sacred texts (canonical terms must be consistent)
- Series (character names, place names, invented terms)
- Technical writing (terminology consistency)
## npm Publishing Configuration
| Concern | Recommendation | Why | Confidence |
|---------|---------------|-----|------------|
| **Authentication** | Granular Access Tokens (not classic) | Classic tokens deprecated; all classic tokens revoked by Feb 2026. Write-access tokens now max 90-day lifespan. | HIGH |
| **Publishing method** | `npm publish` with 2FA from local machine | Most secure for small-team projects. Trusted publishing (OIDC via GitHub Actions) is overkill until Scriven has CI/CD. | HIGH |
| **Prepublish check** | `npm pack --dry-run` before every publish | Verify no secrets, no unnecessary files leaked. The `"files"` field in package.json already scopes what's included. | HIGH |
| **Versioning** | `npm version patch/minor/major` with git tags | Auto-creates git tag, bumps version. Pair with GitHub releases for changelog. | HIGH |
| **npx support** | Already configured (`"bin": {"scriven": "./bin/install.js"}`) | `npx scriven-cli@latest` will download and run the installer. Current setup is correct. | HIGH |
| **Lockfile** | Commit `package-lock.json` but since there are zero dependencies, it's effectively empty | Standard practice. Will matter when/if dev dependencies are added for testing. | HIGH |
| **Node version** | `"engines": {"node": ">=20.0.0"}` | Scriven's installer compatibility floor is `>=20.0.0`; new installs should use a currently supported LTS such as Node.js 24. This keeps package metadata, installer guidance, and runtime docs aligned on one minimum without presenting Node 20 as the fresh-install target. | HIGH |
See `docs/runtime-support.md` for the canonical runtime matrix, support levels, and host-runtime parity status.
### npm Publish Readiness Checklist
## Supporting Tools (Prerequisites for Users)
| Tool | Purpose | Install | Required For |
|------|---------|---------|-------------|
| **Pandoc** | Document conversion | `brew install pandoc` | All export commands |
| **Typst** | PDF generation | `brew install typst` | PDF export |
| **Ghostscript** | CMYK conversion, PDF/X-1a | `brew install ghostscript` | IngramSpark package only |
| **ImageMagick** | Image processing (resize, format conversion) | `brew install imagemagick` | Cover art processing, illustration pipeline |
| **Afterwriting** | Fountain to PDF | `npm i -g afterwriting` | Screenplay PDF export only |
| **Screenplain** | Fountain to FDX | `pip install screenplain` | FDX export only |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| PDF engine | Typst | XeLaTeX (TeX Live) | 4-6 GB install, 27x slower compilation, worse error messages. Reserve for academic edge cases. |
| PDF engine | Typst | WeasyPrint | HTML-to-PDF, not print-quality typesetting. No proper widow/orphan control, gutter margins. |
| PDF engine | Typst | Prince XML | Commercial ($3,800 license). Overkill for CLI tool targeting indie authors. |
| EPUB | Pandoc | epub-gen-memory (npm) | Would add runtime dependency. Pandoc's EPUB is more mature, handles accessibility, KDP validation. |
| EPUB | Pandoc | Calibre CLI | Calibre is massive (200+ MB). Pandoc is lighter and sufficient. |
| Document conversion | Pandoc | Asciidoctor | Scriven manuscripts are markdown. Asciidoctor is AsciiDoc-native. Adding a format is unnecessary complexity. |
| Illustration | OpenAI GPT Image 1.5 | Midjourney | No API. Cannot automate from CLI. |
| Illustration | OpenAI GPT Image 1.5 | DALL-E 3 | Sunset May 2026. Dead end. |
| Illustration | OpenAI GPT Image 1.5 | Replicate (Flux/SD) | Additional API signup. OpenAI key is already likely available to users of AI coding agents. |
| Translation | DeepL + Google + AI agent | Amazon Translate | Lower quality for literary content. No advantage over Google for broad coverage. |
| Translation | DeepL + Google + AI agent | LibreTranslate | Self-hosted, lower quality, limited languages. Not practical for a CLI tool. |
| Screenplay | Afterwriting + Screenplain | Highland (Mac app) | Not a CLI tool. Cannot automate. |
| Screenplay | Afterwriting + Screenplain | Pandoc Lua filter | Could work but would need significant custom development. Afterwriting/Screenplain already exist. |
## What NOT to Use
| Technology | Why Not |
|------------|---------|
| **npm runtime dependencies** | Scriven is a pure skill system. Adding npm deps means adding a build step, version conflicts, and breaking the zero-dependency architecture. |
| **Calibre** | 200+ MB desktop app. Pandoc does everything Scriven needs at 1/10th the size. |
| **DALL-E 2/3 API** | Sunset May 2026. Use GPT Image 1.5 instead. |
| **Midjourney** | No API. Cannot be automated. |
| **wkhtmltopdf** | Deprecated, security issues, poor print quality. |
| **Classic npm tokens** | Revoked Feb 2026. Use granular access tokens only. |
| **Node.js < 20** | Node 18 EOL April 2025. Node 20 LTS until April 2026. Bump minimum. |
| **WeasyPrint for books** | Fine for reports, not for book typesetting. No proper ligatures, optical margins, or page-level layout control. |
| **Custom EPUB generator** | Reinventing what Pandoc already does well. Waste of effort. |
See `docs/shipped-assets.md` for the canonical inventory of bundled export templates and launch-critical files.

## Currently Shipped Export Templates
| Template | Format | Purpose |
|----------|--------|---------|
| `scriven-book.typst` | Typst template | Book interior PDF (trim sizes, margins, headers, page numbers) |
| `scriven-epub.css` | CSS | EPUB styling (clean, readable, KDP-compatible) |
| `scriven-academic.latex` | LaTeX template | Academic paper/thesis formatting |

## Planned Export Templates
| Template | Format | Purpose |
|----------|--------|---------|
| `scriven-manuscript.docx` | DOCX reference doc | Standard manuscript format (12pt Courier, double-spaced, 1" margins) |
| `scriven-formatted.docx` | DOCX reference doc | Designed/formatted DOCX for review copies |
| `scriven-kdp-cover.typst` | Typst template | KDP cover with calculated spine width |
| `scriven-ingram-cover.typst` | Typst template | IngramSpark full-wrap cover |
## Sources
- [Pandoc Official Site](https://pandoc.org/) -- Version 3.9.0.2 confirmed
- [Typst Blog: Typst 0.14](https://typst.app/blog/2025/typst-0.14) -- Accessibility features confirmed
- [Pandoc + Typst Tutorial](https://slhck.info/software/2025/10/25/typst-pdf-generation-xelatex-alternative.html) -- 27x speed improvement verified
- [Afterwriting GitHub](https://github.com/ifrost/afterwriting-labs) -- Fountain CLI tool
- [Screenplain GitHub](https://github.com/vilcans/screenplain) -- Fountain to FDX converter
- [OpenAI API Pricing](https://platform.openai.com/docs/pricing) -- GPT Image 1.5 pricing
- [GPT Image 1.5 Pricing Analysis](https://www.aifreeapi.com/en/posts/openai-image-generation-api-pricing) -- Model comparison
- [DeepL vs Google vs Microsoft 2026](https://taia.io/resources/blog/deepl-vs-google-translate-vs-microsoft-translator/) -- Translation API comparison
- [Translation API Pricing 2026](https://www.buildmvpfast.com/api-costs/translation) -- Cost comparison
- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) -- Token deprecation timeline
- [Snyk npm Best Practices](https://snyk.io/blog/best-practices-create-modern-npm-package/) -- Security guidance
- [KDP Formatting Requirements](https://kdp.amazon.com/en_US/help/topic/G201857950) -- Print submission specs
- [IngramSpark File Requirements](https://www.ingramspark.com/blog/file-requirements-for-print-books) -- PDF/X-1a specs
- [Best AI Image Generation APIs 2026](https://crazyrouter.com/en/blog/best-ai-image-generation-apis-2026) -- Midjourney no-API confirmed
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
