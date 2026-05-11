---
description: Launch or clear a pre-built sample project sandbox for exploring Scriven without risk.
argument-hint: "[--clear] [--genre <genre>]"
---

# Demo

You are managing the demo sandbox -- a pre-built sample project that lets the writer explore every command without affecting their real work.

## What to do

### If called without arguments

Create a new demo project in `./scriven-demo/.manuscript/` with a pre-built short story (~5 scenes, genre-neutral literary fiction) that showcases all the key features:

- **WORK.md** -- A real premise ("A retired watchmaker in a coastal town receives a letter from a daughter he never knew he had")
- **BRIEF.md** -- Filled in with real creative decisions
- **OUTLINE.md** -- 5 scenes mapped to a complete short story arc
- **STATE.md** -- Set to "4 of 5 scenes drafted" so the writer can try `/scr:next` and see it work
- **STYLE-GUIDE.md** -- Fully populated with concrete voice dimensions (not placeholders)
- **CHARACTERS.md** -- Two characters with full voice anchors: Eliáš the watchmaker, Petra the daughter
- **PLOT-GRAPH.md** -- Arc positions marked, emotional beats specified
- **THEMES.md** -- Themes of lost time, parenthood, second chances
- **4 drafted scenes** in `.manuscript/drafts/body/1-*-DRAFT.md` through `.manuscript/drafts/body/4-*-DRAFT.md`
- **1 planned-but-not-drafted scene** at `.manuscript/plans/5-*-PLAN.md` so the writer can try `/scr:draft 5` and see the drafter in action
- **Editor review** at `.manuscript/reviews/2-*-REVIEW.md` so the writer can try reviewing and revising

After generating, tell the writer:
```
Demo project created at ./scriven-demo/

Try any of these to see Scriven in action:
  cd scriven-demo
  /scr:progress              See where the project is
  /scr:next                  Let Scriven pick your next move
  /scr:draft 5               Watch the drafter produce scene 5 in the established voice
  /scr:editor-review 2       See editor-style review on an existing scene
  /scr:continuity-check      Run a continuity pass across the whole story
  /scr:cover-art             Generate a cover concept
  /scr:export docx           Export the whole story as a manuscript

When you're ready to work on your own project:
  /scr:demo --clear          Remove the demo
  cd ..
  /scr:new-work              Start fresh
```

### If called with --clear

Ask: "Remove the demo project at ./scriven-demo/? This will delete all demo files." Wait for confirmation. On yes, remove the directory and confirm. Don't run the removal without asking -- the writer might have edited demo files and want to keep some.

### If called with --genre

Pick an alternate premise matching the genre:
- **Thriller** -- "A federal prosecutor gets a witness-list anonymously, and her own name is on it"
- **Romance** -- "Two rival florists share a wall -- and both want the same storefront"
- **Sci-fi** -- "Humanity's first faster-than-light probe returns a signal no one can decode"
- **Fantasy** -- "A city's memory is stored in a living library that's starting to forget"
- **Horror** -- "The lighthouse keeper is told never to look inside the cabinet. The cabinet is whispering."
- **Literary** (default) -- Watchmaker story above

Same structure, different premise and characters.

## Key principle

The demo must feel real. Not placeholders, not lorem ipsum, not "example scene 1." Actual prose the writer can read and react to. The demo is often the writer's first experience of what Scriven can do -- make it count.

## Tone

Welcoming. Guide-like. The writer is exploring, not committing. Suggest what to try, don't prescribe.
