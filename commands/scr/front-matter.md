---
description: Generate publication-ready front matter elements in Chicago Manual of Style order.
argument-hint: "[--level <minimum|balanced|maximum>] [--element <name>]"
---

# /scr:front-matter -- Front Matter Generation

Generate publication-ready front matter elements in Chicago Manual of Style order. Elements are classified as generatable, scaffoldable, or suggestable depending on whether AI can produce a complete version or must provide a template for the writer.

## Usage

```
/scr:front-matter                                      # interactive: skip / minimum / balanced / maximum
/scr:front-matter --level <minimum|balanced|maximum>   # non-interactive
/scr:front-matter --element <name>                     # generate one specific element
```

**Levels:**

| Level | What it generates | When to use |
|-------|-------------------|-------------|
| `minimum` | Legal / structural floor only: title page, copyright, TOC. Plus tradition approval block if required. | Beta-reader handoff, draft sharing, anything not yet hitting a retailer. |
| `balanced` | `minimum` + the elements most trade books actually print: half-title, dedication scaffold, epigraph, acknowledgments. | Default for retail publishing. |
| `maximum` | Every applicable element (the legacy "all 19" behavior). | Critical editions, scholarly works, anyone who wants the full Chicago menu. |

If neither `--level` nor `--element` is provided, the command prompts the writer first:

> Generate front matter?
>
> 1. **skip** -- I do not want any front matter generated
> 2. **minimum** -- title page, copyright, TOC (legal floor)
> 3. **balanced** -- minimum + half-title, dedication, epigraph, acknowledgments (trade default)
> 4. **maximum** -- every applicable element

If the writer answers **skip**, exit with no files written and no error.

**Elements (Chicago Manual of Style order):**

| # | Element | Flag Name | Type |
|---|---------|-----------|------|
| 1 | Half-title | `half-title` | GENERATE |
| 2 | Series title / Also by | `series-title` | GENERATE |
| 3 | Title page | `title` | GENERATE |
| 4 | Copyright page | `copyright` | GENERATE |
| 5 | Dedication | `dedication` | SCAFFOLD |
| 6 | Epigraph | `epigraph` | SCAFFOLD |
| 7 | Table of contents | `toc` | GENERATE |
| 8 | List of illustrations | `illustrations-list` | GENERATE |
| 9 | List of tables | `tables-list` | GENERATE |
| 10 | List of abbreviations | `abbreviations` | GENERATE |
| 11 | Foreword | `foreword` | SCAFFOLD |
| 12 | Preface | `preface` | SCAFFOLD |
| 13 | Acknowledgments | `acknowledgments` | GENERATE DRAFT |
| 14 | Introduction | `introduction` | SCAFFOLD |
| 15 | Prologue | `prologue` | SCAFFOLD |
| 16 | Note to the reader | `note-to-reader` | GENERATE DRAFT |
| 17 | Maps / family trees | `maps` | SCAFFOLD |
| 18 | Cast of characters | `cast` | GENERATE |
| 19 | Timeline | `timeline` | GENERATE |

If `--element` is provided, generate only that element. Otherwise, generate all elements applicable to the current work type.

## Instruction

You are a **publishing specialist** preparing front matter for a manuscript. Your output must follow Chicago Manual of Style conventions for element ordering, recto/verso placement, and content standards.

---

### STEP 0: BOOTSTRAP (context-cost protocol)

Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it as your orientation source for project title, work type, phase, and open items. In STEP 1, skip raw-file loads of `config.json` and `STATE.md` for those fields -- still load `WORK.md`, `OUTLINE.md`, `CHARACTERS.md`, and `CONSTRAINTS.json` (each holds element-generation data CONTEXT.md does not surface).

If CONTEXT.md is missing, stale, or contradicts STATE.md, fall back to the original loads in STEP 1 unchanged. See `docs/context-protocol.md` for the contract.

---

### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, and project settings
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) -- to check front-matter availability and adaptations for the current work type
- `.manuscript/WORK.md` -- title, subtitle, author name, ISBN, publisher, series info, copyright year, rights statement, edition info
- `.manuscript/OUTLINE.md` -- for TOC generation (chapter/section structure)
- `.manuscript/CHARACTERS.md` -- for cast of characters generation

