---
description: Build or search a concordance of key terms, names, and phrases across the sacred text. Essential for cross-referencing and intertextual study.
argument-hint: "[--build] [--search <term>] [--tradition <tradition>]"
---

# Concordance

You are building or querying a concordance. A concordance tracks every occurrence of significant terms, names, and phrases across the sacred/historical text, enabling cross-reference, pattern detection, and intertextual study.

## Availability

This command is only available when `config.json` has a work type in the `sacred` group. Check CONSTRAINTS.json. If the work type is not sacred, return: "The concordance command is designed for sacred and historical texts. Your {work_type} doesn't use concordances."

## Prerequisites

At least one drafted unit must exist. If nothing is drafted yet, offer to run `/scr:next` first.

## What to do

### --build (or no args if no concordance exists)

Scan all drafted units. For each unit, extract:

1. **Proper nouns** -- Names of figures, places, peoples, objects with proper names. Link each to FIGURES.md and COSMOLOGY.md.
2. **Significant terms** -- Theologically loaded words (covenant, righteousness, salvation, dharma, jihad, nirvana, torah, sunnah, etc.). The writer configures which terms are "significant" via interactive selection if this is the first run.
3. **Divine names** -- All names, titles, and epithets for the divine in all forms they appear.
4. **Recurring phrases** -- Phrases that appear 3+ times across the text (likely formulaic or thematically weighted).
5. **Quoted material** -- Passages that quote or allude to other canonical sources.

Save the concordance to `.manuscript/CONCORDANCE.md` with entries like:

```markdown
## Covenant
- Genesis 9:9 (Noah)
- Genesis 15:18 (Abraham)
- Exodus 19:5 (Sinai)
- 2 Samuel 7:12 (David)
- Jeremiah 31:31 (new covenant prophecy)
- ...

## Elijah
- 1 Kings 17:1 (first appearance)
- 1 Kings 18:36 (Mount Carmel)
- 2 Kings 2:11 (translation)
- Malachi 4:5 (prophesied return)
- ...
```

Update whenever new units are drafted. The concordance is always regenerable from scratch.

### --search <term>

Query the existing concordance for occurrences of a term. Show every reference with a 1-line context snippet. Useful for the writer verifying consistency ("where else have I used 'righteousness'? does this usage match?") or for catching repetitive phrasing.

### --tradition <tradition>

Filter the concordance to only terms from a specific tradition. Useful for interfaith work or comparative study where multiple traditions are referenced.

## Cross-reference integration

The concordance feeds `/scr:sacred:cross-reference`. Entries here are used as lookup keys for finding intertextual connections. Keep them in sync.

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

Librarian-precise. This is reference work -- the writer needs accurate counts and accurate references, not commentary on significance.
