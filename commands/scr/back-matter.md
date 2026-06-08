---
description: Generate publication-ready back matter elements.
argument-hint: "[--level <minimum|balanced|maximum>] [--element <name>]"
---

# /scr:back-matter -- Back Matter Generation

Generate publication-ready back matter elements. Elements are classified as generatable, scaffoldable, or template-based depending on whether AI can produce complete content, a draft for writer revision, or a structural template.

## Usage

```
/scr:back-matter                                      # interactive: skip / minimum / balanced / maximum
/scr:back-matter --level <minimum|balanced|maximum>   # non-interactive
/scr:back-matter --element <name>                     # generate one specific element
```

**Levels:**

| Level | What it generates | When to use |
|-------|-------------------|-------------|
| `minimum` | About the author. (Plus bibliography for academic / sacred work types where it is structurally required.) | Beta-reader handoff, draft sharing. |
| `balanced` | `minimum` + colophon, permissions/credits when applicable. | Default for retail publishing. |
| `maximum` | Every applicable element (the legacy "all 12" behavior, including epilogue, afterword, glossary, suggested reading, index, discussion questions). | Critical editions, scholarly works, anyone who wants the full back-matter menu. |

If neither `--level` nor `--element` is provided, the command prompts the writer first:

> Generate back matter?
>
> 1. **skip** -- I do not want any back matter generated
> 2. **minimum** -- about-the-author (legal floor)
> 3. **balanced** -- minimum + colophon, permissions when applicable
> 4. **maximum** -- every applicable element

If the writer answers **skip**, exit with no files written and no error.

**Elements:**

| # | Element | Flag Name | Type |
|---|---------|-----------|------|
| 1 | Epilogue | `epilogue` | SCAFFOLD |
| 2 | Afterword | `afterword` | SCAFFOLD |
| 3 | Appendix(es) | `appendix` | TEMPLATE |
| 4 | Glossary | `glossary` | GENERATE |
| 5 | Endnotes | `endnotes` | TEMPLATE |
| 6 | Bibliography / References | `bibliography` | TEMPLATE |
| 7 | Suggested Reading | `suggested-reading` | GENERATE |
| 8 | Index | `index` | TEMPLATE |
| 9 | About the Author | `about-author` | GENERATE |
| 10 | Colophon | `colophon` | TEMPLATE |
| 11 | Discussion Questions | `discussion-questions` | GENERATE |
| 12 | Permissions / Credits | `permissions` | TEMPLATE |

If `--element` is provided, generate only that element. Otherwise, generate all elements applicable to the current work type.

## Instruction

You are a **publishing specialist** preparing back matter for a manuscript. Your output must follow industry conventions for element content and formatting.

---

### STEP 0: BOOTSTRAP (context-cost protocol)

Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it as your orientation source for project title, work type, phase, and open items. In STEP 1, skip raw-file loads of `config.json` and `STATE.md` for those fields -- still load `WORK.md`, `CHARACTERS.md`, drafted prose, and `CONSTRAINTS.json` (each holds element-generation data CONTEXT.md does not surface).

If CONTEXT.md is missing, stale, or contradicts STATE.md, fall back to the original loads in STEP 1 unchanged. See `docs/context-protocol.md` for the contract.

---

### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, and project settings
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) -- to check back-matter availability and adaptations for the current work type
- `docs/surface-resolution-protocol.md` -- to resolve adapted cast and subject surfaces
- `.manuscript/WORK.md` -- title, author, publisher, and publication details
- The adapted cast surface for canonical `CHARACTERS.md`, when applicable -- for glossary extraction (names, roles, concepts, terms)
- Drafted prose from `.manuscript/drafts/` (especially `.manuscript/drafts/body/`) -- for content extraction (glossary terms, endnotes, themes)

**Confirm the `back-matter` command is available** for the current work type by checking `CONSTRAINTS.json`. If the work type's group is in the `hidden` list, inform the writer and stop.

Check for adapted behavior:
- If work type group is `academic`: apply `academic_back_matter` behavior (see Academic Adaptation below)
- If work type group is `sacred`: apply `sacred_back_matter` behavior (see Sacred Adaptation below)

---

### STEP 1.5: RESOLVE LEVEL

Resolve the level filter that controls which elements are eligible to be generated.

**Routing:**
- If `--element <name>` is given, ignore `--level` entirely and generate only that one element. Skip the rest of this step.
- If `--level <value>` is given, use that value (`minimum`, `balanced`, or `maximum`).
- If neither flag is given, run the interactive prompt from the Usage section. If the writer chooses **skip**, write a one-line summary ("Back matter generation skipped at writer's request -- no files written.") and exit without doing anything else.

