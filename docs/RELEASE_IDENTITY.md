# Příprava na vydání — CROSSVEX (pracovní značka)

Rozhodnutí uživatele 25. 11. 2026: fiktivní město, ulice, čtvrti, podniky a instituce; dále modelovat podle reálné předlohy. Zachovat zdrojové OSM/RÚIAN ID, GPS, data a interní vývojové kontroly. Veřejná identita nesmí tvrdit, že jde o skutečné město nebo oficiální produkt místních organizací. Přejmenování samo nezaručuje neidentifikovatelnost ani právní bezrizikovost.

## 5.335
- Slovník 62 zdrojových názvů ulic z 6 snapshotů, 14 herních orientačních bodů, 6 oblastí. Výchozí HUD, titul stránky, GPS cíle, minimapa, výběr oblastí, názvy autobusových kontrolních bodů a pěší zakázky používají nové názvy. Původní zdrojové soubory beze změny. Pracovní názvy nebyly právně prověřeny jako ochranné známky.
- V 5.335 skutečné OSM rastrové dlaždice ještě odhalovaly reálné popisky; náhrada je kandidát 5.336 níže. Neoznačovat build za anonymizovaný.
- Další překážky: reálné nápisy na 3D fasádách, zastávky, mise, dopravní/železniční operátoři, adresy a čísla domů, technické obrazovky, externí odkazy, veřejná URL a historický repozitář. Oddělit vývojovou a hráčskou distribuci; zdrojová geometrie, přesné GPS a licenční data mohou stále odhalovat předlohu. ODbL povinnosti k odvozené databázi neobcházet.
- Před vydáním: kontrola značek a práv, licencí dat, textur, fotografií, 3D modelů, zvuku a fontů; audit skutečných osob, log a názvů; test distribučního balíčku a viditelného UI. Citace OSM a ČÚZK zachovat. OSMF: https://osmfoundation.org/wiki/Attribution_Guidelines

## Pořadí
1. Fiktivní slovník a hlavní UI (5.335).
2. Vlastní herní mapa, bez skutečných popisků; stejná geometrie a GPS navigace.
3. Fiktivní nápisy, adresy, instituce, interiéry, zastávky a mise.
4. Oddělený release build, odstranění vývojových nástrojů z veřejného UI, kontrola licencí a názvu. Původní URL dočasně zachovat, neměnit repo bez plánované migrace.

## Upřesnění názvu
Uživatel preferuje anglický název. Pracovní značka CROSSVEX, město Ironfield; obchody BrayMart, ValueNest, Vendoa. České prostředí a texty zatím zůstávají. Základní veřejné hledání názvu neukázalo shodu; nejde o rešerši ochranných známek ani právní schválení.

## Zvolená pracovní značka
Uživatel vybral CROSSVEX; Ironfield zůstává názvem fiktivního města, nikoli hry. Slogan návrh: Beyond the rules. Základní webové hledání nenašlo stejnojmennou videohru, ale našlo použití jako hráčské přezdívky. Před vydáním prověřit ochranné známky v relevantních jurisdikcích. Repozitář a URL zatím zůstávají stejné kvůli kompatibilitě.

## Potvrzený název města
Uživatel zvolil Ironfield jako fiktivní město ve hře CROSSVEX. Změněny hráčské popisky mapy, minimapy, cíle GPS a související ulice. Existující fiktivní obchodní názvy a český jazyk zachovány. Právní dostupnost názvu před vydáním ještě prověřit.

## 5.336 – vlastní mapa
Leaflet vykresluje lokální geometrii šesti snapshotů přes Canvas, pouze fiktivní popisky při zoomu 17–19. Odstraněn odkaz na technický průzkum z patičky mapy, OSM/ČÚZK atribuce zachována. Stávající GPS, cíle a vlastní waypointy bez změny výpočtu. Zdrojové JSON, GPS a Leaflet CDN zůstávají; nejde o offline či anonymní distribuci. Plochy s nedoloženým uzavřením se nekreslí, včetně některých vodních ploch; mapa zatím nereprezentuje každý objekt 3D scény. Browser a CI čekají.

