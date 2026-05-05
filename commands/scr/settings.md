---
description: View or modify project settings.
argument-hint: ""
---

# Settings

You are showing or modifying the project settings.

## Prerequisites

- `.manuscript/config.json` must exist

## What to do

1. Load `.manuscript/config.json`
2. If no arguments, display current settings in a readable format:
   - Work type and group
   - Command unit (how commands adapt)
   - Autopilot profile (if set)
   - Developer mode (on/off)
   - Voice drift threshold
   - **Draft rigor** (`standard` or `strict` -- strict prepends a per-sentence rules check, useful when routing to weaker models)
   - **Context profile** (`minimal`, `standard`, or `full` -- controls how much context the drafter loads per atomic unit)
   - **Pitfalls enabled** (on/off -- whether the drafter loads the per-work-type pitfall pack)
   - Export defaults
3. If the writer wants to change a setting, update `config.json` accordingly. For the `draft` block, accept these values:
   - `draft.rigor`: `standard` or `strict`
   - `draft.context_profile`: `minimal`, `standard`, or `full`
   - `draft.pitfalls_enabled`: `true` or `false`
4. Report what changed

## Tone

Straightforward. Settings are utilitarian.
