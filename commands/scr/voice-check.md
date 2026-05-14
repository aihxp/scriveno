---
description: Compare drafted prose against STYLE-GUIDE.md to detect voice drift.
---

# /scr:voice-check -- Voice Fidelity Check

Compare drafted prose against STYLE-GUIDE.md to detect voice drift, AI-slop patterns, and stylistic inconsistency. Wraps the voice-checker agent.

## Usage
```
/scr:voice-check [N]
```

- `N` -- Scope to a specific unit (act, chapter, surah, etc. per work type). Omit for full manuscript.

## Instruction

You are orchestrating a **voice fidelity check**. Your job is to feed the right files to the voice-checker agent, scope the review correctly, and format the output for the writer.

---

### STEP 1: LOAD CONTEXT AND VALIDATE

1. Load `config.json` -- determine work type and structural hierarchy
2. Load Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) -- check for adapted command name:
   - Sacred work types use **register-check** instead of voice-check (per CONSTRAINTS.json `adapted.sacred.rename`)
   - Adapt the report title and terminology accordingly (e.g., "Register Check Report" instead of "Voice Check Report")
3. Check for `STYLE-GUIDE.md`:
   - **If STYLE-GUIDE.md exists:** Load it. Proceed.
   - **If STYLE-GUIDE.md does NOT exist:** STOP. Tell the writer: "Voice check requires a voice profile. Run `/scr:profile-writer` first to generate your STYLE-GUIDE.md, then re-run this command."
4. Load drafted prose from `.manuscript/drafts/body/`
   - If `N` is provided, load only unit `N`
   - If omitted, load all drafted units

**Prerequisite check:** If no drafts exist, tell the writer to run `/scr:draft` first.

---

### STEP 2: SPAWN VOICE-CHECKER AGENT

Spawn the voice-checker agent (`agents/voice-checker.md`) with:
- The full `STYLE-GUIDE.md` content
- The scoped drafted prose (unit `N` or all units)
- If available, previously approved units as reference anchors for comparison

The voice-checker agent performs deep analysis across four dimensions:

1. **Structural voice** -- POV consistency, tense consistency, sentence architecture, paragraph rhythm
2. **Lexical voice** -- Register match, word origin preference, jargon handling, figurative density
3. **Character voice** -- Dialogue differentiation, narrator voice stability
4. **AI-slop indicators** -- Hedging language, over-explaining, adverbial clusters, generic metaphors, symmetrical sentence lengths, moralizing closings

---

### STEP 3: SCORE AND CLASSIFY

Based on the agent's analysis, generate an overall voice fidelity score:

- **80-100 -- PASS**: Voice is consistent with STYLE-GUIDE.md. Minor issues noted but not actionable.
- **60-79 -- WARNING**: Noticeable voice drift detected. Issues flagged for writer review. Draft is usable but should be revised.
- **Below 60 -- FAIL**: Significant voice drift. The draft does not sound like the writer. Recommend re-drafting problem sections or recalibrating with `/scr:voice-test`.

---

### STEP 4: FORMAT ISSUES

For each issue the agent identifies, present:

```
**Passage:** "The ramifications of his decision were, in many ways, quite significant and far-reaching."
**Expected (per STYLE-GUIDE.md):** Short, punchy sentences. Anglo-Saxon vocabulary preference. No hedging.
**Found:** Latinate vocabulary ("ramifications," "significant"), hedging ("in many ways," "quite"), run-on construction.
**Severity:** HIGH -- AI-slop pattern (hedging + Latinate stack)
```

Group issues by the agent's check categories:
1. Structural voice issues
2. Lexical voice issues
3. Character voice issues
4. AI-slop flags

---

### STEP 5: RECOMMENDATIONS

Based on the score:

- **PASS (80+):** Congratulate the writer. Note any low-severity items as optional polish. Suggest proceeding to `/scr:copy-edit` or `/scr:submit`.
- **WARNING (60-79):** List the top issues by severity. Suggest targeted revisions -- specific passages to rework, not wholesale re-drafts. Offer to re-run voice-check after revisions.
- **FAIL (below 60):** Recommend re-drafting the worst sections. If the problem is systemic (wrong register throughout), suggest running `/scr:voice-test` to recalibrate the voice profile. If STYLE-GUIDE.md may be outdated, suggest re-running `/scr:profile-writer`.

---

### OUTPUT

Save the full report to `.manuscript/{scope}-VOICE-CHECK-REPORT.md` where `{scope}` is the unit identifier (e.g., `act-1`, `chapter-3`) or `full` for the entire manuscript.

Present the score, status, and top issues to the writer. Offer to show the full report.

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
