# Milovice RP — rychlý handoff vývoje

> **Nová 5.155 (18. 11. 2026; CI/WebGL/Pages PASS):** celý souvislý panelový blok **Topolová 614–618**. ČSÚ potvrzuje všem pěti domům 5 **NADZEMNÍCH** pater / 10 bytů / panelové nosné zdi. OSM dům **618** (way 61979145, RÚIAN 22968105) má přesto building:levels=1; ve hře nově model 5 pater, 15,25 m místo 3,05 m, zachován půdorys. Opravena i souvislá společná stěna 617–618 (virtuální výška pro RÚIAN party-wall planner, žádné falešné okno do souseda): odhadem 29 spojů / 58 nezdobených vnitřních fasád. **OSM datový tag se NEMĚNÍ**. **5.155 [plná CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44379650843), [mobilní WebGL +6,5s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44379650735), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44379648444)**. Starší 5.133 RÚIAN WebGL byl v novém workflow také úspěšný. 5.154 zůstává PASS.

## Odkazy a spuštění

- Hra: https://foxey-cz.github.io/milovice-life-rp/
- Nová kontrolní kamera: https://foxey-cz.github.io/milovice-life-rp/?v=515500&streetAudit=topolova-panel-row-5155
- GitHub: https://github.com/FOXEY-CZ/milovice-life-rp
- Kompletní historie: `README.md`. Pracovní pokyny: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`. Metodika reality: `docs/STREET_WORKFLOW.md`, `docs/reality-audit-00.md`.
- Herní kód: `index.html`; moduly: `scripts/`; mapové zdroje: `data/regions/mlada.json`. Nečíst příště celé 560kB `index.html`: vyhledat dotčené moduly a identifikátory.

## 5.155 — celý navazující blok Topolová 614–618, pět nadzemních podlaží

- ČSÚ iRSO stavební objekty: č.p. 614/22968067, 615/22968075, 616/22968083, 617/22968091, 618/22968105, všechny 5 nadzemních podlaží a panelové nosné zdi. Zdrojové detailní odkazy na všech pět objektů v README 5.155.
- OSM 618: way 61979145, 5 GPS bodů, hash b69a7ef6, původní building:levels=1 a 10 bytů. **Nepřepisovat tag ani originální geometrii.** Opravovat jen vizuální floors=5, výšku modelu na 15,25 m; rozměr model, ČSÚ nepotvrdil metry ani střešní formu.
- Všechny 5 části RÚIAN sdílejí 4 přesné společné hrany. Opravit falešné externí fasády 617–618 zdrojově uzamčeným dočasným vstupem pro planner vnitřních stěn; aktuálně po přidání RÚIAN 29 spojů / 58 nezdobených fasád místo 28 / 56. **OSM originál neměnit**.
- Nový modul scripts/osm-topolova-panel-row-5155.js + unit + mobilní Chromium/WebGL >6,5 s LOD; opraven starý RÚIAN browser očekávaný počet. Gable z původní mylné jednopatrové klasifikace odstraněn, návrh ploché střechy je model. Nic v cestách, domovní GPS, kolizích, vstupu nebo dopravě nezměněno.
- **CI/WebGL/Pages PASS** (odkazy nahoře); první mobilní kontrola jen chybně čerpala součet společných stěn z runtime místo auditu, opraveno f2a4741 a druhý běh úspěšný. Další krok: vyhledat přesnou fotografii frontů 614–618 nebo pokračovat další souvislou ulicí.

## 5.154 — nový úřední podklad pro školní západní fasádu

- Výkaz lešení 21. 5. 2020, město Milovice: https://www.e-zakazky.cz/stazenisouboru/61b37d16-23a5-4b6b-ae61-13e546a3e2ad, PDF strana 5, 44m fasáda a 13,15m výšková referencia ve vzorci.
- OSM way 53865699, RÚIAN 26092069, západní edge 1 = 44,429 m a východní edge 7 = 44,299 m. Zůstává všech 9 původních GPS bodů a building:levels=2 v datech OSM.
- Visual-only výška 13,15 m (dříve 12,2 m) je stále odhad podle projektu, nikoliv zaměřený skutečný hřeben střechy. Projekt 55 žaluzií neslouží jako důkaz instalace.
- Nový modul scripts/osm-slunicko-west-elevation-5154.js, unit a mobilní Chromium po 6,5s LOD, runtime window.__miloviceSlunickoWestRuntime(). Ověřováno vertikální rozpětí skutečné extrudované stěny před batchingem.
- **CI, mobilní WebGL po 6,5s LOD a Pages ověřeny: PASS (odkazy nahoře).** Přísný zdrojový GPS hash byl doplněn po prvním neúspěšném unit testu, který odhalil příliš benevolentní toleranci; opakovaný nový test již úspěšný. Další krok: foto západní fasády školy a navázání okolních domů a pěších přístupů Topolové.

## Nová 5.153 — pokračování Topolové

- Zdroj: https://www.ms-slunicko.com/predstavujeme-ms/ a ČŠI https://portal.csicr.cz/Files/Get/578617D0-B976-456E-85CB-56E21E47B226?db=Archive
- OSM zdroje: 53865699 / RÚIAN 26092069 / 9 GPS bodů / FNV 912f8e04 / původní building:levels=2. Sousední školní pavilon 53865700 se nemění.
- 3D: čtyři modelová podlaží po 3,05 m, dohromady 12,20 m; **neověřený předpoklad čtyř NADZEMNÍCH úrovní**, nikoliv skutečně změřená výška. Žádné nepodložené dveře nebo nové uliční objekty.
- Modul a regrese: scripts/osm-slunicko-storeys-5153.js, unit scripts/osm-slunicko-storeys-5153.test.mjs, mobilní scripts/osm-slunicko-storeys-webgl-5153.mjs, workflow slunicko-storeys-5153.yml a window.__miloviceSlunickoRuntime().
- **CI, mobilní WebGL 6,5s LOD a Pages ověřeny: PASS** (odkazy nahoře). Zároveň opraveny staré statické testy 5.119/5.145, které vyžadovaly doslovný starý zápis dvou nezměněných pravidel. Dlouhý obecný browser smoke test zatím běží. Další krok: skutečná fotografie hlavní budovy a vyjasnění počtu nadzemních pater, pak pokračovat souvislou ulicí.

## Co je důležité o verzi 5.152

- **Příčina:** `scripts/reality-walkways.js:planZebraPieces` původně generoval šest pásů **paralelních s OSM směrem chůze**. Podle českého značení V7a jsou na běžném přechodu čáry naopak **rovnoběžné se směrem jízdy**, tedy napříč osou přecházení. Ověřeno [metodikou MD ČR](https://md.gov.cz/getattachment/Dokumenty/Veda-a-vyzkum/Certifikovane-metodiky/Silnicni-metodiky/Metodika-doporuceni-pro-realizaci-ci-upravy-u-vybr/Metodika-Doporuceni-pro-realizaci-ci-upravy-u-vybraneho-typu-prechodu-pro-chodce.pdf.aspx).
- **Nové vykreslení:** po OSM směru chůze jednotlivé příčné 0,5m pruhy zhruba po 0,95m, přes zhruba 3,4m šířku přechodu. **Rozteče a šířky model**, nejsou fotograficky zaměřené. Každý pruh je ořezaný na již evidovanou vozovku; ostrůvky, okolní chodníky a nemapované/neznačené přechody zůstávají bez bílé barvy. `crossing:markings=no` nadále nepřemalovat.
- **Referenční mapovaná zebra:** Mladá OSM `way/1316882853` mezi `(50.2304072,14.8663619)` a `(50.2304133,14.8662413)`. Jedna z pěti tagovaných `crossing=zebra` v regionu. Runtime `window.__miloviceZebraV7Runtime()` a `window.__miloviceSidewalkDebug`. Žádný nový OSM objekt, přechod, routing, kolize, budova, plot, lampa, parkovací stání.
- **Kontrola:** unit `scripts/osm-zebra-v7-5152.test.mjs`, starý `osm-sportovni-topolova-zebra-5147.test.mjs` a `reality-walkways.test.mjs`, mobilní WebGL `osm-zebra-v7-webgl-5152.mjs` s LOD po 6,5 sekundách a ochranou starších scén. **[Plná CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44358598412), [WebGL + LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44358598304), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44358597439).**

## Poslední ověřené kroky

| Verze | Co bylo změněno | Zdroj / omezení |
| --- | --- | --- |
| **5.155** | Topolová 614–618, úředních 5 nadzemních pater; oprava OSM nesouladu 618 a společné stěny 617–618 | Přísný GPS/RÚIAN zámek, bez změny originálních dat; CI/WebGL/Pages PASS. |
| **5.154** | MŠ Sluníčko: projektová západní fasáda 44 m, výška vizuální hmoty 13,15 m | Rozpočtový údaj není as-built zaměření; přísný OSM hash, CI/WebGL/Pages PASS. |
| **5.153** | Čtyři modelovaná podlaží podle školy/ČŠI | Půdorys zachován, novou výšku viz 5.154, předchozí CI PASS. |
| **5.152** | Správná orientace pruhů pěti OSM zebřích přechodů podle V7a | Žádné nové GPS ani přechody; CI/WebGL/Pages PASS. |
| **5.151** | ~31m průhledného zeleného plotu, 11 sloupků, 2,10m vizuálního pásu u Milten, 3 draw objekty | Foto restaurace dokládá **existenci** plotu/uličky, konkrétní hrana OSM kurtu `612386900` u haly `53866046` a rozměry jsou **modelové odhady**. CI/WebGL/Pages PASS. |
| **5.150** | Sedm modelovaných tenisových kurtů a sítí místo čtyř generických polygonů | Milten Sport Center Sportovní 588 uvádí 7 venkovních kurtů; OSM má čtyři plochy `612386900/901/902` a `1278746589`. Rozvržení 2+2+2+1 není zaměřené. CI/WebGL/Pages PASS. |
| **5.149** | Topolová 647, OSM `53866045`, RÚIAN `42429056`: odstranění chybných prefabrikovaných panelových spár | ČSÚ potvrzuje zděné **nosné stěny**, 6 pater, 60 bytů; fasáda/okna/vstup stále nejsou fotograficky ověřené. CI/WebGL/Pages PASS. |
| **5.148** | Šestipodlažní bytový dům Topolová na původních 23 OSM bodech; přízemní vstup a sokl | Geometrie a 6 pater z OSM/RÚIAN, polohy oken a vstupu modelové. CI/WebGL/Pages PASS. |
| **5.147** | Pět historicky tagovaných mapovaných `crossing=zebra`, dříve ignorovaných rendererem | Skutečné OSM GPS beze změn; 5.152 opravuje **orientaci** kresby. CI/WebGL/Pages PASS. |
| **5.146** | ~49m severní pěší pás podél Sportovní `8618266` | Foto 2024 potvrzuje existenci obou chodníků; severní přesnou OSM geometrii nemá, jde jen o viditelný pás, ne navigaci. |
| **5.145** | Hala u Sportovní `53866046`: výška modelově 9,6 m, východní světlé svislé žebrování | Fotografie 2024, přesné metry modelové. |
| **5.144–5.137** | Sportovní/Průběžná: foto GPS kamery, vchody 9 bytových domů, basketbal 2 koše podle OSM, pěší návaznosti, povrchy, panelové spáry a silnice | Jednotlivé modelové odhady jsou v `README.md`. |

Starší oblasti zahrnují nádraží, Bike Tower, staré centrum, garáže, Školskou, Mladou, Juventský les, Slepou. **Nemá se tvrdit, že každá budova nebo celá ulice je již věrně dokončena.**

## Pravidla a otevřená práce

1. **Vize:** celé propojené Milovice jako 3D realistická webová GTA/RP hra — budovy, střechy, okna, dveře, silnice, obruby, chodníky, značení, skutečná zeleň, osvětlení, nádraží a doprava; udržet FPS/mobilní WebGL. Nejen miniaturní dekorace, realizovat souvislé ulice.
2. **Důkazy:** zachovat všechny OSM/RÚIAN identifikátory, GPS i geometrii. Fyzicky zobrazovat jen zdrojem podložené objekty; jejich neověřené rozměry a povrchy jasně označit `model`. Nepřidávat fiktivní přechody, lampy, stání, stromy, vchody, brány či trasování.
3. **Nejbližší směr po 5.155:** pokračovat po **Sportovní × Topolová** celou ulicí, především skutečně fotograficky/úředně doložené střechy a přístupy. Zkontrolovat přechody z pozice chodce a jejich napojení na již mapované chodníky. Nedoplňovat bez podkladů.
4. **Nejistoty:** ČSÚ Sportovní 587 (RÚIAN `27906264`) uvádí tři podlaží *celkem*, není to potvrzený počet **nadzemních** podlaží ani přesná střecha. Některé půdorysy/objekty jsou větší než zdrojové fotografie. Plán 109 parkovacích stání a 22 lamp v části Průběžné nemá georeferencované detaily C.3; nedomýšlet polohy.
5. **Workflow:** po „Pokračuj“ ověřit HEAD + přečíst `AGENTS.md` a tento stručný stav + jen nejnovější sekce `README.md`, pak relevantní kód. Změnit jeden věcný blok v jednom atomickém commitu, přidat test, mobilní Chromium 6s+ LOD a validaci; PASS uvádět až po skutečném proběhnutí. Unit rychle: `node scripts/dev-check.mjs sportovni` nebo `node scripts/dev-check.mjs --list`. `DEVELOPMENT_STATUS.md` aktualizovat dle CI.
