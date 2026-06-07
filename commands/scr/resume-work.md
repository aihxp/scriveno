---
description: Pick up where you left off. Reads your last session and tells you what's next.
argument-hint: ""
---

# Resume Work

You are welcoming the writer back and orienting them. Your job is to read the session state and produce one concise, contextual paragraph about where they left off.

## What to do

0. **Read `.manuscript/CONTEXT.md` first if it exists.** This is the auto-regenerated one-page bootstrap. Use it as the primary source for orientation -- it already summarizes recent activity, open items, and the suggested next step that the rest of this command would otherwise re-derive from raw STATE.md fields. If CONTEXT.md is present and its `Updated` timestamp is newer than STATE.md, skip steps 1 through 3 (you already have the synthesis) and go to step 4. If CONTEXT.md is missing, stale, or contradicts STATE.md, treat STATE.md as authoritative and continue with steps 1 through 3 (you will regenerate CONTEXT.md in step 6).

1. **Read STATE.md "Session handoff" section** for:
   - Last session end time
   - Resume context (automated context + writer's notes)

2. **Read STATE.md "Progress" section** for:
   - Overall progress metrics (units total, discussed, planned, drafted, reviewed, submitted, word count)

3. **Read STATE.md "Pending" section** for:
   - Next step
   - Open revisions
   - Unresolved notes
   - Voice-check issues
   - Continuity flags

4. **Record the new session boundary in STATE.md before responding.**
   - Set `## Session metrics` -> `Current session started` to the current timestamp.
   - Reset the per-session summary placeholders so this session starts fresh:
     - `Units this session: 0`
     - `Words this session: 0`
     - `Quality passes: none yet`
   - Append a row to the "Last actions" table with:
     - Timestamp: current timestamp
     - Command: `resume-work`
     - Unit: current unit (or `--` if none)
     - Outcome: `Resumed session`
   `/scr:session-report` depends on these markers to separate the current session from older work, so always write them here.

5. **Generate ONE paragraph** that covers three parts:
   - **(a) What was done:** Summarize last session's accomplishments. Use concrete numbers -- words, units, quality passes.
   - **(b) What was in progress + writer's notes:** Where they were when they stopped. Include the writer's own notes verbatim if they left any -- this is what makes it feel personal.
   - **(c) Suggestion for next step:** Based on pending items and progress, suggest the logical next command.

   Example:
   > Last time you drafted chapter 3 (1,247 words across 4 scenes, voice check passed). You were working on chapter 4 -- you noted you wanted it shorter and more tense, with Marcus discovering the letter. I'd suggest starting with /scr:discuss 4 to shape the plan.

6. **Regenerate `.manuscript/CONTEXT.md`** using the `templates/CONTEXT.md` scaffold and the same field set described in `/scr:save` step 7, with `{{LAST_COMMAND}}` set to `/scr:resume-work`. This refreshes the bootstrap file so the next session opens to a current view -- the act of resuming is itself a state event worth recording. Also regenerate `.manuscript/PROGRESS.md` (the per-unit progress ledger) per `/scr:save` step 8 and `docs/progress-protocol.md`. Where the work has them, also regenerate the derived maps (`.manuscript/RELATIONSHIPS.md`, `.manuscript/CONFLICTS.md`, `.manuscript/PEOPLE-DYNAMICS.md`) per `/scr:save` steps 8b through 8d.

7. **Append one line to `.manuscript/HISTORY.log`** per `docs/history-protocol.md`:
   ```
   {ISO timestamp} | scr:resume-work | unit={current unit or --} | outcome=resumed
   ```
   Create HISTORY.log if it does not exist.

## Output format

- **ONE paragraph**, not a bulleted list or table.
- Include the writer's own notes if they left any (this is what makes it feel personal).
- Suggest the logical next command.
- End with: "Ready to continue? Run `/scr:next` or tell me what you'd like to do."

## Edge cases

- **No previous session:** If the Session handoff section is empty or has only template placeholders, say: "This looks like a fresh start. Run `/scr:next` to get going."

- **Session handoff section empty but progress exists:** Generate context from the Progress and Last actions tables instead. Synthesize what you can from available data.

- **Very old session (>7 days):** If the last session ended more than 7 days ago, acknowledge the gap: "It's been a while since your last session ([date]). Here's where things stand: ..."

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

Warm but efficient. The writer wants to get back to work -- orient them quickly, don't belabor the recap. One paragraph, then let them go.
