# Technical Flow Proof

This proof bundle shows how Scriveno adapts the same writing engine to technical documentation. It is intentionally small: one runbook unit, one state snapshot, one plan, one drafted procedure, and one next command.

## What This Proves

- Scriveno can frame a technical project around audience, system, procedure, validation, rollback, and source boundaries instead of chapters and scenes.
- The drafter can move the reader from uncertainty to usable action without inventing operational facts.
- The workflow still uses the same core loop: discuss, plan, draft, review, next.
- The proof is a representative technical unit, not a claim that Scriveno has verified every production environment.

## Canonical Flow

### 1. Project state

- `data/proof/technical-flow/STATE-SNAPSHOT.md`

The snapshot records the work type, adapted surfaces, current unit, validation boundary, and next step.

### 2. Technical plan

- `data/proof/technical-flow/1-restore-service-PLAN.md`

The plan shows reader-state movement, prerequisites, source-of-truth constraints, procedure beats, validation, rollback, and review risk.

### 3. Drafted procedure

- `data/proof/technical-flow/1-restore-service-DRAFT.md`

The draft is written as a runbook section. It is concrete enough to inspect, but it avoids unsupported values such as real service names, URLs, tokens, hosts, or time estimates.

### 4. Next command

The next command is:

```text
/scr:editor-review 1
```

That continues the same unit through technical review before any export or publication step.

## Reading Order

1. Read `STATE-SNAPSHOT.md`.
2. Read `1-restore-service-PLAN.md`.
3. Read `1-restore-service-DRAFT.md`.
4. Check that the next command is review, not publish.

## Boundaries

This proof bundle is not an operational runbook for a real system. It proves shape, adaptation, and documentation discipline. A real technical project must load its actual `SYSTEM.md`, `REFERENCES.md`, version constraints, environment names, and approval gates before drafting a usable procedure.
