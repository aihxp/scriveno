# Sacred Text Guide

Scriveno adapts its entire workflow for sacred, historical, and mythological writing. When you choose a sacred work type, every command, every structural label, and every voice setting shifts to use tradition-native vocabulary. Novels use "chapters" -- but Quranic commentary uses "surahs," Torah scholarship uses "parashot," and Vedic texts use "suktas." This is not cosmetic. The vocabulary shapes how the AI agent thinks about your text, producing drafts that respect the traditions they come from.

This guide covers everything specific to sacred writing in Scriveno: the 15 sacred work types, 10 voice registers, sacred-exclusive commands, command adaptations, sacred translation, and tradition-aware front and back matter.

## Sacred Work Types

Scriveno supports 15 work types in the sacred group, spanning six traditions and several cross-tradition categories. Each work type defines its own structural hierarchy -- the levels at which your text is organized -- and its own command unit, the level at which you discuss, plan, draft, and review.

### Scripture Types

| Work Type | Label | Hierarchy (Top / Mid / Atomic) | Command Unit | Tradition |
|-----------|-------|-------------------------------|--------------|-----------|
| `scripture_biblical` | Scripture (Biblical) | testament / book / verse | book | Christian Bible, Apocrypha |
| `scripture_quranic` | Scripture (Quranic) | -- / surah / ayah | surah | Quran, Hadith collections |
| `scripture_torah` | Scripture (Torah) | chumash / parashah / pasuk | parashah | Torah, Talmud, Mishnah |
| `scripture_vedic` | Scripture (Vedic) | veda / mandala / sukta | mandala | Rigveda, Upanishads, Bhagavad Gita |
| `scripture_buddhist` | Scripture (Buddhist) | pitaka / nikaya / sutta | sutta | Pali Canon, Mahayana sutras |
| `scripture_generic` | Scripture (Generic) | testament / book / verse | book | Any tradition not listed above |

**Config defaults:** Some scripture types include tradition-specific configuration defaults. Biblical and Torah types use Masoretic verse numbering. Quranic types use Hafs verse numbering and the Hijri calendar. Torah types use the Hebrew calendar. Vedic types use Vikram Samvat. Buddhist types use the Buddhist Era calendar.

## Tradition Profiles and Config

Sacred projects use a top-level `tradition` key in `.manuscript/config.json`. That key points to one of the shipped profile directories under `templates/sacred/`:

- `catholic`
- `orthodox`
- `tewahedo`
- `protestant`
- `jewish`
- `islamic-hafs`
- `islamic-warsh`
- `pali`
- `tibetan`
- `sanskrit`

New projects also store sacred profile settings as top-level config keys, including `verse_numbering_system`, `calendar_system`, `translation_philosophy`, `canonical_alignment`, `annotation_traditions`, `doctrinal_framework`, `preserve_source_terms`, and `transliteration_style`. Older projects that still have a nested `sacred` object are accepted as legacy input by commands that read those values, but new projects use the top-level shape.

Tradition-aware commands load `templates/sacred/{tradition}/manifest.yaml` for book order, script direction, numbering formats, font stack, and approval-block guidance. Build commands use that manifest to set language/script metadata and warn when the selected tradition expects an approval block before publication.

### Sacred Prose Types

| Work Type | Label | Hierarchy (Top / Mid / Atomic) | Command Unit | Use For |
|-----------|-------|-------------------------------|--------------|---------|
| `commentary` | Commentary / Exegesis | -- / section / annotation_block | section | Tafsir, Midrash, biblical commentary, philosophical exegesis |
| `devotional` | Devotional | -- / theme / entry | entry | Daily devotionals, prayer journals, spiritual meditations |
| `liturgical` | Liturgical Text | rite / section / rubric | section | Liturgies, prayer books, ritual texts, service orders |
| `sermon` | Sermon / Homily | -- / movement / beat | sermon | Individual sermons, homilies, khutbahs |
| `homiletic_collection` | Homiletic Collection | liturgical_year / -- / sermon | sermon | Sermon cycles, collected homilies organized by liturgical calendar |
| `religious_epic` | Religious Epic | book / canto / verse | canto | Paradise Lost, Mahabharata, Divine Comedy, Shahnameh |

