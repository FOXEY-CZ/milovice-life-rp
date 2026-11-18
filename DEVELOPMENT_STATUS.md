# Milovice RP — rychlý handoff vývoje

> **Nová 5.162 (18. 11. 2026; CI/WebGL/Pages PASS):** 2 nové viditelné herní NPC skutečně používají zdrojově uzamčenou **OSM dlážděnou pěšinu 1316882860** (hash `35c50c19`, 2 uzly, cca 29,3 m) místo náhodné vozovky. Severní konec je identický se zdrojovým uzlem servisní 202399863 hash ec6c3bc0; jižní konec s mapovaným chodníkem 1316882852 hash a50c0251. Oba simulovaní chodci používají 2m bezpečný odstup od koncových uzlů, stávající 3D NPC rig a aktualizaci provozu. Přidaných fyzických cest, kolizí, vchodů, značek, lamp, aut, chodníků = **0**. Mladá/Topolová model 5.155–5.161 nedotčen. Jednotkové testy + mobilní WebGL +7,35s LOD a regresní vše úspěšně: **[Celkové CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44409477126), [nový mobilní WebGL +7,35 s a pohyb NPC PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44409476976), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44409475710).**

> **Nová 5.161 (18. 11. 2026; CI/WebGL/Pages PASS):** Topolová **616–618** (OSM 61979144/139/145) má 6 zdrojově uzamčených venkovních 16m fasád místo generických oken. Vzor **EXTRAPOLOVANÝ** ze sousedních městských 614/615 výkresů 2024; nevydávat za georeferencované foto. ČSÚ 5 pater, část balkonů 617/618 doložena městskými prodeji bytů, přesná umístění neznámá. Jen **3 sdílené fyzické GPU meshe**, 72 modelových oken, 48 prozatímních balkonových výplní, 24 schodišťových výplní; 6 generických fasád vypnuto. Žádné vymyšlené dveře, balkony s deskou, komunikace ani kolize. OSM obslužná 202399863 a pěší 1316882860 už v mapě, nezměněné; návrh požárního značení z roku 2023 není as-built. Společná valbová střecha 5.160 a skutečné 614/615 výkresy zůstaly. Nový source/unit + mobilní WebGL po 7,2s LOD: **[Celková validace CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44406144887), [mobilní WebGL 5.161 po 7,2 s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44406144814), [regrese střechy 5.160 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44406145186), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44406143332).**

> **Nová 5.160 (18. 11. 2026; CI/WebGL/Pages PASS):** Městská usnesení Čelákovic 14/2023 a 27/2023 popisují **pětipodlažní pětivchodový dům Topolová 614–618 s VALBOVOU střechou**, nikoli 5 rovných střech. Source-lock 5.155 nad 5 původními RÚIAN půdorysy: starých 5 flat caps se nevytváří a nad celým 80m blokem přibyl **jediný hipped roof GPU mesh s 22 trojúhelníky**. Okapní obvod drží přesných 10 OSM bočních hran; 2,25m převýšení hřebene a barva jsou model, ne geodetická fakta. Fasády 614–615/5.159, 5 pater/15,25m stěn, kolize, GPS, cesty, ostatní ulice nedotčeny. Nový unit, mobilní WebGL >7,0s LOD a vlastní workflow: **[Kompletní CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44404480704), [nový mobilní WebGL +7,0 s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44404480545), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44404478799).**

> **Nová 5.159 (18. 11. 2026; CI/WebGL/Pages PASS):** podepsané výkresy města/PSK TUZAR 2024 pro Topolovou 614–615, ZÁPAD a VÝCHOD, PDF strany 10–12: https://zakazky.mesto-milovice.cz/document_184/107a3038c3f90b7000c396e9ce9f9f75-projektova_dokumentace_podepsana-pdf. Čtyři skutečné 16m OSM fasády z 2 source-locked budov 61979151/22968067, 61979152/22968075, hrany [2,0] a [1,3]. Šest sloučených GPU meshů: 48 modelových dvojkřídlých oken, 32 balkonových sestav, 16 schodišťových okének, čtyři vizuální vstupy a čtyři zdrojově doložené oblé schodišťové nástavby. Barevné PVC 1750×1350mm doloženo, skutečné absolutní rozteče/výšky **model, ne as-built**. Zdi, GPS, kolize, řada 616–618 a zbytek ulic nezměněny. CI/WebGL/Pages jsou ověřené: **[Celková CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44399024857), [nová mobilní WebGL +6,9 s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44399025166), [regrese 5.155 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44399025125), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44399022791).**

