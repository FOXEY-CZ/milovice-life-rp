# CROSSVEX — staged mobile preview preparation

Baseline 6141018d1c480e10a0ae05fe393ac2013205a60f (reduced package from #149); #150 still under PR review. Independent preparation branch, no second open PR.

Chromium emulates 390×844 portrait and 844×390 landscape, coarse pointer, touch and DPR 2. CDP touch dispatch exercises the actual analog joystick, its walking/running thresholds, immediate stop on release, public map and sedan spawn, touch gas and horn. Requires actual movement and speed; no bypass if spawn collision prevents movement. Records per-profile requests/responses and screenshot, exact external URL gate and local error checks. Map-data audit retained. No changes to runtime code, no evidence of actual physical mobile performance, browser speech/audibility, iOS Safari or broad screen-size coverage.

Preview push pending. After #150 merge, reconcile this delta with current main and review actual failures or evidence before opening PR. No release authorization.
