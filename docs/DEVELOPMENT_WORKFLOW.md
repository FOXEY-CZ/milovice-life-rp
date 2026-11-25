# Milovice RP — efektivní vývojový postup (W1)

**Zavedeno:** 18. 11. 2026. **Není to nová herní verze.** Cíl: udržet 3D rekonstrukci ambiciózní, přitom omezit čtení nesouvisejících dat, duplicitu kódových průchodů a zbytečné GitHub Actions.

## Nový chat a krátký příkaz „Pokračuj“

1. Nejdřív otevřít `AGENTS.md` a `DEVELOPMENT_STATUS.md`; ověřit čerstvý HEAD `main`. Status je **index**, aktuální Git je zdroj pravdy.
2. Ujasnit jeden **pracovní úsek**: např. Sportovní/Průběžná jako navazující blok domy–chodníky–vozovka–okolí. Načíst jen související OSM data, moduly, konkrétní testy a max. 1–3 poslední relevantní changelogové záznamy. Dlouhý `index.html` hledat po názvech funkcí, ne celý tisknout.
3. Zvolit **jeden měřitelný krok** s jasným dopadem ve 3D. Priorita: oprava základních chybných geometrií a návaznosti > ověřené ulice/bloky > zdrojově podložený detail > vizuální ozdoby.
4. Nechybí-li nic zásadního, uživatel nemusí upřesňovat každou budovu; při nejistotě zachovat označení „modelový odhad“ a neživit vymyšlenou geografii.

## Jednotka práce: jedna ulice / jeden blok

Projděte všechny viditelné složky dané oblasti, i když daná iterace opraví jen část:
- skutečné GPS, půdorysy a charakter objektů; výšky, římsy, střešní přesahy, sokly, vchody, okna a balkóny;
- návaznost chodníků a hran vozovky, přechody, přístupové cesty, stání a kolize;
- zeleň, lampy, značky, mobiliář, ploty, hřiště a dopravní provoz — jen s legitimními podklady;
- směrově správná kontrolní kamera, viditelnost po LOD, mobilní FPS.

Každému objektu rozlišujte **zdrojově ověřeno / odvozeno z OSM / vizuální odhad / zatím neověřeno**. Samotná fotka jedné fasády nedokládá druhou. Veřejné panoramy nescrapovat. Části bez podkladů nepovažovat za hotové.

## Kódové změny a commity

- Udělat předběžnou analýzu a navrhnout změny v souvisejících modulech **před** zapisováním do `main`.
- Je-li to možné, použít GitHub Git Trees / jeden atomický commit pro kód + testy + záznam v README + přehled stavu. Nepoužívat force-push ani přepis cizích commitů. Při změně HEAD nejdřív znovu načíst a smířit změny.
- Neprodlužovat odpověď velkými logy a surovým obsahem celého HTML. Stačí změněné soubory, CI výsledek a kontrolní URL.
- Tři široké regresní WebGL workflow (nádražní předprostor, staniční foto, blok 5.82) nově ignorují změny **pouze v Markdown dokumentaci** a pomocném runneru `scripts/dev-check.mjs`. Při změnách herního kódu, mapy či samotných workflow běží dál. GitHub Pages má vlastní build/deploy pravidla, tento filtr jeho spouštění nemění.
- Pokud automatické testy teprve dobíhají, napsat to. Případné opravy po selhání jsou samostatný **nutný** commit; zbytečný „PASS“ dokumentační commit není nutný pro samotnou funkčnost.

## Cílené testování

Připravený Node runner nevyžaduje knihovny navíc:

```bash
node scripts/dev-check.mjs --list
node scripts/dev-check.mjs sportovni
node scripts/dev-check.mjs prubezna
node scripts/dev-check.mjs budovy
node scripts/dev-check.mjs nadrazi
```

Každá sada spouští existující unit testy v příslušném okruhu. Nezastupuje všechny stovky testů ani 3D browser:
- Vizuální 3D změny: lokální server `python3 -m http.server 8080`, nainstalovaný `playwright-core`, Chromium a pro oblast Sportovní např. `node scripts/osm-sportovni-basketball-webgl-5142.mjs`.
- Regrese hran, LOD, kontakt s terénem a mobilní nabídky kontrolovat v reálném Chromium; otevření statického souboru není plnohodnotný test.
- Před finálním označením verze jako hotové ověřit příslušné GitHub Actions, včetně deploy. Dokumentační-only změny ignoruje `validate.yml`; při společném commitu s kódem se validace normálně spustí.

## Pravidla udržování `DEVELOPMENT_STATUS.md`

