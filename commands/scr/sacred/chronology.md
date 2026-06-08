---
description: Timeline management with era-appropriate dating systems. Handles overlapping calendars and disputed dates.
argument-hint: "[--calendar <system>] [--verify] [--range <start>-<end>]"
---

# Chronology

You manage the sacred/historical text's timeline using appropriate dating systems. Replaces the standard `/scr:timeline` command for sacred work types.

## Availability

Sacred work types. Works without drafted content (can be populated from OUTLINE.md alone).

## Calendar systems supported

- **gregorian** -- Standard CE/BCE
- **hebrew** -- Anno Mundi (AM)
- **hijri** -- Anno Hegirae (AH)
- **vikram_samvat** -- Hindu calendar
- **buddhist_era** -- BE
- **regnal** -- "In the 14th year of King X"
- **multiple** -- Show all systems side by side

Default is whatever is set in config.json's top-level `calendar_system`. For older projects only, if top-level `calendar_system` is absent and `sacred.calendar_system` exists, use that legacy fallback. The `--calendar` flag overrides temporarily.

## What to do

### No arguments

Build a timeline from:
1. OUTLINE.md (planned structure)
2. Drafted units (extract date references)
3. CHRONOLOGY.md (existing canonical dates)
4. LINEAGES.md (for regnal dating, use king lists)

For each event, record:
- Event description
- Primary date in configured calendar system
- Cross-reference to other calendar systems if `multiple` is set
- Source (which unit/passage)
- Confidence (high if explicitly dated, medium if calculated, low if inferred)

Save to `.manuscript/CHRONOLOGY.md`:

```markdown
## Timeline (Anno Hegirae)

**Year 1 AH** -- Hijrah to Medina [Surah 9:40 reference]
**Year 2 AH** -- Change of qibla [Surah 2:142-144]
**Year 2 AH** -- Battle of Badr [Surah 3:123, 8:17]
**Year 3 AH** -- Battle of Uhud [Surah 3:121-155]
...
```

For traditions with disputed dates, show the range:

```markdown
**c. 2000-1800 BCE** -- Abraham's migration (range reflects scholarly uncertainty)
```

### --verify

Cross-check chronological claims across drafted units. Flag:
- Events in wrong order relative to established dates
- Ages that don't match the timeline (e.g., character described as elderly when timeline says they're 30)
- Regnal year references that contradict the king list
- "Years later" phrases that don't match the established gap
- Seasonal references that don't match the lunar calendar if applicable

### --range <start>-<end>

Show only events within a specific date range. Useful when drafting a section set in a particular period.

### --calendar <system>

Switch to a different calendar system for display. Dates are stored internally in a neutral format and rendered in the requested system.

## Integration

- Drafter agents use this file to avoid anachronisms
- Continuity-checker cross-references this when verifying drafts
- `/scr:sacred:cross-reference` uses chronology to identify prophecy/fulfillment pairs
- `/scr:sacred:source-tracking` uses it to align primary sources with the narrative timeline

## Handling disputes

Sacred chronologies often have disputes (Egyptian vs. biblical chronology, early vs. late dating of events, regnal year overlap between co-regents). Record the dispute in a note:

```markdown
**Year X** -- Event
> Note: Disputed. Traditional dating is Year X. Critical scholarship suggests Year Y. This project follows the traditional dating per FRAMEWORK.md stance.
```

Don't hide disputes -- surface them and let the writer decide which to follow.

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

## Tone

Historical-clerical. You're compiling a chronological reference, not telling a story. Precision, citations, and humility about uncertainty.
