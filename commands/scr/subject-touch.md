---
description: Update an evolving subject, idea, claim, procedure, doctrine, object, image pattern, or reader-state thread after a unit lands.
argument-hint: "<subject> [--from <unit>]"
---

# /scr:subject-touch -- Update Subject Movement

Subject files are living documents. THEMES.md, QUESTIONS.md, REFERENCES.md, DOCTRINES.md, PROCEDURES.md, and related adapted files record what the work is making the reader understand, feel, notice, believe, test, or do. Without periodic touch-ups, a theme, claim, object, procedure, doctrine, or reader promise can freeze in its early form while the manuscript has already changed its meaning.

This command is the touch-up surface for non-character movement. Use it after `/scr:draft` or `/scr:editor-review`, especially when a unit changes the meaning of an object, develops an argument, resolves a misconception, alters the reader's ability, changes a doctrine's practical emphasis, or makes a procedure safer or clearer.

## Usage

```
/scr:subject-touch <subject>                  # interactive update
/scr:subject-touch <subject> --from <unit>    # base the update on a specific unit's drafted prose
```

If `<subject>` is omitted, list tracked subjects from the adapted subject files and ask which to update.

## Instruction

### STEP 0: BOOTSTRAP

Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it for orientation (project title, work type, current unit, recent activity). Step 1 still needs the full subject files because you may edit one. See `docs/context-protocol.md`.

### STEP 1: LOAD CONTEXT

Load these project files:

- `.manuscript/config.json` -- to determine work type and file adaptations
- Scriven's installed/shared `CONSTRAINTS.json` -- to map adapted subject files
- `.manuscript/WORK.md` and `.manuscript/BRIEF.md` or adapted equivalent -- reader promise and reader journey
- The adapted subject files that exist:
  - `.manuscript/THEMES.md` or `.manuscript/QUESTIONS.md`, `.manuscript/REFERENCES.md`, or `.manuscript/DOCTRINES.md`
  - `.manuscript/PLOT-GRAPH.md`, `.manuscript/ARGUMENT-MAP.md`, `.manuscript/PROCEDURES.md`, or `.manuscript/THEOLOGICAL-ARC.md`
  - `.manuscript/WORLD.md`, `.manuscript/CONTEXT.md`, `.manuscript/SYSTEM.md`, or `.manuscript/COSMOLOGY.md` when the subject is a place, system, setting pressure, or operating context
- `.manuscript/STATE.md` -- to know which units have been drafted
- The drafted unit file for the touch-up basis: `.manuscript/drafts/body/{N}-*-DRAFT.md` either for the unit named in `--from` or, if `--from` is omitted, the most recently modified draft file

### STEP 2: RESOLVE THE SUBJECT

If the writer named a subject, find the closest matching heading or table row across the adapted subject files. Search case-insensitively across headings, theme names, research questions, doctrine names, procedure names, reference topics, object names, place names, and image patterns.

If no match is found, suggest the closest subjects and ask whether to create a new entry. Do not create a new subject without writer approval.

If the writer did not name a subject, list tracked subjects grouped by source file and ask which one to update.

### STEP 3: PROPOSE A DELTA

Read the basis draft file from STEP 1. Identify how the subject changed in this unit. Cover these dimensions; skip any that did not change:

1. **Reader state** -- what the reader understands, feels, notices, can do, or can verify now
2. **Pressure or friction** -- misconception, counterclaim, risk, ambiguity, failure mode, constraint, grief, uncertainty, or practical obstacle
3. **Interaction pattern** -- claim vs. counterclaim, rule vs. exception, step vs. failure mode, doctrine vs. practice, evidence vs. objection, object vs. meaning, place vs. memory, image vs. theme
4. **Evidence or example** -- new proof, reference, scene evidence, procedure evidence, or concrete example now available
5. **Watchpoint** -- what the next plan, draft, or review should preserve or test

Present the proposed delta to the writer in this exact format:

```
Subject: <subject>
Basis: <unit name from draft filename>
Source file: <file to update>

Proposed updates:

  Reader state
    was: <current text or inferred prior state>
    now: <proposed new text>

  Pressure or friction
    + <new or sharpened pressure>

  Interaction pattern
    <pattern>: <new state>

  Evidence or example
    + <new evidence, example, citation, procedure checkpoint, image, or scene evidence>

  Watchpoint
    + <thing to preserve or test later>

Apply these updates? (yes / no / edit)
```

If the writer accepts (`yes`), proceed to STEP 4. If `edit`, ask which dimension to revise and re-prompt. If `no`, exit with no changes and no log entry.

### STEP 4: APPLY THE DELTA

Update the relevant adapted subject file while preserving formatting:

- For `THEMES.md`, update the matching theme or subject-dynamics entry.
- For `QUESTIONS.md`, update the matching research question, claim, evidence gap, or reader-state note.
- For `REFERENCES.md`, update source-of-truth, evidence, version, failure-mode, or verification notes.
- For `DOCTRINES.md`, update practical emphasis, doctrinal pressure, interpretive watchpoints, or source evidence.
- For `PROCEDURES.md`, update validation, rollback, failure mode, prerequisite, or subject dynamics notes.
- For `ARGUMENT-MAP.md`, update claim, counterclaim, evidence, transition, or unresolved question notes.
- For setting, system, object, or place subjects, update the adapted context file that already owns the subject.

Create a `### Subject dynamics` subsection under the matching entry if the file has no obvious place for reader state, pressure, interaction pattern, evidence, or watchpoints.

**Do not touch:**

- STYLE-GUIDE.md or voice rules
- Draft prose
- Character voice anchors or character state, unless the writer explicitly asked for `/scr:character-touch`
- Source citations in a way that invents support not present in the draft or source files
- Technical safety instructions without preserving validation and rollback context

### STEP 5: STAMP THE UPDATE

Add or replace a one-line marker under the updated subject entry:

```
_Last touched: {ISO timestamp} -- after drafting <unit name>_
```

### STEP 6: HISTORY LOG

Append one line to `.manuscript/HISTORY.log` per `docs/history-protocol.md`:

```
{ISO timestamp} | scr:subject-touch | subject=<subject> | basis=<unit name> | file=<updated file> | dimensions=<comma-separated list of changed dimensions> | outcome=ok
```

If the writer chose `no` and exited with no changes, do not append a line.

### STEP 7: SUGGEST NEXT

End with a one-line suggestion:

> Updated <subject>. Future plans and drafts will read the revised subject movement. Consider `/scr:editor-review <unit>` if the change came from a fresh draft.

## Edge Cases

- **Character and subject both shifted:** Suggest `/scr:character-touch <name>` after this command if the character state also changed.
- **Subject is a person:** If the requested subject is clearly a character or figure, route to `/scr:character-touch` instead.
- **Academic evidence changed:** Do not strengthen a claim beyond its cited support. Mark unsupported movement as a watchpoint or question.
- **Technical procedure changed:** Preserve safety, validation, and rollback. If the draft implies unsafe guidance, mark a blocking question instead of updating the procedure as if it were approved.
- **Sacred doctrine changed:** Preserve the project's framework and source-tracking rules. If the draft creates a doctrinal tension, record it as a watchpoint or blocking question rather than smoothing it away.

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

## Tone

Brisk and editorial. Surface the proposed delta, get a yes / no / edit answer, apply, get out. The writer remains the authority on what the work means.
