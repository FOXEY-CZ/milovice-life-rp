# Příprava na vydání — Brayleston: City Life (pracovní značka)

Rozhodnutí uživatele 25. 11. 2026: fiktivní město, ulice, čtvrti, podniky a instituce; dále modelovat podle reálné předlohy. Zachovat zdrojové OSM/RÚIAN ID, GPS, data a interní vývojové kontroly. Veřejná identita nesmí tvrdit, že jde o skutečné město nebo oficiální produkt místních organizací. Přejmenování samo nezaručuje neidentifikovatelnost ani právní bezrizikovost.

## 5.335
- Slovník 62 zdrojových názvů ulic z 6 snapshotů, 14 herních orientačních bodů, 6 oblastí. Výchozí HUD, titul stránky, GPS cíle, minimapa, výběr oblastí, názvy autobusových kontrolních bodů a pěší zakázky používají nové názvy. Původní zdrojové soubory beze změny. Pracovní názvy nebyly právně prověřeny jako ochranné známky.
- Zásadní otevřená překážka vydání: současný Leaflet načítá skutečné OSM rastrové dlaždice a jejich reálné popisky. Nahradit vlastní vektorovou herní mapou bez skutečných názvů a zachovat atribuci. Neoznačovat současný build za anonymizovaný.
- Další překážky: reálné nápisy na 3D fasádách, zastávky, mise, dopravní/železniční operátoři, adresy a čísla domů, technické obrazovky, externí odkazy, veřejná URL a historický repozitář. Oddělit vývojovou a hráčskou distribuci; zdrojová geometrie, přesné GPS a licenční data mohou stále odhalovat předlohu. ODbL povinnosti k odvozené databázi neobcházet.
- Před vydáním: kontrola značek a práv, licencí dat, textur, fotografií, 3D modelů, zvuku a fontů; audit skutečných osob, log a názvů; test distribučního balíčku a viditelného UI. Citace OSM a ČÚZK zachovat. OSMF: https://osmfoundation.org/wiki/Attribution_Guidelines

## Pořadí
1. Fiktivní slovník a hlavní UI (5.335).
2. Vlastní herní mapa, bez skutečných popisků; stejná geometrie a GPS navigace.
3. Fiktivní nápisy, adresy, instituce, interiéry, zastávky a mise.
4. Oddělený release build, odstranění vývojových nástrojů z veřejného UI, kontrola licencí a názvu. Původní URL dočasně zachovat, neměnit repo bez plánované migrace.

## Upřesnění názvu
Uživatel preferuje anglický název. Pracovní značka Brayleston: City Life, město Brayleston; obchody BrayMart, ValueNest, Vendoa. České prostředí a texty zatím zůstávají. Základní veřejné hledání názvu neukázalo shodu; nejde o rešerši ochranných známek ani právní schválení.
