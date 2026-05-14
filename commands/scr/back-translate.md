---
description: Translate the translation back to source language and show side-by-side comparison with drift annotations.
argument-hint: "<language> [--unit <unit>] [--report]"
---

# /scr:back-translate -- Back-Translation Verification

Translate the translation back to the source language and show a side-by-side comparison with drift annotations highlighting meaning changes. This is the primary quality verification tool for translations per D-03.

## Usage

```
/scr:back-translate <language> [--unit <unit>] [--report]
```

- `<language>` -- Target language code to verify (e.g., `fr`, `de`, `ja`, `ar`)
- `--unit <unit>` -- Scope to a specific translated unit instead of all units
- `--report` -- Generate a standalone back-translation report file

## Instruction

You are a **translation verification specialist**. Your job is to perform back-translation -- translating the translated text back to the source language -- and then compare it with the original to detect meaning drift. This is a standard quality assurance technique in professional translation.

The back-translation is performed by you (the AI agent) in-context. No external translation API is needed for this step -- you read the translated text and produce a faithful back-translation in the source language.

---

### STEP 1: LOAD CONTEXT

1. Load `.manuscript/config.json` for `source_language`
2. Load Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) -- check prerequisites: `back-translate` requires `translate`
3. Validate the `<language>` argument is in the `target_languages` list. If not:
   > Language "[language]" is not in your target languages. Configured target languages: [list].
4. Check prerequisite: translation exists for this language
   - Verify `.manuscript/translation/{lang}/drafts/` directory exists and contains files
   - If no translation found:
     > No translation found for "[language]". Run `/scr:translate <language>` first.

---

### STEP 2: LOAD SOURCE AND TRANSLATION

For each unit to verify:

1. Load the **original source text** from `.manuscript/drafts/body/{unit}-DRAFT.md`
2. Load the **translated text** from `.manuscript/translation/{lang}/drafts/{unit}-DRAFT.md`
3. If `--unit` is specified, load only that unit pair. Otherwise, load all available unit pairs.

If a source file exists but its translation does not (or vice versa), note the mismatch and skip that unit:
> **Skipped:** Unit "[unit]" -- [source/translation] file missing.

---

### STEP 3: PERFORM BACK-TRANSLATION

For each translated unit:

1. Read the translated text carefully
2. Translate it back to the source language as faithfully as possible
   - Preserve the meaning of the translation, even if it differs from the original
   - Do NOT look at the original while back-translating -- translate what the translated text actually says
   - Use natural phrasing in the source language, not word-for-word rendering
3. Segment both texts into comparable units (paragraphs or meaningful passages)

---

### STEP 4: SIDE-BY-SIDE COMPARISON WITH DRIFT ANNOTATIONS

Present a three-column side-by-side comparison per D-03:

```
## Unit: [unit name]

| # | Original | Translation | Back-Translation | Drift |
|---|----------|-------------|------------------|-------|
| 1 | [original segment] | [translated segment] | [back-translated segment] | [annotation] |
| 2 | [original segment] | [translated segment] | [back-translated segment] | [annotation] |
```

**Drift annotation markers:**

| Marker | Meaning | When to Apply |
|--------|---------|---------------|
| **[OK]** | Meaning preserved | Back-translation conveys the same meaning as the original, even if wording differs |
| **[DRIFT: meaning shift]** | Semantic change | Back-translation differs from original in factual content, intent, or implication |
| **[DRIFT: tone shift]** | Register/emotion changed | Back-translation has different emotional register -- more formal, less urgent, different mood |
| **[DRIFT: omission]** | Content missing | Something present in the original is absent in the back-translation |
| **[DRIFT: addition]** | Content added | Something in the back-translation was not in the original |

**Annotation detail:** For each drift marker, add a brief explanation:
- `[DRIFT: meaning shift] -- "courage" became "recklessness", changing the character's motivation`
- `[DRIFT: tone shift] -- formal register replaced casual dialogue, losing character voice`
- `[DRIFT: omission] -- metaphor about the sea was dropped entirely`
- `[DRIFT: addition] -- explanation added that was not in the original text`

---

### STEP 5: SUMMARY STATISTICS

After all units are compared, present summary statistics:

```
Back-Translation Summary: [Language Name]
==========================================
Units verified: [count]
Total segments: [count]

Drift Analysis:
  [OK] -- meaning preserved: [count] ([percentage]%)
  [DRIFT: meaning shift]:    [count] ([percentage]%)
  [DRIFT: tone shift]:       [count] ([percentage]%)
  [DRIFT: omission]:         [count] ([percentage]%)
  [DRIFT: addition]:         [count] ([percentage]%)

Overall fidelity: [percentage]% of segments preserved meaning
```

**Fidelity assessment:**
- **90%+ OK** -- Excellent translation fidelity. Minor drifts are expected and acceptable.
- **75-89% OK** -- Good fidelity with notable drift areas. Review flagged segments.
- **Below 75% OK** -- Significant drift detected. Consider re-translating problem units with `/scr:translate <language> --unit <unit>`.

---

### STEP 6: REPORT OUTPUT

**If `--report` flag is provided:**
Write the full report to `.manuscript/translation/{lang}/BACK-TRANSLATION-REPORT.md`:

```markdown
# Back-Translation Report: [Language Name]

**Source language:** [source_language]
**Target language:** [language]
**Date:** [current date]
**Units verified:** [count]
**Overall fidelity:** [percentage]%

## Summary Statistics

[Summary table from Step 5]

## Detailed Comparison

[Full side-by-side tables from Step 4, organized by unit]

## Recommendations

[Based on drift patterns, specific recommendations for revision]
```

**Always display** the summary statistics to the writer, even without `--report`.

---

### OUTPUT

Present the summary statistics and top drift issues to the writer. If there are many segments, show only the drift-flagged segments in the terminal output and note that the full comparison is available in the report.

```
Back-translation complete for [Language Name].

Fidelity: [percentage]% ([assessment])
Segments: [OK count] preserved, [drift count] with drift

[If drift found]:
Top drift issues:
  1. [unit]: [DRIFT: type] -- [brief description]
  2. [unit]: [DRIFT: type] -- [brief description]
  3. [unit]: [DRIFT: type] -- [brief description]

[If --report]: Full report saved to .manuscript/translation/{lang}/BACK-TRANSLATION-REPORT.md
[If high drift]: Consider re-translating problem units or reviewing with /scr:cultural-adaptation.
```

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
