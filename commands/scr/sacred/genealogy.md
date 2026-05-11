---
description: Build and verify genealogical trees and lineages for figures in the text. Catches contradictions across chapters.
argument-hint: "[--verify] [--figure <name>] [--tradition <tradition>]"
---

# Genealogy

You manage genealogical trees and lineages. Essential for texts with significant "begat" passages, tribal affiliations, teacher-student chains, or dynastic succession.

## Availability

Sacred work types only. Requires `FIGURES.md` with at least 2 figures.

## What to do

### No arguments

Build the genealogy from FIGURES.md and LINEAGES.md. Extract every lineage statement, parent-child relationship, tribal affiliation, teacher-student link, and dynastic succession. Assemble into a structured tree.

Save to `.manuscript/GENEALOGY.md` with trees rendered in text form:

```
Abraham
├── Ishmael
│   └── (12 princes of Ishmael)
└── Isaac
    ├── Esau
    │   └── (Edomites)
    └── Jacob/Israel
        ├── Reuben
        ├── Simeon
        ├── Levi
        │   └── (priesthood)
        ...
```

For traditions with teacher-student chains, show the transmission sequence:

```
Śākyamuni Buddha
└── Mahākāśyapa
    └── Ānanda
        └── Śāṇavāsa
            └── ...
```

### --verify

Cross-check every genealogical claim in drafted units against LINEAGES.md. Flag any:
- Parent-child contradictions (text says A is B's father in one place, C is B's father in another)
- Impossible ages (X is described as young during an event when the genealogy says X was 80)
- Missing generations (text references "great-grandfather" but no such relation exists in the tree)
- Tribal affiliation conflicts (X is described as Levite in one passage, Judahite in another)
- Succession gaps (teacher-student chain skips a generation with no explanation)

Produce a report with specific citations and suggest fixes.

### Lineage types

Support multiple lineage types in the tree, distinguishing between:
- **biological** -- Blood relationships (parent-child, sibling)
- **covenantal** -- Covenant-based relationships (adoption, divine promise lines)
- **spiritual** -- Teacher-student, guru-disciple, rabbinic succession, apostolic succession
- **royal** -- Dynastic succession, tribal leadership, hereditary priesthood

Mark each relationship edge with its type. A single figure can appear in multiple lineage types (e.g., Jesus in both biological/Davidic and covenantal/Abrahamic lines).

### --figure <name>

Show the full ancestry and descendants of a specific figure, with every text reference. Useful when drafting scenes involving that figure to make sure family relationships are consistent.

### --tradition <tradition>

Filter to a specific lineage tradition (e.g., rabbinic succession, apostolic succession, Sufi silsila).

## Integration

The drafter agent uses this file when writing any passage involving genealogical claims. The continuity-checker agent cross-references this file when verifying drafts.

`/scr:sacred:doctrinal-check` flags any theological claim that depends on a contested genealogical link.

## Tone

Archival. Genealogies are factual claims with high stakes in sacred texts -- precision matters more than elegance. Use diagrams where trees get complex.
