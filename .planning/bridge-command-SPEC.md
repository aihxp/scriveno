# SPEC: `/scr:bridge` -- seam diagnosis and transition repair

Status: PROPOSED (not built). Authored 2026-06-22. Targets a future minor release (3.4.0).

## 1. Why this command exists

Scriveno already handles transition *coherence* as an emergent property: the drafter receives the previous unit's 200-word tail, plans carry a Causal Anchor and Continuity Anchors, `/scr:pacing-analysis --seams` diagnoses momentum across boundaries, and `/scr:editor-review` checks the per-unit seam. What it has no surface for is the *act of repairing one specific seam* once a writer has found it. Today that work falls back into `/scr:draft`, which is built for atomic units with full plans, not for the lightweight connective problem of "units 8 and 9 do not knit together."

`/scr:bridge` fills exactly that gap and nothing more: take one named unit boundary, diagnose why the seam is weak, and offer the writer the options their voice profile prefers.

## 2. The hard constraint: this is the riskiest command to voice fidelity

The product's core value is "drafted prose sounds like the writer, not like AI." Transitions are the single place AI prose most reliably inserts filler ("Later that evening...", "As the sun set, she realized..."). A command whose default behavior is *generate connective prose* runs straight at that failure mode and contradicts the drafter's own no-throat-clearing rule.

Therefore the design is **diagnose-with-options, not auto-pad**:

- The command's primary output is a diagnosis of the seam plus a set of named options.
- It generates prose only when the writer explicitly chooses an option that requires prose (the "short bridge" option). The default recommendation is frequently "hard cut" (delete, do not add).
- Any generated bridge is short (a sentence to a short paragraph), loads STYLE-GUIDE.md first, and is presented as a proposal the writer accepts, never written silently into the draft.

If this guardrail is ever dropped, the command should not ship.

## 3. Behavior

### Invocation

```
/scr:bridge <boundary>        # e.g. /scr:bridge 8-9  (seam between unit 8 and unit 9)
/scr:bridge <boundary> --apply <option>
```

`<boundary>` names two adjacent units in the work's native vocabulary (chapters, scenes, acts, sections, surahs). Accept `8-9`, `8 9`, or a single unit `9` (meaning the seam entering unit 9 from its predecessor).

### STEP 0: LOAD CONTEXT

- `config.json` for work type and hierarchy. The command is hidden for work types where unit-to-unit narrative momentum is not the model (poetry, reference); reuse the `pacing-analysis` hidden-group check and exit gracefully if hidden.
- STYLE-GUIDE.md, specifically the Transitions block (`SCENE_TRANSITIONS`, `CHAPTER_TRANSITIONS`, `SCENE_BREAK_MARKER`, `TIME_JUMP_MARKER`). The writer's declared transition style drives which options are offered first.
- The drafted tail of the earlier unit and the drafted head of the later unit.
- RECORD.md (open threads, next-unit obligations, continuity facts that cross this boundary) and both units' plan files when present (Causal Anchor, Record Notes).
- The latest `*-PACING-REPORT.md` if one exists, to reuse the seam classification from `/scr:pacing-analysis --seams`.

### STEP 1: DIAGNOSE THE SEAM

Classify the boundary using the same vocabulary as `pacing-analysis --seams` (clean handoff / hook-into-hook / hard cut / soft fade / abrupt-whiplash / flat seam). State, in one or two sentences, *why* the seam reads as it does: a settled close into an exposition open, a time jump the open never signals, an emotional discontinuity (unit ends in despair, next opens energized with no bridge), an unhandled next-unit obligation from RECORD.md, etc.

### STEP 2: OFFER OPTIONS (writer chooses)

Present a small set of options, ordered by the writer's STYLE-GUIDE preference and the diagnosis:

- **Hard cut** -- often the right answer. Recommend the scene-break / time-jump marker from STYLE-GUIDE (`SCENE_BREAK_MARKER`, `TIME_JUMP_MARKER`). No prose added.
- **Time-marked break** -- a dateline or labeled break that orients the reader across a jump, again in the writer's marker convention.
- **Short bridge** -- a sentence or short paragraph that carries the reader across. Only this option generates prose, and only on explicit selection.
- **Fix upstream** -- when the real problem is the close of the earlier unit or the open of the later one, recommend `/scr:editor-review` on that unit or a targeted `/scr:draft` revision instead of a bridge.

### STEP 3: APPLY (only when chosen)

