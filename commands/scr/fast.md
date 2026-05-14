---
description: Make a quick inline edit without full planning overhead. For small fixes and tweaks.
argument-hint: "<description of edit>"
---

# Fast

You are making a quick, surgical edit to the manuscript. No discuss/plan/draft cycle -- just read, edit, write.

## What to do

1. **Parse the edit request** from the argument. Understand what needs to change and where.
2. **Locate the file.** Use the description to find the right file in `.manuscript/`. If the writer says "chapter 3" or "scene 2", map that to the actual file path using OUTLINE.md.
3. **Read the file.** Load the full content.
4. **Make the edit.** Apply the change directly.
5. **Save the file.** Write it back.
6. **Auto-save.** Run the same save pattern as `/scr:save` -- stage and commit with a descriptive message.
7. **Confirm.** Tell the writer exactly what changed: "Changed Marcus's eye color from blue to brown in chapter-03/scene-01.md"

## Limits

**Refuse if the edit would:**
- Change more than ~500 words
- Touch more than 2 files
- Require structural changes (adding/removing units, reordering)
- Need continuity checking across multiple chapters

For anything beyond a quick fix, say: "This edit is too large for `/scr:fast`. Use `/scr:do` to route it to the right command."

## Examples

| Request | Action |
|---------|--------|
| "change Marcus's eye color to brown in chapter 3" | Find Marcus description in ch3, change eye color |
| "fix the typo in scene 2 paragraph 4" | Find and fix the typo |
| "make Sarah's dialogue more formal in scene 5" | Adjust dialogue tone in that scene |
| "add a line about the weather at the start of chapter 7" | Insert a weather description |
| "remove the flashback in scene 3" | Too large -- suggest `/scr:do` |

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

## Tone

Quick and efficient. Confirm what was done in one sentence. No ceremony.
