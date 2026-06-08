# Work Types Guide

Scriveno adapts itself to what you're writing. When you run `/scr:new-work` and tell Scriveno you're writing a novel, a screenplay, a runbook, a Quran commentary, or a research paper, it changes its vocabulary, commands, file names, and available features to match your tradition. A novel has chapters and scenes. A screenplay has acts and sequences. A runbook has procedures and steps. A Quranic text has surahs and ayahs. You never have to force your work into someone else's structure.

This guide covers all 50 work types Scriveno supports, organized into 9 groups.

## How Work Types Adapt Scriveno

When you set a work type (via `/scr:new-work --type <work_type>` or during onboarding), Scriveno adapts in four ways:

### 1. Hierarchy vocabulary

Every work type defines a three-level structural hierarchy: **top level**, **mid level**, and **atomic unit**. A novel's hierarchy is part > chapter > scene. A screenplay's is act > sequence > scene. A Torah project's is chumash > parashah > pasuk. Scriveno uses these terms everywhere -- in commands, outlines, progress reports, and file names.

### 2. Command terminology

Scriveno adapts the vocabulary around a command to match your domain. `/scr:draft` talks about drafting a surah for Quranic work, an act for screenplays, a section for research papers, and a procedure for runbooks. Some commands also get domain-specific labels in help and output when that base command is available for the current group -- for example, `voice-check` is presented as `register-check` for sacred work types, and `plot-graph` is presented as `procedure-map` for technical work. See the [Command Adaptations](#command-adaptations) section below.

### 3. File names

Context files rename per group. The default `CHARACTERS.md` becomes `FIGURES.md` for sacred work types, `CONCEPTS.md` for academic work, and `AUDIENCE.md` for technical writing. `PLOT-GRAPH.md` becomes `THEOLOGICAL-ARC.md` for sacred, `ARGUMENT-MAP.md` for academic, and `PROCEDURES.md` for technical work. See [File Adaptations](#file-adaptations) below.

### 4. Available commands

Not every command makes sense for every work type. Poetry collections don't need `/scr:subplot-map`. Academic papers don't need `/scr:dialogue-audit`. Runbooks don't need query-package exports. Scriveno hides irrelevant commands and shows only what applies to your work type. Sacred work types get 8 nested exclusive commands (concordance, cross-reference, genealogy, etc.) that don't appear for other groups, plus the flat `/scr:sacred-numbering-format` helper for active numbering display.

### 5. Craft surfaces (the applicability decision tree)

The same principle governs which context surfaces a work type carries, recorded in `surface_applicability` in CONSTRAINTS.json as `required`, `optional`, or `not_applicable` per group (with per-work-type overrides). A novel requires characters, world, plot, and themes; a poem carries only a brief and themes; an article gets characters and plot as optional and no world at all. The derived craft maps follow the same gating: `RELATIONSHIPS.md` (a complete pairwise relationship matrix) and `CONFLICTS.md` (central plus pairwise conflict, with `no conflict` recorded explicitly) are generated only where characters and conflict apply, and are renamed per group like other surfaces.

## Work Type Groups

Scriveno organizes its 50 work_types into 9 groups. Each group shares command adaptations and file naming conventions.

### Prose

Traditional narrative and nonfiction forms. This is the largest group, covering everything from novels to essays.

**Members:** Novel, Novella, Short Story, Flash Fiction, Memoir, Creative Nonfiction, Biography, Essay, Essay Collection

Prose work types use the default command names and file names. Most Scriveno features are available to prose.

### Script

Performance-oriented writing where formatting and structure follow industry conventions.

**Members:** Screenplay, Stage Play, TV Pilot, TV Series Bible, Audio Drama / Podcast Script, Libretto / Musical

Script work types use act-based hierarchies. Screenplays and TV scripts can export to Fountain and FDX formats.

### Academic

Research and scholarly writing with emphasis on argumentation, citation, and peer review.

**Members:** Research Paper, Thesis / Dissertation, Journal Article, White Paper, Literature Review, Monograph

Academic work types relabel selected always-available review commands in help and output: `/scr:editor-review` appears as `peer-review`, `/scr:beta-reader` appears as `reviewer-simulation`, and `/scr:sensitivity-review` appears as `ethics-review`. Context files also adapt -- `CHARACTERS.md` becomes `CONCEPTS.md`, `THEMES.md` becomes `QUESTIONS.md`.

### Technical Writing

Task-oriented documentation and system explanation work where accuracy, audience fit, and procedure clarity matter more than narrative structure.

**Members:** Technical Guide / User Guide, Runbook / SOP, API or CLI Reference, Design Spec / Architecture Doc

Technical-writing work types keep the core discuss -> plan -> draft flow, but relabel context and review surfaces to match docs work. `WORLD.md` becomes `SYSTEM.md`, `PLOT-GRAPH.md` becomes `PROCEDURES.md`, `/scr:build-world` is presented as `map-system`, and `/scr:editor-review` is presented as `technical-review`.

### Visual

Works where text and image are co-equal. Layout, illustration, and visual pacing matter as much as prose.

**Members:** Comic / Graphic Novel, Graphic Novel, Children's Book, Picture Book

Visual work types unlock illustration-specific commands like `/scr:spread-layout` and `/scr:storyboard`. Comics and graphic novels additionally use `/scr:panel-layout`, which stays hidden for non-comic visual projects.

### Poetry

Verse-based forms where line, rhythm, and musicality drive structure.

**Members:** Poetry Collection, Single Poem, Lyric / Song

Poetry work types use stanza/line hierarchies. Many structural commands (plot-graph, subplot-map, timeline) are hidden since they don't apply to verse.

### Interactive

Branching narrative forms for games and interactive fiction.

**Members:** Interactive Fiction, Game Narrative

Interactive work types use node/quest/dialogue_tree hierarchies to handle branching story paths.

### Speech and Song

Performed spoken-word forms.

**Members:** Speech

Speech uses section/beat hierarchy. Most structural and illustration commands are hidden.

### Sacred and Historical

Sacred texts, historical chronicles, and religious literature. This is the most heavily adapted group, with exclusive commands, voice registers, and tradition-specific configurations.

**Members:** Scripture (Biblical), Scripture (Quranic), Scripture (Torah), Scripture (Vedic), Scripture (Buddhist), Scripture (Generic), Commentary / Exegesis, Devotional, Liturgical Text, Historical Chronicle, Historical Account, Mythological Collection, Religious Epic, Sermon / Homily, Homiletic Collection

Sacred work types relabel selected review commands (`/scr:editor-review` becomes `scholarly-review`, `/scr:voice-check` becomes `register-check`), unlock 8 nested exclusive commands (`/scr:sacred:concordance`, `/scr:sacred:cross-reference`, `/scr:sacred:genealogy`, `/scr:sacred:chronology`, `/scr:sacred:annotation-layer`, `/scr:sacred:verse-numbering`, `/scr:sacred:source-tracking`, `/scr:sacred:doctrinal-check`), expose `/scr:sacred-numbering-format` as the active numbering display helper, and support 10 voice registers in STYLE-GUIDE.md.

Sacred projects also use a shipped tradition profile slug in the top-level `tradition` config key. The current shipped slugs are `catholic`, `orthodox`, `tewahedo`, `protestant`, `jewish`, `islamic-hafs`, `islamic-warsh`, `pali`, `tibetan`, and `sanskrit`.

## Word Count and Page Ranges

Every work type includes industry-standard word count and page range guidance. These are guides, not gates -- a literary novel can exceed 100,000 words. But the system has informed defaults instead of writing blind.

Ranges flow into three places:
- **`/scr:outline`** -- plans the right number of units at the right length
- **`/scr:manuscript-stats`** -- shows progress against word and page targets
- **`/scr:draft`** -- drafter knows target length per unit for natural pacing

Page counts use ~250 words/page (standard manuscript format).

### Prose

| Work Type | Words | Pages | Units | Words/Unit | Pages/Unit |
|-----------|-------|-------|-------|------------|------------|
| Novel | 70,000-100,000 | 280-400 | 20-35 chapters | 2,500-5,000 | 10-20 |
| Novella | 17,500-40,000 | 70-160 | 5-15 chapters | 2,000-4,000 | 8-16 |
| Short Story | 1,000-7,500 | 4-30 | 1-5 sections | 500-2,500 | 2-10 |
| Flash Fiction | 100-1,000 | 1-4 | 1-3 beats | 100-500 | 1-2 |
| Memoir | 60,000-90,000 | 240-360 | 15-30 chapters | 2,500-5,000 | 10-20 |
| Creative Nonfiction | 50,000-90,000 | 200-360 | 12-25 chapters | 2,500-5,000 | 10-20 |
| Biography | 70,000-120,000 | 280-480 | 15-35 chapters | 3,000-5,000 | 12-20 |
| Essay | 1,500-10,000 | 6-40 | 3-8 sections | 500-2,000 | 2-8 |
| Essay Collection | 40,000-80,000 | 160-320 | 10-25 essays | 2,000-6,000 | 8-24 |

### Script

| Work Type | Words | Pages | Units | Words/Unit | Pages/Unit |
|-----------|-------|-------|-------|------------|------------|
| Screenplay | 7,500-12,500 | 90-120 | 3-5 acts | 2,000-4,000 | 25-35 |
| Stage Play | 10,000-15,000 | 60-120 | 1-5 acts | 3,000-7,000 | 15-40 |
| TV Pilot | 5,000-10,000 | 30-60 | 4-6 acts | 1,000-2,500 | 6-12 |
| TV Series Bible | 15,000-40,000 | 60-160 | 6-13 episodes | 1,500-3,000 | 6-12 |
| Audio Drama | 3,000-8,000 | 12-32 | 1-10 episodes | 2,000-5,000 | 8-20 |
| Libretto | 5,000-12,000 | 20-48 | 2-3 acts | 2,000-5,000 | 8-20 |

### Academic

| Work Type | Words | Pages | Units | Words/Unit | Pages/Unit |
|-----------|-------|-------|-------|------------|------------|
| Research Paper | 5,000-15,000 | 20-60 | 4-8 sections | 1,000-3,000 | 4-12 |
| Thesis | 40,000-100,000 | 160-400 | 5-10 chapters | 5,000-15,000 | 20-60 |
| Journal Article | 3,000-8,000 | 12-32 | 4-7 sections | 500-2,000 | 2-8 |
| White Paper | 3,000-10,000 | 12-40 | 4-8 sections | 500-2,000 | 2-8 |
| Literature Review | 5,000-15,000 | 20-60 | 4-8 sections | 1,000-3,000 | 4-12 |
| Monograph | 50,000-100,000 | 200-400 | 8-15 chapters | 4,000-8,000 | 16-32 |

### Technical Writing

| Work Type | Words | Pages | Units | Words/Unit | Pages/Unit |
|-----------|-------|-------|-------|------------|------------|
| Technical Guide | 3,000-25,000 | 12-100 | 4-12 sections | 500-2,500 | 2-10 |
| Runbook | 1,500-12,000 | 6-48 | 3-10 procedures | 300-1,500 | 1-6 |
| API / CLI Reference | 2,000-30,000 | 8-120 | 5-40 resources | 150-1,000 | 1-4 |
| Design Spec | 2,000-15,000 | 8-60 | 4-12 sections | 500-2,000 | 2-8 |

### Visual

| Work Type | Words | Pages | Units | Words/Unit | Pages/Unit |
|-----------|-------|-------|-------|------------|------------|
| Comic | 2,000-5,000 | 22-32 | 1-6 issues | 500-1,500 | 22-32 |
| Graphic Novel | 5,000-20,000 | 80-200 | 5-12 chapters | 500-2,500 | 10-25 |
| Children's Book | 500-5,000 | 24-48 | 12-24 spreads | 20-200 | 2 |
| Picture Book | 200-1,000 | 24-40 | 12-20 spreads | 10-60 | 2 |

### Poetry

| Work Type | Words | Pages | Units | Words/Unit | Pages/Unit |
|-----------|-------|-------|-------|------------|------------|
| Poetry Collection | 5,000-15,000 | 48-120 | 3-8 sections | 1,000-3,000 | 8-20 |
| Single Poem | 20-2,000 | 1-8 | 1-20 stanzas | 10-200 | 1 |
| Song Lyric | 100-600 | 1-3 | 3-6 sections | 20-150 | 1 |

### Interactive

| Work Type | Words | Pages | Units | Words/Unit | Pages/Unit |
|-----------|-------|-------|-------|------------|------------|
| Interactive Fiction | 20,000-100,000 | 80-400 | 20-100 nodes | 500-2,000 | 2-8 |
| Game Narrative | 30,000-150,000 | 120-600 | 10-40 quests | 2,000-5,000 | 8-20 |

### Speech

| Work Type | Words | Pages | Units | Words/Unit | Pages/Unit |
|-----------|-------|-------|-------|------------|------------|
| Speech | 500-5,000 | 2-20 | 3-6 sections | 150-1,000 | 1-4 |

### Sacred & Historical

Sacred scriptures (Biblical, Quranic, Torah, Vedic, Buddhist, Generic) have no meaningful total word/page ranges because scope varies enormously (a single surah vs. the full Quran). They include per-unit ranges only.

| Work Type | Words | Pages | Units | Words/Unit | Pages/Unit |
|-----------|-------|-------|-------|------------|------------|
| Commentary | 20,000-150,000 | 80-600 | 5-30 sections | 2,000-8,000 | 8-32 |
| Devotional | 15,000-50,000 | 60-200 | 30-366 entries | 200-800 | 1-3 |
| Liturgical Text | 5,000-30,000 | 20-120 | 5-20 sections | 500-3,000 | 2-12 |
| Historical Chronicle | 50,000-150,000 | 200-600 | 10-40 chapters | 3,000-6,000 | 12-24 |
| Historical Account | 40,000-100,000 | 160-400 | 10-30 chapters | 3,000-5,000 | 12-20 |
| Mythological Collection | 30,000-100,000 | 120-400 | 10-50 tales | 1,500-5,000 | 6-20 |
| Religious Epic | 50,000-300,000 | 200-1,200 | 10-100 cantos | 2,000-8,000 | 8-32 |
| Sermon | 1,500-4,000 | 6-16 | 3-5 movements | 400-1,000 | 2-4 |
| Homiletic Collection | 50,000-150,000 | 200-600 | 30-60 sermons | 1,500-4,000 | 6-16 |

## Complete Work Type Table

Every work type Scriveno supports, with its group and structural hierarchy. Data sourced from `data/CONSTRAINTS.json`.

| Work Type | Group | Top Level | Mid Level | Atomic Unit | Command Unit |
|-----------|-------|-----------|-----------|-------------|--------------|
| novel | Prose | part | chapter | scene | chapter |
| novella | Prose | -- | chapter | scene | chapter |
| short_story | Prose | -- | section | beat | section |
| flash_fiction | Prose | -- | -- | beat | beat |
| memoir | Prose | part | chapter | vignette | chapter |
| creative_nonfiction | Prose | part | chapter | scene | chapter |
| biography | Prose | part | chapter | scene | chapter |
| essay | Prose | -- | section | paragraph_block | section |
| essay_collection | Prose | part | -- | essay | essay |
| screenplay | Script | act | sequence | scene | act |
| stage_play | Script | act | scene | beat | act |
| tv_pilot | Script | act | scene | beat | act |
| tv_series_bible | Script | season | episode | scene | episode |
| audio_drama | Script | season | episode | scene | episode |
| libretto | Script | act | scene | number | act |
| research_paper | Academic | -- | section | subsection | section |
| thesis | Academic | part | chapter | section | chapter |
| journal_article | Academic | -- | section | subsection | section |
| white_paper | Academic | -- | section | subsection | section |
| literature_review | Academic | -- | section | subsection | section |
| monograph | Academic | part | chapter | section | chapter |
| technical_guide | Technical Writing | -- | section | procedure | section |
| runbook | Technical Writing | -- | procedure | step | procedure |
| api_reference | Technical Writing | -- | resource | endpoint | resource |
| design_spec | Technical Writing | system | section | decision | section |
| comic | Visual | volume | issue | panel | issue |
| graphic_novel | Visual | volume | chapter | panel | chapter |
| childrens_book | Visual | -- | spread | page | spread |
| picture_book | Visual | -- | spread | illustration_text | spread |
| poetry_collection | Poetry | section | -- | poem | section |
| single_poem | Poetry | -- | stanza | line | stanza |
| song_lyric | Poetry | -- | section | line | section |
| interactive_fiction | Interactive | -- | node | choice_branch | node |
| game_narrative | Interactive | act | quest | dialogue_tree | quest |
| speech | Speech & Song | -- | section | beat | section |
| scripture_biblical | Sacred & Historical | testament | book | verse | book |
| scripture_quranic | Sacred & Historical | -- | surah | ayah | surah |
| scripture_torah | Sacred & Historical | chumash | parashah | pasuk | parashah |
| scripture_vedic | Sacred & Historical | veda | mandala | sukta | mandala |
| scripture_buddhist | Sacred & Historical | pitaka | nikaya | sutta | sutta |
| scripture_generic | Sacred & Historical | testament | book | verse | book |
| commentary | Sacred & Historical | -- | section | annotation_block | section |
| devotional | Sacred & Historical | -- | theme | entry | entry |
| liturgical | Sacred & Historical | rite | section | rubric | section |
| historical_chronicle | Sacred & Historical | era | chapter | event | chapter |
| historical_account | Sacred & Historical | part | chapter | scene | chapter |
| mythological_collection | Sacred & Historical | cycle | -- | tale | tale |
| religious_epic | Sacred & Historical | book | canto | verse | canto |
| sermon | Sacred & Historical | -- | movement | beat | sermon |
| homiletic_collection | Sacred & Historical | liturgical_year | -- | sermon | sermon |

## File Adaptations

Context files rename based on your work type group. This keeps the vocabulary natural -- a sacred text project has FIGURES.md instead of CHARACTERS.md, because you're writing about historical and religious figures, not fictional characters.

| Default File | Academic | Technical Writing | Sacred & Historical |
|-------------|----------|-------------------|-------------------|
| BRIEF.md | PROPOSAL.md | DOC-BRIEF.md | FRAMEWORK.md |
| CHARACTERS.md | CONCEPTS.md | AUDIENCE.md | FIGURES.md |
| RELATIONSHIPS.md | RELATIONSHIPS.md | DEPENDENCIES.md | LINEAGES.md |
| WORLD.md | CONTEXT.md | SYSTEM.md | COSMOLOGY.md |
| PLOT-GRAPH.md | ARGUMENT-MAP.md | PROCEDURES.md | THEOLOGICAL-ARC.md |
| THEMES.md | QUESTIONS.md | REFERENCES.md | DOCTRINES.md |

All other groups (Prose, Script, Visual, Poetry, Interactive, Speech & Song) use the default file names.

## Command Adaptations

Certain commands get adapted labels for academic, technical, and sacred work type groups. The canonical runnable command remains the file-backed base command unless a runtime explicitly installs an alias, and an adapted label only surfaces when the base command is actually available for that group.

### Academic Adaptations

| Base Command | Adapted Label | Focus |
|-----------------|--------------|-------|
| editor-review | peer-review | Scholarly critique and reviewer framing |
| beta-reader | reviewer-simulation | Methodology critique and argument-strength review |
| sensitivity-review | ethics-review | Ethics, audience, and institutional review lens |

### Technical Writing Adaptations

| Base Command | Adapted Label | Description |
|-----------------|--------------|-------------|
| build-world | map-system | System boundaries, environments, and operating context |
| plot-graph | procedure-map | Procedure flow, escalation path, and task sequence |
| editor-review | technical-review | Accuracy, clarity, and audience-fit review |
| beta-reader | usability-review | Reader/operator task-completion review |
| continuity-check | consistency-check | Terminology, procedure, and version consistency |

### Sacred Adaptations

| Base Command | Adapted Label | Description |
|-----------------|--------------|-------------|
| voice-check | register-check | Voice register consistency |
| editor-review | scholarly-review | Academic review |
| beta-reader | theological-review | Doctrinal/pastoral review |
| sensitivity-review | interfaith-review | Sensitivity across traditions |

Sacred-specific workflows like chronology, doctrinal review, and verse numbering are available through the dedicated `/scr:sacred:*` command family rather than by relabeling hidden base commands.

## Choosing Your Work Type

When you run `/scr:new-work`, Scriveno asks what you're writing and picks the best work type from your answer. You can also set it explicitly:

```
/scr:new-work --type screenplay
/scr:new-work --type scripture_quranic
/scr:new-work --type research_paper
/scr:new-work --type runbook
```

If you're not sure which type fits:

- **Writing fiction?** Start with `novel`, `novella`, `short_story`, or `flash_fiction` depending on length.
- **Writing for performance?** Use `screenplay`, `stage_play`, `tv_pilot`, or `audio_drama`.
- **Writing scholarship?** Use `research_paper`, `thesis`, or `journal_article`.
- **Writing technical docs?** Use `technical_guide`, `runbook`, `api_reference`, or `design_spec` depending on whether you're teaching, operating, documenting, or deciding.
- **Writing sacred or religious text?** Pick the tradition-specific type (e.g., `scripture_biblical`, `scripture_quranic`) or use `scripture_generic`.
- **Writing poetry?** Use `poetry_collection` for a book of poems, `single_poem` for one poem, or `song_lyric` for lyrics.
- **Writing for children?** Use `childrens_book` or `picture_book` -- these unlock illustration and spread layout tools.

Your work type is stored in `.manuscript/config.json` and can be changed later by editing the file directly or starting a new project with `/scr:new-work`.

## See Also

- [Getting Started](getting-started.md) -- Install Scriveno and write your first draft
- [Command Reference](command-reference.md) -- Full list of all 122 commands with usage and examples
- [Voice DNA Guide](voice-dna.md) -- How Scriveno profiles and preserves your writing voice
