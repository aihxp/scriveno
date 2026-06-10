---
description: Voice calibration gate. Generates a work-type-aware sample in the writer's proposed voice and asks "does this sound like you?" before any real drafting begins.
---

# Voice test

You are running the voice calibration gate. This is one of the most important moments in Scriveno -- if the writer doesn't feel their voice is captured, no amount of tooling saves the project.

## What to do

1. **Load context.** Read `.manuscript/STYLE-GUIDE.md`, `.manuscript/WORK.md`, `.manuscript/config.json`, and the first unit's plan if it exists.

2. **Gate on real voice data before sampling.** `voice-test` is a calibration gate, not the profile builder. Before generating any prose, inspect STYLE-GUIDE.md. If it is missing, mostly template text, or still contains placeholders such as `{{...}}`, `[Fill in...]`, `TODO`, `TBD`, or generic prompt copy, stop and route the writer to `/scr:profile-writer`.

   Use this blocked response:

   ```markdown
   I need a real voice profile before I can test it. STYLE-GUIDE.md still looks like a template, so a sample now would invent your voice instead of checking it.

   Next commands:
   - `/scr:profile-writer`: Build your Voice DNA from a short interview, reference works, or a writing sample.
   - `/scr:profile-writer --analyze <file>`: Extract voice from existing writing if you have a sample ready.
   ```

3. **Choose the sample shape from the work type.** Use `.manuscript/config.json` to read `work_type`, `command_unit`, and any audience or tradition fields. Do not default to fiction language unless the work is fiction.

   Use this mapping unless the project says otherwise:

   | Work family | Calibration sample |
   |-------------|--------------------|
   | Prose fiction or memoir | A compact scene or reflective passage |
   | Screenplay, stage play, or comic | A short script excerpt with action and dialogue or panel text |
   | Poetry or song | A poem, stanza sequence, or lyric excerpt plus a short prose note if needed |
   | Academic writing | An argument paragraph with evidence, qualification, and transition |
   | Technical writing | A procedure, explanation, warning, or troubleshooting excerpt |
   | Sacred or commentary | A commentary, translation note, doctrinal explanation, or devotional passage matching the tradition |
   | Speech or essay | A spoken paragraph or essay section aimed at the declared audience |
   | Visual work | Page, caption, panel, or art-direction copy in the project's register |

4. **Generate the calibration sample.** Aim for about 300 words for prose-like forms, or the natural equivalent for poetry, scripts, procedures, and visual copy. Exercise the writer's key dimensions: sentence architecture, vocabulary, evidence or image system, emotional or intellectual register, dialogue only when relevant, and unit rhythm. Make it something this writer would plausibly produce for this project.

5. **Show the sample to the writer** and ask one question: "Does this sound like you?"

6. **Handle the response:**
   - **Yes** -> Mark voice as calibrated in config.json (`voice.calibrated: true`, `voice.last_calibration: now`). Tell the writer "Great. From now on, every drafted unit will match this voice. Run `/scr:next` to start your first real unit."
   - **Close but not quite** -> Ask what's off with 3 targeted options chosen for the work type. Use options such as too formal/informal, too descriptive/sparse, evidence stance wrong, instruction tone wrong, dialogue wrong, line rhythm wrong, tradition register wrong, pacing wrong, images wrong, or something else (free text). Update STYLE-GUIDE.md accordingly and regenerate.
   - **No, not at all** -> Ask: "Tell me one thing that's most off, in your own words." Update STYLE-GUIDE.md based on their answer. Regenerate.
   - **I don't know** -> Offer to pull a passage from their existing work as a reference via `/scr:profile-writer --reference`, or run `/scr:profile-writer --questionnaire` to gather more voice signal.

7. **Maximum 3 calibration rounds** per session. If after 3 rounds the writer still isn't satisfied, tell them: "Let's build more context first. Can you share a sample of your existing writing? I'll analyze it and come back with a sharper profile." Offer `/scr:profile-writer --analyze`.

## What makes this passage good

- It sounds like the specific writer, not generic AI prose or generic genre paste
- It captures the sentence architecture from STYLE-GUIDE.md (if they prefer short sentences, it has short sentences)
- Vocabulary matches the register (formal, conversational, lyrical, etc.)
- If the guide specifies recurring image systems, at least one appears
- If the guide has "always/never/consider" rules, the passage honors them
- It is a real project-shaped excerpt, not an abstract mood sample. Show the work doing what the work is supposed to do.

## What to avoid

- **Generic AI voice.** Hedging words, balanced sentences, over-explaining emotions, adverb clusters.
- **Trying too hard.** If the writer said "sparse and grounded," don't suddenly get poetic.
- **Showing off.** The passage isn't a demo of AI capability -- it's a test of whether we've captured their voice.
- **Overlong setup.** Get to the unit's real work quickly.

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

This is a collaborative calibration moment, not a performance. Don't preface the passage with explanations or hedges. Show the passage, ask the question. If adjustment is needed, be quick and specific about what you'll change.

The writer is evaluating whether to trust you with their voice. Earn it in this one passage.
