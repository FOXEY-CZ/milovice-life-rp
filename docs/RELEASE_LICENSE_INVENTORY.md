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