### Historical and Mythological Types

| Work Type | Label | Hierarchy (Top / Mid / Atomic) | Command Unit | Use For |
|-----------|-------|-------------------------------|--------------|---------|
| `historical_chronicle` | Historical Chronicle | era / chapter / event | chapter | Annals, dynastic histories, chronicles |
| `historical_account` | Historical Account | part / chapter / scene | chapter | Narrative histories, biographical accounts |
| `mythological_collection` | Mythological Collection | cycle / -- / tale | tale | Norse Eddas, Greek myth compilations, folklore anthologies |

## Tradition-Native Vocabulary

When you create a project with `/scr:new-work` and select a sacred work type, Scriveno renames structural units throughout the entire system. This means every command you run uses the vocabulary of your tradition, not generic publishing terms.

Here is how vocabulary flows for each scripture type:

- **Biblical:** You discuss, plan, and draft **books** (command unit). Your text is organized into **testaments** at the top level and **verses** at the atomic level.
- **Quranic:** You discuss, plan, and draft **surahs**. The atomic unit is the **ayah**. There is no top-level grouping -- surahs stand alone.
- **Torah:** You discuss, plan, and draft **parashot** (singular: parashah). The top level is the **chumash** (the five books). The atomic unit is the **pasuk**.
- **Vedic:** You discuss, plan, and draft **mandalas**. The top level is the **veda**. The atomic unit is the **sukta** (hymn).
- **Buddhist:** You discuss, plan, and draft **suttas** (or sutras). The top level is the **pitaka** (basket). The mid level is the **nikaya** (collection).
- **Generic:** Uses the default testament / book / verse hierarchy for traditions not specifically configured.

This vocabulary carries through every command automatically. When you run `/scr:draft`, you are drafting a surah, a parashah, or a sutta -- not a "chapter." When you run `/scr:plan`, you are planning a mandala or a canto. The AI agent receives these tradition-native labels and adjusts its approach accordingly.

Non-scripture sacred types use vocabulary appropriate to their form: a `liturgical` text is organized into **rites** containing **sections** and **rubrics**. A `religious_epic` uses **books**, **cantos**, and **verses**. A `mythological_collection` uses **cycles** and **tales**.

## Voice Registers

Sacred texts use voice registers instead of a single narrative voice. A register is a mode of sacred speech -- the difference between a prophet's urgent declarations and a sage's measured observations. Scriveno defines 10 registers, each with distinct characteristics. You set the register per unit in the plan file, and the drafter agent writes in that register.

Your STYLE-GUIDE.md has a "Sacred voice registers" section where you customize how YOUR writing handles each register. The register descriptions below are defaults -- your STYLE-GUIDE.md always takes precedence, because the goal is your voice in that register, not a generic version.

### Prophetic-Oracular

Urgent, declarative, oracular. Short sentences, imperative mood, "Thus says the Lord" framing. Direct address to the audience. Present and future tense dominance. Repetition for emphasis ("Woe, woe, woe"). Exclamatory. No hedging. The prophet speaks with certainty because they speak on behalf of the divine.

**When to use:** Prophetic books, oracles, divine pronouncements, apocalyptic warnings. Any passage where a figure speaks with absolute authority on behalf of a higher power.

### Wisdom-Didactic

Aphoristic, reflective, balanced. Parallelism -- antithetical, synonymous, synthetic. Comparative structure ("Better X than Y"). Observational tone. Third person often. Conditional constructions ("If you...then"). Measured cadence. The sage observes the world and distills truths.

**When to use:** Proverbs, wisdom literature, philosophical passages, didactic sections. When the text teaches through observation and comparison rather than narrative.

### Legal-Prescriptive

Precise, conditional, imperative. Case-law structure ("If a man does X, then Y"). Categorical. Exhaustive enumeration. No ambiguity tolerated. Present tense. Second person direct address for commandments ("You shall / You shall not"). Every word carries binding weight.

**When to use:** Legal codes, commandments, halakhic rulings, fiqh, monastic rules, canonical law. Any passage that prescribes behavior with binding authority.

