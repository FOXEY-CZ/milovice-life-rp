# Milovice RP — aktuální handoff

> **5.273 (22. 11. 2026; branch `fix/pod-lesem-compacted-track-overlap-5273`, CI/Pages zatím čekají)** — obrazově zhodnoceny mobilní a wide screenshoty 5.272 z Actions #45031300115. Vizuální problém: původní OSM `highway=track` `1011197688` s `surface=compacted` zasahuje vlastním hnědým vykreslením do asfaltu Pod Lesem při spojení. Na současné OSM geometrii s dokladem hashů `00b3e58a` (11 uzlů, track) a `6e14ec02` (4 uzly Pod Lesem, šířka 6 m) nový `scripts/osm-pod-lesem-track-5273.js` zkracuje **jen první zobrazovaný hnědý road-strip**, přibližně o 3,05 m k modelové asfaltové hraně; 5 cm mezera je modelová kvůli z-fightingu. Všechny zdrojové souřadnice, průjezdnost, NPC silniční graf, fyzické kolize, materiály, přechod 5.271 a výplně 5.272 zůstávají nedotčeny. **Geodeticky ani fotograficky určená poloha skutečného obrubníku nebyla k dispozici.**

## Ověření / další krok 5.273

- Nové regresní testy `scripts/osm-pod-lesem-track-5273.test.mjs` + skutečný Chromium/SwiftShader mobile+wide `scripts/osm-pod-lesem-track-webgl-5273.mjs` po 7,2s LOD. CI výsledek ještě ověřit; poté PR, merge a Pages. Technický pohled po nasazení: https://foxey-cz.github.io/milovice-life-rp/?v=527300&streetAudit=pod-lesem-track-seam-5273
- **Nový nezávislý městský pramen k čtyřem přechodům:** úřední deska Lysá nad Labem má `Stanovení místní úpravy provozu č. 29/26` (24. 8. 2026) pro ulice Rakouská, Kaštanová, Pod Lesem a bezejmenná (`MULNL-SC/54044/2026/Uh/132`): https://ud.mestolysa.cz/archiv.html. **Situační příloha zůstává nezískaná.** Nevyvozovat přesnou polohu ani podobu přechodů.
- Po CI zhodnotit screenshot 5.273 proti již obrazově prohlédnutému 5.272 a teprve potom pokračovat další skutečně doloženou ulicí/chodníky. Priorita zachovat realistickou podobu, stabilní FPS a OSM průjezdnost.

## Předchozí verze

**5.272** [PR #55](https://github.com/FOXEY-CZ/milovice-life-rp/pull/55), merge `3b02659`, dokumentace `c16782f`. Dvě malé asfaltové výplně na skutečných lomových uzlech Pod Lesem `128087258`. **5/5 hlavních CI PASS**, [Pages deployment #45031920240](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031920240) PASS. Mobilní a wide screenshoty `pod-lesem-road-bends-5272-*.png` a `pod-lesem-municipal-crossing-5270-*.png` z CI artefaktu #45031300115 nyní skutečně obrazově prohlédnuty.

**5.271** [PR #54](https://github.com/FOXEY-CZ/milovice-life-rp/pull/54), merge `98cf32a`, Pages PASS. Nová kontrola duplicitní `footway=crossing` hledá nejbližší celý segment. **5.270** [PR #53](https://github.com/FOXEY-CZ/milovice-life-rp/pull/53) model městem doloženého přechodu Pod Lesem asi 10,5 m od křižovatky, ale přesná poloha **neověřena**.

Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Pravidla: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
