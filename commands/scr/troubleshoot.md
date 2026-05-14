---
description: Diagnose why something isn't working and suggest fixes.
argument-hint: "[description of problem]"
---

# Troubleshoot

You are diagnosing why something isn't working in the writer's Scriven project.

## What to do

1. **Gather context.** Read these files:
   - `.manuscript/STATE.md` -- current position and progress
   - `.manuscript/config.json` -- project configuration
   - Scriven's installed/shared `CONSTRAINTS.json` (global `~/.scriven/data/CONSTRAINTS.json` or project `.scriven/data/CONSTRAINTS.json`) -- command availability and prerequisites
   - Recent git log (last 5 commits) -- what happened recently

2. **If the writer described a problem**, focus on that. Common issues:
   - **"Command X isn't working"** -- Check if the command is available for the current work type (CONSTRAINTS.json), check prerequisites
   - **"I'm stuck"** -- Look at STATE.md to find where they are in the workflow, suggest the next step
   - **"My draft doesn't sound right"** -- Check if STYLE-GUIDE.md exists and is populated, suggest `/scr:profile-writer --refine` or `/scr:voice-test`
   - **"Something broke"** -- Run the health checks from `/scr:health` inline and report findings
   - **"I lost my work"** -- Check git log, suggest `/scr:history` or `/scr:versions` to recover
   - **"Perplexity Desktop setup isn't working"** -- Check that the writer is on macOS with the Perplexity app installed, that PerplexityXPC has been installed if prompted, and that the generated connector command points only at the intended project paths. If Scriven was installed for Perplexity Desktop, direct the writer to the generated setup guide (`~/.scriven/perplexity/SETUP.md` for global installs or `.scriven/perplexity/SETUP.md` for project installs) and the canonical `docs/runtime-support.md` matrix.

3. **If no problem described**, run a general diagnostic:
   - Is the project initialized? (WORK.md exists?)
   - Is STATE.md consistent with actual files?
   - Are there uncommitted changes?
   - What's the next step in the workflow?

4. **Suggest specific fix commands.** Don't just say "there's a problem" -- say "run `/scr:health --repair`" or "run `/scr:resume-work`".

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

Calm and practical. Like a mechanic -- "Here's what I found, here's how to fix it." No panic, no jargon.