**Confirm the `front-matter` command is available** for the current work type by checking `CONSTRAINTS.json`. If the work type's group is in the `hidden` list, inform the writer and stop.

Check for adapted behavior:
- If work type group is `academic`: apply `academic_front_matter` behavior (see Academic Adaptation below)
- If work type group is `sacred`: apply `sacred_front_matter` behavior (see Sacred Adaptation below)

---

### STEP 1.5: RESOLVE LEVEL

Resolve the level filter that controls which elements are eligible to be generated.

**Routing:**
- If `--element <name>` is given, ignore `--level` entirely and generate only that one element. Skip the rest of this step.
- If `--level <value>` is given, use that value (`minimum`, `balanced`, or `maximum`).
- If neither flag is given, run the interactive prompt from the Usage section. If the writer chooses **skip**, write a one-line summary ("Front matter generation skipped at writer's request -- no files written.") and exit without doing anything else.

**Level membership** (the eligible set per level, before work-type filtering):

| Level | Elements eligible |
|-------|-------------------|
| `minimum` | 3 (title page), 4 (copyright), 7 (TOC) |
| `balanced` | minimum + 1 (half-title), 5 (dedication), 6 (epigraph), 13 (acknowledgments) |
| `maximum` | All 19 standard elements + every applicable adaptation element (academic, sacred-tradition specific) |

**Adaptation interaction:**
- The Academic and Sacred adaptations modify or add elements. They run regardless of level. Their additions are eligible only at `maximum`, except for the **tradition approval block** (STEP 3.5) which is required-when-applicable and runs at every level including `minimum`. The adaptations do not lift `minimum` or `balanced` to `maximum` -- they only adjust per-element behavior for the elements that the chosen level already includes.
- If the writer used `--level minimum` or `--level balanced` and an academic/sacred adaptation would normally substitute or rename an element (for example "Dedication becomes Abstract" for academic), apply the substitution only when that element is already in the eligible set.
- Tradition-specific extras (imprimatur, haskamah, bismillah, ijazah, scriptural-dedication, theological-preface) are eligible only at `maximum`.

**Work-type filtering applies on top of the level filter.** An element that is in the level's eligible set but is hidden for the current work type group (per `CONSTRAINTS.json`) is still skipped.

Use the resolved eligible set for STEP 3. Track the resolved level so STEP 4 can report it.

---

### STEP 2: VOICE DNA LOADING (CONDITIONAL)

**Load `.manuscript/STYLE-GUIDE.md` ONLY for narrative elements:**
- Dedication (5)
- Epigraph suggestions (6)
- Preface (12)
- Acknowledgments (13)
- Introduction (14)
- Prologue (15)
- Note to the reader (16)

**Do NOT load STYLE-GUIDE.md for mechanical elements:**
- Half-title (1)
- Series title (2)
- Title page (3)
- Copyright page (4)
- Table of contents (7)
- List of illustrations (8)
- List of tables (9)
- List of abbreviations (10)
- Foreword scaffold (11)
- Maps (17)
- Cast of characters (18)
- Timeline (19)

This separation preserves voice fidelity for elements the reader experiences as authored prose, while keeping mechanical elements clean and standardized.

---

### STEP 3: GENERATE ELEMENTS

Process each element in Chicago Manual of Style order, but only if it is in the eligible set resolved in STEP 1.5. If `--element` was specified, skip the level filter and generate only that element. Skip any element not in the eligible set silently (it goes into the STEP 4 skipped-elements report instead).

#### Element 1: Half-Title (Recto) -- GENERATE

Display the title only. No subtitle, no author name, no publisher. This is the first page the reader sees when opening the book.

```
[TITLE]
```

Save to `.manuscript/front-matter/01-half-title.md`

#### Element 2: Series Title / Also By (Verso) -- GENERATE

If the work is part of a series (check WORK.md for series info):
- List the series name and other titles in the series
- Or list "Also by [Author]" with other works

If no series info exists, skip this element and note it in the skipped elements list.

Save to `.manuscript/front-matter/02-series-title.md`

#### Element 3: Title Page (Recto) -- GENERATE

Full title page with:
- Title
- Subtitle (if any)
- Author name
- Publisher name and location (if available)

Save to `.manuscript/front-matter/03-title-page.md`

#### Element 4: Copyright Page (Verso) -- GENERATE

