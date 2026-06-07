---
description: Walk the writer through editorial review, manage editor-writer collaboration workflow with proposal reviews, notes, and decision tracking.
argument-hint: "[N] [--proposal <name> | --notes | --respond <name>]"
---

# /scr:editor-review -- Manual Read-Through, Quality Review & Editor-Writer Collaboration

Walk the writer through their drafted act for acceptance testing. With collaboration flags, manage the full editor-writer workflow: reviewing revision proposals, adding editor notes to specific passages, and responding to editor decisions with full accountability tracking.

## Usage
```
/scr:editor-review [N]
/scr:editor-review --proposal <name>
/scr:editor-review --notes [unit]
/scr:editor-review --respond <name>
```

## Instruction

You are conducting an editorial review. Load `.manuscript/config.json` for `work_type` and `developer_mode`. Load Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) to check command adaptations. For sacred work types, this command is called 'scholarly-review'. For academic work types, this command is called 'peer-review'. For technical work types, this command is called 'technical-review' and should prioritize factual accuracy, task clarity, audience fit, and unsafe or ambiguous instructions. Use adapted terminology throughout all output.

**Mode detection:** If `--proposal`, `--notes`, or `--respond` flags are present, use the corresponding collaboration workflow below. Otherwise, use the standard read-through review (Steps 1-5).

---

## Standard Review Mode (no collaboration flags)

### STEP 1: EXTRACT REVIEWABLE BEATS

Load the act's scene plans, drafts, and RECORD.md when present. Also extract each plan's `## Craft Notes`, `## Record Notes`, `## Character Persona Notes`, and `## Subject Dynamics Notes` sections, if present. For each scene, extract the key experiential beats the writer should evaluate:

<beat_extraction>
  For each scene, identify 2-4 things the writer should notice when reading:
  - Does the opening hook grab?
  - Does the dialogue feel natural for this character?
  - Does the emotional climax land?
  - Does the pacing feel right?
  - Is the setting vivid enough?
  - Does the ending make you want to keep reading?
  - Does this character's voice sound distinct from others?
  - Is the subtext clear enough without being on-the-nose?
</beat_extraction>

<craft_note_followup>
  For each `CHOICE`, check whether the draft honored the confirmed decision.
  For each `HUNCH`, check whether the creative bet worked on the page.
  For each `QUESTION`, record whether the draft resolved it, kept it productively open, or exposed a blocker.
  For each `WATCHPOINT`, check whether the draft preserved the intended continuity, voice, image, or craft concern.
</craft_note_followup>

<record_followup>
  Check whether the draft honored the relevant established facts, open threads, promises, payoffs, continuity facts, and next-unit obligations from RECORD.md and the plan's Record Notes.
  Record any new reader-visible facts, claims, events, procedures, objects, relationship states, subject movement, or payoffs that should be added to RECORD.md.
  If the draft contradicts RECORD.md, flag the contradiction before marking the unit reviewed.
</record_followup>

<character_persona_followup>
  For each major character in the unit, check whether their persona under pressure held on the page.
  For each important pairing, check whether the relationship-specific interaction stayed true: trust posture, conflict pattern, speech shift, and hidden agenda or fear.
  If the draft changes a character's current state or relationship stance, recommend `/scr:character-touch <name>`.
</character_persona_followup>

<subject_dynamics_followup>
  When Subject Dynamics Notes are present, check whether the active subject moved as planned, even in character-based scenes.
  Confirm that the reader state changed from the planned starting point toward the planned end state.
  Check whether the pressure or friction stayed visible without becoming lecture, filler, or hidden scaffolding.
  For important interactions, check whether the relationship between ideas, evidence, steps, exceptions, images, doctrines, practices, or failure modes stayed true on the page.
  If Character Persona Notes are also present, check whether character behavior and subject movement reinforced each other or fought for focus.
  If Subject Dynamics Notes are absent, still scan for an obvious missing layer: a draft with character motion but no change in meaning, or a subject-driven unit with information but no reader movement. Recommend adding Subject Dynamics Notes in the next plan or running `/scr:subject-touch <subject>` when the draft changed the subject's state.
