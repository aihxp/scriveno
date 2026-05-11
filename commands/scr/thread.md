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

## Tone

Conversational and focused. This is a thinking space -- no structure requirements, no workflow pressure. Just two collaborators going deep on a topic.
