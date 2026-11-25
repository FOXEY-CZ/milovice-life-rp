# 5.318 — orientační body v herní mapě (příprava)

Základ main 28cd8ffca6ca601b047f726cd33742e2a0c2e4f7; aktivní #112 (5.317) stále v CI. Příprava nezasahuje do herního enginu.

Dosavadní Leaflet mapa má sedm statických bodů v centru. Připravena další sedmička z existujícího snapshotu Mladá: HZS, Juventa, poliklinika, MŠ Sluníčko, Tesco, Penny, Billa. Souřadnice jsou plošné centroidy původních obrysů, případně vnitřní bod nejblíže centroidu z pravidelné mřížky; všechny byly při přípravě ověřeny uvnitř polygonu. ID a hash obrysů pro regresi. Nejde o GPS vchod, trasovací cíl nebo tvrzení o aktuální provozní době. 

Test připraven; Node/CI ještě neběžely. Další krok: po #112 napojit na existující addRealMapLandmarks a testovat zobrazení skutečných Leaflet bodů, bez změn 3D mapy, NPC, kolizí nebo dalších externích síťových požadavků.

## Integrace
Připojeno do existující Leaflet mapy, zachováno sedm původních bodů. Nové kategorie mají odlišnou barvu. Ochrana proti souběžné inicializaci a kontrola opětovného otevření. Rozšířen existující browser smoke o počty skutečně připojených vrstev a kontrolu duplicit. Žádné změny 3D mapy, nové síťové požadavky nebo trasování. CI čeká.
