# CROSSVEX — staged mobile preview preparation

Baseline 6141018d1c480e10a0ae05fe393ac2013205a60f (reduced package from #149); #150 still under PR review. Independent preparation branch, no second open PR.

Chromium emulates 390×844 portrait and 844×390 landscape, coarse pointer, touch and DPR 2. CDP touch dispatch exercises the actual analog joystick, its walking/running thresholds, immediate stop on release, public map and sedan spawn, touch gas and horn. Requires actual movement and speed; no bypass if spawn collision prevents movement. Records per-profile requests/responses and screenshot, exact external URL gate and local error checks. Map-data audit retained. No changes to runtime code, no evidence of actual physical mobile performance, browser speech/audibility, iOS Safari or broad screen-size coverage.

Preview push pending. After #150 merge, reconcile this delta with current main and review actual failures or evidence before opening PR. No release authorization.

## First emulated run and diagnostic retry
Run 45825523512 failed in both orientations at the first analog movement wait, after public walking controls appeared. Each profile recorded 323 requests, zero HTTP errors, failed/pending/redirected requests or missing local resources and zero uncaught page errors. Leaflet missing from trace because test failed before map; exact URL check correctly remains strict. Cause not proven. Retry starts touch directly at 45% stick deflection rather than center then small drag, verifies actual hit target and stick magnitude separately from movement, records pointer event targets and movement snapshot before release on failure. No runtime change or relaxed movement assertion. Candidate reapplied to main f8b2906a71a4d4781a0c5e79672bfba5bd91f2ce after #150 merge; new CI pending.

## Successful diagnostic retry
Run 45826919551 PASS, both orientations. Actual joystick hit confirmed, magnitude approximately 0.45, measured instantaneous walking speed 0.8 m/s and running 3.73 m/s, stop on release verified; map, touch acceleration (2 km/h sampled) and horn control pass. 331 requests per profile, 662 total, zero HTTP errors, failures, pending, redirects, unknown URLs, missing local resources or uncaught page errors. This establishes that the revised touch sequence works without runtime changes; original center-start failure is not conclusively diagnosed. Three known model URLs unobserved, horn audibility not measured, real phones and iOS not tested. Add narrow PR triggers to preserve this gate; revised workflow CI pending.