### Liturgical-Devotional

Formal, rhythmic, responsive. Call-and-response patterns. Doxological language (praise, blessing, thanksgiving). Repetitive refrains. Elevated vocabulary. Present tense. Address to the divine or congregation. Musical awareness -- these words are meant to be spoken aloud or sung.

**When to use:** Prayers, blessings, liturgical services, doxologies, invocations. Any text designed for corporate worship or personal devotion where rhythm and elevation matter.

### Narrative-Historical

Chronicle-like, temporal, factual. Sequential narration ("And it came to pass"). Genealogical asides. Geographic precision. Past tense. Third person. Minimal editorializing. Wayyiqtol-style consecutive narration rhythm. The narrator records what happened, not what should have happened.

**When to use:** Historical books, chronicles, hagiographies, narrative sections of scripture. The default register when none is specified -- most sacred texts contain significant narrative.

### Apocalyptic-Visionary

Visionary, symbolic, cosmic. "I saw..." framing. Numbers as symbols (7, 12, 40). Animal imagery. Throne-room scenes. Cosmic battle. Dream logic. Urgency. Future tense and prophetic perfect. Interpreting angel as guide. Reality bends -- the visionary describes what lies beyond ordinary perception.

**When to use:** Apocalyptic literature (Revelation, Daniel), visionary accounts, mystical visions, eschatological passages. Any text where the writer describes transcendent reality through symbolic imagery.

### Epistolary

Personal, didactic, pastoral. Greeting formula. "Dear brothers/sisters" address. Practical instruction. Theological argument. Exhortation. Closing benediction. Mix of personal warmth and doctrinal authority. The writer knows their audience and writes to their specific situation.

**When to use:** Letters, epistles, encyclicals, pastoral communications. Any sacred text structured as correspondence from an authority figure to a community.

### Poetic-Hymnic

Musical, metaphorical, parallelism-heavy. Hebrew parallelism patterns (synonymous, antithetical, synthetic, climactic). Nature imagery. Emotional range (lament, praise, thanksgiving, royal, penitential). Selah markers. Acrostic potential. Chiastic structures. Address to God and self ("O my soul"). Raw emotion given artistic form.

**When to use:** Psalms, hymns, canticles, religious poetry, song lyrics for worship. Any passage where emotion is expressed through poetic form and musical structure.

### Parabolic

Story-within-story, allegorical. "The kingdom of heaven is like..." framing. Concrete imagery from daily life (seeds, sheep, merchants, vineyards). Surprising twist that overturns expectations. Open-ended or with explicit moral. Accessible surface, deep meaning. The parable teaches through indirection -- the listener must do the interpretive work.

**When to use:** Parables, allegories, teaching stories, Zen koans, Sufi tales. Any embedded narrative designed to teach a spiritual truth through analogy.

### Contemplative-Mystical

The didactic register adapted for systematic teaching. Instructional, systematic, expository. Topic-by-topic structure. Definition and explanation. Q&A format possible. Teacher-student dynamic. Building from simple to complex. Summary and application. Catechetical structure. The teacher organizes knowledge for transmission.

**When to use:** Catechisms, systematic theologies, doctrinal instruction, dharma talks. Any passage that teaches through organized, progressive exposition rather than story or poetry.

## Sacred-Exclusive Commands

These 8 commands are only available when your work type belongs to the sacred group. They appear in the command list automatically when you create a sacred project and are hidden for all other work types.

### `/scr:sacred:concordance`

Build or search a concordance of key terms, names, and phrases across your sacred text. Tracks every occurrence of significant terms to enable cross-referencing and intertextual study. Run with `--build` to generate a full concordance from your drafted text, or `--search <term>` to find all occurrences of a specific term.

**Requires:** At least one drafted unit.

### `/scr:sacred:cross-reference`

Map connections between passages within your text or between your text and other sacred sources. Identifies parallel passages, quotations, allusions, and thematic echoes. Essential for commentary and exegetical work where intertextuality is central.

**Requires:** At least one drafted unit.

### `/scr:sacred:genealogy`

