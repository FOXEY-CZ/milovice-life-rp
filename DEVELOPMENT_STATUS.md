# Milovice RP — rychlý stav vývoje

> **Účel:** stručný průběžný přehled pro navazování ChatGPT vývoje. Historie změn je v `README.md`; zdroj pravdy je aktuální GitHub `main`, nikoliv předchozí chat.
>
> **Aktuálně ověřená verze 5.151 (18. 11. 2026):** zelené pletivo a vizuální pěší pás u tenisového areálu Milten podle veřejné fotografie, bezpečně modelově kotvené mezi původní OSM kurt 612386900 a halu Sportovní 588 (53866046). Existenci plotu a chodníku dokládá fotografie, vybranou hranu a rozměry **odhadujeme**. [5.151 kompletní CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44355256678), [5.151 mobilní WebGL + LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44355256693), [5.151 Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44355255318). Předchozí **5.150**: [kompletní CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44351742198), [mobilní 3D PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44351741766), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44351740395).

## Projekt a odkazy

- Repozitář: https://github.com/FOXEY-CZ/milovice-life-rp
- Veřejná hra (GitHub Pages): https://foxey-cz.github.io/milovice-life-rp/
- Poslední kontrolní kamera: https://foxey-cz.github.io/milovice-life-rp/?v=515100&streetAudit=milten-court-corridor-5151 (technický OSM pohled, ne fotokamera)
- Webová hra: `index.html`; stavební editor: `editor.html`; kontrolní pohledy a pomůcky: `survey.html`, `photo-pilot.html`, `rebuild.html`.
- Herní moduly a testy: `scripts/`; OSM, výšková a regionální data: `data/` a `data/regions/`; metodika: `docs/STREET_WORKFLOW.md`, `docs/building-rebuild-program.md`, `docs/reality-audit-00.md`.
- Detailní verze a zdůvodnění: `README.md` (číst **jen nejnovější relevantní sekce**, ne všech 366 kB).

## Vize a pevná pravidla

Budovat **celé propojené Milovice** jako prohlížečovou realistickou 3D RP/GTA-like hru: nejen autobusy, ale celé ulice včetně domů, vozovek, chodníků, nádraží, železnice, dopravy, zeleně, drobného mobiliáře a postupně dalších rolí. Mobilní použitelnost a cílově plynulý výkon (cca 60 FPS na vhodném zařízení) jsou důležité.

1. Reálná geografie: zachovat identifikátory a souřadnice OSM/RÚIAN. Každá domněnka (barva, výška, okna, střecha, povrch) musí být označená jako **modelový odhad**, dokud ji nepotvrdí konkrétní použitelný zdroj. **Nedomýšlet přesná parkovací stání, lampy, přechody nebo stromy** bez podkladů.
2. Ulice zpracovávat **jako celek**, ne izolovaně jen jednu budovu. Dům musí správně sedět na terénu; žádné plovoucí vchody, odlepená okna ani chybné střechy. Sdílené opravy upřednostnit před ručním opravováním stejných chyb po domech.
3. Používat dostupné veřejné/licenčně přípustné fotografie, OSM a úřední dokumenty. Mapy.com Panorama může uživatel dodat při cílené kontrole, **nečekat však na panorama každého domu**. Nezaměňovat technickou herní kameru za fotograficky totožný pohled; respektovat licence fotografií.
4. Každý zásah má chránit již hotové regiony i FPS: znovupoužití materiálů/instancování, ochrana kolizí, kontrola LOD a testy. Neměnit funkční herní subsystémy bez důvodu.

## Co je hotové / poslední stavební práce

