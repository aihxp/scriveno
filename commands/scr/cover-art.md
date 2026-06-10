---
description: Generate structured cover art prompts and delivery briefs for ebook, paperback, and hardcover covers.
argument-hint: "[--trim <size>] [--kdp <trim_size>] [--series] [--prompt-only] [--element front|spine|back|full-wrap]"
---

# /scr:cover-art -- Cover Art Prompt Generator

Generate detailed, copy-pasteable prompts and delivery briefs for book cover art. Scriveno separates **prompt generation** from the **final packaged cover files**:

- Prompt files live under `.manuscript/illustrations/cover/`
- Final designer/export files live under `.manuscript/build/`

This command supports three final deliverables:

| Deliverable | Canonical file | Surface |
|-------------|----------------|---------|
| Ebook cover | `.manuscript/build/ebook-cover.jpg` (or `.png`) | Front cover only |
| Paperback cover | `.manuscript/build/paperback-cover.pdf` | Full wrap: back + spine + front |
| Hardcover cover | `.manuscript/build/hardcover-cover.pdf` | Full case wrap: back + spine + front + board wrap |

Keep editable source files for future revisions under `.manuscript/build/source/` (PSD, AI, Figma export, or equivalent).

## Usage
```
/scr:cover-art [--trim <size>] [--kdp <trim_size>] [--series] [--prompt-only] [--element front|spine|back|full-wrap]
```

**Flags:**
- `--trim <size>` -- Preferred trim shorthand for prompt framing (e.g., `6x9`, `5.5x8.5`, `5x8`)
- `--kdp <trim_size>` -- Legacy alias for `--trim`
- `--series` -- Apply series visual consistency from ART-DIRECTION.md
- `--prompt-only` -- Generate prompts without packaging reminders
- `--element <element>` -- Generate prompt for a single element only (`front`, `spine`, `back`, `full-wrap`)

## Instruction

You are a **cover art prompt specialist**. You generate structured, detailed prompts for cover art that can be copy-pasted into an AI image tool or handed directly to a human designer.

There are three delivery paths, and the writer does not need an image-generation model for the third:

1. **AI image tool** -- the writer pastes the prompt into an external image generator
2. **Human designer** -- the prompt doubles as a design brief
3. **Agent-built vector cover** -- when no image-generation capability exists in this session and the writer has no external image tool, you design the cover yourself as original SVG or HTML/CSS art and convert it to the required JPG/PNG/PDF deliverables with local CLI tools (see STEP 6.5)

Never stop at "paste this prompt into an image tool" if the writer has no image tool. The vector path is a first-class deliverable, not a degraded fallback: typographic, geometric, and symbolic covers are a respected tradition in literary fiction, nonfiction, poetry, and sacred work.

---

### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, language, trim size, page count, and project settings
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) -- to check `commands.cover-art.available` and `commands.cover-art.hidden`
- `docs/surface-resolution-protocol.md` -- to resolve adapted cast surfaces
- `.manuscript/WORK.md` -- premise, tone, themes, setting
- The adapted cast surface for canonical `CHARACTERS.md`, when applicable -- for cast imagery on the cover
- `.manuscript/illustrations/ART-DIRECTION.md` -- if it exists, for visual style consistency

**Check availability:**

Look up the current work type's group in CONSTRAINTS.json. If the group is in `commands.cover-art.hidden` (script, academic, interactive, speech_song), inform the writer:

> Cover art is not available for [work_type] projects.

Then **stop**.

---

### STEP 2: LOCK THE COVER DELIVERABLE CONTRACT

Treat `.manuscript/build/` as the canonical delivery surface for finished cover files.

**Ebook**
- File: `.manuscript/build/ebook-cover.jpg` (PNG also acceptable)
- Dimensions: `1600 x 2560` pixels
- Aspect ratio: `1:1.6`
- Color space: `RGB`
- Resolution target: `72 DPI equivalent` (pixels matter more than DPI)
- Surface: **front cover only**
- No spine, no back, no bleed