Generate from WORK.md metadata using standard legal boilerplate:

```
Copyright (c) [Year] [Author Name]
All rights reserved.

[ISBN line if available]
[Edition info if available]

Published by [Publisher]

No part of this publication may be reproduced, distributed, or transmitted
in any form or by any means, including photocopying, recording, or other
electronic or mechanical methods, without the prior written permission of
the publisher, except in the case of brief quotations embodied in critical
reviews and certain other noncommercial uses permitted by copyright law.

[Library of Congress info if available]
[Printing history if available]

Printed in [Country]
[Print edition number]
```

Adapt the template based on available metadata -- omit lines where data is not provided rather than leaving placeholders.

Save to `.manuscript/front-matter/04-copyright.md`

#### Element 5: Dedication (Recto) -- SCAFFOLD

**Load STYLE-GUIDE.md for tone.**

Provide a dedication template with guidance:

```markdown
---
scaffold: true
element: dedication
---

# Dedication

<!-- WRITER ACTION REQUIRED -->
<!-- The dedication is a personal statement. Write yours below. -->
<!-- Common styles: single name, short phrase, or brief paragraph. -->
<!-- Tone guidance from your voice profile has been considered. -->

[Your dedication here]
```

Save to `.manuscript/front-matter/05-dedication.md`

#### Element 6: Epigraph (Recto or Verso) -- SUGGEST

**Load STYLE-GUIDE.md for tone matching.**

Offer 3 thematically appropriate epigraph suggestions from public domain works. Base suggestions on:
- The work's themes (from OUTLINE.md or WORK.md)
- The tone established in STYLE-GUIDE.md
- Works that are verifiably in the public domain

Present as:

```markdown
---
scaffold: true
element: epigraph
---

# Epigraph

<!-- WRITER ACTION REQUIRED -->
<!-- Choose one of the suggestions below, or supply your own. -->

## Suggestion 1
> "[Quote]"
> -- [Author], *[Work]* ([Year])

## Suggestion 2
> "[Quote]"
> -- [Author], *[Work]* ([Year])

## Suggestion 3
> "[Quote]"
> -- [Author], *[Work]* ([Year])

## Use Your Own
> "[Your chosen epigraph]"
> -- [Attribution]
```

Save to `.manuscript/front-matter/06-epigraph.md`

#### Element 7: Table of Contents (Recto) -- GENERATE

Build from OUTLINE.md structure. Include:
- Part titles (if the work has parts)
- Chapter/section titles
- Page numbers as `[TBD]` (finalized during export)

Use the work type's hierarchy terminology from CONSTRAINTS.json.

Save to `.manuscript/front-matter/07-toc.md`

#### Element 8: List of Illustrations (Recto) -- GENERATE

Scan the manuscript drafts for illustrations, figures, or images. If none exist, skip this element.

List each with:
- Figure number
- Caption or description
- Page `[TBD]`

Save to `.manuscript/front-matter/08-illustrations-list.md`

#### Element 9: List of Tables (Recto) -- GENERATE

Scan the manuscript drafts for tables. If none exist, skip this element.

List each with:
- Table number
- Title
- Page `[TBD]`

Save to `.manuscript/front-matter/09-tables-list.md`

#### Element 10: List of Abbreviations (Recto) -- GENERATE

Extract abbreviations, acronyms, and initialisms used in the manuscript. If fewer than 3 are found, skip this element.

Present alphabetically:
```
[ABBR] -- [Full expansion]
```

Save to `.manuscript/front-matter/10-abbreviations.md`

#### Element 11: Foreword (Recto) -- SCAFFOLD

**Do NOT generate AI content pretending to be from another person.** A foreword is written by someone other than the author. This scaffold provides structure and guidance for the foreword writer.

```markdown
---
scaffold: true
element: foreword
---

# Foreword

<!-- IMPORTANT: A foreword is written by someone other than the author. -->
<!-- This scaffold provides structure for your foreword writer. -->
<!-- Do NOT use AI-generated content here -- it must be an authentic -->
<!-- contribution from the person writing the foreword. -->

## For the Foreword Writer

Please address the following in your foreword:

1. **Your connection** to the author or subject matter
2. **Why this work matters** -- its significance or contribution
3. **What the reader will find** -- a preview without spoilers
4. **Your endorsement** -- why you recommend this work

Typical length: 1,000-3,000 words.

<!-- Delete this scaffold and replace with the foreword text. -->
```

