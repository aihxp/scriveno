---
description: Create and manage bilingual term glossary for consistent translation.
argument-hint: "<language> [--add <term> --translation <value>] [--import] [--review] [--category <cat>]"
---

# /scr:translation-glossary -- Glossary Management

Create and manage bilingual translation glossaries. Glossaries ensure consistent translation of character names, place names, invented terms, titles, recurring phrases, and cultural references across the manuscript.

Glossaries are stored as human-readable markdown tables in `.manuscript/translation/GLOSSARY-{lang}.md` -- version-controlled and easy to review.

## Usage

```
/scr:translation-glossary <language>                           # Create glossary (or show existing)
/scr:translation-glossary <language> --add <term> --translation <value>  # Add a single entry
/scr:translation-glossary <language> --add <term> --translation <value> --category <cat>  # Add with category
/scr:translation-glossary <language> --import                  # Bulk import terms
/scr:translation-glossary <language> --review                  # Review glossary and find missing terms
```

## Instruction

You are a **glossary manager**. Your job is to build and maintain bilingual term glossaries that the translator agent uses for consistent translation.

---

### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `target_languages`, `name_handling`, `measurement_system` from the `translation` section
- `docs/surface-resolution-protocol.md` -- to resolve adapted cast and world surfaces
- The adapted cast surface for canonical `CHARACTERS.md`, when applicable -- names to include in glossary
- The adapted world surface for canonical `WORLD.md`, when applicable -- place names and world-specific terms

If no language argument is provided:

> **Which language?**
>
> Configured target languages: [list from config.json]
>
> Specify a language: `/scr:translation-glossary <lang>`

Then **stop**.

Validate that the specified language is in the `target_languages` array. If not:

> **"[lang]" is not a configured target language.** Add it with `/scr:translate --add-language [lang]` first.

Then **stop**.

---

### STEP 2: ROUTE BY MODE

Determine the mode based on flags:

| Flags | Mode |
|-------|------|
| No flags | Create mode (if no glossary exists) or Display mode (if glossary exists) |
| `--add <term> --translation <value>` | Add mode |
| `--import` | Import mode |
| `--review` | Review mode |

---

### MODE: CREATE (no GLOSSARY-{lang}.md exists)

Scan the manuscript for translatable terms and build the initial glossary.

**Step 1: Scan for terms**

Read the following sources and extract terms that need consistent translation:

1. **Cast names** from the adapted cast surface, when applicable:
   - Extract all names, nicknames, titles
   - Category: `character_name`

2. **Place names** from the adapted world surface, when applicable:
   - Extract all location names, realm names, geographical features
   - Category: `place_name`

3. **Manuscript scan** -- Read through draft files in `.manuscript/drafts/body/` and identify:
   - Invented terms and neologisms (words not in standard dictionaries)
   - Category: `invented_term`
   - Recurring titles and honorifics (e.g., "Lord," "Master," "Professor")
   - Category: `title_honorific`
   - Recurring phrases that appear 3+ times and carry specific meaning
   - Category: `recurring_phrase`
   - Cultural references specific to the work's setting
   - Category: `cultural_reference`
   - Brand names or proper nouns
   - Category: `brand_name`

**Step 2: Generate translations based on name_handling config**

For each extracted term, provide a default translation:

- **name_handling = `keep_original`:** Character names default to original spelling. Add transliteration in Notes column if the target language uses a different script.
- **name_handling = `transliterate`:** Character names are transliterated into the target language's script/phonology.
- **name_handling = `localize`:** Character names are given culturally equivalent names in the target language (e.g., John -> Jean, William -> Guillaume).

For non-name terms (invented terms, phrases, cultural references): provide a contextually appropriate translation.

**Step 3: Write glossary**

Create the directory if needed:

```
mkdir -p .manuscript/translation/
```

Write the glossary as a markdown table to `.manuscript/translation/GLOSSARY-{lang}.md`:

```markdown
# Translation Glossary: [Language Name]

**Source language:** [source_language from config]
**Target language:** [language name] ([code])
**Name handling:** [name_handling setting]
**Last updated:** [date]

## Terms

| Source Term | Translation | Category | Notes |
|-------------|-------------|----------|-------|
| Marcus | Marcus | character_name | Original kept (keep_original) |
| The Wandering City | La Cite Errante | place_name | |
| chronoshifter | chronodecaleur | invented_term | Compound: chrono + shifter |
| "Break the seal" | "Briser le sceau" | recurring_phrase | Ritual context |
| Lord Commander | Seigneur Commandant | title_honorific | Military rank |

## Categories

- **character_name** -- Character names, nicknames, aliases
- **place_name** -- Locations, realms, geographical features
- **invented_term** -- Made-up words, neologisms, world-specific vocabulary
- **title_honorific** -- Titles, ranks, forms of address
- **recurring_phrase** -- Phrases that appear multiple times with specific meaning
- **cultural_reference** -- Setting-specific cultural elements
- **brand_name** -- Proper nouns, organization names

## Usage Notes

This glossary is loaded into the translator agent's context for every unit. Terms listed here MUST be used exactly as specified. To update a translation, edit this file directly or use `/scr:translation-glossary [lang] --add`.
```

