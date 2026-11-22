# Milovice RP — aktuální handoff

> **5.276 (22. 11. 2026; branch `fix/pod-lesem-predictive-walker-yield-5276`; CI a Pages zatím neověřené)** — simulovaný chodec verze 5.275 na **původní OSM trase** `1005977571` nově před vstupem na přechod Pod Lesem předvídá přijíždějící vozidlo podle jeho skutečného simulovaného pohybu v čase. Dosavadní reakce pouze na aktuální vzdálenost do 6,2m mohla pustit chodce před rychle přijíždějící auto. Výpočet nejbližšího přiblížení s horizontem 4 s používá změřené `vx/vz` z po sobě jdoucích pozic aut; při chybějícím nebo skokovém měření se vrací k bezpečnostnímu testu současné vzdálenosti. Chodec, který **už přešel obrubníkovou hranici**, se kvůli novému autu nikdy nezastaví uprostřed vozovky.

## Rozsah / testy 5.276

- Modul `scripts/osm-pod-lesem-crossing-walker-5275.js`: nová pure funkce `podLesemVehicleThreat5276` a napojení na již existující `advancePodLesemWalker5275`. `index.html` doplňuje 2D vzorkování rychlosti pro původní simulovaná auta (bez vytváření dalšího NPC či fyziky). Chodec i auta stále používají původní mapové OSM GPS, `motor_vehicle=no` u Pod Lesem, všechen starý terén, zebru a chodníky. **4sekundová predikce rovnoměrného pohybu není dopravně bezpečnostní certifikace.**
- Regresní jednotkové testy: auto přijíždějící z 20 m, stejné auto odjíždějící, vzdálené auto, teleport 80 m/s, stojící blízké auto, obě pěší strany a nerušení přechodu po vstupu. Stávající Chromium mobile+wide po 7,2 s LOD testuje 5.276 build, původní modelovou zebru a přidává `predictiveVehicleSafety5276` runtime diagnostiku. **GitHub CI zatím neověřené**.
- Technický odkaz až po schválení PR a Pages: https://foxey-cz.github.io/milovice-life-rp/?v=527600&streetAudit=pod-lesem-pedestrian-5275
- Po úspěchu zkontrolovat screenshot, sloučit PR a ověřit Pages. Příští krok: bezpečné chování NPC v oblasti napojení Pod Lesem a Armádní, poté zástavba a chodníky celé ulice podle oprávněných fotek/situačních podkladů bez vymýšlení neexistujících staveb.

## Předchozí základ

**5.275** [PR #58](https://github.com/FOXEY-CZ/milovice-life-rp/pull/58), merge `f41afa1`, 5/5 hlavních CI PASS, [Pages #45037471858](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45037471858) PASS. Jeden modelový chodec přes již existující zebru na původní OSM sidewalk; čekal pouze na aktuální vzdálenost vozidla. **5.274** [PR #57](https://github.com/FOXEY-CZ/milovice-life-rp/pull/57), zobrazení zebry posunuté na společný OSM uzel. **5.273** [PR #56](https://github.com/FOXEY-CZ/milovice-life-rp/pull/56), úprava stopy compacted cesty. **5.272** [PR #55](https://github.com/FOXEY-CZ/milovice-life-rp/pull/55), asfaltové vnitřní lomy.

Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Zdrojový workflow: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