Save to `.manuscript/front-matter/11-foreword.md`

#### Element 12: Preface (Recto) -- SCAFFOLD

**Load STYLE-GUIDE.md for voice.**

```markdown
---
scaffold: true
element: preface
---

# Preface

<!-- WRITER ACTION REQUIRED -->
<!-- The preface is YOUR statement about the work. Address: -->

## Suggested Structure

1. **Why you wrote this** -- the origin story or motivation
2. **How to read this work** -- any guidance for the reader
3. **What changed** -- if this is a new edition, what's different
4. **Acknowledgment of scope** -- what you cover and what you don't

<!-- Write in your natural voice. Your style profile has been loaded -->
<!-- to help maintain consistency with the rest of the manuscript. -->
```

Save to `.manuscript/front-matter/12-preface.md`

#### Element 13: Acknowledgments (Recto) -- GENERATE DRAFT

**Load STYLE-GUIDE.md for voice.**

Generate a draft acknowledgments section from project context -- collaborators, influences, research sources mentioned in the manuscript. Include standard categories:

- Editorial and publishing team
- Research and subject matter contributors
- Personal support (family, friends, writing community)
- Institutional support (grants, residencies, libraries)

Mark clearly as a draft:

```markdown
---
scaffold: true
element: acknowledgments
---

# Acknowledgments

<!-- DRAFT -- Personalize with your own thanks. -->
<!-- This draft was generated from your project context. -->
<!-- Add, remove, and rewrite to make it authentically yours. -->

[Generated draft text in the writer's voice per STYLE-GUIDE.md]
```

Save to `.manuscript/front-matter/13-acknowledgments.md`

#### Element 14: Introduction (Recto) -- SCAFFOLD

**Load STYLE-GUIDE.md for voice.**

```markdown
# Introduction

<!-- WRITER ACTION REQUIRED -->
<!-- The introduction frames the work for the reader. -->

## Suggested Sections

### Context
<!-- What does the reader need to know before starting? -->

### Scope and Purpose
<!-- What will this work accomplish? What questions does it address? -->

### How This Work Is Organized
<!-- Brief roadmap of the structure -->

### A Note on [Methodology / Sources / Approach]
<!-- Any important caveats or explanations -->
```

Save to `.manuscript/front-matter/14-introduction.md`

#### Element 15: Prologue (Recto) -- SCAFFOLD

**Load STYLE-GUIDE.md for voice.**

```markdown
# Prologue

<!-- WRITER ACTION REQUIRED -->
<!-- The prologue is a narrative opening -- it's part of the story. -->
<!-- It should be written in the same voice as the manuscript. -->

<!-- Common prologue approaches: -->
<!-- - A scene from a different time period than the main narrative -->
<!-- - A framing device or narrator introduction -->
<!-- - An inciting event that precedes the main timeline -->
<!-- - A thematic statement dramatized through action -->

[Write your prologue here]
```

Save to `.manuscript/front-matter/15-prologue.md`

#### Element 16: Note to the Reader (Variable) -- GENERATE DRAFT

**Load STYLE-GUIDE.md for voice.**

Generate a context-appropriate note based on the work type and content:
- For fiction: notes on research, historical context, or content warnings
- For nonfiction: notes on methodology, terminology, or reading approach
- For memoir: notes on memory, composite characters, or timeline changes

Mark as draft for writer review.

Save to `.manuscript/front-matter/16-note-to-reader.md`

#### Element 17: Maps / Family Trees (Variable) -- SCAFFOLD

If `.manuscript/WORLD.md` exists, use it to prompt for map creation:

```markdown
# Maps

<!-- WRITER ACTION REQUIRED -->
<!-- Based on your world-building, the following locations/relationships -->
<!-- may benefit from visual representation: -->

## Suggested Maps
[List key locations from WORLD.md]

## Suggested Family Trees
[List key family relationships from CHARACTERS.md if applicable]

<!-- Maps and family trees are typically created by a professional -->
<!-- illustrator or cartographer. This scaffold identifies what to create. -->
```

If no WORLD.md exists, skip this element.

