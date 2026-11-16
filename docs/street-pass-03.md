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


## 5.82.3 — mobilní kontrola z Part 17 (16. 11. 2026)

**Vstup:** uživatelský portrétní screenshot hry s panelem „Uliční blok · kontrola 5.82.3“;
kamera `streetAudit=pionyru`. Na snímku je silnice 5. května, přilehlý chodník,
oba úzké béžové panely přes zelený pás, existující objekty a několik tmavých
keřových skupin. Přímý novější satelitní ani panoramatický obraz v této zprávě
předán nebyl.

**Výsledek konkrétní revize:**

- Verze **5.82.3 se uživateli načetla**; na screenshotu není vidět přesun
  silnice, přeložení chodníku ani změna počtu dvou zpevněných přístupů.
  To je očekávané: změnou 5.82.3 je přesnější **polygonová** kontrola
  kolizí s půdorysy budov, nikoliv nový 3D obsah.
- Velké zelené plochy mezi budovami jsou stále převážně **prozatímní
  schematický terén** bez dokázaných hranic parcel, plotů, zahrad a skutečných
  různých povrchů. Nelze na ně genericky přidávat zahrady nebo vjezdy.
- Dva světlé zpevněné obdélníky se v technickém nadhledu jeví vizuálně
  **oddělené od okolního asfaltu a pěších tras**. V implementaci je kladný
  ochranný odstup od modelované vozovky a chodníku záměrný. Samotný
  screenshot **neprokazuje**, zda v realitě mezi nimi mezera je či není;
  neprodlužovat je slepě přes existující komunikaci. Nutné výslovné
  porovnání se zdrojovým satelitem 4. 6. 2023 a zaměřením u příslušné OSM hrany.
- Pět keřových skupin má stále schematický kruhový vzhled z technického
  nadhledu, ne ověřenou podobu konkrétních druhů/dimenzí.
- Automatické WebGL a unit regresní testy 5.82.3 prošly; to není
  důkaz fotografické přesnosti nebo naměřených mobilních FPS.

**Následující evidence-first práce:** rozdělit úsek na parcelně/OSM
ukotvené řádky a u každého zapsat *konkrétní doložený objekt*,
*datum a směr fotografie*, *existující 3D reprezentaci*, *zjištěný rozdíl*
a *míru jistoty*. Před opravou dvou panelů ověřit kontinuální trasu od
příslušného skutečného vjezdu ke skutečné vozovce (včetně pěšího chodníku).
Žádné rozšiřování na asfalt nebo soukromý pozemek podle pocitu. Nespoléhat
jen na svislý nadhled; druhý test z chodníku a opačného konce ulice.


## 5.82.4 — OSM diagnostika spojitosti dvou nájezdů (16. 11. 2026)

Uživatelský screenshot 5.82.3 ukázal dva izolované béžové obdélníky přes
veřejný zelený pás u Pionýrů. Místo neověřeného prodlužování 3D panelů
vzniká **pouze diagnostika**, která vychází ze stejných OSM vozovek a
pěších tras jako render hry.

- **Západní nájezd** `2023-west-upper-verge`: začíná cca **0,23 m**
  za modelovanou hranou 9m vozovky; u jeho vnějšího konce **není do 5 m
  zmapovaná pěší trasa** (to neznamená, že tam ve skutečnosti neexistuje).
- **Východní nájezd** `2023-east-upper-verge`: začíná rovněž cca **0,23 m**
  od modelovaného asfaltu a končí přibližně **0,77 m** od modelovaného
  půdorysu OSM pěší cesty `1282187908`. Jde o nejbližší místo
  od středu vnějšího konce nájezdu k hraně modelované trasy.
- Stav lze zkontrolovat v rozbaleném panelu technické kamery
  `?v=58240&streetAudit=pionyru`; programová data jsou v
  `window.__milovicePionyruSatellite2023.accessContinuityAudit`.
- Výpočet vyžaduje skutečné uzly OSM, a přitom je **jen modelový**:
  osa/mapová šířka nemusí odpovídat fyzické hraně obrubníku z roku 2026,
  fotka z roku 2023 není geodetická. `continuousRealDrivewayVerified=false`
  u obou objektů. Nikdy nespojovat plochu do vozovky nebo přes chodník
  pouze na základě těchto vzdáleností.
- Beze změny zůstává všech **5 keřových kapes**, **2 zpevněné přístupy**,
  georeferencované OSM silnice, budovy i pěší trasy. Nepřidává se žádný
  plot, brána ani soukromá příjezdová cesta.