Krátký (ideálně do cca 10 kB) a pravdivý soubor. Obsahuje: aktuální release/HEAD, odkaz na hru a příslušnou kameru, posledních ~3–6 důležitých prací, podložené vs. modelové vlastnosti, otevřené body, prioritní úsek a přesně jeden další realistický krok. Starý detail přesuň do README; status není další nekonečný changelog.

**V současnosti:** ověřena verze hry 5.142; další stavební práce mají směřovat ke kompletnější Sportovní/Průběžné. Nové stavební změny vyžadují nové zdrojové důkazy a testy. Tento dokument nic v 3D scéně sám neupravuje.

## Co nezaručujeme

Tento postup **nezruší omezení délky chatu, přemýšlení ani chyby služby**. Při cíleném čtení a menším množství commitů by ale měl snížit práci navíc, zbytečné spouštění CI i riziko ztráty návaznosti. AGENTS.md je instrukce pro asistenty, kteří soubor skutečně načtou; není automatické napojení na jakýkoliv nově otevřený chat.

## W2 — řízení fronty CI (25. 11. 2026)

- Šest hlavních workflow (Validate, browser smoke, Italská, street-block, Station, Nádražní) běží podle filtrů cest na PR do main a při push do main. Starší běh stejného workflow na stejném ref se zruší, pokud jej nahradí novější.
- 59 historických regionálních workflow zůstává zachováno beze změny testovacích kroků. Běží ručně, při změnách konkrétních verzovaných testovacích/modulových cest na PR do main (pokud má workflow takové cesty), a v rozloženém týdenním plánu UTC. Společný index.html nebo regionální data už sama nespouští všechna historická workflow. Při změně sdílených subsystémů spusť ručně relevantní rozšířenou regresi před merge.
- Čtyři workflow aktualizace mapy/terénu a existující GitHub Pages nasazování jsou nedotčené. Ověř konkrétní Pages run pro výsledný SHA main; samotný PASS v PR neprokazuje publikaci.
- Jeden připravený atomický commit na pracovní větev, jedna PR proti aktuálnímu main; před zahájením další verze dokonči předchozí PR. Nevrstvi další verze na čekající větev. Průběžný stav testů zapisuj až společně s další skutečnou změnou, nikoli samostatným dokumentačním commitem.
- Staré testy importů nesmějí vyžadovat zastaralý cache-busting token: kontroluj modul a validní token, nikoli historické číslo verze.

## W3 — úplnost kontrol a odolnost startu

- `node scripts/validate.cjs` kontroluje také existenci statických lokálních importů všech pěti publikovaných HTML stránek včetně navazujících modulů. Neověřuje dynamicky sestavené URL ani dostupnost CDN.
- `node scripts/dev-check.mjs --all` automaticky najde všechny `*.test.mjs` i starší `*-test.mjs`; po jednotlivém selhání pokračuje a na konci vypíše neúspěšné testy. `juventa` je nová cílená sada. Úplný běh je ruční nebo jednou týdně, ne při každém push.
- Editorové náhledy nejsou podmínkou startu: odmítnutý přístup k browser localStorage vrací prázdnou lokální mapu, publikovaná architektura zůstává nezávislá. Herní verze 5.307 a uložená data se nemění.
- `index.html` přesahuje 15 tisíc řádků. Další refaktor dělat po samostatných modulech a s mobilním/desktop WebGL testem, nikoli jednorázovým přepisem. Handoff má být po dokončení rozpracovaných PR zkrácen; zachovat historii v git/README.

## W4 — paralelní browser regrese

- Browser smoke (20 skriptů) a Italská (23 skriptů WebGL + dosavadní Node kontroly) běží každý ve třech izolovaných GitHub runner skupinách. Zachovány všechny původní příkazy, trigger filtry, časové limity jednotlivých skupin i původní jméno závěrečného kontrolního jobu. `fail-fast: false` zachová diagnostiku všech skupin i při selhání jedné.
- Závěrečný job vyžaduje úspěch všech skupin. Každá má samostatný HTTP server s readiness kontrolou, cleanup a unikátní screenshot artefakt. Italská ukládá všechny vytvořené screenshoty, nejen historický výčet.
- Cílem je kratší wall-clock čekání; skutečný přínos se měří až po CI. Paralelizace může spotřebovat více runner minut nebo čekat na volnou kapacitu. Nové plošné triggery nepřidávat.

## W5 — oddělení terénního výpočtu

- `scripts/terrain-elevation.js` obsahuje čisté funkce pro hranice DEM, trojúhelníkovou interpolaci, přednost starého města a fallback okraje. `index.html` zachovává dosavadní `terrainAt` rozhraní a stav regionů; geometrie, zdrojová data, výšková pravidla, LOD a herní verze se nemění. Regrese pokrývá umělé mřížky i skutečné ČÚZK vrcholy, běží v hlavním Validate.
