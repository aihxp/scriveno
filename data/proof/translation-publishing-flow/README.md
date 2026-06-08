# Translation And Publishing Flow Proof

This proof bundle shows Scriveno after a draft exists. It combines a translation quality path with a publishing readiness path so the lifecycle depth is inspectable without pretending everything happens in one command.

## What This Proves

- Translation is staged through glossary, memory, translation, cultural adaptation, and back-translation.
- Publishing is staged through front matter, back matter, blurb, prepublish review, publish sequencing, and package builders.
- `/scr:publish` is a sequencing hub, while `/scr:export` and build commands create files.
- The proof keeps review and writer approval visible before final package generation.

## Canonical Flow

### 1. Project state

- `data/proof/translation-publishing-flow/STATE-SNAPSHOT.md`

The snapshot records the draft-ready state, translation target, publishing boundary, and manual gates.

### 2. Lifecycle plan

- `data/proof/translation-publishing-flow/1-lifecycle-PLAN.md`

The plan shows glossary terms, translation memory seed, cultural adaptation checks, back-translation, front/back matter, and publish sequencing.

### 3. Output evidence

- `data/proof/translation-publishing-flow/1-lifecycle-OUTPUT.md`

The output is a compact artifact showing glossary rows, translated segment, back-translation drift notes, and publishing readiness.

### 4. Next command

The next command is:

```text
/scr:prepublish-review
```

That keeps editorial review before final package generation.

## Reading Order

1. Read `STATE-SNAPSHOT.md`.
2. Read `1-lifecycle-PLAN.md`.
3. Read `1-lifecycle-OUTPUT.md`.
4. Confirm that final package building waits for prepublish review.

## Boundaries

This proof bundle does not call an external translation API or generate a final EPUB. It proves the workflow shape and the quality gates that should exist before those actions.
