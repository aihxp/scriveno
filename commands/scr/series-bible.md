---
description: Create, view, or check the series bible -- a persistent cross-book knowledge base for multi-volume works (novel series, TV seasons, comic runs, sequel trilogies, multi-book commentaries).
argument-hint: "[--init] [--import <work_path>] [--check] [--timeline] [--characters]"
---

# Series bible

You are managing the series bible -- a global knowledge base that spans multiple books in a series. Unlike project-local files, the series bible lives at `~/.scriveno/series/{series_slug}/SERIES-BIBLE.md` so it's shared across all books in the series.

## Series slug and store path

The series directory component is always a sanitized slug, never the raw writer-typed name (see `docs/naming-conventions.md` section 3). Derive `series_slug` deterministically with the slug helper before touching the filesystem:

```
node "<data-dir>/lib/slug.js" "<series name>"
-> {"slug":"..."}
```

`<data-dir>` resolves to `.scriveno/lib` or `$HOME/.scriveno/lib`, or `lib/` in the source repo. Use `series_slug` everywhere the store path appears: the canonical store is `~/.scriveno/series/{series_slug}/`, and the bible itself is `~/.scriveno/series/{series_slug}/SERIES-BIBLE.md`. A writer-typed name is never interpolated into a path directly; routing it through `lib/slug.js` guarantees the directory component contains only `[a-z0-9-]` and can carry no path separator or traversal sequence.

### Resolving an existing series store (migration shim)

Earlier versions stored the series directory under the raw, unsanitized name. When resolving an existing store, check in order (see `docs/naming-conventions.md` section 3):

1. `~/.scriveno/series/{series_slug}/` (current, slugged path).
2. `~/.scriveno/series/{raw name}/` (legacy, pre-slug path).

If only the legacy path exists, tell the writer the store predates slugged paths and OFFER to migrate. On confirmation (never destroy data, always confirm before moving):

- Rename the legacy directory to `~/.scriveno/series/{series_slug}/`.
- Rewrite the `"series"` key in each linked project's `config.json` from the raw name to `series_slug`.

If the writer declines, keep reading from the legacy path for this run and leave it in place.

### Derived books index (`books.json`)

`~/.scriveno/series/{series_slug}/books.json` is a derived index of member books. Each entry is `{ "slug", "book_number", "title", "path" }`. It is regenerated from the linked projects, never hand-authored, consistent with the rest of Scriveno's trust layer. Update it on `--init` (seed the first book) and `--import` (add or refresh the imported book). Use it as the source for the books-in-series listing in the no-argument, `--characters`, and `--timeline` modes.

### Series-tier shared surfaces

Beyond `SERIES-BIBLE.md` and `books.json`, the series store MAY hold OPTIONAL shared surfaces that individual books read with project-local fallback (see `docs/naming-conventions.md` section 3):

- `STYLE-GUIDE.md` -- series Voice DNA, read by the drafter (falls back to the project-local `STYLE-GUIDE.md`).
- `ART-DIRECTION.md` -- series visual style bible, read by `/scr:cover-art --series` (falls back to project-local `.manuscript/illustrations/ART-DIRECTION.md`).
- `GLOSSARY.md` -- canonical proper nouns and invented terms, read by the translator (falls back to project-local glossary).
- `covers/` -- per-book cover gallery for visual consistency and box-set work.

These are optional: a book that has no series-tier surface uses its project-local file unchanged.

## Modes

### No arguments

Resolve the series store (slugged path first, then legacy per the migration shim above). Show the current series bible if one exists. If multiple series exist, ask which. Display:
- Series name and premise
- Books in the series (and their order), sourced from `books.json` (each entry's `book_number`, `title`, and `slug`)
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

Derive `series_slug` from the series name with the slug helper (see `docs/naming-conventions.md` section 3) before writing anything.

Then import from the current project's context files:
- Copy CHARACTERS.md -> series canonical character states
- Copy WORLD.md -> series world rules (marked as locked)
- Extract themes and motifs from THEMES.md
- Record the current book as Book 1 in the series (prose tracking)

Save to `~/.scriveno/series/{series_slug}/SERIES-BIBLE.md`.

Write the structured linkage in the current project's `config.json`:
- Set `"series"` to the **slug** (`series_slug`), not the raw name.
- Set `"book_number"` to `1` for this first book.

Seed the derived books index `~/.scriveno/series/{series_slug}/books.json` with the first book's entry `{ "slug", "book_number", "title", "path" }`. Resolve `slug` and `title` from the project's config identity (config first, documented fallback per `docs/naming-conventions.md` section 2); `path` is the project's `.manuscript/` location; `book_number` is `1`. `books.json` is derived and regenerable, never hand-authored.

OFFER to seed the series-tier shared surfaces so later books inherit them (see `docs/naming-conventions.md` section 3). On confirmation:
- Seed `~/.scriveno/series/{series_slug}/STYLE-GUIDE.md` from the current project's `STYLE-GUIDE.md`.
- Seed `~/.scriveno/series/{series_slug}/ART-DIRECTION.md` from `.manuscript/illustrations/ART-DIRECTION.md` when that file is present.

The "Book 1" prose tracking remains; `book_number` and `books.json` are additive structured data alongside it.

### --import <work_path>

Resolve the existing series store (slugged path first, then legacy per the migration shim above). Import another Scriveno project at `<work_path>` into the existing series bible. Merge:
- Characters not yet in the bible -> add as "appeared in Book N"
- Existing character updates -> add state changes (e.g., "Sarah married Marcus in Book 3")
- New world rules -> add unless they contradict existing rules (flag conflicts)
- Timeline events -> add to cross-book timeline
- Unresolved threads -> add to active threads

Set the imported book's `"book_number"` in its own `config.json` to its position in the series (the next free slot, consistent with the "Book N" prose tracking), and set its `"series"` key to `series_slug`.

Add or refresh the imported book's entry in `~/.scriveno/series/{series_slug}/books.json` as `{ "slug", "book_number", "title", "path" }`, resolving `slug` and `title` from the imported project's config identity (config first, documented fallback per `docs/naming-conventions.md` section 2) and `path` from `<work_path>`. `books.json` is derived and regenerable, never hand-authored.

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

Show the cross-book timeline. Each event tagged with book and position, with the set of books and their order sourced from `books.json`. Useful for spotting gaps ("nothing happens for 15 years between Book 2 and Book 3") or compression problems ("three major events in the same week").

Can be viewed as a text timeline or as a visual diagram (generated via a frontend module if the runtime supports it).

### --characters

Show all characters across all books in the series with their current canonical state. Use `books.json` for the roster of member books and their order when attributing appearances:

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
