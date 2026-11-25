# 5.329 — arrival policy

Thresholds 12 m walking / 10 m vehicle, 1.4 s dwell, three distinct samples, max 1.8 s gap and vehicle speed <=0.45 m/s. Game heuristics, not measured entrances or access. Map open resets dwell, target/mode changes reset it. Existing goal clear removes route, HUD, custom marker and instruction cache. Actual browser walking case selects own player marker while map picking is active, verifies no arrival while open, then waits for clearance. Vehicle pass-through and stop cases covered by unit tests only. No FPS claim. CI pending.