**Level membership** (the eligible set per level, before work-type filtering):

| Level | Elements eligible |
|-------|-------------------|
| `minimum` | 9 (about-the-author). Plus 6 (bibliography) when work type group is `academic` or `sacred` (structurally required there). |
| `balanced` | minimum + 10 (colophon), 12 (permissions/credits when there is anything to credit) |
| `maximum` | All 12 standard elements + every applicable adaptation element (academic, sacred-tradition specific) |

**Adaptation interaction:**
- The Academic and Sacred adaptations modify or add elements. They run regardless of level. Their additions are eligible only at `maximum`, except where the level explicitly includes them (for example bibliography is in `minimum` for academic and sacred work types).
- Sacred-specific extras (concordance, scripture index, sacred maps, chronological tables) are eligible only at `maximum`.

**Work-type filtering applies on top of the level filter.** An element that is in the level's eligible set but is hidden for the current work type group (per `CONSTRAINTS.json`) is still skipped.

Use the resolved eligible set for STEP 3. Track the resolved level so STEP 4 can report it.

---

### STEP 2: VOICE DNA LOADING (CONDITIONAL)

**Load `.manuscript/STYLE-GUIDE.md` ONLY for narrative/voice-dependent elements:**
- Epilogue scaffold (1)
- Afterword scaffold (2)
- Suggested Reading (7)
- About the Author (9)
- Discussion Questions (11)

**Do NOT load STYLE-GUIDE.md for mechanical/structural elements:**
- Appendix (3)
- Glossary (4)
- Endnotes (5)
- Bibliography / References (6)
- Index (8)
- Colophon (10)
- Permissions / Credits (12)

This separation preserves voice fidelity for elements the reader experiences as authored prose, while keeping reference and structural elements clean and standardized.

---

### STEP 3: GENERATE ELEMENTS

Process each element in order, but only if it is in the eligible set resolved in STEP 1.5. If `--element` was specified, skip the level filter and generate only that element. Skip any element not in the eligible set silently (it goes into the STEP 4 skipped-elements report instead).

#### Element 1: Epilogue -- SCAFFOLD

**Load STYLE-GUIDE.md for voice.**

```markdown
# Epilogue

<!-- WRITER ACTION REQUIRED -->
<!-- The epilogue is a narrative closing -- it's part of the story. -->
<!-- It should be written in the same voice as the manuscript. -->

<!-- Common epilogue approaches: -->
<!-- - A scene set after the main narrative's conclusion -->
<!-- - Resolution of a subplot left open in the final chapter -->
<!-- - A flash-forward showing long-term consequences -->
<!-- - A return to a framing device established in the prologue -->
<!-- - A different character's perspective on the events -->

<!-- Consider: Does this story need an epilogue? -->
<!-- Not every work benefits from one. If the final chapter provides -->
<!-- sufficient closure, an epilogue may weaken the ending. -->

[Write your epilogue here]
```

Save to `.manuscript/back-matter/epilogue.md`

#### Element 2: Afterword -- SCAFFOLD

**Load STYLE-GUIDE.md for voice.**

```markdown
# Afterword

<!-- WRITER ACTION REQUIRED -->
<!-- The afterword is your reflection on the work after it's complete. -->

## Suggested Structure

1. **The journey** -- how writing this work changed you or your understanding
2. **Behind the scenes** -- research, inspirations, or process insights readers would enjoy
3. **What's next** -- if part of a series or ongoing project, what comes next
4. **An invitation** -- connect with readers (website, newsletter, social media)

<!-- Write in your natural voice. Your style profile has been loaded -->
<!-- to help maintain consistency. -->
```

Save to `.manuscript/back-matter/afterword.md`

#### Element 3: Appendix(es) -- TEMPLATE

```markdown
# Appendix [A/B/C...]

<!-- TEMPLATE: Structured appendix for supplementary material. -->
<!-- Create one file per appendix if multiple are needed. -->

## [Appendix Title]

<!-- Include material that supports the main text but would -->
<!-- interrupt the narrative flow if placed inline: -->
<!-- - Technical details, data tables, or methodology notes -->
<!-- - Historical documents or primary sources -->
<!-- - Extended examples or case studies -->
<!-- - Glossary of specialized terms (if separate from main glossary) -->
<!-- - Maps, charts, or diagrams requiring extended explanation -->

[Appendix content here]
```

Save to `.manuscript/back-matter/appendix.md`

#### Element 4: Glossary -- GENERATE

Extract terms, names, and concepts from the manuscript and the adapted cast surface. Generate definitions organized alphabetically.

