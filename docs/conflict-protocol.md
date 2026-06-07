# Conflict map protocol

This is the canonical contract for `.manuscript/CONFLICTS.md`, Scriveno's derived conflict map, and for how it is computed. The goal is a single, always-complete answer to "where is the conflict, and where is there none" -- at the level of the whole work and every character pair.

It is part of the trust layer. The sources are:

- `WORK.md` -- the authored central conflict (primary type, external goal-and-obstacle, internal want-versus-need)
- `CHARACTERS.md` -- per-character wants and needs, and the per-pair "Conflict pattern" in the relationship sections
- `.manuscript/CONFLICTS.md` -- the derived conflict map (the file you open to see every conflict)

`WORK.md` and the character entries are the source of truth; `CONFLICTS.md` is a derived view of them. Like `CONTEXT.md`, it is a neutral derived file -- the same filename across work types -- and it is not created at `/scr:new-work`; it is generated once the work has a central conflict or two or more characters.

## Levels

- **Central conflict** -- from `WORK.md`: the primary type (character vs self / character / nature / supernatural / technology / society), the external goal and obstacle, and the internal want-versus-need.
- **Pairwise conflict** -- from the character entries: every character pair, with clashing wants and the relationship "Conflict pattern" surfaced.
- **Scene conflict** -- per-unit goal-versus-obstacle-and-outcome, authored in each unit plan (the scene breakdown and the plan's `## Causal Anchor`) and rolled up into the `## Scene conflict` section here.

## The completeness rule

Every character pair appears in the map. A pair in conflict shows its nature and stakes; a pair with none shows `no conflict`. There are no blanks: "no conflict" is a recorded value, not a gap, exactly as in the relationship map. An absent pair means the derivation missed it (drift), not that the writer chose to leave it out.

## Crisis and climax

The map names the two structural peaks of the central conflict, kept distinct because they are easy to conflate: the **crisis** is the lowest point, where the protagonist has no options and story energy peaks against them (typically about three-quarters of the way through); the **climax** is the moment of success that follows. The arc positions are authored in `OUTLINE.md` (the `Crisis` and `Climax` fields); the map references them.

## Derivation (source-first)

1. Read the central conflict from `WORK.md` and the wants/needs and "Conflict pattern" lines from the character entries.
2. Classify the central conflict by primary type and separate its external and internal halves.
3. Enumerate every character pair. Fill conflicting pairs from the character entries; mark every remaining pair `no conflict` where the writer has established there is none, or surface it as undefined where no one has said yet.
4. Render the central conflict, the pairwise matrix, and the undefined pairs.

## Undefined pairs and exploration

The map distinguishes `no conflict` (the writer established there is none) from undefined (no one has said yet). Undefined pairs are surfaced so the writer can decide -- including deciding `no conflict` -- via `/scr:character-touch` or `/scr:relationship-map --edit`. The system never invents conflict to fill a gap; it only surfaces the gap.

## Who regenerates CONFLICTS.md

Rebuilt by the commands that change the conflict picture or refresh derived state, never by a read-only command:

- `/scr:new-character` -- after a new character (and their wants and conflicts) is added
- `/scr:character-touch` -- after wants/needs or the relationship "Conflict pattern" change
- `/scr:plan` -- after a unit plan records or changes its scene conflict
- `/scr:save` -- alongside the other derived surfaces, when conflict applies
- `/scr:scan --fix` -- when the map is missing or stale

## When this protocol does not apply

- **Work types without narrative conflict.** Poetry and speech have no conflict map; skip silently.
- **No central conflict and fewer than two characters.** Nothing to map yet; the file is generated once a central conflict exists or a second character is added.
- **Neutral filename.** Unlike the relationship map, the conflict map is not renamed per group; it is always `CONFLICTS.md` (the `CONTEXT.md` precedent).

The protocol is a hint, not a hard gate. A command that cannot parse the sources cleanly should say so and render what it can, rather than emit a wrong map.
