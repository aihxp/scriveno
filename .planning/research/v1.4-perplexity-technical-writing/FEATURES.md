# v1.4 Research — Features

## Scope

Research for milestone `v1.4 Perplexity & Technical Writing`.

## Perplexity Runtime Support

### Table Stakes

- Users can choose **Perplexity Desktop** as an installer target
- Installer/docs explain the support type accurately instead of implying command-directory parity
- Runtime support docs state the verification status and evidence level clearly
- Troubleshooting/help docs explain what Scriveno installs or configures for the Perplexity surface

### Likely First-Milestone Scope

- Perplexity Desktop / Mac app target with MCP-oriented guidance or setup
- runtime-support and README updates that describe Perplexity honestly
- tests covering the new installer target and its documented support level

### Future Scope

- broader Perplexity support once remote MCP or another official runtime surface is documented and stable
- host-runtime smoke verification for Perplexity surfaces

## Technical-Writing Support

### Research-backed document families

The most stable way to frame technical-writing support is around documentation families rather than one vague genre bucket.

#### 1. Tutorials

- learning-oriented onboarding content
- quickstarts
- walkthroughs

#### 2. How-to / Procedure

- task-oriented guides
- SOPs
- runbooks
- operational checklists
- troubleshooting procedures

#### 3. Reference

- API/endpoint reference
- CLI command reference
- configuration reference
- parameter tables

#### 4. Explanation / Design

- architecture overviews
- design specs
- system explanations
- decision rationale
- conceptual guides

### Table Stakes for Scriveno

- a technical-writing group that uses document-native vocabulary instead of fiction-centric terms
- context/template support for structured sections, prerequisites, steps, outputs, warnings, and references
- command adaptation that keeps core workflow commands useful for docs work
- export/document guidance that matches common technical-writing outputs

### Good first-milestone candidates

- **Technical Guide / User Guide**
- **Runbook / SOP**
- **API or CLI Reference**
- **Design Spec / Architecture Doc**

These cover the largest share of practical technical-writing work without needing to model every possible enterprise document.

### Defer for later

- full docs-site or docs-portal generation
- docs-as-code publishing integrations
- information-architecture tooling for large doc portals
- compliance-heavy regulated document packs
- exhaustive template coverage for every business-document subtype

## Anti-Features for v1.4

- pretending one generic `technical_writing` type is enough without subtypes
- turning the milestone into a full developer-docs publishing platform
- building web publishing pipelines before basic work types and templates exist

## Sources

- Diataxis — Start here: <https://diataxis.fr/start-here/>
- Diataxis — Applying Diataxis: <https://diataxis.fr/application/>
- Google Technical Writing — Audience: <https://developers.google.com/tech-writing/one/audience>
- Google Technical Writing — Organizing large documents: <https://developers.google.com/tech-writing/two/large-docs>

## Bottom Line

The best milestone shape is:
- ship **Perplexity Desktop** support as a concrete runtime target
- scope broader Perplexity support carefully
- add a **technical-writing family** with a small first-pass set of high-value document types instead of one catch-all label
