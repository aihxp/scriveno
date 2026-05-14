---
description: Generate world or regional map illustration prompts from WORLD.md geographic content.
argument-hint: "[--region <area>] [--style <style>]"
---

# /scr:map-illustration -- World & Regional Map Illustration

Generate a structured prompt for world maps, regional maps, or location maps based on geographic content from WORLD.md.

## Usage
```
/scr:map-illustration [--region <area>] [--style <style>]
```

**Style options:** `fantasy-parchment`, `satellite-realistic`, `hand-drawn`, `watercolor`, `schematic`, `antique`, `topographic`

## Instruction

You are generating a map illustration prompt from the project's world-building content. Load:
- `.manuscript/config.json` (to get `work_type`, `genre`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check `commands.map-illustration` availability, prerequisites, and `file_adaptations`)
- `ART-DIRECTION.md` from `.manuscript/` if it exists (for style consistency)

### Work Type Availability

Check CONSTRAINTS.json:
- **Available:** prose, visual, interactive, sacred
- **Hidden:** script, academic, poetry, speech_song
- **Requires:** WORLD.md (or adapted equivalent)

If the current work type is hidden, respond:
*"The `map-illustration` command is designed for works with world-building elements. Your {work_type} project doesn't typically include maps."*

### Load World Data

Determine the correct world file from `file_adaptations`:
- Default: `.manuscript/WORLD.md`
- Sacred: `.manuscript/COSMOLOGY.md`
- Academic: `.manuscript/CONTEXT.md` (though academic is hidden)

Load the adapted world file.

If the world file is missing or has no geographic content:
*"No world geography found. Run `/scr:build-world --area geography` first to establish your world's geography, then return here to generate a map prompt."*

### Extract Geographic Content

From WORLD.md (or COSMOLOGY.md), extract:
- **Landmasses:** Continents, islands, peninsulas, major land features
- **Bodies of water:** Oceans, seas, rivers, lakes, bays, straits
- **Terrain:** Mountain ranges, forests, deserts, plains, swamps, tundra
- **Key locations:** Cities, towns, settlements, capitals, landmarks, temples, ruins
- **Political boundaries:** Kingdoms, nations, territories, contested zones (if mentioned)
- **Climate/Biomes:** Tropical, temperate, arctic zones; rainfall patterns
- **Routes:** Trade routes, pilgrim paths, dangerous passages, major roads
- **Scale:** Size of the world (continent-level, region-level, city-level)

If `--region` is specified, focus extraction on that named area and its surroundings. Only include locations and features relevant to that region.

### Determine Default Style

If no `--style` flag is provided, derive from genre:
- **Fantasy/Epic:** `fantasy-parchment` (aged paper, decorative borders, hand-lettered labels, sea monsters)
- **Literary fiction:** `hand-drawn` (clean ink illustration, tasteful minimalism)
- **Sci-fi:** `schematic` (clean lines, grid overlay, coordinate system, technical feel)
- **Historical:** `antique` (period-appropriate cartography style, copper engraving look)
- **Sacred:** `fantasy-parchment` (sacred geography with reverent styling, illuminated manuscript influence)
- **Children's:** `watercolor` (colorful, friendly, playful labels)
- **Default fallback:** `hand-drawn`

### Generate Structured Prompt

Output a structured illustration prompt following the D-01 format:

