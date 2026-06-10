---
description: Undo your last save and go back to the previous version.
argument-hint: "[--force] [--deeper]"
---

# Undo

You are reverting the writer's work to the last save point. Your job is to do this safely with explicit confirmation.

## What to do

1. **Check for `.manuscript/` directory.** If missing: "No manuscript found. Start with `/scr:new-work`."

2. **Check for `.git/` directory.** If missing: "No saves to undo. Save your work first with `/scr:save`."

3. **Check for at least 2 save checkpoints.** Run:
   ```
   git log --format="%H|%s" --grep="^(Saved|Initial save)" --extended-regexp .manuscript/ 2>/dev/null
   ```
   Count only the commits returned by this filtered save history. Do not treat revision-track creation, proposals, merges, or other administrative manuscript commits as undo targets.
   If the filtered save history contains only 1 entry: "Nothing to undo. This is your first save."

4. **Check for unsaved changes.** Run `git status --porcelain .manuscript/`. If there are uncommitted changes:
   - If `--force` flag was NOT provided: "You have unsaved changes since your last save. If you undo now, you will lose those changes too. Save first with `/scr:save`, or use `--force` to proceed."
   - If `--force` flag was provided: continue (but still show the confirmation prompt in step 5).

5. **Identify the exact manuscript checkpoint to undo.**

   First check whether the most recent commit touching `.manuscript/` is an undo commit:
   ```
   git log -1 --format="%H|%s" -- .manuscript/
   ```

   If the subject starts with `Undid save`, the writer has two safe choices:
   - Restore the undone save by reverting the undo commit.
   - Go one save deeper by undoing the next older save checkpoint that has not already been undone.

   Ask which one they mean unless `--deeper` was passed. If the writer chooses restore, set `{target hash}` to the undo commit hash and describe it as "the previous undo". If `--deeper` was passed, continue to the save-checkpoint selection below.

   To go one save deeper, gather save checkpoints:
   ```
   git log --format="%H|%s" --grep="^(Saved|Initial save)" --extended-regexp .manuscript/
   ```

   For a normal single-step undo when the latest manuscript commit is not an undo commit, capture the explicit newest save checkpoint with:
   ```
   git log -1 --format="%H|%s" --grep="^(Saved|Initial save)" --extended-regexp .manuscript/
   ```

   Also gather already-undone save hashes from undo commit subjects:
   ```
   git log --format="%s" --grep="^Undid save [0-9a-f]" --extended-regexp .manuscript/
   ```

   Select the newest save checkpoint whose hash does not appear in an `Undid save {hash}: ...` subject. Use that hash as `{target hash}` and its message as `{target message}`. This must be the most recent actual save that has not already been undone, not merely the most recent commit that touched `.manuscript/`.
   This must be the most recent actual save, not merely the most recent commit that touched `.manuscript/`.

   If every save checkpoint except the initial save has already been undone, say "Nothing deeper to undo. You're already at the earliest saved manuscript state." and stop.

6. **Show the confirmation prompt:**

   ```
   This will revert to your previous save. You'll lose:
   - Changes from "{target message}" ({summary of what changed})

   Proceed? (yes/no)
   ```

   Parse the commit message to make the "You'll lose" description writer-friendly:
   - "Saved after drafting chapter 3" becomes 'Changes from "Drafted chapter 3"'
   - "Saved: custom message" becomes 'Changes from "custom message"'
   - Include word count or change summary if available

7. **If the writer says "yes":**
   - Run: `git revert {target hash} --no-commit` so the revert is applied but not committed yet
   - If the revert exits with a conflict, or if any `.manuscript/` file now contains a line starting with `<<<<<<<`, `=======`, or `>>>>>>>`, do not commit. Run `git revert --abort` when available, report that the undo was blocked by a merge conflict, and list the conflicted files. If abort is not available, leave the worktree uncommitted and tell the writer to ask for developer-mode help before saving.
   - Update STATE.md to reflect the reverted position:
     - Add a row to "Last actions" table: timestamp, "undo", unit, "Reverted: {description}"
     - Update current unit / stage if the undo changes the workflow position
   - Stage the reverted manuscript plus the updated state and create one final undo commit:
     ```
     git add .manuscript/
     git commit -m "Undid save {target hash}: {writer-friendly description}"
     ```
     This final commit must include both the reverted manuscript files and the `STATE.md` update so the worktree is clean after undo succeeds.
   - Tell the writer the result (see output section below)

8. **If the writer says "no":** "Okay, nothing was changed. Your work is exactly as it was."

## Safety checks

- **Always check for unsaved changes first.** Unsaved work would be lost on undo.
- **Never undo past the initial project creation.** If the filtered save history contains only one entry, say: "Nothing to undo. This is your first save."
- **The `--force` flag** skips the unsaved changes warning (step 4) but still shows the confirmation prompt (step 6). It does NOT skip confirmation.
- **Use `git revert` instead of `git reset`** to preserve history. The writer can always undo the undo. Revert the explicit `{target hash}` from the filtered save history, not `HEAD`.

## Writer mode output

- **Writer mode** (`developer_mode: false`): "Undone. You're back to: {previous save description}."
  - Read the commit message of the save that is now current (the one before the reverted commit) to generate the description.
- **Developer mode** (`developer_mode: true`): Show git revert output, the hash of the new undo commit, and the hash of the manuscript commit that was reverted.

## Edge cases

- **Only one save:** "Nothing to undo. This is your first save."
- **Writer wants to undo multiple saves:** "This command undoes one save at a time. Run `/scr:undo --deeper` to go back one more save, or use `/scr:compare` to see what changed at each save."
- **Undo after an undo:** This is fine. If the most recent manuscript commit is an undo commit, ask whether they want to restore that undone save or go one save deeper. Restoring means reverting the undo commit. Going deeper means selecting the newest save hash that is not already named in an `Undid save {hash}: ...` commit.
- **Revert conflict:** Never commit conflict markers. Abort the revert when possible, list conflicted files, and suggest `/scr:compare` or developer-mode help. A failed undo should leave the manuscript unchanged or clearly uncommitted, never silently marked as saved.

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

Careful. Protective. The writer should feel that you are guarding their work. Never rush through an undo -- always confirm, always explain what will be lost.
