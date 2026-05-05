---
description: Chain line-edit, copy-edit, and voice-check for comprehensive prose polish.
---

# /scr:polish -- Comprehensive Prose Polish

Run line-edit, copy-edit, and voice-check in sequence. Accumulates all findings into a single report.

## Usage
```
/scr:polish [N]
```

If `N` is provided, polishes only that unit. Otherwise polishes all drafted units.

## Instruction

You are a comprehensive prose editor running a three-pass pipeline. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) (to check command adaptations)
- `.manuscript/STYLE-GUIDE.md` (required for Pass 3 -- voice-check)
- `.manuscript/WRITING-RULES.md` if present (otherwise `templates/WRITING-RULES.md`) -- universal AI-tell rulebook used by Pass 1 cliche detection and Pass 3 voice drift
- Pitfall pack if present, keyed off `config.json`'s `work_type`. Resolution order: `.manuscript/PITFALLS.md`, else `templates/pitfalls/<work_type>.md`. Used by Pass 1 to flag type-specific cliches.
- Drafted prose from `.manuscript/drafts/body/`

**Execute ALL three passes regardless of findings in each. Do not stop after Pass 1 to ask if you should continue. Accumulate all findings across all three passes.**

---

### PASS 1: Line Edit

Sentence-level refinement. For each passage, identify issues in these categories:

<line_edit_categories>
  <category name="rhythm">
    Sentence length variation, cadence, paragraph flow.
    Flag monotonous stretches where sentence length never varies.
  </category>
  <category name="word_choice">
    Weak verbs (was, had, seemed), imprecise nouns, register mismatches.
    Suggest stronger alternatives.
  </category>
  <category name="redundancy">
    Repeated information, unnecessary modifiers, filler phrases.
    "She nodded her head" -> "She nodded."
  </category>
  <category name="cliches">
    Dead metaphors, overused phrases, type-specific stock phrases.
    If a pitfall pack was loaded for this work_type, use its "Stock phrases" /
    "Genre stock devices" subsections as the canonical list. Fall back to
    WRITING-RULES.md "Generic metaphors and dead figures" if no pack exists.
    "Her heart raced" -> suggest something voice-specific.
  </category>
</line_edit_categories>

For each issue: show original text, suggested replacement, category, and brief rationale.

---

### PASS 2: Copy Edit

Correctness and consistency pass:

<copy_edit_categories>
  <category name="grammar">
    Subject-verb agreement, tense consistency, pronoun reference clarity,
    dangling modifiers, sentence fragments (unless intentional style).
  </category>
  <category name="spelling">
    Misspellings, homophone errors (their/there/they're, affect/effect),
    inconsistent spellings of character or place names.
  </category>
  <category name="punctuation">
    Missing or misused commas, semicolons, em dashes, quotation marks.
    Dialogue punctuation (comma before tag, period before action beat).
  </category>
  <category name="consistency">
    Number formatting (spelled out vs. digits), capitalization rules,
    hyphenation patterns, serial comma usage -- flag inconsistencies,
    don't impose a preference.
  </category>
</copy_edit_categories>

---

### PASS 3: Voice Check

Compare prose against STYLE-GUIDE.md across voice dimensions:
- Sentence rhythm and length patterns
- Vocabulary level and register
- Figurative language style
- Dialogue voice distinctiveness
- Narrative distance and POV consistency
- Tone and emotional register

Flag passages where the voice drifts from the established profile. Score voice fidelity 0-100 with thresholds: 80+ PASS, 60-79 WARNING, below 60 FAIL.

**If STYLE-GUIDE.md is missing:** Run Passes 1 and 2 as normal but skip Pass 3 with this note: "Pass 3 (Voice Check) skipped -- no STYLE-GUIDE.md found. Run `/scr:profile-writer` first for the full polish experience."

---

### COMBINED REPORT

Merge all findings into a single report with these sections:

1. **Pass 1: Line Edit Findings** -- grouped by category with severity
2. **Pass 2: Copy Edit Findings** -- grouped by category with severity
3. **Pass 3: Voice Check Results** -- voice fidelity score and drift passages (or skip note)
4. **Overall Assessment** -- brief summary of prose quality across all three dimensions
5. **Priority Ranking** -- what to fix first, ordered by impact on reader experience
6. **Quick Wins vs. Structural Issues** -- separate easy fixes (typos, missing commas) from deeper revisions (voice drift, rhythm problems)

Save to `.manuscript/{scope}-POLISH-REPORT.md`
