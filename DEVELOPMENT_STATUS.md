# Milovice RP — aktuální handoff

> **5.276 (22. 11. 2026; vývojová větev, CI/PR/Pages zatím nepotvrzeny)** — jeden obyvatel NPC už chodí po cca 196,6 m původního OSM sidewalk 1005977571 od 11m východního nástupu přes stávající modelovou zebru Pod Lesem až na západní konec mapované pěší trasy. Žádné nové komunikace, přechody, obruby, lampy, kolize ani změny budov.

## Implementace a nejistoty

- scripts/osm-pod-lesem-sidewalk-chain-5276.js: navazuje na source-locked model 5.275 (hash chodníku 263e12b3, Pod Lesem motor_vehicle=no), připojuje pouze OSM uzly indexů 4–6 a odmítá křížení s další vozidlovou OSM cestou. Při změně podkladu zůstává krátký původní model 5.275, pokud ten stále splňuje bezpečnostní podmínky.
- Stále jediný standardní NPC rig do limitu 65, přesnější pohyb po lomech původní mapové čáry, obrat na konci, čekání na vozidla před vstupem na zebru. Východní přecházení Zátopkovy je bez zdroje vyloučené. Přesné fyzické bílé pruhy 5.274 nejsou fotograficky ani geodeticky ověřené.
- Regrese: scripts/osm-pod-lesem-sidewalk-chain-5276.test.mjs a zachovaná 5.275; mobilní + wide Chromium/SwiftShader test po 7,2s LOD je v .github/workflows/italska-apartments-5235.yml. **CI, screenshot, merge a GitHub Pages dosud nezjištěné**.
- Odkaz pro ověření po nasazení: https://foxey-cz.github.io/milovice-life-rp/?v=527600&streetAudit=pod-lesem-pedestrian-5275

## Další krok

Ověřit CI, vizuální záběr chůze a Pages. Poté pokračovat v source-backed rekonstrukci okolních domů a skutečných pěších návazností Pod Lesem–Armádní, nic nedoplňovat jen odhadem.

## Předchozí ověřený základ

**5.275:** PR #58 v main f41afa1; 5/5 CI PASS, Pages #45037471858 PASS. **5.274:** PR #57 5/5 PASS, zebra zarovnána s OSM společným uzlem. **5.273:** PR #56, cesta nezasahuje do asfaltu.

Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Pravidla: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md