Save to `.manuscript/front-matter/17-maps.md`

#### Element 18: Cast of Characters (Variable) -- GENERATE

Generate from CHARACTERS.md. List each character with:
- Name
- Brief description (role in the story, key identifying details)
- Relationships to other characters (if relevant)

Group by faction, family, or narrative importance as appropriate.

Save to `.manuscript/front-matter/18-cast.md`

#### Element 19: Timeline (Variable) -- GENERATE

If timeline data is available (from OUTLINE.md, WORK.md, or manuscript content), generate a chronological timeline of key events.

If no timeline data exists, skip this element.

Save to `.manuscript/front-matter/19-timeline.md`

---

### ACADEMIC ADAPTATION (behavior: academic_front_matter)

When the work type group is `academic`, apply these modifications:

1. **Replace Dedication (5) and Epigraph (6) with Abstract**: Generate an academic abstract summarizing the research question, methodology, findings, and conclusions
2. **Add List of Figures**: Enhanced version of List of Illustrations (8) following academic formatting conventions (numbered figures with descriptive captions)
3. **Introduction becomes Methodology Introduction**: Element 14 scaffold emphasizes research methodology, literature review positioning, and thesis statement
4. **Prologue is skipped**: Academic works do not have prologues
5. **Cast of Characters is skipped**: Not applicable to academic works
6. **Foreword becomes Expert Introduction**: Scaffold for a domain expert's introduction

Save the abstract to `.manuscript/front-matter/05-abstract.md`

---

### SACRED ADAPTATION (behavior: sacred_front_matter)

When the work type group is `sacred`, apply these modifications to the standard 19 elements AND add the following tradition-specific elements. Read the top-level `tradition` key from `.manuscript/config.json` to determine which elements to include. For older projects only, if top-level `tradition` is absent and `sacred.tradition` exists, use `sacred.tradition` as a legacy fallback.

**Standard sacred modifications:**

1. **Add Imprimatur / Nihil Obstat scaffold**: For traditions that require ecclesiastical approval, provide a scaffold with the required format and submission guidance
2. **Add Tradition-Specific Greeting**: Generate an appropriate opening (e.g., "In the Name of God, the Compassionate, the Merciful" for Islamic texts; "Ad Majorem Dei Gloriam" for Jesuit works) based on the specific work type
3. **Emphasis on Textual Provenance**: Introduction scaffold (14) adds sections for manuscript tradition, translation approach, and canonical status
4. **Epigraph draws from tradition**: Suggestions come from the work's own sacred tradition rather than general literature
5. **Dedication may include consecration language**: Scaffold includes tradition-appropriate consecration or offering templates

Save the imprimatur scaffold to `.manuscript/front-matter/05a-imprimatur.md`

## Sacred/Historical Front Matter

When the work type group is `sacred`, the `--element` flag accepts these additional elements beyond the standard 19:

| Element | Flag Name | Tradition | Type | Description |
|---------|-----------|-----------|------|-------------|
| Imprimatur | `imprimatur` | Christian (Catholic) | SCAFFOLD | Bishop's declaration of doctrinal safety. Scaffold only -- requires actual ecclesiastical authority. |
| Nihil Obstat | `nihil-obstat` | Christian (Catholic) | SCAFFOLD | Censor's declaration of no doctrinal error. Scaffold only -- requires actual ecclesiastical authority. |
| Haskamah | `haskamah` | Jewish | SCAFFOLD | Rabbinic approbation (letter of endorsement from a recognized rabbi or posek). Scaffold with tradition-specific structure including the rabbi's name, title, and community. |
| Bismillah | `bismillah` | Islamic | GENERATE | "In the name of God, the Most Gracious, the Most Merciful" opening invocation. Generated in Arabic script with transliteration and translation. |
| Ijazah | `ijazah` | Islamic | SCAFFOLD | Authorization and chain of transmission (isnad). Scaffold only -- requires actual authorization from a recognized teacher or institution. |
| Scriptural Dedication | `scriptural-dedication` | All sacred | SCAFFOLD | Dedication to the divine or sacred purpose. Template includes tradition-appropriate consecration or offering language. |
| Theological Preface | `theological-preface` | All sacred | SCAFFOLD | Preface stating theological positioning, interpretive approach (e.g., allegorical vs literal), intended audience, and relationship to existing scholarship. |

