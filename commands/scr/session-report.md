---
description: See what you accomplished this session. Shows units drafted, words written, and time spent.
argument-hint: ""
---

# Session Report

You are summarizing the writer's current session. Your job is to compute actionable metrics from STATE.md and present them clearly.

Follow the auto-invoke policy. In the source repository it is documented at `docs/auto-invoke-policy.md`. `/scr:session-report` is read-only and does not spawn agents.

Use the shared executable engine for the read-only status portion before computing session-specific metrics. Try the first available path:

```bash
scriveno status --project "$PWD" --trigger /scr:session-report
node lib/auto-invoke-engine.js --project "$PWD" --trigger /scr:session-report
node "$HOME/.scriveno/lib/auto-invoke-engine.js" --project "$PWD" --trigger /scr:session-report
node .scriveno/lib/auto-invoke-engine.js --project "$PWD" --trigger /scr:session-report
```

This engine is installed into Scriveno shared assets for every runtime, including Claude Code, Codex, Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, Antigravity, Manus, Perplexity Desktop, and the generic skill fallback. If the engine is not present, continue with the read-only report logic below.

## What to do

1. **Read STATE.md "Last actions" table** to get the full history of actions.

2. **Identify session boundaries:** The current session started at the first action after the last `/scr:pause-work` or `/scr:resume-work` entry in the Last actions table. If no pause/resume exists, the session started at the first action in the table.

3. **Compute metrics:**
   - **Units drafted:** Count distinct units that went through the "draft" stage this session (e.g., "1 chapter (4 scenes)").
   - **Words written:** Sum word counts from draft actions this session. If word counts are not in the Last actions table, count words in newly created DRAFT.md files by reading them.
   - **Time estimate:** Difference between the first and last action timestamps this session. Present as hours and minutes (e.g., "~2 hours 15 minutes").
   - **Quality passes run:** Count voice-check, continuity-check, editor-review, and other review actions this session. Note whether they passed or had issues.

4. **Read STATE.md "Session metrics" section** for `Current session started` if available. Use it as the strongest boundary anchor when timestamps are present there.

## Output format

Present the report in this format:

```
## Session Report

**Duration:** ~2 hours 15 minutes
**Units drafted:** 1 chapter (4 scenes)
**Words written:** 1,247
**Quality passes:** voice-check (passed)

**Actions this session:**
| Time | What happened |
|------|---------------|
| 1:00 PM | Started session |
| 1:15 PM | Discussed chapter 3 |
| 1:30 PM | Planned chapter 3 (4 scenes) |
| 2:45 PM | Drafted chapter 3 (1,247 words) |
| 3:00 PM | Voice check passed |
| 3:15 PM | Editor review complete |
```

## Automation Status

Every response must include a compact status block:

```text
Automation status:
Trigger: /scr:session-report
Spawned agents:
- none
Local operations:
- session metrics computed: yes/no
- quality pass summary computed: yes/no
Auto-invoked:
- none
Why: session-report summarizes disk state without mutating files
```

## Edge cases

- **No actions this session:** If the Last actions table is empty or has no entries after the last pause/resume marker, say: "Nothing to report yet. Start working with `/scr:next`."

- **Missing timestamps:** If timestamps are not available in the Last actions table, only estimate duration when you can still anchor the current session boundary safely. Prefer `Session metrics` start time from `STATE.md`; if present, restrict the save history lookup to save commits at or after that timestamp. Otherwise, use save-history timestamps only if you can confidently match the first current-session action to a save commit after the last recorded `/scr:pause-work` or `/scr:resume-work` marker in the Last actions table. Use save commits only: `git log --format="%ai|%s" --grep="^(Saved|Initial save)" --extended-regexp .manuscript/`. Do not use administrative manuscript commits such as revision-track creation, proposals, or merges for session timing. If you cannot isolate the current session from save history with confidence, omit the Duration line and note: "Duration not available (session boundary timestamps unavailable)."

- **Per D-12:** Session state is per-project. Do not reference other projects. All data comes from this project's STATE.md and git history.

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

Encouraging and factual. Show the writer what they accomplished. Even small sessions have value -- "You discussed chapter 4 and shaped the direction. Good foundation for the next drafting session."
