# Milovice Life RP — 5.1.1 Realistic Models & Station

**Hra:** https://foxey-cz.github.io/milovice-life-rp/

Browser-based singleplayer RP prototype using real OpenStreetMap footprints of Milovice and official ČÚZK terrain. **Not** yet a photorealistic digital twin or an exact reconstruction of every house. Some regional buildings have mapped heights; untagged buildings use archetype-based approximations.

## 5.1.1 — Licensed 3D cars and realistic station

- Real Three.js GLTFLoader imports high-detail GLB car geometry and materials, not a 2D car picture.
- Spectral GT RS is a 4.7 MB CC0 sculpted sports coupe with interior, glass, rims and paint. It is an original unbranded car, NOT a Škoda, Toyota or BMW.
- An unbranded CC0 Innerscene SUV GLB (about 623 KB) is loaded on demand when driving a suitable SUV.
- On desktop the model setting defaults to Auto. On touchscreens the cheaper procedural cars remain standard; the player can override it. Only ONE high-polygon vehicle can be active near the player or while driving, keeping distant traffic inexpensive.
- GLB network failures automatically return to original working procedural vehicles with visible status.
- The railway station gains a glass-fronted street entrance, verified address marker 469/13, waiting benches, information case, trash bins and a tactile strip, without sealing the pedestrian through-passage.
- Shape and position of the station footprint comes from mapped OSM coordinates. Extra furniture is artistic placement, NOT a surveyed digital twin.

### External asset licenses and credits

| Model | Author | License | Source |
| --- | --- | --- | --- |
| Spectral GT RS GLB | JaronKBragg7337 | CC0 1.0 | https://github.com/JaronKBragg7337/spectral-gt-rs |
| Unbranded SUV GLB | Innerscene | CC0 1.0 | https://www.innerscene.com/tools/library/3d-parts/suv-dc972cab |

The native Three.js loader downloads CC0 assets directly from their original author hosts. Source files are not modified or redistributed in this repository. No manufacturer endorsement is implied.

Remaining limits: accurate GLB bodies for real Škoda, BMW and Toyota models are not installed; the playable PID bus and train are still original approximations, and not every Milovice building has been photo-modeled. Official Škoda fan 3D print models forbid commercial use and cannot be substituted into this commercial-capable game.

## 5.0 — connected living town / in-game LOD

- Player-selectable draw distance: **360 / 620 / 1,000 m** (stored locally). Fog and perspective clipping follow the chosen distance; near facade instances remain detailed while distant wall silhouettes stay visible.
- Real **OpenStreetMap forest, grass, park, playground and sports pitch polygons** are now used to build terrain-coloured 3D landscape areas. Forest and park tree placement is bounded, deterministic and locally instanced; individual tree positions are generated *inside* real mapped green polygons, not taken from tree surveys.
- Terrain, buildings, signs, trees and architectural elements use real OSM/ČÚZK coordinates. City sectors preload once the player approaches; **no map loading screen between sectors**, although large sector downloads can still be visible on slow connections and uncovered outskirts remain incomplete.
- Facade detail batches are split by map cell. Original procedural roadside greenery and lamps are also divided into 200 m render cells; scene and GPU workload falls with distance.
- Original sculpted pedestrians and player character: face/hair/limb and clothing variations, arm/leg walking animation, lightweight distant silhouettes.
- Sculpted road-vehicle archetypes instead of default box bodies: generic hatchbacks, estates, saloons, crossovers, SUVs, vans, sculpted tires and glass. Paint uses original procedurally generated metallic micrograin textures.
- Regional route **432** is confirmed as active in 2026 and operated by OAD Kolín. A red/white bus inspired by contemporary PID livery replaces the previous yellow player coach; civilian traffic includes a stylized **18 m articulated regional bus** with bellows and extra axle. Its body is a non-certified game interpretation, not an accurate SOR NS 18 3D scan.
- Passenger boarding: gameplay bus-work stops now display temporary waiting pedestrians, who approach the coach doors during boarding. AI route 432 pauses at simulated stop checkpoints. **Not an official stop/timetable simulation**: published PID GTFS stop points and trips are not yet imported.
- Animated original three-car double-decker EMU, visually referencing the **ČD 471 CityElefant**. Follows OSM railway geometry and pauses near Milovice station, independent of the road traffic. A gameplay rail animation, **not an actual 2026 train timetable**.