Build and visualize genealogical trees and lineage relationships from your FIGURES.md file. For biblical genealogies, Quranic lineages, mythological family trees, or any sacred text where figures are connected by descent, marriage, or spiritual succession.

**Requires:** FIGURES.md with at least 2 figures.

### `/scr:sacred:chronology`

Construct a timeline of events across your sacred text. Handles multiple calendar systems (Gregorian, Hijri, Hebrew, Vikram Samvat, Buddhist Era) and can cross-reference events with external historical timelines. Unlike the standard `/scr:timeline` command, this is designed for texts spanning centuries or millennia.

**No prerequisites** -- can be started at any point.

### `/scr:sacred:annotation-layer`

Add scholarly annotations, footnotes, and commentary layers to your drafted text. Supports multiple annotation layers (textual, historical, theological, linguistic) that can be toggled independently in the exported output.

**Requires:** At least one drafted unit.

### `/scr:sacred:verse-numbering`

Apply or adjust verse numbering systems to your drafted text. Supports tradition-specific systems (Masoretic for Hebrew Bible, Hafs for Quran, etc.) and can convert between systems. Ensures your verse references match the numbering expected by your tradition.

**Requires:** At least one drafted unit.

The top-level `/scr:sacred-numbering-format` compatibility command is read-only: it shows the active tradition's numbering format and can render example citations. The nested `/scr:sacred:verse-numbering` command changes or verifies the project's numbering system.

### `/scr:sacred:source-tracking`

Track and document the source traditions, manuscripts, and textual variants underlying your sacred text. For critical editions, translation projects, and any work that draws from multiple source texts.

**No prerequisites** -- can be started at any point.

### `/scr:sacred:doctrinal-check`

Verify that your drafted text is consistent with the doctrines recorded in your DOCTRINES.md file. Flags any assertions, implications, or narrative choices that might contradict your established doctrinal framework.

**Requires:** At least one drafted unit and DOCTRINES.md.

## Command Adaptations

When you are working on a sacred work type, selected review commands pick up tradition-appropriate labels in help and output. You still invoke the canonical file-backed command unless your runtime explicitly installs an alias.

| Standard Command | Sacred Label | Why |
|-----------------|---------------|-----|
| `/scr:sensitivity-review` | `interfaith-review` | Review for **interfaith** sensitivity, not general sensitivity |
| `/scr:editor-review` | `scholarly-review` | Sacred texts undergo **scholarly** review |
| `/scr:voice-check` | `register-check` | Checking **register** consistency, not character voice |
| `/scr:beta-reader` | `theological-review` | Review by a **theological** perspective, not a casual reader |

Sacred-specific workflows like chronology, doctrinal review, and verse numbering are exposed through the dedicated `/scr:sacred:*` command family instead of by relabeling hidden base commands.

## Sacred Translation

Sacred translation is the most demanding form of translation work. Terms carry centuries of theological weight, registers must survive the crossing between languages, and readers have strong expectations about how canonical texts sound.

Scriveno's translation pipeline (accessed via `/scr:translate`) enters **sacred mode** when the work type is in the sacred group. Sacred mode adds several capabilities beyond standard translation:

### Translation Philosophy

You choose your translation approach per project:

- **Formal equivalence** -- Word-for-word as much as possible. Preserves source language syntax. Footnotes idiomatic expressions. Best for academic audiences who want precision.
- **Dynamic equivalence** -- Thought-for-thought. Natural target language expression. Preserves meaning, not form. Best for general audiences who want clarity.
- **Paraphrase** -- Free rendering for modern accessibility. Simplifies complex theology. Conversational tone. Best for new readers.
- **Interlinear** -- Source word, transliteration, gloss, and target word for each element. A scholarly tool, not readable prose.

### Canonical Alignment

When set (e.g., KJV, NRSV, Sahih International), the translator matches the vocabulary and phrasing of the specified canonical translation. Readers familiar with "lovingkindness" (KJV) or "steadfast love" (NRSV) will encounter the language they expect.

### Preserved Source Terms

