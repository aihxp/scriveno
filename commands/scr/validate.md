---
description: Scan draft files for unresolved scaffold markers before export.
argument-hint: ""
---

# /scr:validate -- Scaffold Validation

Scan all draft files in `.manuscript/drafts/` for unresolved scaffold markers. On a clean manuscript, confirms readiness for export. On a dirty manuscript, lists every marker by file and line number, then stops -- do not proceed to export until markers are resolved.

## Usage

```
/scr:validate
```

No flags. This command is a pre-export gate with a clear PASS or FAIL output.

## Instruction

You are a **manuscript validation specialist**. Your job is to scan draft files for leftover template scaffold markers and report a clear PASS or FAIL result.

---

### STEP 1: LOAD CONTEXT

1. Read `.manuscript/config.json` to get `work_type` and `title`.
2. Read Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) to verify project context.
3. **Prerequisite guard:** If `.manuscript/drafts/` does not exist or contains no `.md` files:

   > **No draft files found.** Run `/scr:draft` to create your first draft unit before validating.

   Then **stop** -- do not proceed.

---

### STEP 2: SCAN FOR SCAFFOLD MARKERS

Scan all `.md` files in `.manuscript/drafts/` recursively. For each file, check line by line:

**Bracket markers (line-based):**
- Lines containing `[Fill in` -- covers `[Fill in:]` and `[Fill in or delete:]`
- Lines containing `[Delete if not applicable:]`

**Alternate blocks:**
- Lines containing `Alternate 1:` or `Alternate 2:` (at line start or inline)

**Duplicate H1 headings:**
- Files with more than one line matching `^# ` (single hash + space, top-level heading)

**Merge conflict markers:**
- Lines starting with `<<<<<<<`
- Lines starting with `=======`
- Lines starting with `>>>>>>>`

**IMPORTANT:** `{{VAR}}` tokens are NOT scaffold markers. Do not flag them. They represent writer content placeholders and are out of scope for this validation gate.

For each match, record it as:

```
path/to/file.md:LINE_NUMBER: marker text
```

Track the total number of `.md` files scanned.

---

### STEP 3: REPORT

---

#### If markers are found (FAIL path)

Output a VALIDATION FAILED header, then the full file:line list, then the resolution pointer. Then **stop** -- do not proceed. Report a failure (non-zero) outcome.

```
VALIDATION FAILED -- unresolved scaffold markers found:

.manuscript/drafts/body/1-opening-image-DRAFT.md:3: [Fill in or delete:]
.manuscript/drafts/body/1-opening-image-DRAFT.md:47: Alternate 1:
.manuscript/drafts/body/3-reversal-DRAFT.md:12: [Fill in:]
.manuscript/drafts/body/4-choice-DRAFT.md:88: <<<<<<< HEAD

Found 3 scaffold markers in 2 file(s).
Run `/scr:cleanup --apply` to remove scaffold markers automatically,
or manually edit the listed files and re-run `/scr:validate`.
```

The file:line output format (`.md:LINE_NUMBER:`) allows the writer to jump directly to each marker in their editor.

Then **stop** -- the manuscript is not ready for export.

---

#### If no markers found (PASS path)

Output the pass confirmation:

```
OK Manuscript clean -- no scaffold markers found (N files checked)
```

Where N is the total number of `.md` files scanned in `.manuscript/drafts/`.

This confirms the manuscript is clean and ready to proceed to `/scr:export` or `/scr:publish`.

---

### Marker reference (for consistency with /scr:cleanup)

| Marker class | Detected pattern | Blocking? |
|---|---|---|
| Bracket marker | `[Fill in` (covers `[Fill in:]`, `[Fill in or delete:]`) | Yes |
| Bracket marker | `[Delete if not applicable:]` | Yes |
| Alternate block | `Alternate 1:` or `Alternate 2:` | Yes |
| Duplicate H1 | >1 line matching `^# ` in one file | Yes |
| Merge conflict marker | Line starts with `<<<<<<<`, `=======`, or `>>>>>>>` | Yes |
| `{{VAR}}` token | Any `{{...}}` pattern | **No -- not scaffold** |

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
