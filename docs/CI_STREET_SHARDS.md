# Street-block CI parallelization — candidate

Base: `ea0541ff3d9b36c597a889fc94922dc46a6451ea`. Isolated preparation while W8 PR #143 runs. Do not replace its trigger header when integrating: carry only the jobs section and preserve current main filters.

The existing workflow ran street cameras, Vrutice underground surface and Armadni houses in sequence on one runner. The scripts each start their own Chromium instance and write screenshots to the local browser-artifacts directory; no shared output is required as input. The candidate keeps all three original scripts, same pinned playwright-core 1.57.0 and 15-minute timeout per shard, but runs them on three isolated runners with HTTP readiness checks. The original street-block-webgl check name is retained as a strict aggregate; skipped, canceled or failed shards cannot pass it. fail-fast false retains evidence from every shard.

The old artifact glob milovice-street-58220-*.png missed current milovice-street-58530-*.png files. Each shard now uploads its entire browser-artifacts directory under a unique artifact name. No test assertions or runtime files changed.

Expected wall-clock benefit depends on runner capacity and relative shard durations; runner minutes may increase. Compare exact-head CI durations before claiming speedup. Validate all three jobs, aggregate, and evidence artifacts before merging. No automatic release approval.
