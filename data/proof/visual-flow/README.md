# Visual Flow Proof

This proof bundle shows how Scriveno adapts to visual and script-native work. The sample uses a comic page because it makes the format shift easy to inspect: panels, image beats, captions, dialogue, and art-direction notes matter as much as prose.

## What This Proves

- Visual work can use panel and art-direction surfaces instead of prose-only chapter logic.
- The workflow can keep story movement, page rhythm, and art handoff in the same unit.
- Visual prompts are structured enough to inspect without claiming automated image generation.
- The next step stays in review before artwork or package production.

## Canonical Flow

### 1. Project state

- `data/proof/visual-flow/STATE-SNAPSHOT.md`

The snapshot records comic-native surfaces, page unit, visual continuity, and next review step.

### 2. Page plan

- `data/proof/visual-flow/1-gate-page-PLAN.md`

The plan shows page rhythm, panel count, visual beats, dialogue limits, and art-direction constraints.

### 3. Page output

- `data/proof/visual-flow/1-gate-page-OUTPUT.md`

The output is a page script with panel layout and art notes. It is a writing artifact for a visual workflow, not an image file.

### 4. Next command

The next command is:

```text
/scr:editor-review 1
```

After review, the visual path can continue to:

```text
/scr:panel-layout 1
/scr:art-direction
/scr:character-ref
```

## Reading Order

1. Read `STATE-SNAPSHOT.md`.
2. Read `1-gate-page-PLAN.md`.
3. Read `1-gate-page-OUTPUT.md`.
4. Confirm that review happens before visual asset production.

## Boundaries

This proof does not call an image API. Scriveno's current illustration commands produce structured prompts and layout guidance for external image tools or human artists.
