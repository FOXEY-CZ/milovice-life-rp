# HZS 5.316 — příprava vrat
Základ main 8e8224da7096f9866002dd71d37b37c1853f8a8e, aktivní #110 (5.315) je samostatně testovaný. Tato větev je nezávislá, bez změny herního enginu.

Znovu prohlédnuty fotografie [HZS ČR, otevření 11. 2. 2020, snímek 037](https://hzscr.gov.cz/hasicien/SCRIPT/ViewImage.aspx?docname=037.jpg&physid=1090352), [DotaceEU](https://www.dotaceeu.cz/cs/evropske-fondy-v-cr/novinky/pro-hasice-a-ostatni-slozky-izs-jsme-pripravili-vi) a [Nymburský deník, 21. 1. 2021](https://nymbursky.denik.cz/zpravy_region/milovicti-hasici-vyuzivaji-jednu-z-nejmodernejsich-stanic-v-zemi-20210121.html). Viditelná jsou červená rámovaná prosklená vrata, červená spodní plocha, pás oken a kovový obklad. Počet vrat, přesné dělení všech tabulí a vazba fasády na OSM hrany nejsou potvrzeny. 

Vlastní 32×64 RGBA textura (8 KiB) vizuálně simuluje červené rámy, tmavé sklo a spodní plný panel. Rozdělení 2×4 je modelový odhad, nikoli měření. Žádný pixel fotografie nebyl kopírován. Neprůhledná textura neotvírá stavbu, nezavádí vstup ani nemění kolizi. Připraven test, Node/CI ještě neběžely. Základní výpočet ověřen v JS. Po dokončení #110 přenést změnu na main a zvolit doložené nebo jasně označené modelové průčelí před umístěním textury.

## Integrace
Fotografie z DotaceEU a Nymburského deníku ukazují nejméně tři otvory; nejde o celkový počet. Přidán pouze volitelný auditní náhled tří vrat na modelově zvolené hraně 3 (cca 14 m), jeden mesh, šest trojúhelníků. Rozměr 3,1×3,3 m je odhad. Bez průjezdu nebo nové kolize. Node a mobilní testy čekají.