For marker options, state the exact edit (insert the marker; do not generate prose). For the short-bridge option, load STYLE-GUIDE.md, draft the minimal bridge in the writer's voice, show it as a proposal, and only on confirmation write it at the boundary. Never expand a bridge beyond what the diagnosis calls for. Honor any crossing RECORD.md obligation rather than restating prior-unit state.

### STEP 4: RECORD AND HAND OFF

Append a HISTORY.log line per `docs/history-protocol.md` (`scr:bridge | boundary={a-b} | option={chosen} | outcome=ok|skipped`). If a bridge changed the page, recommend `/scr:voice-check` on the affected unit and `/scr:continuity-check` if the bridge touches a tracked thread.

## 4. Add-command surface checklist (fill these when building)

This command adds a node, so it pays the full surface tax. Counts move **123 -> 124**.

- [ ] `commands/scr/bridge.md` -- frontmatter (`description`, `argument-hint: "[<boundary>] [--apply <option>]"`), heading, the seam steps above, an Agent and Automation Status block (no spawned agents; local operations only), and the standard Response Contract block copied from a sibling.
- [ ] `data/CONSTRAINTS.json`
  - [ ] `commands.bridge` entry: `category: "quality"`, `available` (match `pacing-analysis`: prose, script, academic, visual, interactive, sacred -- not "all"), `description`, `requires: ["draft_exists"]`.
  - [ ] add `bridge` to a `command_intents` bucket (`revise`).
  - [ ] optionally add `bridge` to the relevant `command_families` group.
- [ ] Routing / connectivity: `bridge` must appear as a next-command suggestion in at least one existing command's Response Contract, or `connectivity.test.js` flags it as orphaned. Natural inbound edges: `pacing-analysis` (after a flat/abrupt seam finding) and `editor-review` (after the seam follow-up). Add the suggestion there.
- [ ] `docs/command-reference.md`
  - [ ] new `### \`/scr:bridge\`` subsection under Quality. The **Usage** line must equal `` `/scr:bridge [<boundary>] [--apply <option>]` `` verbatim (must match frontmatter argument-hint -- `command-reference-integrity.test.js`).
  - [ ] **Available for** must match CONSTRAINTS availability; **Prerequisites** must mention a draft (the `draft_exists` requirement).
  - [ ] bump the header count `**123 commands**` -> `**124 commands**` (`command-surface-coherence.test.js`).
- [ ] `README.md` -- three count literals 123 -> 124 (lines ~42, ~221, ~270; `collaboration-trust-surface.test.js`).
- [ ] Proof: only needed if `bridge` becomes a *predicted* next step. It will not be auto-recommended by `analyzeProject()`, so no `data/proof/replay/golden-workflows.json` entry is required. Still re-derive the install smoke count (`node bin/install.js smoke --json`) and grep `123` repo-wide for any count literal the tests do not guard (CLAUDE.md / AGENTS.md currently say a stale "115"; docs/voice-dna.md and docs/architecture.md were prior count surfaces -- verify).
- [ ] Release alignment: ship as **3.4.0** (a feature). That bump drags in the full release-alignment file set (package.json, templates/config.json, commands/scr/new-work.md, data/CONSTRAINTS.json version, docs/configuration.md, README badge/version lines, CHANGELOG.md, docs/release-notes.md, and the hardcoded version in `test/human-first-principles.test.js`).
- [ ] Gate on `npm test` exit code (or `npm run release:check`). Command counts in tests are computed dynamically from `commands/scr/`; only prose/artifact literals need hand-updating.

## 5. Relationship to the rest of the transition work

- `/scr:pacing-analysis --seams` (shipped alongside this spec) *finds* weak seams across the manuscript. `/scr:bridge` *repairs* one. They share the seam vocabulary and the STYLE-GUIDE Transitions block on purpose.
- The STYLE-GUIDE `SCENE_BREAK_MARKER` / `TIME_JUMP_MARKER` fields (shipped alongside this spec) are the writer-preference source `/scr:bridge` reads when ordering its options.
- `/scr:editor-review`'s seam follow-up is the most common place a writer will be pointed at `/scr:bridge`.

## 6. Open questions for the build

- Should `--apply short-bridge` ever run without an interactive confirmation (e.g. in `/scr:autopilot`)? Default answer: no. Autopilot may *flag* seams but should not auto-write bridges, to protect voice fidelity.
- Should `bridge` accept a range (`8-12`) to walk several seams in one pass? Defer; start with a single boundary.
- Work-type vocabulary: confirm the boundary parser reads the native unit term from CONSTRAINTS hierarchy rather than assuming "chapter."
