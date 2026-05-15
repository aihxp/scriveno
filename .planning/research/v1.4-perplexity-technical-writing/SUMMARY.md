# v1.4 Research Summary - Perplexity & Technical Writing

## Stack Additions

- No npm runtime dependencies should be added
- Perplexity Desktop should be treated as an MCP-oriented runtime target, not as a command-directory clone of Claude Code
- Broader Perplexity support should stay limited to what official docs actually support today

## Feature Table Stakes

- Perplexity Desktop installer/runtime entry with accurate support framing
- runtime-support, help, and troubleshooting docs for that target
- a first-pass technical-writing family with distinct document types instead of one generic bucket
- templates, command gating, and docs that use technical-writing-native structure

## Recommended First-Pass Technical-Writing Types

- Technical Guide / User Guide
- Runbook / SOP
- API or CLI Reference
- Design Spec / Architecture Doc

## Watch Out For

- overclaiming Perplexity support beyond the documented Mac app local-MCP surface
- assuming command-directory parity where none exists
- collapsing technical writing into one vague work type
- letting fiction-oriented defaults leak into the technical-writing experience
- expanding scope into full docs-site publishing before core work types are stable

## Planning Recommendation

Split the milestone into:

1. Perplexity runtime strategy and installer support
2. Technical-writing taxonomy, work types, and templates
3. Docs/tests/trust-surface updates for both threads
