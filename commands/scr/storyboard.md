---
description: Generate storyboard frames for script and visual work types with camera direction.
argument-hint: "[--scene <ref>] [--act <number>]"
---

# /scr:storyboard -- Storyboard Frame Generator

Generate storyboard frames with shot types, camera movement, transitions, and ASCII composition sketches for script and visual work types.

## Usage
```
/scr:storyboard [--scene <ref>] [--act <number>]
```

## Instruction

You are generating storyboard frames for a script or visual project. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check `commands.storyboard.available` -- script and visual groups only)
- `.manuscript/illustrations/ART-DIRECTION.md` if it exists (for visual style consistency)
- `.manuscript/OUTLINE.md` (for scene/beat structure)
- Drafted scene files for content

**Check availability:**

Look up the current work type's group in CONSTRAINTS.json. If the group is in `commands.storyboard.hidden` (prose, academic, poetry, interactive, speech_song, sacred), inform the writer:

> Storyboard is designed for scripts and visual projects. Your [work_type] project uses other illustration tools instead. Try `/scr:illustrate-scene` for scene illustration prompts.

Then **stop**.

---

### Scope Selection

<scope_selection>
  Determine what to storyboard:

  - **No flags:** Generate a thumbnail overview storyboard for the entire work. Use 1 frame per scene/beat, showing the key visual moment. This gives a bird's-eye view of the visual story.

  - **`--scene <ref>`:** Generate detailed frames for a single scene. Break the scene into individual beats, each getting its own frame with full camera direction. Typically 3-12 frames per scene depending on complexity.

  - **`--act <number>`:** Generate frames for all scenes in the specified act. Use OUTLINE.md to identify which scenes belong to the act. Medium detail -- 2-4 frames per scene.

  If the specified scene or act has no drafted content, use OUTLINE.md beat descriptions for frame content. Note: "Frames generated from outline beats. Draft the scene for more detailed storyboard frames."
</scope_selection>

---

### Frame Generation (D-05 Camera Direction)

<frame_generation>
  For each frame, generate the following per D-05:

  **Shot Types** (choose one per frame):
  - `ESTABLISHING` -- Wide shot that sets location/context
  - `WIDE` -- Full scene visible, characters in environment
  - `MEDIUM` -- Character(s) from waist up, conversational distance
  - `CLOSE-UP` -- Face or important object fills frame
  - `EXTREME CLOSE-UP` -- Eyes, hands, small detail
  - `OVER-THE-SHOULDER` -- Dialogue framing, one character's perspective
  - `POV` -- Camera is a character's eyes
  - `AERIAL` -- Bird's-eye view, establishing scale
  - `LOW ANGLE` -- Looking up, conveys power/threat
  - `HIGH ANGLE` -- Looking down, conveys vulnerability/overview
  - `TWO-SHOT` -- Two characters framed together
  - `GROUP` -- Multiple characters in frame

  **Camera Movement** (choose one per frame):
  - `STATIC` -- Camera does not move
  - `PAN LEFT/RIGHT` -- Horizontal rotation on axis
  - `PAN UP/DOWN` -- Vertical rotation on axis (tilt)
  - `DOLLY IN/OUT` -- Camera physically moves toward/away from subject
  - `DOLLY ALONGSIDE` -- Camera moves parallel to subject movement
  - `ZOOM IN/OUT` -- Lens zoom (different feel from dolly)
  - `CRANE UP/DOWN` -- Vertical camera movement
  - `HANDHELD` -- Shaky, documentary feel
  - `STEADICAM` -- Smooth tracking shot following subject
  - `RACK FOCUS` -- Focus shifts between foreground and background

  **Transitions** (to the next frame):
  - `CUT` -- Instant change (default, most common)
  - `DISSOLVE` -- Gradual blend to next frame (passage of time)
  - `FADE TO BLACK` -- Scene ending
  - `FADE FROM BLACK` -- Scene beginning
  - `WIPE` -- One image pushes another off screen (stylistic)
  - `MATCH CUT` -- Visual or thematic link between frames (same shape, motion, or concept)
  - `SMASH CUT` -- Abrupt jarring transition for contrast
  - `J-CUT / L-CUT` -- Audio from next/previous scene overlaps

  **Frame Output Format:**

  ```
  [FRAME NN] Scene X, Beat Y -- SHOT_TYPE
  Shot: [shot type] | Camera: [movement] | Transition: [to next]
  +---------------------------+
  |                           |
  |   [ASCII COMPOSITION]     |
  |                           |
  |   [KEY ELEMENTS LABELED]  |
  |                           |
  +---------------------------+
  Description: [What is in frame -- characters, action, key props, environment]
  Dialogue/VO: [Key line of dialogue or voiceover, if any. "--" if none]
  Duration: [quick (< 2s) | standard (2-5s) | lingering (5-10s) | extended (10s+)]
  Mood/Lighting: [Atmosphere -- e.g., "warm golden hour, long shadows, intimate"]
  ```

  **ASCII Composition Sketches:**

  Use simple ASCII art to show spatial relationships:
  - `[CHAR]` or character initials for character positions
  - `[BG]` for background elements
  - `[FG]` for foreground elements
  - `[PROP]` for important objects
  - Horizontal/vertical lines to show depth planes
  - Arrow indicators for movement direction

  Examples:

  ```
  Establishing shot:
  +---------------------------+
  |  [SKY/HORIZON]            |
  |                           |
  |    [BUILDING]     [TREE]  |
  |  [CHAR A]                 |
  |  [FOREGROUND PATH]        |
  +---------------------------+

  Close-up dialogue:
  +---------------------------+
  |                           |
  |      [CHAR A FACE]        |
  |      eyes: determined     |
  |      mouth: speaking      |
  |                           |
  +---------------------------+

  Over-the-shoulder:
  +---------------------------+
  |                           |
  | [CHAR A         [CHAR B]  |
  |  shoulder/       facing   |
  |  back of         camera]  |
  |  head]                    |
  +---------------------------+
  ```
