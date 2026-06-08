# Technical Flow State Snapshot

Work type: `runbook`

Group: `technical`

Command unit: `procedure`

Current unit: `1`

Project surfaces:

- `DOC-BRIEF.md`: required
- `AUDIENCE.md`: required
- `SYSTEM.md`: required
- `PROCEDURES.md`: required
- `REFERENCES.md`: required
- `PLACES.md`: optional when environment location matters
- `DEPENDENCIES.md`: derived after enough system relationships exist
- `GEOGRAPHY.md`: derived only if confirmed places affect the work

Reader state:

- Starts unsure how to respond to a failed deploy.
- Ends able to stabilize the service, verify health, and choose rollback only when validation fails.

Validation boundary:

- Do not invent service names, endpoint URLs, credentials, owners, ticket queues, cloud regions, or time targets.
- Use placeholders only where the real project would load `SYSTEM.md` or `REFERENCES.md`.

Next command:

```text
/scr:editor-review 1
```
