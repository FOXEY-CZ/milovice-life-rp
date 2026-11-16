# Další uliční blok: 5. května × Mírová × Školská

**Milovice RP, 16. 11. 2026.** Účel: návazný, evidence-first průchod *celým blokem*, nikoli náhodné zdobení jednotlivé budovy. Přednádražní parkoviště 5.81.27 prošlo uživatelským vizuálním přezkumem technických nedostatků; fotogrammetrická přesnost okolí stále nebyla potvrzena.

## Veřejné fotografické reference

1. **5. května – pohled 26. 7. 2014**, Tiia Monto, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Milovice_-_5._kv%C4%9Btna.jpg), CC BY-SA 4.0, kamera **50.227797, 14.884813**. Na fotografii jsou viditelné souvislá asfaltová vozovka, sousedící domy v teplých odstínech se šikmými červenými střechami, úzký chodník, místní zeleň/živé ploty, sloup s vedením a směrové tabule. Přítomné auto je pouze stav z roku 2014, nikoli podklad trvalého umístění. Konkrétní domovní čísla, 2026 barvy a přesné pozice stromů či značek tímto jediným směrem **nejsou ověřeny**.
2. **Mírová – pohled 30. 5. 2024**, ŠJů, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_(01).jpg), CC BY 4.0, kamera **50.2286667, 14.8847222**, heading 30°. Je to veřejně datovaná fotografie ulice, nikoli důkaz fasády konkrétního domu na druhé straně křižovatky.
3. **Fotograficky přiřazené budovy**: Školská 220/1, OSM `118487980`; Mírová 134/11, OSM `202367194`; Mírová 243/36, OSM `202367254`. Jejich přímé zdroje a nejistoty jsou evidované v `scripts/street-photo-evidence.js` a `docs/street-pass-01.md`. Starší dílčí stavby nepovažovat za 360° schválené.

## Pořadí revize

- **A. Fotomapa bloku:** rozepsat jednotlivé OSM úseky silnic, pěších tras a domovních půdorysů; u každého zaznamenat zdroj, datum, kameru a viditelnou stranu. OSM reference je podklad topologie, ne potvrzení fyzického detailu.
- **B. Souvislá ulice:** ověřit oba okraje vozovky, chodníky včetně vjezdů, stromy/zeleň, ploty, značení, lampy a jejich skutečnou existenci po směru ulice. Nepřenášet objekty ze záběru z roku 2014 bez dalšího ověření.
- **C. Dům po domu:** střecha (silhouette a viditelnost), fasáda, otvory a vstupy, a hlavně napojení k chodníku a terénu. Neznámé strany zůstanou provisional. Už dříve fotodoložené tři OSM domy využít jako referenční body.
- **D. Zpětný obrazový test:** porovnat herní ulici z 2–3 potvrzených kamer s autorizovanými fotografiemi, včetně pohledu 360° tam, kde existuje; kontrola kolizí, LOD a telefonních FPS. Automatické testy nepotvrzují vizuální 1:1 shodu.

## Stav

**Založený rozsah, nikoli nový 3D release.** Bez dostatečně přesné fotografické opory se nevytvářejí nové geometrie, umělé přechody, obrubníky, světla ani výsadba. Další implementace může začít jen u prvků s doložitelnou identitou a přiměřeně určenou polohou. U všech nedoložených atributů označit `estimated`/ `needs-source`.


## Milovice RP 5.82.0 — foto-podložená revize 5. května

**Datum 16. 11. 2026.** První ověřená implementace nové etapy zasahuje `scripts/street-environment-reality.js`, kamery v `index.html`, katalog zdrojů i mobilní WebGL testy.

Ve starší fotoulici bylo podle JEDINÉHO historického snímku vymyšleno druhé opakování stromu, druhý stožár elektrického vedení ve vzdálenosti 63 m, neověřené dlouhé kabely, rozměrný opakující se plot/živý plot a 23 květin roztroušených podél celé ulice. Upravený renderer používá **jeden** historicky doložený stříhaný strom, **jeden** dřevěný sloup s příčkou, krátký zelený pás a malý květinový trs; existující tři směrovky i zídka s vraty zůstaly. Každý zemní půdorys nadále individuálně kontroluje kolize s OSM silnicemi a pěšími trasami. Nedělat z fotografie roku 2014 důkaz současného roku ani přesně známých kotev budov.

Diagnostika po opravě odhalila i původní systémovou chybu: **celá ulice měla sceneCount=0**, protože stará funkce vyžadovala minimální odstup od vozovky přes celé 63metrové okolí, a jediná příliš blízká mapa jiné cesty zrušila *všechny* objekty. Ve verzi 5.82 se příslušný OSM úsek `219273174` nyní při načtení kontroluje zvlášť pro každý objekt, výběr orientační strany používá kladný počet bezpečných kotvicích bodů. Reálný browser/WebGL test potvrdil `sceneCount=1`, GPS fotoaparátu od skutečné osy komunikace **0,245 m** (jde o fotografův bod u vozovky, nikoli lokalizaci stromu), minimální OSM odstup použitého orientačního bodu 2,65 m. V testech je pouze jedna foto-scéna bez dalších cest a bez nových zaručených geodetických výšek.

