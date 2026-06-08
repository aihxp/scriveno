# Proof Badges

Scriveno uses proof badges for claims, not feature badges. A feature can exist while its evidence level is still modest. This page defines the badge vocabulary and points at the live data in [data/proof/evidence-levels.json](../data/proof/evidence-levels.json).

## Evidence Levels

| Level | Meaning |
|-------|---------|
| shipped | The files or commands are included in the package. |
| install-tested | Automated tests verify installer output or CLI behavior. |
| artifact-proven | Committed proof artifacts can be inspected in `data/proof/`. |
| replay-tested | Automated tests replay saved project states or proof fixtures. |
| host-capture-ready | A capture protocol and target are defined, but no host transcript is committed. |
| host-captured | A transcript or screenshot from the real host runtime is committed. |
| external-tool-dependent | The workflow requires user-installed external tools. |

## Current Claim Matrix

| Claim | Evidence level | Evidence |
|-------|----------------|----------|
| Core first-run path | artifact-proven | `data/proof/first-run/README.md`, `docs/quick-proof.md` |
| Voice DNA changes draft behavior | replay-tested | `data/proof/voice-dna/eval-fixtures.json`, `lib/voice-dna-eval.js` |
| Route decisions for key workflows | replay-tested | `data/proof/replay/golden-workflows.json`, `test/proof-replay.test.js` |
| Runtime install surfaces | install-tested | installer tests and `docs/runtime-support.md` |
| Host-runtime parity | host-capture-ready | `data/proof/runtime-parity/HOST-CAPTURE-PROTOCOL.md`, `capture-status.json` |
| Publishing export packages | external-tool-dependent | export templates plus user-installed Pandoc, Typst, and platform tools |

## Rule

Do not upgrade a claim's evidence level in docs unless the matching artifact or test exists. In particular, host-runtime parity stays `host-capture-ready` until a real host transcript or screenshot is committed.
