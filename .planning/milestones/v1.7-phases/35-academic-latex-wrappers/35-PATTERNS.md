# Phase 35: Academic LaTeX Wrappers - Pattern Map

**Mapped:** 2026-04-17
**Files analyzed:** 8 (5 new LaTeX templates, 1 modified command, 1 modified config, 1 new test)
**Analogs found:** 8 / 8

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `data/export-templates/scriveno-ieee.latex` | config/template | transform | `data/export-templates/scriveno-academic.latex` | exact (same file type, same Pandoc variable system, same purpose) |
| `data/export-templates/scriveno-acm.latex` | config/template | transform | `data/export-templates/scriveno-academic.latex` | exact |
| `data/export-templates/scriveno-lncs.latex` | config/template | transform | `data/export-templates/scriveno-academic.latex` | exact |
| `data/export-templates/scriveno-elsevier.latex` | config/template | transform | `data/export-templates/scriveno-academic.latex` | exact |
| `data/export-templates/scriveno-apa7.latex` | config/template | transform | `data/export-templates/scriveno-academic.latex` | exact |
| `commands/scr/build-print.md` | middleware/command | request-response | `commands/scr/build-print.md` (self — extension) | self-extension |
| `data/CONSTRAINTS.json` | config | CRUD | `data/CONSTRAINTS.json` (self — extension) | self-extension |
| `test/phase35-academic-latex-wrappers.test.js` | test | batch | `test/phase34-cross-domain-templates.test.js` | exact |

---

## Pattern Assignments

### `data/export-templates/scriveno-ieee.latex` (and all 4 sibling wrappers)

**Analog:** `data/export-templates/scriveno-academic.latex`

**Critical design constraint:** The new wrappers are STRIPPED-DOWN versions of the analog. The analog includes geometry, fancyhdr, setspace, lmodern, babel, hyperref, longtable, enumitem, xcolor, biblatex. ALL of these must be OMITTED from publisher wrappers — publisher classes own their own layout. Copying the analog wholesale will cause compilation errors.

**What to KEEP from the analog (copy these sections verbatim):**

Header comment pattern (analog lines 1-5):
```latex
% Scriveno <PUBLISHER> LaTeX Template for Pandoc --template flag
% Requires <CLASS>.cls (install: tlmgr install <pkg>)
% Usage: pandoc ... --template=data/export-templates/scriveno-<platform>.latex
```

Encoding block — safe universal addition (analog lines 13-14; keep, drop lmodern):
```latex
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
```

Graphics block (analog lines 55-60):
```latex
\usepackage{graphicx}
\makeatletter
\def\maxwidth{\ifdim\Gin@nat@width>\linewidth\linewidth\else\Gin@nat@width\fi}
\def\maxheight{\ifdim\Gin@nat@height>\textheight\textheight\else\Gin@nat@height\fi}
\makeatother
\setkeys{Gin}{width=\maxwidth,height=\maxheight,keepaspectratio}
```

Math support (analog line 83):
```latex
\usepackage{amsmath,amssymb}
```

Pandoc highlighting-macros block (analog lines 86-88):
```latex
$if(highlighting-macros)$
$highlighting-macros$
$endif$
```

Pandoc tightlist (analog lines 91-92):
```latex
\providecommand{\tightlist}{%
  \setlength{\itemsep}{0pt}\setlength{\parskip}{0pt}}
```

CSL references block (analog lines 95-108) — copy VERBATIM:
```latex
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
```

Metadata bridge (analog lines 127-131) — title/author/date, drop subtitle for wrappers:
```latex
\title{$if(title)$$title$$else$Untitled$endif$}
\author{$if(author)$$for(author)$$if(it.name)$$it.name$$else$$it$$endif$$sep$ \and $endfor$$else$~$endif$}
\date{$if(date)$$date$$else$\today$endif$}
```

Body / document wrapper (analog lines 135-184, stripped to essentials):
```latex
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
\end{document}
```

**What to OMIT (present in analog, must NOT appear in publisher wrappers):**