Public transport references: [PID 432 operator and current stops](https://pid.cz/zastavkove-jizdni-rady/?cid=432&from=1792447200&type=busreg), [documented OAD Kolín SOR NS 18 on line 432](https://mhdfoto.cz/cs/foto/82701) (photos **not** copied), [ČD CityElefant train history](https://www.bluetrains.cz/soupravy-a-jednotky/elektricke-soupravy/cityelefant/). Manufacturer trademarks and logos are not embedded as manufacturer-certified assets.

**Important remaining work:** Individual BMW/Toyota/Škoda production vehicle meshes, officially licensed transit fleet models, actual stop coordinates and real schedules, street-level photo matching for every building and a full city-wide draw-call/FPS audit are **not complete**. Avoid calling these procedural approximations photorealistic or exact.

## 4.9 — station and recognizable neighborhoods

- Real photographs of the Milovice railway building show **cream plaster, white-framed windows and a dark red metal roof**. The 3D station now has a separate original standing-seam roof material on each of its three roof sections, an extended platform shelter with wood-toned support posts, a rail-side nameplate and a street-side nameplate.
- Ground-floor arched window heads, platform paving, Nádražka and the provisional shop remain part of the 3D station. The walk-through opening remains open; its exact dimensions and the shop location have **not** been surveyed.
- Braniborská and Rakouská now receive different **neighborhood-level facade schemes**. These are photo-inspired styles, not a claim that every individual exterior was verified.
- OSM roads are read before buildings, making nearby-street architectural classification deterministic. Region streaming now rebuilds lightweight visual trees and street dressing so more distant districts do not appear barren.
- Reference photographs: [Wikimedia railway station images, including September 2024](https://commons.wikimedia.org/wiki/Category:Milovice_(train_station)), [historical station frontage photograph](https://stellwerke.info/stw/stw.php?id=22402), [Braniborská / Komenského / Spojovací images](https://commons.wikimedia.org/wiki/Category:Soviet_modernist_architecture_in_Milovice).

**Limitation:** This remains a Three.js procedural open-world prototype. A building will not become photorealistic merely because its OSM footprint is correct. The still-missing house-by-house survey, high-quality 3D assets and exact textures are future work.

## 4.8 map expansion & graphics

- Five independently streamed OSM sectors: **Mladá, Benátecká Vrutice, Západní propojení, Mladá–Staré Milovice–Boží Dar, Boží Dar**. The older central extract remains the first sector.
- True local streets, service roads, rails and OSM building outlines. Data downloads are deduplicated by OSM way IDs in overlapping sectors.
- Matching **ČÚZK DMR 4G** regional elevation grids with 20 m gameplay sampling; old center retains more detailed 10 m DEM.
- The spawn vehicle menu now contains a **district selector**. As the player drives, adjacent regions are loaded progressively; citywide traffic gets new routes.
- Panel apartment blocks tagged 4–16 floors retain their height and receive photo-inspired facade styles, long balcony arrays, slab seams and entrance canopies. Houses, garages, schools, commercial and industrial buildings get different procedural facade treatment.
- Railway station model no longer uses one towering solid polygon. It has a raised central section, two low side wings, separate pitched red roofs and an open through-passage. Precise openings/roof dimensions remain *photo-informed approximations*.
- Graphics selector includes lightweight **balanced** mode and **realistic shadows** mode with localized PCF shadow casting; the latter can reduce FPS on phones.
- No photographs or Google Street View tiles are used as textures without suitable permission; only original procedurally generated game textures are embedded.

The area sectors are expanded **gameplay map windows**, not authoritative municipal boundary polygons. Additional distant countryside and exact landmark geometry remain incomplete.


## Earlier 4.7 mapped landmarks

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
Controls: WASD/arrows to walk or drive; E to board/leave; C camera; R reset; M minimap; J jobs. Also supports mobile touch controls. Spawn picker offers a regional location (including the Mladá and Boží Dar areas), plus walking, sedan, SUV, van, police car and bus. Only an **active bus job** shows doors, passengers and route markers.

## Sources and attribution
- Footprints, road centerlines, rail, paths: © OpenStreetMap contributors (ODbL).
- Elevation: © ČÚZK / Zeměměřický úřad DMR 4G (CC BY 4.0), offline 10 m sample grid.
- Photo sources: Wikimedia Commons and various documentary/business sites as visual reference only. No Google Street View image tiles or third-party photograph pixels copied into game.

## Quality checks
GitHub Actions validates JavaScript and runs a real Chromium WebGL smoke test on the 3D world, terrain, player/map marker, vehicle entry and bus job, including a two-opening station passage check. Repeated facade details are built with shared instanced geometry to reduce draw calls.

## Further work
Verify station shop, passage dimensions and each house level/roof against up-to-date photographs or survey; expand the geographic area after the center becomes recognizable.
