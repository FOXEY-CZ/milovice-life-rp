# CROSSVEX — targeted procedural texture evidence

Baseline 9b03ce2d58a3f752fcce645aa1cc2ac5541c72c3, independent preparation while #154 is under review.

Read actual producer code at baseline:
- scripts/osm-hzs-facade-5315.js: makeHZSCladding5315 and makeHZSShellPalette5315 fill RGBA arrays with constant, model-estimated palette colors and row periods; the source links are metadata, no fetch or pixel extraction in these functions.
- scripts/osm-juventa-school-facade-5307.js: makeJuventaFacade5307 fills a 1×128 RGBA palette with two model colors and approximate 0.95 m band, no image input. Municipal PDF is cited as visual reference, not a license grant.
- scripts/osm-topolova-zebra-paint-5187.js: makeTopolovaZebraPaintPixels5187 constructs 64×64 seeded xorshift paint noise with fixed color channels; explicitly not photo-verified wear.

New staged test runs these exact exported functions and validates four outputs: deterministic bytes, dimensions, opacity, color/band/period constraints and invalid parameter handling; emits SHA-256 evidence. No runtime edits. Output digests are recorded, not independently pinned yet. Code inspection supports procedural creation for these specific generators; it does not prove all textures are original, clear rights in referenced architecture, or establish that arbitrary future changes cannot load images. No release authorization. CI pending. After reviewing results, address actual player-visible external links and remaining content rights, avoid duplicating evidence-only workflows indefinitely.
