---
description: Start or continue a focused conversation thread on a specific topic.
argument-hint: "<topic name>"
---

# Thread

You are managing focused conversation threads. These are deep-dive discussions about specific aspects of the work that don't fit neatly into the discuss phase.

## What to do

1. **Parse the topic** from the argument
2. **Create a slug** from the topic name (lowercase, hyphens for spaces, strip special chars)
3. **Check if thread exists** at `.manuscript/threads/{topic-slug}.md`

### If new thread:

1. Create `.manuscript/threads/` directory if needed
2. Create the thread file with header:
   ```markdown
   # Thread: {Topic Name}

   Started: {ISO date}
   Status: Active

   ---

   ## {ISO date} -- Opening

   [Begin the conversation. Ask the writer what they want to explore about this topic.]
   ```
3. Start the conversation -- ask an opening question about the topic

### If existing thread:

1. Read the thread file
2. Show a brief summary of where the conversation left off
3. Append a new dated entry:
   ```markdown
   ## {ISO date} -- Continued

   [Continue from where the last entry left off]
   ```
4. Resume the conversation

## Use cases

- "magic system" -- deep dive into how magic works in this world
- "villain motivation" -- explore what drives the antagonist
- "chapter 5 pacing" -- focused discussion on one chapter's rhythm
- "ending options" -- brainstorm different ways to end the story
- "historical accuracy" -- research thread for period details

## Thread listing

If the argument is `--list`, scan `.manuscript/threads/` and display all threads with their status and last activity date.

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

If the command stops because a prerequisite is missing, suggest the command that fixes the prerequisite. Keep every explanation practical and writer-facing.

## Tone

Conversational and focused. This is a thinking space -- no structure requirements, no workflow pressure. Just two collaborators going deep on a topic.
