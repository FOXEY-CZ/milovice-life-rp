# CROSSVEX — release readiness and remaining decisions

2026-11-26, version 5.344. Technical evidence summary, not release authorization. Public Pages remains a development demo, not the curated staged player package. The working title and source geography are identifiable.

## Verified technical evidence
- Desktop startup/map/credits and driving/audio: 45823646420, 662 requests without errors, 281 staged files.
- All six districts: 45825095733, 1988 requests without errors, reduced staged package.
- Mobile emulation: 45826919551 and 45828531283, portrait and landscape, movement and vehicle controls; not physical devices or iOS.
- GLB registries and SHA-256: 45829949592 and 45830637238, nine files; four-angle visual review 45812498155.
- Complete library notices: 45819759597. CDN comparison: 45831919149, eleven files identical to pinned npm versions.
- Published architecture source inventory: 45833312724, five records matched, all pending rights review.
- #149–#153 merged; #153 passed 5/5 PR checks and preceding main 3/3 including scheduled playground and Pages. Architecture source audit candidate reapplied; new CI pending.

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

Technical PASS is not a legal decision. Keep source records and notices, do not approve all files mechanically, do not publish a release ZIP or remove geometry based solely on this checklist. Prioritize direct evidence or replacement choices rather than endlessly rerunning passing audits. Development resumption must preserve the identity and source rules in AGENTS.md; this document does not override the user's release-first decision. Staged reference discovery baseline 45833830640: 267 files, 369 URL occurrences (203 distinct scanner strings), zero literal image data URI hints, 48 texture API lines. Selected index.html texture code inspected: procedural sky, stucco, gravel and drawn signs; source-derived palette/zebra calls require producer review. Next engineering work: inspect remaining texture producers and actual player-visible source links, not automatically delete metadata. Then decide which blockers are actionable now versus needing owner/legal input.