> **Nová 5.158 (18. 11. 2026; CI/WebGL/Pages PASS):** Topolová 646: na všech 6 krátkých mapovaných fasádách [0,1,2,3,4,6] jsme odstranili nepodložené generické modely oken/vchodů. Krémové neprůhledné stěny, obě 43m fotofasády, 4 GPU meshe, střecha, GPS hash 73d119b1, kolize a okolní silnice zachovány. Existence reálných oken není vyvrácena, chybí pouze georeferencovaná poloha. Unit + mobilní WebGL 6,9s LOD prošly. **[Celková CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44395744528), [mobilní WebGL +6,9s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44395744503), [regrese 5.157 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44395743730), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44395742263).** Nejbližší: najít krátké boční foto/vstupy.

> **Nová 5.157 (18. 11. 2026; CI/WebGL/Pages PASS):** dům **Topolová 646** nově z obou dlouhých stran podle referenčních fotek z roku 2025 (fotografie 2 od vozidel a 3 od zeleného plotu). Foto přímo ukazuje půlkruhově ukončené podkrovní zasklení, dříve chybně obdélníkové. OSM 53866048 / RÚIAN 25789813, GPS hash 73d119b1, hrany 5 a 7 měří 43,046 m a 43,021 m; obě obdržely odhadovanou pravidelnou fasádu. Počty oken/štítů, přiřazení světové strany i metry jsou nadále odhady, ne georeferencovaná fotogrammetrie. **4 sloučené fasádní meshe i pro 2 líce**; generické fasády na obou dlouhých stranách vypnuté. Žádné vymyšlené vchody ani GPS změny. **5.157 [plná validace PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44385453094), [mobilní WebGL +6,9s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44385453029), [starší 5.156 mobilní WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44385453142), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44385451098).** Původní 5.156 nadále vyhovuje.

## Odkazy a spuštění