Report:

> **Glossary created for [language]:** `.manuscript/translation/GLOSSARY-[lang].md`
>
> **Terms catalogued:**
> - [count] character names
> - [count] place names
> - [count] invented terms
> - [count] titles/honorifics
> - [count] recurring phrases
> - [count] cultural references
>
> **Review the glossary** to verify translations before starting translation:
> `/scr:translation-glossary [lang] --review`

---

### MODE: DISPLAY (GLOSSARY-{lang}.md exists, no flags)

Read and display the existing glossary:

> **Translation Glossary: [Language]**
>
> [Display the markdown table]
>
> **[count] terms total**
>
> **Actions:**
> - Add a term: `/scr:translation-glossary [lang] --add <term> --translation <value>`
> - Review for missing terms: `/scr:translation-glossary [lang] --review`
> - Bulk import: `/scr:translation-glossary [lang] --import`

---

### MODE: ADD (`--add <term> --translation <value>`)

Add a single term to the existing glossary.

1. Read the existing GLOSSARY-{lang}.md
2. Check if the term already exists:
   - If yes: Ask whether to update the existing translation or keep it
   - If no: Add to the table
3. Determine category:
   - If `--category <cat>` flag provided: use that category
   - If not: infer from context (check CHARACTERS.md for character names, WORLD.md for places, etc.)
4. Append the new row to the glossary table
5. Write the updated file

> **Added to glossary:** "[source term]" -> "[translation]" ([category])

---

### MODE: IMPORT (`--import`)

Bulk import terms from a list provided by the writer.

1. Read the existing GLOSSARY-{lang}.md (or create one if it doesn't exist)
2. Prompt the writer to provide terms in one of these formats:

> **Provide your terms in any of these formats:**
>
> **Simple list** (translations will be suggested):
> ```
> chronoshifter
> The Wandering City
> Lord Commander
> ```
>
> **Term + translation pairs:**
> ```
> chronoshifter | chronodecaleur
> The Wandering City | La Cite Errante
> Lord Commander | Seigneur Commandant
> ```
>
> **Full table rows:**
> ```
> chronoshifter | chronodecaleur | invented_term | Compound word
> ```

3. For simple lists: generate suggested translations using the same name_handling rules as Create mode
4. Show the proposed entries for writer approval
5. On approval: append all entries to the glossary and write the updated file

> **Imported [count] terms to glossary.**

---

### MODE: REVIEW (`--review`)

Review the glossary for completeness and consistency.

1. Read the existing GLOSSARY-{lang}.md
2. Scan the manuscript for terms that SHOULD be in the glossary but are NOT:
   - Character names from CHARACTERS.md not in glossary
   - Place names from WORLD.md not in glossary
   - Any terms flagged as "NEW TERM" in translated draft files
   - Invented terms or proper nouns found in drafts but missing from glossary
3. Check for potential inconsistencies:
   - Same source term with different translations
   - Similar terms that might confuse the translator (e.g., "Lord" vs "Lord Commander")

Report:

> **Glossary Review: [Language]**
>
> **Coverage:**
> - [count] terms in glossary
> - [count] character names covered / [total] in CHARACTERS.md
> - [count] place names covered / [total] in WORLD.md
>
> **Missing terms (found in manuscript but not in glossary):**
> - "[term]" -- appears [count] times in manuscript
> - "[term]" -- appears [count] times in manuscript
>
> **Potential inconsistencies:**
> - "[term]" has no translation yet
>
> **Actions:**
> - Add missing terms: `/scr:translation-glossary [lang] --add <term> --translation <value>`
> - Bulk add: `/scr:translation-glossary [lang] --import`

## Anti-patterns

- **NEVER** create a glossary without checking CHARACTERS.md first -- character names are the highest priority for consistency
- **NEVER** auto-translate names when `name_handling` is `keep_original` -- names stay in original form
- **NEVER** overwrite an existing glossary without asking -- always append or update
- **NEVER** leave the glossary in an invalid markdown table format -- the translator agent parses it

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
