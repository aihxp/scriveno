---
description: Generate a structure-aware pacing report analyzing scene tempo and narrative flow.
argument-hint: "[N] [--seams]"
---

# /scr:pacing-analysis -- Structure-Aware Pacing Report

Generate a pacing report that analyzes scene tempo, narrative flow, and structural rhythm.

## Usage
```
/scr:pacing-analysis [N]
/scr:pacing-analysis [N] --seams
```

Where `N` is the scope (act, chapter, or section number depending on work type). Omit `N` to analyze the entire manuscript.

Add `--seams` to focus the report on the joints between units: how each unit's closing energy hands off to the next unit's opening, momentum patterns across the whole arc, and the specific boundaries where the seam is abrupt or flat.

## Instruction

You are a **pacing analyst**. Your job is to map the narrative rhythm, identify pacing problems, and ensure the story's tempo serves its structure.

---

### STEP 0: LOAD CONTEXT

1. Load `config.json` to determine work type and hierarchy
2. Load `CONSTRAINTS.json` -- this command is **hidden** from poetry and speech_song work types. If the current work type is in a hidden group, inform the writer and exit gracefully
3. Load `OUTLINE.md` -- extract structural context: which scenes are intended as climaxes, which are transitions or breathers, the overall arc shape, and any pacing notes the writer included during planning
4. Load the drafted prose for scope `N` (or full manuscript if `N` is omitted)
5. If `--seams` is set, treat STEP 6 (Seam and Cross-Unit Momentum) as the primary analysis and keep STEPS 1-5 brief; otherwise run every step and include STEP 6 as a section of the full report

---

### STEP 1: SCENE LENGTH DISTRIBUTION

<scene_length_analysis>
  For each scene/chapter in scope:
  - Count word length
  - Calculate mean and median scene length
  - Identify **outliers**: scenes more than 1.5x the median (unusually long) or less than 0.5x the median (unusually short)
  - Note whether outlier length is intentional (a climax scene being longer is expected; a transition being long is suspicious)

  Present as a distribution chart:
  ```
  Ch 1  ████████████████████ 3,200w
  Ch 2  ████████████ 1,900w
  Ch 3  ████████████████████████████ 4,500w  [LONG]
  Ch 4  ████████ 1,200w
  Ch 5  ██████████████ 2,100w
  ```
</scene_length_analysis>

---

### STEP 2: TEMPO MAPPING

<tempo_classification>
  Classify each scene's dominant tempo:
  - **Action**: Physical conflict, chase, fight, urgent movement
  - **Tension**: Psychological conflict, suspense, dread, anticipation
  - **Revelation**: Discovery, plot twist, secret revealed, realization
  - **Transition**: Travel, time passage, setup for next sequence
  - **Reflection**: Internal processing, emotional aftermath, quiet character moment

  Map the resulting rhythm across the narrative:
  ```
  Ch 1  [Tension]     ▓▓▓▓▓▓▓▓
  Ch 2  [Reflection]  ░░░░░░
  Ch 3  [Action]      ████████████
  Ch 4  [Revelation]  ▒▒▒▒▒▒▒▒▒
  Ch 5  [Transition]  ░░░░
  Ch 6  [Action]      ██████████████
  Ch 7  [Tension]     ▓▓▓▓▓▓▓▓▓▓
  ```

  Flag patterns:
  - **Monotone**: 3+ consecutive scenes at the same tempo
  - **Whiplash**: Jarring tempo shifts without transition
  - **Missing type**: If no reflection scenes exist in a character-driven story, or no action in a thriller
</tempo_classification>

---

### STEP 3: CLIMAX VS BREATHER BALANCE

<climax_breather_analysis>
  Cross-reference tempo map with OUTLINE.md structural intentions:
  - Are scenes marked as climaxes actually written at high intensity?
  - Is there a breather scene (reflection or transition) after each high-intensity sequence?
  - Are there too many consecutive scenes at the same intensity level?
  - Does the intensity generally build toward structural climax points?

  Flag:
  - **Missing breather**: High-intensity scene followed immediately by another high-intensity scene without relief (reader fatigue risk)
  - **Missing escalation**: Breather followed by breather followed by breather (momentum loss)
  - **Structural mismatch**: A scene marked as climax in the outline that reads at low intensity in the draft, or vice versa
</climax_breather_analysis>

When the structural mismatch above appears (a scene marked as a climax that reads at low intensity), suggest `/scr:climax` to devise and pressure-test the climax before redrafting it.

---

### STEP 4: OPENING AND CLOSING ENERGY

<energy_analysis>
  For each chapter/scene:
  - **Opening hook**: Does the first paragraph create a question, conflict, or sensory pull that makes the reader want to continue? Rate: Strong / Adequate / Weak
  - **Closing propulsion**: Does the final paragraph create forward momentum -- a cliffhanger, question, emotional charge, or promise of what's next? Rate: Strong / Adequate / Weak

  Flag:
  - Chapters that open with exposition or backstory (energy drain)
  - Chapters that close without forward pull (reader puts the book down)
  - Consecutive weak openings or closings (pattern problem)
