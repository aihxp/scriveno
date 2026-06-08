---
description: Run the full drafting pipeline autonomously. Choose guided, supervised, or full-auto profiles.
argument-hint: "[--profile guided|supervised|full-auto] [--from <stage>] [--to <stage>] [--unit N] [--resume] [--matter <minimum|balanced|maximum|skip>]"
---

# Autopilot

You are running the Scriveno pipeline autonomously. Your job is to execute the discuss-plan-draft-review-submit chain for each unit in OUTLINE.md, pausing only when the active profile requires it. When a full manuscript run reaches completion, autopilot also prepares publication matter by invoking the dedicated `/scr:front-matter` and `/scr:back-matter` commands unless the writer opts out.

## What to do

0. **Bootstrap (context-cost protocol).** Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, phase, current unit, recent activity, open items, and record highlights when present) and skip the corresponding raw-file loads in steps 1-3 below; you still need to read `OUTLINE.md` for unit ordering, `RECORD.md` for established-content obligations when present, and `config.json` for the `autopilot` settings block specifically. If CONTEXT.md is missing, stale, or contradicts STATE.md, run steps 1-3 unchanged. See `docs/context-protocol.md` for the contract.

1. **Read `.manuscript/config.json`** for autopilot settings: `profile` (guided, supervised, or full-auto), `enabled`, `custom_checkpoints` array, and optional matter settings (`include_matter`, `matter_level`).

2. **Read `.manuscript/STATE.md`** for current position: current unit, current stage, progress counters, and last actions.

3. **Read `.manuscript/OUTLINE.md`** for total units and their order. This is the master list of what needs to be drafted.

4. **Read `.manuscript/RECORD.md` when present.** Treat it as the compact store for established content: open threads, reader promises, payoffs, continuity facts, movement, and next-unit obligations. Older projects may not have RECORD.md; do not fail if it is missing.

5. **If `--resume` flag is set:** Read STATE.md "Session handoff" and "Progress" sections. Determine the last completed unit and the last stage completed. Output ONE sentence explaining where you left off (e.g., "Last time, you drafted chapter 3 and passed voice check. Picking up at chapter 4, discuss stage."). Then re-enter the main loop from that point.

6. **If `--profile` flag is set:** Override the config.json profile with the provided value. Valid values: `guided`, `supervised`, `full-auto`.

7. **Resolve publication matter behavior.** Autopilot should prepare front and back matter only after every unit reaches submit, never during a partial `--from` / `--to` run. Resolve the level in this order:
   - If `--matter skip` is set, skip the publication matter phase.
   - If `--matter minimum`, `--matter balanced`, or `--matter maximum` is set, use that level.
   - If `.manuscript/config.json` has `autopilot.include_matter: false`, skip the phase.
   - If `.manuscript/config.json` has `autopilot.matter_level`, use that level.
   - Otherwise use `balanced`.

8. **Enter the main loop** (see below).

## Main loop

```
FOR each unit in OUTLINE.md (starting from current position):
  FOR each stage in [discuss, plan, draft, review, submit]:
    Execute the canonical stage command (/scr:discuss, /scr:plan, etc.) with the unit number as an argument
    Update STATE.md with: timestamp, command name, unit, outcome
    Check pause conditions (see Profile rules below)
    If paused: show review prompt, wait for writer input
    If writer says "stop": exit loop, save state to STATE.md, then end with a literal `Next commands:` block
    If writer says "skip": advance to next unit, update STATE.md
```

In supervised and full-auto profiles, follow `docs/subagent-spawning-protocol.md` and run read-only lookahead workers for the next 1-3 units when disk evidence suggests risk. Lookahead workers may inspect for missing research, record drift, place/geography contradictions, subject-dynamics gaps, or likely quality gates. They do not draft ahead, update STATE.md, write plans, or accept canon. Merge their findings into the current pause report or next plan constraints.

When the loop completes (all units through all stages), run the completion steps in this order:

1. Regenerate the derived maps the run may have changed: the adapted relationship surface for canonical `RELATIONSHIPS.md`, `.manuscript/CONFLICTS.md`, and `.manuscript/PEOPLE-DYNAMICS.md` per `/scr:save` steps 8b through 8d, where each applies, so they reflect the cast and relationship changes made while drafting.
2. Run the publication matter phase unless it was skipped. Check whether `.manuscript/front-matter/` and `.manuscript/back-matter/` already contain publishable `.md` files. If either side is missing, run its dedicated command with the resolved level:
   - Missing front matter: `/scr:front-matter --level {resolved-matter-level}`
   - Missing back matter: `/scr:back-matter --level {resolved-matter-level}`
3. Do not overwrite writer-authored front or back matter silently. If files already exist but appear stale against `.manuscript/WORK.md` or the newest body draft, report that they may need a refresh and suggest the dedicated matter command in `Next commands:` rather than rewriting them.
4. If the current work type hides either matter command in `CONSTRAINTS.json`, skip that side and report it as not applicable.
5. Show a completion summary: total units, total word count, voice consistency across the manuscript, publication matter status, open record threads or promises, any flags or issues encountered, and a pointer to the per-unit ledger at `.manuscript/PROGRESS.md`.

