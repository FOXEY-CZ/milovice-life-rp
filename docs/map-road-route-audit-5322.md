# 5.322 — GPS audit skutečných silničních úseků
Příprava z main 1034f8631724655fed8f8c6a554046d054173e9b během CI #116. Bez zásahu do aktivního kandidáta 5.321.
První potvrzený výsledek z Chromium běhu 45649355723, job 139329267923, log PASS 5.321: ready 2165.992425008848 m ze spawnovaného auta k HZS. Tento log zatím neověřil všechny jednotlivé úseky.
Nový čistý audit kontroluje každou část výsledné trasy proti skutečným segmentům veřejného dopravního grafu: OSM ID, ležení na úseku, jednosměrnost, souvislost s existujícím kvantováním uzlů a součet délek. Neověřuje zákazy odbočení nebo skutečný vchod. Test zahrnuje neexistující/zakázaný úsek, obrácenou jednosměrku, odchylku z komunikace a přerušenou trasu.
Node a integrace do prohlížeče zatím čekají. Po #116 použít audit v browser testu a zpřísnit regresi HZS na požadavek status ready s kladnou délkou.
Pages 5.320 run 45649026689 selhal na HTTP 500 při vytváření deploymentu; opakování failed jobs i jednotlivého deploy jobu vracelo interní chybu konektoru. Neslučovat #116, dokud nebude potvrzeno Pages a CI.
