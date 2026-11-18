# Milovice RP — rychlý stav vývoje

> **Účel:** stručný, průběžně aktualizovaný startovní bod pro nové ChatGPT konverzace. **Nejde o úplnou historii.** Detailní changelog je na začátku `README.md`. Udržuj tento soubor krátký: aktuální stav, otevřené úkoly, ověřené zdroje a další krok.
>
> **Poslední ověřená verze:** 18. 11. 2026; hra **5.143**. **Nová 5.144** byla zapsána do hry a čeká na výsledky CI a mobilního WebGL. Předchozí na větvi `main`. [Kompletní unit validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44320269490), [cílený mobilní WebGL test po 6 s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44320269592) a [nasazení na GitHub Pages](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44320268582) **prošly**. Předchozí testy 5.142 prošly v [GitHub Actions Validate](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44316888551), a **samostatný mobilní WebGL test prošel** v [Sportovní 5.142](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44317164137), včetně viditelnosti obou košů po šesti sekundách a zachování předchozích prvků. Oprava 5.143 navíc prokázala otevřené sokly, zachování devíti domů, deseti rohů pěších cest a dvou košů v mobilním WebGL po LOD.

## Projekt a odkazy

- Repozitář: https://github.com/FOXEY-CZ/milovice-life-rp
- Veřejná hra (GitHub Pages): https://foxey-cz.github.io/milovice-life-rp/
- Poslední kontrolní kamera: https://foxey-cz.github.io/milovice-life-rp/?v=514400&streetAudit=prubezna-public-photo-5144 (Wikimedia fotografie 2024 s EXIF)
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
| **5.144** | Průběžná / Sportovní – fotoaudit 2024 | Dvě kamery přímo z GPS/EXIF fotografie Wikimedia Commons (Průběžná 272.09°, Sportovní 277.50°). Dvě přibližně tónované FOTO-viditelné stěny přesně mapovaných RÚIAN domů 53865991/53865992; ostatní strany a street furniture neověřeny. Unit/WebGL testy zatím čekají. |
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

- **Nejbližší směr:** nejprve prověřit 5.144 unit, mobilní WebGL, deploy a vzhled obou foto-přibližovaných fasád (při selhání opravit). Potom Pokračovat systematicky ve **Sportovní / Průběžná**, ale před přidáním dalších modelových ozdob hledat veřejné fotografické důkazy a prioritně řešit celkovou věrnost fasád, vstupů, cest a okolí; zkontrolovat i širší browser smoke, pokud po posledním commitu ještě není dokončen. Nezaměňovat funkční test za fotografické schválení vzhledu modelů. Před každým novým konkrétním zásahem ověřit skutečný stav repozitáře a odpovídající zdrojová data.
- **Chybějící georeferencovaný podklad:** projektová parkovací stání (v dokumentaci 109), lampy (22), obruby a přesná poloha nových prvků v Průběžné. Dokud není konkrétní polohopis / výkres C.3 nebo fotografická kontrola, **nevkládat odhadem**.
- **Dlouhodobý dluh:** znovu projít starší budovy a celé ulice podle `docs/building-rebuild-program.md` a `docs/reality-audit-00.md`. Fotofasády mohou být jen částečně podložené; nezaměňovat je za hotovou 360° rekonstrukci.
- **Každá další verze:** jedna smysluplná úprava → cílené unit testy → pokud se mění scéna, kontrola v mobilním WebGL → commit a stručný zápis zde. Neoznačovat test jako prošlý, pokud skutečně neběžel.

## Nový pracovní režim W1 (18. 11. 2026)

- **Jednotná pravidla:** `AGENTS.md` a `docs/DEVELOPMENT_WORKFLOW.md`. Nejde o novou verzi hry; nová herní verze **5.144**.
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

- **5.144:** veřejné snímky z Wikimedia Commons (Risajanda, CC BY-SA 3.0) mají foto GPS a směr z EXIF. Do hry přidané 2 foto-kamery a modelované omítkové odstíny na 2 ulice-viditelných fasádách. Přesné detaily snímků nebyly kopírovány; testy CI vyhodnotit z GitHub Actions po commitu.

- **5.143:** sokly a modelové vchody devíti původních RÚIAN domů opravené; unit validace, samostatný mobilní WebGL 6s LOD a GitHub Pages nasazení mají stav **PASS**. Širší browser smoke má vlastní běh v GitHub Actions. Neodvozovat realitu z generického 3D modelu.

- **W1 upravuje jen organizační postup, testovací runner a filtr dokumentačních commitů; žádné 3D objekty ani mapová data nemění.**
- **Změny 5.142:** nové koše jsou ve hře, úspěšně nasazené na GitHub Pages. Jednotkové testy prošly; **samostatný mobilní 3D test s 6s LOD kontrolou prošel**. Zároveň je přidán rychlý samostatný workflow `.github/workflows/sportovni-basketball-5142-webgl.yml` a testy jsou zapojené i v běžné validační a prohlížečové sadě.