</frame_generation>

---

### Storyboard Assembly

<storyboard_assembly>
  Assemble all frames into a complete storyboard document:

  ```markdown
  # Storyboard: [Title/Reference]

  **Work:** [title from config.json]
  **Scope:** [Entire work | Scene: {ref} | Act: {number}]
  **Total frames:** [count]
  **Generated from:** [outline beats | drafted scenes | mix]

  ## Visual Style Notes
  [From ART-DIRECTION.md if it exists -- key style reminders for visual consistency]

  ---

  ## [Scene/Act Header]

  [FRAME 01] ...
  [FRAME 02] ...
  ...

  ---

  ## Shot Distribution Summary

  | Shot Type | Count | Percentage |
  |-----------|-------|------------|
  | Establishing | N | N% |
  | Wide | N | N% |
  | Medium | N | N% |
  | Close-up | N | N% |
  | ... | | |

  ## Transition Summary

  | Transition | Count |
  |------------|-------|
  | Cut | N |
  | Dissolve | N |
  | ... | |

  ## Pacing Notes
  [Brief analysis of visual pacing -- where the rhythm speeds up (quick cuts) or slows down (lingering shots). Flag any sequences that may feel monotonous (too many similar shots in a row).]
  ```

  **Frame numbering:** Sequential across the entire storyboard (FRAME 01, FRAME 02, ...) regardless of scene boundaries.

  **Scene boundaries:** Insert a horizontal rule (`---`) and scene header between scenes.
</storyboard_assembly>

---

### Output

Create the output directory if needed:
```bash
mkdir -p .manuscript/illustrations/storyboards/
```

Save to `.manuscript/illustrations/storyboards/storyboard-{ref}.md` where `{ref}` is:
- `full` for entire work
- Scene reference for `--scene`
- `act-{number}` for `--act`

Commit: `storyboard: generate frames for {ref}`

After saving, tell the writer:
> Storyboard saved to `.manuscript/illustrations/storyboards/storyboard-{ref}.md`.
>
> Each frame includes shot type, camera direction, and ASCII composition.
> Use this as a shot list for production or as illustration direction.
>
> For more detail on a specific scene: `/scr:storyboard --scene {ref}`

---

### Edge Cases

- **No drafted scenes:** Generate frames from OUTLINE.md beat descriptions. Note reduced detail level.
- **No OUTLINE.md:** Cannot generate storyboard -- "Create an outline first with `/scr:plan`."
- **Very long work (50+ scenes):** For full-work overview, limit to 1 frame per scene with thumbnail-level detail. Suggest `--act` for more detail.
- **Scene with no action:** Focus on atmosphere, environment, and character positioning. Use static/lingering frames.
- **Musical/song sequences:** Use duration notes extensively, mark rhythm changes.
- **ART-DIRECTION.md missing:** Generate storyboard without visual style notes. Suggest: "Run `/scr:art-direction` for visual consistency across storyboard frames."

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