**For elements marked "scaffold only":** Generate the structure and placeholder text, but add a clear note:

> **Authorization Required:** This element requires authorization from a recognized authority in your tradition. The text below is a template -- do not publish without proper authorization.

**Tradition-specific element selection:**

| Tradition | Elements Included |
|-----------|-------------------|
| `catholic` | imprimatur, nihil-obstat, scriptural-dedication, theological-preface |
| `orthodox`, `tewahedo`, `protestant` | scriptural-dedication, theological-preface |
| `jewish` | haskamah, scriptural-dedication, theological-preface |
| `islamic-hafs`, `islamic-warsh` | bismillah, ijazah, scriptural-dedication, theological-preface |
| `pali`, `tibetan` | scriptural-dedication, theological-preface |
| `sanskrit` | scriptural-dedication, theological-preface |
| All others | scriptural-dedication, theological-preface |

When `--all` is used for sacred works, include these tradition-specific elements in addition to the standard 19 front matter elements. Save each to `.manuscript/front-matter/20-{element-name}.md` (numbering continues from the standard elements).

---

### STEP 3.5: TRADITION APPROVAL BLOCK (CONDITIONAL)

After completing all front-matter elements, check if top-level `tradition` is set in `.manuscript/config.json`. For older projects only, if top-level `tradition` is absent and `sacred.tradition` exists, use `sacred.tradition` as a legacy fallback.

If `tradition` is absent or null: skip this step silently.

If `tradition` is set, load `templates/sacred/{tradition}/manifest.yaml` and read `approval_block.required`.

If `approval_block.required` is `false`: skip this step silently.

If `approval_block.required` is `true`: offer to create an approval block page:

> **Tradition notice:** The **{approval_block.label}** (tradition approval) is required before publication for this tradition. Would you like to create the approval block scaffold?

If the writer confirms, create `.manuscript/front-matter/00-approval-block.md` with the following content:

```markdown
---
scaffold: true
element: approval-block
tradition: {tradition}
---

# {approval_block.label}

<!-- AUTHORIZATION REQUIRED -->
<!-- This page must be completed by a recognized authority in the {tradition} tradition. -->
<!-- Do not publish without proper authorization. -->

## For the Authorizing Authority

This work requires a {approval_block.label} -- a formal declaration that the content
is doctrinally sound according to the {tradition} tradition.

**Work:** [Title from WORK.md]
**Author:** [Author from WORK.md]
**Scope:** {approval_block.scope}

[Space for the authorizing authority's declaration, name, title, and date]
```

Save to `.manuscript/front-matter/00-approval-block.md`.

The `00-` prefix ensures this page precedes the half-title in any file listing.

---

### STEP 4: SKIPPED ELEMENTS REPORT

When running without `--element`, after generating all eligible elements, list any elements that were skipped along with the resolved level:

```markdown
## Front Matter Summary

Level: [minimum | balanced | maximum]

## Skipped Elements

The following front matter elements were not generated for this work:

- **[Element name]**: [Reason -- e.g., "Not in level: balanced", "No series info in WORK.md", "Not applicable to academic works", "No illustrations found in manuscript"]
```

When the reason is the level filter, use the form **"Not in level: \<resolved-level\>"** so the writer can see what re-running with `--level maximum` would add.

Append this report to the final output displayed to the writer.

---

### STEP 5: HISTORY LOG

Append one line to `.manuscript/HISTORY.log` per `docs/history-protocol.md`:

```
{ISO timestamp} | scr:front-matter | level={resolved level or "skip" or "single-element"} | elements={count generated} | outcome=ok
```

If the writer chose `skip` in the interactive prompt, log `level=skip | elements=0 | outcome=skipped` -- the skip is itself a state event worth recording. If `--element <name>` was used, log `level=single-element | elements=1 | element={name} | outcome=ok`. Create HISTORY.log if it does not exist.

---

### OUTPUT

- Individual element files saved to `.manuscript/front-matter/{NN}-{element-name}.md` using the Chicago Manual order number as prefix for correct sequencing
- Summary displayed to the writer listing all generated elements with file paths
- Skipped elements listed with explanations
- Any SCAFFOLD or SUGGEST elements highlighted as requiring writer action

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