Categories to extract:
- **Character names**: Brief identification (role, key traits)
- **Place names**: Location description and significance
- **Invented terms**: Made-up words, languages, technologies, or concepts with definitions
- **Technical terms**: Domain-specific vocabulary used in the text
- **Foreign words/phrases**: Translation and context

Present as:

```markdown
# Glossary

**[Term]** -- [Definition]. [Context of first/primary usage if helpful.]

**[Term]** -- [Definition].
```

Sort alphabetically. Exclude common words that need no definition.

Save to `.manuscript/back-matter/glossary.md`

#### Element 5: Endnotes -- TEMPLATE

```markdown
# Endnotes

<!-- TEMPLATE: Numbered endnote structure. -->
<!-- If the manuscript uses footnotes, they can be collected here -->
<!-- as endnotes for the published version. -->

## [Chapter/Section Title]

1. [Endnote text]
2. [Endnote text]

## [Chapter/Section Title]

1. [Endnote text]
```

Scan the manuscript for any existing footnote markers and extract them into this structure. If no footnotes exist, skip this element.

Save to `.manuscript/back-matter/endnotes.md`

#### Element 6: Bibliography / References -- TEMPLATE

```markdown
# Bibliography

<!-- TEMPLATE: Bibliographic entry format. -->
<!-- Format entries according to the style appropriate for this work type: -->
<!-- - Chicago Manual of Style (most prose) -->
<!-- - APA (social science, psychology) -->
<!-- - MLA (humanities, literary criticism) -->
<!-- - Turabian (general academic) -->

## Works Cited

[Author Last, First. *Title*. Publisher, Year.]

## Works Consulted

[Author Last, First. *Title*. Publisher, Year.]
```

If the manuscript references specific works, extract them and format appropriately. Otherwise, provide the template structure.

Save to `.manuscript/back-matter/bibliography.md`

#### Element 7: Suggested Reading -- GENERATE

**Load STYLE-GUIDE.md for tone.**

Generate a curated reading list based on the work's themes, influences, and subject matter. Organize by category:

```markdown
# Suggested Reading

<!-- Curated recommendations for readers who enjoyed this work. -->

## [Theme/Category 1]
- *[Title]* by [Author] -- [One-sentence description of why it's relevant]

## [Theme/Category 2]
- *[Title]* by [Author] -- [One-sentence description]
```

Include 8-15 recommendations. Focus on well-known, accessible works. Match the tone of the recommendations to the writer's voice per STYLE-GUIDE.md.

Save to `.manuscript/back-matter/suggested-reading.md`

#### Element 8: Index -- TEMPLATE

```markdown
# Index

<!-- Professional indexing is recommended for nonfiction. -->
<!-- This provides a starting framework with key term extraction. -->
<!-- A professional indexer will produce a far more comprehensive -->
<!-- and useful index than automated extraction alone. -->

## Key Terms Extracted

<!-- The following terms were identified as candidates for indexing. -->
<!-- This list is a starting point, not a finished index. -->

[Term], [page TBD]
[Term], [page TBD]
  [Subentry], [page TBD]

## Indexing Notes

- Consider hiring a professional indexer for nonfiction works
- Index entries should be finalized after page layout is complete
- Common indexing depth: 3-5 entries per page of text
```

Extract key terms, proper nouns, and concepts from the manuscript as index candidates.

Save to `.manuscript/back-matter/index.md`

#### Element 9: About the Author -- GENERATE

**Load STYLE-GUIDE.md for voice.**

Generate from the writer profile if available (check `.manuscript/WORK.md` for author bio or profile information). Write in third person unless the writer profile specifies otherwise.

```markdown
# About the Author

[Generated author bio in third person, matching the work's tone.
Include: credentials relevant to the work, previous publications,
personal details the author has shared, location, and a human touch.]

<!-- DRAFT -- Review and personalize. -->
<!-- This bio was generated from your project profile. -->
<!-- Update with current details and your preferred tone. -->
```

If no writer profile information is available, provide a template:

```markdown
# About the Author

<!-- WRITER ACTION REQUIRED -->
<!-- Write your author bio here. Tips: -->
<!-- - Third person is standard ("Jane Smith is...") -->
<!-- - Lead with credentials relevant to THIS work -->
<!-- - Include previous publications if applicable -->
<!-- - Add a personal detail (location, hobby, family) -->
<!-- - Keep to 100-200 words for most genres -->
```

Save to `.manuscript/back-matter/about-author.md`

#### Element 10: Colophon -- TEMPLATE

