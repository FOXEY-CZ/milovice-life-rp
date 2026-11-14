# Milovice RP — Roof System 3.0: photo-led multi-mass roof topology

**Version 5.31.0, Milovice RP — 13 November 2026**

## Why change architecture

Repeated manual fixes at the photographed Školská 220/1 and station revealed multiple distinct issues: roof-to-wall gaps, floating panels, overcut dormer cheeks, and one omitted short OSM wall. A one-off patch per house is not scalable for 684 mapped Milovice buildings.

The important separation is:

- **OSM** establishes geography and the outline of a building, not the actual roof style, internal wing separation, attic windows, or through-passages.
- **Dated, correctly located photo/3D evidence** establishes which architectural parts exist, their placement and their unique appearance; uncertain dimensions remain labeled as estimates.
- **A reusable geometry engine** partitions appropriate outlines and records potential connections. It never invents an open passage or calls an unverified roof form authentic.

## Implemented 3.0 stage: structural preflight

`scripts/building-roof-topology.js` exports `planBuildingRoofTopology(footprint,options)`, independent of Three.js. It:

1. Validates a finite, simple non-self-intersecting polygon; tolerates an OSM closing node and reverse vertex ordering.
2. Finds a stable, longest-edge-aligned local frame and rejects significantly skewed/non-orthogonal corners rather than distorting them.
3. Snaps tiny OSM coordinate noise within a strict tolerance and rejects area-changing snapping.
4. Divides *supported orthogonal shapes* into **disjoint, area-conserving rectangular volumes**, recording all shared internal join lengths. Handles rotated rectangles and L, T, U constructions.
5. Reports concave-adjacent external edges. Treats them as **actual exterior envelope**, not proof of a gateway. A passage annotation requires an explicit `edgeIndex`, `type:'passage'` and HTTPS evidence URL; no passage is auto-generated.
6. Marks roof parts as *approved* **only** with an explicit manually reviewed photo profile containing one roof kind and rise per volume, plus one verified join treatment for each internal connection: `valley`, `ridge`, `continuous`, or `step-wall`.
7. Distinguishes **topology calculation** from **finished roof rendering**. A profile that passes these checks is eligible for a later mesh-assembly pass; geometry alone never silently changes a photographed building.

### Citywide audit (checked-in core data)

The 684 OSM building footprints were tested:

| Audit result | Count |
|---|---:|
| Buildings reviewed by algorithm | 684 |
| Geometrically orthogonal, partitionable | 366 |
| Partitionable into multiple volume candidates | 110 |
| Non-orthogonal / unsupported / requiring review | 318 |
| Passage opened without source | **0** |

`scripts/building-roof-topology.test.mjs` validates 2D coverage, nonoverlap, rotated/reversed test buildings, explicit versus guessed passages, incomplete join data, invalid geometry and full OSM-core audit.

## User-facing workflow in Street Editor

Open `editor.html`, select a building, then see the **Roof System 3.0** panel and proposed roof-mass outlines drawn in **yellow** on the map. It distinguishes simple partitionable shapes, multiple mass candidates and non-orthogonal cases requiring additional evidence. Yellow geometry **does not mean the actual roof is verified**.

Both the game and editor use the same engine. The game exposes a one-time structural audit at `window.__miloviceRoofTopologyAudit` for test instrumentation. No new triangles are generated every frame.

## Explicit exclusions / remaining work

- No photograph means no guessed ridge bearing, dormer, valley, or open passage.
- **This stage does not yet replace the in-game roof mesh with multi-mass surfaces.** It provides the validated decomposition, junction data and evidence checks first. The current Školská roof still needs the subsequent physically joined multi-mass mesher and a visual comparison to real photographs. Do not falsely advertise the house as visually fixed.
- A notch in an OSM polygon is not proof of an interior thoroughfare. The special station passage already has independent implementation and is unchanged.
- The next development step is the material-batched join solver: generate each approved roof mass, compute union/valley/ridge geometry and render soffits without leaks, then compare against 360-degree source imagery. Recompute only when geometry/approved profile changes, not during frame rendering.
- Measure on-device FPS in actual Milovice scenes, preserving the mobile performance budget; desktop CI is not an FPS guarantee.

## Automated gates

`node scripts/building-roof-topology.test.mjs`: validates all plans and every OSM building.
`node scripts/browser_smoke.mjs`: validates the live city topology audit and forbids invented passages.
`node scripts/editor_smoke.mjs`: selects a real house and checks that source-safe topology appears in the real editor.

The guiding rule is **unique architecture backed by real sources, reusable construction backed by reliable geometry**.


## 5.48 — universal bounded roof corners

The previous physical-eave miter chose the following wall normal for very sharp corners. On real Milovice OSM way `202775821`, this could fold a strip inward and make the entire eave mesh disappear. The shared planner now uses a bounded outward angular bisector so the same 3D corner is welded on both adjoining walls. A non-finite width or thickness is rejected. Tests cover the actual Milovice footprint, reversed winding, sharp synthetic corners, finite geometry, corner connection and the 1.8× overhang cap. The school’s 22-edge roof is unchanged. This is a geometric safeguard for new photo-backed roofs, not a claim of verified roof shapes on every building.