Další skutečná 3D oprava má přijít **až po potvrzení na stejné historické
satelitní fotografii / důvěryhodném novějším snímku**: průchod přes obrubník,
směr a tvar příjezdu, návaznost na skutečnou bránu i případnou pěší trasu.
Nedostatek detailu v současné hře není licence k vymyšlení objektu.


## 5.82.6 — první 3D oprava podle panoramatu z roku 2022 (Part 17, 16. 11. 2026)

Uživatel předal dvě **srovnávací fotografie** téhož přibližného směru:
Mapy.com Panorama z **9. 5. 2022** a mobilní 3D snímek verze **5.82.5**.
V panoramatu jsou zřejmé: kostelní věž po levé straně, první domy,
šedá ocelová lampa se zalomeným/zakřiveným horním ramenem vlevo u silnice,
úzké pěší plochy, opotřebený asfalt, ploty a zídky a členitější vegetace.
Ve hře už existuje kostel a silnice, ale postrádá mnoho konkrétních
prvků uličního prostředí. Jde o **pozorování z roku 2022**, nikoliv doklad
jejich přesného aktuálního stavu v roce 2026. Panoramatický obrázek
se nikam nekopíruje; používáme originální 3D síť.

### V této verzi FYZICKY doplněno

- **Přesně jeden 3D model šedé pouliční lampy** z ověřeného typu fotografie.
  Má kovový štíhlý sloup s plynule zahnutým ramenem, samostatnou hlavici
  a světlý spodní panel (bez přidaného dynamického světla a bez nočních
  stínů). Vykresluje se jako **3 nízkonákladové mesh objekty**.
- *Přibližná* OSM kotva: silnice 5. května `219273174`, směr od křižovatky
  Pionýrů `118488006` **ke kostelu sv. Kateřiny `118487991`**;
  testovací pozice 132 m po mapované ose od křižovatky, 6,3 m po levé
  straně této osy. Není to zaměřený fyzický lampový sloup a poloha
  bude revidována po přesném fotogeoreferencování.
- Umístění prochází kontrolou **celého půdorysu lampy**, ochranným
  odstupem od všech OSM vozovek a chodníků i od všech OSM budov;
  v případě kolize systém objekt **nevykreslí** místo toho, aby
  posunoval silnici, mazal chodník nebo hádal novou polohu.
- Foto-doložená dřevěná sloupová konstrukce z jiné historické fotografie
  z 26. 7. 2014 zůstává samostatná; nelze ji vydávat za tutéž ocelovou
  lampu. Tuto 2022 lampu systém nevytváří opakovaně při streamingu mapy.
- Kamera `?v=58260&streetAudit=pionyru-reverse` ukazuje směr ke kostelu,
  ale **není kalibrovaná na GPS fotoaparátu Mapy.com**. Případnou změnu
  polohy lampy je třeba podložit dalším úhlem nebo georeferencovaným zdrojem.

### Nezměněné a stále otevřené

OSM střechy/domovní půdorysy, silnice, pěší cesty, oba nájezdy,
potvrzených pět vegetačních skupin, autobus, auta, nádraží a interakce
zůstávají nedotčené. **Ploty, privátní vjezdy, hranice zahrad a
nezmapované pěší trasy** se podle jediné panoramatické kamery
nevytvářejí: zdejší export OSM jejich půdorysy nemá a obraz nedokládá
přesnou délku/parcelu. Další práce: identifikovat první levý dům,
získat kontrastní úhel na obě strany ulice a přiřadit skutečné
hrany plotů a chodníků konkrétním OSM prvkům. Teprve pak další 3D
hmoty, bez náhodného „zazelenění“ a bez posouvání domů.


## 5.82.7 — oprava směru ke kostelu po mobilním screenshotu (16. 11. 2026)

Uživatel potvrdil načtení 5.82.6 screenshotem z technické kamery
`streetAudit=pionyru-reverse`: ve výsledku **není kostel ani fotografovaná
šedá lampa v záběru**. Odkaz v poslední odpovědi byl chybně popsán jako
„směrem ke kostelu“, ačkoliv kamera **reverse je směrem zpět ke křižovatce**.
Skutečný pohled ke kostelu je `streetAudit=pionyru-forward`.

Současně byl nalezen funkční problém: dřívější algoritmus 5.82.6
volil pokračování silnice `219273174` od křižovatky Pionýrů
podle kladné světové souřadnice Z. V tomto úseku je to **opačná strana
než OSM kostel sv. Kateřiny Alexandrijské `118487991`**. Test tehdy
ověřoval čistě kolize, takže chybný směr nezachytil.

