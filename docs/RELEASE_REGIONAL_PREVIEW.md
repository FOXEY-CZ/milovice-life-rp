# CROSSVEX — regional release preview preparation

Baseline main 193debe569d2f712c79ce9524380fec5c668cf53, 2026-11-26. PR #149 pending; this is an independent delta, not a second open PR.

The staged package preview has so far exercised desktop startup, map, credits and driving in a limited scenario. The next check explicitly selects all six public districts through the normal spawn picker and waits for the actual regional loader plus 6.5 seconds of LOD processing. Each district gets a fresh browser page so previous district cache or spawn state cannot mask a missing dependency. Expected UI labels derive from fictional-identity.js; internal IDs are test inputs only.

The scenario records successful region loading, walking mode, public district labels and map attribution. It does not establish actual visual/photo accuracy, complete route coverage, frame rate, or mobile support. The read-only runtime diagnostics are used for assertions; no teleport/debug mode.

After #149 merge, reapply this delta onto the new main and integrate into a separate staged regional preview job with adequate timeout (six independent pages, sequential or bounded parallel). Reuse existing response observer and exact URL gate; save per-region partial evidence in finally. Verify no local missing resources or page errors; report remote failures/pending separately. Do not approve new external URLs without evidence. Mobile viewport coverage remains a separate task.

No tests executed yet and no runtime code changed.

## Isolated baseline execution
A preparation-branch workflow now runs six independent desktop scenarios in three groups with at most two runners concurrently. This is on the pre-#149 main baseline; successful results will not establish the reduced package works until the same delta is reapplied and tested after #149. Per-region exact URL audit, local failure checks and response summaries retained. Remote failures and pending requests are reported separately; no release authorization. CI pending.

## Baseline evidence and reduced candidate
Run 45824495393 PASS, 3/3 groups, 6/6 districts. Old Town and Maple Heights 330 requests each; Westwood, Betweenwoods, Northlink and Cloudridge 332 each. Total 1988; zero HTTP errors, failed/pending requests, redirects, page errors, missing local resources or unknown URLs. Four known GLBs not observed. This run predates #149 and does not validate the reduced package. PR #149 merged after 7/7 PR CI and prior main 5/5 including Pages; candidate reapplied to main 6141018d1c480e10a0ae05fe393ac2013205a60f with map-data audit in every regional runner. Candidate CI pending; mobile and actual visual/FPS evidence not covered. Workflow triggers deliberately narrow to avoid historical fan-out; manual rerun available for world changes.
