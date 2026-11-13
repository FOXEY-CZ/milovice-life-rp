# Milovice RP – street-by-street architecture workflow

**Purpose:** A repeatable road-by-road building reconstruction process. Avoid getting stuck on one landmark and avoid pretending that OSM geometry or generated facades already match reality.

### 1. Inventory
Open **/editor.html** (hosted by the same GitHub Pages site as the game). The district selector loads checked-in OSM road and building geometry from /data; the street list assigns each building to its mapped \`addr:street\` or the nearest **named** road if the distance is <=100 m (heuristic; always validate). The selected building has a persistent OSM way identifier and geographic centroid.

### 2. Reference navigation
Links open Mapy.com and Mapillary *around the selected house*. They do **not** guarantee panorama coverage or a photograph of the exact facade. Mapy.com Panorama is navigable with arrows/drag and can show earlier years. The editor does not automatically scrape or copy panorama data. Google Maps Platform Street View content must not be scraped or used to generate derivative 3D building models without appropriate permission. Use imagery and sourced details only in ways compatible with provider conditions; for commercial game assets favor self-captured/authorized sources and open-licensed imagery whose attribution/share-alike requirements are understood.

### 3. Capture attributes and uncertainty
Track each individual building: source URL, floor count, measured/estimated height, roof shape/color, facade color, windows, doors/entrances and visual uncertainties. Mark as **verified** only after source URL plus actual observations are recorded. Never assume a back facade from one frontal photo; seek another image, aerial/cadastral evidence, or leave that face as low confidence.

### 4. Build + compare
Reconstruct the exterior geometry against the *same OSM footprint and georeferenced position* as the game. Prefer measurable roof/eaves heights from authorized data, or mark as approximate. Add a side-by-side annotated capture for a chosen camera position in real-world imagery and in-game, checking width, height, roof slope, number of windows, window shape, entrances and ground furniture. Do not claim photo-verified precision from generated defaults.

### 5. Version control and progress
The editor persists cards using localStorage on the current device. Export to \`milovice-street-architecture.json\` and commit reviewed data to the project; for a different browser, import the export. **Progress is not yet automatically synchronized to GitHub or the game's player save data.** Avoid putting private images or API keys in the repository. Ensure no third-party photo pixels are embedded without reuse rights. Store per-building confidence/attribution in the committed architecture reference manifest and link back to stable OSM identifiers.

### Sources
- OSM geometry: ODbL / © OpenStreetMap contributors.
- ČÚZK DMR 4G elevation: CC BY 4.0.
- Mapy.com Panorama: navigate in the provider app; do not bulk scrape imagery.
- Mapillary: publicly browsable user-sourced imagery; refer to the applicable license and its attribution/share-alike conditions.
