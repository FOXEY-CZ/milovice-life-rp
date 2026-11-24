## Milovice RP 5.299 — ochrana hranic mapovaných parkovišť a limitu aut (24. 11. 2026; CI čeká)

Procedurální generátor parkování nyní nepřekročí limit ani při více řadách existujícího mapovaného parkoviště. Dříve samotný střed auta uvnitř polygonu nezaručil, že karoserie nepřesáhne jeho okraj; nově se vyžaduje konzervativní modelová rezerva 2,3 m od každé hrany. Funguje i u konkávních polygonů. Tato rezerva odpovídá přibližné obálce běžného modelového auta, nikoli skutečným rozměrům všech vozů nebo právnímu vymezení stání. Dosavadní roadside pravidla a ochrana Armádní zůstávají. Žádná nová parkoviště, souřadnice, geometrie ani kolize. Přidán Node test 30 seedů, 7 limitů a dvou polygonů; CI/WebGL/Pages čekají.

## Milovice RP 5.298 — návazná konstrukce existujících modelových skluzavek (24. 11. 2026; CI/Pages čekají)

Existující modelové skluzavky dostávají společnou výškovou základnu: čtyři podpěry k lokální DEM, plošina, přístupové bočnice a tři stupně, souvislá skloněná skluzná plocha a dvě boční lišty. Na nepříznivém či nevalidním terénu zůstává původní fallback. Stejných 15 box instancí, materiály a původní odhadnuté polohy, bez nových zařízení, polygonů a kolizí. Není to fotoověřený vzhled ani fyzická bezpečnostní certifikace. Osm matematických kombinací terénu/yaw ověřeno v JS; Node/CI/WebGL/Pages čekají.

## Milovice RP 5.297 — oprava konstrukce existujících modelových houpaček (24. 11. 2026; CI/Pages čekají)

Dosavadní čtyři svislé sloupky modelové houpačky míjely horní nosník o 0,72 m. Nový A-rám používá stejné 4 sloupky, nosník, dvě sedátka a čtyři řetízky (11 box instancí), ale každá noha se opírá o lokální DEM a nahoře se připojuje ke společnému vodorovnému nosníku i na svahu. Stejné existující typy, polohy, materiály a instancované batch rodiny; 0 nových herních prvků, kolizí nebo mapových ploch. Změna opravuje procedurální model ve všech již existujících houpačkách, nikoli fotografickou rekonstrukci. [Rada Milovic 16/2024, s. 6](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=16188&id_org=9519) dokládá skutečně vybudované veřejné dětské hřiště Armádní I v souvislosti s C13/C14, ale konkrétní typy zařízení a jednoznačné přiřazení polygonu 1468803906 nejsou fotograficky potvrzené. Nové multifunkční sportoviště pod poštou zatím neimplementováno; [zakázka](https://zakazky.mesto-milovice.cz/contract_display_67.html?open=subject_items) stále uvádí probíhající plnění. Test osmi kombinací terénu/yaw a stávající WebGL kamery; CI/Pages čekají.

## Milovice RP 5.296 — stabilní pěší síť Armádní při příjezdu ze západu (24. 11. 2026; PR #86 MERGED, 5/5 CI PASS; Pages neověřeny)

Deset identických původních OSM ways existuje v Mladé, Vrutici i Západním propojení. Čtyři plánovače 5.291–5.294 již nejsou omezené jen na Mladou. Modelová 5m šířka vozovky a sjednocený modelový materiál devíti původních pěších ways zůstanou aktivní i při západním pořadí načítání. Dedup a všechny původní source hashes, tagy, GPS, geometrie a kolize zůstávají nedotčené; nepřibývají meshe. Runtime audity vykazují region, kde se skutečně aplikovala oprava. Rozšířeny čtyři Node testy z regionálních souborů a WebGL diagnostika. Nejde o as-built ověření vozovky, dlažby ani parkování. PR #86 sloučen jako `23f29d7`, 5/5 CI PASS; Pages po merge zatím neověřeny.

## Milovice RP 5.295 — ochrana pěších přístupů Armádní před náhodným parkováním (24. 11. 2026; PR #85 MERGED, 5/5 CI PASS; Pages neověřeny)

Sedm původních OSM neznačených přechodů, 13 připojených pěších cest a 21 přesných spojení s vozovkami/chodníky. Guard odmítá procedurální kandidáty parkování do modelových 4,25 m od chráněných pěších os, včetně obnoveného chodníku 5.291. Odhadnuté roadside parkování je vyloučeno i na modelové 5m komunikaci `1373371687`. Jde o konzervativní herní odstup, nikoli skutečný zaměřený nebo právní zákaz. Žádné nové zebry, chodníky, obrubníky, parkovací místa či kolize; bezpečné kandidáty jinde zůstávají. Test původní geometrie, generátoru 30 seedů, identických 27 zdrojových ways ve třech překrývajících se regionech Mladá/Vrutice/Západní propojení a WebGL runtime. Ochrana se aktivuje před deduplikací z prvního odpovídajícího regionu a nepřepisuje se pozdějším načtením. [PR #85](https://github.com/FOXEY-CZ/milovice-life-rp/pull/85) MERGED jako `581d099`, 5/5 CI PASS; Pages neověřeny.

## Milovice RP 5.294 — propojené původní pěší úseky východní Armádní 890/891 (24. 11. 2026; PR #84 MERGED, 5/5 CI PASS; Pages neověřeny)

Tři **původní OSM** pěší trasy `1468803918` (cca 76 m), `1468803919` (cca 29 m) a `1468803920` (cca 81 m) kolem bloků C15/890 a C16/891 nyní používají jeden sdílený neutrální modelový dlažební materiál již existující v 5.292/5.293. **Čtyři návaznosti jsou doložené přesně totožnými původními OSM uzly**, včetně dvou vazeb na severní promenádu `1373371686`; žádné spojovací úseky se nevymýšlejí. Původní road-clearance clipping stále ořezává případné konflikty s vozovkou. **0 nových chodníků, silnic, obrubníků, parkovacích míst, přechodů, kolizí a meshů.** Materiál je vizuální sjednocení, **není doložen jako skutečná barevnost východních C15/C16**. Unit test a mobile+wide 7,1s WebGL rozšířené; [PR #84](https://github.com/FOXEY-CZ/milovice-life-rp/pull/84) sloučen jako `dab56a1`, všech 5/5 CI PASS; Pages po merge nebyly nezávisle ověřeny.

## Milovice RP 5.293 — skutečné OSM propojení chodníků na Armádní (24. 11. 2026; PR #83 MERGED, 5/5 CI PASS; Pages neověřeny)

Originální OSM pěší trasa `1373371686` (`highway=footway`, 7 bodů, cca **110 m**) má tři **přesně společné mapové uzly** s OSM `1468803921`, `1468803914` a `1468803920`. Její již existující, bezpečně road-clipped 3D plocha nově používá stejný **sdílený modelový dlažební materiál** jako verze 5.292. Nemění se ani souřadnice, ani dopravní routování, ani mesh počet, protože se mění POUZE materiál. **Žádná nová cesta, obrubník, parkovací stání, přechod, textura ani fyzická kolize.** Betonový vzhled je projektově motivovaný, ale skutečný as-built povrch a odstín zatím nejsou ověřené. Source-lock test celé topologie a bezpečného clippingu + mobilní a široká WebGL kontrola; runtime `__miloviceArmadniPromenadeRuntime5293`. PR #83 sloučen jako `b1f8246`, všech 5/5 CI PASS; GitHub Pages po merge nebyly nezávisle ověřeny.

## Milovice RP 5.292 — projektově doložená dlažba původních cest C13/C14 (24. 11. 2026; PR #82 MERGED, 5/5 CI PASS; Pages neověřeny)

Podle [veřejného městského projektu DIO 2022](https://ud.mestolysa.cz/vr2022/vm12/MULL0B01AO22_0/MULL0B01AO3X/DIO.pdf) je pro pěší plochy C13/C14 navržená šedá betonová dlažba, pro vozovky asfalt a pro parkovací plochy oddělená konstrukce. **Projekt není fotografie skutečně postaveného stavu.** Proto pouze pět přesně OSM-zamčených původních pěších cest `1468803921`, `1468803937`, `1468803938`, `1468803907` a `1468803914` dostává jednu společnou decentní modelovou barevnou variantu procedurální dlažby. Souřadnice, trasy, dopravní síť, budovy, kolize i již opravená šířka 5.291 zůstávají nezměněné. **Žádná nová silnice, chodník, zebra, obrubník ani parkovací místo.** Source-lock modul + test 5.292, Validate CI a zdrojový odkaz v panelu západní Armádní. Skutečné barvy/rozměry dlažby nejsou potvrzené. CI/WebGL/Pages čekají.

## Milovice RP 5.291 — bezpečná obnova ~32 m původního chodníku Armádní (24. 11. 2026; CI/Pages čekají)

U originálního OSM rezidenčního úseku `1373371687` defaultní modelová šířka 7,8 m skryla část již zmapovaného OSM chodníku `1468803914`. Nový zdrojově zamčený plán používá jen u tohoto úseku **procedurální odhad 5,0 m**, takže se přibližně 32 metrů původního chodníku může znovu bezpečně vykreslit. Skutečná šířka vozovky nebyla geodeticky ani fotograficky zaměřená.

Zachovány GPS, pěší a automobilové trasy, jiné ulice, všechny budovy, zeleň, parkovací místa i kolize. Nejsou přidány žádné nové vozovky, přechody, zebry, chodníky, obrubníky ani místa k parkování. Přidán `scripts/osm-armadni-sidewalk-clearance-5291.js`, Node regresní test, CI krok Validate a runtime `__miloviceArmadniSidewalkRuntime5291`. **CI/WebGL/Pages zatím neověřeny.** Další krok: zdrojové fotografické srovnání celého předprostoru.

## Milovice RP 5.290 — 3D zeleň na čtyřech původních travnatých plochách Armádní (24. 11. 2026; PR #80 MERGED, 5/5 CI PASS; Pages neověřeny)

Podle **skutečné OSM mapy**, nikoli vymyšlených pozemků, přidán drobný prostorový porost na čtyři již renderované polygony `landuse=grass`: `1468803911`, `1468803935` (poblíž Armádní 886/887) a `1468803941`, `1468803951` (poblíž Armádní 890/891). Jejich původní GPS souřadnice, obrysy, terén, chodníky a průjezdné komunikace **se nemění**. Jednotlivé vizuální trsy trávy mají modelový, nikoliv změřený odstín ani skutečně zaznamenaný počet či polohu. Každý stojí uvnitř původní travnaté plochy a mimo dosah všech známých cest a půdorysů budov.

Všechny trsy ze čtyř ploch se vyrenderují v **jednom sdíleném 3D meshi a jednom materiálu**, maximálně 39 modelových trsů / 78 trojúhelníků, bez zbytečných GPU draw-callů, textur, animací a fyzických překážek. Zdrojové hash uzamčení brání přidávání detailů na chybný polygon. Regresní Node test + mobilní/široký Chromium WebGL kontrola po 7,1 s LOD. Původní 4 domy Armádní, 357 z 360 oken, balkony 891, všechny cesty, parkovací stání a NPC beze změn. U parkování zůstává potřeba ověřit skutečnou polohu a povrch z fotografií nebo aktualizované mapy, ne odhadovat.

---

## Milovice RP 5.289 — Armádní 886/C14 a 887/C13: provizorní fasády západního bloku (24. 11. 2026; PR #79 MERGED, 5/5 CI PASS; Pages neověřeny)

Po nových modelových fasádách domů C15/890 a C16/891 dostala i **západní dvojice C14/886 a C13/887** dvě vlastní optické fasádní vrstvy od přízemí ke střeše. Původní mapové půdorysy obou budov (**OSM 1164238465 / 1164238466**, **RÚIAN 119003791 / 119001071**), 4 podlaží, všechny objemy/střechy, 25 bytů v každém, okna a kolize zůstávají nezměněné. Nově 2 sdílené barevné meshe / 84 trojúhelníků na dům, tedy celkem **4 meshe / 168 trojúhelníků**, 2 opakovaně sdílené materiály.

<underline>Co je doložené</underline>: [developer C13/C14](https://www.bydleni-milovice.cz/filosofie/) uvádí předzahrádky u přízemních bytů a balkony u ostatních do 12 m². [Adresný rejstřík ITES](https://www.finmag.cz/obchodni-rejstrik/zivnostensky-rejstrik/47539801-ites-spol-s-r-o) potvrzuje **886=C14 a 887=C13**. <underline>Co doložené není</underline>: přesný odstín přízemí/horní stěny, výška tmavého pásu, poloha balkonů, jejich počet na jednotlivých fasádách či zakreslené vstupy. Tyto barvy jsou vědomě provizorní, bez tvrzení o fotograficky přesné rekonstrukci. Nejsou přidány žádné neznámé balkony, terasy, dveře ani parkování.

Kamera `streetAudit=armadni-houses-west-5282` má aktualizovaný kontrolní panel a runtime `__miloviceArmadniWestRuntime5289` dokumentuje oba původní domy, jejich nezměněný půdorys a počet renderovaných meshů i po LOD. Přidaný geohashově zamčený Node test a stávající mobilní/široký WebGL test.

---

## Milovice RP 5.288 — Armádní 890: provizorní dvoubarevný povrch C15 (24. 11. 2026; PR #78 MERGED, 5/5 CI PASS; Pages neověřeny)

Bytový dům **Armádní 890** má nyní samostatnou barevnou 3D fasádu na všech 10 původních hranách (2 sdílené meshe / 60 trojúhelníků). Je součástí stejného projektu STAKO **C15/C16** jako sousední 891; identitu 890=C15 výslovně potvrzuje městský zápis rady 29/2024. **Odstíny a dělení tmavého přízemí / světlých horních podlaží jsou vizuální odhad převzatý z vlastního fotoověřeného návrhu 891; hotová fasáda 890 nebyla fotoověřena**. Není to automatické tvrzení, že dva domy vypadají shodně; pouze přechodný konzistentní model celé dvojice pro další ruční porovnání.

Původní budova OSM `1047406191` / RÚIAN `107124980`, 4 podlaží, výška 12,2 m a 92 prozatímních okenních polí zůstávají nedotčené, stejně jako všechny cesty, stromy a kolize. Modelový tmavý pás v +0,039 m překrývá starý šedý vizuální sokl, ale leží za okny. **Žádné nové balkony, přízemní terasy, vchody či parkovací stání**. Kontrolní panel výslovně rozlišuje projektové podklady C15/C16 od fotograficky ověřené C16/891, Node a mobilní/široká WebGL regrese kontroluje přítomnost i nejistoty.

Zdroje: [STAKO – C15/C16](https://www.stakohk.cz/MILOVICE-Bydleni-v-zeleniBD-C-15-a-C-16.html), [Město Milovice – zápis 29/2024](https://milovice.hlasenirozhlasu.cz/files/milovice/attachments/249858/Anonymizovany-Zapis-z-jednani-29-2024-2547.pdf), [fotogalerie sousední Armádní 891](https://jirisimon.cz/milovice/).

---

## Milovice RP 5.287 — Armádní 891: souvislá tmavá fasáda přízemí (24. 11. 2026; PR #77 MERGED, 5/5 CI PASS; Pages neověřeny)

V [adresné fotogalerii domu Armádní 891](https://jirisimon.cz/milovice/) je patrné tmavé přízemí a světlá vyšší podlaží. Původní barevná vrstva však v herní 3D scéně začínala až 70 cm nad terénem, proto dole prosvítal generický šedý sokl z provizorních fasád. Oprava protáhne stejný tmavý povrch až k modelové úrovni +0,02 m na všech původních deseti obvodových hranách a mírně jej vysune před generický sokl (+0,039 m proti +0,036 m). Nadále zůstává za okny (+0,044 m a více); světlá separační lišta zůstává viditelná. Barevné odstíny, výška pásu a nefotografované strany jsou **odhad**, ne 360° fotogrammetrie. Žádná změna půdorysů, průchodnosti, kolizí ani skutečných dveřních otvorů.

Zůstávají 2 sdílené fasádní meshe / 60 trojúhelníků, 357 z 360 původně plánovaných modelových oken, 5 balkonových meshů / 360 trojúhelníků, nezměněné OSM/RÚIAN 886/887/890/891. Doplněna geometrická regrese výšky a pořadí vrstev a mobilní WebGL kontrola.

---

## Milovice RP 5.286 — překrytá modelová okna za balkony č.p. 891 (23. 11. 2026; PR #76 MERGED, 5/5 CI PASS; Pages neověřeny)

Na jižní, fotograficky **odvozené** (nikoli zaměřené) OSM hraně 6 původního bytového domu Armádní 891 bylo za trojicí modelových balkonových dveří nadále zbytečně vykreslováno předchozí generické okno v prvním poli na podlažích 1–3. Nová kontrola odvozuje překryté okenní pole z původní OSM hrany a polohy modelových balkonových dveří. Sdílený renderer vynechá pouze **tři odhadnuté okenní overlaye** (kompletní rámy, zasklení, příčky a parapety); ostatní budovy ani neodhadovaná fyzická zeď se nemění.

Z původních **360 plánovaných okenních polí** se vykresluje **357**, původních 16 batch meshů / 26 fasád zůstává, počet jejich trojúhelníků klesá z 5136 na 5094. Balkonové meshe zůstávají 5/360 trojúhelníků a krycí plochy jsou stále před zdí, bez skutečného otvoru. Zdrojově zamčené geometrii odpovídá Node a mobilní/široká Chromium WebGL regrese po LOD 7,1 s. Nepřibyly budovy, kolize ani chodníky; orientace a vzhled balkonů stále nejsou geodeticky nebo fotograficky pozicované přesně.

---

## Milovice RP 5.285 — přepínání tří technických pohledů Armádní (23. 11. 2026; PR #75 MERGED, 4/4 CI PASS; Pages neověřeny)

Kontrolní panel zdrojů má nyní tři přímé volby: blok 890/891, blok 886/887 a balkonový detail 891. Při přepnutí se používá pouze existující `streetAudit` URL předvolba a zachovávají se ostatní parametry (například `v`). Aktivní pohled nelze omylem znovu spustit; zůstává označený v panelu. Kontrola usnadňuje srovnání modelovaných domů se skutečnými exteriérovými podklady, **sama ale žádné foto umístění neověřuje**. Nulové změny 3D geometrie, OSM/RÚIAN dat, chodníků a kolizí. Node regresní test přepínání a vymezení zdrojového panelu.

---

## Milovice RP 5.285 — ověřený zdroj terasy Armádní 890 a kontrolní panel (23. 11. 2026; CI čekají)

Adresný [inzerát Armádní 890](https://www.bezrealitky.cz/nemovitosti-byty-domy/719934-nabidka-pronajem-bytu-armadni-milovice) potvrzuje přízemní byt s předzahrádkou a **terasou 13 m²** (zveřejněn 25. 5. 2022). Neprokazuje fasádní hranu ani polohu terasy, proto **žádná nová terasa, vchod, chodník či kolize nevzniká**. Panel zdrojů při východní kamerové kontrole nyní uvádí tento údaj a varování; západní kamera 886/887 už nezobrazuje nesouvisející sdělení o balkonech 891. Doplněný Node test ověřuje obě varianty panelu a epistemická omezení. OSM/RÚIAN data a runtime 3D geometrie se nemění.

---

## Milovice RP 5.285 — modelové balkonové dveře bez prosvítání starých oken (23. 11. 2026; CI čekají)

Oprava Armádní 891 řeší dvojité zasklení: za třemi průsvitnými modelovými dveřmi je nově tenký tmavý neprůhledný podklad (pátý sdílený mesh), který opticky zakrývá původní provizorní okno i parapet. Celá skupina balkonů má **5 meshů / 360 trojúhelníků**. Nevznikají stavební otvory, nové budovy ani kolize; původních 360 odhadovaných oken zůstává v modelových datech. Skutečné umístění dveří není fotozaměřeno. Aktualizovaný Node materiálový test a mobilní/široký WebGL test mají potvrdit vrstvení a LOD před merge.

---

## Milovice RP 5.285 — oprava modelového materiálu balkonových dveří (23. 11. 2026; CI čekají)

Původní model tří balkonů na Armádní 891 zůstává geometricky beze změn. Čtvrtý sdílený materiál skleněných výplní je nyní částečně průsvitný (`opacity: 0.58`, `depthWrite: false`), zatímco betonové desky, parapety a kovová madla zůstávají neprůhledné. Jde o **modelovou grafickou opravu**, ne ověřený typ skla ani stavební otvor. Nový Node regresní test kontroluje, že průsvitnost nedopadá na tři pevné vrstvy. Očekává se CI a mobilní/široký Chromium/SwiftShader test před sloučením. Nezměněno: OSM/RÚIAN data, balkony, rozměry, počet meshů/trojúhelníků, nové kolize 0.

---

## Milovice RP 5.285 — skutečné 3D balkonové objemy Armádní 891 na odvozené jižní fasádě (22. 11. 2026; PR #71 MERGED, 5/5 CI PASS, Pages čekají)

**Zdroj / výklad:** exteriérové fotografie stavby č.p. 891 (`01-93`, `milovice-20/23/24`) z [adresní fotogalerie](https://jirisimon.cz/milovice/) ukazují vertikální sloupec balkonů. V původním RÚIAN půdorysu `1047406190` je vedle východní hrany původní OSM komunikace `1046197816`; z parkování viditelného po pravé straně fotografie je jako nejpravděpodobnější kandidát odvozená **jižní obvodová hrana 6**. Fotografické snímky **neobsahují průkazný GPS azimut**; nejde o metrickou rekonstrukci a stranu lze později opravit. Geodeticky ověřený je jen půdorys, nikoli balkonové kotvy.

**Herní 3D změna:** `scripts/osm-armadni-891-balconies-5285.js` vytváří **tři balkony nad přízemím** na jediné ověřené *původní* obvodové hraně 6: 3 nízké desky, modelové plné boční/čelní parapety, madla a 3 modelové skleněné balkonové dveře. Batched geometry: **4 meshe, 324 trojúhelníků**. Model šířky 2,65 m a vyložení 1,38 m není změřený; barva a přesné umístění otvorů zůstávají odhadem. Ostatní balkonové stěny nejsou domodelované z domněnek. Objekty nemají nové fyzikální kolize; nevznikají domy, silnice ani chodníky. Původní 4 bytové domy a jejich 100 bytů / 360 modelových oken zůstávají. Čtyři sdílené GPU materiály a 3 výškové úrovně drží malé zatížení vykreslování, fotoobrazy nejsou zabudované do hry.

**Ověření:** nový Node `scripts/osm-armadni-891-balconies-5285.test.mjs` hlídá identitu OSM/RÚIAN + hash, 3 původní podlaží, původní východní silnici, konkrétní jižní hranu a vznik čtyř render meshů bez nových kolizí. Původní mobilní + široký Chromium/SwiftShader `scripts/osm-armadni-houses-5282-webgl.mjs` běží nově přímo v [kameře jižních balkonů](https://foxey-cz.github.io/milovice-life-rp/?v=528500&streetAudit=armadni-891-south-balconies-5285) po více než 7 s LOD. Source-panel dál obsahuje externí fotografickou galerii a vědomé omezení přesnosti. **5/5 hlavních CI PASS** na závěrečném PR commitu `bb075698`: [Validate #45061312474](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45061312474), [street-block s novou kamerou po LOD #45061312394](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45061312394), [Station #45061312456](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45061312456), [Nádražní #45061312400](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45061312400), [Italská #45061312404](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45061312404). [PR #71](https://github.com/FOXEY-CZ/milovice-life-rp/pull/71) sloučen do main jako `dc12da88`. Pages po merge čekají na výsledek.

---

## Milovice RP 5.284 — skutečná fotografie Armádní 891 a dvoubarevná fasáda (22. 11. 2026; PR #70 MERGED, CI 5/5 PASS, Pages čekají)

**První zdrojově adresná fyzická fasáda tohoto bloku:** [galerie č.p. 891](https://jirisimon.cz/milovice/) výslovně uvádí Armádní 891 a obsahuje fotografie dokončené budovy s výrazně **světlými horními patry a tmavším přízemím**, balkony a terasou. Fotografie je reálný exteriér, nikoliv vizualizace projektu C16. Modelové barvy, hloubka barevné vrstvy a přibližná výška tmavého pásu **2,90 m** nejsou geodeticky ani kolorimetricky změřeny; fotografie neurčuje, která přesná hrana OSM půdorysu nese který balkon.

**Nová 3D změna:** `scripts/osm-armadni-891-photo-wall-5284.js` přidává na původní uzavřený OSM/RÚIAN polygon `1047406190` (`107125749`) po přesné hash kontrole v existujícím plánu 5.282 **20 spodních/horních barevných segmentů + světelnou horizontální separaci**. Dvě spojené 3D mesh vrstvy, 60 trojúhelníků, za původními okny a nad nedotčeným soklem, bez nového domu, střešního objemu, vchodu, balkonu, vozovky či kolize. Některé obvodové stěny nejsou na fotkách vidět: pokračování stejných tónů je **explicitně odhad**. Žádné cizí fotografie či textury nebyly převzaty do repozitáře. Domy 886/887/890 jsou beze změn. Zdrojový panel kamer nyní odkazuje přímo na galerii 891; starý smazaný inzerát se nepoužívá jako podklad. Nové testy pro source-only gate, generovanou geometrii a mobilní+široký prohlížeč po LOD. Výchozí kamera: [Armádní 890/891](https://foxey-cz.github.io/milovice-life-rp/?v=528400&streetAudit=armadni-houses-east-5282). **CI 5/5 PASS** na commitu `9990e284`: Validate [#45057876965](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45057876965), street-block Armádní mobile+wide WebGL [#45057876946](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45057876946), Station [#45057876927](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45057876927), Nádražní [#45057876947](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45057876947), Italská [#45057876959](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45057876959). [PR #70](https://github.com/FOXEY-CZ/milovice-life-rp/pull/70) **MERGED** `dc53056a`. Pages [#45058662005](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45058662005) při zápisu čekají; fotorealistická přesnost balkonů/okenních otvorů není potvrzená.

---

## Milovice RP 5.283 — Armádní: panel zdrojů fasád ve dvou 3D kamerách (22. 11. 2026; PR #68 a #69 sloučeny, obě 5/5 CI PASS, Pages #45056339198 PASS)

**Oprava upřesnění 5.283 (22. 11. 2026, doplnění zdrojového auditu):** městský [zápis rady 29/2024, str. 2](https://milovice.hlasenirozhlasu.cz/files/milovice/attachments/249858/Anonymizovany-Zapis-z-jednani-29-2024-2547.pdf#page=2) výslovně přiřazuje **BD C15 ke č.p. 890** a **BD C16 ke č.p. 891**. Nový panel už netvrdí, že tato identifikace je neznámá. Odkaz k č. 891 na Měšec.cz nyní zobrazuje jen smazanou nabídku, takže není používán jako důkaz konkrétní terasy. Projektová vizualizace STAKO stále není potvrzením realizované fasády. Žádné fyzické 3D objekty, GPS, okna ani kolize se nemění. [PR #68](https://github.com/FOXEY-CZ/milovice-life-rp/pull/68) sloučen (`f8bc9fd`), 5/5 hlavních CI PASS na `2488c1b`; [Pages #45055161905](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45055161905) **PASS**. Zpřesnění C15=890/C16=891 je sloučené jako [PR #69](https://github.com/FOXEY-CZ/milovice-life-rp/pull/69) (`b091274`), **5/5 CI PASS** na `4d05c5a`; [Pages #45056170786](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45056170786) má build PASS a nasazení zatím čeká.

V technických kamerách \`armadni-houses-east-5282\` a \`armadni-houses-west-5282\` je rozbalitelný panel **„📷 Armádní — zdroje a nejistoty“** pro původní budovy 886, 887, 890 a 891. Odkazuje na [vizualizaci STAKO C15/C16](https://www.stakohk.cz/MILOVICE-Bydleni-v-zeleniBD-C-15-a-C-16.html), [zápis města](https://milovice.hlasenirozhlasu.cz/files/milovice/attachments/249858/Anonymizovany-Zapis-z-jednani-29-2024-2547.pdf), a adresní nabídky [886](https://reality.idnes.cz/detail/prodej/byt/milovice-armadni/6ad32c2feb13dfe0ed01b097/), [890](https://www.bezrealitky.cz/nemovitosti-byty-domy/719934-nabidka-pronajem-bytu-armadni-milovice). Původní inzerát č. 891 je již smazaný a nelze z něj doložit terasu. Pro 887 nebylo přesné foto potvrzeno. Projektové vizualizace **nejsou** fotografie hotové fasády, umístění skutečných balkonů stále není známé. Cizí obrázky nejsou kopírované do assetů.

**Žádné nové fyzické objekty:** Původní GPS/půdorysy/4 podlaží, 360 odhadnutých oken, střechy a kolize 5.282 zůstávají beze změn. Nový source manifest \`scripts/osm-armadni-evidence-5283.js\`, Node test a rozšířený mobilní/široký Chromium/SwiftShader test panelu po 7,1s LOD. **5/5 hlavních CI PASS** na PR commitu `2488c1b` (Validate #45054566702, Station #45054566664, Nádražní #45054566668, street-block #45054566663, Italská #45054566667). **Základní Pages 5.283 PASS (#45055161905); opravné Pages #45056170786 měly při zápisu build PASS a deploy ve frontě.** Další: skutečně přiřadit fotografii ke konkrétní fasádní OSM hraně před 3D modelováním balkonů.

---

## Milovice RP 5.282 — čtyři původní bytové domy Armádní 886–891 (22. 11. 2026; PR #67 sloučen, CI 5/5 PASS, Pages PASS #45052283109)

**Viditelná změna celého bloku:** OSM/RÚIAN domy Armádní **886, 887, 890, 891** mají 4 mapovaná podlaží a 25 bytů každý; jedná se o **čtyři již existující** 3D obytné objemy, ne nové budovy. Source-locked modul `scripts/osm-armadni-houses-5282.js` používá původní GPS polygon + přesné hashe a sdílený modelový renderer 5.192. Na **26 původních fasádních hranách** vizuálně doplní cca **360 modelových oken a sokly přes 16 GPU meshů**. Původní obvodové zdi, podlaží, střechy, kolize, cesty a ostatní město beze změny. Nejsou přidávány domy, balkony, vchody ani skutečná čísla/křivky oken; vzhled fasád **nebyl fotograficky zaměřen** a modelový rastr není považován za autentické rozměry.

**Zdroje:** OSM `1164238465`, `1164238466`, `1047406190`, `1047406191` (ČÚZK RÚIAN půdorysy a meta tagy). ČÚZK/ČSÚ a veřejné adresní evidence mapují domy 886, 887, 890 a 891 na příslušná čísla stavebních objektů. Zápis Rady města Milovice 29/2024 potvrzuje projekt C15/C16 pro 890/891: https://milovice.hlasenirozhlasu.cz/files/milovice/attachments/249858/Anonymizovany-Zapis-z-jednani-29-2024-2547.pdf . Realitní fotografie nebyly kopírované do assetů ani zaměněné za prokazatelnou fasádu konkrétního OSM domu.

**Kontroly:** Node `scripts/osm-armadni-houses-5282.test.mjs` kontroluje originální GPS hashe, 100 bytů, 360 modelových oken, 16 sdílených render meshů a nulové nové budovy/kolize. Mobilní + široký Chromium/SwiftShader test `scripts/osm-armadni-houses-5282-webgl.mjs` po 7,1 s LOD ověří přítomnost čtyř obytných bloků v aktuální scéně. Technické kamery `?v=528200&streetAudit=armadni-houses-east-5282` a `?v=528200&streetAudit=armadni-houses-west-5282`. **5/5 CI PASS**: [Validate](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45051610933), [Station Photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45051610960), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45051610978), [blok 5.82 + nový mobilní/široký WebGL test Armádní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45051610954), [Italská](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45051611029). [PR #67](https://github.com/FOXEY-CZ/milovice-life-rp/pull/67) sloučen do `main` jako `84932bb`, závěrečný PR commit `807df25`. **GitHub Pages pro 5.282 potvrzené**: [run #45052283109](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45052283109) dokončil build a deploy jako `success` na commitu `c86da96`; **fotografická shoda fasád nadále není ověřená**.

---

## Milovice RP 5.281 — odstranění falešných povrchových chodníků u podzemních cest (22. 11. 2026; PR #66 sloučen, CI 5/5 PASS, Pages PASS #45050325323)

**Vizuální oprava celé mapované lokality:** pět původních OSM pěších cest `435045331`, `435050519`, `1330579585`, `1330579586`, `1330579587` u „Nadzemí podzemí“ je zdrojově označeno `highway=path`, `tunnel=yes` a `layer=-1`. Dosavadní univerzální renderer je kreslil jako povrchový chodník přímo na terénu (DEM). **Verze 5.281 potlačuje 11 těchto falešných povrchových úseků, přibližně 136 m**, podle všech pěti původních souřadnicových OSM geometrií a jejich hashů. Původní pěší trasy, GPS, mapové podklady a podmínky přístupu se nemění. Nejde o skutečně vymodelovaný tunel — hloubka, konkrétní průřez, povrch i vchody jsou zatím neověřené; bez zdrojových dat je nevymýšlíme.

**Rozsah a ověření:** vstupní data `data/regions/vrutice.json` a `westlink.json` jsou nezměněná, žádná nová silnice, chodník ani collider. `scripts/osm-vrutice-underground-surface-5281.js` chrání přesné OSM tagy/uzly pomocí hashů; test kontroluje zdroj, 11 nevykreslených povrchových segmentů a zachování 4 duplicitních regionálních záznamů. Nová technická kamera `?v=528100&streetAudit=vrutice-underground-path-5281` a mobilní/široký Chromium test po LOD. **5/5 kontrol PR GitHub Actions PASS**: Validate #45049498971, Station #45049498952, Nádražní #45049499045, blok 5.82 #45049498956 (včetně nové mobilní a široké Vrutice Chromium kontroly po LOD), Italská #45049498963. [PR #66](https://github.com/FOXEY-CZ/milovice-life-rp/pull/66) sloučen do `main` jako `7e5f5b6`; poslední PR commit `fba66e4`, nový build marker `20261122-vrutice-underground-528100`. **GitHub Pages nasazení 5.281 potvrzeno**: [run #45050325323](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45050325323) dokončil build a publikování jako `success` na commitu `799e3f2`. **Živý prohlížečový runtime ani fotografické srovnání záběrů nebyly nezávisle potvrzeny.**

---

## Milovice RP 5.280 — plynulejší chodec Pod Lesem (22. 11. 2026; PR #65 sloučen, CI 5/5 PASS, Pages 45048472704 PASS)

**Viditelná herní změna:** dosavadní jediný NPC na původní 267,399 m OSM pěší trase Pod Lesem × Armádní už nemění natočení skokově v každém lomu trasy či na jejím západním konci. Nový malý modul `scripts/osm-pod-lesem-walker-pose-5280.js` omezuje rychlost otáčení na 4,6 rad/s (s pojistkou velkého délkového snímku), krokovou animaci váže na skutečnou uraženou vzdálenost místo běhu hodin a při čekání před modelem zebry zklidňuje ruce a nohy. Jde o herní animaci, nikoli fotometrické či pohybové zaměření reálných chodců.

**Beze změn:** stejné GPS a ID OSM 1005977571/1044078118, stávající 9,6m stop před servisní silnicí 1456361936, ochrana 5.279 proti kolineárnímu překryvu vozovky, 4s predikce aut, jeden původní NPC, mapové vrstvy, kolize, budovy, vozidla i renderovací rozpočty. Nové modely ani trasy se nepřidávají.

**Testování:** rozšířen Node test `osm-pod-lesem-west-join-5278.test.mjs` o úhlový wrap, mezní rychlost otáčení, krok po metrech a klid při čekání. Rozšířen mobilní + široký Chromium/SwiftShader test `osm-pod-lesem-crossing-walker-webgl-5275.mjs` po 7,2 s LOD o 5.280 runtime diagnostiku. **5/5 GitHub Actions PASS** na závěrečném commitu `dcfca17`: [Validate](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45047702331), [Station Photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45047702377), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45047702338), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45047702355) a [Italská mobilní WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45047702343). [PR #65](https://github.com/FOXEY-CZ/milovice-life-rp/pull/65) sloučen do `main` jako `969e716`. Testy byly během PR upraveny tak, aby starší testy neselhávaly jen kvůli změně build označení; aktuální test hlídá přesný nový build marker `20261122-pod-lesem-walker-pose-528000`. **GitHub Pages nasazení ani vizuální shoda se skutečnými fotografiemi dosud nezávisle potvrzeny nejsou.**

---

## Milovice RP 5.279 — bezpečný souběh chodníku a nově mapované motorové silnice (22. 11. 2026; PR #64 MERGED, CI 5/5 PASS, Pages neověřeno)

**Oprava podkladové bezpečnostní podmínky, nikoli nová geometrie:** pěší trasa 5.278 na původním OSM chodníku 1044078118 byla chráněna před novou motorovou cestou, která ji protne. Dvě přesně souběžné a překrývající se úsečky však původní test průniku nezachytil. Kontrola v `scripts/osm-pod-lesem-west-join-5278.js` teď navíc detekuje **plný i částečný kolineární překryv**; při takové změně zdrojové mapy se prodloužení odmítne a funguje původní fallback 5.277/5.275. Příslušný regresní test přibyl do `scripts/osm-pod-lesem-west-join-5278.test.mjs`.

**Beze změn pro běžnou hru:** dosavadní 267,399 m pěší trasy, zastavení cca 9,6 m před OSM servisní silnicí 1456361936, simulovaná dopravní predikce, GPS, OSM export, mapa, objekty, vozovky, FPS limit a rozpočet NPC jsou zachovány. Nedochází k fyzickému stavění a žádné skutečné nové křížení není geodeticky potvrzeno.

**Ověření:** všech 5 GitHub Actions PR workflow **PASS**: [Validate](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45045544270), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45045544166), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45045544231), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45045544157) a [Italská mobilní WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45045544273). [PR #64](https://github.com/FOXEY-CZ/milovice-life-rp/pull/64) sloučen do `main` jako `7d07ee1`. GitHub Pages pro tuto aktualizaci zatím nejsou potvrzené. Screenshoty nebyly samostatně obrazově přezkoumány.

---

## Milovice RP 5.278 — +70,8 m navazujícího OSM chodníku na západ (22. 11. 2026; PR #62 sloučen, CI 60/60 PASS, Pages čeká)

**Běžná hra:** jediný původní chodec Pod Lesem × Armádní nově pokračuje z cca 196,6 m trasy verze 5.277 na další původní OSM `highway=footway, footway=sidewalk` **1044078118**, přesně navazující v GPS `50.2290044,14.8702188`. Využívá jeho první čtyři skutečné segmenty (70,806 m), celkem **267,399 m** původních chodníků. Na původním uzlu 4 se otočí, **9,6 m před OSM servisní silnicí 1456361936**, protože její pěší převedení není ověřené. Východní pokračování přes Zátopkovu také zůstává zablokované.

**Ochrana zdrojů:** OSM 1044078118 má 11 GPS uzlů, doložené `lit=yes`, nikoli materiál povrchu, geohash `26506719`; servisní cesta se musí potkat s původním uzlem chodníku 5. Nově zmapovaná motorová komunikace protínající pokračování ho vypne a zachová fallback 5.277/5.275. Ponechána 4s predikce vozidel před vstupem na stávající modelovou zebru, stále jediný NPC, žádné nové silnice, chodníky, přechody, obruby, kolize, stavby ani parkoviště.

**Ověření:** nový Node `scripts/osm-pod-lesem-west-join-5278.test.mjs` pro společné uzly, cca 267 m a bezpečné zastavení před service road; rozšířené Chromium/SwiftShader mobile + wide po 7,2s LOD včetně západní technické kamery. **60/60 GitHub Actions PASS** (55 push + 5 PR); zdrojový Node i mobilní/široký Chromium/SwiftShader včetně západní technické kamery po 7,2 s LOD výslovně logují PASS 5.278. CI uložilo screenshoty do artefaktu italska-apartments-5235 (#45042659993). [PR #62](https://github.com/FOXEY-CZ/milovice-life-rp/pull/62) sloučen do main jako `a850a53` po všech 60 PASS; nové [GitHub Pages #45043547046](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45043547046) zatím čeká na dokončení. Screenshoty automaticky vytvořeny, nikoli nezávisle vizuálně prohlédnuty.

Technické kamery: `?v=527800&streetAudit=pod-lesem-pedestrian-5275`, `?v=527800&streetAudit=pod-lesem-west-sidewalk-5278`. Kamery **nejsou** fotografická shoda.

---

## Milovice RP 5.277 — chodec po cca 197 m originální OSM trasy s předvídáním aut (22. 11. 2026; PR #61 sloučen, CI 5/5 PASS, Pages PASS)

**V běžné hře:** jediný původní modelový chodec u Pod Lesem × Armádní sleduje cca 196,6m původní mapovaný sidewalk 1005977571: 11m východní nástup, již existující modelová zebra a tři západní OSM segmenty až na mapovaný západní konec. Místo 22m smyčky se na koncích otočí a jde po skutečných lomech OSM. Zachovává z 5.276 predikci přijíždějících aut z jejich změřené simulované rychlosti s horizontem 4s; už zahájené přecházení nezamrzne uprostřed silnice.

**Ochrana skutečnosti:** vstupní GPS v OSM, 7 uzlů, hash 263e12b3, OSM vozovka s motor_vehicle=no, žádná nová komunikace, obruba, přechod, kolize ani budova. Východní pokračování přes Zátopkovu není aktivováno bez dalšího podkladu. Protnutí prodloužené trasy nově přidanou motoristickou OSM cestou vypne prodloužení a umožní původní bezpečný 22m model. Městem doložené pruhy zebry mají stále modelovou, nikoli geodeticky zaměřenou polohu.

**Testy:** scripts/osm-pod-lesem-sidewalk-chain-5277.test.mjs ověřuje původní uzly, 197m trasu, odvrácení před přijíždějícím vozidlem, chůzi po zahájeném přechodu, otočení na konci a ochranu před další protínající OSM cestou. Zachována regrese predikce 5.276 a mobilní/široký Chromium/SwiftShader po 7,2s LOD. Rozšířené workflow Italská — **5/5 hlavních PR CI PASS**, mobilní+wide Chromium/WebGL PASS (#45039718557); [PR #61](https://github.com/FOXEY-CZ/milovice-life-rp/pull/61) sloučen jako `a58f719`. GitHub Pages [#45041782043](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45041782043) **PASS** na merge commitu. Browserový artefakt vytvořen; jeho screenshot nebyl samostatně obrazově prohlédnut.

Technická kamera: ?v=527700&streetAudit=pod-lesem-pedestrian-5275

---
## Milovice RP 5.276 — Pod Lesem × Armádní: chodec předvídá přijíždějící vozidla (22. 11. 2026; PR #59 sloučen, cílené Node/WebGL CI PASS, Pages PASS)

**Oprava skutečné slabiny chování simulace 5.275:** původní chodec na již existující OSM chodníkové ose `1005977571` čekal před modelovou zebrou Pod Lesem jen tehdy, pokud se **auto už nacházelo do 6,2 m od jejího středu**. Rychleji přijíždějící vůz byl mimo tento kruh a chodec mohl vstoupit přímo před něj. Verze 5.276 sbírá z předchozí a aktuální simulované pozice vozidla jeho 2D rychlost (jen při stabilní délce snímku), vypočítá **nejkratší předpokládanou vzdálenost k přechodu v dalších 4 sekundách** a chodce zdrží ještě před vstupem do vozovky, pokud tato vzdálenost klesne pod původní modelový bezpečnostní poloměr 6,2 m. Auto, které odjíždí, by ho naopak nemělo zbytečně blokovat. Výpadek rychlosti, teleport nebo velký jitter se ignorují; pro auta již blízko stále funguje původní vzdálenostní blokace.

**Zachování přirozeného chování:** pokud chodec už na přechod vešel, **nezastaví se uprostřed** kvůli později objevenému autu. Jde o konzervativní herní algoritmus, nikoliv certifikovanou simulaci dopravní bezpečnosti: rovnoměrná predikce 4 sekund neumí předvídat náhlou změnu směru, brzdění nebo teleport vozu. Žádné nové chodníky, obrubníky, vozovky, kolize, značky ani NPC trasy; souřadnice, 22m cesta, jeden NPC, 5.274 zebra, 5.272 asfaltové výplně a 5.273 zpevněná cesta zůstávají.

**Regrese:** `scripts/osm-pod-lesem-crossing-walker-5275.test.mjs` nyní testuje přijíždějící/odjíždějící vozidlo, vzdálené vozidlo, výkyv naměřené rychlosti, auto přímo u přechodu, obě pěší orientace a dokončení již započatého přechodu bez zastavení. Stávající Chromium/SwiftShader mobile+wide po 7,2 s LOD kontroluje nový build i diagnostiku `predictiveVehicleSafety5276`. **Cílené testy PASS:** [Italská + Pod Lesem Chromium/SwiftShader mobile+wide #45038003590](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45038003590) — log obsahuje Node `PASS 5.276` i Chromium/WebGL `PASS 5.276` po 7,2s LOD. [Topolová HUD opravená regrese #45038495627](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45038495627) rovněž PASS. PR #59 sloučen do `main` commitem `d740536`. Při rozšířeném testování původní větve jeden starší test Topolové selhal pouze kvůli tomu, že četl `hud.hidden` **po** zrušení pěší zakázky, ale očekával aktivní stav. Opravený test nyní vyhodnocuje stav **před** i **po** zrušení. Ostatní nahlášené širší kontroly byly úspěšné; všech pět hlavních workflow z předchozích verzí na tomto commitu není samostatně potvrzeno. **GitHub Pages 5.276 úspěšně nasazeno:** [#45039174079](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45039174079) pro `main` `99805f2`, který obsahuje PR #59.

**Podklady:** OSM chodník [1005977571](https://www.openstreetmap.org/way/1005977571) a ulice [Pod Lesem 128087258](https://www.openstreetmap.org/way/128087258) jsou zdrojově zamčené; samotnou existenci zebry dokládá [městská zakázka](https://zakazky.mesto-milovice.cz/contract_display_85.html). Poloha skutečně namalovaných pruhů není geodeticky ověřená. Nenahrazovat dochované schéma z úřední desky odhadem.

---

## Milovice RP 5.275 — přecházející NPC na existujícím chodníku Pod Lesem × Armádní (22. 11. 2026; PR #58 sloučen, 5/5 CI PASS, Pages PASS)

**Viditelná změna běžné hry:** obecný systém 5.243–5.247 úmyslně brání generickým chodcům vstupovat na vozovku. Na Pod Lesem ale už existuje městem doložená modelová zebra, zarovnaná ve verzi 5.274 na původní OSM chodník [1005977571](https://www.openstreetmap.org/way/1005977571) u šestimetrové ulice [128087258](https://www.openstreetmap.org/way/128087258). Jeden nový simulovaný obyvatel proto může v běžném RP přejít po původní mapované pěší ose mezi dvěma body **11 m před a 11 m za společným OSM uzlem**. Nejde o nový chodník, nové OSM `footway=crossing` ani geodetické potvrzení skutečné polohy namalovaných pruhů; jde o herní simulaci na doložené pěší linii.

**Bezpečnost:** modelový NPC se zastaví **před vstupem** na vykreslenou šestimetrovou vozovku, pokud je do 6,2 m od společného uzlu vozidlo, a pokračuje po jeho odjetí. Kontroluje oba směry chůze, nezastavuje se uprostřed, když už přechází. Záměrně nemění obecná pravidla pro ostatní chodce, vozidla a NPC. Původní `motor_vehicle=no` pro tuto část Pod Lesem trvá. Jeden původní humanoidní rig navíc nepřekročí bezpečný limit 65 chodců. Model je aktivní pouze při přesně odpovídajících ID, geohashech `263e12b3` (chodník) a `6e14ec02` (vozovka), tagách a existujícím bezpečném renderu zebry 5.274.

**Nedotčené objekty:** nulové nové OSM pěší cesty, křižovatky, vodorovná značení, vozovky, obrubníky, textury a kolize. Zachovány jsou asfaltové záplaty 5.272, hnědá zpevněná cesta 5.273, přechod 5.274, všechny původní GPS, silniční graf a rozpočet LOD. Jeden člověk je modelové NPC, nikoli záznam skutečného chodce.

**Kontrola:** `scripts/osm-pod-lesem-crossing-walker-5275.test.mjs` testuje trasu, odlišné směry, vyčkání na auto, neměnnost OSM a zákaz duplicit. `scripts/osm-pod-lesem-crossing-walker-webgl-5275.mjs` ověří skutečný Chromium/SwiftShader mobile+wide po 7,2 s LOD s původní zebrou a povrchy. Přidáno do Italská workflow. Technická kamera `?v=527500&streetAudit=pod-lesem-pedestrian-5275` (není panorama ani fotografická shoda). **CI 5/5 PASS:** [hlavní validace #45036705189](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45036705189), [Italská + Pod Lesem Chromium/SwiftShader mobile+wide #45036705135](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45036705135), [Station photo #45036705159](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45036705159), [Nádražní #45036705143](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45036705143) a [blok 5.82 #45036705360](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45036705360). Test log potvrzuje Node i mobilní a široký Chromium **PASS 5.275 po 7,2 s LOD**. Screenshot `pod-lesem-pedestrian-5275-wide.png` z CI artefaktu byl **stažen a přímo obrazově prohlédnut**: nový člověk stojí/kráčí skutečně na pruzích zebry; starý asfalt a chodník jsou viditelné. [PR #58](https://github.com/FOXEY-CZ/milovice-life-rp/pull/58) sloučen do `main` jako `f41afa1`. **GitHub Pages úspěšně nasazeno:** [#45037471858](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45037471858) skončilo `success` na `main` commitu `f9c86ec`, který obsahuje sloučený PR #58.

---

## Milovice RP 5.274 — Pod Lesem × Armádní: skutečná návaznost chodníku na model přechodu (22. 11. 2026; PR #57 sloučen, 5/5 CI PASS, Pages PASS)

**Oprava smysluplné souvislé uliční geometrie:** v původních `data/regions/mlada.json` je městem [doložený](https://zakazky.mesto-milovice.cz/contract_display_85.html) přechod Pod Lesem u Armádní modelovaný od verze 5.270 jako zebra **10,5 m od křižovatky** bez geodetického podkladu. Přitom původní mapovaná `highway=footway`, `footway=sidewalk`, `surface=paving_stones` OSM cesta [1005977571](https://www.openstreetmap.org/way/1005977571) prochází **přesně jedním společným OSM uzlem** s asfaltovou šestimetrovou vozovkou [Pod Lesem 128087258](https://www.openstreetmap.org/way/128087258): GPS `50.2285685,14.8727322`. Tento uzel leží **8,782 m od původního napojení do Armádní**, tedy 1,718 m vedle dřívějšího čistého odhadu. Verze 5.274 **přemisťuje pouze již existující modelové pruhy** na tuto původní OSM pěší návaznost. Dřívější nepřesnost se neopravuje přidáním nového chodníku, obruby nebo cesty. Přesná poloha *skutečně namalovaných* bílých pruhů **stále není fotograficky/geodeticky ověřená**; napojení `footway=sidewalk` není totéž co OSM `footway=crossing`.

**Ochrana před nesprávným přesunutím:** původní Pod Lesem OSM `128087258` (4 body, hash `6e14ec02`) a Armádní `1331897690` (4 body, hash `197dbea8`) musejí zároveň souhlasit s chodníkem `1005977571` (7 bodů, hash `263e12b3`), přesnými pěšími/vozovkovými tagy a **shodným uzlem** na jejich zdrojových indexech. Pokud se jakékoli zdrojové GPS/tagy změní či se k blízkému místu doplní označený OSM přechod, vykreslení odhadnuté zebry se **bezpečně vypne**. Zachovány jsou všechny původní rozměry pruhů, stejný asfalt, zpevněná cesta 5.273, výplně zatáček 5.272, dopravní omezení `motor_vehicle=no`, GPS, NPC graf, kolize i rozpočet kreslení. Není tvrzena stavební přesnost. Žádné nové lampy, ostrůvky, parkování, chodníky ani vodorovné značení navíc.

**Důkazy:** oficiální [veřejná zakázka P25V00000049](https://zakazky.mesto-milovice.cz/contract_display_85.html) potvrzuje **existenci** přechodu. [Úřední archiv Lysá nad Labem](https://ud.mestolysa.cz/archiv.html) eviduje `Stanovení místní úpravy provozu č. 29/26` z 24. 8. 2026 pro Rakouskou, Kaštanovou, Pod Lesem a bezejmennou (`MULNL-SC/54044/2026/Uh/132`); konkrétní situační příloha nebyla během této práce dostupná, takže se z ní **nesmějí odvozovat souřadnice ani hranice obrub**.

**Testy:** aktualizované Node regresní testy kontrolují původní geometrii všech tří OSM cest, společný uzel, korekci asi 1,72 m, ochranu proti duplicitním skutečným přechodům a nulové nové objekty. Chromium/SwiftShader mobil i široký režim testují vizuální zachování pruhů po 7,2 s LOD a staré 5.272/5.273 regrese. **5/5 hlavních CI PASS** na PR commitu `0066a34`: [Validate #45034524713](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45034524713), [Italská + Pod Lesem 5.274 Chromium/SwiftShader mobil+wide #45034524644](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45034524644), [Station photo #45034524656](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45034524656), [Nádražní #45034524747](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45034524747), [blok 5.82 #45034524660](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45034524660). Test výslovně loguje Node a Chromium **PASS 5.274** po 7,2 s LOD, zachoval staré 5.272/5.273 opravy. Wide screenshot `pod-lesem-municipal-crossing-5270-wide.png` z artefaktu byl **skutečně otevřen a vizuálně zkontrolován**, pruhy zůstávají na vozovce. [PR #57](https://github.com/FOXEY-CZ/milovice-life-rp/pull/57) sloučen do `main` commitem `0c56061`. **GitHub Pages 5.274 úspěšně nasazeno:** [#45035319544](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45035319544) skončilo `success` pro `main` dokumentační HEAD `5277f4e`, který obsahuje PR #57. Technická kamera: `?v=527400&streetAudit=pod-lesem-municipal-crossing-5270`; není to panoramatický záběr skutečné ulice.

---

## Milovice RP 5.273 — Pod Lesem: původní zpevněná cesta už nezasahuje graficky do asfaltu (22. 11. 2026; PR #56 sloučen, 5/5 CI PASS, Pages PASS)

**Ověření vydání 5.273:** [PR #56](https://github.com/FOXEY-CZ/milovice-life-rp/pull/56) sloučeno jako `45000e5`; [5/5 hlavních CI](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45032936983) PASS včetně Chromium mobil + wide po 7,2 s LOD; [Pages #45033633077](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45033633077) PASS. Snímky před/po byly přímo prohlédnuty; skutečná polohová fotografie stále chybí.

Na skutečných mobilních+wide WebGL screenech 5.272 jsme přímo **obrazově otevřeli** výstupy z artefaktu [Actions #45031300115](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031300115): viditelná hnědá **stávající OSM cesta `1011197688` (`highway=track`, `surface=compacted`, `tracktype=grade1`) přetéká na tmavý asfalt Pod Lesem** u místa napojení. Její původní OSM uzel (`50.2285270,14.8726788`) leží uvnitř silnice `128087258` (`width=6`). Nebyl doložen půdorys obrub ani přesný tvar reálné hrany.

Ve 5.273 nový `scripts/osm-pod-lesem-track-5273.js` drží hash OSM `00b3e58a` pro 11 uzlů cesty a hash `6e14ec02` pro čtyřuzlovou ulici. Z původní místní geometrie spočítá **pouze vizuální oříznutí prvního hnědého OSM materiálu asi o 3,05 m**, aby nezačínal uprostřed již vykresleného šestimetrového asfaltu. Držena je původní modelová šířka cesty 3,2 m a modelová **mezera 5 cm** proti texturovému z-fightingu. Není to geodetické tvrzení o skutečné krajnici. Zbytek 10 původních úseků se vykreslí nezměněně; původní OSM graf, fyzické kolize, vozidlový provoz, skutečné hodnoty GPS a materiál `compacted` se nikde nemění. Přechod 5.271 a dvě vnitřní asfaltové výplně 5.272 zůstanou zachovány. Žádný nový chodník, bariéra, křižovatka ani značka.

Nový Node regresní test + Chromium/SwiftShader mobil+wide po 7,2 s LOD jsou zapojeny v Italská CI workflow. Důsledně odlišovat **úspěch automatického ověření** od **fotografického potvrzení skutečnosti**. Nová technická kamera: `?v=527300&streetAudit=pod-lesem-track-seam-5273`.

**Další důležitý zdroj:** archiv úřední desky Lysá nad Labem zveřejnil **24. 8. 2026 stanovení místní úpravy provozu č. 29/26** pro Rakouskou, Kaštanovou, Pod Lesem a bezejmennou (`MULNL-SC/54044/2026/Uh/132`): https://ud.mestolysa.cz/archiv.html. Samotné situační přílohy se nepodařilo zobrazit, takže **žádné nové přechody, obrubníky ani značení nejsou podle tohoto dokumentu modelovány**.

---

## Milovice RP 5.272 — Pod Lesem: dvě skutečné OSM zatáčky, modelové spojení asfaltových hran (22. 11. 2026; PR #55 sloučen, 5/5 hlavních CI PASS, Pages PASS)

**Oprava skutečně viditelné konstrukční příčiny:** původní 3D engine vykresluje každý rovný úsek existující silnice jako samostatný obdélníkový asfaltový pás. Na poslední cestě [OSM Pod Lesem 128087258](https://www.openstreetmap.org/way/128087258) (původní 4 uzly, `width=6`, `surface=asphalt`, `motor_vehicle=no`) jsou před připojením k Armádní **dvě změny směru**. Na jejich vnitřních hranách může mezi pruhy zůstat geometrická trojúhelníková spára. V 5.272 `scripts/osm-pod-lesem-road-bends-5272.js` ověřuje hash silnice `6e14ec02`, pokračujícího úseku Pod Lesem `83076185` (`63325626`) a hlavní Armádní `1331897690` (`197dbea8`), přesné GPS společných uzlů a původní OSM tagy, včetně zakázaného motorového provozu. Oprava **doplňuje pouze dva malinké vnitřní trojúhelníky asfaltu** v existujících lomových OSM uzlech: plochy a přesné hranice jsou geometricky dopočtený **MODEL, nikoli nové geodetické zaměření reálných hran**.

**Skutečný zásah do hry:** Oba trojúhelníky jsou na DEM výšce asfaltu `+.17`, mají stejné world-aligned UV jako dosavadní asfalt a používají **původní materiál i existující batch renderovací frontu**, bez samostatných draw callů/textur; vzdálenosti a plochy kontroluje nový unit test. Zachována je mapa, šířka 6 m, původní silniční osy, NPC navigace, zákaz vjezdu `motor_vehicle=no`, kolize, betonové chodníky, obrubníky a už existující model přechodu 5.270/5.271. **Záměrně se nic nelepí na hranách křižovatky ani nevznikají neověřené chodníky nebo další přechody.** Celé Milovice i skutečné přesné obruby zůstávají rozpracované.

**Ověření:** `scripts/osm-pod-lesem-road-bends-5272.test.mjs` striktně kontroluje OSM ID/GPS/tagy, právě dva vnitřní lomy, šířku, nulové nové silnice či kolize a neporušená data. `scripts/osm-pod-lesem-road-bends-webgl-5272.mjs` vykoná mobilní+široký Chromium/SwiftShader screenshot po 7,2 s LOD, kontroluje stále viditelné pruhy starého přechodu a nulové JS chyby. Kontrolní technická kamera `?v=527200&streetAudit=pod-lesem-bends-5272` míří z předpokládané herní GPS k jihovýchodnímu cípu, neodpovídá žádné doložené fotografii. **Všech 5 různých hlavních CI kontrol PASS** na zdrojovém commitu `205b0e8`, včetně [mobilní + široké Chromium/SwiftShader 5.272 po 7,2s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031300115), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031303470), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031303506), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031303456) a [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031303498). [PR #55](https://github.com/FOXEY-CZ/milovice-life-rp/pull/55) sloučen do `main` jako `3b02659`. Screenshoty z CI nejsou nezávislou fotografickou shodou a nebyly samostatně otevřeny. **GitHub Pages úspěšně nasazeno: [#45031920240](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031920240)**; fotověrnost hrany zatím nelze tvrdit.

---

## Milovice RP 5.271 — přechod Pod Lesem: zabránění duplicitě při novém OSM úseku (22. 11. 2026; PR #54 sloučen, 5/5 hlavních CI PASS)

**Oprava reálné chyby ochranné podmínky:** dosavadní 5.270 kontrolovala nový `footway=crossing` pouze podle vrcholů jeho OSM geometrie. Delší přechod mohl mít oba koncové body dál než 22 m od modelové zebry, ale protnout její místo mezi nimi. Při pozdější aktualizaci OSM by tak hra mohla chybně vykreslit i původní odhadnuté bílé pruhy vedle/na nové přesnější geometrii. V 5.271 se proto hledá **nejkratší vzdálenost od celé lomené čáry**: body i segmenty. Pokud některý segment vede blíž než 22 m, model 5.270 se bezpečně vypne. Poškozené souřadnice se ignorují.

**Změna v běžné hře:** pro současný zamčený OSM export zůstává grafika i pozice přechodu stejná; nová podmínka se projeví teprve při zmapování skutečné blízké pěší trasy. Nejsou přidána žádná fiktivní značení, chodníky, obrubníky ani kolize; GPS a cestní síť i 60FPS rozpočty zůstávají beze změny. Nejde o geodetické potvrzení polohy zebry, která dál zůstává modelovým odhadem.

**Regrese:** `scripts/osm-pod-lesem-municipal-crossing-5270.test.mjs` doplňuje pozitivní průnik přímého i blízkého dlouhého segmentu s oběma konci mimo 22 m, negativní případ vzdáleného segmentu a neplatné souřadnice. Stávající mobilní i široký WebGL test po 7,2 s LOD kontroluje build 5.271. **Hlavních 5 různých CI kontrol prošlo na zdrojovém commitu `648dba5`**, včetně skutečného mobilního Chromium/SwiftShader WebGL po 7,2 s LOD; [PR #54](https://github.com/FOXEY-CZ/milovice-life-rp/pull/54) sloučen do `main` jako `98cf32a`. **GitHub Pages ještě neměl potvrzený výsledný deploy v době tohoto zápisu.** Oprava nenahrazuje kontrolu skutečné vozovky proti fotografii/situačnímu plánu.

---

## Milovice RP 5.270 — městem doložený model přechodu Pod Lesem × Armádní (22. 11. 2026; [PR #53](https://github.com/FOXEY-CZ/milovice-life-rp/pull/53) sloučen, 5/5 PR CI PASS)

**Nový konkrétní zdroj uliční bezpečnosti:** [oficiální veřejná zakázka Milovice 2025, P25V00000049](https://zakazky.mesto-milovice.cz/contract_display_85.html) uvádí **4 přechody pro chodce v ulicích Rakouská, Kaštanová, Pod Lesem a bezejmenné u Armádní**, úpravy přilehlých chodníků, snížené obrubníky a osvětlení. Profil zakázky uvádí **plnění smlouvy ukončeno 7. 1. 2026** a částku 1 418 416,45 Kč včetně DPH. [Nymburský deník – bilance roku 2025](https://nymbursky.denik.cz/zpravy_region/milovice-rok-2025-pumptrack-psi-park-opravy-investice.html) nezávisle píše, že v ulici Armádní nové přechody skutečně vznikly. [Smlouva s rozpočtem](https://zakazky.mesto-milovice.cz/document_1117/b4e740fe7811b68ef8bf3ef68919717c-smlouva-o-dilo_redigovano-pdf) zahrnuje bílé vodorovné značení V7a, obrubníky a osvětlení. **Nejde však o geodetické zaměření přesných pruhů.** Archivní OSM v této hře zatím nemá samostatný `footway=crossing` v samotném napojení Pod Lesem, proto nelze předstírat mapovou přesnost.

**První herní realizace 5.270:** `scripts/osm-pod-lesem-municipal-crossing-5270.js` modeluje **jeden fyzicky viditelný přechod na původní vozovce Pod Lesem** `128087258` (source fingerprint `6e14ec02`, OSM tag `width=6` m), navázané původním GPS uzlem `50.2286371, 14.8727931` na Armádní `1331897690` (hash `197dbea8`). **Odhadnutá poloha pruhů je 10,5 metru do Pod Lesem od styku s Armádní**, ne zaměřená poloha stavby. Použijí se stávající bílé 3D pruhy z původní městské zebrí geometrie a materiálu, pouze ve vykreslované existující silnici. Bez nové OSM pěší way, bez změny GPS, dopravních tras, šířky, tělesa vozovky, přechodových chodníků, obrubníků, kolizí nebo nových textur. Pod Lesem zdrojově obsahuje `motor_vehicle=no`; model tento atribut nemění. Pokud se v datech objeví mapovaný crossing na vzdálenost do 22 m, **zástupný model se nepostaví** a má se ověřit podle nového přesnějšího zdroje. Zbylé tři oficiální přechody zatím nebyly dostatečně individuálně lokalizované pro modelování v této verzi.

**Ověření před sloučením:** nové Node testy kontrolují původní geohashe, obě OSM tagové sady, polohu a modelovou šířku, odmítnutí duplikátu a absenci nových fyzických kolizí. Nový Chromium/SwiftShader mobile+wide screenshot test běží po 7,2s LOD a ověřuje skutečné pruhy na vozovce. Ve `.github/workflows/italska-apartments-5235.yml` se nový render přidává k dosavadním testům, 5.269 kontrola názvu buildu se mění z doslovného textu na stabilní prefix. **Výsledek finálních 5/5 hlavních PR CI je PASS:** [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027460413), [Italská + přechod v Chromium/SwiftShader](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027460475), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027460432), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027460449), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027460500). [Druhý Italská push test](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027440894) potvrdil `PASS 5.270` v Node i v reálném mobilním a širokém Chromium/SwiftShader po 7,2 s LOD. Screenshoty `pod-lesem-municipal-crossing-5270-mobile.png` a `-wide.png` byly skutečně staženy a obrazově zkontrolovány: pruhy jsou vidět na asfaltu, bez zjevné plovoucí desky, i po doběhnutí LOD. Okolní okraje silnice a poloha modelové zebry nadále nejsou fotogeodeticky zpřesněny. [PR #53](https://github.com/FOXEY-CZ/milovice-life-rp/pull/53) sloučen do `main` jako `7d0313a`. **Pages deploy pro 5.270 v tomto zápisu ještě není potvrzen.**

---
## Milovice RP 5.269 — městem doložená žulová dlažba Rakouská × Pod Lesem (22. 11. 2026; [PR #52](https://github.com/FOXEY-CZ/milovice-life-rp/pull/52) sloučen, 5/5 CI PASS)

**Nový skutečný důkaz povrchu (nikoli rozměrů):** [Zápis Rady města Milovice č. 42/2025 ze dne 12. 11. 2025, str. 4](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=19018&id_org=9519) v bodě k vodovodní přípojce a výkopu výslovně uvádí, že komunikace Rakouská a Pod Lesem je v dotčeném místě tvořena dlažebními žulovými kostkami. **Zápis není zaměření ani mapa přesné hranice dlažby.** Dokládá materiál u místa prací, nikoli rozsah, tloušťku, barvu, přesnou šířku nebo celou ulici. Zdrojový OSM export obou silnic `8590288` (Rakouská) a `8590287` (Pod Lesem) žádný `surface=*` neobsahuje; tagy a geometrii neměníme.

**Geograficky ukotvená modelová změna v běžné hře:** Na **skutečně společném OSM uzlu** těchto silnic (GPS **50.2244708, 14.8721468**) nově vykreslujeme žulový povrch jen v **12 metrech každého ze čtyř přiléhajících původních silničních ramen** (celkem **48 metrů zdrojové osy**, modelový rozsah **ODHAD**). `scripts/osm-rakouska-granite-5269.js` odmítá změněný region, OSM ID, tagy, geometrii i GPS: Rakouská hash `7486fd8b`, Pod Lesem `2da4a507`. Původní segmenty se při **samotném vykreslování povrchu** rozdělí na zdrojový a modelově žulový díl, bez přemisťování úseků. Zůstává původní DOM/OSM geolokace, celá dopravní síť a vozovková šířka. Použije se **stejný sdílený procedurální materiál + world-aligned UV** jako pro již zdrojově označenou Kaštanovou 5.261; žádná nová textura, materiál, vyvýšený overlay, collider, přechod, chodník či obrubník.

**Ověření:** Nový přesný Node test kontroluje oba původní OSM hashe, čtyři fyzicky souvislé části (4 × 12 m), nechává beze změny délky/polohy cest a odmítá úpravy tagů či souřadnic. Nový skutečný mobilní a široký Chromium/SwiftShader WebGL test po **7,2 sekundách LOD** ověřuje viditelnou změnu, původní pětileté assety, žádný nový silniční objekt a vytvoří screenshoty `rakouska-granite-5269-mobile.png` a `-wide.png`. **5/5 hlavních PR CI PASS**: [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45025723901), [Italská/Rakouská a nový povrch v mobilním Chromium/SwiftShader](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45025723845), [Station Photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45025723868), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45025723875), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45025723837). [Italská push WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45025702704) hlásí přesné `PASS 5.269` Node i reálné mobilní a široké Chromium/SwiftShader po 7,2 s LOD. Oba snímky byly skutečně staženy a obrazově prohlédnuty: žulový modelový povrch je viditelný, napojuje se na asfalt a nevypadá jako vznášející se plocha; hranice a dlažební vzor ale nadále nejsou fotozaměřené. [PR #52](https://github.com/FOXEY-CZ/milovice-life-rp/pull/52) sloučen do `main` jako `716f0d5`. Samostatné nasazení Pages je zatím ve frontě. Kontrolní kamera `?v=526900&streetAudit=rakouska-granite-5269` je technický modelový směr, ne panorama. Stará 5.268 pouhá kontrolní linka zůstává opt-in.

---
## Milovice RP 5.268 — skutečná pěší návaznost Rakouská ↔ Italská v technické kontrole (22. 11. 2026; [PR #51](https://github.com/FOXEY-CZ/milovice-life-rp/pull/51) sloučen, 5/5 PR CI PASS)

**Co ukázaly podklady, ne domněnka:** původní OSM [Rakouská 8590288](https://www.openstreetmap.org/way/8590288) je přes společný GPS uzel 50.2259647,14.8745896 spojená s původní obytnou spojkou [8590286](https://www.openstreetmap.org/way/8590286) (73,08 m). Ta má další společný GPS uzel 50.2255209,14.8752199 s **původním NEZNAČENÝM pěším přechodem** [1484073944](https://www.openstreetmap.org/way/1484073944). Přechod je součástí již existujícího 534,368m chodníkového řetězce `1484073943–1484073947` z 5.233. Oba původní přechody **1484073944 i 1484073946 jsou `crossing=unmarked` / `crossing:markings=no`**, a proto nesmějí dostat zebru. **Na tomto podkladu není zaměřený nový obrubník či samostatný chodník přímo před Vojenským zátiším.** Žádný jsem nedoplnila.

**Skutečná novinka pro kontrolu lokality:** `scripts/osm-rakouska-walk-link-5268.js` ověřuje celý řetězec, přesné původní OSM ID/tagy/geohashe a společné uzly. V čistě opt-in technickém pohledu `?v=526800&streetAudit=rakouska-walk-link-5268` zobrazuje 3 levné WebGL dávky přiznaných **pomocných linií**: tyrkysová ukazuje OSM chodníky, žlutá dvě OSM **neoznačená** místa přechodu, růžová původní osu obytné spojky. Tyto linky jsou **diagnostická pomůcka nad povrchem, nejsou asfalt, fyzické chodníky, obrubníky, silniční čáry ani zebra** a v běžné hře se vůbec nenačítají. Žádná změna GPS, kolizí, šířek vozovek, zdrojových 3D modelů, NPC či herní dopravy.

**Regresní opravy:** starší Topolová 5.183 test nyní vyžaduje také správné vymazání pěšího navigačního beaconu při změně vozidla/resetu; Višňová 5.217 test akceptuje pozdější legitimní prioritu historické foto fasády 5.249, ale stále vyžaduje původní OSM barvy pro vlastní dům. Devět starších 5.258–5.267 testů už nevyžaduje doslovně ID posledního buildu (testy konzistence `meta/HUD/JS` zůstávají). Opravy 5.183/5.217 i nové 5.268 Node testy **prošly** v [Italská/Rakouská workflow](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45024167067); [samostatná Višňová](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45024167061) také PASS.

**Fotokontrola 5.267:** skutečně jsem obrazově otevřela oba CI screenshoty z [úspěšného běhu](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507613): příčný plot je v herním širokém a mobilním záběru vidět a navazuje na podélné oplocení. To **není** pixelová ani geometrická shoda s původní fotografií. [GitHub Pages publikace dokumentovaného 5.267](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45023050584) byla úspěšná. **5.268 5/5 hlavních PR CI PASS** ([validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45024170939), [Italská+Rakouská](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45024170847), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45024170893), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45024170845), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45024170895)). Skutečný mobilní+široký Chromium/SwiftShader test >7,2s LOD **PASS** a oba artefaktové screenshoty `rakouska-walk-link-5268-mobile.png` a `-wide.png` byly obrazově otevřeny: tyrkysová (původní OSM pěší osa), žlutá (technická trasa neoznačeného přechodu), růžová (osa spojovací silnice) jsou viditelné. [Italská push screenshoty](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45024167067); PR sloučen do `main` jako `99ad157`. **Publikace 5.268 na GitHub Pages zatím nebyla samostatně potvrzena.**

---
## Milovice RP 5.267 — příčný zelený plot před zádveřím (22. 11. 2026; [PR #50](https://github.com/FOXEY-CZ/milovice-life-rp/pull/50) sloučen; 5/5 PR CI PASS)

**Fotografický podklad:** [Rakouská (Milovice) 15.jpg](https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg), Stanislav Doronenko, 20. 8. 2025, Wikimedia Commons, CC BY-SA 4.0. Snímek ukazuje kromě podélného zeleného kovového plotu i příčný úsek před bývalým Vojenským zátiším. **Neposkytuje zeměměřické souřadnice plotu, zaměřenou bránu ani polohu průchodu.**

**Implementace:** `scripts/osm-rakouska-cross-frontage-5267.js` vytváří jeden nový sdílený 3D mesh zelených prutů a příček, DEM-draped. Navazuje na předchozí model 5.266 na straně Rakouské a modelově směřuje k přednímu rohu již existující přístavby 5.265. Odhadovaná délka **13,75 m**, modelová volná mezera před markýzou **3,3 m**; žádná nová fyzická brána ani skutečný vchod. Nese přesné OSM/RÚIAN ID budovy 53865882 / 40057411 a geohashe původní Rakouské 8590288 (`7486fd8b`) a sousední ulice 8590286 (`916afa20`). Geometrie se odmítne, pokud jsou zdroje jiné nebo úsek nedodržuje bezpečnou vzdálenost od obou silnic, půdorysu a markýzy. Nezapisuje žádný nový OSM `barrier=fence`, nemění GPS, chodníky, provoz ani kolize. **Všechny polohy, trasa, výška a předpokládaná mezera jsou modelové ODHADY, ne zaměření.**

**Testy:** nový Node test přesných původních geometrií, render mesh test a reálný mobilní Chromium/SwiftShader WebGL test po více než 7 s LOD s dvěma screenshoty jsou vloženy do Italská workflow. **Finálních 5/5 hlavních PR CI PASS**: [Italská + nový příčný plot v mobilním Chromium/SwiftShader](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507613) (v logu `PASS 5.267` po 7,2 s LOD), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507632), [Station Photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507650), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507729) a [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507711). V [Italská artefaktu](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507613) jsou uložené `rakouska-cross-frontage-5267-mobile.png` a `-wide.png`; **screenshoty jsem v tomto běhu nemohla samostatně obrazově prohlédnout**, takže pixelová shoda s fotografií a reálná podoba plotu zůstávají k ručnímu posouzení. Sloučeno do `main` jako `20819a1`, GitHub Pages nasazení verze 5.267 nebylo samostatně potvrzené. Kontrolní pohled `?v=526700&streetAudit=rakouska-cross-frontage-5267` používá skutečnou GPS fotografie a **odhadovaný** azimut 168°, nikoliv foto-shodnou kameru. Dále ověřit viditelné napojení, a potom pokračovat doloženými chodníky a obrubníky celé Rakouské.

## Milovice RP 5.266 — fotograficky doložený zelený plot a zarostlý předprostor Vojenského zátiší (22. 11. 2026; [PR #49](https://github.com/FOXEY-CZ/milovice-life-rp/pull/49) sloučen, 5/5 CI PASS)

**Fotografický podklad:** [Rakouská (Milovice) 15.jpg](https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg), fotograf Stanislav Doronenko, 20. 8. 2025, CC BY-SA 4.0, [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Vojensk%C3%A9_z%C3%A1ti%C5%A1%C3%AD_(Milovice)). Na snímku je v popředí zcela zřetelný **nízký svislý zelený kovový plot**, nepravidelné traviny a nízké keře. Nynější model 5.265 měl před proskleným vestibulem naopak plošně prázdnou zelenou plochu. Fotka je ale pořízená jen z jednoho úhlu; **neobsahuje zaměřenou trasu plotu, výšky ani polohy každého keře**.

**Model 5.266:** `scripts/osm-rakouska-fenced-frontage-5266.js` používá originální body silniční OSM `8590288` (`highway=residential`, přesný souřadnicový hash `7486fd8b`) a původní sousední budovu `53865882` / RÚIAN `40057411` (hash `7aec42bc`). Jen před touto správnou budovou navrhuje **dekorativní pracovní úsek plotu** kolem 37,8 m délky a 1,16 m výšky, vedený **přibližně 4,8 m od původní osy Rakouské západně od křižovatky (OSM uzly 5–6, modelový úsek 0,12–0,78)**; průběh a koncové body jsou **modelové odhady**, nikoli nezávisle zdokumentovaná parcelní hranice. Neexistující `barrier=fence` se do OSM souboru **NEPŘIDÁVÁ**. Výška a příčky plotu jsou přibližné podle fotografie; bez domýšlení bran či cesty. V předprostoru se vygeneruje **86 nízkých trsů trávy a 10 keřových shluků** s deterministickou distribucí, jen mimo původní půdorys a zádveří, bez vysokých stromů. Všechny nové polohy zemní vegetace jsou drapované na stejný již existující DEM výškopis. Pouze **3 sdílené 3D meshe** (plot / trsy / keře), ne stovky draw calls. Veškerá fyzika, NPC, navigace, silnice, chodníky a GPS původní hry jsou **beze změny**; modelové oplocení je zatím průchozí stejně jako jiná čistě vizuální oprava.

**Ověření/omezení:** Node test kontroluje zdrojová ID/geohashe OSM, úplnost fotografie, návaznost na potvrzenou 5.265 přístavbu, odstup od mapované osy a půdorysu, stabilitu rozložení zeleně, omezení počtu meshů, absenci kolizí, stromů, bran a nových OSM bariér. Mobilní Chromium/SwiftShader po >7s LOD kontroluje všechny tři meshe i starší zádveří a uloží screenshoty pro mobil 393×852 a široké okno 1280×720. Audit `?v=526600&streetAudit=rakouska-fenced-frontage-5266`, foto GPS skutečné, technický azimut 168° je odhad. **Vizuální kontrola a finální testy:** První screenshot opravdu ukázal špatně umístěný plot vlevo na boční silnici 8590286, takže byl přesunut na osu **Rakouské 8590288**, doplněno strict source check a zelený koridor namísto zastaralé souřadnicové hranice Node testu. ****Finálních 5/5 PR CI PASS:** [Italská mobilní Chromium/SwiftShader + >7s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45020856367), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45020856390), [Station Photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45020856368), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45020856448), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45020856360).** Vizuálně osobně prohlédnuty oba obrázky `rakouska-fenced-frontage-5266-mobile.png` a `rakouska-fenced-frontage-5266-wide.png` z posledního [Italská CI runu](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45020856367): v širokém záběru zelený plot běží **vpravo podél Rakouské** a keře neprorůstají vozovkou; screenshot ale ukazuje, že **příčný oplocený úsek přímo před vstupním zádveřím chybí**. Proto je 5.266 **ověřený dílčí krok, ne kompletní fotorealistický plot**. [PR #49](https://github.com/FOXEY-CZ/milovice-life-rp/pull/49) sloučen do `main` jako `7e7e20d`. GitHub Pages deploy ještě zvlášť neověřen.

---

## Milovice RP 5.265 — prosklené zádveří Vojenského zátiší pod balkonem (22. 11. 2026; [PR #48](https://github.com/FOXEY-CZ/milovice-life-rp/pull/48) sloučen, CI **5/5 PASS**)

Zdroj přímo porovnaný s renderem 5.264: [Rakouská (Milovice) 15.jpg](https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg), Stanislav Doronenko, 20. 8. 2025, CC BY-SA 4.0. Na skutečné budově je prosklené vystupující zádveří s úzkými kovovými profily, před ním široká plochá stříška a nad částí stavby balkon s jednoduchým kovovým zábradlím. Ve hře 5.264 dosud zcela chybí; nevznikla tam ani náhodná budova.

`scripts/osm-rakouska-glazed-entry-5265.js` implementuje **jednu dekorativní prosklenou přístavbu** na původní hranu **2** přesně source-locked stavby OSM **53865882** / RÚIAN **40057411** (hash `7aec42bc` a identita modelu 5.263/5.264). Navržená čelní šířka přibližně 4,88 m; projekce od zdi asi 2,55 m, střechy do 3,03 m; malý balkon nad částí přístřešku. 6 předních + 6 bočních prosklených polí, tenké kovové profily, plochá oboustranná markýza, boční lišta, balkonová plocha a zábradlí. **Celkem pět dávkovaných render meshů**, tedy žádný řetěz nezávislých vysokopolygonových modelů. Vše je **nepřesně, modelově odhadnuto z fotografie**, ne fotogrammetricky změřeno. Fyzický OSM půdorys, RÚIAN, budova, roof geometry, navmesh, auta, kolize, GPS, původní chodníky a silnice se nemění. Vizualizované sklo **není skutečně přístupný vstup ani nová fyzická budova**.

Node test vyžaduje správný půdorys/zdrojovou fotku/hranici 2, odmítá cizí objekty, kontroluje půdorys vnějšího zádveří a vypočtený nejbližší odstup od skutečných OSM os komunikací v `data/regions/mlada.json`. Mobilní Chromium/SwiftShader test po 6,9 s LOD ověřuje všech 5 vykreslených meshů, předchozí horní část a okna, ukládá mobilní (393×852) a široký (1280×720) snímek pro ruční porovnání. Audit kamera je na GPS originálu (50.226027, 14.874584), směr 168° je stále pouze **odhad**, ne skutečně změřený azimut fotografie. **Finálních 5/5 CI PASS:** [Italská mobilní Chromium/SwiftShader >6,9 s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45018161634), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45018161706), [Station Photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45018161648), [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45018161612), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45018161624). **Zásadní vizuální korekce:** první CI screenshot s hranou 7 položil zádveří na nesprávný levý bok stavby. Opraveno na skutečnou čelní OSM hranu **2** a šířku modelu ≈4,88 m, následný rozšířený jednotkový test i všech pět workflow PASS. Oba screenshoty `rakouska-glazed-entry-5265-mobile.png` a `rakouska-glazed-entry-5265-wide.png` z [finálního CI artefaktu](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45018161634) jsem ručně porovnala: zádveří je před nárožím, nenačítá se na straně domu ani se nevznáší nad terénem, markýza a balkon jsou viditelné. **Přesné geometrické polohy, sklon a rozměry nejsou fotogrammetricky ověřené.** [PR #48](https://github.com/FOXEY-CZ/milovice-life-rp/pull/48) sloučen jako `ce216e2`. **Pages deploy ještě neověřen.**

---

## Milovice RP 5.264 — severní nároží: modelová horní okna a poškozená omítka (22. 11. 2026; [PR #47](https://github.com/FOXEY-CZ/milovice-life-rp/pull/47) sloučen, CI **5/5 PASS**)

Zdroj: [Rakouská (Milovice) 15.jpg](https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg) od Stanislava Doronenka (20. 8. 2025, CC BY-SA 4.0) a doplňkový pohled [Italská, Milovice 05.jpg](https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_05.jpg). Severní vyšší nároží Vojenského zátiší na fotografii obsahuje řadu temných oken, tmavší/kovové rámy a silně opadanou omítku; původní vizuální model 5.263 měl tato horní průčelí hladká.

Kód `scripts/osm-rakouska-upper-windows-5264.js` pouze přikládá **6 tmavých modelových oken** (2 na původní OSM hraně 0, 3 na hraně 2, 1 vysoké boční na hraně 7), jemné rámy a **8 přibližně umístěných poškozených omítek**. Reálně jde o čtyři sdílené/batched dekorativní meshe (tmavé výplně, rámy, šedá a červená omítka), nikoliv nové fyzické okenní otvory. Nezměnila se původní OSM/RÚIAN geometrie 53865882 / 40057411, střecha 5.263, původní sokl 5.262, kolize, cesty ani provoz. Podmínka přesného hash OSM zabraňuje rozšíření na jiné objekty, a neexistující spojovací stěna modelu **edge 8** zůstává zcela bez oken.

**Omezení věrnosti:** z fotografie nelze bez kalibrace odvodit centimetry; přesný počet šesti modelových oken, jejich rozteče, šířky, výšky i kontury omítky jsou **odhad**, nikoliv přesně změřená fasáda. Nový kontrolní pohled `?v=526400&streetAudit=rakouska-upper-windows-5264` používá geotagovanou GPS fotografii, ale odhad azimutu 168°. Node test kontroluje 3 skutečné originální stěny, šest oken, poškození, absence fyzických otvorů a zachování zdrojových dat. Mobilní Chromium/SwiftShader test kontroluje 6,8 s LOD a ukládá mobilní i široký screenshot. **Finální PR #47 CI 5/5 PASS:** [Italská Node + skutečný mobilní Chromium/SwiftShader s >6,8s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45015529846), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45015529853), [nádraží 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45015529842), [Station Photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45015529892), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45015529865) vše PASS. Finální mobilní i široký screenshot `rakouska-upper-windows-5264-mobile.png` / `rakouska-upper-windows-5264-wide.png` je v CI artefaktu Italské a **ručně prohlédnut**: pět modelových severních oken je z technického foto-GPS směru vidět, šesté boční nemusí být z tohoto úhlu viditelné; nic se nevznáší nad zdí. Po prvním screenshotu byly příliš malé omítkové ztráty rozšířené na horních fragmentech (commit `492577d`) a znovu otestovány. PR #47 sloučen do `main` jako `edad5e8`. **Pages deployment 5.264 zatím samostatně neověřen.**

---

## Milovice RP 5.263 — foto-doložené vyšší severní nároží Vojenského zátiší (22. 11. 2026; [PR #46](https://github.com/FOXEY-CZ/milovice-life-rp/pull/46) sloučen, CI **5/5 PASS**)

Podklady: [Rakouská (Milovice) 15.jpg](https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg) a [Italská, Milovice 05.jpg](https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_05.jpg), Stanislav Doronenko, 20. 8. 2025, CC BY-SA 4.0. Ve skutečnosti má bývalé Vojenské zátiší výrazně vyšší severní část, kterou dosavadní obecný dvoupodlažní model neměl. Změna přidává pouze dva dekorativní 3D meshe nad podmnožinou uzlů 0–8 stávajícího půdorysu OSM 53865882 / RÚIAN 40057411: 18 trojúhelníků stěn a 7 střešních trojúhelníků. Nástavba je omezena přesným hashem polygonu; nevytváří novou zastavěnou plochu, kolider ani cestu. Původní roof mesh je pod navrženou vyšší hmotou zachován.

**Jde o pracovní model, nikoli fotogrammetrii.** Výběr lokální podmnožiny půdorysu, plocha asi 56,4 m², navýšení 2,4 m, materiály i azimut z foto-GPS na Rakouské 168° jsou odhady. Fotografie potvrzují existenci vyšší hmoty, ale ne tyto přesné rozměry. Záměrně zatím nepřidáváme nová okna, dveře, chodníky, ploty, krajinný inventář ani žádné změny NPC. Testy: scripts/osm-rakouska-photo-upper-5263.test.mjs a scripts/osm-rakouska-photo-upper-webgl-5263.mjs (mobilní Chromium/SwiftShader se 6,7s LOD). Kontrolní URL po případném nasazení: ?v=526300&streetAudit=rakouska-photo-upper-5263. **Výsledek 5/5 CI PASS, PR #46 sloučen do main jako 280ecc2.** [Finální Italská mobilní WebGL + LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45013697061), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45013697048), [Station Photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45013697058), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45013697050), [5.82 ulice](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45013697038) PASS. První screenshot měl nepřiměřeně tmavou horní fasádu, proto byla sjednocena s původním pale-render materiálem #eeeae4 a finální screenshot `rakouska-photo-upper-5263-mobile.png` byl **vizuálně prohlédnut**. Dalším konkrétním krokem je doplnit fotograficky potvrzenou horní řadu oken a omítková poškození, bez falešně přesných rozměrů. **Pages deploy stále samostatně neověřen.**

---

## Milovice RP 5.262 — Vojenské zátiší: fotograficky doložený červený spodní sokl (22. 11. 2026; [PR #45](https://github.com/FOXEY-CZ/milovice-life-rp/pull/45) sloučen, CI **5/5 PASS**)

Podle [Wikimedia Commons fotografie **Italská, Milovice 05.jpg**](https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_05.jpg) od Stanislava Doronenka, pořízené 20. srpna 2025 (CC BY-SA 4.0, 50.225548 N / 14.875192 E), byla na existujících pěti původních stěnách OSM **53865882** / RÚIAN **40057411** doplněna vybledlá červenorůžová spodní omítka. Výběr stěn **[11,12,13,14,16]** je podmíněný přesným geohashem původního OSM polygonu, 5.250 kontrolou foto-occlusion a GPS fotoaparátu. Používají se pouze dva dekorativní batched meshe: modelové zabarvení a jemné odhady opadané omítky. Žádné nové budovy, okna, vchody, silnice, chodníky, kolize ani změny navigace.

**Vizuální oprava z reálných 3D screenshotů:** první screenshot ukázal červený pás příliš vysoko nad šedou soklovou částí. Proto byla spodní hrana povrchového nátěru přizpůsobena již existujícímu DEM po úsecích maximálně ≈2,2 m, pouze 5,5 cm nad terénem; původní šikmý základ i silnice zůstaly bez změny. Odstín byl také ztlumen. Finální screenshot `italska-photo-red-plinth-5262-mobile.png` je v [CI artefaktech](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45011774101) a byl vizuálně prohlédnut: nový sokl sahá až k modelovanému terénu a neplave nad spodní zdí. **Výška, pigment a konkrétní obrysy opadané omítky zůstávají nedoložené modelové odhady**; foto-GPS je skutečné, ale technický heading 274° není přesně fotogrammetricky ověřený.

**Poslední finální PR #45 CI 5/5 PASS:** [Italská mobilní Chromium/SwiftShader + Node (včetně >6,6s LOD)](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45011774101), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45011774034), [Station Photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45011774065), [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45011774044), [5.82 ulice](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45011774041). Sloučeno do `main` jako `6a43a55`. Nová kontrolní diagnostika `window.__miloviceItalskaPhotoRedPlinthRuntime5262()` a [foto-srovnávací technický pohled](https://foxey-cz.github.io/milovice-life-rp/?v=526200&streetAudit=italska-photo-red-plinth-5262). **Samostatný deployment GitHub Pages zatím není ověřený.**

---

## Milovice RP 5.261 — Kaštanová podle přesných OSM dat `surface=sett` (22. 11. 2026; [PR #44](https://github.com/FOXEY-CZ/milovice-life-rp/pull/44) sloučen, CI 5/5 PASS)

Dva původní OSM úseky **Kaštanové 8878402 a 1107814416** navazující na Italskou mají zdrojový údaj `highway=residential; surface=sett`. Dohromady jde o **478,586 m** OSM vozovky. Dříve používaly stejnou generickou `paving` texturu jako okolní chodníky; nyní mají pouze na těchto dvou source-locked roads vlastní jemný procedurální vzor kamenných kostek z jedné sdílené 256×256 `CanvasTexture`. Metrické UV (modelová dlaždice 2,8 m) zajišťují souvislé měřítko na všech původních úsecích; původní asfaltové UV ze starého 5.81.3 testu jsou **doslova zachované**. Žádné OSM GPS, šířky, DEM trojúhelníky, dopravní graf, kolizní povrchy, chodníky, přechody, parkování ani kamera hráče se neměnily. U Rakouské bez tohoto OSM tagu jsme nevymýšleli žádnou dlažbu.

**Ověření:** 5/5 finálních PR workflow **PASS**. [Italská / Kaštanová Node + skutečný mobilní Chromium/SwiftShader](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45004518520) prokázal **13 originálních silničních segmentů, 5 batched road meshů** s novým povrchem, po **6,8 s LOD**, a největší odchylku world-aligned UV jen **0,00003052**. Ostatní PASS: [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45004518486), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45004518456), [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45004518430), [uliční blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45004518522). Finální screenshot `kastanova-setts-5261-mobile.png` je v [CI artefaktech](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45004518520), vizuálně ručně ověřen v technickém pohledu bez přebarvených chodníků a bez viditelných mezer mezi úseky. Sloučeno do `main` jako `7131481`.

Diagnostika: `window.__miloviceKastanovaSettRuntime5261()`; OSM source-lock `scripts/osm-kastanova-source-setts-5261.js`, unit test a mobilní Chromium screenshot; [technický kontrolní pohled](https://foxey-cz.github.io/milovice-life-rp/?v=526100&streetAudit=kastanova-setts-5261). **Stále modelový odhad:** rozměry, konkrétní barva, rozmístění a opotřebení kostek nejsou fotograficky zaměřené. Kamera 220° je aproximací podle osy OSM, nikoli panoramatickou fotografií. Samostatné dokončení GitHub Pages nasazení 5.261 ještě není ověřené.
---

## Milovice RP 5.260 — skutečné 3D pózy a natočené obrysy dvou NPC (22. 11. 2026; [PR #43](https://github.com/FOXEY-CZ/milovice-life-rp/pull/43) sloučen, 5/5 CI PASS)

Dosavadní 5.259 změřila u prvního mapovaného T-napojení Italské minimum 3,9003 m mezi středy aut; to samo nedokládalo mezeru mezi karoseriemi. Ve verzi 5.260 je v existujícím **opt-in** režimu `npcAudit=italska-encounter-5259` kontrolován **každý skutečný herní snímek** proti natočeným obdélníkovým modelovým půdorysům aut. Jejich poloha a úhel odpovídají vykreslovaným Three.js skupinám, rozměry vycházejí z procedurálních délek 4,45/4,15 m a modelové šířky včetně zrcátek podle 5.254; přidaný 8cm přesah nárazníků a samostatný 10cm modelový bezpečnostní buffer jsou konzervativní **modelové** odhady. Nový modul `scripts/osm-italska-body-envelope-5260.js` měří průnik obrysů i nejkratší vzdálenost natočených polygonů; diagnostika `window.__miloviceItalskaBodyEnvelopeRuntime5260()` přehledně zobrazuje výsledky. Node test ověřuje podélná, kolmá, šikmá, dotýkající se i protínající se vozidla a skript kontroluje syntax ještě před spuštěním pomalého mobilního WebGL.

**Skutečně ověřeno v mobilním Chromium/SwiftShader:** 80 herních snímků, nejmenší **modelová mezera mezi obrysy 1,8128 m**, s 10cm bufferem na každé auto zbývá **1,6128 m**, **0 překryvů obrysů a 0 překryvů bufferu**. Křižovatková logika 5.259 zároveň prokázala zastavení a rozjezd druhého vozu. Kontrolní obrázek `italska-body-envelope-5260-mobile.png` z [Italská CI](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44966496277) byl ručně prohlédnut; jde o původní ulici z technického mapového nadhledu, nikoli ověřenou fotografickou kameru. **Všech pět finálních PR workflow PASS:** [Italská](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44966496277), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44966496269), [nádraží 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44966496298), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44966496336) a [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44966496387). Sloučeno jako `514741d`.

**Omezení:** jde o **konkrétní předem určený průjezd dvou aut**, ne o ochranu všech kolizí ve městě. Nedokládá přesné 3D mesh-triangle kolize ani spojité kolize mezi snímky, správnost právní přednosti, fyzikální brzdění či zaměřené obrubníky. Výpočet zůstává **diagnostický** a nebrzdí auta; v běžné hře se vůbec nespouští. OSM GPS, modely cest, chodníků, běžná kamera i dopravní NPC logika se nemění. GitHub Pages deployment 5.260 zatím samostatně neověřen. [Testovací nadhled po nasazení Pages](https://foxey-cz.github.io/milovice-life-rp/?v=526000&streetAudit=italska-road-footway-5252&npcAudit=italska-encounter-5259).

---

## Milovice RP 5.259 — volitelný reálný NPC test křižovatky (22. 11. 2026; PR #42 sloučen, CI 5/5 PASS)

Výslovný parametr `&npcAudit=italska-encounter-5259` po **načtení regionu Mladá** vytvoří dva běžné 3D civilní vozy přímo na původních mapových ramenech prvního T-napojení OSM 8590284/8585601; jde jen o oddělený testovací režim, ne nový provoz pro každého hráče. Přesně stejný `rpAnimateTraffic` a rezervace 5.258 řídí skutečná vykreslovaná vozidla. Diagnostika `window.__miloviceItalskaNpcEncounterRuntime5259()` měří průběžné 3D polohy, zastavení u 5,8m modelové hranice, uvolnění, pokračování a minimální vzdálenost středů karoserií.

**Ověřeno mobilním Chromium/SwiftShader + Node CI:** v konečném PR testu 80 skutečných herních snímků, 61 snímků zadrženého příjezdu, 35 snímků úplného zastavení, první auto vyjelo za uzel, druhé obnovilo jízdu. Minimum **3,9003 m mezi středy aut** není důkaz nekolizního obrysu vozidel. Audit-only technická kamera míří shora na mapovaný uzel (není fotozáběr); oba 3D vozy jsou v obrazovém poli. Kontrolní screenshot `italska-encounter-5259-mobile.png` je uložen ve [výsledcích Italská CI](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44965174463); screenshot byl ručně zkontrolován. **Všech pět finálních PR workflow PASS:** [Italská](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44965174463), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44965174479), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44965174485), [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44965174472), [uliční blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44965174462). [PR #42 sloučen](https://github.com/FOXEY-CZ/milovice-life-rp/pull/42) do `main` jako `f547463`.

**Omezení:** jde o **jeden připravený scénář**, nikoli náhodný celoměstský provoz nebo právně ověřené přednosti. Žádné fyzické kolize, swept-volume bezpečnost, skutečné obrubníky, přesné dopravní značení nebo fotorealismus nejsou tímto testem potvrzeny. OSM GPS, modely cest, chodníků, hráčovo řízení i běžná kamera zůstávají nezměněné. Ověření samostatného GitHub Pages deploye 5.259 zbývá. [Volitelná kontrolní kamera](https://foxey-cz.github.io/milovice-life-rp/?v=525900&streetAudit=italska-road-footway-5252&npcAudit=italska-encounter-5259) — přístupná po nasazení 5.259.

---

## Milovice RP 5.258 — koordinace civilních NPC v původních křižovatkách Italské (22. 11. 2026)

Na OSM 8590284 jsou dvě originální trojramenná napojení na Italskou 8585601 a Kaštanovou 1107814416. Stávající AI sleduje auta před sebou, ale při příjezdu z různých ramen se mohou v jedné křižovatce potkat. Nová source-locked logika `scripts/osm-italska-junction-conflict-5258.js` vybere vždy jednu dočasnou rezervaci každého uzlu a ostatní obyčejná NPC auta v nájezdu přibrzdí k modelové hranici **5,8 m před původním OSM napojením**. Kdo už křižovatkou projíždí, pokračuje; autobus zůstává pod svou původní řídicí logikou, avšak civilní auta mu mohou ustoupit. Jinak se bere přibližný dojezdový čas, ID auta a drží se již vybrané pořadí do průjezdu až 9 m za uzel. Celá logika vyhodnocuje všechny NPC před jejich pohybem ve stejném snímku, nesahá do navigace hráče, OSM GPS, chodníků, silnic ani vykreslené geometrie.

**Omezení:** jde o konzervativní herní rezervaci prostoru, nikoli dopravní pravidla ČR, fyzikální otočení kol ani skutečné kolizní řešení aut. Nemůže napravit dvě auta už uvnitř stejné křižovatky a vnější silnice zůstávají beze změn. Přidán Node test zdrojového zámku, stabilního držení pořadí, zastavení u modelové hranice, nezměněného autobusu a selhání při driftu dat, plus Chromium/SwiftShader WebGL po LOD. Diagnostika `window.__miloviceItalskaJunctionConflictRuntime5258()`. **PR #41 sloučen do main ([43c8131](https://github.com/FOXEY-CZ/milovice-life-rp/commit/43c8131553ccbf9dc4766074987aa4353ca0cd30)); všech pět PR checks PASS:** [Italská Node + mobilní Chromium/WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44962076549), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44962076510), [station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44962076528), [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44962076514), [5.82 blok](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44962076529). **Pages 5.258 a samostatná manuální kontrola screenshotu ještě nepotvrzené.** [Kamera Italské](https://foxey-cz.github.io/milovice-life-rp/?v=525800&streetAudit=italska-road-footway-5252).

---

## Milovice RP 5.257 — vizuální kola NPC nad skutečnou 3D vozovkou Italské (21. 11. 2026)

Na source-locked původní silnici OSM 8590284 a jejích napojeních na Italskou a Kaštanovou dosud běžná jedoucí NPC auta používala výšku skupiny `terrainAt+.045`, přestože původní vozovka `osmStrip` leží na `terrainAt+.17` a spodní bod generické pneumatiky je vzhledem ke skupině `+.045`. To znamená přibližně **8 cm vizuálního zanoření** uprostřed hladkého úseku. Nový `scripts/osm-italska-strip-wheel-height-5257.js` pro stejné původní GPS a bez dalších polygonů předpočítá výšky vrcholů původních pásů, reprodukuje jejich **skutečnou barycentrickou interpolaci po dvou DEM trojúhelnících na segment** a u běžných osobních NPC získá čtyři výšky kol. Nejvyšší podklad určuje cíl 6mm vizuální rezervy, ostatní kola mohou na nerovném podkladu trochu nad vozovkou plavat. Výška se při vstupu/výstupu ze zdrojově podloženého úseku vyhlazuje. Při chybějícím podkladu / příliš velkém rozdílu čtyř kol se ochrana neaktivuje. Autobus 432, široké dodávky, zaparkovaná auta, hráč, původní chodníky, DEM a kolize se nemění.

**Omezení:** jde o matematickou rekonstrukci vzorce stávajícího `osmStrip`, nikoliv skutečný raycast již sloučeného Three.js GPU meshe, fyzikální odpružení, naklánění karoserie, ověření skutečných obrubníků nebo bezpečnou dynamickou kolizi; během krátkého vyhlazení se kola ještě mohou částečně zaříznout. Diagnostika `window.__miloviceItalskaRoadHeightRuntime5257()`; cílený Node test kontroluje identické DEM rohy i interpolaci trojúhelníků a mobilní Chromium/SwiftShader po LOD. **PR #40 sloučen do `main` ([2eebfa1](https://github.com/FOXEY-CZ/milovice-life-rp/commit/2eebfa17b27e588b71b952836ae8c8f0aff15535)); všech 5 PR checks PASS:** [Italská Node + mobilní Chromium/SwiftShader](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44958824591), [validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44958824595), [station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44958824630), [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44958824737), [5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44958824624). **GitHub Pages 5.257 a ruční vizuální porovnání ještě neověřené.** [Kontrolní kamera](https://foxey-cz.github.io/milovice-life-rp/?v=525700&streetAudit=italska-road-footway-5252).

---

## Milovice RP 5.256 — kontrola NPC odbočení vůči skutečným obdélníkovým pásům vozovky (21. 11. 2026)

**Oprava rizika odhaleného v 5.255:** Dosavadní 31-polohový test auta v zatáčce chránil pouze zaoblený modelový buffer kolem střednice. Ve skutečné 3D scéně ale `osmStrip` kreslí pro každý zdrojový OSM úsek samostatný **obdélníkový pás** s přesnou půdorysnou šířkou a bez kulatého zakončení. Některé Bézierovy plynulé zatáčky proto nechaly část karoserie mimo vykreslenou vozovku. Nová 5.256 při každém návrhu napojení nejprve provede stejnou konzervativní starší kontrolu a **navíc** v 31 orientacích prověří celou karoserii (5,08 × 2,0872 m) v husté mřížce přesně proti horizontálním půdorysům stávajících pásů silnic OSM 8590284, 8585601 a 1107814416. Žádná nová plocha asfaltu, kolize, chodník ani přechod se nesmí domyslet. Pokud kandidat nesplní modelovou kontrolu, hra neaplikuje vizuální Bézierovu trajektorii a použije původní diskrétní přechod. Zdrojový zámek z 5.252 chrání silnici/chodník, nové testy současně ověřují neměnný vzorec vytváření Three.js pásů.

**Meze tvrzení:** kontrola půdorysných obdélníků přesně odpovídá horizontálnímu tvaru současného `osmStrip`, ale **není to raycast vykreslených trojúhelníků po výšce, fotoměření obrubníků, simulace otočení kol, průkaz dodržení pravidel ani dynamický výpočet míjení dalších NPC**. Samotný fallback na starý pohyb také neprokazuje bezpečný fyzikální průjezd. Nové diagnostiky `window.__miloviceItalskaRenderedTurnRuntime5256()`, `scripts/osm-italska-rendered-strip-safety-5256.js`, source-locked Node test, `dev-check italska` a mobilní Chromium/SwiftShader po 7,2 s LOD; **PR #39 sloučen do main (squash [6e6b526](https://github.com/FOXEY-CZ/milovice-life-rp/commit/6e6b526116cbcc181d83436c851e0840f5a3f6b8)); všech pět finálních PR CI PASS:** [Italská Node + mobilní Chromium/SwiftShader](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44957699078), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44957699007), [station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44957699014), [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44957699006), [5.82 blok](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44957698992). Modelový výsledek **1/4 průchozích plynulých odboček**; další tři nyní používají starý diskrétní pohyb. **GitHub Pages 5.256 a manuální vizuální kontrola screenshotu zatím neověřené.** [Kamera Italské](https://foxey-cz.github.io/milovice-life-rp/?v=525600&streetAudit=italska-road-footway-5252).

---

## Milovice RP 5.255 — plynulejší výjezdy NPC ze skutečné Italské (21. 11. 2026)

**Nová herní úprava:** Běžná NPC osobní auta mají při čtyřech původních mapovaných výjezdech OSM 8590284 na Italskou OSM 8585601 a Kaštanovou OSM 1107814416 krátkou plynulou Bézierovu trajektorii místo viditelného okamžitého přetočení. Původní dopravní graf rozhoduje o navazující ulici beze změny, motor posléze na 2,6–5 m plynule natočí vykreslenou karoserii a omezí rychlost na 3,5 m/s. Každou křivku předem posoudí 31 póz × 4 rohy modelové obálky auta délky 5,08 m / šířky 2,0872 m včetně zrcátek; všech 124 kontrolovaných rohů musí mít alespoň 10 cm rezervu vůči sjednocení **modelových bufferů původních střednic**. Pokud kontrola selže, zůstává původní diskrétní průjezd; žádná vymyšlená odbočka ani GPS posun.

**Omezení:** modelový buffer není fotogrammetrie, přesný asfaltový mesh, vyřešená fyzika řízení ani kontrola kolizí s auty, domy či obrubníky. Původní OSM silnice, chodníky, přechody (bez vymyšleného značení), kolize i hráčovo řízení zůstaly; autobus 432 a široké generické dodávky tuto úpravu nepoužívají. Zdrojový zámek závisí na původní půdorysné geometrii a hash silnice/chodníku 5.252. Přidány `scripts/osm-italska-junction-smoothing-5255.js`, uzamčený Node test, mobilní Chromium/SwiftShader kontrola po 7,2 s LOD, `dev-check italska` a runtime `window.__miloviceItalskaSmoothTurnRuntime5255()`. [Přímá kamera](https://foxey-cz.github.io/milovice-life-rp/?v=525500&streetAudit=italska-road-footway-5252). **PR #38 sloučen do main (squash commit [3c7c4d7](https://github.com/FOXEY-CZ/milovice-life-rp/commit/3c7c4d7f9b7306a72f99222f7163acd38a782966)); všech pět finálních PR kontrol PASS:** [Italská Node + mobilní WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44955997826), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44955997836), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44955997841), [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44955997793) a [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44955997817). GitHub Pages nasazení této verze ani ruční vizuální inspekce 3D screenshotu zatím nebyly potvrzeny.**

---

## Milovice RP 5.254 — jízdní obálky, skutečná napojení a bezpečnější NPC přesuny (21. 11. 2026)

**PR #35: pět finálních GitHub Actions PASS, sloučeno do main (squash dd3f411).** Na OSM 8590284 jsou původní vnitřní ohyby jen 0,01–1,04°, zato z této téměř rovné 5m modelové komunikace vedou skutečná napojení na Italskou OSM 8585601 (80,61° / 103,43°) a Kaštanovou OSM 1107814416 (91,41° / 89,18°). Nová `inspectItalskaJunctionAngles5254` je měří source-locked přímo z dopravního grafu. Předchozí 5.253 zakázala odbočení NPC autobusu 432 na zúžený úsek, nyní je stejně vyloučen i při *offscreen recyklaci*. Hráčova vozidla, silniční OSM, GPS, původní chodník a kolize se nemění. Node testy a mobilní Chromium/SwiftShader 7,2 s LOD v [Italská CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44948785724); [hlavní validace PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44948785768), [station photo PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44948785782), [Nádražní PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44948785731), [5.82 blok PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44948785710). [PR #35](https://github.com/FOXEY-CZ/milovice-life-rp/pull/35). **Neověřeno:** fyzikální průjezd karoserie křižovatkou, samostatná manuální inspekce screenshotu, Pages deploy finální změny. Herní build štítek dosud 5.253; tento commit ho nezvyšuje.


**Konkrétní zjištění ze stávajícího 3D kódu:** původní NPC jízdní stopy jsou na 5,0m modelové vozovce odděleny o 2,50 m (posun ±1,25 m). Model běžného auta v `scripts/world-models.js` má šířku 1,81 m, včetně vnějších zrcátek přibližně **2,0872 m**; široký generický van má karoserii 2,04 m a obálku včetně zrcátek přibližně **2,3448 m**. Při souběžných rovných jízdních stopách zůstane mezi dvěma běžnými auty **0,4128 m**, mezi dvěma dodávkami pouze **0,1552 m**; vůči okraji modelového asfaltu mají běžná auta **0,2064 m**, dodávky jen **0,0776 m**. Jde o **modelovou orientační obálku, nikoli fotoměření šířky vozovky nebo bezpečnostní normu**. Křižovatky, zatáčky, reálná šířka textur/kolizí a kolize s dynamickými vozidly nejsou tímto výpočtem prokázány.

**Zásah do hry:** široká procedurální NPC dodávka (výchozí varianta `index % 8 === 6` mimo autobusy) se při plánování další odbočky vyhne pouze source-locked OSM 8590284; offscreen recyklace se na tento úsek pro tento NPC typ rovněž nevrací. Obyčejná auta, hráčova auta, ostatní ulice, model silnice, původní GPS chodníku 1484073943 a nemalované přechody zůstávají beze změny. Source-lock závisí na původní 5.252/5.253 kontrole obou OSM way/hash; nejde o tvrzení, že je v Milovicích pro dodávky zákaz vjezdu. Přidaný `scripts/osm-italska-car-clearance-5254.js`, uzamčený Node test a zapojení do Italská CI + `dev-check italska`, runtime diagnostika `window.__miloviceItalskaCarClearanceRuntime5254()`. **Rozšíření modelové kontroly zatáček:** nový `inspectItalskaRoadBends5254` počítá úhly sousedních segmentů ze skutečného OSM way 8590284 a vrací počty ohybů nad 15° / 30° a nejvyšší úhel. Node test porovnává i původní regionální geometrii a mobilní WebGL kontroluje, že žádný údaj není vydáván za ověřený průjezd otočené karoserie. Žádné nové silnice, kolize nebo obrubníky. Zatím je to **diagnostika rizika**, nikoli fyzikální simulace průjezdu zatáčkou.

**Mobilní WebGL test je nyní zapojen do Italská Actions** (`scripts/osm-italska-car-clearance-webgl-5254.mjs`): mobilní Chromium 393×852 / SwiftShader, 7,2 s po LOD, diagnostiky 5.252/5.253/5.254, původní chodník, nulové široké NPC na úseku a screenshot `browser-artifacts/italska-car-clearance-5254-mobile.png`. Test geometrie navíc fail-closed kontroluje skutečnou konstantu šířky, index široké dodávky, zrcátka a jízdní offset ve zdrojovém kódu. **Výsledek CI/WebGL/Pages nové integrace zatím NEověřen; HTML build label stále 5.253**, nejde o prohlášení finální vydané verze. Pro finální 5.254 doplnit skutečný mobilní WebGL snímek a ověření zatáček a křižovatek, následně teprve aktualizovat build label.


**Další kontrola průjezdu v zatáčkách (5.254, rozpracováno):** `scripts/osm-italska-turn-envelope-5254.js` vezme jen source-locked dopravní segmenty původního OSM 8590284, zohlední nynější posun osy každé jízdní stopy ±šířka/4 a při přechodu sousedních segmentů testuje oba směry. Pro kontrolní body 0 / 0,5 / 1,5 / 3 m od uzlu spočte čtyři rohy orientovaného obdélníku konzervativní délky **5,08 m** a šířky standardního auta **2,0872 m včetně modelových zrcátek**. Výsledky porovná s 2,5m bufferem původní osy a eviduje vyčnívající pózy. Používá se pouze jako **konzervativní orientační test**; kruhové zakončení bufferu nemusí odpovídat skutečnému meshi vozovky a průběžná trajektorie řízených kol mezi těmito okamžiky není modelována. Samotná změna **nepřidává nový fyzický kolizní systém ani neřídí NPC volantem**. Připojeno k `window.__miloviceItalskaTurnEnvelopeRuntime5254()`, `scripts/osm-italska-turn-envelope-5254.test.mjs`, běžnému `dev-check italska` a mobilnímu WebGL CI. **CI dosud bez potvrzeného výsledku; nenasazovat jako hotový release 5.254.**
---

## Milovice RP 5.253 — vozidla a parkování na zúženém úseku Italské (21. 11. 2026)

**Navazuje na skutečný obnovený chodník 5.252.** Originální OSM pěší trasa **1484073943** měla kvůli generické příliš široké **7,8m** herní vozovce **8590284** neviditelný první úsek. Verze 5.252 použila zdrojově ověřenou, ale **nezaměřenou modelovou šířku 5,0 m** a vrátila do hry cca 30 m původního chodníku. Nová 5.253 nyní přizpůsobuje i **NPC chování na tomto přesném místě**. Velký generický autobus linky 432 nesmí při výběru další křižovatky odbočit na tento úzký 5m *modelový* úsek, pokud source-lock 5.252 sedí na originální OSM ID, původní geometrii a hash (silnice 233aae3b a chodník 7d8bc0e5). V případě jinak slepé odbočky stávající bezpečná logika 5.241 autobus otočí nebo zastaví, **nikdy ho neteleportuje přes mapu**. Obyčejná NPC osobní auta dál tímto skutečným mapovaným úsekem projíždějí. Na této silnici se současně **nevymýšlejí nová procedurální roadside parkovací místa**; skutečné OSM `mapped-surface-parking` plochy a všechny ostatní ulice zůstávají beze změny.

Tohle **není tvrzení o skutečném zákazu autobusu** ani dopravní značka. Neznáme přesnou terénní šířku a tato ochrana se týká jen simulace a procedurálního parkování. GPS domů, pěší trasy, samotné vozovky, hráčovy kolize a řízení, přechody 1484073944 a 1484073946 (oba nemalované), NPC pěší, světla ani vchody se nepřepisují. Nový `scripts/osm-italska-narrow-npc-5253.js` + source-locked Node test, `dev-check italska`, samostatný skutečný mobilní Chromium/SwiftShader test 6,9s LOD s kontrolou stále obnoveného chodníku a autobusů/parkování, screenshot a diagnostika `window.__miloviceItalskaNpcClearanceRuntime5253()`. Technická kamera je původní 5.252 GPS bod [Italská–Rakouská](https://foxey-cz.github.io/milovice-life-rp/?v=525300&streetAudit=italska-road-footway-5252). **Všech pět finálních PR GitHub Actions kontrol PASS:** [5.253 Node + skutečné mobilní Chromium/SwiftShader WebGL 6,9s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44946959064), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44946959089), [station photo WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44946959041), [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44946959123), [5.82 fotografický blok](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44946959050). [PR #34 sloučen do main, squash commit cc834ed](https://github.com/FOXEY-CZ/milovice-life-rp/commit/cc834ed0eedd8f7f061760c4f3d5b6d265e3c7c4). Po prvním chybně nastaveném HUD očekávání 5.252 byly starší testy upraveny a **finální CI celé PASS**. Samostatná ruční inspekce screenshotu neproběhla; **Pages deploy 5.253 zatím čeká**.

---

## Milovice RP 5.252 — oprava chybějícího chodníku v bloku Italská–Rakouská (21. 11. 2026)

**Výrazná oprava celé ulice, nikoliv dekorace:** Analýza originálních OSM/RÚIAN GPS geometrických centerline přinesla konkrétní zdrojové ID **[chodník 1484073943](https://www.openstreetmap.org/way/1484073943)** a sousední nepojmenovanou **[obytnou vozovku 8590284](https://www.openstreetmap.org/way/8590284)**. Této silnici OSM **neudává** `width=*`, takže generický herní model vozovky 7,8 m zakrýval **celých 51,968 m** prvního skutečného zmapovaného chodníku (mimo asfaltové bezpečnostní ořezání byl průchod 0,0 m). Nový `scripts/osm-italska-road-sidewalk-5252.js` kontroluje obě přesné původní OSM geometrie, ID i hashe (**8590284: 233aae3b, 9 GPS uzlů; 1484073943: 7d8bc0e5, 7 GPS uzlů**), přesné mapové tagy a zdrojovou délku. Jen při úplné shodě sníží **modelovou** šířku tohoto konkrétního vedlejšího úseku z 7,8 na **5,0 m**. Nová šířka platí **stejně** pro fyzicky viditelnou vozovku, modelový road-clearance index, graf vozidel i následné vykreslení přilehlého původního chodníku; žádné překrývání asfaltu bílou dlažbou. Stávající bezpečnostní ořez umožní z tohoto prvního úseku vykreslit přibližně **29,8 m**, přičemž zbývající **cca 22,2 m zůstává bezpečně nevybarveno**. Dalších pět původních úseků téhož OSM chodníku i navazující původní síť zůstávají.

**Omezení důkazů:** **5,0 m je modelová šířka vypočítaná tak, aby se k sobě vešla obě původní mapová vedení. Není to geodeticky ani fotograficky ověřená skutečná šířka vozovky.** Souřadnice OSM, stávající budovy (včetně skladu 53865876, rezidenčního domu 53865877 a Vojenského zátiší 53865882), vchody, stromy, chodníky, NPC trasy ani střednice silnic se nikam neposouvají. Nemalované OSM přechody **1484073944 a 1484073946** zůstávají bez zebry; nevymýšlíme nový přechod či parkovací plochy. Obytná vozovka zůstává průjezdná ve stávajícím modelu; pro skutečné míjení aut je třeba samostatná kontrola mobilní hry.

Samostatný Node regresní test `scripts/osm-italska-road-sidewalk-5252.test.mjs` na reálném regionu `mlada.json` kontroluje starých 0 m a nových cca 30 m včetně **každého 0,7m měřeného úseku vůči modelové hranici vozovky** a fail-closed při pozměnění OSM; mobilní Chromium/SwiftShader test po **6,8 s LOD** má samostatnou kameru na přesném mapovém uzlu chodníku 50.2247188, 14.8738036, heading 315° jen modelově odhadnutý. Diagnostika: `window.__miloviceItalskaRoadFootwayRuntime5252()`; [přímý kontrolní pohled](https://foxey-cz.github.io/milovice-life-rp/?v=525200&streetAudit=italska-road-footway-5252). Nový unit test je zapojen do `node scripts/dev-check.mjs italska` a nový WebGL test do stávajícího Italská CI workflow. **Všech pět PR GitHub Actions kontrol na finálním head komitu PASS:** [Italská 5.252 Node + mobilní Chromium/SwiftShader WebGL po 6,8 s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44945291355), [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44945291349), [5.82 street-block WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44945291340), [Nádražní 5.81 WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44945291433), [station photo WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44945291348). [PR #33 sloučen do main, commit 48702db](https://github.com/FOXEY-CZ/milovice-life-rp/commit/48702dbf58314d0c24844705ada61df6ec5e721c). CI zapsalo mobilní screenshot do artefaktu `italska-apartments-5235`, ale samostatná ruční vizuální inspekce screenshotu neproběhla. **Pages nasazení nové verze zatím NEověřené.** Předchozí verze **5.251 má [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44944427874)**.

---

## Milovice RP 5.251 — severní strana bývalého Vojenského zátiší z Rakouské (21. 11. 2026)

**Další skutečně viditelná oprava jedné historicky doložené budovy v bloku Italská–Rakouská:** K původním dvěma fotografiím z Italské (5.249–5.250) se podařilo dohledat třetí veřejně licencovaný snímek **[Rakouská (Milovice) 15.jpg](https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg)** (Stanislav Doronenko, 20. srpna 2025, **CC BY-SA 4.0**, skutečná GPS fotoaparátu **50.226027, 14.874584**). Jeho popisek jednoznačně identifikuje bývalé Vojenské zátiší / pozdější Posádkový dům armády, tj. navazující severní pohled na tentýž historický objekt. Na **neměněném** originálním OSM way **53865882 / RÚIAN 40057411**, s 29 původními GPS body a přesnou kontrolou FNV **7aec42bc**, nový `scripts/osm-rakouska-north-photo-5251.js` počítá jen stěnové hrany přibližně obrácené ke skutečné GPS poloze fotografa a odmítá přímky do středu stěn přerušené jinou částí polygonu. Z této třetí pozice vychází **šest dalších dosud nezdobených původních hran 0, 1, 2, 3, 5 a 27**; původní ověřený výběr 12 stěn ze dvou jižních záběrů zůstává. Celkem nyní **18 zdobených existujících hran** a **16 záměrně modelových skvrn opadané omítky** místo 11; vykreslování dál používá jen **2 společné mesh dávky / 100 dekorativních trojúhelníků**. Žádná nová budova, změna střechy nebo GPS, okna, dveře, cesta, chodník, zebra, zahrada, kolize, NPC ani foto textura.

**Důležitý rozdíl mezi důkazem a odhadem:** samotná přesná GPS pozice třetí fotografie dokládá místo fotografa, **ne směr jeho objektivu, exactní hrany stěn či fasádní detaily**. Severní viditelnost je odvozena z modelu OSM půdorysu a směr technické kamery **168°** je odhad směrem k objektu. Nová severní omítková lišta a modelové skvrny jsou **extrapolace vizuálního stylu z dříve doložených fotografií**, nikoliv přesné pozice dokumentované novým snímkem. Samostatné dvě fotografie [sovětského basreliéfu na Rakouské](https://commons.wikimedia.org/wiki/File:Sov%C4%9Btsk%C3%BD_basreli%C3%A9f_na_Rakousk%C3%A9_ulici_v_Milovic%C3%ADch_01.jpg) dokumentují existenci reliéfu v okolí, ale **zatím nevkládáme** vymyšlený reliéf s nezaměřeným rozměrem a polohou. Sousední OSM 1484073943 je původní `footway=sidewalk` a 1484073944 je původní **nemalovaný** přechod (`crossing:markings=no`), na který tato změna nesahá. Příště pokračovat kompletnější návazností tohoto bloku, ne další nahodilou výzdobou.

Nový unit test `scripts/osm-rakouska-north-photo-5251.test.mjs` source-lockem hlídá všech 6 původních přidaných hran, přesně 18 renderovaných hran a 16 modelových skvrn. Technická kamera je přímé `?v=525100&streetAudit=rakouska-vojen-zatisi-5251`; nové `window.__miloviceRakouskaNorthPhotoRuntime5251()` vypisuje důkazy a odhady. Přidán **samostatný skutečný mobilní Chromium/SwiftShader test po 6,7 s LOD**, screenshot a rozšířený itinerář `dev-check italska`. Starší 5.249–5.250 zdrojové testy nadále chrání původní 15 kandidátů a následných 12 hran; starší mobilní test nyní očekává 18 finálně viditelných fasád. **Všech pět finálních PR GitHub Actions kontrol PASS:** [5.251 Node + skutečný mobilní Chromium/SwiftShader WebGL / 6,7 s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44943938718), [celková validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44943938800), [Station photo WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44943938703), [Nádražní 5.81](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44943938722), [5.82 street-block WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44943938654). [PR #32 sloučen do main (squash 0459153)](https://github.com/FOXEY-CZ/milovice-life-rp/commit/04591537fe77f90f1f00c106c13e81e397311b26). Testovací screenshot byl uložen do CI artefaktu, **samostatná ruční vizuální kontrola screenshotu nebyla provedena**. **GitHub Pages deployment finální verze zatím není potvrzený.**

---

## Milovice RP 5.250 — zakryté stěny Italské bez falešných dekorací (21. 11. 2026)

**Viditelná oprava 3D scény:** předchozí 5.249 zdobila 15 existujících stěnových úseků historického Vojenského zátiší, jež byly natočené k jedné ze dvou foto-GPS pozic. Tři takové fasády (indexy původních OSM hran 1, 7 a 26) ale zároveň zakrývá další zalomení půdorysu téže budovy. Nový zdrojově uzamčený filtr scripts/osm-italska-photo-sightlines-5250.js testuje skutečnou průsečnici z každé z obou původních GPS foto-pozic do středu stěny proti všem ostatním hranám přesného 29bodového OSM polygonu 53865882 / RÚIAN 40057411. Nepřidává žádný nový polygon ani stavební detail. Po odstranění zakrytých dekorací zůstává **12 originálních viditelných hran, 11 odhadovaných skvrn omítky místo 13, 2 sdílené 3D mesh dávky a 68 dekorativních trojúhelníků**. Tvar střechy, omítkové barvy, původní GPS a RÚIAN obrys, celá doprava, NPC, chodníky a kolize jsou nezměněné.

Dvě veřejné fotografie: [Italská 04](https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_04.jpg) a [Italská 05](https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_05.jpg) (Stanislav Doronenko, 20. 8. 2025, CC BY-SA 4.0). **Kontrola přímé viditelnosti není fotografické zaměření**: neověřuje délky říms, přesné skvrny, barvy, okna či překážky před budovou. Zůstávají modelovými odhady. Fotografie se nepřebírají do herních textur. Jednotkový test scripts/osm-italska-photo-sightlines-5250.test.mjs ověřuje 12 konkrétních původních hran; původní 5.249 test chrání předchozích 15 výchozích kandidátů. Reálný mobilní Chromium/SwiftShader test očekává 12 stěn a 11 skvrn po 6,6 s LOD. Diagnostika: window.__miloviceItalskaSightlineRuntime5250(). [Technický pohled ve hře](https://foxey-cz.github.io/milovice-life-rp/?v=525000&streetAudit=italska-vojen-zatisi-5249). Směr herní kamery je pouze přibližný. **Ověřeno na finálním PR head commitu:** [Node a mobilní Chromium/SwiftShader 6,6 s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44942584637), [celková validace PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44942584641), [Station foto WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44942584633), [Nádražní 5.81 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44942584654), [5.82 blok PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44942584666). [PR #31 sloučen do main, squash commit c7dec12](https://github.com/FOXEY-CZ/milovice-life-rp/commit/c7dec12c5aa970554027b5851259f605a651a87e). Mobilní screenshot je uložen v artefaktu CI, nebyl ale nezávisle vizuálně hodnocen. **Samostatný GitHub Pages deployment zatím není potvrzený.**

---

## Milovice RP 5.249 — historické Vojenské zátiší na Italské podle fotografií (21. 11. 2026)

**Viditelná změna existující ulice:** V Italské jsem dohledala dvě veřejně dostupné fotografie bývalého Vojenského zátiší, pořízené **20. srpna 2025**. Fotograf **Stanislav Doronenko**, licence **CC BY-SA 4.0**: [pohled 04](https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_04.jpg), [pohled 05](https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_05.jpg). Fotografie dokládají světlou opadanou omítku, vodorovné fasádní členění a nízké dvoupodlažní působení staré budovy. Na přibližně odpovídajícím **originálním OSM půdorysu 53865882 / RÚIAN 40057411** se 29 GPS body a plochou 913,64 m² dostala stávající stavba tlumeně světlejší modelovou omítku a střechu a povrchové detaily. **Žádná fotografická textura se nestahuje ani nekopíruje.**

Úprava používá pouze původní polohu existujících stěn: 15 exteriérových úseků orientovaných k místům obou fotografů, dvě sdílené 3D mesh dávky místo desítek jednotlivých objektů, slabou vodorovnou římsu a 13 **přibližných dekorativních modelových skvrn**. Přesný barevný odstín, rozmístění a tvar těchto odhalených míst **nejsou zaměřené**; jde o vizuální přiblížení stavu na fotografiích. OSM tagy u budovy **neobsahují skutečný počet pater** – dvoupodlažní model je pouze starší výchozí hra, nikoliv nově zjištěné RÚIAN poschodí. Nepřibyly žádné nepotvrzené dveře, okna, ploty, trávníky, lampy, cesty, kolize ani jiné budovy. Půdorys, silniční síť a originální tvar střechy se nemění.

Soubor `scripts/osm-italska-vojen-zatisi-5249.js` odmítne i nepatrně jiné OSM obrysy (FNV `7aec42bc`), cizí budovu a uživatelsky schválené modely. Zdrojový test `scripts/osm-italska-vojen-zatisi-5249.test.mjs`, mobilní Chromium/SwiftShader s 6,6s LOD `scripts/osm-italska-vojen-zatisi-webgl-5249.mjs`, `node scripts/dev-check.mjs italska` a GitHub workflow `italska-apartments-5235.yml`. Výpis ve hře: `window.__miloviceItalskaVojenskeZatisiRuntime5249()`. [Přímá technická kamera u původního objektu v Italské](https://foxey-cz.github.io/milovice-life-rp/?v=524900&streetAudit=italska-vojen-zatisi-5249) z GPS druhé fotografie se **směrem kamery pouze přibližným**, nikoli fotokopií panoramatu. **Po opravě prohlédnut finální mobilní screenshot (světlá fasáda, odhadované nízké skvrny již nezasahují do oken); všech pět PR GitHub Actions kontrol úspěšně PASS:** [5.249 Node a mobilní Chromium/SwiftShader po 6,6s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44940241536), [kompletní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44940241547), [Station WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44940241585), [Nádražní 5.81 WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44940241431), [5.82 street-block WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44940241524). [PR #30 sloučen, hlavní squash commit a5345b5](https://github.com/FOXEY-CZ/milovice-life-rp/commit/a5345b583598219cf2a374d9f97bc1e3607a3fdc). **GitHub Pages nasazení finální verze nebylo samostatně ověřeno.**

---

## Milovice RP 5.248 — detail nástupišť podle originálních OSM obrysů (21. 11. 2026)

**Viditelná oprava u nádraží:** Žlutý hmatový pás a úzký obrubník se předtím kladly na celou hranu nástupiště, jakmile **prostředek** hrany ležel poblíž kolejí. Při dlouhých hranách a výřezech půdorysu to nemuselo platit po celé délce. Nová verze přísně kontroluje každý úsek do **70 cm** oproti originálním OSM obrysům obou nástupišť `549346219` a `994855884` a skutečným mapovaným kolejím. Průběžně hlídá, aby žlutá dlažba **nepřečnívala mimo polygon nástupiště** (včetně zalomení a vykousnutých částí) a aby hrana skutečně byla u trati. Sousední prověřené části se zase spojí do dlouhých 3D pásů kvůli mobilnímu výkonu.

Na aktuálním originálním exportu Mladá je výsledkem **26 smysluplně spojených pásů o souhrnné délce přibližně 501 m**. Oproti předchozímu algoritmu nejde o změnu GPS, tvaru či výšky nástupiště, budovy, kolejí, střechy, fyzických kolizí ani polohy nádraží. Stávající žlutý povrch je **foto-inspirovaná modelová textura**; přesný materiál a rozměry reálné dlažby tím nejsou potvrzeny.

Kód: `scripts/osm-station-platform-edging-5248.js`, zdrojově uzamčený test `scripts/osm-station-platform-edging-5248.test.mjs`, `node scripts/dev-check.mjs nadrazi`, `station-photo-webgl.yml` (Node + Chromium/SwiftShader). Herní diagnostika: `window.__milovicePlatformEdgingRuntime5248()`. [Otevřít Milovice RP u nádraží](https://foxey-cz.github.io/milovice-life-rp/?v=524800). **Důležité k průběžnému načítání:** skutečný nádražní 3D Chromium záběr měl 1 aktuálně streamované nástupiště, 6 vykreslených souvislých pásů a 58 m. Hodnota 26 pásů/501 m je výsledek úplného zdrojového OSM exportu, ne současně načtené scény. **Na finálním PR commitu potvrzeny všechny GitHub Actions kontroly PASS:** [původní station Node + reálné Chromium WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44938497388), [hlavní validace PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44938497441), [Nádražní 5.81 WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44938497416), [5.82 street-block WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44938497326) a [Italská/Višňová mobilní Chromium/6,5s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44938497417). [Sloučeno do main: aeb2408](https://github.com/FOXEY-CZ/milovice-life-rp/commit/aeb24083500695733b374f7560ea9e794bf969d3). **Nasazení této revize na GitHub Pages zatím nebylo samostatně ověřeno.**

---

## Milovice RP 5.247 — chodci už neprojdou ani úzkým zásahem silnice mezi kontrolními body (21. 11. 2026)

V předchozí verzi se průběžně ověřovaly všechny původní hrany budov, ale vzdálenost běžného modelového chodce od silnice se kontrolovala v **pěti bodových vzorcích** na fragmentu. Menší vozovka přesně mezi dvěma vzorky mohla uniknout. **5.247 posuzuje každé místo celé pěší trasy proti existujícím modelovaným šířkám skutečných OSM vozovek:** rozděluje každou trasu na úseky do 0,7 m a kontroluje jejich střed s konzervativním odstupem rozšířeným o půl délky úseku. Matematicky tak zajistí bezpečnost celé středové čáry chodce, nejen bodů.

Stejnou kontrolu mají i obě mezery u původního OSM uzlu, přes který od verze 5.246 procházejí běžní NPC chodci. **Na stávajícím OSM regionu Mladá zůstalo v modelovém auditu všech 648 dřívějších bezpečných pěších fragmentů a 288 ověřených návazností**. Nový syntetický test ukazuje úzké křížení, které stará pětibodová metoda přehlédne. Výsledky nevypovídají o fotograficky ověřené přesnosti každého chodníku; jde o ochranu modelové mapy před vozovkami. Nezměnily se originální GPS, žádná silnice, chodník, přechod, budova, NPC model, kolizní překážka ani zvláštní naprogramovaní chodci Topolová/Višňová/Italská.

Modul: `scripts/osm-ambient-road-clearance-5247.js`, automatický test `scripts/osm-ambient-road-clearance-5247.test.mjs`, kontrola `node scripts/dev-check.mjs italska`, GitHub Actions `italska-apartments-5235.yml`, mobilní Chromium/SwiftShader s 6,5s LOD. Herní diagnostika: `window.__miloviceMappedRoadCorridorRuntime5247()`. [Technický herní pohled u Italské](https://foxey-cz.github.io/milovice-life-rp/?v=524700&streetAudit=italska-west-residence-5242). **Na finálním PR commitu ověřeno GitHub Actions PASS:** [cílené Node + mobilní Chromium/SwiftShader (6,5s LOD) PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44935563226), [hlavní validace PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44935563276), [Station WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44935563257), [Nádražní 5.81 WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44935563328), [blok 5.82 WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44935563263). [Squash commit v main: 7567bb0](https://github.com/FOXEY-CZ/milovice-life-rp/commit/7567bb0ae6207c1d0af7c62062e138a165c487ce). **Samostatný GitHub Pages deployment finální revize zatím není potvrzený.**

---

## Milovice RP 5.246 — navazující chodci bez otáčení na každém OSM uzlu (21. 11. 2026)

**Běžní modeloví chodci mohou nyní plynule projít zatáčkou po dvou sousedních úsecích téže původní OpenStreetMap pěší cesty**, místo aby se na konci každého úseku bezdůvodně otočili. Původní 5.243 trasy se kvůli bezpečnému odstupu od křižovatek zkracovaly na obou koncích o 1,1 m; 5.246 doplňuje možnost projít tyto krátké mezery **přes přesnou původní souřadnici OSM uzlu, po původních dvou směrech hrany**. Chodec tak neřeže zatáčku napříč neexistující cestou a mezi segmenty neteleportuje.

Přechod je povolen jen tehdy, když obě strany patří **stejnému originálnímu OSM way a sousedním původním hranám**, přesně navazují na původní OSM uzel (max. 4,5 cm tolerance), jsou již označené bezpečnostní 5.245 kontrolou celé trasy vůči budovám a **každý kousek 1,1m mezery zvlášť** projde souvislou kontrolou proti originálním obrysům budov a po nejvýše 20cm vzorcích proti vozovkám. Pokud mapová cesta u uzlu nepokračuje nebo byla oříznuta u vozovky, zůstává dosavadní bezpečné otočení. Modeloví **speciální chodci Topolová, Višňová a Italská** zůstávají beze změny, stejně jako recyklace generických modelů mimo záběr 5.244. Počítačové oblečení, počet a motivace postav nejsou fotografická dokumentace reality.

**Žádné nové OSM GPS body, chodníky, silnice, přechody, stavební objekty ani kolize.** Implementace: `scripts/osm-ambient-continuity-5246.js`, test `scripts/osm-ambient-continuity-5246.test.mjs`, `node scripts/dev-check.mjs italska`, GitHub workflow `italska-apartments-5235.yml` a mobilní Chromium/SwiftShader test 5.242 po 6,5s LOD. Herní diagnostika `window.__miloviceMappedAmbientContinuityRuntime5246()` vypisuje počet zdrojově ověřených napojení a skutečných přechodů NPC. [Vyzkoušet technický pohled u Italské](https://foxey-cz.github.io/milovice-life-rp/?v=524600&streetAudit=italska-west-residence-5242). **Po sloučení do main byla na finálním PR commitu potvrzena úspěšná GitHub Actions validace:** [5.246 kompletní Node + mobilní Chromium/SwiftShader/6,5s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44934745275), [celková validace PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44934745315), [Station WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44934745312), [Nádražní 5.81 WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44934745270) a [5.82 street-block WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44934745290). Hlavní squash commit: [f8f5852](https://github.com/FOXEY-CZ/milovice-life-rp/commit/f8f5852d3c5adebd2ac78771ff75393c2bb1cf3d). **GitHub Pages nasazení této revize nebylo samostatně ověřeno.**

---

## Milovice RP 5.245 — žádné procházení budovou mezi kontrolními body (21. 11. 2026)

**Ochrana pro budoucí mapu:** Předchozí běžní chodci ze skutečných OpenStreetMap cest měli kontrolu budov jen v pěti místech každého segmentu. Kratší stavební objekt ležící mezi vzorky tak mohl uniknout. V 5.245 se **celá originální pěší trasa kontroluje proti všem skutečným hranám RÚIAN/OSM budov z načtené oblasti**, včetně přímých průsečíků, dotyku s hranou a modelového odstupu 35 cm od stěny. Zrychlení zajišťují jednoduché prostorové obálky budov, aby se přesná matematika nepouštěla pro vzdálené objekty.

Na původních datech regionu Mladá je **1196 budov a 648 vhodných pěších fragmentů**; zpřísněná kontrola **ponechala všech 648**. Neznamená to, že mapa byla chybně zakreslená. Úprava opravuje slabinu algoritmu, kterou nový test jednoznačně demonstruje na úzké modelové budově mezi původními pěti vzorky. Každá cesta zůstává originálním OpenStreetMap úsekem; **žádný nový chodník, budova, průchod, přechod ani kolize**. Zůstává i stávající recyklace neviditelných generických NPC (5.244) a ručně speciálně vedení chodci z dřívějších verzí.

Zdroj `scripts/osm-ambient-building-clearance-5245.js`, test `scripts/osm-ambient-building-clearance-5245.test.mjs`, kontrola `node scripts/dev-check.mjs italska` a GitHub Actions `italska-apartments-5235.yml` včetně mobilního WebGL testu. Diagnostika: `window.__miloviceMappedBuildingClearanceRuntime5245()`. [Otevřít testovací kameru u Italské](https://foxey-cz.github.io/milovice-life-rp/?v=524500&streetAudit=italska-west-residence-5242). **Nový test kompletně prošel v izolovaném JavaScriptovém ověření; Node CLI, reálný mobilní Chromium/SwiftShader, CI a nasazení Pages zatím nemají potvrzený PASS.**

---

## Milovice RP 5.244 — chodci se inteligentně přesouvají mezi načtenými oblastmi (21. 11. 2026)

Verze 5.243 odstranila falešné generické chodníky tím, že běžné NPC chodce přesunula na původní OSM pěší cesty. Při dlouhém průchodu Milovicemi však NPC lidé z prvních oblastí dál zabírali modelovou kapacitu, ačkoli byli už stovky metrů od hráče; po dosažení limitu 65 osob se tak mohly v nové oblasti přestat objevovat běžné modelové postavy.

**5.244 neviditelné běžné modely recykluje:** pouze ambient NPC osoby s `mappedAmbient5243:true`, které jsou **více než 310 metrů** od hráče i od aktivních technických kamer a jsou již skryté, mohou přejít na **jiný původní OSM pěší úsek** ve vzdálenosti 155–310 m od aktuálního výhledu a zároveň minimálně 155 m od všech kamer. Přesuny jsou omezené na **nejvýše čtyři každých šest sekund**, bez náhlých přeskoků před kamerou, znovu se využívají již vytvořené 3D lidské modely. Nejde o přesnou simulaci pohybu všech lidí ve městě: jde o performance-friendly správu generických obyvatel v záběru. **Původní speciální chodci** na trasách Topolová/Italská/Višňová se nikdy nepřesouvají a zachovávají svou logiku.

Nová bezpečnostní pojistka `scripts/osm-ambient-reuse-5244.js` nepřipustí 3D silniční úseky, odhadované krajnice, příliš krátké či neověřené pěší cesty, průchod budovou ani obsazené pěší fragmenty. Původní OSM GPS a fyzický svět, 3D budovy, kolize, silnice/chodníky a speciální aktéři zůstávají beze změny. Runtime `window.__miloviceAmbientReuseRuntime5244()` ukazuje počet recyklací a nulové viditelné přesuny. Nový test `scripts/osm-ambient-reuse-5244.test.mjs`, skupina `node scripts/dev-check.mjs italska` a mobilní Chromium/SwiftShader skript `scripts/osm-italska-west-residence-webgl-5242.mjs` kontrolují novou verzi. **Čistý test algoritmu prošel při izolovaném spuštění, reálný Node/Chromium CI a GitHub Pages pro 5.244 dosud nemají potvrzený PASS.** Technická kamera v okolí Italské: [otevřít Milovice RP 5.244](https://foxey-cz.github.io/milovice-life-rp/?v=524400&streetAudit=italska-west-residence-5242).

---

## Milovice RP 5.243 — běžní chodci konečně na skutečných OSM chodnících (21. 11. 2026)

Předchozí hra umísťovala **30 generických chodců podle náhodných úseků silnic** a odhadovala, že chodník leží vždy vedle vozovky. Takto mohli lidé chodit na místech bez zakresleného chodníku. Ve verzi **5.243** jsou základní a nově streamovaní modeloví NPC chodci místo toho vybíráni jen ze **skutečně mapovaných OSM pěších cest** (`footway`, `path`, `pedestrian`). Používáme **stejné části tras oříznuté od vozovek jako vykreslování chodníků**, původní souřadnice, a kontrolujeme i průchod přes původní mapované půdorysy budov. Vyřazujeme přechody přes vozovku (ty vyžadují samostatnou logiku), tunely, mosty, zakázané průchody a komunikace s povoleným motorovým provozem. Neexistující chodník se nevymýšlí.

Chodci stojí na **původních středech OSM pěších segmentů**, nikoli na vymyšlené vzdálenosti od vozovky. Běžná NPC simulace je nadále zjednodušená: po dosažení konce úseku se otočí. Při načtení nových oblastí se může přidat až 8 dalších modelových chodců poblíž výhledu, se stropem na rostoucí počet. Dosavadní konkrétní chodci na ověřených OSM trasách u Topolové, Višňové a Italské zůstávají. **Není přidaná žádná pěší cesta, přechod, silnice, budova ani kolize; počet, oblečení a chování NPC nejsou fotodokumentované.**

Zdrojové skripty: `scripts/osm-mapped-ambient-walkers-5243.js` a `scripts/osm-mapped-ambient-walkers-5243.test.mjs`. Technický runtime je `window.__miloviceMappedAmbientWalkersRuntime5243()`. Kontrolní modul proti aktuálnímu OSM exportu Mladé a základním šířkám vybral **648 fragmentů z 239 skutečných pěších cest** po odmítnutí pěti úseků zasahujících do původních budov; nejedná se o počet ve hře. Regresní testy běží přes `node scripts/dev-check.mjs italska` a `.github/workflows/italska-apartments-5235.yml`. Reálný mobilní test také kontroluje, zda ambient chodci leží na skutečných pěších středech po 6,5 s LOD na technické kameře u Italské: [otevřít Milovice RP 5.243](https://foxey-cz.github.io/milovice-life-rp/?v=524300&streetAudit=italska-west-residence-5242). **Zdrojový preflight proběhl; úspěšné GitHub Actions / Pages zatím nejsou potvrzené.**

---

## Milovice RP 5.242 — další skutečný dvoupodlažní obytný dům (21. 11. 2026)

Na západní straně mapovaného okolí Italské přibyl **nový detail původní již existující** rezidenční budovy [OSM 53865923](https://www.openstreetmap.org/way/53865923), RÚIAN **25610473**: zdrojový 13bodový půdorys cca **544,506 m²**, 2 podlaží, 10 bytů. Model podle skutečných hran půdorysu nyní ukazuje **32 odhadovaných modelových oken** na dvou dlouhých stranách 32,473 a 33,051 m. Využívá stávající čtyřbatchový renderer a jeho sdílené materiály. **Nejde o fotograficky reprodukovanou fasádu**; okna, rozteče, barvy, parapety a skutečné vchody nebyly ověřeny na místě ani panoramatem. Další krátké stěny nedostávají náhodné spekulativní dveře a okna.

**Původní zdi, střecha, výška modelu, půdorys, GPS, silnice, chodníky, kolize a počet budov se nemění.** Pouze na dvě existující fasádní hrany přibývají modelové 3D vrstvy (32 oken / 4 meshe / 472 trojúhelníků). Source-lock `scripts/osm-italska-west-residence-5242.js` odmítá změněné RÚIAN ID, tags, GPS, podlaží a modelovou výšku. Přímý [technický herní pohled](https://foxey-cz.github.io/milovice-life-rp/?v=524200&streetAudit=italska-west-residence-5242) používá **původní OSM uzel chodníku 1005977571 (50.2283502, 14.8741049)** a **odhadovaný** směr 200°, nikoliv panorama.

Zdrojový test `scripts/osm-italska-west-residence-5242.test.mjs`, workflow `.github/workflows/italska-apartments-5235.yml` a mobilní skutečný Chromium/SwiftShader test `scripts/osm-italska-west-residence-webgl-5242.mjs` se screenshotem a kontrolou po 6,5 s LOD jsou připravené; `node scripts/dev-check.mjs italska` obsahuje i předchozí dopravní regresi 5.240–5.241. **Pro novou 5.242 byla přímo ověřena zdrojová geometrie a mock-renderer; výsledky GitHub Actions/Pages zatím nejsou potvrzené jako PASS.**

---

## Milovice RP 5.241 — auta NPC už nepřeskakují z konce jednosměrky na cizí ulici (21. 11. 2026)

Oprava napojení dopravy: dřívější systém na konci jednosměrné komunikace bez výjezdu přesměroval běžné NPC auto na libovolný úplně jiný segment z městské silniční sítě. Nově **každá další trasa musí skutečně geometricky navazovat** a respektovat směr jednosměrky. Když na konci jednosměrky navazující povolená trasa není, NPC zastaví. Neviditelné auto lze recyklovat na jiném původním povoleném úseku pouze při odstupu **více než 360 m od hráče i od všech aktivních technických kamer** pro staré a nové místo; v záběru nedochází k náhlému přeskoku. Dvousměrné slepé cesty zachovávají dosavadní otočení.

Změna pracuje výhradně se stávajícím grafem civilní NPC dopravy po OSM 5.240; tedy **žádná nová vymyšlená ulice, odbočka, chodník, zebra, značka, kolize ani úprava GPS**. Zůstává zachována požární přístupová komunikace u Italské [OSM 1272081401](https://www.openstreetmap.org/way/1272081401) mimo civilní routing. Původní 3D svět i hráčské ovládání zůstávají stejné.

Zdroj: `scripts/osm-traffic-continuity-5241.js` a `scripts/osm-traffic-continuity-5241.test.mjs`. V konzoli `window.__miloviceTrafficContinuityRuntime5241()` vrací počet zastavených koncových aut a recyklací mimo dohled. Kontrola `node scripts/dev-check.mjs italska` a workflow `italska-apartments-5235.yml` navazují na 5.240 i předchozí budovy; mobilní Chromium/SwiftShader 5.239 má dodatečnou kontrolu. **15 cílených kontrol logiky/napojení prošlo; GitHub Actions a Pages se zatím nepodařilo potvrdit jako PASS na nejnovější revizi.** Přímý technický pohled na Italskou: [otevřít kameru](https://foxey-cz.github.io/milovice-life-rp/?v=524100&streetAudit=italska-west-block-5239).

---

## Milovice RP 5.240 — Italská: správný přístup civilní dopravy na původních OSM cestách (21. 11. 2026)

Běžná auta NPC nyní respektují přístupová omezení původních mapovaných silnic: **motor_vehicle, vehicle, access** (například no, private, permit, destination) a výslovné service=emergency_access. Předchozí graf používal jen základní access a některé náhodně řízené automobily mohl směrovat na cesty, kde veřejný motorový provoz není povolen. **Mění se pouze civilní NPC routing**, nikoli samotné mapové silnice: hráč, povrchy, budovy, kolize a původní GPS zůstávají beze změny.

Konkrétní zdroj: [požární přístupová komunikace OSM 1272081401](https://www.openstreetmap.org/way/1272081401) u Italské (highway=service, motor_vehicle=permit, service=emergency_access, emergency=designated). Originální **9bodová GPS trasa, hash 01f91763 a délka 86,464 m** zůstávají součástí mapy, ale náhodná civilní auta ji nemají ve svém silničním grafu. Nejsou přidány nové silnice, chodníky, bariéry, značení, kolize ani požární auta. Jde o **OSM zdroj, ne fotoověření vzhledu**.

Zdrojové pojistky: scripts/osm-traffic-access-5240.js, scripts/osm-traffic-access-5240.test.mjs, window.__miloviceTrafficAccessRuntime5240() a rychlý příkaz node scripts/dev-check.mjs italska. Stávající mobilní Chromium/SwiftShader test bloku Italské 5.239 navíc kontroluje, že je původní cesta stále na mapě, ale není v civilním grafu. **CI a GitHub Pages této revize zatím nebyly potvrzené jako úspěšné.**

---

## Milovice RP 5.235 — Italská: dva velké obytné domy, 6 + 3 podlaží (21. 11. 2026)

Nové source-locked fasády na **dvou původních RÚIAN/OSM obytných domech** v okolí Italské. Nejde o nové domy ani nové zdi: pro skutečné [OSM 61979295](https://www.openstreetmap.org/way/61979295) jsou původně mapována **6 podlaží, 56 bytů**, RÚIAN **27222098**, 25 GPS uzlů, hash `ed941342`, půdorys přibližně **1178,715 m²**; pro [OSM 53865838](https://www.openstreetmap.org/way/53865838) jde o **3 podlaží, 33 bytů**, RÚIAN **26207796**, 19 uzlů, hash `91432581`, půdorys přibližně **1171,235 m²**. Přesné půdorysy a původní OSM počet podlaží se nemění.

`scripts/osm-italska-apartments-5235.js` kontroluje původní RÚIAN ID, úplné sady tagů, uzavření a všechny uzly GPS, výšku současného modelu, plochu a délky jedenácti vybraných **originálních fasádních hran**. Na již existujících stěnách vykreslí sdíleným 5.192 čtyřmateriálovým rendererem **198 + 90 = 288 odhadnutých modelových oken** na **6 + 5 vybraných dlouhých hranách**. Krátké půdorysné zářezy nejsou považovány za doložené otvory. Původní obecná náhodná okna a neověřené vstupy se u source-locked bloků již navíc **nevrství pod nový model**; stejné odstranění duplicit se týká i dřívějších ověřených bytových bloků 5.219/5.221/5.222. Nových fyzických budov, střech, průchodů, dveří, balkónů, kolizí, chodníků, cest a přesunů GPS **0**.

**Důležité:** RÚIAN/OSM dokládá **půdorys, počty podlaží a bytů**, nikoli skutečné rozložení oken, jejich počet, materiály/odstín fasády, délku říms či vchody. **288 oken je současný grafický model a není fotograficky doložený stav budovy.** Nejde o přenesenou fotografickou texturu nebo přesný digitální dvojník fasády.

Přímé technické pohledy: `?v=523500&streetAudit=italska-apartments-six-5235` z originálního OSM footway 1008670963 (heading 18° odhad) a `?v=523500&streetAudit=italska-apartments-three-5235` z originálního OSM footway 1272081410 (heading 207° odhad). `window.__miloviceItalskaApartmentsRuntime5235()` prověřuje oba objekty, skutečné 3D meshe, LOD a počet modelových oken. Zdrojové Node testy + regrese 5.234, mobilní Chrome/SwiftShader WebGL 6,5s LOD v `italska-apartments-5235.yml`, rychlá sada `node scripts/dev-check.mjs italska`. **OVĚŘENO PASS na herním commitu `6ce4cd8c`:** source-lock + skutečný mobilní Chromium/SwiftShader WebGL 6,5s LOD [run `44924800958`](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44924800958) SUCCESS, [hlavní CI `44924800624`](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44924800624) SUCCESS, [GitHub Pages build/deployment `44924799684`](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44924799684) SUCCESS.

---

## Milovice RP 5.234 — Italská: dva modeloví chodci na skutečných chodnících (21. 11. 2026)

Navazuje na již ověřenou souvislou pěší síť 5.233. **Ve hře se objevují dva další simulovaní chodci**, kteří se pravidelně otáčejí na dvou **původních OSM chodníkových úsecích**, aniž by vstupovali do obou původních **neoznačených přechodů**. První používá [OSM 1484073945](https://www.openstreetmap.org/way/1484073945) (původní délka **135,468 m**, 6 m rezerva na obou koncích, povrch v OSM neznámý), druhý pouze první část [OSM 1484073947](https://www.openstreetmap.org/way/1484073947) (**87,055 m** z celého 196,244m dlážděného chodníku; 4 m rezerva na obou koncích). Dohromady je pro pohyb NPC bezpečně použito **202,523 m**, nejde o nové 202metrové propojení nebo nově vytvořené chodníky. Postavy jsou **herní simulace, nikoli fotograficky zachycení skuteční obyvatelé**.

Nový `scripts/osm-italska-walkers-5234.js` fail-closed nejprve ověřuje původní 5.233 pěší síť, dva unikátní původní OSM ways s GPS hashi, přesné tagy, počet uzlů a délky. Každých nejvýše **0,7 m** podél celé zkrácené trasy přepočítává odstup od **všech zdrojových os vozovek** a mapovaných budov. První úsek vyžaduje minimálně 6,2 m od silničních os a 4,2 m od staveb; druhý 6,5 m a 5,2 m. Nesplní-li se zdrojové či kolizní podmínky, oba noví chodci se vůbec nevytvoří. Využívá se již existující herní systém postav, chůze a vzdálenostního LOD. **Žádné nové silnice, chodníky, zebry, kolize, domy, přechody ani mobiliář.** Skutečná textura neotagovaného chodníku ani podoba jednotlivých lidí nebyly fotoověřeny.

Technický pohled `?v=523400&streetAudit=italska-walkers-5234` (kamera z originálního GPS uzlu `50.2264572,14.8767305`, směr 32° je pouze odhad, není panorama); audit `window.__miloviceItalskaWalkersRuntime5234()` kontroluje, že oba NPC mají skutečné pozice na původních chodnících a zůstávají viditelní po 6,5 s LOD. Node fail-closed / regrese 5.233 a vlastní mobilní Chromium/SwiftShader WebGL workflow `italska-walkers-5234.yml`; rychlá sada `node scripts/dev-check.mjs italska`. **OVĚŘENO PASS** 5.234 na commitu ef80b838: [mobile WebGL run 44924075559](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44924075559), [hlavní CI 44924075577](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44924075577) a [Pages 44924074878](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44924074878) SUCCESS.

---

## Milovice RP 5.233 — Italská: 534,368 m skutečně mapovaných navazujících chodníků a přechodů (21. 11. 2026)

Navazuje na skutečný RÚIAN dům s `roof:shape=flat` z 5.232 a sjednocuje **celý původní pěší řetězec kolem Italské**, nikoli jen jednotlivý detail. Originální OpenStreetMap obsahuje pět souvislých `highway=footway`:
[1484073943](https://www.openstreetmap.org/way/1484073943) (**183,879 m / 6 úseků**, `footway=sidewalk`, skutečný povrch neznámý), [1484073944](https://www.openstreetmap.org/way/1484073944) (**9,574 m / 2 úseky**, `crossing=unmarked`, `crossing:markings=no`, bez povrchového tagu), [1484073945](https://www.openstreetmap.org/way/1484073945) (**135,468 m / 1 úsek**, `footway=sidewalk`, povrch neznámý), [1484073946](https://www.openstreetmap.org/way/1484073946) (**9,203 m / 2 úseky**, výslovně `crossing=unmarked`, `crossing:markings=no`, `surface=asphalt`), [1484073947](https://www.openstreetmap.org/way/1484073947) (**196,244 m / 3 úseky**, výslovně `surface=paving_stones`). **534,368 m / 14 původních úseků**, čtyři přesně totožné GPS spoje; všechny původní OSM souřadnice zůstaly bez změny.

Nové `scripts/osm-italska-walk-chain-5233.js` důsledně ověřuje GPS hashe **všech pěti pěších ways** a dvou původních silničních kotev [Italská 295391355](https://www.openstreetmap.org/way/295391355) / [Italská 8585601](https://www.openstreetmap.org/way/8585601) včetně dvou přímých originálních GPS spojů silnice a přechodu. Vizualizace na již existujících pěších pásech používá pro 1484073943/3945 *neutrální modelový odstín bez tvrzení o skutečném povrchu*, pro 1484073947 sdílenou modelovou texturu zdrojově doložených dlažebních kostek. Dva opravdu **neoznačené** přechody se nemění na zebry; jejich původní renderer nad vozovkami ponechává ochranné ořezávání bez vymyšleného značení. Vzor a barva dlažby nejsou doložené fotografií.

Přímý kontrolní pohled: `?v=523300&streetAudit=italska-walk-chain-5233`, ze skutečného zdrojového GPS uzlu `50.2264572,14.8767305` na pěší síti, **heading 32° je odhad a není panorama**. `window.__miloviceItalskaWalkChainRuntime5233()` počítá všech 14 mapových segmentů zvlášť od skutečně bezpečných vykreslených dílů a důvodů clip/deduplikace. Původní GPS, šířky, vozovky, pravidla provozu, parkování, kolize, domy, chodníkové trasy a pěší přechody beze změny. **0 nových zebry, 0 nových tras, 0 nových fyzických kolizí.** Source-lock Node + předchozí regrese 5.232, skutečný mobilní WebGL/6,5s LOD v `italska-walk-chain-5233.yml`; rychlá sada `node scripts/dev-check.mjs italska`. **OVĚŘENO PASS** v mobilním WebGL [run 44922933027](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44922933027), [hlavní CI 44922933026](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44922933026) a [GitHub Pages 44922932455](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44922932455) na commitu f2831ede.

---

## Milovice RP 5.232 — Italská: skutečný OSM tvar ploché střechy (21. 11. 2026)

Na původním OSM/RÚIAN domě [1112779894](https://www.openstreetmap.org/way/1112779894) na ulici Italská je explicitní **`roof:shape=flat`**, dále **2 podlaží / 1 byt**, RÚIAN `108055060`; původní 5 GPS bodů, FNV `e0c358f5`, mapovaný půdorys přibližně **169,226 m²**. Dřívější obecné modelování mohlo tomuto domu přidělit odhadnutou šikmou střechu. **5.232 nyní upřednostní skutečný OSM typ ploché střechy**, pouze pro tento přesně ověřený zdroj, a použije stávající původní plochý střešní cap (ShapeGeometry); nevytváří nový střešní objem ani kolize.

`scripts/osm-italska-flat-roof-5232.js` fail-closed ověřuje přesné OSM tagy, počet a uzavření uzlů, GPS hash i přibližnou plochu. Ručně či fotograficky schválená architektura má přednost a není přepsána. **OSM stavba, půdorys, původní stěny, výška modelu, cesta, chodník, okna, dveře, vozidla a hráčské kolize beze změny**. Tvar `flat` je mapově doložený; **reálná výška, barvy, detaily fasády ani střešní vybavení nejsou fotograficky ověřené**.

Přímý technický pohled: `?v=523200&streetAudit=italska-flat-roof-5232` z existujícího OSM pěšího uzlu **50.2264572, 14.8767305**, odhad heading 18° (není shoda s panoramatem). Audit `window.__miloviceItalskaFlatRoofRuntime5232()` kontroluje skutečné vykreslení existující ploché střechy včetně mobilního LOD. Zdrojový Node test včetně mutací GPS/tagů, předchozí regrese 5.231 a samostatný mobilní Chromium/SwiftShader WebGL + 6,5s LOD workflow `italska-flat-roof-5232.yml`. Nový test je i v `node scripts/dev-check.mjs budovy`. **Při implementaci CI a nasazení teprve čekají na ověření.**

---

## Milovice RP 5.231 — 206,33 m² původních travnatých dvorů Lesní / Višňová (21. 11. 2026)

Původní OSM `landuse=grass` v okolí poslední pěší sítě doplňuje trojice skutečných zdrojových polygonů: [1460019789](https://www.openstreetmap.org/way/1460019789) (**69,50 m²**, 7 GPS uzlů, hash `b977361a`), [1460019790](https://www.openstreetmap.org/way/1460019790) (**53,22 m²**, 5 uzlů, hash `70d93254`) a [1460019792](https://www.openstreetmap.org/way/1460019792) (**83,61 m²**, 7 uzlů, hash `e17fd422`). Celkem **206,33 m²** stávající zeleně. Mapový půdorys / typ plochy jsou ze zdrojových OSM souřadnic; přesný travní porost, druh, výška a poloha jednotlivých stébel **nejsou fotoověřené**.

Nová scéna pouze jemně doplňuje 3D instancovaná stébla **UVNITŘ původních travnatých polygonů** a používá současnou GPU/LOD optimalizaci. Nezdvojuje původní travnaté plochy ani neodvozuje nové hranice; reálné OSM vozovky, **pěší cesty**, budovy a vodní prvky jsou prostorovými bezpečnostními zábranami, které nepovolí stébla přes překážky. Zamezuje i dvojímu blízkému detailu předchozích zelených polygonů v jiných verzích. Zdrojový modul `scripts/osm-lesni-courtyard-lawns-5231.js` fail-closed kontroluje 3 původní polygony, přesné GPS hashe, počet uzlů, typ `landuse`, uzavření a skutečnou plochu. **Žádné nové stromy, keře, zahrádky, silnice, chodníky, parkoviště, kolize ani mobiliář.**

Přímý technický pohled: `?v=523100&streetAudit=lesni-courtyard-lawns-5231` (GPS zdroj 50.2295458,14.8692602, odhad azimutu 280°; není panorama). Runtime `window.__miloviceLesniCourtyardLawnsRuntime5231()` hlídá 3 zdrojová ID, opravdu vykreslené instance, připojené a viditelné 3D meshe po 6,5 sekundách LOD. Node fail-closed + regrese 5.230, mobilní Chromium/SwiftShader WebGL, workflow `lesni-courtyard-lawns-5231.yml`, dev-check `sportovni`. **OVĚŘENO PASS na herním commitu `8faac8e6`:** [zdrojové Node testy, regrese 5.230 a skutečný mobilní Chromium/SwiftShader WebGL s viditelnou instancovanou trávou po 6,5 s LOD (run `44919578926`)](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44919578926) **SUCCESS**. [Celoprojektová CI `44919579002`](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44919579002) **SUCCESS**. [GitHub Pages build a deploy `44919579553`](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44919579553) **SUCCESS** na témže herním commitu. První průběžný pokus o test selhal na zastaralém kontrolním řetězci po opravě předávání zdrojové geometrie; konečná herní verze i test to již obsahují správně. Tato poslední dokumentační revize spustí vlastní Pages workflow, jehož úspěch zatím není předem potvrzen.

---

## Milovice RP 5.230 — 111,298 m skutečných pěších propojení Sportovní / Lesní (21. 11. 2026)

Nový zdrojově uzamčený celek tvoří **tři původní OSM pěší trasy**: [`1037952219`](https://www.openstreetmap.org/way/1037952219) (6 uzlů / 5 dílů / **32,250 m**, hash `f4a36b91`), [`1352859039`](https://www.openstreetmap.org/way/1352859039) (8 uzlů / 7 dílů / **51,972 m**, hash `bba90a45`) a [`1460019771`](https://www.openstreetmap.org/way/1460019771) (2 uzly / 1 díl / **27,076 m**, hash `8859fb77`). Dohromady **111,298 m / 13 původních úseků**. Jsou to zdrojové `highway=footway` bez `surface` tagu. Jejich skutečný povrch **není fotograficky ověřen**, proto používají pouze neutrální herní materiál `visnova-footway-model` na již existujících 3D pěších pruzích. Model sám bezpečně ořezává místa, kde by zasahovaly do vozovek, původní GPS zůstávají nedotčené.

**Pět přesných původních spojů:** severní `1352859039` a centrální `1037952219` se potkávají v `50.2300450,14.8697026`, jižní odbočka `1460019771` se připojuje v `50.2299933,14.8698498`. Síť navazuje přímo na stávající mapové vozovky [Sportovní `1331897633`](https://www.openstreetmap.org/way/1331897633) v `50.2303269,14.8692997`, [obytnou komunikaci `1037952217`](https://www.openstreetmap.org/way/1037952217) v `50.2297501,14.8698445` a [servisní cestu `1037952218`](https://www.openstreetmap.org/way/1037952218) v `50.2299444,14.8700203`. Jde o **skutečné zdrojové souřadnice**, nikoliv automaticky vytvořený přechod pro chodce nebo novou spojovací cestu.

`scripts/osm-sportovni-footway-network-5230.js` fail-closed kontroluje šest původních OSM ways, hashe, tagy, počet uzlů, rozměry i souřadnice všech pěti napojení. Veškeré vozovky si zachovávají dopravní pravidla. Herní `window.__miloviceSportovniFootwayRuntime5230()` odděleně auditně zaznamenává **13 původních mapových úseků** a počet **skutečně bezpečně vykreslených ořezaných 3D dílů**, včetně důvodů pro vynechání. Žádné umělé cesty, zebry, budovy, lampy, kolize, vchody, obrubníky ani parkovací objekty. Přímý technický pohled `?v=523000&streetAudit=sportovni-footway-network-5230` stojí na původním GPS uzlu `50.2300450,14.8697026`; azimut 190° je **pouze odhad**, NENÍ panorama.

Přidané fail-closed Node source testy, regresní 5.229, skutečný mobilní Chromium/SwiftShader WebGL + kontrola po 6,5 s LOD v `sportovni-footway-network-5230.yml` a registrace `scripts/dev-check.mjs sportovni`. **OVĚŘENO PASS na herním commitu `2552f279`:** zdrojové Node testy tří pěších tras/šesti OSM ways + regresní 5.229 a skutečný mobilní Chromium/SwiftShader WebGL s 6,5 s LOD v [run `44918269046`](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44918269046) **SUCCESS**. [Hlavní projektová CI `44918269016`](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44918269016) **SUCCESS**. [GitHub Pages build a nasazení `44918268591`](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44918268591) **SUCCESS** na stejném herním commitu. První mobilní běh na `0610ee5f` selhal pouze kvůli jednomu špatně zapsanému testovacímu `assert.equal`, nikoliv kvůli geometrii nebo JavaScriptu ve hře; opraveno v `2552f279`. Tato poslední dokumentační revize má vlastní Pages build, jehož úspěch není předem zaručen.

---

## Milovice RP 5.229 — dvě původní pěší odbočky Lesní u zdrojového přechodu (21. 11. 2026)

Z OSM regionu Mladá přibylo modelově viditelné napojení dvou **již mapovaných** pěších tras: [1460019794](https://www.openstreetmap.org/way/1460019794) s 4 uzly / 3 úseky / **49,803 m** (hash `e14dd8e8`, `footway=sidewalk`) a [1460019793](https://www.openstreetmap.org/way/1460019793) se 2 uzly / 1 úsekem / **34,433 m** (hash `800597e1`). Sdílí přesný původní GPS uzel `50.2294180,14.8700503`. Obě trasy jsou **bez původního `surface` tagu**, proto se jejich 4 původní díly vizuálně zobrazují jen neutrálním modelem `visnova-footway-model`, a to pouze v místech bezpečných vůči modelovým vozovkám. Nejde o fotoověření skutečného povrchu.

Hlavní footway dále přesně končí v `50.2292850,14.8700204`, kde se potkává s již existujícími [značeným přechodem 1057549995](https://www.openstreetmap.org/way/1057549995) (`crossing=marked`, `crossing:markings=yes`, 9,413 m / 2 díly) a [chodníkem 1057549996](https://www.openstreetmap.org/way/1057549996) z 5.227 (41,608 m / 4 díly). Součet těchto **čtyř původních OSM cest**: **135,257 m / 10 zdrojových segmentů**, nově vizuálně upravované pouze dvě první o **84,236 m / 4 mapových dílech**. Dřívější přechod není znovu malován, zachovává vlastní původní značení a staré chodníky nejsou duplikovány.

Nový fail-closed `scripts/osm-lesni-north-branches-5229.js` přesně zamyká čtyři OSM ways, souřadnice a GPS hashe, délky a tagy. Renderer má per-edge audit `window.__miloviceLesniNorthRuntime5229()`: odděluje zdrojové čtyři úseky od skutečně bezpečně vykreslených klipovaných částí (žádné zásahy do vozovek). Technická kamera `?v=522900&streetAudit=lesni-north-branches-5229` používá skutečný uzel 50.229418,14.8700503 a odhadovaný azimut 350° (NENÍ panorama). **Nula nových silnic, pěších tras, přechodů, pruhů, kolizí, stromů, vchodů, lamp či budov.**

Přidány Node fail-closed/regresní 5.228 testy, mobilní Chromium/SwiftShader WebGL + 6,5s LOD workflow `lesni-north-branches-5229.yml` a registrace dev-check `sportovni`. **OVĚŘENO PASS na herním commitu `e28a0357`:** [5.229 originální OSM GPS Node + regresní 5.228 + skutečný mobilní Chromium/SwiftShader WebGL 6,5s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44917452653) **SUCCESS**. [Hlavní CI](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44917452173) **SUCCESS**. [5.228 bezpečné vykreslení 10 zdrojových úseků s 6 skutečnými 3D díly](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44917452691) **SUCCESS**. GitHub Pages nasazení 5.229 zatím neověřeno.

---

## Milovice RP 5.228 — 199 m autentického chodníku Višňová a dvě původní dlážděná napojení (21. 11. 2026)

V původním uloženém OpenStreetMap exportu je [OSM chodník 1044078118](https://www.openstreetmap.org/way/1044078118) s přesnými **11 původními GPS uzly / 10 dílčími 3D úseky / 199,405 m**, hash `26506719`, původními tagy `highway=footway`, `footway=sidewalk`, `lit=yes` a **bez záznamu `surface`**. Verze 5.228 přebarvuje pouze všech deset již existujících mapových úseků (vykreslování průběžně bezpečně ořezává kolize s vozovkami) sdíleným neutrálním herním materiálem `visnova-footway-model`; skutečný povrch, barva ani vzor **NEJSOU fotograficky doloženy**. Původní GPS, šířka chodníku a veškeré kolize se nemění.

Přesné mapované napojení **na začátku 50.2290044,14.8702188** je stejný GPS bod jako poslední bod původního [301,172m chodníku 1005977571](https://www.openstreetmap.org/way/1005977571) (`surface=paving_stones`, 7 uzlů, 6 segmentů, hash `263e12b3`). Druhé **původní spojení na uzlu index 4 v GPS 50.2289889,14.8692466** je přesně stejné jako konec [32,073m dlážděného footway 1044078121](https://www.openstreetmap.org/way/1044078121) (4 uzly, 3 segmenty, `surface=paving_stones`, hash `4dc63734`). Celkem tato existující trojice mapových cest tvoří **532,650 m / 19 zdrojových segmentů** v jedné mapově napojené síti. Obě dlážděné cesty už byly řešeny v 5.220/5.204 a dostávají **nulové duplicitní přebarvení** v této verzi. Skutečná textura originálních dlaždic nebyla fotoověřena.

Nový `scripts/osm-visnova-long-sidewalk-5228.js` je fail-closed zdrojová kontrola všech tří původních OSM ways: přesný počet a pořadí GPS bodů, mapový hash, geometrii, source surface a dvě totožné souřadnice původních spojení. **Nepřibývá žádná nová cesta, chodecké propojení, obrubník, zebra, přechod, strom, světlo, budova, vchod, parkovací plocha nebo collider.** Audit `window.__miloviceVisnovaLongRuntime5228()` kontroluje všechna tři původní ID, deset mapových úseků z nichž poslední mobilní audit vykreslil 6 bezpečných 3D částí a načtení obou už existujících dlažebních částí. Technická kamera `?v=522800&streetAudit=visnova-long-sidewalk-5228` stojí na originálním uzlu GPS 50.2288859,14.8687264, azimut 270° je odhad, ne foto orientace.

Doplněny Node fail-closed a regresní 5.227 testy, skutečný mobilní Chromium/SwiftShader WebGL test s 6,5s LOD, samostatná GitHub Actions CI `visnova-long-sidewalk-5228.yml`, registrace do `scripts/dev-check.mjs sportovni`. **Výsledek opravy:** [Mobile WebGL test 5.228](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44917238645) **SUCCESS** po opravě falešného předpokladu 10 vykreslených místo 10 zdrojových segmentů; skutečný renderer bezpečně vykreslí 6 dílů a ostatní ořízne nebo deduplikuje. Opakovaně [PASS na herním commitu 5.229](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44917452691). Hlavní CI 5.229 **SUCCESS**, GitHub Pages této herní revize zatím není potvrzené.

---

## Milovice RP 5.227 — původní pěší spojka mezi dvěma přechody (21. 11. 2026)

Navazující skutečná mapovaná trasa [OSM 1057549996](https://www.openstreetmap.org/way/1057549996) má **5 původních GPS uzlů / 4 segmenty / 41,608 m** (hash `53198096`) a v uložené mapě tagy `highway=footway`, `footway=sidewalk`, `lit=yes`. **Chybí jí údaj `surface`**, proto dostává výhradně neutrální odhadovaný herní materiál `visnova-footway-model` (není to potvrzený beton ani dlažba). Skutečné mapové souřadnice, původní vykreslované délky a šířka zůstaly beze změn.

Na západě její původní GPS uzel **50.2292850,14.8700204** přímo odpovídá konci OSM přechodu [1057549995](https://www.openstreetmap.org/way/1057549995), jehož tagy jsou **`crossing=marked`, `crossing:markings=yes`**. Na východě **50.2292113,14.8695157** přímo spojuje konec jiného mapovaného [přechodu 1044078120](https://www.openstreetmap.org/way/1044078120) (`crossing=uncontrolled`, `crossing:markings=zebra`, `crossing:island=yes`) a začátek [dlážděného chodníku 1314665579](https://www.openstreetmap.org/way/1314665579) (`surface=paving_stones`, 18 původních uzlů, asi 368,001 m). Tyto **dva různé zdrojové typy přechodu** se nesmějí zaměnit a nepřidáváme nový přechod ani malované pruhy. Ani jejich skutečný vzhled nebyl ověřen fotografií.

Nový `scripts/osm-lesni-east-link-5227.js` fail-closed uzamyká všechny **čtyři původní OSM ways, GPS hashe, přesné endpointy, délky, původní dopravní tagy a odlišné značení přechodů**. Herní renderer přemaluje **pouze existující 4 díly** nedoloženého povrchu chodníku; nezasahuje do přechodů ani původního zdrojově dlážděného chodníku. Nepřibývá žádná pěší trasa, zebra, kolize, obrubník, budova, strom, lampy ani mobiliář. Audit `window.__miloviceLesniEastRuntime5227()` kontroluje 4 načtené originální cesty, přesně 4 vykreslené segmenty a sdílený modelový materiál. Přímá kamera: `?v=522700&streetAudit=lesni-east-link-5227`, GPS 50.2292341,14.8699839; azimut 260° je technický odhad, nikoli panorama.

Doplněny zdrojové regresní Node testy, mobilní Chromium/SwiftShader WebGL test + 6,5s LOD, workflow `lesni-east-link-5227.yml` a registrace do `scripts/dev-check.mjs sportovni`. **Výsledek automatizované CI/Pages kontroly zatím neověřen; úspěch nelze tvrdit před dokončením GitHub Actions.**

---

## Milovice RP 5.226 — originální pěší odbočky Lesní: přímo na dva uzly vozovky (21. 11. 2026)

Další **skutečné původní pěší propojení** navazující na 5.225 a 5.220. Hlavní pěší trasa [OSM `1352859035`](https://www.openstreetmap.org/way/1352859035) má 5 původních GPS uzlů, hash `bb42422e`, celkem **49,415 m / 4 segmenty**, `highway=footway`, `lit=yes` (bez údaje `surface`). Koncový GPS uzel `50.2291300,14.8703439` má **přesně stejnou GPS** jako existující [dlažební chodník `1057549994`](https://www.openstreetmap.org/way/1057549994) (70,465 m / 5 segmentů, prokazatelný `surface=paving_stones`). Dvě další mapované pěší spojky se od hlavní trasy oddělují v jejích skutečných uzlech a končí přímo na stávající vozovce [OSM `1044078106`](https://www.openstreetmap.org/way/1044078106): [`1352859040`](https://www.openstreetmap.org/way/1352859040) má **3,710 m**, [`1352859041`](https://www.openstreetmap.org/way/1352859041) má **3,430 m**. Dohromady síť obsahuje **127,020 m / 11 původních zdrojových pěších segmentů**, z toho **56,555 m / 6 segmentů** této verze dostává neutrální modelový povrch.

**Fakta vs odhad:** u všech tří nově upravovaných `highway=footway` chybí mapový údaj `surface`. Jejich nový vizuální povrch `visnova-footway-model` je proto **NEUTRÁLNÍ HERNI ODHAD**, nikoli potvrzení betonové či dlážděné skutečnosti. Původní `1057549994` si zachovává zdrojově doloženou dlažbu. Originální vozovka je `highway=residential`, přístupové pěší odbočky nejsou automaticky mapované zebry: **žádný přechod, značení, nová pěší cesta, vchod, silnice, stromy, lampy, obrubníky ani kolize nepřibývají**.

`scripts/osm-lesni-footway-branches-5226.js` fail-closed zamyká **všech pět skutečných OSM ways** (3 footways + 1 paved footway + 1 residential street), přesné GPS hashe, souřadnice napojení a původní tagy. U jediného jednoznačného původního ohybu hlavní trasy na zdrojovém uzlu index 3 je možné přidat **až jeden malý 3D trojúhelník** vyplňující mezeru mezi původními herními pěšími pásy, jen když `planMladaFootwayCorners` potvrdí volno vůči mapované vozovce i budovám. Je to 3D výplň, **nikoliv nová cesta**; pokud koliduje, nevykreslí se. Přidává maximálně 1 GPU mesh. Všechna původní data a délky zůstávají.

Auditní herní kamera `?v=522600&streetAudit=lesni-footway-branches-5226` stojí na skutečném uzlu `50.2294007,14.8705153` (technický směr 305°, nikoliv mapa panorama). Runtime `window.__miloviceLesniBranchesRuntime5226()` ověřuje původní tři chodecké cesty, stav renderovaných úseků, zdrojovou dlažbu, případný bezpečně doplněný roh a 6,5s LOD. Nové Node testy + regresní 5.225, skutečný mobilní Chromium/SwiftShader WebGL, samostatná CI `lesni-footway-branches-5226.yml` i registrace v `scripts/dev-check.mjs sportovni`. **OVĚŘENO PASS na herním commitu `aedaac4`:** [Node původních OSM GPS souřadnic a pěti ways, regresní 5.225 + reálný mobilní Chromium/SwiftShader WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44913268648) **SUCCESS** — zdrojově ukotvené pěší odbočky ke dvěma bodům vozovky, 127,020 m / 11 původních segmentů, zdrojová mapa beze změny, vhodný modelový neutrální povrch a maximálně jeden clearance-ověřený doplňovací trojúhelník. V mobilním prohlížeči jsou chodníkové pásy skutečně vykreslené a přetrvají 6,5 s / LOD. [Hlavní celoprojektová CI](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44913268709) **SUCCESS**. [GitHub Pages build a skutečné nasazení](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44913268108) **SUCCESS** na stejném herním commitu `aedaac4`. Po této poslední dokumentační revizi poběží vlastní Pages build; jeho výsledek není předem jistý.

---

## Milovice RP 5.225 — 165 m skutečně propojených chodníků Lesní / Armádní (21. 11. 2026)

Další díl celé ulice, tentokrát **ověřená originální pěší síť místo dalších schematických fasád**. Čtyři původní OSM ways tvoří souvislé OSM spojení v přesně doložených třech GPS uzlech: [dlouhý chodník 1460019797](https://www.openstreetmap.org/way/1460019797) (**78,524 m**, 4 uzly, hash `820c13b1`), [neoznačený přechod 1460019796](https://www.openstreetmap.org/way/1460019796) (**9,063 m**, 3 uzly, hash `b29a84ad`, explicitně `crossing=unmarked`, `crossing:markings=no`), [krátký chodník 1460019795](https://www.openstreetmap.org/way/1460019795) (**7,437 m**, 2 uzly, hash `3432210d`) a původní už upravený [dlážděný chodník 1057549994](https://www.openstreetmap.org/way/1057549994) (**70,465 m**, 6 uzlů, hash `02767378`, `surface=paving_stones`). Dohromady **165,489 m v 11 zdrojových segmentech**; žádná trasa nebyla prodloužena ani ručně spojena.

**Pozor na povrchy:** právě dva nově řešené chodníky `1460019797` a `1460019795` **NEMAJÍ v uloženém OSM údaj `surface`**. Proto používají **pouze neutrální odhadovaný herní vzhled** sdíleným materiálem `visnova-footway-model`, nikoli tvrzení o skutečné dlažbě. Dříve upravený `1057549994` si zachovává naopak **zdrojově doložené** `paving_stones` a svůj vlastní `visnova-tagged-paving-stones` materiál. OSM přechod **zůstává BEZ nově vytvořené zebry**. Nula nových pěších cest, přechodů, silnic, parkování, značek, lamp, stromů, kolizí i úprav šířek.

`scripts/osm-lesni-walk-chain-5225.js` je fail-closed parser **všech čtyř** původních geometrií, délky, tagů, zamčených hashů i tří skutečně identických endpointů. `window.__miloviceLesniWalkChainRuntime5225()` kontroluje v běžící hře nalezení všech čtyř mapovaných cest, neutrální vykreslení původních chodníků, zdrojový stav neoznačeného přechodu a existenci již doloženého dlážděného kusu z 5.220. Technická kamera `?v=522500&streetAudit=lesni-walk-chain-5225` stojí přímo na originálním OSM bodu neoznačeného přechodu `50.2294249,14.8701763`; azimut 12° je pouze **technický odhad, nikoliv panorama**.

Nové soubory `scripts/osm-lesni-walk-chain-5225.js`, `scripts/osm-lesni-walk-chain-5225.test.mjs`, `scripts/osm-lesni-walk-chain-webgl-5225.mjs`, `.github/workflows/lesni-walk-chain-5225.yml`; plus přidání do `scripts/dev-check.mjs sportovni` a regresní test verze 5.224. **OVĚŘENO PASS pro herní commit `deb557a`:** [originální čtyřcestný Node source-lock + regresní 5.224 + skutečné mobilní Chromium/SwiftShader WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44912460321) **SUCCESS** — 165,489 m / 11 původních OSM segmentů, dva původní nezdokumentovaně povrchové chodníky v neutrálním modelovém materiálu, původní `crossing=unmarked` a `crossing:markings=no`, žádná nově namalovaná zebra ani nová cesta, kontrola po 6,5 sekundách s LOD. [Hlavní celoprojektová CI validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44912460422) **SUCCESS**. [Skutečný GitHub Pages build/deployment](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44912459255) **SUCCESS**, vše na herním commitu `deb557a`. Tento závěrečný dokumentační commit má svůj další samostatný Pages build, který není předem ověřen.

---

## Milovice RP 5.224 — skutečně propojených 334 m dlážděných komunikací Lesní (21. 11. 2026)

Na původní 293,563metrovou obytnou ulici **[OSM Lesní 83026442](https://www.openstreetmap.org/way/83026442)** z 5.223 ve skutečných OSM datech přesně navazuje **[obslužná komunikace 1282136966](https://www.openstreetmap.org/way/1282136966)**: sdílený **originální GPS uzel `50.2309313,14.8734086`** je posledním bodem OBOU mapových ways (nikoli domyšleným spojovacím úsekem). Servisní komunikace má své 3 původní body, hash `90818fe3`, **2 segmenty / cca 40,007 m**, explicitní tagy `highway=service`, `surface=paving_stones` a **`vehicle=destination`**. Předchozí ulice má jiné zdrojové pravidlo **`motor_vehicle=destination`** a třídu **`living_street`**; tyto skutečné rozdíly se nemění ani neslučují. Součet zdrojových komunikací je **11 segmentů / cca 333,570 m**, bez jediné nové cesty.

Zdrojový fail-closed modul `scripts/osm-lesni-paved-service-spur-5224.js` ověřuje **OBĚ** původní polylines, hash, GPS napojení, délky, obě dopravní omezení a tag `surface=paving_stones`. Na již existujících dvou 3D dílech obslužné komunikace se mění **pouze sdílený modelový GPU materiál `visnova-tagged-paving-stones`** z 5.204/5.223, aby navazoval vzhledem na původní Lesní. Nevyrábí se žádný spojovací pás, křižovatka, obrubník, pěší chodník, parkovací místo, strom, budova ani kolize. Původní souřadnice, šířky, vlastnictví komunikace a oba odlišné režimy `vehicle` a `motor_vehicle` zůstávají. **Odstín, formát kostek a vzor dlažby nejsou fotograficky doloženy.**

Kontrolní pohled `?v=522400&streetAudit=lesni-service-spur-5224` je přímo na původním prostředním uzlu `50.2310518,14.8735169`, heading 220° je **jen technický odhad**, NENÍ panorama. Runtime `window.__miloviceLesniServiceSpurRuntime5224()` současně kontroluje 2 skutečně vykreslené nové staré servisní segmenty, 9 původních 5.223 segmentů, shodný materiál, načtenou oblast a přímý reálný OSM spoj. Nové Node + reálný mobilní Chromium/SwiftShader WebGL testy a samostatná GitHub Actions pipeline `.github/workflows/lesni-paved-service-spur-5224.yml`; regresní 5.223. Přidáno do `scripts/dev-check.mjs sportovni`. **OVĚŘENO PASS pro zdrojový commit `ad96b44`:** [Node source-lock 5.224, regresní 5.223 a skutečný mobilní Chromium/SwiftShader WebGL test](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44911710650) **SUCCESS**; původní 2 source-segmenty service road spolu s 9 původními Lesní, přesný společný GPS uzel a stejný modelový GPU materiál zůstaly aktivní i po 6,5 s a LOD. [Hlavní celoprojektová CI validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44911710657) **SUCCESS**. [Skutečné GitHub Pages nasazení](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44911709272) **SUCCESS** na herním commitu `ad96b44`. Tato závěrečná aktualizace dokumentace vytvoří vlastní další Pages build, jeho stav se nedá předpovědět.

---

## Milovice RP 5.223 — původní 294metrová dlážděná obytná ulice Lesní (21. 11. 2026)

Pokračování skutečné uliční sítě kolem předchozích RÚIAN obytných domů. V uloženém OSM exportu je **[Lesní way 83026442](https://www.openstreetmap.org/way/83026442)**, přesně původní **10bodová** polyline, hash `9cc757ea`, 9 segmentů, geometrická délka přibližně **293,563 m**, s tagy **`highway=living_street`**, **`name=Lesní`**, **`surface=paving_stones`**, **`motor_vehicle=destination`**. OSM prokazuje druh povrchu a pravidlo přístupu, nikoliv fotografickou barvu, vzor a výšku dlažby.

Nynější 3D model již správnou silnici měl; dosud ale obecný výběr mapového materiálu nedával tomuto konkrétnímu zdrojově doloženému úseku návazný jednotný materiál z předchozích úprav Višňové. Verze 5.223 používá na **všech původních devíti herních segmentech** už existující **jediný modelový `visnova-tagged-paving-stones`**, žádná další textura nebo 3D objekt. Zůstávají beze změn původní GPS uzly, orientace a délky, modelové šířky vozovky, herní doprava i originální tag `motor_vehicle=destination`. Žádná nová odbočka, chodník, obrubník, parkoviště, dopravní značení, most, strom, budova ani kolize.

Samostatný fail-closed planner `scripts/osm-lesni-paved-living-street-5223.js` vyžaduje přesné OSM ID, oblast Mladá, všechny 4 zdrojové tagy, GPS hash, 10 uzlů, 9 správných segmentů a celkovou délku. Audit `window.__miloviceLesniPavedStreetRuntime5223()` ověřuje 9 opravdu překreslených mapových segmentů, společný GPU materiál a stav oblasti. Kontrolní pohled `?v=522300&streetAudit=lesni-paved-living-street-5223` používá původní OSM uzel `50.2297847,14.8727618`, směr 65° je **pouze technický odhad**, nikoliv fotografie nebo panorama.

Přibyl Node test, regresní test předchozí verze 5.222, skutečný mobilní Chromium/SwiftShader WebGL test a samostatná GitHub Actions pipeline `.github/workflows/lesni-paved-living-street-5223.yml`. **OVĚŘENO PASS pro kódový commit `db735e8`:** [source-lock Node + regresní 5.222 + reálné mobilní Chromium/SwiftShader WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44910344496) = **SUCCESS**; v běžící mobilní hře bylo vykresleno všech **9 původních segmentů / cca 293,563 m** sdíleným dlažebním materiálem, audit zůstal připravený i po 6,5 s a LOD bez JS chyb. [Celoprojektová CI validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44910344465) = **SUCCESS**. [GitHub Pages build a nasazení](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44910343546) = **SUCCESS** rovněž na herním commitu `db735e8`. Tento pozdější dokumentační commit vytvoří vlastní Pages běh; jeho stav nelze předem prohlásit za PASS.

---

## Milovice RP 5.222 — dva navazující původní bytové domy v prostoru Lesní / Višňová (21. 11. 2026)

Další souvislá část skutečné zástavby u původní obslužné komunikace [OSM 1049828501](https://www.openstreetmap.org/way/1049828501) v oblasti Lesní: **[RÚIAN/OSM 53866101](https://www.openstreetmap.org/way/53866101)** (RÚIAN `25789848`, mapovaná **2 podlaží / 12 bytů**, 13 originálních uzlů, GPS hash `88bbda35`, původní obrys cca 337,47 m²) a **[RÚIAN/OSM 194679566](https://www.openstreetmap.org/way/194679566)** (RÚIAN `27382141`, mapovaná **4 podlaží / 26 bytů**, 29 originálních uzlů včetně malých výstupků, GPS hash `88a04945`, původní obrys cca 583,83 m²). Všechny původní RÚIAN/OSM uzly, všechny délky půdorysných hran, `source=cuzk:ruian`, původní data, podlaží, počet bytů a celý polygon kontroluje fail-closed modul `scripts/osm-lesni-courtyard-blocks-5222.js`.

Na stávající 3D budovy se přidává **pouze nezávislý schematický model fasády**, nikoli dva nové domy. Pět delších původních fasád prvního domu dostane **38 odhadovaných oken**, u druhého pět dlouhých obvodových stran dostane **68 odhadovaných oken**. Krátké skutečné výklenky z 13/29uzlového RÚIAN obrysu zůstanou bez vymyšleného prosklení. Již otestovaný čtyřmesh renderer 5.192 generuje dohromady **106 modelových oken, 10 fasádních hran, 40 soklových hran, 8 3D meshů a 1564 trojúhelníků**. Všechny existující stěny, střechy, kolize, výšky terénu, silnice a chodníky se **nemění**.

**DŮLEŽITÉ:** žádná konkrétní fotografie těchto fasád nedokládá skutečný počet, pozice a podobu oken, dveří či balkonů; jde **výslovně o dočasnou herní vizualizaci**, ne fotogrammetrii. Nebyla vymyšlena ani jediná nová cesta, vchod, strom, obrubník, parkovací místo, collider nebo budova.

Dva technické pohledy v nabídce: `?v=522200&streetAudit=lesni-courtyard-north-5222` na původním servisním OSM uzlu `50.2305662,14.8713563` (směr 5° odhad), a `?v=522200&streetAudit=lesni-courtyard-south-5222` na `50.2305259,14.8712021` (směr 115° odhad). **Nejde o fotoorientované panorama.** Diagnostika `window.__miloviceLesniCourtyardRuntime5222()` kontroluje skutečně renderované fasády, vazbu na scénu a LOD. Nové `scripts/osm-lesni-courtyard-blocks-5222.test.mjs`, `scripts/osm-lesni-courtyard-blocks-webgl-5222.mjs`, `.github/workflows/lesni-courtyard-blocks-5222.yml` a přidání do `scripts/dev-check.mjs sportovni`. **OVĚŘENO PASS pro kódový commit `88b3cec`:** samostatný [GitHub Actions test 5.222](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44908310027) = **SUCCESS** (původní RÚIAN source-lock včetně regresního 5.221 + skutečný mobilní Chromium/SwiftShader WebGL obou budov a obou kontrolních kamer; modelových 106 oken, 10 původních fasádních hran, 8 meshů, 1564 trojúhelníků, vše připojené ve scéně a viditelné i po 6,5 s/LOD). [Hlavní projektová validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44908310019) = **SUCCESS**. [GitHub Pages build a skutečné nasazení](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44908309982) = **SUCCESS** také přímo na zdrojovém commitu `88b3cec`. Tento následující dokumentační commit spustí nový nezávislý Pages build; před dokončením se nesmí označit za PASS.

---

## Milovice RP 5.221 — další původní sedmipodlažní bytový dům na severovýchodní Višňové (21. 11. 2026)

Pokračování **existující RÚIAN/OSM zástavby**: [budova 53866112](https://www.openstreetmap.org/way/53866112), oficiální RÚIAN `27246191`, má původní uzamčený 5uzlový půdorys (hash `4328a486`, cca 1790,88 m²), `building:levels=7`, `building:flats=69`, zdroj `cuzk:ruian` a `start_date=2009-03-25`. Již existující 3D stěny, střecha, DEM terén a fyzikální kolize **se nemění**. U původních čtyř obvodových hran dlouhých 42,084 / 42,496 / 42,334 / 42,363 m přidáváme pouze **schematický modelový rastr 12 oken na fasádu a podlaží**, tedy **336 výslovně odhadovaných oken**. Kompaktní čtyřmesh renderer 5.192 vytváří 4 vizuální meshe a 4712 trojúhelníků včetně modelového soklu.

**Pozor na skutečnost:** skutečný počet/poloha/vzhled oken, materiály a podoba fasády **nejsou fotoověřené**; model se nesmí označit za architektonicky přesnou rekonstrukci. Nejsou přidány balkon, dveře, cesta, obrubník, parkoviště, strom, nová stavba, kolize ani úprava střechy. Modul `scripts/osm-visnova-north-block-5221.js` se při jakémkoli rozdílu OSM ID, RÚIAN, GPS hash, počtu podlaží, bytů, tagů nebo stran vypne (fail-closed). Kontrolní pohled `?v=522100&streetAudit=visnova-north-block-5221` je na originálním uzlu footway/1460019797 `50.2300221, 14.8705303`, azimut 10° je jen technický odhad, **nikoliv panorama**. Runtime `window.__miloviceVisnovaNorthBlockRuntime5221()` ověřuje skutečné připojení a LOD viditelnost modelových detailů.

**Ověřeno PASS (zdrojový commit `76033f2`):** [source-lock Node + regresní 5.220 + skutečný mobilní Chromium/SwiftShader WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44907715950) **SUCCESS** — 336 odhadovaných modelových oken na čtyřech originálních obvodových stěnách, 4 skutečně připojené 3D meshe / 4712 trojúhelníků, po 6,5 s i LOD stále viditelné. [Hlavní celoprojektová CI validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44907715964) **SUCCESS** na stejném kódovém commitu. [GitHub Pages build/deploy](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44907837260) **SUCCESS** na následné dokumentační revizi `439aa52`, která obsahuje hotový herní commit 5.221. Předchozí Pages run `44907714912` byl při rychlé návazné dokumentaci zrušen ve prospěch novějšího úspěšného deploymentu; **nejde o selhání kódu**. Tento závěrečný zápis spustí novou čistě dokumentační revizi Pages a její stav není předem známý.

---

## Milovice RP 5.220 — 372 metrů originálních dlážděných chodníků u východní Višňové (21. 11. 2026)

Nová verze zlepšuje **ulici mezi původními bytovými bloky, nikoli další samostatnou budovu**. OSM [pěší cesta 1005977571](https://www.openstreetmap.org/way/1005977571) má 7 původních mapových uzlů, hash `263e12b3` a délku cca **301,17 m**; [pěší cesta 1057549994](https://www.openstreetmap.org/way/1057549994) má 6 původních uzlů, hash `02767378` a délku cca **70,465 m**. U obou původní OSM jednoznačně obsahuje `highway=footway`, `footway=sidewalk`, `lit=yes` a zejména **`surface=paving_stones`**. Jsou to dva samostatné mapové chodníky, nikoli nově vytvořené přímé spojení.

Dosavadní herní pěší 3D pruhy i jejich původní souřadnice zůstávají. Zdrojově ověřený renderer používá na těchto dvou trasách stávající jednotný materiál `visnova-tagged-paving-stones` z 5.204 namísto nevýrazného všeobecného chodníkového povrchu. **Skutečná barva, vzor a rozměry jednotlivých dlaždic nejsou změřené ani fotograficky potvrzené.** Pouze u některých ostrých zatáček kratší 70,5m trasy je možné doplnit až tři drobné trojúhelníky mezi již existujícími pěšími pásy. Konkrétní trojúhelníky musí být mimo mapované vozovky a budovy, jinak se nevytvoří. Původní přibližně rovné vrcholy dlouhé trasy se nevymýšlí ani nekorigují.

Fail-closed modul `scripts/osm-visnova-estate-pavers-5220.js` kontroluje **každý původní GPS bod, zdrojové tagy, OSM ID, délky segmentů a hash**, nepřepíše OSM export, nemění šířku ani kolize, nevytváří nové chodníky, přechody, obrubníky, stromy či parkovací místa. Runtime `window.__miloviceVisnovaEstatePaversRuntime5220()` vrací při skutečném vykreslení počet zdrojových a vykreslených segmentů, přidružený sdílený materiál a LOD stav případných 3D výplní. Kontrolní kamera z originálního OSM uzlu 1005977571 na `50.2288905, 14.8710178` je `?v=522000&streetAudit=visnova-estate-pavers-5220`; směr 20° je technický odhad, není to panorama.

**Všechny testy verze 5.220 PASS:** [Node a skutečné mobilní Chromium/SwiftShader WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44906988179) **SUCCESS** (11 originálních pěších segmentů, 371,637 m, 3 zdrojově omezené výplně zatáček v jednom extra meshi, viditelném i po 6,5 s/LOD, žádné přidané pěší trasy a kolize). [Celoprojektová validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44907005069) **SUCCESS**. [GitHub Pages veřejné nasazení](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44907087574) **SUCCESS**. Poslední dokumentační update po těchto výsledcích má vlastní Pages běh; žádné nové herní soubory už se neměnily.

---

## Milovice RP 5.219 — tři původní sedmipodlažní bytové domy Višňové (21. 11. 2026)

**Nová souvislá část zástavby:** tři na sebe navazující skutečné OSM/RÚIAN budovy [53865704](https://www.openstreetmap.org/way/53865704), [53865910](https://www.openstreetmap.org/way/53865910) a [53865911](https://www.openstreetmap.org/way/53865911) poblíž východní Višňové/Armádní mají každá explicitně mapovaných **7 podlaží, 48 bytů a vlastní uzavřený pětiuzlový půdorys** přibližně 33 × 12,5 m. Jejich 3D hmoty, střešní tvar a kolizní polygon už ve hře existovaly. Verze 5.219 přidává jen **viditelné návrhové okenní rastry a nízký sokl** po všech **12 původních obvodových stěnách**. Na jednu budovu vychází 168 *modelových* oken (3+9+3+9 × 7 pater), celkem **504 odhadovaných oken / 12 vizuálních meshů / 7080 trojúhelníků** přes již otestovaný čtyřmateriálový renderer 5.192.

**Pravdivost modelu:** půdorysy, RÚIAN čísla, počet podlaží a bytů jsou zdrojově doložené. Přesný počet, styl, materiál a rozmístění skutečných oken ani umístění balkonů a vstupů zatím fotograficky doložené **NEJSOU**; rastry jsou otevřeně jen **dočasný modelový detail** místo hladkých obecných bloků. Žádné nezdokumentované vchody, balkony, stromy, reklamy, lavičky ani nové stavby nejsou přidané. OSM 3D zdi a střechy, DEM terén, 7 herních podlaží, silnice, pěší trasy i hráčské kolize zůstávají beze změny.

Modul `scripts/osm-visnova-seven-floor-row-5219.js` fail-closed ověřuje originální ID/polygony/RÚIAN tagy a RÚIAN hash `680a840e`, `469f34e2`, `e771e546`, čtyři délky hran, podlaží i shodu s existující 3D výškou. Existující `renderVisnovaResidential5192` vytváří pouze modelovou fasádní vrstvu pro každou budovu. V prohlížeči lze kontrolovat `window.__miloviceVisnovaSevenFloorRuntime5219()` včetně skutečné LOD viditelnosti 12 meshů. Technický pohled `?v=521900&streetAudit=visnova-seven-floor-row-5219` používá původní bod OSM footway/1352859035 **50.2295053, 14.8706696**, směr 180° je odhad, nikoli foto/panorama. **OVĚŘENO PASS:** samostatné GitHub Actions Node + skutečné mobilní Chromium/SwiftShader WebGL \`44905779083\` SUCCESS: tři správné 7podlažní RÚIAN bloky, 504 výslovně modelových oken, 12 fasádních detail meshů, 7080 trojúhelníků a všech 12 meshů ve scéně/viditelných po 6,5 sekundách a LOD. Historický 5.218 test také PASS. Oprava `0b9cae5\` odstranila numericky nestabilní zaokrouhlování kratší 12,60m stěny (odhad 3+9+3+9 os pro všechny tři), bez změny skutečného OSM půdorysu. **Celoprojektová validace \`44905779128\` SUCCESS a GitHub Pages \`44905778646\` SUCCESS**, vše na stejné finální herní revizi. Následné dokumentační revize mají samostatné nasazení.

---

## Milovice RP 5.218 — další tři skutečné travnaté plochy Višňové (21. 11. 2026)

Nová verze rozšiřuje již modelovaný veřejný prostor východní Višňové a blízké Armádní: přesně původní OSM [travní polygon 1460019798](https://www.openstreetmap.org/way/1460019798), [1460019800](https://www.openstreetmap.org/way/1460019800) a [1460019801](https://www.openstreetmap.org/way/1460019801), všechna tři `landuse=grass`, zamčená na původní hash souřadnic `775f191a`, `67035867`, `d8808821`. Původní půdní podklad a obrysy se nemění. Uvnitř těchto konkrétních původních polygonů přibylo několik nízkých 3D trsů trávy, vykreslených přes existující společnou geometrii `createLawnBlades` a `visualBatch` s reálným terénním DEM a LOD. Pro nový kód nevznikají budovy, silnice, přechody, dopravní značky, keře, stromy ani další collidery.

**Kontroly reality:** každé zdrojové pole kontroluje OSM ID/tagy/uzly/GPS hash; každý trs musí být uvnitř mapované hranice s odstupem alespoň 0,95 m a současně projít bezpečnostní kontrolou skutečných silnic a pěších cest, stávajících budov a vodních toků. Již hotové plochy z 5.104/5.200/5.212 se nezdvojují. Konkrétní výška, druh, barva a rozložení drobných trsů **nejsou fotodokumentovaná botanika**, jen herní blízký vizuální detail. Cíl jsou propojené celé ulice při rozumných GPU nárocích, ne nezdokumentované vysazování stromů.

**Ověřené mobilní WebGL:** GitHub Actions [5.218 source + mobile test](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44904549530) = **SUCCESS**. Node planner vytvořil při neomezujících bezpečnostních kontrolách 118 kandidátů (14 + 39 + 65); skutečná běžící hra vykreslila po kontrolách silnic/budov/vody **112 trsů ve dvou GPU instancovaných meshech**, oba viditelné a připojené do scény ještě po 6,5 sekundy a LOD. Historický 5.217 test prošel také. Nové `__miloviceVisnovaGardenLawnsRuntime5218()` poskytuje počty pro každou původní plochu, míru bezpečnostního ořezu a skutečnou LOD viditelnost.

Otevři technický pohled `?v=521800&streetAudit=visnova-garden-lawns-5218` z původního mapovaného bodu OSM přechodu `1057549995` (50.229278, 14.8701521). Azimut 10° je **technický odhad**, nikoliv fotografie ani panorama. **Ověřeno také v hlavním projektu:** kompletní CI validace \`44904553674\` **SUCCESS**, GitHub Pages nasazení \`44904656300\` **SUCCESS**. Poslední úprava nového regresního testu pouze předchází zastarávání BUILD_ID v dalších verzích, geometrie hry se nemění; případné následující Pages běhy mají svůj vlastní stav.

---

## Milovice RP 5.217 — původní žlutá fasáda a hnědá střecha jedné skutečně mapované budovy u Višňové (21. 11. 2026)

**Konkrétní zdrojově doložená úprava zástavby:** v původním OSM exportu pro Mladou je budova [way/1456361921](https://www.openstreetmap.org/way/1456361921) poblíž Višňové/Armádní s explicitními tagy `building=yes`, `building:levels=3`, `building:colour=#fec700`, `roof:colour=#583400`. Zamčený 5uzlový polygon má hash `28e92fa9` a přibližnou plochu 181,31 m². Dříve tento konkrétní objekt dědil náhodně vybrané fasádní a střešní odstíny z obecné palety. Nyní stejná původní budova skutečně používá **žlutou fasádu #FEC700 a hnědou střechu #583400** přímo ze zdrojových tagů, se dvěma sdílenými vlastními materiály bez náhodných barevných textur.

**Žádná další vymyšlená stavba nebo vstup:** modul `scripts/osm-visnova-tagged-colors-5217.js` nejprve ověří původní OSM geometrii/tagy/oblast a nezasáhne do schváleného fotografického či manuálního modelu. Zůstávají stejné původní GPS stěny, 3 podlaží, původní modelová výška i herní střešní tvar, vozovky, chodníky, NPC a collidery. OSM barvy **nejsou aktuální fotografický průzkum**; z těchto tagů neznáme přesný typ střechy, polohy oken, vstupní dveře ani stav budovy v roce 2026. Nejsou proto v této úpravě domýšlené.

Technický herní pohled z existujícího OSM uzlu chodníku: `?v=521700&streetAudit=visnova-tagged-colors-5217`; jeho azimut 235° je pouze odhad směru k mapovanému obrysu. `window.__miloviceVisnovaTaggedColorRuntime5217()` kontroluje zdrojovou geometrii, skutečné barvy materiálů ve scéně, typ střechy jako nepodložený OSM a viditelnost po LOD. **PASS je potvrzený pro samostatné Node + skutečné mobilní Chromium/SwiftShader WebGL testy** v GitHub Actions \`44898676584\`: půdorys 181,314 m², barvy #fec700/#583400 z původního OSM, 3 podlaží, 1 stěnový mesh a 1 střešní mesh viditelné po 6,5 s, původní budova bez nových kolizí. **Hlavní celoprojektová validace také PASS** (GitHub Actions \`44898679278\` SUCCESS) a **GitHub Pages nasazení 5.217 PASS** (run \`44898807695\` SUCCESS). Následná dokumentační aktualizace má svůj samostatný Pages běh.

---

## Milovice RP 5.216 — mapovaná zebra s ostrůvkem u východního konce Višňové (21. 11. 2026)

**Viditelná oprava skutečného uličního objektu:** původní OSM [přechod/1044078120](https://www.openstreetmap.org/way/1044078120) v ulici Armádní poblíž Višňové má explicitní `crossing:island=yes`, `crossing:markings=zebra`, a tři původní GPS uzly. Jeho prostřední uzel `50.2291512,14.8694981` přesně odpovídá původnímu prostřednímu uzlu OSM [silnice/1331897686](https://www.openstreetmap.org/way/1331897686). Dřívější univerzální kreslení zebry nerozlišovalo ostrůvek. Verze 5.216 zachová obě původní pěší ramena (cca 5,04 m a 6,81 m), na přesném mapovaném středu vykreslí **jeden nízký osmiúhelníkový 3D model ostrůvku / 24 trojúhelníků** a vodorovné značení rozdělí na dvě části tak, aby neprocházelo přes středový model. Použitá geometrie i stávající modelový materiál jsou GPU úsporné.

**Rozlišení zdroje a odhadu:** existenci ostrůvku, přechodu a jeho GPS středu potvrzuje uložený originální OSM; ale tvar/rozměry 2,4 × 0,8 m, 0,16m výška, barva i počet bílých pruhů jsou schematické **odhady pro hru, nikoli fotografie tohoto konkrétního ostrůvku**. Fotografie jiných přechodů Armádní se za něj nevydávají. Původní silnice, chodníky, přechody, jejich označení, dopravní logika, kolize, NPC ani parkování se nijak nemění. Nový model neobsahuje dopravní značku, zábradlí ani nový fyzický neprůchozí collider.

Modul `scripts/osm-visnova-refuge-5216.js` fail-closed zamyká přesné mapové hashe `097b2218` a `b19851ee`, původní tagy a shodný prostřední uzel; doplňuje pouze model ostrova a filtraci pruhů ze stávajícího `planZebraPieces`. Technický pohled `?v=521600&streetAudit=visnova-refuge-5216` stojí na původním mapovaném uzlu (50.2291072, 14.8694816), směr 14° je technický odhad. Getter `window.__miloviceVisnovaRefugeRuntime5216()` vrací skutečné kreslení / 2 skupiny pruhů / viditelnost / souřadnice po LOD. **OVĚŘENO PASS:** zdrojový Node test a reálné mobilní Chromium/SwiftShader WebGL v GitHub Actions \`44898001527\` — 4+3 nakreslené bílé pruhy, 1 odstraněný pruh u středu, jediný vykreslený model ostrůvku / 24 trojúhelníků, viditelnost po 6,5 s. Nezávislá celoprojektová validace \`44898001551\` **SUCCESS** a GitHub Pages \`44898053561\` **SUCCESS**. Historický test 5.215 zůstává zachovaný; pro konkrétní rozměry ostrova stále není fotozaměření.

---

## Milovice RP 5.215 — jeden chodec, tři skutečné navazující úseky Višňové (21. 11. 2026)

Původní simulovaný východní chodec 5.214 už nemá končit po jediném přímém úseku. Nyní používá **tři na sebe přímo navazující segmenty původní OSM pěší cesty [way/1044078118](https://www.openstreetmap.org/way/1044078118)**, její uzly 0→1→2→3, včetně původních zalomení. Z geodeticky nepřesného, ale zdrojově daného GPS převodu vychází celková délka cca 53 m, po odříznutí 3,3 m na každém konci asi **46,45 m skutečně animované trasy**. Dál nepokračuje z bezpečnostních důvodů: následující části jsou v původní mapě blíž vozovce/budovám.

Nový modul `scripts/osm-visnova-continuous-walker-5215.js` vyžaduje zdrojový hash `26506719`, 11 uzlů a správné původní tagy, kontroluje původní mapované automobilové osy a domy podél všech tří úseků a při kolizi či změně zdroje odmítne rozšíření. OSM way **nemá surface tag**, takže si nedovozujeme dlažbu. Postava je jen **herní simulace**, nikoliv fotograficky doložený skutečný člověk. Kreslení používá stále původní druhý NPC rig 5.214, pohybové animace, DEM a LOD. **Žádný nový NPC, mesh chodníku, spojovací cesta, přechod, silnice, vchod, stavba ani kolize**.

Technická kamera: `?v=521500&streetAudit=visnova-continuous-walker-5215` na původním GPS uzlu 50.2290436, 14.8699847; azimut je herní odhad. Diagnostika `window.__miloviceVisnovaContinuousRuntime5215()` sleduje reálnou polohu a index úseku. Přibyl source-lock Node test i samostatný mobilní Chromium/WebGL workflow; **ověřeno PASS**: Node source-lock + skutečný mobilní Chromium/SwiftShader WebGL běh \`44897288957\` (druhý NPC urazil 3,20 m za 6,8 s), hlavní celoprojektová validace \`44897288914\`, regresní WebGL 5.214 \`44897192947\` i GitHub Pages deployment \`44897339044\`. Node ověřil 53,05 m původní GPS trasy, 46,45 m pro chodce, min. 8,616 m od mapované osy silnice a 5,796 m od budovy. Starý 5.214 test zůstává součástí regresní sady.

---

## Milovice RP 5.193 — úplná hlavní fasádní obálka bytovek Višňová 572 a 573 (20. 11. 2026)

**Konkrétní viditelná oprava dvou existujících domů:** předchozí model 5.192 vykresloval modelová okna na 4 dlouhých původních hranách **Višňová 572** a 2 dlouhých hranách **Višňová 573**, zatímco skutečné **čelní stěny** půdorysů RÚIAN zůstaly zcela prázdné. Nová 5.193 doplňuje na původní (GPS neměněné) koncové obvodové hrany další **4 hlavní fasády**: dům 572 na RÚIAN hranách `12` (~15,953 m) a `20` (~15,793 m), dům 573 na hranách `0` (~17,124 m) a `3` (~17,133 m). Tím získávají modelová okna **všechny výrazné hlavní vnější stěny obou domů**: celkem 6 fasád u 572 a 4 fasády u 573. Drobná zalomení půdorysu zůstávají stále plnými stěnami.

**Výsledek pro hru:** 572 má nově **418 modelových oken** (přírůstek 88), 573 má **240** (přírůstek 50), tedy **658 modelových oken místo 520**, beze změny půdorysů a s přesně **8 společnými GPU meshi** (4 na dům). Odpovídá jim 9 268 modelových trojúhelníků. Každé modelové okno je stále jen **herní přibližné řešení**: počty, poloha, šířka 1,46 m, skla, rámy, parapety a sokly nejsou potvrzené fotografiemi konkrétní budovy. Vlastní původní extrudované objemy, původní střecha, modelové výšky 11 a 5 podlaží, obslužné silnice, chodníky, OSM/RÚIAN, terén i základní kolize jsou nedotčené. Nevytváříme žádné neověřené vchody, lodžie, parkoviště, ploty ani nové budovy.

Technicky: nový modul `scripts/osm-visnova-end-facades-5193.js` potvrzuje původní hashe `750bac6c` / `ff594686`, model 5.192, čísla hran, délky a jejich zdrojové uzly; pouze rozšíří seznam modelovaných fasád, pak znovu využije **původní 5.192 batched renderer**. Není potřeba dalších materiálů/draw calls ani nových modelových kolizí. Nová diagnostika `window.__miloviceVisnovaFullEnvelopeRuntime5193()` uvádí počet původních i doplněných fasád a 658 výplní. Technické herní pohledy z mapovaných uzlů chodníků: `?v=519300&streetAudit=visnova-572-5192` a `?v=519300&streetAudit=visnova-573-5192`. Jde o OSM technické azimuty, **nikoli fotografie z panoramatu**.

**Ověření:** nová plánovací funkce + skutečný renderer byly reálně spuštěny v JavaScriptu nad oběma přesnými původními RÚIAN geometriemi a daly 418+240 oken, 8 vykreslovacích meshů a 5 898+3 370 trojúhelníků. Zdrojový regresní test `scripts/osm-visnova-end-facades-5193.test.mjs` vložen do `scripts/dev-check.mjs sportovni`, zachován samostatný regresní test původní 5.192 a rozšířen mobilní Chromium/WebGL LOD test po 6,5 sekundách. **Skutečný Node test suite, Chromium/WebGL test, GitHub Actions ani live GitHub Pages stále nemají ověřený PASS.** Další: přesné fotoověření konkrétních stěn a rekonstrukce celých okolních ulic, chodníků a jejich návazností.

**Původní zdroje:** [OSM bytový dům 572](https://www.openstreetmap.org/way/53865847), [OSM bytový dům 573](https://www.openstreetmap.org/way/53865848), [ČSÚ registr budovy 572](https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=3644899&hkodcis=51&idob=1030924813&kod=537501&kodcis=51&kodpol=nnnnnn).

---

## Milovice RP 5.192 — dvě velké obytné budovy Višňová 572 a 573 u Armádní (20. 11. 2026)

**Viditelná souvislá rekonstrukce dvou skutečných RÚIAN budov:** na původních přesných půdorysech **Višňová č. p. 572** (OSM `53865847`, 23 původních hran polygonu, `building:levels=11`, `building:flats=69`, originální hash `750bac6c`) a **Višňová č. p. 573** (OSM `53865848`, 5 hran, `building:levels=5`, `building:flats=84`, originální hash `ff594686`) vzniklo úsporné členění jejich dlouhých obytných fasád. Místo dosavadního náhodného generického panelového rastru a domnělých vstupů používají **520 výslovně modelových oken**: č. 572 má 330 oken na **4 původních dlouhých stěnách** (14,761 + 22,230 + 14,728 + 57,676 m), č. 573 má 190 oken na **2 původních dlouhých stěnách** (65,243 + 72,570 m). Počet oken, mezery mezi nimi, vzhled rámů, soklové pásy a odstíny skel **nejsou fotograficky ověřené**. Počet modelových podlaží se drží mapovaných 11 a 5, zatímco modelová výška vychází z existující herní jednotky 3,05 m na podlaží, nikoli z geodetického zaměření.

Nový soubor `scripts/osm-visnova-residential-5192.js` používá pouze obě přesné původní geometrie RÚIAN a jejich hashe. V původní 3D scéně přibyly **celkem 8 sdílených meshů, 7 336 trojúhelníků**, nikoliv 520 samostatných objektů pro vykreslení. Materiálové dávky jsou rámy, skla, parapety a nízký modelový sokl. Zachovány originální 3D objemové stěny, střechy a původní **hráčské kolize**; neexistuje nový obytný blok, nová silnice, vchod, přístřešek, balkon nebo průchod. Na těchto dvou domech je potlačený generický dekor všech 28 původních obvodových hran (u krátkých hran zůstávají plné původní stěny), aby se nesčítala dvě odlišná okna nebo neověřené panelové spáry. Přidán stálý getter `window.__miloviceVisnovaResidentialRuntime5192()` s počty domů, podlaží, oken a viditelnosti po LOD.

**Kamerové náhledy ve hře:** `?v=519200&streetAudit=visnova-572-5192` a `?v=519200&streetAudit=visnova-573-5192`. Kamerové souřadnice jsou existující uzly OSM chodníků, úhly pohledu jsou **technické odhady, ne foto pozice**. Přibyl zdrojový unit test `scripts/osm-visnova-residential-5192.test.mjs`, zařazen do `scripts/dev-check.mjs sportovni`; stávající mobilní WebGL test `scripts/osm-slunicko-west-elevation-webgl-5154.mjs` nově ověřuje po 6,5 sekundách oba domy, 520 výplní, 8 meshů a žádné zrušení sousední MŠ ani zebr.

**Ověření:** samostatný JavaScriptový plánovač a geometrický renderer byly **skutečně spuštěné** nad původním OSM souborem, oba vrátily přesné počty 330+190 oken, 4+4 meshů, 4 666+2 670 trojúhelníků a původní zdrojové půdorysy. **Skutečný Node testovací běh, Chromium/WebGL, GitHub Actions a GitHub Pages PASS zatím nejsou potvrzené**; interní ověření samotného JavaScriptu není důkaz nasazení. Další: porovnat skutečné fotografie těchto domů, nahradit odhadovaný rastr doloženými polohami oken a balkonů, pak pokračovat souvislou reálnou zástavbou okolo Armádní a Topolové. U 573 jsou ve veřejné realitní nabídce zmíněné lodžie, jejich polohy na konkrétních fasádách ale nejsou doložené.

**Podklady:** [původní OSM 572](https://www.openstreetmap.org/way/53865847), [původní OSM 573](https://www.openstreetmap.org/way/53865848), [ČSÚ registr Višňová 572](https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=3644899&hkodcis=51&idob=1030924813&kod=537501&kodcis=51&kodpol=nnnnnn).

---

## Milovice RP 5.191 — dvě části skutečné zebry kolem ostrůvku Armádní × Topolová (20. 11. 2026)

**Oprava přímo viditelné uliční geometrie:** předchozí 5.190 správně postavila na původním OSM uzlu nízký model již **mapovaného** ostrůvku `1316882855`, ale společný obecný generátor `planZebraPieces` kreslil pruhy přes přechod od prvního až k poslednímu uzlu bez ohledu na **prostřední** uzel ostrůvku. Nová 5.191 rozděluje malované vodorovné značení na **dva samostatné přístupy** přechodu (původní uzly 0→1 a 1→2) a odmítá pruhy, jejichž hrana by zasahovala do středového modelového ostrůvku (včetně rezervy 8 cm). Na původních OSM datech a herní šířce Armádní nyní vychází **3 bílé pruhy na severní a 3 na jižní straně**, celkem **6 namísto původních 7**. Střed přechodu zůstává pro chodce průchozí; fyzický ostrůvek a jeho nefotograficky ověřené rozměry 2,4 × 0,8 m zůstaly z 5.190 beze změny.

Nový `scripts/osm-armadni-zebra-arms-5191.js` funguje **výlučně** pro původní OSM přechod `1316882855`, úplný hash `c236e738` a existující ověřený střed ostrůvku na původní silnici Armádní `1331897683`. Využívá **stávající zebra renderer, materiál a clearance z reálné OSM silnice**, jen upravuje seznam nakreslených pruhů. Žádná nová cesta, dodatečný přechod, nové kolizní těleso, jiná šířka silnice nebo přesun GPS/OSM uzlů. Výsledná rozteč a šířka pruhů jsou **herní model, nikoli fotogrammetricky doložené skutečné značení**. Všechny jiné přechody Milovic včetně dvou Topolová zebry 5.187 jsou beze změny.

Aktualizován `index.html` s buildem `519100`, technický pohled `?v=519100&streetAudit=armadni-refuge-5190` a runtime `window.__miloviceArmadniZebraArmsRuntime5191()` (počet severních/jižních pruhů, původní počet, bezpečná mezera u ostrůvku, stav viditelnosti po LOD). Regresní test `scripts/osm-armadni-refuge-island-5190.test.mjs` nyní také ověřuje 3+3 pruhy s reálnou herní clearance, nulové zásahy do podkladů, minimální mezeru a zamítnutí změněného OSM ostrůvku. Mobilní Chromium/WebGL test `scripts/osm-slunicko-west-elevation-webgl-5154.mjs` doplněn pro přechod po 6,5 s LOD. Současně odstraněny **chybné kontroly starých globálních build ID** z testů fasády školky, pěší mise a dlažby, aby se neporouchaly při vydání nové verze.

**Ověření:** reálně spuštěná čistá JavaScriptová logika s celým originálním OSM regionem Mladá a existujícím `road-clearance.js` **úspěšně** ověřila 7→6, sever 3/jih 3, 1 zrušený pruh, bezpečné oddělení okraje značení od středu ostrůvku, plnou původní OSM geometrii a negativní změnu tagu. **Skutečný Node proces, Chromium/WebGL, CI Actions a aktuální Pages deploy nadále nemají potvrzený PASS**. Další: vizuální porovnání přímo u Armádní, ověřit CI, pak pokračovat reálnými souvislými ulicemi bez spekulativních lamp/plotů/vchodů.

---

## Milovice RP 5.190 — skutečně mapovaný dělicí ostrůvek přechodu Armádní × Topolová (20. 11. 2026)

**Významná fyzická změna uliční scény:** na existujícím přechodu **OSM `1316882855`** přes **Armádní** u Topolové je explicitně mapované `crossing:island=yes` a `crossing:markings=zebra`. Prostřední původní uzel přechodu `50.2292809, 14.8659093` **přesně odpovídá** původnímu uzlu silnice Armádní `1331897683` (`highway=residential`, 2 pruhy). Ve 3D je nyní **malý nízký dělicí ostrůvek** kreslený právě na tomto zdrojovém uzlu, s podélnou osou převzatou z původní silnice. Je to **modelová rekonstrukce existujícího typu objektu, nikoli geodeticky/fotograficky ověřený obrys**: zobrazovaná délka **2,4 m**, šířka **0,8 m**, tvar zkoseného osmiúhelníku a výška nad asfaltem jsou odhady pro přehlednost a průjezd stávajících NPC pruhů. Odstín povrchu také není fotograficky potvrzen.

Nový `scripts/osm-armadni-refuge-island-5190.js` kontroluje úplné OSM hashe `c236e738` (přechod) a `05fd404c` (silnice), tagy a shodu středového GPS uzlu. Pouze při plném souhlasu vytvoří **jeden 24trojúhelníkový 3D mesh** přímo v `index.html` nad stávající vozovkou. Původní zebra `planZebraPieces`, textura ostatních přechodů, silnice, chodníky, DEM, domy, pouliční síť, AI pruhy, stávající NPC i poloha auta jsou beze změny. **Žádné nové OSM body, silnice, přechody, lampy, obrubníkové kolizní blokování ani nové překážky chodců**. Nezavedli jsme pěší collider na ostrůvku, protože původní pěší propojení musí zůstat průchozí; proto zatím nejde o fyzikálně dokonalý model obrubníku pro vozidla.

Pro snadnou kontrolu je ve hře samostatná **technická kamera z původního severního uzlu přechodu**, přibližně na jih (není to srovnání s fotoaparátem): `?v=519000&streetAudit=armadni-refuge-5190`. Diagnostika `window.__miloviceArmadniRefugeRuntime5190()` rozlišuje zdrojové GPS, odhad rozměrů, přítomnost ve scéně a viditelnost po LOD. Nový `scripts/osm-armadni-refuge-island-5190.test.mjs` je zapojen do cílené sportovní/Topolová sady `scripts/dev-check.mjs sportovni`; rozšířený mobilní WebGL test školky `scripts/osm-slunicko-west-elevation-webgl-5154.mjs` ověřuje model i po 6,5 sekundy načítání.

**Ověření:** přímé provedení čistých JS funkcí s původními regionálními OSM daty přes nástroje vývoje **uspělo** (existence plánu, GPS, jediný mesh, 24 trojúhelníků, odmítnutí změněného `crossing:island`). **Skutečný běh Node sady, mobilního Chromium/WebGL, GitHub Actions a nasazení Pages zatím ověřený PASS nemá.** Další krok: ověřit obraz na herním mobilu a skutečné výsledky Actions, zlepšit návaznosti okolních reálných chodníků a budov pouze s doloženými souřadnicemi.

**Zdroj:** [OSM původní přechod s ostrůvkem](https://www.openstreetmap.org/way/1316882855) a [OSM silnice Armádní](https://www.openstreetmap.org/way/1331897683).

---

## Milovice RP 5.189 — modelová západní fasáda MŠ Sluníčko s podloženým měřítkem oken (20. 11. 2026)

**Přímá viditelná úprava skutečné budovy:** na autentickém RÚIAN/OSM půdorysu MŠ Sluníčko (Topolová 622, OSM `53865699`) má západní fasáda délky 44,429 m nově samostatné větší modelové okenní výplně, místo starého náhodného generického úzkého okenního rastru. Veřejný rozpočet města Milovice z 21. 5. 2020 na venkovní žaluzie dokládá mj. rozměry 2,4 × 1,8 m (14 ks) a 2,4 × 2,0 m (40 ks) a jednu sestavu 3,6 × 2,0 m; **nedokládá ale, že všechny tyto žaluzie patří na západní stranu nebo kde konkrétně leží**. Proto jsme zvolili výslovně **odhadovaný modelový** západní rastr **4 řady × 9 oken (36 výplní)**, každá šířky 2,4 m a výšky 1,8 m. Ani počet, ani jejich polohy nevydáváme za skutečná adresně/fotograficky ověřená okna. Čtyři podlaží školy dokládá její oficiální web; 13,15m modelová výška a 44m západní stěna navazují na 5.153/5.154. Přidané tři sdílené GPU meshe (rámy/sklo/parapety) stojí před původní pevnou stěnou. Generická okna se na **jediné původní západní hraně** potlačí, aby se obě verze nepřekrývaly. Ostatní fasády, půdorys, střecha, DEM základy, vstupy, kolize, silnice, zebry, hřiště, chodci a GPS podklady zůstávají.

Modul `scripts/osm-slunicko-west-windows-5189.js` ověřuje původní hash `912f8e04`, geometrii RÚIAN hrany 1 a plán 5.154. Rozšířený `scripts/osm-slunicko-west-elevation-5154.test.mjs` kontroluje 36 výplní, 504 trojúhelníků, 3 meshe, modelová omezení, zachování zdrojů a zapojení v `index.html`. Rozšířený mobilní Chromium/WebGL test `scripts/osm-slunicko-west-elevation-webgl-5154.mjs` má ověřit skutečné vykreslení všech 3 meshů po 6,5s LOD a jediné potlačené generické hraně. Verze modulu `?v=518900` a build ID 5.189.

**Zatím není doložen PASS skutečného Node/Chromium/WebGL/Actions ani nasazení na Pages.** GitHub soubory a testovací kód jsou zapsané, ale prohlásit úspěšné nasazení by bylo předčasné. Další: ověřit testy a vzhled přímo ve hře; získat fotografie západní fasády pro nahrazení odhadnutého rastru a pokračovat budovami, chodníky a zelení celé Topolové.

**Podklady:** [oficiální čtyřpodlažní budova MŠ](https://www.ms-slunicko.com/predstavujeme-ms/) a [městský výkaz výměr osazení žaluzií 2020](https://www.e-zakazky.cz/stazenisouboru/61b37d16-23a5-4b6b-ae61-13e546a3e2ad) (str. 5–6).

---

## Milovice RP 5.188 — viditelný 3D checkpoint pěší zakázky Topolová (20. 11. 2026)

**Nová hratelná změna v reálné 3D scéně:** pěší zakázka Topolová má teď přímo nad aktuálním cílem na původním západním OSM chodníku `1314665579` **dočasný zelený kruh a plovoucí herní symbol**. Už není nutné orientovat se jen podle HUD/minimapy. Po příchodu k bodu se značka automaticky přesune na další ze tří existujících checkpointů; po dokončení, zrušení, resetu `R` nebo změně oblasti/vozidla se zcela skryje. Při nastoupení do vozidla zůstává viditelná, ale samotný postup pěší zakázky je pozastaven.

`scripts/osm-topolova-foot-beacon-5188.js` vytváří pouze **jednou při spuštění** jeden nekolizní herní indikátor se dvěma jednoduchými Three.js meshi; ani opakovaná mise nealokuje další geometrii. Poloha X/Z je vždy původní herní waypoint ze zdrojově zamčené OSM 5.165/5.179 mise, výška Y se bere ze skutečného herního DEM `terrainAt`. Je to **výhradně herní navigační prvek**, ne žádná reálná značka, skutečná adresa doručení ani odhad polohy vchodu. **0 nových fyzických ulic, přechodů, vchodů, lamp, stromů a kolizí**; původní OSM/RÚIAN i DEM podklady beze změny.

Runtime `window.__miloviceTopolovaFootBeacon5188()` vrací viditelnost včetně rodičovské vrstvy po LOD, aktuální cíl a počet 2 znovupoužitelných meshů. Rozšířený zdrojový test `scripts/osm-topolova-foot-job-5179.test.mjs` ověřuje všechny přechody stavu, odmítnutí cizího waypointu, DEM výšku a zamezení růstu objektů. Mobilní Chromium/WebGL test `scripts/osm-topolova-entry-survey-webgl-5170.mjs` ověřuje reálné spuštění, viditelný 3D checkpoint po 8,5s LOD, zrušení a reset `R`. Hra používá nový cache key `?v=518800` a ID buildu.

**Ověření:** soubory a testy jsou zapsané do GitHubu, ale skutečný Node/WebGL/CI/Pages PASS ještě není pro tuto verzi ověřen. Další: spustit/ověřit běhy Actions a na mobilu zkontrolovat velikost a skutečnou výšku markeru u terénu; pak pokračovat fotoověřenými fyzickými ulicemi.

---

## Milovice RP 5.187 — viditelný povrch obou reálných přechodů Topolové (20. 11. 2026)

**Úprava celé ulice přímo v 3D:** dvě již existující a OSM doložené zebry v Topolové (OSM pěší přechody `1316882853` a `1316882854`) nyní dostávají jeden společný jemný procedurální materiál modelového opotřebení bílé barvy, místo dosavadní zcela ploché výplně. Materiál tvoří deterministická RGBA textura 64×64 pixelů (16 KiB), vytvořená pouze při spuštění; její skutečný vzor ani míra opotřebení nejsou fotograficky ověřené. Oproti dřívějšímu shaderu přibývá **jeden sdílený materiál a textura** pro oba přechody, což může změnit dávkování vykreslování, ale **nevytváří další 3D pruhy/mesh geometrie**. Původní OSM 3 uzly každého přechodu a přesné umístění malovaných pruhů, původní asfalt a geometrie ulic, chodníky, budovy, doprava a kolize jsou nedotčené. Ostatní přechody v Milovicích nadále používají původní materiál.

Modul `scripts/osm-topolova-zebra-paint-5187.js` kontroluje úplné původní OSM hashe `dcb5d34e` a `0e127baa`, značení `crossing=zebra`, `surface=asphalt`, a odmítá jiné či pozměněné polohy. `index.html` vykresluje modelový materiál pouze při úspěšném zdrojovém ověření a vystavuje kontrolní stav `window.__miloviceTopolovaZebraPaint5187`; viditelné ID buildu odpovídá 5.187. Regresní kontroly jsou přidané do stávajícího testu `scripts/osm-topolova-paving-5177.test.mjs` (který již spouští Topolová CI workflow), včetně odmítnutí změněné geometrie, konzistence textury a kontroly napojení na renderer.

**Stav ověření:** GitHub soubory jsou aktualizované. Lokální Node, skutečný Chromium/WebGL, Actions ani nasazení Pages dosud nemají ověřený PASS. Další: ověřit automatizované běhy a zkontrolovat vzhled obou přechodů přímo ve hře; potom fotoověřeně dokončovat ostatní fyzické prvky celé Topolové.

---

## Milovice RP 5.186 — obvodové rámy oken Topolová 616–618 (20. 11. 2026)

**Vizuální oprava 3D hry:** na existujících šesti východních/západních modelových fasádách Topolová 616–618 se rámy oken již nekreslí jako plné podkladové desky za sklem. Každé původní okno má skutečné čtyři úzké obvodové pásy rámu, přední skleněnou plochu a zachovanou případnou příčli a parapet. Trojúhelníky přibývají do existujícího společného batche rámů, ne jako samostatné objekty. Zachováno 88 modelových běžných oken, 32 odhadovaných balkonových sestav a 24 schodišťových oken, stále 3 GPU meshe. Jde o výtvarnou modelovou aproximaci bez fotografického důkazu přesných oken 616–618. OSM/RÚIAN GPS, výšky, DEM, střecha, cesty, kolize a vozidla beze změny.

Verze modulu v index.html: 518600. Source test kontroluje zvýšenou geometrii obvodových pásů proti počtu skleněných trojúhelníků. **Lokální Node, mobilní WebGL, CI a Pages zatím nepotvrzené.** Další: ověřit běhy Actions a místo dalších spekulací získat skutečné fotografie 616–618.

---

## Milovice RP 5.185 — jemné odstíny skel na skutečné uliční řadě Topolová 616–618 (20. 11. 2026)

**Přímá viditelná úprava fasád:** všech šest existujících modelových východních/západních stěn adres 616, 617 a 618 mělo dosud zcela jednolitý odstín všech prosklených ploch. `scripts/osm-topolova-estimated-facades-5161.js` nyní při kreslení **těch samých původních oken** vytváří malé **deterministické rozdíly ve třech barevných složkách skla** podle adresy a pozice modelového okna. Odstíny jsou čistě grafická aproximace běžného prosklení, **nikoli ověřené skutečné barvy oken, závěsů, bytů či jejich uživatelů**. Skla mají mírně hladší PBR vzhled. Fasádní okna, parapety a rámové stěny nadále sdílejí své **původní tři GPU meshe**: sklo přidává pouze jeden vertex-color atribut k existující sloučené geometrii, bez jednotlivých objektů a draw callů pro každé okno.

Oprava 5.184 (č. 616: 16 nedoložených balkonových dveřních sestav záměrně změněno na modelová okna) zůstala zachována: stále 88 základních oken a 32 odhadovaných sestav s balkonovými dveřmi dohromady na šesti fasádách. Original OSM/RÚIAN, výšky budov, DEM, půdorysy, chodníky, kolize, doprava, venkovní objekty a místa NPC beze změny. `index.html` načítá novou verzi modulu `?v=518500`. Zdrojový test `scripts/osm-topolova-estimated-facades-5161.test.mjs` nově kontroluje atribut barev, konzistentní počet vrcholů, variabilitu odstínů a stále jen 3 meshe; již existující Topolová Actions workflow tento soubor spouští. **CI/WebGL/Pages zatím neověřené**: konektor GitHub poskytl commity, nikoli přístup k výsledkům workflow; pokus o lokální stažení zdroje neprošel kvůli DNS.

---

## Milovice RP 5.184 — oprava nepodložených balkonových dveří Topolová 616 (20. 11. 2026)

**Přímá viditelná úprava fasády skutečné ulice:** modelovaná východní i západní fasáda č. p. **616** měla dosud na čtyřech horních podlažích po dvou párech oken/balkonových dveří, převzatých mechanicky z návrhu sousedních 614/615. Původní zdroje **nedokládají skutečné rozmístění balkonů u 616**. Proto jsme na obou stranách č. 616 nahradili **16 spekulativních balkonových dveřních sestav obyčejnými okny** ve stejném modelovém rastru. To **neznamená tvrzení, že 616 žádné balkony nemá** — jde o záměrně konzervativní kresbu, dokud nebude přesný vzhled fotograficky doložen. U č. p. 617/618 zůstává dřívější výslovně odhadovaný rastr, protože veřejné dokumenty naznačují existenci balkonů alespoň v některých bytech; jejich konkrétní polohy ovšem stále nejsou přesně doloženy.

Při renderování šesti odhadovaných fasád 616/617/618 se počty změnily **72 → 88 běžných oken** a **48 → 32 modelových sestav okno + balkonové dveře**. Celkový počet fasád, původní OSM souřadnice a půdorysy, střešní plochy, DEM/výšky, kolize, silnice a chodníky beze změn. Tuto úpravu nepovažujeme za fotogrammetricky přesnou reprodukci, ale za odstranění konkrétního nepodloženého detailu. Zdrojový renderer: `scripts/osm-topolova-estimated-facades-5161.js`; test `scripts/osm-topolova-estimated-facades-5161.test.mjs` hlídá nové počty a `index.html` používá nový query cache key `v=518400`. Workflow Topolová nově sleduje oba soubory při změně. **CI/Chromium WebGL/Pages výsledek této verze zatím neověřen**, protože přístup k výstupům Actions není potvrzen.

---

## Milovice RP 5.183 — oprava životního cyklu pěší mise (20. 11. 2026)

**Oprava hratelnosti:** nová pěší doručovací mise Topolová z 5.179–5.182 se předtím při resetu hráče tlačítkem `R` a při výběru nového spawnu / oblasti / vozidla **nerušila**, přestože stávající autobusová mise ano. Hráč se tak mohl přemístit mimo Topolovou se starou aktivní misí, zavádějícím navigačním HUDem a minimapou. Nyní `reset()` i `rpSelectSpawn()` nastaví `topolovaFootJob5179=null` ve stejném místě, kde ruší autobusovou směnu, ještě před obnovením uživatelského rozhraní. Rozpracovaná mise se při resetu či novém startu ruší **bez odměny**; zůstává možné ji znovu zahájit po načtení Mladé a při chůzi. Ostatní dopravní a mapové procesy beze změny.

Přidán statický regresní test `scripts/osm-topolova-foot-lifecycle-5183.test.mjs`, kontroluje obě resetovací větve i to, že jedinou cestou připsání výplaty z pěší mise zůstává její dokončení. Mobilní WebGL test `scripts/osm-topolova-entry-survey-webgl-5170.mjs` nově v reálném rozhraní spustí misi, simuluje stisknutí `R` a ověří její zrušení bez změny herního zůstatku. Workflow aktualizováno. Diagnostický getter `window.__miloviceTopolovaFootJobLifecycle5183()` ukazuje, zda pěší mise běží. **Nula nových 3D objektů, budov, mapových změn a cest.**

**CI, WebGL ani Pages stále nelze potvrdit jako PASS pouze z commitů:** při dalším průchodu vývojem zkontrolovat skutečné výsledky Actions a nejdřív opravit případné selhání.

---

## Milovice RP 5.182 — skutečný chodník pěší mise zvýrazněný na minimapě (20. 11. 2026)

**Hratelnost / zobrazení města:** při aktivní fiktivní pěší zakázce Topolová (5.179–5.181) se na herní minimapě zeleně čárkovaně zvýrazní **pouze skutečně mapovaný pěší úsek mezi OSM uzly 12→13 původní západní chodníkové cesty `1314665579`**. Celá původní OSM cesta má 18 uzlů a přesahuje rozsah mise; jiných 17 částí ani domnělé spojky se proto nepřimalovávají jako trasa zakázky. Původní dva uzly souhlasí se zdrojově ověřenými body 3→4 okruhu 5.165 a přímou osou herních waypointů 5.179. Dřívější číslovaný cíl 5.181 zůstává. Barevné zvýraznění existuje **pouze na 2D minimapě**, nepřidává fyzickou cestu, čáru, plot, značku, strom, kolizi nebo mesh do světa. Zlepšuje orientaci, ale nezaručuje, že trasa je ve skutečnosti průchodná či fotograficky zaměřená.

Nový čistý modul `scripts/osm-topolova-foot-path-highlight-5182.js` kontroluje zdrojovou OSM identitu `1314665579`, 18 původních GPS uzlů, úplný hash `476fa89b`, tag `footway=sidewalk` a `surface=paving_stones` i přesnou rovnost původního segmentu s okruhem 5.165. Neodpovídající zdroj se nevykreslí. `index.html` kreslí čárkovanou linii na rotovanou plochu minimapy před vyznačením cíle a zveřejňuje `window.__miloviceTopolovaMissionLineRuntime5182()`. Přidán unit regresní test včetně negativních změn povrchu a GPS a mobilní WebGL test aktivní mise. CI workflow rozšířeno.

**Ověření CI/WebGL/GitHub Pages stále není doloženo:** zapsání souborů do GitHubu samo o sobě nepotvrzuje běh testů ani nasazení. Další úkol: zpřístupnit výstupy Actions/ověřit testy, potom důsledně prioritizovat skutečně vizuální výstavbu celých ulic.

---

## Milovice RP 5.181 — cíl pěší zakázky konečně na minimapě (20. 11. 2026)

**Hratelnost v běžné 3D hře:** nový kontrolní bod existující fiktivní pěší mise **Topolová 5.179** je nyní vidět přímo na **herní minimapě**, podobně jako dříve cíl autobusové mise. Zelená značka `PĚŠKY` ukazuje číslo dalšího checkpointu 1–3, promítá se vůči aktuálnímu natočení kamery a pokud cíl leží mimo mapový výřez, drží se na jeho okraji. **Jde o bodový cíl, ne o navrženou průchozí trasu**; žádná fiktivní spojka ani výkres chodníku nevzniká.

Nový pomocný modul `scripts/osm-topolova-foot-minimap-5181.js` pouze promítá původní herní checkpoint odvozený ze západního OSM chodníku `1314665579` do pixelů minimapy s 72px omezením okraje. `index.html` kreslí značku 2D canvasem až po obnovení rotované mapové vrstvy, takže je konzistentní s orientací minimapy; existující 3D svět, terén, GPS, kolize a NPC beze změn. `window.__miloviceTopolovaFootMinimapRuntime5181()` poskytuje jednoduchý testovatelný stav. Source test ověřuje souřadnice, rotaci, omezení okrajů a nulový počet herních objektů; rozšířený mobilní Chromium/WebGL test spustí skutečnou zakázku, počká na namalování značky, zkontroluje její GPS/pěší zdroj a zruší ji. Napojeno na existující Actions.

**Ověření GitHub CI/WebGL/Pages zatím nepotvrzeno:** veřejnou stránku Actions se aktuálně nepodařilo programově přečíst a GitHub commit status API vrací prázdný seznam, což není potvrzení PASS. Při dalším vývoji nejprve prověřit běh Actions/opravu případných regresí.

---

## Milovice RP 5.180 — směrová navigace pro pěší zakázku Topolová (20. 11. 2026)

**Hratelnost / orientace:** navazující mise `🚶 Pěší doručení – Topolová` (5.179) nyní v HUD ukazuje **šipku k dalšímu ze tří kontrolních bodů**, přepočítávanou vůči aktuálnímu natočení hráčovy kamery. K dispozici je osm směrů `↑ ↗ → ↘ ↓ ↙ ← ↖`; při dosažení modelového okruhu 5 m se zobrazuje `✓`. Zůstává již existující vzdálenost a průběh `0/3` až `3/3`; nastoupení do auta stále nepovoluje postup. Navigace používá **přímý směr k bodu, nikoliv výpočet pěší trasy po ulicích**: neprokazuje průchodnost případných ulic, nenahrazuje mapu a neumisťuje fyzické značky, šipky, sloupy nebo objekty do 3D světa.

Nový čistý modul `scripts/osm-topolova-foot-navigation-5180.js` počítá úhel k existujícím bodům 5.179. `index.html` má nový směr v HUD a zveřejňuje ho i ve stávajícím runtime snapshotu. `scripts/osm-topolova-foot-navigation-5180.test.mjs` pokrývá osm směrů, rotaci kamery, příjezd i neplatné stavy; rozšířen i mobilní Chromium/WebGL test spuštění skutečné mise. Workflow test zahrnuje. **Výsledek CI/mobilní WebGL/Pages po commitu neověřen**. OSM, domy, terén, síť chodníků, počet NPC a kolize beze změn.

---

## Milovice RP 5.179 — první pěší zakázka po skutečné Topolové (20. 11. 2026)

**Nová hratelná funkce:** v již existujícím panelu **💼 Povolání a mise** je **🚶 Pěší doručení – Topolová**. Hráč ji může přijmout pouze pěšky a pouze po načtení původní OSM oblasti Mladá. Tři herní kontrolní body jsou uvnitř **skutečné zaznamenané západní pěší osy Topolová OSM `1314665579`** (využívá zdrojově zamčený uzavřený pěší okruh 5.165, jeho body 3→4), s 5m odstupem od severního/jižního přechodu. Má odměnu **80 herních Kč**, kterou připíše teprve průchod posledním ze tří bodů, a lze ji zrušit bez odměny. Nastoupením do vozidla postup nepostupuje; body je nutné projít pěšky. **Nevytváří skutečnou doručovací adresu, vchod, firmu nebo pracovní trasu**; jde o vymyšlenou herní zakázku položenou na doloženou pěší síť, bez teleportování hráče.

Nový pure `scripts/osm-topolova-foot-job-5179.js` vytváří waypointy z původního zdrojově ověřeného OSM obrysu, vyhodnocuje příjezdy a odmítá neplatné stavové přechody. `index.html` má skutečné ovládání spuštění/zrušení, ukazatel vzdálenosti a počet bodů, výplatu do již existující herní měny i veřejný diagnostický snapshot `window.__miloviceTopolovaFootJobRuntime5179()`. `scripts/osm-topolova-foot-job-5179.test.mjs` ověřuje zdrojovou 5.165 geometrii, tři etapy, pozastavení při jízdě a dokončení až u posledního bodu; mobilní Chromium/WebGL test stiskne reálné tlačítko v načtené scéně a zkontroluje HUD, spuštění a zrušení. CI workflow rozšířeno. **Žádné nové chodníky, budovy, dveře, kolize či mapové souřadnice. CI/WebGL/Pages dosud nepotvrzené; nezaměňovat commit za úspěšný test.**

---

## Milovice RP 5.178 — přirozenější antuka u Topolové / Milten (20. 11. 2026)

**Nová vizuální úprava:** všechny existující, skutečně mapově označené tenisové antukové plochy `leisure=pitch + surface=clay` používají společnou **jemně zrnitou procedurální texturu antuky** místo zcela jednolité plochy. Přímo u Topolové jde o původní kurty Milten v OSM polygonech `612386902` (cca 23 m od osy ulice) a `612386901` (cca 63 m); třetí původní antukový polygon areálu je `612386900`. Zdrojovou sportovní identitu potvrzuje OSM a veřejné popisy areálu se sedmi venkovními antukovými kurty, nikoli přesná aktuální fotografie barvy či struktury. Samotný odstín a zrnitost jsou **herní aproximací**. Již existujících sedm sítí a namalované tenisové čáry z 5.150 zůstávají.

`scripts/osm-clay-court-grain-5178.js` vytváří deterministickou **64×64 RGBA / 16 KiB** texturu bez `Math.random`; renderer `scripts/landscapes.js` používá jediný cacheovaný materiál a sdílenou GPU texturu, nula nových meshů/geometrií nebo mapových zásahů. Runtime `window.__miloviceClayGrainRuntime5178()` ukazuje alokaci a původní OSM ID. Test `scripts/osm-clay-court-grain-5178.test.mjs` kontroluje reprodukovatelnost a mapový podklad, rozšířený mobilní Chromium/WebGL test ověřuje alokaci v běžící 3D scéně. Zapsáno do Actions. **CI/WebGL/GitHub Pages PASS zatím nepotvrzen**.

---

## Milovice RP 5.177 — barevně sjednocená zdrojová dlažba Topolové (20. 11. 2026)

**Vizuální změna v běžné 3D scéně:** tři původní, již herně kreslené pěší OSM trasy `1316882852` (východní chodník), `1314665579` (západní chodník) a `1316882860` (spojovací pěší cesta) mají nyní jednotný jemný odstín materiálu `topolova-paving-stones`, využívající existující procedurální dlažbu. Jejich skutečná OSM data obsahují `surface=paving_stones`; nový modelový odstín **není prohlašován za fotograficky ověřenou barvu**. Jiný povrch, včetně dvou asfaltových zebrových přechodů, se nemění. OSM souřadnice, šířky, DEM, kolize, domy, 7 chodců a doprava zůstávají nedotčené; **žádné nové chodníky ani lampy**.

Source-locked modul `scripts/osm-topolova-paving-5177.js` ověřuje úplné originální OSM hashe každé ze tří cest a jejich `highway=footway`, `surface=paving_stones`; při změně zdroje selže uzavřeně a vrátí stávající materiál. Přidán unit test a mobilní Chromium/WebGL kontrola při reálném načtení Mladé, že materiál je přidělen všem třem. CI workflow rozšířeno. **K okamžiku commitu nemáme potvrzený výsledek CI, reálné WebGL ani Pages PASS**.

---

## Milovice RP 5.176 — opravená viditelnost chodce z technických kamer Topolové (20. 11. 2026)

U sedmého simulovaného chodce na západním OSM chodníku `1314665579` je opraven výběr viditelnosti a vysoké/nízké úrovně detailu při technických kamerách Topolové. Předchozí 5.175 spouštěla správný NPC rig a animaci, ale obecná větev `rpAnimateTraffic` se při rozhodování o viditelnosti dívala jen na vzdálenost od hráče; hráč může být od kontrolní kamery daleko. Teď jsou **u tří zdrojových pěších cest Topolové** (`1316882860`, `1316882852`, a pouze nový `1314665579` s `westWalk5175`) vzdálenost viditelnosti i LOD vypočteny od aktivní kontrolní kamery. Mimo technickou kameru se používá hráč jako předtím. Přibyly živé indikátory `modelVisible/highLODVisible/lowLODVisible` v `window.__miloviceTopolovaWestWalkRuntime()` a aserce v mobilním Chromium/WebGL testu: existence, skutečná viditelnost jedné LOD úrovně a posun po původním chodníku.

Změna nepřidává chodce, chodníky ani nové mapové prvky, pouze opravuje skutečné vykreslování již přidaného sedmého NPC při kontrole. **CI, WebGL, Pages pro 5.176 zatím nejsou ověřené.**

---

## Milovice RP 5.175 — sedmý pohybující se chodec na západním chodníku Topolové (20. 11. 2026)

**Skutečná viditelná herní změna:** nový simulovaný NPC chodec se ve scéně Mladá spawnuje na zdrojově identifikovaném **západním chodníku Topolová, OSM 1314665579**. Používá segment již ověřené uzavřené pěší trasy 5.165 (její uzly 3→4), a existující rig, terénní DEM a pohybovou logiku NPC. Otáčí se modelově **4 m před oběma stávajícími zebrami**, takže přechody nepoužívá a nemá se dostat do provozu. Nová trasa je pouze herní simulace pohybu osoby, ne skutečné chování místních obyvatel. Spawnuje se jeden další chodec vedle dosavadních šesti, bez nových cest, dveří, lamp, parkovacích stání, kolizí či výměny OSM GPS.

`scripts/osm-topolova-west-walker-5175.js` ověřuje převzetí původního západního segmentu a bezpečně vytváří jeho 4m zkrácenou herní trasu. `index.html` spouští skutečný 3D rig, propojuje ho s pohybem a poskytuje testovací snapshot `window.__miloviceTopolovaWestWalkRuntime()`. Unit `scripts/osm-topolova-west-walker-5175.test.mjs` kontroluje zdrojovou geometrii; mobilní Chromium/WebGL test nově po 8,5s LOD kontroluje existenci NPC, zdrojové ID, model ve scéně a reálný posun během dalších 1,1s. Zapojeno do Topolová GitHub Actions. **CI, WebGL a Pages pro 5.175 zatím nemají potvrzený PASS**; pokud test neprojde, jde o otevřenou regresi k opravě.

---

## Milovice RP 5.174 — skutečná topologie pěší sítě Topolové (20. 11. 2026)

Nad inventurou původních OSM cest 5.173 nově běží `scripts/osm-topolova-pedestrian-topology-5174.js`. Ověří identitu původní silnice Topolová **8618275** včetně původního hash `c0fe69b0`, sestaví graf společných OSM GPS uzlů v dostupných pěších trasách do 60 m od osy a vrací sousední trasy, vzájemně propojené komponenty, izolované úseky a kontrolu již používaného čtyřúsekového okruhu z 5.165. **Blízkost dvou čar nestačí na automatické spojení**: bez přesného sdíleného původního GPS uzlu se propojení nevytváří. Původní mapové údaje nejsou pozměněny.

Nový `scripts/osm-topolova-pedestrian-topology-5174.test.mjs` hlídá zdrojovou geometrii, čtyři původní úseky okruhu, obousměrnost grafu, identitu jednotlivých komponent a nulové přidané cesty/kolize. Přidáno do existujícího CI workflow Topolové. **Stav testů a Pages po commitu zatím neověřen**. Nejde o nové chodníky ve 3D ani o důkaz skutečné bezbariérovosti: změna pouze připravuje podloženou navigační síť pro budoucí NPC a cílené kontroly chybějících úseků.

---

## Milovice RP 5.173 — inventura navazujících chodníků a cest podél Topolové (20. 11. 2026)

Nový **source-only audit celé ulice** `scripts/osm-topolova-street-inventory-5173.js` načítá původní OSM `data/regions/mlada.json`, ověřenou řadu 614–618 (5.155) a původní silniční osu Topolové OSM `8618275`. V modelovém pásmu **60 m od silnice** vypíše existující silniční/pěší OSM úseky včetně OSM ID, typu, případného povrchu, osvětlení, přístupu, označení přechodu a vzdálenosti od osy. Rozliší již dříve referované pěší úseky a **další kandidáty k ověření**, aniž by je považoval za nové hotové chodníky. Vzdálenost je geometrická heuristika, nikoli důkaz fyzického propojení ani fotografické správnosti. Nový `scripts/osm-topolova-street-inventory-5173.test.mjs` ověřuje původní silnici, stávající dva přechody a východní chodník, čitelné výsledky a bezzásahovost dat. Test je zapojen do existujícího workflow Topolové; **CI/WebGL/Pages 5.173 čekají na ověření**. Hra vizuálně zatím nezměněna: žádné vymyšlené stromy, lampy, cesty, dveře či parkování. Dalším krokem jsou konkrétní fotodoložené opravy jednotlivých nenavazujících částí celé ulice.

---

## Milovice RP 5.172 — porovnání šesti DEM profilů a mobilní kontrola skutečného kliknutí (20. 11. 2026)

V technických kamerách domů Topolová 616–618 tlačítko **📏 Výšky základů** nově kromě pěti hodnot aktuální fasády ukazuje rozsahy rozdílů základ–modelový DEM pro **všech šest původních východních/západních obvodových stěn** tří domů. Je to kontrolní tabulka v textu, nikoli opravdové zaměření vstupů ani úprava terénu. Mobilní Chromium/WebGL test je rozšířen tak, že po skutečném načtení scény a 8,5 s LOD programově klikne na tlačítko, ověří otevření, aktuální adresu, šest porovnání, varování o neověřeném prahu a opětovné zavření. Statický unit kontroluje i přítomnost této části. **CI/mobilní WebGL/Pages po commitu čekají na potvrzení; PASS bez výstupu běhu netvrdíme.** Žádný nový mesh, strom, lampa, chodník, přechod, dveře ani kolizní objekt.

---

## Milovice RP 5.171 — zobrazit DEM výšku základů přímo v technické kameře (20. 11. 2026)

V šesti existujících pohledech na přízemí Topolová 616–618 je nové tlačítko **📏 Výšky základů 616–618**. Po kliknutí se z živého `window.__miloviceTopolovaEntrySurveyRuntime()` zobrazí právě aktivní skutečná OSM fasáda, ID domu, rozpětí rozdílu základ–DEM a všech pět vzorků po 25 % délky stěny. Znaménko výšky je vysvětlené. Nic se nedopočítává jako poloha dveří: **práh, schody, vchod i fotografie stále nejsou ověřené**. Nezměnily se půdorysy, DEM, kola, chodci, doprava, střecha ani kolize. Unit 5.170 nově střeží i přítomnost této UI kontroly; **CI/WebGL/Pages výsledky po změně čekají na ověření**.

---

## Milovice RP 5.170 — OSM/RÚIAN pohledy na přízemí 616–618 a 30 DEM kontrol výšky (20. 11. 2026)

**Kontrolní kamera, Topolová 617 od východu:** https://foxey-cz.github.io/milovice-life-rp/?v=517000&streetAudit=topolova-entry-617-east-5170. Dalších pět kamer je v rozbalovací nabídce technických pohledů: západní 617; obě dlouhé fasády 616 a 618.

- **Šest konkrétních úhlů bez vymyšlených dveří:** Východní a západní dlouhá fasáda každého z původních domů **616 (OSM 61979144/RÚIAN 22968083), 617 (61979139/22968091), 618 (61979145/22968105)**. Souřadnice cílových bodů jsou **přímo středy původních OSM hran [1,3]**, kontrolované hashi půdorysů `ace63062`, `43ca97b1`, `b69a7ef6`. Virtuální kamera je **modelově 8 m před stěnou**, heading je přibližně 270° z východu / 90° ze západu. **Není to fotopozice z Panoramy ani z veřejného snímku**; jde o konkrétní herní úhel pro následné srovnání se skutečným záběrem.
- **Důležitá kontrola výšky nad DEM:** pro každou ze šesti fasád se skutečný OSM úsek rozdělí na **5 měřicích míst (0 %, 25 %, 50 %, 75 %, 100 %)**. Hra z lokálního načteného DEM a existujících základů `osmInspectionBuildings` vypočítá 30 výšek terénu a rozdíl základ–terén na úrovni každé zdi. Rozdíly jsou dostupné přes `window.__miloviceTopolovaEntrySurveyRuntime()`. Z toho **neodhadujeme konkrétní vchod ani výšku prahu**, protože vstup zatím není fotograficky určen.
- **Co veřejný podklad potvrzuje a co ne:** úřední městský situační plán požární techniky z 10/2023 znázorňuje přibližné okolí celé řady 614–618 a návrh dopravních značek, ale **negeoreferencuje skutečné domovní dveře 616–618**. Podepsané výkresy 614–615 také nedokazují konkrétní pozice otvorů sousedních 616–618. Fasády 5.161 jsou pořád explicitní extrapolace. Nic nebylo svévolně přidáno do terénu, nové prahy/schody/markýzy **0**, dveře **0**, silnice/chodníky/lampy/parkoviště **0**.
- **Testovací plán:** source-locked unit pro všech šest kamer, přesných 30 vzorků, změnu původních GPS (fail-closed) a regrese 5.169/5.161/5.160. Mobilní Chromium/WebGL po 8,5 s LOD má zkontrolovat skutečné načtení budov, modelových fasád, valbové střechy a dopravního řízení. **Ověřeno:** [celková validace CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44642164518), [source/unit a mobilní Chromium/WebGL 8,5 s po LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44642164424), [nasazení GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44642163607). Všechny tři mapované budovy, všech 6 dlouhých fasád, 30 živých DEM vzorků a předchozí 5.169/5.161/5.160 vizuální vrstvy zůstaly funkční.

---

## Milovice RP 5.169 — opravena nepodložená okna na krajních štítech celé řady Topolová 614–618 (19. 11. 2026)

**Technická kontrolní kamera na krajní štít 618:** https://foxey-cz.github.io/milovice-life-rp/?v=516900&streetAudit=topolova-end-gables-5169

- **Konec pětidomového bloku:** OSM/RÚIAN půdorysy a již ověřený zdrojový plán 5.155 přesně určují pět navazujících domů 614–618 a čtyři společné vnitřní zdi. Na obou krajích zůstávají dvě **skutečné krátké venkovní štítové stěny**: **614 (OSM 61979151, geometrická hrana 1, délka cca 11,65 m)** a **618 (OSM 61979145, hrana 2, cca 11,55 m)**. Jejich polohu, směr, připojení ke společnému valbovému krovu a přesné zdrojové hash ověřuje nový modul `scripts/osm-topolova-end-gables-5169.js`.
- **Konkrétní oprava scény:** původní generický vykreslovač měl stále právo přidávat na dvě nepodložené štítové stěny náhodná okna, dveře a ozdoby. Nyní se **právě tyto dvě zdrojové hrany přeskočí**, ale fyzické stěny, original OSM footprint, terénní základ, společná valbová střecha 5.160 i dlouhé fasády 614–615 dle městských výkresů a označené modelové fasády 616–618 zůstanou nedotčeny.
- **Rozlišujeme přesnost a nejistotu:** městské podepsané výkresy 2024 se vztahují na východní/západní dlouhé fasády č. 614/615; **neověřují rozmístění oken či vstupu na severním/jižním krajním štítu**. Neprohlašujeme proto štíty za bezokenné ve skutečnosti — pouze odstraňujeme *nepodložený generický vzor* do doby fotoověření. Ani polohy vchodů 616–618 nejsou fotoověřené; neimprovizujeme je.
- **Náklady a testy:** 0 nových modelů, textur, materiálů, kolizí, přechodů, pěšin, stromů, lamp, parkovacích míst a fyzických vchodů. Source-locked unit (oba štíty a sdílené hrany) + regrese 5.161/5.160/5.159, mobilní Chromium WebGL přes 7,7 s LOD a kontrola celého pětivchodového bloku. **Ověřeno:** [kompletní CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44589104974), [zdrojový unit a mobilní WebGL 7,7 s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44589104961), [regrese původních 5.161 fasád PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44589105255), [5.160 valbová střecha PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44589105336), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44589103679).

---

## Milovice RP 5.168 — skutečné setkání dvou protijedoucích AI aut s chodcem na SEVERNÍ zebře Topolové (19. 11. 2026)

**Kontrolní kamera/scénář:** https://foxey-cz.github.io/milovice-life-rp/?v=516800&streetAudit=topolova-north-encounter-5168&encounterTest=1

- **Druhá strana ulice pod kontrolou:** na původním OSM severním přechodu **1316882853** přes původní silnici **8618275** ověřujeme na mobilním Chromium/WebGL skutečný pohyb dvou AI vozidel z opačných směrů. Oba testovací vozy používají **originální drivable OSM úseky** Topolové [1] (příjezd z jihu) a [2] (příjezd ze severu), startují modelově 13,5 m před mapovou osou zebry a jedou rychlostí 8 m/s. Identita cesty a přechodu je source-locked na GPS a OSM hash `c0fe69b0`; žádná fyzická cesta či přechod není přidán.
- **Reálný pohyb bez přepisování běžné AI:** obě auta jsou skutečné herní mesh/rig modely a pohybují se beze změny přes existující `rpAnimateTraffic`, s předností z 5.166. Jediný chodec používá původní 5.165 chůzi po mapované smyčce. Aby se test nemusel prodírat celým cca 223m okruhem, **výhradně při inicializaci testu** začne na původním západním chodníku **0,7 m před severní zebrou**, což je **testovací spawn**, ne důkaz skutečně absolvované cesty od jižního přechodu. Výchozí poloha je přesný zdrojový GPS bod na existující pěší linii. V normální hře se NPC spawn ani jeho trajektorie nemění.
- **Důsledná izolace:** scénář se aktivuje výhradně kombinací `streetAudit=topolova-north-encounter-5168` a `encounterTest=1`. Žádná změna počtu vozidel v běžné hře. Oba modelové vozy musí na severní zebře bezpečně dobrzdit, chodec se zdrží před obrubou, pak přejde na východní chodník, a **oba vozy se po přechodu rozjedou**. Každému autu se zvlášť měří přednost, zpomalení, nejmenší vzdálenost při obsazeném přechodu a pokračování. Původní jižní scénář 5.167 není odstraněn.
- **Kontroly a nejistoty:** nový unit zdrojových ID, návaznosti a dvou jízdních směrů, fail-closed při změně OSM; mobilní WebGL po nejméně 7 sekundách LOD ověřuje celý sled skutečných událostí, zachování starší pěší sítě, modelů fasád a kompaktního menu. Modelová hranice 3,5 m je aproximace přednosti, ne geodeticky ověřená zastavovací čára. **Ověřeno:** [celková validace CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44584327991), [mobilní Chromium/WebGL s reálným pohybem dvou aut a chodce PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44584327941), [regrese jižního přechodu 5.167 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44584328052). Video se nenahrává; screenshot a testovací log jsou dostupné jako GitHub Actions artefakt. Obě vozidla nejdřív dala přednost, poté se rozjela, po dobu obsazení zebry nebylo porušeno modelových 3,5 m. **[GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44584706483)** včetně dokumentační aktualizace po ověření WebGL.
- **Nulové nové pevné objekty:** žádná silnice, přechod, chodník, zástavba, vchod, parkování, lampa, strom, semafor, značka ani kolizní objekt. Cílem je robustnost dopravní simulace, nikoliv prokázání univerzální bezpečnosti provozu.

---

## Milovice RP 5.167 — skutečný 3D scénář potkání NPC a auta na Topolové (19. 11. 2026)

**Kontrolní kamera / scénář:** https://foxey-cz.github.io/milovice-life-rp/?v=516700&streetAudit=topolova-encounter-5167&encounterTest=1

- **Co bylo ve 5.166 ještě neověřené:** tehdejší mobile WebGL ověřoval aktivní modul a chodce, nikoliv dokončené setkání *jedoucího auta* s *čekajícím chodcem*. Nová 5.167 přidává deterministický test do existujícího render/traffic loopu: model běžného AI auta se vloží **pouze na zvláštní technické kontrolní URL s `encounterTest=1`**, 13,5 m před skutečným OSM uzlem jižního přechodu. Používá totožný 3D model, reálný silniční segment, GPS a aktualizaci běžné AI. Žádné mockované posouvání auta ani teleportování chodce, žádná změna normálního počtu dopravních NPC. Na obyčejné URL nové testovací auto nevznikne.
- **Původní a source-locked:** silnice OSM **8618275** hash `c0fe69b0`, skutečná jižní zebra **1316882854**, současná 5.166 přednost a **původní chodec 5.165** na reálném 222,740m okruhu. Při změně ID, přechodu, uzlů, mapového dopravního segmentu nebo řídicího modulu se scénář nespustí. Modelová rychlost AI auta 8 m/s, zkušební odstup 13,5 m a předchozí 3,5 m před přechodem jsou herní parametry, ne skutečné měření silnice.
- **Kritéria v novém mobilním WebGL testu:** nejprve nejméně 6,5 s skutečného renderování pro LOD, poté čekat na **reálně zaznamenané**: chodec stojí před obrubou, AI auto skutečně brzdí a dojede do zastavovacího odstupu; chodec přejde jižní zebru na západní chodník; vozidlo neporuší 3,5m modelovou hranici během přecházení a **po uvolnění přechodu pokračuje**. Test používá existující aktéry a fyzické herní aktualizace, ne simulovaný izolovaný výpočet. Připravena screenshotová kontrola a unit source/drift testy; **Ověření dokončeno:** [celková validace CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44551388868), [speciální mobilní Chromium/WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44551389164), [nasazení GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44551387919). Test po >6,5 s LOD vyčkal na skutečnou posloupnost: chodec čekal, AI auto v reálné aktualizaci brzdilo a zastavilo, chodec přejel mapovanou jižní zebru na západní chodník, vozidlo během obsazení zebry nepřejelo modelovou 3,5m mez a poté se znovu rozjelo. Záznam/screenshot je v CI artefaktu. Jde o jeden kontrolní scénář, nikoli garanci úplné dopravní bezpečnosti.
- **Geometrie se nemění:** žádný nový chodník, přechod, silnice, domovní vchod, lampa, strom, parkovací stání ani kolizní prvek. Mobilní výkon, starší budovy i pěší sítě se regresně kontrolují. Technická kamera není dokumentační fotografie. Jde o jeden kontrolní scénář, nikoliv důkaz chování všech AI aut v celých Milovicích.

---

## Milovice RP 5.166 — přednost vozidel u dvou existujících přechodů Topolové (19. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=516600&streetAudit=topolova-priority-5166

- **Dopravní AI:** auta simulace na původní silnici OSM 8618275 zpomalují při blížícím se/přecházejícím NPC u přechodů 1316882854 a 1316882853. Orientace silnice a čtyři směry nájezdu jsou kontrolovány podle skutečných původních GPS uzlů, hash c0fe69b0. Modelový odstup zastavení od osy přechodu je 3,5 m, nejde o geodeticky ověřenou čáru. Ostatní silnice/vozidla mimo tento blok se nemění.
- **Interakce chodce:** původní šestý NPC z 5.165 na 222,740 m okruhu vyčkává před vstupem na zebru, dokud se auta bezpečně nepřiblíží k modelovému bodu zastavení či neprojedou. Pokud už vstoupil do přechodu, normální AI auta zpomalují. **Auto řízené hráčem se automaticky nebrzdí**; chodec před jeho příjezdem čeká. Lokální gameplay aproximace, nikoli obecně platný certifikovaný systém prevence dopravních kolizí.
- **Nulová nová geografie:** žádné nové silnice, přechody, chodníky, vchody, lampy, rekvizity, auta ani kolize. OSM ID a souřadnice neměněny; při GPS/ID změně se řídící pravidlo vypne, místo aby si vymýšlelo novou mapu.
- **Testy:** nový přesný unit pro všechny směry nájezdu, nesprávné silnice, auto hráče, čekání chodce a vzdálenosti; mobilní Chromium WebGL alespoň 8,5 s včetně LOD a regrese 5.165/5.164/5.163/5.160. **Ověřeno:** [celkové CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44524948616), [mobilní WebGL 5.166 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44524948791), [regrese 5.165 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44524948936), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44524947174). V samostatném WebGL testu je aktivní odpovídající runtime, starší 5.165 zůstává funkční; reálné setkání vozidla s NPC je vhodné ještě otestovat speciálním scénářem.

---

## Milovice RP 5.165 — pěší okruh dvěma existujícími zebrami Topolové (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=516500&streetAudit=topolova-loop-5165

- **Skutečný OSM okruh bez vymyšlené geometrie:** východní dlážděný chodník **1316882852** (body 22→21), existující jižní zebra **1316882854**, západní dlážděný chodník **1314665579** (body 12→13) a severní zebra **1316882853** tvoří **222,740 m dlouhou uzavřenou mapovou linii**. Má 7 doslovných GPS bodů (první = poslední) a 6 původních úseků; oba konce obou zebrových přechodů přesně souhlasí s chodníky, jejich prostřední uzly s existující silnicí **8618275**. Originální hash všech pěti OSM ways se ověřuje při inicializaci; při rozdílu se nové NPC nespustí.
- **Herní posun:** nový animovaný chodec (spolu s pěti staršími **celkem šest místních NPC**) může po okruhu plynule projít oběma mapovanými přechody, z východu na západ a zase zpět, bez teleportu. Je to simulace hráčského světa, nikoliv pozorování konkrétních skutečných lidí. **Pozor: model dopravy zatím nenařizuje autům zastavit před tímto NPC; přednost/zdržení před přechodem je následující práce.**
- **Vědomě beze změn:** žádné další fyzické chodníky, přechody, silnice, vstupy, parkování, kolize, stromy nebo lampy. Původní 5.164 navázaná pěší trasa, další čtyři NPC a fasády 614–618 / 646 i valbová střecha zůstávají.
- **Testy:** nový fail-closed zdrojový unit test přesně kontroluje napojení obou zebrových přechodů, GPS hash, 6 segmentů, uzavření okruhu a nulovou syntetickou geometrii. Workflow spouští také 5.164/5.163/5.162 regresní testy a mobilní Chromium WebGL po **8,5 s**. Po opravě časového předpokladu mobilní test běží minimálně 8,5 s LOD a poté skutečně vyčká, než NPC dokončí jižní zebru na západní chodník. **[CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44418230501), [mobilní Chromium/WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44418230404), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44418229247).**

---

## Milovice RP 5.164 — skutečné propojení pěšiny a Topolové, chodec projde roh bez teleportu (18. 11. 2026)

**Kontrolní kamera na sdíleném OSM uzlu:** https://foxey-cz.github.io/milovice-life-rp/?v=516400&streetAudit=topolova-connected-5164

- **Průběžná pěší trasa místo obracení na hranici verzí:** [OSM pěšina 1316882860](https://www.openstreetmap.org/way/1316882860) se **přesně připojuje na GPS uzel 13** [dlážděného chodníku OSM 1316882852](https://www.openstreetmap.org/way/1316882852). Následuje skutečný původní chodník přes všechny původní body 14–21 za jižním rohem a dále přes původní **102,53metrový** úsek mezi 21–22 podél celé Topolové. Vzniká **196,93 m dlouhá souvislá zdrojová GPS linie**, složená z 10 původních úseků a 11 reálných bodů, bez vloženého smyšleného uzlu nebo nově namalované plochy. Původní OSM geometrii ani silnice neměníme. Přechody 1316882854/2853 zůstávají originální.
- **Skutečná změna herní interakce:** **1 nový simulovaný chodec** používá vlastní malý polyline navigátor: jde ze dvora po originální pěšině přes skutečný spoj, **plynule zahne do dalšího OSM chodníku** a může pokračovat až téměř na severní konec Topolové. 2 m od začátku obslužné komunikace a 4 m před severním skutečným přechodem končí jeho vyznačený rozsah (190,93 m) a teprve tam se obrací. Nepřechází přes vozovku ani nepoužívá smyšlené vstupy do domů. Viditelná animace končetin i správná poloha na původním DEM. Jde o **herní simulaci občana**, nikoli sledovanou skutečnou osobu.
- **Větší živá ulice bez vizuálních výmyslů:** 2 lidé z 5.162 na krátké pěšině + 2 z 5.163 na hlavním chodníku se nijak nemění; přibývá **pátý NPC**, který umí skutečně projít mezi oběma díly. Pro běžné město zachováváme stávající herní silniční graf a NPC; nová navigace je zatím pouze pro tento OSM-zdrojově uzamčený blok. Vykreslovač nepřidává žádný nový chodník, vchod, zebru, parkování, lampu, kolizní geometrii, ani budovu, jen jeden existující low-poly `makeHumanRig`.
- **Testy a důkazy:** fail-closed `scripts/osm-topolova-connected-5164.js` ověřuje GPS hashy obou pěších OSM way a obslužné komunikace, celou pětidomovou řadu RÚIAN/5.155, 5.162 a 5.163, původní spoj, deset fyzicky spojitých segmentů a délky. Čisté funkce pro výpočet pozice a překlápění směru. Nový mobilní Chrome WebGL +7,5 s LOD kontroluje **změnu `sourceWayId` u skutečného NPC přes původní mapový uzel**, návaznost starších NPC/5.160/5.161, terén a zachované nulové street meshe. **[Celkové CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44414690496), [mobilní WebGL 5.164 +7,5s a regrese 5.163 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44414690263), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44414689141).** Dále: napojit další skutečné části pěší sítě přes původní OSM uzly a z fotek ověřit skutečné vchody domů 616–618; nikoli je domýšlet.

---

## Milovice RP 5.163 — Topolová: dalších 102,5 m skutečného chodníku s animovanými chodci (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=516300&streetAudit=topolova-promenade-5163

- **Nová část celé skutečné ulice:** původní mapovaný dlážděný [OSM chodník 1316882852](https://www.openstreetmap.org/way/1316882852) (28 bodů, hash `a50c0251`, `footway=sidewalk`, `surface=paving_stones`, `lit=yes`). Mezi přesnými původními GPS uzly **21–22** je 102,53m přímý pěší pás podél Topolové. Jižní bod je totožný s posledním bodem existujícího zebrového [OSM přechodu 1316882854](https://www.openstreetmap.org/way/1316882854), severní bod s posledním bodem existujícího [přechodu 1316882853](https://www.openstreetmap.org/way/1316882853). Oba koncové přechody **už jsou v OSM**, nic nevyznačujeme ani nevyrábíme. Silnice Topolová [8618275](https://www.openstreetmap.org/way/8618275) vede souběžně a její mapová osa je od chodníku 3,92–4,65m, žádné přestavění vozovky.
- **Hratelná živá ulice:** na dlouhém chodníku přibyli **2 simulovaní NPC** využívající stávající 3D osoby/animace `trafficPeople`, s chůzí tam a zpět po skutečné GPS střednici. U obou zebrových konců se automaticky otočí **4m před křižovatkou**; nevbíhají na silnici ani nepředstírají neexistující průchozí vstupy. Vedle toho zůstávají další **2 chodci na 29,3m původní pěšině** 1316882860 ze 5.162. Tedy celkem **4 lokální pěší NPC na dvou existujících chodníkových úsecích**, nepodložená je pouze simulace lidí, ne jejich trasy.
- **Sousedství a výkon:** žádné nové fyzické chodníky, automobily, přechody, značky, kolize, parkoviště, stromy nebo lampy. Objekty a OSM/RÚIAN půdorysy řady 614–618 z 5.155, fotografie pro 614/615 z 5.159, valbová střecha 5.160 a prozatímní fasády 616–618 z 5.161 beze změn. Ve vykreslovači se pouze připojí 2 další existující low-poly `makeHumanRig` skupiny, **0 street meshů a 0 vymyšlených geometrických ploch**; testy hlídají skutečný pohyb i po >7 sekundách.
- **Ověření:** nový fail-closed `scripts/osm-topolova-promenade-5163.js`, unit s přesnými GPS hashy chodníku, Topolové a obou původních zebrových přechodů; mobilní Chromium/WebGL po 7,25 s LOD s kontrolou změny pozice NPC, DEM a regrese 5.162/5.161/5.160. **[Celková CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44413071918), [mobilní Chromium/WebGL 5.163 a předchozí 5.162 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44413071653), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44413069921).** Další: propojit další zdrojově doložené chodníky do logické pěší sítě a ověřit skutečné GPS vstupy domů 616–618; dokud nejsou doložené, nevytvářet je.

---

## Milovice RP 5.162 — chodci skutečně používají původní pěší trasu Topolová 614–618 (18. 11. 2026)

**Kontrolní kamera (živé NPC):** https://foxey-cz.github.io/milovice-life-rp/?v=516200&streetAudit=topolova-walkers-5162

- **Návaznost celé ulice bez odhadu GPS:** veřejná pěší OSM [1316882860](https://www.openstreetmap.org/way/1316882860), původní hash `35c50c19`, dva uzly, `highway=footway`, `surface=paving_stones`, `lit=yes`, délka asi 29,3 m, tvoří přímé původní napojení mezi koncovým uzlem servisní komunikace [202399863](https://www.openstreetmap.org/way/202399863) a 13. uzlem hlavního chodníku [1316882852](https://www.openstreetmap.org/way/1316882852). Uzly, polohy domů, kolize i průjezdy jsou naprosto stejné jako ve zdroji. V geometrii již existujícího T-napojení jsem nenašla důkaz chybějící plochy; přidávat zaslepený chodník by bylo neodůvodněné.
- **Nová skutečně viditelná RP funkce:** dvě další herní postavy ze stávajícího `makeHumanRig` animovaně chodí právě po této původní OSM pěšině. Převzaty jsou pouze 2 skutečné GPS koncové body a jejich úsečka; oba lidé se otáčejí 2 m před každým koncem, takže zůstávají na dlážděném pásu a neodcházejí do obslužné vozovky, nedoloženého vchodu ani do křižovatky. Samotní chodci jsou **simulace**, nikoliv pozorované osoby. Využívají již existující `trafficPeople` update a 3D rigy, žádné nové textury/uliční draw-meshe. Ostatní kolemjdoucí i doprava si zachovávají původní logiku.
- **Nepředstíráme dokončené vstupy:** přesné pozice dveří 616–618 nejsou doložené, proto žádné nepřidáváme. Výkresy domů 614–615 / 5.159, celá valbová střecha 5.160, šest provizorních fasád 5.161, fyzické chodníky, lampy, auta a kolizní svět jsou beze změn. Žádné nezdokumentované přechody, stání, strom, chodník ani schodiště.
- **Automatizovaná kontrola:** fail-closed `scripts/osm-topolova-mapped-walkers-5162.js`, unit se třemi přesnými OSM hashi a kontrolou 2m bezpečných konců, mobilní Chrome/WebGL 393×852 po 7,35 s LOD, fyzická viditelnost ve scéně, posun obou animovaných pozic a DEM výška postav. Regresní 5.161/5.160. **[Celkové CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44409477126), [nový mobilní WebGL +7,35 s a pohyb NPC PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44409476976), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44409475710).** Další krok: podložené skutečné osy vchodů 616–618 a rozšíření pěšího pohybu pouze po existujících mapovaných cestách.

---

## Milovice RP 5.161 — Topolová 616–618: sjednocený provizorní okenní rytmus, bez domyšlených ulic (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=516100&streetAudit=topolova-inferred-616618-5161

- **Podložená hmota a nepodložený detail jsou striktně oddělené.** ČSÚ/RÚIAN potvrzují 5 nadzemních podlaží pro 616–618 a společné obvodové stěny s 614–615 (5.155); [podepsané výkresy města Milovice 2024](https://zakazky.mesto-milovice.cz/document_184/107a3038c3f90b7000c396e9ce9f9f75-projektova_dokumentace_podepsana-pdf) mají okna i balkonové sestavy **výhradně na 614–615**. [Městská sdělení o bytech 617 a 618](https://www.celakovice.cz/filemanager/files/3095067.pdf) potvrzují některé skutečné balkony, nikoli přesné pozice balkonů či barevný odstín fasád 616–618. Vzor oken pro zbytek pětidomové řady je proto **modelová extrapolace, ne přesná fotorekonstrukce**.
- **Vizuální změna přímo ve hře:** OSM 616=61979144/RÚIAN 22968083, 617=61979139/RÚIAN 22968091, 618=61979145/RÚIAN 22968105; všechny tři mají zdrojový hash fixovaný verzí 5.155. Šest skutečných venkovních OSM hran (východní/west indexy 1 a 3 na každém ze tří domů) nově používá jeden společný **3-mesh GPU batch**: 72 modelových obdélníkových oken, 48 prozatímních okenních/balkonových dveřních sestav a 24 modelových schodišťových oken. Na těchto fasádách je vypnuto šest původních generických fasádních oken, aby nedocházelo k překryvům. Žádné dveřní vstupy, fyzické balkonové desky ani zábradlí nepřidáváme bez přímého dokladu místa.
- **Ulice v okolí:** vedle pětidomové řady už existuje v mapovém podkladu obslužná OSM komunikace 202399863; od jižního okraje navazuje mapovaný pěší úsek 1316882860 s `surface=paving_stones`. [Úřední návrh požárních nástupních ploch 2023, situace Topolová/Tyršova](https://ud.mestolysa.cz/vr2024/vm12/MULL0B02HTSH_0/MULL0B02HTSH/priloha_1446729700_1_MeU_Milovice__Milovice__nastupni_plochy_pro_pozarni_techniku__var_2_sig.pdf) vizuálně označuje prostor mezi 609 a 618 i *navržené* značky B28 a V12c. Tyto značky nejsou důkazem skutečné realizace v roce 2026, proto **se ve hře nepřidávají**. Silnice, navázané OSM chodníky, kolize, terén, umístění objektů, 5.159 fasády 614/615 a společná 5.160 valbová střecha zůstávají nedotčené.
- **Výkon a kontrola:** nový fail-closed modul `scripts/osm-topolova-estimated-facades-5161.js`, unit test s kontrolou původních polygonů a fyzických GPU bufferů; mobilní Chromium WebGL po 7,2s LOD s regresí 5.160/5.159. **[Celková validace CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44406144887), [mobilní WebGL 5.161 po 7,2 s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44406144814), [regrese střechy 5.160 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44406145186), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44406143332).** Dále dohledat fotky 616–618 a skutečné vstupní osy, upravit provizorní rytmus až po konkrétním důkazu.

---

## Milovice RP 5.160 — Topolová 614–618: jedna souvislá valbová střecha doložená městem (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=516000&streetAudit=topolova-hip-roof-5160

- **Oprava zásadní chyby siluety:** předchozí 5.155 a 5.159 vykreslovaly pět samostatných PLOCHÝCH střech na navazujících domech 614–618. [Usnesení Rady města Čelákovic 14/2023](https://www.celakovice.cz/filemanager/files/2973758.pdf), PDF strana 6 a 9, a [27/2023](https://www.celakovice.cz/filemanager/files/3310832.pdf), PDF strana 6, jasně uvádějí pro č.p. 617 a 618 pětivchodový pětipodlažní dům **s valbovou střechou**, bez výtahu. Realita tak neodpovídala pěti plochým poklicím, ale souvislé střešní siluetě celé pětidílné řady. Dokumenty potvrzují též skutečné balkony 1,91 m² u některých bytů 617/618; jejich přesné GPS polohy z těchto inzerovaných dispozic nevyvozujeme.
- **Nový reálný 3D tvar celé pětidílné stavby:** source-lock 5.155 prověřuje původních pět OSM/RÚIAN polygonů (61979151/52/44/39/45 a RÚIAN 22968067/75/83/91/105), 4 doslovně sdílené příčné stěny a 80m délku západního i východního obvodu. **Místo pěti plochých střešních capů teď 1 společný fyzický valbový roof mesh**, deset skutečných dlouhých segmentů obou stran, severní a jižní valbové čelo, 22 trojúhelníků v GPU bufferu. Bez mezer nebo pěti oddělených hřebenů. Výška hřebene **2,25 m nad modelovou okapní hranou** i barva jsou návrhové odhady, nikoliv zdrojově změřené.
- **Nedotčeno:** všech pět originálních OSM GPS půdorysů, 5 podlaží 15,25m (vizuální výška od 5.155), 29 společných RÚIAN spojů v celé mapě, okolní silnice, chodníky, kolize a fasády 614/615 ze zdrojových výkresů 5.159. Úřední ČSÚ uvádí panelové nosné stěny, zatímco městský inzerát používá obecně „zděný“: tato odlišná terminologie **není** podkladem ke změně materiálu/fasád. Nepřidáváme neověřená balkonová zábradlí, vrata, stromy, lampy ani parkoviště.
- **Ověření:** nový modul `scripts/osm-topolova-continuous-hip-5160.js`, source/vertex unit, mobilní Chromium/WebGL +7,0 s LOD a regrese 5.155/5.159/5.157. Runtime `window.__miloviceTopolovaHipRuntime()` kontroluje 5 odstraněných plochých poklic, 1 skutečně připojenou střechu a viditelnost po LOD. **[Kompletní CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44404480704), [nový mobilní WebGL +7,0 s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44404480545), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44404478799).** Další krok: fotografie skutečných balkonů a pěších přístupů 616–618; nehádat jejich pozice z úředních rozměrů bytů.

---

## Milovice RP 5.159 — Topolová 614–615: 4 fasády podle podepsaných výkresů (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=515900&streetAudit=topolova-drawing-614615-5159

- **Nový zdroj reality:** město Milovice / PSK TUZAR, [podepsaná projektová dokumentace k výměně oken, smlouva 2024](https://zakazky.mesto-milovice.cz/document_184/107a3038c3f90b7000c396e9ce9f9f75-projektova_dokumentace_podepsana-pdf); **strany PDF 10 (západ), 11 (východ), 12 (typy a počty)**. Dokládá 5 nadzemních a 1 podzemní podlaží, bílá plastová dvojkřídlá okna rozměru 1 750 × 1 350 mm, sestavy okno + balkonové dveře, obě vstupní osy a oblouková vrcholová zakončení schodišť. Dokument výslovně ponechává společná schodišťová okna a vstupní dveře stávající. Výkresy vznikly před podpisem smlouvy; jde o projektový podklad, nikoliv laserové/as-built zaměření výsledku v roce 2026.
- **Geometrie ve hře:** pouze OSM 61979151 / RÚIAN 22968067 (614, **východní hrana 2 / západní 0**) a OSM 61979152 / RÚIAN 22968075 (615, **východní 1 / západní 3**). Čtyři zcela konkrétní 16m líce dostaly zdrojově založené bílé rámy, modelové rozvrhy 48 obyčejných oken, 32 balkonových sestav, 16 schodišťových okének, 4 optické vstupy a 4 zaoblené nástavby. **6 sdílených GPU meshů** nahrazuje obecné okenní vzory na těchto stranách; původní plné zdi zůstávají. Počty fyzicky vykreslených oken nemusí představovat všechna okna domu uvedená v celkovém výkazu.
- **Omezení a zachování:** ověřeny typy výplní, existence otvorů, jejich základní stavební rozvrh; absolutní mezery, modelová výška 3,05 m/podlaží, stříšky a zaoblené nástavby v metrech nejsou zaměřené. Modelové vstupy **zatím nejsou průchozí** (nevyřezávají kolizní obvod). OSM/RÚIAN GPS, rozložení navazujících domů 616–618, škola, silnice, chodníky a Topolová 646 beze změn.
- **Testy:** `scripts/osm-topolova-drawing-614615-5159.js`, nový unit s přesnými source hashy a skutečnými vertex buffery, mobilní WebGL po 6,9 s LOD a regrese původní řady 5.155. **[Celková CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44399024857), [nová mobilní WebGL +6,9 s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44399025166), [regrese 5.155 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44399025125), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44399022791).** Dále pokračovat fotografickým doložením 616–618 a navazujícího parteru.

---

## Milovice RP 5.158 — Topolová 646: šest krátkých průčelí bez fiktivních oken (18. 11. 2026)

**Kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=515800&streetAudit=topolova-646-short-5158

- **Realismus:** zdrojově uzamčené OSM 53866048 / RÚIAN 25789813 / hash 73d119b1. Kromě dvou 43m foto fasád má budova šest krátkých OSM hran 0,1,2,3,4,6 (délky 6,337/3,452/7,253/3,434/2,874/16,515 m). Dosavadní generický renderer na ně přidával nepodložená okna/vstupní rámy. 5.158 zde tyto detaily nevytváří, ale **původní souvislé krémové stěny zůstávají**. Netvrdíme, že ve skutečnosti na kratších stranách okna nejsou: jejich polohy nebyly ověřeny.
- **Zachováno:** celé GPS/OSM, střecha, dvě fotodoložené dlouhé strany, 32 obloukových podkrovních oken, 4 GPU meshe, kolizní obvod, přilehlé silnice a chodníky. Žádné nové meshe, collider, vchod, auto, parkování ani lampa.
- **Ověření:** unit `osm-topolova-short-facades-5158.test.mjs` + mobilní Chromium/WebGL 6,9 s LOD + regrese 5.157, runtime `window.__miloviceTopolovaShortEndsRuntime()`. **[Celková CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44395744528), [mobilní WebGL +6,9s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44395744503), [regrese 5.157 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44395743730), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44395742263).** Dále dohledat georeferencované fotografie krátkých průčelí a skutečné vstupy.

---

## Milovice RP 5.157 — Topolová 646, dva dlouhé fasádní líce a půlkruhová podkrovní okna (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=515700&streetAudit=topolova-646-both-5157

- **Ověřený přímý fotografický podklad:** [realizace Topolová 646 z roku 2025](https://www.revitalizacebytovek.cz/realizace/topolova-646-milovice), [fotografie č. 2 od vozidel](https://realizace.revitalizacebytovek.cz/images/milovice-topolova-646/milovice--topolova-646-2.jpg?v=1782467203) a [fotografie č. 3 od zeleného plotu](https://realizace.revitalizacebytovek.cz/images/milovice-topolova-646/milovice--topolova-646-3.jpg?v=1782467203). Viditelné jsou světlé omítky, lososové pilastry, 3 běžné řady oken a skutečně **půlkruhová** podkrovní okna ve štítech. Verze 5.156 pokrývala jen jeden 43m líc a podkrovní okna zjednodušila na obdélníky.
- **Teď dva skutečné dlouhé vnější OSM obvody:** source-lock 53866048 / RÚIAN 25789813 / 9 původních GPS bodů / hash 73d119b1, východní hrana 5 má 43,046 m a západní hrana 7 má 43,021 m. Na obou jsou nové krémovo-lososové modely, skutečně triangulovaná **půlkruhová okna** s 10 segmenty oblouku a modelová červená střešní přerušení. Oba staré generické fasádní průchody na těchto dvou hranách jsou zrušeny, aby se nic nepřekrývalo.
- **Ověřené vs. odhad:** fotografie dokládají oblouková okna, členění a opakované štíty, nikoli geodetické výšky, všechny rozteče, přesné počty nebo to, kterou fotografovanou stranu přiřadit ke konkrétní OSM hraně. Na *každý* z obou modelových líců připadá odhadovaných 8 štítů, 48 standardních oken a 16 obloukových podkrovních oken, celkem 16 / 96 / 32. Výška stěny 9,15 m, převýšení střechy 2,5 m a původní OSM level=1 zůstávají jako ve 5.156. Žádné naprosto přesné 360° dokončení zatím netvrdit.
- **Výkon a bezpečnost reality:** fyzická scéna používá **jen čtyři sdílené materiálové draw-meshe pro oba líce dohromady**, stejně jako 5.156 pro jeden. Nevytváříme neověřené dveře, chodník, auta, stromy, lampy, parkování ani kolizní objekty. Fotky ukazují vstup i plot, ale neověřené GPS polohy zatím nevkládáme. Žádné cizí fotografie nejsou vložené do herních textur.
- **Testy:** čistý modul scripts/osm-topolova-photo-646-5157.js, source/unit s reálnými geometrickými vertex buffery (mock Three), nový mobilní Chromium/WebGL po 6,9 sekundách LOD; staré 5.156 a 5.155 regresní testy zůstávají. **[Plná validace CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44385453094), [nový mobilní WebGL 5.157 a 6,9s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44385453029), [předchozí 5.156 mobilní WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44385453142), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44385451098).** Původní dvě verifikační chyby byly pouze zastaralé statické řetězce pro staré jednofasádní volání; upraveny v komitu 92c2abf. Závěrečný CI i skutečné WebGL po LOD jsou zelené.

---

## Milovice RP 5.156 — Topolová 646: skutečná fasáda a podkrovní štíty podle fotografií z roku 2025 (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=515600&streetAudit=topolova-646-photo-5156

- **Poprvé doložená skutečná tvář celého bloku:** fotografická [reference firmy, která zateplovala půdu domu Topolová 646, dokončeno 2025](https://www.revitalizacebytovek.cz/realizace/topolova-646-milovice) včetně [fotografie celé dlouhé fasády](https://realizace.revitalizacebytovek.cz/images/milovice-topolova-646/milovice--topolova-646-2.jpg), [záběru pravidelných podkrovních štítů](https://realizace.revitalizacebytovek.cz/images/milovice-topolova-646/milovice--topolova-646-3.jpg) a [pohledu na roh s hlavním vstupem](https://realizace.revitalizacebytovek.cz/images/milovice-topolova-646/milovice--topolova-646-1.jpg). Vidět je **tři standardní řady oken**, světle krémová omítka s lososovými svislými pásy, červená členitá střecha a řada podkrovních štítů s okny. Fotografie se do herních textur nekopírují.
- **Významný nesoulad mapového počtu pater a skutečného vzhledu:** [ČSÚ iRSO Topolová 646](https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=1914643&hkodcis=43&idob=1031339361&kod=537501&kodcis=43&kodpol=nnnnnn) potvrzuje **bytový dům**, **27 bytů** a zděné nosné stěny, ale v poli *počet všech podlaží* uvádí **1** a *nadzemní podlaží* má **nezjištěno**. OSM 53866048 / RÚIAN 25789813 / hash 73d119b1 přebírá jednu úroveň. Foto přitom jasně ukazuje více řad. Korekce je proto **vizuální podle fotografie**, nikoliv tvrzení o úředně potvrzeném přesném počtu všech podlaží; zdrojové GPS a tagy necháváme beze změny.
- **Změna v reálné ulici:** ze staré 3,05metrové budovy nově model tří vizuálních fasádních pater (3 × 3,05 m = **9,15 m**) a střešní skořepina tvořená na přesném nepravidelném půdorysu s přibližně **2,5 m** převýšením. Jeden modelový dlouhý 43m líc má slonovinový povrch, lososové pilastry, **48 modelových oken** a **osm podkrovních trojúhelníkových štítů se 16 modelovými okny**, ve čtyřech sloučených vykreslovacích materiálech. Čísla 8/48/16, délky podkrovních dílů, výška a *přiřazení foto-zachycené strany ke konkrétní východní OSM hraně* jsou výslovné **modelové odhady**; fotografie neobsahují georeferencovaný kamerový azimut.
- **Žádná fiktivní geografie:** OSM way má všech původních 9 GPS bodů, obě dlouhé stěny cca 43,05/43,02 m, RÚIAN zůstává; beze změny je přilehlá silnice Topolová, chodníky, kolizní obvod, sousední dům 647 a celé 614–618. Dokud nemáme přesnou polohu, **nepřidáváme odhadované dveře ani přístřešek**, přestože fotografie prokazuje existenci vstupu. Firma použila název „rodinný dům“, ale úřední záznam jasně říká **bytový dům**.
- **Nová technická kontrola:** source-lock modul scripts/osm-topolova-photo-646-5156.js, jednotkový test, mobilní Chromium/WebGL po 6,8 sekundách LOD a regresní kontrola 5.155; připravena Actions workflow. **[Kompletní CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44382755580), [mobilní WebGL +6,8s LOD a regrese 5.155 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44382755851), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44382754821).** Původní test odhalil rozdíl mezi uzavřenými 9 OSM body a 8 jedinečnými vykreslovacími vrcholy; následný běh správně vygeneroval střechu i 4 sloučené fasádní meshe. Drobné zaokrouhlení Float32 (9,1499996 m vs. 9,15 m) je testováno tolerancí 1 mm. Oba skutečné chyby testovacího očekávání byly opraveny, závěrečný běh PASS.

---

## Milovice RP 5.155 — Topolová 614–618: všech pět panelových domů správně pět nadzemních pater (18. 11. 2026)

**Přímý technický pohled ze zdrojového chodníku:** https://foxey-cz.github.io/milovice-life-rp/?v=515500&streetAudit=topolova-panel-row-5155

- **Odhalená zásadní chyba celé uliční hmoty:** pětidílná souvislá řada panelových domů má OSM RÚIAN půdorysy 61979151 (č.p. 614), 61979152 (615), 61979144 (616), 61979139 (617), **61979145 (618)**. Čtyři první mapují 5 pater, ale 618 chybně 1 patro. To dosud ve 3D dělalo jednopodlažní krajní dům s chybně odvozenou střechou.
- **Úředně ověřeno pro všechny domy:** ČSÚ iRSO uvádí ve všech pěti případech **5 NADZEMNÍCH podlaží**, **10 bytů**, **stěnové panely**; odkazy: [614](https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=533453&hkodcis=43&idob=1003860982&kod=537501&kodcis=43&kodpol=nnnnnn), [615](https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=533454&hkodcis=43&idob=1003860991&kod=537501&kodcis=43&kodpol=nnnnnn), [616](https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=533455&hkodcis=43&idob=1003861008&kod=537501&kodcis=43&kodpol=nnnnnn), [617](https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=533456&hkodcis=43&idob=1003861016&kod=537501&kodcis=43&kodpol=nnnnnn), [618](https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=2173846&hkodcis=43&idob=1003861024&kod=537501&kodcis=43&kodpol=nnnnnn). Údaj ČSÚ o nosných panelech není potvrzením současné barvy fasády nebo viditelnosti panelových spár.
- **Opraven celý souvislý blok bez posunu jediného OSM bodu:** pouze na zdrojově uzamčeném objektu 618 se vizuální počet pater mění z 1 na 5. Nová modelová výška 15,25 m (5 × 3,05 m) je shodná s čtyřmi sousedními 5patrovými domy; jednotlivé metry nebyly zaměřeny. Namísto omylem odvozené šikmé střechy vzniká konzistentní modelová plochá silueta. Sousedních 614–617 se geometricky nedotýkáme.
- **Důležitá návaznost na 5.133:** RÚIAN mapy všech pěti domů sdílejí přesně čtyři obvodové hrany. Dřívější společná stěna **617–618** nebyla zahrnuta, protože univerzální filtr požadoval stejný *původní* počet OSM pater (u 618 mylně 1). Nyní pouze virtuální vstup do vykreslovacího plánu používá úředně ověřených 5 pater, takže **obě vnitřní fasády 617–618** už nedostávají falešná okna ani obvodové detaily. Globální plán RÚIAN má **29 společných stěn / 58 skrytých vnitřních fasád** místo 28/56; originální OSM zdroj zůstává beze změny.
- **Zámky reality a výkon:** všech 5 přesných souřadnicových otisků, RÚIAN ID, 10 bytů a návazné hrany; pokud se mění zdroj, korekce neprojde. Žádná nová budova, silnice, vchod, auto, lampa, strom ani collider. Údaj o tvaru ploché střechy je výpočet modelu, nikoliv fotografie. Testy: unit, mobilní WebGL 6,5 s LOD, starší audit vnitřních stěn, Sluníčko 5.154. **[Kompletní CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44379650843), [nový mobilní WebGL + 6,5s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44379650735), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44379648444).** Zelený mobilní workflow také znovu spustil starý 5.133 audit skutečných RÚIAN vnitřních stěn (29 spojů, 58 skrytých fasád). První pokus měl pouze chybu kontrolního testu (počítal souhrn z runtime místo z auditu), opraveno commitem f2a4741; kód hry testovanou výšku již vykresloval správně.

---

## Milovice RP 5.154 — Topolová 622: západní fasáda podle projektové kalkulace (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=515400&streetAudit=topolova-slunicko-west-5154

- **Nový zdroj:** projektový výkaz prací MŠ Sluníčko pro Město Milovice z 21. 5. 2020, PDF strana 5: https://www.e-zakazky.cz/stazenisouboru/61b37d16-23a5-4b6b-ae61-13e546a3e2ad. Výpočet lešení západní fasády používá (44 + 2×0,9) × (13,15 + 0,5 − 1,8) = 542,73 m². Hodnota 13,15 m pochází z rozpočtové kalkulace lešení, není geodeticky potvrzenou výškou střechy.
- **OSM shoda:** skutečná západní stěna 53865699 má délku 44,429 m (projekt zaokrouhluje na 44 m). Východní stěna je 44,299 m. Původní RÚIAN 26092069, 9 GPS bodů a OSM podlaží zůstávají beze změn.
- **3D změna:** u jediné zdrojově uzamčené hlavní budovy školy nová projektově informovaná výška modelu 13,15 m místo 12,2 m, nadále čtyři vizuálně modelovaná podlaží. Sousední budovy, střešní půdorysy, vozovky, zebry, vchody, kolizní objekty a zelené plochy beze změny. Návrh 55 venkovních žaluzií z roku 2020 není důkaz realizace, a proto je nevykreslujeme.
- **Regrese:** nový zdrojově uzamčený modul osm-slunicko-west-elevation-5154.js a test, mobilní Chromium/WebGL po 6,5s LOD a kontrola vygenerované vertikální geometrii stěny. [plná CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44369930888), [mobilní WebGL + LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44369931011), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44369931396).

---
## Milovice RP 5.153 — MŠ Sluníčko na Topolové: opravená výšková hmota hlavní budovy (18. 11. 2026)

**Kontrolní technická kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=515300&streetAudit=topolova-slunicko-5153

- **Doklad:** [oficiální popis MŠ Sluníčko](https://www.ms-slunicko.com/predstavujeme-ms/) a [inspekční zpráva ČŠI](https://portal.csicr.cz/Files/Get/578617D0-B976-456E-85CB-56E21E47B226?db=Archive) uvádějí čtyřpodlažní hlavní budovu s 11 třídami, Topolová 622. OSM way 53865699 / RÚIAN 26092069 je ovšem na původních 9 GPS bodech (FNV 912f8e04) označen building:levels=2. Zdrojový rozpor je výslovně zaznamenán, data OSM nejsou přepsána.
- **Skutečná změna ve 3D:** pouze původní hlavní budova má vizuální 4 úrovně a výšku 12,20 m (předpoklad 3,05 m/podlaží). Není úředně doloženo, zda jsou všechna 4 podlaží nadzemní ani metrová výška střechy: rozměry a okenní mřížka jsou modelové. Půdorys, předchozí střešní profil, umístění sousedního školního pavilonu 53865700 a okolní chodníky/vozovky se nemění. Nepřibyl žádný další smyšlený vchod, přístřešek, parkovací stání ani lampa.
- **Ochrana a výkon:** nová modulární kontrola scripts/osm-slunicko-storeys-5153.js provádí přísnou kontrolu GPS otisku, OSM/RÚIAN a existence školního jména. Nepřidává nové draw objekty, pouze mění původní budově vizuální výšku. scripts/osm-slunicko-storeys-5153.test.mjs testuje přesnou identitu i zamítnutí chybného zdroje; scripts/osm-slunicko-storeys-webgl-5153.mjs kontroluje mobilní Chromium po 6,5 s LOD a starší halu, Topolovou 647, chodník a přechod.
- **Validace:** [kompletní CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44362924067), [nový mobilní WebGL + 6,5s LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44362924266), [sportovní hala – regrese PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44362924271) a [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44362921967). Starší dlouhý browser smoke test ještě dobíhá; neoznačovat jej předčasně PASS. Kamerový bod je existující OSM chodník 1314665579 (50.2294884, 14.8662864), azimut 50° je odhad, ne foto-shoda.

---

## Milovice RP 5.152 — všechny mapované zebry: české příčné pruhy V7a, ne podélné bílé koleje (18. 11. 2026)

**Přímá technická kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=515200&streetAudit=sportovni-crossing-v7a-5152

- **Opraven skutečný problém 3D renderu, nikoliv nová smyšlená geografie:** generický `planZebraPieces` od staršího vývoje 5.26 maloval **šest podélných bílých pásů ve směru chůze**. To neodpovídá českému dopravnímu značení **V7a**: na běžném přechodu jsou bílé pruhy **rovnoběžné se směrem jízdy vozidel**, tedy **kolmé na OSM směr přecházení**. Podklad: [metodika Ministerstva dopravy ČR k úpravám přechodů](https://md.gov.cz/getattachment/Dokumenty/Veda-a-vyzkum/Certifikovane-metodiky/Silnicni-metodiky/Metodika-doporuceni-pro-realizaci-ci-upravy-u-vybr/Metodika-Doporuceni-pro-realizaci-ci-upravy-u-vybraneho-typu-prechodu-pro-chodce.pdf.aspx). Není to tvrzení, že známe skutečný počet pruhů přímo v Milovicích z fotogrammetrie.
- **Už existující reálné OSM přechody:** v lokálním exportu Mladá má pět `crossing=zebra` skutečně mapovaných polygonů/way, včetně Topolová `way/1316882853` (tři GPS body `50.2304072,14.8663619` → `50.2304105,14.8662962` → `50.2304133,14.8662413`). Žádné OSM GPS, jízdní pruhy ani značkovací tagy se nemění. Jiné mapované `crossing:markings=zebra` nadále fungují, `crossing:markings=no` má přednost a neoznačené přechody bez pruhů zůstávají neoznačené.
- **Správná 3D skladba zebry:** podél původní OSM osy chůze se nyní rozmístí krátké jednotlivé **příčné** pásy přibližně **0,50 m** široké se **zhruba 0,95m** krokem a modelovou **3,40m** šířkou přechodu. Tyto rozměry jsou technické odhady. Každá tyč je vzorkována po cca 20 cm a **oříznuta jen dovnitř modelové vozovky** pomocí již existujícího registru `osmCarriagewayClearance`: žádný bílý pás na sousedním chodníku, do dělicího ostrůvku, mimo asfalt ani na neoznačeném místě. Žádné nové pěší trasy, kolizní objekty nebo falešné přechody. Počet draw segmentů se může podle délky skutečného přechodu lišit od předchozích šesti.
- **Oprava celoměstská, audit na Sportovní × Topolová:** sdílený modul `scripts/reality-walkways.js` využívají veškeré kraje hry. Nový `window.__miloviceZebraV7Runtime()` zobrazuje u konkrétního **OSM 1316882853** skutečně vložený počet bílých pásů a ověřuje pravý úhel mezi osou pruhů a přechodem (pomocí normalizovaného skalárního součinu), barWidth, nulové změny mapových objektů a polohu středu každého pruhu na vozovce.
- **Ochrana starších částí:** samostatný unit `scripts/osm-zebra-v7-5152.test.mjs` včetně testu dělicího ostrůvku, regresní 5.147 test a `scripts/reality-walkways.test.mjs` kontrolují úřední směr i originální GPS. Nová mobilní Chromium/WebGL kontrola po 6,5s LOD zachovává již hotové kurty Milten (5.150), zelený plot (5.151), halu, severní chodník a Topolovou 647. **[Plná CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44358598412), [mobilní WebGL + LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44358598304), [původní 5.147 WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44358598490), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44358597439).**
- **Kamera:** technický OSM bod na západním konci přechodu s odhadovaným azimutem 90°, nikoliv fotografie, panoramatická shoda nebo nové mapované místo.

---

## Milovice RP 5.151 — Sportovní: foto-doložené zelené oplocení a pěší ulička u Milten (18. 11. 2026)

**Přímá kamera v 3D hře:** https://foxey-cz.github.io/milovice-life-rp/?v=515100&streetAudit=milten-court-corridor-5151

- **Skutečný vizuální důkaz:** veřejná [fotografie terasy restaurace Milten](https://milten-restaurant-bar.webnode.cz/galerie-menu/) z galerie Milten Restaurant zachycuje **zelené drátěné oplocení vedle antukového tenisového kurtu a zpevněnou pěší uličku** mezi sportovištěm a budovou. Foto **nemá doložený EXIF GPS ani azimut** a nelze z něj přesně identifikovat parcelu, délky a tloušťky jednotlivých částí oplocení. Fotku jsme do hry nekopírovali.
- **Návaznost reálného bloku:** stávající OSM antukový kurt `612386900` má 5 GPS vrcholů (hash `3dfef3a9`); sousední velká sportovní hala **Sportovní 588**, OSM `53866046`, RÚIAN `27906272`, má 13 GPS vrcholů (hash `b4bc8b6d`). Zvolená **východní hrana kurtu orientovaná k hale** je geometrická modelová interpretace fotografované situace, **ne georeferencovaný fotografický důkaz konkrétního plotu**.
- **Konkrétní 3D oprava okolí:** na původní linii kurtu je nyní přibližně **31 m zeleného průhledného pletiva** s **11 zelenými sloupky** a podél něj úzký **souvislý zpevněný pás 2,10 m**, který mírně kopíruje již existující terén; odhadovaná výška plotu **2,15 m**. Síťovina je řídký model v jednotných linkách; žádné vymyšlené brány, cedule, auta, lampy, zábrany či zahradní vybavení. Barva a rozteč sloupků, šířka uličky i její přesná poloha jsou **neověřené modelové rozměry**.
- **Nejde o novou navigační cestu:** pás je jen viditelný 3D povrch tam, kde fotografie existenci uličky ukazuje; **nepřibyla jediná OSM footway, silnice, kolize či nová geometrie původních budov, hřišť a vozovek**. Vstup do haly a celá západní fasáda zůstaly beze změn.
- **Výkon, GPS zámky a regrese:** modul `scripts/osm-milten-photo-corridor-5151.js` se aktivuje jen při současné přesné shodě GPS a RÚIAN obou objektů. Jeden terénní pás, jeden instancovaný soubor sloupků a jedno pletivo = **3 nové sdílené scény objekty**, bez individuálních stovek meshů. Cílený unit test kontroluje průběh mimo původní tenisovou plochu a zachování zdrojových GPS. Mobilní Chromium/WebGL test po 6,5 s LOD prověří také 7 sítí 5.150, basketbal, halu 5.145, chodníky a Topolovou 647. **[Plná CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44355256678), [mobilní WebGL + LOD PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44355256693) a [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44355255318).**
- **Foto vs. technická kamera:** kamera je na původním GPS rohu OSM kurtu, míří modelově severně. Není odvozena ze skutečné fotografické pozice restaurace ani neumí garantovat přesnou shodu fotek.

---

## Milovice RP 5.150 — Sportovní: sedm tenisových kurtů Milten místo čtyř obecných hřišť (18. 11. 2026)

**Přímá technická kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=515000&streetAudit=pitch-tennis-milten-5150

- **Skutečný sportovní areál:** [Milten Sport Center Milovice, Sportovní 588](https://www.firmy.cz/detail/2256575-milten-sport-center-milovice-milovice-mlada.html) uvádí **7 venkovních antukových dvorců**. Regionální OSM export přitom obsahuje **čtyři konkrétní** `leisure=pitch, sport=tennis` polygony: `612386900`, `612386901`, `612386902` a `1278746589`. Tři první mají OSM `surface=clay`, čtvrtý povrch nemá specifikovaný. Neměníme jeho mapový tag. Nedovozujeme aktuální provozní stav z historického fotopohledu.
- **Oprava celé části ulice Sportovní × Topolová:** tři původní plochy mají skutečný půdorys přibližně **37 × 37 m**, čtvrtá přibližně **38 × 26 m**. Rozvržení dvou běžných kurtů do každé z větších ploch a jednoho do menší (`2 + 2 + 2 + 1 = 7`) odpovídá uvedenému počtu sedmi. **Konkrétní přiřazení, rozteče, lajny, orientace a sítě jsou rekonstrukční odhad podle polohopisné geometrie, nikoliv fotograficky zaměřené body.** Každý nový bod modelu musí zůstat uvnitř originálního OSM polygonu; žádný nový polygon se nevytváří.
- **Viditelná 3D oprava:** místo původních čtyř generických tenisových schémat nyní stejné sdílené plochy používají **63 modelových lajných segmentů** pro sedm kurtů. Doplněno **7 jednoduchých tenisových sítí a 14 sloupků**. Všechny sítě dohromady používají **jen 3 sdílené vykreslovací objekty** (instancované sloupky a horní lemy, společné čárové pletivo); žádné fyzikální kolidery ani smyšlené okolní tribuny či ploty.
- **Přísná ochrana skutečné mapy:** `scripts/osm-sportovni-tennis-5150.js` ověřuje **přesné GPS otisky všech 4 OSM polygonů**. Když se kterýkoli zdroj změní, přídavná rekonstrukce se bezpečně nevykreslí. Ostatní OSM sportoviště i předešlá basketbalová konstrukce 5.142 zůstávají beze změny; jízdní síť, chodníky, budovy, zeleň, materiály a výškový terén se neposouvají.
- **Důležitá hranice reality:** počet *sedm venkovních kurtů* je podložený veřejným popisem areálu; počty 2/2/2/1 na jednotlivých půdorysech a podoba sítí nejsou potvrzené georeferencovanou fotografií. Čtvrtý tenisový OSM polygon nemá `surface=clay`, jeho vzhled proto zůstává obecný. Nová technická kamera používá skutečný GPS roh polygonu, odhadovaný pohled k areálu; fotografie se do textur nevkládá.
- **Kontrola výkonu a předchozí práce:** samostatná unit regrese kontroluje polohu všech sedmi hřišť a nulové změny OSM. Nový mobilní WebGL test po 6,5 s LOD ověřuje sítě, tři skupiny vybavení, dva koše 5.142, halu 5.145 a zděný dům 5.149. **Výsledek CI a nasazení Pages aktualizovat po dokončení GitHub Actions.**

---

## Milovice RP 5.149 — Topolová 647: oprava zděné konstrukce podle ČSÚ (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=514900&streetAudit=topolova-masonry-5149

- **Nový věrohodný úřední zdroj:** Český statistický úřad, [iRSO detail budovy](https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=3443237&hkodcis=43&idob=1035017661&kod=537501&kodcis=43&kodpol=nnnnnn), údaje platné k **1. 4. 2025**, potvrzuje dům **Topolová č.p. 647**, RÚIAN **42429056**, šest podlaží, 60 bytů, výtah a **cihly/tvárnice/cihelné bloky jako materiál nosných stěn**. Eviduje zastavěnou plochu 858 m² a obestavěný prostor 16 888 m³. Poslední dvě položky **nepřepočítáváme na přesnou výšku ani tvar střechy**.
- **Opravený chybný předpoklad 5.148:** počet šesti podlaží **neznamená prefabrikovaný panelák**. U konkrétního OSM/RÚIAN domu `53866045` se odstraní **nepodložené vodorovné a svislé 3D panelové spáry** (včetně generického horního pásu a všech krátkých obvodových návratů). Vnější modelový materiál se mění na stávající sdílený neutrální povrch obytné budovy; **jeho skutečná omítka a barva není doložena**. Ostatní devítka domů Sportovní/Průběžná nepřebírá tuto individuální úpravu.
- **Půdorys a vstup zůstávají:** původních 23 OSM GPS bodů, zdrojový počet podlaží/bytů, dosavadní výška jako *odhad*, střecha, modelová okna a již průchodný modelový vstup s děleným soklem. Jeho skutečné umístění není fotodoložené; nefabrikujeme druhé dveře, přístřešek nebo výtah na střeše. Žádné nové kolize, cesty, zeleň, parkoviště ani doprava.
- **Technický pohled 5.149:** původní OSM bod Topolové (50.2307951, 14.8663268), odhad 80° na východní budovu, nikoli fotoaparát s fotografickou shodou. Tlačítko zdroje odkazuje přímo na ČSÚ; v modelu se nezobrazuje úřední fotografie či text přes fasádu.
- **Ochrana starších verzí:** samostatný modul `scripts/osm-topolova-masonry-5149.js` se aktivuje pouze pokud už přísný zámek půdorysu a RÚIAN z 5.148 prošel. Zkrácená diagnostika prohlížeče potvrzuje nulové panelové spáry **jen pro tento dům**, přítomný vchod, stávající halu 5.145, severní chodník 5.146 a původní přechod 5.147. Aktualizovaný i původní mobilní WebGL test čekají 6,5 sekund po LOD. **CI a Pages ověřit po commitu, PASS netvrdit před doběhnutím.**

---

## Milovice RP 5.148 — Topolová: šestipodlažní bytový dům se skutečným půdorysem RÚIAN (18. 11. 2026)

**Kontrolní 3D pohled:** https://foxey-cz.github.io/milovice-life-rp/?v=514800&streetAudit=topolova-residential-5148

- **Celý navazující uliční blok Sportovní × Topolová:** místo dalšího odhadovaného přechodu nebo lampy dostal existující bytový dům OSM `way/53866045` (RÚIAN `42429056`) na severovýchod od křižovatky skutečně doložené **6 úrovní** z `building:levels=6`; v evidenci `building:flats=60` je **60 bytů**, ne 60 nově generovaných oken nebo dveří. Zachováno všech **23 původních GPS vrcholů** (FNV otisk `aef1ea1b`) a stávající 3D hmota, střecha a poloha.
- **Modelové architektonické členění:** sdílený `planMladaPanelEdge` nyní vykreslí 5 vodorovných podlažních spár a geometricky vhodné svislé spáry podle existujícího algoritmu, se sdílenými instancovanými materiály. OSM **neobsahuje** fotografické rozměry, barvu omítky, počet panelů nebo polohu oken. Části fasády jsou označené jako **model**, nikoli věrná fotogrammetrie.
- **Přízemí bez překryvů:** v místě již existujícího **modelového** vstupu se dělením soklu vytváří čistá mezera 1,89 m, která nezasahuje do dveří; na téže hraně se potlačují modelová přízemní okna překrývající dveře. Bez nedoloženého širokého vstupního přístřešku. Přesná poloha vchodu není fotograficky potvrzena; nepřidává se další budova, parkoviště, stromy, stínidla ani dopravní síť.
- **Bez narušení starších modelů:** vlastní `5.148` audit, původních devět bytových domů Sportovní/Průběžná `5.140` se dál eviduje samostatně, stejně jako jejich `5.143` vchody, hala `5.145`, chodník `5.146` a přechody `5.147`. Sousední dům je přidaný jen do již existujícího rendereru bez nových draw materiálů.
- **Technický směr kamery:** skutečný OSM bod Topolové (50.2307951, 14.8663268), odhadovaný azimut 80° k bytovému domu; **nejde o fotografickou kameru**. Unit test uzamyká GPS, RÚIAN, odstupy dveří a 5 podlažních spár; mobilní Chromium/WebGL čeká 6,5 s po LOD a kontroluje zachování okolí. **Po commitu je potřeba ověřit CI a nasazení.**
- **Regrese menu 5.147:** test hledání `Průběžná` pevně očekával 6 položek, ačkoli jich je správně 7 (přibyly legitimní kontrolní pohledy). Opravená kontrola odvozuje stav z aktuálního počtu zdrojových odkazů a stále vyžaduje původní GPS foto i OSM chodník. Selhání nebylo důkazem chybného zobrazení hry.

---

## Milovice RP 5.147 — Sportovní × Topolová: skutečné mapované zebry (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=514700&streetAudit=sportovni-topolova-zebra-5147

- Na jižním rameni křižovatky Sportovní × Topolová existuje OSM `way/1316882853`, `footway=crossing`, `crossing=zebra`, `surface=asphalt`, původní souřadnice 50.2304072, 14.8663619 → 50.2304105, 14.8662962 → 50.2304133, 14.8662413. Renderer starší zápis `crossing=zebra` ignoroval a nevykresloval bílé pruhy. Nyní rozpoznává i tento historický tag, aniž by měnil OSM.
- Stejnou opravu dostává dalších **čtyři** již existujících přechodů v regionu Mladá: `1316882854`, `1316882858`, `1317645191`, `1317645193`. Nová definice respektuje `crossing:markings=no`; neznačené přechody zůstávají neznačené. Historický tag je v OSM odrazován, ale jeho význam je doložený na [OSM Wiki](https://wiki.openstreetmap.org/wiki/Tag:crossing%3Dzebra).
- Bílé značení používá stávající `planZebraPieces` a je ořezávané podle původní vozovky. Rozměry pruhů jsou modelový odhad, nikoliv geodetické měření. Žádné nové chodníky, GPS, lampy, auta, kolizní objekty ani routing. Severní fotochodník Sportovní 5.146 nadále končí před křižovatkou.
- Nová technická kontrolní kamera stojí na východním OSM konci přechodu a míří přibližně západně (není fotografií). Do běhové diagnostiky se zapisují ID skutečně vykreslených značených OSM přechodů. Přidané cílené unit a mobilní WebGL testy 6,5 s LOD; po commitu **jejich výsledek teprve ověřit**.

---

## Milovice RP 5.146 — Sportovní: severní chodník u sportovní haly (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=514600&streetAudit=sportovni-photo-northwalk-5146

- **Celý uliční řez:** veřejná fotografie [Sportovní (3).jpg](https://commons.wikimedia.org/wiki/File:Sportovn%C3%AD_(3).jpg), Risajanda, 6. 6. 2024, CC BY-SA 3.0, ukazuje po obou stranách vozovky chodníky. Jižní je skutečný OSM `way/1316882852` (`surface=paving_stones`). Severní není samostatně zakreslený podél posledních 59 m OSM Sportovní `way/8618266`.
- **Vizuální oprava, nikoli nová mapa:** doplněný pouze **cca 49 m dlouhý modelový severní dlážděný pás** s úzkou souvislou nízkou obrubou. Vedení je odvozené od existující mapové silnice (hash `e9f06930`), jeho **šířka 1,85 m, konkrétní offset a barva jsou neověřené odhady**. Končí 8 m před křižovatkou Topolová a 2 m od druhého konce segmentu, aby nevznikl vymyšlený přechod ani připojení.
- **Přísná ochrana reality:** přesných 4 GPS bodů silnice a 28 bodů stávajícího jižního OSM chodníku (hash `a50c0251`), okolních OSM pěších tras a ochranných odstupů od jiných komunikací a domů. Pokud novější OSM chodník v tomtéž místě existuje, model má ustoupit. **Žádné nové navigační hrany, kolizní objekty, silnice, zebry, lampy, parkovací místa nebo stromy**.
- **Vykreslení a výkon:** 2 jednoduché souvislé DEM-terénní meshe, stejný sdílený materiál paving jako ostatní chodníky; bez samostatných čtvercových dílků. Mobilní WebGL test čeká na ověření viditelnosti po 6,5 sekundách a kontroly zachování haly 5.145, paneláků a basketbalových košů.
- **Nejistota:** výskyt chodníku je z fotografie 2024; přesné GPS jeho okrajů, chodníkové šířky, nájezdy a dnešní podoba po úpravách nejsou geodeticky doložené. Až bude georeferencovaný as-built, nahradíme tímto podkladem modelový pás.

---

## Milovice RP 5.145 — Sportovní: sportovní hala podle skutečné fotografie (18. 11. 2026)

**Přímý pohled od původního fotoaparátu:** https://foxey-cz.github.io/milovice-life-rp/?v=514500&streetAudit=sportovni-hall-5145

- **Zásadní oprava měřítka skutečné budovy:** zdrojově uzamčený OSM/RÚIAN polygon `way/53866046` (`ref:ruian:building=27906272`, 13 GPS vrcholů, `building:levels=1`) dříve dostával automatických **3,05 metru** jako obyčejná jednopodlažní stavba. Z veřejné fotografie [Sportovní (3).jpg](https://commons.wikimedia.org/wiki/File:Sportovn%C3%AD_(3).jpg) autora Risajanda, 6. 6. 2024, CC BY-SA 3.0, je vidět vysoké kovové opláštění haly na východní straně Sportovní. Počet podlaží **1** zůstává beze změn; výška je nyní **modelový odhad 9,6 m** (nikoliv geodeticky změřená hodnota). OSM půdorys, poloha, dopravní síť a kolize se nemění.
- **Fyzická foto-fasáda na mapované stěně:** původní východní RÚIAN hrana `index=6` (~52,21 m) je přesně odhalená GPS pozici fotografie (50.230950, 14.866606; kompas 277,50°). Nová úsporná instancovaná kovová plocha a přibližně **39 jemných svislých žeber** připomínají světle šedé plechové opláštění skutečné sportovní haly. Počet, rozteč a hloubka žeber jsou *modelový vzhled*, nikoli fotogrammetrie. Na **této doloženě holé stěně** se negenerují stará náhodná okna či fiktivní vstup; o dalších stranách haly nic nevyvozujeme.
- **Neověřené strany:** protože jiné stěny haly nemáme vyfotografované, nebudeme na ně nyní automaticky kreslit třípatrové řady náhodných oken (které by vznikly pouze zvýšením odhadované výšky). Generický modelový vchod je u tohoto objektu rovněž potlačený; konkrétní skutečné vchody se doplní až podle podkladů.
- **Ochrana regionu a výkonu:** žádné nové budovy, chodníky, silnice, stromy, ploty, lampy či kolidery. Modul `scripts/osm-sportovni-hall-5145.js` vyžaduje přesný otisk každého GPS bodu a správné RÚIAN tagy, jinak nezmění nic. Všechny riby mají společnou geometrii/materiál a renderují se pomocí stávajícího GPU instancování, nikoliv jako desítky samostatných draw callů. Fotografie se nekopíruje do textury hry.
- **Testy:** `scripts/osm-sportovni-hall-5145.test.mjs` (RÚIAN, půdorys, pohled, výška, bez náhodných objektů), `scripts/osm-sportovni-hall-webgl-5145.mjs` (skutečné instancované kovové panely a žebra viditelná po 6s mobilní LOD, devět starších paneláků a basketbal zachován). CI výsledek ověřit po commitu.
- **Nedoložené části:** přesné rozměry, konstrukce střechy, zadní stěny a vnitřní prostory haly nemáme, jejich vizuál zůstává starší modelový. Fotografie z 2024 automaticky nedokládá 2026 stav Sportovní po úpravách.

---

## Milovice RP 5.144 — Průběžná/Sportovní: přesné fotografické kamery a viditelné fasády (18. 11. 2026)

**Přímé fotokamery:** [Průběžná 2024](https://foxey-cz.github.io/milovice-life-rp/?v=514400&streetAudit=prubezna-public-photo-5144) · [Sportovní 2024](https://foxey-cz.github.io/milovice-life-rp/?v=514400&streetAudit=sportovni-public-photo-5144)

- **Dvě skutečné veřejné fotografie s EXIF GPS a kompasem:** Risajanda / Wikimedia Commons, CC BY-SA 3.0. [Průběžná.jpg](https://commons.wikimedia.org/wiki/File:Pr%C5%AFb%C4%9B%C5%BEn%C3%A1.jpg) 13. 6. 2024 z GPS **50.230236, 14.864183**, heading **272.09°**. [Sportovní (3).jpg](https://commons.wikimedia.org/wiki/File:Sportovn%C3%AD_(3).jpg) 6. 6. 2024 z GPS **50.230950, 14.866606**, heading **277.50°**. V nové verzi lze skočit přímo na obě GPS pozice a otevřít originální, řádně licencované podklady. Herní výška kamery 1.68m a FOV se mohou mírně lišit od mobilního fotoaparátu; není garantována pixelová shoda.
- **Realističtější městský blok (2 skutečné RÚIAN budovy):** při pohledu z Průběžné jsou z originální fotografie prostorově přiřazeny dvě již mapované budovy: **OSM 53865991** (jižní levá, světlá fasáda s tmavším horním lemem) a **OSM 53865992** (severní pravá, světle zelená fasáda s tmavším lemem). Přidány jsou pouze **dva přibližné tónované omítkové 3D povrchy na fyzicky určených fotograficky viditelných stěnách**, se sdílenou procedural stucco texturou. Zpřesnění barev je **modelový odhad podle snímku z roku 2024**, nikoliv zaměřené RAL a nikoliv doklad stavu po přestavbě 2025.
- **Žádné falešné detaily:** ostatních sedm vyšších domů, všechny nefotografované fasády, zdrojové OSM půdorysy, existující okna, dveře, vchody, balkóny, střechy, silnice, chodníky, parkování, stromy a lampy se **nemění**. Ani jeden pixel fotografie se nestahuje či nevkládá do herních textur; zdroj je jen hypertextový odkaz s autorem a licencí.
- **Kontrola po načtení:** `window.__milovicePrubeznaPhotoFacadeRuntime()` audituje skutečné instancované omítkové panely, jejich materiály a viditelnost po 6 s LOD. Unit test a samostatný mobilní WebGL test byly přidány do CI; výsledek se zapisuje až po doběhnutí.
- **Do budoucna:** na dvou přesných 2024 kamerách porovnávat celý viditelný 360° kontext, nikoliv pouze jednu fasádu. **2025 práce na Průběžné** jsou doložené městskou veřejnou zakázkou, ale do doby získání georeferencované výkresové dokumentace neopravovat naslepo přesné polohy lamp, obrub a parkovacích stání.

---

## Milovice RP 5.143 — Sportovní / Průběžná: přízemí a vchody devíti bytových domů (18. 11. 2026)

**Přímá mobilní kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=514300&streetAudit=sportovni-entrances-5143

- **Oprava napříč skutečným blokem:** devět přesně identifikovaných panelových domů RÚIAN/OSM ze 5.140 dosud dostávalo 1,3 m vysoký **sokl i přes modelový vchod**, takže se mohl graficky překrývat se spodkem dveří. V nové verzi se pouze na stejné původní vstupní hraně sokl rozdělí na dva segmenty s čistým otvorem **1,89 m**, v úrovni stávajícího modelového dveřního rámu 1,65 m. Žádný nový vchod se nevytváří a světová GPS geometrie, půdorysy, fasády, střechy a podlaží se nemění.
- **Druhá související oprava:** na tomto přesně určeném souboru domů **nepokládáme univerzální 3,2 × 1,6 m modelový přístřešek**, jehož existenci jsme u konkrétních domů neměli podloženou fotografií. Dveře, stávající modelový rám a výškově ukotvený práh zůstávají; skutečné umístění dveří je zatím *modelová volba dle mapované ulice*, nikoli ověřený vchod. Ostatní paneláky mimo těchto devět domů se nemění.
- **Třetí oprava:** v přízemí se vynechávají pouze okna, jejichž **skutečný modelový rám o šířce 1,40 m** by se fyzicky překrýval s 1,65 m vstupním rámem (+8 cm rezerva), místo původního pevného ±9,5% intervalu na všech fasádách bez ohledu na délku. Horní patra a okna ostatních budov zůstávají nedotčená.
- **Ochrana reálných zdrojů:** `scripts/osm-sportovni-entrances-5143.js` je aktivní jen pokud projde původní 5.140 kontrolou všech devíti RÚIAN ID, podlaží a GPS vrcholů. Fasáda a vchod jsou nadále **model**, žádná fotografie ani 360° zaměření. Nulové nové budovy, chodníky, ploty, kolize, parkoviště či lampy.
- **Testy:** `scripts/osm-sportovni-entrances-5143.test.mjs` ověřuje všech devět původních polygonů, přesné mezery v soklu, nezávislost na okolních budovách a nekolizi modelových přízemních oken. `scripts/osm-sportovni-entrances-webgl-5143.mjs` kontroluje reálné instancované sokly po 6 s mobilního LOD, dřívější devět domů, deset rohů chodníků a dva basketbalové koše. GitHub Actions výsledek ověřit po commitu.
- **Pozice kamery:** původní mapovaný pěší bod `1278746588`, **50.2308681, 14.8624701**, směr **147°** jako dosavadní technická kamera 5.140, ne fotograficky totožný úhel.

---

## Milovice RP 5.142 — Sportovní: dva mapované basketbalové koše (18. 11. 2026)

**Přímá 3D kontrola:** https://foxey-cz.github.io/milovice-life-rp/?v=514200&streetAudit=sportovni-basketball-5142

- **Nové skutečné 3D modely:** na již existujícím venkovním basketbalovém hřišti přibyly **dvě konstrukce košů**. Nezakládá se nový sportovní areál ani nové navigační/kolizní objekty. Každý koš má úspornou stojnou konstrukci, rameno, desku s orientačním značením a obroučku (celkem 10 malých meshů pro oba). Model nezobrazuje nedoložené sítě, osvětlení ani ploty.
- **Mapový důkaz počtu a polohy plochy:** původní OSM `way/1278746587` je `leisure=pitch`, `sport=basketball`, **`hoops=2`**, `access=yes`, `lit=no`; polygon má 6 původních GPS bodů. Celý jeho otisk i počet dva jsou kontrolované a změna jediného bodu ochranu vypne. Fyzické modely jsou vedené pouze uvnitř již existujícího obrysu hřiště a při dodržení odstupu od silnic a budov.
- **Přesnost:** OSM dokládá hřiště a dva koše, **ne přesné polohy jednotlivých stojanů, typ, barvu, výšku ani konstrukční provedení**. Umístění naproti sobě odvozuje model ze směru původního hřiště (cca běžný herní basketbalový layout); všechny tyto detaily jsou viditelně označené jako přibližný **model**, nikoliv fotografie dokončené reality.
- **Bezpečnost:** `scripts/osm-sportovni-basketball-5142.js` vytváří pouze dvě malé grafické skupiny bez fyzických koliderů. Původní značení hřiště 5.99, pěší napojení 5.141, devět domů 5.140 a veřejný OSM silniční graf zůstávají nedotčené. Mobilní skupiny jsou registrované přes vlastní LOD souřadnice. Testy: `scripts/osm-sportovni-basketball-5142.test.mjs` a `scripts/osm-sportovni-basketball-webgl-5142.mjs`.
- **Kamera:** OSM `footway/1278746588`, GPS **50.2310064, 14.8624583**, technický směr **320°** k hřišti. Není to foto ani spárovaný panoramatický úhel.

---

## Milovice RP 5.141 — pěší trasy a návaznost okolí Sportovní mezi bytovými domy (18. 11. 2026)

**Kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=514100&streetAudit=sportovni-estate-joins-5141

- Po nové fasádě devíti 8/9podlažních budov (5.140) navazujeme **pěší částí skutečného sídliště**. Pět původních, již renderovaných OSM tras `1046197807`, `1046197808`, `1046197810`, `1278749454` a `1278749456` je zdrojově uzamčeno všemi vrcholy GPS a tagy. Místo přidávání falešných chodníků doplňujeme **10 malých rohových trojúhelníků**, které spojují asfaltové a dlážděné segmenty v jejich **původních vnitřních zatáčkách**.
- Rozdělení rohů: 1046197807 (**3**), 1046197808 (**3**), 1046197810 (**1**), 1278749454 (**2**), 1278749456 (**1**). Geometrie je stejná jako u ověřené opravy chodníků v Mladé 5.106, ale s jiným samostatným územím a samostatnými specifickými OSM ID. Rohem nevzniká nový průchod, nový chodník nebo navržená křižovatka.
- **Bezpečnost:** každý roh musí projít testem `osmCarriagewayClearance` a `taggedSidewalkBuildings`, tj. nic se nevykreslí do vozovky ani budovy. OSM `1278749453` a `1278749455` zůstávají **neznačené přechody**. Na cestách `1046197808` a `1278749454` používají nové trojúhelníčky **stejnou projektovou barvu dlažby** jako dřívější 5.134 a 5.139, takže nevznikají asfaltové výplně v přebarvených chodnících. Materiál je návrh, ne fotografie dokončeného úseku.
- **Zeleň:** v této části exportu OSM nejsou dostatečně přesně zakreslené travnaté polygony a jednotlivé stromy pro okolí daných devíti domů. **Nevymysleli jsme tedy žádné nové stromy, zelené pásy, lavičky, lampy ani parkovací stání.** Existující tenisové a basketbalové plochy zůstávají vykreslené staršími OSM moduly bez změny.
- Nový modul `scripts/osm-sportovni-estate-walk-5141.js` využívá zdrojově ověřený plánovač 5.106, vytvoří pár společných materiálových meshů namísto deseti jednotlivých renderovacích objektů a na telefonu má vlastní kontrolu viditelnosti po LOD `window.__miloviceSportovniEstateWalkRuntime()`. `scripts/osm-sportovni-estate-walk-5141.test.mjs` ověřuje původních pět tras, veškeré GPS vrcholy i oba neznačené přechody. `scripts/osm-sportovni-estate-walk-webgl-5141.mjs` potvrzuje živou 3D geometrii na mobilním Chromium.
- Kamera stojí na skutečném bodu OSM `1278749454` **50.2308053, 14.8640133**, orientační směr **275°**; nejde o historickou fotografii ani panoramaticky shodný úhel.

---

## Milovice RP 5.140 — Sportovní / Průběžná: devět domů podle skutečného počtu podlaží RÚIAN (18. 11. 2026)

**Přímý 3D záběr:** https://foxey-cz.github.io/milovice-life-rp/?v=514000&streetAudit=sportovni-panel-houses-5140

- **Tentokrát 3D budovy, ne jen povrchy ulic:** devět již existujících bytových domů v okolí Sportovní a Průběžné má v uloženém OSM importu údaje RÚIAN včetně `building:levels` a `building:flats`. **Šest** má **8 podlaží** a **tři** mají **9 podlaží**. Celkem jde o **75 evidovaných podlaží a 400 evidovaných bytů** v tagu budov (nejde o tvrzení o aktuální obsazenosti).
- Původní domy nyní dostávají **průběžné modelové podlažní spáry** na každé z 8/9 mapovaných podlaží a **svislé modelové spáry mezi okny**, znovu používáme sdílenou `archPart('panelSeam')` instancovanou geometrii. Nahradí jednu generickou spáru ve výšce půlky domu, beze změn existujících modelových oken, střech, barev, vchodů, balkónů nebo samotné hmoty domu.
- **Devět chráněných půdorysů:** way/`53865979`, `53865980`, `53865981`, `53865990`, `53865991`, `53865992`, `53865993`, `53865994`, `53865995`. Funkce `planSportovniRUIANPanel` aktivuje fasádu pouze při přesné shodě celé posloupnosti GPS vrcholů, typu budovy, podlaží, bytů a RÚIAN ID. Žádná další budova ani domy kolem hřiště v Mladé nejsou zahrnuty.
- **Zdroj versus odhad:** počty podlaží a půdorysy jsou reálná mapová metadata; jedna výška podlaží 3,05 m, pravidelná okna, spáry a barvy fasád jsou **herní model, nikoliv fotogrammetrické zaměření**. Nikdy z `building:flats=48` neodvozujeme 48 oken, stejně jako nevymýšlíme dodatečné balkóny nebo parkovací stání.
- **Oddělené kontrolní počítadlo** `window.__miloviceSportovniResidentialRuntime()` sleduje devět vysokých domů a skutečná instancovaná 3D data po mobilním LOD. Dřívější audit **22 čtyř–pětipodlažních domů** hřiště Mladá (5.105) musí zůstat nezměněný. Testy jsou `scripts/osm-sportovni-ruian-panels-5140.test.mjs` a `scripts/osm-sportovni-ruian-panels-webgl-5140.mjs`.

---

## Milovice RP 5.139 — Part 28: dlouhý navazující chodník Sportovní (18. 11. 2026)

**Přímá kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=513900&streetAudit=sportovni-sidewalk-5139

- Nový krok k dokončení celé ulice: původní mapovaná severovýchodní pěší trasa kolem domů na rozhraní Sportovní/Průběžné, **OSM way/1278749454**, **24 originálních GPS vrcholů, 23 původních segmentů, délka 162,9 m**, má ve hře materiálový vzhled betonové dlažby. **Žádný nový chodník jsme nevymysleli.** Zdrojový OSM tag `surface=asphalt` stále respektujeme jako starší zachycený stav a nepřepisujeme data.
- **Podklad a jeho meze:** [městská zakázka z roku 2025](https://zakazky.mesto-milovice.cz/contract_display_51.html) výslovně pokrývá opravy chodníků v ulicích **Průběžná a Sportovní** včetně sjednocení povrchů do betonové dlažby. Fotogrammetricky ani geodeticky ale nemáme ověřené, zda **každý metr právě této OSM cesty** prošel přesně touto opravou nebo jaký má dnes barevný odstín. **Jedná se o doložený projektový princip a modelový povrch na bezpečně ověřené trase, nikoli 100% fotografický as-built.** Veřejné ZIP projektové podklady se nepodařilo přímo stáhnout; detailní situační geometrii z nich tedy netvrdíme.
- Na sousedících původních OSM kříženích `1278749453` a `1278749455` je nadále `crossing=unmarked, crossing:markings=no`. **Nekreslíme zde neověřenou zebru** a neměníme jejich pěší navigační trasu. Původní jednosměrná komunikace Sportovní `83076186`, její GPS/body, silniční graf a kolize zůstávají beze změny.
- Celkový modelový betonový materiál v oblasti je nyní použit na **5 starých OSM pěších cestách** (2 z 5.134, 2 z 5.137 a 1 z 5.139). Nový úsek přidává **162,9 m**, celkově tedy cca **512,7 m** původních pěších linií. Nic z toho není nově nakreslená síť tras.
- Ochranný modul `scripts/osm-sportovni-sidewalk-5139.js` kontroluje otisk **všech 24 OSM bodů**, navazující jednosměrnou vozovku i oba neznačené přechody. Unit test odmítne pouhý posun jediného GPS vrcholu nebo nepodložené značení. Mobilní Chromium test `scripts/osm-sportovni-sidewalk-webgl-5139.mjs` ověřuje skutečnou geometrii po LOD, viditelný paver materiál, všech 18 výplní asfaltových rohů a přetrvání předchozích úprav.
- Kontrolní kamera stojí na původním OSM bodu **50.2308115, 14.8639536** a dívá se ve směru mapované trasy **276,4°**. Oproti panoramatické fotografii jde o technické natočení.

---

## Milovice RP 5.138 — Part 28: skutečné asfaltové vnitřní rohy Průběžné × Sportovní (18. 11. 2026)

**Kontrolní záběry:**
- [Západní část – skutečná větev Sportovní](https://foxey-cz.github.io/milovice-life-rp/?v=513800&streetAudit=prubezna-bends-west-5138)
- [Východní část – další větev Sportovní](https://foxey-cz.github.io/milovice-life-rp/?v=513800&streetAudit=prubezna-bends-east-5138)

- **Skutečná herní změna:** šest původních OSM obytných komunikací v sídlišti Průběžná–Sportovní mělo v 3D grafice jednotlivé rovné asfaltové pásy s geometrickými mezerami ve vnitřních zatáčkách. Nový modul `scripts/osm-prubezna-bends-5138.js` vytváří **18 malých trojúhelníkových výplní** pouze v již existující šířce asfaltových pásů (**4 na větvích Průběžné, 14 na Sportovní**). Výplně přebírají skutečné OSM vrcholy, dosavadní modelovou šířku, nadmořskou výšku a materiál. Tvoří součást původní dávky silniční geometrie, nikoli nové samostatné objekty nebo nové silnice.
- **Zdroje:** originální uložené OSM ways `83076186`, `200820420`, `200820424`, `200820425`, `200820426`, `200820427`. Každá ze šesti silnic musí před vykreslením projít kontrolou **všech GPS vrcholů pomocí deterministického otisku**; změna v mapě tuto opravu bezpečně vypne. Přesné as-built obruby nebo skutečnou asfaltovou texturu tím netvrdíme.
- **Nedotčené:** původní průjezdy, centerlines, jednosměrka OSM `83076189` i `83076186`, silniční kolize, navazující chodníky, zebra, parkování a domy. **Nulové nové komunikace, lampy, chodníky, obrubníky, kolidery, stání a dopravní značení.**
- **Dva nové kontrolní směry:** první stojí na OSM chodníku `1278746588`, GPS **50.2308681, 14.8624701**, míří na jih; druhý na OSM chodníku `1278749454`, GPS **50.2303156, 14.8633074**, míří na sever. Jde o technické, nikoli fotorealisticky spárované záběry.
- **Testy:** `scripts/osm-prubezna-bends-5138.test.mjs` musí potvrdit 18 výplní a nulové zásahy do dat včetně negativních kontrol falešné geometrie; `scripts/osm-prubezna-bends-webgl-5138.mjs` kontroluje skutečné vykreslení ve scéně na mobilním Chromium po LOD a současné zachování verze 5.135 a 5.137.

---

## Milovice RP 5.137 — Part 28: dvě původní pěší spojky mezi domy v Průběžné (18. 11. 2026)

**Přímá herní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=513700&streetAudit=prubezna-links-5137

- Nový skutečně viditelný 3D povrch na **dvou původních OSM chodnících** v bytové zástavbě Průběžná: `way/1282219855` (**20,9 m**) a `way/1282219856` (**27,9 m**), dohromady **48,8 m**. Obě mapové spojky mají v uloženém OpenStreetMap importu `footway=sidewalk` a `surface=asphalt` a nyní dostávají stejný úsporný betonový dlažební vizuál jako první dvě pěší cesty v 5.134.
- [Městská zakázka 2025](https://zakazky.mesto-milovice.cz/contract_display_51.html) dokládá výměnu povrchu řešených starých chodníků a doplnění nových mezi objekty. **Přímou fotku definitivního povrchu právě těchto dvou jednotlivých OSM cest ale nemáme.** Jde o pravděpodobný povrchový model podle projektu, nikoli potvrzené as-built zaměření.
- **Bez přesunů** GPS bodů, změn šířky, kolizí, navigační sítě, jednosměrky a hráčské silnice. Nepřibyla žádná nová cesta, zebra, lampa, obrubník ani parkovací místo. Původní 12 úseků asfaltu Průběžné a dvě starší pěší cesty se zachovaly; materiálových pěších průběhů jsou nyní celkem **4**.
- Jedna nová kontrolní kamera stojí na **původním OSM bodu 50.2298232, 14.8625736** a má technický směr **40,6°** podle pokračování mapovaného chodníku. V mobilní nabídce je stále dostupná po ručním výběru a hledání `prubezna`. Nemá označení fotograficky shodné panoramy.
- Regresní ochrany: `scripts/osm-prubezna-links-5137.test.mjs` odmítá změny přesné OSM geometrie a identifikátorů; `scripts/osm-prubezna-links-webgl-5137.mjs` ověřuje skutečné 3D vykreslení, 4 chodníkové materiálové cesty, zachovanou jednosměrku a stabilní mobilní menu.

---

## Milovice RP 5.136 — Part 28: rychlé hledání skutečných kontrolních kamer (18. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=513600&streetAudit=prubezna-road-asphalt-5135

- Po otevření **☰ Vybrat pohled** lze hledat ulici, místo nebo ID pohledu. Vyhledávání funguje i bez české diakritiky (např. `prubezna` → obě současné kamery Průběžné). Během psaní se otevřou jen odpovídající sekce a stránka ohlásí počet výsledků. Po vymazání hledání se obnoví všech 48+ původních přímých odkazů.
- Mobilní výběr nadále začíná sbalený; filtr, seznam, GPS a zdroj jsou dostupné po dobrovolném rozbalení. Žádná původní kamera, metadata, GPS, silniční model, vozidlo nebo OSM import nebyly v této verzi změněny.
- Opravena zastaralá titulková verze 5.125 a identita sestavení 5.133 na aktuální 5.136. Zůstává automatická kontrola shody meta/HUD/runtime build ID.
- Regrese: `scripts/street-audit-menu-5101.test.mjs` chrání všechny původní položky; `scripts/street-audit-menu-webgl-5101.mjs` ověřuje hledání bez diakritiky, prázdné výsledky a obnovení katalogu v mobilním i desktopovém Chromium.
- **Průběžná zůstává geometricky jako v 5.135:** přesné souřadnice 109 parkovacích míst, 22 lamp a neověřených obrub i přechodu nejsou doloženy. Veřejný [profil zakázky](https://zakazky.mesto-milovice.cz/contract_display_51.html) zveřejňuje také ZIP projektovou dokumentaci pro chodníky a vozovku; bez skutečného georeferencovaného zákresu / ověřeného situačního výkresu C.3 netvrdíme, že detaily byly rozmístěny.

---

## Milovice RP 5.135 — Průběžná 2025: opravený asfalt na skutečné jednosměrce (Part 27, 18. 11. 2026)

**Přímá kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=513500&streetAudit=prubezna-road-asphalt-5135

- Veřejná [městská zakázka 2025 – Oprava povrchu chodníků a komunikace sídliště Průběžná](https://zakazky.mesto-milovice.cz/contract_display_51.html) dokumentuje plánovanou výměnu obrusné asfaltové vrstvy cca **400 m** od Tyršovy ke Sportovní ve třech etapách s výjimkami již opravených míst. Projekt rovněž počítá s novými chodníky z betonové dlažby a výměnou obrub o **+12 cm u silnice / +6 cm u zeleně**. **Projekt neobsahuje zaměřené polohy všech hotových hran a konstrukčních spojů použitelné pro náš OSM export.**
- Nový vykreslovací modul `scripts/osm-prubezna-road-5135.js` připustí **jen skutečný OSM way/83076189** (`Průběžná`, `residential`, `oneway=yes`) při naprosto přesné shodě **všech 13 originálních GPS bodů**, ~**256,6 m**, 12 původních segmentů. Původní OSM linky navazujících ulic se **nepřemisťují**. Neprohlašujeme, že tato část zahrnuje všech 400 m z městské smlouvy nebo že hranice vizuální obnovy věrně kopíruje as-built stav.
- **Vizuální změna ve hře:** samostatný, nepatrně tmavší a čistší modelový **asfaltový povrch** na všech 12 mapových segmentech; sdílí již existující procedurální asfaltovou texturu. Jde o odstín pro herní rekonstrukci, **ne ověřenou barvu asfaltu ani ověřené stopy frézování**. Zůstávají stejné šířky, nadmořské výšky, terén, kolize, dopravní graf, jednosměrka, domy i reálné chodníky; nepřibyly vymyšlené čáry, nová silnice, nové obrubníky, stání ani světla.
- **Souvislost s 5.134:** dva předchozí přesně mapované OSM pěší průběhy 1046197808 a 1278746581 (~301 m) zůstaly s modelovou betonovou dlažbou a odpovídajícím materiálovým auditem. Automatický test nyní musí prokázat **12 původních asfaltových segmentů + oba původní pěší úseky** v mobilním Chromium **i po LOD**.
- **Kontroly:** Node `scripts/osm-prubezna-road-5135.test.mjs` odmítá cizí jednosměrky, změny každého GPS vrcholu i nepodložené objekty. Mobilní test `scripts/osm-prubezna-road-webgl-5135.mjs` kontroluje originální OSM navigaci, skutečně vykreslený materiál, nulové nové kolidery a kompaktní nabídku technických kamer. `window.__milovicePrubeznaRoadRuntime()` publikuje výsledky načteného regionu Mladá.
- **Nedoplněná část podle dokumentace:** 109 projektovaných parkovacích stání, 22 nových svítidel a detailní profily obrubníkům zatím chybí georeferencovaný přehled konkrétních poloh. Nepokládáme tyto objekty do ulice odhadem. Město v [zápisu rady 50/2024](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=17347&id_org=9519) výslovně uvádí **koordinační situační výkres C.3** jako přílohu projektu, kterou je třeba pro další přesnější modelování získat a spárovat s body OSM.

---

## Milovice RP 5.134 — Průběžná × Sportovní: asfalt a betonové chodníky z městské dokumentace (Part 27, 18. 11. 2026)

**Kontrolní kamera (mobil i PC):** https://foxey-cz.github.io/milovice-life-rp/?v=513400&streetAudit=prubezna-renovation-5134

- **Prameny:** [Město Milovice: společné povolení Parkování ulice Průběžná, 15. 3. 2023](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=14345&id_org=9519), [Město Milovice: veřejná zakázka opravy chodníků a komunikace Průběžná, 2025](https://zakazky.mesto-milovice.cz/contract_display_51.html). Projektová dokumentace explicitně popisuje betonovou dlažbu na chodnících, asfaltovou obnovu vozovky v délce *cca 400 m od Tyršovy ke Sportovní*, parkování a veřejné osvětlení. Jde o projektové a smluvní informace, **ne fotogrammetrické zaměření hotové stavby**.
- **Co se skutečně změnilo ve 3D:** dva originální pěší OSM průběhy v regionu Mladá — way/**1046197808** (10 mapových bodů, ~251,1 m, dosud bez výslovného `surface`) a way/**1278746581** (7 mapových bodů, ~49,9 m, ve starším OSM `surface=asphalt`) — dohromady ~**301,0 m**. Na existující, silnicemi bezpečně oříznuté povrchové pásy používáme jemně odlišený **modelový povrch betonové dlažby** z již existující herní procedurální textury. Barva, jednotlivý vzor a přesná hranice rekonstrukce jsou odhady; žádné nové úseky pěších cest, obrubníky či geometrie se nepřidávají.
- **Přesné veřejně doložené parametry projektu:** **109 navrhovaných stání**, z toho 94 šikmých a 15 kolmých, **6 míst pro ZTP**, standardní šířka stání 2,50 m, šířky chodníků 1,0–2,10 m, v dokumentaci **22 nových svítidel**. Nejedná se o souřadnice: všech **109 stání, 22 stožárů, značky ZTP i 4×4 m kontejnerová stání zůstávají záměrně bez nových modelů**, dokud jejich přesná poloha nebude ověřena výkresem a fotografiemi. Hra nemění původní jednosměrný OSM way/**83076189**.
- **Automatické pojistky:** `scripts/osm-prubezna-renovation-5134.js` aktivuje povrch pouze na přesně spárovaných zdrojových OSM cestách při načtení Mladé. Kontrolní počítadlo `window.__milovicePrubezna2025Runtime()` zaznamená změněné materiály, ponechané mapové vrcholy a 0 vymyšlených parkovacích nebo světelných objektů. Node test odmítá jiné OSM cesty / změněné označení, prohlížečový mobilní test navíc ověřuje skutečně vykreslený povrch po adaptivním LOD a kompaktní nabídku ulic.
- **Navazující Tyršova × Sportovní:** [Milovický zpravodaj 11/2025, str. 7](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=18977&id_org=9519) potvrzuje nově zhotovený osvětlený přechod. Do hry se ale bez detailní situace stále **nepřidávají odhadnuté pruhy a osvětlení přechodu**.

---

## Milovice RP 5.133.1 — skutečně poslední chybějící společná zeď (Part 27, 18. 11. 2026)

**Kontrolní kamera ve hře:** https://foxey-cz.github.io/milovice-life-rp/?v=513301&streetAudit=tyrsova-sportovni-5133

- Mobilní Chromium test verze 5.133 prokázal **55/56** správně vynechaných vnějších dekorací. Výjimka je původní OSM/RÚIAN obytný dům **way/202381246** u staršího centra, který se nevykresluje přes běžnou fasádu, ale přes oddělený **Hero Architecture** s opravdovými otvory ve stěnách.
- Oprava: **oba** vykreslovače čtou stejný index úplných společných hran podle skutečných OSM vrcholů. Hero renderer na takové straně ponechá **jednu plnou neprůchozí stěnu**, ale **nevytvoří** okna, dveře, soklové pásy, římsy, rámy nebo otvory. Běžný renderer stále vynechá jen dekorace, původní pevná hmota a kolizní půdorysy zůstávají beze změny. Počítadla nově rozlišují **55 obyčejných** a **1 hero** stran.
- Mobilní WebGL test po opravě zveřejnil `PASS 5.133 live Tyršova × Sportovní camera; 28 RUIAN shared walls / 56 empty interior facades after mobile LOD` (běh Actions ze dne 18.11.2026). Původní generický smoke test odhalil ještě dřívější předpoklad, že každá plná stěna musí mít vnější římsu; nově ověřuje 1 skutečnou vnitřní stěnu **samostatně**, místo aby jí přiřadil vnější dekoraci jen kvůli starému počítadlu.
- Oficiální [Milovický zpravodaj 11/2025, str. 7](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=18977&id_org=9519) potvrzuje nově zhotovený osvětlený přechod **Tyršova × Sportovní**. Ve starším uloženém OSM exportu je v této části cesta 1278749455 `crossing=unmarked`. Bez přesného vizuálního nebo geodetického spárování nového přechodu se starou linií zatím **nepřidáváme falešné pruhy ani lampy**. Evidence je uvedena přímo v technické kameře.
- Až jednotlivé GitHub Actions doběhnou, kontrolují `scripts/osm-ruian-party-walls-5133.test.mjs`, `scripts/osm-ruian-party-walls-webgl-5133.mjs`, `scripts/browser_smoke.mjs` a historickou ochranu `scripts/osm-tyrsova-party-walls-5132.test.mjs`. Nový hero modul používá samostatné číslo cache `v=513301`.

---

## Milovice RP 5.133 — Oprava sdílených stěn v Mladé + kontrola Tyršova × Sportovní (Part 27, 18. 11. 2026)

**Přímá technická kamera Tyršova × Sportovní:** https://foxey-cz.github.io/milovice-life-rp/?v=513300&streetAudit=tyrsova-sportovni-5133

**Předchozí hotová řada pěti domů v Tyršově:** https://foxey-cz.github.io/milovice-life-rp/?v=513300&streetAudit=tyrsova-terrace-5131

- Do ulice se nevracíme jen kvůli pěti konkrétním domům: nové čistě geometrické ověření souboru `data/regions/mlada.json` našlo mezi **dvěma samostatnými, přesto přesně sousedícími bytovými objekty** celkem **28 sdílených plnohodnotných RÚIAN hran** (37 různých bytových domů). Včetně 4 společných stěn původní Tyršovské řady to je celkem **56 interních vnějších fasádních hran**, které **nesmějí dostat generická okna, dveře ani fasádní lišty**. V jiných oblastech či na silniční síti nic nepřepisujeme. Nově se opravuje i **24 dalších takových spár**.
- Všechny kandidáty hlídají přesné společné 3D souřadnice **obou koncových bodů téže hrany**, délka 6–21 m, stejné `building:levels` (2–16), `building=residential` a doložený identifikátor `ref:ruian:building` se zdrojem `cuzk:ruian`. Odlišné výšky, jiné typy staveb, blízké ale neidentické rovnoběžné zdi nebo více než dvě překryté stěny jsou z ochrany vyloučeny. Kompaktní hash podle vrcholů hledá spáry v čase úměrném počtu hran, nikoli všemi dvojicemi budov.
- Samotné OSM domy **nepřibývají, neposouvají se a nemění střechy, výšky, kolizní objemy ani půdorysy**. Mění se jen generické **vnější dekorace** na vnitřních stěnách, ponechají se všechny ostatní fasády. Původní samostatný audit Tyršovy 5.132 pořád vyžaduje původních **8 vynechaných vnitřních hran**, nový celkový audit očekává **56**, aby se systémová oprava nemohla nepozorovaně rozbít.
- U Sportovní jsou z uložených OSM zřejmé skutečné navazující komunikace `Tyršova 1331897627` → `Sportovní 8618266` + severní `Tyršova 1331897631`, jednosměrná část `Sportovní 83076186`, pěší crossing `1278749455` ve **starém OSM exportu označený jako neznačený**, bytový dům `53865993` s tagem **8 podlaží** a okolní mapované tenisové plochy. Nový kontrolní záběr je z mapového bodu; jeho směr je technický odhad, **ne fotka ani potvrzení vzhledu fasád**. **Novější oficiální zdroj města to upřesňuje:** zpravodaj Milovic **11/2025, strana 7** potvrzuje **nový osvětlený přechod přímo na křižovatce Tyršova × Sportovní** (https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=18977&id_org=9519). Takže starší OSM tag je v rozporu se současným stavem; zatím nevíme, zda jeho konkrétní čára `1278749455` opravdu odpovídá novému přechodu. **Novou zebru tudíž bez geolokalizovaného zákresu nebo fotografie zatím nepřidáváme** — je potvrzena existence, ne její přesná geometrie. Povrch kurtů a schematické sportovní čáry již zpracovává starší obecný OSM renderer 5.99; v tomto kroku nevznikl nově vymyšlený kurt ani síť.
- Implementace `scripts/osm-ruian-party-walls-5133.js`, zdrojový regresní test `scripts/osm-ruian-party-walls-5133.test.mjs`, živý mobilní Chromium test `scripts/osm-ruian-party-walls-webgl-5133.mjs`. Audity: `window.__miloviceRUIANPartyWallAudit`, `window.__miloviceRUIANPartyWallRuntime()` + dřívější `window.__miloviceTyrsovaPartyWallRuntime()`. GitHub Actions musí potvrdit testy a Pages deployment; samotné commity nejsou důkazem funkčního nasazení.

---

## Milovice RP 5.132 — Tyršova: správné souvislé fasády pěti RÚIAN domů (Part 26, 18. 11. 2026)

**Přímá kontrolní kamera pro všech pět domů:** https://foxey-cz.github.io/milovice-life-rp/?v=513200&streetAudit=tyrsova-terrace-5131

**Navazující Armádní a dvě skutečné zebry:** https://foxey-cz.github.io/milovice-life-rp/?v=513200&streetAudit=armadni-island-zebra-5131

### Zdrojově doložená oprava, bez vymyšlených domů
- Pět existujících souvisejících skutečných OSM/RÚIAN polygonů `61979140`, `61979141`, `61979149`, `61979146`, `61979143` v Tyršově. Všechny jsou v OSM označeny `building=residential` a `building:levels=5`. Vždy dva sousední polygony sdílejí **oba přesné koncové body jedné hranové úsečky** délky přibližně **11,56–11,58 m**. Nejde o souřadnicově hádané „blízké domy“.
- Obecný generátor dříve osazoval dekorativní okna, dveře, vodorovné lišty a panely i na každou společnou vnitřní stěnu dvou domů. Na celé řadě jsou **4 společné stěny**, které ale tvoří **8 vnitřních fasádních hran** v pěti samostatných polygonech. Oprava je odstraňuje z běžného generování fasádních dekorací, zatímco **12 původních vnějších fasádních hran** nadále dostává původní prvky.
- Nový samostatný plánovač `scripts/osm-tyrsova-party-walls-5132.js` určí orientaci každé sdílené hrany přímo z originálních polygonů a společných dvou koncových bodů, nikoliv ze vzdálenosti středů budov. Oprava je striktně omezena na tuto doloženou řadu. Při změně způsobu využití, počtu podlaží, nesouvislosti sousedů, cest OSM či identity budovy se změna **nevykreslí**. Neznámé domy jinde ve městě neovlivní.
- **Běžné solidní objemy budov, stěnové extruze, fyzikální kolize, střechy, základy a původní 5-podlažní výška zůstávají přesně stejné.** Mění se pouze generování vnějších detailů na interních stěnách. Nebyly odhadnuty nové vstupy, barvy domů, balkony, umístění stromů, křižovatky ani čísla dveří; skutečný vzhled jednotlivých fasád dosud **nebyl fotograficky zaměřen**.
- Precompute se provede nad **celou pěticí OSM domů ještě před jejich vykreslením**, aby výsledek nebyl závislý na pořadí načítání. V `window.__miloviceTyrsovaPartyWallAudit` lze vidět 4 spáry, 8 odmítnutých vnitřních hran, přesné indexy každé budovy a skutečně zpracované hrany. `window.__miloviceTyrsovaPartyWallRuntime()` porovnává očekávané a živé počty **1,2,2,2,1** podle jednotlivých OSM ID.
- Nový regresní test `scripts/osm-tyrsova-party-walls-5132.test.mjs` ověřuje originální data v `data/regions/mlada.json` i odmítnutí podvržené geometrie. Rozšířená 3D mobilní kontrola `scripts/osm-tyrsova-armadni-junction-webgl-5131.mjs` čeká po načtení **6,8 sekundy**, ověřuje všech 8 skutečně potlačených hran a zároveň zachování obou dřívějších přechodů s ostrůvky.
- **Aktualita k povrchu ulice:** úřad v květnu 2026 zveřejnil [přechodnou úpravu provozu pro výměnu krytu Tyršovy](https://ud.mestolysa.cz/vr2026/vm05/MULL0B03D324_0.html). Dokument sám nepotvrzuje konečný vzhled každého chodníku či parkovacího místa. Proto dosavadní dopravní trasy a OSM dlažby ponecháváme beze změny a žádné nové obrubníky ani parkovací pruhy podle návrhu **nepřidáváme**.
- Nové zdroje, browser testy a aktuální GitHub Pages je potřeba potvrdit skutečnými výsledky GitHub Actions; samotný commit není potvrzení funkčnosti.

---

## Milovice RP 5.131 — návazná Tyršova, Armádní a dvě skutečně mapované zebry (Part 26, 18. 11. 2026)

**Živé kontrolní kamery:**
- **Tyršova – řada pěti bytových domů + chodník:** https://foxey-cz.github.io/milovice-life-rp/?v=513100&streetAudit=tyrsova-terrace-5131
- **Armádní – přechod zebra s ostrůvkem:** https://foxey-cz.github.io/milovice-life-rp/?v=513100&streetAudit=armadni-island-zebra-5131
- **Předchozí Spojovací / Poliklinika:** https://foxey-cz.github.io/milovice-life-rp/?v=513100&streetAudit=armadni-clinic-5118

### Správná geografie: žádné vymyšlené prodloužení Spojovací
Spojovací OSM `way/246652750` končí na skutečné křižovatce s Armádní; **na sever od Armádní začíná Tyršova `way/8618265` a pokračuje `way/1331897627`**. Oba úseky mají spojité původní OSM uzly a zůstávají jako jeden průjezdný uliční systém. Hra nepřidává umělou silnici ani žádnou novou odbočku. Všechny sousední regionální OSM chodníky zůstávají na původních GPS pozicích.

Podél východní strany Tyršovy tvoří skutečnou bezprostředně sousedící řadu **5 bytových domů dle RÚIAN/OSM** `61979140`, `61979141`, `61979149`, `61979146`, `61979143`. Všech pět má tag `building:levels=5`, čtyři jsou označeny 14 byty a poslední 12 byty, všechny mapové půdorysy na sebe dosedají. Nezavádíme odhadnuté další vchody, balkóny, parkoviště, stromy či jiné nepodložené detailní vybavení domů. Stejně tak zůstává beze změny původní souvislý východní **mapovaný dlážděný chodník `1316882852`** i západní **dlážděný chodník `1046197807`**.

### OSM značené přechody, nikoliv náhodné bílé čáry
- Armádní má dvě **explicitně jako zebra zakreslené pěší trasy**: **`1318462995`** západně od křižovatky s Tyršovou a **`1316882855`** východně směrem k Topolové. Obě mají `crossing:markings=zebra`, `crossing:island=yes` a střední uzel leží přímo na OSM ose příslušné části silnice `1331897681` a `1331897683`. Nově proto dostaly dvě sady **vizuálních bílých zebrových pruhů na existujícím asfaltu**; fyzicky **nepřidáváme ostrůvky ani kolize**.
- Geometrie pruhů je *modelový odhad*: každá zebra má **5 pruhů na každé straně** mapovaného ostrůvku, ten zůstává uprostřed **bez nátěru** (modelová mezera 1,8 m, skutečná šířka nezměřená). Přesný počet, šířky, opotřebení a aktuální rozmístění bílé barvy nebyly fotograficky/technicky změřeny; jejich existenci a typ `zebra` potvrzují mapové tagy. Pruhy nejsou zasahováním do originální mapy. Celkem **20 obdélníků, 40 trojúhelníků, jen 2 lehká WebGL mesh**.
- Další původní OSM cesta u Spojovací **`1044078125`** nese pouze `crossing:markings=yes`, nikoliv *konkrétní* typ zebra; proto ji automaticky nepřemalujeme jako zebra. Severně na Tyršově je `1278749453` dokonce výslovně `crossing=unmarked`, `crossing:markings=no`; ta zůstává **bez falešného přechodu**.
- Geometrii bílých 3D pruhů vytváří `scripts/osm-tyrsova-armadni-junction-5131.js` přesně na obou skutečných OSM liniích. Jejich střední uzly, směr křížení, konečné body a minimální rezerva od okraje celé existující vozovky se kontrolují ještě před renderováním. Dlažby, vozovky, 5 domů, chodníky a křižovatky zůstaly beze změny. Nenavrhuje se nový přechod; jde o vizualizaci **dvou již existujících a zmapovaných**.
- Systém stávajících kontrolních kamer má další dvě opakovatelné 3D technické pozice: na skutečném chodníku Tyršovy podél bytové řady a na severním konci mapované západní zebry. Souřadnice jsou OSM body, směr kamery je odhad. Žádná kamera není označena za exaktní místo fotografa.
- Městské veřejné materiály k [chodníku ul. Tyršova](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=18187&id_org=9519) a [veřejné zeleni Tyršova II](https://smlouvy.gov.cz/vyhledavani?all_versions=0&contr_num=&contract_descr=&contract_id=&do=searchResultList-setLimit&file_text=&searchResultList-limit=500) jsou doplňující kontext, **nikoliv důkaz přesné polohy jednotlivých vysazených stromů**; stromy se zde proto ještě bez konkrétního vizuálního podkladu negenerují.

### Testy a výkon
- `scripts/osm-tyrsova-armadni-junction-5131.test.mjs` používá uložená originální OSM data regionu Mladá a ověřuje spojitost skutečných úseků, 5 sousedících pětipodlažních domů, dva typované přechody, jejich asfalt, 40 fyzicky vykreslovaných trojúhelníků i zamítání nepodložených zásahů do označení.
- `window.__miloviceTyrsovaArmadniJunctionAudit` poskytuje přímé zdrojové důkazy a pozorované vs odhadnuté parametry; `window.__miloviceTyrsovaArmadniJunctionRuntime()` ověřuje **opravdu živé** WebGL mesh objekty a jejich viditelnost po automatickém LOD.
- Samostatný `scripts/osm-tyrsova-armadni-junction-webgl-5131.mjs` spouští mobilní Chromium na **správné mapové pozici Tyršovy**, čeká 6,8 s a kontroluje skutečné objekty a počty trojúhelníků. Starší mobilní kontrola Polikliniky navíc chrání její stávající 5.118–5.130 viditelné prvky včetně parkování, nápisu, stromků, kříže a značek.
- Statické testy, skutečný Chromium WebGL a GitHub Pages build je nutné ověřit podle konkrétních dokončených běhů Actions — nezaměňovat commit za potvrzení úspěšného nasazení.

---

## Milovice RP 5.130 — celá část Spojovací kolem Polikliniky až k severnímu přechodu (Part 26, 18. 11. 2026)

**Hra / ověřené odkazované kamery:**
- Poliklinika + nové značky a osvětlení: https://foxey-cz.github.io/milovice-life-rp/?v=513000&streetAudit=armadni-clinic-5118
- Tři mladé stromky z fotografie: https://foxey-cz.github.io/milovice-life-rp/?v=513000&streetAudit=clinic-verge-trees-5129
- **Skutečný mapovaný severní přechod přes Spojovací:** https://foxey-cz.github.io/milovice-life-rp/?v=513000&streetAudit=spojovaci-north-crossing-5130

### Co je fotograficky doložené a co OSM
- [SPADIA – exteriér Polikliniky](https://www.spadia.cz/verejnost/odberova-mista/praha-a-stredocesky-kraj/milovice/) zobrazuje v přední části budovy modrou značku `P` na sloupku. Neprokazuje její **přesný mapový bod**, ani právní vyhrazení či počet parkovacích míst. Nový 3D prvek je proto jen **piktogram P**, bez logiky parkování nebo vymyšlených zákazů.
- [Novější exteriér gynekologické kliniky](https://gynekologie-milovice.cz/) v objektu na Spojovací 873 ([přímý snímek zveřejněný v roce 2026](https://gynekologie-milovice.cz/uploads/20260401061151_poliklinika-milovice.jpg)) ukazuje rovněž vysoký **sloup s vyloženou hlavou veřejného osvětlení**. Ve hře přibyl jediný podobný vizuální sloup. Jeho modelová výška 5,8 m, typ hlavice a poloha jsou přiznanými odhady, **nikoliv geodetickým zaměřením** nebo údaji o počtu stožárů v celé ulici.
- Oproti fotografickým dekoracím jsou **polohy silnic a křižovatek přímo doložené skutečnými mapovými daty OSM**: Poliklinika `1057548624`, Spojovací `246652750` (`lit=yes`), vnější pěší cesta `1092081938`, vnitřní pěší cesta `1339091016`, **značený severní přechod `1044078125`** (`footway=crossing`, `crossing=marked`) a protější rozsáhlá **jednopodlažní komerční stavba `202380957`** (OSM `building=commercial`, `building:levels=1`). Komerční stavbu proto nesmíme v projektu pod vlivem fotografie vzdáleného bytového domu v pozadí zaměnit za výškový panelák. Zachován také mapovaný pozemek zeleně `1454936713`.
- Modul `scripts/osm-spojovaci-photo-street-furniture-5130.js` modeluje **2 skutečně fotograficky viděné typy objektů**, rozdělené do **5 lehkých WebGL meshů** (modrá P tabulka + sloupek; lampový sloup, rameno a hlavice). Aby se neocitly na cestách, přijímá *všechny* blízké mapované komunikace, stavby, chráněných 422 buněk dlažby a tři modelové stromky. Všechna umístění se zamítnou při kolizi nebo při změně potvrzených ID. Žádné nové kolize, silnice, chodníky, přechody, parkovací stání, stromy ani výšky existujících budov.
- Nová technická kamera v menu míří ze **skutečného východního konce severního přechodu OSM** na vozovku směrem k západu. Je to **mapový pohled, ne fotografická poloha fotografa**. Už existující přechod kreslený původním enginem se nenahrazuje druhou falešnou zebrou. Celá dosavadní ulice a okolní objekty přežívají i mobilní LOD.

### Ověření
- `scripts/osm-spojovaci-photo-street-furniture-5130.test.mjs` provádí přesné vazby na originální region Mladá, ověřuje komunikace/pěší trasy, zachovanou zeleň, komerční objekt s jedním podlažím, severní crossing, dvě fotovizuální zařízení a odmítnutí vymyšlených prvků.
- Audit: `window.__miloviceSpojovaciPhotoStreetAudit`; skutečná kontrola 3D: `window.__miloviceSpojovaciPhotoStreetRuntime()`. Mobilní `scripts/osm-clinic-parking-inlays-webgl-5125.mjs` navíc čeká 6,8 sekund po načtení a ověřuje viditelnost nových 5 meshů, předešlých stromů, nápisu LÉKÁRNA, dlažby a žlutého kříže.
- Jde o nahrání zdrojů na GitHub; úspěch statických testů, živého WebGL a nasazení GitHub Pages se musí potvrdit konkrétními dokončenými GitHub Actions běhy.

---

## Milovice RP 5.129 — tři fotograficky doložené stromky u Polikliniky (Part 26, 18. 11. 2026)

**Živá hra:** https://foxey-cz.github.io/milovice-life-rp/?v=512900

**Přímá kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=512900&streetAudit=armadni-clinic-5118

- **Fotografie a počet:** [RE/MAX — skutečný letecký/šikmý záběr na polikliniku Spojovací 873](https://www.remax-czech.cz/reality/detail/423323/pronajem-komercniho-prostoru-41-m2-milovice), [zdroj konkrétního snímku](https://mlsf.remax-czech.cz/data/zs/423323/3002119.jpg). Na popředí snímku je **řada tří mladých stromků v kruhových výsadbových plochách** před parkovacím prostranstvím. Počet 3 se vztahuje jen k této zřetelné řadě; **neznamená počet všech stromů na fotografii, celkový počet stromů v ulici ani survey výsadeb**.
- **OSM geometrie, nikoli domnělá GPS přesnost:** Poliklinika `way/1057548624`, východní fasáda edge 2 délky asi 44,86 m, Spojovací `way/246652750` (`lit=yes`), protější mapovaná pěší cesta `way/1092081938` a všechny místní OSM dopravní cesty/budovy v regionu Mladá. Tři modelové středy jsou ve vzdálenostech přibližně **-16, -4 a +8 m po fasádě**, všechny **25,2 m před fasádou** směrem k protějšímu chodníku. **Skutečné vzdálenosti, přesné souřadnice, druhy stromů, průměry korun i velikost výsadbových kruhů z fotografie nezjistíme.** Tyto parametry jsou přiznaně aproximované. Modul nikdy neschvaluje nové stromy na jiné ulici.
- **Dopravní bezpečnost:** `scripts/osm-clinic-photo-saplings-5129.js` přijme skutečné geometrie silnic, chodníků a budov. Kontroluje oba okraje polohy přes poloměr modelové koruny a dodatečnou rezervu 75 cm. Zamítne strom na existující vozovce, pěší cestě, stavebním půdorysu, fotograficky doložených dlažebních buňkách (5.123) nebo blízko jiného stromku. Nejmenší vypočtené odstupy se zveřejní v auditu. Odmítne i upravená či nepodložená OSM ID. Nenakreslí novou parcelu zeleně, parkoviště, komunikaci, plot ani jakékoli kolizní objekty.
- **Úsporné 3D:** 3 mladé stromy s tenkými kmeny a dvěma skromnými částmi listnaté koruny, plus 3 malé zemité kruhové výsadbové disky. **4 instancované materiálové/geometrické skupiny, celkem 12 instancí**, sdílené existující materiály kmene a koruny, pouze 1 nový jednoduchý zemní materiál. Vše je přímo v `osmLayer` a `photoFixtureLodProtected=true`, `lodDetail=false`, aby objekty **po mobilním 5sekundovém LOD nezmizely**. Dosavadní Poliklinika, SPADIA, lékárna, červené a žluté pruhy, komunikace a světla nejsou překreslované ani nahrazované.
- **Další bezpečnostní vazba:** odhadnutý sloup osvětlení z generátoru `lit=yes` nesmí stát do **2,65 m** od některého z těchto tří fotodoložených kmenů. To neudává skutečné místo přesunutého stožáru. Není přidána žádná vymyšlená fyzická lampa.
- **Testy a inspekce:** `scripts/osm-clinic-photo-saplings-5129.test.mjs` se opírá o uložené originální OSM Mladá, kontroluje řadu stromků, všechny cesty a budovy, zamítnutí konfliktní nové cesty, zachování zdrojů a správné přiznání aproximací. `window.__miloviceClinicPhotoSaplingsAudit` odděluje důkazy od odhadů; `window.__miloviceClinicPhotoSaplingsRuntime()` kontroluje 4 skutečné instancované 3D objekty a 12 instancí. Rozšířený mobilní Chromium/WebGL test kontroluje všechna tři stromová stanoviště a přetrvání všech starších lékárenských a dlažebních detailů po 6,8 sekundách. **Testy a deployment je nutno ověřit podle reálného výsledku GitHub Actions**.

---

## Milovice RP 5.128 — Spojovací: žádné odhadnuté lampy na fotograficky doloženém dláždění (Part 26, 18. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=512800

**Přímá 3D kamera na Polikliniku:** https://foxey-cz.github.io/milovice-life-rp/?v=512800&streetAudit=armadni-clinic-5118

- [Městská plánovací smlouva k Centru zdraví Milovice](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=3513&id_org=9519) potvrzuje projektovou přeložku kabelů veřejného osvětlení **včetně tří stožárů** u budoucího parkování a chodníku. Neobsahuje ale použitelné skutečné as-built souřadnice všech stožárů. Značka OSM `lit=yes` na skutečné Spojovací potvrzuje osvětlení **ulice**, ne polohy a počty samotných sloupů. Proto nevytváříme falešnou trojici přesně zaměřených lamp.
- Dosavadní plánovač `scripts/osm-street-lighting-5100.js` rozmisťuje vizuálně **odhadnuté** sloupy podle `lit=yes` a kontrol silnic/budov. Nový `scripts/osm-clinic-furniture-protection-5128.js` zavádí cílenou ochranu konkrétního skutečného areálu **way/1057548624**: vyloučí odhadnutý sloup pouze tehdy, pokud by ležel na existujících fotograficky doložených buňkách dlažby verze 5.123. Tato ochrana není plošnou výmazovou zónou pro všechny ulice Milovic, není geodeticky zaměřenou polohou skutečných lamp a nepřepisuje původní OSM `lit` data.
- **Přesné mapové vstupy:** východní fasáda Polikliniky edge 2 cca 44,86 m, Spojovací **way/246652750** (`residential`, `lit=yes`), pěší cesta **way/1339091016** (`footway`, `lit=yes`) a již existujících **422 modelových dlažebních buněk** o ploše asi 569,1 m², které byly oříznuty mimo skutečné jízdní koridory. Okrajové body buněk se převádějí do souřadnic fasády a přidává se pouze **55cm bezpečnostní modelový okraj**, ne nová změna povrchu nebo hranice parkoviště.
- V okolí je již uložen i **skutečný OSM travnatý polygon way/1454936713** západně od Polikliniky, který zůstává v existujícím vykreslování zeleně. **Nepřidáváme do něj nedoložené stromy, lampy, záhony ani lavičky**. Ve zdrojových uložených OSM prvcích okolo Polikliniky nebyly samostatně zaměřené body lamp nebo stromů. Veřejné mapové/úřední podklady navíc neopravňují k vymyšlení souřadnic sloupů, skříní nebo úprav zeleně.
- `window.__miloviceClinicFurnitureProtectionAudit` uvádí dokumentační zdroje, počty ochranných dlažebních buněk, počet odmítnutých kandidátů a zachovanou OSM geometrii. `window.__miloviceClinicFurnitureProtectionRuntime()` kontroluje skutečný plán pouličního osvětlení a všechny vypočtené polohy sloupů, které v ochráněné ploše nesmějí být; netvrdí tím, že jednotlivé fyzické stožáry jsou fotograficky změřené. **Nejsou přidány žádné nové objekty**, nové silnice, chodníky, trvalá parkovací místa ani kolize.
- Nový skutečný OSM regresní test `scripts/osm-clinic-furniture-protection-5128.test.mjs` ověřuje všech 422 ochranných buněk a odmítnutí změněných zdrojů. Rozšířený **mobilní Chromium/WebGL test** kontroluje, že do chráněné dlažby nezasahuje žádný plánovaný odhadnutý sloup, zároveň po 6,8 sekundách LOD zůstávají viditelné Poliklinika, LÉKÁRNA, tyrkysový vstup, světlé dláždění, červenohnědé pruhy i žluté křížové značení. O úspěchu nasazení a testů rozhodnou skutečné běhy GitHub Actions.

---

## Milovice RP 5.127 — Spojovací u Polikliniky: fotograficky doložený žlutý kříž na dlažbě (Part 26, 18. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=512700

**Přímá kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=512700&streetAudit=armadni-clinic-5118

- [SPADIA – reálný snímek přízemí Polikliniky](https://www.spadia.cz/verejnost/odberova-mista/praha-a-stredocesky-kraj/milovice/) viditelně ukazuje **žlutý kříž z diagonálních pruhů** na dlážděné ploše u tyrkysového vstupu. Přesné rozměry, konečné geodetické souřadnice ani právní význam tohoto značení z fotografie doložit nelze. Model **nevydává prvek za přesné oficiální vodorovné dopravní značení, zónu zákazu stání, vyhrazené místo nebo legální parkovací regulaci**.
- Modul `scripts/osm-clinic-yellow-cross-5127.js` se spustí jen na konkrétní budově **OSM way/1057548624**, autentické východní fasádě, ulici **Spojovací way/246652750** a pěší trase **way/1339091016**. Využívá původních **422 modelových dlažebních buněk verze 5.123**, které již byly oříznuty mimo okolní OSM jízdní trasy. Souřadnice žlutých linek jsou jen umělecká aproximace poblíž centra vstupního průčelí.
- **Bezpečnost okolní ulice:** obě diagonály se vzorkují po celé délce včetně jejich šířky, každá hranice se ověřuje vůči existující dlažbě, mapovaným vozovkám i pěší trase. Nezasahují do původní vozovky, chodníku ani nedávno doplněných červenohnědých parkovacích pruhů. Pokud se původní geometrie zdrojů změní, dekorace se nevytvoří.
- Celý motiv jsou **2 tenké žluté diagonály sdružené do jednoho WebGL meshe, 32 trojúhelníků a jednoho nového materiálu**. Nad dlažbou leží na vzorkovaném terénu DEM +0,120 m (dlažba +0,105 m, skutečné OSM pěší cesty +0,13 m), má vypnuté detailové LOD zmizení a **nevytváří žádný kolizní objekt, cestu, dopravní značku, přechod ani parkovací stání**.
- Test `scripts/osm-clinic-yellow-cross-5127.test.mjs` validuje originální OSM oblast Mladá, pruhy, krajní vzdálenosti a všechny nulové dopravní změny. Audit `window.__miloviceClinicPhotoYellowCrossAudit` odděluje doložený barevný vzor od odhadnuté pozice. Živá kontrola `window.__miloviceClinicPhotoYellowCrossRuntime()` ověřuje skutečnou scénu i zůstávající viditelnost po 5s mobilním LOD. Historické mobilní testy navíc hlídají, že nebyly poškozené Billa, vchod, výlohy, nápis LÉKÁRNA, světlá dlažba ani původní červenohnědé pruhy. Nasazení a úspěch WebGL ověří až GitHub Actions.

---

## Milovice RP 5.126 — Spojovací: zelený nápis LÉKÁRNA podle nové fotografie (Part 26, 18. 11. 2026)

**Aktuální hra:** https://foxey-cz.github.io/milovice-life-rp/?v=512600

**Přímá kontrolní kamera:** https://foxey-cz.github.io/milovice-life-rp/?v=512600&streetAudit=armadni-clinic-5118

- Na [novější veřejné fotografii RE/MAX](https://www.remax-czech.cz/reality/detail/423323/pronajem-komercniho-prostoru-41-m2-milovice) je na bílé přízemní fasádě Centra zdraví skutečně vidět zelené písmo **„LÉKÁRNA“**, vlevo (jižně) od hlavního tyrkysového vstupu při pohledu od ulice Spojovací. [LEMON je ověřeným provozovatelem lékárny na adrese Spojovací 873](https://www.lekarnalemon.cz/index.php/lekarny/lemon-lekarna-milovice-spojovaci-873), ale **na použité fotografii není doložen konkrétní značkový nápis LEMON**. Hra proto kreslí pouze viditelné obecné označení „LÉKÁRNA“.
- Nový modul `scripts/osm-clinic-pharmacy-sign-5126.js` se omezuje na **skutečný OSM půdorys way/1057548624**, jeho východní fasádu č. 2, dřívější čtyřpodlažní foto-massing, sedm přízemních výloh a existující tyrkysový vchod. Návrh používá **jižní přibližný modelový modul 1 z 8**, nikoli změřenou pozici provozovny nebo hranici skutečného nájemního prostoru. Poloha, velikost a výška písma jsou modelové přiblížení; relativní poloha nalevo od vchodu je odvozena z fotografie.
- Nápis vzniká jako **jeden malý WebGL plane** s vlastním textem na transparentní canvas textuře (nikdy jako kopie obrazových dat třetí strany). Je přidán přímo do téže 3D oblasti a chráněn před 5sekundovým mobilním LOD. Nepřibývají jiné značky, falešný vstup, obchod, parkoviště, nová cesta, zástavba ani kolizní objekt. Spojovací, Poliklinika, Billa, reálné OSM pěší trasy, parkovací pruhy 5.125 a světlá dlažba 5.123 zůstávají beze změny.
- Diagnostika `window.__miloviceClinicPhotoPharmacySignAudit` otevřeně rozlišuje ověřené písmo od odhadnutého modelového umístění. `window.__miloviceClinicPhotoPharmacySignRuntime()` kontroluje **skutečné připojení 3D objektu ke scéně a jeho viditelnost**. Nový statický test `scripts/osm-clinic-pharmacy-sign-5126.test.mjs` používá uložené OSM souřadnice; rozšířený mobilní Chromium/WebGL regresní test `scripts/osm-clinic-parking-inlays-webgl-5125.mjs` po 6,8 s současně kontroluje nápis, parkovací pruhy, prosklení, vstup i dlažbu. Výsledek GitHub Actions a Pages se potvrzuje až po jejich dokončení.
- Městská smlouva k původnímu záměru [uváděla 17 projektovaných veřejných stání a přeložky osvětlení/chodníku](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=3513&id_org=9519). Tento historický projektový počet **nepovažujeme za aktuální přesné geodetické rozložení**, a proto žádná nová parkovací stání podle něj nevznikají.

---

## Milovice RP 5.125 — Spojovací u Polikliniky: červenohnědé dlažební pruhy podle dokončených fotografií + dokumentace města (Part 25, 18. 11. 2026)

**Aktuální hra:** https://foxey-cz.github.io/milovice-life-rp/?v=512500

**Přímá kontrolní kamera na Polikliniku a parkovací prostranství:** https://foxey-cz.github.io/milovice-life-rp/?v=512500&streetAudit=armadni-clinic-5118

### Proč tato změna

- [ABP Holding — fotografie dokončené Polikliniky z projektu 2019–2023](https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice) ukazuje dlouhou světlou dlážděnou plochu s **úzkými červenohnědými pruhy mezi kolmo orientovanými vozidly**. To je ověřený **vizuální znak skutečného prostranství**. V modelu byla do 5.124 pouze světlá dlažba; fotku nenahráváme jako texturu.
- [Oficiální Dopravně inženýrská opatření Milovice, srpen 2022 (PDF)](https://ud.mestolysa.cz/vr2022/vm09/MULL0B019BZD_0/MULL0B019C01/DIO_sing.pdf) výslovně uvádějí výstavbu **kolmých parkovacích stání a chodníku ve Spojovací** u Centra zdraví. Jde o podklad k výstavbě a dopravnímu omezení, nikoli přesnou zaměřenou evidenci konečného počtu a hranic jednotlivých stání; finální realitu potvrzuje samostatná pozdější fotografie ABP.
- Nový nezávislý modul `scripts/osm-clinic-parking-inlays-5125.js` pracuje **výhradně** s již mapovaným půdorysem Polikliniky OSM **1057548624**, východní fasádou, Spojovací OSM **246652750**, pěší cestou OSM **1339091016**, okolními OSM jízdními cestami a s **422 modelovými dlažebními buňkami** verze 5.123.
- Původně navržené pruhy se ověřují proti hranám existující světlé dlažby a vzdálenosti od okolních příjezdů i pěší cesty. Ve skutečném OSM rozložení zůstalo **jen 6 vizuálně bezpečných modelových pruhů** a **8 kandidátních pruhů je odmítnuto**, aby se nekreslily přes jiné komunikace. **Šest tedy neznamená skutečný počet parkovacích míst.** Jejich modelová šířka cca 10,5 cm, délka a pravidelné rozestupy jsou **přibližné** — neexistuje dokumentované zaměření každé červené linky.
- Geometrie všech pruhů je spojena do **jediného triangulovaného 3D meshe, jediného nového sdíleného materiálu** v podobném cihlově červeném odstínu a vzorkuje stávající DEM (+0,117 m, nad dlažbou DEM +0,105 m, pod chodníkem +0,13 m a vozovkou +0,17 m). Detail má explicitně vypnutý LOD pro zmizení objektů po 5 s. Nezakládají se skutečné parkovací objekty pro auta, nová síť cest, bariéry, dopravní značka P, žádná vymyšlená zebra ani neověřená vyhrazená stání.
- Audit `window.__miloviceClinicParkingInlaysAudit` zveřejňuje počet modelových pruhů, výslovně neznámý reálný počet stání, odmítnuté kandidáty, zdroje fotografie/projektu, změny silniční sítě 0 a DEM. `window.__miloviceClinicParkingInlaysRuntime()` se dívá na **reálně připojený a viditelný WebGL mesh**, ne jen na počítadlo ve skriptu.
- Nový statický OSM test `scripts/osm-clinic-parking-inlays-5125.test.mjs` ověřuje geometrické zdroje, očekávaná omezení a nepřítomnost neověřených dopravních prvků. Mobilní Playwright `scripts/osm-clinic-parking-inlays-webgl-5125.mjs` ověřuje finální výsledek **po 6,8 sekundách LOD** vedle starší fotografické fasády, zasklení a chodníku. Oprávněnost tvrzení o WebGL úspěchu se potvrzuje až výsledkem GitHub Actions.

---

## Milovice RP 5.124 — Spojovací 873: celá řada přízemních prosklených výloh a ověřené provozovny (Part 25, 18. 11. 2026)

**Aktuální hra:** https://foxey-cz.github.io/milovice-life-rp/?v=512400

**Kontrolní kamera na Polikliniku:** https://foxey-cz.github.io/milovice-life-rp/?v=512400&streetAudit=armadni-clinic-5118

### Co je ověřené a co je modelový odhad

- **Dvě veřejné fotografie dokončeného objektu** potvrzují dlouhou bílou fasádu, tyrkysová horní meziokenní pole, a hlavně **přízemní skleněné komerční moduly s úzkými světlými kovovými příčkami sahající až k chodníku**: [ABP Holding — po dokončení 2019–2023](https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice), [SPADIA — novější reálná fotografie vstupu a parkovacího zálivu](https://www.spadia.cz/verejnost/odberova-mista/praha-a-stredocesky-kraj/milovice/). Starý model měl na této skutečné východní fasádě 7 přízemních skel začínajících asi 42 cm nad základem; to neodpovídalo exteriérům.
- Pro přesné místo je potvrzen **OSM way/1057548624**, východní edge 2, délka cca **44,86 m**, historicky zavedený rastr **8 fasádních polí**. V 5.124 jeden již fotograficky doložený přibližný **hlavní vstup s tyrkysovou stříškou** zůstává, **zbylých 7 přízemních polí** je nově originálně modelováno jako skleněné plochy od výšky DEM+8 cm k přízemnímu nadpraží. Každé pole má **4 svislé a 3 vodorovné** úzké profily. Rozměry a počet příček jsou **aproximace fotografické podoby**, ne geodetický počet skleněných tabulí.
- Zůstávají **3 horní řady × 8 prosklených polí = 24 oken**, 24 tyrkysových meziokenních panelů, skutečné 4 rohů půdorysu a 4 fotograficky doložená podlaží. Společná textura a instanční boxy šetří výkon: pouze **2 nové materiály** `clinicShopGlass`, `clinicShopFrame`. Na rozdíl od mnoha běžných detailů 3D modelů dostávají tyto dvě skupiny ochranu před ztrátou viditelnosti po mobilním LOD přepnutí.
- **Provozovny potvrzené na adrese, ale bez předstírání přesné polohy nájemních jednotek:** [Lékárna LEMON na Spojovací 873 — oficiální provozovatel](https://www.lekarnalemon.cz/index.php/lekarny/lemon-lekarna-milovice-spojovaci-873), [potvrzení České lékárnické komory](https://lekarnici.cz/lekarna/lemon-spojovaci-873-milovice/) a [SPADIA, odběrové místo](https://www.spadia.cz/verejnost/odberova-mista/praha-a-stredocesky-kraj/milovice/). V rozbalené informační sekci přímé technické herní kamery jsou obě uvedeny s odkazy. **Nenakreslili jsme fyzický nápis LEMON na náhodné výloze**, protože na dostupných fotografiích nebylo potvrzeno, která konkrétní výloha lékárně náleží. Nespekulujeme o dalších vchodech, počtech lékařských ordinací na fasádě, o nových parkovacích čarách ani o silnici.
- Zdrojový modul `scripts/osm-clinic-storefronts-5124.js` odmítne jinou budovu či orientaci fasády, nesprávné patro, geometrii, stávající vstup nebo předchozí fotograficky schválený model. `window.__miloviceClinicShopfrontAudit` dokumentuje transparentně neznámou polohu lékárny, sedm nahrazených původních přízemních oken, skutečnou výšku zasazení a nové sdílené instance; `window.__miloviceClinicShopfrontRuntime()` kontroluje na živé scéně sedm skleněných ploch a 49 rámových prvků.
- Přidaný statický test `scripts/osm-clinic-storefronts-5124.test.mjs` se spouští v `validate.yml`. Reálný mobilní Chromium/WebGL smoke `scripts/osm-clinic-storefronts-webgl-5124.mjs` ověřuje po **6,8 sekundách** skutečnou přítomnost a viditelnost, navíc zajišťuje, že nepřestala fungovat předešlá tyrkysová vstupní stříška, nádvoří a kompaktní menu na mobilu. Úspěšné nasazení či WebGL je nutné potvrdit výsledkem Actions, ne jen existencí kódu.

---

## Milovice RP 5.123 — Spojovací 873: celé fotograficky doložené dlážděné prostranství před Poliklinikou (Part 25, 18. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=512300

**Kontrolní kamera směrem na Polikliniku:** https://foxey-cz.github.io/milovice-life-rp/?v=512300&streetAudit=armadni-clinic-5118

**Co je doloženo fotograficky:** 2023 dokončené exteriéry [ABP Holding](https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice), novější foto [RE/MAX – Centrum zdraví](https://www.remax-czech.cz/reality/detail/423323/pronajem-komercniho-prostoru-41-m2-milovice) a [foto gynekologie 2026](https://gynekologie-milovice.cz/) ukazují velkou pale-šedou dlážděnou plochu před jižní až severní částí dlouhé fasády Polikliniky, s parkováním a pěšími trasami. Nezobrazujeme všechny její fotografie jako texturu a nepředstíráme, že snímky poskytují souřadnice jednotlivých parkovacích míst.

- Ve starých verzích byla hlavní čtyřpodlažní Poliklinika na správném skutečném půdorysu, ale podél celého objektu chyběl samostatný souvislý světlý povrch dokončeného předprostoru. Verze **5.123** doplňuje **jeden terrain/DEM-following 3D mesh se stávající sdílenou texturou městských dlažebních kostek**, nikoli opakované improvizované čtverce, nové vozovky nebo odhady parkovacích míst. Povrch se generuje pouze pro jedinou budovu, OSM **way/1057548624**, její skutečnou východní stěnu edge 2 o cca 44,86 m; pro omezení hloubky vůči veřejné komunikaci vyžaduje skutečnou Spojovací **way/246652750** a souběžný pěší úsek **way/1339091016**.
- **Bezpečnost původní geometrie:** modul `scripts/osm-clinic-forecourt-5123.js` kontroluje orientaci fasády, mapovanou plochu cca 827,58 m², odsazení mapované pěší cesty a komunikace a OSM šířku silnice. Rozložení nízkých polygonů je **jen modelová aproximace rozsahu dlážděného nádvoří**, nikoliv zaměřená parcela. Každá malá dlaždicová buněčná plocha se kontroluje proti reálným okolním OSM jízdním pásům, odmítne průnik do budovy a zachová minimální odstup od modelového okraje vozovky. Mřížka určuje jen hustotu triangulace, **ne fyzické formáty dlažby**.
- Plocha leží **na DEM + 0,105 m** a zůstává opticky pod původní mapovanou `highway=footway` (DEM + 0,13 m) a mapovanými komunikacemi (DEM + 0,17 m). OSM pěší trasy a silnice se nepřesouvají ani nepřidávají, žádná křižovatka nepřichází o skutečný přechod. Parkovací čáry, individuální počet a místa stání, příjezdová ramena, inventovaný záhon, lampy a náhodná auta **nejsou přidány**; jejich případné modelování vyžaduje přesnější zdrojové zaměření.
- Sledování `window.__miloviceClinicForecourtAudit` ukazuje zdrojové OSM identifikátory, plochu modelu, skutečný počet trojúhelníků, přibližný nejmenší odstup od komunikace a počet odhozených buněk. `window.__miloviceClinicForecourtRuntime()` kontroluje skutečný 3D objekt připojený ke scéně a jeho **viditelnost po automatickém mobilním LOD**.
- Statická validace `scripts/osm-clinic-forecourt-5123.test.mjs` používá originální JSON s OSM geometrií a testuje nulové parkovací spekulace. Test `scripts/osm-clinic-forecourt-webgl-5123.mjs` používá skutečné mobilní Chromium/WebGL a vyhodnocuje povrch **po 6,8 sekundách**, ukládá screenshot do GitHub Actions. Existence kódu sama ještě nedokazuje, že WebGL běží; ověřujte až po dokončení CI.

---

## Milovice RP 5.122 — zásadní oprava skutečného čtyřrohého půdorysu Polikliniky (Part 25, 17. 11. 2026)

**Aktuální hra:** https://foxey-cz.github.io/milovice-life-rp/?v=512200

**Přímý herní pohled na Polikliniku:** https://foxey-cz.github.io/milovice-life-rp/?v=512200&streetAudit=armadni-clinic-5118

- **Skutečně zjištěná chyba při mobilním Chromium/WebGL 5.121:** oblast `mlada` se načetla a technická kamera `armadni-clinic-5118` běžela, ale `window.__miloviceArmLandmarksAudit.mappedFourStoreyClinics` zůstávalo **0**. Nešlo o domnělé vynechání starým OSM exportem; kontrola `data/milovice-osm.json` potvrdila, že starý export **Polikliniku 1057548624 vůbec neobsahuje**. Skutečný problém byl v `scripts/osm-armadni-landmarks-5118.js`: plánovač vyžadoval **alespoň pět vstupních bodů**, přestože reálný `osmBuilding()` odstraňuje závěrečný bod polygonu identický s prvním. Poliklinika má po tomto správném odstranění jen **4 různé rohy**; Billa má **6** a proto dříve fungovala.
- Nově se akceptuje otevřený i uzavřený OSM polygon, ovšem striktní kontrola **přesně 4 skutečných rohů** pro Polikliniku a **6 pro Billu** i původních mapovaných ploch zůstává. Není dovoleno změnit výšku a tvar budov podle neověřených dat; pouze se přestane odmítat skutečný čtyřrohý půdorys při správném běhu hry.
- Opravena cache verze imporu plánovače na `?v=512200`; aktualizovány build ID, HUD a kontrolní kamerové odkazy. Nový test `scripts/osm-armadni-open-polygons-5122.test.mjs` čte skutečné mapové údaje a kontroluje **shodu otevřených a uzavřených polygonů** na obou budovách, odmítá poškozenou geometrii a ověřuje skutečnou integraci v `index.html`. Je součástí automatické validace; mobilní běh zůstává samostatně ověřován screenshotem a instancemi ve scéně.
- Předchozí 5.121 již obsahuje fotograficky odvozený prosklený vstup a tyrkysový přístřešek, ale jeho prvky nebylo možné vidět, dokud nedošlo k opravě základního hmotového modelu Polikliniky. **V žádné části oprav nejsou přidána nedoložená parkovací stání, nová silnice, budova ani chodník.**

---

## Milovice RP 5.121 — Poliklinika Spojovací: zdrojově doložený prosklený vstup a tyrkysová stříška (Part 25, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=512100

**Přímá technická kamera ze skutečné Spojovací:** https://foxey-cz.github.io/milovice-life-rp/?v=512100&streetAudit=armadni-clinic-5118

- **Fotografické zdroje:** [ABP Holding – Polyclinic building Milovice, dokončeno 2023](https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice) a [RE/MAX – prostor v Centru zdraví Milovice](https://www.remax-czech.cz/reality/detail/423323/pronajem-komercniho-prostoru-41-m2-milovice). Na dokončených exteriérových fotografiích jsou na bílé čtyřpodlažní fasádě tyrkysové meziokenní výplně, **prosklené přízemní vstupy a nízká tyrkysová stříška nad jedním výrazným vstupem**. Fotografie dokazují podobu, ne přesnou geodetickou polohu každého vchodu.
- Verze 5.118 již kreslila 8 okenních modulů × 4 úrovně, ale **přízemí bylo pouze jednotná řada skel bez rozlišení hlavního vstupu**. V 5.121 jedna odhadnutá centrální pozice v dosavadním rastru přechází na **prosklený vstup s bílými štíhlými rámy a nízkou tyrkysovou stříškou**, použitím jen tří nových sdílených materiálů `clinicEntryGlass`, `clinicEntryFrame` a `clinicEntryCanopy`. Vchod je zatím **modelový vzhled na existující plné stěně, nikoli skutečně průchozí dveřní otvor**. Přesná poloha vybraného modulu, rozměry a tvar stříšky nejsou změřené. Ostatní okna/panely a zadní neověřené fasády zůstávají nedotčené.
- Nový samostatný ověřovač `scripts/osm-armadni-clinic-entry-5121.js` vyžaduje **skutečný OSM way/1057548624, 4-hranný půdorys o ~827,58 m², východní fasádu edge 2 o ~44,86 m, 4 fotodoložená podlaží, skutečnou ulici Spojovací way/246652750 a odpovídající orientaci ulice před objektem**. Jakýkoliv odlišný/chráněný objekt odmítne. Pro výšku dveří se používá existující `planGroundedEntrance` s přístupovou výškou podle DEM a nízkým vizuálním prahem místo dveří visících nad chodníkem.
- **Nejsou vytvořené žádné parkovací polygonové plochy, vodorovné značení, nové přechody ani propojení mezi známými chodníky**. Skutečná parkovací stání na fotografiích sice existují, ale samotná fotografie nestačí k bezpečnému vyměření jejich jednotlivých obrysů. OSM silnice, chodníky a obě budovy Billa a Poliklinika zůstávají beze změny.
- Výsledné instancované skupiny jsou u tohoto jediného fotoověřeného vstupu chráněné před 5s mobilním LOD zmizením; zbytek standardních oken si zachová běžný LOD. `window.__miloviceClinicEntranceAudit` uvádí původ, nejistoty a výšku přístupu; `window.__miloviceClinicEntranceRuntime()` ověřuje skutečný počet instancovaných a viditelných objektů ve scéně. Statický test `scripts/osm-armadni-clinic-entry-5121.test.mjs` kontroluje původní OSM a ochrany, nově přidaný mobilní Chromium/WebGL test `scripts/osm-armadni-clinic-entry-webgl-5121.mjs` kontroluje viditelnost po **6,8 s** a ukládá snímek. Úspěch GitHub Actions je nutné ověřit po dokončení běhu, nestačí samotné uložení zdrojového kódu.

---

## Milovice RP 5.120 — Armádní: zastřešené nákupní vozíky u skutečné Billy (Part 25, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=512000

**Přímá kamera z OSM servisní komunikace k Billy:** https://foxey-cz.github.io/milovice-life-rp/?v=512000&streetAudit=armadni-billa-5118

- **Zdroj přímé veřejné fotografie:** [Firmy.cz – BILLA, Armádní 874, Milovice](https://www.firmy.cz/detail/13214923-billa-milovice-mlada.html). Na fotografii je **na levé straně od vstupu krytý stojan s řadou nákupních vozíků**, vedle skutečné tmavé vstupní stříšky a žlutého střešního nápisu. Model proto doplňuje malou lehkou střechu s nenápadnými kovovými stojkami a **šesti nízkopolygonovými modelovými vozíky**. Počet vozíků, rozměry, oblouk střechy a přesná pozice **nejsou fotograficky/geodeticky změřené**.
- Umístění není náhodné. Nový plánovač `scripts/osm-armadni-trolleys-5120.js` vyžaduje konkrétní **skutečný OSM polygon Billy way/53865798**, její západní zapuštěnou skutečnou stěnu index 4, mapovaný příjezd **way/1057548615** a jeho šířku 4,5 m v současném rendereru. Konkrétní model odhadem volí severní konec této stěny (vlevo v pohledu od příjezdu) a **kontroluje, zda všechny rohy krytu leží mimo půdorys budovy a mimo průjezdný pás mapované silnice**. Pokud zdrojové podmínky nesedí, nic nepřidá. Nenapojuje žádný nový chodník.
- Výkres obsahuje jen **3 střešní pásy, 2 stojky a 6 zjednodušených vozíků** sestavených ze sdílených `THREE.InstancedMesh` materiálových skupin `billaCartRoof`, `billaCartFrame`, `billaCartHandle`, `billaCartWheel`. Nejsou to desítky samostatných kreslicích volání. Tyto čtyři malé skupiny jsou cíleně chráněné před detailovým LOD, aby kryt a vozíky **nezmizely po několika sekundách**; vzdálenější fasády zůstávají optimalizované původním způsobem.
- **Všechny skutečné OSM budovy, cesty, šířky vozovek a pěší trasy zůstávají beze změny**, stejně jako Poliklinika, její čtyřpodlažní fotomodel, předchozí technické kamery a mapované křižovatky. Fotografie Polikliniky [ABP Holding, dokončeno 2023](https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice) dokládá vydlážděné prostranství s parkováním. Protože však v současných uložených mapových datech **nemáme spolehlivý přesný plošný obrys těchto stání**, nový render zatím nepřidává odhadnuté parkovací polygonové pruhy ani nová stání.
- Kontrola `window.__miloviceBillaTrolleyAudit` zveřejňuje skutečná zdrojová ID, odstup od mapované komunikace a odhadované rozměry. `window.__miloviceBillaTrolleyRuntime()` zjišťuje **skutečné připojené instancované objekty a jejich aktuální LOD viditelnost** (ne pouze plánované funkční volání). JS test `scripts/osm-armadni-trolleys-5120.test.mjs` čte skutečné uložené OSM exporty; `scripts/osm-armadni-trolleys-webgl-5120.mjs` zkouší reálné mobilní Chromium/WebGL **až po 6,5 sekundách** a případně uloží kontrolní screenshot. Výsledky CI a nasazení GitHub Pages je nutné ověřit v GitHub Actions, nikoli jen z existence kódu.

---

## Milovice RP 5.119 — BILLA Armádní: fotograficky věrnější střešní nápis a jedna stříška (Part 25, 17. 11. 2026)

**Hra:** https://foxey-cz.github.io/milovice-life-rp/?v=511900

**Přímá kontrolní kamera (beze změny souřadnic z 5.118):** https://foxey-cz.github.io/milovice-life-rp/?v=511900&streetAudit=armadni-billa-5118

- **Doloženo fotografií:** skutečný vstup Billy na [Firmy.cz, Armádní 874](https://www.firmy.cz/detail/13214923-billa-milovice-mlada.html) má nad šedou fasádou velká samostatná **žlutá písmena BILLA**, ne **červená písmena na souvislé žluté reklamní desce**, jak vykresloval generický canvas ve verzi 5.118. Na fotografii je také **jedna dominantní tmavá vstupní stříška**.
- Úprava 5.119 vykresluje žluté písmo do **průhledného CanvasTexture**, bez krycího reklamního obdélníku. U této jediné Billy už nepřidává druhou generickou stříšku ani nepodložený barevný fasádní pás přes již fotograficky modelovaný vstup. Žlutý střešní nápis je pouze **jeden malý 3D objekt**, který není označen k odstranění běžným dálkovým detail LOD; zachováváme šetrné dávkování hlavní architektury. Přesné rozměry a uchycení jednotlivých písmen nejsou změřené.
- Stávající **skutečný OSM půdorys way/53865798** a doložená vstupní vnitřní hrana, okolní komunikace, chodníky, parkování i budova **Polikliniky way/1057548624** zůstávají beze změny. Nepřidáváme nevyměřená parkovací místa, stojany košíků nebo další cesty. Stejné technické kamery Billa/Poliklinika z 5.118 zůstaly dostupné; aktualizované jsou odkazy a viditelný build 5.119.
- Diagnostika **`window.__miloviceBillaSignAudit`** zaznamenává použitý veřejný fotozdroj, žlutý nápis, průhlednost, počet zamýšlených stříšek a ochranu před LOD. Jsou to **deklarace renderovací logiky**, nikoliv dokázaný skutečný pixelový výstup.
- Nový regresní test `scripts/osm-armadni-photo-sign-5119.test.mjs` kontroluje skutečné OSM ID a tagy, ochranu Polikliniky a původního umístění Billy, verzi/build, odkazy, průhledný canvas a jedinou stříšku. Přidán do `.github/workflows/validate.yml`. Testy GitHub Actions a běh Android/Chromium/WebGL se potvrzují **až jejich skutečným výsledkem**; pouhé uložení commitu není potvrzení úspěchu.

---

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
