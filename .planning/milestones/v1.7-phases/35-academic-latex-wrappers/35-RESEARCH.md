# Phase 35: Academic LaTeX Wrappers - Research

**Researched:** 2026-04-17
**Domain:** LaTeX publisher class wrappers, Pandoc custom template system, kpsewhich TeX detection
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Invocation UX:** `--platform ieee|acm|lncs|elsevier|apa7` extends the existing `--platform` flag in `build-print.md`; no new command or flag surface needed.
- **Output:** `.tex` file only — `.manuscript/output/paper-{platform}.tex`. Writer compiles with their own TeX Live. Scriveno does not attempt pdflatex.
- **Output naming:** `paper-{platform}.tex` — parallel to `print-{platform}.pdf` convention.
- **CONSTRAINTS.json:** `academic` added to `exports.build_print.available`; only valid when platform is one of the 5 academic publisher values.
- **Template naming:** `scriveno-ieee.latex`, `scriveno-acm.latex`, `scriveno-lncs.latex`, `scriveno-elsevier.latex`, `scriveno-apa7.latex` in `data/export-templates/`.
- **Minimal wrappers:** Each wrapper contains only `\documentclass{<CLASS>}` + standard Pandoc boilerplate (body, title, author, abstract, keywords, date, bibliography via CSL, CSL ref macros). Publisher class handles all layout/formatting.
- **Core metadata bridge:** title, author, abstract, keywords, date, bibliography — same fields as existing `scriveno-academic.latex`. No publisher-specific extensions (affiliation, ORCID) in this phase.
- **Detection mechanism:** `kpsewhich IEEEtran.cls` (or equivalent) as pre-flight before producing the `.tex` file.
- **No TeX distribution:** "No TeX distribution found" error + `brew install basictex` (macOS) / TUG URL (other platforms).
- **Missing class error:** name the class file, CTAN package, and `tlmgr install` command together: `Install IEEEtran.cls — run: tlmgr install ieeetran`.
- **llncs edge case:** Error message notes Springer LNCS is sometimes not in TeX Live and links to Springer author download page as alternative.

### Claude's Discretion

- Exact preamble content of each wrapper beyond the documented minimums.
- Whether to add `\usepackage{inputenc}` / `\usepackage[T1]{fontenc}` as safe universal additions (they are safe for all 5 classes — Claude may include them).
- Regression test structure and granularity within the 3-plan breakdown.

### Deferred Ideas (OUT OF SCOPE)

- Publisher-specific metadata extensions (author affiliation, ORCID, email) — deferred to a future phase.
- Automatic pdflatex compilation attempt — out of scope; writer controls their TeX workflow.
- MiKTeX package manager (`mpm --install`) equivalent guidance — error messages note TeX Live / tlmgr as primary path.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TPL-07 | Academic paper work type ships thin LaTeX wrappers for IEEE, ACM, Springer LNCS, Elsevier, APA7 that reference the user-installed publisher class and provide Scriveno's metadata/frontmatter | Confirmed: all 5 publisher classes exist in TeX Live (tlmgr verified); kpsewhich exit-code detection confirmed reliable; existing scriveno-academic.latex provides the Pandoc template boilerplate baseline |
</phase_requirements>

---

## Summary

Phase 35 delivers five thin Pandoc LaTeX template wrappers — one per academic publisher class — that route Scriveno's voice/metadata frontmatter through `\documentclass{<CLASS>}` without distributing the publisher class itself. Each wrapper is a minimal Pandoc `.latex` template following the same pattern as the existing `scriveno-academic.latex`, but with the document class hardcoded to the publisher class name and the generic preamble (geometry, fancyhdr, setspace, lmodern) removed, since publisher classes handle their own layout.

The `build-print.md` command gains a new route: when `--platform` is one of `ieee|acm|lncs|elsevier|apa7`, it skips the Typst PDF route entirely and instead (1) runs `kpsewhich <Class>.cls` as a pre-flight check, (2) selects the matching wrapper template, (3) invokes Pandoc with `--template=<wrapper>` and `-o paper-{platform}.tex`, producing a `.tex` file the writer compiles themselves. The three plans are: regression test suite, five wrapper templates, and the build-print command extension.

