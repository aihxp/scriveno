---
description: Manage verse/ayah/pasuk numbering systems. Handles differences between traditions (Masoretic vs. Septuagint numbering, Hafs vs. Warsh Quranic numbering, etc.)
argument-hint: "[--system <system>] [--convert <from>-<to>] [--verify]"
---

# Verse numbering

You manage verse numbering across tradition-specific systems. Different traditions number the same text differently -- Psalm 10 in the Hebrew Masoretic text is Psalm 10 in most English Bibles but part of Psalm 9 in the Greek Septuagint and Latin Vulgate. Quranic ayah counts differ between Hafs and Warsh transmissions.

## Availability

Sacred work types only. Requires at least one drafted unit.

## Supported systems

- **masoretic** -- Hebrew Bible (Jewish and most Protestant)
- **septuagint** -- Greek Old Testament (Orthodox, some Catholic)
- **vulgate** -- Latin (Catholic tradition)
- **quranic_hafs** -- Hafs recitation (most common Quran numbering)
- **quranic_warsh** -- Warsh recitation (North African Quran numbering)
- **pali_canon** -- Theravada Buddhist numbering
- **sanskrit_vedic** -- Vedic hymn numbering
- **custom** -- User-defined numbering scheme

## What to do

### No arguments

Show the current numbering system from config.json. List any drafted units and their current verse counts. Highlight any numbering inconsistencies (e.g., a unit has 40 verses in one place and 41 in another).

### --system <system>

Switch the project's verse numbering system. Warning: this is a significant change. Show the writer what will be renumbered and ask for confirmation. On yes, rewrite verse markers throughout drafted units and update `.manuscript/config.json` with top-level `verse_numbering_system`. For older projects that already contain `sacred.verse_numbering_system`, mirror the value there as a legacy compatibility field.

### --convert <from>-<to>

Generate a conversion table between two numbering systems. Useful for commentaries that need to reference both systems, or for translations aligning to a canonical target.

Output format:

```
Genesis 31:55 (Masoretic) = Genesis 32:1 (Septuagint)
Psalm 51:1 (English) = Psalm 51:3 (Hebrew)
...
```

Save the conversion table to `.manuscript/verse-conversion-{from}-{to}.md` for reference.

### --dual

Show dual numbering side by side where two systems diverge. Useful for commentaries or translations that need to reference both systems:

```
Psalm 51:1 (English) / Psalm 51:3 (Hebrew Masoretic)
Genesis 31:55 (Masoretic) / Genesis 32:1 (Septuagint)
```

Store numbering metadata in `.manuscript/verse-map.json` with entries mapping each verse to its equivalent in other systems. This JSON file enables automated conversion and export in any numbering system.

### --verify

Scan all drafted units and flag any verse numbering issues:
- Non-sequential numbers (missing or duplicated)
- References to verses that don't exist
- Cross-references in CONCORDANCE.md that don't resolve
- Verses split or merged in ways that don't match the configured system
- Mixed systems in the same unit

Produce a report with specific file:line locations.

## Integration

- Export commands use verse numbering for pagination, cross-reference rendering, and index generation
- `/scr:sacred:concordance` and `/scr:sacred:cross-reference` use the numbering as primary keys
- `/scr:sacred:annotation-layer` uses verse numbers as anchors -- annotations are tied to specific verses
- Translation work must preserve the source numbering system (or explicitly convert)

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

Technical and exact. Verse numbering is a mechanical concern with theological consequences -- a misnumbered cross-reference is a research error. Precision over prose.
