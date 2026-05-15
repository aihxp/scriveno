# Drafter quality controls

Scriveno's drafter agent loads three layers of rule context, in this order, on every atomic unit:

1. **STYLE-GUIDE.md** (always, sovereign): the writer's Voice DNA. The drafter's primary loyalty.
2. **WRITING-RULES.md** (optional, universal): human-first restraint, content integrity, register awareness, artifact cleanup, and canonical AI-tell don'ts that apply to all writing.
3. **Pitfall pack** (optional, type-specific): traps unique to the project's `work_type`.

Conflict resolution is top-down. STYLE-GUIDE.md beats WRITING-RULES.md beats the pitfall pack. The writer's voice is sovereign; the rule layers are scaffolding to keep weaker models from drifting into generic AI prose, not constraints to override the writer.

## WRITING-RULES.md

Ships as `templates/WRITING-RULES.md` and lands in every new project's `.manuscript/` via `/scr:new-work` and `/scr:import`. The file is a universal restraint layer covering:

- Human-first restraint: do not over-correct prose that already sounds like the writer
- Variance over substitution: fix the thought and rhythm, not only the suspect word
- Factual integrity and content preservation
- Soft-inference discipline for cause, timing, priority, quantity, and motive
- Register-aware restraint for academic, technical, legal, sacred, journalistic, quoted, and period material
- Stance discipline: edge or opinion only reacts to supplied material
- Hedging and qualifiers
- Throat-clearing and scaffolding
- Balanced-both-sides constructions
- Generic metaphors and dead figures
- Symmetrical rhythm
- Moralizing closings
- Essay transitions in narrative
- Abstract vagueness
- Emotional telling
- AI tics in dialogue
- Chat artifacts, placeholder tokens, copied citation residue, and orphaned fences
- Durable-doc wording that describes what is true now
- Show-don't-tell triggers
- Punctuation defaults (no em/en dashes, no emojis)
- Diagnostic discipline (honest read): how the same rules read from the other side when prose is being evaluated rather than written

The drafter, voice-checker, and originality-check all reference this as the canonical universal rulebook. If a writer's STYLE-GUIDE.md says they hedge, fragment, moralize, use period diction, or keep a formal register deliberately, that voice choice wins.

The human-first additions are especially important for revision. They tell Scriveno to look for clusters before flagging AI-like prose, preserve mixed feelings and uneven rhythm, keep every required beat, avoid making unsupported details more specific just because the sentence would sound smoother, and avoid installing a new "humanized" signature.

Editing commands should also report restraint. A good line-edit or polish pass can say what it deliberately left alone: a formal register, an earned list, a rough sentence that carries voice, or a loaded hedge that changes the claim if removed.

The diagnostic layer is the evaluative counterpart and is deliberately separate from rewriting. `/scr:voice-check` and `/scr:originality-check` (and the voice-checker agent behind them) diagnose: they report an authenticity band (Reads human / Mixed signals / Reads AI-generated) first, then a 0-100 score, then flagged spans with reasons, and they never hand back a rewritten span. They run a scrutiny pre-check that matches scrutiny to evidence density (low density biases hard toward a high score, because over-flagging genuine human prose is the worst error a diagnostic can make), a false-positive audit with veto power that turns strong false positives into score-raising human markers, and an internal-consistency check for unearned register or sophistication seams. Every report carries a required "Reads as human (deliberately not flagged)" section and a caveat that the score is a heuristic read, not proof. The loop is diagnose, decide, transform (`/scr:line-edit`, `/scr:polish`, re-draft), re-verify; keeping diagnosis and rewriting in separate steps with the writer between them is what prevents a score-then-rewrite gaming loop, so the drafter self-check stays a write-to-the-voice judgement rather than a score chase, and no diagnostic carries a target score into a rewrite.

## Pitfall packs

Ship as `templates/pitfalls/<work_type>.md`. The drafter looks for a pack matching `config.work_type` in this order:

1. `.manuscript/PITFALLS.md` (project-local override that the writer can author)
2. `templates/pitfalls/<work_type>.md` (the installed pack)
3. None: skip silently

Initial coverage spans 8 work types (one per major group plus a second prose entry):

