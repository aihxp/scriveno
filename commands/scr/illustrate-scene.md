---
description: Generate a scene-specific illustration prompt with character visuals, setting, and mood.
argument-hint: "<scene-ref> [--style <style>]"
---

# /scr:illustrate-scene -- Scene Illustration Prompt

Generate a detailed, structured illustration prompt for a specific scene, pulling character descriptions, setting details, and mood from the manuscript.

## Usage
```
/scr:illustrate-scene <scene-ref> [--style <style>]
```

## Instruction

You are generating a scene-specific illustration prompt. Load:
- `.manuscript/config.json` (to get `work_type`, `genre`, trim size if set)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check `commands.illustrate-scene.available` and prerequisites)
- `.manuscript/illustrations/ART-DIRECTION.md` (visual style bible -- **required**)
- `.manuscript/OUTLINE.md` (to resolve `<scene-ref>` to a file path)
- The drafted scene file for `<scene-ref>`
- `.manuscript/CHARACTERS.md` or `.manuscript/FIGURES.md` (per `file_adaptations` for sacred work types)

**Check availability:**

Look up the current work type's group in CONSTRAINTS.json. If the group is in `commands.illustrate-scene.hidden` (script, academic, poetry, speech_song), inform the writer:

> Illustrate-scene is not available for [work_type] projects.

Then **stop**.

**Check prerequisites:**

Per CONSTRAINTS.json `prerequisites.illustrate-scene`: requires ART-DIRECTION.md and scene_drafted.

If `.manuscript/illustrations/ART-DIRECTION.md` does not exist:
> Run `/scr:art-direction` first to establish your visual style guide.

Then **stop**.

If the scene referenced by `<scene-ref>` has no draft yet:
> Scene '{ref}' has no draft yet. Draft it first with `/scr:draft {ref}`.

Then **stop**.

---

### Scene Analysis

<scene_analysis>
  Read the drafted scene file and extract:

  **Characters present:**
  Cross-reference with CHARACTERS.md (or FIGURES.md for sacred work types) to pull:
  - Physical appearance (height, build, hair, eyes, distinguishing features)
  - Clothing/style from ART-DIRECTION.md per-character visual specs
  - Expression and posture appropriate to the scene's emotional beat
  - Color associations from ART-DIRECTION.md

  **Setting / Location:**
  - Indoor or outdoor
  - Time of day and lighting conditions
  - Weather and atmosphere (if outdoor)
  - Key objects, furniture, architecture
  - Cross-reference with ART-DIRECTION.md per-setting visual specs if the location is defined there

  **Key action or emotional moment:**
  Identify the single most visually compelling beat in the scene -- the "illustratable moment." This is the focal point of the illustration. Prefer:
  - A moment of high emotion (confrontation, revelation, tenderness)
  - A moment of decisive action (a character making a choice visible in body language)
  - A moment of visual drama (arrival, discovery, transformation)

  **Mood / Atmosphere:**
  - Emotional tone: tension, joy, mystery, sorrow, wonder, dread, intimacy, triumph
  - How this maps to visual treatment: lighting quality, color temperature, depth of field
</scene_analysis>

---

### Prompt Generation (D-01 Structured Format)

