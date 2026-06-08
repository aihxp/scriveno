---
creative_pillar: world
always_load_for: [plan, draft, continuity-check, map-illustration]
authority: derived
---

# Geography map

*Derived from `PLACES.md` plus the adapted world surface. Do not hand-edit. To change geography, update a place through `/scr:new-place` or `/scr:place-touch`, then regenerate this map with `/scr:geography-map`, `/scr:save`, or `/scr:scan --fix`.*

## Source summary

- Places source: `.manuscript/PLACES.md`
- World source: `{{ADAPTED_WORLD_SURFACE}}`
- Last generated: `{{ISO_TIMESTAMP}}`

## Spatial hierarchy

| Parent | Contains |
|--------|----------|
| {{PARENT_PLACE}} | {{CHILD_PLACES}} |

## Adjacency and routes

| From | To | Relationship | Travel logic | Notes |
|------|----|--------------|--------------|-------|
| {{PLACE_A}} | {{PLACE_B}} | {{adjacent, inside, across, north-of, route-to}} | {{TIME_DISTANCE_OR_MODE}} | {{NOTES}} |

## Place continuity

| Place | Stable facts | Open questions |
|-------|--------------|----------------|
| {{PLACE}} | {{FACTS_THAT_MUST_NOT_DRIFT}} | {{UNRESOLVED_SPATIAL_QUESTIONS}} |

## Map prompts

Notes that `/scr:map-illustration` can use without rereading the full world file:

- Scale: {{SCALE}}
- Key regions: {{KEY_REGIONS}}
- Routes: {{ROUTES}}
- Borders or barriers: {{BORDERS}}
- Landmarks: {{LANDMARKS}}

---

*Derived map. See `docs/world-layers-protocol.md` for how it is computed.*
