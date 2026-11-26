# CROSSVEX — aktuální handoff

Aktualizace: 26. 11. 2026. **Tento soubor je stručný index, ne changelog.**

## Aktuální stav
- Herní verze main: **5.350**, #174 sloučen `fdcce5a`, PR 6/6 PASS; #173 main `9b03678` 5/5 PASS včetně Pages 45894512731. Main #174 CI čeká.
- Main po #160: `7a087a173569b6b49df0f3721469ec2f71c3621f`; 9/9 PR PASS a 8/8 main PASS včetně Pages 45860346528.
- [Hra](https://foxey-cz.github.io/milovice-life-rp/) · [CI](https://github.com/FOXEY-CZ/milovice-life-rp/actions) · [Juventa — technická kamera hřiště](https://foxey-cz.github.io/milovice-life-rp/?v=530700&streetAudit=pitch-juventa-5301).
- PR #102: všech 6 předslučovacích workflow PASS na `299ab6d`; GitHub Pages na výsledném commitu main PASS. Kompletní automaticky objevená sada 250 unit testů zatím nebyla spuštěna jako celek.

### CI 5.312–5.314
- #107 6/6 PR CI PASS, 7/7 main CI včetně Pages PASS (45628373388). Mobilní test potvrzuje výškový rozdíl 4,628–5,137 m.

- #108 6/6 PR CI PASS, 7/7 main včetně Pages PASS.
- #109 6/6 PR CI PASS, 7/7 main včetně Pages PASS.
- #110 6/6 PR CI PASS, 8/8 main včetně Pages PASS.
- #111 6/6 PR CI PASS, 7/7 main včetně Pages PASS.
- #112 6/6 PR CI PASS, 7/7 main včetně Pages PASS.
- #113 6/6 PR CI PASS, 7/7 main včetně Pages PASS.
- #114 6/6 PR CI PASS, 8/8 main včetně Pages PASS.
- #115 6/6 PR CI PASS, 7/7 main včetně Pages PASS po HTTP 500 a retry.
- #116 6/6 PR CI PASS, 7/7 main včetně Pages PASS.
- #117 6/6 PR CI PASS včetně auditu skutečné trasy, 8/8 main včetně Pages PASS.
- #118 6/6 PR CI PASS, 7/7 main včetně Pages PASS.
- #119 5/5 PR CI PASS, 6/6 main včetně Pages PASS. Chromium: HZS 2165,992 m, Tesco 535,599 m, Billa 1837,114 m; všechny trasy ready a auditované.

- #120 6/6 PR CI PASS, 7/7 main včetně Pages PASS.

- #121 6/6 PR CI PASS, 8/8 main včetně Pages PASS.

- #122 6/6 PR CI PASS po opravě brzdění, main čeká.

- #123 6/6 PR CI PASS, main čeká.

- #124 6/6 PR CI PASS; browser stání 1 výpočet, 1→4 cache hits; jízda 23 výpočtů, průměr 0,261 ms, max 4 ms. FPS neměřeno. Main 8/8 PASS.

- #125 6/6 PR CI PASS po opravě překrývajících se značek; main čeká.

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

**Priorita:** #169 procedurální alternativa 9 scénářů bez GLB; #170 Commons metadata 5/5 PASS, práva pending; #171–173 klasifikace dat, názvy čtvrtí a čistý HEAD staging PASS. #174 desktop local-library preview 328 requests, 0 remote/GLB/HTTP/failed/pending/page errors, 39 aut, PASS. Kandidát rozšiřuje local-only audit na 6 regionů + 2 mobile orientace, 4 matrix jobs, zachovává desktop a původní režimy. CI čeká; fyzická zařízení a kompletní offline pokrytí neověřeny. #147 a #161 otevřené, bez release schválení.

## Orientace v repozitáři
- [AGENTS.md](AGENTS.md) — pravidla pokračování.
- [Vývojový postup](docs/DEVELOPMENT_WORKFLOW.md) — CI, testy a evidence.
- [README](README.md) — podrobný changelog, číst jen relevantní sekce.
- [Archiv předchozího handoffu](docs/archive/development-status-2026-11-25.md) — přesná původní verze (5.285–5.307 a související historie); historické formulace „CI čeká“ nejsou aktuální stav.
- Pro další chat stačí načíst tento soubor, AGENTS.md a ověřit GitHub. Nepřidávat další historické bloky; držet status pod 10 kB, starší detaily ponechat v README/archivu.
