# Milovice RP 5.25 — železniční stanice / Reality Pass 02

**Actual scope shipped:** platform-side canopy shape and Nádražka's indoor location. No claim that the whole building facade, window cadence, door positions or roof ridgeline is metrically exact. **No new guessed street furniture**.

## Primary references

| Source | Observed, supported | Limits |
|---|---|---|
| Wikimedia Commons: [Nádraží Milovice, 2025 03.jpg](https://commons.wikimedia.org/wiki/File:N%C3%A1dra%C5%BE%C3%AD_Milovice,_2025_03.jpg), Stanislav Doronenko, **20 Aug 2025**, CC BY-SA 4.0 | Long shelter on rail-side platform, dark green painted steel, ribbed/corrugated underside, strong vertical steel supports and curved/forking brackets; visible lighting strips underneath, grey pavers, tactile edge markings | Does **not** specify every column's distance from the building, roof width, height or beam spacing. Game models these dimensions proportionally and marks them approximate |
| Wikimedia Commons: [Milovice, nádraží (01).jpg](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD_(01).jpg), ŠJů, CC BY 4.0 | Additional evidence for rail platform's paved surface and dark platform shelter | Different camera and older appearance; use only the features clearly visible |
| [Železniční stanice Milovice](https://poznejdomy.cz/domy/detail/824-zeleznicni-stanice-milovice), Poznej domy, exterior photo Gabriela Uhrová 3 Jul 2021 | Genuine address **Nádražní 469/13**. Café founded 2018 in small former dispatch-room space adjoining waiting room | The full address is factually supported, but the previous *painted house-number plate* at a guesspoint was not; do not restore without a photo of that exact plate |
| [Milovická Nádražka](https://www.nadrazky.eu/hospoda.php?hospodaID=100273), last confirmed 2022 with community reports in 2024 | Café was **inside the station waiting room**, accessed through a sometimes inconspicuous door; seasonal outdoor garden and serving window existed | Neither exact door location nor current 2026 operation is confirmed. Keep only **in-building map annotation**. Do not construct a fake platform-facing window or exterior sign |
| [Milovice (train station) OSM way 53865956](https://www.openstreetmap.org/way/53865956), OSM/ČÚZK data in project | Station footprint, including its characteristic long irregular OSM outline | OSM does NOT determine facade window heights/positions or canopy posts |

## Changes

- Replace a **red 23m slab with dark wooden braces** with an **original green steel canopy**: green roof/sheet, underside, transverse ribs, lengthwise/cross beams, dark steel posts and angled branch/fork supports.
- Canopy model uses the same **existing OSM station platform-facing wall**, and keeps 3.47m pedestrian passage, collision openings and mapped footway connections unchanged.
- The canopy's roof, rib, beam and column boxes use existing `archPart` **instancing and batching**, so hundreds of modeled structural details do **not** create hundreds of draw calls. Forks are one separate InstancedMesh.
- Add a restrained red-brown sill to the representative cream-plaster station windows. **Exact number and spacing of individual windows remains unverified.**
- Remove the fake `MILOVICKÁ NÁDRAŽKA` exterior sign, invented cafe awning/window and misleading separate platform cafe front. Add `Milovická Nádražka · čekárna` as an in-building minimap annotation, **not** a fake physical doorway.
- Preserve the **5.20 phone graphics baseline**, **5.22 road-placement guards**, **5.24 photo-anchored stops A/B** and unblocked station passage.

## How to verify

- Code: `scripts/station-platform-reality.js`.
- Unit test: `node scripts/station-platform-reality.test.mjs`. It guards photo source, green steel, roof ribs, column count, batched fork arms, estimated dimensions and absence of timber.
- Browser smoke: `window.__miloviceLandmarkDebug.stationCanopyReality`, `stationCafeWaitingRoom` and `unverifiedExteriorCafeRemoved`; test retains original passage/window/collision conditions.

### Still needs evidence
Photo viewpoints covering the street side and both ends of station building, photographed window/door grid, exact Nádražka door in waiting room and external serving window, roof pitches and bay count, canopy post locations and cutout positions. **Do not claim total 1:1 reality until these have been measured**.

## 5.27.1: roof-material visual correction

The platform *canopy* is still dark green painted steel (2025 Doronenko,
Wikimedia Commons). The main *station building's pitched roof* is reddish
interlocking roof tile, not red standing-seam sheet: it is visible in the
railway-side building photograph catalogued at
https://stellwerke.info/stw/stw.php?id=22402 (ŠJů/Commons attribution).
The v5.27.1 material now reuses the game's own original red-clay tile texture
and a matte nonmetallic surface, with zero new GPU texture allocations. The
pattern is an interpretation, not a measured roof plan. The rail platform
canopy's green metal roof remains a separate material and unchanged model.

## 5.27.2 — user-confirmed correction: Nádražka is NOT a side annex

The old game had a misleading inference: merely hiding the external Nádražka
sign and calling it 'waiting room' did not eliminate generic auto-windows from
the station's narrow end faces, and the minimap/landmark selected an imprecise
station-centre point. This did not constitute a genuine 360° verification.

At the user's request, no unverified 'Nádražka' exterior/side building or
entrance is modeled. Ground- and first-floor procedural window inserts are now
suppressed on the station's end-cap walls (orientation relative to the true
longitudinal station footprint). The existing OSM building shell, walls, roof,
colliders, front passage, and green railway platform canopy are preserved.
The Nádražka remains *one map-only indoor amenity*, shown a little inside the
mapped pedestrian street entrance, explicitly marked approximate. The main
navigation waypoint is now only 'Nádraží Milovice' and no longer conflates the
cafe with a secondary outside station point.

Source cross-check: [Nádražky.eu](https://www.nadrazky.eu/hospoda.php?hospodaID=100273)
locates the service behind a waiting-room door; ČD's 2022 Železničář article
describes historical outdoor seating directly IN FRONT OF the station building,
not an independent side café. Exact current facade/window positions must still
be checked against lawful dated views; the absence of evidence is not a verified
claim that all physical windows on the real side walls are absent.

## 5.27.3 — Remove mislocated green side canopy seen in user screenshots

The earlier screenshot clearly showed a **long dark-green steel awning** with
many columns immediately beside the bike tower, along the exposed side wall of
the station. It was generated by `planPhotoPlatformCanopy` and
`installCanopyBraces`: a 23 m canopy, roof ribs, vertical steel posts, forked
braces and a 29 m by 4.5 m hard-coded paving slab. That code wrongly assumed
that a photograph of the **railway platform on the opposite side** proved the
same roof belonged here. It did not. The user explicitly requested removal.

Therefore none of those green canopy components nor the associated speculative
paving is created in the 3D game in v5.27.3. The station OSM shell, tiled roof,
front/back mapped passage portals, real OSM footways, station nameboard, bus
stops and bike tower remain. The OSM railway platform geometry remains on its
proper railway side. We retain the historical photograph as a record of the
REAL platform, but no longer use it to justify the wrong-side standalone roof.

Quality gates: unit asserts no constructor call is reachable in index.html;
Chromium smoke checks zero canopy pieces, posts, braces, and the false-side
paving removed. This is an evidence-based DELETE, not a relocated guess.

## 5.28.0 — Station elevated tower photo pass (still an approximation)

**Evidence examined:** A station building photograph hosted by [Stellwerke.info](https://stellwerke.info/stw/stw.php?id=22402) shows the compact raised bay with a single upper-floor sash window on the railway side, white-mullioned arched windows below, a matte red-tiled hipped roof and a modest blue *Milovice* name plaque. This is different from the former game silhouette: an approx. 17–19m-wide two-storey flat-ended central extension with many upper windows. Further 2024 Commons views [Nádražní + bike tower](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_autobusov%C3%A1_zast%C3%A1vka_a_cyklov%C4%9B%C5%BE.jpg) are photo reference, not geodetic elevation surveys.

**Changed geometry:**
- Raised station central mass is now ~9–11m wide (2×4.15–5.5m half-span), instead of the old ~17–19m. This is photographic proportion estimation only, not centimetre accuracy.
- The central red roof is a compact four-faced **hip**, not a long gable; long station wings keep their existing roof and the 3.7m mapped public passage stays unobstructed.
- First-floor sash window details are emitted **only on the original OSM exterior perimeter**, one per each long facade. The previous program accidentally decorated cut boundaries generated internally by clipping the building into three roof parts — invisible fake windows on non-existent walls. These are now zero.
- Arched ground-floor windows gain instanced white mullion and horizontal sash details, replacing the unbroken blue-glass appearance. The railway-facing *Milovice* plaque is scaled down from a 5.3m billboard to a modest 2.65m face; position remains approximate.
- All these details reuse existing instanced batches and texture materials; no photo bytes or external assets are copied.

**Unknown:** exact central half-span and elevation, street facade window count, plaque location, roof geometry and any 2026 renovation. The photo does not establish precision. The railway photo and 2024 views have separate dates; don't claim a complete 360° survey.

## v5.28.2 — repaired catastrophic roof geometry (user screenshot regression)

The user provided six mobile screenshots with evidence of huge flat beige triangles, dark undersides, oversized eaves over the passage and faceted overlapping roofs. This was a true regression introduced during v5.28.0, **not** a texture issue. Diagnosis from a 20-vertex OSM building polygon: recomputing PCA on each clipped wing rotates the left wing axis by ~63° and the central tower by ~90° relative to the building. The old generators then extruded roofs over their bounding rectangles and placed artificial stucco-colored gable caps at the cut planes. All those facets extend far outside the 3D footprint.

**Permanent geometry replacement:** a new pure, unit-tested `scripts/station-roof-geometry.js` constructs the pitched roof as polygons obtained by clipping **original OSM footprint triangles** against two affine pitch planes on each low wing, or four on the central hip. The three sections share the original full-station longitudinal axis. Each polygon is a true subset of the OSM footprint, so it cannot extend over grass, sidewalks or railways. The pitch surfaces exactly conserve planar polygon area. The invented beige gable triangles, giant bboxes and arbitrary overhang rectangles are gone. Center hipped red-tile roof remains, and the two wings keep restrained low pitched gables. Walkthrough portals, wall collision, and side-awnings removed earlier are unaffected.

**360 proof:** GitHub's WebGL browser smoke captures the station from 5 independent angles (street / rails / left / right / elevated) and asserts all three sections, axis equality, 0 m footprint overshoot, and <0.01% area error. Unit tests cover rectangular and concave L-shape footprints including a rotated axis, verify every emitted vertex lies within source triangles and that hip geometry has four active planes. Render material is the existing licensed/original procedural roof-tile surface. **Limit:** this ensures geometric correctness; exact historical roof geometry requires more photo-angles or a survey.

## 5.28.3 — screenshots audit: reversed railway plaque, dark gable wedges and fake arch

The player's seven mobile screenshots dated November 13, 2026 showed a blue `Milovice` sign **reversed and floating at the narrow bike-tower end**, two dark triangular wing-roof undersides, and a freestanding semicircular white portal arch intersecting a horizontal beam.

The historical station photo archived at [Stellwerke.info](https://stellwerke.info/stw/stw.php?id=22402) shows the blue plaque facing passengers on a **long railway-facing facade below the low roof**, rather than hovering above the gable end. The old code picked whichever wall segment had the largest distance projection toward a railway point, even when it was far from the station's central frontage. It also used a double-sided text plane at the *unflipped* wall angle; from the bike tower this displayed a mirrored label.

**Fix:** restrict the plaque to the original mapped long exterior wall that crosses central axis s = -2.4 m on the negative transverse/rail side. Compute the actual outward-pointing normal and use it for BOTH offset and plane rotation. The plaque is now small, one-sided, and at ~3.2m height, below the 3.7m wing eaves; if the valid rail wall cannot be identified, do not generate it. Ground-wall colliders and the mapped passage remain unchanged. The two low wings are now compact *hip* roofs so their short ends no longer open into dark gable wedges; roof geometry still clips to the exact OSM footprint (no bounding roof overhang). The former white semicircular torus over the station walk-through is removed because its 1.75m radius crest intersected its own lintel/roof. A conservative flat masonry header with slender jambs keeps both actual OSM-aligned passages open.

**Limitations:** original photo date and precisely surveyed architectural details are unknown; rail façade sign longitudinal anchor, dimensions and actual passage lintel remain informed approximations. No unsupported side cafe or green canopy is recreated.
