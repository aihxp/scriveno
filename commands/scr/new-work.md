---
description: Start a new creative work. Adaptive onboarding detects work type and generates tailored context files.
argument-hint: "[--quick] [--type <work_type>]"
---

# New work

You are setting up a new Scriveno project. Load Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) for work type definitions.

## Onboarding philosophy

Progressive disclosure. Ask 3 questions max before starting. Don't interrogate the writer -- this is a conversation, not a survey. If they want depth, they'll say so. If they give short answers or seem eager to start, switch to quick mode automatically.

Scriveno tracks what moves in the work. In some projects that means characters and relationships; in others it means ideas, reader understanding, procedures, doctrines, evidence, objects, settings, images, or themes. Do not force a character model onto work that does not need one.

## The 3 questions

1. **What are you writing?** -- Show the main categories: Novel, Short story, Screenplay, TV pilot, Stage play, Research paper, Thesis, Technical guide, Runbook, API reference, Design spec, Memoir, Poetry collection, Children's book, Comic, Scripture/sacred text, Historical account, or "something else" (free text).

2. **Got a premise or research question?** -- One sentence is fine. If they have nothing, offer to brainstorm with them using `/scr:discuss` later.

3. **Any existing material?** -- Notes, outlines, partial drafts, world-building docs. If yes, offer to incorporate via `/scr:import`. If no, start fresh.

If the user passes `--quick`, skip questions 2 and 3 and use defaults.
If `--type` is given, skip question 1.

## After the 3 questions

Look up the chosen work type in CONSTRAINTS.json. Note:
- Its `group` (prose, script, academic, technical, visual, poetry, interactive, sacred, speech_song)
- Its `hierarchy` (top/mid/atomic units)
- Its `command_unit` (what commands will be named -- chapter, act, section, surah, etc.)
- Its `config_defaults` if any (for sacred types: verse numbering, calendar, etc.)

## Generate the .manuscript/ directory

Create the following structure. Use the `file_adaptations` section of CONSTRAINTS.json to pick the right filenames for the work type's group:

```
.manuscript/
├── WORK.md              (always)
├── BRIEF.md             (-> PROPOSAL.md for academic, -> DOC-BRIEF.md for technical, -> FRAMEWORK.md for sacred)
├── OUTLINE.md           (always)
├── RECORD.md            (always -- tracks what the work has established)
├── STATE.md             (always -- tracks workflow position)
├── STYLE-GUIDE.md       (always)
├── WRITING-RULES.md     (always; copy verbatim from templates/WRITING-RULES.md; universal AI-tell rules loaded by drafter, voice-checker, originality-check)
├── CHARACTERS.md        (-> CONCEPTS.md for academic, -> AUDIENCE.md for technical, -> FIGURES.md for sacred; skipped for poetry/speech)
├── RELATIONSHIPS.md     (-> DEPENDENCIES.md for technical, -> LINEAGES.md for sacred; skipped for academic/poetry/speech)
├── WORLD.md             (-> CONTEXT.md for academic, -> SYSTEM.md for technical, -> COSMOLOGY.md for sacred; skipped for poetry/speech)
├── PLOT-GRAPH.md        (-> ARGUMENT-MAP.md for academic, -> PROCEDURES.md for technical, -> THEOLOGICAL-ARC.md for sacred; skipped for poetry/speech)
├── THEMES.md            (-> QUESTIONS.md for academic, -> REFERENCES.md for technical, -> DOCTRINES.md for sacred)
├── config.json
├── drafts/
│   └── body/
├── plans/
├── reviews/
├── editor-notes/
└── archive/
```

For sacred work types, also create: `CONCORDANCE.md`, `CHRONOLOGY.md`, `SOURCES.md`, `annotations/`.
For academic work types, load the matching files from `templates/academic/` and treat them as the first-pass argument contract for concepts, research questions, academic context, proposal framing, and argument movement.
For technical work types, load the matching files from `templates/technical/` and treat them as the first-pass document contract for audience, environment, procedures, and references.
Always create `RECORD.md` from `templates/RECORD.md` without renaming it. It is deliberately neutral across prose, sacred, academic, technical, poetry, script, and visual work. It records what the work has established, while `STATE.md` records workflow position and `OUTLINE.md` records structure.

## Config file

Write `.manuscript/config.json` by starting from `templates/config.json` and filling the project-specific values. The generated config must include the shared settings blocks that later commands read:
```json
{
  "scriveno_version": "2.0.12",
  "work_type": "<chosen>",
  "group": "<group>",
  "command_unit": "<unit>",
  "developer_mode": false,
  "created_at": "<ISO timestamp>",
  "updated_at": "<ISO timestamp>",
  "autopilot": {
    "enabled": false,
    "profile": "guided",
    "custom_checkpoints": []
  },
  "voice": {
    "calibrated": false,
    "last_calibration": null,
    "drift_threshold": 0.3
  },
  "draft": {
    "rigor": "standard",
    "context_profile": "standard",
    "pitfalls_enabled": true
  },
  "export": {
    "default_format": "docx_manuscript",
    "include_front_matter": true,
    "include_back_matter": true
  },
  "translation": {
    "source_language": "en",
    "target_languages": []
  },
  "collaboration": {
    "tracks_enabled": false,
    "default_track": "canon"
  }
}
```

For sacred work types, also add top-level sacred profile keys: `tradition`, `verse_numbering_system`, `calendar_system`, `translation_philosophy`, `canonical_alignment`, `annotation_traditions`, `doctrinal_framework`, `preserve_source_terms`, and `transliteration_style`. Use the work type's `config_defaults` and `architectural_profiles.defaults_by_work_type.tradition` as starting values. Do not nest these under a `sacred` object in new projects.
For work types with an inferred publishing platform in `architectural_profiles.defaults_by_work_type.platform`, add top-level `platform` (usually `kdp`) so build commands can default to the intended target.
For technical work types, also keep the `technical` block and fill it with audience level, prerequisite knowledge, supported environment, supported versions, source-of-truth references, and review mode. Use the work type's `config_defaults` as the starting point.

## Voice DNA calibration

After files are generated, tell the writer: "I've set up your project. Now let me calibrate your voice -- this makes every drafted scene sound like *you*, not generic AI prose." Then offer to run `/scr:voice-test`. Don't force it -- let them skip if they want.

## End state

Tell the writer:
1. What was created (file count, directory path)
2. What's next -- usually `/scr:voice-test` or `/scr:discuss 1`, framed with the project's unit terminology
3. That they can always run `/scr:next` if unsure

Keep it warm. This is the moment they decide whether to commit to the project. Make them feel like they've started something real.

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
