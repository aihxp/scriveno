---
description: Manage revision tracks -- create, switch, compare, merge, and propose changes for review.
argument-hint: "<create|list|switch|compare|merge|propose> [name] [options]"
---

# /scr:track -- Revision Track Management

Revision tracks let writers explore alternate versions of their manuscript without risking the canon. Each track is a named workspace -- "Second draft attempt", "Editor's suggestions", "Experimental ending" -- that can be compared, merged back into canon, or proposed for review.

## Usage

```
/scr:track create <name>
/scr:track list
/scr:track switch <name>
/scr:track compare [track-a] [track-b]
/scr:track merge <name>
/scr:track propose <name>
```

## Prerequisites

1. **Check for `.manuscript/` directory.** If missing: "No manuscript found. Start with `/scr:new-work`."
2. **Check for `.git/` directory.** If missing, silently run `git init` (writer mode) or inform and init (developer mode), following the same pattern as `/scr:save`.
3. **Read `.manuscript/config.json`** for `developer_mode` and `work_type`.
4. **Parse the subcommand** from the first argument. If none provided or unrecognized, show the usage table above and a brief description of each subcommand.

## tracks.json Format

Track metadata lives in `.manuscript/tracks.json`. Create this file on first `track create` if it does not exist.

```json
{
  "canon_branch": "trunk",
  "tracks": [
    {
      "label": "Editor's suggestions",
      "branch": "track/editors-suggestions",
      "created": "2026-04-07T10:30:00Z",
      "author": "writer",
      "status": "active",
      "merged_at": null,
      "proposed_at": null
    }
  ]
}
```

**Label-to-branch mapping (D-01):** Writer-friendly labels are stored as-is. The git branch name is derived by slugifying the label: lowercase, replace spaces with hyphens, strip special characters (keep alphanumeric and hyphens only), prefix with `track/`. Example: "Second Draft Attempt" becomes `track/second-draft-attempt`.

**Canon branch metadata:** `canon_branch` stores the real branch name of the canon manuscript. This may be `main`, `master`, `trunk`, or any other branch name the writer uses.

## Canon Branch Resolution

Any subcommand that needs the canon manuscript must resolve the canon branch in this order:

1. If `.manuscript/tracks.json` has a top-level `canon_branch`, use it.
2. Otherwise, read the current branch with `git branch --show-current`. If it exists and does not start with `track/`, treat that branch as canon and write it back to `tracks.json` as `canon_branch`.
3. Otherwise, if the repo has a remote default branch (`git symbolic-ref refs/remotes/origin/HEAD`), use that short branch name.
4. Otherwise, inspect the local branches. If there is exactly one non-`track/` local branch, use it as canon and write it back to `tracks.json` as `canon_branch`.
5. Otherwise, fall back to `trunk` if it exists locally, then `main`, then `master`.
6. If none of the above succeeds, stop and tell the writer: "I can't tell which branch is your canon manuscript. Switch to the branch that should be canon, then run `/scr:track create <name>` again."

---

## Subcommand: track create

**Purpose:** Create a new revision track with a writer-friendly name.

**What to do:**

1. Take the `<name>` argument as the writer-friendly label (e.g., "Second draft attempt", "Editor's suggestions").
2. Generate the slug identifier: lowercase, spaces to hyphens, strip special chars. Do not add the `track/` prefix yet; keep the raw slug available for collision handling and metadata.
3. Check if a track with this label already exists in `tracks.json`. If so: "A revision track called '[name]' already exists. Use `/scr:track switch [name]` to work on it."
4. Check for unsaved changes (`git status --porcelain .manuscript/`). If changes exist: "You have unsaved changes. Save them first with `/scr:save` before creating a new track."
5. Resolve the canon branch using the Canon Branch Resolution rules above. On a first track in a fresh repo, this will usually be the current branch returned by `git branch --show-current`.
6. Check whether `track/{slug}` already exists as a branch. If it does, append `-2`, `-3`, and so on to the slug identifier until you find an unused branch name, then use that resolved slug for all remaining steps in this flow.
7. Run `git checkout -b track/{slug}` to create and switch to the new branch.
8. If `.manuscript/tracks.json` does not exist, create it with an object containing `canon_branch` and an empty `tracks` array.
9. Add the new track entry to `tracks.json`:
   ```json
   {
     "canon_branch": "<resolved canon branch>",
     "tracks": [
       {
         "label": "<name>",
         "branch": "track/<slug>",
         "created": "<ISO 8601 timestamp>",
         "author": "writer",
         "status": "active",
         "merged_at": null,
         "proposed_at": null
       }
     ]
   }
   ```
