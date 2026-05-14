---
description: See the timeline of your saves. Shows when you saved and what you were working on.
argument-hint: "[--limit N]"
---

# History

You are showing the writer their save history. Your job is to format git log output as a scannable markdown table with NO git terminology.

## What to do

1. **Check for `.git/` directory.** If missing: "No save history yet. Save your work first with `/scr:save`."

2. **Check for any save commits.** Run:
   ```
   git log --format="%H" --grep="^(Saved|Initial save)" --extended-regexp -n 1 .manuscript/ 2>/dev/null
   ```
   If empty: "No save history yet."

3. **Read `.manuscript/config.json`** for `developer_mode`.

4. **Retrieve the log.** Run:
   ```
   git log --format="%H|%ai|%s" --grep="^(Saved|Initial save)" --extended-regexp -n {limit} .manuscript/
   ```
   Default: last 20 entries. If the writer specified `--limit N`, use that number instead.
   This command is a **save history**, so exclude administrative manuscript commits such as revision-track creation, proposals, and merges.

5. **Parse each line** into three columns:
   - **Date:** Convert the ISO timestamp to human-friendly format: "Mon D, H:MM AM/PM" (e.g., "Apr 6, 2:30 PM"). Omit year unless the save is from a different year than the current year.
   - **Action:** Extract the verb and unit from the commit message:
     - "Saved after drafting chapter 3" becomes "Drafted chapter 3"
     - "Saved after editor review of chapter 2" becomes "Reviewed chapter 2"
     - "Saved after revising chapter 2" becomes "Revised chapter 2"
     - "Saved after planning chapter 4" becomes "Planned chapter 4"
     - "Saved after discussing chapter 5" becomes "Discussed chapter 5"
     - "Saved work in progress on chapter 3" becomes "Work in progress on chapter 3"
     - "Saved: {custom message}" becomes "{custom message}"
     - "Initial save of {title}" becomes "Started {title}"
     - Any other message: use the message as-is
   - **Details:** Extract supplementary information if available in the commit message (word count, scene count, etc.). If none, leave blank.

6. **Format as a markdown table:**

   ```
   | Date | Action | Details |
   |------|--------|---------|
   | Apr 6, 2:30 PM | Drafted chapter 3 | 1,247 words, 4 scenes |
   | Apr 6, 1:15 PM | Reviewed chapter 2 | 3 revision notes |
   | Apr 5, 4:00 PM | Planned chapter 3 | 4 scene plans |
   ```

7. **Show the table to the writer.**

## Writer mode output

- **Writer mode** (`developer_mode: false`): Show ONLY the markdown table. No git hashes, no branch info, no file paths. If there are more saves beyond the displayed limit, add: "Showing your last [N] saves. Use `--limit 50` to see more."
- **Developer mode** (`developer_mode: true`): Add an extra "Hash" column to the table with the short commit hash (first 7 characters). Include the current branch name above the table.

## Edge cases

- **No history:** "No save history yet. Save your work first with `/scr:save`."
- **Only one save:** Show the table with one row. No "see more" message.
- **Very long history:** Default to last 20. If more exist, mention: "Showing your last 20 saves. Use `--limit 50` to see more."
- **Administrative manuscript commits:** Exclude track creation, proposals, merges, and other non-save checkpoints. Show only commits whose subject starts with `Saved` or `Initial save`.

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

Neutral. Informative. Let the table speak for itself. Don't editorialize about the writer's productivity or pace.
