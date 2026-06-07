# Craft Layer Plan (working draft v0.1)

Status: ALL 7 PHASES IMPLEMENTED on branch `craft-layer` (8 commits, full `npm test` green at 1957 tests, `release:check` clean). Ready to fold into a versioned milestone (`milestones/vX.Y-REQUIREMENTS.md` + `-ROADMAP.md`) and bump the version across the release-alignment file set before merge.

Phase status (all done and committed): 1 applicability tree, 2 relationships matrix, 3 conflict map + crisis beat, 4 plot causality + scene conflict, 5 plot-device lifecycle, 6 worldbuilding depth + entity propagation, 7 snowflake mode.

Two implementation choices worth recording: `CONFLICTS.md` follows the `CONTEXT.md` neutral-derived-file precedent (not registered in `file_adaptations`/`surface_applicability`) to avoid the phase18 deepEqual cascade; snowflake shipped as a `--snowflake` flag on `/scr:outline` rather than a new command, to avoid the command-reference count churn.

Note: `.planning/ROADMAP.md` still lists v2.0.12 as latest shipped, but `package.json`
is at 2.8.0. That planning doc has drifted and should be reconciled separately (out of
scope for this plan).

Plan authority: section 15 of the canonical product plan is the source of truth. This
doc is a draft to mirror into section 15, not a replacement for it.

---

## 1. The core idea

Everything below is one mechanism, not a pile of features:

**Derived completeness + mention propagation, gated by a work-type decision tree, with
the writer always in the loop.**

- **Derived completeness.** Craft surfaces (relationships, conflict, etc.) are *derived*
  matrices regenerated from authored sources, the same way `CONTEXT.md` and `PROGRESS.md`
  already are. Every cell is computed, so "no conflict" / "no relation" is a recorded
  value, never a blank. Completeness is free because cells are derived, not hand-kept.
- **Mention propagation.** When content names an entity (a city, a faction, a character),
  it flows into the right registry file. `/scr:scan` already detects unknown character
  names in drafts; we generalize that from "flag" to "propagate."
- **Decision tree (applicability).** Each surface only applies where the work type
  warrants it. An article needs no world; a poem needs no scene list or plot causality.
  This extends the capability model that already gates Scriveno's 115 commands.
- **Writer in the loop.** `/scr:character-touch` exists specifically so state is never
  silently overwritten. So "auto-populate" means: derived cells fill silently (pure
  rollup), but *undefined* cells surface as explicit gaps the system offers to explore.
  We never invent drama the writer did not intend; we do guarantee every cell is accounted
  for (filled, or marked "none").

---

## 2. The applicability decision tree (the spine)

### What exists today (credit)
`data/CONSTRAINTS.json` already maps 50 work types to 9 groups (prose, script, academic,
technical, visual, poetry, interactive, speech_song, sacred) and gates every command with:

```
commands.<name> = {
  category, available[], hidden[], adapted{group:{rename}}, requires[]
}
```

`requires` already supports conditions, e.g. relationship-map:
`"requires": ["CHARACTERS.md", { "min_characters": 2 }]`. So gating is real and tested
(`test/constraints.test.js`, `test/phase18-*`, `test/phase41-availability-truthfulness.test.js`).

### What's missing
Gating is **binary** (available vs hidden). There is no notion of
**required vs optional vs not-applicable**, and no single surface that tells a writer
"for your work type, here is what matters." (Confirmed: no command has an `applicability`
key today; there is no `feature_prerequisites` section, despite `relationship-map.md`
line 19 telling the agent to check one. That stale reference should be fixed.)

### Proposed extension
1. Add an `applicability` map per surface-bearing command:
   ```
   "applicability": { "prose": "required", "visual": "optional", "poetry": "not_applicable" }
   ```
2. Add a `surface_applicability` section keyed by work type for the file surfaces
   (which `.manuscript/` files are required / optional / not-applicable).
3. Surface it: extend onboarding (`/scr:new-work`) and `/scr:help` (or a small
   `/scr:applicable` view) to show the writer their required/optional/NA surfaces.
4. Messaging already has the hooks (`messages.command_hidden`, `prerequisite_missing`).

### Illustrative matrix (to be completed per work type)
| Surface | prose (novel) | poetry (poem) | academic (article) | technical (runbook) |
|---|---|---|---|---|
| OUTLINE scene list | required | not-applicable | optional | required (procedures) |
| CHARACTERS / FIGURES | required | not-applicable | optional (concepts) | required (audience) |
| RELATIONSHIPS | optional | not-applicable | not-applicable | optional (dependencies) |
| Conflict map | required | not-applicable | optional | optional |
| WORLD / setting | required | not-applicable | not-applicable (context) | required (system) |
| Plot causality | required | not-applicable | not-applicable | optional |
| Plot devices | optional | not-applicable | not-applicable | not-applicable |

