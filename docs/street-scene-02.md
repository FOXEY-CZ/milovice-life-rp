# Milovice RP 5.21: photo-informed whole-street environment, 5. května

**Status:** first implemented photo-grounded street-scene pass, not proof that the whole street or current 2026 layout has been reconstructed precisely.

## What changed

The workflow now treats an entire street scene as the unit of work: buildings, road, sidewalks, planted verges, fences, garden boundaries, signs, overhead wires and parked vehicles. Photo-grounded scene assets are separate from procedural filler.

**Implemented public-scene anchor:** 5. května, Milovice, photo point **50.227797, 14.884813**. The position is matched to the nearest segment of OSM highway way **219273174** (5. května), keeping the existing roadway geometry untouched. The project has a selectable spawn preset **📸 5. května – fotoblok (2014)**.

The observed 2014 features modeled as original 3D geometry:
- Closely pruned deciduous street tree and planted verge shrubs/flowers.
- Brown directional finger signs: Městská policie, Sběrný dvůr, Mirakulum.
- Timber pole and two indicative suspended cables.
- Low stone frontage boundary and dark wooden gate.
- Narrow green strips alongside the existing real-OSM street and sidewalk.

The mobile rendering pass uses spatially localized groups and instances. Existing synthetic street trees and lamps are suppressed in the photo reference corridor to avoid doubling the furniture, while other districts still use the regular procedural pass.

**Important:** The 2014 photo's point-of-view coordinates are verified. The position of each sign, tree, property gate, wire attachment, and planting bed **is an approximate 3D interpretation**, not a cadastral/engineering survey or confirmation that these features exist unchanged in 2026. The image itself is never copied into game textures; textures and geometry are generated originally.

## Reference and licensing

- **Tiia Monto**, *Milovice - 5. května.jpg*, **2014-07-26**, Wikimedia Commons, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Image and metadata: https://commons.wikimedia.org/wiki/File:Milovice_-_5._kv%C4%9Btna.jpg
- Mapped road centerline: OpenStreetMap contributors, OSM way 219273174, ODbL; spatial snapshot `data/milovice-osm.json`.
- Earlier 2024 photos of the adjacent intersection and buildings: `docs/street-pass-01.md` (original author ŠJů, CC BY 4.0).

**Next spatial passes:** use additional public/private-authorized photos to confirm each feature's side of street, setback, date and exact neighboring building. Extend the same schema road by road, particularly around Školská, Mírová, 5. května and the railway station. Do not silently label unverified photo-relative placements as exact.

## Test contract

`window.__miloviceStreetEnvironment` publishes the scene ID, count of instances and draw meshes, photo reference, and approximate-location flag. The Chromium smoke test checks the photo-scene source and OSM anchoring, that the environment appears in the old-town map and that the shared **v5.20 GPU profile** remains enabled for mobile. It cannot certify real-phone FPS.

Performance principle: no forced DPR downscaling; batch plant/prop geometry, and cull distant scene detail normally through the existing 160m spatial LOD manager.

## 5.23 street-detail pass

Added **original, instanced** paving slabs, a narrow curb line, drainage-grate details, masonry capstones, shallow mortar joints, and wooden gate slats to the already source-referenced 5. května scene. These are visual interpretations of typical materials in the referenced streetscape, **not individually surveyed positions or an assertion that each stone/slat appears in the historical photo**.

Every pavement and curb candidate is tested against `createRoadClearance.isClear` using **all loaded OSM road and footway ways** before drawing. Rejected paving is counted in `window.__miloviceStreetEnvironment.roadRejected`, and accepted pieces in `pavementPieces`. These surfaces use instanced boxes and share existing Lambert materials, keeping the GPU optimization and removal of random roadside lamps/trees intact.