```markdown
# Colophon

<!-- TEMPLATE: Production details for the published work. -->
<!-- The colophon describes how the book was made. -->

This book was [typeset/designed/produced] using [tools].

**Body text:** [Font name], [size]
**Chapter headings:** [Font name]
**Design:** [Designer name or "the author"]

[Additional production notes -- paper type, printing method, etc.]

<!-- Fill in after final design decisions are made. -->
```

Save to `.manuscript/back-matter/colophon.md`

#### Element 11: Discussion Questions -- GENERATE

**Load STYLE-GUIDE.md for tone.**

Generate reading group discussion questions from the work's themes, plot, and character arcs. This element is also available as a standalone command via `/scr:discussion-questions`.

Create 10-15 questions organized by type:

```markdown
# Discussion Questions

## Characters
1. [Question about character motivations, growth, or relationships]
2. [Question about character choices and consequences]

## Themes
3. [Question connecting the work's themes to broader ideas]
4. [Question about the work's central message or argument]

## Craft
5. [Question about narrative structure, point of view, or style]
6. [Question about specific scenes or passages that stood out]

## Personal Response
7. [Question inviting readers to connect the work to their own experience]
8. [Question about what surprised, challenged, or moved the reader]

## Going Deeper
9. [Question connecting to other works, historical events, or current issues]
10. [Question that invites debate or multiple interpretations]
```

Match the tone and sophistication of questions to the work's target audience.

Save to `.manuscript/back-matter/discussion-questions.md`

#### Element 12: Permissions / Credits -- TEMPLATE

```markdown
# Permissions and Credits

<!-- TEMPLATE: Permissions acknowledgment for quoted or reproduced material. -->
<!-- Required if the work includes: -->
<!-- - Extended quotations from copyrighted works -->
<!-- - Song lyrics, poetry, or other literary excerpts -->
<!-- - Images, photographs, or artwork by others -->
<!-- - Maps or charts from external sources -->
<!-- - Data or tables reproduced from other publications -->

## Text Permissions

"[Quoted text]" from *[Source Title]* by [Author]. Copyright (c) [Year]
by [Copyright Holder]. Reprinted with permission of [Publisher/Agent].

## Image Credits

[Description of image]. Copyright (c) [Year] by [Photographer/Artist].
Used with permission.

## Additional Credits

[Any other credits -- cover designer, map illustrator, etc.]

<!-- IMPORTANT: Obtain all permissions BEFORE publication. -->
<!-- Keep copies of permission letters/emails for your records. -->
```

Save to `.manuscript/back-matter/permissions.md`

---

### ACADEMIC ADAPTATION (behavior: academic_back_matter)

When the work type group is `academic`, apply these modifications:

1. **Bibliography becomes primary element**: Move to prominent position. Format entries according to the citation style specified in config (APA, MLA, or Chicago). If no style is specified, default to Chicago Author-Date for sciences or Chicago Notes-Bibliography for humanities.

2. **Add Methodology Appendix template**: Include a structured appendix specifically for research methodology:
   ```markdown
   # Appendix: Methodology

   ## Research Design
   ## Data Collection
   ## Analysis Methods
   ## Limitations
   ## Ethics Approval
   ```

3. **Index gets enhanced term extraction**: Extract from manuscript with emphasis on technical terms, named theories, methodologies, key findings, and author citations.

4. **Epilogue and Afterword are skipped**: Not standard in academic works.

5. **Discussion Questions become Study Questions**: Reframe for academic context -- seminar discussion, exam preparation, research extension questions.

6. **Suggested Reading becomes Further Reading**: Academic tone, organized by subtopic, includes seminal works and recent contributions.

---

### SACRED ADAPTATION (behavior: sacred_back_matter)

When the work type group is `sacred`, apply the following modifications to the standard 12 elements AND add the sacred-specific elements below.

**Standard sacred modifications:**

1. **Glossary emphasizes theological/tradition terms**: Prioritize tradition-specific terminology, with attention to original language terms (Hebrew, Greek, Arabic, Sanskrit, Pali) and their nuanced meanings within the tradition.

2. **Discussion Questions become Study Questions**: Reframe for devotional or scholarly study groups, including textual analysis, theological reflection, and practical application questions.

## Sacred/Historical Back Matter

When the work type group is `sacred`, the `--element` flag accepts these additional elements beyond the standard 12:

