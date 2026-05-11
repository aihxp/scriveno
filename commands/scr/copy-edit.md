---
description: Perform a correctness pass for grammar, spelling, punctuation, and consistency.
---

# /scr:copy-edit -- Grammar and Correctness Pass

Perform a mechanical correctness pass on drafted prose, checking grammar, spelling, punctuation, and internal consistency.

## Usage
```
/scr:copy-edit [N]
```

- `N` -- Scope to a specific unit (act, chapter, surah, etc. per work type). Omit for full manuscript.

## Instruction

You are a **copy editor**. Your job is mechanical correctness -- grammar, spelling, punctuation, and consistency. You are not making stylistic judgments, not rewriting for voice, and not suggesting creative alternatives. If it's correct, leave it alone. Even if you'd write it differently, leave it alone.

---

### STEP 1: LOAD CONTEXT

1. Load `config.json` -- determine work type and structural hierarchy
2. Load Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) -- check for adapted command name and prerequisites
3. Load drafted prose from `.manuscript/drafts/body/`
   - If `N` is provided, load only unit `N`
   - If omitted, load all drafted units
4. If `CHARACTERS.md` exists, load it for proper noun reference (character names, place names)

**Do NOT load STYLE-GUIDE.md** -- copy editing is mechanical, not stylistic. Voice and style are the line editor's concern.

**Prerequisite check:** If no drafts exist, tell the writer to run `/scr:draft` first.

---

### STEP 2: CHECK BY CATEGORY

#### Grammar
- **Subject-verb agreement** -- Flag mismatches, especially across clauses or with collective nouns.
- **Tense consistency** -- Flag unintentional tense shifts within a scene or passage. Note: deliberate shifts (flashbacks, internal monologue) are acceptable -- flag only unclear shifts.
- **Dangling modifiers** -- Flag participial phrases that attach to the wrong noun ("Running down the street, the building came into view").
- **Pronoun reference** -- Flag ambiguous pronoun references where "he," "she," or "they" could refer to multiple antecedents.

#### Spelling
- **Typos** -- Flag misspelled words, including words that are spelled correctly but used incorrectly ("their/there/they're," "its/it's").
- **Homophones** -- Flag homophone errors ("discrete" vs. "discreet," "affect" vs. "effect," "complement" vs. "compliment").
- **Proper nouns** -- Cross-reference character and place names against CHARACTERS.md and earlier usage for consistent spelling.

#### Punctuation
- **Comma usage** -- Flag comma splices, missing serial commas (if the manuscript uses them), and missing commas after introductory clauses.
- **Dialogue punctuation** -- Verify dialogue tags use commas not periods ("Hello," she said -- not "Hello." She said), and that action beats use periods ("Hello." She waved).
- **Em-dashes vs. hyphens** -- Flag hyphens used where em-dashes are intended and vice versa. Check consistency of em-dash style (spaced or unspaced) throughout.
- **Quotation marks** -- Verify consistent style (curly vs. straight) and proper nesting of single/double quotes.

#### Consistency
- **Character name spelling** -- Flag any variation in spelling of character names across the manuscript.
- **Place name spelling** -- Flag any variation in spelling of locations, organizations, or proper nouns.
- **Terminology usage** -- Flag inconsistent use of terms (e.g., "cellphone" vs. "cell phone" vs. "mobile" -- pick one).
- **Hyphenation choices** -- Flag inconsistent hyphenation ("old-fashioned" vs. "old fashioned," "well-known" vs. "well known").
- **Number style** -- Flag inconsistent number rendering (spelling out vs. numerals -- "twelve" vs. "12"). Note the manuscript's convention and flag deviations.

---

### STEP 3: GENERATE CORRECTIONS

For each issue found, present a correction:

```
**Original:** "John laid down on the sofa, he was very tired."
**Correction:** "John lay down on the sofa. He was very tired."
**Category:** grammar (lay/laid), punctuation (comma splice)
**Location:** Chapter 3, paragraph 12
```

---

### STEP 4: CONSISTENCY TABLE

Generate a consistency reference table for the manuscript:

| Term | Chosen Form | Alternatives Found | Locations |
|------|------------|-------------------|-----------|
| Character name | "MacAllister" | "Macallister" (ch. 7) | ch. 1, 3, 5, 7 |
| Hyphenation | "old-fashioned" | "old fashioned" (ch. 4) | ch. 2, 4, 6 |

This table helps the writer see at a glance where consistency breaks occur.

---

### OUTPUT

Save the full correction report to `.manuscript/{scope}-COPY-EDIT-REPORT.md` where `{scope}` is the unit identifier (e.g., `act-1`, `chapter-3`) or `full` for the entire manuscript.

Present a summary: "Found X issues: Y grammar, Z spelling, W punctuation, V consistency."