The completion summary is not the final closeout by itself. After the summary and automation status, the response must end with the literal `Next commands:` block from the Response Contract. Do not replace it with prose-only options such as "where to go from here" or "just point me at one." For a completed draft, prefer concrete commands such as `/scr:progress`, `/scr:prepublish-review`, `/scr:save`, `/scr:export`, `/scr:publish`, or `/scr:next`, depending on the actual state. If publication matter was skipped or stale, include `/scr:front-matter --level balanced` or `/scr:back-matter --level balanced` as appropriate.

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
2. **Voice drift** exceeding `config.voice.drift_threshold` (default 0.3). After each unit, run the voice-checker agent against STYLE-GUIDE.md to get an Overall score (0-100). Compute normalized drift as `drift = (100 - score) / 100` (see the "Normalized drift" section of `voice-checker.md`) and pause when `drift` exceeds the threshold -- at the default 0.3 that means a voice score below 70, the voice-checker's FAIL band.
3. **Plot hole** with no clear resolution path (e.g., a setup with no payoff, a character motivation gap)
4. **Missing critical information** that prevents drafting (character motivation gap, setting inconsistency, unresolved plot dependency)
5. **Record drift** against `.manuscript/RECORD.md` that the agent cannot resolve safely (e.g., a promised payoff is contradicted, an open thread is closed without being recorded, or a next-unit obligation is skipped)
6. **Writer-defined checkpoints** from `config.autopilot.custom_checkpoints` array

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
- Voice consistency: the voice-checker Overall score (0-100), averaged across the units that were voice-checked during the run
- Publication matter status: front matter generated/present/skipped/stale, back matter generated/present/skipped/stale, and resolved matter level
- Open record threads, reader promises, and unresolved next-unit obligations from RECORD.md
- Any flags or issues encountered during the run
- List of any quality gate pauses that occurred and how they were resolved
- A final `Next commands:` block with one to four runnable Scriveno commands and practical explanations

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
5. Refresh `.manuscript/PROGRESS.md` so the openable ledger advances unit by unit during the run, per `docs/progress-protocol.md`

On pause or stop:
1. Write current position to "Session handoff" section so `--resume` can pick up exactly where you left off
2. Include what was just completed and what the next action would be
3. Record the writer's notes if they provide any
4. End the writer-facing response with a `Next commands:` block, usually including `/scr:autopilot --resume` when resuming is the right path

## Automation Status

Every progress update and final response must include a compact status trail. This is how the writer can tell whether Scriveno auto-chained commands, spawned agents, or only updated local files.

```text
Automation status:
Trigger: /scr:autopilot --profile {profile}
Profile: guided/supervised/full-auto
Auto-invoked commands:
- /scr:discuss N: yes/no
- /scr:plan N: yes/no
- /scr:draft N: yes/no
- /scr:editor-review N: yes/no
- /scr:submit N: yes/no
- /scr:front-matter --level {level}: yes/no/not-applicable
- /scr:back-matter --level {level}: yes/no/not-applicable
Spawned agents:
- lookahead workers: {count, none, or prompt-run fallback used}
- plan-checker: {count}
- drafter: {count}
- voice-checker: {count}
- continuity-checker: {count}
Local operations:
- STATE.md updated: yes/no
- PROGRESS.md refreshed: yes/no
- HISTORY.log updated: yes/no
- publication matter scan: yes/no
Pause:
- status: none/guided/supervised/quality-gate/blocker
- reason: {one sentence}
```

If a command in the chain runs local file operations only, say so under `Local operations` rather than listing it as a spawned agent. If a native agent type is unavailable and an installed prompt-run fallback is used, include that in `Spawned agents`.

## Response Contract

Every writer-facing response must end with one to four next-command suggestions. Each suggestion must include a short explanation of what that path will do.

The final visible section of every writer-facing response must be the `Next commands:` block. This applies to successful completion, partial completion, blocked, stopped, validation-failed, and prerequisite-missing responses. Do not end with only a summary, report, checklist, external action, upload instruction, or prose-only options.

Use the invocation style for the active runtime when writing command suggestions. Source command IDs use `/scr:*`; Claude Code installed commands use `/scr-*`; Codex installed skills use `$scr-*`. Suggest only runnable Scriveno commands that exist in the installed command surface. Do not invent adjacent workflow names.

This requirement applies after completion, pause, stop, quality-gate, and blocked-prerequisite responses. The final visible section of the response must be `Next commands:`. Never end an autopilot response with prose-only choices, a "just point me" line, or a numbered list that does not contain runnable Scriveno commands.

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

**Progress updates:** Concise, one line per unit, anchored to the whole manuscript so progress is visible during the run.
- "Drafted chapter 3 (3 of 12, 25%): 1,247 words. Voice check: passed."
- "Planned scenes 1-4 for chapter 5."
- "Editor review complete for chapter 2: 3 notes."

Every few units, show a one-line manuscript bar pulled from the deliverable progress in `docs/progress-protocol.md`, for example: `████░░░░░░ 5/12 chapters done (42%)`. The full per-unit ledger is `.manuscript/PROGRESS.md`.

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
- **NEVER** skip the voice comparison after drafting -- run the voice-checker agent against STYLE-GUIDE.md; if the host runtime cannot spawn it, fall back to the drafter's built-in self-check (Step 4 in drafter.md)
- **NEVER** re-draft a unit that STATE.md shows as already submitted -- submitted means the writer approved it
- **NEVER** skip stages in the chain (discuss-plan-draft-review-submit) unless the writer explicitly says "skip"
- **NEVER** continue past a quality gate pause in full-auto without writer input -- the whole point is that these are conditions the pipeline cannot resolve alone
