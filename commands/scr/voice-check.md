---
description: Compare drafted prose against STYLE-GUIDE.md to detect voice drift.
---

# /scr:voice-check -- Voice Fidelity Check

Compare drafted prose against STYLE-GUIDE.md to detect voice drift, AI-slop patterns, and stylistic inconsistency. Wraps the voice-checker agent.

This is a diagnostic: it returns an authenticity band, a 0-100 score, and flagged spans with reasons. It does not rewrite and never hands back a "suggested" version of a span; fixing flagged prose is a separate transform step (`/scr:line-edit`, `/scr:polish`, or a re-draft) the writer chooses, after which this command re-runs as a fresh read. This separation prevents a score-then-rewrite gaming loop; never carry a target score into the rewrite. The check is an honest read of how authentically the prose reads as the writer's own work; it is not tuned to defeat any plagiarism or AI-detection system and names none. Reframe any "get this past a graded or contractual check" request toward the honest diagnostic.

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

Because STYLE-GUIDE.md is present, this is voice-deviation framing: the agent measures deviation *from* the writer's voice, not against a generic ideal. An authentic writer habit is not a tell for that writer even when a generic catalog would flag it; STYLE-GUIDE.md wins.

The voice-checker agent runs its diagnostic discipline: a scrutiny pre-check (match scrutiny to evidence density; low density biases hard toward a high score), a mandatory false-positive audit with veto power (lone weak signals dropped without lowering the score; strong false positives reclassified as human markers that raise it), and an internal-consistency check (sharp register or sophistication seams flagged against the document's own baseline). It performs deep analysis across four dimensions:

1. **Structural voice** -- POV consistency, tense consistency, sentence architecture, paragraph rhythm
2. **Lexical voice** -- Register match, word origin preference, jargon handling, figurative density
3. **Character voice** -- Dialogue differentiation, narrator voice stability
4. **AI-slop indicators** -- Hedging language, over-explaining, adverbial clusters, generic metaphors, symmetrical sentence lengths, moralizing closings

---

### STEP 3: SCORE AND CLASSIFY

Use the agent's banded score. Report the band first; the number refines it. The score is a calibrated heuristic, not a verdict and not a formula (the agent starts from a neutral ~70 and moves from there); do not over-precisify, and a flag the false-positive audit dropped must not lower it while one it reclassified as a human marker must raise it.

- **90-100 -- Reads human / PASS**: Voice is consistent with STYLE-GUIDE.md. Near-empty flag list, strong human markers. Minor items optional. Bias here when scrutiny was low.
- **75-89 -- Mixed signals / WARNING**: Some real drift or one inserted region in otherwise human prose. Flag for writer review; draft usable but should be revised.
- **60-74 -- Mixed signals (notable) / FAIL**: Noticeable drift. Recommend re-drafting the worst sections.
- **Below 60 -- Reads AI-generated / FAIL**: Significant drift; the draft does not sound like the writer. Recommend re-drafting problem sections or recalibrating with `/scr:voice-test`.

---

### STEP 4: FORMAT ISSUES

For each issue the agent identifies, present:

```
**Passage:** "The ramifications of his decision were, in many ways, quite significant and far-reaching."
**Expected (per STYLE-GUIDE.md):** Short, punchy sentences. Anglo-Saxon vocabulary preference. No hedging.
**Found:** Latinate vocabulary ("ramifications," "significant"), hedging ("in many ways," "quite"), run-on construction.
**Severity:** HIGH -- AI-slop pattern (hedging + Latinate stack)
```

Describe the problem in each flag; never include a "suggested" or rewritten version of a span, not even parenthetically.

Group issues by the agent's check categories:
1. Structural voice issues
2. Lexical voice issues
3. Character voice issues
4. AI-slop flags

The report must also carry two required sections, even on a high or low score:

- **Reads as human (deliberately not flagged)**: one to three markers that looked like possible tells but are authentic to STYLE-GUIDE.md, the work type, or the writer's register, and why each was credited. Naming what was correctly credited as human makes over-flagging visible.
- **Caveat**: this is a heuristic read, not proof of authorship; it names no detector; a high score is not a guarantee and a low score is not an accusation; the writer's judgement is required to act on it.

---

### STEP 5: RECOMMENDATIONS

Recommendations are handoffs, not rewrites: this command diagnosed, the writer decides what to act on, a transform step does the rewriting, and re-running `/scr:voice-check` is a fresh re-verify. Based on the band:

- **Reads human (90+):** Congratulate the writer. Note any low-severity items as optional polish. Suggest proceeding to `/scr:copy-edit` or `/scr:submit`.
- **Mixed signals (75-89):** List the top issues by severity. Suggest targeted revisions via `/scr:line-edit` or `/scr:polish` -- specific passages to rework, not wholesale re-drafts. Offer to re-run voice-check after revisions as the re-verify.
- **Mixed signals notable / Reads AI-generated (below 75):** Recommend re-drafting the worst sections. If the problem is systemic (wrong register throughout), suggest running `/scr:voice-test` to recalibrate the voice profile. If STYLE-GUIDE.md may be outdated, suggest re-running `/scr:profile-writer`.

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
