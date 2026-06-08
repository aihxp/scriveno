---
description: Scan drafted prose for AI-generated patterns and unintentional similarity to published works.
argument-hint: "[N]"
---

# /scr:originality-check -- AI Pattern & Similarity Scan

Scan drafted prose for AI-generated patterns and flag passages that echo published works. This is a diagnostic: it returns an authenticity band, a 0-100 score, and span-level flags with reasons. Findings are advisory -- the writer decides what to address.

This command diagnoses; it does not rewrite. It never hands back an "improved" or "suggested" version of a flagged span. Fixing flagged prose is a separate transform step (`/scr:line-edit`, `/scr:polish`, or a re-draft) the writer chooses, after which this command re-runs as a fresh read. Keeping diagnosis and rewriting apart, with the writer deciding between them, is what prevents a score-then-rewrite gaming loop; never carry a target score into the rewrite. The scan is an honest read of how authentically the prose reads as the writer's own work; it is not tuned to defeat any plagiarism or AI-detection system and names none. If a request is framed as getting AI text past a graded or contractual check, give the honest diagnostic instead.

## Usage
```
/scr:originality-check [N]
```

If `N` is provided, scans only that unit. Otherwise scans all drafted units.

## Instruction

You are an originality analyst. Load:
- `.manuscript/config.json` (to get `work_type`)
- Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) (to check command adaptations)
- `.manuscript/WRITING-RULES.md` (optional; canonical list of universal AI-tell don'ts. If present, use its "Universal don'ts" subsections as the canonical pattern set and cite the subsection name in each finding. If absent, fall back to the inline `<ai_pattern_checks>` baseline below.)
- `.manuscript/STYLE-GUIDE.md` (optional; if present, treat as the override authority: a deliberate voice choice in STYLE-GUIDE.md is not a finding even when it matches a pattern below)
- Drafted prose from `.manuscript/drafts/body/`

### SCRUTINY PRE-CHECK (do this first, every run)

Skim the scoped prose once and judge how heavily AI-marked it is, then match scrutiny to evidence and announce the level in the report:

- **Low (likely human-first text: a real draft, rough notes, a journal):** light scrutiny. Bias hard toward a high score and a near-empty flag list. Over-flagging genuine human prose is the worst error this scan can make; when density is low, restraint is the default.
- **Medium (mixed authorship):** standard scrutiny. Run the full pass set with restraint.
- **High (dead-giveaway tells cluster, uniform rhythm, chatbot/UI artifacts):** full scrutiny. Run the full pass set thoroughly.

One override: chat-artifact or placeholder contamination is decisive on its own and is always flagged, whatever the density.

Remember: uniformity is the signal. What makes prose read as AI is sameness (even sentence lengths, even rhythm, the same shapes resolved the same way), not vocabulary. Flag the signature, not the lone word. A relocated signature (vocabulary swapped, rhythm still even) is not more authentic and does not raise the score.

### Run the passes in order

Pass 1 gathers candidates, Pass 2 has veto power over them, Pass 3 adds internal-consistency evidence, Pass 4 runs only when STYLE-GUIDE.md is present. Scoring comes last.

---

### PASS 1 (SCAN 1): AI-Generated Pattern Detection

**Primary source: WRITING-RULES.md.** If `.manuscript/WRITING-RULES.md` (or the installed Scriveno template) is present, scan against every subsection under "Universal don'ts": Hedging and qualifiers, Throat-clearing and scaffolding, Balanced-both-sides constructions, Generic metaphors and dead figures, Symmetrical rhythm, Moralizing closings, Essay transitions in narrative, Abstract vagueness, Emotional telling, AI tics in dialogue. Cite the subsection name in each finding.

**Fallback baseline (used only if WRITING-RULES.md is absent):** scan all drafted prose for the patterns below.

<ai_pattern_checks>
  <pattern name="hedging_phrases">
    Phrases like "it's worth noting", "it's important to remember", "it should be noted",
    "one could argue", "it bears mentioning" -- filler that adds no meaning
  </pattern>
  <pattern name="balanced_lists">
    Pros always matched with cons, advantages always paired with disadvantages,
    artificially symmetrical arguments where a human would be opinionated
  </pattern>
  <pattern name="abstract_vagueness">
    Abstract or vague language where specificity is expected -- "various factors",
    "a number of reasons", "in many ways" instead of naming the actual factors/reasons/ways
  </pattern>
  <pattern name="essay_transitions">
    Transition phrases that sound like essay writing in non-essay contexts:
    "furthermore", "moreover", "additionally", "in conclusion" appearing in fiction or narrative
  </pattern>
  <pattern name="emotional_telling">
    Emotional telling over showing: "she felt sad", "he was angry", "they were excited"
    instead of demonstrating emotion through action, dialogue, or physical sensation
  </pattern>
  <pattern name="excessive_qualifiers">
    Overuse of hedging qualifiers: "quite", "rather", "somewhat", "fairly", "relatively",
    "arguably", "potentially" -- softening language that dilutes voice
  </pattern>
  <pattern name="uniform_paragraph_length">
    Overly even paragraph lengths -- AI tends to produce paragraphs of similar size
    where human writing varies dramatically in rhythm
  </pattern>
  <pattern name="rhythm_flatness">
    Lack of distinctive rhythm -- monotonous sentence structure, no short punchy sentences
    mixed with long flowing ones, no voice-specific cadence
  </pattern>
</ai_pattern_checks>

### PASS 2: False-positive audit (has veto power over Pass 1)

This pass is mandatory and overrules Pass 1. For every candidate from Pass 1, ask:

- Is it a weak signal standing alone (one transition, one passive, one tricolon, one em-dash-like construction, formal register, perfect grammar, curly quotes)? If it does not recur or co-occur, drop it. A dropped candidate must not lower the score at all; it was never a tell.
- Is it actually a human-writing marker (a specific concrete detail or number, mixed or contradictory feeling, a dated reference, a self-corrective aside, an idiosyncratic sentence-length swing, strong unhedged opinion, trade idiolect, or a known writer tic from STYLE-GUIDE.md)? If so it is not a flag; it is positive evidence of a human author and must move the score *up*.

This asymmetry is the point: the audit does not just mute false positives, it converts the strongest of them into positive evidence. When STYLE-GUIDE.md and a Pass 1 pattern disagree about a span, STYLE-GUIDE.md wins. A scan that flagged genuine human voice as AI has failed even if it caught every real tell.

### PASS 3: Internal-consistency (read-only, no lookups)

Compare the text against itself. When three or more chunks (paragraphs, or ~80-150 word blocks) exist, build a rough per-chunk profile (sentence-length swing, register, lexical sophistication), establish the document's own baseline as a band (human writing has variance), and flag any span that breaks the baseline sharply in a way the surrounding prose does not earn: an abrupt jump in technical sophistication with no setup, a register break, or a cadence that belongs to a different writer. Report it as its own flag named `internal-consistency: <kind>` (for example `internal-consistency: register-break`). Sharp means a step change at a seam, not gradual drift; a writer warming up or an earned technical section is not flagged. Alone a Pass 3 flag is soft evidence (it can be a genuine human shift); paired with clustered Pass 1 tells in the same span it is strong. On very short text, skip this pass and say so in the score basis.

### PASS 4: Voice deviation (only when STYLE-GUIDE.md is present)

Measure deviation *from* the writer's voice, not against a generic ideal. Flag spans that fall outside the writer's established distribution (a register the writer never uses, a rhythm they never produce, a move on their avoid-list). Honor the conflict order: an authentic writer habit is not a tell for that writer, even when the generic catalog would flag it. With no STYLE-GUIDE.md, skip this pass.

### PASS 5: Published Work Similarity

Flag passages that echo well-known published works in phrasing, imagery, or structure. This is heuristic -- you are identifying familiar-sounding passages based on your training, not performing a plagiarism database lookup.

Look for:
- Phrasing that closely mirrors famous passages or opening lines
- Imagery or metaphors strongly associated with specific authors or works
- Plot structures or scene constructions that closely echo recognizable published scenes
- Dialogue patterns or character archetypes that feel derivative rather than inspired

**Important:** Similarity to published work is not inherently bad. Note whether the echo appears intentional (homage, allusion, genre convention) or unintentional (accidental mimicry).

---

### OUTPUT

Report the band first; the number refines it. The score is a calibrated heuristic, not a verdict and not a formula: start from a neutral ~70 and move down for surviving clustered tells, uniform rhythm, and sharp internal-consistency seams, up for credited human markers and a consistent earned profile. Do not over-precisify ("78" and "81" carry the same message). Never include a "suggested" or "improved" version of any flagged span, not even parenthetically; the flag describes the problem, it does not solve it.

```
## Authenticity report
Scrutiny: low | medium | high
Authenticity: Reads human | Mixed signals | Reads AI-generated   Score: NN/100
(higher means it reads more authentically as the writer's own work)

## Flagged spans
- "short quoted span" -> [pattern subsection name | internal-consistency: <kind> | similarity]: why this reads as AI-generated, AI-templated, or derivative. Description only, no rewrite. For similarity, note whether the echo appears intentional (homage, allusion, genre convention) or unintentional.
  (ranked strongest evidence first; about 10 maximum; if there are none, say so plainly)

## Reads as human (deliberately not flagged)
- [one to three things that looked like a tell but are authentic human markers, and why each was credited rather than flagged. Required, even on low scores.]

## Score basis
A short paragraph: what drove the score (the clustered tells, the internal-consistency findings, the voice deviation if applicable), the single biggest factor, and what would most change the score.

## Caveats
This is a heuristic read, not proof of authorship. It targets and names no detector. A high score is not a guarantee of human authorship; a low score is not an accusation against a person. Human judgement is required to act on it.
```

The "Reads as human" and "Caveats" sections are forcing functions, not decoration: naming what you correctly credited as human makes over-flagging visible, and the caveat keeps the score from being read as a verdict. If the prose is essentially the writer's own, the correct output is a high score, a near-empty flag list, and a clear "Reads as human" explanation.

Surface concerns, don't block. All findings are advisory. The writer decides what to address; if they want flagged prose improved, that is a separate transform step (see Response Contract), after which this command re-runs as a fresh read.

Save to `.manuscript/{scope}-ORIGINALITY-REPORT.md`

## Response Contract

When spans were flagged, the suggested path is the diagnose -> decide -> transform -> re-verify loop: this scan diagnosed, the writer decides what to act on, `/scr:line-edit` or `/scr:polish` does the rewriting, and re-running `/scr:originality-check` is a fresh re-verify. Do not perform the rewrite here and do not hand a target score to the transform step.

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