- Hra: https://foxey-cz.github.io/milovice-life-rp/
- Nová kontrolní kamera: https://foxey-cz.github.io/milovice-life-rp/?v=516200&streetAudit=topolova-walkers-5162
- Předchozí 5.161: https://foxey-cz.github.io/milovice-life-rp/?v=516100&streetAudit=topolova-inferred-616618-5161
- Předchozí 5.160: https://foxey-cz.github.io/milovice-life-rp/?v=516000&streetAudit=topolova-hip-roof-5160
- Předchozí 5.159: https://foxey-cz.github.io/milovice-life-rp/?v=515900&streetAudit=topolova-drawing-614615-5159
- Předchozí 5.158: https://foxey-cz.github.io/milovice-life-rp/?v=515800&streetAudit=topolova-646-short-5158
- Předchozí 5.157: https://foxey-cz.github.io/milovice-life-rp/?v=515700&streetAudit=topolova-646-both-5157
- GitHub: https://github.com/FOXEY-CZ/milovice-life-rp
- Kompletní historie: `README.md`. Pracovní pokyny: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`. Metodika reality: `docs/STREET_WORKFLOW.md`, `docs/reality-audit-00.md`.
- Herní kód: `index.html`; moduly: `scripts/`; mapové zdroje: `data/regions/mlada.json`. Nečíst příště celé 560kB `index.html`: vyhledat dotčené moduly a identifikátory.

## 5.162 — dva herní chodci na přesné OSM pěšině 1316882860
- Existující `highway=footway`, `paving_stones`, `lit=yes` ~29,3m. Původní zdrojové napojení: severně OSM service 202399863; jižně dlouhá OSM footway 1316882852. Sjednocení cest existovalo už před verzí, žádnou syntetickou T-záplatu nekreslit.
- Dva simulační NPC z již stávajícího `makeHumanRig` a `trafficPeople` chodí v čase tam a zpět po 25,3m středním úseku zdrojové GPS linie (odstup 2m na obou koncích). Tím se vyhnou přechodu do servisní komunikace a neověřeným domovním vstupům. 0 nových povrchů, colliderů, dveří, značek a umístěných objektů.
- Modul `scripts/osm-topolova-mapped-walkers-5162.js`, unit + mobilní WebGL 7,35s a regrese 5.161/5.160, runtime `window.__miloviceTopolovaWalkersRuntime()`. **CI/WebGL/Pages PASS** (odkazy v úvodu). Další: pokračovat po jižně navazující skutečné pěší síti, ověřit místa vchodů 616–618 z fotografií.

## 5.161 — prozatímní model 616–618 na existujícím OSM obvodu
- Ovšem přesná 2024 městská dokumentace platí POUZE pro 614/615: na 616–618 používáme **inferenční okenní rytmus**, důkaz se týká jednotné pětidomové soustavy a existujících balkonů SOME bytů 617/618 (městský inzerát). Neznáme přesné rozestupy ani vstupy.
- OSM 61979144/139/145, RÚIAN 22968083/91/105, originální GPS/hash beze změn; na každém 2 venkovní strany mapového indexu 1/3. Tři sloučené GPU meshe pro 6 líců, 72 obdélníkových oken a 48 prozatímních sestav +24 schodišťových, žádná skutečná balkonová deska nebo neověřené dveře. Šest starých generických fasád přeskočeno.
- Sousední OSM obslužná cesta 202399863 a dlážděná pěší 1316882860 skutečně již mapované a rendererem zachované; 2023 městská studie B28/V12c jen návrh, *ne* fyzicky doložené umístění. Žádné nově vymýšlené komunikace.
- Modul `osm-topolova-estimated-facades-5161.js`, unit, WebGL+7,2s LOD a regrese 5.160/5.159. **CI/WebGL/Pages ověřeny PASS** (odkazy v úvodu). Další: doložit georeferencované foto bočních průčelí a jednotlivé vchody 616–618, potom navázat OSM pěší přístupy.

## 5.160 — Topolová 614–618: celá valbová střecha místo 5 plochých capů
- Úřední opora: https://www.celakovice.cz/filemanager/files/2973758.pdf str. 6/9 a https://www.celakovice.cz/filemanager/files/3310832.pdf str. 6: 617–618 část pětipatrového pětivchodového domu s valbovou střechou; doloženy také dva balkony po 1,91 m² u některých bytů, ale **ne jejich přesné pozice**.
- OSM source-lock 5.155: domy 614–618 sdílí 4 příčné plné stěny a tvoří asi 80m řadu. 5 starých modelových plochých střech vypnuto, nově 1 fyzický souvislý střešní mesh / 22 triangles / 10 skutečných bočních úseků + 2 skutečná čela. Okapy navazují na DEM kotvy, modelový vzestup 2,25m a odstín jsou odhady. Žádná změna OSM, silnic, chodníků, kolizí či fasád 614–615.
- Modul `osm-topolova-continuous-hip-5160.js`, unit `...5160.test.mjs`, mobilní WebGL +7,0s LOD, runtime `__miloviceTopolovaHipRuntime()`. **CI/WebGL/Pages ověřeny PASS** (odkazy v úvodu). Další: fotografie 616–618 + přesné vstupy/napojení pěších tras.

## 5.159 — fasády Topolová 614–615 podle městských výkresů
- Strana 10/11 podepsaného PDF (západ/východ) jasně zobrazuje kompozici 5 pater, dva vchody, oblé zakončení a balkonové sestavy. Výpis strana 12 obsahuje rozměry 1750×1350mm (standardní dvoukřídlá okna) a 800×2000mm (balkonové dveře). PDF https://zakazky.mesto-milovice.cz/document_184/107a3038c3f90b7000c396e9ce9f9f75-projektova_dokumentace_podepsana-pdf.
- Přesná OSM ID, RÚIAN a GPS hash pro 614–615 uzamčeny; žádná nová cesta, strom, lampa, stání, kolize ani měněná stěna. U obou budov po 3 fyzických meshích; 4 generické fasády potlačeny. Výškový model stále 15,25m, zaoblení/rozestupy modelové odhady.
- Nový modul `osm-topolova-drawing-614615-5159.js`, unit, mobilní WebGL 6,9s a workflow. **CI, mobilní WebGL po LOD a Pages PASS** (odkazy v úvodu). Další: doložit detail 616–618 a veřejná pěší napojení.

## 5.158 — Topolová 646: šest krátkých stěn bez neověřených generických doplňků
- Hrany 0,1,2,3,4,6 mají 6,337 / 3,452 / 7,253 / 3,434 / 2,874 / 16,515 m. Generické okno/dveře pro tyto hrany potlačeny, ale samotné krémové zdi a OSM polygon zůstávají. Není to tvrzení, že reálné krátké strany nemají žádná okna.
- Nový unit + mobile Chrome/WebGL >6,9s LOD, `__miloviceTopolovaShortEndsRuntime()`, vlastní workflow. Celková CI, mobilní WebGL 5.158 + 5.157 a Pages **PASS** (odkazy v úvodu). Následuje doložení krátkých průčelí a přesných vstupů.

## 5.157 — Topolová 646: obě 43m fasády a vyklenutá podkrovní okna

- Zdroj dvě odlišná exteriérová foto dlouhých líců: https://www.revitalizacebytovek.cz/realizace/topolova-646-milovice, foto č. 2 od vozidel a č. 3 od živého plotu. Přímý důkaz krémové/lososové omítky, opakovaných štítů a půlkruhového zasklení. Negeoreferencovaná foto orientace: není známo, které dlouhé GPS straně patří konkrétní detail.
- Skutečné OSM 53866048, RÚIAN 25789813, hash 73d119b1, 9 mapových GPS bodů; originální wall edge 5 = 43,046 m a edge 7 = 43,021 m. Model generuje obě stěny s modelovým rozvrhem po 8 štítech, 48 běžných a 16 podkrovních půlkruhových oken na stranu; 2× v součtu. Oblouk skutečně triangulovaný, 10 úseček, ne obdélníkový hranatý decal.
- Vykreslení ve 4 sdílených materiálových meshech pro obě strany dohromady; dva generické fasádní passthrough na skutečných OSM hranách záměrně vypnuté. Výška 9,15m a červená střecha modelově ponechána z 5.156. OSM level=1, sousední 647, 614–618, MŠ, chodníky a silnice beze změny.
- Modul scripts/osm-topolova-photo-646-5157.js, unit s fyzickými vertex buffery, mobilní Chrome/WebGL +6,9s LOD, regresní testy staré 5.156/5.155 a workflow .github/workflows/topolova-both-facades-5157.yml. Nový runtime __miloviceTopolovaBothFacadesRuntime() kontroluje počet foto-stran, vypnuté generické fasády, 4 reálné GPU meshe a přežití LOD. **CI, mobilní WebGL po 6,9s LOD a GitHub Pages skutečně PASS (odkazy nahoře).** Původní statické testy hlídaly doslova starý single-facade výraz z 5.156; opraveno v commitu 92c2abf, následný nový unit i obě samostatné mobilní WebGL workflow zelené.
- Další krok: georeferenční určení skutečných vstupů a krátkých průčelí z foto/OSM, pak pokračovat další ulicí.

## 5.156 — Topolová 646: fotografie skutečné fasády 2025

- Zdroj 3 skutečných fotografií adresy: https://www.revitalizacebytovek.cz/realizace/topolova-646-milovice. Jsou vidět 3 standardní fasádní okenní řady, lososové svislé členění, tmavě červené štíty podkroví. Foto exteriéru není georeferencované, strana průčelí podle OSM je odhad.
- ČSÚ https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=1914643&hkodcis=43&idob=1031339361&kod=537501&kodcis=43&kodpol=nnnnnn: bytový dům / 27 bytů / zdivo; OSM building:levels=1 a ČSÚ všechny=1, *nadzemní podlaží nezjištěna*. Ve hře vizuální fotorekonstrukce 3 běžných okenních řad, NIKOLI úředně potvrzený počet pater.
- 3D: hlavní stěna 9,15m, podkrovní převýšení 2,50m, 8 modelových štítů, 48 oken + 16 podkrovních. Čtyři sdílené batched material meshes. Strana fotomodelu OSM edge5 (východní 43,046m), protější edge7 43,021m; foto přesný azimut neudává.
- Přísný OSM/RÚIAN hash 73d119b1 na všech 9 GPS bodech, žádná nová silnice, chodník, kolize, vstup, lampa ani parking. Foto doložilo existenci vstupního přístřešku, **bez znalosti GPS polohy není domodelován**.
- scripts/osm-topolova-photo-646-5156.js, cílený unit, nový mobilní WebGL po 6,8s LOD, workflow topolova-photo-646-5156.yml. **CI, mobilní WebGL po 6,8s LOD a Pages ověřeny PASS (odkazy nahoře).** Původní kontrolní skript chybně očekával 9 uzavřených OSM bodů přímo v renderu, ale engine správně používá 8 unikátních; opraveno 95fc4ea. Následně opravena milimetrová tolerance GPU Float32 pro 9,15m stěnu, commit 5a070f2. Závěrečné testy potvrzují 4 foto-fasádní meshe i zachované sousední bloky. Další krok: fotodoložení druhého průčelí, pak navázat další Topolová blok.

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
| **5.162** | Topolová 614–618: 2 simulovaní NPC na původní OSM pěšině, 2m od konců | Žádné nové cesty nebo fyzické objekty; CI/WebGL/Pages PASS. |
| **5.161** | Topolová 616–618: jednotný 6stranný výplňový model, 3 GPU meshe | Pouze prozatímní extrapolace 614/615, 6 generických přeskočeno, fyzické GPS/ulice zachovány; CI/WebGL/Pages PASS. |
| **5.160** | Topolová 614–618: místo 5 plochých poklic 1 valbová souvislá střecha | Usnesení města 2023, 22 GPU trojúhelníků, rise 2,25m model; CI/WebGL/Pages PASS. |
| **5.159** | Topolová 614–615: 4 modelované západní/východní projektové fasády, 6 GPU meshů | Projekt 2024; přesná výška/rozteče model, CI/WebGL/Pages PASS. |
| **5.158** | Topolová 646: 6 krátkých skutečných stěn bez vymyšlených oken | Základní stěny/GPS zachovány, CI/WebGL/Pages PASS. |
| **5.157** | Topolová 646: dvě 43m foto-fasády, 32 klenutých podkrovních oken, generické fasády potlačeny | 4 sdílené mesh; počet štítů/rozteče model; CI, mobilní WebGL+LOD, Pages PASS. |
| **5.156** | Topolová 646: skutečná fasáda a podkroví z přímých foto 2025, původně chybná jednopodlažní hmota | 3 řady a podkrovní štíty, metry i rozteče model; CI/WebGL/Pages PASS. |
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
3. **Nejbližší směr po 5.162:** pokračovat po **Sportovní × Topolová** celou ulicí, především skutečně fotograficky/úředně doložené střechy a přístupy. Zkontrolovat přechody z pozice chodce a jejich napojení na již mapované chodníky. Nedoplňovat bez podkladů.
4. **Nejistoty:** ČSÚ Sportovní 587 (RÚIAN `27906264`) uvádí tři podlaží *celkem*, není to potvrzený počet **nadzemních** podlaží ani přesná střecha. Některé půdorysy/objekty jsou větší než zdrojové fotografie. Plán 109 parkovacích stání a 22 lamp v části Průběžné nemá georeferencované detaily C.3; nedomýšlet polohy.
5. **Workflow:** po „Pokračuj“ ověřit HEAD + přečíst `AGENTS.md` a tento stručný stav + jen nejnovější sekce `README.md`, pak relevantní kód. Změnit jeden věcný blok v jednom atomickém commitu, přidat test, mobilní Chromium 6s+ LOD a validaci; PASS uvádět až po skutečném proběhnutí. Unit rychle: `node scripts/dev-check.mjs sportovni` nebo `node scripts/dev-check.mjs --list`. `DEVELOPMENT_STATUS.md` aktualizovat dle CI.
