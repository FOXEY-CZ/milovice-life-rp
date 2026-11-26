# CROSSVEX — CDN library byte integrity evidence

Baseline main 863a12dff1f08b6584dd3c0327d1df2c86626409; independent prep while PR #152 is reviewed.

The existing browser trace identified four pinned Three.js 0.160.1 modules and two pinned Leaflet 1.9.4 JS/CSS URLs. License text matching has already been tested separately. The new isolated audit installs exactly those npm versions with lifecycle scripts disabled and compares each of the six CDN responses byte-for-byte, recording both SHA-256 digests and sizes. It also checks five Leaflet distribution PNGs, including CSS layer/marker images and default marker variants, which may be requested in future map scenarios; their inclusion here does NOT add them to the browser network allowlist or assert they were observed. Non-data CSS url() references are listed and an unreviewed reference fails the evidence check.

Redirects, HTTP errors, oversized responses, mismatches and missing files fail; partial evidence retained. No changes to runtime code, CDN URLs, licensing or release manifest. This is sampled response evidence, not runtime subresource integrity enforcement, proof of all transitive dependencies, offline capability, or legal approval. Source maps, future dynamic resources and browser-specific behavior remain separate. Preview CI pending.
