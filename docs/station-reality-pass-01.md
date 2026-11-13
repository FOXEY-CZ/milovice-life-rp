# Milovice RP 5.24: Strict Reality Pass 01 — Milovice railway station / bus interchange

**Date:** 2026-11-13. **Scope:** photographed bus-stop poles A/B and removal of invented details at the station. This is NOT a claim that the entire station, station roofs, passages, shop doors, terrain furniture or 2026-era condition are metrically exact.

## Reliable sources

| Feature | Dated evidence | Precisely supported | Still uncertain |
|---|---|---|---|
| Stop **A** | ŠJů, Commons *Milovice, žel. st. A, zastávkový sloupek.jpg*, 2024-05-30, CC BY 4.0. https://commons.wikimedia.org/wiki/File:Milovice,_%C5%BEel._st._A,_zast%C3%A1vkov%C3%BD_sloupek.jpg | Stop letter and name, stop on **Nádražní**; geotagged **photographer position** 50.2290750, 14.8822053; image compass 250° | Exact pole foundation point, sign dimensions, current advertisements |
| Stop **B** | ŠJů, Commons *Milovice, žel. st. B, zastávkový sloupek.jpg*, 2024-05-30, CC BY 4.0. https://commons.wikimedia.org/wiki/File:Milovice,_%C5%BEel._st._B,_zast%C3%A1vkov%C3%BD_sloupek.jpg | Stop letter and name, stop on **5. května**; Structured Data photo viewpoint 50.2288290, 14.8825740; image compass 175° | Exact pole foundation point; Commons raw caption includes a discrepant GPS tag, so viewpoint is *not* a surveyed stop coordinate |
| Stop A/B arrangement and routes | ROPID / PID, Milovice interchange schematic in force from **2024-12-15**: https://pid.cz/wp-content/uploads/mapy/uzly-region/Milovice.pdf | **A** near station building at Nádražní; **B** farther southeast beside 5. května; published route information for 430, 432, 434, 497 | Diagram is schematic, not cadastral geometry; service assignments can change |
| Station shell and bike tower | Project's OpenStreetMap snapshot (ODbL), building OSM ways `53865956` and `1011197691`. 2024 station/forecourt CC BY 4.0 photographs: https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_autobusov%C3%A1_zast%C3%A1vka_a_cyklov%C4%9B%C5%BE.jpg | Authentic geospatial positions of building/tower outlines | Platform openings, roof slopes, windows and exact door coordinates need facade-by-facade measurement |
| Milovická Nádražka | České dráhy `Železničář` 08/2022; community listing https://www.nadrazky.eu/hospoda.php?hospodaID=100273 | Café/service was within station waiting-room area; seasonal outdoor tables were documented in 2022 | Exact door/serving-window frontage, number and positions of tables, whether the same service still operates today |

All game geometry is original. No copyrighted photo pixels are copied into game textures.

## 5.24 implementation

1. **Station stop placement:** Both poles are seeded from **individual geotagged photo viewpoints** rather than unrelated guessed distances from the station center. A 0–6 metre radius searches the closest location that clears *every mapped OSM road/footway* and nearby station/bike-tower footprints. The result remains an estimate of the pole, **not** a surveyed real-world position.
2. **Source-grounded orientation:** A must be on the Nádražní side; B must lie farther east/south on 5. května. Routes on basic stop panels reflect official dated PID interchange source, **not** live departures.
3. **Removed fictional station details:** an `ODJEZDY` board at an unverified exact location, random platform benches/urns, an `OBCHOD` sign with no matched shop photograph, the unsupported `469 / 13` plate, and two invented café tables/chairs.
4. **Deferred other forecourt props:** The photographed broadleaf tree, double-arm lamp and flowers are *real types of objects*, but their originally hard-coded offsets from the station centroid are unverified. They are **not** spawned in strict-reality mode until a measured/photographically triangulated position is documented. Genuine mapped parks/forest and the separate 5. května photo block remain.
5. Keep 5.20 mobile GPU materials, full-resolution terrain, and 5.22 road/footpath collision safeguards untouched.

## Quality gates

- `node scripts/station-forecourt-pass.test.mjs` proves photo source metadata and distinct, road-safe A/B coordinates relative to the actual OSM station; non-geolocated objects are deferred.
- Chromium smoke checks exactly 2 photo-anchored stop signs and absence of undocumented station props, alongside car, pedestrian, stream loading and editor smoke tests.
- `window.__miloviceStationForecourt` exposes both stop camera displacements, street labels and deferred items.

**Next evidence to find:** photographs from multiple directions and geotagged views of station façade, passage, Nádražka entrance and opposite platform; precise positions of tree/lamp/planters; verified parking and barrier geometry. Only then reintroduce the corresponding detail meshes. Do not use unlicensed Google/Mapy panorama content to reproduce proprietary building textures.