10. Read `.manuscript/config.json`. If `collaboration.tracks_enabled` is `false` or missing, set it to `true`.
11. Commit the track metadata and any config update together:
   ```
   git add .manuscript/tracks.json .manuscript/config.json
   git commit -m "Created revision track: track/{slug}"
   ```
   Never interpolate the raw writer-provided label directly into a shell command. Use the sanitized slug or another shell-safe identifier in git commit messages.
12. Confirm to the writer:

**Output:**
```
Created revision track '<name>'. You're now working on it.

Everything you write and save here stays on this track until you switch back to the canon manuscript or another track.
```

---

## Subcommand: track list

**Purpose:** Show all revision tracks with their status and last activity.

**What to do:**

1. Read `.manuscript/tracks.json`. If missing or empty: "No revision tracks yet. Create one with `/scr:track create <name>`."
2. Determine the current branch: `git branch --show-current`.
3. Resolve the canon branch using the Canon Branch Resolution rules above.
4. For each track in `tracks.json`:
   - Determine if it is the currently active track (current branch matches `track.branch`).
   - Get commit count ahead/behind canon: `git rev-list --left-right --count {canon_branch}...{branch} 2>/dev/null`.
   - Get the date of the last checkpoint on the track: `git log -1 --format="%ai" {branch} -- .manuscript/ 2>/dev/null`.
5. Always show "Canon manuscript" as the base track, marked as active if the current branch is the resolved `canon_branch`.

**Output format:**

```
Your revision tracks:

  * Canon manuscript (active)
    The base manuscript. All accepted revisions live here.

    Editor's suggestions
    3 checkpoints ahead of canon -- Last activity: Apr 6

    Second draft attempt (merged Apr 5)
    This track has been merged into canon.

    Experimental ending
    1 checkpoint ahead, 2 behind canon -- Last activity: Apr 4
```

- Mark the active track with `*` and "(active)".
- For merged tracks, show "(merged [date])" and skip ahead/behind counts.
- Use relative dates: "today", "yesterday", "Apr 6", "Mar 28".
- "Ahead" means the track has checkpoints not in canon. "Behind" means canon has checkpoints not in the track.

---

## Subcommand: track switch

**Purpose:** Switch between revision tracks or back to the canon manuscript.

**What to do:**

1. Resolve the canon branch using the Canon Branch Resolution rules above.
2. If `<name>` is "canon" or matches the resolved canon branch name: switch to the canon branch with `git checkout {canon_branch}`.
3. Otherwise, look up `<name>` in `tracks.json` by matching the `label` field (case-insensitive).
4. If not found: "No revision track called '[name]' found. Use `/scr:track list` to see available tracks."
5. Check for unsaved changes (`git status --porcelain .manuscript/`). If changes exist: "You have unsaved changes. Save them first with `/scr:save` before switching tracks."
6. Run `git checkout {branch}` using the branch name from the track entry.
7. Confirm to the writer.

**Output:**
```
Switched to revision track '<name>'.

Your work is now on this track. Any saves you make will stay here until you switch again.
```

Or if switching to canon:
```
Switched to the canon manuscript.

You're now working on the base version of your manuscript.
```

---

## Subcommand: track compare

**Purpose:** Show a side-by-side comparison between two tracks (or a track and canon) in writer-friendly language.

**What to do:**

1. **Determine what to compare:**
   - No arguments: compare current track vs canon. If already on canon: "You're on the canon manuscript. Specify a track to compare: `/scr:track compare <name>`."
   - One name: compare that track vs canon.
   - Two names: compare track A vs track B.
2. Resolve the canon branch using the Canon Branch Resolution rules above. "Canon" resolves to `{canon_branch}`.
3. Run `git diff {branch-a}...{branch-b} -- .manuscript/` to get the differences.
4. If no differences: "No differences found between '[track A]' and '[track B]'. The manuscripts are identical."

**Display format (reuses pattern from `/scr:compare`):**

Show passage-by-passage tracked changes in writer-friendly format:

```
## Tracked Changes: '<Track A>' vs '<Track B>'

### Chapter 3 -- The Arrival

**In '<Track A>':**
> Marcus walked through the empty corridor, his footsteps echoing against the marble walls.

**In '<Track B>':**
> Marcus moved through the silent corridor, each footstep a small detonation against the marble.

---

**New in '<Track A>':**
> The clockmaker paused, turning the gear over in her weathered hands. Something was different about this one.

---

### Summary

4 passages changed, 2 passages added, 1 passage removed across 3 sections.
```

