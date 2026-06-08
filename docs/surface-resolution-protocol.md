# Surface resolution protocol

This is the canonical contract for resolving Scriveno context surfaces across work types. Commands use canonical surface names for intent, then resolve the real project filename through `surface_applicability` and `file_adaptations`.

## Rule

1. Read `.manuscript/config.json` to get `work_type`.
2. Read Scriveno's installed/shared `CONSTRAINTS.json`.
3. Resolve the work-type group from `work_types[work_type].group`.
4. Start with `surface_applicability.by_group[group]`.
5. Apply `surface_applicability.work_type_overrides[work_type]` if present. A surface named in an override moves to that tier and is removed from the other tiers.
6. Skip every canonical surface in `not_applicable`.
7. For every remaining variable surface, resolve the concrete filename through `file_adaptations[group][canonical_surface]`, falling back to `file_adaptations.default[canonical_surface]` only when the group has no override.
8. Treat derived surfaces as rebuilt views, not authored files. `RELATIONSHIPS.md`, `CONFLICTS.md`, `PEOPLE-DYNAMICS.md`, `GEOGRAPHY.md`, `CONTEXT.md`, and `PROGRESS.md` are regenerated from their source surfaces.

## Canonical surfaces

Use these canonical names when reasoning about intent:

| Canonical surface | Default | Academic | Technical | Sacred |
|-------------------|---------|----------|-----------|--------|
| `BRIEF.md` | `BRIEF.md` | `PROPOSAL.md` | `DOC-BRIEF.md` | `FRAMEWORK.md` |
| `CHARACTERS.md` | `CHARACTERS.md` | `CONCEPTS.md` | `AUDIENCE.md` | `FIGURES.md` |
| `RELATIONSHIPS.md` | `RELATIONSHIPS.md` | not applicable | `DEPENDENCIES.md` | `LINEAGES.md` |
| `WORLD.md` | `WORLD.md` | `CONTEXT.md` | `SYSTEM.md` | `COSMOLOGY.md` |
| `PLOT-GRAPH.md` | `PLOT-GRAPH.md` | `ARGUMENT-MAP.md` | `PROCEDURES.md` | `THEOLOGICAL-ARC.md` |
| `THEMES.md` | `THEMES.md` | `QUESTIONS.md` | `REFERENCES.md` | `DOCTRINES.md` |
| `PEOPLES.md` | `PEOPLES.md` | not applicable | not applicable | `PEOPLES.md` |

`RECORD.md`, `PROGRESS.md`, `PLACES.md`, `GEOGRAPHY.md`, and `RESEARCH.md` keep neutral filenames across all groups.

`PLACES.md` is an authored project file created when canonical `WORLD.md` applies to the work type. `GEOGRAPHY.md` is derived from `PLACES.md` plus the adapted world surface. `RESEARCH.md` is a neutral advisory research surface, not a world surface, and is created only by `/scr:research`.

## Command behavior

- `/scr:new-work` and `/scr:import` create only non-derived surfaces that are `required` or `optional`.
- `/scr:new-work` does not create empty adapted relationship files. Relationship surfaces are generated after the adapted cast surface has at least two entries.
- `/scr:new-work` creates `PLACES.md` only when canonical `WORLD.md` applies. It does not create `GEOGRAPHY.md` because that map is derived, and it does not create `RESEARCH.md` because research notes are advisory and topic-driven.
- `/scr:save`, `/scr:scan --fix`, `/scr:new-character`, `/scr:character-touch`, `/scr:relationship-map --edit`, `/scr:new-place`, `/scr:place-touch`, `/scr:geography-map --fix`, `/scr:pause-work`, `/scr:resume-work`, and `/scr:autopilot` regenerate applicable derived maps.
- `/scr:draft`, `/scr:plan`, `/scr:discuss`, visual commands, front/back matter, translation, and review commands load the adapted filenames, not hard-coded default filenames.
- `/scr:scan` may suggest `/scr:new-place` for recurring place-like mentions, but it must not auto-append candidates to `PLACES.md` or create an inbox.

## Writer-facing terminology

Use canonical words internally, but adapt the language shown to the writer:

| Surface role | Default | Academic | Technical | Sacred |
|--------------|---------|----------|-----------|--------|
| Cast entry | character | concept | audience segment or actor | figure |
| Relationship map | relationship map | dependency map when applicable | dependency map | lineage map |
| World surface | world | context | system | cosmology |
| Plot surface | plot graph | argument map | procedure map | theological arc |
| Themes surface | themes | questions | references | doctrines |

When in doubt, name the resolved filename in a status line and avoid inventing adapted command names that do not exist.
