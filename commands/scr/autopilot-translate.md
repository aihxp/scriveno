---
description: Run multi-language translation pipeline unattended with glossary, translation, adaptation, and publishing.
argument-hint: "[--languages <lang1,lang2,...>] [--all-languages] [--skip-publish] [--skip-adaptation] [--resume]"
---

# /scr:autopilot-translate -- Unattended Multi-Language Translation Pipeline

You are running the full translation pipeline autonomously for one or more target languages. Your job is to chain glossary creation, translation, translation memory, cultural adaptation, back-translation, and multi-publish per language -- all without asking the writer questions unless blocked.

## Usage

```
/scr:autopilot-translate --languages fr,de,ja
/scr:autopilot-translate --all-languages
/scr:autopilot-translate --languages ar --skip-publish
/scr:autopilot-translate --resume
```

---

## Instruction

### STEP 0: BOOTSTRAP (context-cost protocol)

Read `.manuscript/CONTEXT.md` first if it exists. If its `Updated` timestamp is newer than `.manuscript/STATE.md` and newer than the newest file in `.manuscript/drafts/body/`, use it as your orientation source for project title, work type, phase, current unit, recent activity, and open items. In STEP 1, skip the raw-file loads for those fields and only load files holding data CONTEXT.md does not surface (translation glossary, language manifest, target-language config).

If CONTEXT.md is missing, stale, or contradicts STATE.md, fall back to the original loads in STEP 1 unchanged. See `docs/context-protocol.md` for the contract.

---

### STEP 1: LOAD CONTEXT AND DETERMINE LANGUAGES

Load these project files:

- `.manuscript/config.json` -- for `target_languages`, `source_language`, title, author
- `.manuscript/OUTLINE.md` -- for unit count (needed by translate command)
- `.manuscript/STATE.md` -- for resume position (if `--resume`)
- Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) -- for command prerequisites

**Determine languages to process:**

1. If `--languages <lang1,lang2,...>` is provided: process only those languages (comma-separated ISO 639-1 codes)
2. If `--all-languages` is provided: process all languages listed in `config.json` `target_languages` array
3. If neither is provided: show the `target_languages` from config and ask the writer to confirm or select

**Validate languages:** Each language code must be a valid ISO 639-1 code. If any are invalid, warn and skip them.

---

### STEP 2: RTL AND CJK DETECTION

For each target language, auto-detect script direction and writing system:

```
RTL_LANGUAGES = ["ar", "he", "ur", "fa", "yi", "ps", "sd"]
CJK_LANGUAGES = ["zh", "ja", "ko"]
```

- RTL languages receive `--text-direction rtl` when passed to export commands
- CJK languages receive appropriate font and spacing flags
- All other languages default to LTR

Log the detection:
```
Language setup:
  fr (French) -- LTR
  ar (Arabic) -- RTL
  ja (Japanese) -- CJK
  he (Hebrew) -- RTL
```

---

### STEP 3: PIPELINE PER LANGUAGE (PARALLEL AGENTS)

Each language is independent and can conceptually run as a parallel agent. For each target language, execute the following 6-phase pipeline:

#### Phase 1: Glossary

Check if `.manuscript/translation/GLOSSARY-{lang}.md` exists:
- **If exists:** Skip with note: `"Glossary for {lang} already exists, skipping."`
- **If missing:** Run `/scr:translation-glossary --language {lang}` to create it

#### Phase 2: Translate

Run `/scr:translate --language {lang}` for all units in OUTLINE.md.

Track progress per unit:
```
[fr] Phase 2/6: Translating unit 5/12...
```

The translate command uses the fresh-context-per-unit pattern -- each unit gets its own context with STYLE-GUIDE.md, glossary, and translation memory loaded.

#### Phase 3: Translation Memory

After all units are translated, run `/scr:translation-memory --build --language {lang}` to capture segment-aligned pairs from the completed translation.

Log: `"[fr] Phase 3/6: Building translation memory... 847 segments captured."`