Group defaults, with per-work-type overrides where a type differs from its group.

### Tests to update
`test/constraints.test.js` (validate applicability keys reference real groups),
a new `test/phaseNN-surface-applicability.test.js` (every required surface has a generator
command; nothing is both required and hidden), and the `file_adaptations` deepEqual in
`test/phase18-*` if any new files are registered.

---

## 3. Craft surfaces (work items)

Each item: what exists -> the gap -> proposed change. Applicability per section 2.

### 3.1 Relationships (derived complete matrix)
- Exists: relationships live inline in `CHARACTERS.md` (Key Relationships +
  Relationship-Specific Interactions); `/scr:character-touch` updates them; drafter nudges
  it. `/scr:relationship-map` reads those inline sections.
- Gap: standalone `RELATIONSHIPS.md` is written once by `/scr:new-character` and never
  refreshed; nothing reads it; no `templates/RELATIONSHIPS.md` exists. It drifts immediately.
- Proposed: make `RELATIONSHIPS.md` a **derived** complete pairwise matrix, regenerated
  from `CHARACTERS.md` by `/scr:save` and `/scr:scan`, "no relation" stated explicitly,
  undefined pairs surfaced to explore. Add `templates/RELATIONSHIPS.md` +
  `docs/relationships-protocol.md`. Fix the stale `feature_prerequisites` reference.

### 3.2 Conflict map (work / character-pair / scene)
- Exists: `WORK.md` has one freeform `## Core conflict`; internal conflict is modeled well
  via Want/Need/Lie/Ghost/Fear in `CHARACTERS.md`; `pacing-analysis` classifies tension
  retrospectively.
- Gap: no first-class conflict surface; no pairwise conflict; scene-level conflict
  (goal vs obstacle) is not captured in `/scr:plan`; "no conflict" is never recorded.
- Proposed: a derived `CONFLICTS.md` map covering work-level (from WORK.md), character-pair
  (from Want/Need clashes + relationship sections, explicit "no conflict"), and a
  per-unit scene-conflict roster (rolled up from a new scene-conflict field in `/scr:plan`).
  Conflict-type taxonomy at work level (vs self / character / nature / supernatural /
  technology / society).

### 3.3 Crisis vs climax beat
- Exists: `OUTLINE.md` has a `Climax` position field; plot-graph visualizes an
  "All Is Lost" beat.
- Gap: crisis (the disaster at ~75%, protagonist's lowest point, no options) is not named
  and not distinguished from climax (the solution / peak). The craft distinction is real.
- Proposed: add a `Crisis` field to `OUTLINE.md` distinct from `Climax`, with guidance,
  reflected in plot-graph.

### 3.4 Plot causality (Forster)
- Exists: arc beats are positional; character Want/Need exists; `RECORD.md` tracks
  "Movement" (state changes) but not why.
- Gap: no causal link between events. The system models "and then," not "because."
- Proposed: a `Causal anchor` field per unit plan ("this unit happens because ___,
  grounded in character want / prior event / discovery") and an optional
  `/scr:plot-causality --audit` that flags beats connected only by sequence, not cause.

### 3.5 Plot devices (Chekhov's gun, red herring, MacGuffin, deus ex machina, plot armor)
- Exists: `RECORD.md` has a "Promises and payoffs" table
  (`| Promise | Setup | Payoff | Status |`) and "Open threads"; `/scr:plant-seed` captures
  ideas to `SEEDS.md` (capture only, no lifecycle); `/scr:autopilot` already warns on
  "setup with no payoff."
- Gap: no device taxonomy. Chekhov's gun (must pay off), red herring (intentional
  misdirection), MacGuffin (pursuit object), deus ex machina and plot armor (risks to
  flag) are not distinguishable; seeds have no planted/paid-off/abandoned status.
- Proposed: add a `type` + lifecycle status to the promises/payoff registry; let
  `/scr:plant-seed` mark a seed as a tracked device; add deus-ex-machina / plot-armor as
  `/scr:editor-review` and continuity checks rather than authored surfaces.

### 3.6 Setting / worldbuilding depth
- Exists: `WORLD.md` covers geography, culture, social structure, magic/tech rules;
  adapts to CONTEXT/SYSTEM/COSMOLOGY; `continuity-check` verifies world rules; sacred
  `COSMOLOGY.md` is the most sophisticated (miracle rules).
- Gap: no discrete weather/season or time-of-day-as-rule fields; no setting-as-antagonist
  framing; no explicit secondary-world vs real-world-grounded rubric; magic-system fields
  are thin compared to COSMOLOGY.
- Proposed: add weather/season, time-of-day rules, a "how the setting opposes the
  protagonist" section, and a speculative-rules block (what is invented and must stay
  internally consistent vs assumed real-world physics). Promote COSMOLOGY's rigor into the
  default template.

