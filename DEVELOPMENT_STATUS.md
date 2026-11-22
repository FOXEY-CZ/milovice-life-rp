# Milovice RP — aktuální handoff

> **5.275 (22. 11. 2026; branch `feature/pod-lesem-crosswalk-walker-5275`, CI/Pages zatím neověřeny)** — jeden modelový NPC chodec nově **projde po původní mapované pěší trase přes stávající zebru Pod Lesem × Armádní** i v normálním RP, ne pouze v auditu. Trasa má 22 m po OSM sidewalk 1005977571 se společným původním uzlem s Pod Lesem 128087258. Pokud je v blízkosti přechodu vozidlo (6,2m), chodec počká před vstupem. Není vytvořen žádný nový chodník, obruba, přechod, kolize ani dopravní graf.

## Implementace a neověřené předpoklady

- Modul `scripts/osm-pod-lesem-crossing-walker-5275.js` s OSM source-lock: footway 1005977571 hash `263e12b3` a road 128087258 hash `6e14ec02`, přesná shoda uzlu `50.2285685,14.8727322`, pevné tagy a plán 5.274 městem doložené **ale geodeticky nezaměřené** zebry. Ostatní modelové verze 5.272–5.274 zachovány, včetně `motor_vehicle=no`.
- Funkce `rpSpawnPodLesemWalker5275` přidá nejvýše 1 standardní NPC rig při streamování regionu Mladá; v `rpAnimateTraffic` se pohybuje po původní sidewalk ose a může čekat na vozidlo. Generičtí chodci dál nepřejdou jinou nepodloženou vozovku. Přesné fyzické rozmístění skutečných pruhů a obrubníků stále neověřeno fotografiemi ani situačním plánem z úředního rozhodnutí 29/26.
- `scripts/osm-pod-lesem-crossing-walker-5275.test.mjs` regresně testuje obě orientace, vyčkání na vozidla, původní GPS a nulu nových mapových tras. `scripts/osm-pod-lesem-crossing-walker-webgl-5275.mjs` otestuje Chromium/SwiftShader mobile+wide po 7,2 s LOD a zachování zebry/vozovky. CI rozšířené v Italská workflow. **Před merge zkontrolovat CI 5/5 a samotný screenshot; Pages potvrdit až po publikování.**
- Kontrolní odkaz po případném nasazení: https://foxey-cz.github.io/milovice-life-rp/?v=527500&streetAudit=pod-lesem-pedestrian-5275

## Další krok

Dokončit CI a obrazovou kontrolu 5.275. Pokud vše projde, spojit PR do main a ověřit Pages. Potom pokračovat po celé pěší návaznosti a zástavbě Pod Lesem–Armádní podle oprávněných fotografií/mapy, bez vymýšlení obrub, lamp a přechodů.

## Předchozí ověřený základ

**5.274** [PR #57](https://github.com/FOXEY-CZ/milovice-life-rp/pull/57) 5/5 CI PASS, [Pages #45035522074](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45035522074) PASS. Zebra zarovnaná na OSM chodník 8,782m od Armádní, stále model. **5.273** [PR #56](https://github.com/FOXEY-CZ/milovice-life-rp/pull/56) zabráněno překryvu compacted cesty s asfaltem. **5.272** [PR #55](https://github.com/FOXEY-CZ/milovice-life-rp/pull/55) původní asfaltové zatáčky.

Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Pravidla: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
