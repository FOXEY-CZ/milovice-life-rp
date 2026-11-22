# Milovice RP — aktuální handoff

> **5.277 (22. 11. 2026; vývojová větev, CI/PR/Pages nepotvrzeny)** — chodec u Pod Lesem × Armádní nyní využívá cca 196,6m originální sidewalk OSM 1005977571 místo 22m úseku, ale stále předvídá přijíždějící auta podle ověřené 5.276 predikce na 4 s. Pouze jedna původní postava, bez nového OSM grafu, přechodů, obrub, kolizí, komunikací nebo staveb.

## Geometrie, zdroje a chování

- Původních sedm OSM GPS uzlů a hash 263e12b3 zůstává. Nová trasa se skládá z 11 m před modelem zebry a tří skutečných západních dílů sidewalk 1005977571 (indexy 4,5,6). Východní pokračování k ulici Zátopkova se kvůli nedoloženému převedení nepoužívá.
- scripts/osm-pod-lesem-sidewalk-chain-5277.js navazuje na 5.275/5.276 plán; zajišťuje lomený průběh a otočení na koncích. Stejný výpočet 5.276 podLesemVehicleThreat5276 předvídá pohyb aut při čekání na vstup na stávající zebru. Nezastavuje toho, kdo již přechází. OSM přidaná vozidlová cesta protínající novou západní trasu prodloužení bezpečně zruší.
- Původní vozovka Pod Lesem má motor_vehicle=no. Pruhy zebry jsou městem doložený MODEL, geodetická skutečná poloha není ověřená, žádné další uliční prvky nevymýšlet.
- Unit: scripts/osm-pod-lesem-sidewalk-chain-5277.test.mjs plus staré testy. Mobile/wide Chromium/SwiftShader po 7,2s LOD v .github/workflows/italska-apartments-5235.yml. **CI, screenshot, merge a Pages čekají na ověření.**
- Kamera po nasazení: https://foxey-cz.github.io/milovice-life-rp/?v=527700&streetAudit=pod-lesem-pedestrian-5275

## Další krok

Ověřit cílené Node/WebGL a screenshot, následně PR a Pages. Poté doplnit doložené fasády a skutečné pěší návaznosti Pod Lesem–Armádní podle oprávněných zdrojů, ne generických odhadů.

## Předchozí ověřený základ

**5.276:** PR #59 sloučen do main v d740536, cílené Node+Chromium PASS, předvídání přijíždějících aut. **5.275:** PR #58, 5/5 hlavních CI PASS a Pages PASS. **5.274:** PR #57, zebra zarovnána s OSM společným uzlem.

Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Pravidla: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md