| Verze | Oblast | Výsledek podle README a kódu |
| --- | --- | --- |
| **5.151 – ověřeno** | Sportovní – Milten kurt a pěší pás | Fotografie restaurace Milten skutečně ukazuje zelený plot a zpevněnou uličku vedle antukového kurtu. Jen modelové **31m pletivo/11 sloupků a 2,10m grafický pěší pás** na odhadnuté východní straně existujícího OSM kurtu 612386900 vedle RÚIAN haly 53866046; konkrétní umístění není geofotograficky ověřené. GPS, stavby, cestní routing a kolize neměněny. Kompletní CI, mobilní 3D WebGL/LOD a Pages **PASS**. |
| **5.150 – ověřeno** | Sportovní / Topolová – 7 tenisových kurtů | Milten Sport Center Sportovní 588 uvádí 7 venkovních antukových dvorců. Čtyři OSM tenisové polygony 612386900/901/902/1278746589 geometricky dovolují **odhadované rozdělení 2+2+2+1**. Nahrazené generické čáry uvnitř původních polygonů; 7 modelovaných sítí, 14 sloupků, 3 sdílené draw objekty. Přesné rozmístění neověřeno fotografií. Kompletní CI, mobilní WebGL a Pages **PASS**. |
| **5.149 – ověřeno** | Topolová 647 – skutečný zděný dům | Úřední ČSÚ/iRSO RÚIAN 42429056 potvrzuje cihly/tvárnice jako **nosné zdivo**, 6 podlaží a 60 bytů. Odstraněny modelové panelové spáry na původní budově OSM 53866045, použita sdílená neutrální fasáda. Vnější omítka/barva stále model; OSM GPS, střecha a vstup nezměněny. Celkové CI, mobilní WebGL a Pages **PASS**. |
| **5.148 – ověřeno** | Topolová – šestipodlažní RÚIAN bytový dům | Na stávajícím přesném 23vrcholovém OSM půdorysu 53866045/42429056 modelové podlažní a svislé spáry dle doložených 6 podlaží; 60 bytů jen evidenční údaj. Oddělený audit, ochrana vchodu proti soklu a oknům, bez fotograficky nepodložené stříšky. Oprava zastaralé 6/7 kontroly menu. Kompletní CI, mobilní 3D WebGL, menu i Pages **PASS**. |
| **5.147** | Sportovní × Topolová – mapované zebry | Opraveno ignorované OSM `crossing=zebra` pro pět skutečných přechodů Mladé. Původní GPS nezměněny, pruhy pouze na asfaltu. **Validace, mobilní WebGL a Pages PASS; samostatný menu-test 5.147 měl zastaralý počet a opravuje se v 5.148.** |
| **5.146** | Sportovní – severní fotochodník | Doložena existence obou chodníků na foto 2024; jižní je původní OSM 1316882852, severní v tomto úseku nemá vlastní OSM geometrii. Doplněn *jen grafický přibližný model 49 m* + obruba podle skutečné vozovky 8618266, žádné navigační hrany, kolize ani nové přechody. Unit / mobilní WebGL / deploy **PASS**. |
| **5.145** | Sportovní – skutečná sportovní hala | OSM/RÚIAN hala 53866046 (1 podlaží) zvednuta z generických 3,05 m na modelových **9,6 m** dle fotografie 2024, na foto-východní fasádě přidán šedý kovový plášť a ~39 svislých žeber; žádná okna či fiktivní dveře na doloženě holé stěně. Výška/rozteče nejsou měřené. Obecné náhodné prosklení ostatních neověřených stěn je potlačené. **Unit + mobilní WebGL + deploy PASS.** |
| **5.144** | Průběžná / Sportovní – fotoaudit 2024 | Dvě kamery přímo z GPS/EXIF fotografie Wikimedia Commons (Průběžná 272.09°, Sportovní 277.50°). Dvě přibližně tónované FOTO-viditelné stěny přesně mapovaných RÚIAN domů 53865991/53865992; ostatní strany a street furniture neověřeny. Unit/WebGL testy + GitHub Pages PASS. |
| **5.143** | Sportovní / Průběžná – vchody 9 bytových domů | Fyzická mezera 1,89 m v přízemním modelovém soklu namísto překrytí dveří, lepší metricky měřené vynechávání oken kolem modelových vchodů, odebrání nedoložených generických přístřešků. Přesná poloha vchodů stále není fotograficky ověřená. |
| **5.142** | Sportovní – venkovní basketbal | Na existujícím OSM hřišti `1278746587` s tagem `hoops=2` přibyly dva modelované koše. Počet/obrys z OSM, polohy stojanů a typ konstrukce pouze schématicky. Kontrola dvou modelů a žádných nových kolizí. |
| **5.141** | Sportovní – sídlištní pěší trasy | Deset malých spojovacích rohů na pěti existujících OSM chodnících. Nejsou to nové cesty ani nové přechody. Modul `scripts/osm-sportovni-estate-walk-5141.js`. |
| **5.140** | Sportovní / Průběžná | Modelové podlažní a svislé spáry devíti již existujících panelových domů podle počtů 8/9 podlaží v RÚIAN; nikoliv fotograficky ověřené fasády. |
| **5.139** | Sportovní | Modelová betonová dlažba na existující OSM pěší trase `1278749454` (~162,9 m); skutečný detail povrchu není plošně fotograficky ověřen. |
| **5.138** | Průběžná × Sportovní | 18 výplní mezer uvnitř zatáček existujících silnic; žádné nové vozovky. |
| **5.137–5.134** | Průběžná / Sportovní | Navázání existujících pěších cest, modelované opravené povrchy, přesně chráněná jednosměrka a mapová geometrie. |
| **5.136** | Ovládání | Hledání kontrolních kamer podle ulice/ID (i bez diakritiky), sbalené mobilní menu. |

