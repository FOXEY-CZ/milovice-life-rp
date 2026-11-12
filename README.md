# Milovice Life RP — 4.7 Old Town Recognition

**Hra:** https://foxey-cz.github.io/milovice-life-rp/

Browser-based singleplayer RP prototype using real OpenStreetMap footprints of Staré Milovice and the official ČÚZK terrain. **Not** yet a photorealistic digital twin.

## 4.7 mapped landmarks

| Place / feature | Geodata | Work done |
| --- | --- | --- |
| Full-sized map | Game-simulated location, not phone GPS | Blue live player arrow, recenter, nearby landmark pins |
| Milovice railway station | OSM way 53865956 | Two physical open portico faces in station ground floor, arches, a platform canopy, station sign |
| Milovická Nádražka | Located in station building | Small cafe facade, serving window, courtyard seating; exact storefront wall inferred |
| Station shop | Reported by local player | Provisional shop frontage, exact tenant and physical face not yet verified |
| Modrá hvězda | Mírová 134/11, OSM way 202367194 | 2-floor photo-matched ochre/orange facade, red ground floor, white trim and balcony |
| Mírová 243/36 | OSM way 202367254 | Cream plaster, deep red roof, dormers, corner shop |
| Potraviny D a Š | Mírová 74/4, OSM way 202298645 | Verified address; provisional grocery facade |
| Cyklověž Milovice | OSM way 1011197691 | Tall faceted translucent glass/metal circular biketower |
| Church of St. Catherine | OSM way 118487991 | Neo-Gothic clock tower and spire |
| ZŠ T. G. Masaryka | OSM way 118487979 | School facade with signage |

See [architecture data & references](data/architecture-references.json), including photo author, historical date, license and model uncertainty. Many OSM building levels are missing or outdated. The new building heights remain **photo-derived estimates**, not survey measurements.

## Game
Controls: WASD/arrows to walk or drive; E to board/leave; C camera; R reset; M minimap; J jobs. Also supports mobile touch controls. Spawn picker offers walking, sedan, SUV, van, police car and bus. Only an **active bus job** shows doors, passengers and route markers.

## Sources and attribution
- Footprints, road centerlines, rail, paths: © OpenStreetMap contributors (ODbL).
- Elevation: © ČÚZK / Zeměměřický úřad DMR 4G (CC BY 4.0), offline 10 m sample grid.
- Photo sources: Wikimedia Commons and various documentary/business sites as visual reference only. No Google Street View image tiles or third-party photograph pixels copied into game.

## Quality checks
GitHub Actions validates JavaScript and runs a real Chromium WebGL smoke test on the 3D world, terrain, player/map marker, vehicle entry and bus job, including a two-opening station passage check. Repeated facade details are built with shared instanced geometry to reduce draw calls.

## Further work
Verify station shop, passage dimensions and each house level/roof against up-to-date photographs or survey; expand the geographic area after the center becomes recognizable.
