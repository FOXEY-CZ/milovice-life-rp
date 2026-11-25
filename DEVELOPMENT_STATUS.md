# Milovice RP — aktuální handoff

Aktualizace: 25. 11. 2026. **Tento soubor je stručný index, ne changelog.**

## Aktuální stav
- Herní verze: **5.307**, build `20261125-juventa-school-facade-530700`.
- Poslední ověřený nasazený kód: `0c3d7e464b5141779a28b7de3469bebc5f045625` (PR #102, W3–W5). Aktuální HEAD vždy znovu ověř přes GitHub, protože dokumentace nebo další commity jej mohou změnit.
- [Hra](https://foxey-cz.github.io/milovice-life-rp/) · [CI](https://github.com/FOXEY-CZ/milovice-life-rp/actions) · [Juventa — technická kamera hřiště](https://foxey-cz.github.io/milovice-life-rp/?v=530700&streetAudit=pitch-juventa-5301).
- PR #102: všech 6 předslučovacích workflow PASS na `299ab6d`; GitHub Pages na výsledném commitu main PASS. Kompletní automaticky objevená sada 247 unit testů zatím nebyla spuštěna jako celek.

### CI main – snímek při aktualizaci
- Nádražní 5.81 Forecourt photo WebGL: PASS ([run 45530735469](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45530735469))
- Milovice 5.82 street-block photo WebGL: in_progress ([run 45530735775](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45530735775))
- Validate Milovice Life RP: PASS ([run 45530735315](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45530735315))
- pages build and deployment: PASS ([run 45530734493](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45530734493))
- Milovice Italská road, facades and mobile WebGL: in_progress ([run 45530735183](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45530735183))
- Browser smoke test (Milovice RP): in_progress ([run 45530735206](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45530735206))
- Station photo WebGL smoke: PASS ([run 45530735147](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45530735147))

## Prioritní práce a otevřené PR
- **#100 (5.308)**: zdrojová fotka Komenského 05, GPS a EXIF směr, kandidátní hrana školy 47 (nikoli zaměřený vchod). Starší větev je po údržbě v konfliktu s main; přenést jen relevantní změny do aktuálního main, zachovat W2–W5 a tento stručný formát. Ověřit CI.
- **#101 (5.309)**: navazuje na #100, devět odhadnutých barevných okenních polí na kandidátní hraně 47; zatím nesloučeno. Až po #100 zkontrolovat rozdíly a testy.
- **#63 (5.279)**: dodatečný NPC chodec Pod Lesem, stará konfliktní větev; ponechat pro pozdější věcnou revizi. #36 a #37 uzavřeny jako nahrazené #38/#39, větve zachovány.

## Poslední herní práce
- 5.307: provizorní krémové stěny a tmavý sokl Juventy podle městské fotodokumentace ATRIO IN (duben 2026, str. 14–15, 17, 19). Barvy #e4d9be / #544c47, modelový pás 0,95 m, textura 1×128 RGBA. Přesné odstíny a rozsah nejsou zaměřeny.
- 5.306: škola OSM 53865836 / RÚIAN 62834916; původní polygon 73 uzlů včetně uzavíracího, hash be655146, výjimka z limitu 140 m. Výška 15,25 m odvozená z OSM pěti podlaží, střecha provizorní.
- 5.304–5.305: ochrana původních pěších cest Juventa a přechodu 1076211056 před modelovým parkováním; 4,25m modelový odstup, žádná změna zdrojových tras.
- 5.300–5.303: skutečné sportovní polygony, podložený umělý trávník a odhad pískového doskočiště; odstraněny falešné obrysy. Přesný obrys atletického oválu není dostupný. Viz [zdrojový audit](docs/juventa-sports-evidence-5300.md).
- 5.290–5.299: Armádní — zdrojové chodníky a zeleň, pořadí načítání regionů, ochrana pěších tras, modelové parkování a opravy hřišť. Skutečné rozměry parkování, některé fasády a materiály nadále neověřené.

## Technická údržba
- W2: omezení historického fan-out (66 → 7 workflow na porovnávaných main commitech), týdenní a ruční rozšířené regrese.
- W3: bezpečný přístup k localStorage, statické lokální importy pěti HTML stránek, `node scripts/dev-check.mjs --all` (247 testů) a `juventa`.
- W4: Browser Smoke 20 a Italská 23 browser skriptů, každý ve třech izolovaných paralelních skupinách, zachovány všechny původní testovací příkazy a závěrečné kontroly. Pozorované trvání 409 → 218 s a 434 → 184 s (různé běhy, nikoli garantovaný výkon).
- W5: `scripts/terrain-elevation.js` — čistá interpolace DEM, původní fallback a offsety. Test skutečných ČÚZK vrcholů PASS. `terrainAt` zachován.
- Další technický backlog: profilovat paměť a FPS před optimalizací, oddělovat čisté funkce dopravy a UI s regresí; neprovádět hromadný přepis index.html.

## Přesně jeden další krok
Po ověření aktuálního HEAD a doběhnutí zbývajících CI na nasazeném kódu obnovit **#100 na současném main** s minimálním diffs, bez vracení starých workflow nebo dokumentace. Nezakládat další herní verzi před ověřením #100. Potom teprve #101.

## Orientace v repozitáři
- [AGENTS.md](AGENTS.md) — pravidla pokračování.
- [Vývojový postup](docs/DEVELOPMENT_WORKFLOW.md) — CI, testy a evidence.
- [README](README.md) — podrobný changelog, číst jen relevantní sekce.
- [Archiv předchozího handoffu](docs/archive/development-status-2026-11-25.md) — přesná původní verze (5.285–5.307 a související historie); historické formulace „CI čeká“ nejsou aktuální stav.
- Pro další chat stačí načíst tento soubor, AGENTS.md a ověřit GitHub. Nepřidávat další historické bloky; držet status pod 10 kB, starší detaily ponechat v README/archivu.
