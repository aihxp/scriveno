# Testing

Scriven uses Node’s built-in test runner to lock the shipped command, docs, installer, and package surfaces against regression.

## Test runner

The root `package.json` defines:

```json
"scripts": {
  "test": "node --test test/*.test.js",
  "pack:check": "npm pack --dry-run",
  "release:check": "npm test && npm run pack:check",
  "prepublishOnly": "npm run release:check"
}
```

That means:

- `npm test` runs the whole test suite
- `npm run pack:check` verifies the package contents that would ship
- `npm run release:check` runs both test and package checks
- publishing is guarded by `release:check` through `prepublishOnly`

## Run the suite

Full run:

```bash
npm test
```

Direct Node invocation:

```bash
node --test test/*.test.js
```

Target one or two files while iterating:

```bash
node --test test/package.test.js test/constraints.test.js
```

## What is covered

The `test/` directory currently includes coverage for:

- package metadata and npm packaging behavior
- command inventory and constraints integrity
- installer behavior and runtime-target setup
- demo and baseline product surfaces
- milestone-specific trust, publishing, translation, illustration, and collaboration regressions

Representative files:

- `test/package.test.js`
- `test/constraints.test.js`
- `test/installer.test.js`
- `test/commands.test.js`
- `test/phase13-launch-surface-integrity.test.js`
- `test/phase14-runtime-credibility.test.js`
- `test/phase18-technical-writing-domain-modeling.test.js`
- `test/phase19-verification-trust-surface-updates.test.js`

## High-signal test categories

### Package and release safety

Use these when changing package metadata, release docs, or shipped-file expectations:

- `test/package.test.js`
- `npm run release:check`

These catch drift around Node baseline, packed files, and release-facing package claims.

### Constraints and command inventory

Use these when changing command registration, work-type counts, or adaptive terminology:

- `test/constraints.test.js`
- `test/commands.test.js`

### Installer and runtime support

Use these when touching `bin/install.js`, runtime docs, or installer target messaging:

- `test/installer.test.js`
- `test/phase14-runtime-credibility.test.js`
- `test/phase16-trust-regression.test.js`

### Documentation and trust surfaces

Use these when changing README, docs, shipped-assets claims, or milestone trust wording:

- `test/phase13-launch-surface-integrity.test.js`
- `test/phase15-proof-artifacts-positioning.test.js`
- `test/phase19-verification-trust-surface-updates.test.js`
- `test/repository-policy.test.js`

### Feature-family regression tests

Use these when changing milestone-specific capabilities:

- `test/phase5-export-publishing.test.js`
- `test/phase6-illustration.test.js`
- `test/phase7-translation-localization.test.js`
- `test/phase8-collaboration-platform-sacred.test.js`
- `test/phase18-technical-writing-domain-modeling.test.js`

## When to add tests

Add or extend tests when a change affects:

- visible command counts or work-type counts
- docs that make trust-sensitive claims
- installer targets or setup instructions
- package contents
- adaptation logic in `data/CONSTRAINTS.json`
- new milestone surfaces that should stay locked after shipping

If a user-facing claim can silently drift, it probably deserves a test.

## Package checks outside the test runner

Some important release checks are shell commands rather than Node tests:

```bash
npm pack --dry-run
npm publish --dry-run
```

For the standard release gate, prefer:

```bash
npm run release:check
```

Use those for release prep so you can inspect what would ship without mutating the registry.

## Practical workflow

For most changes:

1. run the targeted test files first
2. make the fix
3. rerun the targeted files
4. run `npm test`
5. if packaging or release docs changed, run `npm run release:check`

## Related docs

- [Development](development.md)
- [Configuration](configuration.md)
- [Contributing](contributing.md)
- [Release Notes](release-notes.md)
