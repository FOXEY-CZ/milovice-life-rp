# Historical unit reconciliation

PR #165 candidate 1c2d554: standard validation and seven of eight workflow suites passed; full discovered sweep 45870683490 reported 265/278. Independent branch based on exact main db7c7152c3e56b7969bc78eb4832e06b23604d08. Run unchanged main and reconciled-test tree separately; both fail normally on errors. No runtime, map source, geometry or CI gate changed. All 13 failing files retain their existing unit geometry, source and collision assertions; only obsolete build/cache pins and renderer integration string checks adjusted to current main code. Baseline equivalence and successful corrected sweep are still pending. Do not merge this diagnostic workflow or mark failures as pre-existing until results are verified.

- osm-armadni-landmarks-5118.test.mjs
- osm-armadni-refuge-island-5190.test.mjs
- osm-slepa-armadni-road-joins-5115.test.mjs
- osm-slepa-footway-joins-5111.test.mjs
- osm-slepa-house-frontage-5112.test.mjs
- osm-slepa-park-ground-5114.test.mjs
- osm-slepa-pedestrian-endpoints-5116.test.mjs
- osm-slepa-residential-5109.test.mjs
- osm-slepa-street-5110.test.mjs
- osm-slepa-substations-5117.test.mjs
- osm-slepa-utilities-5113.test.mjs
- osm-visnova-eight-floor-5198.test.mjs
- osm-visnova-neighbor-5197.test.mjs
