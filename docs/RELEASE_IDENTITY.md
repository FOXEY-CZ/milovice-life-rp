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
