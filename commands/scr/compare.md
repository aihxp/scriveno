---
description: Compare your current work with a previous save. Shows changes in plain prose, not code diff.
argument-hint: "[save number or 'last']"
---

# Compare

You are showing the writer how their prose has changed. Your job is to format git diff output as readable prose comparisons with NO technical diff markers.

## What to do

1. **Check for `.manuscript/` directory.** If missing: "No manuscript found. Start with `/scr:new-work`."

2. **Check for `.git/` directory.** If missing: "No save history to compare. Save your work first with `/scr:save`."

3. **Load the save history, not the raw manuscript history.** Run:
   ```
   git log --format="%H|%s" --grep="^(Saved|Initial save)" --extended-regexp .manuscript/ 2>/dev/null
   ```
   This command compares against actual saves only. Do not count administrative manuscript commits such as revision-track creation, proposals, or merges.
   - If the save list is empty: "No save history to compare. Save your work first with `/scr:save`."
   - If the writer asks to compare save N or save M and that numbered save does not exist in the filtered save list: "I couldn't find that save number. Use `/scr:versions` to see the available saves first."

4. **Read `.manuscript/config.json`** for `developer_mode` and `command_unit`.

5. **Determine what to compare:**
   - No argument or `last`: compare the current working tree against the most recent save hash from the filtered save list
   - A number N: compare the current working tree against save N from the filtered save list (1 = most recent save, 2 = the save before that, and so on)
   - Two numbers "N M": compare save N with save M using the corresponding hashes from the filtered save list
   - Run the appropriate diff against those resolved save hashes, for example:
     - `git diff {save-hash-1} -- .manuscript/`
     - `git diff {save-hash-N} {save-hash-M} -- .manuscript/`
   Never resolve save numbers with raw ancestry offsets, because manuscript history may include non-save checkpoints.

6. **Parse the diff output** into changed prose pairs:
   - For each changed file in `.manuscript/`, extract the diff hunks
   - Map file paths to unit names (e.g., `.manuscript/drafts/body/3-2-DRAFT.md` becomes the unit name from the file content or outline)
   - Group changes by unit (chapter/scene/section)

7. **Format as Before/After blocks:**

   ```
   ## {Unit Name} -- Changes

   **Before:**
   > Marcus walked through the empty corridor, his footsteps echoing against the marble walls.

   **After:**
   > Marcus moved through the silent corridor, each footstep a small detonation against the marble.

   ---

   **Before:**
   > She looked at him with concern.

   **After:**
   > She studied him, her eyes narrowing at something she found in his expression.
   ```

8. **Show the formatted comparison to the writer.**

## Formatting rules

- **NEVER show:** `+`, `-`, `@@`, line numbers, file paths, commit hashes, `diff --git`, `index`, `---`, `+++`
- Use blockquotes (`>`) for prose passages
- Group changes by unit (chapter/scene) with `##` headings
- Show 1 sentence of unchanged context before and after each change for readability
- If a section was added (no previous version): use "**New:**" instead of Before/After
- If a section was removed: use "**Removed:**" with the deleted text in a blockquote
- If only whitespace or formatting changed: skip it silently
- Separate multiple changes within a unit with `---` horizontal rules

## Writer mode output

- **Writer mode** (`developer_mode: false`): Show ONLY the formatted Before/After blocks as described above. No technical information whatsoever.
- **Developer mode** (`developer_mode: true`): Show standard unified diff output with file paths and line numbers. Include commit hashes being compared.

## Edge cases

- **No changes:** "No differences found. Your current work matches your last save."
- **Only one save:** Comparing the current working tree against that save is fine. If the writer asks for a second numbered save that does not exist, explain that only one save is available so far.
- **Binary files changed** (images, etc.): Skip them silently in writer mode. Mention them in developer mode.
- **New files added since last save:** Show under a "**New files:**" heading with the content.
- **Files deleted since last save:** Show under a "**Removed files:**" heading.
- **Very large diff** (more than 50 changed passages): Summarize with counts per unit, then show the first 10 changes. Mention: "Showing 10 of [N] changes. There were significant changes across [M] sections."

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

Neutral. Observational. Present the changes without judgment. Don't comment on whether changes are improvements -- that's the editor's job.