Dřívější práce pokrývají nádraží, Bike Tower, centrum, střechy a fasády, garáže, Školskou, Mladou, les a další oblasti. **Neplést „v projektu existuje“ s „je věrně dokončeno“.** Historie a omezení viz `README.md`.

## Co je potřeba dál

- **Nejbližší směr:** po ověřené 5.151 pokračovat celou Sportovní a Topolovou s důrazem na doložené vstupy, střechy a návaznosti pěších tras. **ČSÚ Sportovní 587** uvádí tři podlaží *celkem* (RÚIAN 27906264), ale nedokládá počet **nadzemních** pater ani výšku členité haly; nepřenastavovat slepě celou budovu na třípatrový panelák. Negeoreferencované parkování, plotové brány a lampy nedoplňovat.
- **Chybějící georeferencovaný podklad:** projektová parkovací stání (v dokumentaci 109), lampy (22), obruby a přesná poloha nových prvků v Průběžné. Dokud není konkrétní polohopis / výkres C.3 nebo fotografická kontrola, **nevkládat odhadem**.
- **Dlouhodobý dluh:** znovu projít starší budovy a celé ulice podle `docs/building-rebuild-program.md` a `docs/reality-audit-00.md`. Fotofasády mohou být jen částečně podložené; nezaměňovat je za hotovou 360° rekonstrukci.
- **Každá další verze:** jedna smysluplná úprava → cílené unit testy → pokud se mění scéna, kontrola v mobilním WebGL → commit a stručný zápis zde. Neoznačovat test jako prošlý, pokud skutečně neběžel.

## Nový pracovní režim W1 (18. 11. 2026)

- **Jednotná pravidla:** `AGENTS.md` a `docs/DEVELOPMENT_WORKFLOW.md`. Nejde o novou verzi hry; ověřená herní verze **5.151**.
- **Převzetí práce:** načíst tento stav + poslední relevantní kousek README + jen související kód; ověřit hlavní větev GitHubu.
- **Práce jako jeden úsek:** pokračovat Sportovní/Průběžná po celých ulicích a blocích, ne jen izolovanými dekoracemi. Odhady odlišovat od skutečných fotografických důkazů.
- **Cílené unit testy:** `node scripts/dev-check.mjs sportovni` (další oblasti po `--list`); změny 3D pak ověřit samostatným mobilním WebGL testem po LOD.
- **Méně commitů:** pokud to nástroje umožňují, připravit společně kód + testy + README + tento status a odeslat v **jednom atomickém commitu**. Samostatné dokumentační commity mají minimum CI; `validate.yml` ignoruje změny pouze v Markdown souborech.
- **Další stavební krok:** pro souvislou Sportovní/Průběžnou vybrat podle OSM a veřejných zdrojů největší skutečnou vizuální odchylku (fasáda, přístup, silnice, zeleň), opravit ji a nezapomenout celý kontext ulice.

## Jak v novém chatu rychle navázat

1. Otevři **`AGENTS.md` a tento soubor jako první**. Pak se podívej na **poslední 1–3 relevantní záznamy** v horní části `README.md`. Nenačítej automaticky celý historický README ani celý `index.html`; podle úkolu si vyžádej konkrétní oblasti kódu.
2. Před úpravou ověř aktuální `main` a související moduly. Soubor může být opožděný za commity.
3. Při změně Sportovní použij příslušný modul a test, např. `node scripts/osm-sportovni-basketball-5142.test.mjs` nebo `node scripts/osm-sportovni-estate-walk-5141.test.mjs`. Další existující příklady: `scripts/osm-sportovni-ruian-panels-5140.test.mjs`, `scripts/osm-sportovni-sidewalk-5139.test.mjs`; WebGL: `scripts/osm-sportovni-estate-walk-webgl-5141.mjs`. Prohlížečové testy vyžadují prostředí podle `.github/workflows/browser-smoke.yml`.
4. Po každé významné ověřené úpravě přepiš **datum, nejnovější verzi, 3–6 posledních kroků, otevřené problémy a nejbližší akci**. Nepřidávej celý diff ani historii konverzace. Starší detaily patří do `README.md`/historie Git.
5. Když uživatel napíše **„Pokračuj“**, navazuj na nejnovější uložený stav, nejbližší konkrétní úkol a pravidla výše; nechtěj opakovat staré informace, pokud repo poskytuje odpověď.

