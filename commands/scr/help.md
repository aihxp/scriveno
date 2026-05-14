---
description: Show Scriveno commands grouped by workflow stage, filtered to what's relevant for your current work
argument-hint: "[category or search term, optional]"
---

# Scriveno help

You are helping the user navigate Scriveno commands. Load Scriveno's installed/shared `CONSTRAINTS.json` (global `~/.scriveno/data/CONSTRAINTS.json` or project `.scriveno/data/CONSTRAINTS.json`) to see every command and its availability.

## What to do

1. **Check for a `.manuscript/` directory in the current project.**
   - If it exists, read `.manuscript/config.json` to get the work type and developer_mode setting
   - If it doesn't exist, show the "getting started" view

2. **Load CONSTRAINTS.json** and filter commands by the current work type's group plus any command-level constraints.
   - A command is only menu-eligible when its `available` list includes the current group (or `"all"`) **and** any narrower gate passes.
   - Apply explicit constraints such as `nonfiction_only` and `comic_only` before you show the command.
   - If a group has a dedicated replacement command family (for example sacred chronology and doctrinal checks), prefer that real surface over any conceptual adapted label on a hidden base command.

3. **If the user passed an argument**, treat it as a category filter or search term. Otherwise show the full grouped view.

## The "getting started" view (no project yet)

Ask the user what they want to do. Don't list 170 commands -- show them this:

```
Scriveno -- ready to start.

What do you want to do?
  /scr:new-work        Start a new project (novel, runbook, screenplay, paper, etc.)
  /scr:demo            Explore a pre-built sample project first
  /scr:import <file>   Bring in an existing manuscript
  /scr:profile-writer  Set up your writer profile

Already have a project? Just cd into it and run /scr:next.
```

## The "active project" view

Show commands relevant to the current stage. Use `.manuscript/STATE.md` to figure out where the user is.

Group by stage:
- **Create** -- new-work, profile-writer, series-bible
- **Write** -- discuss, plan, draft, quick-write, plus any profile-building commands actually available for the current work type
- **Revise** -- editor-review, subject-touch, line-edit, copy-edit, continuity-check, beta-reader, voice-check
- **Publish** -- front-matter, back-matter, blurb, cover-art, publish, export
- **Collaborate** -- track
  Present `/scr:track` as the entrypoint for revision-track workflows, and describe its subcommands in prose: create, list, switch, compare, merge, propose.
- **Versions** -- save, history, versions, compare, undo
- **Navigate** -- next, progress, pause-work, resume-work

Revision tracks are a writer-facing workflow, not a developer-only one. Always surface `/scr:track` when it is otherwise available for the current project, and explain that comparison and merge actions live under its subcommands. Do not invent top-level commands like `/scr:merge` for collaboration, and do not confuse `/scr:compare` (save-to-save history comparison) with `/scr:track compare` (revision-track comparison). `developer_mode` only changes whether you expose extra technical detail such as hashes, branch names, or raw git output -- it does not hide the collaboration workflow itself.

When useful, describe Scriveno's creative-context model in one sentence: Scriveno tracks what moves, including characters, ideas, reader understanding, objects, places, procedures, doctrines, evidence, and themes. Keep this as orientation, not a lecture.

Only show commands where `available` includes the current work type's group, OR where it's `"all"`, **and** any narrower command-level constraints still pass for the specific work type. For example, `book-proposal` is still hidden for fiction prose because `nonfiction_only` narrows the broad prose/sacred availability, and `panel-layout` is hidden for non-comic visual projects because `comic_only` narrows the visual group. Show canonical runnable command names, and use adapted labels as descriptive text only when the base command is actually available -- sacred review surfaces may show `/scr:editor-review` as scholarly review, and technical docs may show `/scr:plot-graph` as procedure map, but hidden commands stay hidden even if CONSTRAINTS.json stores an adapted label.

## The filtered view

If the argument matches a category name (e.g., "revise", "publish"), show just that category. If it's a free-text search, match against command names and descriptions.

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

Scannable. No narration, no memory-system lectures. A writer checking help wants a menu, not an essay.

If the user seems stuck, always suggest `/scr:next` -- it always knows what to do.
