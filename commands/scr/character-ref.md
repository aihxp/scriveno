---
description: Generate a character visual reference sheet prompt for illustration consistency.
argument-hint: "<name> [--style <style>]"
---

# /scr:character-ref -- Character Visual Reference Sheet

Generate a structured visual reference sheet prompt for a character, suitable for AI image generation or illustrator briefs.

## Usage
```
/scr:character-ref <name> [--style <style>]
```

## Instruction

You are generating a character visual reference sheet prompt. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) (to check `commands.character-ref`, `file_adaptations`, and `adapted`)
- `ART-DIRECTION.md` from `.manuscript/` if it exists (for style consistency)

### Work Type Adaptation

Check CONSTRAINTS.json for work type availability:
- **Available:** prose, script, visual, interactive
- **Sacred:** Adapted to `figure-ref` (rename via `commands.character-ref.adapted.sacred.rename`)
- **Hidden:** academic, poetry, speech_song

If the current work type is hidden, respond:
*"The `character-ref` command is designed for illustrated works. Your {work_type} project uses different visual tools."*

If sacred work type, use "figure-ref" terminology throughout and adapt language accordingly (e.g., "figure reference sheet" not "character reference sheet").

### Load Character Data

Determine the correct characters file from `file_adaptations`:
- Default: `.manuscript/CHARACTERS.md`
- Sacred: `.manuscript/FIGURES.md`
- Academic: `.manuscript/CONCEPTS.md` (though academic is hidden, handle gracefully)

Load the adapted characters file.

Find the character by name (case-insensitive match, same pattern as character-sheet.md):
- If no exact match: check for partial matches and list them
- If no matches at all: "No character named '{name}' found. Run `/scr:cast-list` to see all characters."
- If characters file is empty or missing: "No characters found. Run `/scr:new-character <name>` to create your first character."

### Extract Visual Details

From the character's profile, extract:
- **Physical appearance:** Height, build, skin tone, hair color/style, eye color, age appearance
- **Distinguishing features:** Scars, tattoos, birthmarks, unusual traits, physical quirks
- **Clothing:** Default outfit, armor, uniform, accessories -- whatever is described
- **Props/Items:** Weapons, tools, jewelry, personal items associated with this character
- **Emotional range:** Key emotional states mentioned in the character's psychology section (want, need, fear, arc)
- **Body language:** Physical mannerisms tied to personality (posture, gait, gestures)

### Generate Structured Prompt

Output a structured illustration prompt following the D-01 format:

```markdown
# Character Visual Reference Sheet: {Character Name}

## Subject
{Full physical description in illustrator-ready language. Height, build, coloring, age appearance, distinguishing features. Be specific: "tall and lean, approximately 6'2", with deep brown skin, close-cropped silver hair, and a jagged scar running from left temple to jaw" -- not "a tall man with a scar."}

## Poses
- **Front view:** Full body, neutral standing pose, arms relaxed at sides
- **3/4 view:** Slight turn showing depth and dimension of features
- **Profile view:** Left or right profile highlighting facial structure
- **Action pose:** {Character-appropriate action -- swordfighter in guard stance, scholar leaning over desk, etc.}

## Expressions
{Key emotional states derived from the character's arc and psychology}
- {Expression 1}: {Description of facial expression and body language}
- {Expression 2}: {Description}
- {Expression 3}: {Description}
{Typically 3-5 expressions: the character's default state, their emotional extreme, and states relevant to their arc}

## Clothing & Attire
- **Default outfit:** {Primary clothing described in detail -- fabrics, colors, fit, condition}
- **Alternate outfit:** {If the character has described alternate clothing for different contexts}
- **Accessories:** {Jewelry, belts, pouches, headwear, etc.}

## Props & Items
{Items associated with this character}
- {Item 1}: {Visual description -- material, size, condition, how they carry/hold it}
- {Item 2}: {Description}

## Style
{If ART-DIRECTION.md exists, reference its established visual style. Otherwise, derive from genre:}
- Fantasy: detailed linework, rich color palette, painterly or concept art style
- Literary fiction: realistic, muted palette, photographic reference quality
- Sci-fi: clean lines, high contrast, concept art style
- Children's: warm, rounded forms, bright palette, storybook illustration style
- Sacred: reverent, iconographic traditions appropriate to the tradition
{If --style flag provided, use that style instead}

## Color Palette
- **Skin:** {specific tone}
- **Hair:** {specific color}
- **Eyes:** {specific color}
- **Primary clothing color:** {color}
- **Accent colors:** {secondary colors from outfit/accessories}

## Technical Specs
- **Dimensions:** 2400 x 3200 px (character sheet format)
- **Resolution:** 300 DPI (print-ready)
- **Background:** Neutral gray (#808080) or transparent for compositing
- **Format:** Reference sheet layout with multiple views on single page
```

### Save Output

Save the generated prompt to:
`.manuscript/illustrations/character-refs/{character-name}-ref.md`

Where `{character-name}` is the lowercase, hyphenated version of the character's name (e.g., "Elena Vasquez" becomes "elena-vasquez").

Create the directory path if it does not exist.

Commit: `illustration: generate {character-name} visual reference sheet`

After saving, suggest:
- "Reference sheet prompt saved. Use this with any AI image tool or share with your illustrator."
- "For style consistency across all illustrations, run `/scr:art-direction` first."

---

### Edge Cases

- **Character has minimal physical description:** Generate the prompt with what exists, mark gaps with `{NEEDS DETAIL: describe height/build/etc.}` placeholders, and suggest the writer flesh out the character's appearance in their profile
- **Multiple characters with similar names:** List matches and ask the writer to specify
- **Sacred work type:** Use "figure-ref" command name and terminology; reference sheet language should be respectful and tradition-appropriate (avoid casual phrasing)
- **ART-DIRECTION.md exists:** Style section MUST reference it for consistency; override genre defaults with art direction choices
- **--style flag provided:** Use the specified style, note if it conflicts with ART-DIRECTION.md

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
