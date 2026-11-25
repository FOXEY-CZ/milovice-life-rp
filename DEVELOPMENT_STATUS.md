# Milovice RP — aktuální handoff

Aktualizace: 25. 11. 2026. **Tento soubor je stručný index, ne changelog.**

## Aktuální stav
- Herní verze main: **5.309**, build `20261125-juventa-window-bays-530900`. Kandidát 5.310 v pracovní větvi.
- Main po #104: `5d1f1cf306cb39ea2bce5f4987de808cc2312c9b`, 6/6 PR CI PASS, Pages PASS; další main kontroly ověřit živě. HEAD vždy ověř přes GitHub.
- [Hra](https://foxey-cz.github.io/milovice-life-rp/) · [CI](https://github.com/FOXEY-CZ/milovice-life-rp/actions) · [Juventa — technická kamera hřiště](https://foxey-cz.github.io/milovice-life-rp/?v=530700&streetAudit=pitch-juventa-5301).
- PR #102: všech 6 předslučovacích workflow PASS na `299ab6d`; GitHub Pages na výsledném commitu main PASS. Kompletní automaticky objevená sada 247 unit testů zatím nebyla spuštěna jako celek.

### CI main – snímek při přípravě 5.310
- Validate Milovice Life RP: PASS ([run 45532239289](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45532239289))
- Station photo WebGL smoke: PASS ([run 45532239251](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45532239251))
- pages build and deployment: PASS ([run 45532238753](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45532238753))
- Milovice 5.82 street-block photo WebGL: in_progress ([run 45532239246](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45532239246))
- Browser smoke test (Milovice RP): in_progress ([run 45532239298](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45532239298))
- Milovice Italská road, facades and mobile WebGL: in_progress ([run 45532239360](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45532239360))
- Nádražní 5.81 Forecourt photo WebGL: PASS ([run 45532239359](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45532239359))

## Prioritní práce a otevřené PR
- **5.308 / #103 MERGED**: GPS 50.226810, 14.866101, směr 98,62° přesně potvrzen v mobilním WebGL; zdrojová metadata převzata z původního modulu, nikoli znovu ověřena. Hrana 47 kandidátní fasáda, nikoli zaměřený vchod. #100 uzavřen, větev zachována.
- **5.309 / #104 MERGED**: 9 modelových okenních sestav, 54 tabulí, 144 trojúhelníků/1 mesh, bez kolizí. Mobilní WebGL po 7,1 s LOD PASS; screenshot artefakt uložen, vizuálně neporovnán. #101 uzavřen.
- **5.310 (náhrada #63)**: 109m původní pěší cesta OSM 1272081412, uzly 8 až 1, otočení cca 14,8 m před osou vozovky. Jeden další modelový NPC jen při platné 5.278 trase a volné kapacitě 65; plynulá 5.280 animace. Žádné nové cesty, kolize či přechody. CI čeká.

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
Ověřit CI 5.310, předchozí main kontroly a po merge Pages. Pak uzavřít #63, vrátit se k Juventě a porovnat dostupné screenshoty s doloženou fasádou.

## Orientace v repozitáři
- [AGENTS.md](AGENTS.md) — pravidla pokračování.
- [Vývojový postup](docs/DEVELOPMENT_WORKFLOW.md) — CI, testy a evidence.
- [README](README.md) — podrobný changelog, číst jen relevantní sekce.
- [Archiv předchozího handoffu](docs/archive/development-status-2026-11-25.md) — přesná původní verze (5.285–5.307 a související historie); historické formulace „CI čeká“ nejsou aktuální stav.
- Pro další chat stačí načíst tento soubor, AGENTS.md a ověřit GitHub. Nepřidávat další historické bloky; držet status pod 10 kB, starší detaily ponechat v README/archivu.
