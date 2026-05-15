# v1.4 Research - Architecture

## Integration Surfaces

### Runtime additions

Likely touched files:

- `bin/install.js`
- `docs/runtime-support.md`
- `README.md`
- installer tests

Key architectural choice:
- **Perplexity Desktop** should likely be modeled as a runtime distinct from the existing command-directory targets
- the install strategy may need a new classification or a careful reuse of the existing `skills`/generic path if the actual artifact is guidance plus MCP launch metadata rather than slash-command files in a watched directory

### Technical-writing additions

Likely touched files:

- `data/CONSTRAINTS.json`
- templates under `templates/`
- work-type docs
- command help/docs where domain examples matter
- export/publishing docs if specific outputs are claimed

Key architectural choice:
- technical writing should be added as a **new work-type group** or a clearly defined cluster inside an existing group only if that preserves domain-native vocabulary cleanly
- the better fit appears to be a **new technical-writing group**, because the hierarchy, command names, and file expectations differ meaningfully from creative prose

## Suggested Build Order

### 1. Runtime research-to-model pass

- decide whether Perplexity Desktop can be represented with an existing install strategy or needs a new one
- define the runtime-support framing before adding launch-surface claims

### 2. Technical-writing taxonomy pass

- choose the initial technical-writing work types
- define hierarchy vocabulary and command/file adaptations
- decide which current commands are meaningful, renamed, or hidden

### 3. Template and constraints pass

- add context templates and defaults
- add work types, groups, command availability, and adaptation rules to `CONSTRAINTS.json`

### 4. Docs and verification pass

- update README/runtime-support/work-types docs
- add tests for installer targets, work-type counts, and command adaptations

## New vs Modified Surfaces

### New

- Perplexity Desktop runtime record
- technical-writing work-type records
- technical-writing template or template adaptations
- milestone-specific tests for the new runtime/work types

### Modified

- installer runtime registry
- runtime matrix docs
- counts and examples in docs
- help/reference surfaces that enumerate work types or runtimes

## Architectural Risks

- forcing Perplexity into the wrong existing runtime strategy and then documenting the wrong mental model
- adding technical-writing work types without enough command gating, causing fiction-oriented tools to leak into docs workflows
- treating docs families as exports only, instead of modeling them as first-class work types with planning/drafting/review flow

## Bottom Line

Architecturally, this milestone should split into two threads:
- **runtime integration** for Perplexity Desktop and carefully framed Perplexity support
- **domain modeling** for technical-writing work types, templates, and command gating

That separation should drive the phase structure.
