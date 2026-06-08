# Procedure 1 Draft: Restore Service After A Failed Deploy

## When To Use This Procedure

Use this procedure when a deployment has failed and the service may be degraded. Do not use it for routine deploy retries or planned rollbacks.

## Inputs

- Deployment identifier
- Environment name
- Current service health signal
- Link to the incident or change ticket
- Approved rollback artifact, if rollback is required

## Steps

1. Pause deploy activity.

   Stop new deploy attempts for the affected environment. If another operator is already responding, join their thread instead of starting a parallel recovery path.

2. Check current service health.

   Compare the current health signal with the last known good state. Record whether users are affected, whether error rate changed, and whether the service is still accepting normal traffic. If the project has no loaded metric names, write only the observed status and leave the exact metric label blank.

3. Inspect the failed deployment record.

   Review the deployment identifier and note the failure point. Capture the failed step, the artifact or revision involved, and the first visible error. Do not infer root cause from the first error unless the source system states it.

4. Decide whether rollback is needed.

   Roll back only when service health is degraded, validation fails, or the release owner has approved rollback. If service health is normal and the failed deploy did not reach serving traffic, keep the current version in place and continue investigation.

5. Run the rollback, if required.

   Use the approved rollback artifact for the affected environment. Do not roll back to an unverified artifact. Keep the incident or change ticket updated before and after the action.

6. Validate stabilization.

   Recheck service health after the pause or rollback. Confirm that the user-facing signal has returned to the expected state or that degradation is no longer increasing. If validation fails, escalate to the service owner or incident lead with the deployment identifier, observed health state, and action already taken.

7. Leave the handoff.

   Record the final status, whether rollback happened, the artifact now serving, the validation result, and the unresolved question that remains for follow-up.

## Exit Criteria

- Further deploy activity is paused or explicitly resumed.
- Service health has been checked against the last known good state.
- Rollback, if used, came from an approved artifact.
- Validation has been recorded.
- The next owner can continue without reconstructing the response.

## Next Command

```text
/scr:editor-review 1
```
