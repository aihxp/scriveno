---
description: List your draft versions with readable labels.
argument-hint: "[--all]"
---

# Versions

You are listing the writer's draft versions. Your job is to show saves as a numbered list with human-readable descriptions.

## What to do

1. **Check for `.manuscript/` directory.** If missing: "No manuscript found. Start with `/scr:new-work`."

2. **Check for `.git/` directory.** If missing: "No versions yet. Save your work first with `/scr:save`."

3. **Read `.manuscript/config.json`** for `developer_mode`.

4. **Retrieve the version list.** Run:
   ```
   git log --format="%H|%ai|%s" --grep="^(Saved|Initial save)" --extended-regexp -n 10 .manuscript/
   ```
   Default: last 10 versions. If the writer specified `--all`, drop the `-n 10` limit and retrieve the complete save-version list instead.
   This command is for writer-visible draft versions, so exclude administrative manuscript commits such as revision-track creation, proposals, and merges.

5. **Parse into a numbered version list**, grouped by date:
   - Convert commit messages into human-readable descriptions (same parsing as `/scr:history`)
   - Group consecutive saves from the same calendar day under one date heading
   - Number versions from 1 (most recent) to N (oldest)
   - Include word count if available from the commit message
   - Mark the most recent version as "Current"

6. **Format as a readable list:**

   ```
   Your draft versions:

   1. Current -- Chapter 5 in progress (2 saves today)
   2. Yesterday -- Completed chapter 4 (1,890 words)
   3. Apr 4 -- Drafted chapter 3 (1,247 words)
   4. Apr 3 -- Initial outline and voice profile
   ```

   Date format rules:
   - Today's saves: "Current" for the latest, "Earlier today" for others
   - Yesterday: "Yesterday"
   - This week: day name ("Monday", "Tuesday")
   - Older: "Mon D" format ("Apr 4", "Mar 28")
   - Different year: "Mon D, YYYY" ("Dec 15, 2025")

7. **Show the list to the writer.**

## Writer mode output

- **Writer mode** (`developer_mode: false`): Show ONLY the numbered list with dates and descriptions. No git hashes, no branch names, no file paths.
- **Developer mode** (`developer_mode: true`): Include the short hash (first 7 characters) after each version number. Show the current branch name above the list.

## Edge cases

- **No versions:** "No versions yet. Save your work first with `/scr:save`."
- **Only one version:** Show it as "1. Current -- {description}". No "see more" message.
- **Many versions:** Default to last 10. If more exist, mention: "Showing your last 10 versions. Use `--all` to see the complete list."
- **Administrative manuscript commits:** Exclude track creation, proposals, merges, and other non-save checkpoints. Show only commits whose subject starts with `Saved` or `Initial save`.
- **Multiple saves on the same day:** Group them under one date, showing individual descriptions:
  ```
  1. Current -- Revised chapter 3 opening
  2. Earlier today -- Drafted chapter 3 (1,247 words)
  ```

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

## Tone

Clean. Minimal. The version list should feel like a simple timeline, not a technical log. Let the descriptions do the talking.
