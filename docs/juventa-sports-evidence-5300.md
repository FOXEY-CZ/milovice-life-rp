# Milovice RP – podklady pro sportovní areál Juventa

### Zdrojový audit areálu ZŠ Juventa

- [ZŠ Juventa – historie školy](https://www.zsjuventa.cz/skola/historie-nasi-skoly) potvrzuje moderní venkovní sportoviště u Komenského 578.
- [Stadión ZŠ Juventa, Milovice 03.jpg](https://commons.wikimedia.org/wiki/File:Stadi%C3%B3n_Z%C5%A0_Juventa,_Milovice_03.jpg) – Doronenko, CC BY-SA 4.0, 20. 8. 2025, poloha fotoaparátu 50.225972, 14.866674. Jde o referenční polohu fotoaparátu, nikoli zaměřenou polohu jednotlivého sportovního vybavení. V okruhu 170 m je v uloženém OSM regionu mlada šest sportovních polygonů 1472393194, 1472419115–1472419118 a 1472419120; vzdálenost sama nepotvrzuje příslušnost každého polygonu k areálu.
- [STRABAG – Rekonstrukce a dostavba ZŠ Milovice, IV. etapa](https://www.strabag.cz/databases/internet/_public/content30.nsf/web30?Openagent=&id=9D096EE353B39474C12585A000454A20) – fotografie dokončeného areálu ukazuje červenou dráhu, zelenou herní plochu, ochranné sítě a osvětlení. Rozměry, současný stav, konkrétní souřadnice a vzhled vrhačského sektoru či doskočiště tím zatím nejsou potvrzené.

Další krok: porovnat dostupné fotografie s přesnými OSM geometriemi, případně doplnit zdrojově doložené části dráhy a vybavení. Fotografie nepřebírat do herních assetů bez ověření licence. Žádná nová geometrie tímto auditem nevzniká.


## 5.301 – doložený umělý povrch

Rada města 14/2025, str. 21, UR-226-14/25 ([PDF](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=17955&id_org=9519)) dokládá fotbalové hřiště s umělým povrchem při ZŠ Juventa; [městský katalog](https://hriste.mesto-milovice.cz/hriste-u-zs-juventa) lokalizuje areál a [Sportengo](https://sportengo.cz/sportoviste/sportovni-areal-u-zs-juventa) uvádí umělý trávník. Jediný přilehlý OSM polygon s `sport=soccer` 1472419116 má 6 bodů a identickou geometrii v Mladé/Westlinku, hash e5044ba5. Přiřazení polygonu ke skutečnému povrchu je podložená inference, nikoli zaměření. Reuse existujícího pitchTurf místo obecného pitch; odstín modelový, žádné nové materiály, objekty, GPS, značení nebo kolize. Explicitní OSM surface v budoucnu má přednost. CI/WebGL/Pages čekají.

### Kontrolní kamera

Kontrolní pohled `?streetAudit=pitch-juventa-5301` používá skutečný OSM polygon a stávající plánovač sportovní kamery. Městský katalog uvádí GPS 50°13′33.4″N 14°52′01.7″E jako polohu areálu, nikoli snímku; výsledné oko i cíl kamery jsou uvnitř polygonu. Sportengo potvrzuje běžecký ovál s umělým povrchem kolem hřiště, ale v dodaných OSM datech není jeho zaměřený obrys. Proto se ovál, lajny dráhy ani vybavení zatím nepřidávají. Matematický plán kamery ověřen na uloženém polygonu; skutečný WebGL pohled čeká na CI.