**Formatting rules:**
- NEVER show raw diff markers (`+`, `-`, `@@`, line numbers, file paths, commit hashes).
- Use blockquotes (`>`) for prose passages.
- Group changes by unit (chapter/scene/section) with `###` headings.
- Label each version with "In '[track name]':" -- never "branch" or "HEAD".
- Show 1 sentence of unchanged context for readability.
- New passages use "**New in '[track name]':**".
- Removed passages use "**Removed from '[track name]':**".
- End with a summary line: "X passages changed, Y passages added, Z passages removed".

---

## Subcommand: track merge

**Purpose:** Merge a revision track into the canon manuscript, with writer-friendly continuity conflict resolution.

**What to do:**

1. Resolve `<name>` to a branch via `tracks.json`. If not found: "No revision track called '[name]' found."
2. Check if the track has any changes ahead of canon. If not: "Nothing to merge. '[name]' has no changes that differ from canon."
3. Resolve the canon branch using the Canon Branch Resolution rules above.
4. If not currently on canon, switch to canon first: `git checkout {canon_branch}`. Inform the writer: "Switching to the canon manuscript to accept the revisions."
5. Attempt the merge without creating the final commit yet: `git merge {branch} --no-ff --no-commit`.
   This must explicitly block fast-forward merges so `tracks.json` can be updated before the final merge checkpoint is created.

**If clean merge (no conflicts):**

```
Revision track '<name>' merged into the canon manuscript. All changes accepted.

Tip: Run `/scr:continuity-check` to verify everything reads smoothly after merging.
```

Update `tracks.json`: set the track's `status` to `"merged"` and `merged_at` to the current ISO timestamp, then create the final merge commit:

```
git add .manuscript/
git commit -m "Merged revision track: track/{slug}"
```

Never interpolate the raw writer-provided label directly into a shell command. Use the sanitized slug or another shell-safe identifier in git commit messages.

**If continuity conflicts arise (D-02):**

Walk through each conflicting passage one at a time. For each conflict, show both versions side by side and offer three resolution options:

```
## Continuity Conflict 1 of 3

### Chapter 5 -- The Revelation

**Canon version:**
> The old woman smiled, her eyes crinkling at the corners. "I've been expecting you," she said, gesturing toward the empty chair.

**'<Track name>' version:**
> The old woman frowned, her lips pressed into a thin line. "You're late," she snapped, not moving from her seat.

How would you like to resolve this?

1. **Keep mine** -- Use the canon version
2. **Keep theirs** -- Use the version from '<track name>'
3. **Keep both** -- Include both versions with a scene break between them
```

After the writer chooses for each conflict:
- Apply the resolution by editing the conflicted file (remove conflict markers, keep the chosen content).
- For "Keep both": concatenate both versions separated by `---` (scene break / horizontal rule).
- Stage the resolved file: `git add <file>`.
- After all conflicts are resolved, update `tracks.json`: set `status` to `"merged"`, `merged_at` to current timestamp.
- Then stage the manuscript and metadata together and create the final merge commit:
  `git add .manuscript/ && git commit -m "Merged revision track: track/{slug} (conflicts resolved)"`
- Never interpolate the raw writer-provided label directly into a shell command. Use the sanitized slug or another shell-safe identifier in git commit messages.

```
All continuity conflicts resolved. Revision track '<name>' is now merged into canon.

Tip: Run `/scr:continuity-check` to verify everything reads smoothly after merging.
```

**Language note:** Never say "merge conflict" -- always "continuity conflict". Never say "ours/theirs" in git terms -- use "canon version" and "[track name] version", or "Keep mine / Keep theirs" for the resolution options.

---

## Subcommand: track propose

**Purpose:** Create a revision proposal from a track for editor review (the writer-friendly equivalent of a pull request).

**What to do:**

1. Resolve `<name>` to a branch via `tracks.json`. If not found: "No revision track called '[name]' found."
2. Check if the track has any changes ahead of canon. If not: "Nothing to propose. '[name]' has no changes that differ from canon."
3. Resolve the canon branch using the Canon Branch Resolution rules above, then generate a diff summary: `git diff {canon_branch}...{branch} -- .manuscript/`.
4. Parse the diff to count: passages changed, passages added, passages removed, sections affected.
5. Create the proposal directory if needed: `.manuscript/proposals/`.
6. Generate `.manuscript/proposals/{track-slug}-proposal.md` with the following structure:

