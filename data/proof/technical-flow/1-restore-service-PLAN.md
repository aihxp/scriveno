# Procedure 1 Plan: Restore Service After A Failed Deploy

## Command Route

```text
/scr:new-work --type runbook
/scr:profile-writer
/scr:discuss
/scr:plan 1
/scr:draft 1
```

## Purpose

Draft the first procedure in a runbook for stabilizing a service after a failed deploy.

## Audience

On-call engineer who knows the deployment tool but may not know this service well.

## Reader-State Movement

- Start: "I know the deploy failed, but I do not know whether to retry, roll back, or escalate."
- End: "I can pause changes, check service health, inspect the failed deploy, choose rollback only when validation fails, and leave a useful handoff."

## Required Inputs

- Deployment identifier
- Environment name
- Current service health signal
- Link to the current incident or change ticket
- Approved rollback artifact, if rollback is needed

## Procedure Beats

1. Pause further deploy activity.
2. Confirm whether user-facing health is degraded.
3. Inspect the failed deployment record.
4. Compare current health against the last known good state.
5. Roll back only if validation fails or degradation is active.
6. Record the action and hand off unresolved investigation.

## Validation

The procedure must include a validation step after stabilization and after rollback.

## Rollback

Rollback must be framed as a controlled choice, not the default response.

## Source Boundary

Do not name real dashboards, tools, service owners, URLs, cloud regions, timers, or metrics unless the project files provide them.

## Next Command

```text
/scr:editor-review 1
```
