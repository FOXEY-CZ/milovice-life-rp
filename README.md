## Milovice RP 5.118 — Armádní: Billa a Poliklinika podle OSM a veřejných fotografií (Part 24, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=511800

**Přímé technické herní kamery:** [Billa od servisní příjezdové cesty](https://foxey-cz.github.io/milovice-life-rp/?v=511800&streetAudit=armadni-billa-5118) · [Poliklinika od Spojovací](https://foxey-cz.github.io/milovice-life-rp/?v=511800&streetAudit=armadni-clinic-5118)

- **Zdroje:** reálný OSM way **53865798** (`Billa`, `shop=supermarket`, `building=supermarket`, `building:levels=1`, půdorys cca **1 125,80 m²**) a way **1057548624** (`Poliklinika Milovice`, `amenity=clinic`, `healthcare=clinic`, půdorys cca **827,58 m²**). Oba objekty existují v uloženém `data/regions/mlada.json`; v překryvném `vrutice.json` nejsou. Geometrie půdorysů, jejich centrální poloha, OSM vozovky, chodníky ani okolní stavby se nepřepisují.
- **Fotografie Billa:** [Firmy.cz – BILLA Milovice, Armádní 874](https://www.firmy.cz/detail/13214923-billa-milovice-mlada.html). Snímek dokládá **šedé opláštění, černou nadvchodovou stříšku a výrazný střešní nápis**. Ve hře už existovala modelová výška **5,20 m** a fotkou inspirovaná stříška, ale současně se na **každé** stěně supermarketu generovaly dlouhé falešné skleněné pásy a další náhodné vchodové panely. Nyní se plošné prosklení obvodu a zdvojený falešný vstup vypínají. Původní cílené prosklení/cedule vstupního průčelí zůstávají.
- U půdorysu Billy je doložené zapuštěné západní křídlo. Nové umístění vstupního průčelí vybírá skutečnou **reentrantní hranu OSM (index 4)**, kterou je vidět ze skutečné příjezdové komunikace **way/1057548615**, nikoliv obecně nejbližší stěnu k hlavní třídě. Geometrie hrany je přesně z OSM, **zda vstup leží právě uprostřed této hrany není z jediné fotografie geodeticky potvrzené**. Nezakreslujeme nové cestičky ani parkovací místa odhadem.
- **Fotografie Polikliniky:** [ABP Holding – dokončená budova Poliklinika Milovice](https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice), uvedena realizace **2019–2023**. Snímek ukazuje **čtyři nadzemní úrovně oken, bílou hlavní fasádu, tyrkysové meziokenní panely a obdélníkové prosklení**. Starý obecný model bez `building:levels` chybně předpokládal **pouze dvě podlaží**. V nové verzi má **čtyřpodlažní model** s odhadovanou výškou **12,90 m**, bílou fasádou, 4 řadami oken a tyrkysovými panely ve vrchních 3 řadách. **Skutečná výška, přesné rozestupy oken a přesná pozice fotografa nejsou změřeny.**
- Modelové barevné fasádní prvky Polikliniky se kreslí **pouze na východní dlouhé OSM hraně (index 2, cca 44,86 m), směrem ke skutečné Spojovací**; je to uvážlivý **směrový odhad**, ne tvrzení o fotografickém rozpoznání úhlu kamery. Neověřené zadní/boční fasády zůstávají jednoduché. Odstraňuje se nesprávná obecná komerční skleněná stříška a náhodný vchod. Model používá už existující `archPart` → `finalizeArchitecture` / `THREE.InstancedMesh` v pouhých třech nových sdílených materiálech `clinicTeal`, `clinicWindow`, `clinicFrame`; zbytečné jednotlivé mesh objekty na každé okno nevznikají.
- Nový úzce omezený a kontrolovatelný modul **`scripts/osm-armadni-landmarks-5118.js`** upravuje **pouze tyto dva OSM objekty**, vyžaduje přesně doložené identifikátory, názvy, typ, předpokládaný rozsah mapované plochy a nezasahuje do dříve schválené/fotograficky ošetřené architektury. `window.__miloviceArmLandmarksAudit` zpřístupňuje přesné zdrojové ID, skutečnou referenci fotografie, plánované podlaží, výšku a audit počtu vykreslených modelových oken a pásů.
- **Přesné kontrolní kamery z OSM:** Billa – GPS **50.2289351, 14.86186245** (střed spojnice dvou bodů servisní komunikace way/1057548615), směr **50,6°** k mapovanému zapuštěnému průčelí. Poliklinika – GPS **50.2286697, 14.8643547** (střed prvního úseku ulice Spojovací way/246652750), směr **287,3°** k východnímu průčelí. Ani jedna není vydávána za polohu fotografa.
- Diagnostika **`window.__miloviceArmLandmarksRuntime()`** po načtení oblasti kontroluje skutečné `THREE.InstancedMesh` materiály `clinicWindow`, `clinicTeal` a `clinicFrame`, včetně počtu instancí připojených ke scéně a aktuální viditelnosti po LOD. Když je oblast načtená mimo zorné pole, počty viditelných instancí mohou být nulové; samotné plánování proto nelze zaměňovat za mobilní screenshot či potvrzené vykreslení.
- Test **`scripts/osm-armadni-landmarks-5118.test.mjs`** validuje původní reálné OSM polygonové plochy/ID, povolený region a neprůchodné soukromé změny, příznaky ochrany modelu, počet viditelných podlaží z fotografie, skutečný vstupní OSM zářez, přesný výpočet obou úhlů kamer a zachování předchozích částí hry. Provedeno **109 JS regresních kontrol na skutečných uložených OSM datech**. Jde o kontrolu plánování a statické integrace; **živý test vykreslení Android/Chromium/WebGL a dokončení GitHub Pages nasazení nebyly potvrzeny**.

---

## Milovice RP 5.117 — Slepá a Armádní: čtyři další skutečné trafostanice, ne domy (Part 24, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=511700

**Nová technická kamera na Armádní u trafostanice NB 0459:** https://foxey-cz.github.io/milovice-life-rp/?v=511700&streetAudit=slepa-substations-5117

- Další souvislý úsek Slepé a Armádní má ve skutečných OSM datech čtyři malé budovy s `power=substation`: **way/762867641** (RÚIAN typ 16, provozovatel ČEZ Distribuce; plocha půdorysu přibližně **12,27 m²**), **way/1082018176** (NB 0459, `substation=minor_distribution`; **8,31 m²**), **way/1272167313** (NB 1057, `substation=minor_distribution`; **6,90 m²**) a **way/1468803930** (`power=substation`, ČEZ Distribuce; **7,66 m²**). Všechny čtyři jsou v `data/regions/mlada.json`, poslední uvedená trafostanice je zároveň v překrývajícím se exportu `vrutice.json`; staré deduplikování OSM way ID platí i zde.
- Nový přísný modul `scripts/osm-slepa-substations-5117.js` vyžaduje **přesné čtyři identifikátory, jejich technické tagy, půdorys v reálném rozsahu 5–20 m²** a nesmí přepsat dříve fotograficky prověřený nebo ručně schválený model. Odmítá záznamy s výslovným `height=*`, `building:levels=*`, `building:part=*` nebo soukromým přístupem. Neřeší nesouvisející objekty.
- Tato čtveřice se nyní napojuje na **stejnou bezpečnou kreslicí větev** jako tři starší objekty z verze 5.113. Namísto automatické obytné fasády a dvou výškových podlaží má každá **střídmý jednopodlažní model odhadované výšky 2,65 m**, prozatím jednoduchou střechu a žádná nově procedurálně vymyšlená obytná okna, dveře a skleněné stříšky. **Tvar střechy, barva, výška a vnější detaily NEJSOU fotograficky ověřené**, zato přesná OSM poloha a půdorys zůstávají nezměněné. Do města se **nepřidává žádná smyšlená budova**.
- Diagnostika `window.__miloviceSlepaDistrictSubstationAudit` rozlišuje čtyři nově rozpoznané OSM ID od starší trojice ve `window.__miloviceSlepaUtilityAudit`. Starší schválené modely, silnice, pěší napojení, parková zeleň, uživatelské menu a původní kamerové odkazy zůstávají zachované.
- Nová kamera `streetAudit=slepa-substations-5117` je přesně na původním OSM bodu silnice **Armádní way/1331897680** na GPS **50.2293803, 14.8618211**, přibližně **13,8 m** od středu existující trafostanice **NB 0459 way/1082018176**, ve směru **172,9°** vypočteném ze zdrojové geometrie. Nejde o fotografický úhel z Panorama.
- Test `scripts/osm-slepa-substations-5117.test.mjs` kontroluje oba reálné OSM exporty, odmítnutí změněných tagů a výšek, ochranu fotoověřených/ručních modelů, zachování 5.113, neexistenci vymyšlených vstupů a oken, přesnost kamery a jednotná build metadata. Skutečný testovaný modul a regresní test byly **vyhodnoceny v JS prostředí: 160 kontrol prošlo**. Skutečný Android/Chromium WebGL rendering a následné nasazení GitHub Pages **se zde neověřily**.

---

## Milovice RP 5.116 — bezpečné napojení skutečných pěších cest u Slepé a Armádní (Part 24, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=511600

**Kontrolní kamera přímo na OSM chodníku:** https://foxey-cz.github.io/milovice-life-rp/?v=511600&streetAudit=slepa-walk-5116

- V OSM kolem Slepé a Armádní se některé chodníky skládají z **dvou samostatných `highway=footway` ways**, které však mají **přesně stejný mapovaný koncový bod**. Dosavadní výplně 5.106/5.111 opravovaly pouze ohyby uvnitř jednoho way. Nový **`scripts/osm-slepa-pedestrian-endpoints-5116.js`** doplňuje drobné trojúhelníkové rohy mezi dvěma takovými samostatnými mapovanými pěšími úseky.
- **Žádné nově odvozené cesty mezi nespojenými objekty.** Algoritmus vyžaduje původní společný bod s tolerancí maximálně 3,5 cm, právě **dvě** incidentní geometrické hrany, dvě různá OSM ID, dva skutečné konce `highway=footway`, **shodný `surface=*`** (nebo oba bez údaje), shodnou již renderovanou šířku a rozumný úhel. Křižovatky s třetí větví, přechody (`footway=crossing`), soukromé či zákazové cesty, mosty, tunely a odlišné povrchy **nepřepojuje**.
- Přípustná ploška se ještě kontroluje proti existujícímu OSM modelu vozovek, budov a chráněným fotografickým oblastem. Kopíruje současnou výšku terénu `terrainAt()+.13`; má indexovanou `THREE.BufferGeometry` a jde do už existující `queueRoadStrip` dávky. Nevznikají samostatné renderovací objekty pro každý kousek. Původní OSM cesty, chodníky, šířky, dopravní značení a přechody se nijak nepřepisují.
- Ověření samotného plánovače proti skutečným regionálním exportům s **uvolněnými testovacími kolizními podmínkami** našlo v oblasti `mlada` **2 kandidátní koncové rohy**, v překrývající se oblasti `vrutice` **1 kandidátní roh**. Jedno společné napojení **way/1468803943 + way/1468803947** je v obou exportech stejné. Druhé napojení z oblastí `mlada` je **way/1108966068 + way/1316882865**. Není to počet nových chodníků: jen součty malých modelových plošek cca 0,405 m² a 0,137 m². Skutečné kolizní podmínky hry mohou některé vyřadit; regionální deduplikace brání dvojímu vykreslení stejných původních way.
- Přímá kamera na první spoj je odvozena ze skutečného středu **prvního segmentu OSM `way/1468803943`**, souřadnice **50.23013545, 14.8582529**, směr **91,7°** k reálnému společnému koncovému bodu **50.230134, 14.8583307**. Jde o technický, nikoliv fotografický záběr.
- Diagnostika `window.__miloviceSlepaPedestrianSeamAudit` vykazuje bezpečnostní důvody zamítnutí a skutečný počet trojúhelníků **zařazených do vykreslovací dávky**, nikoliv domněle ověřené viditelné pixely. Regresní test `scripts/osm-slepa-pedestrian-endpoints-5116.test.mjs` kontroluje původní souřadnice, shodné materiály, ochrany proti soukromým cestám/křižovatkám, determinismus a kameru. Přímé JS ověření na mapových datech proběhlo; **mobilní Chromium/WebGL běh ani aktualizace GitHub Pages zatím nejsou potvrzené**.

---

## Milovice RP 5.115 — Slepá a Armádní: souvislejší povrch reálných zatáček (Part 24, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=511500

**Přímá technická kamera na mapovaný ohyb Slepé směrem k Armádní:** https://foxey-cz.github.io/milovice-life-rp/?v=511500&streetAudit=slepa-armadni-bends-5115

- Dosavadní vykreslování skládá jednotlivé silnice z rovných OSM úseků. V místě lomu dvou sousedních úseků jedné komunikace může vzniknout drobná trojúhelníková mezera na **vnitřní** straně zatáčky. Nyní ji opravuje modul `scripts/osm-slepa-armadni-road-joins-5115.js` pro **`highway=residential` s názvem `Slepá` nebo `Armádní`** v mapových regionech Mladá/Vrutice.
- Zapečetění rohu používá **pouze původní trojici bodů uvnitř stejného OSM `way`**, jeho existující zobrazovanou šířku z `roadWidths` (tedy stejnou pro silnici, navigaci a kolize), orientaci obou segmentů a odpovídající stávající OSM `surface=*` materiál. Smí vzniknout jen malý trojúhelník mezi původními koncovými průřezy sousedních obdélníkových silničních pruhů. Příliš ostré zatáčky, přímé úseky a příliš krátké segmenty se odmítají. Žádné propojování různých ulic, žádné domýšlení neexistujících křižovatek, přechodů či chodníků. Původní OSM střednice, šířky, terén, parky a budovy se nemění.
- Obě existující OSM regionální kolekce obsahují desítky zatáček: přímé JS provedení modulu proti `mlada.json` našlo **31 vhodných rohů (27 Slepá + 4 Armádní)**, proti `vrutice.json` **29 rohů (20 Slepá + 9 Armádní)** při výchozích modelových šířkách 7,8 m. Toto jsou **překrývající se mapové oblasti, nikoliv 60 různých rohů**. V běžné hře se již použitá OSM ID při načtení další oblasti globálně deduplikují. Počty se mohou podle načtené oblasti, skutečných `width=*` tagů a filtrů změnit.
- Plošky využívají `terrainAt`, přesně stejnou výšku `+.17` jako vozovka, souvislé UV pro asfalt a **indexované `THREE.BufferGeometry`** pro zachování existujícího `queueRoadStrip` / `finalizeRoadStrips` slučování, bez jednotlivých samostatných meshů. `window.__miloviceSlepaArmRoadJoinAudit` odděluje skutečně vložené trojúhelníky do renderovací fronty od neprokázané viditelnosti na mobilním WebGL.
- Nová technická kamera `streetAudit=slepa-armadni-bends-5115` leží přesně na středu OSM úseku bod 3→4 komunikace **Slepá way/202375815**, GPS **50.22875565, 14.8593245** a směřuje **65,4°** k původnímu bodu spojení s **Armádní way/800846496**. Nejde o fotopohled z Panorama.
- Test `scripts/osm-slepa-armadni-road-joins-5115.test.mjs` ověřuje skutečná ID, původní lomové body, geometrii a plochu trojúhelníků, zamítání privátních nebo nesouvisejících cest, konzistentní výsledek při změně pořadí vstupů, deduplikaci, limit počtu, existující renderovací integraci, kameru a neměnné build ID. Modul byl přímo vyzkoušen v JS na obou OSM exportech s opakovatelnými výsledky. **Plný mobilní Chromium/WebGL běh ani nasazení GitHub Pages však zatím nejsou potvrzené.**

---

## Milovice RP 5.114 — Slepá: doložený park, šetrná zeleň a kontrolní kamera (Part 24, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=511400

**Přímá technická kamera z mapované ulice Slepá do parku:** https://foxey-cz.github.io/milovice-life-rp/?v=511400&streetAudit=slepa-park-5114

- V již uložených oficiálně mapovaných OSM datech `data/regions/mlada.json` a `data/regions/vrutice.json` existuje veřejně zakreslený polygon **`leisure=park` way/891874829** o **9 777,7 m²**. Oblast má vlastní již vykreslovaný parkový povrch a navazuje na skutečné úseky Slepé, okolní pěší cesty a chodníky. Žádný nový park ani smyšlené chodníky se nevytvářejí.
- Nový deterministický modul `scripts/osm-slepa-park-ground-5114.js` přidává do **přesně stejného polygonu** nejvýše **72 malých trojúhelníkových modelových travních trsů**. Všechny body procházejí testem bodu uvnitř zdrojového polygonu s ochranným odstupem od jeho hran. Následují skutečné 3D clearance kontroly vůči OSM silnicím včetně chodníků a pěších cest, budovám, vodním překážkám, starším fotoomezením a již vytvořeným procedurálním stromům.
- Výška jednotlivých trsů přibližně 11–26 cm; **jejich přesná poloha ani botanický druh nejsou fotoověřené**. Původní stromový generátor, půdorysy, povrch terénu, parkové hranice a dopravní síť zůstávají nedotčené. Nepřidávají se nedoložené lavičky, stromy, oplocení, herní prvky ani cesty.
- Render používá existující sdílenou geometrii `createLawnBlades()`, krátkodosahový `visualBatch()` a jeden samostatný instancovaný materiál pro audit. Nemění hlavní rozpočet modelů budov. `window.__miloviceSlepaParkAudit` ukazuje počet a důvody vynechaných pozic. `window.__miloviceSlepaParkRuntime()` prochází **opravdové `THREE.InstancedMesh`** a odděluje instancované prvky připojené ke scéně od těch, které jsou právě viditelné vzhledem k LOD.
- Kamera `streetAudit=slepa-park-5114` stojí na **přesném aritmetickém středu prvních dvou OSM bodů silnice Slepá way/202375819**, **50.2280113, 14.8589063**, a směřuje přibližně na centroid půdorysu parku (**337,9°**). Jde o technický herní pohled, nikoli o fotograficky určený úhel z Panorama.
- Test `scripts/osm-slepa-park-ground-5114.test.mjs` kontroluje oba reálné OSM exporty, přibližně **9 778 m²**, konzistentní polohu při změně pořadí regionů, nezdvojování trsů, privátní/změněné zdroje, ochrany před chodníky a domy, kameru i metadata buildu. Samostatné JS ověření plánovače nad oběma mapovými soubory prošlo: **72 plánovaných trsů v obou exportech při uvolněných testovacích clearance podmínkách**, shodně při opakovaném spuštění. Při skutečném běhu může být výsledný počet nižší podle překážek. Plný mobilní **Chromium/WebGL test nebyl prokazatelně spuštěn**; GitHub Pages je třeba po nasazení zkontrolovat.

---

## Milovice RP 5.113 — Slepá: pravdivější malé technické objekty + přímá kamera (Part 24, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=511300

**Technická kamera přímo z OSM u přístřešku:** https://foxey-cz.github.io/milovice-life-rp/?v=511300&streetAudit=slepa-utilities-5113

- Pokračování celé ulice a jejího okolí: skutečné OSM way **1079135295** má `amenity=shelter`, `building=yes` a výslovnou poznámku **„Přístřešek pro kontejnery na směsný odpad.“**. Je to objekt pro nádoby na odpad, **ne zastávkový přístřešek ani obytný dům**. K němu patří dvě blízké přesně doložené elektrické trafostanice **1079135294** a **1283868024** (`power=substation`, `substation=minor_distribution`). Obě regionální kopie `mlada.json` a `vrutice.json` obsahují stejné ID; původní deduplikace OSM nadále platí.
- Tyto **tři konkrétní budovy** už nemají automaticky dva obytné podlaží a procedurálně přidělená obytná okna, dveře a skleněné stříšky. Namísto toho mají střídmý model **jednoho podlaží, výšky 2,7 m a ploché střechy**. **Výška, materiál i tvar střechy jsou pouze modelový odhad, nikoliv fotoověřená podoba**. Žádné nové kontejnery, značení, vstupy, oplocení ani přístřešky nejsou vymyšlené. Půdorysy, geolokace, terén, okolní silnice a schválené fotografické modely se nepřepisují.
- Nový planner `scripts/osm-slepa-utilities-5113.js` má přísný seznam tří ID, ověřuje skutečné typové tagy a plochu polygonu, odmítá soukromý přístup, ochrannou foto-výjimku, ruční model i později zdokumentovanou výšku/podlaží. Plánuje pouze stávající 3D objekty, nikoli nové budovy.
- Přímá auditní kamera leží na uložené OSM linii **Slepá way/202398890** na **50.2282028213, 14.8607971450**, asi **5,6 m východně** od mapovaného přístřešku; zamíření **270,3°** je vypočtené k centroidu skutečného půdorysu. Nejde o fotograficky zaměřený pohled.
- Diagnostika `window.__miloviceSlepaUtilityAudit` vypisuje použité ID, typ, odhadnutou výšku a plochu. **Nejde o živý WebGL důkaz**, ale o diagnostiku klasifikace při sestavování scény.
- Regressní test `scripts/osm-slepa-utilities-5113.test.mjs` kontroluje oba skutečné OSM exporty, souhlas tří ID, ochrany před změnou tagů, obcházení procedurálních vstupů/oken, metadata buildu a skutečnou mapovou polohu kamery. Přímé spuštění klasifikátoru nad oběma OSM exporty v JS prostředí prošlo (**3/3 objekty v obou regionech**), pozice kamery i její úhel souhlasí. **Plný test mobilního Chromium/WebGL se zde neprovedl** a zveřejnění GitHub Pages se potvrzuje až po nasazení.

---

## Milovice RP 5.112 — dvanáct RÚIAN rodinných domů kolem Slepé, úprava fasád a přímý 3D pohled (Part 23, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=511200

**Nová přímá kamera na rodinné domy:** https://foxey-cz.github.io/milovice-life-rp/?v=511200&streetAudit=slepa-houses-5112

**Starší pohled na Slepou:** https://foxey-cz.github.io/milovice-life-rp/?v=511200&streetAudit=road-slepa-5108

- V reálných uložených OSM exportech `data/regions/mlada.json` a `data/regions/vrutice.json` je v okolí `Slepá way/202375817` **12 skutečných budov `building=house`**, které zároveň nesou `building:levels=2`, `building:flats=1`, `building:ruian:type=7` a `source=cuzk:ruian`. Zdrojová ID: **61977976, 61977982, 61977989, 61977993, 61977995, 61978001, 61978003, 61978005, 61978010, 61978012, 61978013, 61978015**. Nejbližší bod půdorysu má od modelované Slepé 29,5–96,6 m. Duplicity v překrývajících se regionálních datech se nemodelují znovu.
- Přísně omezený plánovač `scripts/osm-slepa-house-frontage-5112.js` rozpoznává **jen tyto zdrojově doložené dvoupodlažní a jednobytové rodinné domy**. Chrání dřívější fotoaudit, domy s neznámým `building=yes`, schválené modely, soukromé přístupy, ostatní oblasti a příliš vzdálené budovy. NEMĚNÍ OSM půdorysy, výšku podlaží, výškový terén, polohu již modelovaných dveří ani tvar střech.
- Při existujícím výpočtu veřejně přístupné uliční fasády `streetFrontage.select(pts)` se teď už **nevyrobí modelové přízemní okno přes osu dveří**. Konflikt se vyhodnocuje podle skutečné modelové šířky stěny, pozice okenního bay, šířky dveří 1,28 m a ochranného okraje. Druhé patro i nesouvisející stěny zůstávají nedotčené. Pokud model neumí doložit veřejně orientovanou fasádu, **nepředstírá znalost vstupu** a okna neskrývá.
- Původní generický algoritmus dával celému bloku stejné velké **skleněné stříšky**. U těchto 12 budov se bez fotografické evidence **nezobrazují**; nová celková kresba je střídmější, konzistentnější a nevyvolává dojem, že každý dům má identickou stříšku. Barva zdí, okna jako individuální půdorysy, branky, ploty či stromy se neoznačují jako fotoověřené.
- Nová auditní kamera `streetAudit=slepa-houses-5112` má výchozí GPS **50.22749795, 14.8595789**, tedy aritmetický střed **prvního OSM segmentu Slepá way/1029234206**, a směr **63,3°** vypočtený ze souhrnného středu 12 skutečných RÚIAN domovních půdorysů. Není to dokumentovaný záběr z Panorama, ale konkrétní hratelný zorný úhel pro vizuální porovnání. Původní pohledy a jejich metadata zůstávají.
- Na mobilu zůstává opravené kompaktní menu z 5.111: nyní **34 odkazů v 7 kategoriích**, všechny kategorie lze rozbalit na vyžádání, detaily GPS a zdrojů jsou oddělené. Křížek vrací do běžné hry a odkazy se neshrnují do jednopixelových čárek.
- Diagnostiky: `window.__miloviceSlepaHouseAudit` (zdrojové domy, případně potlačená okna a stříšky, modelová orientace vchodů); `window.__miloviceSlepaHouseRuntime()` po načtení a LOD projde **skutečné `THREE.InstancedMesh`** materiálu `darkWood` a ověří umístění modelovaných dveří na uložených 3D souřadnicích i viditelnost všech nadřazených objektů až do scény. Není to falešný kontrolní údaj bez geometrie.
- Test `scripts/osm-slepa-house-frontage-5112.test.mjs` porovnává skutečné OSM exporty, 12 ID, dvě patra, jednu bytovou jednotku, bezpečnou ochranu soukromých nebo neznámých domů, skutečnou polohu nové kamery a odstraňování kolize oken s dveřmi jen v přízemí. Dále `scripts/osm-slepa-house-webgl-5112.mjs` poskytuje připravený **mobilní Chromium 3D test po 6,5 sekundách**. Izolované JS regresní kontroly verze 5.108–5.112 prošly; **Chromium/WebGL nebyl v tomto chatu prokazatelně spuštěn**.
- Milovice RP zůstává vizuální procedurální rekonstrukcí na skutečné mapové geometrii. Nepodložené rozměry dveří, rozmístění oken, barvy a přístřešky nejsou vydávány za dokázané fyzické vlastnosti. Přímé porovnání s veřejnými fotografiemi zůstává dalším krokem.

---

## Milovice RP 5.111 — mobilní menu opravené podle screenshotu + Slepá pěší cesty (Part 23, 17. 11. 2026)

**Ověření hry na mobilu:** https://foxey-cz.github.io/milovice-life-rp/?v=511100&streetAudit=road-slepa-5108

**Slepá bez kontrolního režimu:** https://foxey-cz.github.io/milovice-life-rp/?v=511100

### Oprava menu podle uživatelského screenshotu (mobil, Slepá)

- Původní rozbalená nabídka obsazovala podstatnou část displeje; pod kategorií „Ulice a fotografie (21)“ byly vidět téměř nečitelné vodorovné proužky a pod nimi zcela nesouvisející popis lampy a kostela u 5. května, ačkoliv kamera ukazovala Slepou.
- Mobilní panel nyní **standardně zůstává kompaktní** (max 112 CSS px), s jediným tlačítkem „☰ Vybrat pohled“, stručným názvem aktivního pohledu a křížkem **✕ pro návrat do hry**. Při rozbalení se zobrazí **7 názvů kategorií**, všechny původně zavřené; teprve dotykem konkrétního názvu se zpřístupní jednotlivé odkazy.
- Nejvyšší panel na telefonu má nyní `max-height:min(44dvh,360px)`; vnitřní seznam kategorií a jednotlivých odkazů samostatně scrolluje. Důležité: opravená pravidla `flex:0 0 auto`, `flex-shrink:0` a `height:auto!important` zabraňují tomu, aby Chrome kvůli shrinkování stlačil text odkazů na úzké proužky. Odkazy se **zalamují**, nejsou skryté pomocí `white-space:nowrap`.
- GPS, zdroj a kontext se odteď zobrazí **výhradně po kliknutí na „📍 GPS a zdroj“**; při sbalení se tento přídavný panel sám zavře. Nesouvisející obecný foto-popis kostela a lampy z roku 2022 je opraven — kontrolní pohledy u Slepé a Vrutické mají výslovně **OSM mapovou povahu, šířku 6 m a nikoli foto-dokumentaci**.
- **Zachováno všech 33 odkazů** v 7 kategoriích, přesné geolokace technických kamer, příslušné OSM zdroje a fotografické odkazy staršího centra. Mobilní kontrolní test: `scripts/street-audit-menu-webgl-5101.mjs`, statický regresní test `scripts/street-audit-menu-5101.test.mjs`.

### Pokračování celé Slepé: napojení skutečných pěších tras

- Nově se vykreslují **drobné vyplňující trojúhelníky v ohybech už existujících OSM `highway=footway/path`**, do 145 m od střednice doložené komunikace **Slepá way/202375817** (souřadnice kotvy jsou vypočteny přímo ze zdrojové OSM cesty, nikoliv posunutím kamerou). Využívá se auditovaný generátor `planMladaFootwayCorners` z předchozích 5.106/5.107; tyto dvě starší oblasti zůstávají zachované.
- V každém bodě ohybu se ověřují střety s dopravními komunikacemi a mapovanými budovami. **Žádný nový chodník, žádný smyšlený přechod, žádné posuny oficiálních bodů tras nebo změny staveb.** Materiál odpovídá OSM `surface=*`, pokud jej zdroj uvádí; bez zdroje se používá stávající vzhled chodníku. Výplně z různých cest se slučují do nejmenšího možného množství 3D meshů podle materiálu.
- Souběžné regionální exporty Mladá/Vrutice nepřidávají duplicitní zdrojový `way`, protože již funguje globální deduplikace OSM. Nový audit `window.__miloviceSlepaFootwayJoinAudit` a `window.__miloviceSlepaFootwayJoinRuntime()` rozlišují počty trojúhelníků od jejich skutečného napojení na renderovanou scénu po 5 sekundách.
- `scripts/osm-slepa-footway-joins-5111.test.mjs` ověřuje geometrii z obou skutečných OSM exportů, reprodukovatelnost při otočení pořadí `way`, žádné duplicitní rohy a bezpečné odstupy od cest a budov. Testy 5.108 (šířky silnic), 5.109 (5 bytových domů), 5.110 (15 trávníků a 48 trsů) byly zachovány a **při izolovaném JS ověření všechny prošly**.
- Vědomé omezení: plný test **Chromium/WebGL s reálným vykreslováním této online verze zde nebyl proveden**. Verze 5.111 je zapsaná v GitHub repozitáři a dostupnost nového nasazení závisí na aktualizaci GitHub Pages.

---

## Milovice RP 5.110 — Slepá: skutečné travnaté plochy, příjezdy a parkování bez kolizí (Part 23, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=511000

**Přímý technický 3D pohled na Slepou:** https://foxey-cz.github.io/milovice-life-rp/?v=511000&streetAudit=road-slepa-5108

- Po 5.109 následuje **okolí celé mapované ulice**, ne další izolovaná fasáda. Podle aktuálně uložených OSM exportů `data/regions/mlada.json` + `data/regions/vrutice.json` je ve vzdálenosti do 85 m od původní střednice **Slepá way/202375817** celkem **15 platných polygonů `landuse=grass`**. Dvě regionální kopie téhož objektu se počítají jen jednou. Jejich půdorysy, světová výška a původní barevné materiály jsou NEDOTČENÉ.
- Nový `scripts/osm-slepa-street-5110.js` tvoří uvnitř těchto doložených polygonů **48 drobných instancovaných travních trsů**. Každá odvozená pozice musí ležet celým drobným půdorysem uvnitř skutečného OSM polygonu, mimo mapovanou vozovku, chodník, příjezd, stavbu a vodní cestu. Odmítá soukromé plochy a fotograficky chráněné zóny. Respektuje již detailované polygony okolí hřišť z verze 5.104, aby nevznikaly dvojité trsy.
- Dvě skutečně zmapované příjezdové komunikace `highway=service + service=driveway` — **way/1019598855 a way/1019598856** — mají konzistentní **modelovou šířku 3,2 m místo původní univerzální 4,5 m**. Šířka je odhad pro 3D model, nikoliv údaj z OSM ani z fotografie! Nehýbá se jejich osou a zároveň se používá pro asfalt, jízdní index a ochranu chodníků. Ostatní komunikace a oficiální `width=*` tagy se nemění.
- V OSM exportech pro nejbližší okolí této Slepé **není označený samostatný polygon `amenity=parking`**, takže **nevznikají nová domnělá parkoviště, vyznačená stání ani obrubníky**. Procedurálně zaparkovaná auta nejsou prezentována jako dokumentovaná reálná vozidla. Parkovací plánovač `scripts/parking-layout.js` nově přijímá filtr `acceptSpot`. V okolí Slepé tím každé navržené auto kontroluje svůj přibližný celý půdorys 4,7 × 1,92 m proti existujícím mapovaným travnatým polygonům, pěším cestám a budovám; při kolizi se nevykreslí. Kontrola se netýká vzdáleného starého centra.
- Jako další prostorová bezpečnost přidán oddělený `osmPedestrianClearance` (pouze reálné mapované pěší cesty), aby parkované auto nemuselo být odmítnuto jen proto, že stojí na existující vozovce, ale nesmělo přejet přes chodník. Žádné nové stromy, keře, veřejný mobiliář ani dětské vybavení se nepřidávají.
- Diagnostika ve hře: `window.__miloviceSlepaLawnAudit`, `window.__miloviceSlepaLawnRuntime()`, `window.__miloviceSlepaAccessAudit`, `window.__miloviceSlepaParkingAudit`. Runtime test trávních instancí kontroluje **celý řetězec rodičů do skutečné Three.js scény**, aby se neopakovala chyba mizících objektů po streamování.
- Test `scripts/osm-slepa-street-5110.test.mjs` byl spuštěn v JS testovacím prostředí s oběma skutečnými OSM exporty a **prošel**: přesných 15 doložených trávníků / 48 detailů / 2 příjezdů, determinismus při prohození regionů, odmítání kolizí i příliš obecných prvků. Přidán také `scripts/osm-slepa-street-webgl-5110.mjs` pro mobilní Chromium včetně kontroly viditelnosti detailů po 6,2 s; **WebGL běh nebyl v tomto kroku potvrzen**.
- Grafika zůstává **realistickým, ale dílčím procedurálním modelem**; přesný porost, typ obrubníků, šířka příjezdů i skutečné rozmístění zaparkovaných aut bude potřeba přizpůsobit podle veřejných fotografií nebo budoucích panorama snímků. Půdorysy domů (včetně 5 bytovek z 5.109), veřejné chodníky a silnice zůstávají zachované.

---

## Milovice RP 5.109 — obytná ulice Slepá: pět čtyřpodlažních domů (Part 23, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=510900

**Přímá technická kamera (není fotografie):** https://foxey-cz.github.io/milovice-life-rp/?v=510900&streetAudit=road-slepa-5108

- Podle uložených OSM exportů `data/regions/mlada.json` a `data/regions/vrutice.json` se **v okolí skutečné mapované ulice Slepá (way/202375817)** nachází 5 blízkých bytových objektů `building=residential` s výslovným `building:levels=4`: **53865778, 734359705, 734359706, 734359707 a 734359708**. OSM navíc uvádí 32, 29, 20, 39 a 23 bytů; počty bytů **nepoužíváme k odhadování oken**. Měřená vzdálenost od dvoubodové střednice Slepé je 11,5–59,5 m; výběr omezen do 75 m.
- `scripts/osm-slepa-residential-5109.js` je přísně omezený na obě překrývající se oblasti a **konkrétní existující OSM road way 202375817** předaný přes skutečnou regionální geometrii. Nevznikají další domy, neověřené obytné budovy `building=yes` zůstávají beze změny; daleký pojmenovaný komplex Relax A/B a rodinné domky se nepředělávají.
- Vlastní 3D změna: všech pět již vykreslovaných bytových domů používá u fasád stejný čtyřpodlažní rastr jako dřívější Mladá 5.105: **tři vodorovné podlažní spáry**, svislé spáry pouze jednou mezi okny, bez duplicitního opakování jedné lišty v každém patře. Modelová přízemní okna se nevykreslují přes již naplánované vstupy. Stávající architektonické instancování sdružuje opakující se detaily do GPU dávek podle 160m buněk.
- Žádné úpravy půdorysů, skutečných tras silnic a chodníků, zelených ploch, výškového modelu, střešních typů, soukromých pozemků či dříve fotograficky ověřeného centra. **Barvy, poloha a skutečné počty oken ani detaily vstupů nejsou fotograficky potvrzené.**
- Regionální deduplikace zabraňuje dvojitému vytvoření stejných pěti objektů z Mladé a Vrutice. Fasády jsou identické bez ohledu na pořadí načtení zdrojů. Oddělené diagnostiky `window.__miloviceSlepaResidentialAudit` a `window.__miloviceMladaResidentialAudit` zajistí, že vylepšení Slepé nenaruší původní audit 22 bytových objektů v jiné části Mladé.
- Nový `scripts/osm-slepa-residential-5109.test.mjs` ověřuje zdrojové ID, podlaží, byty, ochranu nesouvisejících objektů, počet 5 a stejný výsledek v obou překrývajících se exportech. `scripts/osm-slepa-residential-webgl-5109.mjs` obsahuje kontrolu běžící scény na telefonu po 6,2 s. `window.__miloviceSlepaResidentialRuntime()` rozlišuje pouhé počty plánovaných dílů od skutečných viditelných `THREE.InstancedMesh` po průchodu LOD/streamováním. Browser test je **připravený, nikoliv prokazatelně spuštěný** v tomto chatu.

---

## Milovice RP 5.108 — skutečné mapované šířky ulic v Mladé a Benátecké Vrutici (Part 23, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=510800

**Přímé 3D kamery v reálné mapové poloze, technické, NIKOLI fotografické:**
- [Slepá, úsek way/202375817 (OSM width=6 m)](https://foxey-cz.github.io/milovice-life-rp/?v=510800&streetAudit=road-slepa-5108)
- [Vrutická, úsek way/523991122 (OSM width=6 m)](https://foxey-cz.github.io/milovice-life-rp/?v=510800&streetAudit=road-vruticka-5108)

- Opraven dosavadní rozpor: šířka silnice pro rendering/vozidla a kolizní index byla jen výchozí šířka podle OSM `highway`. Nový bezpečný resolver `scripts/osm-road-width-5108.js` využívá **pouze explicitní číselné OSM `width=*` v metrech**, pokud se jedná o skutečnou komunikaci v regionech `mlada`, `vrutice` nebo `westlink`. Všechny netagované komunikace a původní fotoauditované staré Milovice používají dosavadní modelové hodnoty.
- V uložených OSM exportech je **18 označených úseků ve Vrutici a 6 v Mladé** (některé stejné zdrojové way se přes regiony překrývají). Konkrétní změny zahrnují **Slepá (way/202375817, 6 m; way/1029541305, 5 m)**, **Vrutická (way/523991122, 6 m; way/612386894, 5 m)**, ČSA (way/8618262, 6 m) a Pod Lesem (way/128087258, 6 m). Nejde o 24 nutně jedinečných ulic ani o přesné geodetické zaměření hran obrubníků.
- Pro každý OSM way se šířka vyhodnotí právě jednou, ještě před vytvořením ochranného indexu vozovek. Tato **jediná hodnota** je sdílená pro 3D pás asfaltu, `osmRoadClearance`, `osmCarriagewayClearance`, `osmDriveRoads`, `streetFrontage` a podklady pro volitelné OSM `sidewalk=left/right/both`. Tím se zabrání rozporným šířkám mezi jízdní stopou, asfaltovým povrchem a chodníkem.
- Neplatné, nepřiměřené nebo nejednoznačné tagy (`5;6`, `5 m`, `6,5`, záporné či velmi vysoké hodnoty) se **ignorují**, nic se neodhaduje. Žádné nové silnice, průchody, přechody, obrubníky či náhodné dekorace. Není zasaženo do OSM střednic, půdorysů domů, výškopisu ani fotograficky auditovaného starého centra.
- Dvě nové uživatelsky dostupné 3D kamery mají pozici a azimut vypočtený z konkrétního OSM segmentu, nikoli vymyšlenou polohu fotografa. Počet odkazů na auditní pohledy je nově **33**. Regresní testy menu a mobilních scén aktualizované.
- Audit: `window.__miloviceRoadWidthAudit`. Jednotkový test `scripts/osm-road-width-5108.test.mjs` kontroluje konkrétní mapované šířky, odmítané tagy, ochranu starého centra, konzistentní napojení rendereru a přesnost obou kamer. Chromium WebGL test `scripts/osm-playground-camera-webgl-5103.mjs` navíc ověřuje napojení nové šířky na skutečnou běžící 3D oblast Vrutice. **Samotný live WebGL test dosud není touto dokumentací prohlašován za spuštěný či úspěšný**.

---

## Milovice RP 5.107 — navazující pěší cesty v Benátecké Vrutici (Part 23, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=510700

**Kontrolní 3D kamera v Benátecké Vrutici:** https://foxey-cz.github.io/milovice-life-rp/?v=510700&streetAudit=play-vrutice-5103

- Pokračování stejného bezpečného OSM geometrického postupu z verze 5.106 také do **Benátecké Vrutice**, v docházkové vzdálenosti do 140 m od skutečného OSM polygonu veřejného hřiště [way/1303773811](https://www.openstreetmap.org/way/1303773811). Geografickým kotvícím bodem je aritmetický průměr jeho čtyř skutečných vrcholů, ne vymyšlená křižovatka.
- Aktuálně uložený export `data/regions/vrutice.json` identifikuje **204 malých ohybových trojúhelníků na 34 mapovaných pěších trasách**. Skutečné souřadnice průběhů tras se nemění. Jde pouze o propojení chybějících vnitřních rohů již vykreslovaných pásů `highway=path/footway`. **28 přechodových cest** se vyřazuje; žádné nové zebry ani chodníky. Čísla jsou ze samostatného testu zdrojového exportu, nikoli fotografie.
- Plánovač `scripts/osm-mlada-footway-joins-5106.js` nyní přijímá samostatně doložený regionální bod; původních 18 oprav v Mladé a jejich logika zůstaly zachovány. Společná geometrie kontroluje vozovky, stavby, soukromé komunikace a stav `footway=crossing`. Odhadované šířky a podoba povrchů se **nesmějí prezentovat jako fotometricky ověřené**.
- Renderer nyní u každého ohybu používá skutečný mapový typ cesty (`footway/path`) a značku `surface`, namísto zobecnění všech rohů na `footway`. Trojúhelníky stejného materiálu se slučují do jediného `THREE.BufferGeometry` meshe pro nízký počet draw calls.
- Diagnostika ve hře: `window.__miloviceVruticeFootwayJoinAudit`, skutečné objekty po načtení: `window.__miloviceVruticeFootwayJoinRuntime()`. Vylepšená kontrola viditelnosti sleduje i připojení do aktivní 3D scény, aby objekt nebyl mylně započten jako viditelný po streamování. Doplněn test `scripts/osm-vrutice-footway-joins-5107.test.mjs` a rozšířen mobilní Chromium WebGL test `scripts/osm-playground-camera-webgl-5103.mjs`.
- **Fotografie nebyly v této změně použity k potvrzení přesné podoby obrubníků či povrchů**; cíl je celistvá mapově odvozená pěší síť v rámci stávající herní reprezentace, bez přidávání smyšlených objektů.

---

## Milovice RP 5.106 — plynulé ohyby pěších cest v Mladé (Part 22, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=510600

**Přímý technický pohled do OSM obytného bloku:** https://foxey-cz.github.io/milovice-life-rp/?v=510600&streetAudit=estate-mlada-5105

- OSM pěší trasy v obytné Mladé se dosud renderovaly jako navazující rovné pásy. V ostrých či středních ohybech konce obdélníků vytvářely drobné **trojúhelníkové mezery**. Nový geometrický plánovač `scripts/osm-mlada-footway-joins-5106.js` pro tyto případy dopočítává pouze chybějící **miterový trojúhelník** v koridoru existujícího OSM `highway=footway/path`.
- V současné souborové verzi Mladé plánovač doložil **18 drobných oprav ohybů na 10 OSM pěších trasách** v okolí již vytvořeného hřiště (`way/1468803906`), a odmítl 3 kandidáty kolidující s vozovkou. Originální OSM uzly, směry, délky, šířky, povrchy, domy a terén zůstávají nezměněné. Šířky už existujících cest (cca 1,65–1,8 m) zůstávají modelové odhady.
- **Žádné Minecraftové čtvercové záplaty, nové trasy, falešné přechody ani malované zebry.** `footway=crossing` se zcela vynechává, zvlášť ty explicitně označené `crossing=unmarked` a `crossing:markings=no`. Plocha trojúhelníku je jen chybějící roh již existujícího chodníku; bezpečnostní kontrola zakazuje jeho umístění do zmapované vozovky či budovy.
- Herní renderer sčítá všechny malé trojúhelníky podle již sdíleného materiálu cest do jednoho až několika `BufferGeometry` meshů se stejnou texturou a výškou terénu (`terrainAt`). Tím nevzniká jeden draw call na každý ohyb. Původní přímé OSM pásy se nevykreslují podruhé. Jen oblast Mladá je v tomto kroku zahrnuta; fotograficky auditované staré centrum se tím nepřekresluje.
- `scripts/osm-mlada-footway-joins-5106.test.mjs` kontroluje 18 triangulací, 10 zdrojových tras, test průchodnosti, odolnost proti duplicitám regionálních dat a nulové vymyšlené cesty. WebGL test `scripts/osm-mlada-residential-webgl-5105.mjs` nyní navíc kontroluje skutečně načtenou geometrii 5.106. Diagnostika: `window.__miloviceMladaFootwayJoinAudit`.

---

## Milovice RP 5.105 — obytný blok Mladá kolem dětského hřiště (Part 22, 17. 11. 2026)

**Spustit verzi:** https://foxey-cz.github.io/milovice-life-rp/?v=510500

**Přímá technická kamera do 3D na bytové domy:** https://foxey-cz.github.io/milovice-life-rp/?v=510500&streetAudit=estate-mlada-5105

- OSM region Mladá obsahuje **22 skutečných `building=residential` půdorysů** do ~112 m od dětského hřiště [OSM way 1468803906](https://www.openstreetmap.org/way/1468803906). Všechny mají doložené **`building:levels=4` nebo `5`**. Neznámý počet bytů není vyplněn odhadem. Půdorysy, výšky terénu a stávající 3D hmoty i střechy zůstávají beze změn.
- Nový modul `scripts/osm-mlada-residential-5105.js` z počtu mapovaných podlaží odvozuje **skutečný počet vizuálních vodorovných spár** na fasádě. Oproti původnímu jedinému pásku uprostřed stěny se přechodová spára opakuje jen ve výšce hranic podlaží; stejný rastr pokračuje i přes krátké fasádní úseky.
- Svislé spáry jsou **jednou na danou polohu** mezi okny podle stabilního počtu polí. Opravené obytné bloky už nevytvářejí tutéž plnovýškovou lištu znovu uvnitř každé řady oken. U středového vstupu z mapové strany domu nezakrývá vstup generické okno přízemí.
- Stávající kreslicí systém `archPart` zachovává sdílené materiály a instancing (ne jeden draw call na lištu). Barevnost, přesné počty oken, vzhled dveří a konkrétní polohy spár **nejsou fotograficky ani geodeticky ověřené**. Model je systematická úprava vizuálního rastru podle OSM pater, nikoliv označením skutečného panelového obložení budov.
- Přímá kamera [`estate-mlada-5105`](https://foxey-cz.github.io/milovice-life-rp/?v=510500&streetAudit=estate-mlada-5105) vychází z endpointu OSM pěší trasy [1468803907](https://www.openstreetmap.org/way/1468803907) a automaticky míří na skutečný OSM půdorys pětietážového domu [891874834](https://www.openstreetmap.org/way/891874834) (`building:flats=20`). Pohled je **technický, není to fotografie**. Ve složce kontrolních pohledů přibylo jedno přímé URL (celkem 31, dosavadních 30 zachováno).
- Test `scripts/osm-mlada-residential-5105.test.mjs` ověřuje 22 zdrojových domů, poctivé 4/5 patro, rozumné rozestupy spár a ochranu vstupů. Nový Chromium WebGL test `scripts/osm-mlada-residential-webgl-5105.mjs` ověřuje skutečnou 3D kameru, načtení všech budov, instancované ozdobné spoje a ukládá screenshot. Diagnostika: `window.__miloviceMladaResidentialAudit` a `window.__miloviceMladaEstateCameraAudit`.

---

## Milovice RP 5.104 — mapované travnaté vnitrobloky v Mladé (Part 22, 17. 11. 2026)

**Spustit novou verzi:** https://foxey-cz.github.io/milovice-life-rp/?v=510400

**Pohled do 3D okolí hřiště:** https://foxey-cz.github.io/milovice-life-rp/?v=510400&streetAudit=play-mlada-5103

- V okolí čtyř existujících hřišť obytné části **Mladá** je v aktuálně uložených exportech OSM **15 označených `landuse=grass` polygonů** v dosahu. Z 14 se bezpečně umístilo **101 drobných 3D trsů trávy** o výšce přibližně 16–41 cm. Jde o původní nízkopolygonovou herní geometrii, renderovanou přes *InstancedMesh* a LOD. Tvar, rozmístění a výška jednotlivých trsů jsou **MODEL**, nikoliv skutečně zaměřená vegetace.
- Výpočet hlídá původní OSM polygon, ochrannou vzdálenost od všech dosud načtených OSM silnic a chodníků, okolí budov, vodotečí i ploch herních prvků. Nevytváří nové zmapované trávníky, nové chodníky, stromy, křoví ani nepotvrzená dětská hřiště. Nezasahuje do chráněného fotoauditu u starého nádraží a kostela.
- Ostatní geografické části včetně atrakční oblasti **Mirakulum** zůstávají v tomto kroku nedotčené. Původní mapové trasy a plochy už hra vykreslovala – neduplikujeme je dalšími překrývajícími se chodníky.
- Trsy se deterministicky generují z OSM ID travnaté plochy. Je jedno, která z překrývajících se regionálních map se načte první: stejný zdroj vytváří stejnou polohu. Sdílená třícípá geometrie se instancuje do 200m renderovacích buněk, takže jednotlivé trsy nevytvářejí vlastní draw cally.
- Diagnostika: `window.__milovicePlaygroundLawnAudit`. Nový jednotkový test `scripts/osm-playground-verges-5104.test.mjs` ověřuje 15 mapovaných a 14 vyplněných travnatých ploch, 101 bezpečně umístěných trsů, determinismus a nulový zásah do OSM půdorysů. Mobilní WebGL test hřišť rozšiřuje kontrolu o skutečně vykreslený 3D travní instancing.

---

## Milovice RP 5.103 — přímé 3D kamery na veřejná dětská hřiště (Part 22, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=510300

**Přímé mapově odvozené kamerové pohledy, nikoli fotografie:**
- [Mladá · hřiště – model skluzavky a houpačky](https://foxey-cz.github.io/milovice-life-rp/?v=510300&streetAudit=play-mlada-5103) – skutečný OSM polygon [1468803906](https://www.openstreetmap.org/way/1468803906).
- [Benátecká Vrutice · hřiště s houpačkami](https://foxey-cz.github.io/milovice-life-rp/?v=510300&streetAudit=play-vrutice-5103) – skutečný OSM polygon [1303773811](https://www.openstreetmap.org/way/1303773811) s tagem `playground=swing`.

- Původních 28 technických/fotografických pohledů zůstává dostupných. V kompaktní mobilní nabídce přibyla sedmá sekce **Dětská hřiště** se dvěma odkazy; celkem 30 kontrolních kamer.
- Technická kamera se neřídí odhadnutým azimutem z adresy: **při načtení příslušného regionu se natočí na přímo vytvořený 3D herní prvek**, z bezpečné pěší pozice uvnitř mapovaného polygonu, mimo kolizní obálky OSM cest, silnic, budov a otevřených vodotečí. Když bezpečné místo nevznikne, pohled není falešně označený jako připravený.
- Diagnostika v herní konzoli: `window.__milovicePlaygroundCameraAudit`, s cílem, polohou kamery, testem promítnutí cíle do obrazovky a výškou 1,68 m nad místním povrchem. Testy `scripts/osm-playground-equipment-5102.test.mjs` ověřují neměnné zdroje, zákazy soukromých/specializovaných atrakcí a bezpečné umístění; nový skutečný Chromium test `scripts/osm-playground-camera-webgl-5103.mjs` fotografuje obě herní scény.
- Ani jeden pohled **nedokládá přesnou skutečnou polohu, podobu či barvu herních prvků**. OSM zde dokládá hřiště a u druhého také houpačky; konstrukce, poloha a směr fotoaparátu jsou herní odhady. Změna nezasahuje do vozovek, OSM půdorysů ani terénu.

---

## Milovice RP 5.102 — veřejná dětská hřiště podle OSM (Part 22, 17. 11. 2026)

**Spustit verzi:** https://foxey-cz.github.io/milovice-life-rp/?v=510200

- Nové skutečné **3D konstrukce** na veřejných OSM plochách `leisure=playground`: modelované houpačky a skluzavky, příčky žebříků, kovové podpěry, sedátka a řetězy. Jde o původní nízkopolygonové modely v sdílených Three.js `InstancedMesh` várkách po 200 m buňkách.
- V šesti regionálních souborech bylo identifikováno **18 jedinečných mapovaných polygonů** dětských hřišť. Jen **6** z nich jsou běžné veřejné prostory vhodné pro odhadované standardní vybavení; vzniká **9 součástí hřišť** (houpaček/skluzavek). Ostatních 12, včetně soukromých ploch a konkrétních pojmenovaných atrakcí Mirakula, se nevyplňuje smyšleným běžným vybavením. Výslovný OSM `playground=swing` vytváří pouze houpačku.
- **Polygon a lokalita pocházejí z OSM. Konkrétní vybavení, jeho souřadnice, barvy a provedení NEJSOU fotograficky ověřené.** Umístění je vázané na vnitřní plochu mapovaného polygonu s bezpečnostní rezervou a kontroluje již mapované silnice, cesty, budovy i otevřené vodoteče. Staré fotograficky přezkoumané části Milovic se umělým vybavením nedoplňují.
- Nedochází ke změně původních OSM silnic, budov, mostů ani výškopisu ČÚZK. Všechny dekorace podléhají stávající hranici viditelnosti a uživatelskému nastavení výkonu. Diagnostika v konzoli: `window.__milovicePlaygroundAudit`.
- Nový test `scripts/osm-playground-equipment-5102.test.mjs` ověřuje neduplikaci regionů, původ veřejných polygonů, vyloučení Mirakula, bezpečnost poloh a shodné opakovatelné umístění.

---

## Milovice RP 5.101 — mobilní kontrolní nabídka už nezakrývá hru (Part 21, 17. 11. 2026)

**Spustit aktuální verzi:** https://foxey-cz.github.io/milovice-life-rp/?v=510100

Oprava podle uživatelského screenshotu z mobilu 17. 11. 2026: původní foto/OSM nabídka obsahovala **28 odkazů v jedné nekonečné mřížce**, po rozbalení zabírala celý výhled a dlouhé staré názvy jako „Šest uličních bloků · Školská jihovýchod 5.90“ matly uživatele.

- **6 tematických sekcí**: Ulice a fotografie (18), Chodníky (2), Voda (2), Lesy (2), Sportoviště (2), Osvětlení (2). **Žádný z 28 kontrolních odkazů se neodstraňuje**.
- Mobilní panel je při prvním otevření **sbalený**, ponechává stručný aktuální název, jedno tlačítko „Zobrazit kategorie“ a nejvýše 2 sousední kontrolní odkazy. Současné místo je i nadále dostupné po přechodu na jinou kategorii.
- Po rozbalení se otevře právě kategorie aktuální kamery, ostatní jsou zavřené; přes „Zobrazit všechny sekce“ se mohou rozbalit všechny. Aktivní odkaz je označen pomocí `aria-current=page`, ikonou a zvýrazněním.
- **Maximální výška 58 % výšky displeje** (dále omezena na 540 px), vnitřní scroll a zkrácené popisky řeší přesně přerostlou mobilní nabídku. Přístupné ovládání pomocí `<details>` a `<summary>`, větší dotykové plochy.
- Původní mapová/provenienční metadata, zdrojové odkazy, přímé URL kamery i geometrie 3D scény zůstávají beze změn. Oprava nevyžaduje další efekty ani 3D geometrii.
- Jednotkový test `scripts/street-audit-menu-5101.test.mjs` zachovává všech 28 ID, správné sekce a synchronizaci označení verze. Nový skutečný prohlížečový test `scripts/street-audit-menu-webgl-5101.mjs` kontroluje rozbalování na mobilu, výšku panelu, aktivní sekci a funkčnost „Zobrazit všechny sekce“ v Chromiu.

---

## Milovice RP 5.100 — veřejné osvětlení jen u OSM lit=yes ulic (Part 21, 17. 11. 2026)

**Aktuální verze:** https://foxey-cz.github.io/milovice-life-rp/?v=510000

**Přímé technické kamery do hry (nejde o fotografii skutečných lamp):**
- [Mladá, Italská — osvětlení ulice](https://foxey-cz.github.io/milovice-life-rp/?v=510000&streetAudit=lit-italska-5100), OSM way 8585601
- [Benátecká Vrutice, Armádní — osvětlení ulice](https://foxey-cz.github.io/milovice-life-rp/?v=510000&streetAudit=lit-armadni-5100), OSM way 304756364

- Z šesti původních regionálních OSM datasetů bylo identifikováno **57 unikátních pojmenovaných úseků** vozovky typu `residential/tertiary/unclassified` s výslovným `lit=yes` (celkem zhruba 7,2 km centerline). `lit=no`, chybějící/neurčitá hodnota, servisní příjezd, pěší cesta, soukromá cesta a mosty jsou z tohoto návrhu vyloučené.
- `lit=yes` **dokládá osvětlení komunikace, nikoli rozmístění nebo podobu konkrétních sloupů.** Nové 3D lampy jsou tedy jednoznačně označeny jako odhady, které budeme později upravovat podle fotografií. Původní historicky fotograficky prověřené zóny u nádraží, kostela a 5. května zůstávají bez libovolně domyšlených lamp.
- Dávkově vykreslené **jednoduché sloupy, krátká ramena a světelné hlavice** znovu používají existující sdílené materiály a Three.js InstancedMesh po 200m buňkách. Běžné 3D světlo bez nových PointLight zdrojů minimalizuje dopad na mobilní GPU. Přesné výšky 5,8 m a rozestupy okolo 42 m jsou herní předpoklady, ne průzkum reality.
- Každá navržená poloha je kontrolována oproti **všem mapovaným silnicím, chodníkům, půdorysům domů a viditelným vodotečím**. Pokud bezpečné místo u silnice není, sloup nevznikne. Nepřesouvají se domy, silnice, dopravní pásy ani terén; nevznikají nedoložené chodníky nebo billboardy.
- Původní náhodné objekty v celé mapě zůstávají vypnuté (`randomRoadLamps:0`). Nový explicitně zdrojově omezený systém má samostatnou diagnostiku `window.__miloviceStreetLightingAudit`, včetně počtů sloupů, OSM ID a příčin vynechání. Přímé kamery dle OSM cesty vyhledají existující modelovaný sloup, nikoliv přednastavený prázdný horizont.
- Regresní test `scripts/osm-street-lighting-5100.test.mjs` ověřuje 57 existujících OSM zdrojových úseků, ochranu před kolizemi a opakovatelný plán. Připravena je i následná automatická kontrola 3D vykreslení na mobilu.

---

## Milovice RP 5.99 — sportovní hřiště podle skutečných OSM značek (Part 21, 17. 11. 2026)

**Spustit:** https://foxey-cz.github.io/milovice-life-rp/?v=59900

**Kontrolní kamery (technické, nejsou to fotografie):**
- [Mladá — tenisové kurty, OSM way 612386900](https://foxey-cz.github.io/milovice-life-rp/?v=59900&streetAudit=pitch-tennis-599)
- [Mladá — multifunkční hřiště, OSM way 1327246355](https://foxey-cz.github.io/milovice-life-rp/?v=59900&streetAudit=pitch-multi-599)

- V pěti dostupných regionálních OSM exportech je **20 jedinečných `leisure=pitch` ploch**. Jen **8** má výslovně známý a podporovaný sport (4× tenis, 2× fotbal, 1× basketbal, 1× basketbal + futsal). Na zbývajících 12 plochách zůstává pouze podložený obrys, nevymýšlí se sport ani vybavení.
- Povrchy se nově rozlišují podle zdrojové OSM značky `surface=*`: tři antukové tenisové plochy z oranžové hmoty, multifunkční hřiště z tmavého asfaltu, fotbalová tráva a další deklarované typy. Pokud povrch není zaznamenaný, ponechává se starý výchozí vzhled, který **není potvrzením reálné barvy**.
- Na označených hřištích se vykreslí přehledné čáry (tenis, basketbal, fotbal). **Orientační značení, jeho rozměry, barva i orientace jsou modelové odhady**, nejsou potvrzené fotografiemi. Nevznikají žádné nedoložené branky, koše, sítě, ploty nebo šatny.
- Nové čáry se umisťují pouze dovnitř původních OSM polygonů, následují DMR terén a zachovávají dřívější počet vykreslovacích skupin: ve stejné dávce je obrys i vnitřní značení. Díky dělení podle materiálu se antuka nemíchá s asfaltem v jednom Mesh.
- Dvě přímé kamery po načtení čtvrti zaujmou pozici vypočtenou z obrysu skutečného hřiště a shora míří na jeho střed. Diagnostika `window.__miloviceSportPitchAudit` a `window.__miloviceSportPitchCameraAudit` umožňuje kontrolovat počty a viditelnost. Testy kontrolují 20 konkrétních OSM way, barvy, bezpečné čáry a absenci smyšleného vybavení.
- Původní úpravy nádraží, ulic, lesů a vody ani celkové městské rozměry se nemění. Reálné FPS na konkrétním mobilu je potřeba zkontrolovat v zařízení.

---

## Milovice RP 5.98 — skutečný les v kontrolní kameře (Part 21, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=59800

**Opravené kontrolní pohledy:**
- [Juventský les, Mladá](https://foxey-cz.github.io/milovice-life-rp/?v=59800&streetAudit=forest-mlada-597)
- [Mapovaný les, Boží Dar](https://foxey-cz.github.io/milovice-life-rp/?v=59800&streetAudit=forest-bozidar-597)

- Uživatelský mobilní screenshot 17. 11. 2026 ukázal pouze prázdný horizont. Příčina: kamera z 5.97 byla na aritmetickém průměru **hraničních OSM uzlů**, který v nepravidelném polygonu Juventského lesa (way 26023867) leží mimo samotný les. Zdrojová oblast už přitom obsahovala skutečně vykreslených 34 modelovaných stromů.
- Kamera se nyní po načtení odpovídající oblasti přemístí **dovnitř OSM lesního polygonu**, mimo mapované silnice/budovy/vodní povrchy, tak, aby v dohledu měla jeden či více skutečně instancovaných modelových stromů. Výška se opakovaně aktualizuje podle DMR dané oblasti.
- Původní velký a nesprávně zastaralý nadpis „Šest uličních bloků · Školská jihovýchod 5.90“ se v režimu lesních a vodních kamer změní na smysluplný popis.
- Jedná se o **technické herní kamery**, nikoli fotografie nebo přesnou polohu konkrétních živých stromů. OSM polygon, veřejné silnice a terén se nemění.
- Přidán jednotkový test kontrolující původní bod mimo les a nově bezpečnou kameru uvnitř. Samostatný Playwright/Chromium mobilní test ověřuje i to, že skutečně vykreslená koruna stromu je v záběru a herní kamera je 1,68 m nad místním DEM. Screenshot testu se ukládá do GitHub Actions.

---

## Milovice RP 5.97 — stálá a bezpečná zeleň napříč ulicemi (Part 21, 17. 11. 2026)

**Aktuální hra:** https://foxey-cz.github.io/milovice-life-rp/?v=59700

**Technické herní kamery (ne autentické fotografie):**
- [Mladá — Juventský les, OSM way 26023867](https://foxey-cz.github.io/milovice-life-rp/?v=59700&streetAudit=forest-mlada-597)
- [Boží Dar — lesní polygon OSM way 32065394](https://foxey-cz.github.io/milovice-life-rp/?v=59700&streetAudit=forest-bozidar-597)

- Stabilní rozložení odhadovaných 3D stromů uvnitř **existujících mapovaných lesů a parků**. Každý OSM půdorys má vlastní pevný seed, takže pořadí načítání čtvrtí již nepřehazuje souřadnice stromů. Nepřidávají se žádné nové lesy ani parky, a jednotlivé stromy **nejsou fotograficky nebo geodeticky ověřené**.
- 5 originálních OSM regionálních exportů obsahuje **18 jedinečných polygonů lesa/parku** (17 lesů, 1 park). Každý může mít nejvýše 34 instancí a stávající celoměstský limit 620 stromů zůstává. V rámci stávajících exportů je tedy teoretické maximum **612**, skutečný počet je menší podle plochy a kolizí.
- Pravidla bezpečnosti výsadby kontrolují skutečná OSM silniční a pěší spojení, půdorysy budov a otevřené vodní trasy. Podzemní vodoteče se neberou jako povrchová překážka. Soukromé OSM zelené plochy se při explicitním `access=private/no` neosazují odhadovanými stromy.
- Výsledný vzhled nadále používá původní **3 typy instancovaných částí stromů a sdílené materiály**. Nová geometrie silnic, dveří, domů ani OSM polygonů nevzniká, nezavádí se fyzika stromů.
- Diagnostika ve hře: `window.__miloviceGreenTreeAudit` obsahuje počty skutečně vytvořených instancí a Meshů, unikátní mapové ID a zamítnutí kvůli silnicím, budovám či vodě. Automatické testy `scripts/forest-placement-597.test.mjs` ověřují shodné výstupy bez ohledu na pořadí regionů, opakovaná ID, příklady kolizí a skutečných 18 polygonů. Test je přidaný do GitHub Actions.
- **Ověření výkonu:** stávající limit instancí a 200m vykreslovací dávky se nemění; skutečné FPS na cílovém mobilu musí potvrdit prohlížeč, nikoliv pouze unit test.

---

## Milovice RP 5.96 — mapované potoky a otevřená odvodnění (Part 21, 17. 11. 2026)

**Spustit hru:** https://foxey-cz.github.io/milovice-life-rp/?v=59600

**Technické kamery přímo na vodních trasách:**
- [Mlynařice — herní kamera](https://foxey-cz.github.io/milovice-life-rp/?v=59600&streetAudit=water-mlynarice-596) (OSM way 82222748, GPS 50.2233738 / 14.8887585).
- [Svodnice od Benátecké Vrutice — herní kamera](https://foxey-cz.github.io/milovice-life-rp/?v=59600&streetAudit=water-svodnice-596) (OSM way 1547734545, GPS 50.2312589 / 14.8488875).

- Předchozí systém vykresloval silnice, stezky, OSM budovy a zeleň, ale **ignoroval mapované vodní cesty**. Nový modul `scripts/osm-waterways.js` přidává pouze existující OSM `waterway=stream/drain/ditch/river`, bez vymyšlených vodotečí. Ze zdrojových regionálních exportů bylo nalezeno **11 jedinečných vodních ways**, z toho **7 neoznačených jako podzemní/sezónní** a **4 podzemní či zakryté**. Čísla jsou inventář zdrojových dat, nikoli potvrzení aktuálního stavu vody v terénu.
- `tunnel=culvert`, záporný `layer`, `covered=yes` či `location=underground` se nevykreslují. Linie se ořezávají k hranici načtené oblasti (+180 m), takže několik kilometrů vzdálený kus OSM way nezatěžuje mobil při načtení Mladé. Přes explicitní komunikace, pěšiny a půdorysy budov se vodní povrch nekreslí.
- Mapová linie toku je doložená, **šířka a výška viditelného plochého modelu jsou však vizuální odhady**, nikoli změřené břehy, koryta či hladina. Podklady DIBAVOD/OSM netvrdí, že v roce 2026 všude fyzicky proudí voda. Řešení nepředělává terén ani nevytváří mosty. Zatím jde o stylizovaný vodní pás, který bude potřeba porovnat s veřejnými fotografiemi.
- Jeden znovupoužitý sdílený materiál pro vodní trasy, existující dávkové `osmStrip` slučování po 160 m; bez kopírování textur, bez další simulace částic a bez zásahu do NPC dopravy. Diagnostika `window.__miloviceMappedWaterways` obsahuje skutečně vykreslené metry a počty načtených oblastí.
- Automatický test `scripts/osm-waterways.test.mjs` ověřuje podzemní výluky, ořezávání, zdrojové IDs, silnice, stezky, budovy, herní propojení i synchronizaci build čísla. Je připojen do validačního workflow. Skutečné vizuální vykreslení a mobilní FPS se musí teprve ověřit v prohlížeči.

---

## Milovice RP 5.95 — OSM doložené jednostranné chodníky bez kolizí (17. 11. 2026)

**Aktuální hra:** https://foxey-cz.github.io/milovice-life-rp/?v=59500

**Přímé technické záběry do hry:**
- [Armádní · mapovaný chodník vlevo](https://foxey-cz.github.io/milovice-life-rp/?v=59500&streetAudit=armadni-sidewalk-595) — OSM way 1395041609, souřadnice 50.2310945, 14.8510071, směr podle OSM 119,8°.
- [Topolová · mapovaný chodník vpravo](https://foxey-cz.github.io/milovice-life-rp/?v=59500&streetAudit=topolova-sidewalk-595) — OSM way 309581823, souřadnice 50.2326139, 14.8449130, směr podle OSM 195,47°.

Jde o **technické herní kamery**, nikoli o autentické snímky Mapy Panorama. OSM říká, na které straně komunikace je chodník, **neříká však přesnou polohu obrubníku, šířku ani stav povrchu**.

- Nová logika `scripts/osm-tagged-sidewalk.js` pracuje výhradně s OSM komunikacemi výslovně označenými `sidewalk=left`, `sidewalk=right` či `both`. Nevytváří žádný chodník pro `sidewalk=separate`, `no`, chybějící značku, soukromé cesty ani dálnice. Staré souvislé chodníky, historická nádražní geometrie a reálné OSM silnice se nepřepisují.
- V dodaných exportech v Mladé a Benátecké Vrutici byly identifikovány **tři unikátní zdrojové silnice**: Armádní (1395041608 a 1395041609) a Topolová (309581823). Jejich celková délka je cca 445 m; po **striktním vynechání kolizních úseků** vzniká cca **429,75 m nového chodníkového povrchu v sedmi bezpečných dílech** (Armádní 339,29 m, Topolová 90,46 m). Jsou to plánovací hodnoty vypočtené z aktuálních OSM dat, nikoliv měření skutečného nasazení či fotoověření.
- Zvolená modelová šířka chodníku 1,55 m a mezera od vozovky 0,34 m jsou **odhady**. Směr vlevo/vpravo respektuje pořadí uzlů OSM way, včetně obráceného směru. Kontroluje se **všechny aktuálně zmapované vozovky a pěší cesty** i samostatný prostorový index **skutečných OSM půdorysů budov**. Chodníkový pás se v kolizích a na křižovatkách bezpečně přeruší a příliš krátké úlomky se odmítají.
- Všechny nové pásy používají **existující dlažební materiál** a dosavadní slučování geometrie v 160m dávkách. Žádné nové materiály, neznámé ploty, lampy, stromy ani vymyšlené silnice. Při opětovném sestavení města se indexy komunikací, budov a diagnostika vymažou.
- Kontrola v prohlížeči: `window.__miloviceMappedSidewalkAudit` se skutečně vygenerovanými délkami, počty úseků, zdrojovými ID a oblastmi. Počty závisejí na tom, jaké mapové oblasti už hráč načetl.
- Automatické regresní testy: `scripts/osm-tagged-sidewalk.test.mjs` (syntetické strany, reverzní pořadí OSM way, existující souběžný chodník, křižovatky, budovy, přenačtení a reálné GPS podklady), a rozšířený `scripts/city-region-street-audit.test.mjs` (5 konkrétních kamer). Nový test je vložen do `.github/workflows/validate.yml`.

**Ověření:** funkční geometrické testy prošly v izolovaném prostředí nad daty z repozitáře; kompletní běh GitHub Actions, skutečná WebGL vizualizace na Androidu a FPS se musejí ověřit na nasazené stránce.

---

## Milovice RP 5.94 — skutečně mapované povrchy ulic, chodníků a polních cest (17. 11. 2026)

**Aktuální hra:** https://foxey-cz.github.io/milovice-life-rp/?v=59400

### Rozsah a přesnost

- Pro každou načtenou **existující** OSM cestu se nyní vyhodnocuje její `surface=*` z původního exportu. Vizuální klasifikátor `scripts/osm-road-surfaces.js` rozlišuje asfalt, dlažbu/beton, štěrkové povrchy, hlínu/písek a travnaté pěšiny. Jestliže povrch chybí či je neurčitý (např. `paved`), zůstává dosavadní herní materiál. Skutečné barvy, rozmístění dlažebních kostek, stav vozovky a stáří povrchu **nejsou fotograficky doložené**.
- **Zmapované polní a lesní komunikace** `highway=track` se konečně vykreslují jako úzké 3,2m povrchové pruhy. Tato šířka je herní aproximace, nikoli geodetické zaměření. Mapované trasy se **nevymýšlejí** a neotevírají novou trasu pro automatickou NPC dopravu. Výjimky povrchu z OSM mají přednost; neznámý povrch takové cesty je označený jako herní neutrální odhad.
- Bez změn půdorysů, souřadnic silnic a pěšin, vzorkování výškopisu, asfaltového UV mapování 7m nebo originálních chodníků a parkoviště před nádražím. Zúžení platí **jen** pro dosud nevykreslovaný typ `highway=track`; ostatním komunikacím se šířka nemění.
- Znovupoužité materiály z existující sady procedurálních textur: **pouze tři nové sdílené materiály**, žádná textura per-road, žádné stažené fotografie. Původní 160m batch slučování terénních pruhů zůstává.
- Statistika nad zdrojovými daty po odstranění opakujících se OSM ID ze šesti exportů: **395 jedinečných OSM cest s explicitním tagem `surface`**, z toho 199 klasifikovaných jako asfalt, 79 jako dlažba a 23 jako zemina (počty materiálových skupin zahrnují i určitá náhradní zobrazení). Dále **100 jedinečných mapovaných `highway=track`**; nejde o počet skutečně viditelných úseků při jednom načtení hry.
- Herní diagnostika: `window.__miloviceOSMSurfaceAudit` ukazuje skutečné zpracované OSM cesty, skupiny materiálů a vykreslené úseky dle aktuálně načtených regionů. Hlídaná regenerace scén obnoví počítadla, aniž by násobila historii.
- Automatické testy `scripts/osm-road-surfaces.test.mjs`, `scripts/road-asphalt-world-uv-5813.test.mjs`, `scripts/reality-walkways.test.mjs`. Nový test povrchů je zahrnut do `.github/workflows/validate.yml`. Dřívější test asfaltu už není chybně navázaný na staré build ID 5.91.

**Poznámka k výkonu:** materiály jsou sdílené a všechny OSM trasy zůstávají v dosavadním mechanismu vykreslování po dávkách. Reálný dopad na FPS ani skutečné nasazení GitHub Pages zatím není měřené v cílovém prohlížeči.

---

## Milovice RP 5.93 — sjednocení všech pěti regionálních oblastí a technické uliční kamery (17. 11. 2026)

**Spustit aktuální verzi:** https://foxey-cz.github.io/milovice-life-rp/?v=59300

**Přímé OSM kontrolní pohledy:**
- [Tyršova – západní propojení](https://foxey-cz.github.io/milovice-life-rp/?v=59300&streetAudit=tyrsova-west-593) · OSM way 202373467, GPS 50.2311495 / 14.8603708, technický směr cca 51,6°
- [Ostravská – severní propojení](https://foxey-cz.github.io/milovice-life-rp/?v=59300&streetAudit=ostravska-north-593) · OSM way 1463667018, GPS 50.2307917 / 14.8927489, technický směr cca 104,3°
- [Boží Dar – Krátká](https://foxey-cz.github.io/milovice-life-rp/?v=59300&streetAudit=bozidar-kratka-593) · OSM way 38900193, GPS 50.2482106 / 14.9171042, technický směr cca 132,3°

Tyto kamery leží přímo na doložených OSM osách ulic. **Nejsou to fotografické ani Panorama záběry.** Základní 3D mapa si při jejich otevření přednostně načte potřebnou regionální oblast, i když se její bounding box překrývá s jinou.

- Automatické rozložení výtvarně **odhadovaných** odstínů fasád, střešních materiálů, rytmu oken a nenápadných přízemních soklů nyní zahrnuje všech pět stávajících regionů: Mladá, Benátecká Vrutice, západní propojení, severní/střední propojení a Boží Dar. Původní historické jádro, přesné OSM půdorysy a předchozí fotograficky zpracované objekty zůstávají chráněné. Nejsou přidány nové silnice, budovy, vjezdy ani fotoověřená tvrzení.
- Regresní kontrola nad zdrojovými exporty našla **2 298 regionálních výskytů vhodných stavebních půdorysů**, ale tyto soubory se geograficky překrývají: jde o **1 291 jedinečných OSM ID** napříč pěti regiony a **1 039 dosud neviděných vhodných ID oproti původní základní mapě**. To jsou počty kandidátů v datech, nikoliv přesný počet viditelných či detailních modelů po aplikování všech herních omezení.
- Nová diagnostika `window.__miloviceRegionDedup` měří přeskočená duplicitní OSM ID včetně budov, `window.__miloviceRegionalBuildingPass` ukazuje skutečně stylované budovy při vykreslení. Full reload navíc resetuje prostorový index veřejných komunikací i statistiky, aby se hodnoty nenasčítávaly opakovaně.
- **Výkon:** stávajících 8 omítkových, 7 panelových a 5 střešních materiálových variant, bez dalších typů materiálu; stejný limit 68 detailních obytných modelů. Nové sokly jsou instancované v již existujícím rozpočtu. Skutečné FPS a čas přechodu oblastmi na cílovém mobilu/PC nebyly změřeny.
- **Kontroly:** `scripts/regional-residential-style.test.mjs` pro všech pět OSM souborů, `scripts/city-region-street-audit.test.mjs` pro polohu, osu ulice a přednost načítání, `scripts/city-region-overlap.test.mjs` pro duplicity a reset. Nové regresní testy jsou součástí `.github/workflows/validate.yml`.

---

## Milovice RP 5.92 — hromadné obytné ulice v Mladé a Benátecké Vrutici (17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=59200

- Nový modul `scripts/regional-residential-style.js` uplatňuje jednotná pravidla na běžné OSM domy při načtení regionů **Mladá** a **Benátecká Vrutice**. Nejvyšší prioritou zůstávají skutečné OSM půdorysy a již doložené modely. Není přidána žádná budova ani silnice.
- **Fasády** běžných domů a bytových domů vybírají odstín z již existujících osmi omítkových a sedmi panelových materiálů **stabilně podle OSM ID**, nikoli podle pořadí streamování. Jejich rozestupy generických oken jsou mírně odstupňované, aby se nekopíroval identický rytmus na všech domech. Jde o výtvarné odhady, ne nově ověřená okna.
- **Střechy:** pět původních materiálů se vybírá stabilně podle OSM ID; jen pokud OSM explicitně obsahuje `roof:shape` (například `flat`), má tento údaj přednost. Většina zdejších OSM objektů tvar střechy **nemá zmapovaný**, proto se nepředstírá skutečná orientace hřebene ani nevyrábějí nové komíny. Dosavadní bezpečné řešení sklonu a kontrola napojení zůstávají.
- **Uliční přízemí:** u vhodných menších rodinných domů vznikne nízký sokl z existující sdílené instancované geometrie. V místě bezpečně odhadnutého uličního vstupu se přesně na skutečné stěně přeruší, aby nezakrýval práh. Domy bez spolehlivé uliční strany zůstávají bez vymyšleného vchodu.
- **Rozpočet výkonu:** bez nového typu materiálu a bez navýšení limitu 68 detailních domů. Nové soklové segmenty využívají již existující `foundationBand` instancing po 160m blocích. Dodatečná skutečná GPU zátěž / FPS se musí změřit v prohlížeči.
- Ověření plánovače na originálních regionálních exportech: **886 vhodných OSM půdorysů v Mladé**, **467 v Benátecké Vrutici**, z nich **452 + 236** splňuje podmínky pro odhadovaný sokl. Nejde o počet definitivně upravených fotoověřených domů: herní vykreslování nadále vynechává výslovně chráněné historické objekty.
- Diagnostika po streamování: `window.__miloviceRegionalBuildingPass`. Test: `scripts/regional-residential-style.test.mjs`, včetně ochrany historických fotomodelů, stálého výběru materiálů a přerušení soklu u dveří.
- Důležité: základní mapované silnice, chodníky a veřejná zeleň (5.91) se nemění. Je to práce na **celých obytných koridorech**, nikoli tvrzení, že každé okno, barva či střecha je doložena fotografií.

---

## Milovice RP — Part 20: uliční orientace běžných OSM domů (17. 11. 2026)

**Nový build webu:** https://foxey-cz.github.io/milovice-life-rp/?v=59102

- **V celé mapě:** běžné, fotograficky nedoložené budovy už automaticky nedostávají provizorní dveře na nejdelší zeď, která často mířila do zahrady. Modul `scripts/street-frontage-index.js` hledá skutečnou vnější stěnu orientovanou na **existující veřejnou OSM silnici**. Určuje stranu, ne skutečnou polohu historických dveří.
- Rychlý prostorový index po 96m blocích omezuje práci při průběžném načítání dalších čtvrtí. Soukromé komunikace, parkovací uličky a příjezdové cesty nejsou veřejným podkladem pro vymyšlení nové brány.
- Značení `inferred:true`, `photographicallyVerified:false` je záměrné; pokud vhodná silnice chybí, nevytvoří se vchod naslepo. Původní doložené vchody školy a speciální fotografické modely zůstávají nezměněné.
- Reálné OSM zkoušky na obytných půdorysech s platným rozměrem: **Mladá 739/887 (83 %)**, **Benátecká Vrutice 373/467 (80 %)** mají použitelnou ulici podle geometrie. Zbývající stavby nejsou prohlášeny za chybu ani za zmapované skutečné vchody. Tato čísla jsou pokrytí plánovače na izolovaném regionálním exportu, nikoliv počet viditelných dveří po spuštění celé hry.
- Diagnostika ve hře: `window.__miloviceStreetFronts` (počty analyzovaných a vybraných běžných vchodů a rozsah prostorového indexu).
- Kontrolní soubor `scripts/street-frontage-index.test.mjs` porovnává oba skutečné regionální exporty i obrácené OSM pořadí uzlů, soukromý přístup a orientaci stěny. Konkrétní fotografie jednotlivých domů a přesné umístění dveří jsou nadále otevřená témata.

---

## Milovice RP 5.91 — plynulejší přechody mezi městskými oblastmi (Part 20, 17. 11. 2026)

**Spustit aktualizovaný web:** https://foxey-cz.github.io/milovice-life-rp/?v=59101

- Na cestě mezi oblastmi se nyní může s předstihem stáhnout **jedna nejbližší dosud nenačtená oblast** v dosahu 1 140 m od jejího OSM obdélníku (620m standardní dohled + 520m rezervy). Dosavadní skutečné sestavení 3D oblasti proběhne na původní hranici 860 m; k vykreslování mimo dohled nedochází.
- Přednačtené soubory **OSM budov/cest/zeleně a oficiálního výškového rastru ČÚZK DMR 4G** se při vstupu do oblasti použijí znovu, bez druhého síťového stahování. Soubory i jejich kontroly integrity zůstávají stejné.
- Omezena paměť mobilních zařízení: nanejvýš jedna spekulativní oblast, při změně směru se nepotřebná uvolní a neúspěšný požadavek neblokuje další pokus. Diagnostika je v `window.__miloviceAreaPrefetch` a `window.__miloviceRegionHandoff`.
- Kontrola průběhu: `scripts/city-region-prefetch.test.mjs` ověřuje duplicitní načítání, opětovné použití dat, chybové stavy a podmínky přechodu. Příprava oblasti nesmí vytvářet nové domy ani měnit jejich polohy.
- Toto je **optimalizace stávajících šesti oblastí**, nikoliv nová sada fotograficky ověřených domů. FPS ani konkrétní čas načtení zatím nebyly změřeny na cílovém telefonu.

---

## Milovice RP 5.91 — celé město: podklady zeleně a hřišť (17. 11. 2026)

**Spustit:** https://foxey-cz.github.io/milovice-life-rp/?v=59100

Priorita se přesouvá od ručního porovnávání jednotlivých fasád k **celoměstské uliční a krajinné mapě**. Ponechali jsme dokumentovaných 68 detailnějších obytných modelů bez dalšího navýšení rozpočtu, ale nadále máme skutečné OSM půdorysy běžných domů ve všech pěti dalších částech města.

- Nový modul `planCityLanduseBatches / addCityLanduseBatches` v `scripts/landscapes.js`: zachovává **původní OSM půdorysy travnatých ploch, parků, lesů, dětských hřišť a sportovišť**, ale kombinuje stejné materiály v geografických blocích po 180 metrech. Velké lesy zůstávají samostatně, aby se jejich vzdálené části neztrácely při vykreslování.
- Inventář pěti regionálních OSM souborů: **263 mapovaných polygonů** (Mladá 91, Benátecká Vrutice 64, západní propojení 86, střední propojení 12, Boží Dar 10); v původním režimu by vyžadovaly přibližně **299 samostatných draw calls** včetně čar hřišť, nově se plánují do **nejvýše 125 dávkových draw calls** při postupném načtení všech regionů. To je plánovací horní hranice, nikoliv změřené FPS konkrétního telefonu.
- Jsou to existující plochy z mapových dat, nikoli namalované nové parky, stromy nebo soukromé zahrady. Fotografie ani Panorama nejsou vyžadovány a nedochází k vymyšlenému označování ověřených detailů.
- Při načtení regionů publikuje `window.__miloviceCityGreenBatch` skutečný počet polygonů, vygenerovaných meshů a ušetřených vykreslovacích volání. `scripts/city-landscape-batch.test.mjs` prochází všechny pět oblastí, kontroluje jednoznačná OSM ID, přesné souřadnice polygonů, deterministické rozdělení do bloků a celoměstskou úsporu.

**Další etapa:** průběžné načítání dalších ulic a budov při pohybu městem, bez nutnosti řešit každou fasádu z Panoramy.

---

### Oprava 5.90.1 — streamování Mladé (17. 11. 2026)

- Přidána jednorázová inicializace 68 prioritních obytných fasád. Překrývající se region Mladá nyní **nesmí opakovaně registrovat ID fotografovaného štítu `202298939`** při každém streamování dalších OSM souborů. Starší verze v této situaci volala `setPhotoFocusIds()` až po vykreslení budov, což vyvolalo výjimku.
- Při opětovném načtení celé mapy se resetuje i nová zeleň Školské 5.90 a diagnostiky obou nových východních bloků.
- Globální limit 68 detailních domů se nemění, ostatní obytné domy zůstávají standardně vykreslené.

---

## Školská jihovýchod 5.90 — šestý obytný úsek (17. 11. 2026)

**Přímý technický úhel z ulice:** https://foxey-cz.github.io/milovice-life-rp/?v=59000&streetAudit=skolska-tail-590  
**Celá hra:** https://foxey-cz.github.io/milovice-life-rp/?v=59000

- Sedm dalších reálných OSM domů podél pokračování Školské (way `1331897645`): `539003529`, `202389206`, `202389205`, `469368736`, `202389176`, `539003536` a `202389202`. Nejde o nově vymyšlené stavební parcely. Ostatní městské budovy zůstávají v základní renderované vrstvě.
- Součet priorit: 20 kostelní blok + 12 Mírová + 12 Školská u školy + 8 Školská západ + 8 Školská východ + 7 Školská jihovýchod + 1 dříve fotograficky doložený štít = **68**. Mobilní limit počtu detailních modelů se nezvýšil; původních sedm generických detailních míst se přesunulo k souvislému uličnímu úseku. Starší přednostní bloky se nezměnily.
- OSM kamera `50.2271629, 14.8899405` má odhadovaný azimut **126° podle geometrie silnice**. Je to skutečná herní kamera v úrovni očí, ne náhrada doloženého fotografického úhlu.
- Nová dávkovaná uliční zeleň `scripts/skolska-tail-street-590.js`: kandidátní keře/stromy kontrolované vůči půdorysům budov a povrchům komunikací včetně chodníků. Nejvýše čtyři InstancedMesh draw calls. Rozmístění rostlin je **výtvarný odhad**, nikoliv přesná poloha podle fotografie.
- Kontextová veřejná fotografie [ZŠ T. G. Masaryka](https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg) (ŠJů, 30. 5. 2024, CC BY 4.0) zachycuje **jiný úsek Školské**, nikoli všechny zdejší domy a stromy. Modely neoznačujeme za fotograficky ověřené.
- Žádné nové OSM cesty, přechody, soukromé vjezdy ani nepodložené ploty. Testy kontrolují stabilitu výběru, silniční clearance, rozpočet 68 detailních domů, skutečné WebGL objekty a kamerový úhel.

---

## Školská východ 5.89 — pátý obytný blok (2026-11-17)

**Přímá OSM kamera od Pionýrů:** https://foxey-cz.github.io/milovice-life-rp/?v=58900&streetAudit=skolska-east-589  
**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=58900

- Osm nových OSM-půdorysů obytných domů podél Školské východně od Pionýrů (ways `1331897643` a `1331897644`). Půdorysy, ulice, chodníky a školní budova zůstávají v původní mapové geometrii.
- Kontextová veřejná fotografie [ZŠ T. G. Masaryka](https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg), ŠJů, 30. 5. 2024, CC BY 4.0. Neprokazuje vzhled všech sousedních soukromých domů; jejich obecné fasády jsou **odhady**, nikoliv fotograficky ověřený stav.
- Nový přímý kontrolní pohled na skutečném uzlu OSM `50.2280951, 14.8875431` směřuje přibližně k východu pod azimutem 119° podle osy ulice. **Není to úhel veřejné fotografie** a hra jej tak označuje.
- Nové kapacitní rozdělení přesně 68 detailních obytných budov: kostelní blok 20, Mírová 12, Školská u školy 12, Školská západ 8, Školská východ 8, již fotograficky doložený štít 1, zbývající městské domy 7. Předchozí fotobloky zůstaly vyhrazené.
- Žádné umělé parcely, ploty, vjezdy, lampy ani přechody. Další inventář celé ulice musí být veden jako vizuální odhad, dokud nebude fotograficky nebo mapově doložen.

---

## Školská západ 5.88 — čtvrtý uliční blok (2026-11-17)

**Přímá kamera — Školská 220/1:** https://foxey-cz.github.io/milovice-life-rp/?v=58800&streetAudit=skolska-west-2024  
**Hra v plném městě:** https://foxey-cz.github.io/milovice-life-rp/?v=58800

- **8 nových prioritních OSM obytných domů** podél západní části Školské (ways `22880480`, `1331897639`), přičemž dříve fotograficky vyřešený dům `202298939` zůstává vyhrazený a není přepsán obecným modelem.
- Veřejný zdroj: [Školská 220/1](https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg) (ŠJů, CC BY 4.0; souřadnice fotoaparátu 50.2290672, 14.8822619) a [Školská × 5. května](https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_a_5._kv%C4%9Btna.jpg). Přednastavená kamera se dívá přibližně pod azimutem **57° podle OSM středu domu**, což **není** ověřený úhel původního snímku. Herní panel tento rozdíl výslovně označuje.
- **Nová uliční zeleň:** `scripts/skolska-west-street-588.js` navrhuje dávkově nízké keře a stromy s kontrolou celých půdorysů vůči OSM budovám i silnicím/chodníkům; nejvýše 4 instancované draw calls. Přesné polohy jsou **výtvarné odhady**, ne fotograficky zaměřené výsadby.
- Fixní globální limit **68 detailních obytných budov:** 20 kostelní blok + 12 Mírová + 12 východní Školská + 8 západní Školská + 1 dříve dokumentovaný štít `202298939` + 15 ostatních domů. Kontrola `hero-architecture.js` navíc zastaví jakýkoli pokus o další detailní dům nad limit.
- Žádné nové OSM půdorysy, předstírané silnice, přechody, soukromé vjezdy nebo pozemkové hranice. Porovnávací testy v `scripts/street-mass-build-pass.test.mjs` a `scripts/street-block-webgl.mjs` měří skutečný stav a rozdělení budov.

---

## Školská 5.87 — třetí uliční blok, 12 nových OSM domů (16. 11. 2026)

**Přímý fotoúhel školy:** https://foxey-cz.github.io/milovice-life-rp/?v=58700&streetAudit=school-2024  
**Druhý veřejný úhel:** https://foxey-cz.github.io/milovice-life-rp/?v=58700&streetAudit=school-detail-2024

- Fotografie: [ZŠ T. G. Masaryka, snímek (01)](https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg), poloha kamery **50.2286983, 14.8859519**, směr **85°**; [ZŠ T. G. Masaryka, Masarykův citát](https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka,_Masaryk%C5%AFv_cit%C3%A1t.jpg), **50.2283594, 14.8866253**, směr **50°**. Obě fotografie: ŠJů, 30. 5. 2024, **CC BY 4.0**.
- Plán `planPublicPhotoSkolskaBlock587` z `scripts/street-mass-build-pass.js` vybírá pouze skutečné obytné OSM budovy v úseku Školské (way `1331897640`, `1331897641`, `1331897642`). Nereklasifikuje libovolné `building=yes` na rodinný dům. Řazení zůstává deterministické při obráceném pořadí OSM uzlů a bez kolize s předchozími bloky.
- **20 detailních domů 5. května + 12 Mírová + 12 Školská + 24 obecně vybraných = max. 68**, bez zvýšení grafického rozpočtu. ZŠ `118487979`, její doložené průčelí a stávající školní pozemky zůstávají samostatným objektem.
- Fotografie školy **nedokládají podobu okolních soukromých domů**. Jejich odhadovaná okna a běžné architektonické prvky jsou označené `inferred` a nikdy nemají status fotografického ověření. Žádný nový parcelní obvod, přechod, komunikace ani soukromý vjezd.
- Rozdíly po vykreslení kontroluje browser WebGL test v `scripts/street-block-webgl.mjs`; lokální výběr a obrácené OSM trasy kontroluje `scripts/street-mass-build-pass.test.mjs`.

---

## Mírová 5.86 — druhý celý uliční blok (16. 11. 2026)

**Přímý kontrolní pohled:** https://foxey-cz.github.io/milovice-life-rp/?v=58600&streetAudit=mirova  
**Detail podle veřejné fotografie domu:** https://foxey-cz.github.io/milovice-life-rp/?v=58600&streetAudit=mirova36-2024

- Zdrojové snímky: [Mírová (01), 30. 5. 2024](https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_(01).jpg) (GPS 50.2286667 / 14.8847222; azimut 30°), [Mírová 243/36, 30. 5. 2024](https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_36.jpg) (GPS 50.2280572 / 14.8840981; azimut 65°). Autor obou: **ŠJů**, licence **CC BY 4.0**. Fotografie dokládají charakter ulice, nikoli přesnou parcelní polohu jednotlivých plotů, stromů či dveří.
- `scripts/street-mass-build-pass.js` / `planPublicPhotoMirovaBlock586`: nový skutečný OSM koridor `1331897651`, **12 okolních domů**, včetně reálných nepravidelných půdorysů. Rezervovaná místa jsou **oddělená** od původních 20 domů na 5. května; nevzniká jediná nová budova.
- `scripts/hero-architecture.js`: **20 původních + 12 Mírová + 36 běžných = 68** nejvýše plánovaných detailních domů. Nedoložené fasády dostávají stabilní odhadované uspořádání, doložené stěny fotografické údaje. Žádná automatická fotoaproba.
- `scripts/mirova-public-photo-street-586.js`: nízké živé ploty a řídká zeleň podle typů pozorovaných na foto, **polohy pouze orientační**. Každý kandidát musí projít testem proti OSM komunikacím, chodníkům i domům. Přírůstek nejvýše **4 draw calls** díky InstancedMesh; žádné falešné přechody, nájezdy či soukromé parcelní hranice.
- Funkční kontrola: `scripts/street-mass-build-pass.test.mjs` (výběr/zdroje/kolize) a `scripts/street-block-webgl.mjs` (skutečné vykreslení po načtení 3D).

---

## Nový pracovní postup od 16. 11. 2026: veřejné fotografie + uvěřitelná rekonstrukce

Milovice RP se odteď rozvíjí **po celých uličních úsecích podle veřejně dostupných, ověřitelných fotografií**. Fotografie z Wikimedia Commons (zejména ŠJů, 30. 5. 2024, CC BY 4.0; a Tiia Monto, 26. 7. 2014, CC BY-SA 4.0) se párují k přesné budově nebo místu pouze na základě názvu, ověřené polohy/úhlu a OSM půdorysu. **Uživatel nemusí posílat nové Panorama ani screenshoty po každé úpravě.** Jeho dřívější snímky jsou historický podklad, nikoliv požadavek pro další postup.

- Pracuj v dávkách: celé ulice a jejich domy, střechy, okna, vstupy, ploty, chodníky, přechody, zeleň a drobné objekty. Přednost dostávají části s více ověřenými veřejnými zdroji.
- Podklady: [kategorie 5. května](https://commons.wikimedia.org/wiki/Category:5._kv%C4%9Btna_(Milovice)), [Mírová 243/36](https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_36.jpg) (GPS 50.2280572, 14.8840981, heading 65°), [Školská – škola](https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg) (GPS 50.2286983, 14.8859519, heading 85°). Kompletní registry: `scripts/street-photo-evidence.js`.
- Jeden snímek dokládá jen **viditelné fasády a objekty**. Na základě výslovného přání autora lze **umělecky dopočítat nedoložené fasády, okna, odstíny, střešní detaily a běžné uliční prvky** z OSM půdorysů a sousedních domů. Nikdy z nich ale nedělej údajně fotograficky ověřené objekty, netvrď přesné hranice parcel, polohy soukromých bran, podzemní průchody, dopravní značení ani stav v roce 2026. Odhady jsou označené jako `inferred`/provizorní a mají nižší prioritu než nové fotky. `scripts/facade-model.js` používá pro nejistá okna deterministické rozvržení podle OSM ID a rozměru konkrétní stěny; `scripts/hero-architecture.js` ho použije jen u nedoložených stran.
- Nezačleňuj proprietární snímky Panoramata jako textury; veřejné Commons fotografie mají vlastní atribuci a podmínky licencí. Vytvářej originální geometrii.
- Nabízej hotové veřejně podložené celky a odkazy na **přednastavenou herní kameru**, např. `?streetAudit=mirova36-2024` a `?streetAudit=school-2024`. Nevyžaduj po uživateli další opakované sladění záběru.

---

# Milovice RP 5.81.16 — napojení parkování u kolejí na příjezdovou komunikaci

**Kontrola parkoviště shora:** https://foxey-cz.github.io/milovice-life-rp/?v=58116&forecourtAudit=wide&parkingOverview=1  
**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=58116  
**Záloha před změnou:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/58115-before-roadside-parking-seam

## Vizuální kontrola verze 5.81.15, 15. 11. 2026, 20:48

Mobilní nadhled ukazuje lepší, mírně rozšířenou levostrannou parkovací plochu, ovšem mezi ní a příjezdovou komunikací stále zůstává nápadný úzký pruh trávy. Na doloženém satelitním snímku **4. června 2023** je parkovací plocha u asfaltu a nanejvýš oddělená obrubníkem. Stejně jako dříve neznáme geodeticky přesnou hranici a satelit z roku 2023 nepotvrzuje dnešní stav.

Verze 5.81.16 proto zkouší **uzavřít část nesprávně vzniklého zeleného pruhu**: u každého již bezpečného parkovacího dílu samostatně otestuje tři drobná posunutí hrany k OSM příjezdové silnici, maximálně **36 cm**, při zachování vnější hrany směrem ke kolejím. Ověřuje celou novou obdélníkovou plochu vůči silnicím, pěšinám, budovám a kolejišti. Jakmile by rozšíření neprošlo testem, zůstává dosavadní bezpečná hranice.

Spoje mezi sousedními parkovacími díly používají **pouze společný bezpečný průnik** obou sousedních povrchů. Nikdy se nedoplní dlažba přes asfalt ani přes nepřístupnou část kolejiště. Původní vozovky, chodník v pravém parkovacím ostrově, bílá parkovací značení, cyklověž i nádražní budova zůstávají beze změny. Počet drawcallů se nemění; jde o úpravu stávajícího 3D meshe.

Zbylá zeleň mezi silnicí a parkovištěm se smí odstranit jen po ověření dalších podkladů. Tento build není náhradou za geodetický polygon celé parkovací plochy.

---

# Milovice RP 5.81.15 — proměnlivý půdorys parkování u kolejí podle satelitního snímku 2023

**Pohled na celé parkoviště shora:** https://foxey-cz.github.io/milovice-life-rp/?v=58115&forecourtAudit=wide&parkingOverview=1  
**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=58115  
**Záloha 5.81.14:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/58114-before-variable-rail-parking-outline

## Kontrola screenshotu 5.81.14 (15. listopadu 2026, 20:35)

Podle uživatelova porovnání se satelitním snímkem z **4. června 2023** už jsou obě parkovací plochy správně zpevněné a mají diagonální značení. Levá plocha směrem ke kolejím však pořád tvořila uniformní úzký obdélník, zatímco historický snímek ukazuje proměnlivý obrys a koncová zaoblení. Přesný tvar není geodeticky známý, proto nové úpravy zůstávají **foto-podloženým odhadem**.

5.81.15 zachovává původní okraj příjezdové komunikace a usiluje o **mírné rozšíření směrem ke kolejím maximálně o 1,55 m** v prostřední části, směrem ke koncům plynule ubývající. Každá rozšířená parkovací deska prochází původním plnohodnotným bezpečnostním testem OSM komunikací, budov i železničních tratí; pokud nevyhovuje, zůstane původní rozměr. Nový povrch je tvořen **jedním 3D meshem** s konzervativními spoji mezi ověřenými deskami. Výplň mezery mezi dvěma stáními nesmí být širší než kterékoliv z nich. Koncové profily se zužují uvnitř platných geometrických obdélníků a nezabírají žádnou novou půdu. Bílé parkovací čáry zůstávají uvnitř ověřených stání a existující ostrůvek napravo ani vozovka se nemění.

Další etapa: porovnání nového obrysu z mobilního nadhledu proti skutečné fotografii, poté samostatně doložit přesné konce parkovišť a výsadbu ostrůvků. Auta viditelná na satelitním snímku jsou dočasná a do mapy se z něho nepřenášejí.

---

# Milovice RP 5.81.14 — skutečné dvě parkovací plochy podle satelitního snímku 4. 6. 2023

**Kontrola shora:** https://foxey-cz.github.io/milovice-life-rp/?v=58114&forecourtAudit=wide&parkingOverview=1  
**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=58114  
**Záloha před opravou:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/58113-before-2023-satellite-parking-banks

## Nový doložený podklad (15. 11. 2026, uživatelský screenshot)

Uživatel poskytl dvojici porovnatelných pohledů shora: hru 5.81.13 a satelitní snímek místa se zobrazeným datem **4. 6. 2023**. Orientační body jsou kolejiště vlevo, středová příjezdová komunikace OSM 675778842, Nádražní OSM 128308366 vpravo, parkování na obou stranách příjezdové komunikace. Ze snímku je přímo vidět, že **rail-side bank je jedna světle zpevněná parkovací plocha s diagonálním značením**, nikoliv zelená tráva s 20 samostatnými čtvercovými rošty. **Mezi příjezdovou komunikací a Nádražní** je rozšířený světlý parkovací ostrov s bílými šikmými čárami a úzkým vnějším pěším okrajem. U zakončení jsou malé ostrůvky zeleně. Výchozí záběr nemá geodeticky přesné hranice parkovacích míst. Fotografie 2023 dokládá historickou podobu, nikoliv automaticky stav v listopadu 2026.

## Co je v tomto buildu opraveno

- Zachovaný OSM půdorys obou silnic a původní interní rozdělení pravého parkovacího ostrova na parkování/vnější chodník, bez dalších náhodných ploch.
- Levá parkovací řada se mění z **trávy s izolovanými zelenými rošty** na **světlé zpevněné parkování**. Mezery 0,39 m se vyplňují jen tehdy, pokud celý přemosťující obdélník projde stejnou kontrolou vůči komunikacím, železnici a budovám jako původní stání; jinak zůstává původní bezpečný okraj.
- **Diagonální bílé čáry** na obou stranách příjezdové komunikace. Vycházejí z již ověřených ploch (na levé straně jednotlivá bezpečná stání, na pravé spojité ověřené parkovací dlaždice). Každá čára znovu prochází dopravním safety testem; nic se nedomalovává přes asfaltovou příjezdovou cestu, Nádražní ani kolej.
- Nepřidáváme automobily ze satelitu (byly dočasně zaparkované), ani náhodné stromy/lampy. Počty a úhly čar jsou **fotograficky poučená aproximace**, nikoliv geodetická data.
- Renderovací náklady zůstávají nízké: rail-side povrch tvoří jeden instancovaný materiál a všechna parkovací značení jeden sdílený instancovaný materiál. Ve scéně nejsou stovky jednotlivých objektů.

**Další etapa:** po mobilním porovnání geometrie a bílé linky proti realitě následně samostatně potvrdit výsadbové ostrůvky, skutečné směrování chodníků a značky BUS, bez domýšlení souřadnic.

---

# Milovice RP 5.81.13 — průběžně vyhlazená hrana přednádražního chodníku

**Nová kontrolní kamera shora:** https://foxey-cz.github.io/milovice-life-rp/?v=58113&forecourtAudit=wide&parkingOverview=1  
**Spustit hru:** https://foxey-cz.github.io/milovice-life-rp/?v=58113  
**Záloha před novou geometrií:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/58112-before-continuous-roadside-profile

## Mobilní zpětná vazba 15. listopadu 2026, 19:27

Na screenshotu 5.81.12 zůstala dlouhá schodišťová hranice ostrova. Krátké lokální zkosení 22 cm nemohlo narovnat hranici, jejíž tloušťka se měnila po desítkách na sebe navazujících buněk.

V 5.81.13 je původní spodní výplň jednotlivých čtverců nahrazena **souvisle dopočítaným příčným profilem** přes všechna již fotodoložená a OSM-bezpečná dlažební pole. Vnější hrana se získává jako omezená obálka a smí se měnit maximálně zhruba o 12 cm na 1 m délky. Každý řez leží **uvnitř existujících ověřených buněk**, ne na vozovce ani v náhodně vymyšlené zeleni; konec z jediné buňky se smí zúžit na 10 cm místo vynucení dalšího schodu. Stejná textura, pozice původního horního chodníku a jediný drawcall zůstávají.

Jedná se o technické zarovnání **modelového** parkovacího ostrova, ne o důkaz geodeticky skutečné hrany v listopadu 2026. Reálné rozmístění stromů, lamp, autobusového značení a sousedních budov bude následovat podle správně lokalizovaných fotografií.

---

# Milovice RP 5.81.12 — zmírnění schodovitých krajů parkovacího ostrova

**Nová mobilní kontrola shora:** https://foxey-cz.github.io/milovice-life-rp/?v=58112&forecourtAudit=wide&parkingOverview=1  
**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=58112  
**Záloha před změnou:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/58110-before-island-grass-gaps-fix

## Kontrola mobilního screenshotu 5.81.11 z 15. 11. 2026 19:17

Oprava 5.81.11 odstranila dlouhé zelené trojúhelníkové díry uvnitř chodníkového pásu a neprohodila parkování a chodník. Z nadhledu ale nadále vystupují hranaté schody z odlišně vybraných koncových buněk u silnice.

5.81.12 ponechává spodní vyplňovací dlažbu ve všech dříve ověřených bezpečných buňkách. Tam, kde se nejsvrchnější road-side buňka vychyluje proti sousední řadě o více než 0.55m, zkosení **maximálně 0.22m pouze uvnitř staré povolené buňky** změkčí vyčnívající roh. Ani část polygonu nepřekročí její původní bounding box, hranice žádné OSM silnice/železnice/domu se nemění. Úpravy se přidávají do jednoho existujícího drawcallu, nemění materiál ani UV měřítko.

Testy ověřují, že se zkosení objeví jen u skutečných schodů, jsou omezená rozměry buněk a nepřidávají nové meshe. Přesný skutečný tvar parkovacího obrubníku nadále neznáme, proto jde o **kosmetickou úpravu modelové zpevněné plochy, nikoliv tvrzení o geodetické přesnosti**.

---

# Milovice RP 5.81.11 — odstranění zelených děr v parkovacím ostrově

**Pohled shora:** https://foxey-cz.github.io/milovice-life-rp/?v=58111&forecourtAudit=wide&parkingOverview=1  
**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=58111  
**Záloha před opravou:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/58110-before-island-grass-gaps-fix

## Co je opravené

Na uživatelském screenshotu z 15. listopadu 2026 v 18:52 je podél vnější strany parkovacího ostrova vidět série dlouhých zelených klínů uvnitř dlažby. V modelu 5.76 vznikaly proto, že hladký souvislý chodníkový pás pokrýval pouze část dvou sloupců buněk již vyhrazených pro pěší, aniž by zbývající povrch dostal dlažbu.

V 5.81.11 se tato zbývající část pokrývá spodní vrstvou **pouze uvnitř původních OSM-bezpečných buněk vyhrazených pro chodník**. Vrstva sdílí UV měřítko, natočení a materiál s hlavním chodníkem, má překrytí sousedních buněk 12 mm a je o 21 mm pod hlavním pásem. Trojúhelníky se přidávají do původního mesh bufferu, takže nevzniká nový drawcall ani další objekt ve scéně.

**Nezměněné:** půdorysy budov, vozovky, skutečné OSM průchody, strana parkování, samotné kontrolní kamery, plocha trávy mimo dříve schválené buňky. Automatické testy nadále ověřují, že rozšířené buňky nezasahují do žádné mapované silnice či pěšiny. Skutečné hranice parkování jsou stále fotografickým odhadem, nikoli geodeticky zaměřenou pravdou.

---

## 15. 11. 2026 — mobilní kontrola 5.81.10: přednádraží z obou směrů

**Nová technická kamera parkování shora:** https://foxey-cz.github.io/milovice-life-rp/?v=58110&forecourtAudit=wide&parkingOverview=1

Dva mobilní snímky 5.81.10 ukázaly velkou asfaltovou plochu ze směru zastávek a pohled napříč před nádraží, ale z úrovně očí nelze bezpečně rozlišit existující parkovací ostrov od pozadí a skutečné plochy vozovek. Z modelu přitom vyplývá, že už existují fotodoložené/OSM bezpečné **dvě strany parkování, centrální ostrov a vnější chodník** (5.76). Plochu proto nerozmnožujeme.

Přidaná opt-in kamera `parkingOverview=1` je umístěná přímo nad osou OSM jednosměrné příjezdové komunikace **675778842** a orientovaná podle její osy. Ukáže stávající parkovací dlažbu mezi ní a silnicí **128308366**, i navazující OSM chodník **1165594426**. Na mobilu je záměrně vysoká a dívá se dolů, aby široké přednádraží bylo viditelné místo nebe. Zobrazuje diagnostický přehled počtů vykreslených segmentů, nikoli nové dopravní značky nebo auta. Běžná 3D hra, původní fotografické kamery, chodníky i geometrie vozovek se nemění.

Tato kamera **není snímek z reálného fotografického stanoviště**. Historické fotografické podklady 2022–2024 zatím nestačí k určení přesné polohy stromu, Y-lampy, záhonů nebo značení BUS; tyto objekty proto zůstávají označené jako nenaměřené a nejsou nově přidány.

---

# Milovice RP 5.81.10 — přirozenější napojení cyklověže na skutečný chodník

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=58110  
**Detail přechodu na chodník:** https://foxey-cz.github.io/milovice-life-rp/?v=58110&forecourtAudit=tower&entryInspection=1  
**Záloha 5.81.9:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/5819-before-sidewalk-seam

Na mobilním záběru 5.81.9 z 15. 11. 2026 v 18:29 je vzor dlažby už sjednocený, ale na konci stále vzniká klín vůči existujícímu chodníku. Verze 5.81.10 proto v poslední třetině spojovacího pásu postupně otáčí příčné profily tak, aby jejich koncová hrana byla kolmá na *skutečně vykreslený* OSM chodník 1165594426. Jde o technickou korekci směru napojení a ne o nové odhadování fotografické hranice zeleně. Nemění se silnice, budovy, šířka rozšíření, materiál, výkonový budget ani uživatelská doprava. Dodatečné testy potvrzují geometrické zarovnání, nedegenerované trojúhelníky a bezpečný odstup od komunikací.

Historické fotografie 2022 a 2024 dokazují existenci dlážděného přístupu, ne geodeticky přesné okraje. Proto je koncová plocha stále vedená jako aproximace a další úprava hran vyžaduje skutečnou oporu ve zdrojích.

---

# Milovice RP 5.81.9 — sladěná textura dlažby cyklověže a existujícího chodníku

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5819  
**Detail spojení s chodníkem:** https://foxey-cz.github.io/milovice-life-rp/?v=5819&forecourtAudit=tower&entryInspection=1  
**Fotografická kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=5819&forecourtAudit=tower  
**Bezpečná záloha 5.81.8:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/5818-before-paving-uv-fix

## Co opravila mobilní kontrola z 15. 11. 2026, 18:21

Uživatel zaslal dva snímky verze 5.81.8. Geometrie souvislé pěší plochy funguje, ale v detailu je na jejím konci viditelný přechod mezi drobnou texturou nové dlažby a podstatně většími spárami existujícího OSM chodníku. Původní plánovač používal u nové plochy lokální UV v metrech /1,2, zatímco vykreslovací funkce `osmStrip` používá přes šířku 1,8m U=0..1 a podél chodníku V=délka/8.

Nový mesh proto bere **počátek i orientaci UV z přesně toho bezpečně vykresleného úseku OSM 1165594426, ke kterému je napojen**. Zajišťuje stejnou orientaci a délkové měřítko dlažby na styku s původním chodníkem. Nejde o změnu hrany podle neznámého geodetického zaměření ani o další překryvnou záplatu. Zachovává 403 vrcholů, 720 trojúhelníků, jeden draw call, stejné kolizní zábrany a zachovanou zeleň.

Automatické testy nově porovnávají skutečná UV vytvořeného 3D meshe s orientací, počátkem a měřítkem OSM chodníku. **Fotografická kontrola přesných hran dlažby a zeleně stále není uzavřena**: dostupné panoramatické fotografie 2022 a Commons 2024 potvrzují pěší přístup, ale ne geodeticky přesný polygon. Přirozenost vzhledu je potřeba ověřit přímo na mobilu.

---

# Milovice RP 5.81.8 — souvislá zpevněná plocha cyklověže, zeleň a bezpečná vozovka

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5818  
**Technická kamera celé plochy:** https://foxey-cz.github.io/milovice-life-rp/?v=5818&forecourtAudit=tower&entryInspection=1  
**Původní fotografická kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=5818&forecourtAudit=tower  
**Záloha předchozí verze:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/5817-before-forecourt-surface

## Kontext

Mobilní screenshot uživatele **15. 11. 2026, 17:34** potvrdil, že 5.81.7 už má technicky spojený vstup cyklověže a skutečně vykreslitelný chodník OSM **1165594426**, avšak výsledek je vizuálně stále jen úzký pruh dlažby přes široký trávník. Reálné panoramatické záběry **17. 5. 2022** (Mapy.com, uživatelské podklady) a snímek **30. 5. 2024** (ŠJů, [Commons](https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg), CC BY 4.0) ukazují u cyklověže nádražní pěší prostředí s dlažbou a zachovanými zelenými plochami. **Z fotografií však nelze vyčíst geodeticky přesné hrany nebo polohu každého záhonu.**

## Co se ve 5.81.8 skutečně mění

- Namísto dvojice překrývajících se ploch (obdélníku u dveří a úzké cesty) vzniká **jeden propojený, bez překryvů vygenerovaný terénní mesh** s 31 podélnými řadami a 13 body v každé řadě: celkem **403 vrcholů a 720 trojúhelníků, jeden draw call a jeden sdílený materiál dlažby**. Není nutná žádná nová textura ani nový 3D objekt.
- Před modrými dveřmi zůstává ověřená **3,10 × 2,10 m** plocha; dál se dlažba rozšiřuje **asymetricky směrem k nádražní budově** (v nejširší části přes 4,3 m), naopak směrem k silnici se postupně zužuje podle skutečného OSM odstupu. Na konci plynule přechází do šířky kolem **1,64 m**, tedy blízko existující 1,8m široké vykreslené pěší cesty. Nevzniká tak nový ostře zalomený šíp ani velká samostatná plocha přes silnici.
- **Ochrana celé rozšířené plochy:** posuzuje se každý příčný řez, okraje i spojovací řady vůči reálným OSM jízdním pruhům, dalším chodníkům, konstrukci věže **i okolním budovám**. Rozšíření se odmítne, pokud zasahuje do jakékoliv nepřípustné plochy. Pouze cílový OSM chodník je výjimka, aby na něj bylo možné navázat. U budov držíme minimální odhadovaný volný odstup 0,45 m a u komunikací 0,18 m.
- **Zachovaná zeleň:** nezastavujeme celý prostor mezi nádražím a cyklověží „od oka“. Jedna lokální pěší plocha se rozšiřuje v bezpečném mapovém koridoru, okolní nepodložené travnaté plochy zůstávají. Přesné obrubníky, záhony, strom a dvojramenná lampa stále čekají na lepší zaměření.
- **Zachované beze změny:** oprava asfaltových UV 5.81.3, průběh silnice Nádražní, parkování, všechny OSM budovy, vzhled cyklověže, zastávky A/B, vstupy do nádraží, kolize i mobilní ovládání. Technická kontrolní kamera je stále výslovně odlišena od historické fotografické kamery.

## Jak ověřujeme skutečný výsledek

1. `scripts/bike-tower-entry-paving.test.mjs`: nově kontroluje **celou rozšířenou hranici**, bezpečné OSM napojení a zamítnutí simulované nové pěší cesty či budovy ve vzniklé širší části dlažby.
2. `scripts/bike-tower-forecourt-mesh-5818.test.mjs`: vytvoří **opravdové vrcholy a trojúhelníky** 3D plochy, zkontroluje jeden topologicky propojený povrch, směrování všech ploch nahoru, skutečnou vykreslovanou plochu, sdílený materiál, jediný objekt a bezpečné resetování.
3. `scripts/station-forecourt-webgl.mjs`: vykreslí ve skutečném Chromiu širokou kameru, detail věže a technický pohled na pěší napojení, včetně mobilu na výšku; ověří 720 trojúhelníků, maximální šířku, zachované odchylky od silnice a fotorežim bez joysticku.

**Další kontrolní bod:** teprve reálný mobilní screenshot potvrdí, že nový rozšířený povrch vypadá přirozeně i při pohledu od nádraží. Z 5.81.8 nelze vyvozovat dokončení celé Nádražní ulice ani přesnou realitu všech zelených záhonů.

---

# Milovice RP 5.81.7 — pěší napojení cyklověže na opravdu viditelný chodník

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5817  
**Zblízka: dlažba, dlouhé napojení, navazující OSM chodník:** https://foxey-cz.github.io/milovice-life-rp/?v=5817&forecourtAudit=tower&entryInspection=1  
**Původní fotokamera cyklověže:** https://foxey-cz.github.io/milovice-life-rp/?v=5817&forecourtAudit=tower  
**Bezpečná záloha 5.81.6:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/5816-before-rendered-footway-fix

## Proč 5.81.6 na telefonu stále ukazovala „šíp“ končící v trávě

Snímek uživatele z **15. 11. 2026 17:03** dokládá úzké šikmé dláždění, jehož konec se nepropojuje s viditelným chodníkem. Po ověření konkrétního OSM 1165594426 jsme odhalili přesnou příčinu: přibližně **2m spoj z 5.81.5** mířil na nejbližší *matematickou čáru v OSM*, ale cílový úsek přímo u věže herní bezpečnostní filtr `safePedestrianPieces` z mapy **odstraní**, protože zasahuje do reálného jízdního pásu. Nelze se vizuálně napojit na něco, co se vůbec nevykreslí.

## Oprava

- Cílový bod se nyní vybírá jen z **opravdu kreslených částí footway 1165594426**, podle **přesně stejné funkce `safePedestrianPieces` a stejných šířek skutečných OSM vozovek**, jaké hra používá při stavbě ulic. Cíl leží uvnitř bezpečně vykreslitelného fragmentu, nikoli v jeho odstraněné části.
- Nejbližší takto viditelný úsek začíná zhruba **8 metrů od vstupní dlažby** (není to fyzické geodetické měření dlažebních hran). V 3D je nyní jedna skoro rovná pěší propojka **šířky 1,60 až 1,55 m**, která se **nezužuje do špičky** a končí v geometricky viditelném 1,8m chodníku. Celý model, včetně již hotové 3,10 × 2,10m vstupní dlažby, pořád používá jeden sdílený materiál a **jeden draw call**.
- Pro celé řešení platí kontrola všech okrajových bodů proti **ostatním skutečným vozovkám i jiným cestám**, kontrola nevnikání do skleněného pláště cyklověže a odmítnutí vložení, pokud by budoucí OSM data bezpečné spojení neumožnila. **Nijak se nemění samotný OSM chodník, silnice, nádraží, auta, parkování, vozidlové kolize či materiál asfaltu.**
- Blízká kontrolní kamera se přizpůsobí prodlouženému propojení (vyšší, o něco dál, zamířená na celou délku). **Jde o technickou kameru z OSM výpočtu, nikoli reálnou fotku.** Původní fotoaudit a mobilní sbalovací panel zůstávají funkční. Běžná hra zachovává původní ovládání.
- **Omezení důkazů:** fotografie potvrzují dlážděné okolí vstupu, ovšem nikoli přesnou geometrii této 8m spojnice. Tu považujeme za **opatrnou, vizuálně navazující herní aproximaci**, nikoli za dokonale ověřenou kopii reálného přednádraží. Po testech bude stále potřeba porovnat detail z mobilu a případně rozhodnout o souvislé ploše a hranách dle dalších pohledů.

**Regresní kontrola:** `scripts/bike-tower-entry-paving.test.mjs` nově hlídá reálně vykreslitelný úsek, bezpečný cíl a správnou délkou spojení. `scripts/station-forecourt-webgl.mjs` kontroluje skutečnou přítomnost propojení na mobilu a současný záběr vstupu, spojovací plochy a cílového chodníku.

---

# Milovice RP 5.81.6 — kontrola skutečné viditelnosti spojení cyklověže

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5816  
**Detailní technický pohled na vstup a spojení:** https://foxey-cz.github.io/milovice-life-rp/?v=5816&forecourtAudit=tower&entryInspection=1  
**Původní fotokamera u cyklověže:** https://foxey-cz.github.io/milovice-life-rp/?v=5816&forecourtAudit=tower  
**Široký pohled:** https://foxey-cz.github.io/milovice-life-rp/?v=5816&forecourtAudit=wide  
**Záloha 5.81.5:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/5815-before-entry-visibility-review

## Problém

Uživatelův Android screenshot 15. 11. 2026 16:52 ukazuje věž s velmi úzkým světlým prahem. Není z něj možné potvrdit, že přepracovaná dlážděná spojnice 5.81.5 opravdu **opticky** navazuje na mapovaný chodník 1165594426, protože původní fotoaparát stojí asi 24 metrů od věže a směr spojnice je pro tento pohled šikmý. Téměř 400 px vysoký auditní panel navíc zabíral horní polovinu mobilní scény.

## Oprava uživatelské kontroly, nikoliv nepodložené geometrie

- Mobilní fotoaudit včetně všech tří původních fotografických pohledů má nyní standardně **kompaktní panel** s tlačítkem `Rozbalit nabídku`. Na desktopu se panel otevírá rozbalený. Herní joystick je v kontrolním režimu stále skrytý; mimo fotoaudit se nemění.
- Nové `&forecourtAudit=tower&entryInspection=1` je **TECHNICKÝ KONTROLNÍ POHLED, NIKOLI skutečná fotografie**. Pozice a sklon kamery se vypočtou ze stávajícího OSM ukotvení cyklověže a z existujícího plánu dláždění. Kamera stojí zhruba 7 m od vstupní plochy, výše nad zemí, a míří dolů na práh, spojovací klín i stávající mapovaný chodník. Oproti původní fotokameře z 30. 5. 2024 nevyužívá její GPS jako vlastní stanoviště.
- V diagnostice `window.__miloviceForecourtAuditRendered.entryInspection.projectedPoints` se kontroluje zobrazení **tří bodů současně**: vstup, napojení a mapovaný chodník. Chromiový mobilní test ukládá zvláštní screenshot takového pohledu a ověřuje výchozí sbalení panelu.
- **Žádná změna 3D geometrie, materiálů ani rozměrů** na cyklověži, přístupové dlažbě, chodníku, asfaltu, parkování, budovách a BUS zóně. Původní předpoklady o přesných okrajích dlažby zůstávají přibližné, a proto je třeba je hodnotit z blízkého pohledu.

**Další rozhodnutí až po vizuálním ověření:** pokud je spojení stále fyzicky oddělené, posunuté nebo mizí do trávy, opravíme samotný 3D mesh či výšku podle diagnostických pohledů. Pokud je spojení skutečně souvislé, přejdeme ke zbývajícím částem celé Nádražní ulice.

---

# Milovice RP 5.81.5 — pěší propojení od cyklověže na skutečný chodník

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5815  
**Fotokamera cyklověže:** https://foxey-cz.github.io/milovice-life-rp/?v=5815&forecourtAudit=tower  
**Široký pohled:** https://foxey-cz.github.io/milovice-life-rp/?v=5815&forecourtAudit=wide  
**Záloha verze 5.81.4:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/5814-before-connected-bike-paving

## Konkrétní důvod

Uživatelův screenshot mobilního fotoauditu **15. 11. 2026, 16:33** potvrzuje, že přidaná dlážděná plocha 5.81.4 před modrým vstupem do cyklověže byla **malý izolovaný obdélník na trávníku**, nikoli návazná pěší plocha z panoramat **2022-05-17** (Mapy.com) a fotografie **ŠJů 2024-05-30** (CC BY 4.0). Vykreslování asfaltu 5.81.3 zůstalo správné, proto se asfalt dále nemění.

## Implementace

- Původní 3,10 × 2,10 m přístupový dlažební díl u **OSM cyklověže 1011197691** se zachovává. Nově na jeho vnější pravé/přední straně **přímo navazuje zúžený pěší spoj** k existující **OSM footway 1165594426**; jeho přibližná délka podle reálných mapových bodů je **1,97 m**. Koncový bod leží v modelované šířce mapového chodníku, aby nevznikl úzký travnatý pás mezi dvěma dělícími se povrchy.
- Tvar chodníku se plynule zúží z **1,05 m na 0,68 m**, protože v blízkosti napojení vede reálná vozovka **OSM 1459294017**. Celé spojení se vzorkuje napříč a podélně proti *všem dalším* OSM silnicím i pěším komunikacím. **Jedinou výjimkou je cílový OSM chodník 1165594426**, do kterého se musí plynule napojit; jeho konec se překrývá jen zhruba o 15 cm s existujícím mapovým pěším povrchem. Pokud bezpečné spojení neprojde, nový model se nespustí.
- **Zůstává jeden jediný `BufferGeometry` mesh a 1 draw call**, sdílí původní městský dlažební materiál. Pad a spoj mají společnou orientaci UV; v překryvu je jen 4mm výškový rozdíl pro eliminaci blikání povrchu. Nic dalšího se neinstancuje a nevytvářejí se další samostatné dlažební destičky.
- **Nezměnilo se:** OSM geometrie silnic, ulic, chodníků, parkoviště 5.76, asfalt 5.81.3, cyklověž, nádraží, dopravní značení, vstupy, kolize ani chůze. Neznámé lampy/stromy/záhony a BUS značení dál čekají na přesné podklady. **Přesná poloha hran dlažby není geodeticky zaměřena:** jde o fotokontrolovanou přibližnou modelářskou návaznost na skutečnou OSM pěší cestu.
- **Ochrana do budoucna:** `scripts/bike-tower-entry-paving.test.mjs` nově hlídá skutečný přístup na OSM footway, šířky a bezpečný odstup od přilehlé vozovky včetně syntetické další cesty, která by spoj přetnula. Chromium v mobilním i desktopovém režimu kontroluje živé spojení v 3D, zachování **jediného draw callu** a dřívější funkcionalitu cyklověže.

**Požadavek na vizuální schválení:** Záběr z mobilní fotokamery může odhalit, zda je napojení v reálném prostředí příliš úzké nebo nesprávně natočené; potvrzení výstupu neznamená, že je celá Nádražní dokončena.

---

# Milovice RP 5.81.4 — dlážděný vstup k cyklověži, bez asfaltu přes chodník

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5814  
**Fotografická kontrola cyklověže:** https://foxey-cz.github.io/milovice-life-rp/?v=5814&forecourtAudit=tower  
**Široké přednádraží:** https://foxey-cz.github.io/milovice-life-rp/?v=5814&forecourtAudit=wide  
**Předchozí záloha 5.81.3:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/5813-before-bike-tower-entry-paving

## První fyzická oprava přednádraží po opravě asfaltu

Před modrým vstupem do skutečné cyklověže je podle uživatelských panoramat Mapy.com ze **17. 5. 2022** a [fotografie ŠJů z 30. 5. 2024](https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg) dlážděný přístup. Původní model měl před vstupem souvislý travnatý pás. Nyní je tam **jedna přibližná, road-safe dlážděná vstupní plocha**:

- **Kotva:** stávající OSM cyklověž 1011197691, v návaznosti na skutečný mapový pěší koridor OSM 1165594426. Směr vstupu je odvozen z již používané fotograficky doložené pozice fotoaparátu; GPS fotografa není GPS skutečného prahu.
- **Rozměr aproximace:** 3,10 × 2,10 m bez nadbytečných okrajů. Jde o vizuální odhad, **ne zaměření přesné hranice dlažby**. Plocha začíná těsně před stávajícím vstupem, zbytek nevyměřeného přednádraží zůstává nezměněný.
- **Bezpečnost:** `planBikeTowerEntryPaving` kontroluje *celou otočenou plochu* přes `isRoadFreeRect` proti indexu skutečných OSM silnic **včetně chodníků**. Je-li konflikt, nevytvoří se nic. Nové stání auta, autobusový pruh, náhodná zahrádka ani nová dopravní plocha se tím nepřidávají. Nejsou přemístěny žádné souřadnice OSM, kolize vozidel ani budovy.
- **Výkon:** jediné spojité `BufferGeometry` s DEM-výškopisem, sdíleným původním materiálem městských chodníků, bez vlastní textury a pouze **1 draw call**. Obsah má vlastní reset/dispose při opakovaném načítání města a hlásí diagnostiku `window.__miloviceBikeTowerEntryPaving`.
- **Kontroly:** `scripts/bike-tower-entry-paving.test.mjs` prokazuje původní kotvy, rozměry a odmítnutí geometrie v případě hypotetického průjezdu nové OSM silnice přímo přes vstup. Samostatný Chromium WebGL test ověřuje přítomnost v živé scéně a počet vykreslovaných objektů.

**Co se zatím nemění:** dlouhé parkoviště a vnější chodník z 5.76, textura asfaltu z 5.81.3, střecha nádraží, dva automaty, celá cyklověž, sloupky A/B, vzdálené boční ulice, BUS pruhy a zatím neukotvená velká lampa/strom. Není ještě možné tvrdit, že okolní souvislá plocha odpovídá fotografii jako celek.

---

# Milovice RP 5.81.3 — klidnější asfalt bez roztažených šraf

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5813  
**Stejný fotopohled s opravenou texturou:** https://foxey-cz.github.io/milovice-life-rp/?v=5813&forecourtAudit=tower  
**Kontrolní pohled bez textury:** https://foxey-cz.github.io/milovice-life-rp/?v=5813&forecourtAudit=tower&roadSurfaceFlat=1  
**Záloha 5.81.2:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/5812-before-asphalt-uv-fix

## Východisko

Dva uživatelské screenshoty z 15. 11. 2026 porovnaly **totožnou foto-kameru cyklověže**: při běžné asfaltové textuře měl blízký úsek silnice výrazné, různě orientované dlouhé šrafy; při vypnutí mapy materiálu byly stejné silniční plochy vizuálně hladké. To jednoznačně prokazuje, že artefakt vyžaduje *texturovaný materiál*; samotný screenshot nedokazuje, zda jsou i některé překryvy road-stripů. Nesmíme proto posunovat fyzické ulice, chodníky ani budovy naslepo.

## Implementace

- **Přesně stejné OSM vrcholy, DEM výšky, indexované trojúhelníky a půdorysy.** Mění se pouze `uv` atribut silničního asfaltu. Starý vzorec `(u, t*len/8)` počítal souřadnice zvlášť pro každý segment a společná textura se navíc opakovala **8× podélně**, takže v křižovatkách a na mobilním obrazu vznikaly ostré pruhy a viditelné změny směru vzoru.
- **Celosvětové konzistentní UV (`x/7,z/7`).** Nezávislé navazující úseky používají totožné UV na stejném bodě i při odlišném směru jízdy. Dlažba, chodníky, nástupiště, štěrkový dvůr, značení a jiné materiály si ponechávají původní UV. Jde o originální texturu 7×7 m na jednu opakovanou dlaždici, ne zkopírovaný asfalt z Mapy.com.
- **Mírnější původní procedurální textura:** utlumené barevné zrno, odstraněné ostře kontrastní diagonální tahy a výrazně snížené množství ostrých bodů. Trilineární mip-mapování a anisotropní filtr (maximálně 4×) brání agresivnímu aliasingu na šikmé silnici mobilního telefonu. Tuto novou texturu stále používá i běžná hra – nejde jen o fotoaudit.
- **Diagnostické porovnání zůstává:** `&roadSurfaceFlat=1` zobrazuje stejný pohled s asfaltovou mapou vypnutou, avšak se stále stejnou geometrií. `window.__miloviceRoadUVValidation` prověřuje skutečné vytvořené vertex-UV atributy vůči jejich world X/Z. Nový Node test a opravdový Chromium/WebGL desktop+mobil test kontrolují trvalou správnost mapování.
- Nezměněné: dvě PID pokladny a bílá fasáda nádraží, skleněná cyklověž se značkou, obě zastávky, parkoviště, vnější chodník, automobilové kolize, městské souřadnice a budoucí fotoaudit lampy/stromu. Žádné nové asfaltové polygonové výplně nebo fiktivní dopravní značení.

**Co ještě není potvrzené:** zda bude při normálním hraní z Androidu asfalt vizuálně zcela v pořádku. Po vydání je potřeba porovnat stejnou kameru s uživatelským screenshotem a neprohlašovat celou Nádražní za hotovou.

---

# Milovice RP 5.81.2 — oprava fotoauditu + bezpečná diagnostika asfaltu

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5812  
**Fotoaudit cyklověže – původní asfalt:** https://foxey-cz.github.io/milovice-life-rp/?v=5812&forecourtAudit=tower  
**Stejný záběr – asfalt bez textury:** https://foxey-cz.github.io/milovice-life-rp/?v=5812&forecourtAudit=tower&roadSurfaceFlat=1  
**Přednádraží – široký záběr:** https://foxey-cz.github.io/milovice-life-rp/?v=5812&forecourtAudit=wide  
**BUS zóna:** https://foxey-cz.github.io/milovice-life-rp/?v=5812&forecourtAudit=bus  
**Záloha verze 5.81.1:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/5811-before-audit-ui-diagnostics

## Proč tato oprava

Uživatelský screenshot z Androidu 15. 11. 2026 zobrazuje v režimu `forecourtAudit=tower` stále virtuální joystick a samostatnou modrou OSM notifikaci „Načítám Mladá ze skutečné mapy…“. Mobilní CSS po načtení aplikace znovu zapnulo joystick, protože předchozí audit skrýval jen `#controls`, nikoli `#rp-joystick`. Pod kamerou je rovněž výrazné protažení nebo křížení asfaltové textury. **Ze snímku nelze jednoznačně určit**, zda jde jen o příliš opakovanou texturu, perspektivní aliasing, překryv sousedních silničních pásů nebo závadu DEM.

## Co skutečně mění 5.81.2

- **Čisté fotografické rozhraní:** `html.rp-ticket-photo-audit` nově skrývá také `#rp-joystick`, runtime přepínač OSM `#osm3d`, kontrolní objekty a samostatné načítací okno `#osmnotice-live`. Přitom zůstávají dostupné tři zdrojově doložené kontrolní pohledy a zpětný odkaz do běžné hry. Normální režim řízení a chůze tyto CSS změny neovlivňují.
- **Stav načítání je stále vidět uvnitř auditního panelu**, nikoliv ve druhém přesahujícím modrém popupu. Při dokončení se ukáže „Mapa načtena“; skutečné chyby načítání se mohou nadále promítnout do stavového textu.
- **Srovnání asfaltu A/B:** v každém fotoauditu přednádraží můžeš jedním odkazem zapnout `roadSurfaceFlat=1`. To je **diagnostika pouze pro fotografie**: ponechá všechny silnice, jejich fyzickou 3D geometrii, UV souřadnice a původní OSM polohy, ale dočasně odstraní kreslenou asfaltovou mapu ze `osmRoadMaterial` a použije homogenní šedý materiál. **V běžné hře asfalt zůstává beze změny.**
- Diagnostika publikuje `window.__miloviceRoadTextureDiagnostic` včetně příznaku skutečně připojené textury a `geometryModified:false`. Pokud závada při přepnutí zmizí, je pravděpodobným viníkem textura/UV nebo jejich filtrování. Pokud zůstane stejná, další test má zkontrolovat překryv road stripů a jejich úrovně nad DEM. **Není to ještě oprava asfaltu.**
- Stále zachované: OSM nádraží 53865956, cyklověž 1011197691 a její světlé materiály z 5.81.1, oba jízdenkové automaty, sloupky A/B, parkování a vnější chodník 5.76; nejsou přidané žádné fiktivní obruby, asfaltové pruhy, lampy ani stromy.

## Testovací kritéria

`scripts/station-forecourt-photo-audit.test.mjs` nyní ověřuje skutečné názvy CSS prvků a bezpečné zapnutí diagnostiky. `scripts/station-forecourt-webgl.mjs` pořizuje na portrétním Chromiu dvě varianty **totožné GPS kamery cyklověže** (texturovaný asfalt a homogenní asfalt) a kontroluje odstranění joysticku, popupu i přepínače mapy. Dále nadále běží testy nádražní stěny, automatů, parkování a ostatní přednádražní pohledy.

---

# Milovice RP 5.81.1 — skleněná cyklověž světlejší podle fotografií

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5811  
**Kontrola celé stanice a cyklověže:** https://foxey-cz.github.io/milovice-life-rp/?v=5811&forecourtAudit=wide  
**Detail cyklověže na telefonu:** https://foxey-cz.github.io/milovice-life-rp/?v=5811&forecourtAudit=tower  
**BUS pohled:** https://foxey-cz.github.io/milovice-life-rp/?v=5811&forecourtAudit=bus  
**Záloha funkční verze 5.81:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/581-before-bike-tower-glass-pass

Reakce na uživatelský screenshot **15. 11. 2026**: oproti jeho vlastnímu panoramatu Mapy.com **17. 5. 2022** má náš Bike Tower příliš tmavé rámování a „černou klec“. Realita má opticky světlejší ocel a průhledné zasklení, viditelnou světlou vnitřní nosnou soustavu.

- **Jen změna materiálů existujícího OSM 1011197691.** Rámy, horizontální prstence a vnitřní regály mají světlejší pozinkované odstíny, čiré zasklení má nižší krytí a lehčí `MeshStandardMaterial` namísto `MeshPhysicalMaterial`. Vrchní střechu ponecháváme tmavší. Půdorys, výška 11.4 m, počet 16 segmentů, 52 vnitřních nosníků, skleněný válec, modré dveře, spodní `BIKE TOWER` a horní cyklo-`P` znak zůstávají na stejných kotvách.
- **Ani jeden nový objekt na chodníku nebo silnici** a žádná nová celoplošná dlažba přes vozovku. Na screenshotu je vidět tráva i asfalt, ale bez dostatečné identifikace správné plochy na OSM je přebarvování země nebezpečné. Otevřená přednádražní plocha, chodníky, obrubníky, BUS značení, strom, dvojramenná lampa a záhony se budou řešit teprve po přesném přiřazení fotografií k mapovým hranám.
- **WebGL test a fotografie:** zachovaná kamera nádraží, samostatná kamera věže i BUS zóna. Nově se při skutečném vykreslení ověřuje i stav lehčích materiálů věže. Vizuální shodu po nasazení stále musí potvrdit fotografie ze hry; automatický test nedokáže sám rozhodnout, zda barva přesně odpovídá reálnému světlu.
- **Zdroj barev:** fotografie cyklověže zaslané uživatelem, pořízené 17. 5. 2022 (Mapy.com); další nezávislý [snímek ŠJů, CC BY 4.0, z 30. 5. 2024](https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg). Žádný pixel z Mapy.com nebo Wikimedia Commons není kopírován do modelu.

---

# Milovice RP 5.81 — skutečné fotografické pohledy na celé přednádraží

**Hra 5.81:** https://foxey-cz.github.io/milovice-life-rp/?v=5810  
**Panorama nádraží + cyklověž:** https://foxey-cz.github.io/milovice-life-rp/?v=5810&forecourtAudit=wide  
**Blízký pohled na cyklověž:** https://foxey-cz.github.io/milovice-life-rp/?v=5810&forecourtAudit=tower  
**BUS zóna z opačného směru:** https://foxey-cz.github.io/milovice-life-rp/?v=5810&forecourtAudit=bus  
**Stávající audit jízdenkových automatů:** https://foxey-cz.github.io/milovice-life-rp/?v=5810&ticketPhotoAudit=1  
**Bezpečná záloha 5.80:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/580-before-forecourt-reality-pass

## Co přesně přibylo

- Tři **samostatné skutečně geotagované fotoaparáty ŠJů z 30. 5. 2024**. URL přepne pouze kontrolní kameru a po načtení skutečné OSM budovy zobrazí nádraží (53865956), cyklověž (1011197691) a již existující sloupky A/B. Při fotografickém auditu se vypne zakrývající výběr vozidla, HUD i joystick a vykreslování ulic se soustředí okolo **správné kamery**, nikoli herního spawnu.
- Zdroje: [široký záběr, GPS 50.2289419, 14.8823244, heading 335°](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_autobusov%C3%A1_zast%C3%A1vka_a_cyklov%C4%9B%C5%BE.jpg), [cyklověž GPS 50.2290656, 14.8822978, heading 5°](https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg), [zastávky GPS 50.2292294, 14.8822956, heading 175°](https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_autobusov%C3%A9_zast%C3%A1vky_p%C5%99ed_n%C3%A1dra%C5%BE%C3%ADm.jpg). Autorem je ŠJů, licence CC BY 4.0. Úhel zorného pole 105° na portrétním mobilu je **pomocný digitální pohled** a nemá se prezentovat jako původní fotoobjektiv.
- **Jeden fotograficky doložený nový detail na existujícím objektu:** horní modrý znak cykloparkování s bílým P a vlastním jednoduchým piktogramem kola na už postavené cyklověži. Půdorys a vnější plášť věže zůstávají beze změny; značka je orientována shodně s doloženým modrým přízemním vstupem. **1 nový draw call, 1 procedurálně kreslená CanvasTexture, 0 nových objektů na silnici.** Výška/natočení značky jsou vizuální odhad a čekají na kontrolu v mobilní hře; fotografie nebyla vložena do textury. Při rekonstrukci scény se výslovně uvolní její geometrie, materiál i textura.
- Strom, dvojramenná lampa, záhon, BUS nápisy a protější přístřešek jsou v seznamu **čeká na bezpečnou polohu**. Fotografie z roku 2022 od uživatele a ze 2024 na Commons potvrzují jejich vzhled/přítomnost ve svých datech, ale **nedokazují přímo x/z souřadnice**. Do hry je proto zatím nevkládáme. Toto není finální dokončení Nádražní.
- Ponechané plochy 5.76, stop sloupky 5.23, automaty 5.80, cyklověž 5.64, mapová geometrie a herní ovládání. Základní i Chromium WebGL testy hlídají, že se tyto vrstvy nerozbily.

## Ověřovací workflow

- `scripts/station-forecourt-photo-audit.test.mjs` kontroluje zdroje kamer, identitu obou budov, konzervativní pravidla `deferred` a ukotvení horní značky v OSM věži.
- `scripts/station-forecourt-webgl.mjs` ověřuje 3 skutečné kamery v Chromiu (široký záběr, detail věže na portrétním telefonu, BUS zóna) a uloží 3 screenshoty do GitHub Actions. Starý `station-ticket-photo-webgl.mjs` zůstává pro obě jízdenkové automaty.
- Checklist 5.81 a všech deset uživatelských fotografických pozorování viz [Nádražní Reality Pass](docs/NADRAZNI-5.81-REALITY-PASS.md).

---

# Milovice RP 5.80 — detailnější automaty bez posunu jediného půdorysu

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5800  
**Fotografické srovnání z místa fotoaparátu:** https://foxey-cz.github.io/milovice-life-rp/?v=5800&ticketPhotoAudit=1  
**Záloha celé funkční 5.79:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/579-before-station-machine-detail

## Foto a hranice přesnosti

Zdroj původního umístění je ŠJů, 30. 5. 2024, CC BY 4.0:
https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_automaty_na_j%C3%ADzdenky.jpg.
Fotograficky doložené je **pořadí dveře – oranžový automat – žlutý automat – okno** a základní vzhled. Rozměry, poloha podél již ověřené stěny OSM 53865956, rozteče klávesnice a drobné konstrukční hrany jsou stále **modelářským odhadem**, nikoli zaměřeným 3D skenem. Fotografie není kopírována ani stažena do herní textury.

## Co se změnilo

- **Oranžový automat:** zachovaný 3D korpus i x/z; nově originálně nakreslená jemnější metalická plocha s větší černou konzolou, displejem, tmavým ovládacím blokem, výdejní štěrbinou, spodními servisními dvířky a bočním stínováním.
- **Žlutý automat:** stále původní červený horní pás `JÍZDENKY/TICKETS`, ale zřetelněji oddělený panel, displej, 28 naznačených tlačítek, samostatný slot a spodní sokl. Není domyšlen jízdní řád, logo ani konkrétní platební legenda.
- Obě čela mají nyní **320 × 768 px originální canvas textury** místo 256 × 512 px, stále jen **dva CanvasTexture objekty a přesně čtyři draw meshe** celkem. Zadní a boční plechy používají lehce kovový matný `MeshStandardMaterial`. Centrální čelní poloha a šířka obou strojů jsou beze změny. Dosazení patky k zemi se snížilo z 3,5 cm na 0,8 cm bez posunu po ulici.
- **Bílé dveře:** zachovaný původní tvar, otvor a fotopolohový `t=0.66`; doplněná jemná příčka prosklení, spodní plech a malé panty pomocí **existujících společných materiálů**, bez vlastní textury.
- **Obdélníkové okno:** zachované `t=0.14`, šířka a výška. Ztenčené členění a kamenný parapet z **0,34 m na 0,22 m do hloubky**; jeho délka a bezpečný odstup od žlutého automatu se nemění.
- **Fotoaudit na telefonu na výšku:** pouze pro URL `ticketPhotoAudit=1` se rozšíří diagnostické zorné pole, aby se oba přístroje vešly do portrétního snímku. Kamera si ponechá polohu fotografujícího a skutečný směr 110°. Úhel 105° je **pomocná obrazovková volba**, nikoliv údaj o objektivu původní fotografie.

**Nedotčené prvky:** OSM budova, skutečné geometrické kotvy dveří a okna, modelová šířka/střed strojů, střecha, průchozí vestibul, silnice, parkovací ostrov 5.76, vnější chodník, dopravní značení, cyklověž, autobusové sloupky a herní řízení. Nepřidáváme tmavý pás pod automaty ani další samolepky, dokud jejich přesnou plochu a text nebude možné potvrdit z fotografických podkladů.

**Ověřování:** `scripts/station-detail-580.test.mjs` zmrazí souřadnice a renderovací rozpočet. Původní modelové i fasádní testy běží také. Samostatný skutečný Chromium WebGL test ověřuje obě zařízení z původní GPS kamery na desktopu i na telefonu na výšku a ukládá oba snímky do GitHub Actions.

---

# Milovice RP 5.79 — odstraněna okna a parapet skrz dva jízdenkové automaty

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5790  
**Fotoaudit stejného místa:** https://foxey-cz.github.io/milovice-life-rp/?v=5790&ticketPhotoAudit=1  
**Záloha neměněné 5.78:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/578-before-station-photo-facade

## Co přesně bylo chybně a co se změnilo

Uživatelský mobilní screenshot z 15. listopadu 2026 zobrazil dva stávající PID automaty **před generickým obloukovým oknem nádraží**; jeho červený parapet doslova protínal automaty. Předchozí WebGL test kontroloval jejich viditelnost v obraze, ne vzájemné 3D překrytí s ostatní fasádou.

Na původní fotografii ŠJů ze dne **30. května 2024 (CC BY 4.0)** je přitom doložené přesné **pořadí zleva doprava: bílé dveře → oranžový automat → žlutý automat → pravoúhlé bíle rámované okno**. Zdroj: https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_automaty_na_j%C3%ADzdenky.jpg.

- Pro **jedinou fotograficky identifikovanou stěnu OSM budovy 53865956 (segment 4→5)** se nevykreslují dvě automaticky odhadnutá oblouková okna; přitom se zachovává původní **OSM obvodová stěna, kolize, základy, římsa i střecha**.
- Místo nich je na této stěně nové **bílé dveřní křídlo s prosklením** vlevo od obou automatů a **jedno obdélníkové bílé okno s parapetem** vpravo. Polohy podél 6,5m fasády jsou foto-odhadnuté, nikoli geodeticky zaměřené. Dveře jsou prozatím vizuální zavřené dveře, nikoliv vymyšlená nová průchozí trasa.
- Nová funkce `planStationPhotographedFacade` sdílí s automaty tutéž tabulku rozměrů/roztečí: ověřuje **hranice celých modelů včetně nejširšího parapetu**, ne pouhé souřadnice středů. Požaduje souvislé mezery (nejméně 12 cm), skutečný OSM wall anchor a fotografické pořadí; jinak doplněk odmítne.
- Žádná změna modelu automatů, střešní geometrie, nádražního průchodu, zeleného zastřešení, parkoviště, vnějšího chodníku, silnice, zastávek ani vozidel. Fasádní prvky používají **stejné sdílené materiály a instancované vykreslování**, žádné nové texturové soubory, žádná přidaná náhodná dekorace.
- Kontroly: `scripts/station-photo-facade.test.mjs`, existující testy fotografických automatů a živý `scripts/station-ticket-photo-webgl.mjs`; poslední také ověřuje debug informaci o **nepřítomnosti falešných okének**. Konečné vizuální potvrzení foto-stěny z více úhlů zůstává uživatelským krokem.

---

# Milovice RP 5.78 — fotografický kontrolní pohled na oba nádražní automaty

**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5780  
**Otevřít fotoaudit automatů:** https://foxey-cz.github.io/milovice-life-rp/?v=5780&ticketPhotoAudit=1  
**Nedotčená záloha 5.77:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/577-before-ticket-photo-audit

## Proč tento krok a co přesně dělá
Před přidáváním dalšího pouličního osvětlení, zeleně nebo značení je potřeba vizuálně ověřit umístění právě vytvořených dvou automatů. Fotoaudit používá **GPS původního fotografa** 50.2291625, 14.8819250 a EXIF heading **110°**, nikoliv vymyšlenou polohu automatu. Foto: **ŠJů, Wikimedia Commons, 30. 5. 2024, CC BY 4.0**: https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_automaty_na_j%C3%ADzdenky.jpg.

- URL parametr `ticketPhotoAudit=1` zobrazí pevnou diagnostickou 3D kameru z přibližné výšky očí (1,64 m), otočenou podle zdrojového směru 110°. Fotografie nemá přesně doložené parametry objektivu ani přesné zaměření automatů: srovnáváme *odhadnutý model* s fotografií, nikoliv geodetickou shodu snímků.
- V kontrolním režimu neblokuje výhled běžné herní menu vozidel, HUD ani virtuální joystick. Malý informační panel obsahuje přímý odkaz na **originální foto a licenci** a návrat do běžné hry.
- 3D streamování se pro tento režim orientuje podle **kontrolní kamery**, ne podle jiné výchozí polohy avatara. To zabrání náhodnému skrytí nádraží z důvodu vzdáleného spawnu.
- Režim zapisuje do `window.__miloviceTicketPhotoAuditRendered` počty modelů, jejich promítnutí do obrazovky, zdrojový směr a informaci, že jejich přesné pozice nejsou zaměřené. Nový Node test i samostatný scénář Chromium WebGL smoke ověřují viditelnost *obou* automatů z této kamery.
- **Žádné další lampy, stromy, ostrůvky, přechody či značky zatím nepřidáváme:** nejdříve je třeba potvrdit jejich konkrétní pozice vůči reálným fotografiím. Všechny geometrie nádraží, okolního asfaltu, parkoviště v5.76, vnějšího chodníku, cyklověže a dvou automatů v5.77 zůstávají beze změny. Normální režim kamery a jízdy je nedotčen.

**Další krok po uživatelské kontrole:** porovnat oba automaty na kontrolní URL s původní fotografií; případně upravit pouze polohy nebo vzhled těchto dvou modelů. Bez fotodůkazu neumisťovat osvětlení a zelené ostrůvky.

---

# Milovice RP 5.77 — dvě skutečně fotografované PID jízdenkové automaty na nádraží

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5770  
**Bezpečný návrat k hotovému parkovišti 5.76:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/576-before-station-ticket-machines

## Druhý průchod přednádražím bez rozbití chodníku

Po uživatelském potvrzení v5.76 začíná další fotoaudit celého nádražního okolí. Předměty bez ověřeného místa (stromy, zahradní ostrůvky a lampy) se stále NEVKLÁDAJÍ. Už hotové dva autobusové sloupky A/B, fotoověřené z roku 2024, se rovněž neduplikují. Pro tento průchod bylo možné bezpečně určit další dva skutečné objekty:

- **DVA jízdenkové automaty PID**: vlevo oranžový přístroj s tmavým ovládacím panelem, vpravo žlutý přístroj s nápisem `JÍZDENKY/TICKETS`, šedým ovládacím panelem, řadou tlačítek a výdejem jízdenek. Jejich vzhled i vzájemné pořadí dokládá konkrétní fotografie **ŠJů, Wikimedia Commons, 30. 5. 2024, CC BY 4.0**. Zdroj: https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_automaty_na_j%C3%ADzdenky.jpg.
- **Fotografická poloha**: GPS fotoaparátu **50.2291625, 14.8819250**, směr pohledu **110°**. Není to GPS automatů. Algoritmus kontroluje natočení fotoaparátu vůči skutečné budově **OSM 53865956**, konkrétně její vnější fasádě mezi uzly **4→5**. Fotoaparát je přibližně **2,01 m** před touto stěnou. Automaty jsou na ní mezi fotografovaným bílým vchodem a oknem. Jejich konkrétní rozmístění podél fasády (cca **1,0 m** odstup) a velikost jsou **odhad na základě fotografie**, nikoliv přesné zaměření.
- **Modely**: dva původní jednoduché vektorově kreslené přední panely (žádné kopie pixelů snímku), dva barevné 3D korpusy, **4 draw calls** pro oba přístroje. Podlaha je navázaná na `terrainAt`, pohledová strana ke skutečnému fotoaparátu; modely nesmějí být na silnici ani mimo původní station building anchor. Předměty neblokují fotografovaný vchod.
- **Obnovení mapy**: nová scéna má vlastní `create/reset/status` a při restartu se odebírá, aby se nic nezdvojovalo.

**Ochrana již dokončené práce:** žádná změna modelu parkoviště, vnějšího chodníku, středových parkovacích buněk, servisního průjezdu, budovy, cyklověže, střech, nádražní značky, stávajících PID sloupků nebo vozidel. Mění se jen nový izolovaný modul `scripts/station-ticket-machines.js`, jeho integrace do hry a testy.

**Zbývající přednádraží:** fotograficky viditelné osvětlení, zelené ostrůvky a další značení je třeba nejprve prostorově jednoznačně identifikovat. Staré panorama 2022 a fotografie 2024 potvrzují jejich existenci, ale přesné místo není automaticky stejné jako GPS fotografující osoby; **nedohadovat objekty podle samotného jména nebo fotky**.

---

# Milovice RP 5.76 — skutečně souvislý chodník PODÉL Nádražní, ne podle čtverců parkoviště

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5760  
**Návrat k v5.75:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/575-before-road-aligned-sidewalk

## Screenshot uživatele z 15. 11. 2026: chyba 5.75 pokračovala

Přestože byl v5.75 chodník označen za jeden souvislý ribbon, uživatel v další mobilní fotografii **stále viděl 74cm schody a výstupky na pravé hraně podél vozovky Nádražní** a oprávněně upozornil, že požadovaný **plynulý pruh podél silnice** dosud nevznikl. Snímku rovněž ukazoval krátkodobě pouze **19 FPS**, draw calls 233, 112k trojúhelníků, 13ms WebGL; nelze ale spolehlivě tvrdit, že tento konkrétní propad FPS způsobuje chodník, protože jej screenshot neprofiluje.

**Odhalena příčina:** v5.75 se sice změnil renderer na `THREE.BufferGeometry`, ale vnější bod každého příčného řezu byl nadále `sorted.at(-1).offset + .365`, tj. hrana POSLEDNÍ dlaždice. Když krajní sloupec přeskočil na sousední 0,74m pozici, polygon a obruba nadále skákaly. Pouhé propojení dlaždic samo o sobě nemohlo vizuální schody odstranit.

## Oprava v5.76

- **Skutečná osa Nádražní (OSM 128308366)** je nově přímým vstupem do algoritmu `planContinuousOuterSidewalk`, vedle obou již bezpečně odvozených komunikací kolem parkovacího ostrova. Pro každý řez chodníku se vypočítá polohově blízká osa vozovky a její boční vzdálenost, odečte se pouze **modelová šířka 7,8m + rezerva 0,40m** na straně chodníku. Tím dostává vnější hrana hladký tvar **podél silnice**, nikoliv podél jednotlivých dlažebních čtverců. Jde o **modelovou** šířku OSM obytné komunikace, nikoliv geodeticky doložené skutečné hranice asfaltu.
- **Bezpečnost:** nové vnější hrany jsou zároveň shora omezené okrajem původních **OSM-safe parkovacích buněk**. Plynulý sklon se řeší konzervativní funkční obálkou, která může chodník směrem OD asfaltu zúžit, **nikdy ne rozšířit přes již ověřené místo**. Vnitřní hrana je obdobně omezená původními parkovacími poli, takže neobsazuje silnici ani se nevrací na nesprávnou vnitřní stranu ostrova.
- **Měřitelný rozdíl:** u dlouhé střední části parku smí sousední vnější hrany chodníku měnit polohu maximálně o **0,115m na jeden 0,76m krok**, nikoliv o 0,74m. To kontroluje samostatný Node test a reálný Chromium WebGL smoke. Vnější hrana podél cesty je také monotónní, protože tam Nádražní podle mapy plynule přibližuje druhou komunikaci.
- **Pořád jeden dlouhý texturovaný povrch:** jádrem renderování zůstává sdílená dlažební textura `osmSidewalkMat` a jediná souvislá geometrie s úzkou hladkou obrubou. Na okrajích se síť rozdělí pouze tam, kde bezpečný průnik mezi sousedními parkovacími buňkami není doložen. Nulový počet jednotlivých chodníkových panelů.
- **NEMĚNÍME** asfalt na žádné komunikaci, počty a orientaci parkovacích buněk (středové a 20 protilehlých stání), budovy, cyklověž, nádraží ani jiné městské části. Nepoužíváme Mapy.com fotografie jako herní textury.

**Výkon:** tento průchod nezvyšuje počet materiálů ani instancovaných panelů. Dosavadní měření 19 FPS na telefonu bereme vážně, ale není správné jej bez skutečného profilování přiřazovat chodníku; uživatelská kontrola FPS ve stejné poloze a teplotě telefonu zůstává otevřená. Max. rozpočet lokálního doplňku **8 draw callů**.

**Poctivá hranice přesnosti:** Obrys parkoviště ani obrubníku nebyl zaměřen. Všechny posuny chodníku jsou omezeny na již schválenou aproximaci z panoramat Mapy.com 17. 5. 2022, geotagovaných Commons fotek 30. 5. 2024 a OSM vozovek. Vizuální shodu musí ještě potvrdit porovnání hry s původní fotografií ze stejného úhlu.

---

# Milovice RP 5.75 — souvislý chodník jako silnice, žádné minecraftové čtverce

**Spustit verzi 5.75:** https://foxey-cz.github.io/milovice-life-rp/?v=5750  
**Záloha před úpravou:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/574-before-continuous-sidewalk

## Důležitá uživatelská připomínka (15. 11. 2026)

Uživatel na posledním screenshotu 5.74 viděl stále **schodovité čtverce na vnějším chodníku**. Výslovně navrhl řešit chodník jako **jeden dlouhý pruh podobně jako samotnou silnici**, nikoli jako jednotlivé čtvercové modely. Předchozí 5.74 oprava upravila jen 10 rohů, což problém nezmizelo.

## Geometrie v5.75

- Středová část nádražního parkování zůstává na stejném místě: **chodník stále zabírá vnější OSM-safe parkovací řady u Nádražní, parkování je uvnitř ostrova, žádné nové kusy chodníku přes asfalt**.
- Místo původních **170 samostatných čtvercových dlažebních plošek** se buduje geometrie jako **jeden spojený podélný pás (procedurální THREE.BufferGeometry)**. V každé příčné řadě se určí bezpečné krajní hrany, na půlcestě k sousední řadě se obě hranice **průnikem bezpečných intervalů** propojí, takže rohy přecházejí diagonálně a nepřidávají žádnou dlažbu mimo dříve kontrolovanou plochu. Pokud průnik neexistuje, pás se bezpečně rozdělí místo překrytí silnice.
- Povrch používá **původní `osmSidewalkMat` s dlažební texturou** jako ostatní chodníky a souvislé UV souřadnice. Každé navázané místo sdílí stejné vertexy, tudíž nejsou v modelu švy mezi čtverci. Příslušné geometrie mají nulový počet jednotlivých chodníkových panelů.
- **Obrubník vnější hrany** je nově rovněž **jedna úzká návazná pásová geometrie**, nikoli 80+ samostatně instancovaných obdélníkových kvádrů.
- **Žádné přesuny nebo změny asfaltu.** Protilehlá zatravňovací řada parkování, centrální griddovaná dlažba, pravý přední roh, nádraží, cyklověž a celá další část hry jsou beze změn. Grafický rozpočet má maximálně **8 draw callů** pro celý tento doplněk (dvě souvislé pásové geometrie namísto jednoho pásu a řady instancovaných obrub).
- Podoba a šířky okrajů jsou stále **fotograficky podloženou aproximací** podle screenshots uživatele z Mapy.com Panorama **17. 5. 2022**, navázanou na mapované vozovky OSM **675778842** a **128308366**; 3D ani fotografická přesnost není geodeticky potvrzená a fotografie se nekopírují do textur.

**QA:** `scripts/station-photo-parking.test.mjs` kontroluje spojitý podélný ribbon, monotónnost segmentů, bezpečné průniky předem zkontrolovaných buněk, žádné samostatné panely a stále dvě části parkování. `scripts/browser_smoke.mjs` hlídá vykreslení, sdílenou dlažbu, rozpočet 8 draw callů, kontinuitu pěšího pásu a nepřítomnost vynucené pěší trasy přes silnici. Celý skutečný dojem bude teprve uživatelem vizuálně kontrolován ve hře.

---

# Milovice RP 5.74 — vyčištěné okraje chodníku a dlažby u nádraží

**Spustit:** https://foxey-cz.github.io/milovice-life-rp/?v=5740  
**Návrat na ověřenou 5.73:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/573-before-island-edge-cleanup

## Kontrola uživatelských snímků 15. 11. 2026

Na dvou nových mobilních screenshotech z **5.73** je dlouhý chodník už správně na **vnější straně parkovacího ostrova směrem k Nádražní** a nepřekrývá silnici. Zůstávají ale malé výčnělky na kraji, prosvítající zelené štěrbiny v dláždění a nepravidelné zakončení blízko vstupu. Podle současných podkladů nelze poctivě tvrdit geodetickou přesnost oblého konce; silnici proto NEPOSOUVÁME.

## Bezpečná lokální oprava

- Nový průchod kontroluje jednotlivé krajní řady dlaždic. Osamocené krajní dlaždice umí vyřadit, ale v aktuálních OSM datech **žádná taková izolovaná dlaždice nebyla nalezena (0 odstranění)**. Skutečnou viditelnou chybu tvořily spíše **schodovité přechody mezi navazujícími řadami**. Proto se jejich vyčnívající vnější rohy nyní **diagonálně seříznou směrem DOVNITŘ již bezpečného půdorysu**, bez rozšíření do asfaltu. Oprava na současných datech reálně upravuje **10 vnějších rohů**; test vyžaduje měřitelnou změnu.
- Podkladový čtverec parkovací dlažby se nepatrně rozšíří o **6 mm na každou stranu**. Stejná minimální úprava se použije na síť vnějšího chodníku. Díky tomu se uzavřou původní 1cm štěrbiny, kterými prosvítala zelená zem. Toto zvětšení zůstává **uvnitř původního 25mm bezpečnostního odsazení od mapovaných komunikací**.
- Řada nízkých obrubníků má méně viditelné mezery; vykreslení chodníku nadále sdílí standardní texturovaný materiál `osmSidewalkMat` s ostatními chodníky.
- **Beze změny**: geometrie vozovek, rozdělení středový chodník/středové parkování, protilehlá řada parkovacích stání, pravý nárožní chodník, cyklověž, nádraží, garáže a jiné objekty města. **Nepoužita žádná proprietární fotografie jako herní textura.**

**Omezení a další krok:** Dlážděná plocha a zejména **zelený klín na jižním konci ostrova** stále nemusejí přesně odpovídat skutečnému oblému konci a červenému pásu viditelnému na uživatelově panoramatu Mapy.com (17. 5. 2022). Nová verze proto NENÍ potvrzeným finálním geometrickým řešením celého parkoviště. Nejdřív je potřeba vizuálně porovnat již nasměrovanou 3D scénu, než bude bezpečné změnit koncové obrubníky nebo okolní asfalt.

**Regrese:** `scripts/station-photo-parking.test.mjs` hlídá souvislost vnějších dlaždic, neporušený půdorys vozovek a to, že uzavřené spáry nepřekročí bezpečné odsazení. `scripts/browser_smoke.mjs` navíc hlídá skutečnou WebGL vrstvu a výkonnostní rozpočet; zůstává maximálně 7 nových draw callů.

---

# Milovice RP 5.73 — chodník vzniká odebráním vnějšího pásu PARKOVIŠTĚ, nikoli na silnici

**Aktuální hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5730  
**Bezpečná záloha 5.72 před úpravou:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/572-before-sidewalk-from-parking

## Důležitá uživatelem potvrzená geometrie

Screenshot hry **5.72** z 14. 11. 2026 přímo doložil, že předchozí zásah vykreslil dlouhý chodník **na vozovce Nádražní**. Přesně vyjasněné zadání zní: **silnice nesmí být změněna, chodník leží na VNĚJŠÍ straně parkovacího ostrova u Nádražní a jeho šířka se odebere POUZE z vnějšího okraje parkovací plochy**. Potom pokračuje zbytek parkovacího ostrova směrem dovnitř. Dřívější chybné chodníky na vnitřní straně nebo za parkováním u kolejí se nesmí vrátit.

## Technická oprava 5.73

- **Přestala se vykreslovat speciálně vynucená část OSM chodníku 1165594426 přes asfalt.** Generické mapované pěší trasy zůstávají pod standardním systémem ořezávání vůči vozovkám. Stávající asfaltové komunikace OSM **675778842** a **128308366** se neměnily.
- Ostrov původně sestával z **523 buněk**, které již všechny prošly testem celé obdélníkové stopy mimo silnice, mapované pěší cesty, koleje a budovy. Rozdělením podle příčné polohy **170 buněk z vnější východní hrany** vytváří úzkou chodníkovou plochu a **353 buněk zbývá jako parkovací plocha**. Každá buňka má právě jednu roli, nikde nedochází k dvojitému překreslení parkování chodníkem.
- Texturovaný chodník se staví jako **jedna spojená výškově přiléhající síť trojúhelníků** s **identickým herním materiálem `osmSidewalkMat` a `citySurfaceKit.paving`** jako ostatní chodníky. Není to série jasně bílých 3D kvádrů a nepokrývá vozovku. Přibližná šířka běžné části **1,48 m** (dvě původní buňky); v koncích se zužuje. Za krajní bezpečnou částí má nízký obrubník, prověřovaný proti komunikacím.
- Poloha vnější strany je ověřena podle blízkosti skutečné OSM pěší trasy **1165594426**. Protože reálné obruby a hranice parkovacích stání nejsou zaměřené, jde stále o **fotograficky podloženou prostorovou aproximaci**: nepřesouváme silnici ani netvrdíme geodetickou přesnost.
- Opačná parkovací řada (20 stání), cyklověž, nádražní budova, pravé nároží příjezdu a okolní objekty zůstaly zachovány. **Žádné snímky Mapy.com se nepřevádějí do textur ani se neukládají do repozitáře.**

**Testy:** `scripts/station-photo-parking.test.mjs` kontroluje, že každé pěší pole je **mimo celé vykreslované silniční pásy**, má vysoký příčný offset na **vnější straně** ostrova, neexistuje současně jako parkoviště a je poblíž správné OSM pěší trasy. `scripts/browser_smoke.mjs` hlídá skutečnou WebGL scénu, texturovaný společný materiál a nepřítomnost starého vynuceného překryvu přes silnici. Nová dlažba přidává **jednu vykreslovací skupinu**, celkem nejvýše 7 pro fotorekonstrukci parkoviště.

---

# Milovice RP 5.72 — opravena STRANA chodníku + stejná textura jako ostatní chodníky

**Hrát:** https://foxey-cz.github.io/milovice-life-rp/?v=5720  
**Záloha 5.71:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/571-before-outer-edge-walkway-correction

## Proč byla 5.71 špatně

Uživatel výslovně potvrdil: dlouhý chodník u centrálního nádražního parkoviště má být na **VNĚJŠÍ**, nikoliv vnitřní straně. Původní v5.71 vytvořila 83 vysokých světlých kvádrů u **západního vnitřního okraje vedle servisní komunikace OSM 675778842** — tedy přesně na nesprávné straně. Uživatel následně požádal o stejnou texturu jako u ostatních městských chodníků místo zvláštních kvádrů.

## Oprava v5.72

- Chodník **OSM way 1165594426, úsek mezi uzly 4 až 7 (tři navazující segmenty)** leží na **vnější, východní straně mezi parkováním a Nádražní (OSM 128308366)**. Jeho polylinie se používá **přímo**, ne pomocí nové domyšlené paralelní osy.
- Tři reálné mapované segmenty se vykreslují přímo stávající metodou `osmStrip` se stejným **`osmSidewalkMat` a `citySurfaceKit.paving`** jako jiné chodníky. Šířka podle původního městského standardu **1,8 m**, výškově kopíruje terén. Povrch je jen nepatrně nad asfaltovou texturou, aby byl vidět i přes dříve příliš široký procedurální asfaltový buffer. **Neexistuje 83 nových bílých 3D kvádrů ani druhý vymyšlený chodník.**
- Parkovací ostrov se opět může plně rozšířit směrem k bývalé chybnému vnitřnímu pásu, jeho dlažební pole zůstávají parkováním, nikoliv přebarveným chodníkem. Druhá řada zatravňovacích parkovacích míst zůstává zachovaná. Chybně vytvořený chodník u kolejí se nevrací.
- Chodník u pravého zaobleného nároží příjezdu je zachován, stejně jako cyklověž, nádraží a další budovy.
- Mimo tento lokální doložený úsek **žádné ostatní městské chodníky ani silnice neměníme**. Ve fotografických podkladech z 17. 5. 2022 vidíme polohu pěší plochy, fotografie se nekopírují do herních textur. Přesná hranice obrubníku (šířka přechodů) zůstává orientační, čeká na další porovnání.

**Ověření:** `scripts/station-photo-parking.test.mjs` kontroluje skutečné OSM uzly/stranu a nepřítomnost starých kvádrů. `scripts/browser_smoke.mjs` kontroluje tři reálně vykreslené OSM segmenty, použití sdílené dlažební textury a zachování obou parkovacích ploch.

---

# Milovice RP 5.71 — konečně viditelný úzký chodník u parkoviště

**Nová hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5710  
**Záloha 5.70 před opravou:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/570-before-visible-sidewalk-fix

## Oprava podle mobilních screenshotů ze 14. 11. 2026

Na screenshotu 5.70 **chodník vůbec nebyl vidět**, přestože předchozí změna tvrdila, že existuje jako samostatná OSM pěší cesta. Technicky byla chyba v tom, že **parkovací buňky sahaly už od příčného odsazení 2,52 m od západní servisní komunikace**, a zabíraly plochu fotodoloženého pěšího pásu. OSM chodník **1165594426** byl v jiné vrstvě a jeho vykreslení nemohlo nahradit chybějící viditelný chodník na této hraně ostrova.

Oprava 5.71 do samostatné instancované geometrie přidává **83 navazujících betonových dílů dlouhého pěšího pásu (~63 m × 1,38 m)** v orientaci dle zmapované komunikace **675778842**, s **83 díly nízké obruby** oddělujícími pěší povrch od parkování. Parkovací dlažba se **posunula o přibližně 1,9 m směrem dovnitř ostrova**, takže zbylo **382 bezpečně umístěných polí**. Mezera mezi chodníkem a parkovacími bloky je pouhých **8,5 cm** (ne velký zelený pruh). Žádné původní parkovací pole není pouze přebarveno na chodník; jedná se o dvě samostatné fyzické plochy.

**Zachováno:** druhá parkovací řada směrem ke kolejím (20 stání), krátké pravé nároží vjezdu (OSM 1282187911), původní mapovaný chodník 1165594426, nádraží, cyklověž, garáže, železniční tratě. **Žádný chybně přidaný dlouhý chodník za železničním parkováním.** Výkonově zůstává maximálně šest instancovaných vykreslovacích skupin; bez nových textur.

**Poznámka k přesnosti:** Přítomnost chodníku podél levé hrany ostrova a jeho vizuální stranu doložil uživatel červenou anotací na panoramatu Mapy.com **17. 5. 2022**. Výše uvedená poloha a šířka jsou však **odhad** navázaný na veřejné OSM silniční osy, ne geodeticky přesné zachycení obrubníků. Mapy.com obrázky nikdy nepoužíváme jako herní textury ani neukládáme do repozitáře. Po vydání znovu porovnat mobilní 3D s fotografií z identického úhlu.

**Testy:** `scripts/station-photo-parking.test.mjs` nyní vyžaduje nejméně 60 navazujících pěších polí na západní hraně, ochranu komunikace a oddělení od parkovacích dlaždic; `scripts/browser_smoke.mjs` ověřuje skutečné vytvoření těchto instancí v WebGL spolu se zachováním nároží a druhé části parkování.

---

# Milovice RP 5.70 — opravená záměna parkovací dlažby a chodníku

**Nová hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5700  
**Bezpečná záloha původní 5.69:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/569-before-parking-surface-correction

## Proč byla 5.69 vizuálně špatně

Uživatel poslal 14. 11. 2026 dva nové screenshoty hry (v části ostrova byly **velké zelené mezery a nadměrně světlý dlouhý chodníkový pruh**), poté výslovně upozornil, že parkovací a chodníkové povrchy mohou být vzájemně prohozené. Kontrola zdrojového kódu potvrdila **sémantickou záměnu**: verze 5.69 přebarvila **249 ze 492 dlážděných parkovacích buněk** na samostatnou pěší vrstvu `centralWalkingCells`, ačkoliv úzká pěší trasa OSM **1165594426** již kolem širokého ostrova existuje a je nezávisle vykreslena základním silničním systémem.

## Oprava 5.70

- **Celá středová dlážděná plocha = parkovací povrch.** Zcela odstraněna chybná klasifikace `centralWalkingCells`, obě skutečné parkovací části se zachovaly. Pěší chodník tvoří pouze originální **OSM 1165594426**; přímo u pravého rohu zůstává fotokontrolovaná nárožní dlažba od OSM **1282187911**.
- **Dlažba už není tvořena velkými půlmetrovými podélnými panely.** Každá bezpečná oblast parkování má čtyři vlastní menší betonové bloky s úzkou spárou; podklad je téměř souvislý, takže zelený terén nemá prosvítat mezi jednotlivými dlaždicemi. Kamenný povrch i obrubníky jsou ve výšce nad okolním asfaltovým povrchem.
- **Zaoblená přední špička vydlážděného ostrova** začíná přibližně o několik metrů blíž k vjezdu; každá část stále prochází kontrolou celé stopy proti mapovaným ulicím a pěším trasám, nikoliv pouze bodovým výpočtem.
- **Druhá parkovací řada směrem ke kolejím** nadále používá zeleno-betonový rastr. Na její vnější straně nebyl obnoven nesprávný vymyšlený chodník. Nárožní chodník na pravé straně u vjezdu zůstává.
- **Výkon:** geometrie je instancovaná po materiálech, stále se maximálně šesti draw cally pro celý parkovací přídavek. Žádná fotografie Mapy.com nebyla kopírována nebo převedena do textury.

**Míra přesnosti:** OSM prokazuje středové linie cest a existenci pěší trasy; 2022 screenshoty uživatele a Commons fotografie ŠJů (2024) pomáhají porovnat povrch. Přesné obrysy, počty míst a špička ostrova zůstávají aproximací do dalšího mobilního porovnání. V žádném případě nejde o dokončenou celou ulici Nádražní.

**Ověření:** `scripts/station-photo-parking.test.mjs` musí odmítnout každé obnovení `centralWalkingCells` nebo široké náhradní pěší vrstvy. `scripts/browser_smoke.mjs` kontroluje OSM chodník, obě parkovací skupiny, nárožní dlažbu a nulový počet chybně přeznačených polí.

---

# Milovice RP 5.69 — chodníky podle červeného označení uživatele

**Nová hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5690  
**Návrat k předchozí 5.68:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/568-before-sidewalk-relocation

## Oprava konkrétní chyby

Uživatel poslal 14. 11. 2026 soubor panoramat ze dne **17. 5. 2022** a dva **červeně označené screenshoty** hry a Mapy.com. Označil dvě části, které ve hře neodpovídaly realitě: **(1) dlouhý pěší pruh uvnitř světlého středového ostrova mezi dvěma vozovkami; (2) zakřivený světlý chodník na pravém předním rohu u vjezdu.** Dlouhá uměle přidaná pěší linie u kolejí za druhou řadou parkování v 5.68 byla chybně umístěná.

- **Zcela odstraněno 77 dlažebních segmentů chybného železničního chodníku** a jeho nesprávné obruby. **20 parkovacích míst na protější železniční straně zůstává.**
- **Střední ostrov:** původních cca 492 dlažebních polí zachováno. **249 z nich je nově odděleno do světlé pěší vrstvy** podél vnitřního okraje ostrova (bez dvojité geometrie). Originální mapovaný OSM chodník **1165594426** zůstává průchozí, bez přemístění.
- **Pravý přední roh:** krátké rozšíření světlé nárožní pěší plochy odvozené z reálné OSM pěší linie **1282187911** a bezpečné strany jejího sousedství (testovaného proti všem ulicím včetně Školské). Přidáno **10 malých dlažebních polí a 5 dílů obruby**. Půdorys je fotograficky inspirovaný odhad, nikoliv přesně zaměřený chodník.
- **Žádná nová silnice a žádné kopírování Mapy.com fotografií do textur.** Počet vozovek, budov, cyklověž, nádraží, střechy, autobusové zastávky i ostatní části města zůstávají beze změn. Původní druhé parkoviště a pěší trasy chrání automatické regresní testy.

**Omezení:** konkrétní geometrie nárožního obrubníku není geodeticky vyměřena; test pouze potvrzuje vazbu na OSM, mimoúrovňové nekřížení vozovek a shodu s vyznačenou stranou. Žádná fotografie ze soukromého zdroje nebyla do repozitáře stažena.

**QA:** `scripts/station-photo-parking.test.mjs` (správná strana, původní mapované chodníky, žádný kus špatně umístěné pěší cesty, oba parkovací břehy, celoplošná kolizní kontrola) + `scripts/browser_smoke.mjs` (Chromium WebGL, rozpočet maximálně 6 instancovaných vrstev).

---

# Milovice RP 5.68 — obě části parkoviště a prostor pro chodník

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5680  
**Návrat k 5.67 před touto úpravou:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/567-before-parking-both-sides-fix  
**Starší bezpečná záloha 5.66:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/566-before-photo-pilot

## Problém a opětovná kontrola přímo proti fotografii uživatele

Uživatel upozornil, že oprava 5.67 zaplnila zelenou mezeru mezi asfaltovými komunikacemi, ale **zapomněla na protilehlou druhou parkovací řadu** a ohrozila prostor pro chodník. Na porovnání mobilní hry a panoramatu Mapy.com z **17. 5. 2022** jsou vidět nejméně tři odlišné povrchy: (1) světlý vydlážděný ostrov mezi asfaltovými komunikacemi, (2) parkování na opačné straně příjezdového průjezdu, blíže kolejím, (3) pěší chodník s obrubou podél okraje plochy. Screenshot není herní asset ani nová textura.

## Oprava bez ztráty předchozí práce

- **Uprostřed:** zůstává široká světlá dlážděná plocha 5.67, jejíž příčné hranice se odvozují od OSM **675778842** (jednosměrný servisní průjezd) a **128308366** (Nádražní). Zůstává fotograficky inspirované zaoblení špičky. Žádná nová cesta se nevymýšlí.
- **Na opačné straně průjezdu směrem ke kolejím:** vrácená oddělená řada cca **20 míst** se zeleným podkladem a betonovým rastrovým dlážděním. Identita jednotlivých stání a jejich rozměry jsou přibližné, ne geodetické.
- **Dále od jízdního pruhu:** nový samostatný **cca 1,54 m široký pěší pás** v bezpečně kontrolované mezeře za parkováním, přibližně 77 dílů a nízká obruba. Jeho přesná linie je **odhad podle fotografie, ne samostatný mapovaný OSM chodník**. Existující OSM chodník **1165594426** na druhé straně se zachovává beze změny.
- **Kolizní kontrola:** každý kandidát parkovacího místa, dlaždice chodníku i obrubníku prochází výlukou z mapovaných silnic a chodníků; další kontrola odmítá blízkost půdorysů budov a kolejí. Mezi opačnými stáními a pěším pásem je navíc vyhrazena mezera nejméně **0,45 m**. Na koleje, pod budovy ani přes silnici nové objekty nevstupují.
- **Výkon:** hromadné `THREE.InstancedMesh`, maximálně šest vykreslovacích skupin nového parkoviště, žádná individuální textura nebo kopie Mapy.com snímků. Ponechaná cyklověž, sloupky A/B, garáže, železniční nástupiště a ostatní město.

**Důležité:** OSM poskytuje osy cest, nikoliv zaměřené skutečné obrubníky a parkovací čáry. Fotografie potvrzuje **existenci typů ploch a orientační vzájemné vztahy**, ale nezaručuje jejich přesnou šířku a historický stav pro rok 2026. Zejména protilehlá řada a nový chodník čekají na kontrolu screenshotem ze hry z odpovídajícího úhlu.

**Zdroje:** fotografie parkování [ŠJů, 30. 5. 2024 (CC BY 4.0)](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B.jpg) a [druhý pohled](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B_(01).jpg), geodata OSM 675778842, 128308366, 1165594426; uživatelem dodaný screenshot Mapy.com pouze jako kontrolní reference. Změny v 3D byly nově vymodelovány, ne obrazově převzaty.

**Testy:** `scripts/station-photo-parking.test.mjs` + WebGL `scripts/browser_smoke.mjs` kontrolují obě poloviny parkování, pěší koridor, ochranu skutečného OSM chodníku, nulové překrytí jízdních pruhů a rozpočet vykreslování.

---

# Milovice RP 5.67 — oprava široké dlážděné plochy před nádražím

**Spustit 5.67:** https://foxey-cz.github.io/milovice-life-rp/?v=5670  
**Záloha hry před experimenty:** https://github.com/FOXEY-CZ/milovice-life-rp/tree/backup/566-before-photo-pilot

## Proč jsme opravovali verzi 5.66

Hráč poskytl přímé dvojité porovnání **mobilní herní scény 5.66** a **Mapy.com Panorama 17. 5. 2022**. Ve hře se mezi dvěma asfaltovými jízdními plochami nacházel výrazný **zelený klín**, zatímco reálná fotografie potvrzuje **široký světlý dlážděný parkovací ostrov s nízkým obrubníkem a zaobleným koncem**. Dosavadní modul 5.66 nesprávně kladl **25 samostatných úzkých pásů** na obě strany jedné komunikace; tím nemohl souvislou plochu vůbec vytvořit.

## Geometrická oprava 5.67

- Dvě nezávislé a přesně identifikované OSM komunikace: **675778842** (jednosměrný servisní průjezd) a **128308366** (Nádražní). Jejich vzájemná vzdálenost přibližně 8–14 m určuje **rozsah kandidátní mezery**. Žádná nová silnice se nevytváří.
- Místo 25 izolovaných pásů vzniká **souvislý fotograficky inspirovaný dlažební ostrov**, s úzkými spárami, jemnou variací barev betonových kamenů, zaoblenou jižní špičkou a nízkým obrubníkem. Půdorys a špička jsou **odhady podle fotografií**, nikoli geodetické zaměření.
- Přes **490 instancovaných dlažebních prvků v 87 příčných řadách**, dvě sdílené materiálové dávky a jedna dávka obrubníků: **maximálně 3 draw cally**. Pro každý dlažební prvek se kontroluje celý obdélník vůči **všem silnicím a chodníkům OSM** a rohy vůči budovám a kolejím. Povrch respektuje výškový terén.
- Ponechána nádražní budova, skutečná cyklověž a její vnitřní výztuhy, nástupiště, autobusová stanoviště A/B, garáže, ostatní budovy, kolize i doprava. **Žádné dodatečné fotografie ani screenshoty Mapy.com nebyly kopírovány do herních textur nebo do GitHubu.** Původní vlastní geometrie je odvozena z OSM, dovolených veřejných fotografií a proporčních pozorování. Přesnost stále čeká na uživatelský 360° vizuální audit.

**Původní licencovaná fotodokumentace:** [Wikimedia – milovické nádražní parkoviště](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B.jpg) a [druhý pohled](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B_(01).jpg) (ŠJů, CC BY 4.0, 30. 5. 2024). Panorama uživatele slouží ke kontrole nesouladu, jeho obrazové bajty ani strojové deriváty se neukládají.

**Automatická QA:** `scripts/station-photo-parking.test.mjs`, součást GitHub Actions, a prohlížečový WebGL smoke test. Fyzická realita je ověřená v rozsahu konkrétního viditelného prvku; nejde o dokončenou celou Nádražní.

---

# Milovice RP 5.66 — skutečné dvoustranné parkování před nádražím

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5660  
**Nádražní inventář celé ulice:** https://foxey-cz.github.io/milovice-life-rp/survey.html?id=old%3AN%C3%A1dra%C5%BEn%C3%AD

## Fotografické doklady a skutečná mapová osa

- [Milovice, nádraží, parkoviště.jpg](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B.jpg), ŠJů, **30. 5. 2024**, CC BY 4.0, kamera **50.2297692, 14.8823936**, azimut 200°.
- [Milovice, nádraží, parkoviště (01).jpg](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B_(01).jpg), stejný autor, datum a licence, kamera **50.2296525, 14.8823131**, azimut 200°.
- Obě fotografie zobrazují **asfaltový průjezd a parkovací stání po obou stranách**, světle šedé zatravňovací/rastrační betonové tvárnice, obrubníky a v blízkosti železniční provoz. Kamera stojí u **skutečné OSM jednosměrné servisní komunikace way 675778842** (průměrná kolmá odchylka kamer od osy 0,27 a 1,16 m). Zaměření přesných hran jednotlivých stání dostupné není; **počet míst ani jejich hranice není tvrzen jako geodeticky přesný**.

## Skutečně provedená změna

Nová 3D vrstva `scripts/station-photo-parking.js` staví na tomto konkrétním OSM úseku cca **25 viditelných parkovacích panelů**, po dvou stranách přístupové komunikace. Materiál je vlastnoruční procedurální 3D geometrie: **700 nízkých světlých dlažebních segmentů** na zeleně prokresleném podkladě a subtilní betonové obruby, pouze **3 InstancedMesh / 3 draw cally**. Počet panelů je modelovací aproximace, nikoliv doklad oficiální kapacity parkoviště.

Každý celý parkovací obdélník se kontroluje proti všem načteným **OSM vozovkám a pěším cestám**; další vzorkování odmítá kandidáty u **budov a provozních železničních kolejí**. V testech projde **25 z 26 navržených panelů** (13 na jedné straně, 12 na druhé), jedno odmítnutí kvůli prostorové kolizi. Kandidáti na parkující auta z původního provozního systému zůstali nezměněni; **nepřidáváme auta z fotografie roku 2024 jako pevné kulisy**, abychom netvrdili jejich aktuální přítomnost.

Zachována cyklověž 5.64 se všemi 52 interními nosníky, autobusové sloupky A/B 5.65, stříška nástupiště, nádražní budova, obě řady opravených garáží a ostatní město. Nebyly přidány stromový ostrůvek, dvojramenná lampa, parkovací značka ani zábradlí: jsou na fotografiích viditelné, ale **jejich přesné kotevní polohy jsme ještě neodvodili z nezávislého podkladu**.

**Kontrola:** `scripts/station-photo-parking.test.mjs` ověřuje identitu OSM komunikace, GPS obou fotografií, obě řady, 2D vůle a zachování předchozích vrstev; GitHub Actions WebGL smoke ověřuje skutečné vykreslení a limit tří draw callů. Mobilní 360° kontrola stále není dokončená. Neodvozujeme stav roku 2026 ze snímků roku 2024.

---

# Milovice RP 5.65 — fotografické přednádraží, směrové tabule autobusových stanovišť A/B

**Spustit hru:** https://foxey-cz.github.io/milovice-life-rp/?v=5650  
**Zkontrolovat zastávky:** https://foxey-cz.github.io/milovice-life-rp/?inspect=1&v=5650

Po verzi 5.64 (vnitřní ocel cyklověže) je další ověřenou částí přednádraží dvojice skutečných zastávkových sloupků **A na Nádražní** a **B na 5. května**. Jejich přibližná GPS poloha už v projektu pochází z **fotografií sloupků ŠJů z 30. 5. 2024** a zůstala beze změny. Nově jsou na obou **původních** sloupcích jiné, čitelnější, vlastnoručně kreslené směrové jízdní tabule s řádky přestupu podle oficiálního [schématu PID Milovice, žel. st.](https://pid.cz/wp-content/uploads/mapy/uzly-region/Milovice.pdf), **platného od 15. 12. 2024**.

- **A:** 430 Park Mirakulum / Lysá nad Labem; 432 Lysá nad Labem; 434 Park Mirakulum / Benátky nad Jizerou.
- **B:** 430 Balonka / Lipník; 432 Balonka / Mladá Boleslav; 434 Balonka / Straky / Nymburk; 497 Kostomlaty nad Labem / Nymburk.
- Tabulky jsou původní vykreslená grafika; **fotky ani PDF PID nejsou vložené jako textury**. Fyzický rozměr a vzhled zůstávají aproximací, přesné rozměry panelů nebyly zaměřeny. **Linkové směry jsou doložené schématem z roku 2024, nejde o potvrzení aktuálního jízdního řádu v listopadu 2026.**
- Původní 3D poloha sloupků zůstala, stejně jako kontroly výluky z OSM silnic a chodníků. Nepřidala se neověřená lavička, lampa, schodiště, parkoviště, keř nebo jiný nový objekt. **Cyklověž 5.64, garáže 5.63, nádražní stříška, domy i ostatní ulice zůstaly bez zásahů.**
- Test station-forecourt-pass.test.mjs hlídá konkrétní A/B linky a směry, neexistující zastávky a dosavadní kolizní pravidla.

**Stav:** další ověřený krok při stavbě celé Nádražní. Fyzická přesnost tabulí a vizuální porovnání hry s reálným přednádražím ještě vyžadují 360° kontrolu; změny jiné než zastávkové tabule tato verze netvrdí.

---

# Milovice RP 5.64 — fotopodložené detaily cyklověže u nádraží

**Spustit hru:** https://foxey-cz.github.io/milovice-life-rp/?v=5640  
**Identifikace objektů:** https://foxey-cz.github.io/milovice-life-rp/?inspect=1&v=5640  
**Přehled celé ulice:** https://foxey-cz.github.io/milovice-life-rp/survey.html?id=old%3AN%C3%A1dra%C5%BEn%C3%AD

Po uživatelském potvrzení 17 správně modelovaných garáží jsme se přesunuli k další **fotograficky zdokumentované části přednádraží**, konkrétně ke skutečné **cyklověži BIKETOWER BT 2.2** podle výrobce (realizace 2021). Ve veřejných fotografiích Nádražní z 30. 5. 2024 je doložena skutečná věž s průhledným pláštěm a viditelnou vnitřní konstrukcí. Zdroje: [ŠJů na Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg) (CC BY 4.0); [BIKETOWER – Reference a mapa](https://www.biketower.cz/reference-a-mapa/).

**V herním 3D:** již existující objekt OSM **way 1011197691** má uvnitř skleněné věže nově viditelnou ocelovou soustavu s **52 instancovanými příčkami a výztuhami**, vykreslovanou **jedním dodatečným draw callem**. Je to fotograficky inspirovaný konstrukční princip, **přesné délky a rozmístění všech vnitřních tyčí nejsou geodeticky změřeny**. Nezměnil se OSM půdorys, výška, vchod, silnice, zastávky, přístřešek ani garáže. Fotografie nebyly kopírovány jako textura.

**Bez nepodloženého umisťování:** Wikimedia Commons obsahuje snímek „Milovice, nádraží, schodiště z Nádražní“, ale v našich stávajících OSM datech se nepodařilo nalézt samostatnou odpovídající trasu `highway=steps` poblíž stanice. Schody, zábradlí a nová parkovací místa proto nebyly vymýšleny.

**Testy:** `scripts/bike-tower-interior.test.mjs` (OSM, reálný fotopodklad, jediný draw call, 52 interních prvků, validita rozměrů) přidán do GitHub Actions. Test ochrany před chybou neznámého typu garážových dveří 5.63.1 dál funguje a není přivázán k zastaralému číslu verze.

**Stav:** fotograficky podložený typ vnitřní ocelové konstrukce, ale konkrétní rozmístění je aproximace. Zbývá srovnání 360° ze hry. Kompletní Nádražní je stále rozpracovaná, nikoli finálně schválená.

---

# Milovice RP 5.63.1 — HOTFIX: mapa se znovu načítá

**Opravená verze hry:** https://foxey-cz.github.io/milovice-life-rp/?v=5631

Screenshot uživatele z 14. listopadu 2026 zachytil kritickou regresi 5.63: **„3D mapa se nenačetla: Unknown door family garage-photo-2022“**. Příčina byla přesná a reprodukovatelná: nové modely fotograficky podložených garáží zapisovaly do `recordEntranceGrade` neexistující identifikátor `garage-photo-2022`, ale registr podporuje standardní typ `garage`. Vyvolaná výjimka přerušila kompletní načítání starých Milovic a zůstala jen prázdná hra s chybovým hlášením.

Ve verzi 5.63.1 je volání opravené na `recordEntranceGrade(grade,'garage',osmId)`. **Fotografické zdroje (panoramata z 17. 5. 2022), všechny 17 hnědé garážové modely a štěrkový dvůr zůstávají zachované.** Jejich provenience je i nadále v samostatném registru `window.__milovicePhotoGarageCourt`; nemá se zneužívat názvů interních typů dveří.

Nové testy: `scripts/entrance-grade.test.mjs` kontroluje všechny používané názvy typů proti skutečnému registru, takže nová neznámá kategorie CI zastaví. `scripts/nadrazni-photo-garage-court.test.mjs` nyní na **skutečném výškopisu ČÚZK DMR 4G** vypočítává všechny vchody 17 garáží a ověřuje prahy i minimální světlé výšky. Prověřena také syntaxe stránky a živá logika chyby v izolovaném běhu; opravovaný typ prošel.

**Poznámka:** přímý vykreslovací test na mobilu a automatický stav nasazení GitHub Pages nejsou nezávisle potvrzené; screenshot nové verze je nutný pro vizuální QA.

---

# Milovice RP 5.63 — fotograficky podložené řadové garáže Nádražní

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5630  
**Identifikace budov:** https://foxey-cz.github.io/milovice-life-rp/?inspect=1&v=5630  
**Mapa bloku:** https://www.openstreetmap.org/#map=19/50.230396/14.883489

## Nová důkazní fáze

Uživatel dodal **10 vlastních screenshotů z panoramat Mapy.com ze 17. května 2022**, které přímo ukazují **dvě protilehlé řady 17 číslovaných garáží**, hnědá svisle profilovaná vrata, světlé betonové sloupky, nízké tmavé vodorovné střešní zakončení a mezi řadami rozlehlý **štěrkový dvůr**. Orientační prvky v pozadí (věž kostela a vysoký cihlový komín se svislým nápisem AUTOSERVIS) odpovídají situaci severně od kostela. Tato skupinová fotografická dokumentace **silně podporuje přiřazení** k 17 OSM objektům v severní Nádražní; přesné číslo vrat **není zatím spárováno s konkrétním OSM way ID**.

### Co je skutečně změněné ve 3D

- **17 půdorysů OSM** bylo společně porovnáno: **7 v jedné řadě, 10 v protilehlé**. Dveře se nyní modelují jen na doložených **krátkých cca 3m stranách** obrácených do společného dvora, nikdy do souběžné dlouhé společné zdi.
- Doložený vzhled: **hnědé kovové dveřní panely s úzkými svislými žebry**, **světlé dělicí sloupky**, nízké **hnědé ploché zastřešení**, drobný zámek. Nejsou vymyšlena žádná okna mezi vraty.
- **Štěrková/zemitá plocha** místo rovnoměrného trávníku, jen uvnitř plochy mezi OSM průčelími. Jeden optimalizovaný DEM-přiléhající mesh, přibližný rozsah **14,2 × 20,5 m**.
- Žádná čísla vrat přidělená odhadem, žádné náhodné ploty, stromy nebo zaparkovaná auta; je potvrzená jejich existence na fotografiích, nikoliv přesné lokální pozice.
- Vlastní proceduralní barvy, textura štěrku a instancované detaily. **Fotografie Mapy.com nejsou rehostovány ani použity jako textura.** Titulky na dodaných snímcích: © Seznam.cz, a.s. / Cyclomedia Technology B.V.

Fotografie jsou datované **17. 5. 2022**, takže tento vzhled **není automaticky potvrzen pro rok 2026**. Aktuální stav, číslování jednotlivých OSM ID, zadní strany, umístění plotů a zeleně stále čekají na ověření. Zachován nástroj **🔎 Objekt** z verze 5.62. Ostatní šedé budovy z předchozích screenshotů nebyly pozměněny.

**Technika:** `scripts/nadrazni-photo-garage-court.js` je čistý OSM+foto plánovač, `scripts/nadrazni-photo-garage-court.test.mjs` hlídá 17/17 prvků, 7+10 řad, přesnou orientaci, souvislý dvůr, pořadí OSM polygonů a nepřiřazování neověřených čísel vrat. Test je zapojen do GitHub Actions. Více v [REBUILD 2.0](docs/REBUILD-2.md).

---

# Milovice RP 5.62 — zjisti OSM ID přímo klepnutím na budovu

**Otevřít hru s aktivním identifikátorem:** https://foxey-cz.github.io/milovice-life-rp/?inspect=1&v=5620  
**Běžná hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5620

Zkušenost s posledními screenshots ukázala, že se u kostela a Nádražní nachází několik různých řad nízkých budov. Odhady jen podle podobné šedé fasády vedly k chybnému upravování a skrývání úplně jiných objektů. Nově je přímo ve 3D hře plně funkční **tlačítko 🔎 Objekt**. Po aktivaci se klepnutím na skutečnou zeď či střechu zobrazí **přesné OSM way ID**, název a účel pouze **podle OSM**, světová GPS pozice a odkaz k otevření skutečného prvku v mapě. Je možné zkopírovat ID a souřadnice do chatu. Klávesové ovládání a kamerová rotace fungují; velké tažení kamerou není interpretováno jako výběr objektu.

**Důležité:** Jde o spolehlivé propojení **konkrétního herního modelu s jeho OSM ID**, nikoliv o potvrzení skutečného vzhledu. Fotografie stále musí zachycovat přímo danou stavbu a současný stav; OSM tag „garage“ není fotografický důkaz. Bez něj zůstává objekt provizorní a neděláme nezdokumentované detaily.

**Kandidátní skupiny, které se nesmí zaměňovat:**
- [Severní Nádražní: 17 samostatných OSM ways](https://www.openstreetmap.org/#map=19/50.230396/14.883489), střed 50.230396, 14.883489.
- [Dukelská: 7 samostatných OSM ways](https://www.openstreetmap.org/#map=19/50.229744/14.886733), střed 50.229744, 14.886733.
- [Východní část: 8 samostatných OSM ways](https://www.openstreetmap.org/#map=19/50.226192/14.890987), střed 50.226192, 14.890987.

Zdroje pro konkrétní čelní stěny těchto řad nebyly fotograficky potvrzeny. Žádné další budovy nebyly odstraněny ani předělány.

Technické soubory: `scripts/osm-building-inspector.js`, `scripts/osm-building-inspector.test.mjs` a napojení v `index.html`. Raycast určuje první **skutečnou modelovou polygonální stěnu** v dosahu 180 m, nikoliv nejbližší OSM adresu. Regresní testy byly přidány do automatických GitHub Actions.

---

# Milovice RP 5.61 — vráceno 17 omylem skrytých budov

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=5610  
**Mapa dotčené oblasti:** https://www.openstreetmap.org/#map=19/50.23040/14.88345  
**Foto-kontrola Nádražní:** https://foxey-cz.github.io/milovice-life-rp/survey.html?id=old%3AN%C3%A1dra%C5%BEn%C3%AD

**Oprava chyby předchozí verze 5.60:** Omylem jsme vyřadili **17 OSM objektů** ze severní části Nádražní (dvě řady okolo 50.2304, 14.88345), přestože uživatel upozorňoval na **jiné šedé stavby na screenshotu**. Tyto objekty už opět mohou vstupovat do 3D světa v jejich staré **legacy, nefotograficky ověřené podobě**. Nejde o vizuální schválení nebo nové modelování; historický algoritmus vymyšlených „vylepšených vrat“ 5.59 se **nevrací**.

- **17/17 OSM objektů znovu vykreslováno**, se zachováním půdorysů, původních renderovacích dat a kolizí.
- Žádné jiné objekty neodstraněny ani nově nehádány, především ne budovy z uživatelových screenshotů.
- Veřejný QA přehled je stále označuje jako **fotograficky neověřené**. Pozastavené zdroje 5.60 se převedly do režimu `legacy-restored-awaiting-photo`.
- Test `scripts/photo-verification-policy.test.mjs` zabraňuje opětovnému omylu se skrýváním, ověřuje výběr všech 17 ID a zajišťuje, že výhledové fotografické schvalování bez reálné fotografie neprojde.
- Celý zbytek města zůstává pod fotografickým pravidlem REBUILD 2.0: **OSM není důkaz o fasádě, oknech, účelu ani aktuálním stavu**.

**Neuzavřený problém:** Šedé budovy s velkými tmavými dveřmi na původních screenshotech nebyly dosud ztotožněny s konkrétními OSM ID; nelze je odstraňovat naslepo.

---

# Milovice RP 5.60 — fotografické důkazy jsou povinné

**Spustit hru:** https://foxey-cz.github.io/milovice-life-rp/  
**Průzkum celé Nádražní:** https://foxey-cz.github.io/milovice-life-rp/survey.html?id=old%3AN%C3%A1dra%C5%BEn%C3%AD

## Oprava původní chyby

Verze 5.59 odhadovala podobu a umístění vrat 17 domnělých garáží v severní části Nádražní podle OSM tagu `building=garage` a rozměrů půdorysů, nikoli fotografií. Uživatel správně zpochybnil i samotný typ objektů. **Žádný ze 17 objektů nebyl jednoznačně identifikován na fotografii.** Verze 5.59 proto **není platným vizuálním výsledkem rekonstrukce**.

Verze **5.60**:
- Stáhla všech **17 neověřených 3D modelů z aktivní scény** – včetně fasád, oken, vrat, střech a kolizí. OSM mapové záznamy i jejich geometrie jsou zachované pro pozdější kontrolu; netvrdíme, že tam nemůže nic stát.
- Neověřené OSM záznamy jsou v [mapovém průzkumu Nádražní](survey.html?id=old%3AN%C3%A1dra%C5%BEn%C3%AD) označeny jako **„typ stavby neověřen“**, nikoli jako fotograficky potvrzené garáže.
- Odstranila 5.59 **geometricky hádaný plánovač vrat** a jeho testovací očekávání. Nahradila je modulem `scripts/photo-verification-policy.js` a automatickými testy `scripts/photo-verification-policy.test.mjs`.
- Žádnou fotografii garáže na **jiné adrese v Milovicích** nesmíme použít jako fotografický důkaz těchto 17 konkrétních objektů.

## Závazný postup pro všechny další ulice a objekty

1. Nejdřív konkrétní místo (fotografie, ideálně panoramatické prohlížení, více směrů a podklady s datem), ověřit jednoznačnou identitu proti OSM a okolním orientačním bodům.
2. Až po fotografickém ověření modelovat **celý objekt a každou jeho doloženou viditelnou část**: objem, materiály, fasády, střechy, okna, vchody, ploty, vybavení, povrchy, chodníky, zeleň, značky – nikoli náhodné generické detaily.
3. OSM smí být použito na **polohu a přibližný půdorys**, ale samotný OSM tag **neprokazuje skutečný typ, podobu ani aktuální existenci** budovy.
4. **Bez průkazné fotografie = neověřeno, neprohlašovat za dokončené a nevymýšlet vzhled.** Sporné modely lze dočasně vynechat z 3D a evidovat v kontrolní mapě.
5. Zobrazení z více stran (360°), datování fotografie a kontrola proti herní kameře. Opravené modely testovat na kolize, výšku vchodů, návaznosti střech, cesty, objekty celé ulice a FPS.

**Rozpracovaná předchozí zástavba města je LEGACY a čeká na retroaktivní fotografický audit.** Tato verze nevypíná bez rozmyslu celé staré město ani zachované herní funkce; cíleně blokuje právě 17 zpochybněných staveb. Konkrétní starší model není fotograficky schválen jen proto, že už ve hře existuje.

Pracovní dokumentace: [REBUILD 2.0](docs/REBUILD-2.md).

---

# Milovice RP 5.59 — severní Nádražní: 17 garáží v řadách

**Spustit hru:** https://foxey-cz.github.io/milovice-life-rp/  
**Interaktivní QA celé ulice:** https://foxey-cz.github.io/milovice-life-rp/survey.html?id=old%3AN%C3%A1dra%C5%BEn%C3%AD

**Skutečná 3D změna v ulici:** na severní Nádražní je podle půdorysů OpenStreetMap vyznačeno 17 jednotlivých garáží v **dvou protilehlých řadách**. Dřívější renderer vybíral 5,85m nejdelší stěnu, ačkoli to bývá sousední společná zeď. Verze 5.59 vybírá **kratší ~3m čelní fasádu**, která se orientuje směrem do prostoru mezi řadami, a umisťuje na ni terénně usazená sekční vrata a vodorovné pásy.

- Využity existující OSM tvary všech 17 garáží a skutečné vnější normály.
- Algoritmus **vyžaduje mapované párové řady**, neumisťuje dveře do společných zdí; pokud chybí podklady, nepřidá žádný odhadovaný detail.
- Žádná nová nezdokumentovaná parkovací plocha, komunikace, dopravní značení ani zeleň. **Poloha vrat na čelní stěně je geometry-driven odhad**; konkrétní barevnost/typ vyžaduje fotografie.
- Společná instancovaná architektura ponechána, bez nového velkého počtu draw callů.
- Přidána automatická kontrola `scripts/nadrazni-garage-court.test.mjs` do GitHub Actions; ověření počtu 17, výběru krátkých stěn, protilehlosti řad, pořadí vrcholů OSM a průběhu při neúplném mapování.

**Předchozí dokončená fáze:** 5.58, krátká stříška nad železničním vyústěním průchodu nádražím (zatím provizorně přijatá). Zbytek Nádražní stále čeká na 360° fotografické srovnání a opravy budov, chodníků, parkování, vegetace a ostatních prvků.

Podrobné stavební poznámky: [REBUILD 2.0](docs/REBUILD-2.md).

---

# Milovice RP 5.58 — opravená stříška PŘÍMO nad průchodem nádraží

**Hra:** https://foxey-cz.github.io/milovice-life-rp/  
**Mapa Nádražní:** https://foxey-cz.github.io/milovice-life-rp/survey.html?id=old%3AN%C3%A1dra%C5%BEn%C3%AD

Na základě upřesnění, že má být krytí **v části nad průchodem**, byla opravena předchozí 5.57, která chybně upřednostnila nejdelší vzdálenou železniční fasádu (cca 15 m). Nová 5.58 kotevní bod vypočítává **přímo z mapované pěší trasy procházející nádražím**, OSM 1550920096. Vyústění ke kolejišti leží na zalomení železniční fasády budovy OSM 53865956, sousedí s OSM nástupištěm 549346219. Kryt nyní zabírá dvě souvislé stěnové části, každou cca 3,2 m, celkem **6,4 m nad vyústěním**, ne vzdálených 15 m podél kolejí.

- Stříška zůstává na **nástupištní straně**; chybná boční stříška od silnice/cyklověže se nevrací.
- Sdílený 3D podklad budovy, konzolové držáky bez sloupů na zemi; **tři renderovací skupiny**.
- Napojení obou částí má výpočet sjednocené vnější normály a automatický test proti **škvírám**.
- Je to modelově/fotograficky odvozená konstrukce. Přesnou délku, materiál a tvar je potřeba potvrdit kontrolou aktuálních fotografií a ve hře z úrovně kolejí.
- Při chybějícím OSM průchodu se stříška vůbec negeneruje, místo aby si hra vybrala jinou náhodnou fasádu.

**Původní záznam verze 5.57 níže je již překonaný.**

---

# Milovice RP 5.57 — PART 12: první fyzický REBUILD Nádražní

**Spustit hru:** https://foxey-cz.github.io/milovice-life-rp/  
**Průzkum celé Nádražní:** https://foxey-cz.github.io/milovice-life-rp/survey.html?id=old%3AN%C3%A1dra%C5%BEn%C3%AD  
**Přehled rekonstrukce všech ulic:** https://foxey-cz.github.io/milovice-life-rp/rebuild.html

- Nová **3D stříška přímo nad železničním nástupištěm**, ne na straně Nádražní/cyklověže. Půdorys je ukotvený na skutečné OSM budově 53865956 a nástupišti 549346219 (shelter=yes). Pro aktuální mapu vychází jeden souvislý úsek cca **15 m**, přibližný přesah 2,2 m.
- Lehká horní plocha, podhled a instancované kovové konzoly (celkem **3 draw cally**), žádné blokující sloupy uprostřed průchodu. Sdílí skutečnou modelovou základní výšku nádraží a hlídá bezpečnou vzdálenost od kolejí. Chybná boční stříška zůstává odstraněná.
- Podklad: [historická fotografie nástupiště z roku 2013](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_n%C3%A1stupi%C5%A1t%C4%9B.jpg) od Palickap (CC BY-SA 3.0) + OSM. Přesný vzhled i současný stav stále vyžadují 360° kontrolu, nejde o geodeticky přesnou rekonstrukci.
- Testy: `scripts/station-platform-canopy.test.mjs` a `scripts/rebuild2-survey.test.mjs`, zapojené do GitHub Actions. Zkouší orientaci, chybějící podklady, výškové napojení, kolizní rezervu a přítomnost stříšky **výhradně u nástupiště**.
- Nádražní **je stále rozpracovaná jako celá ulice**: další fáze jsou komunikace, oba chodníky, nástupní stanoviště, přilehlé domy a drobné předměty. Předešlé modely ani hráčský postup se nemažou.

Podrobný průběh: [REBUILD 2.0](docs/REBUILD-2.md).

---

## Milovice RP 5.36.0 — společná rovina fasád pro celé město

Po hráčské 360° kontrole se ukázalo, že dveře, okna, sklo, lišty a výlohy na mnoha domech **viditelně levitují**. Starší generátor posouval například vrstvy běžného okna **0,38 / 0,405 / 0,43 / 0,49 m** před půdorysovou zeď; domovní dveře **0,60 m**; některé obchodní výlohy 0,4–0,8 m.

**Systémová oprava, nikoli jeden barák:**
- Nová čistá geometrie `scripts/facade-anchors.js`: `exteriorFacadeFrame` odvozuje normálu skutečné venkovní zdi z orientace OSM polygonu (funguje pro obrácený směr bodů, rotované budovy a L/U výklenky, kde může heuristika přes těžiště vybrat špatnou stranu); `flushBoxOffset(depth)` umisťuje zadní stranu kvádru cca **8 mm u povrchu zdi**, `FACE_PLANE` drží lehké předsazené skleněné plochy cca **24 mm** u zdi.
- **Všechny běžné domy, panelové domy a garáže**: čtyři vrstvy oken (omítkový rám, sklo, sloupek a parapet), dveřní výplně, lišty, sokly, fasádní pásy, průmyslové brány a garážová vrata sdílejí stejnou skutečnou rovinu své stěny. Nic nezískává výsuvný náhodný offset podle indexu domu nebo rohu.
- **68 hero domů**: sklo se nachází **uvnitř skutečného otvoru ve zdi**, rám a parapet se opírají o stěnu; stejná orientace polygonu řídí i dříve opravené souvislé sokly. U domů s reálným výřezem už se navíc nesmí vykreslovat druhý fiktivní provizorní vstup.
- **Významné budovy a obchody**: Mírová 36 a další pojmenovaná prodejna, komerční fasády a výlohy, kostelní okna i okna nádraží nyní využívají tenké skutečné zasklení, samostatné rámovací lišty a fasádně kotvené pozice, místo velkých neprůhledných desek často plovoucích před zdivem. Nádraží přitom používá známou tloušťku modelové zdi 32 cm, takže jeho rám vychází z vnějšího povrchu této zdi, nikoli z její střednice.
- **Automatická ochrana budoucích domů**: `scripts/facade-anchors.test.mjs` ověřuje normalizaci a odsazení na podkladové mapě **684 OSM budov**, obrácených/otočených půdorysech a konkávních výklencích. Záměrně ignoruje fyzikálně neviditelné katastrální hrany kratší než 8 cm. GitHub Actions a Chromium WebGL smoke sledují skutečné počty, `maxLegacyFaceGap`, `anchoredOpenings`, `maxFrameDetachment` i zdrojové výlohy. Nemodeluje nové detaily bez podkladu.
- **Výkon:** vše používá původní instanced/chunked batching. Žádné hledání nejbližší zdi za každým snímkem; společná geometrie se vyřeší jen při sestavení města. Při samotné změně umístění se nepřidává žádný nový draw call na dům.

**Poctivé omezení:** u nedoložených domů zůstávají okna jen tenké vizuální překryvy **na plné zdi**, protože bez fotografického podkladu nelze hromadně správně vyříznout neznámé okenní otvory. Fotorealistické členění jednotlivých fasád a kontrola z telefonu je další krok. Tento update řeší hlavně **odstup od skutečné stěny**.

---

## Milovice RP 5.35.0 — kontrola fotoreality po 9 uživatelských snímcích (Part 9)

**Východisko:** majitel projektu poslal 9 pohledů ze hry v telefonu, GPU hlásila **70–99 FPS**. Je důležité neodvozovat z těchto hodnot garantovaný výkon. Místo dalšího přidávání náhodných detailů se porovnávaly modely s konkrétními historickými fotografiemi ŠJů z 30. května 2024: [Modrá hvězda, Mírová 11](https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_11,_hotel_Modr%C3%A1_hv%C4%9Bzda.jpg), [Mírová 36](https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_36.jpg). **Fotografie zachycují rok 2024, neaktuální stav roku 2026 není zaručen.**

- **Modrá hvězda**: původní černá obdélníková deska zábradlí (2.96 × .99m) byla nahrazena jedenácti rozestupy svislých kovových tyčí a tenkým horním madlem. Horní balkonové dveře již nejsou zakryté plnou bílou deskou; mají skleněnou plochu a samostatné lišty. Vedlejší průčelí mělo druhou nezávisle odhadnutou mřížku pozic oken (`len/4.7`) přes primární řadu oken (`len/3.6`), z čehož vznikaly plné červeno-bílé falešné vchody. Druhá neprůhledná vrstva byla **odstraněna**. Nárožní vstup už nemá velký umělý červeno-bílý obdélník. Tmavý sokl odpovídá charakteru doložené fotografie lépe než křiklavě červený pás.
- **Mírová 243/36**: pravidelný štít už nedrží dvě volně rotované desky s nesprávnou pevnou výškou `.94m`, ale používá **tentýž uzavřený geometrický plán** jako dvojice štítů na Školské. Tři doložené obdélníkové vikýřové/skylight prvky jsou **tenké 3D povrchové plochy s výškou vypočtenou z reálně vykreslovaných střešních trojúhelníků**; nemažou obloukové zasklení Školské ani nejsou natočené podle náhodného úhlu. Tvarové podklady a pozice zůstávají odhadnuté. Nízký stříhaný plot se snížil z 1.12 na .76 m.
- **Oba domy**: generické vnější okapové tyče/podélné komíny vytvořené na základě čísla hrany (každá druhá stěna) se nevykreslují pro fotografické modely, které mají vlastní okraj střechy. Pozor na drobné další štítové/okapové nepravidelnosti, které vyžadují ruční 360° srovnání.
- **Celé město**: původní `osmStreetLabels()` generoval až 18 nepodložených **osmimetrových modrých billboardů** s názvy ulic uprostřed silnice, včetně předchozího screenshotu „5. května“. Odstraněny **všechny**, protože OSM obsahuje název ulice, nikoliv přítomnost takové cedule. Názvy ulic zůstávají v HUD/mapě; budoucí značky musí mít georeferenci a fotografii.
- **Testy**: `scripts/street-photo-block.test.mjs` nově zkouší výšku každého vrcholu střešního okna proti průběhu skutečné střechy, absenci falešných dveří, průhledné balkonové zábradlí, nízký živý plot a nulové 8m billboardy. Browser smoke přímo ověřuje 3 reálné sklonově dosazené střešní prosklení a souvislý štít, chybějící billboardy a nový vstup.

**Žádný nový plošný detail na všech 684 domech nebyl vymyšlen.** Na nedoložených domcích zůstávají provizorní okna i barvy a bude třeba získat jejich správné fasádní zdroje.

---

## Milovice RP 5.34 — první viditelná přestavba fotografického bloku (Part 9)

Tato etapa dělá změny **v samotné hře**; rozšíření editoru z 5.33 je již hotovo. Základem jsou tři půdorysy OSM propojené s fotografiemi ŠJů z 30. května 2024, dostupnými pod CC BY 4.0 na Wikimedia Commons. Rozměry z fotografií jsou **odhadnuté**, nikoli měřené.

1. **Mírová 243/36 (OSM 202367254):** hlavní obvodové zdi byly v předchozím modelu příliš vysoké (6,75 m, jako plnohodnotné druhé podlaží). Nynější **odhad výšky okapu 4,15 m** odlišuje jedinou plnou úroveň od podkrovního štítu; celkový hřeben je cca 6,7 m včetně valby. Štítové okno se rozšířilo na tři vertikální tabule, střešní okna se modelují v **počtu tří**, nikoli dvou, a nesmějí přesáhnout skutečné OSM stěny. Přibyly dva nízké živé ploty na viditelných návratech. Původní plošná výloha a neověřená hluboká markýza byly nahrazeny třemi skleněnými sekcemi s bílými rámy a úzkou římsou. Přesné umístění prosklení je stále **vizuální aproximace**, nikoli odměřený stavební výkres.
2. **Modrá hvězda (OSM 202367194):** zachovala oranžovou dvoupodlažní hmotu a nárožní balkon. Oproti starému modelu má **obloukový rám v horní části nárožního vstupu** inspirovaný původní fotografií; odstraněna byla velká smyšlená tabule „MODRÁ HVĚZDA“ nad vstupem, kterou na referenční fotografii nevidíme.
3. **Školská 220/1 (OSM 118487980):** zůstává poslední vyzkoušená celistvá střecha se dvěma arched front gables; nová systémová vylepšení se nedotýkají jejích fotografických výřezů.
4. **Společné materiály 68 detailních domů starého jádra:** `scripts/facade-surface-kit.js` generuje **3 sdílené, deterministické 128px textury**: jemnou fasádní omítku, mikrovzorek tmavého soklu a světelné pruhy na oknech. Původní schválená barva i OSM geometrie jsou zachovány. Materiály jsou sdílené mezi instancemi a chunkovanými zdmi, ne 68 dalších draw callů; žádné stažené fotografické pixely ani náhodná nová okna.

**Technické kontroly:** `scripts/street-photo-block.test.mjs`, `scripts/facade-surface-kit.test.mjs`, GitHub Actions a Chromium WebGL smoke ověřují základní mapované půdorysy, střešní okna, minimální rozpočty textur, stav fasád a odstraněné smyšlené detaily. Nový přístup je použitelný pro další fotograficky schválené budovy: nejdřív doložit zdroj, teprve pak přidat konkrétní členění.

**Nedokončeno:** přesné okno-za-oknem fasády, skutečné výšky ze zaměření, většina ostatních z 684 budov a návaznost na skutečné chodníky. Fotografie mají roku 2024, neprokazují stav v listopadu 2026. Vizuální kontrola na telefonu po publikaci je nezbytná.

---

## Milovice RP 5.33.0 — Photo-first streets: první dávková rekonstrukce bez vymyšlených detailů

**Problém:** hra měla na mnoha nezmapovaných fasádách náhodně rozeseté okenice, markýzy a balkony. Z pouhého čísla parcely, počtu podlaží nebo pořadí domu ve výčtu OSM se ale existence těchto detailů nedá zjistit.

- `scripts/hero-architecture.js`: generované okenice jsou možné **pouze pokud individuálně potvrzená fasáda má `shutters===true`**. Vymyšlené markýzy nad každými nedokumentovanými dveřmi jsou vypnuté. Schválená okna, dveře, barvy a geometrie z `verified-buildings.json` fungují dál.
- `index.html`: pro ostatní, nedetailní budovy je globálně vypnuté rozmísťování okenic a balkonů podle `index%4`, `j%2` či `j%3`. U panelových domů se opakující se balkon nevytváří jen podle toho, že existuje nadzemní okno. Vlastní doložené vizuální detaily hotelu, Školské a dalších jednotlivě řešených budov zůstávají.
- Výkon: rušíme nepotřebné renderovací instance, místo abychom přidávali další objekty. Zachovány fasádní otvory, střechy 5.32, sokly a navigace.
- Diagnostika `window.__miloviceCityUnverifiedFeatures` sleduje `suppressedRandomShutters` a `suppressedRandomBalconies`; `window.__miloviceHeroArchitecture` sleduje `suppressedUnverifiedPhotoOrnaments`.
- `scripts/street-photo-block.test.mjs` a WebGL smoke test hlídají, že se plošná náhodná výzdoba nevrátí.

**Poctivý stav:** odstranění nesprávně vymyšlených dekorací a nová fotografická knihovna neznamenají, že 684 domů má nyní realistické všechny fasády. Okna a dveře na nedoložených stavbách zůstávají provizorní. Pro 1:1 modely se musí doložit konkrétní snímek a úhel pohledu.

---

## Milovice RP — uliční fotografický audit 5.33 (Part 9)

Dlouhodobý plán: **přestavovat po ulicích**, ne trávit deset kol ručním záplatováním jedné střechy. Na mapové části `/editor.html` byl přidán **předvýběr archivních fotografií zdarma, bez Mapillary tokenu**, s důsledným oddělením dostupnosti fotografie od ověření fasády.

- `scripts/street-photo-evidence.js` obsahuje 8 datovaných veřejných zdrojů (Wikimedia Commons 2024 a jeden historický z roku 2014), licenci, autora a doložené GPS umístění kamery tam, kde je zdroj známý. Přesné spojení se záznamem budovy lze doložit jen u **3 pojmenovaných domů**: Školská 220/1 (OSM 118487980), Mírová 243/36 (202367254) a Modrá hvězda (202367194). U ostatních snímků je záměrně jen informace **fotografie v okolí, obsah neověřen**.
- Ulice mají přehled kandidátních snímků; **📸 Další s podkladem** přejde na další dům s fotografií v okolí. U každého domu je v pravém panelu seznam zdrojů se souřadnicově doloženou přibližnou vzdáleností, datem, autorem a licencí, plus odkaz na originál.
- Tlačítko **Použít jako kandidáta zdroje** přidá pouze URL pro zvolený směr fasády. Stav zůstane **Neprohlédnuto**: žádné okno, dveře, štít ani barva se automaticky nevytvoří z pouhé blízkosti snímku.
- Aktuální audit katalogu ukázal, že z **684 budov** základní mapy má **104** do 135 metrů od centroidu alespoň jeden z těchto archivních snímků (pozor: **ne 104 fotograficky ověřených budov**). Kompletní fotografický / 360° průzkum těchto domů stále chybí. Knihovna se má rozšiřovat po uličních blocích, teprve potom schvalovat skutečné geometrické úpravy.
- Katalog, výběr, příprava zdrojového odkazu, absence tichého 3D schválení a celé OSM pokrytí jsou kontrolovány v `scripts/street-photo-evidence.test.mjs`, GitHub Actions a testu skutečného editoru.

Zdroje pocházejí z veřejných stran Wikimedia Commons a jsou pouze odkazy; soubory fotografií se nekopírují do herního repozitáře. Autoři ŠJů (CC BY 4.0) a Tiia Monto (CC BY-SA 4.0). [Ukázková kategorie snímků 5. května](https://commons.wikimedia.org/wiki/Category:5._kv%C4%9Btna_(Milovice)).

**Následující rekonstrukční krok:** pro každý z 3 doložených domů přiřadit konkrétní čelní a boční fotografie správným fasádám a získat dostatečně přesné otvory; sousední domy bez identifikované fotografie ponechat jako viditelně provizorní modely. Nepřidávat nové vymyšlené „reálné“ objekty.

---

## Milovice RP 5.32.2 — souvislé sokly a lišty i na opravovaných zdech

Závada z uživatelských 360° snímků Školské: krátký zaplněný roh fasády měl béžovou zeď, ale spodní tmavá lišta/sokl končila před ním. Nešlo o chybu hlavního střešního algoritmu, ale o další předčasný návrat ve vykreslovači detailních fasád.

- V `scripts/hero-architecture.js` se sokl a horní vodorovná lišta nyní generují jednotným `planFacadePerimeterTrims` pro **každou nedegenerovanou vnější hranu půdorysu**, včetně krátkých návratů pod 3 metry. Jeden úsek dostane jednu sadu lišt, nikoli dvě.
- Na úsecích kratších než metr se teď vytváří i fyzická stěna; starý limit 1 m ji mohl vynechat.
- Lemování používá stávající instancované materiály `base` a `sill`; nové úseky tudíž nezakládají nový typ draw callu na budovu. Mírné přesazení v rozích kryje pohledové škvíry.
- Pro ostatní, nedetailní budovy pokračují již existující lišty `foundationBand`, `panelPlinth`, `blueStarRed` a `schoolRed` i na krátkých hranách bez vymyšlených dveří a oken.
- Jednotkové kontroly `scripts/facade-perimeter.test.mjs` projdou všechny evidované OSM obvody, otočené směry a skutečný 1,2m návrat Školské. WebGL smoke test kontroluje soulad počtu uzavřených zdí a lemovaných úseků přímo ve vykreslované scéně.

Odpovídá to **spojitosti** již použitých detailů, nikoli fotogrammetricky ověřené podobě každé budovy. Individuální vzhled fasád a střech podle skutečných fotografií zůstává samostatný krok.

---

## Milovice RP 5.32.0 — AUTOMATICKÁ OCHRANA VŠECH DALŠÍCH STŘECH (Part 9)

Podnět: pět hráčských screenshotů ukázalo, že Školská 220/1 stále měla výrazné černé střešní klíny a svislé mezery. Oprava jednoho konkrétního domu by neřešila další budovy.

- **Společný předletový geometrický test:** před vykreslením KAŽDÉ sedlové/valbové střechy se přezkouší výškový rozdíl mezi jejím plánovaným okapem a skutečným polygonálním OSM obvodem. Obdélníkový generátor s výrazným rozdílem není povolen.
- **Bezpečná náhradní geometrie:** nepravidelný valbový půdorys s rozdílem nad 10 cm přejde na adaptivní střechu, jejíž okap sleduje přesně skutečné zdi a jejíž střešní trojúhelníky jsou v hranicích budovy. Opakované výškové body sdílejí stejnou hodnotu a nemohou vytvořit škvíru na společných hranách. Dílky jsou omezené geometrickým rozpočtem. Pokud ani náhradní model nelze bezpečně sestavit, ponechá se jednoduchý plochý model místo nedoloženého pokrouceného.
- **Jednotné okapy a stěny:** sdílené geometrické funkce u nepravidelných střech používají výšku skutečného obvodu místo výšky hypotetického obdélníku. Odstraňují tak velké falešné trojúhelníkové nástavby. Okapové pásy se kontrolují na obrácené/self-intersecting plochy; je-li geometrie chybná, nevykreslí se vadný přesah.
- **Vikýře:** napojení zezadu používá výšku skutečné vykreslované hlavní střechy; už ji nevypočítává podle staré nesouvisející roviny.
- **Regresní brána:** `scripts/perimeter-roof-envelope.test.mjs` kontroluje obdélníky, L/T/U tvary, zkosené domy, obrácené pořadí a otočení bodů, reálných 7 hran Školské 220/1 i kompletní inventář **684 OSM budov** (nedostatečné/chybné půdorysy se výslovně evidují). GitHub Actions test nepustí zelený build, pokud se znovu objeví visící okap nebo nespárovaná výška sousedních trojúhelníků.
- **Měřitelná diagnostika:** `window.__miloviceCityRoofAudit.perimeterSafeFallbacks` počítá přepnuté budovy; `maxRejectedEaveGap` původní rozdíl, `maxRenderedEaveError` maximální zbývající rozdíl.
- **Zachovaný výkon:** bezpečná náhradní střecha se generuje jen jednou na objekt, bez výpočtu v každém snímku, a má omezený počet dílků.

**Důležité:** Geometricky čistá střecha není zaručeně skutečný historický tvar. Fotografie/3D podklady jsou nadále potřeba pro individuální správné hřebeny, úžlabí a vikýře. Model nádraží zůstává samostatný a nezměněný; tato oprava řeší obecné domy. Reálná vizuální kontrola telefonu a FPS po vydání je stále nutná.

---

## Milovice RP 5.31.1 — střešní obálka bez dvojitých ploch (Part 9)

- **Opravená hlavní chyba všech běžných střech:** hra dříve po vytvoření sedlové/valbové střechy přidala také druhou rovnou desku na úroveň okapu. Výsledkem byly průniky, tmavé klíny, překryté spodní části střech a pohledově obrácené plochy. Rovná střecha se teď vytvoří **jen pokud nevznikla žádná šikmá**; dům má právě jednu hlavní střešní plochu.
- **Společný spoj zdiva a střechy:** výpočet střešní roviny podél skutečného OSM obvodu uzavírá případné svislé mezery pod šikmou střechou, včetně členných a otočených půdorysů. Žádné výplně přes vymyšlené výřezy půdorysu.
- **Mobilní výkon:** výplně se skládají do existujícího systému dávkovaných fasád (materiál + 120m oblast), místo aby se vytvářel nový renderovací objekt pro každý domek. Dočasné výpočetní plány střech se po použití odstraňují.
- **Zachované výjimky:** dokumentovaná výpravní budova má svůj vlastní model a fotograficky upravená Školská 220/1 dál používá speciální sdílený výřez vikýřů/okapů.
- **Kontrola:** nové regresní testy kontrolují jedinou střešní plochu, napojení na obvodové stěny, L-půdorysy, otočené a obrácené vrcholy. V prohlížeči je dostupný `window.__miloviceRoofEnvelopeAudit` (počet střech, uzavřených spár, přidaných trojúhelníků). **Nejde o tvrzení, že všech 684 mapovaných staveb už věrně odpovídá fotografiím.** Typy střech zůstávají orientační až do doložení skutečným pohledem.

---

## Milovice RP 5.28.8 — ČISTÉ NAPOJENÍ STŘECH NÁDRAŽÍ (Part 8)

- **Žádné tmavé „schůdky“ na každém uzlu:** přesahy střech vytvářejí koncová čela jen na skutečně otevřených koncích u vyvýšené středové části; spojité úseky OSM zůstávají spojité.
- **Tašky a podbití sledují střešní roviny:** okapová část se při výpočtu rozdělí přesně na jednotlivé sedlové/valbové plochy. Žádné pokřivené čtyřúhelníky přes hranice sklonu.
- **Bez falešných bílých štítů:** nižší křídla nedostávají štukové uzávěry na umělých hranách jejich rozdělení. Vyvýšená část si zachovává svou skutečnou stěnu až ke střeše.
- **Odstraněná nepravá vodorovná okapová lišta** pod šikmým okrajem; okapní hranu nyní tvoří spojitý model střechy a podbití.
- Zachováno **32cm orientační přesazení, 10cm podbití, průchod nádražím, fasády, OSM terén a mobilní rozpočet vykreslení**.
- Testy kontrolují členité L-půdorysy, obrácené řazení vrcholů, rovinnost každého střešního trojúhelníku a absenci zbytečných uzávěrů. Podoba nádraží je stále fotografická aproximace, nikoli zaměření skutečných rozměrů.

---

## Milovice RP 5.28.7 — PŘESAHUJÍCÍ STŘECHA BEZ ŠKVÍR (PART 8)

- **Nádraží má skutečný 32cm přesah střechy přes obvodové zdi.** Přesah je konstrukční a není náhradou za předchozí vyplnění mezer podle sklonu střechy.
- **Uzavřené podbití a čelo:** střešní tašky, souvislá spodní plocha a tmavá okapová hrana tvoří jeden uzavřený tvar, aby nebylo vidět skrz.
- **Žádný přesah na falešných hranách:** tři části nádraží sdílejí původní OSM obvod; střešní přesah se neobjeví na virtuálních hranicích oddělujících střed od křídel.
- **Rohy:** omezování délky napojení, aby u nepravidelných půdorysů nevznikaly nové špičaté flapy.
- **Výkon:** tašky, podbití a čelo mají na jednu část po jedné dávkované geometrii; ne desítky jednotlivých 3D objektů.
- **Kontroly:** automatické geometrické testy úplného podbití, falešných hran, nepravého přesahu, L-půdorysu a prohlížečová WebGL kontrola.
- Přesah je vizuální aproximací (32 cm), nikoli přesným změřením stavby.

---

## Milovice RP 5.28.6 — DOKONČENÍ STŘECH NAD ZDMI NÁDRAŽÍ (PART 8)

- **Oprava děr:** u členitých a šikmých částí OSM půdorysu může sedlová/valbová střecha ležet nad rovnou hranou zdi. Nový modul přesně vypočítá její skutečnou výšku podél celého obvodu a vytvoří chybějící štukovou výplň pouze v existující mezeře.
- **Bez nové vymyšlené střechy:** výplň přesně sleduje stávající sklon všech střešních rovin; je po částech rozdělena i v místech změny roviny, nesmí přesahovat půdorys ani zakrýt průchod nádražím.
- **Tři části stanice:** levé a pravé přízemní křídlo a vyvýšená střední část. Nové trojúhelníky se pro každou střechu slučují do jediného 3D objektu, aby se FPS zbytečně nezhoršovaly.
- **Regresní ověření:** L-půdorys, sedlová i valbová střecha, obrácené pořadí rohů, nepřesahující geometrie a plná WebGL kontrola po nasazení.
- Geometricky navazující střecha neznamená, že byl její skutečný tvar již změřen podle 360° fotografií. Na to navazuje samostatný program budova po budově.

---

## Milovice RP 5.28.5 — PŘESNĚJŠÍ STŘECHY A LEPŠÍ VÝKON (PART 8)

- **Sedlové střechy se nepřidávají na falešně obdélníkové domy.** Kontroluje se pravoúhlost, délky a rovnoběžnost stěn i orientace hřebene. Nepravidelné čtyřúhelníky dostanou bezpečnější valbu či jednoduchou střechu.
- **Střecha a štít používají stejnou geometrickou kontrolu**, takže nepodpírané trojúhelníkové štíty už nevzniknou pouze z počtu čtyř OSM vrcholů.
- **Napojení střech na fasády:** u běžných sedlových a valbových střech snížen původní odstup od horní hrany z 6,5 cm na 1,2 cm. Proti z-fightingu zůstává malá rezerva.
- **Výkon:** šetří se zbytečné alokace 3D geometrie rovné střechy, která se při vykreslení sedlové/valbové vůbec nepoužila.
- **Regresní testy:** pravoúhlé a otočené domy, prohozené pořadí OSM bodů, kosodélníky, lichoběžníky, téměř čtvercové a členité půdorysy.
- Oprava geometrie **neznamená, že fasády nebo skutečné střechy už odpovídají fotkám**. Stále platí [plán postupné přestavby všech 684 budov základní mapy](docs/building-rebuild-program.md).

---

## Milovice RP 5.28.4 — GLOBÁLNÍ OPRAVA STŘECH + PLÁN PŘESTAVBY VŠECH BUDOV

- **Všechny běžné sedlové a valbové střechy** prošly na nový generátor založený na skutečném OSM půdorysu. Hřeben se orientuje podle skutečných stěn, plochy nemohou přesahovat za půdorys a nesmějí vznikat náhodné invertované černé trojúhelníky. Konkrétní reálný sklon bez fotky ale stále neznáme.
- **Vikýře na Školské 1 a Mírové 36:** opravené sklonové znaménko. Dvě střešní desky se správně zvedají k hřebeni místo trčení ven do vzduchu.
- **Staromilovické domy:** štíty se řídí stejnou osou jako skutečná střecha, nikoli náhodným pořadím rohů. Komíny automaticky vymýšlené na každém třetím domě jsou pryč.
- **Celé město:** odstraněny další smyšlené střešní větrací budky na každé páté budově a automatické reklamní stříšky nad neověřenými obchodními fasádami.
- **Připravená evidence 684 OSM budov**: [data/architecture/building-audit-queue.json](data/architecture/building-audit-queue.json) a [program kompletní přestavby podle skutečných fotografií](docs/building-rebuild-program.md). 44 prioritních budov v okolí nádraží, 86 u 5. května/Mírové a dalších 554 v širším jádru. Jde o první známá mapová data, ne nutně všechny budovy ve všech rozšířených regionech.
- V OSM chybí zaměřené výšky a tvary střech **u všech 684 budov**; proto geometrické zlepšení neznamená, že se už všechny podobají realitě. Kompletní realistické fasády, dveře, okna, stromy a chodníky se musí ověřovat postupně pro každou budovu.
- Nové unit testy kontrolují přetočené a obráceně řazené půdorysy, konkávní domy, orientaci vikýřů a úplnost mapového soupisu. Chromium WebGL test pořizuje kontrolní snímky i dvou domů s dříve rozbitými vikýři.

---

## Milovice RP 5.28.3 — opravy podle sedmi screenshotů nádraží

- **Opraven modrý nápis MILOVICE:** byl zrcadlově otočený a visel nad bočním koncem u cyklověže. Přesunutý na dlouhou fasádu směrem ke kolejím, otočený správným směrem a usazený níž pod střechu. Z opačné strany už nebude vidět text pozpátku.
- **Konce obou nízkých střech** již nemají otevřený černý sedlový trojúhelník: kompaktní valbové ukončení zachovává střešní tašky a přesné ořezání podle půdorysu OSM.
- **Průchod nádražím:** odstraněný nedoměřený bílý půlkruh, který protínal vlastní překlad. Nyní čistý rovný překlad a boční pilíře bez kolize s mapovanou trasou chodců.
- Přidané regresní testy pro otočení a polohu cedule, průchod i střešní křídla. Geometrické střešní testy zachovány. Současné rozměry jsou přiznaně fotografické odhady.
- Fotografie pro srovnání: [Stellwerke.info – nádražní fasáda](https://stellwerke.info/stw/stw.php?id=22402).

---

## Milovice RP 5.28.2 — OPRAVA ROZBITÉ STŘECHY NÁDRAŽÍ

- Opravená skutečná příčina velkých béžových „trojúhelníků“ a divokých přesahů: každé křídlo nádraží si dříve odvozovalo **jinou osu střechy**. Prostřední nástavba měla střechu dokonce skoro o 90° otočenou a střešní desky překračovaly půdorys.
- Kompletně nový výpočet 3D střech: všechny tři části sdílejí **jednu osu celé nádražní budovy** a střešní plochy jsou **přesně ořezané na mapovaný půdorys OSM**. Dvě nízká křídla mají sedlové, střední zvýšená část valbovou střechu. Žádné vymyšlené obří štíty, střešní plachty a desky na chodníku.
- Nové automatické geometrické testy ohlídají plochu, polohu a sklon každého střešního dílu, včetně rohového půdorysu. Browser test navíc ukládá **pět screenshotů střechy** kolem celé budovy.
- Průchod, cyklověž, původní obvodové stěny, navázané OSM chodníky a železniční nástupiště zůstávají. Přesná architektonická shoda se všemi reálnými fotkami je stále cílem, nikoli zatím prokázaným faktem.

---

## Milovice RP 5.28.1 — kamera už při přesunu neprolétává zemí

Při kontrole **skutečných screenshotů z Chromium WebGL** jsem odhalila chybu, kterou automatické testy přehlédly: po přesunu například na 5. května se kamera mohla pomalu posouvat od minulého místa a na chvíli ukazovat černý spodek terénu. Nově se při výběru jiné oblasti **okamžitě přemístí do správné výšky za postavou**. Při obyčejné chůzi a jízdě zůstává kamera plynulá. WebGL test teď čeká na dokončené usazení kamery a kontroluje její výšku, než pořídí záběr.

---

## Milovice RP 5.28.0 — fotoprůchod nádraží a ulice 5. května (13. 11. 2026)

- Zúžená **zvýšená střední část milovického nádraží**: fotografie ukazuje mnohem menší jednopatrovou nástavbu než původní herní velký blok. Model teď dostal kratší čtyřstrannou taškovou střechu a dvě střídmá horní okna pouze na skutečných obvodových stěnách; nikdy na umělých hranách mezi částmi stavby.
- Přízemní oblouková okna dostala **bílé příčky a vodorovné členění** místo souvislých modrých tabulí. Modrá cedule „Milovice“ na straně kolejí je zmenšená podle fotografického vzoru. Vše je přiznaně přibližné.
- Na 5. května (2014 fotografický podklad) nebyla vidět vůbec žádná bílá souvislá čára ani středové přerušované značení. **Zrušené automatické čáry i přerušované pruhy** na všech ulicích, kde chybí přesný podklad; pouze mapované přechody se dál vykreslují. Silnice a jízda zůstaly.
- Podklady: [fotografie nádražní budovy](https://stellwerke.info/stw/stw.php?id=22402), [Nádražní 2024](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_autobusov%C3%A1_zast%C3%A1vka_a_cyklov%C4%9B%C5%BE.jpg), [5. května 2014](https://commons.wikimedia.org/wiki/File:Milovice_-_5._kv%C4%9Btna.jpg). Fotografie nejsou použity jako textury; přesné rozměry zůstávají k ověření.

---

## Milovice RP 5.27.4 — žádné náhodné obdélníky chodníků a čáry na obytných ulicích

- U supermarketů Billa, Tesco, Penny a dalších zmizela automaticky generovaná **dlažba 8 × 4,2 m** a dvě náhodně umístěná stojanová kola/stojany před každým obchodem. Neznali jsme jejich skutečné pozice; někde mohly zasahovat až do cesty nebo překrývat chodník. Mapované OSM chodníky zůstávají.
- Na obytných ulicích včetně Nádražní už hra automaticky nekreslí dva bílé krajní pruhy, když nemáme ověřenou skutečnou vodorovnou značku. Silnice a doprava zůstávají funkční.
- Audit má regresní testy pro skutečné pěší cesty, Nádražku a nové zakázané fiktivní plochy. Dokumentace uvádí, co je pouze odhad a co je doložené.

---

## Milovice RP 5.27.3 — odstraněná falešná zelená stříška ze strany nádraží

Podle screenshotů hráče jsme odstranili **zelenou stříšku vedle cyklověže a na špatné straně nádraží**, její ocelové sloupy, vzpěry, žebra a s ní související domyšlený pás dláždění. Fotografie zachycovala zastřešení skutečného železničního nástupiště **na protější straně**, nikoli tuto boční konstrukci.

Nádraží, průchod, původní střecha budovy, nádražní název, autobusové zastávky, cyklověž a mapované chodníky zůstávají. Zastřešení vrátíme až po dokladovaném ověření místa, ne pouhým odhadem. Kontroly: WebGL smoke + testy v GitHub Actions.

---

## Milovice RP 5.27.2 — Nádražka není vedle nádraží

- Opravený poslední přehlédnutý zbytek: automatický generátor dával na boční koncové stěny nádraží neověřená okna, takže prostředí působilo jako vymyšlená boční kavárna. Tyto dekorace se nyní na koncové fasády nevkládají ani v přízemí, ani ve vyšším patře.
- Nádražka **není samostatný 3D objekt ani boční přístavek**. Pouze v mapě zůstává označení uvnitř čekárny poblíž správného mapovaného přístupu; jde o orientační bod, ne tvrzení o poloze konkrétních dveří.
- Hlavní orientační bod v plné mapě se jmenuje **Nádraží Milovice** bez spojeného označení Nádražky. Obrys stanice, podloubí, chodníky, střecha a zelený přístřešek nástupiště se zachovávají.
- Historické zdroje: [Nádražky.eu](https://www.nadrazky.eu/hospoda.php?hospodaID=100273), [Železničář 08/2022](https://zeleznicar.cd.cz/assets/zeleznicar/zeleznicar_08_2022.pdf).

---

## Milovice RP 5.27.1 — fotorealističtější střecha nádraží

- Střecha **nádražní budovy** má nyní červenou taškovou texturu a matný materiál, nikoli plechové pásy. Barevný a materiálový podklad: [fotografie výpravní budovy ŠJů](https://stellwerke.info/stw/stw.php?id=22402).
- Ocelové **zastřešení nástupiště** zůstává zelené a oddělené. Textura je již existující původní herní grafika, ne kopie fotografie, a nepřidává GPU texturu navíc.

---

## Milovice RP 5.27.0 — skutečná pěší osa skrz nádraží (13. 11. 2026)

- **Zásadní oprava vstupu:** našli jsme opomíjenou OSM cestu **1550920096** vedoucí přímo mezi oběma stranami nádražní budovy, navázanou na venkovní cestu **549346217**. Průchod se neodsouvá o ~2 m jen proto, aby se vešel do jedné části fasády. Správně se rozdělí stěny i přes jejich společné rohy.
- **Dlažba a přístupy:** podlaha v průchodu se konečně posouvá *spolu s průchodem*; předtím zůstávala v podélném středu budovy. Zmizely čtyři odhadované propojovací pruhy dlažby — mapované pěší cesty už skutečný spoj obsahují.
- **Věrnost:** vstupní body vycházejí z OSM, nikoli z tvrzení, že máme centimetrově přesné fotografie. Přesná šířka a dekorativní fasáda vyžadují další měření. Kontrolováno jednotkovým testem i browser WebGL + kolizními sondami; mobilní výkon chrání stávající batching a LOD.

---

## Milovice RP 5.15 — mobilní výkon / optimalizace 27 FPS (13. 11. 2026)

Po hlášení **27 FPS na telefonu** byla priorita přesunuta od přidávání výzdoby k obnově plynulosti. Oprava je zaměřena na reálné náklady GPU, nikoli na prázdné tvrzení o 60 FPS. Číslo z konkrétního mobilního zařízení nelze garantovat bez měření na tomto zařízení.

- **Mobilní detekce:** samostatná kontrola dotykového GPU; předchozí pravidlo `(pointer:coarse) and (max-width:850px)` nezahrnovalo některé telefony otočené na šířku (např. 853 CSS px). Dotykový joystick se kvůli kompatibilitě nemění.
- **Automatická kvalita:** v základním vyváženém režimu měří FPS po 1,2 s, při 2 po sobě jdoucích hodnotách pod 36 FPS postupně sníží vykreslované DPR až na 0,72, dohlednost detailů a aktivní oblast města. Po 6 stabilních vzorcích nad 52 FPS zase kvalitu po krocích obnovuje. Nenastává zběsilé přepínání ani zásah do rychlosti postavy či fyziky.
- **Vzdálené objekty:** mapové budovy dál existují v plné geometrii, ale na telefonu se město vykresluje z přibližně 300–440 m místo celých 620–1000 m, jakmile adaptivní profil vyhodnotí pomalý běh. Vzdálená okna, balkony, střešní doplňky a vegetace mizí dříve než budovy, které jsou na očích. Mlha skrývá přechod. Desktop zachovává dosavadní dohlednost.
- **První fotografický blok:** originální štíty, rooflighty a jiné díly jsou nyní sloučeny do společné geometrie podle materiálu, aby 48 samostatných meshů znamenalo výrazně méně samostatných GPU draw calls. Photo-detail skupiny nově podléhají stejnému chunk cullingu jako okolní budovy. Reset oblasti odebere vlastní skupiny a zamezí kumulaci kopií při opětovném načítání.
- **Manuální „Vysoká kvalita“:** vědomá volba hráče stále dovolí dražší stíny a větší dohlednost. Automatické snižování je určené jen pro vyváženou kvalitu.
- **Ověření:** Node test profilového hysteretického přepínání, mobilní Chromium smoke s WebGL a kontrolou výchozího dohledového budgetu, základní jízdní testy a zachování dříve přidané geometrie i ověřených karet.

**Důležité:** výsledek na opravdovém telefonu se musí změřit. Pokud FPS zůstanou u 27, diagnostika v levém rohu ukazuje FPS, draw calls, počet trojúhelníků a aktuální render rozlišení. Tento údaj pomůže rozhodnout, zda další brzdou je GPU, CPU, provoz GLB modelů nebo doprava.

---

## Milovice RP 5.14 – reálná přestavba první skupiny budov (13. 11. 2026)

Konečně nejde o nové menu: v okolí **Mírová × 5. května × Školská** jsou přímo ve 3D městě přestavěné tři existující budovy se specifickými **foto-doloženými** vnějšími prvky (Školská 220/1, Modrá hvězda a Mírová 243/36). Do společné databáze přibyly **3 zdrojově ověřené karty**. Vedle starších částí dostaly nové modelované štíty, střešní okna, římsy a nízké živé ploty. Podrobnosti, zdrojové fotografie a meze přesnosti: [První uliční blok](docs/street-pass-01.md).

---

## Milovice RP 5.13 — Shared Street Architecture: natrvalo vydané domy

Stavební editor doposud používal výhradně místní `localStorage`; změny byly vidět jen ve stejném prohlížeči. Nově hra automaticky načte společný verzovaný manifest `data/architecture/verified-buildings.json` a smíchá schválené údaje s lokálními náhledy.

- **Publikované budovy:** manifest je součástí GitHub repozitáře a po nasazení ho při otevření hry čtou všichni. V současné výchozí verzi je záměrně **PRÁZDNÝ**: žádná budova nebyla publikována bez nezávislého ověření skutečných zdrojů. Údaje z automatických testů o smyšlené fasádě nejsou zaneseny do skutečné městské databáze.
- **Kontrola zdrojů:** každá veřejně schválená budova musí mít validní OSM ID, ověřený zdroj pro svoje geometrické údaje, stav `verified` a ruční revizi (`review.approved`, autor revize, datum a shrnutí kontroly). Nesprávný nebo chybně strukturovaný manifest nesmí rozbít spuštění hry. Všechny schválené záznamy jsou pod verzovacím systémem Git.
- **Lokální náhled:** změny uložené v editoru stále fungují okamžitě po restartu hry na témže zařízení. Kde lokální záznam obsahuje jen jednu změněnou fasádu, nepřepíše výšku, barvy a další ověřené strany z veřejné databáze.
- **Přenos do města:** editor umožní stáhnout dávku ověřených domů pro nezávislou revizi a následné začlenění do společného manifestu. Export není oprávnění k automatickému publikování. Schválené dávky lze po revizi zapsat do manifestu a jednorázově vydat celou ulici.

**Omezení:** první vydání 5.13 vytváří trvalou infrastrukturu, ale nijak automaticky nepotvrdí správnost fotografií. Zdrojová kontrola musí probíhat pro každou budovu; geometrie z fotek je stále přibližná podle přesnosti půdorysu/výšky. Přenesené informace mohou mít licenční a atribučně podmíněný původ.

---

## Milovice RP 5.12 – Automatická obhlídka ulic a fasád (13. listopadu 2026)

Stavební editor nyní podporuje prohlídku **celé vybrané ulice**, nikoliv jen jednoho ručně vybraného domu. V sekci „Automatická obhlídka ulice“ lze s použitím veřejného **Mapillary klientského tokenu** spustit kontrolu snímků pro aktuální dům nebo všechny domy na jeho ulici. Pro každý dům se používají existující mapované OSM půdorysy a směr jeho jednotlivých fasád. Procházení města je implementováno přes oficiální `https://graph.mapillary.com/images` API s malými ohraničujícími oblastmi (maximálně 24 dotazů na uličku na jedno ruční spuštění).

- Mapillary poskytuje GPS, směr pohledu, typ kamery, datum, autora a případnou miniaturu snímku. Náš výběr seřadí kandidáty podle vzdálenosti a vhodného směru ke konkrétní fasádě, přičemž u 360° snímků respektuje možnost otočení.
- Editor zobrazí možná pokrytí domů a fasád a výběr dostupných náhledů. **Shoda metadat NENÍ vizuální ověření domu!** Před použitím je nutné konkrétní záběr prohlédnout. U obrázků je odkaz na původní snímek, jméno autora a odkaz na licenci Mapillary CC BY-SA 4.0. Cizí pixely se neukládají do hry ani do lokálních karet.
- Projít ulici: domy v jedné ulici (OSM `addr:street` nebo heuristicky nejbližší pojmenovaná cesta) se dotazují v malých geografických buňkách. Sken vypíše budovy, které nemají ani orientačně vhodný snímek, a nabídne jejich otevření pro jiný zdroj. Dotazy se dají zrušit. Při překročení bezpečného maxima dlaždic editor nespustí neúplnou rozsáhlou operaci.
- **API token se neukládá** do JSON, GitHubu, dat hráčských účtů ani localStorage; v běžné aplikaci se používá výhradně v hlavičce `Authorization: OAuth` vůči Mapillary. Používej klientský token určený pro veřejné použití v prohlížeči, nikoliv přihlašovací či soukromý access token. Bez tokenu zůstávají externí odkazy Mapy.com / Mapillary funkční.
- Ani tato verze hromadně netahá snímky poskytovatelů do vlastního foto-3D nástroje. Import fotografie pro přesné měření vyžaduje ověřit příslušné oprávnění. Geometrie domů se mění **až podle explicitně ověřených anotací** jako ve verzi 5.11.
- Testy: Node ověřuje směry kamer, velikost API výřezů, práci s tokenem v hlavičce, filtrování pohledů a souhrn pokrytí. Chromium simuluje oficiální API bez potřeby skutečného tokenu, prověří nalezení kandidáta, zkopírování odkazu a že kandidát automaticky nepovýší stav fasády na „Prohlédnuto“.

---

## Milovice RP 5.11.0 – Foto-zaměřování fasád (13. listopadu 2026)

**Nový praktický fotografický pracovní postup** ve Street Editoru. Uživatel může importovat *vlastní nebo oprávněně použitelnou* fotografii celé fasády (JPG, PNG nebo WebP, max. 12 MB). Obrázek se zpracovává **jen lokálně** a NEPOSÍLÁ se do cloudu, NEUKLÁDÁ do JSON ani do herních souborů. V exportované kartě zůstávají pouze souřadnice anotací, druh (okno/dveře), SHA-256 otisk zdrojového souboru a potvrzení práv.

Uživatel na snímku vyznačí čtyři rohy celé fasády v pořadí levý horní → pravý horní → pravý dolní → levý dolní. Geometrický převod homografií opraví perspektivní zkreslení rovinné stěny. Systém nabízí buď ruční obdélníky jednotlivých oken/dveří nebo **experimentální automatické návrhy tmavých pravoúhlých oblastí** z pixelů snímku bez nahrávání na server. Návrhy mají viditelnou jinou barvu a bez samostatného potvrzení uživatele se NIKDY neaplikují do hry. Práva musí uživatel potvrdit a pro fasádu musí vyplnit pozorování. Záznam se použije **jen po celkovém ověření karty domu**.

V 3D generátoru mají jednotlivé potvrzené fotografické anotace přednost před dřívějším stejnoměrným rozmístěním oken. Souřadnice oken se násobí délkou skutečné OSM stěny a výškou aktuálního domu; dveře získají přesné umístění a proporce z anotací, kolizní půdorys je zachován. U neověřených stran není změna. Aplikace diagnosticky vypisuje počet fotograficky zaměřených fasád a polohy použitých oken pro browser testy.

**Omezení:** Získané metry jsou pouze aproximací, pokud výška fasády není přesně změřená; projekce jediné fotografie neumí rekonstruovat celé skryté části domu. Přesnost je ovlivněna kvalitou snímku, výběrem rohů, perspektivou, případnou optickou deformací a půdorysem. Heuristické detekování tmavých oblastí není spolehlivé rozpoznávání oken, a může navrhovat stíny či jiné objekty. Pro více pater, členité fasády, balkony a nepravidelné výlohy je často lepší ruční anotace. Ani zde nepoužíváme snímky Mapy.com/Google bez relevantního oprávnění.

**Testováno:** Jednotkové testy perspektivní transformace, validace otvorů, heuristického návrhu oken, evidence práv a propojení se staršími fasádami; Chromium prochází syntetickou vlastněnou fotkou, ruční anotací, potvrzením práv, uložením, reloadem a skutečným převodem na různě rozmístěná 3D okna ve hře.

---

# Milovice RP 5.10.0 – Geometrie z ověřených fasád (13. 11. 2026)

Stavební editor nyní nabízí **strukturovaná pole pro každou ze čtyř hlavních stěn zvlášť**. Záznam severní, jižní, východní nebo západní strany umí nést počty oken pro jednotlivá patra (např. `2,3,2`), přibližnou šířku a výšku oken, polohu a šířku vstupu, barvu fasády v HEX a přítomnost okenic.

Podporované obytné domy použijí při novém spuštění hry tyto parametry pro **skutečná geometrická vyříznutí oken/dveří, zapuštěná skla, rámy, parapety, dřevěné dveřní prvky a barvu jen vybrané strany**. Dům je přiřazen podle stálého OSM ID a fasáda podle směru ze zaznamenaného půdorysu; neověřené strany zachovávají svůj dosavadní vzhled. Varianta bez vchodu a přízemí s nulou oken jsou nyní explicitně modelovatelné.

**Ověřitelnost:** geometrické údaje se přijmou jen u karty `Ručně ověřeno` a jednotlivé fasády `Prohlédnuto` se samostatným HTTP(S) odkazem na zdroj a textovým popisem. Pole s chybnými rozměry, neověřená fasáda či chybějící zdroj se do 3D nepoužijí. Informace se ukládají lokálně v prohlížeči a exportují do JSON, neautomaticky na GitHub. Pro běžné městské budovy zůstává původní fallback.

**Meze přesnosti:** Umístění oken je zatím **pravidelně interpolované** podle ověřeného počtu na patro, není automaticky rozpoznané z fotografie ani měřené na milimetry. Polohy dveří `vlevo / střed / vpravo` jsou schematické. Samotné prohlížení 360° není totéž co vytvoření 3D modelu; ukládáme vlastní parametry, ne cizí snímky. Přesné polohy každého otvoru, atypické střechy a automatické rozpoznávání panoramat jsou další práce.

**Testy:** jednotkové ověření normalizace důkazních zdrojů, směru fasád, počtů oken, polohy vchodů a validace dat; Playwright ověří vyplnění jižní/severní strany, přežití změny strany a reloadu a skutečné použití příslušných fasád v 3D modelu OSM budovy.

---

# Milovice RP 5.9.0 — Street Facade Survey + Panorama (13. listopadu 2026)

Nový postup po celé ulici: stavební editor rozděluje dům podle OSM půdorysu na čtyři hlavní fasády (severní, jižní, východní, západní), pro každou navrhne nejbližší místo pohledu z mapované silnice a natočení kamery, vyznačí ho na mapě a poskytne odpovídající externí odkazy na Mapy.com a Mapillary.

- **Pohledy na každou stranu:** samostatný stav *Neprohlédnuto / Prohlédnuto / Nedostupné* plus odkaz a poznámky. Poznámky a stavy se ukládají lokálně do stávající karty domu (pod `facades`) a exportují stejným JSON nástrojem.
- **Plynulý postup:** tlačítko „Další dům“ konečně posouvá kurzor po seznamu a přeskakuje dokončené objekty; nepřeskakuje pořád na první nedokončený.
- **Oficiální Mapy.com Panorama uvnitř editoru:** volitelně načte JS prohlížeč až po kliknutí uživatele se zadaným veřejným, doménou omezeným API klíčem, nastaví natočení z ulice směrem k příslušné fasádě a povolí procházení dalších sfér. API klíč není uložen do localStorage ani do GitHubu. **API provoz může být zpoplatněn**; pokud klíč chybí nebo panorama v daném místě není, fungují externí odkazy. Autentizační/API klíče nevkládejte do veřejného repozitáře.
- **Omezení:** výběr fasád a kamer je odhad z OSM polygonů, nikoli potvrzení panoramatického pokrytí; panoramatické fotografie se nestahují, nescrapují, neukládají do hry a automaticky z nich netěžíme 3D modely. Vyžaduje ruční vizuální ověření a vhodná práva k referencím.
- **Regrese:** automatické Node testy geometrie fasád a průběžného pořadí budov, Chromium UI test přepínání stran, lokálního uložení, odkazu na 360° API a návaznosti na 3D hru.

---

## Propojení stavebního editoru se hrou (5.8.0)

Editor nyní nabízí **strukturované 3D parametry**: barvu fasády a střechy v HEX, typ střechy, počet oken na každé fasádě (stále přibližný), ověřenou výšku a počet pater. Pouze karta označená **Ručně ověřeno** s URL zdroje a poznámkou může ovlivnit podporovaný obytný model. Zdrojová fotografie se do hry nestahuje ani nekopíruje. Změny se promítnou **až po obnovení/spuštění hry ve stejném prohlížeči**; data zůstávají lokální, export/import JSON funguje.

Pozor: identické počty oken pro všechny stěny jsou dočasná pomůcka, nikoli fotorealistická rekonstrukce. Editor zatím neodvozuje polohy oken nebo výšku z fotografie.

---

## Stavební editor ulic (Street Editor 1.0)

Nový systém pro průběžné procházení celých Milovic je dostupný na **[editor.html](./editor.html)**. Obsahuje skutečný OSM inventář budov podle čtvrtí a ulic, interaktivní mapu, karty budov, přímé odkazy na Mapy.com Panorama a Mapillary, evidenci ověřování, lokální ukládání a export/import JSON.

Je to **pracovní stavební editor**, nikoliv další herní grafický update. Nezaručuje pokrytí panoramatem a nemodeluje budovy automaticky z cizích fotografií. Jeho úkolem je systematicky organizovat modelování dům po domu bez nutnosti pokaždé vybírat nový objekt. Podrobnosti: [STREET_WORKFLOW.md](./docs/STREET_WORKFLOW.md).

---

# Milovice RP 5.7.0 — skutečná geometrie domů kolem kostela a nádraží (13. listopadu 2026)

První vymezená architektonická oblast v okolí kostela sv. Kateřiny a nádraží. Je to **pilotní čtvrť**, nikoliv prohlášení, že celé Milovice jsou nyní na úrovni GTA San Andreas.

- **Změna způsobu modelování:** až 68 vybraných obytných domů kolem obou míst již nevykresluje neprůhledný monolit s nalepenými modrými obdélníky. Vnější stěny mají triangulované skutečné otvory pro okna a vstupní dveře. Okno má zapuštěné sklo s tmavým ostěním, oddělený rám, zárubně, překlady a masivnější parapet; vstupy mají zapuštěné dveřní křídlo, schod a stříšku.
- **Střechy a fasády:** u podporovaných čtyřúhelníkových půdorysů jsou vidět trojúhelníková čela sedlových střech. Všechny upravené fasády mají barevné materiály, základové sokly a římsy; vybrané stavby komíny. Geometrie respektuje půdorys domu z OSM.
- **Mobilní výkon:** stěny jsou slučovány podle bloků, opakované rámy a dveře používají instancování; detailnější prvky už nyní podléhají 175m mobilnímu LOD.
- **Bezpečnost existujících systémů:** speciální modely nádraží a kostela, kolize, doprava, vozidla, účty a rozšířené oblasti Mladá / Boží Dar zůstávají zachované. Nádražní podloubí se nepřestavuje.
- **Omezení přesnosti:** půdorysy pocházejí z OpenStreetMap, ale umístění jednotlivých oken a dveří je zatím ilustrativní, nikoliv potvrzené fotografiemi pro každý dům. Další fáze musí být fotoověřená architektura vybraných domů, realističtější assety a srovnávací screenshoty před/po.
- **Testy:** kontrola reálných otvorů pomocí 3D raycastingu a početně ověřené konstrukce fasád v Chromium, vedle dosavadního dopravního a mapového testování.

---

# Milovice RP 5.6.0 — BIG VISUAL UPDATE 1 (13. listopadu 2026)

**Vizuální změny najednou:**
- Nová sada 8 původních 256px herních textur se silnějším kontrastem a detailnější kamenitou silnicí, dlážděnými chodníky, různorodou trávou, omítkami s patinou, nástupišti, sklem, kolejovým štěrkem a plechovou střechou. Zdrojový kód je `scripts/visual-overhaul.js`; nejde o textury z GTA.
- Teplejší denní osvětlení, méně vybledlá modrá obloha a teplejší horizont, vyladěná expozice a barevná mlha. Fasády mají jemné svislé nečistoty.
- Procedurální auta mají členitější masku, zadní sklo, registrační tabulky a 4 oblouky blatníků sdružené v instancované geometrii. Všechny procedurální pneumatiky mají vlastní správné otočné pivoty.
- **Stop rozpadlým kolům:** už NIKDY nepřidáváme kola jiného procedurálního vozidla přes importované GLB. Import se smí zobrazit jen se čtyřmi ověřitelnými nezávislými koly na správných pozicích. Nevyhovující GLB zůstane načtené pro diagnostiku, ale zobrazí se konzistentní procedurální auto s otáčejícími se koly. To může dočasně snížit počet viditelných GLB, zato nebudou kola na střeše ani obří vnější overlay.
- Běžné pouliční detaily navázané na reálné OSM silnice (lehké opravy povrchu, vpusti, poklopy, orientační sloupky) jako instancované objekty, nikoliv jednotlivé draw calls. Umístění těchto rekvizit je **umělecká aproximace**, ne přesná poloha skutečných poklopů v Milovicích.
- Jeden dynamicky aktualizovaný instancovaný stín pod okolními vozidly a autobusy pro lepší dojem kontaktu kol s vozovkou.
- Mobilní LOD: dál od kamery se skrývají náročné drobnosti fasád už od ~175 m, zatímco siluety domů zůstávají. Cílem je zlepšit 25–27 FPS hlášených na mobilu, ale reálný FPS musí být změřen na zařízení.

**Co to ještě není:** grafika GTA San Andreas na úrovni všech objektů ani fotorealistické Milovice. Nejvýraznější omezení dál tvoří základní tvary velké části domů, neanimovaná kola u nepoužitelných externích GLB a absence profesionálních scénovaných 3D modelů městských objektů. Nelze slibovat, že každý uživatel uvidí „brutální“ skok bez porovnání screenshotů.

**Regresní testy:** kontinuita starého města a čtvrtí, kolize a průchody, účty a výzvy, jízdní fyzika, chůze joystickem. Browser smoke požaduje nové textury/pouliční detaily a garantuje, že žádné importované GLB nemá chybně přidaná cizí kola.

---

# Milovice RP 5.5.0 — World Collisions (13. listopadu 2026)

- **Kolize budov:** hráč a řízená vozidla nyní narážejí do skutečných OSM polygonových půdorysů, včetně nově streamovaných čtvrtí. Pro rychlost na mobilu je použit prostorový hash 32 m, ne průchod celou mapou každým snímkem.
- **Průchozí nádraží:** nádraží není jeden neprůchozí obdélník. Kolize jsou registrovány podle samostatných přízemních zdí, ve dvou skutečně otevřených podloubích zůstává volná cesta.
- **Pohyb podél zdí:** kontrola posunu po krátkých krocích omezuje pronikání skrz překážky i při nižším FPS; při šikmém kontaktu funguje posouvání podél zdi. Stojící a projíždějící vozidla i chodci jsou dynamické překážky hráče. Auto se při nárazu zastaví a kola neanimují imaginární ujetou vzdálenost.
- **Omezení:** jde o 2D aproximaci kolizí u země, nikoli úplnou fyzikální simulaci. Vozidla a NPC se navzájem stále aktivně nevyhýbají, chybí fyzika nárazů a přesné kolize tvaru aut. Průchod interiéry budov zatím není implementován.
- **Ověření:** čistý JS test polygonů, stěn, průchodů, slidingu, resetu a prohlížečová kontrola načtených OSM staveb a portálů. Všechny předchozí modely, úkoly, parkování, ovládání a účty zůstávají zachovány.

---

# Milovice RP 5.4.0 — Vehicle Update

**13. listopadu 2026.** Opravy hlášených chyb mobilního hráče:

- **Záměna auta za autobus při vystoupení:** dříve pěší režim v animační smyčce nastavoval *nezávislý* autobus na souřadnice posledního řízeného automobilu; autobus tak vizuálně překryl zaparkované auto. Nyní zůstává autobus vždy na svých uložených souřadnicích `busPark`, přitom vystoupené auto si uchová své číslo, typ, 3D objekt, pozici a dostupnost pro další nastoupení. Navíc se opětovné nastoupení přednostně nabídne do právě opuštěného auta.
- **Odlišné modely:** `scripts/vehicle-assets.js` podporuje několik nezávislých instancí různých Quaternius/Spectral GT GLB vozidel současně místo jediného modelu v danou chvíli. Nejvýše 3 detailní auta na dotykovém telefonu (5 na počítači), další vozidla používají 8 stávajících procedurálních karoserií s nově proměnlivým lakem a rozlišujícími doplňky (střešní ližiny, prahy). Nahrané GLB je vždy samostatný clone, nikdy se nepřemisťuje mezi vozidly.
- **Rotující kola:** skutečné pivoty procedurálních aut i modelovaných regionálních autobusů se při pohybu otáčejí podle dráhy a poloměru kola, včetně řízeného auta a couvání. GLB importy podporují otáčení pojmenovaných dílů kol, pokud jsou rozdělené na samostatné pivoty; u některých modelů může být geometrie kol sloučená a bude potřebovat specializovaný rig.
- **Parkování:** nová plánovací knihovna `scripts/parking-layout.js` vytváří deterministicky náhodné odstavené osobní vozy podél **skutečně mapovaných** klidnějších obytných ulic a veřejných obslužných cest; respektuje `access=private/no`, `service=driveway`, rozestupy, vyhýbá se koncům ulic a hlavním průtahům. Umí také zohlednit skutečně vyznačené OSM venkovní parkovací plochy, pokud jsou v exportu. **Omezení dat:** současný export z Milovic obsahuje prakticky jen vícepatrové parkoviště jako budovu, nikoli použitelné označené povrchové parkovací polygonové plochy; proto se žádný vymyšlený areál neoznačuje jako skutečně zmapované parkoviště. Stání u obslužných komunikací jsou herní aproximací a vyžadují pozdější ruční ověření podle fotografií.

**Testy:** GitHub Actions ověřují spuštění Three.js, OSM/DMR, generování parkovaných aut v různých typech a skutečný pohyb kol. Rozšířený browser smoke zkouší nastoupení/vystoupení/nastoupení do téhož vozidla, pozici samostatného autobusu a načítání licencovaných GLB. Všechny původní účty, dopravní síť, kamera a práce byly ponechány.

---

# Milovice RP 5.3.4 – správný směr jízdy importovaných aut

**Oprava GLB vozidel (13. 11. 2026):** Konvence herních vozidel je, že předek směřuje k lokálnímu **−Z**. Původní procedurální hatchbacky a autobus už takhle vznikají a jejich pohyb, řízení a kamery zůstaly zachované. Importované modely Quaternius Car, SUV a Sports Car však používaly `frontAxis: 'AUTO'`, které poznávalo orientaci jen z délky a šířky modelu — nikoliv podle skutečného směru přídě. U všech tří Quaternius GLB je nyní výslovné `frontAxis: '+Z'` a jejich vizuál se při importu otočí o 180°; pro Spectral GT zůstává existující explicitní `+X`. Žádné vozidlo se neřídí obráceně a neotáčí se kamera; opravuje se pouze orientace externího 3D modelu. Při GLB importu je zachována původní transformace. Prohlížečový test ověřuje geometrii načtených modelů a jejich výsledný předek vůči směru jízdy.

---

# Milovice RP 5.3.2 — správná velikost postav + analogový joystick

**13. 11. 2026 – zásadní oprava 3D člověka a pohybu.** Modely GLB měly vlastní transformaci měřítka, která se při normalizaci omylem přepisovala, takže postava vyrostla na desítky metrů a okolní NPC visely v T-póze. Import nyní zachovává původní transformace glTF a aplikuje 1,94m výšku pomocí zvláštní nadřazené skupiny. Po vytvoření se kontroluje skutečný bounding-box modelu, který musí mít 1,65–2,20 m a chodidla kolem úrovně země; nevalidní GLB se nepoužije a zůstane předchozí procedurální model. Kosterní idle/chůze drží paže spuštěné místo původní T-pózy.

**Ovládání:** na dotykových telefonech se během pěšího pohybu namísto čtyř tlačítek zobrazuje kruhový **analogový joystick** nalevo, nad panelem hlavních akcí. Pohyb prstu od jeho středu určuje intenzitu: přibližně prvních 12 % je mrtvá zóna, zbytek stupňuje chůzi až po běh (0,8–5,5 m/s), bez potřeby spolehlivě neimplementovatelného měření síly přítlaku na displej. Při puštění joysticku pohyb bezpečně zastaví; při přepnutí na vozidlo se obnoví původní šipky řízení. Na PC zůstává WASD / šipky, Shift umožňuje sprint. Kosterní model používá různé rychlosti a délky kroku podle intenzity pohybu. Kód je v `scripts/analog-controls.js` a `scripts/human-assets.js`. Prohlížečový CI ověřuje hranice modelu i fyzický pohyb virtuálního joysticku v mobilním viewportu a návrat do nulového stavu.

---

# Milovice Life RP — 5.3.0 Real 3D Models (humans, greenery, mobile cars)

**13. listopadu 2026 – skutečná modelová výměna, nikoli další barevná textura.** Verze 5.3.0 přidává nový modul `scripts/human-assets.js` s opravdovými texturovanými glTF/GLB humanoidy z CC0 sady **Quaternius Ultimate Modular Men/Women Pack** (muž v civilu, žena v civilu, muž v obleku). Hráč je nyní zastoupen GLB modelem místo staré figurky; ve vhodné vzdálenosti také až 5 okolních NPC, zatímco ostatní používají původní úsporné modely. Import využívá `SkeletonUtils.clone`, takže se kostry různých postav navzájem neovlivňují. Vybraný web-ready mirror soubor nemá animované klipy, ale obsahuje **49 skutečných kostí**. Proto jsou chůze a stání animovány programově přes `UpperLegL/R`, `LowerLegL/R`, `UpperArmL/R`, lokty a hrudník. Ověřené browser CI: GLB hráč se načetl, kostra obsahuje 49 kostí, je aktivní procedurální skeletal walk a modely nejméně tří civilistů jsou dostupné.

**Příroda a auta:** Modul `scripts/nature-assets.js` nahrazuje nejvýše 12 původních kulatých stromů kolem nádraží detailnějšími přímo načítanými Quaternius GLB stromy (CommonTree a BirchTree). Jejich pozice pocházejí pouze z již generovaných pozic herních stromů, nepředstavují nové zaměřené OSM body. Browser CI potvrdilo 12 instancí a načtení obou typů stromů. Modul `scripts/vehicle-assets.js` nyní v režimu „Automaticky“ zobrazuje i na mobilu nejvýše jedno detailnější vozidlo na dohled: pro úsporný mobilní režim je připraven Quaternius CC0 Car (~174 kB), Sports Car (~175 kB) a SUV (~182 kB). Na PC zůstává dostupná i původní detailnější sportovní varianta. Pro kvalitu lze zapnout ostřejší render s náročnějšími stíny; výchozí úsporný režim se nemění. Při chybě stahování mají lidé, stromy i vozidla funkční procedurální fallback.

**Licenční zdroje (CC0-1.0):** [Quaternius Ultimate Modular Men](https://quaternius.com/packs/ultimatemodularcharacters.html), [Ultimate Modular Women](https://quaternius.com/packs/ultimatemodularwomen.html), [Ultimate Nature](https://quaternius.com/packs/ultimatenature.html) – GLB exporty z [trebeljahr/quaternius-showcase](https://github.com/trebeljahr/quaternius-showcase/blob/main/LICENSES.md), připnuté ke konkrétnímu upstream commitu. Mobilní automobily z [bennibeni/garage – CC0 LICENSE](https://github.com/bennibeni/garage/blob/main/public/models/LICENSE.txt). Nepoužívají se žádné textury, skripty ani modely z GTA.

**Omezení:** Modely Quaternius zůstávají stylizované, takže samotná výměna zatím neznamená úroveň grafiky GTA San Andreas. Nepřesné obrysy ostatních budov, vzdálené dopravní modely a široká mapa Milovic ještě vyžadují vlastní ověřené 3D architektonické modely a fotoreferenční práci. Výkon 5.3.0 na konkrétním mobilním telefonu zatím nebyl změřen – pokud se FPS zhorší, lze v menu vypnout detailní postavy, auta a kvalitnější stíny.

---

# Milovice Life RP — 5.2.0 Graphics 2.0

**První grafický základ 5.2.0 (13. listopadu 2026):** Na základě zpětné vazby k vizuálu na mobilu vznikla nová vlastní knihovna `scripts/graphics2.js`, která vytváří 8 sdílených barevných textur (asfalt s kamenivem, dlážděné chodníky, trávu, jemnou omítku, betonové nástupiště, tónované sklo, kolejový štěrk a falcovanou červenou střechu). Pro staré Milovice i průběžně načítané další čtvrti jsou použity jediné materiály namísto mnoha jednotlivých fotografií. Textury jsou procedurální a originální, bez externích požadavků, s opakováním/mipmapami a při běhu nepřidávají nové draw calls. Na nádraží získaly 3D plochy nové povrchy omítky, skel a střechy; nástupiště i kolejiště mají texturované plochy. Upravené denní osvětlení je méně přesvětlené a hráč má lehký transparentní kontaktní stín pod nohama. Toto je **základ pro postupné zlepšování**, nikoliv tvrzení, že hra už má grafiku jako GTA San Andreas. Stávající Three.js engine, půdorysy OSM, výškopis ČÚZK, účty, vozidla i systém řízení zůstávají zachovány. CI ověřuje JS a skutečné 3D spuštění v prohlížeči, včetně 8 aplikovaných materiálů; přesné FPS na telefonu je třeba následně otestovat.

**Cesta k cílovému vzhledu:** další krok jsou skutečné samostatně licencované GLB/glTF animované postavy a detailní regionální vozidla, silnější normal/roughness materiály, fotodokumentované charakteristické fasády Milovic a lokální optimalizace podle draw calls. Modely ani současné textury nejsou kopií komerčních her.

---

# Milovice Life RP — 5.1.5 Connected Station Pedestrian Access

**Napojení nádražního průchodu 5.1.5 (13. listopadu 2026):** Předchozí pruh dlažby končil v trávě a nenavazoval na chodník. Nově se vygenerovaná dlažba průchodu zarovnává podle obou reálných otvorů v modelu nádraží a její uliční konec je propojen krátkou pěší spojkou k již mapované cestě **OSM way 549346217** vedoucí od ulice 5. května. Spojka vede po vnější straně budovy, používá texturu chodníku a respektuje ČÚZK terén. Druhý výstup získal krátké dlážděné napojení směrem k ploše nástupiště. OSM trasy footway/path mají nyní povrch dlažby místo silničního asfaltu. Trasa spojky mezi existujícím herním otvorem a mapovanou cestou je herní geometrické propojení, nikoli ověřené zaměření skutečného stavu; nepředstavuje nový OSM prvek ani přesný digitální dvojník. Automatický browser smoke test ověřuje navázání na way ID 549346217 a vytvoření čtyř spojovacích úseků. Původní funkční doprava, průchodnost a ostatní herní systémy zůstávají zachované.


**Grafický průchod 5.1.4 – 13. listopadu 2026:** Podle uživatelských mobilních screenshotů (42–55 FPS na zobrazených scénách před aktualizací) se na telefonech automaticky sbaluje vysoký informační HUD. Zobrazuje jen název, stav hry a režim; přes tlačítko **☰ Info** je možné ihned vrátit plný původní panel. Stávající ovládání, minimapa, zaměstnání a podrobné statistiky zůstávají funkční. Do modelu nádraží v přesném půdorysu OSM byla přidána opakovaná řada bílých okenních rámů s oblouky, malá římsa a dlažba v průchozím otvoru namísto trávy. Pozice dalších oken a šířka dlažby vychází z herního odhadu, nikoliv z geodetického měření. Vlastní procedurální postava a NPC mají přirozenější proporce trupu, končetin a vlasů; hráč navíc díly bundy a podrážky bot. Model **není** fotorealistický ani anatomicky přesný. Prohlížečový CI test kontroluje alespoň 8 oken nádraží, průchozí dlažbu a možnost otevřít/zavřít HUD při viewportu 390 × 820. Nové FPS po aktualizaci zatím nebyly přímo změřeny na uživatelově telefonu.

**Fotografická reference:** [Železniční stanice Milovice – září 2024, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%C5%BDelezni%C4%8Dn%C3%AD_stanice_Milovice_(z%C3%A1%C5%99%C3%AD_2024).jpg); pouze inspirační podklad, žádné pixely fotografie nejsou použity jako textury.

**Nástupiště 2026-11-13 (5.1.3):** Mapovaný polygon nástupiště Milovice (`railway=platform`, OSM way 549346219) nyní zobrazuje žluté texturované varovné pásy a světlou nástupištní hranu na úsecích orientovaných ke skutečně mapovaným kolejím. Viditelné detaily využívají vlastní procedurální texturu a ČÚZK výškovou mapu; foto nástupiště ukazuje žluté pásy (historické foto [Nymburský deník, prosinec 2009](https://nymbursky.denik.cz/zpravy_region/trat_milovice20091210.html)). OSM neudává přesné materiály ani stavební výšky; rozměry, odstín a počet dlaždic jsou herní odhad, nikoli současný zaměřený stav. Žádný nový polygon ani přechod nebyl vymyšlen. Prohlížečový smoke test ověřuje vytvoření alespoň 3 úseků a 30 metrů hrany; skutečnou shodu s dnešní podobou stanice netvrdí.

**Přízemní obchodní budovy 2026-11-13:** U OSM půdorysů s `building=retail`, `supermarket`, `commercial`, `shed` nebo `service` bez kladného `building:levels` se nyní pro odhad výšky používá jedno podlaží namísto obytného výchozího počtu dvou. Výslovně uvedené kladné počty podlaží a explicitní výšky zůstávají prioritní; hodnota `building:levels=0` se již nesprávně nevyhodnocuje jako chybějící údaj pro dvoupodlažní dům. Jde o heuristiku pro neúplná OSM data, nikoli o fotograficky ověřenou výšku konkrétních staveb.

**Optimalizace vývěsních štítů 2026-11-13:** Nápisy provozoven načtených z OSM nyní používají jednu sdílenou jednotkovou geometrii `THREE.PlaneGeometry` a individuální rozměry se nastavují pomocí `scale`. Každá provozovna nadále používá vlastní texturu a materiál; jména, orientace, poloha a velikost štítů zůstávají stejné. Snižuje se počet vytvořených geometrií, nikoli počet textur nebo draw calls. Nejde o nové ani fotograficky ověřené provozovny.

**Optimalizace hran střech 2026-11-13:** Obrysy střech vykreslované z půdorysů OSM nyní sdílejí jediný materiál `THREE.LineBasicMaterial` napříč budovami a postupně načítanými oblastmi. Geometrie jednotlivých obrysů, barva i poloha zůstávají beze změny. Jde o omezení počtu alokací materiálů, nikoliv o nový mapový podklad nebo měření FPS.

**Fasády obchodů 2026-11-13:** U budov s názvem a odpovídajícími OSM tagy obchodu/služby se na přízemí už nevykreslují generická obytná okna přes samostatně modelovanou prosklenou výlohu. Vyšší podlaží a ostatní budovy zůstávají beze změny. Nejde o ověření skutečného členění fasád; vychází z mapových tagů a existujícího stylizovaného modelu.

**Optimalizace výloh 2026-11-13:** Při výběru stěny orientované k ulici se pro každou OSM provozovnu předem vyberou pouze blízké silniční segmenty (v rozsahu 230 m od středu budovy), namísto opakovaného procházení celé sítě načtených oblastí pro každou stěnu. Původní hranice vzdálenosti pro hodnocení 120 m zůstává zachována. U neobvykle rozlehlých půdorysů může výběr vyžadovat další kontrolu; nejedná se o nová mapová data ani o nové obchody.

**Optimalizace 2026-11-13:** Stromy a pouliční lampy vytvářené z OSM silnic nyní sdílejí čtyři základní Three.js geometrie (kmen, koruna, sloup, svítidlo) napříč postupně načítanými oblastmi. Jejich polohy a vzhled se nemění; omezuje se počet samostatně alokovaných GPU geometrií. Nejde o nové mapové body ani o nový herní systém.

**Hra:** https://foxey-cz.github.io/milovice-life-rp/

Browser-based singleplayer RP prototype using real OpenStreetMap footprints of Milovice and official ČÚZK terrain. **Not** yet a photorealistic digital twin or an exact reconstruction of every house. Some regional buildings have mapped heights; untagged buildings use archetype-based approximations.

## 5.1.2 — Live OSM storefronts

- Named OpenStreetMap grocery buildings **BILLA**, **Tesco** and **Penny** now have large readable street-facing signs, prominent glass entrances, colour-specific signage, canopies, surrounding paving and bicycle stands. This uses imported OSM building footprints and names: **no new unmapped shops** were invented.
- Additional OSM-named services such as **Šperky Milovice** and **Poliklinika Milovice** get their own exterior glazing and shopfront signs. Storefront style and entrance placement are *approximate*, not scans or facade surveys.
- Building shapes now reference real street-level photos: **BILLA** grey box with charcoal entrance canopy and yellow rooftop lettering; **Tesco** bright corrugated white facade with red-blue signage; **Penny** a large grey pitched gable and red fascia band. The photos are reference material only and are **not copied as textures**. Exact orientation and shopfront measures are estimated.
  - [BILLA Milovice storefront](https://www.firmy.cz/detail/13214923-billa-milovice-mlada.html), [Penny Milovice storefront](https://www.firmy.cz/detail/2413114-penny-market-milovice-mlada.html), [Tesco Milovice storefront](https://zpravy.aktualne.cz/mesto-milovice-dnes/r~6bf975b2cdc111eb8a900cc47ab5f122/).
- Repeated facade details are batched; individual signs are only rendered near the player as part of the existing 3D draw-distance LOD system.

## 5.1.1 — Licensed 3D cars and realistic station

- Real Three.js GLTFLoader imports high-detail GLB car geometry and materials, not a 2D car picture.
- Spectral GT RS is a 4.7 MB CC0 sculpted sports coupe with interior, glass, rims and paint. It is an original unbranded car, NOT a Škoda, Toyota or BMW.
- A small CC0 **Quaternius SUV** GLB (~182 KB, pinned GitHub redistributor) is loaded on demand when driving a suitable SUV. An earlier external SUV host was unavailable in browser tests, so it was replaced.
- On desktop the model setting defaults to Auto. On touchscreens the cheaper procedural cars remain standard; the player can override it. Only ONE high-polygon vehicle can be active near the player or while driving, keeping distant traffic inexpensive.
- GLB network failures automatically return to original working procedural vehicles with visible status.
- The railway station gains a glass-fronted street entrance, verified address marker 469/13, waiting benches, information case, trash bins and a tactile strip, without sealing the pedestrian through-passage.
- Shape and position of the station footprint comes from mapped OSM coordinates. Extra furniture is artistic placement, NOT a surveyed digital twin.

### External asset licenses and credits

| Model | Author | License | Source |
| --- | --- | --- | --- |
| Spectral GT RS GLB | JaronKBragg7337 | CC0 1.0 | https://github.com/JaronKBragg7337/spectral-gt-rs |
| Quaternius SUV GLB | Quaternius | CC0 1.0 | https://quaternius.itch.io/lowpoly-cars and https://github.com/bennibeni/garage |

The Three.js loader downloads the Spectral asset from its author and the Quaternius SUV from the exact GitHub revision of a third-party redistributor; sources are not bundled in this repository. Model license and provenance are documented above. No manufacturer endorsement is implied.

Remaining limits: accurate GLB bodies for real Škoda, BMW and Toyota models are not installed; the playable PID bus and train are still original approximations, and not every Milovice building has been photo-modeled. Official Škoda fan 3D print models forbid commercial use and cannot be substituted into this commercial-capable game.

## 5.0 — connected living town / in-game LOD

- Player-selectable draw distance: **360 / 620 / 1,000 m** (stored locally). Fog and perspective clipping follow the chosen distance; near facade instances remain detailed while distant wall silhouettes stay visible.
- Real **OpenStreetMap forest, grass, park, playground and sports pitch polygons** are now used to build terrain-coloured 3D landscape areas. Forest and park tree placement is bounded, deterministic and locally instanced; individual tree positions are generated *inside* real mapped green polygons, not taken from tree surveys.
- Terrain, buildings, signs, trees and architectural elements use real OSM/ČÚZK coordinates. City sectors preload once the player approaches; **no map loading screen between sectors**, although large sector downloads can still be visible on slow connections and uncovered outskirts remain incomplete.
- Facade detail batches are split by map cell. Original procedural roadside greenery and lamps are also divided into 200 m render cells; scene and GPU workload falls with distance.
- Original sculpted pedestrians and player character: face/hair/limb and clothing variations, arm/leg walking animation, lightweight distant silhouettes.
- Sculpted road-vehicle archetypes instead of default box bodies: generic hatchbacks, estates, saloons, crossovers, SUVs, vans, sculpted tires and glass. Paint uses original procedurally generated metallic micrograin textures.
- Regional route **432** is confirmed as active in 2026 and operated by OAD Kolín. A red/white bus inspired by contemporary PID livery replaces the previous yellow player coach; civilian traffic includes a stylized **18 m articulated regional bus** with bellows and extra axle. Its body is a non-certified game interpretation, not an accurate SOR NS 18 3D scan.
- Passenger boarding: gameplay bus-work stops now display temporary waiting pedestrians, who approach the coach doors during boarding. AI route 432 pauses at simulated stop checkpoints. **Not an official stop/timetable simulation**: published PID GTFS stop points and trips are not yet imported.
- Animated original three-car double-decker EMU, visually referencing the **ČD 471 CityElefant**. Follows OSM railway geometry and pauses near Milovice station, independent of the road traffic. A gameplay rail animation, **not an actual 2026 train timetable**.

Public transport references: [PID 432 operator and current stops](https://pid.cz/zastavkove-jizdni-rady/?cid=432&from=1792447200&type=busreg), [documented OAD Kolín SOR NS 18 on line 432](https://mhdfoto.cz/cs/foto/82701) (photos **not** copied), [ČD CityElefant train history](https://www.bluetrains.cz/soupravy-a-jednotky/elektricke-soupravy/cityelefant/). Manufacturer trademarks and logos are not embedded as manufacturer-certified assets.

**Important remaining work:** Individual BMW/Toyota/Škoda production vehicle meshes, officially licensed transit fleet models, actual stop coordinates and real schedules, street-level photo matching for every building and a full city-wide draw-call/FPS audit are **not complete**. Avoid calling these procedural approximations photorealistic or exact.

## 4.9 — station and recognizable neighborhoods

- Real photographs of the Milovice railway building show **cream plaster, white-framed windows and a dark red metal roof**. The 3D station now has a separate original standing-seam roof material on each of its three roof sections, an extended platform shelter with wood-toned support posts, a rail-side nameplate and a street-side nameplate.
- Ground-floor arched window heads, platform paving, Nádražka and the provisional shop remain part of the 3D station. The walk-through opening remains open; its exact dimensions and the shop location have **not** been surveyed.
- Braniborská and Rakouská now receive different **neighborhood-level facade schemes**. These are photo-inspired styles, not a claim that every individual exterior was verified.
- OSM roads are read before buildings, making nearby-street architectural classification deterministic. Region streaming now rebuilds lightweight visual trees and street dressing so more distant districts do not appear barren.
- Reference photographs: [Wikimedia railway station images, including September 2024](https://commons.wikimedia.org/wiki/Category:Milovice_(train_station)), [historical station frontage photograph](https://stellwerke.info/stw/stw.php?id=22402), [Braniborská / Komenského / Spojovací images](https://commons.wikimedia.org/wiki/Category:Soviet_modernist_architecture_in_Milovice).

**Limitation:** This remains a Three.js procedural open-world prototype. A building will not become photorealistic merely because its OSM footprint is correct. The still-missing house-by-house survey, high-quality 3D assets and exact textures are future work.

## 4.8 map expansion & graphics

- Five independently streamed OSM sectors: **Mladá, Benátecká Vrutice, Západní propojení, Mladá–Staré Milovice–Boží Dar, Boží Dar**. The older central extract remains the first sector.
- True local streets, service roads, rails and OSM building outlines. Data downloads are deduplicated by OSM way IDs in overlapping sectors.
- Matching **ČÚZK DMR 4G** regional elevation grids with 20 m gameplay sampling; old center retains more detailed 10 m DEM.
- The spawn vehicle menu now contains a **district selector**. As the player drives, adjacent regions are loaded progressively; citywide traffic gets new routes.
- Panel apartment blocks tagged 4–16 floors retain their height and receive photo-inspired facade styles, long balcony arrays, slab seams and entrance canopies. Houses, garages, schools, commercial and industrial buildings get different procedural facade treatment.
- Railway station model no longer uses one towering solid polygon. It has a raised central section, two low side wings, separate pitched red roofs and an open through-passage. Precise openings/roof dimensions remain *photo-informed approximations*.
- Graphics selector includes lightweight **balanced** mode and **realistic shadows** mode with localized PCF shadow casting; the latter can reduce FPS on phones.
- No photographs or Google Street View tiles are used as textures without suitable permission; only original procedurally generated game textures are embedded.

The area sectors are expanded **gameplay map windows**, not authoritative municipal boundary polygons. Additional distant countryside and exact landmark geometry remain incomplete.


## Earlier 4.7 mapped landmarks

| Place / feature | Geodata | Work done |
| --- | --- | --- |
| Full-sized map | Game-simulated location, not phone GPS | Blue live player arrow, recenter, nearby landmark pins |
| Milovice railway station | OSM way 53865956 | Two physical open portico faces in station ground floor, arches, a platform canopy, station sign |
| Milovická Nádražka | Located in station building | Small cafe facade, serving window, courtyard seating; exact storefront wall inferred |
| Station shop | Reported by local player | Provisional shop frontage, exact tenant and physical face not yet verified |
| Modrá hvězda | Mírová 134/11, OSM way 202367194 | 2-floor photo-matched ochre/orange facade, red ground floor, white trim and balcony |
| Mírová 243/36 | OSM way 202367254 | Cream plaster, deep red roof, dormers, corner shop |
| Potraviny D a Š | Mírová 74/4, OSM way 202298645 | Verified address; provisional grocery facade |
| Cyklověž Milovice | OSM way 1011197691 | Tall faceted translucent glass/metal circular biketower |
| Church of St. Catherine | OSM way 118487991 | Neo-Gothic clock tower and spire |
| ZŠ T. G. Masaryka | OSM way 118487979 | School facade with signage |

See [architecture data & references](data/architecture-references.json), including photo author, historical date, license and model uncertainty. Many OSM building levels are missing or outdated. The new building heights remain **photo-derived estimates**, not survey measurements.

## Game
Controls: WASD/arrows to walk or drive; E to board/leave; C camera; R reset; M minimap; J jobs. Also supports mobile touch controls. Spawn picker offers a regional location (including the Mladá and Boží Dar areas), plus walking, sedan, SUV, van, police car and bus. Only an **active bus job** shows doors, passengers and route markers.

## Sources and attribution
- Footprints, road centerlines, rail, paths: © OpenStreetMap contributors (ODbL).
- Elevation: © ČÚZK / Zeměměřický úřad DMR 4G (CC BY 4.0), offline 10 m sample grid.
- Photo sources: Wikimedia Commons and various documentary/business sites as visual reference only. No Google Street View image tiles or third-party photograph pixels copied into game.

## Quality checks
GitHub Actions validates JavaScript and runs a real Chromium WebGL smoke test on the 3D world, terrain, player/map marker, vehicle entry and bus job, including a two-opening station passage check. Repeated facade details are built with shared instanced geometry to reduce draw calls.

## Further work
Verify station shop, passage dimensions and each house level/roof against up-to-date photographs or survey; expand the geographic area after the center becomes recognizable.