</subject_dynamics_followup>

<plot_device_followup>
  Check the plot logic and any planted devices tracked in RECORD.md "Promises and payoffs".
  For each device with `Status: planted` whose payoff window has arrived, check whether it paid off, was deliberately subverted, or was silently dropped. A planted gun that never fires is a flaw: flag it and recommend resolving or removing the setup.
  Flag **deus ex machina**: a resolution that arrives from outside the established story logic and rescues the protagonist without their agency or any prior setup. Name the unearned save and suggest grounding it in something planted earlier.
  Flag **plot armor**: a character surviving or succeeding only because the plot needs them to, with no plausible in-world reason. Name the consequence the scene avoided and ask whether the stakes are real.
</plot_device_followup>

---

### STEP 2: GUIDED WALKTHROUGH

Present each scene's reviewable beats ONE AT A TIME. For each:

1. Show the scene title and a brief reminder of what it covers
2. Direct the writer to read the scene. Only reference the underlying file path when `developer_mode` is `true`; otherwise use unit and scene labels only.
3. Ask about each beat:
   - "Works as intended"
   - "Close but needs adjustment" (ask for details)
   - "Not working" (ask what's wrong)

Record responses for each beat.

---

### STEP 3: DIAGNOSE ISSUES

For any issues flagged, spawn a diagnostic agent:

<diagnostic_agent>
  <role>Revision Analyst</role>
  <task>
    Given the writer's feedback on what's not working:
    1. Identify the root cause (voice issue? pacing? character motivation? structure?)
    2. Propose 2-3 specific revision approaches
    3. Estimate scope of revision (line edit vs. scene rewrite vs. structural change)
    4. Flag any downstream effects (changes that would ripple to other scenes)
  </task>
</diagnostic_agent>

If the host runtime cannot spawn a dedicated diagnostic worker, run the revision diagnosis in an isolated fresh context for each flagged issue group. Report that fallback in the status block.

---

### STEP 4: GENERATE EDITOR NOTES

Write the standard review report to `.manuscript/reviews/{N}-REVIEW.md`. If an older project already has root-level `{N}-EDITOR-NOTES.md`, read it as legacy review context, but write the new canonical report under `.manuscript/reviews/`:

<editor_notes>
  <section name="overall_assessment">
    How the act reads as a whole. What's working, what's not.
  </section>
  <section name="scene_by_scene">
    For each scene:
    - Beats that passed
    - Issues flagged with diagnosis
    - Proposed revisions
  </section>
  <section name="revision_plans">
    If issues were found, generate targeted revision plans in the same
    format as SCENE-PLAN.md, but scoped to specific fixes.
    These can be re-executed with /scr:draft.
  </section>
  <section name="global_notes">
    Any patterns across scenes (recurring issues, consistent strengths).
    Craft observations the writer should consider for future acts.
  </section>
  <section name="craft_notes_follow_up">
    For each CHOICE, HUNCH, QUESTION, and WATCHPOINT from the plan files,
    record whether it held, worked, resolved, stayed open, or needs revision.
    Keep labels in the review report only. Do not add labels to manuscript prose.
  </section>
  <section name="record_follow_up">
    Record whether this unit honored established facts, handled open threads,
    paid off or deepened promises, and created any new RECORD.md entries.
    If the draft changed the work's established state, list the exact compact
    updates that should be applied to RECORD.md.
  </section>
  <section name="character_persona_follow_up">
    For each relevant character, record whether persona under pressure held,
    whether any persona drift appeared, and whether current state should be
    updated with `/scr:character-touch`.
  </section>
  <section name="relationship_interaction_follow_up">
    For each important pairing, record whether the trust posture, conflict
    pattern, speech shift, and hidden agenda or fear stayed true on the page.
  </section>
  <section name="subject_dynamics_follow_up">
    When Subject Dynamics Notes are present, record whether the reader moved
    as intended, whether the main pressure stayed visible, and whether the key
    interaction between ideas, evidence, steps, exceptions, images, doctrines,
    practices, or failure modes held on the page. If Character Persona Notes
    also appear, record whether the human behavior and subject movement
    reinforced each other or fought for focus.
    If Subject Dynamics Notes are absent but the unit clearly needed them,
    record the missing layer and recommend adding it before the next draft or
    running `/scr:subject-touch <subject>` if the draft already changed a
    tracked subject.
  </section>
</editor_notes>

---

### STEP 5: NEXT STEPS

If all beats passed:
- Mark act as "reviewed" in STATE.md
- Refresh `.manuscript/PROGRESS.md` so the ledger reflects the new review status, per `docs/progress-protocol.md`
- Apply confirmed compact updates to RECORD.md when the review established or corrected the work's durable content state
- Suggest moving to `/scr:submit N` or `/scr:discuss {N+1}`. If the emotional climax did not land, suggest `/scr:climax` to rework the climax beat; if a theme moved on the page, suggest `/scr:theme-tracker`

If revision plans were created:
- Present the revision scope to the writer
- Explain that running `/scr:draft N` will use the revision plans
- Ask if they want to revise now or move on and come back later

---

## Collaboration Mode: --proposal (Editor Reviews a Revision Proposal)

**Purpose:** Editor reviews a revision proposal created by `track propose`, making accept/reject/modify/note decisions on each changed passage. This is the editor side of the editor-writer collaboration workflow.

### Prerequisites

1. Derive a safe slug from the provided proposal name before touching the filesystem:
   - lowercase the name
   - replace any run of non-alphanumeric characters with `-`
   - trim leading and trailing `-`
   - if the result is empty, stop and ask for a clearer proposal name
2. Check that `.manuscript/proposals/{slug}-proposal.md` exists. If not: "No proposal found for '[name]'. Create one with `/scr:track propose <name>`."
3. Read the proposal file to get the list of changed passages.

### Workflow

1. **Display the proposal summary.** Show the number of passages changed, added, and removed. Show the track name and author.

2. **Walk through each changed passage.** For each passage in the proposal's Detailed Changes section, present the before/after content and ask the editor for a decision:

   - **Accept** -- Mark this change as approved. No modification needed.
   - **Reject** -- Mark this change as rejected. Ask the editor for a reason.
   - **Modify** -- Accept the change but with the editor's modification. Ask the editor to provide their revised version of the passage.
   - **Note** -- Add a comment on this passage without accepting or rejecting. Ask the editor for their note text.

3. **Store all decisions** in `.manuscript/proposals/{slug}-decisions.json`:

   ```json
   {
     "proposal": "slug",
     "reviewer": "editor",
     "date": "ISO 8601 timestamp",
     "decisions": [
       {
         "passage": "path/to/file:line_or_unit",
         "action": "accept",
         "reason": null,
         "modification": null
       },
       {
         "passage": "path/to/file:line_or_unit",
         "action": "reject",
         "reason": "This changes the character's motivation in a way that contradicts chapter 2",
         "modification": null
       },
       {
         "passage": "path/to/file:line_or_unit",
         "action": "modify",
         "reason": "Good direction but the phrasing needs work",
         "modification": "The revised passage text with editor's changes"
       },
       {
         "passage": "path/to/file:line_or_unit",
         "action": "note",
         "reason": "Consider strengthening the imagery here -- the original has more sensory detail",
         "modification": null
       }
     ],
     "summary": {
       "accepted": 0,
       "rejected": 0,
       "modified": 0,
       "noted": 0
     }
   }
   ```

4. **Generate summary.** After all passages are reviewed:
   ```
   Review complete: X accepted, Y rejected, Z modified, W notes added.

   The writer can review your decisions with `/scr:editor-review --respond <name>`.
   ```

5. **Save the decisions file.** Keep all proposal artifacts inside `.manuscript/proposals/` using the sanitized slug only. If `developer_mode` is `true` and the writer explicitly asks for git bookkeeping, mention that they can commit the saved proposal artifacts separately. In writer mode, do not surface git commands.

### Accountability

- Every decision is timestamped and attributed to the reviewer
- The full proposal text is preserved alongside decisions
- Rejected changes remain in the track for reference -- nothing is lost
- The decisions.json file creates a permanent record of editorial judgment

---

## Collaboration Mode: --notes (Add Editor Notes to Passages)

**Purpose:** Editor adds inline notes to specific passages in the current track or canon manuscript. Notes are comments that do not modify the manuscript text -- they are advisory.

### Workflow

1. **Determine scope.** If a unit number is provided (`--notes 3`), focus on that unit. Otherwise, let the editor browse and select passages across the manuscript.

2. **For each note the editor wants to add:**
   - Ask the editor to identify the passage (by unit number and approximate location or by quoting a few words from the passage).
   - Ask the editor for their note text.
   - Store the note.

3. **Store notes** in `.manuscript/editor-notes/{unit}-notes.md`. Create the `editor-notes/` directory if it does not exist.

   Note format:
   ```markdown
   # Editor Notes: [Unit Title]

   ## Note 1
   **Passage:** [quoted text or location reference]
   **Date:** [ISO 8601 timestamp]
   [EDITOR NOTE @ passage]: The pacing here feels rushed. Consider expanding the moment
   where the character realizes the truth -- let the reader sit with it.

   ## Note 2
   **Passage:** [quoted text or location reference]
   **Date:** [ISO 8601 timestamp]
   [EDITOR NOTE @ passage]: Beautiful imagery. This is the voice at its strongest.

   ---
   _Notes added by editor. These do not change the manuscript text._
   _Writer can review notes by opening this file or running `/scr:editor-review --notes [unit]` to see them inline._
   ```

4. **Confirm** after each note is added. When the editor is finished:
   ```
   Added N editor notes to [unit/manuscript].

   Notes are saved in .manuscript/editor-notes/ and visible to the writer.
   Notes do not change the manuscript text -- they are advisory comments.
   ```

5. **Save the notes.** If `developer_mode` is `true` and the writer explicitly asks for git bookkeeping, mention that the saved editor-notes directory can be committed separately. In writer mode, do not surface git commands.

---

## Collaboration Mode: --respond (Writer Responds to Editor Decisions)

**Purpose:** Writer reviews the editor's accept/reject/modify/note decisions on a proposal and responds. This is the writer's turn in the editor-writer collaboration workflow. The writer has final say.

### Prerequisites

1. Derive the same sanitized slug from the provided proposal name before touching the filesystem, then check that `.manuscript/proposals/{slug}-decisions.json` exists. If not: "No editor decisions found for '[name]'. The editor needs to review this proposal first with `/scr:editor-review --proposal <name>`."

### Workflow

1. **Load the decisions file** and the original proposal.

2. **Show the editor's summary** first: "Your editor reviewed this proposal: X accepted, Y rejected, Z modified, W notes."

3. **Walk through each decision:**

   For **accepted** changes: Show the change and the editor's approval. Ask the writer:
   - **Agree** -- Apply this change to the manuscript.
   - **Reconsider** -- The writer wants to discuss further (flag for follow-up).

   For **rejected** changes: Show the change, the editor's reason, and the original passage. Ask the writer:
   - **Accept rejection** -- Keep the original passage. The editor's reasoning stands.
   - **Push back** -- The writer disagrees. Ask for the writer's explanation. Flag for follow-up.
   - **Revise** -- The writer offers a new version that addresses the editor's concern.

   For **modified** changes: Show the original, the track version, and the editor's modification. Ask the writer:
   - **Accept modification** -- Use the editor's version.
   - **Prefer original track version** -- Use the writer's original change.
   - **New version** -- The writer offers a different take incorporating editor feedback.

   For **noted** passages: Show the note. Ask the writer:
   - **Acknowledge** -- Note received, no action needed.
   - **Act on it** -- The writer wants to revise based on this note. Ask for the revision.

4. **Store the writer's responses** in `.manuscript/proposals/{slug}-responses.json`:

   ```json
   {
     "proposal": "slug",
     "responder": "writer",
     "date": "ISO 8601 timestamp",
     "responses": [
       {
         "passage": "path/to/file:line_or_unit",
         "editor_action": "accept",
         "writer_response": "agree",
         "explanation": null,
         "revision": null
       },
       {
         "passage": "path/to/file:line_or_unit",
         "editor_action": "reject",
         "writer_response": "push_back",
         "explanation": "The motivation shift is intentional -- it's set up in the prologue",
         "revision": null
       }
     ],
     "summary": {
       "agreed": 0,
       "accepted_rejections": 0,
       "pushed_back": 0,
       "accepted_modifications": 0,
       "revised": 0,
       "acknowledged_notes": 0,
       "acted_on_notes": 0
     }
   }
   ```

5. **Apply final decisions.** After all responses are processed:
   - Changes that are agreed/accepted: apply via merge from the track.
   - Modifications accepted: apply the editor's modified text.
   - New writer revisions: apply the writer's new version.
   - Rejected changes (writer accepted rejection): skip, leave original.
   - Push-backs: flag for follow-up conversation, do not apply.

6. **Generate accountability summary:**
   ```
   Response complete:
   - X changes applied (agreed + accepted modifications)
   - Y changes skipped (accepted rejections)
   - Z items flagged for follow-up (push-backs)
   - W notes acknowledged, V acted upon

   Full decision trail saved with the proposal artifacts.
   ```

7. **Save responses and any applied changes.** If `developer_mode` is `true` and the writer explicitly asks for git bookkeeping, mention that the saved proposal artifacts and accepted manuscript changes can be committed separately. In writer mode, do not surface git commands.

### Decision Trail for Accountability

The full editor-writer collaboration produces three artifacts per proposal:
- `{slug}-proposal.md` -- The original revision proposal (what changed)
- `{slug}-decisions.json` -- The editor's decisions (accept/reject/modify/note)
- `{slug}-responses.json` -- The writer's responses (agree/push-back/revise)

Together these form a complete accountability trail. Neither party's work is lost. Rejected changes remain in the revision track. Push-backs are preserved for future discussion. Every decision is timestamped and attributed.

---

## Agent and Automation Status

Every response must include a short status block that makes invocation visible:

```text
Agent status:
Trigger: /scr:editor-review {mode}
Spawned agents:
- revision-diagnostic: {count} fresh-context invocation(s)
Local operations:
- reviewable units checked: {count}
- review report written: yes/no
- proposal decisions written: yes/no
- editor notes written: yes/no
- writer responses written: yes/no
Auto-invoked:
- none
Why: editor-review surfaces decisions and recommended handoffs; it does not revise prose without writer choice
```

If there were no flagged issues in standard review mode, report `revision-diagnostic: none`. In collaboration modes, report `revision-diagnostic: none` unless diagnosis was explicitly requested.

---

## Writer-Friendly Language Guide

This command uses writer-friendly terminology throughout:

| Technical Term | Writer Term |
|----------------|-------------|
| diff | tracked changes |
| merge | apply changes |
| branch | revision track |
| pull request | revision proposal |
| code review | editorial review |
| approve/merge | accept changes |
| request changes | editor notes |
| LGTM | approved |

## Error Messages

- "No proposal found for '[name]'. Create one with `/scr:track propose <name>`."
- "No editor decisions found for '[name]'. The editor needs to review this proposal first with `/scr:editor-review --proposal <name>`."
- "No editor notes found for this unit."

## OUTPUT

**Standard review mode:**
- `.manuscript/reviews/{N}-REVIEW.md`
- Revision plans (if needed): `.manuscript/plans/{N}-{A}-REVISION-PLAN.md`
- Updated `STATE.md`

**Collaboration mode:**
- `{slug}-decisions.json` (editor's decisions via --proposal)
- `{unit}-notes.md` in `editor-notes/` (editor notes via --notes)
- `{slug}-responses.json` (writer's responses via --respond)
- Applied changes to manuscript (via --respond when changes are accepted)

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
