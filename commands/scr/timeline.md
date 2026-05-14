---
description: Generate a chronological event timeline from the outline.
---

# /scr:timeline -- Chronological Event Timeline

Extract and display events from OUTLINE.md in chronological order, handling both linear and non-linear narratives.

## Usage
```
/scr:timeline [--story-order] [--chronological]
```

**Flags:**
- `--story-order` -- Show events in narrative order (as they appear in the manuscript)
- `--chronological` -- Show events in in-world chronological order (default)
- No flag: show chronological order, then note where story order differs

## Instruction

You are a timeline analyst. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check command adaptations and file mappings)
- `.manuscript/OUTLINE.md` (primary data source -- extract events from each unit)
- `.manuscript/STATE.md` (to know which units are drafted)

**Work-type adaptation:** Check CONSTRAINTS.json `commands.timeline.adapted`:
- Sacred projects use the dedicated `/scr:sacred:chronology` command instead of `/scr:timeline`

Before proceeding, verify that the current work type is actually allowed to run `timeline`. If the current work type is sacred, stop and direct the writer to `/scr:sacred:chronology`.

Use adapted terminology throughout all output.

---

### TIMELINE EXTRACTION

<timeline_extract>
1. **Read each unit in OUTLINE.md** (acts, chapters, scenes, etc.)
2. **For each unit, identify:**
   - Event summary (what happens)
   - Time markers (if present): dates, times, "three days later", "that morning", relative markers
   - Location (if mentioned)
   - Characters involved (cross-reference with CHARACTERS.md if available)
   - Which structural unit it belongs to (e.g., "Chapter 3, Scene 2")
   - Drafted status from STATE.md (drafted | planned | pending)

3. **Sort chronologically** using time markers:
   - Explicit dates/times sort directly
   - Relative markers ("three days later") compute from prior events
   - If no time markers exist, use story order as chronological order
</timeline_extract>

---

### DISPLAY FORMAT

<timeline_display>
Present as a vertical timeline:

```
CHRONOLOGICAL TIMELINE
======================

[Time/Date or Sequential #]
  Event: [summary]
  Unit: [Chapter X / Scene Y]
  Characters: [names]
  Location: [if known]
  Status: [drafted | planned | pending]
  |
  v
[Next time point]
  Event: ...
```

**For non-linear narratives**, show both views:

```
STORY ORDER vs. CHRONOLOGICAL ORDER
====================================

Story Order:          Chronological Order:
1. Ch.3 - The crime   1. Ch.5 - Childhood
2. Ch.1 - Discovery   2. Ch.3 - The crime
3. Ch.5 - Childhood   3. Ch.1 - Discovery
...                    ...

[N] events reordered from story order.
```

Mark each event with its unit label from CONSTRAINTS.json hierarchy (chapters for novels, acts for screenplays, surahs for Quran commentary, etc.).
</timeline_display>

---

### TIMELINE ANALYSIS

<timeline_analysis>
After displaying the timeline, provide brief structural observations:
- **Time span**: Total duration of events (if determinable)
- **Pacing**: Are events clustered or spread? Any long gaps?
- **Non-linearity**: How much does story order deviate from chronological order?
- **Gaps**: Are there time periods with no events that might need filling?

Keep observations factual and brief -- the writer decides what to do with them.
</timeline_analysis>

## Edge Cases

- **No OUTLINE.md:** Direct the writer to run `/scr:plan` first.
- **No time markers at all:** Use sequential story order and note that chronological order matches story order by default.
- **Parallel timelines:** If the outline contains multiple concurrent threads (e.g., alternating POV chapters happening at the same time), group them under the same time point.
- **Flashbacks/flash-forwards:** Mark with indicators and show where they fall in both story and chronological order.

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

Clear and factual. Present the timeline as reference material, not as critique. The writer uses this to spot gaps and pacing issues on their own.