<prompt_generation>
  Generate the illustration prompt with the following sections:

  ```markdown
  # Illustration Prompt: [Scene Reference]

  **Scene:** [scene title or reference]
  **Source:** [file path of drafted scene]

  ## Subject

  [The key moment described in detail. Include all characters present with their actions, positions relative to each other, and emotional states. Describe what is happening -- not abstractly, but as a specific frozen moment.]

  ## Composition

  [Suggested framing and visual structure:]
  - **Shot type:** [wide establishing | medium | close-up | extreme close-up | over-the-shoulder | bird's-eye | worm's-eye]
  - **Focal point:** [what the eye should be drawn to first]
  - **Depth:** [foreground, midground, background elements]
  - **Negative space:** [where breathing room exists in the frame]
  - **Eye flow:** [how the viewer's gaze moves through the image]

  ## Style

  [From ART-DIRECTION.md visual style section. Art style, rendering technique, level of detail. If --style flag provided, blend the requested style with the established art direction.]

  ## Color Palette

  [From ART-DIRECTION.md color palette, adjusted for this scene's mood:]
  - **Dominant:** [primary color for this scene and why]
  - **Supporting:** [secondary colors]
  - **Accent:** [highlight/focal point color]
  - **Mood shift:** [how palette differs from default -- darker for tense scenes, warmer for intimate, cooler for melancholy, desaturated for dreamlike]

  ## Mood

  [Derived from scene analysis:]
  - **Emotional tone:** [the feeling this illustration should evoke]
  - **Lighting:** [direction, quality, warmth -- e.g., "low warm side-lighting from a fireplace"]
  - **Atmosphere:** [haze, clarity, rain, dust motes, etc.]
  - **Time of day:** [if relevant to lighting]

  ## Characters

  [For each character present in the scene:]

  ### [Character Name]
  - **Appearance:** [from CHARACTERS.md / FIGURES.md]
  - **Clothing:** [from ART-DIRECTION.md character specs or scene context]
  - **Expression:** [appropriate to this scene's emotional beat]
  - **Posture/Action:** [what they are doing in this moment]
  - **Position:** [where in the frame -- foreground, left, center, background]

  ## Setting Details

  [Location-specific visual elements:]
  - **Environment:** [indoor/outdoor, architecture, landscape]
  - **Key objects:** [props, furniture, natural elements that matter to the scene]
  - **Textures:** [surfaces, materials, fabrics visible]
  - **Background:** [what fills the space beyond the main action]

  ## Technical Specs

  - **Dimensions:** [full page: match trim size at 300 DPI | half page: trim width x half trim height at 300 DPI]
  - **Orientation:** [portrait | landscape]
  - **DPI:** 300
  - **Bleed:** 0.125" on all sides if full-bleed
  - **Safe area:** Keep key elements 0.25" from trim edge
  ```

  If `--style` is provided, note the requested style and blend it with the ART-DIRECTION.md established style, explaining any adjustments.
</prompt_generation>

---

### Output

Create the output directory if needed:
```bash
mkdir -p .manuscript/illustrations/scenes/
```

Save to `.manuscript/illustrations/scenes/{scene-ref}-illustration-prompt.md`

Replace any slashes or spaces in `{scene-ref}` with hyphens for the filename.

Commit: `illustration: generate scene prompt for {scene-ref}`

After saving, tell the writer:
> Illustration prompt saved to `.manuscript/illustrations/scenes/{scene-ref}-illustration-prompt.md`.
>
> Copy this prompt into any AI image tool (GPT Image, Stable Diffusion, Midjourney) or share with an illustrator.
>
> To regenerate with a different style: `/scr:illustrate-scene {ref} --style watercolor`

---

### Edge Cases

- **Sacred work type:** Use FIGURES.md instead of CHARACTERS.md. Adapt visual language for sacred art traditions (iconographic conventions, liturgical colors, sacred geometry motifs)
- **Character not in CHARACTERS.md:** Include what can be inferred from the scene text and note: "Character '{name}' has no entry in CHARACTERS.md. Add one with `/scr:new-character {name}` for richer visual descriptions."
- **No ART-DIRECTION.md:** Hard stop -- prerequisite per CONSTRAINTS.json
- **Scene not drafted:** Hard stop -- prerequisite per CONSTRAINTS.json
- **Multiple illustratable moments:** Pick the single strongest, note alternatives: "Other illustratable moments in this scene: [list]. Re-run with `--moment 2` to target a different beat."
- **Scene with no characters:** Generate environment-only prompt (landscape, interior, establishing shot)
- **Very long scene:** Focus on the climactic beat, not the entire scene

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
