---
description: "Show manuscript word count, chapter count, estimated page count, and reading time."
argument-hint: "[--detail]"
---

# /scr:manuscript-stats -- Manuscript Statistics

Show key metrics about the current manuscript: word count, unit count, page estimate, and reading time.

## Usage
```
/scr:manuscript-stats [--detail]
```

**Flags:**
- `--detail` -- Show per-unit breakdown (word count and page estimate per chapter/scene)

## Instruction

You are computing and displaying manuscript statistics. Read the project's drafts and outline, calculate metrics, and present them clearly.

### STEP 1: LOAD CONTEXT

1. Read `.manuscript/config.json` to get:
   - `title` -- the manuscript title
   - `author` -- the author name
   - `work_type` -- the work type (novel, memoir, screenplay, etc.)
2. Read Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) to get the structural hierarchy names for this work type (e.g., "chapter", "scene").
3. Read `.manuscript/OUTLINE.md` to get:
   - Total unit count (count all atomic-level units listed in the outline)
   - Unit names/titles for the `--detail` display

### STEP 2: COUNT WORDS

1. **Body text:** Read all files in `.manuscript/drafts/body/` recursively.
   - For each file, count words by splitting on whitespace.
   - Exclude pure markdown formatting markers (lines that are only `---`, `#` headers with no prose, empty lines).
   - Track per-unit word counts (match filenames to outline units) for `--detail` mode.

2. **Front matter:** Count words in all files under `.manuscript/front-matter/` recursively. Track as `front_matter_words`.

3. **Back matter:** Count words in all files under `.manuscript/back-matter/` recursively. Track as `back_matter_words`.

4. **Compute totals:**
   - `body_word_count` = sum of all body file word counts
   - `full_word_count` = body_word_count + front_matter_words + back_matter_words

### STEP 3: CALCULATE METRICS

Using the counts from Step 2:

- **Total word count (body):** `body_word_count`
- **Full word count:** `full_word_count` (body + front + back matter)
- **Unit count:** Total atomic units from OUTLINE.md
- **Drafted unit count:** Number of files that exist in `.manuscript/drafts/body/` (each file = one drafted unit)
- **Draft completion:** `(drafted_units / total_units) * 100`, rounded to nearest integer, displayed as percentage
- **Estimated page count:** `ceil(full_word_count / 250)` -- standard 250 words per page
- **Reading time (average):** `ceil(full_word_count / 250)` minutes at 250 wpm average reading speed. Format as `Xh Ym` if 60+ minutes, otherwise `Xm`.
- **Reading time (careful):** `ceil(full_word_count / 200)` minutes at 200 wpm careful reading speed. Same formatting.
- **Front matter elements:** Count of files in `.manuscript/front-matter/`
- **Back matter elements:** Count of files in `.manuscript/back-matter/`

### STEP 4: DISPLAY

Present the statistics in this format:

```
Manuscript Statistics
====================

Title: {title} by {author}
Work Type: {work_type}

Words:      {body_word_count} (body)
            {full_word_count} (with front/back matter)
Units:      {drafted_units}/{total_units} ({completion}% complete)
Pages:      ~{page_count} (estimated at 250 words/page)
Reading:    ~{reading_avg} (average) / ~{reading_careful} (careful)

Front Matter: {front_count} elements
Back Matter:  {back_count} elements
```

Format word counts with commas for readability (e.g., `42,350`).

If front matter or back matter directories don't exist or are empty, show `0 elements` for those lines.

If no drafts exist yet, show `0` for word counts and `0%` completion, with a note: "No drafts found. Run `/scr:draft` to begin writing."

### --detail MODE

If the user passes `--detail`, append a per-unit breakdown table after the summary:

```
Unit Breakdown
--------------
Ch 1: The Beginning    [x] done          3,200 words   ~13 pages
Ch 2: The Middle       [x] done          4,100 words   ~16 pages
Ch 3: The Climax       [~] in progress   2,800 words   ~11 pages
Ch 4: The Resolution   [ ] untouched      --- words    --- pages
--------------
Total                                   10,100 words   ~40 pages
```

- Use the hierarchy's mid-level label (e.g., "Ch" for chapter, "Sc" for scene, "Sec" for section) from CONSTRAINTS.json.
- Show each unit's status (`[x]` done, `[~]` in progress, `[ ]` untouched) derived from disk per `docs/progress-protocol.md`. The full per-unit ledger lives in `.manuscript/PROGRESS.md`.
- For units not yet drafted, show dashes for counts.
- Right-align word counts and page counts for visual clarity.
- Include a total row at the bottom.

## Edge Cases

- **No `.manuscript/` directory:** Report "No manuscript found. Run `/scr:new-work` to start a project."
- **No OUTLINE.md:** Report word counts from existing drafts but note "No outline found -- unit count unavailable."
- **Empty drafts directory:** Show 0 words, 0% completion.
- **Mixed file types in drafts:** Only count `.md` files. Ignore images, PDFs, or other non-text files.

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