- `\usepackage{lmodern}` — analog line 15
- `\usepackage[...]{geometry}` — analog line 23
- `\usepackage[...]{babel}` — analog lines 26-29
- `\usepackage{setspace}` + `\setstretch` — analog lines 32-37
- `\usepackage{fancyhdr}` + `\pagestyle{fancy}` block — analog lines 40-45
- `\setcounter{secnumdepth}` — analog lines 48-52
- `\usepackage{longtable,booktabs,array}` — analog line 63
- `\usepackage{enumitem}` — analog line 66
- `\usepackage[usenames,dvipsnames]{xcolor}` — analog line 69
- `\usepackage[...]{hyperref}` block — analog lines 72-80
- `\usepackage[backend=biber,...]{biblatex}` block — analog lines 112-123
- `\printbibliography` — analog line 175
- TOC, LOF, LOT conditionals — analog lines 153-167
- Appendix conditional — analog lines 179-182
- `$if(fontsize)$` and `$if(documentclass)$` variable in `\documentclass` — NOT used; each wrapper hardcodes its publisher class

**`\documentclass` line — per-class pattern:**

The analog uses a variable documentclass (line 8). Publisher wrappers hardcode the class with a `classoption` pass-through:
```latex
\documentclass[$if(classoption)$$for(classoption)$$classoption$$sep$,$endfor$$endif$]{<PUBLISHERCLASS>}
```

**Per-class specifics:**

| File | `\documentclass` arg | Default classoption in comment | Bibliography style |
|---|---|---|---|
| `scriveno-ieee.latex` | `IEEEtran` | `[conference]` or `[journal]` | `IEEEtran` bib style |
| `scriveno-acm.latex` | `acmart` | `[acmconf,review=false]` | biblatex-acm or natbib per ACM |
| `scriveno-lncs.latex` | `llncs` | (none standard) | `splncs04` bib style |
| `scriveno-elsevier.latex` | `elsarticle` | `[preprint,12pt]` | `elsarticle-num` |
| `scriveno-apa7.latex` | `apa7` | `[jou,longtable]` or `[man]` | biblatex-apa |

**llncs-specific bibliography note** (LNCS only — add as comment in `scriveno-lncs.latex`):
```latex
% Bibliography: use splncs04 bib style (not llncs — that style is deprecated)
% \bibliographystyle{splncs04}
% Note: llncs.cls may also be obtained from Springer's author resources page
% if tlmgr install llncs is unavailable on your TeX distribution:
% https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines
```

---

### `commands/scr/build-print.md` (command, request-response — self-extension)

**Analog:** `commands/scr/build-print.md` itself (extending existing STEPS)

**STEP 2 prerequisite check pattern** (analog lines 197-214 — Pandoc check; lines 218-234 — Typst check; lines 236-254 — Ghostscript conditional check). New kpsewhich checks follow EXACTLY this pattern and are inserted at the end of STEP 2:

```markdown
If platform is one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7`:

Check for kpsewhich (TeX distribution presence):

```bash
command -v kpsewhich >/dev/null 2>&1
```

If kpsewhich is not found:

> **No TeX distribution found. kpsewhich is required to verify LaTeX class availability.**
>
> **Install a TeX distribution:**
> - macOS: `brew install basictex` (BasicTeX, ~100MB) or `brew install mactex` (full TeX Live, ~4GB)
> - Linux: `sudo apt install texlive-base` or download TeX Live from https://tug.org/texlive/
> - Windows: Download MiKTeX from https://miktex.org/ or TeX Live from https://tug.org/texlive/
>
> After installing, run this build command again.

Then **stop**.

Map platform to class file:
- `ieee` → `IEEEtran.cls`, install: `tlmgr install ieeetran`
- `acm` → `acmart.cls`, install: `tlmgr install acmart`
- `lncs` → `llncs.cls`, install: `tlmgr install llncs` (or Springer download page)
- `elsevier` → `elsarticle.cls`, install: `tlmgr install elsarticle`
- `apa7` → `apa7.cls`, install: `tlmgr install apa7`

Check for the publisher class:

```bash
kpsewhich <CLASS_FILE> >/dev/null 2>&1
```

If class not found (for ieee example):

> **IEEEtran.cls is not installed in your TeX distribution.**
>
> Install it: `tlmgr install ieeetran`
>
> After installing, run this build command again.

(For lncs, add note:)
> **llncs.cls is not installed in your TeX distribution.**
>
> Install it: `tlmgr install llncs`
> If tlmgr is unavailable, download llncs.cls from Springer's author resources:
> https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines
>
> After installing, run this build command again.

Then **stop**.
```

**STEP 2.5 platform validation extension** (analog lines 267-284):

Current allowed-values line (analog line 268):
```
`kdp`, `ingram`, `apple`, `bn`, `d2d`, `kobo`, `google`, `smashwords`
```

Extended to:
```
`kdp`, `ingram`, `apple`, `bn`, `d2d`, `kobo`, `google`, `smashwords`, `ieee`, `acm`, `lncs`, `elsevier`, `apa7`
```

New early-exit branch BEFORE trim-size logic (insert after EPUB-only check block, analog lines 279-284):
```markdown
**If platform is an academic publisher platform** (`ieee`, `acm`, `lncs`, `elsevier`, `apa7`):

