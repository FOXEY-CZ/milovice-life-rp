# Milovice RP — aktuální handoff

Aktualizace: 25. 11. 2026. **Tento soubor je stručný index, ne changelog.**

## Aktuální stav
- Herní verze main: **5.311**, build `20261125-juventa-section-audit-531100`. Kandidát 5.312 v pracovní větvi.
- Main po #106: `19b9e9b1c4e27d35afcdb3064a4e069c3ffff078`, 6/6 PR CI PASS. Předchozí herní 5.310: 7/7 main CI včetně Pages PASS. HEAD vždy ověř živě.
- [Hra](https://foxey-cz.github.io/milovice-life-rp/) · [CI](https://github.com/FOXEY-CZ/milovice-life-rp/actions) · [Juventa — technická kamera hřiště](https://foxey-cz.github.io/milovice-life-rp/?v=530700&streetAudit=pitch-juventa-5301).
- PR #102: všech 6 předslučovacích workflow PASS na `299ab6d`; GitHub Pages na výsledném commitu main PASS. Kompletní automaticky objevená sada 250 unit testů zatím nebyla spuštěna jako celek.

### CI 5.311 – snapshot
- Milovice Italská road, facades and mobile WebGL: in_progress ([run 45627445805](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45627445805))
- Validate Milovice Life RP: in_progress ([run 45627445929](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45627445929))
- Nádražní 5.81 Forecourt photo WebGL: in_progress ([run 45627445784](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45627445784))
- Browser smoke test (Milovice RP): in_progress ([run 45627445770](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45627445770))
- Milovice 5.82 street-block photo WebGL: in_progress ([run 45627445755](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45627445755))
- Station photo WebGL smoke: PASS ([run 45627445815](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45627445815))
- pages build and deployment: PASS ([run 45627445385](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45627445385))

## Prioritní práce a otevřené PR
- **5.308 / #103 MERGED**: GPS 50.226810, 14.866101, směr 98,62° přesně potvrzen v mobilním WebGL; zdrojová metadata převzata z původního modulu, nikoli znovu ověřena. Hrana 47 kandidátní fasáda, nikoli zaměřený vchod. #100 uzavřen, větev zachována.
- **5.309 / #104 MERGED**: 9 modelových okenních sestav, 54 tabulí, 144 trojúhelníků/1 mesh, bez kolizí. Mobilní WebGL po 7,1 s LOD PASS; screenshot artefakt uložen, vizuálně neporovnán. #101 uzavřen.
- **5.310 / #105 MERGED**: 109m původní pěší cesta OSM 1272081412, uzly 8 až 1, otočení cca 14,8 m před osou vozovky. Jeden další modelový NPC jen při platné 5.278 trase a volné kapacitě 65; plynulá 5.280 animace. Žádné nové cesty, kolize či přechody. 6/6 PR CI PASS, #63 uzavřen.

- **5.311 / #106 MERGED**: stavební řez A, lokální datum, 0,94 m schodiště a 3,16 m světlá výška zastřešení. Diagnostika bez nové geometrie, 6/6 PR CI PASS. Výstupek 48–50 není potvrzený vstup.

## Poslední herní práce
- 5.307: provizorní krémové stěny a tmavý sokl Juventy podle městské fotodokumentace ATRIO IN (duben 2026, str. 14–15, 17, 19). Barvy #e4d9be / #544c47, modelový pás 0,95 m, textura 1×128 RGBA. Přesné odstíny a rozsah nejsou zaměřeny.
- 5.306: škola OSM 53865836 / RÚIAN 62834916; původní polygon 73 uzlů včetně uzavíracího, hash be655146, výjimka z limitu 140 m. Výška 15,25 m odvozená z OSM pěti podlaží, střecha provizorní.
- 5.304–5.305: ochrana původních pěších cest Juventa a přechodu 1076211056 před modelovým parkováním; 4,25m modelový odstup, žádná změna zdrojových tras.
- 5.300–5.303: skutečné sportovní polygony, podložený umělý trávník a odhad pískového doskočiště; odstraněny falešné obrysy. Přesný obrys atletického oválu není dostupný. Viz [zdrojový audit](docs/juventa-sports-evidence-5300.md).
- 5.290–5.299: Armádní — zdrojové chodníky a zeleň, pořadí načítání regionů, ochrana pěších tras, modelové parkování a opravy hřišť. Skutečné rozměry parkování, některé fasády a materiály nadále neověřené.

## Technická údržba
- W2: omezení historického fan-out (66 → 7 workflow na porovnávaných main commitech), týdenní a ruční rozšířené regrese.
- W3: bezpečný přístup k localStorage, statické lokální importy pěti HTML stránek, `node scripts/dev-check.mjs --all` (248 testů) a `juventa`.
- W4: Browser Smoke 20 a Italská 23 browser skriptů, každý ve třech izolovaných paralelních skupinách, zachovány všechny původní testovací příkazy a závěrečné kontroly. Pozorované trvání 409 → 218 s a 434 → 184 s (různé běhy, nikoli garantovaný výkon).
- W5: `scripts/terrain-elevation.js` — čistá interpolace DEM, původní fallback a offsety. Test skutečných ČÚZK vrcholů PASS. `terrainAt` zachován.
- W7: uživatelem schválená souběžná příprava jedné další změny během CI/Pages; bezpečnostní brány zůstávají, viz AGENTS a vývojový postup.
- Další technický backlog: profilovat paměť a FPS před optimalizací, oddělovat čisté funkce dopravy a UI s regresí; neprovádět hromadný přepis index.html.

## Další krok podle W7
5.312 kandidát: výškový audit skutečně vytvořeného základu školy, kontrola obou DEM a fallbacku, 292 obvodových vzorků, očekávaný rozdíl cca 4,6–5,2 m u kandidátní fasády. Build `20261125-juventa-terrain-audit-531200`. CI čeká. Během CI připravit zdrojově podložené členění komplexu (nepřidávat odhadnuté fyzické schody); po PASS ověřit skutečný log a Pages 5.311.

## Orientace v repozitáři
- [AGENTS.md](AGENTS.md) — pravidla pokračování.
- [Vývojový postup](docs/DEVELOPMENT_WORKFLOW.md) — CI, testy a evidence.
- [README](README.md) — podrobný changelog, číst jen relevantní sekce.
- [Archiv předchozího handoffu](docs/archive/development-status-2026-11-25.md) — přesná původní verze (5.285–5.307 a související historie); historické formulace „CI čeká“ nejsou aktuální stav.
- Pro další chat stačí načíst tento soubor, AGENTS.md a ověřit GitHub. Nepřidávat další historické bloky; držet status pod 10 kB, starší detaily ponechat v README/archivu.
