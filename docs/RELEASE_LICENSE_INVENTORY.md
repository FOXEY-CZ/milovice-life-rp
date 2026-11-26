# CROSSVEX — evidence inventory before distribution

Baseline: main `4db6498dd65ed1e95a2909a5d9dcd5ea11c21c37` (5.342), 2026-11-26. This is a repository inspection, not independent verification of legal rights. All entries below remain release-review items. Do not describe the game as legally cleared or anonymized.

## Runtime models: nine enumerated GLB files

| Source module | Exact files | Pinned mirror commit | Declared license |
|---|---|---|---|
| scripts/human-assets.js | modular_men/Casual.glb; modular_women/Casual.glb; modular_men/Suit.glb | trebeljahr/quaternius-showcase @ 0128ca510d653bb04d6d1e4885bd8890b5050b4f, public/glb/ | CC0-1.0 |
| scripts/nature-assets.js | nature_pack/CommonTree_3.glb; nature_pack/BirchTree_2.glb | same showcase commit and root | CC0-1.0 |
| scripts/vehicle-assets.js | spectral_gt_rs_game_ready.glb | JaronKBragg7337/spectral-gt-rs @ 34499c501908818a2b08e589a7aecf963343cee7 | CC0-1.0 |
| scripts/vehicle-assets.js | quaternius-suv.glb; quaternius-car.glb; quaternius-sport.glb | bennibeni/garage @ 5c26fd4bac37080cd55f8064c59de4b14b489ddd, public/models/ | CC0-1.0 |

For each exact file: acquire bytes, compute SHA-256, record original pack/item and license evidence, verify mirror provenance and embedded textures/animations. A pin is not proof of ownership or permission. Retain evidence for the actual distributed bytes. Only vendor locally after the rights check; preserve existing procedural fallbacks.

## Code, data and reference inventory

| Category | Repository evidence | Outstanding release check |
|---|---|---|
| Three.js | index.html import map: jsDelivr three@0.160.1 and examples/jsm/ | Exact MIT notice, complete dependency closure and transitive notices |
| Leaflet | index.html map loader: unpkg leaflet@1.9.4 CSS/JS | Exact BSD notice and dependency/resource inventory |
| OSM | data/milovice-osm.json and five regional geometry snapshots; scripts/download_osm.py | ODbL attribution, classification of distributed derived database/produced work, corresponding data access and applicable notices |
| Elevation | data/milovice-terrain.json and five regional terrain snapshots; scripts/build_terrain.py declares DMR 4G CC BY 4.0 | Verify exact datasets, attribution, modifications and redistribution terms against provider metadata |
| Other source data | data/architecture-references.json, data/architecture/ and street inventory | Trace RÚIAN, source photographs, plans and any mixed-source records individually |
| Photos and plans | index.html source records and docs; Commons, Mapy.com, businesses, municipal documentation | Distinguish reference-only work from copied pixels/assets; verify each actual inclusion and applicable rights. Do not automatically package source imagery. |
| Audio | index.html Web Audio oscillator horn and GPS voice integration | Inventory every radio stream, audio source and generated sound; confirm stream rights and device speech service behavior |
| Fonts | credits.html system-ui; other font and texture use not fully checked | Identify any embedded or external font and relevant redistribution terms |
| Own code and procedural assets | scripts/, index.html and other project pages | Confirm contributor rights and intended project distribution license; avoid implying an open-source license solely because repository is public |

## Distribution boundary

Recursive Git tree inspection found 807 entries (including directories), 18 tracked data files and no tracked files with common GLB/GLTF, JPG/PNG/WebP/SVG, MP3/OGG/WAV or TTF/WOFF extensions. This is not proof of absence: remote resources, embedded content, generated textures and other extensions require separate inspection. The deployed game is not yet a curated release package.

- Preserve source metadata and required attribution. Do not treat removing names or hiding developer tools as anonymization; exact source geometry and GPS can reveal the place.
- Separate playable entry points and required runtime assets from internal tools, evidence and test files. Do not remove required database access or license notices.
- Generate a manifest of actual release files and remote runtime requests, compare it against the reviewed inventory, and fail release validation on unknown entries. Capture a browser network trace across gameplay, map, models, audio, and credits.
- Require exact license texts/notices where applicable; keep evidence for source data and transformations. Test the resulting package with network disabled where offline functionality is intended.
- Before commercial/public final release, review working marks CROSSVEX, Ironfield, CrossTransit and fictional shops, plus remaining logos, signage and identifiable locations. Obtain qualified legal review where rights or database obligations remain uncertain.

