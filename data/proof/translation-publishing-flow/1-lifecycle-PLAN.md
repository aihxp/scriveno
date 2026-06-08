# Lifecycle Plan: Translate And Prepare For Ebook Packaging

## Command Route

```text
/scr:translation-glossary
/scr:translation-memory
/scr:translate 1 --languages fr
/scr:cultural-adaptation 1 --language fr
/scr:back-translate 1 --language fr
/scr:front-matter
/scr:back-matter
/scr:blurb
/scr:prepublish-review
/scr:publish
/scr:build-ebook
```

## Purpose

Show how Scriveno stages translation and publishing work after a draft exists.

## Glossary Seeds

| Term | Category | Guidance |
|------|----------|----------|
| watchmaker | motif | Preserve craft and timekeeping resonance. |
| sealed letter | object | Keep the object concrete, not abstract. |
| workshop | place | Use a plain term that does not sound industrial. |

## Translation Memory Seeds

| Source | Approved Handling |
|--------|-------------------|
| "He counted the seconds by touch." | Preserve physical counting and tactile time. |
| "The letter waited." | Preserve quiet agency without over-explaining. |

## Quality Checks

- Check whether object motifs survive translation.
- Check whether formal distance becomes too warm.
- Check whether back-translation adds motive, cause, or certainty not present in the source.

## Publishing Checks

- Front matter and back matter are drafted through dedicated commands.
- Prepublish review runs before export or platform build.
- `/scr:publish` sequences destination choices.
- `/scr:build-ebook` creates the ebook package only after approval.

## Next Command

```text
/scr:prepublish-review
```