**Dvě nová testovací URL:** `?v=58200&streetAudit=5kv` je technická OSM kamera nad GPS 2014 fotografie — zdroj neobsahuje změřený heading a proto nejde o fotografický záběr 1:1. `?v=58200&streetAudit=mirova` používá GPS a 30° heading z fotografie ŠJů z 2024. Oba režimy jsou jen změna kamery, nikoli přesun světa či živých vozidel. Pro mobilní kontrolu mají rozbalovací panel s původním zdrojem a popisem nejistot. Skutečný Chromium+SwiftShader WebGL test vykreslil oba režimy a ověřil, že nejsou chyby JavaScriptu, že nepřibyla smyšlená uliční infrastruktura a že běží foto-scéna s OSM koridorem.

**Zbývá k fotodoložení:** druhá strana 5. května, odpovídající půdorys domu se směrovkami a branou, skutečné polohy hydrantů/sloupů/parkovacích míst a současná podoba z roku 2026. Žádné doplňování „protože tam asi něco je“. Dalším krokem bude fyzické porovnání herních screenshotů s autorizovanými fotografiemi z více stran a pak teprve celý přilehlý blok. 

## 5.82.1 — srovnání s uživatelským satelitem z 4. června 2023

Uživatel dodal čtyři srovnávací snímky: 3D nadhled 5. května, satelit z **4. 6. 2023**, 3D průhled po ulici a Mapy.com Panorama z **17. 5. 2022**. Satelit zobrazuje úsek 5. května u křižovatky **Pionýrů**, nikoliv přesně stejné místo jako náš původní GPS pohled podle historického snímku Tiia Monto z roku 2014. Proto je nesprávné kopírovat seznam detailů z těchto záběrů na jedinou uliční parcelu.

**Zavedená změna**: první bezpečná, částečně foto-podložená zeleň u Pionýrů. Model `scripts/street-pionyru-photo-2023.js` zakládá nový miniaturní vegetační úsek od **skutečné OSM křižovatky** cest `219273174` (5. května) a `118488006` (Pionýrů). Jeho geometrie používá směrovou osu přímého navazujícího OSM úseku. V pravém/severovýchodním nezastavěném pásu projektuje pět *orientačních* zelených skupin ve vzdálenostech **19–51 m** od křižovatky. Každý bod samostatně odmítá kolizi s celoměstskou OSM evidencí ulic, pěších cest a nejbližších budov. Reálný SwiftShader WebGL test potvrdil všech **5** skupin, žádné zamítnuté nevhodné umístění a **pouze jeden instancovaný vykreslovací tah**.

**Limitace:** Není to geodetické ani pixelové navázání ke konkrétním stromům ze screenshotu; přesný druh rostlin, počet stromů a hranice soukromých pozemků z dostupného satelitu neurčujeme. Staré cesty i parkoviště ponecháváme nedotčené. **Chybějící příjezdové plochy, chodníky na opačné straně, reálné ploty a současné fasády** zůstávají cíleně v pořadníku do doby dalšího víceúhlového ověření.

**Nová fotokamera:** `?v=58210&streetAudit=pionyru` zobrazuje uliční blok od skutečného OSM křížení v technickém nadhledu se správně natočenou orientací a zdrojem *uživatelský Mapy.com satelit 4. 6. 2023*. Není to původní satelitní snímek promítnutý na 3D mesh. Původní kameru `streetAudit=5kv` ani `streetAudit=mirova` nepřepisujeme. Vstupní pravidlo nadále platí: fotografická identita před přesným modelem, uliční systém před kosmetickými pixely.

## 5.82.2 — dva fotograficky doložené nájezdy přes zelený pás (16. 11. 2026)

Uživatelův satelit Mapy.com ze 4. 6. 2023 ukazuje dva zpevněné přístupy přes okrajový pás 5. května poblíž Pionýrů. Pro herní přiblížení jsou umístěny podél OSM cesty 219273174 ve vzdálenosti 92 m na východ a 94 m na západ od křížení s Pionýrů 118488006. Jedná se o **odhad podložený snímkem**, nikoli přesné zaměření. Přidávají se pouze veřejné okrajové nájezdy, nikoli soukromé dvory, garáže nebo domy.

Testování odhalilo rozdíl mezi osmimetrovým předpokladem a skutečně použitou **devítimetrovou** modelovanou vozovkou. Nájezdy proto začínají 23 cm za hranou asfaltu, končí před OSM chodníkem 1282187908 a nezasahují do půdorysů domů. Celý obdélník kontroluje geometrická regrese s 12cm vzorkováním a 4cm kladným bezpečnostním odstupem. Dvě nové zpevněné části se instancují jediným draw callem, bez změny pěti dřívějších skupin zeleně. Nezměněné silnice, chodníky a parcely.

Přesné brány, vnitřní příjezdy, hranice vlastnictví a aktuální vzhled z roku 2026 z tohoto jednoho snímku neověřujeme. Vizuální přezkum je nutný. Kontrolní kamera: ?v=58220&streetAudit=pionyru.
