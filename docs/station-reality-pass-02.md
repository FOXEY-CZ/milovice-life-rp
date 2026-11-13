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
