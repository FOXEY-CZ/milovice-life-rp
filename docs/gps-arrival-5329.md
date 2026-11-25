# 5.329 — arrival policy

Thresholds 12 m walking / 10 m vehicle, 1.4 s dwell, three distinct samples, max 1.8 s gap and vehicle speed <=0.45 m/s. Game heuristics, not measured entrances or access. Map open resets dwell, target/mode changes reset it. Existing goal clear removes route, HUD, custom marker and instruction cache. Actual browser walking case selects own player marker while map picking is active, verifies no arrival while open, then waits for clearance. Vehicle pass-through and stop cases covered by unit tests only. No FPS claim. CI pending.

First PR #125: 5/6 workflows PASS; browser shard 3 timed out because the camera marker intercepted the real player-marker click. Fix preserves both visible markers but disables pointer events of camera markers only during waypoint selection, closes prior popup, and verifies pointer events are restored. No forced test click. Retry pending.
