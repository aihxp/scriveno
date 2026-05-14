# Technology Stack

**Project:** Scriveno v1.4 — Perplexity runtimes and technical-writing support
**Researched:** 2026-04-09

## Recommendation

Scriveno should **not** add any new npm runtime dependencies, compiled services, or a Scriveno-specific MCP server for this milestone. The correct stack move is:

1. Keep Scriveno as a file-only installer plus markdown command system.
2. Treat **Perplexity web/Comet** as an **in-app prompt surface** unless Perplexity publishes a writable command/skill manifest format.
3. Treat **Perplexity Mac app** as an **optional local-MCP surface** that depends on Perplexity's own helper app plus user-installed external MCP servers.
4. Reuse the existing **Pandoc + Typst + optional reference-doc / bibliography** toolchain for technical-writing families, adding templates and config only where the shipped surface is currently too book-centric or too academic-specific.

## Recommended Stack

### Perplexity Runtime Surface

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Perplexity Spaces + custom instructions** | Current SaaS surface | Web/runtime-friendly way to load project-specific behavior | Perplexity officially supports Spaces with custom AI instructions. This is the closest verified equivalent to a reusable Scriveno prompt surface in the web product. | HIGH |
| **Comet shortcuts** | Current desktop/browser surface | Lightweight reusable task entrypoints | Perplexity's official work guide positions shortcuts as reusable prompts/actions. This fits Scriveno's command-style UX better than pretending a filesystem command registry exists. | MEDIUM |
| **Perplexity Mac app local MCP connectors** | Current Mac app surface | Optional desktop access to local files/tools | Perplexity officially supports local MCP on macOS through the Mac App Store app, with PerplexityXPC as a required helper. This is the only verified local integration surface I found. | HIGH |
| **`@modelcontextprotocol/server-filesystem`** | Current official MCP server package | Optional access to a Scriveno workspace from Perplexity Mac app | Perplexity's own help docs point users to the official filesystem MCP server for local directory access. This is an external prerequisite, not a Scriveno dependency. | HIGH |
| **Node.js 20+** | Existing baseline | Installer runtime and optional `npx` transport for external MCP servers | Scriveno already requires Node 20+ for its installer. That baseline is also sufficient for `npx`-launched MCP servers in Perplexity's local-MCP flow. | HIGH |

### Export / Technical-Writing Toolchain

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Pandoc** | 3.9.x | Core document conversion for technical-writing families | Existing Scriveno export flows already depend on Pandoc. Official docs confirm it supports DOCX reference docs, section numbering, TOC depth, bibliography, citeproc, split-level, and list-of-figures/tables features that technical docs need. | HIGH |
| **Typst via Pandoc** | Existing Scriveno PDF path | PDF output for reports, guides, and specs | Keep Typst as the default PDF engine. No new binary is needed for technical-writing PDFs; what is missing is a manual/report template, not a renderer. | HIGH |
| **Shipped `scriveno-academic.latex` template** | Existing | Citation-heavy technical or research-adjacent outputs | The repo already ships an academic LaTeX template, which is the right existing surface for bibliography-heavy document families. | HIGH |
| **User-supplied DOCX reference documents** | Optional | House style, corporate templates, SOP/manual styling | Pandoc officially uses styles and document properties from a reference DOCX. Scriveno currently ships no DOCX reference docs, so this remains the correct near-term assumption for polished Word output. | HIGH |
| **Optional shipped CSL / DOCX / Typst templates** | New file assets only | Future technical-writing presets | If milestone scope includes RFCs, manuals, implementation guides, or SOPs, the right addition is new files under `data/export-templates/`, not new libraries. | HIGH |

## Integration Implications For This Repo

### Perplexity

- **Do not add a fake `perplexity` or `perplexity-desktop` file-copy runtime to `bin/install.js` yet.**
  I found no official Perplexity documentation for a writable `commands` directory, `agents` directory, `SKILL.md` manifest path, or config-file schema analogous to the runtimes Scriveno already supports.

- **Support Perplexity web/Comet through generated prompt assets or docs, not filesystem installation.**
  Verified surfaces are Spaces/custom instructions and shortcuts, both configured in-app.

- **Support Perplexity Mac app through optional MCP guidance, not a bundled MCP server.**
  The official local-MCP flow is: install Perplexity from the Mac App Store, install the PerplexityXPC helper, then add a connector by entering a server command in-app.

- **If Scriveno documents a filesystem MCP setup, scope it narrowly.**
  Recommended allowed paths are the writer's project root and, only if needed, the relevant Scriveno data directory (`.scriveno/` project-local or `~/.scriveno/` global). Do not recommend broad home-directory access.

- **Prefer explicit allowed-directory arguments for filesystem MCP.**
  This is an inference from the official filesystem MCP server docs: the server requires at least one allowed directory, and it errors if started without command-line directories and without roots support. Perplexity's help article documents entering a raw command string, but does not document roots support. Safest setup: pass explicit paths in the command.

- **Assume cloud app connectors are not equivalent to desktop local access.**
  Perplexity's Box connector docs explicitly say Box works in the web browser and is not supported in the Mac app or Windows app. Do not treat desktop Perplexity support as proof that enterprise cloud-document connectors are available there.

### Technical-Writing Families

- **No new renderer is needed for first-wave technical writing.**
  Pandoc already covers the structural features that manuals, white papers, design docs, proposals, and implementation guides typically need.

