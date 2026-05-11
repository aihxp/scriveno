---
description: Import an existing manuscript (docx, markdown, txt, or directory) and structure it into a Scriven .manuscript/ directory.
argument-hint: "<file_or_directory_path> [--type <work_type>]"
---

# Import

You are importing an existing manuscript into Scriven. The writer has content -- in a Google Doc, a Scrivener project, a folder of markdown files, a Word document, or similar -- and wants Scriven's tooling without starting from scratch.

## What to do

1. **Locate the file or directory.** Accept: .docx, .md, .txt, .rtf, a directory of any of these.

2. **Read the content.** For docx, use pandoc or similar to extract text. For markdown, read directly. For a directory, concatenate files in order.

3. **Detect the work type.** If `--type` was passed, use it. Otherwise analyze the content and make a best guess:
   - Scene headers (`INT./EXT.`) -> screenplay
   - Chapter markers with prose -> novel or memoir
   - Section headers with citations -> academic paper
   - Verse and chapter numbers -> scripture
   - Panel descriptions -> comic
   - Poem titles separated by breaks -> poetry collection
   - Ask the writer to confirm.

4. **Parse structure.** Identify the unit boundaries based on the work type's `command_unit` from CONSTRAINTS.json. For a novel, find chapter breaks. For a screenplay, find act breaks or scene headers. For a research paper, find section headers.

5. **Run voice analysis.** Take a 2000-word sample from the imported text and extract the writer's voice DNA: sentence architecture, vocabulary register, figurative density, POV, tense, dialogue style. Populate STYLE-GUIDE.md with the detected values. Flag anything uncertain for the writer to confirm.

6. **Detect characters.** Scan for proper nouns that appear as speakers in dialogue or as recurring agents in narration. Build a draft CHARACTERS.md with name, estimated role (protagonist, antagonist, supporting), and detected voice patterns. Flag for writer review.

7. **Generate the .manuscript/ directory.** Create all context files (WORK.md, BRIEF.md, OUTLINE.md, STYLE-GUIDE.md, CHARACTERS.md, etc.) populated from the import. Also copy `WRITING-RULES.md` verbatim from the installed Scriven templates (`templates/WRITING-RULES.md`) into `.manuscript/` so the drafter, voice-checker, and originality-check have the canonical universal rules available. Save the actual drafted text as `.manuscript/drafts/body/{N}-{A}-DRAFT.md` files, one per atomic unit.

8. **Set STATE.md** to reflect that all imported units are drafted but not yet reviewed. This lets the writer pick up with `/scr:editor-review` or `/scr:next`.

9. **Generate a report.** Tell the writer:
   ```
   Imported [filename] as a [work_type].

   Structure detected: X chapters, Y scenes total
   Word count: 65,432
   Voice profile: extracted from 2000-word sample (review in STYLE-GUIDE.md)
   Characters detected: 7 (review in CHARACTERS.md)

   Some things I wasn't sure about:
   - [specific flags: uncertain chapter breaks, possible POV shifts, etc.]

   Next steps:
   - Review STYLE-GUIDE.md and CHARACTERS.md -- confirm or adjust
   - Run /scr:next to start working on the imported manuscript
   ```

## Edge cases

- **Messy source.** If the import has weird formatting, OCR errors, or inconsistent structure, do your best and flag the issues. Don't refuse the import.
- **Huge manuscript.** For texts over 200k words, warn about import time but proceed. Split voice analysis across multiple samples.
- **Mixed work types.** A Google Doc with both prose and outline notes -- import as primary work type, save notes to `.manuscript/notes/`.
- **Source in a different language.** Detect it. Ask if the writer wants to work in the source language or translate first.
- **No clear structure.** If you can't find chapter or scene breaks, ask the writer how they want the text divided before creating draft files.

## What NOT to do

- Don't "improve" the writer's text during import. Preserve it exactly. They'll revise via normal commands.
- Don't rename files without asking.
- Don't skip voice analysis -- it's the highest-value part of import.
- Don't assume character roles without evidence. Mark uncertain roles as such.

## Tone

Respectful. The writer has worked on this text. You're bringing it into a new system, not judging it. Report what you found clearly, flag your uncertainties honestly, and make clear the writer is in charge of confirming.
