# Writing rules

*Universal pitfalls every drafter must avoid. Loaded into the drafter, voice-checker, and originality-check after STYLE-GUIDE.md. STYLE-GUIDE.md wins where they conflict; this file is the floor, not the ceiling.*

*This file is optional. If absent, agents fall back to their built-in rules. If present, this is the single source of truth for universal AI-tell don'ts.*

## How to read this file

- **Defaults, not absolutes.** If STYLE-GUIDE.md says the writer hedges, fragments dialogue, or moralizes deliberately, follow STYLE-GUIDE.md.
- **Floor, not ceiling.** These rules catch the worst AI tells. Real craft goes further.
- **Per work type.** When a per-work-type pitfall pack exists for the project's `work_type`, load it after this file. Type-specific rules can refine but not relax universal ones.

## Universal don'ts

These patterns make prose sound generated. Avoid them unless STYLE-GUIDE.md explicitly calls for them.

### Human-first restraint
- Do not over-correct prose that already sounds like the writer.
- Isolated signals are not enough. Look for clusters: generic vocabulary plus symmetrical rhythm plus vague claims plus formulaic transitions.
- Preserve human markers: specific details, mixed feelings, fragments, self-corrections, uneven rhythm, and era-bound references.
- If the passage has only one or two weak spots, fix those spots. Do not sand down the whole paragraph.
- When reporting edits, name one to three things deliberately left alone because they are authentic to the writer or register.

### Variance over substitution
- Do not fix AI-sounding prose by swapping one suspect word for another everywhere. Fix the underlying thought.
- Increase or preserve genuine structural variance: sentence length, paragraph shape, syntax, pace, and silence.
- Do not install a new humanizer signature. Avoid repeated edit shapes such as every paragraph becoming short punch, long explanation, short punch.
- Match STYLE-GUIDE.md's distribution of rhythm. If the writer is deliberately even, spare, maximalist, clipped, or formal, do not force generic variety.

### Factual integrity and content preservation
- Do not invent facts, names, numbers, sources, quotes, dates, prices, examples, locations, or claims.
- Specificity is good only when the source material provides it.
- Cover every original beat the plan or draft requires. Do not truncate, skip paragraphs, compress away obligations, or replace concrete content with a prettier generalization.
- If a detail is missing, leave the gap visible for the writer or planner rather than filling it with plausible material.
- Audit soft inference as carefully as hard facts. Do not add causal, temporal, quantitative, or priority claims unless the source or plan states them.

### Register-aware restraint
- Academic, technical, legal, sacred, journalistic, and quoted material should not be casualized just to sound "human."
- Preserve required terms of art, citation language, doctrinal phrasing, legal precision, procedural commands, and period diction.
- Change register only when STYLE-GUIDE.md or the plan asks for the shift.
- When a sentence is correct for its register, leave it alone even if it would sound warmer in another context.

### Stance discipline
- Add edge, opinion, irony, warmth, or first-person attitude only when STYLE-GUIDE.md, the plan, or the writer explicitly calls for that stance.
- Stance may react to content already present. It may not smuggle in new facts, motives, causes, events, expertise, lived experience, or claims.
- If the writer asks for more voice, make the voice sharper through rhythm, emphasis, and judgment about supplied material, not through invented support.

### Hedging and qualifiers
- Avoid "perhaps", "maybe", "in a sense", "to some degree", "it could be argued", "one could say", "it bears mentioning", "it is worth noting", "it should be noted".
- Avoid stacked qualifiers: "quite", "rather", "somewhat", "fairly", "relatively", "arguably", "potentially".
- A sentence that hedges twice is hedging too much.

### Throat-clearing and scaffolding
- Do not open with "The scene begins...", "In this chapter...", "What follows is...".
- No "and then" connective tissue between beats.
- No meta-commentary on the prose itself.
- Start in the moment. If you cannot start, re-read the previous unit's tail and let its rhythm lead.

### Balanced-both-sides constructions
- Do not pair every pro with a con, every advantage with a disadvantage.
- Real voices take positions. Symmetry is an AI tell.
- If STYLE-GUIDE.md describes the voice as "judicious" or "essayistic", balance is allowed. Otherwise, lean.