</energy_analysis>

---

### STEP 5: SAGGY MIDDLE DETECTION

<saggy_middle_check>
  Examine the 40-60% mark of the manuscript (by word count):
  - Does the pacing drop noticeably compared to the first and third acts?
  - Are there scenes in this section that lack clear stakes or forward momentum?
  - Does this section contain an unusual concentration of transition or reflection scenes?
  - Is the protagonist reactive rather than proactive in this stretch?

  If pacing drops in the middle:
  - Check whether it's **intentional** (the outline marks this as a breathing space, a slow burn, or a deliberate structural choice)
  - If unintentional, suggest specific interventions: raise stakes, add a midpoint reversal, cut or compress low-energy scenes, add a ticking clock
</saggy_middle_check>

---

### STEP 6: SEAM AND CROSS-UNIT MOMENTUM

<seam_analysis>
  STEPS 1-5 judge each unit on its own. This step judges the joints between units -- where most "it dragged" and "I couldn't put it down" reactions actually live.

  Walk every consecutive boundary (end of unit *i* into start of unit *i+1*). For each boundary, pair the **closing propulsion** of unit *i* with the **opening hook** of unit *i+1* (reuse the Strong / Adequate / Weak ratings from STEP 4) and classify the seam:
  - **Clean handoff**: a settled close into a purposeful open. Fine when the outline marks a beat or act break here.
  - **Hook-into-hook**: a propulsive close into a grabbing open. High momentum; watch for exhaustion if every seam is this.
  - **Hard cut**: a deliberate, abrupt jump (POV, place, time) that the open immediately orients. Strong when controlled.
  - **Soft fade**: a quiet close into a quiet open. Two in a row is a momentum risk.
  - **Abrupt / whiplash**: a jump the next open does not orient the reader into -- the reader is lost rather than propelled. Flag with the boundary.
  - **Flat seam**: both sides weak (a unit that closes without pull into a unit that opens on exposition or backstory). The likeliest place a reader stops.

  Then look across all the seams for patterns:
  - **Device monotony**: the same closing device repeated across many consecutive boundaries (for example five chapters in a row that end on a cliffhanger, or all on a quiet image). Even strong devices flatten when they become the only gear.
  - **Weak-side runs**: three or more consecutive weak closings, or weak openings -- a pattern problem, not a one-off.
  - **Momentum flatline**: a stretch where successive seams are all soft or flat, usually overlapping the saggy middle from STEP 5.
  - **Build toward structure**: cross-reference OUTLINE.md -- does seam energy generally rise toward marked climaxes and ease after them, or stay level throughout?
</seam_analysis>

<seam_output>
  Present a **Transition and Momentum Map**: one row per boundary showing the close rating, the open rating, and the seam type.
  ```
  Ch 1 -> Ch 2   close: Strong    open: Weak       [FLAT SEAM]
  Ch 2 -> Ch 3   close: Strong    open: Strong     [hook-into-hook]
  Ch 3 -> Ch 4   close: Adequate  open: Adequate   [clean handoff]
  Ch 4 -> Ch 5   close: Weak      open: Weak       [FLAT SEAM]
  ```
  List every flat or abrupt seam as a finding tied to its specific boundary, then note any device-monotony or weak-side-run pattern.

  For each weak seam, recommend a fix in the writer's own transition vocabulary: load the **Transitions** section of STYLE-GUIDE.md (`SCENE_TRANSITIONS`, `CHAPTER_TRANSITIONS`, `SCENE_BREAK_MARKER`, `TIME_JUMP_MARKER`) and frame the options the way the writer prefers, whether a hard cut, a time-marked break, or a short bridging passage. Diagnose the seam; do not rewrite the prose here. To repair a specific boundary, point the writer to `/scr:bridge <boundary>`, which diagnoses that one seam and applies only the fix the writer chooses.
</seam_output>

---

### OUTPUT

Present findings in this order:

1. **Visual Tempo Map**: The combined scene length + tempo visualization showing the full narrative rhythm at a glance

2. **Pacing Health Summary**:
   - Overall pacing assessment (well-paced / front-loaded / back-loaded / saggy middle / monotone)
   - Strongest pacing section and why
   - Weakest pacing section and why

3. **Findings by Dimension**: Detailed findings for each analysis dimension, grouped by severity:
   - High: Structural pacing problems that affect reader engagement
   - Medium: Missed opportunities for better rhythm
   - Low: Fine-tuning suggestions

4. **Recommendations**: Prioritized list of specific changes, from most impactful to least

Always include the **Transition and Momentum Map** from STEP 6. When `--seams` is set, lead with that map and the seam findings and keep the STEP 1-5 sections to a short summary.

Save to `.manuscript/{scope}-PACING-REPORT.md` where `{scope}` is the act/chapter identifier or `full` for the entire manuscript.

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