| Pack | Group | Focus |
|------|-------|-------|
| `novel.md` | prose | filter words, POV breaches, dialogue traps, genre stock phrases |
| `memoir.md` | prose | retrospective voice traps, sentimentality, self-presentation |
| `screenplay.md` | script | unfilmable description, action-line bloat, on-the-nose dialogue |
| `runbook.md` | technical | imperatives, missing preconditions, verification and rollback |
| `research_paper.md` | academic | hedge stacks, citation hygiene, methodology traps |
| `poetry_collection.md` | poetry | image cliches, diction traps, sentimentality, form pitfalls |
| `comic.md` | visual | script-versus-art boundary, panel rhythm, caption voice |
| `commentary.md` | sacred | register drift, anachronism, source-handling, doctrinal precision |

A contributor adding `templates/pitfalls/<new_work_type>.md` is automatically picked up by `listPitfallPacks()` with no edit to library code or `CONSTRAINTS.json`.

## The `draft` block in config.json

Three knobs in `.manuscript/config.json`:

```json
"draft": {
  "rigor": "standard",
  "context_profile": "standard",
  "pitfalls_enabled": true
}
```

### `draft.rigor`

- `standard` (default): the drafter applies WRITING-RULES.md and the pitfall pack during the Step 4 self-check. Rewrites if drift is detected.
- `strict`: the drafter mentally checks each sentence against WRITING-RULES.md and the pitfall pack as it writes. Use when routing to weaker models that benefit from explicit per-sentence scaffolding.

### `draft.context_profile`

Controls how much context the drafter loads per atomic unit. Saves tokens on every invocation, which compounds across a manuscript of dozens or hundreds of units.

- `minimal`: STYLE-GUIDE, WRITING-RULES, the unit's PLAN, the previous unit's tail, and CHARACTERS entries for figures actually appearing in the plan. Skips THEMES.md and WORK.md unless the plan references them.
- `standard` (default): full context list. Preserves prior behavior for unmodified projects.
- `full`: standard + full DOCTRINES.md and LINEAGES.md (not excerpts) for sacred works, plus reference passages when the orchestrator provides them. Use when the unit genuinely needs cross-document continuity.

### `draft.pitfalls_enabled`

When `false`, skip loading the pitfall pack. WRITING-RULES.md still loads. Use when the writer's voice deliberately leans into a pitfall (parody, pastiche, period voice, satire) and the pack is more interference than help.

## Model tier recommendations

Rough guidance for matching settings to model class. The writer's experience with the model is the final arbiter; treat these as starting points, not laws.

| Model class | Typical use | Recommended `rigor` | Recommended `context_profile` |
|-------------|------------|--------------------|------------------------------|
| Frontier (Opus 4.x, GPT-4.x, Gemini 2.x Pro) | Long-form drafting, complex sacred or literary prose | `standard` | `standard` or `full` (when the unit needs continuity) |
| Mid-tier (Sonnet 4.x, GPT-4 mini, Haiku 4.x) | Day-to-day drafting, most novels and screenplays | `standard` | `standard` |
| Budget (Haiku, GPT-3.5, local 7-13B) | Bulk drafting of short scenes, repetitive structural work | `strict` | `minimal` |

If voice fidelity drops below the writer's `voice.drift_threshold`, the first lever is `rigor: strict`. The second is to step up a model tier. The third is to recalibrate STYLE-GUIDE.md via `/scr:voice-test`.

## Token economy

The drafter's prompt cache benefits from a stable prefix. Loading order is fixed across invocations (STYLE-GUIDE.md, WRITING-RULES.md, pitfall pack first; unit-variable files last) so the host runtime's prompt cache hits the rule layers without recomputation. The `minimal` context profile compounds this: less tail variance per unit means more cache reuse across a long drafting session.

## Backward compatibility

All three layers are optional. Projects predating this feature keep working without modification:

- WRITING-RULES.md absent: drafter falls back to inline "what you must never do" rules.
- No pitfall pack for the work_type: drafter skips silently; line-edit falls back to broad genre cues.
- `draft` block absent from config.json: drafter uses defaults (`standard` rigor, `standard` context_profile, pitfalls enabled).

## See also

- [`templates/WRITING-RULES.md`](../templates/WRITING-RULES.md): the canonical universal rulebook
- [`templates/pitfalls/`](../templates/pitfalls/): per-work-type pitfall packs
- [`agents/drafter.md`](../agents/drafter.md): the drafter agent's contract
- [`agents/voice-checker.md`](../agents/voice-checker.md): the voice-drift gate
- [`commands/scr/originality-check.md`](../commands/scr/originality-check.md): AI-pattern detection