```markdown
# Map Illustration: {World/Region Name}

## Subject
Map of {world/region name} showing {summary of key geographic features}. {1-2 sentences describing the overall geography -- "A vast continent dominated by a central mountain range running north-to-south, with fertile river valleys to the east and arid badlands to the west."}

## Geographic Features
### Landmasses
{List each with brief visual description}
- {Continent/Island name}: {shape, relative size, notable coastline features}

### Bodies of Water
- {Ocean/Sea/River name}: {location relative to land, character -- calm, treacherous, etc.}

### Terrain
- {Mountain range}: {location, relative height, snow-capped or bare}
- {Forest}: {location, type -- dense old-growth, sparse birch, tropical jungle}
- {Desert/Plains/etc.}: {location, character}

### Key Locations
{Each with position on the map}
- {City/Landmark name}: {location description -- "on the eastern coast where the River Aldren meets the sea"}

## Composition
- **Perspective:** Top-down cartographic view
- **Orientation:** North at top (or specify if world has different convention)
- **Compass rose:** {Placement -- typically upper-right or lower-right corner}
- **Legend/Key:** {Lower-left or lower-right, showing symbols for cities, mountains, forests, roads, borders}
- **Title cartouche:** {Decorative bordered title area -- top center or upper-left, containing map name in period-appropriate lettering}
- **Scale bar:** {Include if the world has established distances}
- **Border:** {Decorative border matching the style -- rope border for nautical, vine border for fantasy, simple line for schematic}

## Style: {selected style name}
{Detailed style description:}

**fantasy-parchment:** Aged parchment texture, hand-drawn terrain icons (tiny mountain triangles, tree clusters for forests), flowing calligraphic labels, decorative sea with wave patterns, possible sea creatures or ships in ocean areas, warm sepia/brown palette.

**satellite-realistic:** Photorealistic satellite view, natural terrain colors, no decorative elements, clean modern labels, elevation shading.

**hand-drawn:** Clean ink illustration on white/cream background, crosshatch shading for terrain, neat hand-lettered labels, minimal decoration.

**watercolor:** Soft painted textures, blended terrain colors, artistic label placement, dreamy quality.

**schematic:** Clean vector-style lines, grid overlay, coordinate markers, technical labels, flat colors for terrain zones.

**antique:** Copper-engraving style, fine crosshatching, ornate cartouche, period lettering, muted earth tones, classical cartographic conventions.

**topographic:** Contour lines showing elevation, color-coded elevation zones, precise terrain representation, modern cartographic style.

## Color Palette
{Terrain-coded colors, adjusted to match ART-DIRECTION.md if it exists}
- **Water:** {Blue tones -- deep navy for oceans, lighter for rivers/lakes}
- **Forests:** {Green tones -- dark for dense, light for sparse}
- **Mountains:** {Brown/gray tones -- darker for high peaks}
- **Desert/Arid:** {Tan/sandy tones}
- **Plains/Grassland:** {Light green or golden}
- **Snow/Ice:** {White/light blue}
- **Cities/Settlements:** {Red or black dots/icons}
- **Roads/Routes:** {Dashed or dotted lines in brown or red}
- **Borders:** {Colored lines or shading for political boundaries}

## Mood
{Derived from genre and tone of the work}
- Fantasy: sense of adventure, vast unexplored territories, wonder
- Literary: understated, serving the story rather than dominating
- Sacred: reverent, cosmic scope, sense of divine order
- Thriller: strategic, tactical, showing contested ground
- Historical: scholarly, authentic, documentary

## Labels
{List of all place names to include on the map, extracted from WORLD.md}
### Major (large, prominent text)
- {Continent/ocean names}

### Medium (clear but secondary)
- {Country/region/sea names}

### Minor (small, detailed)
- {City/town/river/mountain names}

## Technical Specs
- **Dimensions:** Full page -- {trim width} x {trim height} (typically 6" x 9" or matching book trim size)
- **Resolution:** 300 DPI (print-ready)
- **Color space:** CMYK for print, RGB acceptable for ebook-only
- **Format:** High-resolution PNG or TIFF
- **Bleed:** Include 0.125" bleed if map extends to page edges
```

### Save Output

Save the generated prompt to:
- Full world map: `.manuscript/illustrations/maps/world-map-prompt.md`
- Region-specific: `.manuscript/illustrations/maps/region-{name}-map-prompt.md`

Where `{name}` is the lowercase, hyphenated region name.

Create the directory path if it does not exist.

Commit: `illustration: generate {world/region} map illustration prompt`

After saving, suggest:
- "Map prompt saved. Use this with any AI image tool or share with your cartographer/illustrator."
- "For region-specific maps, run `/scr:map-illustration --region {area}` to focus on a particular area."
- "Ensure visual consistency across all illustrations with `/scr:art-direction`."

---

### Edge Cases

- **WORLD.md exists but has no geography section:** Prompt the writer: "Your world document exists but doesn't have geographic details yet. Run `/scr:build-world --area geography` to add terrain, locations, and boundaries."
- **--region specified but not found in WORLD.md:** "Region '{area}' not found in your world document. Available locations: {list extracted locations}. Or describe this region and I'll create the map prompt from your description."
- **Sacred work type (COSMOLOGY.md):** Adapt terminology -- "sacred geography", "celestial realms", "spiritual territories". Map may include cosmological layers (heavens, earth, underworld) rather than purely physical geography. Style should reflect tradition-appropriate cartographic conventions.
- **Very sparse world-building:** Generate the prompt with available content, mark gaps with `{NEEDS DETAIL: add rivers/mountains/etc.}` placeholders, and suggest running `build-world --area geography` to flesh out the world first.
- **ART-DIRECTION.md exists:** Style and color palette sections MUST reference it for consistency; override genre defaults with established art direction.
- **--style and --region both provided:** Apply both -- generate a region-specific map in the specified style.
- **Multiple maps needed:** Suggest generating both a world overview and region-specific maps for key story areas: "Consider generating a world map plus region maps for each major story location."

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
