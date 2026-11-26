# CROSSVEX — regional release preview preparation

Baseline main 193debe569d2f712c79ce9524380fec5c668cf53, 2026-11-26. PR #149 pending; this is an independent delta, not a second open PR.

The staged package preview has so far exercised desktop startup, map, credits and driving in a limited scenario. The next check explicitly selects all six public districts through the normal spawn picker and waits for the actual regional loader plus 6.5 seconds of LOD processing. Each district gets a fresh browser page so previous district cache or spawn state cannot mask a missing dependency. Expected UI labels derive from fictional-identity.js; internal IDs are test inputs only.

The scenario records successful region loading, walking mode, public district labels and map attribution. It does not establish actual visual/photo accuracy, complete route coverage, frame rate, or mobile support. The read-only runtime diagnostics are used for assertions; no teleport/debug mode.

After #149 merge, reapply this delta onto the new main and integrate into a separate staged regional preview job with adequate timeout (six independent pages, sequential or bounded parallel). Reuse existing response observer and exact URL gate; save per-region partial evidence in finally. Verify no local missing resources or page errors; report remote failures/pending separately. Do not approve new external URLs without evidence. Mobile viewport coverage remains a separate task.

No tests executed yet and no runtime code changed.
