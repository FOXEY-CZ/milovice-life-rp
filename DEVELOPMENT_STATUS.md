# Milovice RP — rychlý handoff vývoje

> **Aktuální 5.267 (22. 11. 2026):** [PR #50](https://github.com/FOXEY-CZ/milovice-life-rp/pull/50) **sloučen do `main` jako `20819a1`; 5/5 hlavních PR CI PASS**. Na fotografii [Rakouská (Milovice) 15](https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg) (Stanislav Doronenko, 20. 8. 2025, CC BY-SA 4.0) je viditelný příčný nízký kovový plot před bývalým Vojenským zátiším. `scripts/osm-rakouska-cross-frontage-5267.js` přidává **1 batched zelený DEM-draped vizuální mesh** od stávajícího modelového podélného plotu 5.266 směrem k zádveří 5.265. Modelově **13,75 m** délky a **3,3 m** mezera před markýzou, ale **trasa, výška a mezera jsou odhady, nikoli zaměřená skutečná hranice, průchod či brána**. Přísné zdrojové OSM ID/hash: budova **53865882 / RÚIAN 40057411** (`7aec42bc`), hlavní Rakouská **8590288** (`7486fd8b`), sousední ulice **8590286** (`916afa20`). Plošná kontrola po 101 vzorcích odmítá zásah do půdorysu, markýzy i blízkost os obou ulic. Nulové nové `barrier=fence`, brány, vchody, kolize, cesty, chodníky, silnice, NPC a GPS změny. Po prvním PR failure opraveny **2 starší unit testy 5.260/5.258**, které očekávaly starý BUILD_ID. **Skutečné mobilní Chromium/SwiftShader >7,2s LOD PASS**; screenshoty `rakouska-cross-frontage-5267-mobile.png` a `-wide.png` byly podle logu vytvořené a uloženy v artefaktu Italská, ale **nebyly mnou obrazově prohlédnuty**. **Pages deploy v5.267 zatím není zvlášť ověřen.**

## Ověřené 5/5 CI — commit 5.267

- [Italská/Rakouská, unit + skutečný mobilní a široký WebGL screenshot](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507613) — PASS
- [Hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507632) — PASS
- [Station Photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507650) — PASS
- [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507729) — PASS
- [Blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507711) — PASS

## Nedávné předchozí verze — podrobnosti v README.md

- **5.266 [PR #49](https://github.com/FOXEY-CZ/milovice-life-rp/pull/49)**: zelený dekorativní podélný plot (~37,8m × 1,16m), 86 modelových trsů a 10 keřů na Rakouské OSM 8590288, 3 batched meshe. Ve finálním screenshotu plot správně podél Rakouské; chyběl příčný segment, nyní v 5.267 jako odhad. 5/5 CI PASS.
- **5.265 [PR #48](https://github.com/FOXEY-CZ/milovice-life-rp/pull/48)**: skleněné dekorativní zádveří s širokou nízkou markýzou a malým horním balkonem před **hranou 2** OSM půdorysu budovy 53865882. Pracovní hloubka 2,55 m, 5 sdílených meshů; nejde o funkční dveře ani naměřené rozměry. 5/5 CI PASS.
- **5.264 [PR #47](https://github.com/FOXEY-CZ/milovice-life-rp/pull/47)**: 6 modelových horních oken, 8 malých ploch oprýskané omítky na zdrojových zdech 0,2,7; vizuální odhady. 5/5 CI PASS.
- **5.263 [PR #46](https://github.com/FOXEY-CZ/milovice-life-rp/pull/46)**: vyšší historické nároží Vojenského zátiší nad OSM zdí 0–8, odhad +2,4 m; foto Rakouská 15 a Italská 05. 5/5 CI PASS.
- **5.262 a starší**: červený omítkový sokl Italské (5.262), skutečný OSM `surface=sett` na 478,586 m Kaštanové (5.261), modelová dopravní bezpečnost (5.258–5.260); kompletní evidence, testy a changelog v `README.md`.

## Stav lokality a zásady

**Rakouská–Italská zůstává nehotová ulice jako CELEK.** Objekt 53865882 je fotopodložený jen ve vybraných pohledech; silnice, chodníky, vedlejší OSM sklad 53865876, dům 53865877 a napojení ulic nejsou kompletní fotorealistická rekonstrukce. Pracovní modelové zúžení původní komunikace 8590284 ve 5.252 není zaměřený obrubník. Žádný nově domyšlený přechod, parkoviště, lampa, strom, plot nebo vchod bez zdroje. Zachovat GPS/OSM/RÚIAN, původní NPC dopravní graf a mobilní výkon; cíl 60 FPS neznamená garanci každého zařízení.

**Další krok 5.268:** nejdříve **obrazově posoudit dva screenshoty 5.267** a pokud je příčná linie nelogická oproti foto, opravit ji. Pak vybrat ověřitelný úsek **chodníků a obrubníků Rakouské** podle skutečných OSM pěších linií + kompatibilních veřejných fotografií. Nepokračovat dalším čistě dekorativním detailem, dokud nejsou správné vazby ulice. **Samostatně ověřit GitHub Pages deploy 5.267**; PR CI není totéž jako aktuální webová verze.

Hra (po deploymentu): https://foxey-cz.github.io/milovice-life-rp/?v=526700&streetAudit=rakouska-cross-frontage-5267

Repo: https://github.com/FOXEY-CZ/milovice-life-rp

Pracovní pravidla: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
