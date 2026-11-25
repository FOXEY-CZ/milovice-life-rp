# 5.315 — HZS Milovice, příprava
Základ f025780a17fc6fdcf29657c889070a8310f6bf95; #109 (5.314) stále v CI. Bez změny aktivního PR.

V obou uložených regionech Mladá a Westlink je stejný areál HZS (OSM 1468803952, amenity=fire_station, nikoli building) a samostatná budova 985224523 (RÚIAN 103284605, dvě podlaží). Dvě servisní komunikace mají access=permit. Stávající civilní NPC filtr 5.240 je již správně odmítá, proto jej nepřepisujeme. Přidán nezávislý zdrojový kontrakt a regresní test přesných půdorysů a existujícího filtrování. Jde o uložený snapshot, nikoli nové ověření reálné situace. Žádné nové modely, fyzické omezení hráče ani herní mise.

Další krok: po dokončení #109 přenést přípravu na nový main, ověřit runtime a dohledat licenčně použitelné podklady fasády. Node test zatím nespuštěn. Zachovat existující veřejnou silnici a nepřidávat odhadnuté brány.
