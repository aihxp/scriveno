# Quick Proof

This is the shortest proof-first path through Scriveno. It is meant for a fresh user who wants to see real shipped artifacts, a demo manuscript, runtime expectations, and the first practical commands before reading the full manual. If your runtime supports Scriveno commands, the executable version of this page is `/scr:first-run`.

## What This Proves

- Scriveno ships inspectable proof bundles, not only feature claims.
- Scriveno ships `/scr:first-run` and `scriveno first-run --project .` as guided first-run surfaces.
- The watchmaker demo includes real manuscript state, drafts, review notes, and a planned next unit.
- Voice DNA changes output on the same brief, with guided and unguided samples side by side.
- Runtime behavior is explicit: Claude Code is the primary reference runtime, Codex uses generated `$scr-*` skills, standard slash-command targets use `/scr:*`, and guided targets document their local setup path.
- The public CLI can audit installed surfaces with `scriveno smoke --json`.

## 10-Minute Route

### 1. Install

```bash
npx scriveno@latest
```

For a source checkout while developing Scriveno itself:

```bash
node bin/install.js --runtimes claude-code,cursor,gemini-cli,codex,opencode,copilot,windsurf,antigravity,manus,perplexity-desktop,generic --global --developer --silent
```

### 2. Check The Installed Surface

```bash
scriveno first-run --project .
scriveno status --project .
scriveno smoke --json
scriveno agents --json
scriveno routes --json
```

Expected result: the commands report the recommended first path, installed surfaces, agent prompt availability, route lanes, and any manual gates. They do not mutate manuscript files.

### 3. Open The Demo

Claude Code:

```text
/scr-first-run
/scr-demo
```

Standard slash-command runtimes:

```text
/scr:first-run
/scr:demo
```

Codex:

```text
$scr-first-run
$scr-demo
```

Then inspect the shipped files:

- [data/demo/.manuscript/WORK.md](../data/demo/.manuscript/WORK.md)
- [data/demo/.manuscript/STYLE-GUIDE.md](../data/demo/.manuscript/STYLE-GUIDE.md)
- [data/demo/.manuscript/STATE.md](../data/demo/.manuscript/STATE.md)
- [data/demo/.manuscript/drafts/body/1-the-letter-DRAFT.md](../data/demo/.manuscript/drafts/body/1-the-letter-DRAFT.md)
- [data/demo/.manuscript/drafts/body/2-the-workshop-DRAFT.md](../data/demo/.manuscript/drafts/body/2-the-workshop-DRAFT.md)
- [data/demo/.manuscript/reviews/2-the-workshop-REVIEW.md](../data/demo/.manuscript/reviews/2-the-workshop-REVIEW.md)
- [data/demo/.manuscript/plans/5-the-reunion-PLAN.md](../data/demo/.manuscript/plans/5-the-reunion-PLAN.md)

### 4. Read The Proof Bundle

Start here:

- [data/proof/watchmaker-flow/README.md](../data/proof/watchmaker-flow/README.md)
- [data/proof/voice-dna/README.md](../data/proof/voice-dna/README.md)
- [data/proof/creative-context/README.md](../data/proof/creative-context/README.md)
- [data/proof/first-run/README.md](../data/proof/first-run/README.md)
- [data/proof/runtime-parity/README.md](../data/proof/runtime-parity/README.md)

The fastest comparison is the Voice DNA pair:

- [data/proof/voice-dna/UNGUIDED-SAMPLE.md](../data/proof/voice-dna/UNGUIDED-SAMPLE.md)
- [data/proof/voice-dna/GUIDED-SAMPLE.md](../data/proof/voice-dna/GUIDED-SAMPLE.md)

### 5. Ask For The Next Unit

The demo includes a planned but undrafted fifth unit. Use the command shape for your host:

Claude Code:

```text
/scr-draft 5
/scr-editor-review 5
```

Standard slash-command runtimes:

```text
/scr:draft 5
/scr:editor-review 5
```

Codex:

```text
$scr-draft 5
$scr-editor-review 5
```

### 6. Ask Scriveno What To Do Next

Claude Code:

```text
/scr-next
```

Standard slash-command runtimes:

```text
/scr:next
```

Codex:

```text
$scr-next
```

Terminal:

```bash
scriveno status --project .
```

## Example Transcript

These transcript blocks show the expected shape, not a promise that every host prints identical phrasing.

```text
> /scr-demo
Created the watchmaker demo project.
Next: inspect STYLE-GUIDE.md, read the first draft, then run /scr-next.
```

```text
> scriveno status --project .
Recommended next command: /scr:next
Candidate agents: drafter, voice-checker
Candidate local helpers: scan, save
Manual gates: writer approval before publishing or overwriting exports
```

```text
> scriveno first-run --project .
Scriveno first-run guide
Current recommendation: /scr:new-work
Recommended first path:
1. /scr:demo
2. cd scriveno-demo
3. /scr:next
4. /scr:draft 5
5. /scr:editor-review 5
```

```text
> /scr:draft 5
Loaded STYLE-GUIDE.md and the plan for unit 5.
Drafted the next atomic unit in fresh context.
Next: /scr:editor-review 5
```

## Runtime Expectations

Use [Runtime Support](runtime-support.md) as the canonical matrix. The short version:

- Claude Code is the primary reference runtime.
- Codex installs generated `$scr-*` skills, mirrored commands, agent prompts, and `.toml` agent metadata.
- Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, and Antigravity install command directories plus agent prompts.
- Manus Desktop and the generic fallback install bundled skill manifests.
- Perplexity Desktop is a guided local-MCP setup target, not a writable command runtime.

No runtime claim here should be read as host-runtime parity proof. The repo proves install surfaces and package artifacts; host parity still needs per-host verification.

## Where To Go Next

- [Starter Sets](starter-sets.md) for small command paths by writing goal
- [data/proof/first-run/README.md](../data/proof/first-run/README.md) for committed first-run transcripts
- [data/proof/runtime-parity/README.md](../data/proof/runtime-parity/README.md) for runtime parity evidence
- [Getting Started](getting-started.md) for the complete first-project walkthrough
- [Proof Artifacts](proof-artifacts.md) for the proof hub
- [Runtime Support](runtime-support.md) for installation and support levels
