---
description: Generate or refine the visual style bible for illustrations and cover art.
argument-hint: "[--refine]"
---

# /scr:art-direction -- Visual Style Bible

Generate or refine ART-DIRECTION.md, the visual style bible that governs all illustration and cover art for the project.

## Usage
```
/scr:art-direction [--refine]
```

## Instruction

You are creating the project's visual style bible. Load:
- `.manuscript/config.json` (to get `work_type`, `genre`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check `commands.art-direction.available` and `commands.art-direction.hidden`)
- `docs/surface-resolution-protocol.md` (to resolve adapted cast and world surfaces)
- `.manuscript/WORK.md` (genre, premise, tone, setting context)
- The adapted cast surface for canonical `CHARACTERS.md`, when applicable, for physical descriptions
- The adapted world surface for canonical `WORLD.md`, when applicable, for setting descriptions
- `.manuscript/illustrations/ART-DIRECTION.md` if it exists (for refine mode)

**Check availability:**

Look up the current work type's group in CONSTRAINTS.json. If the group is in `commands.art-direction.hidden`, inform the writer:

> Art direction is not available for [work_type] projects.

Then **stop**.

---

### INITIAL MODE (no existing ART-DIRECTION.md)

<art_direction_initial>
  No visual style bible exists yet. Ask 3-4 seed questions to establish the visual identity:

  1. **Art style:** "What visual style do you envision? (realistic, stylized, watercolor, ink, digital painting, minimalist, comic/graphic, mixed media, or describe your own)"

  2. **Mood and tone:** "What's the visual mood? (warm and inviting, dark and atmospheric, bright and energetic, muted and contemplative, high-contrast dramatic, dreamy and ethereal)"

  3. **Color preferences:** "Do you have any color preferences or palette direction? (warm earth tones, cool blues/grays, vibrant saturated colors, monochromatic, specific colors that represent the story)"

  4. **Reference art or artists:** "Are there any artists, art styles, book covers, or visual references that capture the feel you want? (e.g., 'Moebius-style linework', 'Studio Ghibli palette', 'Edward Hopper lighting', or 'no specific reference')"

  Wait for answers. Do not proceed until the writer responds.

  After receiving answers, generate `.manuscript/illustrations/ART-DIRECTION.md` with the following sections:

  ```markdown
  # ART-DIRECTION

  Visual style bible for [title from config.json].

  ## Visual Style

  [Art style direction based on seed answers. Describe the overall aesthetic: realistic, stylized, watercolor, ink, digital, etc. Include rendering approach, level of detail, and artistic intent.]

  ## Color Palette

  [Mood-based, season-based, or character-coded palettes with hex values.]

  | Role | Color | Hex | Usage |
  |------|-------|-----|-------|
  | Primary | [color] | #XXXXXX | [main scenes, dominant mood] |
  | Secondary | [color] | #XXXXXX | [supporting elements] |
  | Accent | [color] | #XXXXXX | [highlights, focal points] |
  | Shadow | [color] | #XXXXXX | [dark areas, contrast] |
  | Highlight | [color] | #XXXXXX | [light sources, emphasis] |

  ### Mood-Based Palette Variations
  - **Tension/Conflict:** [palette shift]
  - **Peace/Resolution:** [palette shift]
  - **Mystery/Unknown:** [palette shift]

  ## Composition Preferences

  [Composition approach: dynamic, static, symmetrical, rule-of-thirds, golden ratio, diagonal, etc. Include framing preferences, depth of field approach, and perspective choices.]

  - **Default framing:** [e.g., rule-of-thirds with subject off-center]
  - **Action scenes:** [e.g., dynamic diagonals, motion blur]
  - **Quiet moments:** [e.g., centered, symmetrical, breathing room]
  - **Perspective:** [e.g., eye-level for intimacy, bird's-eye for scope]

  ## Reference Artists / Styles

  [Suggested reference artists matching the genre/mood from the writer's input and the work's tone.]

  | Artist / Style | What to Reference | What to Avoid |
  |----------------|-------------------|---------------|
  | [artist/style] | [specific quality] | [specific quality] |

  ## Per-Character Visual Specs

  [Pulled from CHARACTERS.md / FIGURES.md. For each major character:]

  ### [Character Name]
  - **Appearance:** [physical description from character file]
  - **Clothing/Style:** [wardrobe, accessories, signature items]
  - **Expressions:** [default expression, emotional range to depict]
  - **Color association:** [character-specific color from palette]
  - **Visual motifs:** [recurring visual elements tied to this character]

  ## Per-Setting Visual Specs

  [Pulled from WORLD.md / COSMOLOGY.md if available. For each key setting:]

  ### [Setting Name]
  - **Lighting:** [natural, artificial, time of day, quality of light]
  - **Atmosphere:** [clear, hazy, foggy, dust-filled, rain-soaked]
  - **Key details:** [architectural style, vegetation, textures, materials]
  - **Color temperature:** [warm, cool, neutral, mixed]
  - **Mood:** [how this place should feel visually]

  ## Consistency Rules

  - **Object proportions:** [scale relationships, character heights relative to environment]
  - **Recurring visual motifs:** [symbols, patterns, objects that appear across illustrations]
  - **Typography style:** [if text appears in illustrations -- font family, weight, style]
  - **Border/frame treatment:** [if illustrations use borders, vignettes, or full-bleed]
  - **Negative space:** [approach to empty space in compositions]
  ```

  Populate each section using:
  - Seed question answers for style, mood, color, and references
  - CHARACTERS.md / FIGURES.md for per-character visual specs (physical descriptions, clothing, mannerisms)
  - WORLD.md / COSMOLOGY.md for per-setting visual specs (locations, atmosphere, lighting)
  - WORK.md genre and tone for overall aesthetic direction
  - config.json work_type for genre-appropriate defaults

  If CHARACTERS.md/FIGURES.md is empty or missing, include the Per-Character section with a note:
  > No characters defined yet. Run `/scr:new-character` to add characters, then re-run `/scr:art-direction --refine` to update visual specs.

  If WORLD.md/COSMOLOGY.md does not exist, include the Per-Setting section with a note:
  > No world document found. Run `/scr:build-world` to create one, then re-run `/scr:art-direction --refine` to update setting specs.

  Create the output directory if needed:
  ```bash
  mkdir -p .manuscript/illustrations
  ```

  Save to `.manuscript/illustrations/ART-DIRECTION.md`.

  Commit: `art-direction: create visual style bible`

  After saving, tell the writer:
  > Your visual style bible is ready at `.manuscript/illustrations/ART-DIRECTION.md`. Other illustration commands (`/scr:cover-art`, `/scr:illustrate-scene`, `/scr:character-ref`) will reference this for visual consistency.
  >
  > To update any section: `/scr:art-direction --refine`
