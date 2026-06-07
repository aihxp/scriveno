---
description: Build a complete character profile through guided interactive interview.
argument-hint: "<name>"
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

  <section name="persona_under_pressure">
    <q>What do they do when afraid?</q>
    <q>How do they lie, deflect, or avoid the truth?</q>
    <q>What changes in their body or speech when they are under pressure?</q>
  </section>

  <section name="relationships">
    <q>How do they relate to [each existing character]?</q>
    <q>Who do they trust? Who do they distrust?</q>
    <q>What's their attachment style? (Secure, anxious, avoidant, disorganized)</q>
    <q>How do they speak differently with someone they trust versus someone they fear?</q>
    <q>Which relationship changes them the most on the page?</q>
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

  ### Persona Under Pressure
  - When afraid
  - When angry
  - When lying or avoiding truth
  - When vulnerable
  - Physical tells

  ### Thematic Function
  - Which themes this character embodies or challenges
  - Narrative purpose beyond plot

  ### Key Relationships
  - [Character A]: nature of relationship, dynamic, tension
  - [Character B]: ...

  ### Relationship-Specific Interactions
  - [Character A]: trust posture, conflict pattern, speech shift, hidden agenda or fear
  - [Character B]: trust posture, conflict pattern, speech shift, hidden agenda or fear
</character_profile>

Regenerate `.manuscript/RELATIONSHIPS.md` from the character relationship sections per `docs/relationships-protocol.md`. It is derived from `CHARACTERS.md`, not hand-edited: every pair is accounted for (pairs with no relationship marked `none`), and pairs no one has described yet are surfaced as undefined to explore.
Update `THEMES.md` if this character introduces or reinforces themes.

Commit: `character: add {name}`

## Next-step routing

When the cast reaches two or more characters, suggest `/scr:relationship-map` to explore the pairings and see the connections.

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
