---
description: Build a people (race, faction, culture, nation) as a collective entity through a guided interview.
argument-hint: "<name>"
---

# /scr:new-people -- Build a People

Characters are individuals; a **people** is the collective they belong to: a race, species, ethnicity, nationality, region, faction, order, class, or religion. This command profiles a people the way `/scr:new-character` profiles a person, so the work can track who a character *is one of*, and how peoples relate and clash as collectives.

## Usage
```
/scr:new-people <name>
```

## Availability

For narrative work (prose, script, visual, interactive, and sacred narrative). It does not surface for poetry, speech, academic, or technical work. Use the work type's own term for a people: races or species in speculative fiction, tribes or nations in sacred and historical work.

## Instruction

Load `WORK.md` (genre, tone, central conflict), `CHARACTERS.md` (existing cast, to link members), `PEOPLES.md` (existing peoples, for distinctiveness and relations), and `WORLD.md` (the culture and societies this people lives in). Determine the adapted filename and terminology from `file_adaptations` and the work type.

### INTERVIEW PROCESS

Ask adaptively. Skip what does not apply; go deeper where the writer has energy.

<people_interview>
  <section name="identity">
    <q>What is this people, and what kind are they (race, species, ethnicity, nationality, region, faction, order, class, religion)?</q>
    <q>How large are they (a household, a city, a nation, a species)?</q>
    <q>What do outsiders notice first about them?</q>
  </section>
  <section name="origin">
    <q>Where do they come from, and what is their makeup if they are not ordinary humans?</q>
    <q>What history shaped who they are now?</q>
  </section>
  <section name="culture">
    <q>What do they prize? What are their customs and taboos?</q>
    <q>How do they speak: dialect, idiom, register, what they never say?</q>
  </section>
  <section name="position">
    <q>Where do they sit in the world's order, and how are they organized internally?</q>
  </section>
  <section name="collective_arc">
    <q>What does this people want as a whole? What do they fear?</q>
    <q>How do they see themselves versus how outsiders see them (their blind spot)?</q>
    <q>What is their stake in the central conflict?</q>
  </section>
  <section name="relations">
    <q>How do they stand with each other people in the work (alliance, rivalry, oppression, trade, contempt, kinship, none)?</q>
    <q>Which characters belong to this people?</q>
  </section>
</people_interview>

### GENERATE THE ENTRY

Create the profile and append it to `PEOPLES.md` using the `templates/PEOPLES.md` shape: Kind and Scale, Origin, Shared values and culture (including speech markers), Social position, the collective arc (want, fear, self-image vs outsiders, stake in the central conflict), Members, and Relations with other peoples.

- **Link members.** For each character the writer names, add them to this people's `### Members` list, and add a `Belongs to: {people}` line to that character's entry in `CHARACTERS.md`. A member inherits the people's traits unless their own entry overrides them.
- **Record relations.** Fill the `### Relations with other peoples` section for the peoples this one already deals with. These are the source for the derived people-dynamics map.

After the entry and its relations are written, regenerate `.manuscript/PEOPLE-DYNAMICS.md` from the people entries per `docs/people-dynamics-protocol.md` once two or more peoples exist, so the derived dynamics map stays current.

Commit: `peoples: add {name}`

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

## Tone

Curious and worldbuilding-minded. A people is a character writ large; help the writer find what makes this collective specific, so its members never read as generic.
