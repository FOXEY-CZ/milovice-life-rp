# CROSSVEX — release readiness and remaining decisions

2026-11-26, version 5.344. Technical evidence summary, not release authorization. Public Pages remains a development demo, not the curated staged player package. The working title and source geography are identifiable.

## Verified technical evidence
- Desktop startup/map/credits and driving/audio: 45823646420, 662 requests without errors, 281 staged files.
- All six districts: 45825095733, 1988 requests without errors, reduced staged package.
- Mobile emulation: 45826919551 and 45828531283, portrait and landscape, movement and vehicle controls; not physical devices or iOS.
- GLB registries and SHA-256: 45829949592 and 45830637238, nine files; four-angle visual review 45812498155.
- Complete library notices: 45819759597. CDN comparison: 45831919149, eleven files identical to pinned npm versions.
- Published architecture source inventory: 45833312724, five records matched, all pending rights review.
- #149–#154 merged. Architecture source audit PR #154 5/5 PASS; previous main 5/5 including Pages. Targeted procedural output evidence 45835510295: four outputs deterministic, SHA-256 recorded. Player credits preview 45835833866: six exact reference links, no embedded media, 662 network requests without errors; new candidate CI pending.

## Release blockers (not routine technical regressions)

| Area | Remaining work before final distribution |
|---|---|
| OSM / DMR | Keep #147 open: corresponding-data scope and access, actual service terms, transformation records, attribution. |
| Photo-derived architecture | Verify exact source terms and permissions; inventory geometry in other modules, not just five published cards. Replace disputed reference-driven details with independently evidenced equivalents if required. |
| GLB assets | Complete creator archive/mirror provenance review or replace unresolved models; 403 is unavailable evidence, not mismatch. Third-party rights and resemblance review remain. |
| Brand and world identity | Trademark screening for working names and visual check of remaining signage; no guarantee of anonymity because of GPS and geometry. |
| Other content | Audit generated/embedded imagery, audio, font sources, and contributor/distribution rights; browser traces do not exhaust all features. |
| Release packaging | Explicit review/evidence for each actual staged file using external manifest and strict checker, plus reviewed external resource policy; current inventory deliberately pending. |
| Platform testing | Physical phone/Safari checks, wider viewports, measured performance and audio output, final smoke on exact release candidate. |

Technical PASS is not a legal decision. Keep source records and notices, do not approve all files mechanically, do not publish a release ZIP or remove geometry based solely on this checklist. Prioritize direct evidence or replacement choices rather than endlessly rerunning passing audits. Development resumption must preserve the identity and source rules in AGENTS.md; this document does not override the user's release-first decision. Staged reference discovery baseline 45833830640: 267 files, 369 URL occurrences (203 distinct scanner strings), zero literal image data URI hints, 48 texture API lines. Selected index.html texture code inspected: procedural sky, stucco, gravel and drawn signs; three local palette/zebra producers inspected and tested in 45835510295. The five published building records now have candidate player-facing credit links with pending rights status. Other sources remain open. Next engineering work: focus on actual release decisions and concrete player-visible identity defects; keep the legal issues tracked rather than repeatedly adding equivalent evidence-only tests. Owner/legal input is required to settle distribution rights and working marks.


## 5.350 and next distribution option
#168 10/10 PR PASS, main 69598567 7/7 PASS including Pages. Opt-in original vehicle batching and ownership passed city, GLB swap/reset/fallback and isolated lifetime. Not hardware FPS or rights clearance. New procedural-only staging option removes the active car/human GLB loaders from that candidate, retains historical credits, and leaves original public demo unchanged. Validation pending; this is a concrete alternative to shipping unresolved GLB files, not a resolution of map/architecture/contributor rights. See docs/RELEASE_PROCEDURAL_PROFILE.md.


## Committed staging revision (candidate)
The staging builder requires a clean tracked checkout rooted at the repository, enumerates paths from its exact HEAD commit, prints the source revision, and rechecks the clean revision after copying before reporting success. Ordinary staged/unstaged tracked edits are rejected; untracked files are not included. Fixture tests cover both edited states and untracked exclusion, plus the existing committed unknown/missing data cases. This is a reproducibility guard, not a cryptographic attestation or release approval; concurrent modification and Git configuration remain outside its guarantee. CI pending.
