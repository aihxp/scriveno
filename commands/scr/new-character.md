---
description: Build a complete character profile through guided interactive interview.
---

# /scr:new-character -- Interactive Character Creation

Build a complete character profile through guided interview.

## Usage
```
/scr:new-character <name>
```

## Instruction

You are creating a new character for the creative work. Load:
- `WORK.md` (genre, tone, setting context)
- `CHARACTERS.md` (existing characters -- to ensure distinctiveness)
- `RELATIONSHIPS.md` (existing relationship dynamics)
- `THEMES.md` (thematic threads this character might serve)

---

### INTERVIEW PROCESS

Ask these questions adaptively. Skip what doesn't apply to the genre/form. Go deeper where the writer has energy.

<character_interview>
  <section name="identity">
    <q>Full name and any nicknames/aliases?</q>
    <q>Age and life stage?</q>
    <q>Role in the story? (Protagonist, antagonist, mentor, love interest, foil, comic relief, etc.)</q>
    <q>First impression -- what do people notice first about them?</q>
  </section>

  <section name="psychology">
    <q>What do they WANT? (Conscious desire -- what they're pursuing)</q>
    <q>What do they NEED? (Unconscious need -- what would actually fulfill them)</q>
    <q>What is their core wound or defining experience?</q>
    <q>What is their greatest fear?</q>
    <q>What is their lie -- the false belief they carry?</q>
    <q>What is their ghost -- the backstory event that shaped them?</q>
  </section>

  <section name="arc">
    <q>Where do they start emotionally/spiritually?</q>
    <q>Where do they end up?</q>
    <q>What is their arc type? (Change, growth, fall, steadfast, flat/catalytic)</q>
    <q>What is the key turning point that triggers their transformation?</q>
  </section>

  <section name="voice">
    <q>How do they speak? (Vocabulary, rhythm, tics, catchphrases)</q>
    <q>What's their internal monologue like? (If we're in their head)</q>
    <q>How do they differ from other characters in speech?</q>
    <q>Do they have a physical mannerism or gesture?</q>
  </section>

  <section name="relationships">
    <q>How do they relate to [each existing character]?</q>
    <q>Who do they trust? Who do they distrust?</q>
    <q>What's their attachment style? (Secure, anxious, avoidant, disorganized)</q>
  </section>

  <section name="world_connection">
    <q>Where are they from? Where do they live now?</q>
    <q>What's their socioeconomic position?</q>
    <q>What is their profession/occupation?</q>
    <q>What communities do they belong to?</q>
  </section>

  <section name="craft_purpose">
    <q>What thematic thread does this character carry?</q>
    <q>What narrative function do they serve beyond plot? (Mirror, foil, comic relief, moral compass)</q>
    <q>Which existing character do they most contrast with, and how?</q>
  </section>
</character_interview>

---

### GENERATE PROFILE

Create the character profile and append to `CHARACTERS.md`:

<character_profile>
  ## [Character Name]

  **Role:** [Story role]
  **Arc Type:** [Change/Growth/Fall/Steadfast/Flat]

  ### Identity
  - Age, appearance, first impression
  - Background summary

  ### Psychology
  - **Want:** [Conscious desire]
  - **Need:** [Unconscious need]
  - **Lie:** [False belief]
  - **Ghost:** [Formative backstory event]
  - **Fear:** [Greatest fear]

  ### Arc
  - **Start:** [Emotional/spiritual starting position]
  - **Turning Point:** [Key moment of change]
  - **End:** [Where they arrive]

  ### Voice
  - Speaking style, vocabulary, rhythm
  - Internal monologue style (if POV character)
  - Distinguishing speech patterns
  - Physical mannerisms

  ### Thematic Function
  - Which themes this character embodies or challenges
  - Narrative purpose beyond plot

  ### Key Relationships
  - [Character A]: nature of relationship, dynamic, tension
  - [Character B]: ...
</character_profile>

Update `RELATIONSHIPS.md` with new connections.
Update `THEMES.md` if this character introduces or reinforces themes.

Commit: `character: add {name}`
