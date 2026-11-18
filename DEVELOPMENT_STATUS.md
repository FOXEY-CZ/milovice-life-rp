# Milovice RP — rychlý stav vývoje

> **Účel:** stručný, průběžně aktualizovaný startovní bod pro nové ChatGPT konverzace. **Nejde o úplnou historii.** Detailní changelog je na začátku `README.md`. Udržuj tento soubor krátký: aktuální stav, otevřené úkoly, ověřené zdroje a další krok.
>
> **Poslední ověřený stav z repozitáře:** 18. 11. 2026; hra **5.141** na větvi `main`. Tento dokument byl vytvořen podle již uložených souborů, nikoliv podle nového spuštění hry nebo testů.

## Projekt a odkazy

- Repozitář: https://github.com/FOXEY-CZ/milovice-life-rp
- Veřejná hra (GitHub Pages): https://foxey-cz.github.io/milovice-life-rp/
- Poslední kontrolní kamera: https://foxey-cz.github.io/milovice-life-rp/?v=514100&streetAudit=sportovni-estate-joins-5141
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
| **5.141** | Sportovní – sídlištní pěší trasy | Deset malých spojovacích rohů na pěti existujících OSM chodnících. Nejsou to nové cesty ani nové přechody. Modul `scripts/osm-sportovni-estate-walk-5141.js`. |
| **5.140** | Sportovní / Průběžná | Modelové podlažní a svislé spáry devíti již existujících panelových domů podle počtů 8/9 podlaží v RÚIAN; nikoliv fotograficky ověřené fasády. |
| **5.139** | Sportovní | Modelová betonová dlažba na existující OSM pěší trase `1278749454` (~162,9 m); skutečný detail povrchu není plošně fotograficky ověřen. |
| **5.138** | Průběžná × Sportovní | 18 výplní mezer uvnitř zatáček existujících silnic; žádné nové vozovky. |
| **5.137–5.134** | Průběžná / Sportovní | Navázání existujících pěších cest, modelované opravené povrchy, přesně chráněná jednosměrka a mapová geometrie. |
| **5.136** | Ovládání | Hledání kontrolních kamer podle ulice/ID (i bez diakritiky), sbalené mobilní menu. |

Dřívější práce pokrývají nádraží, Bike Tower, centrum, střechy a fasády, garáže, Školskou, Mladou, les a další oblasti. **Neplést „v projektu existuje“ s „je věrně dokončeno“.** Historie a omezení viz `README.md`.

## Co je potřeba dál

- **Nejbližší směr:** pokračovat systematicky od aktuální oblasti **Sportovní / Průběžná**, kontrolovat celou ulici a návaznost budov, pěších tras, vozovek a okolí. Před každým novým konkrétním zásahem ověřit skutečný stav repozitáře a odpovídající zdrojová data.
- **Chybějící georeferencovaný podklad:** projektová parkovací stání (v dokumentaci 109), lampy (22), obruby a přesná poloha nových prvků v Průběžné. Dokud není konkrétní polohopis / výkres C.3 nebo fotografická kontrola, **nevkládat odhadem**.
- **Dlouhodobý dluh:** znovu projít starší budovy a celé ulice podle `docs/building-rebuild-program.md` a `docs/reality-audit-00.md`. Fotofasády mohou být jen částečně podložené; nezaměňovat je za hotovou 360° rekonstrukci.
- **Každá další verze:** jedna smysluplná úprava → cílené unit testy → pokud se mění scéna, kontrola v mobilním WebGL → commit a stručný zápis zde. Neoznačovat test jako prošlý, pokud skutečně neběžel.

## Jak v novém chatu rychle navázat

1. Otevři **tento soubor jako první**. Pak se podívej na **poslední 1–3 relevantní záznamy** v horní části `README.md`. Nenačítej automaticky celý historický README ani celý `index.html`; podle úkolu si vyžádej konkrétní oblasti kódu.
2. Před úpravou ověř aktuální `main` a související moduly. Soubor může být opožděný za commity.
3. Při změně Sportovní použij příslušný modul a test, např. `node scripts/osm-sportovni-estate-walk-5141.test.mjs`. Další existující příklady: `scripts/osm-sportovni-ruian-panels-5140.test.mjs`, `scripts/osm-sportovni-sidewalk-5139.test.mjs`; WebGL: `scripts/osm-sportovni-estate-walk-webgl-5141.mjs`. Prohlížečové testy vyžadují prostředí podle `.github/workflows/browser-smoke.yml`.
4. Po každé významné ověřené úpravě přepiš **datum, nejnovější verzi, 3–6 posledních kroků, otevřené problémy a nejbližší akci**. Nepřidávej celý diff ani historii konverzace. Starší detaily patří do `README.md`/historie Git.
5. Když uživatel napíše **„Pokračuj“**, navazuj na nejnovější uložený stav, nejbližší konkrétní úkol a pravidla výše; nechtěj opakovat staré informace, pokud repo poskytuje odpověď.

## Stav této změny

- Založení `DEVELOPMENT_STATUS.md` je **pouze dokumentační změna**, ne nová verze hry.
- Žádné herní skripty ani mapová data se tím nemění.
- **Nebyly spuštěny** herní ani WebGL testy; pro vytvoření tohoto přehledu nejsou potřeba.
