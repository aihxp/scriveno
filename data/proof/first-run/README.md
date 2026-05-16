# First-Run Proof

This bundle is the committed proof artifact for Scriveno's first 10 minutes. It pairs the executable `/scr:first-run` command with the terminal-level checks and demo commands a new writer can run.

## What It Proves

- Scriveno has a runtime command for first-run orientation, not only a documentation page.
- The first-run path stays small: check surfaces, create the demo, inspect proof files, draft unit 5, review unit 5.
- The command shapes are explicit for Claude Code, standard slash-command runtimes, and Codex.
- The demo path uses shipped files in `data/demo/.manuscript/`.

## Transcript: First-Run Guide

```text
> scriveno first-run --project .
Scriveno first-run guide
Project: .
Current recommendation: /scr:new-work

Runtime command shapes:
- Claude Code: /scr-first-run, /scr-demo, /scr-next
- Standard slash-command runtimes: /scr:first-run, /scr:demo, /scr:next
- Codex: $scr-first-run, $scr-demo, $scr-next

Recommended first path:
1. /scr:demo
2. cd scriveno-demo
3. /scr:next
4. /scr:draft 5
5. /scr:editor-review 5

Proof artifacts:
- docs/quick-proof.md
- docs/starter-sets.md
- data/proof/watchmaker-flow/README.md
- data/proof/voice-dna/README.md
- data/proof/runtime-parity/README.md
```

## Transcript: Runtime Smoke

```text
> scriveno smoke --json
{
  "ok": true,
  "expectedCommands": 113,
  "expectedAgents": [
    "continuity-checker",
    "drafter",
    "plan-checker",
    "researcher",
    "translator",
    "voice-checker"
  ],
  "runtimes": [
    { "runtime": "claude-code", "ok": true },
    { "runtime": "codex", "ok": true },
    { "runtime": "cursor", "ok": true },
    { "runtime": "gemini-cli", "ok": true },
    { "runtime": "opencode", "ok": true },
    { "runtime": "copilot", "ok": true },
    { "runtime": "windsurf", "ok": true },
    { "runtime": "antigravity", "ok": true },
    { "runtime": "manus", "ok": true },
    { "runtime": "perplexity-desktop", "ok": true },
    { "runtime": "generic", "ok": true }
  ]
}
```

## Transcript: Demo Flow

```text
> /scr:demo
Demo project created at ./scriveno-demo/

> cd scriveno-demo

> /scr:next
Unit 5 has a plan but no draft yet, so /scr:draft 5 is the next best move.

> /scr:draft 5
Loaded STYLE-GUIDE.md and .manuscript/plans/5-the-reunion-PLAN.md.
Drafted unit 5 in the established watchmaker voice.

> /scr:editor-review 5
Reviewed unit 5 for voice, continuity, emotional payoff, and revision needs.
```

## Related Files

- [docs/quick-proof.md](../../../docs/quick-proof.md)
- [docs/starter-sets.md](../../../docs/starter-sets.md)
- [data/demo/.manuscript/plans/5-the-reunion-PLAN.md](../../demo/.manuscript/plans/5-the-reunion-PLAN.md)
- [data/proof/watchmaker-flow/README.md](../watchmaker-flow/README.md)
- [data/proof/voice-dna/README.md](../voice-dna/README.md)