## Technický stav a ověření

- **5.151:** foto-doložená existence zeleného oplocení a pěší uličky u antukových kurtů Milten, ale modelové přesné umístění. Mezi původním OSM kurt 612386900 (hash 3dfef3a9) a halou RÚIAN 27906272 (hash b4bc8b6d), ~31 m 3D zelené pletivo, 11 sloupků, jeden 2,10m viditelný pás mimo OSM kurt. Bez navigace/kolizí. [Kompletní CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44355256678), [mobilní WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44355256693), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44355255318).
- **5.150:** 4 skutečné tenisové polygony OSM, 7 kurtů z veřejného popisu areálu, **odhad** geometrického rozdělení 2+2+2+1; 63 modelových linek, 7 sítí a 14 sloupků bez kolizí a nových OSM ploch. [Kompletní CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44351742198), [mobilní WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44351741766), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44351740395).
- **5.149:** Topolová 647 (RÚIAN 42429056, OSM 53866045) má úředně potvrzené zděné nosné stěny, šesti podlaží, 60 bytů a výtah; zvenčí nic z toho neurčuje přesnou barvu. Neověřené panelové spáry 5.148 z renderu odstraněny, zůstal společný neutrální materiál a přízemní vstup bez překryvu. [CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44348532833), [mobilní WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44348533002), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44348529964).
- **5.148:** RÚIAN 53866045/42429056, 6 podlaží, 60 evidovaných bytů, 23 GPS vrcholů, modelové spáry a dělený sokl u dveří; starších 9 paneláků 5.140 netknuto. [Mobilní 3D PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44341187285), [menu PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44341187583), [plné CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44341504680), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44341504357).
- **5.147:** starý OSM tag `crossing=zebra` vykresluje 5 původních OSM přechodů, žádná nová trasa ani kolider. [Validace PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44338848040), [WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44338848003), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44338847451). Samostatný menu-test selhal jen na starém počtu 6 místo 7, opraveno v 5.148.
- **5.146:** fotograficky doložená existence severního chodníku Sportovní. Jeho přesné GPS nemáme, proto jen krátký ~49m grafický model podle OSM silnice, nikoliv nový oficiální pěší graf; nulové kolize, zebry či lampy. [Unit PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44329528103), [mobilní 3D LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44329528093), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44329528438).

- **5.145:** zdrojově zamčený sportovní objekt 53866046, půdorys RÚIAN zachován, modelová výška 9,6 m a jemně žebrovaný východní plášť podle fotky; bez náhodného prosklení neznámých stěn a bez nových kolizí. [Celková validace PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44325571571), [mobilní 3D test PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44325571552) i [Pages deploy PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44325570579).

- **5.144:** 2 originální foto-kamery (EXIF GPS a azimut) z Wikimedia Commons, Risajanda CC BY-SA 3.0; 2 přibližně modelově tónované pohledové fasády přesně mapovaných domů OSM **53865991/53865992**. **Unit + mobilní WebGL 6s LOD + GitHub Pages prošly.** Sedm dalších domů, stromy, ulice, parkoviště a nedoložené fasády zůstávají beze změn. Pozor: 2024 photo ≠ 2026 as-built.

- **5.143:** sokly a modelové vchody devíti původních RÚIAN domů opravené; unit validace, samostatný mobilní WebGL 6s LOD a GitHub Pages nasazení mají stav **PASS**. Širší browser smoke má vlastní běh v GitHub Actions. Neodvozovat realitu z generického 3D modelu.

- **W1 upravuje jen organizační postup, testovací runner a filtr dokumentačních commitů; žádné 3D objekty ani mapová data nemění.**
- **Změny 5.142:** nové koše jsou ve hře, úspěšně nasazené na GitHub Pages. Jednotkové testy prošly; **samostatný mobilní 3D test s 6s LOD kontrolou prošel**. Zároveň je přidán rychlý samostatný workflow `.github/workflows/sportovni-basketball-5142-webgl.yml` a testy jsou zapojené i v běžné validační a prohlížečové sadě.