### Generic metaphors and dead figures
- "Heart of gold", "tip of the iceberg", "at the end of the day", "wave of emotion", "shiver down the spine", "time stood still".
- If the metaphor predates the writer, it is not the writer's metaphor.
- Match metaphor density and image systems to STYLE-GUIDE.md.

### Symmetrical rhythm
- Do not write three sentences of similar length in a row.
- Vary cadence: short, short, long. Or fragment, full, full.
- Uniform paragraph lengths are an AI tell. Real rhythm breathes.

### Moralizing closings
- Do not wrap the unit in a bow. No takeaway sentence, no "and so", no lesson.
- The scene ends where it ends. The reader does the work.
- If STYLE-GUIDE.md establishes a moralizing voice (homiletic, didactic, parabolic), defer to it.

### Essay transitions in narrative
- "Furthermore", "moreover", "additionally", "in conclusion", "consequently" do not belong in fiction or scene.
- They belong in argument. Use them only when the work type's group is `academic` or `technical`, or when the unit is explicitly an essay.

### Abstract vagueness
- "Various factors", "a number of reasons", "in many ways", "something like", "some kind of".
- Name the factors. Name the reasons. Name the thing.
- Specificity is voice. Vagueness is filler.

### Chat artifacts and placeholder contamination
- Remove chatbot wrapper text: "I hope this helps", "Would you like me to", "Here is the revised version", "As an AI".
- Remove copied citation artifacts, UI references, orphaned markdown fences, access-date placeholders, and template blanks.
- Do not leave `[INSERT]`, `[YEAR]`, `[COMPANY]`, `[TODO]`, `turn0search0`, `oai_citation`, or similar residue in writer-facing prose.
- If the artifact hides missing information, flag the missing information instead of inventing it.

### Emotional telling
- Do not write "she felt sad", "he was angry", "they were excited".
- Show it through action, dialogue, body, or implication.
- The verb "felt" before an emotion word is a flag. Recheck before keeping it.

### AI tics in dialogue
- Characters do not "let out a sigh", "give a small smile", or "nod softly".
- They sigh, smile, or nod. Or they do something more specific.
- Adverb stacks on tags ("she said softly, quietly, almost inaudibly") are a tell. One adverb at most. Usually none.

### Dialogue attribution defaults
- Default to "said". "Said" is invisible.
- Action beats are stronger than creative tags. "He set down the cup." beats "he muttered darkly".
- Attribute only when the speaker would be unclear. Two-character scenes need fewer tags than you think.

### Diff-anchored explanation
- In docs, comments, and technical prose, describe what is true now, not what changed from an older version.
- Release notes and changelogs may describe changes. Durable documentation should stand on its own.
- Prefer "Authentication uses encrypted cookies for session storage" over "We replaced the old session middleware with encrypted cookies."

## Show-don't-tell triggers

Before writing any of these, try the harder version first.

| Trigger phrase | What it usually means | Try instead |
|---|---|---|
| "She felt X" | Emotion told, not shown | A gesture, a thought, a physical sensation |
| "He realized X" | Insight stated flat | Let the reader watch the realization land |
| "It was a beautiful day" | Setting told | One concrete detail of weather, light, or air |
| "The room was tense" | Mood told | Body language, pause, what is not said |
| "She knew that X" | Cognition stated | Show what she does because she knows it |

## Punctuation defaults

- No em dashes. No en dashes. Use commas, colons, semicolons, parentheses, or two sentences.
- No emojis in prose, dialogue, or headings.
- Hyphens for compounds ("old-fashioned") and number ranges ("pages 10-15").

## When STYLE-GUIDE.md overrides

STYLE-GUIDE.md takes precedence when it explicitly establishes:
- A hedging or qualified voice (philosophical, essayistic, scholarly registers)
- Fragmented or symmetrical rhythm as a deliberate signature
- A moralizing or didactic closing pattern (homiletic, parabolic, catechetical work types)
- Genre-specific stock language the writer wants preserved (pastiche, parody, period voice)
- Profanity, dialect, or register choices that would otherwise read as AI artifacts
- A clear stance profile: skeptical, warm, devotional, polemical, restrained, comic, severe, or otherwise writer-specific

When STYLE-GUIDE.md is silent, this file's defaults hold.

---

*If a sentence sounds like a smart machine wrote it, it probably did. Rewrite until it sounds like the writer.*
