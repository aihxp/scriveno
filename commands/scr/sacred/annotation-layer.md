---
description: Add or manage a commentary/exegetical layer alongside the primary sacred text. Support multiple annotation traditions simultaneously.
argument-hint: "[tradition_name] [--list] [--remove <tradition>]"
---

# Annotation layer

You manage annotation layers -- commentary or exegetical notes attached to the primary text without altering it. Multiple annotation traditions can coexist (e.g., Catholic + Reformed + Orthodox annotations on the same Bible text, or Sunni + Shia annotations on the same Quran text).

## Availability

Sacred work types only. Requires at least one drafted unit.

## What to do

### No arguments (or tradition name)

If a tradition name is passed, work within that tradition. If not, ask which tradition to annotate in. If this is the first annotation layer, the writer chooses a name (e.g., "catholic_tradition", "reformed_tradition", "critical_scholarship", "devotional_notes").

Annotation layers live in `.manuscript/annotations/{tradition}/`. Each file corresponds to a primary draft file:

```
.manuscript/
├── 1-1-DRAFT.md                        (primary text)
├── annotations/
│   ├── catholic_tradition/
│   │   ├── 1-1-ANNOTATIONS.md          (Catholic commentary on 1-1)
│   │   └── 1-2-ANNOTATIONS.md
│   ├── reformed_tradition/
│   │   ├── 1-1-ANNOTATIONS.md          (Reformed commentary on 1-1)
│   │   └── 1-2-ANNOTATIONS.md
│   └── critical_scholarship/
│       └── 1-1-ANNOTATIONS.md          (Historical-critical notes)
```

For each verse/passage, produce annotations of:
- **Interpretation** -- How this tradition reads this passage
- **Theological significance** -- What doctrines this passage supports or shapes
- **Historical/philological notes** -- Text-critical issues, original language nuances
- **Cross-references** -- What other passages this tradition reads alongside this one
- **Contested points** -- Where this tradition diverges from others

### --list

Show all annotation traditions currently in the project with annotation counts:

```
Annotation traditions:
- catholic_tradition: 142 verses annotated
- reformed_tradition: 89 verses annotated
- critical_scholarship: 201 verses annotated (some differ from above)
- devotional_notes: 45 verses annotated
```

### --remove <tradition>

Remove an annotation layer entirely. Ask for confirmation -- this is destructive. Offer to archive instead.

## Integration with export

When exporting, the writer can choose which annotation layers to include:

- **Clean text only** -- primary text, no annotations
- **Single tradition** -- primary text with one annotation layer
- **Comparative** -- primary text with multiple annotation layers side-by-side or as footnotes
- **Full scholarly** -- every annotation layer + critical apparatus

The `/scr:publish` wizard asks about annotation inclusion when building the publishing pipeline.

## Integration with the drafter

When drafting annotations, the drafter agent loads:
- The primary text passage being annotated
- The tradition's characteristic interpretive approach (from FRAMEWORK.md)
- Any other annotations on the same passage in the same tradition (for consistency)
- DOCTRINES.md entries relevant to this passage

Annotations should sound like the tradition they represent. Catholic annotations should sound like Catholic scholarship; Reformed should sound like Reformed; critical should sound like critical.

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

Scholarly when annotating academic traditions, devotional when annotating devotional traditions, pastoral when annotating pastoral traditions. Match the voice to the annotation tradition, not to the primary text's voice.
