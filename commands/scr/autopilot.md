---
description: Run the full drafting pipeline autonomously. Choose guided, supervised, or full-auto profiles.
argument-hint: "[--profile guided|supervised|full-auto] [--from <stage>] [--to <stage>] [--unit N] [--resume]"
---

# Autopilot

You are running the Scriven pipeline autonomously. Your job is to execute the discuss-plan-draft-review-submit chain for each unit in OUTLINE.md, pausing only when the active profile requires it.

## What to do

0. **Bootstrap (context-cost protocol).** Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, phase, current unit, recent activity, open items) and skip the corresponding raw-file loads in steps 1-3 below; you still need to read `OUTLINE.md` for unit ordering and `config.json` for the `autopilot` settings block specifically. If CONTEXT.md is missing, stale, or contradicts STATE.md, run steps 1-3 unchanged. See `docs/context-protocol.md` for the contract.

1. **Read `.manuscript/config.json`** for autopilot settings: `profile` (guided, supervised, or full-auto), `enabled`, and `custom_checkpoints` array.

2. **Read `.manuscript/STATE.md`** for current position: current unit, current stage, progress counters, and last actions.

3. **Read `.manuscript/OUTLINE.md`** for total units and their order. This is the master list of what needs to be drafted.

4. **If `--resume` flag is set:** Read STATE.md "Session handoff" and "Progress" sections. Determine the last completed unit and the last stage completed. Output ONE sentence explaining where you left off (e.g., "Last time, you drafted chapter 3 and passed voice check. Picking up at chapter 4, discuss stage."). Then re-enter the main loop from that point.

5. **If `--profile` flag is set:** Override the config.json profile with the provided value. Valid values: `guided`, `supervised`, `full-auto`.

6. **Enter the main loop** (see below).

## Main loop

```
FOR each unit in OUTLINE.md (starting from current position):
  FOR each stage in [discuss, plan, draft, review, submit]:
    Execute the canonical stage command (/scr:discuss, /scr:plan, etc.) with the unit number as an argument
    Update STATE.md with: timestamp, command name, unit, outcome
    Check pause conditions (see Profile rules below)
    If paused: show review prompt, wait for writer input
    If writer says "stop": exit loop, save state to STATE.md
    If writer says "skip": advance to next unit, update STATE.md
```

When the loop completes (all units through all stages), show a completion summary: total units, total word count, voice consistency across the manuscript, any flags or issues encountered.

## Profile rules

### Guided

The writer reviews after every atomic unit. This is the safest, most hands-on profile.

**Pause behavior:** Pause after EVERY atomic unit draft completion.

**At each pause, show:**
1. One-sentence summary of what was drafted
2. The last 200 words of the drafted prose (so the writer can spot-check voice and tone without opening the file)
3. Prompt: **"approve / revise / stop"**

**On writer response:**
- **"approve"** -- Continue to the next unit or stage
- **"revise"** -- Re-enter the draft stage for that unit. Ask the writer what to change, then re-draft with their feedback incorporated
- **"stop"** -- Save current position to STATE.md and exit the loop. The writer can resume later with `--resume`

### Supervised

The writer reviews at structural boundaries. Less interruption, still provides oversight.

**Pause behavior:** Batch by structural unit boundary. Use the `mid` level from the work type hierarchy in CONSTRAINTS.json to determine boundaries.

- For a novel: `hierarchy.mid = "chapter"` -- pause when ALL scenes in a chapter are drafted
- For a screenplay: `hierarchy.mid = "sequence"` -- pause when ALL scenes in a sequence are drafted
- For a memoir: `hierarchy.mid = "chapter"` -- pause when ALL vignettes in a chapter are drafted
- For any work type: read CONSTRAINTS.json for the work type's hierarchy, use the `mid` level as the batch boundary

**Boundary detection:** Read OUTLINE.md to determine which atomic units belong to which mid-level unit. After completing each atomic unit, check whether all atomic units in the current mid-level unit are now complete. If yes, pause.

**At each pause, show:**
1. List of completed units with word counts (e.g., "Chapter 3: Scene 1 (847 words), Scene 2 (1,102 words), Scene 3 (956 words)")
2. Total word count for the structural unit
3. Prompt: **"continue / review [unit] / stop"**

**On writer response:**
- **"continue"** -- Proceed to the next structural unit
- **"review [unit]"** -- Show the specified unit's draft for the writer to read and comment on
- **"stop"** -- Save state and exit

### Full-auto

The writer trusts the pipeline. Autopilot runs until the entire manuscript is complete.

**Pause behavior:** Run until ALL units are complete. Pause ONLY on these conditions:

