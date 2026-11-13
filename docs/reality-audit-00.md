# Milovice RP — Reality Audit 0 / 360° visual inventory (5.26)

**User requirement (13 Nov 2026):** Revisit *everything* built before evidence-first modeling, not only future buildings. Streets must be compared in every visible direction: buildings/facades/windows/doors, **station entrances**, road edges, **sidewalk geometry**, **zebra crossings**, parking, transit stops, fences, sidewalks, trees, hedges, flowers, lamps, poles, street signs, rails, roofs and small public objects. Don't treat decorative plausibility as geographic truth. Keep phone graphics stable around the prior v5.20 near-60 FPS baseline.

## Forensic findings and fixes implemented in Pass 0

| Audit target | What was actually wrong | Fix | Proof / confidence |
|---|---|---|---|
| Station entrance / connecting walkway | Earlier passage was forced to building longitudinal axis s=0, whereas OSM footway **549346217** joins the station on its eastern wing (projected s=8.78m). The footpath therefore missed the station portal by ~8.8m. | Pure geometry planner finds opposing valid station faces and picks a passage axis 1.97m along the facade from mapped footpath endpoint, at **s=10.75m**. Preserve two 3.5m walk-through gaps and short exterior connector. | Geospatial alignment to actual OSM route, **not proof of exact existing door**. `stationPassageAudit`. |
| Invisible blocking wall at one station portal | OSM way **1550920095** is `building=roof, layer=1`, overlapping the building's railway-side canopy. Old `osmBuilding` incorrectly extruded it as a fully enclosed building and added a solid collision polygon, despite its tag meaning a roof. | Do not convert `building=roof` into solid buildings or world-collision objects. Preserve the actual green-steel, photograph-backed railway shelter from 5.25. | OSM tags and overlapping footprints in `data/milovice-osm.json`, browser collision probes for both passages. |
| Double/diagonal sidewalks and paving floating over asphalt | A function unconditionally added **two guessed 1.48m sidewalks to every roadway**. Another generated 156 imaginary paving/curb/drain tiles around the photo scene on 5. května, overlapping map paths. | Remove global flanking strips and unsurveyed photo paving. Index ALL OSM vehicle roads first; map actual `footway/path/pedestrian` ways with a 0.7m sampling/collision filter, splitting safe sections, omitting road overlap and merging repeated edges. | Actual OSM highway geometry, `__miloviceSidewalkDebug`. Widths still approximations where untagged. |
| Invented second station frontage entrance | Beyond the real walk-through station portals, the old pass added a **separate window/door/awning/sidewalk panel** on a guessed long wall, with no matched facade photograph. This made the front seem to have an entrance where the pedestrian footway did not lead. | Removed the extra glazing, doorway frame and patch of fabricated paving; only the two actual walk-through portals remain, aligned with OSM footway. | Geometric alignment to mapped OSM path, exact photographed door not yet triangulated. |
| Fake zebra crossings | Old generator painted stripes at **up to 18 road-graph junctions without any OSM crossing label**. Worse, these meshes were queued *after* the rendering batch and could pop in when another region loaded. | Remove junction-driven generator. Only emit zebras if actual `footway=crossing` and `crossing:markings=yes` or `crossing=marked` exist. Old-town OSM has 3 crossing footways, **only one** explicitly marked. | OSM crossing way **1060144101**; diagnostics show `inventedCrossings=0`. |
| Fictional giant location signs | `osmPlaceLabel` generated physically huge **11m x 2m floating nameplates** at building centre, despite OSM only recording the name and location. | Remove 3D models and preserve navigation labels in game maps. | OSM name is a POI label, not proof of an 11m real metal sign. |
| Imaginary exterior fixtures | Legacy creation randomly placed balcony, shutters, long-wall entrance doors, chimneys, rooftop vents, garage doors and commerce awnings without photographic surveys. | Suppress these placeholders in 3 initial photo-review zones, retaining existing real OSM building polygons, colliders, authentic landmarks, and published source-reviewed street models. | `__miloviceLegacyRealityAudit` counts rejections by type. General house windows outside curated areas still need review. |
| Random road furniture and greenery | Street surface wear patches, manholes/drains, bollards and scattered green-area trees used plausible procedural placement without independent visual evidence. | Global random road furniture disabled. **Mapped grass/park/forest polygon surfaces remain**. Random individual trees are suppressed in first 3 core audit zones; elsewhere park trees remain *inferred* and clearance checked until the area is surveyed. | Zone review IDs below; photo street block retained (estimated individual positions). |

## First three geographical review zones (not claims of completion)

