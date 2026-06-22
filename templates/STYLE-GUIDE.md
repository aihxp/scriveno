---
creative_pillar: voice
always_load_for: [draft, voice-check, plan, editor-review, translate]
authority: sovereign
---

# Style guide -- Voice DNA

*This file is loaded into every drafter agent invocation. It is the single most important file in the project -- the difference between prose that sounds like the writer and prose that sounds like generic AI.*

## Part 1 -- Narrative architecture

### Narrative perspective
- **POV:** {{POV}} (first person, close third, distant third, omniscient, second person)
- **POV consistency:** {{POV_CONSISTENCY}} (single POV, multi-POV by chapter, shifting)
- **Narrator reliability:** {{RELIABILITY}} (reliable, unreliable, ambiguous)
- **Narrator distance:** {{DISTANCE}} (intimate, observational, detached, cinematic)

### Tense
- **Primary tense:** {{TENSE}} (past, present, mixed)
- **Tense shifts:** {{TENSE_RULES}} (where and why tense shifts are allowed)

### Narrative stance
- **Knowing vs. discovering:** {{STANCE}} (does the narrator know what's coming, or discover it alongside the reader?)
- **Emotional distance:** {{EMO_DISTANCE}} (warm/cool, sympathetic/critical/neutral)
- **Judgment:** {{JUDGMENT}} (moralistic, withholding, ironic, compassionate)

## Part 2 -- Sentence and paragraph architecture

### Sentence architecture
- **Average sentence length:** {{SENTENCE_LENGTH}} words
- **Sentence variation:** {{VARIATION}} (high variation, mostly short, mostly long, rhythmic alternation)
- **Complex structures:** {{COMPLEX}} (embedded clauses, parallel structures, fragments)
- **Sentence music:** {{MUSIC}} (staccato, flowing, punchy, lyrical)

### Paragraph architecture
- **Paragraph length:** {{PARAGRAPH_LENGTH}} (short, medium, long, variable)
- **White space:** {{WHITESPACE}} (dense, generous, rhythmic)
- **Paragraph breaks:** {{BREAK_RULES}} (when to break -- beat shift, POV shift, emphasis)

## Part 3 -- Vocabulary and figurative language

### Vocabulary
- **Register:** {{REGISTER}} (formal, conversational, lyrical, colloquial, literary)
- **Complexity:** {{COMPLEXITY}} (accessible, elevated, specialized)
- **Word origin:** {{WORD_ORIGIN}} (preference for Anglo-Saxon vs. Latinate)
- **Jargon handling:** {{JARGON}} (how domain-specific terms are introduced)
- **Profanity:** {{PROFANITY}} (none, mild, moderate, explicit, character-specific)

### Figurative language
- **Metaphor density:** {{METAPHOR_DENSITY}} (sparse, moderate, dense)
- **Metaphor style:** {{METAPHOR_STYLE}} (grounded/concrete, abstract/philosophical, sensory)
- **Recurring image systems:** {{IMAGE_SYSTEMS}} (list of motifs that should recur)
- **Similes:** {{SIMILES}} (frequency and style)
- **Symbolism:** {{SYMBOLISM}} (overt, buried, emergent)

## Part 4 -- Dialogue

### Dialogue voice
- **Ratio:** {{DIALOGUE_RATIO}} (% of text that is dialogue)
- **Tag style:** {{TAG_STYLE}} (said-bookish, creative tags, action beats, minimal)
- **Subtext level:** {{SUBTEXT}} (on-the-nose, moderately layered, heavily subtextual)
- **Dialect/accent:** {{DIALECT}} (phonetic, light, none)
- **Interrupted speech:** {{INTERRUPTIONS}} (frequency and handling)

### Character voice differentiation
Each character should sound distinct. See CHARACTERS.md for individual voice anchors.

## Part 5 -- Description and sensory detail

### Description density
- **Overall density:** {{DESCRIPTION_DENSITY}} (sparse, moderate, rich, lush)
- **Sense mix:** {{SENSES}} (visual-dominant, multi-sensory, synesthetic)
- **Specificity:** {{SPECIFICITY}} (general, specific, hyper-specific with brand names)

### Physicality
- **Body awareness:** {{PHYSICALITY}} (how often characters' physical sensations appear)
- **Place:** {{PLACE}} (how strongly setting is felt)
- **Time of day/weather:** {{ATMOSPHERE}} (how often atmosphere is referenced)

## Part 6 -- Pacing, rhythm, and transitions

### Pacing
- **Default pace:** {{PACE}} (slow-burn, steady, brisk, breakneck)
- **Pace variation:** {{PACE_VARIATION}} (where and how pace shifts)
- **Scene-to-summary ratio:** {{SCENE_SUMMARY}}

### Transitions
- **Between scenes:** {{SCENE_TRANSITIONS}} (hard cuts, soft fades, hooks)
- **Between chapters:** {{CHAPTER_TRANSITIONS}} (cliffhangers, echoes, clean breaks)
- **Time jumps:** {{TIME_JUMPS}} (signaling, frequency, handling)
- **Scene break marker:** {{SCENE_BREAK_MARKER}} (the visual divider between scenes inside a chapter: centered asterisks `* * *`, a blank line, an ornament or dingbat, or `#`)
- **Time-jump marker:** {{TIME_JUMP_MARKER}} (how a jump in time is signaled on the page: a dateline, a labeled break, extra white space, or none)

## Part 7 -- Reference influences

### Authors/works the writer wants to evoke
{{INFLUENCES}}

### Passages loaded as reference
{{REFERENCE_PASSAGES}}
*(500-word samples from the writer's own previous work or selected reference authors, used by the drafter as voice anchors.)*

## Part 8 -- Sacred voice registers (sacred/historical work types only)

{{SACRED_REGISTERS_BLOCK}}

*If the work type is sacred/historical, this section lists the active voice registers (prophetic, wisdom, legal, liturgical, narrative-historical, apocalyptic, epistolary, psalmic, parabolic, didactic) and which units use which register.*

## Part 9 -- Do and don't

### Always
{{ALWAYS}}

### Never
{{NEVER}}

### Consider
{{CONSIDER}}

---

*This style guide is generated from the `/scr:profile-writer` questionnaire and refined by `/scr:voice-test`. It is updated whenever the writer says "this doesn't sound like me" or flags a specific voice issue. Every drafter agent loads this file -- it is the single most important artifact in the project.*
