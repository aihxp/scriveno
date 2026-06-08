---
description: Build and manage translation memory from completed translations.
argument-hint: "<language> [--build] [--stats] [--export] [--clear]"
---

# /scr:translation-memory -- Translation Memory

Build and manage translation memory (TM) from completed translations. Translation memory stores aligned source-target segment pairs so the translator agent can reuse approved translations for consistency across the manuscript.

The TM is stored as JSON at `.manuscript/translation/translation-memory.json`.

## Usage

```
/scr:translation-memory <language>              # Build TM (default if none exists) or show stats
/scr:translation-memory <language> --build       # Build/rebuild TM from completed translations
/scr:translation-memory <language> --stats       # Show TM statistics
/scr:translation-memory <language> --export      # Export TM as TMX format
/scr:translation-memory <language> --clear       # Clear TM for a language (with confirmation)
```

## Instruction

You are a **translation memory builder**. Your job is to extract aligned source-target segment pairs from completed translations and store them for reuse in future translation work.

---

### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `source_language` and `target_languages` from the `translation` section
- `.manuscript/OUTLINE.md` -- to know the unit order and identify source-target pairs

If no language argument is provided:

> **Which language?**
>
> Configured target languages: [list from config.json]
>
> Specify a language: `/scr:translation-memory <lang>`

Then **stop**.

---

### STEP 2: ROUTE BY MODE

| Flags | Mode |
|-------|------|
| No flags | Build mode (if no TM exists) or Stats mode (if TM exists) |
| `--build` | Build mode |
| `--stats` | Stats mode |
| `--export` | Export mode |
| `--clear` | Clear mode |

---

### MODE: BUILD (`--build` or default when no TM exists)

Build translation memory by aligning source segments with their translations.

**Step 1: Find completed translation pairs**

Scan `.manuscript/translation/{lang}/drafts/` for completed translation draft files. For each translated unit, find the corresponding source file in `.manuscript/drafts/body/`.

Only process units that have BOTH a source draft and a translated draft.

> **Found [count] translated units for [language].**

If no translated units exist:

> **No translations found for [language].** Translate some units first with `/scr:translate [lang]`, then build the TM.

Then **stop**.

**Step 2: Align segments**

For each source-target pair:

1. Read the source draft file
2. Read the translated draft file
3. Split both into segments at sentence boundaries:
   - Split on `.` `!` `?` followed by whitespace or newline
   - Preserve paragraph boundaries as segment breaks
   - Keep dialogue lines as individual segments
4. Align source segments with target segments:
   - Match by position within each paragraph (paragraph-level alignment first, then sentence-level)
   - If paragraph counts differ: use best-effort alignment, mark low-confidence segments
   - If sentence counts within a paragraph differ: align what matches, mark extras as low-confidence

Each aligned segment pair becomes a TM entry:

```json
{
  "source": "The chronoshifter hummed in Marcus's hands.",
  "target": "Le chronodecaleur vibrait dans les mains de Marcus.",
  "unit": "01-01",
  "confidence": 1.0,
  "created": "2026-04-07"
}
```

**Confidence scoring:**
- `1.0` -- Exact paragraph and sentence alignment, same position in both files
- `0.8` -- Paragraph aligned but sentence count differs slightly (1-2 sentences off)
- `0.5` -- Best-effort alignment, paragraph counts differ
- `0.3` -- Fuzzy alignment, significant structural differences between source and target

**Step 3: Deduplicate**

If building from scratch or rebuilding:
- Remove exact duplicate source segments (keep the highest confidence entry)
- If the same source text appears with different translations, keep both and flag for review

**Step 4: Write TM**

Create or update `.manuscript/translation/translation-memory.json`:

```json
{
  "version": "1.0",
  "source_language": "en",
  "last_built": "2026-04-07T12:00:00Z",
  "entries": {
    "fr": [
      {
        "source": "The chronoshifter hummed in Marcus's hands.",
        "target": "Le chronodecaleur vibrait dans les mains de Marcus.",
        "unit": "01-01",
        "confidence": 1.0,
        "created": "2026-04-07"
      }
    ],
    "ja": []
  }
}
```

**Structure:**
- Top-level `entries` object has one key per language code
- Each language contains an array of segment pairs
- Segments are ordered by unit (matching OUTLINE.md order)

Report:

> **Translation memory built for [language]:**
>
> - **Segments extracted:** [count]
> - **High confidence (1.0):** [count]
> - **Medium confidence (0.5-0.8):** [count]
> - **Low confidence (<0.5):** [count]
> - **Duplicates removed:** [count]
> - **Conflicts (same source, different target):** [count]
>
> The TM will be loaded into the translator agent's context for future translations.

---

### MODE: STATS (`--stats`)

Show translation memory statistics.

1. Read `.manuscript/translation/translation-memory.json`
2. If TM does not exist:

> **No translation memory found.** Build one with `/scr:translation-memory [lang] --build`

Then **stop**.

3. Calculate and display statistics:

> **Translation Memory Statistics**
>
> **Overall:**
> - Total segments: [count across all languages]
> - Languages: [list language codes]
> - Last built: [timestamp]
>
> **Per language:**
>
> | Language | Segments | High Conf | Med Conf | Low Conf | Units Covered |
> |----------|----------|-----------|----------|----------|---------------|
> | fr       | 1,247    | 1,100     | 120      | 27       | 24/24         |
> | ja       | 856      | 780       | 60       | 16       | 18/24         |
>
> **Coverage:**
> - [lang]: [covered units] / [total units] ([percentage]%)
>
> **Quality:**
> - Segments needing review (low confidence): [count]
> - Conflicting translations: [count]

---

### MODE: EXPORT (`--export`)

Export the translation memory as TMX (Translation Memory eXchange) format for use with external translation tools (SDL Trados, MemoQ, OmegaT, etc.).

1. Read `.manuscript/translation/translation-memory.json`
2. If TM does not exist:

> **No translation memory to export.** Build one first with `/scr:translation-memory [lang] --build`

Then **stop**.

3. Generate TMX XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE tmx SYSTEM "tmx14.dtd">
<tmx version="1.4">
  <header
    creationtool="Scriveno"
    creationtoolversion="0.3.0"
    datatype="plaintext"
    segtype="sentence"
    adminlang="en"
    srclang="[source_language]"
    o-tmf="Scriveno TM"
  />
  <body>
    <tu>
      <tuv xml:lang="[source_language]">
        <seg>[source segment]</seg>
      </tuv>
      <tuv xml:lang="[target_language]">
        <seg>[target segment]</seg>
      </tuv>
    </tu>
  </body>
</tmx>
```

Write to `.manuscript/translation/translation-memory-{lang}.tmx`.

> **TM exported:** `.manuscript/translation/translation-memory-[lang].tmx`
> - [count] translation units exported
> - Format: TMX 1.4 (compatible with SDL Trados, MemoQ, OmegaT, and other CAT tools)

---

### MODE: CLEAR (`--clear`)

Clear translation memory for a specific language. This is destructive -- requires confirmation.

1. Read `.manuscript/translation/translation-memory.json`
2. Check if TM has entries for the specified language
3. If no entries:

> **No TM entries for [language].** Nothing to clear.

Then **stop**.

4. Show what will be cleared:

> **WARNING: This will permanently delete [count] TM segments for [language].**
>
> This action cannot be undone. The TM for other languages will not be affected.
>
> **Confirm:** Type "clear [lang] TM" to proceed, or anything else to cancel.

5. On confirmation:
   - Remove the language's entries from the `entries` object
   - Write the updated TM file
   - Confirm:

> **Cleared [count] TM segments for [language].**
>
> To rebuild: `/scr:translation-memory [lang] --build`

## How the translate command uses TM

When `/scr:translate` invokes the translator agent for each unit:

1. The translate command reads `translation-memory.json`
2. It extracts segments whose source text appears in (or closely matches) the current unit's source text
3. These relevant segments are loaded into the translator agent's context as "Translation memory excerpt"
4. The translator agent reuses high-confidence matches and adapts partial matches
5. This ensures terminology and phrasing consistency across the manuscript, especially for recurring descriptions, dialogue tags, and narrative patterns

## Anti-patterns

- **NEVER** build TM from untranslated units -- only use completed, reviewed translations
- **NEVER** delete the TM file directly -- use `--clear` for safe removal with confirmation
- **NEVER** include low-confidence segments without marking them -- the translator needs to know what to trust
- **NEVER** overwrite prior translation entries silently -- deduplicate and flag conflicts

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
