# City vehicle performance evidence — 5.348

Same stationary player car and viewport, ABBA (`on`, `coupe`, `coupe`, `on`), 6.5s settle and 8s RAF sampling per run. Verify actual vehicle assignment, four wheels, single heavy model, stationary state, stable canvas and visible page. Record raw intervals, median, p95/p99, stalls and active model count. No FPS threshold: SwiftShader on GitHub runners is software rendering and NPC movement/runner load are uncontrolled; not a physical GPU or driving benchmark. Compare repeated samples before any optimization. No runtime edits or release approval. Main #160 9/9 PR and 7/7 main incl Pages PASS; initial experiment completed.

## Run 45861651388 — exact 09878d3
| Mode | Intervals | Mean RAF interval | p50 | p95 | p99 | Observed RAF/s |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| on | 36 | 454.61 ms | 450.0 ms | 516.6 ms | 550.0 ms | 2.200 |
| coupe | 12 | 1412.43 ms | 1383.3 ms | 1666.6 ms | 1666.6 ms | 0.708 |

Both repetitions agree directionally. Coupe mean interval 3.11× higher; actual nearby model counts differed (3–4 vs 3), sample is small, RAF includes CPU/GPU/browser scheduling, and runner load/NPC motion are uncontrolled. Retain the explicit opt-in desktop mode; do not infer physical hardware FPS, modify physics, or lower visual quality from this result alone.

## Local desktop comparison (optional, unverified until executed)
Use a fresh checkout of this evidence branch, Node 22, Google Chrome, and two terminals. Install `npm install --no-save --no-package-lock playwright-core@1.57.0` and start `python -m http.server 8080 --bind 127.0.0.1` in the repository. In PowerShell:
```powershell
$env:CITY_PERF_BACKEND='auto'
$env:CITY_PERF_WINDOW_MS='20000'
node scripts/city-vehicle-performance.mjs city-perf-local.json
```
Keep Chrome visible, leave controls untouched, and close other intensive applications. Auto mode requests ordinary headed Chrome, not guaranteed hardware acceleration. Inspect probeRenderer/probeUnmasked in JSON (separate WebGL context, not proof of game's GPU); if SwiftShader or another software renderer is reported, label it accordingly. CI defaults remain software and 8 seconds; the longer local window yields more intervals on slow devices. Compare actual GPU results only after verifying environment and repeatability. This is a stationary scenario, not a city-wide or moving-vehicle benchmark.