## Current scope

5.342 staging, checker self-tests and desktop Chromium startup/map/credits passed in isolated workflow 45739287501. Preparation reconciled with 5.343 main; repeat test pending, including default-hidden developer controls. No deployment or release authorization. Review network trace, upstream evidence and actual release manifest next.


## Observed exact bytes — 2026-11-26
Successful [preview run 45742322194](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45742322194), artifact 15082141059. All nine parsed as GLB 2.0; all seven previously declared sizes matched. The parser reported zero core glTF images and zero external buffer/image URIs for each file. Geometry, material colors, vertex colors, extensions and visual marks still require review. The following hashes are byte-identity baselines, not license approval.

| Model | Bytes | SHA-256 |
|---|---:|---|
| casualMan | 785308 | `dc2d86e50075e372df870bb60cee46c56033cc2ecb28722523caab93ab1d0111` |
| casualWoman | 804896 | `522cd442880c6769bdf079f1a2161a1aaffe78b32f1de64fb990644b2e327fea` |
| suitMan | 857732 | `a9896c1468fadbd24a89a2f86eecd8d47ae5ec6b3ef267b2194dc3b8bb9fb3d0` |
| broadleaf | 89340 | `01ce29544f56c7f1d0828fe8268b45ff3d75a4612b067ac3707c9bfb11a02f7f` |
| birch | 90348 | `165aac1b43f009cd7b8145242c86f5b189917281324d272eafde312cd09d16c8` |
| spectralGT | 4688844 | `e7b7f0d9de0c3bc3897c8134b1ceae5631b1da2690d336df18c3ea82e7238c73` |
| citySUV | 181608 | `1a9ce2bba813dca5005abab09715b01b8b5f4a9c48d7260463afdfeb876aa8b6` |
| cityCar | 174320 | `e5f5fa41c4434383b20287725c0e9d757cbd0f059eedc342ec265d32a195fe39` |
| citySport | 175100 | `bbb1c718d2aaf5f4344e9fb2cd66d8332a998a515b09ddd4dfa14698d787124e` |

The audit now rejects a byte/hash mismatch against this observed baseline; rerun PASS (45742460495). No assets vendored, rights or trademark clearance still pending.


## License evidence checked 2026-11-26
- Three humans and two trees: [pinned mirror LICENSES.md](https://github.com/trebeljahr/quaternius-showcase/blob/0128ca510d653bb04d6d1e4885bd8890b5050b4f/LICENSES.md), blob bed8b3f67c7446e4d48aaa0d24ea19943c23065b. Mirror explicitly distinguishes its MIT code from CC0 models and maps the modular men/women directories. Its stated source-copy date is December 2022. Independently inspected creator pack pages: [Men](https://quaternius.com/packs/ultimatemodularcharacters.html), [Women](https://quaternius.com/packs/ultimatemodularwomen.html), [Nature](https://quaternius.com/packs/ultimatenature.html): each identifies CC0. These pack declarations support provenance but the exact exported GLB bytes have not been compared to the creator archives.
- Three Quaternius cars: [pinned mirror LICENSE.txt](https://github.com/bennibeni/garage/blob/5c26fd4bac37080cd55f8064c59de4b14b489ddd/public/models/LICENSE.txt), blob 99b04bc8038949c7500863fb26b0319183cc73f5. Identifies original compressed GLB URLs individually. [Cars Bundle](https://poly.pizza/bundle/Cars-Bundle-FE5IWe6OMk) identifies CC0 and Quaternius. Exact decompressed upstream byte comparison pending.
- Spectral GT RS: [pinned LICENSE](https://github.com/JaronKBragg7337/spectral-gt-rs/blob/34499c501908818a2b08e589a7aecf963343cee7/LICENSE), blob 8f40c549094ff25ff1e2a8cdc597f29f78195b9a; [README](https://github.com/JaronKBragg7337/spectral-gt-rs/blob/34499c501908818a2b08e589a7aecf963343cee7/README.md) specifically includes the game-ready GLB and claims original procedural authorship and CC0. Third-party rights not independently cleared.
- Evidence status: source declarations corroborated; exact-byte fingerprints verified; visual review, original archive comparisons, third-party rights and final release approval pending. CC0 does not settle trademark rights. See https://creativecommons.org/publicdomain/zero/1.0/legalcode.