Skip trim-size validation and page-count guardrail — these are not applicable to `.tex` output.

Proceed directly to STEP 3.
```

**STEP 1.8 template selection extension** (analog lines 172-188):

Add a new branch BEFORE the existing `work_type` map, as the first check:
```markdown
**If platform is one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7`:**

Set `LATEX_TEMPLATE = data/export-templates/scriveno-{platform}.latex`

If the template file does not exist:
> **Build template missing: `data/export-templates/scriveno-{platform}.latex` not found.**
> Re-install Scriveno or restore the file from the repository.

Then **stop**.

Skip Typst template selection (set `TYPST_TEMPLATE` to null). Proceed to STEP 2.
```

**STEP 4 academic route** (analog lines 384-414 — Pandoc + Typst invocation):

Insert new branch BEFORE the existing `pandoc` invocation block:
```markdown
**If platform is one of `ieee`, `acm`, `lncs`, `elsevier`, `apa7` (academic LaTeX route):**

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/paper-{platform}.tex \
  --template=data/export-templates/scriveno-{platform}.latex \
  --metadata-file=.manuscript/output/metadata.yaml
```

Note: No `--pdf-engine` flag is used. Pandoc produces `.tex` source only. Compile with your TeX distribution:
```bash
# Example compilation (run in .manuscript/output/):
pdflatex paper-{platform}.tex
bibtex paper-{platform}
pdflatex paper-{platform}.tex
pdflatex paper-{platform}.tex
```

Proceed to STEP 5.
```

**STEP 5 report extension** (analog lines 420-429):

Add academic variant of success report:
```markdown
For academic platforms, show:
```
✓ LaTeX source built → .manuscript/output/paper-{platform}.tex ({file_size})
  Compile with pdflatex or xelatex using your TeX distribution.
```
```

---

### `data/CONSTRAINTS.json` (config — self-extension)

**Analog:** `data/CONSTRAINTS.json` itself

**Target key** (verified from CONSTRAINTS.json line 1263):
```json
"build_print": { "available": ["prose", "visual", "poetry", "sacred"] }
```

**Extended value:**
```json
"build_print": { "available": ["prose", "visual", "poetry", "sacred", "academic"] }
```

**Also update** `commands.build-print.available` (CONSTRAINTS.json line 1068) for display consistency:
```json
"build-print": {
  "category": "publishing",
  "available": ["prose", "visual", "poetry", "sacred", "academic"],
  "description": "Build print-ready PDF or academic LaTeX source with platform trim sizes and page-count guardrails (Pandoc + Typst) or publisher class wrappers (Pandoc + LaTeX)"
}
```

The `work_type_groups.academic` key (CONSTRAINTS.json lines 15-18) already exists with correct members — no change needed:
```json
"academic": {
  "label": "Academic",
  "members": ["research_paper", "thesis", "journal_article", "white_paper", "literature_review", "monograph"]
}
```

---

### `test/phase35-academic-latex-wrappers.test.js` (test, batch)

**Analog:** `test/phase34-cross-domain-templates.test.js`

**File header pattern** (analog lines 1-11) — copy VERBATIM, update paths:
```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT              = path.join(__dirname, '..');
const TEMPLATES_DIR     = path.join(ROOT, 'data', 'export-templates');
const BUILD_PRINT_PATH  = path.join(ROOT, 'commands', 'scr', 'build-print.md');
const CONSTRAINTS_PATH  = path.join(ROOT, 'data', 'CONSTRAINTS.json');
```

**readFile helper** (analog lines 14-21) — copy VERBATIM:
```javascript
function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch (_) { return null; }
}
```

**describe/it block pattern** (analog lines 27-101) — each describe block covers one TPL requirement, it-blocks test one assertion:
```javascript
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
  // ... pattern repeats per assertion
});
```

**Ordering convention** (observed from analog): tests are grouped by TPL requirement ID within a single describe block. Within a describe, the first `it` always checks file existence. Subsequent `it` blocks check content.

**CONSTRAINTS.json test pattern** (analog lines 260-268):
```javascript
it('data/CONSTRAINTS.json exports.build_print.available includes "academic" — TPL-07', () => {
  const raw = readFile(CONSTRAINTS_PATH);
  assert.ok(raw !== null, 'data/CONSTRAINTS.json must be readable — TPL-07');
  const constraints = JSON.parse(raw);
  assert.ok(
    Array.isArray(constraints.exports.build_print.available) &&
    constraints.exports.build_print.available.includes('academic'),
    'CONSTRAINTS.json exports.build_print.available must include "academic" — TPL-07'
  );
});
```

Note: Phase 34 uses `content.includes('"build-smashwords"')` (string search) for CONSTRAINTS checks. For Phase 35 the planner may use either string search or JSON.parse — both are valid. JSON.parse is more precise for the nested `exports.build_print.available` path.

**build-print.md content-search pattern** (analog lines 80-100):
```javascript
it('build-print.md references kpsewhich — TPL-07', () => {
  const content = readFile(BUILD_PRINT_PATH);
  assert.ok(content !== null, 'commands/scr/build-print.md must be readable — TPL-07');
  assert.ok(
    content.includes('kpsewhich'),
    'build-print.md must reference kpsewhich — TPL-07'
  );
});
```

---

## Shared Patterns

### Prerequisite Check Structure (STEP 2 of build-print.md)

**Source:** `commands/scr/build-print.md` lines 196-254
**Apply to:** kpsewhich detection block (two-level: kpsewhich presence, then class presence)

The pattern is always:
1. `command -v <tool> >/dev/null 2>&1` — detect tool existence
2. If not found: blockquote error with per-OS install commands, then `Then **stop**.`
3. If platform-conditional: wrap the entire check in `If --platform <value> was passed`

```markdown
Check for <tool>:

```bash
command -v <tool> >/dev/null 2>&1
```

If <tool> is not found:

> **<tool> is required for <purpose> but is not installed.**
>
> **Install <tool>:**
> - macOS: `brew install <pkg>`
> - Linux: `sudo apt install <pkg>`
> - Windows: `choco install <pkg>`
> - Or download from <url>
>
> After installing, run this build command again.

Then **stop**.
```

### Pandoc Template Variable Syntax

**Source:** `data/export-templates/scriveno-academic.latex`
**Apply to:** All 5 new `.latex` wrapper templates

Standard Pandoc template variable forms used in the analog:
- `$if(varname)$ ... $endif$` — conditional block
- `$for(varname)$ ... $sep$ ... $endfor$` — loop with separator
- `$varname$` — simple substitution
- `$if(it.name)$$it.name$$else$$it$$endif$` — object vs scalar author

These are Pandoc-native and must NOT be changed. The wrappers use exactly the same variable names as the analog (`$title$`, `$author$`, `$abstract$`, `$keywords$`, `$date$`, `$body$`, `$bibliography$`, `$if(csl-refs)$`, `$if(highlighting-macros)$`).

### test/phase35 Test IDs

**Source:** `test/phase34-cross-domain-templates.test.js`
**Apply to:** `test/phase35-academic-latex-wrappers.test.js`

All test assertions must end with `— TPL-07` (the phase requirement ID). This is the convention across all phase test files — the requirement ID tags every assertion message for traceability.

---

## No Analog Found

All files have close analogs. No file in this phase requires a completely novel pattern.

---

## Anti-Patterns (from RESEARCH.md — do not copy from analog)

These patterns exist in `scriveno-academic.latex` but must NOT be copied into the 5 publisher wrappers:

| Anti-pattern | Why not | Source in analog |
|---|---|---|
| `\usepackage{geometry}` | Publisher class defines margins | line 23 |
| `\usepackage{fancyhdr}` + `\pagestyle{fancy}` | Publisher class defines headers/footers | lines 40-45 |
| `\usepackage{setspace}` + `\setstretch` | Publisher class defines line spacing | lines 32-37 |
| `\usepackage{lmodern}` | Conflicts with publisher fonts | line 15 |
| `\usepackage[...]{hyperref}` | IEEEtran and acmart load it internally | lines 72-80 |
| `\usepackage[backend=biber,...]{biblatex}` | Publisher classes use their own bibliography system | lines 112-123 |
| `$if(documentclass)$$documentclass$$else$article$endif$` in `\documentclass` | Wrapper hardcodes the publisher class, not a variable | line 8 |
| `\printbibliography` | Not used in wrapper bibliography block | line 175 |

---

## Metadata

**Analog search scope:** `data/export-templates/`, `commands/scr/`, `test/`, `data/`
**Files scanned:** 4 (scriveno-academic.latex, build-print.md, CONSTRAINTS.json, phase34-cross-domain-templates.test.js)
**Pattern extraction date:** 2026-04-17
