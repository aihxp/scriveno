# Translation Guide

Scriveno translates your manuscript into any language while preserving your voice. The translation pipeline handles glossary management, translation memory, cultural adaptation, quality verification, and multi-language publishing -- from setup to finished translated editions.

This guide covers the full pipeline: choosing a translation engine, translating your manuscript, managing terminology, verifying quality, and publishing in multiple languages.

## Translation Engines

Scriveno uses three translation approaches, each suited to different languages and content types.

**DeepL** -- Primary engine for European languages. Higher quality than alternatives for English, French, German, Spanish, Italian, Portuguese, Dutch, Polish, Japanese, Chinese, and Korean. GDPR-compliant -- your content is not stored or used for training.

**Google Cloud Translation** -- Broad language coverage with 130+ languages. Required for Arabic, Hebrew, Hindi, Swahili, and other languages DeepL does not cover. Best choice for RTL scripts and languages with limited DeepL support.

**AI Agent (Claude/GPT)** -- The AI agent itself handles literary nuance, sacred text translation, and cultural adaptation that machine translation APIs miss. It applies your voice profile, maintains glossary compliance, and can do formal/dynamic equivalence translation. This is Scriveno's default for literary content -- every unit is translated by the translator agent with your STYLE-GUIDE.md loaded.

The translator agent works unit by unit in fresh context (just like the drafter), ensuring consistent quality and glossary compliance across the entire manuscript.

## Getting Started with Translation

### Step 1: Add a Target Language

Configure the language you want to translate into:

```
/scr:translate --add-language fr
```

This adds French to your project's target languages in `.manuscript/config.json`. You can add as many languages as you need.

Check your configured languages anytime:

```
/scr:translate --languages
```

### Step 2: Create a Glossary

Before translating, set up a glossary for consistent terminology:

```
/scr:translation-glossary fr
```

Scriveno scans your manuscript for character names, place names, invented terms, titles, recurring phrases, and cultural references, then generates suggested translations. Review and edit the glossary before starting translation -- the translator agent treats glossary entries as law.

### Step 3: Translate

Translate your manuscript:

```
/scr:translate fr
```

Scriveno translates one atomic unit at a time (scene, chapter, passage), each in fresh context with your STYLE-GUIDE.md, glossary, and translation memory loaded. You see progress per unit:

```
Translated chapter 1, scene 1: 1,247 -> 1,389 words (1.11x)
Translated chapter 1, scene 2: 980 -> 1,102 words (1.12x)
```

To translate all configured languages:

```
/scr:translate --all
```

To resume from a specific unit (after interruption or revision):

```
/scr:translate fr --from chapter-3-scene-1
```

### Step 4: Verify Quality

Run back-translation to check for meaning drift:

```
/scr:back-translate fr
```

