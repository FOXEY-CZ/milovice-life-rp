# Milovice RP — rychlý stav vývoje

> **Účel:** stručný průběžný přehled pro navazování ChatGPT vývoje. Historie změn je v `README.md`; zdroj pravdy je aktuální GitHub `main`, nikoliv předchozí chat.
>
> **Nově implementovaná verze: 5.147 (18. 11. 2026; CI/WebGL/Pages čekají).** Poslední kompletně potvrzená verze je **5.146**. [Úplná validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44329528103) **PASS**, [mobilní WebGL + LOD po 6,5 sekundách](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44329528093) **PASS**, [GitHub Pages deploy](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44329528438) **PASS**. [Kompletní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44325571571) **PASS**, [mobilní WebGL test včetně 6s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44325571552) **PASS**, [GitHub Pages nasazení](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44325570579) **PASS**. Předchozí 5.144 zůstává ověřená, širší průběžné browser workflow mají vlastní běhy. [Úplná validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44322902587) **PASS**, [mobilní 3D fotoaudit + LOD po 6 sekundách](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44322655691) **PASS** a [nasazení GitHub Pages](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44322902059) **PASS**. Širší, déle běžící browser smoke může mít vlastní stav.

## Projekt a odkazy

- Repozitář: https://github.com/FOXEY-CZ/milovice-life-rp
- Veřejná hra (GitHub Pages): https://foxey-cz.github.io/milovice-life-rp/
- Poslední kontrolní kamera: https://foxey-cz.github.io/milovice-life-rp/?v=514700&streetAudit=sportovni-topolova-zebra-5147 (technická OSM kamera, ne fotografie)
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
| **5.147 (čeká na CI)** | Sportovní × Topolová – mapované zebry | Opraveno ignorované OSM `crossing=zebra` pro pět skutečných přechodů Mladé, zvláště 1316882853. Všechny mapové GPS body beze změny, bílé značení jen na existující vozovce; technická kamera na východním konci přechodu. Výška/rozteče pruhů modelové. Unit/WebGL/Pages teprve ověřit. |
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

- **Nejbližší směr:** ověřit 5.147 v CI, WebGL po 6,5 s a Pages, pak řešit ověřené pěší návaznosti u Sportovní × Topolová bez vymyšleného prodloužení severního fotochodníku. 5.146 úspěšná. Pokračovat po koridoru Sportovní × Topolová a fotograficky ověřovat zakončení severního fotochodníku a případný skutečný přechod. Neprodlužovat jej přes křižovatku bez mapového či foto podkladu. Potom Pokračovat od foto-pohledu Sportovní a ověřit další základní prvky ulice vůči autorizovanému snímku: návaznost chodníků, šířky a povrch vozovky, existující sídlištní domy a přístup k hale. **Nevkládat** negeoreferencované ploty, stromy, auta ani lampy. Potom Pokračovat po celých ulicích **Průběžná / Sportovní**: porovnat 2024 veřejné foto-kamery s 3D záběry, potom bezpečně zpřesnit pouze podložené fasády, chodníky a okolí; hlídat, že 2024 fotografie nejsou důkaz současného stavu po stavebních pracích 2025. Před dalším commitem ověřit nejnovější GitHub a případné výsledky širších browser testů. Nezaměňovat funkční test za fotografické schválení vzhledu modelů. Před každým novým konkrétním zásahem ověřit skutečný stav repozitáře a odpovídající zdrojová data.
- **Chybějící georeferencovaný podklad:** projektová parkovací stání (v dokumentaci 109), lampy (22), obruby a přesná poloha nových prvků v Průběžné. Dokud není konkrétní polohopis / výkres C.3 nebo fotografická kontrola, **nevkládat odhadem**.
- **Dlouhodobý dluh:** znovu projít starší budovy a celé ulice podle `docs/building-rebuild-program.md` a `docs/reality-audit-00.md`. Fotofasády mohou být jen částečně podložené; nezaměňovat je za hotovou 360° rekonstrukci.
- **Každá další verze:** jedna smysluplná úprava → cílené unit testy → pokud se mění scéna, kontrola v mobilním WebGL → commit a stručný zápis zde. Neoznačovat test jako prošlý, pokud skutečně neběžel.

## Nový pracovní režim W1 (18. 11. 2026)

- **Jednotná pravidla:** `AGENTS.md` a `docs/DEVELOPMENT_WORKFLOW.md`. Nejde o novou verzi hry; nová herní verze **5.147** (CI čeká).
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

- **5.147:** starý OSM tag `crossing=zebra` je konečně vykreslovaný; 5 původních OSM přechodů, žádná nová trasa ani kolider; testy a deploy **čekají**.
- **5.146:** fotograficky doložená existence severního chodníku Sportovní. Jeho přesné GPS nemáme, proto jen krátký ~49m grafický model podle OSM silnice, nikoliv nový oficiální pěší graf; nulové kolize, zebry či lampy. [Unit PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44329528103), [mobilní 3D LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44329528093), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44329528438).

- **5.145:** zdrojově zamčený sportovní objekt 53866046, půdorys RÚIAN zachován, modelová výška 9,6 m a jemně žebrovaný východní plášť podle fotky; bez náhodného prosklení neznámých stěn a bez nových kolizí. [Celková validace PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44325571571), [mobilní 3D test PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44325571552) i [Pages deploy PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44325570579).

- **5.144:** 2 originální foto-kamery (EXIF GPS a azimut) z Wikimedia Commons, Risajanda CC BY-SA 3.0; 2 přibližně modelově tónované pohledové fasády přesně mapovaných domů OSM **53865991/53865992**. **Unit + mobilní WebGL 6s LOD + GitHub Pages prošly.** Sedm dalších domů, stromy, ulice, parkoviště a nedoložené fasády zůstávají beze změn. Pozor: 2024 photo ≠ 2026 as-built.

- **5.143:** sokly a modelové vchody devíti původních RÚIAN domů opravené; unit validace, samostatný mobilní WebGL 6s LOD a GitHub Pages nasazení mají stav **PASS**. Širší browser smoke má vlastní běh v GitHub Actions. Neodvozovat realitu z generického 3D modelu.

- **W1 upravuje jen organizační postup, testovací runner a filtr dokumentačních commitů; žádné 3D objekty ani mapová data nemění.**
- **Změny 5.142:** nové koše jsou ve hře, úspěšně nasazené na GitHub Pages. Jednotkové testy prošly; **samostatný mobilní 3D test s 6s LOD kontrolou prošel**. Zároveň je přidán rychlý samostatný workflow `.github/workflows/sportovni-basketball-5142-webgl.yml` a testy jsou zapojené i v běžné validační a prohlížečové sadě.