1. **Continuity contradiction** the agent cannot resolve (e.g., a character is in two places at once, a previously established fact is contradicted)
2. **Voice drift** exceeding `config.voice.drift_threshold` (default 0.3). After each unit, compare the drafted prose against STYLE-GUIDE.md. If drift exceeds threshold, pause.
3. **Plot hole** with no clear resolution path (e.g., a setup with no payoff, a character motivation gap)
4. **Missing critical information** that prevents drafting (character motivation gap, setting inconsistency, unresolved plot dependency)
5. **Writer-defined checkpoints** from `config.autopilot.custom_checkpoints` array

**Writer-defined checkpoints:** Read each checkpoint string as a natural-language instruction. At each iteration, check if the just-completed unit matches any checkpoint condition against the OUTLINE.md structure. Examples:
- `"pause after each act climax"` -- Check if the just-completed unit is marked as a climax in OUTLINE.md
- `"pause before chapter 10"` -- Check if the next unit is chapter 10
- `"pause after the midpoint"` -- Check if the just-completed unit is at the structural midpoint

**On pause (quality gate):** Show a diagnostic report:
- What triggered the pause (which condition, what was detected)
- The relevant context (the problematic passage, the contradiction, the drift score)
- Options for resolution (suggested fixes, or "provide guidance")
- Wait for writer input before continuing

**On completion:** Show a comprehensive summary:
- Total units drafted
- Total word count
- Voice consistency score across the manuscript
- Any flags or issues encountered during the run
- List of any quality gate pauses that occurred and how they were resolved

## Resume logic

When `--resume` is passed:

1. Read STATE.md "Session handoff" and "Progress" sections
2. Determine the last completed unit and the last completed stage
3. Output: "Last time, you [action from STATE.md session handoff]. Picking up at [unit] [stage]."
4. Re-enter the main loop from that exact point -- do not re-run completed stages or units
5. If STATE.md shows no prior autopilot run, start from the beginning and say so

## Adaptive naming

Load `.manuscript/config.json` for the `command_unit` field. Keep the runnable commands canonical and adapt only the terminology in output:

- If `command_unit` is `"surah"`, run `/scr:draft 2` and describe it as drafting Surah 2
- If `command_unit` is `"act"`, show "Act 2 complete" not "Chapter 2 complete"

Reference CONSTRAINTS.json for work-type-specific hierarchy labels. All progress messages, pause prompts, and summaries must use the adapted terminology without inventing new command ids.

## State management

**MANDATORY:** Update STATE.md after EVERY action -- not just at pauses. Resume depends on accurate state.

After each stage execution:
1. Record in the "Last actions" table: timestamp, command name (e.g., `/scr:draft 3`), unit identifier, outcome (e.g., "drafted, 1,247 words, voice check passed")
2. Update progress counters: `units_discussed`, `units_planned`, `units_drafted`, `units_reviewed`, `units_submitted`
3. Update `current_unit` and next step
4. Update `total_words` running count

On pause or stop:
1. Write current position to "Session handoff" section so `--resume` can pick up exactly where you left off
2. Include what was just completed and what the next action would be
3. Record the writer's notes if they provide any

## Tone

**Progress updates:** Concise, one line per unit.
- "Drafted chapter 3: 1,247 words. Voice check: passed."
- "Planned scenes 1-4 for chapter 5."
- "Editor review complete for chapter 2: 3 notes."

**At pause points:** Warm, non-technical.
- "Chapter 3 is ready for your review."
- "The first act is complete -- 4 chapters, 12,340 words."
- "Something needs your attention in chapter 7."

**Never show** (unless `developer_mode` is `true` in config.json):
- Git terminology (commits, branches, diffs, hashes)
- File paths (`.manuscript/drafts/body/3-2-DRAFT.md`)
- Technical jargon (context window, tokens, agent invocation)
- Raw error output

**When `developer_mode` is `true`:** Show file paths, git operations, and technical details alongside the writer-friendly output.

## Anti-patterns

- **NEVER** run without updating STATE.md -- resume depends on accurate state
- **NEVER** show raw git output in writer mode (when `developer_mode` is `false`)
- **NEVER** skip the voice comparison after drafting -- even if the voice-check command from Phase 4 is not yet available, use the drafter's built-in self-check (Step 4 in drafter.md)
- **NEVER** re-draft a unit that STATE.md shows as already submitted -- submitted means the writer approved it
- **NEVER** skip stages in the chain (discuss-plan-draft-review-submit) unless the writer explicitly says "skip"
- **NEVER** continue past a quality gate pause in full-auto without writer input -- the whole point is that these are conditions the pipeline cannot resolve alone
