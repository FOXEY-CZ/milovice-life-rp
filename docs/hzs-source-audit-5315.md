# 5.315 — HZS Milovice, příprava
Základ f025780a17fc6fdcf29657c889070a8310f6bf95; #109 (5.314) stále v CI. Bez změny aktivního PR.

V obou uložených regionech Mladá a Westlink je stejný areál HZS (OSM 1468803952, amenity=fire_station, nikoli building) a samostatná budova 985224523 (RÚIAN 103284605, dvě podlaží). Dvě servisní komunikace mají access=permit. Stávající civilní NPC filtr 5.240 je již správně odmítá, proto jej nepřepisujeme. Přidán nezávislý zdrojový kontrakt a regresní test přesných půdorysů a existujícího filtrování. Jde o uložený snapshot, nikoli nové ověření reálné situace. Žádné nové modely, fyzické omezení hráče ani herní mise.

Další krok: po dokončení #109 přenést přípravu na nový main, ověřit runtime a dohledat licenčně použitelné podklady fasády. Node test zatím nespuštěn. Zachovat existující veřejnou silnici a nepřidávat odhadnuté brány.

## Vizuální podklady (25. 11. 2026)
- [HZS ČR – otevření 11. 2. 2020](https://hzscr.gov.cz/hasicien/docDetail.aspx?docType=ART&docid=22205732), galerie včetně 037: dvě nadzemní podlaží, šedé vodorovné opláštění, světlé přízemí, červená prosklená vrata, věž sušení hadic a nápis 112.
- [DotaceEU, článek 4. 5. 2023](https://www.dotaceeu.cz/cs/evropske-fondy-v-cr/novinky/pro-hasice-a-ostatni-slozky-izs-jsme-pripravili-vi), fotografie průčelí: stejné charakteristické materiály a barevnost. Datum článku není nutně datum pořízení fotografie.

Připraven vlastní jednobarevný periodický RGBA materiál 1 × 64 (256 B) s modelovým stínem a světlou hranou vodorovných pásů, samostatná paleta omítky, červené a skla. Barvy, perioda a odlesky odhadnuté; žádná fotografie ani její pixely nejsou součástí repozitáře. Nejsou potvrzeny orientace průčelí, přesný počet a šířky vrat, výška a půdorys věže. Materiál zatím není použit na herní budově. Node test připraven, neběžel. Další krok: registrovat průčelí k půdorysu, následně zapojit model v samostatné změně.

## Integrace 5.315
Původní výška, základ a kolize jsou ponechány. Jediný náhradní mesh s vlastní 1×128 RGBA texturou (512 B), dolní polovina světlá omítka, horní kovové pásy, rozdělení po celém obvodu je odhad. Generické doplňky se na tomto modelu nepoužijí. Schválené karty mají přednost. Dva Node testy a rozšíření existující mobilní WebGL regrese, výsledky čekají. Žádná nová věž nebo vrata. Původní fotografie nebyly v tomto kroku znovu otevřeny.