Certain terms are never translated. They appear in the source language (with transliteration if non-Latin script) and are footnoted on first occurrence. Examples: YHWH, hesed, shalom, dharma, sutra, logos, ruach, taqwa.

### Liturgical Preservation

When enabled, the translator preserves the rhythmic and musical qualities of liturgical passages -- maintaining parallelism, meter, cadence, antiphonal structures, and chiastic patterns even at the cost of literal accuracy. These texts are meant to be read aloud or chanted.

### Register-Aware Translation

Each of the 10 voice registers has established conventions in major translation traditions. The translator preserves the specific register (prophetic, wisdom, legal, liturgical, etc.) in the target language, so a prophetic oracle sounds prophetic in French or Arabic, not merely translated.

For full translation pipeline details including glossary management, translation memory, and multi-language export, see the Translation Guide when available, or use `/scr:translate --help`.

## Tradition-Aware Front and Back Matter

Sacred texts need front and back matter that respects their tradition. The standard `/scr:front-matter` and `/scr:back-matter` commands enter **sacred behavior mode** when the work type is in the sacred group.

### Front Matter

Sacred front matter can include:

- **Invocations** -- Bismillah for Quranic texts, "In the Name of the Father" for Christian liturgical texts, Om for Vedic texts
- **Dedication** -- Traditional dedications appropriate to the tradition
- **Preface** -- Context for the work, including textual tradition, source manuscripts, and translation philosophy
- **Introduction** -- Historical and theological context
- **Guide to use** -- How to read and study the text, including any special notation or apparatus
- **List of abbreviations** -- Sources, manuscripts, and reference works cited
- **Maps and timelines** -- Geographic and chronological context

### Back Matter

Sacred back matter can include:

- **Glossary** -- Key terms with definitions in the tradition's vocabulary
- **Concordance** -- Cross-referenced index of terms (generated by `/scr:sacred:concordance`)
- **Bibliography** -- Source texts, commentaries, and reference works
- **Scriptural index** -- References to other sacred texts cited or alluded to
- **Subject index** -- Topical index
- **Colophon** -- Scribal tradition, publication notes
- **Benediction** -- Closing blessing or prayer appropriate to the tradition
- **Appendices** -- Textual variants, manuscript notes, supplementary material

## Getting Started with Sacred Writing

Here is a quick walkthrough for starting a sacred writing project:

1. **Create your project.** Run `/scr:new-work` and select a sacred work type. For example, choose `commentary` for a Quranic tafsir, `scripture_biblical` for a new translation, or `mythological_collection` for a retelling of Norse myths.

   The generated config stores `tradition` and the sacred profile fields at the top level. If you already know the tradition profile you want, choose one of the shipped slugs listed above.

2. **Set up your voice.** Run `/scr:profile-writer` to generate your STYLE-GUIDE.md. Pay special attention to the "Sacred voice registers" section at the bottom -- this is where you customize how YOUR writing voice handles each register. A prophetic passage in your voice should sound different from a prophetic passage in someone else's.

3. **Explore and plan.** Use `/scr:discuss` (it adapts automatically to your sacred work type) to shape your first unit. Discuss the theological themes, source traditions, and structural approach you want to take.

4. **Draft.** Run `/scr:draft`. In sacred projects, Scriveno frames the work in the right unit terminology (surah, parashah, sutta, and so on) while the drafter writes in the register specified in your plan file, using your voice as defined in STYLE-GUIDE.md.

5. **Review.** Use `/scr:editor-review` for expert review, `/scr:sacred:doctrinal-check` to verify consistency with your DOCTRINES.md, and `/scr:voice-check` for sacred register fidelity.

6. **Build your apparatus.** As you draft, use `/scr:sacred:concordance` to build cross-references, `/scr:sacred:chronology` for timelines, `/scr:sacred:genealogy` for lineage trees, and `/scr:sacred:annotation-layer` for scholarly footnotes.

## See Also

- [Getting Started](getting-started.md) -- Install Scriveno and create your first project
- [Command Reference](command-reference.md) -- Full reference for all 116 commands, including the [Sacred Exclusive](command-reference.md#sacred-exclusive) section
- [README](../README.md) -- Project overview and feature list