The key insight for wrapper design: publisher classes are opinionated and conflict with geometry/fancyhdr/setspace. The wrappers must be lean — carry only `\providecommand{\tightlist}`, `$highlighting-macros$`, the CSL reference environment, and the metadata-bridge variables. Everything else is the publisher class's domain.

**Primary recommendation:** Model each wrapper directly on `scriveno-academic.latex` but strip to the minimal required boilerplate. Use the existing Pandoc template variable syntax (`$title$`, `$author$`, `$abstract$`, `$body$`, `$if(bibliography)$` etc.) that is already proven in the codebase.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| kpsewhich detection + TeX distribution check | build-print.md (STEP 2) | — | All prerequisite checks are in STEP 2; LaTeX detection follows existing Pandoc/Typst/Ghostscript pattern |
| Academic platform routing (ieee/acm/lncs/elsevier/apa7) | build-print.md (STEP 2.5) | — | Platform validation already happens in STEP 2.5; new platform slugs extend the existing allowed-values list |
| LaTeX template selection | build-print.md (STEP 1.8) | — | STEP 1.8 maps work_type/platform → template path; academic platform branch inserts here |
| `.tex` file generation via Pandoc | build-print.md (STEP 4) | — | STEP 4 is the Pandoc invocation step; academic route branches from Typst route here |
| Publisher class wrapper templates | data/export-templates/ | — | All export templates live here; 5 new `.latex` files follow scriveno-academic.latex location pattern |
| CONSTRAINTS.json availability gating | data/CONSTRAINTS.json | build-print.md (STEP 1) | STEP 1 reads CONSTRAINTS.json to check build_print.available; `academic` group must be added |
| Regression tests | test/phase35-academic-latex-wrappers.test.js | — | All phase regression tests follow the pattern: `test/phase{N}-{slug}.test.js` |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Pandoc | 3.9.0.2 | Markdown → `.tex` via `--template` | Already the standard Scriveno converter; `--template` flag with a custom `.latex` file produces clean `.tex` without PDF compilation [VERIFIED: `pandoc --version` on host] |
| kpsewhich | via TeX Live 2026 (kpathsea 6.4.2) | Detect installed LaTeX classes before producing `.tex` | Exit code 0 = found, 1 = not found — reliable binary check [VERIFIED: local host] |
| Node.js test runner | built-in (`node:test`) | Phase regression tests | Used by all existing phase test files (`const { describe, it } = require('node:test')`) [VERIFIED: test/*.test.js inspection] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tlmgr | TeX Live 2026 | Install missing publisher classes | Included in error guidance strings, not invoked by Scriveno directly |
| assert (node:assert/strict) | built-in | Test assertions | Used across all existing phase tests [VERIFIED: test/phase34-cross-domain-templates.test.js] |

### Publisher Classes (User-Installed — NOT Scriveno dependencies)
| Class | tlmgr Package | Class File | Status in TeX Live | Version |
|-------|--------------|------------|--------------------|---------|
| IEEEtran | `ieeetran` | `IEEEtran.cls` | In TeX Live (collection-publishers) | 1.8b [VERIFIED: tlmgr info] |
| acmart | `acmart` | `acmart.cls` | In TeX Live (collection-publishers) | 2.16 [VERIFIED: tlmgr info] |
| llncs | `llncs` | `llncs.cls` | In TeX Live (collection-publishers) | 2.26 [VERIFIED: tlmgr info] |
| elsarticle | `elsarticle` | `elsarticle.cls` | In TeX Live (collection-publishers) | 3.5 [VERIFIED: tlmgr info] |
| apa7 | `apa7` | `apa7.cls` | In TeX Live (collection-publishers) | 2.16 [VERIFIED: tlmgr info] |

**Critical note on llncs:** Despite being available via `tlmgr install llncs`, Springer historically distributed llncs separately via their author resources page. `tlmgr info llncs` confirms it IS in TeX Live 2026 (`cat-contact-home: https://www.springer.com/gp/computer-science/lncs`), but some users on older TeX Live installations or MiKTeX may not find it. The error message should mention both `tlmgr install llncs` AND the Springer author download page. [VERIFIED: tlmgr info llncs on host]

**Installation command (users, not Scriveno):**
```bash
tlmgr install ieeetran acmart llncs elsarticle apa7
```

---

## Architecture Patterns

### System Architecture Diagram

```
Writer runs: /scr:build-print --platform ieee

    build-print.md
    │
    ├── STEP 1: Load config.json + CONSTRAINTS.json
    │   └── Check work_type group ∈ build_print.available (now includes "academic")
    │
    ├── STEP 1.5: Validate manuscript (scaffold markers)
    ├── STEP 1.6: Front-matter gate
    ├── STEP 1.7: Tradition loading
    ├── STEP 1.8: Template selection
    │   ├── platform ∈ {ieee,acm,lncs,elsevier,apa7}?
    │   │   └── YES → LATEX_TEMPLATE = data/export-templates/scriveno-{platform}.latex
    │   │              (skips Typst template selection entirely)
    │   └── otherwise → TYPST_TEMPLATE = scriveno-book.typst (existing path)
    │
    ├── STEP 2: Prerequisites check
    │   ├── pandoc present? (existing)
    │   ├── IF academic platform:
    │   │   ├── kpsewhich present? → NO → "No TeX distribution found" + install guidance
    │   │   └── kpsewhich <Class>.cls → exit 1 → "Install <Class>.cls — run: tlmgr install <pkg>"
    │   └── IF print platform: typst present? (existing)
    │       IF ingram: ghostscript? (existing)
    │
    ├── STEP 2.5: Platform + trim validation
    │   └── ieee/acm/lncs/elsevier/apa7 added to allowed values
    │       (no trim size applies to academic platforms — skip trim validation for these)
    │
    ├── STEP 3: Assemble manuscript → .manuscript/output/assembled-manuscript.md
    │   └── Same assembly logic regardless of academic vs print route
    │
    └── STEP 4: Build output
        ├── IF academic platform:
        │   pandoc assembled.md \
        │     --template=data/export-templates/scriveno-{platform}.latex \
        │     --metadata-file=metadata.yaml \
        │     -o .manuscript/output/paper-{platform}.tex
        └── IF print platform: (existing Pandoc + Typst path)
```

### Recommended Project Structure (new files only)
```
data/export-templates/
├── scriveno-academic.latex      # existing — untouched
├── scriveno-ieee.latex          # NEW — IEEEtran wrapper
├── scriveno-acm.latex           # NEW — acmart wrapper
├── scriveno-lncs.latex          # NEW — llncs wrapper
├── scriveno-elsevier.latex      # NEW — elsarticle wrapper
└── scriveno-apa7.latex          # NEW — apa7 wrapper

test/
└── phase35-academic-latex-wrappers.test.js   # NEW — regression suite

commands/scr/
└── build-print.md              # MODIFIED — extended with academic route

data/
└── CONSTRAINTS.json            # MODIFIED — academic added to build_print.available
```

### Pattern 1: Minimal Publisher Wrapper Template

The five wrappers follow this skeleton. The key difference from `scriveno-academic.latex` is: (1) hardcoded `\documentclass{<PUBLISHERCLASS>}`, (2) no geometry/fancyhdr/setspace/lmodern (publisher class owns layout), (3) `inputenc`/`fontenc` included as safe-universal additions (per Claude's Discretion).

```latex
% Scriveno <PUBLISHER> LaTeX Template for Pandoc --template flag
% Requires <PUBLISHERCLASS>.cls (install: tlmgr install <pkg>)
% Usage: pandoc ... --template=data/export-templates/scriveno-<platform>.latex

\documentclass[$if(classoption)$$for(classoption)$$classoption$$sep$,$endfor$$endif$]{<PUBLISHERCLASS>}

% Encoding — safe with all 5 publisher classes when using pdflatex
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}

% Math support — compatible with all 5 publisher classes
\usepackage{amsmath,amssymb}

% Graphics
\usepackage{graphicx}
\makeatletter
\def\maxwidth{\ifdim\Gin@nat@width>\linewidth\linewidth\else\Gin@nat@width\fi}
\def\maxheight{\ifdim\Gin@nat@height>\textheight\textheight\else\Gin@nat@height\fi}
\makeatother
\setkeys{Gin}{width=\maxwidth,height=\maxheight,keepaspectratio}

% Pandoc required: code highlighting
$if(highlighting-macros)$
$highlighting-macros$
$endif$

% Pandoc required: tight lists
\providecommand{\tightlist}{%
  \setlength{\itemsep}{0pt}\setlength{\parskip}{0pt}}

% Pandoc required: CSL references
$if(csl-refs)$
\newlength{\cslhangindent}
\setlength{\cslhangindent}{1.5em}
\newlength{\csllabelwidth}
\setlength{\csllabelwidth}{3em}
\newenvironment{CSLReferences}[2]%
  {\setlength{\parindent}{0pt}%
   \everypar{\setlength{\hangindent}{\cslhangindent}}\ignorespaces}%
  {\par}
\newcommand{\CSLBlock}[1]{\hfill\break#1\hfill\break}
\newcommand{\CSLLeftMargin}[1]{\parbox[t]{\csllabelwidth}{\strut#1\strut}}
\newcommand{\CSLRightInline}[1]{\parbox[t]{\dimexpr\linewidth-\csllabelwidth\relax}{\strut#1\strut}}
\newcommand{\CSLIndent}[1]{\hspace{\cslhangindent}#1}
$endif$

% Metadata
\title{$if(title)$$title$$else$Untitled$endif$}
\author{$if(author)$$for(author)$$if(it.name)$$it.name$$else$$it$$endif$$sep$ \and $endfor$$else$~$endif$}
\date{$if(date)$$date$$else$\today$endif$}

\begin{document}

\maketitle

$if(abstract)$
\begin{abstract}
\noindent $abstract$
\end{abstract}
$endif$

$if(keywords)$
\noindent\textbf{Keywords:} $keywords$
$endif$

$body$

$if(bibliography)$
\bibliographystyle{<STYLE>}
\bibliography{$for(bibliography)$$bibliography$$sep$,$endfor$}
$endif$

\end{document}
```

**Per-class deviations from the pattern:**

| Platform | `\documentclass` | Common Class Options | Bibliography style note |
|----------|-----------------|----------------------|------------------------|
| IEEE | `IEEEtran` | `[conference]` or `[journal]` | Use `IEEEtran` bib style |
| ACM | `acmart` | `[acmconf,review=false]` | Uses biblatex or natbib per ACM config |
| LNCS | `llncs` | (no standard options) | Use `splncs04` bib style |
| Elsevier | `elsarticle` | `[preprint,12pt]` | Use `elsarticle-num` or `elsarticle-harv` |
| APA7 | `apa7` | `[jou,longtable]` or `[man]` | Requires biblatex-apa |

[ASSUMED: per-class option defaults. The class options shown are community-standard but not verified against current class documentation in this session.]

### Pattern 2: kpsewhich Detection in STEP 2

```bash
# Detect TeX distribution (kpsewhich is the canonical TeX finder utility)
command -v kpsewhich >/dev/null 2>&1
# exit 0 = TeX distribution present, exit 1 = no TeX at all

# Detect specific class (run only when kpsewhich is present)
kpsewhich IEEEtran.cls >/dev/null 2>&1
# exit 0 = class found, exit 1 = class not installed
```

[VERIFIED: kpsewhich exit codes confirmed on host — `kpsewhich article.cls` exits 0, `kpsewhich nonexistent.cls` exits 1]

### Pattern 3: Pandoc `.tex` Output Invocation

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/paper-{platform}.tex \
  --template=data/export-templates/scriveno-{platform}.latex \
  --metadata-file=.manuscript/output/metadata.yaml
```

Key point: no `--pdf-engine` flag when outputting `.tex`. Pandoc with `-o file.tex` and a `.latex` template produces raw LaTeX source without attempting compilation. [VERIFIED: Pandoc 3.9.0.2 on host supports this invocation]

### Pattern 4: build-print.md STEP 2.5 Extension

The existing STEP 2.5 has a hard-coded allowed list:
```
kdp | ingram | apple | bn | d2d | kobo | google | smashwords
```

After Phase 35, the list must become:
```
kdp | ingram | apple | bn | d2d | kobo | google | smashwords | ieee | acm | lncs | elsevier | apa7
```

The EPUB-only check (`apple | bn | d2d | kobo | google | smashwords`) does NOT apply to academic platforms — they are a separate "LaTeX-only" category. STEP 2.5 needs a new branch: "if platform is academic, skip trim-size and page-count logic entirely."

### Anti-Patterns to Avoid

- **Including geometry/fancyhdr/setspace in publisher wrappers:** Publisher classes define their own layout. Loading these packages in the preamble causes conflicts and compilation errors. The existing `scriveno-academic.latex` has all of these; the new wrappers must NOT copy them.
- **Using `\usepackage{hyperref}` without class-specific config:** IEEEtran and acmart include hyperref internally; loading it again causes multiply-defined option warnings. Either omit hyperref entirely or guard with `\@ifpackageloaded`.
- **Routing academic platforms through the Typst path:** If STEP 1.8 or STEP 4 forgets to branch on academic platforms, Pandoc will attempt PDF generation with `--pdf-engine=typst` on a LaTeX template, which will fail.
- **Skipping the kpsewhich check for "no TeX distribution":** If kpsewhich itself is absent, calling `kpsewhich IEEEtran.cls` will give a confusing "command not found" error rather than a clean install-guidance message.
- **Applying trim-size logic to academic platforms:** `--trim` and page-count guardrails are meaningless for `.tex` output. The command must skip STEP 2.5 trim validation entirely for academic platform slugs.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| LaTeX class detection | Custom file-system scan | `kpsewhich <Class>.cls` | kpsewhich is the TeX ecosystem's own locator; it knows TEXMFHOME, user trees, and all paths correctly |
| LaTeX template variable substitution | Custom string interpolation | Pandoc `--template` flag with `.latex` file | Pandoc's template engine handles `$if()$`, `$for()$`, `$body$`, CSL macros — already working in `scriveno-academic.latex` |
| PDF compilation | pdflatex/xelatex subprocess call | Delegate to writer's TeX workflow | Deferred by design decision; attempting compilation adds failure surface and TeX distribution complexity |

**Key insight:** The "minimal wrapper" pattern is intentionally thin because the publisher class carries all expertise. Scriveno's only job is the metadata bridge (title → `\title{}`, etc.) and the Pandoc boilerplate (tightlist, CSL). Any additional LaTeX beyond this is both unnecessary and likely to conflict.

---

## Common Pitfalls

### Pitfall 1: Publisher Classes That Define `\maketitle` Differently
**What goes wrong:** `IEEEtran` and `acmart` generate elaborate title blocks; calling `\maketitle` after `\begin{document}` without their required metadata macros (`\IEEEcompsoctitleabstractindextext`, `\acmConference`, etc.) produces empty or malformed title blocks.
**Why it happens:** The wrappers use only the core Pandoc metadata bridge (title/author/abstract). Publisher-specific frontmatter macros are not bridged.
**How to avoid:** Document clearly in the wrapper comment that this produces a plain `\maketitle` — no conference metadata, no affiliation, no copyright block. Writers needing these must add them manually after opening the `.tex` file. This is acceptable per the locked decision that publisher-specific extensions are deferred.
**Warning signs:** Empty or bare title in compiled PDF — expected behavior at this scope.

### Pitfall 2: STEP 2.5 Trim-Size Logic Crashing on Academic Platforms
**What goes wrong:** STEP 2.5 reads `manifest.yaml` from `templates/platforms/{platform}/manifest.yaml`. There is no `templates/platforms/ieee/manifest.yaml` or similar. If STEP 2.5 runs the existing path for academic slugs, it will fail on the manifest load.
**Why it happens:** The existing STEP 2.5 is structured around the publishing platform manifests (KDP, Ingram). Academic platforms use a completely different output route.
**How to avoid:** Early-exit STEP 2.5 for academic platform slugs: "if platform ∈ {ieee, acm, lncs, elsevier, apa7}, skip trim/page-count logic and proceed to STEP 3."
**Warning signs:** Missing manifest error when platform is ieee/acm/etc.

### Pitfall 3: kpsewhich Check Ordering
**What goes wrong:** The command checks `kpsewhich IEEEtran.cls` but kpsewhich itself is not installed (no TeX distribution). The shell returns "command not found" which the agent displays verbatim — confusing and unhelpful.
**Why it happens:** Two-level detection is needed: (1) is kpsewhich present? (2) is the class present?
**How to avoid:** STEP 2 must check `command -v kpsewhich` first. Only if kpsewhich is found does it proceed to `kpsewhich <Class>.cls`.
**Warning signs:** Error messages mentioning "kpsewhich: command not found" reaching the writer.

### Pitfall 4: `academic` Added to Wrong CONSTRAINTS.json Key
**What goes wrong:** CONSTRAINTS.json has both `commands.build-print.available` (a list under the `commands` key) AND `exports.build_print.available` (under the `exports` key). Adding `academic` to the wrong one means the STEP 1 check passes or fails incorrectly.
**Why it happens:** The two keys serve different purposes and are checked by different commands.
**How to avoid:** The locked decision says to add `academic` to `exports.build_print.available`. Verify the correct path: `constraints.exports.build_print.available`. The `commands.build-print.available` array is what the help/progress commands use to display availability. Both should include `academic`.
**Warning signs:** Academic work type either gets blocked in STEP 1 (if exports key was wrong) or allowed in build-ebook too (if commands key was wrong).

### Pitfall 5: LNCS bibstyle Recommendation
**What goes wrong:** Recommending `\bibliographystyle{llncs}` — the correct Springer LNCS bib style is `splncs04` (the current standard, superseding `splncs` and `llncs`).
**Why it happens:** The old `llncs` bib style name is commonly cited in older tutorials.
**How to avoid:** Use `splncs04` in the `scriveno-lncs.latex` bibliography section comment. [ASSUMED: splncs04 is the current standard — not verified against llncs.cls documentation in this session]
**Warning signs:** BibTeX warning about unknown style `llncs`.

---

## Code Examples

Verified patterns from existing codebase:

### Existing Prerequisite Check Pattern (from build-print.md STEP 2)
```bash
command -v pandoc >/dev/null 2>&1
```
Academic extension follows the same pattern:
```bash
command -v kpsewhich >/dev/null 2>&1
# Then:
kpsewhich IEEEtran.cls >/dev/null 2>&1
```
[VERIFIED: build-print.md STEP 2 pattern]

### kpsewhich Class-to-Package Mapping (all 5 verified against tlmgr)
| Platform | kpsewhich argument | tlmgr package | Error guidance |
|----------|-------------------|---------------|----------------|
| ieee | `IEEEtran.cls` | `ieeetran` | `tlmgr install ieeetran` |
| acm | `acmart.cls` | `acmart` | `tlmgr install acmart` |
| lncs | `llncs.cls` | `llncs` | `tlmgr install llncs` OR Springer download page |
| elsevier | `elsarticle.cls` | `elsarticle` | `tlmgr install elsarticle` |
| apa7 | `apa7.cls` | `apa7` | `tlmgr install apa7` |

[VERIFIED: all 5 packages confirmed in TeX Live via `tlmgr info` on host]

### Existing Template Variable Pattern (from scriveno-academic.latex)
```latex
% CSL reference environment — carry into all 5 new wrappers unchanged
$if(csl-refs)$
\newlength{\cslhangindent}
\setlength{\cslhangindent}{1.5em}
...
$endif$

% tightlist — carry into all 5 new wrappers unchanged
\providecommand{\tightlist}{%
  \setlength{\itemsep}{0pt}\setlength{\parskip}{0pt}}
```
[VERIFIED: scriveno-academic.latex line 91-108]

### Test Pattern (from phase34-cross-domain-templates.test.js)
```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'data', 'export-templates');
const BUILD_PRINT_PATH = path.join(ROOT, 'commands', 'scr', 'build-print.md');
const CONSTRAINTS_PATH = path.join(ROOT, 'data', 'CONSTRAINTS.json');

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch (_) { return null; }
}

describe('Phase 35: TPL-07 scriveno-ieee.latex exists with IEEEtran class', () => {
  const IEEE = path.join(TEMPLATES_DIR, 'scriveno-ieee.latex');

  it('scriveno-ieee.latex exists — TPL-07', () => {
    const content = readFile(IEEE);
    assert.ok(content !== null, 'data/export-templates/scriveno-ieee.latex must exist — TPL-07');
  });

  it('scriveno-ieee.latex contains \\documentclass{IEEEtran} — TPL-07', () => {
    const content = readFile(IEEE);
    assert.ok(content !== null, 'scriveno-ieee.latex must exist — TPL-07');
    assert.ok(
      content.includes('\\documentclass') && content.includes('IEEEtran'),
      'scriveno-ieee.latex must contain \\documentclass with IEEEtran — TPL-07'
    );
  });
  // ... etc.
});
```
[VERIFIED: pattern from test/phase34-cross-domain-templates.test.js]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pandoc `$common.latex()$` partial (default template) | Custom templates still use explicit `\providecommand{\tightlist}` and `$highlighting-macros$` | Pandoc 3.x | Pandoc 3.x default template uses `$common.latex()$` but custom templates must carry tightlist/CSL explicitly — the existing `scriveno-academic.latex` already does this correctly [VERIFIED: scriveno-academic.latex] |
| `$document-metadata.latex()$` partial | The default Pandoc template also uses `$passoptions.latex()$` and `$document-metadata.latex()$` | Pandoc 3.x | These partials are built into the Pandoc binary; custom templates do NOT have access to them; new wrappers must not reference `$common.latex()$` [VERIFIED: `pandoc --print-default-template=latex`] |

**Deprecated/outdated:**
- `splncs` bib style for LNCS: replaced by `splncs04` (current Springer recommendation). [ASSUMED]
- `IEEEabrv.bib` + `IEEEfull.bib`: these were used with older IEEEtran BibTeX; modern submissions use CSL or natbib directly. [ASSUMED]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Per-class default options (e.g., IEEEtran `[conference]`, acmart `[acmconf]`, apa7 `[jou]`) are community-standard | Architecture Patterns - Per-class deviations table | Options may need adjustment; low risk as wrappers use `$classoption$` variable allowing writer override |
| A2 | `splncs04` is the current LNCS bib style name (not `splncs` or `llncs`) | Common Pitfalls - Pitfall 5 | Wrong bib style name in wrapper comment; correctable by writer |
| A3 | `\usepackage{hyperref}` should be omitted from publisher wrappers to avoid conflicts | Architecture Patterns - Anti-patterns | IEEEtran and acmart handle hyperref internally; if not, writer must add it manually |
| A4 | Academic platforms do not need a `templates/platforms/ieee/manifest.yaml` (no trim size, no page limit applies) | Common Pitfalls - Pitfall 2 | If future features need academic manifests, a manifest stub would be required |

---

## Open Questions

1. **Should academic platforms be allowed for non-academic work types?**
   - What we know: `build_print.available` is checked against the work type's `group`; `academic` is the group containing `research_paper`, `thesis`, etc.
   - What's unclear: Should a `novel` writer be blocked from `--platform ieee`? The locked decision says "only valid when platform is one of the 5 academic publisher values" — but it doesn't say only academic work types can use them.
   - Recommendation: Block non-academic work types from academic platforms (symmetric with EPUB-only platform blocking) — add a check in STEP 1 or STEP 2.5 that "academic platform slugs require work_type.group == academic." This keeps the behavior consistent. The planner should decide whether this is a STEP 1 check or STEP 2.5 check.

2. **Does the metadata.yaml need a different shape for academic platforms?**
   - What we know: The existing metadata.yaml generation (STEP 3f) produces title, author, abstract, keywords, date from config.json/WORK.md.
   - What's unclear: Academic papers typically don't have front matter files the same way books do. The assembly (STEP 3) reads OUTLINE.md — does a research_paper have the same OUTLINE.md structure?
   - Recommendation: The assembly is already generic; it will work. The planner should note that STEP 3 assembly runs unchanged for academic platforms — no special handling needed.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Pandoc | `.tex` generation | Yes | 3.9.0.2 | — |
| kpsewhich | Class detection | Yes | kpathsea 6.4.2 | "No TeX distribution" error path |
| tlmgr | User installs publisher classes | Yes | TeX Live 2026 | Springer download page for llncs |
| Node.js | Test runner | Yes | 25.6.0 | — |
| IEEEtran.cls | IEEE `.tex` compilation (by user) | No (not installed) | 1.8b in TeX Live | — |
| acmart.cls | ACM `.tex` compilation (by user) | No (not installed) | 2.16 in TeX Live | — |
| llncs.cls | LNCS `.tex` compilation (by user) | No (not installed) | 2.26 in TeX Live | Springer download page |
| elsarticle.cls | Elsevier `.tex` compilation (by user) | No (not installed) | 3.5 in TeX Live | — |
| apa7.cls | APA7 `.tex` compilation (by user) | No (not installed) | 2.16 in TeX Live | — |

**Publisher classes are deliberately not installed on the dev machine** — this is the expected state that the kpsewhich detection is designed to handle. All 5 are available via `tlmgr install` from TeX Live 2026. [VERIFIED: `tlmgr info` for all 5 packages]

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node.js built-in test runner (node:test) |
| Config file | None — `node --test test/*.test.js` discovers all test files |
| Quick run command | `node --test test/phase35-academic-latex-wrappers.test.js` |
| Full suite command | `npm test` (runs `node --test test/*.test.js`) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TPL-07 | `scriveno-ieee.latex` exists with `\documentclass{IEEEtran}` | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | `scriveno-acm.latex` exists with `\documentclass{acmart}` | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | `scriveno-lncs.latex` exists with `\documentclass{llncs}` | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | `scriveno-elsevier.latex` exists with `\documentclass{elsarticle}` | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | `scriveno-apa7.latex` exists with `\documentclass{apa7}` | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | Each wrapper contains `\providecommand{\tightlist}` | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | Each wrapper contains `$body$` | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | Each wrapper contains `$if(abstract)$` | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | Each wrapper contains CSL reference environment | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | `build-print.md` references `kpsewhich` detection | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | `build-print.md` contains academic platform values (`ieee`, `acm`, `lncs`, `elsevier`, `apa7`) | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | `build-print.md` contains `paper-` output naming pattern | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | `build-print.md` contains missing-class error guidance with `tlmgr install` | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |
| TPL-07 | `CONSTRAINTS.json` `exports.build_print.available` includes `"academic"` | unit | `node --test test/phase35-academic-latex-wrappers.test.js` | No — Wave 0 |

### Sampling Rate
- **Per task commit:** `node --test test/phase35-academic-latex-wrappers.test.js`
- **Per wave merge:** `npm test`
- **Phase gate:** `npm test` green (all suites, including phase 34 regression) before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `test/phase35-academic-latex-wrappers.test.js` — covers all TPL-07 assertions above (Plan 35-01)

*(No framework or fixture gaps — existing test infrastructure fully covers Phase 35 test needs)*

---

## Security Domain

Phase 35 produces static `.latex` text files via Pandoc template substitution. No network calls, no user authentication, no data storage, no cryptographic operations. The only external interaction is calling `kpsewhich` via shell (a read-only TeX path query) and writing `.tex` files to the local `.manuscript/output/` directory.

Applicable ASVS categories:

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | — |
| V3 Session Management | No | — |
| V4 Access Control | No | — |
| V5 Input Validation | Minimal | `--platform` slug validated against allowed list (existing pattern in STEP 2.5) |
| V6 Cryptography | No | — |

No threat patterns identified for this phase beyond the existing STEP 2.5 platform slug validation.

---

## Sources

### Primary (HIGH confidence)
- `data/export-templates/scriveno-academic.latex` — existing template; Pandoc variable syntax and boilerplate verified directly
- `commands/scr/build-print.md` — existing command; STEP 2, 2.5, 1.8, and 4 extension points verified directly
- `data/CONSTRAINTS.json` — existing constraints; `exports.build_print.available` and `work_type_groups.academic` verified directly
- `test/phase34-cross-domain-templates.test.js` — test pattern verified directly (38 passing tests confirmed via `node --test`)
- `pandoc --print-default-template=latex` — Pandoc 3.9.0.2 default template; confirmed partial system (`$common.latex()$`) vs custom template approach
- `kpsewhich article.cls` / `kpsewhich nonexistent.cls` — exit codes 0 and 1 confirmed on host
- `tlmgr info ieeetran|acmart|llncs|elsarticle|apa7` — all 5 packages confirmed in TeX Live with versions

### Secondary (MEDIUM confidence)
- IEEEtran.cls version 1.8b in TeX Live — `tlmgr info ieeetran` confirms package exists and version
- llncs in `collection-publishers` — `tlmgr info llncs` shows `collection: collection-publishers` and links to Springer

### Tertiary (LOW confidence)
- Per-class default classoptions (e.g., `acmconf`, `jou`, `preprint`) — community conventions from training data, not verified against current class documentation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools verified on host (`pandoc --version`, `kpsewhich`, `tlmgr info`)
- Architecture: HIGH — extension points confirmed by reading `build-print.md`; kpsewhich exit codes verified
- Template design: HIGH for boilerplate (direct codebase read); MEDIUM for per-class options (training data)
- Pitfalls: HIGH — derived from direct codebase analysis (STEP 2.5 manifest path issue, kpsewhich ordering)
- Test patterns: HIGH — confirmed by running existing phase tests

**Research date:** 2026-04-17
**Valid until:** 2026-07-17 (stable domain — Pandoc template format and TeX Live package names change rarely)