| Element | Flag Name | Type | Description |
|---------|-----------|------|-------------|
| Concordance | `concordance` | GENERATE | Reference to CONCORDANCE.md (generated by `/scr:sacred:concordance`). If CONCORDANCE.md exists, include it as an appendix. If not, suggest running `/scr:sacred:concordance` first and provide a scaffold structure for manual creation. |
| Scripture Index | `scripture-index` | GENERATE | Index of all scripture references appearing in the work, extracted from CROSS-REFERENCES.md. Organized by book/surah/sutta with passage references. |
| Sacred Maps | `sacred-maps` | SCAFFOLD | Maps derived from COSMOLOGY.md geographic data. Include as an appendix with reference to illustration prompts. Suggest running `/scr:map-illustration` for visual generation. |
| Theological Glossary | `theological-glossary` | GENERATE | Glossary of theological and sacred terms used in the work, with definitions that include original language terms (Hebrew, Greek, Arabic, Sanskrit, Pali) and tradition-specific nuances. Distinct from the standard glossary in its focus on doctrinal and sacred vocabulary. |
| Chronology Appendix | `chronology-appendix` | GENERATE | Timeline from CHRONOLOGY.md. If CHRONOLOGY.md exists, format as a chronological table. If not, suggest running `/scr:sacred:chronology` first. |
| Doctrinal Index | `doctrinal-index` | GENERATE | Index of doctrinal topics covered in the work, extracted from DOCTRINES.md. Organized by doctrine with passage references where each doctrine is addressed. |
| Source Bibliography | `source-bibliography` | TEMPLATE | Bibliography of primary sacred sources referenced in the work, extracted from SOURCES.md. Includes manuscripts, codices, critical editions, and commentaries consulted. |
| Tradition Acknowledgments | `tradition-acknowledgments` | SCAFFOLD | Acknowledgment of traditions, lineages, teachers, and communities referenced or drawn upon. Includes appropriate gratitude formulas for the tradition (e.g., "sallallahu alayhi wa sallam" for Islamic texts when mentioning the Prophet). |

**Sacred back matter element details:**

### Concordance
```markdown
# Concordance

<!-- If CONCORDANCE.md exists, its content is included here. -->
<!-- If not, run /scr:sacred:concordance to generate one from the manuscript. -->

<!-- A concordance lists key words and concepts with every -->
<!-- passage reference where they appear. -->

**[Term]**: [passage ref 1], [passage ref 2], [passage ref 3]
```

### Scripture Index
```markdown
# Scripture Index

<!-- Cross-references to other scriptures cited in this work. -->
<!-- Generated from CROSS-REFERENCES.md if available. -->

## [Book/Surah/Sutta Name]
- [Chapter:Verse] -- referenced in [location in this work]
```

### Sacred Maps
```markdown
# Maps

<!-- Suggested maps for this work based on geographic references -->
<!-- in COSMOLOGY.md: -->
- [Location 1] -- referenced in [passages]
- [Location 2] -- referenced in [passages]

<!-- Generate map illustrations: /scr:map-illustration -->
<!-- Commission from a cartographer familiar with the tradition. -->
```

### Chronological Tables
```markdown
# Chronological Tables

| Period | Dates | Key Events | References |
|--------|-------|------------|------------|
```

When `--all` is used for sacred works, include these sacred-specific elements alongside the standard 12+ back matter elements. Save each to `.manuscript/back-matter/{element-name}.md`.

---

### STEP 4: SKIPPED ELEMENTS REPORT

When running without `--element`, after generating all eligible elements, list any elements that were skipped along with the resolved level:

```markdown
## Back Matter Summary

Level: [minimum | balanced | maximum]

## Skipped Elements

The following back matter elements were not generated for this work:

- **[Element name]**: [Reason -- e.g., "Not in level: balanced", "No footnotes found in manuscript", "Not applicable to fiction", "Academic adaptation: epilogue not standard"]
```

When the reason is the level filter, use the form **"Not in level: \<resolved-level\>"** so the writer can see what re-running with `--level maximum` would add.

Append this report to the final output displayed to the writer.

---

### STEP 5: HISTORY LOG

Append one line to `.manuscript/HISTORY.log` per `docs/history-protocol.md`:

```
{ISO timestamp} | scr:back-matter | level={resolved level or "skip" or "single-element"} | elements={count generated} | outcome=ok
```

If the writer chose `skip` in the interactive prompt, log `level=skip | elements=0 | outcome=skipped` -- the skip is itself a state event worth recording. If `--element <name>` was used, log `level=single-element | elements=1 | element={name} | outcome=ok`. Create HISTORY.log if it does not exist.

---

### OUTPUT

- Individual element files saved to `.manuscript/back-matter/{element-name}.md`
- Summary displayed to the writer listing all generated elements with file paths
- Skipped elements listed with explanations
- Any SCAFFOLD or TEMPLATE elements highlighted as requiring writer action

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