## 5.337
První napojení fiktivních nápisů na 3D textury. Zbývají specializované nápisy, barevné identity, zastávky a Credits & Licenses. CI čeká.

## Jazyk světa — rozhodnutí uživatele
Všechny hráčské názvy ulic, oblastí, institucí, podniků a fyzické nápisy mají být anglické, nikoli české. České ovládání a interní zdrojové klíče zatím zachovat. Audit dalších textur a zastávek pokračuje.

## 5.338 — vizuální identita obchodů
Vlastní palety BrayMart, ValueNest a Vendoa napojeny na nápisy a vybrané fasádní prvky. Ostatní specializované textury ještě vyžadují audit. CI čeká.

## 5.339 — CrossTransit
Uživatel schválil regionální značku CrossTransit (CT), nezávislou na Ironfieldu. Nové barvy a cílové displeje autobusů a vlaků, anglické fallback zastávky a PHARMACY. Zdrojové údaje a geometrie beze změny. CI čeká.

## 5.340 — jízdenkové automaty
Anglická hlavička CrossTransit Tickets na obou automatech; původní barevné rozlišení skříní a geometrie zachovány. Zdrojové fotografie a interní důkazy beze změny. CI čeká.

## 5.341 — Fire Station
IRONFIELD FIRE STATION v model-only náhledu; číslo 112 a původní zdrojový nápis zachovány jako důkaz. Neověřené rozměry a umístění nejsou aktivovány v běžné hře. CI čeká.

## 5.342 — Credits & Licenses
Samostatná hráčská stránka, odkazy z HUD a mapy, původní atribuce zachována. Licence podle evidence projektu; před distribucí ověřit úplný soupis aktiv, licenční texty a podmínky odvozených databází. CI čeká.

## 5.343 — Developer Mode
Výchozí hráčské UI oddělené od technických ovladačů. Opt-in `?dev=1`, původní auditní odkazy zachovány. Nejde o autentizaci ani anonymizaci: zdrojové soubory, GPS a auditní kód jsou nadále veřejné. CI čeká.


## 5.344 — hráčské popisky a rozsah zbývajícího auditu
- Načítání, uvítání, obnovení mapy, prvotní Old Town a běžné chybové zprávy používají herní identitu. Surové mapové výjimky jen v developer režimu. Mobilní test rozšířen o oblasti a cíle; čeká na CI.
- Kontrola zdroje: index.html používá STATIC_SIGN_TEXT pro nádraží, hotel, cyklověž, školu a fallback nápisy; dynamické obchody procházejí businessSignText. world-models.js používá destinationLabel; station-ticket-machines.js CrossTransit Tickets. HZS náhled rozlišuje sourceFacadeText a facadeText. Nejde o vizuální ověření všech fasád, textur ani vložených GLB.
- Odstraněno nepodložené tvrzení o ověřeném CC0 modelu z menu. Deklarované licence a atribuce v Credits & Licenses zůstávají; nezávislé ověření konkrétních souborů je otevřené.
- Preview distribuce na 5.342 a 5.343 PASS; síťový záznam 5.343 je v artefaktu běhu 45739409272, jeho obsah ještě nebyl vyhodnocen. Dev režim není zabezpečení. Před finálním vydáním ověřit skutečné nápisy v GLB a jejich texturách, adresní štítky a zdrojové názvy ve veřejném balíčku.

## 5.345 — player vehicle labels
Hráčské stavové zprávy detailních vozidel používají neutrální anglické kategorie přes fictional-identity.js. Zdrojové registry a licence beze změny; unit, browser historie HUD a GLB evidence PASS, #156 8/8 sloučen.

## 5.346 — pedestrian delivery label
Hlášení zahájení zakázky přes streetDisplayName používá Silver Avenue. Přípravný regionální browser 45847448228 3/3 PASS, zrušení bez výplaty. Kandidát CI čeká; geometrie, zdrojová ID a odměna zachovány.