**Paperback**
- File: `.manuscript/build/paperback-cover.pdf`
- Format: `PDF/X-1a:2001`
- Color space: `CMYK`
- Resolution: `300 DPI minimum`
- Fonts: embedded
- Transparency: flattened
- Bleed: `0.125"` on outer edges
- Surface: **back + spine + front in one full-wrap PDF**
- Required content zones: front art, spine text, back blurb, ISBN/barcode area, author info

**Hardcover**
- File: `.manuscript/build/hardcover-cover.pdf`
- Format: `PDF/X-1a:2001`
- Color space: `CMYK`
- Resolution: `300 DPI minimum`
- Fonts: embedded
- Transparency: flattened
- Surface: **back + spine + front + board-wrap area in one full case-wrap PDF**
- Wrap allowance: `0.75"` extra on top/bottom/fore-edge for board wrap
- Required content zones: front art, spine text, back blurb, ISBN/barcode area, author info

**Source files**
- Directory: `.manuscript/build/source/`
- Keep editable source files here so future trim-size or barcode revisions do not require rebuilding the artwork from scratch

If the writer only has concept prompts and no final designer assets yet, still generate the prompt files now and remind them that the final files belong in `.manuscript/build/`.

---

### STEP 3: DETERMINE PRINT GEOMETRY FROM REAL TEMPLATES

**Do not invent exact full-wrap width or spine geometry from hard-coded paper-factor math.**

