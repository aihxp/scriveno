---
description: Strip template scaffold markers from draft files. Dry-run by default.
argument-hint: "[--apply]"
---

# /scr:cleanup -- Scaffold Cleanup

Strip bracket markers, Alternate blocks, and duplicate H1 headings from `.manuscript/drafts/`. Dry-run by default -- shows what would be removed without modifying any files. Pass `--apply` to execute changes in place.

## Usage

```
/scr:cleanup [--apply]
```

**Flags:**
- `--apply` -- Modify files in place and show diff summary. Default: dry-run only.

## Instruction

You are a **manuscript cleanup specialist**. Your job is to identify and optionally remove template scaffold markers left over from draft generation.

---

### STEP 1: LOAD CONTEXT

1. Read `.manuscript/config.json` to get `title`, `author`, and `work_type`.
2. Read Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) to verify project context.
3. **Prerequisite guard:** If `.manuscript/drafts/` does not exist or contains no `.md` files:

   > **No draft files found.** Run `/scr:draft` to create your first draft unit before running cleanup.

   Then **stop** -- do not proceed.

---

### STEP 2: SCAN DRAFT FILES

Scan all `.md` files in `.manuscript/drafts/` recursively. For each file, check line by line for the following scaffold marker classes:

**Bracket markers (line-based):**
- Lines containing `[Fill in` -- covers `[Fill in:]` and `[Fill in or delete:]`
- Lines containing `[Delete if not applicable:]`

**Alternate blocks:**
- Lines containing `Alternate 1:` or `Alternate 2:` (at line start or inline)
- Record the full block extent: from the `Alternate N:` line through the first of:
  - (a) the next blank line (any standalone blank line stops the block), or
  - (b) the next line containing `Alternate M:` (another Alternate header), or
  - (c) a line starting with `## ` or `# ` (section heading boundary), or
  - (d) end of file

**Duplicate H1 headings:**
- Identify all lines matching `^# ` (single hash + space, top-level heading) in the file
- The FIRST occurrence is the canonical heading
- All subsequent `# ` heading lines are duplicates and are flagged for removal

**IMPORTANT:** Do NOT flag or strip `{{VAR}}` tokens. These are unfinished writer content placeholders, not scaffold markers. `{{VAR}}` is out of scope for cleanup.

Build a per-file list of: file path, line number, marker type and text.

---

### STEP 3: APPLY OR REPORT

Branch on whether `--apply` was passed:

---

#### Dry-run (default, no `--apply` flag)

If no markers found across any file, output:

```
No scaffold markers found. Your manuscript is clean.
```

For each file with markers, output the dry-run format:

```
Would remove from chapter-01.md:
  - line 3: [Fill in or delete:]
  - line 47: Alternate 1: block (lines 47-52)
  - line 89: [Fill in:]

Summary: 3 bracket markers, 1 Alternate block, 0 duplicate H1 headings across 1 file(s).
Run `/scr:cleanup --apply` to apply these changes.
```

Show each file's list in full before the summary. The summary line must include counts for all three marker classes.

---

#### Apply mode (`--apply` flag passed)

For each file with markers:

1. Edit the file in place, removing the identified markers:
   - **Bracket markers:** Remove the entire line containing `[Fill in`, `[Fill in or delete:]`, or `[Delete if not applicable:]`
   - **Alternate blocks:** Remove from the `Alternate N:` line through the block boundary (as defined in STEP 2)
   - **Duplicate H1 headings:** Remove all `# ` heading lines after the first one in each file

2. After editing each file, output:

```
Cleaned chapter-01.md:
  - Removed 3 bracket markers
  - Removed 1 Alternate block
  - Removed 0 duplicate H1 headings
```

After all files are processed, output the final summary:

```
Summary: 3 bracket markers, 1 Alternate block, 0 duplicate H1 headings removed from 1 file(s).
```

If nothing was found (all files already clean), output:

```
No scaffold markers found. Manuscript already clean.
```

---

### Marker definitions (reference)

| Marker class | Pattern | Action |
|---|---|---|
| Bracket marker | Line contains `[Fill in` | Remove line |
| Bracket marker | Line contains `[Delete if not applicable:]` | Remove line |
| Alternate block | Line contains `Alternate 1:` or `Alternate 2:` | Remove block through boundary |
| Duplicate H1 | File has >1 line matching `^# ` | Remove all `# ` lines after first |
| `{{VAR}}` token | Any `{{...}}` pattern | **NOT scaffold -- do not strip** |

File scope is strictly `.manuscript/drafts/`. Front-matter files (under `.manuscript/front-matter/`) and back-matter files are excluded by this explicit path restriction.

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
