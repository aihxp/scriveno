---
description: Create, view, or check the series bible -- a persistent cross-book knowledge base for multi-volume works (novel series, TV seasons, comic runs, sequel trilogies, multi-book commentaries).
argument-hint: "[--init] [--import <work_path>] [--check] [--timeline] [--characters]"
---

# Series bible

You are managing the series bible -- a global knowledge base that spans multiple books in a series. Unlike project-local files, the series bible lives at `~/.scriveno/series/{series_name}/SERIES-BIBLE.md` so it's shared across all books in the series.

## Modes

### No arguments

Show the current series bible if one exists. If multiple series exist, ask which. Display:
- Series name and premise
- Books in the series (and their order)
- Canonical character states (alive, dead, married, transformed, with book-of-change noted)
- Locked world rules
- Active unresolved threads
- Current timeline position

Offer to edit any section interactively.

### --init

Initialize a new series bible from the current project. Prompt for:
- Series name
- Series premise (what makes this a series, not just a collection)
- Projected length (trilogy, duology, open-ended, 7 books, etc.)
- Genre consistency expectations

Then import from the current project's context files:
- Copy CHARACTERS.md -> series canonical character states
- Copy WORLD.md -> series world rules (marked as locked)
- Extract themes and motifs from THEMES.md
- Record the current book as Book 1 in the series

Save to `~/.scriveno/series/{name}/SERIES-BIBLE.md` and add a reference in the current project's config.json: `"series": "{name}"`.

### --import <work_path>

Import another Scriveno project into the existing series bible. Merge:
- Characters not yet in the bible -> add as "appeared in Book N"
- Existing character updates -> add state changes (e.g., "Sarah married Marcus in Book 3")
- New world rules -> add unless they contradict existing rules (flag conflicts)
- Timeline events -> add to cross-book timeline
- Unresolved threads -> add to active threads

Show the writer a summary of what was merged and flag any conflicts for resolution.

### --check

Verify the current project against the series bible. Flag:
- Character state contradictions (bible says X is dead, current project has them alive)
- World rule violations (bible says magic requires Y, current project doesn't)
- Timeline inconsistencies
- Resolved threads being re-raised without acknowledgment
- Canonical events being contradicted

Produce a report with specific locations in the current project (file:line) and suggest fixes. Do not auto-fix -- the writer decides.

### --timeline

Show the cross-book timeline. Each event tagged with book and position. Useful for spotting gaps ("nothing happens for 15 years between Book 2 and Book 3") or compression problems ("three major events in the same week").

Can be viewed as a text timeline or as a visual diagram (generated via a frontend module if the runtime supports it).

### --characters

Show all characters across all books in the series with their current canonical state:

```
MARCUS VALE
  Status: alive, married (Book 3)
  First appeared: Book 1, Chapter 1
  Last appeared: Book 4, Chapter 23 (current book)
  Key changes: learned the truth about his father (Book 2), lost his hand (Book 3), became captain (Book 4)

SARAH DUNN
  Status: dead (Book 3, Chapter 28)
  ...
```

## The series bible contents

Every series bible tracks:

1. **Canonical character states** -- alive/dead, married, transformed, relationships, positions, possessions. Each state has a "since Book N" marker.
2. **Locked world rules** -- magic system rules, technology level, geography, physics. Changes require writer override with explicit note.
3. **Timeline of events** -- every significant event across all books with book/chapter reference.
4. **Relationship evolution** -- how character relationships change across books.
5. **Unresolved threads** -- what was planted and not yet resolved, with expected resolution book (if planned).
6. **Reader knowledge state** -- what the reader knows at each book's endpoint.
7. **Series-level style guide** -- voice DNA consistent across books (so Book 5 sounds like Book 1).
8. **Recurring motifs and symbols** -- visual and thematic patterns that should echo across books.
9. **Terminology glossary** -- invented words, place names, proper nouns, with canonical spelling.

## When starting a new book in the series

`/scr:new-work` automatically checks for a series bible reference in nearby projects. If found, it asks: "This looks like it might be Book N of [series]. Load the series bible?" On yes, imports all canonical states and rules, and the drafter respects them.

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

Clerical. The series bible is a reference document, not a creative one. Be precise, be complete, flag contradictions loudly. The whole point is that the writer can trust Book 7 to remember what Book 1 established -- don't let your summaries drift from source facts.
