## v5.30.1 — After 360-degree mobile visual review (2026-11-13)

Reported from five real phone screenshots of Školská 220/1: roof cutouts removed the original window/roof overlap, but each rectangular cutout was wider and deeper than its actual cross-gable facade. The two open side strips exposed the sky. Dark roof-join edges remained exposed in side views. Four screenshots ranged roughly 79–86 FPS, but one measured **29 FPS (JS 11 ms, 444 draw calls)**; this one spike is not proof of sustained low performance.

**Shared geometry solution, not another hand-built address patch:**

1. The photo-sourced feature profile now cuts an opening **14 cm narrower than the solid gable wall** (7 cm overlapping opaque material on each side), rather than 36 cm wider. Rearward clipping ends 20 cm inside the solid gable depth, rather than 11 cm beyond it. This covers the sky slits without reintroducing a roof through the arched glass.
2. The universal roof solver now projects the **back edge of a cross-gable onto the host hip/gable roof's actual plane height**, then generates one batchable rear closure mesh connecting these planes. This is data-driven and applies to future documented cross-gables, without adding special case OSM ID logic.
3. Photographed roofs with real overhang/soffit/fascia no longer receive duplicate invented level gutter rods on every facade. This removes both unrealistic parallel dark strips and unnecessary draw calls.
4. New math tests enforce exact window cutout overlap contract, full roof triangles (rotated rectangles), and the back join. A browser smoke test checks both joins exist in the live scene.
5. **Status:** geometric validity is automated; accurate appearance from 360° views and a sustained mobile FPS budget still require phone screenshots after deployment. Do not claim a complete citywide or photogrammetric roof solution.

The core has **684 mapped OSM structures** and exactly **342 non-quadrilateral footprints**. The photo evidence registry is still incomplete. Profile discovery needs dated imagery before declaring another roof shape a verified landmark.

---

# Milovice RP — Roof System 2.0 (v5.30.0)

## Goal: unique photographed houses, shared physically sound topology

The target is a **recognisable copy of Milovice**, not a random city made from procedural presets. Automated code is responsible for mechanically correct roof joins, **not for guessing the appearance of buildings without evidence**.

Current OSM core has **684 mapped buildings**, of which **342 are non-quadrilaterals**. A per-house emergency patch is not a scalable solution.

### One architectural profile per photo-supported site

A building profile describes only identity and observed unique architecture: building OSM ID, dated source URL, verified roof shape if known, number and placement of photographed dormers, window/door silhouettes, material/colour and a confidence label. Approximate pitch, width or height are marked **unmeasured**. Without evidence, a building remains explicitly provisional; OSM geometry alone cannot reveal the real roof or its windows.

The first example is Školská 220/1, OSM 118487980. It has two differently proportioned gables with arched attic windows, based on the May 2024 photograph. Their dimensions remain estimated.

### Universal roof geometry responsibilities

1. Convert the building's actual OSM polygon into oriented sloping roof faces. Do not infer a fictional gable on a skew or complex footprint.
2. Read **the same building feature profile** when placing the windows/dormer meshes and cutting their openings in the main roof.
3. Subtract those openings **from every roof layer**: main tiles, projecting eaves, soffit, fascia, and wall-to-roof infill. A photo dormer must not have a main roof passing through its glass.
4. Build physical end caps only on genuine exposed ends. Fill walls-to-roof gaps using exact roof planes. Preserve realistic overhangs.
5. Use typed profile geometry instead of hardcoded address-specific calculations. A new photo source changes data, not the roof clipping code.
6. Batch roof objects by material for mobile, and keep LOD: no large per-house new draw-call counts.

### Automatic quality gate, by building and by street

A build should be rejected or flagged for review if it has out-of-bound roof triangles, unclosed walls, duplicate/floating eave caps, intersections at documented roof openings, unsupported roof shape from inadequate sources, or excessive GPU draw calls. Tests need rotated rectangles, reverse winding, seven-edge real Školská, L/T/U concave footprints and actual photographed dormer profiles.

**Important distinction:** mathematical watertightness does **not** prove photographic accuracy. True photo comparisons and a 360-degree visual inspection remain separate review steps. Automated screenshots can prioritise suspicious sites, rather than requiring manual checks of every angle of every house.

### Rollout without endlessly revisiting a single building

- **Now in code:** a pure geometry opening cutter at `scripts/roof-opening-geometry.js`; photographic roof profiles in `scripts/street-photo-block.js`; the same two source-backed cross-gables create both meshes and openings for Školská 220/1. The universal clipper supports rotation, many openings and independent UV interpolation. It is not limited to one OSM way.
- **Next:** route all existing photo-anchored houses through the shared feature contract. Replace the remaining special-case station and Školská wall closure wrappers with one general perimeter solver and add citywide roof coverage auditing.
- **Then:** run batch street audit with source confidence per facade, geometry checks and automated multi-angle snapshots. Correct only flagged buildings; do not silently generate invented windows, chimneys or roof shapes.
- **Always:** OSM is for geography/footprints, photograph and 3D source for actual appearance. Use public photos according to licence; no wholesale scraping or unlicensed texture copying.

Tests: `node scripts/roof-opening-geometry.test.mjs`, `node scripts/skolska-roof.test.mjs`, Chromium WebGL smoke checks.