**Oprava 5.82.7:** výběr větve je nově odvozen od skutečného
**půdorysu kostela OSM 118487991**, přiřazeného k modelu budovy, nikoli
od znaménka osy Z. Test kontroluje, že nová lampa je podstatně blíže
kostelu než původní křižovatka, a funguje při obou pořadích uzlů OSM.
Chybějící/nevhodný půdorys kostela znamená **žádné umístění**, ne
náhodný odhad. Zachován je pouze **jeden** původní model lampy a
osazení podléhá stejným kontrolám kolize s vozovkami, chodníky a domy.

**Přesná geodetická poloha lampy stále není ověřená.** Technický pohled
ke kostelu používá herní OSM kameru, ne stejné ohnisko a stanoviště jako
fotografie Mapy.com z 9. 5. 2022. Ostatní ulice a budovy zůstaly beze změny.


## 5.84.0 — společná foto-rekonstrukce 5. května: levý chodník + veřejná 2024 kamera

**Nové vstupy, 16. 11. 2026:**
- Uživatelův screenshot Mapy.com Panorama **9. 5. 2022**: ve směru ke kostelu je
  na LEVÉ straně ulice vidět úzký veřejný chodník s obrubou. Datum 2022 je
  historický stav; z panoramatu neznáme souřadnice hran dlažby.
- Wikimedia Commons, **ŠJů, 30. 5. 2024, CC BY 4.0**:
  [Milovice, kostel sv. Kateřiny (05)](https://commons.wikimedia.org/wiki/File:Milovice,_kostel_sv._Kate%C5%99iny_(05).jpg).
  Fotograf uvedl **50.2278239 N, 14.8837536 E, heading 320°**.
  Používáme tento ověřený bod a heading přímo pro pohled
  `?v=58400&streetAudit=church-2024`. FOV herní kamery a terén
  se neodvozují přímo z fotodokumentace: shoda snímků není pixel-perfect.
- Veřejný přehled dalších souvisejících fotografií:
  [Wikimedia Commons – 5. května (Milovice)](https://commons.wikimedia.org/wiki/Category:5._kv%C4%9Btna_(Milovice)).
  Zejména [Tiia Monto 26. 7. 2014](https://commons.wikimedia.org/wiki/File:Milovice_-_5._kv%C4%9Btna.jpg)
  a [ŠJů Mírová 36, 30. 5. 2024](https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_36.jpg)
  už měly jiné, zdrojově samostatně přiznané modelové zásahy.
  **Nespojovat objekty z odlišných úseků jen podle názvu ulice.**

**Skutečně vytvořená 3D geometrie:**
- Nový sdílený plánovač `scripts/photo-sidewalk-2022.js` zkouší
  celé chodníkové pásmo na **5. května od Pionýrů směrem ke kostelu**.
  Zvolený konzervativní vizuální odhad: od 9 do 117 m od mapované
  křižovatky, levý středový odstup -5,53 m od OSM osy, šířka 1,45 m,
  vzorkování po 2,25 m. Tyto hodnoty nejsou zaměřené GPS ani neplynou
  přímo ze čtení pixelů chráněného Panoramata. Jsou přiznané v konfiguraci
  a budou revidovány s přesnějším úhlem.
- Před každým úsekem probíhá **kontrola celého orientovaného obdélníku**
  s bezpečnostní rezervou vůči původní OSM silnici, VŠEM ostatním
  zmapovaným cestám a budovám. Neplatné segmenty se přeskočí;
  nepřemosťují se novou vymyšlenou cestou. Plocha ani silnice nepoužívají
  nové uzly OSM.
- Přijaté segmenty se dávkově vykreslí v pouhých **dvou meshích**
  (chodník se stávající dlažební texturou a souvislá nízká obruba).
  Vertex-height vychází ze stejné funkce terénu jako silnice.
  Nevytváří se žádný soukromý vjezd, plot nebo nové fyzické domy.
  Měřitelný skutečně vykreslený součet uvádí
  `window.__miloviceChurchSidewalk2022.modelledLengthM`.
- Reprodukční a kolizní test:
  `scripts/photo-sidewalk-2022.test.mjs`, společná mobilní WebGL
  kontrola `scripts/street-block-webgl.mjs`.

**Není hotovo:** Reality-match konkrétních plotů, fasád, výsadeb a
parcelních vjezdů je stále otevřený; bez dalších fotoúhlů se nesmějí
hromadně domyslet. Další důležitý krok je vzít `church-2024` pohled
a porovnat s přesným veřejným fotografickým zdrojem, poté v jednom bloku
opravit několik OSM fasád se skutečnými rozdíly místo zvyšování
počtu generických dekorací.
