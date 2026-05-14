---
description: Spawn parallel analysis agents to understand an existing manuscript's voice, structure, characters, and themes.
---

# /scr:map-manuscript -- Analyze Existing Manuscript

Spawn parallel analysis agents to understand an existing draft's voice, structure, characters, and themes.

## Usage
```
/scr:map-manuscript [area]
```

**Areas (optional):** `voice`, `structure`, `characters`, `themes`, `world`, `pacing` -- analyze specific area only. Omit to analyze all.

## Instruction

This command is for writers who already have a draft (partial or complete). It analyzes what exists so that `/scr:new-work` or `/scr:new-revision` can build on established patterns rather than starting from scratch.

Spawn 6 parallel analysis agents:

<analysis_agents>
  <agent name="voice-analyst">
    <task>
      Analyze the manuscript's prose style:
      - POV and tense (consistent? shifts?)
      - Sentence length distribution (short/long ratio, rhythm patterns)
      - Vocabulary range (simple/complex, domain-specific, archaic/modern)
      - Narrative distance (close/far, shifts)
      - Metaphor and imagery density
      - Dialogue attribution style
      - Paragraph length patterns
      - Chapter/section opening and closing patterns
    </task>
    <output>VOICE-ANALYSIS.md -- style guide derived from existing prose</output>
  </agent>

  <agent name="structure-analyst">
    <task>
      Map the manuscript's architecture:
      - Chapter/section breakdown with word counts
      - Scene structure within chapters
      - Pacing graph (tension curve across the manuscript)
      - Act structure (even if not explicitly marked)
      - Timeline mapping (chronological vs. narrative order)
      - Subplot tracking
    </task>
    <output>STRUCTURE-ANALYSIS.md -- architectural map</output>
  </agent>

  <agent name="character-analyst">
    <task>
      Catalog all characters:
      - Named characters with first appearance, role, physical description
      - Dialogue voice profiles per character
      - Relationship map based on interactions
      - Character arc trajectory (where each character starts, where they are now)
      - POV distribution (who narrates what)
    </task>
    <output>CHARACTER-ANALYSIS.md -- character profiles derived from text</output>
  </agent>

  <agent name="theme-analyst">
    <task>
      Identify thematic patterns:
      - Recurring motifs and symbols
      - Thematic threads across chapters
      - Central questions the work seems to explore
      - Emotional through-lines
      - Imagery clusters
    </task>
    <output>THEME-ANALYSIS.md -- thematic map</output>
  </agent>

  <agent name="world-analyst">
    <task>
      Extract world-building details:
      - Settings and locations mentioned
      - Rules of the world (physics, magic, society, technology)
      - Cultural norms established
      - Historical references
      - Geography and spatial relationships
    </task>
    <output>WORLD-ANALYSIS.md -- world-building bible from existing text</output>
  </agent>

  <agent name="pacing-analyst">
    <task>
      Analyze narrative rhythm:
      - Scene length distribution
      - Action vs. reflection ratio
      - Dialogue vs. narration ratio per chapter
      - Tension peaks and valleys
      - Dead spots (low tension + low character development)
      - Cliffhanger frequency
    </task>
    <output>PACING-ANALYSIS.md -- rhythm analysis with recommendations</output>
  </agent>
</analysis_agents>

### OUTPUT

Save all analysis files to `.manuscript/analysis/`

Present a summary to the writer showing:
- Key findings from each area
- Strengths identified
- Potential issues flagged
- How this analysis will inform future commands

This analysis is automatically loaded by `/scr:new-work` and `/scr:new-revision` when it exists.

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
