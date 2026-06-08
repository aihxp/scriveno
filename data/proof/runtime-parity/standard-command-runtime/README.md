# Standard Command Runtime Host Capture

Status: queued.

Evidence level: host-capture-ready.

This directory is reserved for a real host-runtime transcript from one standard command-directory runtime, such as Cursor, Gemini CLI, OpenCode, GitHub Copilot, Windsurf, or Antigravity. It is not marked verified until `TRANSCRIPT.md` or an equivalent screenshot artifact is committed from an actual host run that follows [HOST-CAPTURE-PROTOCOL.md](../HOST-CAPTURE-PROTOCOL.md).

Required command shape:

```text
/scr:first-run
/scr:demo
/scr:next
/scr:draft 5
/scr:editor-review 5
/scr:save
```

Minimum result:

- The host recognizes the installed `/scr:*` commands.
- The demo path reaches the planned fifth unit.
- The next command points at drafting or reviewing the expected unit.
- The save step produces a checkpoint or states why local save is unavailable.
- The transcript states whether native agent spawning, prompt-run fallback, or no worker ran.
