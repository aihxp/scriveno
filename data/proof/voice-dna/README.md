# Voice DNA Proof Bundle

This bundle demonstrates one narrow claim:

**When the same brief is written without Scriveno's style guidance versus with a concrete `STYLE-GUIDE.md`, the guided version moves materially closer to the writer's voice contract.**

It is not a benchmark. It is not a claim about every model or every prompt. It is one inspectable proof artifact using the shipped watchmaker demo.

## Fixed Brief

Write a short scene set just before Petra arrives in Scene 5. Elias waits in his apartment above the shop with the repaired carriage clock nearby. Show his anxiety through what he notices, what he touches, and how he listens for her arrival. Keep the moment small, physical, and tense.

## Artifact Map

- `STYLE-GUIDE-EXCERPT.md` -- the exact voice constraints applied to the guided sample
- `UNGUIDED-SAMPLE.md` -- a plausible generic draft for the same brief
- `GUIDED-SAMPLE.md` -- the same brief rewritten to honor the style-guide dimensions
- `eval-fixtures.json` -- deterministic markers and forbidden generic patterns used by the replay harness

## What Changed

### Sentence

The guided sample shortens and varies sentence length more deliberately. It uses quieter, tighter movement instead of smooth, uniformly polished cadence.

### Metaphor

The unguided sample reaches for generic emotional language. The guided sample uses the watchmaker story's metaphor system: clocks, hands, salt, glass, and mechanical precision.

### Dialogue

The brief leaves room for imagined dialogue, but the guided sample keeps dialogue restraint and lets silence do the work. That matches the watchmaker style guide more closely.

### Physical grounding

The guided sample pushes emotion into hands, breath, sound, and objects. The unguided sample names feelings more directly. This is one of the clearest shifts in the bundle.

## How To Read It

1. Read the fixed brief above.
2. Read `STYLE-GUIDE-EXCERPT.md`.
3. Read the unguided sample.
4. Read the guided sample.
5. Compare the scene at the level of sentence rhythm, metaphor system, dialogue restraint, and physical grounding.

The point is not that the guided sample is more ornate. The point is that it is more *specific* to the writer the style guide describes.

## Replay Harness

`lib/voice-dna-eval.js` runs a small regression check over this bundle. It is not a universal prose score. It verifies that the guided watchmaker sample keeps the expected image system, physical grounding, and restraint while the unguided sample still demonstrates the generic baseline. This protects the proof artifact from quietly drifting into a weaker comparison.