```markdown
# Revision Proposal: <Track Label>

**Author:** <from tracks.json author field>
**Date:** <current date>
**Track:** <track label>

## Summary of Changes

<Auto-generated from diff analysis>

- X passages changed across Y sections
- Z new passages added
- W passages removed

## Detailed Changes

<Full diff formatted in the same writer-friendly style as track compare:
passage-by-passage with Before/After blocks, grouped by section>

## Editor Notes

_Space for the editor to write feedback, approve, or request changes._

---

_This proposal was generated from revision track '<name>'. To accept these changes, run `/scr:track merge <name>`. To see the full comparison, run `/scr:track compare <name>`._
```

7. Update `tracks.json`: set `proposed_at` to the current ISO timestamp.
8. Commit the proposal file and metadata together:
   ```
   git add .manuscript/proposals/{track-slug}-proposal.md .manuscript/tracks.json
   git commit -m "Created revision proposal: track/{track-slug}"
   ```
   Never interpolate the raw writer-provided label directly into a shell command. Use the sanitized slug or another shell-safe identifier in git commit messages.

**Output:**
```
Revision proposal created for '<name>'.

The proposal is saved at .manuscript/proposals/<slug>-proposal.md
Share this file with your editor for review.

When your editor is ready to accept the changes, run `/scr:track merge <name>`.
```

---

## Co-Writing Parallel Tracks

When multiple writers work on the same manuscript simultaneously -- one handling the A-plot, another the B-plot, or one taking dialogue while another handles description -- co-writing tracks provide continuity-aware merging to catch contradictions before they become problems.

### Creating a Co-Writing Track

Use the `--co-writing` flag when creating a track intended for parallel work:

```
/scr:track create "B-plot development" --co-writing
```

This marks the track in `tracks.json` with `"type": "co-writing"` (default tracks have `"type": "revision"`):

```json
{
  "label": "B-plot development",
  "branch": "track/b-plot-development",
  "created": "2026-04-07T10:30:00Z",
  "author": "writer-b",
  "status": "active",
  "type": "co-writing",
  "merged_at": null,
  "proposed_at": null
}
```

Co-writing tracks behave identically to revision tracks for all subcommands except `merge`, where they trigger enhanced continuity checking.

### Co-Writing Merge with Continuity Checking

When `track merge` detects that the merging track and canon have BOTH been modified (i.e., parallel work happened on both sides), the merge automatically includes continuity verification:

1. **Pre-merge continuity scan.** Before finalizing the merge, run the equivalent of `/scr:continuity-check` on the combined content from both tracks. This checks for:

   - **Character state conflicts:** A character alive in one track but dead or incapacitated in another. A character in Location A in one track but Location B at the same narrative time in another.
   - **Timeline conflicts:** Events happening simultaneously in different locations involving the same character. Contradictory time references ("three days later" in one track conflicting with "the next morning" in another).
   - **World-state conflicts:** World-building facts that contradict (a city destroyed in one track but intact in another, a magic system rule applied differently, a political situation described inconsistently).

2. **Surface contradictions.** For each contradiction found, present both versions with context from each track:

   ```
   ## Continuity Contradiction 1 of 3

   ### Character State Conflict: Marcus

   **In canon (A-plot):**
   > Marcus left the city at dawn, heading north toward the mountains.
   > (Chapter 7, passage 3)

   **In 'B-plot development':**
   > Marcus met Elena at the harbor that same morning, agreeing to sail south.
   > (Chapter 7, passage 5)

   **Issue:** Marcus cannot be heading north and meeting someone at the harbor simultaneously.

   How would you like to resolve this?

   1. **Pick canon** -- Keep the A-plot version (Marcus heads north)
   2. **Pick track** -- Keep the B-plot version (Marcus at the harbor)
   3. **Reconcile** -- Write a new version that resolves the contradiction
   4. **Flag for later** -- Merge as-is and mark for revision
   ```

3. **Writer resolves each contradiction.** For each:
   - **Pick canon / Pick track:** Apply the chosen version, discard the other from the merged result.
   - **Reconcile:** The writer provides a new passage that resolves the contradiction. Apply it.
   - **Flag for later:** Include both versions with a visible marker in the manuscript: `<!-- CONTINUITY FLAG: [description] -->`. These can be found later with a search.

