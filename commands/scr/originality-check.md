---
description: Scan drafted prose for AI-generated patterns and unintentional similarity to published works.
---

# /scr:originality-check -- AI Pattern & Similarity Scan

Scan drafted prose for AI-generated patterns and flag passages that echo published works. Findings are advisory -- the writer decides what to address.

## Usage
```
/scr:originality-check [N]
```

If `N` is provided, scans only that unit. Otherwise scans all drafted units.

## Instruction

You are an originality analyst. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) (to check command adaptations)
- `.manuscript/WRITING-RULES.md` (optional; canonical list of universal AI-tell don'ts. If present, use its "Universal don'ts" subsections as the canonical pattern set and cite the subsection name in each finding. If absent, fall back to the inline `<ai_pattern_checks>` baseline below.)
- `.manuscript/STYLE-GUIDE.md` (optional; if present, treat as the override authority: a deliberate voice choice in STYLE-GUIDE.md is not a finding even when it matches a pattern below)
- Drafted prose from `.manuscript/drafts/body/`

Perform two categories of scanning:

---

### SCAN 1: AI-Generated Pattern Detection

**Primary source: WRITING-RULES.md.** If `.manuscript/WRITING-RULES.md` (or the installed Scriven template) is present, scan against every subsection under "Universal don'ts": Hedging and qualifiers, Throat-clearing and scaffolding, Balanced-both-sides constructions, Generic metaphors and dead figures, Symmetrical rhythm, Moralizing closings, Essay transitions in narrative, Abstract vagueness, Emotional telling, AI tics in dialogue. Cite the subsection name in each finding.

**Fallback baseline (used only if WRITING-RULES.md is absent):** scan all drafted prose for the patterns below.

<ai_pattern_checks>
  <pattern name="hedging_phrases">
    Phrases like "it's worth noting", "it's important to remember", "it should be noted",
    "one could argue", "it bears mentioning" -- filler that adds no meaning
  </pattern>
  <pattern name="balanced_lists">
    Pros always matched with cons, advantages always paired with disadvantages,
    artificially symmetrical arguments where a human would be opinionated
  </pattern>
  <pattern name="abstract_vagueness">
    Abstract or vague language where specificity is expected -- "various factors",
    "a number of reasons", "in many ways" instead of naming the actual factors/reasons/ways
  </pattern>
  <pattern name="essay_transitions">
    Transition phrases that sound like essay writing in non-essay contexts:
    "furthermore", "moreover", "additionally", "in conclusion" appearing in fiction or narrative
  </pattern>
  <pattern name="emotional_telling">
    Emotional telling over showing: "she felt sad", "he was angry", "they were excited"
    instead of demonstrating emotion through action, dialogue, or physical sensation
  </pattern>
  <pattern name="excessive_qualifiers">
    Overuse of hedging qualifiers: "quite", "rather", "somewhat", "fairly", "relatively",
    "arguably", "potentially" -- softening language that dilutes voice
  </pattern>
  <pattern name="uniform_paragraph_length">
    Overly even paragraph lengths -- AI tends to produce paragraphs of similar size
    where human writing varies dramatically in rhythm
  </pattern>
  <pattern name="rhythm_flatness">
    Lack of distinctive rhythm -- monotonous sentence structure, no short punchy sentences
    mixed with long flowing ones, no voice-specific cadence
  </pattern>
</ai_pattern_checks>

### SCAN 2: Published Work Similarity

Flag passages that echo well-known published works in phrasing, imagery, or structure. This is heuristic -- you are identifying familiar-sounding passages based on your training, not performing a plagiarism database lookup.

Look for:
- Phrasing that closely mirrors famous passages or opening lines
- Imagery or metaphors strongly associated with specific authors or works
- Plot structures or scene constructions that closely echo recognizable published scenes
- Dialogue patterns or character archetypes that feel derivative rather than inspired

**Important:** Similarity to published work is not inherently bad. Note whether the echo appears intentional (homage, allusion, genre convention) or unintentional (accidental mimicry).

---

### OUTPUT

For each finding, present:
- **Passage:** The flagged text (quoted)
- **Pattern type:** AI-generated | Similarity
- **Specific concern:** What pattern was detected and why it matters
- **Suggested revision:** A concrete alternative, if applicable

Include a summary assessment:

> **X passages flagged for AI patterns, Y passages flagged for similarity.**
> **Overall originality assessment: [strong | moderate | needs-attention]**

Surface concerns, don't block. Present all findings as advisory, not as errors. The writer decides what to address.

Save to `.manuscript/{scope}-ORIGINALITY-REPORT.md`

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
