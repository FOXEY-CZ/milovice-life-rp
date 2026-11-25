# Juventa 5.312 — předběžný DEM audit (25. 11. 2026)

Nezávislá příprava na main 2542246fae993b98307d5157fd848bccdda1e375, zatímco #106 (5.311) běží na 9779f73ec622e7f94b097166c1294940f0c0f921. Žádné změny aktivního PR, geometrie nebo nasazení.

## Měřený modelový problém
Z uloženého ČÚZK DMR 4G (regionální přepočet na 20 m) a originálního polygonu OSM 53865836 (73 uzlů, hash be655146) byl reprodukován současný algoritmus základů: vzorkování obvodu po nejvýše 3 m, maximum +0,10 m. Výsledky samostatného výpočtu na uložených datech:

| Grid | Minimum obvodu | Maximum obvodu | Modelový základ | Kandidátní uzly 47–51 |
|---|---:|---:|---:|---:|
| Mladá | 214,168 | 221,917 | 222,017 | 216,880–217,390 |
| Westlink | 214,126 | 221,894 | 221,994 | 216,831–217,327 |

292 obvodových vzorků v každé mřížce. Převýšení celé budovy cca 7,75 m; modelový základ je cca 4,6–5,2 m nad kandidátní fasádou. Mladá a Westlink mají odlišné interpolace (max. rozdíl na uzlech 47–51 cca 0,167 m). Staroměstská mřížka žádný vzorek nepokrývá. Aktuální terrainAt používá první načtenou pokrývající regionální mřížku, proto nelze tvrdit jediné runtime číslo bez kontroly pořadí načtení. Modelové nadmořské výšky nejsou geodetické zaměření.

## Další krok
Přenést tento modul a test na výsledný main po #106, připojit diagnostiku k reálnému základu školy a ověřit mobilní WebGL. Následně navrhnout lokální výškové rozdělení komplexu, až bude doloženo rozhraní objektů a společné datum stavebního řezu. Neodečítat automaticky 0,94 m schodiště z DEM ani neměnit globální algoritmus základů. Identita kandidátního výstupku a výškový datum výkresu zůstávají neověřené.