4. **Log all resolutions** in `.manuscript/merge-log.json`:

   ```json
   {
     "merge_date": "ISO 8601 timestamp",
     "track": "B-plot development",
     "track_type": "co-writing",
     "contradictions_found": 3,
     "resolutions": [
       {
         "type": "character_state",
         "description": "Marcus location conflict in Chapter 7",
         "canon_passage": "passage reference",
         "track_passage": "passage reference",
         "resolution": "pick_canon",
         "reconciled_text": null
       },
       {
         "type": "timeline",
         "description": "Conflicting time references in Chapter 8",
         "canon_passage": "passage reference",
         "track_passage": "passage reference",
         "resolution": "reconcile",
         "reconciled_text": "The reconciled passage text"
       },
       {
         "type": "world_state",
         "description": "City status contradiction",
         "canon_passage": "passage reference",
         "track_passage": "passage reference",
         "resolution": "flag_for_later",
         "reconciled_text": null
       }
     ]
   }
   ```

5. **Co-writing merge warning.** When merging a co-writing track, show a warning before proceeding:

   ```
   This is a co-writing track. Continuity checking will be thorough -- this may take a moment.

   Scanning for character state, timeline, and world-state contradictions across both tracks...
   ```

### When Continuity Checking Triggers

Continuity checking during merge triggers automatically when:
- The track being merged has `"type": "co-writing"` in `tracks.json`, OR
- Both the track and canon have been modified since the track was created (detected via `git rev-list --left-right --count {canon_branch}...{branch}` showing changes on both sides)

For standard revision tracks where only the track has changes (canon is unmodified), the regular merge flow applies without continuity scanning.

### Merge Log

The `.manuscript/merge-log.json` file accumulates entries from every co-writing merge. Each entry preserves both versions of contradictory passages, the resolution chosen, and any reconciled text. This provides a history of how parallel work was integrated and supports future continuity auditing.

### Automation Status

Every `track merge` response must include a compact status block:

```text
Automation status:
Trigger: /scr:track merge {track}
Auto-invoked:
- /scr:continuity-check equivalent: yes/no
Spawned agents:
- continuity-checker: yes/no
Local operations:
- track metadata checked: yes/no
- canon and track changes compared: yes/no
- merge log updated: yes/no
Why: co-writing or parallel canon changes require continuity verification before accepting revisions
```

If continuity verification did not run, say why: standard revision track, canon unchanged, or writer cancelled before merge. If native `continuity-checker` spawning is unavailable, use the installed prompt in an isolated fresh context and report `prompt-run fallback used`.

---

## Writer-Friendly Language Guide

This command MUST use writer-friendly terminology throughout. Never expose git internals.

| Git Term | Writer Term |
|----------|------------|
| branch | revision track |
| canon branch | canon manuscript (or just "canon") |
| checkout | switch to |
| commit | checkpoint / save |
| merge | accept revisions / merge (the word "merge" is acceptable in creative context) |
| merge conflict | continuity conflict |
| pull request | revision proposal |
| diff | tracked changes |
| ahead/behind | checkpoints ahead/behind |
| ours/theirs | canon version / track version |
| HEAD | current position |
| tag | draft version |

## Error Messages

All error messages use plain English:

- "You have unsaved changes. Save them first with `/scr:save` before switching tracks."
- "No revision track called '[name]' found. Use `/scr:track list` to see available tracks."
- "A revision track called '[name]' already exists. Use `/scr:track switch [name]` to work on it."
- "You're already on the canon manuscript. Specify a track to compare."
- "No revision tracks yet. Create one with `/scr:track create <name>`."
- "Nothing to merge. '[name]' has no changes that differ from canon."
- "Nothing to propose. '[name]' has no changes that differ from canon."

## Edge Cases

- **No git repo:** Initialize silently in writer mode (same as `/scr:save`).
- **No tracks.json:** Create on first `track create`.
- **Branch deleted externally:** If a track's branch no longer exists in git, mark it as "(unavailable)" in the list and suggest removing it.
- **Canon branch name:** Resolve it from `tracks.json.canon_branch` first. For older projects without that field, fall back to the current non-track branch, the remote default branch, the single non-track local branch if there is only one, then `trunk`, `main`, or `master`.
- **Track name collision:** If the slugified branch name would collide with an existing branch, append a number: `track/editors-suggestions-2`.
- **Empty track:** If a track has no changes vs canon, `merge` and `propose` should inform the writer rather than creating empty merges/proposals.

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

Supportive and clear. The writer should feel empowered to experiment freely with tracks, knowing they can always return to canon. Tracks are for creative exploration -- frame them that way, never as technical version control.
