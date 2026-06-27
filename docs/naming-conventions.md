# Scriveno Naming Conventions

The single source of truth for how Scriveno names books, series directories, and
publication deliverables. Commands that create files cite this document instead
of hardcoding their own scheme, so naming stays consistent across export, cover
art, translation, and series tooling.

This spec is **additive and backward-compatible**. Existing projects that carry
no book identity keep producing exactly the filenames they do today. The slugged
and qualified names described here are layered on top only when the project has
a book identity to derive them from.

## 1. The slug algorithm

The canonical slug algorithm is shipped, dependency-free, in `lib/slug.js`
(re-exported from `lib/track-safety.js`, where the injection-safety tests live).
A runtime derives a guaranteed-safe slug deterministically rather than applying
the rules by hand:

```
node <data-dir>/lib/slug.js "The Long War"
-> {"slug":"the-long-war"}
```

Rules (`sanitizeSlug`): lowercase; collapse whitespace and underscores to a
single hyphen; strip everything that is not `[a-z0-9-]`; collapse hyphen runs;
trim leading and trailing hyphens. An empty or fully-stripped label (for example
`***` or a non-Latin script) falls back to `untitled`.

**Safety property:** a sanitized slug contains only `[a-z0-9-]`, so it can never
carry a shell metacharacter, quote, whitespace, path separator (`/`, `\`), or
path-traversal sequence (`..`). This is what makes it safe to interpolate a
writer-typed name into a path such as `~/.scriveno/series/<slug>/` or into an
export filename.

Any command that turns a human-typed label (book title, series name, edition
label) into a directory or filename component MUST route it through this
algorithm. Do not invent a second slugifier.

## 2. Book identity (config.json)

A book's machine-readable identity lives in `.manuscript/config.json` as
**optional** top-level keys. `/scr:new-work` and `/scr:import` populate them;
older projects may omit any of them.

| Key | Type | Meaning | Derived from |
|-----|------|---------|--------------|
| `title` | string | Human title of this book | onboarding answer / WORK.md H1 |
| `subtitle` | string (optional) | Subtitle, if any | onboarding answer |
| `author` | string | Author name as it should appear on the work | onboarding answer |
| `slug` | string | Stable filesystem identity for this book | `sanitizeSlug(title)`, written once at creation |
| `series` | string or null | Series slug this book belongs to (see section 3) | `/scr:series-bible --init` |
| `book_number` | integer or null | Position within the series | series linkage |

**Reader rule (fallback contract):** any command that needs identity prefers the
config key, and falls back to today's source when it is absent:

- `title`: config `title`, else the first H1 in `.manuscript/WORK.md`.
- `author`: config `author`, else WORK.md author field, else leave blank and
  warn (never invent one).
- `language`: `translation.source_language`, else `en`. (Language has a single
  home in the `translation` block; it is not duplicated as a top-level key.)
- `slug`: config `slug`, else `sanitizeSlug(resolved title)` computed on the fly.

`slug` is written once at creation and treated as stable. If the writer renames
the book, the title changes but the slug does not move on its own; renaming the
slug is an explicit, separate action so existing deliverables and links do not
silently orphan.

## 3. Series store and series slug

A series is not a container directory of books. Each book stays its own
`.manuscript/` project. The shared, cross-book state lives globally at:

```
~/.scriveno/series/<series_slug>/
```

`<series_slug>` is `sanitizeSlug(series name)`. Never interpolate the raw
writer-typed series name into this path. Two visually similar names ("The Long
War" and "the long war!") intentionally resolve to the same slug, which is the
desired collision behavior for a single series.

The series store holds:

| Path | Role |
|------|------|
| `SERIES-BIBLE.md` | Canonical cross-book narrative state (characters, world rules, timeline, threads) |
| `books.json` | Derived index of member books: `slug`, `book_number`, `title`, `path` |
| `STYLE-GUIDE.md` (optional) | Series-level Voice DNA, read with project-local fallback |
| `ART-DIRECTION.md` (optional) | Series-level visual style bible, read with project-local fallback |
| `GLOSSARY.md` (optional) | Series-level term and name glossary, read with project-local fallback |
| `covers/` (optional) | Per-book cover gallery for visual consistency and box-set work |

A project links to its series by storing the **series slug** (not the raw name)
in config `series`, plus its `book_number`. `books.json` is derived: it is
regenerated from the linked projects, never hand-maintained, consistent with the
rest of Scriveno's trust layer.

**Migration shim:** because earlier versions stored the series directory under
the raw, unsanitized name, series tooling resolves the store by checking, in
order: `~/.scriveno/series/<series_slug>/`, then a legacy
`~/.scriveno/series/<raw name>/`. When only the legacy path exists, offer to
migrate it to the slugged path and rewrite linked configs.

## 4. Deliverable filename grammar

Final, shippable deliverables follow this grammar:

```
{slug}[-{lang}][-{platform}][-v{n}].{ext}
```

- `{slug}` is the book slug (section 2).
- `-{lang}` is included for any edition that is not the primary language. The
  primary-language edition omits it. Use the language tag from config.
- `-{platform}` is included for platform-specific store builds (`kdp`, `ingram`,
  `apple`, `bn`, `d2d`, `kobo`, `google`, `smashwords`). Format-only or
  store-agnostic outputs omit it.
- `-v{n}` is an optional integer revision token for keeping a prior submitted
  file (for example `-v2`) instead of overwriting in place.
- `{ext}` is the format extension.

`lib/slug.js` composes these deterministically:

```
node <data-dir>/lib/slug.js --name slug=the-long-war lang=fr platform=kdp v=2 ext=epub
-> the-long-war-fr-kdp-v2.epub
```

Examples:

| Deliverable | Name |
|-------------|------|
| Primary-language EPUB | `the-long-war.epub` |
| KDP EPUB build | `the-long-war-kdp.epub` |
| French EPUB | `the-long-war-fr.epub` |
| IngramSpark print interior | `the-long-war-ingram.pdf` |
| Second revision of the print interior | `the-long-war-ingram-v2.pdf` |

## 5. Canonical-literal default (backward compatibility)

Changing default output filenames is the one place that can break existing
projects, scripts, and the cover-asset contract test. The rule:

1. **Keep the current literal stem as the canonical default.** When the project
   has no `slug`, commands write exactly the filenames they write today
   (`manuscript.epub`, `manuscript-print.pdf`, `build/ebook-cover.jpg`, and so
   on). Nothing changes for an identity-less project.
2. **When a `slug` exists, also produce a slugged copy** named per section 4,
   alongside the canonical file. The canonical name remains the stable contract
   other commands and tests rely on; the slugged copy is the self-describing,
   collision-safe artifact a writer collects for upload.
3. Commands report both paths so the writer knows which file is which.

This means a multi-book writer gets `the-long-war.epub` and `the-reckoning.epub`
that never collide, while the canonical `manuscript.epub` contract and every
existing test stay green.

**One deliberate exception: platform-encoded build outputs.** `/scr:build-print`
has always written `print-{platform}.pdf`, and `/scr:build-ebook` now writes
`ebook-{platform}.epub` (and `ebook-fixed-layout-{platform}.epub`) to match it.
These build commands run once per target platform, so a platform token is part
of the canonical name itself, not a slugged copy. Without it, building the KDP
EPUB and then the Apple EPUB would overwrite the same `ebook.epub`. This is the
only place a former literal (`ebook.epub`) was renamed rather than preserved;
the slugged copy ({slug}-{platform}.epub) is still layered on top when a `slug`
exists.

## 6. Directory split: `build/` vs `output/`

- `.manuscript/build/` holds cover binaries and editable cover/source assets
  (`ebook-cover.jpg`, `paperback-cover.pdf`, `hardcover-cover.pdf`,
  `source/`). Per-language and per-edition cover slots live under
  `build/<lang>/` and `build/editions/<edition>/`, with the three canonical
  top-level cover files remaining the primary-edition default.
- `.manuscript/output/` holds export and build deliverables and the assembly
  intermediates (`assembled-manuscript.md`, `metadata.yaml`). Translated-edition
  deliverables export under `.manuscript/output/translations/<lang>/`, while a
  translation's working files, assembly intermediates, and localized front/back
  matter live under `.manuscript/translation/<lang>/`.

## 7. Consuming this spec from a command

A command that writes a deliverable should:

1. Resolve book identity per section 2 (config first, documented fallback).
2. If a `slug` is available, derive the qualified name with `lib/slug.js`
   (`buildDeliverableName`) per section 4.
3. Write the canonical literal file as today (section 5, rule 1), then, when a
   slug exists, write or copy the slugged deliverable (section 5, rule 2).
4. Report both the canonical and slugged paths.

Commands that build a series or edition path (series tooling, translated
exports, per-language covers) MUST slugify writer-typed names with `lib/slug.js`
before they touch the filesystem.