- **The real gap is templates, not tooling.**
  Current shipped templates are:
  `scriveno-book.typst`, `scriveno-epub.css`, and `scriveno-academic.latex`.
  That means Scriveno can honestly support:
  academic/citation-heavy outputs,
  generic DOCX/PDF/EPUB conversion,
  and book-centric print PDFs.
  It cannot honestly claim a polished shipped template for branded manuals, RFC/spec PDFs, or corporate DOCX house styles yet.

- **DOCX remains default-styled unless the user supplies a reference document.**
  This matters for technical-writing families more than for fiction, because internal docs and white papers often must match company templates exactly.

- **Academic export assumptions already overlap with technical writing.**
  `CONSTRAINTS.json` already exposes `white_paper`, `research_paper`, `journal_article`, `thesis`, `literature_review`, and `monograph` in the academic group, and academic command adaptations already include citation- and journal-oriented behavior. New technical-writing work types should reuse this export posture where possible instead of inventing a parallel toolchain.

## What Should Be Added

| Category | Add | Why |
|----------|-----|-----|
| Perplexity support | Docs and/or template assets for Spaces, shortcuts, and local MCP setup | Matches the official integration surface without inventing unsupported install paths |
| Perplexity support | Optional installer UX note or docs note for Perplexity Mac app + PerplexityXPC + external MCP requirements | Makes the support boundary explicit and honest |
| Technical writing | New export templates under `data/export-templates/` for manual/report/spec families | Solves the real formatting gap without changing architecture |
| Technical writing | Optional curated DOCX reference docs and CSL files as shipped assets | Improves Word and citation output while staying file-only |
| Testing/docs | Runtime-matrix updates and tests that preserve the "installer target vs parity proof" distinction | Keeps support framing consistent with `docs/runtime-support.md` |

## What Should NOT Be Added

| Category | Do Not Add | Why Not |
|----------|------------|---------|
| Runtime architecture | **No new npm runtime dependencies in `package.json`** | Violates Scriveno's zero-runtime-dependency architecture |
| Perplexity support | **No Scriveno-specific MCP server** | Adds an executable service surface Scriveno does not need; Perplexity already supports external MCP servers |
| Perplexity support | **No guessed `~/.perplexity/...` or `~/.comet/...` installer target** | I found no official manifest or config-path contract to justify it |
| Perplexity support | **No browser automation requirement** | Fragile and contrary to the current installer model |
| Technical writing | **No Sphinx, MkDocs, Docusaurus, or Asciidoctor as core stack** | They introduce a second documentation build system and/or runtime dependency chain that Scriveno does not need for this milestone |
| Technical writing | **No new PDF engine** | Typst plus Pandoc already cover the rendering layer; the missing asset is templates |

## Suggested External Assumptions

```bash
# Existing Scriveno baseline
node --version   # 20+

# Optional Perplexity Mac app local-MCP setup
# Entered inside Perplexity's Add Connector UI, not installed by Scriveno:
npx -y @modelcontextprotocol/server-filesystem /absolute/path/to/project

# Only add Scriveno's shared data dir if a workflow truly needs it:
npx -y @modelcontextprotocol/server-filesystem /absolute/path/to/project /absolute/path/to/.scriveno
```

Notes:

- The filesystem MCP command above is a **recommended integration example**, not something Scriveno should install or vendor.
- For project-scoped Scriveno installs, prefer exposing the project root and project-local `.scriveno/` only.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Perplexity integration | Spaces / shortcuts / local MCP docs | First-class `bin/install.js` runtime target | No official writable path or manifest format found |
| Desktop file access | External filesystem MCP server | Scriveno-authored MCP server | Unnecessary executable surface and maintenance burden |
| Technical-writing output | Pandoc + Typst + file templates | Sphinx / MkDocs / Docusaurus | Adds a second product architecture and dependency chain |
| Word styling | Reference DOCX files | Custom DOCX post-processor | Extra complexity when Pandoc already has an official reference-doc mechanism |

## Sources

- Repo: [`bin/install.js`](../../../bin/install.js), [`docs/runtime-support.md`](../../../docs/runtime-support.md), [`docs/shipped-assets.md`](../../../docs/shipped-assets.md), [`commands/scr/export.md`](../../../commands/scr/export.md), [`data/CONSTRAINTS.json`](../../../data/CONSTRAINTS.json)
- Perplexity Help Center: https://www.perplexity.ai/help-center/en/articles/11502712-local-and-remote-mcps-for-perplexity
- Perplexity Help Center: https://www.perplexity.ai/help-center/en/articles/10352961-what-are-spaces
- Perplexity Help Center: https://www.perplexity.ai/help-center/en/articles/13130932-using-the-box-connector
- Perplexity Docs: https://docs.perplexity.ai/docs/getting-started/integrations/mcp-server
- Pandoc User's Guide: https://pandoc.org/MANUAL.html
- MCP Filesystem Server README: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem

## Confidence Notes

- **HIGH:** Perplexity Mac local MCP support, PerplexityXPC helper requirement, external-command connector setup, Pandoc reference-doc/citeproc/TOC capabilities, current Scriveno shipped template surface.
- **MEDIUM:** Using Comet shortcuts as the best Scriveno-style entrypoint; treating explicit filesystem-server path args as the safest Perplexity configuration. These are evidence-backed recommendations, but part of the conclusion is inference from the official surfaces rather than a direct Perplexity statement.
- **LOW:** Exact local app-bundle detection paths for Perplexity or Comet. I did not find official path documentation, so Scriveno should avoid path-based install claims here.