#### Phase 4: Cultural Adaptation (unless `--skip-adaptation`)

If `--skip-adaptation` is NOT set:
- Run `/scr:cultural-adaptation --language {lang}`
- Log flagged items count per severity:
  ```
  [fr] Phase 4/6: Cultural adaptation... 3 high, 7 medium, 12 low flags.
  ```

If `--skip-adaptation` IS set:
- Log: `"[fr] Phase 4/6: Cultural adaptation skipped (--skip-adaptation)."`

#### Phase 5: Back-Translate

Run `/scr:back-translate --language {lang}` for quality verification.

Log drift annotation counts:
```
[fr] Phase 5/6: Back-translation... 2 semantic shifts, 1 addition, 0 omissions.
```

#### Phase 6: Multi-Publish (unless `--skip-publish`)

If `--skip-publish` is NOT set:
- Determine text direction for this language (RTL/LTR/CJK from Step 2)
- Run `/scr:multi-publish --language {lang}` for all available export formats
- For RTL languages, pass `--text-direction rtl` to ensure correct PDF and EPUB output
- For CJK languages, pass `--cjk-mode` to enable CJK-specific line breaking and font handling

If `--skip-publish` IS set:
- Log: `"[fr] Phase 6/6: Multi-publish skipped (--skip-publish)."`

---

### STEP 4: PROGRESS TRACKING AND RESUME

**Progress tracking:**
- Update STATE.md after each phase completion per language
- Format: `autopilot-translate: {lang} phase {N}/6 complete`
- Show live progress: `"[ja] Phase 2/6: Translating unit 5/12..."`

**Resume support (`--resume`):**
- Read STATE.md for last completed phase per language
- Skip already-completed phases for each language
- Resume from the last incomplete phase/unit
- Example: If Arabic completed phases 1-3 and French completed 1-5, resume Arabic at phase 4 and French at phase 6

**Interruption handling:**
- If the process is interrupted, STATE.md contains enough information to resume
- On resume, output: `"Resuming: ar at phase 4 (cultural adaptation), fr at phase 6 (multi-publish)"`

---

### STEP 5: COMPLETION SUMMARY

After all languages complete their pipelines, show a comprehensive summary:

```
Autopilot Translate Complete
=============================
Source language: en (English)
Duration: ~15 minutes

Per Language:
  fr (French) -- LTR
    Units translated: 12
    Word count: ~45,000
    Glossary terms: 87
    TM segments: 847
    Cultural flags: 22 (3 high, 7 medium, 12 low)
    Drift annotations: 3
    Formats exported: PDF, EPUB, DOCX

  ar (Arabic) -- RTL
    Units translated: 12
    Word count: ~42,000
    Glossary terms: 91
    TM segments: 812
    Cultural flags: 34 (8 high, 14 medium, 12 low)
    Drift annotations: 7
    Formats exported: PDF (RTL), EPUB (RTL), DOCX

  ja (Japanese) -- CJK
    Units translated: 12
    Word count: ~38,000
    Glossary terms: 103
    TM segments: 923
    Cultural flags: 41 (5 high, 18 medium, 18 low)
    Drift annotations: 5
    Formats exported: PDF (CJK), EPUB (CJK), DOCX

Overall:
  Languages: 3
  Total words translated: ~125,000
  Total files exported: 9

Errors:
  (none)

Next Steps:
  1. Review cultural adaptation flags (especially high-severity items)
  2. Review back-translation drift reports for each language
  3. Check exported files in .manuscript/translation/{lang}/output/
```

---

## Anti-patterns

- **NEVER** skip the glossary phase -- term consistency across the manuscript depends on it
- **NEVER** run cultural adaptation before translation is complete for that language
- **NEVER** export RTL languages without setting `--text-direction rtl` -- the PDF and EPUB will be unreadable
- **NEVER** continue past a blocking error without logging it -- all errors must appear in the completion summary
- **NEVER** modify the source manuscript -- translation works on copies in `.manuscript/translation/{lang}/`

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
