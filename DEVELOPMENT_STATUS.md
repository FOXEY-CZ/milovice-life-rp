# Milovice RP — rychlý handoff vývoje

> **5.251 (21. 11. 2026; implementace připravena, CI/WebGL/Pages pro novou verzi NEověřené):** Třetí veřejná fotografie historického Vojenského zátiší — [Rakouská (Milovice) 15.jpg](https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg), Stanislav Doronenko, 20. 8. 2025, CC BY-SA 4.0, GPS kamery **50.226027,14.874584** — dává samostatný severní pohled na existující OSM way **53865882 / RÚIAN 40057411**, beze změny jeho půdorysu (29 GPS bodů, FNV 7aec42bc). Nový fail-closed `scripts/osm-rakouska-north-photo-5251.js` používá původní stěny + modelový průsečíkový test pohledu přes všechny ostatní hrany polygonu: **šest dosud nezdobených původních hran [0,1,2,3,5,27]**, celkem **18** místo 12, **16** přibližných skvrn omítky místo 11, stále jen 2 3D mesh dávky / 100 dekorativních trojúhelníků. Doložená je poloha fotografa a identita budovy; směr kontrolní kamery **168°** a styl severních lišt/skvrn jsou výslovně modelové, nikoli přesně fotoověřené. Žádné nové domy, GPS, okna, vchody, chodníky, cesty, kolize, NPC, foto pixely ani parkování. Diagnostika `window.__miloviceRakouskaNorthPhotoRuntime5251()`; [přímá kamera](https://foxey-cz.github.io/milovice-life-rp/?v=525100&streetAudit=rakouska-vojen-zatisi-5251), nový unit + samostatný mobilní WebGL 6,7s LOD a screenshot, aktualizovaný starší mobilní test, `dev-check italska`, workflow. **Po vytvoření PR ověřit CI a vizuální mobilní záběr, teprve pak nasazení.**

> **5.250 (21. 11. 2026; všech 5 PR CI/WebGL PASS, [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44943022440)):** Fotografie Italská 04 a 05 umožnily vyřadit 3 zakryté dekorativní OSM stěny z 15 kandidátů (12 přímo viditelných), 11 omítkových skvrn a 2 GPU batches, neměněné GPS a kolize. [PR #31](https://github.com/FOXEY-CZ/milovice-life-rp/pull/31) sloučen. 5.251 přidává severní fotografický úhel, aniž mění základní 5.249–5.250 source testy.

> **5.249 (21. 11. 2026; CI/WebGL PASS):** První přiblížení bílé opadané omítky a střechy na původní budově podle dvou veřejných fotografií ze srpna 2025. Pozice skutečných oken a skvrn nebyly fotograficky zaměřeny; dvě GPU dávky, žádné falešné dveře.

> **5.248 (21. 11. 2026; CI PASS):** Nádražní původní OSM platformy 549346219/994855884, bezpečné modelové žluté pruhy oříznuté podle zdrojových hran a kolejových os; 26 úseků / cca 501 m v kompletním OSM regionu, nikoli současně v kameře.

## Rozpracované uliční celky a omezení

- **Italská–Rakouská:** stávající 5.251 severní foto kamera doplňuje historický objekt, ne celou ulici. V okolí jsou zdrojové OSM **1484073943** (původní `footway=sidewalk`) a **1484073944** (skutečně nemalovaný přechod, `crossing:markings=no`), sklad 53865876 a několik obytných budov. Sousední budovy, stromy, ploty a případný basreliéf nemají zatím přesně zaměřené 3D detaily; nevymýšlet.
- Višňová/Lesní, Topolová, Nádraží/Bike Tower, Sportovní/Průběžná, Školská, kostel, garáže, Milten, Juventský les: stále **rozpracované**; cílem jsou celé ulice a skutečné navazující objekty, ne tvrzení o hotovém městě.
- NPC auta 5.240–5.241 respektují povolené OSM segmenty, bezpečné běžné pěší trasy 5.243–5.247 se drží zdrojových OSM chodníků. 60 FPS je **cíl**, dokud není výslovně změřený.

## Další krok

1. Ověřit 5.251 source Node test + skutečné mobilní Chromium/SwiftShader po 6,7 s LOD a finální screenshot Rakouské, všechny GitHub Actions i Pages. Nepotvrzené výsledky NEoznačovat PASS.
2. Navázat **celým skutečným blokem Italská–Rakouská**: zdrojové chodníky 1484073943, nemalovaný přechod 1484073944 a sousední existující budovy se správným využitím a doloženými facádami. Basreliéf přidat až po zdokumentování jeho hostitelské stěny a 3D polohy, ne naslepo.
3. Pracovat jen s originálními OSM/RÚIAN GPS, veřejnými licencovanými fotkami a přiznanými modelovými odhady.

Hra: https://foxey-cz.github.io/milovice-life-rp/
Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Celá historická chronologie a fotopodklady: README.md.
Proces: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md.