This translates the French text back to English and shows a side-by-side comparison with drift annotations. See the [Quality Verification](#quality-verification) section for details.

## Glossary Management

Glossaries ensure that character names, place names, and invented terms are translated consistently throughout the manuscript. The translator agent checks the glossary for every unit -- inconsistent terminology across a translated manuscript destroys reader trust.

Glossaries are stored as readable markdown tables at `.manuscript/translation/GLOSSARY-{lang}.md`.

### Creating a Glossary

```
/scr:translation-glossary fr
```

Scriveno extracts terms from your manuscript and generates an initial glossary with suggested translations. Terms are organized by category:

| Category | What It Covers |
|----------|---------------|
| `character_name` | Character names, nicknames, aliases |
| `place_name` | Locations, realms, geographical features |
| `invented_term` | Made-up words, neologisms, world-specific vocabulary |
| `title_honorific` | Titles, ranks, forms of address |
| `recurring_phrase` | Phrases that appear multiple times with specific meaning |
| `cultural_reference` | Setting-specific cultural elements |
| `brand_name` | Proper nouns, organization names |

### Name Handling

How character names are handled depends on your `name_handling` setting in `.manuscript/config.json`:

- **`keep_original`** -- Names stay in their original form. Transliterations are added in parentheses on first occurrence if the target language uses a different script.
- **`transliterate`** -- Names are transliterated into the target language's script (e.g., Marcus becomes in Japanese).
- **`localize`** -- Names are given culturally equivalent forms (e.g., John becomes Jean in French).

### Adding and Editing Terms

Add a single term:

```
/scr:translation-glossary fr --add "chronoshifter" --translation "chronodecaleur" --category invented_term
```

Bulk import terms:

```
/scr:translation-glossary fr --import
```

Review the glossary for missing terms and inconsistencies:

```
/scr:translation-glossary fr --review
```

The review mode scans your manuscript for terms that should be in the glossary but are not, and flags potential inconsistencies like similar terms that might confuse the translator.

## Translation Memory

Translation memory (TM) stores aligned source-target segment pairs from completed translations. When the translator agent works on a new unit, relevant TM segments are loaded into its context so it can reuse approved translations for recurring descriptions, dialogue tags, and narrative patterns.

The TM is stored at `.manuscript/translation/translation-memory.json`.

### When Translation Memory Matters

- **Sacred texts** -- Canonical terms and liturgical phrases must be translated identically every time
- **Series** -- Character names, place names, and invented terms need consistency across volumes
- **Technical writing** -- Terminology consistency is essential for clarity

### Building Translation Memory

After completing a translation, build the TM from your approved translations:

```
/scr:translation-memory fr --build
```

Scriveno aligns source and target segments at the paragraph and sentence level, assigns confidence scores (1.0 for exact alignment, down to 0.3 for fuzzy matches), and deduplicates.

### Translation Memory Commands

```
/scr:translation-memory fr              # Show stats (or build if none exists)
/scr:translation-memory fr --build      # Build/rebuild from completed translations
/scr:translation-memory fr --stats      # Show segment counts and coverage
/scr:translation-memory fr --export     # Export as TMX for external CAT tools
/scr:translation-memory fr --clear      # Clear TM for a language (with confirmation)
```

The TMX export produces industry-standard Translation Memory eXchange format compatible with SDL Trados, MemoQ, OmegaT, and other computer-assisted translation tools.

## Cultural Adaptation

Machine translation handles words. Cultural adaptation handles meaning. Scriveno flags culturally sensitive content that needs human attention beyond what translation APIs catch.

```
/scr:cultural-adaptation fr
```

The cultural adaptation review scans your translated text across 9 categories:

| Category | Severity | Examples |
|----------|----------|---------|
| **Idiom** | High | "Break a leg" translated literally instead of using a target-language equivalent |
| **Humor** | High | Jokes relying on source-language wordplay or cultural knowledge |
| **Politeness** | High | Wrong T-V distinction (tu/vous), inappropriate honorific levels |
| **Custom** | Medium | Holidays, greeting conventions, dining etiquette |
| **Measurement** | Medium | Imperial units preserved without metric conversion |
| **Currency** | Medium | Dollar amounts without localization context |
| **Name order** | Medium | Family name first/last conventions (important for Japanese, Chinese, Korean, Hungarian) |
| **Food** | Low | Cultural food references (Thanksgiving turkey, fish and chips) |
| **Punctuation** | Low | Quotation mark style, decimal separators, spacing conventions |

Filter by severity or scope to a specific unit:

```
/scr:cultural-adaptation fr --severity high
/scr:cultural-adaptation fr --unit chapter-2-scene-1
/scr:cultural-adaptation fr --report
```

The `--report` flag generates a standalone report at `.manuscript/translation/{lang}/CULTURAL-ADAPTATION-REPORT.md`.

## Quality Verification

Back-translation is the primary quality verification tool. It translates the translated text back to the source language and shows a side-by-side comparison with drift annotations.

```
/scr:back-translate fr
```

### How It Works

1. Scriveno reads the translated text (without looking at the original)
2. Translates it back to the source language
3. Compares the back-translation with the original
4. Annotates each segment with a drift marker

### Drift Markers

| Marker | Meaning |
|--------|---------|
| **[OK]** | Meaning preserved -- wording may differ but intent is the same |
| **[DRIFT: meaning shift]** | Factual content, intent, or implication changed |
| **[DRIFT: tone shift]** | Emotional register changed (more formal, less urgent, different mood) |
| **[DRIFT: omission]** | Something from the original is missing |
| **[DRIFT: addition]** | Something not in the original was added |

### Fidelity Assessment

- **90%+ OK** -- Excellent fidelity. Minor drifts are expected and acceptable.
- **75-89% OK** -- Good fidelity with notable drift areas. Review flagged segments.
- **Below 75% OK** -- Significant drift. Consider re-translating problem units.

Scope to a specific unit or generate a full report:

```
/scr:back-translate fr --unit chapter-3
/scr:back-translate fr --report
```

## RTL and CJK Support

Scriveno handles right-to-left and CJK (Chinese, Japanese, Korean) scripts throughout the pipeline.

### Right-to-Left Languages

RTL languages (Arabic, Hebrew, Persian, Urdu) receive special handling:

- **Text direction** -- Export commands automatically set `--variable dir=rtl` for Pandoc and `text-dir` for Typst
- **Template adjustments** -- The Typst book template reverses inside/outside margins for RTL binding
- **Font requirements** -- RTL exports need fonts with Arabic/Hebrew glyph support. Scriveno uses system-available fonts by default; specify custom fonts in `.manuscript/config.json`
- **Punctuation** -- Quotation marks use the appropriate convention (e.g., French-style guillemets for Arabic)

### CJK Languages

CJK languages (Chinese, Japanese, Korean) receive:

- **Line breaking** -- CJK-aware line breaking rules (no break within words, proper kinsoku shori for Japanese)
- **Font handling** -- CJK exports use appropriate CJK fonts with correct glyph coverage
- **Spacing** -- No inter-word spaces (CJK convention), proper spacing between CJK and Latin characters
- **Quotation marks** -- Corner brackets are used by default

### Script Detection

Scriveno auto-detects script direction from the language code:

- **RTL:** `ar`, `he`, `fa`, `ur`, `yi`, `ps`, `sd`
- **CJK:** `zh`, `ja`, `ko`
- **LTR:** All other languages

No manual configuration needed -- the translation and export commands apply the correct settings automatically.

## Multi-Language Publishing

After translating, export your manuscript in all target languages and formats:

```
/scr:multi-publish --languages fr,de,ja --format epub
```

Multi-publish handles everything needed for translated editions:

- **Localized front matter** -- Translated title page, copyright page (with translation credit), dedication, and table of contents
- **Localized back matter** -- Translated author bio, acknowledgments, and auto-generated translator's note
- **Language-specific formatting** -- Correct quotation marks, punctuation spacing, number formatting, and text direction
- **Per-language output** -- Each language gets its own directory: `.manuscript/output/translations/{lang}/`

### Multi-Publish Options

```
/scr:multi-publish --languages fr,de       # Specific languages, interactive format selection
/scr:multi-publish --all-languages          # All configured languages
/scr:multi-publish --format pdf             # Specific format for all languages
/scr:multi-publish --all-languages --all-formats  # Everything
```

For KDP or IngramSpark packages in translated editions, multi-publish creates language-specific packages with translated metadata and localized cover specifications.

## Autopilot Translation

For hands-off translation of one or more languages, autopilot runs the complete 6-phase pipeline without asking questions:

```
/scr:autopilot-translate --languages fr,de,ja
```

The autopilot pipeline per language:

1. **Glossary** -- Creates the glossary if it doesn't exist
2. **Translate** -- Translates all units with fresh-context-per-unit
3. **Translation Memory** -- Builds TM from completed translations
4. **Cultural Adaptation** -- Flags culturally sensitive content
5. **Back-Translate** -- Runs back-translation quality verification
6. **Multi-Publish** -- Exports in all available formats

### Autopilot Options

```
/scr:autopilot-translate --all-languages       # Translate all configured languages
/scr:autopilot-translate --languages ar --skip-publish   # Translate without exporting
/scr:autopilot-translate --languages fr --skip-adaptation  # Skip cultural adaptation
/scr:autopilot-translate --resume              # Resume interrupted pipeline
```

Autopilot tracks progress in STATE.md so you can resume where you left off after interruption. Each language is independent -- if Arabic completed phases 1-3 and French completed 1-5, resuming picks up each language at its next phase.

## Sacred Text Translation

Sacred texts receive special translation handling with additional controls for theological precision:

- **Translation philosophy** -- Choose between formal equivalence (word-for-word), dynamic equivalence (thought-for-thought), paraphrase (modern accessibility), or interlinear (scholarly word-by-word alignment)
- **Canonical alignment** -- Match vocabulary to a canonical translation (KJV, NRSV, Sahih International, etc.)
- **Preserved source terms** -- Terms like YHWH, hesed, dharma, or taqwa are never translated -- they appear in the source language with transliteration and footnotes
- **Liturgical preservation** -- Maintains rhythmic and musical qualities for passages meant to be read aloud or chanted

Configure sacred translation settings as top-level keys in `.manuscript/config.json`. The most relevant keys are `tradition`, `translation_philosophy`, `canonical_alignment`, `preserve_source_terms`, and `transliteration_style`. Existing projects with a nested `sacred` object are still accepted as legacy input, but new projects use the top-level shape. For full details on sacred text work types, voice registers, and exclusive commands, see the Sacred Text Guide.

## See Also

- [Getting Started](getting-started.md) -- Installation and first project
- [Command Reference](command-reference.md) -- Full list of translation commands
- [Publishing Guide](publishing.md) -- Exporting and publishing your manuscript
