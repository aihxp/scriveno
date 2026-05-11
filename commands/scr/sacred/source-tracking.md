---
description: Track primary sources, oral traditions, manuscript variants, and source attributions. For historical and critical editions.
argument-hint: "[--add <source>] [--list] [--verify]"
---

# Source tracking

You maintain the source apparatus -- the record of primary sources, oral traditions, manuscript variants, and scholarly citations that underlie the text. Essential for historical accounts, critical editions, and any work that makes claims dependent on external sources.

## Availability

Sacred work types only. Requires WORK.md.

## What to do

### No arguments (or --list)

Show all tracked sources from `.manuscript/SOURCES.md` with their status (primary, secondary, disputed, superseded), coverage (which units they inform), and any variant readings.

### --add <source>

Add a new source to the apparatus. Prompt for:
- **Source name** -- Full reference (e.g., "Codex Sinaiticus", "Bukhari, Sahih al-Bukhari", "Mahābhārata, Pune Critical Edition")
- **Type** -- manuscript, printed edition, oral tradition, archaeological evidence, secondary scholarship
- **Date** -- Approximate date of the source itself (not the events it describes)
- **Provenance** -- Where it comes from, tradition it belongs to
- **Reliability rating** -- How the writer assesses its reliability (canonical, authoritative, contested, disputed)
- **Relevant sections** -- Which parts of the current work this source informs
- **Variant readings** -- If this source differs from others, document the variants

Save to `.manuscript/SOURCES.md`:

```markdown
## Codex Sinaiticus

**Type:** Manuscript (Greek)
**Date:** 4th century CE
**Provenance:** Found at St. Catherine's Monastery, Mount Sinai
**Reliability:** Primary -- one of the oldest complete Christian Bibles

**Coverage in this work:** Used as primary witness for Gospels and Pauline epistles

**Notable variants:**
- Mark 16:9-20 -- Sinaiticus lacks the long ending
- 1 John 5:7-8 -- Sinaiticus lacks the Johannine Comma
- ...
```

### --verify

Cross-check source citations across drafted units. Flag:
- Claims that should have a source citation but don't
- Citations to sources not in SOURCES.md
- Source attributions that contradict each other (e.g., two different sources given for the same quote)
- Variant readings that are used inconsistently (one unit uses Sinaiticus reading, another uses Vaticanus for the same passage)

Produce a report with file:line references.

## Integration

- Drafter agents, when drafting historical or critical passages, load relevant SOURCES.md entries as context
- Export commands include source apparatus in academic and critical-edition formats (LaTeX, print-ready PDF)
- `/scr:sacred:chronology` uses source dates to build the timeline
- `/scr:sacred:cross-reference` uses source relationships to identify parallel accounts

## Critical apparatus export

When exporting as a critical edition (via `/scr:publish --preset sacred-critical-edition`), the source apparatus is rendered as scholarly footnotes or endnotes in the format appropriate for the discipline:

```
Mark 16:9-20] om. ℵ B 304 sys sa^ms arm^mss Eus Hier Hes
```

The writer can choose apparatus style: traditional sigla (as above), expanded form, or modern scholarly prose.

## Tone

Bibliographic. Precision is everything. Don't paraphrase source titles or approximate dates. The critical apparatus is a trust document -- every entry must be verifiable.
