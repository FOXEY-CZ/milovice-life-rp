# CROSSVEX — audio and network response evidence preparation

Source baseline: main `86b0ac88ae93991a671d74737d710c76ec18e391` (5.344), 2026-11-26.

## Audio source inspection
- index.html lines 3385–3430: horn is synthesized with Web Audio oscillator (sawtooth, 220 Hz); GPS cues use sine oscillators. Both use an AudioContext, not a recorded sound file.
- scripts/gps-voice-5331.js: optional Czech speech uses a voice only when the browser reports localService === true and lang matches cs. When no matching voice is available, the caller falls back to synthesized tones. Phrases contain generic directions and rounded distances, not destination names or coordinates.
- Existing scripts/gps-voice-5331.test.mjs contains mock tests for rejection of a remote Czech voice, local voice selection, fallback, busy state and cancellation. This inspection did not rerun that existing suite.
- A scan of index.html for radio/audio/media markers found only the above oscillator and speech synthesis references. Recursive tree path search found GPS modules and tests but no named radio or audio module. This limited source search is not proof that all runtime paths lack external audio. No radio stream was observed in prior startup/map/credits preview. Browser/OS speech implementation and mobile devices require independent evidence; localService is not a guarantee of offline behavior.

## Next preview
The independent scripts/release-network-observer.mjs records request URL, method, type, response status, redirect links, completion, failure and pending status. It does not collect response bodies, headers, cookies, or credentials separately; URLs can contain sensitive query parameters, so keep raw traces internal and do not test with real accounts. It is not a network blocker or a byte-integrity check.
- Self-test: node scripts/release-network-observer.test.mjs (mock event stream, no browser).
- After #146 is merged, reconcile this independent delta with current main; integrate observer in the staged preview without weakening exact URL validation.
- Exercise actual vehicle controls, horn, GPS tones and the local-only voice toggle, other regions, desktop/mobile. Record unsupported scenarios as such and distinguish failed requests from pending requests.
- Inspect actual captured results before approving additional URLs. No final release approval or runtime changes in this preparation.

## Desktop gameplay scenario prepared
`runReleaseGameplayScenario` uses the normal sedan spawn, horn, GPS audio/voice controls, a selectable GPS target and keyboard acceleration. It asserts a running AudioContext and nonzero speed; a cue or spoken phrase is reported only if observed, not forced. No audio waveform or other regions/mobile tested yet. Attach the response observer before navigation and save partial evidence in finally. This scenario is not yet integrated or executed in CI.

Integrated in the next preview candidate alongside the existing startup/map/credits scenario; exact URL gate covers both scenarios. Response status, failures and pending counts remain evidence for review. CI pending.
