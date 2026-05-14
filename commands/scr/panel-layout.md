---
description: Generate comic panel layouts with composition notes and balloon placement.
argument-hint: "<page-number> [--panels <count>] [--style <style>]"
---

# /scr:panel-layout -- Comic Panel Layout

Generate comic and graphic novel panel layouts with ASCII grid visualization, composition notes, gutter specifications, and dialogue balloon/caption placement zones.

## Usage
```
/scr:panel-layout <page-number> [--panels <count>] [--style <style>]
```

## Instruction

You are generating a comic panel layout. Load:
- `.manuscript/config.json` (to get `work_type` -- must be comic or graphic_novel per comic_only constraint)
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) (to check `commands.panel-layout.available` and `constraint: comic_only`)
- `.manuscript/illustrations/ART-DIRECTION.md` if it exists (for visual style consistency)
- `.manuscript/OUTLINE.md` (to get page content / beat assignments)
- Drafted page content if it exists

**Check availability:**

Look up the current work type's group in CONSTRAINTS.json. This command has a `comic_only` constraint -- only available for comic and graphic_novel work types within the visual group.

If the work type is not comic or graphic_novel:

> Panel-layout is designed for comics and graphic novels only. Your [work_type] project uses different layout tools.
> Try `/scr:spread-layout` for picture books or `/scr:illustrate-scene` for scene illustrations.

Then **stop**.

---

### Page Content Analysis

<page_analysis>
  Read the content assigned to page `<page-number>` from OUTLINE.md and any drafted content.

  Determine:
  - **Number of beats/moments:** How many distinct visual moments need panels
  - **Dialogue density:** How much dialogue appears (affects balloon placement)
  - **Action level:** Is this a dialogue scene, action sequence, or atmospheric page
  - **Pacing intent:** Fast (many small panels, quick cuts) or slow (fewer large panels, lingering)
  - **Key visual moment:** Which panel is the "money shot" -- the one that should be largest
</page_analysis>

---

### Panel Layout Generation

<panel_generation>
  **Panel Count:**
  - Default: 6 panels per page (classic grid)
  - Override with `--panels <count>` (range: 1-9)
  - 1 panel = splash page (full page single image)
  - 2-3 panels = cinematic, slow pacing
  - 4-6 panels = standard storytelling
  - 7-9 panels = fast pacing, montage, rapid action

  **Panel Sizes:**
  - `SPLASH` -- Full page, single image (1 panel)
  - `HALF-PAGE` -- Takes up half the page height or width
  - `QUARTER` -- Standard quarter-page panel
  - `STRIP` -- Full width, reduced height (widescreen cinematic)
  - `INSET` -- Small panel overlapping a larger one
  - `BLEED` -- Panel extends to page edge (no border on bleed sides)

  **Gutter Width:**
  - Standard: 0.125" (1/8 inch) between panels
  - Wide gutter: 0.25" for scene/time transitions within page
  - No gutter: Panels share border for rapid action

  **Style Presets** (via `--style`):
  - `traditional-grid` (default) -- Even, rectangular panels in a grid. Classic Western comics.
  - `dynamic` -- Varied panel sizes, diagonal borders, overlapping panels. Action-oriented.
  - `manga` -- Right-to-left reading order, speed lines, varied panel shapes, emphasis on expression.
  - `european` -- Larger panels, more detail, tier-based layout (horizontal strips). Franco-Belgian tradition.
  - `splash-heavy` -- One dominant splash panel with smaller supporting panels. Impact-driven.

  **ASCII Panel Layout Format:**

  ```markdown
  # Page [N] Panel Layout

  **Style:** [preset name]
  **Panels:** [count]
  **Page dimensions:** [standard comic: 6.625" x 10.25" | manga: 5" x 7.5" | european: 8.5" x 11"]
  **Gutter:** [width]

  ## Layout Grid

  PAGE [N]
  +-------------------------------+
  |           PANEL 1             |  [Shot type] - [composition note]
  |         (half-page)           |  [Content description]
  |                               |  [BALLOON: top-right]
  +---------------+---------------+
  |    PANEL 2    |    PANEL 3    |  P2: [shot] - [note]
  |               |               |  P3: [shot] - [note]
  |  [BALLOON:    |               |  P2: [BALLOON: bottom-left]
  |   bottom]     |  [CAPTION:    |  P3: [CAPTION: top]
  |               |   top]        |
  +---------------+---------------+
  |    PANEL 4    |    PANEL 5    |  P4: [shot] - [note]
  |               |               |  P5: [shot] - [note]
  +---------------+---------------+

  ## Panel Details

  ### Panel 1 (half-page, top)
  - **Content:** [Characters, action, dialogue -- what happens in this panel]
  - **Composition:** [Angle: eye-level/low/high/Dutch. Depth: shallow/deep. Focus: foreground/mid/background]
  - **Balloons/Captions:**
    - [SPEECH BALLOON] top-right: "[dialogue excerpt]"
    - [THOUGHT BUBBLE] center: "[thought]"
    - [CAPTION BOX] top-left: "[narration]"
  - **SFX:** [Sound effects text and placement, if any]
  - **Notes:** [Special rendering notes -- motion lines, focus blur, etc.]

  ### Panel 2 (quarter, middle-left)
  ...

  ### Panel 3 (quarter, middle-right)
  ...
  ```

  **Balloon/Caption Placement Zones:**
  Mark placement zones in the ASCII grid and detail in panel descriptions:
  - `[BALLOON: position]` -- Speech balloon (tail points to speaker)
  - `[THOUGHT: position]` -- Thought bubble (cloud border)
  - `[CAPTION: position]` -- Narration caption box (rectangular, usually top or bottom)
  - `[SFX: position]` -- Sound effect text (integrated into art)
  - Positions: top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right

  **Reading Order:**
  - Western (default): Left-to-right, top-to-bottom (Z-pattern)
  - Manga (`--style manga`): Right-to-left, top-to-bottom
  - Mark reading order with numbered arrows if layout is non-standard

  **Composition Notes per Panel:**
  Include for each panel:
  - Camera angle (eye-level, low angle, high angle, Dutch angle, bird's-eye, worm's-eye)
  - Depth (foreground/midground/background elements)
  - Focus (what draws the eye, depth of field)
  - Character staging (positions, poses, expressions)
