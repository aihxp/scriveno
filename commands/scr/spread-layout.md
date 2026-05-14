---
description: Generate children's book page spread layouts with text and illustration zones.
argument-hint: "<spread-number> [--text-ratio <percent>]"
---

# /scr:spread-layout -- Page Spread Layout

Generate children's book / picture book page spread layouts with labeled zones for text placement, illustration direction, and bleed areas using ASCII grid visualization.

## Usage
```
/scr:spread-layout <spread-number> [--text-ratio <percent>]
```

## Instruction

You are generating a page spread layout for a children's book or picture book. Load:
- `.manuscript/config.json` (to get `work_type` -- must be in visual group: childrens_book, picture_book, illustrated_book)
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) (to check `commands.spread-layout.available` -- visual group only)
- `.manuscript/illustrations/ART-DIRECTION.md` if it exists (for visual style consistency)
- `.manuscript/OUTLINE.md` (to get spread content -- for picture books, each spread is an atomic unit)
- Drafted spread content if it exists (the text and scene description for this spread)

**Check availability:**

Look up the current work type's group in CONSTRAINTS.json. If the group is in `commands.spread-layout.hidden` (prose, script, academic, poetry, interactive, speech_song, sacred), inform the writer:

> Spread-layout is designed for children's books and picture books. Your [work_type] project uses different layout tools.

Then **stop**.

---

### Spread Analysis

<spread_analysis>
  Read the content for spread `<spread-number>` from OUTLINE.md and any drafted content.

  Determine:
  - **Text content:** The actual text for this spread (or summary if not yet drafted)
  - **Text length:** Word count to determine text zone size
  - **Illustration subject:** What should be illustrated on this spread
  - **Emotional tone:** How this spread should feel visually
  - **Narrative function:** Is this a quiet moment, action beat, reveal, opening, climax, denouement?
  - **Page turn impact:** What comes before and after -- is this a surprise reveal on page turn?
</spread_analysis>

---

### Layout Generation (D-04 ASCII Grid)

<layout_generation>
  Generate the spread layout using ASCII grid per D-04, showing both pages of the two-page spread with labeled zones.

  **Standard picture book dimensions:**
  - Single page: 10" x 8" (landscape) or 8.5" x 11" (portrait)
  - Full spread: 20" x 8" (landscape) or 17" x 11" (portrait)
  - Use dimensions from config.json `trim_size` if set, otherwise default to 10" x 8" landscape

  **Text-to-illustration ratio:**
  - Default: 30% text / 70% illustration for picture books
  - Override with `--text-ratio <percent>` (e.g., `--text-ratio 40` for 40% text / 60% illustration)
  - Text-heavy spreads (> 50%) are unusual -- warn if requested

  **Zone Labels:**
  - `[TEXT]` -- Where text is placed, with actual text excerpt
  - `[ILLUSTRATION]` -- Illustration zone with scene description
  - `[BLEED]` -- Areas extending beyond trim for full-bleed printing
  - `[GUTTER]` -- Center binding area (wider inner margin, typically 0.5"-0.75")
  - `[SAFE]` -- Safe area for critical content (0.25" from trim)

  **Output Format:**

  ```markdown
  # Spread [N] Layout

  **Title/Caption:** "[spread title or key text excerpt]"
  **Text ratio:** [N]% text / [N]% illustration
  **Page dimensions:** [width]" x [height]" per page ([total width]" x [height]" spread)

  ## Layout Grid

  SPREAD [N] -- "[short description]"
  +--------------------+--+--------------------+
  |                    |  |                    |
  |  [ILLUSTRATION]    |G |  [ILLUSTRATION]    |
  |                    |U |                    |
  |  [scene desc]      |T |                    |
  |                    |T |--------------------+
  |                    |E |                    |
  |  [BLEED -->]       |R |  [TEXT]            |
  |                    |  |  "Actual text      |
  |                    |  |   from the spread  |
  |                    |  |   goes here..."    |
  +--------------------+--+--------------------+
         LEFT PAGE              RIGHT PAGE

  ## Left Page
  - **Zone:** [Full bleed illustration | Partial illustration | Text + illustration]
  - **Illustration direction:** [What to depict -- characters, setting, action]
  - **Bleed:** [Which edges bleed -- top, bottom, left, or all]
  - **Key focal point:** [Where the eye should go]

  ## Right Page
  - **Zone:** [Breakdown of text vs illustration areas]
  - **Text placement:** [Top, bottom, center, wrapped around illustration]
  - **Text content:** [The actual text or excerpt for this page]
  - **Illustration direction:** [What to depict in remaining space]

  ## Typography Notes
  - **Font size suggestion:** [based on target age group -- larger for younger readers]
  - **Text alignment:** [left, centered, ragged right]
  - **Text background:** [transparent over illustration | solid panel | semi-transparent overlay]

  ## Production Notes
  - **Gutter safety:** Keep critical text/image content 0.5" from center binding
  - **Bleed extension:** Extend bleed illustrations 0.125" beyond trim on all bleed edges
  - **Safe area:** Keep essential text 0.25" inside trim on all edges
  - **Color notes:** [From ART-DIRECTION.md -- dominant colors for this spread]
  ```

  **Layout Variations by Narrative Function:**

  - **Opening spread:** Full bleed illustration across both pages, minimal text (title or opening line)
  - **Action spread:** Dynamic composition, illustration dominates, text integrated into scene
  - **Quiet moment:** More text space, illustration as vignette or partial page
  - **Climax/reveal:** Full bleed illustration, text minimal or absent (let the art speak)
  - **Denouement:** Balanced text and illustration, calming composition
  - **Final spread:** Can mirror opening spread structure for satisfying bookend

  Adapt the grid layout to match the narrative function of this particular spread.
</layout_generation>

---

### Output

Create the output directory if needed:
```bash
mkdir -p .manuscript/illustrations/spreads/
```

Save to `.manuscript/illustrations/spreads/spread-{number}-layout.md`

Commit: `illustration: generate spread layout for spread {number}`

After saving, tell the writer:
> Spread layout saved to `.manuscript/illustrations/spreads/spread-{number}-layout.md`.
>
> The layout shows [TEXT] and [ILLUSTRATION] zones with bleed areas marked.
> Share this with your illustrator or use as reference for AI image generation.
>
> Adjacent spreads: `/scr:spread-layout {prev}` | `/scr:spread-layout {next}`

---

### Edge Cases

- **Spread not in outline:** "Spread {number} is not in your outline. Your book has {N} spreads. Check `/scr:progress` for the outline structure."
- **No drafted content:** Generate layout from OUTLINE.md beat description. Note: "Layout based on outline. Draft the spread text for more precise text zone sizing."
- **Text too long for ratio:** Warn and suggest either splitting across two spreads or increasing text ratio: "The text for this spread is {N} words, which may be too long for {ratio}% text area. Consider splitting into two spreads or using `--text-ratio {suggested}`."
- **Full-bleed no-text spread:** Valid for climactic moments. Generate illustration-only spread with no text zone.
- **ART-DIRECTION.md missing:** Generate layout without color/style notes. Suggest: "Run `/scr:art-direction` for visual consistency guidance."
- **Non-picture-book work type:** Hard stop per CONSTRAINTS.json availability check.

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
