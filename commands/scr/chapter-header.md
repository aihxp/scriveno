---
description: Generate decorative chapter header/ornament design prompts.
argument-hint: "[--style <style>] [--chapter <ref>]"
---

# /scr:chapter-header -- Chapter Header & Ornament Design

Generate a structured prompt for decorative chapter openers, ornamental dividers, and header illustrations.

## Usage
```
/scr:chapter-header [--style <style>] [--chapter <ref>]
```

**Style options:** `floral`, `geometric`, `art-deco`, `gothic`, `minimalist`, `ornate`, `hand-drawn`, `woodcut`, `custom`

## Instruction

You are generating a decorative chapter header/ornament design prompt. Load:
- `.manuscript/config.json` (to get `work_type`, `genre`)
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) (to check `commands.chapter-header` availability)
- `ART-DIRECTION.md` from `.manuscript/` if it exists (for style consistency)
- `OUTLINE.md` from `.manuscript/` if `--chapter` flag is provided (to get chapter title/theme)

### Work Type Availability

Check CONSTRAINTS.json:
- **Available:** prose, sacred
- **Hidden:** script, academic, visual, poetry, interactive, speech_song

If the current work type is hidden, respond:
*"The `chapter-header` command is designed for prose books and sacred texts. Your {work_type} project doesn't typically use chapter header ornaments."*

### Determine Default Style

If no `--style` flag is provided, derive the default from genre:
- **Fantasy/Epic:** `ornate` (flowing filigree, mythical creatures, sword-and-shield motifs)
- **Literary fiction:** `minimalist` (thin rules, subtle typography ornaments, small fleurons)
- **Romance:** `floral` (roses, vines, hearts, delicate botanical elements)
- **Thriller/Mystery:** `art-deco` (bold geometric lines, angular patterns)
- **Horror/Gothic:** `gothic` (gargoyles, thorns, dark botanical, skull motifs)
- **Historical:** `woodcut` (period-appropriate woodblock print style)
- **Sacred:** `geometric` (arabesque patterns, mandala elements, sacred geometry, tradition-appropriate motifs)
- **Children's:** `hand-drawn` (whimsical, playful line art)
- **Sci-fi:** `minimalist` (clean lines, circuit-like patterns, futuristic geometry)
- **Default fallback:** `minimalist`

### Chapter-Specific Content

If `--chapter` flag is provided with a chapter reference (number or title):
1. Load OUTLINE.md and find the matching chapter
2. Extract the chapter's title, themes, and key events
3. Incorporate thematic elements into the ornament design:
   - A battle chapter: crossed swords, shields, war imagery woven into the ornament
   - A romance scene: intertwined flowers, hearts, delicate motifs
   - A death/funeral: wilting flowers, hourglasses, somber symbols
   - A journey/travel: compass roses, winding paths, maps
   - A revelation/discovery: opening doors, light rays, keys, eyes
   - A celebration: goblets, laurels, musical instruments, stars

If no `--chapter` flag, generate a generic ornament design suitable for any chapter in this book.

### Generate Structured Prompt

Output a structured illustration prompt following the D-01 format:

```markdown
# Chapter Header Design: {Book Title or "Generic"}

{If chapter-specific: "## For Chapter {ref}: {chapter title}"}

## Subject
{Ornamental design description. Specify motifs, symbols, and decorative elements relevant to the book's genre and theme (or chapter-specific theme if --chapter provided). Example: "An ornate horizontal ornament featuring intertwined oak branches with small acorns, a central medallion containing a compass rose, flanked by symmetrical scrollwork."}

## Composition
- **Format:** Horizontal banner, centered on page
- **Dimensions:** Full text block width (typically 4.25" for a 6x9 trim)
- **Height:** 1-2 inches (proportional to page size)
- **Chapter number/title space:** {Describe where chapter number and title integrate -- centered below the ornament, within a central cartouche, superimposed on the design, etc.}
- **Symmetry:** {Bilateral symmetry for formal styles, asymmetric for hand-drawn/whimsical}

## Style: {selected style name}
{Detailed style description:}
- **Line weight:** {Thin and delicate / Bold and heavy / Variable / etc.}
- **Detail level:** {Intricate with fine details / Clean and simple / Moderately detailed}
- **Character:** {Formal and elegant / Rustic and handcrafted / Playful and whimsical / Solemn and reverent}
{Reference specific artistic traditions or periods if relevant}

## Color Palette
{Many chapter headers are monochrome for practical print reasons}
- **Primary:** {Single color -- black, dark brown, deep blue, etc., or match ART-DIRECTION.md}
- **Approach:** {Monochrome (recommended for cost-effective printing) / Two-color / Full color}
- **If full color:** {List 3-4 colors that match the book's palette from ART-DIRECTION.md}

## Repeating Elements
{If generating headers for multiple chapters, define the consistent elements:}
- **Fixed elements:** {Border style, corner motifs, overall shape -- same every chapter}
- **Variable elements:** {Central motif changes per chapter theme, specific symbols swap in/out}
- **Unity:** All headers should feel like a cohesive set from the same book

## Technical Specs
- **Width:** Match page text block width ({trim_width} minus margins)
- **Height:** 1.0-2.0 inches (250-500 px at 300 DPI)
- **Resolution:** 300 DPI (print-ready)
- **Background:** Transparent (PNG) -- will be placed on book page
- **Format:** PNG with transparency or high-contrast SVG for vector scaling
- **Color space:** Grayscale or CMYK for print (avoid RGB-only colors)
```

### Save Output

Save the generated prompt to:
- Generic: `.manuscript/illustrations/chapter-headers/chapter-header-prompt.md`
- Chapter-specific: `.manuscript/illustrations/chapter-headers/chapter-{ref}-header-prompt.md`

Where `{ref}` is the chapter number or hyphenated title reference.

Create the directory path if it does not exist.

Commit: `illustration: generate chapter header design prompt`

After saving, suggest:
- "Chapter header prompt saved. Use this with any AI image tool or share with your designer."
- "For a cohesive set, generate headers for each chapter with `--chapter` to include thematic elements."
- "Ensure visual consistency with `/scr:art-direction` before generating illustrations."

---

### Edge Cases

- **No OUTLINE.md when --chapter used:** "No outline found. Run `/scr:plan` to create your outline, or describe the chapter theme and I'll design the header around that."
- **Chapter ref not found in outline:** "Chapter {ref} not found in outline. Available chapters: {list}. Or describe the chapter theme directly."
- **Sacred work type:** Adapt ornament suggestions to tradition-appropriate motifs (Islamic: geometric/arabesque, no figurative imagery; Christian: crosses, vine/branch motifs, illuminated manuscript style; Jewish: Star of David, menorah, olive branches; Buddhist: lotus, dharma wheel; generic sacred: sacred geometry, light motifs)
- **--style custom:** Ask the writer to describe their desired ornament style, then build the prompt around their description
- **ART-DIRECTION.md exists:** Style and color sections MUST reference it; override genre defaults with art direction established choices

## Response Contract

Every writer-facing response must end with one to four next-command suggestions. Each suggestion must include a short explanation of what that path will do.

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