</panel_generation>

---

### Page Pacing Context

<pacing_context>
  Include a brief pacing analysis at the end:

  ```markdown
  ## Pacing Analysis

  - **Page rhythm:** [fast/medium/slow -- based on panel count and sizes]
  - **Visual beats:** [N action beats, N dialogue beats, N transition beats]
  - **Previous page ended:** [description -- for flow continuity]
  - **Next page should:** [suggested opening -- match or contrast current page energy]
  - **Page turn reveal:** [Is this a left (verso) or right (recto) page? Right pages are reveals on page turn.]
  ```
</pacing_context>

---

### Output

Create the output directory if needed:
```bash
mkdir -p .manuscript/illustrations/panels/
```

Save to `.manuscript/illustrations/panels/page-{number}-layout.md`

Commit: `illustration: generate panel layout for page {number}`

After saving, tell the writer:
> Panel layout saved to `.manuscript/illustrations/panels/page-{number}-layout.md`.
>
> Layout uses [style] style with [N] panels and [gutter width] gutters.
> Share with your artist or use as reference for panel composition.
>
> Adjacent pages: `/scr:panel-layout {prev}` | `/scr:panel-layout {next}`
> Change panel count: `/scr:panel-layout {number} --panels 4`
> Try a different style: `/scr:panel-layout {number} --style dynamic`

---

### Edge Cases

- **Non-comic work type:** Hard stop per comic_only constraint in CONSTRAINTS.json
- **Page not in outline:** "Page {number} is not in your outline. Your comic has {N} pages planned. Check `/scr:progress` for the outline structure."
- **Splash page request (--panels 1):** Generate single full-page panel with detailed composition. Confirm: "Splash page -- this panel carries the full page weight. Make it count."
- **9+ panels requested:** Warn about readability: "9 panels per page is the practical maximum. Beyond that, panels become too small for detail. Consider splitting across pages."
- **No drafted content:** Generate layout from OUTLINE.md beats. Note reduced dialogue/balloon detail.
- **ART-DIRECTION.md missing:** Generate layout without style notes. Suggest running art-direction first.
- **Manga style:** Automatically switch reading order to right-to-left and adjust page dimensions to manga standard (5" x 7.5").

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
