---
description: Pause your work session. Captures where you are and what you were thinking so you can pick up later.
argument-hint: ""
---

# Pause Work

You are helping the writer pause their session gracefully. Your job is to capture both the file state and the writer's mental state so resuming later is seamless.

## What to do

1. **Read STATE.md** for current position (unit, stage, progress).

2. **Check for pre-existing uncommitted manuscript changes before mutating STATE.md.**
   - Run `git status` for `.manuscript/` and remember whether there were already modified or untracked files.
   - This check must happen before you update `STATE.md`, so the pause marker itself does not get mistaken for pre-existing unsaved writing work.

3. **Ask the writer:** "Any notes for when you come back?" -- This captures their thinking, intentions, concerns. Wait for their response.

4. **Handle the writer's response:**
   - If the writer provides notes: store them in STATE.md "Session handoff" > "Resume context" along with the automated context.
   - If the writer says nothing or declines: generate context automatically from STATE.md progress and last actions.

5. **Update STATE.md "Session handoff" section and session boundary markers** with the current timestamp and combined context:
   ```
   **Last session ended:** {current timestamp, e.g., 2026-04-06 4:30 PM}
   **Resume context:** {Automated: "Finished drafting chapter 3 (4 scenes, 1,247 words). Voice check passed. Was about to start discussing chapter 4."} {Writer's note: "I want chapter 4 to be shorter and more tense -- Marcus discovers the letter here."}
   ```
   Also append a row to the "Last actions" table with:
   - Timestamp: current timestamp
   - Command: `pause-work`
   - Unit: current unit (or `--` if none)
   - Outcome: `Paused session`
   Keep this pause marker in the Last actions table because `/scr:session-report` and future resume logic use it as a session boundary.

6. **Regenerate `.manuscript/CONTEXT.md`** using the `templates/CONTEXT.md` scaffold and the field set described in `/scr:save` step 7, with `{{LAST_COMMAND}}` set to `/scr:pause-work`. This is the file the next session reads first; refreshing it on pause means the writer (or a fresh AI session) returns to a current view without having to call `/scr:resume-work` to bootstrap.

7. **Append one line to `.manuscript/HISTORY.log`** per `docs/history-protocol.md`:
   ```
   {ISO timestamp} | scr:pause-work | unit={current unit or --} | outcome=paused
   ```
   Create HISTORY.log if it does not exist.

8. **Auto-save if there were pre-existing uncommitted changes.**
   - Use the result from step 2, not a fresh post-update `git status` check.
   - If the manuscript already had modified or untracked files before the pause-state update, run the `/scr:save` logic with the message "Saved before pausing" so both the writer's in-progress work and the pause metadata (CONTEXT.md and HISTORY.log included) are preserved together.
   - Do not treat the pause-state update by itself as proof that the writer had unsaved manuscript work before pausing.

9. **Tell the writer:** "Paused. When you're ready to come back, just run `/scr:resume-work`."

## State capture

When writing the Resume context, include all of the following that are available:

- **Current unit and stage** -- e.g., "Working on chapter 4, planning stage"
- **Last few actions** from the "Last actions" table -- what happened most recently
- **Word count progress** -- total words written so far
- **Pending flags** -- voice issues, continuity flags, open revisions, unresolved notes
- **Writer's mental notes** -- the most important part. This is what makes resuming feel personal, not mechanical. Whatever the writer said when you asked for notes goes here verbatim.

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

Warm, unhurried. "Take your time. Everything is saved. When you come back, I'll know exactly where we were."

Do not rush the writer. Do not list technical details. Make them feel like they can walk away without worry.
