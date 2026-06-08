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
- `docs/surface-resolution-protocol.md` for adapted surface resolution and writer-facing terminology
- `WORK.md` (genre, tone, setting context)
- the adapted cast surface for canonical `CHARACTERS.md` (existing characters, concepts, or figures, to ensure distinctiveness)
- the adapted relationship surface for canonical `RELATIONSHIPS.md` where that surface applies (existing relationship dynamics)
- the adapted themes surface for canonical `THEMES.md` (thematic threads this character might serve)
- `PEOPLES.md` only when `surface_applicability` says the peoples surface applies to this work type

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

Create the character profile and append to the adapted cast surface for canonical `CHARACTERS.md`:

<character_profile>
  ## [Character Name]

  **Role:** [Story role]
  **Arc Type:** [Change/Growth/Fall/Steadfast/Flat]

  ### Identity
  - Age, appearance, first impression
  - Background summary
  - Belongs to: [people] (include only when `PEOPLES.md` applies; the character inherits its people's traits unless their entry overrides them)

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

Regenerate the adapted relationship surface for canonical `RELATIONSHIPS.md` where that surface applies, per `docs/relationships-protocol.md`. It is derived from the adapted cast surface, not hand-edited: every pair is accounted for (pairs with no relationship marked `none`), and pairs no one has described yet are surfaced as undefined to explore.
When `PEOPLES.md` applies and the character's `Belongs to:` names a people, add the character to that people's `### Members` list in `PEOPLES.md` (the reverse link, so membership is bidirectional like `/scr:new-people`), and regenerate `.manuscript/PEOPLE-DYNAMICS.md` if two or more peoples exist. If the named people is not yet defined, suggest `/scr:new-people`. If `PEOPLES.md` is not_applicable for the work type, omit `Belongs to:` and do not route to `/scr:new-people`.
Update the adapted themes surface for canonical `THEMES.md` if this character introduces or reinforces themes.

Commit: `character: add {name}`

## Next-step routing

When the cast reaches two or more characters, suggest `/scr:relationship-map` to explore the pairings and see the connections. When `PEOPLES.md` applies and a character belongs to a people not yet defined, suggest `/scr:new-people <people>` to profile that people as a collective.

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