1. **Nádraží / Nádražní** radius 235m around 50.22911,14.88198. Photo evidence from 2024 and 2025; OSM building way `53865956`; related path `549346217`, roof-only overlay `1550920095`.
2. **5. května / Mírová / Školská** radius 215m around 50.227797,14.884813, with 2014 5. května source photo and three 2024 corner-house photos. These verify the *existence and visual appearance* of some features, **NOT their precise 2026 coordinates**.
3. **Kostel sv. Kateřiny / okolí** radius 175m near 50.22813,14.883335, with actual church OSM way `118487991`. The old church tower remains because the user found it recognizable, but unmeasured heights, wall/clock positions and surrounding café Hvězda remain a photo audit task.

## Status is NOT a fictional guarantee of 360° accuracy

- **Verified:** real OSM road/building/landuse footprints and street positions where in data; geotagged dated photo subject existence/color/shape; exact markup of crossing where tagged.
- **Derived / approximate:** station entrance location inferred by the *mapped end of the footway*, not directly triangulated from photograph; most cross sections, curb width, station roof column spacing; 5. května fence and greenery relative to a *single 2014 photo*. Flag these in data rather than describing them as 1:1.
- **Unreviewed:** most town house window and door counts, backyards, town-specific utility lines, commercial signs/current storefronts, exact tree stems, longitudinal sidewalk positions where OSM is missing, parking pocket markings and dynamic vehicle models. They do not become verified merely by passing collision tests.
- **Potential side effect:** Previously auto-filled roadside pavements now disappear where OSM has no pedestrian way. This is deliberately safer than rendering a fictional strip through real asphalt; expand from photo-mapped sidewalks street by street. Do not re-enable random scattering to disguise missing data.

## Source set

- [OSM station way 53865956](https://www.openstreetmap.org/way/53865956)
- [Commons photos — Milovice train station](https://commons.wikimedia.org/wiki/Category:Milovice_(train_station))
- [Commons Nádražní front entrance and station bike tower, ŠJů 2024](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_autobusov%C3%A1_zast%C3%A1vka_a_cyklov%C4%9B%C5%BE.jpg)
- [Commons Nádraží Milovice 2025 03, Doronenko](https://commons.wikimedia.org/wiki/File:N%C3%A1dra%C5%BE%C3%AD_Milovice,_2025_03.jpg)
- [Commons Milovice — 5. května, Tiia Monto 2014](https://commons.wikimedia.org/wiki/File:Milovice_-_5._kv%C4%9Btna.jpg)

Original game models remain original created geometry; no restricted photo pixels copied into textures.

## Test gates

- `node scripts/reality-walkways.test.mjs`: road splitting, marked zebra only, real 2024 OSM walkway-to-building passage.
- `node scripts/legacy-reality-audit.test.mjs`: the 3 review zones, no physical POI boards, class suppression and traceable counts.
- Browser/WebGL smoke: 3D render and mobile LOD, clean footways, mapped zebras, both station portals collision-free, station vehicles/pedestrians, archived photo façades, streaming and editor.
- Sources/state: `window.__miloviceStreetGeometryAudit`, `window.__miloviceCrossingAudit`, `window.__miloviceStationRoofAudit`, `window.__miloviceLandmarkDebug.stationPassageAudit`, `window.__miloviceLegacyRealityAudit`.

### Next passes

**A**: confirm station entry and two opposite facade door opening in independent 2024–2025 camera views; adjust aperture location and windows, Nádražka waiting-room door only if visible. **B**: 5. května both sides, street by street and intersections; georeference curbs, trees, hedge, walls and poles from multiple angles. **C**: full 360 surrounding church and Hvězda, then remaining neighborhoods. Save every accepted element with `source, sourceDate, confidence, osmWayId or lat/lon, placementMethod`, and avoid invented objects.

## Pass 0.2 (v5.26.2) — full-footprint ground clearance

The retired 5. května photo paving renderer has been physically deleted, not just left dormant.
A single successful centre-point clearance was insufficient for long/rotated 3D objects:
a garden gate could have a safe centre and still protrude into the asphalt or the mapped
footpath. Street-scene masonry wall/cap segments, corner posts, wooden gate/slats and
hedge planting beds now pass a conservative cell-covered **rotated footprint** check
against the already-indexed OSM vehicle and pedestrian ways. Segments are skipped when
any part of the ground outline clashes. No additional ground decoration was guessed.

This is **collision/map consistency, not photographic positional verification**.
The 2014 photo does not prove the precise side or position of every plant, gate or post;
those remain approximate and must be revisited from other angles. Checks run when the
photo scene is created (not in the per-frame rendering loop), preserving the phone
LOD/mesh batching strategy. Unit and browser smoke tests cover rotation and entry paths.
