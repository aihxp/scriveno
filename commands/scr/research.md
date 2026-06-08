---
description: Add sourced advisory research notes for any topic without changing project canon.
argument-hint: "<topic> [--type <type>] [--place] [--figure] [--era <era>]"
---

# /scr:research -- Advisory Research Notes

Add sourced factual, craft, source, or context notes to `.manuscript/RESEARCH.md`.

## Usage

```
/scr:research <topic> [--type <type>] [--place] [--figure] [--era <era>]
```

## Instruction

Load:

- `.manuscript/config.json`
- `docs/research-protocol.md`
- `docs/subagent-spawning-protocol.md`
- `agents/researcher.md`
- `.manuscript/RESEARCH.md` if it exists, otherwise prepare it from `templates/RESEARCH.md`
- `.manuscript/PLACES.md` if `--place` is passed or the topic matches a place
- the adapted cast surface if `--figure` is passed or the topic matches a figure
- `RECORD.md`, the adapted world surface, the adapted subject surface, the adapted plot surface, `REFERENCES.md`, `DOCTRINES.md`, `QUESTIONS.md`, `PROCEDURES.md`, and recent draft mentions when useful for scope

## Worker Fan-Out

Use the installed `agents/researcher.md` prompt as the research authority. If the topic spans multiple angles, spawn one focused researcher worker per relevant angle and merge the findings into one topic section:

- craft and genre
- historical period, event, figure, object, or daily life
- technical, legal, medical, system, or procedural accuracy
- cultural context
- sacred or theological source material
- academic literature, claims, methods, or citations
- public data, institutions, places, transit, weather, or geography
- comparable works

If native worker spawning is unavailable, run each selected angle in an isolated fresh context sequentially and report `prompt-run fallback used` in the status block. Research workers are read-only. They return source-backed findings, caveats, confidence, and disputes; this command owns the final `RESEARCH.md` write.

## Research Rules

Research notes are advisory. They are not project canon until the writer accepts them into `RECORD.md`, `PLACES.md`, the adapted cast surface, the adapted subject surface, the adapted plot surface, or another owner file.

Follow the existing `agents/researcher.md` research domains:

- genre and craft
- historical accuracy
- technical accuracy
- cultural research
- sacred and theological research
- academic and scholarly sources
- comparable works
- public data, institutions, geography, law, medicine, systems, and procedures

Use reliable sources appropriate to the topic:

- official or institutional sources for geography, law, public data, transit, weather, and modern place facts
- primary or scholarly sources for historical figures, traditions, dates, and period detail
- peer-reviewed or field-standard sources for academic claims, methods, and evidence
- recognized editions or tradition-specific sources for sacred and theological material
- reputable reference sources only as orientation, not as the sole authority for contested claims

If browsing or source verification is unavailable, do not invent facts or citations. Append a pending research question instead and mark the status `pending`.

## Write

Append or update one topic section in `.manuscript/RESEARCH.md`:

- topic
- type
- question being answered
- target surface if accepted
- date checked
- fact status: `sourced`, `uncertain`, `era-dependent`, `fictionalized`, or `accepted-into-canon`
- sourced claims table with source, checked date, confidence, and canon impact
- era/context caveats
- author deviations
- follow-up questions

For real-world places, include enough spatial context to support `/scr:place-touch`, but do not update `PLACES.md` directly. End by suggesting `/scr:place-touch <name>` if any fact should become canon.

For historical figures, include enough context to support `/scr:character-touch` or the sacred figure commands, but do not update the adapted cast surface directly.

For subjects, concepts, claims, procedures, doctrines, objects, references, terminology, or evidence, include enough context to support `/scr:subject-touch`, but do not update the adapted subject or plot surface directly.

Append to `.manuscript/HISTORY.log`:

```text
{ISO timestamp} | scr:research | topic=<topic> | status=<sourced|pending|uncertain> | outcome=ok
```

## Agent and Automation Status

Every response must include a short status block that makes invocation visible:

```text
Agent status:
Trigger: /scr:research <topic> {flags}
Spawned agents:
- researcher: {count, none, or prompt-run fallback used}
Local operations:
- RESEARCH.md written: yes/no
- HISTORY.log appended: yes/no
Auto-invoked:
- none
Why: research workers gather advisory findings; this command merges and writes the durable note
```

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

```markdown
Next commands:
- `/scr:place-touch <name>`: Accept selected place facts into project canon.
- `/scr:character-touch <name>`: Accept selected figure facts into the cast surface.
- `/scr:subject-touch <subject>`: Accept selected subject, procedure, doctrine, claim, or reference facts into the owner surface.
- `/scr:plan <unit>`: Use the research as advisory context in the next plan.
```
