# CROSSVEX — runtime model registry cross-check

Baseline f8b2906a71a4d4781a0c5e79672bfba5bd91f2ce, independent preparation while #151 is under review.

The existing nine-GLB byte audit uses its own exact pinned URL table. It can miss a newly added runtime model if the table is not updated. The new `--check-runtime` mode imports the real HUMAN_ASSETS, TREE_ASSETS and LICENSED_VEHICLES exports with npm three@0.160.1 (same revision as game), compares IDs, exact URLs, declared sizes and available license declarations to the existing audit entries and observed hashes. Trees have no per-entry license/size field; their source declarations and observed hashes remain separately recorded. No changes to the game or asset bytes.

The independent GLB workflow records the runtime comparison, then reruns the original strict byte audit. No automatic legal approval. This only covers these three declared registries, not arbitrary future loaders or all embedded/procedural assets. Original archive comparisons for Quaternius remain incomplete; original car endpoints returned HTTP 403. No vendoring or license changes. CI pending.

## Verified baseline and reconciliation
Run 45829949592 PASS on 17839573645512d1dda097e1f9a9dac7e295f55c: 9 runtime entries / 9 audit entries, zero registry issues, 9/9 size and SHA-256 matches, no core images or external buffer/image URIs. Original archive comparison was skipped (manual-only); not a license approval. PR #151 merged after 5/5 CI and previous main 5/5 including Pages. Delta reapplied to 863a12dff1f08b6584dd3c0327d1df2c86626409; targeted PR triggers ensure edits to the three registries or audit itself run this check. Candidate CI pending. No runtime changes.
