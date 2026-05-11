---
description: "Show verse numbering format for the active sacred tradition."
argument-hint: "[--example <text>]"
---

# /scr:sacred-verse-numbering -- Tradition Verse Numbering Reference

Show the verse numbering format for the active sacred tradition. Reads the tradition profile from the project's config and displays the numbering system with example citations.

## Usage

```
/scr:sacred-verse-numbering [--example <text>]
```

If `--example <text>` is provided, format the given text as a citation in the tradition's numbering system.

---

### STEP 1: LOAD TRADITION

Read `tradition:` from `.manuscript/config.json`.

If `tradition:` is absent or null:
> **No tradition set.** Add `"tradition": "<slug>"` to `.manuscript/config.json` to use this command. Valid traditions: `catholic`, `orthodox`, `tewahedo`, `protestant`, `jewish`, `islamic-hafs`, `islamic-warsh`, `pali`, `tibetan`, `sanskrit`.

Then **stop**.

Validate the tradition slug against the accepted list:
`catholic`, `orthodox`, `tewahedo`, `protestant`, `jewish`, `islamic-hafs`, `islamic-warsh`, `pali`, `tibetan`, `sanskrit`

If the value is not in this list:
> **Unknown tradition "{tradition}".** Valid values: `catholic`, `orthodox`, `tewahedo`, `protestant`, `jewish`, `islamic-hafs`, `islamic-warsh`, `pali`, `tibetan`, `sanskrit`.

Then **stop**.

Load `templates/sacred/{tradition}/manifest.yaml`.

---

### STEP 2: DISPLAY NUMBERING FORMAT

From the loaded manifest, read:
- `label` — the tradition's human name
- `numbering.format` — the citation format (e.g. `chapter:verse`, `surah:ayah`, `nikaya:sutta`)
- `numbering.separator` — the separator character (e.g. `:` or `.`)

Display the numbering reference:

```
Tradition: {label}
Format:    {numbering.format}
Separator: {numbering.separator}
```

Then provide 3 example citations using the tradition's format:

| Tradition | Example 1 | Example 2 | Example 3 |
|-----------|-----------|-----------|-----------|

Use the following tradition-specific examples:

- **catholic / orthodox / protestant / tewahedo**: `Genesis 1:1`, `Psalms 23:1`, `John 3:16`
- **jewish**: `Genesis 1:1`, `Psalms 23:1`, `Isaiah 53:5`
- **islamic-hafs / islamic-warsh**: `1:1` (Al-Fatihah:1), `2:255` (Al-Baqarah:255, the Throne Verse), `112:1` (Al-Ikhlas:1)
- **pali**: `DN.1.1` (Digha Nikaya, Sutta 1, section 1), `MN.22.1`, `SN.35.1`
- **tibetan**: `1:1`, `2:3`, `5:12`
- **sanskrit**: `1:1`, `2:47`, `18:66`

If `--example <text>` was provided, also display:
> **Your citation formatted:** {text formatted as a citation in this tradition's style, e.g. inserting the separator between parts if the text contains numbers}

---

### STEP 3: APPROVAL BLOCK REMINDER (CONDITIONAL)

If `approval_block.required` is `true` in the loaded manifest:
> **Reminder:** This tradition requires a {approval_block.label} before publication. Run `/scr:front-matter` to generate the approval block scaffold.

If `approval_block.required` is `false`: skip this step silently.