For **paperback** and **hardcover**, exact wrap dimensions must come from the current IngramSpark Cover Template Generator (or the target platform's equivalent current template tool) using the real trim size, binding, page count, and paper choice.

Use this rule:

- **Paperback:** select 6x9 trim (or the project trim), page count, paper type, and perfect-bound in the template generator
- **Hardcover:** select the hardcover / case laminate template for the same trim and page count

If the writer has not generated the platform template yet:

> Exact print-cover geometry is still pending. Use `{FROM TEMPLATE GENERATOR}` placeholders for spine width and full-wrap size, and tell the writer to generate the current platform template before finalizing the cover.

If the writer **has** generated the platform template, use its exact dimensions and safety guides in the prompt/delivery brief.

`--trim` / `--kdp` may still be used as shorthand for the intended trim, but they do **not** replace the template-generator geometry for final print files.

---

### STEP 4: DETERMINE GENRE CONVENTIONS (D-02)

Based on the genre from WORK.md and config.json, apply genre-specific cover conventions:

| Genre | Imagery | Color Palette | Typography |
|-------|---------|---------------|------------|
| **Romance** | Couple, intimate pose, scenic backdrop | Warm tones (rose, gold, sunset) | Flowing script or elegant serif, embossed/foil effect |
| **Thriller / Mystery** | Dark silhouette, urban setting, single object | Dark palette, high contrast (black, red, steel blue) | Bold sans-serif, condensed, all-caps |
| **Fantasy** | Sweeping landscape, magical scene, character in action | Rich jewel tones (emerald, sapphire, gold) | Ornate display type, decorative serifs |
| **Sci-Fi** | Space, technology, futuristic city, abstract | Cool metallics (silver, electric blue, neon) | Clean modern sans-serif, geometric |
| **Literary Fiction** | Minimalist, typographic, single symbolic object | Muted palette (cream, sage, dusty blue) | Refined serif, generous whitespace |
| **Children's** | Bright character-focused, whimsical scene | Bright saturated primaries and secondaries | Playful hand-lettered or rounded sans-serif |
| **Horror** | Dark atmospheric, unsettling imagery, isolation | Desaturated with crimson or sickly green accent | Distressed, cracked, or dripping typography |
| **Memoir / Biography** | Author photo or symbolic personal imagery | Warm or muted, personal | Classic serif, understated elegance |
| **Poetry** | Abstract, nature, minimal | Ethereal, soft pastels or stark monochromes | Elegant thin serif or handwritten |
| **Sacred / Religious** | Iconographic, symbolic, light imagery | Gold, deep blue, white, liturgical colors | Traditional serif, formal, reverent |
| **Default / Other** | Derive from WORK.md tone and premise | Derive from genre mood | Derive from formality level |

If genre is not clearly one of the above, derive the visual direction from WORK.md tone, themes, and premise.

---

### STEP 5: SERIES CONSISTENCY (D-03)

**If `--series` flag is provided:**

Load `.manuscript/illustrations/ART-DIRECTION.md`. If it does not exist:

> **ART-DIRECTION.md not found.** Run `/scr:art-direction` first to create the visual style bible, then re-run with `--series`.
> Proceeding without series consistency constraints.

If ART-DIRECTION.md exists, extract and enforce:
- **Color palette:** same primary/secondary/accent colors across the series
- **Typography style:** consistent font family, weight, and placement
- **Layout structure:** same general composition template
- **Visual motifs:** recurring design elements that identify the series
- **Art style:** same rendering approach (realistic, stylized, painterly, etc.)

Include a **Series Consistency Notes** section in each prompt referencing ART-DIRECTION.md constraints.

---

### STEP 6: GENERATE PROMPTS (D-01)

Generate prompts for each requested cover element using the structured format below.

Use:
- **Front-only** technical specs for ebook
- **Template-driven full-wrap** technical specs for paperback/hardcover
- **Barcode safe zone** on print backs
- **Spine text** only when the writer confirms the spine is wide enough in the real platform template

#### FRONT COVER PROMPT

```markdown
# Front Cover Prompt

## Subject
[Primary imagery derived from genre conventions and WORK.md premise. Include main character(s) if applicable, key symbolic elements, and setting hints.]

## Composition
- **Title placement:** [top third / center / bottom third]
- **Author name placement:** [top / bottom]
- **Tagline placement:** [below title / above author / none]
- **Primary imagery focal point:** [center / left-of-center / right-of-center]
- **Negative space for text:** [areas reserved for title and author]

## Style
[Art style from genre conventions or ART-DIRECTION.md. Rendering technique, level of detail, texture.]

## Color Palette
- Dominant: [color]
- Supporting: [color]
- Accent: [color]
- Text color: [high-contrast title/author color]

## Mood
[Emotional atmosphere the cover should convey. Match WORK.md tone.]

## Technical Specs
- Ebook final: `1600 x 2560 px`, RGB, JPG/PNG, front cover only
- Print front panel: match the active paperback/hardcover template safe zone
- Resolution: `300 DPI` minimum for print-derived art assets
- Bleed awareness: keep critical text and faces inside the trim-safe area
```

#### SPINE PROMPT

```markdown
# Spine Prompt

## Subject
- Title: [title from config.json]
- Author: [author from config.json]
- Optional imprint/logo zone: [bottom of spine]

## Composition
- **Text orientation:** Vertical
- **Title position:** Upper portion of spine
- **Author position:** Lower portion of spine
- **Spacing:** Even distribution with breathing room

## Style
[Match front cover typography. Simple, readable, high contrast.]

## Color Palette
- Background: [match or complement the front cover]
- Text: [high-contrast color]

## Mood
[Continuation of the front-cover atmosphere]

## Technical Specs
- Paperback spine width: `{FROM PAPERBACK TEMPLATE GENERATOR}`
- Hardcover spine width: `{FROM HARDCOVER TEMPLATE GENERATOR}`
- Resolution: `300 DPI` minimum
- Include spine text only if the real template confirms it is readable at finished size
```

#### BACK COVER PROMPT

```markdown
# Back Cover Prompt

## Subject
- **Blurb text area:** upper two-thirds
- **Author photo area:** optional lower corner
- **Pull-quote area:** optional between blurb and author
- **Barcode placement zone:** bottom-right, keep clear

## Composition
- **Blurb block:** centered or left-aligned, upper 60-70%
- **Barcode zone:** white/light safe block in bottom-right
- **Background treatment:** continuation of front cover imagery, gradient, texture, or solid field

## Style
[Match front cover style but simplify for readability.]

## Color Palette
- Background: [complement front cover]
- Blurb text: [high contrast]
- Quote text: [slight typographic distinction]

## Mood
[Inviting, intriguing, sales-oriented]

## Technical Specs
- Print only: paperback or hardcover wrap
- Resolution: `300 DPI` minimum
- Paperback bleed: `0.125"` outer edges
- Hardcover board wrap: `0.75"` outer wrap allowance where required
- Barcode and ISBN zone must remain free of decorative detail
```

#### FULL-WRAP PROMPT

```markdown
# Full Wrap Prompt

## Subject
[Combined front + spine + back as one continuous design. Describe how the visual motif flows across the entire wrap.]

## Composition
- **Front cover (right panel):** primary imagery and title zone
- **Spine (center strip):** title and author
- **Back cover (left panel):** blurb zone, barcode zone, optional author/photo area
- **Wrap flow:** how the art or texture connects across panels

## Style
[Single cohesive visual language across the full package.]

## Color Palette
- Dominant: [color]
- Supporting: [color]
- Accent: [color]

## Mood
[Single cohesive atmosphere across the entire cover]

## Technical Specs
- Paperback final: `PDF/X-1a:2001`, CMYK, 300 DPI, fonts embedded, transparency flattened
- Hardcover final: `PDF/X-1a:2001`, CMYK, 300 DPI, fonts embedded, transparency flattened
- Exact width, height, and spine: `{FROM TEMPLATE GENERATOR}`
- Paperback bleed: `0.125"`
- Hardcover board wrap allowance: `0.75"` on top/bottom/fore-edge
```

---

### STEP 6.5: NO IMAGE TOOL? BUILD THE COVER AS VECTOR ART

Use this path when any of these is true:

- The session has no image-generation capability and the writer has no external AI image service
- The writer asks Scriveno to produce the cover file directly
- The design calls for a typographic, geometric, or symbolic cover that vector art renders better than a diffusion model

**Design the art yourself.** Apply the same structure as the prompts in STEP 6 (genre conventions, palette, composition, mood), but write it as original SVG at the exact deliverable geometry (for ebook: a `1600 x 2560` viewBox). HTML/CSS rendered at fixed pixel size is an acceptable alternative when the design depends on CSS layout or web-font features.

**Fonts:** use only fonts with licenses that permit commercial use and embedding (SIL OFL faces such as the Google Fonts catalog are safe). Record the font name and license in the delivery note. Before rasterizing, confirm the font is installed locally or convert the text to outlined paths so the renderer cannot silently substitute it.

**Save the editable source first:**

- `.manuscript/build/source/ebook-cover.svg` (or `.html`)

**Convert to the delivery spec.** Detect which converter is installed and use the first available:

| Tool | Check | SVG to raster |
|------|-------|---------------|
| librsvg | `command -v rsvg-convert` | `rsvg-convert -w 1600 -h 2560 source/ebook-cover.svg -o ebook-cover.png` |
| Inkscape | `command -v inkscape` | `inkscape source/ebook-cover.svg -w 1600 -h 2560 -o ebook-cover.png` |
| ImageMagick | `command -v magick` | `magick -density 300 source/ebook-cover.svg -resize 1600x2560 ebook-cover.png` |
| Headless Chrome (HTML/CSS covers) | `command -v google-chrome \|\| command -v chromium` | `chrome --headless --screenshot=ebook-cover.png --window-size=1600,2560 source/ebook-cover.html` |

Then produce the canonical JPG with ImageMagick (or `sips` on macOS):

```bash
magick ebook-cover.png -colorspace sRGB -quality 92 .manuscript/build/ebook-cover.jpg
```

**Verify before declaring done:** check the output is exactly `1600 x 2560`, RGB, and under the platform's file-size limit (`magick identify` or `sips -g pixelWidth -g pixelHeight`). Report the actual numbers.

**Print covers:** the same SVG source can export to PDF (`rsvg-convert -f pdf` or Inkscape), but final paperback/hardcover files still require the template-driven geometry from STEP 3 and PDF/X-1a CMYK conversion via Ghostscript. Treat the vector path as production-ready for ebook covers and as a strong draft for print covers pending the platform template.

**If no converter is installed:** still write the SVG/HTML source to `.manuscript/build/source/`, then tell the writer the single tool to install (prefer `rsvg-convert` via `brew install librsvg`, or ImageMagick which is already a Scriveno prerequisite) and the exact command to run.

**Disclosure note:** an agent-built cover is AI-generated imagery for platforms that require AI-content disclosure. Record this in the delivery note and point the writer at `/scr:compliance-check` before upload.

---

### STEP 7: WRITE OUTPUT FILES

Create the prompt directory if needed:

```bash
mkdir -p .manuscript/illustrations/cover
mkdir -p .manuscript/build/source
```

Write prompt files under `.manuscript/illustrations/cover/`:

- `--element front` -> `.manuscript/illustrations/cover/front-cover-prompt.md`
- `--element spine` -> `.manuscript/illustrations/cover/spine-prompt.md`
- `--element back` -> `.manuscript/illustrations/cover/back-cover-prompt.md`
- `--element full-wrap` -> `.manuscript/illustrations/cover/full-wrap-prompt.md`
- no `--element` -> write all of the above plus `.manuscript/illustrations/cover/cover-prompts-combined.md`

Always include a short delivery note reminding the writer/designer where the final packaged files belong:

- `.manuscript/build/ebook-cover.jpg`
- `.manuscript/build/paperback-cover.pdf`
- `.manuscript/build/hardcover-cover.pdf`
- `.manuscript/build/source/`

Commit message if the writer asks for one later: `cover-art: generate cover prompts`

---

### STEP 8: REPORT BACK

Tell the writer:

1. Which prompt files were written under `.manuscript/illustrations/cover/`
2. Which final asset files should exist under `.manuscript/build/`
3. Which delivery path applies: AI image tool, human designer, or agent-built vector cover (STEP 6.5)
4. Whether exact print geometry is still pending the template generator
5. If `--series` was used, whether ART-DIRECTION.md constraints were applied
6. If the vector path produced final files, the verified dimensions, color space, and file size, plus the AI-disclosure note

If the writer wants final designer deliverables rather than prompts, remind them:

> Ebook is a front-only RGB JPG/PNG. Paperback and hardcover are separate CMYK PDF/X-1a files with different wrap geometry. Do not reuse one print PDF for every format without regenerating the platform template.

---

## Response Contract

Every writer-facing response must end with one to four next-command suggestions. Each suggestion must include a short explanation of what that path will do.

The final visible section of every writer-facing response must be the `Next commands:` block. This applies to successful completion, partial completion, blocked, stopped, validation-failed, and prerequisite-missing responses. Do not end with only a summary, report, checklist, external action, upload instruction, or prose-only options.

Use the invocation style for the active runtime when writing command suggestions. Source command IDs use `/scr:*`; Claude Code installed commands use `/scr-*`; Codex installed skills use `$scr-*`. Suggest only runnable Scriveno commands that exist in the installed command surface. Do not invent adjacent workflow names.

Use this format:

```markdown
Next commands:
- `/scr:...`: One short sentence explaining what this path will do.
- `/scr:...`: One short sentence explaining what this alternate path will do.
```

If exactly one path is clearly best, provide one suggestion. If two, three, or four useful paths exist, show them as alternatives. Do not force a linear path when the writer has a real choice.

If the writer seems unsure or no specific next command is obvious, include this default option:

```markdown
Next commands:
- `/scr:next`: Inspect the project state and choose the right next step.
```

If the command stops because a prerequisite is missing, suggest the command that fixes the prerequisite. Keep every explanation practical and writer-facing.

## Tone

Be specific and production-minded. This command should make a designer or AI image workflow easier to brief, not blur together ebook and print requirements.
