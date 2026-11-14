# Milovice RP — complete building-by-building rebuild program (v5.28.4)

## Why we must rebuild beyond a single station or roof

The **entire core OSM source file** `data/milovice-osm.json` currently contains **684 mapped buildings**. Not one entry contains a measured `height`, `roof:shape`, or a roof-orientation tag; only **450 of 684** record `building:levels`. Therefore the old generic architecture renderer **cannot truthfully reconstruct elevations, doors, roofs, colours, windows, porches or chimneys from mapping data alone**. It guessed most architecture from floor counts and polygon widths. The user documented inverted roof slabs and invented features in screenshots on November 13, 2026.

**Inventory**: `data/architecture/building-audit-queue.json` contains exactly one uniquely identified row per mapped footprint, its surveyed metadata status, provenance confidence, and a priority queue by street focus. Rows marked `photo-anchored-partial` have source photos, NOT completed 360-degree surveys. Additional region files and structures created later need their own matching inventories; 684 is the current OSM core, not a claim that Milovice contains only 684 buildings.

| Cohort (rough geo priority, not official street ownership) | Count |
| --- | ---: |
| Nádražní / station, 190m radius | 44 |
| 5. května / Mírová, 210m radius (excluding station cohort) | 86 |
| Other core Milovice OSM buildings | 554 |
| Total | 684 |

## Stage 0 (implemented: 5.28.4, citywide geometric safety)

- **All ordinary roof geometry** uses one common OSM-triangle-constrained gable/hip solver with stable bearing derived from the real footprint. No centre-fan inverse cone, no projected rectangular roof spilling beyond a concave building, and no assumption that OSM vertices start at a certain house corner.
- **Non-quadrilateral home footprints** default to safe polygon-clipped hip surfaces or an intentionally simple flat surface, not an artificial gable full of unsupported corner cuts. Gables can still be selected for individually verified rectangular forms.
- **Photographed attic dormers** on Mírová 36 and Školská 1 have their slopes calculated from the actual width/rise; both slope planes now *rise toward the centre* rather than flying outward as dark panels.
- **Old-town hero houses** calculate end-wall gables using the **same dominant roof axis** as their roof, never polygon winding; buildings with ambiguous gable ends do not receive fabricated gable wall triangles.
- **No index-modulo fake rooftop props**: the previous chimney on every third old-town house and ventilation blocks on every fifth unverified building are disabled globally; guessed commercial side awnings and billboards are also removed. OSM collisions and existing source-backed landmarks remain.

This stage solves mathematically incorrect shapes; it does **not** mean every remaining house looks like its real-world counterpart.

## Stage 1 — photograph Nádražní / station / Školská faces (44 buildings)

For **each OSM ID**, find lawful dated views of *each reachable side*, cross-check the 2D building outline and road orientation. Record (a) evidence URL and viewpoint GPS, (b) base-to-eave height estimate (survey if available), (c) real roof type/ridge orientation/texture, (d) actual window and door locations and counts, (e) documented balconies, chimneys and signs, (f) greenery, ramps and barriers immediately around the parcel. Mark absent or invisible information as **unknown**, never automatically invent it.

Prioritize OSM 53865956 (station), 118487980 (Školská 1) and surrounding houses, then all remaining 44. User-confirmed visual contradictions have priority over old schematic building geometry.

## Stage 2 — 5. května / Mírová (86 buildings)

Begin with photographed IDs **202367254** (Mírová 36) and **202367194** (Modrá hvězda), then go door-to-door down the road, cross-checking real sidewalks, trees, building frontages and road markings. Respect earlier photos' capture dates: a 2014 photo does not guarantee a 2026 facade.

## Stage 3 — remaining 554 and additional districts

Group by connected street networks (not arbitrary geographic boxes), complete both sides of each street, then advance to the next road. Regional building sources not present in the 684-way OSM core enter the same queue after importing their source identifiers. Retain performance-oriented geometry batching/chunk LOD.

## Per-building acceptance criteria

1. *Grounded identity*: OSM ID, footprints, usable photo(s), road name, provenance.
2. *360 exterior*: review all sides; no unverified windows/doors or vacant walls claiming photographic accuracy. Unknown sides may retain clearly tagged **generic placeholder** geometry.
3. *Geometry*: no roof triangle sticking out of the footprint; joined eave to facade; no z-fighting, inverted normal, black gap or falsely overlapping adjoining roof slopes. Confirm every entrance connects to the real pedestrian network.
4. *Comparative screenshots*: fixed camera points in WebGL for street, rail/back, left/right, elevated, plus a crop of the relevant reference photo for internal manual visual review.
5. *Collision/performance*: avatar and vehicle pass real access points, 60 FPS target on phone where practical, and report *actual phone FPS* separately from Chromium software renderer.
6. *State*: `unreviewed` → `photo-backed-partial` → `multi-angle-reviewed` → `ready`; no claim of 1:1 accuracy based on polygon math alone.

**Reference photo sources currently integrated**: 
- https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_36.jpg
- https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg
- https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_11,_hotel_Modr%C3%A1_hv%C4%9Bzda.jpg

These references substantiate certain exterior details, not whole-building surveys. The 2025 station reference and multiple player screenshots are also recorded in `docs/station-reality-pass-02.md`.

## v5.53 — no-repeat street progression (2026-11-14)

`data/architecture/building-work-progress.json` is the durable working log.
It records known already-touched OSM IDs separately from the full 684-way
audit inventory. Distinguish user-accepted **partial** school progress from
reviewed-but-not-approved buildings. The previous v5.52 correction on
Školská 220/1 (OSM 118487980) is NOT a new building and must never be
announced as one again. A test rejects any proposed new candidate matching
an earlier accepted/previously worked OSM ID.

Next genuine candidate is OSM **202298939**, roughly 37 m southeast from
the source camera at 50.2290628, 14.8823614 with heading 115 degrees.
Two ŠJů 2024-05-30 CC BY 4.0 photographs show the street fork:
* https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_a_5._kv%C4%9Btna_(01).jpg
* https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_a_5._kv%C4%9Btna.jpg

**Important limitation:** the grey pitched-gable building at the fork
might include/abut the adjacent commercial OSM building **202775905**.
A camera bearing alone cannot prove which portion belongs to which OSM
footprint. Candidate state is `photo-camera-aligned-candidate`, NOT
`photo-backed-partial`. Next modelling step requires checking the wall
identity and roof ownership from another view, then testing street/wall,
roof/eave/entrance geometry. No false roof profile, guessed windows,
or invented entrance was added in v5.53. Progression past a worked
candidate automatically excludes it and selects the next unworked one.