### 3.7 Snowflake outlining mode
- Exists: `WORK.md` already has Premise, Logline, Elevator pitch, Central question, Core
  conflict; `CHARACTERS.md` has Want/Need thumbnails; `/scr:synopsis` produces summaries;
  units/scenes are enumerated in `OUTLINE.md`.
- Gap: no workflow that drives the progressive expansion (logline <=15 words, no names ->
  five-sentence paragraph -> character thumbnails -> plot summary -> expand -> scene list);
  no logline discipline.
- Proposed: a `/scr:snowflake` mode that sequences the existing surfaces in Ingermanson's
  order (reuses WORK / CHARACTERS / OUTLINE / synopsis), with one-sentence logline
  validation. No new storage files needed.

### 3.8 Entity mention propagation
- Exists: `/scr:scan` already detects unknown character names appearing in drafts.
- Gap: it flags people only, and only flags (does not propagate); places/factions are not
  caught; "mention a city" does not reach `WORLD.md`.
- Proposed: extend the scan check to detect place/faction/entity mentions and, on
  save/scan, propose stub entries in `WORLD.md` / `CHARACTERS.md` (reconcile-and-confirm,
  never silent triple-creation of "the city" / "Veridia" / "the capital").

---

## 4. Proposed build sequence (phases)

Each phase is independently shippable, backward compatible (the existing 115 commands and
50 work types keep working), test-gated, and gets its own `.planning/.../NN-name/` dir.

1. **Applicability foundation.** Add the required/optional/not-applicable tier + the
   surfacing view, applied to *existing* surfaces first (WORLD, scene list, characters).
   Delivers the headline "article needs no world, poem needs no plot" decision tree with
   zero new craft surfaces, so the tree is real and tested before surfaces stack on it.
2. **Relationships derived matrix.** First "auto-populate" surface; proves the
   derived-completeness pattern (template + protocol doc + save/scan regen + drift check +
   explore-the-gap). Fixes the orphan-file bug.
3. **Conflict map + crisis beat.** Work-level + character-pair conflict (explicit "none"),
   crisis distinct from climax.
4. **Plot causality + scene-level conflict.** Causal-anchor field in `/scr:plan`,
   scene-conflict roster rolled into the conflict map, optional causality audit.
5. **Plot devices lifecycle.** Device taxonomy + status on the promises/payoff registry;
   seed-to-device promotion; deus-ex / plot-armor as review checks.
6. **Worldbuilding depth + entity propagation.** Weather/time/setting-as-antagonist +
   speculative-rules block; generalize the scan mention check to propagation.
7. **Snowflake mode.** Progressive-expansion workflow over existing surfaces.

Reorderable. The strong recommendation is Phase 1 then Phase 2 first: the decision tree is
your headline ask and de-risks everything, and relationships prove the auto-populate
pattern on the smallest real surface.

---

## 5. Constraints and guardrails

- Pure skill/command system: no runtime, no daemon. "Auto" = derived regeneration at
  save/scan + per-command steps, not a file watcher.
- Backward compatibility: 115 commands, 50 work types, existing templates keep working.
- Writer in the loop: derived cells fill silently; generative "explore" is always offered,
  never silently invented; authored fields are never overwritten.
- Release alignment: any version bump touches the locked file set (package.json,
  templates/config.json, new-work.md, CONSTRAINTS.json version, docs, README, CHANGELOG,
  release-notes, and the hardcoded version asserts in `test/human-first-principles.test.js`).
- Plan authority: mirror this into section 15 before treating command files as canon.

### Drift / bugs found during planning (fix opportunistically)
- `commands/scr/relationship-map.md` line 19 references a `feature_prerequisites` section
  that does not exist in CONSTRAINTS.json. Prerequisites live in `requires`.
- `.planning/ROADMAP.md` says latest shipped is v2.0.12; package is 2.8.0.

---

## 6. Open questions and items to add

- **n-squared conflict matrix.** 20 characters = 190 conflict cells. Needs clustering
  (by scene, by faction) and a "load-bearing pairs only" view, or it becomes noise.
- **Generative "explore" gating.** Exactly when does the system offer to fill an undefined
  cell vs stay quiet? Per-command? Only at scan? Only on request?
- **Scene vs unit vocabulary.** Scriveno's atomic unit is already adapted per work type
  (scene/beat/chapter/section). Scene-level conflict must use the adapted unit term.
- **Where the conflict map lives** for adapted groups (sacred/technical renames).
- **Snowflake as mode vs command.** New `/scr:snowflake`, or a `--snowflake` flag on
  `/scr:outline`?
- **Decision-tree surfacing.** New `/scr:applicable` view, or fold into `/scr:help` and
  `/scr:new-work`?

### Items to add (your turn)
- (add here)