</art_direction_initial>

---

### REFINE MODE (--refine or ART-DIRECTION.md exists)

<art_direction_refine>
  Load the existing `.manuscript/illustrations/ART-DIRECTION.md`.

  Present a summary of current settings:
  - Visual style
  - Color palette (primary colors)
  - Composition approach
  - Number of characters with visual specs
  - Number of settings with visual specs

  Ask: "What would you like to update? (visual style, color palette, composition, references, character specs, setting specs, consistency rules, or describe what you want to change)"

  After the writer responds:
  1. Update the specified section(s) in ART-DIRECTION.md
  2. Preserve all unchanged sections exactly as they are
  3. If updating character specs, re-read CHARACTERS.md/FIGURES.md for latest data
  4. If updating setting specs, re-read WORLD.md/COSMOLOGY.md for latest data
  5. Save the updated file

  Commit: `art-direction: refine [section updated]`
</art_direction_refine>

---

### Prompt Output Format (D-01)

All visual prompts generated or referenced by this style bible follow the structured format:

- **Subject:** What is depicted (characters, objects, scene)
- **Composition:** Framing, perspective, focal point, negative space
- **Style:** Art style, rendering technique, level of detail
- **Color Palette:** Dominant colors, mood colors, hex references from ART-DIRECTION.md
- **Mood:** Emotional tone, atmosphere, time of day
- **Technical Specs:** Dimensions, DPI, format requirements (when applicable)

This format ensures prompts are copy-pasteable to any AI image generation tool (GPT Image, Stable Diffusion, Midjourney, etc.).

---

### Edge Cases

- **Sacred work type:** Use the adapted cast and world surfaces, such as FIGURES.md and COSMOLOGY.md. Adapt visual language for sacred art traditions (iconographic style, liturgical colors, sacred geometry)
- **Work type hidden:** If work type group is in `commands.art-direction.hidden` (script, academic, poetry, speech_song), explain unavailability and stop
- **No genre in config.json:** Ask the writer about visual mood directly rather than inferring from genre
- **Existing ART-DIRECTION.md without --refine flag:** Detect existing file and enter refine mode automatically (no need to force --refine)

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
