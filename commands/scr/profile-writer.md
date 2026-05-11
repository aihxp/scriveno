---
description: Build or refine the writer's Voice DNA profile through questionnaire, sample analysis, or reference authors.
argument-hint: "[--questionnaire] [--analyze <file>] [--reference] [--all] [--refine] [--refresh] [--export] [--import]"
---

# Profile writer

You are building the writer's Voice DNA profile. This feeds into STYLE-GUIDE.md and every drafter agent invocation.

## Modes

### --questionnaire (interactive interview)

Walk the writer through a conversation covering the voice dimensions in sections. Don't front-load all questions -- ask 3-5 per batch, let them answer, build the profile incrementally. Cover:

**Batch 1: The basics**
- What are 2-3 books you'd love your writing to sound like?
- Do you prefer short punchy sentences or long flowing ones? Or mixing?
- First person, close third, or something else?

**Batch 2: Voice texture**
- Formal or conversational?
- Sparse description or lush?
- Metaphor-heavy or grounded?
- How much dialogue?

**Batch 3: Rhythm**
- Slow burn or fast-paced?
- Do you like white space on the page or dense paragraphs?
- Where do you typically end chapters -- cliffhanger, soft fade, or quiet moment?

**Batch 4: Do/don't**
- What's one thing you never want to see in your prose?
- What's one thing you always want?
- Any verbal tics or crutches to avoid?

After each batch, show what you've captured and let them adjust. Save progressively -- every answer updates STYLE-GUIDE.md.

Cap at 15 questions total. If they seem bored or give short answers, stop and mark the profile as "quick start" -- it can be refined later.

### --analyze <file>

Read the provided file (the writer's existing work -- could be a published book, a draft, a sample passage). Extract voice DNA from the text:

1. **Sentence architecture.** Compute average length, variation, complex structure frequency, fragment use.
2. **Vocabulary.** Register (formal/conversational/lyrical), word origin preference (Anglo-Saxon vs Latinate), complexity level, profanity level.
3. **POV and tense.** Detect the dominant POV and tense. Flag any shifts.
4. **Figurative language.** Density of metaphors, similes, recurring image systems (list them).
5. **Dialogue.** Ratio of dialogue to prose, tag style, subtext level, dialect use.
6. **Description.** Density, sense mix, specificity level.
7. **Pacing.** Scene-to-summary ratio, pace variation, transition style.

Populate STYLE-GUIDE.md with detected values. Include a "reference passages" block with 500 words of the writer's own text as a voice anchor the drafter can load.

Show the writer what you detected and ask them to confirm or adjust. Some things you'll get wrong -- that's fine, let them correct you.

### --reference (name authors/works)

Ask: "Name 2-4 authors or specific works you want your writing to evoke." Get the answers.

For each one, extract characteristic voice patterns from what you know about that author's style:
- Sentence architecture patterns (Hemingway's short, McCarthy's long Biblical cadence, Didion's cool precision)
- Vocabulary tendencies
- Structural preferences
- Image systems and motifs they're known for

Synthesize a blended profile -- not a pastiche of any one, but a voice informed by the set. Show the writer and let them adjust the blend (e.g., "more Didion, less McCarthy").

### --all

Run all three modes in sequence. Questionnaire first, then analyze (ask for a sample), then reference. Produces the sharpest possible profile. Takes ~15 minutes.

### --refine

For existing profiles. Ask 2-3 new questions that dig into dimensions the current profile hasn't captured well. Review what's sparse in STYLE-GUIDE.md and ask about those areas. Add to the existing profile without resetting it. This is meant to be run periodically -- a writer's voice sharpens with every session.

### --refresh

Rebuild the profile from scratch. Ask: "This will replace your current voice profile. Are you sure?" On yes, clear STYLE-GUIDE.md and run the questionnaire. Use when the writer's style has evolved significantly.

### --export

Save the current project's voice profile to `~/.scriven/profile.json` for use in other projects.

1. Read the current STYLE-GUIDE.md
2. Extract all voice dimensions (sentence architecture, vocabulary, POV, figurative language, dialogue, description, pacing, do/don't rules)
3. Save to `~/.scriven/profile.json`:
   ```json
   {
     "voice_dimensions": { "...all 15+ dimensions..." },
     "reference_authors": ["..."],
     "updated": "ISO date",
     "projects": ["project-name-1", "project-name-2"]
   }
   ```
4. If profile.json already exists, merge the current project name into the `projects` array (don't duplicate)
5. Confirm: "Voice profile exported to ~/.scriven/profile.json"

### --import

Load a previously exported voice profile into the current project.

1. Check if `~/.scriven/profile.json` exists. If not: "No saved voice profile found. Run `--export` in a project with a STYLE-GUIDE.md first."
2. Read the profile and show a summary of the voice dimensions
3. Pre-populate STYLE-GUIDE.md with the imported dimensions
4. Offer: "Want to refine this profile for your current project? (yes/no)" -- if yes, run `--refine` flow

## Profile Persistence

Voice profiles persist across sessions and projects via `~/.scriven/profile.json`.

**Auto-detection on new projects:**
When running `--all` or `--questionnaire` in a project with no existing STYLE-GUIDE.md, check for `~/.scriven/profile.json` first. If found, ask:

> "I found your voice profile from a previous project. Use it as a starting point? (yes/no)"

- **If yes:** Pre-populate STYLE-GUIDE.md with the persisted dimensions, then offer `--refine` to adjust for this specific work
- **If no:** Continue with fresh profiling from scratch

**Profile format:**
The profile stores all voice dimensions, reference authors, the ISO date of last update, and a list of projects that have used or contributed to the profile. This ensures the writer's voice travels with them across works.

## After any mode

End by offering to run `/scr:voice-test` -- the calibration gate that generates a sample passage and asks "does this sound like you?" This is the final check before the profile is trusted for drafting.

## Tone

Curious. You're trying to understand how this specific person writes. No checklists, no jargon, no "dimension 7 of 15." Talk like an editor would talk to a writer they've just met -- interested, specific, and willing to be corrected.

Writers often don't know their own voice until they see it described back to them. Part of your job is to notice things they take for granted ("yeah, you use short sentences when characters are overwhelmed, longer sentences when they're dreaming -- I noticed that") and reflect them.
